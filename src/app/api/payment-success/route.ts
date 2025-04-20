import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/utils/supabase-admin";

// Regular client for non-admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Map for handling plan name mismatches
const planNameMapping: Record<string, string> = {
  Starter: "Starter",
  Enterprise: "Pro",
  Business: "Ultimate",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, planName, amount, razorpayPaymentId, startDate, endDate } =
      body;

    console.log("Payment success request:", {
      userId,
      planName,
      amount,
      razorpayPaymentId,
    });

    if (!userId || !planName || !amount || !razorpayPaymentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Map the incoming plan name to the one in the database
    const mappedPlanName = planNameMapping[planName] || planName;
    console.log(`Mapping plan name from "${planName}" to "${mappedPlanName}"`);

    // 1. Get the subscription plan ID
    const { data: planData, error: planError } = await supabaseAdmin
      .from("subscription_plans")
      .select("id, name")
      .ilike("name", mappedPlanName)
      .single();

    if (planError || !planData) {
      console.error("Error fetching subscription plan:", planError);
      return NextResponse.json(
        { error: "Subscription plan not found" },
        { status: 404 }
      );
    }

    console.log("Found plan:", planData);

    // 2. Create a new user subscription record
    const subscriptionData = {
      user_id: userId,
      plan_id: planData.id,
      start_date: startDate || new Date().toISOString(),
      end_date:
        endDate ||
        new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      status: "active",
    };

    const { data: subscription, error: subscriptionError } = await supabaseAdmin
      .from("user_subscriptions")
      .insert([subscriptionData])
      .select()
      .single();

    if (subscriptionError) {
      console.error("Error creating user subscription:", subscriptionError);
      return NextResponse.json(
        { error: "Failed to create subscription" },
        { status: 500 }
      );
    }

    console.log("Created subscription:", subscription);

    // 3. Record the transaction
    const transactionData = {
      user_id: userId,
      plan_id: planData.id,
      razorpay_payment_id: razorpayPaymentId,
      amount: amount,
      currency: "INR",
      status: "success",
      payment_date: new Date().toISOString(),
    };

    console.log("Attempting to record transaction:", transactionData);

    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from("subscription_transactions")
      .insert([transactionData])
      .select()
      .single();

    if (transactionError) {
      console.error("Error recording transaction:", transactionError);
      // Don't return error here, as subscription is already created
      // But log it for debugging
    } else {
      console.log("Transaction recorded successfully:", transaction);
    }

    return NextResponse.json({
      success: true,
      subscription,
      transaction,
    });
  } catch (error) {
    console.error("Error processing payment success:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
