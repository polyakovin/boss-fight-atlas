import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const registry = JSON.parse(
  await fs.readFile(new URL('../../locales/registry.json', import.meta.url)),
);
const translations = new Map(
  await Promise.all(
    registry.map(async ({ code }) => [
      code,
      JSON.parse(await fs.readFile(new URL(`../../locales/${code}.json`, import.meta.url))),
    ]),
  ),
);

for (const locale of registry) {
  test(`${locale.code}: localized About page and creator metadata`, async ({ page }) => {
    const copy = translations.get(locale.code);
    await page.goto(`${locale.code}/about/`);

    await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
    await expect(page.locator('html')).toHaveAttribute('dir', locale.dir);
    await expect(page.locator('h1')).toHaveText(copy.aboutTitle);
    const motivation = page.locator('.about-motivation');
    await expect(motivation).toContainText(copy.aboutMotivationBody);
    await expect(motivation).toContainText(copy.aboutStory.atlasBody.replace('{count}', '124'));
    await expect(motivation).toContainText(
      copy.aboutStory.communityBody.replace('{localeCount}', String(registry.length)),
    );
    await expect(
      motivation.getByRole('link', { name: copy.aboutStory.feedbackLabel }),
    ).toHaveAttribute(
      'href',
      'https://github.com/polyakovin/boss-fight-atlas/issues/new?template=content.yml',
    );

    const prototype = page.locator('.about-prototype');
    await expect(prototype.getByRole('heading')).toHaveText(copy.aboutStory.prototypeTitle);
    await expect(prototype.locator('blockquote')).toHaveText(copy.aboutStory.beforeText);
    await expect(prototype.locator('code')).toContainText('"charge"');
    await expect(prototype.locator('code')).toContainText('"gap-volley"');
    await expect(prototype.getByRole('link', { name: copy.builder })).toHaveAttribute(
      'href',
      `/boss-fight-atlas/${locale.code}/builder/`,
    );

    const resourceLinks = page.locator('.about-resources nav a');
    await expect(resourceLinks).toHaveCount(3);
    await expect(resourceLinks.nth(0)).toHaveAttribute('href', 'https://gamemechanics.org/');
    await expect(resourceLinks.nth(1)).toHaveAttribute('href', 'https://steammaho.com/mechanics');
    await expect(resourceLinks.nth(2)).toHaveAttribute(
      'href',
      'https://www.jenova.ai/en/resources/ai-boss-fight-generator',
    );
    await expect(page.locator('meta[name="author"]')).toHaveAttribute('content', 'Igor Polyakov');
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      'content',
      'Boss Fight Atlas · Igor Polyakov',
    );
    await expect(page.locator('meta[property="article:author"]')).toHaveAttribute(
      'content',
      'Igor Polyakov',
    );

    const byline = page.locator('.footer-byline');
    await expect(byline).toContainText(copy.createdBy);
    await expect(byline.locator('a')).toHaveText('Igor Polyakov');
    await expect(byline.locator('a')).toHaveAttribute('href', 'https://github.com/polyakovin');
    await expect(page.locator('.footer-contacts')).toContainText(copy.about);
    await expect(page.locator('.footer-contacts')).toContainText('Telegram');
    await expect(page.locator('.footer-contacts')).toContainText('LinkedIn');

    const languageLinks = page.locator('.language-menu nav a');
    await expect(languageLinks).toHaveCount(registry.length);
    for (let index = 0; index < registry.length; index += 1) {
      await expect(languageLinks.nth(index)).toHaveAttribute(
        'href',
        `/boss-fight-atlas/${registry[index].code}/about/`,
      );
    }
  });
}

test('root language picker carries creator social metadata', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('meta[name="author"]')).toHaveAttribute('content', 'Igor Polyakov');
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    'content',
    'Boss Fight Atlas · Igor Polyakov',
  );
});

for (const code of ['en', 'ar']) {
  test(`${code}: About page has no horizontal overflow on mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${code}/about/`);
    const dimensions = await page.locator('html').evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  });
}
