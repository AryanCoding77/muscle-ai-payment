-- Update all subscription plans to use USD currency and update the prices
-- First update the plan prices
UPDATE subscription_plans
SET price = 4, currency = 'USD'
WHERE name = 'Starter';

UPDATE subscription_plans
SET price = 7, currency = 'USD'
WHERE name = 'Pro' OR name = 'Enterprise';

UPDATE subscription_plans
SET price = 14, currency = 'USD'
WHERE name = 'Ultimate' OR name = 'Business';

-- Update any subscription transactions to use USD
UPDATE subscription_transactions
SET currency = 'USD'
WHERE currency = 'INR';

-- Log the changes
INSERT INTO change_log (component, message)
VALUES ('MIGRATION', 'Updated all subscription plans to use USD currency');

-- Create a new function to convert INR to USD when needed
CREATE OR REPLACE FUNCTION convert_inr_to_usd(amount_inr numeric)
RETURNS numeric AS $$
BEGIN
  -- Approximate conversion at 1 USD = 80 INR
  RETURN ROUND(amount_inr / 80);
END;
$$ LANGUAGE plpgsql;

-- Add a default_currency setting to the system_settings table if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'system_settings'
  ) THEN
    INSERT INTO system_settings (key, value)
    VALUES ('default_currency', 'USD')
    ON CONFLICT (key) DO UPDATE SET value = 'USD';
  END IF;
END $$; 