// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize the app
const app = express();

// Use body-parser to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://stegarda:Stefano01@cluster0.sddayjc.mongodb.net/JewisLand', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the User model
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
}));

// Define the POST /register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.json({ message: 'User registered successfully.' });
});

// Define the POST /login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.json({ message: 'Invalid username or password.' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.json({ message: 'Invalid username or password.' });
  }
  const token = jwt.sign({ _id: user._id }, 'my_secret_key');
  res.json({ token });
});

// Start the server
const port = 3001;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
