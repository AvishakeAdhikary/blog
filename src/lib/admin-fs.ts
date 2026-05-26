import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { POSTS_DIR, postAssetsDir, postDir, postFile } from './paths';
import { dirSlug } from './slug';
import type { PostFrontmatter } from './types';

function assertDev() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('admin-fs is disabled in production');
  }
}

export interface AdminPost {
  slug: string;
  frontmatter: PostFrontmatter;
  body: string;
}

export async function adminListPosts(): Promise<AdminPost[]> {
  assertDev();
  try {
    const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });
    const out: AdminPost[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const file = path.join(POSTS_DIR, entry.name, 'index.md');
      try {
        const raw = await fs.readFile(file, 'utf8');
        const parsed = matter(raw);
        out.push({
          slug: entry.name,
          frontmatter: parsed.data as PostFrontmatter,
          body: parsed.content
        });
      } catch {
        // skip
      }
    }
    return out.sort((a, b) =>
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    );
  } catch {
    return [];
  }
}

export async function adminReadPost(slug: string): Promise<AdminPost | null> {
  assertDev();
  try {
    const raw = await fs.readFile(postFile(slug), 'utf8');
    const parsed = matter(raw);
    return {
      slug,
      frontmatter: parsed.data as PostFrontmatter,
      body: parsed.content
    };
  } catch {
    return null;
  }
}

export async function adminCreatePost(input: {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  body?: string;
}): Promise<AdminPost> {
  assertDev();
  const slug = dirSlug(input.title);
  if (!slug) throw new Error('invalid title');
  const dir = postDir(slug);
  await fs.mkdir(dir, { recursive: true });
  await fs.mkdir(postAssetsDir(slug), { recursive: true });
  const fm: PostFrontmatter = {
    title: input.title,
    description: input.description || '',
    date: input.date || new Date().toISOString().slice(0, 10),
    tags: input.tags || []
  };
  const body = input.body || `Write your post here.\n`;
  const content = matter.stringify(body, fm as unknown as Record<string, unknown>);
  await fs.writeFile(postFile(slug), content, 'utf8');
  return { slug, frontmatter: fm, body };
}

export async function adminUpdatePost(
  slug: string,
  input: { frontmatter: PostFrontmatter; body: string }
): Promise<AdminPost> {
  assertDev();
  const content = matter.stringify(input.body, input.frontmatter as unknown as Record<string, unknown>);
  await fs.writeFile(postFile(slug), content, 'utf8');
  return { slug, frontmatter: input.frontmatter, body: input.body };
}

export async function adminDeletePost(slug: string): Promise<void> {
  assertDev();
  await fs.rm(postDir(slug), { recursive: true, force: true });
}

export async function adminSaveUpload(
  slug: string,
  filename: string,
  data: Uint8Array
): Promise<string> {
  assertDev();
  const dir = postAssetsDir(slug);
  await fs.mkdir(dir, { recursive: true });
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const out = path.join(dir, safe);
  await fs.writeFile(out, data);
  return `./assets/${safe}`;
}
