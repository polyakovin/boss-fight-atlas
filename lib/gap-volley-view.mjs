// Original projectile artwork shared by the lesson and its catalog preview.
// The leading point is +y; the model supplies the travel rotation.
export const VOLLEY_PROJECTILE_ART = /* HTML */ `<g data-volley-projectile-art>
  <path d="M 0 -34 L 8 0 L 0 11 L -8 0 Z" fill="var(--signal)" opacity=".24" />
  <circle r="10" fill="var(--signal)" opacity=".18" />
  <path d="M 0 -9 L 6 1 L 0 9 L -6 1 Z" fill="#ffe6bd" />
</g>`;

export function renderGapVolley(plan) {
  return /* HTML */ `<g data-volley-warning opacity="${plan.warningOpacity}">
      ${plan.lanes
        .map(
          (lane, index) => `<g data-volley-lane="${index}" opacity="${lane.occupied ? 1 : 0}">
            <path d="M ${lane.x} 260 V 870" fill="none" stroke="var(--signal)" stroke-opacity=".13" stroke-width="7" />
            <path d="M ${lane.x - 13} 252 L ${lane.x} 267 L ${lane.x + 13} 252 Z" fill="var(--signal)" fill-opacity=".45" />
          </g>`,
        )
        .join('')}
    </g>
    <rect
      data-volley-gap
      x="${plan.gap.x}"
      y="260"
      width="${plan.gap.width}"
      height="610"
      fill="var(--accent)"
      fill-opacity=".055"
      opacity="${plan.gap.opacity}"
    />
    <g data-pattern-projectiles>
      ${plan.projectiles
        .map(
          (projectile) =>
            `<g data-volley-projectile="${projectile.id}" transform="translate(${projectile.x} ${projectile.y}) rotate(${projectile.rotation})" opacity="${projectile.opacity}">${VOLLEY_PROJECTILE_ART}</g>`,
        )
        .join('')}
    </g>`;
}
