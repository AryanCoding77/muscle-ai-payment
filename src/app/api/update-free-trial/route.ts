import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const { userId } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("Updating free trial usage for user:", userId);

    // First, get the current analyses_used count
    const { data: currentData, error: fetchError } = await supabaseAdmin
      .from("user_trials")
      .select("analyses_used")
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching current trial usage:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch current trial usage", details: fetchError.message },
        { status: 500 }
      );
    }

    // Increment the analyses_used count by 1, but cap at the limit
    const analysesLimit = 2; // Free trial limit is 2 analyses
    const currentUsage = currentData?.analyses_used || 0;
    
    // Only increment if below the limit
    if (currentUsage >= analysesLimit) {
      // Already at or above limit, don't increment
      const { data, error } = await supabaseAdmin
        .from("user_trials")
        .select()
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching trial data:", error);
        return NextResponse.json(
          { error: "Failed to fetch trial data", details: error.message },
          { status: 500 }
        );
      }

      // Return the data without incrementing
      const analysesRemaining = 0;
      const isOnFreeTrial = false;

      return NextResponse.json({
        success: true,
        isOnFreeTrial,
        analysesUsed: analysesLimit,
        analysesLimit,
        analysesRemaining,
        trialStartedAt: data.trial_started_at,
        trialEnded: true
      });
    }

    // Increment by 1 since we're below the limit
    const newAnalysesUsed = currentUsage + 1;

    // Update the analyses_used count for this user
    const { data, error } = await supabaseAdmin
      .from("user_trials")
      .update({ analyses_used: newAnalysesUsed })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating free trial usage:", error);
      return NextResponse.json(
        { error: "Failed to update free trial usage", details: error.message },
        { status: 500 }
      );
    }

    // Calculate remaining analyses
    const analysesUsed = data.analyses_used;
    const analysesRemaining = Math.max(0, analysesLimit - analysesUsed);
    const isOnFreeTrial = analysesRemaining > 0;

    return NextResponse.json({
      success: true,
      isOnFreeTrial,
      analysesUsed,
      analysesLimit,
      analysesRemaining,
      trialStartedAt: data.trial_started_at,
      trialEnded: analysesRemaining <= 0
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 