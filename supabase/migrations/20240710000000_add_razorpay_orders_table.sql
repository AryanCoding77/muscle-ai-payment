-- Create a table to track Razorpay orders for verification
CREATE TABLE IF NOT EXISTS razorpay_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'created',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_razorpay_orders_order_id ON razorpay_orders(order_id);

-- Create an index on user_id for faster user-based lookups
CREATE INDEX IF NOT EXISTS idx_razorpay_orders_user_id ON razorpay_orders(user_id);

-- Set up Row Level Security
ALTER TABLE razorpay_orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own orders
CREATE POLICY "Allow users to view their own orders" 
ON razorpay_orders 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid()::TEXT);

-- Create policy to allow the system to manage orders
CREATE POLICY "Allow system to manage orders" 
ON razorpay_orders 
FOR ALL 
TO service_role
USING (true);

-- Add verified column to subscription_transactions table if it doesn't exist
ALTER TABLE subscription_transactions 
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;

-- Create index on razorpay_order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscription_transactions_order_id 
ON subscription_transactions(razorpay_order_id); 