-- Update Pro plan price in subscription_plans table
UPDATE subscription_plans
SET price = 599
WHERE name IN ('Pro', 'Enterprise');

-- Update Ultimate plan price in subscription_plans table
UPDATE subscription_plans
SET price = 999
WHERE name IN ('Ultimate', 'Business');

-- Ensure the Pro plan features mention the updated price
UPDATE subscription_plans
SET features = jsonb_build_object(
  'features', ARRAY['Advanced muscle analysis', '20 analyses per month', 'Priority support', 'Workout recommendations', 'Progress tracking'],
  'monthly_quota', 20,
  'price', 599
)
WHERE name IN ('Pro', 'Enterprise');

-- Ensure the Ultimate plan features mention the updated price
UPDATE subscription_plans
SET features = jsonb_build_object(
  'features', ARRAY['Premium muscle analysis', '100 analyses per month', '24/7 support', 'Advanced analytics', 'Custom workout plans'],
  'monthly_quota', 100,
  'price', 999
)
WHERE name IN ('Ultimate', 'Business');

-- Update existing subscriptions to reflect new price
UPDATE user_subscriptions
SET monthly_quota = 20  -- Ensure proper quota is set
FROM subscription_plans
WHERE user_subscriptions.plan_id = subscription_plans.id
  AND user_subscriptions.status = 'active'
  AND (subscription_plans.name = 'Pro' OR subscription_plans.name = 'Enterprise');

-- Update existing Ultimate subscriptions to reflect new price
UPDATE user_subscriptions
SET monthly_quota = 100  -- Ensure proper quota is set
FROM subscription_plans
WHERE user_subscriptions.plan_id = subscription_plans.id
  AND user_subscriptions.status = 'active'
  AND (subscription_plans.name = 'Ultimate' OR subscription_plans.name = 'Business');

-- Log price update in a system table (create if not exists)
CREATE TABLE IF NOT EXISTS system_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  changes JSONB,
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert audit log entry for Pro plan
INSERT INTO system_audit_log (action, table_name, changes)
VALUES (
  'UPDATE_PRICE',
  'subscription_plans',
  jsonb_build_object(
    'plan', 'Pro',
    'old_price', 999,
    'new_price', 599,
    'reason', 'Price adjustment'
  )
);

-- Insert audit log entry for Ultimate plan
INSERT INTO system_audit_log (action, table_name, changes)
VALUES (
  'UPDATE_PRICE',
  'subscription_plans',
  jsonb_build_object(
    'plan', 'Ultimate',
    'old_price', 1999,
    'new_price', 999,
    'reason', 'Price adjustment'
  )
); 