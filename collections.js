const mongoose = require("mongoose");

// Define the User model
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, default: null },
    email: String,
    password: String,
    admin: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    emailVerified: Boolean,
    changePasswordToken: { type: String, default: null },
    cart: {
      type: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          quantity: { type: Number, default: 1 },
        },
      ],
      default: [],
    },
  })
);

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
    image: String,
    category: String,
  })
);

module.exports = User;
module.exports.Product = Product;
