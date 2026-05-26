'use client';

import { useState } from 'react';

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const encTitle = encodeURIComponent(title);
  const encUrl = encodeURIComponent(url);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs flex-wrap">
      <span className="text-muted">share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}`}
        target="_blank"
        rel="noreferrer"
        className="border border-border hover:border-accent hover:text-accent rounded px-2 py-0.5 transition-colors"
      >
        twitter
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`}
        target="_blank"
        rel="noreferrer"
        className="border border-border hover:border-accent hover:text-accent rounded px-2 py-0.5 transition-colors"
      >
        linkedin
      </a>
      <a
        href={`https://news.ycombinator.com/submitlink?u=${encUrl}&t=${encTitle}`}
        target="_blank"
        rel="noreferrer"
        className="border border-border hover:border-accent hover:text-accent rounded px-2 py-0.5 transition-colors"
      >
        hn
      </a>
      <button
        type="button"
        onClick={copy}
        className="border border-border hover:border-accent hover:text-accent rounded px-2 py-0.5 transition-colors"
      >
        {copied ? 'copied' : 'copy link'}
      </button>
    </div>
  );
}
