import { test, expect } from '@playwright/test';

test('home hero shows the full charge simulation and starts play explicitly', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('en/');
  const hero = page.locator('.catalog-hero');
  const demo = hero.locator('[data-charge-demo]');
  await expect(demo).toHaveAttribute('data-charge-ready', 'true');
  await expect(demo.locator('[data-charge-boss]')).toHaveCount(1);
  await expect(demo.locator('[data-charge-player]')).toHaveCount(1);
  await expect(demo.locator('[data-charge-timeline]')).toBeVisible();
  await expect(demo.locator('.charge-demo__keys')).toContainText('Move: WASD');
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

  await demo.locator('[data-charge-start]').click();
  await expect(demo).toHaveAttribute('data-charge-mode', 'game');
  await expect(demo.locator('[data-charge-player-hearts]')).toHaveAttribute('opacity', '1');
  await demo.locator('[data-charge-exit]').click();
  await expect(demo).toHaveAttribute('data-charge-mode', 'demo');
  await expect(demo.locator('[data-charge-timeline]')).toBeVisible();
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

  test('home feature starts and leaves touch play without opening the lesson', async ({ page }) => {
    await page.goto('en/');
    const demo = page.locator('.catalog-hero [data-charge-demo]');
    await demo.locator('[data-charge-start]').tap();
    await expect(demo).toHaveAttribute('data-charge-mode', 'game');
    await demo.locator('[data-charge-exit]').tap();
    await expect(demo).toHaveAttribute('data-charge-mode', 'demo');
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
