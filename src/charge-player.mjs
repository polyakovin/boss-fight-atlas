import { chargeFrame, DURATION, WIDE_ATTACK_PLANS, WIDE_CHARGE_ARENA } from './charge-model.mjs';
import { advanceChargeGame, chargeGameFrame, createChargeGame } from './charge-game.mjs';
import { moveFloatingJoystick } from './charge-joystick.mjs';
import { createCharacterAnimator } from './character-motion.mjs';
import { createEncounterEffects } from './encounter-effects.mjs';

const directions = {
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
};

for (const widget of document.querySelectorAll('[data-charge-demo]')) initializeCharge(widget);

export function initializeCharge(widget) {
  if (widget.dataset.chargeReady) return;
  const configElement = widget.querySelector('[data-charge-config]');
  if (!configElement) return;
  const text = JSON.parse(configElement.textContent);
  const find = (selector) => widget.querySelector(selector);
  const timeline = find('[data-charge-timeline]');
  const canvas = find('.charge-demo__canvas');
  const currentPhase = find('[data-charge-current-phase]');
  const phaseName = find('[data-charge-phase-name]');
  const phaseTooltip = find('[data-charge-phase-tooltip]');
  const boss = find('[data-charge-boss]');
  const player = find('[data-charge-player]');
  const animateBoss = createCharacterAnimator(boss, 'kern');
  const animatePlayer = createCharacterAnimator(player, 'tavi');
  const wide = widget.hasAttribute('data-charge-wide');
  const frameAt = (at) => chargeFrame(at, undefined, wide ? WIDE_ATTACK_PLANS : undefined);
  const animateEffects = createEncounterEffects(widget, frameAt);
  const dust = [...widget.querySelectorAll('[data-encounter-dust] ellipse')];
  const impact = find('[data-encounter-impact]');
  const contact = find('[data-charge-contact]');
  const strike = find('[data-charge-strike]');
  const hit = find('[data-charge-hit]');
  const lane = find('[data-charge-lane]');
  const laneGouges = find('[data-charge-gouges]');
  const target = find('[data-charge-target]');
  const path = find('[data-charge-dodge]');
  const status = find('[data-charge-status]');
  const bossLabel = find('[data-charge-boss-label]');
  const playerLabel = find('[data-charge-player-label]');
  const bossHearts = find('[data-charge-boss-hearts]');
  const playerHearts = find('[data-charge-player-hearts]');
  const bossHeartIcons = [...bossHearts.querySelectorAll('[data-charge-heart]')];
  const playerHeartIcons = [...playerHearts.querySelectorAll('[data-charge-heart]')];
  const joystick = find('[data-charge-joystick]');
  const startButton = find('[data-charge-start]');
  const exitButton = find('[data-charge-exit]');
  const motionNote = find('[data-charge-motion-note]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const number = new Intl.NumberFormat(document.documentElement.lang || undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  let time = 0;
  let game;
  let mode = 'demo';
  let running = false;
  let animationId = 0;
  let lastTimestamp;
  let announcedState = '';
  let scrubbing = false;
  let phaseHovered = false;
  let touchPointerId = null;
  let stick = null;
  const pressed = new Set();

  function clearTouch() {
    const pointerId = touchPointerId;
    touchPointerId = null;
    stick = null;
    joystick.hidden = true;
    if (pointerId !== null && canvas.hasPointerCapture(pointerId))
      canvas.releasePointerCapture(pointerId);
  }

  function renderJoystick() {
    joystick.hidden = false;
    joystick.style.left = `${stick.center.x}px`;
    joystick.style.top = `${stick.center.y}px`;
    joystick.style.setProperty('--charge-stick-x', `${stick.offset.x}px`);
    joystick.style.setProperty('--charge-stick-y', `${stick.offset.y}px`);
  }

  function onTouchStart(event) {
    if (
      (event.pointerType !== 'touch' && event.pointerType !== 'pen') ||
      touchPointerId !== null ||
      event.target.closest('.charge-demo__scene-timeline')
    )
      return;
    event.preventDefault();
    if (mode === 'demo') startGame();
    const bounds = canvas.getBoundingClientRect();
    const center = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    stick = moveFloatingJoystick(center, center);
    touchPointerId = event.pointerId;
    canvas.setPointerCapture(touchPointerId);
    renderJoystick();
  }

  function onTouchMove(event) {
    if (event.pointerId !== touchPointerId) return;
    event.preventDefault();
    const bounds = canvas.getBoundingClientRect();
    stick = moveFloatingJoystick(stick.center, {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
    renderJoystick();
  }

  function onTouchEnd(event) {
    if (event.pointerId === touchPointerId) clearTouch();
  }

  function healthAnnouncement() {
    return `${text.gamePlayerHealth}: ${game.playerHealth}. ${text.gameBossHealth}: ${game.bossHealth}.`;
  }

  function render() {
    const frame = mode === 'demo' ? frameAt(time) : chargeGameFrame(game);
    const angle = frame.rotation ?? (Math.atan2(frame.heading.y, frame.heading.x) * 180) / Math.PI;
    widget.dataset.chargeMode = mode;
    if (startButton) startButton.hidden = mode !== 'demo';
    if (exitButton) exitButton.hidden = mode === 'demo';
    widget.dataset.chargePhase = String(frame.phase);
    widget.dataset.chargeAttack = String(mode === 'demo' ? frame.attackIndex : game.round);
    widget.dataset.chargeOutcome = mode === 'demo' ? (frame.clear ? 'safe' : 'pending') : mode;
    widget.dataset.chargeTransition = String(frame.transitioning);
    boss.setAttribute('transform', `translate(${frame.boss.x} ${frame.boss.y})`);
    player.setAttribute('transform', `translate(${frame.player.x} ${frame.player.y})`);
    animateBoss(frame.bossMotion, frame.bossFacing);
    animatePlayer(frame.playerMotion, frame.playerFacing);
    contact.setAttribute('transform', `translate(${frame.boss.x} ${frame.boss.y})`);
    contact.setAttribute('opacity', mode !== 'demo' && frame.chargeActive ? '0.55' : '0');
    if (mode === 'demo') {
      animateEffects(time, frame);
      strike.setAttribute('opacity', '0');
      hit.setAttribute('opacity', '0');
    } else {
      for (const particle of dust) particle.setAttribute('opacity', '0');
      impact.setAttribute('opacity', String((frame.bossMotion?.impact ?? 0) * 0.85));
      impact.setAttribute('transform', `translate(${frame.boss.x} ${frame.boss.y + 35})`);
      strike.setAttribute('transform', `translate(${frame.player.x} ${frame.player.y})`);
      strike.setAttribute('opacity', String(Math.min(0.75, game.attackFlash * 4)));
      hit.setAttribute('transform', `translate(${frame.player.x} ${frame.player.y})`);
      hit.setAttribute('opacity', String(Math.min(0.75, game.hitFlash * 3)));
    }
    const laneAngle = frame.transitioning
      ? (Math.atan2(frame.plan.heading.y, frame.plan.heading.x) * 180) / Math.PI
      : angle;
    lane.setAttribute(
      'transform',
      `translate(${frame.plan.origin.x} ${frame.plan.origin.y}) rotate(${laneAngle})`,
    );
    lane.setAttribute(
      'opacity',
      String(
        (frame.phase === 0 ? 0.45 : frame.phase === 1 ? 1 : mode === 'demo' ? 0.3 : 0.25) *
          frame.overlayOpacity,
      ),
    );
    lane.querySelector('rect').setAttribute('width', String(frame.plan.distance));
    laneGouges.setAttribute(
      'd',
      `M 52 -34 L ${frame.plan.distance - 38} -34 L ${frame.plan.distance - 24} -27 L ${frame.plan.distance - 38} -20 L 52 -20 Z M 52 20 L ${frame.plan.distance - 38} 20 L ${frame.plan.distance - 24} 27 L ${frame.plan.distance - 38} 34 L 52 34 Z`,
    );
    target.setAttribute('transform', `translate(${frame.target.x} ${frame.target.y})`);
    target.setAttribute('opacity', String((frame.phase === 2 ? 0.35 : 0.8) * frame.overlayOpacity));
    const dodgeDirection = Math.sign(frame.dodgeTarget.x - frame.plan.target.x) || 1;
    path.setAttribute(
      'transform',
      `translate(${frame.plan.target.x} ${frame.plan.target.y}) scale(${dodgeDirection} 1)`,
    );
    path.setAttribute(
      'opacity',
      String((frame.phase === 1 ? 0.28 : frame.phase === 2 ? 0.12 : 0) * frame.overlayOpacity),
    );
    bossLabel.setAttribute('x', frame.bossLabel.x);
    bossLabel.setAttribute('y', frame.bossLabel.y);
    playerLabel.setAttribute('x', frame.player.x);
    playerLabel.setAttribute('y', frame.player.y - 62);
    bossLabel.setAttribute('opacity', mode === 'demo' ? '1' : '0');
    playerLabel.setAttribute('opacity', mode === 'demo' ? '1' : '0');
    bossHearts.setAttribute('opacity', mode === 'game' ? '1' : '0');
    playerHearts.setAttribute('opacity', mode === 'game' ? '1' : '0');
    bossHearts.setAttribute('transform', `translate(${frame.bossLabel.x} ${frame.bossLabel.y})`);
    playerHearts.setAttribute('transform', `translate(${frame.player.x} ${frame.player.y - 62})`);
    if (mode === 'game') {
      for (const [index, heart] of bossHeartIcons.entries())
        heart.dataset.full = String(index < game.bossHealth);
      for (const [index, heart] of playerHeartIcons.entries())
        heart.dataset.full = String(index < game.playerHealth);
    }
    currentPhase.dataset.chargePhase = String(frame.phase);
    phaseName.textContent = text.phaseNames[frame.phase];
    phaseTooltip.textContent = text.phaseDescriptions[frame.phase];
    if (mode === 'demo') {
      const state = `${frame.attackIndex}:${frame.phase}`;
      if (state !== announcedState) {
        status.textContent =
          frame.phase === 0 ? text.danger : frame.phase === 1 ? text.locked : text.safe;
        announcedState = state;
      }
      timeline.value = String(Math.round(time * 1000));
      widget.style.setProperty('--charge-progress', `${(time / DURATION) * 100}%`);
      timeline.setAttribute(
        'aria-valuetext',
        `${text.phaseNames[frame.phase]} · ${number.format(time)} / ${number.format(DURATION)}`,
      );
    }
    motionNote.hidden = !reducedMotion.matches || mode !== 'demo';
  }

  function setRunning(next) {
    running = next;
    widget.dataset.chargePlaying = String(running);
    cancelAnimationFrame(animationId);
    lastTimestamp = undefined;
    if (running) animationId = requestAnimationFrame(tick);
  }

  function tick(timestamp) {
    if (!running) return;
    if (lastTimestamp !== undefined) {
      const elapsed = (timestamp - lastTimestamp) / 1000;
      if (mode === 'demo') {
        time = (time + elapsed) % DURATION;
      } else if (mode === 'game') {
        const input = {
          left: pressed.has('ArrowLeft') || pressed.has('KeyA'),
          right: pressed.has('ArrowRight') || pressed.has('KeyD'),
          up: pressed.has('ArrowUp') || pressed.has('KeyW'),
          down: pressed.has('ArrowDown') || pressed.has('KeyS'),
          moveX: stick?.direction.x,
          moveY: stick?.direction.y,
        };
        const oldPlayerHealth = game.playerHealth;
        const oldBossHealth = game.bossHealth;
        advanceChargeGame(game, input, elapsed);
        if (game.playerHealth !== oldPlayerHealth)
          status.textContent = `${text.gameHit} ${healthAnnouncement()}`;
        if (game.bossHealth !== oldBossHealth)
          status.textContent = `${text.gameStrike} ${healthAnnouncement()}`;
        if (game.result) {
          const outcome = game.result === 'won' ? text.gameWon : text.gameLost;
          leaveGame();
          status.textContent = outcome;
          return;
        }
      }
    }
    lastTimestamp = timestamp;
    render();
    animationId = requestAnimationFrame(tick);
  }

  function updatePlayback() {
    if (mode === 'game') setRunning(!document.hidden);
    else
      setRunning(
        mode === 'demo' &&
          !reducedMotion.matches &&
          !document.hidden &&
          !scrubbing &&
          !phaseHovered,
      );
  }

  function startGame() {
    clearTouch();
    game = createChargeGame(wide ? WIDE_CHARGE_ARENA : undefined);
    mode = 'game';
    announcedState = '';
    status.textContent = `${text.gamePlaying} ${healthAnnouncement()}`;
    widget.focus({ preventScroll: true });
    render();
    updatePlayback();
  }

  function leaveGame() {
    clearTouch();
    mode = 'demo';
    game = undefined;
    pressed.clear();
    time = 0;
    announcedState = '';
    render();
    updatePlayback();
  }

  function onKeyDown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (widget.dataset.chargeActivation === 'explicit' && !widget.contains(event.target)) return;
    if (
      event.target.closest('input, textarea, select, [contenteditable="true"]') ||
      (mode === 'demo' &&
        !widget.contains(event.target) &&
        event.target.closest('button, a, summary, [role="button"]'))
    )
      return;
    if (event.code === 'Escape' && mode !== 'demo') {
      event.preventDefault();
      leaveGame();
      return;
    }
    if (!directions[event.code]) return;
    if (mode === 'demo') {
      if (event.repeat) return;
      const bounds = widget.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      startGame();
    }
    event.preventDefault();
    pressed.add(event.code);
  }

  function onKeyUp(event) {
    if (directions[event.code]) pressed.delete(event.code);
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
  canvas.addEventListener('pointerdown', onTouchStart);
  startButton?.addEventListener('click', startGame);
  exitButton?.addEventListener('click', () => {
    leaveGame();
    startButton.focus({ preventScroll: true });
  });
  canvas.addEventListener('pointermove', onTouchMove);
  canvas.addEventListener('pointerup', onTouchEnd);
  canvas.addEventListener('pointercancel', onTouchEnd);
  canvas.addEventListener('lostpointercapture', onTouchEnd);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', () => {
    pressed.clear();
    clearTouch();
  });
  reducedMotion.addEventListener('change', () => {
    render();
    updatePlayback();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pressed.clear();
      clearTouch();
    }
    updatePlayback();
  });
  widget.dataset.chargeReady = 'true';
  render();
  updatePlayback();
}
