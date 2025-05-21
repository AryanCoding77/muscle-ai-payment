-- Drop the subscription_transactions table if it exists
DROP TABLE IF EXISTS subscription_transactions;

-- Remove any foreign key references that might point to subscription_transactions
DO $$ 
DECLARE
    constraints RECORD;
BEGIN
    FOR constraints IN (
        SELECT tc.constraint_name, tc.table_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = 'subscription_transactions'
    ) LOOP
        EXECUTE 'ALTER TABLE ' || constraints.table_name || ' DROP CONSTRAINT ' || constraints.constraint_name;
    END LOOP;
END $$; 