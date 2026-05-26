'use client';

import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="border border-border hover:border-accent text-fg hover:text-accent rounded px-2 py-1 text-xs transition-colors"
    >
      {theme === 'dark' ? '[ light ]' : '[ dark ]'}
    </button>
  );
}
