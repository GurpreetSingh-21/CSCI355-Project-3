# 🧠 CSCI355 Project 3 – Full-Stack Quiz App

A dynamic, full-featured quiz application built using **HTML**, **CSS**, **JavaScript**, and **Node.js with Express**, with **MongoDB** for data storage. The app uses the **Open Trivia DB API** to fetch quiz questions, including login/signup, leaderboard, and review page.

---

## 🔗 Live Deployment
https://csci355-project-2.onrender.com/

---


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
🔑 User Authentication

- Signup & login functionality

- User session saved in localStorage

🧠 Dynamic Quiz (10 questions)

- Fetched from Open Trivia DB

- Each question has a 30-second timer (auto-submit on timeout)

- Randomized question order with category support

✅ ❌ Answer Feedback

- Green for correct, red for incorrect

- Locked options once selected

🧾 Results Page

- Summary of correct/incorrect answers

- Time taken and score displayed

- Confetti celebration for high scores

📈 Leaderboard

- Top 10 global scores

- Ranks the current user

🔄 Review Page

- Shows each question, user’s answer, and correct answer

- Fully synced with localStorage

🌙☀️ Dark/Light Mode

- Toggle switch with smooth UI transitions

- Mode preference saved across sessions

📱 Responsive Design

- Fully optimized for mobile, tablet, and desktop

🎞️ Animations

- Smooth fade-ins, pulses, progress transitions



<br/>

📁 Tech Stack
- Frontend: HTML, CSS, JavaScript

- Backend: Node.js, Express.js

- Database: MongoDB Atlas

- API: Open Trivia DB API

- Auth & Storage: localStorage (session), MongoDB (users & scores)

- Deployment: Render
<br/>

## 👥 Team Members

- Oake Soe -	Frontend UI + API Call
- Mozie Najee - 	Results Page + Review Answers
- Gurpreet Singh	- Connect Database + Styling
- Prashanna Bhandari	- Progress Bar  + Timer
<br/>

##📌 Implementation Notes
- All quiz data is fetched from the Open Trivia API on quiz start

- Answers selected by the user are saved in localStorage for result/review

- Server handles signup/login, stores scores and users in MongoDB

- Leaderboard and profile data is queried from the database

- Confetti and UI animations improve user experience
