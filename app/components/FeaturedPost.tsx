import { Link } from "react-router";

interface FeaturedPostProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags?: string[];
  image?: string | null;
  codeSnippet?: string | null;
}

export default function FeaturedPost({
  slug,
  title,
  description,
  date,
  readTime,
  tags,
  image,
  codeSnippet,
}: FeaturedPostProps) {
  return (
    <section>
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-8">
        Latest Article
      </h2>

      <article className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
        {/* Featured image */}
        {image && (
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          </div>
        )}

        <Link to={`/blog/${slug}`} className="block p-8 md:p-12">
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight group-hover:underline decoration-primary/30 underline-offset-8">
            {title}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
            {description}
          </p>

          {/* Code snippet preview */}
          {codeSnippet && (
            <div className="mb-8 overflow-hidden rounded-xl bg-secondary/40 border border-border/50 max-w-xl">
              <pre className="px-6 py-4 text-sm font-mono text-muted-foreground overflow-hidden" style={{ maxHeight: "5rem" }}>
                <code>{codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <time dateTime={date}>{date}</time>
            <span className="text-border">·</span>
            <span>{readTime}</span>
            <span className="text-border">·</span>
            <span className="text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Read article
              <span className="text-lg">→</span>
            </span>
          </div>
        </Link>
      </article>
    </section>
  );
}
