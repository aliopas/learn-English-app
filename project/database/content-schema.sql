-- ============================================
-- CONTENT TABLES (LESSONS & EXERCISES)
-- ============================================

-- Table to store lesson content
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_number integer NOT NULL,
  title text NOT NULL,
  objectives jsonb DEFAULT '[]'::jsonb NOT NULL, -- Array of strings
  content jsonb DEFAULT '{}'::jsonb NOT NULL,    -- Structured content (sections, examples)
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lessons_day ON lessons(day_number);

-- Table to store exercises for each lesson
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('multiple_choice', 'fill_gap', 'matching', 'translation', 'sorting')),
  question text NOT NULL,
  options jsonb DEFAULT '[]'::jsonb NOT NULL, -- Array of options for MC
  correct_answer text NOT NULL,
  explanation text,
  points integer DEFAULT 10 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_exercises_lesson ON exercises(lesson_id);
