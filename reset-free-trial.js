/**
 * Reset free trial usage count for a user
 * 
 * This script connects directly to the database and resets the analyses_used count to 0
 * for a specific user, allowing for testing of the free trial system.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Replace with the user ID you want to reset
const USER_ID = process.argv[2] || "google-oauth2|123456789";

async function resetFreeTrial() {
  console.log(`Resetting free trial usage count for user: ${USER_ID}`);
  
  try {
    // First, check if the user has a trial entry
    const { data: existingTrial, error: fetchError } = await supabase
      .from('user_trials')
      .select('*')
      .eq('user_id', USER_ID)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking for existing trial:', fetchError);
      return;
    }
    
    if (existingTrial) {
      // Update existing trial entry
      const { data, error } = await supabase
        .from('user_trials')
        .update({ analyses_used: 0 })
        .eq('user_id', USER_ID);
      
      if (error) {
        console.error('Error resetting trial usage:', error);
        return;
      }
      
      console.log('✅ Successfully reset free trial usage count to 0');
    } else {
      // Create new trial entry
      const { data, error } = await supabase
        .from('user_trials')
        .insert([
          {
            user_id: USER_ID,
            analyses_used: 0,
            trial_started_at: new Date().toISOString()
          }
        ]);
      
      if (error) {
        console.error('Error creating trial entry:', error);
        return;
      }
      
      console.log('✅ Successfully created new free trial entry with usage count 0');
    }
    
    // Verify the reset
    const { data: verifyData, error: verifyError } = await supabase
      .from('user_trials')
      .select('*')
      .eq('user_id', USER_ID)
      .single();
    
    if (verifyError) {
      console.error('Error verifying reset:', verifyError);
      return;
    }
    
    console.log('Current trial status:', verifyData);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the reset function
resetFreeTrial().catch(console.error); 