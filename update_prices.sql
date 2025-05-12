-- Update Pro plan price in subscription_plans table
UPDATE subscription_plans
SET price = 599
WHERE name IN ('Pro', 'Enterprise');

-- Update Ultimate plan price in subscription_plans table
UPDATE subscription_plans
SET price = 999
WHERE name IN ('Ultimate', 'Business');

-- Update Starter plan price in subscription_plans table
UPDATE subscription_plans
SET price = 299
WHERE name = 'Starter';

-- Ensure the Starter plan features mention the updated price
UPDATE subscription_plans
SET features = jsonb_build_object(
  'features', ARRAY['Basic muscle analysis', '5 analyses per month', 'Email support'],
  'monthly_quota', 5,
  'price', 299
)
WHERE name = 'Starter';

-- This will show you the updated prices to confirm
SELECT id, name, price, features 
FROM subscription_plans
WHERE name IN ('Pro', 'Enterprise', 'Ultimate', 'Business', 'Starter'); 