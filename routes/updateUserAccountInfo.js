const express = require("express");
const User = require("../collections");

const router = express.Router();

router.post("/", async (req, res) => {
  const { newUsername } = req.body;

  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });
  console.log(req.session.userId);

  // Change username
  if (!user) {
    res.json({ message: "User not found", status: "UserNotFound" });
    return;
  }

  // Check if there is a user with that username (the username should be unique)
  if (await User.findOne({ username: newUsername })) {
    res.json({
      message: "Username Already Taken",
      status: "UsernameAlreadyTaken",
    });
    return;
  }

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        username: newUsername,
      },
    }
  );

  res.json({ message: "User updated", status: "UserUpdated" });
});

module.exports = router;
