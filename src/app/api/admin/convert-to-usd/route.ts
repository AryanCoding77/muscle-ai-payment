import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase-admin";

// Hardcoded conversion rate
const INR_TO_USD_RATE = 80;

export async function POST(req: Request) {
  try {
    // Check if the request has admin authorization
    // This is a simple example - in production, use proper auth
    const { searchParams } = new URL(req.url);
    const adminKey = searchParams.get('admin_key');
    
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // 1. Update all subscription plans to use USD
    const { data: plansUpdated, error: plansError } = await supabaseAdmin.rpc(
      'execute_sql',
      {
        sql_query: `
          UPDATE subscription_plans
          SET price = ROUND(price / ${INR_TO_USD_RATE}),
              currency = 'USD'
          WHERE currency = 'INR' OR currency IS NULL
          RETURNING id, name, price, currency;
        `
      }
    );
    
    if (plansError) {
      console.error("Error updating subscription plans:", plansError);
      return NextResponse.json({ error: "Failed to update plans" }, { status: 500 });
    }
    
    // 2. Update all subscription transactions to use USD
    const { data: transactionsUpdated, error: transactionsError } = await supabaseAdmin.rpc(
      'execute_sql',
      {
        sql_query: `
          UPDATE subscription_transactions
          SET amount = ROUND(amount / ${INR_TO_USD_RATE}),
              currency = 'USD'
          WHERE currency = 'INR' OR currency IS NULL
          RETURNING id, razorpay_payment_id, amount, currency;
        `
      }
    );
    
    if (transactionsError) {
      console.error("Error updating transactions:", transactionsError);
      return NextResponse.json({ error: "Failed to update transactions" }, { status: 500 });
    }
    
    // 3. Update Razorpay orders
    const { data: ordersUpdated, error: ordersError } = await supabaseAdmin.rpc(
      'execute_sql',
      {
        sql_query: `
          UPDATE razorpay_orders
          SET amount = ROUND(amount / ${INR_TO_USD_RATE}),
              currency = 'USD'
          WHERE currency = 'INR' OR currency IS NULL
          RETURNING id, order_id, amount, currency;
        `
      }
    );
    
    if (ordersError) {
      console.error("Error updating orders:", ordersError);
      return NextResponse.json({ error: "Failed to update orders" }, { status: 500 });
    }
    
    // 4. Log the changes made
    await supabaseAdmin
      .from('system_logs')
      .insert({
        action: 'CURRENCY_CONVERSION',
        details: {
          plans_updated: plansUpdated,
          transactions_updated: transactionsUpdated,
          orders_updated: ordersUpdated
        }
      });
    
    return NextResponse.json({
      success: true,
      message: "All prices converted to USD",
      stats: {
        plans_updated: Array.isArray(plansUpdated) ? plansUpdated.length : 0,
        transactions_updated: Array.isArray(transactionsUpdated) ? transactionsUpdated.length : 0,
        orders_updated: Array.isArray(ordersUpdated) ? ordersUpdated.length : 0
      }
    });

  } catch (error) {
    console.error("Error converting to USD:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 