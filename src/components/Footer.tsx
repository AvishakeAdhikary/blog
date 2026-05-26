import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-border mt-16 py-8 text-sm text-muted">
      <Container size="lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            (c) {new Date().getFullYear()} {siteConfig.author}. built with next.js.
          </div>
          <div className="flex items-center gap-4">
            {siteConfig.social.github && (
              <a
                className="hover:text-accent transition-colors"
                href={siteConfig.social.github}
                target="_blank"
                rel="noreferrer"
              >
                github
              </a>
            )}
            {siteConfig.social.rss && (
              <Link className="hover:text-accent transition-colors" href={siteConfig.social.rss}>
                rss
              </Link>
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}
