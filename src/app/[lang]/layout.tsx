import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

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

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: load the persisted theme synchronously before first
            paint. We use a native <script src=...> in <head> instead of
            next/script because the Next 16.2.10 / Turbopack dev server
            emits "Encountered a script tag while rendering React
            component" for any <Script> rendered in a Server Component,
            regardless of strategy or content source. The execution order
            is identical: a synchronous <script src=...> in <head> blocks
            parsing and runs before the first paint, which is exactly
            what anti-FOUC requires. */}
        <script src="/theme-initialization.js" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
