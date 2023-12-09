const bcrypt = require("bcryptjs");
const express = require("express");
const crypto = require("crypto");

const router = express.Router();
const emailVerification = require("../sendingEmailVerification");
const User = require("../collections");

// Define the POST /register route
router.post("/", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Check if the password and confirmPassword fields match
  if (password !== confirmPassword) {
    res.json({ message: "Passwords do not match." });
    return;
  }

  const checkUser = await User.findOne({ email });
  // Check if the user already exists
  if (checkUser) {
    res.json({ message: "User already exists." });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const emailVerificationToken = crypto.randomBytes(20).toString("hex");
  const emailVerificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour
  const user = new User({
    email,
    password: hashedPassword,
    emailVerificationToken,
    emailVerificationTokenExpires,
    emailVerified: false,
  });
  await user.save();
  res.json({ message: "User registered successfully.", state: "success" });

  // Send the email verification token to the user
  emailVerification(email, emailVerificationToken);
});

module.exports = router;
