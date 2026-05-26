import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { TagCloud } from '@/components/TagCloud';
import { getAllTags } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'tags',
  description: 'Browse posts on monolog by tag.'
};

export default async function TagsPage() {
  const tags = await getAllTags();
  return (
    <Container size="lg">
      <section className="py-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">tags</h1>
        <TagCloud tags={tags} />
      </section>
    </Container>
  );
}
