import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    // Get userId from URL query parameter
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch the user's active subscriptions
    const { data: subscriptions, error } = await supabase
      .from("user_subscriptions")
      .select(
        `
        *,
        subscription_plans:plan_id (
          name,
          description,
          price,
          billing_cycle,
          features
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return NextResponse.json(
        { error: "Failed to retrieve subscription information" },
        { status: 500 }
      );
    }

    // If no subscriptions found
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No subscriptions found for this user",
        subscriptions: [],
      });
    }

    // Return the subscription information
    return NextResponse.json({
      success: true,
      message: "Subscription information retrieved successfully",
      subscriptions: subscriptions,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
