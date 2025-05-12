-- Fix monthly quota for existing Pro plan subscriptions
UPDATE user_subscriptions
SET monthly_quota = 20
FROM subscription_plans
WHERE user_subscriptions.plan_id = subscription_plans.id
  AND user_subscriptions.status = 'active'
  AND (subscription_plans.name = 'Pro' OR subscription_plans.name = 'Enterprise')
  AND user_subscriptions.monthly_quota != 20;

-- Fix monthly quota for existing Ultimate plan subscriptions
UPDATE user_subscriptions
SET monthly_quota = 100
FROM subscription_plans
WHERE user_subscriptions.plan_id = subscription_plans.id
  AND user_subscriptions.status = 'active'
  AND (subscription_plans.name = 'Ultimate' OR subscription_plans.name = 'Business')
  AND user_subscriptions.monthly_quota != 100;

-- Ensure the Pro plan has 20 analyses in its features
UPDATE subscription_plans
SET features = jsonb_build_object(
  'features', ARRAY['Advanced muscle analysis', '20 analyses per month', 'Priority support', 'Workout recommendations', 'Progress tracking'],
  'monthly_quota', 20
)
WHERE name IN ('Pro', 'Enterprise');

-- Ensure the Ultimate plan has 100 analyses in its features
UPDATE subscription_plans
SET features = jsonb_build_object(
  'features', ARRAY['Premium muscle analysis', '100 analyses per month', '24/7 support', 'Advanced analytics', 'Custom workout plans'],
  'monthly_quota', 100
)
WHERE name IN ('Ultimate', 'Business'); 