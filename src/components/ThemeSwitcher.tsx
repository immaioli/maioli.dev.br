'use client';
import { useEffect, useState } from 'react';
import { THEMES } from '../lib/themes';
import ThanosSnapEffect from './effects/ThanosSnapEffect';

type ThemeSwitcherProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
};

export default function ThemeSwitcher({ dict, onThanosSnap }: { dict: any, onThanosSnap?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('universe');
  const [isThanosSnap, setIsThanosSnap] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'universe';
    if (savedTheme !== 'universe') {
      setCurrentTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  const changeTheme = (themeId: string) => {
    if (themeId === 'thanos') {
      if (onThanosSnap) onThanosSnap();
      setIsThanosSnap(true);
      setCurrentTheme(themeId);
      localStorage.setItem('theme', themeId);
      document.documentElement.setAttribute('data-theme', themeId);
      setTimeout(() => setIsThanosSnap(false), 8000);
    } else {
      setCurrentTheme(themeId);
      localStorage.setItem('theme', themeId);
      document.documentElement.setAttribute('data-theme', themeId);
    }
  };

  if (!mounted) {
    return <div className="w-full h-12 rounded-xl bg-white/10 animate-pulse"></div>;
  }

  return (
    <div className="relative z-50 flex flex-col items-center gap-4 w-full">
      <ThanosSnapEffect isTriggered={isThanosSnap}>
        <div className="flex flex-wrap justify-center gap-3 w-full">
          {THEMES.map((theme) => {
            const isActive = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => changeTheme(theme.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-lg transition-all duration-300 border ${
                  isActive
                    ? 'bg-black/60 text-white font-bold border-(--theme-primary) shadow-[0_0_15px_var(--theme-primary-glow)] scale-105'
                    : 'bg-black/30 text-gray-400 border-transparent hover:bg-white/10 hover:text-white'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-transform duration-300 ${isActive ? 'scale-125 shadow-[0_0_8px_currentColor]' : ''}`}
                  style={{ backgroundColor: theme.primary, color: theme.primary }}
                />
                <span>{dict.themes[theme.name]}</span>
              </button>
            );
          })}
        </div>
      </ThanosSnapEffect>
    </div>
  );
}