import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { userId, subscriptionId } = await req.json();

    // Validate required fields
    if (!userId || !subscriptionId) {
      return NextResponse.json(
        { error: "User ID and subscription ID are required" },
        { status: 400 }
      );
    }

    // Fetch the cancelled subscription
    const { data: existingSubscription, error: fetchError } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("id", subscriptionId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !existingSubscription) {
      console.error("Error fetching subscription:", fetchError);
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    if (existingSubscription.status !== "cancelled") {
      return NextResponse.json(
        { error: "Subscription is not cancelled and cannot be reactivated" },
        { status: 400 }
      );
    }

    // Get the subscription plan details to set correct end date
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", existingSubscription.plan_id)
      .single();

    if (planError) {
      console.error("Error fetching plan details:", planError);
      return NextResponse.json(
        { error: "Failed to retrieve plan details" },
        { status: 500 }
      );
    }

    // Calculate new period end based on the plan duration
    const now = new Date();
    let endDate = new Date(now);

    if (plan.billing_cycle === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan.billing_cycle === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      // Default to 30 days if billing cycle is not recognized
      endDate.setDate(endDate.getDate() + 30);
    }

    // Update subscription status to active
    const { data: updatedSubscription, error: updateError } = await supabase
      .from("user_subscriptions")
      .update({
        status: "active",
        cancelled_at: null,
        updated_at: now.toISOString(),
        current_period_start: now.toISOString(),
        current_period_end: endDate.toISOString(),
      })
      .eq("id", subscriptionId)
      .select()
      .single();

    if (updateError) {
      console.error("Error reactivating subscription:", updateError);
      return NextResponse.json(
        { error: "Failed to reactivate subscription" },
        { status: 500 }
      );
    }

    // Return the updated subscription
    return NextResponse.json({
      success: true,
      message: "Subscription reactivated successfully",
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
