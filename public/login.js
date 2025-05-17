document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById("loginBtn");
  const usernameInput = document.getElementById("username");
  const formTitle = document.getElementById("formTitle");
  const formSubtext = document.getElementById("formSubtext");
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");

  // 🔥 Dynamically set mode based on current page
  let mode = window.location.pathname.includes("signup") ? "signup" : "login";

  // Set UI accordingly
  if (mode === "signup") {
    formTitle.textContent = "📝 Sign Up";
    formSubtext.textContent = "Create your account to start the quiz!";
    loginBtn.textContent = "Sign Up";
    if (signupTab) signupTab.classList.add("active");
    if (loginTab) loginTab.classList.remove("active");
  } else {
    formTitle.textContent = "🔐 Login";
    formSubtext.textContent = "Welcome back! Enter your name to log in.";
    loginBtn.textContent = "Login";
    if (loginTab) loginTab.classList.add("active");
    if (signupTab) signupTab.classList.remove("active");
  }

  // Optional: handle tab clicks if both tabs exist
  if (loginTab && signupTab) {
    loginTab.addEventListener("click", () => {
      window.location.href = "login.html";
    });
    signupTab.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
  }

  // Handle login/signup request
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

      localStorage.setItem("quizUser", username);
      window.location.href = result.redirect || "index.html";

    } catch (err) {
      console.error("⚠️ Auth Error:", err);
      alert("Server error. Please try again later.");
    }
  });

  // === Dark/Light Theme ===
  const switchToggle = document.getElementById('modeSwitch');
  const body = document.body;
  const modeText = document.getElementById('modeText');

  switchToggle?.addEventListener('change', () => {
    const isDark = body.classList.toggle('dark-mode');
    modeText.textContent = isDark ? 'Dark Mode' : 'Light Mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    modeText.textContent = 'Dark Mode';
    switchToggle.checked = true;
  }
});