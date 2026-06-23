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
