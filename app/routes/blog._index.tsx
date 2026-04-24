import type { MetaFunction } from "react-router";
import { useNavigation } from "react-router";
import { Spinner } from "~/components/ui/spinner";
import { loadPosts } from "~/lib/loadPosts";

export const meta: MetaFunction = () => {
  return [
    { title: "Journal — Articles & Notes" },
    {
      name: "description",
      content:
        "Exploring the intersection of engineering precision and aesthetic intentionality.",
    },
  ];
};

export async function loader() {
  const posts = await loadPosts();
  return { posts };
}

export default function BlogIndex({
  loaderData,
}: {
  loaderData: { posts: import("~/lib/loadPosts").BlogPostData[] };
}) {
  const { posts } = loaderData;
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" aria-live="polite">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="space-y-24">
      <section>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-6 leading-tight">
          Journal
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
          All articles, listed chronologically.
        </p>
      </section>

      <section>
        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <a href={`/blog/${post.slug}`} className="block">
                <div className="flex items-baseline gap-4 mb-2">
                  <time className="text-xs font-medium text-muted-foreground uppercase tracking-widest" dateTime={post.date}>
                    {post.date}
                  </time>
                  {post.tags && post.tags.length > 0 && (
                    <span className="text-xs text-muted-foreground">·</span>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {post.tags.join(", ")}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground group-hover:underline decoration-primary/30 underline-offset-8 mb-3">
                  {post.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  {post.description}
                </p>
              </a>
            </article>
          ))}

          {posts.length === 0 && (
            <p className="text-muted-foreground">No posts yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
