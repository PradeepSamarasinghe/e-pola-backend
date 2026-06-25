const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Store = require("../models/Store");
const { getDistance } = require("geolib");
const { sendOrderStatusNotification } = require("./notificationController");

exports.createOrder = async (req, res, next) => {
  try {
    const { items, total, delivery_address, payment_method } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: "Order items cannot be empty" });
    }

    const orderItems = [];
    let orderStoreId = null;

    for (const item of items) {
      const product = await Product.findById(item.product_id);

      if (!product) {
        return res.status(400).json({ success: false, error: `Product ${item.product_id} not found` });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ success: false, error: `Insufficient stock for ${product.name}` });
      }

      // Enforce single store checkout
      if (!orderStoreId) {
        orderStoreId = product.storeId;
      } else if (orderStoreId.toString() !== product.storeId.toString()) {
        return res.status(400).json({ success: false, error: "All items in a single order must belong to the same store" });
      }

      product.stockQuantity -= item.quantity;
      await product.save();

      orderItems.push({
        productId: product._id,
        variantId: item.variant_id, // can be undefined
        quantity: item.quantity,
        priceAtPurchase: item.price_lkr || product.price
      });
    }

    const order = await Order.create({
      userId: req.user.id,
      storeId: orderStoreId,
      items: orderItems,
      totalValue: total,
      paymentType: payment_method,
      deliveryAddress: { street: delivery_address }, // Simple string to object mapping based on schema
      fulfillmentStatus: 'pending'
    });

    // Clear user cart
    await User.findByIdAndUpdate(req.user.id, { cart: [] });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getOrdersByUser = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_mock");

exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'lkr' } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents/smallest currency unit
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

exports.deliveryWebhook = async (req, res, next) => {
  try {
    const { trackingId, status, driverLocation } = req.body;

    // Find the order by the third party tracking ID
    const order = await Order.findOne({ "thirdPartyDelivery.trackingId": trackingId });
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // Map third party status to our fulfillment status
    if (status === 'PICKED_UP') {
      order.fulfillmentStatus = 'out_for_delivery';
    } else if (status === 'DELIVERED') {
      order.fulfillmentStatus = 'delivered';
    }

    await order.save();

    const user = await User.findById(order.userId);
    if (user) {
      await sendOrderStatusNotification(user, order);
    }

    // Here we could emit a Socket.io event to the customer app to show driverLocation

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.calculateDeliveryFee = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: "Latitude and longitude required" });
    }

    // In a real multi-vendor setup, we'd calculate distance to the specific store.
    // For now, we assume a single central store or find the nearest store.
    const store = await Store.findOne();
    if (!store) {
      return res.status(404).json({ success: false, error: "No stores found" });
    }

    const storeCoords = store.location.coordinates; // [lng, lat]
    
    const distanceMeters = getDistance(
      { latitude: parseFloat(lat), longitude: parseFloat(lng) },
      { latitude: storeCoords[1], longitude: storeCoords[0] }
    );

    const distanceKm = distanceMeters / 1000;
    
    // Example logic: Base fee 150 LKR + 50 LKR per km
    const fee = 150 + (distanceKm * 50);

    res.json({
      success: true,
      distanceKm: distanceKm.toFixed(2),
      fee: Math.round(fee)
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    // ensure user owns it
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized to view this order" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.getVendorOrders = async (req, res, next) => {
  try {
    const store = await Store.findOne({ vendorId: req.user.id });
    if (!store) {
      return res.status(404).json({ success: false, error: "Store not found for this vendor" });
    }

    const orders = await Order.find({ storeId: store._id })
      .populate('userId', 'name phoneNumber')
      .populate('items.productId', 'name image_url')
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const store = await Store.findOne({ vendorId: req.user.id });
    if (!store) {
      return res.status(404).json({ success: false, error: "Store not found for this vendor" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    if (order.storeId.toString() !== store._id.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized to update this order" });
    }

    order.fulfillmentStatus = status;
    await order.save();

    // Notify customer
    const user = await User.findById(order.userId);
    if (user) {
      await sendOrderStatusNotification(user, order);
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};
