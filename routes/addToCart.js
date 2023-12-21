const express = require("express");
const User = require("../collections");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const userId = req.session.userId;
    const { productId, quantity } = req.body;

    const user = await User.findById(userId);
    const cartItem = user.cart.id(productId);
    if (cartItem) {
      cartItem.quantity = quantity;
      user.markModified("cart"); // Mark the cart as modified
    } else {
      user.cart.push({ productId: productId, quantity: quantity });
    }

    await user.save();

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
