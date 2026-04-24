interface TagsBarProps {
  tags: string[];
}

export default function TagsBar({ tags }: TagsBarProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
        Topics
      </h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            className="inline-flex items-center rounded-full bg-secondary/60 px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary/10 hover:text-primary cursor-default"
            title="Coming soon"
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}
