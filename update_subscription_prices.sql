-- Update subscription plan prices to new USD values
-- Starter plan: $4
UPDATE subscription_plans
SET price = 4, currency = 'USD',
    features = jsonb_set(
      CASE
        WHEN features IS NULL THEN '{}'::jsonb
        ELSE features
      END,
      '{price}',
      '4'::jsonb
    )
WHERE name = 'Starter';

-- Pro/Enterprise plan: $7
UPDATE subscription_plans
SET price = 7, currency = 'USD',
    features = jsonb_set(
      CASE
        WHEN features IS NULL THEN '{}'::jsonb
        ELSE features
      END,
      '{price}',
      '7'::jsonb
    )
WHERE name IN ('Pro', 'Enterprise');

-- Ultimate/Business plan: $14
UPDATE subscription_plans
SET price = 14, currency = 'USD',
    features = jsonb_set(
      CASE
        WHEN features IS NULL THEN '{}'::jsonb
        ELSE features
      END,
      '{price}',
      '14'::jsonb
    )
WHERE name IN ('Ultimate', 'Business');

-- Ensure all transactions use USD
UPDATE subscription_transactions
SET currency = 'USD'
WHERE currency <> 'USD';

-- Check the updated plans
SELECT id, name, price, currency, features
FROM subscription_plans
ORDER BY price ASC; 