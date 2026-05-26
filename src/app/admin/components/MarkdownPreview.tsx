'use client';

import { useEffect, useState } from 'react';

export function MarkdownPreview({ source }: { source: string }) {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    const lines = source.split('\n');
    const out: string[] = [];
    let inCode = false;
    let codeBuf: string[] = [];
    let codeLang = '';

    const flushCode = () => {
      const safe = codeBuf
        .join('\n')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      out.push(
        `<pre class="bg-code-bg border border-border rounded p-3 text-sm overflow-x-auto"><code data-lang="${codeLang}">${safe}</code></pre>`
      );
      codeBuf = [];
      codeLang = '';
    };

    for (const raw of lines) {
      if (raw.startsWith('```')) {
        if (inCode) {
          flushCode();
          inCode = false;
        } else {
          inCode = true;
          codeLang = raw.replace(/^```/, '').trim();
        }
        continue;
      }
      if (inCode) {
        codeBuf.push(raw);
        continue;
      }
      const trimmed = raw.trim();
      if (trimmed.startsWith('### ')) out.push(`<h3>${escape(trimmed.slice(4))}</h3>`);
      else if (trimmed.startsWith('## ')) out.push(`<h2>${escape(trimmed.slice(3))}</h2>`);
      else if (trimmed.startsWith('# ')) out.push(`<h1>${escape(trimmed.slice(2))}</h1>`);
      else if (trimmed.startsWith('- ')) out.push(`<li>${inline(trimmed.slice(2))}</li>`);
      else if (trimmed.length === 0) out.push('');
      else out.push(`<p>${inline(trimmed)}</p>`);
    }
    if (inCode) flushCode();
    setHtml(out.join('\n'));
  }, [source]);

  return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(s: string): string {
  let out = escape(s);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return out;
}
