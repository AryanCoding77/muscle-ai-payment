-- Fix the quota reset functionality

-- Add quota tracking columns to user_subscriptions table if they don't exist
ALTER TABLE IF EXISTS user_subscriptions 
ADD COLUMN IF NOT EXISTS quota_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_quota INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS last_quota_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create a function to reset the user's quota on a monthly basis
CREATE OR REPLACE FUNCTION reset_user_quota()
RETURNS TRIGGER AS $$
DECLARE
  last_reset TIMESTAMP WITH TIME ZONE;
  now_time TIMESTAMP WITH TIME ZONE := NOW();
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

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS reset_monthly_quota ON user_subscriptions;

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
  now_time TIMESTAMP WITH TIME ZONE := NOW();
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

-- Update any NULL last_quota_reset values
UPDATE user_subscriptions
SET last_quota_reset = NOW()
WHERE last_quota_reset IS NULL;

-- Reset quota for subscriptions where last_quota_reset is more than 30 days old
UPDATE user_subscriptions
SET quota_used = 0, 
    last_quota_reset = NOW()
WHERE last_quota_reset < NOW() - INTERVAL '30 days'
  AND quota_used > 0
  AND status = 'active';

-- Fix monthly quota values based on plan name
UPDATE user_subscriptions
SET monthly_quota = 20
FROM subscription_plans
WHERE user_subscriptions.plan_id = subscription_plans.id
  AND user_subscriptions.status = 'active'
  AND (subscription_plans.name = 'Pro' OR subscription_plans.name = 'Enterprise')
  AND user_subscriptions.monthly_quota != 20;

UPDATE user_subscriptions
SET monthly_quota = 100
FROM subscription_plans
WHERE user_subscriptions.plan_id = subscription_plans.id
  AND user_subscriptions.status = 'active'
  AND (subscription_plans.name = 'Ultimate' OR subscription_plans.name = 'Business')
  AND user_subscriptions.monthly_quota != 100;

-- Create a test function to manually verify quota reset
CREATE OR REPLACE FUNCTION test_quota_reset(p_user_id TEXT)
RETURNS JSONB AS $$
DECLARE
  user_sub RECORD;
  old_quota INTEGER;
  new_quota INTEGER;
  old_reset TIMESTAMP WITH TIME ZONE;
  new_reset TIMESTAMP WITH TIME ZONE;
  result JSONB;
BEGIN
  -- Get the user's active subscription
  SELECT * INTO user_sub FROM user_subscriptions 
  WHERE user_id = p_user_id 
  AND status = 'active'
  ORDER BY created_at DESC LIMIT 1;
  
  -- If user doesn't have an active subscription
  IF user_sub IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'No active subscription found'
    );
  END IF;
  
  -- Store original values
  old_quota := user_sub.quota_used;
  old_reset := user_sub.last_quota_reset;
  
  -- Force the last_quota_reset to be more than 30 days ago
  UPDATE user_subscriptions
  SET last_quota_reset = NOW() - INTERVAL '31 days'
  WHERE id = user_sub.id
  RETURNING quota_used, last_quota_reset INTO user_sub.quota_used, user_sub.last_quota_reset;
  
  -- Now trigger the reset by updating the record
  UPDATE user_subscriptions
  SET quota_used = user_sub.quota_used
  WHERE id = user_sub.id
  RETURNING quota_used, last_quota_reset INTO new_quota, new_reset;
  
  -- Return the test results
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Quota reset test completed',
    'original_quota', old_quota,
    'original_reset', old_reset,
    'new_quota', new_quota,
    'new_reset', new_reset,
    'reset_worked', new_quota = 0 AND new_reset > old_reset
  );
END;
$$ LANGUAGE plpgsql; 