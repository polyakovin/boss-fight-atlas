import { sweepWeaponPose, SWEEP_INNER_RADIUS, SWEEP_OUTER_RADIUS } from './sweep-weapon-model.mjs';

export const BLUEPRINT_DURATION = 6;
export const BLUEPRINT_PHASE_ENDS = Object.freeze([1.6, 4.3, BLUEPRINT_DURATION]);
export const BLUEPRINT_PLAYER_RADIUS = 24;
export const BLUEPRINT_BOSS_LABEL_OFFSET_Y = -104;
const WIDE_SWING_FROM = -0.95;
const WIDE_SWING_TO = 2.05;

const SPECS = {
  'landing-jump': {
    mode: 'landing',
    boss: [155, 280],
    player: [365, 600],
    target: [430, 735],
    landing: [365, 600],
  },
  'single-shot': {
    mode: 'single-shot',
    boss: [165, 280],
    player: [385, 600],
    target: [500, 520],
    shotEnd: [572, 872],
  },
  crossfire: {
    mode: 'crossfire',
    boss: [280, 235],
    player: [280, 595],
    target: [500, 735],
    sources: [
      [90, 315],
      [470, 315],
    ],
    shotEnds: [
      [470, 840],
      [90, 840],
    ],
  },
  'splitting-projectile': {
    mode: 'splitting-projectile',
    boss: [155, 260],
    player: [380, 610],
    target: [505, 700],
    split: [300, 455],
    fragmentEnds: [
      [85, 850],
      [285, 885],
      [465, 850],
    ],
  },
  'returning-projectile': {
    mode: 'returning-projectile',
    boss: [155, 270],
    player: [370, 610],
    target: [95, 700],
    turn: [485, 455],
    returnControl: [430, 785],
  },
  'orbiting-projectiles': {
    mode: 'orbiting-projectiles',
    boss: [280, 420],
    player: [376, 651],
    target: [185, 480],
    orbitRadius: 170,
    projectileCount: 5,
    startAngle: 0.55,
    rotation: 1.4,
  },
  'pulse-beam': {
    mode: 'pulse-beam',
    boss: [150, 340],
    player: [500, 590],
    target: [270, 660],
    beamStart: [188, 348],
    beamEnd: [500, 700],
  },
  'chain-explosions': {
    mode: 'chain-explosions',
    boss: [280, 270],
    player: [500, 800],
    target: [185, 560],
    blastRadius: 58,
    blastCenters: [
      [455, 650],
      [365, 560],
      [275, 650],
      [185, 560],
      [95, 650],
    ],
  },
  mine: {
    mode: 'mine',
    boss: [170, 270],
    player: [455, 690],
    target: [170, 820],
    mine: [320, 610],
    triggerRadius: 96,
    safeRoute: [
      [455, 690],
      [500, 730],
      [470, 820],
      [330, 865],
      [170, 820],
    ],
  },
  'moving-hazard': {
    mode: 'moving-hazard',
    boss: [280, 260],
    player: [365, 690],
    target: [365, 455],
    hazardStart: [105, 620],
    hazardEnd: [485, 620],
    hazardRadius: 72,
  },
  'converging-threats': {
    mode: 'converging-threats',
    boss: [280, 260],
    player: [280, 655],
    target: [280, 455],
    arenaWidth: 560,
    threatTop: 535,
    threatHeight: 235,
    entryWidth: 90,
    convergence: 280,
  },
  pull: {
    mode: 'pull',
    boss: [280, 300],
    player: [350, 660],
    target: [480, 575],
    pullRadius: 445,
    dangerRadius: 82,
  },
  'turret-deployment': {
    mode: 'turret-deployment',
    boss: [145, 290],
    player: [430, 680],
    target: [225, 680],
    turret: [430, 480],
    beamEnd: [430, 870],
    beamHalfWidth: 17,
  },
  'threat-generator': {
    mode: 'threat-generator',
    boss: [145, 290],
    player: [430, 685],
    target: [195, 685],
    generator: [405, 455],
    shotEnds: [
      [410, 980],
      [480, 980],
      [325, 980],
    ],
    shotRadius: 19,
  },
  decoy: {
    mode: 'decoy',
    boss: [280, 350],
    player: [440, 690],
    target: [280, 535],
    real: [190, 425],
    mirror: [410, 425],
    contactRadius: 56,
  },
  'predictive-aiming': {
    mode: 'predictive-aim',
    boss: [155, 290],
    player: [340, 620],
    target: [300, 620],
    approachVelocity: 50,
    leadSeconds: 1.6,
    shotRadius: 22,
  },
  'source-tracking': {
    mode: 'source-track',
    boss: [280, 295],
    player: [400, 655],
    target: [420, 655],
    emitter: [320, 303],
    lock: [255, 655],
    beamLength: 640,
    beamHalfWidth: 18,
    maximumTurnRate: 0.6,
  },
  'burst-fire': {
    mode: 'burst-fire',
    boss: [170, 300],
    player: [385, 635],
    target: [500, 635],
    emitter: [213, 310],
    shotEnd: [515, 850],
    shotRadius: 20,
    releases: [1.9, 2.45, 3],
    flight: 1.25,
  },
  volley: {
    mode: 'volley',
    boss: [280, 285],
    player: [280, 630],
    target: [475, 630],
    lanes: [190, 280, 370],
    emitterY: 355,
    shotEndY: 870,
    shotRadius: 22,
    release: 2,
    flight: 1.5,
  },
  'delayed-activation': {
    mode: 'delayed-activation',
    boss: [155, 300],
    player: [350, 630],
    target: [485, 630],
    rune: [350, 630],
    radius: 82,
    activatesAt: 2.9,
    expiresAt: 4.0,
  },
  'speed-change': {
    mode: 'speed-change',
    boss: [140, 620],
    player: [405, 620],
    target: [405, 790],
    switchX: 260,
    finishX: 440,
    laneY: 620,
    collisionRadius: 57,
    switchAt: 2.8,
    finishAt: 3.45,
  },
  'limited-spread': {
    mode: 'limited-spread',
    boss: [280, 280],
    player: [280, 660],
    target: [465, 660],
    emitter: [280, 332],
    coneHalfAngle: 0.2,
    shotRadius: 18,
    releases: [1.85, 2.4, 2.95],
    offsets: [-0.15, 0.12, -0.04],
    flight: 1.3,
    shotLength: 590,
  },
  'directional-shield': {
    mode: 'directional-shield',
    boss: [280, 430],
    player: [280, 535],
    target: [390, 430],
    guardAngle: Math.PI / 2,
    guardHalfAngle: 0.9,
    guardEnd: 3.85,
    attackReach: 132,
    frontStrike: 2.05,
    sideStrike: 3.55,
  },
  'damage-type-resistance': {
    mode: 'damage-type-resistance',
    boss: [280, 430],
    player: [420, 430],
    target: [395, 430],
    slashStrike: 2.05,
    thrustStrike: 3.55,
    slashMultiplier: 0.2,
    baseDamage: 100,
  },
  'situational-immunity': {
    mode: 'situational-immunity',
    boss: [280, 430],
    player: [425, 430],
    target: [390, 430],
    ward: [410, 330],
    blockedStrike: 2.05,
    wardStrike: 2.8,
    openStrike: 3.55,
    shieldReturns: 4.3,
  },
  'part-break': {
    mode: 'part-break',
    boss: [280, 430],
    player: [475, 620],
    target: [415, 405],
    launcher: [347, 405],
    shotEnd: [548, 405],
    firstShot: [1.95, 2.2],
    breakAt: 2.88,
    secondAttempt: 3.78,
    repairStart: 4.95,
    repairEnd: 5.35,
    beamHalfWidth: 14,
  },
  'attack-reflection': {
    mode: 'attack-reflection',
    boss: [280, 430],
    player: [475, 405],
    target: [475, 550],
    mirror: [348, 405],
    swordBoltStart: [445, 405],
    outgoing: [1.72, 2.35],
    reflected: [2.35, 3.35],
    mirrorLowered: 4.3,
    meleeStrike: 4.72,
    mirrorRaised: 5.28,
    boltRadius: 13,
  },
  'counter-stance': {
    mode: 'counter-stance',
    boss: [280, 430],
    player: [435, 430],
    target: [475, 550],
    firstGuard: [0.62, 1.98],
    parriedStrike: 1.88,
    riposte: [2.43, 2.88],
    secondGuard: [3.48, 4.48],
    openStrike: 4.96,
    counterStart: [345, 421],
    counterEnd: [438, 421],
    counterHalfWidth: 19,
  },
  'absorption-power-up': {
    mode: 'absorption-power-up',
    boss: [280, 430],
    player: [450, 430],
    target: [510, 430],
    core: [310, 409],
    swordStart: [420, 407],
    firstPulse: [1.25, 1.65],
    secondPulse: [2.05, 2.45],
    chargeWindup: 2.95,
    shockwave: [3.55, 3.94],
    spentAt: 4.2,
    openStrike: 4.96,
    shockwaveRadius: 175,
  },
  'interruptible-wind-up': {
    mode: 'interruptible-wind-up',
    boss: [280, 430],
    player: [450, 430],
    target: [510, 430],
    interruptPosition: [365, 430],
    firstWindup: [0.72, 1.82],
    interruptAt: 1.58,
    staggerEnd: 2.55,
    secondWindup: [3.02, 4.18],
    release: [4.18, 4.56],
    recoveryEnd: 5.28,
    threatRadius: 150,
  },
  'loadout-adaptation': {
    mode: 'loadout-adaptation',
    boss: [280, 430],
    player: [450, 430],
    target: [485, 650],
    reachSnapshot: [0.62, 1.08],
    reachCopiedAt: 1.08,
    reachAttack: [1.66, 2.08],
    reachRecoveryEnd: 2.56,
    swapAt: 2.76,
    burstSnapshot: [3.02, 3.48],
    burstCopiedAt: 3.48,
    burstAttack: [4.18, 4.58],
    recoveryEnd: 5.3,
    reachEnd: [560, 430],
    reachHalfWidth: 18,
    burstRadius: 150,
  },
  'wind-up': {
    mode: 'wind-up',
    boss: [280, 430],
    player: [450, 430],
    target: [450, 320],
    firstWindup: [0.55, 1.6],
    firstRelease: [1.6, 1.98],
    firstRecoveryEnd: 2.42,
    secondWindup: [2.88, 4.3],
    heldFrom: 3.72,
    secondRelease: [4.3, 4.68],
    recoveryEnd: 5.35,
    laneEnd: [560, 430],
    laneHalfWidth: 22,
  },
  'attack-lock': {
    mode: 'attack-lock',
    boss: [280, 350],
    player: [430, 620],
    target: [70, 505],
    firstTrack: [0.42, 1.18],
    firstLock: 1.18,
    firstRelease: [1.72, 2.12],
    firstRecoveryEnd: 2.48,
    firstLockPoint: [390, 560],
    firstEscape: [500, 500],
    secondSetup: 2.68,
    secondTrack: [2.86, 3.58],
    secondLock: 3.58,
    secondRelease: [4.18, 4.58],
    recoveryEnd: 5.25,
    secondStart: [190, 620],
    secondLockPoint: [180, 560],
    secondEscape: [70, 505],
    laneLength: 500,
    laneHalfWidth: 18,
  },
  'active-phase': {
    mode: 'active-phase',
    boss: [240, 430],
    player: [460, 430],
    target: [345, 430],
    safePosition: [410, 300],
    startup: [0.55, 1.6],
    active: [1.6, 2.18],
    followThroughEnd: 2.92,
    punishAt: 3.28,
    recoveryEnd: 4.8,
    laneStart: [282, 430],
    laneEnd: [548, 430],
    laneHalfWidth: 24,
  },
  recovery: {
    mode: 'recovery',
    boss: [230, 430],
    player: [475, 430],
    target: [350, 430],
    safePosition: [430, 305],
    startup: [0.48, 1.28],
    active: [1.28, 1.74],
    recovery: [1.74, 4.58],
    punishAt: 3.48,
    resetAt: 4.92,
    laneStart: [274, 430],
    laneEnd: [548, 430],
    laneHalfWidth: 24,
    punishReach: 118,
  },
  'survival-phase': {
    mode: 'survival-phase',
    boss: [240, 430],
    player: [445, 650],
    target: [355, 430],
    survival: [0.55, 4.35],
    shieldDropsAt: 4.35,
    punishAt: 5.08,
    resetAt: 5.35,
    hazardRadius: 92,
    hazards: [
      { center: [445, 650], preview: [0.55, 1.15], active: [1.15, 1.48] },
      { center: [430, 330], preview: [1.48, 2.08], active: [2.08, 2.41] },
      { center: [145, 430], preview: [2.41, 3.01], active: [3.01, 3.34] },
      { center: [395, 655], preview: [3.34, 3.94], active: [3.94, 4.27] },
    ],
    safePositions: [
      [430, 330],
      [145, 430],
      [395, 655],
      [430, 380],
    ],
  },
  teleport: {
    mode: 'teleport',
    boss: [155, 360],
    player: [400, 640],
    target: [485, 520],
    destination: [390, 360],
    safePosition: [500, 560],
    departure: [0.55, 1.05],
    destinationPreview: [0.72, 1.7],
    absent: [1.05, 1.52],
    arrival: [1.52, 1.7],
    followUpPreview: [1.7, 2.36],
    active: [2.36, 2.72],
    punishAt: 3.55,
    recoveryEnd: 4.45,
    resetDeparture: [4.75, 5.15],
    resetAbsent: [5.15, 5.62],
    resetArrival: [5.62, 6],
    laneStart: [390, 408],
    laneEnd: [390, 790],
    laneHalfWidth: 28,
  },
  'boundary-attack': {
    mode: 'boundary-attack',
    boss: [-55, 610],
    player: [300, 610],
    target: [365, 610],
    safePosition: [300, 485],
    signal: [0.55, 1.72],
    active: [1.72, 2.28],
    impactAt: 2.28,
    punishAt: 3.15,
    openingEnd: 3.75,
    withdrawEnd: 4.15,
    outerRoute: [4.15, 5.85],
    laneStart: [0, 610],
    laneEnd: [560, 610],
    laneHalfWidth: 40,
    leftBoundary: 58,
    rightBoundary: 502,
    impactPosition: [460, 610],
  },
  'forced-scrolling': {
    mode: 'forced-scrolling',
    boss: [150, 724],
    player: [350, 650],
    target: [382, 632],
    safePosition: [420, 435],
    signal: [0.5, 1.25],
    active: [1.25, 4.25],
    bossAdvanceEnd: 4.72,
    punishAt: 5.05,
    resetAt: 5.35,
    hazardTop: 730,
    scrollDistance: 310,
    stopRune: [420, 405],
    bossOpening: [280, 665],
    route: [
      [350, 650],
      [420, 585],
      [300, 510],
      [420, 435],
    ],
    platforms: [
      [305, 690, 130],
      [380, 555, 120],
      [245, 425, 125],
      [405, 295, 115],
    ],
  },
  'chase-herding': {
    mode: 'chase-herding',
    boss: [170, 620],
    player: [92, 705],
    target: [392, 625],
    safePosition: [350, 500],
    signal: [0.5, 1.15],
    active: [1.15, 3.75],
    captureEnd: 4.45,
    punishAt: 4.72,
    resetAt: 5.15,
    distanceBand: [68, 185],
    captureZone: [445, 620],
    captureRadius: 52,
    bossRoute: [
      [170, 620],
      [275, 570],
      [365, 635],
      [445, 620],
    ],
    playerRoute: [
      [92, 705],
      [180, 690],
      [255, 520],
      [350, 500],
    ],
    checkpoints: [
      [275, 570],
      [365, 635],
      [445, 620],
    ],
  },
  'escape-phase': {
    mode: 'escape-phase',
    boss: [170, 620],
    player: [98, 710],
    target: [350, 620],
    triggerAt: 0.55,
    escape: [1.15, 2.85],
    staggerEnd: 3.35,
    openingEnd: 4.45,
    punishAt: 3.72,
    resetAt: 5.15,
    exitGate: [468, 520],
    interruptPoint: [390, 555],
    bossRoute: [
      [170, 620],
      [260, 575],
      [330, 610],
      [390, 555],
    ],
    playerRoute: [
      [98, 710],
      [195, 680],
      [280, 625],
      [350, 620],
    ],
  },
  'relocated-arena': {
    mode: 'relocated-arena',
    boss: [205, 500],
    player: [365, 535],
    target: [390, 755],
    previewAt: 0.55,
    transfer: [1.15, 2.15],
    punishAt: 3.85,
    resetAt: 4.75,
    upperBoss: [205, 500],
    upperPlayer: [365, 535],
    lowerBoss: [250, 720],
    lowerPlayer: [390, 755],
    bossTransfer: [
      [205, 500],
      [215, 565],
      [230, 645],
      [250, 720],
    ],
    playerTransfer: [
      [365, 535],
      [368, 600],
      [378, 680],
      [390, 755],
    ],
    bossReset: [
      [250, 720],
      [105, 720],
      [105, 500],
      [205, 500],
    ],
    playerReset: [
      [390, 755],
      [225, 755],
      [225, 535],
      [365, 535],
    ],
  },
  'control-mode-shift': {
    mode: 'control-mode-shift',
    boss: [305, 480],
    player: [155, 645],
    target: [275, 700],
    previewAt: 0.55,
    handoff: [1.15, 1.65],
    wave: [2.05, 3.2],
    punishAt: 3.85,
    resetAt: 4.75,
    groundedBoss: [355, 670],
    groundedPlayer: [170, 720],
    strikePlayer: [275, 700],
    waveStart: [340, 724],
    waveEnd: [82, 724],
  },
  'boss-as-terrain': {
    mode: 'boss-as-terrain',
    boss: [280, 640],
    player: [448, 770],
    target: [302, 514],
    revealAt: 0.45,
    mountAt: 1.08,
    shake: [2.02, 2.68],
    weakPointOpensAt: 3.18,
    punishAt: 3.72,
    drop: [4.18, 5.05],
    resetAt: 5.05,
    weakPoint: [302, 514],
    mountPoint: [386, 704],
    holdPoint: [354, 604],
    landingPoint: [438, 770],
    climbRoute: [
      [448, 770],
      [386, 704],
      [366, 652],
      [354, 604],
      [334, 558],
      [302, 514],
    ],
    dropRoute: [
      [302, 514],
      [350, 565],
      [396, 642],
      [438, 770],
    ],
  },
  'cover-line-of-sight': {
    mode: 'cover-line-of-sight',
    boss: [110, 540],
    player: [470, 850],
    target: [205, 470],
    source: [150, 495],
    coverPoint: [470, 610],
    strikePoint: [205, 470],
    pillar: [285, 500, 70, 160],
    edgeMargin: 7,
    lockAt: 0.42,
    shadowAt: 0.78,
    coveredAt: 1.62,
    beam: [2.12, 3.18],
    punishAt: 3.92,
    resetAt: 5.08,
    exitRoute: [
      [470, 610],
      [440, 520],
      [410, 430],
      [350, 415],
      [300, 405],
      [250, 435],
      [205, 470],
    ],
    resetRoute: [
      [205, 470],
      [250, 435],
      [300, 405],
      [350, 415],
      [410, 430],
      [420, 500],
      [435, 585],
      [450, 670],
      [460, 760],
      [470, 850],
    ],
  },
  'forced-inertia': {
    mode: 'forced-inertia',
    boss: [300, 330],
    player: [118, 790],
    target: [300, 430],
    entryPoint: [152, 754],
    brakePoint: [392, 554],
    strikePoint: [300, 430],
    frostAt: 0.44,
    vectorAt: 0.82,
    commitAt: 1.34,
    slide: [1.62, 2.82],
    brake: [2.82, 3.28],
    punishAt: 3.72,
    resetAt: 4.85,
    dangerX: 492,
    slideRoute: [
      [152, 754],
      [212, 704],
      [272, 654],
      [332, 604],
      [392, 554],
    ],
    strikeRoute: [
      [392, 554],
      [366, 512],
      [338, 470],
      [300, 430],
    ],
    resetRoute: [
      [300, 430],
      [326, 492],
      [352, 554],
      [316, 626],
      [254, 690],
      [188, 746],
      [118, 790],
    ],
  },
  'wraparound-projectile': {
    mode: 'wraparound-projectile',
    boss: [150, 430],
    player: [410, 690],
    target: [250, 455],
    arena: [36, 100, 488, 780],
    laneY: 590,
    leftBoundary: 56,
    rightBoundary: 504,
    signalAt: 0.48,
    previewAt: 0.82,
    releaseAt: 1.36,
    firstPass: [1.36, 2.22],
    crossing: [2.22, 2.5],
    secondPass: [2.5, 3.58],
    punishAt: 4.22,
    resetAt: 5.02,
    projectileRadius: 22,
    safePoint: [410, 790],
    strikePoint: [250, 455],
    resetRoute: [
      [250, 455],
      [300, 520],
      [350, 600],
      [390, 680],
      [410, 690],
    ],
  },
  'beat-synced-attack': {
    mode: 'beat-synced-attack',
    boss: [280, 305],
    player: [420, 700],
    target: [280, 440],
    arena: [54, 96, 452, 782],
    lanes: [140, 280, 420],
    laneHalfWidth: 52,
    laneTop: 430,
    laneBottom: 870,
    beatOrigin: 0.48,
    beatInterval: 0.6,
    hits: [1.68, 2.28, 2.88],
    pattern: [2, 1, 0],
    attackDuration: 0.24,
    telegraphLead: 0.42,
    phraseClearsAt: 3.12,
    punishAt: 4.18,
    resetAt: 5.06,
    strikePoint: [280, 440],
    safePositions: [
      [280, 700],
      [140, 700],
      [280, 700],
    ],
    resetRoute: [
      [280, 440],
      [310, 500],
      [350, 570],
      [390, 640],
      [420, 700],
    ],
  },
  'secondary-cues-invisibility': {
    mode: 'secondary-cues-invisibility',
    boss: [160, 230],
    player: [330, 690],
    target: [390, 540],
    arena: [43, 88, 477, 793],
    vanishAt: 0.62,
    hiddenAt: 0.88,
    lockAt: 2.32,
    attack: [2.72, 3.16],
    revealAt: 3.38,
    punishAt: 4.18,
    resetAt: 5.05,
    cueLifetime: 0.9,
    laneHalfWidth: 28,
    laneEnd: [130, 820],
    safePoint: [470, 710],
    strikePoint: [390, 540],
    hiddenRoute: [
      [160, 230],
      [210, 290],
      [270, 350],
      [330, 430],
      [390, 520],
    ],
    clues: [
      { point: [190, 265], at: 0.96 },
      { point: [240, 325], at: 1.22 },
      { point: [300, 388], at: 1.52 },
      { point: [350, 470], at: 1.82 },
      { point: [390, 520], at: 2.12 },
    ],
    playerRoute: [
      [330, 690],
      [370, 710],
      [430, 730],
      [470, 710],
    ],
    resetRoute: [
      [390, 540],
      [370, 580],
      [350, 630],
      [330, 690],
    ],
  },
  'sound-detection': {
    mode: 'sound-detection',
    boss: [150, 290],
    player: [130, 700],
    target: [350, 585],
    quietAt: 0.52,
    noiseAt: 1.36,
    heardAt: 1.5,
    investigate: [1.68, 2.58],
    lockAt: 2.58,
    attack: [2.92, 3.32],
    searchEndsAt: 3.72,
    punishAt: 4.28,
    resetAt: 5.12,
    hearingRadius: 500,
    soundPoint: [380, 650],
    investigatePoint: [330, 575],
    hidePoint: [480, 790],
    strikePoint: [350, 585],
    dangerRadius: 76,
    approachRoute: [
      [130, 700],
      [210, 680],
      [300, 660],
      [380, 650],
    ],
    silentRoute: [
      [380, 650],
      [420, 700],
      [455, 745],
      [480, 790],
    ],
    resetRoute: [
      [350, 585],
      [280, 600],
      [200, 660],
      [130, 700],
    ],
  },
  'objective-linked-invulnerability': {
    mode: 'objective-linked-invulnerability',
    boss: [280, 290],
    player: [365, 400],
    target: [220, 410],
    blockedStrike: 0.62,
    objectiveHits: [1.18, 1.92, 2.68],
    gateDropsAt: 2.88,
    vulnerable: [3.05, 4.05],
    bossStrike: 3.46,
    shieldReturns: 4.22,
    resetAt: 5.1,
    shieldRadius: 86,
    objectives: [
      [445, 640],
      [280, 790],
      [115, 640],
    ],
    strikePoint: [220, 410],
    retreatPoint: [390, 560],
    resetRoute: [
      [390, 560],
      [405, 480],
      [365, 400],
    ],
  },
  'wave-clear-objective': {
    mode: 'wave-clear-objective',
    boss: [280, 290],
    player: [280, 780],
    target: [340, 560],
    waveSpawns: [0.75, 1.9, 3.28],
    waveKills: [
      [1.08, 1.38],
      [2.2, 2.48, 2.76],
      [3.62, 3.94, 4.28],
    ],
    waveClears: [1.58, 2.98, 4.5],
    resolveAt: 4.72,
    rewardAt: 4.95,
    resetAt: 5.28,
    gates: [
      [70, 590],
      [490, 590],
    ],
    waveEnemies: [
      [
        [160, 620],
        [390, 620],
      ],
      [
        [420, 570],
        [280, 700],
        [140, 570],
      ],
      [
        [155, 650],
        [280, 600],
        [405, 650],
      ],
    ],
    playerTimeline: [
      [0, 280, 780],
      [0.75, 280, 780],
      [1.08, 190, 665],
      [1.38, 360, 665],
      [1.58, 360, 665],
      [2.2, 365, 610],
      [2.48, 280, 670],
      [2.76, 190, 610],
      [2.98, 190, 610],
      [3.62, 190, 670],
      [3.94, 280, 640],
      [4.28, 370, 670],
      [4.5, 370, 670],
      [4.95, 340, 560],
      [5.28, 340, 560],
      [6, 280, 780],
    ],
    rewardChest: [440, 485],
  },
  'environmental-weapon': {
    mode: 'environmental-weapon',
    boss: [280, 290],
    player: [100, 760],
    target: [430, 690],
    powerNode: [112, 555],
    device: [430, 690],
    muzzle: [385, 590],
    playerRoutes: {
      power: [
        [100, 760],
        [100, 650],
        [112, 555],
      ],
      device: [
        [112, 555],
        [150, 650],
        [270, 750],
        [390, 730],
        [430, 690],
      ],
      retreat: [
        [430, 690],
        [395, 735],
        [350, 760],
      ],
      reset: [
        [350, 760],
        [220, 790],
        [100, 760],
      ],
    },
    routeStartsAt: 0.55,
    powerReachedAt: 1.3,
    powerOnAt: 1.55,
    deviceRouteAt: 1.65,
    deviceReachedAt: 2.45,
    aimPreviewAt: 2.55,
    aimLockedAt: 2.85,
    fireAt: 3.12,
    hitAt: 3.5,
    spentAt: 3.68,
    rewardAt: 4.72,
    resetAt: 5.15,
  },
  'encounter-specific-tool': {
    mode: 'encounter-specific-tool',
    boss: [300, 290],
    player: [95, 785],
    target: [330, 690],
    pedestal: [130, 545],
    combatPoint: [330, 690],
    pickupRoute: [
      [95, 785],
      [95, 665],
      [130, 545],
    ],
    carryRoute: [
      [130, 545],
      [190, 620],
      [260, 710],
      [330, 690],
    ],
    resetRoute: [
      [330, 690],
      [230, 760],
      [95, 785],
    ],
    routeStartsAt: 0.55,
    toolReachedAt: 1.25,
    toolEquippedAt: 1.48,
    carryStartsAt: 1.75,
    combatReachedAt: 2.35,
    charge: [2.42, 2.95],
    readyAt: 2.95,
    fireAt: 3.15,
    hitAt: 3.52,
    recoveryAt: 4.15,
    toolExpiresAt: 4.6,
    resetAt: 5.2,
  },
  'player-controlled-boss': {
    mode: 'player-controlled-boss',
    boss: [300, 300],
    player: [95, 735],
    target: [430, 735],
    controllerPanel: [112, 510],
    crown: [300, 150],
    attackEnd: [95, 835],
    laneHalfWidth: 36,
    playerRoute: [
      [95, 735],
      [180, 775],
      [300, 805],
      [430, 735],
    ],
    candidateAt: 0.7,
    assignedAt: 1.2,
    controllerActiveAt: 1.55,
    actionQueuedAt: 2.05,
    telegraph: [2.18, 2.68],
    active: [2.68, 3.08],
    recoveryEndsAt: 3.42,
    heartbeatLostAt: 3.55,
    aiTakeoverAt: 3.95,
    aiContinueAt: 4.45,
    resetAt: 5.2,
  },
  'projectile-rally': {
    mode: 'projectile-rally',
    boss: [300, 300],
    player: [300, 720],
    target: [300, 720],
    arena: [40, 145, 480, 715],
    bossContact: [300, 400],
    playerContact: [300, 630],
    projectileRadius: 18,
    serveAt: 0.78,
    legs: [
      { owner: 'boss', start: 0.78, end: 1.48, from: [300, 400], to: [300, 630] },
      { owner: 'player', start: 1.48, end: 2.05, from: [300, 630], to: [300, 400] },
      { owner: 'boss', start: 2.05, end: 2.48, from: [300, 400], to: [300, 630] },
      { owner: 'player', start: 2.48, end: 2.86, from: [300, 630], to: [300, 400] },
      { owner: 'boss', start: 2.86, end: 3.15, from: [300, 400], to: [300, 630] },
      { owner: 'player', start: 3.15, end: 3.48, from: [300, 630], to: [300, 400] },
    ],
    playerContacts: [1.48, 2.48, 3.15],
    bossReturns: [2.05, 2.86],
    bossMissAt: 3.48,
    vulnerableUntil: 4.55,
    punishAt: 3.9,
    punishPoint: [300, 500],
    retreatAt: 4.18,
    resetAt: 5.2,
  },
  'baited-self-hit': {
    mode: 'baited-self-hit',
    boss: [300, 240],
    player: [300, 760],
    target: [300, 760],
    arena: [40, 145, 480, 715],
    trap: [300, 610],
    armPoint: [360, 650],
    safePoint: [430, 730],
    punishPoint: [405, 570],
    impactPosition: [300, 520],
    laneEnd: [300, 790],
    laneHalfWidth: 40,
    trapRadius: 30,
    blastRadius: 82,
    approachAt: 0.34,
    armReachedAt: 0.7,
    armedAt: 0.82,
    aimAt: 1.05,
    lockedAt: 1.38,
    charge: [1.55, 2.45],
    evade: [1.58, 2.12],
    impactAt: 2.45,
    selfHitAt: 2.58,
    punishApproachAt: 2.72,
    vulnerableUntil: 4.25,
    punishAt: 3.25,
    retreatAt: 3.62,
    resetAt: 5.2,
  },
  'posture-stagger-gauge': {
    mode: 'posture-stagger-gauge',
    boss: [280, 310],
    player: [280, 700],
    target: [280, 700],
    arena: [40, 145, 480, 715],
    pressurePoint: [280, 455],
    finisherPoint: [280, 430],
    contacts: [0.72, 1.72, 2.12, 2.62],
    postureAfterContact: [32, 48, 72, 100],
    recovery: [1.02, 1.42],
    recoveryFloor: 18,
    pressureApproachAt: 0.28,
    breakAt: 2.62,
    criticalReadyAt: 2.78,
    finisherApproachAt: 2.9,
    finisherAt: 3.46,
    criticalEndsAt: 3.88,
    recoveryEndsAt: 4.72,
    resetAt: 5.2,
  },
  'pacifist-resolution': {
    mode: 'pacifist-resolution',
    boss: [280, 245],
    player: [280, 660],
    target: [280, 660],
    arena: [40, 145, 480, 715],
    attacks: [
      { telegraph: [0.72, 0.96], active: [0.96, 1.22], laneX: 280 },
      { telegraph: [1.45, 1.72], active: [1.72, 1.98], laneX: 390 },
      { telegraph: [2.05, 2.25], active: [2.25, 2.5], laneX: 170 },
    ],
    laneTop: 300,
    laneBottom: 830,
    laneHalfWidth: 38,
    sheathAt: 0.42,
    restraintStartsAt: 0.55,
    conditionMetAt: 2.6,
    choiceOfferedAt: 2.78,
    spareApproachAt: 2.9,
    sparePoint: [280, 425],
    spareAt: 3.46,
    choiceEndsAt: 3.88,
    resolvedAt: 4.05,
    resetAt: 5.2,
  },
  'persistent-progress': {
    mode: 'persistent-progress',
    boss: [280, 245],
    player: [280, 710],
    target: [280, 710],
    arena: [40, 145, 480, 715],
    anchors: [
      [145, 440],
      [415, 440],
    ],
    strikePoints: [
      [145, 540],
      [415, 540],
    ],
    corePoint: [280, 425],
    approachStarts: [0.32, 1.77, 3.29],
    strikes: [0.78, 2.28, 3.92],
    commits: [0.98, 2.5, 4.18],
    hazards: [
      { telegraph: [1.02, 1.14], active: [1.14, 1.4], laneY: 540 },
      { telegraph: [2.54, 2.66], active: [2.66, 2.92], laneY: 540 },
    ],
    laneStart: [80, 540],
    laneEnd: [520, 540],
    laneHalfWidth: 34,
    restores: [
      [1.4, 1.77],
      [2.92, 3.29],
    ],
    approachEnds: [0.72, 2.22, 3.83],
    retreatAt: 4.48,
    resetAt: 5.45,
  },
  'status-buildup': {
    mode: 'status-buildup',
    boss: [280, 300],
    player: [415, 700],
    target: [350, 520],
    arena: [40, 145, 480, 715],
    exposurePoint: [350, 520],
    auraRadius: 235,
    approach: [0.28, 0.62],
    contacts: [0.72, 2.14, 2.6],
    contactWindows: [
      [0.64, 0.82],
      [2.06, 2.24],
      [2.52, 2.7],
    ],
    retreat: [0.88, 1.24],
    reenter: [1.78, 2.12],
    decay: [1.08, 1.72],
    buildupAfterContact: [38, 55, 100],
    decayFloor: 14,
    thresholdAt: 2.6,
    effectStartsAt: 2.72,
    effectEndsAt: 3.72,
    immuneProbeAt: 4.05,
    immunityEndsAt: 4.42,
    resetAt: 5.2,
  },
  'instant-kill': {
    mode: 'instant-kill',
    boss: [280, 245],
    player: [280, 660],
    target: [450, 750],
    arena: [40, 145, 480, 715],
    executionCenter: [280, 660],
    safePoint: [450, 750],
    executionRadius: 92,
    firstTelegraph: [0.3, 0.96],
    firstEscape: [0.48, 0.88],
    firstResolveAt: 0.98,
    return: [1.16, 1.58],
    secondTelegraph: [1.82, 2.58],
    conditionLockedAt: 2.58,
    executeAt: 2.86,
    executionWindow: [2.78, 2.98],
    resultVisibleAt: 3.02,
    restore: [4.18, 4.72],
    resetAt: 5.2,
  },
  'maximum-health-reduction': {
    mode: 'maximum-health-reduction',
    boss: [300, 245],
    player: [300, 660],
    target: [450, 750],
    arena: [40, 145, 480, 715],
    attackEnd: [300, 830],
    safePoint: [450, 750],
    laneHalfWidth: 68,
    firstTelegraph: [0.3, 0.96],
    firstEscape: [0.5, 0.88],
    firstResolveAt: 1,
    return: [1.16, 1.58],
    secondTelegraph: [1.82, 2.54],
    hitAt: 2.68,
    hitWindow: [2.58, 2.82],
    capReduction: [2.68, 3.08],
    healAttempt: [3.28, 3.72],
    cleanse: [4.08, 4.48],
    fullHeal: [4.48, 4.96],
    resetAt: 5.4,
    maxHealthBefore: 100,
    maxHealthAfter: 65,
    currentHealthBefore: 80,
    damageApplied: 20,
    currentHealthAfter: 60,
  },
  'ability-lock': {
    mode: 'ability-lock',
    boss: [280, 245],
    player: [280, 660],
    target: [450, 750],
    arena: [40, 145, 480, 715],
    sealCenter: [280, 660],
    safePoint: [450, 750],
    sealRadius: 96,
    firstTelegraph: [0.3, 0.94],
    firstEscape: [0.48, 0.86],
    firstResolveAt: 0.98,
    firstHeal: [1.06, 1.38],
    return: [1.42, 1.74],
    secondTelegraph: [1.9, 2.56],
    hitAt: 2.66,
    hitWindow: [2.56, 2.78],
    lockEndsAt: 4.28,
    rejectedHeal: [3.02, 3.42],
    swordProof: [3.56, 3.94],
    restoredHeal: [4.42, 4.86],
    settleAt: 5.04,
    resetAt: 5.36,
    healthBefore: 55,
    healAmount: 20,
    hitDamage: 20,
  },
  'resource-steal': {
    mode: 'resource-steal',
    boss: [280, 245],
    player: [280, 660],
    target: [450, 750],
    arena: [40, 145, 480, 715],
    stealCenter: [280, 660],
    safePoint: [450, 750],
    reclaimPoint: [125, 720],
    stealRadius: 96,
    firstTelegraph: [0.3, 0.94],
    firstEscape: [0.48, 0.86],
    firstResolveAt: 0.98,
    return: [1.18, 1.58],
    secondTelegraph: [1.82, 2.54],
    hitAt: 2.64,
    hitWindow: [2.54, 2.78],
    spill: [2.64, 3.08],
    reclaim: [3.08, 3.48],
    capture: [3.48, 3.9],
    benefitAt: 3.9,
    retreat: [4.42, 5.08],
    resetAt: 5.34,
    initialResource: 6,
    dropCount: 3,
    tokenTargets: [
      [125, 750],
      [280, 790],
      [425, 770],
    ],
  },
  'on-hit-healing': {
    mode: 'on-hit-healing',
    boss: [300, 300],
    player: [300, 755],
    target: [430, 820],
    arena: [55, 145, 450, 735],
    strikeCenter: [300, 755],
    safePoint: [430, 820],
    strikeRadius: 96,
    firstTelegraph: [0.3, 0.94],
    firstEscape: [0.48, 0.86],
    firstResolveAt: 0.98,
    return: [1.18, 1.58],
    secondTelegraph: [1.82, 2.52],
    blockedHitAt: 2.64,
    blockedHitWindow: [2.54, 2.78],
    healing: [2.64, 3.06],
    thirdTelegraph: [3.34, 4],
    thirdEscape: [3.52, 3.86],
    thirdResolveAt: 4.04,
    thirdHitWindow: [3.94, 4.16],
    counterReturn: [4.18, 4.5],
    counterAt: 4.68,
    resetAt: 5.34,
    bossHealthBefore: 48,
    healAmount: 16,
  },
  'self-heal-cast': {
    mode: 'self-heal-cast',
    boss: [300, 300],
    player: [300, 760],
    target: [300, 490],
    arena: [55, 145, 450, 735],
    interruptPoint: [300, 500],
    firstTelegraph: [0.3, 0.78],
    firstChannel: [0.78, 1.46],
    approach: [0.62, 1.28],
    interruptAt: 1.46,
    firstRecovery: [1.46, 1.82],
    return: [1.68, 2.22],
    secondTelegraph: [2.54, 3.02],
    secondChannel: [3.02, 4.18],
    healing: [4.18, 4.62],
    secondRecovery: [4.62, 5.1],
    resetAt: 5.36,
    bossHealthBefore: 38,
    healAmount: 24,
    channelRadius: 82,
  },
  'external-healing-source': {
    mode: 'external-healing-source',
    boss: [300, 300],
    player: [300, 760],
    target: [170, 555],
    arena: [55, 145, 450, 735],
    firstSource: [165, 510],
    secondSource: [435, 510],
    firstSignal: [0.28, 0.72],
    firstTransfer: [0.72, 1.42],
    approach: [0.62, 1.2],
    destroyAt: 1.42,
    firstRecovery: [1.42, 1.78],
    return: [1.62, 2.2],
    secondSignal: [2.46, 2.9],
    secondTransfer: [2.9, 4.08],
    healing: [4.08, 4.5],
    secondRecovery: [4.5, 5.08],
    resetAt: 5.36,
    bossHealthBefore: 42,
    healAmount: 18,
    sourceRadius: 38,
  },
  'damage-rate-cap': {
    mode: 'damage-rate-cap',
    boss: [300, 300],
    player: [300, 760],
    target: [300, 760],
    arena: [55, 145, 450, 735],
    isolatedSignal: [0.34, 0.82],
    isolatedHitAt: 0.92,
    firstWindowClearsAt: 1.72,
    burstSignal: [1.82, 2.02],
    burstHits: [2.08, 2.43, 2.78, 3.13],
    burstEndsAt: 3.48,
    decay: [3.48, 4.48],
    recoveredSignal: [4.48, 4.82],
    recoveredHitAt: 4.94,
    recoveryEndsAt: 5.34,
    resetAt: 5.42,
    bossHealthBefore: 100,
    rawDamage: 18,
    threshold: 18,
    minimumMultiplier: 0.25,
  },
  'loadout-mirror': {
    mode: 'loadout-mirror',
    boss: [300, 285],
    player: [300, 775],
    target: [300, 775],
    arena: [55, 145, 450, 735],
    scan: [0.32, 1.14],
    captureAt: 1.14,
    copyReveal: [1.14, 2.18],
    playerSwapAt: 2.62,
    bossUseAt: 3.42,
    bossUseEndsAt: 4.12,
    stableUntil: 5.28,
    resetAt: 5.42,
    snapshotId: 'loadout-snapshot-1',
    initialLoadout: ['sword', 'ward', 'ember'],
    changedLoadout: ['bow', 'dash', 'frost'],
  },
  'moveset-shapeshifting': {
    mode: 'moveset-shapeshifting',
    boss: [300, 330],
    player: [300, 760],
    target: [300, 760],
    arena: [55, 145, 450, 735],
    firstSignal: [0.2, 0.55],
    firstActive: [0.55, 1.35],
    firstRecovery: [1.35, 1.72],
    firstChange: [1.72, 2.05],
    secondSignal: [2.05, 2.35],
    secondActive: [2.35, 3.2],
    secondRecovery: [3.2, 3.48],
    secondChange: [3.48, 3.82],
    thirdSignal: [3.82, 4.12],
    thirdActive: [4.12, 5],
    thirdRecovery: [5, 5.32],
    resetAt: 5.42,
    forms: ['colossus', 'serpent', 'oracle'],
    packages: ['colossus-slam', 'serpent-lane', 'oracle-fan'],
  },
  'ally-theft': {
    mode: 'ally-theft',
    boss: [300, 330],
    player: [300, 760],
    target: [300, 760],
    arena: [55, 145, 450, 735],
    allyStart: [368, 650],
    allyCaptured: [382, 458],
    mark: [0.55, 1.15],
    transfer: [1.15, 1.55],
    hostile: [1.55, 3.55],
    shotTimes: [1.75, 2.3, 2.85],
    shotTargets: [
      [300, 660],
      [205, 650],
      [365, 650],
    ],
    shotFlight: 0.42,
    projectileRadius: 14,
    release: [3.55, 4.05],
    returning: [4.05, 4.75],
    recoveryEndsAt: 5.32,
    resetAt: 5.42,
    allyId: 'rune-familiar-1',
    captureId: 'ally-capture-1',
  },
  'false-death': {
    mode: 'false-death',
    boss: [300, 320],
    player: [370, 700],
    target: [430, 680],
    arena: [55, 145, 450, 735],
    strikePosition: [352, 565],
    retreatPosition: [440, 680],
    dodgePosition: [170, 680],
    strikeAt: 0.75,
    collapse: [0.75, 1.35],
    pending: [1.35, 2.15],
    rebuild: [2.15, 3.15],
    revivalAt: 3.15,
    secondSignal: [3.45, 4],
    secondActive: [4, 4.45],
    secondStableUntil: 5.35,
    resetAt: 5.35,
    phaseOneHealth: 100,
    phaseTwoHealth: 68,
    attackRadius: 154,
    depletionId: 'phase-1-depletion-1',
    revivalId: 'false-death-revival-1',
  },
  'action-reactive-punish': {
    mode: 'action-reactive-punish',
    boss: [300, 310],
    player: [405, 760],
    target: [165, 775],
    arena: [55, 145, 450, 735],
    lockedTarget: [405, 760],
    dodgePosition: [165, 775],
    action: [0.45, 1.15],
    observedAt: 0.68,
    responseSignal: [0.68, 1.28],
    responseFlight: [1.28, 1.9],
    responseRecoveryEndsAt: 2.45,
    playerDodge: [1.32, 1.72],
    playerReturn: [2.15, 2.7],
    bossCommit: [2.75, 3.1],
    bossAttack: [3.1, 3.55],
    bossRecovery: [3.55, 4.65],
    safeAction: [3.72, 4.65],
    cooldownEndsAt: 5.2,
    resetAt: 5.35,
    projectileStart: [334, 349],
    projectileRadius: 24,
    actionId: 'heal-1',
    responseId: 'action-response-1',
  },
  'run-history-manifestation': {
    mode: 'run-history-manifestation',
    boss: [300, 390],
    player: [405, 700],
    target: [430, 700],
    arena: [55, 145, 450, 735],
    historyMarkers: [
      [120, 170],
      [280, 170],
      [440, 170],
    ],
    entryGate: [280, 274],
    echo: [135, 535],
    ward: [440, 700],
    relic: [300, 360],
    capturedAt: 1.15,
    materialize: [1.15, 1.85],
    echoSignal: [1.85, 2.25],
    echoFlight: [2.25, 2.85],
    echoTarget: [405, 700],
    playerMove: [2.12, 2.62],
    relicSignal: [2.7, 3.18],
    relicActive: [3.18, 3.72],
    opening: [3.72, 4.55],
    retry: [4.55, 5.35],
    resetAt: 5.35,
    projectileRadius: 22,
    relicRadius: 205,
    wardRadius: 72,
    encounterId: 'kern-memory-vault-1',
    entryId: 'vault-entry-1',
    manifestId: 'run-manifest-echo-ward-relic-1',
  },
  'real-time-progression': {
    mode: 'real-time-progression',
    boss: [300, 400],
    player: [410, 720],
    target: [430, 720],
    arena: [55, 145, 450, 735],
    savedClock: [150, 165],
    currentClock: [410, 165],
    ledger: [280, 250],
    offlineSeals: [
      [135, 610],
      [430, 575],
    ],
    checkpointAt: 0.72,
    closed: [1.02, 1.72],
    reconcile: [1.72, 2.35],
    summary: [2.35, 2.9],
    attackSignal: [2.9, 3.3],
    attack: [3.3, 3.78],
    opening: [3.78, 4.55],
    retry: [4.55, 5.35],
    resetAt: 5.35,
    playerMove: [2.82, 3.38],
    attackRadius: 225,
    checkpointId: 'kern-clock-vault-1',
    reconciliationId: 'offline-reconcile-1',
    authority: 'trusted-server',
    savedHour: 12,
    currentHour: 19,
    elapsedHours: 7,
    appliedHours: 6,
  },
  'interface-interaction': {
    mode: 'interface-interaction',
    boss: [300, 400],
    player: [370, 610],
    target: [430, 720],
    arena: [55, 145, 450, 735],
    primaryPort: [145, 165],
    alternatePort: [415, 165],
    routeHub: [280, 260],
    firstAttack: [0.42, 0.9],
    blockedAt: 0.72,
    pause: [1.28, 2.38],
    switchRoute: [1.55, 2.05],
    confirm: [2.05, 2.38],
    opening: [2.72, 3.38],
    counterSignal: [3.38, 3.72],
    counter: [3.72, 4.18],
    playerMove: [3.48, 3.86],
    resumedAt: 4.18,
    retry: [4.65, 5.35],
    resetAt: 5.35,
    attackRadius: 205,
    interactionId: 'kern-input-ward-1',
    confirmationId: 'route-confirmation-1',
    primaryRoute: 'channel-a',
    alternateRoute: 'channel-b',
    fallbackRoute: 'menu-fallback',
  },
  'world-state-variant': {
    mode: 'world-state-variant',
    boss: [300, 410],
    player: [405, 720],
    target: [430, 745],
    arena: [55, 145, 450, 735],
    timeToken: [120, 150],
    regionToken: [280, 150],
    modeToken: [440, 150],
    packageNode: [280, 250],
    rewardToken: [445, 360],
    variantSeals: [
      [135, 630],
      [425, 580],
    ],
    snapshotAt: 0.78,
    materialize: [1.05, 1.6],
    attackSignal: [1.8, 2.25],
    attack: [2.25, 2.85],
    playerMove: [2.08, 2.56],
    opening: [2.85, 3.55],
    reward: [3.55, 4.2],
    outsideChangeAt: 4.55,
    retry: [4.55, 5.35],
    resetAt: 5.35,
    attackRadius: 205,
    encounterId: 'kern-world-gate-1',
    entryId: 'world-entry-1',
    variantId: 'eclipse-ruin',
    rewardTableId: 'eclipse-relic-table',
  },
  'party-size-scaling': {
    mode: 'party-size-scaling',
    boss: [300, 425],
    player: [330, 650],
    target: [430, 780],
    arena: [55, 145, 450, 735],
    rosterTokens: [
      [120, 145],
      [225, 145],
      [335, 145],
      [440, 145],
    ],
    scaleNode: [280, 255],
    healthBar: [120, 230, 320, 24],
    targetCenters: [
      [330, 650],
      [170, 650],
    ],
    allyTarget: [110, 790],
    joinQueuedAt: 0.62,
    scaleApplyAt: 1.18,
    attackSignal: [1.8, 2.22],
    attack: [2.22, 2.82],
    playerMove: [2.05, 2.55],
    opening: [2.82, 3.28],
    leaveQueuedAt: 3.28,
    leaveApplyAt: 3.72,
    reward: [4, 4.45],
    retry: [4.55, 5.35],
    resetAt: 5.35,
    targetRadius: 75,
    encounterId: 'kern-party-trial-1',
    joinResolutionId: 'party-scale-join-1',
    leaveResolutionId: 'party-scale-leave-1',
  },
  'partner-revival': {
    mode: 'partner-revival',
    boss: [355, 420],
    partner: [165, 520],
    player: [390, 760],
    target: [390, 570],
    arena: [55, 300, 450, 590],
    firstApproach: [280, 650],
    waitPoint: [400, 760],
    interruptPoint: [385, 575],
    finishPoint: [375, 535],
    firstDownAt: 0.55,
    firstChannel: [0.9, 1.55],
    firstReviveAt: 1.55,
    secondDownAt: 2.35,
    secondChannel: [2.75, 3.18],
    interruptAt: 3.18,
    interruptLockEnd: 3.55,
    survivorDownAt: 3.72,
    completionAt: 3.95,
    completionEnd: 4.45,
    retry: [4.65, 5.35],
    resetAt: 5.35,
    reviveHealthFraction: 0.4,
    survivorHealthFraction: 0.18,
    encounterId: 'kern-twin-covenant-1',
    firstAttemptId: 'partner-revive-1',
    secondAttemptId: 'partner-revive-2',
    partnerBossId: 'echo-kern',
    reviverBossId: 'kern',
  },
  'kill-order-inheritance': {
    mode: 'kill-order-inheritance',
    boss: [380, 420],
    partner: [170, 500],
    player: [275, 720],
    target: [400, 760],
    arena: [55, 300, 450, 590],
    firstApproach: [215, 625],
    firstSafe: [230, 760],
    secondApproach: [340, 620],
    secondSafe: [405, 800],
    firstDefeatAt: 1.05,
    firstTransfer: [1.25, 1.58],
    waveSignal: [1.65, 2],
    waveActive: [2, 2.55],
    intermission: [2.75, 3.15],
    secondDefeatAt: 3.65,
    secondTransfer: [3.82, 4.08],
    lanceSignal: [4.1, 4.5],
    lanceActive: [4.5, 5.08],
    resetAt: 5.5,
    waveMaxRadius: 250,
    waveHalfWidth: 15,
    lanceEnd: [425, 690],
    lanceHalfWidth: 27,
    encounterId: 'kern-inheritance-duel-1',
    leftBossId: 'echo-kern',
    rightBossId: 'kern',
  },
  'shared-group-health': {
    mode: 'shared-group-health',
    boss: [380, 430],
    partner: [170, 475],
    player: [285, 720],
    target: [400, 780],
    arena: [55, 275, 450, 615],
    firstApproach: [220, 625],
    firstSafe: [405, 780],
    secondApproach: [395, 625],
    secondSafe: [150, 785],
    finalApproach: [210, 625],
    firstHitAt: 0.8,
    withdrawAt: 1.55,
    firstSignal: [1.72, 2.1],
    firstAttack: [2.1, 2.52],
    returnAt: 3.15,
    secondHitAt: 3.55,
    secondSignal: [3.85, 4.22],
    secondAttack: [4.22, 4.6],
    finalHitAt: 4.85,
    completionAt: 5.05,
    retryAt: 5.55,
    firstLaneEnd: [100, 810],
    secondLaneEnd: [500, 820],
    laneHalfWidth: 23,
    encounterId: 'kern-shared-covenant-1',
    leftBossId: 'echo-kern',
    rightBossId: 'kern',
  },
  'coordinated-duo-attack': {
    mode: 'coordinated-duo-attack',
    boss: [390, 430],
    partner: [165, 450],
    leaderAnchor: [220, 500],
    targetOffset: [85, 250],
    player: [300, 730],
    target: [405, 790],
    arena: [55, 285, 450, 610],
    safePoint: [405, 790],
    interruptPoint: [250, 640],
    retreatPoint: [305, 765],
    leaderMove: [0.35, 0.95],
    firstSignal: [1.25, 2.05],
    leaderAttack: [2.05, 2.48],
    followerAttack: [2.23, 2.68],
    secondSignal: [3.15, 3.82],
    interruptAt: 3.58,
    plannedFollowerAt: 3.92,
    resetAt: 5.35,
    laneHalfWidth: 22,
    encounterId: 'kern-linked-duo-1',
    comboId: 'rune-pincer-1',
    leaderBossId: 'echo-kern',
    followerBossId: 'kern',
  },
  'stack-damage': {
    mode: 'stack-damage',
    boss: [280, 360],
    player: [280, 710],
    target: [280, 710],
    arena: [55, 245, 450, 650],
    allies: [
      [150, 710],
      [410, 710],
    ],
    stackPoints: [
      [225, 710],
      [335, 710],
    ],
    markerRadius: 115,
    totalDamage: 90,
    firstSignal: [0.7, 2.25],
    gather: [1.05, 1.9],
    firstHit: [2.25, 2.52],
    firstResolveAt: 2.25,
    secondSignal: [3.08, 4.28],
    disperse: [3.22, 3.9],
    secondHit: [4.28, 4.55],
    secondResolveAt: 4.28,
    resetAt: 5.3,
    encounterId: 'kern-shared-impact-1',
    firstHitId: 'rune-impact-1',
    secondHitId: 'rune-impact-2',
    targetPlayerId: 'tavi',
    allyIds: ['ally-left', 'ally-right'],
  },
  'personal-spread': {
    mode: 'personal-spread',
    boss: [280, 360],
    player: [280, 710],
    target: [280, 710],
    arena: [55, 245, 450, 650],
    allies: [
      [210, 710],
      [350, 710],
    ],
    safePoints: [
      [145, 710],
      [415, 710],
    ],
    markerRadius: 110,
    damagePerHit: 25,
    firstSignal: [0.65, 2.25],
    separate: [0.9, 1.8],
    firstHit: [2.25, 2.52],
    secondSignal: [3.05, 4.3],
    regroup: [3.25, 3.95],
    secondHit: [4.3, 4.58],
    resetAt: 5.3,
    encounterId: 'kern-three-marks-1',
    firstHitId: 'spread-pulse-1',
    secondHitId: 'spread-pulse-2',
    playerIds: ['tavi', 'ally-left', 'ally-right'],
  },
  'tower-soak': {
    mode: 'tower-soak',
    boss: [280, 360],
    player: [280, 710],
    target: [280, 710],
    arena: [55, 245, 450, 650],
    ally: [330, 795],
    firstTower: [405, 710],
    secondTower: [155, 710],
    towerRadius: 66,
    bodyRadius: BLUEPRINT_PLAYER_RADIUS,
    occupantDamage: 15,
    failureDamage: 90,
    firstSignal: [0.7, 2.2],
    enterFirst: [0.95, 1.78],
    firstHit: [2.2, 2.48],
    returnMiddle: [2.62, 3.03],
    secondSignal: [3.08, 4.3],
    enterSecond: [3.28, 3.98],
    secondHit: [4.3, 4.6],
    resetAt: 5.3,
    encounterId: 'kern-fixed-towers-1',
    firstHitId: 'tower-one-1',
    secondHitId: 'tower-two-1',
    playerIds: ['tavi', 'ally'],
  },
  'entity-tether': {
    mode: 'entity-tether',
    boss: [280, 345],
    player: [180, 700],
    target: [180, 700],
    arena: [55, 245, 450, 650],
    ally: [300, 760],
    togetherPlayer: [285, 690],
    togetherAlly: [400, 760],
    apartPlayer: [150, 675],
    apartAlly: [430, 803],
    maxLength: 150,
    breakDamage: 90,
    linkAt: 0.7,
    travelTogether: [0.95, 1.8],
    firstCheck: [2.2, 2.48],
    regroup: [2.62, 3.03],
    secondWarn: 3.08,
    travelApart: [3.28, 3.98],
    secondCheck: [4.3, 4.6],
    resetAt: 5.3,
    encounterId: 'kern-pair-tether-1',
    firstHitId: 'tether-pulse-1',
    secondHitId: 'tether-pulse-2',
    playerIds: ['tavi', 'ally'],
  },
  'gaze-check': {
    mode: 'gaze-check',
    boss: [280, 315],
    player: [280, 700],
    target: [280, 700],
    source: [280, 315],
    initialFacing: -90,
    safeFacing: 90,
    firstWarnAt: 0.7,
    turnAway: [1.04, 1.6],
    firstCheck: [2.2, 2.48],
    secondWarnAt: 3.08,
    turnToward: [3.34, 3.9],
    secondCheck: [4.3, 4.58],
    resetAt: 5.3,
    halfAngle: 90,
    failureDamage: 90,
    encounterId: 'kern-gaze-1',
    firstHitId: 'gaze-pulse-1',
    secondHitId: 'gaze-pulse-2',
  },
  'proximity-damage': {
    mode: 'proximity-damage',
    boss: [280, 285],
    player: [280, 600],
    target: [280, 600],
    source: [280, 380],
    farPoint: [280, 790],
    nearPoint: [280, 560],
    firstWarnAt: 0.68,
    moveFar: [1.02, 1.78],
    firstCheck: [2.2, 2.48],
    secondWarnAt: 3.08,
    moveNear: [3.25, 3.76],
    secondCheck: [4.3, 4.58],
    resetAt: 5.3,
    innerRadius: 140,
    outerRadius: 420,
    maxDamage: 90,
    minDamage: 10,
    encounterId: 'kern-proximity-1',
    firstHitId: 'distance-pulse-1',
    secondHitId: 'distance-pulse-2',
  },
  'tank-swap': {
    mode: 'tank-swap',
    boss: [280, 265],
    player: [195, 610],
    target: [195, 610],
    ally: [375, 655],
    playerExit: [150, 690],
    allyClaim: [350, 585],
    firstWarnAt: 0.7,
    firstHit: [2.2, 2.48],
    swapWarnAt: 2.85,
    swapMove: [3.08, 3.5],
    claimAt: 3.36,
    secondWarnAt: 3.85,
    secondHit: [4.55, 4.83],
    resetAt: 5.3,
    baseDamage: 35,
    repeatedDamage: 95,
    encounterId: 'kern-tank-swap-1',
    firstHitId: 'buster-1',
    secondHitId: 'buster-2',
  },
  'debuff-handoff': {
    mode: 'debuff-handoff',
    boss: [280, 265],
    player: [165, 635],
    target: [165, 635],
    ally: [395, 635],
    playerContact: [250, 635],
    allyContact: [310, 635],
    firstApproach: [1.65, 2.25],
    firstPassAt: 2.25,
    firstRetreat: [2.4, 3.05],
    secondApproach: [3.9, 4.48],
    secondPassAt: 4.48,
    secondRetreat: [4.58, 5.2],
    resetAt: 5.5,
    contactRadius: 76,
    debuffDuration: 3,
    returnImmunity: 1,
    burstDamage: 80,
    encounterId: 'kern-debuff-handoff-1',
  },
  'ordered-targets': {
    mode: 'ordered-targets',
    boss: [280, 265],
    player: [165, 625],
    target: [165, 625],
    allies: [
      [280, 625],
      [395, 625],
    ],
    receivingSpots: [
      [140, 625],
      [280, 700],
      [420, 625],
    ],
    assignments: [1, 2, 3],
    revealAt: 0.7,
    move: [1.2, 1.8],
    hits: [2, 3.2, 4.4],
    hitDuration: 0.22,
    radius: 72,
    intendedDamage: 25,
    overlapDamage: 80,
    resetAt: 5.5,
    encounterId: 'kern-ordered-targets-1',
  },
  'pairing-polarity': {
    mode: 'pairing-polarity',
    boss: [280, 265],
    player: [150, 620],
    target: [150, 620],
    allies: [
      [235, 620],
      [325, 620],
      [410, 620],
    ],
    receivingSpots: [
      [162, 680],
      [344, 680],
      [218, 680],
      [396, 680],
    ],
    zones: [
      [190, 680],
      [370, 680],
    ],
    polarities: ['+', '+', '−', '−'],
    revealAt: 0.7,
    move: [1.25, 2.15],
    resolveAt: 3.15,
    hitDuration: 0.25,
    radius: 74,
    failedDamage: 70,
    resetAt: 5.5,
    encounterId: 'kern-pairing-polarity-1',
  },
  'party-split': {
    mode: 'party-split',
    boss: [280, 265],
    player: [145, 615],
    target: [145, 615],
    allies: [
      [215, 615],
      [345, 615],
      [415, 615],
    ],
    workSpots: [
      [130, 705],
      [205, 705],
      [355, 705],
      [430, 705],
    ],
    reunionSpots: [
      [210, 845],
      [260, 845],
      [310, 845],
      [360, 845],
    ],
    dividerX: 280,
    revealAt: 0.65,
    move: [0.95, 1.7],
    taskCompleteAt: [2.6, 3.25],
    gateOpenAt: 3.45,
    deadline: 3.6,
    reunite: [3.75, 4.85],
    resetAt: 5.5,
    encounterId: 'kern-party-split-1',
  },
  'wide-swing': { mode: 'arc', boss: [225, 340], player: [380, 500], target: [420, 780] },
  lunge: {
    mode: 'lunge',
    boss: [145, 210],
    player: [350, 620],
    target: [440, 820],
    lungeEnd: [385, 690],
  },
  grab: {
    mode: 'grab',
    boss: [280, 370],
    player: [390, 555],
    target: [470, 680],
    grabPoint: [390, 555],
  },
  'burrow-and-emerge': {
    mode: 'burrow',
    boss: [190, 300],
    player: [380, 590],
    target: [455, 700],
  },
  'ring-volley': { mode: 'ring', boss: [280, 400], player: [280, 690], target: [440, 690] },
  'spiral-barrage': {
    mode: 'spiral',
    boss: [280, 390],
    player: [410, 650],
    target: [510, 720],
  },
  'ricochet-projectile': {
    mode: 'ricochet',
    boss: [160, 250],
    player: [400, 650],
    target: [265, 760],
  },
  'homing-projectile': {
    mode: 'homing',
    boss: [180, 260],
    player: [400, 650],
    target: [205, 730],
  },
  'straight-beam': { mode: 'beam', boss: [280, 210], player: [280, 690], target: [450, 690] },
  'scanning-beam': {
    mode: 'scanning',
    boss: [280, 250],
    player: [415, 670],
    target: [455, 355],
  },
  'rotating-beams': {
    mode: 'rotating',
    boss: [280, 430],
    player: [430, 650],
    target: [390, 730],
    safeOrbitRadius: 210,
  },
  'marked-area-strike': {
    mode: 'marked',
    boss: [190, 260],
    player: [380, 620],
    target: [470, 735],
    mark: [380, 620],
    radius: 58,
    impact: [2.85, 3.25],
  },
  shockwave: {
    mode: 'shockwave',
    boss: [280, 300],
    player: [280, 690],
    target: [280, 840],
  },
  'lingering-hazard': {
    mode: 'lingering',
    boss: [185, 270],
    player: [360, 620],
    target: [465, 730],
  },
  'hazard-trail': {
    mode: 'trail',
    boss: [175, 260],
    player: [360, 650],
    target: [450, 760],
  },
  'platform-destruction': {
    mode: 'platforms',
    boss: [280, 200],
    player: [145, 690],
    target: [410, 690],
  },
  'shrinking-safe-area': {
    mode: 'shrink',
    boss: [280, 445],
    player: [430, 650],
    target: [325, 555],
  },
  knockback: {
    mode: 'knockback',
    boss: [215, 350],
    player: [330, 510],
    target: [430, 680],
    hitAt: 2.18,
  },
  'target-lock': {
    mode: 'target-lock',
    boss: [180, 250],
    player: [315, 570],
    lockPoint: [390, 620],
    target: [465, 735],
    radius: 45,
    impact: [2.95, 3.34],
  },
  'attack-combination': {
    mode: 'combo',
    boss: [280, 310],
    player: [400, 530],
    target: [455, 720],
  },
  'weak-point': {
    mode: 'weak-point',
    boss: [280, 350],
    player: [440, 570],
    target: [390, 425],
  },
  telegraph: {
    mode: 'telegraph',
    boss: [190, 270],
    player: [390, 630],
    target: [505, 770],
    cone: [
      [233, 278],
      [485, 690],
      [410, 735],
    ],
  },
  'fight-phase': {
    mode: 'phase',
    boss: [280, 350],
    player: [400, 650],
    target: [365, 750],
  },
  enrage: { mode: 'enrage', boss: [280, 350], player: [400, 650], target: [455, 735] },
};

export const BLUEPRINT_MECHANIC_IDS = Object.freeze(Object.keys(SPECS));

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
const PULSE_BEAM_WINDOWS = Object.freeze([
  [0.08, 0.24],
  [0.48, 0.64],
  [0.78, 0.92],
]);
const pulseBeamIndex = (action) =>
  PULSE_BEAM_WINDOWS.findIndex(([start, end]) => action >= start && action <= end);
const CHAIN_EXPLOSION_WINDOWS = Object.freeze([
  [0.04, 0.18],
  [0.22, 0.36],
  [0.4, 0.54],
  [0.58, 0.72],
  [0.76, 0.9],
]);
const GENERATOR_RELEASES = Object.freeze([1.86, 2.62, 3.38]);
const GENERATOR_FLIGHT = 0.85;
const generatorShots = (spec, time) =>
  GENERATOR_RELEASES.map((release, index) => {
    const progress = clamp((time - release) / GENERATOR_FLIGHT);
    const start = point(spec.generator);
    const end = point(spec.shotEnds[index]);
    return {
      x: mix(start.x, end.x, progress),
      y: mix(start.y + 32, end.y, progress),
      radius: spec.shotRadius,
      active: time >= release && time <= release + GENERATOR_FLIGHT,
    };
  });
const limitedSpreadShots = (spec, time) =>
  spec.releases.map((release, index) => {
    const angle = Math.PI / 2 + spec.offsets[index];
    const start = point(spec.emitter);
    const progress = clamp((time - release) / spec.flight);
    return {
      ...polar(start, spec.shotLength * progress, angle),
      radius: spec.shotRadius,
      active: time >= release && time < release + spec.flight,
    };
  });
const strikePulse = (time, event, width = 0.22) => Math.max(0, 1 - Math.abs(time - event) / width);
const chainExplosionIndex = (action) =>
  CHAIN_EXPLOSION_WINDOWS.findIndex(([start, end]) => action >= start && action <= end);
const localTime = (time) => {
  const remainder = (Number.isFinite(time) ? time : 0) % BLUEPRINT_DURATION;
  return remainder < 0 ? remainder + BLUEPRINT_DURATION : remainder;
};
const point = ([x, y]) => ({ x, y });
const polar = (center, radius, angle) => ({
  x: center.x + Math.cos(angle) * radius,
  y: center.y + Math.sin(angle) * radius,
});
const distanceToSegment = (pointValue, start, end) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  const amount = lengthSquared
    ? clamp(((pointValue.x - start.x) * dx + (pointValue.y - start.y) * dy) / lengthSquared)
    : 0;
  return Math.hypot(
    pointValue.x - mix(start.x, end.x, amount),
    pointValue.y - mix(start.y, end.y, amount),
  );
};
const motion = (values = {}) => ({
  gait: 0,
  stride: 0,
  lean: 0,
  crouch: 0,
  lift: 0,
  attack: 0,
  impact: 0,
  dodge: 0,
  ...values,
});
const circle = (x, y, radius, opacity = 1, tone = 'signal', width = 4, fill = 0, dash = '') => ({
  type: 'circle',
  x,
  y,
  radius,
  opacity,
  tone,
  width,
  fill,
  dash,
});
const line = (x1, y1, x2, y2, opacity = 1, tone = 'signal', width = 5, dash = '') => ({
  type: 'line',
  x1,
  y1,
  x2,
  y2,
  opacity,
  tone,
  width,
  dash,
});
const rect = (x, y, width, height, opacity = 1, tone = 'signal', fill = 0.15) => ({
  type: 'rect',
  x,
  y,
  rectWidth: width,
  rectHeight: height,
  opacity,
  tone,
  width: 3,
  fill,
});
const path = (data, opacity = 1, tone = 'signal', width = 5, fill = 0, dash = '') => ({
  type: 'path',
  data,
  opacity,
  tone,
  width,
  fill,
  dash,
});
const arcPath = (center, radius, from, to) => {
  const start = polar(center, radius, from);
  const end = polar(center, radius, to);
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${Math.abs(to - from) > Math.PI ? 1 : 0} 1 ${end.x} ${end.y}`;
};
const annularSectorPath = (center, innerRadius, outerRadius, from, to) => {
  const outsideStart = polar(center, outerRadius, from);
  const outsideEnd = polar(center, outerRadius, to);
  const insideEnd = polar(center, innerRadius, to);
  const insideStart = polar(center, innerRadius, from);
  const largeArc = to - from > Math.PI ? 1 : 0;
  return `M ${outsideStart.x} ${outsideStart.y} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outsideEnd.x} ${outsideEnd.y} L ${insideEnd.x} ${insideEnd.y} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${insideStart.x} ${insideStart.y} Z`;
};
const lungeScuffPath = (origin, end, halfWidth = 27) => {
  const dx = end.x - origin.x;
  const dy = end.y - origin.y;
  const length = Math.hypot(dx, dy) || 1;
  const side = { x: (-dy / length) * halfWidth, y: (dx / length) * halfWidth };
  const at = (amount, width) =>
    `${(origin.x + dx * amount + side.x * width).toFixed(1)} ${(origin.y + dy * amount + side.y * width).toFixed(1)}`;
  return `M ${at(0, 0.65)} L ${at(0.2, 0.95)} L ${at(0.37, 0.78)} L ${at(0.55, 1)} L ${at(0.78, 0.86)} L ${at(1, 0.6)} L ${at(1, -0.6)} L ${at(0.78, -0.86)} L ${at(0.55, -1)} L ${at(0.37, -0.78)} L ${at(0.2, -0.95)} L ${at(0, -0.65)} Z`;
};
const lungeGougesPath = (origin, end) => {
  const dx = end.x - origin.x;
  const dy = end.y - origin.y;
  const length = Math.hypot(dx, dy) || 1;
  const normal = { x: (-dy / length) * 27, y: (dx / length) * 27 };
  const at = (amount, across) =>
    `${(origin.x + dx * amount + normal.x * across).toFixed(1)} ${(origin.y + dy * amount + normal.y * across).toFixed(1)}`;
  return [0.13, 0.34, 0.57, 0.81]
    .flatMap((amount) => [
      `M ${at(amount - 0.025, -0.82)} L ${at(amount + 0.038, -0.73)} L ${at(amount + 0.055, -0.48)} L ${at(amount - 0.035, -0.51)} Z`,
      `M ${at(amount - 0.034, 0.52)} L ${at(amount + 0.052, 0.45)} L ${at(amount + 0.031, 0.78)} L ${at(amount - 0.016, 0.87)} Z`,
    ])
    .join(' ');
};
const spiralShots = (center, time) =>
  Array.from({ length: 12 }, (_, releaseIndex) => {
    const age = time - (BLUEPRINT_PHASE_ENDS[0] + releaseIndex * 0.22);
    const radius = 24 + age * 320;
    return Array.from({ length: 3 }, (_, arm) => {
      const angle = -0.9 + releaseIndex * 0.58 + (arm * Math.PI * 2) / 3;
      const position = polar(center, radius, angle);
      return { ...position, angle, active: age >= 0 && radius < 650 };
    });
  }).flat();

const distanceToPolyline = (value, points) =>
  Math.min(...points.slice(1).map((end, index) => distanceToSegment(value, points[index], end)));

const angleDifference = (from, to) => Math.atan2(Math.sin(from - to), Math.cos(from - to));

export function directionalShieldOutcome(time, attacker) {
  const spec = SPECS['directional-shield'];
  const t = localTime(time);
  const boss = point(spec.boss);
  const distance = Math.hypot(attacker.x - boss.x, attacker.y - boss.y);
  if (distance > spec.attackReach) return 'out-of-range';
  const incomingAngle = Math.atan2(attacker.y - boss.y, attacker.x - boss.x);
  const guarded =
    t >= BLUEPRINT_PHASE_ENDS[0] &&
    t < spec.guardEnd &&
    Math.abs(angleDifference(incomingAngle, spec.guardAngle)) <= spec.guardHalfAngle;
  return guarded ? 'blocked' : 'hit';
}

export function damageTypeResistanceDamage(type, baseDamage = 100) {
  if (type !== 'slash' && type !== 'thrust') throw new Error(`Unknown damage type: ${type}`);
  return baseDamage * (type === 'slash' ? SPECS['damage-type-resistance'].slashMultiplier : 1);
}

export function situationalImmunityOutcome(time, target = 'boss') {
  const spec = SPECS['situational-immunity'];
  const t = localTime(time);
  if (target === 'ward') return t < spec.wardStrike ? 'breakable' : 'broken';
  if (target !== 'boss') throw new Error(`Unknown immunity target: ${target}`);
  return t < spec.wardStrike || t >= spec.shieldReturns ? 'immune' : 'vulnerable';
}

export function partBreakState(time) {
  const spec = SPECS['part-break'];
  const t = localTime(time);
  if (t < spec.breakAt || t >= spec.repairEnd) return 'attached';
  return t >= spec.repairStart ? 'repairing' : 'broken';
}

export function partBreakCanFire(time) {
  return partBreakState(time) === 'attached';
}

export function attackReflectionState(time) {
  const spec = SPECS['attack-reflection'];
  const t = localTime(time);
  if (t >= spec.reflected[0] && t < spec.reflected[1]) return 'reflected';
  if (t >= spec.mirrorLowered && t < spec.mirrorRaised) return 'open';
  if (t >= spec.mirrorRaised && t < spec.mirrorRaised + 0.35) return 'raising';
  return 'guarded';
}

export function counterStanceState(time) {
  const spec = SPECS['counter-stance'];
  const t = localTime(time);
  if (t >= spec.riposte[0] && t < spec.riposte[1]) return 'riposte';
  if (t >= spec.parriedStrike && t < spec.riposte[0]) return 'triggered';
  if (t >= spec.firstGuard[0] && t < spec.parriedStrike) return 'guarded';
  if (t >= spec.secondGuard[0] && t < spec.secondGuard[1]) return 'guarded-withheld';
  if (t >= spec.secondGuard[1] && t < spec.openStrike + 0.36) return 'open';
  return 'idle';
}

export function counterStanceOutcome(time, incomingAttack = false) {
  const spec = SPECS['counter-stance'];
  const t = localTime(time);
  if (!incomingAttack) return 'no-trigger';
  const guarded =
    (t >= spec.firstGuard[0] && t < spec.firstGuard[1]) ||
    (t >= spec.secondGuard[0] && t < spec.secondGuard[1]);
  return guarded ? 'parried-counter' : 'hit';
}

export function absorptionCharge(time) {
  const spec = SPECS['absorption-power-up'];
  const t = localTime(time);
  if (t >= spec.shockwave[0]) return 0;
  if (t >= spec.secondPulse[1]) return 2;
  if (t >= spec.firstPulse[1]) return 1;
  return 0;
}

export function absorptionOutcome(time, attackType = 'sword-pulse') {
  const spec = SPECS['absorption-power-up'];
  const t = localTime(time);
  if (attackType !== 'sword-pulse') return 'ordinary';
  if (t < 0.6 || t >= spec.chargeWindup) return 'ordinary';
  return absorptionCharge(t) < 2 ? 'absorbed' : 'at-cap';
}

export function interruptibleWindUpState(time) {
  const spec = SPECS['interruptible-wind-up'];
  const t = localTime(time);
  if (t >= spec.release[0] && t < spec.release[1]) return 'released';
  if (t >= spec.secondWindup[0] && t < spec.release[0]) return 'wind-up-open';
  if (t >= spec.interruptAt && t < spec.staggerEnd) return 'interrupted-open';
  if (t >= spec.firstWindup[0] && t < spec.interruptAt) return 'wind-up-open';
  if (t >= spec.release[1] && t < spec.recoveryEnd) return 'recovery';
  return 'idle';
}

export function interruptibleWindUpOutcome(time, impact = 1) {
  const spec = SPECS['interruptible-wind-up'];
  const t = localTime(time);
  const open =
    (t >= spec.firstWindup[0] && t < spec.firstWindup[1]) ||
    (t >= spec.secondWindup[0] && t < spec.secondWindup[1]);
  if (!open) return 'closed';
  return impact >= 1 ? 'interrupted' : 'insufficient-impact';
}

export function loadoutAdaptationPackage(loadout) {
  if (loadout === 'reach-rune') return 'reach-thrust';
  if (loadout === 'burst-rune') return 'burst-ring';
  return 'baseline';
}

export function loadoutAdaptationState(time) {
  const spec = SPECS['loadout-adaptation'];
  const t = localTime(time);
  if (t >= spec.reachSnapshot[0] && t < spec.reachCopiedAt) return 'reading-reach';
  if (t >= spec.reachCopiedAt && t < spec.reachAttack[0]) return 'copied-reach';
  if (t >= spec.reachAttack[0] && t < spec.reachAttack[1]) return 'reach-danger';
  if (t >= spec.reachAttack[1] && t < spec.swapAt) return 'reach-recovery';
  if (t >= spec.swapAt && t < spec.burstSnapshot[0]) return 'loadout-swapped';
  if (t >= spec.burstSnapshot[0] && t < spec.burstCopiedAt) return 'reading-burst';
  if (t >= spec.burstCopiedAt && t < spec.burstAttack[0]) return 'copied-burst';
  if (t >= spec.burstAttack[0] && t < spec.burstAttack[1]) return 'burst-danger';
  if (t >= spec.burstAttack[1] && t < spec.recoveryEnd) return 'burst-recovery';
  return 'idle';
}

export function windUpProgress(time) {
  const spec = SPECS['wind-up'];
  const t = localTime(time);
  if (t >= spec.firstWindup[0] && t < spec.firstRelease[0])
    return clamp((t - spec.firstWindup[0]) / (spec.firstRelease[0] - spec.firstWindup[0]));
  if (t >= spec.secondWindup[0] && t < spec.secondRelease[0])
    return clamp((t - spec.secondWindup[0]) / (spec.heldFrom - spec.secondWindup[0]));
  return 0;
}

export function windUpState(time) {
  const spec = SPECS['wind-up'];
  const t = localTime(time);
  if (t >= spec.firstWindup[0] && t < spec.firstRelease[0]) return 'short-wind-up';
  if (t >= spec.firstRelease[0] && t < spec.firstRelease[1]) return 'short-release';
  if (t >= spec.firstRelease[1] && t < spec.firstRecoveryEnd) return 'short-recovery';
  if (t >= spec.secondWindup[0] && t < spec.heldFrom) return 'held-wind-up';
  if (t >= spec.heldFrom && t < spec.secondRelease[0]) return 'held-ready';
  if (t >= spec.secondRelease[0] && t < spec.secondRelease[1]) return 'held-release';
  if (t >= spec.secondRelease[1] && t < spec.recoveryEnd) return 'held-recovery';
  return 'idle';
}

export function attackLockState(time) {
  const spec = SPECS['attack-lock'];
  const t = localTime(time);
  if (t >= spec.firstTrack[0] && t < spec.firstLock) return 'tracking-first';
  if (t >= spec.firstLock && t < spec.firstRelease[0]) return 'locked-first';
  if (t >= spec.firstRelease[0] && t < spec.firstRelease[1]) return 'released-first';
  if (t >= spec.firstRelease[1] && t < spec.firstRecoveryEnd) return 'recovery-first';
  if (t >= spec.secondTrack[0] && t < spec.secondLock) return 'tracking-second';
  if (t >= spec.secondLock && t < spec.secondRelease[0]) return 'locked-second';
  if (t >= spec.secondRelease[0] && t < spec.secondRelease[1]) return 'released-second';
  if (t >= spec.secondRelease[1] && t < spec.recoveryEnd) return 'recovery-second';
  return 'idle';
}

export function activePhaseState(time) {
  const spec = SPECS['active-phase'];
  const t = localTime(time);
  if (t >= spec.startup[0] && t < spec.active[0]) return 'startup';
  if (t >= spec.active[0] && t < spec.active[1]) return 'active';
  if (t >= spec.active[1] && t < spec.followThroughEnd) return 'follow-through';
  if (t >= spec.followThroughEnd && t < spec.recoveryEnd) return 'recovery';
  if (t >= spec.recoveryEnd) return 'reset';
  return 'idle';
}

export function recoveryState(time) {
  const spec = SPECS.recovery;
  const t = localTime(time);
  if (t >= spec.startup[0] && t < spec.active[0]) return 'startup';
  if (t >= spec.active[0] && t < spec.active[1]) return 'active';
  if (t >= spec.recovery[0] && t < spec.punishAt) return 'approach-window';
  if (t >= spec.punishAt && t < spec.recovery[1]) return 'punish-window';
  if (t >= spec.recovery[1] && t < spec.resetAt) return 'boss-ready';
  if (t >= spec.resetAt) return 'reset';
  return 'idle';
}

export function survivalPhaseState(time) {
  const spec = SPECS['survival-phase'];
  const t = localTime(time);
  if (t < spec.survival[0]) return 'idle';
  const activeIndex = spec.hazards.findIndex(({ active }) => t >= active[0] && t < active[1]);
  if (activeIndex >= 0) return `survive-${activeIndex + 1}`;
  if (t < spec.shieldDropsAt) return 'read-next';
  if (t < spec.punishAt) return 'survived';
  if (t < spec.resetAt) return 'opening';
  return 'reset';
}

export function teleportState(time) {
  const spec = SPECS.teleport;
  const t = localTime(time);
  if (t < spec.departure[0]) return 'idle';
  if (t < spec.absent[0]) return 'departing';
  if (t < spec.arrival[0]) return 'absent';
  if (t < spec.arrival[1]) return 'arriving';
  if (t < spec.active[0]) return 'follow-up-tell';
  if (t < spec.active[1]) return 'follow-up-danger';
  if (t < spec.recoveryEnd) return 'opening';
  return 'reset';
}

export function boundaryAttackState(time) {
  const spec = SPECS['boundary-attack'];
  const t = localTime(time);
  if (t < spec.signal[0]) return 'idle';
  if (t < spec.active[0]) return 'edge-signal';
  if (t < spec.active[1]) return 'boundary-crossing';
  if (t < spec.punishAt) return 'boundary-stagger';
  if (t < spec.openingEnd) return 'opening';
  return 'outer-reset';
}

export function forcedScrollingState(time) {
  const spec = SPECS['forced-scrolling'];
  const t = localTime(time);
  if (t < spec.signal[0]) return 'idle';
  if (t < spec.active[0]) return 'scroll-signal';
  if (t < spec.active[1]) return 'forced-scroll';
  if (t < spec.bossAdvanceEnd) return 'route-cleared';
  if (t < spec.resetAt) return 'opening';
  return 'reset';
}

export function forcedScrollingOffset(time) {
  const spec = SPECS['forced-scrolling'];
  const t = localTime(time);
  if (t < spec.active[0]) return 0;
  if (t < spec.active[1])
    return spec.scrollDistance * smooth((t - spec.active[0]) / (spec.active[1] - spec.active[0]));
  if (t < spec.resetAt) return spec.scrollDistance;
  return (
    spec.scrollDistance * (1 - smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt)))
  );
}

export function chaseHerdingState(time) {
  const spec = SPECS['chase-herding'];
  const t = localTime(time);
  if (t < spec.signal[0]) return 'idle';
  if (t < spec.active[0]) return 'route-signal';
  if (t < 2.55) return 'maintain-distance';
  if (t < spec.active[1]) return 'intercept';
  if (t < spec.captureEnd) return 'captured';
  if (t < spec.resetAt) return 'opening';
  return 'reset';
}

export function escapePhaseState(time) {
  const spec = SPECS['escape-phase'];
  const t = localTime(time);
  if (t < spec.triggerAt) return 'combat';
  if (t < spec.escape[0]) return 'exit-signal';
  if (t < spec.escape[1]) return 'escape-run';
  if (t < spec.staggerEnd) return 'interrupted';
  if (t < spec.resetAt) return 'opening';
  return 'reset';
}

export function relocatedArenaState(time) {
  const spec = SPECS['relocated-arena'];
  const t = localTime(time);
  if (t < spec.previewAt) return 'upper-combat';
  if (t < spec.transfer[0]) return 'destination-preview';
  if (t < spec.transfer[1]) return 'transfer';
  if (t < 3.2) return 'lower-entry';
  if (t < spec.resetAt) return 'lower-combat';
  return 'return-lift';
}

export function controlModeShiftState(time) {
  const spec = SPECS['control-mode-shift'];
  const t = localTime(time);
  if (t < spec.previewAt) return 'free-movement';
  if (t < spec.handoff[0]) return 'mode-preview';
  if (t < spec.handoff[1]) return 'control-handoff';
  if (t < 3.45) return 'jump-mode';
  if (t < spec.resetAt) return 'opening';
  return 'free-mode-return';
}

export function bossAsTerrainState(time) {
  const spec = SPECS['boss-as-terrain'];
  const t = localTime(time);
  if (t < spec.revealAt) return 'grounded';
  if (t < spec.mountAt) return 'route-revealed';
  if (t < spec.shake[0]) return 'climbing';
  if (t < spec.shake[1]) return 'hold-through-shake';
  if (t < spec.drop[0]) return 'weak-point-opening';
  if (t < spec.resetAt) return 'safe-drop';
  return 'reset';
}

export function coverLineOfSightState(time) {
  const spec = SPECS['cover-line-of-sight'];
  const t = localTime(time);
  if (t < spec.lockAt) return 'open-arena';
  if (t < spec.shadowAt) return 'source-locked';
  if (t < spec.coveredAt) return 'moving-to-cover';
  if (t < spec.beam[0]) return 'fully-covered';
  if (t < spec.beam[1]) return 'beam-blocked';
  if (t < spec.punishAt) return 'safe-exit';
  if (t < spec.resetAt) return 'counter-window';
  return 'reset';
}

export function forcedInertiaState(time) {
  const spec = SPECS['forced-inertia'];
  const t = localTime(time);
  if (t < spec.frostAt) return 'stable-footing';
  if (t < spec.vectorAt) return 'surface-freezing';
  if (t < spec.commitAt) return 'endpoint-preview';
  if (t < spec.slide[0]) return 'direction-committed';
  if (t < spec.slide[1]) return 'unsteerable-slide';
  if (t < spec.brake[1]) return 'braking-zone';
  if (t < spec.punishAt) return 'control-restored';
  if (t < spec.resetAt) return 'counter-window';
  return 'reset';
}

export function wraparoundProjectileState(time) {
  const spec = SPECS['wraparound-projectile'];
  const t = localTime(time);
  if (t < spec.signalAt) return 'unlinked-boundaries';
  if (t < spec.previewAt) return 'boundary-link-signal';
  if (t < spec.releaseAt) return 'route-preview';
  if (t < spec.firstPass[1]) return 'first-pass';
  if (t < spec.crossing[1]) return 'boundary-crossing';
  if (t < spec.secondPass[1]) return 'repeat-pass';
  if (t < spec.punishAt) return 'corridor-clear';
  if (t < spec.resetAt) return 'counter-window';
  return 'reset';
}

export function beatSyncedAttackState(time) {
  const spec = SPECS['beat-synced-attack'];
  const t = localTime(time);
  if (t < spec.beatOrigin) return 'silent-count';
  if (t < spec.beatOrigin + spec.beatInterval) return 'tempo-count-in';
  if (t < spec.hits[0]) return 'pattern-cued';
  if (t < spec.phraseClearsAt) return 'beat-strikes';
  if (t < spec.punishAt) return 'phrase-clear';
  if (t < spec.resetAt) return 'counter-window';
  return 'reset';
}

export function secondaryCuesInvisibilityState(time) {
  const spec = SPECS['secondary-cues-invisibility'];
  const t = localTime(time);
  if (t < spec.vanishAt) return 'visible-presence';
  if (t < spec.hiddenAt) return 'fading-body';
  if (t < spec.lockAt) return 'tracking-secondary-cues';
  if (t < spec.attack[0]) return 'hidden-source-locked';
  if (t < spec.attack[1]) return 'hidden-strike';
  if (t < spec.revealAt) return 'reveal-signal';
  if (t < spec.punishAt) return 'revealed-opening';
  if (t < spec.resetAt) return 'counter-window';
  return 'reset';
}

export function soundDetectionState(time) {
  const spec = SPECS['sound-detection'];
  const t = localTime(time);
  if (t < spec.quietAt) return 'unaware-patrol';
  if (t < spec.noiseAt) return 'quiet-movement';
  if (t < spec.heardAt) return 'noise-emitted';
  if (t < spec.investigate[0]) return 'sound-registered';
  if (t < spec.lockAt) return 'investigating-last-heard';
  if (t < spec.attack[0]) return 'stale-source-locked';
  if (t < spec.attack[1]) return 'source-attack';
  if (t < spec.searchEndsAt) return 'search-cooldown';
  if (t < spec.punishAt) return 'counter-approach';
  if (t < spec.resetAt) return 'counter-window';
  return 'reset';
}

export function objectiveLinkedInvulnerabilityState(time) {
  const spec = SPECS['objective-linked-invulnerability'];
  const t = localTime(time);
  if (t < 0.42) return 'protected-objectives';
  if (t < 0.82) return 'blocked-check';
  if (t < spec.objectiveHits[0]) return 'approach-first-objective';
  if (t < spec.objectiveHits[1]) return 'first-objective-cleared';
  if (t < spec.objectiveHits[2]) return 'second-objective-cleared';
  if (t < spec.gateDropsAt) return 'all-objectives-cleared';
  if (t < spec.vulnerable[0]) return 'protection-releasing';
  if (t < spec.bossStrike) return 'vulnerability-window';
  if (t < spec.vulnerable[1]) return 'boss-hit';
  if (t < spec.shieldReturns) return 'window-closing';
  if (t < spec.resetAt) return 'protection-restored';
  return 'reset';
}

export function objectiveLinkedInvulnerabilityOutcome(time, target = 'boss') {
  const spec = SPECS['objective-linked-invulnerability'];
  const t = localTime(time);
  if (target === 'boss')
    return t >= spec.vulnerable[0] && t < spec.vulnerable[1] ? 'vulnerable' : 'immune';
  const match = /^objective-(\d)$/.exec(target);
  if (!match) throw new Error(`Unknown objective target: ${target}`);
  const index = Number(match[1]) - 1;
  if (index < 0 || index >= spec.objectiveHits.length)
    throw new Error(`Unknown objective target: ${target}`);
  return t >= spec.objectiveHits[index] && t < spec.resetAt ? 'complete' : 'active';
}

export function waveClearObjectiveState(time) {
  const spec = SPECS['wave-clear-objective'];
  const t = localTime(time);
  if (t < 0.42) return 'briefing';
  if (t < spec.waveSpawns[0]) return 'wave-1-preview';
  if (t < spec.waveClears[0]) return 'wave-1-active';
  if (t < spec.waveSpawns[1]) return 'wave-1-cleared';
  if (t < spec.waveClears[1]) return 'wave-2-active';
  if (t < spec.waveSpawns[2]) return 'wave-2-cleared';
  if (t < spec.waveClears[2]) return 'wave-3-active';
  if (t < spec.resolveAt) return 'all-waves-cleared';
  if (t < spec.rewardAt) return 'encounter-resolving';
  if (t < spec.resetAt) return 'reward-open';
  return 'reset';
}

export function waveClearObjectiveProgress(time) {
  const spec = SPECS['wave-clear-objective'];
  const t = localTime(time);
  if (t >= spec.resetAt)
    return Object.freeze({
      wave: 0,
      completedWaves: 0,
      remainingEnemies: 0,
      spawnQueueSealed: false,
      rosterEmpty: true,
      allComplete: false,
    });
  let wave = spec.waveSpawns.findIndex((spawn, index) => t >= spawn && t < spec.waveClears[index]);
  if (wave < 0) {
    const next = spec.waveSpawns.findIndex((spawn) => t < spawn);
    wave = next < 0 ? spec.waveSpawns.length : next;
  }
  const completedWaves = spec.waveClears.filter((clear) => t >= clear).length;
  const activeWave = Math.min(wave, spec.waveKills.length - 1);
  const spawnQueueSealed =
    wave < spec.waveSpawns.length && t >= spec.waveSpawns[wave] && t < spec.waveClears[wave];
  const remainingEnemies = spawnQueueSealed
    ? spec.waveKills[wave].filter((kill) => t < kill).length
    : 0;
  return Object.freeze({
    wave: completedWaves === spec.waveClears.length ? spec.waveClears.length : activeWave + 1,
    completedWaves,
    remainingEnemies,
    spawnQueueSealed,
    rosterEmpty: remainingEnemies === 0,
    allComplete: completedWaves === spec.waveClears.length,
  });
}

export function environmentalWeaponState(time) {
  const spec = SPECS['environmental-weapon'];
  const t = localTime(time);
  if (t < spec.routeStartsAt) return 'device-briefing';
  if (t < spec.powerReachedAt) return 'reach-power-node';
  if (t < spec.powerOnAt) return 'prepare-power-node';
  if (t < spec.deviceReachedAt) return 'reach-device';
  if (t < spec.aimPreviewAt) return 'device-ready';
  if (t < spec.aimLockedAt) return 'aim-preview';
  if (t < spec.fireAt) return 'aim-locked';
  if (t < spec.hitAt) return 'device-fired';
  if (t < spec.spentAt) return 'device-hit';
  if (t < spec.rewardAt) return 'damage-window';
  if (t < spec.resetAt) return 'device-spent';
  return 'reset';
}

export function encounterSpecificToolState(time) {
  const spec = SPECS['encounter-specific-tool'];
  const t = localTime(time);
  if (t < spec.routeStartsAt) return 'tool-briefing';
  if (t < spec.toolReachedAt) return 'reach-tool';
  if (t < spec.toolEquippedAt) return 'pickup';
  if (t < spec.carryStartsAt) return 'tool-equipped';
  if (t < spec.combatReachedAt) return 'carry-tool';
  if (t < spec.readyAt) return 'charge-tool';
  if (t < spec.fireAt) return 'tool-ready';
  if (t < spec.hitAt) return 'tool-fired';
  if (t < spec.recoveryAt) return 'tool-hit';
  if (t < spec.toolExpiresAt) return 'recovery';
  if (t < spec.resetAt) return 'tool-expired';
  return 'reset';
}

export function playerControlledBossState(time) {
  const spec = SPECS['player-controlled-boss'];
  const t = localTime(time);
  if (t < spec.candidateAt) return 'matching';
  if (t < spec.assignedAt) return 'candidate-found';
  if (t < spec.controllerActiveAt) return 'assigning-controller';
  if (t < spec.actionQueuedAt) return 'human-controlled';
  if (t < spec.telegraph[0]) return 'action-queued';
  if (t < spec.telegraph[1]) return 'attack-telegraph';
  if (t < spec.active[1]) return 'attack-active';
  if (t < spec.recoveryEndsAt) return 'human-recovery';
  if (t < spec.heartbeatLostAt) return 'human-controlled';
  if (t < spec.aiTakeoverAt) return 'connection-lost';
  if (t < spec.aiContinueAt) return 'ai-takeover';
  if (t < spec.resetAt) return 'ai-controlled';
  return 'reset';
}

export function projectileRallyState(time) {
  const spec = SPECS['projectile-rally'];
  const t = localTime(time);
  if (t < 0.45) return 'briefing';
  if (t < spec.serveAt) return 'serve-wind-up';
  if (t < 1.48) return 'boss-serve';
  if (t < 2.05) return 'player-return-1';
  if (t < 2.48) return 'boss-return-1';
  if (t < 2.86) return 'player-return-2';
  if (t < 3.15) return 'boss-return-2';
  if (t < spec.bossMissAt) return 'player-return-3';
  if (t < spec.punishAt) return 'boss-miss';
  if (t < spec.vulnerableUntil) return 'punished-opening';
  if (t < spec.resetAt) return 'recovery';
  return 'reset';
}

export function baitedSelfHitState(time) {
  const spec = SPECS['baited-self-hit'];
  const t = localTime(time);
  if (t < spec.approachAt) return 'available';
  if (t < spec.armedAt) return 'arming';
  if (t < spec.aimAt) return 'armed';
  if (t < spec.lockedAt) return 'target-acquired';
  if (t < spec.charge[0]) return 'target-locked';
  if (t < spec.impactAt) return 'charging';
  if (t < spec.selfHitAt) return 'boss-contact';
  if (t < spec.punishAt) return 'self-hit-stagger';
  if (t < spec.vulnerableUntil) return 'punished-opening';
  if (t < spec.resetAt) return 'recovery';
  return 'reset';
}

export function postureStaggerGaugeState(time) {
  const spec = SPECS['posture-stagger-gauge'];
  const t = localTime(time);
  if (t < spec.contacts[0]) return 'ready';
  if (t < spec.recovery[0]) return 'pressure-started';
  if (t < spec.recovery[1]) return 'recovering-posture';
  if (t < spec.breakAt) return 'sustained-pressure';
  if (t < spec.criticalReadyAt) return 'posture-broken';
  if (t < spec.finisherAt) return 'critical-ready';
  if (t < spec.criticalEndsAt) return 'finisher-consumed';
  if (t < spec.resetAt) return 'boss-recovery';
  return 'reset';
}

const postureValueAt = (spec, time) => {
  if (time < spec.contacts[0]) return 0;
  if (time < spec.recovery[0]) return spec.postureAfterContact[0];
  if (time < spec.recovery[1])
    return mix(
      spec.postureAfterContact[0],
      spec.recoveryFloor,
      smooth((time - spec.recovery[0]) / (spec.recovery[1] - spec.recovery[0])),
    );
  if (time < spec.contacts[1]) return spec.recoveryFloor;
  if (time < spec.contacts[2]) return spec.postureAfterContact[1];
  if (time < spec.contacts[3]) return spec.postureAfterContact[2];
  if (time < spec.finisherAt) return 100;
  if (time < spec.resetAt) return 0;
  return 0;
};

export function pacifistResolutionState(time) {
  const spec = SPECS['pacifist-resolution'];
  const t = localTime(time);
  if (t < spec.sheathAt) return 'combat-ready';
  if (t < spec.restraintStartsAt) return 'weapon-sheathed';
  const attackIndex = spec.attacks.findIndex(({ active }) => t >= active[0] && t < active[1]);
  if (attackIndex >= 0) return `restraint-threat-${attackIndex + 1}`;
  if (t < spec.conditionMetAt) return 'restraint-tracking';
  if (t < spec.choiceOfferedAt) return 'condition-complete';
  if (t < spec.spareAt) return 'choice-offered';
  if (t < spec.resolvedAt) return 'spare-committed';
  if (t < spec.resetAt) return 'spared';
  return 'reset';
}

export function pacifistResolutionOutcome({ conditionComplete, action, resultReserved = false }) {
  if (resultReserved) return 'locked';
  if (!conditionComplete) return action === 'attack' ? 'condition-reset' : 'ineligible';
  if (action === 'spare') return 'spared';
  if (action === 'attack') return 'route-closed';
  return 'choice-open';
}

export function persistentProgressState(time) {
  const spec = SPECS['persistent-progress'];
  const t = localTime(time);
  if (t < spec.approachEnds[0]) return 'attempt-1';
  if (t < spec.commits[0]) return 'anchor-1-broken';
  if (t < spec.hazards[0].active[0]) return 'checkpoint-1';
  if (t < spec.restores[0][0]) return 'defeat-1';
  if (t < spec.restores[0][1]) return 'restore-1';
  if (t < spec.approachEnds[1]) return 'attempt-2';
  if (t < spec.commits[1]) return 'anchor-2-broken';
  if (t < spec.hazards[1].active[0]) return 'checkpoint-2';
  if (t < spec.restores[1][0]) return 'defeat-2';
  if (t < spec.restores[1][1]) return 'restore-2';
  if (t < spec.approachEnds[2]) return 'core-open';
  if (t < spec.commits[2]) return 'core-strike';
  if (t < spec.resetAt) return 'resolved';
  return 'reset';
}

export function persistentProgressRestore({ completedObjectives = 0, snapshotVersion = 1 } = {}) {
  if (snapshotVersion !== 1)
    return Object.freeze({
      status: 'unsupported-version',
      completedObjectives: 0,
      remainingObjectives: 3,
      activeObjective: 'anchor-left',
      bossTransientHealth: 100,
      playerHealth: 100,
    });
  const completed = Math.max(0, Math.min(3, Math.trunc(Number(completedObjectives) || 0)));
  return Object.freeze({
    status: 'restored',
    completedObjectives: completed,
    remainingObjectives: 3 - completed,
    activeObjective: ['anchor-left', 'anchor-right', 'core', 'complete'][completed],
    bossTransientHealth: completed === 3 ? 0 : 100,
    playerHealth: 100,
  });
}

export function statusBuildupState(time) {
  const spec = SPECS['status-buildup'];
  const t = localTime(time);
  if (t < spec.contacts[0]) return 'clear';
  if (t < spec.decay[0]) return 'partial-buildup';
  if (t < spec.decay[1]) return 'decaying';
  if (t < spec.contacts[1]) return 'partially-cleared';
  if (t < spec.contacts[2]) return 'chain-buildup';
  if (t < spec.effectStartsAt) return 'threshold-reached';
  if (t < spec.effectEndsAt) return 'status-active';
  if (t < spec.immunityEndsAt) return 'temporary-immunity';
  if (t < spec.resetAt) return 'clear';
  return 'reset';
}

export function statusBuildupApply({
  current = 0,
  amount = 0,
  threshold = 100,
  immune = false,
} = {}) {
  const safeThreshold = Math.max(1, Number(threshold) || 100);
  const before = clamp((Number(current) || 0) / safeThreshold) * safeThreshold;
  if (immune)
    return Object.freeze({ value: before, triggered: false, effectCount: 0, ignored: true });
  const value = Math.min(safeThreshold, Math.max(0, before + (Number(amount) || 0)));
  const triggered = before < safeThreshold && value >= safeThreshold;
  return Object.freeze({ value, triggered, effectCount: triggered ? 1 : 0, ignored: false });
}

const statusBuildupValueAt = (spec, time) => {
  if (time < spec.contacts[0]) return 0;
  if (time < spec.decay[0]) return spec.buildupAfterContact[0];
  if (time < spec.decay[1])
    return mix(
      spec.buildupAfterContact[0],
      spec.decayFloor,
      smooth((time - spec.decay[0]) / (spec.decay[1] - spec.decay[0])),
    );
  if (time < spec.contacts[1]) return spec.decayFloor;
  if (time < spec.contacts[2]) return spec.buildupAfterContact[1];
  if (time < spec.effectEndsAt) return 100;
  return 0;
};

export function instantKillState(time) {
  const spec = SPECS['instant-kill'];
  const t = localTime(time);
  if (t < spec.firstTelegraph[0]) return 'ready';
  if (t < spec.firstResolveAt) return 'first-telegraph';
  if (t < spec.return[0]) return 'first-avoided';
  if (t < spec.secondTelegraph[0]) return 'repositioning';
  if (t < spec.conditionLockedAt) return 'second-telegraph';
  if (t < spec.executeAt) return 'condition-locked';
  if (t < spec.resultVisibleAt) return 'executing';
  if (t < spec.restore[0]) return 'attempt-ended';
  if (t < spec.restore[1]) return 'restoring';
  if (t < spec.resetAt) return 'ready';
  return 'reset';
}

export function instantKillResolve({
  conditionMet = false,
  targetAlive = true,
  resultReserved = false,
} = {}) {
  if (resultReserved) return Object.freeze({ outcome: 'locked', resultCount: 0, damage: 0 });
  if (!targetAlive) return Object.freeze({ outcome: 'ignored', resultCount: 0, damage: 0 });
  if (!conditionMet) return Object.freeze({ outcome: 'avoided', resultCount: 0, damage: 0 });
  return Object.freeze({ outcome: 'executed', resultCount: 1, damage: 0 });
}

export function maximumHealthReductionState(time) {
  const spec = SPECS['maximum-health-reduction'];
  const t = localTime(time);
  if (t < spec.firstTelegraph[0]) return 'ready';
  if (t < spec.firstResolveAt) return 'first-telegraph';
  if (t < spec.return[0]) return 'first-avoided';
  if (t < spec.secondTelegraph[0]) return 'repositioning';
  if (t < spec.hitAt) return 'second-telegraph';
  if (t < spec.healAttempt[0]) return 'cap-reduced';
  if (t < spec.healAttempt[1]) return 'healing-to-cap';
  if (t < spec.cleanse[0]) return 'healing-blocked';
  if (t < spec.cleanse[1]) return 'cleansing';
  if (t < spec.fullHeal[1]) return 'capacity-restored';
  if (t < spec.resetAt) return 'recovered';
  return 'reset';
}

export function maximumHealthReductionResolve({
  currentHealth = 80,
  maximumHealth = 100,
  damage = 20,
  capLoss = 35,
} = {}) {
  const safeMaximum = Math.max(1, Number(maximumHealth) || 100);
  const safeCurrent = Math.min(safeMaximum, Math.max(0, Number(currentHealth) || 0));
  const maximumAfter = Math.max(1, safeMaximum - Math.max(0, Number(capLoss) || 0));
  const currentAfter = Math.min(
    maximumAfter,
    Math.max(0, safeCurrent - Math.max(0, Number(damage) || 0)),
  );
  return Object.freeze({
    currentBefore: safeCurrent,
    maximumBefore: safeMaximum,
    damage: Math.max(0, Number(damage) || 0),
    capLoss: safeMaximum - maximumAfter,
    currentAfter,
    maximumAfter,
  });
}

const maximumHealthValuesAt = (spec, time) => {
  if (time < spec.hitAt)
    return { current: spec.currentHealthBefore, maximum: spec.maxHealthBefore };
  if (time < spec.capReduction[1]) {
    const progress = smooth(
      (time - spec.capReduction[0]) / (spec.capReduction[1] - spec.capReduction[0]),
    );
    return {
      current: mix(spec.currentHealthBefore, spec.currentHealthAfter, progress),
      maximum: mix(spec.maxHealthBefore, spec.maxHealthAfter, progress),
    };
  }
  if (time < spec.healAttempt[0])
    return { current: spec.currentHealthAfter, maximum: spec.maxHealthAfter };
  if (time < spec.healAttempt[1]) {
    const progress = smooth(
      (time - spec.healAttempt[0]) / (spec.healAttempt[1] - spec.healAttempt[0]),
    );
    return {
      current: mix(spec.currentHealthAfter, spec.maxHealthAfter, progress),
      maximum: spec.maxHealthAfter,
    };
  }
  if (time < spec.cleanse[0]) return { current: spec.maxHealthAfter, maximum: spec.maxHealthAfter };
  if (time < spec.cleanse[1]) {
    const progress = smooth((time - spec.cleanse[0]) / (spec.cleanse[1] - spec.cleanse[0]));
    return {
      current: spec.maxHealthAfter,
      maximum: mix(spec.maxHealthAfter, spec.maxHealthBefore, progress),
    };
  }
  if (time < spec.fullHeal[1]) {
    const progress = smooth((time - spec.fullHeal[0]) / (spec.fullHeal[1] - spec.fullHeal[0]));
    return {
      current: mix(spec.maxHealthAfter, spec.maxHealthBefore, progress),
      maximum: spec.maxHealthBefore,
    };
  }
  if (time < spec.resetAt) return { current: spec.maxHealthBefore, maximum: spec.maxHealthBefore };
  const reset = smooth((time - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
  return {
    current: mix(spec.maxHealthBefore, spec.currentHealthBefore, reset),
    maximum: spec.maxHealthBefore,
  };
};

export function abilityLockState(time) {
  const spec = SPECS['ability-lock'];
  const t = localTime(time);
  if (t < spec.firstTelegraph[0]) return 'ready';
  if (t < spec.firstResolveAt) return 'first-telegraph';
  if (t < spec.firstHeal[0]) return 'first-avoided';
  if (t < spec.firstHeal[1]) return 'healing-allowed';
  if (t < spec.secondTelegraph[0]) return 'repositioning';
  if (t < spec.hitAt) return 'second-telegraph';
  if (t < spec.rejectedHeal[0]) return 'healing-locked';
  if (t < spec.rejectedHeal[1]) return 'healing-rejected';
  if (t < spec.swordProof[1]) return 'other-actions-available';
  if (t < spec.lockEndsAt) return 'lock-countdown';
  if (t < spec.restoredHeal[0]) return 'lock-expired';
  if (t < spec.restoredHeal[1]) return 'healing-restored';
  if (t < spec.resetAt) return 'recovered';
  return 'reset';
}

export function abilityLockResolve({
  locked = false,
  ability = 'heal',
  requestedAmount = 20,
} = {}) {
  const normalizedAbility = String(ability);
  const amount = Math.max(0, Number(requestedAmount) || 0);
  const blocked = locked && normalizedAbility === 'heal';
  return Object.freeze({
    ability: normalizedAbility,
    allowed: !blocked,
    requestedAmount: amount,
    appliedAmount: blocked ? 0 : normalizedAbility === 'heal' ? amount : 0,
    reason: blocked ? 'healing-locked' : 'allowed',
  });
}

const abilityLockHealthAt = (spec, time) => {
  if (time < spec.firstHeal[0]) return spec.healthBefore;
  if (time < spec.firstHeal[1])
    return mix(
      spec.healthBefore,
      spec.healthBefore + spec.healAmount,
      smooth((time - spec.firstHeal[0]) / (spec.firstHeal[1] - spec.firstHeal[0])),
    );
  if (time < spec.hitAt) return spec.healthBefore + spec.healAmount;
  if (time < spec.restoredHeal[0]) return spec.healthBefore;
  if (time < spec.restoredHeal[1])
    return mix(
      spec.healthBefore,
      spec.healthBefore + spec.healAmount,
      smooth((time - spec.restoredHeal[0]) / (spec.restoredHeal[1] - spec.restoredHeal[0])),
    );
  if (time < spec.settleAt) return spec.healthBefore + spec.healAmount;
  return mix(
    spec.healthBefore + spec.healAmount,
    spec.healthBefore,
    smooth((time - spec.settleAt) / (spec.resetAt - spec.settleAt)),
  );
};

export function resourceStealState(time) {
  const spec = SPECS['resource-steal'];
  const t = localTime(time);
  if (t < spec.firstTelegraph[0]) return 'ready';
  if (t < spec.firstResolveAt) return 'first-telegraph';
  if (t < spec.return[0]) return 'first-avoided';
  if (t < spec.secondTelegraph[0]) return 'repositioning';
  if (t < spec.hitAt) return 'second-telegraph';
  if (t < spec.spill[1]) return 'resource-spilling';
  if (t < spec.reclaim[1]) return 'player-reclaiming';
  if (t < spec.capture[1]) return 'boss-capturing';
  if (t < spec.retreat[0]) return 'benefit-applied';
  if (t < spec.resetAt) return 'settled';
  return 'reset';
}

export function resourceStealResolve({ current = 6, drop = 3, reclaim = 1, bossCapture = 2 } = {}) {
  const currentBefore = Math.max(0, Math.floor(Number(current) || 0));
  const dropped = Math.min(currentBefore, Math.max(0, Math.floor(Number(drop) || 0)));
  const reclaimed = Math.min(dropped, Math.max(0, Math.floor(Number(reclaim) || 0)));
  const captured = Math.min(dropped - reclaimed, Math.max(0, Math.floor(Number(bossCapture) || 0)));
  const world = dropped - reclaimed - captured;
  const player = currentBefore - dropped + reclaimed;
  return Object.freeze({
    currentBefore,
    dropped,
    reclaimed,
    captured,
    world,
    player,
    conserved: player + captured + world === currentBefore,
    dropEventCount: dropped > 0 ? 1 : 0,
    benefitEventCount: captured > 0 ? 1 : 0,
  });
}

export function onHitHealingState(time) {
  const spec = SPECS['on-hit-healing'];
  const t = localTime(time);
  if (t < spec.firstTelegraph[0]) return 'ready';
  if (t < spec.firstResolveAt) return 'first-telegraph';
  if (t < spec.return[0]) return 'first-missed';
  if (t < spec.secondTelegraph[0]) return 'repositioning';
  if (t < spec.blockedHitAt) return 'second-telegraph';
  if (t < spec.healing[1]) return 'blocked-contact-healing';
  if (t < spec.thirdTelegraph[0]) return 'healed';
  if (t < spec.thirdResolveAt) return 'third-telegraph';
  if (t < spec.counterReturn[0]) return 'third-missed';
  if (t < spec.counterAt) return 'counter-approach';
  if (t < spec.resetAt) return 'recovery';
  return 'reset';
}

export function onHitHealingResolve({
  currentHealth = 48,
  maximumHealth = 100,
  qualifyingContact = false,
  damageApplied = 0,
  healAmount = 16,
  alreadyResolved = false,
} = {}) {
  const maximum = Math.max(1, Number(maximumHealth) || 100);
  const before = Math.min(maximum, Math.max(0, Number(currentHealth) || 0));
  const requested =
    qualifyingContact && !alreadyResolved ? Math.max(0, Number(healAmount) || 0) : 0;
  const applied = Math.min(maximum - before, requested);
  return Object.freeze({
    healthBefore: before,
    healthAfter: before + applied,
    requested,
    applied,
    damageApplied: Math.max(0, Number(damageApplied) || 0),
    contactQualified: Boolean(qualifyingContact),
    eventCount: applied > 0 ? 1 : 0,
    resultId: applied > 0 ? 'on-hit-heal-1' : 'none',
  });
}

export function selfHealCastState(time) {
  const spec = SPECS['self-heal-cast'];
  const t = localTime(time);
  if (t < spec.firstTelegraph[0]) return 'ready';
  if (t < spec.firstChannel[0]) return 'first-telegraph';
  if (t < spec.interruptAt) return 'first-channel';
  if (t < spec.firstRecovery[1]) return 'interrupted';
  if (t < spec.secondTelegraph[0]) return 'repositioning';
  if (t < spec.secondChannel[0]) return 'second-telegraph';
  if (t < spec.secondChannel[1]) return 'second-channel';
  if (t < spec.healing[1]) return 'healing';
  if (t < spec.secondRecovery[1]) return 'healed';
  if (t < spec.resetAt) return 'recovery';
  return 'reset';
}

export function selfHealCastResolve({
  currentHealth = 38,
  maximumHealth = 100,
  healAmount = 24,
  castCompleted = false,
  interrupted = false,
  alreadyResolved = false,
} = {}) {
  const maximum = Math.max(1, Number(maximumHealth) || 100);
  const before = Math.min(maximum, Math.max(0, Number(currentHealth) || 0));
  const qualifies = Boolean(castCompleted) && !interrupted && !alreadyResolved;
  const requested = qualifies ? Math.max(0, Number(healAmount) || 0) : 0;
  const applied = Math.min(maximum - before, requested);
  return Object.freeze({
    healthBefore: before,
    healthAfter: before + applied,
    requested,
    applied,
    castCompleted: Boolean(castCompleted),
    interrupted: Boolean(interrupted),
    eventCount: applied > 0 ? 1 : 0,
    resultId: applied > 0 ? 'self-heal-cast-1' : 'none',
  });
}

export function externalHealingSourceState(time) {
  const spec = SPECS['external-healing-source'];
  const t = localTime(time);
  if (t < spec.firstSignal[0]) return 'ready';
  if (t < spec.firstTransfer[0]) return 'sources-signaled';
  if (t < spec.destroyAt) return 'first-packet-travelling';
  if (t < spec.firstRecovery[1]) return 'first-source-destroyed';
  if (t < spec.secondSignal[0]) return 'repositioning';
  if (t < spec.secondTransfer[0]) return 'second-source-signaled';
  if (t < spec.secondTransfer[1]) return 'second-packet-travelling';
  if (t < spec.healing[1]) return 'packet-delivered';
  if (t < spec.secondRecovery[1]) return 'boss-healed';
  if (t < spec.resetAt) return 'recovery';
  return 'reset';
}

export function externalHealingSourceResolve({
  currentHealth = 42,
  maximumHealth = 100,
  healAmount = 18,
  sourceActive = false,
  packetArrived = false,
  sourceId = 'healing-source-2',
  alreadyResolved = false,
} = {}) {
  const maximum = Math.max(1, Number(maximumHealth) || 100);
  const before = Math.min(maximum, Math.max(0, Number(currentHealth) || 0));
  const qualifies = Boolean(sourceActive) && Boolean(packetArrived) && !alreadyResolved;
  const requested = qualifies ? Math.max(0, Number(healAmount) || 0) : 0;
  const applied = Math.min(maximum - before, requested);
  return Object.freeze({
    healthBefore: before,
    healthAfter: before + applied,
    requested,
    applied,
    sourceActive: Boolean(sourceActive),
    packetArrived: Boolean(packetArrived),
    sourceId: qualifies ? String(sourceId) : 'none',
    eventCount: applied > 0 ? 1 : 0,
    resultId: applied > 0 ? `external-heal-${String(sourceId)}` : 'none',
  });
}

export function damageRateCapState(time) {
  const spec = SPECS['damage-rate-cap'];
  const t = localTime(time);
  if (t < spec.isolatedSignal[0]) return 'ready';
  if (t < spec.isolatedHitAt) return 'isolated-signal';
  if (t < spec.firstWindowClearsAt) return 'isolated-hit';
  if (t < spec.burstSignal[0]) return 'window-cleared';
  if (t < spec.burstHits[0]) return 'burst-signal';
  if (t < spec.burstEndsAt) return 'burst-attenuating';
  if (t < spec.decay[1]) return 'window-decaying';
  if (t < spec.recoveredHitAt) return 'recovered-signal';
  if (t < spec.recoveryEndsAt) return 'recovered-hit';
  if (t < spec.resetAt) return 'recovery';
  return 'reset';
}

export function damageRateCapResolve({
  rawDamage = 18,
  recentDamage = 0,
  threshold = 18,
  minimumMultiplier = 0.25,
  hitId = 'damage-rate-cap-hit-1',
  alreadyResolved = false,
} = {}) {
  const raw = Math.max(0, Number(rawDamage) || 0);
  const recent = Math.max(0, Number(recentDamage) || 0);
  const limit = Math.max(1, Number(threshold) || 1);
  const floor = clamp(Number(minimumMultiplier) || 0, 0, 1);
  const multiplier = Math.max(floor, Math.min(1, limit / Math.max(limit, recent + raw)));
  const applied = alreadyResolved ? 0 : Math.round(raw * multiplier);
  return Object.freeze({
    rawDamage: raw,
    recentDamage: recent,
    threshold: limit,
    multiplier,
    appliedDamage: applied,
    preventedDamage: alreadyResolved ? 0 : raw - applied,
    eventCount: alreadyResolved || raw <= 0 ? 0 : 1,
    hitId: alreadyResolved || raw <= 0 ? 'none' : String(hitId),
  });
}

export function loadoutMirrorState(time) {
  const spec = SPECS['loadout-mirror'];
  const t = localTime(time);
  if (t < spec.scan[0]) return 'ready';
  if (t < spec.captureAt) return 'scanning';
  if (t < spec.copyReveal[1]) return 'snapshot-captured';
  if (t < spec.playerSwapAt) return 'copy-locked';
  if (t < spec.bossUseAt) return 'player-loadout-changed';
  if (t < spec.bossUseEndsAt) return 'copied-package-active';
  if (t < spec.stableUntil) return 'snapshot-stable';
  if (t < spec.resetAt) return 'recovery';
  return 'reset';
}

export function loadoutMirrorSnapshot({
  equippedIds = ['sword', 'ward', 'ember'],
  existingCopiedIds = [],
  snapshotId = 'loadout-snapshot-1',
  alreadyCaptured = false,
} = {}) {
  const normalize = (values) => [
    ...new Set(Array.isArray(values) ? values.map(String).filter(Boolean) : []),
  ];
  const equipped = normalize(equippedIds);
  const existing = normalize(existingCopiedIds);
  const captured = !alreadyCaptured && equipped.length > 0;
  const copied = captured ? [...equipped] : existing;
  return Object.freeze({
    snapshotId: copied.length > 0 ? String(snapshotId) : 'none',
    equippedIds: Object.freeze(equipped),
    copiedIds: Object.freeze(copied),
    captured,
    eventCount: captured ? 1 : 0,
  });
}

export function movesetShapeshiftingState(time) {
  const spec = SPECS['moveset-shapeshifting'];
  const t = localTime(time);
  if (t < spec.firstSignal[0]) return 'colossus-ready';
  if (t < spec.firstActive[0]) return 'colossus-signal';
  if (t < spec.firstRecovery[0]) return 'colossus-active';
  if (t < spec.firstChange[0]) return 'colossus-recovery';
  if (t < spec.firstChange[1]) return 'change-to-serpent';
  if (t < spec.secondActive[0]) return 'serpent-signal';
  if (t < spec.secondRecovery[0]) return 'serpent-active';
  if (t < spec.secondChange[0]) return 'serpent-recovery';
  if (t < spec.secondChange[1]) return 'change-to-oracle';
  if (t < spec.thirdActive[0]) return 'oracle-signal';
  if (t < spec.thirdRecovery[0]) return 'oracle-active';
  if (t < spec.thirdRecovery[1]) return 'oracle-recovery';
  if (t < spec.resetAt) return 'sequence-complete';
  return 'reset';
}

export function movesetShapeshiftingResolve({
  currentForm = 'colossus',
  requestedForm = 'serpent',
  allowedForms = ['colossus', 'serpent', 'oracle'],
  changeId = 'moveset-change-1',
  alreadyApplied = false,
} = {}) {
  const allowed = [...new Set(Array.isArray(allowedForms) ? allowedForms.map(String) : [])];
  const current = allowed.includes(String(currentForm))
    ? String(currentForm)
    : (allowed[0] ?? 'none');
  const requested = String(requestedForm);
  const accepted = !alreadyApplied && allowed.includes(requested) && requested !== current;
  return Object.freeze({
    currentForm: current,
    requestedForm: requested,
    nextForm: accepted ? requested : current,
    accepted,
    rejected: !allowed.includes(requested),
    changeId: accepted ? String(changeId) : 'none',
    eventCount: accepted ? 1 : 0,
    allowedForms: Object.freeze(allowed),
  });
}

export function allyTheftState(time) {
  const spec = SPECS['ally-theft'];
  const t = localTime(time);
  if (t < spec.mark[0]) return 'ally-friendly';
  if (t < spec.mark[1]) return 'ally-marked';
  if (t < spec.transfer[1]) return 'ownership-transferring';
  if (t < spec.hostile[1]) return 'hostile-command';
  if (t < spec.release[1]) return 'control-breaking';
  if (t < spec.returning[1]) return 'ally-returning';
  if (t < spec.recoveryEndsAt) return 'ally-restored';
  if (t < spec.resetAt) return 'recapture-grace';
  return 'reset';
}

export function allyTheftTransfer({
  eligibleAllyIds = ['rune-familiar-1'],
  selectedAllyId = 'rune-familiar-1',
  currentOwner = 'player',
  requestedOwner = 'boss',
  captureId = 'ally-capture-1',
  allyAlive = true,
  alreadyApplied = false,
} = {}) {
  const eligible = [
    ...new Set(Array.isArray(eligibleAllyIds) ? eligibleAllyIds.map(String).filter(Boolean) : []),
  ];
  const selected = String(selectedAllyId);
  const owner = String(currentOwner);
  const requested = String(requestedOwner);
  const accepted =
    !alreadyApplied && allyAlive && eligible.includes(selected) && requested !== owner;
  return Object.freeze({
    selectedAllyId: selected,
    currentOwner: owner,
    requestedOwner: requested,
    nextOwner: accepted ? requested : owner,
    captureId: accepted ? String(captureId) : 'none',
    accepted,
    rejected: !allyAlive || !eligible.includes(selected),
    eventCount: accepted ? 1 : 0,
    eligibleAllyIds: Object.freeze(eligible),
  });
}

export function falseDeathState(time) {
  const spec = SPECS['false-death'];
  const t = localTime(time);
  if (t < spec.strikeAt) return 'phase-one-active';
  if (t < spec.collapse[1]) return 'phase-one-depleted';
  if (t < spec.pending[1]) return 'completion-pending';
  if (t < spec.rebuild[1]) return 'revival-building';
  if (t < spec.secondSignal[1]) return 'phase-two-signaled';
  if (t < spec.secondActive[1]) return 'phase-two-active';
  if (t < spec.resetAt) return 'phase-two-stable';
  return 'reset';
}

export function falseDeathResolve({
  depletionId = 'phase-1-depletion-1',
  currentPhase = 1,
  finalPhase = false,
  revivalAvailable = true,
  encounterComplete = false,
  rewardGranted = false,
  alreadyApplied = false,
} = {}) {
  const phase = Math.max(1, Math.trunc(Number(currentPhase) || 1));
  const canResolve = !alreadyApplied && !encounterComplete;
  const revived = canResolve && !finalPhase && revivalAvailable;
  const completed = canResolve && finalPhase;
  return Object.freeze({
    depletionId: String(depletionId),
    currentPhase: phase,
    nextPhase: revived ? phase + 1 : phase,
    phaseHealthDepleted: canResolve,
    revived,
    revivalCount: revived ? 1 : 0,
    encounterComplete: Boolean(encounterComplete || completed),
    rewardUnlocked: Boolean(rewardGranted || completed),
    exitUnlocked: Boolean(completed),
    eventCount: revived || completed ? 1 : 0,
  });
}

export function actionReactivePunishState(time) {
  const spec = SPECS['action-reactive-punish'];
  const t = localTime(time);
  if (t < spec.action[0]) return 'neutral';
  if (t < spec.observedAt) return 'action-started';
  if (t < spec.responseSignal[1]) return 'response-signaled';
  if (t < spec.responseFlight[1]) return 'response-resolving';
  if (t < spec.responseRecoveryEndsAt) return 'response-recovery';
  if (t < spec.bossAttack[0]) return 'boss-committed';
  if (t < spec.bossAttack[1]) return 'ordinary-attack';
  if (t < spec.safeAction[0]) return 'boss-recovery';
  if (t < spec.safeAction[1]) return 'protected-opening';
  if (t < spec.cooldownEndsAt) return 'opening-resolved';
  if (t < spec.resetAt) return 'cooldown';
  return 'reset';
}

export function actionReactivePunishResolve({
  actionId = 'heal-1',
  actionType = 'heal',
  eligibleActionTypes = ['heal', 'item', 'cast'],
  actionStarted = true,
  bossAvailable = true,
  withinRange = true,
  lineOfSight = true,
  cooldownReady = true,
  alreadyApplied = false,
} = {}) {
  const eligible = [
    ...new Set(
      Array.isArray(eligibleActionTypes) ? eligibleActionTypes.map(String).filter(Boolean) : [],
    ),
  ];
  const type = String(actionType);
  const observed = Boolean(actionStarted);
  const accepted =
    observed &&
    eligible.includes(type) &&
    bossAvailable &&
    withinRange &&
    lineOfSight &&
    cooldownReady &&
    !alreadyApplied;
  const rejectionReason = accepted
    ? 'none'
    : alreadyApplied
      ? 'duplicate-event'
      : !observed
        ? 'action-not-started'
        : !eligible.includes(type)
          ? 'ineligible-action'
          : !bossAvailable
            ? 'boss-busy'
            : !withinRange
              ? 'out-of-range'
              : !lineOfSight
                ? 'line-of-sight-blocked'
                : !cooldownReady
                  ? 'cooldown'
                  : 'none';
  return Object.freeze({
    actionId: String(actionId),
    actionType: type,
    observed,
    accepted,
    responseId: accepted ? 'action-response-1' : 'none',
    responseType: accepted ? 'rune-dart' : 'none',
    rejectionReason,
    eventCount: accepted ? 1 : 0,
    eligibleActionTypes: Object.freeze(eligible),
  });
}

export function runHistoryManifestationState(time) {
  const spec = SPECS['run-history-manifestation'];
  const t = localTime(time);
  if (t < spec.capturedAt) return 'history-visible';
  if (t < spec.materialize[1]) return 'manifest-captured';
  if (t < spec.echoFlight[0]) return 'echo-signaled';
  if (t < spec.echoFlight[1]) return 'echo-active';
  if (t < spec.relicActive[0]) return 'relic-signaled';
  if (t < spec.relicActive[1]) return 'relic-active';
  if (t < spec.opening[1]) return 'history-opening';
  if (t < spec.retry[1]) return 'retry-stable';
  return 'reset';
}

export function runHistoryManifestationResolve({
  encounterId = 'kern-memory-vault-1',
  entryId = 'vault-entry-1',
  historyVersion = 1,
  history = {
    defeatedSentinel: true,
    rescuedGuide: true,
    claimedRelic: true,
  },
  alreadyCaptured = false,
} = {}) {
  const normalizedHistory = Object.freeze({
    defeatedSentinel: Boolean(history?.defeatedSentinel),
    rescuedGuide: Boolean(history?.rescuedGuide),
    claimedRelic: Boolean(history?.claimedRelic),
  });
  const tokens = [
    normalizedHistory.defeatedSentinel ? 'echo' : 'no-echo',
    normalizedHistory.rescuedGuide ? 'ward' : 'no-ward',
    normalizedHistory.claimedRelic ? 'relic' : 'no-relic',
  ];
  return Object.freeze({
    encounterId: String(encounterId),
    entryId: String(entryId),
    historyVersion: Math.max(1, Math.trunc(Number(historyVersion) || 1)),
    history: normalizedHistory,
    manifestId: `run-manifest-${tokens.join('-')}-1`,
    hostileEchoIds: Object.freeze(normalizedHistory.defeatedSentinel ? ['sentinel-echo-1'] : []),
    supportIds: Object.freeze(normalizedHistory.rescuedGuide ? ['guide-ward-1'] : []),
    bossModifierIds: Object.freeze(normalizedHistory.claimedRelic ? ['relic-ring-1'] : []),
    accepted: !alreadyCaptured,
    eventCount: alreadyCaptured ? 0 : 1,
  });
}

export function realTimeProgressionState(time) {
  const spec = SPECS['real-time-progression'];
  const t = localTime(time);
  if (t < spec.checkpointAt) return 'encounter-active';
  if (t < spec.closed[0]) return 'checkpoint-saved';
  if (t < spec.closed[1]) return 'game-closed';
  if (t < spec.reconcile[1]) return 'time-reconciling';
  if (t < spec.summary[1]) return 'return-summary';
  if (t < spec.attack[0]) return 'progression-signaled';
  if (t < spec.attack[1]) return 'progression-active';
  if (t < spec.opening[1]) return 'progression-opening';
  if (t < spec.retry[1]) return 'retry-stable';
  return 'reset';
}

export function realTimeProgressionResolve({
  checkpointId = 'kern-clock-vault-1',
  reconciliationId = 'offline-reconcile-1',
  authority = 'trusted-server',
  stateVersion = 1,
  savedAtMs = 43_200_000,
  nowMs = 68_400_000,
  maxOfflineMs = 21_600_000,
  alreadyApplied = false,
} = {}) {
  const saved = Number.isFinite(Number(savedAtMs)) ? Number(savedAtMs) : 0;
  const current = Number.isFinite(Number(nowMs)) ? Number(nowMs) : saved;
  const cap = Math.max(0, Number(maxOfflineMs) || 0);
  const elapsedMs = current - saved;
  const clockRollback = elapsedMs < 0;
  const accepted = !alreadyApplied && !clockRollback;
  const appliedElapsedMs = accepted ? Math.min(elapsedMs, cap) : 0;
  return Object.freeze({
    checkpointId: String(checkpointId),
    reconciliationId: String(reconciliationId),
    authority: String(authority),
    stateVersion: Math.max(1, Math.trunc(Number(stateVersion) || 1)),
    savedAtMs: saved,
    nowMs: current,
    elapsedMs: Math.max(0, elapsedMs),
    maxOfflineMs: cap,
    appliedElapsedMs,
    progressionUnits: Math.floor(appliedElapsedMs / 3_600_000),
    bossTier: appliedElapsedMs >= 18_000_000 ? 2 : 1,
    capped: accepted && elapsedMs > cap,
    clockRollback,
    accepted,
    rejectionReason: alreadyApplied
      ? 'duplicate-reconciliation'
      : clockRollback
        ? 'clock-rollback'
        : 'none',
    eventCount: accepted ? 1 : 0,
  });
}

export function interfaceInteractionState(time) {
  const spec = SPECS['interface-interaction'];
  const t = localTime(time);
  if (t < spec.blockedAt) return 'ordinary-channel';
  if (t < spec.pause[0]) return 'normal-action-blocked';
  if (t < spec.switchRoute[0]) return 'interaction-paused';
  if (t < spec.confirm[0]) return 'route-switching';
  if (t < spec.pause[1]) return 'route-confirmed';
  if (t < spec.opening[0]) return 'focus-restored';
  if (t < spec.opening[1]) return 'opening-active';
  if (t < spec.counter[0]) return 'counter-signaled';
  if (t < spec.counter[1]) return 'counter-active';
  if (t < spec.retry[0]) return 'combat-resumed';
  if (t < spec.retry[1]) return 'retry-safe';
  return 'reset';
}

export function interfaceInteractionResolve({
  interactionId = 'kern-input-ward-1',
  confirmationId = 'route-confirmation-1',
  primaryRoute = 'channel-a',
  alternateRoute = 'channel-b',
  fallbackRoute = 'menu-fallback',
  alternateAvailable = true,
  consentGranted = true,
  alreadyConfirmed = false,
} = {}) {
  const accepted = Boolean(consentGranted) && !alreadyConfirmed;
  const fallbackUsed = accepted && !alternateAvailable;
  return Object.freeze({
    interactionId: String(interactionId),
    confirmationId: String(confirmationId),
    primaryRoute: String(primaryRoute),
    selectedRoute: accepted
      ? fallbackUsed
        ? String(fallbackRoute)
        : String(alternateRoute)
      : String(primaryRoute),
    alternateAvailable: Boolean(alternateAvailable),
    consentGranted: Boolean(consentGranted),
    fallbackAvailable: true,
    fallbackUsed,
    accepted,
    rejectionReason: alreadyConfirmed
      ? 'duplicate-confirmation'
      : consentGranted
        ? 'none'
        : 'consent-declined',
    confirmationCount: accepted ? 1 : 0,
    destructiveActionCount: 0,
    privatePayloadStored: false,
  });
}

export function worldStateVariantState(time) {
  const spec = SPECS['world-state-variant'];
  const t = localTime(time);
  if (t < spec.snapshotAt) return 'context-visible';
  if (t < spec.materialize[0]) return 'snapshot-captured';
  if (t < spec.materialize[1]) return 'package-materializing';
  if (t < spec.attackSignal[0]) return 'variant-ready';
  if (t < spec.attack[0]) return 'variant-signaled';
  if (t < spec.attack[1]) return 'variant-active';
  if (t < spec.opening[1]) return 'opening-active';
  if (t < spec.reward[1]) return 'reward-mapped';
  if (t < spec.retry[0]) return 'encounter-stable';
  if (t < spec.retry[1]) return 'retry-stable';
  return 'reset';
}

export function worldStateVariantResolve({
  encounterId = 'kern-world-gate-1',
  entryId = 'world-entry-1',
  snapshotVersion = 1,
  timeBand = 'eclipse',
  regionState = 'ruined',
  worldMode = 'cursed',
  alreadyResolved = false,
} = {}) {
  const allowed = {
    timeBand: new Set(['dawn', 'eclipse']),
    regionState: new Set(['restored', 'ruined']),
    worldMode: new Set(['standard', 'cursed']),
  };
  const raw = {
    timeBand: String(timeBand),
    regionState: String(regionState),
    worldMode: String(worldMode),
  };
  const normalized = Object.freeze({
    timeBand: allowed.timeBand.has(raw.timeBand) ? raw.timeBand : 'dawn',
    regionState: allowed.regionState.has(raw.regionState) ? raw.regionState : 'restored',
    worldMode: allowed.worldMode.has(raw.worldMode) ? raw.worldMode : 'standard',
  });
  const fallbackUsed = Object.keys(normalized).some((key) => normalized[key] !== raw[key]);
  const eclipseRuin =
    normalized.timeBand === 'eclipse' &&
    normalized.regionState === 'ruined' &&
    normalized.worldMode === 'cursed';
  const variantId = eclipseRuin ? 'eclipse-ruin' : 'baseline-world';
  return Object.freeze({
    encounterId: String(encounterId),
    entryId: String(entryId),
    snapshotVersion: Math.max(1, Math.trunc(Number(snapshotVersion) || 1)),
    context: normalized,
    variantId,
    hazardIds: Object.freeze(eclipseRuin ? ['ruin-seal-west', 'ruin-seal-east'] : []),
    modifierIds: Object.freeze(eclipseRuin ? ['eclipse-ring', 'cursed-recovery'] : []),
    rewardTableId: eclipseRuin ? 'eclipse-relic-table' : 'baseline-reward-table',
    fallbackUsed,
    accepted: !alreadyResolved,
    rejectionReason: alreadyResolved ? 'duplicate-entry-resolution' : 'none',
    snapshotCount: alreadyResolved ? 0 : 1,
    eventCount: alreadyResolved ? 0 : 1,
    liveResnapshotCount: 0,
  });
}

export function partySizeScalingState(time) {
  const spec = SPECS['party-size-scaling'];
  const t = localTime(time);
  if (t < spec.joinQueuedAt) return 'solo-baseline';
  if (t < spec.scaleApplyAt) return 'join-queued';
  if (t < spec.attackSignal[0]) return 'party-scaled';
  if (t < spec.attack[0]) return 'scaled-attack-signaled';
  if (t < spec.attack[1]) return 'scaled-attack-active';
  if (t < spec.leaveQueuedAt) return 'opening-active';
  if (t < spec.leaveApplyAt) return 'leave-queued';
  if (t < spec.reward[0]) return 'party-recomputed';
  if (t < spec.reward[1]) return 'eligibility-settled';
  if (t < spec.retry[0]) return 'encounter-stable';
  if (t < spec.retry[1]) return 'retry-stable';
  return 'reset';
}

export function partySizeScalingResolve({
  encounterId = 'kern-party-trial-1',
  resolutionId = 'party-scale-join-1',
  rosterVersion = 1,
  partySize = 2,
  baselineMaxHealth = 1000,
  currentHealthFraction = 0.68,
  midAttack = false,
  alreadyApplied = false,
} = {}) {
  const rawPartySize = Math.trunc(Number(partySize));
  const normalizedPartySize = Number.isFinite(rawPartySize)
    ? Math.max(1, Math.min(4, rawPartySize))
    : 1;
  const fallbackUsed = rawPartySize !== normalizedPartySize;
  const healthCurve = [1, 1.6, 2.05, 2.4];
  const targetCurve = [1, 2, 2, 3];
  const hazardCurve = [1, 1.35, 1.65, 1.9];
  const safeFraction = clamp(Number(currentHealthFraction));
  const baseHealth = Math.max(1, Math.round(Number(baselineMaxHealth) || 1));
  const healthMultiplier = healthCurve[normalizedPartySize - 1];
  const maxHealth = Math.round(baseHealth * healthMultiplier);
  const accepted = !midAttack && !alreadyApplied;
  return Object.freeze({
    encounterId: String(encounterId),
    resolutionId: String(resolutionId),
    rosterVersion: Math.max(1, Math.trunc(Number(rosterVersion) || 1)),
    partySize: normalizedPartySize,
    baselineMaxHealth: baseHealth,
    healthMultiplier,
    maxHealth,
    currentHealth: Math.round(maxHealth * safeFraction),
    healthFraction: safeFraction,
    targetSlots: targetCurve[normalizedPartySize - 1],
    hazardBudget: hazardCurve[normalizedPartySize - 1],
    rewardShareCount: normalizedPartySize,
    fallbackUsed,
    accepted,
    rejectionReason: alreadyApplied
      ? 'duplicate-resolution'
      : midAttack
        ? 'unsafe-boundary'
        : 'none',
    applicationCount: accepted ? 1 : 0,
    midAttackApplications: 0,
    progressReversed: false,
  });
}

export function partnerRevivalState(time) {
  const spec = SPECS['partner-revival'];
  const t = localTime(time);
  if (t < spec.firstDownAt) return 'paired-baseline';
  if (t < spec.firstChannel[0]) return 'partner-downed';
  if (t < spec.firstReviveAt) return 'revive-channel-one';
  if (t < spec.secondDownAt) return 'partner-revived';
  if (t < spec.secondChannel[0]) return 'partner-downed-again';
  if (t < spec.interruptAt) return 'revive-channel-two';
  if (t < spec.interruptLockEnd) return 'revive-interrupted';
  if (t < spec.survivorDownAt) return 'synchronized-finish';
  if (t < spec.completionAt) return 'survivor-downed';
  if (t < spec.completionEnd) return 'completion-authorized';
  if (t < spec.retry[0]) return 'encounter-stable';
  if (t < spec.retry[1]) return 'retry-stable';
  return 'reset';
}

export function partnerRevivalResolve({
  encounterId = 'kern-twin-covenant-1',
  attemptId = 'partner-revive-1',
  pairVersion = 1,
  downedBossId = 'echo-kern',
  reviverBossId = 'kern',
  castDuration = 0.65,
  elapsed = 0.65,
  reviveHealthFraction = 0.4,
  reviveGrantCount = 0,
  maxRevives = 2,
  interrupted = false,
  partnerDowned = true,
  reviverDefeated = false,
  alreadyResolved = false,
} = {}) {
  const safeDuration = Math.max(0.05, Number(castDuration) || 0.65);
  const safeElapsed = Math.max(0, Number(elapsed) || 0);
  const safeGrantCount = Math.max(0, Math.trunc(Number(reviveGrantCount) || 0));
  const safeMaxRevives = Math.max(0, Math.trunc(Number(maxRevives) || 0));
  const distinctPair = String(downedBossId) !== String(reviverBossId);
  const capped = safeGrantCount >= safeMaxRevives;
  const progress = clamp(safeElapsed / safeDuration);
  const resolution = alreadyResolved
    ? 'duplicate-resolution'
    : !distinctPair
      ? 'invalid-pair'
      : reviverDefeated
        ? partnerDowned
          ? 'pair-defeated'
          : 'partner-alive'
        : interrupted
          ? 'interrupted'
          : capped
            ? 'revive-cap-reached'
            : progress < 1
              ? 'pending'
              : 'revived';
  const revived = resolution === 'revived';
  const completionAuthorized = resolution === 'pair-defeated';
  return Object.freeze({
    encounterId: String(encounterId),
    attemptId: String(attemptId),
    pairVersion: Math.max(1, Math.trunc(Number(pairVersion) || 1)),
    downedBossId: String(downedBossId),
    reviverBossId: String(reviverBossId),
    castDuration: safeDuration,
    elapsed: safeElapsed,
    progress,
    reviveHealthFraction: clamp(Number(reviveHealthFraction)),
    reviveGrantCount: safeGrantCount + (revived ? 1 : 0),
    maxRevives: safeMaxRevives,
    resolution,
    accepted: revived || completionAuthorized || resolution === 'interrupted',
    revivalAuthorized: revived,
    completionAuthorized,
    eventCount: ['pending', 'duplicate-resolution', 'invalid-pair'].includes(resolution) ? 0 : 1,
    duplicateGrantCount: 0,
  });
}

export function killOrderInheritanceState(time) {
  const spec = SPECS['kill-order-inheritance'];
  const t = localTime(time);
  if (t < spec.firstDefeatAt) return 'paired-baseline';
  if (t < spec.firstTransfer[0]) return 'left-defeated';
  if (t < spec.waveSignal[0]) return 'right-inherits-wave';
  if (t < spec.waveActive[0]) return 'wave-signaled';
  if (t < spec.waveActive[1]) return 'wave-active';
  if (t < spec.intermission[0]) return 'wave-recovery';
  if (t < spec.intermission[1]) return 'explicit-retry';
  if (t < spec.secondDefeatAt) return 'pair-restored';
  if (t < spec.secondTransfer[0]) return 'right-defeated';
  if (t < spec.lanceSignal[0]) return 'left-inherits-lance';
  if (t < spec.lanceActive[0]) return 'lance-signaled';
  if (t < spec.lanceActive[1]) return 'lance-active';
  if (t < spec.resetAt) return 'lance-recovery';
  return 'reset';
}

export function killOrderInheritanceResolve({
  encounterId = 'kern-inheritance-duel-1',
  attemptId = 'inheritance-attempt-1',
  pairVersion = 1,
  leftBossId = 'echo-kern',
  rightBossId = 'kern',
  firstDefeatedId = 'echo-kern',
  secondDefeatedId = 'none',
  simultaneousDefeat = false,
  alreadyResolved = false,
} = {}) {
  const distinctPair = String(leftBossId) !== String(rightBossId);
  const validFirst = [leftBossId, rightBossId].includes(firstDefeatedId);
  const survivorBossId = firstDefeatedId === leftBossId ? rightBossId : leftBossId;
  const completionAuthorized =
    distinctPair && (simultaneousDefeat || (validFirst && secondDefeatedId === survivorBossId));
  const resolution = alreadyResolved
    ? 'duplicate-resolution'
    : !distinctPair || !validFirst
      ? 'invalid-pair'
      : completionAuthorized
        ? 'pair-defeated'
        : secondDefeatedId !== 'none'
          ? 'invalid-order'
          : 'inherited';
  const inherited = resolution === 'inherited';
  return Object.freeze({
    encounterId: String(encounterId),
    attemptId: String(attemptId),
    pairVersion: Math.max(1, Math.trunc(Number(pairVersion) || 1)),
    sourceBossId: inherited ? String(firstDefeatedId) : 'none',
    survivorBossId: inherited ? String(survivorBossId) : 'none',
    inheritedPackage:
      inherited && firstDefeatedId === leftBossId ? 'rune-wave' : inherited ? 'rune-lance' : 'none',
    inheritanceGrantCount: inherited ? 1 : 0,
    completionAuthorized: resolution === 'pair-defeated',
    completionCount: resolution === 'pair-defeated' ? 1 : 0,
    resolution,
    accepted: inherited || resolution === 'pair-defeated',
    duplicateGrantCount: 0,
  });
}

export function sharedGroupHealthState(time) {
  const spec = SPECS['shared-group-health'];
  const t = localTime(time);
  if (t < spec.firstHitAt) return 'paired-full';
  if (t < spec.withdrawAt) return 'first-hit-shared';
  if (t < spec.firstSignal[0]) return 'left-absent';
  if (t < spec.firstAttack[0]) return 'first-lane-signaled';
  if (t < spec.firstAttack[1]) return 'first-lane-active';
  if (t < spec.returnAt) return 'left-absent-progress-held';
  if (t < spec.secondHitAt) return 'left-returned-no-refill';
  if (t < spec.secondSignal[0]) return 'second-hit-shared';
  if (t < spec.secondAttack[0]) return 'second-lane-signaled';
  if (t < spec.secondAttack[1]) return 'second-lane-active';
  if (t < spec.finalHitAt) return 'final-opening';
  if (t < spec.completionAt) return 'pool-zero';
  if (t < spec.retryAt) return 'group-complete';
  return 'explicit-retry';
}

export function sharedGroupHealthResolve({
  encounterId = 'kern-shared-covenant-1',
  attemptId = 'shared-health-attempt-1',
  maxHealth = 100,
  bodyIds = ['echo-kern', 'kern'],
  damageEvents = [],
  alreadyCompleted = false,
} = {}) {
  const maximum = Math.max(1, Math.trunc(Number(maxHealth) || 1));
  const roster = new Set(bodyIds.map(String));
  const seen = new Set();
  let health = maximum;
  let acceptedDamage = 0;
  let acceptedEventCount = 0;
  let duplicateEventCount = 0;
  for (const event of damageEvents) {
    const key = String(event.eventId ?? '');
    if (!key || seen.has(key)) {
      duplicateEventCount += 1;
      continue;
    }
    seen.add(key);
    if (!roster.has(String(event.bodyId)) || event.presentAtHit === false || health === 0) continue;
    const amount = Math.max(0, Math.trunc(Number(event.amount) || 0));
    if (amount === 0) continue;
    const applied = Math.min(health, amount);
    health -= applied;
    acceptedDamage += applied;
    acceptedEventCount += 1;
  }
  const completed = health === 0;
  return Object.freeze({
    encounterId: String(encounterId),
    attemptId: String(attemptId),
    maxHealth: maximum,
    currentHealth: health,
    acceptedDamage,
    acceptedEventCount,
    duplicateEventCount,
    completionAuthorized: completed,
    completionCount: completed && !alreadyCompleted ? 1 : 0,
    pendingBodiesCancelled: completed ? roster.size : 0,
  });
}

export function coordinatedDuoAttackState(time) {
  const spec = SPECS['coordinated-duo-attack'];
  const t = localTime(time);
  if (t < spec.leaderMove[0]) return 'paired-baseline';
  if (t < spec.leaderMove[1]) return 'leader-sets-anchor';
  if (t < spec.firstSignal[0]) return 'link-formed';
  if (t < spec.leaderAttack[0]) return 'shared-target-signaled';
  if (t < spec.followerAttack[0]) return 'leader-leg-active';
  if (t < spec.leaderAttack[1]) return 'overlapping-legs';
  if (t < spec.followerAttack[1]) return 'follower-leg-active';
  if (t < spec.secondSignal[0]) return 'paired-recovery';
  if (t < spec.interruptAt) return 'second-link-signaled';
  if (t < spec.plannedFollowerAt) return 'leader-interrupted';
  if (t < spec.resetAt) return 'followup-cancelled';
  return 'explicit-retry';
}

export function coordinatedDuoAttackResolve({
  encounterId = 'kern-linked-duo-1',
  comboId = 'rune-pincer-1',
  attemptId = 'duo-attempt-1',
  leaderBossId = 'echo-kern',
  followerBossId = 'kern',
  leaderPosition = { x: 220, y: 500 },
  targetOffset = { x: 85, y: 250 },
  leaderReady = true,
  followerReady = true,
  leaderInterrupted = false,
  alreadyResolved = false,
} = {}) {
  const pairValid = String(leaderBossId) !== String(followerBossId);
  const anchorValid = [leaderPosition.x, leaderPosition.y, targetOffset.x, targetOffset.y].every(
    Number.isFinite,
  );
  const sharedTarget = anchorValid
    ? Object.freeze({
        x: leaderPosition.x + targetOffset.x,
        y: leaderPosition.y + targetOffset.y,
      })
    : null;
  const committed = pairValid && anchorValid && leaderReady && followerReady && !alreadyResolved;
  const followupAuthorized = committed && !leaderInterrupted;
  const resolution = alreadyResolved
    ? 'duplicate'
    : !pairValid || !anchorValid
      ? 'invalid-pair'
      : !leaderReady || !followerReady
        ? 'not-ready'
        : leaderInterrupted
          ? 'interrupted'
          : 'committed';
  return Object.freeze({
    encounterId: String(encounterId),
    comboId: String(comboId),
    attemptId: String(attemptId),
    leaderBossId: String(leaderBossId),
    followerBossId: String(followerBossId),
    sharedTarget,
    committed,
    followupAuthorized,
    followupCount: followupAuthorized ? 1 : 0,
    cancellationCount: resolution === 'interrupted' ? 1 : 0,
    duplicateFollowupCount: 0,
    resolution,
  });
}

export function stackDamageState(time) {
  const spec = SPECS['stack-damage'];
  const t = localTime(time);
  if (t < spec.firstSignal[0]) return 'spread-baseline';
  if (t < spec.gather[0]) return 'first-target-marked';
  if (t < spec.gather[1]) return 'allies-gathering';
  if (t < spec.firstHit[0]) return 'three-in-marker';
  if (t < spec.firstHit[1]) return 'three-way-share';
  if (t < spec.secondSignal[0]) return 'shared-hit-recovery';
  if (t < spec.disperse[0]) return 'second-target-marked';
  if (t < spec.disperse[1]) return 'allies-leaving';
  if (t < spec.secondHit[0]) return 'single-in-marker';
  if (t < spec.secondHit[1]) return 'unshared-hit';
  if (t < spec.resetAt) return 'solo-failure';
  return 'explicit-retry';
}

export function stackDamageResolve({
  encounterId = 'kern-shared-impact-1',
  hitId = 'rune-impact-1',
  targetPlayerId = 'tavi',
  targetPosition = { x: 280, y: 710 },
  players = [
    { id: 'tavi', position: { x: 280, y: 710 }, alive: true },
    { id: 'ally-left', position: { x: 200, y: 710 }, alive: true },
    { id: 'ally-right', position: { x: 360, y: 710 }, alive: true },
  ],
  markerRadius = 115,
  totalDamage = 90,
  alreadyResolved = false,
} = {}) {
  const valid =
    Number.isFinite(targetPosition.x) &&
    Number.isFinite(targetPosition.y) &&
    Number.isFinite(markerRadius) &&
    markerRadius > 0 &&
    Number.isSafeInteger(totalDamage) &&
    totalDamage >= 0;
  const roster = Array.isArray(players) ? players : [];
  const unique = new Set();
  const participants = valid
    ? roster
        .filter(({ id, position, alive }) => {
          if (!alive || !position || !Number.isFinite(position.x) || !Number.isFinite(position.y))
            return false;
          const key = String(id);
          if (unique.has(key)) return false;
          if (
            Math.hypot(position.x - targetPosition.x, position.y - targetPosition.y) > markerRadius
          )
            return false;
          unique.add(key);
          return true;
        })
        .map(({ id }) => String(id))
        .sort()
    : [];
  const eligible = participants.includes(String(targetPlayerId)) && participants.length > 0;
  const perPlayer =
    eligible && !alreadyResolved
      ? participants.map((id, index) =>
          Object.freeze({
            id,
            damage:
              Math.floor(totalDamage / participants.length) +
              (index < totalDamage % participants.length ? 1 : 0),
          }),
        )
      : [];
  return Object.freeze({
    encounterId: String(encounterId),
    hitId: String(hitId),
    targetPlayerId: String(targetPlayerId),
    participantIds: Object.freeze(participants),
    participantCount: participants.length,
    perPlayer: Object.freeze(perPlayer),
    totalAppliedDamage: perPlayer.reduce((sum, item) => sum + item.damage, 0),
    resolution: !valid || !eligible ? 'invalid' : alreadyResolved ? 'duplicate' : 'applied',
    applicationCount: eligible && !alreadyResolved ? 1 : 0,
  });
}

export function personalSpreadState(time) {
  const spec = SPECS['personal-spread'];
  const t = localTime(time);
  if (t < spec.firstSignal[0]) return 'group-baseline';
  if (t < spec.separate[0]) return 'three-marks';
  if (t < spec.separate[1]) return 'separating';
  if (t < spec.firstHit[0]) return 'safe-spread';
  if (t < spec.firstHit[1]) return 'one-hit-each';
  if (t < spec.secondSignal[0]) return 'safe-recovery';
  if (t < spec.regroup[0]) return 'second-three-marks';
  if (t < spec.regroup[1]) return 'too-close';
  if (t < spec.secondHit[0]) return 'foreign-body-inside';
  if (t < spec.secondHit[1]) return 'multiple-hits';
  if (t < spec.resetAt) return 'spread-failure';
  return 'explicit-retry';
}

export function personalSpreadResolve({
  encounterId = 'kern-three-marks-1',
  hitId = 'spread-pulse-1',
  marked = [
    { id: 'tavi', position: { x: 280, y: 710 } },
    { id: 'ally-left', position: { x: 145, y: 710 } },
    { id: 'ally-right', position: { x: 415, y: 710 } },
  ],
  markerRadius = 110,
  bodyRadius = BLUEPRINT_PLAYER_RADIUS,
  damagePerHit = 25,
  alreadyResolved = false,
} = {}) {
  const valid =
    Array.isArray(marked) &&
    marked.length > 0 &&
    Number.isFinite(markerRadius) &&
    markerRadius > 0 &&
    Number.isFinite(bodyRadius) &&
    bodyRadius >= 0 &&
    Number.isSafeInteger(damagePerHit) &&
    damagePerHit >= 0 &&
    marked.every(
      ({ id, position }) =>
        id != null && position && Number.isFinite(position.x) && Number.isFinite(position.y),
    );
  const ids = valid ? marked.map(({ id }) => String(id)) : [];
  const distinct = new Set(ids).size === ids.length;
  const perPlayer =
    valid && distinct && !alreadyResolved
      ? marked.map(({ id, position }) => {
          const hitIds = marked
            .filter(
              ({ position: center }) =>
                Math.hypot(position.x - center.x, position.y - center.y) <=
                markerRadius + bodyRadius,
            )
            .map(({ id: sourceId }) => String(sourceId));
          return Object.freeze({
            id: String(id),
            hitIds: Object.freeze(hitIds),
            hitCount: hitIds.length,
            damage: hitIds.length * damagePerHit,
          });
        })
      : [];
  return Object.freeze({
    encounterId: String(encounterId),
    hitId: String(hitId),
    perPlayer: Object.freeze(perPlayer),
    applicationCount: perPlayer.length,
    resolution: !valid || !distinct ? 'invalid' : alreadyResolved ? 'duplicate' : 'applied',
  });
}

export function towerSoakState(time) {
  const spec = SPECS['tower-soak'];
  const t = localTime(time);
  if (t < spec.firstSignal[0]) return 'empty-arena';
  if (t < spec.enterFirst[0]) return 'single-tower-warned';
  if (t < spec.enterFirst[1]) return 'entering-single-tower';
  if (t < spec.firstHit[0]) return 'one-of-one';
  if (t < spec.firstHit[1]) return 'single-tower-succeeded';
  if (t < spec.secondSignal[0]) return 'between-towers';
  if (t < spec.enterSecond[0]) return 'double-tower-warned';
  if (t < spec.enterSecond[1]) return 'entering-double-tower';
  if (t < spec.secondHit[0]) return 'one-of-two';
  if (t < spec.secondHit[1]) return 'double-tower-failed';
  if (t < spec.resetAt) return 'raidwide-failure';
  return 'explicit-retry';
}

export function towerSoakResolve({
  encounterId = 'kern-fixed-towers-1',
  hitId = 'tower-one-1',
  center = { x: 405, y: 710 },
  players = [
    { id: 'tavi', position: { x: 405, y: 710 }, alive: true },
    { id: 'ally', position: { x: 330, y: 795 }, alive: true },
  ],
  radius = 66,
  bodyRadius = BLUEPRINT_PLAYER_RADIUS,
  requiredCount = 1,
  occupantDamage = 15,
  failureDamage = 90,
  alreadyResolved = false,
} = {}) {
  const valid =
    center &&
    Number.isFinite(center.x) &&
    Number.isFinite(center.y) &&
    Number.isFinite(radius) &&
    radius > 0 &&
    Number.isFinite(bodyRadius) &&
    bodyRadius >= 0 &&
    bodyRadius < radius &&
    Number.isSafeInteger(requiredCount) &&
    requiredCount > 0 &&
    Number.isSafeInteger(occupantDamage) &&
    occupantDamage >= 0 &&
    Number.isSafeInteger(failureDamage) &&
    failureDamage >= 0 &&
    Array.isArray(players) &&
    players.every(
      (player) =>
        player &&
        player.id != null &&
        player.position &&
        Number.isFinite(player.position.x) &&
        Number.isFinite(player.position.y),
    );
  const ids = valid ? players.map(({ id }) => String(id)) : [];
  const unique = new Set(ids).size === ids.length;
  const occupiedIds =
    valid && unique
      ? players
          .filter(
            ({ position, alive }) =>
              alive &&
              Math.hypot(position.x - center.x, position.y - center.y) <= radius - bodyRadius,
          )
          .map(({ id }) => String(id))
          .sort()
      : [];
  const succeeded = valid && unique && occupiedIds.length === requiredCount;
  return Object.freeze({
    encounterId: String(encounterId),
    hitId: String(hitId),
    center: Object.freeze({ x: center?.x, y: center?.y }),
    requiredCount,
    occupiedIds: Object.freeze(occupiedIds),
    occupiedCount: occupiedIds.length,
    succeeded,
    occupantDamage: succeeded && !alreadyResolved ? occupantDamage : 0,
    raidwideDamage: !succeeded && valid && unique && !alreadyResolved ? failureDamage : 0,
    resolution:
      !valid || !unique
        ? 'invalid'
        : alreadyResolved
          ? 'duplicate'
          : succeeded
            ? 'soaked'
            : 'failed',
    applicationCount: valid && unique && !alreadyResolved ? 1 : 0,
  });
}

export function entityTetherState(time) {
  const spec = SPECS['entity-tether'];
  const t = localTime(time);
  if (t < spec.linkAt) return 'unlinked';
  if (t < spec.travelTogether[0]) return 'linked-warned';
  if (t < spec.travelTogether[1]) return 'moving-together';
  if (t < spec.firstCheck[0]) return 'within-limit';
  if (t < spec.firstCheck[1]) return 'first-check-held';
  if (t < spec.secondWarn) return 'regrouping';
  if (t < spec.travelApart[0]) return 'second-link-warned';
  if (t < spec.travelApart[1]) return 'moving-apart';
  if (t < spec.secondCheck[0]) return 'over-limit';
  if (t < spec.secondCheck[1]) return 'second-check-broken';
  if (t < spec.resetAt) return 'pair-damaged';
  return 'explicit-retry';
}

export function entityTetherResolve({
  encounterId = 'kern-pair-tether-1',
  hitId = 'tether-pulse-1',
  first = { id: 'tavi', position: { x: 285, y: 690 }, alive: true },
  second = { id: 'ally', position: { x: 400, y: 760 }, alive: true },
  maxLength = 150,
  breakDamage = 90,
  alreadyResolved = false,
} = {}) {
  const validActor = (actor) =>
    actor &&
    actor.id != null &&
    actor.alive === true &&
    actor.position &&
    Number.isFinite(actor.position.x) &&
    Number.isFinite(actor.position.y);
  const valid =
    validActor(first) &&
    validActor(second) &&
    String(first.id) !== String(second.id) &&
    Number.isFinite(maxLength) &&
    maxLength > 0 &&
    Number.isSafeInteger(breakDamage) &&
    breakDamage >= 0;
  const distance = valid
    ? Math.hypot(first.position.x - second.position.x, first.position.y - second.position.y)
    : 0;
  const held = Boolean(valid && distance <= maxLength);
  return Object.freeze({
    encounterId: String(encounterId),
    hitId: String(hitId),
    endpointIds: Object.freeze(valid ? [String(first.id), String(second.id)] : []),
    distance,
    maxLength,
    held,
    damagePerEndpoint: valid && !held && !alreadyResolved ? breakDamage : 0,
    resolution: !valid ? 'invalid' : alreadyResolved ? 'duplicate' : held ? 'held' : 'broken',
    applicationCount: valid && !alreadyResolved ? 1 : 0,
  });
}

export function gazeCheckState(time) {
  const spec = SPECS['gaze-check'];
  const t = localTime(time);
  if (t < spec.firstWarnAt) return 'idle';
  if (t < spec.turnAway[0]) return 'first-eye-warned';
  if (t < spec.turnAway[1]) return 'turning-away';
  if (t < spec.firstCheck[0]) return 'facing-away';
  if (t < spec.firstCheck[1]) return 'first-gaze-avoided';
  if (t < spec.secondWarnAt) return 'between-checks';
  if (t < spec.turnToward[0]) return 'second-eye-warned';
  if (t < spec.turnToward[1]) return 'turning-toward';
  if (t < spec.secondCheck[0]) return 'facing-source';
  if (t < spec.secondCheck[1]) return 'second-gaze-hit';
  if (t < spec.resetAt) return 'status-applied';
  return 'explicit-retry';
}

export function gazeCheckResolve({
  encounterId = 'kern-gaze-1',
  hitId = 'gaze-pulse-1',
  source = { x: 280, y: 315 },
  target = { id: 'tavi', position: { x: 280, y: 700 }, facingDegrees: 90, alive: true },
  halfAngle = 90,
  failureDamage = 90,
  alreadyResolved = false,
} = {}) {
  const valid =
    target &&
    target.id != null &&
    target.alive === true &&
    source &&
    Number.isFinite(source.x) &&
    Number.isFinite(source.y) &&
    target.position &&
    Number.isFinite(target.position.x) &&
    Number.isFinite(target.position.y) &&
    Number.isFinite(target.facingDegrees) &&
    Number.isFinite(halfAngle) &&
    halfAngle > 0 &&
    halfAngle <= 180 &&
    Number.isSafeInteger(failureDamage) &&
    failureDamage >= 0 &&
    Math.hypot(source.x - target.position.x, source.y - target.position.y) > 0;
  const bearing = valid
    ? (Math.atan2(source.y - target.position.y, source.x - target.position.x) * 180) / Math.PI
    : 0;
  const delta = valid ? ((((target.facingDegrees - bearing + 180) % 360) + 360) % 360) - 180 : 0;
  const looking = Boolean(valid && Math.abs(delta) <= halfAngle);
  return Object.freeze({
    encounterId: String(encounterId),
    hitId: String(hitId),
    targetId: valid ? String(target.id) : null,
    bearing,
    facingDegrees: valid ? target.facingDegrees : 0,
    halfAngle,
    looking,
    damage: valid && looking && !alreadyResolved ? failureDamage : 0,
    resolution: !valid ? 'invalid' : alreadyResolved ? 'duplicate' : looking ? 'hit' : 'avoided',
    applicationCount: valid && looking && !alreadyResolved ? 1 : 0,
  });
}

export function proximityDamageState(time) {
  const spec = SPECS['proximity-damage'];
  const t = localTime(time);
  if (t < spec.firstWarnAt) return 'idle';
  if (t < spec.moveFar[0]) return 'source-warned';
  if (t < spec.moveFar[1]) return 'moving-far';
  if (t < spec.firstCheck[0]) return 'far-position-held';
  if (t < spec.firstCheck[1]) return 'lower-damage-hit';
  if (t < spec.secondWarnAt) return 'first-recovery';
  if (t < spec.moveNear[0]) return 'second-source-warned';
  if (t < spec.moveNear[1]) return 'moving-near';
  if (t < spec.secondCheck[0]) return 'near-position-held';
  if (t < spec.secondCheck[1]) return 'higher-damage-hit';
  if (t < spec.resetAt) return 'second-recovery';
  return 'explicit-retry';
}

export function proximityDamageResolve({
  encounterId = 'kern-proximity-1',
  hitId = 'distance-pulse-1',
  source = { x: 280, y: 380 },
  target = { id: 'tavi', position: { x: 280, y: 790 }, alive: true },
  innerRadius = 140,
  outerRadius = 420,
  maxDamage = 90,
  minDamage = 10,
  alreadyResolved = false,
} = {}) {
  const valid =
    source &&
    Number.isFinite(source.x) &&
    Number.isFinite(source.y) &&
    target &&
    target.id != null &&
    target.alive === true &&
    target.position &&
    Number.isFinite(target.position.x) &&
    Number.isFinite(target.position.y) &&
    Number.isFinite(innerRadius) &&
    Number.isFinite(outerRadius) &&
    innerRadius >= 0 &&
    outerRadius > innerRadius &&
    Number.isSafeInteger(minDamage) &&
    Number.isSafeInteger(maxDamage) &&
    minDamage > 0 &&
    maxDamage >= minDamage;
  const distance = valid
    ? Math.hypot(source.x - target.position.x, source.y - target.position.y)
    : 0;
  const severity = valid ? 1 - clamp((distance - innerRadius) / (outerRadius - innerRadius)) : 0;
  const potentialDamage = valid ? Math.round(minDamage + (maxDamage - minDamage) * severity) : 0;
  return Object.freeze({
    encounterId: String(encounterId),
    hitId: String(hitId),
    targetId: valid ? String(target.id) : null,
    distance,
    severity,
    potentialDamage,
    damage: valid && !alreadyResolved ? potentialDamage : 0,
    resolution: !valid ? 'invalid' : alreadyResolved ? 'duplicate' : 'hit',
    applicationCount: valid && !alreadyResolved ? 1 : 0,
  });
}

export function tankSwapState(time) {
  const spec = SPECS['tank-swap'];
  const t = localTime(time);
  if (t < spec.firstWarnAt) return 'idle';
  if (t < spec.firstHit[0]) return 'first-owner-marked';
  if (t < spec.firstHit[1]) return 'first-buster';
  if (t < spec.swapWarnAt) return 'vulnerability-applied';
  if (t < spec.swapMove[0]) return 'handoff-signaled';
  if (t < spec.claimAt) return 'claim-in-progress';
  if (t < spec.secondWarnAt) return 'new-owner-confirmed';
  if (t < spec.secondHit[0]) return 'second-owner-marked';
  if (t < spec.secondHit[1]) return 'second-buster';
  if (t < spec.resetAt) return 'both-recover';
  return 'explicit-retry';
}

export function tankSwapResolve({
  encounterId = 'kern-tank-swap-1',
  hitId = 'buster-1',
  target = { id: 'tavi', health: 100, vulnerability: 0, alive: true },
  baseDamage = 35,
  repeatedDamage = 95,
  alreadyResolved = false,
} = {}) {
  const valid =
    typeof encounterId === 'string' &&
    encounterId.length > 0 &&
    typeof hitId === 'string' &&
    hitId.length > 0 &&
    target &&
    typeof target.id === 'string' &&
    target.id.length > 0 &&
    target.alive === true &&
    Number.isSafeInteger(target.health) &&
    target.health >= 0 &&
    Number.isSafeInteger(target.vulnerability) &&
    target.vulnerability >= 0 &&
    Number.isSafeInteger(baseDamage) &&
    baseDamage > 0 &&
    Number.isSafeInteger(repeatedDamage) &&
    repeatedDamage > baseDamage;
  const potentialDamage = valid ? (target.vulnerability ? repeatedDamage : baseDamage) : 0;
  const damage = valid && !alreadyResolved ? potentialDamage : 0;
  return Object.freeze({
    encounterId,
    hitId,
    targetId: valid ? target.id : null,
    potentialDamage,
    damage,
    healthAfter: valid ? Math.max(0, target.health - damage) : null,
    vulnerabilityAfter: valid ? target.vulnerability + Number(!alreadyResolved) : null,
    resolution: !valid
      ? 'invalid'
      : alreadyResolved
        ? 'duplicate'
        : damage >= target.health
          ? 'lethal'
          : 'hit',
    applicationCount: Number(valid && !alreadyResolved),
  });
}

export function debuffHandoffState(time) {
  const spec = SPECS['debuff-handoff'];
  const t = localTime(time);
  if (t < 0.7) return 'rune-cast';
  if (t < spec.firstApproach[0]) return 'first-carrier-marked';
  if (t < spec.firstPassAt) return 'first-approach';
  if (t < spec.firstRetreat[0]) return 'first-transfer';
  if (t < spec.secondApproach[0]) return 'new-carrier-protected';
  if (t < spec.secondPassAt) return 'second-approach';
  if (t < spec.secondRetreat[0]) return 'second-transfer';
  if (t < spec.resetAt) return 'stable-chain';
  return 'explicit-retry';
}

export function debuffHandoffResolve({
  encounterId = 'kern-debuff-handoff-1',
  transferId = 'pass-1',
  source = { id: 'player-1', alive: true, x: 250, y: 635 },
  receiver = { id: 'player-2', alive: true, x: 310, y: 635, immuneUntil: 0 },
  time = 2.25,
  expiresAt = 3,
  contactRadius = 76,
  duration = 3,
  returnImmunity = 1,
  alreadyResolved = false,
} = {}) {
  const valid =
    typeof encounterId === 'string' &&
    encounterId.length > 0 &&
    typeof transferId === 'string' &&
    transferId.length > 0 &&
    source?.alive === true &&
    receiver?.alive === true &&
    typeof source.id === 'string' &&
    source.id.length > 0 &&
    typeof receiver.id === 'string' &&
    receiver.id.length > 0 &&
    source.id !== receiver.id &&
    [
      source.x,
      source.y,
      receiver.x,
      receiver.y,
      receiver.immuneUntil,
      time,
      expiresAt,
      contactRadius,
      duration,
      returnImmunity,
    ].every(Number.isFinite) &&
    time >= 0 &&
    expiresAt > 0 &&
    contactRadius > 0 &&
    duration > 0 &&
    returnImmunity >= 0;
  const distance = valid ? Math.hypot(source.x - receiver.x, source.y - receiver.y) : null;
  const inRange = valid && distance <= contactRadius;
  const immune = valid && receiver.immuneUntil > time;
  const resolution = !valid
    ? 'invalid'
    : alreadyResolved
      ? 'duplicate'
      : time >= expiresAt
        ? 'expired'
        : immune
          ? 'immune'
          : !inRange
            ? 'out-of-range'
            : 'passed';
  return Object.freeze({
    encounterId,
    transferId,
    sourceId: valid ? source.id : null,
    receiverId: valid ? receiver.id : null,
    distance,
    ownerId: resolution === 'passed' ? receiver.id : valid ? source.id : null,
    expiresAt: resolution === 'passed' ? time + duration : valid ? expiresAt : null,
    sourceImmuneUntil: resolution === 'passed' ? time + returnImmunity : null,
    applicationCount: Number(resolution === 'passed'),
    resolution,
  });
}

export function debuffHandoffExpire({
  encounterId = 'kern-debuff-handoff-1',
  burstId = 'rune-expiry-1',
  owner = { id: 'player-1', alive: true, health: 100 },
  time = 3.7,
  expiresAt = 3.7,
  burstDamage = 80,
  alreadyResolved = false,
} = {}) {
  const valid =
    typeof encounterId === 'string' &&
    encounterId.length > 0 &&
    typeof burstId === 'string' &&
    burstId.length > 0 &&
    typeof owner?.id === 'string' &&
    owner.id.length > 0 &&
    owner.alive === true &&
    Number.isSafeInteger(owner.health) &&
    owner.health >= 0 &&
    Number.isFinite(time) &&
    Number.isFinite(expiresAt) &&
    Number.isSafeInteger(burstDamage) &&
    burstDamage > 0;
  const expired = valid && time >= expiresAt;
  const damage = expired && !alreadyResolved ? burstDamage : 0;
  return Object.freeze({
    encounterId,
    burstId,
    ownerId: valid ? owner.id : null,
    damage,
    healthAfter: valid ? Math.max(0, owner.health - damage) : null,
    applicationCount: Number(expired && !alreadyResolved),
    resolution: !valid
      ? 'invalid'
      : alreadyResolved
        ? 'duplicate'
        : expired
          ? 'expired'
          : 'pending',
  });
}

export function orderedTargetsState(time) {
  const spec = SPECS['ordered-targets'];
  const t = localTime(time);
  if (t < spec.revealAt) return 'assign';
  if (t < spec.hits[0]) return 'isolate';
  if (t < spec.hits[1]) return 'first-strike';
  if (t < spec.hits[2]) return 'second-strike';
  if (t < spec.resetAt) return 'third-strike';
  return 'reset';
}

export function orderedTargetsResolve({
  encounterId = 'kern-ordered-targets-1',
  strikeId = 'strike-1',
  expectedNumber = 1,
  selectedNumber = 1,
  assignedPlayerId = 'player-1',
  center = { x: 100, y: 625 },
  players = [
    { id: 'player-1', x: 100, y: 625, alive: true },
    { id: 'player-2', x: 280, y: 625, alive: true },
    { id: 'player-3', x: 460, y: 625, alive: true },
  ],
  radius = 72,
  bodyRadius = BLUEPRINT_PLAYER_RADIUS,
  intendedDamage = 25,
  overlapDamage = 80,
  alreadyResolved = false,
} = {}) {
  const valid =
    typeof encounterId === 'string' &&
    encounterId.length > 0 &&
    typeof strikeId === 'string' &&
    strikeId.length > 0 &&
    Number.isSafeInteger(expectedNumber) &&
    expectedNumber >= 1 &&
    Number.isSafeInteger(selectedNumber) &&
    selectedNumber >= 1 &&
    typeof assignedPlayerId === 'string' &&
    assignedPlayerId.length > 0 &&
    Number.isFinite(center?.x) &&
    Number.isFinite(center?.y) &&
    Array.isArray(players) &&
    players.length > 0 &&
    players.every(
      (player) =>
        typeof player?.id === 'string' &&
        player.id.length > 0 &&
        player.alive === true &&
        Number.isFinite(player.x) &&
        Number.isFinite(player.y),
    ) &&
    new Set(players.map((player) => player.id)).size === players.length &&
    Number.isFinite(radius) &&
    radius > 0 &&
    Number.isFinite(bodyRadius) &&
    bodyRadius >= 0 &&
    Number.isSafeInteger(intendedDamage) &&
    intendedDamage > 0 &&
    Number.isSafeInteger(overlapDamage) &&
    overlapDamage > intendedDamage;
  const assigned = valid ? players.find((player) => player.id === assignedPlayerId) : null;
  const resolution =
    !valid || !assigned
      ? 'invalid'
      : alreadyResolved
        ? 'duplicate'
        : selectedNumber !== expectedNumber
          ? 'out-of-order'
          : 'resolved';
  const occupants =
    resolution === 'resolved'
      ? players.filter(
          (player) => Math.hypot(player.x - center.x, player.y - center.y) <= radius + bodyRadius,
        )
      : [];
  return Object.freeze({
    encounterId,
    strikeId,
    expectedNumber,
    selectedNumber,
    assignedPlayerId,
    occupantIds: occupants.map((player) => player.id),
    damage: occupants.map((player) =>
      Object.freeze({
        playerId: player.id,
        amount: player.id === assignedPlayerId ? intendedDamage : overlapDamage,
      }),
    ),
    nextNumber: expectedNumber + Number(resolution === 'resolved'),
    applicationCount: Number(resolution === 'resolved'),
    resolution,
  });
}

export function pairingPolarityState(time) {
  const spec = SPECS['pairing-polarity'];
  const t = localTime(time);
  if (t < spec.revealAt) return 'unmarked';
  if (t < spec.move[1]) return 'pair';
  if (t < spec.resolveAt) return 'hold';
  if (t < spec.resetAt) return 'resolved';
  return 'reset';
}

export function pairingPolarityResolve({
  encounterId = 'kern-pairing-polarity-1',
  eventId = 'polarity-1',
  players = [
    { id: 'player-1', x: 132, y: 680, polarity: '+', alive: true },
    { id: 'player-2', x: 367, y: 680, polarity: '+', alive: true },
    { id: 'player-3', x: 193, y: 680, polarity: '−', alive: true },
    { id: 'player-4', x: 428, y: 680, polarity: '−', alive: true },
  ],
  zones = [
    { x: 162.5, y: 680 },
    { x: 397.5, y: 680 },
  ],
  radius = 74,
  bodyRadius = BLUEPRINT_PLAYER_RADIUS,
  alreadyResolved = false,
} = {}) {
  const valid =
    typeof encounterId === 'string' &&
    encounterId.length > 0 &&
    typeof eventId === 'string' &&
    eventId.length > 0 &&
    Array.isArray(players) &&
    players.length === 4 &&
    new Set(players.map((player) => player?.id)).size === 4 &&
    players.every(
      (player) =>
        typeof player?.id === 'string' &&
        player.id.length > 0 &&
        player.alive === true &&
        ['+', '−'].includes(player.polarity) &&
        Number.isFinite(player.x) &&
        Number.isFinite(player.y),
    ) &&
    Array.isArray(zones) &&
    zones.length === 2 &&
    zones.every((zone) => Number.isFinite(zone?.x) && Number.isFinite(zone?.y)) &&
    Number.isFinite(radius) &&
    radius > bodyRadius &&
    Number.isFinite(bodyRadius) &&
    bodyRadius >= 0;
  if (!valid || alreadyResolved)
    return Object.freeze({
      encounterId,
      eventId,
      resolution: !valid ? 'invalid' : 'duplicate',
      pairs: [],
      failedPlayerIds: [],
      applicationCount: 0,
    });
  const pairs = zones.map((zone) =>
    players
      .filter((player) => Math.hypot(player.x - zone.x, player.y - zone.y) + bodyRadius <= radius)
      .map((player) => player.id),
  );
  const assignedIds = pairs.flat();
  const success =
    pairs.every(
      (pair) =>
        pair.length === 2 &&
        players.find((player) => player.id === pair[0]).polarity !==
          players.find((player) => player.id === pair[1]).polarity,
    ) && new Set(assignedIds).size === 4;
  return Object.freeze({
    encounterId,
    eventId,
    resolution: success ? 'paired' : 'failed',
    pairs,
    failedPlayerIds: success ? [] : players.map((player) => player.id),
    applicationCount: 1,
  });
}

export function partySplitState(time) {
  const spec = SPECS['party-split'];
  const t = localTime(time);
  if (t < spec.revealAt) return 'together';
  if (t < spec.move[1]) return 'divide';
  if (t < spec.gateOpenAt) return 'work';
  if (t < spec.reunite[0]) return 'gate-open';
  if (t < spec.resetAt) return 'reunite';
  return 'reset';
}

export function partySplitResolve({
  encounterId = 'kern-party-split-1',
  eventId = 'gate-1',
  players = [
    { id: 'player-1', side: 'left', x: 130, y: 705, alive: true },
    { id: 'player-2', side: 'left', x: 205, y: 705, alive: true },
    { id: 'player-3', side: 'right', x: 355, y: 705, alive: true },
    { id: 'player-4', side: 'right', x: 430, y: 705, alive: true },
  ],
  tasks = { left: { completedAt: 2.6 }, right: { completedAt: 3.25 } },
  now = 3.45,
  openAt = 3.45,
  deadline = 3.6,
  dividerX = 280,
  bodyRadius = BLUEPRINT_PLAYER_RADIUS,
  alreadyResolved = false,
} = {}) {
  const valid =
    typeof encounterId === 'string' &&
    encounterId.length > 0 &&
    typeof eventId === 'string' &&
    eventId.length > 0 &&
    Array.isArray(players) &&
    players.length === 4 &&
    new Set(players.map((player) => player?.id)).size === 4 &&
    players.every(
      (player) =>
        typeof player?.id === 'string' &&
        player.id.length > 0 &&
        player.alive === true &&
        ['left', 'right'].includes(player.side) &&
        Number.isFinite(player.x) &&
        Number.isFinite(player.y),
    ) &&
    Number.isFinite(now) &&
    Number.isFinite(openAt) &&
    openAt >= 0 &&
    openAt <= deadline &&
    Number.isFinite(deadline) &&
    deadline > 0 &&
    Number.isFinite(dividerX) &&
    Number.isFinite(bodyRadius) &&
    bodyRadius >= 0 &&
    tasks &&
    typeof tasks === 'object' &&
    ['left', 'right'].every(
      (side) =>
        tasks[side] &&
        (tasks[side].completedAt === null || Number.isFinite(tasks[side].completedAt)),
    );
  if (!valid || alreadyResolved)
    return Object.freeze({
      encounterId,
      eventId,
      resolution: valid ? 'duplicate' : 'invalid',
      sideCounts: { left: 0, right: 0 },
      completedSides: [],
      gateOpen: false,
      applicationCount: 0,
    });
  const sideCounts = {
    left: players.filter((player) => player.side === 'left' && player.x + bodyRadius < dividerX)
      .length,
    right: players.filter((player) => player.side === 'right' && player.x - bodyRadius > dividerX)
      .length,
  };
  const assignmentsValid = sideCounts.left === 2 && sideCounts.right === 2;
  const completedSides = ['left', 'right'].filter(
    (side) =>
      tasks[side].completedAt !== null &&
      tasks[side].completedAt >= 0 &&
      tasks[side].completedAt <= now &&
      tasks[side].completedAt <= deadline,
  );
  const gateOpen = assignmentsValid && completedSides.length === 2 && now >= openAt;
  return Object.freeze({
    encounterId,
    eventId,
    sideCounts,
    completedSides,
    gateOpen,
    resolution: gateOpen ? 'opened' : now >= deadline ? 'failed' : 'pending',
    applicationCount: gateOpen || now >= deadline ? 1 : 0,
  });
}

const projectileRallyLegAt = (spec, time) => {
  const index = spec.legs.findIndex(({ start, end }) => time >= start && time < end);
  if (index < 0) return null;
  const leg = spec.legs[index];
  const progress = smooth((time - leg.start) / (leg.end - leg.start));
  return {
    index,
    owner: leg.owner,
    progress,
    position: {
      x: mix(leg.from[0], leg.to[0], progress),
      y: mix(leg.from[1], leg.to[1], progress),
    },
  };
};

const segmentIntersectsRect = (start, end, bounds) => {
  const delta = { x: end.x - start.x, y: end.y - start.y };
  let near = 0;
  let far = 1;
  const tests = [
    [-delta.x, start.x - bounds.left],
    [delta.x, bounds.right - start.x],
    [-delta.y, start.y - bounds.top],
    [delta.y, bounds.bottom - start.y],
  ];
  for (const [direction, distance] of tests) {
    if (Math.abs(direction) < 1e-9) {
      if (distance < 0) return false;
      continue;
    }
    const amount = distance / direction;
    if (direction < 0) {
      if (amount > far) return false;
      near = Math.max(near, amount);
    } else {
      if (amount < near) return false;
      far = Math.min(far, amount);
    }
  }
  return near <= far;
};

export function coverLineOfSightBlocked(time, value, radius = BLUEPRINT_PLAYER_RADIUS) {
  const spec = SPECS['cover-line-of-sight'];
  if (localTime(time) < spec.shadowAt) return false;
  const [x, y, width, height] = spec.pillar;
  const bounds = {
    left: x + spec.edgeMargin,
    right: x + width - spec.edgeMargin,
    top: y + spec.edgeMargin,
    bottom: y + height - spec.edgeMargin,
  };
  const source = point(spec.source);
  const samples = [
    value,
    { x: value.x, y: value.y - radius * 0.62 },
    { x: value.x, y: value.y + radius * 0.62 },
    { x: value.x - radius * 0.28, y: value.y },
    { x: value.x + radius * 0.28, y: value.y },
  ];
  return samples.every((sample) => segmentIntersectsRect(source, sample, bounds));
}

const pointInPolygon = (value, points) => {
  let inside = false;
  for (let index = 0, previous = points.length - 1; index < points.length; previous = index++) {
    const start = points[index];
    const end = points[previous];
    if (
      start.y > value.y !== end.y > value.y &&
      value.x < ((end.x - start.x) * (value.y - start.y)) / (end.y - start.y) + start.x
    )
      inside = !inside;
  }
  return inside;
};
const quadraticPoint = (start, control, end, amount) => {
  const t = clamp(amount);
  const inverse = 1 - t;
  return {
    x: inverse * inverse * start.x + 2 * inverse * t * control.x + t * t * end.x,
    y: inverse * inverse * start.y + 2 * inverse * t * control.y + t * t * end.y,
  };
};
const pointAlongPolyline = (points, amount) => {
  const progress = clamp(amount) * (points.length - 1);
  const index = Math.min(points.length - 2, Math.floor(progress));
  const localProgress = progress - index;
  return {
    x: mix(points[index].x, points[index + 1].x, localProgress),
    y: mix(points[index].y, points[index + 1].y, localProgress),
  };
};
const projectileLines = (boss, count, spread, length, opacity, offset = 0) =>
  Array.from({ length: count }, (_, index) => {
    const amount = count === 1 ? 0.5 : index / (count - 1);
    const angle = Math.PI / 2 + mix(-spread, spread, amount) + offset;
    const end = polar(boss, length, angle);
    return line(boss.x, boss.y, end.x, end.y, opacity, 'signal', 7);
  });

// Preserve primitive indices used by the player while hiding legacy room trim.
// Threats, response paths, source markers, walls, and platforms remain visible.
const DECORATIVE_PRIMITIVE_INDICES = Object.freeze({
  'interruptible-wind-up': [0, 1],
  'loadout-adaptation': [0, 1, 2],
  'wind-up': [0, 1],
  'active-phase': [0, 1, 2],
  recovery: [0, 1, 2],
  'survival-phase': [0, 1],
  teleport: [0, 1],
  'forced-scrolling': [0, 1, 2],
  'chase-herding': [0, 1],
  'escape-phase': [0, 1],
  'relocated-arena': [0, 3, 4, 5, 14],
  'control-mode-shift': [0, 1, 2, 3],
  'boss-as-terrain': [0, 1],
  'forced-inertia': [0, 1, 2, 3],
  'wraparound-projectile': [0],
  'beat-synced-attack': [0],
  'secondary-cues-invisibility': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  'sound-detection': [0, 2, 3, 4, 5],
  'objective-linked-invulnerability': [0],
  'wave-clear-objective': [2],
  'environmental-weapon': [2],
  'encounter-specific-tool': [2],
  'player-controlled-boss': [2, 3],
  'on-hit-healing': [0],
  'self-heal-cast': [0],
  'external-healing-source': [0],
  'damage-rate-cap': [0],
  'loadout-mirror': [0],
  'moveset-shapeshifting': [0, 1],
  'ally-theft': [0],
  'false-death': [0],
  'action-reactive-punish': [0],
  'run-history-manifestation': [0],
  'real-time-progression': [0],
  'interface-interaction': [0],
  'world-state-variant': [0],
  'party-size-scaling': [0],
  'kill-order-inheritance': [0, 3],
  'shared-group-health': [0, 4, 5, 6],
  'coordinated-duo-attack': [0, 2],
  'stack-damage': [0, 1, 2],
  'personal-spread': [0, 1, 2],
  'tower-soak': [0, 1, 2],
  'entity-tether': [0, 1, 2],
  'gaze-check': [0],
  'tank-swap': [0],
  'debuff-handoff': [0],
  'ordered-targets': [0],
  'pairing-polarity': [0],
  'party-split': [0],
  'partner-revival': [0, 2, 4, 5],
  'weak-point': [0, 1, 2],
  'fight-phase': [0, 1, 2],
  enrage: [0, 1],
});

function primitivesFor(spec, frame) {
  const { mode } = spec;
  const { boss, player, prepare, action, recover, phase } = frame;
  const active = phase === 1 ? 1 : phase === 0 ? 0.22 + prepare * 0.28 : 1 - recover;
  const preview = phase === 0 ? 0.28 + prepare * 0.3 : phase === 1 ? 0.08 : 0;
  if (mode === 'delayed-activation') {
    const [x, y] = spec.rune;
    const countdown = clamp(
      (frame.time - BLUEPRINT_PHASE_ENDS[0]) / (spec.activatesAt - BLUEPRINT_PHASE_ENDS[0]),
    );
    const lit = frame.dangerActive;
    const visible = phase === 2 ? 1 - recover : phase === 0 ? 0.4 + 0.5 * prepare : 1;
    return [
      path(
        `M ${boss.x + 33} ${boss.y + 28} L ${boss.x + 46} ${boss.y + 34} L ${boss.x + 44} ${boss.y + 51} L ${boss.x + 36} ${boss.y + 42} Z`,
        phase === 0 ? 0.5 + prepare * 0.45 : 0,
        'accent',
        2,
        0.8,
      ),
      circle(x, y, spec.radius, visible, lit ? 'signal' : 'accent', lit ? 5 : 2, lit ? 0.13 : 0.02),
      circle(x, y, mix(118, spec.radius, countdown), phase === 1 && !lit ? 0.75 : 0, 'accent', 3),
      path(
        `M ${x - 19} ${y + 20} L ${x - 15} ${y - 8} L ${x - 4} ${y - 29} L ${x + 6} ${y - 18} L ${x + 14} ${y - 25} L ${x + 21} ${y + 15} L ${x + 4} ${y + 27} Z`,
        visible,
        'muted',
        2,
        lit ? 0.96 : 0.7,
      ),
      ...Array.from({ length: 8 }, (_, index) => {
        const angle =
          (index * Math.PI) / 4 + [-0.08, 0.07, -0.04, 0.11, -0.06, 0.04, -0.09, 0.08][index];
        const distance = [56, 59, 54, 57, 55, 60, 53, 58][index];
        const markerX = x + Math.cos(angle) * distance;
        const markerY = y + Math.sin(angle) * distance;
        const rise = lit ? [22, 27, 19, 25, 21, 26, 18, 24][index] : 8;
        return path(
          `M ${markerX - 8} ${markerY + 7} L ${markerX - 5} ${markerY - rise + 6} L ${markerX + 1} ${markerY - rise} L ${markerX + 6} ${markerY - rise + 8} L ${markerX + 9} ${markerY + 7} Z`,
          visible * (lit ? 0.98 : 0.46 + countdown * 0.35),
          'muted',
          2,
          lit ? 0.95 : 0.59,
        );
      }),
      path(
        `M ${x - 4} ${y - 25} L ${x + 4} ${y - 6} L ${x + 18} ${y + 13} M ${x + 4} ${y - 6} L ${x - 13} ${y + 12}`,
        visible * (lit ? 1 : 0.5 + countdown * 0.35),
        lit ? 'signal' : 'accent',
        2,
      ),
    ];
  }
  if (mode === 'speed-change') {
    const accelerating = frame.time >= spec.switchAt && frame.time < spec.finishAt;
    const moving = frame.time >= BLUEPRINT_PHASE_ENDS[0] && frame.time < spec.finishAt;
    const lane = phase === 0 ? 0.36 + prepare * 0.35 : moving ? 0.28 : 0;
    return [
      {
        ...rect(
          73,
          spec.laneY - spec.collisionRadius,
          429,
          spec.collisionRadius * 2,
          lane,
          'accent',
          0.16,
        ),
        width: 0,
      },
      path(
        `M ${spec.switchX} ${spec.laneY - 49} L ${spec.switchX + 26} ${spec.laneY} L ${spec.switchX} ${spec.laneY + 49} L ${spec.switchX - 26} ${spec.laneY} Z M ${spec.switchX} ${spec.laneY - 24} L ${spec.switchX + 12} ${spec.laneY} L ${spec.switchX} ${spec.laneY + 24} L ${spec.switchX - 12} ${spec.laneY} Z`,
        phase === 0 ? 0.45 + prepare * 0.32 : moving ? 0.84 : 0,
        accelerating ? 'signal' : 'accent',
        0,
        0.72,
      ),
      ...[-25, 0, 25].map((offset, index) =>
        line(
          boss.x - (accelerating ? 125 : 65) + index * 12,
          boss.y + offset,
          boss.x - 38,
          boss.y + offset,
          moving ? (accelerating ? 0.86 : 0.37) : 0,
          accelerating ? 'signal' : 'accent',
          accelerating ? 9 : 5,
        ),
      ),
    ];
  }
  if (mode === 'limited-spread') {
    const origin = point(spec.emitter);
    const edgeLength = 590;
    const left = polar(origin, edgeLength, Math.PI / 2 - spec.coneHalfAngle);
    const right = polar(origin, edgeLength, Math.PI / 2 + spec.coneHalfAngle);
    const warning = phase === 0 ? 0.35 + prepare * 0.4 : phase === 1 ? 0.27 : 0;
    const shots = limitedSpreadShots(spec, frame.time);
    return [
      path(
        `M ${origin.x} ${origin.y} L ${left.x} ${left.y} L ${right.x} ${right.y} Z`,
        warning,
        'accent',
        0,
        0.2,
      ),
      path(
        `M ${origin.x - 26} ${origin.y - 24} L ${origin.x + 26} ${origin.y - 24} L ${origin.x + 18} ${origin.y + 18} L ${origin.x - 18} ${origin.y + 18} Z M ${origin.x - 14} ${origin.y + 9} L ${origin.x + 14} ${origin.y + 9} L ${origin.x + 10} ${origin.y + 29} L ${origin.x - 10} ${origin.y + 29} Z`,
        phase === 2 ? 1 - recover : 0.85,
        'accent',
        0,
        0.75,
      ),
      ...shots.map((shot) =>
        circle(shot.x, shot.y, shot.radius, shot.active ? 0.98 : 0, 'signal', 0, 0.82),
      ),
      circle(
        origin.x,
        origin.y,
        34,
        phase === 1
          ? Math.max(
              ...spec.releases.map((release) =>
                pulse(clamp(Math.abs(frame.time - release) / 0.16)),
              ),
            ) * 0.8
          : 0,
        'signal',
        7,
      ),
    ];
  }
  if (mode === 'directional-shield') {
    const guarded = frame.time >= BLUEPRINT_PHASE_ENDS[0] && frame.time < spec.guardEnd;
    const arcStart = spec.guardAngle - spec.guardHalfAngle;
    const arcEnd = spec.guardAngle + spec.guardHalfAngle;
    const frontFlash = strikePulse(frame.time, spec.frontStrike);
    const sideFlash = strikePulse(frame.time, spec.sideStrike);
    const leftEdge = polar(boss, 160, arcStart);
    const rightEdge = polar(boss, 160, arcEnd);
    return [
      path('M 38 94 H 522 V 878 H 38 Z M 57 260 H 503 V 878 H 57 Z', 0.37, 'muted', 0, 0.56),
      path(
        'M 55 117 H 131 V 353 H 55 Z M 429 117 H 505 V 353 H 429 Z M 146 120 H 414 V 154 H 146 Z M 64 553 L 280 530 L 496 553 V 589 L 280 562 L 64 589 Z M 64 748 L 280 717 L 496 748 V 793 L 280 756 L 64 793 Z',
        0.41,
        'accent',
        0,
        0.56,
      ),
      path(
        'M 70 643 L 280 617 L 490 643 V 657 L 280 632 L 70 657 Z M 74 836 L 280 806 L 486 836 V 849 L 280 821 L 74 849 Z',
        0.34,
        'muted',
        0,
        0.75,
      ),
      path(
        `M ${boss.x} ${boss.y} L ${leftEdge.x} ${leftEdge.y} A 160 160 0 0 1 ${rightEdge.x} ${rightEdge.y} Z`,
        guarded ? 0.34 : phase === 0 ? 0.12 + prepare * 0.16 : 0,
        'accent',
        2,
        0.05,
      ),
      path(
        arcPath(boss, 80, arcStart, arcEnd),
        guarded ? 0.98 : phase === 0 ? 0.3 + prepare * 0.5 : 0,
        'accent',
        11,
      ),
      path(
        `M ${boss.x - 37} ${boss.y + 12} Q ${boss.x} ${boss.y - 2} ${boss.x + 37} ${boss.y + 12} L ${boss.x + 31} ${boss.y + 61} Q ${boss.x} ${boss.y + 80} ${boss.x - 31} ${boss.y + 61} Z`,
        phase === 0 ? 0.45 + prepare * 0.42 : phase === 1 ? 0.9 : 0.55,
        'accent',
        0,
        0.78,
      ),
      line(player.x, player.y - 35, boss.x, boss.y + 60, frontFlash, 'signal', 6),
      circle(boss.x, boss.y + 60, 18 + frontFlash * 19, frontFlash, 'signal', 7),
      line(player.x - 35, player.y, boss.x + 47, boss.y, sideFlash, 'signal', 6),
      circle(boss.x + 47, boss.y, 14 + sideFlash * 19, sideFlash, 'signal', 7),
    ];
  }
  if (mode === 'damage-type-resistance') {
    const slashFlash = strikePulse(frame.time, spec.slashStrike);
    const thrustFlash = strikePulse(frame.time, spec.thrustStrike);
    const slashRecorded = frame.time >= spec.slashStrike ? 1 : 0;
    const thrustRecorded = frame.time >= spec.thrustStrike ? 1 : 0;
    return [
      path('M 38 94 H 522 V 878 H 38 Z M 56 259 H 504 V 878 H 56 Z', 0.37, 'muted', 0, 0.56),
      path(
        'M 55 116 H 131 V 345 H 55 Z M 429 116 H 505 V 345 H 429 Z M 146 120 H 414 V 153 H 146 Z M 64 555 L 280 531 L 496 555 V 592 L 280 563 L 64 592 Z M 64 762 L 280 729 L 496 762 V 806 L 280 769 L 64 806 Z',
        0.41,
        'accent',
        0,
        0.56,
      ),
      path(
        'M 342 282 H 458 V 360 H 342 Z M 351 290 H 449 V 299 H 351 Z M 351 348 H 449 V 356 H 351 Z M 74 840 L 280 809 L 486 840 V 853 L 280 825 L 74 853 Z',
        0.4,
        'muted',
        0,
        0.76,
      ),
      circle(boss.x, boss.y, 79, 0.36 + 0.08 * Math.sin(frame.time * 2), 'accent', 3),
      path(
        `M ${player.x - 10} ${player.y - 62} Q ${boss.x + 100} ${boss.y - 88} ${boss.x + 45} ${boss.y - 10}`,
        slashFlash,
        'accent',
        10,
      ),
      circle(boss.x + 45, boss.y - 10, 10 + slashFlash * 8, slashFlash, 'muted', 4),
      line(player.x - 28, player.y, boss.x + 45, boss.y - 10, thrustFlash, 'signal', 9),
      circle(boss.x + 45, boss.y - 10, 16 + thrustFlash * 20, thrustFlash, 'signal', 7),
      rect(350, 302, 100, 12, 0.36, 'muted', 0.06),
      rect(350, 302, 20 * slashRecorded, 12, slashRecorded, 'accent', 0.8),
      rect(350, 332, 100, 12, 0.36, 'muted', 0.06),
      rect(350, 332, 100 * thrustRecorded, 12, thrustRecorded, 'signal', 0.8),
      line(328, 301, 338, 315, 0.72, 'accent', 5),
      line(328, 338, 340, 338, 0.72, 'signal', 5),
      path(
        `M ${boss.x} ${boss.y - 88} L ${boss.x + 9} ${boss.y - 79} L ${boss.x} ${boss.y - 70} L ${boss.x - 9} ${boss.y - 79} Z M ${boss.x - 88} ${boss.y} L ${boss.x - 79} ${boss.y - 9} L ${boss.x - 70} ${boss.y} L ${boss.x - 79} ${boss.y + 9} Z M ${boss.x} ${boss.y + 70} L ${boss.x + 9} ${boss.y + 79} L ${boss.x} ${boss.y + 88} L ${boss.x - 9} ${boss.y + 79} Z`,
        0.44,
        'accent',
        0,
        0.68,
      ),
    ];
  }
  if (mode === 'situational-immunity') {
    const protectedBoss = situationalImmunityOutcome(frame.time) === 'immune';
    const blockedFlash = strikePulse(frame.time, spec.blockedStrike);
    const wardFlash = strikePulse(frame.time, spec.wardStrike);
    const openFlash = strikePulse(frame.time, spec.openStrike);
    const ward = point(spec.ward);
    return [
      path('M 37 94 H 523 V 878 H 37 Z M 57 262 H 503 V 878 H 57 Z', 0.36, 'muted', 0, 0.56),
      path(
        'M 55 117 H 132 V 350 H 55 Z M 428 117 H 505 V 350 H 428 Z M 147 121 H 413 V 155 H 147 Z M 64 543 L 280 521 L 496 543 V 579 L 280 552 L 64 579 Z M 64 757 L 280 726 L 496 757 V 803 L 280 765 L 64 803 Z',
        0.41,
        'accent',
        0,
        0.56,
      ),
      path(
        'M 379 235 H 441 V 272 H 379 Z M 393 272 H 427 V 309 H 393 Z M 380 309 H 440 V 343 H 380 Z M 72 839 L 280 809 L 488 839 V 852 L 280 824 L 72 852 Z',
        0.4,
        'muted',
        0,
        0.76,
      ),
      circle(boss.x, boss.y, 88, protectedBoss ? 0.72 : 0.08, 'accent', 5, 0.11),
      path(
        `M ${ward.x} ${ward.y - 25} L ${ward.x + 22} ${ward.y} L ${ward.x} ${ward.y + 25} L ${ward.x - 22} ${ward.y} Z`,
        protectedBoss ? 0.82 : 0.18,
        'accent',
        0,
        0.78,
      ),
      line(
        ward.x - 9,
        ward.y - 10,
        ward.x + 9,
        ward.y + 10,
        protectedBoss ? 0.9 : 0.16,
        'accent',
        6,
      ),
      line(
        ward.x + 9,
        ward.y - 10,
        ward.x - 9,
        ward.y + 10,
        protectedBoss ? 0.9 : 0.16,
        'accent',
        6,
      ),
      line(
        ward.x,
        ward.y + 25,
        boss.x + 64,
        boss.y - 35,
        protectedBoss ? 0.44 : 0.05,
        'accent',
        4,
        '7 8',
      ),
      line(player.x - 35, player.y - 12, boss.x + 80, boss.y - 12, blockedFlash, 'muted', 8),
      circle(boss.x + 80, boss.y - 12, 19 + blockedFlash * 15, blockedFlash, 'muted', 7),
      line(player.x - 23, player.y - 38, ward.x, ward.y, wardFlash, 'signal', 8),
      circle(ward.x, ward.y, 16 + wardFlash * 17, wardFlash, 'signal', 7),
      line(player.x - 35, player.y - 12, boss.x + 38, boss.y - 12, openFlash, 'signal', 8),
      circle(boss.x + 38, boss.y - 12, 18 + openFlash * 19, openFlash, 'signal', 7),
    ];
  }
  if (mode === 'part-break') {
    const launcher = point(spec.launcher);
    const detached = { x: 446, y: 560 };
    const falling = smooth((frame.time - spec.breakAt) / 0.42);
    const repairing = smooth((frame.time - spec.repairStart) / (spec.repairEnd - spec.repairStart));
    const part =
      frame.time < spec.breakAt
        ? launcher
        : frame.time < spec.repairStart
          ? { x: mix(launcher.x, detached.x, falling), y: mix(launcher.y, detached.y, falling) }
          : {
              x: mix(detached.x, launcher.x, repairing),
              y: mix(detached.y, launcher.y, repairing),
            };
    const liveShot = frame.time >= spec.firstShot[0] && frame.time < spec.firstShot[1];
    const breakFlash = strikePulse(frame.time, spec.breakAt);
    const failedShot = strikePulse(frame.time, spec.secondAttempt, 0.3);
    return [
      path('M 37 94 H 523 V 878 H 37 Z M 56 262 H 504 V 878 H 56 Z', 0.37, 'muted', 0, 0.56),
      path(
        'M 55 117 H 129 V 344 H 55 Z M 431 117 H 505 V 344 H 431 Z M 143 120 H 417 V 154 H 143 Z M 62 592 L 280 566 L 498 592 V 635 L 280 604 L 62 635 Z M 62 772 L 280 739 L 498 772 V 815 L 280 778 L 62 815 Z',
        0.41,
        'accent',
        0,
        0.56,
      ),
      path(
        'M 401 565 L 446 546 L 493 565 L 485 583 L 409 583 Z M 70 847 L 280 816 L 490 847 V 859 L 280 831 L 70 859 Z',
        0.34,
        'muted',
        0,
        0.76,
      ),
      line(boss.x + 31, boss.y - 4, launcher.x, launcher.y, 0.75, 'muted', 8),
      circle(launcher.x, launcher.y, 17, partBreakCanFire(frame.time) ? 0.55 : 0.36, 'accent', 5),
      path(
        `M ${part.x - 20} ${part.y - 27} L ${part.x + 16} ${part.y - 24} L ${part.x + 28} ${part.y} L ${part.x + 14} ${part.y + 25} L ${part.x - 20} ${part.y + 24} L ${part.x - 28} ${part.y} Z M ${part.x + 15} ${part.y - 11} L ${part.x + 45} ${part.y - 8} L ${part.x + 45} ${part.y + 8} L ${part.x + 15} ${part.y + 11} Z`,
        0.94,
        partBreakCanFire(frame.time) ? 'accent' : 'muted',
        0,
        0.78,
      ),
      circle(part.x, part.y, 10, 0.9, partBreakCanFire(frame.time) ? 'signal' : 'muted', 4, 0.55),
      line(
        launcher.x + 28,
        launcher.y,
        spec.shotEnd[0],
        spec.shotEnd[1],
        frame.time < spec.firstShot[0] ? 0.16 + 0.3 * prepare : 0,
        'accent',
        5,
        '10 11',
      ),
      line(
        launcher.x + 28,
        launcher.y,
        spec.shotEnd[0],
        spec.shotEnd[1],
        liveShot ? 0.95 : 0,
        'signal',
        spec.beamHalfWidth * 2,
      ),
      line(player.x - 24, player.y - 34, launcher.x, launcher.y, breakFlash, 'signal', 8),
      circle(launcher.x, launcher.y, 19 + breakFlash * 20, breakFlash, 'signal', 7),
      circle(launcher.x, launcher.y, 14 + failedShot * 14, failedShot, 'muted', 5),
    ];
  }
  if (mode === 'attack-reflection') {
    const outgoing = frame.time >= spec.outgoing[0] && frame.time < spec.outgoing[1];
    const reflected = frame.time >= spec.reflected[0] && frame.time < spec.reflected[1];
    const outgoingProgress = clamp(
      (frame.time - spec.outgoing[0]) / (spec.outgoing[1] - spec.outgoing[0]),
    );
    const reflectedProgress = clamp(
      (frame.time - spec.reflected[0]) / (spec.reflected[1] - spec.reflected[0]),
    );
    const lower =
      smooth((frame.time - spec.mirrorLowered) / 0.25) *
      (1 - smooth((frame.time - spec.mirrorRaised) / 0.35));
    const mirror = { x: spec.mirror[0], y: spec.mirror[1] + 92 * lower };
    const returnedX = mix(spec.mirror[0], 545, reflectedProgress);
    const impact = strikePulse(frame.time, spec.outgoing[1], 0.24);
    const swordHit = strikePulse(frame.time, spec.meleeStrike, 0.3);
    return [
      path('M 37 94 H 523 V 878 H 37 Z M 57 265 H 503 V 878 H 57 Z', 0.36, 'muted', 0, 0.56),
      path(
        'M 55 118 H 132 V 345 H 55 Z M 428 118 H 505 V 345 H 428 Z M 147 121 H 413 V 155 H 147 Z M 63 495 L 280 477 L 497 495 V 534 L 280 510 L 63 534 Z M 63 713 L 280 685 L 497 713 V 757 L 280 724 L 63 757 Z',
        0.41,
        'accent',
        0,
        0.56,
      ),
      path(
        'M 65 380 H 496 V 395 H 65 Z M 65 813 L 280 782 L 496 813 V 829 L 280 801 L 65 829 Z',
        0.32,
        'muted',
        0,
        0.7,
      ),
      line(
        spec.swordBoltStart[0],
        spec.swordBoltStart[1],
        mirror.x,
        spec.mirror[1],
        0.2,
        'accent',
        4,
        '8 12',
      ),
      path(
        `M ${mirror.x - 20} ${mirror.y - 37} L ${mirror.x + 15} ${mirror.y - 30} L ${mirror.x + 24} ${mirror.y} L ${mirror.x + 15} ${mirror.y + 30} L ${mirror.x - 20} ${mirror.y + 37} L ${mirror.x - 28} ${mirror.y} Z`,
        0.88,
        frame.time < spec.mirrorLowered || frame.time >= spec.mirrorRaised ? 'accent' : 'muted',
        0,
        0.72,
      ),
      circle(mirror.x, mirror.y, 13, 0.88, 'signal', 5, 0.27),
      circle(
        mix(spec.swordBoltStart[0], spec.mirror[0], outgoingProgress),
        spec.mirror[1],
        11,
        outgoing ? 0.95 : 0,
        'accent',
        6,
        0.33,
      ),
      circle(spec.mirror[0], spec.mirror[1], 20 + impact * 22, impact, 'signal', 6),
      line(
        spec.mirror[0],
        spec.mirror[1],
        returnedX,
        spec.mirror[1],
        reflected ? 0.55 : 0,
        'signal',
        6,
      ),
      circle(returnedX, spec.mirror[1], spec.boltRadius, reflected ? 0.97 : 0, 'signal', 6, 0.32),
      line(player.x - 25, player.y - 28, boss.x + 46, boss.y - 19, swordHit, 'accent', 8),
      circle(boss.x + 46, boss.y - 19, 17 + 16 * swordHit, swordHit, 'signal', 6),
    ];
  }
  if (mode === 'counter-stance') {
    const guarded =
      (frame.time >= spec.firstGuard[0] && frame.time < spec.firstGuard[1]) ||
      (frame.time >= spec.secondGuard[0] && frame.time < spec.secondGuard[1]);
    const firstRaised =
      smooth((frame.time - 0.42) / 0.3) * (1 - smooth((frame.time - spec.firstGuard[1]) / 0.24));
    const secondRaised =
      smooth((frame.time - 3.28) / 0.3) * (1 - smooth((frame.time - spec.secondGuard[1]) / 0.24));
    const guardOpacity = 0.28 + 0.66 * Math.max(firstRaised, secondRaised);
    const parryFlash = strikePulse(frame.time, spec.parriedStrike, 0.3);
    const counterPreview = frame.time >= spec.firstGuard[1] && frame.time < spec.riposte[0];
    const counterLive = frame.time >= spec.riposte[0] && frame.time < spec.riposte[1];
    const openHit = strikePulse(frame.time, spec.openStrike, 0.3);
    return [
      path('M 38 94 H 522 V 878 H 38 Z M 57 258 H 503 V 878 H 57 Z', 0.37, 'muted', 0, 0.56),
      path(
        'M 57 116 H 132 V 355 H 57 Z M 428 116 H 503 V 355 H 428 Z M 148 120 H 412 V 154 H 148 Z M 64 529 L 280 509 L 496 529 V 565 L 280 541 L 64 565 Z M 64 722 L 280 694 L 496 722 V 767 L 280 735 L 64 767 Z',
        0.41,
        'accent',
        0,
        0.56,
      ),
      path(
        'M 79 615 H 194 L 177 642 H 96 Z M 366 615 H 481 L 464 642 H 383 Z M 81 825 L 280 797 L 479 825 V 840 L 280 813 L 81 840 Z',
        0.35,
        'muted',
        0,
        0.74,
      ),
      path(
        `M 328 375 L 355 388 L 360 425 L 346 454 L 324 443 L 336 420 Z`,
        guardOpacity,
        guarded ? 'accent' : 'muted',
        0,
        0.76,
      ),
      circle(344, 416, 14, guardOpacity, 'signal', 5, 0.25),
      line(player.x - 27, player.y - 30, 345, 421, parryFlash, 'accent', 8),
      circle(345, 421, 18 + 19 * parryFlash, parryFlash, 'signal', 6),
      line(
        spec.counterStart[0],
        spec.counterStart[1],
        spec.counterEnd[0],
        spec.counterEnd[1],
        counterPreview ? 0.45 : 0,
        'accent',
        5,
        '9 10',
      ),
      line(
        spec.counterStart[0],
        spec.counterStart[1],
        spec.counterEnd[0],
        spec.counterEnd[1],
        counterLive ? 0.92 : 0,
        'signal',
        spec.counterHalfWidth * 2,
      ),
      line(player.x - 28, player.y - 32, 344, 416, openHit, 'accent', 8),
      circle(344, 416, 17 + openHit * 17, openHit, 'signal', 6),
    ];
  }
  if (mode === 'absorption-power-up') {
    const core = point(spec.core);
    const charge = absorptionCharge(frame.time);
    const accepting = frame.time >= 0.6 && frame.time < spec.chargeWindup;
    const primed = frame.time >= spec.chargeWindup && frame.time < spec.spentAt;
    const firstTravel = frame.time >= spec.firstPulse[0] && frame.time < spec.firstPulse[1];
    const secondTravel = frame.time >= spec.secondPulse[0] && frame.time < spec.secondPulse[1];
    const firstProgress = smooth(
      (frame.time - spec.firstPulse[0]) / (spec.firstPulse[1] - spec.firstPulse[0]),
    );
    const secondProgress = smooth(
      (frame.time - spec.secondPulse[0]) / (spec.secondPulse[1] - spec.secondPulse[0]),
    );
    const absorbFlash = Math.max(
      strikePulse(frame.time, spec.firstPulse[1], 0.26),
      strikePulse(frame.time, spec.secondPulse[1], 0.26),
    );
    const preview = frame.time >= spec.chargeWindup && frame.time < spec.shockwave[0];
    const live = frame.dangerActive;
    const openHit = strikePulse(frame.time, spec.openStrike, 0.3);
    return [
      path('M 38 94 H 522 V 878 H 38 Z M 58 259 H 502 V 878 H 58 Z', 0.36, 'muted', 0, 0.56),
      path(
        'M 55 116 H 133 V 359 H 55 Z M 427 116 H 505 V 359 H 427 Z M 148 120 H 412 V 154 H 148 Z M 67 550 L 280 524 L 493 550 V 584 L 280 553 L 67 584 Z M 67 759 L 280 726 L 493 759 V 803 L 280 765 L 67 803 Z',
        0.4,
        'accent',
        0,
        0.58,
      ),
      path(
        'M 70 661 L 181 635 L 193 650 L 70 682 Z M 490 661 L 379 635 L 367 650 L 490 682 Z M 200 853 L 280 831 L 360 853 V 865 L 280 844 L 200 865 Z',
        0.36,
        'muted',
        0,
        0.74,
      ),
      path(
        `M ${core.x} ${core.y - 29} L ${core.x + 26} ${core.y - 14} L ${core.x + 26} ${core.y + 14} L ${core.x} ${core.y + 29} L ${core.x - 26} ${core.y + 14} L ${core.x - 26} ${core.y - 14} Z`,
        accepting || primed ? 0.94 : 0.34,
        accepting || primed ? 'accent' : 'muted',
        0,
        0.68,
      ),
      circle(core.x - 10, core.y - 4, 6, charge >= 1 ? 0.96 : 0.25, 'signal', 3, 0.52),
      circle(core.x + 10, core.y - 4, 6, charge >= 2 ? 0.96 : 0.25, 'signal', 3, 0.52),
      line(
        spec.swordStart[0],
        spec.swordStart[1],
        core.x,
        core.y,
        firstTravel ? 0.3 : 0,
        'accent',
        3,
        '7 9',
      ),
      circle(
        mix(spec.swordStart[0], core.x, firstProgress),
        mix(spec.swordStart[1], core.y, firstProgress),
        10,
        firstTravel ? 0.96 : 0,
        'accent',
        4,
        0.3,
      ),
      line(
        spec.swordStart[0],
        spec.swordStart[1],
        core.x,
        core.y,
        secondTravel ? 0.3 : 0,
        'accent',
        3,
        '7 9',
      ),
      circle(
        mix(spec.swordStart[0], core.x, secondProgress),
        mix(spec.swordStart[1], core.y, secondProgress),
        10,
        secondTravel ? 0.96 : 0,
        'accent',
        4,
        0.3,
      ),
      circle(core.x, core.y, 30 + 19 * absorbFlash, absorbFlash, 'signal', 5),
      circle(boss.x, boss.y, spec.shockwaveRadius, preview ? 0.48 : 0, 'accent', 4, 0.08, '10 10'),
      circle(boss.x, boss.y, spec.shockwaveRadius, live ? 0.88 : 0, 'signal', 9, 0.16),
      line(player.x - 28, player.y - 31, core.x, core.y, openHit, 'accent', 8),
      circle(core.x, core.y, 17 + 17 * openHit, openHit, 'signal', 5),
    ];
  }
  if (mode === 'interruptible-wind-up') {
    const firstOpen = frame.time >= spec.firstWindup[0] && frame.time < spec.interruptAt;
    const secondOpen = frame.time >= spec.secondWindup[0] && frame.time < spec.release[0];
    const interrupted = frame.time >= spec.interruptAt && frame.time < spec.staggerEnd;
    const preview = firstOpen || secondOpen;
    const live = frame.dangerActive;
    const firstProgress = clamp(
      (frame.time - spec.firstWindup[0]) / (spec.firstWindup[1] - spec.firstWindup[0]),
    );
    const secondProgress = clamp(
      (frame.time - spec.secondWindup[0]) / (spec.release[0] - spec.secondWindup[0]),
    );
    const gaugeProgress = firstOpen ? firstProgress : secondOpen ? secondProgress : 0;
    const interruptFlash = strikePulse(frame.time, spec.interruptAt, 0.34);
    return [
      path('M 38 94 H 522 V 878 H 38 Z M 55 272 H 505 V 878 H 55 Z', 0.37, 'muted', 0, 0.56),
      path(
        'M 57 116 H 132 V 338 H 57 Z M 428 116 H 503 V 338 H 428 Z M 147 119 H 413 V 153 H 147 Z M 58 623 L 280 595 L 502 623 V 658 L 280 627 L 58 658 Z M 58 792 L 280 760 L 502 792 V 834 L 280 797 L 58 834 Z',
        0.41,
        'accent',
        0,
        0.56,
      ),
      path(
        'M 280 337 L 378 372 L 414 430 L 378 488 L 280 523 L 182 488 L 146 430 L 182 372 Z M 280 359 L 355 386 L 385 430 L 355 474 L 280 501 L 205 474 L 175 430 L 205 386 Z',
        0.3,
        'muted',
        0,
        0.72,
      ),
      circle(boss.x, boss.y, spec.threatRadius, preview ? 0.5 : 0, 'accent', 4, 0.07, '10 10'),
      circle(boss.x, boss.y, spec.threatRadius, live ? 0.9 : 0, 'signal', 10, 0.17),
      rect(boss.x - 58, boss.y - 118, 116, 16, preview ? 0.88 : 0, 'muted', 0.14),
      rect(boss.x - 54, boss.y - 114, 108 * gaugeProgress, 8, preview ? 0.96 : 0, 'accent', 0.75),
      line(player.x - 28, player.y - 31, boss.x + 42, boss.y - 4, interruptFlash, 'accent', 9),
      circle(boss.x + 42, boss.y - 4, 17 + 21 * interruptFlash, interruptFlash, 'signal', 6),
      path(
        `M ${boss.x} ${boss.y - 88} L ${boss.x + 20} ${boss.y - 68} L ${boss.x} ${boss.y - 48} L ${boss.x - 20} ${boss.y - 68} Z M ${boss.x} ${boss.y - 82} L ${boss.x} ${boss.y - 54}`,
        preview ? 0.92 : 0,
        'accent',
        6,
      ),
      path(
        `M ${boss.x - 20} ${boss.y - 70} L ${boss.x + 20} ${boss.y - 30} M ${boss.x + 20} ${boss.y - 70} L ${boss.x - 20} ${boss.y - 30}`,
        interrupted ? 0.88 : 0,
        'safe',
        8,
      ),
    ];
  }
  if (mode === 'loadout-adaptation') {
    const reachEquipped = frame.time < spec.swapAt;
    const burstEquipped = frame.time >= spec.swapAt && frame.time < spec.recoveryEnd;
    const readingReach = frame.time >= spec.reachSnapshot[0] && frame.time < spec.reachSnapshot[1];
    const readingBurst = frame.time >= spec.burstSnapshot[0] && frame.time < spec.burstSnapshot[1];
    const reachCopied = frame.time >= spec.reachCopiedAt && frame.time < spec.reachRecoveryEnd;
    const burstCopied = frame.time >= spec.burstCopiedAt && frame.time < spec.recoveryEnd;
    const reachPreview = frame.time >= spec.reachCopiedAt && frame.time < spec.reachAttack[0];
    const burstPreview = frame.time >= spec.burstCopiedAt && frame.time < spec.burstAttack[0];
    const copyFlash = Math.max(
      strikePulse(frame.time, spec.reachCopiedAt, 0.34),
      strikePulse(frame.time, spec.burstCopiedAt, 0.34),
    );
    return [
      path('M 36 94 H 524 V 878 H 36 Z M 56 278 H 504 V 878 H 56 Z', 0.36, 'muted', 0, 0.56),
      path(
        'M 55 118 H 126 V 366 H 55 Z M 434 118 H 505 V 366 H 434 Z M 141 121 H 419 V 155 H 141 Z M 66 518 L 280 498 L 494 518 V 551 L 280 527 L 66 551 Z M 66 821 L 280 789 L 494 821 V 851 L 280 816 L 66 851 Z',
        0.39,
        'accent',
        0,
        0.58,
      ),
      path(
        'M 80 682 H 214 L 201 794 H 93 Z M 346 682 H 480 L 467 794 H 359 Z M 80 680 L 147 649 L 214 680 Z M 346 680 L 413 649 L 480 680 Z',
        0.45,
        'muted',
        0,
        0.78,
      ),
      path(
        'M 108 728 H 183 L 161 711 M 183 728 L 161 745',
        reachEquipped ? 0.72 : 0.22,
        reachEquipped ? 'safe' : 'muted',
        7,
      ),
      path(
        'M 413 705 L 438 727 L 413 749 L 388 727 Z M 413 715 L 426 727 L 413 739 L 400 727 Z',
        burstEquipped ? 0.72 : 0.22,
        burstEquipped ? 'safe' : 'muted',
        0,
        0.7,
      ),
      line(
        player.x,
        player.y - 30,
        boss.x,
        boss.y - 30,
        readingReach || readingBurst ? 0.82 : 0,
        'accent',
        5,
        '10 9',
      ),
      path(
        `M ${player.x - 30} ${player.y - 72} L ${player.x + 30} ${player.y - 72} M ${player.x + 12} ${player.y - 84} L ${player.x + 30} ${player.y - 72} L ${player.x + 12} ${player.y - 60}`,
        reachEquipped ? 0.88 : 0,
        'safe',
        6,
      ),
      path(
        `M ${boss.x - 34} ${boss.y - 65} L ${boss.x + 34} ${boss.y - 65} M ${boss.x + 14} ${boss.y - 79} L ${boss.x + 34} ${boss.y - 65} L ${boss.x + 14} ${boss.y - 51}`,
        reachCopied ? 0.9 : 0,
        'accent',
        7,
      ),
      line(
        boss.x + 38,
        boss.y,
        spec.reachEnd[0],
        spec.reachEnd[1],
        reachPreview ? 0.52 : 0,
        'accent',
        8,
        '12 10',
      ),
      line(
        boss.x + 38,
        boss.y,
        spec.reachEnd[0],
        spec.reachEnd[1],
        frame.reachDanger ? 0.94 : 0,
        'signal',
        spec.reachHalfWidth * 2,
      ),
      circle(player.x, player.y - 72, 24, burstEquipped ? 0.86 : 0, 'safe', 6, 0.08),
      circle(boss.x, boss.y - 65, 24, burstCopied ? 0.9 : 0, 'accent', 7, 0.12),
      circle(boss.x, boss.y, spec.burstRadius, burstPreview ? 0.5 : 0, 'accent', 4, 0.07, '10 10'),
      circle(boss.x, boss.y, spec.burstRadius, frame.burstDanger ? 0.9 : 0, 'signal', 10, 0.17),
      circle(boss.x, boss.y - 65, 27 + 18 * copyFlash, copyFlash, 'signal', 5),
    ];
  }
  if (mode === 'wind-up') {
    const state = windUpState(frame.time);
    const progress = windUpProgress(frame.time);
    const winding = state === 'short-wind-up' || state === 'held-wind-up' || state === 'held-ready';
    const ready = progress >= 1 || state === 'held-ready';
    const releaseFlash = Math.max(
      strikePulse(frame.time, spec.firstRelease[0], 0.34),
      strikePulse(frame.time, spec.secondRelease[0], 0.34),
    );
    const rune = (offset, threshold) => {
      const x = boss.x + offset;
      return path(
        `M ${x} ${boss.y - 92} L ${x + 11} ${boss.y - 79} L ${x} ${boss.y - 66} L ${x - 11} ${boss.y - 79} Z`,
        winding && progress >= threshold ? 0.92 : winding ? 0.2 : 0,
        progress >= threshold ? 'accent' : 'muted',
        5,
        progress >= threshold ? 0.2 : 0,
      );
    };
    return [
      path('M 38 94 H 522 V 878 H 38 Z M 62 254 H 498 V 878 H 62 Z', 0.36, 'muted', 0, 0.56),
      path(
        'M 59 117 H 139 V 365 H 59 Z M 421 117 H 501 V 365 H 421 Z M 153 120 H 407 V 155 H 153 Z M 60 396 H 132 V 495 H 60 Z M 428 396 H 500 V 495 H 428 Z M 67 541 L 280 520 L 493 541 V 574 L 280 549 L 67 574 Z M 67 700 L 280 674 L 493 700 V 738 L 280 706 L 67 738 Z M 67 825 L 280 797 L 493 825 V 846 L 280 816 L 67 846 Z',
        0.39,
        'accent',
        0,
        0.58,
      ),
      line(
        boss.x + 38,
        boss.y,
        spec.laneEnd[0],
        spec.laneEnd[1],
        winding ? 0.5 : 0,
        'accent',
        7,
        '12 10',
      ),
      line(
        boss.x + 38,
        boss.y,
        spec.laneEnd[0],
        spec.laneEnd[1],
        frame.dangerActive ? 0.95 : 0,
        'signal',
        spec.laneHalfWidth * 2,
      ),
      rune(-34, 0.12),
      rune(0, 0.45),
      rune(34, 0.78),
      path(
        `M ${boss.x - 66} ${boss.y - 54} L ${boss.x - 91} ${boss.y - 97} L ${boss.x - 48} ${boss.y - 84} Z M ${boss.x + 66} ${boss.y - 54} L ${boss.x + 91} ${boss.y - 97} L ${boss.x + 48} ${boss.y - 84} Z`,
        ready ? 0.82 : 0,
        'safe',
        0,
        0.74,
      ),
      circle(boss.x + 42, boss.y, 18 + releaseFlash * 24, releaseFlash, 'signal', 8),
      line(
        boss.x - 62,
        boss.y + 66,
        boss.x + 62,
        boss.y + 66,
        frame.dangerActive ? 0.78 : 0,
        'muted',
        8,
        '10 8',
      ),
    ];
  }
  if (mode === 'attack-lock') {
    const state = frame.attackLockState;
    const tracking = state === 'tracking-first' || state === 'tracking-second';
    const locked =
      state === 'locked-first' ||
      state === 'released-first' ||
      state === 'recovery-first' ||
      state === 'locked-second' ||
      state === 'released-second' ||
      state === 'recovery-second';
    const lockFlash = Math.max(
      strikePulse(frame.time, spec.firstLock, 0.34),
      strikePulse(frame.time, spec.secondLock, 0.34),
    );
    const emitter = { x: boss.x + 43, y: boss.y + 8 };
    const releaseStart = state === 'released-second' ? spec.secondRelease[0] : spec.firstRelease[0];
    const flow = clamp((frame.time - releaseStart) / 0.4);
    const direction = Math.atan2(
      frame.attackLockEnd.y - emitter.y,
      frame.attackLockEnd.x - emitter.x,
    );
    const forward = { x: Math.cos(direction), y: Math.sin(direction) };
    const side = { x: -forward.y, y: forward.x };
    const shards = Array.from({ length: 6 }, (_, index) => {
      const travel = (index + 0.36 + flow * 0.6) / 7;
      const center = {
        x: mix(emitter.x, frame.attackLockEnd.x, travel) + side.x * (index % 2 ? 5 : -5),
        y: mix(emitter.y, frame.attackLockEnd.y, travel) + side.y * (index % 2 ? 5 : -5),
      };
      const tip = (along, across) =>
        `${center.x + forward.x * along + side.x * across} ${center.y + forward.y * along + side.y * across}`;
      return path(
        `M ${tip(18, 0)} L ${tip(-4, -8)} L ${tip(-14, -3)} L ${tip(-9, 8)} L ${tip(4, 6)} Z`,
        frame.dangerActive ? 0.86 : 0,
        index % 3 === 0 ? 'signal' : 'muted',
        2,
        0.88,
      );
    });
    return [
      line(
        emitter.x,
        emitter.y,
        frame.attackLockEnd.x,
        frame.attackLockEnd.y,
        tracking ? 0.42 : 0,
        'accent',
        5,
        '8 10',
      ),
      line(
        emitter.x,
        emitter.y,
        frame.attackLockEnd.x,
        frame.attackLockEnd.y,
        locked && !frame.dangerActive ? 0.64 : 0,
        'accent',
        5,
      ),
      line(
        emitter.x,
        emitter.y,
        frame.attackLockEnd.x,
        frame.attackLockEnd.y,
        frame.dangerActive ? 0.58 : 0,
        'signal',
        spec.laneHalfWidth * 2,
      ),
      circle(
        frame.attackLockTarget.x,
        frame.attackLockTarget.y,
        22,
        tracking ? 0.45 : locked ? 0.78 : 0,
        locked ? 'accent' : 'muted',
        4,
        0.04,
      ),
      path(
        `M ${frame.attackLockTarget.x - 13} ${frame.attackLockTarget.y} L ${frame.attackLockTarget.x + 13} ${frame.attackLockTarget.y} M ${frame.attackLockTarget.x} ${frame.attackLockTarget.y - 13} L ${frame.attackLockTarget.x} ${frame.attackLockTarget.y + 13}`,
        tracking || locked ? 0.36 : 0,
        'accent',
        3,
      ),
      circle(
        frame.attackLockTarget.x,
        frame.attackLockTarget.y,
        31 + lockFlash * 18,
        lockFlash,
        'signal',
        6,
      ),
      path(
        `M ${emitter.x - 14} ${emitter.y - 13} L ${emitter.x + 3} ${emitter.y - 20} L ${emitter.x + 18} ${emitter.y - 4} L ${emitter.x + 8} ${emitter.y + 17} L ${emitter.x - 12} ${emitter.y + 10} Z`,
        tracking || locked ? 0.9 : 0,
        'muted',
        2,
        0.92,
      ),
      line(
        emitter.x,
        emitter.y,
        frame.attackLockEnd.x,
        frame.attackLockEnd.y,
        frame.dangerActive ? 0.84 : 0,
        'accent',
        12,
      ),
      ...shards,
    ];
  }
  if (mode === 'active-phase') {
    const state = frame.activePhaseState;
    const startup = state === 'startup';
    const activeWindow = state === 'active';
    const inactiveMotion = state === 'follow-through' || state === 'recovery';
    const activeFlash =
      frame.time >= spec.active[0] ? Math.max(0, 1 - (frame.time - spec.active[0]) / 0.3) : 0;
    const inactiveFlash =
      frame.time >= spec.active[1] ? Math.max(0, 1 - (frame.time - spec.active[1]) / 0.34) : 0;
    const laneWidth = spec.laneEnd[0] - spec.laneStart[0];
    return [
      path('M 36 94 H 524 V 878 H 36 Z M 57 240 H 503 V 878 H 57 Z', 0.36, 'muted', 0, 0.56),
      path(
        'M 54 113 H 133 V 313 H 54 Z M 427 113 H 506 V 313 H 427 Z M 147 116 H 413 V 151 H 147 Z M 55 348 H 107 V 512 H 55 Z M 453 348 H 505 V 512 H 453 Z M 70 565 L 280 544 L 490 565 V 609 L 280 585 L 70 609 Z M 70 756 L 280 730 L 490 756 V 802 L 280 775 L 70 802 Z',
        0.43,
        'accent',
        0,
        0.57,
      ),
      path(
        'M 282 395 H 516 V 465 H 282 Z M 70 652 L 280 631 L 490 652 V 662 L 280 641 L 70 662 Z M 70 838 L 280 812 L 490 838 V 850 L 280 826 L 70 850 Z',
        0.33,
        'muted',
        0,
        0.76,
      ),
      path(
        `M ${spec.laneStart[0]} ${spec.laneStart[1] - spec.laneHalfWidth} H ${spec.laneEnd[0]} V ${spec.laneEnd[1] + spec.laneHalfWidth} H ${spec.laneStart[0]} Z`,
        startup ? 0.58 : 0,
        'accent',
        5,
        0.04,
        '12 10',
      ),
      rect(
        spec.laneStart[0],
        spec.laneStart[1] - spec.laneHalfWidth,
        laneWidth,
        spec.laneHalfWidth * 2,
        activeWindow ? 0.94 : 0,
        'signal',
        0.34,
      ),
      line(
        spec.laneStart[0],
        spec.laneStart[1],
        spec.laneEnd[0],
        spec.laneEnd[1],
        inactiveMotion ? 0.72 : 0,
        'safe',
        7,
        '15 9',
      ),
      line(
        spec.laneStart[0],
        spec.laneStart[1] - 44,
        spec.laneStart[0],
        spec.laneStart[1] + 44,
        startup || activeWindow ? 0.8 : 0,
        activeWindow ? 'signal' : 'accent',
        activeWindow ? 8 : 5,
      ),
      line(
        spec.laneEnd[0],
        spec.laneEnd[1] - 44,
        spec.laneEnd[0],
        spec.laneEnd[1] + 44,
        startup || activeWindow ? 0.8 : 0,
        activeWindow ? 'signal' : 'accent',
        activeWindow ? 8 : 5,
      ),
      circle(spec.laneStart[0], spec.laneStart[1], 18 + activeFlash * 24, activeFlash, 'signal', 7),
      circle(
        spec.laneEnd[0],
        spec.laneEnd[1],
        18 + inactiveFlash * 20,
        inactiveFlash,
        'safe',
        6,
        0,
        '7 7',
      ),
    ];
  }
  if (mode === 'recovery') {
    const state = frame.recoveryState;
    const startup = state === 'startup';
    const activeWindow = state === 'active';
    const recoveryOpen = state === 'approach-window' || state === 'punish-window';
    const laneWidth = spec.laneEnd[0] - spec.laneStart[0];
    const recoveryStartFlash =
      frame.time >= spec.recovery[0] ? Math.max(0, 1 - (frame.time - spec.recovery[0]) / 0.34) : 0;
    const readyFlash =
      frame.time >= spec.recovery[1] ? Math.max(0, 1 - (frame.time - spec.recovery[1]) / 0.34) : 0;
    const recoveryProgress = recoveryOpen
      ? clamp((frame.time - spec.recovery[0]) / (spec.recovery[1] - spec.recovery[0]))
      : state === 'boss-ready' || state === 'reset'
        ? 1
        : 0;
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    return [
      path('M 36 94 H 524 V 878 H 36 Z M 53 246 H 507 V 878 H 53 Z', 0.34, 'muted', 0, 0.58),
      path(
        'M 52 111 H 114 V 344 H 52 Z M 446 111 H 508 V 344 H 446 Z M 126 115 H 434 V 154 H 126 Z M 60 381 H 504 V 397 H 60 Z M 60 467 H 504 V 483 H 60 Z M 60 590 L 280 566 L 500 590 V 612 L 280 587 L 60 612 Z M 60 751 L 280 724 L 500 751 V 778 L 280 747 L 60 778 Z',
        0.37,
        'accent',
        0,
        0.54,
      ),
      path(
        'M 64 420 H 510 V 445 H 64 Z M 64 629 L 279 610 L 497 629 V 639 L 280 623 L 64 639 Z M 64 816 L 280 790 L 497 816 V 829 L 280 804 L 64 829 Z',
        0.27,
        'muted',
        0,
        0.7,
      ),
      path(
        `M ${spec.laneStart[0]} ${spec.laneStart[1] - spec.laneHalfWidth} H ${spec.laneEnd[0]} V ${spec.laneEnd[1] + spec.laneHalfWidth} H ${spec.laneStart[0]} Z`,
        startup ? 0.58 : 0,
        'accent',
        5,
        0.04,
        '12 10',
      ),
      rect(
        spec.laneStart[0],
        spec.laneStart[1] - spec.laneHalfWidth,
        laneWidth,
        spec.laneHalfWidth * 2,
        activeWindow ? 0.94 : 0,
        'signal',
        0.34,
      ),
      circle(boss.x, boss.y, spec.punishReach, recoveryOpen ? 0.7 : 0, 'safe', 6, 0.04, '13 10'),
      circle(
        boss.x,
        boss.y,
        mix(86, 42, recoveryProgress),
        recoveryOpen ? 0.88 : 0,
        'accent',
        7,
        0.03,
        '10 8',
      ),
      circle(boss.x, boss.y, 45 + recoveryStartFlash * 25, recoveryStartFlash, 'safe', 7),
      circle(boss.x, boss.y, 45 + readyFlash * 25, readyFlash, 'signal', 7),
      line(frame.player.x, frame.player.y, boss.x, boss.y, strike, 'safe', 9),
      circle(boss.x + 35, boss.y - 4, 12 + strike * 24, strike, 'safe', 7, 0.12),
    ];
  }
  if (mode === 'survival-phase') {
    const survivalOpen = frame.time >= spec.survival[0] && frame.time < spec.shieldDropsAt;
    const survivalProgress = clamp(
      (frame.time - spec.survival[0]) / (spec.shieldDropsAt - spec.survival[0]),
    );
    const completionFlash =
      frame.time >= spec.shieldDropsAt
        ? Math.max(0, 1 - (frame.time - spec.shieldDropsAt) / 0.42)
        : 0;
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    return [
      path(
        'M 40 94 L 520 94 L 520 878 L 40 878 Z M 55 669 L 505 669 L 510 865 L 50 865 Z',
        0.35,
        'muted',
        0,
        0.48,
      ),
      path(
        'M 52 106 L 95 106 L 98 660 L 50 660 Z M 465 106 L 508 106 L 510 660 L 462 660 Z M 50 670 L 220 668 L 246 750 L 49 767 Z M 258 670 L 510 670 L 511 766 L 260 750 Z M 57 779 L 247 761 L 250 870 L 54 870 Z M 260 761 L 503 779 L 506 870 L 262 870 Z',
        0.42,
        'accent',
        0,
        0.64,
      ),
      circle(boss.x, boss.y, 76, survivalOpen ? 0.88 : 0, 'accent', 5, 0.07),
      path(
        'M 436 158 L 504 158 L 504 327 L 436 327 Z M 447 176 L 493 176 L 493 310 L 447 310 Z M 447 226 L 493 226 L 470 252 Z',
        0.72,
        'accent',
        0,
        0.68,
      ),
      path(
        `M 453 ${306 - 124 * (1 - survivalProgress)} L 487 ${306 - 124 * (1 - survivalProgress)} L 487 306 L 453 306 Z`,
        frame.time < spec.shieldDropsAt ? 0.9 : 0.14,
        frame.time >= spec.shieldDropsAt ? 'safe' : 'signal',
        0,
        0.84,
      ),
      ...spec.hazards.map(({ center, preview: previewWindow, active }) => {
        const previewing = frame.time >= previewWindow[0] && frame.time < active[0];
        const activeNow = frame.time >= active[0] && frame.time < active[1];
        const buildup = clamp((frame.time - previewWindow[0]) / (active[0] - previewWindow[0]));
        return circle(
          center[0],
          center[1],
          activeNow ? spec.hazardRadius : mix(38, spec.hazardRadius, buildup),
          activeNow ? 0.94 : previewing ? 0.68 : 0,
          activeNow ? 'signal' : 'accent',
          activeNow ? 7 : 4,
          activeNow ? 0.3 : 0.07,
        );
      }),
      path(
        `M ${boss.x - 74} ${boss.y - 32} L ${boss.x - 90} ${boss.y - 48} L ${boss.x - 60} ${boss.y - 52} Z M ${boss.x + 74} ${boss.y - 32} L ${boss.x + 90} ${boss.y - 48} L ${boss.x + 60} ${boss.y - 52} Z M ${boss.x - 18} ${boss.y + 72} L ${boss.x} ${boss.y + 92} L ${boss.x + 18} ${boss.y + 72} Z`,
        completionFlash,
        'safe',
        0,
        0.86,
      ),
      line(frame.player.x, frame.player.y, boss.x, boss.y, strike, 'safe', 9),
      path(
        `M ${boss.x + 20} ${boss.y - 32} L ${boss.x + 47} ${boss.y - 43} L ${boss.x + 33} ${boss.y - 11} Z`,
        strike,
        'safe',
        0,
        0.84,
      ),
    ];
  }
  if (mode === 'teleport') {
    const origin = point(spec.boss);
    const destination = point(spec.destination);
    const departureProgress = clamp(
      (frame.time - spec.departure[0]) / (spec.departure[1] - spec.departure[0]),
    );
    const destinationProgress = clamp(
      (frame.time - spec.destinationPreview[0]) /
        (spec.destinationPreview[1] - spec.destinationPreview[0]),
    );
    const sourceVisible = frame.time >= spec.departure[0] && frame.time < spec.arrival[0];
    const destinationVisible =
      frame.time >= spec.destinationPreview[0] && frame.time < spec.recoveryEnd;
    const followUpVisible = frame.time >= spec.followUpPreview[0] && frame.time < spec.active[0];
    const activeWindow = frame.time >= spec.active[0] && frame.time < spec.active[1];
    const arrivalFlash = strikePulse(frame.time, spec.arrival[1], 0.34);
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    return [
      path(
        'M 40 94 L 520 94 L 520 878 L 40 878 Z M 55 706 L 505 706 L 512 872 L 48 872 Z',
        0.36,
        'muted',
        0,
        0.48,
      ),
      path(
        'M 65 130 L 495 130 L 474 169 L 86 169 Z M 81 189 L 185 189 L 175 322 L 87 322 Z M 368 189 L 472 189 L 466 322 L 378 322 Z M 65 378 L 225 378 L 210 408 L 78 408 Z',
        0.36,
        'accent',
        0,
        0.52,
      ),
      path(
        `M ${origin.x - 45} ${origin.y + 35} L ${origin.x} ${origin.y + 17} L ${origin.x + 45} ${origin.y + 35} L ${origin.x + 32} ${origin.y + 51} L ${origin.x - 31} ${origin.y + 51} Z M ${origin.x - 10} ${origin.y - 12} L ${origin.x} ${origin.y - 30} L ${origin.x + 10} ${origin.y - 12} L ${origin.x} ${origin.y + 5} Z`,
        sourceVisible ? 0.84 * (1 - departureProgress * 0.42) : 0.24,
        'accent',
        0,
        0.72,
      ),
      path(
        `M ${destination.x - 49} ${destination.y + 35} L ${destination.x} ${destination.y + 16} L ${destination.x + 49} ${destination.y + 35} L ${destination.x + 34} ${destination.y + 52} L ${destination.x - 34} ${destination.y + 52} Z`,
        destinationVisible ? 0.86 : 0.25,
        'safe',
        0,
        0.7,
      ),
      path(
        `M ${destination.x} ${destination.y - 38} L ${destination.x + 23} ${destination.y - 3} L ${destination.x} ${destination.y + 30} L ${destination.x - 23} ${destination.y - 3} Z`,
        destinationVisible ? 0.48 + destinationProgress * 0.45 : 0,
        'safe',
        0,
        0.82,
      ),
      path(
        'M 361 408 L 419 408 L 419 790 L 361 790 Z',
        followUpVisible ? 0.66 : 0,
        'accent',
        0,
        0.34,
      ),
      path('M 361 408 L 419 408 L 419 790 L 361 790 Z', activeWindow ? 0.94 : 0, 'signal', 0, 0.72),
      path(
        `M ${destination.x - 48} ${destination.y + 22} L ${destination.x - 62} ${destination.y - 6} L ${destination.x - 26} ${destination.y + 6} Z M ${destination.x + 47} ${destination.y + 20} L ${destination.x + 61} ${destination.y - 8} L ${destination.x + 26} ${destination.y + 4} Z`,
        arrivalFlash,
        'safe',
        0,
        0.82,
      ),
      line(frame.player.x, frame.player.y, boss.x, boss.y, strike, 'safe', 9),
      path(
        `M ${boss.x + 18} ${boss.y - 30} L ${boss.x + 44} ${boss.y - 43} L ${boss.x + 31} ${boss.y - 11} Z`,
        strike,
        'safe',
        0,
        0.84,
      ),
    ];
  }
  if (mode === 'boundary-attack') {
    const signalProgress = clamp((frame.time - spec.signal[0]) / (spec.active[0] - spec.signal[0]));
    const signalVisible = frame.time >= spec.signal[0] && frame.time < spec.active[0];
    const activeWindow = frame.time >= spec.active[0] && frame.time < spec.active[1];
    const impact = strikePulse(frame.time, spec.impactAt, 0.34);
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    return [
      line(58, 370, 58, 840, 0.26, 'muted', 3),
      line(502, 370, 502, 840, 0.26, 'muted', 3),
      path(
        'M 63 569 L 498 569 L 498 651 L 63 651 Z',
        signalVisible ? 0.52 + signalProgress * 0.24 : 0,
        'accent',
        0,
        0.58,
      ),
      path('M 40 569 L 520 569 L 520 651 L 40 651 Z', activeWindow ? 0.94 : 0, 'signal', 0, 0.72),
      path(
        'M 46 586 L 61 569 L 77 586 L 62 610 Z M 46 634 L 62 610 L 77 634 L 61 651 Z',
        signalVisible ? 0.56 + signalProgress * 0.36 : activeWindow ? 0.94 : 0.18,
        activeWindow ? 'signal' : 'accent',
        0,
        0.82,
      ),
      path(
        'M 476 573 L 501 556 L 499 584 Z M 483 624 L 513 602 L 508 637 Z M 471 650 L 497 636 L 502 668 Z',
        impact,
        'signal',
        0,
        0.86,
      ),
      path(
        `M ${spec.rightBoundary} ${spec.laneEnd[1]} L 525 270 L 35 270 L ${spec.leftBoundary} ${spec.laneStart[1]}`,
        frame.time >= spec.openingEnd ? 0.22 : 0,
        'muted',
        3,
      ),
      line(frame.player.x, frame.player.y, boss.x, boss.y, strike, 'safe', 9),
      path(
        `M ${boss.x - 41} ${boss.y - 25} L ${boss.x - 18} ${boss.y - 40} L ${boss.x - 23} ${boss.y - 12} Z`,
        strike,
        'safe',
        0,
        0.85,
      ),
    ];
  }
  if (mode === 'forced-scrolling') {
    const signalProgress = clamp((frame.time - spec.signal[0]) / (spec.active[0] - spec.signal[0]));
    const signalVisible = frame.time >= spec.signal[0] && frame.time < spec.active[0];
    const scrolling = frame.time >= spec.active[0] && frame.time < spec.active[1];
    const offset = forcedScrollingOffset(frame.time);
    const resetProgress = smooth((frame.time - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    const platformY = (baseY) => {
      const wrapped = (((baseY - 380 + offset) % 520) + 520) % 520;
      return 380 + wrapped;
    };
    return [
      path('M 40 94 L 520 94 L 520 878 L 40 878 Z', 0.34, 'muted', 0, 0.5),
      path(
        'M 51 105 L 112 105 L 116 877 L 48 877 Z M 448 105 L 509 105 L 512 877 L 444 877 Z',
        0.44,
        'accent',
        0,
        0.68,
      ),
      path(
        'M 72 139 L 99 139 L 100 298 L 71 298 Z M 460 139 L 488 139 L 489 298 L 459 298 Z M 123 115 L 438 115 L 421 149 L 139 149 Z',
        0.32,
        'muted',
        0,
        0.56,
      ),
      path('M 392 367 L 420 350 L 450 367 L 445 431 L 394 431 Z', 0.75, 'accent', 0, 0.72),
      path(
        'M 420 369 L 438 397 L 420 423 L 402 397 Z',
        frame.time < spec.resetAt ? 0.82 : 0.82 * (1 - resetProgress),
        frame.time >= spec.active[1] ? 'safe' : 'signal',
        0,
        0.84,
      ),
      path(
        'M 48 730 L 512 730 L 512 878 L 48 878 Z',
        signalVisible ? 0.48 + signalProgress * 0.3 : 0,
        'accent',
        0,
        0.72,
      ),
      path('M 48 730 L 512 730 L 512 878 L 48 878 Z', scrolling ? 0.94 : 0, 'signal', 0, 0.86),
      path(
        'M 52 729 L 508 729 L 496 743 L 64 743 Z',
        signalVisible || scrolling ? 0.72 : 0.12,
        scrolling ? 'signal' : 'accent',
        0,
        0.76,
      ),
      ...spec.platforms.map(([x, y, width]) =>
        path(
          `M ${x - width / 2} ${platformY(y)} L ${x + width / 2} ${platformY(y)} L ${x + width / 2 - 12} ${platformY(y) + 23} L ${x - width / 2 + 12} ${platformY(y) + 23} Z`,
          scrolling ? 0.85 : 0.62,
          'safe',
          0,
          0.72,
        ),
      ),
      path(
        'M 145 235 L 172 207 L 198 235 L 180 235 L 180 295 L 162 295 L 162 235 Z M 310 235 L 338 207 L 364 235 L 347 235 L 347 295 L 328 295 L 328 235 Z',
        signalVisible || scrolling ? 0.54 : 0.18,
        'safe',
        0,
        0.62,
      ),
      line(frame.player.x, frame.player.y, boss.x, boss.y, strike, 'safe', 9),
      path(
        `M ${boss.x + 20} ${boss.y - 29} L ${boss.x + 46} ${boss.y - 40} L ${boss.x + 32} ${boss.y - 10} Z`,
        strike,
        'safe',
        0,
        0.84,
      ),
    ];
  }
  if (mode === 'chase-herding') {
    const signalProgress = clamp((frame.time - spec.signal[0]) / (spec.active[0] - spec.signal[0]));
    const chaseProgress = clamp((frame.time - spec.active[0]) / (spec.active[1] - spec.active[0]));
    const signalVisible = frame.time >= spec.signal[0] && frame.time < spec.active[0];
    const chasing = frame.time >= spec.active[0] && frame.time < spec.active[1];
    const captured = frame.time >= spec.active[1] && frame.time < spec.resetAt;
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    const innerOpacity = chasing ? 0.28 : signalVisible ? 0.2 + signalProgress * 0.14 : 0.08;
    const outerOpacity = chasing ? 0.46 : signalVisible ? 0.28 + signalProgress * 0.12 : 0.1;
    return [
      path('M 40 94 L 520 94 L 520 879 L 40 879 Z', 0.36, 'muted', 0, 0.48),
      path(
        'M 58 128 L 501 128 L 484 405 L 76 405 Z M 61 144 L 145 144 L 140 376 L 67 376 Z M 404 144 L 493 144 L 482 375 L 410 375 Z',
        0.33,
        'accent',
        0,
        0.46,
      ),
      path(
        'M 54 748 L 150 664 L 255 552 L 365 625 L 451 593 L 512 649 L 506 751 L 442 681 L 354 703 L 268 630 L 165 744 L 62 826 Z',
        0.56,
        'muted',
        0,
        0.64,
      ),
      path(
        'M 70 748 L 170 667 L 239 487 L 352 463 L 382 520 L 272 555 L 209 719 L 95 791 Z',
        signalVisible || chasing ? 0.42 : 0.24,
        'safe',
        0,
        0.38,
      ),
      path(
        'M 393 545 L 414 545 L 418 688 L 391 688 Z M 480 545 L 502 545 L 503 688 L 476 688 Z M 391 682 L 503 682 L 493 707 L 402 707 Z',
        frame.time >= spec.signal[0] ? 0.82 : 0.3,
        captured ? 'safe' : 'accent',
        0,
        0.74,
      ),
      path(
        'M 414 618 L 445 595 L 478 618 L 445 646 Z',
        captured ? 0.94 : 0.38 + signalProgress * 0.33,
        captured ? 'safe' : 'signal',
        0,
        0.72,
      ),
      circle(frame.boss.x, frame.boss.y, spec.distanceBand[0], innerOpacity, 'signal', 3, 0.03),
      circle(frame.boss.x, frame.boss.y, spec.distanceBand[1], outerOpacity, 'accent', 3, 0.015),
      ...spec.checkpoints.map(([x, y], index) =>
        path(
          `M ${x - 22} ${y + 5} L ${x} ${y - 17} L ${x + 22} ${y + 5} L ${x} ${y + 20} Z`,
          signalVisible || chasing || captured ? 0.68 : 0.18,
          chaseProgress >= (index + 1) / spec.checkpoints.length ? 'safe' : 'accent',
          0,
          0.7,
        ),
      ),
      path(
        'M 307 495 L 350 472 L 393 495 L 375 522 L 324 522 Z',
        chasing ? 0.76 : 0.3,
        'safe',
        0,
        0.68,
      ),
      line(frame.player.x, frame.player.y, frame.boss.x, frame.boss.y, strike, 'safe', 9),
      path(
        `M ${frame.boss.x - 39} ${frame.boss.y - 30} L ${frame.boss.x - 15} ${frame.boss.y - 42} L ${frame.boss.x - 20} ${frame.boss.y - 13} Z`,
        strike,
        'safe',
        0,
        0.85,
      ),
    ];
  }
  if (mode === 'escape-phase') {
    const signalProgress = clamp((frame.time - spec.triggerAt) / (spec.escape[0] - spec.triggerAt));
    const escaping = frame.time >= spec.escape[0] && frame.time < spec.escape[1];
    const resolved = frame.time >= spec.escape[1] && frame.time < spec.resetAt;
    const signalVisible = frame.time >= spec.triggerAt && frame.time < spec.escape[0];
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    const gateOpacity = frame.escapeInterrupted ? 0.5 : signalVisible || escaping ? 0.96 : 0.58;
    const gaugeWidth = 104 * frame.escapeProgress;
    return [
      path('M 40 94 L 520 94 L 520 878 L 40 878 Z', 0.35, 'muted', 0, 0.46),
      path(
        'M 60 128 L 392 128 L 386 451 L 58 469 Z M 64 145 L 145 145 L 145 368 L 61 383 Z M 170 143 L 320 143 L 315 376 L 166 382 Z',
        0.28,
        'accent',
        0,
        0.46,
      ),
      path(
        'M 58 746 L 186 594 L 256 550 L 330 588 L 386 527 L 454 507 L 486 566 L 392 606 L 342 662 L 258 626 L 207 669 L 142 800 Z',
        0.58,
        'muted',
        0,
        0.63,
      ),
      path(
        'M 76 773 L 178 711 L 272 638 L 376 549 L 403 574 L 292 676 L 192 751 L 108 809 Z',
        signalVisible || escaping ? 0.37 : 0.2,
        'safe',
        0,
        0.43,
      ),
      path(
        'M 409 330 L 505 330 L 519 645 L 413 645 Z M 422 310 L 511 310 L 520 340 L 410 340 Z',
        0.86,
        'accent',
        0,
        0.74,
      ),
      path(
        'M 438 370 L 492 370 L 494 622 L 439 622 Z',
        gateOpacity,
        frame.escapeInterrupted ? 'safe' : 'signal',
        0,
        0.42,
      ),
      path(
        'M 420 358 L 441 358 L 442 638 L 419 638 Z M 490 358 L 509 358 L 511 638 L 491 638 Z M 423 634 L 508 634 L 515 651 L 419 651 Z',
        0.82,
        'muted',
        0,
        0.68,
      ),
      path('M 455 205 L 480 205 L 497 252 L 469 299 L 440 252 Z', 0.78, 'accent', 0, 0.7),
      path(
        'M 465 218 L 476 249 L 465 282 L 454 250 Z M 459 249 L 471 246 L 466 261 Z',
        frame.escapeInterrupted
          ? 0.54
          : signalVisible || escaping
            ? 0.82 + signalProgress * 0.16
            : 0.16,
        frame.escapeInterrupted ? 'safe' : 'signal',
        0,
        0.82,
      ),
      path(
        'M 358 553 L 389 533 L 420 552 L 393 576 Z',
        signalVisible || escaping || resolved ? 0.84 : 0.35,
        frame.escapeInterrupted ? 'safe' : 'accent',
        0,
        0.72,
      ),
      path('M 402 343 L 506 343 L 506 355 L 402 355 Z', 0.82, 'muted', 0, 0.66),
      path(
        `M 402 343 L ${402 + gaugeWidth} 343 L ${402 + gaugeWidth} 355 L 402 355 Z`,
        frame.time >= spec.triggerAt ? 0.94 : 0,
        frame.escapeInterrupted ? 'safe' : 'signal',
        0,
        0.86,
      ),
      path(
        'M 477 336 L 481 336 L 481 362 L 477 362 Z',
        frame.time >= spec.triggerAt ? 0.83 : 0.28,
        'accent',
        0,
        0.78,
      ),
      path(
        `M ${frame.boss.x - 50} ${frame.boss.y - 4} L ${frame.boss.x - 20} ${frame.boss.y - 30} L ${frame.boss.x + 17} ${frame.boss.y - 10} L ${frame.boss.x + 42} ${frame.boss.y + 14} L ${frame.boss.x + 5} ${frame.boss.y + 24} Z`,
        frame.escapeInterrupted ? 0.9 : 0,
        'safe',
        0,
        0.24,
      ),
      line(frame.player.x, frame.player.y, frame.boss.x, frame.boss.y, strike, 'safe', 10),
      path(
        `M ${frame.boss.x - 38} ${frame.boss.y - 29} L ${frame.boss.x - 17} ${frame.boss.y - 42} L ${frame.boss.x - 22} ${frame.boss.y - 14} Z`,
        strike,
        'safe',
        0,
        0.84,
      ),
      path(
        'M 447 383 L 484 383 L 488 400 L 444 400 Z',
        signalVisible || escaping ? 0.34 + signalProgress * 0.24 : 0.08,
        'signal',
        0,
        0.7,
      ),
    ];
  }
  if (mode === 'relocated-arena') {
    const state = frame.relocatedArenaState;
    const previewed = frame.relocatedDestinationRevealed;
    const transferring = frame.relocatedTransferActive;
    const lowerActive = frame.relocatedLowerActive;
    const returning = state === 'return-lift';
    const previewProgress = smooth(
      (frame.time - spec.previewAt) / (spec.transfer[0] - spec.previewAt),
    );
    const transferProgress = smooth(
      (frame.time - spec.transfer[0]) / (spec.transfer[1] - spec.transfer[0]),
    );
    const lowerOpacity = lowerActive ? 0.88 : previewed ? 0.2 + previewProgress * 0.48 : 0.08;
    const upperOpacity = lowerActive && !returning ? 0.22 : 0.7;
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    const landingPulse = strikePulse(frame.time, spec.transfer[1], 0.45);
    const floorOpen = transferring || lowerActive || returning;
    const liftY = Math.min(795, Math.max(frame.boss.y, frame.player.y) + 34);
    return [
      path('M 40 94 L 520 94 L 520 879 L 40 879 Z', 0.38, 'muted', 0, 0.5),
      path(
        'M 65 132 L 495 132 L 487 548 L 73 548 Z M 96 156 L 184 156 L 179 388 L 103 388 Z M 376 156 L 464 156 L 457 388 L 381 388 Z',
        upperOpacity * 0.5,
        'accent',
        0,
        0.46,
      ),
      path('M 96 620 L 464 620 L 456 861 L 104 861 Z', lowerOpacity, 'muted', 0, 0.5),
      path(
        'M 62 132 L 105 132 L 110 568 L 60 586 Z M 455 132 L 498 132 L 500 586 L 450 568 Z M 84 610 L 108 610 L 109 869 L 85 869 Z',
        0.42,
        'accent',
        0,
        0.58,
      ),
      path(
        'M 452 610 L 476 610 L 475 869 L 451 869 Z M 66 100 L 494 100 L 472 131 L 88 131 Z M 91 863 L 469 863 L 480 880 L 80 880 Z',
        0.48,
        'accent',
        0,
        0.62,
      ),
      path(
        floorOpen
          ? 'M 52 562 L 162 562 L 171 602 L 52 614 Z M 438 562 L 508 562 L 508 614 L 431 602 Z'
          : 'M 52 562 L 508 562 L 508 612 L 52 612 Z',
        upperOpacity,
        'accent',
        0,
        0.82,
      ),
      path(
        'M 155 562 L 194 552 L 225 568 L 255 552 L 285 568 L 317 549 L 352 566 L 395 555 L 437 565',
        previewed && !floorOpen ? 0.88 : 0,
        'signal',
        5,
      ),
      path(
        'M 140 620 L 169 629 L 154 647 Z M 354 632 L 380 619 L 377 645 Z M 203 608 L 219 627 L 196 628 Z',
        transferring || lowerActive ? 0.68 : 0,
        'accent',
        0,
        0.64,
      ),
      path('M 208 726 L 248 709 L 289 726 L 282 740 L 216 740 Z', lowerOpacity, 'accent', 0, 0.7),
      path('M 354 764 L 391 748 L 430 764 L 423 777 L 359 777 Z', lowerOpacity, 'safe', 0, 0.68),
      path(
        'M 260 781 L 280 756 L 300 781 L 293 827 L 267 827 Z',
        lowerOpacity * 0.9,
        'accent',
        0,
        0.76,
      ),
      path(
        'M 280 772 L 291 788 L 280 808 L 269 788 Z',
        lowerOpacity,
        lowerActive ? 'signal' : 'accent',
        0,
        0.82,
      ),
      path(
        'M 332 650 L 350 637 L 368 650 L 350 665 Z M 378 650 L 396 637 L 414 650 L 396 665 Z',
        lowerOpacity,
        'safe',
        0,
        0.75,
      ),
      path('M 424 650 L 442 637 L 460 650 L 442 665 Z', lowerOpacity * 0.34, 'accent', 0, 0.6),
      path(
        'M 82 485 L 99 485 L 99 821 L 82 821 Z M 438 485 L 455 485 L 455 821 L 438 821 Z',
        returning ? 0.78 : 0.26,
        'muted',
        0,
        0.62,
      ),
      path(
        `M 76 ${liftY} L 462 ${liftY} L 450 ${liftY + 24} L 88 ${liftY + 24} Z`,
        returning ? 0.94 : lowerActive ? 0.2 : 0,
        'safe',
        0,
        0.72,
      ),
      line(frame.player.x, frame.player.y, frame.boss.x, frame.boss.y, strike, 'safe', 10),
      path(
        `M ${frame.boss.x + 28} ${frame.boss.y - 27} L ${frame.boss.x + 51} ${frame.boss.y - 40} L ${frame.boss.x + 39} ${frame.boss.y - 11} Z`,
        strike,
        'safe',
        0,
        0.84,
      ),
      path(
        'M 212 736 L 196 747 L 210 747 Z M 278 736 L 294 747 L 280 747 Z M 367 772 L 352 782 L 368 782 Z',
        transferring ? transferProgress * 0.5 : landingPulse * 0.62,
        'signal',
        0,
        0.72,
      ),
    ];
  }
  if (mode === 'control-mode-shift') {
    const state = frame.controlModeShiftState;
    const previewed = frame.controlModePreviewed;
    const handoff = state === 'control-handoff';
    const active = frame.controlModeActive;
    const returning = state === 'free-mode-return';
    const previewProgress = smooth(
      (frame.time - spec.previewAt) / (spec.handoff[0] - spec.previewAt),
    );
    const handoffProgress = smooth(
      (frame.time - spec.handoff[0]) / (spec.handoff[1] - spec.handoff[0]),
    );
    const waveProgress = smooth((frame.time - spec.wave[0]) / (spec.wave[1] - spec.wave[0]));
    const returnProgress = smooth(
      (frame.time - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt),
    );
    const freeOpacity = returning
      ? 0.18 + returnProgress * 0.62
      : active
        ? 0.12
        : 0.82 * (1 - handoffProgress);
    const jumpOpacity = returning
      ? 0.82 * (1 - returnProgress)
      : previewed
        ? 0.18 + Math.max(previewProgress, handoffProgress) * 0.68
        : 0.08;
    const wave = {
      x: mix(spec.waveStart[0], spec.waveEnd[0], waveProgress),
      y: spec.waveStart[1],
    };
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    return [
      path('M 40 96 L 520 96 L 520 876 L 40 876 Z', 0.32, 'muted', 0, 0.48),
      path(
        'M 48 138 L 175 126 L 170 380 L 55 394 Z M 385 127 L 511 139 L 505 394 L 390 380 Z',
        0.3,
        'accent',
        0,
        0.42,
      ),
      path(
        'M 65 158 L 100 151 L 111 712 L 62 729 Z M 460 151 L 495 158 L 498 729 L 449 712 Z',
        0.4,
        'muted',
        0,
        0.62,
      ),
      path(
        'M 125 152 L 428 152 L 406 172 L 148 172 Z M 140 372 L 420 372 L 401 390 L 159 390 Z',
        0.3,
        'accent',
        0,
        0.5,
      ),
      path(
        'M 244 199 L 316 199 L 330 226 L 314 304 L 246 304 L 230 226 Z',
        0.82,
        'accent',
        0,
        0.74,
      ),
      path(
        'M 280 215 L 302 249 L 280 284 L 258 249 Z M 280 224 L 293 249 L 280 274 L 267 249 Z',
        previewed ? 0.45 + previewProgress * 0.5 : 0.2,
        handoff ? 'signal' : 'safe',
        0,
        0.84,
      ),
      path(
        'M 270 304 L 290 304 L 354 710 L 300 710 Z',
        active ? 0.16 : handoffProgress * 0.12,
        'signal',
        0,
        0.48,
      ),
      path(
        'M 114 451 L 244 434 L 326 451 L 446 433 L 456 480 L 324 499 L 233 479 L 104 498 Z',
        freeOpacity * 0.43,
        'muted',
        0,
        0.62,
      ),
      path(
        'M 108 520 L 220 502 L 300 524 L 448 502 L 462 550 L 304 571 L 210 545 L 100 568 Z',
        freeOpacity * 0.4,
        'muted',
        0,
        0.6,
      ),
      path(
        'M 97 591 L 218 568 L 301 590 L 459 572 L 466 632 L 306 652 L 212 624 L 92 649 Z',
        freeOpacity * 0.38,
        'muted',
        0,
        0.54,
      ),
      path(
        'M 56 730 L 504 730 L 510 771 L 50 771 Z M 50 772 L 510 772 L 498 867 L 62 867 Z',
        jumpOpacity * 0.88,
        'accent',
        0,
        0.7,
      ),
      path('M 58 728 L 502 728 L 489 742 L 71 742 Z', jumpOpacity, 'safe', 0, 0.75),
      path(
        'M 87 768 L 152 768 L 137 824 L 96 824 Z M 209 768 L 291 768 L 279 840 L 222 840 Z M 352 768 L 463 768 L 448 822 L 365 822 Z',
        jumpOpacity * 0.42,
        'muted',
        0,
        0.64,
      ),
      path(
        'M 324 720 L 346 711 L 370 721 L 353 728 Z M 240 722 L 263 715 L 284 723 L 264 729 Z M 160 721 L 181 714 L 202 721 L 181 729 Z',
        previewed ? 0.26 + handoffProgress * 0.42 : 0,
        'signal',
        0,
        0.72,
      ),
      path(
        `M ${wave.x - 32} ${wave.y + 4} L ${wave.x - 20} ${wave.y - 20} L ${wave.x - 5} ${wave.y - 12} L ${wave.x + 7} ${wave.y - 42} L ${wave.x + 27} ${wave.y - 12} L ${wave.x + 34} ${wave.y + 4} Z`,
        frame.controlModeWaveActive ? 0.94 : 0,
        'signal',
        0,
        0.82,
      ),
      line(frame.player.x, frame.player.y, frame.boss.x, frame.boss.y, strike, 'safe', 10),
      path(
        `M ${frame.boss.x - 52} ${frame.boss.y - 30} L ${frame.boss.x - 28} ${frame.boss.y - 40} L ${frame.boss.x - 38} ${frame.boss.y - 14} Z`,
        strike,
        'safe',
        0,
        0.85,
      ),
    ];
  }
  if (mode === 'boss-as-terrain') {
    const routeVisible = frame.bossAsTerrainRouteRevealed;
    const mounted = frame.bossAsTerrainMounted;
    const holding = frame.bossAsTerrainHolding;
    const weakPointOpen = frame.bossAsTerrainWeakPointOpen;
    const safeDrop = frame.bossAsTerrainSafeDrop;
    const revealProgress = smooth((frame.time - spec.revealAt) / (spec.mountAt - spec.revealAt));
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    const routeOpacity = routeVisible ? 0.56 + revealProgress * 0.3 : 0.2;
    return [
      path('M 42 94 L 518 94 L 520 881 L 40 881 Z', 0.38, 'muted', 0, 0.28),
      path(
        'M 43 112 L 252 102 L 254 335 L 43 353 Z M 266 103 L 517 113 L 518 349 L 265 335 Z',
        0.26,
        'muted',
        0,
        0.44,
      ),
      path('M 60 773 L 233 750 L 360 764 L 502 748 L 515 871 L 46 877 Z', 0.42, 'muted', 0, 0.54),
      path('M 352 688 L 407 682 L 402 709 L 361 713 Z', routeOpacity, 'safe', 0, 0.72),
      path('M 339 636 L 385 629 L 382 655 L 345 658 Z', routeOpacity, 'safe', 0, 0.72),
      path(
        'M 327 581 L 375 577 L 366 607 L 332 609 Z',
        mounted ? 0.96 : routeOpacity,
        holding ? 'signal' : 'safe',
        0,
        0.78,
      ),
      path('M 308 538 L 353 532 L 349 562 L 315 562 Z', routeOpacity, 'safe', 0, 0.76),
      path(
        'M 302 489 L 323 513 L 302 538 L 281 513 Z M 302 499 L 313 513 L 302 528 L 291 513 Z',
        weakPointOpen ? 0.98 : routeVisible ? 0.44 : 0.16,
        weakPointOpen ? 'signal' : 'accent',
        0,
        weakPointOpen ? 0.86 : 0.48,
      ),
      path(
        'M 196 572 L 212 553 L 219 578 Z M 224 628 L 241 614 L 244 638 Z M 242 554 L 254 538 L 261 559 Z',
        holding ? 0.94 : 0,
        'signal',
        0,
        0.82,
      ),
      path(
        'M 333 580 L 346 592 L 335 606 Z M 369 622 L 383 637 L 367 652 Z M 400 686 L 414 704 L 398 716 Z',
        safeDrop ? 0.86 : 0,
        'accent',
        0,
        0.76,
      ),
      path(
        'M 390 763 L 440 744 L 490 763 L 474 790 L 405 790 Z',
        safeDrop ? 0.9 : 0.42,
        'safe',
        0,
        0.76,
      ),
      line(
        frame.player.x,
        frame.player.y,
        spec.weakPoint[0],
        spec.weakPoint[1],
        strike,
        'safe',
        10,
      ),
      path(
        'M 275 494 L 291 485 L 295 503 Z M 315 490 L 330 499 L 309 507 Z',
        strike,
        'safe',
        0,
        0.86,
      ),
    ];
  }
  if (mode === 'cover-line-of-sight') {
    const shadowVisible = frame.coverShadowVisible;
    const beamActive = frame.coverBeamActive;
    const targetVisible = frame.time >= spec.lockAt && frame.time < spec.beam[0];
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    const source = point(spec.source);
    const beamHit = {
      x: spec.pillar[0],
      y:
        source.y +
        ((spec.player[1] - source.y) * (spec.pillar[0] - source.x)) / (spec.player[0] - source.x),
    };
    return [
      path('M 48 92 L 512 92 L 520 880 L 42 880 Z', 0, 'muted', 0, 0.28),
      path('M 53 107 L 271 101 L 278 456 L 45 478 Z', 0, 'muted', 0, 0.42),
      path('M 283 101 L 506 106 L 516 480 L 283 458 Z', 0, 'muted', 0, 0.5),
      path('M 48 489 L 274 468 L 281 867 L 43 874 Z', 0, 'muted', 0, 0.45),
      path('M 283 469 L 513 490 L 518 871 L 287 868 Z', 0, 'muted', 0, 0.54),
      path(
        'M 355 500 L 535 505 L 535 805 L 355 660 Z',
        shadowVisible ? (beamActive ? 0.5 : 0.42) : 0,
        'safe',
        0,
        beamActive ? 0.2 : 0.14,
      ),
      line(
        source.x,
        source.y,
        spec.player[0],
        spec.player[1],
        targetVisible ? 0.72 : 0,
        'accent',
        4,
      ),
      path('M 272 653 L 366 653 L 380 675 L 260 675 Z', 0.72, 'muted', 0, 0.74),
      path('M 285 520 L 355 520 L 355 659 L 285 659 Z', 0.98, 'muted', 0, 0.92),
      path('M 278 502 L 343 490 L 361 514 L 355 531 L 285 531 Z', 0.92, 'muted', 0, 0.78),
      path('M 310 535 L 327 556 L 313 586 L 338 609 L 321 643', 0.26, 'accent', 3),
      path(
        `M ${source.x - 11} ${source.y - 17} L ${source.x + 12} ${source.y} L ${source.x - 11} ${source.y + 17} Z`,
        frame.time >= spec.lockAt ? 0.92 : 0.28,
        beamActive ? 'signal' : 'accent',
        0,
        0.76,
      ),
      line(source.x, source.y, beamHit.x, beamHit.y, beamActive ? 0.92 : 0, 'signal', 18),
      line(source.x, source.y, beamHit.x, beamHit.y, beamActive ? 1 : 0, 'safe', 5),
      path(
        `M ${beamHit.x - 20} ${beamHit.y - 17} L ${beamHit.x - 2} ${beamHit.y - 28} L ${beamHit.x + 6} ${beamHit.y - 9} Z M ${beamHit.x - 17} ${beamHit.y + 18} L ${beamHit.x + 3} ${beamHit.y + 10} L ${beamHit.x + 10} ${beamHit.y + 27} Z`,
        beamActive ? 0.96 : 0,
        'signal',
        0,
        0.8,
      ),
      line(frame.player.x, frame.player.y, frame.boss.x, frame.boss.y, strike, 'safe', 10),
      circle(frame.boss.x + 26, frame.boss.y - 18, 12 + strike * 24, strike, 'safe', 7, 0.14),
    ];
  }
  if (mode === 'forced-inertia') {
    const frozen = frame.forcedInertiaFrozen;
    const vectorVisible = frame.forcedInertiaVectorVisible;
    const sliding = frame.forcedInertiaSliding;
    const braking = frame.forcedInertiaBraking;
    const controlRestored = frame.forcedInertiaControlRestored;
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    const entry = point(spec.entryPoint);
    const brake = point(spec.brakePoint);
    return [
      path('M 42 105 L 492 88 L 492 879 L 42 879 Z', 0.54, 'muted', 0, 0.54),
      path('M 44 115 L 240 105 L 275 303 L 43 331 Z', 0.35, 'muted', 0, 0.62),
      path('M 249 105 L 488 98 L 489 316 L 283 301 Z', 0.4, 'muted', 0, 0.54),
      path('M 44 341 L 275 312 L 267 546 L 42 552 Z', 0.38, 'muted', 0, 0.58),
      path('M 283 313 L 488 325 L 489 546 L 275 546 Z', 0.32, 'muted', 0, 0.66),
      path('M 43 561 L 263 555 L 277 871 L 42 877 Z', 0.39, 'muted', 0, 0.52),
      path('M 271 555 L 488 552 L 489 876 L 285 873 Z', 0.35, 'muted', 0, 0.62),
      path('M 43 110 L 492 92 L 492 878 L 43 878 Z', frozen ? 0.5 : 0, 'accent', 0, 0.28),
      path('M 492 89 L 524 111 L 524 874 L 492 890 Z', 0.82, 'signal', 0, 0.45),
      path(
        'M 492 176 L 512 192 L 492 209 Z M 492 336 L 512 352 L 492 369 Z M 492 496 L 512 512 L 492 529 Z M 492 656 L 512 672 L 492 689 Z M 492 816 L 512 832 L 492 849 Z',
        frozen ? 0.88 : 0.3,
        'signal',
        0,
        0.78,
      ),
      path(
        `M ${entry.x - 7} ${entry.y - 9} L ${brake.x - 7} ${brake.y - 9} L ${brake.x + 7} ${brake.y + 9} L ${entry.x + 7} ${entry.y + 9} Z`,
        vectorVisible ? 0.56 : 0,
        'accent',
        0,
        0.5,
      ),
      path(
        'M 349 523 L 412 502 L 442 565 L 375 603 Z',
        vectorVisible ? 0.84 : 0.36,
        'muted',
        0,
        0.82,
      ),
      path(
        'M 359 543 L 371 537 M 377 552 L 384 548 M 369 570 L 380 562 M 390 578 L 402 571 M 389 528 L 400 521 M 409 541 L 420 533 M 406 560 L 418 553',
        vectorVisible ? 0.68 : 0.2,
        'safe',
        5,
      ),
      path(
        `M ${frame.player.x - 48} ${frame.player.y + 38} L ${frame.player.x - 7} ${frame.player.y + 12} L ${frame.player.x - 1} ${frame.player.y + 19} L ${frame.player.x - 39} ${frame.player.y + 48} Z`,
        sliding ? 0.78 : 0,
        'safe',
        0,
        0.64,
      ),
      path(
        `M ${frame.player.x - 65} ${frame.player.y + 52} L ${frame.player.x - 28} ${frame.player.y + 25} L ${frame.player.x - 22} ${frame.player.y + 33} L ${frame.player.x - 57} ${frame.player.y + 61} Z`,
        sliding ? 0.4 : 0,
        'accent',
        0,
        0.46,
      ),
      path(
        'M 352 522 L 365 506 L 371 529 Z M 417 528 L 440 520 L 429 544 Z M 406 585 L 429 601 L 395 600 Z',
        controlRestored ? 0.9 : braking ? 0.52 : 0,
        'safe',
        0,
        0.82,
      ),
      line(frame.player.x, frame.player.y, frame.boss.x, frame.boss.y, strike, 'safe', 10),
      circle(frame.boss.x + 24, frame.boss.y - 18, 12 + strike * 24, strike, 'safe', 7, 0.14),
    ];
  }
  if (mode === 'wraparound-projectile') {
    const linked = frame.wraparoundBoundaryLinked;
    const routeVisible = frame.wraparoundRouteVisible;
    const crossing = frame.wraparoundCrossing;
    const projectile = frame.wraparoundProjectilePoint;
    const projectileVisible = frame.wraparoundFirstPass || frame.wraparoundSecondPass;
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    return [
      path('M 36 100 L 524 100 L 524 880 L 36 880 Z', 0.54, 'muted', 0, 0.32),
      path('M 40 112 L 83 106 L 88 863 L 40 877 Z', 0.76, 'muted', 0, 0.72),
      path('M 477 106 L 520 112 L 520 877 L 472 863 Z', 0.76, 'muted', 0, 0.72),
      path(
        'M 63 132 L 74 166 L 63 196 L 53 166 Z M 63 300 L 74 334 L 63 364 L 53 334 Z M 63 468 L 74 502 L 63 532 L 53 502 Z M 63 636 L 74 670 L 63 700 L 53 670 Z M 63 804 L 74 838 L 63 866 L 53 838 Z',
        linked ? 0.9 : 0.22,
        'accent',
        0,
        0.82,
      ),
      path(
        'M 497 132 L 507 166 L 497 196 L 486 166 Z M 497 300 L 507 334 L 497 364 L 486 334 Z M 497 468 L 507 502 L 497 532 L 486 502 Z M 497 636 L 507 670 L 497 700 L 486 670 Z M 497 804 L 507 838 L 497 866 L 486 838 Z',
        linked ? 0.9 : 0.22,
        'accent',
        0,
        0.82,
      ),
      path('M 88 550 L 472 550 L 472 630 L 88 630 Z', 0.54, 'muted', 0, 0.68),
      path(
        'M 88 568 L 472 568 L 472 612 L 88 612 Z',
        routeVisible ? 0.55 : 0.08,
        'accent',
        0,
        0.44,
      ),
      path('M 167 415 L 190 424 L 205 547 L 183 566 L 176 535 Z', 0.58, 'muted', 0, 0.72),
      path(
        'M 166 561 L 194 547 L 220 590 L 194 633 L 166 619 L 183 590 Z',
        linked ? 0.84 : 0.48,
        linked ? 'accent' : 'muted',
        0,
        0.64,
      ),
      path('M 354 728 L 466 728 L 473 856 L 349 856 Z', 0.68, 'muted', 0, 0.78),
      path('M 410 745 L 434 790 L 410 834 L 386 790 Z', linked ? 0.42 : 0.18, 'safe', 0, 0.5),
      path(
        `M ${projectile.x - 22} ${projectile.y - 15} L ${projectile.x + 20} ${projectile.y} L ${projectile.x - 22} ${projectile.y + 15} L ${projectile.x - 10} ${projectile.y} Z`,
        projectileVisible ? 0.96 : 0,
        'signal',
        0,
        0.9,
      ),
      path(
        `M ${spec.rightBoundary - 16} ${spec.laneY - 20} L ${spec.rightBoundary + 12} ${spec.laneY} L ${spec.rightBoundary - 16} ${spec.laneY + 20} Z`,
        crossing ? 0.82 : 0,
        'signal',
        0,
        0.8,
      ),
      path(
        `M ${spec.leftBoundary - 12} ${spec.laneY - 20} L ${spec.leftBoundary + 16} ${spec.laneY} L ${spec.leftBoundary - 12} ${spec.laneY + 20} Z`,
        crossing ? 0.82 : 0,
        'signal',
        0,
        0.8,
      ),
      path(
        `M ${spec.leftBoundary + 7} ${spec.laneY - 45} L ${spec.leftBoundary + 22} ${spec.laneY - 24} L ${spec.leftBoundary + 5} ${spec.laneY - 18} Z M ${spec.rightBoundary - 7} ${spec.laneY + 45} L ${spec.rightBoundary - 22} ${spec.laneY + 24} L ${spec.rightBoundary - 5} ${spec.laneY + 18} Z`,
        crossing ? 0.9 : 0,
        'accent',
        0,
        0.82,
      ),
      line(frame.player.x, frame.player.y, frame.boss.x, frame.boss.y, strike, 'safe', 10),
      circle(frame.boss.x + 24, frame.boss.y - 18, 12 + strike * 24, strike, 'safe', 7, 0.14),
    ];
  }
  if (mode === 'beat-synced-attack') {
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    const activeLane = frame.beatSyncedAttackLane;
    const previewLane = frame.beatSyncedTelegraphLane;
    const phraseVisible = frame.time >= spec.beatOrigin && frame.time < spec.phraseClearsAt;
    const beatXs = [148, 236, 324, 412];
    const laneShape = (center) =>
      `M ${center - spec.laneHalfWidth} ${spec.laneTop} L ${center + spec.laneHalfWidth} ${spec.laneTop} L ${center + spec.laneHalfWidth} ${spec.laneBottom} L ${center - spec.laneHalfWidth} ${spec.laneBottom} Z`;
    return [
      path('M 54 95 L 506 95 L 517 886 L 43 886 Z', 0.52, 'muted', 0, 0.34),
      path('M 82 105 L 479 105 L 492 195 L 68 195 Z', 0.78, 'muted', 0, 0.74),
      path('M 100 132 L 460 132 L 468 177 L 92 177 Z', 0.42, 'accent', 0, 0.26),
      ...spec.lanes.map((center) => path(laneShape(center), 0.62, 'muted', 0, 0.68)),
      path('M 182 382 L 280 370 L 378 382 L 352 412 H 208 Z', 0.58, 'muted', 0, 0.82),
      ...spec.lanes.map((center) =>
        path(
          `M ${center - spec.laneHalfWidth} 546 H ${center + spec.laneHalfWidth} M ${center - spec.laneHalfWidth} 656 H ${center + spec.laneHalfWidth} M ${center - spec.laneHalfWidth} 766 H ${center + spec.laneHalfWidth}`,
          0.55,
          'muted',
          6,
        ),
      ),
      ...beatXs.map((x, index) =>
        path(
          `M ${x} 138 L ${x + 13} 155 L ${x} 172 L ${x - 13} 155 Z M ${x - 3} 145 L ${x + 4} 155 L ${x - 3} 165 Z`,
          phraseVisible
            ? index === frame.beatSyncedBeatSlot
              ? 0.66 + frame.beatSyncedBeatPulse * 0.32
              : 0.26
            : 0.12,
          index === frame.beatSyncedBeatSlot ? 'accent' : 'muted',
          0,
          0.88,
        ),
      ),
      ...spec.lanes.map((center, index) =>
        path(
          `M ${center} 455 L ${center + 20} 481 L ${center} 507 L ${center - 20} 481 Z M ${center} 465 V 497 M ${center - 12} 481 H ${center + 12}`,
          index === activeLane ? 0.98 : index === previewLane ? 0.82 : phraseVisible ? 0.34 : 0.18,
          index === activeLane ? 'signal' : 'accent',
          0,
          index === activeLane ? 0.82 : 0.44,
        ),
      ),
      path(
        'M 280 272 L 294 295 L 280 317 L 266 295 Z',
        phraseVisible ? 0.42 + frame.beatSyncedBeatPulse * 0.48 : 0.16,
        'accent',
        0,
        0.84,
      ),
      ...spec.lanes.map((center, index) =>
        path(
          laneShape(center),
          index === activeLane ? 0.92 : index === previewLane ? 0.56 : 0,
          index === activeLane ? 'signal' : 'accent',
          0,
          index === activeLane ? 0.62 : 0.3,
        ),
      ),
      line(frame.player.x, frame.player.y, frame.boss.x, frame.boss.y, strike, 'safe', 10),
      circle(frame.boss.x + 26, frame.boss.y - 16, 12 + strike * 24, strike, 'safe', 7, 0.14),
    ];
  }
  if (mode === 'secondary-cues-invisibility') {
    const hidden = frame.invisibilityHidden;
    const source = point(spec.hiddenRoute.at(-1));
    const laneEnd = point(spec.laneEnd);
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    const cuePoint = frame.invisibilityCuePoint;
    const laneLength = Math.hypot(laneEnd.x - source.x, laneEnd.y - source.y);
    const sideX = ((laneEnd.y - source.y) / laneLength) * spec.laneHalfWidth;
    const sideY = ((source.x - laneEnd.x) / laneLength) * spec.laneHalfWidth;
    const lane = `M ${source.x + sideX} ${source.y + sideY} L ${laneEnd.x + sideX} ${laneEnd.y + sideY} L ${laneEnd.x - sideX} ${laneEnd.y - sideY} L ${source.x - sideX} ${source.y - sideY} Z`;
    return [
      path('M 48 105 L 281 88 L 516 110 L 520 853 L 274 881 L 43 848 Z', 0.5, 'muted', 0, 0.32),
      path('M 50 119 L 272 103 L 281 336 L 49 344 Z', 0.42, 'muted', 0, 0.54),
      path('M 280 104 L 510 119 L 515 342 L 288 335 Z', 0.38, 'muted', 0, 0.61),
      path('M 50 360 L 185 350 L 196 502 L 48 524 Z', 0.46, 'muted', 0, 0.62),
      path('M 196 350 L 361 340 L 359 507 L 200 502 Z', 0.38, 'muted', 0, 0.54),
      path('M 368 348 L 511 362 L 515 526 L 362 508 Z', 0.44, 'muted', 0, 0.64),
      path('M 51 533 L 266 515 L 281 690 L 48 708 Z', 0.34, 'muted', 0, 0.5),
      path('M 273 518 L 516 535 L 514 715 L 283 691 Z', 0.43, 'muted', 0, 0.58),
      path('M 51 715 L 278 701 L 271 870 L 43 844 Z', 0.41, 'muted', 0, 0.6),
      path('M 285 703 L 516 724 L 519 846 L 279 873 Z', 0.35, 'muted', 0, 0.48),
      path(
        'M 99 182 L 118 174 L 138 184 M 407 220 L 428 211 L 448 222 M 93 376 L 110 369 L 126 378 M 412 387 L 431 379 L 448 389 M 91 777 L 111 769 L 129 779',
        0.3,
        'accent',
        4,
      ),
      ...spec.clues.map(({ point: [x, y] }, index) =>
        path(
          `M ${x - 14} ${y - 11} Q ${x - 7} ${y - 20} ${x} ${y - 12} L ${x + 2} ${y - 2} Q ${x - 4} ${y + 2} ${x - 12} ${y - 3} Z M ${x + 3} ${y + 7} Q ${x + 10} ${y - 2} ${x + 17} ${y + 5} L ${x + 18} ${y + 15} Q ${x + 10} ${y + 19} ${x + 4} ${y + 14} Z`,
          frame.invisibilityCueOpacities[index],
          'accent',
          0,
          0.88,
        ),
      ),
      path(
        arcPath(cuePoint, 20 + 27 * frame.invisibilityCuePulse, 0.1, 2.8),
        hidden ? 0.65 * (1 - frame.invisibilityCuePulse) : 0,
        'accent',
        4,
      ),
      path(
        `M ${cuePoint.x - 24} ${cuePoint.y + 14} L ${cuePoint.x - 10} ${cuePoint.y + 5} L ${cuePoint.x - 4} ${cuePoint.y + 17} Z M ${cuePoint.x + 12} ${cuePoint.y - 18} L ${cuePoint.x + 23} ${cuePoint.y - 6} L ${cuePoint.x + 8} ${cuePoint.y - 5} Z`,
        hidden ? 0.6 * (1 - frame.invisibilityCuePulse) : 0,
        'accent',
        0,
        0.76,
      ),
      path(lane, frame.invisibilitySourceLocked ? 0.42 : 0, 'accent', 0, 0.38),
      path(lane, frame.invisibilityAttackActive ? 0.9 : 0, 'signal', 0, 0.68),
      path(
        `M ${source.x - 38} ${source.y - 12} L ${source.x - 16} ${source.y - 30} L ${source.x - 12} ${source.y - 6} Z M ${source.x + 13} ${source.y + 3} L ${source.x + 42} ${source.y - 9} L ${source.x + 23} ${source.y + 19} Z`,
        frame.invisibilityRevealVisible ? 0.86 : 0,
        'safe',
        0,
        0.82,
      ),
      line(frame.player.x, frame.player.y, frame.boss.x, frame.boss.y, strike, 'safe', 10),
      circle(frame.boss.x + 26, frame.boss.y - 16, 12 + strike * 24, strike, 'safe', 7, 0.14),
    ];
  }
  if (mode === 'sound-detection') {
    const sound = point(spec.soundPoint);
    const heard = frame.soundDetectionHeard;
    const active = frame.soundDetectionAttackActive;
    const strike = strikePulse(frame.time, spec.punishAt, 0.38);
    const wave = frame.soundDetectionWaveProgress;
    const soundOpacity = frame.soundDetectionNoiseVisible ? 0.84 * (1 - wave * 0.68) : 0;
    return [
      path('M 62 360 L 150 342 L 238 360 L 212 378 H 88 Z', 0.65, 'muted', 0, 0.78),
      path('M 58 555 H 258 V 742 H 508 V 832 H 58 Z', 0.82, 'safe', 0, 0.22),
      path(
        'M 75 583 H 238 M 75 623 H 238 M 75 663 H 238 M 75 703 H 238 M 75 743 H 238 M 276 771 H 488 M 276 803 H 488',
        0.32,
        'muted',
        3,
      ),
      path('M 280 550 L 363 537 L 372 618 L 284 626 Z', 0.44, 'muted', 0, 0.48),
      path('M 372 539 L 500 558 L 495 635 L 378 618 Z', 0.42, 'muted', 0, 0.54),
      path('M 285 632 L 375 625 L 493 640 L 495 736 L 277 731 Z', 0.48, 'muted', 0, 0.58),
      path(
        `M ${sound.x - 26} ${sound.y - 13} L ${sound.x - 8} ${sound.y + 2} L ${sound.x + 5} ${sound.y - 16} L ${sound.x + 22} ${sound.y + 11} M ${sound.x - 6} ${sound.y + 2} L ${sound.x - 1} ${sound.y + 21}`,
        frame.time >= spec.noiseAt && frame.time < spec.searchEndsAt ? 0.74 : 0,
        'accent',
        5,
      ),
      path(
        `M ${sound.x - 16} ${sound.y - 27} L ${sound.x - 3} ${sound.y - 46} L ${sound.x + 10} ${sound.y - 25} Z`,
        strikePulse(frame.time, spec.noiseAt, 0.42),
        'signal',
        0,
        0.9,
      ),
      path(arcPath(sound, 50 + 132 * wave, -2.9, -1.45), soundOpacity, 'accent', 7),
      path(arcPath(sound, 32 + 98 * wave, -2.8, -1.5), soundOpacity * 0.6, 'accent', 5),
      path(
        `M ${frame.boss.x - 14} ${frame.boss.y - 91} L ${frame.boss.x - 24} ${frame.boss.y - 106} L ${frame.boss.x - 8} ${frame.boss.y - 100} Z M ${frame.boss.x + 14} ${frame.boss.y - 91} L ${frame.boss.x + 24} ${frame.boss.y - 106} L ${frame.boss.x + 8} ${frame.boss.y - 100} Z`,
        heard ? 0.88 : 0,
        'signal',
        0,
        0.82,
      ),
      path(
        `M ${sound.x - 13} ${sound.y - 8} H ${sound.x + 12} L ${sound.x + 22} ${sound.y + 8} H ${sound.x - 20} Z`,
        frame.soundDetectionSourceLocked ? 0.88 : 0,
        'signal',
        0,
        0.42,
      ),
      circle(
        sound.x,
        sound.y,
        spec.dangerRadius,
        active ? 0.86 : frame.soundDetectionSourceLocked ? 0.42 : 0,
        active ? 'signal' : 'accent',
        0,
        active ? 0.48 : 0.24,
      ),
      path('M 453 828 L 475 816 L 514 828 L 503 846 H 457 Z', 0.58, 'muted', 0, 0.78),
      path(
        `M ${frame.player.x + 17} ${frame.player.y - 24} L ${frame.boss.x + 18} ${frame.boss.y - 27}`,
        strike,
        'safe',
        8,
      ),
      path(
        `M ${frame.boss.x + 6} ${frame.boss.y - 36} L ${frame.boss.x + 27} ${frame.boss.y - 49} L ${frame.boss.x + 38} ${frame.boss.y - 21} Z`,
        strike,
        'signal',
        0,
        0.88,
      ),
    ];
  }
  if (mode === 'objective-linked-invulnerability') {
    const objectives = spec.objectives.map(point);
    const bossStrike = strikePulse(frame.time, spec.bossStrike, 0.36);
    const blocked = strikePulse(frame.time, spec.blockedStrike, 0.34);
    const protection = frame.objectiveShieldOpacity;
    const conduitPaths = [
      'M 314 350 L 394 468 L 445 600',
      'M 280 370 V 750',
      'M 246 350 L 166 468 L 115 600',
    ];
    return [
      path('M 156 365 L 280 342 L 404 365 L 372 384 H 188 Z', 0.64, 'muted', 0, 0.78),
      ...conduitPaths.map((data) => path(data, 0.58, 'muted', 7)),
      ...conduitPaths.map((data, index) =>
        path(data, index < frame.objectiveCompletedCount ? 0 : protection * 0.9, 'safe', 5),
      ),
      ...objectives.map(({ x, y }) =>
        path(
          `M ${x - 35} ${y + 18} H ${x + 35} L ${x + 44} ${y + 40} H ${x - 44} Z`,
          0.86,
          'muted',
          0,
          0.84,
        ),
      ),
      ...objectives.map(({ x, y }) =>
        path(`M ${x - 19} ${y - 12} H ${x + 19} V ${y + 20} H ${x - 19} Z`, 0.92, 'accent', 0, 0.8),
      ),
      ...objectives.map(({ x, y }, index) =>
        path(
          index < frame.objectiveCompletedCount
            ? `M ${x - 17} ${y - 17} L ${x - 4} ${y - 27} L ${x + 2} ${y - 13} L ${x + 13} ${y - 20} L ${x + 17} ${y - 7} H ${x - 17} Z`
            : `M ${x} ${y - 54} L ${x + 20} ${y - 23} L ${x} ${y - 4} L ${x - 20} ${y - 23} Z`,
          0.96,
          index < frame.objectiveCompletedCount ? 'muted' : 'safe',
          0,
          0.9,
        ),
      ),
      path(
        'M 280 174 L 368 226 L 376 316 L 280 372 L 184 316 L 192 226 Z',
        protection,
        'accent',
        0,
        0.23,
      ),
      path(
        'M 280 174 L 280 372 M 192 226 L 376 316 M 368 226 L 184 316',
        protection * 0.45,
        'accent',
        4,
      ),
      path(
        `M ${frame.boss.x} ${frame.boss.y - 46} L ${frame.boss.x + 19} ${frame.boss.y - 24} L ${frame.boss.x} ${frame.boss.y - 2} L ${frame.boss.x - 19} ${frame.boss.y - 24} Z`,
        frame.objectiveVulnerable ? 0.98 : 0,
        'signal',
        0,
        0.86,
      ),
      line(350, 365, 330, 349, blocked, 'safe', 9),
      path('M 318 337 L 337 343 L 342 363 L 326 356 Z', blocked, 'signal', 0, 0.9),
      ...objectives.map(({ x, y }, index) =>
        path(
          `M ${x - 27} ${y - 29} L ${x - 14} ${y - 42} M ${x + 16} ${y - 39} L ${x + 29} ${y - 25}`,
          strikePulse(frame.time, spec.objectiveHits[index], 0.28),
          'safe',
          6,
        ),
      ),
      line(
        frame.player.x + 18,
        frame.player.y - 22,
        frame.boss.x - 15,
        frame.boss.y - 8,
        bossStrike,
        'safe',
        9,
      ),
      path('M 245 264 L 265 242 L 283 261 L 265 284 Z', bossStrike, 'signal', 0, 0.92),
      path('M 182 60 H 378 V 76 H 182 Z', frame.objectiveVulnerable ? 0.6 : 0, 'muted', 0, 0.78),
      path(
        `M 182 60 H ${182 + 196 * frame.objectiveWindowRemaining} V 76 H 182 Z`,
        frame.objectiveVulnerable ? 0.96 : 0,
        'safe',
        0,
        0.9,
      ),
    ];
  }
  if (mode === 'wave-clear-objective') {
    const waveIndex = Math.max(0, Math.min(spec.waveEnemies.length - 1, frame.waveClearWave - 1));
    const enemies = spec.waveEnemies[waveIndex].map(point);
    const kills = spec.waveKills[waveIndex];
    const active = frame.waveClearSpawnQueueSealed;
    const resolved = frame.waveClearAllComplete;
    const gateOpacity = frame.time >= spec.resolveAt ? 0.12 : 0.92;
    const creature = (index) => {
      const enemy = enemies[index] ?? point(spec.gates[index % spec.gates.length]);
      const exists = index < kills.length;
      const alive = exists && active && frame.time < kills[index];
      const collapse = exists ? smooth((frame.time - kills[index]) / 0.22) : 1;
      const scale = index === 1 && waveIndex === 2 ? 1.35 : 1;
      const size = scale * (1 - collapse * 0.42);
      const bob = alive ? Math.sin(frame.time * 9 + index * 1.7) * 2 : collapse * 18;
      const x = enemy.x;
      const y = enemy.y + bob;
      const opacity = alive ? 0.96 : exists && active ? 0.38 * (1 - collapse) : 0;
      return { x, y, size, opacity, hit: exists ? strikePulse(frame.time, kills[index], 0.24) : 0 };
    };
    const creatures = [0, 1, 2].map(creature);
    const chest = point(spec.rewardChest);
    return [
      path('M 160 56 H 400 V 76 H 160 Z', 0.65, 'muted', 0, 0.78),
      path(
        `M 160 56 H ${160 + 240 * (frame.waveClearRemainingEnemies / Math.max(1, kills.length))} V 76 H 160 Z`,
        active ? 0.96 : 0,
        'signal',
        0,
        0.88,
      ),
      path('M 150 364 L 280 344 L 410 364 L 378 382 H 182 Z', 0.68, 'muted', 0, 0.78),
      path('M 155 393 H 405 V 415 H 155 Z', gateOpacity, 'muted', 0, 0.84),
      path(
        Array.from({ length: 8 }, (_, index) => {
          const x = 165 + index * 32;
          return `M ${x} 413 H ${x + 12} V 472 H ${x} Z`;
        }).join(' '),
        gateOpacity,
        'accent',
        0,
        0.74,
      ),
      ...[0, 1, 2].map((index) =>
        path(
          `M ${226 + index * 54} 429 L ${244 + index * 54} 429 L ${250 + index * 54} 442 L ${235 + index * 54} 456 L ${220 + index * 54} 442 Z`,
          gateOpacity,
          index < frame.waveClearCompletedWaves ? 'safe' : 'accent',
          0,
          index < frame.waveClearCompletedWaves ? 0.88 : 0.46,
        ),
      ),
      path('M 43 669 V 549 Q 70 520 97 549 V 669 H 43 Z', 0.88, 'muted', 0, 0.82),
      path('M 463 669 V 549 Q 490 520 517 549 V 669 H 463 Z', 0.88, 'muted', 0, 0.82),
      path('M 56 654 V 558 Q 70 540 84 558 V 654 Z', active ? 0.86 : 0.35, 'signal', 0, 0.36),
      path('M 476 654 V 558 Q 490 540 504 558 V 654 Z', active ? 0.86 : 0.35, 'signal', 0, 0.36),
      ...creatures.map(({ x, y, size, opacity }) =>
        path(
          `M ${x - 20 * size} ${y + 32 * size} Q ${x} ${y + 22 * size} ${x + 20 * size} ${y + 32 * size} Z`,
          opacity * 0.48,
          'muted',
          0,
          0.74,
        ),
      ),
      ...creatures.map(({ x, y, size, opacity }) =>
        path(
          `M ${x - 14 * size} ${y - 6 * size} L ${x - 25 * size} ${y + 4 * size} L ${x - 23 * size} ${y + 14 * size} L ${x - 14 * size} ${y + 10 * size} L ${x - 12 * size} ${y + 27 * size} H ${x - 2 * size} L ${x} ${y + 12 * size} L ${x + 2 * size} ${y + 27 * size} H ${x + 12 * size} L ${x + 14 * size} ${y + 10 * size} L ${x + 23 * size} ${y + 14 * size} L ${x + 25 * size} ${y + 4 * size} L ${x + 14 * size} ${y - 6 * size} Z`,
          opacity,
          'muted',
          0,
          0.92,
        ),
      ),
      ...creatures.map(({ x, y, size, opacity }) =>
        path(
          `M ${x - 16 * size} ${y - 18 * size} L ${x - 20 * size} ${y - 34 * size} L ${x - 7 * size} ${y - 27 * size} L ${x} ${y - 35 * size} L ${x + 7 * size} ${y - 27 * size} L ${x + 20 * size} ${y - 34 * size} L ${x + 16 * size} ${y - 18 * size} L ${x + 10 * size} ${y - 8 * size} H ${x - 10 * size} Z`,
          opacity,
          'signal',
          0,
          0.88,
        ),
      ),
      ...creatures.map(({ x, y, size, opacity }) =>
        path(
          `M ${x - 8 * size} ${y - 20 * size} H ${x - 3 * size} M ${x + 3 * size} ${y - 20 * size} H ${x + 8 * size}`,
          opacity,
          'muted',
          3,
        ),
      ),
      ...creatures.map(({ x, y, hit }) =>
        path(`M ${x - 28} ${y + 8} Q ${x} ${y - 42} ${x + 27} ${y + 4}`, hit, 'safe', 7),
      ),
      path(
        `M ${chest.x - 30} ${chest.y + 3} H ${chest.x + 30} V ${chest.y + 33} H ${chest.x - 30} Z`,
        0.88,
        'muted',
        0,
        0.86,
      ),
      path(
        frame.waveClearRewardOpen
          ? `M ${chest.x - 31} ${chest.y - 14} L ${chest.x + 31} ${chest.y - 24} L ${chest.x + 31} ${chest.y - 9} L ${chest.x - 31} ${chest.y + 1} Z`
          : `M ${chest.x - 31} ${chest.y - 9} H ${chest.x + 31} V ${chest.y + 7} H ${chest.x - 31} Z`,
        0.94,
        frame.waveClearRewardOpen ? 'safe' : 'accent',
        0,
        0.88,
      ),
      path(
        `M ${chest.x - 8} ${chest.y + 10} L ${chest.x} ${chest.y - 1} L ${chest.x + 8} ${chest.y + 10} L ${chest.x} ${chest.y + 21} Z`,
        frame.waveClearRewardOpen ? 0.98 : 0,
        'safe',
        0,
        0.94,
      ),
    ];
  }
  if (mode === 'environmental-weapon') {
    const power = point(spec.powerNode);
    const muzzle = point(spec.muzzle);
    const shotProgress = clamp((frame.time - spec.fireAt) / (spec.hitAt - spec.fireAt));
    const bolt = {
      x: mix(muzzle.x, frame.boss.x, shotProgress),
      y: mix(muzzle.y, frame.boss.y, shotProgress),
    };
    const boltVisible = frame.environmentalDeviceFired && !frame.environmentalBossDamaged;
    const aimVisible =
      frame.time >= spec.aimPreviewAt &&
      frame.time < spec.fireAt &&
      !frame.environmentalDeviceSpent;
    const impactPulse = strikePulse(frame.time, spec.hitAt, 0.42);
    const loaded = !frame.environmentalDeviceFired && !frame.environmentalDeviceSpent;
    return [
      rect(170, 58, 220, 16, 0.7, 'muted', 0.76),
      rect(170, 58, frame.environmentalBossDamaged ? 100 : 220, 16, 0.96, 'accent', 0.9),
      path('M 150 370 L 280 348 L 410 370 L 374 388 H 186 Z', 0.66, 'muted', 0, 0.76),
      path('M 176 530 L 226 520 L 232 650 L 216 665 H 178 L 166 649 Z', 0.74, 'muted', 0, 0.76),
      path('M 296 558 L 348 548 L 354 660 L 340 678 H 299 L 287 662 Z', 0.74, 'muted', 0, 0.76),
      path(
        `M ${power.x - 35} ${power.y + 21} H ${power.x + 35} L ${power.x + 42} ${power.y + 42} H ${power.x - 42} Z`,
        0.86,
        'muted',
        0,
        0.82,
      ),
      line(power.x, power.y + 17, power.x, power.y - 30, 0.96, 'accent', 9),
      path(
        `M ${power.x} ${power.y - 48} L ${power.x + 15} ${power.y - 31} L ${power.x} ${power.y - 14} L ${power.x - 15} ${power.y - 31} Z`,
        0.98,
        frame.environmentalDevicePowered ? 'safe' : 'accent',
        0,
        0.9,
      ),
      path(
        'M 112 580 V 707 H 388 L 414 690',
        frame.environmentalDevicePowered ? 0.86 : 0.52,
        frame.environmentalDevicePowered ? 'safe' : 'muted',
        8,
      ),
      path('M 374 688 L 470 688 L 482 717 H 362 Z', 0.9, 'muted', 0, 0.86),
      circle(390, 728, 18, 0.96, 'muted', 0, 0.94),
      circle(459, 728, 18, 0.96, 'muted', 0, 0.94),
      path(
        'M 389 652 L 444 652 L 461 685 H 376 Z',
        0.96,
        frame.environmentalDeviceSpent ? 'muted' : 'accent',
        0,
        0.82,
      ),
      line(425, 678, muzzle.x, muzzle.y, 0.96, 'accent', 18),
      path(
        'M 344 606 Q 357 564 385 590 Q 410 566 428 603',
        frame.environmentalDeviceSpent ? 0.45 : 0.94,
        'accent',
        8,
      ),
      line(423, 666, muzzle.x, muzzle.y, loaded ? 0.96 : 0, 'safe', 5),
      path('M 377 593 L 385 563 L 397 590 Z', loaded ? 0.96 : 0, 'safe', 0, 0.94),
      line(
        muzzle.x,
        muzzle.y,
        frame.boss.x,
        frame.boss.y,
        aimVisible ? (frame.environmentalAimLocked ? 0.72 : 0.34) : 0,
        frame.environmentalAimLocked ? 'signal' : 'accent',
        frame.environmentalAimLocked ? 5 : 3,
      ),
      line(muzzle.x, muzzle.y, bolt.x, bolt.y, boltVisible ? 0.66 : 0, 'safe', 7),
      path(
        `M ${bolt.x - 9} ${bolt.y + 16} L ${bolt.x} ${bolt.y - 24} L ${bolt.x + 9} ${bolt.y + 16} Z`,
        boltVisible ? 0.98 : 0,
        'safe',
        0,
        0.94,
      ),
      path(
        `M ${frame.boss.x - 18} ${frame.boss.y - 24} L ${frame.boss.x} ${frame.boss.y - 44} L ${frame.boss.x + 18} ${frame.boss.y - 24} L ${frame.boss.x} ${frame.boss.y - 4} Z`,
        frame.environmentalAimLocked && !frame.environmentalDeviceFired ? 0.94 : 0,
        'signal',
        0,
        0.82,
      ),
      path(
        `M ${frame.boss.x - 42} ${frame.boss.y - 23} L ${frame.boss.x} ${frame.boss.y - 48} L ${frame.boss.x + 42} ${frame.boss.y - 23} L ${frame.boss.x + 19} ${frame.boss.y + 16} H ${frame.boss.x - 19} Z`,
        impactPulse,
        'signal',
        0,
        0.76,
      ),
      path(
        'M 346 605 L 359 618 M 407 578 L 421 598',
        frame.environmentalDeviceSpent ? 0.88 : 0,
        'signal',
        6,
      ),
    ];
  }
  if (mode === 'player-controlled-boss') {
    const panel = point(spec.controllerPanel);
    const crown = point(spec.crown);
    const assignment = smooth(
      (frame.time - spec.candidateAt) / (spec.assignedAt - spec.candidateAt),
    );
    const remoteToken = {
      x: mix(panel.x, crown.x, assignment),
      y: mix(panel.y, crown.y, assignment),
    };
    const humanVisible =
      frame.playerBossCandidateFound &&
      !frame.playerBossHeartbeatLost &&
      !frame.playerBossAiTakeover;
    const laneVisible = frame.playerBossTelegraphVisible || frame.playerBossAttackActive;
    return [
      path('M 108 58 H 452 V 78 H 108 Z', 0.72, 'muted', 0, 0.74),
      path('M 108 58 H 452 V 78 H 108 Z', 0.96, 'safe', 0, 0.82),
      path('M 180 374 L 300 354 L 420 374 L 390 390 H 210 Z', 0.62, 'muted', 0, 0.7),
      path('M 52 555 L 172 555 L 182 572 H 42 Z', 0.62, 'muted', 0, 0.7),
      path(
        'M 62 484 Q 66 476 82 478 H 142 Q 158 476 162 484 L 177 526 Q 178 541 166 539 L 143 526 H 82 L 58 539 Q 46 541 47 526 Z',
        frame.playerBossAiTakeover ? 0.42 : 0.92,
        'accent',
        0,
        0.78,
      ),
      path('M 70 498 H 101 V 505 H 70 Z M 82 486 H 89 V 517 H 82 Z', 0.92, 'muted', 0, 0.9),
      circle(142, 495, 5, 0.92, 'muted', 0, 0.9),
      circle(155, 507, 5, 0.92, 'muted', 0, 0.9),
      circle(remoteToken.x, remoteToken.y, 12, humanVisible ? 0.98 : 0, 'safe', 0, 0.96),
      path(
        `M ${crown.x - 35} ${crown.y + 15} L ${crown.x - 30} ${crown.y - 13} L ${crown.x - 12} ${crown.y + 2} L ${crown.x} ${crown.y - 24} L ${crown.x + 12} ${crown.y + 2} L ${crown.x + 30} ${crown.y - 13} L ${crown.x + 35} ${crown.y + 15} Z`,
        frame.playerBossAssigned ? 0.98 : 0.46,
        frame.playerBossController === 'ai' ? 'signal' : 'safe',
        0,
        0.88,
      ),
      circle(crown.x, crown.y + 6, 7, frame.playerBossAssigned ? 0.98 : 0.4, 'muted', 0, 0.96),
      path(
        'M 97 487 L 126 525 M 126 487 L 97 525',
        frame.playerBossHeartbeatLost ? 0.98 : 0,
        'signal',
        6,
      ),
      path(
        'M 295 147 H 305 V 156 H 295 Z M 290 150 H 310 V 153 H 290 Z',
        frame.playerBossAiTakeover ? 0.98 : 0,
        'muted',
        0,
        0.96,
      ),
      path(
        'M 266 287 L 334 313 L 129 848 L 61 822 Z',
        laneVisible ? (frame.playerBossAttackActive ? 0.92 : 0.58) : 0,
        frame.playerBossAttackActive ? 'signal' : 'accent',
        0,
        frame.playerBossAttackActive ? 0.6 : 0.34,
      ),
      path('M 300 340 L 95 835', frame.playerBossAttackActive ? 0.9 : 0, 'signal', 8),
      path(
        'M 278 168 L 322 195 M 322 168 L 278 195',
        frame.playerBossFrozen ? 0.9 : 0,
        'signal',
        6,
      ),
    ];
  }
  if (mode === 'projectile-rally') {
    const orb = frame.projectileRallyOrb;
    const orbTone = frame.projectileRallyOwner === 'player' ? 'safe' : 'signal';
    const trailLength = 44 - frame.projectileRallySpeedTier * 7;
    const trailDirection = frame.projectileRallyOwner === 'player' ? 1 : -1;
    const playerHit = spec.playerContacts.some((contact) => Math.abs(frame.time - contact) < 0.12);
    const bossHit = spec.bossReturns.some((contact) => Math.abs(frame.time - contact) < 0.12);
    const impactPulse = strikePulse(frame.time, spec.bossMissAt, 0.48);
    const punishPulse = strikePulse(frame.time, spec.punishAt, 0.36);
    return [
      path('M 120 82 H 440 V 104 H 120 Z', 0.66, 'muted', 0, 0.64),
      path(
        `M 120 82 H ${frame.projectileRallyPunished ? 350 : 440} V 104 H 120 Z`,
        0.96,
        'accent',
        0,
        0.9,
      ),
      ...Array.from({ length: 5 }, (_, index) => {
        const y = 242 + index * 56;
        const recorded = index < frame.projectileRallyExchangeCount;
        return [
          path(
            `M 452 ${y - 17} L 479 ${y - 17} L 487 ${y + 7} L 466 ${y + 24} L 445 ${y + 7} Z`,
            0.9,
            recorded ? 'safe' : 'muted',
            0,
            recorded ? 0.86 : 0.62,
          ),
          path(
            `M 458 ${y - 4} L 466 ${y + 8} L 475 ${y - 4}`,
            recorded ? 0.94 : 0.24,
            recorded ? 'muted' : 'accent',
            3,
          ),
        ];
      }).flat(),
      path(
        `M ${orb.x - 9} ${orb.y + trailDirection * trailLength} L ${orb.x + 9} ${orb.y + trailDirection * trailLength} L ${orb.x + 16} ${orb.y} L ${orb.x - 16} ${orb.y} Z`,
        frame.projectileRallyOrbVisible ? 0.46 : 0,
        orbTone,
        0,
        0.48,
      ),
      circle(
        orb.x,
        orb.y,
        spec.projectileRadius,
        frame.projectileRallyOrbVisible ? 0.98 : 0,
        'muted',
        0,
        0.9,
      ),
      circle(orb.x, orb.y, 12, frame.projectileRallyOrbVisible ? 0.98 : 0, orbTone, 0, 0.88),
      path(
        `M ${orb.x - 6} ${orb.y - 7} L ${orb.x} ${orb.y + 2} L ${orb.x + 6} ${orb.y - 7} M ${orb.x} ${orb.y + 2} V ${orb.y + 9}`,
        frame.projectileRallyOrbVisible ? 0.96 : 0,
        'muted',
        3,
      ),
      path(`M 260 624 L 300 604 L 340 624 L 300 616 Z`, playerHit ? 0.92 : 0, 'safe', 0, 0.82),
      path(`M 260 408 L 300 428 L 340 408 L 300 416 Z`, bossHit ? 0.92 : 0, 'accent', 0, 0.82),
      circle(
        spec.bossContact[0],
        spec.bossContact[1],
        spec.projectileRadius + 24,
        impactPulse * 0.74,
        'signal',
        0,
        0.5,
      ),
      path(
        `M ${frame.boss.x - 17} ${frame.boss.y + 3} L ${frame.boss.x} ${frame.boss.y - 3} L ${frame.boss.x + 17} ${frame.boss.y + 3} L ${frame.boss.x + 12} ${frame.boss.y + 27} L ${frame.boss.x} ${frame.boss.y + 34} L ${frame.boss.x - 12} ${frame.boss.y + 27} Z`,
        frame.projectileRallyVulnerable ? 0.96 : 0.18,
        'signal',
        0,
        0.88,
      ),
      path(
        `M ${frame.boss.x - 8} ${frame.boss.y + 6} L ${frame.boss.x + 4} ${frame.boss.y + 15} L ${frame.boss.x - 2} ${frame.boss.y + 25} L ${frame.boss.x + 9} ${frame.boss.y + 33}`,
        frame.projectileRallyVulnerable ? 0.96 : 0,
        'muted',
        4,
      ),
      path(
        `M ${frame.player.x - 10} ${frame.player.y - 48} L ${frame.boss.x - 9} ${frame.boss.y + 29} L ${frame.boss.x + 16} ${frame.boss.y + 16} L ${frame.player.x + 6} ${frame.player.y - 42} Z`,
        punishPulse * 0.8,
        'accent',
        0,
        0.76,
      ),
    ];
  }
  if (mode === 'baited-self-hit') {
    const trap = point(spec.trap);
    const target = point(spec.target);
    const startBoss = point(spec.boss);
    const blastPulse = strikePulse(frame.time, spec.selfHitAt, 0.58);
    const punishPulse = strikePulse(frame.time, spec.punishAt, 0.36);
    const bossHealth = frame.baitPunished ? 108 : frame.baitSelfHitResolved ? 138 : 172;
    const armed = frame.baitTrapArmed && !frame.baitTrapConsumed;
    const targetOpacity = frame.baitTargetAcquired && !frame.baitSelfHitResolved ? 0.86 : 0;
    const corridorOpacity = frame.baitChargeActive
      ? 0.72
      : frame.baitTargetAcquired && !frame.baitSelfHitResolved
        ? 0.34
        : 0;
    return [
      path('M 120 80 H 440 V 102 H 120 Z', 0.66, 'muted', 0, 0.62),
      path(
        `M 120 80 H ${120 + (320 * bossHealth) / 172} V 102 H 120 Z`,
        0.96,
        frame.baitSelfHitResolved ? 'signal' : 'accent',
        0,
        0.88,
      ),
      path(
        `M ${startBoss.x - spec.laneHalfWidth} ${startBoss.y + 55} H ${startBoss.x + spec.laneHalfWidth} V ${spec.laneEnd[1]} H ${startBoss.x - spec.laneHalfWidth} Z`,
        corridorOpacity,
        frame.baitTargetLocked ? 'signal' : 'accent',
        0,
        frame.baitChargeActive ? 0.52 : 0.32,
      ),
      path(
        `M ${target.x - 27} ${target.y - 25} L ${target.x - 10} ${target.y - 30} L ${target.x - 7} ${target.y + 3} L ${target.x - 25} ${target.y + 9} Z`,
        targetOpacity,
        'signal',
        0,
        0.68,
      ),
      path(
        `M ${target.x + 10} ${target.y - 30} L ${target.x + 27} ${target.y - 25} L ${target.x + 25} ${target.y + 9} L ${target.x + 7} ${target.y + 3} Z`,
        targetOpacity,
        'signal',
        0,
        0.68,
      ),
      circle(
        trap.x,
        trap.y,
        spec.trapRadius,
        armed ? 0.98 : frame.baitTrapConsumed ? 0 : 0.66,
        'muted',
        0,
        0.88,
      ),
      path(
        `M ${trap.x - 10} ${trap.y - 15} L ${trap.x} ${trap.y - 4} L ${trap.x + 10} ${trap.y - 15} M ${trap.x} ${trap.y - 4} V ${trap.y + 16}`,
        armed ? 0.98 : 0,
        'safe',
        4,
      ),
      path(
        `M ${trap.x - 36} ${trap.y - 9} L ${trap.x - 23} ${trap.y - 26} L ${trap.x - 19} ${trap.y + 1} Z`,
        armed ? 0.96 : 0,
        'accent',
        0,
        0.84,
      ),
      path(
        `M ${trap.x + 36} ${trap.y - 9} L ${trap.x + 23} ${trap.y - 26} L ${trap.x + 19} ${trap.y + 1} Z`,
        armed ? 0.96 : 0,
        'accent',
        0,
        0.84,
      ),
      circle(trap.x, trap.y, spec.blastRadius, blastPulse * 0.9, 'signal', 0, 0.62),
      path(
        `M ${trap.x - 42} ${trap.y - 30} L ${trap.x - 9} ${trap.y - 11} L ${trap.x - 30} ${trap.y + 18} Z`,
        frame.baitTrapConsumed ? 0.88 : 0,
        'muted',
        0,
        0.86,
      ),
      path(
        `M ${trap.x + 42} ${trap.y - 30} L ${trap.x + 9} ${trap.y - 11} L ${trap.x + 30} ${trap.y + 18} Z`,
        frame.baitTrapConsumed ? 0.88 : 0,
        'muted',
        0,
        0.86,
      ),
      path(
        `M ${trap.x - 12} ${trap.y + 7} L ${trap.x + 15} ${trap.y + 19} L ${trap.x - 4} ${trap.y + 35} Z`,
        frame.baitTrapConsumed ? 0.86 : 0,
        'accent',
        0,
        0.84,
      ),
      path(
        `M ${frame.boss.x - 18} ${frame.boss.y + 5} L ${frame.boss.x} ${frame.boss.y - 3} L ${frame.boss.x + 18} ${frame.boss.y + 5} L ${frame.boss.x + 13} ${frame.boss.y + 27} L ${frame.boss.x} ${frame.boss.y + 35} L ${frame.boss.x - 13} ${frame.boss.y + 27} Z`,
        frame.baitVulnerable ? 0.96 : 0.18,
        'signal',
        0,
        0.86,
      ),
      path(
        `M ${frame.boss.x - 7} ${frame.boss.y + 4} L ${frame.boss.x + 4} ${frame.boss.y + 15} L ${frame.boss.x - 2} ${frame.boss.y + 25} L ${frame.boss.x + 10} ${frame.boss.y + 33}`,
        frame.baitVulnerable ? 0.98 : 0,
        'muted',
        4,
      ),
      path(
        `M ${frame.player.x - 12} ${frame.player.y - 49} L ${frame.boss.x - 8} ${frame.boss.y + 27} L ${frame.boss.x + 15} ${frame.boss.y + 14} L ${frame.player.x + 5} ${frame.player.y - 41} Z`,
        punishPulse * 0.82,
        'accent',
        0,
        0.76,
      ),
    ];
  }
  if (mode === 'posture-stagger-gauge') {
    const postureEnd = 120 + (320 * frame.postureValue) / 100;
    const healthEnd = 120 + (320 * (frame.postureFinisherConsumed ? 116 : 172)) / 172;
    const contactPulse = Math.max(
      ...spec.contacts.map((contact) => strikePulse(frame.time, contact, 0.28)),
    );
    const finisherPulse = strikePulse(frame.time, spec.finisherAt, 0.44);
    const criticalRemaining = frame.postureCriticalReady
      ? clamp((spec.criticalEndsAt - frame.time) / (spec.criticalEndsAt - spec.criticalReadyAt))
      : 0;
    return [
      path('M 120 71 H 440 V 91 H 120 Z', 0.66, 'muted', 0, 0.64),
      path(
        `M 120 71 H ${postureEnd} V 91 H 120 Z`,
        frame.postureValue > 0 ? 0.98 : 0,
        frame.postureBroken ? 'signal' : 'accent',
        0,
        0.9,
      ),
      path('M 84 67 L 105 77 L 100 96 L 84 108 L 68 96 L 63 77 Z', 0.96, 'accent', 0, 0.85),
      path('M 120 108 H 440 V 124 H 120 Z', 0.68, 'muted', 0, 0.62),
      path(`M 120 108 H ${healthEnd} V 124 H 120 Z`, 0.98, 'safe', 0, 0.9),
      path(
        'M 86 111 C 75 99 59 110 64 125 L 86 145 L 108 125 C 113 110 97 99 86 111 Z',
        0.96,
        'safe',
        0,
        0.86,
      ),
      ...Array.from({ length: 3 }, (_, index) => {
        const y = 230 + index * 57;
        const remaining = index < frame.posturePhaseTokens;
        return [
          path(
            `M 62 ${y - 19} L 92 ${y - 19} L 101 ${y + 9} L 77 ${y + 26} L 53 ${y + 9} Z`,
            0.94,
            remaining ? 'safe' : 'muted',
            0,
            remaining ? 0.84 : 0.6,
          ),
          path(`M 65 ${y + 3} L 77 ${y - 5} L 89 ${y + 3}`, remaining ? 0.88 : 0.2, 'muted', 3),
        ];
      }).flat(),
      path(
        `M ${frame.boss.x - 18} ${frame.boss.y + 3} L ${frame.boss.x} ${frame.boss.y - 5} L ${frame.boss.x + 18} ${frame.boss.y + 3} L ${frame.boss.x + 14} ${frame.boss.y + 27} L ${frame.boss.x} ${frame.boss.y + 35} L ${frame.boss.x - 14} ${frame.boss.y + 27} Z`,
        frame.postureCriticalReady || frame.postureFinisherConsumed ? 0.98 : 0.2,
        frame.postureFinisherConsumed ? 'safe' : 'signal',
        0,
        0.92,
      ),
      path(
        `M ${frame.boss.x - 44} ${frame.boss.y + 27} L ${frame.boss.x - 20} ${frame.boss.y + 7} L ${frame.boss.x - 15} ${frame.boss.y + 25} Z`,
        contactPulse * 0.92,
        'accent',
        0,
        0.86,
      ),
      path(
        `M ${frame.boss.x + 42} ${frame.boss.y + 20} L ${frame.boss.x + 23} ${frame.boss.y + 4} L ${frame.boss.x + 19} ${frame.boss.y + 30} Z`,
        contactPulse * 0.92,
        'accent',
        0,
        0.86,
      ),
      path('M 372 341 H 493 V 356 H 372 Z', frame.postureCriticalReady ? 0.74 : 0, 'muted', 0, 0.7),
      path(
        `M 372 341 H ${372 + 121 * criticalRemaining} V 356 H 372 Z`,
        frame.postureCriticalReady ? 0.98 : 0,
        'signal',
        0,
        0.9,
      ),
      path(
        'M 497 333 H 517 L 507 348 L 517 363 H 497 L 507 348 Z',
        frame.postureCriticalReady ? 0.96 : 0,
        'signal',
        0,
        0.85,
      ),
      path(
        `M ${frame.player.x - 18} ${frame.player.y - 58} L ${frame.boss.x - 8} ${frame.boss.y + 26} L ${frame.boss.x + 20} ${frame.boss.y + 16} L ${frame.player.x + 4} ${frame.player.y - 52} Z`,
        finisherPulse * 0.82,
        'signal',
        0,
        0.72,
      ),
    ];
  }
  if (mode === 'pacifist-resolution') {
    const liveAttack = spec.attacks[frame.pacifistAttackIndex];
    const laneX = liveAttack?.laneX ?? spec.attacks[0].laneX;
    const sheathed = frame.time >= spec.sheathAt && frame.time < spec.resetAt;
    const leafVisible = frame.pacifistChoiceOffered || frame.pacifistSpareCommitted;
    const doorVisible = frame.pacifistResolved ? 0.96 : 0;
    const swordX = frame.player.x - 34;
    const swordY = frame.player.y - 25;
    return [
      path('M 120 70 H 440 V 88 H 120 Z', 0.7, 'muted', 0, 0.68),
      path(
        `M 120 70 H ${120 + 320 * frame.pacifistRestraintProgress} V 88 H 120 Z`,
        frame.pacifistRestraintProgress > 0 ? 0.98 : 0,
        frame.pacifistConditionComplete ? 'safe' : 'accent',
        0,
        0.9,
      ),
      path('M 69 65 H 101 L 85 79 L 101 93 H 69 L 85 79 Z', 0.94, 'accent', 0, 0.8),
      path('M 120 101 H 440 V 117 H 120 Z', 0.98, 'safe', 0, 0.88),
      path(
        'M 86 103 C 74 89 55 104 61 119 L 86 142 L 111 119 C 117 104 98 89 86 103 Z',
        0.96,
        'safe',
        0,
        0.86,
      ),
      path(
        `M ${laneX - spec.laneHalfWidth} ${spec.laneTop} H ${laneX + spec.laneHalfWidth} V ${spec.laneBottom} H ${laneX - spec.laneHalfWidth} Z`,
        frame.pacifistAttackActive ? 0.85 : frame.pacifistAttackTelegraph ? 0.45 : 0,
        'signal',
        0,
        frame.pacifistAttackActive ? 0.62 : 0.36,
      ),
      path(
        `M ${swordX - 7} ${swordY - 30} L ${swordX + 8} ${swordY - 28} L ${swordX + 17} ${swordY + 18} L ${swordX + 1} ${swordY + 23} Z`,
        sheathed ? 0.98 : 0,
        'muted',
        0,
        0.4,
      ),
      path(
        `M ${swordX} ${swordY - 40} L ${swordX + 6} ${swordY - 28} M ${swordX - 10} ${swordY - 34} L ${swordX + 10} ${swordY - 38}`,
        sheathed ? 0.98 : 0,
        'accent',
        4,
      ),
      path(
        'M 367 187 C 342 189 345 224 364 228 C 389 226 393 195 367 187 Z',
        leafVisible ? 0.96 : 0,
        'safe',
        0,
        0.86,
      ),
      path('M 354 224 Q 369 211 380 197 M 354 224 L 347 237', leafVisible ? 0.96 : 0, 'muted', 4),
      path('M 420 390 Q 460 357 500 390 V 542 H 420 Z', doorVisible, 'muted', 0, 0.86),
      path('M 433 401 Q 460 379 487 401 V 539 H 433 Z', doorVisible, 'safe', 0, 0.22),
      path('M 438 430 L 453 416 L 470 430 L 453 443 Z', doorVisible, 'safe', 0, 0.9),
      path('M 74 232 L 106 232 L 113 274 L 90 286 L 67 274 Z', doorVisible, 'muted', 0, 0.86),
      path(
        'M 90 246 C 72 250 79 272 90 272 C 103 270 107 249 90 246 Z',
        doorVisible,
        'safe',
        0,
        0.84,
      ),
    ];
  }
  if (mode === 'persistent-progress') {
    const activeHazard = spec.hazards[frame.persistentProgressHazardIndex];
    const laneY = activeHazard?.laneY ?? spec.laneStart[1];
    const restorePulse = frame.persistentProgressRestoring
      ? 0.72 + pulse(frame.time * 3) * 0.22
      : 0;
    const anchors = spec.anchors.flatMap(([x, y], index) => {
      const broken = frame.time >= spec.strikes[index] && frame.time < spec.resetAt;
      const active = !broken;
      return [
        path(
          `M ${x - 37} ${y + 30} L ${x + 37} ${y + 30} L ${x + 45} ${y + 47} H ${x - 45} Z`,
          0.88,
          'muted',
          0,
          0.82,
        ),
        path(
          `M ${x - 25} ${y + 28} L ${x - 24} ${y - 15} L ${x} ${y - 51} L ${x + 24} ${y - 15} L ${x + 25} ${y + 28} Z`,
          active ? 0.96 : 0,
          'accent',
          0,
          0.88,
        ),
        path(
          `M ${x} ${y - 35} L ${x - 8} ${y - 6} L ${x} ${y + 7} L ${x + 8} ${y - 6} Z`,
          active ? 0.98 : 0,
          'muted',
          0,
          0.8,
        ),
        path(
          `M ${x - 31} ${y + 21} L ${x - 7} ${y + 6} L ${x + 1} ${y + 30} Z`,
          broken ? 0.94 : 0,
          'muted',
          0,
          0.88,
        ),
        path(
          `M ${x + 7} ${y + 13} L ${x + 28} ${y + 23} L ${x + 10} ${y + 33} Z`,
          broken ? 0.94 : 0,
          'accent',
          0,
          0.78,
        ),
        path(
          `M ${x - 8} ${y - 26} L ${x + 8} ${y - 17} L ${x + 1} ${y + 2} Z`,
          broken ? 0.82 : 0,
          'accent',
          0,
          0.76,
        ),
        path(
          `M ${frame.boss.x + (index === 0 ? -26 : 26)} ${frame.boss.y + 27} L ${x - 6} ${y - 26} L ${x + 6} ${y - 20} L ${frame.boss.x + (index === 0 ? -17 : 17)} ${frame.boss.y + 30} Z`,
          active ? 0.46 : 0,
          'muted',
          0,
          0.72,
        ),
      ];
    });
    return [
      path('M 120 75 H 440 V 95 H 120 Z', 0.66, 'muted', 0, 0.62),
      path(
        `M 120 75 H ${120 + (320 * frame.persistentProgressBossHealth) / 100} V 95 H 120 Z`,
        0.94,
        frame.persistentProgressResolved ? 'safe' : 'signal',
        0,
        0.86,
      ),
      ...Array.from({ length: 3 }, (_, index) => {
        const x = 90;
        const y = 190 + index * 60;
        const complete = index < frame.persistentProgressCompletedObjectives;
        return [
          path(
            `M ${x - 23} ${y - 20} L ${x + 23} ${y - 20} L ${x + 26} ${y + 8} L ${x} ${y + 20} L ${x - 26} ${y + 8} Z`,
            0.94,
            complete ? 'safe' : 'muted',
            0,
            complete ? 0.88 : 0.72,
          ),
          path(
            `M ${x - 7} ${y - 9} L ${x} ${y + 5} L ${x + 7} ${y - 9}`,
            complete ? 0.96 : 0.28,
            complete ? 'muted' : 'accent',
            3,
          ),
        ];
      }).flat(),
      ...anchors,
      path(
        `M ${frame.boss.x - 16} ${frame.boss.y + 7} L ${frame.boss.x} ${frame.boss.y - 2} L ${frame.boss.x + 16} ${frame.boss.y + 7} L ${frame.boss.x + 12} ${frame.boss.y + 26} L ${frame.boss.x} ${frame.boss.y + 34} L ${frame.boss.x - 12} ${frame.boss.y + 26} Z`,
        frame.persistentProgressCoreOpen ? 0.98 : 0.22,
        frame.persistentProgressResolved ? 'safe' : 'accent',
        0,
        0.94,
      ),
      path(
        `M ${spec.laneStart[0]} ${laneY - spec.laneHalfWidth} H ${spec.laneEnd[0]} V ${laneY + spec.laneHalfWidth} H ${spec.laneStart[0]} Z`,
        frame.persistentProgressHazardActive
          ? 0.86
          : frame.persistentProgressHazardTelegraph
            ? 0.38
            : 0,
        'signal',
        0,
        frame.persistentProgressHazardActive ? 0.72 : 0.36,
      ),
      path(
        `M ${spec.player[0] - 26} ${spec.player[1] + 20} L ${spec.player[0] + 26} ${spec.player[1] + 20} L ${spec.player[0] + 36} ${spec.player[1] + 31} H ${spec.player[0] - 36} Z`,
        restorePulse,
        'safe',
        0,
        0.46,
      ),
      circle(440, 255, 18, frame.persistentProgressResolved ? 0.98 : 0, 'accent', 0, 0.9),
      circle(440, 255, 8, frame.persistentProgressResolved ? 0.98 : 0, 'muted', 0, 0.9),
      path(
        'M 434 268 H 446 V 290 H 465 V 301 H 453 V 312 H 434 Z',
        frame.persistentProgressResolved ? 0.98 : 0,
        'accent',
        0,
        0.9,
      ),
    ];
  }
  if (mode === 'status-buildup') {
    const contactPulse = Math.max(
      ...spec.contacts.map((contact) => strikePulse(frame.time, contact, 0.34)),
    );
    const ignoredPulse = strikePulse(frame.time, spec.immuneProbeAt, 0.36);
    const effectOpacity = frame.statusBuildupEffectActive ? 0.96 : 0;
    const shieldOpacity = frame.statusBuildupImmune ? 0.96 : 0;
    const gaugeEnd = 120 + (320 * frame.statusBuildupValue) / 100;
    const shieldX = frame.player.x + 72;
    const shieldY = frame.player.y - 102;
    return [
      circle(
        frame.boss.x,
        frame.boss.y,
        spec.auraRadius,
        frame.statusBuildupContactActive ? 0.66 : 0.36,
        frame.statusBuildupContactActive ? 'signal' : 'accent',
        0,
        frame.statusBuildupContactActive ? 0.34 : 0.16,
      ),
      ...Array.from({ length: 4 }, (_, index) => {
        const angle = (-3 * Math.PI) / 4 + (index * Math.PI) / 2;
        const x = frame.boss.x + Math.cos(angle) * 216;
        const y = frame.boss.y + Math.sin(angle) * 216;
        return [
          path(
            `M ${x - 15} ${y - 15} L ${x + 10} ${y - 18} L ${x + 17} ${y - 3} L ${x + 13} ${y + 15} L ${x - 12} ${y + 17} L ${x - 17} ${y - 2} Z`,
            0.9,
            'muted',
            0,
            0.86,
          ),
          path(
            `M ${x - 7} ${y - 6} L ${x} ${y + 4} L ${x + 7} ${y - 7} M ${x} ${y + 4} L ${x} ${y + 10}`,
            frame.statusBuildupContactActive ? 0.98 : 0.6,
            'accent',
            3,
          ),
        ];
      }).flat(),
      path('M 120 90 H 440 V 116 H 120 Z', 0.76, 'muted', 0, 0.72),
      path(
        `M 120 90 H ${gaugeEnd} V 116 H 120 Z`,
        frame.statusBuildupValue > 0 ? 0.98 : 0,
        frame.statusBuildupThresholdReached ? 'signal' : 'accent',
        0,
        0.92,
      ),
      path('M 450 87 L 465 96 L 461 114 L 448 122 L 438 111 L 440 94 Z', 0.94, 'muted', 0, 0.86),
      path(
        'M 449 95 L 455 103 L 446 114 M 455 103 L 461 100',
        frame.statusBuildupThresholdReached ? 0.98 : 0.68,
        'signal',
        3,
      ),
      path(
        `M ${frame.boss.x - 23} ${frame.boss.y + 17} Q ${frame.boss.x + 43} ${frame.boss.y + 130} ${frame.player.x - 34} ${frame.player.y - 41} L ${frame.player.x - 16} ${frame.player.y - 45} Q ${frame.boss.x + 54} ${frame.boss.y + 113} ${frame.boss.x - 13} ${frame.boss.y + 16} Z`,
        contactPulse * 0.72,
        'signal',
        0,
        0.68,
      ),
      path(
        `M ${frame.player.x - 52} ${frame.player.y - 56} L ${frame.player.x - 26} ${frame.player.y - 59} L ${frame.player.x - 23} ${frame.player.y - 20} L ${frame.player.x - 48} ${frame.player.y - 17} Z`,
        effectOpacity,
        'signal',
        0,
        0.92,
      ),
      path(
        `M ${frame.player.x + 52} ${frame.player.y - 56} L ${frame.player.x + 26} ${frame.player.y - 59} L ${frame.player.x + 23} ${frame.player.y - 20} L ${frame.player.x + 48} ${frame.player.y - 17} Z`,
        effectOpacity,
        'signal',
        0,
        0.92,
      ),
      path(
        `M ${frame.player.x - 43} ${frame.player.y - 47} L ${frame.player.x - 32} ${frame.player.y - 29} M ${frame.player.x + 43} ${frame.player.y - 47} L ${frame.player.x + 32} ${frame.player.y - 29}`,
        effectOpacity,
        'muted',
        4,
      ),
      path(
        `M ${shieldX} ${shieldY - 32} L ${shieldX + 28} ${shieldY - 17} L ${shieldX + 24} ${shieldY + 19} L ${shieldX} ${shieldY + 35} L ${shieldX - 24} ${shieldY + 19} L ${shieldX - 28} ${shieldY - 17} Z`,
        shieldOpacity,
        'safe',
        0,
        0.88,
      ),
      path(
        `M ${shieldX - 11} ${shieldY - 1} L ${shieldX - 2} ${shieldY + 9} L ${shieldX + 13} ${shieldY - 13}`,
        shieldOpacity,
        'muted',
        5,
      ),
      path(
        `M ${shieldX - 53} ${shieldY - 6} L ${shieldX - 29} ${shieldY - 16} L ${shieldX - 29} ${shieldY + 4} Z`,
        ignoredPulse * 0.9,
        'signal',
        0,
        0.9,
      ),
    ];
  }
  if (mode === 'instant-kill') {
    const center = point(spec.executionCenter);
    const firstTelegraph = frame.time >= spec.firstTelegraph[0] && frame.time < spec.firstResolveAt;
    const secondTelegraph = frame.time >= spec.secondTelegraph[0] && frame.time < spec.executeAt;
    const telegraph = firstTelegraph || secondTelegraph;
    const countdown = secondTelegraph
      ? clamp((frame.time - spec.secondTelegraph[0]) / (spec.executeAt - spec.secondTelegraph[0]))
      : firstTelegraph
        ? clamp(
            (frame.time - spec.firstTelegraph[0]) / (spec.firstResolveAt - spec.firstTelegraph[0]),
          )
        : 0;
    const resolvePulse = Math.max(
      strikePulse(frame.time, spec.firstResolveAt, 0.36),
      strikePulse(frame.time, spec.executeAt, 0.48),
    );
    const trapOpacity = telegraph
      ? 0.64
      : frame.instantKillConditionLocked
        ? 0.85
        : frame.instantKillFirstAvoided
          ? 0.12
          : 0.28;
    const bladeOpacity = frame.instantKillAttemptEnded ? 0.98 : resolvePulse * 0.76;
    const tetherOpacity = telegraph || frame.instantKillConditionLocked ? 0.66 : 0;
    return [
      path('M 120 93 H 440 V 117 H 120 Z', 0.72, 'muted', 0, 0.64),
      path('M 120 93 H 440 V 117 H 120 Z', 0.98, 'safe', 0, 0.9),
      path(
        'M 86 95 C 74 82 55 96 61 112 L 86 136 L 111 112 C 117 96 98 82 86 95 Z',
        0.96,
        'safe',
        0,
        0.86,
      ),
      path(
        `M ${frame.boss.x - 34} ${frame.boss.y + 24} L ${center.x - 92} ${center.y - 92} L ${center.x - 82} ${center.y - 88} L ${frame.boss.x - 23} ${frame.boss.y + 28} Z`,
        tetherOpacity,
        'muted',
        0,
        0.76,
      ),
      path(
        `M ${frame.boss.x + 34} ${frame.boss.y + 24} L ${center.x + 92} ${center.y - 92} L ${center.x + 82} ${center.y - 88} L ${frame.boss.x + 23} ${frame.boss.y + 28} Z`,
        tetherOpacity,
        'muted',
        0,
        0.76,
      ),
      circle(
        center.x,
        center.y,
        spec.executionRadius,
        trapOpacity,
        frame.instantKillConditionLocked ? 'signal' : 'accent',
        0,
        telegraph ? 0.3 : 0.18,
      ),
      ...Array.from({ length: 6 }, (_, index) => {
        const angle = (index * Math.PI) / 3 - Math.PI / 2;
        const radialX = Math.cos(angle);
        const radialY = Math.sin(angle);
        const tangentX = -radialY;
        const tangentY = radialX;
        const tipX = center.x + radialX * 73;
        const tipY = center.y + radialY * 73;
        const baseX = center.x + radialX * 116;
        const baseY = center.y + radialY * 116;
        const active = telegraph && index < Math.ceil(countdown * 6);
        return [
          path(
            `M ${baseX + tangentX * 12} ${baseY + tangentY * 12} L ${tipX} ${tipY} L ${baseX - tangentX * 12} ${baseY - tangentY * 12} Z`,
            frame.instantKillConditionLocked ? 0.98 : active ? 0.94 : telegraph ? 0.38 : 0.18,
            frame.instantKillConditionLocked || active ? 'signal' : 'muted',
            0,
            0.85,
          ),
          path(
            `M ${center.x + radialX * 106} ${center.y + radialY * 106} L ${center.x + radialX * 92} ${center.y + radialY * 92}`,
            frame.instantKillConditionLocked || active ? 0.96 : 0.28,
            'accent',
            3,
          ),
        ];
      }).flat(),
      path(
        `M ${center.x - 100} ${center.y - 84} L ${center.x - 10} ${center.y - 36} L ${center.x - 84} ${center.y + 24} Z`,
        bladeOpacity,
        'signal',
        0,
        0.86,
      ),
      path(
        `M ${center.x + 100} ${center.y - 84} L ${center.x + 10} ${center.y - 36} L ${center.x + 84} ${center.y + 24} Z`,
        bladeOpacity,
        'signal',
        0,
        0.86,
      ),
    ];
  }
  if (mode === 'maximum-health-reduction') {
    const telegraph =
      (frame.time >= spec.firstTelegraph[0] && frame.time < spec.firstResolveAt) ||
      (frame.time >= spec.secondTelegraph[0] && frame.time < spec.hitAt);
    const hitPulse = strikePulse(frame.time, spec.hitAt, 0.48);
    const healPulse = pulse(
      smooth((frame.time - spec.healAttempt[0]) / (spec.healAttempt[1] - spec.healAttempt[0])),
    );
    const cleansePulse = pulse(
      smooth((frame.time - spec.cleanse[0]) / (spec.cleanse[1] - spec.cleanse[0])),
    );
    const fullHealPulse = pulse(
      smooth((frame.time - spec.fullHeal[0]) / (spec.fullHeal[1] - spec.fullHeal[0])),
    );
    const currentEnd = 120 + (320 * frame.maximumHealthCurrent) / spec.maxHealthBefore;
    const capX = 120 + (320 * frame.maximumHealthMaximum) / spec.maxHealthBefore;
    const bottleX = frame.player.x - 92;
    const bottleY = frame.player.y - 89;
    const bottleVisible = frame.time >= spec.healAttempt[0] && frame.time < spec.fullHeal[1];
    const bottleTone =
      frame.time >= spec.cleanse[0] && frame.time < spec.cleanse[1] ? 'accent' : 'safe';
    const streamOpacity = Math.max(healPulse, cleansePulse, fullHealPulse) * 0.9;
    return [
      path('M 120 93 H 440 V 117 H 120 Z', 0.72, 'muted', 0, 0.64),
      path(`M 120 93 H ${currentEnd} V 117 H 120 Z`, 0.98, 'safe', 0, 0.9),
      path(
        `M ${capX} 93 H 440 V 117 H ${capX} Z`,
        frame.maximumHealthReduced ? 0.88 : 0,
        'signal',
        0,
        0.78,
      ),
      path(
        `M ${capX - 4} 85 H ${capX + 4} V 125 H ${capX - 4} Z`,
        frame.maximumHealthReduced ? 0.98 : 0,
        'signal',
        0,
        0.96,
      ),
      path(
        'M 86 95 C 74 82 55 96 61 112 L 86 136 L 111 112 C 117 96 98 82 86 95 Z',
        0.96,
        'safe',
        0,
        0.86,
      ),
      path(
        `M ${spec.boss[0] - spec.laneHalfWidth} ${spec.boss[1] + 55} H ${spec.boss[0] + spec.laneHalfWidth} V ${spec.attackEnd[1]} H ${spec.boss[0] - spec.laneHalfWidth} Z`,
        telegraph ? 0.46 : hitPulse * 0.92,
        'signal',
        0,
        telegraph ? 0.38 : 0.65,
      ),
      path(
        `M ${spec.boss[0] - 18} ${spec.boss[1] + 60} L ${spec.boss[0] + 14} ${spec.attackEnd[1]} H ${spec.boss[0] - 24} Z`,
        telegraph ? 0.26 : hitPulse * 0.9,
        'signal',
        0,
        0.48,
      ),
      circle(
        frame.player.x,
        frame.player.y - 34,
        34 + hitPulse * 40,
        hitPulse * 0.55,
        'signal',
        0,
        0.32,
      ),
      path(
        `M ${bottleX - 9} ${bottleY - 27} H ${bottleX + 9} V ${bottleY - 13} L ${bottleX + 20} ${bottleY - 2} V ${bottleY + 23} Q ${bottleX} ${bottleY + 36} ${bottleX - 20} ${bottleY + 23} V ${bottleY - 2} L ${bottleX - 9} ${bottleY - 13} Z`,
        bottleVisible ? 0.98 : 0,
        'muted',
        0,
        0.9,
      ),
      path(
        `M ${bottleX - 14} ${bottleY + 5} H ${bottleX + 14} V ${bottleY + 19} Q ${bottleX} ${bottleY + 28} ${bottleX - 14} ${bottleY + 19} Z`,
        bottleVisible ? 0.98 : 0,
        bottleTone,
        0,
        0.9,
      ),
      path(
        `M ${bottleX - 12} ${bottleY - 37} H ${bottleX + 12} V ${bottleY - 27} H ${bottleX - 12} Z`,
        bottleVisible ? 0.98 : 0,
        'muted',
        0,
        0.95,
      ),
      path(
        `M ${bottleX - 5} ${bottleY - 4} H ${bottleX + 5} M ${bottleX} ${bottleY - 9} V ${bottleY + 1}`,
        bottleVisible ? 0.9 : 0,
        bottleTone,
        3,
      ),
      path(
        `M ${bottleX + 14} ${bottleY + 15} Q ${frame.player.x - 27} ${frame.player.y - 111} ${frame.player.x - 7} ${frame.player.y - 51} L ${frame.player.x + 2} ${frame.player.y - 48} Q ${frame.player.x - 33} ${frame.player.y - 125} ${bottleX + 19} ${bottleY + 10} Z`,
        streamOpacity,
        bottleTone,
        0,
        0.78,
      ),
      path(
        `M ${capX + 5} 81 L ${capX + 21} 89 L ${capX + 12} 98 L ${capX + 30} 110 L ${capX + 13} 119`,
        frame.maximumHealthHealingBlocked ? 0.96 : 0,
        'signal',
        5,
      ),
      path(
        `M ${capX} 93 H ${capX + (440 - capX) * cleansePulse} V 117 H ${capX} Z`,
        cleansePulse * 0.96,
        'accent',
        0,
        0.84,
      ),
    ];
  }
  if (mode === 'ability-lock') {
    const center = point(spec.sealCenter);
    const firstTelegraph = frame.time >= spec.firstTelegraph[0] && frame.time < spec.firstResolveAt;
    const secondTelegraph = frame.time >= spec.secondTelegraph[0] && frame.time < spec.hitAt;
    const telegraph = firstTelegraph || secondTelegraph;
    const telegraphStart = firstTelegraph ? spec.firstTelegraph[0] : spec.secondTelegraph[0];
    const telegraphEnd = firstTelegraph ? spec.firstResolveAt : spec.hitAt;
    const telegraphProgress = telegraph
      ? clamp((frame.time - telegraphStart) / (telegraphEnd - telegraphStart))
      : 0;
    const hitPulse = strikePulse(frame.time, spec.hitAt, 0.46);
    const firstHealPulse = pulse(
      smooth((frame.time - spec.firstHeal[0]) / (spec.firstHeal[1] - spec.firstHeal[0])),
    );
    const restoredHealPulse = pulse(
      smooth((frame.time - spec.restoredHeal[0]) / (spec.restoredHeal[1] - spec.restoredHeal[0])),
    );
    const rejectPulse = pulse(
      smooth((frame.time - spec.rejectedHeal[0]) / (spec.rejectedHeal[1] - spec.rejectedHeal[0])),
    );
    const healPulse = Math.max(firstHealPulse, restoredHealPulse);
    const healthWidth = 300 * (frame.abilityLockCurrentHealth / 100);
    const bottleX = frame.player.x - 82;
    const bottleY = frame.player.y - 143;
    const sealOpacity = telegraph ? 0.4 + 0.22 * telegraphProgress : hitPulse * 0.82;
    const lockOpacity = frame.abilityLockHealLocked ? 0.98 : 0;
    return [
      path('M 130 70 H 430 V 90 H 130 Z', 0.62, 'muted', 0, 0.48),
      path(`M 130 70 H ${130 + healthWidth} V 90 H 130 Z`, 0.94, 'safe', 0, 0.9),
      path(
        `M ${frame.boss.x - 27} ${frame.boss.y + 25} C ${frame.boss.x - 94} ${frame.boss.y + 160}, ${center.x - 77} ${center.y - 180}, ${center.x - 49} ${center.y - 59} L ${center.x + 49} ${center.y - 59} C ${frame.boss.x + 77} ${center.y - 180}, ${frame.boss.x + 94} ${frame.boss.y + 160}, ${frame.boss.x + 27} ${frame.boss.y + 25} Z`,
        telegraph ? 0.28 + 0.18 * telegraphProgress : hitPulse * 0.58,
        'signal',
        0,
        0.58,
      ),
      circle(
        center.x,
        center.y,
        spec.sealRadius,
        telegraph ? 0.42 : hitPulse * 0.76,
        'signal',
        0,
        telegraph ? 0.12 : 0.22,
      ),
      path(
        `M ${center.x} ${center.y - 96} L ${center.x + 84} ${center.y - 48} L ${center.x + 84} ${center.y + 48} L ${center.x} ${center.y + 96} L ${center.x - 84} ${center.y + 48} L ${center.x - 84} ${center.y - 48} Z`,
        sealOpacity,
        'signal',
        0,
        telegraph ? 0.16 : 0.32,
      ),
      path(
        `M ${bottleX - 8} ${bottleY - 30} H ${bottleX + 8} V ${bottleY - 15} L ${bottleX + 21} ${bottleY - 3} V ${bottleY + 21} Q ${bottleX} ${bottleY + 38} ${bottleX - 21} ${bottleY + 21} V ${bottleY - 3} L ${bottleX - 8} ${bottleY - 15} Z`,
        0.96,
        'muted',
        0,
        0.88,
      ),
      path(
        `M ${bottleX - 15} ${bottleY + 6} H ${bottleX + 15} V ${bottleY + 18} Q ${bottleX} ${bottleY + 29} ${bottleX - 15} ${bottleY + 18} Z`,
        0.92,
        'safe',
        0,
        0.82,
      ),
      path(
        `M ${bottleX - 12} ${bottleY - 39} H ${bottleX + 12} V ${bottleY - 29} H ${bottleX - 12} Z`,
        0.96,
        'muted',
        0,
        0.9,
      ),
      path(
        `M ${bottleX - 5} ${bottleY - 4} H ${bottleX + 5} M ${bottleX} ${bottleY - 9} V ${bottleY + 1}`,
        0.98,
        'safe',
        3,
      ),
      path(
        `M ${bottleX + 12} ${bottleY + 19} Q ${frame.player.x - 35} ${frame.player.y - 97} ${frame.player.x - 9} ${frame.player.y - 47} L ${frame.player.x + 1} ${frame.player.y - 49} Q ${frame.player.x - 33} ${frame.player.y - 110} ${bottleX + 18} ${bottleY + 16} Z`,
        healPulse * 0.84,
        'safe',
        0,
        0.78,
      ),
      path(
        `M ${bottleX - 28} ${bottleY - 30} L ${bottleX - 20} ${bottleY - 37} L ${bottleX + 28} ${bottleY + 26} L ${bottleX + 20} ${bottleY + 33} Z`,
        lockOpacity,
        'signal',
        0,
        0.96,
      ),
      path(
        `M ${bottleX + 24} ${bottleY - 28} L ${bottleX + 29} ${bottleY - 22} L ${bottleX - 25} ${bottleY + 31} L ${bottleX - 30} ${bottleY + 25} Z`,
        rejectPulse * 0.96,
        'signal',
        0,
        0.94,
      ),
      ...Array.from({ length: 6 }, (_, index) => {
        const remainingSegments = Math.ceil(frame.abilityLockSecondsRemaining * 3.7);
        const runeX = frame.player.x + 98;
        const runeY = frame.player.y - 275 + index * 33;
        const visible = frame.abilityLockHealLocked && index < remainingSegments ? 0.94 : 0;
        return [
          path(
            `M ${runeX - 10} ${runeY - 10} L ${runeX + 7} ${runeY - 12} L ${runeX + 11} ${runeY - 3} L ${runeX + 8} ${runeY + 12} L ${runeX - 8} ${runeY + 11} L ${runeX - 11} ${runeY - 2} Z`,
            visible,
            'muted',
            0,
            0.82,
          ),
          path(
            `M ${runeX - 4} ${runeY - 4} L ${runeX} ${runeY + 4} L ${runeX + 5} ${runeY - 5}`,
            visible,
            'signal',
            2.5,
          ),
        ];
      }).flat(),
    ];
  }
  if (mode === 'resource-steal') {
    const center = point(spec.stealCenter);
    const runeStone = (x, y, opacity, glyphTone = 'accent', scale = 1) => {
      const size = (value) => value * scale;
      return [
        path(
          `M ${x - size(12)} ${y - size(13)} L ${x + size(7)} ${y - size(16)} L ${x + size(14)} ${y - size(6)} L ${x + size(11)} ${y + size(12)} L ${x + size(2)} ${y + size(16)} L ${x - size(13)} ${y + size(12)} L ${x - size(15)} ${y - size(3)} Z`,
          opacity,
          'muted',
          0,
          0.88,
        ),
        path(
          `M ${x - size(6)} ${y - size(5)} L ${x} ${y + size(2)} L ${x + size(7)} ${y - size(7)} M ${x} ${y + size(2)} L ${x} ${y + size(10)}`,
          opacity,
          glyphTone,
          size(3),
        ),
      ];
    };
    const firstTelegraph = frame.time >= spec.firstTelegraph[0] && frame.time < spec.firstResolveAt;
    const secondTelegraph = frame.time >= spec.secondTelegraph[0] && frame.time < spec.hitAt;
    const telegraph = firstTelegraph || secondTelegraph;
    const telegraphStart = firstTelegraph ? spec.firstTelegraph[0] : spec.secondTelegraph[0];
    const telegraphEnd = firstTelegraph ? spec.firstResolveAt : spec.hitAt;
    const telegraphProgress = telegraph
      ? clamp((frame.time - telegraphStart) / (telegraphEnd - telegraphStart))
      : 0;
    const hitPulse = strikePulse(frame.time, spec.hitAt, 0.48);
    const spillProgress = smooth((frame.time - spec.spill[0]) / (spec.spill[1] - spec.spill[0]));
    const captureProgress = smooth(
      (frame.time - spec.capture[0]) / (spec.capture[1] - spec.capture[0]),
    );
    const tokenPositions = spec.tokenTargets.map(([targetX, targetY], index) => {
      let token = {
        x: mix(center.x, targetX, spillProgress),
        y: mix(center.y - 34, targetY, spillProgress),
      };
      if (index > 0 && frame.time >= spec.capture[0])
        token = {
          x: mix(targetX, frame.boss.x, captureProgress),
          y: mix(targetY, frame.boss.y - 20, captureProgress),
        };
      return token;
    });
    const tokenVisible = frame.time >= spec.hitAt && frame.time < spec.capture[1];
    const ownedCount = frame.resourceStealPlayerResource;
    const siphonOpacity = telegraph ? 0.16 + 0.24 * telegraphProgress : hitPulse * 0.62;
    const shieldVisible = frame.resourceStealBenefitApplied ? 0.94 : 0;
    const shieldX = frame.boss.x + 78;
    const shieldY = frame.boss.y - 8;
    return [
      ...Array.from({ length: spec.initialResource }, (_, index) =>
        runeStone(135 + index * 58, 77, index < ownedCount ? 0.94 : 0),
      ).flat(),
      path(
        `M ${frame.boss.x - 36} ${frame.boss.y + 23} C ${frame.boss.x - 150} ${frame.boss.y + 150}, ${center.x - 155} ${center.y - 150}, ${center.x - 72} ${center.y - 22} L ${center.x - 39} ${center.y - 39} C ${frame.boss.x - 100} ${center.y - 172}, ${frame.boss.x - 72} ${frame.boss.y + 154}, ${frame.boss.x - 16} ${frame.boss.y + 27} Z`,
        siphonOpacity,
        'signal',
        0,
        0.68,
      ),
      path(
        `M ${frame.boss.x + 32} ${frame.boss.y + 21} C ${frame.boss.x + 142} ${frame.boss.y + 146}, ${center.x + 148} ${center.y - 143}, ${center.x + 73} ${center.y - 20} L ${center.x + 37} ${center.y - 39} C ${frame.boss.x + 96} ${center.y - 167}, ${frame.boss.x + 65} ${frame.boss.y + 153}, ${frame.boss.x + 14} ${frame.boss.y + 27} Z`,
        siphonOpacity,
        'signal',
        0,
        0.68,
      ),
      circle(
        center.x,
        center.y,
        spec.stealRadius,
        telegraph ? 0.45 + 0.22 * telegraphProgress : hitPulse * 0.86,
        'signal',
        0,
        telegraph ? 0.13 : 0.28,
      ),
      ...tokenPositions
        .map((token, index) =>
          runeStone(
            token.x,
            token.y,
            tokenVisible && (index === 0 ? frame.time < spec.reclaim[1] : true) ? 1 : 0,
            index === 0 ? 'safe' : 'signal',
            1.25,
          ),
        )
        .flat(),
      path(
        `M ${shieldX - 43} ${shieldY - 37} Q ${shieldX} ${shieldY - 59} ${shieldX + 43} ${shieldY - 37} L ${shieldX + 39} ${shieldY + 16} Q ${shieldX + 23} ${shieldY + 52} ${shieldX} ${shieldY + 62} Q ${shieldX - 23} ${shieldY + 52} ${shieldX - 39} ${shieldY + 16} Z`,
        shieldVisible,
        'signal',
        0,
        0.72,
      ),
      path(
        `M ${shieldX - 30} ${shieldY - 27} Q ${shieldX} ${shieldY - 42} ${shieldX + 30} ${shieldY - 27} L ${shieldX + 27} ${shieldY + 12} Q ${shieldX + 15} ${shieldY + 37} ${shieldX} ${shieldY + 45} Q ${shieldX - 15} ${shieldY + 37} ${shieldX - 27} ${shieldY + 12} Z`,
        shieldVisible,
        'muted',
        0,
        0.45,
      ),
      ...runeStone(shieldX - 13, shieldY - 3, shieldVisible, 'signal', 0.58),
      ...runeStone(shieldX + 13, shieldY - 3, shieldVisible, 'signal', 0.58),
    ];
  }
  if (mode === 'on-hit-healing') {
    const center = point(spec.strikeCenter);
    const first = frame.time >= spec.firstTelegraph[0] && frame.time < spec.firstResolveAt;
    const second = frame.time >= spec.secondTelegraph[0] && frame.time < spec.blockedHitAt;
    const third = frame.time >= spec.thirdTelegraph[0] && frame.time < spec.thirdResolveAt;
    const telegraph = first || second || third;
    const start = first
      ? spec.firstTelegraph[0]
      : second
        ? spec.secondTelegraph[0]
        : spec.thirdTelegraph[0];
    const end = first ? spec.firstResolveAt : second ? spec.blockedHitAt : spec.thirdResolveAt;
    const telegraphProgress = telegraph ? clamp((frame.time - start) / (end - start)) : 0;
    const contactPulse = strikePulse(frame.time, spec.blockedHitAt, 0.48);
    const healPulse = pulse(
      smooth((frame.time - spec.healing[0]) / (spec.healing[1] - spec.healing[0])),
    );
    const width = 236 * (frame.onHitHealingBossHealth / 100);
    const beamOpacity =
      frame.time >= spec.healing[0] && frame.time < spec.healing[1] ? Math.max(0.34, healPulse) : 0;
    return [
      path(
        'M 70 190 L 280 151 L 490 190 V 218 L 280 180 L 70 218 Z M 72 848 L 280 806 L 488 848 V 874 L 280 832 L 72 874 Z',
        0.42,
        'muted',
        0,
        0.6,
      ),
      path('M 145 102 H 415 V 130 H 145 Z', 0.76, 'muted', 0, 0.7),
      rect(155, 107, width, 17, 0.98, 'signal', 0.82),
      path(
        `M ${center.x - 96} ${center.y - 20} Q ${center.x} ${center.y - 77} ${center.x + 96} ${center.y - 20} L ${center.x + 79} ${center.y + 19} Q ${center.x} ${center.y - 4} ${center.x - 79} ${center.y + 19} Z`,
        telegraph ? 0.24 + 0.32 * telegraphProgress : contactPulse * 0.78,
        'signal',
        0,
        0.58,
      ),
      path(
        `M ${spec.safePoint[0] - 26} ${spec.safePoint[1] - 8} L ${spec.safePoint[0] - 9} ${spec.safePoint[1] - 25} L ${spec.safePoint[0] + 3} ${spec.safePoint[1] - 13} L ${spec.safePoint[0] + 17} ${spec.safePoint[1] - 30} L ${spec.safePoint[0] + 29} ${spec.safePoint[1] - 14} L ${spec.safePoint[0] + 8} ${spec.safePoint[1] + 9} Z`,
        frame.onHitHealingFirstMissed || frame.onHitHealingThirdMissed ? 0.66 : 0,
        'safe',
        0,
        0.5,
      ),
      path(
        `M ${frame.player.x - 50} ${frame.player.y - 80} Q ${frame.player.x} ${frame.player.y - 131} ${frame.player.x + 50} ${frame.player.y - 80} L ${frame.player.x + 36} ${frame.player.y - 25} Q ${frame.player.x} ${frame.player.y + 5} ${frame.player.x - 36} ${frame.player.y - 25} Z`,
        frame.onHitHealingBlockedContact ? 0.88 : 0,
        'safe',
        0,
        0.32,
      ),
      path(
        `M ${frame.player.x - 20} ${frame.player.y - 90} Q ${frame.player.x - 78} ${frame.player.y - 260} ${frame.boss.x - 24} ${frame.boss.y + 22} L ${frame.boss.x + 22} ${frame.boss.y + 22} Q ${frame.player.x + 68} ${frame.player.y - 260} ${frame.player.x + 20} ${frame.player.y - 90} Z`,
        beamOpacity * 0.58,
        'signal',
        0,
        0.58,
      ),
      ...Array.from({ length: 3 }, (_, index) => {
        const progress =
          ((index + 1) / 4) *
          smooth((frame.time - spec.healing[0]) / (spec.healing[1] - spec.healing[0]));
        const x = mix(frame.player.x, frame.boss.x, progress);
        const y = mix(frame.player.y - 88, frame.boss.y + 18, progress);
        return path(
          `M ${x} ${y - 15} Q ${x + 15} ${y} ${x} ${y + 15} Q ${x - 15} ${y} ${x} ${y - 15} Z`,
          beamOpacity,
          'safe',
          0,
          0.86,
        );
      }),
      path(
        `M ${frame.boss.x - 64} ${frame.boss.y + 35} Q ${frame.boss.x} ${frame.boss.y - 90 - healPulse * 45} ${frame.boss.x + 64} ${frame.boss.y + 35} Z`,
        healPulse * 0.78,
        'safe',
        0,
        0.34,
      ),
      path(
        `M ${frame.player.x + 38} ${frame.player.y - 82} L ${frame.player.x + 92} ${frame.player.y - 136}`,
        strikePulse(frame.time, spec.counterAt, 0.4),
        'accent',
        9,
      ),
    ];
  }
  if (mode === 'self-heal-cast') {
    const channeling = frame.selfHealCastChannelActive;
    const channelProgress = frame.selfHealCastChannelProgress;
    const telegraphing =
      (frame.time >= spec.firstTelegraph[0] && frame.time < spec.firstChannel[0]) ||
      (frame.time >= spec.secondTelegraph[0] && frame.time < spec.secondChannel[0]);
    const telegraphProgress =
      frame.time < spec.firstChannel[0]
        ? clamp(
            (frame.time - spec.firstTelegraph[0]) / (spec.firstChannel[0] - spec.firstTelegraph[0]),
          )
        : clamp(
            (frame.time - spec.secondTelegraph[0]) /
              (spec.secondChannel[0] - spec.secondTelegraph[0]),
          );
    const interruptPulse = strikePulse(frame.time, spec.interruptAt, 0.5);
    const healPulse = pulse(
      smooth((frame.time - spec.healing[0]) / (spec.healing[1] - spec.healing[0])),
    );
    const ringOpacity = channeling ? 0.62 + pulse(channelProgress) * 0.28 : telegraphing ? 0.48 : 0;
    const healthWidth = 236 * (frame.selfHealCastBossHealth / 100);
    const moteOpacity = channeling ? 0.94 : 0;
    return [
      path(
        'M 70 187 L 280 148 L 490 187 V 216 L 280 177 L 70 216 Z M 72 846 L 280 804 L 488 846 V 874 L 280 832 L 72 874 Z',
        0.42,
        'muted',
        0,
        0.6,
      ),
      path('M 145 102 H 415 V 130 H 145 Z', 0.76, 'muted', 0, 0.7),
      rect(155, 107, healthWidth, 17, 0.98, 'safe', 0.82),
      path(
        'M 210 425 L 300 399 L 390 425 L 376 452 L 300 430 L 224 452 Z M 238 452 L 300 432 L 362 452 L 348 553 L 300 569 L 252 553 Z M 222 558 L 300 541 L 378 558 V 585 L 300 567 L 222 585 Z',
        0.68,
        'muted',
        0,
        0.78,
      ),
      path(
        `M 278 420 L 300 ${409 - 38 * channelProgress} L 322 420 L 312 455 L 288 455 Z`,
        channeling || telegraphing ? ringOpacity : 0,
        'signal',
        0,
        0.72,
      ),
      path(
        `M ${frame.boss.x - 74} ${frame.boss.y + 26} Q ${frame.boss.x} ${frame.boss.y - 116 - 26 * channelProgress} ${frame.boss.x + 74} ${frame.boss.y + 26} Z`,
        ringOpacity * 0.56,
        'safe',
        0,
        0.38,
      ),
      ...Array.from({ length: 6 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 6 + frame.time * 1.8;
        const radius = mix(138, 54, channelProgress);
        const x = frame.boss.x + Math.cos(angle) * radius;
        const y = frame.boss.y - 22 + Math.sin(angle) * radius * 0.62;
        const size = 8 + 2 * pulse(channelProgress + index / 6);
        return path(
          `M ${x} ${y - size} L ${x + size * 0.7} ${y} L ${x} ${y + size} L ${x - size * 0.7} ${y} Z`,
          moteOpacity,
          index % 2 ? 'signal' : 'safe',
          0,
          0.9,
        );
      }),
      line(
        frame.boss.x - 72,
        frame.boss.y - 106,
        frame.boss.x + 68,
        frame.boss.y + 36,
        interruptPulse,
        'accent',
        13,
      ),
      line(
        frame.boss.x - 38,
        frame.boss.y - 118,
        frame.boss.x + 78,
        frame.boss.y - 2,
        interruptPulse,
        'safe',
        5,
      ),
      path(
        `M ${frame.boss.x - 65} ${frame.boss.y + 32} Q ${frame.boss.x} ${frame.boss.y - 104 - healPulse * 62} ${frame.boss.x + 65} ${frame.boss.y + 32} Z`,
        frame.selfHealCastHealing ? Math.max(0.32, healPulse) : 0,
        'safe',
        0,
        0.48,
      ),
      path(
        `M ${frame.player.x + 30} ${frame.player.y - 70} L ${frame.player.x + 94} ${frame.player.y - 134}`,
        interruptPulse,
        'accent',
        10,
      ),
    ];
  }
  if (mode === 'external-healing-source') {
    const firstSource = point(spec.firstSource);
    const secondSource = point(spec.secondSource);
    const bossCore = { x: frame.boss.x, y: frame.boss.y - 22 };
    const sourceSignal = smooth(
      (frame.time - spec.firstSignal[0]) / (spec.firstSignal[1] - spec.firstSignal[0]),
    );
    const resetFade =
      frame.time < spec.resetAt
        ? 1
        : 1 - smooth((frame.time - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const firstFade =
      frame.time < spec.destroyAt
        ? 1
        : 1 - smooth((frame.time - spec.destroyAt) / (spec.firstRecovery[1] - spec.destroyAt));
    const firstProgress = clamp(
      (frame.time - spec.firstTransfer[0]) / (spec.destroyAt - spec.firstTransfer[0]),
    );
    const secondProgress = clamp(
      (frame.time - spec.secondTransfer[0]) / (spec.secondTransfer[1] - spec.secondTransfer[0]),
    );
    const firstPacket = {
      x: mix(firstSource.x, bossCore.x, firstProgress),
      y: mix(firstSource.y, bossCore.y, firstProgress),
    };
    const secondPacket = {
      x: mix(secondSource.x, bossCore.x, secondProgress),
      y: mix(secondSource.y, bossCore.y, secondProgress),
    };
    const firstActive =
      frame.time >= spec.firstTransfer[0] && frame.time < spec.destroyAt ? 0.96 : 0;
    const secondActive = frame.externalHealingSourceSecondPacketActive ? 0.96 : 0;
    const destroyPulse = strikePulse(frame.time, spec.destroyAt, 0.5);
    const healPulse = pulse(
      smooth((frame.time - spec.healing[0]) / (spec.healing[1] - spec.healing[0])),
    );
    const healthWidth = 236 * (frame.externalHealingSourceBossHealth / 100);
    const firstOpacity = sourceSignal * firstFade * resetFade;
    const secondOpacity = sourceSignal * resetFade;
    const healingBrazier = (source, opacity, tone) => [
      path(
        `M ${source.x - 27} ${source.y + 16} H ${source.x + 27} L ${source.x + 20} ${source.y + 96} H ${source.x - 20} Z M ${source.x - 38} ${source.y + 92} H ${source.x + 38} V ${source.y + 110} H ${source.x - 38} Z`,
        opacity,
        'muted',
        0,
        0.82,
      ),
      path(
        `M ${source.x - 37} ${source.y + 5} Q ${source.x} ${source.y + 36} ${source.x + 37} ${source.y + 5} L ${source.x + 27} ${source.y + 31} Q ${source.x} ${source.y + 52} ${source.x - 27} ${source.y + 31} Z`,
        opacity,
        'accent',
        0,
        0.76,
      ),
      path(
        `M ${source.x - 19} ${source.y + 8} Q ${source.x - 23} ${source.y - 26} ${source.x} ${source.y - 43 - 8 * pulse(frame.time * 0.8)} Q ${source.x + 26} ${source.y - 7} ${source.x + 17} ${source.y + 8} Q ${source.x + 3} ${source.y - 13} ${source.x - 7} ${source.y + 13} Z`,
        opacity,
        tone,
        0,
        0.84,
      ),
    ];
    return [
      path(
        'M 70 187 L 280 148 L 490 187 V 216 L 280 177 L 70 216 Z M 72 846 L 280 804 L 488 846 V 874 L 280 832 L 72 874 Z',
        0.42,
        'muted',
        0,
        0.6,
      ),
      path('M 145 102 H 415 V 130 H 145 Z', 0.76, 'muted', 0, 0.7),
      rect(155, 107, healthWidth, 17, 0.98, 'safe', 0.82),
      ...healingBrazier(firstSource, firstOpacity, 'signal'),
      ...healingBrazier(
        secondSource,
        secondOpacity,
        frame.externalHealingSourceSecondSignaled ? 'safe' : 'signal',
      ),
      path(
        `M ${firstSource.x - 8} ${firstSource.y - 29} Q 186 344 ${bossCore.x - 28} ${bossCore.y + 14} L ${bossCore.x - 8} ${bossCore.y + 26} Q 211 350 ${firstSource.x + 8} ${firstSource.y - 18} Z`,
        firstActive * 0.5,
        'signal',
        0,
        0.52,
      ),
      path(
        `M ${secondSource.x + 8} ${secondSource.y - 29} Q 406 344 ${bossCore.x + 28} ${bossCore.y + 14} L ${bossCore.x + 8} ${bossCore.y + 26} Q 389 350 ${secondSource.x - 8} ${secondSource.y - 18} Z`,
        secondActive * 0.5,
        'safe',
        0,
        0.52,
      ),
      path(
        `M ${firstPacket.x} ${firstPacket.y - 17} Q ${firstPacket.x + 14} ${firstPacket.y} ${firstPacket.x} ${firstPacket.y + 17} Q ${firstPacket.x - 14} ${firstPacket.y} ${firstPacket.x} ${firstPacket.y - 17} Z`,
        firstActive,
        'signal',
        0,
        0.9,
      ),
      path(
        `M ${secondPacket.x} ${secondPacket.y - 17} Q ${secondPacket.x + 14} ${secondPacket.y} ${secondPacket.x} ${secondPacket.y + 17} Q ${secondPacket.x - 14} ${secondPacket.y} ${secondPacket.x} ${secondPacket.y - 17} Z`,
        secondActive,
        'safe',
        0,
        0.9,
      ),
      ...Array.from({ length: 3 }, (_, index) => {
        const lag = Math.max(0, secondProgress - (index + 1) * 0.08);
        return circle(
          mix(secondSource.x, bossCore.x, lag),
          mix(secondSource.y, bossCore.y, lag),
          8 - index,
          secondActive * (0.74 - index * 0.14),
          'safe',
          4,
          0.14,
        );
      }),
      line(
        firstSource.x - 46,
        firstSource.y - 48,
        firstSource.x + 45,
        firstSource.y + 43,
        destroyPulse,
        'accent',
        12,
      ),
      line(
        firstSource.x - 38,
        firstSource.y + 46,
        firstSource.x + 48,
        firstSource.y - 40,
        destroyPulse,
        'accent',
        8,
      ),
      path(
        `M ${frame.player.x + 24} ${frame.player.y - 70} L ${frame.player.x + 82} ${frame.player.y - 128}`,
        destroyPulse,
        'accent',
        10,
      ),
      path(
        `M ${bossCore.x - 68} ${bossCore.y + 52} Q ${bossCore.x} ${bossCore.y - 110 - healPulse * 52} ${bossCore.x + 68} ${bossCore.y + 52} Z`,
        frame.externalHealingSourceHealing ? Math.max(0.34, healPulse) : 0,
        'safe',
        0,
        0.42,
      ),
    ];
  }
  if (mode === 'damage-rate-cap') {
    const hitTimes = [spec.isolatedHitAt, ...spec.burstHits, spec.recoveredHitAt];
    const lastHitAt = hitTimes.reduce(
      (latest, hitAt) => (frame.time >= hitAt ? hitAt : latest),
      -1,
    );
    const impact = lastHitAt < 0 ? 0 : strikePulse(frame.time, lastHitAt, 0.34);
    const healthWidth = 236 * (frame.damageRateCapBossHealth / 100);
    const attenuation = 1 - frame.damageRateCapMultiplier;
    const nextHit = hitTimes.find((at) => frame.time >= at - 0.32 && frame.time < at);
    const flight = nextHit === undefined ? 0 : clamp((frame.time - nextHit + 0.32) / 0.32);
    const projectileY = mix(frame.player.y - 75, frame.boss.y + 26, flight);
    return [
      path(
        'M 70 187 L 280 148 L 490 187 V 216 L 280 177 L 70 216 Z M 72 846 L 280 804 L 488 846 V 874 L 280 832 L 72 874 Z',
        0.42,
        'muted',
        0,
        0.6,
      ),
      path('M 145 102 H 415 V 130 H 145 Z', 0.76, 'muted', 0, 0.7),
      rect(155, 107, healthWidth, 17, 0.98, 'signal', 0.82),
      path(
        `M ${frame.boss.x - 96} ${frame.boss.y + 30} L ${frame.boss.x} ${frame.boss.y + 9} L ${frame.boss.x + 96} ${frame.boss.y + 30} L ${frame.boss.x + 82} ${frame.boss.y + 105} L ${frame.boss.x} ${frame.boss.y + 126} L ${frame.boss.x - 82} ${frame.boss.y + 105} Z`,
        0.18 + attenuation * 0.73,
        'muted',
        0,
        0.74,
      ),
      ...Array.from({ length: 4 }, (_, index) => {
        const x = frame.boss.x - 73 + index * 37;
        const y = frame.boss.y + 50 + (index % 2) * 22;
        return path(
          `M ${x - 17} ${y - 22} L ${x + 13} ${y - 29} L ${x + 23} ${y + 12} L ${x - 9} ${y + 20} Z`,
          frame.damageRateCapRecentDamage >= spec.threshold * (index + 1) ? 0.85 : 0.16,
          'signal',
          0,
          0.74,
        );
      }),
      path(
        `M ${frame.player.x - 9} ${projectileY + 24} L ${frame.player.x} ${projectileY - 26} L ${frame.player.x + 9} ${projectileY + 24} L ${frame.player.x} ${projectileY + 9} Z`,
        nextHit === undefined ? 0 : 0.96,
        'safe',
        0,
        0.88,
      ),
      path(
        `M ${frame.player.x + 26} ${frame.player.y - 70} L ${frame.player.x + 92} ${frame.player.y - 136}`,
        impact,
        'accent',
        11,
      ),
      line(
        frame.boss.x - 70,
        frame.boss.y - 96,
        frame.boss.x + 62,
        frame.boss.y + 36,
        impact,
        'safe',
        7,
      ),
      path(
        `M ${frame.boss.x - 42} ${frame.boss.y + 53} L ${frame.boss.x - 13} ${frame.boss.y + 84} L ${frame.boss.x - 24} ${frame.boss.y + 110} M ${frame.boss.x + 36} ${frame.boss.y + 45} L ${frame.boss.x + 5} ${frame.boss.y + 77} L ${frame.boss.x + 17} ${frame.boss.y + 108}`,
        impact,
        'accent',
        6,
      ),
    ];
  }
  if (mode === 'loadout-mirror') {
    const scanProgress = clamp((frame.time - spec.scan[0]) / (spec.scan[1] - spec.scan[0]));
    const revealProgress = clamp(
      (frame.time - spec.copyReveal[0]) / (spec.copyReveal[1] - spec.copyReveal[0]),
    );
    const swapPulse = strikePulse(frame.time, spec.playerSwapAt, 0.54);
    const usePulse = strikePulse(frame.time, spec.bossUseAt, 0.72);
    const resetProgress = clamp((frame.time - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const copiedOpacity = frame.loadoutMirrorSnapshotCaptured
      ? 0.96 * (1 - resetProgress)
      : revealProgress * 0.96;
    const playerKinds = frame.loadoutMirrorPlayerChanged
      ? spec.changedLoadout
      : spec.initialLoadout;
    const equipment = (x, y, kind, opacity, tone) => {
      const shapes = {
        sword: `M ${x - 5} ${y + 27} L ${x + 3} ${y - 26} L ${x + 12} ${y - 38} L ${x + 14} ${y - 21} L ${x + 5} ${y + 27} Z M ${x - 21} ${y + 12} L ${x + 19} ${y + 18} L ${x + 17} ${y + 25} L ${x - 23} ${y + 19} Z`,
        ward: `M ${x} ${y - 36} L ${x + 28} ${y - 22} L ${x + 24} ${y + 12} Q ${x + 18} ${y + 31} ${x} ${y + 38} Q ${x - 18} ${y + 31} ${x - 24} ${y + 12} L ${x - 28} ${y - 22} Z`,
        ember: `M ${x - 20} ${y + 30} Q ${x - 27} ${y + 5} ${x - 7} ${y - 21} Q ${x - 4} ${y - 1} ${x + 7} ${y - 33} Q ${x + 31} ${y + 3} ${x + 18} ${y + 28} Z`,
        bow: `M ${x - 18} ${y - 34} Q ${x + 24} ${y} ${x - 18} ${y + 34} L ${x - 9} ${y + 29} Q ${x + 18} ${y} ${x - 9} ${y - 29} Z M ${x - 20} ${y - 34} L ${x - 14} ${y - 34} V ${y + 34} H ${x - 20} Z`,
        dash: `M ${x - 21} ${y - 25} H ${x + 6} V ${y + 8} L ${x + 26} ${y + 18} V ${y + 33} H ${x - 26} L ${x - 22} ${y + 14} Z`,
        frost: `M ${x} ${y - 35} L ${x + 10} ${y - 12} L ${x + 31} ${y - 7} L ${x + 14} ${y + 5} L ${x + 20} ${y + 29} L ${x} ${y + 16} L ${x - 20} ${y + 29} L ${x - 14} ${y + 5} L ${x - 31} ${y - 7} L ${x - 10} ${y - 12} Z`,
      };
      return path(shapes[kind] ?? shapes.sword, opacity, tone, 0, 0.84);
    };
    return [
      path(
        'M 70 187 L 280 148 L 490 187 V 216 L 280 177 L 70 216 Z M 72 846 L 280 804 L 488 846 V 874 L 280 832 L 72 874 Z',
        0.42,
        'muted',
        0,
        0.6,
      ),
      path(
        'M 58 535 H 169 V 801 H 58 Z M 67 552 H 160 V 561 H 67 Z M 67 627 H 160 V 636 H 67 Z M 67 702 H 160 V 711 H 67 Z M 398 317 H 505 V 571 H 398 Z M 407 335 H 496 V 344 H 407 Z M 407 410 H 496 V 419 H 407 Z M 407 485 H 496 V 494 H 407 Z',
        0.46,
        'muted',
        0,
        0.72,
      ),
      ...playerKinds.map((kind, index) =>
        equipment(114, 589 + index * 75, kind, 0.96, ['accent', 'safe', 'signal'][index]),
      ),
      ...spec.initialLoadout.map((kind, index) =>
        equipment(452, 371 + index * 75, kind, copiedOpacity, ['accent', 'safe', 'signal'][index]),
      ),
      path(
        'M 145 535 Q 220 456 320 475 Q 390 482 435 328 L 451 328 Q 419 501 320 491 Q 218 478 158 548 Z',
        frame.time >= spec.scan[0] && frame.time < spec.captureAt
          ? 0.12 + pulse(scanProgress) * 0.27
          : 0,
        'safe',
        0,
        0.54,
      ),
      path(
        `M ${frame.player.x - 40} ${frame.player.y - 45} Q ${frame.player.x} ${frame.player.y - 130 - 28 * swapPulse} ${frame.player.x + 40} ${frame.player.y - 45} Z`,
        swapPulse * 0.58,
        'safe',
        0,
        0.42,
      ),
      path(
        `M ${frame.boss.x + 28} ${frame.boss.y - 31} L ${frame.boss.x + 90} ${frame.boss.y - 142} L ${frame.boss.x + 102} ${frame.boss.y - 162} L ${frame.boss.x + 100} ${frame.boss.y - 132} L ${frame.boss.x + 43} ${frame.boss.y - 23} Z`,
        copiedOpacity,
        'accent',
        0,
        0.84,
      ),
      path(
        `M ${frame.boss.x - 84} ${frame.boss.y - 122} Q ${frame.boss.x} ${frame.boss.y - 192} ${frame.boss.x + 92} ${frame.boss.y - 108}`,
        usePulse,
        'accent',
        12,
      ),
    ];
  }
  if (mode === 'moveset-shapeshifting') {
    const firstProgress = clamp(
      (frame.time - spec.firstActive[0]) / (spec.firstActive[1] - spec.firstActive[0]),
    );
    const secondProgress = clamp(
      (frame.time - spec.secondActive[0]) / (spec.secondActive[1] - spec.secondActive[0]),
    );
    const thirdProgress = clamp(
      (frame.time - spec.thirdActive[0]) / (spec.thirdActive[1] - spec.thirdActive[0]),
    );
    const transitionPulse = frame.movesetShapeshiftingTransitionActive
      ? pulse(
          frame.time < spec.firstChange[1]
            ? (frame.time - spec.firstChange[0]) / (spec.firstChange[1] - spec.firstChange[0])
            : (frame.time - spec.secondChange[0]) / (spec.secondChange[1] - spec.secondChange[0]),
        )
      : 0;
    const colossus = frame.movesetShapeshiftingForm === 'colossus';
    const serpent = frame.movesetShapeshiftingForm === 'serpent';
    const oracle = frame.movesetShapeshiftingForm === 'oracle';
    const fanAngles = [-0.38, 0, 0.38];
    const waveY = frame.boss.y + 90 + firstProgress * 270;
    const serpentY = frame.boss.y + 120 + secondProgress * 290;
    return [
      path(
        'M 70 187 L 280 148 L 490 187 V 216 L 280 177 L 70 216 Z M 72 846 L 280 804 L 488 846 V 874 L 280 832 L 72 874 Z',
        0.42,
        'muted',
        0,
        0.6,
      ),
      path('M 95 499 L 280 461 L 465 499 V 534 L 280 495 L 95 534 Z', 0.28, 'muted', 0, 0.55),
      path(
        `M ${frame.boss.x - 98} ${frame.boss.y - 82} L ${frame.boss.x - 47} ${frame.boss.y - 120} L ${frame.boss.x - 20} ${frame.boss.y - 53} L ${frame.boss.x - 62} ${frame.boss.y + 18} L ${frame.boss.x - 110} ${frame.boss.y - 5} Z M ${frame.boss.x + 98} ${frame.boss.y - 82} L ${frame.boss.x + 47} ${frame.boss.y - 120} L ${frame.boss.x + 20} ${frame.boss.y - 53} L ${frame.boss.x + 62} ${frame.boss.y + 18} L ${frame.boss.x + 110} ${frame.boss.y - 5} Z`,
        colossus ? 0.88 : 0,
        'muted',
        0,
        0.86,
      ),
      path(
        `M ${frame.boss.x - 80} ${waveY - 28} L ${frame.boss.x - 50} ${waveY - 44} L ${frame.boss.x - 18} ${waveY - 22} L ${frame.boss.x + 19} ${waveY - 49} L ${frame.boss.x + 46} ${waveY - 24} L ${frame.boss.x + 82} ${waveY - 39} L ${frame.boss.x + 102} ${waveY + 2} L ${frame.boss.x - 97} ${waveY + 2} Z`,
        colossus && frame.movesetShapeshiftingPackageAttackActive ? 0.84 : 0,
        'accent',
        0,
        0.68,
      ),
      path(
        `M ${frame.boss.x - 65} ${frame.boss.y + 12} C ${frame.boss.x - 185} ${frame.boss.y + 128}, ${frame.boss.x + 165} ${serpentY - 130}, ${frame.boss.x + 65} ${serpentY} L ${frame.boss.x + 32} ${serpentY + 15} C ${frame.boss.x + 135} ${serpentY - 124}, ${frame.boss.x - 151} ${frame.boss.y + 167}, ${frame.boss.x - 43} ${frame.boss.y + 20} Z`,
        serpent ? 0.9 : 0,
        'safe',
        0,
        0.55,
      ),
      path(
        `M ${frame.boss.x + 34} ${serpentY - 16} L ${frame.boss.x + 80} ${serpentY - 13} L ${frame.boss.x + 96} ${serpentY + 6} L ${frame.boss.x + 81} ${serpentY + 29} L ${frame.boss.x + 40} ${serpentY + 23} Z`,
        serpent && frame.movesetShapeshiftingPackageAttackActive ? 0.96 : 0.45 * Number(serpent),
        'safe',
        0,
        0.88,
      ),
      path(
        `M ${frame.boss.x - 56} ${frame.boss.y - 116} L ${frame.boss.x - 32} ${frame.boss.y - 163} L ${frame.boss.x - 12} ${frame.boss.y - 128} L ${frame.boss.x} ${frame.boss.y - 176} L ${frame.boss.x + 12} ${frame.boss.y - 128} L ${frame.boss.x + 32} ${frame.boss.y - 163} L ${frame.boss.x + 56} ${frame.boss.y - 116} Z`,
        oracle ? 0.94 : 0,
        'signal',
        0,
        0.76,
      ),
      ...fanAngles.map((angle) => {
        const distance = 115 + thirdProgress * 390;
        const x = frame.boss.x + Math.sin(angle) * distance;
        const y = frame.boss.y + Math.cos(angle) * distance;
        return path(
          `M ${x} ${y + 24} L ${x - 13} ${y - 16} L ${x} ${y - 9} L ${x + 13} ${y - 16} Z`,
          oracle && frame.movesetShapeshiftingPackageAttackActive ? 0.98 : 0,
          'signal',
          0,
          0.9,
        );
      }),
      path(
        `M ${frame.boss.x - 95} ${frame.boss.y + 53} L ${frame.boss.x - 46} ${frame.boss.y + 8} L ${frame.boss.x - 17} ${frame.boss.y + 74} Z M ${frame.boss.x + 95} ${frame.boss.y + 53} L ${frame.boss.x + 46} ${frame.boss.y + 8} L ${frame.boss.x + 17} ${frame.boss.y + 74} Z`,
        transitionPulse,
        'safe',
        0,
        0.74,
      ),
    ];
  }
  if (mode === 'ally-theft') {
    const ally = frame.allyTheftAlly;
    const ownerTone = frame.allyTheftOwnerId === 'player' ? 'safe' : 'accent';
    const markProgress = clamp((frame.time - spec.mark[0]) / (spec.mark[1] - spec.mark[0]));
    const releaseProgress = clamp(
      (frame.time - spec.release[0]) / (spec.release[1] - spec.release[0]),
    );
    const wingLift = 12 * Math.sin(frame.time * 10);
    const bossCommand = frame.time >= spec.mark[0] && frame.time < spec.release[0];
    return [
      path(
        'M 70 187 L 280 148 L 490 187 V 216 L 280 177 L 70 216 Z M 72 846 L 280 804 L 488 846 V 874 L 280 832 L 72 874 Z',
        0.42,
        'muted',
        0,
        0.6,
      ),
      path(
        `M ${frame.boss.x + 22} ${frame.boss.y - 12} Q 475 405 ${ally.x + 9} ${ally.y - 17} L ${ally.x - 6} ${ally.y - 9} Q 420 430 ${frame.boss.x + 12} ${frame.boss.y + 13} Z`,
        bossCommand ? 0.42 : 0,
        'accent',
        0,
        0.5,
      ),
      path(
        `M ${frame.player.x + 11} ${frame.player.y - 49} Q 442 637 ${ally.x - 12} ${ally.y + 12} L ${ally.x - 2} ${ally.y + 19} Q 421 671 ${frame.player.x - 5} ${frame.player.y - 34} Z`,
        frame.allyTheftOwnerId === 'player' ? 0.35 : 0,
        'safe',
        0,
        0.5,
      ),
      path(
        `M ${ally.x - 6} ${ally.y - 12} Q ${ally.x - 34} ${ally.y - 59 - wingLift} ${ally.x - 57} ${ally.y - 16} Q ${ally.x - 37} ${ally.y - 24} ${ally.x - 19} ${ally.y + 10} Z M ${ally.x + 6} ${ally.y - 12} Q ${ally.x + 34} ${ally.y - 59 - wingLift} ${ally.x + 57} ${ally.y - 16} Q ${ally.x + 37} ${ally.y - 24} ${ally.x + 19} ${ally.y + 10} Z`,
        0.93,
        ownerTone,
        0,
        0.82,
      ),
      path(
        `M ${ally.x - 17} ${ally.y - 20} Q ${ally.x} ${ally.y - 37} ${ally.x + 17} ${ally.y - 20} L ${ally.x + 21} ${ally.y + 14} L ${ally.x} ${ally.y + 31} L ${ally.x - 21} ${ally.y + 14} Z M ${ally.x + 19} ${ally.y - 17} L ${ally.x + 37} ${ally.y - 10} L ${ally.x + 19} ${ally.y - 3} Z`,
        0.98,
        ownerTone,
        0,
        0.93,
      ),
      circle(ally.x + 8, ally.y - 14, 3, 0.96, 'muted', 0, 0.96),
      path(
        `M ${ally.x - 31} ${ally.y - 57} L ${ally.x - 12} ${ally.y - 75} L ${ally.x} ${ally.y - 53} L ${ally.x + 13} ${ally.y - 76} L ${ally.x + 32} ${ally.y - 56} L ${ally.x + 11} ${ally.y - 44} L ${ally.x} ${ally.y - 56} L ${ally.x - 11} ${ally.y - 44} Z`,
        frame.allyTheftMarked ? 0.2 + markProgress * 0.7 : 0,
        'signal',
        0,
        0.78,
      ),
      ...spec.shotTimes.map((at, index) => {
        const target = point(spec.shotTargets[index]);
        const signal = clamp((frame.time - (at - 0.24)) / 0.24) * clamp((at - frame.time) / 0.08);
        return path(
          `M ${target.x - 24} ${target.y + 9} L ${target.x} ${target.y - 17} L ${target.x + 24} ${target.y + 9} Z`,
          signal,
          'accent',
          0,
          0.38,
        );
      }),
      ...frame.allyTheftProjectiles.map((projectile) =>
        path(
          `M ${projectile.x} ${projectile.y + 21} L ${projectile.x - 12} ${projectile.y - 10} L ${projectile.x} ${projectile.y - 4} L ${projectile.x + 12} ${projectile.y - 10} Z`,
          0.98,
          'accent',
          0,
          0.88,
        ),
      ),
      path(
        `M ${ally.x - 40} ${ally.y - 42} L ${ally.x - 25 - 20 * releaseProgress} ${ally.y - 15} L ${ally.x - 44} ${ally.y + 7} Z M ${ally.x + 40} ${ally.y - 42} L ${ally.x + 25 + 20 * releaseProgress} ${ally.y - 15} L ${ally.x + 44} ${ally.y + 7} Z`,
        frame.time >= spec.release[0] && frame.time < spec.release[1] ? 0.84 : 0,
        'safe',
        0,
        0.72,
      ),
    ];
  }
  if (mode === 'false-death') {
    const strike = strikePulse(frame.time, spec.strikeAt, 0.5);
    const rebuildProgress = clamp(
      (frame.time - spec.rebuild[0]) / (spec.rebuild[1] - spec.rebuild[0]),
    );
    const signalProgress = clamp(
      (frame.time - spec.secondSignal[0]) / (spec.secondSignal[1] - spec.secondSignal[0]),
    );
    const activeProgress = clamp(
      (frame.time - spec.secondActive[0]) / (spec.secondActive[1] - spec.secondActive[0]),
    );
    const healthWidth = 340 * (frame.falseDeathBossHealth / 100);
    const coreX = spec.boss[0];
    const coreY = spec.boss[1] + 28;
    const fragments = [
      [154, 474],
      [455, 468],
      [126, 650],
      [475, 638],
    ];
    const fallen = frame.time >= spec.collapse[0] && frame.time < spec.revivalAt;
    return [
      path(
        'M 70 187 L 280 148 L 490 187 V 216 L 280 177 L 70 216 Z M 72 846 L 280 804 L 488 846 V 874 L 280 832 L 72 874 Z',
        0.42,
        'muted',
        0,
        0.6,
      ),
      path('M 105 102 H 455 V 131 H 105 Z', 0.76, 'muted', 0, 0.72),
      rect(
        110,
        108,
        healthWidth,
        17,
        healthWidth > 0 ? 0.96 : 0,
        frame.falseDeathCurrentPhase === 1 ? 'safe' : 'accent',
        0.82,
      ),
      path(
        'M 59 626 L 72 595 H 188 L 201 626 V 868 H 59 Z M 78 647 H 182 V 868 H 78 Z',
        0.72,
        'muted',
        0,
        0.72,
      ),
      path(
        'M 91 659 H 169 V 852 H 91 Z M 102 669 V 842 M 118 669 V 842 M 134 669 V 842 M 150 669 V 842 M 166 669 V 842',
        frame.falseDeathExitLocked ? 0.84 : 0.24,
        'accent',
        0,
        0.7,
      ),
      path(
        'M 105 667 H 111 V 844 H 105 Z M 124 667 H 130 V 844 H 124 Z M 143 667 H 149 V 844 H 143 Z M 95 742 H 166 V 752 H 95 Z',
        0.72,
        'muted',
        0,
        0.8,
      ),
      path(
        'M 153 754 H 163 V 771 H 153 Z',
        frame.falseDeathExitLocked ? 0.9 : 0.28,
        'signal',
        0,
        0.86,
      ),
      path(
        'M 389 800 L 474 800 L 486 817 L 480 854 H 383 L 377 817 Z M 378 817 H 485 V 831 H 378 Z',
        0.82,
        'muted',
        0,
        0.72,
      ),
      path(
        'M 404 808 H 460 V 846 H 404 Z M 422 812 H 440 V 830 H 422 Z',
        frame.falseDeathRewardLocked ? 0.76 : 0.24,
        'signal',
        0,
        0.62,
      ),
      path(
        `M ${coreX - 28} ${coreY - 33} L ${coreX} ${coreY - 46} L ${coreX + 28} ${coreY - 33} L ${coreX + 24} ${coreY + 26} L ${coreX} ${coreY + 41} L ${coreX - 24} ${coreY + 26} Z`,
        fallen ? 0.95 : 0.16,
        'signal',
        0,
        0.82,
      ),
      ...fragments.map(([x, y], index) => {
        const angle = (Math.PI * 2 * index) / fragments.length;
        const px = mix(x, coreX + Math.cos(angle) * 62, smooth(rebuildProgress));
        const py = mix(y, coreY + Math.sin(angle) * 72, smooth(rebuildProgress));
        return path(
          `M ${px - 18} ${py - 17} L ${px + 12} ${py - 22} L ${px + 24} ${py + 11} L ${px - 7} ${py + 20} Z`,
          fallen ? 0.88 : 0,
          'muted',
          0,
          0.76,
        );
      }),
      path(
        `M ${coreX - 62} ${coreY + 28} Q ${coreX} ${coreY - 95 - 80 * rebuildProgress} ${coreX + 62} ${coreY + 28} Z`,
        frame.falseDeathRebuildActive ? 0.2 + rebuildProgress * 0.48 : 0,
        'safe',
        0,
        0.48,
      ),
      path(
        `M ${frame.player.x + 12} ${frame.player.y - 54} Q 360 500 ${coreX + 22} ${coreY - 72}`,
        strike,
        'safe',
        12,
      ),
      path(
        `M ${coreX - 160} ${coreY + 96} L ${coreX - 92} ${coreY + 15} L ${coreX - 46} ${coreY + 55} L ${coreX} ${coreY - 10} L ${coreX + 55} ${coreY + 56} L ${coreX + 105} ${coreY + 11} L ${coreX + 167} ${coreY + 98} L ${coreX + 107 + activeProgress * 52} ${coreY + 129} L ${coreX} ${coreY + 90} L ${coreX - 106 - activeProgress * 52} ${coreY + 129} Z`,
        frame.falseDeathSecondSignalActive
          ? 0.15 + signalProgress * 0.28
          : frame.falseDeathSecondAttackActive
            ? 0.78
            : 0,
        'accent',
        0,
        0.6,
      ),
      path(
        `M ${coreX - 34} ${coreY - 96} L ${coreX} ${coreY - 138} L ${coreX + 34} ${coreY - 96} Z`,
        frame.falseDeathRevived ? 0.96 : 0,
        'accent',
        0,
        0.78,
      ),
    ];
  }
  if (mode === 'action-reactive-punish') {
    const actionProgress = clamp((frame.time - spec.action[0]) / (spec.action[1] - spec.action[0]));
    const responseSignalProgress = clamp(
      (frame.time - spec.responseSignal[0]) / (spec.responseSignal[1] - spec.responseSignal[0]),
    );
    const attackProgress = clamp(
      (frame.time - spec.bossAttack[0]) / (spec.bossAttack[1] - spec.bossAttack[0]),
    );
    const safeActionProgress = clamp(
      (frame.time - spec.safeAction[0]) / (spec.safeAction[1] - spec.safeAction[0]),
    );
    const projectile = frame.actionReactivePunishProjectile;
    const firstActionVisible = frame.time >= spec.action[0] && frame.time < spec.playerReturn[0];
    const lockedTargetVisible =
      frame.time >= spec.observedAt && frame.time < spec.responseRecoveryEndsAt;
    const safeActionVisible = frame.actionReactivePunishSafeActionActive;
    const potion = (opacity, fill) => {
      const x = frame.player.x + 38,
        y = frame.player.y - 35;
      return [
        path(
          `M ${x - 10} ${y - 24} H ${x + 10} V ${y - 9} L ${x + 22} ${y + 8} L ${x + 17} ${y + 30} H ${x - 17} L ${x - 22} ${y + 8} L ${x - 10} ${y - 9} Z`,
          opacity,
          'muted',
          0,
          0.72,
        ),
        path(
          `M ${x - 15} ${y + 8} H ${x + 15} L ${x + 11} ${y + 23} H ${x - 11} Z`,
          opacity,
          fill,
          0,
          0.82,
        ),
        path(
          `M ${x - 15} ${y - 31} H ${x + 15} V ${y - 23} H ${x - 15} Z`,
          opacity,
          'accent',
          0,
          0.84,
        ),
      ];
    };
    return [
      path(
        'M 70 187 L 280 148 L 490 187 V 216 L 280 177 L 70 216 Z M 72 846 L 280 804 L 488 846 V 874 L 280 832 L 72 874 Z M 98 505 L 280 469 L 462 505 V 532 L 280 495 L 98 532 Z',
        0.44,
        'muted',
        0,
        0.58,
      ),
      ...potion(firstActionVisible ? 0.95 : 0, 'safe'),
      path(
        `M ${frame.boss.x + 21} ${frame.boss.y - 35} L ${frame.boss.x + 61} ${frame.boss.y + 9} L ${frame.boss.x + 32} ${frame.boss.y + 26} Z`,
        frame.actionReactivePunishResponseQueued ? 0.36 + responseSignalProgress * 0.5 : 0,
        'accent',
        0,
        0.72,
      ),
      path(
        `M ${spec.lockedTarget[0] - 50} ${spec.lockedTarget[1] - 8} Q ${spec.lockedTarget[0]} ${spec.lockedTarget[1] - 43} ${spec.lockedTarget[0] + 50} ${spec.lockedTarget[1] - 8} L ${spec.lockedTarget[0] + 32} ${spec.lockedTarget[1] + 12} Q ${spec.lockedTarget[0]} ${spec.lockedTarget[1] - 2} ${spec.lockedTarget[0] - 32} ${spec.lockedTarget[1] + 12} Z`,
        lockedTargetVisible ? 0.18 + 0.32 * responseSignalProgress : 0,
        'accent',
        0,
        0.58,
      ),
      path(
        `M ${projectile.x - 7} ${projectile.y - 19} L ${projectile.x + 16} ${projectile.y + 20} L ${projectile.x + 2} ${projectile.y + 9} L ${projectile.x - 13} ${projectile.y + 16} Z`,
        frame.actionReactivePunishProjectileActive ? 0.98 : 0,
        'accent',
        0,
        0.9,
      ),
      path(
        `M ${projectile.x - 9} ${projectile.y - 31} L ${projectile.x + 1} ${projectile.y - 24} L ${projectile.x - 16} ${projectile.y - 9} Z`,
        frame.actionReactivePunishProjectileActive ? 0.56 : 0,
        'signal',
        0,
        0.74,
      ),
      path(
        `M ${frame.boss.x - 117} ${frame.boss.y + 90 + attackProgress * 48} L ${frame.boss.x - 77} ${frame.boss.y + 36} L ${frame.boss.x - 28} ${frame.boss.y + 87} L ${frame.boss.x + 19} ${frame.boss.y + 40} L ${frame.boss.x + 85} ${frame.boss.y + 96} L ${frame.boss.x + 121} ${frame.boss.y + 137 + attackProgress * 48} L ${frame.boss.x} ${frame.boss.y + 117} Z`,
        frame.actionReactivePunishBossAttackActive ? 0.82 : 0,
        'signal',
        0,
        0.58,
      ),
      path(
        `M ${frame.boss.x - 42} ${frame.boss.y + 28} L ${frame.boss.x - 21} ${frame.boss.y + 51} L ${frame.boss.x + 17} ${frame.boss.y + 45} L ${frame.boss.x + 42} ${frame.boss.y + 28} L ${frame.boss.x + 19} ${frame.boss.y + 62} L ${frame.boss.x - 19} ${frame.boss.y + 68} Z`,
        frame.actionReactivePunishSafeWindow ? 0.64 : 0,
        'muted',
        0,
        0.54,
      ),
      ...potion(safeActionVisible ? 0.95 : 0, 'safe'),
      path(
        `M ${frame.player.x + 11} ${frame.player.y - 52} Q ${frame.player.x + 38} ${frame.player.y - 112 - 22 * safeActionProgress} ${frame.player.x + 62} ${frame.player.y - 52} Z`,
        safeActionVisible ? 0.32 + 0.28 * safeActionProgress : 0,
        'safe',
        0,
        0.58,
      ),
    ];
  }
  if (mode === 'run-history-manifestation') {
    const materializeProgress = clamp(
      (frame.time - spec.materialize[0]) / (spec.materialize[1] - spec.materialize[0]),
    );
    const echoSignalProgress = clamp(
      (frame.time - spec.echoSignal[0]) / (spec.echoSignal[1] - spec.echoSignal[0]),
    );
    const relicProgress = clamp(
      (frame.time - spec.relicActive[0]) / (spec.relicActive[1] - spec.relicActive[0]),
    );
    const projectile = frame.runHistoryManifestationProjectile;
    const historyVisible = frame.time < spec.retry[1];
    const manifestationsVisible = frame.time >= spec.materialize[0] && frame.time < spec.retry[1];
    const echoX = spec.echo[0],
      echoY = spec.echo[1];
    const wardX = spec.ward[0],
      wardY = spec.ward[1];
    const relicX = spec.relic[0],
      relicY = spec.relic[1];
    return [
      path(
        'M 70 187 L 280 148 L 490 187 V 216 L 280 177 L 70 216 Z M 72 846 L 280 804 L 488 846 V 874 L 280 832 L 72 874 Z M 83 270 H 477 V 298 H 83 Z',
        0.45,
        'muted',
        0,
        0.62,
      ),
      path(
        'M 87 113 H 153 L 166 223 H 74 Z M 247 113 H 313 L 325 223 H 235 Z M 407 113 H 473 L 486 223 H 394 Z',
        historyVisible ? 0.58 : 0,
        'muted',
        0,
        0.72,
      ),
      path(
        'M 98 179 L 111 149 H 139 L 151 179 L 141 201 H 109 Z M 109 181 H 141 V 190 H 109 Z',
        historyVisible ? 0.9 : 0,
        'accent',
        0,
        0.78,
      ),
      path(
        'M 265 145 H 295 V 176 L 303 188 L 280 211 L 257 188 L 265 176 Z M 269 151 H 291 V 160 H 269 Z',
        historyVisible ? 0.9 : 0,
        'safe',
        0,
        0.78,
      ),
      path(
        'M 438 144 L 452 162 L 462 191 L 440 207 L 418 191 L 428 162 Z M 432 144 H 448 V 153 H 432 Z',
        historyVisible ? 0.9 : 0,
        'signal',
        0,
        0.78,
      ),
      path(
        'M 218 267 L 280 238 L 342 267 V 302 H 218 Z M 235 267 H 325 V 291 H 235 Z',
        frame.runHistoryManifestationCaptured ? 0.72 : 0.28,
        'muted',
        0,
        0.7,
      ),
      path(
        `M ${echoX - 38} ${echoY + 49} Q ${echoX - 45} ${echoY - 11} ${echoX - 20} ${echoY - 18} Q ${echoX - 19} ${echoY - 65} ${echoX} ${echoY - 67} Q ${echoX + 19} ${echoY - 65} ${echoX + 20} ${echoY - 18} Q ${echoX + 45} ${echoY - 11} ${echoX + 38} ${echoY + 49} L ${echoX + 16} ${echoY + 30} L ${echoX} ${echoY + 52} L ${echoX - 16} ${echoY + 30} Z`,
        manifestationsVisible ? 0.42 + 0.36 * echoSignalProgress : 0,
        'accent',
        0,
        0.72,
      ),
      path(
        `M ${echoX - 14} ${echoY - 43} L ${echoX - 5} ${echoY - 47} L ${echoX - 3} ${echoY - 34} H ${echoX - 14} Z M ${echoX + 5} ${echoY - 47} L ${echoX + 14} ${echoY - 43} V ${echoY - 34} H ${echoX + 3} Z`,
        manifestationsVisible ? 0.86 : 0,
        'signal',
        0,
        0.84,
      ),
      path(
        `M ${projectile.x} ${projectile.y + 22} L ${projectile.x - 12} ${projectile.y - 10} L ${projectile.x} ${projectile.y - 3} L ${projectile.x + 12} ${projectile.y - 10} Z`,
        frame.runHistoryManifestationEchoActive ? 0.98 : 0,
        'accent',
        0,
        0.88,
      ),
      path(
        `M ${wardX} ${wardY - 76} L ${wardX + 58} ${wardY - 48} L ${wardX + 51} ${wardY + 27} Q ${wardX + 37} ${wardY + 71} ${wardX} ${wardY + 84} Q ${wardX - 37} ${wardY + 71} ${wardX - 51} ${wardY + 27} L ${wardX - 58} ${wardY - 48} Z`,
        manifestationsVisible ? (frame.runHistoryManifestationWardProtecting ? 0.48 : 0.28) : 0,
        'safe',
        0,
        0.55,
      ),
      path(
        `M ${wardX - 26} ${wardY - 3} L ${wardX - 8} ${wardY + 17} L ${wardX + 27} ${wardY - 27} L ${wardX + 11} ${wardY + 40} L ${wardX - 25} ${wardY + 30} Z`,
        manifestationsVisible ? 0.88 : 0,
        'safe',
        0,
        0.82,
      ),
      path(
        `M ${relicX - 12} ${relicY - 29} H ${relicX + 12} V ${relicY - 18} H ${relicX - 12} Z M ${relicX - 17} ${relicY - 15} L ${relicX + 17} ${relicY - 15} L ${relicX + 20} ${relicY + 14} L ${relicX} ${relicY + 27} L ${relicX - 20} ${relicY + 14} Z`,
        manifestationsVisible ? 0.52 + materializeProgress * 0.38 : 0,
        'signal',
        0,
        0.76,
      ),
      path(
        `M ${frame.boss.x - 120 - relicProgress * 52} ${frame.boss.y + 93} L ${frame.boss.x - 67} ${frame.boss.y + 22} L ${frame.boss.x - 26} ${frame.boss.y + 76} L ${frame.boss.x + 22} ${frame.boss.y + 12} L ${frame.boss.x + 79} ${frame.boss.y + 76} L ${frame.boss.x + 122 + relicProgress * 52} ${frame.boss.y + 96} L ${frame.boss.x} ${frame.boss.y + 128} Z`,
        frame.runHistoryManifestationRelicActive ? 0.52 + 0.26 * relicProgress : 0,
        'signal',
        0,
        0.56,
      ),
    ];
  }
  if (mode === 'partner-revival') {
    const activeChannelProgress = frame.partnerRevivalChannelProgress;
    const partnerDown = frame.partnerRevivalPartnerDowned;
    const completion = frame.partnerRevivalCompletionAuthorized;
    const channel = frame.partnerRevivalChannelActive;
    const firstStrike = strikePulse(frame.time, spec.firstDownAt, 0.34);
    const secondStrike = strikePulse(frame.time, spec.secondDownAt, 0.34);
    const interruptStrike = strikePulse(frame.time, spec.interruptAt, 0.38);
    const finishStrike = strikePulse(frame.time, spec.survivorDownAt, 0.4);
    return [
      path(
        'M 88 126 H 472 V 339 H 438 V 165 H 122 V 339 H 88 Z M 212 165 H 348 V 324 H 212 Z',
        0.72,
        'muted',
        0,
        0.54,
      ),
      path(
        'M 212 165 H 280 V 324 H 212 Z M 280 165 H 348 V 324 H 280 Z',
        completion ? 0.1 : 0.64,
        'accent',
        0,
        0.36,
      ),
      path(
        'M 241 184 H 255 V 307 H 241 Z M 305 184 H 319 V 307 H 305 Z',
        completion ? 0.08 : 0.45,
        'muted',
        0,
        0.62,
      ),
      path('M 218 168 H 342 V 324 H 218 Z', completion ? 0.86 : 0, 'safe', 0, 0.48),
      path(
        'M 90 316 H 132 V 813 H 90 Z M 428 316 H 470 V 813 H 428 Z M 75 805 H 485 V 842 H 75 Z',
        0.5,
        'muted',
        0,
        0.52,
      ),
      path(
        'M 78 752 L 280 714 L 482 752 V 781 L 280 742 L 78 781 Z M 80 867 L 280 829 L 480 867 V 894 L 280 856 L 80 894 Z',
        0.52,
        'muted',
        0,
        0.6,
      ),
      path(
        'M 92 535 L 250 523 L 267 549 L 91 565 Z M 91 565 L 267 549 V 590 L 91 605 Z',
        0.86,
        'muted',
        0,
        0.72,
      ),
      path(
        'M 102 532 L 244 521 L 252 534 L 103 550 Z',
        partnerDown ? 0.86 : 0.44,
        'signal',
        0,
        0.32,
      ),
      path(
        'M 116 352 L 104 331 L 116 303 L 129 333 Z M 444 352 L 431 333 L 444 303 L 456 331 Z',
        0.86,
        'accent',
        0,
        0.76,
      ),
      path(
        `M ${spec.boss[0] - 12} ${spec.boss[1] - 42} L ${spec.partner[0] + 20} ${spec.partner[1] - 31} L ${spec.partner[0] + 8} ${spec.partner[1] - 54} L ${spec.boss[0] + 9} ${spec.boss[1] - 58} Z`,
        channel ? 0.42 + activeChannelProgress * 0.38 : 0,
        'safe',
        0,
        0.48,
      ),
      path(
        `M ${spec.partner[0] + 3} ${spec.partner[1] - 80} L ${spec.partner[0] + 22} ${spec.partner[1] - 52} L ${spec.partner[0] + 3} ${spec.partner[1] - 28} L ${spec.partner[0] - 15} ${spec.partner[1] - 52} Z`,
        channel ? 0.42 + activeChannelProgress * 0.54 : 0,
        'safe',
        0,
        0.72,
      ),
      line(
        frame.player.x - 8,
        frame.player.y - 52,
        spec.partner[0] + 20,
        spec.partner[1] + 18,
        Math.max(firstStrike, secondStrike),
        'safe',
        11,
      ),
      line(
        frame.player.x - 8,
        frame.player.y - 52,
        spec.boss[0] + 20,
        spec.boss[1] + 24,
        Math.max(interruptStrike, finishStrike),
        'safe',
        12,
      ),
      path(
        `M ${spec.boss[0] - 38} ${spec.boss[1] - 95} L ${spec.boss[0] - 17} ${spec.boss[1] - 126} L ${spec.boss[0] - 3} ${spec.boss[1] - 86} Z M ${spec.boss[0] + 22} ${spec.boss[1] - 90} L ${spec.boss[0] + 45} ${spec.boss[1] - 117} L ${spec.boss[0] + 42} ${spec.boss[1] - 78} Z`,
        frame.partnerRevivalInterrupted ? 0.9 : 0,
        'signal',
        0,
        0.86,
      ),
      path('M 264 222 L 280 195 L 296 222 L 280 249 Z', completion ? 0.92 : 0.18, 'safe', 0, 0.78),
    ];
  }
  if (mode === 'kill-order-inheritance') {
    const t = frame.time;
    const leftDown = frame.killOrderInheritanceLeftDown;
    const rightDown = frame.killOrderInheritanceRightDown;
    const waveProgress = clamp(
      (t - spec.waveActive[0]) / (spec.waveActive[1] - spec.waveActive[0]),
    );
    const transferLeft = clamp(
      (t - spec.firstTransfer[0]) / (spec.firstTransfer[1] - spec.firstTransfer[0]),
    );
    const transferRight = clamp(
      (t - spec.secondTransfer[0]) / (spec.secondTransfer[1] - spec.secondTransfer[0]),
    );
    const waveRadius = 64 + spec.waveMaxRadius * waveProgress;
    const firstStrike = strikePulse(t, spec.firstDefeatAt, 0.4);
    const secondStrike = strikePulse(t, spec.secondDefeatAt, 0.4);
    const firstShard = {
      x: mix(spec.partner[0], spec.boss[0], transferLeft),
      y: mix(spec.partner[1] - 62, spec.boss[1] - 72, transferLeft),
    };
    const secondShard = {
      x: mix(spec.boss[0], spec.partner[0], transferRight),
      y: mix(spec.boss[1] - 72, spec.partner[1] - 62, transferRight),
    };
    const firstTransfer = frame.killOrderInheritanceFirstTransferActive;
    const secondTransfer = frame.killOrderInheritanceSecondTransferActive;
    const waveInherited = frame.killOrderInheritanceInheritedPackage === 'rune-wave';
    const lanceInherited = frame.killOrderInheritanceInheritedPackage === 'rune-lance';
    return [
      path(
        'M 70 116 H 490 V 161 H 70 Z M 84 161 H 125 V 806 H 84 Z M 435 161 H 476 V 806 H 435 Z',
        0.6,
        'muted',
        0,
        0.64,
      ),
      path(
        'M 143 161 H 258 V 293 L 201 264 L 143 293 Z M 302 161 H 417 V 293 L 360 264 L 302 293 Z',
        0.48,
        'accent',
        0,
        0.44,
      ),
      path(
        'M 184 190 L 201 173 L 218 190 L 201 219 Z M 345 188 L 360 168 L 375 188 L 360 207 Z',
        0.67,
        'safe',
        0,
        0.72,
      ),
      path(
        'M 96 788 L 280 748 L 464 788 V 816 L 280 777 L 96 816 Z M 82 876 L 280 832 L 478 876 V 905 L 280 861 L 82 905 Z',
        0.52,
        'muted',
        0,
        0.62,
      ),
      path(
        'M 100 518 L 234 506 L 250 529 L 100 550 Z M 100 550 L 250 529 V 578 L 100 600 Z',
        0.76,
        'muted',
        0,
        0.64,
      ),
      path(
        'M 302 436 L 444 423 L 460 449 L 302 466 Z M 302 466 L 460 449 V 499 L 302 516 Z',
        0.76,
        'muted',
        0,
        0.64,
      ),
      path('M 114 509 L 228 499 L 236 513 L 114 527 Z', leftDown ? 0.8 : 0.28, 'signal', 0, 0.52),
      path('M 316 427 L 438 416 L 446 435 L 316 450 Z', rightDown ? 0.8 : 0.28, 'signal', 0, 0.52),
      path(
        `M ${firstShard.x - 16} ${firstShard.y} L ${firstShard.x} ${firstShard.y - 25} L ${firstShard.x + 16} ${firstShard.y} L ${firstShard.x} ${firstShard.y + 22} Z`,
        firstTransfer ? 0.94 : 0,
        'safe',
        0,
        0.82,
      ),
      path(
        `M ${secondShard.x - 16} ${secondShard.y} L ${secondShard.x} ${secondShard.y - 25} L ${secondShard.x + 16} ${secondShard.y} L ${secondShard.x} ${secondShard.y + 22} Z`,
        secondTransfer ? 0.94 : 0,
        'accent',
        0,
        0.82,
      ),
      path(
        `M ${spec.boss[0] - 58} ${spec.boss[1] - 126} L ${spec.boss[0] - 38} ${spec.boss[1] - 167} L ${spec.boss[0] - 16} ${spec.boss[1] - 120} L ${spec.boss[0] + 14} ${spec.boss[1] - 120} L ${spec.boss[0] + 38} ${spec.boss[1] - 167} L ${spec.boss[0] + 58} ${spec.boss[1] - 126} Z`,
        waveInherited ? 0.92 : 0,
        'safe',
        0,
        0.76,
      ),
      path(
        `M ${spec.partner[0] - 50} ${spec.partner[1] - 147} L ${spec.partner[0]} ${spec.partner[1] - 213} L ${spec.partner[0] + 50} ${spec.partner[1] - 147} L ${spec.partner[0] + 12} ${spec.partner[1] - 168} V ${spec.partner[1] - 110} H ${spec.partner[0] - 12} V ${spec.partner[1] - 168} Z`,
        lanceInherited ? 0.92 : 0,
        'accent',
        0,
        0.78,
      ),
      line(
        frame.player.x - 8,
        frame.player.y - 52,
        spec.partner[0] + 20,
        spec.partner[1] + 18,
        firstStrike,
        'safe',
        11,
      ),
      line(
        frame.player.x - 8,
        frame.player.y - 52,
        spec.boss[0] + 20,
        spec.boss[1] + 18,
        secondStrike,
        'safe',
        11,
      ),
      circle(
        spec.boss[0],
        spec.boss[1],
        85,
        frame.killOrderInheritanceWaveSignaled ? 0.48 : 0,
        'signal',
        18,
        0,
      ),
      circle(
        spec.boss[0],
        spec.boss[1],
        waveRadius,
        frame.killOrderInheritanceWaveActive ? 0.92 : 0,
        'signal',
        22,
        0.02,
      ),
      path(
        'M 154 488 L 426 665 L 440 690 L 412 681 L 158 512 Z',
        frame.killOrderInheritanceLanceActive
          ? 0.96
          : frame.killOrderInheritanceLanceSignaled
            ? 0.32
            : 0,
        'signal',
        0,
        0.8,
      ),
      path(
        'M 158 488 L 425 675 L 411 684 L 151 505 Z',
        frame.killOrderInheritanceLanceActive ? 0.82 : 0,
        'accent',
        0,
        0.7,
      ),
      path(
        'M 220 635 L 245 619 L 257 637 L 237 658 Z M 272 620 L 288 600 L 305 620 L 288 640 Z M 324 635 L 340 619 L 354 639 L 333 653 Z',
        frame.killOrderInheritanceRetryTransition ? 0.68 : 0,
        'safe',
        0,
        0.46,
      ),
    ];
  }
  if (mode === 'stack-damage') {
    const t = frame.time;
    const target = point(spec.target);
    const marked =
      (t >= spec.firstSignal[0] && t < spec.firstHit[1]) ||
      (t >= spec.secondSignal[0] && t < spec.secondHit[1]);
    const hit = frame.stackDamageHitActive;
    const count = frame.stackDamageParticipantCount;
    return [
      path(
        'M 68 104 H 492 V 145 H 68 Z M 80 145 H 113 V 813 H 80 Z M 447 145 H 480 V 813 H 447 Z',
        0.5,
        'muted',
        0,
        0.58,
      ),
      path(
        'M 99 784 L 280 748 L 461 784 V 816 L 280 779 L 99 816 Z M 84 874 L 280 834 L 476 874 V 903 L 280 864 L 84 903 Z',
        0.52,
        'muted',
        0,
        0.6,
      ),
      path(
        'M 210 365 L 350 365 L 365 390 L 195 390 Z M 219 390 H 341 V 419 H 219 Z',
        0.6,
        'muted',
        0,
        0.55,
      ),
      ...[0, 1, 2].flatMap((index) => {
        const x = [230, 95, 365][index];
        const current = frame.stackDamageHealth[index];
        return [
          path(`M ${x} 117 H ${x + 100} V 150 L ${x + 50} 163 L ${x} 150 Z`, 0.68, 'muted', 0, 0.7),
          path(
            `M ${x + 7} 125 H ${x + 7 + current * 0.86} V 146 H ${x + 7} Z`,
            0.92,
            current === 0 ? 'signal' : 'safe',
            0,
            0.75,
          ),
        ];
      }),
      circle(
        target.x,
        target.y,
        spec.markerRadius,
        marked ? 0.76 : 0.16,
        hit ? 'signal' : 'accent',
        5,
        marked ? 0.08 : 0.01,
      ),
      path(
        `M ${target.x - 9} ${spec.boss[1] + 20} H ${target.x + 9} V ${target.y - 165} H ${target.x - 9} Z`,
        marked ? 0.7 : 0,
        'muted',
        0,
        0.78,
      ),
      path(
        `M ${target.x - 48} ${target.y - 180} H ${target.x + 48} V ${target.y - 112} L ${target.x + 32} ${target.y - 100} H ${target.x - 32} L ${target.x - 48} ${target.y - 112} Z`,
        marked ? 0.84 : 0,
        'signal',
        0,
        0.72,
      ),
      path(
        `M ${target.x - 32} ${target.y - 164} H ${target.x - 20} V ${target.y - 127} H ${target.x - 32} Z M ${target.x + 20} ${target.y - 164} H ${target.x + 32} V ${target.y - 127} H ${target.x + 20} Z`,
        marked ? 0.78 : 0,
        'muted',
        0,
        0.76,
      ),
      path(
        `M ${target.x - 103} ${target.y + 22} L ${target.x - 38} ${target.y - 8} L ${target.x} ${target.y + 14} L ${target.x + 41} ${target.y - 10} L ${target.x + 108} ${target.y + 19} L ${target.x + 43} ${target.y + 41} L ${target.x - 34} ${target.y + 42} Z`,
        hit ? 0.64 : 0,
        count === 1 ? 'signal' : 'safe',
        0,
        0.56,
      ),
      path(
        `M ${target.x - 31} ${target.y - 82} L ${target.x - 12} ${target.y - 112} L ${target.x} ${target.y - 75} Z M ${target.x + 15} ${target.y - 80} L ${target.x + 37} ${target.y - 114} L ${target.x + 42} ${target.y - 73} Z`,
        hit ? 0.82 : 0,
        count === 1 ? 'signal' : 'safe',
        0,
        0.8,
      ),
      path(
        `M ${target.x - 77} ${target.y - 51} L ${target.x - 58} ${target.y - 88} L ${target.x - 43} ${target.y - 47} Z M ${target.x + 44} ${target.y - 51} L ${target.x + 62} ${target.y - 87} L ${target.x + 79} ${target.y - 47} Z`,
        hit && count === 3 ? 0.88 : 0,
        'safe',
        0,
        0.72,
      ),
    ];
  }
  if (mode === 'personal-spread') {
    const t = frame.time;
    const marked =
      (t >= spec.firstSignal[0] && t < spec.firstHit[1]) ||
      (t >= spec.secondSignal[0] && t < spec.secondHit[1]);
    const active = frame.personalSpreadHitActive;
    const unsafe = frame.personalSpreadHitCounts[0] > 1;
    return [
      path(
        'M 68 104 H 492 V 145 H 68 Z M 80 145 H 113 V 813 H 80 Z M 447 145 H 480 V 813 H 447 Z',
        0.5,
        'muted',
        0,
        0.58,
      ),
      path(
        'M 99 784 L 280 748 L 461 784 V 816 L 280 779 L 99 816 Z M 84 874 L 280 834 L 476 874 V 903 L 280 864 L 84 903 Z',
        0.52,
        'muted',
        0,
        0.6,
      ),
      path(
        'M 210 365 L 350 365 L 365 390 L 195 390 Z M 219 390 H 341 V 419 H 219 Z',
        0.6,
        'muted',
        0,
        0.55,
      ),
      ...frame.personalSpreadHealth.flatMap((value, index) => {
        const x = [230, 95, 365][index];
        return [
          path(`M ${x} 117 H ${x + 100} V 150 L ${x + 50} 163 L ${x} 150 Z`, 0.68, 'muted', 0, 0.7),
          path(
            `M ${x + 7} 125 H ${x + 7 + value * 0.86} V 146 H ${x + 7} Z`,
            0.92,
            value === 0 ? 'signal' : 'safe',
            0,
            0.75,
          ),
        ];
      }),
      ...frame.personalSpreadPositions.flatMap((center, index) => {
        const tone = active && unsafe ? 'signal' : index === 0 ? 'signal' : 'accent';
        return [
          circle(
            center.x,
            center.y,
            spec.markerRadius,
            marked ? 0.72 : 0.14,
            tone,
            5,
            marked ? 0.1 : 0.01,
          ),
          path(
            `M ${center.x - 25} ${center.y - 203} H ${center.x + 25} V ${center.y - 161} L ${center.x} ${center.y - 117} L ${center.x - 25} ${center.y - 161} Z`,
            marked ? 0.9 : 0,
            tone,
            0,
            0.72,
          ),
          path(
            `M ${center.x - 13} ${center.y - 194} H ${center.x + 13} V ${center.y - 182} H ${center.x - 13} Z`,
            marked ? 0.86 : 0,
            'muted',
            0,
            0.7,
          ),
          path(
            `M ${center.x - 60} ${center.y + 17} L ${center.x} ${center.y - 10} L ${center.x + 60} ${center.y + 17} L ${center.x + 25} ${center.y + 38} H ${center.x - 25} Z`,
            active ? 0.68 : 0,
            unsafe ? 'signal' : 'safe',
            0,
            0.55,
          ),
        ];
      }),
    ];
  }
  if (mode === 'tower-soak') {
    const t = frame.time;
    const center = frame.towerSoakCenter;
    const visible = frame.towerSoakFirstVisible || frame.towerSoakSecondVisible;
    const failure = frame.towerSoakFailure;
    const resolved = t >= spec.firstHit[0] && t < spec.secondSignal[0];
    const tone = failure ? 'signal' : resolved ? 'safe' : 'accent';
    return [
      path(
        'M 70 103 H 490 V 145 H 70 Z M 83 145 H 118 V 820 H 83 Z M 442 145 H 477 V 820 H 442 Z',
        0.52,
        'muted',
        0,
        0.61,
      ),
      path(
        'M 100 790 L 280 748 L 460 790 V 819 L 280 779 L 100 819 Z M 85 878 L 280 836 L 475 878 V 905 L 280 865 L 85 905 Z',
        0.52,
        'muted',
        0,
        0.6,
      ),
      path(
        'M 205 352 L 355 352 L 370 380 L 190 380 Z M 215 380 H 345 V 415 H 215 Z',
        0.62,
        'muted',
        0,
        0.58,
      ),
      ...frame.towerSoakHealth.flatMap((health, index) => {
        const x = 145 + index * 170;
        return [
          path(`M ${x} 118 H ${x + 100} V 151 L ${x + 50} 164 L ${x} 151 Z`, 0.7, 'muted', 0, 0.67),
          path(
            `M ${x + 7} 126 H ${x + 7 + health * 0.86} V 147 H ${x + 7} Z`,
            0.92,
            health === 0 ? 'signal' : 'safe',
            0,
            0.75,
          ),
        ];
      }),
      ...[spec.firstTower, spec.secondTower].flatMap(([x, y]) => {
        const active = visible && center.x === x;
        return [
          path(
            `M ${x - 48} ${y - 9} H ${x + 48} V ${y + 21} H ${x - 48} Z M ${x - 29} ${y - 100} H ${x + 29} V ${y - 9} H ${x - 29} Z`,
            active ? 0.88 : 0.43,
            'muted',
            0,
            0.7,
          ),
          path(
            `M ${x - 30} ${y - 100} L ${x} ${y - 145} L ${x + 30} ${y - 100} Z`,
            active ? 0.92 : 0.5,
            active ? tone : 'accent',
            0,
            0.74,
          ),
          path(
            `M ${x - 12} ${y - 78} H ${x + 12} V ${y - 40} H ${x - 12} Z`,
            active ? 0.82 : 0.16,
            active ? tone : 'accent',
            0,
            0.7,
          ),
        ];
      }),
      circle(
        center.x,
        center.y,
        spec.towerRadius,
        visible ? 0.82 : 0.14,
        tone,
        6,
        visible ? 0.07 : 0.01,
      ),
      ...[0, 1].map((index) =>
        path(
          `M ${center.x - 19 + index * 27} ${center.y - 124} H ${center.x - 3 + index * 27} V ${center.y - 108} H ${center.x - 19 + index * 27} Z`,
          visible && index < frame.towerSoakRequiredCount ? 0.88 : 0,
          index < frame.towerSoakOccupiedCount ? 'safe' : 'signal',
          0,
          0.78,
        ),
      ),
      line(
        spec.boss[0],
        spec.boss[1] + 39,
        center.x,
        center.y - 145,
        visible ? 0.52 : 0,
        'signal',
        6,
        '13 10',
      ),
      path(
        `M ${center.x - 76} ${center.y + 8} L ${center.x - 37} ${center.y - 31} L ${center.x - 12} ${center.y + 6} L ${center.x + 30} ${center.y - 35} L ${center.x + 78} ${center.y + 12} L ${center.x + 26} ${center.y + 30} H ${center.x - 30} Z`,
        failure ? 0.86 : 0,
        'signal',
        0,
        0.67,
      ),
    ];
  }
  if (mode === 'entity-tether') {
    const ally = frame.entityTetherAlly;
    const player = frame.player;
    const visible = frame.entityTetherVisible;
    const broken = frame.entityTetherBroken;
    const tone = broken ? 'signal' : frame.entityTetherHeld ? 'safe' : 'accent';
    const dx = ally.x - player.x;
    const dy = ally.y - player.y;
    const length = Math.hypot(dx, dy) || 1;
    const midX = (player.x + ally.x) / 2;
    const midY = (player.y + ally.y) / 2 - 55;
    const nearX = midX - (dx / length) * 22;
    const nearY = midY - (dy / length) * 22;
    const farX = midX + (dx / length) * 22;
    const farY = midY + (dy / length) * 22;
    return [
      path(
        'M 70 105 H 490 V 147 H 70 Z M 82 147 H 117 V 818 H 82 Z M 443 147 H 478 V 818 H 443 Z',
        0.52,
        'muted',
        0,
        0.61,
      ),
      path(
        'M 99 790 L 280 750 L 461 790 V 821 L 280 781 L 99 821 Z M 84 877 L 280 836 L 476 877 V 905 L 280 865 L 84 905 Z',
        0.52,
        'muted',
        0,
        0.6,
      ),
      path(
        'M 210 352 H 350 L 365 379 H 195 Z M 224 379 H 336 V 414 H 224 Z',
        0.58,
        'muted',
        0,
        0.6,
      ),
      circle(280, 344, 34, 0.52, 'accent', 0, 0.58),
      path('M 272 326 H 288 V 362 H 272 Z M 262 336 H 298 V 352 H 262 Z', 0.7, 'muted', 0, 0.76),
      ...frame.entityTetherHealth.flatMap((health, index) => {
        const x = 145 + index * 170;
        return [
          path(`M ${x} 118 H ${x + 100} V 151 L ${x + 50} 164 L ${x} 151 Z`, 0.7, 'muted', 0, 0.67),
          path(
            `M ${x + 7} 126 H ${x + 7 + health * 0.86} V 147 H ${x + 7} Z`,
            0.92,
            health < 100 ? 'signal' : 'safe',
            0,
            0.75,
          ),
        ];
      }),
      line(
        player.x,
        player.y - 55,
        broken ? nearX : ally.x,
        broken ? nearY : ally.y - 55,
        visible ? 0.92 : 0,
        tone,
        9,
      ),
      line(farX, farY, ally.x, ally.y - 55, broken ? 0.92 : 0, 'signal', 9),
      ...Array.from({ length: 5 }, (_, index) => {
        const u = (index + 1) / 6;
        const x = mix(player.x, ally.x, u);
        const y = mix(player.y - 55, ally.y - 55, u);
        return path(
          `M ${x - 8} ${y} L ${x} ${y - 9} L ${x + 8} ${y} L ${x} ${y + 9} Z`,
          visible && (!broken || u < 0.4 || u > 0.6) ? 0.78 : 0,
          tone,
          0,
          0.66,
        );
      }),
      circle(player.x, player.y - 55, 13, visible ? 0.89 : 0, tone, 0, 0.7),
      circle(ally.x, ally.y - 55, 13, visible ? 0.89 : 0, tone, 0, 0.7),
      path(
        `M ${nearX - 9} ${nearY - 15} L ${nearX + 9} ${nearY + 2} L ${nearX - 3} ${nearY + 10} Z M ${farX + 8} ${farY - 14} L ${farX - 7} ${farY + 2} L ${farX + 5} ${farY + 11} Z`,
        broken ? 0.95 : 0,
        'signal',
        0,
        0.8,
      ),
    ];
  }
  if (mode === 'gaze-check') {
    const visible = frame.gazeVisible;
    const pulse = frame.gazeHitActive;
    const hit = frame.gazeFailure;
    const tone = hit ? 'signal' : pulse ? 'safe' : 'accent';
    const sourceX = spec.boss[0];
    const sourceY = spec.boss[1] - 42;
    const targetX = frame.player.x;
    const targetY = frame.player.y - 42;
    return [
      path(
        'M 200 349 H 360 L 374 378 H 186 Z M 214 378 H 346 V 415 H 214 Z',
        0.64,
        'muted',
        0,
        0.62,
      ),
      path('M 200 117 H 360 V 151 L 280 169 L 200 151 Z', 0.7, 'muted', 0, 0.67),
      path(
        `M 210 126 H ${210 + frame.gazeHealth * 1.4} V 145 H 210 Z`,
        0.92,
        hit ? 'signal' : 'safe',
        0,
        0.77,
      ),
      path(
        `M ${sourceX - 33} ${sourceY - 9} L ${sourceX} ${sourceY - 24} L ${sourceX + 33} ${sourceY - 9} L ${sourceX} ${sourceY + 8} Z`,
        visible ? 0.9 : 0.24,
        'accent',
        0,
        0.64,
      ),
      path(
        `M ${sourceX - 14} ${sourceY - 10} H ${sourceX + 14} V ${sourceY + 2} H ${sourceX - 14} Z`,
        visible ? 0.96 : 0.18,
        'safe',
        0,
        0.8,
      ),
      path(
        `M ${sourceX - 13} ${sourceY + 6} L ${targetX - 68} ${targetY + 19} L ${targetX + 68} ${targetY + 19} L ${sourceX + 13} ${sourceY + 6} Z`,
        visible ? (pulse ? 0.42 : 0.18) : 0,
        tone,
        0,
        0.45,
      ),
      line(sourceX, sourceY + 3, targetX, targetY, pulse ? 0.7 : 0, tone, 10),
      path(
        `M ${targetX - 64} ${targetY + 44} L ${targetX - 23} ${targetY + 6} L ${targetX + 9} ${targetY + 32} L ${targetX + 42} ${targetY + 3} L ${targetX + 70} ${targetY + 43} Z`,
        hit ? 0.86 : 0,
        'signal',
        0,
        0.68,
      ),
    ];
  }
  if (mode === 'proximity-damage') {
    const visible = frame.proximityVisible;
    const pulse = frame.proximityHitActive;
    const source = point(spec.source);
    const sample = frame.proximityCurrentDamage;
    const tone = sample > 50 ? 'signal' : 'safe';
    const flash = Math.max(
      strikePulse(frame.time, spec.firstCheck[0], 0.4),
      strikePulse(frame.time, spec.secondCheck[0], 0.4),
    );
    const rise =
      smooth((frame.time - spec.firstWarnAt) / 0.36) *
      (1 - smooth((frame.time - spec.resetAt) / 0.38));
    const playerX = frame.player.x;
    const playerY = frame.player.y;
    return [
      path('M 200 117 H 360 V 150 L 280 169 L 200 150 Z', 0.72, 'muted', 0, 0.68),
      path(
        `M 210 125 H ${210 + frame.proximityHealth * 1.4} V 145 H 210 Z`,
        0.92,
        frame.proximityHealth < 30 ? 'signal' : 'safe',
        0,
        0.76,
      ),
      circle(source.x, source.y, spec.outerRadius, visible ? 0.24 + flash * 0.13 : 0, 'safe', 3),
      circle(source.x, source.y, spec.innerRadius, visible ? 0.42 + flash * 0.2 : 0, 'signal', 3),
      circle(
        source.x,
        source.y,
        (spec.innerRadius + spec.outerRadius) / 2,
        visible ? 0.27 + flash * 0.16 : 0,
        'accent',
        2,
      ),
      path(
        `M ${source.x - 38} ${source.y + 13} L ${source.x - 26} ${source.y - 3} L ${source.x - 9} ${source.y + 1} L ${source.x + 3} ${source.y - 9} L ${source.x + 27} ${source.y + 4} L ${source.x + 37} ${source.y + 16} L ${source.x + 15} ${source.y + 24} L ${source.x - 22} ${source.y + 23} Z`,
        rise * 0.92,
        'muted',
        2,
        0.9,
      ),
      path(
        `M ${source.x - 16} ${source.y + 8} L ${source.x - 8} ${source.y - 25 * rise} L ${source.x + 2} ${source.y - 47 * rise} L ${source.x + 18} ${source.y - 20 * rise} L ${source.x + 15} ${source.y + 9} Z`,
        rise * 0.98,
        'muted',
        2,
        0.94,
      ),
      path(
        `M ${source.x - 7} ${source.y - 3 * rise} L ${source.x + 2} ${source.y - 39 * rise} L ${source.x + 9} ${source.y - 20 * rise} M ${source.x - 22} ${source.y + 12} L ${source.x - 11} ${source.y + 7} M ${source.x + 15} ${source.y + 11} L ${source.x + 27} ${source.y + 15}`,
        rise * (pulse ? 0.96 : 0.68),
        pulse ? 'signal' : 'accent',
        3,
      ),
      circle(source.x, source.y - 21 * rise, 19 + 24 * flash, flash * 0.78, tone, 3),
      path(
        `M ${playerX - 29} ${playerY - 24} L ${playerX - 39} ${playerY - 39} L ${playerX - 35} ${playerY - 13} M ${playerX + 27} ${playerY - 28} L ${playerX + 38} ${playerY - 41} L ${playerX + 34} ${playerY - 13}`,
        pulse ? 0.5 + Math.min(sample / 180, 0.4) : 0,
        tone,
        4,
      ),
    ];
  }
  if (mode === 'tank-swap') {
    const owner = frame.tankSwapOwner === 'tavi' ? frame.player : frame.tankSwapAlly;
    const target = frame.tankSwapHitId === spec.firstHitId ? frame.player : frame.tankSwapAlly;
    const visible = frame.tankSwapVisible;
    const hit = frame.tankSwapHitActive;
    const hammerY = target.y - (hit ? 127 : 193);
    const firstFlash = strikePulse(frame.time, spec.firstHit[0], 0.46);
    const secondFlash = strikePulse(frame.time, spec.secondHit[0], 0.46);
    const flash = Math.max(firstFlash, secondFlash);
    return [
      path('M 218 352 H 342 L 326 381 H 234 Z', 0.72, 'muted', 0, 0.7),
      path(
        'M 92 123 H 250 V 160 L 171 184 L 92 160 Z M 310 123 H 468 V 160 L 389 184 L 310 160 Z',
        0.78,
        'muted',
        0,
        0.65,
      ),
      path(
        `M 105 131 H ${105 + frame.tankSwapHealth[0] * 1.32} V 150 H 105 Z`,
        0.94,
        'safe',
        0,
        0.78,
      ),
      path(
        `M 323 131 H ${323 + frame.tankSwapHealth[1] * 1.32} V 150 H 323 Z`,
        0.94,
        'safe',
        0,
        0.78,
      ),
      path(
        `M ${owner.x - 55} ${owner.y + 24} L ${owner.x} ${owner.y - 8} L ${owner.x + 55} ${owner.y + 24} L ${owner.x + 42} ${owner.y + 61} L ${owner.x} ${owner.y + 81} L ${owner.x - 42} ${owner.y + 61} Z`,
        visible ? 0.76 : 0.24,
        'accent',
        0,
        0.28,
      ),
      path(
        `M ${owner.x - 23} ${owner.y - 139} H ${owner.x + 23} V ${owner.y - 120} L ${owner.x + 12} ${owner.y - 108} H ${owner.x - 12} L ${owner.x - 23} ${owner.y - 120} Z`,
        visible ? 0.92 : 0,
        'accent',
        0,
        0.76,
      ),
      path(
        `M ${frame.player.x - 44} ${frame.player.y + 29} L ${frame.player.x - 4} ${frame.player.y + 63} L ${frame.player.x + 42} ${frame.player.y + 32} L ${frame.player.x + 25} ${frame.player.y + 71} L ${frame.player.x - 12} ${frame.player.y + 84} Z`,
        frame.tankSwapVulnerability[0] && !frame.tankSwapRetry ? 0.83 : 0,
        'signal',
        0,
        0.36,
      ),
      path(
        `M ${target.x - 7} ${hammerY - 94} H ${target.x + 7} V ${hammerY + 21} H ${target.x - 7} Z M ${target.x - 45} ${hammerY - 12} H ${target.x + 45} V ${hammerY + 18} H ${target.x - 45} Z`,
        visible ? (hit ? 1 : 0.5) : 0,
        'signal',
        0,
        0.8,
      ),
      path(
        `M ${target.x - 51} ${target.y + 28} L ${target.x - 19} ${target.y + 8} L ${target.x - 1} ${target.y + 31} L ${target.x + 23} ${target.y + 5} L ${target.x + 50} ${target.y + 30} L ${target.x + 15} ${target.y + 57} H ${target.x - 14} Z`,
        flash * 0.8,
        'signal',
        0,
        0.65,
      ),
    ];
  }
  if (mode === 'debuff-handoff') {
    const owner = frame.debuffHandoffOwner === 'player-1' ? frame.player : frame.debuffHandoffAlly;
    const transferPulse = Math.max(
      strikePulse(frame.time, spec.firstPassAt, 0.34),
      strikePulse(frame.time, spec.secondPassAt, 0.34),
    );
    const countdown = frame.debuffHandoffRemaining / spec.debuffDuration;
    const flameTip = owner.y - 193 - 18 * (1 - countdown);
    const visible = frame.debuffHandoffVisible;
    return [
      path('M 218 352 H 342 L 326 381 H 234 Z', 0.72, 'muted', 0, 0.7),
      path(
        `M ${frame.player.x - 41} ${frame.player.y + 37} L ${frame.player.x} ${frame.player.y + 17} L ${frame.player.x + 41} ${frame.player.y + 37} L ${frame.player.x + 30} ${frame.player.y + 56} L ${frame.player.x} ${frame.player.y + 68} L ${frame.player.x - 30} ${frame.player.y + 56} Z`,
        frame.debuffHandoffImmunity[0] ? 0.72 : 0.22,
        frame.debuffHandoffImmunity[0] ? 'safe' : 'muted',
        0,
        0.38,
      ),
      path(
        `M ${frame.debuffHandoffAlly.x - 41} ${frame.debuffHandoffAlly.y + 37} L ${frame.debuffHandoffAlly.x} ${frame.debuffHandoffAlly.y + 17} L ${frame.debuffHandoffAlly.x + 41} ${frame.debuffHandoffAlly.y + 37} L ${frame.debuffHandoffAlly.x + 30} ${frame.debuffHandoffAlly.y + 56} L ${frame.debuffHandoffAlly.x} ${frame.debuffHandoffAlly.y + 68} L ${frame.debuffHandoffAlly.x - 30} ${frame.debuffHandoffAlly.y + 56} Z`,
        frame.debuffHandoffImmunity[1] ? 0.72 : 0.22,
        frame.debuffHandoffImmunity[1] ? 'safe' : 'muted',
        0,
        0.38,
      ),
      path(
        `M ${owner.x - 26} ${owner.y - 158} H ${owner.x + 26} L ${owner.x + 19} ${owner.y - 108} H ${owner.x - 19} Z M ${owner.x - 32} ${owner.y - 164} H ${owner.x + 32} V ${owner.y - 153} H ${owner.x - 32} Z`,
        visible ? 0.9 : 0,
        'muted',
        0,
        0.76,
      ),
      path(
        `M ${owner.x - 16} ${owner.y - 150} H ${owner.x + 16} L ${owner.x + 12} ${owner.y - 120} H ${owner.x - 12} Z`,
        visible ? 0.97 : 0,
        'signal',
        0,
        0.84,
      ),
      path(
        `M ${owner.x - 13} ${owner.y - 149} L ${owner.x - 5} ${flameTip} L ${owner.x + 5} ${owner.y - 157} L ${owner.x + 14} ${flameTip + 8} L ${owner.x + 12} ${owner.y - 142} Z`,
        visible ? 0.96 : 0,
        'signal',
        0,
        0.82,
      ),
      path(
        `M ${frame.player.x + 16} ${frame.player.y - 81} L ${frame.debuffHandoffAlly.x - 16} ${frame.debuffHandoffAlly.y - 81} L ${frame.debuffHandoffAlly.x - 16} ${frame.debuffHandoffAlly.y - 63} L ${frame.player.x + 16} ${frame.player.y - 63} Z`,
        transferPulse * 0.8,
        'signal',
        0,
        0.48,
      ),
      path(
        `M ${owner.x - 58} ${owner.y + 38} L ${owner.x - 22} ${owner.y + 3} L ${owner.x - 1} ${owner.y + 35} L ${owner.x + 25} ${owner.y + 5} L ${owner.x + 58} ${owner.y + 38} Z`,
        frame.debuffHandoffBurstActive ? 0.65 : 0,
        'signal',
        0,
        0.7,
      ),
    ];
  }
  if (mode === 'ordered-targets') {
    const t = frame.time;
    const visible = t >= spec.revealAt && t < spec.resetAt;
    return [
      path('M 218 352 H 342 L 326 381 H 234 Z', 0.72, 'muted', 0, 0.7),
      ...spec.receivingSpots.flatMap(([x, y], index) => {
        const number = index + 1;
        const hitAt = spec.hits[index];
        const pulse = strikePulse(t, hitAt, spec.hitDuration);
        const pending = visible && frame.orderedTargetNext === number;
        const complete = visible && frame.orderedTargetNext > number;
        const spearY = y - (pulse > 0 ? 142 - 55 * pulse : 185);
        const spearOpacity = pulse > 0 ? 0.95 : pending ? 0.48 : 0;
        return [
          path(
            `M ${x - 54} ${y + 20} L ${x} ${y - 12} L ${x + 54} ${y + 20} L ${x + 42} ${y + 52} L ${x} ${y + 74} L ${x - 42} ${y + 52} Z`,
            visible ? (pending ? 0.86 : 0.54) : 0.33,
            pending ? 'signal' : 'muted',
            0,
            0.36,
          ),
          path(
            `M ${x - 6} ${spearY - 126} H ${x + 6} V ${spearY - 32} H ${x - 6} Z M ${x - 18} ${spearY - 44} H ${x + 18} V ${spearY - 32} H ${x - 18} Z`,
            spearOpacity,
            'muted',
            0,
            0.82,
          ),
          path(
            `M ${x - 22} ${spearY - 32} L ${x - 13} ${spearY - 43} L ${x + 13} ${spearY - 43} L ${x + 22} ${spearY - 32} L ${x} ${spearY + 39} Z`,
            spearOpacity,
            'signal',
            0,
            0.76,
          ),
          path(
            `M ${x - 40} ${y + 22} L ${x - 15} ${y - 4} L ${x} ${y + 15} L ${x + 20} ${y - 4} L ${x + 42} ${y + 25} L ${x + 13} ${y + 47} H ${x - 13} Z`,
            pulse * 0.8,
            'signal',
            0,
            0.7,
          ),
          path(
            `M ${x - 26} ${y + 57} L ${x - 11} ${y + 36} L ${x + 1} ${y + 48} L ${x + 18} ${y + 32} L ${x + 32} ${y + 52} L ${x + 6} ${y + 66} Z`,
            complete ? 0.7 : 0,
            'safe',
            0,
            0.44,
          ),
        ];
      }),
    ];
  }
  if (mode === 'pairing-polarity') {
    const visible = frame.time >= spec.revealAt && frame.time < spec.resetAt;
    const impact = strikePulse(frame.time, spec.resolveAt, spec.hitDuration);
    const tone = frame.pairingPolaritySuccess ? 'safe' : 'signal';
    return [
      path('M 218 352 H 342 L 326 381 H 234 Z', 0.72, 'muted', 0, 0.7),
      ...spec.zones.flatMap(([x, y], index) => {
        const pair = index
          ? [frame.pairingPolarityPositions[1], frame.pairingPolarityPositions[3]]
          : [frame.pairingPolarityPositions[0], frame.pairingPolarityPositions[2]];
        const bridgeY = (pair[0].y + pair[1].y) / 2 + 39;
        return [
          path(
            `M ${x - 83} ${y + 24} L ${x} ${y - 16} L ${x + 83} ${y + 24} L ${x + 65} ${y + 72} L ${x} ${y + 93} L ${x - 65} ${y + 72} Z`,
            0.72,
            'muted',
            0,
            0.55,
          ),
          path(
            `M ${x - 52} ${y - 205} H ${x + 52} V ${y - 177} H ${x - 52} Z M ${x - 37} ${y - 177} H ${x + 37} V ${y - 82} H ${x - 37} Z M ${x - 53} ${y - 82} H ${x + 53} V ${y - 64} H ${x - 53} Z`,
            0.7,
            'muted',
            0,
            0.67,
          ),
          path(
            `M ${x} ${y - 205} L ${x + 28} ${y - 175} L ${x} ${y - 139} L ${x - 28} ${y - 175} Z`,
            visible ? 0.97 : 0.38,
            tone,
            0,
            0.75,
          ),
          path(
            `M ${pair[0].x} ${bridgeY - 8} H ${pair[1].x} V ${bridgeY + 8} H ${pair[0].x} Z`,
            visible && frame.time >= spec.move[1]
              ? frame.pairingPolaritySuccess
                ? 0.83
                : 0.52
              : 0,
            tone,
            0,
            0.7,
          ),
          circle(x, y - 172, 20 + impact * 20, impact * 0.45, tone, 0, 0.55),
        ];
      }),
    ];
  }
  if (mode === 'party-split') {
    const visible = frame.time >= spec.revealAt && frame.time < spec.resetAt;
    const leftDone = frame.partySplitCompletedSides.includes('left');
    const rightDone = frame.partySplitCompletedSides.includes('right');
    const gateOpen = frame.partySplitGateOpen;
    const leftDoorEnd = gateOpen ? 193 : 280;
    const rightDoorStart = gateOpen ? 367 : 280;
    return [
      path('M 218 352 H 342 L 326 381 H 234 Z', 0.72, 'muted', 0, 0.7),
      path(
        'M 260 401 H 300 V 773 H 260 Z M 246 401 H 314 V 428 H 246 Z M 247 746 H 313 V 773 H 247 Z',
        visible ? 0.9 : 0.5,
        'muted',
        0,
        0.7,
      ),
      path(
        'M 111 607 H 209 V 647 H 111 Z M 125 525 H 195 V 607 H 125 Z M 351 607 H 449 V 647 H 351 Z M 365 525 H 435 V 607 H 365 Z',
        visible ? 0.88 : 0.55,
        'muted',
        0,
        0.76,
      ),
      path(
        'M 160 481 L 186 518 L 160 551 L 134 518 Z',
        visible ? 0.97 : 0.36,
        leftDone ? 'safe' : 'signal',
        0,
        0.75,
      ),
      path(
        `M 378 570 H 422 V 586 H 378 Z M 400 573 L ${rightDone ? 386 : 418} 509 L ${rightDone ? 398 : 430} 505 L 408 573 Z`,
        visible ? 0.96 : 0.37,
        rightDone ? 'safe' : 'accent',
        0,
        0.75,
      ),
      circle(
        rightDone ? 392 : 424,
        507,
        12,
        visible ? 0.96 : 0.37,
        rightDone ? 'safe' : 'accent',
        0,
        0.9,
      ),
      path(
        'M 119 620 H 201 V 633 H 119 Z M 359 620 H 441 V 633 H 359 Z',
        visible ? 0.91 : 0.4,
        'accent',
        0,
        0.47,
      ),
      path(
        `M 119 620 H ${119 + 82 * frame.partySplitProgress[0]} V 633 H 119 Z M 359 620 H ${359 + 82 * frame.partySplitProgress[1]} V 633 H 359 Z`,
        visible ? 0.95 : 0,
        'safe',
        0,
        0.82,
      ),
      path(
        `M 109 786 H ${leftDoorEnd} V 822 H 109 Z M ${rightDoorStart} 786 H 451 V 822 H ${rightDoorStart} Z`,
        visible ? 0.98 : 0.48,
        gateOpen ? 'safe' : 'muted',
        0,
        0.8,
      ),
      path(
        'M 191 828 L 280 803 L 369 828 V 853 L 280 829 L 191 853 Z',
        gateOpen && visible ? 0.67 : 0,
        'safe',
        0,
        0.41,
      ),
    ];
  }
  if (mode === 'coordinated-duo-attack') {
    const t = frame.time;
    const leader = frame.decoy;
    const target = frame.coordinatedDuoAttackTarget;
    const firstSignal = frame.coordinatedDuoAttackFirstSignal;
    const secondSignal = frame.coordinatedDuoAttackSecondSignal;
    const interrupted = frame.coordinatedDuoAttackInterrupted;
    const linkVisible = t >= spec.leaderMove[1] && t < spec.resetAt;
    return [
      path(
        'M 70 115 H 490 V 160 H 70 Z M 82 160 H 119 V 820 H 82 Z M 441 160 H 478 V 820 H 441 Z',
        0.54,
        'muted',
        0,
        0.63,
      ),
      path(
        'M 137 160 H 247 V 260 L 192 237 L 137 260 Z M 313 160 H 423 V 260 L 368 237 L 313 260 Z',
        0.45,
        'accent',
        0,
        0.5,
      ),
      path(
        'M 103 778 L 280 740 L 457 778 V 810 L 280 770 L 103 810 Z M 82 867 L 280 825 L 478 867 V 895 L 280 853 L 82 895 Z',
        0.54,
        'muted',
        0,
        0.61,
      ),
      path(
        'M 122 500 L 278 483 L 293 510 L 122 531 Z M 122 531 L 293 510 V 554 L 122 577 Z',
        0.74,
        'muted',
        0,
        0.67,
      ),
      path(
        'M 310 448 L 449 434 L 464 458 L 310 477 Z M 310 477 L 464 458 V 505 L 310 524 Z',
        0.74,
        'muted',
        0,
        0.67,
      ),
      line(
        leader.x + 24,
        leader.y - 64,
        spec.boss[0] - 22,
        spec.boss[1] - 64,
        linkVisible && !interrupted ? 0.58 : 0,
        'safe',
        7,
      ),
      ...Array.from({ length: 5 }, (_, index) => {
        const u = (index + 1) / 6;
        const x = mix(leader.x + 24, spec.boss[0] - 22, u);
        const y = mix(leader.y - 64, spec.boss[1] - 64, u);
        return path(
          `M ${x - 9} ${y} L ${x} ${y - 10} L ${x + 9} ${y} L ${x} ${y + 10} Z`,
          linkVisible && !interrupted ? 0.84 : 0,
          'safe',
          0,
          0.66,
        );
      }),
      path(
        `M ${target.x - 45} ${target.y - 18} L ${target.x} ${target.y - 37} L ${target.x + 45} ${target.y - 18} L ${target.x} ${target.y + 8} Z`,
        firstSignal || secondSignal ? 0.72 : 0.16,
        'signal',
        0,
        0.46,
      ),
      line(
        leader.x,
        leader.y,
        target.x,
        target.y,
        firstSignal || secondSignal ? 0.64 : 0,
        'signal',
        7,
        '15 10',
      ),
      line(
        spec.boss[0],
        spec.boss[1],
        target.x,
        target.y,
        firstSignal || (secondSignal && !interrupted) ? 0.64 : 0,
        'signal',
        7,
        '15 10',
      ),
      line(
        leader.x,
        leader.y,
        target.x,
        target.y,
        frame.coordinatedDuoAttackLeaderActive ? 0.92 : 0,
        'signal',
        spec.laneHalfWidth * 2,
      ),
      line(
        spec.boss[0],
        spec.boss[1],
        target.x,
        target.y,
        frame.coordinatedDuoAttackFollowerActive ? 0.92 : 0,
        'accent',
        spec.laneHalfWidth * 2,
      ),
      line(
        frame.player.x - 10,
        frame.player.y - 50,
        leader.x + 18,
        leader.y + 18,
        strikePulse(t, spec.interruptAt, 0.46),
        'safe',
        13,
      ),
      path(
        `M ${leader.x - 38} ${leader.y - 103} L ${leader.x - 13} ${leader.y - 139} L ${leader.x + 1} ${leader.y - 96} Z M ${leader.x + 21} ${leader.y - 97} L ${leader.x + 48} ${leader.y - 130} L ${leader.x + 42} ${leader.y - 86} Z`,
        interrupted ? 0.9 : 0,
        'safe',
        0,
        0.78,
      ),
      path(
        `M ${spec.boss[0] - 39} ${spec.boss[1] - 137} L ${spec.boss[0]} ${spec.boss[1] - 100} L ${spec.boss[0] + 39} ${spec.boss[1] - 137} Z`,
        frame.coordinatedDuoAttackFollowupCancelled ? 0.36 : 0,
        'muted',
        0,
        0.62,
      ),
    ];
  }
  if (mode === 'shared-group-health') {
    const t = frame.time;
    const hitLeft = Math.max(
      strikePulse(t, spec.firstHitAt, 0.36),
      strikePulse(t, spec.finalHitAt, 0.4),
    );
    const hitRight = strikePulse(t, spec.secondHitAt, 0.38);
    const completed = frame.sharedGroupHealthCompletionCount === 1;
    const healthWidth = (338 * frame.sharedGroupHealthCurrentHealth) / 100;
    return [
      path(
        'M 72 106 H 488 V 155 H 72 Z M 84 155 H 123 V 830 H 84 Z M 437 155 H 476 V 830 H 437 Z',
        0.54,
        'muted',
        0,
        0.63,
      ),
      path('M 104 143 H 456 V 172 H 104 Z M 97 172 H 463 V 190 H 97 Z', 0.74, 'muted', 0, 0.66),
      path(`M 111 148 H ${111 + healthWidth} V 168 H 111 Z`, 0.94, 'accent', 0, 0.82),
      path(
        'M 253 194 L 280 167 L 307 194 L 280 228 Z',
        completed ? 0.84 : 0.58,
        completed ? 'safe' : 'accent',
        0,
        0.68,
      ),
      path(
        'M 105 756 L 280 718 L 455 756 V 787 L 280 747 L 105 787 Z M 85 870 L 280 830 L 475 870 V 900 L 280 860 L 85 900 Z',
        0.52,
        'muted',
        0,
        0.59,
      ),
      path(
        'M 95 490 L 238 476 L 251 502 L 95 522 Z M 95 522 L 251 502 V 550 L 95 570 Z',
        0.7,
        'muted',
        0,
        0.62,
      ),
      path(
        'M 305 444 L 450 430 L 464 456 L 305 478 Z M 305 478 L 464 456 V 505 L 305 527 Z',
        0.7,
        'muted',
        0,
        0.62,
      ),
      path(
        'M 280 210 L 180 346 L 168 346 L 267 211 Z M 280 210 L 389 320 L 375 320 L 271 211 Z',
        frame.sharedGroupHealthCurrentHealth > 0 ? 0.36 : 0.06,
        'safe',
        0,
        0.42,
      ),
      path(
        'M 132 477 L 206 470 L 216 485 L 132 495 Z',
        frame.sharedGroupHealthLeftPresent ? 0.2 : 0.85,
        'signal',
        0,
        0.53,
      ),
      line(
        frame.player.x - 8,
        frame.player.y - 48,
        spec.partner[0] + 18,
        spec.partner[1] + 15,
        hitLeft,
        'safe',
        12,
      ),
      line(
        frame.player.x - 8,
        frame.player.y - 48,
        spec.boss[0] + 18,
        spec.boss[1] + 15,
        hitRight,
        'safe',
        12,
      ),
      line(
        spec.boss[0],
        spec.boss[1],
        spec.firstLaneEnd[0],
        spec.firstLaneEnd[1],
        frame.sharedGroupHealthFirstSignal ? 0.62 : 0,
        'signal',
        7,
        '14 10',
      ),
      line(
        spec.boss[0],
        spec.boss[1],
        spec.firstLaneEnd[0],
        spec.firstLaneEnd[1],
        frame.sharedGroupHealthFirstAttack ? 0.9 : 0,
        'signal',
        spec.laneHalfWidth * 2,
      ),
      line(
        spec.partner[0],
        spec.partner[1],
        spec.secondLaneEnd[0],
        spec.secondLaneEnd[1],
        frame.sharedGroupHealthSecondSignal ? 0.62 : 0,
        'signal',
        7,
        '14 10',
      ),
      line(
        spec.partner[0],
        spec.partner[1],
        spec.secondLaneEnd[0],
        spec.secondLaneEnd[1],
        frame.sharedGroupHealthSecondAttack ? 0.9 : 0,
        'signal',
        spec.laneHalfWidth * 2,
      ),
      path(
        'M 142 373 L 162 340 L 175 377 Z M 181 360 L 198 330 L 212 366 Z',
        frame.sharedGroupHealthLeftReturned ? strikePulse(t, spec.returnAt, 0.55) : 0,
        'safe',
        0,
        0.78,
      ),
      path('M 245 199 L 280 169 L 315 199 L 280 236 Z', completed ? 0.96 : 0, 'safe', 0, 0.82),
    ];
  }
  if (mode === 'party-size-scaling') {
    const rosterProgress = smooth((frame.time - spec.joinQueuedAt) / 0.38);
    const scaleProgress = smooth((frame.time - spec.scaleApplyAt) / 0.36);
    const moveProgress = smooth(
      (frame.time - spec.playerMove[0]) / (spec.playerMove[1] - spec.playerMove[0]),
    );
    const resetProgress = smooth((frame.time - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const ally = {
      x: mix(
        mix(spec.targetCenters[1][0], spec.allyTarget[0], moveProgress),
        spec.targetCenters[1][0],
        resetProgress,
      ),
      y: mix(
        mix(spec.targetCenters[1][1], spec.allyTarget[1], moveProgress),
        spec.targetCenters[1][1],
        resetProgress,
      ),
    };
    const signalProgress = clamp(
      (frame.time - spec.attackSignal[0]) / (spec.attackSignal[1] - spec.attackSignal[0]),
    );
    const attackProgress = clamp((frame.time - spec.attack[0]) / (spec.attack[1] - spec.attack[0]));
    const openingStrike = strikePulse(
      frame.time,
      (spec.opening[0] + spec.opening[1]) / 2,
      spec.opening[1] - spec.opening[0],
    );
    const secondMemberVisible = frame.time >= spec.joinQueuedAt && frame.time < spec.leaveApplyAt;
    const panelVisible = frame.time < spec.resetAt;
    const scaled = frame.partySizeScalingScaleApplied && frame.partySizeScalingPartySize > 1;
    const healthWidth = scaled ? 320 : 240;
    return [
      path(
        'M 70 187 L 280 148 L 490 187 V 216 L 280 177 L 70 216 Z M 72 846 L 280 804 L 488 846 V 874 L 280 832 L 72 874 Z',
        0.42,
        'muted',
        0,
        0.6,
      ),
      path(
        'M 88 97 H 472 V 213 H 88 Z M 100 109 H 460 V 200 H 100 Z',
        panelVisible ? 0.6 : 0.22,
        'muted',
        0,
        0.68,
      ),
      ...spec.rosterTokens.flatMap(([x, y], index) => {
        const active = index === 0 || (index === 1 && secondMemberVisible);
        const queued = index === 1 && frame.partySizeScalingJoinQueued;
        const opacity = panelVisible ? (active ? 0.94 : 0.24) : 0;
        const tone = index === 0 ? 'safe' : 'accent';
        return [
          path(
            `M ${x - 34} ${y - 33} H ${x + 34} V ${y + 42} H ${x - 34} Z`,
            opacity,
            active ? tone : 'muted',
            0,
            0.48,
          ),
          path(
            `M ${x - 13} ${y - 19} Q ${x} ${y - 31} ${x + 13} ${y - 19} L ${x + 11} ${y - 2} H ${x - 11} Z M ${x - 22} ${y + 29} Q ${x - 22} ${y + 1} ${x} ${y + 2} Q ${x + 22} ${y + 1} ${x + 22} ${y + 29} Z`,
            opacity,
            active ? tone : 'muted',
            0,
            0.86,
          ),
          path(
            `M ${x - 30} ${y + 37} H ${x + 30} V ${y + 42} H ${x - 30} Z`,
            queued ? 0.4 + 0.5 * pulse(rosterProgress * 2) : 0,
            tone,
            0,
            0.9,
          ),
        ];
      }),
      path(
        `M ${spec.healthBar[0] - 8} ${spec.healthBar[1] - 8} H ${spec.healthBar[0] + 328} V ${spec.healthBar[1] + 32} H ${spec.healthBar[0] - 8} Z`,
        0.68,
        'muted',
        0,
        0.68,
      ),
      rect(
        spec.healthBar[0],
        spec.healthBar[1],
        healthWidth * frame.partySizeScalingHealthFraction,
        spec.healthBar[3],
        0.94,
        'signal',
        0.84,
      ),
      path(
        `M ${frame.boss.x - 93 - 18 * scaleProgress} ${frame.boss.y - 80} L ${frame.boss.x - 46} ${frame.boss.y - 129 - 25 * scaleProgress} L ${frame.boss.x - 15} ${frame.boss.y - 63} L ${frame.boss.x - 67} ${frame.boss.y + 18} Z M ${frame.boss.x + 93 + 18 * scaleProgress} ${frame.boss.y - 80} L ${frame.boss.x + 46} ${frame.boss.y - 129 - 25 * scaleProgress} L ${frame.boss.x + 15} ${frame.boss.y - 63} L ${frame.boss.x + 67} ${frame.boss.y + 18} Z`,
        scaled ? 0.74 : 0,
        'signal',
        0,
        0.6,
      ),
      circle(ally.x, ally.y + 3, 24, secondMemberVisible ? 0.42 : 0, 'muted', 0, 0.66),
      circle(ally.x, ally.y - 67, 13, secondMemberVisible ? 0.96 : 0, 'accent', 0, 0.88),
      path(
        `M ${ally.x - 23} ${ally.y - 50} L ${ally.x + 20} ${ally.y - 50} L ${ally.x + 27} ${ally.y - 10} L ${ally.x - 28} ${ally.y - 10} Z M ${ally.x - 20} ${ally.y - 8} H ${ally.x - 5} V ${ally.y + 9} H ${ally.x - 24} Z M ${ally.x + 5} ${ally.y - 8} H ${ally.x + 20} V ${ally.y + 9} H ${ally.x + 5} Z`,
        secondMemberVisible ? 0.94 : 0,
        'accent',
        0,
        0.78,
      ),
      path(
        `M ${ally.x + 17} ${ally.y - 42} L ${ally.x + 48} ${ally.y - 103} L ${ally.x + 55} ${ally.y - 117} L ${ally.x + 52} ${ally.y - 95} L ${ally.x + 26} ${ally.y - 37} Z`,
        secondMemberVisible ? 0.92 : 0,
        'safe',
        0,
        0.84,
      ),
      ...spec.targetCenters.map((center, index) =>
        circle(
          center[0],
          center[1],
          mix(28, spec.targetRadius, signalProgress),
          frame.partySizeScalingAttackSignaled && (index === 0 || secondMemberVisible)
            ? 0.18 + 0.2 * signalProgress
            : 0,
          index === 0 ? 'signal' : 'accent',
          0,
          0.58,
        ),
      ),
      ...spec.targetCenters.map((center, index) =>
        circle(
          center[0],
          center[1],
          spec.targetRadius + attackProgress * 22,
          frame.partySizeScalingAttackActive && (index === 0 || secondMemberVisible)
            ? 0.64 - attackProgress * 0.18
            : 0,
          index === 0 ? 'signal' : 'accent',
          0,
          0.6,
        ),
      ),
      path(
        `M ${frame.player.x - 8} ${frame.player.y - 54} L ${frame.boss.x + 12} ${frame.boss.y + 26}`,
        openingStrike,
        'safe',
        13,
      ),
      path(
        'M 396 434 L 457 434 L 464 456 H 389 Z M 402 421 H 451 L 460 434 H 393 Z',
        frame.partySizeScalingEligibilitySettled ? 0.88 : 0,
        'safe',
        0,
        0.68,
      ),
    ];
  }
  if (mode === 'world-state-variant') {
    const materializeProgress = smooth(
      (frame.time - spec.materialize[0]) / (spec.materialize[1] - spec.materialize[0]),
    );
    const signalProgress = clamp(
      (frame.time - spec.attackSignal[0]) / (spec.attackSignal[1] - spec.attackSignal[0]),
    );
    const attackProgress = clamp((frame.time - spec.attack[0]) / (spec.attack[1] - spec.attack[0]));
    const openingStrike = strikePulse(
      frame.time,
      (spec.opening[0] + spec.opening[1]) / 2,
      spec.opening[1] - spec.opening[0],
    );
    const rewardProgress = smooth(
      (frame.time - spec.reward[0]) / (spec.reward[1] - spec.reward[0]),
    );
    const packageVisible = frame.time >= spec.snapshotAt && frame.time < spec.resetAt;
    const contextVisible = frame.time < spec.resetAt;
    const outsideChanged = frame.time >= spec.outsideChangeAt && frame.time < spec.resetAt;
    const packageOpacity = packageVisible ? 0.42 + materializeProgress * 0.54 : 0;
    const moon = spec.timeToken,
      ruin = spec.regionToken,
      flame = spec.modeToken;
    return [
      path(
        'M 70 187 L 280 148 L 490 187 V 216 L 280 177 L 70 216 Z M 72 846 L 280 804 L 488 846 V 874 L 280 832 L 72 874 Z',
        0.42,
        'muted',
        0,
        0.6,
      ),
      circle(
        moon[0],
        moon[1],
        32,
        contextVisible ? 0.82 : 0,
        outsideChanged ? 'safe' : 'signal',
        0,
        0.82,
      ),
      circle(
        moon[0] + 11,
        moon[1] - 11,
        25,
        contextVisible && !outsideChanged ? 0.96 : 0,
        'muted',
        0,
        0.9,
      ),
      path(
        `M ${ruin[0] - 41} ${ruin[1] + 52} L ${ruin[0] - 41} ${ruin[1] - 38} L ${ruin[0] - 23} ${ruin[1] - 49} L ${ruin[0] - 12} ${ruin[1] - 24} L ${ruin[0] + 8} ${ruin[1] - 54} L ${ruin[0] + 41} ${ruin[1] - 39} V ${ruin[1] + 52} Z M ${ruin[0] - 17} ${ruin[1] + 52} V ${ruin[1] + 9} Q ${ruin[0]} ${ruin[1] - 12} ${ruin[0] + 17} ${ruin[1] + 9} V ${ruin[1] + 52} Z`,
        contextVisible ? 0.82 : 0,
        'accent',
        0,
        0.76,
      ),
      path(
        `M ${flame[0] - 33} ${flame[1] + 34} H ${flame[0] + 33} L ${flame[0] + 22} ${flame[1] + 54} H ${flame[0] - 22} Z M ${flame[0] - 21} ${flame[1] + 34} Q ${flame[0] - 25} ${flame[1] + 3} ${flame[0]} ${flame[1] - 38} Q ${flame[0] + 27} ${flame[1] + 6} ${flame[0] + 20} ${flame[1] + 34} Z`,
        contextVisible ? 0.86 : 0,
        'signal',
        0,
        0.76,
      ),
      path(
        `M ${spec.packageNode[0] - 51} ${spec.packageNode[1] - 28} L ${spec.packageNode[0]} ${spec.packageNode[1] - 57} L ${spec.packageNode[0] + 51} ${spec.packageNode[1] - 28} L ${spec.packageNode[0] + 44} ${spec.packageNode[1] + 31} L ${spec.packageNode[0]} ${spec.packageNode[1] + 55} L ${spec.packageNode[0] - 44} ${spec.packageNode[1] + 31} Z`,
        packageOpacity,
        'muted',
        0,
        0.74,
      ),
      path(
        `M ${spec.packageNode[0] - 18} ${spec.packageNode[1] + 17} L ${spec.packageNode[0]} ${spec.packageNode[1] - 25 - 12 * materializeProgress} L ${spec.packageNode[0] + 18} ${spec.packageNode[1] + 17} Z`,
        packageOpacity,
        'safe',
        0,
        0.68,
      ),
      ...spec.variantSeals.flatMap(([x, y]) => [
        path(
          `M ${x - 46} ${y - 24} L ${x} ${y - 41} L ${x + 46} ${y - 24} L ${x + 36} ${y + 29} L ${x} ${y + 42} L ${x - 36} ${y + 29} Z`,
          frame.worldStateVariantPackageMaterialized ? 0.82 : materializeProgress * 0.72,
          'muted',
          0,
          0.72,
        ),
        path(
          `M ${x - 24} ${y - 4} L ${x - 5} ${y - 18} L ${x + 1} ${y + 6} L ${x + 19} ${y - 12} L ${x + 25} ${y + 17} L ${x} ${y + 27} Z`,
          frame.worldStateVariantPackageMaterialized ? 0.9 : materializeProgress * 0.72,
          'signal',
          0,
          0.72,
        ),
      ]),
      path(
        `M ${frame.boss.x - 97 - signalProgress * 32} ${frame.boss.y + 95} L ${frame.boss.x - 48} ${frame.boss.y + 31} L ${frame.boss.x - 8} ${frame.boss.y + 77} L ${frame.boss.x + 29} ${frame.boss.y + 25} L ${frame.boss.x + 74} ${frame.boss.y + 78} L ${frame.boss.x + 108 + attackProgress * 55} ${frame.boss.y + 125} L ${frame.boss.x} ${frame.boss.y + 134} Z`,
        frame.worldStateVariantAttackActive
          ? 0.86
          : frame.worldStateVariantAttackSignaled
            ? 0.16 + signalProgress * 0.32
            : 0,
        'accent',
        0,
        0.6,
      ),
      path(
        `M ${frame.player.x - 8} ${frame.player.y - 54} L ${frame.boss.x + 12} ${frame.boss.y + 26}`,
        openingStrike,
        'safe',
        13,
      ),
      path(
        `M ${spec.rewardToken[0] - 38} ${spec.rewardToken[1] - 10} L ${spec.rewardToken[0] + 38} ${spec.rewardToken[1] - 10} L ${spec.rewardToken[0] + 33} ${spec.rewardToken[1] + 34} H ${spec.rewardToken[0] - 33} Z M ${spec.rewardToken[0] - 41} ${spec.rewardToken[1] - 12} L ${spec.rewardToken[0] + 41} ${spec.rewardToken[1] - 12} L ${spec.rewardToken[0] + 29} ${spec.rewardToken[1] - 32} H ${spec.rewardToken[0] - 29} Z`,
        frame.worldStateVariantRewardMapped ? 0.5 + 0.4 * rewardProgress : 0,
        'safe',
        0,
        0.78,
      ),
    ];
  }
  if (mode === 'interface-interaction') {
    const switchProgress = smooth(
      (frame.time - spec.switchRoute[0]) / (spec.switchRoute[1] - spec.switchRoute[0]),
    );
    const confirmProgress = smooth(
      (frame.time - spec.confirm[0]) / (spec.confirm[1] - spec.confirm[0]),
    );
    const signalProgress = clamp(
      (frame.time - spec.counterSignal[0]) / (spec.counterSignal[1] - spec.counterSignal[0]),
    );
    const counterProgress = clamp(
      (frame.time - spec.counter[0]) / (spec.counter[1] - spec.counter[0]),
    );
    const firstStrike = strikePulse(
      frame.time,
      (spec.firstAttack[0] + spec.firstAttack[1]) / 2,
      spec.firstAttack[1] - spec.firstAttack[0],
    );
    const openingStrike = strikePulse(
      frame.time,
      (spec.opening[0] + spec.opening[1]) / 2,
      spec.opening[1] - spec.opening[0],
    );
    const interfaceVisible = frame.time >= spec.pause[0] && frame.time < spec.retry[1];
    const primaryOpacity = interfaceVisible ? mix(0.94, 0.22, switchProgress) : 0.34;
    const alternateOpacity = interfaceVisible ? mix(0.22, 0.98, switchProgress) : 0.18;
    const wardOpacity = frame.interfaceInteractionConfirmed
      ? Math.max(0, 0.75 - confirmProgress)
      : 0.75;
    const leverX = mix(spec.primaryPort[0], spec.alternatePort[0], switchProgress);
    return [
      path(
        'M 70 187 L 280 148 L 490 187 V 216 L 280 177 L 70 216 Z M 72 846 L 280 804 L 488 846 V 874 L 280 832 L 72 874 Z',
        0.42,
        'muted',
        0,
        0.6,
      ),
      path(
        'M 73 88 H 487 V 286 H 73 Z M 85 101 H 475 V 271 H 85 Z',
        interfaceVisible ? 0.72 : 0.34,
        'muted',
        0,
        0.7,
      ),
      path(
        `M ${spec.primaryPort[0] - 45} ${spec.primaryPort[1] - 36} H ${spec.primaryPort[0] + 45} V ${spec.primaryPort[1] + 37} H ${spec.primaryPort[0] - 45} Z`,
        primaryOpacity,
        'accent',
        0,
        0.64,
      ),
      path(
        `M ${spec.alternatePort[0] - 45} ${spec.alternatePort[1] - 36} H ${spec.alternatePort[0] + 45} V ${spec.alternatePort[1] + 37} H ${spec.alternatePort[0] - 45} Z`,
        alternateOpacity,
        frame.interfaceInteractionConfirmed ? 'safe' : 'signal',
        0,
        0.64,
      ),
      path(
        `M ${spec.primaryPort[0] - 13} ${spec.primaryPort[1] - 20} H ${spec.primaryPort[0] + 13} V ${spec.primaryPort[1] + 18} H ${spec.primaryPort[0] - 13} Z M ${spec.primaryPort[0] - 22} ${spec.primaryPort[1] + 21} H ${spec.primaryPort[0] + 22} V ${spec.primaryPort[1] + 29} H ${spec.primaryPort[0] - 22} Z`,
        primaryOpacity,
        'muted',
        0,
        0.82,
      ),
      path(
        `M ${spec.alternatePort[0] - 13} ${spec.alternatePort[1] - 20} H ${spec.alternatePort[0] + 13} V ${spec.alternatePort[1] + 18} H ${spec.alternatePort[0] - 13} Z M ${spec.alternatePort[0] - 22} ${spec.alternatePort[1] + 21} H ${spec.alternatePort[0] + 22} V ${spec.alternatePort[1] + 29} H ${spec.alternatePort[0] - 22} Z`,
        alternateOpacity,
        'muted',
        0,
        0.82,
      ),
      path(
        `M ${leverX - 8} ${spec.primaryPort[1] - 46} H ${leverX + 8} V ${spec.primaryPort[1] - 14} H ${leverX - 8} Z M ${leverX - 22} ${spec.primaryPort[1] - 55} H ${leverX + 22} V ${spec.primaryPort[1] - 43} H ${leverX - 22} Z`,
        interfaceVisible ? 0.96 : 0.3,
        frame.interfaceInteractionConfirmed ? 'safe' : 'signal',
        0,
        0.82,
      ),
      path(
        `M ${spec.routeHub[0] - 35} ${spec.routeHub[1] - 22} H ${spec.routeHub[0] + 35} V ${spec.routeHub[1] + 18} H ${spec.routeHub[0] - 35} Z`,
        interfaceVisible ? 0.82 : 0.28,
        frame.interfaceInteractionConfirmed ? 'safe' : 'signal',
        0,
        0.72,
      ),
      path(
        `M ${spec.routeHub[0] - 17} ${spec.routeHub[1] - 2} L ${spec.routeHub[0] - 4} ${spec.routeHub[1] + 10} L ${spec.routeHub[0] + 20} ${spec.routeHub[1] - 12} Z`,
        frame.interfaceInteractionConfirmed ? 0.96 : 0,
        'muted',
        0,
        0.86,
      ),
      path(
        `M ${frame.boss.x - 82} ${frame.boss.y - 64} Q ${frame.boss.x} ${frame.boss.y - 155} ${frame.boss.x + 82} ${frame.boss.y - 64} L ${frame.boss.x + 70} ${frame.boss.y + 36} Q ${frame.boss.x} ${frame.boss.y + 88} ${frame.boss.x - 70} ${frame.boss.y + 36} Z`,
        wardOpacity,
        'signal',
        0,
        0.28,
      ),
      path(
        `M ${frame.player.x - 8} ${frame.player.y - 54} L ${frame.boss.x + 34} ${frame.boss.y + 54}`,
        firstStrike * 0.92,
        'accent',
        12,
      ),
      path(
        `M ${frame.boss.x + 18} ${frame.boss.y + 34} L ${frame.boss.x + 58} ${frame.boss.y + 74} L ${frame.boss.x + 27} ${frame.boss.y + 79} Z`,
        firstStrike,
        'signal',
        0,
        0.74,
      ),
      path(
        `M ${frame.player.x - 8} ${frame.player.y - 54} L ${frame.boss.x + 10} ${frame.boss.y + 24}`,
        openingStrike,
        'safe',
        13,
      ),
      path(
        `M ${frame.boss.x - 92} ${frame.boss.y + 100 + counterProgress * 42} L ${frame.boss.x - 48} ${frame.boss.y + 42} L ${frame.boss.x - 7} ${frame.boss.y + 94} L ${frame.boss.x + 32} ${frame.boss.y + 36} L ${frame.boss.x + 95} ${frame.boss.y + 110 + counterProgress * 42} L ${frame.boss.x} ${frame.boss.y + 137} Z`,
        frame.interfaceInteractionCounterActive
          ? 0.82
          : frame.interfaceInteractionCounterSignaled
            ? 0.12 + signalProgress * 0.2
            : 0,
        'accent',
        0,
        0.64,
      ),
      rect(55, 300, 450, 590, frame.interfaceInteractionPaused ? 0.24 : 0, 'muted', 0.62),
    ];
  }
  if (mode === 'real-time-progression') {
    const reconcileProgress = clamp(
      (frame.time - spec.reconcile[0]) / (spec.reconcile[1] - spec.reconcile[0]),
    );
    const signalProgress = clamp(
      (frame.time - spec.attackSignal[0]) / (spec.attackSignal[1] - spec.attackSignal[0]),
    );
    const attackProgress = clamp((frame.time - spec.attack[0]) / (spec.attack[1] - spec.attack[0]));
    const clockVisible = frame.time < spec.retry[1];
    const progressionVisible = frame.realTimeProgressionReconciled && frame.time < spec.retry[1];
    const clock = (x, y, hand, opacity, tone) => [
      path(
        `M ${x - 57} ${y - 61} H ${x + 57} L ${x + 48} ${y + 80} H ${x - 48} Z M ${x - 64} ${y + 75} H ${x + 64} V ${y + 91} H ${x - 64} Z`,
        opacity,
        'muted',
        0,
        0.78,
      ),
      circle(x, y, 35, opacity, tone, 0, 0.64),
      path(
        `M ${x} ${y} L ${x + Math.sin(hand) * 23} ${y - Math.cos(hand) * 23} L ${x + 4} ${y + 5} Z`,
        opacity,
        'accent',
        0,
        0.85,
      ),
    ];
    return [
      path(
        'M 70 187 L 280 148 L 490 187 V 216 L 280 177 L 70 216 Z M 72 846 L 280 804 L 488 846 V 874 L 280 832 L 72 874 Z',
        0.42,
        'muted',
        0,
        0.6,
      ),
      ...clock(spec.savedClock[0], spec.savedClock[1], 0.7, clockVisible ? 0.92 : 0, 'accent'),
      ...clock(
        spec.currentClock[0],
        spec.currentClock[1],
        2.4,
        frame.realTimeProgressionReconciled ? 0.96 : 0.32,
        'signal',
      ),
      path(
        'M 202 216 L 280 238 L 358 216 V 282 L 280 262 L 202 282 Z M 279 240 H 283 V 263 H 279 Z',
        frame.realTimeProgressionReconciled ? 0.3 + reconcileProgress * 0.58 : 0.22,
        'safe',
        0,
        0.68,
      ),
      ...Array.from({ length: spec.appliedHours }, (_, index) =>
        path(
          `M ${212 + index * 25} 250 L ${217 + index * 25} 242 L ${222 + index * 25} 250 L ${217 + index * 25} 258 Z`,
          frame.realTimeProgressionReconciled ? 0.32 + reconcileProgress * 0.58 : 0.12,
          index === spec.appliedHours - 1 ? 'signal' : 'safe',
          0,
          0.8,
        ),
      ),
      path(
        'M 62 302 H 498 V 861 H 62 Z M 82 317 H 172 V 846 H 82 Z M 184 317 H 274 V 846 H 184 Z M 286 317 H 376 V 846 H 286 Z M 388 317 H 478 V 846 H 388 Z',
        frame.realTimeProgressionClosed ? 0.92 : 0,
        'muted',
        0,
        0.76,
      ),
      ...spec.offlineSeals.flatMap(([x, y], index) => [
        path(
          `M ${x - 39} ${y - 16} L ${x} ${y - 47} L ${x + 39} ${y - 16} L ${x + 28} ${y + 43} L ${x} ${y + 56} L ${x - 28} ${y + 43} Z`,
          progressionVisible ? 0.48 + 0.27 * reconcileProgress : 0,
          index ? 'signal' : 'accent',
          0,
          0.68,
        ),
        path(
          `M ${x - 16} ${y - 20} H ${x + 16} L ${x} ${y + 5} L ${x + 16} ${y + 29} H ${x - 16} L ${x} ${y + 5} Z`,
          progressionVisible ? 0.82 : 0,
          'muted',
          0,
          0.76,
        ),
      ]),
      path(
        `M ${frame.boss.x - 74} ${frame.boss.y - 99} L ${frame.boss.x - 46} ${frame.boss.y - 139} L ${frame.boss.x - 19} ${frame.boss.y - 88} L ${frame.boss.x + 18} ${frame.boss.y - 88} L ${frame.boss.x + 46} ${frame.boss.y - 139} L ${frame.boss.x + 74} ${frame.boss.y - 99} Z`,
        progressionVisible ? 0.92 : 0,
        'signal',
        0,
        0.72,
      ),
      path(
        `M ${frame.boss.x - 99} ${frame.boss.y + 69 + attackProgress * 43} L ${frame.boss.x - 52} ${frame.boss.y + 22} L ${frame.boss.x - 14} ${frame.boss.y + 64} L ${frame.boss.x + 22} ${frame.boss.y + 18} L ${frame.boss.x + 64} ${frame.boss.y + 65} L ${frame.boss.x + 109} ${frame.boss.y + 92 + attackProgress * 43} L ${frame.boss.x} ${frame.boss.y + 114} Z`,
        frame.realTimeProgressionAttackActive
          ? 0.78
          : progressionVisible
            ? 0.1 + signalProgress * 0.22
            : 0,
        'accent',
        0,
        0.62,
      ),
    ];
  }
  if (mode === 'encounter-specific-tool') {
    const pedestal = point(spec.pedestal);
    const spearBase = { x: frame.player.x + 20, y: frame.player.y - 10 };
    const spearNeck = { x: frame.player.x + 55, y: frame.player.y - 112 };
    const spearTip = { x: frame.player.x + 70, y: frame.player.y - 166 };
    const shotProgress = clamp((frame.time - spec.fireAt) / (spec.hitAt - spec.fireAt));
    const shot = {
      x: mix(spearTip.x, frame.boss.x, shotProgress),
      y: mix(spearTip.y, frame.boss.y, shotProgress),
    };
    const toolVisible = frame.encounterToolEquipped && !frame.encounterToolExpired;
    const shotVisible = frame.encounterToolFired && !frame.encounterToolBossDamaged;
    const chargeProgress = clamp((frame.time - spec.charge[0]) / (spec.charge[1] - spec.charge[0]));
    const impactPulse = strikePulse(frame.time, spec.hitAt, 0.42);
    const blade = `M ${spearNeck.x - 8} ${spearNeck.y + 12} L ${spearTip.x} ${spearTip.y} L ${spearNeck.x + 16} ${spearNeck.y - 8} L ${spearNeck.x + 3} ${spearNeck.y + 16} Z`;
    return [
      rect(170, 62, 220, 16, 0.72, 'muted', 0.74),
      rect(170, 62, frame.encounterToolBossDamaged ? 110 : 220, 16, 0.96, 'accent', 0.9),
      path('M 170 372 L 300 350 L 430 372 L 394 390 H 206 Z', 0.65, 'muted', 0, 0.78),
      path(
        `M ${pedestal.x - 50} ${pedestal.y + 28} L ${pedestal.x + 50} ${pedestal.y + 28} L ${pedestal.x + 60} ${pedestal.y + 50} H ${pedestal.x - 60} Z`,
        0.8,
        'muted',
        0,
        0.78,
      ),
      line(
        pedestal.x - 14,
        pedestal.y + 19,
        pedestal.x + 20,
        pedestal.y - 73,
        frame.encounterToolEquipped ? 0 : 0.94,
        'accent',
        10,
      ),
      path(
        `M ${pedestal.x + 12} ${pedestal.y - 67} L ${pedestal.x + 31} ${pedestal.y - 116} L ${pedestal.x + 34} ${pedestal.y - 74} L ${pedestal.x + 22} ${pedestal.y - 60} Z`,
        frame.encounterToolEquipped ? 0 : 0.96,
        'safe',
        0,
        0.86,
      ),
      line(
        spearBase.x,
        spearBase.y,
        spearNeck.x,
        spearNeck.y,
        toolVisible ? 0.98 : 0,
        'accent',
        10,
      ),
      path(blade, toolVisible ? 0.96 : 0, 'safe', 0, 0.9),
      path(
        blade,
        frame.encounterToolCharging || frame.encounterToolReady ? 0.34 + chargeProgress * 0.64 : 0,
        'signal',
        0,
        0.92,
      ),
      line(
        spearTip.x,
        spearTip.y,
        frame.boss.x,
        frame.boss.y,
        frame.encounterToolReady ? 0.48 : 0,
        'safe',
        4,
      ),
      line(spearTip.x, spearTip.y, shot.x, shot.y, shotVisible ? 0.58 : 0, 'safe', 8),
      path(
        `M ${shot.x} ${shot.y - 24} L ${shot.x + 14} ${shot.y} L ${shot.x} ${shot.y + 24} L ${shot.x - 14} ${shot.y} Z`,
        shotVisible ? 0.98 : 0,
        'signal',
        0,
        0.94,
      ),
      path(
        `M ${frame.boss.x - 36} ${frame.boss.y - 16} L ${frame.boss.x} ${frame.boss.y - 38} L ${frame.boss.x + 36} ${frame.boss.y - 16} L ${frame.boss.x + 18} ${frame.boss.y + 18} L ${frame.boss.x - 18} ${frame.boss.y + 18} Z`,
        impactPulse,
        'signal',
        0,
        0.8,
      ),
      path(
        `M ${spearTip.x - 18} ${spearTip.y + 18} L ${spearTip.x - 8} ${spearTip.y - 2} L ${spearTip.x - 2} ${spearTip.y + 18} Z M ${spearTip.x + 10} ${spearTip.y + 36} L ${spearTip.x + 24} ${spearTip.y + 18} L ${spearTip.x + 20} ${spearTip.y + 38} Z`,
        frame.encounterToolExpired ? 0.7 : 0,
        'muted',
        0,
        0.82,
      ),
    ];
  }
  if (mode === 'landing') {
    const landing = point(spec.landing);
    const contact = phase === 1 ? clamp(1 - Math.abs(action - 0.51) / 0.11) : 0;
    return [
      circle(
        landing.x,
        landing.y,
        mix(48, 88, phase === 0 ? prepare : 1),
        phase === 0 ? 0.42 + 0.32 * prepare : phase === 1 ? 0.38 * (1 - action) : 0,
        'accent',
        4,
        0.06,
      ),
      circle(landing.x, landing.y, 88, contact, 'signal', 10, 0.17),
      path(
        `M ${landing.x - 24} ${landing.y - 9} l -31 -15 M ${landing.x + 23} ${landing.y - 9} l 32 -16 M ${landing.x - 18} ${landing.y + 16} l -26 23 M ${landing.x + 19} ${landing.y + 16} l 28 24`,
        contact * 0.7,
        'signal',
        4,
      ),
    ];
  }
  if (mode === 'single-shot') {
    const start = { x: boss.x + 43, y: boss.y + 8 };
    const end = point(spec.shotEnd);
    const head = {
      x: mix(start.x, end.x, action),
      y: mix(start.y, end.y, action),
    };
    const tail = {
      x: mix(start.x, end.x, Math.max(0, action - 0.12)),
      y: mix(start.y, end.y, Math.max(0, action - 0.12)),
    };
    const heading = Math.atan2(end.y - start.y, end.x - start.x);
    const forward = { x: Math.cos(heading), y: Math.sin(heading) };
    const side = { x: -forward.y, y: forward.x };
    const tip = (along, across) =>
      `${head.x + forward.x * along + side.x * across} ${head.y + forward.y * along + side.y * across}`;
    return [
      line(start.x, start.y, end.x, end.y, phase === 0 ? 0.28 + prepare * 0.3 : 0, 'accent', 4),
      line(tail.x, tail.y, head.x, head.y, phase === 1 ? 0.24 : 0, 'accent', 4),
      {
        ...path(
          `M ${tip(27, 0)} L ${tip(6, -10)} L ${tip(-11, -13)} L ${tip(-23, -4)} L ${tip(-16, 4)} L ${tip(-25, 11)} L ${tip(-2, 11)} Z`,
          phase === 1 ? 1 : 0,
          'muted',
          2,
          0.88,
        ),
        x: head.x,
        y: head.y,
        radius: 27,
      },
      path(
        `M ${start.x - 10} ${start.y - 8} L ${start.x + 6} ${start.y - 11} L ${start.x + 14} ${start.y + 1} L ${start.x + 3} ${start.y + 11} L ${start.x - 9} ${start.y + 7} Z`,
        phase === 0 ? 0.45 + prepare * 0.5 : phase === 1 ? 0.68 : 0.25 * (1 - recover),
        'accent',
        2,
        0.52,
      ),
      path(
        `M ${tip(19, 0)} L ${tip(-5, -7)} L ${tip(-15, -6)} M ${tip(19, 0)} L ${tip(-4, 7)}`,
        phase === 1 ? 0.94 : 0,
        'accent',
        2,
      ),
      path(
        `M ${tip(27, 0)} L ${tip(12, -5)} L ${tip(12, 5)} Z`,
        phase === 1 ? 0.98 : 0,
        'signal',
        1,
        0.9,
      ),
    ];
  }
  if (mode === 'crossfire') {
    const sources = spec.sources.map(point);
    const ends = spec.shotEnds.map(point);
    const heads = sources.map((source, index) => ({
      x: mix(source.x, ends[index].x, action),
      y: mix(source.y, ends[index].y, action),
    }));
    const projectiles = heads.map((head, index) => {
      const source = sources[index];
      const end = ends[index];
      const heading = Math.atan2(end.y - source.y, end.x - source.x);
      const forward = { x: Math.cos(heading), y: Math.sin(heading) };
      const side = { x: -forward.y, y: forward.x };
      const tip = (along, across) =>
        `${head.x + forward.x * along + side.x * across} ${head.y + forward.y * along + side.y * across}`;
      return {
        ...path(
          `M ${tip(22, 0)} L ${tip(7, -10)} L ${tip(-6, -11)} L ${tip(-18, -3)} L ${tip(-12, 5)} L ${tip(-15, 10)} L ${tip(5, 8)} Z`,
          phase === 1 ? 1 : 0.42 + prepare * 0.35,
          'muted',
          2,
          0.92,
        ),
        x: head.x,
        y: head.y,
        radius: 22,
      };
    });
    const facets = projectiles.map((projectile, index) => {
      const source = sources[index];
      const end = ends[index];
      const heading = Math.atan2(end.y - source.y, end.x - source.x);
      const forward = { x: Math.cos(heading), y: Math.sin(heading) };
      const side = { x: -forward.y, y: forward.x };
      const tip = (along, across) =>
        `${projectile.x + forward.x * along + side.x * across} ${projectile.y + forward.y * along + side.y * across}`;
      return path(
        `M ${tip(19, 0)} L ${tip(-3, -6)} L ${tip(-14, -2)} M ${tip(19, 0)} L ${tip(1, 7)}`,
        projectile.opacity * 0.96,
        'signal',
        2,
      );
    });
    const guides = sources.map((source, index) =>
      line(
        source.x,
        source.y,
        ends[index].x,
        ends[index].y,
        phase === 0 ? 0.24 + prepare * 0.26 : 0,
        'accent',
        2,
      ),
    );
    return [...projectiles, ...facets, ...guides];
  }
  if (mode === 'splitting-projectile') {
    const start = { x: spec.boss[0] + 40, y: spec.boss[1] + 15 };
    const split = point(spec.split);
    const fragmentEnds = spec.fragmentEnds.map(point);
    const splitAt = 0.42;
    const parentProgress = clamp(action / splitAt);
    const fragmentProgress = clamp((action - splitAt) / (1 - splitAt));
    const parent = {
      x: mix(start.x, split.x, parentProgress),
      y: mix(start.y, split.y, parentProgress),
    };
    const fragments = fragmentEnds.map((end) => ({
      x: mix(split.x, end.x, fragmentProgress),
      y: mix(split.y, end.y, fragmentProgress),
    }));
    const parentVisible = phase === 0 ? 0.72 : phase === 1 && action < splitAt ? 1 : 0;
    const fragmentsVisible = phase === 1 && action >= splitAt ? 1 : 0;
    const parentStone = {
      ...path(
        `M ${parent.x - 21} ${parent.y - 8} L ${parent.x - 7} ${parent.y - 22} L ${parent.x + 13} ${parent.y - 18} L ${parent.x + 24} ${parent.y - 2} L ${parent.x + 15} ${parent.y + 18} L ${parent.x - 10} ${parent.y + 20} L ${parent.x - 23} ${parent.y + 7} Z`,
        parentVisible,
        'muted',
        2,
        0.94,
      ),
      x: parent.x,
      y: parent.y,
      radius: 24,
    };
    const fragmentStones = fragments.map((fragment, index) => {
      const end = fragmentEnds[index];
      const heading = Math.atan2(end.y - split.y, end.x - split.x);
      const forward = { x: Math.cos(heading), y: Math.sin(heading) };
      const side = { x: -forward.y, y: forward.x };
      const tip = (along, across) =>
        `${fragment.x + forward.x * along + side.x * across} ${fragment.y + forward.y * along + side.y * across}`;
      return {
        stone: {
          ...path(
            `M ${tip(18, 0)} L ${tip(6, -10)} L ${tip(-9, -13)} L ${tip(-18, -3)} L ${tip(-11, 12)} L ${tip(3, 11)} Z`,
            fragmentsVisible,
            'muted',
            2,
            0.95,
          ),
          x: fragment.x,
          y: fragment.y,
          radius: 18,
        },
        facet: path(
          `M ${tip(18, 0)} L ${tip(2, -2)} L ${tip(-11, 12)} M ${tip(2, -2)} L ${tip(-9, -13)}`,
          fragmentsVisible * 0.95,
          'signal',
          2,
        ),
      };
    });
    return [
      parentStone,
      ...fragmentStones.map(({ stone }) => stone),
      path(
        `M ${parent.x - 13} ${parent.y - 5} L ${parent.x - 2} ${parent.y + 2} L ${parent.x + 8} ${parent.y - 13} M ${parent.x - 2} ${parent.y + 2} L ${parent.x + 13} ${parent.y + 12}`,
        parentVisible * (phase === 0 ? 0.42 + prepare * 0.5 : 1),
        'signal',
        2.5,
      ),
      ...fragmentStones.map(({ facet }) => facet),
    ];
  }
  if (mode === 'returning-projectile') {
    const start = { x: spec.boss[0] + 39, y: spec.boss[1] + 11 };
    const turn = point(spec.turn);
    const returnControl = point(spec.returnControl);
    const turnAt = 0.52;
    const outgoingProgress = clamp(action / turnAt);
    const returnProgress = clamp((action - turnAt) / (1 - turnAt));
    const projectile =
      action < turnAt
        ? {
            x: mix(start.x, turn.x, outgoingProgress),
            y: mix(start.y, turn.y, outgoingProgress),
          }
        : quadraticPoint(turn, returnControl, start, returnProgress);
    const tangent =
      action < turnAt
        ? { x: turn.x - start.x, y: turn.y - start.y }
        : {
            x:
              2 * (1 - returnProgress) * (returnControl.x - turn.x) +
              2 * returnProgress * (start.x - returnControl.x),
            y:
              2 * (1 - returnProgress) * (returnControl.y - turn.y) +
              2 * returnProgress * (start.y - returnControl.y),
          };
    const spin = Math.atan2(tangent.y, tangent.x) + action * Math.PI * 10;
    const forward = { x: Math.cos(spin), y: Math.sin(spin) };
    const side = { x: -forward.y, y: forward.x };
    const bladePoint = (along, across) =>
      `${projectile.x + forward.x * along + side.x * across} ${projectile.y + forward.y * along + side.y * across}`;
    const opacity = phase === 0 ? 0.75 + prepare * 0.2 : phase === 1 ? 1 : 1 - recover;
    return [
      {
        ...path(
          `M ${bladePoint(24, -22)} L ${bladePoint(5, -6)} L ${bladePoint(-13, -12)} L ${bladePoint(-20, -2)} L ${bladePoint(0, 5)} L ${bladePoint(22, 23)} L ${bladePoint(30, 14)} L ${bladePoint(8, 0)} L ${bladePoint(31, -13)} Z`,
          opacity,
          'muted',
          2,
          0.94,
        ),
        x: projectile.x,
        y: projectile.y,
        radius: 30,
      },
      path(
        `M ${bladePoint(-8, -3)} L ${bladePoint(4, 0)} L ${bladePoint(0, 8)} Z M ${bladePoint(5, -6)} L ${bladePoint(24, -22)} M ${bladePoint(8, 0)} L ${bladePoint(22, 23)}`,
        opacity * 0.95,
        'signal',
        2,
      ),
    ];
  }
  if (mode === 'orbiting-projectiles') {
    const orbitRadius = phase === 2 ? mix(spec.orbitRadius, 78, recover) : spec.orbitRadius;
    const rotation = spec.startAngle + spec.rotation * action + (phase === 2 ? recover * 0.4 : 0);
    const projectileOpacity = phase === 0 ? 0.54 + prepare * 0.34 : phase === 1 ? 1 : 1 - recover;
    const stones = Array.from({ length: spec.projectileCount }, (_, index) => {
      const angle = rotation + (index * Math.PI * 2) / spec.projectileCount;
      const projectile = polar(boss, orbitRadius, angle);
      const tangent = { x: -Math.sin(angle), y: Math.cos(angle) };
      const radial = { x: Math.cos(angle), y: Math.sin(angle) };
      const at = (along, across) =>
        `${projectile.x + tangent.x * along + radial.x * across} ${projectile.y + tangent.y * along + radial.y * across}`;
      return {
        body: {
          ...path(
            `M ${at(18, 0)} L ${at(6, -14)} L ${at(-10, -12)} L ${at(-17, -1)} L ${at(-9, 14)} L ${at(8, 12)} Z`,
            projectileOpacity,
            'muted',
            2,
            0.94,
          ),
          x: projectile.x,
          y: projectile.y,
          radius: 18,
        },
        facet: path(
          `M ${at(18, 0)} L ${at(0, -3)} L ${at(-9, 14)} M ${at(0, -3)} L ${at(-10, -12)}`,
          projectileOpacity * 0.9,
          'signal',
          2,
        ),
      };
    });
    return [...stones.map(({ body }) => body), ...stones.map(({ facet }) => facet)];
  }
  if (mode === 'pulse-beam') {
    const beamStart = point(spec.beamStart);
    const beamEnd = point(spec.beamEnd);
    const activePulse = phase === 1 ? pulseBeamIndex(action) : -1;
    const beamOpacity = activePulse >= 0 ? 1 : 0;
    const guideOpacity =
      phase === 0 ? 0.12 + prepare * 0.22 : phase === 1 ? 0.12 : 0.12 * (1 - recover);
    const stream = Array.from({ length: 6 }, (_, index) => {
      const flow = (action * 1.15 + index / 6) % 1;
      const x = mix(beamStart.x + 22, beamEnd.x - 14, flow) + [-5, 5, -7, 8, -4, 4][index];
      const y = mix(beamStart.y + 23, beamEnd.y - 12, flow);
      return path(
        `M ${x - 10} ${y - 14} L ${x + 7} ${y - 4} L ${x + 10} ${y + 12} L ${x - 7} ${y + 6} Z`,
        beamOpacity * 0.78,
        'muted',
        1,
        0.85,
      );
    });
    return [
      line(beamStart.x, beamStart.y, beamEnd.x, beamEnd.y, guideOpacity, 'accent', 3),
      line(beamStart.x, beamStart.y, beamEnd.x, beamEnd.y, beamOpacity * 0.6, 'signal', 34),
      path(
        `M ${beamStart.x - 21} ${beamStart.y - 14} L ${beamStart.x - 6} ${beamStart.y - 26} L ${beamStart.x + 13} ${beamStart.y - 19} L ${beamStart.x + 26} ${beamStart.y + 1} L ${beamStart.x + 10} ${beamStart.y + 23} L ${beamStart.x - 12} ${beamStart.y + 18} Z`,
        phase === 2 ? 1 - recover : 0.68 + beamOpacity * 0.3,
        'muted',
        2,
        0.82,
      ),
      path(
        `M ${beamStart.x - 10} ${beamStart.y - 2} L ${beamStart.x + 2} ${beamStart.y - 13} L ${beamStart.x + 16} ${beamStart.y + 2} L ${beamStart.x + 1} ${beamStart.y + 14} Z`,
        phase === 2 ? 0.7 * (1 - recover) : 0.72 + beamOpacity * 0.23,
        'accent',
        2,
        0.76,
      ),
      line(beamStart.x, beamStart.y, beamEnd.x, beamEnd.y, beamOpacity * 0.93, 'accent', 9),
      ...stream,
    ];
  }
  if (mode === 'chain-explosions') {
    const centers = spec.blastCenters.map(point);
    const activeIndex = phase === 1 ? chainExplosionIndex(action) : -1;
    const chainPath = centers
      .map((center, index) => `${index ? 'L' : 'M'} ${center.x} ${center.y}`)
      .join(' ');
    const stoneOpacity = (index) =>
      phase === 0
        ? 0.55 + prepare * 0.32
        : phase === 1
          ? index === activeIndex
            ? 1
            : action > CHAIN_EXPLOSION_WINDOWS[index][1]
              ? 0.32
              : 0.72
          : 0.42 * (1 - recover);
    return [
      path(chainPath, 0, 'muted', 3),
      ...centers.map((center, index) => {
        const elapsed = phase === 1 && action > CHAIN_EXPLOSION_WINDOWS[index][1];
        const current = index === activeIndex;
        const opacity =
          phase === 0
            ? 0.22 + prepare * 0.22
            : phase === 1
              ? current
                ? 1
                : elapsed
                  ? 0.12
                  : 0.25
              : 0.1 * (1 - recover);
        return circle(
          center.x,
          center.y,
          spec.blastRadius,
          opacity,
          current ? 'signal' : elapsed ? 'safe' : 'accent',
          current ? 4 : 2,
          current ? 0.12 : 0,
        );
      }),
      ...centers.map((center, index) => {
        return path(
          `M ${center.x - 19} ${center.y - 7} L ${center.x - 5} ${center.y - 20} L ${center.x + 13} ${center.y - 16} L ${center.x + 21} ${center.y + 4} L ${center.x + 8} ${center.y + 20} L ${center.x - 14} ${center.y + 16} L ${center.x - 22} ${center.y + 3} Z`,
          stoneOpacity(index),
          'muted',
          2,
          0.9,
        );
      }),
      ...centers.map((center, index) =>
        path(
          `M ${center.x - 10} ${center.y - 5} L ${center.x + 1} ${center.y + 2} L ${center.x + 10} ${center.y - 10} M ${center.x + 1} ${center.y + 2} L ${center.x + 8} ${center.y + 12}`,
          stoneOpacity(index) * 0.88,
          index === activeIndex ? 'signal' : 'accent',
          2.5,
        ),
      ),
      ...centers.flatMap((center, index) =>
        [0, 1, 2, 3].map((piece) => {
          const angle = (piece * Math.PI * 2) / 4 + index * 0.23;
          const shard = polar(center, 38 + (piece % 2) * 9, angle);
          const tip = polar(shard, 15, angle);
          const sideA = polar(shard, 9, angle + 1.72);
          const sideB = polar(shard, 9, angle - 1.72);
          return path(
            `M ${tip.x} ${tip.y} L ${sideA.x} ${sideA.y} L ${center.x + Math.cos(angle) * 20} ${center.y + Math.sin(angle) * 20} L ${sideB.x} ${sideB.y} Z`,
            index === activeIndex ? 0.96 : 0,
            piece % 2 ? 'signal' : 'muted',
            1.5,
            0.86,
          );
        }),
      ),
    ];
  }
  if (mode === 'mine') {
    const mine = point(spec.mine);
    const throwProgress = smooth((frame.time - 0.18) / 0.62);
    const landed = smooth((frame.time - 0.8) / 0.42);
    const start = { x: boss.x + 34, y: boss.y + 6 };
    const device = {
      x: mix(start.x, mine.x, throwProgress),
      y: mix(start.y, mine.y, throwProgress) - Math.sin(throwProgress * Math.PI) * 82,
    };
    const rune = (x, y) => `${device.x + x} ${device.y + y}`;
    const armedOpacity = phase === 1 ? 0.76 + 0.2 * pulse(action * 2) : 0;
    const deviceOpacity =
      phase === 2 ? 0.72 * (1 - recover) : phase === 0 ? smooth(frame.time / 0.16) : 1;
    return [
      circle(
        mine.x,
        mine.y,
        spec.triggerRadius,
        phase === 0 ? 0.62 * landed : phase === 1 ? armedOpacity : 0.32 * (1 - recover),
        phase === 1 ? 'signal' : phase === 2 ? 'safe' : 'accent',
        phase === 1 ? 5 : 3,
        phase === 1 ? 0.08 : 0,
      ),
      {
        ...path(
          `M ${rune(-28, 8)} L ${rune(-24, -11)} L ${rune(-9, -19)} L ${rune(3, -27)} L ${rune(20, -13)} L ${rune(29, 6)} L ${rune(17, 21)} L ${rune(-13, 23)} Z`,
          deviceOpacity,
          'muted',
          3,
          0.94,
        ),
        x: device.x,
        y: device.y,
      },
      path(
        `M ${rune(-2, -19)} L ${rune(15, -3)} L ${rune(4, 15)} L ${rune(-14, 4)} Z`,
        deviceOpacity,
        phase === 1 ? 'signal' : phase === 2 ? 'safe' : 'accent',
        2,
        phase === 1 ? 0.94 : 0.58,
      ),
      path(
        `M ${rune(-23, -10)} L ${rune(-12, -2)} M ${rune(15, -13)} L ${rune(9, -7)} M ${rune(-15, 15)} L ${rune(-5, 11)} M ${rune(15, 14)} L ${rune(10, 7)}`,
        deviceOpacity * (phase === 1 ? 0.9 : 0.42 + 0.42 * landed),
        phase === 2 ? 'safe' : 'signal',
        3,
      ),
    ];
  }
  if (mode === 'moving-hazard') {
    const start = point(spec.hazardStart);
    const end = point(spec.hazardEnd);
    const travel = phase === 0 ? 0 : phase === 1 ? smooth(action) : 1;
    const center = { x: mix(start.x, end.x, travel), y: mix(start.y, end.y, travel) };
    const opacity = phase === 0 ? 0.55 + prepare * 0.25 : phase === 1 ? 1 : 0.72 * (1 - recover);
    const rotation = ((center.x - start.x) / spec.hazardRadius) * 0.8;
    const at = (angle, reach = 1) => polar(center, spec.hazardRadius * reach, angle + rotation);
    const mark = (x, y) =>
      `${center.x + x * Math.cos(rotation) - y * Math.sin(rotation)} ${center.y + x * Math.sin(rotation) + y * Math.cos(rotation)}`;
    const stoneEdge = [0.04, 0.6, 1.3, 1.93, 2.54, 3.17, 3.8, 4.42, 5.06, 5.66]
      .map((angle, index) => {
        const vertex = at(angle, [0.96, 0.87, 1, 0.9, 0.97, 0.86, 0.99, 0.9, 0.96, 0.88][index]);
        return `${index ? 'L' : 'M'} ${vertex.x} ${vertex.y}`;
      })
      .join(' ');
    const facets = Array.from({ length: 3 }, (_, index) => {
      const angle = rotation + (index * Math.PI * 2) / 3;
      const tip = polar(center, 54, angle);
      const left = polar(center, 15, angle - 0.65);
      const right = polar(center, 22, angle + 0.54);
      return path(
        `M ${left.x} ${left.y} L ${tip.x} ${tip.y} M ${right.x} ${right.y} L ${tip.x} ${tip.y}`,
        opacity * 0.48,
        'muted',
        3,
      );
    });
    return [
      line(start.x, start.y, center.x, center.y, phase === 1 ? 0.22 : 0, 'muted', 4),
      {
        ...path(`${stoneEdge} Z`, opacity, 'muted', 3, 0.78),
        x: center.x,
        y: center.y,
        radius: spec.hazardRadius,
      },
      ...facets,
      path(
        `M ${mark(-30, -17)} L ${mark(-11, -10)} L ${mark(-4, 10)} L ${mark(19, 2)} L ${mark(31, 19)}`,
        opacity * (phase === 1 ? 0.95 : 0.58),
        phase === 2 ? 'safe' : 'signal',
        4,
      ),
    ];
  }
  if (mode === 'converging-threats') {
    const edge =
      phase === 0
        ? spec.entryWidth
        : phase === 1
          ? mix(spec.entryWidth, spec.convergence, smooth(action))
          : spec.convergence;
    const right = spec.arenaWidth - edge;
    const opacity = phase === 0 ? 0.38 + prepare * 0.32 : phase === 1 ? 0.94 : 0.6 * (1 - recover);
    const top = spec.threatTop;
    const bottom = top + spec.threatHeight;
    const leftFront = `M ${edge - 13} ${top} L ${edge} ${top + 28} L ${edge - 12} ${top + 61} L ${edge - 2} ${top + 96} L ${edge - 14} ${top + 132} L ${edge} ${top + 166} L ${edge - 10} ${top + 201} L ${edge - 4} ${bottom}`;
    const rightFront = `M ${right + 13} ${top} L ${right} ${top + 28} L ${right + 12} ${top + 61} L ${right + 2} ${top + 96} L ${right + 14} ${top + 132} L ${right} ${top + 166} L ${right + 10} ${top + 201} L ${right + 4} ${bottom}`;
    return [
      {
        ...path(
          `M 0 ${top} ${leftFront.replace(/^M /, 'L ')} L 0 ${bottom} Z`,
          opacity,
          'muted',
          0,
          0.76,
        ),
        x: 0,
        y: top,
        rectWidth: edge,
        rectHeight: spec.threatHeight,
      },
      {
        ...path(
          `M ${spec.arenaWidth} ${top} ${rightFront.replace(/^M /, 'L ')} L ${spec.arenaWidth} ${bottom} Z`,
          opacity,
          'muted',
          0,
          0.76,
        ),
        x: right,
        y: top,
        rectWidth: edge,
        rectHeight: spec.threatHeight,
      },
      path(leftFront, opacity * 0.83, phase === 2 ? 'safe' : 'signal', 4),
      path(rightFront, opacity * 0.83, phase === 2 ? 'safe' : 'signal', 4),
      path(
        `M ${edge - 94} ${top + 28} L ${edge - 65} ${top + 54} L ${edge - 72} ${top + 107} M ${edge - 107} ${top + 155} L ${edge - 70} ${top + 179} L ${edge - 52} ${bottom - 20}`,
        opacity * 0.4,
        'muted',
        4,
      ),
      path(
        `M ${right + 94} ${top + 28} L ${right + 65} ${top + 54} L ${right + 72} ${top + 107} M ${right + 107} ${top + 155} L ${right + 70} ${top + 179} L ${right + 52} ${bottom - 20}`,
        opacity * 0.4,
        'muted',
        4,
      ),
    ];
  }
  if (mode === 'pull') {
    const ringOpacity =
      phase === 0 ? 0.12 + prepare * 0.1 : phase === 1 ? 0.18 : 0.14 * (1 - recover);
    const forceOpacity =
      phase === 0 ? 0.4 + prepare * 0.26 : phase === 1 ? 0.94 : 0.45 * (1 - recover);
    const angleOffset = phase === 1 ? action * 0.42 : 0;
    const stones = [0.22, 1.17, 1.98, 2.88, 3.56, 4.64, 5.31].map((angle, index) => {
      const center = polar(
        boss,
        250 + [-26, 19, -8, 31, -20, 24, -5][index] - (phase === 1 ? action * 90 : prepare * 25),
        angle + angleOffset,
      );
      const size = [0.82, 1.1, 0.96, 0.72, 1.13, 0.89, 1.02][index];
      return path(
        `M ${center.x - 15 * size} ${center.y - 5 * size} L ${center.x - 4 * size} ${center.y - 12 * size} L ${center.x + 10 * size} ${center.y - 7 * size} L ${center.x + 14 * size} ${center.y + 6 * size} L ${center.x + (index % 2 ? 3 : 8) * size} ${center.y + 12 * size} L ${center.x - 12 * size} ${center.y + 7 * size} Z`,
        forceOpacity,
        'muted',
        2,
        0.88,
      );
    });
    const dangerOutline = Array.from({ length: 13 }, (_, index) => {
      const vertex = polar(
        boss,
        spec.dangerRadius - (index % 3 === 0 ? 8 : 0),
        (index * Math.PI * 2) / 13,
      );
      return `${index ? 'L' : 'M'} ${vertex.x} ${vertex.y}`;
    }).join(' ');
    return [
      circle(boss.x, boss.y, spec.pullRadius, 0, 'accent', 2, 0),
      {
        ...path(
          `${dangerOutline} Z`,
          phase === 1 ? 0.92 : ringOpacity * 1.8,
          phase === 1 ? 'signal' : 'accent',
          phase === 1 ? 5 : 2,
          phase === 1 ? 0.08 : 0,
        ),
        x: boss.x,
        y: boss.y,
        radius: spec.dangerRadius,
      },
      path(
        `M ${boss.x - 23} ${boss.y + 12} L ${boss.x - 7} ${boss.y - 19} L ${boss.x + 10} ${boss.y - 22} L ${boss.x + 27} ${boss.y + 10} L ${boss.x + 8} ${boss.y + 27} Z`,
        phase === 2 ? 0.62 * (1 - recover) : 0.78,
        'accent',
        2,
        0.72,
      ),
      ...stones,
    ];
  }
  if (mode === 'turret-deployment') {
    const turret = point(spec.turret);
    const end = point(spec.beamEnd);
    const deployed = phase !== 0 || prepare >= 0.7;
    const shellOpacity =
      phase === 2 ? 1 - recover : phase === 0 ? 0.18 + smooth((prepare - 0.7) / 0.3) * 0.74 : 0.92;
    const shotOpacity = frame.dangerActive ? 0.94 : 0;
    const travel = phase === 0 ? smooth(prepare / 0.7) : 1;
    const capsule = {
      x: mix(boss.x + 38, turret.x, travel),
      y: mix(boss.y + 12, turret.y, travel) - Math.sin(travel * Math.PI) * 65,
    };
    return [
      path(`M ${boss.x + 38} ${boss.y + 12} L ${turret.x} ${turret.y}`, 0, 'accent', 3),
      path(
        `M ${capsule.x - 15} ${capsule.y - 7} L ${capsule.x - 4} ${capsule.y - 17} L ${capsule.x + 13} ${capsule.y - 8} L ${capsule.x + 17} ${capsule.y + 9} L ${capsule.x} ${capsule.y + 18} L ${capsule.x - 17} ${capsule.y + 8} Z`,
        phase === 0 && !deployed ? 0.95 : 0,
        'muted',
        2,
        0.9,
      ),
      {
        ...path(
          `M ${turret.x - 37} ${turret.y - 11} L ${turret.x - 25} ${turret.y - 34} L ${turret.x + 4} ${turret.y - 39} L ${turret.x + 32} ${turret.y - 23} L ${turret.x + 39} ${turret.y + 12} L ${turret.x + 20} ${turret.y + 31} L ${turret.x - 17} ${turret.y + 38} L ${turret.x - 39} ${turret.y + 14} Z`,
          shellOpacity,
          'muted',
          2,
          0.88,
        ),
        x: turret.x,
        y: turret.y,
      },
      path(
        `M ${turret.x} ${turret.y - 21} L ${turret.x + 18} ${turret.y} L ${turret.x} ${turret.y + 22} L ${turret.x - 18} ${turret.y} Z`,
        shellOpacity,
        deployed ? 'signal' : 'accent',
        2,
        0.84,
      ),
      path(
        `M ${turret.x - 13} ${turret.y + 22} L ${turret.x - 10} ${turret.y + 48} L ${turret.x - 17} ${turret.y + 61} L ${turret.x + 17} ${turret.y + 61} L ${turret.x + 10} ${turret.y + 48} L ${turret.x + 13} ${turret.y + 22} Z`,
        shellOpacity,
        'muted',
        2,
        0.9,
      ),
      path(
        `M ${turret.x - 24} ${turret.y - 27} L ${turret.x - 6} ${turret.y - 31} M ${turret.x + 17} ${turret.y - 21} L ${turret.x + 28} ${turret.y - 4} M ${turret.x - 21} ${turret.y + 24} L ${turret.x - 6} ${turret.y + 30}`,
        shellOpacity * 0.64,
        'accent',
        2,
      ),
      line(
        turret.x,
        turret.y + 61,
        end.x,
        end.y,
        phase === 0 ? 0.06 + prepare * 0.06 : 0,
        'accent',
        spec.beamHalfWidth * 2,
        '15 11',
      ),
      line(
        turret.x,
        turret.y + 61,
        end.x,
        end.y,
        shotOpacity * 0.6,
        'signal',
        spec.beamHalfWidth * 2,
      ),
      line(turret.x, turret.y + 61, end.x, end.y, shotOpacity, 'accent', 8),
      ...[-1, 1].map((side) =>
        line(
          turret.x + side * spec.beamHalfWidth,
          turret.y + 61,
          end.x + side * spec.beamHalfWidth,
          end.y,
          phase === 0 ? 0.27 + prepare * 0.24 : 0,
          'accent',
          2,
          '10 14',
        ),
      ),
      ...Array.from({ length: 7 }, (_, index) => {
        const flow = (action * 1.3 + index / 7) % 1;
        const y = mix(turret.y + 78, end.y - 12, flow);
        const x = turret.x + [-9, 11, -5, 8, -11, 5, 0][index];
        return path(
          `M ${x} ${y - 19} L ${x + 7} ${y - 3} L ${x + 1} ${y + 18} L ${x - 7} ${y + 2} Z`,
          shotOpacity * 0.8,
          'muted',
          1,
          0.82,
        );
      }),
    ];
  }
  if (mode === 'threat-generator') {
    const generator = point(spec.generator);
    const placement = phase === 0 ? smooth(prepare / 0.72) : 1;
    const capsule = {
      x: mix(boss.x + 38, generator.x, placement),
      y: mix(boss.y + 12, generator.y, placement) - Math.sin(placement * Math.PI) * 65,
    };
    const sourceOpacity = phase === 2 ? 1 - recover : phase === 0 ? placement * 0.95 : 0.95;
    const charging = Math.max(
      0,
      ...GENERATOR_RELEASES.map((release) =>
        frame.time <= release ? 1 - clamp((release - frame.time) / 0.28) : 0,
      ),
    );
    const stones = generatorShots(spec, frame.time).map((shot) => ({
      body: {
        ...path(
          `M ${shot.x} ${shot.y + 21} L ${shot.x - 11} ${shot.y + 4} L ${shot.x - 8} ${shot.y - 14} L ${shot.x + 6} ${shot.y - 17} L ${shot.x + 12} ${shot.y + 7} Z`,
          shot.active ? 0.98 : 0,
          'muted',
          2,
          0.93,
        ),
        x: shot.x,
        y: shot.y,
        radius: shot.radius,
      },
      facet: path(
        `M ${shot.x} ${shot.y + 18} L ${shot.x + 2} ${shot.y - 3} L ${shot.x - 8} ${shot.y - 12}`,
        shot.active ? 0.94 : 0,
        'signal',
        2,
      ),
    }));
    return [
      path(`M ${boss.x + 38} ${boss.y + 12} L ${generator.x} ${generator.y}`, 0, 'accent', 3),
      path(
        `M ${capsule.x - 16} ${capsule.y - 5} L ${capsule.x - 5} ${capsule.y - 16} L ${capsule.x + 13} ${capsule.y - 10} L ${capsule.x + 18} ${capsule.y + 8} L ${capsule.x + 2} ${capsule.y + 17} L ${capsule.x - 15} ${capsule.y + 9} Z`,
        phase === 0 && placement < 1 ? 0.9 : 0,
        'muted',
        2,
        0.9,
      ),
      path(
        `M ${boss.x - 16} ${boss.y - 5} L ${boss.x + 4} ${boss.y - 17} L ${boss.x + 18} ${boss.y + 7} L ${boss.x - 2} ${boss.y + 17} Z`,
        phase === 2 ? recover * 0.9 : 0,
        'muted',
        2,
        0.86,
      ),
      path(
        `M ${generator.x - 36} ${generator.y - 11} L ${generator.x - 22} ${generator.y - 34} L ${generator.x + 8} ${generator.y - 38} L ${generator.x + 34} ${generator.y - 18} L ${generator.x + 37} ${generator.y + 13} L ${generator.x + 17} ${generator.y + 31} L ${generator.x - 19} ${generator.y + 34} L ${generator.x - 38} ${generator.y + 9} Z`,
        sourceOpacity,
        'muted',
        2,
        0.9,
      ),
      path(
        `M ${generator.x} ${generator.y - 19} L ${generator.x + 18} ${generator.y} L ${generator.x} ${generator.y + 19} L ${generator.x - 18} ${generator.y} Z`,
        sourceOpacity * (0.65 + 0.35 * charging),
        'signal',
        2,
        0.82,
      ),
      path(
        `M ${generator.x - 17} ${generator.y + 25} L ${generator.x - 14} ${generator.y + 42} L ${generator.x} ${generator.y + 50} L ${generator.x + 14} ${generator.y + 42} L ${generator.x + 17} ${generator.y + 25} Z`,
        sourceOpacity,
        'muted',
        2,
        0.9,
      ),
      ...stones.map(({ body }) => body),
      ...stones.map(({ facet }) => facet),
    ];
  }
  if (mode === 'decoy') {
    const split = phase === 0 ? prepare : 1;
    return [
      line(
        spec.boss[0],
        spec.boss[1],
        spec.real[0],
        spec.real[1],
        phase === 0 ? 0.3 + prepare * 0.38 : 0,
        'accent',
        3,
      ),
      line(
        spec.boss[0],
        spec.boss[1],
        spec.mirror[0],
        spec.mirror[1],
        phase === 0 ? 0.3 + prepare * 0.38 : 0,
        'signal',
        3,
      ),
      circle(
        boss.x,
        boss.y,
        spec.contactRadius,
        phase === 1 ? 0.18 : 0.08 * split,
        'signal',
        3,
        0.12,
      ),
    ];
  }
  if (mode === 'predictive-aim') {
    const predicted = frame.predicted;
    const emitter = { x: boss.x + 38, y: boss.y + 9 };
    const shotProgress = clamp((frame.time - 1.6) / 2.15);
    const shot = {
      x: mix(emitter.x, predicted.x, shotProgress),
      y: mix(emitter.y, predicted.y, shotProgress),
    };
    const live = phase === 1 && frame.time <= 3.75;
    const heading = Math.atan2(predicted.y - emitter.y, predicted.x - emitter.x);
    const forward = { x: Math.cos(heading), y: Math.sin(heading) };
    const side = { x: -forward.y, y: forward.x };
    const tip = (along, across) =>
      `${shot.x + forward.x * along + side.x * across} ${shot.y + forward.y * along + side.y * across}`;
    return [
      line(player.x, player.y, predicted.x, predicted.y, phase === 0 ? 0.28 : 0, 'muted', 2),
      circle(predicted.x, predicted.y, 29, phase === 2 ? 0 : 0.68, 'signal', 2, 0.05),
      line(
        emitter.x,
        emitter.y,
        predicted.x,
        predicted.y,
        phase === 2 ? 0 : phase === 0 ? 0.28 : 0.08,
        'accent',
        2,
      ),
      {
        ...path(
          `M ${tip(22, 0)} L ${tip(3, -12)} L ${tip(-13, -10)} L ${tip(-20, 3)} L ${tip(-8, 12)} L ${tip(8, 9)} Z`,
          live ? 0.96 : 0,
          'muted',
          2,
          0.93,
        ),
        x: shot.x,
        y: shot.y,
        radius: spec.shotRadius,
      },
      path(
        `M ${predicted.x} ${predicted.y - 17} L ${predicted.x + 15} ${predicted.y} L ${predicted.x} ${predicted.y + 17} L ${predicted.x - 15} ${predicted.y} Z`,
        phase === 2 ? 0 : 0.72,
        'accent',
        2,
        0.28,
      ),
      path(
        `M ${tip(20, 0)} L ${tip(0, -3)} L ${tip(-8, 12)} M ${tip(0, -3)} L ${tip(-13, -10)}`,
        live ? 0.92 : 0,
        'signal',
        2,
      ),
    ];
  }
  if (mode === 'source-track') {
    const source = point(spec.emitter);
    const end = polar(source, spec.beamLength, frame.sourceAngle);
    const tip = polar(source, 42, frame.sourceAngle);
    const cue = phase === 0 ? 0.28 + prepare * 0.2 : frame.time < 2.4 ? 0.52 : 0;
    const beam = frame.dangerActive ? 0.6 : 0;
    const forward = { x: Math.cos(frame.sourceAngle), y: Math.sin(frame.sourceAngle) };
    const side = { x: -forward.y, y: forward.x };
    const at = (center, along, across) =>
      `${center.x + forward.x * along + side.x * across} ${center.y + forward.y * along + side.y * across}`;
    const stream = Array.from({ length: 6 }, (_, index) => {
      const flow = ((frame.time - 2.4) * 1.3 + index / 6) % 1;
      const center = polar(source, 65 + flow * 550, frame.sourceAngle);
      return path(
        `M ${at(center, 17, 0)} L ${at(center, 2, -8)} L ${at(center, -14, -5)} L ${at(center, -9, 8)} L ${at(center, 4, 7)} Z`,
        frame.dangerActive ? 0.78 : 0,
        'muted',
        1.5,
        0.84,
      );
    });
    return [
      path(
        `M ${source.x - 20} ${source.y - 7} L ${source.x - 9} ${source.y - 21} L ${source.x + 11} ${source.y - 18} L ${source.x + 22} ${source.y + 3} L ${source.x + 8} ${source.y + 19} L ${source.x - 18} ${source.y + 11} Z`,
        phase === 2 ? 0.65 * (1 - recover) : 0.9,
        'muted',
        2,
        0.88,
      ),
      path(
        `M ${at(source, 5, -9)} L ${at(tip, 2, -7)} L ${at(tip, 10, 0)} L ${at(tip, 2, 7)} L ${at(source, 5, 9)} Z`,
        phase === 2 ? 0.65 * (1 - recover) : 0.94,
        'muted',
        2,
        0.82,
      ),
      line(source.x, source.y, end.x, end.y, cue, 'accent', 3),
      line(source.x, source.y, end.x, end.y, beam, 'signal', spec.beamHalfWidth * 2),
      path(
        `M ${at(tip, 10, 0)} L ${at(tip, -2, -8)} L ${at(tip, -8, 0)} L ${at(tip, -2, 8)} Z`,
        phase === 2 ? 0.5 * (1 - recover) : 0.75 + 0.18 * beam,
        'accent',
        2,
        0.8,
      ),
      line(source.x, source.y, end.x, end.y, frame.dangerActive ? 0.9 : 0, 'accent', 8),
      ...stream,
    ];
  }
  if (mode === 'burst-fire') {
    const origin = point(spec.emitter);
    const end = point(spec.shotEnd);
    const heading = Math.atan2(end.y - origin.y, end.x - origin.x);
    const forward = { x: Math.cos(heading), y: Math.sin(heading) };
    const side = { x: -forward.y, y: forward.x };
    const shots = spec.releases.map((release) => {
      const elapsed = frame.time - release;
      const progress = clamp(elapsed / spec.flight);
      const visible = elapsed >= 0 && elapsed <= spec.flight;
      const x = mix(origin.x, end.x, progress);
      const y = mix(origin.y, end.y, progress);
      const tip = (along, across) =>
        `${x + forward.x * along + side.x * across} ${y + forward.y * along + side.y * across}`;
      return {
        ...path(
          `M ${tip(23, 0)} L ${tip(7, -11)} L ${tip(-10, -10)} L ${tip(-19, -3)} L ${tip(-13, 8)} L ${tip(6, 10)} Z`,
          visible ? 0.98 : 0,
          'muted',
          2,
          0.94,
        ),
        x,
        y,
        radius: spec.shotRadius,
      };
    });
    const facets = shots.map((shot) => {
      const tip = (along, across) =>
        `${shot.x + forward.x * along + side.x * across} ${shot.y + forward.y * along + side.y * across}`;
      return path(
        `M ${tip(21, 0)} L ${tip(-2, -5)} L ${tip(-14, -2)} M ${tip(21, 0)} L ${tip(2, 7)}`,
        shot.opacity,
        'signal',
        2,
      );
    });
    return [
      path(
        `M ${origin.x - 27} ${origin.y - 30} L ${origin.x - 16} ${origin.y - 38} L ${origin.x + 9} ${origin.y - 17} L ${origin.x + 15} ${origin.y + 4} L ${origin.x + 3} ${origin.y + 13} L ${origin.x - 9} ${origin.y - 11} Z`,
        0.95,
        'muted',
        2,
        0.94,
      ),
      line(
        origin.x,
        origin.y,
        end.x,
        end.y,
        phase === 0 ? 0.35 + prepare * 0.4 : phase === 1 ? 0.2 : 0,
        'accent',
        3,
      ),
      ...shots,
      path(
        `M ${origin.x - 8} ${origin.y + 18} L ${origin.x + 17} ${origin.y + 50} L ${origin.x + 24} ${origin.y + 20} L ${origin.x + 9} ${origin.y + 34} Z`,
        phase === 1
          ? Math.max(
              ...spec.releases.map((release) =>
                pulse(clamp(Math.abs(frame.time - release) / 0.16)),
              ),
            ) * 0.75
          : 0,
        'signal',
        0,
        0.9,
      ),
      ...facets,
      path(
        `M ${origin.x - 11} ${origin.y - 25} L ${origin.x + 6} ${origin.y - 12} L ${origin.x + 10} ${origin.y + 2} M ${origin.x - 3} ${origin.y - 12} L ${origin.x + 6} ${origin.y - 12}`,
        phase === 0 ? 0.5 + prepare * 0.45 : phase === 1 ? 0.85 : 0.35 * (1 - recover),
        'accent',
        2,
      ),
    ];
  }
  if (mode === 'volley') {
    const elapsed = frame.time - spec.release;
    const progress = clamp(elapsed / spec.flight);
    const visible = elapsed >= 0 && elapsed <= spec.flight;
    const shotY = mix(spec.emitterY, spec.shotEndY, progress);
    return [
      path(
        spec.lanes
          .map(
            (x, index) =>
              `M ${x - 26} ${spec.emitterY + 14 + index * 2} L ${x - 5} ${spec.emitterY + 10} L ${x + 23} ${spec.emitterY + 14 - index} M ${x + 9} ${spec.emitterY + 12} L ${x + 16} ${spec.emitterY + 20}`,
          )
          .join(' '),
        phase === 2 ? 0.42 * (1 - recover) : 0.52,
        'muted',
        3,
      ),
      ...spec.lanes.map((x) =>
        line(
          x,
          spec.emitterY,
          x,
          spec.shotEndY,
          phase === 0 ? 0.3 + prepare * 0.36 : phase === 1 ? 0.12 : 0,
          'accent',
          3,
        ),
      ),
      ...spec.lanes.map((x) =>
        path(
          `M ${x - 20} ${spec.emitterY + 10} L ${x - 15} ${spec.emitterY - 8} L ${x - 5} ${spec.emitterY - 15} L ${x + 4} ${spec.emitterY - 10} L ${x + 13} ${spec.emitterY - 16} L ${x + 19} ${spec.emitterY + 8} Z`,
          phase === 0 ? 0.68 + prepare * 0.26 : 0.68,
          'muted',
          2,
          0.87,
        ),
      ),
      ...spec.lanes.map((x) => ({
        ...path(
          `M ${x} ${shotY + 22} L ${x - 14} ${shotY + 3} L ${x - 10} ${shotY - 8} L ${x - 3} ${shotY - 16} L ${x + 5} ${shotY - 11} L ${x + 12} ${shotY - 17} L ${x + 15} ${shotY + 2} Z`,
          visible ? 0.98 : 0,
          'muted',
          2,
          0.94,
        ),
        x,
        y: shotY,
        radius: spec.shotRadius,
      })),
      ...spec.lanes.map((x) =>
        path(
          `M ${x} ${shotY + 20} L ${x + 2} ${shotY - 7} L ${x + 12} ${shotY - 16} M ${x + 2} ${shotY - 7} L ${x - 11} ${shotY + 2}`,
          visible ? 0.96 : 0,
          'signal',
          2,
        ),
      ),
      ...spec.lanes.map((x) =>
        path(
          `M ${x - 7} ${spec.emitterY - 8} L ${x + 2} ${spec.emitterY - 5} L ${x + 7} ${spec.emitterY + 6}`,
          phase === 0 ? 0.45 + prepare * 0.46 : 0.3,
          'accent',
          2,
        ),
      ),
    ];
  }
  if (mode === 'arc')
    return [
      path(
        annularSectorPath(
          boss,
          SWEEP_INNER_RADIUS,
          SWEEP_OUTER_RADIUS,
          WIDE_SWING_FROM,
          WIDE_SWING_TO,
        ),
        preview,
        'accent',
        0,
        0.18,
      ),
      path(
        annularSectorPath(
          boss,
          SWEEP_INNER_RADIUS,
          SWEEP_OUTER_RADIUS,
          WIDE_SWING_FROM,
          phase === 0
            ? WIDE_SWING_FROM
            : phase === 1
              ? mix(WIDE_SWING_FROM, WIDE_SWING_TO, action)
              : WIDE_SWING_TO,
        ),
        active,
        'signal',
        0,
        0.2,
      ),
    ];
  if (mode === 'lunge') {
    const origin = point(spec.boss);
    return [
      path(lungeScuffPath(origin, point(spec.lungeEnd)), preview, 'accent', 0, 0.33),
      path(
        lungeGougesPath(origin, phase === 2 ? point(spec.lungeEnd) : boss),
        active,
        'muted',
        0,
        0.72,
      ),
    ];
  }
  if (mode === 'grab') {
    const target = point(spec.grabPoint);
    const reach = phase === 0 ? prepare * 0.14 : phase === 1 ? smooth(action / 0.35) : 1 - recover;
    const shoulder = { x: boss.x + 34, y: boss.y - 10 };
    const hand = {
      x: mix(boss.x + 74, target.x, reach),
      y: mix(boss.y + 12, target.y, reach),
    };
    const heading = Math.atan2(hand.y - shoulder.y, hand.x - shoulder.x);
    const forward = { x: Math.cos(heading), y: Math.sin(heading) };
    const side = { x: -forward.y, y: forward.x };
    const elbow = {
      x: mix(shoulder.x, hand.x, 0.46) - side.x * 10,
      y: mix(shoulder.y, hand.y, 0.46) - side.y * 10,
    };
    const wrist = { x: hand.x - forward.x * 22, y: hand.y - forward.y * 22 };
    const at = (center, along, across) =>
      `${center.x + forward.x * along + side.x * across} ${center.y + forward.y * along + side.y * across}`;
    const plate = (from, to, rootWidth, tipWidth) =>
      `M ${at(from, -5, -rootWidth)} L ${at(to, 5, -tipWidth)} L ${at(to, 5, tipWidth)} L ${at(from, -5, rootWidth)} Z`;
    const finger = (along, across) => at(hand, along, across);
    return [
      path(
        `${plate(shoulder, elbow, 16, 13)} ${plate(elbow, wrist, 15, 10)}`,
        0.98,
        'muted',
        3,
        0.92,
      ),
      {
        ...path(
          `M ${finger(-22, -19)} L ${finger(8, -23)} L ${finger(20, -10)} L ${finger(20, 10)} L ${finger(8, 23)} L ${finger(-22, 19)} Z`,
          0.98,
          'muted',
          3,
          0.94,
        ),
        x: hand.x,
        y: hand.y,
        radius: 60,
      },
      path(
        `M ${finger(7, -23)} L ${finger(30, -39)} L ${finger(47, -33)} L ${finger(53, -15)} L ${finger(34, -17)} L ${finger(23, -6)} Z M ${finger(7, 23)} L ${finger(30, 39)} L ${finger(47, 33)} L ${finger(53, 15)} L ${finger(34, 17)} L ${finger(23, 6)} Z`,
        0.98,
        'accent',
        2,
        0.82,
      ),
      path(
        `M ${at(shoulder, 6, 0)} L ${at(elbow, 0, 0)} L ${at(wrist, 0, 0)} L ${finger(7, 0)} M ${finger(21, -16)} L ${finger(40, -25)} M ${finger(21, 16)} L ${finger(40, 25)}`,
        phase === 0 ? 0.42 + prepare * 0.4 : 0.9,
        'signal',
        3,
      ),
      circle(elbow.x, elbow.y, 7, 0.94, 'signal', 2, 0.5),
    ];
  }
  if (mode === 'burrow') {
    const underground = quadraticPoint(
      { x: 190, y: 320 },
      { x: 270, y: 510 },
      { x: 420, y: 590 },
      smooth(action / 0.68),
    );
    const moundVisible = phase === 1 && action < 0.68 ? 0.76 : 0;
    const emergenceVisible = phase === 2 ? 1 - recover : phase === 1 ? 1 : preview;
    return [
      path(
        'M 158 302 L 187 320 L 173 340 M 187 320 L 210 294 M 187 320 L 221 333',
        phase === 0 ? prepare * 0.5 : phase === 1 ? 0.45 : 0,
        'muted',
        5,
      ),
      path(
        `M ${underground.x - 26} ${underground.y + 9} L ${underground.x - 13} ${underground.y - 13} L ${underground.x + 7} ${underground.y - 19} L ${underground.x + 27} ${underground.y + 7} L ${underground.x + 5} ${underground.y + 17} Z`,
        moundVisible,
        'accent',
        0,
        0.76,
      ),
      circle(420, 590, mix(34, 78, prepare), emergenceVisible, 'signal', 0, 0.22),
      path(
        'M 382 568 L 406 585 L 393 606 M 406 585 L 431 567 L 444 584 M 406 585 L 423 612 L 450 619',
        emergenceVisible * 0.68,
        'muted',
        5,
      ),
    ];
  }
  if (mode === 'fan') return projectileLines(boss, 7, 0.78, 610 * action, active);
  if (mode === 'ring') {
    const radius = mix(96, 390, action);
    const gapCenter = Math.atan2(690 - boss.y, 440 - boss.x);
    const shards = Array.from({ length: 32 }, (_, index) => {
      const angle = (index * Math.PI * 2) / 32;
      const center = polar(boss, radius, angle);
      const forward = { x: Math.cos(angle), y: Math.sin(angle) };
      const side = { x: -forward.y, y: forward.x };
      const tip = (along, across) =>
        `${center.x + forward.x * along + side.x * across} ${center.y + forward.y * along + side.y * across}`;
      const opacity = Math.abs(angleDifference(angle, gapCenter)) > 0.28 ? active : 0;
      return {
        ...path(
          `M ${tip(18, 0)} L ${tip(5, -8)} L ${tip(-6, -11)} L ${tip(-16, -4)} L ${tip(-9, 4)} L ${tip(-14, 10)} L ${tip(6, 8)} Z`,
          opacity,
          'muted',
          2,
          0.92,
        ),
        x: center.x,
        y: center.y,
        radius: 18,
      };
    });
    const facets = shards.map((shard, index) => {
      const angle = (index * Math.PI * 2) / 32;
      const forward = { x: Math.cos(angle), y: Math.sin(angle) };
      const side = { x: -forward.y, y: forward.x };
      const tip = (along, across) =>
        `${shard.x + forward.x * along + side.x * across} ${shard.y + forward.y * along + side.y * across}`;
      return path(
        `M ${tip(15, 0)} L ${tip(-4, -5)} L ${tip(-12, -3)} M ${tip(15, 0)} L ${tip(1, 6)}`,
        shard.opacity * 0.94,
        'signal',
        2,
      );
    });
    return [...shards, ...facets];
  }
  if (mode === 'spiral') {
    const stones = spiralShots(boss, frame.time).map((shot) => {
      const forward = { x: Math.cos(shot.angle), y: Math.sin(shot.angle) };
      const side = { x: -forward.y, y: forward.x };
      const tip = (along, across) =>
        `${shot.x + forward.x * along + side.x * across} ${shot.y + forward.y * along + side.y * across}`;
      return {
        body: {
          ...path(
            `M ${tip(16, 0)} L ${tip(4, -7)} L ${tip(-7, -9)} L ${tip(-14, -3)} L ${tip(-8, 8)} L ${tip(5, 7)} Z`,
            shot.active ? 1 : 0,
            'muted',
            1.5,
            0.92,
          ),
          x: shot.x,
          y: shot.y,
          radius: 16,
        },
        facet: path(
          `M ${tip(15, 0)} L ${tip(-2, -2)} L ${tip(-8, 8)} M ${tip(-2, -2)} L ${tip(-7, -9)}`,
          shot.active ? 0.92 : 0,
          'signal',
          1.6,
        ),
      };
    });
    return [...stones.map(({ body }) => body), ...stones.map(({ facet }) => facet)];
  }
  if (mode === 'ricochet') {
    const corners = [
      { x: 198, y: 262 },
      { x: 500, y: 420 },
      { x: 110, y: 610 },
      { x: 430, y: 790 },
    ];
    const segment = Math.min(2, Math.floor(action * 3));
    const progress = clamp(action * 3 - segment);
    const start = corners[segment];
    const end = corners[segment + 1];
    const head = { x: mix(start.x, end.x, progress), y: mix(start.y, end.y, progress) };
    const tailProgress = Math.max(0, progress - 0.22);
    const tail = { x: mix(start.x, end.x, tailProgress), y: mix(start.y, end.y, tailProgress) };
    const bounceFlash = (mark) => (phase === 1 ? clamp(1 - Math.abs(action - mark) / 0.06) : 0);
    const firstImpact = bounceFlash(1 / 3);
    const secondImpact = bounceFlash(2 / 3);
    return [
      line(198, 262, 500, 420, phase === 0 ? preview * 0.35 : 0, 'accent', 3),
      line(tail.x, tail.y, head.x, head.y, active * 0.32, 'signal', 4),
      {
        ...path(
          `M ${head.x - 20} ${head.y - 5} L ${head.x - 7} ${head.y - 17} L ${head.x + 10} ${head.y - 15} L ${head.x + 19} ${head.y - 1} L ${head.x + 11} ${head.y + 16} L ${head.x - 9} ${head.y + 14} L ${head.x - 19} ${head.y + 5} Z`,
          phase === 1 ? 1 : 0.65,
          'muted',
          2,
          0.95,
        ),
        x: head.x,
        y: head.y,
        radius: 20,
      },
      path(
        `M ${head.x - 13} ${head.y - 4} L ${head.x + 2} ${head.y + 1} L ${head.x + 10} ${head.y - 15} M ${head.x + 2} ${head.y + 1} L ${head.x + 11} ${head.y + 16}`,
        phase === 1 ? 0.95 : 0.62,
        'signal',
        2,
      ),
      path(
        'M 474 402 L 465 391 L 476 396 M 477 437 L 464 446 L 481 443',
        firstImpact * 0.9,
        'signal',
        2,
      ),
      path(
        'M 133 586 L 144 578 L 138 594 M 129 627 L 141 637 L 135 619',
        secondImpact * 0.9,
        'signal',
        2,
      ),
    ];
  }
  if (mode === 'homing') {
    const lockedTarget = { x: 400, y: 650 };
    const control = { x: 500, y: 350 };
    const emitter = { x: boss.x + 38, y: boss.y + 10 };
    const cutoff = 0.72;
    const trackedProgress = clamp(action / cutoff);
    const trackedHead = quadraticPoint(emitter, control, lockedTarget, trackedProgress);
    const overshoot = clamp((action - cutoff) / (1 - cutoff));
    const head = {
      x: trackedHead.x - overshoot * 62,
      y: trackedHead.y + overshoot * 178,
    };
    const trailControl = {
      x: mix(emitter.x, control.x, trackedProgress),
      y: mix(emitter.y, control.y, trackedProgress),
    };
    const tangent =
      action < cutoff
        ? {
            x:
              2 * (1 - trackedProgress) * (control.x - emitter.x) +
              2 * trackedProgress * (lockedTarget.x - control.x),
            y:
              2 * (1 - trackedProgress) * (control.y - emitter.y) +
              2 * trackedProgress * (lockedTarget.y - control.y),
          }
        : { x: -62, y: 178 };
    const heading = Math.atan2(tangent.y, tangent.x);
    const forward = { x: Math.cos(heading), y: Math.sin(heading) };
    const side = { x: -forward.y, y: forward.x };
    const tip = (along, across) =>
      `${head.x + forward.x * along + side.x * across} ${head.y + forward.y * along + side.y * across}`;
    return [
      path(
        `M ${emitter.x} ${emitter.y} Q ${trailControl.x} ${trailControl.y} ${trackedHead.x} ${trackedHead.y}${overshoot ? ` L ${head.x} ${head.y}` : ''}`,
        phase === 1 ? 0.38 : 0,
        'accent',
        3,
      ),
      {
        ...path(
          `M ${tip(22, 0)} L ${tip(3, -12)} L ${tip(-13, -10)} L ${tip(-19, 2)} L ${tip(-8, 12)} L ${tip(6, 10)} Z`,
          phase === 0 ? 0.68 + prepare * 0.28 : active,
          'muted',
          2,
          0.94,
        ),
        x: head.x,
        y: head.y,
        radius: 22,
      },
      path(
        `M ${tip(22, 0)} L ${tip(0, -2)} L ${tip(-8, 12)} M ${tip(0, -2)} L ${tip(-13, -10)}`,
        phase === 0 ? 0.72 : active,
        'signal',
        2,
      ),
    ];
  }
  if (mode === 'beam') {
    const emitter = { x: boss.x + 41, y: boss.y + 8 };
    const beamOpacity = phase === 1 ? 1 : 0;
    const stream = Array.from({ length: 7 }, (_, index) => {
      const flow = (action * 1.25 + index / 7) % 1;
      const y = mix(emitter.y + 55, 884, flow);
      const x = emitter.x + [-9, 12, -4, 9, -13, 3, 14][index];
      const width = 7 + (index % 3) * 3;
      return path(
        `M ${x} ${y - 21} L ${x + width} ${y - 5} L ${x + 3} ${y + 20} L ${x - width} ${y + 5} Z`,
        beamOpacity * 0.78,
        index % 3 === 0 ? 'signal' : 'muted',
        1,
        0.82,
      );
    });
    return [
      line(
        emitter.x,
        emitter.y,
        emitter.x,
        900,
        phase === 0 ? 0.16 + prepare * 0.16 : 0,
        'accent',
        72,
      ),
      line(emitter.x, emitter.y, emitter.x, 900, beamOpacity * 0.54, 'signal', 72),
      line(emitter.x, emitter.y, emitter.x, 900, beamOpacity * 0.86, 'accent', 22),
      ...stream,
      path(
        `M ${emitter.x - 17} ${emitter.y - 12} L ${emitter.x + 2} ${emitter.y - 20} L ${emitter.x + 19} ${emitter.y - 4} L ${emitter.x + 8} ${emitter.y + 18} L ${emitter.x - 12} ${emitter.y + 13} Z`,
        phase === 2 ? 0.3 * (1 - recover) : 0.6 + prepare * 0.28,
        'muted',
        2,
        0.92,
      ),
      path(
        `M ${emitter.x + 2} ${emitter.y - 14} L ${emitter.x + 11} ${emitter.y - 2} L ${emitter.x + 3} ${emitter.y + 13} L ${emitter.x - 7} ${emitter.y + 2} Z`,
        phase === 2 ? 0.24 * (1 - recover) : 0.52 + prepare * 0.4,
        'accent',
        2,
        0.84,
      ),
    ];
  }
  if (mode === 'scanning') {
    const angle = mix(0.85, 2.3, action);
    const end = polar(boss, 720, angle);
    const previewEnd = polar(boss, 720, 0.85);
    const beamOpacity = phase === 0 ? 0 : phase === 1 ? 0.52 : 0.52 * (1 - recover);
    const forward = { x: Math.cos(angle), y: Math.sin(angle) };
    const side = { x: -forward.y, y: forward.x };
    const shards = Array.from({ length: 7 }, (_, index) => {
      const travel = (action * 1.15 + index / 7) % 1;
      const distance = mix(75, 700, travel);
      const center = polar(boss, distance, angle);
      const at = (along, across) =>
        `${center.x + forward.x * along + side.x * across} ${center.y + forward.y * along + side.y * across}`;
      return path(
        `M ${at(17, 0)} L ${at(2, -9)} L ${at(-15, -6)} L ${at(-10, 9)} L ${at(4, 7)} Z`,
        beamOpacity * 0.86,
        'muted',
        1.5,
        0.86,
      );
    });
    return [
      line(
        boss.x,
        boss.y,
        previewEnd.x,
        previewEnd.y,
        phase === 0 ? 0.16 + prepare * 0.2 : 0,
        'accent',
        4,
      ),
      line(boss.x, boss.y, end.x, end.y, beamOpacity, 'signal', 48),
      line(boss.x, boss.y, end.x, end.y, beamOpacity * 0.92, 'accent', 10),
      ...shards,
      path(
        `M ${boss.x - 16} ${boss.y - 6} L ${boss.x - 5} ${boss.y - 16} L ${boss.x + 10} ${boss.y - 10} L ${boss.x + 17} ${boss.y + 5} L ${boss.x + 4} ${boss.y + 15} L ${boss.x - 15} ${boss.y + 7} Z`,
        phase === 2 ? 0.4 * (1 - recover) : 0.7 + prepare * 0.22,
        'muted',
        2,
        0.83,
      ),
      path(
        `M ${boss.x} ${boss.y - 9} L ${boss.x + 9} ${boss.y} L ${boss.x} ${boss.y + 9} L ${boss.x - 9} ${boss.y} Z`,
        phase === 2 ? 0.35 * (1 - recover) : 0.72 + prepare * 0.23,
        'accent',
        2,
        0.86,
      ),
    ];
  }
  if (mode === 'rotating') {
    const arms = Array.from({ length: 3 }, (_, index) => {
      const angle = action * Math.PI * 1.25 + (index * Math.PI * 2) / 3;
      const end = polar(boss, 430, angle);
      const forward = { x: Math.cos(angle), y: Math.sin(angle) };
      const side = { x: -forward.y, y: forward.x };
      const shards = Array.from({ length: 4 }, (_, piece) => {
        const flow = (action * 1.1 + piece / 4) % 1;
        const center = polar(boss, 70 + flow * 345, angle);
        const at = (along, across) =>
          `${center.x + forward.x * along + side.x * across} ${center.y + forward.y * along + side.y * across}`;
        return path(
          `M ${at(16, 0)} L ${at(4, -8)} L ${at(-13, -6)} L ${at(-9, 8)} L ${at(3, 7)} Z`,
          phase === 1 ? 0.78 : 0,
          'muted',
          1.5,
          0.84,
        );
      });
      return { end, shards };
    });
    const halo = phase === 0 ? 0.17 + prepare * 0.18 : phase === 1 ? 0.56 : 0.56 * (1 - recover);
    const core = phase === 1 ? 0.9 : 0;
    return [
      ...arms.map(({ end }) =>
        line(boss.x, boss.y, end.x, end.y, halo, 'signal', phase === 0 ? 4 : 28),
      ),
      ...arms.map(({ end }) => line(boss.x, boss.y, end.x, end.y, core, 'accent', 7)),
      ...arms.flatMap(({ shards }) => shards),
      path(
        `M ${boss.x - 18} ${boss.y - 5} L ${boss.x - 7} ${boss.y - 17} L ${boss.x + 9} ${boss.y - 15} L ${boss.x + 19} ${boss.y + 3} L ${boss.x + 4} ${boss.y + 18} L ${boss.x - 16} ${boss.y + 8} Z`,
        phase === 2 ? 0.4 * (1 - recover) : 0.72 + prepare * 0.2,
        'muted',
        2,
        0.85,
      ),
      path(
        `M ${boss.x} ${boss.y - 10} L ${boss.x + 11} ${boss.y} L ${boss.x} ${boss.y + 10} L ${boss.x - 11} ${boss.y} Z`,
        phase === 2 ? 0.36 * (1 - recover) : 0.75 + prepare * 0.2,
        'accent',
        2,
        0.88,
      ),
    ];
  }
  if (mode === 'marked') {
    const mark = point(spec.mark);
    const release = BLUEPRINT_PHASE_ENDS[0];
    const flight = smooth((frame.time - release) / (spec.impact[0] - release));
    const thrown = {
      x: mix(boss.x + 57, mark.x, flight),
      y: mix(boss.y + 4, mark.y, flight) - Math.sin(flight * Math.PI) * 72,
    };
    const burst =
      smooth((frame.time - spec.impact[0]) / 0.14) *
      (1 - smooth((frame.time - spec.impact[1]) / 0.18));
    const ringOpacity =
      phase === 0
        ? 0.38 + prepare * 0.4
        : frame.time < spec.impact[0]
          ? 0.78
          : frame.dangerActive
            ? 0.96
            : 0.52 * (1 - smooth((frame.time - spec.impact[1]) / 0.38));
    const shard = (x, y) => `${thrown.x + x} ${thrown.y + y}`;
    const stone = (x, height) => `${mark.x + x} ${mark.y + 10 - height * burst}`;
    const chip = (x, y) => `${mark.x + x * burst} ${mark.y + y * burst}`;
    return [
      circle(
        mark.x,
        mark.y,
        spec.radius,
        ringOpacity,
        frame.dangerActive ? 'signal' : 'accent',
        frame.dangerActive ? 5 : 3,
        frame.dangerActive ? 0.16 : 0.04,
      ),
      {
        ...path(
          `M ${shard(0, -19)} L ${shard(15, -2)} L ${shard(5, 16)} L ${shard(-15, 6)} L ${shard(-11, -9)} Z`,
          frame.time < spec.impact[0] ? 0.62 + prepare * 0.34 : 0,
          'muted',
          2,
          0.9,
        ),
        x: thrown.x,
        y: thrown.y,
      },
      path(
        `M ${shard(0, -14)} L ${shard(7, 0)} L ${shard(0, 11)} M ${shard(-9, 4)} L ${shard(7, 0)}`,
        frame.time < spec.impact[0] ? 0.6 + prepare * 0.3 : 0,
        'signal',
        2,
      ),
      path(
        `M ${mark.x - 44} ${mark.y + 5} L ${mark.x - 16} ${mark.y - 6} L ${mark.x + 4} ${mark.y + 6} L ${mark.x + 37} ${mark.y - 5} M ${mark.x - 13} ${mark.y - 4} L ${mark.x - 2} ${mark.y - 29} M ${mark.x + 7} ${mark.y + 6} L ${mark.x + 19} ${mark.y + 29}`,
        burst * 0.74,
        'muted',
        4,
      ),
      path(
        `M ${stone(-23, 0)} L ${stone(-14, 29)} L ${stone(-6, 27)} L ${stone(2, 59)} L ${stone(15, 42)} L ${stone(20, 0)} Z M ${chip(-46, -12)} L ${chip(-37, -30)} L ${chip(-25, -20)} L ${chip(-32, -3)} Z M ${chip(24, 15)} L ${chip(40, -6)} L ${chip(48, 7)} L ${chip(38, 24)} Z M ${chip(13, -33)} L ${chip(24, -51)} L ${chip(32, -37)} L ${chip(27, -26)} Z M ${chip(-14, 28)} L ${chip(-3, 16)} L ${chip(8, 30)} Z`,
        burst,
        'muted',
        3,
        0.94,
      ),
      path(
        `M ${stone(-15, 4)} L ${stone(2, 50)} L ${stone(13, 11)} M ${chip(-42, -12)} L ${chip(-36, -24)} M ${chip(28, 13)} L ${chip(40, -1)}`,
        burst * 0.9,
        'signal',
        3,
      ),
    ];
  }
  if (mode === 'shockwave') {
    const origin = { x: boss.x, y: boss.y + 30 };
    const radius = mix(50, 440, action);
    return [
      circle(origin.x, origin.y, radius, active * 0.17, 'signal', 24),
      ...Array.from({ length: 48 }, (_, index) => {
        const angle = (index * Math.PI * 2) / 48 + (((index * 17) % 11) - 5) * 0.008;
        const reach = radius + [-12, 3, 10, -5, 8, -9, 1][index % 7];
        const center = polar(origin, reach, angle);
        const radial = { x: Math.cos(angle), y: Math.sin(angle) };
        const tangent = { x: -Math.sin(angle), y: Math.cos(angle) };
        const size = [0.64, 1.24, 0.88, 1.36, 0.73, 1.06][index % 6];
        const at = (along, across) =>
          `${center.x + radial.x * along * size + tangent.x * across * size} ${center.y + radial.y * along * size + tangent.y * across * size}`;
        return path(
          `M ${at(15, 0)} L ${at(3, -10)} L ${at(-11, -7)} L ${at(-14, 4)} L ${at(0, 11)} Z`,
          active * 0.88,
          'muted',
          1.5,
          0.86,
        );
      }),
    ];
  }
  if (mode === 'lingering') {
    const center = { x: 360, y: 620 };
    const thrown = smooth(frame.time / 0.74);
    const landed = smooth((frame.time - 0.56) / 0.3);
    const radius = mix(23, 105, phase === 0 ? smooth((frame.time - 0.62) / 0.98) : 1);
    const opacity = (phase === 2 ? 1 - recover : phase === 1 ? 1 : 0.5 + prepare * 0.3) * landed;
    const outline = Array.from({ length: 14 }, (_, index) => {
      const angle = (index * Math.PI * 2) / 14;
      const reach = radius * [0.94, 0.88, 1, 0.91, 0.97, 0.86, 0.99][index % 7];
      const vertex = polar(center, reach, angle);
      return `${index ? 'L' : 'M'} ${vertex.x} ${vertex.y}`;
    }).join(' ');
    const crack = (x, y) => `${center.x + (x * radius) / 105} ${center.y + (y * radius) / 105}`;
    const source = { x: boss.x + 38, y: boss.y + 10 };
    const seed = {
      x: mix(source.x, center.x, thrown),
      y: mix(source.y, center.y, thrown) - Math.sin(thrown * Math.PI) * 68,
    };
    return [
      {
        ...path(`${outline} Z`, opacity, 'signal', 3, phase === 1 ? 0.18 : 0.07),
        x: center.x,
        y: center.y,
        radius,
      },
      path(
        `M ${crack(-75, -10)} L ${crack(-40, -23)} L ${crack(-16, 3)} L ${crack(7, -6)} L ${crack(28, 7)} L ${crack(66, -23)} M ${crack(-16, 3)} L ${crack(-34, 42)} L ${crack(-16, 57)} M ${crack(28, 7)} L ${crack(17, 38)} L ${crack(43, 58)}`,
        opacity * 0.92,
        'signal',
        3.5,
      ),
      ...[
        [-62, -34, 31, -7],
        [48, -47, 24, 6],
        [-47, 39, 19, -4],
        [68, 25, 33, 9],
      ].map(([offsetX, offsetY, rise, lean]) => {
        const x = center.x + (offsetX * radius) / 105;
        const y = center.y + (offsetY * radius) / 105;
        const height = rise * (phase === 0 ? landed : 1);
        return path(
          `M ${x - 12} ${y + 9} L ${x + lean - 4} ${y - height} L ${x + 4} ${y - height * 0.48} L ${x + 14} ${y + 7} Z`,
          opacity * 0.88,
          'muted',
          2,
          0.82,
        );
      }),
      path(
        `M ${seed.x - 12} ${seed.y - 6} L ${seed.x + 4} ${seed.y - 17} L ${seed.x + 15} ${seed.y + 7} L ${seed.x - 2} ${seed.y + 16} Z`,
        frame.time < 0.75 ? 0.9 : 0,
        'muted',
        2,
        0.9,
      ),
    ];
  }
  if (mode === 'trail') {
    const trailPoints = [
      [190, 290],
      [225, 350],
      [265, 415],
      [310, 475],
      [355, 540],
      [400, 600],
    ];
    const at = (x, y, index, dx, dy) => {
      const angle = index * 0.44;
      return `${x + dx * Math.cos(angle) - dy * Math.sin(angle)} ${y + dx * Math.sin(angle) + dy * Math.cos(angle)}`;
    };
    const residues = trailPoints.map(([x, y], index) => {
      const placed = clamp(action * trailPoints.length - index);
      const expiresOldestFirst = clamp(1 - recover * trailPoints.length + index);
      const opacity = phase === 0 ? 0 : phase === 1 ? placed : expiresOldestFirst;
      const outline = Array.from({ length: 9 }, (_, corner) => {
        const angle = (corner * Math.PI * 2) / 9;
        const reach = 34 * [0.96, 0.82, 1, 0.89, 0.95, 0.86, 0.98, 0.9, 0.94][(corner + index) % 9];
        return at(x, y, index, Math.cos(angle) * reach, Math.sin(angle) * reach);
      });
      return {
        ...path(`M ${outline.join(' L ')} Z`, opacity, 'signal', 2, 0.09),
        x,
        y,
        radius: 34,
      };
    });
    return [
      path('M 175 280 Q 230 410 330 500 T 410 610', 0, 'accent', 3),
      ...residues,
      ...trailPoints.map(([x, y], index) =>
        path(
          `M ${at(x, y, index, -25, -8)} L ${at(x, y, index, -9, -25)} L ${at(x, y, index, 7, -20)} L ${at(x, y, index, 25, -4)} L ${at(x, y, index, 18, 17)} L ${at(x, y, index, -12, 22)} L ${at(x, y, index, -27, 6)} Z`,
          residues[index].opacity * 0.82,
          'muted',
          2,
          0.5,
        ),
      ),
      ...trailPoints.map(([x, y], index) =>
        path(
          `M ${at(x, y, index, -19, -6)} L ${at(x, y, index, -4, -2)} L ${at(x, y, index, 5, -17)} M ${at(x, y, index, -4, -2)} L ${at(x, y, index, 4, 10)} L ${at(x, y, index, 18, 15)}`,
          residues[index].opacity * 0.86,
          'signal',
          2.5,
        ),
      ),
    ];
  }
  if (mode === 'platforms') {
    const slabs = [0, 1, 2, 3, 4].map((index) => ({
      ...rect(
        45 + index * 103,
        index === 1 ? 645 : 700,
        82,
        28,
        index === 1 || index === 2 ? (phase === 0 ? 1 : phase === 1 ? 1 - action : 0) : 1,
        index === 1 || index === 2 ? 'signal' : 'safe',
        0.84,
      ),
      width: 0,
    }));
    const falling = phase === 1 ? Math.sin(action * Math.PI) * 0.82 : 0;
    const rubble = [1, 2].map((index) => {
      const x = 45 + index * 103;
      const y = (index === 1 ? 625 : 680) + action * 96;
      return path(
        `M ${x + 5} ${y} L ${x + 32} ${y - 9} L ${x + 40} ${y + 12} Z M ${x + 46} ${y - 4} L ${x + 75} ${y + 2} L ${x + 63} ${y + 19} Z`,
        falling,
        'muted',
        0,
        0.86,
      );
    });
    return [...slabs, ...rubble];
  }
  if (mode === 'shrink') {
    const center = { x: 280, y: 500 };
    const wallRadius = phase === 2 ? mix(150, 320, recover) : mix(320, 150, action);
    const wallOpacity =
      phase === 0 ? 0.44 + prepare * 0.32 : phase === 1 ? 0.94 : 0.94 * (1 - recover);
    return [
      circle(
        center.x,
        center.y,
        wallRadius,
        phase === 0 ? active * 0.32 : 0.23 * (phase === 2 ? 1 - recover : 1),
        'signal',
        28,
      ),
      circle(
        center.x,
        center.y,
        wallRadius - 28,
        phase === 2 ? 1 - recover : active,
        'safe',
        0,
        0.035,
      ),
      ...Array.from({ length: 40 }, (_, index) => {
        const angle = (index * Math.PI * 2) / 40 + (((index * 13) % 9) - 4) * 0.007;
        const rock = polar(center, wallRadius + [-7, 4, -2, 6, -5][index % 5], angle);
        const radial = { x: Math.cos(angle), y: Math.sin(angle) };
        const tangent = { x: -Math.sin(angle), y: Math.cos(angle) };
        const size = [0.9, 1.13, 0.76, 1.2, 0.84][index % 5];
        const at = (along, across) =>
          `${rock.x + radial.x * along * size + tangent.x * across * size} ${rock.y + radial.y * along * size + tangent.y * across * size}`;
        return path(
          `M ${at(-24, 0)} L ${at(-5, -14)} L ${at(13, -11)} L ${at(20, 4)} L ${at(3, 15)} Z`,
          wallOpacity,
          'muted',
          2,
          0.82,
        );
      }),
    ];
  }
  if (mode === 'knockback') {
    const origin = { x: boss.x + 40, y: boss.y + 8 };
    const contact = point(spec.player);
    const travel = clamp(
      (frame.time - BLUEPRINT_PHASE_ENDS[0]) / (spec.hitAt - BLUEPRINT_PHASE_ENDS[0]),
    );
    const wave = {
      x: mix(origin.x, contact.x, travel),
      y: mix(origin.y, contact.y, travel),
    };
    const heading = Math.atan2(contact.y - origin.y, contact.x - origin.x);
    const forward = { x: Math.cos(heading), y: Math.sin(heading) };
    const side = { x: -forward.y, y: forward.x };
    const facet = (center, along, across) =>
      `${center.x + forward.x * along + side.x * across} ${center.y + forward.y * along + side.y * across}`;
    const waveOpacity = phase === 1 ? 1 - smooth((frame.time - spec.hitAt) / 0.22) : 0;
    const contactPulse =
      frame.time >= spec.hitAt ? 1 - smooth((frame.time - spec.hitAt) / 0.35) : 0;
    return [
      line(
        origin.x,
        origin.y,
        contact.x,
        contact.y,
        phase === 0 ? 0.22 + prepare * 0.34 : 0,
        'accent',
        3,
      ),
      path(
        `M ${origin.x - 15} ${origin.y - 12} L ${origin.x + 3} ${origin.y - 19} L ${origin.x + 18} ${origin.y - 3} L ${origin.x + 8} ${origin.y + 17} L ${origin.x - 13} ${origin.y + 11} Z`,
        phase === 2 ? 0.3 * (1 - recover) : 0.62 + prepare * 0.32,
        'muted',
        2,
        0.9,
      ),
      path(
        `M ${facet(wave, -13, -48)} L ${facet(wave, 12, -35)} L ${facet(wave, -4, -20)} L ${facet(wave, 27, -4)} L ${facet(wave, 7, 16)} L ${facet(wave, 17, 34)} L ${facet(wave, -10, 45)} L ${facet(wave, -18, 18)} L ${facet(wave, -15, -18)} Z`,
        waveOpacity * 0.86,
        'muted',
        2,
        0.88,
      ),
      ...[-23, 2, 25].map((across, index) => {
        const center = {
          x: wave.x + side.x * across - forward.x * index * 19,
          y: wave.y + side.y * across - forward.y * index * 19,
        };
        const length = 20 + index * 4;
        return path(
          `M ${facet(center, length, 0)} L ${facet(center, -5, -10)} L ${facet(center, -16, -3)} L ${facet(center, -11, 12)} L ${facet(center, 8, 7)} Z`,
          waveOpacity * (index === 1 ? 0.98 : 0.8),
          index === 1 ? 'signal' : 'muted',
          2,
          0.9,
        );
      }),
      circle(contact.x, contact.y, 43, contactPulse * 0.74, 'signal', 4),
      path(
        `M ${contact.x - 31} ${contact.y + 9} L ${contact.x - 18} ${contact.y - 10} L ${contact.x - 8} ${contact.y + 6} Z M ${contact.x + 19} ${contact.y + 14} L ${contact.x + 36} ${contact.y - 5} L ${contact.x + 42} ${contact.y + 16} Z`,
        contactPulse * 0.78,
        'muted',
        2,
        0.84,
      ),
    ];
  }
  if (mode === 'target-lock') {
    const locked = point(spec.lockPoint);
    const mark = phase === 0 ? player : locked;
    const drop = smooth((frame.time - 2.36) / (spec.impact[0] - 2.36));
    const spearY = mix(mark.y - 91, mark.y - 17, drop);
    const impact = frame.dangerActive ? 1 : 0;
    const expired = smooth((frame.time - spec.impact[1]) / 0.28);
    const acquire = smooth(frame.time / 0.24);
    const ringOpacity =
      phase === 0
        ? (0.38 + prepare * 0.36) * acquire
        : frame.time < spec.impact[0]
          ? 0.76
          : impact
            ? 0.96
            : 0.44 * (1 - expired);
    return [
      circle(
        mark.x,
        mark.y,
        phase === 0 ? mix(76, spec.radius, prepare) : spec.radius,
        ringOpacity,
        impact ? 'signal' : 'accent',
        impact ? 5 : 3,
        impact ? 0.16 : 0.04,
      ),
      line(
        boss.x + 4,
        boss.y - 20,
        mark.x,
        mark.y,
        phase === 0 ? (0.35 + prepare * 0.3) * acquire : 0,
        'accent',
        3,
      ),
      path(
        `M ${mark.x} ${spearY - 26} L ${mark.x + 15} ${spearY - 8} L ${mark.x + 9} ${spearY + 15} L ${mark.x} ${spearY + 29} L ${mark.x - 12} ${spearY - 5} Z`,
        phase === 0
          ? (0.54 + prepare * 0.42) * acquire
          : frame.time < spec.impact[1]
            ? 0.96
            : 0.72 * (1 - expired),
        'muted',
        2,
        0.92,
      ),
      path(
        `M ${mark.x} ${spearY - 21} L ${mark.x + 7} ${spearY - 5} L ${mark.x} ${spearY + 18} M ${mark.x - 7} ${spearY - 2} L ${mark.x} ${spearY + 18}`,
        phase === 0
          ? (0.5 + prepare * 0.42) * acquire
          : frame.time < spec.impact[1]
            ? 0.92
            : 0.56 * (1 - expired),
        impact ? 'signal' : 'accent',
        3,
      ),
      path(
        `M ${mark.x - 38} ${mark.y + 12} L ${mark.x - 22} ${mark.y - 5} L ${mark.x - 15} ${mark.y + 13} Z M ${mark.x + 16} ${mark.y + 10} L ${mark.x + 32} ${mark.y - 12} L ${mark.x + 39} ${mark.y + 9} Z M ${mark.x - 8} ${mark.y + 13} L ${mark.x + 3} ${mark.y - 7} L ${mark.x + 10} ${mark.y + 13} Z`,
        impact * 0.88,
        'muted',
        2,
        0.9,
      ),
    ];
  }
  if (mode === 'combo') {
    const angle =
      phase === 0
        ? mix(-0.75, -1.3, prepare)
        : phase === 1
          ? mix(-1.3, 1.05, clamp(action * 1.5))
          : mix(1.05, 0.88, recover);
    const grip = { x: boss.x + 36, y: boss.y + 17 };
    const head = polar(grip, 116, angle);
    const along = { x: Math.cos(angle), y: Math.sin(angle) };
    const across = { x: -along.y, y: along.x };
    const corner = (length, width) =>
      `${head.x + along.x * length + across.x * width} ${head.y + along.y * length + across.y * width}`;
    return [
      path(arcPath(boss, 190, -1.15, mix(-1.15, 2.1, clamp(action * 1.7))), active, 'signal', 25),
      circle(boss.x, boss.y, mix(40, 380, clamp(action * 1.7 - 0.7)), active, 'accent', 16),
      line(grip.x, grip.y, head.x, head.y, 0.92, 'muted', 11),
      path(
        `M ${corner(-17, -30)} L ${corner(17, -30)} L ${corner(17, 30)} L ${corner(-17, 30)} Z`,
        0.95,
        'accent',
        0,
        0.88,
      ),
    ];
  }
  if (mode === 'weak-point') {
    const exposed = phase === 0 ? prepare : phase === 1 ? 1 : 1 - recover;
    const crystal = { x: boss.x + 58, y: boss.y - 12 };
    const plateX = crystal.x + mix(0, 39, exposed);
    return [
      path('M 38 94 H 522 V 878 H 38 Z M 58 258 H 502 V 878 H 58 Z', 0.37, 'muted', 0, 0.56),
      path(
        'M 56 117 H 129 V 352 H 56 Z M 431 117 H 504 V 352 H 431 Z M 145 120 H 415 V 154 H 145 Z M 64 525 L 280 502 L 496 525 V 563 L 280 534 L 64 563 Z M 64 741 L 280 708 L 496 741 V 783 L 280 747 L 64 783 Z',
        0.4,
        'accent',
        0,
        0.57,
      ),
      path(
        'M 70 621 H 192 L 179 641 H 83 Z M 368 621 H 490 L 477 641 H 381 Z M 74 829 L 280 799 L 486 829 V 844 L 280 816 L 74 844 Z',
        0.33,
        'muted',
        0,
        0.74,
      ),
      path(
        `M ${crystal.x} ${crystal.y - 25} L ${crystal.x + 20} ${crystal.y} L ${crystal.x} ${crystal.y + 25} L ${crystal.x - 20} ${crystal.y} Z`,
        0.3 + exposed * 0.64,
        'safe',
        0,
        0.76,
      ),
      path(
        `M ${plateX - 22} ${crystal.y - 31} L ${plateX + 20} ${crystal.y - 25} L ${plateX + 24} ${crystal.y + 13} L ${plateX - 17} ${crystal.y + 30} Z`,
        0.82,
        'muted',
        0,
        0.84,
      ),
      line(
        player.x - 32,
        player.y - 36,
        crystal.x,
        crystal.y,
        phase === 1 ? pulse(action * 1.5) : 0,
        'accent',
        8,
      ),
    ];
  }
  if (mode === 'telegraph') {
    const [origin, left, right] = spec.cone.map(point);
    const footprint = `M ${origin.x} ${origin.y} L ${left.x} ${left.y} L ${right.x} ${right.y} Z`;
    const warning = phase === 0 ? 0.42 + prepare * 0.42 : phase === 1 ? 0.3 : 0;
    const blast = phase === 1 ? 0.84 : 0;
    const fragments = Array.from({ length: 9 }, (_, index) => {
      const elapsed = action * 1.75 - index * 0.13;
      const travel = ((elapsed % 1) + 1) % 1;
      const near = {
        x: mix(origin.x, left.x, travel),
        y: mix(origin.y, left.y, travel),
      };
      const far = {
        x: mix(origin.x, right.x, travel),
        y: mix(origin.y, right.y, travel),
      };
      const offset = [0.3, 0.68, 0.42, 0.76, 0.22, 0.58, 0.38, 0.7, 0.48][index];
      const x = mix(near.x, far.x, offset);
      const y = mix(near.y, far.y, offset);
      const size = 9 + (index % 3) * 3;
      const tip = (along, across) =>
        `${x + 0.45 * along - 0.89 * across} ${y + 0.89 * along + 0.45 * across}`;
      return path(
        `M ${tip(size * 1.55, 0)} L ${tip(-size * 0.2, -size * 0.85)} L ${tip(-size * 1.2, -size * 0.4)} L ${tip(-size * 0.7, size * 0.8)} L ${tip(size * 0.3, size * 0.45)} Z`,
        phase === 1 && elapsed >= 0 ? 0.78 : 0,
        index % 3 === 0 ? 'signal' : 'muted',
        2,
        0.88,
      );
    });
    return [
      path(
        `M ${origin.x - 10} ${origin.y - 11} L ${origin.x + 8} ${origin.y - 13} L ${origin.x + 17} ${origin.y + 2} L ${origin.x + 2} ${origin.y + 15} L ${origin.x - 11} ${origin.y + 6} Z`,
        phase === 2 ? 0.28 * (1 - recover) : 0.65 + prepare * 0.28,
        'accent',
        2,
        0.7,
      ),
      path(footprint, warning, 'accent', 3, phase === 0 ? 0.08 : 0),
      path(footprint, blast, 'signal', 3, phase === 1 ? 0.18 : 0),
      ...fragments,
    ];
  }
  if (mode === 'phase') {
    const changed = phase === 0 ? prepare * 0.3 : phase === 1 ? 1 : 1 - recover * 0.65;
    const gateTop = mix(680, 650, changed);
    return [
      path(
        'M 38 94 H 522 V 878 H 38 Z M 62 120 H 498 V 637 H 62 Z M 62 713 H 498 V 878 H 62 Z',
        0.38,
        'muted',
        0,
        0.56,
      ),
      path(
        'M 62 120 H 112 V 636 H 62 Z M 448 120 H 498 V 636 H 448 Z M 112 120 H 448 V 155 H 112 Z M 64 722 L 280 700 L 496 722 V 878 H 64 Z',
        0.4,
        'accent',
        0,
        0.48,
      ),
      path(
        'M 118 175 H 442 V 182 H 118 Z M 112 522 H 448 V 532 H 112 Z M 80 777 L 280 756 L 480 777 V 786 L 280 765 L 80 786 Z',
        0.38,
        'muted',
        0,
        0.66,
      ),
      path(
        `M 54 ${gateTop} H 506 V 710 H 54 Z M 63 ${gateTop + 5} H 497 V ${gateTop + 11} H 63 Z`,
        0.28 + changed * 0.64,
        'signal',
        0,
        0.72,
      ),
      path(
        'M 164 211 L 180 235 L 164 259 L 148 235 Z M 396 211 L 412 235 L 396 259 L 380 235 Z M 280 162 L 310 194 L 280 226 L 250 194 Z',
        0.18 + changed * 0.55,
        'signal',
        0,
        0.7,
      ),
      path(
        `M ${boss.x} ${boss.y - 33} L ${boss.x + 23} ${boss.y} L ${boss.x} ${boss.y + 32} L ${boss.x - 23} ${boss.y} Z`,
        0.13 + changed * 0.72,
        'signal',
        0,
        0.78,
      ),
      path(
        'M 338 753 L 365 728 L 392 753 L 365 778 Z M 355 752 L 365 741 L 375 752 L 365 763 Z',
        0.25 + changed * 0.42,
        'safe',
        0,
        0.46,
      ),
    ];
  }
  const enragedState = phase === 0 ? 0.3 + prepare * 0.7 : 1;
  const enragedAttack = phase === 1 ? 1 : 0;
  return [
    path(
      'M 40 94 L 520 94 L 520 878 L 40 878 Z M 59 702 L 502 702 L 514 870 L 47 870 Z',
      0.38,
      'muted',
      0,
      0.52,
    ),
    path(
      'M 60 126 L 134 126 L 140 554 L 58 554 Z M 426 126 L 500 126 L 502 554 L 420 554 Z M 150 129 L 410 129 L 386 157 L 174 157 Z M 70 750 L 226 717 L 257 782 L 65 820 Z M 265 782 L 341 716 L 496 749 L 506 820 Z',
      0.42,
      'accent',
      0,
      0.58,
    ),
    path(
      `M ${boss.x - 86} ${boss.y - 10} L ${boss.x - 106} ${boss.y - 74} L ${boss.x - 56} ${boss.y - 49} Z M ${boss.x + 86} ${boss.y - 10} L ${boss.x + 106} ${boss.y - 74} L ${boss.x + 56} ${boss.y - 49} Z M ${boss.x - 32} ${boss.y + 52} L ${boss.x - 3} ${boss.y + 98} L ${boss.x + 16} ${boss.y + 53} Z`,
      enragedState,
      'signal',
      0,
      0.78,
    ),
    path(
      `M ${boss.x} ${boss.y - 31} L ${boss.x + 24} ${boss.y} L ${boss.x} ${boss.y + 30} L ${boss.x - 24} ${boss.y} Z`,
      enragedState,
      'signal',
      0,
      0.82,
    ),
    ...projectileLines(boss, 5, 1, mix(150, 610, action), enragedAttack, action * 0.8).map(
      (projectile) => ({ ...projectile, width: 5 }),
    ),
  ];
}

export function blueprintPhaseAt(time) {
  const value = localTime(time);
  return value < BLUEPRINT_PHASE_ENDS[0] ? 0 : value < BLUEPRINT_PHASE_ENDS[1] ? 1 : 2;
}

export function blueprintSpec(id) {
  const spec = SPECS[id];
  if (!spec) throw new Error(`Unknown blueprint mechanic: ${id}`);
  return Object.freeze({ id, ...spec });
}

function pointClearsThreat(spec, frame, value, radius = BLUEPRINT_PLAYER_RADIUS) {
  if (!frame.dangerActive) return true;
  const distanceFromBoss = Math.hypot(value.x - frame.boss.x, value.y - frame.boss.y);
  const { mode } = spec;
  if (mode === 'landing') {
    const landing = point(spec.landing);
    return Math.hypot(value.x - landing.x, value.y - landing.y) > 88 + radius;
  }
  if (mode === 'single-shot') {
    const projectile = frame.primitives[2];
    return Math.hypot(value.x - projectile.x, value.y - projectile.y) > projectile.radius + radius;
  }
  if (mode === 'arc') return distanceFromBoss > SWEEP_OUTER_RADIUS + radius;
  if (mode === 'lunge')
    return distanceToSegment(value, point(spec.boss), point(spec.lungeEnd)) > 27 + radius;
  if (mode === 'grab') {
    const hand = frame.primitives[1];
    return Math.hypot(value.x - hand.x, value.y - hand.y) > hand.radius + radius;
  }
  if (mode === 'burrow') return Math.hypot(value.x - 420, value.y - 590) > 78 + radius;
  if (mode === 'ring')
    return frame.primitives
      .filter((projectile) => projectile.opacity > 0 && projectile.radius > 0)
      .every(
        (projectile) =>
          Math.hypot(value.x - projectile.x, value.y - projectile.y) > projectile.radius + radius,
      );
  if (mode === 'crossfire')
    return frame.primitives
      .filter((projectile) => projectile.radius > 0)
      .every(
        (projectile) =>
          Math.hypot(value.x - projectile.x, value.y - projectile.y) > projectile.radius + radius,
      );
  if (mode === 'splitting-projectile')
    return frame.primitives
      .filter((projectile) => projectile.radius > 0 && projectile.opacity > 0.15)
      .every(
        (projectile) =>
          Math.hypot(value.x - projectile.x, value.y - projectile.y) > projectile.radius + radius,
      );
  if (mode === 'returning-projectile') {
    const projectile = frame.primitives[0];
    return Math.hypot(value.x - projectile.x, value.y - projectile.y) > projectile.radius + radius;
  }
  if (mode === 'orbiting-projectiles')
    return frame.primitives
      .filter((projectile) => projectile.radius > 0)
      .every(
        (projectile) =>
          Math.hypot(value.x - projectile.x, value.y - projectile.y) > projectile.radius + radius,
      );
  if (mode === 'pulse-beam')
    return distanceToSegment(value, point(spec.beamStart), point(spec.beamEnd)) > 17 + radius;
  if (mode === 'chain-explosions') {
    const activeIndex = frame.phase === 1 ? chainExplosionIndex(frame.action) : -1;
    if (activeIndex < 0) return true;
    const blast = point(spec.blastCenters[activeIndex]);
    return Math.hypot(value.x - blast.x, value.y - blast.y) > spec.blastRadius + radius;
  }
  if (mode === 'mine') {
    const mine = point(spec.mine);
    return Math.hypot(value.x - mine.x, value.y - mine.y) > spec.triggerRadius + radius;
  }
  if (mode === 'moving-hazard') {
    const hazard = frame.primitives[1];
    return Math.hypot(value.x - hazard.x, value.y - hazard.y) > hazard.radius + radius;
  }
  if (mode === 'converging-threats')
    return frame.primitives
      .slice(0, 2)
      .every(
        (threat) =>
          value.x + radius <= threat.x ||
          value.x - radius >= threat.x + threat.rectWidth ||
          value.y + radius <= threat.y ||
          value.y - radius >= threat.y + threat.rectHeight,
      );
  if (mode === 'pull')
    return Math.hypot(value.x - frame.boss.x, value.y - frame.boss.y) > spec.dangerRadius + radius;
  if (mode === 'turret-deployment')
    return (
      distanceToSegment(value, { x: spec.turret[0], y: spec.turret[1] + 61 }, point(spec.beamEnd)) >
      spec.beamHalfWidth + radius
    );
  if (mode === 'threat-generator')
    return generatorShots(spec, frame.time).every(
      (shot) =>
        !shot.active || Math.hypot(value.x - shot.x, value.y - shot.y) > shot.radius + radius,
    );
  if (mode === 'decoy')
    return (
      frame.phase !== 1 ||
      Math.hypot(value.x - frame.boss.x, value.y - frame.boss.y) > spec.contactRadius + radius
    );
  if (mode === 'predictive-aim') {
    const shot = frame.primitives[3];
    return (
      !frame.dangerActive ||
      Math.hypot(value.x - shot.x, value.y - shot.y) > spec.shotRadius + radius
    );
  }
  if (mode === 'source-track') {
    const beam = frame.primitives[3];
    return (
      distanceToSegment(value, { x: beam.x1, y: beam.y1 }, { x: beam.x2, y: beam.y2 }) >
      spec.beamHalfWidth + radius
    );
  }
  if (mode === 'burst-fire')
    return frame.primitives
      .slice(2, 5)
      .every(
        (shot) =>
          shot.opacity === 0 ||
          Math.hypot(value.x - shot.x, value.y - shot.y) > shot.radius + radius,
      );
  if (mode === 'volley')
    return frame.primitives
      .slice(7, 10)
      .every(
        (shot) =>
          shot.opacity === 0 ||
          Math.hypot(value.x - shot.x, value.y - shot.y) > shot.radius + radius,
      );
  if (mode === 'delayed-activation')
    return Math.hypot(value.x - spec.rune[0], value.y - spec.rune[1]) > spec.radius + radius;
  if (mode === 'speed-change') return distanceFromBoss > spec.collisionRadius + radius;
  if (mode === 'limited-spread')
    return limitedSpreadShots(spec, frame.time).every(
      (shot) =>
        !shot.active || Math.hypot(value.x - shot.x, value.y - shot.y) > shot.radius + radius,
    );
  if (mode === 'directional-shield') return true;
  if (mode === 'damage-type-resistance') return true;
  if (mode === 'situational-immunity') return true;
  if (mode === 'part-break')
    return (
      distanceToSegment(
        value,
        { x: spec.launcher[0] + 28, y: spec.launcher[1] },
        point(spec.shotEnd),
      ) >
      spec.beamHalfWidth + radius
    );
  if (mode === 'attack-reflection') {
    const shot = frame.primitives[9];
    return Math.hypot(value.x - shot.x, value.y - shot.y) > spec.boltRadius + radius;
  }
  if (mode === 'counter-stance')
    return (
      distanceToSegment(value, point(spec.counterStart), point(spec.counterEnd)) >
      spec.counterHalfWidth + radius
    );
  if (mode === 'absorption-power-up')
    return (
      Math.hypot(value.x - frame.boss.x, value.y - frame.boss.y) > spec.shockwaveRadius + radius
    );
  if (mode === 'interruptible-wind-up')
    return (
      !frame.dangerActive ||
      Math.hypot(value.x - frame.boss.x, value.y - frame.boss.y) > spec.threatRadius + radius
    );
  if (mode === 'loadout-adaptation') {
    if (frame.reachDanger)
      return (
        distanceToSegment(value, { x: frame.boss.x + 38, y: frame.boss.y }, point(spec.reachEnd)) >
        spec.reachHalfWidth + radius
      );
    if (frame.burstDanger)
      return Math.hypot(value.x - frame.boss.x, value.y - frame.boss.y) > spec.burstRadius + radius;
    return true;
  }
  if (mode === 'wind-up')
    return (
      !frame.dangerActive ||
      distanceToSegment(value, { x: frame.boss.x + 38, y: frame.boss.y }, point(spec.laneEnd)) >
        spec.laneHalfWidth + radius
    );
  if (mode === 'attack-lock')
    return (
      !frame.dangerActive ||
      distanceToSegment(value, { x: frame.boss.x + 43, y: frame.boss.y + 8 }, frame.attackLockEnd) >
        spec.laneHalfWidth + radius
    );
  if (mode === 'active-phase')
    return (
      !frame.dangerActive ||
      value.x + radius < spec.laneStart[0] ||
      value.x - radius > spec.laneEnd[0] ||
      value.y + radius < spec.laneStart[1] - spec.laneHalfWidth ||
      value.y - radius > spec.laneStart[1] + spec.laneHalfWidth
    );
  if (mode === 'recovery')
    return (
      !frame.dangerActive ||
      value.x + radius < spec.laneStart[0] ||
      value.x - radius > spec.laneEnd[0] ||
      value.y + radius < spec.laneStart[1] - spec.laneHalfWidth ||
      value.y - radius > spec.laneStart[1] + spec.laneHalfWidth
    );
  if (mode === 'survival-phase') {
    const activeHazard = spec.hazards.find(
      ({ active }) => frame.time >= active[0] && frame.time < active[1],
    );
    if (!activeHazard) return true;
    const center = point(activeHazard.center);
    return Math.hypot(value.x - center.x, value.y - center.y) > spec.hazardRadius + radius;
  }
  if (mode === 'teleport')
    return (
      !frame.dangerActive ||
      distanceToSegment(value, point(spec.laneStart), point(spec.laneEnd)) >
        spec.laneHalfWidth + radius
    );
  if (mode === 'boundary-attack')
    return (
      !frame.dangerActive ||
      distanceToSegment(value, point(spec.laneStart), point(spec.laneEnd)) >
        spec.laneHalfWidth + radius
    );
  if (mode === 'forced-scrolling') return !frame.dangerActive || value.y + radius < spec.hazardTop;
  if (mode === 'chase-herding') return true;
  if (mode === 'escape-phase') return true;
  if (mode === 'relocated-arena') return true;
  if (mode === 'control-mode-shift')
    return !frame.dangerActive || value.y + radius < spec.waveStart[1] - 18;
  if (mode === 'boss-as-terrain') return !frame.dangerActive || frame.bossAsTerrainHolding;
  if (mode === 'cover-line-of-sight')
    return !frame.dangerActive || coverLineOfSightBlocked(frame.time, value, radius);
  if (mode === 'forced-inertia') return !frame.dangerActive || value.x + radius < spec.dangerX;
  if (mode === 'wraparound-projectile')
    return frame.wraparoundProjectilePoints.every(
      (projectile) =>
        Math.hypot(value.x - projectile.x, value.y - projectile.y) > spec.projectileRadius + radius,
    );
  if (mode === 'beat-synced-attack') {
    if (!frame.dangerActive || frame.beatSyncedAttackLane < 0) return true;
    const laneCenter = spec.lanes[frame.beatSyncedAttackLane];
    return (
      value.y + radius < spec.laneTop ||
      value.y - radius > spec.laneBottom ||
      Math.abs(value.x - laneCenter) > spec.laneHalfWidth + radius
    );
  }
  if (mode === 'secondary-cues-invisibility')
    return (
      !frame.dangerActive ||
      distanceToSegment(value, point(spec.hiddenRoute.at(-1)), point(spec.laneEnd)) >
        spec.laneHalfWidth + radius
    );
  if (mode === 'sound-detection')
    return (
      !frame.dangerActive ||
      Math.hypot(value.x - spec.soundPoint[0], value.y - spec.soundPoint[1]) >
        spec.dangerRadius + radius
    );
  if (mode === 'objective-linked-invulnerability') return true;
  if (mode === 'wave-clear-objective') return true;
  if (mode === 'environmental-weapon') return true;
  if (mode === 'encounter-specific-tool') return true;
  if (mode === 'baited-self-hit')
    return (
      !frame.dangerActive ||
      distanceToSegment(value, point(spec.boss), point(spec.laneEnd)) > spec.laneHalfWidth + radius
    );
  if (mode === 'posture-stagger-gauge') return true;
  if (mode === 'pacifist-resolution')
    return (
      !frame.dangerActive ||
      value.y + radius < spec.laneTop ||
      value.y - radius > spec.laneBottom ||
      Math.abs(value.x - spec.attacks[frame.pacifistAttackIndex].laneX) >
        spec.laneHalfWidth + radius
    );
  if (mode === 'persistent-progress')
    return (
      !frame.dangerActive ||
      distanceToSegment(value, point(spec.laneStart), point(spec.laneEnd)) >
        spec.laneHalfWidth + radius
    );
  if (mode === 'status-buildup')
    return (
      !frame.dangerActive ||
      Math.hypot(value.x - frame.boss.x, value.y - frame.boss.y) > spec.auraRadius + radius
    );
  if (mode === 'instant-kill')
    return (
      !frame.dangerActive ||
      Math.hypot(value.x - spec.executionCenter[0], value.y - spec.executionCenter[1]) >
        spec.executionRadius + radius
    );
  if (mode === 'maximum-health-reduction')
    return (
      !frame.dangerActive ||
      distanceToSegment(value, point(spec.boss), point(spec.attackEnd)) >
        spec.laneHalfWidth + radius
    );
  if (mode === 'ability-lock')
    return (
      !frame.dangerActive ||
      Math.hypot(value.x - spec.sealCenter[0], value.y - spec.sealCenter[1]) >
        spec.sealRadius + radius
    );
  if (mode === 'resource-steal')
    return (
      !frame.dangerActive ||
      Math.hypot(value.x - spec.stealCenter[0], value.y - spec.stealCenter[1]) >
        spec.stealRadius + radius
    );
  if (mode === 'on-hit-healing')
    return (
      !frame.dangerActive ||
      Math.hypot(value.x - spec.strikeCenter[0], value.y - spec.strikeCenter[1]) >
        spec.strikeRadius + radius
    );
  if (mode === 'self-heal-cast') return true;
  if (mode === 'external-healing-source') return true;
  if (mode === 'damage-rate-cap') return true;
  if (mode === 'loadout-mirror') return true;
  if (mode === 'moveset-shapeshifting') return true;
  if (mode === 'ally-theft')
    return (
      !frame.dangerActive ||
      frame.allyTheftProjectiles.every(
        (projectile) =>
          Math.hypot(value.x - projectile.x, value.y - projectile.y) >
          spec.projectileRadius + radius,
      )
    );
  if (mode === 'false-death')
    return (
      !frame.dangerActive ||
      Math.hypot(value.x - frame.boss.x, value.y - frame.boss.y) > spec.attackRadius + radius
    );
  if (mode === 'action-reactive-punish')
    return (
      !frame.actionReactivePunishProjectileActive ||
      Math.hypot(
        value.x - frame.actionReactivePunishProjectile.x,
        value.y - frame.actionReactivePunishProjectile.y,
      ) >
        spec.projectileRadius + radius
    );
  if (mode === 'run-history-manifestation') {
    const inWard =
      Math.hypot(value.x - spec.ward[0], value.y - spec.ward[1]) <= spec.wardRadius - radius;
    if (inWard) return true;
    if (frame.runHistoryManifestationEchoActive)
      return (
        Math.hypot(
          value.x - frame.runHistoryManifestationProjectile.x,
          value.y - frame.runHistoryManifestationProjectile.y,
        ) >
        spec.projectileRadius + radius
      );
    if (frame.runHistoryManifestationRelicActive)
      return (
        Math.abs(Math.hypot(value.x - frame.boss.x, value.y - frame.boss.y) - spec.relicRadius) >
        12 + radius
      );
    return true;
  }
  if (mode === 'partner-revival') return true;
  if (mode === 'stack-damage') {
    if (!frame.stackDamageHitActive) return true;
    const ledger = stackDamageResolve({
      encounterId: spec.encounterId,
      hitId: frame.stackDamageSecondHit ? spec.secondHitId : spec.firstHitId,
      targetPlayerId: spec.targetPlayerId,
      targetPosition: point(spec.target),
      markerRadius: spec.markerRadius,
      totalDamage: spec.totalDamage,
      players: [
        { id: spec.targetPlayerId, position: value, alive: true },
        ...frame.stackDamageAllies.map((ally, index) => ({
          id: spec.allyIds[index],
          position: ally,
          alive: true,
        })),
      ],
    });
    const share = ledger.perPlayer.find(({ id }) => id === spec.targetPlayerId)?.damage;
    return share !== undefined && share < frame.stackDamageHealthBefore;
  }
  if (mode === 'personal-spread') {
    if (!frame.personalSpreadHitActive) return true;
    const marked = frame.personalSpreadPositions.map((position, index) => ({
      id: spec.playerIds[index],
      position: index === 0 ? value : position,
    }));
    const ledger = personalSpreadResolve({
      marked,
      markerRadius: spec.markerRadius,
      damagePerHit: spec.damagePerHit,
    });
    const damage = ledger.perPlayer.find(({ id }) => id === spec.playerIds[0])?.damage;
    return damage !== undefined && damage < frame.personalSpreadHealthBefore;
  }
  if (mode === 'tower-soak') {
    if (!frame.towerSoakHitActive) return true;
    const ledger = towerSoakResolve({
      center: frame.towerSoakCenter,
      players: [
        { id: spec.playerIds[0], position: value, alive: true },
        { id: spec.playerIds[1], position: frame.towerSoakAlly, alive: true },
      ],
      radius: spec.towerRadius,
      bodyRadius: spec.bodyRadius,
      requiredCount: frame.towerSoakRequiredCount,
      occupantDamage: spec.occupantDamage,
      failureDamage: spec.failureDamage,
    });
    return ledger.succeeded;
  }
  if (mode === 'entity-tether') {
    if (!frame.entityTetherHitActive) return true;
    return entityTetherResolve({
      encounterId: spec.encounterId,
      hitId: frame.entityTetherHitId,
      first: { id: spec.playerIds[0], position: value, alive: true },
      second: { id: spec.playerIds[1], position: frame.entityTetherAlly, alive: true },
      maxLength: spec.maxLength,
      breakDamage: spec.breakDamage,
    }).held;
  }
  if (mode === 'gaze-check') {
    if (!frame.gazeHitActive) return true;
    return !gazeCheckResolve({
      encounterId: spec.encounterId,
      hitId: frame.gazeHitId,
      source: point(spec.source),
      target: { id: 'tavi', position: value, facingDegrees: frame.playerFacing, alive: true },
      halfAngle: spec.halfAngle,
      failureDamage: spec.failureDamage,
    }).looking;
  }
  if (mode === 'proximity-damage') {
    if (!frame.proximityHitActive) return true;
    return (
      proximityDamageResolve({
        encounterId: spec.encounterId,
        hitId: frame.proximityHitId,
        source: point(spec.source),
        target: { id: 'tavi', position: value, alive: true },
        innerRadius: spec.innerRadius,
        outerRadius: spec.outerRadius,
        minDamage: spec.minDamage,
        maxDamage: spec.maxDamage,
      }).damage === 0
    );
  }
  if (mode === 'tank-swap') {
    if (!frame.tankSwapHitActive) return true;
    const target = frame.tankSwapHitId === spec.firstHitId ? frame.player : frame.tankSwapAlly;
    return Math.hypot(value.x - target.x, value.y - target.y) > 70 + radius;
  }
  if (mode === 'debuff-handoff') return !frame.debuffHandoffBurstActive;
  if (mode === 'ordered-targets') {
    const activeIndex = spec.hits.findIndex(
      (hitAt) => frame.time >= hitAt && frame.time < hitAt + spec.hitDuration,
    );
    if (activeIndex < 0 || activeIndex === 0) return true;
    const target = frame.orderedTargetPositions[activeIndex];
    return Math.hypot(value.x - target.x, value.y - target.y) > spec.radius + radius;
  }
  if (mode === 'pairing-polarity') return frame.pairingPolaritySuccess;
  if (mode === 'party-split') return !frame.dangerActive || frame.partySplitGateOpen;
  if (mode === 'coordinated-duo-attack') {
    const target = frame.coordinatedDuoAttackTarget;
    return (
      (!frame.coordinatedDuoAttackLeaderActive ||
        distanceToSegment(value, frame.decoy, target) > spec.laneHalfWidth + radius) &&
      (!frame.coordinatedDuoAttackFollowerActive ||
        distanceToSegment(value, point(spec.boss), target) > spec.laneHalfWidth + radius)
    );
  }
  if (mode === 'shared-group-health') {
    if (frame.sharedGroupHealthFirstAttack)
      return (
        distanceToSegment(value, point(spec.boss), point(spec.firstLaneEnd)) >
        spec.laneHalfWidth + radius
      );
    if (frame.sharedGroupHealthSecondAttack)
      return (
        distanceToSegment(value, point(spec.partner), point(spec.secondLaneEnd)) >
        spec.laneHalfWidth + radius
      );
    return true;
  }
  if (mode === 'kill-order-inheritance') {
    if (frame.killOrderInheritanceWaveActive) {
      const progress = clamp(
        (frame.time - spec.waveActive[0]) / (spec.waveActive[1] - spec.waveActive[0]),
      );
      const ring = 62 + spec.waveMaxRadius * progress;
      return (
        Math.abs(Math.hypot(value.x - spec.boss[0], value.y - spec.boss[1]) - ring) >
        spec.waveHalfWidth + radius
      );
    }
    if (frame.killOrderInheritanceLanceActive)
      return (
        distanceToSegment(value, point(spec.partner), point(spec.lanceEnd)) >
        spec.lanceHalfWidth + radius
      );
    return true;
  }
  if (mode === 'party-size-scaling')
    return (
      !frame.partySizeScalingAttackActive ||
      spec.targetCenters.every(
        (center) =>
          Math.hypot(value.x - center[0], value.y - center[1]) > spec.targetRadius + radius,
      )
    );
  if (mode === 'world-state-variant')
    return (
      !frame.worldStateVariantAttackActive ||
      Math.abs(Math.hypot(value.x - frame.boss.x, value.y - frame.boss.y) - spec.attackRadius) >
        12 + radius
    );
  if (mode === 'interface-interaction')
    return (
      !frame.interfaceInteractionCounterActive ||
      Math.abs(Math.hypot(value.x - frame.boss.x, value.y - frame.boss.y) - spec.attackRadius) >
        12 + radius
    );
  if (mode === 'real-time-progression')
    return (
      !frame.realTimeProgressionAttackActive ||
      Math.abs(Math.hypot(value.x - frame.boss.x, value.y - frame.boss.y) - spec.attackRadius) >
        12 + radius
    );
  if (mode === 'projectile-rally')
    return (
      !frame.dangerActive ||
      Math.hypot(value.x - frame.projectileRallyOrb.x, value.y - frame.projectileRallyOrb.y) >
        spec.projectileRadius + radius
    );
  if (mode === 'player-controlled-boss')
    return (
      !frame.dangerActive ||
      distanceToSegment(value, frame.boss, point(spec.attackEnd)) > spec.laneHalfWidth + radius
    );
  if (mode === 'spiral')
    return (
      distanceFromBoss > 52 + radius &&
      frame.primitives
        .filter((projectile) => projectile.radius > 0 && projectile.opacity > 0)
        .every(
          (projectile) =>
            Math.hypot(value.x - projectile.x, value.y - projectile.y) > projectile.radius + radius,
        )
    );
  if (mode === 'ricochet') {
    const head = frame.primitives[2];
    return Math.hypot(value.x - head.x, value.y - head.y) > head.radius + radius;
  }
  if (mode === 'homing') {
    const head = frame.primitives[1];
    return Math.hypot(value.x - head.x, value.y - head.y) > head.radius + radius;
  }
  if (mode === 'beam') return Math.abs(value.x - frame.primitives[1].x1) > 36 + radius;
  if (mode === 'scanning' || mode === 'rotating')
    return frame.primitives
      .filter((primitive) => primitive.type === 'line' && primitive.tone === 'signal')
      .every(
        (primitive) =>
          distanceToSegment(
            value,
            { x: primitive.x1, y: primitive.y1 },
            { x: primitive.x2, y: primitive.y2 },
          ) >
          primitive.width / 2 + radius,
      );
  if (mode === 'marked')
    return Math.hypot(value.x - spec.mark[0], value.y - spec.mark[1]) > spec.radius + radius;
  if (mode === 'shockwave') {
    const wave = frame.primitives[0];
    return (
      Math.abs(Math.hypot(value.x - wave.x, value.y - wave.y) - wave.radius) >
      wave.width / 2 + radius
    );
  }
  if (mode === 'lingering') return Math.hypot(value.x - 360, value.y - 620) > 105 + radius;
  if (mode === 'trail')
    return frame.primitives
      .filter((primitive) => primitive.radius === 34 && primitive.opacity > 0.15)
      .every(
        (primitive) =>
          Math.hypot(value.x - primitive.x, value.y - primitive.y) > primitive.radius + radius,
      );
  if (mode === 'platforms')
    return frame.primitives
      .filter((primitive) => primitive.type === 'rect' && primitive.tone === 'safe')
      .some(
        (platform) =>
          value.x - radius >= platform.x &&
          value.x + radius <= platform.x + platform.rectWidth &&
          value.y >= platform.y - 70 &&
          value.y <= platform.y + platform.rectHeight + radius,
      );
  if (mode === 'shrink') {
    const safeRadius = frame.primitives[1].radius;
    return Math.hypot(value.x - 280, value.y - 500) <= safeRadius - radius;
  }
  if (mode === 'knockback')
    return value.x >= 24 + radius && value.x <= 536 - radius && value.y <= 910 - radius;
  if (mode === 'target-lock')
    return (
      Math.hypot(value.x - spec.lockPoint[0], value.y - spec.lockPoint[1]) > spec.radius + radius
    );
  if (mode === 'combo') {
    const wave = frame.primitives[1];
    return (
      Math.abs(distanceFromBoss - 190) > 12.5 + radius &&
      Math.abs(distanceFromBoss - wave.radius) > wave.width / 2 + radius
    );
  }
  if (mode === 'weak-point')
    return Math.hypot(value.x - (frame.boss.x + 58), value.y - (frame.boss.y - 12)) <= 170;
  if (mode === 'telegraph') {
    const danger = spec.cone.map(point);
    return (
      !pointInPolygon(value, danger) && distanceToPolyline(value, [...danger, danger[0]]) > radius
    );
  }
  if (mode === 'phase') {
    return (
      value.x + radius < 55 ||
      value.x - radius > 505 ||
      value.y + radius < 650 ||
      value.y - radius > 710
    );
  }
  if (mode === 'enrage')
    return (
      distanceFromBoss > 90 + radius &&
      frame.primitives
        .filter((primitive) => primitive.type === 'line')
        .every(
          (primitive) =>
            distanceToSegment(
              value,
              { x: primitive.x1, y: primitive.y1 },
              { x: primitive.x2, y: primitive.y2 },
            ) >
            primitive.width / 2 + radius,
        )
    );
  throw new Error(`Missing safety rule for blueprint mode: ${mode}`);
}

export function blueprintFrame(id, time) {
  const spec = blueprintSpec(id);
  const t = localTime(time);
  const phase = blueprintPhaseAt(t);
  const prepare = smooth(t / BLUEPRINT_PHASE_ENDS[0]);
  const action = clamp(
    (t - BLUEPRINT_PHASE_ENDS[0]) / (BLUEPRINT_PHASE_ENDS[1] - BLUEPRINT_PHASE_ENDS[0]),
  );
  const recover = smooth(
    (t - BLUEPRINT_PHASE_ENDS[1]) / (BLUEPRINT_DURATION - BLUEPRINT_PHASE_ENDS[1]),
  );
  const startBoss = point(spec.boss);
  const startPlayer = point(spec.player);
  const targetPlayer = point(spec.target);
  const response = smooth((t - 0.42) / 0.92);
  const returnProgress = smooth(
    (t - (spec.mode === 'spiral' ? 5.48 : 4.65)) / (spec.mode === 'spiral' ? 0.47 : 1.2),
  );
  let boss = startBoss;
  if (spec.mode === 'landing') {
    const landing = point(spec.landing);
    const flight = smooth(action / 0.51);
    boss = {
      x: mix(mix(startBoss.x, landing.x, flight), startBoss.x, returnProgress),
      y: mix(mix(startBoss.y, landing.y, flight), startBoss.y, returnProgress),
    };
  } else if (spec.mode === 'speed-change') {
    const x =
      phase === 0
        ? startBoss.x
        : t < spec.switchAt
          ? mix(
              startBoss.x,
              spec.switchX,
              (t - BLUEPRINT_PHASE_ENDS[0]) / (spec.switchAt - BLUEPRINT_PHASE_ENDS[0]),
            )
          : t < spec.finishAt
            ? mix(spec.switchX, spec.finishX, (t - spec.switchAt) / (spec.finishAt - spec.switchAt))
            : mix(spec.finishX, startBoss.x, returnProgress);
    boss = { x, y: spec.laneY };
  } else if (spec.mode === 'teleport') {
    boss = t >= spec.absent[0] && t < spec.resetAbsent[0] ? point(spec.destination) : startBoss;
  } else if (spec.mode === 'boundary-attack') {
    if (t < spec.active[0]) boss = startBoss;
    else if (t < spec.active[1]) {
      const crossing = smooth((t - spec.active[0]) / (spec.active[1] - spec.active[0]));
      boss = { x: mix(startBoss.x, spec.impactPosition[0], crossing), y: startBoss.y };
    } else if (t < spec.openingEnd) boss = point(spec.impactPosition);
    else if (t < spec.withdrawEnd) {
      const withdraw = smooth((t - spec.openingEnd) / (spec.withdrawEnd - spec.openingEnd));
      boss = { x: mix(spec.impactPosition[0], 640, withdraw), y: startBoss.y };
    } else if (t < 4.55) {
      const rise = smooth((t - spec.withdrawEnd) / (4.55 - spec.withdrawEnd));
      boss = { x: 640, y: mix(startBoss.y, 270, rise) };
    } else if (t < 5.35) {
      const traverse = smooth((t - 4.55) / 0.8);
      boss = { x: mix(640, -80, traverse), y: 270 };
    } else if (t < spec.outerRoute[1]) {
      const descend = smooth((t - 5.35) / (spec.outerRoute[1] - 5.35));
      boss = { x: mix(-80, startBoss.x, descend), y: mix(270, startBoss.y, descend) };
    }
  } else if (spec.mode === 'forced-scrolling') {
    const opening = point(spec.bossOpening);
    if (t < spec.active[1]) boss = startBoss;
    else if (t < spec.bossAdvanceEnd) {
      const advance = smooth((t - spec.active[1]) / (spec.bossAdvanceEnd - spec.active[1]));
      boss = { x: mix(startBoss.x, opening.x, advance), y: mix(startBoss.y, opening.y, advance) };
    } else if (t < spec.resetAt) boss = opening;
    else {
      const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      boss = { x: mix(opening.x, startBoss.x, reset), y: mix(opening.y, startBoss.y, reset) };
    }
  } else if (spec.mode === 'chase-herding') {
    const capture = point(spec.captureZone);
    if (t < spec.active[0]) boss = startBoss;
    else if (t < spec.active[1]) {
      const chase = smooth((t - spec.active[0]) / (spec.active[1] - spec.active[0]));
      boss = pointAlongPolyline(spec.bossRoute.map(point), chase);
    } else if (t < spec.resetAt) boss = capture;
    else {
      const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      boss = { x: mix(capture.x, startBoss.x, reset), y: mix(capture.y, startBoss.y, reset) };
    }
  } else if (spec.mode === 'escape-phase') {
    const interrupted = point(spec.interruptPoint);
    if (t < spec.escape[0]) boss = startBoss;
    else if (t < spec.escape[1]) {
      const escape = smooth((t - spec.escape[0]) / (spec.escape[1] - spec.escape[0]));
      boss = pointAlongPolyline(spec.bossRoute.map(point), escape);
    } else if (t < spec.resetAt) boss = interrupted;
    else {
      const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      boss = {
        x: mix(interrupted.x, startBoss.x, reset),
        y: mix(interrupted.y, startBoss.y, reset),
      };
    }
  } else if (spec.mode === 'relocated-arena') {
    const lowerBoss = point(spec.lowerBoss);
    if (t < spec.transfer[0]) boss = startBoss;
    else if (t < spec.transfer[1]) {
      const transfer = smooth((t - spec.transfer[0]) / (spec.transfer[1] - spec.transfer[0]));
      boss = pointAlongPolyline(spec.bossTransfer.map(point), transfer);
    } else if (t < spec.resetAt) boss = lowerBoss;
    else {
      const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      boss = pointAlongPolyline(spec.bossReset.map(point), reset);
    }
  } else if (spec.mode === 'control-mode-shift') {
    const groundedBoss = point(spec.groundedBoss);
    if (t < spec.handoff[0]) boss = startBoss;
    else if (t < spec.handoff[1]) {
      const handoff = smooth((t - spec.handoff[0]) / (spec.handoff[1] - spec.handoff[0]));
      boss = {
        x: mix(startBoss.x, groundedBoss.x, handoff),
        y: mix(startBoss.y, groundedBoss.y, handoff),
      };
    } else if (t < spec.resetAt) boss = groundedBoss;
    else {
      const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      boss = {
        x: mix(groundedBoss.x, startBoss.x, reset),
        y: mix(groundedBoss.y, startBoss.y, reset),
      };
    }
  } else if (spec.mode === 'lunge') {
    const travel = phase === 0 ? 0 : phase === 1 ? smooth(action / 0.62) : 1 - recover;
    boss = {
      x: mix(startBoss.x, spec.lungeEnd[0], travel),
      y: mix(startBoss.y, spec.lungeEnd[1], travel),
    };
  } else if (spec.mode === 'burrow') {
    boss =
      phase === 0
        ? startBoss
        : phase === 1
          ? { x: 420, y: 590 }
          : { x: mix(420, startBoss.x, returnProgress), y: mix(590, startBoss.y, returnProgress) };
  } else if (spec.mode === 'trail') {
    const travel = phase === 0 ? 0 : phase === 1 ? smooth(action) : 1 - returnProgress;
    boss = { x: mix(175, 410, travel), y: mix(260, 610, travel) };
  } else if (spec.mode === 'decoy') {
    const split = phase === 0 ? prepare : phase === 1 ? 1 : 1 - returnProgress;
    boss = {
      x: mix(startBoss.x, spec.real[0], split),
      y: mix(startBoss.y, spec.real[1], split),
    };
  } else if (spec.mode === 'secondary-cues-invisibility') {
    const hiddenEnd = point(spec.hiddenRoute.at(-1));
    if (t < spec.hiddenAt) boss = startBoss;
    else if (t < spec.lockAt) {
      const tracking = smooth((t - spec.hiddenAt) / (spec.lockAt - spec.hiddenAt));
      boss = pointAlongPolyline(spec.hiddenRoute.map(point), tracking);
    } else if (t < spec.resetAt) boss = hiddenEnd;
    else {
      const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      boss = {
        x: mix(hiddenEnd.x, startBoss.x, reset),
        y: mix(hiddenEnd.y, startBoss.y, reset),
      };
    }
  } else if (spec.mode === 'sound-detection') {
    const investigate = point(spec.investigatePoint);
    if (t < spec.investigate[0]) boss = startBoss;
    else if (t < spec.investigate[1]) {
      const travel = smooth(
        (t - spec.investigate[0]) / (spec.investigate[1] - spec.investigate[0]),
      );
      boss = {
        x: mix(startBoss.x, investigate.x, travel),
        y: mix(startBoss.y, investigate.y, travel),
      };
    } else if (t < spec.resetAt) boss = investigate;
    else {
      const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      boss = {
        x: mix(investigate.x, startBoss.x, reset),
        y: mix(investigate.y, startBoss.y, reset),
      };
    }
  }
  if (spec.mode === 'baited-self-hit') {
    const impact = point(spec.impactPosition);
    if (t < spec.charge[0]) boss = startBoss;
    else if (t < spec.impactAt) {
      const travel = smooth((t - spec.charge[0]) / (spec.impactAt - spec.charge[0]));
      boss = { x: mix(startBoss.x, impact.x, travel), y: mix(startBoss.y, impact.y, travel) };
    } else if (t < spec.vulnerableUntil) boss = impact;
    else if (t < spec.resetAt) {
      const reset = smooth((t - spec.vulnerableUntil) / (spec.resetAt - spec.vulnerableUntil));
      boss = { x: mix(impact.x, startBoss.x, reset), y: mix(impact.y, startBoss.y, reset) };
    } else boss = startBoss;
  }
  if (spec.mode === 'posture-stagger-gauge') boss = startBoss;
  if (spec.mode === 'pacifist-resolution') boss = startBoss;
  if (spec.mode === 'persistent-progress') boss = startBoss;
  let responseProgress = response;
  if (spec.mode === 'landing')
    responseProgress = phase === 0 ? 0 : phase === 1 ? smooth(action / 0.4) : 1;
  else if (spec.mode === 'single-shot')
    responseProgress = phase === 0 ? 0 : phase === 1 ? smooth(action / 0.42) : 1;
  else if (spec.mode === 'crossfire')
    responseProgress = phase === 0 ? 0 : phase === 1 ? smooth(action / 0.38) : 1;
  else if (spec.mode === 'splitting-projectile')
    responseProgress = phase === 0 ? 0 : phase === 1 ? smooth((action - 0.24) / 0.34) : 1;
  else if (spec.mode === 'returning-projectile')
    responseProgress = phase === 0 ? 0 : phase === 1 ? smooth((action - 0.2) / 0.34) : 1;
  else if (spec.mode === 'orbiting-projectiles')
    responseProgress = phase === 0 ? 0 : phase === 1 ? smooth((action - 0.1) / 0.55) : 1;
  else if (spec.mode === 'pulse-beam')
    responseProgress = phase === 0 ? 0 : phase === 1 ? smooth((action - 0.25) / 0.2) : 1;
  else if (spec.mode === 'chain-explosions')
    responseProgress = phase === 0 ? 0 : phase === 1 ? smooth((action - 0.2) / 0.7) : 1;
  else if (spec.mode === 'mine')
    responseProgress = phase === 0 ? 0 : phase === 1 ? smooth((action - 0.06) / 0.8) : 1;
  else if (spec.mode === 'moving-hazard')
    responseProgress = phase === 0 ? 0 : phase === 1 ? smooth(action / 0.5) : 1;
  else if (spec.mode === 'converging-threats')
    responseProgress = phase === 0 ? 0 : phase === 1 ? smooth(action / 0.53) : 1;
  else if (spec.mode === 'pull')
    responseProgress = phase === 0 ? 0 : phase === 1 ? smooth((action - 0.15) / 0.77) : 1;
  else if (spec.mode === 'turret-deployment') responseProgress = smooth((t - 0.64) / 1.34);
  else if (spec.mode === 'threat-generator') responseProgress = smooth((t - 0.42) / 1.2);
  else if (spec.mode === 'decoy') responseProgress = smooth((t - 1.35) / 1.72);
  else if (spec.mode === 'predictive-aim') responseProgress = smooth((t - 1.6) / 1.05);
  else if (spec.mode === 'source-track') responseProgress = smooth((t - 1.6) / 0.84);
  else if (spec.mode === 'burst-fire') responseProgress = smooth((t - 1.6) / 0.75);
  else if (spec.mode === 'volley') responseProgress = smooth((t - 1.6) / 0.68);
  else if (spec.mode === 'delayed-activation') responseProgress = smooth((t - 1.7) / 0.9);
  else if (spec.mode === 'speed-change') responseProgress = smooth((t - 1.6) / 0.7);
  else if (spec.mode === 'limited-spread') responseProgress = smooth((t - 1.6) / 0.68);
  else if (spec.mode === 'directional-shield') responseProgress = smooth((t - 2.22) / 1.18);
  else if (spec.mode === 'damage-type-resistance') responseProgress = smooth((t - 1.6) / 0.42);
  else if (spec.mode === 'situational-immunity') responseProgress = smooth((t - 1.6) / 0.42);
  else if (spec.mode === 'part-break') responseProgress = smooth((t - 2.24) / 0.55);
  else if (spec.mode === 'attack-reflection') responseProgress = smooth((t - 2.55) / 0.62);
  else if (spec.mode === 'counter-stance') responseProgress = smooth((t - 1.92) / 0.48);
  else if (spec.mode === 'absorption-power-up')
    responseProgress = smooth((t - spec.chargeWindup) / 0.53);
  else if (spec.mode === 'interruptible-wind-up')
    responseProgress = smooth((t - spec.secondWindup[0]) / 0.64);
  else if (spec.mode === 'loadout-adaptation') responseProgress = 0;
  else if (spec.mode === 'wind-up') responseProgress = 0;
  else if (spec.mode === 'attack-lock') responseProgress = 0;
  else if (spec.mode === 'active-phase') responseProgress = 0;
  else if (spec.mode === 'recovery') responseProgress = 0;
  else if (spec.mode === 'survival-phase') responseProgress = 0;
  else if (spec.mode === 'teleport') responseProgress = 0;
  else if (spec.mode === 'boundary-attack') responseProgress = 0;
  else if (spec.mode === 'forced-scrolling') responseProgress = 0;
  else if (spec.mode === 'chase-herding') responseProgress = 0;
  else if (spec.mode === 'escape-phase') responseProgress = 0;
  else if (spec.mode === 'relocated-arena') responseProgress = 0;
  else if (spec.mode === 'control-mode-shift') responseProgress = 0;
  else if (spec.mode === 'boss-as-terrain') responseProgress = 0;
  else if (spec.mode === 'cover-line-of-sight') responseProgress = 0;
  else if (spec.mode === 'forced-inertia') responseProgress = 0;
  else if (spec.mode === 'wraparound-projectile') responseProgress = 0;
  else if (spec.mode === 'beat-synced-attack') responseProgress = 0;
  else if (spec.mode === 'secondary-cues-invisibility') responseProgress = 0;
  else if (spec.mode === 'sound-detection') responseProgress = 0;
  else if (spec.mode === 'objective-linked-invulnerability') responseProgress = 0;
  else if (spec.mode === 'wave-clear-objective') responseProgress = 0;
  else if (spec.mode === 'environmental-weapon') responseProgress = 0;
  else if (spec.mode === 'encounter-specific-tool') responseProgress = 0;
  else if (spec.mode === 'player-controlled-boss') responseProgress = 0;
  else if (spec.mode === 'projectile-rally') responseProgress = 0;
  else if (spec.mode === 'baited-self-hit') responseProgress = 0;
  else if (spec.mode === 'posture-stagger-gauge') responseProgress = 0;
  else if (spec.mode === 'pacifist-resolution') responseProgress = 0;
  else if (spec.mode === 'persistent-progress') responseProgress = 0;
  else if (spec.mode === 'status-buildup') responseProgress = 0;
  else if (spec.mode === 'instant-kill') responseProgress = 0;
  else if (spec.mode === 'maximum-health-reduction') responseProgress = 0;
  else if (spec.mode === 'ability-lock') responseProgress = 0;
  else if (spec.mode === 'resource-steal') responseProgress = 0;
  else if (spec.mode === 'on-hit-healing') responseProgress = 0;
  else if (spec.mode === 'self-heal-cast') responseProgress = 0;
  else if (spec.mode === 'external-healing-source') responseProgress = 0;
  else if (spec.mode === 'damage-rate-cap') responseProgress = 0;
  else if (spec.mode === 'loadout-mirror') responseProgress = 0;
  else if (spec.mode === 'moveset-shapeshifting') responseProgress = 0;
  else if (spec.mode === 'ally-theft') responseProgress = 0;
  else if (spec.mode === 'false-death') responseProgress = 0;
  else if (spec.mode === 'action-reactive-punish') responseProgress = 0;
  else if (spec.mode === 'run-history-manifestation') responseProgress = 0;
  else if (spec.mode === 'real-time-progression') responseProgress = 0;
  else if (spec.mode === 'interface-interaction') responseProgress = 0;
  else if (spec.mode === 'world-state-variant') responseProgress = 0;
  else if (spec.mode === 'party-size-scaling') responseProgress = 0;
  else if (spec.mode === 'partner-revival') responseProgress = 0;
  else if (spec.mode === 'knockback')
    responseProgress = phase === 0 ? 0 : phase === 1 ? smooth((t - spec.hitAt) / 0.95) : 1;
  else if (spec.mode === 'target-lock')
    responseProgress = phase === 1 ? smooth(action / 0.45) : phase === 2 ? 1 : 0;
  else if (spec.mode === 'homing')
    responseProgress = phase === 1 ? smooth((action - 0.38) / 0.3) : phase === 2 ? 1 : 0;
  let player = {
    x: mix(mix(startPlayer.x, targetPlayer.x, responseProgress), startPlayer.x, returnProgress),
    y: mix(mix(startPlayer.y, targetPlayer.y, responseProgress), startPlayer.y, returnProgress),
  };
  if (spec.mode === 'target-lock') {
    const locked = point(spec.lockPoint);
    const track = smooth(t / BLUEPRINT_PHASE_ENDS[0]);
    const escape = smooth(action / 0.45);
    player =
      phase === 0
        ? { x: mix(startPlayer.x, locked.x, track), y: mix(startPlayer.y, locked.y, track) }
        : phase === 1
          ? { x: mix(locked.x, targetPlayer.x, escape), y: mix(locked.y, targetPlayer.y, escape) }
          : {
              x: mix(targetPlayer.x, startPlayer.x, returnProgress),
              y: mix(targetPlayer.y, startPlayer.y, returnProgress),
            };
  }
  if (spec.mode === 'pull' && phase === 1) {
    const dragged = smooth(action);
    player = {
      x:
        startPlayer.x +
        (spec.boss[0] - startPlayer.x) * 0.23 * dragged +
        (spec.target[0] - startPlayer.x + 16.1) * responseProgress,
      y:
        startPlayer.y +
        (spec.boss[1] - startPlayer.y) * 0.23 * dragged +
        (spec.target[1] - startPlayer.y + 82.8) * responseProgress,
    };
  }
  if (spec.mode === 'predictive-aim') {
    const lockX = startPlayer.x + spec.approachVelocity * 1.6;
    player = {
      x:
        phase === 0
          ? startPlayer.x + spec.approachVelocity * t
          : mix(mix(lockX, targetPlayer.x, responseProgress), startPlayer.x, returnProgress),
      y: startPlayer.y,
    };
  }
  if (spec.mode === 'source-track') {
    const lock = point(spec.lock);
    player =
      phase === 0
        ? { x: mix(startPlayer.x, lock.x, prepare), y: startPlayer.y }
        : {
            x: mix(mix(lock.x, targetPlayer.x, responseProgress), startPlayer.x, returnProgress),
            y: startPlayer.y,
          };
  }
  if (spec.mode === 'directional-shield') {
    const route = [startPlayer, { x: spec.target[0], y: startPlayer.y }, targetPlayer];
    const advanced = pointAlongPolyline(route, responseProgress);
    player = {
      x: mix(advanced.x, startPlayer.x, returnProgress),
      y: mix(advanced.y, startPlayer.y, returnProgress),
    };
  }
  if (spec.mode === 'attack-reflection' && t >= 4.12) {
    const approach = smooth((t - 4.12) / 0.5);
    const retreat = smooth((t - 5.17) / 0.65);
    player = {
      x: mix(mix(spec.target[0], 390, approach), startPlayer.x, retreat),
      y: mix(mix(spec.target[1], 405, approach), startPlayer.y, retreat),
    };
  }
  if (spec.mode === 'counter-stance') {
    const retreat = smooth((t - 1.92) / 0.48);
    const returnToGuard = smooth((t - 3.04) / 0.88);
    const openApproach = smooth((t - 4.54) / 0.38);
    const reset = smooth((t - 5.2) / 0.62);
    const afterRetreat = {
      x: mix(startPlayer.x, targetPlayer.x, retreat),
      y: mix(startPlayer.y, targetPlayer.y, retreat),
    };
    const afterReturn = {
      x: mix(afterRetreat.x, startPlayer.x, returnToGuard),
      y: mix(afterRetreat.y, startPlayer.y, returnToGuard),
    };
    player = {
      x: mix(mix(afterReturn.x, 405, openApproach), startPlayer.x, reset),
      y: mix(mix(afterReturn.y, 430, openApproach), startPlayer.y, reset),
    };
  }
  if (spec.mode === 'absorption-power-up') {
    const away = smooth((t - spec.chargeWindup) / 0.53);
    const approach = smooth((t - 4.24) / 0.45);
    const reset = smooth((t - 5.25) / 0.58);
    player = {
      x: mix(mix(mix(startPlayer.x, targetPlayer.x, away), 390, approach), startPlayer.x, reset),
      y: startPlayer.y,
    };
  }
  if (spec.mode === 'interruptible-wind-up') {
    const firstApproach = smooth((t - 0.92) / 0.5);
    const firstRetreat = smooth((t - 1.78) / 0.62);
    const clearRelease = smooth((t - spec.secondWindup[0]) / 0.64);
    const reset = smooth((t - spec.recoveryEnd) / 0.54);
    const closePosition = {
      x: mix(startPlayer.x, spec.interruptPosition[0], firstApproach),
      y: startPlayer.y,
    };
    const afterRetreat = {
      x: mix(closePosition.x, startPlayer.x, firstRetreat),
      y: startPlayer.y,
    };
    player = {
      x: mix(mix(afterRetreat.x, targetPlayer.x, clearRelease), startPlayer.x, reset),
      y: startPlayer.y,
    };
  }
  if (spec.mode === 'loadout-adaptation') {
    const clearReach = smooth((t - 1.18) / 0.38);
    const returnAfterReach = smooth((t - 2.16) / 0.42);
    const clearBurst = smooth((t - spec.burstCopiedAt) / 0.58);
    const reset = smooth((t - spec.recoveryEnd) / 0.52);
    const reachSafe = {
      x: startPlayer.x,
      y: mix(startPlayer.y, 540, clearReach),
    };
    const afterReach = {
      x: mix(reachSafe.x, startPlayer.x, returnAfterReach),
      y: mix(reachSafe.y, startPlayer.y, returnAfterReach),
    };
    player = {
      x: mix(mix(afterReach.x, targetPlayer.x, clearBurst), startPlayer.x, reset),
      y: mix(mix(afterReach.y, targetPlayer.y, clearBurst), startPlayer.y, reset),
    };
  }
  if (spec.mode === 'wind-up') {
    const clearShort = smooth((t - 0.84) / 0.46);
    const returnAfterShort = smooth((t - 2.12) / 0.42);
    const clearHeld = smooth((t - 3.16) / 0.5);
    const reset = smooth((t - spec.recoveryEnd) / 0.5);
    const shortSafe = {
      x: startPlayer.x,
      y: mix(startPlayer.y, 550, clearShort),
    };
    const afterShort = {
      x: mix(shortSafe.x, startPlayer.x, returnAfterShort),
      y: mix(shortSafe.y, startPlayer.y, returnAfterShort),
    };
    player = {
      x: mix(mix(afterShort.x, targetPlayer.x, clearHeld), startPlayer.x, reset),
      y: mix(mix(afterShort.y, targetPlayer.y, clearHeld), startPlayer.y, reset),
    };
  }
  if (spec.mode === 'attack-lock') {
    const firstTrack = smooth((t - spec.firstTrack[0]) / (spec.firstLock - spec.firstTrack[0]));
    const firstEscape = smooth((t - spec.firstLock) / 0.45);
    const secondSetup = smooth(
      (t - spec.firstRelease[1]) / (spec.secondSetup - spec.firstRelease[1]),
    );
    const secondTrack = smooth((t - spec.secondTrack[0]) / (spec.secondLock - spec.secondTrack[0]));
    const secondEscape = smooth((t - spec.secondLock) / 0.45);
    const reset = smooth((t - spec.recoveryEnd) / (BLUEPRINT_DURATION - spec.recoveryEnd));
    const atFirstLock = {
      x: mix(startPlayer.x, spec.firstLockPoint[0], firstTrack),
      y: mix(startPlayer.y, spec.firstLockPoint[1], firstTrack),
    };
    const afterFirstEscape = {
      x: mix(atFirstLock.x, spec.firstEscape[0], firstEscape),
      y: mix(atFirstLock.y, spec.firstEscape[1], firstEscape),
    };
    const atSecondStart = {
      x: mix(afterFirstEscape.x, spec.secondStart[0], secondSetup),
      y: mix(afterFirstEscape.y, spec.secondStart[1], secondSetup),
    };
    const atSecondLock = {
      x: mix(atSecondStart.x, spec.secondLockPoint[0], secondTrack),
      y: mix(atSecondStart.y, spec.secondLockPoint[1], secondTrack),
    };
    const afterSecondEscape = {
      x: mix(atSecondLock.x, spec.secondEscape[0], secondEscape),
      y: mix(atSecondLock.y, spec.secondEscape[1], secondEscape),
    };
    player = {
      x: mix(afterSecondEscape.x, startPlayer.x, reset),
      y: mix(afterSecondEscape.y, startPlayer.y, reset),
    };
  }
  if (spec.mode === 'active-phase') {
    const escape = smooth((t - 0.72) / 0.68);
    const reenter = smooth((t - spec.active[1]) / (spec.followThroughEnd - spec.active[1]));
    const reset = smooth((t - spec.recoveryEnd) / (BLUEPRINT_DURATION - spec.recoveryEnd));
    const safe = {
      x: mix(startPlayer.x, spec.safePosition[0], escape),
      y: mix(startPlayer.y, spec.safePosition[1], escape),
    };
    const punish = {
      x: mix(safe.x, targetPlayer.x, reenter),
      y: mix(safe.y, targetPlayer.y, reenter),
    };
    player = {
      x: mix(punish.x, startPlayer.x, reset),
      y: mix(punish.y, startPlayer.y, reset),
    };
  }
  if (spec.mode === 'recovery') {
    const escape = smooth((t - 0.62) / 0.58);
    const approach = smooth((t - spec.recovery[0]) / 1.42);
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const safe = {
      x: mix(startPlayer.x, spec.safePosition[0], escape),
      y: mix(startPlayer.y, spec.safePosition[1], escape),
    };
    const punish = {
      x: mix(safe.x, targetPlayer.x, approach),
      y: mix(safe.y, targetPlayer.y, approach),
    };
    player = {
      x: mix(punish.x, startPlayer.x, reset),
      y: mix(punish.y, startPlayer.y, reset),
    };
  }
  if (spec.mode === 'survival-phase') {
    let current = startPlayer;
    for (let index = 0; index < spec.hazards.length; index += 1) {
      const hazard = spec.hazards[index];
      const destination = point(spec.safePositions[index]);
      const movement = smooth(
        (t - (hazard.preview[0] + 0.015)) / (hazard.active[0] - hazard.preview[0] - 0.03),
      );
      current = {
        x: mix(current.x, destination.x, movement),
        y: mix(current.y, destination.y, movement),
      };
    }
    const approach = smooth((t - spec.shieldDropsAt) / 0.58);
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const punish = {
      x: mix(current.x, targetPlayer.x, approach),
      y: mix(current.y, targetPlayer.y, approach),
    };
    player = {
      x: mix(punish.x, startPlayer.x, reset),
      y: mix(punish.y, startPlayer.y, reset),
    };
  }
  if (spec.mode === 'teleport') {
    const escape = smooth(
      (t - (spec.destinationPreview[0] + 0.08)) /
        (spec.active[0] - spec.destinationPreview[0] - 0.26),
    );
    const approach = smooth((t - spec.active[1]) / 0.64);
    const reset = smooth(
      (t - spec.resetDeparture[0]) / (BLUEPRINT_DURATION - spec.resetDeparture[0]),
    );
    const safe = {
      x: mix(startPlayer.x, spec.safePosition[0], escape),
      y: mix(startPlayer.y, spec.safePosition[1], escape),
    };
    const punish = {
      x: mix(safe.x, targetPlayer.x, approach),
      y: mix(safe.y, targetPlayer.y, approach),
    };
    player = {
      x: mix(punish.x, startPlayer.x, reset),
      y: mix(punish.y, startPlayer.y, reset),
    };
  }
  if (spec.mode === 'boundary-attack') {
    const escape = smooth((t - 0.72) / 0.72);
    const approach = smooth((t - spec.active[1]) / 0.62);
    const retreat = smooth((t - (spec.punishAt + 0.2)) / 0.46);
    const reset = smooth((t - 4.72) / 0.86);
    const safe = {
      x: mix(startPlayer.x, spec.safePosition[0], escape),
      y: mix(startPlayer.y, spec.safePosition[1], escape),
    };
    const punish = {
      x: mix(safe.x, targetPlayer.x, approach),
      y: mix(safe.y, targetPlayer.y, approach),
    };
    const withdrew = {
      x: mix(punish.x, safe.x, retreat),
      y: mix(punish.y, safe.y, retreat),
    };
    player = {
      x: mix(withdrew.x, startPlayer.x, reset),
      y: mix(withdrew.y, startPlayer.y, reset),
    };
  }
  if (spec.mode === 'forced-scrolling') {
    const climb = smooth((t - 0.72) / (spec.active[1] - 0.72));
    const climbed = pointAlongPolyline(spec.route.map(point), climb);
    const approach = smooth((t - spec.active[1]) / 0.62);
    const punish = {
      x: mix(climbed.x, targetPlayer.x, approach),
      y: mix(climbed.y, targetPlayer.y, approach),
    };
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    player = {
      x: mix(punish.x, startPlayer.x, reset),
      y: mix(punish.y, startPlayer.y, reset),
    };
  }
  if (spec.mode === 'chase-herding') {
    const chase = smooth((t - 0.72) / (spec.active[1] - 0.72));
    const intercept = pointAlongPolyline(spec.playerRoute.map(point), chase);
    const approach = smooth((t - spec.active[1]) / 0.72);
    const punish = {
      x: mix(intercept.x, targetPlayer.x, approach),
      y: mix(intercept.y, targetPlayer.y, approach),
    };
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    player = {
      x: mix(punish.x, startPlayer.x, reset),
      y: mix(punish.y, startPlayer.y, reset),
    };
  }
  if (spec.mode === 'escape-phase') {
    const interceptProgress = smooth((t - 0.72) / (spec.escape[1] - 0.72));
    const intercept = pointAlongPolyline(spec.playerRoute.map(point), interceptProgress);
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    player = {
      x: mix(intercept.x, startPlayer.x, reset),
      y: mix(intercept.y, startPlayer.y, reset),
    };
  }
  if (spec.mode === 'relocated-arena') {
    const lowerPlayer = point(spec.lowerPlayer);
    if (t < spec.transfer[0]) player = startPlayer;
    else if (t < spec.transfer[1]) {
      const transfer = smooth((t - spec.transfer[0]) / (spec.transfer[1] - spec.transfer[0]));
      player = pointAlongPolyline(spec.playerTransfer.map(point), transfer);
    } else if (t < spec.resetAt) player = lowerPlayer;
    else {
      const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      player = pointAlongPolyline(spec.playerReset.map(point), reset);
    }
  }
  if (spec.mode === 'control-mode-shift') {
    const previewPosition = { x: 195, y: 610 };
    const handoffPosition = { x: 210, y: 650 };
    const groundedPlayer = point(spec.groundedPlayer);
    const strikePlayer = point(spec.strikePlayer);
    if (t < spec.previewAt) {
      const roam = smooth(t / spec.previewAt);
      player = {
        x: mix(startPlayer.x, previewPosition.x, roam),
        y: mix(startPlayer.y, previewPosition.y, roam),
      };
    } else if (t < spec.handoff[0]) {
      const preview = smooth((t - spec.previewAt) / (spec.handoff[0] - spec.previewAt));
      player = {
        x: mix(previewPosition.x, handoffPosition.x, preview),
        y: mix(previewPosition.y, handoffPosition.y, preview),
      };
    } else if (t < spec.handoff[1]) {
      const handoff = smooth((t - spec.handoff[0]) / (spec.handoff[1] - spec.handoff[0]));
      player = {
        x: mix(handoffPosition.x, groundedPlayer.x, handoff),
        y: mix(handoffPosition.y, groundedPlayer.y, handoff),
      };
    } else if (t < spec.wave[1]) {
      const jump = clamp((t - spec.handoff[1]) / (spec.wave[1] - spec.handoff[1]));
      player = {
        x: mix(groundedPlayer.x, 240, smooth(jump)),
        y: groundedPlayer.y - Math.sin(jump * Math.PI) * 145,
      };
    } else if (t < spec.resetAt) {
      const approach = smooth((t - spec.wave[1]) / (spec.punishAt - spec.wave[1]));
      player = {
        x: mix(240, strikePlayer.x, approach),
        y: mix(groundedPlayer.y, strikePlayer.y, approach),
      };
    } else {
      const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      player = pointAlongPolyline(
        [strikePlayer, handoffPosition, previewPosition, startPlayer],
        reset,
      );
    }
  }
  if (spec.mode === 'boss-as-terrain') {
    const mount = point(spec.mountPoint);
    const hold = point(spec.holdPoint);
    const weakPoint = point(spec.weakPoint);
    const landing = point(spec.landingPoint);
    if (t < spec.revealAt) player = startPlayer;
    else if (t < spec.mountAt) {
      const approach = smooth((t - spec.revealAt) / (spec.mountAt - spec.revealAt));
      player = {
        x: mix(startPlayer.x, mount.x, approach),
        y: mix(startPlayer.y, mount.y, approach),
      };
    } else if (t < spec.shake[0]) {
      const climb = smooth((t - spec.mountAt) / (spec.shake[0] - spec.mountAt));
      player = pointAlongPolyline(spec.climbRoute.slice(1, 4).map(point), climb);
    } else if (t < spec.shake[1]) player = hold;
    else if (t < spec.weakPointOpensAt) {
      const climb = smooth((t - spec.shake[1]) / (spec.weakPointOpensAt - spec.shake[1]));
      player = pointAlongPolyline(spec.climbRoute.slice(3).map(point), climb);
    } else if (t < spec.drop[0]) player = weakPoint;
    else if (t < spec.drop[1]) {
      const drop = smooth((t - spec.drop[0]) / (spec.drop[1] - spec.drop[0]));
      player = pointAlongPolyline(spec.dropRoute.map(point), drop);
    } else {
      const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      player = {
        x: mix(landing.x, startPlayer.x, reset),
        y: mix(landing.y, startPlayer.y, reset),
      };
    }
  }
  if (spec.mode === 'cover-line-of-sight') {
    const cover = point(spec.coverPoint);
    const strike = point(spec.strikePoint);
    if (t < spec.shadowAt) player = startPlayer;
    else if (t < spec.coveredAt) {
      const enter = smooth((t - spec.shadowAt) / (spec.coveredAt - spec.shadowAt));
      player = {
        x: mix(startPlayer.x, cover.x, enter),
        y: mix(startPlayer.y, cover.y, enter),
      };
    } else if (t < spec.beam[1]) player = cover;
    else if (t < spec.punishAt) {
      const exit = clamp((t - spec.beam[1]) / (spec.punishAt - spec.beam[1]));
      player = pointAlongPolyline(spec.exitRoute.map(point), exit);
    } else if (t < spec.resetAt) player = strike;
    else {
      const reset = clamp((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      player = pointAlongPolyline(spec.resetRoute.map(point), reset);
    }
  }
  if (spec.mode === 'forced-inertia') {
    const entry = point(spec.entryPoint);
    const brake = point(spec.brakePoint);
    const strike = point(spec.strikePoint);
    if (t < spec.vectorAt) player = startPlayer;
    else if (t < spec.commitAt) {
      const approach = smooth((t - spec.vectorAt) / (spec.commitAt - spec.vectorAt));
      player = {
        x: mix(startPlayer.x, entry.x, approach),
        y: mix(startPlayer.y, entry.y, approach),
      };
    } else if (t < spec.slide[0]) player = entry;
    else if (t < spec.slide[1]) {
      const slide = clamp((t - spec.slide[0]) / (spec.slide[1] - spec.slide[0]));
      player = pointAlongPolyline(spec.slideRoute.map(point), slide);
    } else if (t < spec.brake[1]) player = brake;
    else if (t < spec.punishAt) {
      const control = smooth((t - spec.brake[1]) / (spec.punishAt - spec.brake[1]));
      player = pointAlongPolyline(spec.strikeRoute.map(point), control);
    } else if (t < spec.resetAt) player = strike;
    else {
      const reset = clamp((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      player = pointAlongPolyline(spec.resetRoute.map(point), reset);
    }
  }
  if (spec.mode === 'wraparound-projectile') {
    const safe = point(spec.safePoint);
    const strike = point(spec.strikePoint);
    if (t < spec.signalAt) player = startPlayer;
    else if (t < spec.releaseAt) {
      const leaveLane = smooth((t - spec.signalAt) / (spec.releaseAt - spec.signalAt));
      player = {
        x: mix(startPlayer.x, safe.x, leaveLane),
        y: mix(startPlayer.y, safe.y, leaveLane),
      };
    } else if (t < spec.secondPass[1]) player = safe;
    else if (t < spec.punishAt) {
      const approach = smooth((t - spec.secondPass[1]) / (spec.punishAt - spec.secondPass[1]));
      player = {
        x: mix(safe.x, strike.x, approach),
        y: mix(safe.y, strike.y, approach),
      };
    } else if (t < spec.resetAt) player = strike;
    else {
      const reset = clamp((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      player = pointAlongPolyline(spec.resetRoute.map(point), reset);
    }
  }
  if (spec.mode === 'beat-synced-attack') {
    const firstSafe = point(spec.safePositions[0]);
    const secondSafe = point(spec.safePositions[1]);
    const thirdSafe = point(spec.safePositions[2]);
    const strike = point(spec.strikePoint);
    if (t < 1.08) player = startPlayer;
    else if (t < 1.52) {
      const move = smooth((t - 1.08) / (1.52 - 1.08));
      player = {
        x: mix(startPlayer.x, firstSafe.x, move),
        y: mix(startPlayer.y, firstSafe.y, move),
      };
    } else if (t < 1.78) player = firstSafe;
    else if (t < 2.12) {
      const move = smooth((t - 1.78) / (2.12 - 1.78));
      player = { x: mix(firstSafe.x, secondSafe.x, move), y: mix(firstSafe.y, secondSafe.y, move) };
    } else if (t < 2.38) player = secondSafe;
    else if (t < 2.72) {
      const move = smooth((t - 2.38) / (2.72 - 2.38));
      player = { x: mix(secondSafe.x, thirdSafe.x, move), y: mix(secondSafe.y, thirdSafe.y, move) };
    } else if (t < spec.phraseClearsAt) player = thirdSafe;
    else if (t < spec.punishAt) {
      const approach = smooth((t - spec.phraseClearsAt) / (spec.punishAt - spec.phraseClearsAt));
      player = { x: mix(thirdSafe.x, strike.x, approach), y: mix(thirdSafe.y, strike.y, approach) };
    } else if (t < spec.resetAt) player = strike;
    else {
      const reset = clamp((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      player = pointAlongPolyline(spec.resetRoute.map(point), reset);
    }
  }
  if (spec.mode === 'secondary-cues-invisibility') {
    const safe = point(spec.safePoint);
    const strike = point(spec.strikePoint);
    if (t < spec.hiddenAt) player = startPlayer;
    else if (t < spec.lockAt) {
      const track = smooth((t - spec.hiddenAt) / (spec.lockAt - spec.hiddenAt));
      player = pointAlongPolyline(spec.playerRoute.map(point), track);
    } else if (t < spec.attack[1]) player = safe;
    else if (t < spec.punishAt) {
      const approach = smooth((t - spec.attack[1]) / (spec.punishAt - spec.attack[1]));
      player = { x: mix(safe.x, strike.x, approach), y: mix(safe.y, strike.y, approach) };
    } else if (t < spec.resetAt) player = strike;
    else {
      const reset = clamp((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      player = pointAlongPolyline(spec.resetRoute.map(point), reset);
    }
  }
  if (spec.mode === 'sound-detection') {
    const sound = point(spec.soundPoint);
    const safe = point(spec.hidePoint);
    const strike = point(spec.strikePoint);
    if (t < spec.noiseAt) {
      const approach = smooth((t - spec.quietAt) / (spec.noiseAt - spec.quietAt));
      player = pointAlongPolyline(spec.approachRoute.map(point), approach);
    } else if (t < spec.heardAt) player = sound;
    else if (t < spec.lockAt) {
      const relocate = smooth((t - spec.heardAt) / (spec.lockAt - spec.heardAt));
      player = pointAlongPolyline(spec.silentRoute.map(point), relocate);
    } else if (t < spec.searchEndsAt) player = safe;
    else if (t < spec.punishAt) {
      const approach = smooth((t - spec.searchEndsAt) / (spec.punishAt - spec.searchEndsAt));
      player = { x: mix(safe.x, strike.x, approach), y: mix(safe.y, strike.y, approach) };
    } else if (t < spec.resetAt) player = strike;
    else {
      const reset = clamp((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      player = pointAlongPolyline(spec.resetRoute.map(point), reset);
    }
  }
  if (spec.mode === 'objective-linked-invulnerability') {
    const [first, second, third] = spec.objectives.map(point);
    const strike = point(spec.strikePoint);
    const retreat = point(spec.retreatPoint);
    if (t < 0.74) player = startPlayer;
    else if (t < spec.objectiveHits[0]) {
      const progress = smooth((t - 0.74) / (spec.objectiveHits[0] - 0.74));
      player = {
        x: mix(startPlayer.x, first.x, progress),
        y: mix(startPlayer.y, first.y, progress),
      };
    } else if (t < spec.objectiveHits[1]) {
      const progress = smooth(
        (t - spec.objectiveHits[0]) / (spec.objectiveHits[1] - spec.objectiveHits[0]),
      );
      player = { x: mix(first.x, second.x, progress), y: mix(first.y, second.y, progress) };
    } else if (t < spec.objectiveHits[2]) {
      const progress = smooth(
        (t - spec.objectiveHits[1]) / (spec.objectiveHits[2] - spec.objectiveHits[1]),
      );
      player = { x: mix(second.x, third.x, progress), y: mix(second.y, third.y, progress) };
    } else if (t < 3.3) {
      const progress = smooth((t - spec.objectiveHits[2]) / (3.3 - spec.objectiveHits[2]));
      player = { x: mix(third.x, strike.x, progress), y: mix(third.y, strike.y, progress) };
    } else if (t < spec.bossStrike) player = strike;
    else if (t < spec.shieldReturns) {
      const progress = smooth((t - spec.bossStrike) / (spec.shieldReturns - spec.bossStrike));
      player = { x: mix(strike.x, retreat.x, progress), y: mix(strike.y, retreat.y, progress) };
    } else if (t < spec.resetAt) player = retreat;
    else {
      const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      player = pointAlongPolyline(spec.resetRoute.map(point), reset);
    }
  }
  if (spec.mode === 'wave-clear-objective') {
    const route = spec.playerTimeline;
    const nextIndex = route.findIndex(([at]) => at > t);
    const [startAt, startX, startY] = route[nextIndex - 1];
    const [endAt, endX, endY] = route[nextIndex];
    const progress = smooth((t - startAt) / (endAt - startAt));
    player = { x: mix(startX, endX, progress), y: mix(startY, endY, progress) };
  }
  if (spec.mode === 'environmental-weapon') {
    if (t < spec.routeStartsAt) player = startPlayer;
    else if (t < spec.powerReachedAt) {
      const reachPower = smooth(
        (t - spec.routeStartsAt) / (spec.powerReachedAt - spec.routeStartsAt),
      );
      player = pointAlongPolyline(spec.playerRoutes.power.map(point), reachPower);
    } else if (t < spec.deviceRouteAt) player = point(spec.powerNode);
    else if (t < spec.deviceReachedAt) {
      const reachDevice = clamp(
        (t - spec.deviceRouteAt) / (spec.deviceReachedAt - spec.deviceRouteAt),
      );
      player = pointAlongPolyline(spec.playerRoutes.device.map(point), reachDevice);
    } else if (t < spec.spentAt) player = point(spec.device);
    else if (t < spec.rewardAt) {
      const retreat = smooth((t - spec.spentAt) / (spec.rewardAt - spec.spentAt));
      player = pointAlongPolyline(spec.playerRoutes.retreat.map(point), retreat);
    } else if (t < spec.resetAt) player = point(spec.playerRoutes.retreat.at(-1));
    else {
      const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      player = pointAlongPolyline(spec.playerRoutes.reset.map(point), reset);
    }
  }
  if (spec.mode === 'encounter-specific-tool') {
    if (t < spec.routeStartsAt) player = startPlayer;
    else if (t < spec.toolReachedAt) {
      const reachTool = smooth(
        (t - spec.routeStartsAt) / (spec.toolReachedAt - spec.routeStartsAt),
      );
      player = pointAlongPolyline(spec.pickupRoute.map(point), reachTool);
    } else if (t < spec.carryStartsAt) player = point(spec.pedestal);
    else if (t < spec.combatReachedAt) {
      const carryTool = smooth(
        (t - spec.carryStartsAt) / (spec.combatReachedAt - spec.carryStartsAt),
      );
      player = pointAlongPolyline(spec.carryRoute.map(point), carryTool);
    } else if (t < spec.toolExpiresAt) player = point(spec.combatPoint);
    else if (t < spec.resetAt) {
      const reset = smooth((t - spec.toolExpiresAt) / (spec.resetAt - spec.toolExpiresAt));
      player = pointAlongPolyline(spec.resetRoute.map(point), reset);
    } else player = startPlayer;
  }
  if (spec.mode === 'player-controlled-boss') {
    if (t < spec.telegraph[0]) player = startPlayer;
    else if (t < spec.active[0]) {
      const dodge = clamp((t - spec.telegraph[0]) / (spec.active[0] - spec.telegraph[0]));
      player = pointAlongPolyline(spec.playerRoute.map(point), dodge);
    } else if (t < spec.resetAt) player = point(spec.playerRoute.at(-1));
    else {
      const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
      player = pointAlongPolyline([...spec.playerRoute].reverse().map(point), reset);
    }
  }
  if (spec.mode === 'projectile-rally') {
    const punishPoint = point(spec.punishPoint);
    if (t < spec.bossMissAt) player = startPlayer;
    else if (t < spec.punishAt) {
      const approach = smooth((t - spec.bossMissAt) / (spec.punishAt - spec.bossMissAt));
      player = {
        x: mix(startPlayer.x, punishPoint.x, approach),
        y: mix(startPlayer.y, punishPoint.y, approach),
      };
    } else if (t < spec.retreatAt) player = punishPoint;
    else if (t < spec.vulnerableUntil) {
      const retreat = smooth((t - spec.retreatAt) / (spec.vulnerableUntil - spec.retreatAt));
      player = {
        x: mix(punishPoint.x, startPlayer.x, retreat),
        y: mix(punishPoint.y, startPlayer.y, retreat),
      };
    } else player = startPlayer;
  }
  if (spec.mode === 'baited-self-hit') {
    const arm = point(spec.armPoint);
    const safe = point(spec.safePoint);
    const punish = point(spec.punishPoint);
    if (t < spec.approachAt) player = startPlayer;
    else if (t < spec.armReachedAt) {
      const approach = smooth((t - spec.approachAt) / (spec.armReachedAt - spec.approachAt));
      player = { x: mix(startPlayer.x, arm.x, approach), y: mix(startPlayer.y, arm.y, approach) };
    } else if (t < spec.armedAt) player = arm;
    else if (t < spec.aimAt) {
      const returnToBait = smooth((t - spec.armedAt) / (spec.aimAt - spec.armedAt));
      player = {
        x: mix(arm.x, startPlayer.x, returnToBait),
        y: mix(arm.y, startPlayer.y, returnToBait),
      };
    } else if (t < spec.evade[0]) player = startPlayer;
    else if (t < spec.evade[1]) {
      const evade = smooth((t - spec.evade[0]) / (spec.evade[1] - spec.evade[0]));
      player = { x: mix(startPlayer.x, safe.x, evade), y: mix(startPlayer.y, safe.y, evade) };
    } else if (t < spec.punishApproachAt) player = safe;
    else if (t < spec.punishAt) {
      const approach = smooth(
        (t - spec.punishApproachAt) / (spec.punishAt - spec.punishApproachAt),
      );
      player = { x: mix(safe.x, punish.x, approach), y: mix(safe.y, punish.y, approach) };
    } else if (t < spec.retreatAt) player = punish;
    else if (t < spec.vulnerableUntil) {
      const retreat = smooth((t - spec.retreatAt) / (spec.vulnerableUntil - spec.retreatAt));
      player = { x: mix(punish.x, safe.x, retreat), y: mix(punish.y, safe.y, retreat) };
    } else if (t < spec.resetAt) {
      const reset = smooth((t - spec.vulnerableUntil) / (spec.resetAt - spec.vulnerableUntil));
      player = { x: mix(safe.x, startPlayer.x, reset), y: mix(safe.y, startPlayer.y, reset) };
    } else player = startPlayer;
  }
  if (spec.mode === 'posture-stagger-gauge') {
    const pressure = point(spec.pressurePoint);
    const finisher = point(spec.finisherPoint);
    if (t < spec.pressureApproachAt) player = startPlayer;
    else if (t < spec.contacts[0]) {
      const approach = smooth(
        (t - spec.pressureApproachAt) / (spec.contacts[0] - spec.pressureApproachAt),
      );
      player = {
        x: mix(startPlayer.x, pressure.x, approach),
        y: mix(startPlayer.y, pressure.y, approach),
      };
    } else if (t < spec.breakAt) player = pressure;
    else if (t < spec.finisherApproachAt) player = pressure;
    else if (t < spec.finisherAt) {
      const approach = smooth(
        (t - spec.finisherApproachAt) / (spec.finisherAt - spec.finisherApproachAt),
      );
      player = {
        x: mix(pressure.x, finisher.x, approach),
        y: mix(pressure.y, finisher.y, approach),
      };
    } else if (t < spec.criticalEndsAt) player = finisher;
    else if (t < spec.resetAt) {
      const retreat = smooth((t - spec.criticalEndsAt) / (spec.resetAt - spec.criticalEndsAt));
      player = {
        x: mix(finisher.x, startPlayer.x, retreat),
        y: mix(finisher.y, startPlayer.y, retreat),
      };
    } else player = startPlayer;
  }
  if (spec.mode === 'pacifist-resolution') {
    const firstSafe = { x: 180, y: startPlayer.y };
    const secondSafe = { x: 300, y: startPlayer.y };
    const thirdSafe = { x: 420, y: startPlayer.y };
    const sparePoint = point(spec.sparePoint);
    if (t < spec.attacks[0].telegraph[0]) player = startPlayer;
    else if (t < spec.attacks[0].active[0]) {
      const move = smooth(
        (t - spec.attacks[0].telegraph[0]) /
          (spec.attacks[0].active[0] - spec.attacks[0].telegraph[0]),
      );
      player = { x: mix(startPlayer.x, firstSafe.x, move), y: startPlayer.y };
    } else if (t < spec.attacks[0].active[1]) player = firstSafe;
    else if (t < 1.6) {
      const move = smooth((t - spec.attacks[0].active[1]) / (1.6 - spec.attacks[0].active[1]));
      player = { x: mix(firstSafe.x, secondSafe.x, move), y: startPlayer.y };
    } else if (t < spec.attacks[1].active[1]) player = secondSafe;
    else if (t < spec.attacks[2].active[0]) {
      const move = smooth(
        (t - spec.attacks[1].active[1]) / (spec.attacks[2].active[0] - spec.attacks[1].active[1]),
      );
      player = { x: mix(secondSafe.x, thirdSafe.x, move), y: startPlayer.y };
    } else if (t < spec.spareApproachAt) player = thirdSafe;
    else if (t < spec.spareAt) {
      const approach = smooth((t - spec.spareApproachAt) / (spec.spareAt - spec.spareApproachAt));
      player = {
        x: mix(thirdSafe.x, sparePoint.x, approach),
        y: mix(thirdSafe.y, sparePoint.y, approach),
      };
    } else if (t < spec.choiceEndsAt) player = sparePoint;
    else if (t < spec.resetAt) {
      const reset = smooth((t - spec.choiceEndsAt) / (spec.resetAt - spec.choiceEndsAt));
      player = {
        x: mix(sparePoint.x, startPlayer.x, reset),
        y: mix(sparePoint.y, startPlayer.y, reset),
      };
    } else player = startPlayer;
  }
  if (spec.mode === 'persistent-progress') {
    const first = point(spec.strikePoints[0]);
    const second = point(spec.strikePoints[1]);
    const core = point(spec.corePoint);
    if (t < spec.approachStarts[0]) player = startPlayer;
    else if (t < spec.approachEnds[0]) {
      const approach = smooth(
        (t - spec.approachStarts[0]) / (spec.approachEnds[0] - spec.approachStarts[0]),
      );
      player = {
        x: mix(startPlayer.x, first.x, approach),
        y: mix(startPlayer.y, first.y, approach),
      };
    } else if (t < spec.restores[0][0]) player = first;
    else if (t < spec.restores[0][1]) {
      const restore = smooth(
        (t - spec.restores[0][0]) / (spec.restores[0][1] - spec.restores[0][0]),
      );
      player = { x: mix(first.x, startPlayer.x, restore), y: mix(first.y, startPlayer.y, restore) };
    } else if (t < spec.approachEnds[1]) {
      const approach = smooth(
        (t - spec.approachStarts[1]) / (spec.approachEnds[1] - spec.approachStarts[1]),
      );
      player = {
        x: mix(startPlayer.x, second.x, approach),
        y: mix(startPlayer.y, second.y, approach),
      };
    } else if (t < spec.restores[1][0]) player = second;
    else if (t < spec.restores[1][1]) {
      const restore = smooth(
        (t - spec.restores[1][0]) / (spec.restores[1][1] - spec.restores[1][0]),
      );
      player = {
        x: mix(second.x, startPlayer.x, restore),
        y: mix(second.y, startPlayer.y, restore),
      };
    } else if (t < spec.approachEnds[2]) {
      const approach = smooth(
        (t - spec.approachStarts[2]) / (spec.approachEnds[2] - spec.approachStarts[2]),
      );
      player = { x: mix(startPlayer.x, core.x, approach), y: mix(startPlayer.y, core.y, approach) };
    } else if (t < spec.retreatAt) player = core;
    else if (t < spec.resetAt) {
      const retreat = smooth((t - spec.retreatAt) / (spec.resetAt - spec.retreatAt));
      player = { x: mix(core.x, startPlayer.x, retreat), y: mix(core.y, startPlayer.y, retreat) };
    } else player = startPlayer;
  }
  if (spec.mode === 'status-buildup') {
    const exposure = point(spec.exposurePoint);
    if (t < spec.approach[0]) player = startPlayer;
    else if (t < spec.approach[1]) {
      const approach = smooth((t - spec.approach[0]) / (spec.approach[1] - spec.approach[0]));
      player = {
        x: mix(startPlayer.x, exposure.x, approach),
        y: mix(startPlayer.y, exposure.y, approach),
      };
    } else if (t < spec.retreat[0]) player = exposure;
    else if (t < spec.retreat[1]) {
      const retreat = smooth((t - spec.retreat[0]) / (spec.retreat[1] - spec.retreat[0]));
      player = {
        x: mix(exposure.x, startPlayer.x, retreat),
        y: mix(exposure.y, startPlayer.y, retreat),
      };
    } else if (t < spec.reenter[0]) player = startPlayer;
    else if (t < spec.reenter[1]) {
      const reenter = smooth((t - spec.reenter[0]) / (spec.reenter[1] - spec.reenter[0]));
      player = {
        x: mix(startPlayer.x, exposure.x, reenter),
        y: mix(startPlayer.y, exposure.y, reenter),
      };
    } else if (t < spec.immunityEndsAt) player = exposure;
    else if (t < spec.resetAt) {
      const reset = smooth((t - spec.immunityEndsAt) / (spec.resetAt - spec.immunityEndsAt));
      player = {
        x: mix(exposure.x, startPlayer.x, reset),
        y: mix(exposure.y, startPlayer.y, reset),
      };
    } else player = startPlayer;
  }
  if (spec.mode === 'instant-kill') {
    const safe = point(spec.safePoint);
    if (t < spec.firstEscape[0]) player = startPlayer;
    else if (t < spec.firstEscape[1]) {
      const escape = smooth(
        (t - spec.firstEscape[0]) / (spec.firstEscape[1] - spec.firstEscape[0]),
      );
      player = { x: mix(startPlayer.x, safe.x, escape), y: mix(startPlayer.y, safe.y, escape) };
    } else if (t < spec.return[0]) player = safe;
    else if (t < spec.return[1]) {
      const returning = smooth((t - spec.return[0]) / (spec.return[1] - spec.return[0]));
      player = {
        x: mix(safe.x, startPlayer.x, returning),
        y: mix(safe.y, startPlayer.y, returning),
      };
    } else player = startPlayer;
  }
  if (spec.mode === 'maximum-health-reduction') {
    const safe = point(spec.safePoint);
    if (t < spec.firstEscape[0]) player = startPlayer;
    else if (t < spec.firstEscape[1]) {
      const escape = smooth(
        (t - spec.firstEscape[0]) / (spec.firstEscape[1] - spec.firstEscape[0]),
      );
      player = { x: mix(startPlayer.x, safe.x, escape), y: mix(startPlayer.y, safe.y, escape) };
    } else if (t < spec.return[0]) player = safe;
    else if (t < spec.return[1]) {
      const returning = smooth((t - spec.return[0]) / (spec.return[1] - spec.return[0]));
      player = {
        x: mix(safe.x, startPlayer.x, returning),
        y: mix(safe.y, startPlayer.y, returning),
      };
    } else player = startPlayer;
  }
  if (spec.mode === 'ability-lock') {
    const safe = point(spec.safePoint);
    if (t < spec.firstEscape[0]) player = startPlayer;
    else if (t < spec.firstEscape[1]) {
      const escape = smooth(
        (t - spec.firstEscape[0]) / (spec.firstEscape[1] - spec.firstEscape[0]),
      );
      player = { x: mix(startPlayer.x, safe.x, escape), y: mix(startPlayer.y, safe.y, escape) };
    } else if (t < spec.return[0]) player = safe;
    else if (t < spec.return[1]) {
      const returning = smooth((t - spec.return[0]) / (spec.return[1] - spec.return[0]));
      player = {
        x: mix(safe.x, startPlayer.x, returning),
        y: mix(safe.y, startPlayer.y, returning),
      };
    } else player = startPlayer;
  }
  if (spec.mode === 'resource-steal') {
    const safe = point(spec.safePoint);
    const reclaim = point(spec.reclaimPoint);
    if (t < spec.firstEscape[0]) player = startPlayer;
    else if (t < spec.firstEscape[1]) {
      const escape = smooth(
        (t - spec.firstEscape[0]) / (spec.firstEscape[1] - spec.firstEscape[0]),
      );
      player = { x: mix(startPlayer.x, safe.x, escape), y: mix(startPlayer.y, safe.y, escape) };
    } else if (t < spec.return[0]) player = safe;
    else if (t < spec.return[1]) {
      const returning = smooth((t - spec.return[0]) / (spec.return[1] - spec.return[0]));
      player = {
        x: mix(safe.x, startPlayer.x, returning),
        y: mix(safe.y, startPlayer.y, returning),
      };
    } else if (t < spec.reclaim[0]) player = startPlayer;
    else if (t < spec.reclaim[1]) {
      const collecting = smooth((t - spec.reclaim[0]) / (spec.reclaim[1] - spec.reclaim[0]));
      player = {
        x: mix(startPlayer.x, reclaim.x, collecting),
        y: mix(startPlayer.y, reclaim.y, collecting),
      };
    } else if (t < spec.retreat[0]) player = reclaim;
    else if (t < spec.retreat[1]) {
      const retreat = smooth((t - spec.retreat[0]) / (spec.retreat[1] - spec.retreat[0]));
      player = {
        x: mix(reclaim.x, startPlayer.x, retreat),
        y: mix(reclaim.y, startPlayer.y, retreat),
      };
    } else player = startPlayer;
  }
  if (spec.mode === 'on-hit-healing') {
    const safe = point(spec.safePoint);
    if (t < spec.firstEscape[0]) player = startPlayer;
    else if (t < spec.firstEscape[1]) {
      const move = smooth((t - spec.firstEscape[0]) / (spec.firstEscape[1] - spec.firstEscape[0]));
      player = { x: mix(startPlayer.x, safe.x, move), y: mix(startPlayer.y, safe.y, move) };
    } else if (t < spec.return[0]) player = safe;
    else if (t < spec.return[1]) {
      const move = smooth((t - spec.return[0]) / (spec.return[1] - spec.return[0]));
      player = { x: mix(safe.x, startPlayer.x, move), y: mix(safe.y, startPlayer.y, move) };
    } else if (t < spec.thirdEscape[0]) player = startPlayer;
    else if (t < spec.thirdEscape[1]) {
      const move = smooth((t - spec.thirdEscape[0]) / (spec.thirdEscape[1] - spec.thirdEscape[0]));
      player = { x: mix(startPlayer.x, safe.x, move), y: mix(startPlayer.y, safe.y, move) };
    } else if (t < spec.counterReturn[0]) player = safe;
    else if (t < spec.counterReturn[1]) {
      const move = smooth(
        (t - spec.counterReturn[0]) / (spec.counterReturn[1] - spec.counterReturn[0]),
      );
      player = { x: mix(safe.x, startPlayer.x, move), y: mix(safe.y, startPlayer.y, move) };
    } else player = startPlayer;
  }
  if (spec.mode === 'self-heal-cast') {
    const interruptPoint = point(spec.interruptPoint);
    if (t < spec.approach[0]) player = startPlayer;
    else if (t < spec.approach[1]) {
      const move = smooth((t - spec.approach[0]) / (spec.approach[1] - spec.approach[0]));
      player = {
        x: mix(startPlayer.x, interruptPoint.x, move),
        y: mix(startPlayer.y, interruptPoint.y, move),
      };
    } else if (t < spec.return[0]) player = interruptPoint;
    else if (t < spec.return[1]) {
      const move = smooth((t - spec.return[0]) / (spec.return[1] - spec.return[0]));
      player = {
        x: mix(interruptPoint.x, startPlayer.x, move),
        y: mix(interruptPoint.y, startPlayer.y, move),
      };
    } else player = startPlayer;
  }
  if (spec.mode === 'external-healing-source') {
    const interceptPoint = point(spec.target);
    if (t < spec.approach[0]) player = startPlayer;
    else if (t < spec.approach[1]) {
      const move = smooth((t - spec.approach[0]) / (spec.approach[1] - spec.approach[0]));
      player = {
        x: mix(startPlayer.x, interceptPoint.x, move),
        y: mix(startPlayer.y, interceptPoint.y, move),
      };
    } else if (t < spec.return[0]) player = interceptPoint;
    else if (t < spec.return[1]) {
      const move = smooth((t - spec.return[0]) / (spec.return[1] - spec.return[0]));
      player = {
        x: mix(interceptPoint.x, startPlayer.x, move),
        y: mix(interceptPoint.y, startPlayer.y, move),
      };
    } else player = startPlayer;
  }
  if (spec.mode === 'rotating' && phase === 0) {
    const initialPosition = polar(boss, spec.safeOrbitRadius, Math.PI / 3);
    player = {
      x: mix(startPlayer.x, initialPosition.x, prepare),
      y: mix(startPlayer.y, initialPosition.y, prepare),
    };
  } else if (spec.mode === 'rotating' && phase === 1) {
    const safeSector = action * Math.PI * 1.25 + Math.PI / 3;
    player = polar(boss, spec.safeOrbitRadius, safeSector);
  } else if (spec.mode === 'rotating' && phase === 2) {
    const finalSector = Math.PI * 1.25 + Math.PI / 3;
    const finalPosition = polar(boss, spec.safeOrbitRadius, finalSector);
    player = {
      x: mix(finalPosition.x, startPlayer.x, returnProgress),
      y: mix(finalPosition.y, startPlayer.y, returnProgress),
    };
  } else if (spec.mode === 'orbiting-projectiles') {
    const gapOffset = Math.PI / spec.projectileCount;
    const finalAngle = spec.startAngle + spec.rotation + gapOffset;
    const finalPosition = polar(boss, 112, finalAngle);
    if (phase === 0) player = startPlayer;
    else if (phase === 1) {
      const angle = spec.startAngle + spec.rotation * action + gapOffset;
      player = polar(boss, mix(250, 112, responseProgress), angle);
    } else {
      player = {
        x: mix(finalPosition.x, startPlayer.x, returnProgress),
        y: mix(finalPosition.y, startPlayer.y, returnProgress),
      };
    }
  } else if (spec.mode === 'chain-explosions') {
    const wake = [startPlayer, ...spec.blastCenters.slice(0, -1).map(point)];
    const finalPosition = wake.at(-1);
    if (phase === 0) player = startPlayer;
    else if (phase === 1) player = pointAlongPolyline(wake, responseProgress);
    else {
      player = {
        x: mix(finalPosition.x, startPlayer.x, returnProgress),
        y: mix(finalPosition.y, startPlayer.y, returnProgress),
      };
    }
  } else if (spec.mode === 'mine') {
    const route = spec.safeRoute.map(point);
    const finalPosition = route.at(-1);
    if (phase === 0) player = startPlayer;
    else if (phase === 1) player = pointAlongPolyline(route, responseProgress);
    else {
      player = {
        x: mix(finalPosition.x, startPlayer.x, returnProgress),
        y: mix(finalPosition.y, startPlayer.y, returnProgress),
      };
    }
  }
  const route = Math.hypot(targetPlayer.x - startPlayer.x, targetPlayer.y - startPlayer.y);
  let stride =
    spec.mode === 'player-controlled-boss'
      ? Math.max(
          pulse(smooth((t - spec.telegraph[0]) / (spec.active[0] - spec.telegraph[0]))),
          pulse(smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt))) * 0.8,
        )
      : spec.mode === 'active-phase'
        ? Math.max(
            pulse(smooth((t - 0.72) / 0.68)),
            pulse(smooth((t - spec.active[1]) / (spec.followThroughEnd - spec.active[1]))),
            pulse(smooth((t - spec.recoveryEnd) / (BLUEPRINT_DURATION - spec.recoveryEnd))) * 0.8,
          )
        : spec.mode === 'recovery'
          ? Math.max(
              pulse(smooth((t - 0.62) / 0.58)),
              pulse(smooth((t - spec.recovery[0]) / 1.42)),
              pulse(smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt))) * 0.8,
            )
          : spec.mode === 'survival-phase'
            ? Math.max(
                ...spec.hazards.map(({ preview, active }) =>
                  pulse(smooth((t - (preview[0] + 0.015)) / (active[0] - preview[0] - 0.03))),
                ),
                pulse(smooth((t - spec.shieldDropsAt) / 0.58)),
                pulse(smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt))) * 0.8,
              )
            : spec.mode === 'teleport'
              ? Math.max(
                  pulse(
                    smooth(
                      (t - (spec.destinationPreview[0] + 0.08)) /
                        (spec.active[0] - spec.destinationPreview[0] - 0.26),
                    ),
                  ),
                  pulse(smooth((t - spec.active[1]) / 0.64)),
                  pulse(
                    smooth(
                      (t - spec.resetDeparture[0]) / (BLUEPRINT_DURATION - spec.resetDeparture[0]),
                    ),
                  ) * 0.8,
                )
              : spec.mode === 'boundary-attack'
                ? Math.max(
                    pulse(smooth((t - 0.72) / 0.72)),
                    pulse(smooth((t - spec.active[1]) / 0.62)),
                    pulse(smooth((t - (spec.punishAt + 0.2)) / 0.46)),
                    pulse(smooth((t - 4.72) / 0.86)) * 0.8,
                  )
                : spec.mode === 'forced-scrolling'
                  ? Math.max(
                      pulse(smooth((t - 0.72) / (spec.active[1] - 0.72))),
                      pulse(smooth((t - spec.active[1]) / 0.62)),
                      pulse(smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt))) * 0.8,
                    )
                  : spec.mode === 'chase-herding'
                    ? Math.max(
                        pulse(smooth((t - 0.72) / (spec.active[1] - 0.72))),
                        pulse(smooth((t - spec.active[1]) / 0.72)),
                        pulse(smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt))) *
                          0.8,
                      )
                    : spec.mode === 'escape-phase'
                      ? Math.max(
                          pulse(smooth((t - 0.72) / (spec.escape[1] - 0.72))),
                          pulse(smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt))) *
                            0.8,
                        )
                      : spec.mode === 'relocated-arena'
                        ? Math.max(
                            pulse(
                              smooth(
                                (t - spec.transfer[0]) / (spec.transfer[1] - spec.transfer[0]),
                              ),
                            ) * 0.45,
                            pulse(
                              smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt)),
                            ) * 0.8,
                          )
                        : spec.mode === 'control-mode-shift'
                          ? Math.max(
                              pulse(smooth(t / spec.previewAt)) * 0.72,
                              pulse(
                                smooth((t - spec.previewAt) / (spec.handoff[0] - spec.previewAt)),
                              ) * 0.55,
                              pulse(smooth((t - spec.wave[1]) / (spec.punishAt - spec.wave[1]))) *
                                0.65,
                              pulse(
                                smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt)),
                              ) * 0.8,
                            )
                          : spec.mode === 'boss-as-terrain'
                            ? Math.max(
                                pulse(smooth((t - spec.revealAt) / (spec.mountAt - spec.revealAt))),
                                pulse(smooth((t - spec.mountAt) / (spec.shake[0] - spec.mountAt))),
                                pulse(
                                  smooth(
                                    (t - spec.shake[1]) / (spec.weakPointOpensAt - spec.shake[1]),
                                  ),
                                ),
                                pulse(smooth((t - spec.drop[0]) / (spec.drop[1] - spec.drop[0]))),
                                pulse(
                                  smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt)),
                                ) * 0.8,
                              )
                            : spec.mode === 'forced-inertia'
                              ? Math.max(
                                  pulse(
                                    smooth((t - spec.vectorAt) / (spec.commitAt - spec.vectorAt)),
                                  ) * 0.45,
                                  pulse(
                                    clamp((t - spec.slide[0]) / (spec.slide[1] - spec.slide[0])),
                                  ) * 0.38,
                                  pulse(
                                    smooth((t - spec.brake[1]) / (spec.punishAt - spec.brake[1])),
                                  ),
                                  pulse(
                                    smooth(
                                      (t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt),
                                    ),
                                  ) * 0.8,
                                )
                              : spec.mode === 'wraparound-projectile'
                                ? Math.max(
                                    pulse(
                                      smooth(
                                        (t - spec.signalAt) / (spec.releaseAt - spec.signalAt),
                                      ),
                                    ),
                                    pulse(
                                      smooth(
                                        (t - spec.secondPass[1]) /
                                          (spec.punishAt - spec.secondPass[1]),
                                      ),
                                    ),
                                    pulse(
                                      smooth(
                                        (t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt),
                                      ),
                                    ) * 0.8,
                                  )
                                : spec.mode === 'beat-synced-attack'
                                  ? Math.max(
                                      ...Array.from({ length: 9 }, (_, index) =>
                                        pulse(
                                          smooth(
                                            (t - (spec.beatOrigin + index * spec.beatInterval)) /
                                              0.22,
                                          ),
                                        ),
                                      ),
                                      pulse(
                                        smooth(
                                          (t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt),
                                        ),
                                      ) * 0.8,
                                    )
                                  : spec.mode === 'secondary-cues-invisibility'
                                    ? Math.max(
                                        pulse(
                                          smooth(
                                            (t - spec.hiddenAt) / (spec.lockAt - spec.hiddenAt),
                                          ),
                                        ),
                                        pulse(
                                          smooth(
                                            (t - spec.attack[1]) / (spec.punishAt - spec.attack[1]),
                                          ),
                                        ),
                                        pulse(
                                          smooth(
                                            (t - spec.resetAt) /
                                              (BLUEPRINT_DURATION - spec.resetAt),
                                          ),
                                        ) * 0.8,
                                      )
                                    : spec.mode === 'sound-detection'
                                      ? Math.max(
                                          pulse(
                                            smooth(
                                              (t - spec.quietAt) / (spec.noiseAt - spec.quietAt),
                                            ),
                                          ),
                                          pulse(
                                            smooth(
                                              (t - spec.heardAt) / (spec.lockAt - spec.heardAt),
                                            ),
                                          ),
                                          pulse(
                                            smooth(
                                              (t - spec.searchEndsAt) /
                                                (spec.punishAt - spec.searchEndsAt),
                                            ),
                                          ),
                                          pulse(
                                            smooth(
                                              (t - spec.resetAt) /
                                                (BLUEPRINT_DURATION - spec.resetAt),
                                            ),
                                          ) * 0.8,
                                        )
                                      : spec.mode === 'objective-linked-invulnerability'
                                        ? Math.max(
                                            pulse(smooth((t - 0.74) / 0.44)),
                                            pulse(
                                              smooth(
                                                (t - spec.objectiveHits[0]) /
                                                  (spec.objectiveHits[1] - spec.objectiveHits[0]),
                                              ),
                                            ),
                                            pulse(
                                              smooth(
                                                (t - spec.objectiveHits[1]) /
                                                  (spec.objectiveHits[2] - spec.objectiveHits[1]),
                                              ),
                                            ),
                                            pulse(smooth((t - spec.objectiveHits[2]) / 0.62)),
                                            pulse(
                                              smooth(
                                                (t - spec.vulnerable[1]) /
                                                  (spec.shieldReturns - spec.vulnerable[1]),
                                              ),
                                            ),
                                            pulse(
                                              smooth(
                                                (t - spec.resetAt) /
                                                  (BLUEPRINT_DURATION - spec.resetAt),
                                              ),
                                            ) * 0.8,
                                          )
                                        : spec.mode === 'wave-clear-objective'
                                          ? Math.max(
                                              ...spec.waveSpawns.map((spawn, index) =>
                                                pulse(
                                                  smooth(
                                                    (t -
                                                      (index === 0
                                                        ? 0.55
                                                        : spec.waveClears[index - 1])) /
                                                      (spec.waveKills[index].at(-1) -
                                                        (index === 0
                                                          ? 0.55
                                                          : spec.waveClears[index - 1])),
                                                  ),
                                                ),
                                              ),
                                              pulse(
                                                smooth(
                                                  (t - spec.waveClears.at(-1)) /
                                                    (spec.rewardAt - spec.waveClears.at(-1)),
                                                ),
                                              ),
                                              pulse(
                                                smooth(
                                                  (t - spec.resetAt) /
                                                    (BLUEPRINT_DURATION - spec.resetAt),
                                                ),
                                              ) * 0.8,
                                            )
                                          : spec.mode === 'environmental-weapon'
                                            ? Math.max(
                                                pulse(
                                                  smooth(
                                                    (t - spec.routeStartsAt) /
                                                      (spec.powerReachedAt - spec.routeStartsAt),
                                                  ),
                                                ),
                                                pulse(
                                                  smooth(
                                                    (t - spec.deviceRouteAt) /
                                                      (spec.deviceReachedAt - spec.deviceRouteAt),
                                                  ),
                                                ),
                                                pulse(
                                                  smooth(
                                                    (t - spec.spentAt) /
                                                      (spec.rewardAt - spec.spentAt),
                                                  ),
                                                ),
                                                pulse(
                                                  smooth(
                                                    (t - spec.resetAt) /
                                                      (BLUEPRINT_DURATION - spec.resetAt),
                                                  ),
                                                ) * 0.8,
                                              )
                                            : spec.mode === 'encounter-specific-tool'
                                              ? Math.max(
                                                  pulse(
                                                    smooth(
                                                      (t - spec.routeStartsAt) /
                                                        (spec.toolReachedAt - spec.routeStartsAt),
                                                    ),
                                                  ),
                                                  pulse(
                                                    smooth(
                                                      (t - spec.carryStartsAt) /
                                                        (spec.combatReachedAt - spec.carryStartsAt),
                                                    ),
                                                  ),
                                                  pulse(
                                                    smooth(
                                                      (t - spec.toolExpiresAt) /
                                                        (spec.resetAt - spec.toolExpiresAt),
                                                    ),
                                                  ),
                                                )
                                              : pulse(responseProgress) +
                                                pulse(returnProgress) * 0.8;
  if (spec.mode === 'projectile-rally')
    stride = Math.max(
      pulse(smooth((t - spec.bossMissAt) / (spec.punishAt - spec.bossMissAt))),
      pulse(smooth((t - spec.retreatAt) / (spec.vulnerableUntil - spec.retreatAt))),
    );
  if (spec.mode === 'baited-self-hit')
    stride = Math.max(
      pulse(smooth((t - spec.approachAt) / (spec.armReachedAt - spec.approachAt))),
      pulse(smooth((t - spec.armedAt) / (spec.aimAt - spec.armedAt))),
      pulse(smooth((t - spec.evade[0]) / (spec.evade[1] - spec.evade[0]))),
      pulse(smooth((t - spec.punishApproachAt) / (spec.punishAt - spec.punishApproachAt))),
      pulse(smooth((t - spec.retreatAt) / (spec.vulnerableUntil - spec.retreatAt))),
      pulse(smooth((t - spec.vulnerableUntil) / (spec.resetAt - spec.vulnerableUntil))) * 0.8,
    );
  if (spec.mode === 'posture-stagger-gauge')
    stride = Math.max(
      pulse(smooth((t - spec.finisherApproachAt) / (spec.finisherAt - spec.finisherApproachAt))),
      pulse(smooth((t - spec.criticalEndsAt) / (spec.resetAt - spec.criticalEndsAt))),
    );
  if (spec.mode === 'pacifist-resolution')
    stride = Math.max(
      pulse(
        smooth(
          (t - spec.attacks[0].telegraph[0]) /
            (spec.attacks[0].active[0] - spec.attacks[0].telegraph[0]),
        ),
      ),
      pulse(smooth((t - spec.attacks[0].active[1]) / (1.6 - spec.attacks[0].active[1]))),
      pulse(
        smooth(
          (t - spec.attacks[1].active[1]) / (spec.attacks[2].active[0] - spec.attacks[1].active[1]),
        ),
      ),
      pulse(smooth((t - spec.spareApproachAt) / (spec.spareAt - spec.spareApproachAt))),
      pulse(smooth((t - spec.choiceEndsAt) / (spec.resetAt - spec.choiceEndsAt))),
    );
  if (spec.mode === 'persistent-progress')
    stride = Math.max(
      ...spec.approachStarts.map((start, index) =>
        pulse(smooth((t - start) / (spec.approachEnds[index] - start))),
      ),
      ...spec.restores.map(([start, end]) => pulse(smooth((t - start) / (end - start)))),
      pulse(smooth((t - spec.retreatAt) / (spec.resetAt - spec.retreatAt))),
    );
  if (spec.mode === 'status-buildup')
    stride = Math.max(
      pulse(smooth((t - spec.approach[0]) / (spec.approach[1] - spec.approach[0]))),
      pulse(smooth((t - spec.retreat[0]) / (spec.retreat[1] - spec.retreat[0]))),
      pulse(smooth((t - spec.reenter[0]) / (spec.reenter[1] - spec.reenter[0]))),
      pulse(smooth((t - spec.immunityEndsAt) / (spec.resetAt - spec.immunityEndsAt))),
    );
  if (spec.mode === 'instant-kill')
    stride = Math.max(
      pulse(smooth((t - spec.firstEscape[0]) / (spec.firstEscape[1] - spec.firstEscape[0]))),
      pulse(smooth((t - spec.return[0]) / (spec.return[1] - spec.return[0]))),
    );
  if (spec.mode === 'maximum-health-reduction')
    stride = Math.max(
      pulse(smooth((t - spec.firstEscape[0]) / (spec.firstEscape[1] - spec.firstEscape[0]))),
      pulse(smooth((t - spec.return[0]) / (spec.return[1] - spec.return[0]))),
    );
  if (spec.mode === 'ability-lock')
    stride = Math.max(
      pulse(smooth((t - spec.firstEscape[0]) / (spec.firstEscape[1] - spec.firstEscape[0]))),
      pulse(smooth((t - spec.return[0]) / (spec.return[1] - spec.return[0]))),
    );
  if (spec.mode === 'resource-steal')
    stride = Math.max(
      pulse(smooth((t - spec.firstEscape[0]) / (spec.firstEscape[1] - spec.firstEscape[0]))),
      pulse(smooth((t - spec.return[0]) / (spec.return[1] - spec.return[0]))),
      pulse(smooth((t - spec.reclaim[0]) / (spec.reclaim[1] - spec.reclaim[0]))),
      pulse(smooth((t - spec.retreat[0]) / (spec.retreat[1] - spec.retreat[0]))),
    );
  if (spec.mode === 'on-hit-healing')
    stride = Math.max(
      pulse(smooth((t - spec.firstEscape[0]) / (spec.firstEscape[1] - spec.firstEscape[0]))),
      pulse(smooth((t - spec.return[0]) / (spec.return[1] - spec.return[0]))),
      pulse(smooth((t - spec.thirdEscape[0]) / (spec.thirdEscape[1] - spec.thirdEscape[0]))),
      pulse(smooth((t - spec.counterReturn[0]) / (spec.counterReturn[1] - spec.counterReturn[0]))),
    );
  if (spec.mode === 'self-heal-cast')
    stride = Math.max(
      pulse(smooth((t - spec.approach[0]) / (spec.approach[1] - spec.approach[0]))),
      pulse(smooth((t - spec.return[0]) / (spec.return[1] - spec.return[0]))),
    );
  if (spec.mode === 'external-healing-source')
    stride = Math.max(
      pulse(smooth((t - spec.approach[0]) / (spec.approach[1] - spec.approach[0]))),
      pulse(smooth((t - spec.return[0]) / (spec.return[1] - spec.return[0]))),
    );
  if (spec.mode === 'ally-theft') {
    const firstDodge = smooth((t - spec.shotTimes[0]) / 0.3);
    const secondDodge = smooth((t - spec.shotTimes[1]) / 0.3);
    const thirdDodge = smooth((t - spec.shotTimes[2]) / 0.3);
    const reset = smooth((t - spec.returning[1]) / (spec.resetAt - spec.returning[1]));
    const afterFirst = mix(startPlayer.x, 205, firstDodge);
    const afterSecond = mix(afterFirst, 365, secondDodge);
    const afterThird = mix(afterSecond, 220, thirdDodge);
    player = {
      x: mix(afterThird, startPlayer.x, reset),
      y: mix(660, startPlayer.y, reset),
    };
    stride = Math.max(pulse(firstDodge), pulse(secondDodge), pulse(thirdDodge), pulse(reset));
  }
  if (spec.mode === 'false-death') {
    const approach = smooth((t - 0.2) / (spec.strikeAt - 0.2));
    const retreat = smooth((t - spec.strikeAt) / (spec.collapse[1] - spec.strikeAt));
    const dodge = smooth(
      (t - spec.secondSignal[0]) / (spec.secondActive[0] - spec.secondSignal[0]),
    );
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const strikePosition = point(spec.strikePosition);
    const retreatPosition = point(spec.retreatPosition);
    const dodgePosition = point(spec.dodgePosition);
    const approached = {
      x: mix(startPlayer.x, strikePosition.x, approach),
      y: mix(startPlayer.y, strikePosition.y, approach),
    };
    const retreated = {
      x: mix(approached.x, retreatPosition.x, retreat),
      y: mix(approached.y, retreatPosition.y, retreat),
    };
    const dodged = {
      x: mix(retreated.x, dodgePosition.x, dodge),
      y: mix(retreated.y, dodgePosition.y, dodge),
    };
    player = {
      x: mix(dodged.x, startPlayer.x, reset),
      y: mix(dodged.y, startPlayer.y, reset),
    };
    stride = Math.max(pulse(approach), pulse(retreat), pulse(dodge), pulse(reset));
  }
  if (spec.mode === 'action-reactive-punish') {
    const dodge = smooth((t - spec.playerDodge[0]) / (spec.playerDodge[1] - spec.playerDodge[0]));
    const returning = smooth(
      (t - spec.playerReturn[0]) / (spec.playerReturn[1] - spec.playerReturn[0]),
    );
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const dodgePosition = point(spec.dodgePosition);
    const dodged = {
      x: mix(startPlayer.x, dodgePosition.x, dodge),
      y: mix(startPlayer.y, dodgePosition.y, dodge),
    };
    const returned = {
      x: mix(dodged.x, startPlayer.x, returning),
      y: mix(dodged.y, startPlayer.y, returning),
    };
    player = {
      x: mix(returned.x, startPlayer.x, reset),
      y: mix(returned.y, startPlayer.y, reset),
    };
    stride = Math.max(pulse(dodge), pulse(returning), pulse(reset));
  }
  if (spec.mode === 'run-history-manifestation') {
    const move = smooth((t - spec.playerMove[0]) / (spec.playerMove[1] - spec.playerMove[0]));
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const ward = point(spec.ward);
    const protectedPlayer = {
      x: mix(startPlayer.x, ward.x, move),
      y: mix(startPlayer.y, ward.y, move),
    };
    player = {
      x: mix(protectedPlayer.x, startPlayer.x, reset),
      y: mix(protectedPlayer.y, startPlayer.y, reset),
    };
    stride = Math.max(pulse(move), pulse(reset));
  }
  if (spec.mode === 'real-time-progression') {
    const move = smooth((t - spec.playerMove[0]) / (spec.playerMove[1] - spec.playerMove[0]));
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const safe = point(spec.target);
    const movedPlayer = {
      x: mix(startPlayer.x, safe.x, move),
      y: mix(startPlayer.y, safe.y, move),
    };
    player = {
      x: mix(movedPlayer.x, startPlayer.x, reset),
      y: mix(movedPlayer.y, startPlayer.y, reset),
    };
    stride = Math.max(pulse(move), pulse(reset));
  }
  if (spec.mode === 'interface-interaction') {
    const move = smooth((t - spec.playerMove[0]) / (spec.playerMove[1] - spec.playerMove[0]));
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const safe = point(spec.target);
    const movedPlayer = {
      x: mix(startPlayer.x, safe.x, move),
      y: mix(startPlayer.y, safe.y, move),
    };
    player = {
      x: mix(movedPlayer.x, startPlayer.x, reset),
      y: mix(movedPlayer.y, startPlayer.y, reset),
    };
    stride = Math.max(pulse(move), pulse(reset));
  }
  if (spec.mode === 'world-state-variant') {
    const move = smooth((t - spec.playerMove[0]) / (spec.playerMove[1] - spec.playerMove[0]));
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const safe = point(spec.target);
    const movedPlayer = {
      x: mix(startPlayer.x, safe.x, move),
      y: mix(startPlayer.y, safe.y, move),
    };
    player = {
      x: mix(movedPlayer.x, startPlayer.x, reset),
      y: mix(movedPlayer.y, startPlayer.y, reset),
    };
    stride = Math.max(pulse(move), pulse(reset));
  }
  if (spec.mode === 'party-size-scaling') {
    const move = smooth((t - spec.playerMove[0]) / (spec.playerMove[1] - spec.playerMove[0]));
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const safe = point(spec.target);
    const movedPlayer = {
      x: mix(startPlayer.x, safe.x, move),
      y: mix(startPlayer.y, safe.y, move),
    };
    player = {
      x: mix(movedPlayer.x, startPlayer.x, reset),
      y: mix(movedPlayer.y, startPlayer.y, reset),
    };
    stride = Math.max(pulse(move), pulse(reset));
  }
  if (spec.mode === 'partner-revival') {
    const firstApproach = smooth(t / spec.firstDownAt);
    const retreat = smooth((t - spec.firstDownAt) / 0.7);
    const interruptApproach = smooth(
      (t - spec.secondDownAt) / (spec.interruptAt - spec.secondDownAt),
    );
    const finishApproach = smooth(
      (t - spec.interruptAt) / (spec.survivorDownAt - spec.interruptAt),
    );
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const start = point(spec.player);
    const first = point(spec.firstApproach);
    const wait = point(spec.waitPoint);
    const interrupt = point(spec.interruptPoint);
    const finish = point(spec.finishPoint);
    const staged =
      t < spec.firstDownAt
        ? { x: mix(start.x, first.x, firstApproach), y: mix(start.y, first.y, firstApproach) }
        : t < spec.secondDownAt
          ? { x: mix(first.x, wait.x, retreat), y: mix(first.y, wait.y, retreat) }
          : t < spec.interruptAt
            ? {
                x: mix(wait.x, interrupt.x, interruptApproach),
                y: mix(wait.y, interrupt.y, interruptApproach),
              }
            : {
                x: mix(interrupt.x, finish.x, finishApproach),
                y: mix(interrupt.y, finish.y, finishApproach),
              };
    player = {
      x: mix(staged.x, start.x, reset),
      y: mix(staged.y, start.y, reset),
    };
    stride = Math.max(
      pulse(firstApproach),
      pulse(retreat),
      pulse(interruptApproach),
      pulse(finishApproach),
      pulse(reset),
    );
  }
  if (spec.mode === 'kill-order-inheritance') {
    const start = point(spec.player);
    const first = point(spec.firstApproach);
    const firstSafe = point(spec.firstSafe);
    const second = point(spec.secondApproach);
    const secondSafe = point(spec.secondSafe);
    const moveFirst = smooth(t / spec.firstDefeatAt);
    const dodgeWave = smooth((t - spec.firstDefeatAt) / 0.85);
    const returnCenter = smooth((t - spec.waveActive[1]) / 0.6);
    const moveSecond = smooth(
      (t - spec.intermission[1]) / (spec.secondDefeatAt - spec.intermission[1]),
    );
    const dodgeLance = smooth((t - spec.secondDefeatAt) / 0.8);
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const between = { x: 290, y: 710 };
    const staged =
      t < spec.firstDefeatAt
        ? { x: mix(start.x, first.x, moveFirst), y: mix(start.y, first.y, moveFirst) }
        : t < spec.waveActive[1]
          ? { x: mix(first.x, firstSafe.x, dodgeWave), y: mix(first.y, firstSafe.y, dodgeWave) }
          : t < spec.intermission[1]
            ? {
                x: mix(firstSafe.x, between.x, returnCenter),
                y: mix(firstSafe.y, between.y, returnCenter),
              }
            : t < spec.secondDefeatAt
              ? { x: mix(between.x, second.x, moveSecond), y: mix(between.y, second.y, moveSecond) }
              : {
                  x: mix(second.x, secondSafe.x, dodgeLance),
                  y: mix(second.y, secondSafe.y, dodgeLance),
                };
    player = { x: mix(staged.x, start.x, reset), y: mix(staged.y, start.y, reset) };
    stride = Math.max(
      pulse(moveFirst),
      pulse(dodgeWave),
      pulse(returnCenter),
      pulse(moveSecond),
      pulse(dodgeLance),
      pulse(reset),
    );
  }
  if (spec.mode === 'shared-group-health') {
    const start = point(spec.player);
    const first = point(spec.firstApproach);
    const firstSafe = point(spec.firstSafe);
    const second = point(spec.secondApproach);
    const secondSafe = point(spec.secondSafe);
    const finish = point(spec.finalApproach);
    const towardFirst = smooth(t / spec.firstHitAt);
    const dodgeFirst = smooth((t - spec.firstHitAt) / 1.15);
    const towardSecond = smooth(
      (t - spec.firstAttack[1]) / (spec.secondHitAt - spec.firstAttack[1]),
    );
    const dodgeSecond = smooth((t - spec.secondHitAt) / 0.65);
    const towardFinish = smooth((t - 4.35) / (spec.finalHitAt - 4.35));
    const retry = smooth((t - spec.retryAt) / (BLUEPRINT_DURATION - spec.retryAt));
    const staged =
      t < spec.firstHitAt
        ? { x: mix(start.x, first.x, towardFirst), y: mix(start.y, first.y, towardFirst) }
        : t < spec.firstAttack[1]
          ? { x: mix(first.x, firstSafe.x, dodgeFirst), y: mix(first.y, firstSafe.y, dodgeFirst) }
          : t < spec.secondHitAt
            ? {
                x: mix(firstSafe.x, second.x, towardSecond),
                y: mix(firstSafe.y, second.y, towardSecond),
              }
            : t < 4.35
              ? {
                  x: mix(second.x, secondSafe.x, dodgeSecond),
                  y: mix(second.y, secondSafe.y, dodgeSecond),
                }
              : {
                  x: mix(secondSafe.x, finish.x, towardFinish),
                  y: mix(secondSafe.y, finish.y, towardFinish),
                };
    player = { x: mix(staged.x, start.x, retry), y: mix(staged.y, start.y, retry) };
    stride = Math.max(
      pulse(towardFirst),
      pulse(dodgeFirst),
      pulse(towardSecond),
      pulse(dodgeSecond),
      pulse(towardFinish),
      pulse(retry),
    );
  }
  if (spec.mode === 'coordinated-duo-attack') {
    const start = point(spec.player);
    const safe = point(spec.safePoint);
    const interrupt = point(spec.interruptPoint);
    const retreat = point(spec.retreatPoint);
    const escape = smooth((t - 0.72) / 1.1);
    const approach = smooth(
      (t - spec.followerAttack[1]) / (spec.interruptAt - spec.followerAttack[1]),
    );
    const withdraw = smooth((t - spec.interruptAt) / 1.02);
    const retry = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const staged =
      t < spec.followerAttack[1]
        ? { x: mix(start.x, safe.x, escape), y: mix(start.y, safe.y, escape) }
        : t < spec.interruptAt
          ? { x: mix(safe.x, interrupt.x, approach), y: mix(safe.y, interrupt.y, approach) }
          : { x: mix(interrupt.x, retreat.x, withdraw), y: mix(interrupt.y, retreat.y, withdraw) };
    player = { x: mix(staged.x, start.x, retry), y: mix(staged.y, start.y, retry) };
    stride = Math.max(pulse(escape), pulse(approach), pulse(withdraw), pulse(retry));
  }
  if (spec.mode === 'stack-damage') {
    player = point(spec.player);
    stride = 0;
  }
  if (spec.mode === 'personal-spread') {
    player = point(spec.player);
    stride = 0;
  }
  if (spec.mode === 'tower-soak') {
    const enterFirst = smooth((t - spec.enterFirst[0]) / (spec.enterFirst[1] - spec.enterFirst[0]));
    const returnMiddle = smooth(
      (t - spec.returnMiddle[0]) / (spec.returnMiddle[1] - spec.returnMiddle[0]),
    );
    const enterSecond = smooth(
      (t - spec.enterSecond[0]) / (spec.enterSecond[1] - spec.enterSecond[0]),
    );
    const retry = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const first = mix(spec.player[0], spec.firstTower[0], enterFirst);
    const middle = mix(first, spec.player[0], returnMiddle);
    const second = mix(middle, spec.secondTower[0], enterSecond);
    player = { x: mix(second, spec.player[0], retry), y: spec.player[1] };
    stride = Math.max(pulse(enterFirst), pulse(returnMiddle), pulse(enterSecond), pulse(retry));
  }
  if (spec.mode === 'entity-tether') {
    const together = smooth(
      (t - spec.travelTogether[0]) / (spec.travelTogether[1] - spec.travelTogether[0]),
    );
    const regroup = smooth((t - spec.regroup[0]) / (spec.regroup[1] - spec.regroup[0]));
    const apart = smooth((t - spec.travelApart[0]) / (spec.travelApart[1] - spec.travelApart[0]));
    const retry = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const moved = {
      x: mix(spec.player[0], spec.togetherPlayer[0], together),
      y: mix(spec.player[1], spec.togetherPlayer[1], together),
    };
    const returned = {
      x: mix(moved.x, spec.player[0], regroup),
      y: mix(moved.y, spec.player[1], regroup),
    };
    const separated = {
      x: mix(returned.x, spec.apartPlayer[0], apart),
      y: mix(returned.y, spec.apartPlayer[1], apart),
    };
    player = {
      x: mix(separated.x, spec.player[0], retry),
      y: mix(separated.y, spec.player[1], retry),
    };
    stride = Math.max(pulse(together), pulse(regroup), pulse(apart), pulse(retry));
  }
  if (spec.mode === 'proximity-damage') {
    const far = smooth((t - spec.moveFar[0]) / (spec.moveFar[1] - spec.moveFar[0]));
    const near = smooth((t - spec.moveNear[0]) / (spec.moveNear[1] - spec.moveNear[0]));
    const retry = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const staged = mix(mix(spec.player[1], spec.farPoint[1], far), spec.nearPoint[1], near);
    player = { x: spec.player[0], y: mix(staged, spec.player[1], retry) };
    stride = Math.max(pulse(far), pulse(near), pulse(retry));
  }
  if (spec.mode === 'tank-swap') {
    const exit = smooth((t - spec.swapMove[0]) / (spec.swapMove[1] - spec.swapMove[0]));
    const retry = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    player = {
      x: mix(mix(spec.player[0], spec.playerExit[0], exit), spec.player[0], retry),
      y: mix(mix(spec.player[1], spec.playerExit[1], exit), spec.player[1], retry),
    };
    stride = Math.max(pulse(exit), pulse(retry));
  }
  if (spec.mode === 'debuff-handoff') {
    const firstApproach = smooth(
      (t - spec.firstApproach[0]) / (spec.firstApproach[1] - spec.firstApproach[0]),
    );
    const firstRetreat = smooth(
      (t - spec.firstRetreat[0]) / (spec.firstRetreat[1] - spec.firstRetreat[0]),
    );
    const secondApproach = smooth(
      (t - spec.secondApproach[0]) / (spec.secondApproach[1] - spec.secondApproach[0]),
    );
    const secondRetreat = smooth(
      (t - spec.secondRetreat[0]) / (spec.secondRetreat[1] - spec.secondRetreat[0]),
    );
    const contact = Math.max(
      firstApproach * (1 - firstRetreat),
      secondApproach * (1 - secondRetreat),
    );
    player = {
      x: mix(spec.player[0], spec.playerContact[0], contact),
      y: mix(spec.player[1], spec.playerContact[1], contact),
    };
    stride = Math.max(
      pulse(firstApproach),
      pulse(firstRetreat),
      pulse(secondApproach),
      pulse(secondRetreat),
    );
  }
  if (spec.mode === 'ordered-targets') {
    const moveOut = smooth((t - spec.move[0]) / (spec.move[1] - spec.move[0]));
    const moveBack = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const progress = moveOut * (1 - moveBack);
    player = {
      x: mix(spec.player[0], spec.receivingSpots[0][0], progress),
      y: mix(spec.player[1], spec.receivingSpots[0][1], progress),
    };
    stride = Math.max(pulse(moveOut), pulse(moveBack));
  }
  if (spec.mode === 'pairing-polarity') {
    const moveOut = smooth((t - spec.move[0]) / (spec.move[1] - spec.move[0]));
    const moveBack = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const progress = moveOut * (1 - moveBack);
    player = {
      x: mix(spec.player[0], spec.receivingSpots[0][0], progress),
      y: mix(spec.player[1], spec.receivingSpots[0][1], progress),
    };
    stride = Math.max(pulse(moveOut), pulse(moveBack));
  }
  if (spec.mode === 'party-split') {
    const work = smooth((t - spec.move[0]) / (spec.move[1] - spec.move[0]));
    const reunite = smooth((t - spec.reunite[0]) / (spec.reunite[1] - spec.reunite[0]));
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const x = mix(
      mix(mix(spec.player[0], spec.workSpots[0][0], work), spec.reunionSpots[0][0], reunite),
      spec.player[0],
      reset,
    );
    const y = mix(
      mix(mix(spec.player[1], spec.workSpots[0][1], work), spec.reunionSpots[0][1], reunite),
      spec.player[1],
      reset,
    );
    player = { x, y };
    stride = Math.max(pulse(work), pulse(reunite), pulse(reset));
  }
  const bossVisible =
    spec.mode === 'secondary-cues-invisibility'
      ? t < spec.vanishAt
        ? 1
        : t < spec.hiddenAt
          ? 1 - smooth((t - spec.vanishAt) / (spec.hiddenAt - spec.vanishAt))
          : t < spec.attack[1]
            ? 0
            : t < spec.revealAt
              ? smooth((t - spec.attack[1]) / (spec.revealAt - spec.attack[1]))
              : 1
      : spec.mode === 'burrow' && phase === 1 && action < 0.68
        ? 0
        : spec.mode === 'teleport'
          ? t < spec.departure[0]
            ? 1
            : t < spec.absent[0]
              ? 1 - smooth((t - spec.departure[0]) / (spec.absent[0] - spec.departure[0]))
              : t < spec.arrival[0]
                ? 0
                : t < spec.arrival[1]
                  ? smooth((t - spec.arrival[0]) / (spec.arrival[1] - spec.arrival[0]))
                  : t < spec.resetDeparture[0]
                    ? 1
                    : t < spec.resetAbsent[0]
                      ? 1 -
                        smooth(
                          (t - spec.resetDeparture[0]) /
                            (spec.resetAbsent[0] - spec.resetDeparture[0]),
                        )
                      : t < spec.resetArrival[0]
                        ? 0
                        : smooth(
                            (t - spec.resetArrival[0]) /
                              (spec.resetArrival[1] - spec.resetArrival[0]),
                          )
          : 1;
  const decoy =
    spec.mode === 'decoy'
      ? {
          x: mix(startBoss.x, spec.mirror[0], phase === 0 ? prepare : 1),
          y: mix(startBoss.y, spec.mirror[1], phase === 0 ? prepare : 1),
          opacity: phase === 0 ? 0.12 + prepare * 0.53 : phase === 1 ? 0.65 : 0.65 * (1 - recover),
        }
      : spec.mode === 'partner-revival'
        ? {
            x: spec.partner[0],
            y: spec.partner[1],
            rotation:
              (t >= spec.firstDownAt && t < spec.firstReviveAt) ||
              (t >= spec.secondDownAt && t < spec.retry[0])
                ? 70
                : 0,
            opacity:
              t < spec.firstDownAt
                ? 1
                : t < spec.firstReviveAt
                  ? 0.82
                  : t < spec.secondDownAt
                    ? mix(0.82, 1, smooth((t - spec.firstReviveAt) / 0.3))
                    : t < spec.retry[0]
                      ? 0.82
                      : 1,
          }
        : spec.mode === 'kill-order-inheritance'
          ? {
              x: spec.partner[0],
              y: spec.partner[1],
              rotation: t >= spec.firstDefeatAt && t < spec.intermission[0] ? 70 : 0,
              opacity:
                t < spec.firstDefeatAt
                  ? 1
                  : t < spec.intermission[0]
                    ? 0.78
                    : t < spec.intermission[1]
                      ? mix(
                          0.78,
                          1,
                          smooth(
                            (t - spec.intermission[0]) /
                              (spec.intermission[1] - spec.intermission[0]),
                          ),
                        )
                      : 1,
            }
          : spec.mode === 'shared-group-health'
            ? {
                x: spec.partner[0],
                y: spec.partner[1],
                opacity:
                  t >= spec.finalHitAt && t < spec.retryAt
                    ? 0.18
                    : t < spec.withdrawAt || t >= spec.returnAt
                      ? 1
                      : 0.16,
              }
            : spec.mode === 'coordinated-duo-attack'
              ? {
                  x: mix(
                    mix(
                      spec.partner[0],
                      spec.leaderAnchor[0],
                      smooth((t - spec.leaderMove[0]) / (spec.leaderMove[1] - spec.leaderMove[0])),
                    ),
                    spec.partner[0],
                    smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt)),
                  ),
                  y: mix(
                    mix(
                      spec.partner[1],
                      spec.leaderAnchor[1],
                      smooth((t - spec.leaderMove[0]) / (spec.leaderMove[1] - spec.leaderMove[0])),
                    ),
                    spec.partner[1],
                    smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt)),
                  ),
                  opacity: 1,
                }
              : null;
  const predicted =
    spec.mode === 'predictive-aim'
      ? {
          x:
            (phase === 0
              ? player.x
              : startPlayer.x + spec.approachVelocity * BLUEPRINT_PHASE_ENDS[0]) +
            spec.approachVelocity * spec.leadSeconds,
          y: startPlayer.y,
        }
      : null;
  const sourceAngle =
    spec.mode === 'source-track'
      ? Math.atan2(
          (phase === 0 ? player : point(spec.lock)).y - spec.emitter[1],
          (phase === 0 ? player : point(spec.lock)).x - spec.emitter[0],
        )
      : null;
  const committed = t >= BLUEPRINT_PHASE_ENDS[0];
  const dangerActive =
    spec.mode === 'spiral'
      ? spiralShots(boss, t).some((shot) => shot.active)
      : spec.mode === 'target-lock'
        ? t >= spec.impact[0] && t < spec.impact[1]
        : spec.mode === 'marked'
          ? t >= spec.impact[0] && t < spec.impact[1]
          : spec.mode === 'landing'
            ? phase === 1 && action >= 0.49 && action <= 0.64
            : spec.mode === 'pulse-beam'
              ? phase === 1 && pulseBeamIndex(action) >= 0
              : spec.mode === 'chain-explosions'
                ? phase === 1 && chainExplosionIndex(action) >= 0
                : spec.mode === 'turret-deployment'
                  ? phase === 1 && action >= 0.2 && action <= 0.88
                  : spec.mode === 'threat-generator'
                    ? GENERATOR_RELEASES.some(
                        (release) => t >= release && t <= release + GENERATOR_FLIGHT,
                      )
                    : spec.mode === 'predictive-aim'
                      ? phase === 1 && t <= 3.75
                      : spec.mode === 'source-track'
                        ? phase === 1 && t >= 2.4 && t <= 3.8
                        : spec.mode === 'burst-fire'
                          ? spec.releases.some(
                              (release) => t >= release && t <= release + spec.flight,
                            )
                          : spec.mode === 'volley'
                            ? t >= spec.release && t <= spec.release + spec.flight
                            : spec.mode === 'delayed-activation'
                              ? t >= spec.activatesAt && t < spec.expiresAt
                              : spec.mode === 'speed-change'
                                ? t >= BLUEPRINT_PHASE_ENDS[0] && t < spec.finishAt
                                : spec.mode === 'limited-spread'
                                  ? spec.releases.some(
                                      (release) => t >= release && t < release + spec.flight,
                                    )
                                  : spec.mode === 'directional-shield'
                                    ? t >= BLUEPRINT_PHASE_ENDS[0] && t < spec.guardEnd
                                    : spec.mode === 'damage-type-resistance' ||
                                        spec.mode === 'situational-immunity'
                                      ? phase === 1
                                      : spec.mode === 'part-break'
                                        ? t >= spec.firstShot[0] && t < spec.firstShot[1]
                                        : spec.mode === 'attack-reflection'
                                          ? t >= spec.reflected[0] && t < spec.reflected[1]
                                          : spec.mode === 'counter-stance'
                                            ? t >= spec.riposte[0] && t < spec.riposte[1]
                                            : spec.mode === 'absorption-power-up'
                                              ? t >= spec.shockwave[0] && t < spec.shockwave[1]
                                              : spec.mode === 'interruptible-wind-up'
                                                ? t >= spec.release[0] && t < spec.release[1]
                                                : spec.mode === 'loadout-adaptation'
                                                  ? (t >= spec.reachAttack[0] &&
                                                      t < spec.reachAttack[1]) ||
                                                    (t >= spec.burstAttack[0] &&
                                                      t < spec.burstAttack[1])
                                                  : spec.mode === 'wind-up'
                                                    ? (t >= spec.firstRelease[0] &&
                                                        t < spec.firstRelease[1]) ||
                                                      (t >= spec.secondRelease[0] &&
                                                        t < spec.secondRelease[1])
                                                    : spec.mode === 'attack-lock'
                                                      ? (t >= spec.firstRelease[0] &&
                                                          t < spec.firstRelease[1]) ||
                                                        (t >= spec.secondRelease[0] &&
                                                          t < spec.secondRelease[1])
                                                      : spec.mode === 'active-phase'
                                                        ? t >= spec.active[0] && t < spec.active[1]
                                                        : spec.mode === 'recovery'
                                                          ? t >= spec.active[0] &&
                                                            t < spec.active[1]
                                                          : spec.mode === 'survival-phase'
                                                            ? spec.hazards.some(
                                                                ({ active }) =>
                                                                  t >= active[0] && t < active[1],
                                                              )
                                                            : spec.mode === 'teleport'
                                                              ? t >= spec.active[0] &&
                                                                t < spec.active[1]
                                                              : spec.mode === 'boundary-attack'
                                                                ? t >= spec.active[0] &&
                                                                  t < spec.active[1]
                                                                : spec.mode === 'forced-scrolling'
                                                                  ? t >= spec.active[0] &&
                                                                    t < spec.active[1]
                                                                  : spec.mode === 'chase-herding'
                                                                    ? false
                                                                    : spec.mode === 'escape-phase'
                                                                      ? false
                                                                      : spec.mode ===
                                                                          'relocated-arena'
                                                                        ? false
                                                                        : spec.mode ===
                                                                            'control-mode-shift'
                                                                          ? t >= spec.wave[0] &&
                                                                            t < spec.wave[1]
                                                                          : spec.mode ===
                                                                              'boss-as-terrain'
                                                                            ? t >= spec.shake[0] &&
                                                                              t < spec.shake[1]
                                                                            : spec.mode ===
                                                                                'cover-line-of-sight'
                                                                              ? t >= spec.beam[0] &&
                                                                                t < spec.beam[1]
                                                                              : spec.mode ===
                                                                                  'forced-inertia'
                                                                                ? t >=
                                                                                    spec.slide[0] &&
                                                                                  t < spec.slide[1]
                                                                                : spec.mode ===
                                                                                    'wraparound-projectile'
                                                                                  ? t >=
                                                                                      spec.releaseAt &&
                                                                                    t <
                                                                                      spec
                                                                                        .secondPass[1]
                                                                                  : spec.mode ===
                                                                                      'beat-synced-attack'
                                                                                    ? spec.hits.some(
                                                                                        (hit) =>
                                                                                          Math.abs(
                                                                                            t - hit,
                                                                                          ) <=
                                                                                          spec.attackDuration /
                                                                                            2,
                                                                                      )
                                                                                    : spec.mode ===
                                                                                        'secondary-cues-invisibility'
                                                                                      ? t >=
                                                                                          spec
                                                                                            .attack[0] &&
                                                                                        t <
                                                                                          spec
                                                                                            .attack[1]
                                                                                      : spec.mode ===
                                                                                          'sound-detection'
                                                                                        ? t >=
                                                                                            spec
                                                                                              .attack[0] &&
                                                                                          t <
                                                                                            spec
                                                                                              .attack[1]
                                                                                        : spec.mode ===
                                                                                            'player-controlled-boss'
                                                                                          ? t >=
                                                                                              spec
                                                                                                .active[0] &&
                                                                                            t <
                                                                                              spec
                                                                                                .active[1]
                                                                                          : phase ===
                                                                                            1;
  const frame = {
    id,
    mode: spec.mode,
    time: t,
    phase,
    prepare,
    action,
    recover,
    committed,
    dangerActive,
    playerSafe: true,
    boss,
    player,
    decoy,
    predicted,
    sourceAngle,
    bossVisible,
    bossScale:
      spec.mode === 'boss-as-terrain'
        ? 2.4
        : spec.mode === 'phase'
          ? 1 + action * 0.12
          : spec.mode === 'enrage'
            ? phase === 0
              ? 1 + prepare * 0.1
              : 1.1
            : 1,
    bossFacing:
      spec.mode === 'arc'
        ? 90
        : spec.mode === 'landing'
          ? (Math.atan2(spec.landing[1] - spec.boss[1], spec.landing[0] - spec.boss[0]) * 180) /
            Math.PI
          : spec.mode === 'boundary-attack'
            ? t < spec.openingEnd
              ? 0
              : t < 4.55
                ? -90
                : t < 5.35
                  ? 180
                  : 90
            : spec.mode === 'forced-scrolling'
              ? -90
              : spec.mode === 'chase-herding'
                ? 90
                : spec.mode === 'escape-phase'
                  ? 90
                  : spec.mode === 'boss-as-terrain'
                    ? 180
                    : spec.mode === 'control-mode-shift'
                      ? t < spec.handoff[0]
                        ? 90
                        : t < spec.resetAt
                          ? 180
                          : mix(
                              180,
                              90,
                              smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt)),
                            )
                      : 90,
    playerFacing:
      spec.mode === 'directional-shield'
        ? mix(-90, -180, smooth((t - 2.7) / 0.68)) * (1 - returnProgress) - 90 * returnProgress
        : spec.mode === 'gaze-check'
          ? mix(
              mix(
                spec.initialFacing,
                spec.safeFacing,
                smooth((t - spec.turnAway[0]) / (spec.turnAway[1] - spec.turnAway[0])),
              ),
              spec.initialFacing,
              smooth((t - spec.turnToward[0]) / (spec.turnToward[1] - spec.turnToward[0])),
            )
          : spec.mode === 'player-controlled-boss' ||
              spec.mode === 'projectile-rally' ||
              spec.mode === 'baited-self-hit' ||
              spec.mode === 'posture-stagger-gauge' ||
              spec.mode === 'pacifist-resolution' ||
              spec.mode === 'persistent-progress' ||
              spec.mode === 'status-buildup' ||
              spec.mode === 'instant-kill' ||
              spec.mode === 'maximum-health-reduction' ||
              spec.mode === 'ability-lock' ||
              spec.mode === 'resource-steal' ||
              spec.mode === 'on-hit-healing' ||
              spec.mode === 'self-heal-cast' ||
              spec.mode === 'external-healing-source' ||
              spec.mode === 'damage-rate-cap' ||
              spec.mode === 'loadout-mirror' ||
              spec.mode === 'moveset-shapeshifting' ||
              spec.mode === 'ally-theft' ||
              spec.mode === 'false-death' ||
              spec.mode === 'action-reactive-punish' ||
              spec.mode === 'run-history-manifestation' ||
              spec.mode === 'real-time-progression' ||
              spec.mode === 'interface-interaction' ||
              spec.mode === 'world-state-variant' ||
              spec.mode === 'party-size-scaling' ||
              spec.mode === 'partner-revival' ||
              spec.mode === 'kill-order-inheritance' ||
              spec.mode === 'shared-group-health' ||
              spec.mode === 'coordinated-duo-attack' ||
              spec.mode === 'stack-damage'
            ? (Math.atan2(boss.y - player.y, boss.x - player.x) * 180) / Math.PI
            : spec.mode === 'active-phase'
              ? (Math.atan2(boss.y - player.y, boss.x - player.x) * 180) / Math.PI
              : spec.mode === 'recovery'
                ? (Math.atan2(boss.y - player.y, boss.x - player.x) * 180) / Math.PI
                : spec.mode === 'survival-phase'
                  ? (Math.atan2(boss.y - player.y, boss.x - player.x) * 180) / Math.PI
                  : spec.mode === 'teleport'
                    ? (Math.atan2(boss.y - player.y, boss.x - player.x) * 180) / Math.PI
                    : spec.mode === 'boundary-attack'
                      ? (Math.atan2(boss.y - player.y, boss.x - player.x) * 180) / Math.PI
                      : spec.mode === 'forced-scrolling'
                        ? (Math.atan2(boss.y - player.y, boss.x - player.x) * 180) / Math.PI
                        : spec.mode === 'chase-herding'
                          ? (Math.atan2(boss.y - player.y, boss.x - player.x) * 180) / Math.PI
                          : spec.mode === 'escape-phase'
                            ? (Math.atan2(boss.y - player.y, boss.x - player.x) * 180) / Math.PI
                            : spec.mode === 'relocated-arena'
                              ? (Math.atan2(boss.y - player.y, boss.x - player.x) * 180) / Math.PI
                              : spec.mode === 'cover-line-of-sight'
                                ? (Math.atan2(boss.y - player.y, boss.x - player.x) * 180) / Math.PI
                                : spec.mode === 'forced-inertia'
                                  ? (Math.atan2(boss.y - player.y, boss.x - player.x) * 180) /
                                    Math.PI
                                  : spec.mode === 'wraparound-projectile'
                                    ? (Math.atan2(boss.y - player.y, boss.x - player.x) * 180) /
                                      Math.PI
                                    : spec.mode === 'beat-synced-attack'
                                      ? (Math.atan2(boss.y - player.y, boss.x - player.x) * 180) /
                                        Math.PI
                                      : spec.mode === 'secondary-cues-invisibility'
                                        ? (Math.atan2(boss.y - player.y, boss.x - player.x) * 180) /
                                          Math.PI
                                        : spec.mode === 'sound-detection'
                                          ? (Math.atan2(boss.y - player.y, boss.x - player.x) *
                                              180) /
                                            Math.PI
                                          : spec.mode === 'objective-linked-invulnerability'
                                            ? (Math.atan2(boss.y - player.y, boss.x - player.x) *
                                                180) /
                                              Math.PI
                                            : spec.mode === 'wave-clear-objective'
                                              ? (Math.atan2(boss.y - player.y, boss.x - player.x) *
                                                  180) /
                                                Math.PI
                                              : spec.mode === 'environmental-weapon'
                                                ? (Math.atan2(
                                                    boss.y - player.y,
                                                    boss.x - player.x,
                                                  ) *
                                                    180) /
                                                  Math.PI
                                                : spec.mode === 'encounter-specific-tool'
                                                  ? (Math.atan2(
                                                      boss.y - player.y,
                                                      boss.x - player.x,
                                                    ) *
                                                      180) /
                                                    Math.PI
                                                  : spec.mode === 'boss-as-terrain'
                                                    ? (Math.atan2(
                                                        boss.y - player.y,
                                                        boss.x - player.x,
                                                      ) *
                                                        180) /
                                                      Math.PI
                                                    : spec.mode === 'control-mode-shift'
                                                      ? (Math.atan2(
                                                          boss.y - player.y,
                                                          boss.x - player.x,
                                                        ) *
                                                          180) /
                                                        Math.PI
                                                      : spec.mode === 'damage-type-resistance' ||
                                                          spec.mode === 'situational-immunity' ||
                                                          spec.mode === 'part-break' ||
                                                          spec.mode === 'attack-reflection' ||
                                                          spec.mode === 'counter-stance' ||
                                                          spec.mode === 'absorption-power-up' ||
                                                          spec.mode === 'interruptible-wind-up' ||
                                                          spec.mode === 'loadout-adaptation' ||
                                                          spec.mode === 'wind-up'
                                                        ? -180
                                                        : -90,
    bossMotion: motion({
      gait:
        spec.mode === 'landing'
          ? (Math.hypot(spec.landing[0] - spec.boss[0], spec.landing[1] - spec.boss[1]) *
              returnProgress) /
            32
          : spec.mode === 'chase-herding' ||
              spec.mode === 'escape-phase' ||
              spec.mode === 'relocated-arena' ||
              spec.mode === 'sound-detection'
            ? t * 6
            : 0,
      stride:
        spec.mode === 'landing'
          ? 0.65 * speed((t - 4.65) / 1.2)
          : (spec.mode === 'chase-herding' && t >= spec.active[0] && t < spec.active[1]) ||
              (spec.mode === 'escape-phase' && t >= spec.escape[0] && t < spec.escape[1]) ||
              (spec.mode === 'sound-detection' &&
                t >= spec.investigate[0] &&
                t < spec.investigate[1]) ||
              (spec.mode === 'relocated-arena' && t >= spec.resetAt)
            ? 0.72
            : 0,
      lean:
        spec.mode === 'player-controlled-boss'
          ? -0.22 * smooth((t - spec.actionQueuedAt) / (spec.active[0] - spec.actionQueuedAt)) +
            0.48 * strikePulse(t, spec.active[0], 0.62)
          : spec.mode === 'landing'
            ? phase === 0
              ? -0.3 * prepare
              : 0.36 * pulse(clamp(action / 0.52))
            : spec.mode === 'wind-up'
              ? -0.34 * windUpProgress(t) +
                0.46 *
                  Math.max(
                    strikePulse(t, spec.firstRelease[0], 0.5),
                    strikePulse(t, spec.secondRelease[0], 0.5),
                  )
              : spec.mode === 'active-phase'
                ? -0.28 * smooth((t - spec.startup[0]) / (spec.active[0] - spec.startup[0])) +
                  0.5 *
                    smooth((t - spec.active[0]) / (spec.followThroughEnd - spec.active[0])) *
                    (1 - smooth((t - spec.followThroughEnd) / 0.68))
                : spec.mode === 'recovery'
                  ? -0.28 * smooth((t - spec.startup[0]) / (spec.active[0] - spec.startup[0])) +
                    0.5 * strikePulse(t, spec.active[0], 0.72) +
                    0.24 *
                      smooth((t - spec.recovery[0]) / 0.34) *
                      (1 - smooth((t - spec.recovery[1]) / 0.34))
                  : spec.mode === 'survival-phase'
                    ? 0.12 *
                      Math.max(...spec.hazards.map(({ active }) => strikePulse(t, active[0], 0.34)))
                    : spec.mode === 'teleport'
                      ? 0.46 * strikePulse(t, spec.active[0], 0.66)
                      : spec.mode === 'boundary-attack'
                        ? 0.38 * strikePulse(t, spec.active[0], 0.7) +
                          0.28 * strikePulse(t, spec.impactAt, 0.52)
                        : spec.mode === 'forced-scrolling'
                          ? -0.18 * smooth((t - spec.signal[0]) / 0.5) +
                            0.35 * strikePulse(t, spec.active[1], 0.62)
                          : spec.mode === 'chase-herding'
                            ? -0.28 *
                                smooth((t - spec.signal[0]) / 0.5) *
                                (1 - smooth((t - spec.active[1]) / 0.42)) +
                              0.32 * strikePulse(t, spec.active[1], 0.58)
                            : spec.mode === 'escape-phase'
                              ? -0.3 *
                                  smooth((t - spec.triggerAt) / 0.5) *
                                  (1 - smooth((t - spec.escape[1]) / 0.42)) +
                                0.4 * strikePulse(t, spec.escape[1], 0.58)
                              : spec.mode === 'relocated-arena'
                                ? 0.38 * strikePulse(t, spec.transfer[1], 0.56)
                                : spec.mode === 'control-mode-shift'
                                  ? -0.28 *
                                      smooth(
                                        (t - spec.previewAt) / (spec.handoff[1] - spec.previewAt),
                                      ) *
                                      (1 - smooth((t - spec.wave[0]) / 0.45)) +
                                    0.34 * strikePulse(t, spec.wave[0], 0.58)
                                  : phase === 0
                                    ? -0.22 * prepare
                                    : 0.24 * pulse(action),
      crouch:
        spec.mode === 'landing'
          ? phase === 0
            ? 0.42 * prepare
            : 0.62 * strikePulse(t, 3, 0.32)
          : spec.mode === 'wind-up'
            ? 0.34 * windUpProgress(t)
            : spec.mode === 'recovery'
              ? 0.3 *
                smooth((t - spec.startup[0]) / (spec.active[0] - spec.startup[0])) *
                (1 - smooth((t - spec.recovery[1]) / 0.34))
              : spec.mode === 'survival-phase'
                ? 0.12 *
                  Math.max(...spec.hazards.map(({ active }) => strikePulse(t, active[0], 0.34)))
                : spec.mode === 'teleport'
                  ? 0.28 * strikePulse(t, spec.active[0], 0.66)
                  : spec.mode === 'boundary-attack'
                    ? 0.3 * strikePulse(t, spec.impactAt, 0.55)
                    : spec.mode === 'forced-scrolling'
                      ? 0.24 *
                        smooth((t - spec.signal[0]) / 0.5) *
                        (1 - smooth((t - spec.active[1]) / 0.45))
                      : spec.mode === 'chase-herding'
                        ? 0.18 *
                          smooth((t - spec.signal[0]) / 0.5) *
                          (1 - smooth((t - spec.active[1]) / 0.45))
                        : spec.mode === 'escape-phase'
                          ? 0.2 *
                            smooth((t - spec.triggerAt) / 0.5) *
                            (1 - smooth((t - spec.escape[1]) / 0.45))
                          : spec.mode === 'relocated-arena'
                            ? 0.22 * strikePulse(t, spec.transfer[1], 0.52)
                            : spec.mode === 'control-mode-shift'
                              ? 0.24 * strikePulse(t, spec.handoff[1], 0.52)
                              : 0.2 * prepare,
      lift:
        spec.mode === 'landing' && phase === 1
          ? pulse(clamp(action / 0.51))
          : spec.mode === 'relocated-arena' && t >= spec.transfer[0] && t < spec.transfer[1]
            ? pulse(smooth((t - spec.transfer[0]) / (spec.transfer[1] - spec.transfer[0])))
            : 0,
      altitude: spec.mode === 'landing' && phase === 1 ? 150 * pulse(clamp(action / 0.51)) : 0,
      attack:
        spec.mode === 'speed-change'
          ? dangerActive
            ? t >= spec.switchAt
              ? 1
              : 0.55
            : 0
          : spec.mode === 'volley' && phase === 1
            ? Math.max(0, 1 - Math.abs(t - spec.release) / 0.36)
            : spec.mode === 'limited-spread' && phase === 1
              ? Math.max(
                  ...spec.releases.map((release) => Math.max(0, 1 - Math.abs(t - release) / 0.3)),
                )
              : spec.mode === 'burst-fire' && phase === 1
                ? Math.max(
                    ...spec.releases.map((release) =>
                      Math.max(0, 1 - Math.abs(t - release) / 0.32),
                    ),
                  )
                : spec.mode === 'part-break'
                  ? Math.max(
                      strikePulse(t, spec.firstShot[0], 0.33),
                      strikePulse(t, spec.secondAttempt, 0.33),
                    )
                  : spec.mode === 'attack-reflection'
                    ? strikePulse(t, spec.outgoing[1], 0.38)
                    : spec.mode === 'counter-stance'
                      ? strikePulse(t, spec.riposte[0], 0.52)
                      : spec.mode === 'absorption-power-up'
                        ? strikePulse(t, spec.shockwave[0], 0.62)
                        : spec.mode === 'interruptible-wind-up'
                          ? Math.max(
                              strikePulse(t, spec.interruptAt - 0.28, 0.8),
                              strikePulse(t, spec.release[0], 0.72),
                            )
                          : spec.mode === 'loadout-adaptation'
                            ? Math.max(
                                strikePulse(t, spec.reachAttack[0], 0.64),
                                strikePulse(t, spec.burstAttack[0], 0.68),
                              )
                            : spec.mode === 'wind-up'
                              ? Math.max(
                                  strikePulse(t, spec.firstRelease[0], 0.62),
                                  strikePulse(t, spec.secondRelease[0], 0.62),
                                )
                              : spec.mode === 'attack-lock'
                                ? Math.max(
                                    strikePulse(t, spec.firstRelease[0], 0.6),
                                    strikePulse(t, spec.secondRelease[0], 0.6),
                                  )
                                : spec.mode === 'active-phase'
                                  ? smooth(
                                      (t - spec.startup[0]) / (spec.active[0] - spec.startup[0]),
                                    ) *
                                    (1 - smooth((t - spec.followThroughEnd) / 0.72))
                                  : spec.mode === 'recovery'
                                    ? smooth(
                                        (t - spec.startup[0]) / (spec.active[0] - spec.startup[0]),
                                      ) *
                                      (1 - smooth((t - spec.recovery[0]) / 0.4))
                                    : spec.mode === 'survival-phase'
                                      ? Math.max(
                                          ...spec.hazards.map(({ active }) =>
                                            strikePulse(t, active[0], 0.5),
                                          ),
                                        )
                                      : spec.mode === 'teleport'
                                        ? strikePulse(t, spec.active[0], 0.68)
                                        : spec.mode === 'boundary-attack'
                                          ? strikePulse(t, spec.active[0], 0.72)
                                          : spec.mode === 'forced-scrolling'
                                            ? smooth(
                                                (t - spec.signal[0]) /
                                                  (spec.active[0] - spec.signal[0]),
                                              ) *
                                              (1 - smooth((t - spec.active[1]) / 0.4))
                                            : spec.mode === 'relocated-arena'
                                              ? 0
                                              : spec.mode === 'control-mode-shift'
                                                ? Math.max(
                                                    strikePulse(t, spec.handoff[0], 0.72),
                                                    strikePulse(t, spec.wave[0], 0.68),
                                                  )
                                                : spec.mode === 'forced-inertia'
                                                  ? Math.max(
                                                      strikePulse(t, spec.frostAt, 0.72),
                                                      strikePulse(t, spec.slide[0], 0.62),
                                                    )
                                                  : spec.mode === 'cover-line-of-sight'
                                                    ? dangerActive
                                                      ? 1
                                                      : 0.25 *
                                                        smooth(
                                                          (t - spec.lockAt) /
                                                            (spec.beam[0] - spec.lockAt),
                                                        )
                                                    : phase === 1
                                                      ? 0.75
                                                      : prepare * 0.35,
      impact:
        spec.mode === 'landing'
          ? pulse(clamp((action - 0.42) / 0.22))
          : spec.mode === 'directional-shield'
            ? strikePulse(t, spec.sideStrike, 0.27)
            : spec.mode === 'damage-type-resistance'
              ? 0.18 * strikePulse(t, spec.slashStrike, 0.25) +
                0.9 * strikePulse(t, spec.thrustStrike, 0.28)
              : spec.mode === 'situational-immunity'
                ? 0.12 * strikePulse(t, spec.blockedStrike, 0.25) +
                  0.9 * strikePulse(t, spec.openStrike, 0.28)
                : spec.mode === 'objective-linked-invulnerability'
                  ? 0.12 * strikePulse(t, spec.blockedStrike, 0.25) +
                    0.9 * strikePulse(t, spec.bossStrike, 0.3)
                  : spec.mode === 'wave-clear-objective'
                    ? Math.max(...spec.waveKills.flat().map((kill) => strikePulse(t, kill, 0.26)))
                    : spec.mode === 'environmental-weapon'
                      ? 0.95 * strikePulse(t, spec.hitAt, 0.38)
                      : spec.mode === 'encounter-specific-tool'
                        ? 0.95 * strikePulse(t, spec.hitAt, 0.38)
                        : spec.mode === 'part-break'
                          ? 0.75 * strikePulse(t, spec.breakAt, 0.26)
                          : spec.mode === 'attack-reflection'
                            ? 0.85 * strikePulse(t, spec.meleeStrike, 0.27)
                            : spec.mode === 'counter-stance'
                              ? 0.85 * strikePulse(t, spec.openStrike, 0.27)
                              : spec.mode === 'absorption-power-up'
                                ? 0.85 * strikePulse(t, spec.openStrike, 0.27)
                                : spec.mode === 'interruptible-wind-up'
                                  ? 0.9 * strikePulse(t, spec.interruptAt, 0.3)
                                  : spec.mode === 'wind-up'
                                    ? 0.65 *
                                      Math.max(
                                        strikePulse(t, spec.firstRelease[0], 0.28),
                                        strikePulse(t, spec.secondRelease[0], 0.28),
                                      )
                                    : spec.mode === 'attack-lock'
                                      ? 0.55 *
                                        Math.max(
                                          strikePulse(t, spec.firstRelease[0], 0.28),
                                          strikePulse(t, spec.secondRelease[0], 0.28),
                                        )
                                      : spec.mode === 'active-phase'
                                        ? strikePulse(t, spec.active[0], 0.3)
                                        : spec.mode === 'recovery'
                                          ? Math.max(
                                              0.55 * strikePulse(t, spec.active[0], 0.3),
                                              0.85 * strikePulse(t, spec.punishAt, 0.3),
                                            )
                                          : spec.mode === 'survival-phase'
                                            ? Math.max(
                                                ...spec.hazards.map(
                                                  ({ active }) =>
                                                    0.45 * strikePulse(t, active[0], 0.28),
                                                ),
                                                0.85 * strikePulse(t, spec.punishAt, 0.3),
                                              )
                                            : spec.mode === 'teleport'
                                              ? Math.max(
                                                  0.6 * strikePulse(t, spec.active[0], 0.3),
                                                  0.85 * strikePulse(t, spec.punishAt, 0.3),
                                                )
                                              : spec.mode === 'boundary-attack'
                                                ? Math.max(
                                                    0.7 * strikePulse(t, spec.impactAt, 0.3),
                                                    0.85 * strikePulse(t, spec.punishAt, 0.3),
                                                  )
                                                : spec.mode === 'forced-scrolling'
                                                  ? Math.max(
                                                      0.55 * strikePulse(t, spec.active[1], 0.32),
                                                      0.85 * strikePulse(t, spec.punishAt, 0.3),
                                                    )
                                                  : spec.mode === 'chase-herding'
                                                    ? Math.max(
                                                        0.55 * strikePulse(t, spec.active[1], 0.32),
                                                        0.85 * strikePulse(t, spec.punishAt, 0.3),
                                                      )
                                                    : spec.mode === 'escape-phase'
                                                      ? Math.max(
                                                          0.72 *
                                                            strikePulse(t, spec.escape[1], 0.32),
                                                          0.85 * strikePulse(t, spec.punishAt, 0.3),
                                                        )
                                                      : spec.mode === 'relocated-arena'
                                                        ? 0.72 *
                                                          strikePulse(t, spec.transfer[1], 0.32)
                                                        : spec.mode === 'control-mode-shift'
                                                          ? 0.85 *
                                                            strikePulse(t, spec.punishAt, 0.3)
                                                          : spec.mode === 'forced-inertia'
                                                            ? Math.max(
                                                                0.55 *
                                                                  strikePulse(
                                                                    t,
                                                                    spec.frostAt,
                                                                    0.36,
                                                                  ),
                                                                0.85 *
                                                                  strikePulse(
                                                                    t,
                                                                    spec.punishAt,
                                                                    0.3,
                                                                  ),
                                                              )
                                                            : spec.mode === 'cover-line-of-sight'
                                                              ? 0.85 *
                                                                strikePulse(t, spec.punishAt, 0.3)
                                                              : spec.mode === 'shockwave' ||
                                                                  spec.mode === 'knockback'
                                                                ? pulse(action * 3)
                                                                : spec.mode === 'chain-explosions'
                                                                  ? pulse((action * 5) % 1)
                                                                  : 0,
    }),
    playerMotion: motion({
      gait:
        spec.mode === 'player-controlled-boss'
          ? t * 7 * stride
          : spec.mode === 'active-phase'
            ? t * 7 * stride
            : spec.mode === 'recovery'
              ? t * 7 * stride
              : spec.mode === 'survival-phase'
                ? t * 7 * stride
                : spec.mode === 'teleport'
                  ? t * 7 * stride
                  : spec.mode === 'boundary-attack'
                    ? t * 7 * stride
                    : spec.mode === 'forced-scrolling'
                      ? t * 7 * stride
                      : spec.mode === 'chase-herding'
                        ? t * 7 * stride
                        : spec.mode === 'escape-phase'
                          ? t * 7 * stride
                          : spec.mode === 'relocated-arena'
                            ? t * 7 * stride
                            : spec.mode === 'control-mode-shift'
                              ? t * 7 * stride
                              : spec.mode === 'boss-as-terrain'
                                ? t * 7 * stride
                                : spec.mode === 'cover-line-of-sight'
                                  ? t * 7 * stride
                                  : spec.mode === 'forced-inertia'
                                    ? t * 7 * stride
                                    : spec.mode === 'wraparound-projectile'
                                      ? t * 7 * stride
                                      : spec.mode === 'beat-synced-attack'
                                        ? t * 7 * stride
                                        : spec.mode === 'secondary-cues-invisibility'
                                          ? t * 7 * stride
                                          : spec.mode === 'sound-detection'
                                            ? t * 7 * stride
                                            : spec.mode === 'objective-linked-invulnerability'
                                              ? t * 7 * stride
                                              : spec.mode === 'wave-clear-objective'
                                                ? t * 7 * stride
                                                : spec.mode === 'environmental-weapon'
                                                  ? t * 7 * stride
                                                  : spec.mode === 'encounter-specific-tool'
                                                    ? t * 7 * stride
                                                    : (route * responseProgress +
                                                        route * returnProgress) /
                                                      20,
      stride,
      lean: stride * 0.45,
      crouch:
        spec.mode === 'control-mode-shift'
          ? 0.34 *
            Math.max(strikePulse(t, spec.handoff[1], 0.36), strikePulse(t, spec.wave[1], 0.34))
          : spec.mode === 'boss-as-terrain'
            ? t >= spec.shake[0] && t < spec.shake[1]
              ? 0.28
              : 0.08 * stride
            : spec.mode === 'cover-line-of-sight'
              ? t >= spec.coveredAt && t < spec.beam[1]
                ? 0.2
                : stride * 0.16
              : spec.mode === 'forced-inertia'
                ? t >= spec.slide[0] && t < spec.brake[1]
                  ? 0.26
                  : stride * 0.16
                : stride * 0.16,
      lift:
        spec.mode === 'control-mode-shift' && t >= spec.handoff[1] && t < spec.wave[1]
          ? Math.sin(clamp((t - spec.handoff[1]) / (spec.wave[1] - spec.handoff[1])) * Math.PI)
          : 0,
      dodge:
        spec.mode === 'control-mode-shift' ? 0 : phase === 0 ? pulse(responseProgress) * 0.45 : 0,
      attack:
        spec.mode === 'directional-shield'
          ? Math.max(strikePulse(t, spec.frontStrike, 0.3), strikePulse(t, spec.sideStrike, 0.3))
          : spec.mode === 'damage-type-resistance'
            ? Math.max(
                strikePulse(t, spec.slashStrike, 0.3),
                strikePulse(t, spec.thrustStrike, 0.3),
              )
            : spec.mode === 'situational-immunity'
              ? Math.max(
                  strikePulse(t, spec.blockedStrike, 0.3),
                  strikePulse(t, spec.wardStrike, 0.3),
                  strikePulse(t, spec.openStrike, 0.3),
                )
              : spec.mode === 'part-break'
                ? strikePulse(t, spec.breakAt, 0.33)
                : spec.mode === 'attack-reflection'
                  ? Math.max(
                      strikePulse(t, spec.outgoing[0], 0.32),
                      strikePulse(t, spec.meleeStrike, 0.33),
                    )
                  : spec.mode === 'counter-stance'
                    ? Math.max(
                        strikePulse(t, spec.parriedStrike, 0.3),
                        strikePulse(t, spec.openStrike, 0.33),
                      )
                    : spec.mode === 'absorption-power-up'
                      ? Math.max(
                          strikePulse(t, spec.firstPulse[0], 0.32),
                          strikePulse(t, spec.secondPulse[0], 0.32),
                          strikePulse(t, spec.openStrike, 0.33),
                        )
                      : spec.mode === 'interruptible-wind-up'
                        ? strikePulse(t, spec.interruptAt, 0.38)
                        : spec.mode === 'loadout-adaptation'
                          ? strikePulse(t, spec.swapAt, 0.34)
                          : spec.mode === 'active-phase'
                            ? strikePulse(t, spec.punishAt, 0.38)
                            : spec.mode === 'recovery'
                              ? strikePulse(t, spec.punishAt, 0.38)
                              : spec.mode === 'survival-phase'
                                ? strikePulse(t, spec.punishAt, 0.38)
                                : spec.mode === 'teleport'
                                  ? strikePulse(t, spec.punishAt, 0.38)
                                  : spec.mode === 'boundary-attack'
                                    ? strikePulse(t, spec.punishAt, 0.38)
                                    : spec.mode === 'forced-scrolling'
                                      ? strikePulse(t, spec.punishAt, 0.38)
                                      : spec.mode === 'chase-herding'
                                        ? strikePulse(t, spec.punishAt, 0.38)
                                        : spec.mode === 'escape-phase'
                                          ? Math.max(
                                              strikePulse(t, spec.escape[1], 0.38),
                                              strikePulse(t, spec.punishAt, 0.38),
                                            )
                                          : spec.mode === 'relocated-arena'
                                            ? strikePulse(t, spec.punishAt, 0.38)
                                            : spec.mode === 'control-mode-shift'
                                              ? strikePulse(t, spec.punishAt, 0.38)
                                              : spec.mode === 'boss-as-terrain'
                                                ? strikePulse(t, spec.punishAt, 0.38)
                                                : spec.mode === 'cover-line-of-sight'
                                                  ? strikePulse(t, spec.punishAt, 0.38)
                                                  : spec.mode === 'forced-inertia'
                                                    ? strikePulse(t, spec.punishAt, 0.38)
                                                    : spec.mode === 'wraparound-projectile'
                                                      ? strikePulse(t, spec.punishAt, 0.38)
                                                      : spec.mode === 'beat-synced-attack'
                                                        ? strikePulse(t, spec.punishAt, 0.38)
                                                        : spec.mode ===
                                                            'secondary-cues-invisibility'
                                                          ? strikePulse(t, spec.punishAt, 0.38)
                                                          : spec.mode === 'sound-detection'
                                                            ? strikePulse(t, spec.punishAt, 0.38)
                                                            : spec.mode ===
                                                                'objective-linked-invulnerability'
                                                              ? Math.max(
                                                                  strikePulse(
                                                                    t,
                                                                    spec.blockedStrike,
                                                                    0.32,
                                                                  ),
                                                                  ...spec.objectiveHits.map((hit) =>
                                                                    strikePulse(t, hit, 0.32),
                                                                  ),
                                                                  strikePulse(
                                                                    t,
                                                                    spec.bossStrike,
                                                                    0.36,
                                                                  ),
                                                                )
                                                              : spec.mode === 'wave-clear-objective'
                                                                ? Math.max(
                                                                    ...spec.waveKills
                                                                      .flat()
                                                                      .map((kill) =>
                                                                        strikePulse(t, kill, 0.32),
                                                                      ),
                                                                  )
                                                                : spec.mode ===
                                                                    'environmental-weapon'
                                                                  ? 0
                                                                  : spec.mode ===
                                                                      'encounter-specific-tool'
                                                                    ? 0
                                                                    : spec.mode === 'decoy' &&
                                                                        phase === 1
                                                                      ? pulse(
                                                                          clamp(
                                                                            (action - 0.52) / 0.3,
                                                                          ),
                                                                        )
                                                                      : spec.mode ===
                                                                            'weak-point' &&
                                                                          phase === 1
                                                                        ? pulse(action * 1.5)
                                                                        : 0,
    }),
  };
  if (spec.mode === 'decoy') {
    const split = smooth(t / BLUEPRINT_PHASE_ENDS[0]);
    const walkBack = speed((t - 4.65) / 1.2);
    const separation = Math.hypot(spec.real[0] - spec.boss[0], spec.real[1] - spec.boss[1]);
    frame.bossMotion.gait = (separation * (split + returnProgress)) / 28;
    frame.bossMotion.stride = Math.min(1, 0.62 * Math.max(speed(t / 1.6), walkBack));
  }
  if (spec.mode === 'boundary-attack') {
    const crossing = smooth((t - spec.active[0]) / (spec.active[1] - spec.active[0]));
    frame.bossMotion.gait = (Math.abs(spec.impactPosition[0] - spec.boss[0]) * crossing) / 38;
    frame.bossMotion.stride = 0.6 * speed((t - spec.active[0]) / (spec.active[1] - spec.active[0]));
  }
  if (spec.mode === 'directional-shield') {
    frame.frontStrike =
      strikePulse(t, spec.frontStrike) > 0.5 && directionalShieldOutcome(t, player) === 'blocked';
    frame.sideStrike =
      strikePulse(t, spec.sideStrike) > 0.5 && directionalShieldOutcome(t, player) === 'hit';
  }
  if (spec.mode === 'damage-type-resistance') {
    frame.resistedStrike = strikePulse(t, spec.slashStrike) > 0.5;
    frame.normalStrike = strikePulse(t, spec.thrustStrike) > 0.5;
    frame.damageComparison = {
      slash: damageTypeResistanceDamage('slash', spec.baseDamage),
      thrust: damageTypeResistanceDamage('thrust', spec.baseDamage),
    };
  }
  if (spec.mode === 'situational-immunity') {
    frame.immunity = situationalImmunityOutcome(t);
    frame.blockedStrike = strikePulse(t, spec.blockedStrike) > 0.5;
    frame.wardStrike = strikePulse(t, spec.wardStrike) > 0.5;
    frame.openStrike = strikePulse(t, spec.openStrike) > 0.5;
  }
  if (spec.mode === 'part-break') {
    frame.partState = partBreakState(t);
    frame.launcherCanFire = partBreakCanFire(t);
    frame.firstShot = dangerActive;
    frame.secondAttempt = strikePulse(t, spec.secondAttempt) > 0.5;
    frame.partStrike = strikePulse(t, spec.breakAt) > 0.5;
  }
  if (spec.mode === 'attack-reflection') {
    frame.reflectionState = attackReflectionState(t);
    frame.outgoingShot = t >= spec.outgoing[0] && t < spec.outgoing[1];
    frame.reflectedShot = dangerActive;
    frame.meleeStrike = strikePulse(t, spec.meleeStrike) > 0.5;
  }
  if (spec.mode === 'counter-stance') {
    frame.counterState = counterStanceState(t);
    frame.parriedStrike = strikePulse(t, spec.parriedStrike) > 0.5;
    frame.openStrike = strikePulse(t, spec.openStrike) > 0.5;
    frame.riposte = dangerActive;
  }
  if (spec.mode === 'absorption-power-up') {
    frame.absorptionCharge = absorptionCharge(t);
    frame.absorptionState = dangerActive
      ? 'empowered-release'
      : t >= spec.spentAt && t < spec.openStrike + 0.35
        ? 'spent-open'
        : t >= spec.chargeWindup && t < spec.spentAt
          ? 'charged'
          : t >= 0.6 && t < spec.chargeWindup
            ? 'accepting'
            : 'idle';
    frame.absorbedFirst = strikePulse(t, spec.firstPulse[1], 0.26) > 0.5;
    frame.absorbedSecond = strikePulse(t, spec.secondPulse[1], 0.26) > 0.5;
    frame.openStrike = strikePulse(t, spec.openStrike, 0.3) > 0.5;
  }
  if (spec.mode === 'interruptible-wind-up') {
    frame.windUpState = interruptibleWindUpState(t);
    frame.interruptHit = strikePulse(t, spec.interruptAt, 0.3) > 0.5;
    frame.threatReleased = dangerActive;
    frame.interruptible =
      (t >= spec.firstWindup[0] && t < spec.interruptAt) ||
      (t >= spec.secondWindup[0] && t < spec.release[0]);
  }
  if (spec.mode === 'loadout-adaptation') {
    frame.loadoutState = loadoutAdaptationState(t);
    frame.loadout = t < spec.swapAt ? 'reach-rune' : 'burst-rune';
    frame.adaptedPackage = loadoutAdaptationPackage(frame.loadout);
    frame.reachDanger = t >= spec.reachAttack[0] && t < spec.reachAttack[1];
    frame.burstDanger = t >= spec.burstAttack[0] && t < spec.burstAttack[1];
  }
  if (spec.mode === 'wind-up') {
    frame.windUpState = windUpState(t);
    frame.windUpProgress = windUpProgress(t);
    frame.windUpBeat = Math.min(3, Math.floor(frame.windUpProgress * 3 + 0.001));
    frame.windUpRelease = dangerActive;
  }
  if (spec.mode === 'attack-lock') {
    frame.attackLockState = attackLockState(t);
    const firstCycle = t < spec.secondSetup;
    const locked = firstCycle ? t >= spec.firstLock : t >= spec.secondLock;
    const captured = point(firstCycle ? spec.firstLockPoint : spec.secondLockPoint);
    frame.attackLockTarget = locked ? captured : player;
    const emitter = { x: boss.x + 43, y: boss.y + 8 };
    const angle = Math.atan2(
      frame.attackLockTarget.y - emitter.y,
      frame.attackLockTarget.x - emitter.x,
    );
    frame.attackLockEnd = polar(emitter, spec.laneLength, angle);
    frame.attackLocked =
      (t >= spec.firstLock && t < spec.firstRecoveryEnd) ||
      (t >= spec.secondLock && t < spec.recoveryEnd);
    frame.attackLockRelease = dangerActive;
  }
  if (spec.mode === 'active-phase') {
    frame.activePhaseState = activePhaseState(t);
    frame.hitboxActive = dangerActive;
    frame.followThroughVisible = t >= spec.active[1] && t < spec.followThroughEnd;
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'objective-linked-invulnerability') {
    frame.objectiveLinkedInvulnerabilityState = objectiveLinkedInvulnerabilityState(t);
    frame.objectiveCompletedCount =
      t >= spec.resetAt ? 0 : spec.objectiveHits.filter((hit) => t >= hit).length;
    frame.objectiveHitIndex = spec.objectiveHits.findIndex((hit) => Math.abs(t - hit) <= 0.15);
    frame.objectiveShielded = objectiveLinkedInvulnerabilityOutcome(t) === 'immune';
    frame.objectiveVulnerable = !frame.objectiveShielded;
    frame.objectiveBlockedStrike = strikePulse(t, spec.blockedStrike, 0.3) > 0.5;
    frame.objectiveBossStrike = strikePulse(t, spec.bossStrike, 0.32) > 0.5;
    frame.objectiveAllComplete = frame.objectiveCompletedCount === spec.objectiveHits.length;
    frame.objectiveVulnerabilityProgress = frame.objectiveVulnerable
      ? clamp((t - spec.vulnerable[0]) / (spec.vulnerable[1] - spec.vulnerable[0]))
      : 0;
    frame.objectiveWindowRemaining = frame.objectiveVulnerable
      ? clamp(1 - (t - spec.vulnerable[0]) / (spec.vulnerable[1] - spec.vulnerable[0]))
      : 0;
    frame.objectiveShieldOpacity = frame.objectiveVulnerable
      ? 0
      : t >= spec.gateDropsAt && t < spec.vulnerable[0]
        ? 1 - smooth((t - spec.gateDropsAt) / (spec.vulnerable[0] - spec.gateDropsAt))
        : t >= spec.vulnerable[1] && t < spec.shieldReturns
          ? smooth((t - spec.vulnerable[1]) / (spec.shieldReturns - spec.vulnerable[1]))
          : 0.92;
  }
  if (spec.mode === 'wave-clear-objective') {
    const progress = waveClearObjectiveProgress(t);
    const waveIndex = Math.max(0, Math.min(spec.waveKills.length - 1, progress.wave - 1));
    frame.waveClearState = waveClearObjectiveState(t);
    frame.waveClearWave = progress.wave;
    frame.waveClearCompletedWaves = progress.completedWaves;
    frame.waveClearRemainingEnemies = progress.remainingEnemies;
    frame.waveClearSpawnQueueSealed = progress.spawnQueueSealed;
    frame.waveClearRosterEmpty = progress.rosterEmpty;
    frame.waveClearAllComplete = progress.allComplete;
    frame.waveClearHitIndex = spec.waveKills[waveIndex].findIndex(
      (kill) => Math.abs(t - kill) <= 0.14,
    );
    frame.waveClearResolution = clamp(
      (t - spec.waveClears.at(-1)) / (spec.rewardAt - spec.waveClears.at(-1)),
    );
    frame.waveClearRewardOpen = t >= spec.rewardAt && t < spec.resetAt;
  }
  if (spec.mode === 'environmental-weapon') {
    frame.environmentalWeaponState = environmentalWeaponState(t);
    frame.environmentalDevicePowered = t >= spec.powerOnAt && t < spec.resetAt;
    frame.environmentalDeviceReached = t >= spec.deviceReachedAt && t < spec.resetAt;
    frame.environmentalAimLocked = t >= spec.aimLockedAt && t < spec.fireAt;
    frame.environmentalDeviceFired = t >= spec.fireAt && t < spec.resetAt;
    frame.environmentalBossDamaged = t >= spec.hitAt && t < spec.resetAt;
    frame.environmentalDeviceSpent = t >= spec.spentAt && t < spec.resetAt;
    frame.environmentalDamageSource = frame.environmentalBossDamaged ? 'device' : 'none';
    frame.environmentalProjectileProgress = clamp((t - spec.fireAt) / (spec.hitAt - spec.fireAt));
  }
  if (spec.mode === 'encounter-specific-tool') {
    frame.encounterSpecificToolState = encounterSpecificToolState(t);
    frame.encounterToolReached = t >= spec.toolReachedAt && t < spec.resetAt;
    frame.encounterToolEquipped = t >= spec.toolEquippedAt && t < spec.toolExpiresAt;
    frame.encounterToolCombatReached = t >= spec.combatReachedAt && t < spec.resetAt;
    frame.encounterToolCharging = t >= spec.charge[0] && t < spec.readyAt;
    frame.encounterToolReady = t >= spec.readyAt && t < spec.fireAt;
    frame.encounterToolFired = t >= spec.fireAt && t < spec.toolExpiresAt;
    frame.encounterToolBossDamaged = t >= spec.hitAt && t < spec.resetAt;
    frame.encounterToolExpired = t >= spec.toolExpiresAt && t < spec.resetAt;
    frame.encounterToolActionPackage = frame.encounterToolEquipped ? 'rune-spear' : 'sword';
    frame.encounterToolDamageSource = frame.encounterToolBossDamaged ? 'encounter-tool' : 'none';
    frame.encounterToolProjectileProgress = clamp((t - spec.fireAt) / (spec.hitAt - spec.fireAt));
  }
  if (spec.mode === 'player-controlled-boss') {
    frame.playerControlledBossState = playerControlledBossState(t);
    frame.playerBossCandidateFound = t >= spec.candidateAt && t < spec.resetAt;
    frame.playerBossAssigned = t >= spec.assignedAt && t < spec.resetAt;
    frame.playerBossController =
      t >= spec.aiTakeoverAt && t < spec.resetAt
        ? 'ai'
        : t >= spec.assignedAt && t < spec.heartbeatLostAt
          ? 'human'
          : 'none';
    frame.playerBossCommandAccepted = t >= spec.actionQueuedAt && t < spec.recoveryEndsAt;
    frame.playerBossTelegraphVisible = t >= spec.telegraph[0] && t < spec.active[0];
    frame.playerBossAttackActive = t >= spec.active[0] && t < spec.active[1];
    frame.playerBossHeartbeatLost = t >= spec.heartbeatLostAt && t < spec.aiTakeoverAt;
    frame.playerBossFrozen = t >= spec.heartbeatLostAt && t < spec.aiTakeoverAt;
    frame.playerBossAiTakeover = t >= spec.aiTakeoverAt && t < spec.resetAt;
    frame.playerBossHealthPreserved = t >= spec.assignedAt && t < spec.resetAt;
    frame.playerBossRewardGrants = 0;
  }
  if (spec.mode === 'projectile-rally') {
    const liveLeg = projectileRallyLegAt(spec, t);
    const orbFallback = point(spec.bossContact);
    frame.projectileRallyState = projectileRallyState(t);
    frame.projectileRallyProjectileId = 'rune-orb-1';
    frame.projectileRallyLeg = liveLeg?.index ?? -1;
    frame.projectileRallyOwner = liveLeg?.owner ?? 'none';
    frame.projectileRallyOrb = liveLeg?.position ?? orbFallback;
    frame.projectileRallyOrbVisible = Boolean(liveLeg);
    frame.projectileRallySpeedTier = liveLeg ? Math.min(3, Math.floor(liveLeg.index / 2) + 1) : 0;
    frame.projectileRallyExchangeCount =
      t < spec.resetAt
        ? [...spec.playerContacts, ...spec.bossReturns].filter((contact) => t >= contact).length
        : 0;
    frame.projectileRallyBossMiss = t >= spec.bossMissAt && t < spec.resetAt;
    frame.projectileRallyVulnerable = t >= spec.bossMissAt && t < spec.vulnerableUntil;
    frame.projectileRallyPunished = t >= spec.punishAt && t < spec.resetAt;
    frame.projectileRallyDamageSource = frame.projectileRallyBossMiss ? 'rally-orb' : 'none';
    frame.dangerActive = liveLeg?.owner === 'boss';
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
    frame.playerMotion.attack = Math.max(
      ...spec.playerContacts.map((contact) => strikePulse(t, contact, 0.28)),
      strikePulse(t, spec.punishAt, 0.38),
    );
    frame.bossMotion.impact = Math.max(
      strikePulse(t, spec.bossMissAt, 0.44),
      strikePulse(t, spec.punishAt, 0.32),
    );
    frame.bossMotion.lean =
      -0.22 * smooth((t - 0.45) / (spec.serveAt - 0.45)) +
      0.38 * strikePulse(t, spec.bossMissAt, 0.52);
  }
  if (spec.mode === 'baited-self-hit') {
    frame.baitedSelfHitState = baitedSelfHitState(t);
    frame.baitTrapId = 'quarry-rune-1';
    frame.baitTrapArmed = t >= spec.armedAt && t < spec.impactAt;
    frame.baitTargetAcquired = t >= spec.aimAt && t < spec.resetAt;
    frame.baitTargetLocked = t >= spec.lockedAt && t < spec.resetAt;
    frame.baitChargeActive = t >= spec.charge[0] && t < spec.impactAt;
    frame.baitPlayerClear = t >= spec.evade[1] && t < spec.resetAt;
    frame.baitBossContact = t >= spec.impactAt && t < spec.selfHitAt;
    frame.baitTrapConsumed = t >= spec.selfHitAt && t < spec.resetAt;
    frame.baitSelfHitResolved = t >= spec.selfHitAt && t < spec.resetAt;
    frame.baitVulnerable = t >= spec.selfHitAt && t < spec.vulnerableUntil;
    frame.baitPunished = t >= spec.punishAt && t < spec.resetAt;
    frame.baitDamageSource = frame.baitSelfHitResolved ? 'prepared-hazard' : 'none';
    frame.baitCollisionPair = frame.baitBossContact ? 'kern|quarry-rune-1' : 'none';
    frame.baitRewardGrants = frame.baitSelfHitResolved ? 1 : 0;
    frame.dangerActive = frame.baitChargeActive;
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
    frame.playerMotion.attack = Math.max(
      strikePulse(t, spec.armedAt, 0.34),
      strikePulse(t, spec.punishAt, 0.38),
    );
    frame.playerMotion.dodge = strikePulse(t, (spec.evade[0] + spec.evade[1]) / 2, 0.54);
    frame.bossMotion.gait = t * 6;
    frame.bossMotion.stride = frame.baitChargeActive ? 0.78 : 0;
    frame.bossMotion.lean =
      -0.28 * smooth((t - spec.lockedAt) / (spec.charge[0] - spec.lockedAt)) +
      0.46 * strikePulse(t, spec.selfHitAt, 0.5);
    frame.bossMotion.impact = Math.max(
      strikePulse(t, spec.selfHitAt, 0.42),
      strikePulse(t, spec.punishAt, 0.32),
    );
  }
  if (spec.mode === 'posture-stagger-gauge') {
    frame.postureStaggerGaugeState = postureStaggerGaugeState(t);
    frame.postureValue = postureValueAt(spec, t);
    frame.postureRecovering = t >= spec.recovery[0] && t < spec.recovery[1];
    frame.postureBroken = t >= spec.breakAt && t < spec.resetAt;
    frame.postureBreakId = frame.postureBroken ? 'posture-break-1' : 'none';
    frame.postureCriticalReady =
      t >= spec.criticalReadyAt && t < spec.finisherAt && t < spec.criticalEndsAt;
    frame.postureFinisherEligible = frame.postureCriticalReady;
    frame.postureFinisherConsumed = t >= spec.finisherAt && t < spec.resetAt;
    frame.posturePhaseTokens = frame.postureFinisherConsumed ? 2 : 3;
    frame.postureRewardGrants = frame.postureFinisherConsumed ? 1 : 0;
    frame.postureHealthChanged = frame.postureFinisherConsumed;
    frame.dangerActive = false;
    frame.punishStrike = strikePulse(t, spec.finisherAt, 0.44) > 0.5;
    frame.playerMotion.attack = Math.max(
      ...spec.contacts.map((contact) => strikePulse(t, contact, 0.28)),
      strikePulse(t, spec.finisherAt, 0.44),
    );
    frame.playerMotion.dodge = Math.max(
      strikePulse(t, spec.contacts[1], 0.28),
      strikePulse(t, spec.contacts[2], 0.28),
    );
    frame.bossMotion.impact = Math.max(
      ...spec.contacts.map((contact) => strikePulse(t, contact, 0.3)),
      strikePulse(t, spec.finisherAt, 0.42),
    );
    frame.bossMotion.lean = frame.postureCriticalReady ? 0.38 : 0;
  }
  if (spec.mode === 'pacifist-resolution') {
    frame.pacifistResolutionState = pacifistResolutionState(t);
    frame.pacifistWeaponSheathed = t >= spec.sheathAt && t < spec.resetAt;
    frame.pacifistTracking = t >= spec.restraintStartsAt && t < spec.spareAt;
    frame.pacifistRestraintProgress =
      t < spec.restraintStartsAt
        ? 0
        : t < spec.conditionMetAt
          ? clamp((t - spec.restraintStartsAt) / (spec.conditionMetAt - spec.restraintStartsAt))
          : t < spec.resetAt
            ? 1
            : 0;
    frame.pacifistConditionComplete = t >= spec.conditionMetAt && t < spec.resetAt;
    frame.pacifistChoiceOffered = t >= spec.choiceOfferedAt && t < spec.spareAt;
    frame.pacifistChoiceDeadline = spec.choiceEndsAt;
    frame.pacifistAttackIndex = spec.attacks.findIndex(
      ({ telegraph, active }) => t >= telegraph[0] && t < active[1],
    );
    frame.pacifistAttackTelegraph = spec.attacks.some(
      ({ telegraph }) => t >= telegraph[0] && t < telegraph[1],
    );
    frame.pacifistAttackActive = spec.attacks.some(({ active }) => t >= active[0] && t < active[1]);
    frame.pacifistOffensiveEvents = 0;
    frame.pacifistBossHealth = 100;
    frame.pacifistSpareCommitted = t >= spec.spareAt && t < spec.resetAt;
    frame.pacifistResolutionId = frame.pacifistSpareCommitted ? 'pacifist-resolution-1' : 'none';
    frame.pacifistResolved = t >= spec.resolvedAt && t < spec.resetAt;
    frame.pacifistSpared = frame.pacifistResolved;
    frame.pacifistDefeated = false;
    frame.pacifistRewardGrants = frame.pacifistResolved ? 1 : 0;
    frame.dangerActive = frame.pacifistAttackActive;
    frame.playerMotion.attack = 0;
    frame.playerMotion.dodge = Math.max(
      strikePulse(t, spec.attacks[0].active[0], 0.42),
      strikePulse(t, spec.attacks[1].active[0], 0.42),
      strikePulse(t, spec.attacks[2].active[0], 0.42),
    );
    frame.bossMotion.attack = Math.max(
      ...spec.attacks.map(({ active }) => strikePulse(t, active[0], 0.36)),
    );
    frame.bossMotion.lean = frame.pacifistResolved ? -0.18 : 0;
  }
  if (spec.mode === 'persistent-progress') {
    frame.persistentProgressState = persistentProgressState(t);
    frame.persistentProgressCompletedObjectives =
      t < spec.commits[0]
        ? 0
        : t < spec.commits[1]
          ? 1
          : t < spec.commits[2]
            ? 2
            : t < spec.resetAt
              ? 3
              : 0;
    frame.persistentProgressRevision = frame.persistentProgressCompletedObjectives;
    frame.persistentProgressAttempt = t < spec.restores[0][1] ? 1 : t < spec.restores[1][1] ? 2 : 3;
    frame.persistentProgressRetryCount = frame.persistentProgressAttempt - 1;
    frame.persistentProgressRestoring = spec.restores.some(([start, end]) => t >= start && t < end);
    frame.persistentProgressPlayerAlive = !spec.hazards.some(
      ({ active }) => t >= active[0] && t < active[1],
    );
    frame.persistentProgressHazardIndex = spec.hazards.findIndex(
      ({ telegraph, active }) => t >= telegraph[0] && t < active[1],
    );
    frame.persistentProgressHazardTelegraph = spec.hazards.some(
      ({ telegraph }) => t >= telegraph[0] && t < telegraph[1],
    );
    frame.persistentProgressHazardActive = spec.hazards.some(
      ({ active }) => t >= active[0] && t < active[1],
    );
    frame.persistentProgressCoreOpen =
      frame.persistentProgressCompletedObjectives >= 2 && t < spec.resetAt;
    frame.persistentProgressResolved = t >= spec.commits[2] && t < spec.resetAt;
    frame.persistentProgressBossHealth = frame.persistentProgressResolved ? 0 : 100;
    frame.persistentProgressResultId = frame.persistentProgressResolved
      ? 'persistent-progress-1'
      : 'none';
    frame.persistentProgressRewardGrants = frame.persistentProgressResolved ? 1 : 0;
    frame.persistentProgressSnapshotVersion = 1;
    frame.dangerActive = frame.persistentProgressHazardActive;
    frame.playerMotion.attack = Math.max(
      ...spec.strikes.map((strike) => strikePulse(t, strike, 0.34)),
    );
    frame.playerMotion.impact = frame.persistentProgressHazardActive ? 1 : 0;
    frame.playerMotion.dodge = 0;
    frame.bossMotion.attack = Math.max(
      ...spec.hazards.map(({ active }) => strikePulse(t, active[0], 0.34)),
    );
    frame.bossMotion.impact = strikePulse(t, spec.strikes[2], 0.42);
    frame.bossMotion.lean = frame.persistentProgressResolved ? -0.24 : 0;
  }
  if (spec.mode === 'status-buildup') {
    frame.statusBuildupState = statusBuildupState(t);
    frame.statusBuildupValue = statusBuildupValueAt(spec, t);
    frame.statusBuildupDecayDelayed = t >= spec.contacts[0] && t < spec.decay[0];
    frame.statusBuildupDecaying = t >= spec.decay[0] && t < spec.decay[1];
    frame.statusBuildupContactIndex = spec.contactWindows.findIndex(
      ([start, end]) => t >= start && t < end,
    );
    frame.statusBuildupContactActive = frame.statusBuildupContactIndex >= 0;
    frame.statusBuildupThresholdReached = t >= spec.thresholdAt && t < spec.effectEndsAt;
    frame.statusBuildupEffectActive = t >= spec.effectStartsAt && t < spec.effectEndsAt;
    frame.statusBuildupEffectCount = t >= spec.thresholdAt && t < spec.resetAt ? 1 : 0;
    frame.statusBuildupImmune = t >= spec.effectEndsAt && t < spec.immunityEndsAt;
    frame.statusBuildupIgnoredContacts =
      frame.statusBuildupImmune && strikePulse(t, spec.immuneProbeAt, 0.36) > 0 ? 1 : 0;
    frame.statusBuildupEffectId =
      t >= spec.thresholdAt && t < spec.resetAt ? 'status-effect-1' : 'none';
    frame.dangerActive = frame.statusBuildupContactActive;
    frame.playerMotion.attack = 0;
    frame.playerMotion.dodge = 0;
    frame.playerMotion.impact = Math.max(
      ...spec.contacts.map((contact) => strikePulse(t, contact, 0.3)),
    );
    frame.bossMotion.attack = Math.max(
      ...spec.contacts.map((contact) => strikePulse(t, contact, 0.34)),
      strikePulse(t, spec.immuneProbeAt, 0.36),
    );
  }
  if (spec.mode === 'instant-kill') {
    frame.instantKillState = instantKillState(t);
    frame.instantKillFirstAvoided = t >= spec.firstResolveAt && t < spec.secondTelegraph[0];
    frame.instantKillConditionLocked = t >= spec.conditionLockedAt && t < spec.resetAt;
    frame.instantKillExecuted = t >= spec.executeAt && t < spec.resetAt;
    frame.instantKillAttemptEnded = t >= spec.resultVisibleAt && t < spec.restore[1];
    frame.instantKillTargetAlive = !frame.instantKillAttemptEnded;
    frame.instantKillHealthBefore = 100;
    frame.instantKillDamageApplied = 0;
    frame.instantKillResultCount = frame.instantKillExecuted ? 1 : 0;
    frame.instantKillResultId = frame.instantKillExecuted ? 'instant-kill-1' : 'none';
    frame.instantKillCondition = frame.instantKillConditionLocked
      ? 'inside-execution-seal'
      : 'open';
    frame.dangerActive = t >= spec.executionWindow[0] && t < spec.executionWindow[1];
    frame.playerMotion.attack = 0;
    frame.playerMotion.dodge = strikePulse(t, spec.firstResolveAt, 0.44);
    frame.playerMotion.impact = strikePulse(t, spec.executeAt, 0.42);
    frame.playerMotion.crouch = frame.instantKillAttemptEnded ? 0.85 : 0;
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.firstResolveAt, 0.36),
      strikePulse(t, spec.executeAt, 0.42),
    );
  }
  if (spec.mode === 'maximum-health-reduction') {
    const values = maximumHealthValuesAt(spec, t);
    frame.maximumHealthState = maximumHealthReductionState(t);
    frame.maximumHealthFirstAvoided = t >= spec.firstResolveAt && t < spec.secondTelegraph[0];
    frame.maximumHealthCurrent = values.current;
    frame.maximumHealthMaximum = values.maximum;
    frame.maximumHealthBefore = spec.maxHealthBefore;
    frame.maximumHealthAfter = spec.maxHealthAfter;
    frame.maximumHealthLoss = spec.maxHealthBefore - values.maximum;
    frame.maximumHealthReduced = values.maximum < spec.maxHealthBefore - 0.01;
    frame.maximumHealthHit = t >= spec.hitAt && t < spec.resetAt;
    frame.maximumHealthDamageApplied = frame.maximumHealthHit ? spec.damageApplied : 0;
    frame.maximumHealthCapEventCount = frame.maximumHealthHit ? 1 : 0;
    frame.maximumHealthHealRequested = t >= spec.healAttempt[0] && t < spec.cleanse[0] ? 40 : 0;
    frame.maximumHealthHealApplied =
      t >= spec.healAttempt[0] && t < spec.cleanse[0]
        ? Math.max(0, values.current - spec.currentHealthAfter)
        : 0;
    frame.maximumHealthHealBlocked = Math.max(
      0,
      frame.maximumHealthHealRequested - frame.maximumHealthHealApplied,
    );
    frame.maximumHealthHealingBlocked = t >= spec.healAttempt[1] && t < spec.cleanse[0];
    frame.maximumHealthCleansing = t >= spec.cleanse[0] && t < spec.cleanse[1];
    frame.maximumHealthRestored = t >= spec.cleanse[1] && t < spec.resetAt;
    frame.dangerActive = t >= spec.hitWindow[0] && t < spec.hitWindow[1];
    frame.playerMotion.attack = 0;
    frame.playerMotion.dodge = strikePulse(t, spec.firstResolveAt, 0.44);
    frame.playerMotion.impact = strikePulse(t, spec.hitAt, 0.44);
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.firstResolveAt, 0.36),
      strikePulse(t, spec.hitAt, 0.42),
    );
  }
  if (spec.mode === 'resource-steal') {
    const activeAttempt = t >= spec.hitAt && t < spec.resetAt;
    const reclaimed = t >= spec.reclaim[1] && t < spec.resetAt ? 1 : 0;
    const captured = t >= spec.capture[1] && t < spec.resetAt ? 2 : 0;
    const dropped = activeAttempt ? spec.dropCount : 0;
    const world = Math.max(0, dropped - reclaimed - captured);
    frame.resourceStealState = resourceStealState(t);
    frame.resourceStealFirstAvoided = t >= spec.firstResolveAt && t < spec.secondTelegraph[0];
    frame.resourceStealDropped = dropped;
    frame.resourceStealReclaimed = reclaimed;
    frame.resourceStealCaptured = captured;
    frame.resourceStealWorldResource = world;
    frame.resourceStealPlayerResource = spec.initialResource - dropped + reclaimed;
    frame.resourceStealTotalResource = frame.resourceStealPlayerResource + world + captured;
    frame.resourceStealConserved = frame.resourceStealTotalResource === spec.initialResource;
    frame.resourceStealDropEventCount = activeAttempt ? 1 : 0;
    frame.resourceStealBenefitEventCount = captured > 0 ? 1 : 0;
    frame.resourceStealCapturing = t >= spec.capture[0] && t < spec.capture[1];
    frame.resourceStealBenefitApplied = captured > 0;
    frame.resourceStealTokenIds = ['resource-token-1', 'resource-token-2', 'resource-token-3'];
    frame.resourceStealTokenOwners = !activeAttempt
      ? ['player', 'player', 'player']
      : reclaimed === 0
        ? ['world', 'world', 'world']
        : captured === 0
          ? ['player', 'world', 'world']
          : ['player', 'boss', 'boss'];
    frame.dangerActive = t >= spec.hitWindow[0] && t < spec.hitWindow[1];
    frame.playerMotion.attack = 0;
    frame.playerMotion.dodge = strikePulse(t, spec.firstResolveAt, 0.42);
    frame.playerMotion.impact = strikePulse(t, spec.hitAt, 0.44);
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.firstResolveAt, 0.36),
      strikePulse(t, spec.hitAt, 0.42),
      strikePulse(t, spec.capture[1], 0.42),
    );
  }
  if (spec.mode === 'on-hit-healing') {
    const healed = t >= spec.blockedHitAt && t < spec.resetAt;
    const healingProgress = smooth((t - spec.healing[0]) / (spec.healing[1] - spec.healing[0]));
    frame.onHitHealingState = onHitHealingState(t);
    frame.onHitHealingFirstMissed = t >= spec.firstResolveAt && t < spec.secondTelegraph[0];
    frame.onHitHealingBlockedContact = t >= spec.blockedHitAt && t < spec.thirdTelegraph[0];
    frame.onHitHealingContactQualified = healed;
    frame.onHitHealingThirdMissed = t >= spec.thirdResolveAt && t < spec.resetAt;
    frame.onHitHealingBossHealth =
      t < spec.blockedHitAt
        ? spec.bossHealthBefore
        : t < spec.healing[1]
          ? mix(spec.bossHealthBefore, spec.bossHealthBefore + spec.healAmount, healingProgress)
          : t < spec.resetAt
            ? spec.bossHealthBefore + spec.healAmount
            : mix(
                spec.bossHealthBefore + spec.healAmount,
                spec.bossHealthBefore,
                smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt)),
              );
    frame.onHitHealingRequested = healed ? spec.healAmount : 0;
    frame.onHitHealingApplied = healed ? spec.healAmount : 0;
    frame.onHitHealingDamageApplied = 0;
    frame.onHitHealingEventCount = healed ? 1 : 0;
    frame.onHitHealingResultId = healed ? 'on-hit-heal-1' : 'none';
    frame.onHitHealingBlockedCounts = true;
    frame.onHitHealingMissCounts = false;
    frame.dangerActive =
      (t >= spec.blockedHitWindow[0] && t < spec.blockedHitWindow[1]) ||
      (t >= spec.thirdHitWindow[0] && t < spec.thirdHitWindow[1]);
    frame.playerMotion.attack = strikePulse(t, spec.counterAt, 0.42);
    frame.playerMotion.dodge = Math.max(
      strikePulse(t, spec.firstResolveAt, 0.42),
      strikePulse(t, spec.thirdResolveAt, 0.42),
    );
    frame.playerMotion.impact = strikePulse(t, spec.blockedHitAt, 0.44);
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.firstResolveAt, 0.36),
      strikePulse(t, spec.blockedHitAt, 0.42),
      strikePulse(t, spec.thirdResolveAt, 0.4),
    );
  }
  if (spec.mode === 'self-heal-cast') {
    const firstChannelActive = t >= spec.firstChannel[0] && t < spec.interruptAt;
    const secondChannelActive = t >= spec.secondChannel[0] && t < spec.secondChannel[1];
    const completed = t >= spec.secondChannel[1] && t < spec.resetAt;
    const healingProgress = smooth((t - spec.healing[0]) / (spec.healing[1] - spec.healing[0]));
    frame.selfHealCastState = selfHealCastState(t);
    frame.selfHealCastFirstInterrupted = t >= spec.interruptAt && t < spec.secondTelegraph[0];
    frame.selfHealCastChannelActive = firstChannelActive || secondChannelActive;
    frame.selfHealCastChannelProgress = firstChannelActive
      ? clamp((t - spec.firstChannel[0]) / (spec.interruptAt - spec.firstChannel[0]))
      : secondChannelActive
        ? clamp((t - spec.secondChannel[0]) / (spec.secondChannel[1] - spec.secondChannel[0]))
        : 0;
    frame.selfHealCastCompleted = completed;
    frame.selfHealCastHealing = t >= spec.healing[0] && t < spec.healing[1];
    frame.selfHealCastBossHealth =
      t < spec.healing[0]
        ? spec.bossHealthBefore
        : t < spec.healing[1]
          ? mix(spec.bossHealthBefore, spec.bossHealthBefore + spec.healAmount, healingProgress)
          : t < spec.resetAt
            ? spec.bossHealthBefore + spec.healAmount
            : mix(
                spec.bossHealthBefore + spec.healAmount,
                spec.bossHealthBefore,
                smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt)),
              );
    frame.selfHealCastRequested = completed ? spec.healAmount : 0;
    frame.selfHealCastApplied = completed ? spec.healAmount : 0;
    frame.selfHealCastEventCount = completed ? 1 : 0;
    frame.selfHealCastInterruptCount = t >= spec.interruptAt && t < spec.resetAt ? 1 : 0;
    frame.selfHealCastResultId = completed ? 'self-heal-cast-1' : 'none';
    frame.dangerActive = false;
    frame.playerMotion.attack = strikePulse(t, spec.interruptAt, 0.46);
    frame.playerMotion.dodge = 0;
    frame.playerMotion.impact = 0;
    frame.bossMotion.attack = Math.max(
      firstChannelActive ? pulse(frame.selfHealCastChannelProgress) * 0.45 : 0,
      secondChannelActive ? pulse(frame.selfHealCastChannelProgress) * 0.45 : 0,
      strikePulse(t, spec.interruptAt, 0.42),
    );
  }
  if (spec.mode === 'external-healing-source') {
    const delivered = t >= spec.secondTransfer[1] && t < spec.resetAt;
    const healingProgress = smooth((t - spec.healing[0]) / (spec.healing[1] - spec.healing[0]));
    frame.externalHealingSourceState = externalHealingSourceState(t);
    frame.externalHealingSourceFirstDestroyed = t >= spec.destroyAt && t < spec.resetAt;
    frame.externalHealingSourceFirstPacketCancelled = t >= spec.destroyAt && t < spec.resetAt;
    frame.externalHealingSourceSecondSignaled = t >= spec.secondSignal[0] && t < spec.resetAt;
    frame.externalHealingSourceSecondPacketActive =
      t >= spec.secondTransfer[0] && t < spec.secondTransfer[1];
    frame.externalHealingSourceDelivered = delivered;
    frame.externalHealingSourceHealing = t >= spec.healing[0] && t < spec.healing[1];
    frame.externalHealingSourceActiveCount =
      t < spec.firstSignal[0] || t >= spec.resetAt ? 0 : t < spec.destroyAt ? 2 : 1;
    frame.externalHealingSourceBossHealth =
      t < spec.healing[0]
        ? spec.bossHealthBefore
        : t < spec.healing[1]
          ? mix(spec.bossHealthBefore, spec.bossHealthBefore + spec.healAmount, healingProgress)
          : t < spec.resetAt
            ? spec.bossHealthBefore + spec.healAmount
            : mix(
                spec.bossHealthBefore + spec.healAmount,
                spec.bossHealthBefore,
                smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt)),
              );
    frame.externalHealingSourceRequested = delivered ? spec.healAmount : 0;
    frame.externalHealingSourceApplied = delivered ? spec.healAmount : 0;
    frame.externalHealingSourceEventCount = delivered ? 1 : 0;
    frame.externalHealingSourceSourceId = delivered ? 'healing-source-2' : 'none';
    frame.externalHealingSourceResultId = delivered ? 'external-heal-healing-source-2' : 'none';
    frame.dangerActive = false;
    frame.playerMotion.attack = strikePulse(t, spec.destroyAt, 0.46);
    frame.playerMotion.dodge = 0;
    frame.playerMotion.impact = 0;
    frame.bossMotion.attack = frame.externalHealingSourceHealing ? pulse(healingProgress) * 0.4 : 0;
  }
  if (spec.mode === 'damage-rate-cap') {
    const hits = [
      { at: spec.isolatedHitAt, recent: 0, id: 'isolated-1' },
      { at: spec.burstHits[0], recent: 0, id: 'burst-1' },
      { at: spec.burstHits[1], recent: 18, id: 'burst-2' },
      { at: spec.burstHits[2], recent: 36, id: 'burst-3' },
      { at: spec.burstHits[3], recent: 54, id: 'burst-4' },
      { at: spec.recoveredHitAt, recent: 0, id: 'recovered-1' },
    ];
    const resolvedHits = hits
      .filter(({ at }) => t >= at)
      .map(({ recent, id }) =>
        damageRateCapResolve({
          rawDamage: spec.rawDamage,
          recentDamage: recent,
          threshold: spec.threshold,
          minimumMultiplier: spec.minimumMultiplier,
          hitId: id,
        }),
      );
    const activeHits = t >= spec.resetAt ? [] : resolvedHits;
    const latest = activeHits.at(-1);
    const totalApplied = activeHits.reduce((sum, hit) => sum + hit.appliedDamage, 0);
    let recentDamage = 0;
    if (t >= spec.isolatedHitAt && t < spec.firstWindowClearsAt)
      recentDamage = mix(spec.rawDamage, 0, smooth((t - (spec.firstWindowClearsAt - 0.42)) / 0.42));
    if (t >= spec.burstHits[0] && t < spec.decay[0])
      recentDamage = spec.rawDamage * spec.burstHits.filter((hitAt) => t >= hitAt).length;
    if (t >= spec.decay[0] && t < spec.decay[1])
      recentDamage = mix(
        spec.rawDamage * spec.burstHits.length,
        0,
        smooth((t - spec.decay[0]) / (spec.decay[1] - spec.decay[0])),
      );
    if (t >= spec.recoveredHitAt && t < spec.resetAt) recentDamage = spec.rawDamage;
    frame.damageRateCapState = damageRateCapState(t);
    frame.damageRateCapHitCount = activeHits.length;
    frame.damageRateCapRawDamage = latest?.rawDamage ?? 0;
    frame.damageRateCapAppliedDamage = latest?.appliedDamage ?? 0;
    frame.damageRateCapPreventedDamage =
      t >= spec.decay[1] && t < spec.recoveredHitAt ? 0 : (latest?.preventedDamage ?? 0);
    frame.damageRateCapTotalApplied = totalApplied;
    frame.damageRateCapRecentDamage = recentDamage;
    frame.damageRateCapThreshold = spec.threshold;
    frame.damageRateCapMultiplier =
      t >= spec.decay[1] && t < spec.recoveredHitAt ? 1 : (latest?.multiplier ?? 1);
    frame.damageRateCapLastHitId = latest?.hitId ?? 'none';
    frame.damageRateCapEventCount = activeHits.length;
    frame.damageRateCapBurstActive = t >= spec.burstHits[0] && t < spec.burstEndsAt;
    frame.damageRateCapWindowRecovered = t >= spec.decay[1] && t < spec.resetAt;
    frame.damageRateCapBossHealth =
      t < spec.resetAt
        ? spec.bossHealthBefore - totalApplied
        : mix(
            spec.bossHealthBefore - resolvedHits.reduce((sum, hit) => sum + hit.appliedDamage, 0),
            spec.bossHealthBefore,
            smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt)),
          );
    frame.dangerActive = false;
    frame.playerMotion.attack = Math.max(...hits.map(({ at }) => strikePulse(t, at, 0.36)));
    frame.playerMotion.dodge = 0;
    frame.playerMotion.impact = 0;
    frame.bossMotion.attack = Math.max(...hits.map(({ at }) => strikePulse(t, at, 0.3)));
  }
  if (spec.mode === 'loadout-mirror') {
    const snapshotActive = t >= spec.captureAt && t < spec.resetAt;
    const playerChanged = t >= spec.playerSwapAt && t < spec.resetAt;
    const bossUsedCopiedAttack = t >= spec.bossUseAt && t < spec.resetAt;
    frame.loadoutMirrorState = loadoutMirrorState(t);
    frame.loadoutMirrorSnapshotCaptured = snapshotActive;
    frame.loadoutMirrorSnapshotId = snapshotActive ? spec.snapshotId : 'none';
    frame.loadoutMirrorSnapshotEventCount = snapshotActive ? 1 : 0;
    frame.loadoutMirrorPlayerLoadoutIds = playerChanged
      ? [...spec.changedLoadout]
      : [...spec.initialLoadout];
    frame.loadoutMirrorCopiedLoadoutIds = snapshotActive ? [...spec.initialLoadout] : [];
    frame.loadoutMirrorCopyMatchesSnapshot = snapshotActive;
    frame.loadoutMirrorPlayerChanged = playerChanged;
    frame.loadoutMirrorLiveResnapshotCount = 0;
    frame.loadoutMirrorBossPackage = snapshotActive ? spec.initialLoadout.join('+') : 'none';
    frame.loadoutMirrorBossUsedCopiedAttack = bossUsedCopiedAttack;
    frame.dangerActive = false;
    frame.playerMotion.attack = strikePulse(t, spec.playerSwapAt, 0.46) * 0.25;
    frame.playerMotion.dodge = 0;
    frame.playerMotion.impact = 0;
    frame.bossMotion.attack = strikePulse(t, spec.bossUseAt, 0.72);
  }
  if (spec.mode === 'moveset-shapeshifting') {
    const form =
      t < spec.firstChange[1]
        ? spec.forms[0]
        : t < spec.secondChange[1]
          ? spec.forms[1]
          : spec.forms[2];
    const formIndex = spec.forms.indexOf(form);
    const attackActive =
      (t >= spec.firstActive[0] && t < spec.firstActive[1]) ||
      (t >= spec.secondActive[0] && t < spec.secondActive[1]) ||
      (t >= spec.thirdActive[0] && t < spec.thirdActive[1]);
    frame.movesetShapeshiftingState = movesetShapeshiftingState(t);
    frame.movesetShapeshiftingForm = form;
    frame.movesetShapeshiftingPackageId = spec.packages[formIndex];
    frame.movesetShapeshiftingFormIndex = formIndex;
    frame.movesetShapeshiftingPackageAttackActive = attackActive;
    frame.movesetShapeshiftingTransitionActive =
      (t >= spec.firstChange[0] && t < spec.firstChange[1]) ||
      (t >= spec.secondChange[0] && t < spec.secondChange[1]);
    frame.movesetShapeshiftingChangeCount =
      (t >= spec.firstChange[1] ? 1 : 0) + (t >= spec.secondChange[1] ? 1 : 0);
    frame.movesetShapeshiftingPackageScope = spec.packages.length;
    frame.movesetShapeshiftingChangeId =
      t >= spec.secondChange[1]
        ? 'moveset-change-2'
        : t >= spec.firstChange[1]
          ? 'moveset-change-1'
          : 'none';
    frame.movesetShapeshiftingEventCount = frame.movesetShapeshiftingChangeCount;
    frame.dangerActive = false;
    frame.playerMotion.attack = 0;
    frame.playerMotion.dodge = 0;
    frame.playerMotion.impact = 0;
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.firstActive[0], 0.72),
      strikePulse(t, spec.secondActive[0], 0.72),
      strikePulse(t, spec.thirdActive[0], 0.72),
    );
  }
  if (spec.mode === 'ally-theft') {
    const allyStart = point(spec.allyStart);
    const allyCaptured = point(spec.allyCaptured);
    let allyPosition = allyStart;
    if (t >= spec.transfer[0] && t < spec.transfer[1]) {
      const progress = smooth((t - spec.transfer[0]) / (spec.transfer[1] - spec.transfer[0]));
      allyPosition = {
        x: mix(allyStart.x, allyCaptured.x, progress),
        y: mix(allyStart.y, allyCaptured.y, progress),
      };
    } else if (t >= spec.transfer[1] && t < spec.release[0]) {
      allyPosition = {
        x: allyCaptured.x + Math.sin((t - spec.transfer[1]) * Math.PI * 2) * 13,
        y: allyCaptured.y + Math.cos((t - spec.transfer[1]) * Math.PI * 2) * 7,
      };
    } else if (t >= spec.release[0] && t < spec.returning[1]) {
      const progress = smooth((t - spec.release[0]) / (spec.returning[1] - spec.release[0]));
      allyPosition = {
        x: mix(allyCaptured.x, allyStart.x, progress),
        y: mix(allyCaptured.y, allyStart.y, progress),
      };
    }
    const projectiles = spec.shotTimes.flatMap((at, index) => {
      if (t < at || t >= at + spec.shotFlight) return [];
      const progress = smooth((t - at) / spec.shotFlight);
      const target = point(spec.shotTargets[index]);
      return [
        Object.freeze({
          id: `stolen-ally-shot-${index + 1}`,
          x: mix(allyCaptured.x, target.x, progress),
          y: mix(allyCaptured.y, target.y, progress),
          progress,
          target: Object.freeze(target),
        }),
      ];
    });
    frame.allyTheftState = allyTheftState(t);
    frame.allyTheftAllyId = spec.allyId;
    frame.allyTheftCaptureId = t >= spec.mark[0] && t < spec.resetAt ? spec.captureId : 'none';
    frame.allyTheftOwnerId =
      t < spec.transfer[0]
        ? 'player'
        : t < spec.release[0]
          ? 'boss'
          : t < spec.returning[1]
            ? 'neutral'
            : 'player';
    frame.allyTheftAlly = Object.freeze(allyPosition);
    frame.allyTheftMarked = t >= spec.mark[0] && t < spec.transfer[1];
    frame.allyTheftHostile = t >= spec.hostile[0] && t < spec.hostile[1];
    frame.allyTheftProjectiles = Object.freeze(projectiles);
    frame.allyTheftCommandCount = spec.shotTimes.filter((at) => t >= at && t < spec.resetAt).length;
    frame.allyTheftOwnershipEventCount =
      (t >= spec.transfer[0] && t < spec.resetAt ? 1 : 0) +
      (t >= spec.returning[1] && t < spec.resetAt ? 1 : 0);
    frame.allyTheftEligibleCount = 1;
    frame.allyTheftReleaseReason =
      t >= spec.release[0] && t < spec.resetAt ? 'duration-complete' : 'none';
    frame.allyTheftRecaptureBlocked = t >= spec.returning[1] && t < spec.resetAt;
    frame.dangerActive = projectiles.length > 0;
    frame.playerMotion.attack = 0;
    frame.playerMotion.dodge = Math.max(...spec.shotTimes.map((at) => strikePulse(t, at, 0.46)));
    frame.playerMotion.impact = 0;
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.mark[0], 0.7),
      ...spec.shotTimes.map((at) => strikePulse(t, at, 0.42) * 0.35),
    );
  }
  if (spec.mode === 'false-death') {
    const collapseProgress = clamp((t - spec.collapse[0]) / (spec.collapse[1] - spec.collapse[0]));
    const rebuildProgress = clamp((t - spec.rebuild[0]) / (spec.rebuild[1] - spec.rebuild[0]));
    const resetProgress = clamp((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const phaseOneHealth = t < spec.strikeAt ? spec.phaseOneHealth : 0;
    const phaseTwoHealth = t >= spec.revivalAt && t < spec.resetAt ? spec.phaseTwoHealth : 0;
    frame.falseDeathState = falseDeathState(t);
    frame.falseDeathDepletionId =
      t >= spec.strikeAt && t < spec.resetAt ? spec.depletionId : 'none';
    frame.falseDeathRevivalId = t >= spec.revivalAt && t < spec.resetAt ? spec.revivalId : 'none';
    frame.falseDeathCurrentPhase = t >= spec.revivalAt && t < spec.resetAt ? 2 : 1;
    frame.falseDeathBossHealth =
      t < spec.resetAt
        ? Math.max(phaseOneHealth, phaseTwoHealth)
        : mix(spec.phaseTwoHealth, spec.phaseOneHealth, smooth(resetProgress));
    frame.falseDeathPhaseHealthDepleted = t >= spec.strikeAt && t < spec.resetAt;
    frame.falseDeathCompletionPending = t >= spec.strikeAt && t < spec.resetAt;
    frame.falseDeathEncounterComplete = false;
    frame.falseDeathRewardLocked = true;
    frame.falseDeathExitLocked = true;
    frame.falseDeathRebuildActive = t >= spec.rebuild[0] && t < spec.rebuild[1];
    frame.falseDeathRevived = t >= spec.revivalAt && t < spec.resetAt;
    frame.falseDeathRevivalCount = frame.falseDeathRevived ? 1 : 0;
    frame.falseDeathEventCount =
      (t >= spec.strikeAt && t < spec.resetAt ? 1 : 0) +
      (t >= spec.revivalAt && t < spec.resetAt ? 1 : 0);
    frame.falseDeathSecondSignalActive = t >= spec.secondSignal[0] && t < spec.secondSignal[1];
    frame.falseDeathSecondAttackActive = t >= spec.secondActive[0] && t < spec.secondActive[1];
    frame.dangerActive = frame.falseDeathSecondAttackActive;
    frame.bossScale =
      t < spec.collapse[0]
        ? 1
        : t < spec.collapse[1]
          ? mix(1, 0.58, smooth(collapseProgress))
          : t < spec.rebuild[0]
            ? 0.58
            : t < spec.rebuild[1]
              ? mix(0.58, 1.08, smooth(rebuildProgress))
              : t < spec.resetAt
                ? 1.08
                : mix(1.08, 1, smooth(resetProgress));
    frame.boss.y =
      t < spec.collapse[0]
        ? spec.boss[1]
        : t < spec.rebuild[0]
          ? mix(spec.boss[1], spec.boss[1] + 82, smooth(collapseProgress))
          : t < spec.rebuild[1]
            ? mix(spec.boss[1] + 82, spec.boss[1], smooth(rebuildProgress))
            : spec.boss[1];
    frame.playerMotion.attack = strikePulse(t, spec.strikeAt, 0.54);
    frame.playerMotion.dodge = strikePulse(t, spec.secondActive[0], 0.52);
    frame.playerMotion.impact = 0;
    frame.bossMotion.crouch =
      t < spec.rebuild[0] ? collapseProgress : Math.max(0, 1 - rebuildProgress);
    frame.bossMotion.lift = frame.falseDeathRebuildActive ? pulse(rebuildProgress) * 0.3 : 0;
    frame.bossMotion.impact = strikePulse(t, spec.strikeAt, 0.5);
    frame.bossMotion.attack = strikePulse(t, spec.secondActive[0], 0.62);
  }
  if (spec.mode === 'action-reactive-punish') {
    const projectileProgress = clamp(
      (t - spec.responseFlight[0]) / (spec.responseFlight[1] - spec.responseFlight[0]),
    );
    frame.actionReactivePunishState = actionReactivePunishState(t);
    frame.actionReactivePunishActionId =
      t >= spec.action[0] && t < spec.resetAt ? spec.actionId : 'none';
    frame.actionReactivePunishResponseId =
      t >= spec.observedAt && t < spec.responseRecoveryEndsAt ? spec.responseId : 'none';
    frame.actionReactivePunishObserved = t >= spec.observedAt && t < spec.resetAt;
    frame.actionReactivePunishResponseQueued =
      t >= spec.responseSignal[0] && t < spec.responseSignal[1];
    frame.actionReactivePunishCommitted =
      t >= spec.responseFlight[0] && t < spec.responseRecoveryEndsAt;
    frame.actionReactivePunishProjectileActive =
      t >= spec.responseFlight[0] && t < spec.responseFlight[1];
    frame.actionReactivePunishProjectile = Object.freeze({
      x: mix(spec.projectileStart[0], spec.lockedTarget[0], projectileProgress),
      y: mix(spec.projectileStart[1], spec.lockedTarget[1], projectileProgress),
    });
    frame.actionReactivePunishTarget = Object.freeze(point(spec.lockedTarget));
    frame.actionReactivePunishBossAvailable = t < spec.bossCommit[0] || t >= spec.bossRecovery[1];
    frame.actionReactivePunishCooldownReady = t < spec.observedAt || t >= spec.cooldownEndsAt;
    frame.actionReactivePunishBossAttackActive = t >= spec.bossAttack[0] && t < spec.bossAttack[1];
    frame.actionReactivePunishSafeWindow = t >= spec.bossRecovery[0] && t < spec.bossRecovery[1];
    frame.actionReactivePunishSafeActionActive = t >= spec.safeAction[0] && t < spec.safeAction[1];
    frame.actionReactivePunishSafeActionCompleted = t >= spec.safeAction[1] && t < spec.resetAt;
    frame.actionReactivePunishRejectionReason = frame.actionReactivePunishSafeActionActive
      ? 'boss-busy'
      : 'none';
    frame.actionReactivePunishResponseCount = t >= spec.observedAt && t < spec.resetAt ? 1 : 0;
    frame.actionReactivePunishEventCount = frame.actionReactivePunishResponseCount;
    frame.dangerActive =
      frame.actionReactivePunishProjectileActive || frame.actionReactivePunishBossAttackActive;
    frame.playerMotion.crouch = Math.max(
      t >= spec.action[0] && t < spec.action[1] ? pulse((t - spec.action[0]) / 0.7) * 0.32 : 0,
      frame.actionReactivePunishSafeActionActive
        ? pulse((t - spec.safeAction[0]) / 0.93) * 0.32
        : 0,
    );
    frame.playerMotion.lift = frame.playerMotion.crouch * 0.45;
    frame.playerMotion.dodge = strikePulse(t, spec.playerDodge[0] + 0.2, 0.4);
    frame.playerMotion.attack = 0;
    frame.playerMotion.impact = 0;
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.responseFlight[0], 0.5),
      strikePulse(t, (spec.bossAttack[0] + spec.bossAttack[1]) / 2, 0.48),
    );
    frame.bossMotion.crouch = frame.actionReactivePunishSafeWindow ? 0.24 : 0;
  }
  if (spec.mode === 'run-history-manifestation') {
    const projectileProgress = clamp(
      (t - spec.echoFlight[0]) / (spec.echoFlight[1] - spec.echoFlight[0]),
    );
    frame.runHistoryManifestationState = runHistoryManifestationState(t);
    frame.runHistoryManifestationCaptured = t >= spec.capturedAt && t < spec.resetAt;
    frame.runHistoryManifestationEncounterId = spec.encounterId;
    frame.runHistoryManifestationEntryId = spec.entryId;
    frame.runHistoryManifestationManifestId = frame.runHistoryManifestationCaptured
      ? spec.manifestId
      : 'none';
    frame.runHistoryManifestationHistoryVersion = 1;
    frame.runHistoryManifestationHistoryCount = 3;
    frame.runHistoryManifestationEchoCount = frame.runHistoryManifestationCaptured ? 1 : 0;
    frame.runHistoryManifestationSupportCount = frame.runHistoryManifestationCaptured ? 1 : 0;
    frame.runHistoryManifestationModifierCount = frame.runHistoryManifestationCaptured ? 1 : 0;
    frame.runHistoryManifestationCaptureEvents = frame.runHistoryManifestationCaptured ? 1 : 0;
    frame.runHistoryManifestationLiveResnapshots = 0;
    frame.runHistoryManifestationEchoActive = t >= spec.echoFlight[0] && t < spec.echoFlight[1];
    frame.runHistoryManifestationProjectile = Object.freeze({
      x: mix(spec.echo[0], spec.echoTarget[0], projectileProgress),
      y: mix(spec.echo[1], spec.echoTarget[1], projectileProgress),
    });
    frame.runHistoryManifestationRelicActive = t >= spec.relicActive[0] && t < spec.relicActive[1];
    frame.runHistoryManifestationWardProtecting = t >= spec.echoSignal[0] && t < spec.retry[1];
    frame.runHistoryManifestationRetryStable = t >= spec.retry[0] && t < spec.retry[1];
    frame.runHistoryManifestationManifestUnchanged = frame.runHistoryManifestationRetryStable;
    frame.dangerActive =
      frame.runHistoryManifestationEchoActive || frame.runHistoryManifestationRelicActive;
    frame.playerMotion.dodge = strikePulse(t, spec.playerMove[0] + 0.28, 0.44);
    frame.playerMotion.attack = 0;
    frame.playerMotion.impact = 0;
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.echoFlight[0], 0.36) * 0.25,
      strikePulse(t, (spec.relicActive[0] + spec.relicActive[1]) / 2, 0.58),
    );
  }
  if (spec.mode === 'interface-interaction') {
    frame.interfaceInteractionState = interfaceInteractionState(t);
    frame.interfaceInteractionInteractionId = spec.interactionId;
    frame.interfaceInteractionConfirmationId = spec.confirmationId;
    frame.interfaceInteractionPrimaryRoute = spec.primaryRoute;
    frame.interfaceInteractionSelectedRoute =
      t >= spec.confirm[0] && t < spec.resetAt ? spec.alternateRoute : spec.primaryRoute;
    frame.interfaceInteractionPaused = t >= spec.pause[0] && t < spec.pause[1];
    frame.interfaceInteractionFocusOutside = frame.interfaceInteractionPaused;
    frame.interfaceInteractionRouteSwitching = t >= spec.switchRoute[0] && t < spec.switchRoute[1];
    frame.interfaceInteractionConfirmed = t >= spec.confirm[0] && t < spec.resetAt;
    frame.interfaceInteractionConfirmationCount = frame.interfaceInteractionConfirmed ? 1 : 0;
    frame.interfaceInteractionNormalAttemptBlocked = t >= spec.blockedAt && t < spec.pause[0];
    frame.interfaceInteractionWardReading = t < spec.confirm[0] || t >= spec.resetAt;
    frame.interfaceInteractionOpeningActive = t >= spec.opening[0] && t < spec.opening[1];
    frame.interfaceInteractionCounterSignaled = t >= spec.counterSignal[0] && t < spec.counter[0];
    frame.interfaceInteractionCounterActive = t >= spec.counter[0] && t < spec.counter[1];
    frame.interfaceInteractionFallbackAvailable = true;
    frame.interfaceInteractionFallbackUsed = false;
    frame.interfaceInteractionHostileTicksWhilePaused = 0;
    frame.interfaceInteractionDestructiveActionCount = 0;
    frame.interfaceInteractionPrivatePayloadStored = false;
    frame.interfaceInteractionRetrySafe = t >= spec.retry[0] && t < spec.retry[1];
    frame.interfaceInteractionRouteRestored = frame.interfaceInteractionRetrySafe;
    frame.dangerActive = frame.interfaceInteractionCounterActive;
    frame.playerMotion.attack = Math.max(
      strikePulse(t, (spec.firstAttack[0] + spec.firstAttack[1]) / 2, 0.48),
      strikePulse(t, (spec.opening[0] + spec.opening[1]) / 2, 0.56),
    );
    frame.playerMotion.dodge = strikePulse(t, spec.playerMove[0] + 0.2, 0.46);
    frame.playerMotion.impact = 0;
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.blockedAt, 0.36) * 0.32,
      strikePulse(t, (spec.counter[0] + spec.counter[1]) / 2, 0.5),
    );
  }
  if (spec.mode === 'world-state-variant') {
    frame.worldStateVariantState = worldStateVariantState(t);
    frame.worldStateVariantEncounterId = spec.encounterId;
    frame.worldStateVariantEntryId = spec.entryId;
    frame.worldStateVariantSnapshotVersion = 1;
    frame.worldStateVariantSnapshotCaptured = t >= spec.snapshotAt && t < spec.resetAt;
    frame.worldStateVariantSnapshotCount = frame.worldStateVariantSnapshotCaptured ? 1 : 0;
    frame.worldStateVariantSelectedTimeBand = frame.worldStateVariantSnapshotCaptured
      ? 'eclipse'
      : 'none';
    frame.worldStateVariantOutsideTimeBand =
      t >= spec.outsideChangeAt && t < spec.resetAt ? 'dawn' : 'eclipse';
    frame.worldStateVariantRegionState = frame.worldStateVariantSnapshotCaptured
      ? 'ruined'
      : 'none';
    frame.worldStateVariantWorldMode = frame.worldStateVariantSnapshotCaptured ? 'cursed' : 'none';
    frame.worldStateVariantVariantId = frame.worldStateVariantSnapshotCaptured
      ? spec.variantId
      : 'none';
    frame.worldStateVariantPackageMaterialized = t >= spec.materialize[1] && t < spec.resetAt;
    frame.worldStateVariantHazardCount = frame.worldStateVariantPackageMaterialized ? 2 : 0;
    frame.worldStateVariantModifierCount = frame.worldStateVariantPackageMaterialized ? 2 : 0;
    frame.worldStateVariantRewardTableId = frame.worldStateVariantSnapshotCaptured
      ? spec.rewardTableId
      : 'none';
    frame.worldStateVariantRewardMapped = t >= spec.reward[0] && t < spec.resetAt;
    frame.worldStateVariantAttackSignaled = t >= spec.attackSignal[0] && t < spec.attack[0];
    frame.worldStateVariantAttackActive = t >= spec.attack[0] && t < spec.attack[1];
    frame.worldStateVariantOpeningActive = t >= spec.opening[0] && t < spec.opening[1];
    frame.worldStateVariantRetryStable = t >= spec.retry[0] && t < spec.retry[1];
    frame.worldStateVariantVariantUnchanged = frame.worldStateVariantRetryStable;
    frame.worldStateVariantLiveResnapshots = 0;
    frame.worldStateVariantFallbackUsed = false;
    frame.dangerActive = frame.worldStateVariantAttackActive;
    frame.playerMotion.dodge = strikePulse(t, spec.playerMove[0] + 0.28, 0.48);
    frame.playerMotion.attack = strikePulse(t, (spec.opening[0] + spec.opening[1]) / 2, 0.58);
    frame.playerMotion.impact = 0;
    frame.bossMotion.attack = strikePulse(t, (spec.attack[0] + spec.attack[1]) / 2, 0.58);
  }
  if (spec.mode === 'party-size-scaling') {
    frame.partySizeScalingState = partySizeScalingState(t);
    frame.partySizeScalingEncounterId = spec.encounterId;
    frame.partySizeScalingRosterVersion = 1;
    frame.partySizeScalingJoinQueued = t >= spec.joinQueuedAt && t < spec.scaleApplyAt;
    frame.partySizeScalingLeaveQueued = t >= spec.leaveQueuedAt && t < spec.leaveApplyAt;
    frame.partySizeScalingScaleApplied = t >= spec.scaleApplyAt && t < spec.resetAt;
    frame.partySizeScalingPartySize = t < spec.scaleApplyAt || t >= spec.leaveApplyAt ? 1 : 2;
    frame.partySizeScalingResolutionId =
      t >= spec.leaveApplyAt && t < spec.resetAt
        ? spec.leaveResolutionId
        : t >= spec.scaleApplyAt
          ? spec.joinResolutionId
          : 'none';
    frame.partySizeScalingHealthMultiplier = frame.partySizeScalingPartySize === 2 ? 1.6 : 1;
    frame.partySizeScalingMaxHealth = frame.partySizeScalingPartySize === 2 ? 1600 : 1000;
    frame.partySizeScalingHealthFraction = 0.68;
    frame.partySizeScalingCurrentHealth = Math.round(
      frame.partySizeScalingMaxHealth * frame.partySizeScalingHealthFraction,
    );
    frame.partySizeScalingTargetSlots = frame.partySizeScalingPartySize === 2 ? 2 : 1;
    frame.partySizeScalingHazardBudget = frame.partySizeScalingPartySize === 2 ? 1.35 : 1;
    frame.partySizeScalingApplicationCount =
      t >= spec.leaveApplyAt && t < spec.resetAt ? 2 : t >= spec.scaleApplyAt ? 1 : 0;
    frame.partySizeScalingMidAttackApplications = 0;
    frame.partySizeScalingProgressReversed = false;
    frame.partySizeScalingAttackSignaled = t >= spec.attackSignal[0] && t < spec.attack[0];
    frame.partySizeScalingAttackActive = t >= spec.attack[0] && t < spec.attack[1];
    frame.partySizeScalingOpeningActive = t >= spec.opening[0] && t < spec.opening[1];
    frame.partySizeScalingEligibilitySettled = t >= spec.reward[0] && t < spec.resetAt;
    frame.partySizeScalingRewardShareCount = frame.partySizeScalingEligibilitySettled ? 2 : 0;
    frame.partySizeScalingRetryStable = t >= spec.retry[0] && t < spec.retry[1];
    frame.dangerActive = frame.partySizeScalingAttackActive;
    frame.playerMotion.dodge = strikePulse(t, spec.playerMove[0] + 0.3, 0.5);
    frame.playerMotion.attack = strikePulse(t, (spec.opening[0] + spec.opening[1]) / 2, 0.5);
    frame.playerMotion.impact = 0;
    frame.bossMotion.attack = strikePulse(t, (spec.attack[0] + spec.attack[1]) / 2, 0.58);
  }
  if (spec.mode === 'partner-revival') {
    const retrying = t >= spec.retry[0] && t < spec.retry[1];
    frame.partnerRevivalState = partnerRevivalState(t);
    frame.partnerRevivalEncounterId = spec.encounterId;
    frame.partnerRevivalPairVersion = 1;
    frame.partnerRevivalPartnerBossId = spec.partnerBossId;
    frame.partnerRevivalReviverBossId = spec.reviverBossId;
    frame.partnerRevivalAttemptId =
      t >= spec.secondChannel[0] && t < spec.resetAt
        ? spec.secondAttemptId
        : t >= spec.firstChannel[0]
          ? spec.firstAttemptId
          : 'none';
    frame.partnerRevivalFirstDowned = t >= spec.firstDownAt && t < spec.firstReviveAt;
    frame.partnerRevivalSecondDowned = t >= spec.secondDownAt && t < spec.retry[0];
    frame.partnerRevivalPartnerDowned =
      frame.partnerRevivalFirstDowned || frame.partnerRevivalSecondDowned;
    frame.partnerRevivalFirstChannelActive = t >= spec.firstChannel[0] && t < spec.firstChannel[1];
    frame.partnerRevivalSecondChannelActive =
      t >= spec.secondChannel[0] && t < spec.secondChannel[1];
    frame.partnerRevivalChannelActive =
      frame.partnerRevivalFirstChannelActive || frame.partnerRevivalSecondChannelActive;
    frame.partnerRevivalChannelProgress = frame.partnerRevivalFirstChannelActive
      ? clamp((t - spec.firstChannel[0]) / (spec.firstChannel[1] - spec.firstChannel[0]))
      : frame.partnerRevivalSecondChannelActive
        ? clamp((t - spec.secondChannel[0]) / (spec.secondChannel[1] - spec.secondChannel[0]))
        : 0;
    frame.partnerRevivalReviveSucceeded = t >= spec.firstReviveAt && t < spec.resetAt;
    frame.partnerRevivalRevivedHealthFraction =
      t < spec.firstDownAt || retrying
        ? 1
        : t >= spec.firstReviveAt && t < spec.secondDownAt
          ? spec.reviveHealthFraction
          : 0;
    frame.partnerRevivalReviveGrantCount = frame.partnerRevivalReviveSucceeded ? 1 : 0;
    frame.partnerRevivalInterrupted = t >= spec.interruptAt && t < spec.resetAt;
    frame.partnerRevivalInterruptCount = frame.partnerRevivalInterrupted ? 1 : 0;
    frame.partnerRevivalInterruptLockActive = t >= spec.interruptAt && t < spec.interruptLockEnd;
    frame.partnerRevivalSynchronizedWindowActive = t >= spec.interruptAt && t < spec.completionAt;
    frame.partnerRevivalSurvivorHealthFraction =
      t < spec.survivorDownAt || retrying ? spec.survivorHealthFraction : 0;
    frame.partnerRevivalSurvivorDowned = t >= spec.survivorDownAt && t < spec.retry[0];
    frame.partnerRevivalCompletionAuthorized = t >= spec.completionAt && t < spec.retry[0];
    frame.partnerRevivalCompletionCount = frame.partnerRevivalCompletionAuthorized ? 1 : 0;
    frame.partnerRevivalDuplicateGrantCount = 0;
    frame.partnerRevivalRetryStable = retrying;
    frame.dangerActive = false;
    frame.bossVisible = frame.partnerRevivalSurvivorDowned ? 0.24 : 1;
    frame.playerMotion.attack = Math.max(
      strikePulse(t, spec.firstDownAt, 0.36),
      strikePulse(t, spec.secondDownAt, 0.36),
      strikePulse(t, spec.interruptAt, 0.4),
      strikePulse(t, spec.survivorDownAt, 0.42),
    );
    frame.playerMotion.dodge = 0;
    frame.playerMotion.impact = 0;
    frame.bossMotion.attack = Math.max(
      frame.partnerRevivalFirstChannelActive ? frame.partnerRevivalChannelProgress : 0,
      frame.partnerRevivalSecondChannelActive ? frame.partnerRevivalChannelProgress : 0,
    );
    frame.bossMotion.impact = Math.max(
      strikePulse(t, spec.interruptAt, 0.34),
      strikePulse(t, spec.survivorDownAt, 0.38),
    );
    frame.partnerMotion = motion({
      idle: frame.partnerRevivalPartnerDowned ? 0.08 : 1,
      impact: Math.max(
        strikePulse(t, spec.firstDownAt, 0.36),
        strikePulse(t, spec.secondDownAt, 0.36),
      ),
      attack: 0,
    });
    frame.partnerFacing = 90;
  }
  if (spec.mode === 'kill-order-inheritance') {
    const firstAttempt = t >= spec.firstDefeatAt && t < spec.intermission[0];
    const secondAttempt = t >= spec.intermission[1] && t < spec.resetAt;
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    frame.killOrderInheritanceState = killOrderInheritanceState(t);
    frame.killOrderInheritanceEncounterId = spec.encounterId;
    frame.killOrderInheritancePairVersion = 1;
    frame.killOrderInheritanceAttemptId = firstAttempt
      ? 'inheritance-attempt-1'
      : secondAttempt
        ? 'inheritance-attempt-2'
        : 'none';
    frame.killOrderInheritanceLeftDown = t >= spec.firstDefeatAt && t < spec.intermission[1];
    frame.killOrderInheritanceRightDown = t >= spec.secondDefeatAt && t < spec.resetAt;
    frame.killOrderInheritanceFirstTransferActive =
      t >= spec.firstTransfer[0] && t < spec.firstTransfer[1];
    frame.killOrderInheritanceSecondTransferActive =
      t >= spec.secondTransfer[0] && t < spec.secondTransfer[1];
    frame.killOrderInheritanceSourceBossId = firstAttempt
      ? spec.leftBossId
      : secondAttempt && frame.killOrderInheritanceRightDown
        ? spec.rightBossId
        : 'none';
    frame.killOrderInheritanceSurvivorBossId = firstAttempt
      ? spec.rightBossId
      : secondAttempt && frame.killOrderInheritanceRightDown
        ? spec.leftBossId
        : 'none';
    frame.killOrderInheritanceInheritedPackage =
      firstAttempt && t >= spec.firstTransfer[1]
        ? 'rune-wave'
        : secondAttempt && t >= spec.secondTransfer[1]
          ? 'rune-lance'
          : 'none';
    frame.killOrderInheritanceGrantCount =
      frame.killOrderInheritanceInheritedPackage === 'none' ? 0 : 1;
    frame.killOrderInheritanceWaveSignaled = t >= spec.waveSignal[0] && t < spec.waveSignal[1];
    frame.killOrderInheritanceWaveActive = t >= spec.waveActive[0] && t < spec.waveActive[1];
    frame.killOrderInheritanceLanceSignaled = t >= spec.lanceSignal[0] && t < spec.lanceSignal[1];
    frame.killOrderInheritanceLanceActive = t >= spec.lanceActive[0] && t < spec.lanceActive[1];
    frame.killOrderInheritanceRetryTransition =
      t >= spec.intermission[0] && t < spec.intermission[1];
    frame.killOrderInheritanceCompletionCount = 0;
    frame.killOrderInheritanceDuplicateGrantCount = 0;
    frame.dangerActive =
      frame.killOrderInheritanceWaveActive || frame.killOrderInheritanceLanceActive;
    frame.bossVisible = frame.killOrderInheritanceRightDown
      ? 0.78
      : t >= spec.resetAt
        ? mix(0.78, 1, reset)
        : 1;
    frame.bossRotation = frame.killOrderInheritanceRightDown ? -70 : 0;
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.waveActive[0], 0.65),
      frame.killOrderInheritanceFirstTransferActive ? 0.36 : 0,
    );
    frame.bossMotion.impact = strikePulse(t, spec.secondDefeatAt, 0.42);
    frame.partnerMotion = motion({
      idle: frame.killOrderInheritanceLeftDown ? 0.08 : 1,
      attack: Math.max(
        strikePulse(t, spec.lanceActive[0], 0.68),
        frame.killOrderInheritanceSecondTransferActive ? 0.36 : 0,
      ),
      impact: strikePulse(t, spec.firstDefeatAt, 0.42),
    });
    frame.partnerFacing = 45;
    frame.playerMotion.attack = Math.max(
      strikePulse(t, spec.firstDefeatAt, 0.42),
      strikePulse(t, spec.secondDefeatAt, 0.42),
    );
    frame.playerMotion.dodge = Math.max(
      strikePulse(t, spec.waveActive[0], 0.52),
      strikePulse(t, spec.lanceActive[0], 0.52),
    );
    frame.playerMotion.impact = 0;
  }
  if (spec.mode === 'shared-group-health') {
    const retry = t >= spec.retryAt;
    const events = retry
      ? []
      : [
          ...(t >= spec.firstHitAt
            ? [{ eventId: 'echo-1', bodyId: spec.leftBossId, amount: 28 }]
            : []),
          ...(t >= spec.secondHitAt
            ? [{ eventId: 'kern-1', bodyId: spec.rightBossId, amount: 33 }]
            : []),
          ...(t >= spec.finalHitAt
            ? [{ eventId: 'echo-2', bodyId: spec.leftBossId, amount: 39 }]
            : []),
        ];
    const ledger = sharedGroupHealthResolve({
      encounterId: spec.encounterId,
      attemptId: retry ? 'shared-health-attempt-2' : 'shared-health-attempt-1',
      bodyIds: [spec.leftBossId, spec.rightBossId],
      damageEvents: events,
    });
    frame.sharedGroupHealthState = sharedGroupHealthState(t);
    frame.sharedGroupHealthEncounterId = ledger.encounterId;
    frame.sharedGroupHealthAttemptId = ledger.attemptId;
    frame.sharedGroupHealthCurrentHealth = ledger.currentHealth;
    frame.sharedGroupHealthAcceptedEventCount = ledger.acceptedEventCount;
    frame.sharedGroupHealthDuplicateEventCount = ledger.duplicateEventCount;
    frame.sharedGroupHealthLeftPresent =
      retry || ((t < spec.withdrawAt || t >= spec.returnAt) && t < spec.finalHitAt);
    frame.sharedGroupHealthRightPresent = retry || t < spec.finalHitAt;
    frame.sharedGroupHealthLeftReturned = t >= spec.returnAt && t < spec.finalHitAt;
    frame.sharedGroupHealthFirstSignal = t >= spec.firstSignal[0] && t < spec.firstAttack[0];
    frame.sharedGroupHealthFirstAttack = t >= spec.firstAttack[0] && t < spec.firstAttack[1];
    frame.sharedGroupHealthSecondSignal = t >= spec.secondSignal[0] && t < spec.secondAttack[0];
    frame.sharedGroupHealthSecondAttack = t >= spec.secondAttack[0] && t < spec.secondAttack[1];
    frame.sharedGroupHealthCompletionCount =
      t >= spec.completionAt && t < spec.retryAt ? ledger.completionCount : 0;
    frame.sharedGroupHealthRetry = retry;
    frame.dangerActive = frame.sharedGroupHealthFirstAttack || frame.sharedGroupHealthSecondAttack;
    frame.bossVisible = frame.sharedGroupHealthRightPresent ? 1 : 0.18;
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.firstAttack[0], 0.58),
      strikePulse(t, spec.secondAttack[0], 0.58) * 0.35,
    );
    frame.bossMotion.impact = strikePulse(t, spec.secondHitAt, 0.4);
    frame.partnerMotion = motion({
      idle: frame.sharedGroupHealthLeftPresent ? 1 : 0.08,
      attack: strikePulse(t, spec.secondAttack[0], 0.55),
      impact: Math.max(strikePulse(t, spec.firstHitAt, 0.4), strikePulse(t, spec.finalHitAt, 0.4)),
    });
    frame.partnerFacing = 55;
    frame.playerMotion.attack = Math.max(
      strikePulse(t, spec.firstHitAt, 0.4),
      strikePulse(t, spec.secondHitAt, 0.4),
      strikePulse(t, spec.finalHitAt, 0.4),
    );
    frame.playerMotion.dodge = Math.max(
      strikePulse(t, spec.firstAttack[0], 0.55),
      strikePulse(t, spec.secondAttack[0], 0.55),
    );
    frame.playerMotion.impact = 0;
  }
  if (spec.mode === 'coordinated-duo-attack') {
    const secondAttempt = t >= spec.secondSignal[0] && t < spec.resetAt;
    const interrupted = secondAttempt && t >= spec.interruptAt;
    const ledger = coordinatedDuoAttackResolve({
      encounterId: spec.encounterId,
      comboId: spec.comboId,
      attemptId: secondAttempt ? 'duo-attempt-2' : 'duo-attempt-1',
      leaderBossId: spec.leaderBossId,
      followerBossId: spec.followerBossId,
      leaderPosition: frame.decoy,
      targetOffset: point(spec.targetOffset),
      leaderInterrupted: interrupted,
    });
    frame.coordinatedDuoAttackState = coordinatedDuoAttackState(t);
    frame.coordinatedDuoAttackTarget = ledger.sharedTarget;
    frame.coordinatedDuoAttackEncounterId = ledger.encounterId;
    frame.coordinatedDuoAttackAttemptId = ledger.attemptId;
    frame.coordinatedDuoAttackResolution = ledger.resolution;
    frame.coordinatedDuoAttackFirstSignal = t >= spec.firstSignal[0] && t < spec.leaderAttack[0];
    frame.coordinatedDuoAttackSecondSignal = t >= spec.secondSignal[0] && t < spec.interruptAt;
    frame.coordinatedDuoAttackLeaderActive = t >= spec.leaderAttack[0] && t < spec.leaderAttack[1];
    frame.coordinatedDuoAttackFollowerActive =
      t >= spec.followerAttack[0] && t < spec.followerAttack[1];
    frame.coordinatedDuoAttackInterrupted = interrupted;
    frame.coordinatedDuoAttackFollowupCancelled = t >= spec.plannedFollowerAt && t < spec.resetAt;
    frame.coordinatedDuoAttackFollowupCount =
      secondAttempt || t >= spec.resetAt ? 0 : Number(t >= spec.followerAttack[0]);
    frame.coordinatedDuoAttackRetry = t >= spec.resetAt;
    frame.dangerActive =
      frame.coordinatedDuoAttackLeaderActive || frame.coordinatedDuoAttackFollowerActive;
    frame.partnerMotion = motion({
      idle: 1,
      attack: strikePulse(t, spec.leaderAttack[0], 0.6),
      impact: strikePulse(t, spec.interruptAt, 0.5),
    });
    frame.partnerFacing = 45;
    frame.bossMotion.attack = strikePulse(t, spec.followerAttack[0], 0.62);
    frame.playerMotion.attack = strikePulse(t, spec.interruptAt, 0.5);
    frame.playerMotion.dodge = strikePulse(t, spec.leaderAttack[0], 0.7);
    frame.playerMotion.impact = 0;
  }
  if (spec.mode === 'stack-damage') {
    const gather = smooth((t - spec.gather[0]) / (spec.gather[1] - spec.gather[0]));
    const disperse = smooth((t - spec.disperse[0]) / (spec.disperse[1] - spec.disperse[0]));
    frame.stackDamageAllies = spec.allies.map((origin, index) => ({
      x: mix(mix(origin[0], spec.stackPoints[index][0], gather), origin[0], disperse),
      y: mix(mix(origin[1], spec.stackPoints[index][1], gather), origin[1], disperse),
    }));
    const secondHit = t >= spec.secondHit[0] && t < spec.secondHit[1];
    const hitActive = (t >= spec.firstHit[0] && t < spec.firstHit[1]) || secondHit;
    const ledger = stackDamageResolve({
      encounterId: spec.encounterId,
      hitId: secondHit ? spec.secondHitId : spec.firstHitId,
      targetPlayerId: spec.targetPlayerId,
      targetPosition: point(spec.target),
      markerRadius: spec.markerRadius,
      totalDamage: spec.totalDamage,
      players: [
        { id: spec.targetPlayerId, position: player, alive: true },
        ...frame.stackDamageAllies.map((ally, index) => ({
          id: spec.allyIds[index],
          position: ally,
          alive: true,
        })),
      ],
    });
    frame.stackDamageState = stackDamageState(t);
    frame.stackDamageEncounterId = ledger.encounterId;
    frame.stackDamageHitId = ledger.hitId;
    frame.stackDamageParticipantCount = ledger.participantCount;
    frame.stackDamageShare =
      ledger.perPlayer.find(({ id }) => id === spec.targetPlayerId)?.damage ?? 0;
    frame.stackDamageFirstHit = t >= spec.firstHit[0] && t < spec.firstHit[1];
    frame.stackDamageSecondHit = secondHit;
    frame.stackDamageHitActive = hitActive;
    frame.stackDamageHealthBefore = secondHit ? 70 : 100;
    frame.stackDamageHealth =
      t >= spec.resetAt
        ? [100, 100, 100]
        : t >= spec.secondResolveAt
          ? [0, 70, 70]
          : t >= spec.firstResolveAt
            ? [70, 70, 70]
            : [100, 100, 100];
    frame.stackDamageSoloFailure = t >= spec.secondResolveAt && t < spec.resetAt;
    frame.stackDamageRetry = t >= spec.resetAt;
    frame.stackDamageFallAngle = frame.stackDamageSoloFailure
      ? 75 * smooth((t - spec.secondResolveAt) / 0.1)
      : 0;
    frame.stackDamageApplicationCount = hitActive ? ledger.applicationCount : 0;
    frame.dangerActive = hitActive;
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.firstResolveAt, 0.6),
      strikePulse(t, spec.secondResolveAt, 0.6),
    );
    frame.playerMotion.impact = Math.max(
      strikePulse(t, spec.firstResolveAt, 0.5) * 0.4,
      strikePulse(t, spec.secondResolveAt, 0.65),
    );
    frame.stackDamageAllyMotion = motion({
      idle: 1,
      stride: Math.max(pulse(gather), pulse(disperse)),
      impact: strikePulse(t, spec.firstResolveAt, 0.5) * 0.4,
    });
  }
  if (spec.mode === 'personal-spread') {
    const separate = smooth((t - spec.separate[0]) / (spec.separate[1] - spec.separate[0]));
    const regroup = smooth((t - spec.regroup[0]) / (spec.regroup[1] - spec.regroup[0]));
    const retry = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const allies = spec.allies.map((origin, index) => ({
      x:
        mix(mix(origin[0], spec.safePoints[index][0], separate), origin[0], regroup) +
        (index === 0 ? -1 : 1) * 3 * pulse(retry),
      y: origin[1],
    }));
    frame.personalSpreadPositions = [player, ...allies];
    const secondHit = t >= spec.secondHit[0] && t < spec.secondHit[1];
    const hitActive = (t >= spec.firstHit[0] && t < spec.firstHit[1]) || secondHit;
    const ledger = personalSpreadResolve({
      encounterId: spec.encounterId,
      hitId: secondHit ? spec.secondHitId : spec.firstHitId,
      marked: frame.personalSpreadPositions.map((position, index) => ({
        id: spec.playerIds[index],
        position,
      })),
      markerRadius: spec.markerRadius,
      damagePerHit: spec.damagePerHit,
    });
    frame.personalSpreadState = personalSpreadState(t);
    frame.personalSpreadEncounterId = ledger.encounterId;
    frame.personalSpreadHitId = ledger.hitId;
    frame.personalSpreadHitCounts = ledger.perPlayer.map(({ hitCount }) => hitCount);
    frame.personalSpreadApplicationCount = hitActive ? ledger.applicationCount : 0;
    frame.personalSpreadHitActive = hitActive;
    frame.personalSpreadHealthBefore = secondHit ? 75 : 100;
    frame.personalSpreadHealth =
      t >= spec.resetAt
        ? [100, 100, 100]
        : t >= spec.secondHit[0]
          ? [0, 25, 25]
          : t >= spec.firstHit[0]
            ? [75, 75, 75]
            : [100, 100, 100];
    frame.personalSpreadFailure = t >= spec.secondHit[0] && t < spec.resetAt;
    frame.personalSpreadRetry = t >= spec.resetAt;
    frame.personalSpreadFallAngle = frame.personalSpreadFailure
      ? 75 * smooth((t - spec.secondHit[0]) / 0.12)
      : 0;
    frame.dangerActive = hitActive;
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.firstHit[0], 0.6),
      strikePulse(t, spec.secondHit[0], 0.6),
    );
    frame.playerMotion.impact = Math.max(
      strikePulse(t, spec.firstHit[0], 0.5) * 0.35,
      strikePulse(t, spec.secondHit[0], 0.65),
    );
    frame.personalSpreadAllyMotion = motion({
      idle: 1,
      stride: Math.max(pulse(separate), pulse(regroup), pulse(retry)),
      impact: strikePulse(t, spec.firstHit[0], 0.5) * 0.35,
    });
  }
  if (spec.mode === 'tower-soak') {
    const second = t >= spec.secondSignal[0] && t < spec.resetAt;
    const center = point(second ? spec.secondTower : spec.firstTower);
    const hitActive =
      (t >= spec.firstHit[0] && t < spec.firstHit[1]) ||
      (t >= spec.secondHit[0] && t < spec.secondHit[1]);
    const ledger = towerSoakResolve({
      encounterId: spec.encounterId,
      hitId: second ? spec.secondHitId : spec.firstHitId,
      center,
      players: [
        { id: spec.playerIds[0], position: player, alive: true },
        { id: spec.playerIds[1], position: point(spec.ally), alive: true },
      ],
      radius: spec.towerRadius,
      bodyRadius: spec.bodyRadius,
      requiredCount: second ? 2 : 1,
      occupantDamage: spec.occupantDamage,
      failureDamage: spec.failureDamage,
    });
    const firstLedger = towerSoakResolve({
      encounterId: spec.encounterId,
      hitId: spec.firstHitId,
      center: point(spec.firstTower),
      players: [
        { id: spec.playerIds[0], position: point(spec.firstTower), alive: true },
        { id: spec.playerIds[1], position: point(spec.ally), alive: true },
      ],
      radius: spec.towerRadius,
      bodyRadius: spec.bodyRadius,
      requiredCount: 1,
      occupantDamage: spec.occupantDamage,
      failureDamage: spec.failureDamage,
    });
    const firstHealth = spec.playerIds.map((id) =>
      Math.max(
        0,
        100 -
          (firstLedger.succeeded
            ? firstLedger.occupiedIds.includes(id)
              ? firstLedger.occupantDamage
              : 0
            : firstLedger.raidwideDamage),
      ),
    );
    const secondHealth = spec.playerIds.map((id, index) =>
      Math.max(
        0,
        firstHealth[index] -
          (ledger.succeeded
            ? ledger.occupiedIds.includes(id)
              ? ledger.occupantDamage
              : 0
            : ledger.raidwideDamage),
      ),
    );
    frame.towerSoakState = towerSoakState(t);
    frame.towerSoakCenter = center;
    frame.towerSoakAlly = point(spec.ally);
    frame.towerSoakRequiredCount = ledger.requiredCount;
    frame.towerSoakOccupiedCount = ledger.occupiedCount;
    frame.towerSoakOccupiedIds = ledger.occupiedIds;
    frame.towerSoakSucceeded = ledger.succeeded;
    frame.towerSoakHitId = ledger.hitId;
    frame.towerSoakHitActive = hitActive;
    frame.towerSoakApplicationCount = hitActive ? ledger.applicationCount : 0;
    frame.towerSoakFirstVisible = t >= spec.firstSignal[0] && t < spec.secondSignal[0];
    frame.towerSoakSecondVisible = t >= spec.secondSignal[0] && t < spec.resetAt;
    frame.towerSoakHealth =
      t >= spec.resetAt
        ? [100, 100]
        : t >= spec.secondHit[0]
          ? secondHealth
          : t >= spec.firstHit[0]
            ? firstHealth
            : [100, 100];
    frame.towerSoakFailure = t >= spec.secondHit[0] && t < spec.resetAt && !ledger.succeeded;
    frame.towerSoakRetry = t >= spec.resetAt;
    frame.towerSoakFallAngle = frame.towerSoakFailure
      ? 75 * smooth((t - spec.secondHit[0]) / 0.12)
      : 0;
    frame.dangerActive = hitActive;
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.firstHit[0], 0.58),
      strikePulse(t, spec.secondHit[0], 0.58),
    );
    frame.playerMotion.impact = Math.max(
      strikePulse(t, spec.firstHit[0], 0.46) * 0.3,
      strikePulse(t, spec.secondHit[0], 0.65),
    );
    frame.towerSoakAllyMotion = motion({
      idle: 1,
      impact: strikePulse(t, spec.secondHit[0], 0.65),
    });
  }
  if (spec.mode === 'entity-tether') {
    const together = smooth(
      (t - spec.travelTogether[0]) / (spec.travelTogether[1] - spec.travelTogether[0]),
    );
    const regroup = smooth((t - spec.regroup[0]) / (spec.regroup[1] - spec.regroup[0]));
    const apart = smooth((t - spec.travelApart[0]) / (spec.travelApart[1] - spec.travelApart[0]));
    const retry = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const moved = {
      x: mix(spec.ally[0], spec.togetherAlly[0], together),
      y: mix(spec.ally[1], spec.togetherAlly[1], together),
    };
    const returned = {
      x: mix(moved.x, spec.ally[0], regroup),
      y: mix(moved.y, spec.ally[1], regroup),
    };
    const separated = {
      x: mix(returned.x, spec.apartAlly[0], apart),
      y: mix(returned.y, spec.apartAlly[1], apart),
    };
    const ally = {
      x: mix(separated.x, spec.ally[0], retry),
      y: mix(separated.y, spec.ally[1], retry),
    };
    const second = t >= spec.secondWarn && t < spec.resetAt;
    const hitActive =
      (t >= spec.firstCheck[0] && t < spec.firstCheck[1]) ||
      (t >= spec.secondCheck[0] && t < spec.secondCheck[1]);
    const ledger = entityTetherResolve({
      encounterId: spec.encounterId,
      hitId: second ? spec.secondHitId : spec.firstHitId,
      first: { id: spec.playerIds[0], position: player, alive: true },
      second: { id: spec.playerIds[1], position: ally, alive: true },
      maxLength: spec.maxLength,
      breakDamage: spec.breakDamage,
    });
    frame.entityTetherState = entityTetherState(t);
    frame.entityTetherAlly = ally;
    frame.entityTetherDistance = ledger.distance;
    frame.entityTetherMaxLength = ledger.maxLength;
    frame.entityTetherHeld = ledger.held;
    frame.entityTetherHitId = ledger.hitId;
    frame.entityTetherHitActive = hitActive;
    frame.entityTetherApplicationCount = hitActive ? ledger.applicationCount : 0;
    frame.entityTetherVisible = t >= spec.linkAt && t < spec.resetAt;
    frame.entityTetherBroken = t >= spec.secondCheck[0] && t < spec.resetAt && !ledger.held;
    frame.entityTetherHealth =
      t >= spec.resetAt
        ? [100, 100]
        : t >= spec.secondCheck[0]
          ? [100 - ledger.damagePerEndpoint, 100 - ledger.damagePerEndpoint]
          : [100, 100];
    frame.entityTetherRetry = t >= spec.resetAt;
    frame.entityTetherFallAngle = frame.entityTetherBroken
      ? 72 * smooth((t - spec.secondCheck[0]) / 0.12)
      : 0;
    frame.dangerActive = hitActive;
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.firstCheck[0], 0.56),
      strikePulse(t, spec.secondCheck[0], 0.56),
    );
    frame.playerMotion.impact = strikePulse(t, spec.secondCheck[0], 0.6);
    frame.entityTetherAllyMotion = motion({
      idle: 1,
      stride: Math.max(pulse(together), pulse(regroup), pulse(apart), pulse(retry)),
      impact: strikePulse(t, spec.secondCheck[0], 0.6),
    });
  }
  if (spec.mode === 'gaze-check') {
    const second = t >= spec.secondWarnAt && t < spec.resetAt;
    const hitActive =
      (t >= spec.firstCheck[0] && t < spec.firstCheck[1]) ||
      (t >= spec.secondCheck[0] && t < spec.secondCheck[1]);
    const result = gazeCheckResolve({
      encounterId: spec.encounterId,
      hitId: second ? spec.secondHitId : spec.firstHitId,
      source: point(spec.source),
      target: { id: 'tavi', position: player, facingDegrees: frame.playerFacing, alive: true },
      halfAngle: spec.halfAngle,
      failureDamage: spec.failureDamage,
    });
    frame.gazeState = gazeCheckState(t);
    frame.gazeVisible = t >= spec.firstWarnAt && t < spec.resetAt;
    frame.gazeHitActive = hitActive;
    frame.gazeLooking = result.looking;
    frame.gazeBearing = result.bearing;
    frame.gazeHitId = result.hitId;
    frame.gazeApplicationCount = hitActive ? result.applicationCount : 0;
    frame.gazeFailure = t >= spec.secondCheck[0] && t < spec.resetAt && result.looking;
    frame.gazeHealth = frame.gazeFailure ? 100 - result.damage : 100;
    frame.gazeRetry = t >= spec.resetAt;
    frame.gazeFallAngle = frame.gazeFailure ? 72 * smooth((t - spec.secondCheck[0]) / 0.12) : 0;
    frame.dangerActive = hitActive;
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.firstCheck[0], 0.56),
      strikePulse(t, spec.secondCheck[0], 0.56),
    );
    frame.playerMotion.impact = strikePulse(t, spec.secondCheck[0], 0.6);
  }
  if (spec.mode === 'proximity-damage') {
    const source = point(spec.source);
    const first = proximityDamageResolve({
      encounterId: spec.encounterId,
      hitId: spec.firstHitId,
      source,
      target: { id: 'tavi', position: point(spec.farPoint), alive: true },
      innerRadius: spec.innerRadius,
      outerRadius: spec.outerRadius,
      minDamage: spec.minDamage,
      maxDamage: spec.maxDamage,
    });
    const second = proximityDamageResolve({
      encounterId: spec.encounterId,
      hitId: spec.secondHitId,
      source,
      target: { id: 'tavi', position: point(spec.nearPoint), alive: true },
      innerRadius: spec.innerRadius,
      outerRadius: spec.outerRadius,
      minDamage: spec.minDamage,
      maxDamage: spec.maxDamage,
    });
    const current = proximityDamageResolve({
      encounterId: spec.encounterId,
      hitId: t >= spec.secondWarnAt ? spec.secondHitId : spec.firstHitId,
      source,
      target: { id: 'tavi', position: player, alive: true },
      innerRadius: spec.innerRadius,
      outerRadius: spec.outerRadius,
      minDamage: spec.minDamage,
      maxDamage: spec.maxDamage,
    });
    const firstApplied = t >= spec.firstCheck[0] && t < spec.resetAt;
    const secondApplied = t >= spec.secondCheck[0] && t < spec.resetAt;
    frame.proximityState = proximityDamageState(t);
    frame.proximityVisible = t >= spec.firstWarnAt && t < spec.resetAt;
    frame.proximityHitActive =
      (t >= spec.firstCheck[0] && t < spec.firstCheck[1]) ||
      (t >= spec.secondCheck[0] && t < spec.secondCheck[1]);
    frame.proximityHitId = t >= spec.secondWarnAt ? spec.secondHitId : spec.firstHitId;
    frame.proximityCurrentDistance = current.distance;
    frame.proximityCurrentDamage = current.potentialDamage;
    frame.proximityFirstDamage = first.damage;
    frame.proximitySecondDamage = second.damage;
    frame.proximityApplicationCount = Number(firstApplied) + Number(secondApplied);
    frame.proximityHealth =
      100 - (firstApplied ? first.damage : 0) - (secondApplied ? second.damage : 0);
    frame.proximityNearHit = secondApplied;
    frame.proximityRetry = t >= spec.resetAt;
    frame.proximityFallAngle = secondApplied ? 72 * smooth((t - spec.secondCheck[0]) / 0.12) : 0;
    frame.dangerActive = frame.proximityHitActive;
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.firstCheck[0], 0.56),
      strikePulse(t, spec.secondCheck[0], 0.56),
    );
    frame.playerMotion.impact = Math.max(
      strikePulse(t, spec.firstCheck[0], 0.5) * 0.35,
      strikePulse(t, spec.secondCheck[0], 0.6),
    );
  }
  if (spec.mode === 'tank-swap') {
    const claim = smooth((t - spec.swapMove[0]) / (spec.swapMove[1] - spec.swapMove[0]));
    const retry = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const ally = {
      x: mix(mix(spec.ally[0], spec.allyClaim[0], claim), spec.ally[0], retry),
      y: mix(mix(spec.ally[1], spec.allyClaim[1], claim), spec.ally[1], retry),
    };
    const firstApplied = t >= spec.firstHit[0] && t < spec.resetAt;
    const secondApplied = t >= spec.secondHit[0] && t < spec.resetAt;
    const first = tankSwapResolve({
      encounterId: spec.encounterId,
      hitId: spec.firstHitId,
      target: { id: 'tavi', health: 100, vulnerability: 0, alive: true },
      baseDamage: spec.baseDamage,
      repeatedDamage: spec.repeatedDamage,
    });
    const second = tankSwapResolve({
      encounterId: spec.encounterId,
      hitId: spec.secondHitId,
      target: { id: 'ally', health: 100, vulnerability: 0, alive: true },
      baseDamage: spec.baseDamage,
      repeatedDamage: spec.repeatedDamage,
    });
    const failedHandoff = tankSwapResolve({
      encounterId: spec.encounterId,
      hitId: spec.secondHitId,
      target: {
        id: 'tavi',
        health: first.healthAfter,
        vulnerability: first.vulnerabilityAfter,
        alive: true,
      },
      baseDamage: spec.baseDamage,
      repeatedDamage: spec.repeatedDamage,
    });
    frame.tankSwapState = tankSwapState(t);
    frame.tankSwapOwner = t >= spec.claimAt && t < spec.resetAt ? 'ally' : 'tavi';
    frame.tankSwapAlly = ally;
    frame.tankSwapHealth = [
      100 - Number(firstApplied) * first.damage,
      100 - Number(secondApplied) * second.damage,
    ];
    frame.tankSwapVulnerability = [Number(firstApplied), Number(secondApplied)];
    frame.tankSwapFailedDamage = failedHandoff.damage;
    frame.tankSwapFailedHealth = failedHandoff.healthAfter;
    frame.tankSwapHitId =
      t >= spec.secondWarnAt && t < spec.resetAt ? spec.secondHitId : spec.firstHitId;
    frame.tankSwapHitActive =
      (t >= spec.firstHit[0] && t < spec.firstHit[1]) ||
      (t >= spec.secondHit[0] && t < spec.secondHit[1]);
    frame.tankSwapVisible = t >= spec.firstWarnAt && t < spec.resetAt;
    frame.tankSwapApplicationCount = Number(firstApplied) + Number(secondApplied);
    frame.tankSwapRetry = t >= spec.resetAt;
    frame.dangerActive = frame.tankSwapHitActive;
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.firstHit[0], 0.55),
      strikePulse(t, spec.secondHit[0], 0.55),
    );
    frame.playerMotion.impact = strikePulse(t, spec.firstHit[0], 0.55);
    frame.tankSwapAllyMotion = motion({
      stride: Math.max(pulse(claim), pulse(retry)),
      impact: strikePulse(t, spec.secondHit[0], 0.55),
    });
  }
  if (spec.mode === 'debuff-handoff') {
    const firstApproach = smooth(
      (t - spec.firstApproach[0]) / (spec.firstApproach[1] - spec.firstApproach[0]),
    );
    const firstRetreat = smooth(
      (t - spec.firstRetreat[0]) / (spec.firstRetreat[1] - spec.firstRetreat[0]),
    );
    const secondApproach = smooth(
      (t - spec.secondApproach[0]) / (spec.secondApproach[1] - spec.secondApproach[0]),
    );
    const secondRetreat = smooth(
      (t - spec.secondRetreat[0]) / (spec.secondRetreat[1] - spec.secondRetreat[0]),
    );
    const contact = Math.max(
      firstApproach * (1 - firstRetreat),
      secondApproach * (1 - secondRetreat),
    );
    const ally = {
      x: mix(spec.ally[0], spec.allyContact[0], contact),
      y: mix(spec.ally[1], spec.allyContact[1], contact),
    };
    const first = debuffHandoffResolve({
      encounterId: spec.encounterId,
      transferId: 'pass-1',
      source: { id: 'player-1', alive: true, x: spec.playerContact[0], y: spec.playerContact[1] },
      receiver: {
        id: 'player-2',
        alive: true,
        x: spec.allyContact[0],
        y: spec.allyContact[1],
        immuneUntil: 0,
      },
      time: spec.firstPassAt,
      expiresAt: 0.7 + spec.debuffDuration,
      contactRadius: spec.contactRadius,
      duration: spec.debuffDuration,
      returnImmunity: spec.returnImmunity,
    });
    const second = debuffHandoffResolve({
      encounterId: spec.encounterId,
      transferId: 'pass-2',
      source: { id: 'player-2', alive: true, x: spec.allyContact[0], y: spec.allyContact[1] },
      receiver: {
        id: 'player-1',
        alive: true,
        x: spec.playerContact[0],
        y: spec.playerContact[1],
        immuneUntil: first.sourceImmuneUntil,
      },
      time: spec.secondPassAt,
      expiresAt: first.expiresAt,
      contactRadius: spec.contactRadius,
      duration: spec.debuffDuration,
      returnImmunity: spec.returnImmunity,
    });
    const firstDone = t >= spec.firstPassAt && t < spec.resetAt;
    const secondDone = t >= spec.secondPassAt && t < spec.resetAt;
    const visible = t >= 0.7 && t < spec.resetAt;
    const expiresAt = secondDone
      ? second.expiresAt
      : firstDone
        ? first.expiresAt
        : 0.7 + spec.debuffDuration;
    frame.debuffHandoffState = debuffHandoffState(t);
    frame.debuffHandoffOwner = firstDone && !secondDone ? 'player-2' : 'player-1';
    frame.debuffHandoffAlly = ally;
    frame.debuffHandoffVisible = visible;
    frame.debuffHandoffRemaining = visible ? Math.max(0, expiresAt - t) : spec.debuffDuration;
    frame.debuffHandoffImmunity = [
      firstDone && t < first.sourceImmuneUntil,
      secondDone && t < second.sourceImmuneUntil,
    ];
    frame.debuffHandoffTransferCount = Number(firstDone) + Number(secondDone);
    frame.debuffHandoffFailedDamage = debuffHandoffExpire({
      encounterId: spec.encounterId,
      time: 0.7 + spec.debuffDuration,
      expiresAt: 0.7 + spec.debuffDuration,
      burstDamage: spec.burstDamage,
    }).damage;
    frame.debuffHandoffBurstActive = visible && t >= expiresAt;
    frame.debuffHandoffRetry = t >= spec.resetAt;
    frame.dangerActive = false;
    frame.bossMotion.attack = strikePulse(t, 0.7, 0.75);
    frame.playerMotion.stride = stride;
    frame.playerMotion.impact =
      Math.max(strikePulse(t, spec.firstPassAt, 0.3), strikePulse(t, spec.secondPassAt, 0.3)) *
      0.25;
    frame.debuffHandoffAllyMotion = motion({ stride, impact: frame.playerMotion.impact });
  }
  if (spec.mode === 'ordered-targets') {
    const moveOut = smooth((t - spec.move[0]) / (spec.move[1] - spec.move[0]));
    const moveBack = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const progress = moveOut * (1 - moveBack);
    const allies = spec.allies.map(([x, y], index) => ({
      x: mix(x, spec.receivingSpots[index + 1][0], progress),
      y: mix(y, spec.receivingSpots[index + 1][1], progress),
    }));
    const positions = [player, ...allies];
    const resolutions = spec.hits.map((hitAt, index) =>
      orderedTargetsResolve({
        encounterId: spec.encounterId,
        strikeId: `strike-${index + 1}`,
        expectedNumber: index + 1,
        selectedNumber: spec.assignments[index],
        assignedPlayerId: `player-${index + 1}`,
        center: positions[index],
        players: positions.map((position, playerIndex) => ({
          id: `player-${playerIndex + 1}`,
          alive: true,
          ...position,
        })),
        radius: spec.radius,
        intendedDamage: spec.intendedDamage,
        overlapDamage: spec.overlapDamage,
      }),
    );
    const completed = spec.hits.filter(
      (hitAt, index) => t >= hitAt && resolutions[index].resolution === 'resolved',
    ).length;
    const visible = t >= spec.revealAt && t < spec.resetAt;
    frame.orderedTargetState = orderedTargetsState(t);
    frame.orderedTargetPositions = positions;
    frame.orderedTargetAllies = allies;
    frame.orderedTargetNext = visible ? Math.min(4, completed + 1) : 0;
    frame.orderedTargetResolved = visible ? completed : 0;
    frame.orderedTargetHitId = completed && visible ? `strike-${completed}` : '';
    frame.orderedTargetHealth = resolutions.map((result, index) =>
      t >= spec.hits[index] && visible ? 100 - (result.damage[0]?.amount ?? 0) : 100,
    );
    frame.orderedTargetOverlapDamage =
      orderedTargetsResolve({
        center: positions[0],
        players: [
          { id: 'player-1', alive: true, ...positions[0] },
          { id: 'player-2', alive: true, ...positions[0] },
          { id: 'player-3', alive: true, ...positions[2] },
        ],
        radius: spec.radius,
        intendedDamage: spec.intendedDamage,
        overlapDamage: spec.overlapDamage,
      }).damage.find((hit) => hit.playerId === 'player-2')?.amount ?? 0;
    frame.orderedTargetRetry = t >= spec.resetAt;
    frame.orderedTargetAlliesMotion = motion({ stride });
    frame.playerMotion.stride = stride;
    frame.bossMotion.attack = Math.max(...spec.hits.map((hitAt) => strikePulse(t, hitAt, 0.45)));
    frame.dangerActive = spec.hits.some((hitAt) => t >= hitAt && t < hitAt + spec.hitDuration);
  }
  if (spec.mode === 'pairing-polarity') {
    const moveOut = smooth((t - spec.move[0]) / (spec.move[1] - spec.move[0]));
    const moveBack = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const progress = moveOut * (1 - moveBack);
    const allies = spec.allies.map(([x, y], index) => ({
      x: mix(x, spec.receivingSpots[index + 1][0], progress),
      y: mix(y, spec.receivingSpots[index + 1][1], progress),
    }));
    const positions = [player, ...allies];
    const result = pairingPolarityResolve({
      encounterId: spec.encounterId,
      players: positions.map((position, index) => ({
        id: `player-${index + 1}`,
        alive: true,
        polarity: spec.polarities[index],
        ...position,
      })),
      zones: spec.zones.map(([x, y]) => ({ x, y })),
      radius: spec.radius,
    });
    frame.pairingPolarityState = pairingPolarityState(t);
    frame.pairingPolarityPositions = positions;
    frame.pairingPolarityAllies = allies;
    frame.pairingPolarityVisible = t >= spec.revealAt && t < spec.resetAt;
    frame.pairingPolaritySuccess =
      t >= spec.resolveAt && t < spec.resetAt && result.resolution === 'paired';
    frame.pairingPolarityPairs = frame.pairingPolaritySuccess ? result.pairs : [];
    frame.pairingPolarityFailedDamage = spec.failedDamage;
    frame.pairingPolarityRetry = t >= spec.resetAt;
    frame.pairingPolarityAlliesMotion = motion({ stride });
    frame.playerMotion.stride = stride;
    frame.bossMotion.attack = strikePulse(t, spec.resolveAt, 0.52);
    frame.dangerActive = t >= spec.resolveAt && t < spec.resolveAt + spec.hitDuration;
  }
  if (spec.mode === 'party-split') {
    const work = smooth((t - spec.move[0]) / (spec.move[1] - spec.move[0]));
    const reunite = smooth((t - spec.reunite[0]) / (spec.reunite[1] - spec.reunite[0]));
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    const allies = spec.allies.map(([x, y], index) => ({
      x: mix(
        mix(mix(x, spec.workSpots[index + 1][0], work), spec.reunionSpots[index + 1][0], reunite),
        x,
        reset,
      ),
      y: mix(
        mix(mix(y, spec.workSpots[index + 1][1], work), spec.reunionSpots[index + 1][1], reunite),
        y,
        reset,
      ),
    }));
    const result = partySplitResolve({
      encounterId: spec.encounterId,
      now: t,
      deadline: spec.deadline,
      tasks: {
        left: { completedAt: spec.taskCompleteAt[0] },
        right: { completedAt: spec.taskCompleteAt[1] },
      },
    });
    frame.partySplitState = partySplitState(t);
    frame.partySplitAllies = allies;
    frame.partySplitPositions = [player, ...allies];
    frame.partySplitCompletedSides = t < spec.resetAt ? result.completedSides : [];
    frame.partySplitProgress = spec.taskCompleteAt.map((doneAt) =>
      t >= spec.resetAt ? 0 : smooth((t - spec.move[1]) / (doneAt - spec.move[1])),
    );
    frame.partySplitGateOpen = t >= spec.gateOpenAt && t < spec.resetAt && result.gateOpen;
    frame.partySplitReunited = t >= spec.reunite[1] && t < spec.resetAt;
    frame.partySplitRetry = t >= spec.resetAt;
    frame.partySplitAlliesMotion = motion({ stride });
    frame.playerMotion.stride = stride;
    frame.bossMotion.attack = strikePulse(t, spec.gateOpenAt, 0.5);
    frame.dangerActive = t >= spec.gateOpenAt && t < spec.reunite[0];
  }
  if (spec.mode === 'real-time-progression') {
    frame.realTimeProgressionState = realTimeProgressionState(t);
    frame.realTimeProgressionCheckpointId = spec.checkpointId;
    frame.realTimeProgressionReconciliationId = spec.reconciliationId;
    frame.realTimeProgressionAuthority = spec.authority;
    frame.realTimeProgressionSavedHour = spec.savedHour;
    frame.realTimeProgressionCurrentHour = spec.currentHour;
    frame.realTimeProgressionElapsedHours = spec.elapsedHours;
    frame.realTimeProgressionAppliedHours = spec.appliedHours;
    frame.realTimeProgressionCapped = true;
    frame.realTimeProgressionClosed = t >= spec.closed[0] && t < spec.closed[1];
    frame.realTimeProgressionReconciled = t >= spec.reconcile[0] && t < spec.resetAt;
    frame.realTimeProgressionEventCount = frame.realTimeProgressionReconciled ? 1 : 0;
    frame.realTimeProgressionLiveTicks = 0;
    frame.realTimeProgressionClockRollback = false;
    frame.realTimeProgressionBossTier = frame.realTimeProgressionReconciled ? 2 : 1;
    frame.realTimeProgressionOfflineHazardCount = frame.realTimeProgressionReconciled ? 2 : 0;
    frame.realTimeProgressionAttackActive = t >= spec.attack[0] && t < spec.attack[1];
    frame.realTimeProgressionRetryStable = t >= spec.retry[0] && t < spec.retry[1];
    frame.realTimeProgressionProgressionUnchanged = frame.realTimeProgressionRetryStable;
    frame.dangerActive = frame.realTimeProgressionAttackActive;
    frame.playerMotion.dodge = strikePulse(t, spec.playerMove[0] + 0.3, 0.5);
    frame.playerMotion.attack = 0;
    frame.playerMotion.impact = 0;
    frame.bossMotion.attack = strikePulse(t, (spec.attack[0] + spec.attack[1]) / 2, 0.58);
  }
  if (spec.mode === 'ability-lock') {
    frame.abilityLockState = abilityLockState(t);
    frame.abilityLockFirstAvoided = t >= spec.firstResolveAt && t < spec.secondTelegraph[0];
    frame.abilityLockHealLocked = t >= spec.hitAt && t < spec.lockEndsAt;
    frame.abilityLockMovementAvailable = true;
    frame.abilityLockAttackAvailable = true;
    frame.abilityLockInputAttempts =
      t >= spec.firstHeal[0]
        ? 1 + (t >= spec.rejectedHeal[0] ? 1 : 0) + (t >= spec.restoredHeal[0] ? 1 : 0)
        : 0;
    frame.abilityLockRejectedInputs = t >= spec.rejectedHeal[0] && t < spec.resetAt ? 1 : 0;
    frame.abilityLockHealSuccessCount =
      (t >= spec.firstHeal[1] ? 1 : 0) + (t >= spec.restoredHeal[1] && t < spec.resetAt ? 1 : 0);
    frame.abilityLockCurrentHealth = abilityLockHealthAt(spec, t);
    frame.abilityLockHealRequested =
      (t >= spec.firstHeal[0] && t < spec.firstHeal[1]) ||
      (t >= spec.rejectedHeal[0] && t < spec.rejectedHeal[1]) ||
      (t >= spec.restoredHeal[0] && t < spec.restoredHeal[1])
        ? spec.healAmount
        : 0;
    frame.abilityLockHealApplied =
      frame.abilityLockHealRequested > 0 && !frame.abilityLockHealLocked ? spec.healAmount : 0;
    frame.abilityLockSecondsRemaining = frame.abilityLockHealLocked
      ? Math.max(0, spec.lockEndsAt - t)
      : 0;
    frame.abilityLockStatusId = frame.abilityLockHealLocked ? 'healing-lock-1' : 'none';
    frame.dangerActive = t >= spec.hitWindow[0] && t < spec.hitWindow[1];
    frame.playerMotion.attack = strikePulse(t, (spec.swordProof[0] + spec.swordProof[1]) / 2, 0.42);
    frame.playerMotion.dodge = strikePulse(t, spec.firstResolveAt, 0.42);
    frame.playerMotion.impact = strikePulse(t, spec.hitAt, 0.44);
    frame.bossMotion.attack = Math.max(
      strikePulse(t, spec.firstResolveAt, 0.36),
      strikePulse(t, spec.hitAt, 0.42),
    );
  }
  if (spec.mode === 'sound-detection') {
    frame.soundDetectionState = soundDetectionState(t);
    frame.soundDetectionHeard = t >= spec.heardAt && t < spec.resetAt;
    frame.soundDetectionNoiseVisible = t >= spec.noiseAt && t < spec.investigate[1];
    frame.soundDetectionWaveProgress = clamp(
      (t - spec.noiseAt) / (spec.investigate[1] - spec.noiseAt),
    );
    frame.soundDetectionSourceLocked = t >= spec.lockAt && t < spec.searchEndsAt;
    frame.soundDetectionAttackActive = dangerActive;
    frame.soundDetectionQuietMove =
      (t >= spec.quietAt && t < spec.noiseAt) || (t >= spec.heardAt && t < spec.lockAt);
    frame.soundDetectionQuietNoise = frame.soundDetectionQuietMove ? 0.18 + 0.08 * pulse(t * 3) : 0;
    frame.soundDetectionNoiseLevel =
      t >= spec.noiseAt && t < spec.heardAt
        ? 1
        : frame.soundDetectionQuietMove
          ? frame.soundDetectionQuietNoise
          : 0.06;
    frame.soundDetectionLastKnownPoint = point(spec.soundPoint);
    frame.soundDetectionBossHasLivePlayerPosition = false;
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'secondary-cues-invisibility') {
    frame.secondaryCuesInvisibilityState = secondaryCuesInvisibilityState(t);
    frame.invisibilityHidden = t >= spec.hiddenAt && t < spec.revealAt;
    frame.invisibilitySourceLocked = t >= spec.lockAt && t < spec.attack[1];
    frame.invisibilityAttackActive = dangerActive;
    frame.invisibilityRevealVisible = t >= spec.attack[1] && t < spec.punishAt;
    frame.invisibilityRevealProgress = smooth(
      (t - spec.attack[1]) / (spec.revealAt - spec.attack[1]),
    );
    frame.invisibilityCueIndex = spec.clues.reduce(
      (latest, clue, index) => (t >= clue.at ? index : latest),
      -1,
    );
    frame.invisibilityCuePoint =
      frame.invisibilityCueIndex >= 0
        ? point(spec.clues[frame.invisibilityCueIndex].point)
        : point(spec.boss);
    frame.invisibilityCuePulse =
      frame.invisibilityCueIndex >= 0
        ? clamp((t - spec.clues[frame.invisibilityCueIndex].at) / Math.max(0.01, spec.cueLifetime))
        : 0;
    frame.invisibilityCueOpacities = spec.clues.map(({ at }) => {
      const age = t - at;
      return age < 0 || age > spec.cueLifetime ? 0 : mix(0.92, 0.16, age / spec.cueLifetime);
    });
    frame.invisibilityCueCount = spec.clues.filter(({ at }) => t >= at).length;
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'forced-inertia') {
    frame.forcedInertiaState = forcedInertiaState(t);
    frame.forcedInertiaFrostProgress = smooth((t - spec.frostAt) / (spec.vectorAt - spec.frostAt));
    frame.forcedInertiaFrozen = t >= spec.frostAt && t < spec.resetAt;
    frame.forcedInertiaVectorVisible = t >= spec.vectorAt && t < spec.resetAt;
    frame.forcedInertiaCommitted = t >= spec.commitAt && t < spec.brake[1];
    frame.forcedInertiaSliding = t >= spec.slide[0] && t < spec.slide[1];
    frame.forcedInertiaBraking = t >= spec.brake[0] && t < spec.brake[1];
    frame.forcedInertiaControlRestored = t >= spec.brake[1] && t < spec.resetAt;
    frame.forcedInertiaSpeed = frame.forcedInertiaSliding
      ? 1
      : frame.forcedInertiaBraking
        ? 1 - smooth((t - spec.brake[0]) / (spec.brake[1] - spec.brake[0]))
        : 0;
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'wraparound-projectile') {
    frame.wraparoundProjectileState = wraparoundProjectileState(t);
    frame.wraparoundBoundaryLinked = t >= spec.signalAt && t < spec.resetAt;
    frame.wraparoundRouteVisible = t >= spec.previewAt && t < spec.resetAt;
    frame.wraparoundFirstPass = t >= spec.firstPass[0] && t < spec.firstPass[1];
    frame.wraparoundCrossing = t >= spec.crossing[0] && t < spec.crossing[1];
    frame.wraparoundSecondPass = t >= spec.secondPass[0] && t < spec.secondPass[1];
    frame.wraparoundLap = frame.wraparoundSecondPass
      ? 2
      : frame.wraparoundFirstPass || frame.wraparoundCrossing
        ? 1
        : 0;
    frame.wraparoundSignalProgress = smooth((t - spec.signalAt) / (spec.previewAt - spec.signalAt));
    const firstProgress = clamp((t - spec.firstPass[0]) / (spec.firstPass[1] - spec.firstPass[0]));
    const crossingProgress = clamp((t - spec.crossing[0]) / (spec.crossing[1] - spec.crossing[0]));
    const secondProgress = clamp(
      (t - spec.secondPass[0]) / (spec.secondPass[1] - spec.secondPass[0]),
    );
    frame.wraparoundProjectilePoint = frame.wraparoundFirstPass
      ? { x: mix(spec.boss[0] + 48, spec.rightBoundary + 18, firstProgress), y: spec.laneY }
      : frame.wraparoundCrossing
        ? {
            x: crossingProgress < 0.5 ? spec.rightBoundary + 18 : spec.leftBoundary - 18,
            y: spec.laneY,
          }
        : frame.wraparoundSecondPass
          ? {
              x: mix(spec.leftBoundary - 18, spec.rightBoundary + 18, secondProgress),
              y: spec.laneY,
            }
          : { x: spec.boss[0] + 48, y: spec.laneY };
    frame.wraparoundProjectilePoints = frame.wraparoundCrossing
      ? [
          { x: spec.rightBoundary + 10, y: spec.laneY },
          { x: spec.leftBoundary - 10, y: spec.laneY },
        ]
      : dangerActive
        ? [frame.wraparoundProjectilePoint]
        : [];
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'beat-synced-attack') {
    frame.beatSyncedAttackState = beatSyncedAttackState(t);
    const beatPosition = (t - spec.beatOrigin) / spec.beatInterval;
    const beatNumber = Math.max(0, Math.floor(beatPosition + 0.001));
    frame.beatSyncedBeatSlot = ((beatNumber % 4) + 4) % 4;
    frame.beatSyncedBeatPulse =
      t < spec.beatOrigin ? 0 : clamp(1 - Math.abs(beatPosition - Math.round(beatPosition)) / 0.24);
    frame.beatSyncedAttackIndex = spec.hits.findIndex(
      (hit) => Math.abs(t - hit) <= spec.attackDuration / 2,
    );
    frame.beatSyncedTelegraphIndex = spec.hits.findIndex(
      (hit) => t >= hit - spec.telegraphLead && t < hit - spec.attackDuration / 2,
    );
    frame.beatSyncedAttackLane =
      frame.beatSyncedAttackIndex >= 0 ? spec.pattern[frame.beatSyncedAttackIndex] : -1;
    frame.beatSyncedTelegraphLane =
      frame.beatSyncedTelegraphIndex >= 0 ? spec.pattern[frame.beatSyncedTelegraphIndex] : -1;
    frame.beatSyncedCompletedHits = spec.hits.filter(
      (hit) => t > hit + spec.attackDuration / 2,
    ).length;
    frame.beatSyncedPhraseComplete = t >= spec.phraseClearsAt;
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'control-mode-shift') {
    frame.controlModeShiftState = controlModeShiftState(t);
    frame.controlModePreviewed = t >= spec.previewAt;
    frame.controlModeActive = t >= spec.handoff[1] && t < spec.resetAt;
    frame.controlModeMapping = frame.controlModeActive ? 'horizontal-and-jump' : 'free-movement';
    frame.controlModeWaveActive = dangerActive;
    frame.controlModeReturnVisible = t >= spec.resetAt;
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'boss-as-terrain') {
    frame.bossAsTerrainState = bossAsTerrainState(t);
    frame.bossAsTerrainRouteRevealed = t >= spec.revealAt && t < spec.resetAt;
    frame.bossAsTerrainMounted = t >= spec.mountAt && t < spec.drop[1];
    frame.bossAsTerrainHolding = t >= spec.shake[0] && t < spec.shake[1];
    frame.bossAsTerrainGrip = frame.bossAsTerrainHolding
      ? mix(0.9, 0.58, (t - spec.shake[0]) / (spec.shake[1] - spec.shake[0]))
      : frame.bossAsTerrainMounted
        ? 0.9
        : 1;
    frame.bossAsTerrainWeakPointOpen = t >= spec.weakPointOpensAt && t < spec.drop[0];
    frame.bossAsTerrainSafeDrop = t >= spec.drop[0] && t < spec.resetAt;
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'cover-line-of-sight') {
    frame.coverLineOfSightState = coverLineOfSightState(t);
    frame.coverSourceLocked = t >= spec.lockAt && t < spec.resetAt;
    frame.coverShadowVisible = t >= spec.shadowAt && t < spec.resetAt;
    frame.coverOccupied = coverLineOfSightBlocked(t, player);
    frame.coverBeamActive = dangerActive;
    frame.coverBeamBlocked = dangerActive && frame.coverOccupied;
    frame.coverExitOpen = t >= spec.beam[1] && t < spec.resetAt;
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'relocated-arena') {
    frame.relocatedArenaState = relocatedArenaState(t);
    frame.relocatedDestinationRevealed = t >= spec.previewAt;
    frame.relocatedTransferActive = t >= spec.transfer[0] && t < spec.transfer[1];
    frame.relocatedLowerActive = t >= spec.transfer[1] && t < spec.resetAt;
    frame.relocatedStateRetained = true;
    frame.relocatedProgress = 0.62;
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'forced-scrolling') {
    frame.forcedScrollingState = forcedScrollingState(t);
    frame.forcedScrollingActive = dangerActive;
    frame.forcedScrollingOffset = forcedScrollingOffset(t);
    frame.forcedScrollingRouteCleared = t >= spec.active[1] && t < spec.resetAt;
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'chase-herding') {
    frame.chaseHerdingState = chaseHerdingState(t);
    frame.chaseDistance = Math.hypot(player.x - boss.x, player.y - boss.y);
    frame.chaseInBand =
      frame.chaseDistance >= spec.distanceBand[0] && frame.chaseDistance <= spec.distanceBand[1];
    frame.chaseIntercepted = t >= 2.55 && t < spec.resetAt;
    frame.chaseCaptured = t >= spec.active[1] && t < spec.resetAt;
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'escape-phase') {
    frame.escapePhaseState = escapePhaseState(t);
    const escaped = smooth((t - spec.escape[0]) / (spec.escape[1] - spec.escape[0]));
    const reset = smooth((t - spec.resetAt) / (BLUEPRINT_DURATION - spec.resetAt));
    frame.escapeProgress = 0.72 * escaped * (1 - reset);
    frame.escapeActive = t >= spec.escape[0] && t < spec.escape[1];
    frame.escapeInterrupted = t >= spec.escape[1] && t < spec.resetAt;
    frame.escapeSucceeded = false;
    frame.escapeInterruptStrike = strikePulse(t, spec.escape[1], 0.38) > 0.5;
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'boundary-attack') {
    frame.boundaryAttackState = boundaryAttackState(t);
    frame.boundarySignalActive = t >= spec.signal[0] && t < spec.active[0];
    frame.boundaryCrossingActive = dangerActive;
    frame.boundarySourceOutside =
      t < spec.active[0] || t >= spec.openingEnd || boss.x < spec.leftBoundary;
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'teleport') {
    frame.teleportState = teleportState(t);
    frame.teleportAbsent =
      (t >= spec.absent[0] && t < spec.arrival[0]) ||
      (t >= spec.resetAbsent[0] && t < spec.resetArrival[0]);
    frame.teleportDestinationRevealed = t >= spec.destinationPreview[0] && t < spec.recoveryEnd;
    frame.teleportFollowUpActive = dangerActive;
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'recovery') {
    frame.recoveryState = recoveryState(t);
    frame.recoveryLocked = t >= spec.recovery[0] && t < spec.recovery[1];
    frame.bossReady = t >= spec.recovery[1];
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
    frame.withinPunishReach =
      Math.hypot(player.x - boss.x, player.y - boss.y) <=
      spec.punishReach + BLUEPRINT_PLAYER_RADIUS;
  }
  if (spec.mode === 'survival-phase') {
    frame.survivalPhaseState = survivalPhaseState(t);
    frame.survivalShielded = t >= spec.survival[0] && t < spec.shieldDropsAt;
    frame.survivalComplete = t >= spec.shieldDropsAt;
    frame.survivalHazardIndex = spec.hazards.findIndex(
      ({ active }) => t >= active[0] && t < active[1],
    );
    frame.survivalRemaining = clamp(
      1 - (t - spec.survival[0]) / (spec.shieldDropsAt - spec.survival[0]),
    );
    frame.punishStrike = strikePulse(t, spec.punishAt, 0.38) > 0.5;
  }
  if (spec.mode === 'arc') {
    const angle =
      phase === 0
        ? mix(WIDE_SWING_FROM + 0.2, WIDE_SWING_FROM, prepare)
        : phase === 1
          ? mix(WIDE_SWING_FROM, WIDE_SWING_TO, action)
          : mix(WIDE_SWING_TO, WIDE_SWING_FROM, recover);
    frame.wideSwingWeapon = sweepWeaponPose((angle * 180) / Math.PI, frame.bossMotion);
  }
  if (spec.mode === 'knockback') {
    const release = strikePulse(t, spec.hitAt, 0.7);
    const stagger = pulse(smooth((t - spec.hitAt) / 1.12));
    frame.bossMotion.attack = Math.max(t < spec.hitAt ? prepare * 0.36 : 0, release);
    frame.bossMotion.lean =
      -0.24 * prepare * (1 - smooth((t - (spec.hitAt - 0.3)) / 0.3)) + release * 0.38;
    frame.bossMotion.impact = 0;
    frame.playerMotion.impact = strikePulse(t, spec.hitAt, 0.5);
    frame.playerMotion.lean = stagger * 0.45;
    if (t >= spec.hitAt && t < spec.hitAt + 0.95) frame.playerMotion.stride = stagger * 0.3;
  }
  const decorativeIndices = DECORATIVE_PRIMITIVE_INDICES[id] ?? [];
  frame.primitives = primitivesFor(spec, frame).map((primitive, index) =>
    decorativeIndices.includes(index) ? { ...primitive, opacity: 0 } : primitive,
  );
  frame.playerSafe = pointClearsThreat(spec, frame, player);
  frame.bossLabel = {
    x: boss.x,
    y: boss.y + BLUEPRINT_BOSS_LABEL_OFFSET_Y * frame.bossScale - (frame.bossMotion.altitude ?? 0),
  };
  frame.playerLabel = {
    x:
      spec.mode === 'party-size-scaling'
        ? player.x - 85
        : spec.mode === 'proximity-damage'
          ? player.x + 85
          : player.x,
    y:
      player.y +
      (spec.mode === 'proximity-damage'
        ? 15
        : spec.mode === 'party-size-scaling'
          ? 10
          : spec.mode === 'resource-steal' ||
              spec.mode === 'ability-lock' ||
              spec.mode === 'maximum-health-reduction' ||
              spec.mode === 'instant-kill' ||
              spec.mode === 'status-buildup' ||
              spec.mode === 'persistent-progress' ||
              spec.mode === 'pacifist-resolution' ||
              spec.mode === 'posture-stagger-gauge' ||
              spec.mode === 'baited-self-hit' ||
              spec.mode === 'projectile-rally'
            ? 55
            : spec.mode === 'weak-point' ||
                spec.mode === 'directional-shield' ||
                spec.mode === 'damage-type-resistance' ||
                spec.mode === 'situational-immunity' ||
                spec.mode === 'part-break' ||
                spec.mode === 'attack-reflection' ||
                spec.mode === 'counter-stance' ||
                spec.mode === 'absorption-power-up' ||
                spec.mode === 'interruptible-wind-up' ||
                spec.mode === 'loadout-adaptation' ||
                spec.mode === 'wind-up' ||
                spec.mode === 'attack-lock' ||
                spec.mode === 'active-phase' ||
                spec.mode === 'recovery' ||
                spec.mode === 'survival-phase' ||
                spec.mode === 'teleport' ||
                spec.mode === 'boundary-attack' ||
                spec.mode === 'forced-scrolling' ||
                spec.mode === 'chase-herding' ||
                spec.mode === 'escape-phase' ||
                spec.mode === 'boss-as-terrain' ||
                spec.mode === 'cover-line-of-sight' ||
                spec.mode === 'forced-inertia' ||
                spec.mode === 'wraparound-projectile' ||
                spec.mode === 'beat-synced-attack' ||
                spec.mode === 'secondary-cues-invisibility' ||
                spec.mode === 'sound-detection' ||
                spec.mode === 'objective-linked-invulnerability' ||
                spec.mode === 'wave-clear-objective' ||
                spec.mode === 'environmental-weapon' ||
                spec.mode === 'encounter-specific-tool' ||
                spec.mode === 'player-controlled-boss' ||
                spec.mode === 'projectile-rally' ||
                spec.mode === 'baited-self-hit' ||
                spec.mode === 'posture-stagger-gauge' ||
                spec.mode === 'pacifist-resolution' ||
                spec.mode === 'persistent-progress' ||
                spec.mode === 'status-buildup' ||
                spec.mode === 'instant-kill' ||
                spec.mode === 'maximum-health-reduction' ||
                spec.mode === 'ability-lock' ||
                spec.mode === 'on-hit-healing' ||
                spec.mode === 'self-heal-cast' ||
                spec.mode === 'external-healing-source' ||
                spec.mode === 'damage-rate-cap' ||
                spec.mode === 'loadout-mirror' ||
                spec.mode === 'moveset-shapeshifting' ||
                spec.mode === 'ally-theft' ||
                spec.mode === 'false-death' ||
                spec.mode === 'action-reactive-punish' ||
                spec.mode === 'run-history-manifestation' ||
                spec.mode === 'real-time-progression' ||
                spec.mode === 'interface-interaction' ||
                spec.mode === 'world-state-variant' ||
                spec.mode === 'party-size-scaling' ||
                spec.mode === 'partner-revival' ||
                spec.mode === 'kill-order-inheritance' ||
                spec.mode === 'shared-group-health' ||
                spec.mode === 'coordinated-duo-attack' ||
                spec.mode === 'stack-damage' ||
                spec.mode === 'personal-spread' ||
                spec.mode === 'tower-soak' ||
                spec.mode === 'entity-tether' ||
                spec.mode === 'gaze-check' ||
                spec.mode === 'debuff-handoff' ||
                spec.mode === 'ordered-targets' ||
                spec.mode === 'pairing-polarity' ||
                spec.mode === 'party-split'
              ? 92
              : -62),
  };
  if (spec.mode === 'party-split' && t >= spec.reunite[0] && t < spec.resetAt)
    frame.playerLabel.y = player.y - 95;
  return Object.freeze(frame);
}

export function blueprintPointSafe(id, time, value, radius = BLUEPRINT_PLAYER_RADIUS) {
  const frame = blueprintFrame(id, time);
  return pointClearsThreat(blueprintSpec(id), frame, value, radius);
}
