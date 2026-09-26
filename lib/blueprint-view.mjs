import { BLUEPRINT_DURATION, blueprintFrame } from '../src/blueprint-model.mjs';
import { CHARACTER_ART } from './character-art.mjs';
import { renderEncounterArena, renderEncounterEffects } from './encounter-view.mjs';
import { renderSweepBoss } from './sweep-weapon-view.mjs';

const escape = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
  );
const json = (value) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

const primitiveAttributes = (primitive, preview = false) => {
  const previewColors = {
    accent: 'var(--accent)',
    muted: 'var(--muted)',
    safe: '#b9e59f',
    signal: 'var(--signal)',
  };
  const previewOpacityFloor = {
    accent: 0.28,
    muted: 0.26,
    safe: 0.42,
    signal: 0.38,
  };
  const opacity =
    preview && primitive.opacity > 0
      ? Math.max(primitive.opacity, previewOpacityFloor[primitive.tone] ?? 0.28)
      : primitive.opacity;
  const strokeWidth =
    preview && primitive.width > 0
      ? Math.max(2, Math.min(8, primitive.width * 0.22))
      : primitive.width;
  const color = preview ? (previewColors[primitive.tone] ?? 'currentColor') : 'currentColor';
  const shared = `class="blueprint-tone--${escape(primitive.tone)}" opacity="${opacity}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"${primitive.dash ? ` stroke-dasharray="${escape(primitive.dash)}"` : ''}`;
  const fill = primitive.fill ? `fill="${color}" fill-opacity="${primitive.fill}"` : 'fill="none"';
  if (primitive.type === 'circle')
    return `<circle ${shared} cx="${primitive.x}" cy="${primitive.y}" r="${primitive.radius}" ${fill} />`;
  if (primitive.type === 'line')
    return `<line ${shared} x1="${primitive.x1}" y1="${primitive.y1}" x2="${primitive.x2}" y2="${primitive.y2}" fill="none" />`;
  if (primitive.type === 'rect')
    return `<rect ${shared} x="${primitive.x}" y="${primitive.y}" width="${primitive.rectWidth}" height="${primitive.rectHeight}" rx="8" ${fill} />`;
  return `<path ${shared} d="${escape(primitive.data)}" ${fill} />`;
};

const renderPrimitives = (primitives, dataAttribute = true, preview = false, indexOffset = 0) =>
  primitives
    .map(
      (primitive, index) =>
        `<g${dataAttribute ? ` data-blueprint-primitive="${index + indexOffset}"` : ''}>${primitiveAttributes(primitive, preview)}</g>`,
    )
    .join('');

const PREVIEW_TIMES = Object.freeze({
  'landing-jump': 2.98,
  'single-shot': 3.02,
  crossfire: 3.06,
  'splitting-projectile': 3.22,
  'returning-projectile': 3.54,
  'orbiting-projectiles': 3.12,
  'pulse-beam': 3.06,
  'chain-explosions': 3.12,
  mine: 3.08,
  'moving-hazard': 3.12,
  'converging-threats': 3.25,
  pull: 3.12,
  'turret-deployment': 3.08,
  'threat-generator': 3.46,
  decoy: 3.22,
  'predictive-aiming': 3.04,
  'source-tracking': 2.96,
  'burst-fire': 3.12,
  volley: 2.82,
  'delayed-activation': 3.42,
  'speed-change': 3.15,
  'limited-spread': 3.12,
  'directional-shield': 2.05,
  'damage-type-resistance': 3.55,
  'situational-immunity': 3.55,
  'part-break': 3.78,
  'attack-reflection': 2.92,
  'counter-stance': 2.64,
  'absorption-power-up': 3.28,
  'interruptible-wind-up': 1.58,
  'loadout-adaptation': 3.52,
  'wind-up': 3.82,
  'attack-lock': 3.82,
  'active-phase': 1.88,
  recovery: 3.28,
  'survival-phase': 3.16,
  teleport: 2.52,
  'boundary-attack': 1.98,
  'forced-scrolling': 3.18,
  'chase-herding': 3.08,
  'escape-phase': 2.52,
  'relocated-arena': 2.82,
  'control-mode-shift': 2.62,
  'boss-as-terrain': 3.72,
  'cover-line-of-sight': 2.62,
  'forced-inertia': 2.42,
  'wraparound-projectile': 2.36,
  'beat-synced-attack': 2.3,
  'secondary-cues-invisibility': 2.86,
  'sound-detection': 2.98,
  'objective-linked-invulnerability': 3.46,
  'wave-clear-objective': 3.94,
  'environmental-weapon': 3.34,
  'encounter-specific-tool': 3.34,
  'player-controlled-boss': 3.78,
  'projectile-rally': 3.68,
  'baited-self-hit': 2.72,
  'posture-stagger-gauge': 2.82,
  'pacifist-resolution': 2.82,
  'persistent-progress': 3.55,
  'status-buildup': 2.8,
  'instant-kill': 3.08,
  'maximum-health-reduction': 3.62,
  'ability-lock': 3.22,
  'resource-steal': 3.72,
  'on-hit-healing': 2.88,
  'self-heal-cast': 3.74,
  'external-healing-source': 3.58,
  'damage-rate-cap': 3.18,
  'loadout-mirror': 3.62,
  'moveset-shapeshifting': 4.48,
  'ally-theft': 2.55,
  'false-death': 2.72,
  'action-reactive-punish': 1.5,
  'run-history-manifestation': 2.52,
  'real-time-progression': 3.48,
  'interface-interaction': 2.22,
  'world-state-variant': 2.52,
  'party-size-scaling': 2.5,
  'partner-revival': 3.04,
  'kill-order-inheritance': 4.75,
  'shared-group-health': 3.45,
  'coordinated-duo-attack': 2.36,
  'stack-damage': 2.35,
  'personal-spread': 2.08,
  'tower-soak': 2.08,
  'entity-tether': 2.31,
  'gaze-check': 2.31,
  'proximity-damage': 2.31,
  'tank-swap': 3.55,
  'debuff-handoff': 2.32,
  'ordered-targets': 2.05,
  'pairing-polarity': 2.45,
  'party-split': 3.48,
  'wide-swing': 2.35,
  lunge: 1.92,
  grab: 1.28,
  'burrow-and-emerge': 1.46,
  'ring-volley': 3.08,
  'spiral-barrage': 3.22,
  'ricochet-projectile': 3.34,
  'homing-projectile': 3.18,
  'straight-beam': 2.76,
  'scanning-beam': 3.31,
  'rotating-beams': 2.91,
  'marked-area-strike': 1.24,
  shockwave: 3.04,
  'lingering-hazard': 3.38,
  'hazard-trail': 3.32,
  'platform-destruction': 3.42,
  'shrinking-safe-area': 3.68,
  knockback: 2.79,
  'target-lock': 1.18,
  'attack-combination': 3.36,
  'weak-point': 2.87,
  telegraph: 1.26,
  'fight-phase': 3.44,
  enrage: 3.48,
});

const FULL_HEIGHT_SCENES = new Set([
  'on-hit-healing',
  'self-heal-cast',
  'external-healing-source',
  'damage-rate-cap',
  'loadout-mirror',
  'moveset-shapeshifting',
  'ally-theft',
  'kill-order-inheritance',
  'shared-group-health',
  'coordinated-duo-attack',
  'stack-damage',
  'personal-spread',
  'tower-soak',
  'entity-tether',
  'gaze-check',
  'proximity-damage',
  'tank-swap',
  'debuff-handoff',
  'ordered-targets',
  'pairing-polarity',
  'party-split',
  'partner-revival',
  'party-size-scaling',
  'world-state-variant',
  'interface-interaction',
  'real-time-progression',
  'run-history-manifestation',
  'turret-deployment',
  'action-reactive-punish',
  'false-death',
  'resource-steal',
  'ability-lock',
  'maximum-health-reduction',
  'instant-kill',
  'status-buildup',
  'persistent-progress',
  'pacifist-resolution',
  'posture-stagger-gauge',
  'baited-self-hit',
  'projectile-rally',
  'player-controlled-boss',
  'encounter-specific-tool',
  'environmental-weapon',
  'wave-clear-objective',
  'objective-linked-invulnerability',
  'sound-detection',
  'secondary-cues-invisibility',
  'beat-synced-attack',
  'wraparound-projectile',
  'forced-inertia',
  'cover-line-of-sight',
  'boss-as-terrain',
  'control-mode-shift',
  'relocated-arena',
  'escape-phase',
  'chase-herding',
  'forced-scrolling',
  'boundary-attack',
  'teleport',
  'survival-phase',
  'enrage',
  'fight-phase',
  'recovery',
  'active-phase',
  'attack-lock',
  'wind-up',
  'telegraph',
  'loadout-adaptation',
  'interruptible-wind-up',
  'absorption-power-up',
  'counter-stance',
  'attack-reflection',
  'part-break',
  'weak-point',
  'situational-immunity',
  'damage-type-resistance',
  'directional-shield',
  'limited-spread',
  'speed-change',
  'delayed-activation',
  'attack-combination',
  'volley',
  'burst-fire',
  'homing-projectile',
  'source-tracking',
  'predictive-aiming',
  'target-lock',
  'decoy',
  'threat-generator',
  'turret-deployment',
  'knockback',
  'pull',
  'shrinking-safe-area',
  'platform-destruction',
  'converging-threats',
  'moving-hazard',
  'hazard-trail',
  'mine',
  'lingering-hazard',
  'shockwave',
  'chain-explosions',
  'marked-area-strike',
  'pulse-beam',
  'rotating-beams',
  'scanning-beam',
  'straight-beam',
  'orbiting-projectiles',
  'returning-projectile',
  'splitting-projectile',
  'ricochet-projectile',
  'crossfire',
  'spiral-barrage',
  'ring-volley',
  'single-shot',
  'burrow-and-emerge',
  'grab',
  'landing-jump',
  'lunge',
  'wide-swing',
]);
const QUIET_SCENES = new Set([
  'landing-jump',
  'attack-lock',
  'boundary-attack',
  'cover-line-of-sight',
  'decoy',
]);

const SCREEN_HEIGHT_SCENES = new Set([
  'party-split',
  'pairing-polarity',
  'ordered-targets',
  'debuff-handoff',
  'tank-swap',
  'proximity-damage',
  'gaze-check',
  'entity-tether',
  'tower-soak',
  'personal-spread',
  'stack-damage',
  'coordinated-duo-attack',
  'shared-group-health',
  'kill-order-inheritance',
  'partner-revival',
  'on-hit-healing',
  'self-heal-cast',
  'external-healing-source',
  'damage-rate-cap',
  'loadout-mirror',
  'moveset-shapeshifting',
  'ally-theft',
  'false-death',
  'action-reactive-punish',
  'run-history-manifestation',
  'real-time-progression',
  'interface-interaction',
  'world-state-variant',
  'party-size-scaling',
]);

// These first primitives are legacy arena trim. Keep their indices aligned with playback.
const OMITTED_SCENE_PRIMITIVE_COUNT = Object.freeze({
  'absorption-power-up': 3,
  'counter-stance': 3,
  'attack-reflection': 3,
  'part-break': 3,
  'weak-point': 3,
  'situational-immunity': 3,
  'damage-type-resistance': 3,
  'directional-shield': 3,
});

const scenePath = (data, opacity, tone, fill) => ({
  type: 'path',
  data,
  opacity,
  tone,
  width: 0,
  fill,
});

// Retain fixed scenery only when it identifies a source, rebound wall, or platform.
const STATIC_SCENE_DETAILS = Object.freeze({
  crossfire: [
    scenePath(
      'M 55 285 H 95 L 120 315 L 95 345 H 55 Z M 505 285 H 465 L 440 315 L 465 345 H 505 Z',
      0.44,
      'muted',
      0.78,
    ),
  ],
  'ricochet-projectile': [
    scenePath('M 483 365 H 512 V 479 H 483 Z M 48 548 H 126 V 662 H 48 Z', 0.38, 'muted', 0.74),
  ],
  'platform-destruction': [
    scenePath(
      'M 58 733 H 502 V 878 H 58 Z M 65 623 H 158 L 149 646 H 73 Z M 401 623 H 494 L 486 646 H 410 Z',
      0.33,
      'muted',
      0.72,
    ),
  ],
});

const PREVIEW_CAMERA = Object.freeze({ x: 34, y: 22, scaleX: 0.52, scaleY: 0.155 });

const previewPoint = ({ x, y }, camera = PREVIEW_CAMERA) => ({
  x: camera.x + x * camera.scaleX,
  y: camera.y + y * camera.scaleY,
});

export function blueprintPreviewLayout(mechanicId) {
  const time = PREVIEW_TIMES[mechanicId] ?? 2.75;
  const frame = blueprintFrame(mechanicId, time);
  const camera =
    mechanicId === 'wide-swing' ? { x: 34, y: 19, scaleX: 0.52, scaleY: 0.13 } : PREVIEW_CAMERA;
  return Object.freeze({
    time,
    frame,
    boss: previewPoint(frame.boss, camera),
    player: previewPoint(frame.player, camera),
    decoy: frame.decoy ? previewPoint(frame.decoy, camera) : null,
    allies:
      (
        frame.stackDamageAllies ??
        frame.personalSpreadPositions?.slice(1) ??
        (frame.towerSoakAlly ? [frame.towerSoakAlly] : null) ??
        (frame.entityTetherAlly ? [frame.entityTetherAlly] : null) ??
        (frame.tankSwapAlly ? [frame.tankSwapAlly] : null) ??
        (frame.debuffHandoffAlly ? [frame.debuffHandoffAlly] : null) ??
        frame.orderedTargetAllies ??
        frame.pairingPolarityAllies ??
        frame.partySplitAllies
      )?.map((ally) => previewPoint(ally, camera)) ?? null,
    geometryTransform: `translate(${camera.x} ${camera.y}) scale(${camera.scaleX} ${camera.scaleY})`,
  });
}

export function renderBlueprint(demo, mechanicId) {
  const initial = blueprintFrame(mechanicId, 0);
  const staticScene = QUIET_SCENES.has(mechanicId) ? [] : (STATIC_SCENE_DETAILS[mechanicId] ?? []);
  const staticSceneLayer = staticScene.length
    ? `<g aria-hidden="true">${renderPrimitives(staticScene, false)}</g>`
    : '';
  const backgroundCount = OMITTED_SCENE_PRIMITIVE_COUNT[mechanicId] ?? 0;
  const primitiveLayer = `<g data-blueprint-primitives aria-hidden="true">${renderPrimitives(initial.primitives.slice(backgroundCount), true, false, backgroundCount)}</g>`;
  const sourceInFront =
    mechanicId === 'burst-fire' ||
    mechanicId === 'volley' ||
    mechanicId === 'limited-spread' ||
    mechanicId === 'directional-shield' ||
    mechanicId === 'damage-type-resistance' ||
    mechanicId === 'situational-immunity' ||
    mechanicId === 'part-break' ||
    mechanicId === 'weak-point' ||
    mechanicId === 'attack-reflection' ||
    mechanicId === 'counter-stance' ||
    mechanicId === 'absorption-power-up' ||
    mechanicId === 'boundary-attack' ||
    mechanicId === 'boss-as-terrain' ||
    mechanicId === 'cover-line-of-sight' ||
    mechanicId === 'player-controlled-boss' ||
    mechanicId === 'encounter-specific-tool' ||
    mechanicId === 'environmental-weapon' ||
    mechanicId === 'objective-linked-invulnerability' ||
    mechanicId === 'projectile-rally' ||
    mechanicId === 'baited-self-hit' ||
    mechanicId === 'posture-stagger-gauge' ||
    mechanicId === 'pacifist-resolution' ||
    mechanicId === 'persistent-progress' ||
    mechanicId === 'status-buildup' ||
    mechanicId === 'instant-kill' ||
    mechanicId === 'maximum-health-reduction' ||
    mechanicId === 'ability-lock' ||
    mechanicId === 'resource-steal' ||
    mechanicId === 'on-hit-healing' ||
    mechanicId === 'self-heal-cast' ||
    mechanicId === 'external-healing-source' ||
    mechanicId === 'damage-rate-cap' ||
    mechanicId === 'loadout-mirror' ||
    mechanicId === 'moveset-shapeshifting' ||
    mechanicId === 'ally-theft' ||
    mechanicId === 'false-death' ||
    mechanicId === 'action-reactive-punish' ||
    mechanicId === 'run-history-manifestation' ||
    mechanicId === 'real-time-progression' ||
    mechanicId === 'interface-interaction' ||
    mechanicId === 'world-state-variant' ||
    mechanicId === 'party-size-scaling' ||
    mechanicId === 'partner-revival' ||
    mechanicId === 'kill-order-inheritance' ||
    mechanicId === 'shared-group-health' ||
    mechanicId === 'coordinated-duo-attack' ||
    mechanicId === 'stack-damage' ||
    mechanicId === 'personal-spread' ||
    mechanicId === 'tower-soak' ||
    mechanicId === 'entity-tether' ||
    mechanicId === 'gaze-check' ||
    mechanicId === 'tank-swap' ||
    mechanicId === 'debuff-handoff' ||
    mechanicId === 'ordered-targets' ||
    mechanicId === 'pairing-polarity' ||
    mechanicId === 'party-split';
  return /* HTML */ `<section
    class="blueprint-demo"
    data-blueprint-demo
    data-blueprint-id="${escape(mechanicId)}"
    data-blueprint-full-height="${FULL_HEIGHT_SCENES.has(mechanicId)}"
    data-blueprint-screen-height="${SCREEN_HEIGHT_SCENES.has(mechanicId)}"
    aria-label="${escape(demo.title)}"
    ${demo.fallbackAttributes ?? ''}
  >
    <div class="blueprint-demo__canvas">
      <div class="blueprint-demo__scene-timeline">
        <span
          class="blueprint-demo__phase-label"
          data-blueprint-current-phase
          tabindex="0"
          aria-current="step"
          aria-describedby="blueprint-phase-tooltip-${escape(mechanicId)}"
          ><span data-blueprint-phase-name>${escape(demo.phaseNames[0])}</span
          ><span
            class="blueprint-demo__phase-tooltip"
            id="blueprint-phase-tooltip-${escape(mechanicId)}"
            data-blueprint-phase-tooltip
            role="tooltip"
            >${escape(demo.phaseDescriptions[0])}</span
          ></span
        >
        <label class="blueprint-demo__timeline"
          ><span class="blueprint-demo__visually-hidden">${escape(demo.timeline)}</span
          ><input
            type="range"
            data-blueprint-timeline
            min="0"
            max="${BLUEPRINT_DURATION * 1000}"
            step="10"
            value="0"
        /></label>
      </div>
      <svg
        class="blueprint-demo__svg"
        data-blueprint-svg
        viewBox="0 0 560 960"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="${escape(demo.diagramDescription)}"
        direction="ltr"
      >
        <title>${escape(demo.title)}</title>
        <desc>${escape(demo.diagramDescription)}</desc>
        ${renderEncounterArena(`blueprint-${mechanicId}`, { minimal: FULL_HEIGHT_SCENES.has(mechanicId), quiet: QUIET_SCENES.has(mechanicId) })}
        ${staticSceneLayer} ${sourceInFront ? '' : primitiveLayer} ${renderEncounterEffects()}
        ${
          initial.decoy
            ? `<g data-blueprint-decoy transform="translate(${initial.decoy.x} ${initial.decoy.y})" opacity="${initial.decoy.opacity}" aria-hidden="true">${CHARACTER_ART.kern.replace('data-character-art="kern"', 'data-character-art="kern-decoy"')}</g>`
            : ''
        }
        <g data-blueprint-boss transform="translate(${initial.boss.x} ${initial.boss.y})">
          ${mechanicId === 'wide-swing' ? renderSweepBoss(initial.wideSwingWeapon) : CHARACTER_ART.kern}
        </g>
        ${sourceInFront ? primitiveLayer : ''}
        ${
          mechanicId === 'stack-damage' ||
          mechanicId === 'personal-spread' ||
          mechanicId === 'tower-soak' ||
          mechanicId === 'entity-tether' ||
          mechanicId === 'tank-swap' ||
          mechanicId === 'debuff-handoff' ||
          mechanicId === 'ordered-targets' ||
          mechanicId === 'pairing-polarity' ||
          mechanicId === 'party-split'
            ? (
                initial.stackDamageAllies ??
                initial.personalSpreadPositions?.slice(1) ??
                initial.orderedTargetAllies ??
                initial.pairingPolarityAllies ??
                initial.partySplitAllies ?? [
                  initial.towerSoakAlly ??
                    initial.entityTetherAlly ??
                    initial.tankSwapAlly ??
                    initial.debuffHandoffAlly,
                ]
              )
                .map(
                  (ally, index) =>
                    `<g data-blueprint-ally="${index}" transform="translate(${ally.x} ${ally.y}) scale(.78)" aria-hidden="true">${CHARACTER_ART.tavi.replace('data-character-art="tavi"', `data-character-art="tavi-ally-${index}"`)}</g>`,
                )
                .join('')
            : ''
        }
        <g data-blueprint-player transform="translate(${initial.player.x} ${initial.player.y})">
          ${CHARACTER_ART.tavi}
        </g>
        ${mechanicId === 'stack-damage' ? `<text data-blueprint-stack-health="1" x="145" y="177" text-anchor="middle" class="blueprint-demo__entity-label"></text><text data-blueprint-stack-health="0" x="280" y="177" text-anchor="middle" class="blueprint-demo__entity-label"></text><text data-blueprint-stack-health="2" x="415" y="177" text-anchor="middle" class="blueprint-demo__entity-label"></text><text data-blueprint-stack-readout x="280" y="202" text-anchor="middle" class="blueprint-demo__entity-label"></text>` : ''}
        ${mechanicId === 'personal-spread' ? `<text data-blueprint-spread-health="1" x="145" y="177" text-anchor="middle" class="blueprint-demo__entity-label"></text><text data-blueprint-spread-health="0" x="280" y="177" text-anchor="middle" class="blueprint-demo__entity-label"></text><text data-blueprint-spread-health="2" x="415" y="177" text-anchor="middle" class="blueprint-demo__entity-label"></text><text data-blueprint-spread-readout x="280" y="202" text-anchor="middle" class="blueprint-demo__entity-label"></text>` : ''}
        ${mechanicId === 'tower-soak' ? `<text data-blueprint-tower-health="0" x="195" y="177" text-anchor="middle" class="blueprint-demo__entity-label"></text><text data-blueprint-tower-health="1" x="365" y="177" text-anchor="middle" class="blueprint-demo__entity-label"></text><text data-blueprint-tower-readout x="280" y="202" text-anchor="middle" class="blueprint-demo__entity-label"></text>` : ''}
        ${mechanicId === 'entity-tether' ? `<text data-blueprint-tether-health="0" x="195" y="177" text-anchor="middle" class="blueprint-demo__entity-label"></text><text data-blueprint-tether-health="1" x="365" y="177" text-anchor="middle" class="blueprint-demo__entity-label"></text><text data-blueprint-tether-readout x="280" y="202" text-anchor="middle" class="blueprint-demo__entity-label"></text>` : ''}
        ${mechanicId === 'gaze-check' ? `<text data-blueprint-gaze-health x="280" y="112" text-anchor="middle" class="blueprint-demo__entity-label"></text><text data-blueprint-gaze-facing x="425" y="183" text-anchor="middle" class="blueprint-demo__entity-label"></text>` : ''}
        ${mechanicId === 'proximity-damage' ? `<text x="200" y="112" text-anchor="start" class="blueprint-demo__entity-label">${escape(demo.player)}</text><text data-blueprint-proximity-health x="280" y="112" text-anchor="middle" class="blueprint-demo__entity-label"></text><text data-blueprint-proximity-readout x="420" y="183" text-anchor="middle" class="blueprint-demo__entity-label"></text>` : ''}
        ${mechanicId === 'tank-swap' ? `<text x="172" y="109" text-anchor="middle" class="blueprint-demo__entity-label">${escape(demo.player)} 1</text><text x="390" y="109" text-anchor="middle" class="blueprint-demo__entity-label">${escape(demo.player)} 2</text><text data-blueprint-tank-health="0" x="172" y="174" text-anchor="middle" class="blueprint-demo__entity-label"></text><text data-blueprint-tank-health="1" x="390" y="174" text-anchor="middle" class="blueprint-demo__entity-label"></text>` : ''}
        ${mechanicId === 'debuff-handoff' ? `<text x="160" y="112" text-anchor="middle" class="blueprint-demo__entity-label">${escape(demo.player)} 1</text><text x="400" y="112" text-anchor="middle" class="blueprint-demo__entity-label">${escape(demo.player)} 2</text><text data-blueprint-handoff-timer x="280" y="112" text-anchor="middle" class="blueprint-demo__entity-label"></text>` : ''}
        ${mechanicId === 'ordered-targets' ? `<text data-blueprint-order-next x="280" y="112" text-anchor="middle" class="blueprint-demo__entity-label"></text><text data-blueprint-order-mark="0" x="165" y="563" text-anchor="middle" class="blueprint-demo__entity-label blueprint-demo__entity-label--number">1</text><text data-blueprint-order-mark="1" x="280" y="563" text-anchor="middle" class="blueprint-demo__entity-label blueprint-demo__entity-label--number">2</text><text data-blueprint-order-mark="2" x="395" y="563" text-anchor="middle" class="blueprint-demo__entity-label blueprint-demo__entity-label--number">3</text>` : ''}
        ${mechanicId === 'pairing-polarity' ? `<text data-blueprint-polarity-mark="0" x="155" y="558" text-anchor="middle" class="blueprint-demo__entity-label blueprint-demo__entity-label--number">+</text><text data-blueprint-polarity-mark="1" x="255" y="558" text-anchor="middle" class="blueprint-demo__entity-label blueprint-demo__entity-label--number">+</text><text data-blueprint-polarity-mark="2" x="355" y="558" text-anchor="middle" class="blueprint-demo__entity-label blueprint-demo__entity-label--number">−</text><text data-blueprint-polarity-mark="3" x="455" y="558" text-anchor="middle" class="blueprint-demo__entity-label blueprint-demo__entity-label--number">−</text>` : ''}
        ${mechanicId === 'party-split' ? `<text x="160" y="490" text-anchor="middle" class="blueprint-demo__entity-label">I</text><text x="400" y="490" text-anchor="middle" class="blueprint-demo__entity-label">II</text><text data-blueprint-split-gate x="280" y="448" text-anchor="middle" class="blueprint-demo__entity-label"></text>` : ''}
        ${
          mechanicId === 'shared-group-health'
            ? `<text
          data-blueprint-group-health-label
          x="280"
          y="177"
          text-anchor="middle"
          class="blueprint-demo__entity-label"
        >${initial.sharedGroupHealthCurrentHealth} / 100</text>`
            : ''
        }
        <text
          data-blueprint-boss-label
          x="${initial.bossLabel.x}"
          y="${initial.bossLabel.y}"
          text-anchor="middle"
          class="blueprint-demo__entity-label"
        >
          ${escape(demo.boss)}
        </text>
        ${
          mechanicId === 'partner-revival' ||
          mechanicId === 'kill-order-inheritance' ||
          mechanicId === 'shared-group-health' ||
          mechanicId === 'coordinated-duo-attack'
            ? `<text
          data-blueprint-partner-label
          x="${initial.decoy.x}"
          y="${initial.decoy.y + 92}"
          text-anchor="middle"
          class="blueprint-demo__entity-label"
        >${escape(demo.boss)}</text>`
            : ''
        }
        <text
          data-blueprint-player-label
          x="${initial.playerLabel.x}"
          y="${initial.playerLabel.y}"
          text-anchor="middle"
          class="blueprint-demo__entity-label blueprint-demo__entity-label--player"
        >
          ${escape(demo.player)}
        </text>
      </svg>
    </div>
    <p
      class="blueprint-demo__visually-hidden"
      data-blueprint-status
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      ${escape(demo.phaseDescriptions[0])}
    </p>
    <p class="blueprint-demo__motion-note" data-blueprint-motion-note hidden>
      ${escape(demo.reducedMotion)}
    </p>
    <script type="application/json" data-blueprint-config>
      ${json(demo)}
    </script>
  </section>`;
}

export function renderBlueprintThumbnail(mechanicId, id) {
  const preview = blueprintPreviewLayout(mechanicId);
  const { frame } = preview;
  const staticScene = QUIET_SCENES.has(mechanicId) ? [] : (STATIC_SCENE_DETAILS[mechanicId] ?? []);
  const staticSceneLayer = staticScene.length
    ? `<g clip-path="url(#blueprint-preview-clip-${escape(id)})"><g transform="${preview.geometryTransform}">${renderPrimitives(staticScene, false, true)}</g></g>`
    : '';
  const backgroundCount = OMITTED_SCENE_PRIMITIVE_COUNT[mechanicId] ?? 0;
  const geometryLayer = `<g clip-path="url(#blueprint-preview-clip-${escape(id)})"><g transform="${preview.geometryTransform}">${renderPrimitives(frame.primitives.slice(backgroundCount), false, true)}</g></g>`;
  const sourceInFront =
    mechanicId === 'burst-fire' ||
    mechanicId === 'volley' ||
    mechanicId === 'limited-spread' ||
    mechanicId === 'directional-shield' ||
    mechanicId === 'damage-type-resistance' ||
    mechanicId === 'situational-immunity' ||
    mechanicId === 'part-break' ||
    mechanicId === 'weak-point' ||
    mechanicId === 'attack-reflection' ||
    mechanicId === 'counter-stance' ||
    mechanicId === 'absorption-power-up' ||
    mechanicId === 'boundary-attack' ||
    mechanicId === 'boss-as-terrain' ||
    mechanicId === 'cover-line-of-sight' ||
    mechanicId === 'player-controlled-boss' ||
    mechanicId === 'encounter-specific-tool' ||
    mechanicId === 'environmental-weapon' ||
    mechanicId === 'objective-linked-invulnerability' ||
    mechanicId === 'projectile-rally' ||
    mechanicId === 'baited-self-hit' ||
    mechanicId === 'posture-stagger-gauge' ||
    mechanicId === 'pacifist-resolution' ||
    mechanicId === 'persistent-progress' ||
    mechanicId === 'status-buildup' ||
    mechanicId === 'instant-kill' ||
    mechanicId === 'maximum-health-reduction' ||
    mechanicId === 'ability-lock' ||
    mechanicId === 'resource-steal' ||
    mechanicId === 'on-hit-healing' ||
    mechanicId === 'self-heal-cast' ||
    mechanicId === 'external-healing-source' ||
    mechanicId === 'damage-rate-cap' ||
    mechanicId === 'loadout-mirror' ||
    mechanicId === 'moveset-shapeshifting' ||
    mechanicId === 'ally-theft' ||
    mechanicId === 'false-death' ||
    mechanicId === 'action-reactive-punish' ||
    mechanicId === 'run-history-manifestation' ||
    mechanicId === 'real-time-progression' ||
    mechanicId === 'interface-interaction' ||
    mechanicId === 'world-state-variant' ||
    mechanicId === 'party-size-scaling' ||
    mechanicId === 'partner-revival' ||
    mechanicId === 'kill-order-inheritance' ||
    mechanicId === 'shared-group-health' ||
    mechanicId === 'coordinated-duo-attack' ||
    mechanicId === 'stack-damage' ||
    mechanicId === 'personal-spread' ||
    mechanicId === 'tower-soak' ||
    mechanicId === 'entity-tether' ||
    mechanicId === 'gaze-check';
  return /* HTML */ `<svg
    viewBox="0 0 360 160"
    data-blueprint-preview="${escape(mechanicId)}"
    data-blueprint-preview-time="${preview.time}"
  >
    <defs>
      <pattern
        id="blueprint-preview-${escape(id)}"
        width="24"
        height="24"
        patternUnits="userSpaceOnUse"
      >
        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--diagram-preview-grid)" />
      </pattern>
      <clipPath id="blueprint-preview-clip-${escape(id)}">
        <rect width="360" height="160" />
      </clipPath>
    </defs>
    <rect
      width="360"
      height="160"
      fill="${FULL_HEIGHT_SCENES.has(mechanicId) || QUIET_SCENES.has(mechanicId) ? '#203330' : `url(#blueprint-preview-${escape(id)})`}"
    />
    ${staticSceneLayer} ${sourceInFront ? '' : geometryLayer}
    <g
      data-character-art-preview="kern"
      transform="translate(${preview.boss.x} ${preview.boss.y}) scale(${0.52 * frame.bossScale})"
      opacity="${frame.bossVisible}"
    >
      ${mechanicId === 'wide-swing' ? renderSweepBoss(frame.wideSwingWeapon) : CHARACTER_ART.kern}
    </g>
    ${sourceInFront ? geometryLayer : ''}
    ${
      mechanicId === 'stack-damage' ||
      mechanicId === 'personal-spread' ||
      mechanicId === 'tower-soak' ||
      mechanicId === 'entity-tether' ||
      mechanicId === 'tank-swap' ||
      mechanicId === 'debuff-handoff' ||
      mechanicId === 'ordered-targets' ||
      mechanicId === 'pairing-polarity' ||
      mechanicId === 'party-split'
        ? preview.allies
            .map(
              (ally, index) =>
                `<g data-character-art-preview="tavi-ally-${index}" transform="translate(${ally.x} ${ally.y}) scale(.42)">${CHARACTER_ART.tavi.replace('data-character-art="tavi"', `data-character-art="tavi-ally-${index}"`)}</g>`,
            )
            .join('')
        : ''
    }
    ${
      frame.decoy
        ? `<g data-character-art-preview="kern-decoy" transform="translate(${preview.decoy.x} ${preview.decoy.y}) scale(.52)" opacity="${frame.decoy.opacity}">${CHARACTER_ART.kern.replace('data-character-art="kern"', 'data-character-art="kern-decoy"')}</g>`
        : ''
    }
    <g
      data-character-art-preview="tavi"
      transform="translate(${preview.player.x} ${preview.player.y}) scale(.68)"
    >
      ${
        (mechanicId === 'pacifist-resolution' && frame.pacifistWeaponSheathed) ||
        (mechanicId === 'encounter-specific-tool' && frame.encounterToolEquipped)
          ? CHARACTER_ART.tavi.replace(
              'data-rig-part="weapon"',
              'data-rig-part="weapon" opacity="0"',
            )
          : CHARACTER_ART.tavi
      }
    </g>
  </svg>`;
}
