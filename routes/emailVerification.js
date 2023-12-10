const express = require("express");
const User = require("../collections");

const router = express.Router();

router.post("/", async (req, res) => {
  const { emailVerificationToken } = req.body;

  // Find the user based on their emailVerificationToken
  const user = await User.findOne({ emailVerificationToken });

  // Check if the user exists based on their emailVerificationToken
  if (!user) {
    res.json({ message: "Invalid token", status: "EmailAlreadyVerified" });
    return;
  }

  // Check if the token has expired
  if (Date.now() >= user.emailVerificationTokenExpires) {
    res.json({ message: "Token expired", status: "TokenExpired" });
    return;
  }

  // Check if the token matches the one on the database
  if (user.emailVerificationToken !== emailVerificationToken) {
    res.json({ message: "Invalid token", status: "InvalidToken" });
    return;
  }

  // Mark the user as verified
  await User.updateOne(
    { _id: user._id },
    {
      $unset: {
        emailVerificationToken: "",
        emailVerificationTokenExpires: "",
      },
      $set: { emailVerified: true },
    }
  );
  res.json({ message: "Email verified", status: "EmailVerified" });
});

module.exports = router;
