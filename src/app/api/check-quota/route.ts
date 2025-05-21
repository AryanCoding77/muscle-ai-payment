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

    console.log("Checking quota for user:", userId);

    // Call the database function to check and increment quota
    const { data, error } = await supabaseAdmin.rpc(
      "check_and_increment_quota",
      { p_user_id: userId }
    );

    if (error) {
      console.error("Error checking quota:", error);
      return NextResponse.json(
        { error: "Failed to check quota", details: error.message },
        { status: 500 }
      );
    }

    console.log("Quota check result:", data);

    // If the quota check was successful, return the data
    if (data.success) {
      return NextResponse.json({
        success: true,
        message: data.message,
        quota: {
          used: data.quota_used,
          limit: data.quota_limit,
          remaining: data.quota_remaining,
          resetDate: data.reset_date
        }
      });
    } else {
      // If the quota check failed, return an error
      return NextResponse.json(
        {
          success: false,
          message: data.message,
          quota: {
            used: data.quota_used || 0,
            limit: data.quota_limit || 0,
            remaining: data.quota_remaining || 0,
            resetDate: data.reset_date
          },
          requiresUpgrade: data.requires_upgrade || false
        },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 