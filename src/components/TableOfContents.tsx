'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { TocEntry } from '@/lib/types';

export function TableOfContents({ toc }: { toc: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (toc.length === 0) return;
    const headings = toc
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: [0, 1] }
    );
    for (const h of headings) observer.observe(h);
    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav aria-label="table of contents" className="text-sm">
      <div className="text-muted uppercase text-xs tracking-wider mb-3">on this page</div>
      <ul className="space-y-1">
        {toc.map((entry) => (
          <li
            key={entry.id}
            style={{ paddingLeft: `${(entry.depth - 2) * 0.75}rem` }}
          >
            <a
              href={`#${entry.id}`}
              className={clsx(
                'block py-0.5 hover:text-accent transition-colors',
                activeId === entry.id ? 'text-accent' : 'text-muted'
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
