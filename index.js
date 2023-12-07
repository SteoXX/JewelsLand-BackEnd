// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Initialize the app
const app = express();

// Use body-parser to parse JSON bodies
app.use(bodyParser.json());

// Defining the cors for cross origin requests
const cors = require("cors");
app.use(cors());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://stegarda:Stefano01@cluster0.sddayjc.mongodb.net/JewisLand",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Define the User model
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: String,
    password: String,
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    emailVerified: Boolean,
  })
);

// Define the POST /register route
app.post("/register", async (req, res) => {
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

  /*
  // Email verification
  if (emailVerification(email)){

    // If the user does not exist, create a new user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  res.json({ message: 'User registered successfully.' });
  }
  */

  const hashedPassword = await bcrypt.hash(password, 10);
  const emailVerificationToken = crypto.randomBytes(20).toString("hex");
  const emailVerificationTokenExpires = Date(Date.now() + 3600000); // 1 hour
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
  // TODO
  emailVerification(email, emailVerificationToken);
});

// Define the POST /login route if the user has already verified their email address
app.post("/login", async (req, res) => {
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

// Start the server
const port = 3001;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

//
//
//

async function emailVerification(email, verificationToken) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  console.log(transporter.options.auth.user);
  let mailOptions = {
    from: transporter.options.auth.user,
    to: email,
    subject: "Email Verification",
    text:
      "Please verify your email address by clicking on the following link: http://localhost:3000/verify_your_email?  \n Your verification token is: " +
      verificationToken,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.error("Error sending : ", error);
  }
}
