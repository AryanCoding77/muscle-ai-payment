import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    // Check admin key for security
    const adminKey = req.nextUrl.searchParams.get("admin_key");
    
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
    
    // Update Starter plan
    const { error: starterError } = await supabaseAdmin
      .from("subscription_plans")
      .update({ 
        price: 4, 
        currency: "USD",
        features: { 
          features: ["Basic Analysis", "5 Analyses per month", "Email Support"],
          monthly_quota: 5,
          price: 4
        }
      })
      .eq("name", "Starter");
    
    if (starterError) {
      console.error("Error updating Starter plan:", starterError);
      return NextResponse.json(
        { error: "Failed to update Starter plan" },
        { status: 500 }
      );
    }
    
    // Update Pro/Enterprise plan
    const { error: proError } = await supabaseAdmin
      .from("subscription_plans")
      .update({ 
        price: 7, 
        currency: "USD",
        features: { 
          features: ["Advanced Analysis", "20 Analyses per month", "Priority Support"],
          monthly_quota: 20,
          price: 7
        }
      })
      .in("name", ["Pro", "Enterprise"]);
    
    if (proError) {
      console.error("Error updating Pro/Enterprise plans:", proError);
      return NextResponse.json(
        { error: "Failed to update Pro/Enterprise plans" },
        { status: 500 }
      );
    }
    
    // Update Ultimate/Business plan
    const { error: ultimateError } = await supabaseAdmin
      .from("subscription_plans")
      .update({ 
        price: 14, 
        currency: "USD",
        features: { 
          features: ["Premium Analysis", "100 Analyses per month", "24/7 Support", "Custom Reports"],
          monthly_quota: 100,
          price: 14
        }
      })
      .in("name", ["Ultimate", "Business"]);
    
    if (ultimateError) {
      console.error("Error updating Ultimate/Business plans:", ultimateError);
      return NextResponse.json(
        { error: "Failed to update Ultimate/Business plans" },
        { status: 500 }
      );
    }
    
    // Ensure all transactions use USD
    const { error: transactionError } = await supabaseAdmin
      .from("subscription_transactions")
      .update({ currency: "USD" })
      .eq("currency", "INR");
    
    if (transactionError) {
      console.error("Error updating transactions:", transactionError);
      // Continue since this is not critical
    }
    
    // Get updated plans to verify
    const { data: updatedPlans, error: fetchError } = await supabaseAdmin
      .from("subscription_plans")
      .select("id, name, price, currency, features")
      .order("price");
    
    if (fetchError) {
      console.error("Error fetching updated plans:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch updated plans" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: "Subscription plans updated successfully",
      plans: updatedPlans
    });
    
  } catch (error) {
    console.error("Error in update-prices API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 