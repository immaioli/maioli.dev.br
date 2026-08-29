import { test, expect } from '@playwright/test';

test.describe('maioli.dev.br Showcase and Themes', () => {

  // Test 1: Validate language switching via Language Switcher button
  test('should change the language when clicking on the Language Switcher flags', async ({ page }) => {
    await page.goto('/pt-BR');

    // Check for 'Projetos' presence
    await expect(page.locator('h3', { hasText: 'Projetos' })).toBeVisible();

    // Click the USA flag to change to en-US (href has title English)
    await page.getByTitle('English').click();

    // Wait for the new route and check translated content
    await expect(page).toHaveURL(/\/en-US/);

    // Update validation: search for the link that changes locale to pt-BR
    await expect(page.getByTitle('Português')).toBeVisible();
  });

  // Test 2: Validate if the project list appears on the home page
  test('should list projects on the home page in pt-BR', async ({ page }) => {
    await page.goto('/pt-BR');
    // Check for section title presence
    await expect(page.locator('h3', { hasText: 'Projetos' })).toBeVisible();

    // Check for at least one project card
    await expect(page.getByText('Full-Stack Recipe App', { exact: true })).toBeVisible();
    await expect(page.getByText('mAIo Assistant', { exact: true })).toBeVisible();
    await expect(page.getByText('Ecoleta', { exact: true })).toBeVisible();
  });

  // Test 3: Validate navigation from Home to the individual project page when clicking on a card
  test('should navigate to the project page when clicking on the card', async ({ page }) => {
    await page.goto('/pt-BR');

    // Use the destination URL to target the project card unambiguously.
    const maioLink = page.locator('a[href="/pt-BR/chat-rag-personal/"]');
    await maioLink.click();

    // Verify dynamic url
    await expect(page).toHaveURL(/\/pt-BR\/chat-rag-personal/);

    // Verify project page content (using regex to avoid accent/encoding issues)
    await expect(page.locator('h1').filter({ hasText: 'mAIo Assistant' }).first()).toBeVisible();
    await expect(page.locator('text=Voltar para Home')).toBeVisible();
  });

  // Test 4: Theme Switching and Persistence
  test('should change the theme, inject it into the HTML, and persist after reloading the page', async ({ page }) => {
    await page.goto('/pt-BR');

    // Initial theme (if script runs normally) should be null or universe

    // Open the ThemeSwitcher (button has title 'E se o tema fosse...')
    // const themeBtn = page.getByText('Homem-Aranha');
    // await themeBtn.click(); // The dropdown was removed; theme buttons are now displayed inline.

    // Click the Spider-Man theme directly because the dropdown was removed.
    await page.click('button:has-text("Homem-Aranha")', { force: true });

    // Verify if html received the data-theme attribute
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'spider-man');

    // Refresh the page and validate FOUC/persistence
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'spider-man');
  });

  // Test 5: Clicking the Home back button in English forces redirect or changes language to default
  test('should go back to the English home when clicking the "Back to Home" button inside a project', async ({ page }) => {
    await page.goto('/en-US/chat-rag-personal');

    // Verify link title
    const backBtn = page.locator('text=Back to Home');
    await expect(backBtn).toBeVisible();

    await backBtn.click();

    // Should return to the en-US root
    await expect(page).toHaveURL(/\/en-US/);
  });

  // Test 6: Language change preserves the chosen theme
  test('should preserve the chosen theme when changing language', async ({ page }) => {
    await page.goto('/pt-BR');

    // Choose Iron Man theme
    // await page.getByTitle('What if the theme was...').click(); // The dropdown was removed.
    await page.click('button:has-text("Homem de Ferro")', { force: true });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'iron-man');

    // Changing locale uses App Router navigation and preserves the selected theme.

    // Change language to Spanish (using the corresponding title)
    await page.getByTitle('Español').click();

    // wait for navigation and html to reload
    await page.waitForURL(/\/es-LA/);

    // Use a hard reload to verify persistence from localStorage independently of soft navigation.
    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'iron-man', { timeout: 15000 });
  });

  test('should identify one active theme without changing capsule width or causing overflow', async ({ page }) => {
    await page.goto('/en-US');

    const universeButton = page.locator('[data-theme-id="universe"]');
    const guardiansButton = page.locator('[data-theme-id="guardians"]');
    const activeButtons = page.locator('button[data-theme-id][data-active="true"]');

    await expect(activeButtons).toHaveCount(1);
    await expect(universeButton).toHaveAttribute('aria-pressed', 'true');
    await expect(universeButton).toHaveAttribute('data-active', 'true');
    await expect(universeButton.locator('[data-theme-check="true"]')).toHaveCSS('opacity', '1');

    const widthBeforeSelection = await guardiansButton.evaluate((button) => button.getBoundingClientRect().width);

    await guardiansButton.click();

    await expect(activeButtons).toHaveCount(1);
    await expect(guardiansButton).toHaveAttribute('aria-pressed', 'true');
    await expect(guardiansButton).toHaveAttribute('data-active', 'true');
    await expect(guardiansButton.locator('[data-theme-check="true"]')).toHaveCSS('opacity', '1');
    await expect(universeButton).toHaveAttribute('aria-pressed', 'false');
    await expect(universeButton).toHaveAttribute('data-active', 'false');
    await expect(universeButton.locator('[data-theme-check="true"]')).toHaveCSS('opacity', '0');

    const widthAfterSelection = await guardiansButton.evaluate((button) => button.getBoundingClientRect().width);
    expect(widthAfterSelection).toBeCloseTo(widthBeforeSelection, 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await page.reload();

    await expect(page.locator('[data-theme-id="guardians"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-theme-id="guardians"]')).toHaveAttribute('data-active', 'true');
    await expect(page.locator('button[data-theme-id][data-active="true"]')).toHaveCount(1);
  });

  test('should keep villain theme indicators accessible and visually active', async ({ page }) => {
    await page.goto('/en-US');

    const activeButtons = page.locator('button[data-theme-id][data-active="true"]');
    const universeButton = page.locator('[data-theme-id="universe"]');
    const doctorDoomButton = page.locator('[data-theme-id="doctor-doom"]');

    await doctorDoomButton.focus();
    await doctorDoomButton.press('Enter');
    await expect(doctorDoomButton).toHaveAttribute('aria-pressed', 'true');
    await expect(doctorDoomButton).toHaveAttribute('data-active', 'true');
    await expect(doctorDoomButton).toHaveAttribute('aria-disabled', 'true');
    expect(await doctorDoomButton.evaluate((button) => (button as HTMLButtonElement).disabled)).toBe(false);
    await expect(doctorDoomButton).toBeFocused();
    await expect(doctorDoomButton.locator('[data-theme-focus-ring="true"]')).toHaveCSS('opacity', '1');
    await expect(doctorDoomButton).toHaveCSS('opacity', '1');
    await expect(activeButtons).toHaveCount(1);

    await universeButton.click({ force: true });
    await expect(universeButton).toHaveAttribute('aria-pressed', 'true');

    for (const themeId of ['magneto', 'loki']) {
      const themeButton = page.locator(`[data-theme-id="${themeId}"]`);
      await themeButton.click({ force: true });
      await expect(themeButton).toHaveAttribute('aria-pressed', 'true');
      await expect(themeButton).toHaveAttribute('data-active', 'true');
      await expect(themeButton.locator('[data-theme-check="true"]')).toHaveCSS('opacity', '1');
      await expect(activeButtons).toHaveCount(1);
      await universeButton.click({ force: true });
    }
  });

  test('should use a contrast-safe fallback for the Daredevil active indicator', async ({ page }) => {
    await page.goto('/en-US');

    const daredevilButton = page.locator('[data-theme-id="daredevil"]');
    await daredevilButton.click();

    await expect(daredevilButton).toHaveAttribute('aria-pressed', 'true');
    await expect(daredevilButton).toHaveCSS('border-color', 'rgb(255, 255, 255)');
    await expect(daredevilButton.locator('[data-theme-check="true"]')).toHaveCSS('color', 'rgb(255, 255, 255)');
  });

  test('should restore Universe when the persisted theme is invalid', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'retired-theme');
    });
    await page.goto('/en-US');

    const universeButton = page.locator('[data-theme-id="universe"]');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'universe');
    await expect(universeButton).toHaveAttribute('aria-pressed', 'true');
    await expect(universeButton).toHaveAttribute('data-active', 'true');
    await expect(page.locator('button[data-theme-id][data-active="true"]')).toHaveCount(1);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe('universe');
  });

  test('should keep capsule text contrast, keyboard focus, and mobile layout accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/en-US');

    const themeButtons = page.locator('button[data-theme-id]');
    await expect(themeButtons.first()).toBeVisible();
    const buttonCount = await themeButtons.count();
    expect(buttonCount).toBeGreaterThan(0);

    const contrastResults = await themeButtons.evaluateAll((buttons) => {
      const parseRgb = (color: string) => {
        const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
        if (!channels || channels.length !== 3) {
          throw new Error(`Unsupported computed color: ${color}`);
        }
        return channels;
      };
      const relativeLuminance = (color: string) => {
        const channels = parseRgb(color).map((channel) => {
          const value = channel / 255;
          return value <= 0.04045
            ? value / 12.92
            : ((value + 0.055) / 1.055) ** 2.4;
        });
        return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
      };
      const contrastRatio = (foreground: string, background: string) => {
        const foregroundLuminance = relativeLuminance(foreground);
        const backgroundLuminance = relativeLuminance(background);
        const lighter = Math.max(foregroundLuminance, backgroundLuminance);
        const darker = Math.min(foregroundLuminance, backgroundLuminance);
        return (lighter + 0.05) / (darker + 0.05);
      };

      return buttons.map((button) => {
        const styles = getComputedStyle(button);
        return {
          themeId: button.getAttribute('data-theme-id'),
          opacity: styles.opacity,
          ratio: contrastRatio(styles.color, styles.backgroundColor),
        };
      });
    });

    for (const result of contrastResults) {
      expect(result.opacity, `${result.themeId} capsule opacity`).toBe('1');
      expect(result.ratio, `${result.themeId} capsule text contrast`).toBeGreaterThanOrEqual(4.5);
    }

    const universeButton = page.locator('[data-theme-id="universe"]');
    await universeButton.focus();
    await expect(universeButton).toBeFocused();
    await expect(universeButton.locator('[data-theme-focus-ring="true"]')).toHaveCSS('opacity', '1');

    const guardiansButton = page.locator('[data-theme-id="guardians"]');
    const widthBeforeSelection = await guardiansButton.evaluate((button) => button.getBoundingClientRect().width);
    await guardiansButton.click();
    const widthAfterSelection = await guardiansButton.evaluate((button) => button.getBoundingClientRect().width);

    expect(widthAfterSelection).toBeCloseTo(widthBeforeSelection, 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test('should mount with the Universe fallback when localStorage is unavailable', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(Storage.prototype, 'getItem', {
        configurable: true,
        value: () => {
          throw new DOMException('Storage access denied', 'SecurityError');
        },
      });
      Object.defineProperty(Storage.prototype, 'setItem', {
        configurable: true,
        value: () => {
          throw new DOMException('Storage access denied', 'SecurityError');
        },
      });
    });

    await page.goto('/en-US');

    const universeButton = page.locator('[data-theme-id="universe"]');
    await expect(universeButton).toBeVisible();
    await expect(universeButton).toHaveAttribute('aria-pressed', 'true');
    await expect(universeButton).toHaveAttribute('data-active', 'true');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'universe');
    await expect(page.locator('button[data-theme-id][data-active="true"]')).toHaveCount(1);
  });

});
