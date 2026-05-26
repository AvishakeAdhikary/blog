import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Layout } from '@/components/Layout';
import { SkipLink } from '@/components/SkipLink';
import { buildSiteMetadata } from '@/lib/seo';
import './globals.css';

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap'
});

export const metadata: Metadata = buildSiteMetadata();

const themeBootstrap = `
(function(){try{var k='monolog:theme';var s=localStorage.getItem(k);var d=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';var t=(s==='light'||s==='dark')?s:d;document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={mono.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <ThemeProvider>
          <SkipLink />
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
