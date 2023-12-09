const crypto = require("crypto");
const User = require("./collections");

async function getNewToken(user) {
  const emailVerificationToken = crypto.randomBytes(20).toString("hex");
  const emailVerificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        emailVerificationToken: emailVerificationToken,
        emailVerificationTokenExpires: emailVerificationTokenExpires,
      },
    }
  );
}

module.exports = getNewToken;
