// public/main.js
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Fetch questions from the server
fetch('/questions')
  .then(response => response.json())
  .then(data => {
    questions = data;
  });

// Start quiz on the homepage
document.getElementById('start').addEventListener('click', () => {
  window.location.href = 'quiz.html';
});

// Show a question on the quiz page
function showQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById('question').textContent = question.question;
  document.getElementById('A').textContent = question.A;
  document.getElementById('B').textContent = question.B;
  document.getElementById('C').textContent = question.C;
  document.getElementById('D').textContent = question.D;
  document.getElementById('next').style.display = 'none';
}

// Check answer and move to next question
function checkAnswer(selectedAnswer) {
  const question = questions[currentQuestionIndex];
  if (selectedAnswer === question.answer) {
    score++;
  }
  document.getElementById('next').style.display = 'inline';
}

// Handle next question button
document.getElementById('next').addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    window.location.href = 'results.html';
  }
});

// Handle option selection
document.getElementById('A').addEventListener('click', () => checkAnswer('A'));
document.getElementById('B').addEventListener('click', () => checkAnswer('B'));
document.getElementById('C').addEventListener('click', () => checkAnswer('C'));
document.getElementById('D').addEventListener('click', () => checkAnswer('D'));

// Display score on results page
if (window.location.pathname === '/results.html') {
  document.getElementById('score').textContent = `Your Score: ${score}/${questions.length}`;
  document.getElementById('restart').addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    window.location.href = 'index.html';
  });
}
