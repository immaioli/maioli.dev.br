'use client';
import { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import ThanosSnapEffect from './effects/ThanosSnapEffect';

export default function HeroSection({ lang, dict }: { lang: string; dict: any }) {
  const [isThanosSnap, setIsThanosSnap] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl my-auto flex-1">
      {/* What If Image Title com Efeito Thanos */}
      <div className="flex flex-col items-center text-center w-full mb-0 relative z-10">
        <ThanosSnapEffect isTriggered={isThanosSnap}>
          <div className="relative w-full max-w-4xl flex items-center justify-center mx-auto">
            <img
              src={`/${lang}-what-if.jpg`}
              alt={dict.themes.label}
              className="w-full max-w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            />
          </div>
        </ThanosSnapEffect>
      </div>

      {/* Theme Selector centralizado colado na imagem */}
      <div className="flex justify-center w-full relative z-20 mt-0 pt-0">
        <ThemeSwitcher dict={dict} onThanosSnap={() => setIsThanosSnap(true)} />
      </div>
    </div>
  );
}