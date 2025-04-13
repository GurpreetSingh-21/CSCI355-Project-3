document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById("loginBtn");
  const usernameInput = document.getElementById("username");
  const formTitle = document.getElementById("formTitle");
  const formSubtext = document.getElementById("formSubtext");
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");

  let mode = "login"; // "signup" or "login"

  loginTab.addEventListener("click", () => {
    mode = "login";
    formTitle.textContent = "🔐 Login";
    formSubtext.textContent = "Welcome back! Enter your name to log in.";
    loginBtn.textContent = "Login";
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
  });

  signupTab.addEventListener("click", () => {
    mode = "signup";
    formTitle.textContent = "🆕 Sign Up";
    formSubtext.textContent = "Create your account to start the quiz!";
    loginBtn.textContent = "Sign Up";
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
  });

  loginBtn.addEventListener("click", () => {
    const name = usernameInput.value.trim();

    if (name.length < 3) {
      alert("Name must be at least 3 characters.");
      return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem("quizUsers") || "[]");

    if (mode === "signup") {
      if (users.includes(name)) {
        alert("Username already taken.");
        return;
      }

      users.push(name);
      localStorage.setItem("quizUsers", JSON.stringify(users));
      localStorage.setItem("quizUser", name);
      alert("Account created successfully!");
      window.location.href = "index.html";

    } else if (mode === "login") {
      if (!users.includes(name)) {
        alert("User not found. Please sign up first.");
        return;
      }

      localStorage.setItem("quizUser", name);
      window.location.href = "index.html";
    }
  });

  // Restore dark mode if active
  const switchToggle = document.getElementById('modeSwitch');
  const body = document.body;
  const modeText = document.getElementById('modeText');

  switchToggle.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
    modeText.textContent = body.classList.contains('dark-mode') ? 'Dark Mode' : 'Light Mode';
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
  });

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    modeText.textContent = 'Dark Mode';
    switchToggle.checked = true;
  }
});
