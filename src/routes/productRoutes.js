const express = require("express");
const router = express.Router();
const { getProducts, getProductById, getProductVariants, createProduct, getVendorProducts } = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getProducts);
router.get("/vendor", protect, authorize('vendor', 'admin'), getVendorProducts);
router.post("/", protect, authorize('vendor', 'admin'), createProduct);
router.get("/:id", getProductById);
router.get("/:id/variants", getProductVariants);

module.exports = router;
