const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../collections");

const router = express.Router();

// Define the POST /login route if the user has already verified their email address
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.json({ message: "Invalid email or password." });
    return;
  }

  // Check if the email address is verified (REQUIRED for login)
  if (!user.emailVerified) {
    res.json({ message: "Email not verified." });
    return;
  }

  // Check if the password is correct
  const isValidPassword = bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    res.json({ message: "Invalid email or password." });
    return;
  }

  // Generate a token
  const token = jwt.sign({ _id: user._id }, "my_secret_key");
  res.json({ token });
});

module.exports = router;
