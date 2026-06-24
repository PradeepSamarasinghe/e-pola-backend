const express = require("express");
const router = express.Router();
const { getStores, applyForStore, getMyStore, approveStore, updateStore } = require("../controllers/storeController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getStores);
router.post("/apply", protect, applyForStore);
router.get("/me", protect, getMyStore);
router.put("/:id/approve", protect, authorize('admin'), approveStore);
router.put("/:id", protect, authorize('vendor'), updateStore);

module.exports = router;
