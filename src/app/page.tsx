import Link from 'next/link';
import { Container } from '@/components/Container';
import { Hero } from '@/components/Hero';
import { PostCard } from '@/components/PostCard';
import { getAllPostSummaries } from '@/lib/posts';

export default async function HomePage() {
  const posts = await getAllPostSummaries();
  const latest = posts.slice(0, 5);
  return (
    <Container size="lg">
      <Hero />
      <section className="py-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-bold">latest posts</h2>
          <Link href="/posts" className="text-sm text-muted hover:text-accent transition-colors">
            all posts -&gt;
          </Link>
        </div>
        <div>
          {latest.length === 0 ? (
            <p className="text-muted">No posts yet — the blog is just getting started.</p>
          ) : (
            latest.map((p) => <PostCard key={p.slug} post={p} />)
          )}
        </div>
      </section>
    </Container>
  );
}
