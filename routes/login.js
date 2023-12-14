const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../collections");
require("dotenv").config();

const router = express.Router();

// Define the POST /login route if the user has already verified their email address
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Check if the user exists
  if (!user) {
    res.json({
      message: "User Not Found.",
      status: "UserNotFound",
    });
    return;
  }

  // Check if the email address is verified (REQUIRED for login)
  if (!user.emailVerified) {
    res.json({ message: "Email not verified.", status: "EmailNotVerified" });
    return;
  }

  // Check if the password is correct
  const isValidPassword = bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    res.json({
      message: "Invalid email or password.",
      status: "InvalidCredentials",
    });
    return;
  }

  // LOGIN SUCCESSFUL

  // Getting the secret key from the .env file
  const jwt_secret_key = process.env.JWT_SECRET_KEY;

  // Generate a token
  const sessionToken = jwt.sign({ userId: user._id }, jwt_secret_key, {
    expiresIn: "30d",
  });

  req.session.cookie.maxAge = 30 * 24 * 60 * 1000;
  // Config the session
  req.session.userId = user._id;
  req.session.user = user;
  req.session.authToken = sessionToken;
  console.log(req.session);

  // Return the token
  res.json({ status: "LoginSuccessful" });
});

module.exports = router;
