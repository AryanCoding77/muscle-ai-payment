-- Create subscription_transactions table with proper structure
CREATE TABLE IF NOT EXISTS subscription_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id),
  razorpay_payment_id TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscription_transactions_user_id 
ON subscription_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_subscription_transactions_plan_id 
ON subscription_transactions(plan_id);

CREATE INDEX IF NOT EXISTS idx_subscription_transactions_razorpay_payment_id 
ON subscription_transactions(razorpay_payment_id);

-- Set up Row Level Security
ALTER TABLE subscription_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own transactions
CREATE POLICY "Allow authenticated users to view their transactions" 
ON subscription_transactions 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid()::TEXT);

-- Create policy to allow users to create their own transactions
CREATE POLICY "Allow users to create transactions" 
ON subscription_transactions 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid()::TEXT);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscription_transactions_updated_at
BEFORE UPDATE ON subscription_transactions
FOR EACH ROW
EXECUTE FUNCTION trigger_update_timestamp();

-- Grant permissions
GRANT SELECT, INSERT ON subscription_transactions TO authenticated; 