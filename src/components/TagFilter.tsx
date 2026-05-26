'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import clsx from 'clsx';

interface Tag {
  tag: string;
  slug: string;
  count: number;
}

export function TagFilter({ tags }: { tags: Tag[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const current = params.get('tag');

  const setTag = useCallback(
    (slug: string | null) => {
      const newParams = new URLSearchParams(params.toString());
      if (slug) newParams.set('tag', slug);
      else newParams.delete('tag');
      const qs = newParams.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`);
    },
    [params, pathname, router]
  );

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <button
        type="button"
        onClick={() => setTag(null)}
        className={clsx(
          'border rounded px-2 py-1 text-xs transition-colors',
          !current
            ? 'border-accent text-accent'
            : 'border-border hover:border-accent hover:text-accent'
        )}
      >
        all
      </button>
      {tags.map((t) => (
        <button
          key={t.slug}
          type="button"
          onClick={() => setTag(t.slug)}
          className={clsx(
            'border rounded px-2 py-1 text-xs transition-colors',
            current === t.slug
              ? 'border-accent text-accent'
              : 'border-border hover:border-accent hover:text-accent'
          )}
        >
          #{t.tag} <span className="text-muted">{t.count}</span>
        </button>
      ))}
    </div>
  );
}
