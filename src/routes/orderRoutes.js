const express = require("express");
const router = express.Router();
const { createOrder, getOrdersByUser, calculateDeliveryFee, getOrderById } = require("../controllers/orderController");
const auth = require("../middleware/auth");

router.use(auth); // protect all order routes

router.get("/", getOrdersByUser);
router.get("/calculate-delivery-fee", calculateDeliveryFee);
router.get("/:id", getOrderById);
router.post("/", createOrder);

module.exports = router;
