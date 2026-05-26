import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import matter from 'gray-matter';
import { POSTS_DIR, postFile } from './paths';
import { renderMarkdown, stripMarkdown } from './markdown';
import { getReadingTime } from './reading-time';
import { compareDateDesc } from './date';
import { slugify } from './slug';
import type { Post, PostFrontmatter, PostSummary } from './types';

export const getAllPostSlugs = cache(async (): Promise<string[]> => {
  try {
    const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });
    const slugs: string[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const idx = path.join(POSTS_DIR, entry.name, 'index.md');
      try {
        await fs.access(idx);
        slugs.push(entry.name);
      } catch {
        // skip
      }
    }
    return slugs;
  } catch {
    return [];
  }
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  let raw: string;
  try {
    raw = await fs.readFile(postFile(slug), 'utf8');
  } catch {
    return null;
  }
  const parsed = matter(raw);
  const fm = parsed.data as PostFrontmatter;
  if (fm.draft && process.env.NODE_ENV === 'production') return null;
  const { html, toc } = await renderMarkdown(parsed.content, { slug });
  const readingTime = getReadingTime(parsed.content);
  return {
    slug,
    frontmatter: fm,
    html,
    toc,
    raw: parsed.content,
    readingTime
  };
});

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const slugs = await getAllPostSlugs();
  const posts = await Promise.all(slugs.map((s) => getPostBySlug(s)));
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => compareDateDesc(a.frontmatter.date, b.frontmatter.date));
});

export const getAllPostSummaries = cache(async (): Promise<PostSummary[]> => {
  const slugs = await getAllPostSlugs();
  const summaries: PostSummary[] = [];
  for (const slug of slugs) {
    const raw = await fs.readFile(postFile(slug), 'utf8');
    const parsed = matter(raw);
    const fm = parsed.data as PostFrontmatter;
    if (fm.draft && process.env.NODE_ENV === 'production') continue;
    const stripped = stripMarkdown(parsed.content);
    const excerpt = stripped.slice(0, 200).trim();
    summaries.push({
      slug,
      title: fm.title,
      description: fm.description,
      date: fm.date,
      updated: fm.updated,
      tags: fm.tags || [],
      cover: fm.cover,
      readingTime: getReadingTime(parsed.content),
      excerpt
    });
  }
  return summaries.sort((a, b) => compareDateDesc(a.date, b.date));
});

export const getAllTags = cache(async (): Promise<{ tag: string; slug: string; count: number }[]> => {
  const summaries = await getAllPostSummaries();
  const map = new Map<string, number>();
  for (const s of summaries) for (const t of s.tags) map.set(t, (map.get(t) ?? 0) + 1);
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, slug: slugify(tag), count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
});

export const getPostsByTag = cache(async (tagSlug: string): Promise<PostSummary[]> => {
  const summaries = await getAllPostSummaries();
  return summaries.filter((s) => s.tags.some((t) => slugify(t) === tagSlug));
});

export const getPrevNext = cache(
  async (slug: string): Promise<{ prev: PostSummary | null; next: PostSummary | null }> => {
    const summaries = await getAllPostSummaries();
    const idx = summaries.findIndex((s) => s.slug === slug);
    if (idx === -1) return { prev: null, next: null };
    // summaries are sorted desc by date — "prev" = older post, "next" = newer post
    const next = idx > 0 ? summaries[idx - 1] : null;
    const prev = idx < summaries.length - 1 ? summaries[idx + 1] : null;
    return { prev, next };
  }
);
