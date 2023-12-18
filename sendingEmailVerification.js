const nodemailer = require("nodemailer");

async function emailVerification(email, verificationToken) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  console.log(transporter.options.auth.user);
  const mailOptions = {
    from: transporter.options.auth.user,
    to: email,
    subject: "Email Verification",
    text: `Please verify your email address by clicking on the following link: https://localhost:3000/verify_your_email/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
    return "EmailSent";
  } catch (error) {
    console.error("Error sending : ", error);
    return "ErrorSendingEmail";
  }
}

module.exports = emailVerification;
