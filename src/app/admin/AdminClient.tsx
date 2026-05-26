'use client';

import { useCallback, useEffect, useState } from 'react';
import { Container } from '@/components/Container';
import { PostListPanel } from './components/PostListPanel';
import { PostEditor } from './components/PostEditor';
import type { PostFrontmatter } from '@/lib/types';

export interface AdminPost {
  slug: string;
  frontmatter: PostFrontmatter;
  body: string;
}

export function AdminClient() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/posts/');
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = (await res.json()) as AdminPost[];
      setPosts(data);
      if (!selected && data.length > 0) setSelected(data[0].slug);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to load');
    } finally {
      setLoading(false);
    }
  }, [selected]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onCreate = async (title: string) => {
    const res = await fetch('/api/admin/posts/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    if (!res.ok) {
      setError(`create failed: ${res.status}`);
      return;
    }
    const created = (await res.json()) as AdminPost;
    await refresh();
    setSelected(created.slug);
  };

  const onDelete = async (slug: string) => {
    if (!confirm(`Delete post "${slug}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/posts/${encodeURIComponent(slug)}/`, { method: 'DELETE' });
    if (!res.ok) {
      setError(`delete failed: ${res.status}`);
      return;
    }
    if (selected === slug) setSelected(null);
    await refresh();
  };

  const onSave = async (slug: string, frontmatter: PostFrontmatter, body: string) => {
    const res = await fetch(`/api/admin/posts/${encodeURIComponent(slug)}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ frontmatter, body })
    });
    if (!res.ok) {
      setError(`save failed: ${res.status}`);
      return false;
    }
    await refresh();
    return true;
  };

  const current = posts.find((p) => p.slug === selected) || null;

  return (
    <Container size="lg">
      <div className="py-8">
        <header className="mb-6 flex items-baseline justify-between">
          <h1 className="text-3xl font-bold">admin</h1>
          <span className="text-xs text-muted">dev mode only</span>
        </header>
        {error && (
          <div className="border border-red-500 text-red-400 rounded p-3 text-sm mb-4">{error}</div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <PostListPanel
            posts={posts}
            selected={selected}
            loading={loading}
            onSelect={setSelected}
            onCreate={onCreate}
            onDelete={onDelete}
          />
          {current ? (
            <PostEditor key={current.slug} post={current} onSave={onSave} />
          ) : (
            <div className="border border-border rounded p-6 text-muted">
              Select a post or create a new one.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
