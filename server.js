const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Redirect root ("/") to login page
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Serve questions.json
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

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
