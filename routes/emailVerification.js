const express = require("express");
const User = require("../collections");
const getNewToken = require("../getNewToken");

const router = express.Router();

router.post("/", async (req, res) => {
  const { emailVerificationToken, newToken } = req.body;
  //TODO
  const user = await User.findOne({ emailVerificationToken });

  if (!newToken) {
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
  } else {
    getNewToken(user);
  }
});

module.exports = router;
