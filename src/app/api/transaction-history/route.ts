import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    // Get userId from URL query parameter
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch all the user's payment transactions with plan details
    const { data: transactions, error } = await supabase
      .from("subscription_transactions")
      .select(
        `
        id,
        razorpay_payment_id,
        amount,
        currency,
        status,
        payment_date,
        created_at,
        subscription_plans:plan_id (
          id,
          name,
          description,
          price
        )
      `
      )
      .eq("user_id", userId)
      .order("payment_date", { ascending: false });

    if (error) {
      console.error("Error fetching transaction history:", error);
      return NextResponse.json(
        { error: "Failed to fetch transaction history", details: error.message },
        { status: 500 }
      );
    }

    // Return all transactions
    return NextResponse.json({
      success: true,
      transactions: transactions || [],
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
} 