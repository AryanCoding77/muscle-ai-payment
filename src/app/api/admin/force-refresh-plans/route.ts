import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase-admin";

export async function GET(request: Request) {
  try {
    // Get userId from query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // First update the prices in the database
    await supabaseAdmin
      .from("subscription_plans")
      .update({ price: 599 })
      .eq("name", "Pro");

    await supabaseAdmin
      .from("subscription_plans")
      .update({ price: 999 })
      .eq("name", "Ultimate");

    await supabaseAdmin
      .from("subscription_plans")
      .update({ price: 299 })
      .eq("name", "Starter");

    // Update features as well
    try {
      await supabaseAdmin.rpc('execute_sql', { 
        sql_query: `
          -- Update Starter plan features
          UPDATE subscription_plans
          SET features = jsonb_build_object(
            'features', ARRAY['Basic muscle analysis', '5 analyses per month', 'Email support'],
            'monthly_quota', 5,
            'price', 299
          )
          WHERE name = 'Starter';
          
          -- Update Pro plan features
          UPDATE subscription_plans
          SET features = jsonb_build_object(
            'features', ARRAY['Advanced muscle analysis', '20 analyses per month', 'Priority support', 'Workout recommendations', 'Progress tracking'],
            'monthly_quota', 20,
            'price', 599
          )
          WHERE name IN ('Pro', 'Enterprise');
          
          -- Update Ultimate plan features
          UPDATE subscription_plans
          SET features = jsonb_build_object(
            'features', ARRAY['Premium muscle analysis', '100 analyses per month', '24/7 support', 'Advanced analytics', 'Custom workout plans'],
            'monthly_quota', 100,
            'price', 999
          )
          WHERE name IN ('Ultimate', 'Business');
        `
      });
    } catch (sqlError) {
      console.error("Error updating plan features:", sqlError);
      // Continue execution even if this fails
    }

    // Get the user's subscription
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

      // If no subscription was found, return the updated plan prices
      if (error.code === "PGRST116") {
        const { data: plans } = await supabaseAdmin
          .from("subscription_plans")
          .select("name, price")
          .in("name", ["Pro", "Ultimate", "Starter"]);

        return NextResponse.json({
          subscription: null,
          message: "No active subscription found, but plan prices were updated",
          updatedPlans: plans
        });
      }

      return NextResponse.json(
        { error: "Failed to fetch subscription" },
        { status: 500 }
      );
    }

    if (!subscription) {
      return NextResponse.json(
        { message: "No active subscription found" },
        { status: 404 }
      );
    }

    // Force a refresh by updating the subscription record
    const { error: updateError } = await supabaseAdmin
      .from("user_subscriptions")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", subscription.id);

    if (updateError) {
      console.error("Error updating subscription:", updateError);
      return NextResponse.json(
        { error: "Failed to refresh subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscription prices updated and cache refreshed",
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
        quotaUsed: subscription.quota_used || 0,
        monthlyQuota: subscription.monthly_quota || 5
      }
    });
  } catch (error) {
    console.error("Error refreshing subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 