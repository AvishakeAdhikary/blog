import fs from 'node:fs/promises';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import { ABOUT_FILE } from '@/lib/paths';
import { renderMarkdown } from '@/lib/markdown';
import { Container } from '@/components/Container';
import { MarkdownContent } from '@/components/MarkdownContent';

export const metadata: Metadata = {
  title: 'about',
  description:
    'About Avishake Adhikary — machine learning engineer building LLMs, diffusion models, and multimodal systems from scratch.'
};

export default async function AboutPage() {
  const raw = await fs.readFile(ABOUT_FILE, 'utf8');
  const parsed = matter(raw);
  const { html } = await renderMarkdown(parsed.content);
  const title = (parsed.data as { title?: string }).title || 'about';
  const updated = (parsed.data as { updated?: string }).updated;
  return (
    <Container size="md">
      <article className="py-10">
        <header className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
          {updated && <p className="text-muted text-xs mt-2">updated {updated}</p>}
        </header>
        <MarkdownContent html={html} />
      </article>
    </Container>
  );
}
