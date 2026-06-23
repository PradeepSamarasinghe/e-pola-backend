const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  priceLkr: { type: Number, required: true },
  weightLabel: { type: String },
  isDefault: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("ProductVariant", productVariantSchema);
