'use client';
import { ThemeConfig } from '../lib/themes';
import type { ChaosEventDetail } from '../lib/chaosEvents';
import { heroNameFont } from '../app/fonts';
import { ThanosSnapTarget } from './effects/ChaosEngine';

type ThemeButtonProps = {
  theme: ThemeConfig;
  isActive: boolean;
  chaosActive: boolean;
  label: string;
  disabled?: boolean;
  onClick: (themeId: string, detail?: ChaosEventDetail) => void;
};

function getRelativeLuminance(color: string): number {
  const hex = color.replace('#', '');
  const channels = [0, 2, 4].map((offset) => {
    const channel = parseInt(hex.substring(offset, offset + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

function getContrastRatio(firstColor: string, secondColor: string): number {
  const firstLuminance = getRelativeLuminance(firstColor);
  const secondLuminance = getRelativeLuminance(secondColor);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function getHighestContrastMonochrome(background: string): string {
  const white = '#ffffff';
  const black = '#000000';

  return getContrastRatio(white, background) >= getContrastRatio(black, background)
    ? white
    : black;
}

function getActiveIndicatorColor(theme: ThemeConfig): string {
  if (getContrastRatio(theme.secondary, theme.primary) >= 3) {
    return theme.secondary;
  }

  return getHighestContrastMonochrome(theme.primary);
}

export default function ThemeButton({ theme, isActive, chaosActive, label, disabled = false, onClick }: ThemeButtonProps) {
  const isThanosOrLoki = theme.id === 'thanos' || theme.id === 'loki';
  const isVillain = isThanosOrLoki || theme.id === 'doctor-doom' || theme.id === 'magneto';
  const isUniverse = theme.id === 'universe';

  const textColor = getHighestContrastMonochrome(theme.primary);
  const activeIndicatorColor = getActiveIndicatorColor(theme);

  return (
    <ThanosSnapTarget forceKeep={isUniverse}>
      <button
        id={`theme-${theme.id}`}
        type="button"
        aria-pressed={isActive}
        aria-disabled={disabled}
        aria-label={label}
        data-theme-id={theme.id}
        data-active={isActive ? 'true' : 'false'}
        onClick={(event) => {
          if (disabled) return;

          const rect = event.currentTarget.getBoundingClientRect();
          onClick(theme.id, {
            sourceId: event.currentTarget.id,
            origin: {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            },
          });
        }}
        className={[
          'group relative flex shrink-0 items-center rounded-full whitespace-nowrap border-2 transition-all duration-300 cursor-pointer',
          // Mobile-first sizing: compact pill matching reference
          'px-2 py-0.5 text-[16px] leading-tight',
          // Desktop: slightly more room
          'md:px-8 md:py-2 md:text-xl',
          // Active state
          'opacity-100',
          isActive && '-translate-y-0.5 outline-2 outline-black outline-offset-2',
          // Universe special state
          isUniverse && chaosActive && 'animate-pulse-fast shadow-[0_0_20px_#FFD700]',
          disabled && 'cursor-not-allowed',
        ].filter(Boolean).join(' ')}
        style={{
          background: theme.primary,
          color: textColor,
          boxShadow: isActive
            ? `0 0 14px ${activeIndicatorColor}99`
            : isVillain
              ? `0 0 0 1px ${theme.secondary}80, 0 0 15px ${theme.secondary}30`
              : undefined,
          borderColor: isActive
            ? activeIndicatorColor
            : isVillain
              ? `${theme.secondary}80`
              : isUniverse
                ? 'rgba(255,255,255,0.8)'
                : 'rgba(0,0,0,0.8)',
          transition: 'box-shadow 1.5s ease-in-out, border-color 1.5s ease-in-out, background 0.3s ease, color 0.3s ease, transform 0.3s ease',
        }}
      >
        <span
          aria-hidden="true"
          data-theme-focus-ring="true"
          className="pointer-events-none absolute -inset-1 z-30 rounded-full border-2 border-white opacity-0 shadow-[0_0_0_2px_#000] transition-opacity duration-150 group-focus-visible:opacity-100"
        />
        {!isActive && (
          <span
            aria-hidden="true"
            data-theme-inactive-overlay="true"
            className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] bg-black/20 transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0"
          />
        )}
        {isVillain && !isActive && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full pointer-events-none animate-glow-pulse"
          />
        )}
        {/* Grade simétrica [1em | label | 1em]: o spacer à esquerda (invisível)
            equilibra o ✓ à direita, então o texto fica centralizado na cápsula e
            jamais muda de posição entre os estados ativo/inativo (o ✓ ocupa a
            coluna reservada, fora do fluxo do label). */}
        <span
          aria-hidden="true"
          className="pointer-events-none z-10 w-[1em] shrink-0"
        />
        <span
          className={`relative z-10 block tracking-[0.025em] ${heroNameFont.className}`}
        >
          {label}
        </span>
        {/* ✓ à direita, desenhado na coluna reservada: não empurra o label. */}
        <span
          aria-hidden="true"
          data-theme-check="true"
          className={`pointer-events-none z-10 inline-flex w-[1em] shrink-0 justify-center transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`}
          style={{ color: activeIndicatorColor }}
        >
          ✓
        </span>
      </button>
    </ThanosSnapTarget>
  );
}
