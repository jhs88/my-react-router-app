/**
 * Extract the first code block from raw MDX content.
 * Returns the code content and language, or null if no code block found.
 */

interface CodeSnippet {
  code: string;
  language: string;
}

export function extractCodeSnippet(content: string): CodeSnippet | null {
  const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)\n```/g;
  const match = codeBlockRegex.exec(content);

  if (!match) {
    return null;
  }

  const language = match[1] || "text";
  const code = match[2].trim();

  return { code, language };
}
