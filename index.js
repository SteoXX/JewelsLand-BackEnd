// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const https = require("https");
const path = require("path");
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

// Trust the proxy
app.set("trust proxy", true);

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.protocol !== "https") {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});

// Use body-parser to parse JSON bodies
app.use(bodyParser.json());

// Defining the cors for cross origin requests
app.use(
  cors({
    origin: "https://localhost:3000",
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

// Setting up the https server
const httpsServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app
);

httpsServer.listen(process.env.HTTPSPort, () =>
  console.log(`HTTPS server is listening on port ${process.env.HTTPSPort}`)
);

// Start the server
app.listen(process.env.HTTPPort, () =>
  console.log(`HTTP server is listening on port ${process.env.HTTPPort}`)
);
