require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with admin rights
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updatePricesToUSD() {
  console.log('Updating subscription plan prices to USD...');
  
  try {
    // 1. Update Starter plan
    const { data: starterData, error: starterError } = await supabase
      .from('subscription_plans')
      .update({ 
        price: 4, 
        currency: 'USD',
        features: { 
          features: ['Basic muscle analysis', '5 analyses per month', 'Email support'],
          monthly_quota: 5,
          price: 4
        }
      })
      .eq('name', 'Starter')
      .select();
    
    if (starterError) {
      console.error('Error updating Starter plan:', starterError);
    } else {
      console.log('Starter plan updated successfully:', starterData);
    }
    
    // 2. Update Pro/Enterprise plan
    const { data: proData, error: proError } = await supabase
      .from('subscription_plans')
      .update({ 
        price: 7, 
        currency: 'USD',
        features: { 
          features: ['Advanced muscle analysis', '20 analyses per month', 'Priority support'],
          monthly_quota: 20,
          price: 7
        }
      })
      .in('name', ['Pro', 'Enterprise'])
      .select();
    
    if (proError) {
      console.error('Error updating Pro/Enterprise plans:', proError);
    } else {
      console.log('Pro/Enterprise plans updated successfully:', proData);
    }
    
    // 3. Update Ultimate/Business plan
    const { data: ultimateData, error: ultimateError } = await supabase
      .from('subscription_plans')
      .update({ 
        price: 14, 
        currency: 'USD',
        features: { 
          features: ['Premium muscle analysis', '100 analyses per month', '24/7 support', 'Custom reports'],
          monthly_quota: 100,
          price: 14
        }
      })
      .in('name', ['Ultimate', 'Business'])
      .select();
    
    if (ultimateError) {
      console.error('Error updating Ultimate/Business plans:', ultimateError);
    } else {
      console.log('Ultimate/Business plans updated successfully:', ultimateData);
    }
    
    // 4. Update all subscription transactions to use USD
    const { data: transactionData, error: transactionError } = await supabase
      .from('subscription_transactions')
      .update({ currency: 'USD' })
      .eq('currency', 'INR')
      .select();
    
    if (transactionError) {
      console.error('Error updating transactions:', transactionError);
    } else {
      console.log(`Updated ${transactionData.length} transactions to USD`);
    }
    
    // 5. Verify the updates
    const { data: allPlans, error: verifyError } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price');
    
    if (verifyError) {
      console.error('Error verifying updates:', verifyError);
    } else {
      console.log('All plans after update:');
      console.table(allPlans);
    }
    
    console.log('Price update completed successfully!');
    
  } catch (error) {
    console.error('Error updating prices:', error);
  }
}

// Run the update function
updatePricesToUSD(); 