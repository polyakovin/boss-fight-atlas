import { test, expect } from '@playwright/test';

test('a reduced-motion blueprint stays still and remains fully seekable', async ({ page }) => {
  await page.goto('en/mechanics/target-lock/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');

  await expect(widget).toHaveAttribute('data-blueprint-ready', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget.locator('[data-blueprint-motion-note]')).toBeVisible();

  await timeline.evaluate((element) => {
    element.value = '3000';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });

  await expect(widget).toHaveAttribute('data-blueprint-phase', '1');
  await expect(widget).toHaveAttribute('data-blueprint-committed', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-phase-name]')).toHaveText('Response');
  await expect(timeline).toHaveAttribute('aria-valuetext', 'Response');
});

test('blueprints autoplay only when motion is allowed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('en/mechanics/wide-swing/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');

  await expect(widget).toHaveAttribute('data-blueprint-playing', 'true');
  await expect
    .poll(async () => Number(await timeline.inputValue()), { timeout: 3000 })
    .toBeGreaterThan(150);
});

test('wide swing keeps a held blade and both actors inside the full-height phone scene', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('ru/mechanics/wide-swing/');
  const widget = page.locator('[data-blueprint-id="wide-swing"]');
  const canvas = widget.locator('.blueprint-demo__canvas');
  const blade = widget.locator('[data-weapon-blade]');
  const shaft = widget.locator('[data-sweep-shaft]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(blade).toBeVisible();
  expect((await canvas.boundingBox()).height).toBeGreaterThanOrEqual(811);
  const startingPose = await shaft.getAttribute('transform');

  for (const milliseconds of [0, 2800, 4250, 5600]) {
    await timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
    const scene = await canvas.boundingBox();
    for (const part of [
      blade,
      widget.locator('[data-blueprint-boss] [data-character-art]'),
      widget.locator('[data-blueprint-player] [data-character-art]'),
    ]) {
      const bounds = await part.boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(scene.x - 1);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(scene.x + scene.width + 1);
      expect(bounds.y).toBeGreaterThanOrEqual(scene.y - 1);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(scene.y + scene.height + 1);
    }
  }
  expect(await shaft.getAttribute('transform')).not.toBe(startingPose);
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
});

test('mine arms its visible circle, keeps the player safe, and fits on mobile', async ({
  page,
}) => {
  await page.goto('en/mechanics/mine/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Mine');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(widget).toHaveAttribute('data-blueprint-ready', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(page.locator('.game-example')).toHaveCount(3);

  await timeline.evaluate((element) => {
    element.value = '3000';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(widget).toHaveAttribute('data-blueprint-phase', '1');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-phase-name]')).toHaveText(
    'Respect the armed radius',
  );
  await expect(widget.locator('[data-blueprint-primitive="0"] circle')).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('moving hazard travels with its visible footprint and leaves a clear wake', async ({
  page,
}) => {
  await page.goto('en/mechanics/moving-hazard/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Moving hazard');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(widget).toHaveAttribute('data-blueprint-ready', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(page.locator('.game-example')).toHaveCount(3);

  const circle = widget.locator('[data-blueprint-primitive="1"] circle');
  const initialX = Number(await circle.getAttribute('cx'));
  await timeline.evaluate((element) => {
    element.value = '3000';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(widget).toHaveAttribute('data-blueprint-phase', '1');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-phase-name]')).toHaveText(
    'Track the live footprint',
  );
  expect(Number(await circle.getAttribute('cx'))).toBeGreaterThan(initialX + 100);

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('converging fronts visibly close both sides while the player exits above', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/converging-threats/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Converging threats');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(widget).toHaveAttribute('data-blueprint-ready', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(page.locator('.game-example')).toHaveCount(3);
  const left = widget.locator('[data-blueprint-primitive="0"] rect');
  const right = widget.locator('[data-blueprint-primitive="1"] rect');
  const initialWidth = Number(await left.getAttribute('width'));
  const initialRight = Number(await right.getAttribute('x'));

  await timeline.evaluate((element) => {
    element.value = '3850';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(widget).toHaveAttribute('data-blueprint-phase', '1');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-phase-name]')).toHaveText(
    'Leave before the corridor closes',
  );
  expect(Number(await left.getAttribute('width'))).toBeGreaterThan(initialWidth + 120);
  expect(Number(await right.getAttribute('x'))).toBeLessThan(initialRight - 120);

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('pull separates a wide force cue from its dangerous core and keeps lateral control', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/pull/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Pull');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(widget).toHaveAttribute('data-blueprint-ready', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget.locator('[data-blueprint-primitive="0"] circle')).toHaveAttribute('r', '445');
  await expect(widget.locator('[data-blueprint-primitive="1"] circle')).toHaveAttribute('r', '82');
  const player = widget.locator('[data-blueprint-player]');
  const start = await player.getAttribute('transform');
  await timeline.evaluate((element) => {
    element.value = '3000';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(widget).toHaveAttribute('data-blueprint-phase', '1');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-phase-name]')).toHaveText(
    'Steer across the current',
  );
  expect(await player.getAttribute('transform')).not.toBe(start);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('turret deployment is seekable, shows its fixed beam, and clears after firing', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/turret-deployment/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const beam = widget.locator('[data-blueprint-primitive="7"] line');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-ready', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await timeline.evaluate((element) => {
    element.value = '3000';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-phase-name]')).toHaveText('Clear its firing lane');
  await expect(beam).toHaveAttribute('x1', '430');
  await expect(beam).toHaveAttribute('x2', '430');
  await expect(beam).toHaveAttribute('opacity', '0.94');
  await timeline.evaluate((element) => {
    element.value = '5200';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(beam).toHaveAttribute('opacity', '0');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('threat generator releases independent motes and stops after the last flight', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/threat-generator/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const source = widget.locator('[data-blueprint-primitive="3"] circle');
  const secondMote = widget.locator('[data-blueprint-primitive="10"] circle');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-ready', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await timeline.evaluate((element) => {
    element.value = '3000';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-phase-name]')).toHaveText(
    'Release repeated threats',
  );
  await expect(source).toHaveAttribute('cx', '405');
  await expect(source).toHaveAttribute('cy', '455');
  await expect(secondMote).toHaveAttribute('opacity', '0.96');
  await timeline.evaluate((element) => {
    element.value = '5200';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(secondMote).toHaveAttribute('opacity', '0');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('decoy keeps only the real Kern solid and clears its mirror on recovery', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/decoy/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const mirror = widget.locator('[data-blueprint-decoy]');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Decoy');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-ready', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(mirror.locator('[data-character-art="kern-decoy"]')).toHaveCount(1);
  await timeline.evaluate((element) => {
    element.value = '3000';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(mirror).toHaveAttribute('transform', 'translate(410 425)');
  await expect(mirror).toHaveAttribute('opacity', '0.65');
  await expect(widget.locator('[data-blueprint-boss]')).toHaveAttribute(
    'transform',
    'translate(190 425) scale(1)',
  );
  await expect(widget.locator('[data-blueprint-primitive]')).toHaveCount(3);
  await timeline.evaluate((element) => {
    element.value = '5900';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  expect(Number(await mirror.getAttribute('opacity'))).toBeLessThan(0.01);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('predictive aiming freezes its forecast while the shot follows a fixed line', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/predictive-aiming/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Predictive aiming');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-ready', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await timeline.evaluate((element) => {
    element.value = '3000';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="1"] circle')).toHaveAttribute(
    'cx',
    '500',
  );
  await expect(widget.locator('[data-blueprint-player]')).toHaveAttribute(
    'transform',
    'translate(300 620)',
  );
  const shotX = Number(
    await widget.locator('[data-blueprint-primitive="3"] circle').getAttribute('cx'),
  );
  expect(shotX).toBeGreaterThan(300);
  expect(shotX).toBeLessThan(500);
  await timeline.evaluate((element) => {
    element.value = '3800';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(widget.locator('[data-blueprint-primitive="3"] circle')).toHaveAttribute(
    'opacity',
    '0',
  );
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('source tracking shows a harmless moving guide and a fixed damaging beam', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/source-tracking/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const guide = widget.locator('[data-blueprint-primitive="2"] line');
  const beam = widget.locator('[data-blueprint-primitive="3"] line');
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Source tracking');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-ready', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await seek(600);
  const movingEnd = await guide.getAttribute('x2');
  await seek(1500);
  expect(await guide.getAttribute('x2')).not.toBe(movingEnd);
  await expect(beam).toHaveAttribute('opacity', '0');
  await seek(2350);
  const lockedEnd = await guide.getAttribute('x2');
  await expect(beam).toHaveAttribute('opacity', '0');
  await seek(3000);
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(beam).toHaveAttribute('x2', lockedEnd);
  expect(Number(await beam.getAttribute('opacity'))).toBeGreaterThan(0.9);
  await seek(3900);
  await expect(beam).toHaveAttribute('opacity', '0');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('burst fire shows three separate shots from one locked source', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/burst-fire/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const shots = [2, 3, 4].map((index) =>
    widget.locator(`[data-blueprint-primitive="${index}"] circle`),
  );
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Burst fire');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await seek(1850);
  for (const shot of shots) await expect(shot).toHaveAttribute('opacity', '0');
  await seek(2200);
  expect(Number(await shots[0].getAttribute('opacity'))).toBeGreaterThan(0.9);
  await expect(shots[1]).toHaveAttribute('opacity', '0');
  await expect(shots[2]).toHaveAttribute('opacity', '0');
  await seek(3050);
  for (const shot of shots) expect(Number(await shot.getAttribute('opacity'))).toBeGreaterThan(0.9);
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(4200);
  await expect(shots[0]).toHaveAttribute('opacity', '0');
  await expect(shots[1]).toHaveAttribute('opacity', '0');
  expect(Number(await shots[2].getAttribute('opacity'))).toBeGreaterThan(0.9);
  await seek(4300);
  for (const shot of shots) await expect(shot).toHaveAttribute('opacity', '0');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('volley releases three parallel bolts on one beat and clears its outside route', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/volley/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const shots = [7, 8, 9].map((index) =>
    widget.locator(`[data-blueprint-primitive="${index}"] circle`),
  );
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Volley');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await seek(1950);
  for (const shot of shots) await expect(shot).toHaveAttribute('opacity', '0');
  await seek(2050);
  for (const shot of shots) expect(Number(await shot.getAttribute('opacity'))).toBeGreaterThan(0.9);
  await seek(2800);
  const positions = await Promise.all(
    shots.map(async (shot) => ({
      x: await shot.getAttribute('cx'),
      y: await shot.getAttribute('cy'),
    })),
  );
  expect(positions.map(({ x }) => x)).toEqual(['190', '280', '370']);
  expect(new Set(positions.map(({ y }) => y)).size).toBe(1);
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(3510);
  for (const shot of shots) await expect(shot).toHaveAttribute('opacity', '0');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('catalog and builder reuse the 118 promoted rule-specific previews', async ({ page }) => {
  await page.goto('en/');
  await expect(page.locator('[data-blueprint-preview]')).toHaveCount(118);
  const catalogLayouts = await page.locator('[data-blueprint-preview]').evaluateAll((previews) =>
    previews.map((preview) => {
      const boss = preview.querySelector('[data-character-art-preview="kern"]');
      const player = preview.querySelector('[data-character-art-preview="tavi"]');
      const primitiveShapes = [...preview.querySelectorAll('g[clip-path] > g > g > *')];
      return {
        layout: `${preview.dataset.blueprintPreviewTime}|${boss?.getAttribute('transform')}|${player?.getAttribute('transform')}`,
        visibleGeometry: primitiveShapes.some((shape) => {
          const bounds = shape.getBoundingClientRect();
          const stroke = getComputedStyle(shape).stroke;
          return (
            Number(shape.getAttribute('opacity')) > 0.05 &&
            Math.max(bounds.width, bounds.height) > 5 &&
            stroke !== 'none'
          );
        }),
      };
    }),
  );
  expect(catalogLayouts.every(({ visibleGeometry }) => visibleGeometry)).toBe(true);
  expect(new Set(catalogLayouts.map(({ layout }) => layout)).size).toBeGreaterThanOrEqual(18);

  await page.goto('en/builder/');
  await expect(page.locator('[data-blueprint-preview]')).toHaveCount(118);
  const builderLayouts = await page.locator('[data-blueprint-preview]').evaluateAll((previews) =>
    previews.map((preview) => {
      const boss = preview.querySelector('[data-character-art-preview="kern"]');
      const player = preview.querySelector('[data-character-art-preview="tavi"]');
      const primitiveShapes = [...preview.querySelectorAll('g[clip-path] > g > g > *')];
      return {
        layout: `${preview.dataset.blueprintPreviewTime}|${boss?.getAttribute('transform')}|${player?.getAttribute('transform')}`,
        visibleGeometry: primitiveShapes.some((shape) => {
          const bounds = shape.getBoundingClientRect();
          const stroke = getComputedStyle(shape).stroke;
          return (
            Number(shape.getAttribute('opacity')) > 0.05 &&
            Math.max(bounds.width, bounds.height) > 5 &&
            stroke !== 'none'
          );
        }),
      };
    }),
  );
  expect(builderLayouts).toEqual(catalogLayouts);
});

test('delayed rune warns harmlessly, ignites on its fixed beat, and extinguishes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/delayed-activation/');
  const widget = page.locator('[data-blueprint-demo]');
  const ring = widget.locator('[data-blueprint-primitive="1"] circle');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Delayed activation');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await seek(2800);
  await expect(ring).toHaveAttribute('cx', '350');
  await expect(ring).toHaveAttribute('cy', '630');
  await expect(ring).toHaveAttribute('r', '82');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  const warning = await ring.getAttribute('class');
  await seek(3000);
  await expect(ring).not.toHaveAttribute('class', warning);
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(4000);
  await expect(ring).toHaveAttribute('class', warning);
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('speed change keeps its lane while the boss accelerates past a visible rune', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/speed-change/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const boss = widget.locator('[data-blueprint-boss]');
  const rune = widget.locator('[data-blueprint-primitive="1"] path');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-ready', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await seek(2300);
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  const slowBoss = await boss.getAttribute('transform');
  const quietRune = await rune.getAttribute('class');
  await seek(3100);
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(boss).not.toHaveAttribute('transform', slowBoss);
  await expect(rune).not.toHaveAttribute('class', quietRune);
  await seek(3450);
  await expect(widget.locator('[data-blueprint-primitive="2"] line')).toHaveAttribute(
    'opacity',
    '0',
  );
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('limited spread keeps its previewed cone while distinct live shots remain inside it', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/limited-spread/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const cone = widget.locator('[data-blueprint-primitive="0"] path');
  const shots = [2, 3, 4].map((index) =>
    widget.locator(`[data-blueprint-primitive="${index}"] circle`),
  );
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Limited spread');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  const outline = await cone.getAttribute('d');
  await seek(3000);
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget).toHaveAttribute('data-blueprint-phase', '1');
  await expect(cone).toHaveAttribute('d', outline);
  await expect(shots[0]).toHaveAttribute('opacity', '0.98');
  await expect(shots[1]).toHaveAttribute('opacity', '0.98');
  await expect(shots[2]).toHaveAttribute('opacity', '0.98');
  const slopes = await Promise.all(
    shots.map((shot) =>
      shot.evaluate(
        (node) => (Number(node.getAttribute('cx')) - 280) / (Number(node.getAttribute('cy')) - 332),
      ),
    ),
  );
  expect(new Set(slopes.map((slope) => slope.toFixed(3))).size).toBe(3);
  expect(slopes.every((slope) => Math.abs(Math.atan(slope)) <= 0.2)).toBe(true);
  await seek(4250);
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  for (const shot of shots) await expect(shot).toHaveAttribute('opacity', '0');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('directional shield visibly blocks the front strike and opens a side hit', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/directional-shield/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Directional shield');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await seek(2050);
  await expect(widget).toHaveAttribute('data-blueprint-guard', 'blocked');
  await expect(widget.locator('[data-blueprint-primitive="4"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  const frontHit = widget.locator('[data-blueprint-primitive="7"] circle');
  await expect(frontHit).not.toHaveAttribute('opacity', '0');
  await seek(3550);
  await expect(widget).toHaveAttribute('data-blueprint-guard', 'flank-hit');
  await expect(widget.locator('[data-blueprint-primitive="9"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(3850);
  await expect(widget).toHaveAttribute('data-blueprint-guard', 'idle');
  await expect(widget.locator('[data-blueprint-primitive="4"] path')).toHaveAttribute(
    'opacity',
    '0',
  );
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('damage-type resistance shows two connected hits with unequal damage at one point', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/damage-type-resistance/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Damage-type resistance');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await seek(2050);
  await expect(widget).toHaveAttribute('data-blueprint-resistance', 'reduced');
  await expect(widget.locator('[data-blueprint-primitive="5"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="9"] rect')).toHaveAttribute(
    'width',
    '20',
  );
  await expect(widget.locator('[data-blueprint-primitive="11"] rect')).toHaveAttribute(
    'width',
    '0',
  );
  await seek(3550);
  await expect(widget).toHaveAttribute('data-blueprint-resistance', 'normal');
  await expect(widget.locator('[data-blueprint-primitive="7"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="9"] rect')).toHaveAttribute(
    'width',
    '20',
  );
  await expect(widget.locator('[data-blueprint-primitive="11"] rect')).toHaveAttribute(
    'width',
    '100',
  );
  await seek(4300);
  await expect(widget).toHaveAttribute('data-blueprint-resistance', 'idle');
  await expect(widget.locator('[data-blueprint-primitive="3"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('situational immunity links its blocked hit, broken ward, open hit, and return', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/situational-immunity/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Situational immunity');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await seek(2050);
  await expect(widget).toHaveAttribute('data-blueprint-immunity', 'blocked');
  await expect(widget.locator('[data-blueprint-primitive="3"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="9"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(2800);
  await expect(widget).toHaveAttribute('data-blueprint-immunity', 'ward-broken');
  await expect(widget.locator('[data-blueprint-primitive="11"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(3550);
  await expect(widget).toHaveAttribute('data-blueprint-immunity', 'boss-hit');
  await expect(widget.locator('[data-blueprint-primitive="13"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(4300);
  await expect(widget).toHaveAttribute('data-blueprint-immunity', 'immune');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('situational immunity keeps both actors and labels visible on dark RTL mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('ar/mechanics/situational-immunity/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  for (const milliseconds of [0, 2050, 2800, 3550, 4300]) {
    await timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
    const bounds = await widget.evaluate((element) => {
      const svg = element.querySelector('svg').getBoundingClientRect();
      return [
        '[data-blueprint-boss]',
        '[data-blueprint-player]',
        '[data-blueprint-boss-label]',
        '[data-blueprint-player-label]',
      ].map((selector) => {
        const rect = element.querySelector(selector).getBoundingClientRect();
        return (
          rect.left >= svg.left - 2 &&
          rect.right <= svg.right + 2 &&
          rect.top >= svg.top - 2 &&
          rect.bottom <= svg.bottom + 2
        );
      });
    });
    expect(bounds.every(Boolean), `visible actor or label at ${milliseconds}ms`).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('part break removes the actual beam until the visible launcher repair', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/part-break/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Part break');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await seek(2000);
  await expect(widget).toHaveAttribute('data-blueprint-part', 'attached');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="8"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(2880);
  await expect(widget).toHaveAttribute('data-blueprint-part', 'broken-now');
  await seek(3780);
  await expect(widget).toHaveAttribute('data-blueprint-part', 'attack-disabled');
  await expect(widget.locator('[data-blueprint-primitive="8"] line')).toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="11"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(5350);
  await expect(widget).toHaveAttribute('data-blueprint-part', 'attached');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('part break keeps its arm component and both actors visible on dark RTL mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('ar/mechanics/part-break/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const timeline = widget.locator('[data-blueprint-timeline]');
  for (const milliseconds of [0, 2000, 2880, 3780, 5350]) {
    await timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
    const bounds = await widget.evaluate((element) => {
      const svg = element.querySelector('svg').getBoundingClientRect();
      return [
        '[data-blueprint-boss]',
        '[data-blueprint-player]',
        '[data-blueprint-boss-label]',
        '[data-blueprint-player-label]',
        '[data-blueprint-primitive="5"]',
      ].map((selector) => {
        const rect = element.querySelector(selector).getBoundingClientRect();
        return (
          rect.left >= svg.left - 2 &&
          rect.right <= svg.right + 2 &&
          rect.top >= svg.top - 2 &&
          rect.bottom <= svg.bottom + 2
        );
      });
    });
    expect(bounds.every(Boolean), `visible actor, label, or part at ${milliseconds}ms`).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('attack reflection replaces the sword pulse with one hostile return and opens for melee', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/attack-reflection/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Attack reflection');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await seek(2050);
  await expect(widget).toHaveAttribute('data-blueprint-reflection', 'player-shot');
  await expect(widget.locator('[data-blueprint-primitive="6"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(2350);
  await expect(widget).toHaveAttribute('data-blueprint-reflection', 'returning-danger');
  await expect(widget.locator('[data-blueprint-primitive="6"] circle')).toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="9"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(2900);
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(4720);
  await expect(widget).toHaveAttribute('data-blueprint-reflection', 'open-hit');
  await expect(widget.locator('[data-blueprint-primitive="11"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(5630);
  await expect(widget).toHaveAttribute('data-blueprint-reflection', 'guarded');
});

test('attack reflection keeps its mirror and actors in frame on dark RTL mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('ar/mechanics/attack-reflection/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const timeline = widget.locator('[data-blueprint-timeline]');
  for (const milliseconds of [0, 2050, 2350, 2900, 4720, 5630]) {
    await timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
    const bounds = await widget.evaluate((element) => {
      const svg = element.querySelector('svg').getBoundingClientRect();
      return [
        '[data-blueprint-boss]',
        '[data-blueprint-player]',
        '[data-blueprint-boss-label]',
        '[data-blueprint-player-label]',
        '[data-blueprint-primitive="4"]',
      ].map((selector) => {
        const rect = element.querySelector(selector).getBoundingClientRect();
        return (
          rect.left >= svg.left - 2 &&
          rect.right <= svg.right + 2 &&
          rect.top >= svg.top - 2 &&
          rect.bottom <= svg.bottom + 2
        );
      });
    });
    expect(bounds.every(Boolean), `visible actors, labels, and mirror at ${milliseconds}ms`).toBe(
      true,
    );
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('counter stance distinguishes a parried hit, its riposte, withheld guard, and open hit', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/counter-stance/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Counter stance');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await seek(1400);
  await expect(widget).toHaveAttribute('data-blueprint-counter', 'guarded');
  await seek(1880);
  await expect(widget).toHaveAttribute('data-blueprint-counter', 'parried-hit');
  await expect(widget.locator('[data-blueprint-primitive="6"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(2200);
  await expect(widget.locator('[data-blueprint-primitive="7"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(2620);
  await expect(widget).toHaveAttribute('data-blueprint-counter', 'riposte-danger');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="8"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(4000);
  await expect(widget).toHaveAttribute('data-blueprint-counter', 'guarded-withheld');
  await expect(widget.locator('[data-blueprint-primitive="8"] line')).toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(4960);
  await expect(widget).toHaveAttribute('data-blueprint-counter', 'open-hit');
  await expect(widget.locator('[data-blueprint-primitive="10"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
});

test('counter stance keeps both actors and the guard visible on dark RTL mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('ar/mechanics/counter-stance/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const timeline = widget.locator('[data-blueprint-timeline]');
  for (const milliseconds of [0, 1400, 1880, 2620, 4000, 4960]) {
    await timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
    const bounds = await widget.evaluate((element) => {
      const svg = element.querySelector('svg').getBoundingClientRect();
      return [
        '[data-blueprint-boss]',
        '[data-blueprint-player]',
        '[data-blueprint-boss-label]',
        '[data-blueprint-player-label]',
        '[data-blueprint-primitive="3"]',
      ].map((selector) => {
        const rect = element.querySelector(selector).getBoundingClientRect();
        return (
          rect.left >= svg.left - 2 &&
          rect.right <= svg.right + 2 &&
          rect.top >= svg.top - 2 &&
          rect.bottom <= svg.bottom + 2
        );
      });
    });
    expect(bounds.every(Boolean), `visible actors, labels, and guard at ${milliseconds}ms`).toBe(
      true,
    );
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('absorption visibly counts two sword pulses, announces a wide release, and spends the charge', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/absorption-power-up/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Absorption power-up');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await seek(1400);
  await expect(widget).toHaveAttribute('data-blueprint-charge', '0');
  await expect(widget.locator('[data-blueprint-primitive="7"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(1650);
  await expect(widget).toHaveAttribute('data-blueprint-absorption', 'first-absorbed');
  await expect(widget).toHaveAttribute('data-blueprint-charge', '1');
  await seek(2450);
  await expect(widget).toHaveAttribute('data-blueprint-absorption', 'second-absorbed');
  await expect(widget).toHaveAttribute('data-blueprint-charge', '2');
  await seek(3280);
  await expect(widget).toHaveAttribute('data-blueprint-absorption', 'charged');
  await expect(widget.locator('[data-blueprint-primitive="11"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(3650);
  await expect(widget).toHaveAttribute('data-blueprint-absorption', 'empowered-release');
  await expect(widget).toHaveAttribute('data-blueprint-charge', '0');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="12"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await seek(4500);
  await expect(widget).toHaveAttribute('data-blueprint-absorption', 'spent-open');
  await seek(4960);
  await expect(widget).toHaveAttribute('data-blueprint-absorption', 'open-hit');
});

test('absorption keeps both actors, the core, and the wide preview inside dark RTL mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('ar/mechanics/absorption-power-up/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const timeline = widget.locator('[data-blueprint-timeline]');
  for (const milliseconds of [0, 1400, 2450, 3280, 3650, 4960]) {
    await timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
    const bounds = await widget.evaluate((element) => {
      const svg = element.querySelector('svg').getBoundingClientRect();
      return [
        '[data-blueprint-boss]',
        '[data-blueprint-player]',
        '[data-blueprint-boss-label]',
        '[data-blueprint-player-label]',
        '[data-blueprint-primitive="3"]',
      ].map((selector) => {
        const rect = element.querySelector(selector).getBoundingClientRect();
        return (
          rect.left >= svg.left - 2 &&
          rect.right <= svg.right + 2 &&
          rect.top >= svg.top - 2 &&
          rect.bottom <= svg.bottom + 2
        );
      });
    });
    expect(
      bounds.every(Boolean),
      `actors, labels, and core remain in frame at ${milliseconds}ms`,
    ).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('interruptible wind-up cancels on one qualified sword hit and releases after a missed deadline', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/interruptible-wind-up/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Interruptible wind-up');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');

  await seek(1200);
  await expect(widget).toHaveAttribute('data-blueprint-wind-up', 'wind-up-open');
  await expect(widget.locator('[data-blueprint-primitive="3"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="6"] rect')).not.toHaveAttribute(
    'width',
    '0',
  );

  await seek(1580);
  await expect(widget).toHaveAttribute('data-blueprint-wind-up', 'interrupted-now');
  await expect(widget.locator('[data-blueprint-primitive="10"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="4"] circle')).toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3500);
  await expect(widget).toHaveAttribute('data-blueprint-wind-up', 'wind-up-open');
  await expect(widget.locator('[data-blueprint-primitive="3"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(4300);
  await expect(widget).toHaveAttribute('data-blueprint-wind-up', 'released-danger');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="4"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(4800);
  await expect(widget).toHaveAttribute('data-blueprint-wind-up', 'recovery');
});

test('interruptible wind-up keeps its actors, deadline gauge, and final ring inside dark RTL mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('ar/mechanics/interruptible-wind-up/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const timeline = widget.locator('[data-blueprint-timeline]');
  for (const milliseconds of [0, 1200, 1580, 3500, 4300, 4800]) {
    await timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
    const bounds = await widget.evaluate((element) => {
      const svg = element.querySelector('svg').getBoundingClientRect();
      return [
        '[data-blueprint-boss]',
        '[data-blueprint-player]',
        '[data-blueprint-boss-label]',
        '[data-blueprint-player-label]',
        '[data-blueprint-primitive="3"]',
        '[data-blueprint-primitive="5"]',
      ].map((selector) => {
        const rect = element.querySelector(selector).getBoundingClientRect();
        return (
          rect.left >= svg.left - 2 &&
          rect.right <= svg.right + 2 &&
          rect.top >= svg.top - 2 &&
          rect.bottom <= svg.bottom + 2
        );
      });
    });
    expect(
      bounds.every(Boolean),
      `actors, labels, deadline gauge, and ring remain in frame at ${milliseconds}ms`,
    ).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('loadout adaptation snapshots two equipped runes into two deterministic boss packages', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/loadout-adaptation/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Loadout adaptation');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');

  await seek(850);
  await expect(widget).toHaveAttribute('data-blueprint-loadout', 'reach-rune');
  await expect(widget).toHaveAttribute('data-blueprint-adaptation', 'reading-reach');
  await expect(widget).toHaveAttribute('data-blueprint-package', 'reach-thrust');
  await expect(widget.locator('[data-blueprint-primitive="5"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1300);
  await expect(widget).toHaveAttribute('data-blueprint-adaptation', 'copied-reach');
  await expect(widget.locator('[data-blueprint-primitive="7"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="8"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1850);
  await expect(widget).toHaveAttribute('data-blueprint-adaptation', 'reach-danger');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="9"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2850);
  await expect(widget).toHaveAttribute('data-blueprint-loadout', 'burst-rune');
  await expect(widget).toHaveAttribute('data-blueprint-adaptation', 'loadout-swapped');
  await expect(widget).toHaveAttribute('data-blueprint-package', 'burst-ring');

  await seek(3200);
  await expect(widget).toHaveAttribute('data-blueprint-adaptation', 'reading-burst');
  await expect(widget.locator('[data-blueprint-primitive="10"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3600);
  await expect(widget).toHaveAttribute('data-blueprint-adaptation', 'copied-burst');
  await expect(widget.locator('[data-blueprint-primitive="11"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="12"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(4300);
  await expect(widget).toHaveAttribute('data-blueprint-adaptation', 'burst-danger');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="13"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(4800);
  await expect(widget).toHaveAttribute('data-blueprint-adaptation', 'burst-recovery');
});

test('loadout adaptation keeps both copied packages and actors inside dark RTL mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('ar/mechanics/loadout-adaptation/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const timeline = widget.locator('[data-blueprint-timeline]');
  for (const milliseconds of [0, 850, 1300, 1850, 2850, 3200, 3600, 4300, 4800]) {
    await timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
    const bounds = await widget.evaluate((element) => {
      const svg = element.querySelector('svg').getBoundingClientRect();
      return [
        '[data-blueprint-boss]',
        '[data-blueprint-player]',
        '[data-blueprint-boss-label]',
        '[data-blueprint-player-label]',
        '[data-blueprint-primitive="6"]',
        '[data-blueprint-primitive="12"]',
      ].map((selector) => {
        const rect = element.querySelector(selector).getBoundingClientRect();
        return (
          rect.left >= svg.left - 2 &&
          rect.right <= svg.right + 2 &&
          rect.top >= svg.top - 2 &&
          rect.bottom <= svg.bottom + 2
        );
      });
    });
    expect(
      bounds.every(Boolean),
      `actors, equipped rune, and copied burst remain in frame at ${milliseconds}ms`,
    ).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('wind-up separates readable buildup beats, a held pose, release, and recovery', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/wind-up/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Wind-up');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');

  await seek(800);
  await expect(widget).toHaveAttribute('data-blueprint-wind-up', 'short-wind-up');
  await expect(widget.locator('[data-blueprint-primitive="2"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="4"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1420);
  await expect(widget).toHaveAttribute('data-blueprint-wind-up-beat', '2');
  await expect(widget.locator('[data-blueprint-primitive="6"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1750);
  await expect(widget).toHaveAttribute('data-blueprint-wind-up', 'released-danger');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="3"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3200);
  await expect(widget).toHaveAttribute('data-blueprint-wind-up', 'held-wind-up');

  await seek(3800);
  await expect(widget).toHaveAttribute('data-blueprint-wind-up', 'held-ready');
  await expect(widget).toHaveAttribute('data-blueprint-wind-up-beat', '3');
  await expect(widget.locator('[data-blueprint-primitive="7"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="3"] line')).toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(4450);
  await expect(widget).toHaveAttribute('data-blueprint-wind-up', 'released-danger');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');

  await seek(4900);
  await expect(widget).toHaveAttribute('data-blueprint-wind-up', 'held-recovery');
});

test('wind-up keeps both release reads and actors inside dark RTL mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('ar/mechanics/wind-up/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const timeline = widget.locator('[data-blueprint-timeline]');
  for (const milliseconds of [0, 800, 1420, 1750, 2400, 3200, 3800, 4450, 4900]) {
    await timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
    const bounds = await widget.evaluate((element) => {
      const svg = element.querySelector('svg').getBoundingClientRect();
      return [
        '[data-blueprint-boss]',
        '[data-blueprint-player]',
        '[data-blueprint-boss-label]',
        '[data-blueprint-player-label]',
        '[data-blueprint-primitive="2"]',
        '[data-blueprint-primitive="7"]',
      ].map((selector) => {
        const rect = element.querySelector(selector).getBoundingClientRect();
        return (
          rect.left >= svg.left - 2 &&
          rect.right <= svg.right + 2 &&
          rect.top >= svg.top - 2 &&
          rect.bottom <= svg.bottom + 2
        );
      });
    });
    expect(
      bounds.every(Boolean),
      `actors, promised lane, and buildup runes remain in frame at ${milliseconds}ms`,
    ).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('attack lock follows Tavi before capture and preserves two committed rays', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/attack-lock/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Attack lock');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');

  await seek(800);
  await expect(widget).toHaveAttribute('data-blueprint-attack-lock', 'tracking-first');
  await expect(widget).toHaveAttribute('data-blueprint-aim-locked', 'false');
  await expect(widget.locator('[data-blueprint-primitive="0"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1300);
  await expect(widget).toHaveAttribute('data-blueprint-attack-lock', 'locked-first');
  await expect(widget).toHaveAttribute('data-blueprint-aim-locked', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-aim-x', '390.0');
  await expect(widget).toHaveAttribute('data-blueprint-aim-y', '560.0');
  await expect(widget.locator('[data-blueprint-primitive="1"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1900);
  await expect(widget).toHaveAttribute('data-blueprint-attack-lock', 'released-danger');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="2"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3150);
  await expect(widget).toHaveAttribute('data-blueprint-attack-lock', 'tracking-second');
  await expect(widget).toHaveAttribute('data-blueprint-aim-locked', 'false');

  await seek(3800);
  await expect(widget).toHaveAttribute('data-blueprint-attack-lock', 'locked-second');
  await expect(widget).toHaveAttribute('data-blueprint-aim-x', '180.0');
  await expect(widget).toHaveAttribute('data-blueprint-aim-y', '560.0');

  await seek(4350);
  await expect(widget).toHaveAttribute('data-blueprint-attack-lock', 'released-danger');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');

  await seek(4900);
  await expect(widget).toHaveAttribute('data-blueprint-attack-lock', 'recovery-second');
});

test('attack lock keeps tracking, captured rays, and actors inside dark RTL mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('ar/mechanics/attack-lock/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const timeline = widget.locator('[data-blueprint-timeline]');
  for (const milliseconds of [0, 800, 1300, 1900, 2450, 3150, 3800, 4350, 4900]) {
    await timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
    const bounds = await widget.evaluate((element) => {
      const svg = element.querySelector('svg').getBoundingClientRect();
      return [
        '[data-blueprint-boss]',
        '[data-blueprint-player]',
        '[data-blueprint-boss-label]',
        '[data-blueprint-player-label]',
        '[data-blueprint-primitive="3"]',
        '[data-blueprint-primitive="0"]',
      ].map((selector) => {
        const rect = element.querySelector(selector).getBoundingClientRect();
        return (
          rect.left >= svg.left - 2 &&
          rect.right <= svg.right + 2 &&
          rect.top >= svg.top - 2 &&
          rect.bottom <= svg.bottom + 2
        );
      });
    });
    expect(
      bounds.every(Boolean),
      `actors, aim marker, and committed ray remain in frame at ${milliseconds}ms`,
    ).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('active phase separates startup, live collision, harmless follow-through, and recovery', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/active-phase/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Active phase');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');

  await seek(900);
  await expect(widget).toHaveAttribute('data-blueprint-active-phase', 'startup');
  await expect(widget).toHaveAttribute('data-blueprint-hitbox-active', 'false');
  await expect(widget.locator('[data-blueprint-primitive="3"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1900);
  await expect(widget).toHaveAttribute('data-blueprint-active-phase', 'active');
  await expect(widget).toHaveAttribute('data-blueprint-hitbox-active', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="4"] rect')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2500);
  await expect(widget).toHaveAttribute('data-blueprint-active-phase', 'follow-through');
  await expect(widget).toHaveAttribute('data-blueprint-hitbox-active', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-follow-through', 'true');
  await expect(widget.locator('[data-blueprint-primitive="5"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3280);
  await expect(widget).toHaveAttribute('data-blueprint-active-phase', 'recovery');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');

  await seek(5100);
  await expect(widget).toHaveAttribute('data-blueprint-active-phase', 'reset');
});

test('active phase keeps lane boundaries and both actors inside dark RTL mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('ar/mechanics/active-phase/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const timeline = widget.locator('[data-blueprint-timeline]');
  for (const milliseconds of [0, 900, 1600, 1900, 2180, 2500, 3280, 4500, 5100]) {
    await timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
    const bounds = await widget.evaluate((element) => {
      const svg = element.querySelector('svg').getBoundingClientRect();
      return [
        '[data-blueprint-boss]',
        '[data-blueprint-player]',
        '[data-blueprint-boss-label]',
        '[data-blueprint-player-label]',
        '[data-blueprint-primitive="3"]',
        '[data-blueprint-primitive="7"]',
      ].map((selector) => {
        const rect = element.querySelector(selector).getBoundingClientRect();
        return (
          rect.left >= svg.left - 2 &&
          rect.right <= svg.right + 2 &&
          rect.top >= svg.top - 2 &&
          rect.bottom <= svg.bottom + 2
        );
      });
    });
    expect(
      bounds.every(Boolean),
      `actors and active lane boundaries remain in frame at ${milliseconds}ms`,
    ).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('recovery separates the last active instant, approach budget, punish, and ready event', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/recovery/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Recovery');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');

  await seek(900);
  await expect(widget).toHaveAttribute('data-blueprint-recovery', 'startup');
  await expect(widget.locator('[data-blueprint-primitive="3"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1400);
  await expect(widget).toHaveAttribute('data-blueprint-recovery', 'active');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="4"] rect')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1800);
  await expect(widget).toHaveAttribute('data-blueprint-recovery', 'approach-window');
  await expect(widget).toHaveAttribute('data-blueprint-recovery-locked', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-boss-ready', 'false');
  await expect(widget.locator('[data-blueprint-primitive="5"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3480);
  await expect(widget).toHaveAttribute('data-blueprint-recovery', 'punish-window');
  await expect(widget).toHaveAttribute('data-blueprint-within-punish-reach', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="9"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(4600);
  await expect(widget).toHaveAttribute('data-blueprint-recovery', 'boss-ready');
  await expect(widget).toHaveAttribute('data-blueprint-recovery-locked', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-boss-ready', 'true');
  await expect(widget.locator('[data-blueprint-primitive="8"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
});

test('recovery keeps the attack lane, countdown, and actors inside dark RTL mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('ar/mechanics/recovery/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const timeline = widget.locator('[data-blueprint-timeline]');
  for (const milliseconds of [0, 900, 1280, 1400, 1740, 2400, 3480, 4580, 5200]) {
    await timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
    const bounds = await widget.evaluate((element) => {
      const svg = element.querySelector('svg').getBoundingClientRect();
      return [
        '[data-blueprint-boss]',
        '[data-blueprint-player]',
        '[data-blueprint-boss-label]',
        '[data-blueprint-player-label]',
        '[data-blueprint-primitive="3"]',
        '[data-blueprint-primitive="6"]',
      ].map((selector) => {
        const rect = element.querySelector(selector).getBoundingClientRect();
        return (
          rect.left >= svg.left - 2 &&
          rect.right <= svg.right + 2 &&
          rect.top >= svg.top - 2 &&
          rect.bottom <= svg.bottom + 2
        );
      });
    });
    expect(
      bounds.every(Boolean),
      `actors, lane, and recovery countdown remain in frame at ${milliseconds}ms`,
    ).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('survival phase keeps damage irrelevant until all four timed pulses are cleared', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/survival-phase/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Survival phase');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect(
    await widget
      .locator('[data-blueprint-primitives]')
      .evaluate((element) => element.getBBox().height),
  ).toBeGreaterThan(760);
  await expect(widget.locator('[data-blueprint-primitives] [stroke-dasharray]')).toHaveCount(0);

  await seek(800);
  await expect(widget).toHaveAttribute('data-blueprint-survival-phase', 'read-next');
  await expect(widget).toHaveAttribute('data-blueprint-survival-shielded', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-survival-complete', 'false');
  await expect(widget.locator('[data-blueprint-primitive="2"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="5"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  for (const [milliseconds, state, hazard] of [
    [1200, 'survive-1', '0'],
    [2200, 'survive-2', '1'],
    [3150, 'survive-3', '2'],
    [4100, 'survive-4', '3'],
  ]) {
    await seek(milliseconds);
    await expect(widget).toHaveAttribute('data-blueprint-survival-phase', state);
    await expect(widget).toHaveAttribute('data-blueprint-survival-hazard', hazard);
    await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
    await expect(
      widget.locator(`[data-blueprint-primitive="${5 + Number(hazard)}"] circle`),
    ).not.toHaveAttribute('opacity', '0');
  }

  await seek(4350);
  await expect(widget).toHaveAttribute('data-blueprint-survival-phase', 'survived');
  await expect(widget).toHaveAttribute('data-blueprint-survival-shielded', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-survival-complete', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-survival-remaining', '0.000');
  await expect(widget.locator('[data-blueprint-primitive="9"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(5080);
  await expect(widget).toHaveAttribute('data-blueprint-survival-phase', 'opening');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="10"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );
});

test('survival phase keeps its timer, pulses, and actors inside dark RTL mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('ar/mechanics/survival-phase/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const timeline = widget.locator('[data-blueprint-timeline]');
  for (const milliseconds of [0, 800, 1200, 2200, 3150, 4100, 4350, 5080, 5700]) {
    await timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
    const bounds = await widget.evaluate((element) => {
      const svg = element.querySelector('svg').getBoundingClientRect();
      return [
        '[data-blueprint-boss]',
        '[data-blueprint-player]',
        '[data-blueprint-boss-label]',
        '[data-blueprint-player-label]',
        '[data-blueprint-primitive="0"]',
        '[data-blueprint-primitive="1"]',
      ].map((selector) => {
        const rect = element.querySelector(selector).getBoundingClientRect();
        return (
          rect.left >= svg.left - 2 &&
          rect.right <= svg.right + 2 &&
          rect.top >= svg.top - 2 &&
          rect.bottom <= svg.bottom + 2
        );
      });
    });
    expect(
      bounds.every(Boolean),
      `actors, shield, and survival timer remain in frame at ${milliseconds}ms`,
    ).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('teleport exposes its destination before absence and activates only the fixed follow-up lane', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/teleport/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Teleport');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect(
    await widget
      .locator('[data-blueprint-primitives]')
      .evaluate((element) => element.getBBox().height),
  ).toBeGreaterThan(760);
  await expect(widget.locator('[data-blueprint-primitives] [stroke-dasharray]')).toHaveCount(0);

  await seek(900);
  await expect(widget).toHaveAttribute('data-blueprint-teleport', 'departing');
  await expect(widget).toHaveAttribute('data-blueprint-teleport-destination', 'true');
  await expect(widget.locator('[data-blueprint-primitive="4"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1200);
  await expect(widget).toHaveAttribute('data-blueprint-teleport', 'absent');
  await expect(widget).toHaveAttribute('data-blueprint-teleport-absent', 'true');
  await expect(widget.locator('[data-blueprint-boss]')).toHaveAttribute('opacity', '0');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');

  await seek(1900);
  await expect(widget).toHaveAttribute('data-blueprint-teleport', 'follow-up-tell');
  await expect(widget.locator('[data-blueprint-primitive="5"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="6"] path')).toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2500);
  await expect(widget).toHaveAttribute('data-blueprint-teleport', 'follow-up-danger');
  await expect(widget).toHaveAttribute('data-blueprint-teleport-follow-up', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="6"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3550);
  await expect(widget).toHaveAttribute('data-blueprint-teleport', 'opening');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="8"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );
});

test('teleport keeps both endpoints, the fixed lane, and actors inside dark RTL mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto('ar/mechanics/teleport/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const timeline = widget.locator('[data-blueprint-timeline]');
  for (const milliseconds of [0, 900, 1200, 1600, 1900, 2500, 3550, 5000, 5750]) {
    await timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
    const bounds = await widget.evaluate((element) => {
      const svg = element.querySelector('svg').getBoundingClientRect();
      return [
        '[data-blueprint-boss]',
        '[data-blueprint-player]',
        '[data-blueprint-boss-label]',
        '[data-blueprint-player-label]',
        '[data-blueprint-primitive="1"]',
        '[data-blueprint-primitive="4"]',
      ].map((selector) => {
        const rect = element.querySelector(selector).getBoundingClientRect();
        return (
          rect.left >= svg.left - 2 &&
          rect.right <= svg.right + 2 &&
          rect.top >= svg.top - 2 &&
          rect.bottom <= svg.bottom + 2
        );
      });
    });
    expect(bounds.every(Boolean), `teleport geometry remains in frame at ${milliseconds}ms`).toBe(
      true,
    );
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('boundary attack signals one edge before its fixed crossing and visible outer reset', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/boundary-attack/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Boundary attack');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect(
    await widget
      .locator('[data-blueprint-primitives]')
      .evaluate((element) => element.getBBox().height),
  ).toBeGreaterThan(450);
  expect(
    await widget
      .locator('[data-blueprint-primitives]')
      .evaluate((element) => element.getBBox().height),
  ).toBeLessThan(650);
  await expect(widget.locator('[data-blueprint-primitives] [stroke-dasharray]')).toHaveCount(0);

  await seek(900);
  await expect(widget).toHaveAttribute('data-blueprint-boundary-attack', 'edge-signal');
  await expect(widget).toHaveAttribute('data-blueprint-boundary-signal', 'true');
  await expect(widget.locator('[data-blueprint-primitive="2"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="3"] path')).toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1950);
  await expect(widget).toHaveAttribute('data-blueprint-boundary-attack', 'boundary-crossing');
  await expect(widget).toHaveAttribute('data-blueprint-boundary-crossing', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="3"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3150);
  await expect(widget).toHaveAttribute('data-blueprint-boundary-attack', 'opening');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="7"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(4800);
  await expect(widget).toHaveAttribute('data-blueprint-boundary-attack', 'outer-reset');
  await expect(widget).toHaveAttribute('data-blueprint-boundary-source-outside', 'true');
  await expect(widget.locator('[data-blueprint-primitive="6"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('forced scrolling exposes its fixed pace, lower failure edge, and route-complete opening', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/forced-scrolling/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Forced scrolling');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect(
    await widget
      .locator('[data-blueprint-primitives]')
      .evaluate((element) => element.getBBox().height),
  ).toBeGreaterThan(760);
  await expect(widget.locator('[data-blueprint-primitives] [stroke-dasharray]')).toHaveCount(0);

  await seek(900);
  await expect(widget).toHaveAttribute('data-blueprint-forced-scrolling', 'scroll-signal');
  await expect(widget).toHaveAttribute('data-blueprint-forced-scrolling-active', 'false');
  await expect(widget.locator('[data-blueprint-primitive="5"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="6"] path')).toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2750);
  await expect(widget).toHaveAttribute('data-blueprint-forced-scrolling', 'forced-scroll');
  await expect(widget).toHaveAttribute('data-blueprint-forced-scrolling-active', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  expect(
    Number(await widget.getAttribute('data-blueprint-forced-scrolling-offset')),
  ).toBeGreaterThan(100);
  await expect(widget.locator('[data-blueprint-primitive="6"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(4400);
  await expect(widget).toHaveAttribute('data-blueprint-forced-scrolling', 'route-cleared');
  await expect(widget).toHaveAttribute('data-blueprint-forced-scrolling-cleared', 'true');
  await expect(widget.locator('[data-blueprint-primitive="6"] path')).toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(5050);
  await expect(widget).toHaveAttribute('data-blueprint-forced-scrolling', 'opening');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="13"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('chase herding exposes the pressure band, authored intercept, capture, and delayed opening', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/chase-herding/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Chase herding');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect(
    await widget
      .locator('[data-blueprint-primitives]')
      .evaluate((element) => element.getBBox().height),
  ).toBeGreaterThan(760);
  await expect(widget.locator('[data-blueprint-primitives] [stroke-dasharray]')).toHaveCount(0);

  await seek(900);
  await expect(widget).toHaveAttribute('data-blueprint-chase-herding', 'route-signal');
  await expect(widget).toHaveAttribute('data-blueprint-chase-captured', 'false');
  await expect(widget.locator('[data-blueprint-primitive="1"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="4"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2100);
  await expect(widget).toHaveAttribute('data-blueprint-chase-herding', 'maintain-distance');
  await expect(widget).toHaveAttribute('data-blueprint-chase-in-band', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="6"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="7"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3100);
  await expect(widget).toHaveAttribute('data-blueprint-chase-herding', 'intercept');
  await expect(widget).toHaveAttribute('data-blueprint-chase-intercepted', 'true');
  await expect(widget.locator('[data-blueprint-primitive="11"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3900);
  await expect(widget).toHaveAttribute('data-blueprint-chase-herding', 'captured');
  await expect(widget).toHaveAttribute('data-blueprint-chase-captured', 'true');

  await seek(4720);
  await expect(widget).toHaveAttribute('data-blueprint-chase-herding', 'opening');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="12"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('escape phase exposes its exit tell, progress limit, interruption, and punish opening', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/escape-phase/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Escape phase');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect(
    await widget
      .locator('[data-blueprint-primitives]')
      .evaluate((element) => element.getBBox().height),
  ).toBeGreaterThan(760);
  await expect(widget.locator('[data-blueprint-primitives] [stroke-dasharray]')).toHaveCount(0);

  await seek(800);
  await expect(widget).toHaveAttribute('data-blueprint-escape-phase', 'exit-signal');
  await expect(widget).toHaveAttribute('data-blueprint-escape-active', 'false');
  await expect(widget.locator('[data-blueprint-primitive="8"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="4"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2100);
  await expect(widget).toHaveAttribute('data-blueprint-escape-phase', 'escape-run');
  await expect(widget).toHaveAttribute('data-blueprint-escape-active', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-escape-succeeded', 'false');
  expect(Number(await widget.getAttribute('data-blueprint-escape-progress'))).toBeGreaterThan(0);

  await seek(2850);
  await expect(widget).toHaveAttribute('data-blueprint-escape-phase', 'interrupted');
  await expect(widget).toHaveAttribute('data-blueprint-escape-interrupted', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-escape-interrupt-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="13"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3720);
  await expect(widget).toHaveAttribute('data-blueprint-escape-phase', 'opening');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="14"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('relocated arena previews its destination and preserves encounter state across geometry', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/relocated-arena/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Nested / relocated arena');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect(
    await widget
      .locator('[data-blueprint-primitives]')
      .evaluate((element) => element.getBBox().height),
  ).toBeGreaterThan(760);
  await expect(widget.locator('[data-blueprint-primitives] [stroke-dasharray]')).toHaveCount(0);

  await seek(800);
  await expect(widget).toHaveAttribute('data-blueprint-relocated-arena', 'destination-preview');
  await expect(widget).toHaveAttribute('data-blueprint-relocation-destination', 'true');
  await expect(widget.locator('[data-blueprint-primitive="2"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1700);
  await expect(widget).toHaveAttribute('data-blueprint-relocated-arena', 'transfer');
  await expect(widget).toHaveAttribute('data-blueprint-relocation-active', 'true');

  await seek(2800);
  await expect(widget).toHaveAttribute('data-blueprint-relocated-arena', 'lower-entry');
  await expect(widget).toHaveAttribute('data-blueprint-relocation-lower-active', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-relocation-state-retained', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-relocation-progress', '0.62');

  await seek(3850);
  await expect(widget).toHaveAttribute('data-blueprint-relocated-arena', 'lower-combat');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="16"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(5250);
  await expect(widget).toHaveAttribute('data-blueprint-relocated-arena', 'return-lift');
  await expect(widget.locator('[data-blueprint-primitive="15"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('control mode shift visibly hands free movement to a taught jump contract', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/control-mode-shift/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Control mode shift');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect(
    await widget
      .locator('[data-blueprint-primitives]')
      .evaluate((element) => element.getBBox().height),
  ).toBeGreaterThan(760);
  await expect(widget.locator('[data-blueprint-primitives] [stroke-dasharray]')).toHaveCount(0);

  await seek(800);
  await expect(widget).toHaveAttribute('data-blueprint-control-mode-shift', 'mode-preview');
  await expect(widget).toHaveAttribute('data-blueprint-control-mode-previewed', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-control-mode-active', 'false');

  await seek(1350);
  await expect(widget).toHaveAttribute('data-blueprint-control-mode-shift', 'control-handoff');
  await expect(widget).toHaveAttribute('data-blueprint-control-mode-mapping', 'free-movement');

  await seek(2600);
  await expect(widget).toHaveAttribute('data-blueprint-control-mode-shift', 'jump-mode');
  await expect(widget).toHaveAttribute('data-blueprint-control-mode-active', 'true');
  await expect(widget).toHaveAttribute(
    'data-blueprint-control-mode-mapping',
    'horizontal-and-jump',
  );
  await expect(widget).toHaveAttribute('data-blueprint-control-mode-wave', 'true');
  await expect(widget.locator('[data-blueprint-primitive="14"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3850);
  await expect(widget).toHaveAttribute('data-blueprint-control-mode-shift', 'opening');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');

  await seek(5200);
  await expect(widget).toHaveAttribute('data-blueprint-control-mode-shift', 'free-mode-return');
  await expect(widget).toHaveAttribute('data-blueprint-control-mode-return', 'true');

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('boss as terrain keeps the climb, hold, weak point, and dismount explicit', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/boss-as-terrain/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Boss as terrain');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);

  await seek(800);
  await expect(widget).toHaveAttribute('data-blueprint-boss-as-terrain', 'route-revealed');
  await expect(widget).toHaveAttribute('data-blueprint-terrain-route', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-terrain-mounted', 'false');
  await expect(widget.locator('[data-blueprint-primitive="3"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1500);
  await expect(widget).toHaveAttribute('data-blueprint-boss-as-terrain', 'climbing');
  await expect(widget).toHaveAttribute('data-blueprint-terrain-mounted', 'true');

  await seek(2300);
  await expect(widget).toHaveAttribute('data-blueprint-boss-as-terrain', 'hold-through-shake');
  await expect(widget).toHaveAttribute('data-blueprint-terrain-holding', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  expect(Number(await widget.getAttribute('data-blueprint-terrain-grip'))).toBeLessThan(0.9);
  await expect(widget.locator('[data-blueprint-primitive="8"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3720);
  await expect(widget).toHaveAttribute('data-blueprint-boss-as-terrain', 'weak-point-opening');
  await expect(widget).toHaveAttribute('data-blueprint-terrain-weak-point', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="11"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(4600);
  await expect(widget).toHaveAttribute('data-blueprint-boss-as-terrain', 'safe-drop');
  await expect(widget).toHaveAttribute('data-blueprint-terrain-safe-drop', 'true');
  await expect(widget.locator('[data-blueprint-primitive="9"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="10"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('cover and line of sight visibly stops the beam on the pillar before the counter', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/cover-line-of-sight/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Cover and line of sight');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);

  await seek(1100);
  await expect(widget).toHaveAttribute('data-blueprint-cover-line-of-sight', 'moving-to-cover');
  await expect(widget).toHaveAttribute('data-blueprint-cover-source-locked', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-cover-shadow', 'true');
  await expect(widget.locator('[data-blueprint-primitive="5"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1800);
  await expect(widget).toHaveAttribute('data-blueprint-cover-line-of-sight', 'fully-covered');
  await expect(widget).toHaveAttribute('data-blueprint-cover-occupied', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-cover-beam', 'false');

  await seek(2600);
  await expect(widget).toHaveAttribute('data-blueprint-cover-line-of-sight', 'beam-blocked');
  await expect(widget).toHaveAttribute('data-blueprint-cover-beam', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-cover-blocked', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="12"] line')).toHaveAttribute('x2', '285');
  await expect(widget.locator('[data-blueprint-primitive="14"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3500);
  await expect(widget).toHaveAttribute('data-blueprint-cover-line-of-sight', 'safe-exit');
  await expect(widget).toHaveAttribute('data-blueprint-cover-beam', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-cover-exit', 'true');
  expect(await widget.locator('[data-blueprint-player]').getAttribute('transform')).not.toBe(
    'translate(470 610)',
  );

  await seek(3920);
  await expect(widget).toHaveAttribute('data-blueprint-cover-line-of-sight', 'counter-window');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="15"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('forced inertia previews one endpoint, preserves the slide, and restores control before the counter', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/forced-inertia/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Forced inertia');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);

  await seek(1100);
  await expect(widget).toHaveAttribute('data-blueprint-forced-inertia', 'endpoint-preview');
  await expect(widget).toHaveAttribute('data-blueprint-inertia-frozen', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-inertia-vector', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-inertia-committed', 'false');
  await expect(widget.locator('[data-blueprint-primitive="10"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2200);
  await expect(widget).toHaveAttribute('data-blueprint-forced-inertia', 'unsteerable-slide');
  await expect(widget).toHaveAttribute('data-blueprint-inertia-committed', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-inertia-sliding', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-inertia-speed', '1.000');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="13"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3000);
  await expect(widget).toHaveAttribute('data-blueprint-forced-inertia', 'braking-zone');
  await expect(widget).toHaveAttribute('data-blueprint-inertia-braking', 'true');
  expect(Number(await widget.getAttribute('data-blueprint-inertia-speed'))).toBeGreaterThan(0);
  expect(Number(await widget.getAttribute('data-blueprint-inertia-speed'))).toBeLessThan(1);

  await seek(3500);
  await expect(widget).toHaveAttribute('data-blueprint-forced-inertia', 'control-restored');
  await expect(widget).toHaveAttribute('data-blueprint-inertia-control', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-inertia-speed', '0.000');
  await expect(widget.locator('[data-blueprint-primitive="15"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3720);
  await expect(widget).toHaveAttribute('data-blueprint-forced-inertia', 'counter-window');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="16"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('wraparound projectile signals its linked seams, preserves one shot, and clears before the counter', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/wraparound-projectile/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Wraparound projectile');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);

  await seek(1000);
  await expect(widget).toHaveAttribute('data-blueprint-wraparound-projectile', 'route-preview');
  await expect(widget).toHaveAttribute('data-blueprint-wrap-boundary', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-wrap-route', 'true');
  await expect(widget.locator('[data-blueprint-primitive="6"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1700);
  await expect(widget).toHaveAttribute('data-blueprint-wraparound-projectile', 'first-pass');
  await expect(widget).toHaveAttribute('data-blueprint-wrap-first-pass', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-wrap-lap', '1');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="11"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2300);
  await expect(widget).toHaveAttribute('data-blueprint-wraparound-projectile', 'boundary-crossing');
  await expect(widget).toHaveAttribute('data-blueprint-wrap-crossing', 'true');
  await expect(widget.locator('[data-blueprint-primitive="12"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-primitive="13"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2800);
  await expect(widget).toHaveAttribute('data-blueprint-wraparound-projectile', 'repeat-pass');
  await expect(widget).toHaveAttribute('data-blueprint-wrap-second-pass', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-wrap-lap', '2');

  await seek(3800);
  await expect(widget).toHaveAttribute('data-blueprint-wraparound-projectile', 'corridor-clear');
  await expect(widget).toHaveAttribute('data-blueprint-wrap-first-pass', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-wrap-second-pass', 'false');

  await seek(4220);
  await expect(widget).toHaveAttribute('data-blueprint-wraparound-projectile', 'counter-window');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="15"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('beat-synced attack counts in, lands three lanes on the clock, and exposes the rest', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/beat-synced-attack/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Beat-synced attack');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);

  await seek(600);
  await expect(widget).toHaveAttribute('data-blueprint-beat-synced-attack', 'tempo-count-in');
  await expect(widget).toHaveAttribute('data-blueprint-beat-attack', '0');

  await seek(1300);
  await expect(widget).toHaveAttribute('data-blueprint-beat-synced-attack', 'pattern-cued');
  await expect(widget).toHaveAttribute('data-blueprint-beat-telegraph', '1');
  await expect(widget).toHaveAttribute('data-blueprint-beat-telegraph-lane', '2');
  await expect(widget.locator('[data-blueprint-primitive="20"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1680);
  await expect(widget).toHaveAttribute('data-blueprint-beat-synced-attack', 'beat-strikes');
  await expect(widget).toHaveAttribute('data-blueprint-beat-attack', '1');
  await expect(widget).toHaveAttribute('data-blueprint-beat-attack-lane', '2');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');

  await seek(2280);
  await expect(widget).toHaveAttribute('data-blueprint-beat-attack', '2');
  await expect(widget).toHaveAttribute('data-blueprint-beat-attack-lane', '1');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');

  await seek(2880);
  await expect(widget).toHaveAttribute('data-blueprint-beat-attack', '3');
  await expect(widget).toHaveAttribute('data-blueprint-beat-attack-lane', '0');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');

  await seek(3300);
  await expect(widget).toHaveAttribute('data-blueprint-beat-synced-attack', 'phrase-clear');
  await expect(widget).toHaveAttribute('data-blueprint-beat-phrase-complete', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-beat-attack', '0');

  await seek(4180);
  await expect(widget).toHaveAttribute('data-blueprint-beat-synced-attack', 'counter-window');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="21"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('invisibility replaces the body with bounded traces before a fixed hidden strike', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/secondary-cues-invisibility/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Invisibility');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);

  await seek(700);
  await expect(widget).toHaveAttribute('data-blueprint-secondary-cues-invisibility', 'fading-body');

  await seek(1520);
  await expect(widget).toHaveAttribute(
    'data-blueprint-secondary-cues-invisibility',
    'tracking-secondary-cues',
  );
  await expect(widget).toHaveAttribute('data-blueprint-invisibility-hidden', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-invisibility-cue-count', '3');
  await expect(widget.locator('[data-blueprint-primitive="13"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2400);
  await expect(widget).toHaveAttribute(
    'data-blueprint-secondary-cues-invisibility',
    'hidden-source-locked',
  );
  await expect(widget).toHaveAttribute('data-blueprint-invisibility-source-locked', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-invisibility-attack', 'false');
  await expect(widget.locator('[data-blueprint-primitive="18"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2900);
  await expect(widget).toHaveAttribute(
    'data-blueprint-secondary-cues-invisibility',
    'hidden-strike',
  );
  await expect(widget).toHaveAttribute('data-blueprint-invisibility-attack', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="19"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3250);
  await expect(widget).toHaveAttribute(
    'data-blueprint-secondary-cues-invisibility',
    'reveal-signal',
  );
  await expect(widget).toHaveAttribute('data-blueprint-invisibility-reveal', 'true');

  await seek(4180);
  await expect(widget).toHaveAttribute(
    'data-blueprint-secondary-cues-invisibility',
    'counter-window',
  );
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="21"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('sound detection attacks a recorded event while a quiet player relocates', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/sound-detection/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Sound detection');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);

  await seek(800);
  await expect(widget).toHaveAttribute('data-blueprint-sound-detection', 'quiet-movement');
  await expect(widget).toHaveAttribute('data-blueprint-sound-live-position', 'false');

  await seek(1400);
  await expect(widget).toHaveAttribute('data-blueprint-sound-detection', 'noise-emitted');
  await expect(widget).toHaveAttribute('data-blueprint-sound-noise-visible', 'true');
  await expect(widget.locator('[data-blueprint-primitive="8"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2000);
  await expect(widget).toHaveAttribute(
    'data-blueprint-sound-detection',
    'investigating-last-heard',
  );
  await expect(widget).toHaveAttribute('data-blueprint-sound-heard', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-sound-live-position', 'false');
  await expect(widget.locator('[data-blueprint-primitive="10"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2700);
  await expect(widget).toHaveAttribute('data-blueprint-sound-detection', 'stale-source-locked');
  await expect(widget).toHaveAttribute('data-blueprint-sound-source-locked', 'true');

  await seek(3050);
  await expect(widget).toHaveAttribute('data-blueprint-sound-detection', 'source-attack');
  await expect(widget).toHaveAttribute('data-blueprint-sound-attack', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-primitive="12"] circle')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(4280);
  await expect(widget).toHaveAttribute('data-blueprint-sound-detection', 'counter-window');
  await expect(widget).toHaveAttribute('data-blueprint-punish-strike', 'true');
  await expect(widget.locator('[data-blueprint-primitive="14"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('objective-linked invulnerability requires the complete ledger before damage', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/objective-linked-invulnerability/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText(
    'Objective-linked invulnerability',
  );
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);

  await seek(620);
  await expect(widget).toHaveAttribute(
    'data-blueprint-objective-linked-invulnerability',
    'blocked-check',
  );
  await expect(widget).toHaveAttribute('data-blueprint-objective-blocked', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-objective-shielded', 'true');
  await expect(widget.locator('[data-blueprint-primitive="19"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1300);
  await expect(widget).toHaveAttribute(
    'data-blueprint-objective-linked-invulnerability',
    'first-objective-cleared',
  );
  await expect(widget).toHaveAttribute('data-blueprint-objective-count', '1');

  await seek(2100);
  await expect(widget).toHaveAttribute(
    'data-blueprint-objective-linked-invulnerability',
    'second-objective-cleared',
  );
  await expect(widget).toHaveAttribute('data-blueprint-objective-count', '2');

  await seek(2750);
  await expect(widget).toHaveAttribute(
    'data-blueprint-objective-linked-invulnerability',
    'all-objectives-cleared',
  );
  await expect(widget).toHaveAttribute('data-blueprint-objective-count', '3');
  await expect(widget).toHaveAttribute('data-blueprint-objective-all-complete', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-objective-shielded', 'true');

  await seek(2950);
  await expect(widget).toHaveAttribute(
    'data-blueprint-objective-linked-invulnerability',
    'protection-releasing',
  );
  await expect(widget.locator('[data-blueprint-primitive="16"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3200);
  await expect(widget).toHaveAttribute(
    'data-blueprint-objective-linked-invulnerability',
    'vulnerability-window',
  );
  await expect(widget).toHaveAttribute('data-blueprint-objective-shielded', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-objective-vulnerable', 'true');
  await expect(widget.locator('[data-blueprint-primitive="18"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3460);
  await expect(widget).toHaveAttribute(
    'data-blueprint-objective-linked-invulnerability',
    'boss-hit',
  );
  await expect(widget).toHaveAttribute('data-blueprint-objective-boss-hit', 'true');
  await expect(widget.locator('[data-blueprint-primitive="24"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(4100);
  await expect(widget).toHaveAttribute(
    'data-blueprint-objective-linked-invulnerability',
    'window-closing',
  );
  await expect(widget).toHaveAttribute('data-blueprint-objective-shielded', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-objective-vulnerable', 'false');

  await seek(4500);
  await expect(widget).toHaveAttribute(
    'data-blueprint-objective-linked-invulnerability',
    'protection-restored',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('wave-clear objective seals and empties each finite roster before advancing', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/wave-clear-objective/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Wave-clear objective');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);

  await seek(600);
  await expect(widget).toHaveAttribute('data-blueprint-wave-clear', 'wave-1-preview');
  await expect(widget).toHaveAttribute('data-blueprint-wave-queue-sealed', 'false');

  await seek(900);
  await expect(widget).toHaveAttribute('data-blueprint-wave-clear', 'wave-1-active');
  await expect(widget).toHaveAttribute('data-blueprint-wave', '1');
  await expect(widget).toHaveAttribute('data-blueprint-wave-remaining', '2');
  await expect(widget).toHaveAttribute('data-blueprint-wave-queue-sealed', 'true');
  await expect(widget.locator('[data-blueprint-primitive="15"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1450);
  await expect(widget).toHaveAttribute('data-blueprint-wave-remaining', '0');
  await expect(widget).toHaveAttribute('data-blueprint-wave-roster-empty', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-waves-complete', '0');

  await seek(1650);
  await expect(widget).toHaveAttribute('data-blueprint-wave-clear', 'wave-1-cleared');
  await expect(widget).toHaveAttribute('data-blueprint-wave', '2');
  await expect(widget).toHaveAttribute('data-blueprint-waves-complete', '1');

  await seek(2400);
  await expect(widget).toHaveAttribute('data-blueprint-wave-clear', 'wave-2-active');
  await expect(widget).toHaveAttribute('data-blueprint-wave-remaining', '2');

  await seek(3800);
  await expect(widget).toHaveAttribute('data-blueprint-wave-clear', 'wave-3-active');
  await expect(widget).toHaveAttribute('data-blueprint-waves-complete', '2');
  const firstEnemyWidth = await widget
    .locator('[data-blueprint-primitive="18"] path')
    .evaluate((element) => element.getBBox().width);
  const eliteWidth = await widget
    .locator('[data-blueprint-primitive="19"] path')
    .evaluate((element) => element.getBBox().width);
  expect(eliteWidth).toBeGreaterThan(firstEnemyWidth);

  await seek(4600);
  await expect(widget).toHaveAttribute('data-blueprint-wave-clear', 'all-waves-cleared');
  await expect(widget).toHaveAttribute('data-blueprint-waves-complete', '3');
  await expect(widget).toHaveAttribute('data-blueprint-wave-all-complete', 'true');

  await seek(5100);
  await expect(widget).toHaveAttribute('data-blueprint-wave-clear', 'reward-open');
  await expect(widget).toHaveAttribute('data-blueprint-wave-reward-open', 'true');
  await expect(widget.locator('[data-blueprint-primitive="29"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('environmental weapon powers, aims, fires, and attributes damage to the fixed device', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/environmental-weapon/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Environmental weapon');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);

  await seek(1600);
  await expect(widget).toHaveAttribute('data-blueprint-environmental-powered', 'true');
  await expect(widget.locator('[data-blueprint-primitive="8"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2500);
  await expect(widget).toHaveAttribute('data-blueprint-environmental-reached', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-environmental-weapon', 'device-ready');

  await seek(2700);
  await expect(widget).toHaveAttribute('data-blueprint-environmental-aim-locked', 'false');
  await expect(widget.locator('[data-blueprint-primitive="17"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2950);
  await expect(widget).toHaveAttribute('data-blueprint-environmental-aim-locked', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-environmental-weapon', 'aim-locked');

  await seek(3250);
  await expect(widget).toHaveAttribute('data-blueprint-environmental-fired', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-environmental-boss-damaged', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-environmental-damage-source', 'none');
  await expect(widget.locator('[data-blueprint-primitive="19"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3550);
  await expect(widget).toHaveAttribute('data-blueprint-environmental-boss-damaged', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-environmental-damage-source', 'device');
  await expect(widget.locator('[data-blueprint-primitive="1"] rect')).toHaveAttribute(
    'width',
    '100',
  );

  await seek(3800);
  await expect(widget).toHaveAttribute('data-blueprint-environmental-spent', 'true');
  await expect(widget.locator('[data-blueprint-primitive="22"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('encounter-specific tool is acquired, carried, charged, fired, and restored', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/encounter-specific-tool/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Encounter-specific tool');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);

  await seek(1350);
  await expect(widget).toHaveAttribute('data-blueprint-encounter-tool-reached', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-encounter-tool-package', 'sword');

  await seek(1600);
  await expect(widget).toHaveAttribute('data-blueprint-encounter-tool-equipped', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-encounter-tool-package', 'rune-spear');
  await expect(widget.locator('[data-blueprint-primitive="6"] line')).not.toHaveAttribute(
    'opacity',
    '0',
  );
  await expect(widget.locator('[data-blueprint-player] [data-rig-part="weapon"]')).toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(2500);
  await expect(widget).toHaveAttribute('data-blueprint-encounter-tool-charging', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-encounter-tool-combat-reached', 'true');
  await expect(widget.locator('[data-blueprint-primitive="8"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3000);
  await expect(widget).toHaveAttribute('data-blueprint-encounter-tool-ready', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-encounter-tool', 'tool-ready');

  await seek(3250);
  await expect(widget).toHaveAttribute('data-blueprint-encounter-tool-fired', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-encounter-tool-boss-damaged', 'false');
  await expect(widget.locator('[data-blueprint-primitive="11"] path')).not.toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(3600);
  await expect(widget).toHaveAttribute('data-blueprint-encounter-tool-boss-damaged', 'true');
  await expect(widget).toHaveAttribute(
    'data-blueprint-encounter-tool-damage-source',
    'encounter-tool',
  );
  await expect(widget.locator('[data-blueprint-primitive="1"] rect')).toHaveAttribute(
    'width',
    '110',
  );

  await seek(4800);
  await expect(widget).toHaveAttribute('data-blueprint-encounter-tool-expired', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-encounter-tool-package', 'sword');
  await expect(widget.locator('[data-blueprint-player] [data-rig-part="weapon"]')).toHaveAttribute(
    'opacity',
    '1',
  );

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('player-controlled boss hands a bounded action from a human controller to AI', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/player-controlled-boss/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Player-controlled boss');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);

  await seek(1600);
  await expect(widget).toHaveAttribute('data-blueprint-player-boss-assigned', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-player-boss-controller', 'human');
  await expect(widget).toHaveAttribute('data-blueprint-player-boss-health-preserved', 'true');

  await seek(2300);
  await expect(widget).toHaveAttribute('data-blueprint-player-boss-command', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-player-boss-telegraph', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-player-controlled-boss', 'attack-telegraph');
  await expect(
    widget.locator('path[d="M 266 287 L 334 313 L 129 848 L 61 822 Z"]'),
  ).not.toHaveAttribute('opacity', '0');

  await seek(2800);
  await expect(widget).toHaveAttribute('data-blueprint-player-boss-attack', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-player-controlled-boss', 'attack-active');

  await seek(3700);
  await expect(widget).toHaveAttribute('data-blueprint-player-boss-heartbeat-lost', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-player-boss-frozen', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-player-boss-controller', 'none');

  await seek(4100);
  await expect(widget).toHaveAttribute('data-blueprint-player-boss-ai-takeover', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-player-boss-controller', 'ai');
  await expect(widget).toHaveAttribute('data-blueprint-player-boss-reward-grants', '0');

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('projectile rally keeps one accelerating orb and opens only after the boss miss', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/projectile-rally/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Projectile rally');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);

  await seek(900);
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally', 'boss-serve');
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally-id', 'rune-orb-1');
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally-owner', 'boss');
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally-speed', '1');

  await seek(1600);
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally-id', 'rune-orb-1');
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally-owner', 'player');
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally-exchanges', '1');

  await seek(2200);
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally-owner', 'boss');
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally-speed', '2');

  await seek(3200);
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally-owner', 'player');
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally-speed', '3');
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally-exchanges', '5');

  await seek(3600);
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally', 'boss-miss');
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally-miss', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally-vulnerable', 'true');
  await expect(widget).toHaveAttribute(
    'data-blueprint-projectile-rally-damage-source',
    'rally-orb',
  );

  await seek(4000);
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally-punished', 'true');
  await expect(
    widget.locator('[data-blueprint-primitives] path[d^="M 283 303"]'),
  ).not.toHaveAttribute('opacity', '0');

  await seek(4700);
  await expect(widget).toHaveAttribute('data-blueprint-projectile-rally-vulnerable', 'false');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('baited self-hit locks the charge, consumes one rune, and separates the sword punish', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/baited-self-hit/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Baited self-hit');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);

  await seek(900);
  await expect(widget).toHaveAttribute('data-blueprint-baited-self-hit', 'armed');
  await expect(widget).toHaveAttribute('data-blueprint-bait-trap-id', 'quarry-rune-1');
  await expect(widget).toHaveAttribute('data-blueprint-bait-trap-armed', 'true');

  await seek(1450);
  await expect(widget).toHaveAttribute('data-blueprint-bait-target-acquired', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-bait-target-locked', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-bait-charge', 'false');

  await seek(1800);
  await expect(widget).toHaveAttribute('data-blueprint-baited-self-hit', 'charging');
  await expect(widget).toHaveAttribute('data-blueprint-bait-charge', 'true');
  await seek(2200);
  await expect(widget).toHaveAttribute('data-blueprint-bait-player-clear', 'true');

  await seek(2500);
  await expect(widget).toHaveAttribute('data-blueprint-bait-boss-contact', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-bait-collision-pair', 'kern|quarry-rune-1');
  await expect(widget).toHaveAttribute('data-blueprint-bait-self-hit', 'false');

  await seek(2700);
  await expect(widget).toHaveAttribute('data-blueprint-bait-trap-consumed', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-bait-self-hit', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-bait-vulnerable', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-bait-damage-source', 'prepared-hazard');
  await expect(widget).toHaveAttribute('data-blueprint-bait-reward-grants', '1');

  await seek(3300);
  await expect(widget).toHaveAttribute('data-blueprint-bait-punished', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-bait-reward-grants', '1');

  await seek(4500);
  await expect(widget).toHaveAttribute('data-blueprint-bait-vulnerable', 'false');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('posture gauge visibly recovers, breaks, and advances only through one finisher', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/posture-stagger-gauge/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Posture stagger gauge');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);

  await seek(800);
  await expect(widget).toHaveAttribute('data-blueprint-posture-stagger-gauge', 'pressure-started');
  await expect(widget).toHaveAttribute('data-blueprint-posture-value', '32');
  await expect(widget).toHaveAttribute('data-blueprint-posture-health-changed', 'false');

  await seek(1200);
  await expect(widget).toHaveAttribute(
    'data-blueprint-posture-stagger-gauge',
    'recovering-posture',
  );
  await expect(widget).toHaveAttribute('data-blueprint-posture-recovering', 'true');
  expect(Number(await widget.getAttribute('data-blueprint-posture-value'))).toBeLessThan(32);

  await seek(2700);
  await expect(widget).toHaveAttribute('data-blueprint-posture-stagger-gauge', 'posture-broken');
  await expect(widget).toHaveAttribute('data-blueprint-posture-value', '100');
  await expect(widget).toHaveAttribute('data-blueprint-posture-break-id', 'posture-break-1');
  await expect(widget).toHaveAttribute('data-blueprint-posture-reward-grants', '0');

  await seek(2900);
  await expect(widget).toHaveAttribute('data-blueprint-posture-critical-ready', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-posture-finisher-eligible', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-posture-phase-tokens', '3');

  await seek(3500);
  await expect(widget).toHaveAttribute('data-blueprint-posture-finisher-consumed', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-posture-critical-ready', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-posture-phase-tokens', '2');
  await expect(widget).toHaveAttribute('data-blueprint-posture-reward-grants', '1');
  await expect(widget).toHaveAttribute('data-blueprint-posture-health-changed', 'true');

  await seek(4100);
  await expect(widget).toHaveAttribute('data-blueprint-posture-reward-grants', '1');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('pacifist resolution survives three lanes and records spared without defeat', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/pacifist-resolution/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Pacifist resolution');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);

  await seek(1000);
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-resolution', 'restraint-threat-1');
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-attack', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-boss-health', '100');
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-offensive-events', '0');
  await expect(widget.locator('[data-blueprint-player] [data-rig-part="weapon"]')).toHaveAttribute(
    'opacity',
    '0',
  );

  await seek(1800);
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-resolution', 'restraint-threat-2');
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-attack', 'true');

  await seek(2300);
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-resolution', 'restraint-threat-3');
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-attack', 'true');

  await seek(2700);
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-resolution', 'condition-complete');
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-progress', '100');
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-condition-complete', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-spared', 'false');

  await seek(2900);
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-choice-offered', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-defeated', 'false');

  await seek(3500);
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-spare-committed', 'true');
  await expect(widget).toHaveAttribute(
    'data-blueprint-pacifist-resolution-id',
    'pacifist-resolution-1',
  );
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-reward-grants', '0');

  await seek(4200);
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-spared', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-defeated', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-boss-health', '100');
  await expect(widget).toHaveAttribute('data-blueprint-pacifist-reward-grants', '1');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('persistent progress restores two committed anchors before one final result', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/persistent-progress/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Persistent encounter progress');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);

  await seek(1050);
  await expect(widget).toHaveAttribute('data-blueprint-persistent-progress', 'checkpoint-1');
  await expect(widget).toHaveAttribute('data-blueprint-persistent-objectives', '1');
  await expect(widget).toHaveAttribute('data-blueprint-persistent-revision', '1');
  await seek(1200);
  await expect(widget).toHaveAttribute('data-blueprint-persistent-player-alive', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-persistent-hazard', 'true');

  await seek(1900);
  await expect(widget).toHaveAttribute('data-blueprint-persistent-attempt', '2');
  await expect(widget).toHaveAttribute('data-blueprint-persistent-objectives', '1');
  await expect(widget).toHaveAttribute('data-blueprint-persistent-boss-health', '100');
  await seek(2750);
  await expect(widget).toHaveAttribute('data-blueprint-persistent-objectives', '2');
  await expect(widget).toHaveAttribute('data-blueprint-persistent-player-alive', 'false');

  await seek(3500);
  await expect(widget).toHaveAttribute('data-blueprint-persistent-attempt', '3');
  await expect(widget).toHaveAttribute('data-blueprint-persistent-retries', '2');
  await expect(widget).toHaveAttribute('data-blueprint-persistent-core-open', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-persistent-snapshot-version', '1');

  await seek(4300);
  await expect(widget).toHaveAttribute('data-blueprint-persistent-objectives', '3');
  await expect(widget).toHaveAttribute(
    'data-blueprint-persistent-result-id',
    'persistent-progress-1',
  );
  await expect(widget).toHaveAttribute('data-blueprint-persistent-reward-grants', '1');
  await expect(widget).toHaveAttribute('data-blueprint-persistent-boss-health', '0');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('status buildup decays, crosses once, and ignores contact during immunity', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/status-buildup/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Status buildup');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);

  await seek(720);
  await expect(widget).toHaveAttribute('data-blueprint-status-value', '38');
  await expect(widget).toHaveAttribute('data-blueprint-status-contact', 'true');
  await seek(1720);
  await expect(widget).toHaveAttribute('data-blueprint-status-value', '14');
  await seek(2200);
  await expect(widget).toHaveAttribute('data-blueprint-status-value', '55');
  await seek(2800);
  await expect(widget).toHaveAttribute('data-blueprint-status-value', '100');
  await expect(widget).toHaveAttribute('data-blueprint-status-threshold', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-status-effect', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-status-effect-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-status-effect-id', 'status-effect-1');
  await seek(4050);
  await expect(widget).toHaveAttribute('data-blueprint-status-value', '0');
  await expect(widget).toHaveAttribute('data-blueprint-status-immune', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-status-ignored-contacts', '1');
  await expect(widget).toHaveAttribute('data-blueprint-status-effect-count', '1');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('instant kill avoids one seal then resolves one terminal result without damage', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/instant-kill/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Instant-kill condition');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await seek(1000);
  await expect(widget).toHaveAttribute('data-blueprint-instant-kill-first-avoided', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-instant-kill-result-count', '0');
  await seek(2650);
  await expect(widget).toHaveAttribute('data-blueprint-instant-kill-condition-locked', 'true');
  await expect(widget).toHaveAttribute(
    'data-blueprint-instant-kill-condition',
    'inside-execution-seal',
  );
  await seek(2900);
  await expect(widget).toHaveAttribute('data-blueprint-instant-kill-executed', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-instant-kill-health-before', '100');
  await expect(widget).toHaveAttribute('data-blueprint-instant-kill-damage', '0');
  await expect(widget).toHaveAttribute('data-blueprint-instant-kill-result-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-instant-kill-result-id', 'instant-kill-1');
  await seek(3200);
  await expect(widget).toHaveAttribute('data-blueprint-instant-kill-attempt-ended', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-instant-kill-target-alive', 'false');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('maximum health reduction shows an avoided cut, a smaller cap, blocked healing, and cleanse', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/maximum-health-reduction/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Maximum-health reduction');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect((await widget.boundingBox()).height).toBeGreaterThan(800);
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await seek(1050);
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-first-avoided', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-maximum', '100');
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-cap-events', '0');
  await seek(2700);
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-damage', '20');
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-cap-events', '1');
  await seek(3100);
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-current', '60');
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-maximum', '65');
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-reduced', 'true');
  await seek(3720);
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-current', '65');
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-maximum', '65');
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-heal-requested', '40');
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-heal-applied', '5');
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-heal-blocked', '35');
  await seek(4960);
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-current', '100');
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-maximum', '100');
  await expect(widget).toHaveAttribute('data-blueprint-maximum-health-restored', 'true');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('ability lock rejects one verb, keeps attack available, and restores healing on expiry', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/ability-lock/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Ability or healing lock');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await seek(1200);
  await expect(widget).toHaveAttribute('data-blueprint-ability-lock-first-avoided', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-ability-lock-current-health', '63');
  await seek(2660);
  await expect(widget).toHaveAttribute('data-blueprint-ability-lock-heal-locked', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-ability-lock-current-health', '55');
  await seek(3200);
  await expect(widget).toHaveAttribute('data-blueprint-ability-lock-heal-requested', '20');
  await expect(widget).toHaveAttribute('data-blueprint-ability-lock-heal-applied', '0');
  await expect(widget).toHaveAttribute('data-blueprint-ability-lock-rejected-inputs', '1');
  await expect(widget).toHaveAttribute('data-blueprint-ability-lock-status-id', 'healing-lock-1');
  await seek(3700);
  await expect(widget).toHaveAttribute('data-blueprint-ability-lock-attack-available', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-ability-lock-movement-available', 'true');
  await seek(4860);
  await expect(widget).toHaveAttribute('data-blueprint-ability-lock-heal-locked', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-ability-lock-current-health', '75');
  await expect(widget).toHaveAttribute('data-blueprint-ability-lock-heal-success-count', '2');
  await expect(widget).toHaveAttribute('data-blueprint-ability-lock-status-id', 'none');
  expect((await widget.boundingBox()).height).toBeGreaterThan(850);
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await seek(900);
  const playerLabel = await widget.locator('[data-blueprint-player-label]').boundingBox();
  const phaseLabel = await widget.locator('[data-blueprint-current-phase]').boundingBox();
  expect(playerLabel.y + playerLabel.height).toBeLessThan(phaseLabel.y - 12);
});

test('resource steal preserves the ledger through drop, reclaim, and boss capture', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/resource-steal/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Resource steal or drop');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await seek(1100);
  await expect(widget).toHaveAttribute('data-blueprint-resource-steal-first-avoided', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-resource-steal-player', '6');
  await seek(2640);
  await expect(widget).toHaveAttribute('data-blueprint-resource-steal-dropped', '3');
  await expect(widget).toHaveAttribute('data-blueprint-resource-steal-world', '3');
  await expect(widget).toHaveAttribute('data-blueprint-resource-steal-drop-events', '1');
  await seek(3480);
  await expect(widget).toHaveAttribute('data-blueprint-resource-steal-player', '4');
  await expect(widget).toHaveAttribute('data-blueprint-resource-steal-reclaimed', '1');
  await expect(widget).toHaveAttribute('data-blueprint-resource-steal-world', '2');
  await seek(3900);
  await expect(widget).toHaveAttribute('data-blueprint-resource-steal-captured', '2');
  await expect(widget).toHaveAttribute('data-blueprint-resource-steal-world', '0');
  await expect(widget).toHaveAttribute('data-blueprint-resource-steal-total', '6');
  await expect(widget).toHaveAttribute('data-blueprint-resource-steal-conserved', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-resource-steal-benefit-events', '1');
  await expect(widget).toHaveAttribute(
    'data-blueprint-resource-steal-token-owners',
    'player,boss,boss',
  );
  expect((await widget.boundingBox()).height).toBeGreaterThan(850);
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const playerLabel = await widget.locator('[data-blueprint-player-label]').boundingBox();
  const phaseLabel = await widget.locator('[data-blueprint-current-phase]').boundingBox();
  expect(playerLabel.y + playerLabel.height).toBeLessThan(phaseLabel.y - 12);
});

test('on-hit healing separates a blocked contact from applied damage and ignores misses', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/on-hit-healing/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('On-hit healing or lifesteal');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await seek(1100);
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-first-missed', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-boss-health', '48');
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-event-count', '0');
  await seek(2700);
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-blocked-contact', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-contact-qualified', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-damage', '0');
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-event-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-blocked-counts', 'true');
  await seek(3100);
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-boss-health', '64');
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-requested', '16');
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-applied', '16');
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-result-id', 'on-hit-heal-1');
  await seek(4100);
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-third-missed', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-miss-counts', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-event-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-on-hit-healing-boss-health', '64');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(
    (await widget.locator('.blueprint-demo__canvas').boundingBox()).height,
  ).toBeGreaterThanOrEqual(812);
  await seek(1200);
  const canvas = await widget.locator('.blueprint-demo__canvas').boundingBox();
  const player = await widget.locator('[data-blueprint-player]').boundingBox();
  const playerLabel = await widget.locator('[data-blueprint-player-label]').boundingBox();
  expect(player.x + player.width).toBeLessThanOrEqual(canvas.x + canvas.width);
  expect(playerLabel.x + playerLabel.width).toBeLessThanOrEqual(canvas.x + canvas.width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('self-heal cast cancels the first channel and resolves the second exactly once', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/self-heal-cast/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Interruptible self-heal');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await seek(1550);
  await expect(widget).toHaveAttribute('data-blueprint-self-heal-cast-first-interrupted', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-self-heal-cast-boss-health', '38');
  await expect(widget).toHaveAttribute('data-blueprint-self-heal-cast-event-count', '0');
  await expect(widget).toHaveAttribute('data-blueprint-self-heal-cast-interrupt-count', '1');
  await seek(3500);
  await expect(widget).toHaveAttribute('data-blueprint-self-heal-cast-channel-active', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-self-heal-cast-completed', 'false');
  await seek(4350);
  await expect(widget).toHaveAttribute('data-blueprint-self-heal-cast-completed', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-self-heal-cast-healing', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-self-heal-cast-event-count', '1');
  await seek(4700);
  await expect(widget).toHaveAttribute('data-blueprint-self-heal-cast-boss-health', '62');
  await expect(widget).toHaveAttribute('data-blueprint-self-heal-cast-requested', '24');
  await expect(widget).toHaveAttribute('data-blueprint-self-heal-cast-applied', '24');
  await expect(widget).toHaveAttribute(
    'data-blueprint-self-heal-cast-result-id',
    'self-heal-cast-1',
  );
  await expect(widget).toHaveAttribute('data-blueprint-self-heal-cast-event-count', '1');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('external healing source cancels one packet and resolves one surviving delivery', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/external-healing-source/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Interceptable healing sources');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await seek(1550);
  await expect(widget).toHaveAttribute(
    'data-blueprint-external-healing-source-first-destroyed',
    'true',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-external-healing-source-first-packet-cancelled',
    'true',
  );
  await expect(widget).toHaveAttribute('data-blueprint-external-healing-source-active-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-external-healing-source-boss-health', '42');
  await expect(widget).toHaveAttribute('data-blueprint-external-healing-source-event-count', '0');
  await seek(3500);
  await expect(widget).toHaveAttribute(
    'data-blueprint-external-healing-source-second-packet-active',
    'true',
  );
  await expect(widget).toHaveAttribute('data-blueprint-external-healing-source-delivered', 'false');
  await seek(4250);
  await expect(widget).toHaveAttribute('data-blueprint-external-healing-source-delivered', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-external-healing-source-healing', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-external-healing-source-event-count', '1');
  await seek(4700);
  await expect(widget).toHaveAttribute('data-blueprint-external-healing-source-boss-health', '60');
  await expect(widget).toHaveAttribute('data-blueprint-external-healing-source-requested', '18');
  await expect(widget).toHaveAttribute('data-blueprint-external-healing-source-applied', '18');
  await expect(widget).toHaveAttribute(
    'data-blueprint-external-healing-source-source-id',
    'healing-source-2',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-external-healing-source-result-id',
    'external-heal-healing-source-2',
  );
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('damage-rate cap compresses a burst and restores the next hit after decay', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/damage-rate-cap/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Adaptive damage-rate cap');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await seek(950);
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-hit-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-raw', '18');
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-applied', '18');
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-boss-health', '82');
  await seek(3200);
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-burst-active', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-hit-count', '5');
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-applied', '5');
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-prevented', '13');
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-multiplier', '0.250');
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-boss-health', '44');
  await seek(4600);
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-window-recovered', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-recent', '0');
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-multiplier', '1.000');
  await seek(5000);
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-hit-count', '6');
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-applied', '18');
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-boss-health', '26');
  await expect(widget).toHaveAttribute('data-blueprint-damage-rate-cap-last-hit-id', 'recovered-1');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('loadout mirror keeps the captured package after the player changes loadout', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/loadout-mirror/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Loadout mirror');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await seek(1300);
  await expect(widget).toHaveAttribute('data-blueprint-loadout-mirror-snapshot-captured', 'true');
  await expect(widget).toHaveAttribute(
    'data-blueprint-loadout-mirror-copied-loadout',
    'sword,ward,ember',
  );
  await expect(widget).toHaveAttribute('data-blueprint-loadout-mirror-snapshot-events', '1');
  await seek(2800);
  await expect(widget).toHaveAttribute('data-blueprint-loadout-mirror-player-changed', 'true');
  await expect(widget).toHaveAttribute(
    'data-blueprint-loadout-mirror-player-loadout',
    'bow,dash,frost',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-loadout-mirror-copied-loadout',
    'sword,ward,ember',
  );
  await expect(widget).toHaveAttribute('data-blueprint-loadout-mirror-live-resnapshots', '0');
  await seek(3600);
  await expect(widget).toHaveAttribute(
    'data-blueprint-loadout-mirror-boss-used-copied-attack',
    'true',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-loadout-mirror-boss-package',
    'sword+ward+ember',
  );
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('moveset shapeshifting exposes complete ordered package handoffs', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/moveset-shapeshifting/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Moveset shapeshifting');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await seek(800);
  await expect(widget).toHaveAttribute('data-blueprint-moveset-shapeshifting-form', 'colossus');
  await expect(widget).toHaveAttribute(
    'data-blueprint-moveset-shapeshifting-package',
    'colossus-slam',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-moveset-shapeshifting-attack-active',
    'true',
  );
  await seek(1900);
  await expect(widget).toHaveAttribute(
    'data-blueprint-moveset-shapeshifting-transition-active',
    'true',
  );
  await seek(2600);
  await expect(widget).toHaveAttribute('data-blueprint-moveset-shapeshifting-form', 'serpent');
  await expect(widget).toHaveAttribute(
    'data-blueprint-moveset-shapeshifting-package',
    'serpent-lane',
  );
  await expect(widget).toHaveAttribute('data-blueprint-moveset-shapeshifting-change-count', '1');
  await seek(4400);
  await expect(widget).toHaveAttribute('data-blueprint-moveset-shapeshifting-form', 'oracle');
  await expect(widget).toHaveAttribute(
    'data-blueprint-moveset-shapeshifting-package',
    'oracle-fan',
  );
  await expect(widget).toHaveAttribute('data-blueprint-moveset-shapeshifting-change-count', '2');
  await expect(widget).toHaveAttribute('data-blueprint-moveset-shapeshifting-package-scope', '3');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('enrage fills the forge and keeps its core lit after the volley', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/enrage/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  expect(
    await widget
      .locator('[data-blueprint-primitives]')
      .evaluate((element) => element.getBBox().height),
  ).toBeGreaterThan(760);
  await expect(widget.locator('[data-blueprint-primitives] [stroke-dasharray]')).toHaveCount(0);

  await seek(3500);
  await expect(widget.locator('[data-blueprint-primitive="4"] line')).toHaveAttribute(
    'opacity',
    '1',
  );
  await seek(5200);
  await expect(widget.locator('[data-blueprint-primitive="2"] path')).toHaveAttribute(
    'opacity',
    '1',
  );
  await expect(widget.locator('[data-blueprint-primitive="3"] path')).toHaveAttribute(
    'opacity',
    '1',
  );
  await expect(widget.locator('[data-blueprint-primitive="4"] line')).toHaveAttribute(
    'opacity',
    '0',
  );
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('ally theft exposes one bounded ownership transfer and safe restoration', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/ally-theft/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Ally theft and charm');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await seek(800);
  await expect(widget).toHaveAttribute('data-blueprint-ally-theft-owner', 'player');
  await expect(widget).toHaveAttribute('data-blueprint-ally-theft-marked', 'true');
  await seek(1400);
  await expect(widget).toHaveAttribute('data-blueprint-ally-theft-owner', 'boss');
  await expect(widget).toHaveAttribute('data-blueprint-ally-theft-capture-id', 'ally-capture-1');
  await expect(widget).toHaveAttribute('data-blueprint-ally-theft-ownership-events', '1');
  await seek(2400);
  await expect(widget).toHaveAttribute('data-blueprint-ally-theft-hostile', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-ally-theft-command-count', '2');
  await seek(3800);
  await expect(widget).toHaveAttribute('data-blueprint-ally-theft-owner', 'neutral');
  await expect(widget).toHaveAttribute(
    'data-blueprint-ally-theft-release-reason',
    'duration-complete',
  );
  await seek(4900);
  await expect(widget).toHaveAttribute('data-blueprint-ally-theft-owner', 'player');
  await expect(widget).toHaveAttribute('data-blueprint-ally-theft-ownership-events', '2');
  await expect(widget).toHaveAttribute('data-blueprint-ally-theft-recapture-blocked', 'true');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('false death keeps rewards locked while one revival establishes phase two', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/false-death/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('False death and return');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await seek(900);
  await expect(widget).toHaveAttribute('data-blueprint-false-death', 'phase-one-depleted');
  await expect(widget).toHaveAttribute('data-blueprint-false-death-boss-health', '0');
  await expect(widget).toHaveAttribute('data-blueprint-false-death-completion-pending', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-false-death-encounter-complete', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-false-death-reward-locked', 'true');
  await seek(2500);
  await expect(widget).toHaveAttribute('data-blueprint-false-death-rebuild-active', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-false-death-revival-count', '0');
  await seek(3500);
  await expect(widget).toHaveAttribute('data-blueprint-false-death-phase', '2');
  await expect(widget).toHaveAttribute('data-blueprint-false-death-boss-health', '68');
  await expect(widget).toHaveAttribute('data-blueprint-false-death-revived', 'true');
  await expect(widget).toHaveAttribute(
    'data-blueprint-false-death-revival-id',
    'false-death-revival-1',
  );
  await expect(widget).toHaveAttribute('data-blueprint-false-death-event-count', '2');
  await expect(widget).toHaveAttribute('data-blueprint-false-death-exit-locked', 'true');
  await seek(4200);
  await expect(widget).toHaveAttribute('data-blueprint-false-death-second-attack', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('action-reactive punish locks one response and preserves the committed recovery window', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/action-reactive-punish/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Action-reactive punish');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await seek(900);
  await expect(widget).toHaveAttribute(
    'data-blueprint-action-reactive-punish',
    'response-signaled',
  );
  await expect(widget).toHaveAttribute('data-blueprint-action-reactive-punish-observed', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-action-reactive-punish-queued', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-action-reactive-punish-event-count', '1');
  await seek(1550);
  await expect(widget).toHaveAttribute('data-blueprint-action-reactive-punish-committed', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-action-reactive-punish-projectile', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(4200);
  await expect(widget).toHaveAttribute('data-blueprint-action-reactive-punish-safe-window', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-action-reactive-punish-safe-action', 'true');
  await expect(widget).toHaveAttribute(
    'data-blueprint-action-reactive-punish-boss-available',
    'false',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-action-reactive-punish-rejection',
    'boss-busy',
  );
  await expect(widget).toHaveAttribute('data-blueprint-action-reactive-punish-response-count', '1');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('run-history manifestation keeps one captured journal stable through retry', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/run-history-manifestation/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Run-history manifestation');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await seek(1550);
  await expect(widget).toHaveAttribute(
    'data-blueprint-run-history-manifestation',
    'manifest-captured',
  );
  await expect(widget).toHaveAttribute('data-blueprint-run-history-manifestation-captured', 'true');
  await expect(widget).toHaveAttribute(
    'data-blueprint-run-history-manifestation-manifest-id',
    'run-manifest-echo-ward-relic-1',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-run-history-manifestation-history-count',
    '3',
  );
  await expect(widget).toHaveAttribute('data-blueprint-run-history-manifestation-echo-count', '1');
  await expect(widget).toHaveAttribute(
    'data-blueprint-run-history-manifestation-support-count',
    '1',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-run-history-manifestation-modifier-count',
    '1',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-run-history-manifestation-capture-events',
    '1',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-run-history-manifestation-live-resnapshots',
    '0',
  );
  await seek(2550);
  await expect(widget).toHaveAttribute('data-blueprint-run-history-manifestation', 'echo-active');
  await expect(widget).toHaveAttribute(
    'data-blueprint-run-history-manifestation-echo-active',
    'true',
  );
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(3450);
  await expect(widget).toHaveAttribute('data-blueprint-run-history-manifestation', 'relic-active');
  await expect(widget).toHaveAttribute(
    'data-blueprint-run-history-manifestation-relic-active',
    'true',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-run-history-manifestation-ward-protecting',
    'true',
  );
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(4950);
  await expect(widget).toHaveAttribute('data-blueprint-run-history-manifestation', 'retry-stable');
  await expect(widget).toHaveAttribute(
    'data-blueprint-run-history-manifestation-retry-stable',
    'true',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-run-history-manifestation-manifest-unchanged',
    'true',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-run-history-manifestation-manifest-id',
    'run-manifest-echo-ward-relic-1',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-run-history-manifestation-live-resnapshots',
    '0',
  );
  await page.setViewportSize({ width: 375, height: 812 });
  await seek(2550);
  const canvas = await widget.locator('.blueprint-demo__canvas').boundingBox();
  const playerLabel = await widget.locator('[data-blueprint-player-label]').boundingBox();
  expect(playerLabel.x + playerLabel.width).toBeLessThanOrEqual(canvas.x + canvas.width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('real-time progression reconciles a bounded interval once before resuming combat', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/real-time-progression/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Real-time progression');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await seek(1400);
  await expect(widget).toHaveAttribute('data-blueprint-real-time-progression', 'game-closed');
  await expect(widget).toHaveAttribute('data-blueprint-real-time-progression-closed', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-real-time-progression-reconciled', 'false');
  await seek(2100);
  await expect(widget).toHaveAttribute('data-blueprint-real-time-progression', 'time-reconciling');
  await expect(widget).toHaveAttribute(
    'data-blueprint-real-time-progression-checkpoint-id',
    'kern-clock-vault-1',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-real-time-progression-reconciliation-id',
    'offline-reconcile-1',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-real-time-progression-authority',
    'trusted-server',
  );
  await expect(widget).toHaveAttribute('data-blueprint-real-time-progression-elapsed-hours', '7');
  await expect(widget).toHaveAttribute('data-blueprint-real-time-progression-applied-hours', '6');
  await expect(widget).toHaveAttribute('data-blueprint-real-time-progression-capped', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-real-time-progression-event-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-real-time-progression-live-ticks', '0');
  await expect(widget).toHaveAttribute('data-blueprint-real-time-progression-boss-tier', '2');
  await expect(widget).toHaveAttribute(
    'data-blueprint-real-time-progression-offline-hazard-count',
    '2',
  );
  await seek(3500);
  await expect(widget).toHaveAttribute(
    'data-blueprint-real-time-progression',
    'progression-active',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-real-time-progression-attack-active',
    'true',
  );
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(4950);
  await expect(widget).toHaveAttribute('data-blueprint-real-time-progression', 'retry-stable');
  await expect(widget).toHaveAttribute('data-blueprint-real-time-progression-retry-stable', 'true');
  await expect(widget).toHaveAttribute(
    'data-blueprint-real-time-progression-progression-unchanged',
    'true',
  );
  await expect(widget).toHaveAttribute('data-blueprint-real-time-progression-event-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-real-time-progression-live-ticks', '0');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('interface interaction pauses danger and confirms one accessible route before combat resumes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/interface-interaction/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Interface interaction');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await seek(800);
  await expect(widget).toHaveAttribute(
    'data-blueprint-interface-interaction',
    'normal-action-blocked',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-interface-interaction-normal-attempt-blocked',
    'true',
  );
  await expect(widget).toHaveAttribute('data-blueprint-interface-interaction-ward-reading', 'true');
  await seek(1800);
  await expect(widget).toHaveAttribute('data-blueprint-interface-interaction', 'route-switching');
  await expect(widget).toHaveAttribute('data-blueprint-interface-interaction-paused', 'true');
  await expect(widget).toHaveAttribute(
    'data-blueprint-interface-interaction-focus-outside',
    'true',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-interface-interaction-hostile-ticks-while-paused',
    '0',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-interface-interaction-fallback-available',
    'true',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-interface-interaction-destructive-action-count',
    '0',
  );
  await seek(2200);
  await expect(widget).toHaveAttribute('data-blueprint-interface-interaction', 'route-confirmed');
  await expect(widget).toHaveAttribute(
    'data-blueprint-interface-interaction-selected-route',
    'channel-b',
  );
  await expect(widget).toHaveAttribute('data-blueprint-interface-interaction-confirmed', 'true');
  await expect(widget).toHaveAttribute(
    'data-blueprint-interface-interaction-confirmation-count',
    '1',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-interface-interaction-private-payload-stored',
    'false',
  );
  await seek(3000);
  await expect(widget).toHaveAttribute('data-blueprint-interface-interaction', 'opening-active');
  await expect(widget).toHaveAttribute(
    'data-blueprint-interface-interaction-opening-active',
    'true',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-interface-interaction-ward-reading',
    'false',
  );
  await seek(3900);
  await expect(widget).toHaveAttribute('data-blueprint-interface-interaction', 'counter-active');
  await expect(widget).toHaveAttribute(
    'data-blueprint-interface-interaction-counter-active',
    'true',
  );
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(4900);
  await expect(widget).toHaveAttribute('data-blueprint-interface-interaction', 'retry-safe');
  await expect(widget).toHaveAttribute(
    'data-blueprint-interface-interaction-route-restored',
    'true',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-interface-interaction-confirmation-count',
    '1',
  );
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('world-state variant snapshots one package and keeps it stable when outside context changes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/world-state-variant/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('World-state encounter variant');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await seek(900);
  await expect(widget).toHaveAttribute('data-blueprint-world-state-variant', 'snapshot-captured');
  await expect(widget).toHaveAttribute(
    'data-blueprint-world-state-variant-snapshot-captured',
    'true',
  );
  await expect(widget).toHaveAttribute('data-blueprint-world-state-variant-snapshot-count', '1');
  await expect(widget).toHaveAttribute(
    'data-blueprint-world-state-variant-selected-time-band',
    'eclipse',
  );
  await seek(1700);
  await expect(widget).toHaveAttribute('data-blueprint-world-state-variant', 'variant-ready');
  await expect(widget).toHaveAttribute(
    'data-blueprint-world-state-variant-variant-id',
    'eclipse-ruin',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-world-state-variant-package-materialized',
    'true',
  );
  await expect(widget).toHaveAttribute('data-blueprint-world-state-variant-hazard-count', '2');
  await expect(widget).toHaveAttribute('data-blueprint-world-state-variant-modifier-count', '2');
  await seek(2500);
  await expect(widget).toHaveAttribute('data-blueprint-world-state-variant', 'variant-active');
  await expect(widget).toHaveAttribute('data-blueprint-world-state-variant-attack-active', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(3800);
  await expect(widget).toHaveAttribute('data-blueprint-world-state-variant', 'reward-mapped');
  await expect(widget).toHaveAttribute(
    'data-blueprint-world-state-variant-reward-table-id',
    'eclipse-relic-table',
  );
  await expect(widget).toHaveAttribute('data-blueprint-world-state-variant-reward-mapped', 'true');
  await seek(4900);
  await expect(widget).toHaveAttribute('data-blueprint-world-state-variant', 'retry-stable');
  await expect(widget).toHaveAttribute(
    'data-blueprint-world-state-variant-outside-time-band',
    'dawn',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-world-state-variant-selected-time-band',
    'eclipse',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-world-state-variant-variant-unchanged',
    'true',
  );
  await expect(widget).toHaveAttribute('data-blueprint-world-state-variant-live-resnapshots', '0');
  await page.setViewportSize({ width: 375, height: 812 });
  const canvas = await widget.locator('.blueprint-demo__canvas').boundingBox();
  const playerLabel = await widget.locator('[data-blueprint-player-label]').boundingBox();
  expect(playerLabel.x + playerLabel.width).toBeLessThanOrEqual(canvas.x + canvas.width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('party-size scaling applies roster changes only at safe boundaries and keeps earned reward credit', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/party-size-scaling/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Party-size scaling');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await seek(800);
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling', 'join-queued');
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-join-queued', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-party-size', '1');
  await seek(1400);
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling', 'party-scaled');
  await expect(widget).toHaveAttribute(
    'data-blueprint-party-size-scaling-resolution-id',
    'party-scale-join-1',
  );
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-party-size', '2');
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-max-health', '1600');
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-current-health', '1088');
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-health-fraction', '0.68');
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-target-slots', '2');
  await seek(2500);
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling', 'scaled-attack-active');
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-attack-active', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(3500);
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling', 'leave-queued');
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-leave-queued', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-party-size', '2');
  await seek(3900);
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling', 'party-recomputed');
  await expect(widget).toHaveAttribute(
    'data-blueprint-party-size-scaling-resolution-id',
    'party-scale-leave-1',
  );
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-party-size', '1');
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-max-health', '1000');
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-current-health', '680');
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-health-fraction', '0.68');
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-application-count', '2');
  await expect(widget).toHaveAttribute(
    'data-blueprint-party-size-scaling-progress-reversed',
    'false',
  );
  await seek(4200);
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling', 'eligibility-settled');
  await expect(widget).toHaveAttribute(
    'data-blueprint-party-size-scaling-eligibility-settled',
    'true',
  );
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-reward-share-count', '2');
  await seek(4700);
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling', 'retry-stable');
  await expect(widget).toHaveAttribute('data-blueprint-party-size-scaling-party-size', '1');
  await expect(widget).toHaveAttribute(
    'data-blueprint-party-size-scaling-mid-attack-applications',
    '0',
  );
  await page.setViewportSize({ width: 375, height: 812 });
  await seek(2500);
  const canvas = await widget.locator('.blueprint-demo__canvas').boundingBox();
  const player = await widget.locator('[data-blueprint-player]').boundingBox();
  const playerLabel = await widget.locator('[data-blueprint-player-label]').boundingBox();
  expect(
    (await widget.locator('.blueprint-demo__canvas').boundingBox()).height,
  ).toBeGreaterThanOrEqual(812);
  expect(player.x + player.width).toBeLessThanOrEqual(canvas.x + canvas.width);
  expect(playerLabel.x + playerLabel.width).toBeLessThanOrEqual(canvas.x + canvas.width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('partner revival shows both bodies, interrupt, pair completion, and clean retry', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/partner-revival/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Partner revival');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget.locator('[data-blueprint-decoy]')).toHaveCount(1);
  await expect(widget.locator('[data-blueprint-partner-label]')).toHaveCount(1);
  await seek(1200);
  await expect(widget).toHaveAttribute('data-blueprint-partner-revival', 'revive-channel-one');
  await expect(widget).toHaveAttribute('data-blueprint-partner-revival-partner-downed', 'true');
  await seek(1800);
  await expect(widget).toHaveAttribute('data-blueprint-partner-revival', 'partner-revived');
  await expect(widget).toHaveAttribute(
    'data-blueprint-partner-revival-revived-health-fraction',
    '0.4',
  );
  await expect(widget).toHaveAttribute('data-blueprint-partner-revival-revive-grant-count', '1');
  await seek(3040);
  await expect(widget).toHaveAttribute('data-blueprint-partner-revival', 'revive-channel-two');
  await expect(widget).toHaveAttribute(
    'data-blueprint-partner-revival-attempt-id',
    'partner-revive-2',
  );
  await seek(3300);
  await expect(widget).toHaveAttribute('data-blueprint-partner-revival', 'revive-interrupted');
  await expect(widget).toHaveAttribute('data-blueprint-partner-revival-interrupted', 'true');
  await expect(widget).toHaveAttribute(
    'data-blueprint-partner-revival-interrupt-lock-active',
    'true',
  );
  await seek(4100);
  await expect(widget).toHaveAttribute(
    'data-blueprint-partner-revival-completion-authorized',
    'true',
  );
  await expect(widget).toHaveAttribute('data-blueprint-partner-revival-completion-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-partner-revival-duplicate-grant-count', '0');
  await seek(4700);
  await expect(widget).toHaveAttribute('data-blueprint-partner-revival', 'retry-stable');
  await expect(widget).toHaveAttribute('data-blueprint-partner-revival-completion-count', '0');
  await page.setViewportSize({ width: 375, height: 812 });
  const canvas = await widget.locator('.blueprint-demo__canvas').boundingBox();
  const player = await widget.locator('[data-blueprint-player]').boundingBox();
  const playerLabel = await widget.locator('[data-blueprint-player-label]').boundingBox();
  expect(canvas.height).toBeGreaterThanOrEqual(812);
  expect(player.x + player.width).toBeLessThanOrEqual(canvas.x + canvas.width);
  expect(playerLabel.x + playerLabel.width).toBeLessThanOrEqual(canvas.x + canvas.width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('kill-order inheritance previews two distinct survivor attacks with a clean retry', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/kill-order-inheritance/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Kill-order inheritance');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget.locator('[data-blueprint-decoy]')).toHaveCount(1);
  await expect(widget.locator('[data-blueprint-partner-label]')).toHaveCount(1);
  await seek(1400);
  await expect(widget).toHaveAttribute(
    'data-blueprint-kill-order-inheritance',
    'right-inherits-wave',
  );
  await expect(widget).toHaveAttribute('data-blueprint-kill-order-inheritance-left-down', 'true');
  await seek(2200);
  await expect(widget).toHaveAttribute('data-blueprint-kill-order-inheritance', 'wave-active');
  await expect(widget).toHaveAttribute(
    'data-blueprint-kill-order-inheritance-source-boss-id',
    'echo-kern',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-kill-order-inheritance-survivor-boss-id',
    'kern',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-kill-order-inheritance-inherited-package',
    'rune-wave',
  );
  await expect(widget).toHaveAttribute('data-blueprint-kill-order-inheritance-grant-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-kill-order-inheritance-wave-active', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(2800);
  await expect(widget).toHaveAttribute('data-blueprint-kill-order-inheritance', 'explicit-retry');
  await expect(widget).toHaveAttribute(
    'data-blueprint-kill-order-inheritance-retry-transition',
    'true',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-kill-order-inheritance-inherited-package',
    'none',
  );
  await expect(widget).toHaveAttribute('data-blueprint-kill-order-inheritance-grant-count', '0');
  await seek(4700);
  await expect(widget).toHaveAttribute('data-blueprint-kill-order-inheritance', 'lance-active');
  await expect(widget).toHaveAttribute(
    'data-blueprint-kill-order-inheritance-attempt-id',
    'inheritance-attempt-2',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-kill-order-inheritance-source-boss-id',
    'kern',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-kill-order-inheritance-survivor-boss-id',
    'echo-kern',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-kill-order-inheritance-inherited-package',
    'rune-lance',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-kill-order-inheritance-lance-active',
    'true',
  );
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget).toHaveAttribute(
    'data-blueprint-kill-order-inheritance-completion-count',
    '0',
  );
  await expect(widget).toHaveAttribute(
    'data-blueprint-kill-order-inheritance-duplicate-grant-count',
    '0',
  );
  await page.setViewportSize({ width: 375, height: 812 });
  const canvas = await widget.locator('.blueprint-demo__canvas').boundingBox();
  const player = await widget.locator('[data-blueprint-player]').boundingBox();
  const playerLabel = await widget.locator('[data-blueprint-player-label]').boundingBox();
  expect(canvas.height).toBeGreaterThanOrEqual(812);
  expect(player.x + player.width).toBeLessThanOrEqual(canvas.x + canvas.width);
  expect(playerLabel.x + playerLabel.width).toBeLessThanOrEqual(canvas.x + canvas.width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('shared group health preserves one bar through absence, return, completion, and retry', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/shared-group-health/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Shared group health');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget.locator('[data-blueprint-decoy]')).toHaveCount(1);
  await expect(widget.locator('[data-blueprint-partner-label]')).toHaveCount(1);
  await seek(800);
  await expect(widget).toHaveAttribute('data-blueprint-shared-group-health-current-health', '72');
  await expect(widget.locator('[data-blueprint-group-health-label]')).toHaveText('72 / 100');
  await seek(2200);
  await expect(widget).toHaveAttribute('data-blueprint-shared-group-health-left-present', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-shared-group-health', 'first-lane-active');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(3200);
  await expect(widget).toHaveAttribute('data-blueprint-shared-group-health-left-present', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-shared-group-health-current-health', '72');
  await seek(3550);
  await expect(widget).toHaveAttribute('data-blueprint-shared-group-health-current-health', '39');
  await seek(4400);
  await expect(widget).toHaveAttribute('data-blueprint-shared-group-health', 'second-lane-active');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(5100);
  await expect(widget).toHaveAttribute('data-blueprint-shared-group-health-current-health', '0');
  await expect(widget.locator('[data-blueprint-group-health-label]')).toHaveText('0 / 100');
  await expect(widget).toHaveAttribute('data-blueprint-shared-group-health-completion-count', '1');
  await seek(5600);
  await expect(widget).toHaveAttribute('data-blueprint-shared-group-health-current-health', '100');
  await expect(widget.locator('[data-blueprint-group-health-label]')).toHaveText('100 / 100');
  await expect(widget).toHaveAttribute('data-blueprint-shared-group-health-completion-count', '0');
  await expect(widget).toHaveAttribute('data-blueprint-shared-group-health-retry', 'true');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(
    (await widget.locator('.blueprint-demo__canvas').boundingBox()).height,
  ).toBeGreaterThanOrEqual(812);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('coordinated duo attack overlaps one target and cancels the second follow-up', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/coordinated-duo-attack/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Coordinated duo attack');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget.locator('[data-blueprint-decoy]')).toHaveCount(1);
  await expect(widget.locator('[data-blueprint-partner-label]')).toHaveCount(1);
  await seek(1500);
  await expect(widget).toHaveAttribute(
    'data-blueprint-coordinated-duo-attack',
    'shared-target-signaled',
  );
  await seek(2300);
  await expect(widget).toHaveAttribute('data-blueprint-coordinated-duo-attack', 'overlapping-legs');
  await expect(widget).toHaveAttribute('data-blueprint-coordinated-duo-attack-followup-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(3580);
  await expect(widget).toHaveAttribute(
    'data-blueprint-coordinated-duo-attack-resolution',
    'interrupted',
  );
  await seek(4000);
  await expect(widget).toHaveAttribute(
    'data-blueprint-coordinated-duo-attack-followup-cancelled',
    'true',
  );
  await expect(widget).toHaveAttribute('data-blueprint-coordinated-duo-attack-followup-count', '0');
  await seek(5500);
  await expect(widget).toHaveAttribute('data-blueprint-coordinated-duo-attack-retry', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-coordinated-duo-attack-followup-count', '0');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(
    (await widget.locator('.blueprint-demo__canvas').boundingBox()).height,
  ).toBeGreaterThanOrEqual(812);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('stack damage gathers three players for one split, then exposes the lone failure', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/stack-damage/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Shared-damage stack');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget.locator('[data-blueprint-ally]')).toHaveCount(2);
  await seek(2050);
  await expect(widget).toHaveAttribute('data-blueprint-stack-damage', 'three-in-marker');
  await expect(widget).toHaveAttribute('data-blueprint-stack-damage-participant-count', '3');
  await seek(2350);
  await expect(widget).toHaveAttribute('data-blueprint-stack-damage-share', '30');
  await expect(widget).toHaveAttribute('data-blueprint-stack-damage-health', '70');
  await expect(widget).toHaveAttribute('data-blueprint-stack-damage-application-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-stack-readout]')).toHaveText('90 ÷ 3 = 30');
  await seek(4350);
  await expect(widget).toHaveAttribute('data-blueprint-stack-damage-participant-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-stack-damage-share', '90');
  await expect(widget).toHaveAttribute('data-blueprint-stack-damage-health', '0');
  await expect(widget.locator('[data-blueprint-stack-health="0"]')).toHaveText('0');
  await expect(widget.locator('[data-blueprint-player]')).toHaveAttribute('transform', /rotate\(/);
  await expect(widget).toHaveAttribute('data-blueprint-stack-damage-solo-failure', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'danger');
  await expect(widget.locator('[data-blueprint-stack-readout]')).toHaveText('90 ÷ 1 = 90');
  await seek(5500);
  await expect(widget).toHaveAttribute('data-blueprint-stack-damage-retry', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-stack-damage-health', '100');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(
    (await widget.locator('.blueprint-demo__canvas').boundingBox()).height,
  ).toBeGreaterThanOrEqual(812);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('personal spread separates marked bodies before a safe hit and counts crowded hits', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/personal-spread/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Personal spread');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget.locator('[data-blueprint-ally]')).toHaveCount(2);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await seek(2350);
  await expect(widget).toHaveAttribute('data-blueprint-personal-spread', 'one-hit-each');
  await expect(widget).toHaveAttribute('data-blueprint-personal-spread-hit-counts', '1/1/1');
  await expect(widget).toHaveAttribute('data-blueprint-personal-spread-health', '75/75/75');
  await expect(widget).toHaveAttribute('data-blueprint-personal-spread-application-count', '3');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-spread-readout]')).toHaveText('1 / 1 / 1');
  await seek(4400);
  await expect(widget).toHaveAttribute('data-blueprint-personal-spread-hit-counts', '3/2/2');
  await expect(widget).toHaveAttribute('data-blueprint-personal-spread-health', '0/25/25');
  await expect(widget).toHaveAttribute('data-blueprint-personal-spread-failure', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'danger');
  await expect(widget.locator('[data-blueprint-player]')).toHaveAttribute('transform', /rotate\(/);
  await seek(5500);
  await expect(widget).toHaveAttribute('data-blueprint-personal-spread-retry', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-personal-spread-health', '100/100/100');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(
    (await widget.locator('.blueprint-demo__canvas').boundingBox()).height,
  ).toBeGreaterThanOrEqual(812);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('tower soak counts fixed-point occupants and distinguishes personal cost from raidwide failure', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/tower-soak/');
  const widget = page.locator('[data-blueprint-demo]');
  await expect(widget).toHaveAttribute('data-blueprint-screen-height', 'true');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Tower soak');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget.locator('[data-blueprint-ally]')).toHaveCount(1);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await seek(2350);
  await expect(widget).toHaveAttribute('data-blueprint-tower-soak-occupancy', '1/1');
  await expect(widget).toHaveAttribute('data-blueprint-tower-soak-succeeded', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-tower-soak-health', '85/100');
  await expect(widget).toHaveAttribute('data-blueprint-tower-soak-application-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-tower-readout]')).toHaveText('1 / 1');
  await seek(4450);
  await expect(widget).toHaveAttribute('data-blueprint-tower-soak-occupancy', '1/2');
  await expect(widget).toHaveAttribute('data-blueprint-tower-soak-succeeded', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-tower-soak-health', '0/10');
  await expect(widget).toHaveAttribute('data-blueprint-tower-soak-application-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-tower-soak-failure', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'danger');
  await expect(widget.locator('[data-blueprint-tower-readout]')).toHaveText('1 / 2');
  await seek(5500);
  await expect(widget).toHaveAttribute('data-blueprint-tower-soak-retry', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-tower-soak-health', '100/100');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(
    (await widget.locator('.blueprint-demo__canvas').boundingBox()).height,
  ).toBeGreaterThanOrEqual(812);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('entity tether keeps a coordinated pair and breaks when the distance limit is exceeded', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/entity-tether/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Entity tether');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget.locator('[data-blueprint-ally]')).toHaveCount(1);
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await seek(2350);
  await expect(widget).toHaveAttribute('data-blueprint-entity-tether-held', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-entity-tether-health', '100/100');
  await expect(widget).toHaveAttribute('data-blueprint-entity-tether-application-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-tether-readout]')).toContainText('/ 150');
  await seek(4450);
  await expect(widget).toHaveAttribute('data-blueprint-entity-tether-broken', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-entity-tether-health', '10/10');
  await expect(widget).toHaveAttribute('data-blueprint-entity-tether-application-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'danger');
  await expect(widget.locator('[data-blueprint-tether-readout]')).toContainText('308 / 150');
  await seek(5500);
  await expect(widget).toHaveAttribute('data-blueprint-entity-tether-retry', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-entity-tether-health', '100/100');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('gaze check reads Tavi’s visible facing at each warned pulse', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/gaze-check/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Gaze check');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await seek(2300);
  await expect(widget).toHaveAttribute('data-blueprint-gaze-looking', 'false');
  await expect(widget).toHaveAttribute('data-blueprint-gaze-health', '100');
  await expect(widget).toHaveAttribute('data-blueprint-gaze-application-count', '0');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await expect(widget.locator('[data-blueprint-gaze-facing]')).toHaveText('90° / -90°');
  await expect(
    widget.locator('[data-blueprint-player] [data-rig-part="back-head"]'),
  ).toHaveAttribute('opacity', '0');
  await seek(4400);
  await expect(widget).toHaveAttribute('data-blueprint-gaze-looking', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-gaze-health', '10');
  await expect(widget).toHaveAttribute('data-blueprint-gaze-application-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-gaze-failure', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'danger');
  await expect(
    widget.locator('[data-blueprint-player] [data-rig-part="back-head"]'),
  ).toHaveAttribute('opacity', '1');
  await seek(5500);
  await expect(widget).toHaveAttribute('data-blueprint-gaze-retry', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-gaze-health', '100');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('proximity damage keeps the rune fixed and makes distance change a nonzero hit', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/proximity-damage/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Proximity damage');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await seek(2300);
  await expect(widget).toHaveAttribute('data-blueprint-proximity-hit-id', 'distance-pulse-1');
  await expect(widget).toHaveAttribute('data-blueprint-proximity-distance', '410');
  await expect(widget).toHaveAttribute('data-blueprint-proximity-damage', '13');
  await expect(widget).toHaveAttribute('data-blueprint-proximity-health', '87');
  await expect(widget).toHaveAttribute('data-blueprint-proximity-application-count', '1');
  await expect(widget.locator('[data-blueprint-proximity-readout]')).toHaveText('410 → 13');
  await seek(4400);
  await expect(widget).toHaveAttribute('data-blueprint-proximity-hit-id', 'distance-pulse-2');
  await expect(widget).toHaveAttribute('data-blueprint-proximity-distance', '180');
  await expect(widget).toHaveAttribute('data-blueprint-proximity-damage', '79');
  await expect(widget).toHaveAttribute('data-blueprint-proximity-health', '8');
  await expect(widget).toHaveAttribute('data-blueprint-proximity-application-count', '2');
  await expect(widget.locator('[data-blueprint-proximity-readout]')).toHaveText('180 → 79');
  await seek(5500);
  await expect(widget).toHaveAttribute('data-blueprint-proximity-retry', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-proximity-health', '100');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('tank swap visibly hands boss focus to a second defender before the repeat', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/tank-swap/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Tankbuster and target handoff');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget.locator('[data-blueprint-ally]')).toHaveCount(1);
  await seek(2300);
  await expect(widget).toHaveAttribute('data-blueprint-tank-owner', 'tavi');
  await expect(widget).toHaveAttribute('data-blueprint-tank-hit-id', 'buster-1');
  await expect(widget).toHaveAttribute('data-blueprint-tank-health', '65,100');
  await expect(widget).toHaveAttribute('data-blueprint-tank-vulnerability', '1,0');
  await expect(widget).toHaveAttribute('data-blueprint-tank-application-count', '1');
  await seek(3550);
  await expect(widget).toHaveAttribute('data-blueprint-tank-owner', 'ally');
  await seek(4650);
  await expect(widget).toHaveAttribute('data-blueprint-tank-hit-id', 'buster-2');
  await expect(widget).toHaveAttribute('data-blueprint-tank-health', '65,65');
  await expect(widget).toHaveAttribute('data-blueprint-tank-vulnerability', '1,1');
  await expect(widget).toHaveAttribute('data-blueprint-tank-failed-damage', '95');
  await expect(widget).toHaveAttribute('data-blueprint-tank-application-count', '2');
  await expect(widget).toHaveAttribute('data-blueprint-outcome', 'safe');
  await seek(5550);
  await expect(widget).toHaveAttribute('data-blueprint-tank-retry', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-tank-health', '100,100');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('debuff handoff shows one rune moving between eligible carriers before each deadline', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/debuff-handoff/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);
  await expect(page.locator('.lesson-title-line h1')).toHaveText('Debuff handoff');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget.locator('[data-blueprint-ally]')).toHaveCount(1);
  await seek(2100);
  await expect(widget).toHaveAttribute('data-blueprint-handoff-owner', 'player-1');
  await expect(widget).toHaveAttribute('data-blueprint-handoff-transfer-count', '0');
  await seek(2300);
  await expect(widget).toHaveAttribute('data-blueprint-handoff-owner', 'player-2');
  await expect(widget).toHaveAttribute('data-blueprint-handoff-transfer-count', '1');
  await expect(widget).toHaveAttribute('data-blueprint-handoff-immunity', 'true,false');
  await expect(widget.locator('[data-blueprint-handoff-timer]')).toHaveText('3.0 s');
  await seek(4500);
  await expect(widget).toHaveAttribute('data-blueprint-handoff-owner', 'player-1');
  await expect(widget).toHaveAttribute('data-blueprint-handoff-transfer-count', '2');
  await expect(widget).toHaveAttribute('data-blueprint-handoff-failed-damage', '80');
  await seek(5600);
  await expect(widget).toHaveAttribute('data-blueprint-handoff-retry', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-handoff-transfer-count', '0');
  await page.goto('ar/mechanics/debuff-handoff/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('ordered targets display three fixed numbered recipients and advance one strike at a time', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/ordered-targets/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Ordered targets');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget.locator('[data-blueprint-ally]')).toHaveCount(2);
  await expect(widget.locator('[data-blueprint-order-mark]')).toHaveText(['1', '2', '3']);
  await seek(1800);
  await expect(widget).toHaveAttribute('data-blueprint-order-next', '1');
  await expect(widget).toHaveAttribute('data-blueprint-order-resolved', '0');
  await seek(2050);
  await expect(widget).toHaveAttribute('data-blueprint-order-next', '2');
  await expect(widget).toHaveAttribute('data-blueprint-order-hit-id', 'strike-1');
  await seek(3250);
  await expect(widget).toHaveAttribute('data-blueprint-order-next', '3');
  await expect(widget).toHaveAttribute('data-blueprint-order-resolved', '2');
  await seek(4450);
  await expect(widget).toHaveAttribute('data-blueprint-order-next', '4');
  await expect(widget).toHaveAttribute('data-blueprint-order-resolved', '3');
  await seek(5600);
  await expect(widget).toHaveAttribute('data-blueprint-order-next', '0');
  await expect(widget).toHaveAttribute('data-blueprint-order-retry', 'true');

  await page.goto('ar/mechanics/ordered-targets/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('pairing polarity shows four signs, two opposite pairs and a single reset', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/pairing-polarity/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Pairing polarity');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(5);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget.locator('[data-blueprint-ally]')).toHaveCount(3);
  await expect(widget.locator('[data-blueprint-polarity-mark]')).toHaveText(['+', '+', '−', '−']);
  await seek(800);
  await expect(widget).toHaveAttribute('data-blueprint-polarity-state', 'pair');
  await seek(2200);
  await expect(widget).toHaveAttribute('data-blueprint-polarity-state', 'hold');
  await seek(3160);
  await expect(widget).toHaveAttribute('data-blueprint-polarity-success', 'true');
  await expect(widget).toHaveAttribute(
    'data-blueprint-polarity-pairs',
    'player-1+player-3,player-2+player-4',
  );
  await expect(widget).toHaveAttribute('data-blueprint-polarity-failed-damage', '70');
  await seek(5600);
  await expect(widget).toHaveAttribute('data-blueprint-polarity-retry', 'true');

  await page.goto('ar/mechanics/pairing-polarity/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('party split shows independent side progress, a shared gate and reunion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('en/mechanics/party-split/');
  const widget = page.locator('[data-blueprint-demo]');
  const timeline = widget.locator('[data-blueprint-timeline]');
  const seek = (milliseconds) =>
    timeline.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, milliseconds);

  await expect(page.locator('.lesson-title-line h1')).toHaveText('Party split');
  await expect(page.locator('.wip-badge, .draft-profile')).toHaveCount(0);
  await expect(page.locator('.game-example')).toHaveCount(3);
  await expect(page.locator('.lens-chip')).toHaveCount(4);
  await expect(widget).toHaveAttribute('data-blueprint-full-height', 'true');
  await expect(widget).toHaveAttribute('data-blueprint-playing', 'false');
  await expect(widget.locator('[data-blueprint-ally]')).toHaveCount(3);
  await seek(2700);
  await expect(widget).toHaveAttribute('data-blueprint-split-completed', 'left');
  await expect(widget).toHaveAttribute('data-blueprint-split-gate-open', 'false');
  await expect(widget.locator('[data-blueprint-split-gate]')).toHaveText('1 / 2');
  await seek(3500);
  await expect(widget).toHaveAttribute('data-blueprint-split-completed', 'left,right');
  await expect(widget).toHaveAttribute('data-blueprint-split-gate-open', 'true');
  await expect(widget.locator('[data-blueprint-split-gate]')).toHaveText('✓');
  await seek(4900);
  await expect(widget).toHaveAttribute('data-blueprint-split-reunited', 'true');
  await seek(5600);
  await expect(widget).toHaveAttribute('data-blueprint-split-retry', 'true');

  await page.goto('ar/mechanics/party-split/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
