# Contributing to Boss Fight Atlas

You can improve one sentence, verify a fact or design concept, review an example or translation, report a misleading animation, or build a new mechanic. A focused PR is welcome; opening an issue first is optional for small corrections.

## A small edit in your browser

1. Open a lesson or design-lens page and follow **Improve this page**, or find its file under `content/mechanics/<id>/<locale>.json` or `content/lenses/<id>/<locale>.json`.
2. Use GitHub’s edit button to create the change in your fork. For navigation, buttons, and shared labels, edit `locales/<locale>.json` instead.
3. Change the text while preserving JSON keys and array order. Do not paste HTML into a text field.
4. Open a PR describing the problem and your correction. Link supporting evidence for factual or conceptual changes. For translation work, name the language and whether independent fluent review has actually happened.

You do not need to run a local development environment for a wording-only PR. State that local checks were not run; the PR checks provide automated validation. A maintainer still reviews meaning and presentation.

## Work locally

Fork [the repository](https://github.com/polyakovin/boss-fight-atlas), clone your fork, then use Node.js 24:

```sh
git clone https://github.com/YOUR-USERNAME/boss-fight-atlas.git
cd boss-fight-atlas
git switch -c feature/your-change
npm ci
npm run dev
```

Browse [the local atlas](http://localhost:4173/boss-fight-atlas/). Run `npm run build` after source edits and refresh; `dev` does not watch files.

Before a PR, run:

```sh
npm run format:check
npm run check
npx playwright install chromium
npm run test:browser
```

Use `npm run format` to apply the pinned Prettier formatting, then inspect your diff. `format:check` checks formatting without rewriting files.

`check` verifies repository hygiene, runs schema/content validation and Node tests, and builds the static site. The Chromium install is a one-time setup. Browser tests are separate from `check`; report their result separately. If a command cannot run in your environment, include the exact blocker instead of marking it passed.

Commit only your source changes, push your branch to your fork, and open a PR against `polyakovin/boss-fight-atlas`. Do not commit `dist/`, `node_modules/`, test reports, secrets, or editor-specific files.

Keep documentation, code, tests, filenames, and metadata in English. Non-English text belongs only in JSON localization files under `locales/`, `content/mechanics-index-locales/`, and locale-specific lesson and lens paths. Do not add translated copies of repository documentation or byte-for-byte duplicate files; reuse or reference the English source instead.

## Choose the right scope

- **Translation correction:** edit the affected locale only. Follow the [translation guide](docs/translation-guide.md). You do not need to refresh unrelated languages when the source meaning is unchanged.
- **Content review:** check factual claims, design concepts, terminology, examples, source relevance, and whether the animation matches the explanation. Cite evidence and distinguish a documented rule from an illustrative design choice.
- **Meaning or mechanic change:** increment `meta.contentVersion`, update the source and published translations, set their `sourceVersion` to the version they now reflect, and reset each lesson’s `reviewStatus` to `needs-review`. Published lessons with a stale version are rejected. Explain the rule change in the PR.
- **New mechanic:** use `npm run new:mechanic -- your-mechanic` and follow the [content guide](docs/content-guide.md). A partial draft with `published: false` can merge before translations and animation are complete.
- **New design lens:** use `npm run new:lens -- your-lens`. Keep the explanation reusable across mechanics, then connect mechanics through their `meta.lenses` IDs.
- **Layout or interaction:** include screenshots or a short recording when useful, describe keyboard and mobile behavior, and add relevant regression coverage.

## Review the experience

For changes that affect rendering or interaction, check the affected lesson at a narrow mobile width and on desktop. Navigate with the keyboard, inspect focus visibility, try the language switcher, and play/pause and scrub the demo. For lens changes, check the title chip, keyboard tooltip, lens catalog, and lens page. Check Arabic right-to-left layout and reduced-motion mode when shared UI changes. Confirm that essential teaching content remains readable without JavaScript.

Keep labels and explanations available in text; color or animation alone must not carry a rule. A test pass does not establish factual accuracy, validate a design concept, establish translation fluency, or prove that an animation teaches the right mechanic.

## CI and publishing

Pull requests, including those from forks, run checks without deployment credentials or repository secrets. Do not change the contribution workflow to execute untrusted PR code with privileged credentials. Publishing is a maintainer action through the default-branch GitHub Pages workflow; opening a PR does not deploy a contributor’s branch.

The public site uses `/boss-fight-atlas/` as its URL prefix. Keep generated links, assets, and browser tests compatible with that subdirectory.

## Sources and licenses

Write original explanations and use original SVG teaching illustrations. Boss-reference cards may embed a clear externally hosted game screenshot when `screenshotSource` links to the page that published it. Do not copy screenshots, thumbnails, ripped sprites, logos, or article artwork into the repository. Embedded screenshots retain their owners’ rights and are excluded from the atlas’s CC BY license. Cite useful references in the mechanic’s `meta.sources` and distinguish documented claims from illustrative examples. Broader design articles are context, not proof that every game follows the same rule.

Published mechanics also include concrete 2D and 3D boss examples. Link to a focused YouTube clip of the behavior, preferably no longer than three minutes, and explain what it demonstrates for a designer. Every video URL must use `&t=<seconds>s` to open immediately before the exact attack, including short clips. Record the full length in `videoDurationSeconds`; do not use a speedrun merely because it is short. Keep screenshots externally hosted, do not upload video frames or thumbnails to the repository, and do not turn the explanation into a walkthrough.

By submitting work, you agree to contribute the text, translations, and original artwork under [CC BY 4.0](LICENSE-CONTENT.md), and source code under [MIT](LICENSE-CODE). Only submit material you are entitled to contribute. Existing third-party material retains its own license.
