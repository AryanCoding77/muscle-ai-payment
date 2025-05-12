-- Create a table to track Razorpay webhook events
CREATE TABLE IF NOT EXISTS razorpay_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_id TEXT,
  payload JSONB,
  signature TEXT,
  verified BOOLEAN DEFAULT FALSE,
  processed BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on event_type for faster lookups
CREATE INDEX IF NOT EXISTS idx_razorpay_webhook_events_type ON razorpay_webhook_events(event_type);

-- Create an index on event_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_razorpay_webhook_events_id ON razorpay_webhook_events(event_id);

-- Add timestamp trigger for razorpay_orders
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for razorpay_orders
DROP TRIGGER IF EXISTS update_razorpay_orders_timestamp ON razorpay_orders;
CREATE TRIGGER update_razorpay_orders_timestamp
BEFORE UPDATE ON razorpay_orders
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add trigger for subscription_transactions
DROP TRIGGER IF EXISTS update_subscription_transactions_timestamp ON subscription_transactions;
CREATE TRIGGER update_subscription_transactions_timestamp
BEFORE UPDATE ON subscription_transactions
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add trigger for razorpay_webhook_events
DROP TRIGGER IF EXISTS update_razorpay_webhook_events_timestamp ON razorpay_webhook_events;
CREATE TRIGGER update_razorpay_webhook_events_timestamp
BEFORE UPDATE ON razorpay_webhook_events
FOR EACH ROW
EXECUTE FUNCTION update_modified_column(); 