# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, etc.) working in this repo. Read this before making changes.

## What this is

A personal blog — Next.js App Router, statically exported to GitHub Pages. Content is authored in
plain Markdown, not MDX. Author: Avishake Adhikary (ML engineer — LLMs, diffusion, multimodal).
Blog content should stay AI/ML-focused.

## Stack

- Next.js (App Router), React, TypeScript (strict).
- Tailwind CSS v4, `@tailwindcss/typography`. Theme colors are CSS custom properties
  (`--bg`, `--fg`, `--muted`, `--accent`, `--accent-hover`, `--border`, `--code-bg`) defined in
  `src/app/globals.css` under `:root`/`[data-theme='dark']`/`[data-theme='light']`. Dark/light is a
  **custom** implementation (`src/components/ThemeProvider.tsx`, `data-theme` attribute + localStorage
  key `monolog:theme`) — not `next-themes`, and Tailwind's own `dark:` variant is **not** used anywhere
  in the codebase (theming happens purely through the CSS variables above, driven by `[data-theme]`
  selectors). When adding UI, reuse these CSS variables — never hardcode colors.
- Package manager: npm only (`package-lock.json`). `.npmrc` sets `legacy-peer-deps=true`.

## Directory map

- `content/posts/<slug>/index.md` — one post per folder, frontmatter via `gray-matter` (title, date,
  description, tags, cover, draft, author). Sibling `content/posts/<slug>/assets/` holds local images
  and videos referenced as `./assets/<file>`.
- `content/about.md`, `content/site.json` — the about page and site-wide config
  (title/description/nav/social), read by `src/lib/site.ts`.
- `src/lib/markdown.ts` — the `unified`/`remark`/`rehype` pipeline that turns a post's Markdown body
  into the HTML stored on `Post.html`. This is the place to add new Markdown-level behavior (custom
  fenced-code handling, custom embed syntax, etc.) — see "Extending the pipeline" below.
- `src/components/MarkdownContent.tsx` — the client component that injects `post.html` via
  `dangerouslySetInnerHTML` and then progressively enhances the rendered DOM in a `useEffect` (copy
  buttons on code blocks, Mermaid diagram rendering, video facades, per-heading TTS buttons). New
  post-render DOM behavior belongs here, following the existing pattern: walk the root, attach
  listeners/inject elements, return a cleanup function.
- `src/app/posts/[slug]/page.tsx`, `src/app/about/page.tsx` — the two pages that render
  `<MarkdownContent>`.
- `scripts/prebuild.mjs` — runs before every `dev`/`build`: builds the search index, the RSS feed, the
  sitemap, then copies each post's `assets/` folder into `public/posts/<slug>/assets/`.
- `scripts/build-rss.mjs` — see **"RSS is independent of the render pipeline"** below.
- `src/lib/db/` — pluggable comment/like storage adapters (`Local`/`Prisma`/`Supabase`/`Firebase`/
  `Mongo`). `LocalAdapter` is the active default (`src/lib/env.ts`'s `dbAdapterName`). The Prisma
  adapter (`prisma/schema.prisma`) is scaffolded but throws `NotImplementedError` — it's not wired up,
  don't assume it works.

## RSS is independent of the render pipeline

`scripts/build-rss.mjs` builds `public/feed.xml` by globbing `content/posts/*/index.md` directly and
reading each file's **frontmatter only** (`gray-matter`) — it never calls `renderMarkdown()` and never
sees the rendered HTML body. This means:

- Changes to the Markdown → HTML pipeline (new remark/rehype plugins, new embed syntax, Mermaid,
  video, etc.) **cannot** break the RSS feed, by construction.
- The RSS `description` is always just the frontmatter `description` (a summary), never full post
  content. If a future task asks for full-content RSS, that's a deliberate change to
  `scripts/build-rss.mjs`, not a bug fix.

## Extending the pipeline

`src/lib/markdown.ts` composes, in order: `remark-parse` → `remark-gfm` → `remark-math` →
`remark-rehype` (`allowDangerousHtml: true`) → `rehype-raw` → `rehype-slug` →
`rehype-autolink-headings` → `rehype-katex` → `rehype-pretty-code` (Shiki) → a custom ToC-extracting
visitor → `rehype-stringify`. `rehype-slug` gives every `h2`–`h4` a stable `id`; the ToC visitor
collects those into `Post.toc`, consumed by `src/components/TableOfContents.tsx`.

If you need a fenced code block (or any node) to bypass `rehype-pretty-code`'s Shiki highlighting,
transform it into something other than `pre > code` (e.g. a `div`) at the **remark** (mdast) stage,
before `remark-rehype` runs — see `src/lib/remark-mermaid.ts` for the pattern. Anything still shaped
like `pre > code` when `rehype-pretty-code` runs will get syntax-highlighted.

Local asset paths (`./assets/<file>` in Markdown or raw HTML `src`/`href`) are rewritten to
`{basePath}/posts/<slug>/assets/<file>` by `rewriteAssetPaths()` in `markdown.ts`, via a regex over the
raw Markdown string before parsing. This already covers video/image `src` and Markdown image syntax —
no changes needed there for new embed types that reuse `./assets/...` paths.

## Static export gotcha

`next.config.mjs` sets `output: 'export'` only in production. Admin CMS API routes under
`src/app/api/admin/**` use a `.api.ts` extension that's excluded from `pageExtensions` in production
builds specifically so they don't collide with `output: 'export'` (API routes can't exist in a static
export). Don't "fix" this by renaming those files to `.ts` — that would break the production build.

## Commands

- `npm run dev` — runs `scripts/prebuild.mjs` then `next dev`.
- `npm run build` — production build (static export). Prebuild is _not_ automatically run first in
  CI — check `.github/workflows/deploy.yml` for the exact sequence before assuming otherwise.
- `npm run lint` / `npm run typecheck` / `npm run format`.
- `npm run clean` — removes `.next`, `out`, and generated `public/*.xml`/`public/search-index.json`.

## Conventions

- No test suite exists. Verify changes via `typecheck` + `lint` + `build`, and manually via `dev` for
  anything visual.
- Prettier config: semicolons, single quotes, no trailing commas, 100-char width,
  `prettier-plugin-tailwindcss` for class sorting. Run `npm run format` before considering work done.
- New interactive UI (buttons, toolbars) should visually match the existing `.copy-code-btn` pattern in
  `src/styles/prose.css` (bordered, `var(--bg)`/`var(--muted)`/`var(--border)`, accent color on hover)
  rather than introducing a new visual language.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
