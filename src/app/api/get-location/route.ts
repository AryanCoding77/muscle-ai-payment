import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check for override query parameter
    const { searchParams } = new URL(request.url);
    const forceIndia = searchParams.get('forceIndia') === 'true';
    
    if (forceIndia) {
      console.log('Forced India location via query parameter');
      return NextResponse.json({
        countryCode: 'IN',
        isIndia: true,
        currency: 'INR',
        currencySymbol: '₹',
        conversionRate: 80,
        detectedIp: 'override',
        overridden: true
      }, { status: 200 });
    }
    
    // Extract client IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    
    // The x-forwarded-for header might contain multiple IP addresses separated by commas
    // The first one is usually the original client IP
    const clientIp = forwardedFor 
      ? forwardedFor.split(',')[0].trim() 
      : request.headers.get('x-real-ip') || '127.0.0.1';
    
    console.log(`Detected IP: ${clientIp}`);
    
    // Try using a different IP geolocation service
    let countryCode = 'US'; // Default
    let isIndia = false;
    
    // First, try with ipapi.co
    try {
      const response = await fetch(`https://ipapi.co/${clientIp}/json/`);
      const data = await response.json();
      
      if (!data.error) {
        countryCode = data.country_code || 'US';
        isIndia = countryCode === 'IN';
        console.log(`ipapi.co country detection: ${countryCode}`);
      } else {
        console.error("Error from ipapi.co:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch from ipapi.co:", error);
    }
    
    // If not detected as India, try with ipinfo.io as a fallback
    if (!isIndia) {
      try {
        const response = await fetch(`https://ipinfo.io/${clientIp}/json`);
        const data = await response.json();
        
        if (data.country) {
          countryCode = data.country;
          isIndia = countryCode === 'IN';
          console.log(`ipinfo.io country detection: ${countryCode}`);
        }
      } catch (error) {
        console.error("Failed to fetch from ipinfo.io:", error);
      }
    }
    
    // TEMPORARY OVERRIDE: Force India for local development testing
    // This helps debug the application on localhost
    // const hostname = request.headers.get('host') || '';
    // if (hostname.includes('localhost')) {
    //   countryCode = 'IN';
    //   isIndia = true;
    //   console.log('Forced India location for localhost testing');
    // }
    
    return NextResponse.json({
      countryCode,
      isIndia,
      currency: isIndia ? 'INR' : 'USD',
      currencySymbol: isIndia ? '₹' : '$',
      conversionRate: 80,
      detectedIp: clientIp
    }, { status: 200 });
  } catch (error) {
    console.error('Error determining user location:', error);
    
    // Return default values on error
    return NextResponse.json({ 
      isIndia: false,
      currency: "USD",
      currencySymbol: "$",
      countryCode: "US",
      conversionRate: 80
    }, { status: 200 });
  }
} 