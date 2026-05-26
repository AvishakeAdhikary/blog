'use client';

import { useEffect, useState } from 'react';
import { SearchDialog } from './SearchDialog';

export function Search() {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(navigator.platform.toLowerCase().includes('mac'));
    }
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="search posts"
        className="border border-border hover:border-accent text-muted hover:text-accent rounded px-2 py-1 text-xs transition-colors inline-flex items-center gap-2"
      >
        <span>search</span>
        <span className="hidden sm:inline text-[10px] border border-border rounded px-1">
          {isMac ? '⌘K' : 'Ctrl+K'}
        </span>
      </button>
      <SearchDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
