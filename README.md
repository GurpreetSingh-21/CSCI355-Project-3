# 🧠 CSCI355 Project 2 – Quiz App

A dynamic web-based quiz app built using **HTML**, **CSS**, **Vanilla JavaScript**, and **Node.js with Express**.


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

---

## 📁 Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Data Source:** JSON (`questions.json`)
- **Storage:** localStorage (score, timer, session)
- **Hosting:**
  - Render
<br/>
<br/>

## 📌 Notes

- Quiz data is fetched dynamically via `fetch('/questions.json')` from the backend
- Final results are calculated and stored in `localStorage`
- Restarting the quiz resets session data and animations

---

## 👥 Team Members

- Oake Soe  
- Mozie Najee  
- Gurpreet Singh  
- Prashanna Bhandari