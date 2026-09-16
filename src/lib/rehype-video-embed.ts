import { visit } from 'unist-util-visit';
import type { Root, Element, ElementContent } from 'hast';
import type { Plugin } from 'unified';

const YOUTUBE_RE =
  /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,15})/;
const VIDEO_FILE_RE = /\.(mp4|webm|ogg|mov|m3u8)(?:[?#].*)?$/i;

function youtubeId(src: string): string | null {
  const match = YOUTUBE_RE.exec(src);
  return match ? match[1] : null;
}

function captionNode(alt: string | undefined): ElementContent[] {
  if (!alt) return [];
  return [
    {
      type: 'element',
      tagName: 'p',
      properties: { className: ['video-embed__caption'] },
      children: [{ type: 'text', value: alt }]
    }
  ];
}

function youtubeEmbed(videoId: string, alt: string | undefined): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['video-embed', 'video-embed--youtube', 'not-prose'],
      dataVideoId: videoId
    },
    children: [
      {
        type: 'element',
        tagName: 'button',
        properties: {
          type: 'button',
          className: ['video-embed__play'],
          ariaLabel: alt ? `play video: ${alt}` : 'play video'
        },
        children: [
          {
            type: 'element',
            tagName: 'img',
            properties: {
              className: ['video-embed__thumb'],
              src: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
              alt: alt || '',
              loading: 'lazy'
            },
            children: []
          },
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['video-embed__play-icon'], ariaHidden: 'true' },
            children: [{ type: 'text', value: '▶' }]
          }
        ]
      },
      ...captionNode(alt)
    ]
  };
}

function fileEmbed(src: string, alt: string | undefined): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['video-embed', 'video-embed--file', 'not-prose'] },
    children: [
      {
        type: 'element',
        tagName: 'video',
        properties: { controls: true, preload: 'metadata', playsInline: true, src },
        children: []
      },
      ...captionNode(alt)
    ]
  };
}

/**
 * Reuses Markdown image syntax (`![caption](src)`) for video embeds: a `src`
 * pointing at YouTube becomes a click-to-load facade + privacy-friendly
 * iframe; a `src` ending in a video file extension (local `./assets/...`,
 * already rewritten by rewriteAssetPaths, or a future streaming URL) becomes
 * a native `<video controls>`. Everything else passes through untouched.
 */
export const rehypeVideoEmbed: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'img' || !parent || index === null || index === undefined) return;
      const src = typeof node.properties?.src === 'string' ? node.properties.src : '';
      if (!src) return;
      const alt = typeof node.properties?.alt === 'string' ? node.properties.alt : undefined;

      const videoId = youtubeId(src);
      if (videoId) {
        parent.children[index] = youtubeEmbed(videoId, alt);
        return;
      }
      if (VIDEO_FILE_RE.test(src)) {
        parent.children[index] = fileEmbed(src, alt);
      }
    });
  };
};
