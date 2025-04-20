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
    const { userId, promoCode, subscriptionPlanId } = body;

    // Validate required fields
    if (!userId || !promoCode || !subscriptionPlanId) {
      return NextResponse.json(
        {
          error:
            "User ID, promotion code, and subscription plan ID are required",
        },
        { status: 400 }
      );
    }

    // 1. Verify the promotion code exists and is valid
    const { data: promoData, error: promoError } = await supabase
      .from("promotion_codes")
      .select("*")
      .eq("code", promoCode)
      .eq("is_active", true)
      .lte("valid_from", new Date().toISOString())
      .gte("valid_until", new Date().toISOString())
      .single();

    if (promoError || !promoData) {
      console.error("Error validating promotion code:", promoError);
      return NextResponse.json(
        { error: "Invalid or expired promotion code" },
        { status: 400 }
      );
    }

    // 2. Check if the user has already used this promo code
    const { data: usageData, error: usageError } = await supabase
      .from("promotion_usage")
      .select("*")
      .eq("user_id", userId)
      .eq("promotion_id", promoData.id);

    if (usageError) {
      console.error("Error checking promotion usage:", usageError);
      return NextResponse.json(
        { error: "Failed to validate promotion eligibility" },
        { status: 500 }
      );
    }

    if (usageData && usageData.length > 0) {
      return NextResponse.json(
        { error: "You have already used this promotion code" },
        { status: 400 }
      );
    }

    // 3. Get the subscription plan price
    const { data: planData, error: planError } = await supabase
      .from("subscription_plans")
      .select("price")
      .eq("id", subscriptionPlanId)
      .single();

    if (planError || !planData) {
      console.error("Error fetching plan details:", planError);
      return NextResponse.json(
        { error: "Invalid subscription plan" },
        { status: 400 }
      );
    }

    // 4. Calculate the discounted price
    let discountedPrice = planData.price;
    if (promoData.discount_type === "percentage") {
      discountedPrice = planData.price * (1 - promoData.discount_value / 100);
    } else if (promoData.discount_type === "fixed") {
      discountedPrice = Math.max(0, planData.price - promoData.discount_value);
    }

    // Round to two decimal places
    discountedPrice = Math.round(discountedPrice * 100) / 100;

    // 5. Return the discounted price and promotion details
    return NextResponse.json({
      success: true,
      originalPrice: planData.price,
      discountedPrice: discountedPrice,
      discountAmount: planData.price - discountedPrice,
      discountType: promoData.discount_type,
      discountValue: promoData.discount_value,
      promotionId: promoData.id,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
