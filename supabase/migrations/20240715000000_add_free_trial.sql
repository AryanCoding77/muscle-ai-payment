-- Create user_trials table to track free trial usage
CREATE TABLE IF NOT EXISTS user_trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  analyses_used INTEGER NOT NULL DEFAULT 0,
  trial_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_trials_user_id 
ON user_trials(user_id);

-- Set up Row Level Security
ALTER TABLE user_trials ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to view their own trial data
CREATE POLICY "Allow authenticated users to view their trial data" 
ON user_trials 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid()::TEXT);

-- Create policy to allow for inserting trial data by the system
CREATE POLICY "Allow system to create trial data" 
ON user_trials 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create policy to allow updating trial data
CREATE POLICY "Allow system to update trial data" 
ON user_trials 
FOR UPDATE 
TO authenticated
USING (true);

-- Grant permissions
GRANT SELECT ON user_trials TO authenticated;
GRANT INSERT, UPDATE ON user_trials TO authenticated;

-- Create a function to increment a value
CREATE OR REPLACE FUNCTION increment(val integer)
RETURNS integer AS $$
BEGIN
  RETURN val + 1;
END;
$$ LANGUAGE plpgsql; 