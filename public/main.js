// Global variables
let score = 0;
let questions = [];
let numberOfQuestions = 0;
let currentQuestionIndex = 0;
let timeLeft = 30;
let timer;
let quizStartTime = 0;

// Reload on back navigation cache
window.addEventListener("pageshow", (event) => {
  if (event.persisted) window.location.reload();
});

// Create animated background with blobs
function createAnimatedBackground() {
  const animatedBg = document.querySelector('.animated-bg');
  if (!animatedBg) {
    const bg = document.createElement('div');
    bg.className = 'animated-bg';
    document.body.appendChild(bg);
  }

  const bgElement = document.querySelector('.animated-bg');
  // Clear any existing blobs
  if (bgElement) {
    bgElement.innerHTML = '';

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

      bgElement.appendChild(blob);
    }

    // Start animations
    moveBlobs();
  }
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

// Check user session
function checkSessionAndRun(callback) {
  fetch('/check-session')
    .then(res => res.json())
    .then(data => {
      if (!data.loggedIn) {
        window.location.href = "login.html";
      } else {
        callback(data.username);
      }
    })
    .catch(err => {
      console.error("Session check failed:", err);
      // For development, allow continuing without login
      callback("Dev User");
    });
}

// Add progress bar if it doesn't exist
function addProgressBar() {
  const container = document.querySelector('.container');
  if (!container) return;
  
  let progressBar = document.querySelector('.progress-container');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'progress-container';
    progressBar.innerHTML = `
      <div class="progress-bar" style="width: 0%"></div>
    `;
    container.prepend(progressBar);
  }
}

// Add timer if it doesn't exist
function addTimer() {
  const container = document.querySelector('.container');
  if (!container) return;
  
  let timerEl = document.querySelector('.timer-container');
  if (!timerEl) {
    timerEl = document.querySelector('.timer-display');
    if (!timerEl) {
      timerEl = document.createElement('div');
      timerEl.className = 'timer-container';
      timerEl.innerHTML = `<div class="timer">30</div>`;
      container.prepend(timerEl);
    }
  }
}

// Update progress bar
function updateProgress(current, total) {
  const bar = document.querySelector(".progress-bar");
  if (bar) bar.style.width = `${(current/total) * 100}%`;
}

// ========== INDEX PAGE ==========
if (
  window.location.pathname === "/" ||
  window.location.pathname.includes("index.html")
) {
  document.addEventListener("DOMContentLoaded", () => {
    fetch('/check-session')
      .then(res => res.json())
      .then(data => {
        if (!data.loggedIn) {
          window.location.href = "login.html";
        } else {
          const nameEl = document.getElementById("playerName");
          if (nameEl) nameEl.textContent = data.username;
        }
      })
      .catch(err => {
        console.error("Session check failed:", err);
        // Continue anyway for development
      });

    const startBtn = document.getElementById("start");
    document.querySelector("h1")?.classList.add("animate-entrance");
    document.querySelector(".subtext")?.classList.add("animate-entrance-delay");

    if (startBtn) {
      startBtn.classList.add("pulse-animation");
      startBtn.addEventListener("click", () => {
        startBtn.classList.add("zoom-out");
        document.querySelector(".container")?.classList.add("fade-out");
        setTimeout(() => (window.location.href = "quiz.html"), 500);
      });
    }

    createAnimatedBackground();
  });
}

// Dark mode toggle
document.addEventListener("DOMContentLoaded", () => {
  const switchToggle = document.getElementById("modeSwitch");
  const body = document.body;
  const modeText = document.getElementById("modeText");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    if (modeText) modeText.textContent = "Dark Mode";
    if (switchToggle) switchToggle.checked = true;
  }

  if (switchToggle) {
    switchToggle.addEventListener("change", () => {
      const isDark = switchToggle.checked;
      body.classList.toggle("dark-mode", isDark);
      body.classList.toggle("light-mode", !isDark);
      if (modeText) modeText.textContent = isDark ? "Dark Mode" : "Light Mode";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
});

// ========== QUIZ PAGE ==========
if (window.location.pathname.includes("quiz.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    // Initialize the quiz page
    checkSessionAndRun((username) => {
      let userAnswers = [];

      // Populate user info and start quiz
      const playerNameElement = document.getElementById("playerName");
      const liveScoreElement = document.getElementById("liveScore");
      
      if (playerNameElement) playerNameElement.textContent = username;
      if (liveScoreElement) liveScoreElement.textContent = score;
      
      quizStartTime = Date.now();

      createAnimatedBackground();
      addProgressBar();
      addTimer();
      
      const container = document.querySelector(".container");
      if (container) container.classList.add("slide-in");

      // Fetch questions
      fetch("https://opentdb.com/api.php?amount=10&type=multiple")
        .then(res => res.json())
        .then(data => {
          if (!data.results || data.results.length === 0) {
            console.error("No questions returned by API");
            return;
          }
          questions = data.results;
          currentQuestionIndex = 0;
          score = 0;
          numberOfQuestions = 0;
          userAnswers = [];
          showQuestion();
          startTimer();
        })
        .catch(err => {
          console.error("Failed to fetch questions:", err);
          // Show error message to user
          const questionEl = document.getElementById("question");
          if (questionEl) {
            questionEl.innerHTML = "Failed to load questions. Please refresh the page.";
          }
        });

      // Answer buttons
      ["A", "B", "C", "D"].forEach((option) => {
        const btn = document.getElementById(option);
        if (btn) {
          btn.classList.add("choice"); // Add choice class if missing
          btn.addEventListener("click", () => {
            checkAnswer(option, currentQuestionIndex);
            userAnswers.push(option);
          });
        }
      });

      // Logout
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          fetch('/logout').then(() => window.location.replace("login.html"));
        });
      }

      // Next question
      const nextBtn = document.getElementById("next");
      if (nextBtn) {
        // Make sure it's visible
        nextBtn.style.display = "none"; // Hide initially, show after answer
        nextBtn.style.cursor = "pointer"; // Make sure cursor shows it's clickable
        
        nextBtn.addEventListener("click", () => {
          console.log("Next button clicked");
          currentQuestionIndex++;
          if (currentQuestionIndex < questions.length) {
            const container = document.querySelector(".container");
            if (container) {
              container.classList.add("slide-out");
              setTimeout(() => {
                container.classList.remove("slide-out");
                container.classList.add("slide-in");
                showQuestion();
                startTimer();
              }, 300);
            } else {
              // Fallback if container not found
              showQuestion();
              startTimer();
            }
          } else {
            // Quiz end
            const quizEndTime = Date.now();
            const quizHistory = questions.map((q, i) => ({
              question: decodeHTML(q.question),
              correctAnswer: decodeHTML(q.correct_answer),
              userAnswer: userAnswers[i] || null
            }));

            localStorage.setItem("score", score);
            localStorage.setItem("total", questions.length);
            localStorage.setItem("quizTime", quizEndTime - quizStartTime);
            localStorage.setItem("quizDate", new Date().toISOString());
            localStorage.setItem("quizHistory", JSON.stringify(quizHistory));

            // Create final confetti!
            createConfetti(200);

            fetch("/submit-score", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ score })
            })
            .catch(err => console.error("Failed to submit score:", err))
            .finally(() => {
              const container = document.querySelector(".container");
              if (container) container.classList.add("fade-out");
              setTimeout(() => window.location.href = "results.html", 500);
            });
          }
        });
      }
    });
  });
}

// ========== Helper Functions ==========
function showQuestion() {
  if (!questions.length) return;
  const q = questions[currentQuestionIndex];
  numberOfQuestions = currentQuestionIndex + 1;

  clearInterval(timer);
  timeLeft = 30;
  updateProgress(numberOfQuestions, questions.length);

  const qEl = document.getElementById("question");
  if (!qEl) return;
  
  qEl.innerHTML = `${numberOfQuestions}. ${decodeHTML(q.question)}`;
  qEl.style.opacity = "0";
  qEl.style.transform = "translateY(-20px)";
  setTimeout(() => {
    qEl.style.opacity = "1";
    qEl.style.transform = "translateY(0)";
    qEl.style.transition = "all 0.5s ease";
  }, 100);

  const choices = [
    decodeHTML(q.correct_answer),
    ...q.incorrect_answers.map(decodeHTML)
  ].sort(() => Math.random() - 0.5);

  ["A","B","C","D"].forEach((id, i) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    
    btn.textContent = choices[i];
    btn.disabled = false;
    btn.classList.remove("correct","incorrect");
    btn.style.opacity = "0";
    btn.style.transform = "translateY(20px)";
    setTimeout(() => {
      btn.style.opacity = "1";
      btn.style.transform = "translateY(0)";
      btn.style.transition = "all 0.5s ease";
    }, 200 + i*100);
  });

  const nextBtn = document.getElementById("next");
  if (nextBtn) nextBtn.style.display = "none";
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function checkAnswer(opt, idx) {
  if (!questions[idx]) return;
  clearInterval(timer);
  
  // Find all choice buttons and disable them
  const choiceButtons = document.querySelectorAll(".choice, button[id='A'], button[id='B'], button[id='C'], button[id='D']");
  choiceButtons.forEach(b => {
    if (b) b.disabled = true;
  });

  const correctText = decodeHTML(questions[idx].correct_answer);
  const selectedBtn = document.getElementById(opt);

  if (selectedBtn && selectedBtn.textContent === correctText) {
    selectedBtn.classList.add("correct");
    score++;
    const liveScoreEl = document.getElementById("liveScore");
    if (liveScoreEl) liveScoreEl.textContent = score;
    animateScoreChange();
    // Create confetti for correct answers
    createConfetti(50);
  } else if (selectedBtn) {
    selectedBtn.classList.add("incorrect");
    choiceButtons.forEach(b => {
      if (b && b.textContent === correctText) b.classList.add("correct");
    });
  }

  // Make Next Question button visible and ensure it's clickable
  const nextBtn = document.getElementById("next");
  if (nextBtn) {
    nextBtn.style.display = "inline-block";
    nextBtn.style.pointerEvents = "auto";
    nextBtn.disabled = false;
  }
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
      // Find an incorrect answer button to simulate clicking when time runs out
      const correctAnswer = decodeHTML(questions[currentQuestionIndex].correct_answer);
      const incorrectBtn = Array.from(document.querySelectorAll(".choice"))
        .find(b => b && b.textContent !== correctAnswer);
      
      if (incorrectBtn) {
        checkAnswer(incorrectBtn.id, currentQuestionIndex);
      } else {
        // Fallback if we can't find an incorrect button
        checkAnswer('A', currentQuestionIndex);
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.querySelector(".timer"); 
  if (!el) return;
  el.textContent = timeLeft;
  el.style.color = timeLeft <= 5 ? "#f44336" : timeLeft <= 10 ? "#ff9800" : "#00c9a7";
}

function animateScoreChange() {
  let popup = document.querySelector(".score-popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.className = "score-popup";
    popup.textContent = "+1";
    const container = document.querySelector(".container");
    if (container) container.appendChild(popup);
  }
  
  if (popup) {
    popup.style.opacity = "1";
    popup.style.transform = "translateY(0) scale(1.5)";
    setTimeout(() => {
      popup.style.opacity = "0";
      popup.style.transform = "translateY(-50px) scale(1)";
    }, 800);
  }
}

function animateCounter(el, start, end, duration, finalText) {
  if (!el) return;
  
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

function createConfetti(count = 100) {
  // Create container if it doesn't exist
  let container = document.getElementById("confetti-wrapper");
  if (!container) {
    container = document.createElement("div");
    container.id = "confetti-wrapper";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
  }

  const colors = ["#00c9a7", "#00d4ff", "#f1c40f", "#3498db", "#9b59b6"];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";

    const size = Math.random() * 10 + 5;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.position = "absolute";
    confetti.style.left = `${centerX}px`;
    confetti.style.top = `${centerY}px`;
    confetti.style.borderRadius = "50%";
    confetti.style.zIndex = "10000";

    container.appendChild(confetti);

    const duration = Math.random() * 3 + 2;
    const angle = Math.random() * 360;
    const distance = Math.random() * 200 + 50;
    const xOffset = distance * Math.cos(angle * Math.PI / 180);
    const yOffset = distance * Math.sin(angle * Math.PI / 180);

    // Use a simple animation to make sure it works everywhere
    confetti.style.transition = `transform ${duration}s ease-out, opacity ${duration}s ease-out`;
    
    // Trigger reflow
    confetti.getBoundingClientRect();
    
    // Apply animation
    confetti.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${angle}deg)`;
    confetti.style.opacity = "0";

    // Remove confetti after animation
    setTimeout(() => {
      confetti.remove();
    }, duration * 1000);
  }
}

// ========== RESULTS PAGE ==========
if (window.location.pathname.includes("results.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const score = localStorage.getItem("score") || 0;
    const total = localStorage.getItem("total") || 0;
    const time = localStorage.getItem("quizTime") || 0;
    
    const scoreElement = document.getElementById("finalScore");
    const timeElement = document.getElementById("timeElapsed");
    
    if (scoreElement) {
      const finalText = `Your Score: ${score}/${total}`;
      animateCounter(scoreElement, 0, score, 1000, finalText);
    }
    
    if (timeElement) {
      const seconds = Math.floor(time / 1000);
      timeElement.textContent = `Time: ${seconds} seconds`;
    }
    
    // Create an extra burst of confetti on results page
    setTimeout(() => {
      createConfetti(150);
    }, 500);
    
    createAnimatedBackground();
    
    // Add event listeners for buttons on results page
    const homeBtn = document.getElementById("homeBtn");
    if (homeBtn) {
      homeBtn.addEventListener("click", () => {
        window.location.href = "index.html";
      });
    }
    
    const retryBtn = document.getElementById("retryBtn");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        window.location.href = "quiz.html";
      });
    }
    
    // Add CSS for confetti if it doesn't exist
    if (!document.getElementById("confetti-style")) {
      const style = document.createElement("style");
      style.id = "confetti-style";
      style.textContent = `
        .confetti {
          position: absolute;
          z-index: 10000;
          border-radius: 50%;
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
    }
  });
}