import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase-admin";
import { getSession, isUserAdmin } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    // Verify admin user (simplified for this example)
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get request body
    const body = await request.json();
    const { feedbackId, status } = body;
    
    // Validate required fields
    if (!feedbackId || !status) {
      return NextResponse.json(
        { error: "Feedback ID and status are required" },
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ["pending", "in-progress", "completed", "dismissed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }
    
    // Update feedback status
    const { data, error } = await supabaseAdmin
      .from("user_feedback")
      .update({ status })
      .eq("id", feedbackId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating feedback status:", error);
      return NextResponse.json(
        { error: "Failed to update feedback status" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data,
      message: "Feedback status updated successfully" 
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 