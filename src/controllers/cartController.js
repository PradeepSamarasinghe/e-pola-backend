const Cart = require("../models/Cart");

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user ? (req.user.id || req.user._id || req.user) : req.userId;
    let cart = await Cart.findOne({ userId }).populate('items.productId').populate('items.variantId');
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    // Return array of items to match previous behavior if needed, or the cart object. 
    // The previous frontend might expect an array. Let's return cart.items.
    res.json(cart.items);
  } catch (error) {
    next(error);
  }
};

exports.syncCart = async (req, res, next) => {
  try {
    const { cart } = req.body;
    const userId = req.user ? (req.user.id || req.user._id || req.user) : req.userId;

    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
      userCart = new Cart({ userId, items: cart || [] });
    } else {
      userCart.items = cart || [];
    }

    await userCart.save();
    res.json(userCart.items);
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, variantId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({ success: false, error: "Please provide productId and quantity" });
    }

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId && 
      (item.variantId ? item.variantId.toString() === variantId : !variantId)
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, variantId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ success: false, error: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, error: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ success: false, error: "Cart not found" });

    cart.items.pull({ _id: itemId });
    await cart.save();

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
