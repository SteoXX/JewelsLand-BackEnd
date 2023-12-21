const express = require("express");
const User = require("../collections");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = req.session.userId;

    // Find the user in the database and populate the products in the cart
    const user = await User.findById(userId).populate("cart.productId");
    console.log(user.cart);

    // Send the cart items in the response
    res.json({ items: user.cart });
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
    res
      .status(500)
      .json({ status: "Error", message: "Failed to fetch cart items." });
  }
});

module.exports = router;
