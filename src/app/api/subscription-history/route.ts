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

    // Fetch all the user's subscriptions with plan details
    const { data: subscriptions, error } = await supabase
      .from("user_subscriptions")
      .select(
        `
        id,
        start_date,
        end_date,
        status,
        paused_at,
        resumed_at,
        cancelled_at,
        created_at,
        updated_at,
        subscription_plans (
          id,
          name,
          description,
          price,
          features
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subscription history:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscription history" },
        { status: 500 }
      );
    }

    // Return all subscriptions
    return NextResponse.json({
      success: true,
      subscriptions: subscriptions || []
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 