const express = require("express");
const router = express.Router();
const { getProducts, getProductById, getProductVariants, createProduct, getVendorProducts, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getProducts);
router.get("/vendor", protect, authorize('vendor', 'admin'), getVendorProducts);
router.post("/", protect, authorize('vendor', 'admin'), createProduct);
router.get("/:id", getProductById);
router.put("/:id", protect, authorize('vendor', 'admin'), updateProduct);
router.delete("/:id", protect, authorize('vendor', 'admin'), deleteProduct);
router.get("/:id/variants", getProductVariants);

module.exports = router;
