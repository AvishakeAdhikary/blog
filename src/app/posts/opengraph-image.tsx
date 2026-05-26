import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';
import { getAllPostSummaries } from '@/lib/posts';

export const dynamic = 'force-static';
export const alt =
  'All posts on monolog — machine learning research by Avishake Adhikary.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function PostsOG() {
  const posts = await getAllPostSummaries();
  const count = posts.length;
  // Show the 4 most recent post titles as a preview list
  const recent = posts.slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px 80px',
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

        {/* Left: title + count */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            gap: 64,
            marginTop: 40,
            position: 'relative'
          }}
        >
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: '0 0 auto', justifyContent: 'center' }}>
            <div style={{ display: 'flex', color: '#9a9a9a', fontSize: 20, letterSpacing: '0.06em' }}>
              all posts
            </div>
            <div
              style={{
                display: 'flex',
                color: '#ffffff',
                fontSize: 96,
                fontWeight: 700,
                lineHeight: 1,
                marginTop: 8
              }}
            >
              {count}
            </div>
            <div style={{ display: 'flex', color: '#9a9a9a', fontSize: 22, marginTop: 8 }}>
              {count === 1 ? 'article' : 'articles'}
            </div>
            <div
              style={{
                display: 'flex',
                color: '#9a9a9a',
                fontSize: 18,
                marginTop: 32,
                maxWidth: 340,
                lineHeight: 1.5
              }}
            >
              {siteConfig.description}
            </div>
          </div>

          {/* Vertical divider */}
          <div
            style={{
              display: 'flex',
              width: 1,
              background: '#1f1f1f',
              alignSelf: 'stretch',
              marginTop: 8,
              marginBottom: 8
            }}
          />

          {/* Right column: recent posts */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: 0 }}>
            {recent.map((post, i) => (
              <div
                key={post.slug}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '14px 0',
                  borderBottom: i < recent.length - 1 ? '1px solid #1f1f1f' : 'none'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    color: i === 0 ? '#ff2d2d' : '#ffffff',
                    fontSize: 20,
                    fontWeight: i === 0 ? 700 : 400,
                    lineHeight: 1.2
                  }}
                >
                  {post.title.length > 52 ? post.title.slice(0, 49) + '…' : post.title}
                </div>
                <div style={{ display: 'flex', color: '#9a9a9a', fontSize: 13, marginTop: 4 }}>
                  {post.readingTime.text} · {post.tags.slice(0, 2).map((t) => `#${t}`).join(' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
