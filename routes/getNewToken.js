const crypto = require("crypto");
const User = require("../collections");
const express = require("express");
const emailVerification = require("../sendingEmailVerification");

const router = express.Router();

router.post("/", async (req, res) => {
  const emailVerificationToken = crypto.randomBytes(20).toString("hex");
  const emailVerificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour
  const { oldEmailVerificationToken } = req.body;

  const user = await User.findOne({
    emailVerificationToken: oldEmailVerificationToken,
  });

  if (!user) {
    res.json({ message: "Token Not Found", status: "EmailAlreadyVerified" });
    return;
  }

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        emailVerificationToken: emailVerificationToken,
        emailVerificationTokenExpires: emailVerificationTokenExpires,
      },
    }
  );

  const emailStatus = emailVerification(user.email, emailVerificationToken);

  if (emailStatus === "EmailSent") {
    res.json({ message: "Email sent", status: "EmailSent" });
  } else if (emailStatus === "ErrorSendingEmail") {
    res.json({ message: "Error sending email", status: "ErrorSendingEmail" });
  }
});

module.exports = router;
