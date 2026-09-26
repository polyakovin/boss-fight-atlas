import {
  patternFrame,
  patternDuration,
  slamWavePath,
  slamStonePath,
  slamStoneChipPath,
  slamStoneFacetPath,
  slamStoneSeamPath,
} from './pattern-model.mjs';
import { createCharacterAnimator } from './character-motion.mjs';
import { createEncounterEffects } from './encounter-effects.mjs';
import { createSweepWeaponAnimator } from './sweep-weapon-player.mjs';
import { createGapVolleyAnimator } from './gap-volley-player.mjs';
import { createProjectileFanAnimator } from './projectile-fan-player.mjs';

for (const widget of document.querySelectorAll('[data-pattern-demo]')) initializePattern(widget);

export function initializePattern(widget) {
  if (widget.dataset.patternReady) return;
  const find = (selector) => widget.querySelector(selector);
  const config = JSON.parse(find('[data-pattern-config]').textContent);
  const kind = widget.dataset.patternKind;
  const duration = patternDuration(kind);
  const timeline = find('[data-pattern-timeline]');
  const currentPhase = find('[data-pattern-current-phase]');
  const phaseName = find('[data-pattern-phase-name]');
  const phaseTooltip = find('[data-pattern-phase-tooltip]');
  const boss = find('[data-pattern-boss]');
  const player = find('[data-pattern-player]');
  const animateBoss = createCharacterAnimator(boss, 'kern');
  const animateWeapon = createSweepWeaponAnimator(boss);
  const animatePlayer = createCharacterAnimator(player, 'tavi');
  const animateEffects = createEncounterEffects(widget, (time) => patternFrame(kind, time));
  const bossLabel = find('[data-pattern-boss-label]');
  const playerLabel = find('[data-pattern-player-label]');
  const sweep = find('[data-pattern-sweep]');
  const slam = find('[data-pattern-slam]');
  const slamRing = find('[data-pattern-slam-ring]');
  const slamShadow = find('[data-pattern-slam-shadow]');
  const slamChips = find('[data-pattern-slam-chips]');
  const slamStones = find('[data-pattern-slam-stones]');
  const slamFacets = find('[data-pattern-slam-facets]');
  const slamSeams = find('[data-pattern-slam-seams]');
  const summon = find('[data-pattern-summon]');
  const minions = [...widget.querySelectorAll('[data-pattern-minion]')];
  const animateMinions = minions.map((minion) => createCharacterAnimator(minion, 'kern'));
  const volley = find('[data-pattern-volley]');
  const animateVolley = createGapVolleyAnimator(volley);
  const fan = find('[data-pattern-projectile-fan]');
  const animateFan = createProjectileFanAnimator(fan);
  const status = find('[data-pattern-status]');
  const motionNote = find('[data-pattern-motion-note]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let time = 0;
  let running = false;
  let animationId = 0;
  let lastTimestamp;
  let announcedPhase = -1;
  let scrubbing = false;
  let phaseHovered = false;

  function render() {
    const frame = patternFrame(kind, time);
    widget.dataset.patternPhase = String(frame.phase);
    widget.dataset.patternOutcome = frame.clear ? 'safe' : 'pending';
    boss.setAttribute('transform', `translate(${frame.boss.x} ${frame.boss.y})`);
    player.setAttribute('transform', `translate(${frame.player.x} ${frame.player.y})`);
    animateBoss(frame.bossMotion, frame.bossFacing);
    animateWeapon(frame.sweepWeapon);
    animatePlayer(frame.playerMotion, frame.playerFacing);
    animateEffects(time, frame);
    bossLabel.setAttribute('x', frame.bossLabel.x);
    bossLabel.setAttribute('y', frame.bossLabel.y);
    playerLabel.setAttribute('x', frame.player.x);
    playerLabel.setAttribute('y', frame.player.y - 62);
    sweep.setAttribute('opacity', String(frame.sweepOpacity));
    sweep.setAttribute('transform', `translate(280 275) rotate(${frame.sweepRotation})`);
    slam.setAttribute('opacity', String(frame.slamOpacity));
    if (kind === 'ground-slam') {
      slamRing.setAttribute('d', slamWavePath(frame.slamRadius));
      const stones = slamStonePath(frame.slamRadius);
      slamShadow.setAttribute('d', stones);
      slamChips.setAttribute('d', slamStoneChipPath(frame.slamRadius));
      slamStones.setAttribute('d', stones);
      slamFacets.setAttribute('d', slamStoneFacetPath(frame.slamRadius));
      slamSeams.setAttribute('d', slamStoneSeamPath(frame.slamRadius));
    }
    summon.setAttribute('opacity', String(frame.summonOpacity));
    const starts = [
      [135, 465],
      [280, 515],
      [425, 465],
    ];
    const ends = [
      [175, 650],
      [300, 680],
      [420, 610],
    ];
    minions.forEach((minion, index) => {
      const spawn = Math.max(0, Math.min(1, frame.summonProgress * 1.4 - index * 0.18));
      const progress = spawn * (1 - frame.summonRecall);
      const x = starts[index][0] + (ends[index][0] - starts[index][0]) * progress;
      const y = starts[index][1] + (ends[index][1] - starts[index][1]) * progress;
      minion.setAttribute(
        'transform',
        `translate(${x} ${y}) scale(${0.54 * (1 - frame.summonRecall * 0.35)})`,
      );
      minion.setAttribute('opacity', Math.min(1, spawn * 12) * (1 - frame.summonRecall));
      animateMinions[index](
        {
          gait: spawn * 32 + frame.summonRecall * 24,
          stride: Math.max(
            Math.min(1, spawn * 8, (1 - spawn) * 10) * 0.85 * (1 - frame.summonRecall),
            0.68 * Math.sin(Math.PI * frame.summonRecall),
          ),
          crouch: 1 - Math.min(1, spawn * 5),
        },
        (Math.atan2(
          frame.player.y * (1 - frame.summonRecall) + starts[index][1] * frame.summonRecall - y,
          frame.player.x * (1 - frame.summonRecall) + starts[index][0] * frame.summonRecall - x,
        ) *
          180) /
          Math.PI,
      );
    });
    volley.setAttribute('opacity', String(frame.volleyOpacity));
    animateVolley(frame.volley);
    fan.setAttribute('opacity', String(frame.fanOpacity));
    animateFan(frame.fan);
    phaseName.textContent = config.phaseNames[frame.phase];
    phaseTooltip.textContent = config.phaseDescriptions[frame.phase];
    if (announcedPhase !== frame.phase) {
      status.textContent =
        frame.phase === 0 ? config.danger : frame.phase === 1 ? config.locked : config.safe;
      announcedPhase = frame.phase;
    }
    timeline.value = String(Math.round(time * 1000));
    timeline.setAttribute('aria-valuetext', config.phaseNames[frame.phase]);
    widget.style.setProperty('--pattern-progress', `${(time / duration) * 100}%`);
  }

  function setRunning(next) {
    running = next;
    widget.dataset.patternPlaying = String(next);
    cancelAnimationFrame(animationId);
    lastTimestamp = undefined;
    if (running) animationId = requestAnimationFrame(tick);
  }
  function tick(timestamp) {
    if (!running) return;
    if (lastTimestamp !== undefined) time = (time + (timestamp - lastTimestamp) / 1000) % duration;
    lastTimestamp = timestamp;
    render();
    animationId = requestAnimationFrame(tick);
  }
  function updatePlayback() {
    setRunning(!reducedMotion.matches && !document.hidden && !scrubbing && !phaseHovered);
  }
  timeline.addEventListener('pointerdown', () => {
    scrubbing = true;
    updatePlayback();
  });
  timeline.addEventListener('input', () => {
    time = Number(timeline.value) / 1000;
    render();
  });
  const finishScrub = () => {
    scrubbing = false;
    updatePlayback();
  };
  timeline.addEventListener('pointerup', finishScrub);
  timeline.addEventListener('pointercancel', finishScrub);
  timeline.addEventListener('change', finishScrub);
  currentPhase.addEventListener('pointerenter', () => {
    phaseHovered = true;
    updatePlayback();
  });
  currentPhase.addEventListener('pointerleave', () => {
    phaseHovered = false;
    updatePlayback();
  });
  const applyMotionPreference = () => {
    motionNote.hidden = !reducedMotion.matches;
    updatePlayback();
  };
  reducedMotion.addEventListener('change', applyMotionPreference);
  document.addEventListener('visibilitychange', updatePlayback);
  widget.dataset.patternReady = 'true';
  render();
  applyMotionPreference();
}
