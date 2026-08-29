import { Barlow_Condensed, Bebas_Neue } from 'next/font/google';

export const heroNameFont = Barlow_Condensed({
  subsets: ['latin'],
  weight: '600',
  display: 'swap',
  fallback: ['Arial Narrow', 'sans-serif'],
});

export const doctorDoomFont = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  fallback: ['Arial Narrow', 'sans-serif'],
});
