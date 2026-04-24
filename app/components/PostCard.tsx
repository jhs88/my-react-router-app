import { Link } from "react-router";

interface PostCardProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags?: string[];
  image?: string | null;
  codeSnippet?: string | null;
  featured?: boolean;
}

export default function PostCard({
  slug,
  title,
  description,
  date,
  readTime,
  tags,
  image,
  codeSnippet,
  featured = false,
}: PostCardProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      {/* Featured image */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
      )}

      <Link to={`/blog/${slug}`} className="block p-6">
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
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
        <h3
          className={`font-semibold tracking-tight text-foreground group-hover:underline decoration-primary/30 underline-offset-8 ${
            featured ? "text-2xl md:text-3xl mb-4" : "text-xl mb-3"
          }`}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`text-muted-foreground leading-relaxed ${
            featured ? "text-lg max-w-2xl mb-6" : "text-sm mb-4"
          }`}
        >
          {description}
        </p>

        {/* Code snippet preview */}
        {codeSnippet && (
          <div className="mb-4 overflow-hidden rounded-lg bg-secondary/40 border border-border/50">
            <pre className="px-4 py-3 text-xs font-mono text-muted-foreground overflow-hidden" style={{ maxHeight: "4rem" }}>
              <code>{codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
          <time dateTime={date}>{date}</time>
          <span className="text-border">·</span>
          <span>{readTime}</span>
        </div>
      </Link>
    </article>
  );
}
