document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById("loginBtn");
  const usernameInput = document.getElementById("username");
  const formTitle = document.getElementById("formTitle");
  const formSubtext = document.getElementById("formSubtext");
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");

  let mode = "login"; // Default mode

  // Toggle to login mode
  loginTab.addEventListener("click", () => {
    mode = "login";
    formTitle.textContent = "🔐 Login";
    formSubtext.textContent = "Welcome back! Enter your name to log in.";
    loginBtn.textContent = "Login";
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
  });

  // Toggle to signup mode
  signupTab.addEventListener("click", () => {
    mode = "signup";
    formTitle.textContent = "🆕 Sign Up";
    formSubtext.textContent = "Create your account to start the quiz!";
    loginBtn.textContent = "Sign Up";
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
  });

  // Handle form submission
  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();

    if (username.length < 3) {
      alert("Name must be at least 3 characters.");
      return;
    }

    try {
      const endpoint = mode === "signup" ? "/signup" : "/signin";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Something went wrong.");
        return;
      }

      // Save user in localStorage
      localStorage.setItem("quizUser", username);

      // Navigate after success
      window.location.href = result.redirect || "index.html";

    } catch (err) {
      console.error("⚠️ Auth Error:", err);
      alert("Server error. Please try again later.");
    }
  });

  // === Theme: Dark/Light Mode ===
  const switchToggle = document.getElementById('modeSwitch');
  const body = document.body;
  const modeText = document.getElementById('modeText');

  switchToggle.addEventListener('change', () => {
    const isDark = body.classList.toggle('dark-mode');
    modeText.textContent = isDark ? 'Dark Mode' : 'Light Mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Apply saved theme on load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    modeText.textContent = 'Dark Mode';
    switchToggle.checked = true;
  }
});