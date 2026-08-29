import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { THEMES } from '../../lib/themes';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const ALLOWED_THEME_IDS = THEMES.map((theme) => theme.id);
const SERIALIZED_ALLOWED_THEME_IDS = JSON.stringify(ALLOWED_THEME_IDS);

export const metadata: Metadata = {
  title: 'maioli.dev',
  description: 'maioli.dev portfolio and projects',
};

export async function generateStaticParams() {
  return [{ lang: 'pt-BR' }, { lang: 'en-US' }, { lang: 'es-LA' }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Inline script to prevent FOUC (flash of unstyled content) when reading
  // the persisted theme from localStorage before React hydrates.
  const themeScript = `
    (function() {
      var theme = 'universe';
      var allowedThemes = new Set(${SERIALIZED_ALLOWED_THEME_IDS});

      try {
        var storedTheme = localStorage.getItem('theme');
        theme = allowedThemes.has(storedTheme) ? storedTheme : 'universe';
      } catch (e) {}

      document.documentElement.setAttribute('data-theme', theme);

      try {
        localStorage.setItem('theme', theme);
      } catch (e) {}
    })();
  `;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Script
          id="theme-initialization"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </body>
    </html>
  );
}
