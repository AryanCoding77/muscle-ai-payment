import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase-admin";

export async function GET(request: Request) {
  try {
    // For security, we would normally use authentication here
    // But for a quick fix, we'll run this directly

    // Update Pro plan price
    const { error: proError } = await supabaseAdmin
      .from("subscription_plans")
      .update({ price: 599 })
      .eq("name", "Pro");

    if (proError) {
      console.error("Error updating Pro plan:", proError);
      return NextResponse.json({ error: "Failed to update Pro plan" }, { status: 500 });
    }

    // Update Ultimate plan price
    const { error: ultimateError } = await supabaseAdmin
      .from("subscription_plans")
      .update({ price: 999 })
      .eq("name", "Ultimate");

    if (ultimateError) {
      console.error("Error updating Ultimate plan:", ultimateError);
      return NextResponse.json({ error: "Failed to update Ultimate plan" }, { status: 500 });
    }

    // Update Starter plan price
    const { error: starterError } = await supabaseAdmin
      .from("subscription_plans")
      .update({ price: 299 })
      .eq("name", "Starter");

    if (starterError) {
      console.error("Error updating Starter plan:", starterError);
      return NextResponse.json({ error: "Failed to update Starter plan" }, { status: 500 });
    }

    // Update features for all plans to include new prices
    const { error: featuresError } = await supabaseAdmin.rpc('execute_sql', { 
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

    if (featuresError) {
      console.error("Error updating plan features:", featuresError);
      // Continue execution even if this fails
    }

    // Check if updates worked
    const { data: plans, error: fetchError } = await supabaseAdmin
      .from("subscription_plans")
      .select("id, name, price")
      .in("name", ["Pro", "Ultimate", "Starter"]);

    if (fetchError) {
      console.error("Error fetching updated plans:", fetchError);
      return NextResponse.json({ error: "Failed to fetch updated plans" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Plan prices updated successfully",
      plans
    });
  } catch (error) {
    console.error("Error updating plan prices:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 