// Standalone Playwright smoke test for the Doctor Doom effect, hitting the
// already-running server on port 3000. Mirrors the assertions in
// e2e/chaos-effects.spec.ts but doesn't spin up its own webServer.
import { chromium } from '@playwright/test';
import { setTimeout as sleep } from 'node:timers/promises';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const LOCALE = process.argv[2] ?? 'pt-BR';
const EXPECTED_MESSAGE = {
  'pt-BR': 'Esse é o fim?',
  'en-US': 'Is this the end?',
  'es-LA': '¿Es esto el fin?',
}[LOCALE] ?? 'Esse é o fim?';

const errors = [];
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(e.message));

console.log(`[${LOCALE}] navigating…`);
await page.goto(`${BASE}/${LOCALE}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });

const button = page.locator('[data-theme-id="doctor-doom"]');
const bbox = await button.boundingBox();
if (!bbox) throw new Error('Doctor Doom button not found');

await button.click();

const fog = page.getByTestId('doctor-doom-fog');
await fog.waitFor({ state: 'visible', timeout: 10_000 });

await page.waitForFunction(
  () => document.querySelector('[data-testid="doctor-doom-fog"]')?.getAttribute('data-phase') === 'counting',
  null, { timeout: 10_000 },
);
const message = await page.getByTestId('doctor-doom-message').textContent();
const countdownFirstRead = await page.getByTestId('doctor-doom-countdown').textContent();
await page.waitForFunction(
  () => document.querySelector('[data-testid="doctor-doom-countdown"]')?.textContent === '1',
  null, { timeout: 5_000 },
);
await page.waitForFunction(
  () => document.querySelector('[data-testid="doctor-doom-fog"]')?.getAttribute('data-phase') === 'retracting',
  null, { timeout: 5_000, polling: 30 },
);
// Vortex appears during retracting; the parent's clipPath/scale does the
// "sucked back into capsule" visual work — vortex stays at full opacity
// until the parent fog fully unmounts. Give the vortex ~250ms to fade
// in before sampling its opacity (it tweens from 0 -> 1 over 250ms).
await sleep(250);
const vortexVisible = await page.getByTestId('doctor-doom-vortex').isVisible();
const vortexOpacity = await page.getByTestId('doctor-doom-vortex').evaluate(
  (el) => Number.parseFloat(window.getComputedStyle(el).opacity),
);
await sleep(600);
const vortexMidRetract = await page.getByTestId('doctor-doom-vortex').isVisible();
await page.waitForFunction(
  () => document.querySelector('[data-testid="doctor-doom-fog"]') === null,
  null, { timeout: 6_000 },
);

const result = {
  locale: LOCALE,
  bbox: { x: bbox.x, y: bbox.y, w: bbox.width, h: bbox.height },
  message,
  countdownFirstRead,
  vortexVisible,
  vortexOpacity,
  vortexMidRetract,
  errors,
};
console.log(JSON.stringify(result, null, 2));

if (message !== EXPECTED_MESSAGE) {
  console.error(`❌ message mismatch: expected "${EXPECTED_MESSAGE}", got "${message}"`);
  process.exitCode = 1;
}
if (!vortexVisible) {
  console.error('❌ vortex never became visible during retracting phase');
  process.exitCode = 1;
}
if (vortexOpacity < 0.5) {
  console.error(`❌ vortex opacity too low during retract (${vortexOpacity})`);
  process.exitCode = 1;
}
if (!vortexMidRetract) {
  console.error('❌ vortex disappeared mid-retract');
  process.exitCode = 1;
}
if (errors.length > 0) {
  console.error('❌ console errors:', errors);
  process.exitCode = 1;
}
if (process.exitCode !== 1) console.log('✅ Doctor Doom smoke OK');

await browser.close();
