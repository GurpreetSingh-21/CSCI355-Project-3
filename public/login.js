// Add event listener to the login button
document.getElementById("loginBtn").addEventListener("click", () => {
    // Get the name entered by the user
    const name = document.getElementById("username").value.trim();  // Fixed from `ariaValueMax` to `value`

    // Check if a name was entered
    if (name.length > 0) {
        // Store the name in localStorage
        localStorage.setItem("quizUser", name);

        // Redirect to the quiz homepage
        window.location.href = "index.html";
    } else {
        alert("Please enter your name");
    }
});
