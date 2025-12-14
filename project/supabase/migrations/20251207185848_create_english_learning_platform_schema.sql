/*
  # English Learning Platform Schema

  ## Overview
  Complete database schema for a 30-day English learning platform with progress tracking,
  lesson management, vocabulary systems, and AI tutor interactions.

  ## New Tables

  ### 1. `user_profiles`
  - `id` (uuid, primary key) - References auth.users
  - `current_level` (text) - Current CEFR level (A1, A2, B1, B2)
  - `current_day` (integer) - Current day in the 30-day program (1-30)
  - `listening_score` (integer) - Listening skill mastery (0-100)
  - `reading_score` (integer) - Reading skill mastery (0-100)
  - `speaking_score` (integer) - Speaking skill mastery (0-100)
  - `grammar_score` (integer) - Grammar skill mastery (0-100)
  - `streak_days` (integer) - Consecutive days of study
  - `total_study_minutes` (integer) - Total study time
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `lesson_progress`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References user_profiles
  - `day_number` (integer) - Day 1-30
  - `lesson_id` (text) - Lesson identifier
  - `completed` (boolean) - Completion status
  - `video_watched` (boolean) - Video completion
  - `exercises_completed` (boolean) - Exercise completion
  - `score` (integer) - Lesson score (0-100)
  - `time_spent_minutes` (integer) - Time spent on lesson
  - `completed_at` (timestamptz) - Completion timestamp
  - `created_at` (timestamptz)

  ### 3. `vocabulary_progress`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References user_profiles
  - `word` (text) - The vocabulary word
  - `translation` (text) - Arabic translation
  - `level` (text) - CEFR level (A1, A2, B1, B2)
  - `mastery_level` (integer) - SRS mastery (0-5)
  - `next_review_date` (timestamptz) - When to review next
  - `review_count` (integer) - Total reviews
  - `correct_count` (integer) - Correct answers
  - `last_reviewed_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 4. `ai_conversations`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References user_profiles
  - `scenario` (text) - Roleplay scenario type
  - `message` (text) - User or AI message
  - `role` (text) - 'user' or 'assistant'
  - `corrections` (jsonb) - Grammar corrections {error, correction, rule}
  - `created_at` (timestamptz)

  ### 5. `daily_tasks`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References user_profiles
  - `day_number` (integer) - Day 1-30
  - `task_type` (text) - 'lesson', 'vocabulary', 'speaking', 'exercise'
  - `task_description` (text) - Arabic description
  - `completed` (boolean)
  - `created_at` (timestamptz)
  - `completed_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Policies for authenticated users to CRUD their own records
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  current_level text DEFAULT 'A1' NOT NULL,
  current_day integer DEFAULT 1 NOT NULL,
  listening_score integer DEFAULT 0 NOT NULL,
  reading_score integer DEFAULT 0 NOT NULL,
  speaking_score integer DEFAULT 0 NOT NULL,
  grammar_score integer DEFAULT 0 NOT NULL,
  streak_days integer DEFAULT 0 NOT NULL,
  total_study_minutes integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create lesson_progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  day_number integer NOT NULL,
  lesson_id text NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  video_watched boolean DEFAULT false NOT NULL,
  exercises_completed boolean DEFAULT false NOT NULL,
  score integer DEFAULT 0 NOT NULL,
  time_spent_minutes integer DEFAULT 0 NOT NULL,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, day_number, lesson_id)
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lesson progress"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON lesson_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own lesson progress"
  ON lesson_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create vocabulary_progress table
CREATE TABLE IF NOT EXISTS vocabulary_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  word text NOT NULL,
  translation text NOT NULL,
  level text NOT NULL,
  mastery_level integer DEFAULT 0 NOT NULL,
  next_review_date timestamptz DEFAULT now() NOT NULL,
  review_count integer DEFAULT 0 NOT NULL,
  correct_count integer DEFAULT 0 NOT NULL,
  last_reviewed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, word)
);

ALTER TABLE vocabulary_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vocabulary progress"
  ON vocabulary_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vocabulary progress"
  ON vocabulary_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vocabulary progress"
  ON vocabulary_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own vocabulary progress"
  ON vocabulary_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create ai_conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  scenario text NOT NULL,
  message text NOT NULL,
  role text NOT NULL,
  corrections jsonb DEFAULT '[]'::jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON ai_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON ai_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON ai_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create daily_tasks table
CREATE TABLE IF NOT EXISTS daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  day_number integer NOT NULL,
  task_type text NOT NULL,
  task_description text NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz
);

ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks"
  ON daily_tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON daily_tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON daily_tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON daily_tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_day ON lesson_progress(user_id, day_number);
CREATE INDEX IF NOT EXISTS idx_vocabulary_next_review ON vocabulary_progress(user_id, next_review_date);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_day ON daily_tasks(user_id, day_number);
