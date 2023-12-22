const express = require("express");
const mongoose = require("mongoose");
const User = require("../collections");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Get the user ID from the session
    const userId = req.session.userId;

    // Get the item ID from the request body
    const itemId = req.body.itemId;

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "UserNotFound",
        message: "User not found.",
      });
    }

    // Remove the item from the user's cart
    const itemIndex = user.cart.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        status: "ItemNotFound",
        message: "The item was not found in the cart.",
      });
    }

    user.cart.splice(itemIndex, 1);

    // Save the updated user
    await user.save();

    // Send a success response
    res.json({
      status: "ItemRemoved",
      message: "Item removed from cart successfully!",
    });
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    res
      .status(500)
      .json({ status: "Error", message: "Failed to remove item from cart." });
  }
});

module.exports = router;
