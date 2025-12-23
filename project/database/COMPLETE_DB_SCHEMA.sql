-- =============================================================================
-- 📘 COMPLETE & VERIFIED DATABASE SCHEMA
-- =============================================================================
-- This schema represents the ACTUAL state of the live database as of today.
-- It reflects the "Hybrid Schema" approach where content (Vocab/Quiz) is stored
-- as JSONB within the lessons table, rather than separate tables.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS & AUTH
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text,
  password_changed boolean NOT NULL DEFAULT false,
  terms_accepted boolean DEFAULT false,
  terms_accepted_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- security/tracking table
CREATE TABLE IF NOT EXISTS registration_ips (
  id SERIAL PRIMARY KEY,
  ip_address varchar(45) NOT NULL,
  email varchar(255) NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. USER PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, -- references users(id) technically, but FK constraint might be missing in dump
  current_level text NOT NULL DEFAULT 'A1',
  current_day integer NOT NULL DEFAULT 1,
  
  -- Skill Scores
  listening_score integer NOT NULL DEFAULT 0,
  reading_score integer NOT NULL DEFAULT 0,
  speaking_score integer NOT NULL DEFAULT 0,
  grammar_score integer NOT NULL DEFAULT 0,
  
  -- Stats
  streak_days integer NOT NULL DEFAULT 0,
  total_study_minutes integer NOT NULL DEFAULT 0,
  last_activity_date date,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- 3. LESSONS (Hybrid Content Schema)
-- ============================================
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  day_number integer NOT NULL,
  title text NOT NULL,
  level text DEFAULT 'A1',
  description text,
  
  -- Content
  video_url text,
  image_url text,
  reading_text text,
  grammar_topic text,
  grammar_content text,
  
  -- JSONB Content Arrays (The core of the hybrid schema)
  vocabulary_list jsonb DEFAULT '[]'::jsonb,  -- Array of {word, translation, example}
  quiz_list jsonb DEFAULT '[]'::jsonb,        -- Array of {question, options, answer}
  flashcards_list jsonb DEFAULT '[]'::jsonb,  -- Array of flashcard objects
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 4. LESSON PROGRESS
-- ============================================
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  day_number integer NOT NULL,
  lesson_id integer,
  
  completed boolean NOT NULL DEFAULT false,
  score integer DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  
  saved_answers jsonb, -- In-progress quiz state
  
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 5. ACHIEVEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  description text,
  earned_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================================================
-- ⚠️ IMPORTANT NOTES:
-- 1. Tables 'vocabulary', 'exercises', 'vocabulary_progress', 'daily_tasks'
--    DO NOT EXIST in the live database. They have been superseded by the JSONB columns
--    in the 'lessons' table or logic in the frontend.
-- 2. Foreign Key constraints were not explicitly exported in the standard dump 
--    but 'user_id' fields implicitly link to 'users.id'.
-- =============================================================================
