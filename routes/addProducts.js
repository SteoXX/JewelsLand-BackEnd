const express = require("express");
const { Product } = require("../collections");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, "../images") });

router.post("/", upload.single("image"), async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const image = req.file;

  // Convert image to base64
  const imgData = fs.readFileSync(image.path).toString("base64");

  const newProduct = new Product({
    name,
    description,
    price,
    stock,
    image: imgData,
    category,
  });

  // Save the new product to the database
  try {
    await newProduct.save();
    res.status(200).send("Product saved successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
