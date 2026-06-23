const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: "Please provide a phone number" });
    }

    const phoneRegex = /^\+94\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, error: "Phone number must be in Sri Lankan format (e.g. +94771234567)" });
    }

    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let user = await User.findOne({ phoneNumber: phone });
    
    if (user) {
      user.otpCode = otpCode;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
    } else {
      user = await User.create({
        phoneNumber: phone,
        otpCode,
        otpExpiresAt
      });
    }

    // Dev-mode fallback
    console.log(`[DEV MODE] OTP for ${phone} is ${otpCode}`);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ success: false, error: "Please provide phone and code" });
    }

    const user = await User.findOne({ phoneNumber: phone });

    if (!user || user.otpCode !== code || user.otpExpiresAt < new Date()) {
      return res.status(401).json({ success: false, error: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_secret_here', {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    });

    res.json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

exports.updatePushToken = async (req, res, next) => {
  try {
    const { pushToken } = req.body;
    if (!pushToken) {
      return res.status(400).json({ success: false, error: "Please provide a pushToken" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    user.expoPushToken = pushToken;
    await user.save();

    res.json({ success: true, message: "Push token updated" });
  } catch (error) {
    next(error);
  }
};
