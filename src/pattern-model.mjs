import { sweepWeaponPose, SWEEP_OUTER_RADIUS, SWEEP_PLAYER_RADIUS } from './sweep-weapon-model.mjs';
import { GAP_VOLLEY_DURATION, gapVolleyPlan, volleyPlayerIsClear } from './gap-volley-model.mjs';
import {
  PROJECTILE_FAN_DURATION,
  projectileFanPlan,
  projectileFanPlayerIsClear,
} from './projectile-fan-model.mjs';

export const PATTERN_DURATION = 6;
export const PATTERN_PHASE_ENDS = Object.freeze([1.6, 4.25, PATTERN_DURATION]);
export const BOSS_LABEL_OFFSET_Y = -104;

export const patternDuration = (kind) =>
  kind === 'gap-volley'
    ? GAP_VOLLEY_DURATION
    : kind === 'projectile-fan'
      ? PROJECTILE_FAN_DURATION
      : PATTERN_DURATION;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const mix = (from, to, amount) => from + (to - from) * amount;
const smooth = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const pulse = (value) => (value <= 0 || value >= 1 ? 0 : Math.sin(value * Math.PI));
const speed = (value) => {
  const t = clamp(value);
  return 6 * t * (1 - t);
};
const angleTo = (from, to) => (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
const turn = (from, to, amount) => from + (((((to - from) % 360) + 540) % 360) - 180) * amount;
const SLAM_CENTER = Object.freeze({ x: 280, y: 310 });
const SLAM_WAVE_HALF_WIDTH = 14;
const SLAM_PLAYER_RADIUS = 24;
const SLAM_STONE_COUNT = 32;
const slamStonePoint = (angle, radius) =>
  `${(SLAM_CENTER.x + Math.cos(angle) * radius).toFixed(1)} ${(SLAM_CENTER.y + Math.sin(angle) * radius).toFixed(1)}`;
const slamNoise = (index, salt) => {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};
const makeSlamFragment = (index, count, small) => {
  const angle =
    ((index + (slamNoise(index, small ? 9 : 1) - 0.5) * (small ? 2.8 : 2.1)) * Math.PI * 2) / count;
  const tilt = angle + (slamNoise(index, small ? 10 : 2) - 0.5) * (small ? 0.7 : 0.4);
  return {
    angle,
    offset: small ? -8 - slamNoise(index, 11) * 27 : (slamNoise(index, 3) - 0.5) * 12,
    depth: (small ? 3 : 5) + slamNoise(index, small ? 12 : 4) * (small ? 2 : 3),
    width: (small ? 4 : 8) + slamNoise(index, small ? 13 : 5) * (small ? 3 : 10),
    forwardX: Math.cos(tilt),
    forwardY: Math.sin(tilt),
    sideX: -Math.sin(tilt),
    sideY: Math.cos(tilt),
  };
};
const SLAM_FRAGMENTS = Array.from({ length: 40 }, (_, index) => makeSlamFragment(index, 40, false));
const SLAM_CHIPS = Array.from({ length: 24 }, (_, index) => makeSlamFragment(index, 24, true));
const slamFragmentPoint = (fragment, radius, forward, side) => {
  const reach = radius + fragment.offset;
  const x =
    SLAM_CENTER.x +
    Math.cos(fragment.angle) * reach +
    fragment.forwardX * forward * fragment.depth +
    fragment.sideX * side * fragment.width;
  const y =
    SLAM_CENTER.y +
    Math.sin(fragment.angle) * reach +
    fragment.forwardY * forward * fragment.depth +
    fragment.sideY * side * fragment.width;
  return `${x.toFixed(1)} ${y.toFixed(1)}`;
};

/** A thin fracture shows the continuous shockwave beneath the scattered rock. */
export function slamWavePath(radius) {
  const points = Array.from({ length: SLAM_STONE_COUNT }, (_, index) => {
    const angle = (index * Math.PI * 2) / SLAM_STONE_COUNT;
    const chip = index % 5 === 0 ? 5 : index % 3 === 0 ? -3 : 1;
    return slamStonePoint(angle, radius + chip);
  });
  return `M ${points.join(' L ')} Z`;
}

/** Uneven flying fragments stay inside the wave's existing damage width. */
export function slamStonePath(radius) {
  return SLAM_FRAGMENTS.map((fragment) => {
    const point = (forward, side) => slamFragmentPoint(fragment, radius, forward, side);
    return `M ${point(-0.75, -0.72)} L ${point(-1, -0.08)} L ${point(-0.5, 0.88)} L ${point(0.2, 1)} L ${point(1, 0.3)} L ${point(0.72, -0.62)} L ${point(0.02, -1)} Z`;
  }).join(' ');
}

export function slamStoneChipPath(radius) {
  return SLAM_CHIPS.map((fragment) => {
    const point = (forward, side) => slamFragmentPoint(fragment, radius, forward, side);
    return `M ${point(-0.85, -0.45)} L ${point(-0.45, 0.85)} L ${point(0.6, 0.7)} L ${point(1, -0.18)} L ${point(0.1, -1)} Z`;
  }).join(' ');
}

export function slamStoneFacetPath(radius) {
  return SLAM_FRAGMENTS.map((fragment) => {
    const point = (forward, side) => slamFragmentPoint(fragment, radius, forward, side);
    return `M ${point(-0.65, -0.55)} L ${point(-0.5, 0.6)} L ${point(0.35, 0.25)} Z`;
  }).join(' ');
}

export function slamStoneSeamPath(radius) {
  return SLAM_FRAGMENTS.filter((_, index) => index % 5 === 0)
    .map((fragment) => {
      const point = (forward, side) => slamFragmentPoint(fragment, radius, forward, side);
      return `M ${point(-0.75, -0.12)} L ${point(-0.1, 0.12)} L ${point(0.55, -0.18)}`;
    })
    .join(' ');
}
const localTime = (time) => {
  const remainder = (Number.isFinite(time) ? time : 0) % PATTERN_DURATION;
  return remainder < 0 ? remainder + PATTERN_DURATION : remainder;
};
/** Gait is a distance-driven angle in radians; the other pose weights are normalized. */
const motion = (pose = {}) => ({
  gait: 0,
  stride: 0,
  lean: 0,
  crouch: 0,
  lift: 0,
  attack: 0,
  impact: 0,
  dodge: 0,
  ...pose,
});

export function patternPhaseAt(time) {
  const t = localTime(time);
  return t < PATTERN_PHASE_ENDS[0] ? 0 : t < PATTERN_PHASE_ENDS[1] ? 1 : 2;
}

/** A deterministic frame shared by browser animation and tests. */
export function patternFrame(kind, time) {
  const volley = kind === 'gap-volley' ? gapVolleyPlan(time) : null;
  const fan = kind === 'projectile-fan' ? projectileFanPlan(time) : null;
  const t = volley?.localTime ?? fan?.localTime ?? localTime(time);
  const phase = patternPhaseAt(t);
  const prepare = smooth(t / PATTERN_PHASE_ENDS[0]);
  const action = clamp(
    (t - PATTERN_PHASE_ENDS[0]) / (PATTERN_PHASE_ENDS[1] - PATTERN_PHASE_ENDS[0]),
  );
  const recover = smooth((t - PATTERN_PHASE_ENDS[1]) / (PATTERN_DURATION - PATTERN_PHASE_ENDS[1]));
  const visibility = phase === 2 ? 1 - recover : phase === 0 ? prepare : 1;
  const boss = {
    // The ground-slam gauntlet lands at the fixed wave origin (280, 310).
    x: kind === 'ground-slam' ? 245 : 280,
    y:
      kind === 'gap-volley'
        ? 175
        : kind === 'projectile-fan'
          ? 165
          : kind === 'summon'
            ? 235
            : kind === 'sweep'
              ? 385
              : kind === 'ground-slam'
                ? 255
                : 275,
  };
  const playerStart =
    volley?.playerStart ??
    fan?.playerStart ??
    (kind === 'sweep' ? { x: 412, y: 635 } : { x: 390, y: 700 });
  const playerTarget =
    volley?.playerTarget ??
    fan?.playerTarget ??
    (kind === 'sweep'
      ? { x: 440, y: 770 }
      : kind === 'ground-slam'
        ? { x: 440, y: 805 }
        : kind === 'summon'
          ? { x: 170, y: 720 }
          : { x: 280, y: 760 });
  const playerEnd = volley?.playerEnd ?? fan?.playerEnd ?? playerStart;
  // A brief reaction, a committed run, then planted feet while the threat passes.
  const responseTime = (t - 0.4) / 0.75;
  const returnTime = (t - 4.55) / 1.3;
  const response = smooth(responseTime);
  const returnProgress = smooth(returnTime);
  const player = {
    x: mix(mix(playerStart.x, playerTarget.x, response), playerEnd.x, returnProgress),
    y: mix(mix(playerStart.y, playerTarget.y, response), playerEnd.y, returnProgress),
  };
  const windup = smooth((t - 0.2) / 1.1);
  const actionTime = t - PATTERN_PHASE_ENDS[0];
  const release = smooth(actionTime / 0.16);
  const followThrough = 1 - smooth((actionTime - 0.16) / 0.65);
  const chargePose = windup * (1 - recover);
  let bossMotion;
  if (kind === 'ground-slam') {
    bossMotion = motion({
      lean: 0.35 * pulse(actionTime / 0.65),
      crouch: 0.1 * windup * (1 - release) + 0.78 * pulse(actionTime / 0.42),
      lift: 0.92 * windup * (1 - release),
      attack: windup * (1 - smooth((actionTime - 0.12) / 0.38)),
      impact: pulse((actionTime - 0.11) / 0.3),
    });
  } else if (kind === 'sweep') {
    bossMotion = motion({
      lean: phase === 0 ? -0.24 * windup : mix(-0.24, 0.36, action) * (1 - recover),
      crouch: 0.18 * chargePose + 0.12 * pulse(action),
      attack: (0.25 * windup + 0.65 * pulse(action)) * (1 - recover),
    });
  } else if (kind === 'summon') {
    bossMotion = motion({
      lean: -0.12 * chargePose,
      crouch: 0.16 * chargePose,
      attack: 0.8 * chargePose,
      impact: 0.45 * pulse(actionTime / 0.36),
    });
  } else {
    bossMotion = motion({
      lean: -0.28 * windup * followThrough,
      crouch: 0.26 * windup * followThrough,
      attack: 0.72 * windup * followThrough,
      impact: Math.max(...[0, 0.2, 0.4].map((delay) => 0.6 * pulse((actionTime - delay) / 0.18))),
    });
  }
  const routeLength = Math.hypot(playerTarget.x - playerStart.x, playerTarget.y - playerStart.y);
  const returnLength = Math.hypot(playerEnd.x - playerTarget.x, playerEnd.y - playerTarget.y);
  const responseStride = clamp(speed(responseTime));
  const returnStride = clamp(speed(returnTime) * 0.85);
  const playerMotion = motion({
    gait: (routeLength * response + returnLength * returnProgress) / 20,
    stride: responseStride + returnStride,
    lean: 0.52 * responseStride + 0.25 * returnStride,
    crouch: 0.2 * responseStride,
    dodge: kind === 'sweep' ? 0.6 * pulse(responseTime) : 0,
  });
  const readyFacing = angleTo(player, boss);
  const outgoingFacing = turn(
    angleTo(playerStart, boss),
    angleTo(playerStart, playerTarget),
    smooth(responseTime / 0.25),
  );
  const playerFacing =
    returnTime > 0
      ? turn(angleTo(playerTarget, playerEnd), readyFacing, smooth((returnTime - 0.8) / 0.2))
      : turn(outgoingFacing, readyFacing, smooth((responseTime - 0.8) / 0.4));
  const bossFacing = 90;
  // The blade leads the annular trail. Recovery finishes the turn to the ready
  // orientation instead of snapping a persistent weapon back at the loop seam.
  const sweepAngle =
    phase === 0
      ? mix(-14, -44, prepare)
      : phase === 1
        ? mix(-44, 218, action)
        : mix(218, 346, smooth((t - 4.55) / 1.45));
  const sweepWeapon = kind === 'sweep' ? sweepWeaponPose(sweepAngle, bossMotion) : null;
  const sweepClear =
    Math.hypot(player.x - boss.x, player.y - boss.y) - SWEEP_PLAYER_RADIUS > SWEEP_OUTER_RADIUS;
  const slamRadius = mix(58, 470, clamp((actionTime - 0.16) / 2.49));
  const slamClear =
    Math.hypot(player.x - SLAM_CENTER.x, player.y - SLAM_CENTER.y) - SLAM_PLAYER_RADIUS >
    slamRadius + SLAM_WAVE_HALF_WIDTH + 5;
  // Preserve the label contract; rig lift and compression now own vertical articulation.
  const bossRock = 0;

  return Object.freeze({
    kind,
    time: volley?.time ?? t,
    phase,
    prepare,
    action,
    recover,
    visibility,
    boss,
    bossLabel: { x: boss.x, y: boss.y + bossRock + BOSS_LABEL_OFFSET_Y },
    player,
    bossRock,
    bossFacing,
    playerFacing,
    bossMotion,
    playerMotion,
    sweepWeapon,
    sweepRotation: sweepAngle - 28,
    sweepOpacity:
      kind === 'sweep'
        ? phase === 0
          ? prepare * 0.3
          : phase === 1
            ? 1
            : 1 - smooth((t - 4.25) / 0.22)
        : 0,
    slamRadius,
    slamOpacity: kind === 'ground-slam' && actionTime >= 0.16 ? visibility : 0,
    summonProgress: kind === 'summon' ? action : 0,
    summonRecall: kind === 'summon' ? smooth((t - 5.35) / 0.65) : 0,
    summonOpacity: kind === 'summon' ? (phase === 0 ? prepare : 1 - smooth((t - 5.35) / 0.65)) : 0,
    volley,
    volleyOpacity: volley ? 1 : 0,
    fan,
    fanOpacity: fan ? 1 : 0,
    clear:
      phase > 0 &&
      (volley
        ? volleyPlayerIsClear(volley, player)
        : fan
          ? projectileFanPlayerIsClear(fan, player)
          : kind === 'ground-slam'
            ? phase === 2 || slamClear
            : kind !== 'sweep' || phase === 2 || sweepClear),
  });
}
