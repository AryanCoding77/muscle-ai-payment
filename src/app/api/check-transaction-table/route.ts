import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    const result: any = {};
    
    // 1. Check if the table exists
    const { data: tableExists, error: existsError } = await supabaseAdmin.rpc(
      'table_exists',
      { table_name: 'subscription_transactions' }
    ).maybeSingle();
    
    if (existsError) {
      // RPC function might not exist, so try direct query
      try {
        const { data } = await supabaseAdmin
          .from('subscription_transactions')
          .select('id')
          .limit(1);
        
        result.table_exists = true;
      } catch (e) {
        result.table_exists = false;
        result.table_exists_error = e instanceof Error ? e.message : String(e);
      }
    } else {
      // Safely check if tableExists has the exists property
      result.table_exists = tableExists && typeof tableExists === 'object' && 'exists' in tableExists
        ? Boolean(tableExists.exists)
        : false;
    }
    
    // If table exists, get its columns
    if (result.table_exists) {
      try {
        // Try to get table structure
        const { data: sampleData, error: sampleError } = await supabaseAdmin
          .from('subscription_transactions')
          .select('id, user_id, plan_id, amount, currency, status, payment_date')
          .limit(5);
        
        if (!sampleError && sampleData && sampleData.length > 0) {
          result.columns = Object.keys(sampleData[0]);
        } else {
          // No data yet, try to describe the table
          const { error: insertError } = await supabaseAdmin
            .from('subscription_transactions')
            .insert({
              user_id: 'test-user-diagnostic',
              plan_id: '00000000-0000-0000-0000-000000000000',
              amount: 0,
              currency: 'INR',
              status: 'pending',
              payment_date: new Date().toISOString(),
            })
            .select();
            
          if (insertError) {
            result.describe_error = insertError.message;
            
            // Check if the error message contains information about columns
            if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
              result.possible_column_issue = true;
              
              // Attempt to parse the column name from the error
              const columnMatch = insertError.message.match(/column "([^"]+)" does not exist/);
              if (columnMatch && columnMatch[1]) {
                result.problematic_column = columnMatch[1];
              }
            }
          }
        }
      } catch (e) {
        result.column_check_error = e instanceof Error ? e.message : String(e);
      }
    }
    
    // Check RLS policies
    try {
      const { data: policies, error: policyError } = await supabaseAdmin.rpc(
        'get_policies_for_table',
        { table_name: 'subscription_transactions' }
      );
      
      if (!policyError) {
        result.policies = policies;
      } else {
        result.policy_check_error = policyError.message;
      }
    } catch (e) {
      // RPC might not exist
    }
    
    // Check if we can create a test transaction
    try {
      const testUserId = `test-${Date.now()}`;
      
      // First, get a valid plan ID
      const { data: plan, error: planError } = await supabaseAdmin
        .from('subscription_plans')
        .select('id')
        .limit(1)
        .single();
        
      if (planError || !plan) {
        result.test_insert_plan_error = planError?.message || 'No plans found';
      } else {
        // Try to insert a test transaction
        const { data: testTx, error: testTxError } = await supabaseAdmin
          .from('subscription_transactions')
          .insert({
            user_id: testUserId,
            plan_id: plan.id,
            razorpay_payment_id: `test-${Date.now()}`,
            amount: 1,
            currency: 'INR',
            status: 'pending',
            payment_date: new Date().toISOString(),
          })
          .select();
          
        if (testTxError) {
          result.test_insert_error = testTxError.message;
        } else {
          result.test_insert_success = true;
          result.test_transaction_id = testTx?.[0]?.id;
          
          // Clean up test transaction
          if (testTx?.[0]?.id) {
            await supabaseAdmin
              .from('subscription_transactions')
              .delete()
              .eq('id', testTx[0].id);
          }
        }
      }
    } catch (e) {
      result.test_insert_exception = e instanceof Error ? e.message : String(e);
    }
    
    return NextResponse.json({
      success: true,
      transaction_table_diagnostics: result,
      recommendation: !result.table_exists 
        ? "The subscription_transactions table doesn't exist. Run the migration to create it."
        : result.test_insert_error
          ? "The table exists but there was an error inserting a test transaction. Check the error details."
          : "The subscription_transactions table appears to be working correctly."
    });
  } catch (error: any) {
    console.error("Error in diagnostics:", error);
    return NextResponse.json({
      error: "Diagnostics failed",
      details: error.message
    }, { status: 500 });
  }
} 