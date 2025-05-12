import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    console.log("Updating subscription plan prices to USD...");
    
    // 1. Update Starter plan
    const { data: starterData, error: starterError } = await supabaseAdmin
      .from("subscription_plans")
      .update({ 
        price: 4, 
        currency: "USD",
        features: { 
          features: ["Basic muscle analysis", "5 analyses per month", "Email support"],
          monthly_quota: 5,
          price: 4
        }
      })
      .eq("name", "Starter")
      .select();
    
    if (starterError) {
      console.error("Error updating Starter plan:", starterError);
      return NextResponse.json(
        { error: "Failed to update Starter plan", details: starterError },
        { status: 500 }
      );
    }
    
    // 2. Update Pro/Enterprise plan
    const { data: proData, error: proError } = await supabaseAdmin
      .from("subscription_plans")
      .update({ 
        price: 7, 
        currency: "USD",
        features: { 
          features: ["Advanced muscle analysis", "20 analyses per month", "Priority support"],
          monthly_quota: 20,
          price: 7
        }
      })
      .in("name", ["Pro", "Enterprise"])
      .select();
    
    if (proError) {
      console.error("Error updating Pro/Enterprise plans:", proError);
      return NextResponse.json(
        { error: "Failed to update Pro/Enterprise plans", details: proError },
        { status: 500 }
      );
    }
    
    // 3. Update Ultimate/Business plan
    const { data: ultimateData, error: ultimateError } = await supabaseAdmin
      .from("subscription_plans")
      .update({ 
        price: 14, 
        currency: "USD",
        features: { 
          features: ["Premium muscle analysis", "100 analyses per month", "24/7 support", "Custom reports"],
          monthly_quota: 100,
          price: 14
        }
      })
      .in("name", ["Ultimate", "Business"])
      .select();
    
    if (ultimateError) {
      console.error("Error updating Ultimate/Business plans:", ultimateError);
      return NextResponse.json(
        { error: "Failed to update Ultimate/Business plans", details: ultimateError },
        { status: 500 }
      );
    }
    
    // 4. Update all subscription transactions to use USD
    const { data: transactionData, error: transactionError } = await supabaseAdmin
      .from("subscription_transactions")
      .update({ currency: "USD" })
      .eq("currency", "INR")
      .select();
    
    if (transactionError) {
      console.error("Error updating transactions:", transactionError);
      // Continue since this is not critical
    }
    
    // 5. Verify the updates
    const { data: allPlans, error: verifyError } = await supabaseAdmin
      .from("subscription_plans")
      .select("id, name, price, currency, features")
      .order("price");
    
    if (verifyError) {
      console.error("Error verifying updates:", verifyError);
      return NextResponse.json(
        { error: "Failed to verify updates", details: verifyError },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: "Price update completed successfully!",
      updatedPlans: {
        starter: starterData,
        pro: proData,
        ultimate: ultimateData
      },
      currentPlans: allPlans,
      transactionsUpdated: transactionData?.length || 0
    });
    
  } catch (error) {
    console.error("Error updating prices:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
} 