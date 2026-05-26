import { PostCard } from './PostCard';
import type { PostSummary } from '@/lib/types';

export function StaticPostList({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return <p className="text-muted py-8">No posts yet.</p>;
  return (
    <div>
      {posts.map((p) => (
        <PostCard key={p.slug} post={p} />
      ))}
    </div>
  );
}
