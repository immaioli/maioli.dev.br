'use client';
import ThemeSwitcher from './ThemeSwitcher';
import { ThanosSnapTarget } from './effects/ChaosEngine';
import type { Dictionary } from '../i18n/dictionaries';

interface HeroSectionProps {
  lang: string;
  dict: Dictionary;
}

export default function HeroSection({ lang, dict }: HeroSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl my-auto flex-1 mt-12">
      {/* What If banner image with Thanos snap effect */}
      <div className="flex flex-col pt-20 items-center text-center w-full mb-10 relative z-10">
        <ThanosSnapTarget>
          <div className="relative w-full max-w-4xl flex items-center justify-center mx-auto">
            <img
              src={`/${lang}-what-if.jpg`}
              alt={dict.themes.label}
              className="w-full max-w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            />
          </div>
        </ThanosSnapTarget>
      </div>

      {/* Theme selector aligned below the banner */}
      <div className="flex justify-center mt-0 pt-0 mb-20">
        <ThemeSwitcher dict={dict} />
      </div>
    </div>
  );
}
