import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import {
  ATTACK_DURATION,
  DURATION,
  PHASE_ENDS,
  TRANSITION_DURATION,
} from '../../src/charge-model.mjs';
const registry = JSON.parse(
  await fs.readFile(new URL('../../locales/registry.json', import.meta.url)),
);
const mechanicsIndex = JSON.parse(
  await fs.readFile(new URL('../../content/mechanics-index.json', import.meta.url)),
);
const mechanicsIndexLocales = Object.fromEntries(
  await Promise.all(
    registry.map(async ({ code }) => [
      code,
      JSON.parse(
        await fs.readFile(
          new URL(`../../content/mechanics-index-locales/${code}.json`, import.meta.url),
        ),
      ),
    ]),
  ),
);
const catalogCategoryKeys = [
  ...new Set(mechanicsIndex.mechanics.map(({ translations }) => translations.en.category)),
];
const groundSlamCategoryKey = mechanicsIndex.mechanics.find(({ id }) => id === 'ground-slam')
  .translations.en.category;
const groundSlamCategoryRu = mechanicsIndexLocales.ru.categories[groundSlamCategoryKey];
const scriptFontFamilies = {
  'zh-Hans': 'Noto+Sans+SC',
  hi: 'Noto+Sans+Devanagari',
  bn: 'Noto+Sans+Bengali',
  ar: 'Noto+Sans+Arabic',
  ja: 'Noto+Sans+JP',
};
for (const locale of registry) {
  test(`${locale.code}: page, language links and mobile layout`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('response', (r) => {
      if (new URL(r.url()).hostname === '127.0.0.1' && r.status() >= 400)
        errors.push(`${r.status()} ${r.url()}`);
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${locale.code}/mechanics/charge/`);
    await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
    await expect(page.locator('html')).toHaveAttribute('dir', locale.dir);
    const authorName = 'Igor Polyakov';
    await expect(page.locator('meta[name="author"]')).toHaveAttribute('content', authorName);
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      'content',
      `Boss Fight Atlas · ${authorName}`,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      new RegExp(`${authorName}$`),
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      new RegExp(`${authorName}$`),
    );
    const fontStylesheet = page.locator('link[rel="stylesheet"][href*="fonts.googleapis.com"]');
    await expect(fontStylesheet).toHaveCount(1);
    if (scriptFontFamilies[locale.code])
      expect(await fontStylesheet.getAttribute('href')).toContain(scriptFontFamilies[locale.code]);
    expect(
      await page.locator('body').evaluate((element) => getComputedStyle(element).fontFamily),
    ).toContain('Inter');
    await page.locator('.site-header .brand').hover();
    await expect(page.locator('.site-header .brand-mark')).toHaveCount(1);
    await expect(page.locator('.site-header .brand-mark')).toHaveAttribute('viewBox', '0 0 48 48');
    await expect(page.locator('.site-header .logo-mark__boss')).toHaveCount(1);
    await expect(page.locator('.site-header .logo-mark__eye')).toHaveCount(1);
    await expect(page.locator('.theme-toggle .icon')).toHaveCount(2);
    await expect(page.locator('.language-menu summary .icon--chevron')).toHaveCount(1);
    expect(
      await page
        .locator('.site-header .brand')
        .evaluate((element) => getComputedStyle(element).textDecorationLine),
    ).toBe('none');
    expect(
      await page
        .locator('.lesson-hero h1')
        .evaluate((element) => getComputedStyle(element).fontFamily),
    ).toContain('Manrope');
    expect(
      await page
        .locator('.lesson-hero h1')
        .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    ).toBeLessThanOrEqual(64);
    expect(
      await page
        .locator('.eyebrow')
        .first()
        .evaluate((element) => getComputedStyle(element).fontFamily),
    ).toContain('IBM Plex Mono');
    await expect(page.locator('[data-theme-toggle]')).toHaveCount(1);
    await expect(page.locator('[data-charge-demo]')).toHaveAttribute('data-charge-ready', 'true');
    await expect(page.locator('[data-charge-demo]')).toHaveAttribute(
      'data-charge-playing',
      'false',
    );
    expect(
      await page
        .locator('[data-charge-demo]')
        .evaluate((element) =>
          getComputedStyle(element).getPropertyValue('--charge-progress-direction').trim(),
        ),
    ).toBe(locale.dir === 'rtl' ? 'to left' : 'to right');
    await expect(page.locator('[data-charge-motion-note]')).toBeVisible();
    await expect(page.locator('.charge-demo__phase-label')).toHaveCount(1);
    await expect(page.locator('[data-charge-phase-name]')).toHaveCount(1);
    await expect(page.locator('.charge-demo__phase-tooltip')).toHaveCount(1);
    await expect(page.locator('.charge-demo__game-bar')).toHaveCount(0);
    await expect(page.locator('.charge-demo input')).toHaveCount(1);
    await expect(page.locator('.charge-demo input')).toHaveAttribute('type', 'range');
    await expect(page.locator('.lesson-category')).toHaveAttribute(
      'href',
      `/gamedev-boss-fights/${locale.code}/#catalog-part-1`,
    );
    await expect(page.locator('.lesson-title-line > .lesson-category')).toHaveCount(1);
    expect(
      await page
        .locator('.lesson-category')
        .evaluate((element) => getComputedStyle(element).textAlign),
    ).toBe('right');
    await expect(page.locator('.lesson-title-line .lens-chip')).toHaveCount(6);
    await expect(page.locator('.lesson-title-line [role="tooltip"]')).toHaveCount(6);
    await expect(page.locator('.header-nav .lenses-link')).toHaveAttribute(
      'href',
      `/gamedev-boss-fights/${locale.code}/lenses/`,
    );
    await expect(page.locator('.header-nav .catalog-link')).toHaveAttribute(
      'href',
      `/gamedev-boss-fights/${locale.code}/#mechanics`,
    );
    await expect(page.locator('.mechanic-overview')).toHaveCount(1);
    await expect(page.locator('#combat-feel .combat-feel__card')).toHaveCount(2);
    await expect(page.locator('#combat-feel .combat-feel__tag')).toHaveCount(2);
    await expect(page.locator('#combat-feel .combat-feel__connection a').first()).toHaveAttribute(
      'href',
      `/gamedev-boss-fights/${locale.code}/mechanics/attack-combination/`,
    );
    await expect(page.locator('#combat-feel .combat-feel__connection a').last()).toHaveAttribute(
      'href',
      `/gamedev-boss-fights/${locale.code}/mechanics/wind-up/`,
    );
    await expect(
      page.locator('.hero-subtitle, .lesson-hero > .variant, .lesson-hero > .summary'),
    ).toHaveCount(0);
    await expect(page.locator('.game-example')).toHaveCount(6);
    await expect(page.locator('.example-group, .example-groups')).toHaveCount(0);
    await expect(page.locator('#examples > .example-grid')).toHaveCount(1);
    await expect(page.locator('#examples > .eyebrow, .examples-intro')).toHaveCount(0);
    await expect(page.locator('#sources > .eyebrow, #sources > p:not(.review-note)')).toHaveCount(
      0,
    );
    await expect(page.locator('.game-example__media img')).toHaveCount(6);
    await expect(page.locator('.game-example__dimension')).toHaveText([
      '2D',
      '2D',
      '2D',
      '3D',
      '3D',
      '3D',
    ]);
    expect(
      await page
        .locator('.game-example__media')
        .first()
        .evaluate((media) => {
          const mediaBox = media.getBoundingClientRect();
          const badgeBox = media.querySelector('.game-example__dimension').getBoundingClientRect();
          return (
            badgeBox.top >= mediaBox.top &&
            badgeBox.right <= mediaBox.right &&
            badgeBox.bottom <= mediaBox.bottom &&
            badgeBox.left >= mediaBox.left
          );
        }),
    ).toBe(true);
    await expect(page.locator('.game-example__source')).toHaveCount(0);
    await expect(page.locator('.game-example[data-screenshot-source]')).toHaveCount(6);
    await expect(page.locator('.game-example__title')).toHaveCount(6);
    await expect(page.locator('.game-example__media img').first()).toHaveAttribute(
      'alt',
      'Chub — The Binding of Isaac: Rebirth',
    );
    await expect(page.locator('.game-example__media img').first()).toHaveAttribute(
      'loading',
      'lazy',
    );
    await expect(page.locator('.sources li a')).toHaveCount(5);
    await expect(page.locator('.review-note')).toBeVisible();
    await expect(page.locator('.implementation-checklist')).toBeVisible();
    await expect(page.locator('.checklist-group')).toHaveCount(2);
    await expect(page.locator('.checklist-item')).toHaveCount(11);
    await expect(page.locator('[data-checklist-checkbox]')).toHaveCount(11);
    await expect(page.locator('[data-checklist-reset]')).toBeDisabled();
    await expect(page.locator('.implementation-checklist')).toHaveAttribute(
      'data-checklist-ready',
      'true',
    );
    await expect(page.locator('#playbook, #design')).toHaveCount(0);
    const checklistBox = await page.locator('.implementation-checklist').boundingBox();
    expect(
      checklistBox.y + checklistBox.height,
      `${locale.code}: checklist fits first screen`,
    ).toBeLessThanOrEqual(1000);
    await expect(page.locator('#quiz, .quiz, [data-quiz]')).toHaveCount(0);
    await expect(
      page.locator('.game-example > .game-example__link[href*="youtube.com/watch"]'),
    ).toHaveCount(6);
    const videos = await page
      .locator('.game-example__link')
      .evaluateAll((links) => links.map((link) => link.href));
    expect(videos[1]).toBe('https://www.youtube.com/watch?v=VaYY2fauQNo&t=66s');
    expect(videos[4]).toBe('https://www.youtube.com/watch?v=NwFX9I69uss&t=265s');
    expect(videos[5]).toBe('https://www.youtube.com/watch?v=gzwO84ERsb8&t=2s');
    await expect(page.locator('.game-example__link').first()).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
    await expect(page.locator('.game-example__link .game-example__media')).toHaveCount(6);
    await expect(page.locator('.game-example__link .game-example__body')).toHaveCount(6);
    await expect(page.locator('.game-example__link > .visually-hidden')).toHaveCount(6);
    await expect(page.locator('.game-example__link').first()).not.toHaveAttribute(
      'aria-label',
      /.+/,
    );
    await expect(page.locator('.game-example__body a')).toHaveCount(0);
    await page.locator('.game-example__link').first().hover();
    expect(
      await page
        .locator('.game-example__link')
        .first()
        .evaluate((element) => getComputedStyle(element).textDecorationLine),
    ).toBe('none');
    const exampleTitleLayout = await page.locator('.game-example__title').evaluateAll((titles) =>
      titles.map((title) => {
        const boss = title.querySelector('h4').getBoundingClientRect();
        const game = title.querySelector('.game-example__game').getBoundingClientRect();
        return { bossCenter: boss.left + boss.width / 2, gameCenter: game.left + game.width / 2 };
      }),
    );
    expect(
      exampleTitleLayout.every(({ bossCenter, gameCenter }) =>
        locale.code === 'ar' ? gameCenter < bossCenter : gameCenter > bossCenter,
      ),
    ).toBe(true);
    const cardCoverage = await page.locator('.game-example').evaluateAll((cards) =>
      cards.map((card) => {
        const cardRect = card.getBoundingClientRect();
        const linkRect = card.querySelector('.game-example__link').getBoundingClientRect();
        return {
          width: Math.abs(cardRect.width - linkRect.width),
          height: Math.abs(cardRect.height - linkRect.height),
        };
      }),
    );
    expect(cardCoverage.every(({ width, height }) => width <= 2 && height <= 2)).toBe(true);
    await expect(page.locator('.language-menu summary .language-flag')).toHaveText(locale.flag);
    await page.locator('.language-menu summary').click();
    await expect(page.locator('.language-menu nav a')).toHaveCount(8);
    await expect(page.locator('.language-menu nav .language-flag')).toHaveText(
      registry.map((entry) => entry.flag),
    );
    const links = await page
      .locator('.language-menu nav a')
      .evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(links.every((l) => l.endsWith('/mechanics/charge/'))).toBe(true);
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 375, height: 812 });
    expect(
      await page
        .locator('.lesson-hero h1')
        .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    ).toBeLessThanOrEqual(42);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.locator('[data-charge-timeline]').evaluate((element) => {
      element.value = '2400';
      element.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await expect(page.locator('[data-charge-demo]')).toHaveAttribute('data-charge-outcome', 'safe');
    await expect(page.locator('[data-charge-scenario], .charge-demo__scenarios')).toHaveCount(0);
    await expect(page.locator('[data-charge-dodge]')).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}
test('the header mechanics link opens the available mechanics section', async ({ page }) => {
  await page.goto('ru/mechanics/charge/');
  await page.locator('.header-nav .catalog-link').click();
  await expect(page).toHaveURL(/\/ru\/#mechanics$/);
  await expect(page.locator('#mechanics')).toBeVisible();
});
test('the lesson category opens its matching catalog section', async ({ page }) => {
  await page.goto('ru/mechanics/ground-slam/');
  const category = page.locator('.lesson-category');
  await expect(category).toHaveText(groundSlamCategoryRu);
  await expect(category).toHaveAttribute('href', '/gamedev-boss-fights/ru/#catalog-part-1');
  await category.click();
  await expect(page).toHaveURL(/\/ru\/#catalog-part-1$/);
  await expect(page.locator('#catalog-part-1-title')).toHaveText(groundSlamCategoryRu);
});
test('every mechanic page links its localized category to the matching catalog section', async () => {
  for (const { code } of registry) {
    const categories = mechanicsIndexLocales[code].categories;
    for (const mechanic of mechanicsIndex.mechanics) {
      const categoryKey = mechanic.translations.en.category;
      const sectionNumber = catalogCategoryKeys.indexOf(categoryKey) + 1;
      const html = await fs.readFile(
        new URL(`../../dist/${code}/mechanics/${mechanic.id}/index.html`, import.meta.url),
        'utf8',
      );
      expect(html).toContain(`href="/gamedev-boss-fights/${code}/#catalog-part-${sectionNumber}"`);
      expect(html).toContain(`>${categories[categoryKey]}</a`);
    }
  }
});
test('the loop autoplays, alternates sides, and keeps its timeline in the scene', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('en/mechanics/charge/');
  await expect(page.locator('.lesson-sidebar')).toHaveCount(0);
  await expect(
    page.locator('.lesson-toolbar, .back-link, .lesson-edit, .lesson-topline, .title-index'),
  ).toHaveCount(0);
  await expect(page.locator('.lesson-hero h1')).toHaveText('Charge');
  await expect(page.locator('.lesson-category')).toHaveText('Body and melee');
  await page.locator('.lesson-category').click();
  await expect(page).toHaveURL(/\/en\/#catalog-part-1$/);
  await expect(page.locator('#catalog-part-1')).toBeVisible();
  await page.goto('en/mechanics/charge/');
  await expect(page.locator('.mechanic-overview')).toHaveText(
    'Charge is a high-speed attack: the boss aims, locks its direction, and rushes forward without turning. The mechanic works well when the clear lock makes the path predictable, sideways movement provides a reachable response, and recovery creates an opening for a counterattack.',
  );
  await expect(page.locator('.implementation-checklist > div > h2')).toHaveText(
    'Implementation checklist',
  );
  await expect(page.locator('.checklist-item summary').first()).toContainText(
    'When does tracking stop?',
  );
  await expect(page.locator('.lesson-hero')).not.toContainText('3 min · design lesson');
  await expect(page.locator('.lesson-hero')).not.toContainText('MECHANIC 01');
  await expect(
    page.locator(
      '.charge-demo__heading, .charge-demo__legend, .charge-demo__note, [data-charge-speed]',
    ),
  ).toHaveCount(0);
  const heroBox = await page.locator('.lesson-hero').boundingBox();
  const titleBox = await page.locator('.lesson-hero h1').boundingBox();
  const categoryBox = await page.locator('.lesson-category').boundingBox();
  const simulationBox = await page.locator('.simulation-section').boundingBox();
  const diagramBox = await page.locator('[data-charge-svg]').boundingBox();
  const sceneTimelineBox = await page.locator('.charge-demo__scene-timeline').boundingBox();
  const demo = page.locator('[data-charge-demo]');
  const timeline = page.locator('[data-charge-timeline]');
  expect(simulationBox.x).toBeGreaterThan(heroBox.x + heroBox.width);
  expect(categoryBox.x).toBeGreaterThan(titleBox.x + titleBox.width);
  expect(
    Math.abs(categoryBox.y + categoryBox.height - (titleBox.y + titleBox.height)),
  ).toBeLessThan(16);
  expect(simulationBox.width).toBeLessThanOrEqual(560);
  expect(diagramBox.height).toBeGreaterThan(diagramBox.width);
  expect(sceneTimelineBox.y).toBeGreaterThan(diagramBox.y + diagramBox.height * 0.75);
  expect(sceneTimelineBox.y + sceneTimelineBox.height).toBeLessThan(
    diagramBox.y + diagramBox.height,
  );
  expect(
    await page.locator('.charge-demo__scene-timeline').evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        backgroundColor: style.backgroundColor,
        borderStyle: style.borderStyle,
        boxShadow: style.boxShadow,
        backdropFilter: style.backdropFilter,
      };
    }),
  ).toEqual({
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderStyle: 'none',
    boxShadow: 'none',
    backdropFilter: 'none',
  });
  expect(Math.abs(simulationBox.height - (1000 - simulationBox.y - 24))).toBeLessThan(2);
  const demoBox = await demo.boundingBox();
  expect(diagramBox.y + diagramBox.height).toBeLessThanOrEqual(demoBox.y + demoBox.height + 1);
  await expect(page.locator('.charge-demo__game-bar')).toHaveCount(0);
  await expect(page.locator('[data-charge-phase-name]')).toHaveText('Aim');
  await expect(page.locator('.charge-demo__description')).toHaveCount(0);
  await expect(page.locator('.charge-demo input[type="range"]')).toHaveCount(1);
  await expect(page.locator('.charge-demo output, [data-charge-time]')).toHaveCount(0);
  await expect(page.locator('.charge-demo [stroke="var(--diagram-corners)"]')).toHaveCount(0);
  await expect(page.locator('.charge-demo [fill="var(--diagram-arena)"]')).toHaveCount(0);
  await expect(page.locator('.charge-demo [stroke="var(--diagram-border)"]')).toHaveCount(0);
  const currentPhase = page.locator('.charge-demo__phase-label');
  const phaseBackground = await currentPhase.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await currentPhase.hover();
  await expect(demo).toHaveAttribute('data-charge-playing', 'false');
  await expect
    .poll(async () => currentPhase.evaluate((element) => getComputedStyle(element).backgroundColor))
    .toBe(phaseBackground);
  const pausedTime = await timeline.inputValue();
  await page.waitForTimeout(100);
  await expect(timeline).toHaveValue(pausedTime);
  await timeline.hover();
  await expect(demo).toHaveAttribute('data-charge-playing', 'true');
  await timeline.evaluate(
    (element, value) => {
      element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    },
    (PHASE_ENDS[0] + 0.1) * 1000,
  );
  await expect(demo).toHaveAttribute('data-charge-phase', '1');
  await expect(page.locator('[data-charge-phase-name]')).toHaveText('Lock & dodge');
  const lockTooltip = currentPhase.locator('[role="tooltip"]');
  await expect(lockTooltip).toBeHidden();
  await currentPhase.hover();
  await expect(lockTooltip).toBeVisible();
  await expect(lockTooltip).toHaveText(
    'Direction locks and the player clears the lane with ordinary sideways movement.',
  );
  const lockLabelBox = await currentPhase.boundingBox();
  const lockTooltipBox = await lockTooltip.boundingBox();
  expect(lockTooltipBox.y + lockTooltipBox.height).toBeLessThan(lockLabelBox.y);
  expect(lockTooltipBox.y).toBeGreaterThanOrEqual(diagramBox.y);
  await timeline.evaluate((element) => {
    element.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
  });
  expect(Math.abs(simulationBox.y - heroBox.y)).toBeLessThan(2);
  expect(Math.max(heroBox.y + heroBox.height, simulationBox.y + simulationBox.height)).toBeLessThan(
    1000,
  );
  await page.locator('.checklist-item summary').first().click();
  await expect(page.locator('.checklist-item').first().locator('p')).toHaveText(
    'Choose a fixed moment. Mark it with a pose, sound, or effect.',
  );
  await expect(demo).toHaveAttribute('data-charge-playing', 'true');
  await expect
    .poll(async () => Number(await page.locator('[data-charge-timeline]').inputValue()))
    .toBeGreaterThan(200);
  await timeline.evaluate((element) => {
    element.value = '2400';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(demo).toHaveAttribute('data-charge-attack', '0');
  await expect(demo).toHaveAttribute('data-charge-phase', '2');
  await expect(demo).toHaveAttribute('data-charge-outcome', 'safe');
  await expect(page.locator('[data-charge-phase-name]')).toHaveText('Charge');
  await timeline.evaluate(
    (element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    },
    ATTACK_DURATION * 1000 + 2400,
  );
  await expect(demo).toHaveAttribute('data-charge-attack', '1');
  await expect(demo).toHaveAttribute('data-charge-phase', '2');
  await timeline.evaluate(
    (element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    },
    (PHASE_ENDS[2] + TRANSITION_DURATION / 2) * 1000,
  );
  await expect(demo).toHaveAttribute('data-charge-transition', 'true');
  await timeline.evaluate(
    (element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    },
    DURATION * 1000 - 100,
  );
  await expect.poll(async () => Number(await timeline.inputValue())).toBeLessThan(1000);
  await expect(demo).toHaveAttribute('data-charge-playing', 'true');
  await page.setViewportSize({ width: 375, height: 812 });
  const mobileHeroBox = await page.locator('.lesson-hero').boundingBox();
  const mobileSimulationBox = await page.locator('.simulation-section').boundingBox();
  const mobileChecklistBox = await page.locator('.implementation-checklist').boundingBox();
  expect(mobileSimulationBox.y).toBeGreaterThan(mobileHeroBox.y + mobileHeroBox.height);
  expect(mobileChecklistBox.y).toBeGreaterThan(mobileSimulationBox.y + mobileSimulationBox.height);
});
test('the English default and language navigation work with JavaScript disabled', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.goto(new URL('ar/mechanics/charge/', baseURL).href);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('[data-charge-svg]')).toBeVisible();
  await expect(page.locator('#quiz, .quiz, [data-quiz]')).toHaveCount(0);
  await page.locator('.language-menu summary').click();
  await page.locator('.language-menu a[lang="ja"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await context.close();
});

for (const [id, title, activePhase] of [
  ['sweep', 'Arc sweep', 'Arc commits'],
  ['ground-slam', 'Ground slam', 'Impact'],
  ['summon', 'Summon', 'Arrival'],
  ['gap-volley', 'Gap volley', 'Volley'],
  ['projectile-fan', 'Projectile fan', 'Release'],
]) {
  test(`${id}: localized page animates its own pattern`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`en/mechanics/${id}/`);
    await expect(page.locator('.lesson-hero h1')).toHaveText(title);
    await expect(page.locator('[data-pattern-demo]')).toHaveAttribute('data-pattern-ready', 'true');
    await expect(page.locator('[data-pattern-demo]')).toHaveAttribute('data-pattern-kind', id);
    await expect(page.locator('[data-pattern-demo]')).toHaveAttribute(
      'data-pattern-playing',
      'true',
    );
    const phaseLabel = page.locator('.pattern-demo__phase-label');
    const phaseBackground = await phaseLabel.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    await phaseLabel.hover();
    await expect(page.locator('[data-pattern-demo]')).toHaveAttribute(
      'data-pattern-playing',
      'false',
    );
    expect(await phaseLabel.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(
      phaseBackground,
    );
    await page.locator('[data-pattern-timeline]').hover();
    await expect(page.locator('[data-pattern-demo]')).toHaveAttribute(
      'data-pattern-playing',
      'true',
    );
    await expect(page.locator('.pattern-demo button')).toHaveCount(0);
    await expect(page.locator('[data-pattern-timeline]')).toHaveCount(1);
    await expect(page.locator('.pattern-demo [stroke="var(--diagram-corners)"]')).toHaveCount(0);
    await expect(page.locator('.pattern-demo [fill="var(--diagram-arena)"]')).toHaveCount(0);
    await expect(page.locator('.pattern-demo [stroke="var(--diagram-border)"]')).toHaveCount(0);
    expect(
      await page.locator('.pattern-demo__scene-timeline').evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          backgroundColor: style.backgroundColor,
          borderStyle: style.borderStyle,
          boxShadow: style.boxShadow,
          backdropFilter: style.backdropFilter,
        };
      }),
    ).toEqual({
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderStyle: 'none',
      boxShadow: 'none',
      backdropFilter: 'none',
    });
    await expect(page.locator('.lesson-title-line .lens-chip')).toHaveCount(4);
    await expect(page.locator('.game-example')).toHaveCount(3);
    await expect(page.locator('.game-example__media img')).toHaveCount(3);
    await expect(page.locator('.sources li a')).toHaveCount(id === 'projectile-fan' ? 2 : 1);
    await expect(page.locator('[data-pattern-boss] [data-character-art="kern"]')).toHaveCount(1);
    await expect(page.locator('[data-pattern-player] [data-character-art="tavi"]')).toHaveCount(1);
    await page.locator('[data-pattern-timeline]').evaluate((element) => {
      element.value = '2500';
      element.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await expect(page.locator('[data-pattern-demo]')).toHaveAttribute('data-pattern-phase', '1');
    await expect(page.locator('[data-pattern-demo]')).toHaveAttribute(
      'data-pattern-outcome',
      'safe',
    );
    await expect(page.locator('[data-pattern-phase-name]')).toHaveText(activePhase);
    await page.locator('.language-menu summary').click();
    const languageLinks = await page
      .locator('.language-menu nav a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(languageLinks.every((href) => href.endsWith(`/mechanics/${id}/`))).toBe(true);
  });
}

test('checklist progress persists locally and can be reset', async ({ page }) => {
  await page.goto('en/mechanics/charge/');
  const first = page.locator('[data-checklist-checkbox]').first();
  const third = page.locator('[data-checklist-checkbox]').nth(2);
  const firstDetails = page.locator('.checklist-item details').first();
  const reset = page.locator('[data-checklist-reset]');

  await first.check();
  await third.check();
  await expect(firstDetails).not.toHaveAttribute('open', '');
  await expect(reset).toBeEnabled();
  await expect(page.locator('.implementation-checklist')).toHaveAttribute(
    'data-checklist-complete',
    '2',
  );
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem('boss-fight-atlas-checklist:charge')),
    ),
  ).toEqual(['steps-0', 'steps-2']);

  await page.reload();
  await expect(first).toBeChecked();
  await expect(third).toBeChecked();
  await page.goto('ru/mechanics/charge/');
  await expect(page.locator('[data-checklist-checkbox]').first()).toBeChecked();

  await page.locator('[data-checklist-reset]').click();
  await expect(page.locator('[data-checklist-checkbox]:checked')).toHaveCount(0);
  await expect(page.locator('[data-checklist-reset]')).toBeDisabled();
  expect(
    await page.evaluate(() => localStorage.getItem('boss-fight-atlas-checklist:charge')),
  ).toBeNull();
});

test('boss builder persists a local draft and downloads portable JSON', async ({ page }) => {
  await page.goto('en/builder/');
  await expect(page.locator('[data-boss-builder]')).toHaveAttribute(
    'data-boss-builder-ready',
    'true',
  );
  await expect(page.locator('.boss-builder-hero h1')).toHaveText('Boss builder');
  expect(
    await page
      .locator('.boss-builder-hero h1')
      .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
  ).toBeLessThanOrEqual(60);
  await expect(page.locator('.boss-builder-storage')).toHaveText(
    'The draft stays only in this browser.',
  );
  await expect(page.locator('.boss-builder-phases [data-boss-download]')).toHaveCount(1);
  await expect(page.locator('.boss-builder-form [data-boss-download]')).toHaveCount(0);
  await expect(page.locator('.boss-builder-mechanic')).toHaveCount(124);
  await expect(page.locator('.boss-builder-mechanic--wip')).toHaveCount(0);
  await expect(page.locator('.boss-builder-mechanic:not(.boss-builder-mechanic--wip)')).toHaveCount(
    124,
  );
  await expect(
    page.locator(
      '.boss-builder-mechanic:not(.boss-builder-mechanic--wip):has([data-character-art="kern"])',
    ),
  ).toHaveCount(124);
  await expect(
    page.locator(
      '.boss-builder-mechanic:not(.boss-builder-mechanic--wip):has([data-character-art="tavi"])',
    ),
  ).toHaveCount(124);
  await expect(page.locator('.boss-builder-mechanic [data-blueprint-preview]')).toHaveCount(118);
  await expect(page.locator('.boss-builder-mechanic [data-pattern-preview]')).toHaveCount(5);
  expect(
    await page.locator('.boss-builder-mechanic__diagram svg').evaluateAll((previews) =>
      previews.every((preview) => {
        const diagram = preview.parentElement.getBoundingClientRect();
        return (
          preview.viewBox.baseVal.height > preview.viewBox.baseVal.width &&
          diagram.height > diagram.width
        );
      }),
    ),
  ).toBe(true);
  await expect(page.locator('[data-boss-filter]')).toHaveCount(5);
  await page.locator('[data-boss-filter="geometry"]').selectOption('radial');
  const radialCount = await page.locator('.boss-builder-mechanic:visible').count();
  expect(radialCount).toBeGreaterThan(0);
  expect(radialCount).toBeLessThan(124);
  await expect(page.locator('[data-boss-results]')).toContainText(String(radialCount));
  await page.locator('[data-boss-reset-filters]').click();
  await expect(page.locator('.boss-builder-mechanic:visible')).toHaveCount(124);
  await page.locator('[data-boss-mechanic-search]').fill('Charge');
  await expect(page.locator('.boss-builder-mechanic:visible')).toHaveCount(1);
  await page.locator('[data-boss-mechanic-search]').fill('');

  await page.locator('[data-boss-download]').click();
  await expect(page.locator('[data-boss-status]')).toHaveText('Enter a boss name.');
  await expect(page.locator('[data-boss-name]')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('[data-boss-name]').fill('Gate Warden');
  await page.locator('[data-boss-description]').fill('Guards the passage to the next area.');
  await page.locator('[data-boss-download]').click();
  await expect(page.locator('[data-boss-status]')).toHaveText('Select at least one mechanic.');
  await page.locator('[data-boss-mechanic][value="charge"]').check();
  await expect(page.locator('[data-boss-selected]')).toHaveText('Selected: 1');
  await page.locator('[data-boss-add-phase]').click();
  await expect(page.locator('.boss-builder-phase')).toHaveCount(2);
  await expect(page.locator('[data-phase-health="phase-1"]')).toBeDisabled();
  await expect(page.locator('[data-phase-health="phase-1"]')).toHaveValue('100');
  await page.locator('[data-phase-health="phase-2"]').fill('35');
  await page.locator('[data-phase-health="phase-2"]').press('Tab');
  await expect(page.locator('[data-phase-health="phase-2"]')).toHaveValue('35');
  await expect(page.locator('[data-phase-id="phase-1"] .boss-builder-phase__health')).toContainText(
    'Health range: 100%–36%',
  );
  await expect(page.locator('[data-phase-id="phase-2"] .boss-builder-phase__health')).toContainText(
    'Health range: 35%–0%',
  );
  const firstPhase = page.locator('[data-phase-id="phase-1"]');
  const secondPhase = page.locator('[data-phase-id="phase-2"]');
  await firstPhase.click({ position: { x: 5, y: 5 } });
  await expect(page.locator('[data-boss-active-phase]')).toHaveValue('phase-1');
  await expect(firstPhase).toHaveClass(/boss-builder-phase--active/);
  await secondPhase.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-boss-active-phase]')).toHaveValue('phase-2');
  await expect(secondPhase).toHaveAttribute('aria-current', 'true');
  await page.locator('[data-phase-goal="phase-1"]').click();
  await expect(page.locator('[data-boss-active-phase]')).toHaveValue('phase-1');
  await page.locator('[data-phase-name="phase-2"]').click();
  await expect(page.locator('[data-boss-active-phase]')).toHaveValue('phase-2');
  await page.locator('[data-phase-name="phase-2"]').fill('Finale');
  await page.locator('[data-phase-goal="phase-2"]').fill('Compress the safe space.');
  await expect(page.locator('[data-boss-active-phase]')).toHaveValue('phase-2');
  await page.locator('[data-boss-mechanic-search]').fill('Teleport');
  await expect(page.locator('.boss-builder-mechanic:visible')).toHaveCount(1);
  await page.locator('[data-boss-mechanic][value="teleport"]').check();
  await expect(page.locator('[data-assignment-phase]')).toHaveCount(0);
  await expect(page.locator('[data-assignment-combo]')).toHaveCount(0);
  await expect(secondPhase.locator('[data-assignment="teleport"]')).toContainText('Teleport');
  await expect(
    secondPhase.locator('[data-assignment="teleport"] .boss-builder-assignment__header > button'),
  ).toHaveCount(1);
  await page
    .locator('[data-assignment-implementation="teleport"]')
    .fill('The boss blinks through the player with a hooked spear.');
  await expect(page.locator('[data-boss-selected]')).toHaveText('Selected: 2');
  await page.locator('[data-boss-mechanic-search]').fill('');
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('boss-fight-atlas-boss-builder'))),
  ).toEqual({
    version: 2,
    name: 'Gate Warden',
    description: 'Guards the passage to the next area.',
    phases: [
      { id: 'phase-1', name: '', goal: '', activationHealthPercent: 100 },
      {
        id: 'phase-2',
        name: 'Finale',
        goal: 'Compress the safe space.',
        activationHealthPercent: 35,
      },
    ],
    assignments: [
      {
        mechanicId: 'charge',
        phaseId: 'phase-1',
        combo: 'solo',
        implementation: '',
      },
      {
        mechanicId: 'teleport',
        phaseId: 'phase-2',
        combo: 'solo',
        implementation: 'The boss blinks through the player with a hooked spear.',
      },
    ],
  });

  await page.reload();
  await expect(page.locator('[data-boss-name]')).toHaveValue('Gate Warden');
  await expect(page.locator('[data-boss-description]')).toHaveValue(
    'Guards the passage to the next area.',
  );
  await expect(page.locator('[data-boss-mechanic][value="charge"]')).toBeChecked();
  await expect(page.locator('[data-boss-mechanic][value="teleport"]')).not.toBeChecked();
  await page.locator('[data-boss-active-phase]').selectOption('phase-2');
  await expect(page.locator('[data-boss-mechanic][value="teleport"]')).toBeChecked();
  await expect(page.locator('[data-boss-mechanic][value="charge"]')).not.toBeChecked();

  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-boss-download]').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('Gate-Warden.json');
  const exported = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
  expect(exported).toMatchObject({
    format: 'boss-fight-atlas/boss-sketch',
    version: 2,
    locale: 'en',
    name: 'Gate Warden',
    description: 'Guards the passage to the next area.',
    phases: [
      {
        id: 'phase-1',
        name: 'Phase 1',
        activationHealthPercent: 100,
        healthRange: { minPercent: 36, maxPercent: 100 },
        combinations: [{ id: 'solo', name: 'Solo' }],
      },
      {
        id: 'phase-2',
        name: 'Finale',
        goal: 'Compress the safe space.',
        activationHealthPercent: 35,
        healthRange: { minPercent: 0, maxPercent: 35 },
        combinations: [{ id: 'solo', name: 'Solo' }],
      },
    ],
  });
  expect(exported.mechanics.map(({ id }) => id)).toEqual(['charge', 'teleport']);
  expect(exported.mechanics[0].profile).toMatchObject({
    geometry: ['line'],
    dimensions: ['2d', '3d'],
  });
  expect(exported.phases[0].combinations[0].mechanics.map(({ id }) => id)).toEqual(['charge']);
  expect(exported.phases[1].combinations[0].mechanics.map(({ id }) => id)).toEqual(['teleport']);
  expect(exported.phases[1].combinations[0].mechanics[0].implementation).toBe(
    'The boss blinks through the player with a hooked spear.',
  );
  expect(exported.mechanics[1]).not.toHaveProperty('implementation');

  await page.goto('ru/builder/');
  await expect(page.locator('[data-boss-name]')).toHaveValue('Gate Warden');
  await expect(page.locator('[data-boss-mechanic][value="charge"]')).toBeChecked();
  await page.locator('[data-boss-active-phase]').selectOption('phase-2');
  await expect(page.locator('[data-boss-mechanic][value="teleport"]')).toBeChecked();
  await page.locator('[data-boss-reset]').click();
  await expect(page.locator('[data-boss-name]')).toHaveValue('');
  await expect(page.locator('[data-boss-mechanic]:checked')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(
    await page.evaluate(() => localStorage.getItem('boss-fight-atlas-boss-builder')),
  ).toBeNull();
});

test('boss builder surfaces compatible and conflicting mechanics in the active phase', async ({
  page,
}) => {
  await page.goto('en/builder/');
  const recommendations = page.locator('.boss-builder-mechanics > .boss-builder-recommendations');
  await expect(recommendations).toHaveCount(1);
  await expect(recommendations.locator('h3')).toHaveText('Recommendations');
  await expect(page.locator('.boss-builder-sidebar .boss-builder-recommendations')).toHaveCount(0);
  await page.locator('[data-boss-mechanic][value="charge"]').check();
  await page.locator('[data-boss-mechanic][value="attack-lock"]').check();
  await expect(page.locator('[data-boss-compatible]')).toContainText('Charge + Attack lock');
  await expect(page.locator('[data-boss-suggestions] button').first()).toBeVisible();

  await page.locator('[data-boss-mechanic][value="stack-damage"]').check();
  await page.locator('[data-boss-mechanic][value="personal-spread"]').check();
  await expect(page.locator('[data-boss-conflicts]')).toContainText(
    'Shared-damage stack + Personal spread',
  );
  await expect(page.locator('[data-mechanic-id="personal-spread"]')).toHaveClass(
    /boss-builder-mechanic--conflict/,
  );
});

test('boss builder generates a localized random boss with a conflict-free phase plan', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0.25;
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('en/builder/');
  const topbar = page.locator('.boss-builder-topbar');
  await expect(topbar.locator('[data-boss-random]')).toHaveCount(1);
  await expect(topbar.locator('[data-boss-reset]')).toHaveCount(1);
  expect(
    await topbar.evaluate((element) =>
      element.nextElementSibling?.classList.contains('boss-builder-layout'),
    ),
  ).toBe(true);
  const [randomBounds, resetBounds] = await Promise.all([
    topbar.locator('[data-boss-random]').boundingBox(),
    topbar.locator('[data-boss-reset]').boundingBox(),
  ]);
  expect(randomBounds).not.toBeNull();
  expect(resetBounds).not.toBeNull();
  expect(Math.abs(randomBounds.y - resetBounds.y)).toBeLessThan(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('[data-boss-random]')).toHaveText('Random boss');
  await page.locator('[data-boss-description]').fill('Keep this encounter premise.');
  await page.locator('[data-boss-filter="geometry"]').selectOption('radial');
  await page.locator('[data-boss-mechanic-search]').fill('Charge');
  await page.locator('[data-boss-random]').click();

  await expect(page.locator('[data-boss-name]')).toHaveValue('Dread Harbinger');
  await expect(page.locator('[data-boss-description]')).toHaveValue('Keep this encounter premise.');
  await expect(page.locator('[data-boss-status]')).toHaveText('A random boss was generated.');
  await expect(page.locator('[data-boss-selected]')).toHaveText('Selected: 5');
  await expect(page.locator('.boss-builder-phase')).toHaveCount(2);
  await expect(page.locator('[data-boss-mechanic-search]')).toHaveValue('');
  await expect(page.locator('[data-boss-filter="geometry"]')).toHaveValue('');
  await expect(page.locator('[data-boss-conflicts]')).toHaveText('Nothing to show yet');

  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('boss-fight-atlas-boss-builder')),
  );
  expect(stored).toMatchObject({
    version: 2,
    name: 'Dread Harbinger',
    description: 'Keep this encounter premise.',
    phases: [
      { id: 'phase-1', name: '', goal: '', activationHealthPercent: 100 },
      { id: 'phase-2', name: '', goal: '', activationHealthPercent: 50 },
    ],
  });
  expect(stored.assignments).toHaveLength(5);
  expect(new Set(stored.assignments.map(({ combo }) => combo))).toEqual(new Set(['solo']));
  expect(new Set(stored.assignments.map(({ implementation }) => implementation))).toEqual(
    new Set(['']),
  );
  expect(new Set(stored.assignments.map(({ mechanicId }) => mechanicId)).size).toBe(5);
  expect(stored.assignments.filter(({ phaseId }) => phaseId === 'phase-1')).toHaveLength(3);
  expect(stored.assignments.filter(({ phaseId }) => phaseId === 'phase-2')).toHaveLength(2);

  await page.reload();
  await expect(page.locator('[data-boss-name]')).toHaveValue('Dread Harbinger');
  await expect(page.locator('[data-boss-selected]')).toHaveText('Selected: 5');
});

test('lens chips show explanations and open localized lens pages', async ({ page, request }) => {
  await page.goto('en/mechanics/charge/');
  const chips = page.locator('.lesson-title-line .lens-chip');
  await expect(chips).toHaveText([
    'TelegraphingA pose, sound, or effect announces both the charge and the exact moment tracking stops. The cue and the rule must agree.',
    'CommitmentAfter lock, the boss gives up steering in exchange for speed and reach. This commitment makes prediction possible.',
    "Threat geometryThe attack creates a lane, not a point. Test its width against the player's full collision shape, arena space, and camera.",
    'CounterplayAt least one response must be reachable with the movement the player already owns. Extra skills may add options without becoming silently required.',
    'Risk and rewardA stronger, longer charge earns a clearer tell and a useful recovery window. Threat and opportunity are tuned together.',
    'Mastery checkThe boss tests movement and cue-reading taught before the encounter. Upgrades should change the solution space without erasing the mechanic.',
  ]);
  const firstTooltip = chips.first().locator('[role="tooltip"]');
  await expect(firstTooltip).toBeHidden();
  await chips.first().focus();
  await expect(firstTooltip).toBeVisible();
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(firstTooltip).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 720 });
  await chips.first().click();
  await expect(page).toHaveURL(/\/en\/lenses\/telegraphing\/$/);
  await expect(page.locator('.lens-page__hero h1')).toHaveText('Telegraphing');
  expect(
    await page
      .locator('.lens-page__hero h1')
      .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
  ).toBeLessThanOrEqual(53);
  await expect(page.locator('.lens-page__hero p')).toHaveText(
    'A game communicates an upcoming action, state change, or rule through visual, audio, or haptic cues. The cue, timing, and resulting behavior must agree.',
  );
  await expect(page.locator('.lens-page__hero [data-lens-visual="telegraphing"]')).toHaveCount(1);
  await expect(page.locator('.lens-page__hero .lens-visual__svg')).toHaveAttribute(
    'aria-label',
    /Telegraphing.*A game communicates/,
  );
  await expect(page.locator('.lens-page__hero')).not.toContainText(/boss|charge/i);
  await expect(page.locator('.lens-mechanic-card')).toHaveCount(78);
  await expect(page.locator('.lens-mechanic-card h2')).toHaveText([
    'Charge',
    'Arc sweep',
    'Ground slam',
    'Gap volley',
    'Projectile fan',
    'Wide swing',
    'Lunge',
    'Grab',
    'Burrow and emerge',
    'Ring volley',
    'Spiral barrage',
    'Ricochet projectile',
    'Homing projectile',
    'Straight beam',
    'Scanning beam',
    'Rotating beams',
    'Marked-area strike',
    'Shockwave',
    'Lingering hazard',
    'Hazard trail',
    'Target lock',
    'Attack combination',
    'Telegraph',
    'Landing jump',
    'Single shot',
    'Crossfire',
    'Splitting projectile',
    'Returning projectile',
    'Orbiting projectiles',
    'Pulse beam',
    'Chain explosions',
    'Mine',
    'Moving hazard',
    'Converging threats',
    'Pull',
    'Turret deployment',
    'Threat generator',
    'Decoy',
    'Predictive aiming',
    'Source tracking',
    'Burst fire',
    'Volley',
    'Delayed activation',
    'Speed change',
    'Limited spread',
    'Directional shield',
    'Interruptible wind-up',
    'Wind-up',
    'Attack lock',
    'Active phase',
    'Teleport',
    'Boundary attack',
    'Cover and line of sight',
    'Forced inertia',
    'Wraparound projectile',
    'Beat-synced attack',
    'Invisibility',
    'Sound detection',
    'Objective-linked invulnerability',
    'Projectile rally',
    'Baited self-hit',
    'Instant-kill condition',
    'Maximum-health reduction',
    'Ability or healing lock',
    'Resource steal or drop',
    'On-hit healing or lifesteal',
    'Interruptible self-heal',
    'Interceptable healing sources',
    'Ally theft and charm',
    'False death and return',
    'Action-reactive punish',
    'Gaze check',
    'Proximity damage',
    'Tankbuster and target handoff',
    'Debuff handoff',
    'Ordered targets',
    'Pairing polarity',
    'Party split',
  ]);
  await expect(page.locator('.lens-mechanic-card h2 .icon--directional')).toHaveCount(78);
  await page.locator('.language-menu summary').click();
  const languageLinks = await page
    .locator('.language-menu nav a')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(languageLinks.every((href) => href.endsWith('/lenses/telegraphing/'))).toBe(true);
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('en/lenses/');
  await expect(page.locator('.header-nav .lenses-link')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.lens-card')).toHaveCount(15);
  await expect(page.locator('.lens-card [data-lens-visual]')).toHaveCount(15);
  expect(
    await page
      .locator('.lens-card [data-lens-visual]')
      .evaluateAll((visuals) => visuals.map((visual) => visual.dataset.lensVisual)),
  ).toEqual([
    'telegraphing',
    'commitment',
    'threat-geometry',
    'counterplay',
    'risk-reward',
    'mastery-check',
    'encounter-purpose',
    'dramatic-framing',
    'context-and-sequence',
    'progress-clarity',
    'difficulty-rhythm',
    'phase-structure',
    'player-expression',
    'rule-exception',
    'access-paths',
  ]);
  await expect(page.locator('.lens-catalog-hero p')).toHaveText(
    'These practical lenses examine decisions, feedback, challenge, space, and learning across games. They are working tools, not a universal classification.',
  );
  await expect(page.locator('.lens-catalog-grid')).not.toContainText(/boss|charge/i);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const firstCard = await page.locator('.lens-card').first().boundingBox();
  const secondCard = await page.locator('.lens-card').nth(1).boundingBox();
  expect(secondCard.y).toBeGreaterThan(firstCard.y + firstCard.height);
  for (const locale of registry) {
    expect((await request.get(`${locale.code}/lenses/`)).status()).toBe(200);
    expect((await request.get(`${locale.code}/lenses/telegraphing/`)).status()).toBe(200);
  }
});

test('every design lens has its own visual explanation', async ({ page }) => {
  const lensIds = [
    'telegraphing',
    'commitment',
    'threat-geometry',
    'counterplay',
    'risk-reward',
    'mastery-check',
    'encounter-purpose',
    'dramatic-framing',
    'context-and-sequence',
    'progress-clarity',
    'difficulty-rhythm',
    'phase-structure',
    'player-expression',
    'rule-exception',
    'access-paths',
  ];
  for (const lensId of lensIds) {
    await page.goto(`en/lenses/${lensId}/`);
    const visual = page.locator(`.lens-page__hero [data-lens-visual="${lensId}"]`);
    await expect(visual).toBeVisible();
    await expect(visual.locator('svg[role="img"]')).toHaveCount(1);
    const box = await visual.boundingBox();
    expect(box.width).toBeGreaterThan(300);
    expect(box.height).toBeGreaterThan(160);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test('theme follows the system and a saved choice persists across pages', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  const base = baseURL;
  await page.goto(`${base}en/`);
  await expect(page.locator('link[href*="site.css"]')).toHaveAttribute(
    'href',
    /assets\/site\.css\?v=[0-9a-f]{10}$/,
  );
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('[data-theme-toggle]')).toHaveAttribute(
    'aria-label',
    'Switch to light theme',
  );
  const darkBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('[data-theme-toggle]')).toHaveAttribute(
    'aria-label',
    'Switch to dark theme',
  );
  const lightBackground = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(lightBackground).not.toBe(darkBackground);
  await page.goto(base);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('[data-theme-toggle]')).toHaveAttribute(
    'aria-label',
    'Switch to dark theme',
  );
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await context.close();
});
test('the root defaults to English and localized catalogs point to real pages', async ({
  page,
  request,
}) => {
  await page.goto('./');
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('meta[name="author"]')).toHaveAttribute('content', 'Igor Polyakov');
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    'content',
    'Boss Fight Atlas · Igor Polyakov',
  );
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.language-menu summary')).toContainText('English');
  await expect(page.locator('.language-choices')).toHaveCount(0);
  for (const locale of registry) {
    const response = await request.get(`${locale.code}/`);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(`${locale.code}/mechanics/charge/`);
    const builder = await request.get(`${locale.code}/builder/`);
    expect(builder.status()).toBe(200);
    expect(await builder.text()).toContain('data-boss-builder');
  }
  await expect(page.locator('.site-footer .legal')).toContainText(
    'Original text and illustrations',
  );
  await expect(page.locator('.catalog-hero h1')).toHaveText(
    'Turn a boss idea into a fight players can read and master',
  );
  await expect(page.locator('.catalog-hero')).not.toContainText('Game Mechanics');
  await expect(page.locator('.catalog-hero__lesson h2')).toHaveText('Charge');
  await expect(page.locator('.catalog-hero__questions li')).toHaveCount(3);
  await expect(page.locator('.catalog-workflow__steps li')).toHaveCount(5);
  await expect(page.locator('.catalog-guides h2')).toHaveText('Meet Tavi and Kern');
  await expect(page.locator('.catalog-guides')).not.toContainText('Game Mechanics');
  await expect(page.locator('.catalog-lenses')).toHaveCount(0);
  await expect(page.locator('.header-nav .lenses-link')).toHaveAttribute(
    'href',
    '/gamedev-boss-fights/en/lenses/',
  );
  await expect(page.locator('.catalog-meta, .small-dot')).toHaveCount(0);
  await expect(page.locator('.catalog-guides__art img')).toHaveAttribute(
    'src',
    /\/gamedev-boss-fights\/assets\/welcome-boss-and-player\.webp\?v=[a-f0-9]{10}$/,
  );
  await expect(page.locator('.catalog-guides__art img')).toBeVisible();
  await expect(page.locator('.catalog-guides__art img')).toHaveAttribute('loading', 'lazy');
  expect(
    await page
      .locator('.catalog-hero h1')
      .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
  ).toBeGreaterThanOrEqual(41);
  const homeSections = await page
    .locator('.catalog-hero, .catalog-workflow, .catalog-guides, .catalog-contents')
    .evaluateAll((sections) => sections.map((section) => section.getBoundingClientRect().top));
  expect(homeSections).toEqual([...homeSections].sort((a, b) => a - b));
  await expect(page.locator('.atlas-map')).toHaveCount(0);
  await expect(page.locator('.catalog-part-nav__link')).toHaveCount(14);
  await expect(page.locator('.catalog-part-nav__link')).toHaveText([
    /01\s+Body and melee/,
    /02\s+Projectiles/,
    /03\s+Beams/,
    /04\s+Zones and traps/,
    /05\s+Arena/,
    /06\s+Additional targets/,
    /07\s+Targeting and rhythm/,
    /08\s+Defense/,
    /09\s+Structure and readability/,
    /10\s+Space, movement, and perception/,
    /11\s+Encounter goals and vulnerability/,
    /12\s+States, resources, and scaling/,
    /13\s+Multi-boss relationships/,
    /14\s+Cooperative coordination/,
  ]);
  await expect(page.locator('.catalog-part')).toHaveCount(14);
  await expect(page.locator('.catalog-lesson')).toHaveCount(124);
  await expect(page.locator('.catalog-lesson--wip')).toHaveCount(0);
  await expect(page.locator('.catalog-lesson:not(.catalog-lesson--wip)')).toHaveCount(124);
  await expect(page.locator('.catalog-lesson__number').first()).toHaveText('1.1');
  await expect(page.locator('.catalog-lesson__number').last()).toHaveText('14.11');
  await expect(
    page.locator('.catalog-lesson:not(.catalog-lesson--wip):has([data-character-art="kern"])'),
  ).toHaveCount(124);
  await expect(
    page.locator('.catalog-lesson:not(.catalog-lesson--wip):has([data-character-art="tavi"])'),
  ).toHaveCount(124);
  await expect(page.locator('.catalog-lesson__preview [data-blueprint-preview]')).toHaveCount(118);
  await expect(page.locator('.catalog-lesson__preview [data-pattern-preview]')).toHaveCount(5);
  const publishedPage = await request.get('en/mechanics/environmental-weapon/');
  expect(publishedPage.status()).toBe(200);
  expect(await publishedPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/environmental-weapon/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Environmental weapon');
  await expect(page.locator('[data-blueprint-id="environmental-weapon"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const encounterToolPage = await request.get('en/mechanics/encounter-specific-tool/');
  expect(encounterToolPage.status()).toBe(200);
  expect(await encounterToolPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/encounter-specific-tool/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Encounter-specific tool');
  await expect(page.locator('[data-blueprint-id="encounter-specific-tool"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const playerBossPage = await request.get('en/mechanics/player-controlled-boss/');
  expect(playerBossPage.status()).toBe(200);
  expect(await playerBossPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/player-controlled-boss/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Player-controlled boss');
  await expect(page.locator('[data-blueprint-id="player-controlled-boss"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const rallyPage = await request.get('en/mechanics/projectile-rally/');
  expect(rallyPage.status()).toBe(200);
  expect(await rallyPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/projectile-rally/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Projectile rally');
  await expect(page.locator('[data-blueprint-id="projectile-rally"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const baitPage = await request.get('en/mechanics/baited-self-hit/');
  expect(baitPage.status()).toBe(200);
  expect(await baitPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/baited-self-hit/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Baited self-hit');
  await expect(page.locator('[data-blueprint-id="baited-self-hit"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const posturePage = await request.get('en/mechanics/posture-stagger-gauge/');
  expect(posturePage.status()).toBe(200);
  expect(await posturePage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/posture-stagger-gauge/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Posture stagger gauge');
  await expect(page.locator('[data-blueprint-id="posture-stagger-gauge"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const pacifistPage = await request.get('en/mechanics/pacifist-resolution/');
  expect(pacifistPage.status()).toBe(200);
  expect(await pacifistPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/pacifist-resolution/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Pacifist resolution');
  await expect(page.locator('[data-blueprint-id="pacifist-resolution"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const persistentPage = await request.get('en/mechanics/persistent-progress/');
  expect(persistentPage.status()).toBe(200);
  expect(await persistentPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/persistent-progress/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Persistent encounter progress');
  await expect(page.locator('[data-blueprint-id="persistent-progress"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const statusPage = await request.get('en/mechanics/status-buildup/');
  expect(statusPage.status()).toBe(200);
  expect(await statusPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/status-buildup/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Status buildup');
  await expect(page.locator('[data-blueprint-id="status-buildup"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const instantKillPage = await request.get('en/mechanics/instant-kill/');
  expect(instantKillPage.status()).toBe(200);
  expect(await instantKillPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/instant-kill/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Instant-kill condition');
  await expect(page.locator('[data-blueprint-id="instant-kill"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const maximumHealthPage = await request.get('en/mechanics/maximum-health-reduction/');
  expect(maximumHealthPage.status()).toBe(200);
  expect(await maximumHealthPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/maximum-health-reduction/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Maximum-health reduction');
  await expect(page.locator('[data-blueprint-id="maximum-health-reduction"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const abilityLockPage = await request.get('en/mechanics/ability-lock/');
  expect(abilityLockPage.status()).toBe(200);
  expect(await abilityLockPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/ability-lock/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Ability or healing lock');
  await expect(page.locator('[data-blueprint-id="ability-lock"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const resourceStealPage = await request.get('en/mechanics/resource-steal/');
  expect(resourceStealPage.status()).toBe(200);
  expect(await resourceStealPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/resource-steal/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Resource steal or drop');
  await expect(page.locator('[data-blueprint-id="resource-steal"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const onHitHealingPage = await request.get('en/mechanics/on-hit-healing/');
  expect(onHitHealingPage.status()).toBe(200);
  expect(await onHitHealingPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/on-hit-healing/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('On-hit healing or lifesteal');
  await expect(page.locator('[data-blueprint-id="on-hit-healing"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const selfHealCastPage = await request.get('en/mechanics/self-heal-cast/');
  expect(selfHealCastPage.status()).toBe(200);
  expect(await selfHealCastPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/self-heal-cast/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Interruptible self-heal');
  await expect(page.locator('[data-blueprint-id="self-heal-cast"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const externalHealingSourcePage = await request.get('en/mechanics/external-healing-source/');
  expect(externalHealingSourcePage.status()).toBe(200);
  expect(await externalHealingSourcePage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/external-healing-source/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Interceptable healing sources');
  await expect(page.locator('[data-blueprint-id="external-healing-source"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const damageRateCapPage = await request.get('en/mechanics/damage-rate-cap/');
  expect(damageRateCapPage.status()).toBe(200);
  expect(await damageRateCapPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/damage-rate-cap/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Adaptive damage-rate cap');
  await expect(page.locator('[data-blueprint-id="damage-rate-cap"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const loadoutMirrorPage = await request.get('en/mechanics/loadout-mirror/');
  expect(loadoutMirrorPage.status()).toBe(200);
  expect(await loadoutMirrorPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/loadout-mirror/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Loadout mirror');
  await expect(page.locator('[data-blueprint-id="loadout-mirror"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const movesetPage = await request.get('en/mechanics/moveset-shapeshifting/');
  expect(movesetPage.status()).toBe(200);
  expect(await movesetPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/moveset-shapeshifting/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Moveset shapeshifting');
  await expect(page.locator('[data-blueprint-id="moveset-shapeshifting"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const allyTheftPage = await request.get('en/mechanics/ally-theft/');
  expect(allyTheftPage.status()).toBe(200);
  expect(await allyTheftPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/ally-theft/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Ally theft and charm');
  await expect(page.locator('[data-blueprint-id="ally-theft"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const falseDeathPage = await request.get('en/mechanics/false-death/');
  expect(falseDeathPage.status()).toBe(200);
  expect(await falseDeathPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/false-death/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('False death and return');
  await expect(page.locator('[data-blueprint-id="false-death"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const reactivePage = await request.get('en/mechanics/action-reactive-punish/');
  expect(reactivePage.status()).toBe(200);
  expect(await reactivePage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/action-reactive-punish/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Action-reactive punish');
  await expect(page.locator('[data-blueprint-id="action-reactive-punish"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const runHistoryPage = await request.get('en/mechanics/run-history-manifestation/');
  expect(runHistoryPage.status()).toBe(200);
  expect(await runHistoryPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/run-history-manifestation/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Run-history manifestation');
  await expect(page.locator('[data-blueprint-id="run-history-manifestation"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const realTimePage = await request.get('en/mechanics/real-time-progression/');
  expect(realTimePage.status()).toBe(200);
  expect(await realTimePage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/real-time-progression/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Real-time progression');
  await expect(page.locator('[data-blueprint-id="real-time-progression"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const interfacePage = await request.get('en/mechanics/interface-interaction/');
  expect(interfacePage.status()).toBe(200);
  expect(await interfacePage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/interface-interaction/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Interface interaction');
  await expect(page.locator('[data-blueprint-id="interface-interaction"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const worldStatePage = await request.get('en/mechanics/world-state-variant/');
  expect(worldStatePage.status()).toBe(200);
  expect(await worldStatePage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/world-state-variant/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('World-state encounter variant');
  await expect(page.locator('[data-blueprint-id="world-state-variant"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const partySizePage = await request.get('en/mechanics/party-size-scaling/');
  expect(partySizePage.status()).toBe(200);
  expect(await partySizePage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/party-size-scaling/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Party-size scaling');
  await expect(page.locator('[data-blueprint-id="party-size-scaling"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const partnerRevivalPage = await request.get('en/mechanics/partner-revival/');
  expect(partnerRevivalPage.status()).toBe(200);
  expect(await partnerRevivalPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/partner-revival/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Partner revival');
  await expect(page.locator('[data-blueprint-id="partner-revival"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const inheritancePage = await request.get('en/mechanics/kill-order-inheritance/');
  expect(inheritancePage.status()).toBe(200);
  expect(await inheritancePage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/kill-order-inheritance/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Kill-order inheritance');
  await expect(page.locator('[data-blueprint-id="kill-order-inheritance"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const sharedHealthPage = await request.get('en/mechanics/shared-group-health/');
  expect(sharedHealthPage.status()).toBe(200);
  expect(await sharedHealthPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/shared-group-health/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Shared group health');
  await expect(page.locator('[data-blueprint-id="shared-group-health"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const coordinatedDuoPage = await request.get('en/mechanics/coordinated-duo-attack/');
  expect(coordinatedDuoPage.status()).toBe(200);
  expect(await coordinatedDuoPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/coordinated-duo-attack/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Coordinated duo attack');
  await expect(page.locator('[data-blueprint-id="coordinated-duo-attack"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const stackDamagePage = await request.get('en/mechanics/stack-damage/');
  expect(stackDamagePage.status()).toBe(200);
  expect(await stackDamagePage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/stack-damage/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Shared-damage stack');
  await expect(page.locator('[data-blueprint-id="stack-damage"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  const personalSpreadPage = await request.get('en/mechanics/personal-spread/');
  expect(personalSpreadPage.status()).toBe(200);
  expect(await personalSpreadPage.text()).not.toContain('class="wip-badge"');
  await page.goto('en/mechanics/personal-spread/');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Personal spread');
  await expect(page.locator('[data-blueprint-id="personal-spread"]')).toBeVisible();
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('lesson footer keeps the same responsive gutters as the page content', async ({ page }) => {
  await page.goto('en/mechanics/gap-volley/');
  for (const [width, gutter] of [
    [1280, 44],
    [1151, 44],
    [1150, 28],
    [375, 18],
  ]) {
    await page.setViewportSize({ width, height: 800 });
    const layout = await page.locator('.site-footer').evaluate((footer) => {
      const box = footer.getBoundingClientRect();
      const children = [...footer.children].map((child) => child.getBoundingClientRect());
      return {
        left: box.left,
        right: box.right,
        viewportWidth: window.innerWidth,
        childrenFit: children.every(
          (child) => child.width === 0 || (child.left >= box.left && child.right <= box.right),
        ),
      };
    });
    expect(layout.left).toBeCloseTo(gutter, 0);
    expect(layout.viewportWidth - layout.right).toBeCloseTo(gutter, 0);
    expect(layout.childrenFit).toBe(true);
  }
});

test('homepages fit their hero on a laptop and reflow on mobile', async ({ page }) => {
  for (const locale of registry) {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`${locale.code}/`);
    await expect(page.locator('html')).toHaveAttribute('dir', locale.dir);
    for (const selector of ['.catalog-hero']) {
      const box = await page.locator(selector).boundingBox();
      expect(box.y, `${locale.code}: ${selector} starts on screen`).toBeGreaterThanOrEqual(0);
      expect(
        box.y + box.height,
        `${locale.code}: ${selector} fits the first screen`,
      ).toBeLessThanOrEqual(720);
    }
    await expect(page.locator('.atlas-map')).toHaveCount(0);
    await page.setViewportSize({ width: 375, height: 812 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(page.locator('.catalog-part-nav__link').first()).toBeVisible();
    await expect(page.locator('.catalog-lesson').first()).toBeVisible();
  }
});
