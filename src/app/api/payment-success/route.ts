import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/utils/supabase-admin";
import crypto from "crypto";
import Razorpay from "razorpay";

// Initialize Razorpay for verification
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

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
    const { 
      userId, 
      planName, 
      amount, 
      razorpayPaymentId, 
      razorpayOrderId,
      razorpaySignature, 
      startDate, 
      endDate 
    } = body;

    console.log("Payment success request:", {
      userId,
      planName,
      amount,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    });

    if (!userId || !planName || !amount || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    const isSignatureValid = generatedSignature === razorpaySignature;

    if (!isSignatureValid) {
      console.error("Payment signature verification failed");
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Verify payment status with Razorpay API
    try {
      const payment = await razorpay.payments.fetch(razorpayPaymentId);
      
      if (payment.status !== "captured" && payment.status !== "authorized") {
        console.error("Payment not captured or authorized:", payment.status);
        return NextResponse.json(
          { error: "Payment not completed" },
          { status: 400 }
        );
      }
      
      console.log("Payment verified with Razorpay:", payment.status);
    } catch (error) {
      console.error("Error verifying payment with Razorpay:", error);
      return NextResponse.json(
        { error: "Could not verify payment with Razorpay" },
        { status: 500 }
      );
    }

    // Check if this payment has already been processed
    const { data: existingTransaction } = await supabaseAdmin
      .from("subscription_transactions")
      .select("id")
      .eq("razorpay_payment_id", razorpayPaymentId)
      .single();

    if (existingTransaction) {
      console.log("Payment already processed:", existingTransaction);
      return NextResponse.json({ 
        success: true, 
        message: "Payment already processed" 
      });
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
      // Set monthly quota based on plan name
      monthly_quota: mappedPlanName === "Pro" ? 20 : 
                    mappedPlanName === "Ultimate" ? 100 : 5,
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

    // 3. Record the transaction with proper error handling
    let transaction = null;
    let transactionError = null;

    try {
      const transactionData = {
        user_id: userId,
        plan_id: planData.id,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_order_id: razorpayOrderId,
        amount: amount,
        currency: body.currency || "INR",
        status: "success",
        payment_date: new Date().toISOString(),
        verified: true,
      };

      console.log("Attempting to record transaction:", transactionData);

      const result = await supabaseAdmin
        .from("subscription_transactions")
        .insert([transactionData])
        .select()
        .single();

      transaction = result.data;
      transactionError = result.error;

      if (transactionError) {
        console.error("Error recording transaction:", transactionError);
        // We'll continue even if transaction recording fails
      } else {
        console.log("Transaction recorded successfully:", transaction);
      }

      // Update order status
      await supabaseAdmin
        .from("razorpay_orders")
        .update({ status: "paid" })
        .eq("order_id", razorpayOrderId);

    } catch (error) {
      console.error("Exception recording transaction:", error);
      // We'll continue even if transaction recording throws an exception
    }

    return NextResponse.json({
      success: true,
      subscription,
      transaction,
      transactionError: transactionError ? transactionError.message : null,
    });
  } catch (error) {
    console.error("Error processing payment success:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
