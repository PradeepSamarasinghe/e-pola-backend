const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant' },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  items: [orderItemSchema],
  totalValue: { type: Number, required: true },
  paymentType: { type: String, enum: ['cash_on_delivery', 'card'], default: 'cash_on_delivery' },
  fulfillmentStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  thirdPartyDelivery: {
    providerName: String,
    trackingId: String,
    trackingUrl: String,
    estimatedDeliveryTime: Date
  },
  scheduledDeliveryTime: Date,
  paymentIntentId: String
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
