-- Add quota tracking columns to user_subscriptions table
ALTER TABLE IF EXISTS user_subscriptions 
ADD COLUMN IF NOT EXISTS quota_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_quota INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS last_quota_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create a function to reset the user's quota on a monthly basis
CREATE OR REPLACE FUNCTION reset_user_quota()
RETURNS TRIGGER AS $$
DECLARE
  last_reset TIMESTAMP;
  now_time TIMESTAMP := NOW();
BEGIN
  -- Get the last time the quota was reset
  last_reset := OLD.last_quota_reset;
  
  -- If it's been more than 30 days since the last reset
  IF last_reset IS NULL OR now_time - last_reset >= INTERVAL '30 days' THEN
    NEW.quota_used := 0;
    NEW.last_quota_reset := now_time;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to reset the quota when the subscription is accessed
CREATE TRIGGER reset_monthly_quota
BEFORE UPDATE ON user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION reset_user_quota();

-- Create a function to check and increment the user's quota
CREATE OR REPLACE FUNCTION check_and_increment_quota(p_user_id TEXT)
RETURNS JSONB AS $$
DECLARE
  user_sub RECORD;
  now_time TIMESTAMP := NOW();
  result JSONB;
BEGIN
  -- Get the user's active subscription
  SELECT * INTO user_sub FROM user_subscriptions 
  WHERE user_id = p_user_id 
  AND status = 'active' 
  AND start_date <= now_time 
  AND end_date >= now_time
  ORDER BY created_at DESC LIMIT 1;
  
  -- If user doesn't have an active subscription
  IF user_sub IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'No active subscription found',
      'quota_remaining', 0,
      'requires_upgrade', true
    );
  END IF;
  
  -- Check if quota needs to be reset
  IF user_sub.last_quota_reset IS NULL OR now_time - user_sub.last_quota_reset >= INTERVAL '30 days' THEN
    UPDATE user_subscriptions 
    SET quota_used = 0, 
        last_quota_reset = now_time
    WHERE id = user_sub.id;
    
    -- Refresh user_sub record with updated values
    SELECT * INTO user_sub FROM user_subscriptions WHERE id = user_sub.id;
  END IF;
  
  -- Check if user has exceeded their quota
  IF user_sub.quota_used >= user_sub.monthly_quota THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Monthly analysis quota exceeded',
      'quota_used', user_sub.quota_used,
      'quota_limit', user_sub.monthly_quota,
      'quota_remaining', 0,
      'reset_date', user_sub.last_quota_reset + INTERVAL '30 days',
      'requires_upgrade', true
    );
  END IF;
  
  -- Increment the quota
  UPDATE user_subscriptions 
  SET quota_used = quota_used + 1
  WHERE id = user_sub.id
  RETURNING quota_used INTO user_sub.quota_used;
  
  -- Return success with quota information
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Analysis quota updated',
    'quota_used', user_sub.quota_used,
    'quota_limit', user_sub.monthly_quota,
    'quota_remaining', user_sub.monthly_quota - user_sub.quota_used,
    'reset_date', user_sub.last_quota_reset + INTERVAL '30 days'
  );
END;
$$ LANGUAGE plpgsql;

-- Update the default plan for Starter to have 5 analyses per month
UPDATE subscription_plans
SET features = jsonb_build_object('features', ARRAY['Basic muscle analysis', '5 analyses per month', 'Email support'], 'monthly_quota', 5)
WHERE name = 'Starter';

-- Update the Pro plan to have 20 analyses per month
UPDATE subscription_plans
SET features = jsonb_build_object('features', ARRAY['Advanced muscle analysis', '20 analyses per month', 'Priority support', 'Workout recommendations', 'Progress tracking'], 'monthly_quota', 20)
WHERE name = 'Pro' OR name = 'Enterprise';

-- Update the Ultimate plan to have 100 analyses per month
UPDATE subscription_plans
SET features = jsonb_build_object('features', ARRAY['Premium muscle analysis', '100 analyses per month', '24/7 support', 'Advanced analytics', 'Custom workout plans'], 'monthly_quota', 100)
WHERE name = 'Ultimate' OR name = 'Business'; 