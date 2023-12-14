const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.session.userId) {
    res.json({ isLoggedIn: true });
    console.log(req.session.userId);
  } else {
    res.json({ isLoggedIn: false });
    console.log(req.session.userId + "aaaaaaaaaaaaaaaaaaa");
  }
});

module.exports = router;
