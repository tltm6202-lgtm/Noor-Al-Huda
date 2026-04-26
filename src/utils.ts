
/**
 * Utility to strip Arabic diacritics (Harakat) from text for comparison.
 */
export function stripHarakat(text: string): string {
  // Regex for common Arabic diacritics
  return text.replace(/[\u064B-\u0652\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, "");
}

/**
 * Standardize Arabic characters for better comparison (e.g. Alef variants)
 */
export function standardizeArabic(text: string): string {
  let result = stripHarakat(text);
  result = result.replace(/[أإآ]/g, "ا");
  result = result.replace(/ة/g, "ه");
  result = result.replace(/ى/g, "ي");
  // Remove punctuation
  result = result.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  // Remove extra spaces
  result = result.trim().replace(/\s+/g, " ");
  return result;
}
