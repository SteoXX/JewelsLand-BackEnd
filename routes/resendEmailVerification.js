const express = require("express");
const User = require("../collections");
const emailVerification = require("../sendingEmailVerification");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // Check if the user exists based on their email
  if (!user) {
    res.json({ message: "User not found", status: "NotRegisteredYet" });
    return;
  }

  // Check if the user is already verified
  if (user.emailVerified) {
    res.json({
      message: "Email already verified",
      status: "EmailAlreadyVerified",
    });
    return;
  }

  // Send the email
  const emailStatus = emailVerification(
    user.email,
    user.emailVerificationToken
  );

  // Check if the email was sent successfully
  if (emailStatus === "EmailSent") {
    res.json({ message: "Email sent", status: "EmailSent" });
  } else if (emailStatus === "ErrorSendingEmail") {
    res.json({ message: "Error sending email", status: "ErrorSendingEmail" });
  }
});

module.exports = router;
