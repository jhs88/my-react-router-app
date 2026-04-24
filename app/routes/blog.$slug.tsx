import type { MetaFunction } from "react-router";
import path from "path";
import fs from "fs";
import React, { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";
import { MDXProvider } from "@mdx-js/react";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const meta = data as Awaited<ReturnType<typeof loader>>;
  return [
    { title: `${meta.meta.title} — Journal` },
    { name: "description", content: meta.meta.description },
  ];
};

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(content: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = content.split("\n");
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      headings.push({
        id: match[2]
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-"),
        text: match[2],
        level: match[1].length,
      });
    }
  }

  return headings;
}

export async function loader({ params }: { params: { slug: string } }) {
  const blogDir = path.join(process.cwd(), "app/content/blog");
  const filePath = path.join(blogDir, `${params.slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Response("Not Found", { status: 404 });
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  const compiled = await compile(content, {
    outputFormat: "function-body",
  });

  return {
    meta: {
      title: data.title,
      date: data.date,
      readTime: data.readTime,
      description: data.description,
    },
    compiledCode: String(compiled),
    slug: params.slug,
    headings: extractHeadings(content),
  };
}

const headingSizes: Record<string, string> = {
  h1: "text-4xl md:text-5xl font-bold tracking-tight mb-8",
  h2: "text-2xl md:text-3xl font-semibold tracking-tight mt-16 mb-6 scroll-mt-24",
  h3: "text-xl md:text-2xl font-semibold tracking-tight mt-12 mb-4 scroll-mt-24",
  h4: "text-lg md:text-xl font-semibold tracking-tight mt-10 mb-4 scroll-mt-24",
  h5: "text-base md:text-lg font-medium tracking-tight mt-8 mb-3 scroll-mt-24",
  h6:
    "text-sm md:text-base font-medium tracking-tight mt-8 mb-3 scroll-mt-24",
};

function Headings({
  as,
  children,
  ...rest
}: {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLHeadingElement>, "as">) {
  const TagEl = as;
  return <TagEl className={headingSizes[as] ?? ""} {...rest}>{children}</TagEl>;
}

function CodeBlock({
  className,
  children,
  ...rest
}: {
  className?: string;
  children?: React.ReactNode;
} & Record<string, unknown>) {
  const isInline = !className;
  if (isInline) {
    return (
      <code
        className="bg-secondary/60 text-foreground/90 px-1.5 py-0.5 rounded text-sm font-mono"
        {...rest}
      >
        {children}
      </code>
    );
  }
  return (
    <div className="my-8">
      <pre className="bg-secondary/40 border border-border/50 rounded-xl p-6 overflow-x-auto text-sm font-mono leading-relaxed" {...rest}>
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

function BlogPostContent({ code }: { code: string }) {
  const [MDXComponent] = useState(() => {
    const fn = new Function("jsxRuntime", code);
    const mod = fn({ Fragment, jsx, jsxs });
    return mod.default;
  });

  if (!MDXComponent) return null;

  return (
    <MDXProvider
      components={{
        h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Headings as="h1" {...props} />,
        h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Headings as="h2" {...props} />,
        h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Headings as="h3" {...props} />,
        h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Headings as="h4" {...props} />,
        h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Headings as="h5" {...props} />,
        h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Headings as="h6" {...props} />,
        a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
          const href = props.href ?? "";
          const isExternal = href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//");
          return (
            <a
              className="text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors"
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              {...props}
            />
          );
        },
        code: CodeBlock,
        blockquote: (props: React.HTMLAttributes<HTMLElement>) => (
          <blockquote
            className="border-l-4 border-primary/30 pl-6 py-2 my-8 text-foreground/80 italic"
            {...props}
          />
        ),
        ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
          <ul
            className="my-6 space-y-3 list-disc list-inside text-foreground/80"
            {...props}
          />
        ),
        ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
          <ol
            className="my-6 space-y-3 list-decimal list-inside text-foreground/80"
            {...props}
          />
        ),
        li: (props: React.HTMLAttributes<HTMLLIElement>) => (
          <li className="pl-1" {...props} />
        ),
        hr: () => <hr className="my-16 border-border" />,
        strong: (props: React.HTMLAttributes<HTMLElement>) => (
          <strong className="font-semibold text-foreground" {...props} />
        ),
      }}
    >
      <MDXComponent />
    </MDXProvider>
  );
}

export default function BlogPost({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { meta, compiledCode, headings } = loaderData;

  return (
    <article className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-12">
        {/* Main content */}
        <div className="min-w-0">
          <header className="mb-16 pb-12 border-b border-border">
            <div className="flex items-center gap-4 text-sm font-medium text-primary/80 uppercase tracking-widest mb-6">
              <span>{meta.date}</span>
              <span className="text-border">•</span>
              <span className="text-muted-foreground">{meta.readTime}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              {meta.title}
            </h1>
            {meta.description && (
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {meta.description}
              </p>
            )}
          </header>

          <div className="max-w-none space-y-6 text-foreground/80 leading-relaxed">
            <BlogPostContent code={compiledCode} />
          </div>
        </div>

        {/* Table of contents */}
        {headings.length > 0 && (
          <aside className="hidden md:block">
            <div className="sticky top-24">
              <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
                Contents
              </h3>
              <nav className="space-y-2 border-l border-border">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`block pl-4 text-sm text-muted-foreground hover:text-foreground transition-colors ${
                      heading.level === 2
                        ? ""
                        : heading.level === 3
                          ? "ml-8"
                          : "ml-12"
                    }`}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
