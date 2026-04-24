import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { extractCodeSnippet } from "./extractCodeSnippet";
import { extractTags } from "./extractTags";
import { extractFeaturedImage } from "./extractFeaturedImage";

export interface BlogPostData {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string | null;
  codeSnippet: string | null;
}

/**
 * Load all blog posts from the content directory.
 * Returns sorted by date (newest first).
 */
export async function loadPosts(): Promise<BlogPostData[]> {
  const blogDir = path.join(process.cwd(), "app/content/blog");

  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir);

  const posts: BlogPostData[] = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(blogDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);
      const slug = file.replace(".mdx", "");

      const tags = extractTags(data, content);
      const image = extractFeaturedImage(data);
      const codeSnippet = extractCodeSnippet(content)?.code ?? null;

      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "",
        readTime: data.readTime ?? "",
        tags,
        image,
        codeSnippet,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

/**
 * Load a single blog post by slug.
 * Returns null if not found.
 */
export async function loadPost(slug: string): Promise<BlogPostData | null> {
  const posts = await loadPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
