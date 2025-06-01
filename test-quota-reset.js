const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables directly from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
  }
});

// Initialize Supabase admin client
const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase URL or service role key');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '(exists)' : '(missing)');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase key exists:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuotaReset() {
  try {
    // 1. Get a user ID from command line arguments or use a default test user ID in Auth0 format
    const userId = process.argv[2] || 'auth0|test123456789';
    console.log(`Testing quota reset for user: ${userId}`);

    // 2. Get the user's active subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('id, user_id, plan_id, quota_used, monthly_quota, last_quota_reset, subscription_plans:plan_id(name)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subError) {
      console.error('Error fetching subscription:', subError);
      console.log('No active subscription found for this user.');
      console.log('Creating a test subscription for this user...');
      
      // Get the Starter plan ID
      const { data: starterPlan, error: planError } = await supabase
        .from('subscription_plans')
        .select('id')
        .eq('name', 'Starter')
        .single();
        
      if (planError) {
        console.error('Error fetching Starter plan:', planError);
        return;
      }
      
      // Create a test subscription
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(now.getDate() + 30); // 30 days from now
      
      const { data: newSub, error: createError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: starterPlan.id,
          status: 'active',
          start_date: now.toISOString(),
          end_date: endDate.toISOString(),
          quota_used: 3, // Set some initial usage
          monthly_quota: 5, // Starter plan quota
          last_quota_reset: now.toISOString()
        })
        .select()
        .single();
        
      if (createError) {
        console.error('Error creating test subscription:', createError);
        return;
      }
      
      console.log('Created test subscription:', newSub);
      console.log('Please run this script again to test the quota reset.');
      return;
    }

    console.log('Current subscription state:');
    console.log('- Plan:', subscription.subscription_plans?.name || 'Unknown');
    console.log('- Quota used:', subscription.quota_used, 'of', subscription.monthly_quota);
    console.log('- Last reset:', new Date(subscription.last_quota_reset).toLocaleString());
    
    const resetDate = new Date(subscription.last_quota_reset);
    resetDate.setDate(resetDate.getDate() + 30);
    console.log('- Next reset due:', resetDate.toLocaleString());

    // 3. Test the quota reset function
    console.log('\nTesting quota reset function...');
    
    // First, let's check if the check_and_increment_quota function exists
    try {
      const { data: checkResult, error: checkError } = await supabase.rpc(
        'check_and_increment_quota',
        { p_user_id: userId }
      );
      
      if (checkError) {
        console.error('Error with check_and_increment_quota function:', checkError);
        console.log('The function may not exist or there might be an issue with it.');
        console.log('Please run the SQL in fix-quota-reset-function.sql to create/fix the function.');
        
        // Generate the SQL file if it doesn't exist
        if (!fs.existsSync('fix-quota-reset-function.sql')) {
          console.log('Creating SQL file with the function definition...');
          const sql = `
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

          -- Create a function to check and increment the user's quota
          CREATE OR REPLACE FUNCTION check_and_increment_quota(p_user_id TEXT)
          RETURNS JSONB AS $$
          DECLARE
            user_sub RECORD;
            now_time TIMESTAMP WITH TIME ZONE := NOW();
            result JSONB;
          BEGIN
            -- Get the user's active subscription
            SELECT * INTO user_sub FROM user_subscriptions 
            WHERE user_id = p_user_id 
            AND status = 'active' 
            AND start_date <= now_time 
            AND end_date >= now_time
            ORDER BY created_at DESC LIMIT 1;
            
            -- If user doesn't have an active subscription
            IF user_sub IS NULL THEN
              RETURN jsonb_build_object(
                'success', false,
                'message', 'No active subscription found',
                'quota_remaining', 0,
                'requires_upgrade', true
              );
            END IF;
            
            -- Check if quota needs to be reset
            IF user_sub.last_quota_reset IS NULL OR now_time - user_sub.last_quota_reset >= INTERVAL '30 days' THEN
              UPDATE user_subscriptions 
              SET quota_used = 0, 
                  last_quota_reset = now_time
              WHERE id = user_sub.id;
              
              -- Refresh user_sub record with updated values
              SELECT * INTO user_sub FROM user_subscriptions WHERE id = user_sub.id;
            END IF;
            
            -- Check if user has exceeded their quota
            IF user_sub.quota_used >= user_sub.monthly_quota THEN
              RETURN jsonb_build_object(
                'success', false,
                'message', 'Monthly analysis quota exceeded',
                'quota_used', user_sub.quota_used,
                'quota_limit', user_sub.monthly_quota,
                'quota_remaining', 0,
                'reset_date', user_sub.last_quota_reset + INTERVAL '30 days',
                'requires_upgrade', true
              );
            END IF;
            
            -- Increment the quota
            UPDATE user_subscriptions 
            SET quota_used = quota_used + 1
            WHERE id = user_sub.id
            RETURNING quota_used INTO user_sub.quota_used;
            
            -- Return success with quota information
            RETURN jsonb_build_object(
              'success', true,
              'message', 'Analysis quota updated',
              'quota_used', user_sub.quota_used,
              'quota_limit', user_sub.monthly_quota,
              'quota_remaining', user_sub.monthly_quota - user_sub.quota_used,
              'reset_date', user_sub.last_quota_reset + INTERVAL '30 days'
            );
          END;
          $$ LANGUAGE plpgsql;
          `;
          
          fs.writeFileSync('fix-quota-reset-function.sql', sql);
          console.log('SQL file created. Please run it in your Supabase SQL editor.');
        }
        
        return;
      }
      
      console.log('check_and_increment_quota function exists and is working.');
      console.log('Quota check result:', checkResult);
    } catch (error) {
      console.error('Error testing check_and_increment_quota function:', error);
      return;
    }
    
    // Option 1: Use the test_quota_reset function if available
    try {
      const { data: testResult, error: testError } = await supabase.rpc(
        'test_quota_reset',
        { p_user_id: userId }
      );
      
      if (testError) {
        console.error('Error running test_quota_reset function:', testError);
        console.log('Falling back to manual testing...');
      } else {
        console.log('Test results:', testResult);
        
        if (testResult.reset_worked) {
          console.log('✅ Quota reset function is working correctly!');
        } else {
          console.log('❌ Quota reset function is NOT working correctly!');
          console.log('Original quota:', testResult.original_quota);
          console.log('New quota:', testResult.new_quota);
          console.log('Original reset date:', new Date(testResult.original_reset).toLocaleString());
          console.log('New reset date:', new Date(testResult.new_reset).toLocaleString());
        }
        
        return;
      }
    } catch (rpcError) {
      console.error('test_quota_reset function not available:', rpcError);
      console.log('Falling back to manual testing...');
    }
    
    // Option 2: Manual testing by setting last_quota_reset to 31 days ago
    console.log('Setting last_quota_reset to 31 days ago...');
    
    const thirtyOneDaysAgo = new Date();
    thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);
    
    const { data: updateResult, error: updateError } = await supabase
      .from('user_subscriptions')
      .update({ last_quota_reset: thirtyOneDaysAgo.toISOString() })
      .eq('id', subscription.id)
      .select();
      
    if (updateError) {
      console.error('Error updating last_quota_reset:', updateError);
      return;
    }
    
    console.log('Triggering quota check to see if reset occurs...');
    
    // Now trigger a quota check which should reset the quota
    const { data: checkResult, error: checkError } = await supabase.rpc(
      'check_and_increment_quota',
      { p_user_id: userId }
    );
    
    if (checkError) {
      console.error('Error checking quota:', checkError);
      return;
    }
    
    console.log('Quota check result:', checkResult);
    
    // Get the updated subscription to verify the reset
    const { data: updatedSub, error: getError } = await supabase
      .from('user_subscriptions')
      .select('id, user_id, quota_used, monthly_quota, last_quota_reset')
      .eq('id', subscription.id)
      .single();
      
    if (getError) {
      console.error('Error fetching updated subscription:', getError);
      return;
    }
    
    console.log('\nUpdated subscription state:');
    console.log('- Quota used:', updatedSub.quota_used, 'of', updatedSub.monthly_quota);
    console.log('- Last reset:', new Date(updatedSub.last_quota_reset).toLocaleString());
    
    // Check if the quota was reset properly
    const wasReset = updatedSub.quota_used <= 1; // Will be 1 if check_and_increment_quota incremented it
    const resetTimeUpdated = new Date(updatedSub.last_quota_reset) > thirtyOneDaysAgo;
    
    if (wasReset && resetTimeUpdated) {
      console.log('✅ Quota reset function is working correctly!');
      console.log('The quota was reset and the last_quota_reset timestamp was updated.');
    } else {
      console.log('❌ Quota reset function is NOT working correctly!');
      if (!wasReset) console.log('  - Quota was not reset to 0 or 1');
      if (!resetTimeUpdated) console.log('  - Last reset time was not updated');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test function
testQuotaReset().catch(console.error); 