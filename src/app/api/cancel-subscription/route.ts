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

    if (existingSubscription.status === "cancelled") {
      return NextResponse.json(
        { error: "Subscription is already cancelled" },
        { status: 400 }
      );
    }

    // Update subscription status to cancelled
    const { data: updatedSubscription, error: updateError } = await supabase
      .from("user_subscriptions")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // If you want the subscription to remain active until the end of the billing period
        // you could set ends_at to the current period end date
        // ends_at: existingSubscription.current_period_end
      })
      .eq("id", subscriptionId)
      .select()
      .single();

    if (updateError) {
      console.error("Error cancelling subscription:", updateError);
      return NextResponse.json(
        { error: "Failed to cancel subscription" },
        { status: 500 }
      );
    }

    // Return the updated subscription
    return NextResponse.json({
      success: true,
      message: "Subscription cancelled successfully",
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
