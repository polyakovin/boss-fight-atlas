export const MECHANIC_TAXONOMY = {
  geometry: ['line', 'arc', 'radial', 'zone', 'arena', 'target', 'entity'],
  signal: ['pose', 'marker', 'trajectory', 'rhythm', 'environment', 'state'],
  response: [
    'dodge',
    'reposition',
    'interrupt',
    'counter',
    'attack',
    'interact',
    'coordinate',
    'manage',
  ],
  dimension: ['2d', '3d'],
};

const CATEGORY_DEFAULTS = {
  'Body and melee': {
    geometry: ['arc'],
    signal: ['pose'],
    response: ['dodge', 'reposition'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'threat-geometry', 'counterplay', 'commitment'],
  },
  Projectiles: {
    geometry: ['line'],
    signal: ['trajectory'],
    response: ['dodge', 'reposition', 'counter'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'threat-geometry', 'counterplay'],
  },
  Beams: {
    geometry: ['line'],
    signal: ['marker', 'trajectory'],
    response: ['dodge', 'reposition'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'threat-geometry', 'progress-clarity'],
  },
  'Zones and traps': {
    geometry: ['zone'],
    signal: ['marker'],
    response: ['reposition'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'threat-geometry', 'counterplay'],
  },
  Arena: {
    geometry: ['arena'],
    signal: ['environment'],
    response: ['reposition', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['threat-geometry', 'context-and-sequence', 'difficulty-rhythm'],
  },
  'Additional targets': {
    geometry: ['entity'],
    signal: ['state'],
    response: ['attack', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['progress-clarity', 'player-expression', 'counterplay'],
  },
  'Targeting and rhythm': {
    geometry: ['target'],
    signal: ['marker', 'rhythm'],
    response: ['dodge', 'reposition'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'commitment', 'difficulty-rhythm'],
  },
  Defense: {
    geometry: ['target'],
    signal: ['state'],
    response: ['attack', 'interrupt', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['progress-clarity', 'counterplay', 'risk-reward'],
  },
  'Structure and readability': {
    geometry: ['target'],
    signal: ['state', 'rhythm'],
    response: ['manage'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'progress-clarity', 'phase-structure', 'difficulty-rhythm'],
  },
  'Space, movement, and perception': {
    geometry: ['arena'],
    signal: ['environment'],
    response: ['reposition', 'interact'],
    dimensions: ['2d', '3d'],
    lenses: ['threat-geometry', 'context-and-sequence', 'rule-exception'],
  },
  'Encounter goals and vulnerability': {
    geometry: ['entity'],
    signal: ['state'],
    response: ['interact', 'attack'],
    dimensions: ['2d', '3d'],
    lenses: ['encounter-purpose', 'progress-clarity', 'player-expression', 'access-paths'],
  },
  'States, resources, and scaling': {
    geometry: ['target'],
    signal: ['state'],
    response: ['manage', 'interrupt'],
    dimensions: ['2d', '3d'],
    lenses: ['progress-clarity', 'risk-reward', 'rule-exception'],
  },
  'Multi-boss relationships': {
    geometry: ['entity'],
    signal: ['state'],
    response: ['attack', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['progress-clarity', 'player-expression', 'phase-structure'],
  },
  'Cooperative coordination': {
    geometry: ['target'],
    signal: ['marker'],
    response: ['coordinate', 'reposition'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'threat-geometry', 'player-expression'],
  },
};

const PROFILE_OVERRIDES = {
  'wide-swing': { geometry: ['arc'], signal: ['pose'], response: ['dodge', 'reposition'] },
  lunge: { geometry: ['line'], signal: ['pose', 'trajectory'] },
  'ground-slam': { geometry: ['radial'], signal: ['pose', 'environment'] },
  'landing-jump': { geometry: ['radial', 'zone'], signal: ['pose', 'marker'] },
  charge: { geometry: ['line'], signal: ['pose', 'trajectory'] },
  grab: { geometry: ['target'], response: ['dodge', 'interrupt'] },
  sweep: { geometry: ['arc'], signal: ['pose', 'trajectory'] },
  'burrow-and-emerge': { geometry: ['zone'], signal: ['marker', 'environment'] },
  'projectile-fan': { geometry: ['arc', 'line'] },
  'ring-volley': { geometry: ['radial'] },
  'spiral-barrage': { geometry: ['radial'], signal: ['trajectory', 'rhythm'] },
  'gap-volley': { geometry: ['line', 'zone'] },
  crossfire: { geometry: ['line', 'arena'] },
  'orbiting-projectiles': { geometry: ['radial', 'zone'] },
  'rotating-beams': { geometry: ['radial', 'line'], signal: ['trajectory', 'rhythm'] },
  'pulse-beam': { geometry: ['line'], signal: ['rhythm', 'marker'] },
  'chain-explosions': { geometry: ['zone', 'line'], signal: ['marker', 'rhythm'] },
  shockwave: { geometry: ['radial', 'line'], signal: ['pose', 'environment'] },
  mine: { geometry: ['zone'], signal: ['environment', 'state'] },
  'hazard-trail': { geometry: ['line', 'zone'], signal: ['trajectory', 'environment'] },
  pull: { geometry: ['radial', 'arena'] },
  knockback: { geometry: ['line', 'arena'] },
  summon: { geometry: ['entity'], signal: ['state', 'environment'] },
  decoy: { geometry: ['entity', 'target'], response: ['attack', 'manage'] },
  'target-lock': { geometry: ['target'], signal: ['marker'], response: ['reposition'] },
  'predictive-aiming': { geometry: ['line'], signal: ['trajectory'], response: ['dodge'] },
  'homing-projectile': { geometry: ['target', 'line'], signal: ['trajectory'] },
  'attack-combination': { geometry: ['arena'], signal: ['rhythm'], response: ['manage'] },
  'directional-shield': {
    geometry: ['arc'],
    signal: ['state'],
    response: ['reposition', 'attack'],
  },
  'weak-point': { geometry: ['target'], signal: ['marker', 'state'], response: ['attack'] },
  'attack-reflection': { geometry: ['line'], signal: ['state'], response: ['counter'] },
  'counter-stance': { geometry: ['target'], signal: ['pose', 'state'], response: ['manage'] },
  'interruptible-wind-up': {
    geometry: ['target'],
    signal: ['pose', 'state'],
    response: ['interrupt'],
  },
  telegraph: { geometry: ['target'], signal: ['pose', 'marker'], response: ['manage'] },
  'wind-up': { geometry: ['target'], signal: ['pose'], response: ['interrupt', 'manage'] },
  'attack-lock': { geometry: ['target'], signal: ['state'], response: ['dodge', 'reposition'] },
  recovery: { geometry: ['target'], signal: ['state'], response: ['attack'] },
  'fight-phase': { geometry: ['arena'], signal: ['state', 'rhythm'] },
  enrage: { geometry: ['arena'], signal: ['state', 'rhythm'], response: ['attack', 'manage'] },
  'survival-phase': { geometry: ['arena'], response: ['dodge', 'reposition', 'manage'] },
  teleport: { geometry: ['target', 'arena'], signal: ['marker', 'environment'] },
  'forced-scrolling': {
    geometry: ['arena'],
    dimensions: ['2d', '3d'],
    signal: ['environment', 'rhythm'],
    response: ['reposition', 'manage'],
  },
  'chase-herding': {
    geometry: ['entity', 'arena'],
    dimensions: ['2d', '3d'],
    signal: ['marker', 'trajectory'],
    response: ['reposition', 'attack'],
  },
  'escape-phase': {
    geometry: ['entity', 'arena'],
    dimensions: ['2d', '3d'],
    signal: ['marker', 'state'],
    response: ['reposition', 'interrupt'],
  },
  'relocated-arena': {
    geometry: ['arena'],
    dimensions: ['2d', '3d'],
    signal: ['environment', 'state'],
    response: ['reposition', 'manage'],
  },
  'control-mode-shift': {
    geometry: ['arena'],
    dimensions: ['2d', '3d'],
    signal: ['environment', 'state'],
    response: ['reposition', 'manage'],
  },
  'boss-as-terrain': {
    geometry: ['entity', 'arena'],
    dimensions: ['2d', '3d'],
    signal: ['marker', 'state'],
    response: ['reposition', 'interact', 'attack'],
  },
  'cover-line-of-sight': {
    geometry: ['line', 'arena'],
    dimensions: ['2d', '3d'],
    signal: ['marker', 'environment', 'state'],
    response: ['reposition', 'interact', 'attack'],
  },
  'forced-inertia': {
    geometry: ['line', 'arena'],
    dimensions: ['2d', '3d'],
    signal: ['trajectory', 'environment', 'state'],
    response: ['reposition', 'manage'],
  },
  'wraparound-projectile': {
    geometry: ['line', 'arena'],
    dimensions: ['2d', '3d'],
    signal: ['trajectory', 'environment', 'state'],
    response: ['reposition', 'dodge', 'attack'],
  },
  'beat-synced-attack': {
    geometry: ['arena', 'zone'],
    dimensions: ['2d', '3d'],
    signal: ['rhythm', 'state'],
    response: ['reposition', 'dodge', 'manage'],
  },
  'secondary-cues-invisibility': {
    geometry: ['target', 'line'],
    signal: ['environment', 'state', 'marker'],
    response: ['reposition', 'dodge', 'attack', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'access-paths', 'threat-geometry', 'counterplay'],
  },
  'sound-detection': {
    geometry: ['arena', 'zone', 'target'],
    signal: ['environment', 'state', 'marker'],
    response: ['manage', 'reposition', 'attack'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'access-paths', 'counterplay', 'rule-exception'],
  },
  'objective-linked-invulnerability': {
    geometry: ['entity', 'arena', 'target'],
    signal: ['state', 'marker', 'environment'],
    response: ['interact', 'attack', 'reposition', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['progress-clarity', 'telegraphing', 'counterplay', 'rule-exception'],
  },
  'wave-clear-objective': {
    geometry: ['entity', 'arena', 'target'],
    signal: ['environment', 'state', 'marker'],
    response: ['attack', 'reposition', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['progress-clarity', 'difficulty-rhythm', 'counterplay', 'encounter-purpose'],
  },
  'environmental-weapon': {
    geometry: ['entity', 'line', 'arena'],
    signal: ['environment', 'marker', 'state'],
    response: ['interact', 'reposition', 'attack'],
    dimensions: ['2d', '3d'],
    lenses: ['encounter-purpose', 'access-paths', 'counterplay', 'progress-clarity', 'risk-reward'],
  },
  'encounter-specific-tool': {
    geometry: ['entity', 'line', 'arena'],
    signal: ['environment', 'state', 'trajectory'],
    response: ['interact', 'reposition', 'attack', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: [
      'encounter-purpose',
      'player-expression',
      'counterplay',
      'progress-clarity',
      'risk-reward',
    ],
  },
  'player-controlled-boss': {
    geometry: ['entity', 'line', 'arena'],
    signal: ['state', 'marker', 'trajectory'],
    response: ['dodge', 'reposition', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: [
      'encounter-purpose',
      'player-expression',
      'counterplay',
      'progress-clarity',
      'difficulty-rhythm',
    ],
  },
  'projectile-rally': {
    geometry: ['line', 'target'],
    signal: ['trajectory', 'rhythm', 'state'],
    response: ['counter', 'attack'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'counterplay', 'difficulty-rhythm', 'commitment', 'progress-clarity'],
  },
  'baited-self-hit': {
    geometry: ['line', 'zone', 'target'],
    signal: ['marker', 'trajectory', 'state'],
    response: ['reposition', 'manage', 'attack'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'commitment', 'counterplay', 'risk-reward', 'progress-clarity'],
  },
  'posture-stagger-gauge': {
    geometry: ['target'],
    signal: ['state', 'marker', 'rhythm'],
    response: ['attack', 'counter', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['progress-clarity', 'risk-reward', 'commitment', 'counterplay', 'difficulty-rhythm'],
  },
  'pacifist-resolution': {
    geometry: ['line', 'target', 'arena'],
    signal: ['state', 'marker', 'rhythm'],
    response: ['dodge', 'interact', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: [
      'encounter-purpose',
      'player-expression',
      'progress-clarity',
      'risk-reward',
      'rule-exception',
    ],
  },
  'persistent-progress': {
    geometry: ['target', 'arena'],
    signal: ['state', 'marker'],
    response: ['attack', 'interact', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: [
      'progress-clarity',
      'phase-structure',
      'encounter-purpose',
      'risk-reward',
      'context-and-sequence',
    ],
  },
  'status-buildup': {
    geometry: ['radial', 'target'],
    signal: ['state', 'marker', 'rhythm'],
    response: ['reposition', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: [
      'progress-clarity',
      'risk-reward',
      'counterplay',
      'difficulty-rhythm',
      'rule-exception',
    ],
  },
  'instant-kill': {
    geometry: ['zone', 'target'],
    signal: ['marker', 'state', 'rhythm'],
    response: ['reposition', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'counterplay', 'risk-reward', 'rule-exception', 'progress-clarity'],
  },
  'maximum-health-reduction': {
    geometry: ['line', 'target'],
    signal: ['state', 'marker'],
    response: ['dodge', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['progress-clarity', 'risk-reward', 'counterplay', 'rule-exception', 'telegraphing'],
  },
  'ability-lock': {
    geometry: ['radial', 'target'],
    signal: ['state', 'marker'],
    response: ['dodge', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['progress-clarity', 'counterplay', 'rule-exception', 'risk-reward', 'telegraphing'],
  },
  'resource-steal': {
    geometry: ['target', 'entity'],
    signal: ['marker', 'state'],
    response: ['dodge', 'reposition', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['progress-clarity', 'counterplay', 'risk-reward', 'rule-exception', 'telegraphing'],
  },
  'on-hit-healing': {
    geometry: ['target'],
    signal: ['pose', 'state'],
    response: ['dodge', 'counter', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['progress-clarity', 'counterplay', 'risk-reward', 'rule-exception', 'telegraphing'],
  },
  'self-heal-cast': {
    geometry: ['radial', 'target'],
    signal: ['pose', 'state'],
    response: ['attack', 'interrupt', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['progress-clarity', 'counterplay', 'risk-reward', 'rule-exception', 'telegraphing'],
  },
  'external-healing-source': {
    geometry: ['entity', 'target'],
    signal: ['marker', 'state'],
    response: ['attack', 'interrupt', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['progress-clarity', 'counterplay', 'risk-reward', 'rule-exception', 'telegraphing'],
  },
  'damage-rate-cap': {
    geometry: ['target'],
    signal: ['state', 'rhythm'],
    response: ['attack', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: [
      'progress-clarity',
      'risk-reward',
      'rule-exception',
      'player-expression',
      'difficulty-rhythm',
    ],
  },
  'loadout-mirror': {
    geometry: ['target', 'entity'],
    signal: ['state', 'marker'],
    response: ['manage', 'attack'],
    dimensions: ['2d', '3d'],
    lenses: [
      'player-expression',
      'risk-reward',
      'rule-exception',
      'progress-clarity',
      'counterplay',
    ],
  },
  'moveset-shapeshifting': {
    geometry: ['arena', 'radial', 'line'],
    signal: ['state', 'rhythm'],
    response: ['reposition', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: [
      'phase-structure',
      'difficulty-rhythm',
      'mastery-check',
      'progress-clarity',
      'rule-exception',
    ],
  },
  'ally-theft': {
    geometry: ['entity', 'line', 'target'],
    signal: ['marker', 'state'],
    response: ['interrupt', 'manage', 'reposition'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'counterplay', 'player-expression', 'risk-reward', 'rule-exception'],
  },
  'false-death': {
    geometry: ['target', 'arena', 'radial'],
    signal: ['state', 'marker', 'rhythm'],
    response: ['manage', 'reposition', 'attack'],
    dimensions: ['2d', '3d'],
    lenses: [
      'progress-clarity',
      'phase-structure',
      'dramatic-framing',
      'telegraphing',
      'rule-exception',
    ],
  },
  'action-reactive-punish': {
    geometry: ['line', 'target'],
    signal: ['state', 'marker', 'pose'],
    response: ['reposition', 'manage', 'counter'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'commitment', 'counterplay', 'risk-reward', 'rule-exception'],
  },
  'run-history-manifestation': {
    geometry: ['entity', 'arena', 'target'],
    signal: ['state', 'marker', 'environment'],
    response: ['manage', 'reposition', 'interact'],
    dimensions: ['2d', '3d'],
    lenses: [
      'context-and-sequence',
      'player-expression',
      'progress-clarity',
      'risk-reward',
      'rule-exception',
    ],
  },
  'real-time-progression': {
    geometry: ['arena', 'radial', 'zone'],
    signal: ['state', 'rhythm', 'environment'],
    response: ['manage', 'reposition', 'dodge'],
    dimensions: ['2d', '3d'],
    lenses: [
      'context-and-sequence',
      'progress-clarity',
      'difficulty-rhythm',
      'risk-reward',
      'rule-exception',
    ],
  },
  'interface-interaction': {
    geometry: ['target', 'entity'],
    signal: ['state', 'marker', 'environment'],
    response: ['interact', 'manage', 'counter'],
    dimensions: ['2d', '3d'],
    lenses: [
      'rule-exception',
      'progress-clarity',
      'player-expression',
      'context-and-sequence',
      'access-paths',
    ],
  },
  'world-state-variant': {
    geometry: ['arena', 'zone', 'entity'],
    signal: ['state', 'environment', 'marker'],
    response: ['manage', 'reposition', 'dodge'],
    dimensions: ['2d', '3d'],
    lenses: [
      'context-and-sequence',
      'rule-exception',
      'progress-clarity',
      'risk-reward',
      'difficulty-rhythm',
    ],
  },
  'party-size-scaling': {
    geometry: ['target', 'zone', 'arena'],
    signal: ['state', 'marker', 'rhythm'],
    response: ['coordinate', 'reposition', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: [
      'difficulty-rhythm',
      'progress-clarity',
      'risk-reward',
      'access-paths',
      'context-and-sequence',
    ],
  },
  'partner-revival': {
    geometry: ['entity', 'line', 'arena'],
    signal: ['state', 'pose', 'rhythm'],
    response: ['attack', 'interrupt', 'coordinate'],
    dimensions: ['2d', '3d'],
    lenses: [
      'context-and-sequence',
      'progress-clarity',
      'risk-reward',
      'difficulty-rhythm',
      'counterplay',
    ],
  },
  'kill-order-inheritance': {
    geometry: ['entity', 'radial', 'line'],
    signal: ['state', 'pose', 'rhythm'],
    response: ['attack', 'reposition', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: [
      'context-and-sequence',
      'progress-clarity',
      'risk-reward',
      'difficulty-rhythm',
      'counterplay',
    ],
  },
  'shared-group-health': {
    geometry: ['entity', 'line', 'arena'],
    signal: ['state', 'pose', 'rhythm'],
    response: ['attack', 'reposition', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: [
      'progress-clarity',
      'context-and-sequence',
      'risk-reward',
      'difficulty-rhythm',
      'counterplay',
    ],
  },
  'coordinated-duo-attack': {
    geometry: ['entity', 'line', 'arena'],
    signal: ['pose', 'rhythm', 'marker'],
    response: ['reposition', 'interrupt', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: [
      'context-and-sequence',
      'counterplay',
      'progress-clarity',
      'risk-reward',
      'difficulty-rhythm',
    ],
  },
  'stack-damage': {
    geometry: ['target', 'zone'],
    signal: ['marker', 'rhythm'],
    response: ['coordinate', 'reposition'],
    dimensions: ['2d', '3d'],
    lenses: [
      'counterplay',
      'threat-geometry',
      'risk-reward',
      'difficulty-rhythm',
      'progress-clarity',
    ],
  },
  'personal-spread': {
    geometry: ['target', 'zone'],
    signal: ['marker', 'rhythm'],
    response: ['coordinate', 'reposition'],
    dimensions: ['2d', '3d'],
    lenses: [
      'counterplay',
      'threat-geometry',
      'risk-reward',
      'difficulty-rhythm',
      'progress-clarity',
    ],
  },
  'tower-soak': {
    geometry: ['zone'],
    signal: ['marker', 'rhythm'],
    response: ['coordinate', 'reposition'],
    dimensions: ['2d', '3d'],
    lenses: [
      'counterplay',
      'threat-geometry',
      'risk-reward',
      'difficulty-rhythm',
      'progress-clarity',
    ],
  },
  'entity-tether': {
    geometry: ['line'],
    signal: ['state'],
    dimensions: ['2d', '3d'],
    response: ['coordinate', 'reposition'],
    lenses: [
      'counterplay',
      'threat-geometry',
      'risk-reward',
      'difficulty-rhythm',
      'progress-clarity',
    ],
  },
  'gaze-check': {
    geometry: ['target', 'entity'],
    signal: ['marker', 'pose'],
    response: ['manage', 'reposition'],
    dimensions: ['2d', '3d'],
    lenses: [
      'telegraphing',
      'threat-geometry',
      'counterplay',
      'difficulty-rhythm',
      'progress-clarity',
    ],
  },
  'proximity-damage': {
    geometry: ['radial'],
    signal: ['marker'],
    response: ['reposition', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'threat-geometry', 'counterplay', 'risk-reward', 'difficulty-rhythm'],
  },
  'tank-swap': {
    geometry: ['target'],
    signal: ['marker', 'pose'],
    response: ['coordinate', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'counterplay', 'difficulty-rhythm', 'risk-reward', 'progress-clarity'],
  },
  'debuff-handoff': {
    geometry: ['target'],
    signal: ['marker'],
    response: ['coordinate', 'manage'],
    dimensions: ['2d', '3d'],
    lenses: ['telegraphing', 'counterplay', 'difficulty-rhythm', 'risk-reward', 'progress-clarity'],
  },
  'ordered-targets': {
    geometry: ['target'],
    signal: ['marker'],
    response: ['coordinate', 'reposition'],
    dimensions: ['2d', '3d'],
    lenses: [
      'telegraphing',
      'counterplay',
      'threat-geometry',
      'difficulty-rhythm',
      'progress-clarity',
    ],
  },
  'party-split': { geometry: ['arena'], response: ['coordinate', 'reposition', 'manage'] },
};

const pairKey = (left, right) => [left, right].sort().join('|');

const COMPATIBLE_PAIRS = new Set(
  [
    ['attack-lock', 'charge'],
    ['attack-lock', 'lunge'],
    ['target-lock', 'marked-area-strike'],
    ['telegraph', 'delayed-activation'],
    ['wind-up', 'interruptible-wind-up'],
    ['recovery', 'weak-point'],
    ['weak-point', 'part-break'],
    ['fight-phase', 'relocated-arena'],
    ['fight-phase', 'false-death'],
    ['false-death', 'persistent-progress'],
    ['projectile-rally', 'projectile-fan'],
    ['projectile-rally', 'gap-volley'],
    ['projectile-rally', 'homing-projectile'],
    ['cover-line-of-sight', 'straight-beam'],
    ['cover-line-of-sight', 'scanning-beam'],
    ['summon', 'external-healing-source'],
    ['objective-linked-invulnerability', 'environmental-weapon'],
    ['baited-self-hit', 'charge'],
    ['baited-self-hit', 'lunge'],
    ['posture-stagger-gauge', 'counter-stance'],
    ['posture-stagger-gauge', 'weak-point'],
    ['pacifist-resolution', 'survival-phase'],
    ['pacifist-resolution', 'escape-phase'],
    ['persistent-progress', 'fight-phase'],
    ['persistent-progress', 'wave-clear-objective'],
    ['persistent-progress', 'part-break'],
    ['status-buildup', 'lingering-hazard'],
    ['status-buildup', 'damage-type-resistance'],
    ['status-buildup', 'instant-kill'],
    ['instant-kill', 'marked-area-strike'],
    ['maximum-health-reduction', 'status-buildup'],
    ['maximum-health-reduction', 'external-healing-source'],
    ['ability-lock', 'status-buildup'],
    ['ability-lock', 'external-healing-source'],
    ['resource-steal', 'status-buildup'],
    ['resource-steal', 'persistent-progress'],
    ['on-hit-healing', 'attack-combination'],
    ['on-hit-healing', 'ability-lock'],
    ['self-heal-cast', 'interruptible-wind-up'],
    ['self-heal-cast', 'ability-lock'],
    ['action-reactive-punish', 'recovery'],
    ['action-reactive-punish', 'self-heal-cast'],
    ['run-history-manifestation', 'persistent-progress'],
    ['run-history-manifestation', 'fight-phase'],
    ['real-time-progression', 'persistent-progress'],
    ['real-time-progression', 'fight-phase'],
    ['interface-interaction', 'control-mode-shift'],
    ['interface-interaction', 'ability-lock'],
    ['interface-interaction', 'encounter-specific-tool'],
    ['world-state-variant', 'fight-phase'],
    ['world-state-variant', 'relocated-arena'],
    ['world-state-variant', 'persistent-progress'],
    ['party-size-scaling', 'personal-spread'],
    ['party-size-scaling', 'stack-damage'],
    ['party-size-scaling', 'tower-soak'],
    ['partner-revival', 'kill-order-inheritance'],
    ['shared-group-health', 'coordinated-duo-attack'],
    ['target-lock', 'personal-spread'],
    ['beat-synced-attack', 'attack-combination'],
    ['chase-herding', 'target-lock'],
    ['chase-herding', 'baited-self-hit'],
    ['escape-phase', 'target-lock'],
    ['escape-phase', 'external-healing-source'],
    ['damage-rate-cap', 'persistent-progress'],
    ['damage-rate-cap', 'fight-phase'],
    ['loadout-mirror', 'loadout-adaptation'],
    ['loadout-mirror', 'fight-phase'],
    ['moveset-shapeshifting', 'fight-phase'],
    ['moveset-shapeshifting', 'relocated-arena'],
    ['ally-theft', 'fight-phase'],
    ['ally-theft', 'entity-tether'],
    ['relocated-arena', 'cover-line-of-sight'],
    ['forced-inertia', 'telegraph'],
    ['forced-inertia', 'hazard-trail'],
    ['wraparound-projectile', 'projectile-fan'],
    ['wraparound-projectile', 'limited-spread'],
    ['debuff-handoff', 'ordered-targets'],
  ].map(([left, right]) => pairKey(left, right)),
);

const CONFLICT_PAIRS = new Set(
  [
    ['stack-damage', 'personal-spread'],
    ['stack-damage', 'party-split'],
    ['tower-soak', 'personal-spread'],
    ['tower-soak', 'party-split'],
    ['forced-scrolling', 'cover-line-of-sight'],
    ['chase-herding', 'forced-scrolling'],
    ['escape-phase', 'forced-scrolling'],
    ['relocated-arena', 'forced-scrolling'],
    ['forced-inertia', 'marked-area-strike'],
    ['wraparound-projectile', 'shrinking-safe-area'],
    ['shrinking-safe-area', 'platform-destruction'],
    ['gaze-check', 'secondary-cues-invisibility'],
    ['damage-rate-cap', 'enrage'],
    ['pacifist-resolution', 'on-hit-healing'],
  ].map(([left, right]) => pairKey(left, right)),
);

const unique = (values) => [...new Set(values)];
const overlap = (left, right) => left.some((value) => right.includes(value));

export function createMechanicProfile({ id, category, lenses = [] }) {
  const defaults = CATEGORY_DEFAULTS[category];
  if (!defaults) throw new Error(`Unknown mechanic category: ${category}`);
  const override = PROFILE_OVERRIDES[id] ?? {};
  return {
    geometry: unique(override.geometry ?? defaults.geometry),
    signal: unique(override.signal ?? defaults.signal),
    response: unique(override.response ?? defaults.response),
    dimensions: unique(override.dimensions ?? defaults.dimensions),
    lenses: unique([...(override.lenses ?? defaults.lenses), ...lenses]),
  };
}

export function mechanicRelationship(left, right) {
  if (!left || !right || left.id === right.id) return 'neutral';
  const key = pairKey(left.id, right.id);
  if (CONFLICT_PAIRS.has(key)) return 'conflict';
  if (COMPATIBLE_PAIRS.has(key)) return 'compatible';
  const sameSignal = overlap(left.profile.signal, right.profile.signal);
  const differentGeometry = !overlap(left.profile.geometry, right.profile.geometry);
  const differentResponse = !overlap(left.profile.response, right.profile.response);
  const differentCategory = left.categoryKey !== right.categoryKey;
  return sameSignal && differentGeometry && differentResponse && differentCategory
    ? 'compatible'
    : 'neutral';
}

export function rankCompatibleMechanics(mechanics, selectedIds) {
  const selected = mechanics.filter(({ id }) => selectedIds.includes(id));
  if (!selected.length) return [];
  return mechanics
    .filter(({ id }) => !selectedIds.includes(id))
    .map((candidate) => {
      const relations = selected.map((mechanic) => mechanicRelationship(mechanic, candidate));
      return {
        mechanic: candidate,
        score: relations.filter((relation) => relation === 'compatible').length,
        conflict: relations.includes('conflict'),
      };
    })
    .filter(({ score, conflict }) => score > 0 && !conflict)
    .sort(
      (left, right) => right.score - left.score || left.mechanic.number - right.mechanic.number,
    );
}

const pickIndex = (length, random) => {
  const sample = Number(random());
  const normalized = Number.isFinite(sample) ? Math.min(Math.max(sample, 0), 0.999999999999) : 0;
  return Math.floor(normalized * length);
};

export function buildRandomMechanicSet(mechanics, { count = 5, random = Math.random } = {}) {
  const targetCount = Math.min(
    mechanics.length,
    Math.max(0, Number.isFinite(count) ? Math.trunc(count) : 0),
  );
  if (!targetCount) return [];

  const remaining = [...mechanics];
  const selected = [remaining.splice(pickIndex(remaining.length, random), 1)[0]];

  while (selected.length < targetCount && remaining.length) {
    const candidates = remaining
      .map((mechanic, index) => {
        const relations = selected.map((item) => mechanicRelationship(item, mechanic));
        const knownGeometry = new Set(selected.flatMap((item) => item.profile.geometry));
        const knownResponses = new Set(selected.flatMap((item) => item.profile.response));
        const score =
          relations.filter((relation) => relation === 'compatible').length * 10 +
          Number(!selected.some((item) => item.categoryKey === mechanic.categoryKey)) * 2 +
          Number(mechanic.profile.geometry.some((value) => !knownGeometry.has(value))) +
          Number(mechanic.profile.response.some((value) => !knownResponses.has(value)));
        return { mechanic, index, score, conflict: relations.includes('conflict') };
      })
      .filter(({ conflict }) => !conflict);
    if (!candidates.length) break;
    const bestScore = Math.max(...candidates.map(({ score }) => score));
    const best = candidates.filter(({ score }) => score === bestScore);
    const chosen = best[pickIndex(best.length, random)];
    selected.push(chosen.mechanic);
    remaining.splice(chosen.index, 1);
  }

  return selected;
}
