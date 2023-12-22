const express = require("express");
const User = require("../collections");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const userId = req.session.userId;
    const { itemId, quantity } = req.body;

    const user = await User.findById(userId);
    let cartItem = user.cart.id(itemId);
    if (cartItem) {
      cartItem.quantity = quantity;
      user.markModified("cart"); // Mark the cart as modified
    } else {
      return res.status(400).json({
        status: "ItemNotFound",
        message: "The item was not found in the cart.",
      });
    }

    await user.save();

    res.json({
      status: "ItemUpdated",
      message: "Cart item updated successfully!",
      itemQuantity: quantity,
    });
  } catch (error) {
    console.error("Failed to update cart item:", error);
    res
      .status(500)
      .json({ status: "Error", message: "Failed to update cart item." });
  }
});

module.exports = router;
