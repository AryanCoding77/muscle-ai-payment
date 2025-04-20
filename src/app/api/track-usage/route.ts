import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { userId, subscriptionId, usageType, metadata } = body;

    // Validate required fields
    if (!userId || !subscriptionId || !usageType) {
      return NextResponse.json(
        { error: "User ID, subscription ID, and usage type are required" },
        { status: 400 }
      );
    }

    // Verify the subscription is active
    const { data: subscription, error: subscriptionError } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("id", subscriptionId)
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (subscriptionError || !subscription) {
      console.error("Error fetching subscription:", subscriptionError);
      return NextResponse.json(
        { error: "Active subscription not found" },
        { status: 404 }
      );
    }

    // Get subscription plan details to check usage limits
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", subscription.subscription_id)
      .single();

    if (planError || !plan) {
      console.error("Error fetching plan details:", planError);
      return NextResponse.json(
        { error: "Failed to retrieve plan details" },
        { status: 500 }
      );
    }

    // Get current usage for this billing period
    const billingStartDate = new Date(subscription.start_date);
    const now = new Date();

    const { data: usageData, error: usageError } = await supabase
      .from("subscription_usage")
      .select("count(*)")
      .eq("user_id", userId)
      .eq("subscription_id", subscriptionId)
      .eq("usage_type", usageType)
      .gte("created_at", billingStartDate.toISOString())
      .lte("created_at", now.toISOString());

    if (usageError) {
      console.error("Error fetching usage data:", usageError);
      return NextResponse.json(
        { error: "Failed to check usage limits" },
        { status: 500 }
      );
    }

    // Check if user has exceeded their plan limits
    const currentUsage = usageData.length;
    const planFeatures =
      typeof plan.features === "string"
        ? JSON.parse(plan.features)
        : plan.features;

    // This is a simplistic approach; you might have more complex logic
    const usageLimit =
      planFeatures?.limits?.[usageType] ||
      (usageType === "analysis"
        ? plan.name === "Starter"
          ? 5
          : plan.name === "Enterprise"
          ? 25
          : 999 // Unlimited for Business
        : 999); // Default high number if not specified

    if (currentUsage >= usageLimit) {
      return NextResponse.json(
        {
          success: false,
          message: "You have reached your usage limit for this billing period",
          usageLimit,
          currentUsage,
        },
        { status: 403 }
      );
    }

    // Record the usage
    const { data: recordedUsage, error: recordError } = await supabase
      .from("subscription_usage")
      .insert({
        user_id: userId,
        subscription_id: subscriptionId,
        usage_type: usageType,
        metadata: metadata || {},
        created_at: now.toISOString(),
      })
      .select()
      .single();

    if (recordError) {
      console.error("Error recording usage:", recordError);
      return NextResponse.json(
        { error: "Failed to record usage" },
        { status: 500 }
      );
    }

    // Return usage information
    return NextResponse.json({
      success: true,
      usage: {
        current: currentUsage + 1,
        limit: usageLimit,
        remaining: usageLimit - (currentUsage + 1),
      },
      usageRecord: recordedUsage,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
