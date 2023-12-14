const express = require("express");
const { Product } = require("../collections");

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find();

  if (!products) {
    console.log("No products found");
  }
  res.send(products);
});

module.exports = router;
