# 🧠 CSCI355 Project 2 – Quiz App

A dynamic web-based quiz app built using **HTML**, **CSS**, **JavaScript**, and **Node.js with Express**.

---

## Live Link
https://csci355-project-2.onrender.com/


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

- ✅ Randomized 10 questions from questions.json

- ⏱️ 30-second timer per question (auto-submits on timeout)

- ✅ ❌ Answer feedback with green/red animations

- 🔒 Locked options after selection to prevent changes

- 📊 Progress bar showing quiz completion

- 🌙☀️ Dark & Light mode with theme memory

- 🎯 Results summary page with:

- ✅ Correct & incorrect count

- ⏱️ Time taken

- 🎉 Confetti celebration for high scores

- 📱 Responsive design for all devices

- 🎞️ Smooth UI animations: pop-ups, transitions, effects

<br/>

## 📁 Tech Stack
- Frontend: HTML, CSS, JavaScript

- Backend: Node.js, Express.js

- Data Source: JSON (questions.json)

- Storage: localStorage (name, score, session)

- Hosting: Render
<br/>

## 👥 Team Members

- Oake Soe -	Frontend UI + Styling
- Mozie Najee - 	Quiz Logic + Animations
- Gurpreet Singh	- Server Setup + Auth Flow + Confetti
- Prashanna Bhandari	- Results Page  + Timer
<br/>

## 📌 Notes
- Quiz data is fetched dynamically via fetch('/questions.json')

- Session state is saved in localStorage per user

- Restart button resets data and UI animations
