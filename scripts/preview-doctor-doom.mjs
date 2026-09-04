// Open dev preview and leave it for manual inspection. No auto-asserts.
import { chromium } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const LOCALE = process.argv[2] ?? 'pt-BR';

const browser = await chromium.launch({ headless: false, slowMo: 0 });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
page.on('console', (msg) => {
  if (msg.type() === 'error') console.log('[browser-error]', msg.text());
});
page.on('pageerror', (err) => console.log('[page-error]', err.message));

console.log(`Navigating to ${BASE}/${LOCALE}/`);
await page.goto(`${BASE}/${LOCALE}/`, { waitUntil: 'domcontentloaded', timeout: 90_000 });

const button = page.locator('[data-theme-id="doctor-doom"]');
await button.waitFor({ state: 'visible', timeout: 15_000 });
const box = await button.boundingBox();
console.log(`Doctor Doom capsule at:`, box);

console.log('Clicking Doctor Doom capsule. Browser stays open for manual review.');
await button.click();

console.log('Waiting through full effect (expanding + counting + cracking + retracting)…');
await page.waitForFunction(
  () => {
    const el = document.querySelector('[data-testid="doctor-doom-fog"]');
    return el === null || window.getComputedStyle(el).display === 'none';
  },
  null,
  { timeout: 20_000 },
).catch((err) => console.log('Lifecycle timeout (ignored — manual review continues):', err.message));

console.log('Effect finished. Page is back to normal.');
console.log('You can click the Doctor Doom capsule again to re-trigger.');
console.log('Browser stays open. Press Ctrl+C in this terminal to close it.');

// Keep the script (and therefore the browser) alive indefinitely.
process.stdin.resume();
await new Promise(() => {});
