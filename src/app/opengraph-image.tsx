import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';
export const alt =
  'monolog — machine learning research by Avishake Adhikary. LLMs, diffusion models, multimodal systems.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function SiteOG() {
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
              'linear-gradient(rgba(31,31,31,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(31,31,31,0.8) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            display: 'flex'
          }}
        />
        {/* Red top accent bar */}
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
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: '#ff2d2d', fontSize: 22, fontWeight: 700, letterSpacing: '0.06em' }}>
              MONOLOG
            </span>
            <span style={{ color: '#1f1f1f', fontSize: 22, fontWeight: 300 }}>|</span>
            <span style={{ color: '#9a9a9a', fontSize: 18, letterSpacing: '0.04em' }}>
              machine learning engineer
            </span>
          </div>
          <span style={{ color: '#9a9a9a', fontSize: 16 }}>{siteConfig.author}</span>
        </div>

        {/* Main content — centered */}
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
          {/* Big wordmark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 0,
              fontSize: 108,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.02em'
            }}
          >
            <span style={{ color: '#ffffff' }}>mono</span>
            <span style={{ color: '#ff2d2d' }}>log</span>
            <span
              style={{
                color: '#ff2d2d',
                fontSize: 72,
                marginLeft: 6,
                animation: 'none'
              }}
            >
              _
            </span>
          </div>
          {/* Description */}
          <div
            style={{
              display: 'flex',
              color: '#9a9a9a',
              fontSize: 26,
              lineHeight: 1.5,
              marginTop: 28,
              maxWidth: 860
            }}
          >
            {siteConfig.description}
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {/* Tags */}
          <div style={{ display: 'flex', gap: 10 }}>
            {['LLMs', 'Diffusion', 'Multimodal', 'Research'].map((tag) => (
              <span
                key={tag}
                style={{
                  border: '1px solid #ff2d2d',
                  color: '#ff2d2d',
                  fontSize: 14,
                  padding: '4px 12px',
                  letterSpacing: '0.03em'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span style={{ color: '#9a9a9a', fontSize: 16 }}>github.com/avishakeadhikary</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
