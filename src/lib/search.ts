'use client';

import { withBasePath } from './site';

export interface SearchEntry {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags: string[];
  excerpt: string;
}

let cache: SearchEntry[] | null = null;
let pending: Promise<SearchEntry[]> | null = null;

export async function loadSearchIndex(): Promise<SearchEntry[]> {
  if (cache) return cache;
  if (pending) return pending;
  pending = (async () => {
    try {
      const res = await fetch(withBasePath('/search-index.json'), { cache: 'force-cache' });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = (await res.json()) as SearchEntry[];
      cache = data;
      return data;
    } catch {
      cache = [];
      return cache;
    } finally {
      pending = null;
    }
  })();
  return pending;
}

export function search(query: string, entries: SearchEntry[]): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries.slice(0, 10);
  const tokens = q.split(/\s+/).filter(Boolean);
  const scored = entries
    .map((e) => {
      const haystack = `${e.title} ${e.description ?? ''} ${e.tags.join(' ')} ${e.excerpt}`.toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (e.title.toLowerCase().includes(t)) score += 5;
        if (e.tags.some((tag) => tag.toLowerCase().includes(t))) score += 3;
        if (haystack.includes(t)) score += 1;
      }
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((x) => x.e);
  return scored;
}
