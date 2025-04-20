import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    // Get userId from the URL query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Get the current date to compare with subscription end_date
    const currentDate = new Date().toISOString();

    // Query to find active subscription for the user
    const { data: userSubscription, error: subscriptionError } = await supabase
      .from("user_subscriptions")
      .select(
        `
        id,
        start_date,
        end_date,
        status,
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
      .eq("status", "active")
      .lte("start_date", currentDate)
      .gte("end_date", currentDate)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (subscriptionError && subscriptionError.code !== "PGRST116") {
      console.error("Error fetching subscription:", subscriptionError);
      return NextResponse.json(
        { error: "Failed to fetch subscription" },
        { status: 500 }
      );
    }

    // If no active subscription found
    if (!userSubscription) {
      return NextResponse.json({ subscription: null });
    }

    // Return the subscription data
    return NextResponse.json({ subscription: userSubscription });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
