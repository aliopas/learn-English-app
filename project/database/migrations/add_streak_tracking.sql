-- Add last_activity_date column to user_profiles table for streak tracking
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_activity_date DATE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_activity ON user_profiles(last_activity_date);

-- Update existing users to have today as their last activity date if they have any progress
UPDATE user_profiles 
SET last_activity_date = CURRENT_DATE 
WHERE last_activity_date IS NULL 
  AND (streak_days > 0 OR total_study_minutes > 0);
