'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { siteConfig } from '@/lib/site';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Solid backdrop — fully covers everything */}
      <div
        className="absolute inset-0 bg-bg"
        style={{ opacity: 0.97 }}
        onClick={onClose}
      />
      {/* Menu content */}
      <div className="relative z-10 flex flex-col h-full px-6 py-6">
        {/* Top row: logo + close */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="text-lg font-bold">
            mono<span className="text-accent">log</span>
          </span>
          <button
            onClick={onClose}
            className="text-muted hover:text-fg transition-colors text-2xl leading-none p-1"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        {/* Nav links */}
        <nav className="flex flex-col mt-8 gap-1">
          {siteConfig.navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center gap-3 py-4 border-b border-border text-xl hover:text-accent transition-colors group"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-accent text-xs font-mono opacity-50 group-hover:opacity-100 transition-opacity w-5">
                {String(i + 1).padStart(2, '0')}
              </span>
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Footer */}
        <div className="mt-auto pt-6 text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.author}
        </div>
      </div>
    </div>,
    document.body
  );
}
