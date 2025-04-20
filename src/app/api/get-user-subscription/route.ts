import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    // Get userId from query parameters
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("Fetching subscription for user:", userId);

    // Get the user's active subscription
    const { data: subscription, error } = await supabaseAdmin
      .from("user_subscriptions")
      .select(
        `
        id,
        user_id,
        plan_id, 
        status,
        start_date,
        end_date,
        subscription_plans:plan_id (name, price, features, description)
      `
      )
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching user subscription:", error);

      // If no subscription was found, return empty but not an error
      if (error.code === "PGRST116") {
        return NextResponse.json({
          subscription: null,
          message: "No active subscription found",
        });
      }

      return NextResponse.json(
        { error: "Failed to fetch subscription" },
        { status: 500 }
      );
    }

    console.log("Found subscription:", subscription);

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        userId: subscription.user_id,
        planId: subscription.plan_id,
        plan: subscription.subscription_plans?.name || "Unknown Plan",
        amount: subscription.subscription_plans?.price || 0,
        startDate: subscription.start_date,
        endDate: subscription.end_date,
        status: subscription.status,
        features: subscription.subscription_plans?.features || [],
      },
    });
  } catch (error) {
    console.error("Error in get-user-subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
