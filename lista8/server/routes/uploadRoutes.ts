const express = require("express");
const { upload } = require("../config/multer");

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

module.exports = router;
