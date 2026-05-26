'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { slugify } from '@/lib/slug';
import { PostCard } from './PostCard';
import type { PostSummary } from '@/lib/types';

export function PostList({ posts }: { posts: PostSummary[] }) {
  const params = useSearchParams();
  const tag = params.get('tag');

  const filtered = useMemo(() => {
    if (!tag) return posts;
    return posts.filter((p) => p.tags.some((t) => slugify(t) === tag));
  }, [posts, tag]);

  if (filtered.length === 0) {
    return <p className="text-muted py-8">No posts match this filter.</p>;
  }

  return (
    <div>
      {filtered.map((p) => (
        <PostCard key={p.slug} post={p} />
      ))}
    </div>
  );
}
