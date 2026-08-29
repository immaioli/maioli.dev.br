'use client';
import Link from 'next/link';
import LanguageSwitcher from '../LanguageSwitcher';
import { ThanosSnapTarget } from '../effects/ChaosEngine';
import { SnapProvider } from '../../hooks/useChaosEngine';

interface HeaderProps {
  lang: string;
  altLogo: string;
  altAvatar: string;
}

export default function Header({ lang, altLogo, altAvatar }: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex h-[100px] w-full items-center justify-center border-b border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md transition-colors duration-500 sm:px-6 md:px-12">
      <div className="flex items-center justify-between w-full max-w-4xl">
        {/* Logo/Avatar — SnapProvider shares ONE random decision for XOR */}
        <SnapProvider>
          <div className="flex items-center gap-3">
            <ThanosSnapTarget>
              <Link
                href={`/${lang}`}
                className="relative z-50 inline-flex h-[75px] w-[75px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_0_15px_var(--theme-secondary)] transition-transform duration-300 hover:scale-[1.03]"
              >
                <img
                  src="/logoHeader.png"
                  alt={altLogo}
                  width={656}
                  height={503}
                  className="h-full w-full object-contain transition-opacity hover:opacity-80"
                />
              </Link>
            </ThanosSnapTarget>
            <ThanosSnapTarget invert>
              <a
                href="https://maio.maioli.dev.br"
                target="_blank"
                rel="noopener noreferrer"
                title="mAIo - Chat Assistent"
                aria-label="mAIo - Chat Assistent"
                className="relative z-50 inline-flex h-[75px] w-[75px] items-center justify-center overflow-hidden rounded-xl border border-white/10 p-0 shadow-[0_0_15px_var(--theme-secondary)]"
              >
                <img
                  src="/avatar_mAIo.png"
                  alt={altAvatar}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </a>
            </ThanosSnapTarget>
          </div>
        </SnapProvider>

        {/* Flags on the RIGHT */}
        <div className="flex items-center">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
