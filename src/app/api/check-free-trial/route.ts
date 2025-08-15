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

    console.log("Checking free trial status for user:", userId);

    // Check if user exists in user_trials table
    const { data: trialData, error: trialError } = await supabaseAdmin
      .from("user_trials")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (trialError && trialError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error, which is expected for new users
      console.error("Error checking free trial:", trialError);
      return NextResponse.json(
        { error: "Failed to check free trial status", details: trialError.message },
        { status: 500 }
      );
    }

    // If user is not in the table, they haven't started their free trial yet
    if (!trialData) {
      // Create a new trial entry for this user
      const { data: newTrial, error: insertError } = await supabaseAdmin
        .from("user_trials")
        .insert([
          { 
            user_id: userId,
            analyses_used: 0,
            trial_started_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error creating free trial:", insertError);
        return NextResponse.json(
          { error: "Failed to create free trial", details: insertError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        isOnFreeTrial: true,
        analysesUsed: 0,
        analysesLimit: 2,
        analysesRemaining: 2,
        trialStartedAt: newTrial.trial_started_at
      });
    }

    // User already has a trial entry
    const analysesUsed = Math.min(trialData.analyses_used || 0, 2); // Cap at limit
    const analysesLimit = 2; // Free trial limit is 2 analyses
    const analysesRemaining = Math.max(0, analysesLimit - analysesUsed);
    const isOnFreeTrial = analysesRemaining > 0;

    // If the analyses_used is greater than the limit, ensure it's capped at the limit
    if (trialData.analyses_used > analysesLimit) {
      // Update the database to cap at the limit
      try {
        await supabaseAdmin
          .from("user_trials")
          .update({ analyses_used: analysesLimit })
          .eq("user_id", userId);
      } catch (error) {
        console.error("Error capping analyses_used:", error);
        // Non-critical error, continue
      }
    }

    return NextResponse.json({
      isOnFreeTrial,
      analysesUsed,
      analysesLimit,
      analysesRemaining,
      trialStartedAt: trialData.trial_started_at,
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