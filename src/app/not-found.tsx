import Link from 'next/link';
import { Container } from '@/components/Container';

export default function NotFound() {
  return (
    <Container size="md">
      <div className="py-24 text-center">
        <h1 className="text-7xl sm:text-9xl font-bold text-accent">404</h1>
        <p className="text-muted mt-4">this page does not exist.</p>
        <Link
          href="/"
          className="inline-block mt-8 border border-border hover:border-accent hover:text-accent rounded px-3 py-1 text-sm transition-colors"
        >
          go home
        </Link>
      </div>
    </Container>
  );
}
