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
    const { userId, subscriptionId } = body;

    // Validate required fields
    if (!userId || !subscriptionId) {
      return NextResponse.json(
        { error: "User ID and Subscription ID are required" },
        { status: 400 }
      );
    }

    // Fetch the subscription to verify it exists and is active
    const { data: subscription, error: fetchError } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("id", subscriptionId)
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (fetchError || !subscription) {
      console.error("Error fetching subscription:", fetchError);
      return NextResponse.json(
        { error: "Active subscription not found" },
        { status: 404 }
      );
    }

    // Update the subscription status to paused
    const { error: updateError } = await supabase
      .from("user_subscriptions")
      .update({
        status: "paused",
        paused_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriptionId);

    if (updateError) {
      console.error("Error pausing subscription:", updateError);
      return NextResponse.json(
        { error: "Failed to pause subscription" },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Subscription paused successfully",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
