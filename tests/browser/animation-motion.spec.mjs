import { test, expect } from '@playwright/test';
import { ATTACK_DURATION, PHASE_ENDS } from '../../src/charge-model.mjs';
import { PATTERN_PHASE_ENDS } from '../../src/pattern-model.mjs';

const lessons = ['charge', 'sweep', 'ground-slam', 'summon', 'gap-volley'];
const familyOf = (lesson) => (lesson === 'charge' ? 'charge' : 'pattern');

async function openLesson(page, lesson, locale = 'en') {
  const family = familyOf(lesson);
  await page.goto(`${locale}/mechanics/${lesson}/`);
  await expect(page.locator(`[data-${family}-demo]`)).toHaveAttribute(
    `data-${family}-ready`,
    'true',
  );
  return family;
}

async function seek(page, family, seconds) {
  await page.locator(`[data-${family}-timeline]`).evaluate(
    (timeline, milliseconds) => {
      timeline.value = String(milliseconds);
      timeline.dispatchEvent(new Event('input', { bubbles: true }));
    },
    Math.round(seconds * 1000),
  );
}

async function characterState(page, family, role) {
  return page.locator(`[data-${family}-${role}]`).evaluate((character) => {
    const matrix = character.getCTM();
    return {
      world: { a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d },
      position: character.getAttribute('transform'),
      parts: Object.fromEntries(
        [...character.querySelectorAll('[data-rig-part]')].map((part) => [
          part.dataset.rigPart,
          part.getAttribute('transform'),
        ]),
      ),
    };
  });
}

function expectUpright(state) {
  // Direction changes belong to the rig; the world anchor must not spin the sprite.
  expect(state.world.b).toBeCloseTo(0, 6);
  expect(state.world.c).toBeCloseTo(0, 6);
  expect(state.world.a).toBeGreaterThan(0);
  expect(state.world.d).toBeGreaterThan(0);
}

function expectArticulated(stationary, moving) {
  expect(stationary.parts).toHaveProperty('body');
  expect(moving.parts.body).not.toEqual(stationary.parts.body);
  const movingJoints = Object.keys(moving.parts).filter(
    (part) =>
      /arm|leg|foot|head|weapon|cloak|scarf/.test(part) &&
      moving.parts[part] !== stationary.parts[part],
  );
  expect(movingJoints.length, 'limbs animate independently of the body').toBeGreaterThanOrEqual(2);
}

async function arenaBounds(element) {
  return element.evaluate((content) => {
    const contentBox = content.getBoundingClientRect();
    const arenaBox = content.ownerSVGElement.getBoundingClientRect();
    return {
      width: contentBox.width,
      height: contentBox.height,
      contained:
        contentBox.left >= arenaBox.left &&
        contentBox.right <= arenaBox.right &&
        contentBox.top >= arenaBox.top &&
        contentBox.bottom <= arenaBox.bottom,
    };
  });
}

for (const lesson of lessons) {
  test(`${lesson}: characters articulate without spinning and seeking reproduces the pose`, async ({
    page,
  }) => {
    const family = await openLesson(page, lesson);
    await seek(page, family, 0);
    const stationary = {
      boss: await characterState(page, family, 'boss'),
      player: await characterState(page, family, 'player'),
    };
    const movementTime =
      lesson === 'charge' ? (PHASE_ENDS[0] + PHASE_ENDS[1]) / 2 : PATTERN_PHASE_ENDS[0] / 2;
    const attackTime =
      lesson === 'charge'
        ? PHASE_ENDS[1] + 0.25
        : ['ground-slam', 'gap-volley'].includes(lesson)
          ? PATTERN_PHASE_ENDS[0] + 0.14
          : (PATTERN_PHASE_ENDS[0] + PATTERN_PHASE_ENDS[1]) / 2;

    await seek(page, family, movementTime);
    const movingPlayer = await characterState(page, family, 'player');
    expect(movingPlayer.position).not.toEqual(stationary.player.position);
    expectArticulated(stationary.player, movingPlayer);
    await seek(page, family, attackTime);
    const attackingBoss = await characterState(page, family, 'boss');
    expectArticulated(stationary.boss, attackingBoss);

    const checkpoints =
      lesson === 'charge'
        ? [0, movementTime, attackTime, ATTACK_DURATION - 0.1, ATTACK_DURATION + attackTime]
        : [0, movementTime, attackTime, PATTERN_PHASE_ENDS[2] - 0.1];
    for (const time of checkpoints) {
      await seek(page, family, time);
      for (const role of ['boss', 'player'])
        expectUpright(await characterState(page, family, role));
    }

    await seek(page, family, movementTime);
    expect(await characterState(page, family, 'player')).toEqual(movingPlayer);
    await seek(page, family, attackTime);
    expect(await characterState(page, family, 'boss')).toEqual(attackingBoss);
  });
}

test('ground slam gauntlet lands at the stone wave origin', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openLesson(page, 'ground-slam');
  const gauntlet = page.locator(
    '[data-pattern-boss] [data-rig-part="arm-front"] [data-slam-gauntlet]',
  );
  await expect(gauntlet).toHaveCount(1);
  await seek(page, 'pattern', 1.87);
  const contact = await gauntlet.evaluate((piece) => {
    const svg = piece.ownerSVGElement;
    const toArena = svg.getScreenCTM().inverse().multiply(piece.getScreenCTM());
    const tip = new DOMPoint(61, 42).matrixTransform(toArena);
    return { x: tip.x, y: tip.y };
  });
  expect(Math.hypot(contact.x - 280, contact.y - 310)).toBeLessThan(10);

  const stones = page.locator('[data-pattern-demo] [data-pattern-slam-stones]');
  const contactPath = await stones.getAttribute('d');
  await seek(page, 'pattern', 2.7);
  expect(await stones.getAttribute('d')).not.toBe(contactPath);
  await seek(page, 'pattern', 1.87);
  expect(await stones.getAttribute('d')).toBe(contactPath);
});

for (const lesson of ['charge', 'sweep']) {
  test(`${lesson}: reduced motion freezes playback while manual seeking remains available`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const family = await openLesson(page, lesson);
    const demo = page.locator(`[data-${family}-demo]`);
    await expect(demo).toHaveAttribute(`data-${family}-playing`, 'true');
    await expect
      .poll(async () => Number(await page.locator(`[data-${family}-timeline]`).inputValue()))
      .toBeGreaterThan(0);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(demo).toHaveAttribute(`data-${family}-playing`, 'false');
    await expect(page.locator(`[data-${family}-motion-note]`)).toBeVisible();
    await seek(page, family, 0);
    const stillPose = {
      boss: await characterState(page, family, 'boss'),
      player: await characterState(page, family, 'player'),
    };
    await page.waitForTimeout(150);
    await expect(page.locator(`[data-${family}-timeline]`)).toHaveValue('0');
    expect(await characterState(page, family, 'boss')).toEqual(stillPose.boss);
    expect(await characterState(page, family, 'player')).toEqual(stillPose.player);

    await seek(page, family, 1.25);
    await expect(page.locator(`[data-${family}-timeline]`)).toHaveValue('1250');
    expect(await characterState(page, family, 'player')).not.toEqual(stillPose.player);
    await expect(demo).toHaveAttribute(`data-${family}-playing`, 'false');
  });
}

test('short desktop scenes keep character art and labels inside the visible arena', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const lesson of lessons) {
    const family = await openLesson(page, lesson);
    const checkpoints = lesson === 'charge' ? [0, 3.1, ATTACK_DURATION + 3.1] : [0, 2.5, 5.9];
    for (const time of checkpoints) {
      await seek(page, family, time);
      for (const role of ['boss', 'player']) {
        for (const selector of [
          `[data-${family}-${role}] [data-character-art]`,
          `[data-${family}-${role}-label]`,
        ]) {
          const content = page.locator(selector);
          await expect(content).toBeVisible();
          const bounds = await arenaBounds(content);
          expect(bounds.contained, `${lesson}: ${role} art and label fit at ${time}s`).toBe(true);
        }
      }
    }
  }
});

for (const theme of ['light', 'dark']) {
  for (const locale of ['en', 'ar']) {
    test(`${theme}, ${locale}: mobile scenes keep both character rigs visible within the arena`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.setViewportSize({ width: 375, height: 812 });
      for (const lesson of lessons) {
        const family = await openLesson(page, lesson, locale);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
        await seek(page, family, 2.5);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `${lesson}: no horizontal page overflow`,
        ).toBe(true);
        const scene = page.locator(`[data-${family}-svg]`);
        await expect(scene).toBeVisible();
        for (const role of ['boss', 'player']) {
          const art = page.locator(`[data-${family}-${role}] [data-character-art]`);
          await expect(art).toBeVisible();
          const bounds = await arenaBounds(art);
          expect(bounds.width, `${lesson}: ${role} readable width`).toBeGreaterThan(15);
          expect(bounds.height, `${lesson}: ${role} readable height`).toBeGreaterThan(15);
          expect(bounds.contained, `${lesson}: ${role} stays in the arena`).toBe(true);
        }
      }
    });
  }
}

test('short desktop scenes fit on opening while using the available height', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const lesson of ['charge', 'sweep', 'ground-slam', 'wide-swing', 'self-heal-cast']) {
    await page.goto(`en/mechanics/${lesson}/`);
    const demo = page.locator('#simulation > *');
    const bounds = await demo.boundingBox();
    const header = await page.locator('.site-header').boundingBox();
    expect(bounds.y, `${lesson}: scene starts below the header`).toBeGreaterThan(header.height);
    expect(bounds.y + bounds.height, `${lesson}: scene fits without scrolling`).toBeLessThanOrEqual(
      720,
    );
    expect(bounds.height, `${lesson}: scene uses the available height`).toBeGreaterThan(570);
  }
});

test('mobile encounter panels fit below the header and stay centered in Arabic', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const [lesson, family] of [
    ['charge', 'charge'],
    ['sweep', 'pattern'],
    ['landing-jump', 'blueprint'],
    ['ground-slam', 'pattern'],
    ['lunge', 'blueprint'],
    ['wide-swing', 'blueprint'],
    ['self-heal-cast', 'blueprint'],
  ]) {
    await page.goto(`ar/mechanics/${lesson}/`);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await page.locator('#simulation').evaluate((element) => element.scrollIntoView());
    const demo = await page.locator('#simulation > *').boundingBox();
    const header = await page.locator('.site-header').boundingBox();
    const canvas = await page.locator(`.${family}-demo__canvas`).boundingBox();
    const svg = await page.locator(`.${family}-demo__svg`).boundingBox();
    expect(demo.y, `${lesson}: panel clears the sticky header`).toBeGreaterThan(header.height);
    expect(demo.y + demo.height, `${lesson}: full panel fits in the viewport`).toBeLessThanOrEqual(
      812,
    );
    expect(demo.height, `${lesson}: panel uses the available height`).toBeGreaterThan(690);
    expect(canvas.height, `${lesson}: canvas remains readable`).toBeGreaterThan(600);
    expect(
      Math.abs(svg.x + svg.width / 2 - canvas.x - canvas.width / 2),
      `${lesson}: scene stays centered in RTL`,
    ).toBeLessThan(1);
  }
});
