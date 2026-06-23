const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp } = require("../controllers/authController");

router.post("/otp/send", sendOtp);
router.post("/otp/verify", verifyOtp);
router.put("/push-token", require("../middleware/auth"), require("../controllers/authController").updatePushToken);

module.exports = router;
