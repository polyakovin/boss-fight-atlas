import { escape } from './html.mjs';

/** One stone floor for full scenes and mechanic previews. */
export function renderEncounterArena(id, { width = 560, height = 960 } = {}) {
  const key = escape(id);
  const stones = Array.from({ length: Math.ceil(height / 68) }, (_, row) =>
    Array.from({ length: Math.ceil(width / 104) }, (_, column) => {
      const x = column * 104 - (row % 2) * 52;
      const y = row * 68;
      return `<rect x="${x + 3}" y="${y + 3}" width="98" height="62" rx="5" fill="${(row + column) % 3 === 0 ? '#354443' : '#2d3b3b'}" />`;
    }).join(''),
  ).join('');
  return /* HTML */ `<defs>
      <radialGradient id="encounter-light-${key}" cx="50%" cy="43%" r="68%">
        <stop offset="0" stop-color="#203b36" stop-opacity="0" />
        <stop offset="1" stop-color="#071315" stop-opacity=".92" />
      </radialGradient>
      <clipPath id="encounter-floor-${key}"
        ><rect width="${width}" height="${height}" rx="20"
      /></clipPath>
    </defs>
    <g aria-hidden="true" clip-path="url(#encounter-floor-${key})">
      <rect width="${width}" height="${height}" fill="#263434" />
      <g opacity=".65">${stones}</g>
      <rect width="${width}" height="${height}" fill="url(#encounter-light-${key})" />
    </g>`;
}

export function renderEncounterEffects() {
  return /* HTML */ `<g data-encounter-effects aria-hidden="true" pointer-events="none">
    ${['boss', 'player'].map((role) => `<g data-encounter-dust="${role}" fill="#c1b99a">${Array.from({ length: 10 }, () => '<ellipse rx="4" ry="2" opacity="0" />').join('')}</g>`).join('')}
    <g data-encounter-impact opacity="0" fill="none" stroke="#f9d3a1" stroke-linecap="round">
      <ellipse rx="52" ry="18" stroke-width="3" />
      <path
        d="M -23 -12 l -16 -14 M 23 -12 l 16 -14 M -39 1 l -22 -2 M 39 1 l 22 -2 M -26 14 l -14 9 M 26 14 l 14 9"
        stroke-width="4"
      />
    </g>
  </g>`;
}
