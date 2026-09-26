import { BLUEPRINT_DURATION, blueprintFrame } from './blueprint-model.mjs';
import { createCharacterAnimator } from './character-motion.mjs';
import { createEncounterEffects } from './encounter-effects.mjs';
import { createSweepWeaponAnimator } from './sweep-weapon-player.mjs';

const set = (node, name, value) => node.setAttribute(name, String(value));

function updatePrimitive(group, primitive) {
  const node = group.firstElementChild;
  node.setAttribute('class', `blueprint-tone--${primitive.tone}`);
  set(node, 'opacity', primitive.opacity);
  set(node, 'stroke-width', primitive.width);
  if (primitive.dash) set(node, 'stroke-dasharray', primitive.dash);
  else node.removeAttribute('stroke-dasharray');
  node.setAttribute('fill', primitive.fill ? 'currentColor' : 'none');
  if (primitive.fill) set(node, 'fill-opacity', primitive.fill);
  else node.removeAttribute('fill-opacity');
  if (primitive.type === 'circle') {
    set(node, 'cx', primitive.x);
    set(node, 'cy', primitive.y);
    set(node, 'r', primitive.radius);
  } else if (primitive.type === 'line') {
    set(node, 'x1', primitive.x1);
    set(node, 'y1', primitive.y1);
    set(node, 'x2', primitive.x2);
    set(node, 'y2', primitive.y2);
  } else if (primitive.type === 'rect') {
    set(node, 'x', primitive.x);
    set(node, 'y', primitive.y);
    set(node, 'width', primitive.rectWidth);
    set(node, 'height', primitive.rectHeight);
  } else set(node, 'd', primitive.data);
}

export function initializeBlueprint(widget) {
  if (widget.dataset.blueprintReady) return;
  const find = (selector) => widget.querySelector(selector);
  const config = JSON.parse(find('[data-blueprint-config]').textContent);
  const mechanicId = widget.dataset.blueprintId;
  const timeline = find('[data-blueprint-timeline]');
  const currentPhase = find('[data-blueprint-current-phase]');
  const phaseName = find('[data-blueprint-phase-name]');
  const phaseTooltip = find('[data-blueprint-phase-tooltip]');
  const boss = find('[data-blueprint-boss]');
  const decoy = find('[data-blueprint-decoy]');
  const player = find('[data-blueprint-player]');
  const playerWeapon = player.querySelector('[data-rig-part="weapon"]');
  const animateBoss = createCharacterAnimator(boss, 'kern');
  const animateWideSwingWeapon = createSweepWeaponAnimator(boss);
  const animateDecoy = decoy ? createCharacterAnimator(decoy, 'kern') : null;
  const animatePlayer = createCharacterAnimator(player, 'tavi');
  const allies = [...widget.querySelectorAll('[data-blueprint-ally]')];
  const animateAllies = allies.map((ally) => createCharacterAnimator(ally, 'tavi'));
  const animateEffects = createEncounterEffects(widget, (time) => blueprintFrame(mechanicId, time));
  const bossLabel = find('[data-blueprint-boss-label]');
  const groupHealthLabel = find('[data-blueprint-group-health-label]');
  const stackReadout = find('[data-blueprint-stack-readout]');
  const stackHealthLabels = [...widget.querySelectorAll('[data-blueprint-stack-health]')];
  const spreadReadout = find('[data-blueprint-spread-readout]');
  const spreadHealthLabels = [...widget.querySelectorAll('[data-blueprint-spread-health]')];
  const towerReadout = find('[data-blueprint-tower-readout]');
  const towerHealthLabels = [...widget.querySelectorAll('[data-blueprint-tower-health]')];
  const tetherReadout = find('[data-blueprint-tether-readout]');
  const tetherHealthLabels = [...widget.querySelectorAll('[data-blueprint-tether-health]')];
  const gazeHealthLabel = find('[data-blueprint-gaze-health]');
  const gazeFacingLabel = find('[data-blueprint-gaze-facing]');
  const proximityHealthLabel = find('[data-blueprint-proximity-health]');
  const proximityReadout = find('[data-blueprint-proximity-readout]');
  const tankHealthLabels = [...widget.querySelectorAll('[data-blueprint-tank-health]')];
  const handoffTimer = find('[data-blueprint-handoff-timer]');
  const orderNext = find('[data-blueprint-order-next]');
  const orderMarks = [...widget.querySelectorAll('[data-blueprint-order-mark]')];
  const polarityMarks = [...widget.querySelectorAll('[data-blueprint-polarity-mark]')];
  const partnerLabel = find('[data-blueprint-partner-label]');
  const playerLabel = find('[data-blueprint-player-label]');
  const primitives = [...widget.querySelectorAll('[data-blueprint-primitive]')];
  const status = find('[data-blueprint-status]');
  const motionNote = find('[data-blueprint-motion-note]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let time = 0;
  let running = false;
  let animationId = 0;
  let lastTimestamp;
  let announcedPhase = -1;
  let scrubbing = false;
  let phaseHovered = false;

  function render() {
    const frame = blueprintFrame(mechanicId, time);
    widget.dataset.blueprintPhase = String(frame.phase);
    widget.dataset.blueprintCommitted = String(frame.committed);
    widget.dataset.blueprintOutcome = frame.playerSafe ? 'safe' : 'danger';
    if (mechanicId === 'directional-shield')
      widget.dataset.blueprintGuard = frame.frontStrike
        ? 'blocked'
        : frame.sideStrike
          ? 'flank-hit'
          : 'idle';
    if (mechanicId === 'damage-type-resistance')
      widget.dataset.blueprintResistance = frame.resistedStrike
        ? 'reduced'
        : frame.normalStrike
          ? 'normal'
          : 'idle';
    if (mechanicId === 'situational-immunity')
      widget.dataset.blueprintImmunity = frame.blockedStrike
        ? 'blocked'
        : frame.wardStrike
          ? 'ward-broken'
          : frame.openStrike
            ? 'boss-hit'
            : frame.immunity;
    if (mechanicId === 'part-break')
      widget.dataset.blueprintPart = frame.partStrike
        ? 'broken-now'
        : frame.secondAttempt
          ? 'attack-disabled'
          : frame.partState;
    if (mechanicId === 'attack-reflection')
      widget.dataset.blueprintReflection = frame.meleeStrike
        ? 'open-hit'
        : frame.reflectedShot
          ? 'returning-danger'
          : frame.outgoingShot
            ? 'player-shot'
            : frame.reflectionState;
    if (mechanicId === 'counter-stance')
      widget.dataset.blueprintCounter = frame.parriedStrike
        ? 'parried-hit'
        : frame.riposte
          ? 'riposte-danger'
          : frame.openStrike
            ? 'open-hit'
            : frame.counterState;
    if (mechanicId === 'absorption-power-up') {
      widget.dataset.blueprintAbsorption = frame.openStrike
        ? 'open-hit'
        : frame.absorbedSecond
          ? 'second-absorbed'
          : frame.absorbedFirst
            ? 'first-absorbed'
            : frame.absorptionState;
      widget.dataset.blueprintCharge = String(frame.absorptionCharge);
    }
    if (mechanicId === 'interruptible-wind-up')
      widget.dataset.blueprintWindUp = frame.interruptHit
        ? 'interrupted-now'
        : frame.threatReleased
          ? 'released-danger'
          : frame.windUpState;
    if (mechanicId === 'loadout-adaptation') {
      widget.dataset.blueprintLoadout = frame.loadout;
      widget.dataset.blueprintAdaptation = frame.loadoutState;
      widget.dataset.blueprintPackage = frame.adaptedPackage;
    }
    if (mechanicId === 'wind-up') {
      widget.dataset.blueprintWindUp = frame.windUpRelease ? 'released-danger' : frame.windUpState;
      widget.dataset.blueprintWindUpBeat = String(frame.windUpBeat);
      widget.dataset.blueprintWindUpProgress = frame.windUpProgress.toFixed(3);
    }
    if (mechanicId === 'attack-lock') {
      widget.dataset.blueprintAttackLock = frame.attackLockRelease
        ? 'released-danger'
        : frame.attackLockState;
      widget.dataset.blueprintAimLocked = String(frame.attackLocked);
      widget.dataset.blueprintAimX = frame.attackLockTarget.x.toFixed(1);
      widget.dataset.blueprintAimY = frame.attackLockTarget.y.toFixed(1);
    }
    if (mechanicId === 'active-phase') {
      widget.dataset.blueprintActivePhase = frame.activePhaseState;
      widget.dataset.blueprintHitboxActive = String(frame.hitboxActive);
      widget.dataset.blueprintFollowThrough = String(frame.followThroughVisible);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'recovery') {
      widget.dataset.blueprintRecovery = frame.recoveryState;
      widget.dataset.blueprintRecoveryLocked = String(frame.recoveryLocked);
      widget.dataset.blueprintBossReady = String(frame.bossReady);
      widget.dataset.blueprintWithinPunishReach = String(frame.withinPunishReach);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'survival-phase') {
      widget.dataset.blueprintSurvivalPhase = frame.survivalPhaseState;
      widget.dataset.blueprintSurvivalShielded = String(frame.survivalShielded);
      widget.dataset.blueprintSurvivalComplete = String(frame.survivalComplete);
      widget.dataset.blueprintSurvivalHazard = String(frame.survivalHazardIndex);
      widget.dataset.blueprintSurvivalRemaining = frame.survivalRemaining.toFixed(3);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'teleport') {
      widget.dataset.blueprintTeleport = frame.teleportState;
      widget.dataset.blueprintTeleportAbsent = String(frame.teleportAbsent);
      widget.dataset.blueprintTeleportDestination = String(frame.teleportDestinationRevealed);
      widget.dataset.blueprintTeleportFollowUp = String(frame.teleportFollowUpActive);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'boundary-attack') {
      widget.dataset.blueprintBoundaryAttack = frame.boundaryAttackState;
      widget.dataset.blueprintBoundarySignal = String(frame.boundarySignalActive);
      widget.dataset.blueprintBoundaryCrossing = String(frame.boundaryCrossingActive);
      widget.dataset.blueprintBoundarySourceOutside = String(frame.boundarySourceOutside);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'forced-scrolling') {
      widget.dataset.blueprintForcedScrolling = frame.forcedScrollingState;
      widget.dataset.blueprintForcedScrollingActive = String(frame.forcedScrollingActive);
      widget.dataset.blueprintForcedScrollingOffset = frame.forcedScrollingOffset.toFixed(1);
      widget.dataset.blueprintForcedScrollingCleared = String(frame.forcedScrollingRouteCleared);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'chase-herding') {
      widget.dataset.blueprintChaseHerding = frame.chaseHerdingState;
      widget.dataset.blueprintChaseDistance = frame.chaseDistance.toFixed(1);
      widget.dataset.blueprintChaseInBand = String(frame.chaseInBand);
      widget.dataset.blueprintChaseIntercepted = String(frame.chaseIntercepted);
      widget.dataset.blueprintChaseCaptured = String(frame.chaseCaptured);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'escape-phase') {
      widget.dataset.blueprintEscapePhase = frame.escapePhaseState;
      widget.dataset.blueprintEscapeProgress = frame.escapeProgress.toFixed(3);
      widget.dataset.blueprintEscapeActive = String(frame.escapeActive);
      widget.dataset.blueprintEscapeInterrupted = String(frame.escapeInterrupted);
      widget.dataset.blueprintEscapeSucceeded = String(frame.escapeSucceeded);
      widget.dataset.blueprintEscapeInterruptStrike = String(frame.escapeInterruptStrike);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'relocated-arena') {
      widget.dataset.blueprintRelocatedArena = frame.relocatedArenaState;
      widget.dataset.blueprintRelocationDestination = String(frame.relocatedDestinationRevealed);
      widget.dataset.blueprintRelocationActive = String(frame.relocatedTransferActive);
      widget.dataset.blueprintRelocationLowerActive = String(frame.relocatedLowerActive);
      widget.dataset.blueprintRelocationStateRetained = String(frame.relocatedStateRetained);
      widget.dataset.blueprintRelocationProgress = frame.relocatedProgress.toFixed(2);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'control-mode-shift') {
      widget.dataset.blueprintControlModeShift = frame.controlModeShiftState;
      widget.dataset.blueprintControlModePreviewed = String(frame.controlModePreviewed);
      widget.dataset.blueprintControlModeActive = String(frame.controlModeActive);
      widget.dataset.blueprintControlModeMapping = frame.controlModeMapping;
      widget.dataset.blueprintControlModeWave = String(frame.controlModeWaveActive);
      widget.dataset.blueprintControlModeReturn = String(frame.controlModeReturnVisible);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'boss-as-terrain') {
      widget.dataset.blueprintBossAsTerrain = frame.bossAsTerrainState;
      widget.dataset.blueprintTerrainRoute = String(frame.bossAsTerrainRouteRevealed);
      widget.dataset.blueprintTerrainMounted = String(frame.bossAsTerrainMounted);
      widget.dataset.blueprintTerrainHolding = String(frame.bossAsTerrainHolding);
      widget.dataset.blueprintTerrainGrip = frame.bossAsTerrainGrip.toFixed(3);
      widget.dataset.blueprintTerrainWeakPoint = String(frame.bossAsTerrainWeakPointOpen);
      widget.dataset.blueprintTerrainSafeDrop = String(frame.bossAsTerrainSafeDrop);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'cover-line-of-sight') {
      widget.dataset.blueprintCoverLineOfSight = frame.coverLineOfSightState;
      widget.dataset.blueprintCoverSourceLocked = String(frame.coverSourceLocked);
      widget.dataset.blueprintCoverShadow = String(frame.coverShadowVisible);
      widget.dataset.blueprintCoverOccupied = String(frame.coverOccupied);
      widget.dataset.blueprintCoverBeam = String(frame.coverBeamActive);
      widget.dataset.blueprintCoverBlocked = String(frame.coverBeamBlocked);
      widget.dataset.blueprintCoverExit = String(frame.coverExitOpen);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'forced-inertia') {
      widget.dataset.blueprintForcedInertia = frame.forcedInertiaState;
      widget.dataset.blueprintInertiaFrozen = String(frame.forcedInertiaFrozen);
      widget.dataset.blueprintInertiaVector = String(frame.forcedInertiaVectorVisible);
      widget.dataset.blueprintInertiaCommitted = String(frame.forcedInertiaCommitted);
      widget.dataset.blueprintInertiaSliding = String(frame.forcedInertiaSliding);
      widget.dataset.blueprintInertiaBraking = String(frame.forcedInertiaBraking);
      widget.dataset.blueprintInertiaControl = String(frame.forcedInertiaControlRestored);
      widget.dataset.blueprintInertiaSpeed = frame.forcedInertiaSpeed.toFixed(3);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'wraparound-projectile') {
      widget.dataset.blueprintWraparoundProjectile = frame.wraparoundProjectileState;
      widget.dataset.blueprintWrapBoundary = String(frame.wraparoundBoundaryLinked);
      widget.dataset.blueprintWrapRoute = String(frame.wraparoundRouteVisible);
      widget.dataset.blueprintWrapFirstPass = String(frame.wraparoundFirstPass);
      widget.dataset.blueprintWrapCrossing = String(frame.wraparoundCrossing);
      widget.dataset.blueprintWrapSecondPass = String(frame.wraparoundSecondPass);
      widget.dataset.blueprintWrapLap = String(frame.wraparoundLap);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'beat-synced-attack') {
      widget.dataset.blueprintBeatSyncedAttack = frame.beatSyncedAttackState;
      widget.dataset.blueprintBeatSlot = String(frame.beatSyncedBeatSlot + 1);
      widget.dataset.blueprintBeatPulse = frame.beatSyncedBeatPulse.toFixed(3);
      widget.dataset.blueprintBeatAttack = String(frame.beatSyncedAttackIndex + 1);
      widget.dataset.blueprintBeatAttackLane = String(frame.beatSyncedAttackLane);
      widget.dataset.blueprintBeatTelegraph = String(frame.beatSyncedTelegraphIndex + 1);
      widget.dataset.blueprintBeatTelegraphLane = String(frame.beatSyncedTelegraphLane);
      widget.dataset.blueprintBeatPhraseComplete = String(frame.beatSyncedPhraseComplete);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'secondary-cues-invisibility') {
      widget.dataset.blueprintSecondaryCuesInvisibility = frame.secondaryCuesInvisibilityState;
      widget.dataset.blueprintInvisibilityHidden = String(frame.invisibilityHidden);
      widget.dataset.blueprintInvisibilityCueCount = String(frame.invisibilityCueCount);
      widget.dataset.blueprintInvisibilitySourceLocked = String(frame.invisibilitySourceLocked);
      widget.dataset.blueprintInvisibilityAttack = String(frame.invisibilityAttackActive);
      widget.dataset.blueprintInvisibilityReveal = String(frame.invisibilityRevealVisible);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'sound-detection') {
      widget.dataset.blueprintSoundDetection = frame.soundDetectionState;
      widget.dataset.blueprintSoundHeard = String(frame.soundDetectionHeard);
      widget.dataset.blueprintSoundNoiseVisible = String(frame.soundDetectionNoiseVisible);
      widget.dataset.blueprintSoundSourceLocked = String(frame.soundDetectionSourceLocked);
      widget.dataset.blueprintSoundAttack = String(frame.soundDetectionAttackActive);
      widget.dataset.blueprintSoundLivePosition = String(
        frame.soundDetectionBossHasLivePlayerPosition,
      );
      widget.dataset.blueprintSoundNoiseLevel = frame.soundDetectionNoiseLevel.toFixed(3);
      widget.dataset.blueprintPunishStrike = String(frame.punishStrike);
    }
    if (mechanicId === 'objective-linked-invulnerability') {
      widget.dataset.blueprintObjectiveLinkedInvulnerability =
        frame.objectiveLinkedInvulnerabilityState;
      widget.dataset.blueprintObjectiveCount = String(frame.objectiveCompletedCount);
      widget.dataset.blueprintObjectiveShielded = String(frame.objectiveShielded);
      widget.dataset.blueprintObjectiveVulnerable = String(frame.objectiveVulnerable);
      widget.dataset.blueprintObjectiveBlocked = String(frame.objectiveBlockedStrike);
      widget.dataset.blueprintObjectiveBossHit = String(frame.objectiveBossStrike);
      widget.dataset.blueprintObjectiveAllComplete = String(frame.objectiveAllComplete);
      widget.dataset.blueprintObjectiveWindow = frame.objectiveWindowRemaining.toFixed(3);
    }
    if (mechanicId === 'wave-clear-objective') {
      widget.dataset.blueprintWaveClear = frame.waveClearState;
      widget.dataset.blueprintWave = String(frame.waveClearWave);
      widget.dataset.blueprintWavesComplete = String(frame.waveClearCompletedWaves);
      widget.dataset.blueprintWaveRemaining = String(frame.waveClearRemainingEnemies);
      widget.dataset.blueprintWaveQueueSealed = String(frame.waveClearSpawnQueueSealed);
      widget.dataset.blueprintWaveRosterEmpty = String(frame.waveClearRosterEmpty);
      widget.dataset.blueprintWaveAllComplete = String(frame.waveClearAllComplete);
      widget.dataset.blueprintWaveRewardOpen = String(frame.waveClearRewardOpen);
    }
    if (mechanicId === 'environmental-weapon') {
      widget.dataset.blueprintEnvironmentalWeapon = frame.environmentalWeaponState;
      widget.dataset.blueprintEnvironmentalPowered = String(frame.environmentalDevicePowered);
      widget.dataset.blueprintEnvironmentalReached = String(frame.environmentalDeviceReached);
      widget.dataset.blueprintEnvironmentalAimLocked = String(frame.environmentalAimLocked);
      widget.dataset.blueprintEnvironmentalFired = String(frame.environmentalDeviceFired);
      widget.dataset.blueprintEnvironmentalBossDamaged = String(frame.environmentalBossDamaged);
      widget.dataset.blueprintEnvironmentalSpent = String(frame.environmentalDeviceSpent);
      widget.dataset.blueprintEnvironmentalDamageSource = frame.environmentalDamageSource;
    }
    if (mechanicId === 'encounter-specific-tool') {
      widget.dataset.blueprintEncounterTool = frame.encounterSpecificToolState;
      widget.dataset.blueprintEncounterToolReached = String(frame.encounterToolReached);
      widget.dataset.blueprintEncounterToolEquipped = String(frame.encounterToolEquipped);
      widget.dataset.blueprintEncounterToolCombatReached = String(frame.encounterToolCombatReached);
      widget.dataset.blueprintEncounterToolCharging = String(frame.encounterToolCharging);
      widget.dataset.blueprintEncounterToolReady = String(frame.encounterToolReady);
      widget.dataset.blueprintEncounterToolFired = String(frame.encounterToolFired);
      widget.dataset.blueprintEncounterToolBossDamaged = String(frame.encounterToolBossDamaged);
      widget.dataset.blueprintEncounterToolExpired = String(frame.encounterToolExpired);
      widget.dataset.blueprintEncounterToolPackage = frame.encounterToolActionPackage;
      widget.dataset.blueprintEncounterToolDamageSource = frame.encounterToolDamageSource;
    }
    if (mechanicId === 'player-controlled-boss') {
      widget.dataset.blueprintPlayerControlledBoss = frame.playerControlledBossState;
      widget.dataset.blueprintPlayerBossCandidate = String(frame.playerBossCandidateFound);
      widget.dataset.blueprintPlayerBossAssigned = String(frame.playerBossAssigned);
      widget.dataset.blueprintPlayerBossController = frame.playerBossController;
      widget.dataset.blueprintPlayerBossCommand = String(frame.playerBossCommandAccepted);
      widget.dataset.blueprintPlayerBossTelegraph = String(frame.playerBossTelegraphVisible);
      widget.dataset.blueprintPlayerBossAttack = String(frame.playerBossAttackActive);
      widget.dataset.blueprintPlayerBossHeartbeatLost = String(frame.playerBossHeartbeatLost);
      widget.dataset.blueprintPlayerBossFrozen = String(frame.playerBossFrozen);
      widget.dataset.blueprintPlayerBossAiTakeover = String(frame.playerBossAiTakeover);
      widget.dataset.blueprintPlayerBossHealthPreserved = String(frame.playerBossHealthPreserved);
      widget.dataset.blueprintPlayerBossRewardGrants = String(frame.playerBossRewardGrants);
    }
    if (mechanicId === 'projectile-rally') {
      widget.dataset.blueprintProjectileRally = frame.projectileRallyState;
      widget.dataset.blueprintProjectileRallyId = frame.projectileRallyProjectileId;
      widget.dataset.blueprintProjectileRallyLeg = String(frame.projectileRallyLeg);
      widget.dataset.blueprintProjectileRallyOwner = frame.projectileRallyOwner;
      widget.dataset.blueprintProjectileRallyExchanges = String(frame.projectileRallyExchangeCount);
      widget.dataset.blueprintProjectileRallySpeed = String(frame.projectileRallySpeedTier);
      widget.dataset.blueprintProjectileRallyMiss = String(frame.projectileRallyBossMiss);
      widget.dataset.blueprintProjectileRallyVulnerable = String(frame.projectileRallyVulnerable);
      widget.dataset.blueprintProjectileRallyPunished = String(frame.projectileRallyPunished);
      widget.dataset.blueprintProjectileRallyDamageSource = frame.projectileRallyDamageSource;
    }
    if (mechanicId === 'baited-self-hit') {
      widget.dataset.blueprintBaitedSelfHit = frame.baitedSelfHitState;
      widget.dataset.blueprintBaitTrapId = frame.baitTrapId;
      widget.dataset.blueprintBaitTrapArmed = String(frame.baitTrapArmed);
      widget.dataset.blueprintBaitTargetAcquired = String(frame.baitTargetAcquired);
      widget.dataset.blueprintBaitTargetLocked = String(frame.baitTargetLocked);
      widget.dataset.blueprintBaitCharge = String(frame.baitChargeActive);
      widget.dataset.blueprintBaitPlayerClear = String(frame.baitPlayerClear);
      widget.dataset.blueprintBaitBossContact = String(frame.baitBossContact);
      widget.dataset.blueprintBaitTrapConsumed = String(frame.baitTrapConsumed);
      widget.dataset.blueprintBaitSelfHit = String(frame.baitSelfHitResolved);
      widget.dataset.blueprintBaitVulnerable = String(frame.baitVulnerable);
      widget.dataset.blueprintBaitPunished = String(frame.baitPunished);
      widget.dataset.blueprintBaitDamageSource = frame.baitDamageSource;
      widget.dataset.blueprintBaitCollisionPair = frame.baitCollisionPair;
      widget.dataset.blueprintBaitRewardGrants = String(frame.baitRewardGrants);
    }
    if (mechanicId === 'posture-stagger-gauge') {
      widget.dataset.blueprintPostureStaggerGauge = frame.postureStaggerGaugeState;
      widget.dataset.blueprintPostureValue = String(Math.round(frame.postureValue));
      widget.dataset.blueprintPostureRecovering = String(frame.postureRecovering);
      widget.dataset.blueprintPostureBroken = String(frame.postureBroken);
      widget.dataset.blueprintPostureBreakId = frame.postureBreakId;
      widget.dataset.blueprintPostureCriticalReady = String(frame.postureCriticalReady);
      widget.dataset.blueprintPostureFinisherEligible = String(frame.postureFinisherEligible);
      widget.dataset.blueprintPostureFinisherConsumed = String(frame.postureFinisherConsumed);
      widget.dataset.blueprintPosturePhaseTokens = String(frame.posturePhaseTokens);
      widget.dataset.blueprintPostureRewardGrants = String(frame.postureRewardGrants);
      widget.dataset.blueprintPostureHealthChanged = String(frame.postureHealthChanged);
    }
    if (mechanicId === 'pacifist-resolution') {
      widget.dataset.blueprintPacifistResolution = frame.pacifistResolutionState;
      widget.dataset.blueprintPacifistProgress = String(
        Math.round(frame.pacifistRestraintProgress * 100),
      );
      widget.dataset.blueprintPacifistConditionComplete = String(frame.pacifistConditionComplete);
      widget.dataset.blueprintPacifistChoiceOffered = String(frame.pacifistChoiceOffered);
      widget.dataset.blueprintPacifistAttack = String(frame.pacifistAttackActive);
      widget.dataset.blueprintPacifistOffensiveEvents = String(frame.pacifistOffensiveEvents);
      widget.dataset.blueprintPacifistBossHealth = String(frame.pacifistBossHealth);
      widget.dataset.blueprintPacifistSpareCommitted = String(frame.pacifistSpareCommitted);
      widget.dataset.blueprintPacifistResolutionId = frame.pacifistResolutionId;
      widget.dataset.blueprintPacifistSpared = String(frame.pacifistSpared);
      widget.dataset.blueprintPacifistDefeated = String(frame.pacifistDefeated);
      widget.dataset.blueprintPacifistRewardGrants = String(frame.pacifistRewardGrants);
    }
    if (mechanicId === 'persistent-progress') {
      widget.dataset.blueprintPersistentProgress = frame.persistentProgressState;
      widget.dataset.blueprintPersistentObjectives = String(
        frame.persistentProgressCompletedObjectives,
      );
      widget.dataset.blueprintPersistentRevision = String(frame.persistentProgressRevision);
      widget.dataset.blueprintPersistentAttempt = String(frame.persistentProgressAttempt);
      widget.dataset.blueprintPersistentRetries = String(frame.persistentProgressRetryCount);
      widget.dataset.blueprintPersistentRestoring = String(frame.persistentProgressRestoring);
      widget.dataset.blueprintPersistentPlayerAlive = String(frame.persistentProgressPlayerAlive);
      widget.dataset.blueprintPersistentHazard = String(frame.persistentProgressHazardActive);
      widget.dataset.blueprintPersistentCoreOpen = String(frame.persistentProgressCoreOpen);
      widget.dataset.blueprintPersistentBossHealth = String(frame.persistentProgressBossHealth);
      widget.dataset.blueprintPersistentResultId = frame.persistentProgressResultId;
      widget.dataset.blueprintPersistentRewardGrants = String(frame.persistentProgressRewardGrants);
      widget.dataset.blueprintPersistentSnapshotVersion = String(
        frame.persistentProgressSnapshotVersion,
      );
    }
    if (mechanicId === 'status-buildup') {
      widget.dataset.blueprintStatusBuildup = frame.statusBuildupState;
      widget.dataset.blueprintStatusValue = String(Math.round(frame.statusBuildupValue));
      widget.dataset.blueprintStatusDecayDelayed = String(frame.statusBuildupDecayDelayed);
      widget.dataset.blueprintStatusDecaying = String(frame.statusBuildupDecaying);
      widget.dataset.blueprintStatusContact = String(frame.statusBuildupContactActive);
      widget.dataset.blueprintStatusThreshold = String(frame.statusBuildupThresholdReached);
      widget.dataset.blueprintStatusEffect = String(frame.statusBuildupEffectActive);
      widget.dataset.blueprintStatusEffectCount = String(frame.statusBuildupEffectCount);
      widget.dataset.blueprintStatusImmune = String(frame.statusBuildupImmune);
      widget.dataset.blueprintStatusIgnoredContacts = String(frame.statusBuildupIgnoredContacts);
      widget.dataset.blueprintStatusEffectId = frame.statusBuildupEffectId;
    }
    if (mechanicId === 'instant-kill') {
      widget.dataset.blueprintInstantKill = frame.instantKillState;
      widget.dataset.blueprintInstantKillFirstAvoided = String(frame.instantKillFirstAvoided);
      widget.dataset.blueprintInstantKillConditionLocked = String(frame.instantKillConditionLocked);
      widget.dataset.blueprintInstantKillExecuted = String(frame.instantKillExecuted);
      widget.dataset.blueprintInstantKillAttemptEnded = String(frame.instantKillAttemptEnded);
      widget.dataset.blueprintInstantKillTargetAlive = String(frame.instantKillTargetAlive);
      widget.dataset.blueprintInstantKillHealthBefore = String(frame.instantKillHealthBefore);
      widget.dataset.blueprintInstantKillDamage = String(frame.instantKillDamageApplied);
      widget.dataset.blueprintInstantKillResultCount = String(frame.instantKillResultCount);
      widget.dataset.blueprintInstantKillResultId = frame.instantKillResultId;
      widget.dataset.blueprintInstantKillCondition = frame.instantKillCondition;
    }
    if (mechanicId === 'maximum-health-reduction') {
      widget.dataset.blueprintMaximumHealth = frame.maximumHealthState;
      widget.dataset.blueprintMaximumHealthFirstAvoided = String(frame.maximumHealthFirstAvoided);
      widget.dataset.blueprintMaximumHealthCurrent = String(Math.round(frame.maximumHealthCurrent));
      widget.dataset.blueprintMaximumHealthMaximum = String(Math.round(frame.maximumHealthMaximum));
      widget.dataset.blueprintMaximumHealthBefore = String(frame.maximumHealthBefore);
      widget.dataset.blueprintMaximumHealthAfter = String(frame.maximumHealthAfter);
      widget.dataset.blueprintMaximumHealthLoss = String(Math.round(frame.maximumHealthLoss));
      widget.dataset.blueprintMaximumHealthReduced = String(frame.maximumHealthReduced);
      widget.dataset.blueprintMaximumHealthDamage = String(frame.maximumHealthDamageApplied);
      widget.dataset.blueprintMaximumHealthCapEvents = String(frame.maximumHealthCapEventCount);
      widget.dataset.blueprintMaximumHealthHealRequested = String(frame.maximumHealthHealRequested);
      widget.dataset.blueprintMaximumHealthHealApplied = String(
        Math.round(frame.maximumHealthHealApplied),
      );
      widget.dataset.blueprintMaximumHealthHealBlocked = String(
        Math.round(frame.maximumHealthHealBlocked),
      );
      widget.dataset.blueprintMaximumHealthRestored = String(frame.maximumHealthRestored);
    }
    if (mechanicId === 'ability-lock') {
      widget.dataset.blueprintAbilityLock = frame.abilityLockState;
      widget.dataset.blueprintAbilityLockFirstAvoided = String(frame.abilityLockFirstAvoided);
      widget.dataset.blueprintAbilityLockHealLocked = String(frame.abilityLockHealLocked);
      widget.dataset.blueprintAbilityLockMovementAvailable = String(
        frame.abilityLockMovementAvailable,
      );
      widget.dataset.blueprintAbilityLockAttackAvailable = String(frame.abilityLockAttackAvailable);
      widget.dataset.blueprintAbilityLockInputAttempts = String(frame.abilityLockInputAttempts);
      widget.dataset.blueprintAbilityLockRejectedInputs = String(frame.abilityLockRejectedInputs);
      widget.dataset.blueprintAbilityLockHealSuccessCount = String(
        frame.abilityLockHealSuccessCount,
      );
      widget.dataset.blueprintAbilityLockCurrentHealth = String(
        Math.round(frame.abilityLockCurrentHealth),
      );
      widget.dataset.blueprintAbilityLockHealRequested = String(frame.abilityLockHealRequested);
      widget.dataset.blueprintAbilityLockHealApplied = String(frame.abilityLockHealApplied);
      widget.dataset.blueprintAbilityLockSecondsRemaining = String(
        Math.round(frame.abilityLockSecondsRemaining * 100) / 100,
      );
      widget.dataset.blueprintAbilityLockStatusId = frame.abilityLockStatusId;
    }
    if (mechanicId === 'resource-steal') {
      widget.dataset.blueprintResourceSteal = frame.resourceStealState;
      widget.dataset.blueprintResourceStealFirstAvoided = String(frame.resourceStealFirstAvoided);
      widget.dataset.blueprintResourceStealDropped = String(frame.resourceStealDropped);
      widget.dataset.blueprintResourceStealReclaimed = String(frame.resourceStealReclaimed);
      widget.dataset.blueprintResourceStealCaptured = String(frame.resourceStealCaptured);
      widget.dataset.blueprintResourceStealWorld = String(frame.resourceStealWorldResource);
      widget.dataset.blueprintResourceStealPlayer = String(frame.resourceStealPlayerResource);
      widget.dataset.blueprintResourceStealTotal = String(frame.resourceStealTotalResource);
      widget.dataset.blueprintResourceStealConserved = String(frame.resourceStealConserved);
      widget.dataset.blueprintResourceStealDropEvents = String(frame.resourceStealDropEventCount);
      widget.dataset.blueprintResourceStealBenefitEvents = String(
        frame.resourceStealBenefitEventCount,
      );
      widget.dataset.blueprintResourceStealCapturing = String(frame.resourceStealCapturing);
      widget.dataset.blueprintResourceStealBenefitApplied = String(
        frame.resourceStealBenefitApplied,
      );
      widget.dataset.blueprintResourceStealTokenIds = frame.resourceStealTokenIds.join(',');
      widget.dataset.blueprintResourceStealTokenOwners = frame.resourceStealTokenOwners.join(',');
    }
    if (mechanicId === 'on-hit-healing') {
      widget.dataset.blueprintOnHitHealing = frame.onHitHealingState;
      widget.dataset.blueprintOnHitHealingFirstMissed = String(frame.onHitHealingFirstMissed);
      widget.dataset.blueprintOnHitHealingBlockedContact = String(frame.onHitHealingBlockedContact);
      widget.dataset.blueprintOnHitHealingContactQualified = String(
        frame.onHitHealingContactQualified,
      );
      widget.dataset.blueprintOnHitHealingThirdMissed = String(frame.onHitHealingThirdMissed);
      widget.dataset.blueprintOnHitHealingBossHealth = String(
        Math.round(frame.onHitHealingBossHealth),
      );
      widget.dataset.blueprintOnHitHealingRequested = String(frame.onHitHealingRequested);
      widget.dataset.blueprintOnHitHealingApplied = String(frame.onHitHealingApplied);
      widget.dataset.blueprintOnHitHealingDamage = String(frame.onHitHealingDamageApplied);
      widget.dataset.blueprintOnHitHealingEventCount = String(frame.onHitHealingEventCount);
      widget.dataset.blueprintOnHitHealingResultId = frame.onHitHealingResultId;
      widget.dataset.blueprintOnHitHealingBlockedCounts = String(frame.onHitHealingBlockedCounts);
      widget.dataset.blueprintOnHitHealingMissCounts = String(frame.onHitHealingMissCounts);
    }
    if (mechanicId === 'self-heal-cast') {
      widget.dataset.blueprintSelfHealCast = frame.selfHealCastState;
      widget.dataset.blueprintSelfHealCastFirstInterrupted = String(
        frame.selfHealCastFirstInterrupted,
      );
      widget.dataset.blueprintSelfHealCastChannelActive = String(frame.selfHealCastChannelActive);
      widget.dataset.blueprintSelfHealCastChannelProgress = String(
        Math.round(frame.selfHealCastChannelProgress * 100) / 100,
      );
      widget.dataset.blueprintSelfHealCastCompleted = String(frame.selfHealCastCompleted);
      widget.dataset.blueprintSelfHealCastHealing = String(frame.selfHealCastHealing);
      widget.dataset.blueprintSelfHealCastBossHealth = String(
        Math.round(frame.selfHealCastBossHealth),
      );
      widget.dataset.blueprintSelfHealCastRequested = String(frame.selfHealCastRequested);
      widget.dataset.blueprintSelfHealCastApplied = String(frame.selfHealCastApplied);
      widget.dataset.blueprintSelfHealCastEventCount = String(frame.selfHealCastEventCount);
      widget.dataset.blueprintSelfHealCastInterruptCount = String(frame.selfHealCastInterruptCount);
      widget.dataset.blueprintSelfHealCastResultId = frame.selfHealCastResultId;
    }
    if (mechanicId === 'external-healing-source') {
      widget.dataset.blueprintExternalHealingSource = frame.externalHealingSourceState;
      widget.dataset.blueprintExternalHealingSourceFirstDestroyed = String(
        frame.externalHealingSourceFirstDestroyed,
      );
      widget.dataset.blueprintExternalHealingSourceFirstPacketCancelled = String(
        frame.externalHealingSourceFirstPacketCancelled,
      );
      widget.dataset.blueprintExternalHealingSourceSecondSignaled = String(
        frame.externalHealingSourceSecondSignaled,
      );
      widget.dataset.blueprintExternalHealingSourceSecondPacketActive = String(
        frame.externalHealingSourceSecondPacketActive,
      );
      widget.dataset.blueprintExternalHealingSourceDelivered = String(
        frame.externalHealingSourceDelivered,
      );
      widget.dataset.blueprintExternalHealingSourceHealing = String(
        frame.externalHealingSourceHealing,
      );
      widget.dataset.blueprintExternalHealingSourceActiveCount = String(
        frame.externalHealingSourceActiveCount,
      );
      widget.dataset.blueprintExternalHealingSourceBossHealth = String(
        Math.round(frame.externalHealingSourceBossHealth),
      );
      widget.dataset.blueprintExternalHealingSourceRequested = String(
        frame.externalHealingSourceRequested,
      );
      widget.dataset.blueprintExternalHealingSourceApplied = String(
        frame.externalHealingSourceApplied,
      );
      widget.dataset.blueprintExternalHealingSourceEventCount = String(
        frame.externalHealingSourceEventCount,
      );
      widget.dataset.blueprintExternalHealingSourceSourceId = frame.externalHealingSourceSourceId;
      widget.dataset.blueprintExternalHealingSourceResultId = frame.externalHealingSourceResultId;
    }
    if (mechanicId === 'damage-rate-cap') {
      widget.dataset.blueprintDamageRateCap = frame.damageRateCapState;
      widget.dataset.blueprintDamageRateCapBurstActive = String(frame.damageRateCapBurstActive);
      widget.dataset.blueprintDamageRateCapWindowRecovered = String(
        frame.damageRateCapWindowRecovered,
      );
      widget.dataset.blueprintDamageRateCapHitCount = String(frame.damageRateCapHitCount);
      widget.dataset.blueprintDamageRateCapRaw = String(frame.damageRateCapRawDamage);
      widget.dataset.blueprintDamageRateCapApplied = String(frame.damageRateCapAppliedDamage);
      widget.dataset.blueprintDamageRateCapPrevented = String(frame.damageRateCapPreventedDamage);
      widget.dataset.blueprintDamageRateCapTotalApplied = String(frame.damageRateCapTotalApplied);
      widget.dataset.blueprintDamageRateCapRecent = String(
        Math.round(frame.damageRateCapRecentDamage),
      );
      widget.dataset.blueprintDamageRateCapThreshold = String(frame.damageRateCapThreshold);
      widget.dataset.blueprintDamageRateCapMultiplier = frame.damageRateCapMultiplier.toFixed(3);
      widget.dataset.blueprintDamageRateCapBossHealth = String(
        Math.round(frame.damageRateCapBossHealth),
      );
      widget.dataset.blueprintDamageRateCapEventCount = String(frame.damageRateCapEventCount);
      widget.dataset.blueprintDamageRateCapLastHitId = frame.damageRateCapLastHitId;
    }
    if (mechanicId === 'loadout-mirror') {
      widget.dataset.blueprintLoadoutMirror = frame.loadoutMirrorState;
      widget.dataset.blueprintLoadoutMirrorSnapshotCaptured = String(
        frame.loadoutMirrorSnapshotCaptured,
      );
      widget.dataset.blueprintLoadoutMirrorSnapshotId = frame.loadoutMirrorSnapshotId;
      widget.dataset.blueprintLoadoutMirrorSnapshotEvents = String(
        frame.loadoutMirrorSnapshotEventCount,
      );
      widget.dataset.blueprintLoadoutMirrorPlayerLoadout =
        frame.loadoutMirrorPlayerLoadoutIds.join(',');
      widget.dataset.blueprintLoadoutMirrorCopiedLoadout =
        frame.loadoutMirrorCopiedLoadoutIds.join(',');
      widget.dataset.blueprintLoadoutMirrorCopyMatchesSnapshot = String(
        frame.loadoutMirrorCopyMatchesSnapshot,
      );
      widget.dataset.blueprintLoadoutMirrorPlayerChanged = String(frame.loadoutMirrorPlayerChanged);
      widget.dataset.blueprintLoadoutMirrorLiveResnapshots = String(
        frame.loadoutMirrorLiveResnapshotCount,
      );
      widget.dataset.blueprintLoadoutMirrorBossPackage = frame.loadoutMirrorBossPackage;
      widget.dataset.blueprintLoadoutMirrorBossUsedCopiedAttack = String(
        frame.loadoutMirrorBossUsedCopiedAttack,
      );
    }
    if (mechanicId === 'moveset-shapeshifting') {
      widget.dataset.blueprintMovesetShapeshifting = frame.movesetShapeshiftingState;
      widget.dataset.blueprintMovesetShapeshiftingForm = frame.movesetShapeshiftingForm;
      widget.dataset.blueprintMovesetShapeshiftingPackage = frame.movesetShapeshiftingPackageId;
      widget.dataset.blueprintMovesetShapeshiftingFormIndex = String(
        frame.movesetShapeshiftingFormIndex,
      );
      widget.dataset.blueprintMovesetShapeshiftingAttackActive = String(
        frame.movesetShapeshiftingPackageAttackActive,
      );
      widget.dataset.blueprintMovesetShapeshiftingTransitionActive = String(
        frame.movesetShapeshiftingTransitionActive,
      );
      widget.dataset.blueprintMovesetShapeshiftingChangeCount = String(
        frame.movesetShapeshiftingChangeCount,
      );
      widget.dataset.blueprintMovesetShapeshiftingPackageScope = String(
        frame.movesetShapeshiftingPackageScope,
      );
      widget.dataset.blueprintMovesetShapeshiftingChangeId = frame.movesetShapeshiftingChangeId;
      widget.dataset.blueprintMovesetShapeshiftingEventCount = String(
        frame.movesetShapeshiftingEventCount,
      );
    }
    if (mechanicId === 'ally-theft') {
      widget.dataset.blueprintAllyTheft = frame.allyTheftState;
      widget.dataset.blueprintAllyTheftAllyId = frame.allyTheftAllyId;
      widget.dataset.blueprintAllyTheftCaptureId = frame.allyTheftCaptureId;
      widget.dataset.blueprintAllyTheftOwner = frame.allyTheftOwnerId;
      widget.dataset.blueprintAllyTheftMarked = String(frame.allyTheftMarked);
      widget.dataset.blueprintAllyTheftHostile = String(frame.allyTheftHostile);
      widget.dataset.blueprintAllyTheftCommandCount = String(frame.allyTheftCommandCount);
      widget.dataset.blueprintAllyTheftOwnershipEvents = String(frame.allyTheftOwnershipEventCount);
      widget.dataset.blueprintAllyTheftEligibleCount = String(frame.allyTheftEligibleCount);
      widget.dataset.blueprintAllyTheftReleaseReason = frame.allyTheftReleaseReason;
      widget.dataset.blueprintAllyTheftRecaptureBlocked = String(frame.allyTheftRecaptureBlocked);
    }
    if (mechanicId === 'false-death') {
      widget.dataset.blueprintFalseDeath = frame.falseDeathState;
      widget.dataset.blueprintFalseDeathDepletionId = frame.falseDeathDepletionId;
      widget.dataset.blueprintFalseDeathRevivalId = frame.falseDeathRevivalId;
      widget.dataset.blueprintFalseDeathPhase = String(frame.falseDeathCurrentPhase);
      widget.dataset.blueprintFalseDeathBossHealth = String(Math.round(frame.falseDeathBossHealth));
      widget.dataset.blueprintFalseDeathHealthDepleted = String(
        frame.falseDeathPhaseHealthDepleted,
      );
      widget.dataset.blueprintFalseDeathCompletionPending = String(
        frame.falseDeathCompletionPending,
      );
      widget.dataset.blueprintFalseDeathEncounterComplete = String(
        frame.falseDeathEncounterComplete,
      );
      widget.dataset.blueprintFalseDeathRewardLocked = String(frame.falseDeathRewardLocked);
      widget.dataset.blueprintFalseDeathExitLocked = String(frame.falseDeathExitLocked);
      widget.dataset.blueprintFalseDeathRebuildActive = String(frame.falseDeathRebuildActive);
      widget.dataset.blueprintFalseDeathRevived = String(frame.falseDeathRevived);
      widget.dataset.blueprintFalseDeathRevivalCount = String(frame.falseDeathRevivalCount);
      widget.dataset.blueprintFalseDeathEventCount = String(frame.falseDeathEventCount);
      widget.dataset.blueprintFalseDeathSecondSignal = String(frame.falseDeathSecondSignalActive);
      widget.dataset.blueprintFalseDeathSecondAttack = String(frame.falseDeathSecondAttackActive);
    }
    if (mechanicId === 'action-reactive-punish') {
      widget.dataset.blueprintActionReactivePunish = frame.actionReactivePunishState;
      widget.dataset.blueprintActionReactivePunishActionId = frame.actionReactivePunishActionId;
      widget.dataset.blueprintActionReactivePunishResponseId = frame.actionReactivePunishResponseId;
      widget.dataset.blueprintActionReactivePunishObserved = String(
        frame.actionReactivePunishObserved,
      );
      widget.dataset.blueprintActionReactivePunishQueued = String(
        frame.actionReactivePunishResponseQueued,
      );
      widget.dataset.blueprintActionReactivePunishCommitted = String(
        frame.actionReactivePunishCommitted,
      );
      widget.dataset.blueprintActionReactivePunishProjectile = String(
        frame.actionReactivePunishProjectileActive,
      );
      widget.dataset.blueprintActionReactivePunishBossAvailable = String(
        frame.actionReactivePunishBossAvailable,
      );
      widget.dataset.blueprintActionReactivePunishCooldownReady = String(
        frame.actionReactivePunishCooldownReady,
      );
      widget.dataset.blueprintActionReactivePunishSafeWindow = String(
        frame.actionReactivePunishSafeWindow,
      );
      widget.dataset.blueprintActionReactivePunishSafeAction = String(
        frame.actionReactivePunishSafeActionActive,
      );
      widget.dataset.blueprintActionReactivePunishSafeActionCompleted = String(
        frame.actionReactivePunishSafeActionCompleted,
      );
      widget.dataset.blueprintActionReactivePunishRejection =
        frame.actionReactivePunishRejectionReason;
      widget.dataset.blueprintActionReactivePunishResponseCount = String(
        frame.actionReactivePunishResponseCount,
      );
      widget.dataset.blueprintActionReactivePunishEventCount = String(
        frame.actionReactivePunishEventCount,
      );
    }
    if (mechanicId === 'run-history-manifestation') {
      widget.dataset.blueprintRunHistoryManifestation = frame.runHistoryManifestationState;
      widget.dataset.blueprintRunHistoryManifestationEncounterId =
        frame.runHistoryManifestationEncounterId;
      widget.dataset.blueprintRunHistoryManifestationEntryId = frame.runHistoryManifestationEntryId;
      widget.dataset.blueprintRunHistoryManifestationManifestId =
        frame.runHistoryManifestationManifestId;
      widget.dataset.blueprintRunHistoryManifestationCaptured = String(
        frame.runHistoryManifestationCaptured,
      );
      widget.dataset.blueprintRunHistoryManifestationHistoryVersion = String(
        frame.runHistoryManifestationHistoryVersion,
      );
      widget.dataset.blueprintRunHistoryManifestationHistoryCount = String(
        frame.runHistoryManifestationHistoryCount,
      );
      widget.dataset.blueprintRunHistoryManifestationEchoCount = String(
        frame.runHistoryManifestationEchoCount,
      );
      widget.dataset.blueprintRunHistoryManifestationSupportCount = String(
        frame.runHistoryManifestationSupportCount,
      );
      widget.dataset.blueprintRunHistoryManifestationModifierCount = String(
        frame.runHistoryManifestationModifierCount,
      );
      widget.dataset.blueprintRunHistoryManifestationCaptureEvents = String(
        frame.runHistoryManifestationCaptureEvents,
      );
      widget.dataset.blueprintRunHistoryManifestationLiveResnapshots = String(
        frame.runHistoryManifestationLiveResnapshots,
      );
      widget.dataset.blueprintRunHistoryManifestationEchoActive = String(
        frame.runHistoryManifestationEchoActive,
      );
      widget.dataset.blueprintRunHistoryManifestationRelicActive = String(
        frame.runHistoryManifestationRelicActive,
      );
      widget.dataset.blueprintRunHistoryManifestationWardProtecting = String(
        frame.runHistoryManifestationWardProtecting,
      );
      widget.dataset.blueprintRunHistoryManifestationRetryStable = String(
        frame.runHistoryManifestationRetryStable,
      );
      widget.dataset.blueprintRunHistoryManifestationManifestUnchanged = String(
        frame.runHistoryManifestationManifestUnchanged,
      );
    }
    if (mechanicId === 'real-time-progression') {
      widget.dataset.blueprintRealTimeProgression = frame.realTimeProgressionState;
      widget.dataset.blueprintRealTimeProgressionCheckpointId =
        frame.realTimeProgressionCheckpointId;
      widget.dataset.blueprintRealTimeProgressionReconciliationId =
        frame.realTimeProgressionReconciliationId;
      widget.dataset.blueprintRealTimeProgressionAuthority = frame.realTimeProgressionAuthority;
      widget.dataset.blueprintRealTimeProgressionSavedHour = String(
        frame.realTimeProgressionSavedHour,
      );
      widget.dataset.blueprintRealTimeProgressionCurrentHour = String(
        frame.realTimeProgressionCurrentHour,
      );
      widget.dataset.blueprintRealTimeProgressionElapsedHours = String(
        frame.realTimeProgressionElapsedHours,
      );
      widget.dataset.blueprintRealTimeProgressionAppliedHours = String(
        frame.realTimeProgressionAppliedHours,
      );
      widget.dataset.blueprintRealTimeProgressionCapped = String(frame.realTimeProgressionCapped);
      widget.dataset.blueprintRealTimeProgressionClosed = String(frame.realTimeProgressionClosed);
      widget.dataset.blueprintRealTimeProgressionReconciled = String(
        frame.realTimeProgressionReconciled,
      );
      widget.dataset.blueprintRealTimeProgressionEventCount = String(
        frame.realTimeProgressionEventCount,
      );
      widget.dataset.blueprintRealTimeProgressionLiveTicks = String(
        frame.realTimeProgressionLiveTicks,
      );
      widget.dataset.blueprintRealTimeProgressionClockRollback = String(
        frame.realTimeProgressionClockRollback,
      );
      widget.dataset.blueprintRealTimeProgressionBossTier = String(
        frame.realTimeProgressionBossTier,
      );
      widget.dataset.blueprintRealTimeProgressionOfflineHazardCount = String(
        frame.realTimeProgressionOfflineHazardCount,
      );
      widget.dataset.blueprintRealTimeProgressionAttackActive = String(
        frame.realTimeProgressionAttackActive,
      );
      widget.dataset.blueprintRealTimeProgressionRetryStable = String(
        frame.realTimeProgressionRetryStable,
      );
      widget.dataset.blueprintRealTimeProgressionProgressionUnchanged = String(
        frame.realTimeProgressionProgressionUnchanged,
      );
    }
    if (mechanicId === 'interface-interaction') {
      widget.dataset.blueprintInterfaceInteraction = frame.interfaceInteractionState;
      widget.dataset.blueprintInterfaceInteractionInteractionId =
        frame.interfaceInteractionInteractionId;
      widget.dataset.blueprintInterfaceInteractionConfirmationId =
        frame.interfaceInteractionConfirmationId;
      widget.dataset.blueprintInterfaceInteractionPrimaryRoute =
        frame.interfaceInteractionPrimaryRoute;
      widget.dataset.blueprintInterfaceInteractionSelectedRoute =
        frame.interfaceInteractionSelectedRoute;
      widget.dataset.blueprintInterfaceInteractionPaused = String(frame.interfaceInteractionPaused);
      widget.dataset.blueprintInterfaceInteractionFocusOutside = String(
        frame.interfaceInteractionFocusOutside,
      );
      widget.dataset.blueprintInterfaceInteractionRouteSwitching = String(
        frame.interfaceInteractionRouteSwitching,
      );
      widget.dataset.blueprintInterfaceInteractionConfirmed = String(
        frame.interfaceInteractionConfirmed,
      );
      widget.dataset.blueprintInterfaceInteractionConfirmationCount = String(
        frame.interfaceInteractionConfirmationCount,
      );
      widget.dataset.blueprintInterfaceInteractionNormalAttemptBlocked = String(
        frame.interfaceInteractionNormalAttemptBlocked,
      );
      widget.dataset.blueprintInterfaceInteractionWardReading = String(
        frame.interfaceInteractionWardReading,
      );
      widget.dataset.blueprintInterfaceInteractionOpeningActive = String(
        frame.interfaceInteractionOpeningActive,
      );
      widget.dataset.blueprintInterfaceInteractionCounterSignaled = String(
        frame.interfaceInteractionCounterSignaled,
      );
      widget.dataset.blueprintInterfaceInteractionCounterActive = String(
        frame.interfaceInteractionCounterActive,
      );
      widget.dataset.blueprintInterfaceInteractionFallbackAvailable = String(
        frame.interfaceInteractionFallbackAvailable,
      );
      widget.dataset.blueprintInterfaceInteractionFallbackUsed = String(
        frame.interfaceInteractionFallbackUsed,
      );
      widget.dataset.blueprintInterfaceInteractionHostileTicksWhilePaused = String(
        frame.interfaceInteractionHostileTicksWhilePaused,
      );
      widget.dataset.blueprintInterfaceInteractionDestructiveActionCount = String(
        frame.interfaceInteractionDestructiveActionCount,
      );
      widget.dataset.blueprintInterfaceInteractionPrivatePayloadStored = String(
        frame.interfaceInteractionPrivatePayloadStored,
      );
      widget.dataset.blueprintInterfaceInteractionRetrySafe = String(
        frame.interfaceInteractionRetrySafe,
      );
      widget.dataset.blueprintInterfaceInteractionRouteRestored = String(
        frame.interfaceInteractionRouteRestored,
      );
    }
    if (mechanicId === 'world-state-variant') {
      widget.dataset.blueprintWorldStateVariant = frame.worldStateVariantState;
      widget.dataset.blueprintWorldStateVariantEncounterId = frame.worldStateVariantEncounterId;
      widget.dataset.blueprintWorldStateVariantEntryId = frame.worldStateVariantEntryId;
      widget.dataset.blueprintWorldStateVariantSnapshotVersion = String(
        frame.worldStateVariantSnapshotVersion,
      );
      widget.dataset.blueprintWorldStateVariantSnapshotCaptured = String(
        frame.worldStateVariantSnapshotCaptured,
      );
      widget.dataset.blueprintWorldStateVariantSnapshotCount = String(
        frame.worldStateVariantSnapshotCount,
      );
      widget.dataset.blueprintWorldStateVariantSelectedTimeBand =
        frame.worldStateVariantSelectedTimeBand;
      widget.dataset.blueprintWorldStateVariantOutsideTimeBand =
        frame.worldStateVariantOutsideTimeBand;
      widget.dataset.blueprintWorldStateVariantRegionState = frame.worldStateVariantRegionState;
      widget.dataset.blueprintWorldStateVariantWorldMode = frame.worldStateVariantWorldMode;
      widget.dataset.blueprintWorldStateVariantVariantId = frame.worldStateVariantVariantId;
      widget.dataset.blueprintWorldStateVariantPackageMaterialized = String(
        frame.worldStateVariantPackageMaterialized,
      );
      widget.dataset.blueprintWorldStateVariantHazardCount = String(
        frame.worldStateVariantHazardCount,
      );
      widget.dataset.blueprintWorldStateVariantModifierCount = String(
        frame.worldStateVariantModifierCount,
      );
      widget.dataset.blueprintWorldStateVariantRewardTableId = frame.worldStateVariantRewardTableId;
      widget.dataset.blueprintWorldStateVariantRewardMapped = String(
        frame.worldStateVariantRewardMapped,
      );
      widget.dataset.blueprintWorldStateVariantAttackSignaled = String(
        frame.worldStateVariantAttackSignaled,
      );
      widget.dataset.blueprintWorldStateVariantAttackActive = String(
        frame.worldStateVariantAttackActive,
      );
      widget.dataset.blueprintWorldStateVariantOpeningActive = String(
        frame.worldStateVariantOpeningActive,
      );
      widget.dataset.blueprintWorldStateVariantRetryStable = String(
        frame.worldStateVariantRetryStable,
      );
      widget.dataset.blueprintWorldStateVariantVariantUnchanged = String(
        frame.worldStateVariantVariantUnchanged,
      );
      widget.dataset.blueprintWorldStateVariantLiveResnapshots = String(
        frame.worldStateVariantLiveResnapshots,
      );
      widget.dataset.blueprintWorldStateVariantFallbackUsed = String(
        frame.worldStateVariantFallbackUsed,
      );
    }
    if (mechanicId === 'party-size-scaling') {
      widget.dataset.blueprintPartySizeScaling = frame.partySizeScalingState;
      widget.dataset.blueprintPartySizeScalingEncounterId = frame.partySizeScalingEncounterId;
      widget.dataset.blueprintPartySizeScalingResolutionId = frame.partySizeScalingResolutionId;
      widget.dataset.blueprintPartySizeScalingRosterVersion = String(
        frame.partySizeScalingRosterVersion,
      );
      widget.dataset.blueprintPartySizeScalingPartySize = String(frame.partySizeScalingPartySize);
      widget.dataset.blueprintPartySizeScalingJoinQueued = String(frame.partySizeScalingJoinQueued);
      widget.dataset.blueprintPartySizeScalingLeaveQueued = String(
        frame.partySizeScalingLeaveQueued,
      );
      widget.dataset.blueprintPartySizeScalingScaleApplied = String(
        frame.partySizeScalingScaleApplied,
      );
      widget.dataset.blueprintPartySizeScalingHealthMultiplier = String(
        frame.partySizeScalingHealthMultiplier,
      );
      widget.dataset.blueprintPartySizeScalingMaxHealth = String(frame.partySizeScalingMaxHealth);
      widget.dataset.blueprintPartySizeScalingCurrentHealth = String(
        frame.partySizeScalingCurrentHealth,
      );
      widget.dataset.blueprintPartySizeScalingHealthFraction = String(
        frame.partySizeScalingHealthFraction,
      );
      widget.dataset.blueprintPartySizeScalingTargetSlots = String(
        frame.partySizeScalingTargetSlots,
      );
      widget.dataset.blueprintPartySizeScalingHazardBudget = String(
        frame.partySizeScalingHazardBudget,
      );
      widget.dataset.blueprintPartySizeScalingApplicationCount = String(
        frame.partySizeScalingApplicationCount,
      );
      widget.dataset.blueprintPartySizeScalingMidAttackApplications = String(
        frame.partySizeScalingMidAttackApplications,
      );
      widget.dataset.blueprintPartySizeScalingProgressReversed = String(
        frame.partySizeScalingProgressReversed,
      );
      widget.dataset.blueprintPartySizeScalingAttackSignaled = String(
        frame.partySizeScalingAttackSignaled,
      );
      widget.dataset.blueprintPartySizeScalingAttackActive = String(
        frame.partySizeScalingAttackActive,
      );
      widget.dataset.blueprintPartySizeScalingOpeningActive = String(
        frame.partySizeScalingOpeningActive,
      );
      widget.dataset.blueprintPartySizeScalingEligibilitySettled = String(
        frame.partySizeScalingEligibilitySettled,
      );
      widget.dataset.blueprintPartySizeScalingRewardShareCount = String(
        frame.partySizeScalingRewardShareCount,
      );
      widget.dataset.blueprintPartySizeScalingRetryStable = String(
        frame.partySizeScalingRetryStable,
      );
    }
    if (mechanicId === 'partner-revival') {
      widget.dataset.blueprintPartnerRevival = frame.partnerRevivalState;
      widget.dataset.blueprintPartnerRevivalEncounterId = frame.partnerRevivalEncounterId;
      widget.dataset.blueprintPartnerRevivalPairVersion = String(frame.partnerRevivalPairVersion);
      widget.dataset.blueprintPartnerRevivalPartnerBossId = frame.partnerRevivalPartnerBossId;
      widget.dataset.blueprintPartnerRevivalReviverBossId = frame.partnerRevivalReviverBossId;
      widget.dataset.blueprintPartnerRevivalAttemptId = frame.partnerRevivalAttemptId;
      widget.dataset.blueprintPartnerRevivalPartnerDowned = String(
        frame.partnerRevivalPartnerDowned,
      );
      widget.dataset.blueprintPartnerRevivalFirstChannelActive = String(
        frame.partnerRevivalFirstChannelActive,
      );
      widget.dataset.blueprintPartnerRevivalSecondChannelActive = String(
        frame.partnerRevivalSecondChannelActive,
      );
      widget.dataset.blueprintPartnerRevivalChannelProgress = String(
        frame.partnerRevivalChannelProgress,
      );
      widget.dataset.blueprintPartnerRevivalReviveSucceeded = String(
        frame.partnerRevivalReviveSucceeded,
      );
      widget.dataset.blueprintPartnerRevivalRevivedHealthFraction = String(
        frame.partnerRevivalRevivedHealthFraction,
      );
      widget.dataset.blueprintPartnerRevivalReviveGrantCount = String(
        frame.partnerRevivalReviveGrantCount,
      );
      widget.dataset.blueprintPartnerRevivalInterrupted = String(frame.partnerRevivalInterrupted);
      widget.dataset.blueprintPartnerRevivalInterruptCount = String(
        frame.partnerRevivalInterruptCount,
      );
      widget.dataset.blueprintPartnerRevivalInterruptLockActive = String(
        frame.partnerRevivalInterruptLockActive,
      );
      widget.dataset.blueprintPartnerRevivalSynchronizedWindowActive = String(
        frame.partnerRevivalSynchronizedWindowActive,
      );
      widget.dataset.blueprintPartnerRevivalSurvivorHealthFraction = String(
        frame.partnerRevivalSurvivorHealthFraction,
      );
      widget.dataset.blueprintPartnerRevivalSurvivorDowned = String(
        frame.partnerRevivalSurvivorDowned,
      );
      widget.dataset.blueprintPartnerRevivalCompletionAuthorized = String(
        frame.partnerRevivalCompletionAuthorized,
      );
      widget.dataset.blueprintPartnerRevivalCompletionCount = String(
        frame.partnerRevivalCompletionCount,
      );
      widget.dataset.blueprintPartnerRevivalDuplicateGrantCount = String(
        frame.partnerRevivalDuplicateGrantCount,
      );
      widget.dataset.blueprintPartnerRevivalRetryStable = String(frame.partnerRevivalRetryStable);
    }
    if (mechanicId === 'kill-order-inheritance') {
      widget.dataset.blueprintKillOrderInheritance = frame.killOrderInheritanceState;
      widget.dataset.blueprintKillOrderInheritanceEncounterId =
        frame.killOrderInheritanceEncounterId;
      widget.dataset.blueprintKillOrderInheritanceAttemptId = frame.killOrderInheritanceAttemptId;
      widget.dataset.blueprintKillOrderInheritanceSourceBossId =
        frame.killOrderInheritanceSourceBossId;
      widget.dataset.blueprintKillOrderInheritanceSurvivorBossId =
        frame.killOrderInheritanceSurvivorBossId;
      widget.dataset.blueprintKillOrderInheritanceInheritedPackage =
        frame.killOrderInheritanceInheritedPackage;
      widget.dataset.blueprintKillOrderInheritanceGrantCount = String(
        frame.killOrderInheritanceGrantCount,
      );
      widget.dataset.blueprintKillOrderInheritanceLeftDown = String(
        frame.killOrderInheritanceLeftDown,
      );
      widget.dataset.blueprintKillOrderInheritanceRightDown = String(
        frame.killOrderInheritanceRightDown,
      );
      widget.dataset.blueprintKillOrderInheritanceWaveActive = String(
        frame.killOrderInheritanceWaveActive,
      );
      widget.dataset.blueprintKillOrderInheritanceLanceActive = String(
        frame.killOrderInheritanceLanceActive,
      );
      widget.dataset.blueprintKillOrderInheritanceRetryTransition = String(
        frame.killOrderInheritanceRetryTransition,
      );
      widget.dataset.blueprintKillOrderInheritanceCompletionCount = String(
        frame.killOrderInheritanceCompletionCount,
      );
      widget.dataset.blueprintKillOrderInheritanceDuplicateGrantCount = String(
        frame.killOrderInheritanceDuplicateGrantCount,
      );
    }
    if (mechanicId === 'shared-group-health') {
      if (groupHealthLabel)
        groupHealthLabel.textContent = `${frame.sharedGroupHealthCurrentHealth} / 100`;
      widget.dataset.blueprintSharedGroupHealth = frame.sharedGroupHealthState;
      widget.dataset.blueprintSharedGroupHealthEncounterId = frame.sharedGroupHealthEncounterId;
      widget.dataset.blueprintSharedGroupHealthAttemptId = frame.sharedGroupHealthAttemptId;
      widget.dataset.blueprintSharedGroupHealthCurrentHealth = String(
        frame.sharedGroupHealthCurrentHealth,
      );
      widget.dataset.blueprintSharedGroupHealthAcceptedEventCount = String(
        frame.sharedGroupHealthAcceptedEventCount,
      );
      widget.dataset.blueprintSharedGroupHealthDuplicateEventCount = String(
        frame.sharedGroupHealthDuplicateEventCount,
      );
      widget.dataset.blueprintSharedGroupHealthLeftPresent = String(
        frame.sharedGroupHealthLeftPresent,
      );
      widget.dataset.blueprintSharedGroupHealthRightPresent = String(
        frame.sharedGroupHealthRightPresent,
      );
      widget.dataset.blueprintSharedGroupHealthCompletionCount = String(
        frame.sharedGroupHealthCompletionCount,
      );
      widget.dataset.blueprintSharedGroupHealthRetry = String(frame.sharedGroupHealthRetry);
    }
    if (mechanicId === 'coordinated-duo-attack') {
      widget.dataset.blueprintCoordinatedDuoAttack = frame.coordinatedDuoAttackState;
      widget.dataset.blueprintCoordinatedDuoAttackEncounterId =
        frame.coordinatedDuoAttackEncounterId;
      widget.dataset.blueprintCoordinatedDuoAttackAttemptId = frame.coordinatedDuoAttackAttemptId;
      widget.dataset.blueprintCoordinatedDuoAttackResolution = frame.coordinatedDuoAttackResolution;
      widget.dataset.blueprintCoordinatedDuoAttackFollowupCount = String(
        frame.coordinatedDuoAttackFollowupCount,
      );
      widget.dataset.blueprintCoordinatedDuoAttackFollowupCancelled = String(
        frame.coordinatedDuoAttackFollowupCancelled,
      );
      widget.dataset.blueprintCoordinatedDuoAttackRetry = String(frame.coordinatedDuoAttackRetry);
    }
    if (mechanicId === 'stack-damage') {
      widget.dataset.blueprintStackDamage = frame.stackDamageState;
      widget.dataset.blueprintStackDamageEncounterId = frame.stackDamageEncounterId;
      widget.dataset.blueprintStackDamageHitId = frame.stackDamageHitId;
      widget.dataset.blueprintStackDamageParticipantCount = String(
        frame.stackDamageParticipantCount,
      );
      widget.dataset.blueprintStackDamageShare = String(frame.stackDamageShare);
      widget.dataset.blueprintStackDamageHealth = String(frame.stackDamageHealth[0]);
      widget.dataset.blueprintStackDamageApplicationCount = String(
        frame.stackDamageApplicationCount,
      );
      widget.dataset.blueprintStackDamageSoloFailure = String(frame.stackDamageSoloFailure);
      widget.dataset.blueprintStackDamageRetry = String(frame.stackDamageRetry);
      if (stackReadout)
        stackReadout.textContent =
          frame.time >= 0.7 && frame.time < 5.3
            ? `90 ÷ ${frame.stackDamageParticipantCount} = ${frame.stackDamageShare}`
            : '';
      for (const label of stackHealthLabels)
        label.textContent = String(
          frame.stackDamageHealth[Number(label.dataset.blueprintStackHealth)],
        );
    }
    if (mechanicId === 'personal-spread') {
      widget.dataset.blueprintPersonalSpread = frame.personalSpreadState;
      widget.dataset.blueprintPersonalSpreadEncounterId = frame.personalSpreadEncounterId;
      widget.dataset.blueprintPersonalSpreadHitId = frame.personalSpreadHitId;
      widget.dataset.blueprintPersonalSpreadHitCounts = frame.personalSpreadHitCounts.join('/');
      widget.dataset.blueprintPersonalSpreadHealth = frame.personalSpreadHealth.join('/');
      widget.dataset.blueprintPersonalSpreadApplicationCount = String(
        frame.personalSpreadApplicationCount,
      );
      widget.dataset.blueprintPersonalSpreadFailure = String(frame.personalSpreadFailure);
      widget.dataset.blueprintPersonalSpreadRetry = String(frame.personalSpreadRetry);
      if (spreadReadout)
        spreadReadout.textContent =
          frame.time >= 0.65 && frame.time < 5.3 ? frame.personalSpreadHitCounts.join(' / ') : '';
      for (const label of spreadHealthLabels)
        label.textContent = String(
          frame.personalSpreadHealth[Number(label.dataset.blueprintSpreadHealth)],
        );
    }
    if (mechanicId === 'tower-soak') {
      widget.dataset.blueprintTowerSoak = frame.towerSoakState;
      widget.dataset.blueprintTowerSoakHitId = frame.towerSoakHitId;
      widget.dataset.blueprintTowerSoakOccupancy = `${frame.towerSoakOccupiedCount}/${frame.towerSoakRequiredCount}`;
      widget.dataset.blueprintTowerSoakSucceeded = String(frame.towerSoakSucceeded);
      widget.dataset.blueprintTowerSoakHealth = frame.towerSoakHealth.join('/');
      widget.dataset.blueprintTowerSoakApplicationCount = String(frame.towerSoakApplicationCount);
      widget.dataset.blueprintTowerSoakFailure = String(frame.towerSoakFailure);
      widget.dataset.blueprintTowerSoakRetry = String(frame.towerSoakRetry);
      if (towerReadout)
        towerReadout.textContent =
          frame.time >= 0.7 && frame.time < 5.3
            ? `${frame.towerSoakOccupiedCount} / ${frame.towerSoakRequiredCount}`
            : '';
      for (const label of towerHealthLabels)
        label.textContent = String(
          frame.towerSoakHealth[Number(label.dataset.blueprintTowerHealth)],
        );
    }
    if (mechanicId === 'entity-tether') {
      widget.dataset.blueprintEntityTether = frame.entityTetherState;
      widget.dataset.blueprintEntityTetherHitId = frame.entityTetherHitId;
      widget.dataset.blueprintEntityTetherDistance = String(Math.round(frame.entityTetherDistance));
      widget.dataset.blueprintEntityTetherHeld = String(frame.entityTetherHeld);
      widget.dataset.blueprintEntityTetherHealth = frame.entityTetherHealth.join('/');
      widget.dataset.blueprintEntityTetherApplicationCount = String(
        frame.entityTetherApplicationCount,
      );
      widget.dataset.blueprintEntityTetherBroken = String(frame.entityTetherBroken);
      widget.dataset.blueprintEntityTetherRetry = String(frame.entityTetherRetry);
      if (tetherReadout)
        tetherReadout.textContent = frame.entityTetherVisible
          ? `${Math.round(frame.entityTetherDistance)} / ${frame.entityTetherMaxLength}`
          : '';
      for (const label of tetherHealthLabels)
        label.textContent = String(
          frame.entityTetherHealth[Number(label.dataset.blueprintTetherHealth)],
        );
    }
    if (mechanicId === 'gaze-check') {
      widget.dataset.blueprintGaze = frame.gazeState;
      widget.dataset.blueprintGazeHitId = frame.gazeHitId;
      widget.dataset.blueprintGazeLooking = String(frame.gazeLooking);
      widget.dataset.blueprintGazeFacing = String(Math.round(frame.playerFacing));
      widget.dataset.blueprintGazeHealth = String(frame.gazeHealth);
      widget.dataset.blueprintGazeApplicationCount = String(frame.gazeApplicationCount);
      widget.dataset.blueprintGazeFailure = String(frame.gazeFailure);
      widget.dataset.blueprintGazeRetry = String(frame.gazeRetry);
      if (gazeHealthLabel) gazeHealthLabel.textContent = String(frame.gazeHealth);
      if (gazeFacingLabel)
        gazeFacingLabel.textContent = frame.gazeVisible
          ? `${Math.round(frame.playerFacing)}° / ${Math.round(frame.gazeBearing)}°`
          : '';
    }
    if (mechanicId === 'proximity-damage') {
      widget.dataset.blueprintProximity = frame.proximityState;
      widget.dataset.blueprintProximityHitId = frame.proximityHitId;
      widget.dataset.blueprintProximityDistance = String(
        Math.round(frame.proximityCurrentDistance),
      );
      widget.dataset.blueprintProximityDamage = String(frame.proximityCurrentDamage);
      widget.dataset.blueprintProximityHealth = String(frame.proximityHealth);
      widget.dataset.blueprintProximityApplicationCount = String(frame.proximityApplicationCount);
      widget.dataset.blueprintProximityRetry = String(frame.proximityRetry);
      if (proximityHealthLabel) proximityHealthLabel.textContent = String(frame.proximityHealth);
      if (proximityReadout)
        proximityReadout.textContent = frame.proximityVisible
          ? `${Math.round(frame.proximityCurrentDistance)} → ${frame.proximityCurrentDamage}`
          : '';
    }
    if (mechanicId === 'tank-swap') {
      widget.dataset.blueprintTankSwap = frame.tankSwapState;
      widget.dataset.blueprintTankOwner = frame.tankSwapOwner;
      widget.dataset.blueprintTankHitId = frame.tankSwapHitId;
      widget.dataset.blueprintTankHealth = frame.tankSwapHealth.join(',');
      widget.dataset.blueprintTankVulnerability = frame.tankSwapVulnerability.join(',');
      widget.dataset.blueprintTankFailedDamage = String(frame.tankSwapFailedDamage);
      widget.dataset.blueprintTankApplicationCount = String(frame.tankSwapApplicationCount);
      widget.dataset.blueprintTankRetry = String(frame.tankSwapRetry);
      for (const label of tankHealthLabels)
        label.textContent = `${frame.tankSwapHealth[Number(label.dataset.blueprintTankHealth)]} / 100`;
    }
    if (mechanicId === 'debuff-handoff') {
      widget.dataset.blueprintHandoff = frame.debuffHandoffState;
      widget.dataset.blueprintHandoffOwner = frame.debuffHandoffOwner;
      widget.dataset.blueprintHandoffRemaining = frame.debuffHandoffRemaining.toFixed(2);
      widget.dataset.blueprintHandoffImmunity = frame.debuffHandoffImmunity.join(',');
      widget.dataset.blueprintHandoffTransferCount = String(frame.debuffHandoffTransferCount);
      widget.dataset.blueprintHandoffFailedDamage = String(frame.debuffHandoffFailedDamage);
      widget.dataset.blueprintHandoffRetry = String(frame.debuffHandoffRetry);
      if (handoffTimer)
        handoffTimer.textContent = frame.debuffHandoffVisible
          ? `${frame.debuffHandoffRemaining.toFixed(1)} s`
          : '';
    }
    if (mechanicId === 'ordered-targets') {
      widget.dataset.blueprintOrderState = frame.orderedTargetState;
      widget.dataset.blueprintOrderNext = String(frame.orderedTargetNext);
      widget.dataset.blueprintOrderResolved = String(frame.orderedTargetResolved);
      widget.dataset.blueprintOrderHitId = frame.orderedTargetHitId;
      widget.dataset.blueprintOrderRetry = String(frame.orderedTargetRetry);
      if (orderNext)
        orderNext.textContent = frame.orderedTargetNext
          ? `${frame.orderedTargetNext > 3 ? '✓' : frame.orderedTargetNext} / 3`
          : '';
      for (const mark of orderMarks) {
        const index = Number(mark.dataset.blueprintOrderMark);
        const position = frame.orderedTargetPositions[index];
        mark.setAttribute('x', String(position.x));
        mark.setAttribute('y', String(position.y - 62));
        mark.setAttribute('opacity', frame.orderedTargetNext ? '1' : '0');
      }
    }
    if (mechanicId === 'pairing-polarity') {
      widget.dataset.blueprintPolarityState = frame.pairingPolarityState;
      widget.dataset.blueprintPolaritySuccess = String(frame.pairingPolaritySuccess);
      widget.dataset.blueprintPolarityPairs = frame.pairingPolarityPairs
        .map((pair) => pair.join('+'))
        .join(',');
      widget.dataset.blueprintPolarityFailedDamage = String(frame.pairingPolarityFailedDamage);
      widget.dataset.blueprintPolarityRetry = String(frame.pairingPolarityRetry);
      for (const mark of polarityMarks) {
        const index = Number(mark.dataset.blueprintPolarityMark);
        const position = frame.pairingPolarityPositions[index];
        mark.setAttribute('x', String(position.x));
        mark.setAttribute('y', String(position.y - 62));
        mark.setAttribute('opacity', frame.pairingPolarityVisible ? '1' : '0');
      }
    }
    boss.setAttribute(
      'transform',
      `translate(${frame.boss.x} ${frame.boss.y})${frame.bossRotation ? ` rotate(${frame.bossRotation})` : ''} scale(${frame.bossScale})`,
    );
    boss.setAttribute('opacity', String(frame.bossVisible));
    if (decoy && frame.decoy) {
      decoy.setAttribute(
        'transform',
        `translate(${frame.decoy.x} ${frame.decoy.y})${frame.decoy.rotation ? ` rotate(${frame.decoy.rotation})` : ''}`,
      );
      decoy.setAttribute('opacity', String(frame.decoy.opacity));
      animateDecoy(
        frame.partnerMotion ?? frame.bossMotion,
        frame.partnerFacing ?? frame.bossFacing,
      );
    }
    player.setAttribute(
      'transform',
      `translate(${frame.player.x} ${frame.player.y})${frame.stackDamageFallAngle || frame.personalSpreadFallAngle || frame.towerSoakFallAngle || frame.entityTetherFallAngle || frame.gazeFallAngle || frame.proximityFallAngle ? ` rotate(${frame.stackDamageFallAngle || frame.personalSpreadFallAngle || frame.towerSoakFallAngle || frame.entityTetherFallAngle || frame.gazeFallAngle || frame.proximityFallAngle})` : ''}`,
    );
    for (const [index, ally] of allies.entries()) {
      const position = (frame.stackDamageAllies ??
        frame.personalSpreadPositions?.slice(1) ??
        frame.orderedTargetAllies ??
        frame.pairingPolarityAllies ?? [
          frame.towerSoakAlly ??
            frame.entityTetherAlly ??
            frame.tankSwapAlly ??
            frame.debuffHandoffAlly,
        ])[index];
      ally.setAttribute('transform', `translate(${position.x} ${position.y}) scale(.78)`);
      animateAllies[index](
        frame.stackDamageAllyMotion ??
          frame.personalSpreadAllyMotion ??
          frame.towerSoakAllyMotion ??
          frame.entityTetherAllyMotion ??
          frame.tankSwapAllyMotion ??
          frame.debuffHandoffAllyMotion ??
          frame.orderedTargetAlliesMotion ??
          frame.pairingPolarityAlliesMotion,
        frame.playerFacing,
      );
    }
    animateBoss(frame.bossMotion, frame.bossFacing);
    animateWideSwingWeapon(frame.wideSwingWeapon);
    animatePlayer(frame.playerMotion, frame.playerFacing);
    if (mechanicId === 'pacifist-resolution')
      playerWeapon?.setAttribute('opacity', frame.pacifistWeaponSheathed ? '0' : '1');
    if (mechanicId === 'encounter-specific-tool')
      playerWeapon?.setAttribute('opacity', frame.encounterToolEquipped ? '0' : '1');
    animateEffects(time, frame);
    bossLabel.setAttribute('x', frame.bossLabel.x);
    bossLabel.setAttribute('y', frame.bossLabel.y);
    bossLabel.setAttribute('opacity', String(frame.bossVisible));
    if (partnerLabel && frame.decoy) {
      partnerLabel.setAttribute('x', String(frame.decoy.x));
      partnerLabel.setAttribute('y', String(frame.decoy.y + 92));
      partnerLabel.setAttribute('opacity', String(frame.decoy.opacity));
    }
    playerLabel.setAttribute('x', frame.playerLabel.x);
    playerLabel.setAttribute('y', frame.playerLabel.y);
    primitives.forEach((primitive, index) => updatePrimitive(primitive, frame.primitives[index]));
    phaseName.textContent = config.phaseNames[frame.phase];
    phaseTooltip.textContent = config.phaseDescriptions[frame.phase];
    if (announcedPhase !== frame.phase) {
      status.textContent = config.phaseDescriptions[frame.phase];
      announcedPhase = frame.phase;
    }
    timeline.value = String(Math.round(time * 1000));
    timeline.setAttribute('aria-valuetext', config.phaseNames[frame.phase]);
    widget.style.setProperty('--blueprint-progress', `${(time / BLUEPRINT_DURATION) * 100}%`);
  }

  function setRunning(next) {
    running = next;
    widget.dataset.blueprintPlaying = String(next);
    cancelAnimationFrame(animationId);
    lastTimestamp = undefined;
    if (running) animationId = requestAnimationFrame(tick);
  }
  function tick(timestamp) {
    if (!running) return;
    if (lastTimestamp !== undefined)
      time = (time + (timestamp - lastTimestamp) / 1000) % BLUEPRINT_DURATION;
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
  widget.dataset.blueprintReady = 'true';
  render();
  applyMotionPreference();
}

for (const widget of document.querySelectorAll('[data-blueprint-demo]'))
  initializeBlueprint(widget);
