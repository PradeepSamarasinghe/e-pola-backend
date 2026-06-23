const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },
  colorTheme: { type: String },
  itemCount: { type: Number, default: 0 },
  isNew: { type: Boolean, default: false }
}, { timestamps: true, suppressReservedKeysWarning: true });

module.exports = mongoose.model("Category", categorySchema);
