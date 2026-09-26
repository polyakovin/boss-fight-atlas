import {
  slamStoneFacetPath,
  slamStoneChipPath,
  slamStonePath,
  slamStoneSeamPath,
  slamWavePath,
} from '../src/pattern-model.mjs';
import { CHARACTER_ART } from './character-art.mjs';

// The armored fist strikes the floor; the same fitted gauntlet appears in the preview.
export const SLAM_GAUNTLET_ART = /* HTML */ `<g
  data-slam-gauntlet
  stroke="#182c34"
  stroke-linejoin="round"
>
  <path
    d="M 32 -7 L 51 -13 L 69 -5 L 76 12 L 69 27 L 56 38 L 39 31 L 29 17 Z"
    fill="#425b64"
    stroke-width="3"
  />
  <path d="M 34 -5 L 51 -10 L 64 -5 L 57 7 L 38 9 Z" fill="#98acab" stroke="none" />
  <path d="M 38 11 L 56 7 L 69 14 L 63 26 L 56 33 L 40 27 Z" fill="#304a54" stroke="none" />
  <path d="M 53 13 L 63 12 L 68 20 L 60 28 L 51 25 L 47 19 Z" fill="#277c88" stroke-width="2" />
  <path d="M 53 15 L 62 14 L 64 20 L 58 25 L 52 22 Z" fill="#8ee7e4" stroke="none" />
  <path d="M 40 28 L 44 38 L 51 33 M 57 32 L 61 42 L 67 27" fill="#567078" stroke-width="3" />
</g>`;

export function renderGroundSlamBoss() {
  return CHARACTER_ART.kern.replace('<g data-equipment-slot="front-fist"></g>', SLAM_GAUNTLET_ART);
}

export function renderGroundSlamRidge(radius) {
  return /* HTML */ `<g data-ground-slam-ridge>
    <path
      data-pattern-slam-ring
      d="${slamWavePath(radius)}"
      fill="none"
      stroke="var(--signal)"
      stroke-opacity=".16"
      stroke-width="4"
      stroke-linejoin="round"
    />
    <path
      data-pattern-slam-shadow
      d="${slamStonePath(radius)}"
      transform="translate(0 6)"
      fill="#061718"
      fill-opacity=".55"
    />
    <path
      data-pattern-slam-chips
      d="${slamStoneChipPath(radius)}"
      fill="#344b4d"
      fill-opacity=".78"
      stroke="#152b2e"
      stroke-opacity=".6"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <path
      data-pattern-slam-stones
      d="${slamStonePath(radius)}"
      fill="#506563"
      stroke="#152b2e"
      stroke-width="2.5"
      stroke-linejoin="round"
    />
    <path
      data-pattern-slam-facets
      d="${slamStoneFacetPath(radius)}"
      fill="#a0b6ad"
      fill-opacity=".62"
    />
    <path
      data-pattern-slam-seams
      d="${slamStoneSeamPath(radius)}"
      fill="none"
      stroke="#8ee7e4"
      stroke-opacity=".62"
      stroke-width="2.5"
      stroke-linejoin="round"
    />
  </g>`;
}
