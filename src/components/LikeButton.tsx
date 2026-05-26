'use client';

import { useEffect, useState } from 'react';
import { getDb } from '@/lib/db';

export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const db = getDb();
    (async () => {
      try {
        const [c, l] = await Promise.all([db.getLikes(slug), db.hasLiked(slug)]);
        if (!alive) return;
        setCount(c);
        setLiked(l);
        setReady(true);
      } catch {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  const toggle = async () => {
    const db = getDb();
    try {
      if (liked) {
        const c = await db.unlike(slug);
        setLiked(false);
        setCount(c);
      } else {
        const c = await db.like(slug);
        setLiked(true);
        setCount(c);
      }
    } catch {
      // ignore — adapter not implemented
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!ready}
      aria-pressed={liked}
      className="inline-flex items-center gap-2 border border-border hover:border-accent text-sm rounded px-3 py-1 transition-colors disabled:opacity-50"
    >
      <span className={liked ? 'text-accent' : 'text-muted'}>{liked ? '<3' : '</3'}</span>
      <span className="text-muted">{count}</span>
      <span className={liked ? 'text-accent' : 'text-muted'}>{liked ? 'liked' : 'like'}</span>
    </button>
  );
}
