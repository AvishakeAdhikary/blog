'use client';

import { useState } from 'react';
import clsx from 'clsx';
import type { AdminPost } from '../AdminClient';

export function PostListPanel({
  posts,
  selected,
  loading,
  onSelect,
  onCreate,
  onDelete
}: {
  posts: AdminPost[];
  selected: string | null;
  loading: boolean;
  onSelect: (slug: string) => void;
  onCreate: (title: string) => void;
  onDelete: (slug: string) => void;
}) {
  const [newTitle, setNewTitle] = useState('');

  return (
    <aside className="border border-border rounded p-3 h-fit">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!newTitle.trim()) return;
          onCreate(newTitle.trim());
          setNewTitle('');
        }}
        className="flex gap-2 mb-3"
      >
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="new post title"
          className="flex-1 bg-bg border border-border rounded px-2 py-1 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="border border-accent text-accent hover:bg-accent hover:text-white rounded px-2 py-1 text-xs transition-colors"
        >
          new
        </button>
      </form>
      {loading ? (
        <p className="text-muted text-sm">loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-muted text-sm">No posts yet.</p>
      ) : (
        <ul className="space-y-1">
          {posts.map((p) => (
            <li key={p.slug}>
              <div
                className={clsx(
                  'flex items-center justify-between gap-2 px-2 py-1 rounded text-sm cursor-pointer',
                  selected === p.slug
                    ? 'border border-accent text-accent'
                    : 'border border-transparent hover:border-border'
                )}
              >
                <button type="button" onClick={() => onSelect(p.slug)} className="text-left flex-1 truncate">
                  {p.frontmatter.title}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(p.slug)}
                  aria-label={`delete ${p.slug}`}
                  className="text-muted hover:text-red-500 text-xs transition-colors"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
