import { CHARACTER_ART } from './character-art.mjs';
import { SWEEP_WEAPON_ART } from './weapon-art.mjs';

// Same annular trail in lessons and catalog previews, with the blade at +28 degrees.
export const SWEEP_TRAIL_ART = /* HTML */ `<g data-sweep-trail>
  <path
    d="M 212 -132.5 A 250 250 0 0 1 220.7 117.4 L 158.9 84.5 A 180 180 0 0 0 152.6 -95.4 Z"
    fill="var(--signal)"
    fill-opacity=".12"
  />
  <path
    d="M 212 -132.5 A 250 250 0 0 1 220.7 117.4"
    fill="none"
    stroke="var(--signal)"
    stroke-width="10"
    stroke-opacity=".18"
  />
  <path
    d="M 212 -132.5 A 250 250 0 0 1 220.7 117.4"
    fill="none"
    stroke="#ffe5b8"
    stroke-width="3"
  />
</g>`;

function equipment(pose) {
  return /* HTML */ `<g data-sweep-equipment="front" visibility="visible">
    ${pose.arms.map((arm) => `<g fill="none" stroke-linejoin="round" stroke-linecap="round"><path data-sweep-arm-outline d="${arm.path}" stroke="#18272e" stroke-width="18"/><path data-sweep-arm d="${arm.path}" stroke="#637c86" stroke-width="12"/></g>`).join('')}
    <g data-sweep-shaft transform="${pose.shaftTransform}">${SWEEP_WEAPON_ART}</g>
    ${pose.arms.map((arm) => `<g data-sweep-hand transform="translate(${arm.hand.x} ${arm.hand.y}) rotate(${pose.angle})"><rect x="-6" y="-8" width="12" height="16" fill="#789099" stroke="#18272e" stroke-width="2.5"/><path d="M -3 -4 H 3 M -3 0 H 3" stroke="#b5c6bf" stroke-width="2"/></g>`).join('')}
  </g>`;
}

export function renderSweepBoss(pose) {
  // Reuse the same body; the equipment rig replaces only the two free arms.
  const body = CHARACTER_ART.kern.replace(
    /data-rig-part="arm-(back|front)"/g,
    '$& visibility="hidden"',
  );
  // The boss holds the shaft in front of its chest throughout the stroke. Keep
  // the grips above the body even when the cutting head travels up the arena.
  return `${body}${equipment(pose)}`;
}
