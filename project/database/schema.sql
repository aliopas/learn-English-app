-- ============================================
-- English Learning Platform Database Schema
-- ============================================
-- Compatible with PostgreSQL 12+
-- Created for Aiven Cloud Database
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
-- Stores user authentication and basic info
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text,
  password_changed boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  last_login_at timestamptz
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- 2. USER PROFILES TABLE
-- ============================================
-- Stores learning progress and statistics
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  current_level text DEFAULT 'A1' NOT NULL CHECK (current_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  current_day integer DEFAULT 1 NOT NULL CHECK (current_day >= 1 AND current_day <= 30),
  listening_score integer DEFAULT 0 NOT NULL CHECK (listening_score >= 0 AND listening_score <= 100),
  reading_score integer DEFAULT 0 NOT NULL CHECK (reading_score >= 0 AND reading_score <= 100),
  speaking_score integer DEFAULT 0 NOT NULL CHECK (speaking_score >= 0 AND speaking_score <= 100),
  grammar_score integer DEFAULT 0 NOT NULL CHECK (grammar_score >= 0 AND grammar_score <= 100),
  streak_days integer DEFAULT 0 NOT NULL CHECK (streak_days >= 0),
  total_study_minutes integer DEFAULT 0 NOT NULL CHECK (total_study_minutes >= 0),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- ============================================
-- 3. LESSON PROGRESS TABLE
-- ============================================
-- Tracks completion of daily lessons
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  day_number integer NOT NULL CHECK (day_number >= 1 AND day_number <= 30),
  lesson_id text NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  video_watched boolean DEFAULT false NOT NULL,
  exercises_completed boolean DEFAULT false NOT NULL,
  score integer DEFAULT 0 NOT NULL CHECK (score >= 0 AND score <= 100),
  time_spent_minutes integer DEFAULT 0 NOT NULL CHECK (time_spent_minutes >= 0),
  saved_answers jsonb,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, day_number, lesson_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_day ON lesson_progress(user_id, day_number);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed ON lesson_progress(user_id, completed);

-- ============================================
-- 4. VOCABULARY PROGRESS TABLE
-- ============================================
-- Tracks vocabulary learning with SRS (Spaced Repetition System)
CREATE TABLE IF NOT EXISTS vocabulary_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  word text NOT NULL,
  translation text NOT NULL,
  level text NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  mastery_level integer DEFAULT 0 NOT NULL CHECK (mastery_level >= 0 AND mastery_level <= 5),
  next_review_date timestamptz DEFAULT now() NOT NULL,
  review_count integer DEFAULT 0 NOT NULL CHECK (review_count >= 0),
  correct_count integer DEFAULT 0 NOT NULL CHECK (correct_count >= 0),
  last_reviewed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, word)
);

-- Ensure columns exist before creating indexes
ALTER TABLE vocabulary_progress ADD COLUMN IF NOT EXISTS level text DEFAULT 'A1';

-- Indexes for SRS queries
CREATE INDEX IF NOT EXISTS idx_vocabulary_next_review ON vocabulary_progress(user_id, next_review_date);
CREATE INDEX IF NOT EXISTS idx_vocabulary_level ON vocabulary_progress(user_id, level);

-- ============================================
-- 5. AI CONVERSATIONS TABLE (DISABLED - للاستخدام المستقبلي)
-- ============================================
-- CREATE TABLE IF NOT EXISTS ai_conversations (
--   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--   user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
--   scenario text NOT NULL,
--   message text NOT NULL,
--   role text NOT NULL CHECK (role IN ('user', 'assistant')),
--   corrections jsonb DEFAULT '[]'::jsonb NOT NULL,
--   created_at timestamptz DEFAULT now() NOT NULL
-- );

-- CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id, created_at DESC);
-- CREATE INDEX IF NOT EXISTS idx_ai_conversations_scenario ON ai_conversations(user_id, scenario);


-- ============================================
-- 6. DAILY TASKS TABLE
-- ============================================
-- Manages daily learning tasks
CREATE TABLE IF NOT EXISTS daily_tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  day_number integer NOT NULL CHECK (day_number >= 1 AND day_number <= 30),
  task_type text NOT NULL CHECK (task_type IN ('lesson', 'vocabulary', 'speaking', 'exercise', 'reading', 'listening')),
  task_description text NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz
);

-- Index for daily task queries
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_day ON daily_tasks(user_id, day_number);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_completed ON daily_tasks(user_id, completed);

-- ============================================
-- 7. ACHIEVEMENTS TABLE (Optional)
-- ============================================
-- Tracks user achievements and badges
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  description text,
  earned_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, achievement_type, achievement_name)
);

CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id, earned_at DESC);

-- ============================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to user_profiles table
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample user
-- INSERT INTO users (email, password_hash, full_name) 
-- VALUES ('test@example.com', 'hashed_password_here', 'Test User')
-- ON CONFLICT (email) DO NOTHING;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: User progress summary
CREATE OR REPLACE VIEW user_progress_summary AS
SELECT 
  u.id as user_id,
  u.email,
  u.full_name,
  up.current_level,
  up.current_day,
  up.listening_score,
  up.reading_score,
  up.speaking_score,
  up.grammar_score,
  up.streak_days,
  up.total_study_minutes,
  COUNT(DISTINCT lp.id) as completed_lessons,
  COUNT(DISTINCT vp.id) as learned_words
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN lesson_progress lp ON u.id = lp.user_id AND lp.completed = true
LEFT JOIN vocabulary_progress vp ON u.id = vp.user_id AND vp.mastery_level >= 3
GROUP BY u.id, u.email, u.full_name, up.current_level, up.current_day, 
         up.listening_score, up.reading_score, up.speaking_score, 
         up.grammar_score, up.streak_days, up.total_study_minutes;


-- ============================================
-- MIGRATIONS (Appended for existing databases)
-- ============================================
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS saved_answers jsonb;
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS listening_score integer DEFAULT 0 NOT NULL CHECK (listening_score >= 0 AND listening_score <= 100);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS reading_score integer DEFAULT 0 NOT NULL CHECK (reading_score >= 0 AND reading_score <= 100);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS speaking_score integer DEFAULT 0 NOT NULL CHECK (speaking_score >= 0 AND speaking_score <= 100);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS grammar_score integer DEFAULT 0 NOT NULL CHECK (grammar_score >= 0 AND grammar_score <= 100);

ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz;

-- ============================================
-- COMPLETED!
-- ============================================
-- To execute this file:
-- psql -h pg-37a55ba5-ali-6c4e.j.aivencloud.com -p 15041 -U avnadmin -d defaultdb -f schema.sql
-- Or use: node migrate.js (after setting up Drizzle)
-- ============================================

-- ============================================
-- 8. LESSONS CONTENT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    day_number INTEGER NOT NULL UNIQUE CHECK (day_number >= 1 AND day_number <= 30),
    level TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    grammar_topic TEXT,
    grammar_content TEXT,
    reading_text TEXT,
    video_url TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lessons_level ON lessons(level);
CREATE INDEX IF NOT EXISTS idx_lessons_day_number ON lessons(day_number);

-- ============================================
-- 9. VOCABULARY CONTENT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS vocabulary (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
    word TEXT NOT NULL,
    translation TEXT NOT NULL,
    example TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_lesson_id ON vocabulary(lesson_id);

-- ============================================
-- 10. EXERCISES CONTENT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    question TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT,
    explanation TEXT,
    difficulty TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON exercises(lesson_id);

