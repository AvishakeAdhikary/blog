import { ImageResponse } from 'next/og';
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
import { siteConfig } from '@/lib/site';
import { formatDate } from '@/lib/date';

export const dynamic = 'force-static';
export const alt = 'monolog — machine learning research post by Avishake Adhikary';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostOG({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post?.frontmatter.title ?? 'monolog';
  const description =
    post?.frontmatter.description ?? 'Research notes on machine learning and AI systems.';
  const tags = post?.frontmatter.tags ?? [];
  const date = post?.frontmatter.date ? formatDate(post.frontmatter.date) : '';
  const readTime = post?.readingTime.text ?? '';

  // Font size scales down for long titles
  const titleFontSize = title.length > 55 ? 52 : title.length > 38 ? 62 : 72;
  const displayTitle = title.length > 72 ? title.slice(0, 69) + '…' : title;
  const displayDesc =
    description.length > 130 ? description.slice(0, 127) + '…' : description;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 72px',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(31,31,31,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(31,31,31,0.7) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            display: 'flex'
          }}
        />
        {/* Red top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: '#ff2d2d',
            display: 'flex'
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          <span style={{ color: '#ff2d2d', fontSize: 18, fontWeight: 700, letterSpacing: '0.08em' }}>
            MONOLOG
          </span>
          <span style={{ color: '#9a9a9a', fontSize: 16 }}>by {siteConfig.author}</span>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            color: '#ff2d2d',
            fontSize: titleFontSize,
            fontWeight: 700,
            lineHeight: 1.1,
            position: 'relative',
            maxWidth: 1060
          }}
        >
          {displayTitle}
        </div>

        {/* Description */}
        <div
          style={{
            display: 'flex',
            marginTop: 22,
            color: '#e0e0e0',
            fontSize: 23,
            lineHeight: 1.55,
            position: 'relative',
            maxWidth: 980
          }}
        >
          {displayDesc}
        </div>

        {/* Spacer */}
        <div style={{ display: 'flex', flex: 1 }} />

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            position: 'relative'
          }}
        >
          {/* Tags */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 680 }}>
            {tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                style={{
                  border: '1px solid #ff2d2d',
                  color: '#ff2d2d',
                  fontSize: 14,
                  padding: '3px 10px',
                  letterSpacing: '0.02em'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
          {/* Date + reading time */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 4
            }}
          >
            {readTime && (
              <span style={{ color: '#9a9a9a', fontSize: 15 }}>{readTime}</span>
            )}
            {date && (
              <span style={{ color: '#9a9a9a', fontSize: 15 }}>{date}</span>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
