'use client';
import { useEffect, useState } from 'react';
import { THEMES } from '../lib/themes';
import type { ChaosEventDetail } from '../lib/chaosEvents';
import type { Dictionary } from '../i18n/dictionaries';
import { ChaosEventEmitter, ThanosSnapTarget } from './effects/ChaosEngine';
import { useChaosEngine } from '../hooks/useChaosEngine';
import ThemeButton from './ThemeButton';

const THEME_IDS = new Set(THEMES.map((theme) => theme.id));

function getValidThemeId(themeId: string | null): string {
  return themeId && THEME_IDS.has(themeId) ? themeId : 'universe';
}

export default function ThemeSwitcher({ dict }: { dict: Dictionary }) {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('universe');
  const chaosState = useChaosEngine();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      let savedTheme = 'universe';

      try {
        savedTheme = getValidThemeId(window.localStorage.getItem('theme'));
      } catch {
        savedTheme = 'universe';
      }

      document.documentElement.setAttribute('data-theme', savedTheme);
      setCurrentTheme(savedTheme);
      setMounted(true);

      try {
        window.localStorage.setItem('theme', savedTheme);
      } catch {
        // The visual theme remains usable when storage is unavailable.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const changeTheme = (themeId: string, detail?: ChaosEventDetail) => {
    const nextTheme = getValidThemeId(themeId);
    if (nextTheme === 'doctor-doom' && chaosState === 'doctor-doom') return;

    setCurrentTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);

    try {
      window.localStorage.setItem('theme', nextTheme);
    } catch {
      // Theme changes remain functional when persistence is unavailable.
    }

    if (nextTheme === 'thanos') {
      ChaosEventEmitter.emit('thanos');
    } else if (nextTheme === 'loki') {
      ChaosEventEmitter.emit('loki');
    } else if (nextTheme === 'doctor-doom') {
      ChaosEventEmitter.emit('doctor-doom', detail);
    } else if (nextTheme === 'magneto') {
      ChaosEventEmitter.emit('magneto', detail);
    } else {
      ChaosEventEmitter.emit('universe');
    }
  };

  if (!mounted) {
    return <div className="w-full h-12 rounded-xl bg-white/10 animate-pulse"></div>;
  }

  // Chaos state comes from the emitter, not from currentTheme — the glow
  // must stay on while any snap/rotation is pending restore.
  const chaosActive = chaosState !== 'normal';

  return (
    <div className="relative z-50 flex flex-col items-center justify-center w-full">
      <ThanosSnapTarget>
        <span
          className="mb-3 text-xs md:text-sm uppercase tracking-[0.18em] text-white/70 font-medium select-none"
          aria-label={dict.themes.chooseCapsule}
        >
          {dict.themes.chooseCapsule}
        </span>
      </ThanosSnapTarget>
      <div className="flex flex-row items-center justify-center flex-wrap gap-1.5 md:gap-2 w-full">
        {THEMES.map((theme) => (
          <ThemeButton
            key={theme.id}
            theme={theme}
            isActive={currentTheme === theme.id}
            chaosActive={chaosActive}
            disabled={theme.id === 'doctor-doom' && chaosState === 'doctor-doom'}
            label={dict.themes[theme.name as keyof typeof dict.themes]}
            onClick={changeTheme}
          />
        ))}
      </div>
    </div>
  );
}
