-- Drop the subscription_transactions table and related policies
DO $$
BEGIN
    -- Drop policies if they exist
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscription_transactions' 
        AND policyname = 'Allow authenticated users to view their transactions'
    ) THEN
        DROP POLICY "Allow authenticated users to view their transactions" ON subscription_transactions;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscription_transactions' 
        AND policyname = 'Allow users to create transactions'
    ) THEN
        DROP POLICY "Allow users to create transactions" ON subscription_transactions;
    END IF;

    -- Drop triggers if they exist
    IF EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_subscription_transactions_updated_at'
    ) THEN
        DROP TRIGGER IF EXISTS update_subscription_transactions_updated_at ON subscription_transactions;
    END IF;

    -- Drop indices if they exist
    DROP INDEX IF EXISTS idx_subscription_transactions_user_id;
    DROP INDEX IF EXISTS idx_subscription_transactions_razorpay_payment_id;
    
    -- Finally drop the table
    DROP TABLE IF EXISTS subscription_transactions;
END $$; 