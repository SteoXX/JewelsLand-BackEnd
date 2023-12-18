const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.session);
  if (req.session.userId) {
    res.json({ isLoggedIn: true });
    console.log(req.session.userId);
  } else {
    res.json({ isLoggedIn: false });
    console.log(req.session.userId);
  }
});

module.exports = router;