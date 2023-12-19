const express = require("express");
const User = require("../collections");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Get the user ID from the session
    const userId = req.session.userId;

    // Get the product ID from the request body
    const productId = req.body.productId;

    // Find the user in the database
    const user = await User.findById(userId);

    // Add the product to the user's cart
    user.cart.push(productId);

    // Save the updated user
    await user.save();

    // Send a success response
    res.json({
      status: "ProductAdded",
      message: "Product added to cart successfully!",
    });
  } catch (error) {
    console.error("Failed to add product to cart:", error);
    res
      .status(500)
      .json({ status: "Error", message: "Failed to add product to cart." });
  }
});

module.exports = router;
