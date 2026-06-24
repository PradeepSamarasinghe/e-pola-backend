const Store = require("../models/Store");

exports.getStores = async (req, res, next) => {
  try {
    const { lat, lng, maxDistance } = req.query;

    let query = {};

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          // default to 50km if not provided
          $maxDistance: maxDistance ? parseInt(maxDistance) : 50000 
        }
      };
    }

    const stores = await Store.find(query);
    res.json(stores);
  } catch (error) {
    next(error);
  }
};

exports.updateStore = async (req, res, next) => {
  try {
    const store = await Store.findOne({ _id: req.params.id, vendorId: req.user.id });
    if (!store) {
      return res.status(404).json({ success: false, error: "Store not found or unauthorized" });
    }

    const { name, iconUrl, location, deliveryTimeEstimate, tags } = req.body;
    
    if (name) store.name = name;
    if (iconUrl) store.iconUrl = iconUrl;
    if (location) store.location = location;
    if (deliveryTimeEstimate) store.deliveryTimeEstimate = deliveryTimeEstimate;
    if (tags) store.tags = tags;

    await store.save();
    res.json({ success: true, store });
  } catch (error) {
    next(error);
  }
};

exports.applyForStore = async (req, res, next) => {
  try {
    const existingStore = await Store.findOne({ vendorId: req.user.id });
    if (existingStore) {
      return res.status(400).json({ success: false, error: "You have already applied for a store", store: existingStore });
    }

    const { name, location, deliveryTimeEstimate, tags } = req.body;
    const store = await Store.create({
      vendorId: req.user.id,
      name,
      location,
      deliveryTimeEstimate,
      tags,
      status: 'pending'
    });

    res.status(201).json({ success: true, store });
  } catch (error) {
    next(error);
  }
};

exports.getMyStore = async (req, res, next) => {
  try {
    const store = await Store.findOne({ vendorId: req.user.id });
    if (!store) {
      return res.status(404).json({ success: false, error: "Store not found" });
    }
    res.json({ success: true, store });
  } catch (error) {
    next(error);
  }
};

exports.approveStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ success: false, error: "Store not found" });
    }

    store.status = 'approved';
    await store.save();

    // Upgrade the user role to vendor
    const User = require('../models/User');
    await User.findByIdAndUpdate(store.vendorId, { role: 'vendor' });

    res.json({ success: true, store, message: "Store approved and user upgraded to vendor" });
  } catch (error) {
    next(error);
  }
};
