'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();

  const getNewPath = (newLocale: string) => {
    if (!pathname) return `/${newLocale}`;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    return segments.join('/');
  };

  const locales = [
    { code: 'pt-BR', flagUrl: 'https://flagcdn.com/w40/br.png', alt: 'Português' },
    { code: 'en-US', flagUrl: 'https://flagcdn.com/w40/us.png', alt: 'English' },
    { code: 'es-LA', flagUrl: 'https://flagcdn.com/w40/es.png', alt: 'Español' },
  ];

  return (
    <div className="w-full flex justify-center py-5">
      <div className="flex gap-4 items-center">
      {locales.map(({ code, flagUrl, alt }) => {
        const isActive = pathname?.startsWith(`/${code}`);
        return (
          <Link
            key={code}
            href={getNewPath(code)}
            className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 w-9 h-6 sm:w-10 sm:h-[26px] ${
              isActive
                ? 'rounded-md border-[3px] border-[var(--theme-primary)] shadow-[0_0_15px_var(--theme-primary-glow)] scale-110'
                : 'rounded-sm opacity-60 hover:opacity-100 hover:scale-105 drop-shadow-md border-[3px] border-transparent'
            }`}
            title={alt}
          >
            <Image
              src={flagUrl}
              alt={alt}
              fill
              sizes="(max-width: 640px) 36px, 40px"
              className="object-cover"
              unoptimized
            />
          </Link>
        );
      })}
      </div>
    </div>
  );
}