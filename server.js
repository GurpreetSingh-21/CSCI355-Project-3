const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const client = new MongoClient(process.env.MONGODB_URI);
let db;

// Connect to MongoDB and start server only after success
client.connect()
  .then(() => {
    db = client.db('myQuizApp'); // ✅ your actual DB name
    console.log("✅ Connected to MongoDB");
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // ❌ Exit to avoid running with broken DB
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Home redirects to login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve signup and login pages
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ✅ Signup route (JSON response)
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
    res.status(200).json({ message: 'Signup successful', redirect: 'login.html' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login route (JSON response)
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
    res.status(200).json({ message: "Login successful", redirect: "index.html" });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error' });
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

// Submit score to MongoDB
app.post('/submit-score', async (req, res) => {
  const { name, score } = req.body;

  if (!name || typeof score !== 'number') {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const scoresCollection = db.collection('scores');
    const entry = {
      name,
      score,
      timestamp: new Date()
    };
    await scoresCollection.insertOne(entry);
    res.status(201).json({ message: 'Score submitted successfully' });
  } catch (err) {
    console.error('Submit score error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard data
app.get('/leaderboard', async (req, res) => {
  try {
    const scoresCollection = db.collection('scores');
    const topScores = await scoresCollection
      .find()
      .sort({ score: -1, timestamp: 1 }) // Highest score first, then earliest
      .limit(10)
      .toArray();
      console.log("🎯 Fetched scores:", topScores);
    res.json(topScores);
  } catch (err) {
    console.error('❌ Leaderboard fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});