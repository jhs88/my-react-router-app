# Journal

A modern web journal built with React Router, TypeScript, and Tailwind CSS.

## Tech Stack

- [React Router v7](https://reactrouter.com) — Routing and data loading
- [TypeScript](https://www.typescriptlang.org) — Type safety
- [Tailwind CSS v4](https://tailwindcss.com) — Styling
- [MDX](https://mdxjs.com) — Blog content
- [Geist](https://vercel.com/font) — Typography
- [shadcn/ui](https://ui.shadcn.com) — UI components

## Getting Started

```bash
npm install
npm run dev
```

## Development

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run start     # Start production server
npm run typecheck # Type check
```

## Blog

Blog posts live in `app/content/blog/` as MDX files. Each post has frontmatter for metadata (title, date, readTime, description).

## Project Structure

```
app/
├── components/     # Reusable UI components
│   ├── ui/         # shadcn/ui components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── LayoutShell.tsx
├── content/blog/   # MDX blog posts
├── routes/         # File-based routes
├── types/          # Shared TypeScript types
└── api/            # Data layer
```
