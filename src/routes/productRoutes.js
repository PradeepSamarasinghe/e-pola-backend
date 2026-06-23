const express = require("express");
const router = express.Router();
const { getProducts, getProductById, getProductVariants } = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/:id/variants", getProductVariants);

module.exports = router;
