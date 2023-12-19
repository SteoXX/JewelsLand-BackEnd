const express = require("express");
const User = require("../collections");

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findById(userId);

  if (!user) {
    res.json({ message: "User not found" });
    return;
  }
  console.log(user);
  console.log(user.admin);
  if (user.admin) {
    res.json({ admin: true });
  } else {
    res.json({ admin: false });
  }
});

module.exports = router;
