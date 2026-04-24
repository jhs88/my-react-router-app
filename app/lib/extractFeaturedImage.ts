/**
 * Extract featured image path from MDX frontmatter.
 * Returns the image path or null if not specified.
 */

interface FrontMatterData {
  image?: string;
  [key: string]: unknown;
}

/**
 * Extract the featured image path from frontmatter data.
 * Returns the image path or null.
 */
export function extractFeaturedImage(data: FrontMatterData): string | null {
  if (typeof data.image === "string" && data.image.trim()) {
    return data.image.trim();
  }
  return null;
}
