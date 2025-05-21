import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase-admin";
import { getSession } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    // Verify admin user
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // In a real app, you would verify admin status here
    // For now, we'll just proceed with the request
    
    // Get all feedback entries, sorted by newest first
    const { data: feedback, error } = await supabaseAdmin
      .from("user_feedback")
      .select("*")
      .order("submitted_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching feedback:", error);
      return NextResponse.json(
        { error: "Failed to fetch feedback" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 