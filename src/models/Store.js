const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  iconUrl: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  deliveryTimeEstimate: { type: String },
  tags: [{ type: String }],
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending' }
}, { timestamps: true });

storeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Store", storeSchema);
