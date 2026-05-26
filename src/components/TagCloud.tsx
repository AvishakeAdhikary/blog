import Link from 'next/link';

interface Tag {
  tag: string;
  slug: string;
  count: number;
}

export function TagCloud({ tags }: { tags: Tag[] }) {
  if (tags.length === 0) return <p className="text-muted">No tags yet.</p>;
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <li key={t.slug}>
          <Link
            href={`/tags/${t.slug}/`}
            className="border border-border hover:border-accent hover:text-accent px-2 py-1 rounded text-sm transition-colors inline-flex items-center gap-2"
          >
            <span>#{t.tag}</span>
            <span className="text-muted text-xs">{t.count}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
