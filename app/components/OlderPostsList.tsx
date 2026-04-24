import { Link } from "react-router";

interface OlderPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags?: string[];
  codeSnippet?: string | null;
}

interface OlderPostsListProps {
  posts: OlderPost[];
}

export default function OlderPostsList({ posts }: OlderPostsListProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-8">
        More Articles
      </h2>
      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group border-b border-border/50 pb-8 last:border-0"
          >
            <Link to={`/blog/${post.slug}`} className="block">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-secondary/60 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h3 className="text-xl font-semibold tracking-tight text-foreground group-hover:underline decoration-primary/30 underline-offset-8 mb-3">
                {post.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed max-w-2xl mb-4">
                {post.description}
              </p>

              {/* Code snippet preview */}
              {post.codeSnippet && (
                <div className="mb-4 overflow-hidden rounded-lg bg-secondary/40 border border-border/50 max-w-lg">
                  <pre className="px-4 py-2 text-xs font-mono text-muted-foreground overflow-hidden" style={{ maxHeight: "3rem" }}>
                    <code>{post.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                <time dateTime={post.date}>{post.date}</time>
                <span className="text-border">·</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
