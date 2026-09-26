import { patternDuration, patternFrame, slamWavePath } from '../src/pattern-model.mjs';
import { CHARACTER_ART } from './character-art.mjs';
import { renderEncounterArena, renderEncounterEffects } from './encounter-view.mjs';
import { sweepWeaponPose } from '../src/sweep-weapon-model.mjs';
import { renderSweepBoss, SWEEP_TRAIL_ART } from './sweep-weapon-view.mjs';
import { gapVolleyPlan } from '../src/gap-volley-model.mjs';
import { renderGapVolley, VOLLEY_PROJECTILE_ART } from './gap-volley-view.mjs';
import { projectileFanPlan } from '../src/projectile-fan-model.mjs';
import { renderProjectileFan } from './projectile-fan-view.mjs';

const escape = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
  );
const json = (value) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

const sweepLayer = `<g data-pattern-sweep opacity="0">${SWEEP_TRAIL_ART}</g>`;
const slamLayer = /* HTML */ `<g data-pattern-slam opacity="0">
  <path data-pattern-slam-ring d="${slamWavePath(58)}" fill="var(--signal)" fill-opacity=".58" />
</g>`;
const summonLayer = /* HTML */ `<g data-pattern-summon opacity="0">
  <g
    fill="var(--signal)"
    fill-opacity=".09"
    stroke="var(--signal)"
    stroke-opacity=".5"
    stroke-width="2"
  >
    <ellipse cx="135" cy="465" rx="38" ry="14" /><ellipse
      cx="280"
      cy="515"
      rx="38"
      ry="14"
    /><ellipse cx="425" cy="465" rx="38" ry="14" />
  </g>
  ${[0, 1, 2].map((index) => `<g data-pattern-minion="${index}" opacity="0">${CHARACTER_ART.kern}</g>`).join('')}
</g>`;

export function renderPattern(demo, kind) {
  const id = `full-${kind}`;
  const initial = patternFrame(kind, 0);
  const volleyLayer = `<g data-pattern-volley opacity="${kind === 'gap-volley' ? 1 : 0}">${renderGapVolley(gapVolleyPlan(0))}</g>`;
  const fanLayer = `<g data-pattern-projectile-fan opacity="${kind === 'projectile-fan' ? 1 : 0}">${renderProjectileFan(projectileFanPlan(0))}</g>`;
  return /* HTML */ `<section
    class="pattern-demo"
    data-pattern-demo
    data-pattern-kind="${escape(kind)}"
    aria-label="${escape(demo.title)}"
  >
    <div class="pattern-demo__canvas">
      <div class="pattern-demo__scene-timeline">
        <span
          class="pattern-demo__phase-label"
          data-pattern-current-phase
          tabindex="0"
          aria-current="step"
          aria-describedby="pattern-phase-tooltip-${escape(kind)}"
          ><span data-pattern-phase-name>${escape(demo.phaseNames[0])}</span
          ><span
            class="pattern-demo__phase-tooltip"
            id="pattern-phase-tooltip-${escape(kind)}"
            data-pattern-phase-tooltip
            role="tooltip"
            >${escape(demo.phaseDescriptions[0])}</span
          ></span
        >
        <label class="pattern-demo__timeline"
          ><span class="pattern-demo__visually-hidden">${escape(demo.timeline)}</span
          ><input
            type="range"
            data-pattern-timeline
            min="0"
            max="${patternDuration(kind) * 1000}"
            step="10"
            value="0"
        /></label>
      </div>
      <svg
        class="pattern-demo__svg"
        data-pattern-svg
        viewBox="0 0 560 960"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="${escape(demo.diagramDescription)}"
        direction="ltr"
      >
        <title>${escape(demo.title)}</title>
        <desc>${escape(demo.diagramDescription)}</desc>
        ${renderEncounterArena(id, { minimal: kind === 'sweep' || kind === 'ground-slam' || kind === 'projectile-fan', quiet: kind === 'summon' || kind === 'gap-volley' })}${sweepLayer}${slamLayer}${summonLayer}${volleyLayer}${fanLayer}
        ${renderEncounterEffects()}
        <g data-pattern-boss transform="translate(${initial.boss.x} ${initial.boss.y})">
          ${kind === 'sweep' ? renderSweepBoss(initial.sweepWeapon) : CHARACTER_ART.kern}
        </g>
        <g data-pattern-player transform="translate(${initial.player.x} ${initial.player.y})">
          ${CHARACTER_ART.tavi}
        </g>
        <text
          data-pattern-boss-label
          x="${initial.bossLabel.x}"
          y="${initial.bossLabel.y}"
          text-anchor="middle"
          class="pattern-demo__entity-label"
        >
          ${escape(demo.boss)}
        </text>
        <text
          data-pattern-player-label
          x="${initial.player.x}"
          y="${initial.player.y - 62}"
          text-anchor="middle"
          class="pattern-demo__entity-label pattern-demo__entity-label--player"
        >
          ${escape(demo.player)}
        </text>
      </svg>
    </div>
    <p
      class="pattern-demo__visually-hidden"
      data-pattern-status
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      ${escape(demo.danger)}
    </p>
    <p class="pattern-demo__motion-note" data-pattern-motion-note hidden>
      ${escape(demo.reducedMotion)}
    </p>
    <script type="application/json" data-pattern-config>
      ${json(demo)}
    </script>
  </section>`;
}

export function renderPatternThumbnail(kind, id) {
  const layer =
    kind === 'sweep'
      ? `<g transform="translate(105 80) scale(.55) rotate(-28)">${SWEEP_TRAIL_ART}</g>`
      : kind === 'ground-slam'
        ? `<g transform="translate(105 80) scale(.55) translate(-280 -310)"><path d="${slamWavePath(112)}" fill="var(--signal)" fill-opacity=".52" /></g>`
        : kind === 'summon'
          ? `<g fill="var(--muted)" fill-opacity=".35"><ellipse cx="185" cy="79" rx="23" ry="8"/><ellipse cx="230" cy="106" rx="23" ry="8"/><ellipse cx="295" cy="74" rx="23" ry="8"/></g>${[
              [185, 74],
              [230, 101],
              [295, 69],
            ]
              .map(
                ([x, y]) =>
                  `<g data-character-art-preview="kern-summon" transform="translate(${x} ${y}) scale(.3)">${CHARACTER_ART.kern}</g>`,
              )
              .join('')}`
          : kind === 'projectile-fan'
            ? `${[
                [218, 56, -74],
                [232, 70, -82],
                [238, 88, -98],
                [223, 111, -111],
                [198, 132, -128],
                [190, 37, -56],
              ]
                .map(
                  ([x, y, rotation]) =>
                    `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(.7)">${VOLLEY_PROJECTILE_ART}</g>`,
                )
                .join('')}`
            : `<rect x="232" y="15" width="76" height="130" fill="var(--accent)" opacity=".12" />${[175, 205, 330].flatMap((x) => [32, 74, 116].map((y) => `<g transform="translate(${x} ${y}) scale(.8)">${VOLLEY_PROJECTILE_ART}</g>`)).join('')}`;
  return /* HTML */ `<svg viewBox="0 0 360 160" data-pattern-preview="${escape(kind)}">
    <defs>
      <pattern
        id="pattern-preview-${escape(id)}"
        width="24"
        height="24"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 24 0 L 0 0 0 24"
          fill="none"
          stroke="var(--diagram-preview-grid)"
          stroke-width="1"
        />
      </pattern>
    </defs>
    <rect
      width="360"
      height="160"
      fill="${kind === 'summon' || kind === 'gap-volley' ? '#203330' : ['sweep', 'ground-slam', 'projectile-fan'].includes(kind) ? '#263434' : `url(#pattern-preview-${escape(id)})`}"
    />
    ${layer}
    <g data-character-art-preview="kern" transform="translate(105 80) scale(.55)">
      ${kind === 'sweep' ? renderSweepBoss(sweepWeaponPose(0)) : CHARACTER_ART.kern}
    </g>
    <g data-character-art-preview="tavi" transform="translate(270 116) scale(.7)">
      ${CHARACTER_ART.tavi}
    </g>
  </svg>`;
}
