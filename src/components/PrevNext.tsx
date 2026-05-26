import Link from 'next/link';
import type { PostSummary } from '@/lib/types';

export function PrevNext({
  prev,
  next
}: {
  prev: PostSummary | null;
  next: PostSummary | null;
}) {
  if (!prev && !next) return null;
  return (
    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-6 mt-12">
      <div>
        {prev ? (
          <Link
            href={`/posts/${prev.slug}/`}
            className="block border border-border hover:border-accent rounded p-3 transition-colors group"
          >
            <div className="text-muted text-xs">&lt;- previous</div>
            <div className="mt-1 group-hover:text-accent transition-colors">{prev.title}</div>
          </Link>
        ) : (
          <div />
        )}
      </div>
      <div>
        {next ? (
          <Link
            href={`/posts/${next.slug}/`}
            className="block border border-border hover:border-accent rounded p-3 transition-colors sm:text-right group"
          >
            <div className="text-muted text-xs">next -&gt;</div>
            <div className="mt-1 group-hover:text-accent transition-colors">{next.title}</div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
