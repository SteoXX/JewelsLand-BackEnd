// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
const MongoStore = require("connect-mongo");
const session = require("express-session");
require("dotenv").config();

// Import the routes
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const emailVerificationRouter = require("./routes/emailVerification");
const getNewTokenRouter = require("./routes/getNewToken");
const resendEmailVerificationRouter = require("./routes/resendEmailVerification");
const forgotPasswordRouter = require("./routes/forgotPassword");
const resetPasswordRouter = require("./routes/resetPassword");
const productsRouter = require("./routes/displayProducts");
const addProductsRouter = require("./routes/addProducts");
const CheckLoginStatusRouter = require("./routes/checkLoginStatus");

// Initialize the app
const app = express();

/*
// Log each request
app.use((req, res, next) => {
  console.log(`Received a ${req.method} request at ${req.url}`);
  next();
});
*/

// Use body-parser to parse JSON bodies
app.use(bodyParser.json());

// Defining the cors for cross origin requests
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://stegarda:Stefano01@cluster0.sddayjc.mongodb.net/JewelsLand"
);

// Inizialize the session
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      dbName: "JewelsLand",
      collectionName: "sessions",
      stringify: false,
      autoRemove: "interval",
      autoRemoveInterval: 1,
    }),
    cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Routes for login/register/verify...
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/verify_your_email/:token", emailVerificationRouter);
app.use("/get_new_email_verification_token", getNewTokenRouter);
app.use("/resend_email_verification", resendEmailVerificationRouter);
app.use("/forgot_password", forgotPasswordRouter);
app.use("/reset_password/:token", resetPasswordRouter);

// Routes for displaying the products
app.use("/displayProducts", productsRouter);
app.use("/add_products", addProductsRouter);

// Routes for checking if the user is logged
app.use("/checkLoginStatus", CheckLoginStatusRouter);

// Create the secret key used for signing the token (JWT)
const secretKey = crypto.randomBytes(32).toString("hex");
fs.appendFile(".env", `JWT_SECRET_KEY=${secretKey}\n`, (err) => {
  if (err) throw err;
});

// Start the server
const port = 3001;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
