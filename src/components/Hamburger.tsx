'use client';

export function Hamburger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'close menu' : 'open menu'}
      aria-expanded={open}
      className="flex flex-col gap-1 border border-border hover:border-accent px-2 py-1 rounded transition-colors md:hidden"
    >
      <span className="block w-4 h-px bg-fg" />
      <span className="block w-4 h-px bg-fg" />
      <span className="block w-4 h-px bg-fg" />
    </button>
  );
}
