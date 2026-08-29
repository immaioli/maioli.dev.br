export const i18n = {
  defaultLocale: 'pt-BR',
  locales: ['pt-BR', 'en-US', 'es-LA'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
