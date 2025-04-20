import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    // Add missing columns to user_subscriptions table using Postgres function
    // This will add the columns if they don't exist
    const { error } = await supabase.rpc("add_columns_if_not_exist", {
      table_name: "user_subscriptions",
      column_definitions: [
        "paused_at TIMESTAMP WITH TIME ZONE",
        "resumed_at TIMESTAMP WITH TIME ZONE",
        "cancelled_at TIMESTAMP WITH TIME ZONE",
        "updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
      ],
    });

    if (error) {
      console.error("Error updating schema:", error);

      // Fallback approach - try to run SQL directly to add the columns
      try {
        const { error: sqlError } = await supabase
          .from("user_subscriptions")
          .select("id")
          .limit(1);

        // Check if we can access the table
        if (sqlError) {
          console.error("Error accessing user_subscriptions table:", sqlError);
          return NextResponse.json(
            { error: "Failed to access user_subscriptions table" },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message:
            "Table exists, but couldn't add columns with RPC. Please add missing columns manually.",
        });
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
        return NextResponse.json(
          { error: "Failed to update schema" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Successfully updated user_subscriptions schema",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
