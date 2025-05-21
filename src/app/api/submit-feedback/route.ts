import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      userName,
      userEmail,
      category,
      rating,
      feedback,
      plan,
      submittedAt
    } = body;

    // Validate required fields
    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback text is required" },
        { status: 400 }
      );
    }

    // Skip checking for table existence - we'll just attempt to insert
    // and create the table manually if it doesn't exist
    
    // Save feedback to database
    const { data, error } = await supabaseAdmin
      .from("user_feedback")
      .insert([
        {
          user_id: userId || null,
          user_name: userName || "Anonymous",
          user_email: userEmail || null,
          category: category || "general",
          rating: rating || null,
          feedback,
          subscription_plan: plan || "None",
          submitted_at: submittedAt || new Date().toISOString(),
          status: "pending"
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting feedback:", error);
      
      // If error is because table doesn't exist, let's inform the user
      if (error.code === "42P01") { // PostgreSQL code for undefined_table
        return NextResponse.json(
          { error: "Feedback table doesn't exist. Please contact the administrator to set up the feedback system." },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to submit feedback" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data,
      message: "Thank you for your feedback! We'll review it soon."
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 