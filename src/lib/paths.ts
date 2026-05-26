import 'server-only';
import path from 'node:path';

export const PROJECT_ROOT = process.cwd();
export const CONTENT_DIR = path.join(PROJECT_ROOT, 'content');
export const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
export const ABOUT_FILE = path.join(CONTENT_DIR, 'about.md');
export const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
export const PUBLIC_POSTS_DIR = path.join(PUBLIC_DIR, 'posts');

export function postDir(slug: string) {
  return path.join(POSTS_DIR, slug);
}

export function postFile(slug: string) {
  return path.join(postDir(slug), 'index.md');
}

export function postAssetsDir(slug: string) {
  return path.join(postDir(slug), 'assets');
}
