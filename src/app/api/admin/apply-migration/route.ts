import { NextResponse } from "next/server";
import { supabaseAdmin, executeSQL } from "@/utils/supabase-admin";

export async function POST(request: Request) {
  try {
    // Add referral_code column to subscription_transactions table
    const { error: error1 } = await executeSQL(
      `ALTER TABLE subscription_transactions ADD COLUMN IF NOT EXISTS referral_code TEXT;`
    );

    if (error1) {
      console.error("Error adding referral_code to subscription_transactions:", error1);
    }

    // Add referral_code column to razorpay_orders table
    const { error: error2 } = await executeSQL(
      `ALTER TABLE razorpay_orders ADD COLUMN IF NOT EXISTS referral_code TEXT;`
    );

    if (error2) {
      console.error("Error adding referral_code to razorpay_orders:", error2);
    }

    // Create index on referral_code for faster lookups
    const { error: error3 } = await executeSQL(
      `CREATE INDEX IF NOT EXISTS idx_subscription_transactions_referral_code ON subscription_transactions(referral_code);`
    );

    if (error3) {
      console.error("Error creating index on subscription_transactions:", error3);
    }

    const { error: error4 } = await executeSQL(
      `CREATE INDEX IF NOT EXISTS idx_razorpay_orders_referral_code ON razorpay_orders(referral_code);`
    );

    if (error4) {
      console.error("Error creating index on razorpay_orders:", error4);
    }

    // Create a function to get referral statistics
    const { error: error5 } = await executeSQL(`
      CREATE OR REPLACE FUNCTION get_referral_stats()
      RETURNS TABLE (
        referral_code TEXT,
        total_transactions BIGINT,
        total_revenue NUMERIC,
        currency TEXT
      ) 
      LANGUAGE SQL
      AS $$
        SELECT 
          COALESCE(referral_code, 'direct') as referral_code,
          COUNT(*) as total_transactions,
          SUM(amount) as total_revenue,
          MAX(currency) as currency
        FROM subscription_transactions
        GROUP BY COALESCE(referral_code, 'direct')
        ORDER BY total_revenue DESC;
      $$;
    `);

    if (error5) {
      console.error("Error creating get_referral_stats function:", error5);
    }

    return NextResponse.json({ 
      success: true,
      errors: {
        error1: error1 ? String(error1) : null,
        error2: error2 ? String(error2) : null,
        error3: error3 ? String(error3) : null,
        error4: error4 ? String(error4) : null,
        error5: error5 ? String(error5) : null,
      }
    });
  } catch (error) {
    console.error("Error applying migration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 