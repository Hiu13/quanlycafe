const express = require("express");
const app = express();

const authRoutes = require("./routes/auth.route");
const errorHandler = require("./middlewares/error.middleware");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(errorHandler);

module.exports = app;