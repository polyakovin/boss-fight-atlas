# Boss Fight Atlas — working instructions

## Bootstrap and checks

- Resolve this repository’s Git root and inspect `git status` before editing. Preserve unrelated work and stage explicit task-owned paths only.
- Read `README.md`, `package.json`, `.node-version`, and the relevant content and schemas. Runtime: Node.js 24; static generator with plain browser modules and SVG.
- Setup: `npm ci`. Preview: `npm run dev` at `http://localhost:4173/boss-fight-atlas/`. Rebuild after edits with `npm run build`; no watcher is configured.
- Canonical gate: `npm run check`. Browser gate: `npx playwright install chromium`, then `npm run test:browser`. Report checks actually run and remaining blockers.
- Formatting: `npm run format` applies the pinned Prettier version; `npm run format:check` checks without rewriting. Inspect the diff after formatting.

## Boundaries

- Lessons: `content/mechanics/<id>/<locale>.json`; shared interface text: `locales/*.json`; metadata: each mechanic’s `meta.json`. Preserve schema contracts; the current template requires exactly three steps.
- `lib/animations.mjs` registers each adapter’s `render`, `thumbnail`, `styles`, and `scripts`. Keep simulation rules pure in `src/*-model.mjs`; browser controllers own DOM and playback.
- Before creating or changing animations, rigs, effects, or previews, read [docs/animation-guide.md](docs/animation-guide.md). Reuse the shared SVG rig and scene, animate articulated bodies on one deterministic timeline, and verify readable game motion, full-body clearance, and continuous loops in the browser.
- Keep localized text out of code, escape HTML and embedded JSON, preserve keyboard controls, text alternatives, static readability, Arabic RTL, and reduced-motion behavior.
- Catalog previews reuse the same character and object SVG assets as their full lesson animations; keep shared artwork in one source fragment instead of redrawing it.
- Maintain the semantic palette tokens and the body, display, and label font roles in `src/site.css`; check both themes and script-specific locale fonts when changing the visual system.
- Generated `dist/`, dependencies, browser reports, credentials, and `.env` stay out of Git. PR CI must remain safe for forks and must not expose deployment privileges to untrusted PR code.
- Keep documentation, code, tests, filenames, and metadata in English. Non-English text belongs only in explicit localization files. Avoid exact duplicate files; `npm run check:repo` enforces both rules.

## Content and publishing

- Read `docs/content-guide.md` and `docs/translation-guide.md` when editing lessons. `npm run new:mechanic -- slug` creates an unpublished draft; partial drafts can merge.
- Publishing requires complete lessons in `en`, `ru`, `zh-Hans`, `hi`, `bn`, `es`, `ar`, and `ja`, each with `sourceVersion === meta.contentVersion`, a registered animation, and no unresolved placeholders.
- Published lessons require at least three concrete boss examples, covering both 2D and 3D games, each with a verified YouTube behavior clip and a design observation. Prefer clips no longer than three minutes; longer videos require an exact `t=<seconds>s` timestamp at the mechanic. Preserve game names, boss names, dimensions, URLs, and `videoDurationSeconds` across translations.
- Published lessons require a separate design-lens section that connects the mechanic to reusable concepts without claiming a universal taxonomy. Lens pages describe games in general; boss-specific application belongs only in a mechanic's `lensNotes`. Preserve each `concepts[].id` and its order across translations.
- Meaning changes increment `meta.contentVersion`, synchronize published translations and their `sourceVersion` values, and reset all lesson `reviewStatus` values to `needs-review`. Never claim native or fluent review without an actual independent reviewer.
- Address game designers. Lessons explain how to build, tune, and test mechanics; they must not read like instructions for beating a boss.
- Treat review of facts, design concepts, terminology, examples, sources, and animation accuracy as first-class content work alongside translation review. Automated validation does not establish subject-matter correctness.
- Keep examples setting-neutral: use only “boss” and “player.” Preserve Charge’s fixed direction after aiming, sideways escape, full-body lane clearance, and useful recovery. If the boss blocks an attack, show it clearly and leave another response useful.
- Text, translations, and original SVG artwork use CC BY 4.0; implementation code uses MIT. Boss-reference cards may embed a clear externally hosted game screenshot when the card links to its source page and the screenshot remains outside the project license. Do not copy game screenshots, thumbnails, ripped assets, or logos into the repository. Cite sources accurately and distinguish illustrative examples from universal claims.
- Keep operational instructions concise; put editorial rationale and review guidance in `docs/`.
