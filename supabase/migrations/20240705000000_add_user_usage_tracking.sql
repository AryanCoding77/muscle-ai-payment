-- Create a table to track user usage for free trials
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  analyze_count INTEGER NOT NULL DEFAULT 0,
  last_analyze_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a unique index on user_id to ensure one record per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_usage_user_id ON user_usage(user_id);

-- Set up Row Level Security
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own usage data
CREATE POLICY "Allow users to view their own usage data" 
ON user_usage 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid()::TEXT);

-- Create policy to allow the system to update usage data
CREATE POLICY "Allow system to update usage data" 
ON user_usage 
FOR ALL 
TO authenticated
USING (true);

-- Create a function to increment the analyze count
CREATE OR REPLACE FUNCTION increment_analyze_count(p_user_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- Insert a record if it doesn't exist, otherwise update the existing record
  INSERT INTO user_usage (user_id, analyze_count, last_analyze_date)
  VALUES (p_user_id, 1, NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    analyze_count = user_usage.analyze_count + 1,
    last_analyze_date = NOW(),
    updated_at = NOW()
  RETURNING analyze_count INTO current_count;
  
  RETURN current_count;
END;
$$ LANGUAGE plpgsql; 