import Link from 'next/link';
import { formatDate } from '@/lib/date';
import { TagBadge } from './TagBadge';
import { CardHover3D } from './aceternity/CardHover3D';
import type { PostSummary } from '@/lib/types';

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <CardHover3D intensity={4} className="border-b border-border group">
      <article className="py-6">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h2 className="text-xl font-bold">
            <Link
              href={`/posts/${post.slug}/`}
              className="hover:text-accent transition-colors duration-150"
            >
              {post.title}
            </Link>
          </h2>
          <time className="text-xs text-muted shrink-0 tabular-nums" dateTime={post.date}>
            {formatDate(post.date)}
          </time>
        </div>
        {post.description && (
          <p className="text-muted mt-2 text-sm leading-relaxed line-clamp-2">
            {post.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="text-xs text-muted tabular-nums">{post.readingTime.text}</span>
          {post.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {post.tags.map((t) => (
                <TagBadge key={t} tag={t} />
              ))}
            </div>
          )}
        </div>
      </article>
    </CardHover3D>
  );
}
