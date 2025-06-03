require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase URL or service role key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixQuotaResetFunction() {
  console.log('Checking and fixing quota reset functionality...');

  try {
    // 1. First, check if any subscriptions have NULL last_quota_reset
    const { data: nullResetSubscriptions, error: nullResetError } = await supabase
      .from('user_subscriptions')
      .select('id, user_id, quota_used, monthly_quota, last_quota_reset')
      .is('last_quota_reset', null)
      .eq('status', 'active');

    if (nullResetError) {
      console.error('Error checking for NULL last_quota_reset:', nullResetError);
    } else if (nullResetSubscriptions && nullResetSubscriptions.length > 0) {
      console.log(`Found ${nullResetSubscriptions.length} subscriptions with NULL last_quota_reset`);
      
      // Fix by setting last_quota_reset to current time
      const { data: updateResult, error: updateError } = await supabase
        .from('user_subscriptions')
        .update({ last_quota_reset: new Date().toISOString() })
        .is('last_quota_reset', null)
        .eq('status', 'active');
        
      if (updateError) {
        console.error('Error fixing NULL last_quota_reset:', updateError);
      } else {
        console.log('Fixed subscriptions with NULL last_quota_reset');
      }
    } else {
      console.log('No subscriptions with NULL last_quota_reset found');
    }

    // 2. Check if any subscriptions have last_quota_reset older than 30 days but quota not reset
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: oldResetSubscriptions, error: oldResetError } = await supabase
      .from('user_subscriptions')
      .select('id, user_id, quota_used, monthly_quota, last_quota_reset')
      .lt('last_quota_reset', thirtyDaysAgo.toISOString())
      .gt('quota_used', 0)  // Only those with non-zero quota_used
      .eq('status', 'active');

    if (oldResetError) {
      console.error('Error checking for old last_quota_reset:', oldResetError);
    } else if (oldResetSubscriptions && oldResetSubscriptions.length > 0) {
      console.log(`Found ${oldResetSubscriptions.length} subscriptions with last_quota_reset older than 30 days but quota not reset`);
      
      // Fix by resetting quota_used to 0 and updating last_quota_reset
      const { data: updateResult, error: updateError } = await supabase
        .from('user_subscriptions')
        .update({ 
          quota_used: 0,
          last_quota_reset: new Date().toISOString() 
        })
        .lt('last_quota_reset', thirtyDaysAgo.toISOString())
        .gt('quota_used', 0)
        .eq('status', 'active');
        
      if (updateError) {
        console.error('Error fixing old last_quota_reset:', updateError);
      } else {
        console.log('Fixed subscriptions with old last_quota_reset');
      }
    } else {
      console.log('No subscriptions with outdated quota resets found');
    }

    // 3. Recreate the reset_user_quota function and trigger to ensure it's up to date
    console.log('Recreating the reset_user_quota function and trigger...');
    
    // Recreate the function and trigger using raw SQL
    const createFunctionSQL = `
    -- Create a function to reset the user's quota on a monthly basis
    CREATE OR REPLACE FUNCTION reset_user_quota()
    RETURNS TRIGGER AS $$
    DECLARE
      last_reset TIMESTAMP WITH TIME ZONE;
      now_time TIMESTAMP WITH TIME ZONE := NOW();
    BEGIN
      -- Get the last time the quota was reset
      last_reset := OLD.last_quota_reset;
      
      -- If it's been more than 30 days since the last reset
      IF last_reset IS NULL OR now_time - last_reset >= INTERVAL '30 days' THEN
        NEW.quota_used := 0;
        NEW.last_quota_reset := now_time;
      END IF;
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Drop the trigger if it exists
    DROP TRIGGER IF EXISTS reset_monthly_quota ON user_subscriptions;

    -- Create a trigger to reset the quota when the subscription is accessed
    CREATE TRIGGER reset_monthly_quota
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION reset_user_quota();
    `;
    
    // Execute the SQL directly using a Postgres function
    const { error: recreateError } = await supabase.rpc('exec_sql', { sql: createFunctionSQL });
    
    if (recreateError) {
      console.error('Error recreating function and trigger:', recreateError);
      
      // If the exec_sql RPC doesn't exist, we'll need to create a migration file
      console.log('Creating a migration file for manual execution...');
      const fs = require('fs');
      const migrationFile = 'fix-quota-reset-function.sql';
      fs.writeFileSync(migrationFile, createFunctionSQL);
      console.log(`Created migration file: ${migrationFile}`);
      console.log('Please run this SQL file manually in your Supabase SQL editor');
    } else {
      console.log('Successfully recreated reset_user_quota function and trigger');
    }

    // 4. Check if any subscriptions have incorrect monthly_quota based on their plan
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('user_subscriptions')
      .select('id, plan_id, monthly_quota, subscription_plans:plan_id(name)')
      .eq('status', 'active');

    if (subscriptionsError) {
      console.error('Error fetching subscriptions:', subscriptionsError);
    } else if (subscriptions && subscriptions.length > 0) {
      console.log(`Checking monthly_quota for ${subscriptions.length} active subscriptions`);
      
      const updates = [];
      
      for (const sub of subscriptions) {
        const planName = sub.subscription_plans?.name;
        if (!planName) continue;
        
        let expectedQuota = 5; // Default for Starter
        
        if (planName === 'Pro' || planName === 'Enterprise') {
          expectedQuota = 20;
        } else if (planName === 'Ultimate' || planName === 'Business') {
          expectedQuota = 100;
        }
        
        if (sub.monthly_quota !== expectedQuota) {
          console.log(`Fixing monthly_quota for subscription ${sub.id} (${planName}): ${sub.monthly_quota} -> ${expectedQuota}`);
          
          const { data, error } = await supabase
            .from('user_subscriptions')
            .update({ monthly_quota: expectedQuota })
            .eq('id', sub.id);
            
          if (error) {
            console.error(`Error updating monthly_quota for subscription ${sub.id}:`, error);
          } else {
            updates.push({ id: sub.id, planName, oldQuota: sub.monthly_quota, newQuota: expectedQuota });
          }
        }
      }
      
      console.log(`Fixed monthly_quota for ${updates.length} subscriptions`);
    }

    // 5. Create a test function to manually check if the quota reset works
    console.log('Creating a test function for manual quota reset testing...');
    
    const testFunctionSQL = `
    -- Create a function to manually test quota reset
    CREATE OR REPLACE FUNCTION test_quota_reset(p_user_id TEXT)
    RETURNS JSONB AS $$
    DECLARE
      user_sub RECORD;
      old_quota INTEGER;
      new_quota INTEGER;
      old_reset TIMESTAMP WITH TIME ZONE;
      new_reset TIMESTAMP WITH TIME ZONE;
      result JSONB;
    BEGIN
      -- Get the user's active subscription
      SELECT * INTO user_sub FROM user_subscriptions 
      WHERE user_id = p_user_id 
      AND status = 'active'
      ORDER BY created_at DESC LIMIT 1;
      
      -- If user doesn't have an active subscription
      IF user_sub IS NULL THEN
        RETURN jsonb_build_object(
          'success', false,
          'message', 'No active subscription found'
        );
      END IF;
      
      -- Store original values
      old_quota := user_sub.quota_used;
      old_reset := user_sub.last_quota_reset;
      
      -- Force the last_quota_reset to be more than 30 days ago
      UPDATE user_subscriptions
      SET last_quota_reset = NOW() - INTERVAL '31 days'
      WHERE id = user_sub.id
      RETURNING quota_used, last_quota_reset INTO user_sub.quota_used, user_sub.last_quota_reset;
      
      -- Now trigger the reset by updating the record
      UPDATE user_subscriptions
      SET quota_used = user_sub.quota_used
      WHERE id = user_sub.id
      RETURNING quota_used, last_quota_reset INTO new_quota, new_reset;
      
      -- Return the test results
      RETURN jsonb_build_object(
        'success', true,
        'message', 'Quota reset test completed',
        'original_quota', old_quota,
        'original_reset', old_reset,
        'new_quota', new_quota,
        'new_reset', new_reset,
        'reset_worked', new_quota = 0 AND new_reset > old_reset
      );
    END;
    $$ LANGUAGE plpgsql;
    `;
    
    // Execute the SQL directly using a Postgres function
    const { error: testFunctionError } = await supabase.rpc('exec_sql', { sql: testFunctionSQL });
    
    if (testFunctionError) {
      console.error('Error creating test function:', testFunctionError);
      
      // If the exec_sql RPC doesn't exist, we'll need to create a migration file
      console.log('Creating a migration file for manual execution...');
      const fs = require('fs');
      const testFunctionFile = 'test-quota-reset-function.sql';
      fs.writeFileSync(testFunctionFile, testFunctionSQL);
      console.log(`Created test function file: ${testFunctionFile}`);
      console.log('Please run this SQL file manually in your Supabase SQL editor');
    } else {
      console.log('Successfully created test_quota_reset function');
      console.log('You can test the quota reset functionality with: SELECT test_quota_reset(\'your-user-id\');');
    }

    console.log('Quota reset function check and fix completed');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the fix function
fixQuotaResetFunction().catch(console.error); 