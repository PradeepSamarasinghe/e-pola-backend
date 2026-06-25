const express = require("express");
const router = express.Router();
const { createOrder, getOrdersByUser, calculateDeliveryFee, getOrderById, getVendorOrders, updateOrderStatus } = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Note: Ensure auth middleware is used correctly depending on whether it's user or vendor
router.get("/calculate-delivery-fee", calculateDeliveryFee);

// Vendor routes
router.get("/vendor", protect, authorize('vendor', 'admin'), getVendorOrders);
router.put("/:id/status", protect, authorize('vendor', 'admin'), updateOrderStatus);

// Customer routes
router.get("/", protect, getOrdersByUser);
router.post("/", protect, createOrder);
router.get("/:id", protect, getOrderById);

module.exports = router;
