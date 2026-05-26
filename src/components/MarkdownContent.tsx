'use client';

import { useEffect, useRef } from 'react';

export function MarkdownContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const pres = Array.from(root.querySelectorAll('pre'));
    const cleanups: Array<() => void> = [];
    for (const pre of pres) {
      if (pre.querySelector('.copy-code-btn')) continue;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-code-btn';
      btn.textContent = 'copy';
      btn.setAttribute('aria-label', 'copy code to clipboard');
      const handler = async () => {
        const code = pre.querySelector('code');
        const text = code ? (code.textContent || '') : (pre.textContent || '');
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = 'copied';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'copy';
            btn.classList.remove('copied');
          }, 1500);
        } catch {
          btn.textContent = 'error';
          setTimeout(() => {
            btn.textContent = 'copy';
          }, 1500);
        }
      };
      btn.addEventListener('click', handler);
      pre.appendChild(btn);
      cleanups.push(() => {
        btn.removeEventListener('click', handler);
        if (btn.parentNode === pre) pre.removeChild(btn);
      });
    }
    return () => {
      for (const fn of cleanups) fn();
    };
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
