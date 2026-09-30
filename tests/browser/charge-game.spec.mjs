import { test, expect } from '@playwright/test';

test('home hero embeds the lesson animation without the feature card', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('en/');
  const hero = page.locator('.catalog-hero');
  const demo = hero.locator('[data-charge-demo]');
  await expect(demo).toHaveAttribute('data-charge-ready', 'true');
  await expect(demo.locator('[data-charge-boss]')).toHaveCount(1);
  await expect(demo.locator('[data-charge-player]')).toHaveCount(1);
  await expect(demo.locator('[data-charge-timeline]')).toBeVisible();
  await expect(demo.locator('[data-charge-svg]')).toHaveAttribute('viewBox', '0 0 560 960');
  await expect(hero.locator('h2, .catalog-hero__questions, .charge-demo__playbar')).toHaveCount(0);
  await expect(demo.locator('button')).toHaveCount(0);
  const box = await hero.boundingBox();
  expect(box.y + box.height).toBeCloseTo(720, 0);

  await page.locator('.catalog-hero__copy').click();
  await page.keyboard.press('ArrowRight');
  await expect(demo).toHaveAttribute('data-charge-mode', 'demo');
  await demo.locator('[data-charge-timeline]').evaluate((input) => {
    input.value = '5000';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(demo).toHaveAttribute('data-charge-phase', '1');

  await demo.focus();
  await page.keyboard.down('KeyD');
  await expect(demo).toHaveAttribute('data-charge-mode', 'game');
  await page.keyboard.up('KeyD');
  await expect(demo.locator('[data-charge-player-hearts]')).toHaveAttribute('opacity', '1');
  await page.keyboard.press('Escape');
  await expect(demo).toHaveAttribute('data-charge-mode', 'demo');
  await expect(demo.locator('[data-charge-timeline]')).toBeVisible();
});

test('home characters retain the lesson scale in the same browser window', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const heights = {};
  for (const route of ['en/', 'en/mechanics/charge/']) {
    await page.goto(route);
    await expect(page.locator('[data-charge-demo]')).toHaveAttribute('data-charge-ready', 'true');
    const canvas = await page.locator('.charge-demo__canvas').boundingBox();
    heights[route] = { canvas: canvas.height };
    for (const role of ['boss', 'player']) {
      const actor = await page.locator(`[data-charge-${role}]`).boundingBox();
      heights[route][role] = actor.height;
    }
  }
  for (const role of ['boss', 'player']) {
    expect(heights['en/'][role]).toBeGreaterThan(heights['en/mechanics/charge/'][role] * 0.95);
    expect(heights['en/'][role] / heights['en/'].canvas).toBeCloseTo(
      heights['en/mechanics/charge/'][role] / heights['en/mechanics/charge/'].canvas,
      3,
    );
  }
});

test('the home arena fills its canvas at desktop and phone proportions', async ({ page }) => {
  await page.goto('en/');
  const demo = page.locator('.catalog-hero [data-charge-demo]');
  for (const [width, height] of [
    [1280, 720],
    [1440, 1000],
    [375, 812],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    const canvas = await demo.locator('.charge-demo__canvas').boundingBox();
    const floor = await demo
      .locator('[data-charge-svg] > g[clip-path] > rect')
      .first()
      .boundingBox();
    expect(floor.x).toBeLessThanOrEqual(canvas.x + 1);
    expect(floor.y).toBeLessThanOrEqual(canvas.y + 1);
    expect(floor.x + floor.width).toBeGreaterThanOrEqual(canvas.x + canvas.width - 1);
    expect(floor.y + floor.height).toBeGreaterThanOrEqual(canvas.y + canvas.height - 1);
    for (const time of [0, 1300, 2250, 4000, 5300, 6250, 7990]) {
      await demo.locator('[data-charge-timeline]').evaluate((input, value) => {
        input.value = String(value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }, time);
      for (const role of ['boss', 'player']) {
        const actor = await demo.locator(`[data-charge-${role}]`).boundingBox();
        expect(actor.x).toBeGreaterThanOrEqual(canvas.x);
        expect(actor.y).toBeGreaterThanOrEqual(canvas.y);
        expect(actor.x + actor.width).toBeLessThanOrEqual(canvas.x + canvas.width);
        expect(actor.y + actor.height).toBeLessThanOrEqual(canvas.y + canvas.height);
      }
    }
  }
});

test('movement keys switch the charge demo into a playable battle', async ({ page }) => {
  await page.goto('ru/mechanics/charge/');
  const demo = page.locator('[data-charge-demo]');
  await expect(demo).toHaveAttribute('data-charge-mode', 'demo');
  await demo.scrollIntoViewIfNeeded();
  await page.locator('[data-charge-timeline]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(demo).toHaveAttribute('data-charge-mode', 'demo');

  await demo.focus();
  await page.keyboard.down('KeyD');
  await expect(demo).toHaveAttribute('data-charge-mode', 'game');
  await expect(page.locator('.charge-demo__game-bar')).toHaveCount(0);
  await expect(page.locator('[data-charge-boss-label]')).toHaveAttribute('opacity', '0');
  await expect(page.locator('[data-charge-player-label]')).toHaveAttribute('opacity', '0');
  await expect(page.locator('[data-charge-boss-hearts]')).toHaveAttribute('opacity', '1');
  await expect(page.locator('[data-charge-player-hearts]')).toHaveAttribute('opacity', '1');
  await expect(page.locator('[data-charge-heart][data-full="true"]')).toHaveCount(6);
  await expect(page.locator('[data-charge-timeline]')).toBeHidden();
  await expect(page.locator('[data-charge-player]')).not.toHaveAttribute(
    'transform',
    'translate(280 480)',
  );
  await page.keyboard.up('KeyD');

  await page.keyboard.press('Escape');
  await expect(demo).toHaveAttribute('data-charge-mode', 'demo');
  await expect(page.locator('[data-charge-timeline]')).toBeVisible();
  await expect(page.locator('[data-charge-boss-label]')).toHaveAttribute('opacity', '1');
  await expect(page.locator('[data-charge-boss-hearts]')).toHaveAttribute('opacity', '0');
});

test('an idle player loses after three charges and the demo resumes', async ({ page }) => {
  await page.goto('en/mechanics/charge/');
  const demo = page.locator('[data-charge-demo]');
  await demo.scrollIntoViewIfNeeded();
  await demo.focus();
  await page.keyboard.press('ArrowUp');
  await expect(demo).toHaveAttribute('data-charge-mode', 'game');
  await expect
    .poll(() => page.locator('[data-charge-player-hearts] [data-full="false"]').count())
    .toBeGreaterThan(0);
  await expect(demo).toHaveAttribute('data-charge-mode', 'demo', { timeout: 15000 });
  await expect(page.locator('[data-charge-status]')).toContainText('boss won');
  await expect(page.locator('[data-charge-timeline]')).toBeVisible();
  await demo.evaluate((element) => {
    element.dispatchEvent(
      new KeyboardEvent('keydown', { code: 'ArrowUp', repeat: true, bubbles: true }),
    );
  });
  await expect(demo).toHaveAttribute('data-charge-mode', 'demo');
});

test.describe('phone controls', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  test('home animation starts touch play without opening the lesson', async ({ page }) => {
    await page.goto('en/');
    const demo = page.locator('.catalog-hero [data-charge-demo]');
    await demo.locator('.charge-demo__canvas').tap({ position: { x: 100, y: 150 } });
    await expect(demo).toHaveAttribute('data-charge-mode', 'game');
  });

  test('first arena touch starts the game and a second finger does not steal the joystick', async ({
    page,
  }) => {
    await page.goto('en/mechanics/charge/');
    const demo = page.locator('[data-charge-demo]');
    const canvas = page.locator('.charge-demo__canvas');
    const stick = page.locator('[data-charge-joystick]');
    await expect(page.locator('[data-charge-touch-attack]')).toHaveCount(0);
    await expect(canvas).toHaveCSS('touch-action', 'none');
    await page.locator('[data-charge-timeline]').tap();
    await expect(demo).toHaveAttribute('data-charge-mode', 'demo');
    await canvas.evaluate((element) => {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo(0, top);
    });

    const box = await canvas.boundingBox();
    const center = { x: box.x + 64, y: box.y + box.height * 0.55 };
    const session = await page.context().newCDPSession(page);
    const touch = (id, x, y) => ({ id, x, y });
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [touch(1, center.x, center.y)],
    });
    await expect(demo).toHaveAttribute('data-charge-mode', 'game');
    await expect(stick).toBeVisible();
    const player = page.locator('[data-charge-player]');
    const initial = await player.getAttribute('transform');
    await page.waitForTimeout(100);
    await expect(player).toHaveAttribute('transform', initial);

    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [touch(1, center.x + 36, center.y)],
    });
    await expect.poll(() => player.getAttribute('transform')).not.toBe(initial);
    const moved = await player.getAttribute('transform');
    await page.waitForTimeout(120);
    await expect(player).not.toHaveAttribute('transform', moved);

    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [touch(1, center.x + 160, center.y)],
    });
    await expect
      .poll(() =>
        stick.evaluate((element) =>
          Number.parseFloat(element.style.getPropertyValue('--charge-stick-x')),
        ),
      )
      .toBeGreaterThan(70);
    const secondPoint = { x: box.x + box.width - 64, y: center.y };
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [touch(1, center.x + 160, center.y), touch(2, secondPoint.x, secondPoint.y)],
    });
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [touch(2, secondPoint.x, secondPoint.y)],
    });
    await expect(stick).toBeVisible();
    const beforeSecondFinger = await player.getAttribute('transform');
    await page.waitForTimeout(120);
    await expect(player).not.toHaveAttribute('transform', beforeSecondFinger);
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [touch(1, center.x + 160, center.y)],
    });
    await expect(stick).toBeHidden();
    const stopped = await player.getAttribute('transform');
    await page.waitForTimeout(120);
    await expect(player).toHaveAttribute('transform', stopped);
  });
});
