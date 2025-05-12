import { NextResponse } from "next/server";
import { supabaseAdmin, executeSQL } from "@/utils/supabase-admin";

export async function POST(request: Request) {
  try {
    // Get authorization from headers
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.ADMIN_API_KEY;
    
    // Check if authorization is valid
    if (!authHeader || !apiKey || authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Define plan updates
    const planUpdates = [
      { names: ["Pro", "Enterprise"], price: 599 },
      { names: ["Ultimate", "Business"], price: 999 }
    ];
    
    const results = [];

    // Process each plan update
    for (const planUpdate of planUpdates) {
      // First check if any plans exist with these names
      const { data: plans, error: planError } = await supabaseAdmin
        .from("subscription_plans")
        .select("id, name, price")
        .in("name", planUpdate.names);

      if (planError) {
        console.error(`Error fetching ${planUpdate.names[0]} plans:`, planError);
        continue;
      }

      if (!plans || plans.length === 0) {
        console.log(`No ${planUpdate.names[0]} plans found to update`);
        continue;
      }

      // Update plan prices
      const { error: updateError } = await supabaseAdmin
        .from("subscription_plans")
        .update({ price: planUpdate.price })
        .in("name", planUpdate.names);

      if (updateError) {
        console.error(`Error updating ${planUpdate.names[0]} plan prices:`, updateError);
        continue;
      }

      // Update the feature object to include the new price
      const sql = `
        UPDATE subscription_plans
        SET features = jsonb_set(
          features, 
          '{price}', 
          '${planUpdate.price}',
          true
        )
        WHERE name IN (${planUpdate.names.map(name => `'${name}'`).join(', ')})
      `;

      const { error: featuresError } = await executeSQL(sql);

      if (featuresError) {
        console.error(`Error updating ${planUpdate.names[0]} plan features:`, featuresError);
        continue;
      }

      // Count updated subscriptions 
      const { count, error: countError } = await supabaseAdmin
        .from("user_subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")
        .in("plan_id", plans.map(plan => plan.id));

      if (countError) {
        console.error(`Error counting active ${planUpdate.names[0]} subscriptions:`, countError);
      }

      results.push({
        plan: planUpdate.names[0],
        price: planUpdate.price,
        plansUpdated: plans.length,
        activeSubscriptions: count || 0
      });
    }

    return NextResponse.json({
      success: true,
      message: "Plan prices updated successfully",
      results
    });
  } catch (error) {
    console.error("Error updating plan prices:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 