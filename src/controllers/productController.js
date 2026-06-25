const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Store = require("../models/Store");

exports.getProducts = async (req, res) => {
  try {
    const { category, search, storeId, quick_pick } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (storeId) filter.storeId = storeId;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (quick_pick === 'true') filter.is_quick_pick = true;

    const products = await Product.find(filter).populate("category").sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductVariants = async (req, res, next) => {
  try {
    const variants = await ProductVariant.find({ productId: req.params.id }).sort({ sortOrder: 1 });
    res.json(variants);
  } catch (err) {
    next(err);
  }
};

exports.getProductVariants = async (req, res) => { try { const product = await Product.findById(req.params.id); if (!product) return res.status(404).json({ message: 'Not found' }); res.json(product.variants || []); } catch (err) { res.status(500).json({ message: err.message }); } };

exports.createProduct = async (req, res) => {
  try {
    // 1. Find the store associated with this vendor
    const store = await Store.findOne({ vendorId: req.user._id });
    if (!store) {
      return res.status(400).json({ message: "No store found for this vendor. Please create a store first." });
    }

    // 2. Create the product and link it to the store
    const productData = {
      ...req.body,
      storeId: store._id,
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVendorProducts = async (req, res) => {
  try {
    const store = await Store.findOne({ vendorId: req.user._id });
    if (!store) {
      return res.json([]); // No store, no products
    }
    const products = await Product.find({ storeId: store._id }).populate("category").sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const store = await Store.findOne({ vendorId: req.user._id });
    if (!store) return res.status(403).json({ message: "No store found" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.storeId.toString() !== store._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to update this product" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const store = await Store.findOne({ vendorId: req.user._id });
    if (!store) return res.status(403).json({ message: "No store found" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.storeId.toString() !== store._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to delete this product" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
