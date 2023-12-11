const mongoose = require("mongoose");

// Define the User model
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: String,
    password: String,
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    emailVerified: Boolean,
    changePasswordToken: { type: String, default: null },
  })
);

module.exports = User;
