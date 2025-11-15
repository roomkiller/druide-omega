/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Safe Number Utilities                                      ║
 * ║ Prevents "Cannot read properties of undefined (reading 'toFixed')" errors  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

/**
 * Safely converts a value to a fixed decimal string
 * @param {any} value - The value to convert
 * @param {number} decimals - Number of decimal places (default: 2)
 * @param {string} fallback - Fallback string if invalid (default: "0")
 * @returns {string} Formatted number or fallback
 */
export function safeToFixed(value, decimals = 2, fallback = "0") {
  // Handle null/undefined first
  if (value === null || value === undefined) {
    return fallback;
  }
  
  // Convert to number if it's a string
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (
    typeof num !== 'number' || 
    isNaN(num) || 
    !isFinite(num)
  ) {
    return fallback;
  }
  
  return num.toFixed(decimals);
}

/**
 * Safely gets a number value with default
 * @param {any} value - The value to check
 * @param {number} fallback - Fallback number if invalid (default: 0)
 * @returns {number} Valid number or fallback
 */
export function safeNumber(value, fallback = 0) {
  // Handle null/undefined first
  if (value === null || value === undefined) {
    return fallback;
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (
    typeof num !== 'number' || 
    isNaN(num) || 
    !isFinite(num)
  ) {
    return fallback;
  }
  
  return num;
}

/**
 * Safely calculates percentage
 * @param {any} numerator 
 * @param {any} denominator 
 * @param {number} decimals 
 * @returns {string} Percentage as string with decimals
 */
export function safePercentage(numerator, denominator, decimals = 1) {
  const num = safeNumber(numerator, 0);
  const denom = safeNumber(denominator, 1); // Avoid division by zero
  
  if (denom === 0) return "0";
  
  const percentage = (num / denom) * 100;
  return safeToFixed(percentage, decimals);
}

/**
 * Safely calculates average
 * @param {Array} values - Array of numbers
 * @param {number} decimals - Decimal places
 * @returns {string} Average as string
 */
export function safeAverage(values, decimals = 2) {
  if (!Array.isArray(values) || values.length === 0) {
    return safeToFixed(0, decimals);
  }
  
  const validValues = values
    .map(v => safeNumber(v, null))
    .filter(v => v !== null);
  
  if (validValues.length === 0) {
    return safeToFixed(0, decimals);
  }
  
  const sum = validValues.reduce((a, b) => a + b, 0);
  const avg = sum / validValues.length;
  
  return safeToFixed(avg, decimals);
}

/**
 * Formats large numbers (K, M, B)
 * @param {any} value - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number
 */
export function formatLargeNumber(value, decimals = 1) {
  const num = safeNumber(value, 0);
  
  if (num >= 1000000000) {
    return safeToFixed(num / 1000000000, decimals) + 'B';
  }
  if (num >= 1000000) {
    return safeToFixed(num / 1000000, decimals) + 'M';
  }
  if (num >= 1000) {
    return safeToFixed(num / 1000, decimals) + 'K';
  }
  
  return num.toString();
}