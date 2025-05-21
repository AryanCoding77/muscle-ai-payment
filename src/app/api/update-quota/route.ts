import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase-admin";

export async function POST(request: Request) {
  try {
    // This is meant to be a one-time fix for existing subscriptions
    // Basic security check - require an admin key
    const { adminKey } = await request.json();
    
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // First, get all active subscriptions
    const { data: subscriptions, error: fetchError } = await supabaseAdmin
      .from("user_subscriptions")
      .select("id, plan_id, subscription_plans:plan_id(name)")
      .eq("status", "active");

    if (fetchError) {
      console.error("Error fetching subscriptions:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions" },
        { status: 500 }
      );
    }

    // For each subscription, update the monthly quota based on plan name
    const updateResults = [];
    
    for (const subscription of subscriptions || []) {
      const planName = subscription.subscription_plans ? subscription.subscription_plans.name : null;
      if (!planName) continue;
      
      let monthlyQuota = 5; // Default for Starter
      
      if (planName === "Pro" || planName === "Enterprise") {
        monthlyQuota = 20;
      } else if (planName === "Ultimate" || planName === "Business") {
        monthlyQuota = 100; // Changed from unlimited to 100 analyses per month
      }
      
      // Update the subscription
      const { data, error } = await supabaseAdmin
        .from("user_subscriptions")
        .update({ monthly_quota: monthlyQuota })
        .eq("id", subscription.id)
        .select();
      
      updateResults.push({
        id: subscription.id,
        planName,
        monthlyQuota,
        success: !error,
        error: error ? error.message : null
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `Updated ${updateResults.length} subscriptions`,
      results: updateResults
    });
    
  } catch (error) {
    console.error("Error updating subscription quotas:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 