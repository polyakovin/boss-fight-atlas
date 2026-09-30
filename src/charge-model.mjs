/** The lesson's deterministic simulation, shared by the browser and Node tests. */
export const PHASE_ENDS = Object.freeze([0.95, 1.65, 3.2]);
export const TRANSITION_DURATION = 0.8;
export const ATTACK_DURATION = PHASE_ENDS[2] + TRANSITION_DURATION;
export const DURATION = ATTACK_DURATION * 2;
export const PLAYER_RADIUS = 34;
export const LANE_HALF_WIDTH = 49;
export const BOSS_LABEL_OFFSET_Y = -88;
const DODGE_DURATION = 0.42;
const CHARGE_DURATION = 0.62;
const RECOIL_DISTANCE = 14;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
const point = (x, y) => Object.freeze({ x, y });
const pulse = (t) => (t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t));
const speed = (t) => {
  const x = clamp(t, 0, 1);
  return 6 * x * (1 - x);
};
const angleTo = (from, to) => (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
const turn = (from, to, amount) => from + (((((to - from) % 360) + 540) % 360) - 180) * amount;

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

/** Snapshot the target when aiming ends. Later player movement cannot steer it. */
export function createChargePlan({
  origin = { x: 280, y: 205 },
  target = { x: 280, y: 480 },
  distance = 580,
} = {}) {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  const length = Math.hypot(dx, dy);
  if (
    ![origin.x, origin.y, target.x, target.y, distance].every(Number.isFinite) ||
    length === 0 ||
    distance <= 0
  ) {
    throw new RangeError(
      'A charge needs finite positions, distinct points, and a positive distance.',
    );
  }
  const heading = point(dx / length, dy / length);
  return Object.freeze({
    origin: point(origin.x, origin.y),
    target: point(target.x, target.y),
    heading,
    end: point(origin.x + heading.x * distance, origin.y + heading.y * distance),
    distance,
  });
}

export const ATTACK_PLANS = Object.freeze([
  createChargePlan(),
  createChargePlan({ origin: { x: 280, y: 805 }, target: { x: 280, y: 480 } }),
]);
export const DEFAULT_PLAN = ATTACK_PLANS[0];

function sequenceAt(time) {
  const t = clamp(Number.isFinite(time) ? time : 0, 0, DURATION);
  const sequenceTime = t === DURATION ? 0 : t;
  const attackIndex = Math.floor(sequenceTime / ATTACK_DURATION);
  return {
    time: t,
    attackIndex,
    localTime: sequenceTime - attackIndex * ATTACK_DURATION,
  };
}

export function phaseAt(time) {
  const { localTime } = sequenceAt(time);
  return localTime < PHASE_ENDS[0] ? 0 : localTime < PHASE_ENDS[1] ? 1 : 2;
}

export function distanceToSegment(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  const along = lengthSquared
    ? clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared, 0, 1)
    : 0;
  return Math.hypot(p.x - a.x - along * dx, p.y - a.y - along * dy);
}

/** The player stays near center while aiming, then clears the locked lane sideways. */
export function playerPosition(localTime, plan = DEFAULT_PLAN) {
  if (localTime < PHASE_ENDS[0]) {
    const sway = 14 * Math.sin((Math.PI * localTime) / PHASE_ENDS[0]) ** 2;
    return {
      x: plan.target.x - plan.heading.y * sway,
      y: plan.target.y + plan.heading.x * sway,
    };
  }
  const progress = smooth((localTime - PHASE_ENDS[0]) / DODGE_DURATION);
  const offset = { x: -plan.heading.y * 126, y: plan.heading.x * 126 };
  return {
    x: plan.target.x + offset.x * progress,
    y: plan.target.y + offset.y * progress,
  };
}

export function chargeFrame(time, explicitPlan) {
  const sequence = sequenceAt(time);
  const plan = explicitPlan ?? ATTACK_PLANS[sequence.attackIndex];
  const nextPlan = explicitPlan
    ? plan
    : ATTACK_PLANS[(sequence.attackIndex + 1) % ATTACK_PLANS.length];
  const localTime = explicitPlan
    ? sequence.time === DURATION
      ? 0
      : sequence.time % ATTACK_DURATION
    : sequence.localTime;
  const phase = localTime < PHASE_ENDS[0] ? 0 : localTime < PHASE_ENDS[1] ? 1 : 2;
  const transitioning = localTime >= PHASE_ENDS[2];
  const transitionProgress = smooth((localTime - PHASE_ENDS[2]) / TRANSITION_DURATION);
  const dodgeTarget = {
    x: plan.target.x - plan.heading.y * 126,
    y: plan.target.y + plan.heading.x * 126,
  };
  const player = transitioning
    ? {
        x: lerp(dodgeTarget.x, nextPlan.target.x, transitionProgress),
        y: lerp(dodgeTarget.y, nextPlan.target.y, transitionProgress),
      }
    : playerPosition(localTime, plan);
  const chargeTime = (localTime - PHASE_ENDS[1]) / CHARGE_DURATION;
  const chargeProgress = smooth(chargeTime);
  const recoilProgress = smooth((localTime - PHASE_ENDS[0]) / 0.42);
  const chargeStart = {
    x: plan.origin.x - plan.heading.x * RECOIL_DISTANCE,
    y: plan.origin.y - plan.heading.y * RECOIL_DISTANCE,
  };
  let boss;
  if (transitioning) {
    boss = {
      x: lerp(plan.end.x, nextPlan.origin.x, transitionProgress),
      y: lerp(plan.end.y, nextPlan.origin.y, transitionProgress),
    };
  } else if (phase === 0) {
    const preparation = 7 * Math.sin((Math.PI * localTime) / PHASE_ENDS[0]) ** 2;
    boss = {
      x: plan.origin.x + plan.heading.x * preparation,
      y: plan.origin.y + plan.heading.y * preparation,
    };
  } else if (phase === 1) {
    const recoil = RECOIL_DISTANCE * recoilProgress;
    boss = {
      x: plan.origin.x - plan.heading.x * recoil,
      y: plan.origin.y - plan.heading.y * recoil,
    };
  } else {
    boss = {
      x: lerp(chargeStart.x, plan.end.x, chargeProgress),
      y: lerp(chargeStart.y, plan.end.y, chargeProgress),
    };
  }
  const target = phase === 0 ? player : plan.target;
  const targetLength = Math.hypot(target.x - plan.origin.x, target.y - plan.origin.y);
  const heading = transitioning
    ? {
        x: Math.cos(Math.atan2(plan.heading.y, plan.heading.x) + Math.PI * transitionProgress),
        y: Math.sin(Math.atan2(plan.heading.y, plan.heading.x) + Math.PI * transitionProgress),
      }
    : phase === 0
      ? {
          x: (target.x - plan.origin.x) / targetLength,
          y: (target.y - plan.origin.y) / targetLength,
        }
      : plan.heading;
  const clear =
    transitioning ||
    distanceToSegment(player, plan.origin, plan.end) > LANE_HALF_WIDTH + PLAYER_RADIUS;
  const aimFade = smooth(localTime / 0.18);
  const overlayOpacity = transitioning ? 1 - transitionProgress : aimFade;
  const baseAngle = (Math.atan2(plan.heading.y, plan.heading.x) * 180) / Math.PI;
  const rotation = transitioning ? baseAngle + 180 * transitionProgress : undefined;
  const dodgeTime = (localTime - PHASE_ENDS[0]) / DODGE_DURATION;
  const dodge = pulse(dodgeTime);
  const returnTime = (localTime - PHASE_ENDS[2]) / TRANSITION_DURATION;
  const chargeStride = clamp(speed(chargeTime), 0, 1);
  const braking = pulse((localTime - PHASE_ENDS[1] - CHARGE_DURATION + 0.12) / 0.32);
  const recovery = smooth((localTime - PHASE_ENDS[1] - CHARGE_DURATION) / 0.58);
  const bossMotion = motion({
    gait: transitioning
      ? (Math.hypot(nextPlan.origin.x - plan.end.x, nextPlan.origin.y - plan.end.y) *
          transitionProgress) /
        32
      : ((plan.distance + RECOIL_DISTANCE) * chargeProgress) / 46,
    stride: transitioning ? speed(returnTime) * 0.42 : chargeStride,
    lean: transitioning
      ? 0.18 * speed(returnTime)
      : phase === 0
        ? 0.12 * pulse(localTime / PHASE_ENDS[0])
        : phase === 1
          ? -0.35 * recoilProgress
          : lerp(-0.35, 0.8, smooth(chargeTime / 0.18)) * (1 - recovery),
    crouch: transitioning
      ? 0
      : phase === 1
        ? 0.58 * recoilProgress
        : phase === 2
          ? 0.58 * (1 - smooth(chargeTime / 0.22)) + 0.32 * braking
          : 0.04 * pulse(localTime / PHASE_ENDS[0]),
    attack: phase === 2 && !transitioning ? pulse(chargeTime) : 0,
    impact: braking,
  });
  const playerMotion = motion({
    gait: transitioning
      ? (126 * transitionProgress) / 20
      : phase === 0
        ? (localTime < PHASE_ENDS[0] / 2
            ? Math.hypot(player.x - plan.target.x, player.y - plan.target.y)
            : 28 - Math.hypot(player.x - plan.target.x, player.y - plan.target.y)) / 20
        : (126 * smooth(dodgeTime)) / 20,
    stride: transitioning
      ? clamp(speed(returnTime) * 0.8, 0, 1)
      : phase === 0
        ? 0.22 * Math.abs(Math.sin((2 * Math.PI * localTime) / PHASE_ENDS[0]))
        : clamp(speed(dodgeTime), 0, 1),
    lean: transitioning ? 0.28 * speed(returnTime) : 0.75 * dodge,
    crouch: 0.62 * dodge,
    lift: 0.1 * dodge,
    dodge,
  });
  const travelFacing = angleTo(plan.target, dodgeTarget);
  const readyFacing = angleTo(player, boss);
  const playerFacing = transitioning
    ? turn(
        angleTo(dodgeTarget, nextPlan.target),
        angleTo(nextPlan.target, nextPlan.origin),
        smooth((returnTime - 0.72) / 0.28),
      )
    : phase === 0
      ? readyFacing
      : turn(
          turn(angleTo(plan.target, plan.origin), travelFacing, smooth(dodgeTime / 0.25)),
          readyFacing,
          smooth((dodgeTime - 0.75) / 0.6),
        );
  const bossLabel = {
    x: boss.x,
    y: boss.y + BOSS_LABEL_OFFSET_Y,
  };
  return {
    time: sequence.time,
    localTime,
    attackIndex: explicitPlan ? 0 : sequence.attackIndex,
    phase,
    plan,
    player,
    boss,
    heading,
    target,
    dodgeTarget,
    clear,
    chargeProgress,
    transitioning,
    transitionProgress,
    overlayOpacity,
    rotation,
    bossLabel,
    bossFacing: rotation ?? angleTo({ x: 0, y: 0 }, heading),
    playerFacing,
    bossMotion,
    playerMotion,
    chargeActive: phase === 2 && chargeTime < 1 && !transitioning,
    recovering: phase === 2 && chargeTime >= 1 && !transitioning,
    trailOpacity: chargeStride,
  };
}
