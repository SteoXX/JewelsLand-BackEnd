const express = require("express");
const User = require("../collections");

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findOne({ _id: userId });

  if (user) {
    // If the user exists, send the username to the front end
    res.json({ username: user.username });
  } else {
    // If the user does not exist, send an error message
    res.status(404).send("User not found");
  }
});

module.exports = router;
