import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BOSS_LABEL_OFFSET_Y,
  patternFrame,
  patternDuration,
  patternPhaseAt,
  PATTERN_DURATION,
  slamStoneChipPath,
  slamStonePath,
} from '../src/pattern-model.mjs';
import { renderPattern, renderPatternThumbnail } from '../lib/pattern-view.mjs';

const kinds = ['sweep', 'ground-slam', 'summon', 'gap-volley'];

test('shared pattern model gives every mechanic three moving phases', () => {
  assert.deepEqual([patternPhaseAt(0.5), patternPhaseAt(2.5), patternPhaseAt(5)], [0, 1, 2]);
  for (const kind of kinds) {
    for (const time of [0, 0.8, 2.5, 4.8, PATTERN_DURATION - 0.01]) {
      const frame = patternFrame(kind, time);
      assert.ok(
        [
          frame.player.x,
          frame.player.y,
          frame.boss.x,
          frame.boss.y,
          frame.sweepRotation,
          frame.slamRadius,
          frame.summonProgress,
          frame.time,
        ].every(Number.isFinite),
      );
    }
  }
});

test('each pattern exposes only its own threat geometry', () => {
  const frames = Object.fromEntries(kinds.map((kind) => [kind, patternFrame(kind, 2.5)]));
  assert.ok(frames.sweep.sweepOpacity > 0);
  assert.ok(frames['ground-slam'].slamOpacity > 0);
  assert.ok(frames.summon.summonOpacity > 0);
  assert.ok(frames['gap-volley'].volleyOpacity > 0);
  assert.equal(frames.sweep.slamOpacity, 0);
  assert.equal(frames.summon.volleyOpacity, 0);
});

test('ground slam starts at floor contact and leaves the full player beyond the stone ridge', () => {
  assert.equal(patternFrame('ground-slam', 1.72).slamOpacity, 0);
  for (let time = 1.8; time < 4.25; time += 0.05) {
    const frame = patternFrame('ground-slam', time);
    const playerDistance = Math.hypot(frame.player.x - 280, frame.player.y - 310);
    assert.ok(playerDistance - 24 > frame.slamRadius + 19);
    assert.equal(frame.clear, true);
  }
});

test('ground slam front stays within the danger width while small debris trails behind', () => {
  for (const radius of [58, 112, 300, 470]) {
    const points = [...slamStonePath(radius).matchAll(/[ML] (-?\d+\.\d) (-?\d+\.\d)/g)];
    const chips = [...slamStoneChipPath(radius).matchAll(/[ML] (-?\d+\.\d) (-?\d+\.\d)/g)];
    assert.equal(points.length, 40 * 7);
    assert.equal(chips.length, 24 * 5);
    for (const [, x, y] of points) {
      const distance = Math.hypot(Number(x) - 280, Number(y) - 310);
      assert.ok(distance >= radius - 14 && distance <= radius + 19);
    }
    for (const [, x, y] of chips) {
      const distance = Math.hypot(Number(x) - 280, Number(y) - 310);
      assert.ok(distance >= radius - 43 && distance <= radius + 19);
    }
  }
  const angles = [...slamStonePath(300).matchAll(/M (-?\d+\.\d) (-?\d+\.\d)/g)]
    .map(([, x, y]) => (Math.atan2(Number(y) - 310, Number(x) - 280) + 2 * Math.PI) % (2 * Math.PI))
    .sort((a, b) => a - b);
  const gaps = angles.map(
    (angle, index) => (angles[(index + 1) % angles.length] - angle + 2 * Math.PI) % (2 * Math.PI),
  );
  assert.ok(Math.max(...gaps) > (2 * Math.PI * 2) / angles.length);
  const preview = renderPatternThumbnail('ground-slam', 'ground-slam-preview');
  assert.match(preview, /data-slam-gauntlet/);
  assert.match(preview, /data-pattern-slam-stones/);
  assert.match(preview, /data-pattern-slam-chips/);
});

test('player and threat return smoothly before the loop repeats', () => {
  for (const kind of kinds) {
    const start = patternFrame(kind, 0);
    const end = patternFrame(kind, patternDuration(kind) - 0.001);
    assert.ok(Math.abs(start.player.x - end.player.x) < 0.01);
    assert.ok(Math.abs(start.player.y - end.player.y) < 0.01);
    assert.ok(end.visibility < 0.01);
  }
});

test('the boss label stays above the boss throughout every pattern', () => {
  for (const kind of kinds) {
    for (let time = 0; time < patternDuration(kind); time += 0.025) {
      const frame = patternFrame(kind, time);
      assert.equal(frame.bossLabel.x, frame.boss.x);
      assert.equal(frame.bossLabel.y, frame.boss.y + frame.bossRock + BOSS_LABEL_OFFSET_Y);
      assert.ok(frame.bossLabel.y < frame.boss.y + frame.bossRock);
    }
  }
});

test('summon keeps only gameplay portals and shared minion art in its preview', () => {
  const page = renderPattern(
    {
      title: 'Summon',
      timeline: 'Timeline',
      phaseNames: ['Signal', 'Response', 'Recovery'],
      phaseDescriptions: ['Signal.', 'Response.', 'Recovery.'],
      diagramDescription: 'Summoned minions enter the arena.',
      boss: 'Boss',
      player: 'Player',
      danger: 'Danger',
      reducedMotion: 'Use the slider.',
    },
    'summon',
  );
  const preview = renderPatternThumbnail('summon', 'summon-preview');
  assert.doesNotMatch(page, /data-pattern-summon-scene/);
  assert.match(page, /data-pattern-summon/);
  assert.doesNotMatch(page, /stroke-dasharray="7 7"/);
  assert.equal((preview.match(/data-character-art-preview="kern-summon"/g) ?? []).length, 3);
});
