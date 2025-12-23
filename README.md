# 🎓 English Mastery Platform

![Project Status](https://img.shields.io/badge/Status-Active_Development-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)

> A comprehensive, AI-powered platform designed to guide users from beginner to mastery (A1 → B2) through a structured, 120-day interactive curriculum.

---

## 🌟 Project Overview

The **English Mastery Platform** is a full-stack educational application that combines proven learning methods with modern technology. Unlike generic learning apps, it offers a **fixed 120-day roadmap** where every lesson unlocks sequentially, ensuring a disciplined and structured learning path.

It features a **custom Node.js backend** for robust state management, a **dynamic React frontend** for a fluid user experience, and integrates deeply with a **PostgreSQL database** to serve content, track progress, and maintain user streaks.

---

## ✨ Key Features

### 📚 Structured Learning Engine
- **120-Day Smart Roadmap**: A locked progression system that guides users through A1, A2, B1, and B2 levels.
- **Dynamic Lesson Content**: Lessons include video player integration, PDF grammar dumps (Google Docs/Drive embed), and rich text vocabulary lists.
- **Content Availability Check**: The system intelligently checks database content availability to manage "Coming Soon" states for future lessons.

### 👤 Gamification & User Retention
- **🔥 Streak System**: Tracks daily activity to build learning habits.
- **Skill Radar**: Visualizes progress across 4 key skills: **Listening, Speaking, Reading, Grammar**.
- **Level & Days Counter**: Dashboard widgets show exactly how many days remain to reach the next proficiency level.
- **Flashcards Review**: A dedicated Spaced Repetition-style review system for vocabulary retention.

### 🛡️ Security & Performance
- **Custom Authentication**: Secure, HttpOnly Cookie-based JWT authentication (Login, Register, Password Reset).
- **Terms & Conditions**: Integrated modal for GDPR/Policy compliance acknowledgement.
- **Optimized Performance**: Uses React Query-like caching strategies and smart batch fetching for roadmap data to minimize API calls.

---

## 🛠️ Technical Architecture

The project follows a **Monorepo-style** structure with separated Frontend and Backend directories.

### 🖥️ Frontend (`/project`)
- **Framework**: React 18 + Vite (Ultra-fast build tool).
- **Language**: JavaScript (ES6+).
- **Styling**: Tailwind CSS (Utility-first), with custom animations via Framer Motion.
- **UI Components**: Lucide React icons, Glassmorphism design elements.
- **State Management**: React Context API for global user state.
- **Routing**: React Router DOM v6.

### ⚙️ Backend (`/backend`)
- **Runtime**: Node.js + Express.js.
- **Database ORM**: Drizzle ORM (Type-safe SQL queries) + `pg` (PostgreSQL client).
- **Database**: PostgreSQL (Relational data model for Users, Lessons, Progress, Streaks).
- **Security**:
  - `bcryptjs` for password hashing.
  - `jsonwebtoken` for secure session management.
  - `cors` for cross-origin resource sharing.

---

## 🔮 Future Roadmap (Coming Soon)

We are actively developing "Phase 2" features centered around AI and deeper interactivity:

### 🤖 1. AI Personal Tutor (In Active Development)
An intelligent chatbot component (`AITutor.jsx`) is already outlined in the codebase.
- **Scenario-Based Learning**: Users can choose scenarios (e.g., "Ordering Coffee", "Job Interview") to practice specific vocabulary.
- **Live Corrections**: The AI will analyze user input and provide instant grammar and vocabulary corrections.

### 🎙️ 2. Voice & Fluency Training
- **Speech Recognition**: Integration with Web Speech API or OpenAI Whisper to grade user pronunciation.
- **Voice Chat**: Real-time voice conversations with the AI Tutor.

### 🧠 3. Adaptive Assessment System
- **Placement Test**: A dynamic initial test to skip early levels if the user is advanced.
- **Adaptive Quizzes**: Lesson quizzes that get harder or easier based on the user's streak and error rate.

### 💳 4. Payment Integrations
- **Salla/Stripe Webhooks**: Premium subscription modeling to unlock B1/B2 levels.

---

## 🚀 Installation & Setup Guide

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Cloud URL)

### 1. Database Setup
Ensure you have a PostgreSQL database running. The schema files are located in `/project/database/`.

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `/backend`:
```env
PORT=5000
DATABASE_URL=postgres://user:pass@localhost:5432/dbname
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```
Run the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd project
npm install
```
Create a `.env` file in `/project`:
```env
VITE_API_URL=http://localhost:5000/api
```
Run the client:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 📂 Directory Structure

```
project-root/
├── backend/                 # Node.js API
│   ├── app.js
│   ├── controllers/         # Logic for Lessons, Auth
│   └── routes/              # API Endpoints
├── project/                 # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI (Navbar, Cards)
│   │   ├── pages/           # Dashboard, LessonView, Play
│   │   └── hooks/           # Custom Hooks (useSmartLessons)
│   └── database/            # SQL Migrations
└── README.md                # This file
```

---

<p align="center">
  Built with ❤️ for learners everywhere.
</p>
