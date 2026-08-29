import { expect, test } from '@playwright/test';

const locales = [
  {
    locale: 'pt-BR',
    backLabel: 'Voltar para Home',
    aboutTitle: 'Sobre',
    projectsTitle: 'Projetos',
    contactTitle: 'Contato',
    entries: [
      { title: 'Quem somos', slug: 'about_who-we-are', section: 'Por que criar meu próprio portfólio?' },
      { title: 'Missão', slug: 'about_mission', section: undefined },
    ],
  },
  {
    locale: 'en-US',
    backLabel: 'Back to Home',
    aboutTitle: 'About',
    projectsTitle: 'Projects',
    contactTitle: 'Contact',
    entries: [
      { title: 'Who we are', slug: 'about_who-we-are', section: 'Why create my own portfolio?' },
      { title: 'Mission', slug: 'about_mission', section: undefined },
    ],
  },
  {
    locale: 'es-LA',
    backLabel: 'Volver al Inicio',
    aboutTitle: 'Sobre nosotros',
    projectsTitle: 'Proyectos',
    contactTitle: 'Contacto',
    entries: [
      { title: 'Quiénes somos', slug: 'about_who-we-are', section: '¿Por qué crear mi propio portafolio?' },
      { title: 'Misión', slug: 'about_mission', section: undefined },
    ],
  },
] as const;

test.describe('About MDX content', () => {
  for (const { locale, backLabel, aboutTitle, projectsTitle, contactTitle, entries } of locales) {
    test(`opens both About cards with a fixed header and secondary tag borders in ${locale}`, async ({ page }) => {
      test.slow();

      const runtimeErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') runtimeErrors.push(message.text());
      });
      page.on('pageerror', (error) => runtimeErrors.push(error.message));

      await page.goto(`/${locale}`);
      await expect(page.locator('button[data-theme-id]').first()).toBeVisible();
      const aboutHeading = page.getByRole('heading', { name: aboutTitle, level: 3 });
      const projectsHeading = page.getByRole('heading', { name: projectsTitle, level: 3 });
      await expect(aboutHeading).toBeVisible();
      await expect(projectsHeading).toBeVisible();
      expect((await aboutHeading.boundingBox())!.y).toBeLessThan((await projectsHeading.boundingBox())!.y);

      await expect(page.getByRole('heading', { name: contactTitle, level: 2 })).toBeVisible();
      await expect(page.locator('a[href^="https://wa.me/554491271183?text="]')).toBeVisible();
      await expect(page.locator('a[href="mailto:maioli.dev@outlook.com"]')).toBeVisible();
      await expect(page.locator('a[href="https://github.com/immaioli"]')).toBeVisible();
      await expect(page.locator('a[href="https://www.linkedin.com/in/irineu-marcelo-maioli/"]')).toBeVisible();

      for (const { title, slug, section } of entries) {
        await page.goto(`/${locale}`);
        await expect(page.locator('button[data-theme-id]').first()).toBeVisible();

        const card = page.locator(`a[href="/${locale}/${slug}/"]`);
        await expect(card).toBeVisible();
        await expect(card.getByRole('heading', { name: title, level: 4 })).toBeVisible();
        await card.scrollIntoViewIfNeeded();
        await Promise.all([
          page.waitForURL(new RegExp(`/${locale}/${slug}/?$`)),
          card.click(),
        ]);

        await expect(page.getByRole('heading', { name: title, level: 1 }).first()).toBeVisible();
        if (section) {
          await expect(page.getByRole('heading', { name: section, level: 2 })).toBeVisible();
        }

        const header = page.locator('header');
        await expect(header).toHaveCSS('position', 'fixed');
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(header).toBeInViewport();
        expect((await header.boundingBox())?.y).toBeCloseTo(0, 0);

        await expect(page.locator('main span.rounded-full')).toHaveCount(0);
        await expect(page.getByRole('link', { name: backLabel })).toBeVisible();
      }

      expect(runtimeErrors).toEqual([]);
    });
  }
});
