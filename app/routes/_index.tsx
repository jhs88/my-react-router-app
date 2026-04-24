import type { MetaFunction } from "react-router";
import { useNavigation } from "react-router";
import { Spinner } from "~/components/ui/spinner";
import Terminal from "~/components/Terminal";
import FeaturedPost from "~/components/FeaturedPost";
import PostCard from "~/components/PostCard";
import TagsBar from "~/components/TagsBar";
import OlderPostsList from "~/components/OlderPostsList";
import { loadPosts } from "~/lib/loadPosts";
import { useTheme } from "next-themes";

export const meta: MetaFunction = () => {
  return [
    { title: "Journal" },
    {
      name: "description",
      content:
        "Notes on design, typography, and building with purpose.",
    },
  ];
};

export async function loader() {
  const posts = await loadPosts();
  return { posts };
}

export default function Index({
  loaderData,
}: {
  loaderData: { posts: import("~/lib/loadPosts").BlogPostData[] };
}) {
  const { posts } = loaderData;
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const { setTheme } = useTheme();

  // Split posts: featured (latest), secondary (next 2), older (rest)
  const featured = posts[0] ?? null;
  const secondary = posts.slice(1, 3);
  const older = posts.slice(3);

  // Collect all unique tags
  const allTags = [...new Set(posts.flatMap((p) => p.tags ?? []))].sort();

  // Handle theme toggle from terminal
  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setTheme(theme);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" aria-live="polite">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="space-y-32">
      {/* Terminal Hero */}
      <section>
        <Terminal posts={posts} onThemeChange={handleThemeChange} />
      </section>

      {/* Featured Post */}
      {featured && (
        <section>
          <FeaturedPost
            slug={featured.slug}
            title={featured.title}
            description={featured.description}
            date={featured.date}
            readTime={featured.readTime}
            tags={featured.tags}
            image={featured.image}
            codeSnippet={featured.codeSnippet}
          />
        </section>
      )}

      {/* Secondary Post Cards */}
      {secondary.length > 0 && (
        <section>
          <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-8">
            More Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secondary.map((post) => (
              <PostCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                description={post.description}
                date={post.date}
                readTime={post.readTime}
                tags={post.tags}
                image={post.image}
                codeSnippet={post.codeSnippet}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tags Bar */}
      {allTags.length > 0 && (
        <section>
          <TagsBar tags={allTags} />
        </section>
      )}

      {/* Older Posts List */}
      {older.length > 0 && (
        <section>
          <OlderPostsList posts={older} />
        </section>
      )}
    </div>
  );
}
