const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
const orderRoutes = require("./routes/orderRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/stores", storeRoutes);
app.use("/api/v1/orders", orderRoutes);

app.use(errorHandler);

module.exports = app;
