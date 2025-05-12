import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/utils/supabase-admin";

// Regular client for non-admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Map for handling plan name mismatches
const planNameMapping: Record<string, string> = {
  Starter: "Starter",
  Enterprise: "Pro",
  Business: "Ultimate",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      subscriptionPlanId,
      planName,
      paymentId,
      amount,
      currency,
    } = body;

    console.log("Create subscription request:", {
      userId,
      planName,
      amount,
      paymentId,
    });

    // Validate required fields
    if (!userId || (!subscriptionPlanId && !planName) || !amount) {
      return NextResponse.json(
        {
          error:
            "Missing required fields. Need userId, plan info (ID or name), and amount.",
        },
        { status: 400 }
      );
    }

    // First check all available plans - using admin client
    const { data: allPlans, error: allPlansError } = await supabaseAdmin
      .from("subscription_plans")
      .select("*")
      .limit(10);

    if (allPlansError) {
      console.error("Error fetching all plans:", allPlansError);
    } else {
      console.log("Available subscription plans:", allPlans);
    }

    let planData;

    // Get subscription plan details - either by ID or name
    if (subscriptionPlanId) {
      const { data, error } = await supabaseAdmin
        .from("subscription_plans")
        .select("*")
        .eq("id", subscriptionPlanId)
        .single();

      if (error || !data) {
        console.error("Error fetching subscription plan by ID:", error);
        // Fall back to using plan name if ID fails
        if (!planName) {
          if (allPlans && allPlans.length > 0) {
            console.log("Falling back to first available plan:", allPlans[0]);
            planData = allPlans[0];
          } else {
            return NextResponse.json(
              {
                error: "Invalid subscription plan ID and no fallback available",
              },
              { status: 400 }
            );
          }
        }
      } else {
        planData = data;
      }
    }

    // If we don't have plan data yet and we have a plan name, try to find by name
    if (!planData && planName) {
      // Map the incoming plan name to the one in the database
      const mappedPlanName = planNameMapping[planName] || planName;
      console.log(
        `Mapping plan name from "${planName}" to "${mappedPlanName}"`
      );

      // Try to find by name (case insensitive)
      const { data, error } = await supabaseAdmin
        .from("subscription_plans")
        .select("*")
        .ilike("name", mappedPlanName)
        .single();

      if (error || !data) {
        console.error("Error fetching subscription plan by name:", error);

        // If we can't find by name, try to find by price (amount)
        const { data: planByPrice, error: priceError } = await supabaseAdmin
          .from("subscription_plans")
          .select("*")
          .eq("price", amount)
          .single();

        if (priceError || !planByPrice) {
          console.error("Error fetching plan by price:", priceError);

          // Last resort: get the first plan from the database
          if (allPlans && allPlans.length > 0) {
            console.log("Falling back to first available plan:", allPlans[0]);
            planData = allPlans[0];
          } else {
            return NextResponse.json(
              { error: "Could not find a matching subscription plan" },
              { status: 400 }
            );
          }
        } else {
          planData = planByPrice;
        }
      } else {
        planData = data;
      }
    }

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (planData.duration_days || 30));

    // Get the actual table structure to see the column names
    const { data: userSubscriptionsMeta, error: metaError } =
      await supabaseAdmin.from("user_subscriptions").select("*").limit(1);

    if (metaError) {
      console.error("Error getting table structure:", metaError);
    } else {
      console.log(
        "User subscriptions table structure:",
        userSubscriptionsMeta
          ? Object.keys(userSubscriptionsMeta[0] || {})
          : "No records found"
      );
    }

    // Create the subscription record - using admin client to bypass RLS
    const { data: subscription, error: subscriptionError } = await supabaseAdmin
      .from("user_subscriptions")
      .insert({
        user_id: userId,
        plan_id: planData.id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: "active",
        // Set monthly quota based on plan name
        monthly_quota: planData.name === "Pro" ? 20 : 
                      planData.name === "Ultimate" ? 100 : 5,
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error("Error creating subscription:", subscriptionError);
      return NextResponse.json(
        { error: "Failed to create subscription" },
        { status: 500 }
      );
    }

    // Record payment transaction if payment ID was provided
    let transaction = null;
    let transactionError = null;

    if (paymentId) {
      try {
        const transactionData = {
          user_id: userId,
          plan_id: planData.id,
          razorpay_payment_id: paymentId,
          amount: amount,
          currency: currency || "INR",
          status: "success",
          payment_date: new Date().toISOString(),
        };

        console.log("Attempting to record transaction:", transactionData);

        const result = await supabaseAdmin
          .from("subscription_transactions")
          .insert(transactionData)
          .select()
          .single();

        transaction = result.data;
        transactionError = result.error;

        if (transactionError) {
          console.error("Error recording transaction:", transactionError);
          // We continue even if transaction recording fails
        } else {
          console.log("Transaction recorded successfully:", transaction);
        }
      } catch (error) {
        console.error("Exception recording transaction:", error);
        // We continue even if transaction recording throws an exception
      }
    }

    return NextResponse.json({
      success: true,
      message: "Subscription created successfully",
      subscription: {
        id: subscription.id,
        planName: planData.name,
        planId: planData.id,
        startDate: startDate,
        endDate: endDate,
        status: "active",
      },
      transaction,
      transactionError: transactionError ? transactionError.message : null,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
