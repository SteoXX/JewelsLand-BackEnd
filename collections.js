const mongoose = require("mongoose");

// Define the User model
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, default: null },
    email: String,
    password: String,
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    emailVerified: Boolean,
    changePasswordToken: { type: String, default: null },
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
