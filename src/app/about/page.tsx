import fs from 'node:fs/promises';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import { ABOUT_FILE } from '@/lib/paths';
import { renderMarkdown } from '@/lib/markdown';
import { Container } from '@/components/Container';
import { MarkdownContent } from '@/components/MarkdownContent';
import { TTSControls } from '@/components/TTSControls';

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
        <header className="border-border mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          {updated && <p className="text-muted mt-2 text-xs">updated {updated}</p>}
        </header>
        <MarkdownContent html={html} />
        <TTSControls />
      </article>
    </Container>
  );
}
