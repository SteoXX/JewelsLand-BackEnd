const express = require("express");
const User = require("../collections");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/", async (req, res) => {
  const { changePasswordToken, password, confirmPassword } = req.body;

  const user = await User.findOne({ changePasswordToken });

  // Check if the password and confirm password match
  if (password !== confirmPassword) {
    res.json({
      message: "Passwords do not match",
      status: "PasswordsDoNotMatch",
    });
    return;
  }

  // Check if the user exists based on their resetPasswordToken
  if (!user) {
    res.json({ message: "Invalid token", status: "InvalidToken" });
    return;
  }

  // Check if the token matches the one on the database
  if (user.changePasswordToken !== changePasswordToken) {
    res.json({ message: "Invalid token", status: "InvalidToken" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne(
    { _id: user._id },
    {
      $unset: {
        changePasswordToken: "",
      },
      $set: { password: hashedPassword },
    }
  );
  res.json({ message: "Password changed", status: "PasswordChanged" });
});

module.exports = router;
