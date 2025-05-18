let score = 0;
let questions = [];
let numberOfQuestions = 0;
let randomIndex = -1;
let timeLeft = 30;
let timer;
let quizStartTime = 0;

// ========== INDEX PAGE ==========
if (
  window.location.pathname === "/" ||
  window.location.pathname.includes("index.html")
) {
  document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("quizUser");
    const quizCompleted = localStorage.getItem("quizCompleted");
    const storedScore = localStorage.getItem("score");
    const storedTotal = localStorage.getItem("total");

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // Check if quiz is already completed
    if (
      quizCompleted === "true" &&
      storedScore !== null &&
      storedTotal !== null
    ) {
      window.location.href = "results.html";
      return;
    }

    // Add animations to title elements
    document.querySelector("h1")?.classList.add("animate-entrance");
    document.querySelector(".subtext")?.classList.add("animate-entrance-delay");

    const startBtn = document.getElementById("start");
    if (startBtn) {
      startBtn.classList.add("pulse-animation");
      startBtn.addEventListener("click", () => {
        // Clear previous quiz data
        localStorage.removeItem("quizCompleted");
        localStorage.removeItem("score");
        localStorage.removeItem("total");
        localStorage.removeItem("quizTime");
        localStorage.removeItem("quizDate");
        localStorage.removeItem("userAnswers");

        startBtn.classList.add("zoom-out");
        document.querySelector(".container")?.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = "quiz.html";
        }, 500);
      });
    }

    createAnimatedBackground();
  });
}

// ========== DARK MODE ==========
document.addEventListener("DOMContentLoaded", () => {
  const switchToggle = document.getElementById("modeSwitch");
  const body = document.body;
  const modeText = document.getElementById("modeText");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    modeText.textContent = "Dark Mode";
    if (switchToggle) switchToggle.checked = true;
  }

  if (switchToggle) {
    switchToggle.addEventListener("change", () => {
      const isDark = body.classList.toggle("dark-mode");
      modeText.textContent = isDark ? "Dark Mode" : "Light Mode";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
});

// ========== QUIZ PAGE ==========
if (window.location.pathname.includes("quiz.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    quizStartTime = Date.now();
    
    const playerName = localStorage.getItem("quizUser");
    if (!playerName) {
      window.location.href = "login.html";
      return;
    }

    // Initialize UI elements
    addTimerAndProgressRow();
    const nameSpan = document.getElementById("playerName");
    if (nameSpan) nameSpan.textContent = playerName;

    const scoreDisplay = document.getElementById("liveScore");
    if (scoreDisplay) scoreDisplay.textContent = score;

    createAnimatedBackground();
    document.querySelector(".container")?.classList.add("slide-in");

    // Set up logout button
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });

    // Initialize user answers array for review
    localStorage.setItem("userAnswers", JSON.stringify([]));
    document.querySelectorAll(".choice").forEach((button) => {
      button.addEventListener("click", () => {
        let answers = JSON.parse(localStorage.getItem("userAnswers")) || [];
        answers.push(button.id);
        localStorage.setItem("userAnswers", JSON.stringify(answers));
      });
    });

    // Load questions
    fetch("questions.json")
      .then((res) => res.json())
      .then((data) => {
        questions = data;
        showQuestion();
        startTimer();
      });
  });

  function showQuestion() {
    randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];
    numberOfQuestions++;

    clearInterval(timer);
    timeLeft = 30;
    startTimer();
    updateProgress(numberOfQuestions, 10);

    const buttons = document.querySelectorAll(".choice");
    buttons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove("correct", "incorrect");
      btn.style.opacity = "0";
      btn.style.transform = "translateY(20px)";
    });

    if (!question) return;

    const questionEl = document.getElementById("question");
    questionEl.innerHTML = `${numberOfQuestions}. ${question.question}`;
    questionEl.style.opacity = "0";
    questionEl.style.transform = "translateY(-20px)";
    setTimeout(() => {
      questionEl.style.opacity = "1";
      questionEl.style.transform = "translateY(0)";
      questionEl.style.transition = "all 0.5s ease";
    }, 100);

    ["A", "B", "C", "D"].forEach((id, i) => {
      const btn = document.getElementById(id);
      btn.textContent = question[id];
      setTimeout(() => {
        btn.style.opacity = "1";
        btn.style.transform = "translateY(0)";
        btn.style.transition = "all 0.5s ease";
      }, 200 + i * 100);
    });

    document.getElementById("next").style.display = "none";
  }

  ["A", "B", "C", "D"].forEach((option) => {
    document.getElementById(option)?.addEventListener("click", () => {
      checkAnswer(option, randomIndex);
    });
  });

  document.getElementById("next")?.addEventListener("click", () => {
    if (numberOfQuestions < 10) {
      document.querySelector(".container").classList.add("slide-out");
      setTimeout(() => {
        document.querySelector(".container").classList.remove("slide-out");
        document.querySelector(".container").classList.add("slide-in");
        showQuestion();
      }, 300);
    } else {
      const quizEndTime = Date.now();
      localStorage.setItem("score", score);
      localStorage.setItem("total", numberOfQuestions);
      localStorage.setItem("quizTime", quizEndTime - quizStartTime);
      localStorage.setItem("quizDate", new Date().toISOString());
      localStorage.setItem("quizCompleted", "true");

      fetch("/submit-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: localStorage.getItem("quizUser"),
          score: score,
        }),
      })
        .then(() => {
          document.querySelector(".container").classList.add("fade-out");
          setTimeout(() => {
            window.location.href = "results.html";
          }, 500);
        })
        .catch((err) => {
          console.error("Failed to submit score:", err);
          document.querySelector(".container").classList.add("fade-out");
          setTimeout(() => {
            window.location.href = "results.html";
          }, 500);
        });
    }
  });

  function checkAnswer(selected, index) {
    const question = questions[index];
    const buttons = document.querySelectorAll(".choice");
    clearInterval(timer);

    buttons.forEach((btn) => (btn.disabled = true));

    if (selected === question.answer) {
      const correctBtn = document.getElementById(selected);
      correctBtn.classList.add("correct", "pop-animation");
      score++;
      document.getElementById("liveScore").textContent = score;
      animateScoreChange();
      createConfetti?.(20, correctBtn);
    } else {
      document.getElementById(selected).classList.add("incorrect", "shake-animation");
      setTimeout(() => {
        document.getElementById(question.answer).classList.add("correct", "pulse-once");
      }, 100);
    }

    const nextBtn = document.getElementById("next");
    nextBtn.style.display = "inline";
    nextBtn.classList.add("fade-in");
  }
}

// ========== RESULTS PAGE ==========
if (window.location.pathname.includes("results.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("quizUser");
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const score = parseInt(localStorage.getItem("score"));
    const total = parseInt(localStorage.getItem("total"));
    const time = parseInt(localStorage.getItem("quizTime") || 0);
    const date = localStorage.getItem("quizDate");

    if (isNaN(score) || isNaN(total)) {
      document.querySelector(".container").innerHTML = "<p>⚠️ No quiz data found. Please take the quiz first.</p>";
      return;
    }

    createAnimatedBackground(true);
    document.querySelector(".container").classList.add("scale-in");
    document.getElementById("playerGreeting").textContent = `Well done, ${user}!`;
    animateCounter(document.getElementById("score"), 0, score, 1500, `Your Score: ${score}/${total}`);
    document.getElementById("accuracy").textContent = `Accuracy: ${Math.round((score / total) * 100)}%`;
    document.getElementById("timeTaken").textContent = `Time Taken: ${Math.floor(time / 1000)} seconds`;
    
    if (date) {
      const formatted = new Date(date).toLocaleString();
      document.getElementById("quizDate").textContent = `Completed On: ${formatted}`;
    }

    // Add personalized message based on score
    const message = document.createElement("p");
    message.className = "result-message fade-in-delay";
    if ((score / total) >= 0.8) message.textContent = "🎯 Excellent work! You're a quiz master!";
    else if ((score / total) >= 0.6) message.textContent = "🌟 Great job! You really know your stuff!";
    else if ((score / total) >= 0.4) message.textContent = "📘 Keep practicing and you'll improve in no time!";
    else message.textContent = "💪 Don't give up! Try again and keep learning!";
    
    const scoreElement = document.getElementById("score");
    scoreElement.parentNode.insertBefore(message, scoreElement.nextSibling);

    document.getElementById("restart").addEventListener("click", () => {
      localStorage.removeItem("score");
      localStorage.removeItem("total");
      localStorage.removeItem("quizTime");
      localStorage.removeItem("quizDate");
      localStorage.removeItem("quizCompleted");
      localStorage.removeItem("userAnswers");
      window.location.href = "index.html";
    });

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  });
}

// =================== HELPER FUNCTIONS ===================
function createAnimatedBackground(isResultPage = false) {
  document.querySelectorAll(".animated-blob, .blob").forEach(el => el.remove());
  const container = document.querySelector("body");
  const colors = isResultPage
    ? ["#00c9a7", "#00d4ff", "#f1c40f", "#3498db", "#9b59b6"]
    : ["#00c9a7", "#00d4ff", "#f0f0f0"];
  for (let i = 0; i < 3; i++) {
    const blob = document.createElement("div");
    blob.className = "animated-blob";
    blob.style.backgroundColor = colors[i % colors.length];
    blob.style.width = `${150 + Math.random() * 150}px`;
    blob.style.height = blob.style.width;
    blob.style.left = `${Math.random() * 100}%`;
    blob.style.top = `${Math.random() * 100}%`;
    blob.style.position = "absolute";
    blob.style.borderRadius = "50%";
    blob.style.filter = "blur(40px)";
    blob.style.opacity = "0.4";
    blob.style.zIndex = "1";
    container.appendChild(blob);
  }
}

function addTimerAndProgressRow() {
  if (!document.querySelector(".top-bar")) {
    const topBar = document.createElement("div");
    topBar.className = "top-bar";

    // Time
    const timeWrapper = document.createElement("div");
    timeWrapper.className = "timer-wrapper";
    timeWrapper.innerHTML = `<span class="label">Time:</span> <span class="timer">30</span>`;

    // Progress
    const progressWrapper = document.createElement("div");
    progressWrapper.className = "progress-wrapper";
    progressWrapper.innerHTML = `
  <div class="progress-bar-container">
    <div class="progress-bar">
      <span class="progress-counter">Question 0 of 10</span>
    </div>
  </div>
`;

    topBar.appendChild(timeWrapper);
    topBar.appendChild(progressWrapper);

    document.querySelector(".container").prepend(topBar);
  }
}

function updateProgress(current, total) {
  const bar = document.querySelector(".progress-bar");
  if (bar) bar.style.width = `${(current / total) * 100}%`;

  const counter = document.querySelector(".progress-counter");
  if (counter) counter.textContent = `Question ${current} of ${total}`;
}

function startTimer() {
  const el = document.querySelector(".timer");
  if (!el) return;
  clearInterval(timer);
  timeLeft = 30;
  updateTimerDisplay();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      const q = questions[randomIndex];
      let wrongOption = q.answer === "A" ? "B" : "A";
      checkAnswer(wrongOption, randomIndex);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.querySelector(".timer");
  if (!el) return;
  el.textContent = timeLeft;
  el.style.color = timeLeft <= 5 ? "#f44336" : timeLeft <= 10 ? "#ff9800" : "#00c9a7";
  el.classList.toggle("pulse-animation", timeLeft <= 5);
}

function animateScoreChange() {
  let popup = document.querySelector(".score-popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.className = "score-popup";
    popup.textContent = "+1";
    document.querySelector(".container").appendChild(popup);
  }
  popup.style.opacity = "1";
  popup.style.transform = "translateY(0) scale(1.5)";
  setTimeout(() => {
    popup.style.opacity = "0";
    popup.style.transform = "translateY(-50px) scale(1)";
  }, 800);
}

function animateCounter(el, start, end, duration, finalText) {
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);
    el.textContent = `Your Score: ${current}/${finalText.split("/")[1]}`;
    if (progress < 1) requestAnimationFrame(step);
    else el.classList.add("score-highlight");
  };
  requestAnimationFrame(step);
}

function createConfetti(count = 100, sourceEl = null) {
  const container = document.body;
  let rect = sourceEl?.getBoundingClientRect();
  const colors = ["#00c9a7", "#00d4ff", "#f1c40f", "#3498db", "#9b59b6"];
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    const size = Math.random() * 10 + 5;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = sourceEl
      ? `${rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width}px`
      : `${Math.random() * 100}vw`;
    confetti.style.top = sourceEl
      ? `${rect.top + rect.height / 2}px`
      : `-10px`;

    container.appendChild(confetti);

    const duration = Math.random() * 3 + 2;
    confetti.animate(
      [
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
        {
          transform: `translate(${(Math.random() - 0.5) * 200}px, ${window.innerHeight}px) rotate(${Math.random() * 720}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: duration * 1000,
        easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
      }
    ).onfinish = () => confetti.remove();
  }
}

function createBlobs() {
  const animatedBg = document.querySelector('.animated-bg');
  if (!animatedBg) return;

  // Clear any existing blobs
  animatedBg.innerHTML = '';

  // Create blobs
  const colors = ['#00c9a7', '#00d4ff', '#4caf50', '#f1c40f'];
  const blobCount = 5;

  for (let i = 0; i < blobCount; i++) {
    const blob = document.createElement('div');
    blob.className = 'blob';

    // Random size between 200-400px
    const size = Math.random() * 200 + 200;

    // Random position
    const left = Math.random() * 100;
    const top = Math.random() * 100;

    // Random color from our palette
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Set styles
    blob.style.width = `${size}px`;
    blob.style.height = `${size}px`;
    blob.style.left = `${left}%`;
    blob.style.top = `${top}%`;
    blob.style.backgroundColor = color;

    animatedBg.appendChild(blob);
  }

  // Animate blobs
  moveBlobs();
}

function moveBlobs() {
  const blobs = document.querySelectorAll('.blob');

  blobs.forEach(blob => {
    // Random new position
    const newLeft = Math.random() * 100;
    const newTop = Math.random() * 100;

    // Apply new position with transition
    blob.style.left = `${newLeft}%`;
    blob.style.top = `${newTop}%`;
  });

  // Move blobs every 3 seconds
  setTimeout(moveBlobs, 3000);
}

// Call this function when the DOM is loaded
document.addEventListener('DOMContentLoaded', createBlobs);