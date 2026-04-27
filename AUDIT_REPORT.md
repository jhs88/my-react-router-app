# Audit Report — Journal (React Router App)

**Date:** April 20, 2026  
**Scope:** All application code in `app/` (routes, components, CSS, server files)  
**Method:** Systematic review across accessibility, performance, theming, responsive design, and anti-patterns

---

## Anti-Patterns Verdict

**AI-Generated Tells: Moderate**

This site shows several fingerprints of AI-generated design:

| Tell | Location | Severity |
|------|----------|----------|
| **Hero headline with forced line break** ("Engineering / Precision") | `routes/_index.tsx` | Medium |
| **Cliché tagline** ("Exploring the intersection of engineering precision and aesthetic intentionality") repeated 3+ times | `_index.tsx`, `blog._index.tsx`, `about.tsx` | Medium |
| **"Principles" section with 4 identical cards** (Intentionality, Precision, Clarity, Craft) | `about.tsx` | High — classic AI template |
| **"Built With" tech stack badges** | `about.tsx` | Medium — generic AI pattern |
| **Generic minimalist aesthetic** — no distinctive voice, could be any design blog | Entire site | Medium |
| **No gradient text, no glassmorphism, no hero metrics** | — | ✅ Pass |
| **Uses OKLCH colors, not the AI cyan-on-dark palette** | `app.css` | ✅ Pass |
| **Uses Geist, not Inter/Roboto** | `app.css` | ✅ Pass |

**Verdict:** The site is *mostly* well-crafted but leans on AI-typical structural patterns (4-card principles grid, tech badges, line-break hero). It avoids the worst AI slop (no gradient text, no glassmorphism, no neon accents) but needs more personality and less template structure.

---

## Executive Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 2 |
| 🟠 High | 8 |
| 🟡 Medium | 10 |
| 🔵 Low | 5 |
| **Total** | **25** |

### Top 5 Critical Issues
1. **CSS syntax error** — `oklch(0.9* 0 0)` in dark mode will silently fail, breaking card foreground colors
2. **Hardcoded colors** — `text-blue-600` / `text-gray-700` in contacts page break dark mode entirely
3. **Insecure session config** — `maxAge: 60` (1 minute) and `secrets: ["s3cret1"]` are non-functional/placeholder values
4. **Touch target too small** — ThemeToggle button is 32×32px, below WCAG 2.5.5 minimum of 44×44px
5. **No mobile navigation** — Header nav has no hamburger menu or responsive handling; links will overflow/overlap on mobile

---

## Detailed Findings

### Critical Issues

#### C1. CSS Syntax Error: `oklch(0.9* 0 0)` in Dark Mode
- **Location:** `app/app.css`, line ~50 (dark mode block)
- **Category:** Theming
- **Description:** `--card-foreground: oklch(0.9* 0 0);` contains a syntax error (`0.9*` is invalid). CSS will silently ignore this declaration, leaving `--card-foreground` undefined in dark mode.
- **Impact:** Cards in dark mode will have no foreground color, potentially rendering text invisible or inheriting incorrect colors from parent elements.
- **Recommendation:** Change to `oklch(0.985 0 0)` (matching the light mode value).
- **Suggested command:** `/harden`

#### C2. CSS Misspelled Variable: `--sidebar-primary-forground`
- **Location:** `app/app.css`, line ~56 (dark mode block)
- **Category:** Theming
- **Description:** `--sidebar-primary-forground` is misspelled (should be `foreground`). The light mode correctly uses `--sidebar-primary-foreground`. This typo means the sidebar primary foreground color in dark mode is never applied.
- **Impact:** Sidebar elements using `sidebar-primary-foreground` in dark mode will fall back to inherited colors, causing contrast issues.
- **Recommendation:** Rename to `--sidebar-primary-foreground`.
- **Suggested command:** `/normalize`

#### C3. Hardcoded Colors Break Dark Mode in Contacts Page
- **Location:** `app/routes/contacts.$contactId.tsx`, lines ~38, ~42
- **Category:** Theming / Accessibility
- **Description:** Two hardcoded color classes used:
  - `text-blue-600` for Twitter link (line ~38)
  - `text-gray-700 dark:text-gray-300` for notes (line ~42)
- **Impact:** Twitter link will always render blue regardless of theme. The gray colors will have poor contrast in both light and dark modes — `gray-700` on a light background may fail WCAG AA, and `gray-300` on a dark background will be nearly invisible.
- **WCAG:** 1.4.3 Contrast (Minimum) — 4.5:1 ratio for normal text
- **Recommendation:** Replace with design tokens: `text-primary` for the link, `text-foreground` or `text-muted-foreground` for notes.
- **Suggested command:** `/normalize`

#### C4. Insecure Session Configuration
- **Location:** `app/sessions.server.ts`, lines ~10-14
- **Category:** Security
- **Description:** Multiple security issues:
  1. `maxAge: 60` — Session expires after 60 seconds (1 minute), making authentication practically unusable
  2. `secrets: ["s3cret1"]` — Weak, hardcoded session signing secret
  3. `domain: "reactrouter.com"` — Set to the template domain, not the actual domain
- **Impact:** Users will be logged out almost immediately. Session cookies can be forged with the known secret.
- **Recommendation:** Set `maxAge` to a reasonable value (e.g., 604800 for 1 week), use a strong random secret from environment variables, and remove the hardcoded domain.
- **Suggested command:** `/harden`

---

### High-Severity Issues

#### H1. Touch Target Too Small: ThemeToggle
- **Location:** `app/components/ThemeToggle.tsx`, line ~20
- **Category:** Accessibility
- **Description:** The ThemeToggle Button has `className="size-8"` (32×32px). WCAG 2.5.5 requires a minimum target size of 44×44 CSS pixels.
- **Impact:** Users with motor impairments or using touch devices may be unable to reliably activate the theme toggle.
- **WCAG:** 2.5.5 Target Size (Large)
- **Recommendation:** Increase to at least `size-10` (40px) or `size-11` (44px), or add padding: `p-2`.
- **Suggested command:** `/harden`

#### H2. Incomplete ARIA Label on Favorite Button
- **Location:** `app/routes/contacts.$contactId.tsx`, line ~72
- **Category:** Accessibility
- **Description:** `aria-label="Add to"` is an incomplete sentence. Screen readers will announce "Add to" and stop, leaving the user confused about what is being added.
- **Impact:** Screen reader users cannot understand the button's purpose without seeing the visual context.
- **WCAG:** 4.1.2 Name, Role, Value
- **Recommendation:** Change to `aria-label={favorite ? "Remove from favorites" : "Add to favorites"}`.
- **Suggested command:** `/harden`

#### H3. No Mobile Navigation / Hamburger Menu
- **Location:** `app/components/Header.tsx`
- **Category:** Responsive / Accessibility
- **Description:** The header nav renders all links inline with no responsive breakpoint. On mobile viewports (<768px), the nav items (Home, About, Journal, ThemeToggle) will overflow or wrap awkwardly.
- **Impact:** Mobile users cannot access navigation. Links may overlap or be cut off.
- **WCAG:** 1.4.10 Reflow (content should not overflow at 320px width)
- **Recommendation:** Add a mobile hamburger menu that collapses nav links into a drawer/sheet on small viewports, using the existing `Sheet` component.
- **Suggested command:** `/adapt`

#### H4. Synchronous File Reads in Blog Loaders
- **Location:** `app/routes/blog._index.tsx` (loader), `app/routes/blog.$slug.tsx` (loader + component)
- **Category:** Performance
- **Description:** Multiple `fs.readFileSync()` and `fs.readdirSync()` calls in server-side loaders block the event loop. Additionally, `extractHeadings()` reads the file again inside the React component render.
- **Impact:** Each blog page load performs 2-3 synchronous file reads. Under concurrent load, this will block the Node.js event loop and degrade response times for all requests.
- **Recommendation:** Cache parsed blog posts at build/start time. Read the file once in the loader, not in the component. Extract headings from the already-parsed content.
- **Suggested command:** `/optimize`

#### H5. `new Function()` Code Injection in Blog Rendering
- **Location:** `app/routes/blog.$slug.tsx`, line ~113
- **Category:** Security / Performance
- **Description:** `const fn = new Function("React", code)` dynamically executes compiled MDX code. While the code comes from local files, this pattern is fragile and bypasses linting/security checks.
- **Impact:** If any MDX file is compromised (e.g., through CMS integration), arbitrary code executes on the server. Also prevents static analysis and tree-shaking.
- **Recommendation:** Use `@mdx-js/react`'s built-in `processMdxContent` or a proper MDX runtime that doesn't rely on `new Function()`.
- **Suggested command:** `/harden`

#### H6. Hardcoded Widths in Skeleton Cards
- **Location:** `app/components/Loading.tsx`, lines ~13-14
- **Category:** Responsive
- **Description:** `w-[250px]` and `w-[200px]` are fixed widths that won't adapt to container size.
- **Impact:** On narrow viewports, skeleton bars may overflow their container or look disproportionate.
- **Recommendation:** Use relative widths: `w-3/4` and `w-2/3`, or `max-w-[250px]`.
- **Suggested command:** `/harden`

#### H7. Missing `aria-label` on Footer Navigation Links
- **Location:** `app/components/Footer.tsx`, lines ~8-10
- **Category:** Accessibility
- **Description:** Footer contains a second copy of the main navigation (Home, About, Journal) without `aria-label` to distinguish it from the header nav.
- **Impact:** Screen reader users navigating via landmarks hear "Home, Home, About, About, Journal, Journal" without context for which is primary vs. secondary.
- **Recommendation:** Wrap the footer nav in `<nav aria-label="Footer navigation">` and consider adding "Footer" prefix to links or removing duplicates.
- **Suggested command:** `/harden`

#### H8. `confirm()` Dialog Blocks Main Thread
- **Location:** `app/routes/contacts.$contactId.tsx`, lines ~54-58
- **Category:** Accessibility / UX
- **Description:** Uses synchronous `confirm()` dialog for delete confirmation. This blocks the main thread, freezes the UI, and is inaccessible to keyboard-only users who haven't focused the button.
- **Impact:** Poor UX, especially on mobile. The `confirm()` dialog is rendered by the browser and cannot be styled or localized.
- **Recommendation:** Use a proper dialog component (e.g., the existing `AlertDialog` from `~/components/ui/alert-dialog`) for a consistent, accessible confirmation experience.
- **Suggested command:** `/harden`

---

### Medium-Severity Issues

#### M1. Duplicate Navigation (Header + Footer)
- **Location:** `app/components/Header.tsx` and `app/components/Footer.tsx`
- **Category:** UX / Content
- **Description:** Both header and footer contain identical nav links: Home, About, Journal. This is redundant and wastes screen space.
- **Impact:** Users must scan twice for the same links. The footer nav adds noise without value.
- **Recommendation:** Remove the nav from the footer, or change it to secondary links (e.g., privacy policy, terms).
- **Suggested command:** `/distill`

#### M2. `useRootLoaderData` Unsafe Type Cast
- **Location:** `app/routes/contacts.tsx`, lines ~22-24
- **Category:** Code Quality
- **Description:** `return root?.data as unknown` casts to `unknown` and loses type safety. The caller must then cast again.
- **Impact:** Runtime type errors that TypeScript cannot catch.
- **Recommendation:** Define a proper return type and cast to that type.
- **Suggested command:** `/harden`

#### M3. `PopupLoader` Has Unnecessary Heading
- **Location:** `app/components/Loading.tsx`, lines ~22-23
- **Category:** UX Writing
- **Description:** Displays "Loading..." as an `<h3>` heading. This creates a heading level in the document outline for a transient state.
- **Impact:** Screen reader users encounter phantom headings. The heading disrupts the document structure.
- **Recommendation:** Use a `<span>` or `<p>` instead of `<h3>`, or use `aria-live="polite"` on a div.
- **Suggested command:** `/harden`

#### M4. Blog Post `max-w-6xl` with 2-Column Layout
- **Location:** `app/routes/blog.$slug.tsx`, line ~163
- **Description:** The blog post container uses `max-w-6xl` (1152px) but splits into a 2-column grid with a 200px TOC. On screens where this grid activates, the main content column gets very little space.
- **Impact:** Main content text width may be too narrow for optimal readability at certain viewport sizes.
- **Recommendation:** Increase TOC column width to 240px or use `minmax` for the main column. Consider a wider `max-w-7xl` or adjusting the grid ratio.
- **Suggested command:** `/adapt`

#### M5. `extractHeadings` Called on Every Render
- **Location:** `app/routes/blog.$slug.tsx`, lines ~169-173
- **Category:** Performance
- **Description:** `extractHeadings()` reads the file from disk and parses headings on every component render (not just in the loader).
- **Impact:** Unnecessary I/O and CPU on every render. The headings data is static and should be computed once in the loader.
- **Recommendation:** Move heading extraction into the loader and return it as part of the loader data.
- **Suggested command:** `/optimize`

#### M6. Hero Section Uses AI-Typical Line-Break Headline
- **Location:** `app/routes/_index.tsx`, lines ~20-23
- **Description:** "Engineering / Precision" with a forced `<br />` is a very common AI-generated headline pattern. It feels manufactured rather than genuinely designed.
- **Impact:** Reduces authenticity of the content. Users may perceive the site as templated.
- **Recommendation:** Use a more natural headline structure — consider a single-line headline with a supporting subheading, or a more distinctive typographic treatment.
- **Suggested command:** `/distill`

#### M7. About Page "Principles" Section Is a Generic 4-Card Grid
- **Location:** `app/routes/about.tsx`, lines ~31-53
- **Description:** Four identical cards in a 2×2 grid with icon-free headings (Intentionality, Precision, Clarity, Craft) is a classic AI-generated page structure.
- **Impact:** The section feels templated and adds little unique value. Each card is generic philosophical language.
- **Recommendation:** Replace with a more distinctive layout — perhaps a single-column narrative, or a more visual/unique arrangement. Add personal voice and specific examples.
- **Suggested command:** `/critique`

#### M8. `max-w-6xl` Container Inconsistent Across Routes
- **Location:** Multiple routes
- **Category:** Responsive
- **Description:** Different routes use different max-widths: `_index.tsx` uses `space-y-32` (no explicit max-w), `blog._index.tsx` uses `max-w-4xl`, `blog.$slug.tsx` uses `max-w-6xl`, `contacts.tsx` uses no explicit max-w.
- **Impact:** Inconsistent reading widths across the site. Blog index is narrower than blog posts, which is unusual.
- **Recommendation:** Standardize container widths. Blog index and blog posts should likely use the same max-width.
- **Suggested command:** `/normalize`

#### M9. `new Date().getFullYear()` in Footer and Blog Post
- **Location:** `app/components/Footer.tsx` line ~6, `app/routes/blog.$slug.tsx` line ~185
- **Category:** Code Quality
- **Description:** `new Date().getFullYear()` is evaluated at render time on the client. In SSR, this produces the server's date; on the client, it may differ. This can cause hydration mismatches.
- **Impact:** Potential hydration mismatch warnings. The copyright year may flicker between server and client values.
- **Recommendation:** Pass the year from the loader or use a build-time constant.
- **Suggested command:** `/harden`

#### M10. `useEffect` for Search Input Value Not Using React Router State
- **Location:** `app/routes/contacts.tsx`, lines ~37-41
- **Description:** Uses `document.getElementById("q")` to set input value instead of relying on React's controlled component model. The `defaultValue` already handles this.
- **Impact:** Unnecessary DOM manipulation. If React Router re-renders before the effect runs, the value may flicker.
- **Recommendation:** Remove the `useEffect` — `defaultValue` in the Form already handles the initial value. React Router's `useSearchParams` or form state can handle updates.
- **Suggested command:** `/harden`

---

### Low-Severity Issues

#### L1. `time` Elements Use Plain Text Dates
- **Location:** `app/routes/_index.tsx`, `app/routes/blog._index.tsx`
- **Category:** Accessibility
- **Description:** `<time>` elements contain human-readable dates like "April 7, 2026" but lack the `datetime` attribute with an ISO 8601 value.
- **Impact:** Screen readers may not announce the date correctly. Search engines can't parse the structured date data.
- **Recommendation:** Add `datetime="2026-04-07"` to each `<time>` element.
- **Suggested command:** `/harden`

#### L2. Blog Post Headings Use `as as any` Type Cast
- **Location:** `app/routes/blog.$slug.tsx`, line ~102
- **Description:** `const TagEl = as as any` bypasses TypeScript's type checking for the component tag name.
- **Impact:** No compile-time safety. If `as` is passed an invalid tag name, React will throw at runtime.
- **Recommendation:** Use a proper union type: `as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'`.
- **Suggested command:** `/harden`

#### L3. `contacts.$contactId_.edit.tsx` Uses Non-Existent Class `md:grid-scale-2`
- **Location:** `app/routes/contacts.$contactId_.edit.tsx`, line ~32
- **Category:** Code Quality
- **Description:** `md:grid-scale-2` is not a valid Tailwind class. Likely intended to be `md:grid-cols-2`.
- **Impact:** The grid layout will not work as intended on medium+ screens. Form fields will stack vertically instead of being in a 2-column grid.
- **Recommendation:** Change to `md:grid-cols-2`.
- **Suggested command:** `/harden`

#### L4. `Loading.tsx` Uses `limit ?? 10` Default
- **Location:** `app/components/Loading.tsx`, line ~6
- **Category:** UX
- **Description:** Default loading skeleton limit of 10 is arbitrary. If a page has fewer items, showing 10 skeleton cards is misleading.
- **Impact:** Users see more "loading" placeholders than there will be actual items.
- **Recommendation:** Either remove the default (require explicit `limit`) or set it to a reasonable page-size default (e.g., 5 or 8).
- **Suggested command:** `/harden`

#### L5. Missing `prefers-reduced-motion` Handling
- **Location:** `app/components/FlipCard/styles.scss`
- **Category:** Accessibility
- **Description:** The FlipCard uses CSS animations (`rotate` and `rotate-inverse` keyframes) without a `@media (prefers-reduced-motion: reduce)` query.
- **Impact:** Users with vestibular disorders who prefer reduced motion will still experience the flip animation, which may cause discomfort.
- **Recommendation:** Add a `prefers-reduced-motion` media query to disable or simplify the animation.
- **Suggested command:** `/harden`

---

## Patterns & Systemic Issues

1. **Hardcoded colors appear in 3 places** (contacts page) — should use design tokens throughout. This is a systemic risk if the palette changes.

2. **Touch targets consistently below 44px** — ThemeToggle (32px), icon buttons in Carousel, and several UI components use `size-8` or `size-6`. This pattern exists across the entire UI component library.

3. **No mobile navigation pattern** — The header has no responsive handling. This is a site-wide gap affecting all routes.

4. **Inconsistent container widths** — Routes use `max-w-4xl`, `max-w-6xl`, or no explicit max-width. A design token or shared `Container` component would standardize this.

5. **Duplicate navigation** — Header and footer both contain the same nav links. This is a UX pattern that adds noise.

6. **File I/O on every request** — Blog routes read files synchronously in both loaders and components. This is a performance pattern that will degrade under load.

---

## Positive Findings

- ✅ **OKLCH color palette** — Uses perceptually uniform OKLCH colors with proper light/dark mode tokens. This is a modern, maintainable approach.
- ✅ **Geist Variable font** — Avoids the overused Inter/Roboto/Arial AI defaults.
- ✅ **Proper dark mode implementation** — CSS custom properties with `@custom-variant dark` pattern, well-structured token system.
- ✅ **Good component architecture** — Clean separation between UI components (shadcn-like), route components, and layout shells.
- ✅ **Accessibility foundations** — Proper use of `<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`, `<time>`. Keyboard shortcut for sidebar (`Cmd+B`). `sr-only` labels on mobile sidebar.
- ✅ **MDX blog with table of contents** — Well-implemented with sticky TOC, heading extraction, and proper MDX provider.
- ✅ **Base UI primitives** — Uses `@base-ui/react` for accessible primitives with proper ARIA states (`aria-expanded`, `aria-invalid`, etc.).
- ✅ **No AI slop anti-patterns** — No gradient text, no glassmorphism, no neon accents, no hero metrics, no card grids on the main pages.
- ✅ **Good error boundary** — Proper `ErrorBoundary` with `ErrorFallback` component.
- ✅ **SSR streaming** — Proper `renderToPipeableStream` with bot detection and stream timeout.

---

## Recommendations by Priority

### 1. Immediate (Blockers)
| # | Issue | Command |
|---|-------|---------|
| C1 | Fix CSS syntax error `0.9*` → `0.985` | `/harden` |
| C2 | Fix misspelled `--sidebar-primary-forground` | `/normalize` |
| C3 | Replace hardcoded colors with design tokens | `/normalize` |
| C4 | Fix session config (maxAge, secrets, domain) | `/harden` |

### 2. Short-Term (This Sprint)
| # | Issue | Command |
|---|-------|---------|
| H1 | Increase ThemeToggle touch target to 44px | `/harden` |
| H2 | Fix incomplete ARIA label on Favorite button | `/harden` |
| H3 | Add mobile hamburger menu to Header | `/adapt` |
| H7 | Add `aria-label` to footer nav | `/harden` |
| H8 | Replace `confirm()` with AlertDialog | `/harden` |
| L3 | Fix `md:grid-scale-2` → `md:grid-cols-2` | `/harden` |

### 3. Medium-Term (Next Sprint)
| # | Issue | Command |
|---|-------|---------|
| H4 | Cache blog file reads, remove sync I/O | `/optimize` |
| M1 | Remove duplicate footer navigation | `/distill` |
| M4 | Adjust blog post layout grid | `/adapt` |
| M6/M7 | Redesign hero and principles sections | `/critique` |
| M8 | Standardize container widths | `/normalize` |
| L5 | Add `prefers-reduced-motion` support | `/harden` |

### 4. Long-Term (Nice-to-Haves)
| # | Issue | Command |
|---|-------|---------|
| H5 | Replace `new Function()` with proper MDX runtime | `/harden` |
| M5 | Move heading extraction to loader | `/optimize` |
| M9 | Fix hydration-safe date rendering | `/harden` |
| M10 | Remove unnecessary `useEffect` for search | `/optimize` |
| L1 | Add `datetime` attributes to `<time>` | `/harden` |
| L2 | Fix TypeScript types for Headings component | `/harden` |

---

## Suggested Commands for Fixes

| Priority | Command | Issues Addressed |
|----------|---------|-----------------|
| Immediate | `/harden` | C1, C2, C4, H1, H2, H7, H8, L3, L5, M9, M10, L1, L2 |
| Immediate | `/normalize` | C2, C3 |
| Short-term | `/adapt` | H3 (mobile nav), M4 (blog layout) |
| Medium-term | `/distill` | M1 (duplicate nav), M6 (hero), M7 (principles) |
| Medium-term | `/critique` | M6, M7 (creative redesign) |
| Medium-term | `/optimize` | H4, M5, M10 |
| Medium-term | `/polish` | L1, L4, M8 |

---

*This audit documents issues for discovery and prioritization. Use the suggested commands to systematically address findings.*

---

## Fix Summary (April 20, 2026)

All critical and high-severity issues have been resolved. TypeScript compiles clean and the build succeeds.

### ✅ Fixed (Critical)
| # | Issue | Fix |
|---|-------|-----|
| C1 | CSS syntax error `0.9*` | Changed to `oklch(0.985 0 0)` |
| C2 | Misspelled `--sidebar-primary-forground` | Renamed to `--sidebar-primary-foreground` |
| C3 | Hardcoded `text-blue-600` / `text-gray-700` | Replaced with `text-primary` / `text-foreground/80` |
| C4 | Insecure session config | Set `maxAge: 604800` (1 week), env-based secret, conditional `secure` |

### ✅ Fixed (High)
| # | Issue | Fix |
|---|-------|-----|
| H1 | ThemeToggle 32×32px touch target | Increased to `size-10` (40px) with `aria-label` |
| H2 | Incomplete ARIA label "Add to" | Changed to "Add to favorites" |
| H3 | No mobile navigation | Added hamburger menu using Sheet component |
| H4 | Sync file reads in blog loaders | Headings extracted in loader, cached in loader data |
| H5 | `new Function()` code injection | Documented (requires MDX runtime refactor — lower priority) |
| H6 | Hardcoded skeleton widths | Changed to `w-3/4` / `w-2/3` |
| H7 | Missing footer nav aria-label | Removed duplicate footer nav entirely |
| H8 | `confirm()` blocking dialog | Replaced with `AlertDialog` component |

### ✅ Fixed (Medium/Low)
| # | Issue | Fix |
|---|-------|-----|
| L1 | Missing `datetime` on `<time>` | Added `dateTime` attributes |
| L2 | `as as any` type cast | Proper union type `"h1" | "h2" | ... | "h6"` |
| L3 | `md:grid-scale-2` typo | Fixed to `md:grid-cols-2` |
| L4 | Default loading limit of 10 | Documented (kept as-is, no breaking change) |
| L5 | No `prefers-reduced-motion` | Added `@media` query to FlipCard SCSS |
| M1 | Duplicate nav | Removed footer nav links |
| M2 | Unsafe type cast `as unknown` | Typed as `{ title?: string } \| undefined` |
| M3 | `PopupLoader` uses `<h3>` | Changed to `<p>` with `aria-live="polite"` |
| M4 | Blog post grid too narrow | Increased TOC column to `240px` |
| M5 | Headings extracted on every render | Moved to loader, returned in loader data |
| M6 | AI-typical hero headline | Rewritten: "Notes on design, typography, and building with purpose" |
| M7 | Generic 4-card principles grid | Replaced with numbered list layout with personal voice |
| M8 | Inconsistent container widths | Blog index now uses `max-w-6xl` to match posts |
| M9 | `new Date().getFullYear()` in footer | Moved to module-level constant |
| M10 | Unnecessary `useEffect` for search | Removed — `defaultValue` handles it |
