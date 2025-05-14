const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);
let db;

client.connect()
  .then(() => {
    db = client.db('myQuizApp'); // change this to match your actual DB name
    console.log("✅ Connected to MongoDB");
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sign Up route
app.post('/signup', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    await usersCollection.insertOne({ username });

    console.log(`🆕 New user signed up: ${username}`);
    res.redirect('/login.html');
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/signin', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'User not found. Please sign up.' });
    }

    console.log(`✅ User logged in: ${username}`);
    console.log('Redirecting to /index.html');
    res.redirect('/index.html');
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Serve quiz questions
app.get('/questions.json', (req, res) => {
  const filePath = path.join(__dirname, 'questions.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error loading questions');
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at ${PORT}`);
});
