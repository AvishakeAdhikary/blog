# monolog

A minimal, monospace-themed blog built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Statically exported and ready for GitHub Pages.

## Stack

- Next.js 15 (App Router, `output: 'export'`)
- React 19
- TypeScript
- Tailwind CSS + `@tailwindcss/typography`
- Markdown via `unified` / `remark` / `rehype` (GFM, math via KaTeX, syntax highlighting via `rehype-pretty-code` / Shiki)
- JetBrains Mono via `next/font/google`
- Giscus for comments (optional)
- Pluggable DB adapter for likes/comments (local by default; Prisma/Supabase/Firebase/Mongo stubs included)

## Quick Start

```bash
npm install
npm run dev
# build static site
npm run build
```

After build, the static site is in `out/`.

## Authoring Posts

Posts live in `content/posts/<slug>/index.md`. Frontmatter schema:

```yaml
---
title: "My Post"
description: "A short description."
date: "2026-01-10"
updated: "2026-01-12"  # optional
tags: ["typescript", "next"]
draft: false           # optional
cover: "./assets/cover.svg"  # optional, relative to post folder
---
```

Assets go inside `content/posts/<slug>/assets/`. They are copied to `public/posts/<slug>/assets/` at prebuild time.

## Admin (dev only)

Run `npm run dev`, then visit `/admin`. It allows creating, editing, deleting posts, and uploading assets. In production builds, this page renders a "local only" stub; the underlying API routes return 404.

## Theming

CSS custom properties drive the palette. Dark is the default. Light mode is toggled by setting `data-theme="light"` on `<html>`. The `ThemeToggle` persists choice to `localStorage`.

## Deploy to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds the site and publishes to Pages. It auto-derives `basePath` from the repo name. For the canonical site at `https://avishakeadhikary.github.io/blog`, the repo should be named `blog`.

## Swapping DB Adapter

Set `NEXT_PUBLIC_DB_ADAPTER` to one of: `local`, `prisma`, `supabase`, `firebase`, `mongo`. Only `local` is implemented out of the box; the others are scaffolded adapters that throw `NotImplementedError` until wired up.

## Giscus

Set the following env vars to enable comments:

```
NEXT_PUBLIC_GISCUS_REPO=owner/repo
NEXT_PUBLIC_GISCUS_REPO_ID=...
NEXT_PUBLIC_GISCUS_CATEGORY=General
NEXT_PUBLIC_GISCUS_CATEGORY_ID=...
```

## License

MIT — see `LICENSE`.
