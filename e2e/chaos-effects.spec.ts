import { expect, test } from '@playwright/test';

const locales = [
  { locale: 'pt-BR', message: 'Esse é o fim?' },
  { locale: 'en-US', message: 'Is this the end?' },
  { locale: 'es-LA', message: '¿Es esto el fin?' },
] as const;

test.describe('Chaos Engine effects', () => {
  for (const { locale, message } of locales) {
    test(`Doctor Doom fog expands from its capsule and translates the message in ${locale}`, async ({ page }) => {
      const runtimeErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') runtimeErrors.push(message.text());
      });
      page.on('pageerror', (error) => runtimeErrors.push(error.message));

      await page.goto(`/${locale}`);

      const doctorDoomButton = page.locator('[data-theme-id="doctor-doom"]');
      const buttonBox = await doctorDoomButton.boundingBox();
      expect(buttonBox).not.toBeNull();

      await doctorDoomButton.click();

      const fog = page.getByTestId('doctor-doom-fog');
      await expect(fog).toBeVisible();
      await expect(doctorDoomButton).toBeDisabled();

      const origin = await fog.evaluate((element) => ({
        x: Number(element.getAttribute('data-origin-x')),
        y: Number(element.getAttribute('data-origin-y')),
      }));

      expect(origin.x).toBeCloseTo(buttonBox!.x + buttonBox!.width / 2, 0);
      expect(origin.y).toBeCloseTo(buttonBox!.y + buttonBox!.height / 2, 0);

      await expect(fog).toHaveAttribute('data-phase', 'counting', { timeout: 7000 });
      await expect(page.getByTestId('doctor-doom-message')).toHaveText(message);
      await expect(page.getByTestId('doctor-doom-countdown')).toHaveText('2');
      await expect(page.getByTestId('doctor-doom-countdown')).toHaveText('1', { timeout: 2500 });
      await expect(fog).toHaveAttribute('data-phase', 'retracting', { timeout: 3500 });
      // Vortex is the new visual that replaces the broken-glass crack SVG.
      // It appears during retract and is clipped away by the parent's
      // shrinking clipPath as the energy collapses back into the capsule.
      await expect(page.getByTestId('doctor-doom-vortex')).toBeVisible();
      await expect(fog).toBeHidden({ timeout: 4500 });
      expect(runtimeErrors).toEqual([]);
    });
  }

  test('Doctor Doom ignores repeated activation and Universe cancels the fog', async ({ page }) => {
    await page.goto('/pt-BR');

    const doctorDoomButton = page.locator('[data-theme-id="doctor-doom"]');
    await doctorDoomButton.click();
    await expect(doctorDoomButton).toBeDisabled();
    await doctorDoomButton.evaluate((button: HTMLButtonElement) => button.click());
    await expect(page.getByTestId('doctor-doom-fog')).toHaveCount(1);

    await page.locator('[data-theme-id="universe"]').click();
    await expect(page.getByTestId('doctor-doom-fog')).toBeHidden({ timeout: 4500 });
  });

  test('Magneto moves targets with transforms without changing document layout', async ({ page }) => {
    await page.goto('/pt-BR');
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images).map((image) => image.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              image.addEventListener('load', () => resolve(), { once: true });
              image.addEventListener('error', () => resolve(), { once: true });
            })),
      );
    });
    const magnetoButton = page.locator('[data-theme-id="magneto"]');
    await expect(magnetoButton).toBeVisible();

    const projectLink = page.locator('a').filter({ has: page.locator('h4') }).first();
    const target = projectLink.locator('xpath=ancestor::*[@data-chaos-target="true"][1]');
    const projectGrid = projectLink.locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " grid ")][1]');
    const before = await target.evaluate((element: HTMLElement) => ({
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight,
      transform: getComputedStyle(element.firstElementChild as Element).transform,
      rect: element.getBoundingClientRect().toJSON(),
      visualRect: element.firstElementChild!.getBoundingClientRect().toJSON(),
    }));
    const gridBefore = await projectGrid.boundingBox();

    await magnetoButton.click();
    await expect(target).toHaveAttribute('data-chaos-mode', 'magneto');
    await page.waitForTimeout(1200);

    const during = await target.evaluate((element: HTMLElement) => {
      const transform = getComputedStyle(element.firstElementChild as Element).transform;
      const matrix = new DOMMatrix(transform);
      return {
        offsetWidth: element.offsetWidth,
        offsetHeight: element.offsetHeight,
        transform,
        translation: { x: matrix.m41, y: matrix.m42 },
        rect: element.getBoundingClientRect().toJSON(),
        visualRect: element.firstElementChild!.getBoundingClientRect().toJSON(),
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    const gridDuring = await projectGrid.boundingBox();

    expect(during.offsetWidth).toBe(before.offsetWidth);
    expect(during.offsetHeight).toBe(before.offsetHeight);
    expect(gridDuring?.width).toBeCloseTo(gridBefore!.width, 0);
    expect(gridDuring?.height).toBeCloseTo(gridBefore!.height, 0);
    expect(during.transform).not.toBe('none');
    expect(during.rect.x).toBeCloseTo(before.rect.x, 0);
    expect(during.rect.y).toBeCloseTo(before.rect.y, 0);
    const visualDistance = Math.hypot(
      during.visualRect.x - before.visualRect.x,
      during.visualRect.y - before.visualRect.y,
    );
    const translationDistance = Math.hypot(during.translation.x, during.translation.y);
    expect(translationDistance).toBeGreaterThanOrEqual(7);
    expect(translationDistance).toBeLessThanOrEqual(26);
    expect(visualDistance).toBeGreaterThanOrEqual(7);
    expect(visualDistance).toBeLessThanOrEqual(40);
    expect(during.hasHorizontalOverflow).toBe(false);

    await page.locator('[data-theme-id="universe"]').click();
    await expect(target).toHaveAttribute('data-chaos-mode', 'normal');
    await page.waitForTimeout(1200);

    const restored = await target.evaluate((element: HTMLElement) => ({
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight,
      rect: element.getBoundingClientRect().toJSON(),
    }));

    expect(restored.offsetWidth).toBe(before.offsetWidth);
    expect(restored.offsetHeight).toBe(before.offsetHeight);
    expect(restored.rect.x).toBeCloseTo(before.rect.x, 0);
    expect(restored.rect.y).toBeCloseTo(before.rect.y, 0);
  });
});
