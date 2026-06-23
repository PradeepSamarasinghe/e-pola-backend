const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  sku: { type: String, required: false, unique: true, sparse: true },
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  price: { type: Number, required: true },
  image: String,
  description: String,
  nutritionalData: {
    activeTime: Number,
    totalTime: Number,
    servings: Number,
    calories: Number,
  },
  dietaryTags: [{ type: String }],
  brand: { type: String },
  discountPercent: { type: Number, default: 0 },
  stockQuantity: { type: Number, default: 0 },
  lockedUntil: { type: Date },
  variants: [{
    name: String,
    price_lkr: Number,
    sort_order: Number,
    weight_label: String,
    is_default: Boolean
  }]
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
