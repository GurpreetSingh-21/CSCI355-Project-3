const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const axios = require('axios');
const session = require('express-session');
require('dotenv').config();
const { requireAuth } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

const client = new MongoClient(process.env.MONGODB_URI);
let db;

client.connect()
  .then(() => {
    db = client.db('myQuizApp'); 
    console.log("✅ Connected to MongoDB");
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat', // use env variable in prod
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // secure: true only with HTTPS
}));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ✅ Session check for frontend JS
app.get('/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    res.json({ loggedIn: false });
  }
});

// ✅ Login
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

    req.session.user = { username };
    console.log(`✅ User logged in: ${username}`);
    res.status(200).json({ message: 'Login successful', redirect: 'index.html' });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: "Logout error" });
    res.redirect('/login');
  });
});

// ✅ Protected quiz route
app.get('/quiz', requireAuth, async (req, res) => {
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=10&type=multiple');
    const questions = response.data.results;
    res.json(questions);
  } catch (error) {
    console.error('❌ Error fetching quiz questions:', error);
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
});

// ✅ Protected score submission
app.post('/submit-score', requireAuth, async (req, res) => {
  const { score } = req.body;
  const username = req.session.user?.username;

  if (!username || typeof score !== 'number') {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const scoresCollection = db.collection('scores');
    const entry = {
      name: username,
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

// Leaderboard route (public is fine)
app.get('/leaderboard', async (req, res) => {
  try {
    const scoresCollection = db.collection('scores');
    const topScores = await scoresCollection.find()
      .sort({ score: -1, timestamp: 1 })
      .limit(10)
      .toArray();
    res.json(topScores);
  } catch (err) {
    console.error('❌ Leaderboard fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
