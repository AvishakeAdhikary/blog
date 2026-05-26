'use client';

import { useEffect, useState } from 'react';
import Giscus from '@giscus/react';
import { giscus, giscusEnabled } from '@/lib/env';
import { useTheme } from './ThemeProvider';

export function Comments({ slug }: { slug: string }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!giscusEnabled()) {
    return (
      <div className="border border-border rounded p-4 text-sm text-muted">
        Comments are powered by Giscus. Set the NEXT_PUBLIC_GISCUS_* env vars to enable.
      </div>
    );
  }
  if (!mounted) return null;

  return (
    <div className="mt-4">
      <Giscus
        repo={giscus.repo as `${string}/${string}`}
        repoId={giscus.repoId}
        category={giscus.category}
        categoryId={giscus.categoryId}
        mapping="specific"
        term={slug}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === 'dark' ? 'dark_dimmed' : 'light'}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
