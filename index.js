// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
const MongoStore = require("connect-mongo");
require("dotenv").config();

// Import the routes
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const emailVerificationRouter = require("./routes/emailVerification");
const getNewTokenRouter = require("./routes/getNewToken");
const resendEmailVerificationRouter = require("./routes/resendEmailVerification");
const forgotPasswordRouter = require("./routes/forgotPassword");
const resetPasswordRouter = require("./routes/resetPassword");

require("dotenv").config();

// Initialize the app
const app = express();

// Use body-parser to parse JSON bodies
app.use(bodyParser.json());

// Defining the cors for cross origin requests
app.use(cors());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://stegarda:Stefano01@cluster0.sddayjc.mongodb.net/JewisLand",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      dbName:
        "mongodb+srv://stegarda:Stefano01@cluster0.sddayjc.mongodb.net/JewisLand",
      collectionName: "sessions",
      stringify: false,
      autoRemove: "interval",
      autoRemoveInterval: 1,
    }),
  })
);

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/verify_your_email/:token", emailVerificationRouter);
app.use("/get_new_email_verification_token", getNewTokenRouter);
app.use("/resend_email_verification", resendEmailVerificationRouter);
app.use("/forgot_password", forgotPasswordRouter);
app.use("/reset_password/:token", resetPasswordRouter);

// Create the secret key used for signing the token (JWT)
const secretKey = crypto.randomBytes(32).toString("hex");
fs.appendFile(".env", `JWT_SECRET_KEY=${secretKey}\n`);

// Start the server
const port = 3001;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
