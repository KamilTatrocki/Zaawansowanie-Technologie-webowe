const express = require("express");
const cors = require("cors");
const { corsOptions } = require("./config/cors");
const { uploadsDir } = require("./config/multer");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/upload", uploadRoutes);

module.exports = app;
