'use client';

import { useEffect, useRef } from 'react';
import { enhanceCopyButtons } from '@/lib/dom/copy-buttons';
import { enhanceMermaidDiagrams } from '@/lib/dom/mermaid-render';
import { enhanceYouTubeFacades } from '@/lib/dom/youtube-facade';
import { enhanceTTSHeadingButtons } from '@/lib/dom/tts-buttons';

export function MarkdownContent({ html, id = 'post-content' }: { html: string; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const cleanups = [
      enhanceCopyButtons(root),
      enhanceMermaidDiagrams(root),
      enhanceYouTubeFacades(root),
      enhanceTTSHeadingButtons(root)
    ];

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [html]);

  return (
    <div
      id={id}
      ref={ref}
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
