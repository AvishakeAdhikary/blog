import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';
export const alt = `About ${siteConfig.author} — machine learning engineer building LLMs, diffusion models, and multimodal systems from scratch.`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function AboutOG() {
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
        <div style={{ display: 'flex', position: 'relative' }}>
          <span style={{ color: '#ff2d2d', fontSize: 18, fontWeight: 700, letterSpacing: '0.08em' }}>
            MONOLOG
          </span>
        </div>

        {/* Main */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            gap: 0
          }}
        >
          <div style={{ display: 'flex', color: '#9a9a9a', fontSize: 20, letterSpacing: '0.06em' }}>
            about
          </div>
          <div
            style={{
              display: 'flex',
              color: '#ffffff',
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              marginTop: 10
            }}
          >
            {siteConfig.author}
          </div>
          <div
            style={{
              display: 'flex',
              color: '#9a9a9a',
              fontSize: 26,
              marginTop: 24,
              lineHeight: 1.5
            }}
          >
            Machine Learning Engineer
          </div>

          {/* Specialty tags */}
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            {['LLMs', 'Diffusion Models', 'Multimodal', 'AI Research'].map((item) => (
              <span
                key={item}
                style={{
                  border: '1px solid #1f1f1f',
                  color: '#9a9a9a',
                  fontSize: 16,
                  padding: '6px 14px'
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          <span style={{ color: '#9a9a9a', fontSize: 16 }}>{siteConfig.siteUrl}</span>
          <span style={{ color: '#9a9a9a', fontSize: 16 }}>github.com/avishakeadhikary</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
