const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  phone: String,
  phoneNumber: String,
  email: String,
  expoPushToken: String,
  otpCode: String,
  otpExpiresAt: Date,
  role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
  addresses: [{
    label: String, // e.g., 'Home', 'Work'
    houseNumber: String,
    street: String,
    city: String,
    postalCode: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] } // [longitude, latitude]
    }
  }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [{
    product_id: String,
    variant_id: String,
    quantity: Number
  }]
}, { timestamps: true });
module.exports = mongoose.model("User", userSchema);
