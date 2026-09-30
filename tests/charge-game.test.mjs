import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceChargeGame, chargeGameFrame, createChargeGame } from '../src/charge-game.mjs';
import { PHASE_ENDS } from '../src/charge-model.mjs';

function advance(game, input, seconds) {
  for (let elapsed = 0; elapsed < seconds; elapsed += 1 / 60) {
    advanceChargeGame(game, input, Math.min(1 / 60, seconds - elapsed));
  }
}

test('movement tracks during aim, then the charge direction stays locked', () => {
  const game = createChargeGame();
  advance(game, { right: true }, 0.6);
  assert.ok(game.player.x > 280);
  assert.equal(game.plan.target.x, game.player.x);
  advance(game, {}, PHASE_ENDS[0] - 0.6 + 0.01);
  const lockedTarget = { ...game.plan.target };
  advance(game, { left: true }, 0.3);
  assert.ok(game.player.x < lockedTarget.x);
  assert.deepEqual(game.plan.target, lockedTarget);
  assert.deepEqual(chargeGameFrame(game).heading, game.plan.heading);
});

test('idle player is hit once per charge and the round can end in defeat', () => {
  const game = createChargeGame();
  advance(game, {}, 2.35);
  assert.equal(game.playerHealth, 2);
  advance(game, {}, 0.5);
  assert.equal(game.playerHealth, 2);
  advance(game, {}, 7.5);
  assert.equal(game.result, 'lost');
  assert.equal(game.playerHealth, 0);
});

test('sideways movement clears the lane and proximity triggers one strike during recovery', () => {
  const game = createChargeGame();
  advance(game, {}, 1);
  advance(game, { right: true }, 0.5);
  assert.equal(game.player.x, 440);
  advance(game, {}, 0.9);
  assert.equal(game.playerHealth, 3);
  assert.equal(chargeGameFrame(game).recovering, true);

  // Approaching the planted boss is the only attack input.
  game.player = { ...chargeGameFrame(game).boss };
  advanceChargeGame(game, {}, 1 / 60);
  assert.equal(game.bossHealth, 2);
  assert.ok(game.attackFlash > 0);
  advanceChargeGame(game, {}, 1 / 60);
  assert.equal(game.bossHealth, 2);
});

test('proximity outside recovery cannot damage the boss', () => {
  const game = createChargeGame();
  const boss = chargeGameFrame(game).boss;
  game.player = { x: boss.x + 80, y: boss.y };
  advanceChargeGame(game, {}, 1 / 60);
  assert.equal(game.bossHealth, 3);
  assert.equal(game.attackFlash, 0);
});

test('ordinary movement can dodge and win three rounds without taking damage', () => {
  const game = createChargeGame();
  for (let step = 0; step < 720 && !game.result; step++) {
    const frame = chargeGameFrame(game);
    let destination;
    if (frame.phase === 0 || frame.transitioning) {
      destination = { x: 280, y: 480 };
    } else if (frame.phase === 1 || frame.chargeActive) {
      const side = frame.plan.heading.x < 0 ? -1 : 1;
      destination = {
        x: Math.max(120, Math.min(440, frame.plan.target.x - frame.plan.heading.y * side * 160)),
        y: Math.max(305, Math.min(655, frame.plan.target.y + frame.plan.heading.x * side * 160)),
      };
    } else {
      destination = frame.boss;
    }
    const dx = destination.x - game.player.x;
    const dy = destination.y - game.player.y;
    advanceChargeGame(
      game,
      {
        left: dx < -4,
        right: dx > 4,
        up: dy < -4,
        down: dy > 4,
      },
      1 / 60,
    );
  }
  assert.equal(game.result, 'won');
  assert.equal(game.playerHealth, 3);
  assert.equal(game.bossHealth, 0);
});
