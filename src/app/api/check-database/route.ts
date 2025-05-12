import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/utils/supabase-admin";

// Regular client for non-admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const plans = [
  {
    name: "Starter",
    description: "For small teams billed monthly",
    price: 499,
    currency: "INR",
    duration_days: 30,
    features: [
      "Basic Muscle Analysis",
      "5 Analyses per Month",
      "Email Support",
      "Mobile App Access",
    ],
  },
  {
    name: "Pro",
    description: "For fitness enthusiasts and trainers",
    price: 999,
    currency: "INR",
    duration_days: 30,
    features: [
      "Advanced Muscle Analysis",
      "20 Analyses per Month",
      "Priority Support",
      "Mobile App Access",
      "Workout Recommendations",
      "Progress Tracking",
    ],
  },
  {
    name: "Ultimate",
    description: "For professional fitness trainers",
    price: 1999,
    currency: "INR",
    duration_days: 30,
    features: [
      "Premium Muscle Analysis",
      "100 Analyses per Month",
      "24/7 Premium Support",
      "Mobile App Access",
      "Personalized Workout Plans",
      "Advanced Progress Tracking",
      "Nutrition Recommendations",
      "Client Management Tools",
    ],
  },
];

export async function GET(req: NextRequest) {
  try {
    // Check for service role key
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error(
        "Missing SUPABASE_SERVICE_ROLE_KEY. RLS bypass will not work."
      );
    }

    // Check if plans exist - using admin client
    const { data: existingPlans, error } = await supabaseAdmin
      .from("subscription_plans")
      .select("name")
      .limit(10);

    if (error) {
      console.error("Error checking plans:", error);
      return NextResponse.json(
        { error: "Failed to check plans" },
        { status: 500 }
      );
    }

    // If no plans or fewer than we expect, initialize them - using admin client
    if (!existingPlans || existingPlans.length < plans.length) {
      console.log("Initializing subscription plans...");

      // Create plans
      const { error: insertError } = await supabaseAdmin
        .from("subscription_plans")
        .upsert(
          plans.map((plan) => ({
            name: plan.name,
            description: plan.description,
            price: plan.price,
            currency: plan.currency,
            duration_days: plan.duration_days,
            features: plan.features,
            is_active: true,
          })),
          { onConflict: "name" } // Update if name already exists
        );

      if (insertError) {
        console.error("Error initializing plans:", insertError);
        return NextResponse.json(
          { error: "Failed to initialize plans" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Subscription plans initialized",
        plansCreated: true,
      });
    }

    // Get all plans to verify they're correctly configured - using admin client
    const { data: allPlans } = await supabaseAdmin
      .from("subscription_plans")
      .select("*")
      .limit(10);

    return NextResponse.json({
      message: "Subscription plans found",
      plans: allPlans,
      plansCreated: false,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
