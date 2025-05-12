-- Update subscription plans to use the new USD pricing
UPDATE subscription_plans
SET price = 4, currency = 'USD'
WHERE name = 'Starter';

UPDATE subscription_plans
SET price = 7, currency = 'USD'
WHERE name IN ('Pro', 'Enterprise');

UPDATE subscription_plans
SET price = 14, currency = 'USD'
WHERE name IN ('Ultimate', 'Business');

-- Update any features that might contain price info
UPDATE subscription_plans
SET features = jsonb_set(
  features,
  '{price}',
  '4'::jsonb
)
WHERE name = 'Starter';

UPDATE subscription_plans
SET features = jsonb_set(
  features,
  '{price}',
  '7'::jsonb
)
WHERE name IN ('Pro', 'Enterprise');

UPDATE subscription_plans
SET features = jsonb_set(
  features,
  '{price}',
  '14'::jsonb
)
WHERE name IN ('Ultimate', 'Business');

-- Ensure all transactions use USD currency
UPDATE subscription_transactions
SET currency = 'USD'
WHERE currency = 'INR';

-- Log the changes
SELECT 'Updated subscription plans to $4, $7, and $14 pricing' as message;

-- Display the updated plans to verify
SELECT id, name, price, currency, features
FROM subscription_plans
ORDER BY price; 