/**
 * Utility functions for generating URL-friendly slugs
 */

/**
 * Converts a string into a URL-friendly slug
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
}

/**
 * Generates a unique slug by checking against existing slugs
 * @param baseName - The base name to generate slug from
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export function generateUniqueSlug(baseName: string, existingSlugs: string[]): string {
  const baseSlug = generateSlug(baseName)
  
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug
  }
  
  let counter = 1
  let uniqueSlug = `${baseSlug}-${counter}`
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++
    uniqueSlug = `${baseSlug}-${counter}`
  }
  
  return uniqueSlug
}
