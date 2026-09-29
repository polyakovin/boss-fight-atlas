import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const ru = JSON.parse(await fs.readFile(new URL('../../locales/ru.json', import.meta.url)));

test('mechanic and design lens pages link their last update date to a commit', async ({ page }) => {
  for (const route of [
    'en/mechanics/charge/',
    'en/mechanics/orbiting-projectiles/',
    'en/lenses/commitment/',
  ]) {
    await page.goto(route);
    const update = page.locator('.page-updated');
    await expect(update).toBeVisible();
    await expect(update.locator('xpath=following-sibling::*')).toHaveCount(0);
    await expect(page.locator('main .page-updated')).toHaveCount(1);
    await expect(update).toContainText('Last updated');
    await expect(update.locator('time')).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
    await expect(update.locator('a')).toHaveAttribute(
      'href',
      /^https:\/\/github\.com\/polyakovin\/boss-fight-atlas\/commit\/[0-9a-f]{40}$/,
    );
  }
});

test('last update labels and dates follow the page locale', async ({ page }) => {
  await page.goto('ru/mechanics/charge/');
  const update = page.locator('.page-updated');
  await expect(update).toContainText(ru.lastUpdated);
  await expect(update.locator('time')).toHaveText(/\S/);
  await expect(update.locator('time')).not.toContainText('September');
});
