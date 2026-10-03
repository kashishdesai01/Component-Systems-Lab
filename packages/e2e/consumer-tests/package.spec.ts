import { expect, test } from '@playwright/test';

test('packed UI exports render and handle controlled state and modal focus', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Packed package consumer' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Your name', exact: true }).fill('Ada');
  await expect(page.getByText('Hello, Ada', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reset name', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Your name', exact: true })).toHaveValue('');
  const opener = page.getByRole('button', { name: 'Open consumer dialog', exact: true });
  const colors = await opener.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    foreground: getComputedStyle(element).color,
    token: getComputedStyle(element).getPropertyValue('--csl-accent').trim(),
  }));
  expect(colors.token).not.toBe('');
  expect(colors.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(colors.foreground).not.toBe(colors.background);
  await opener.click();
  await expect(page.getByRole('textbox', { name: 'Dialog name', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(opener).toBeFocused();
  expect(errors).toEqual([]);
});

test('native default-open dialog survives root StrictMode effect replay', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Mount StrictMode dialog' }).click();
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  const dialog = page.getByRole('dialog', { name: 'StrictMode lifecycle' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading')).toBeFocused();
  await dialog.getByRole('button').click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: 'Mount StrictMode dialog' })).toBeFocused();
});

test('modal Tab boundaries use checked radio members, not every input', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open radio dialog' }).click();
  const first = page.getByRole('radio', { name: 'First Beta' }),
    last = page.getByRole('radio', { name: 'Last Beta' });
  await first.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(last).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(first).toBeFocused();
});

test('unselected native radio group reverse entry remains inside the modal', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open unselected radio dialog' }).click();
  const first = page.getByRole('radio', { name: 'Empty First Beta' }),
    last = page.getByRole('radio', { name: 'Empty Last Beta' });
  await first.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(last).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('radio', { name: 'Empty First Alpha' })).toBeFocused();
});

test('implicit editable tab stop at the modal edge wraps to its first control', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open editable dialog' }).click();
  await page.getByRole('textbox', { name: 'Editable note' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close editable dialog' })).toBeFocused();
});
