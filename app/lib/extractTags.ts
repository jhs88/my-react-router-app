/**
 * Extract tags from MDX frontmatter, with auto-extraction fallback
 * from code block languages.
 */

interface FrontMatterData {
  tags?: string[];
  [key: string]: unknown;
}

/**
 * Extract tags from frontmatter data.
 * Returns the tags array or undefined if no tags found.
 */
export function extractFrontmatterTags(data: FrontMatterData): string[] | undefined {
  if (Array.isArray(data.tags)) {
    return data.tags.map((tag) => String(tag).trim()).filter(Boolean);
  }
  return undefined;
}

/**
 * Extract code block languages from raw MDX content.
 * Returns a sorted, deduplicated array of languages.
 */
export function extractCodeLanguages(content: string): string[] {
  const codeBlockRegex = /```(\w+)/g;
  const languages = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    languages.add(match[1].toLowerCase());
  }

  return Array.from(languages).sort();
}

/**
 * Extract tags from MDX content using a hybrid approach:
 * 1. Try frontmatter tags first
 * 2. Fall back to code block languages
 */
export function extractTags(
  data: FrontMatterData,
  content: string,
): string[] {
  const frontmatterTags = extractFrontmatterTags(data);
  if (frontmatterTags && frontmatterTags.length > 0) {
    return frontmatterTags;
  }

  return extractCodeLanguages(content);
}
