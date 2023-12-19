const express = require("express");

const router = express.Router();

router.post("/", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.json({ status: "LogoutFailed", message: "Failed to logout." });
      return;
    }
    res.clearCookie("connect.sid"); // replace 'connect.sid' with your cookie name
    res.json({
      status: "LoggedOut",
      message: "Logged out successfully.",
    });
    return;
  });
});

module.exports = router;
