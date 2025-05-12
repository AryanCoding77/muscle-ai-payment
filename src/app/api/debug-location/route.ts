import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Extract all headers for debugging
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Extract client IP address
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') ||
                     '127.0.0.1';
    
    let ipApiResponse = null;
    let ipApiData = null;
    let error = null;

    try {
      // Use a free IP geolocation service to determine the user's country
      ipApiResponse = await fetch(`https://ipapi.co/${clientIp}/json/`);
      ipApiData = await ipApiResponse.json();
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }

    // Return all the debug information
    return NextResponse.json({ 
      detectedIp: clientIp,
      headers,
      ipApiData,
      error
    }, { status: 200 });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 