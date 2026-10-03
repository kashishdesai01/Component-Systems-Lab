import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { contrastRatio } from '../../tokens/src/contrast.mjs';

const browserErrors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
});
test.afterEach(async ({ page }) => {
  expect(browserErrors.get(page), 'runtime, resource, and hydration console errors').toEqual([]);
});

async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  await test.info().attach('axe-results', {
    body: JSON.stringify(
      { violations: results.violations, incomplete: results.incomplete },
      null,
      2,
    ),
    contentType: 'application/json',
  });
  expect(results.violations).toEqual([]);
  // axe requests review of popup ID references and cannot always determine
  // top-layer dialog backgrounds. Assert those bounded cases explicitly.
  const missingControls = await page.evaluate(() =>
    [...document.querySelectorAll('[aria-controls]')].flatMap((element) =>
      (element.getAttribute('aria-controls') ?? '')
        .split(/\s+/)
        .filter((id) => id && !document.getElementById(id)),
    ),
  );
  expect(missingControls, 'aria-controls references must resolve in this document').toEqual([]);
  const descriptions = await page.locator('dialog[open] p').evaluateAll((elements) =>
    elements.map((element) => ({
      text: getComputedStyle(element).color,
      background: getComputedStyle(element.closest('dialog')!).backgroundColor,
    })),
  );
  function opaqueRgb(value: string) {
    const channels = value.match(/[\d.]+/g)?.map(Number);
    if (!channels || channels.length < 3 || (channels.length === 4 && channels[3] !== 1))
      throw new Error(`Expected opaque computed sRGB: ${value}`);
    return (
      '#' +
      channels
        .slice(0, 3)
        .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
        .join('')
    );
  }
  for (const description of descriptions)
    expect(
      contrastRatio(opaqueRgb(description.text), opaqueRgb(description.background)),
    ).toBeGreaterThanOrEqual(4.5);
}

for (const route of [
  '/',
  '/lab/',
  '/checkout/',
  '/tokens/',
  '/limitations/',
  ...['button', 'textfield', 'checkbox', 'radiogroup', 'tabs', 'accordion', 'menu', 'dialog'].map(
    (name) => `/components/${name}/`,
  ),
]) {
  test(`${route} has no detected WCAG A/AA violations`, async ({ page }) => {
    await page.goto(route);
    await expectNoAxeViolations(page);
  });
  test(`${route} reflows at 320 CSS pixels`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(route);
    const dimensions = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport + 1);
  });
}

test('tabs move focus independently of manual activation', async ({ page }) => {
  await page.goto('/lab/');
  const overview = page.getByRole('tab', { name: 'Overview', exact: true });
  const details = page.getByRole('tab', { name: 'Details', exact: true });
  const activity = page.getByRole('tab', { name: 'Activity', exact: true });
  await overview.focus();
  await page.keyboard.press('ArrowRight');
  await expect(details).toBeFocused();
  await expect(overview).toHaveAttribute('aria-selected', 'true');
  await expect(details).toHaveAttribute('aria-selected', 'false');
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(activity).toBeFocused();
  await page.keyboard.press('Home');
  await expect(overview).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(activity).toBeFocused();
});

test('menu keyboard entry, navigation, Escape and Tab exit', async ({ page, browserName }) => {
  await page.goto('/lab/');
  const trigger = page.getByRole('button', { name: 'Actions', exact: true });
  const edit = page.getByRole('menuitem', { name: 'Edit profile', exact: true });
  const duplicate = page.getByRole('menuitem', { name: 'Duplicate', exact: true });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(edit).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(duplicate).toBeFocused();
  await page.keyboard.press('Home');
  await expect(edit).toBeFocused();
  await expectNoAxeViolations(page);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('menu')).toBeHidden();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press(
    process.platform === 'darwin' && browserName === 'webkit' ? 'Alt+Tab' : 'Tab',
  );
  await expect(page.getByRole('button', { name: 'After menu', exact: true })).toBeFocused();
  await expect(page.getByRole('menu')).toBeHidden();
});

test('dialog focuses its input, traps Tab and restores the opener', async ({ page }) => {
  await page.goto('/lab/');
  const opener = page.getByRole('button', { name: 'Open dialog', exact: true });
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const name = dialog.getByRole('textbox', { name: 'Name', exact: true });
  const close = dialog.getByRole('button', { name: 'Close dialog', exact: true });
  await expect(name).toBeFocused();
  await name.press('Shift+Tab');
  await expect(close).toBeFocused();
  await close.press('Tab');
  await expect(name).toBeFocused();
  await expectNoAxeViolations(page);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('invalid checkout focuses the first error and exposes descriptions', async ({ page }) => {
  await page.goto('/checkout/');
  await page.getByRole('button', { name: 'Place simulated order', exact: true }).click();
  const email = page.getByRole('textbox', { name: 'Email address', exact: true });
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(email).toHaveAttribute('aria-describedby', /.+/);
  await expectNoAxeViolations(page);
});

test('checkout completes by keyboard and moves focus to confirmation', async ({
  page,
  browserName,
}) => {
  await page.goto('/checkout/');
  await page.getByRole('textbox', { name: 'Email address', exact: true }).focus();
  await page.keyboard.type('ada@example.test');
  await page.keyboard.press(
    process.platform === 'darwin' && browserName === 'webkit' ? 'Alt+Tab' : 'Tab',
  );
  await expect(page.getByRole('textbox', { name: 'Pickup name', exact: true })).toBeFocused();
  await page.keyboard.type('Ada');
  await page.keyboard.press(
    process.platform === 'darwin' && browserName === 'webkit' ? 'Alt+Tab' : 'Tab',
  );
  await expect(page.getByRole('radio', { name: /As soon as possible/ })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: /Later this morning/ })).toBeChecked();
  await page.keyboard.press(
    process.platform === 'darwin' && browserName === 'webkit' ? 'Alt+Tab' : 'Tab',
  );
  await expect(
    page.getByRole('checkbox', { name: "I'll bring a reusable cup", exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Space');
  await page.keyboard.press(
    process.platform === 'darwin' && browserName === 'webkit' ? 'Alt+Tab' : 'Tab',
  );
  await expect(
    page.getByRole('button', { name: 'Place simulated order', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Placing order…', exact: true })).toBeDisabled();
  await expect(page.getByRole('heading', { name: 'Order confirmed', exact: true })).toBeFocused();
  await expect(page.getByText(/Thanks, Ada.*10:30 AM/)).toBeVisible();
  await expectNoAxeViolations(page);
});

test('failed checkout preserves details and permits a successful retry', async ({ page }) => {
  await page.goto('/checkout/');
  await page.getByRole('textbox', { name: 'Email address', exact: true }).fill('ada@example.test');
  await page.getByRole('textbox', { name: 'Pickup name', exact: true }).fill('Ada');
  await page.getByText('Try an error scenario', { exact: true }).click();
  await page.getByRole('checkbox', { name: 'Simulate an order failure', exact: true }).check();
  await page.getByRole('button', { name: 'Place simulated order', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('The simulated order could not be placed.');
  await expect(page.getByRole('textbox', { name: 'Email address', exact: true })).toHaveValue(
    'ada@example.test',
  );
  await expect(page.getByRole('textbox', { name: 'Pickup name', exact: true })).toHaveValue('Ada');
  await expectNoAxeViolations(page);
  await page.getByRole('checkbox', { name: 'Simulate an order failure', exact: true }).uncheck();
  await page.getByRole('button', { name: 'Place simulated order', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Order confirmed', exact: true })).toBeFocused();
});

for (const theme of ['dark', 'high-contrast']) {
  test(`${theme} theme covers rendered controls and open overlays`, async ({ page }) => {
    await page.goto('/lab/');
    await page.getByRole('combobox', { name: 'Color theme' }).selectOption(theme);
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expectNoAxeViolations(page);
    await page.getByRole('button', { name: 'Actions', exact: true }).click();
    await expectNoAxeViolations(page);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
    await expectNoAxeViolations(page);
  });
}

test('forced-colors and reduced-motion emulation keep an explicit focus outline', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== 'chromium',
    'Media emulation gate is scoped to Chromium; OS inspection is separate',
  );
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/lab/');
  const button = page.getByRole('button', { name: 'Primary action', exact: true });
  await button.focus();
  const outline = await button.evaluate((element) => ({
    style: getComputedStyle(element).outlineStyle,
    width: parseFloat(getComputedStyle(element).outlineWidth),
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    forced: matchMedia('(forced-colors: active)').matches,
  }));
  expect(outline).toEqual({ style: 'solid', width: 3, reduced: true, forced: true });
});
