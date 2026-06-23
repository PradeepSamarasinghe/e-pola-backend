const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getCart, syncCart } = require("../controllers/cartController");

router.get("/", auth, getCart);
router.post("/sync", auth, syncCart);

module.exports = router;
