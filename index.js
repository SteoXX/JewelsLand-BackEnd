// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// Import the routes
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const emailVerificationRouter = require("./routes/emailVerification");

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

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/verify_your_email/:token", emailVerificationRouter);

// Start the server
const port = 3001;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
