-- Add referral_code column to subscription_transactions table
ALTER TABLE subscription_transactions 
ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- Add referral_code column to razorpay_orders table
ALTER TABLE razorpay_orders 
ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- Create index on referral_code for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscription_transactions_referral_code 
ON subscription_transactions(referral_code);

CREATE INDEX IF NOT EXISTS idx_razorpay_orders_referral_code 
ON razorpay_orders(referral_code);

-- Create a function to get referral statistics
CREATE OR REPLACE FUNCTION get_referral_stats()
RETURNS TABLE (
  referral_code TEXT,
  total_transactions BIGINT,
  total_revenue NUMERIC,
  currency TEXT
) 
LANGUAGE SQL
AS $$
  SELECT 
    COALESCE(referral_code, 'direct') as referral_code,
    COUNT(*) as total_transactions,
    SUM(amount) as total_revenue,
    MAX(currency) as currency
  FROM subscription_transactions
  GROUP BY COALESCE(referral_code, 'direct')
  ORDER BY total_revenue DESC;
$$;

-- Create a function to check if another function exists
CREATE OR REPLACE FUNCTION function_exists(function_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = function_name
  );
END;
$$; 