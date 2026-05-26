import Link from 'next/link';
import { slugify } from '@/lib/slug';

export function TagBadge({ tag, asLink = true }: { tag: string; asLink?: boolean }) {
  const inner = (
    <span className="border border-border text-xs text-muted hover:text-accent hover:border-accent rounded px-2 py-0.5 transition-colors inline-block">
      #{tag}
    </span>
  );
  if (!asLink) return inner;
  return <Link href={`/tags/${slugify(tag)}/`}>{inner}</Link>;
}
