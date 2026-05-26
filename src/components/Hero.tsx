import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { EncryptedText } from './aceternity/EncryptedText';
import { Spotlight } from './aceternity/Spotlight';
import { GridBackground } from './aceternity/GridBackground';

export function Hero() {
  return (
    <GridBackground className="border-b border-border py-20 sm:py-28" fade>
      <Spotlight />
      <div className="relative z-10">
        <p className="text-xs text-muted uppercase tracking-[0.2em] mb-5 font-mono">
          machine learning engineer
        </p>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-none">
          <EncryptedText text="monolog" trigger="mount" speed={30} />
          <span className="text-accent ml-0.5 animate-blink-caret inline-block">_</span>
        </h1>
        <p className="text-muted mt-5 max-w-lg text-sm sm:text-base leading-relaxed">
          {siteConfig.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm font-mono">
          <Link
            href="/posts"
            className="border border-accent text-accent hover:bg-accent hover:text-white px-5 py-2 transition-colors duration-150"
          >
            read posts
          </Link>
          <Link
            href="/about"
            className="border border-border text-muted hover:border-accent hover:text-accent px-5 py-2 transition-colors duration-150"
          >
            about
          </Link>
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noreferrer"
            className="border border-border text-muted hover:border-fg hover:text-fg px-5 py-2 transition-colors duration-150"
          >
            github ↗
          </a>
        </div>
      </div>
    </GridBackground>
  );
}
