-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 30,
  features JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription_transactions table
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

-- Set up Row Level Security
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts and updates for authenticated users
CREATE POLICY "Allow admins to manage subscription plans" 
ON subscription_plans 
FOR ALL
TO authenticated
USING (true);

-- Create policy to allow inserts and selects for authenticated users
CREATE POLICY "Allow authenticated users to view their subscriptions" 
ON user_subscriptions 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid()::TEXT);

-- Create policy to allow inserts for authenticated users
CREATE POLICY "Allow users to create subscriptions" 
ON user_subscriptions 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid()::TEXT);

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

-- Create trigger to automatically update the updated_at timestamp for transactions
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

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price, duration_days, features) 
VALUES 
  ('Starter', 'For individuals starting their fitness journey.', 1999, 30, '{"features": ["Basic muscle analysis", "5 analyses per month", "Email support"]}'),
  ('Enterprise', 'For dedicated fitness enthusiasts.', 4999, 30, '{"features": ["Advanced muscle analysis", "25 analyses per month", "Priority support"]}'),
  ('Business', 'For professional fitness trainers.', 7499, 30, '{"features": ["Expert-level analysis", "Unlimited analyses", "24/7 dedicated support"]}');

-- Grant permissions
GRANT SELECT ON subscription_plans TO anon, authenticated;
GRANT SELECT, INSERT ON user_subscriptions TO authenticated;
GRANT SELECT, INSERT ON subscription_transactions TO authenticated; 