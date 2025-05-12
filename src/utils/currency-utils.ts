/**
 * Utility functions for currency handling
 */

/**
 * Converts INR to USD if needed
 * @param amount The amount to potentially convert
 * @param currency The currency of the amount (if known)
 * @returns The amount in USD
 */
export function ensureUSD(amount: number, currency?: string): number {
  // If we know it's already USD, return as is
  if (currency === 'USD') return amount;
  
  // If amount is over 100, it's likely INR and needs conversion
  // (This assumes USD prices are typically under 100)
  if (amount > 100) {
    return Math.round(amount / 80); // 1 USD ≈ 80 INR
  }
  
  // If it's a small amount, assume it's already in USD
  return amount;
}

/**
 * Formats currency amount for display
 * @param amount The amount to format
 * @param includeCurrency Whether to include the currency symbol
 * @returns Formatted string with currency symbol
 */
export function formatCurrency(amount: number, includeCurrency = true): string {
  // Convert to USD if needed
  const usdAmount = ensureUSD(amount);
  
  // Format with currency symbol
  return includeCurrency ? `$${usdAmount}` : `${usdAmount}`;
} 