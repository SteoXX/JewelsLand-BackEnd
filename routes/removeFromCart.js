const express = require("express");
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

    // Remove the item from the user's cart
    user.cart = user.cart.filter((id) => id.toString() !== itemId); // Filter create a new array with all the items that do not matche the one we wanna remove

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
