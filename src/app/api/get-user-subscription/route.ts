import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase-admin";

// Function to ensure amount is in USD
function convertToUSD(amount: number, currency?: string): number {
  // If we know it's already USD, return as is
  if (currency === 'USD') return amount;
  
  // If amount is over 100, it's likely INR and needs conversion
  // This assumes USD prices are typically under 100
  if (amount > 100) {
    return Math.round(amount / 80); // 1 USD ≈ 80 INR
  }
  
  // If it's a small amount, assume it's already in USD
  return amount;
}

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
        quota_used,
        monthly_quota,
        last_quota_reset,
        subscription_plans:plan_id (name, price, features, description, currency)
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

    // Ensure price is in USD
    const originalPrice = subscription.subscription_plans?.price || 0;
    const currency = subscription.subscription_plans?.currency || 'INR';
    const usdPrice = convertToUSD(originalPrice, currency);

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        userId: subscription.user_id,
        planId: subscription.plan_id,
        plan: subscription.subscription_plans?.name || "Unknown Plan",
        amount: usdPrice,
        currency: "USD", // Always set currency to USD
        startDate: subscription.start_date,
        endDate: subscription.end_date,
        status: subscription.status,
        features: subscription.subscription_plans?.features || [],
        quotaUsed: subscription.quota_used || 0,
        monthlyQuota: subscription.monthly_quota || 5, // Default to 5 for Starter plan
        lastQuotaReset: subscription.last_quota_reset || null
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
