import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
    './content/**/*.md'
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace']
      },
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        border: 'var(--border)',
        'code-bg': 'var(--code-bg)'
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--fg)',
            '--tw-prose-headings': 'var(--fg)',
            '--tw-prose-lead': 'var(--muted)',
            '--tw-prose-links': 'var(--accent)',
            '--tw-prose-bold': 'var(--fg)',
            '--tw-prose-counters': 'var(--muted)',
            '--tw-prose-bullets': 'var(--muted)',
            '--tw-prose-hr': 'var(--border)',
            '--tw-prose-quotes': 'var(--fg)',
            '--tw-prose-quote-borders': 'var(--accent)',
            '--tw-prose-captions': 'var(--muted)',
            '--tw-prose-kbd': 'var(--fg)',
            '--tw-prose-kbd-shadows': 'var(--border)',
            '--tw-prose-code': 'var(--fg)',
            '--tw-prose-pre-code': 'var(--fg)',
            '--tw-prose-pre-bg': 'var(--code-bg)',
            '--tw-prose-th-borders': 'var(--border)',
            '--tw-prose-td-borders': 'var(--border)',
            '--tw-prose-invert-body': 'var(--fg)',
            '--tw-prose-invert-headings': 'var(--fg)',
            '--tw-prose-invert-lead': 'var(--muted)',
            '--tw-prose-invert-links': 'var(--accent)',
            '--tw-prose-invert-bold': 'var(--fg)',
            '--tw-prose-invert-counters': 'var(--muted)',
            '--tw-prose-invert-bullets': 'var(--muted)',
            '--tw-prose-invert-hr': 'var(--border)',
            '--tw-prose-invert-quotes': 'var(--fg)',
            '--tw-prose-invert-quote-borders': 'var(--accent)',
            '--tw-prose-invert-captions': 'var(--muted)',
            '--tw-prose-invert-kbd': 'var(--fg)',
            '--tw-prose-invert-kbd-shadows': 'var(--border)',
            '--tw-prose-invert-code': 'var(--fg)',
            '--tw-prose-invert-pre-code': 'var(--fg)',
            '--tw-prose-invert-pre-bg': 'var(--code-bg)',
            '--tw-prose-invert-th-borders': 'var(--border)',
            '--tw-prose-invert-td-borders': 'var(--border)',
            fontFamily: 'var(--font-mono)',
            maxWidth: 'none'
          }
        }
      })
    }
  },
  plugins: [typography]
};

export default config;
