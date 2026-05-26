'use client';

import { useEffect, useState } from 'react';
import { getDb } from '@/lib/db';

export function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    const db = getDb();
    (async () => {
      try {
        const v = await db.incrementViews(slug);
        if (alive) setViews(v);
      } catch {
        if (alive) setViews(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  if (views === null) return null;
  return <span className="text-muted text-xs">{views} views</span>;
}
