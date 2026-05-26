import type { Comment, DbAdapter } from './types';
import { NotImplementedError } from './types';

const KEY_LIKES = 'monolog:likes';
const KEY_LIKED = 'monolog:liked';
const KEY_VIEWS = 'monolog:views';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readMap(key: string): Record<string, number> {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as Record<string, number>;
    return {};
  } catch {
    return {};
  }
}

function writeMap(key: string, value: Record<string, number>): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function readSet(key: string): Set<string> {
  if (!isBrowser()) return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed as string[]);
    return new Set();
  } catch {
    return new Set();
  }
}

function writeSet(key: string, value: Set<string>): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(value)));
  } catch {
    // ignore
  }
}

export class LocalAdapter implements DbAdapter {
  name = 'local';

  async getLikes(postSlug: string): Promise<number> {
    const m = readMap(KEY_LIKES);
    return m[postSlug] ?? 0;
  }

  async hasLiked(postSlug: string): Promise<boolean> {
    const s = readSet(KEY_LIKED);
    return s.has(postSlug);
  }

  async like(postSlug: string): Promise<number> {
    const m = readMap(KEY_LIKES);
    const s = readSet(KEY_LIKED);
    if (!s.has(postSlug)) {
      m[postSlug] = (m[postSlug] ?? 0) + 1;
      s.add(postSlug);
      writeMap(KEY_LIKES, m);
      writeSet(KEY_LIKED, s);
    }
    return m[postSlug] ?? 0;
  }

  async unlike(postSlug: string): Promise<number> {
    const m = readMap(KEY_LIKES);
    const s = readSet(KEY_LIKED);
    if (s.has(postSlug)) {
      m[postSlug] = Math.max(0, (m[postSlug] ?? 0) - 1);
      s.delete(postSlug);
      writeMap(KEY_LIKES, m);
      writeSet(KEY_LIKED, s);
    }
    return m[postSlug] ?? 0;
  }

  async getViews(postSlug: string): Promise<number> {
    const m = readMap(KEY_VIEWS);
    return m[postSlug] ?? 0;
  }

  async incrementViews(postSlug: string): Promise<number> {
    const m = readMap(KEY_VIEWS);
    m[postSlug] = (m[postSlug] ?? 0) + 1;
    writeMap(KEY_VIEWS, m);
    return m[postSlug];
  }

  async listComments(_postSlug: string): Promise<Comment[]> {
    throw new NotImplementedError('LocalAdapter.listComments (use Giscus instead)');
  }

  async addComment(_postSlug: string, _body: string, _authorName: string): Promise<Comment> {
    throw new NotImplementedError('LocalAdapter.addComment (use Giscus instead)');
  }
}
