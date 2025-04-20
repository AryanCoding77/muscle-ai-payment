import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { userId, subscriptionId, newPlanId } = await req.json();

    // Validate required fields
    if (!userId || !subscriptionId || !newPlanId) {
      return NextResponse.json(
        { error: "User ID, subscription ID, and new plan ID are required" },
        { status: 400 }
      );
    }

    // Fetch the existing subscription
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

    // Fetch the new plan details
    const { data: newPlan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", newPlanId)
      .single();

    if (planError || !newPlan) {
      console.error("Error fetching plan:", planError);
      return NextResponse.json(
        { error: "New subscription plan not found" },
        { status: 404 }
      );
    }

    // Update the subscription with new plan details
    const { data: updatedSubscription, error: updateError } = await supabase
      .from("user_subscriptions")
      .update({
        subscription_plan_id: newPlanId,
        amount: newPlan.price,
        updated_at: new Date().toISOString(),
        // Here you could handle proration logic if needed
      })
      .eq("id", subscriptionId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating subscription:", updateError);
      return NextResponse.json(
        { error: "Failed to update subscription" },
        { status: 500 }
      );
    }

    // Return the updated subscription
    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
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
