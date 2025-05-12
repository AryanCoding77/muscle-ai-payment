import { NextResponse } from "next/server";
import { supabaseAdmin, listTables, executeSQL } from "@/utils/supabase-admin";

export async function GET(request: Request) {
  try {
    // Check if subscription_plans table exists
    const { data: tables, error: tableError } = await listTables();

    if (tableError) {
      console.error("Error listing tables:", tableError);
      return NextResponse.json(
        { error: "Could not check for subscription_plans table" },
        { status: 500 }
      );
    }

    const hasPlansTable = tables && tables.some((t: any) => t === "subscription_plans");
    
    console.log(`Subscription plans table ${hasPlansTable ? "exists" : "does not exist"}`);

    // Check if there are any plans in the table
    const { data: plans, error: plansError } = await supabaseAdmin
      .from("subscription_plans")
      .select("*");

    if (plansError) {
      console.error("Error checking subscription plans:", plansError);
      
      if (!hasPlansTable) {
        console.log("Creating subscription_plans table");
        
        // Execute raw SQL to create the table
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS subscription_plans (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            currency TEXT NOT NULL DEFAULT 'USD',
            interval TEXT NOT NULL DEFAULT 'one-time',
            features JSONB,
            analyses_per_month INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        
        const { error: sqlError } = await executeSQL(createTableSQL);
        if (sqlError) {
          console.error("SQL execution error:", sqlError);
        } else {
          console.log("subscription_plans table created");
        }
      }
      
      return NextResponse.json(
        { error: "Error checking plans", details: plansError, tableExists: hasPlansTable },
        { status: 500 }
      );
    }

    if (!plans || plans.length === 0) {
      console.log("No subscription plans found, initializing default plans");
      
      // Insert default plans
      const defaultPlans = [
        {
          name: "Starter",
          description: "Basic features for individuals - One-time payment",
          price: 4,
          currency: "USD",
          interval: "one-time",
          analyses_per_month: 5,
          features: JSON.stringify(["Basic Analysis", "5 Analyses per month", "Email Support"])
        },
        {
          name: "Pro",
          description: "Advanced features for professionals - One-time payment",
          price: 7,
          currency: "USD",
          interval: "one-time",
          analyses_per_month: 20,
          features: JSON.stringify(["Advanced Analysis", "20 Analyses per month", "Priority Support"])
        },
        {
          name: "Ultimate",
          description: "Complete package for businesses - One-time payment",
          price: 14,
          currency: "USD",
          interval: "one-time",
          analyses_per_month: 100,
          features: JSON.stringify(["Premium Analysis", "100 Analyses per month", "24/7 Support", "Custom Reports"])
        }
      ];
      
      const { data: insertedPlans, error: insertError } = await supabaseAdmin
        .from("subscription_plans")
        .insert(defaultPlans)
        .select();
      
      if (insertError) {
        console.error("Error inserting default plans:", insertError);
        return NextResponse.json(
          { error: "Failed to initialize plans", details: insertError },
          { status: 500 }
        );
      }
      
      console.log("Default plans initialized:", insertedPlans);
      
      return NextResponse.json({
        message: "Subscription plans initialized",
        plans: insertedPlans
      });
    }

    console.log("Existing subscription plans:", plans);
    
    return NextResponse.json({
      message: "Subscription plans retrieved",
      plans: plans
    });
  } catch (error) {
    console.error("Error checking subscription plans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 