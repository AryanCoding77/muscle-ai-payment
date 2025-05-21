// This script updates monthly quota for Pro plan subscribers
// Run with: node src/scripts/update-pro-quota.js

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

async function updateProSubscriptionQuota() {
  console.log('Updating Pro subscription quotas...');

  try {
    // Update monthly_quota for Pro/Enterprise plan subscribers
    const { data: proResult, error: proError } = await supabase
      .from('user_subscriptions')
      .update({ monthly_quota: 20 })
      .in('status', ['active'])
      .eq('monthly_quota', 5)  // Only update those with incorrect quota
      .filter('subscription_plans.name', 'in', '("Pro", "Enterprise")')
      .select();

    if (proError) {
      console.error('Error updating Pro subscriptions:', proError);
    } else {
      console.log(`Updated ${proResult?.length || 0} Pro subscriptions to 20 analyses per month`);
    }

    // Update monthly_quota for Ultimate/Business plan subscribers
    const { data: ultimateResult, error: ultimateError } = await supabase
      .from('user_subscriptions')
      .update({ monthly_quota: 100 })
      .in('status', ['active'])
      .not('monthly_quota', 'eq', 100)  // Only update those with incorrect quota
      .filter('subscription_plans.name', 'in', '("Ultimate", "Business")')
      .select();

    if (ultimateError) {
      console.error('Error updating Ultimate subscriptions:', ultimateError);
    } else {
      console.log(`Updated ${ultimateResult?.length || 0} Ultimate subscriptions to 100 analyses per month`);
    }

    console.log('Update completed successfully');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the update function
updateProSubscriptionQuota()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 