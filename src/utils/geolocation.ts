// Utility functions for detecting user location from IP

/**
 * Fetches the user's country information based on their IP address
 * @param cacheBuster Optional query parameter to prevent caching
 * @returns An object containing country code and currency data
 */
export async function getUserLocationInfo(cacheBuster?: string) {
  try {
    // Use our server-side API to determine location (which has access to the real IP)
    const url = cacheBuster ? `/api/get-location${cacheBuster}` : '/api/get-location';
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data) {
      console.error('Error fetching location data: No data returned');
      return getDefaultLocationInfo();
    }
    
    return {
      countryCode: data.countryCode || 'US',
      isIndia: data.isIndia || false,
      currency: data.currency || 'USD',
      currencySymbol: data.currencySymbol || '$',
      conversionRate: data.conversionRate || 80
    };
  } catch (error) {
    console.error('Error determining user location:', error);
    return getDefaultLocationInfo();
  }
}

/**
 * Default location info to use when geolocation fails
 */
function getDefaultLocationInfo() {
  return {
    countryCode: 'US',
    isIndia: false,
    currency: 'USD',
    currencySymbol: '$',
    conversionRate: 80
  };
}

/**
 * Converts price from INR to USD or vice versa
 * @param amount The amount to convert
 * @param fromCurrency The source currency ('INR' or 'USD')
 * @param toCurrency The target currency ('INR' or 'USD')
 * @param conversionRate The conversion rate (1 USD = X INR)
 * @returns The converted amount
 */
export function convertCurrency(
  amount: number, 
  fromCurrency: string = 'INR', 
  toCurrency: string = 'USD', 
  conversionRate: number = 80
): number {
  if (fromCurrency === toCurrency) return amount;
  
  if (fromCurrency === 'INR' && toCurrency === 'USD') {
    // Convert INR to USD (divide by conversion rate)
    return Math.round(amount / conversionRate);
  } else if (fromCurrency === 'USD' && toCurrency === 'INR') {
    // Convert USD to INR (multiply by conversion rate)
    return Math.round(amount * conversionRate);
  }
  
  return amount; // Return original if currencies are not recognized
} 