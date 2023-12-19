const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.session.userId) {
    res.json({ isLoggedIn: true });
  } else {
    res.json({ isLoggedIn: false });
  }
});

module.exports = router;
