import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/Container';
import { PostList } from '@/components/PostList';
import { TagFilter } from '@/components/TagFilter';
import { getAllPostSummaries, getAllTags } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'posts',
  description: 'All research posts on monolog — machine learning, AI systems, transformers, diffusion, and the mathematics behind them.'
};

export default async function PostsPage() {
  const posts = await getAllPostSummaries();
  const tags = await getAllTags();
  return (
    <Container size="lg">
      <section className="py-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">posts</h1>
        <p className="text-muted text-sm mb-6">{posts.length} post{posts.length === 1 ? '' : 's'}.</p>
        <Suspense fallback={<div className="text-muted text-sm">loading…</div>}>
          <TagFilter tags={tags} />
          <PostList posts={posts} />
        </Suspense>
      </section>
    </Container>
  );
}
