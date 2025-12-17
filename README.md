# 🎓 AI-Powered English Learning Platform

![Project Status](https://img.shields.io/badge/Status-Active_Development-brightgreen)
![Data](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933)

> A comprehensive, intelligent platform designed to help users master the English language through interactive lessons, games, and personalized AI guidance.

---

## 🌟 Key Features

### 👤 User Experience
- **Secure Authentication**: Complete sign-up/login flow with JWT cookies, password change, and terms acceptance.
- **Interactive Dashboard**: Track learning streaks, daily progress, and unlocked achievements.
- **Roadmap Visualization**: A gamified learning path with locked/unlocked stages based on user levels.

### 📚 Learning Tools
- **Deep Lesson View**: A rich, multi-tab interface for every lesson including:
  - 🎥 **Video Learning**: Embedding of YouTube or Google Drive educational content.
  - 📖 **Vocabulary**: Interactive cards with pronunciation and examples.
  - 📝 **Grammar**: Integrated document previews for deep dumps.
  - 🗣️ **Reading**: Text-to-speech supported reading passages.
  - 🧩 **Quizzes**: Auto-graded exercises with immediate feedback (Multiple Choice, Fill-in-Blank, Translation).
- **Gamified Practice**:
  - **Vocabulary Games**: Fun challenges to reinforce memory.
  - **Flashcards**: Quick-review tool for active recall.

### ⚙️ Technical Highlights
- **Real-time Progress Saving**: Auto-saves quiz answers to the backend as you type.
- **Responsive Design**: Mobile-first UI built with TailwindCSS and Framer Motion for smooth animations.
- **Database Integrated**: Content is dynamically fetched from PostgreSQL, not hardcoded.

---

## 🛠️ Technology Stack

### Frontend (`/project`)
- **Core**: React 18, Vite
- **Styling**: TailwindCSS, Framer Motion (Animations), Lucide React (Icons)
- **State/Data**: React Context API, Custom Hooks
- **Utils**: Canvas Confetti (Celebrations)

### Backend (`/backend`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via `pg` and Drizzle ORM)
- **Authentication**: JWT (HttpOnly Cookies), BcryptJS
- **Security**: CORS, Cookie Parser

---

## 📋 Prerequisites

- **Node.js** (v18.x or higher)
- **PostgreSQL** Database (Local or Cloud like Railway/Neon)
- **npm** or **yarn**

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd project-bolt-sb1-jdrqcg9v
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your_super_secret_key_here
```

Start the backend server:
```bash
npm run dev
# Server will start on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal, navigate to the project directory:
```bash
cd ../project
npm install
```

Create a `.env` file in the `project/` directory:
```env
# Point to your running backend
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
# Frontend will start on http://localhost:5173
```

### 4. Database Setup
To initialize the database schema using the migration scripts found in `project/database`:

1. Ensure your `project/.env` also includes DB credentials for the migration script (optional if using external tools):
   ```env
   VITE_DB_HOST=localhost
   VITE_DB_PORT=5432
   VITE_DB_USER=postgres
   VITE_DB_PASSWORD=password
   VITE_DB_NAME=english_app
   ```
2. Run the migration:
   ```bash
   npm run db:migrate
   ```

---

## � API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Login and receive HTTP-only cookie |
| GET | `/api/auth/me` | Get current user profile (Protected) |
| POST | `/api/auth/logout` | Clear auth cookies |
| PUT | `/api/auth/change-password` | Update user password |
| PUT | `/api/auth/accept-terms` | Mark terms as accepted |

### Lessons & Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lessons/:dayNumber` | Get full lesson content (Video, Vocab, etc.) |
| POST | `/api/lessons/:dayNumber/complete` | Mark lesson as complete with score |
| POST | `/api/lessons/:dayNumber/save` | Auto-save partial quiz answers |

---

## 📂 Project Structure

```
.
├── backend/                # Express API Server
│   ├── config/            # Database configuration
│   ├── controllers/       # Route logic (Auth, Lessons)
│   ├── middleware/        # Auth protection, Error handling
│   ├── routes/            # API endpoints
│   └── server.js          # Entry point
│
├── project/                # React Vite Frontend
│   ├── database/          # SQL Schemas & Migration scripts
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Global State (Auth, Progress)
│   │   ├── lib/           # API Client & Helpers
│   │   ├── pages/         # Human-facing pages (LessonView, Dashboard)
│   │   └── main.jsx       # Entry point
│   └── vite.config.js     # Vite Configuration
│
└── package.json           # Root scripts (Deployment focus)
```

---

## 🔮 Future Roadmap

We are consistently pushing the boundaries of EdTech. Here is what is coming next:

### 🤖 1. Specialized AI Chat (The Personal Tutor)
- **Context-Aware Assistance**: An intelligent chat interface that knows your current level.
- **Level Adaptation**: Adjusts vocabulary and grammar complexity to match your proficiency.

### 🎙️ 2. Interactive Voice Chat (Fluency Practice)
- **Natural Conversation**: Voice-activated AI companion.
- **Pronunciation Coaching**: Real-time analysis of your speech.

### � 3. Dynamic Full-Scale AI Assessment
- **One-Hour Comprehensive Exam**: A rigorous, structured test designed to evaluate all language skills.
- **Fully AI-Supported**: Generated and graded by AI to ensure objectiveness.

---

<p align="center">
  <sub>Built with ❤️ for English Learners everywhere.</sub>
</p>
