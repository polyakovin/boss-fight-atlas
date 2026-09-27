import { BOSS_LABEL_OFFSET_Y, DEFAULT_PLAN, DURATION } from '../src/charge-model.mjs';
import { CHARACTER_ART } from './character-art.mjs';
import { renderEncounterArena, renderEncounterEffects } from './encounter-view.mjs';

const escape = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
  );
const json = (value) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
const heartPath =
  'M 0 10 C -5 6 -13 0 -13 -6 C -13 -12 -5 -14 0 -8 C 5 -14 13 -12 13 -6 C 13 0 5 6 0 10 Z';
const renderHearts = (role) =>
  /* HTML */ `<g
    class="charge-demo__hearts charge-demo__hearts--${role}"
    data-charge-${role}-hearts
    opacity="0"
    aria-hidden="true"
    pointer-events="none"
  >
    ${Array.from(
      { length: 3 },
      (_, index) =>
        `<path class="charge-demo__heart" data-charge-heart data-full="true" transform="translate(${index * 31 - 31} 0)" d="${heartPath}" />`,
    ).join('')}
  </g>`;

/** All visible words come from the page's locale; this is useful without JS. */
export function renderCharge(demo) {
  return /* HTML */ `<section
    class="charge-demo"
    data-charge-demo
    aria-label="${escape(demo.title)}"
    tabindex="0"
  >
    <div class="charge-demo__canvas">
      <div class="charge-demo__scene-timeline">
        <span
          class="charge-demo__phase-label"
          data-charge-current-phase
          tabindex="0"
          aria-current="step"
          aria-describedby="charge-phase-tooltip"
          ><span data-charge-phase-name>${escape(demo.phaseNames[0])}</span
          ><span
            class="charge-demo__phase-tooltip"
            id="charge-phase-tooltip"
            data-charge-phase-tooltip
            role="tooltip"
            >${escape(demo.phaseDescriptions[0])}</span
          ></span
        >
        <label class="charge-demo__timeline"
          ><span class="charge-demo__visually-hidden">${escape(demo.timeline)}</span
          ><input
            type="range"
            data-charge-timeline
            min="0"
            max="${DURATION * 1000}"
            step="10"
            value="0"
        /></label>
      </div>
      <svg
        class="charge-demo__svg"
        data-charge-svg
        viewBox="0 0 560 960"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="${escape(demo.diagramDescription)}"
        direction="ltr"
      >
        <title>${escape(demo.title)}</title>
        <desc>${escape(demo.diagramDescription)}</desc>
        ${renderEncounterArena('charge')}
        <g
          data-charge-lane
          transform="translate(${DEFAULT_PLAN.origin.x} ${DEFAULT_PLAN.origin.y}) rotate(90)"
        >
          <rect
            x="0"
            y="-49"
            width="${DEFAULT_PLAN.distance}"
            height="98"
            fill="var(--signal)"
            fill-opacity=".18"
          />
          <path
            data-charge-gouges
            d="M 52 -34 L ${DEFAULT_PLAN.distance - 38} -34 L ${DEFAULT_PLAN.distance - 24} -27 L ${DEFAULT_PLAN.distance - 38} -20 L 52 -20 Z M 52 20 L ${DEFAULT_PLAN.distance - 38} 20 L ${DEFAULT_PLAN.distance - 24} 27 L ${DEFAULT_PLAN.distance - 38} 34 L 52 34 Z"
            fill="var(--signal)"
            fill-opacity=".17"
          />
        </g>
        <g data-charge-target transform="translate(280 480)" opacity=".8">
          <ellipse rx="29" ry="12" fill="var(--signal)" fill-opacity=".18" />
          <path
            d="M -26 1 L -13 -4 L -4 -2 L 3 -8 L 10 -1 L 24 2 L 10 3 L 2 9 L -7 4 L -17 7 Z"
            fill="var(--signal)"
            fill-opacity=".57"
          />
        </g>
        <g data-charge-dodge opacity="0" fill="var(--accent)" fill-opacity=".45">
          <ellipse cx="34" cy="-8" rx="7" ry="13" transform="rotate(38 34 -8)" />
          <ellipse cx="64" cy="8" rx="7" ry="13" transform="rotate(38 64 8)" />
          <ellipse cx="94" cy="-8" rx="7" ry="13" transform="rotate(38 94 -8)" />
        </g>
        ${renderEncounterEffects()}
        <circle
          data-charge-contact
          r="82"
          fill="var(--signal)"
          fill-opacity=".12"
          opacity="0"
          pointer-events="none"
        />
        <g data-charge-strike opacity="0" pointer-events="none">
          <path
            d="M -125 29 Q 0 -146 130 -25 Q 59 -97 -12 -82 Q -78 -63 -125 29 Z"
            fill="var(--accent)"
            fill-opacity=".7"
          />
        </g>
        <g data-charge-hit opacity="0" pointer-events="none">
          <path
            d="M -9 -47 L 2 -13 L 31 -31 L 14 -2 L 45 8 L 10 13 L 17 43 L -7 17 L -30 36 L -19 5 L -45 -11 L -12 -10 Z"
            fill="var(--signal)"
          />
        </g>
        <g
          data-charge-boss
          transform="translate(${DEFAULT_PLAN.origin.x} ${DEFAULT_PLAN.origin.y})"
        >
          ${CHARACTER_ART.kern}
        </g>
        <g data-charge-player transform="translate(280 480)">${CHARACTER_ART.tavi}</g>
        <text
          data-charge-boss-label
          x="280"
          y="${DEFAULT_PLAN.origin.y + BOSS_LABEL_OFFSET_Y}"
          text-anchor="middle"
          class="charge-demo__entity-label"
        >
          ${escape(demo.boss)}
        </text>
        <text
          data-charge-player-label
          x="280"
          y="418"
          text-anchor="middle"
          class="charge-demo__entity-label charge-demo__entity-label--player"
        >
          ${escape(demo.player)}
        </text>
        ${renderHearts('boss')} ${renderHearts('player')}
      </svg>
      <div class="charge-demo__joystick" data-charge-joystick aria-hidden="true" hidden>
        <span class="charge-demo__joystick-track"></span>
        <span class="charge-demo__joystick-handle" data-charge-joystick-handle></span>
      </div>
    </div>
    <p
      class="charge-demo__visually-hidden"
      data-charge-status
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      ${escape(demo.danger)}
    </p>
    <p class="charge-demo__motion-note" data-charge-motion-note hidden>
      ${escape(demo.reducedMotion)}
    </p>
    <script type="application/json" data-charge-config>
      ${json(demo)}
    </script>
  </section>`;
}

export function renderChargeThumbnail(id, { portrait = false } = {}) {
  if (portrait)
    return /* HTML */ `<svg viewBox="0 0 560 960">
      ${renderEncounterArena(`charge-preview-${id}`)}
      <path d="M 231 205 H 329 V 785 H 231 Z" fill="var(--signal)" fill-opacity=".2" />
      <g data-charge-preview-boss transform="translate(280 205)">${CHARACTER_ART.kern}</g>
      <g data-charge-preview-player transform="translate(410 480)">${CHARACTER_ART.tavi}</g>
    </svg>`;
  return /* HTML */ `<svg viewBox="0 0 360 160">
    ${renderEncounterArena(`charge-preview-${id}`, { width: 360, height: 160 })}
    <path d="M 0 58 H 360 V 102 H 0 Z" fill="var(--signal)" fill-opacity=".2" />
    <g data-charge-preview-boss transform="translate(90 86) scale(.62)">${CHARACTER_ART.kern}</g>
    <g data-charge-preview-player transform="translate(250 55) scale(.78)">${CHARACTER_ART.tavi}</g>
  </svg>`;
}
