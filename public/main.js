let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// ========== INDEX PAGE ==========
if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        window.location.href = '/quiz.html';
      });
    }
  });
}

// ========== QUIZ PAGE ==========
if (window.location.pathname.includes('quiz.html')) {
  document.addEventListener('DOMContentLoaded', () => {
  fetch('questions.json')
    .then(response => response.json())
    .then(data => {
      questions = data;
      showQuestion();
    });
  });
  
  function showQuestion() {
    const question = questions[currentQuestionIndex];
    if (!question) return;

    document.getElementById('question').textContent = question.question;
    document.getElementById('A').textContent = question.A;
    document.getElementById('B').textContent = question.B;
    document.getElementById('C').textContent = question.C;
    document.getElementById('D').textContent = question.D;
    document.getElementById('next').style.display = 'none';
  }

  function checkAnswer(selectedAnswer) {
    const question = questions[currentQuestionIndex];
    if (selectedAnswer === question.answer) {
      score++;
    }
    document.getElementById('next').style.display = 'inline';
  }

  document.getElementById('A').addEventListener('click', () => checkAnswer('A'));
  document.getElementById('B').addEventListener('click', () => checkAnswer('B'));
  document.getElementById('C').addEventListener('click', () => checkAnswer('C'));
  document.getElementById('D').addEventListener('click', () => checkAnswer('D'));

  document.getElementById('next').addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      // Save score in localStorage for results page
      localStorage.setItem('score', score);
      localStorage.setItem('total', questions.length);
      window.location.href = '/results.html';
    }
  });
}

// ========== RESULTS PAGE ==========
if (window.location.pathname.includes('results.html')) {
  const scoreElement = document.getElementById('score');
  const restartBtn = document.getElementById('restart');

  const finalScore = localStorage.getItem('score');
  const totalQuestions = localStorage.getItem('total');

  if (scoreElement) {
    scoreElement.textContent = `Your Score: ${finalScore}/${totalQuestions}`;
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentQuestionIndex = 0;
      score = 0;
      localStorage.removeItem('score');
      localStorage.removeItem('total');
      window.location.href = 'index.html';
    });
  }
}
