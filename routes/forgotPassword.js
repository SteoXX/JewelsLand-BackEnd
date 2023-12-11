const express = require("express");
const User = require("../collections");
const crypto = require("crypto");
const emailResetPassword = require("../sendingEmailResetPassword");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.json({ message: "User not found", status: "UserNotFound" });
    return;
  }

  const changePasswordToken = crypto.randomBytes(20).toString("hex");
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        changePasswordToken: changePasswordToken,
      },
    }
  );

  const emailStatus = emailResetPassword(email, changePasswordToken);
  if (emailStatus === "EmailSent") {
    res.json({ message: "Email sent", status: "EmailSent" });
  } else if (emailStatus === "ErrorSendingEmail") {
    res.json({ message: "Error sending email", status: "ErrorSendingEmail" });
  }
});

module.exports = router;
