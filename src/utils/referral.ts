/**
 * Utility functions for handling referral tracking
 */

/**
 * Validate referral code format
 * Only allow alphanumeric characters and some special characters
 */
export const isValidReferralCode = (code: string): boolean => {
  // Allow alphanumeric characters, underscores, hyphens, and dots
  // Min 3 chars, max 50 chars
  const pattern = /^[a-zA-Z0-9_\-\.]{3,50}$/;
  return pattern.test(code);
};

/**
 * Get referral code from URL parameters
 */
export const getReferralFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');
  
  // Validate the referral code
  if (refCode && isValidReferralCode(refCode)) {
    return refCode;
  }
  
  return null;
};

/**
 * Save referral code to localStorage
 */
export const saveReferral = (referralCode: string): void => {
  if (typeof window === 'undefined') return;
  
  // Validate the referral code before saving
  if (!isValidReferralCode(referralCode)) {
    console.error('Invalid referral code format:', referralCode);
    return;
  }
  
  localStorage.setItem('muscleai_referral', referralCode);
  
  // Also save the timestamp when this referral was first captured
  if (!localStorage.getItem('muscleai_referral_date')) {
    localStorage.setItem('muscleai_referral_date', new Date().toISOString());
  }
};

/**
 * Get saved referral code from localStorage
 */
export const getSavedReferral = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('muscleai_referral');
};

/**
 * Check if a referral is stored and valid (not expired)
 * Referrals are valid for 30 days by default
 */
export const hasValidReferral = (expirationDays = 30): boolean => {
  if (typeof window === 'undefined') return false;
  
  const referral = localStorage.getItem('muscleai_referral');
  if (!referral) return false;
  
  const referralDate = localStorage.getItem('muscleai_referral_date');
  if (!referralDate) return true; // If no date stored, assume it's valid
  
  // Check if referral has expired
  const captureDate = new Date(referralDate);
  const now = new Date();
  const daysDifference = (now.getTime() - captureDate.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysDifference <= expirationDays;
};

/**
 * Clear stored referral data
 */
export const clearReferral = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('muscleai_referral');
  localStorage.removeItem('muscleai_referral_date');
}; 