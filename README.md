
# 🧠 CSCI355 Project 2 – Quiz App

A dynamic web-based quiz app built using **HTML**, **CSS**, **JavaScript**, and **Node.js with Express**.


## Live Link
https://csci355-project-2.onrender.com/

=======
<br/>
 CSCI355-Project-2 – Quiz App
<br/>
<br/>A simple web-based quiz app built using HTML, CSS, JavaScript, and Node.js with Express.
<br/>
>>>>>>> e0fc898 (initial)

## 🚀 How to Run the Project

### 1. Install Node.js  
Make sure Node.js is installed on your system

### 2. Install Dependencies  
Run this command in the project folder to install all dependencies:

- npm install


### 3. Start the Server
- npm run dev

### Then open your browser and go to:
- http://localhost:3000

<br/>


## ✨ Features

- ✅ **Randomized 10 questions** from `questions.json`
- ⏱️ **30-second timer** per question (auto-submit on timeout)
- ✅ ❌ **Answer feedback** with color animations
- 🔒 **Option lock-in** after selection to prevent changes
- 📊 **Progress bar** showing quiz completion
- 🌙☀️ **Dark & Light mode** with localStorage memory
- 🎯 **Score summary page** with:
  - ✅ Correct count
  - ❌ Incorrect count
  - ⏱️ Total time taken
  - 🎉 Confetti effect on high scores
- 📱 **Responsive design** (mobile, tablet, desktop)
- 🎞️ **Smooth animations**: pop-ups, entrance/exit transitions

<br/>

## 📁 Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Data Source:** JSON (`questions.json`)
- **Storage:** localStorage (score, timer, session)
- **Hosting:**
  - Render
<br/>

## 📌 Notes

- Quiz data is fetched dynamically via `fetch('/questions.json')` from the backend
- Final results are calculated and stored in `localStorage`
- Restarting the quiz resets session data and animations
<br/>

## 👥 Team Members

- Oake Soe  
- Mozie Najee  
- Gurpreet Singh  
- Prashanna Bhandari
=======
<br/>

### ✨ Features

- ✅ Random 10 Questions per quiz
- ⏱️ Countdown Timer per question (30s)
- ✅ ❌ Answer Feedback – green for correct, red for incorrect
- 📈 Progress Bar + “Question x of 10” indicator
- 🎨 Dark & Light Mode Toggle (with localStorage memory)
- 📱 Fully Responsive design (mobile, tablet, desktop)
- 🧠 Animated UI – transitions, popups, confetti, effects
<br/>
<br/>

### 📁 Tech Stack

Frontend: HTML, CSS (Custom + Animations), Vanilla JavaScript
Backend: Node.js + Express
Data Storage: JSON (for questions), localStorage (for score/session)
<br/>
<br/>

### 📌 Notes

- Quiz questions are loaded from questions.json
- Score is stored using localStorage and shown on the results page
- You do not need to restart the server manually if using npm run dev
<br/>

### 👥 Team Members

Oake Soe, Mozie Najee, Gurpreet Singh, Prashanna Bhandari

>>>>>>> e0fc898 (initial)
