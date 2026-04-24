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
    <div className="space-y-32">
      <section>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-6 leading-tight">
          Journal
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
          Exploring the intersection of engineering precision and aesthetic intentionality.
        </p>
      </section>

      <section>
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-12">
          Articles
        </h2>
        <div className="space-y-16">
        {posts.map((post, index) => (
          <article
            key={post.slug}
            className={`group ${
              index === 0 ? "pb-16 border-b border-border" : "pb-16"
            }`}
          >
            <a href={`/blog/${post.slug}`} className="block">
              <time className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4 block" dateTime={post.date}>
                {post.date}
              </time>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground group-hover:underline decoration-primary/30 underline-offset-8 mb-4">
                {post.title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {post.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                <span>Read article</span>
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
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
