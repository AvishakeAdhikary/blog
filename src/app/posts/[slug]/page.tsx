import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { MarkdownContent } from '@/components/MarkdownContent';
import { TableOfContents } from '@/components/TableOfContents';
import { ReadingProgress } from '@/components/ReadingProgress';
import { ShareButtons } from '@/components/ShareButtons';
import { LikeButton } from '@/components/LikeButton';
import { ViewCounter } from '@/components/ViewCounter';
import { Comments } from '@/components/Comments';
import { PrevNext } from '@/components/PrevNext';
import { TagBadge } from '@/components/TagBadge';
import { JsonLd } from '@/components/JsonLd';
import { getAllPostSlugs, getPostBySlug, getPrevNext } from '@/lib/posts';
import { buildPostMetadata, postJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { formatDate } from '@/lib/date';

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'not found' };
  return buildPostMetadata(post);
}

export default async function PostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const { prev, next } = await getPrevNext(slug);
  const url = `${siteConfig.siteUrl}/posts/${slug}/`;
  const jsonLd = postJsonLd(post);

  return (
    <>
      <ReadingProgress />
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-10 py-10">
          <article>
            <header className="mb-8 border-b border-border pb-6">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{post.frontmatter.title}</h1>
              {post.frontmatter.description && (
                <p className="text-muted mt-3">{post.frontmatter.description}</p>
              )}
              <div className="flex items-center gap-3 mt-4 flex-wrap text-xs text-muted">
                <time dateTime={post.frontmatter.date}>{formatDate(post.frontmatter.date)}</time>
                <span>•</span>
                <span>{post.readingTime.text}</span>
                <span>•</span>
                <ViewCounter slug={slug} />
              </div>
              {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                <div className="flex gap-1 mt-3 flex-wrap">
                  {post.frontmatter.tags.map((t) => (
                    <TagBadge key={t} tag={t} />
                  ))}
                </div>
              )}
            </header>
            <MarkdownContent html={post.html} />
            <div className="mt-10 flex items-center justify-between gap-4 flex-wrap">
              <LikeButton slug={slug} />
              <ShareButtons title={post.frontmatter.title} url={url} />
            </div>
            <PrevNext prev={prev} next={next} />
            <section className="mt-10">
              <h2 className="text-lg font-bold mb-4">comments</h2>
              <Comments slug={slug} />
            </section>
          </article>
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
              <TableOfContents toc={post.toc} />
            </div>
          </aside>
        </div>
      </Container>
      <JsonLd data={jsonLd} />
    </>
  );
}
