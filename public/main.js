let score = 0;
let questions = [];
let numberOfQuestions = 0;
let randomIndex = -1;

// ========== INDEX PAGE ==========
if (window.location.pathname === "/" || window.location.pathname.includes("index.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        window.location.href = "/quiz.html";
      });
    }
  });
}

// ========== QUIZ PAGE ==========
if (window.location.pathname.includes("quiz.html")) {
  document.addEventListener("DOMContentLoaded", () => {
  fetch("questions.json")
    .then(response => response.json())
    .then(data => {
      questions = data;
      showQuestion();
    });
  });
  
  function showQuestion() {
    randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];
    numberOfQuestions++;

    const buttons = document.querySelectorAll(".choice");
    for(let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = false;
      buttons[i].classList.remove("correct", "incorrect");
    }
    
    if (!question) return;

    document.getElementById("question").innerHTML = numberOfQuestions + ". " + question.question;
    document.getElementById("A").textContent = question.A;
    document.getElementById("B").textContent = question.B;
    document.getElementById("C").textContent = question.C;
    document.getElementById("D").textContent = question.D;
    document.getElementById("next").style.display = "none";
  }

  document.getElementById("A").addEventListener("click", () => checkAnswer("A", randomIndex));
  document.getElementById("B").addEventListener("click", () => checkAnswer("B", randomIndex));
  document.getElementById("C").addEventListener("click", () => checkAnswer("C", randomIndex));
  document.getElementById("D").addEventListener("click", () => checkAnswer("D", randomIndex));

  function checkAnswer(selectedAnswer, index) {
    const chosenQuestion = questions[index];

    const buttons = document.querySelectorAll(".choice");
    for(let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }

    if (selectedAnswer == chosenQuestion.answer) {
      document.getElementById(selectedAnswer).classList.add("correct");
      score++;
    } 
    else {
      document.getElementById(selectedAnswer).classList.add("incorrect");
      document.getElementById(chosenQuestion.answer).classList.add("correct");
    }
    document.getElementById("next").style.display = "inline";
  }

  document.getElementById("next").addEventListener("click", () => {
    if (numberOfQuestions < 10) {
      showQuestion();
    } else {
      // Save score in localStorage for results page
      localStorage.setItem("score", score);
      localStorage.setItem("total", numberOfQuestions);
      window.location.href = "/results.html";
    }
  });
}

// ========== RESULTS PAGE ==========
if (window.location.pathname.includes("results.html")) {
  const scoreElement = document.getElementById("score");
  const restartBtn = document.getElementById("restart");

  const finalScore = localStorage.getItem("score");
  const totalQuestions = localStorage.getItem("total");

  if (scoreElement) {
    scoreElement.textContent = `Your Score: ${finalScore}/${totalQuestions}`;
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      numberOfQuestions = 0;
      randomIndex = -1;
      score = 0;
      localStorage.removeItem("score");
      localStorage.removeItem("total");
      window.location.href = "index.html";
    });
  }
}
