import Link from 'next/link';

export function Pagination({
  currentPage,
  totalPages,
  baseHref
}: {
  currentPage: number;
  totalPages: number;
  baseHref: string;
}) {
  if (totalPages <= 1) return null;
  const prev = currentPage > 1 ? `${baseHref}?page=${currentPage - 1}` : null;
  const next = currentPage < totalPages ? `${baseHref}?page=${currentPage + 1}` : null;
  return (
    <nav className="flex items-center justify-between mt-8 text-sm" aria-label="pagination">
      {prev ? (
        <Link href={prev} className="hover:text-accent transition-colors">
          &lt;- prev
        </Link>
      ) : (
        <span className="text-muted">&lt;- prev</span>
      )}
      <span className="text-muted">
        {currentPage} / {totalPages}
      </span>
      {next ? (
        <Link href={next} className="hover:text-accent transition-colors">
          next -&gt;
        </Link>
      ) : (
        <span className="text-muted">next -&gt;</span>
      )}
    </nav>
  );
}
