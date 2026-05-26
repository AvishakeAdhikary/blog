import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { StaticPostList } from '@/components/StaticPostList';
import { getAllTags, getPostsByTag } from '@/lib/posts';

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const tags = await getAllTags();
  const found = tags.find((t) => t.slug === tag);
  return {
    title: found ? `#${found.tag}` : tag,
    description: found ? `Posts tagged #${found.tag}.` : 'Tagged posts.'
  };
}

export default async function TagPage({
  params
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const tags = await getAllTags();
  const found = tags.find((t) => t.slug === tag);
  if (!found) notFound();
  const posts = await getPostsByTag(tag);
  return (
    <Container size="lg">
      <section className="py-10">
        <p className="text-muted text-xs">tag</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">#{found.tag}</h1>
        <p className="text-muted text-sm mb-6">
          {posts.length} post{posts.length === 1 ? '' : 's'}.
        </p>
        <StaticPostList posts={posts} />
      </section>
    </Container>
  );
}
