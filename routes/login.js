const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../collections");
require("dotenv").config();

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

  // LOGIN SUCCESSFUL

  // Generate a secret key
  const jwt_secret_key = process.env.JWT_SECRET_KEY;

  // Generate a token
  const sessionToken = jwt.sign({ userId: user._id }, jwt_secret_key, {
    expiresIn: "30d",
  });

  // Save the token in the database
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        sessionToken: sessionToken,
      },
    }
  );

  // Return the token
  res.json({ sessionToken: sessionToken });
});

module.exports = router;
