/**
 * Format a date string into a readable format
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "N/A";
  
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
} 