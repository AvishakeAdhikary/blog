'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { loadSearchIndex, search, type SearchEntry } from '@/lib/search';

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [results, setResults] = useState<SearchEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      loadSearchIndex().then((data) => {
        setEntries(data);
        setResults(search('', data));
      });
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    setResults(search(query, entries));
  }, [query, entries]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-20"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl bg-bg border border-border rounded shadow-xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border p-3">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search posts..."
            className="w-full bg-transparent text-fg outline-none placeholder:text-muted"
          />
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-sm text-muted">No results.</div>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={r.slug} className="border-b border-border last:border-b-0">
                  <Link
                    href={`/posts/${r.slug}/`}
                    onClick={onClose}
                    className="block p-3 hover:bg-code-bg transition-colors"
                  >
                    <div className="font-medium">{r.title}</div>
                    {r.description && (
                      <div className="text-xs text-muted mt-1 line-clamp-2">{r.description}</div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-border p-2 text-xs text-muted flex items-center justify-between">
          <span>esc to close</span>
          <span>{results.length} result{results.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  );
}
