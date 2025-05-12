import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase-admin";

export async function GET(request: Request) {
  try {
    // Only allow in development mode or with admin key
    if (process.env.NODE_ENV !== "development") {
      const url = new URL(request.url);
      const adminKey = url.searchParams.get("admin_key");
      
      if (adminKey !== process.env.WEBHOOK_ADMIN_KEY) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }
    
    // Get limit parameter
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    
    // Get webhook events
    const { data: events, error } = await supabaseAdmin
      .from("razorpay_webhook_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error("Error fetching webhook events:", error);
      return NextResponse.json(
        { error: "Failed to fetch webhook events" },
        { status: 500 }
      );
    }
    
    // Get stats
    const { data: stats } = await supabaseAdmin
      .from("razorpay_webhook_events")
      .select("verified, processed, event_type")
      .order("created_at", { ascending: false });
      
    const verifiedCount = stats?.filter(e => e.verified).length || 0;
    const processedCount = stats?.filter(e => e.processed).length || 0;
    const totalCount = stats?.length || 0;
    
    const eventTypes = stats?.reduce((acc, curr) => {
      acc[curr.event_type] = (acc[curr.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    return NextResponse.json({
      events,
      stats: {
        total: totalCount,
        verified: verifiedCount,
        processed: processedCount,
        verifiedPercentage: totalCount > 0 ? (verifiedCount / totalCount) * 100 : 0,
        processedPercentage: totalCount > 0 ? (processedCount / totalCount) * 100 : 0,
        eventTypes
      }
    });
  } catch (error) {
    console.error("Error checking webhook events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 