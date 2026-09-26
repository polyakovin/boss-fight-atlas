import test from 'node:test';
import assert from 'node:assert/strict';
import { patternFrame, PATTERN_DURATION, PATTERN_PHASE_ENDS } from '../src/pattern-model.mjs';
import {
  sweepWeaponPose,
  SWEEP_INNER_RADIUS,
  SWEEP_OUTER_RADIUS,
  SWEEP_PLAYER_RADIUS,
} from '../src/sweep-weapon-model.mjs';
import { renderPattern, renderPatternThumbnail } from '../lib/pattern-view.mjs';
import { SWEEP_WEAPON_ART } from '../lib/weapon-art.mjs';

const [activeStart, activeEnd] = PATTERN_PHASE_ENDS;
const angleDifference = (a, b) => ((((a - b) % 360) + 540) % 360) - 180;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

test('the held blade leads its trail and commits to a steady angular speed', () => {
  const ready = patternFrame('sweep', 0);
  const start = patternFrame('sweep', activeStart);
  const end = patternFrame('sweep', activeEnd);
  assert.ok(start.sweepWeapon.angle < ready.sweepWeapon.angle, 'the weapon pulls back first');
  const increment = (end.sweepWeapon.angle - start.sweepWeapon.angle) / 40;
  assert.ok(increment > 0);
  let previous = start;
  for (let index = 0; index <= 40; index += 1) {
    const time = activeStart + ((activeEnd - activeStart) * index) / 40;
    const frame = patternFrame('sweep', time);
    assert.ok(Math.abs(frame.sweepWeapon.angle - (frame.sweepRotation + 28)) < 1e-8);
    const rotation = frame.sweepWeapon.shaftTransform.match(/^rotate\((-?[\d.]+)\)$/);
    assert.ok(rotation, 'the shaft has a rigid rotation about the attack pivot');
    assert.ok(Math.abs(angleDifference(Number(rotation[1]), frame.sweepWeapon.angle)) < 0.001);
    assert.deepEqual(frame.boss, start.boss);
    assert.equal(frame.bossFacing, start.bossFacing, 'the held weapon does not flip the body');
    if (index > 0) {
      assert.ok(Math.abs(frame.sweepWeapon.angle - previous.sweepWeapon.angle - increment) < 1e-8);
    }
    previous = frame;
  }
});

test('the complete player body clears the annular cutting region throughout the active sweep', () => {
  for (let index = 0; index <= 300; index += 1) {
    const time = activeStart + 0.000001 + ((activeEnd - activeStart - 0.000002) * index) / 300;
    const frame = patternFrame('sweep', time);
    const radius = distance(frame.player, frame.boss);
    assert.ok(
      radius - SWEEP_PLAYER_RADIUS > SWEEP_OUTER_RADIUS ||
        radius + SWEEP_PLAYER_RADIUS < SWEEP_INNER_RADIUS,
      `the entire player is outside the cutting region at ${time}`,
    );
    assert.equal(frame.clear, true);
  }
});

test('weapon orientation and both grips remain continuous across phase boundaries and the loop', () => {
  for (const boundary of [0, activeStart, activeEnd, 4.55, PATTERN_DURATION]) {
    const before = patternFrame('sweep', boundary - 0.0001).sweepWeapon;
    const after = patternFrame('sweep', boundary + 0.0001).sweepWeapon;
    assert.ok(Math.abs(angleDifference(before.angle, after.angle)) < 0.1, `angle at ${boundary}`);
    assert.equal(before.arms.length, 2);
    assert.equal(after.arms.length, 2);
    before.arms.forEach((arm, index) => {
      assert.ok(distance(arm.hand, after.arms[index].hand) < 0.1, `grip ${index} at ${boundary}`);
    });
  }
  const stopped = patternFrame('sweep', activeEnd).sweepWeapon;
  const held = patternFrame('sweep', 4.5).sweepWeapon;
  assert.equal(held.angle, stopped.angle, 'the boss finishes the stroke before returning');
});

test('the weapon remains present when its trail fades and reverse seeking reproduces its pose', () => {
  const times = Array.from({ length: 121 }, (_, index) => (index * PATTERN_DURATION) / 121);
  const expected = times.map((time) => patternFrame('sweep', time));
  for (const time of [...times].reverse()) patternFrame('sweep', time);
  times.forEach((time, index) => {
    const frame = patternFrame('sweep', time);
    assert.deepEqual(frame, expected[index]);
    assert.ok(frame.sweepWeapon, `a held weapon exists at ${time}`);
    assert.ok(Number.isFinite(frame.sweepWeapon.angle));
    for (const arm of frame.sweepWeapon.arms) {
      assert.ok(Number.isFinite(arm.hand.x) && Number.isFinite(arm.hand.y));
      assert.doesNotMatch(arm.path, /NaN|Infinity/);
    }
  });
  assert.equal(patternFrame('sweep', 5.5).sweepOpacity, 0);
  assert.ok(patternFrame('sweep', 5.5).sweepWeapon);
  const pose = sweepWeaponPose(118, { lean: 0.2, crouch: 0.1 });
  sweepWeaponPose(-35, { lean: -0.2, crouch: 0.3 });
  assert.deepEqual(sweepWeaponPose(118, { lean: 0.2, crouch: 0.1 }), pose);
});

test('the sweep scene and its static preview share weapon artwork without decorative scene overlays', () => {
  const activeFrame = patternFrame('sweep', 3);
  assert.equal(activeFrame.boss.y, 385);
  assert.equal(activeFrame.player.y, 770);
  const demo = {
    title: 'Arc sweep',
    timeline: 'Attack timeline',
    boss: 'Boss',
    player: 'Player',
    danger: 'Threat appears',
    reducedMotion: 'Autoplay disabled',
    diagramDescription: 'The boss swings a held blade around a visible pivot.',
    phaseNames: ['Wind-up', 'Arc commits', 'Recovery'],
    phaseDescriptions: ['Prepare the blade', 'Sweep the arc', 'Return to ready'],
  };
  const weaponMarker = /data-weapon-art=["']sweep-glaive["']/;
  for (const kind of ['sweep', 'ground-slam', 'summon', 'gap-volley']) {
    const scene = renderPattern(demo, kind);
    const thumbnail = renderPatternThumbnail(kind, `weapon-test-${kind}`);
    for (const markup of [scene, thumbnail]) {
      if (kind === 'sweep') {
        assert.match(markup, weaponMarker);
        assert.ok(markup.includes(SWEEP_WEAPON_ART));
        if (markup === scene) assert.match(markup, /data-pattern-sweep/);
      } else {
        assert.doesNotMatch(markup, weaponMarker);
      }
      assert.doesNotMatch(markup, /data-pattern-(?:sweep|slam|projectile-fan)-scene/);
    }
  }
});
