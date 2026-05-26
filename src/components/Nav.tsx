'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { siteConfig } from '@/lib/site';
import { Container } from './Container';
import { ThemeToggle } from './ThemeToggle';
import { Hamburger } from './Hamburger';
import { MobileMenu } from './MobileMenu';
import { Search } from './Search';

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/' || pathname === '';
  return pathname === href || pathname.startsWith(`${href}/`) || pathname === `${href}/`;
}

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname() ?? '/';
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur">
      <Container size="lg">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="text-lg font-bold tracking-tight">
            mono<span className="text-accent">log</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {siteConfig.navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={
                    active
                      ? 'text-accent transition-colors'
                      : 'hover:text-accent transition-colors'
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <Search />
            <ThemeToggle />
            <Hamburger open={menuOpen} onClick={() => setMenuOpen((v) => !v)} />
          </div>
        </div>
      </Container>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
