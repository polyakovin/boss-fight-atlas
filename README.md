# Boss Fight Atlas

**Interactive pattern library for boss encounter designers.** Each lesson explains how to shape, communicate, tune, and test one part of a boss encounter.

[Explore the atlas](https://polyakovin.github.io/boss-fight-atlas/) · [Build a boss sketch](https://polyakovin.github.io/boss-fight-atlas/en/builder/) · [Contribute](CONTRIBUTING.md)

The atlas has **124 published mechanic lessons** from the research audit, each with an interactive animation, implementation guidance, design lenses, sources, and boss references. The **Boss builder** can combine any of the 124 mechanics, filter them by threat geometry, cue, player response, dimension, and design lens, and arrange them into phases and combinations. It suggests compatible mechanics and potential conflicts, can generate a random boss and name, and exports the sketch as JSON. Your draft stays in your browser.

Available in English, Russian, Simplified Chinese, Hindi, Bengali, Spanish, Arabic, and Japanese. Facts, design concepts, examples, and translations all welcome independent review.

## Make your first contribution

A single wording correction, factual check, concept review, or translation improvement is a useful PR. Open a lesson’s **Propose an edit on GitHub** link, edit its JSON on GitHub, and propose the change from your fork. Keep the keys and array order intact. You do not need to add a whole mechanic or translate all eight languages to contribute.

- [Contribution guide](CONTRIBUTING.md): small PRs, checks, and review.
- [Content guide](docs/content-guide.md): new mechanics, examples, animations, and sources.
- [Translation guide](docs/translation-guide.md): language files, terminology, and review status.
- [Audit of 124 boss mechanics](docs/research/boss-mechanics-audit.md): normalized terms, examples, and sources.
- [Report a content problem or suggest a mechanic](https://github.com/polyakovin/boss-fight-atlas/issues/new?template=content.yml).
- [Report or review a translation](https://github.com/polyakovin/boss-fight-atlas/issues/new?template=translation.yml).

## Run locally

Use **Node.js 24**, as recorded in `.node-version`, and npm.

```sh
npm ci
npm run dev
```

Open [localhost:4173/boss-fight-atlas/](http://localhost:4173/boss-fight-atlas/).

The development command builds once and serves `dist/`. After editing source files, run `npm run build` in another terminal and refresh the page. There is no automatic rebuild watcher.

```sh
npm run format:check
npm run check
npx playwright install chromium
npm run test:browser
```

`check` verifies repository hygiene, validates content, runs Node tests, and builds the static site. Browser tests cover the rendered experience; install Chromium once before running them. See [CONTRIBUTING.md](CONTRIBUTING.md) for what to inspect manually.

Use `npm run format` to apply the pinned Prettier formatting, or `npm run format:check` to check it without rewriting files.

## How it is built

This is a static Node generator with plain HTML, CSS, browser JavaScript modules, and original SVG illustrations. It has no frontend framework or application server in production. GitHub Pages serves the generated files.

Repository documentation, code, tests, and metadata use English. Translated text belongs in `locales/`, `content/mechanics-index-locales/`, and locale-specific lesson and lens JSON. The repository check rejects non-English text outside those locations and exact duplicate files.

| Location                               | Purpose                                                               |
| -------------------------------------- | --------------------------------------------------------------------- |
| `content/mechanics/<id>/meta.json`     | Publication state, content version, animation ID, and sources         |
| `content/mechanics/<id>/<locale>.json` | A complete lesson in one language                                     |
| `content/mechanics-index.json`         | Stable IDs, order, categories, and seed copy for catalog localization |
| `content/lenses/<id>/meta.json`        | Lens publication state, version, relationships, and sources           |
| `content/lenses/<id>/<locale>.json`    | A lens title and explanation in one language                          |
| `locales/*.json`                       | Shared interface translations and language registry                   |
| `schemas/`                             | JSON schemas checked before building                                  |
| `lib/animations.mjs`, `lib/*-view.mjs` | Registered lesson diagrams, catalog thumbnails, and browser assets    |
| `src/boss-builder*.mjs`                | Local draft state, portable JSON export, and builder behavior         |
| `src/`                                 | Browser behavior, styles, original SVG, and pure simulation models    |
| `scripts/`                             | Validation, generation, draft scaffolding, and local server           |
| `tests/`                               | Model and browser checks                                              |
| `dist/`                                | Generated output; not committed                                       |

The index is generated from the audit with `npm run sync:mechanics-index`; published lesson JSON provides the full public text. All 124 indexed mechanics are currently published. `npm run new:mechanic -- your-new-id` scaffolds an unpublished mechanic, and `npm run new:lens -- your-new-lens` scaffolds a lens. Publishing an additional mechanic also requires extending the audit and index generator. A draft can be published only after all eight lesson translations are complete, their `sourceVersion` values match `meta.contentVersion`, placeholders are resolved, and an animation is registered. Read the [content guide](docs/content-guide.md) before publishing.

After changing the mechanics audit and index generator, run `npm run sync:mechanics-index` to rebuild the inventory and its localized copy.

The default URL prefix is `/boss-fight-atlas/`. `lib/config.mjs` defines the repository, site origin, and base path. Forks that publish their own site should update those values for their destination; normal contribution forks do not need deployment credentials.

## Visitor analytics

The GitHub Pages workflow includes Cloudflare Web Analytics for this repository. The public beacon token is used only in the final production build; local builds and forks omit the beacon unless `CLOUDFLARE_WEB_ANALYTICS_TOKEN` is explicitly set. The redirect at `/boss-fight-atlas/` is excluded so it does not add a second page view before `/en/` loads.

## License

Text, translations, and original SVG illustrations are licensed under **[CC BY 4.0](LICENSE-CONTENT.md)**. Source code is licensed under **[MIT](LICENSE-CODE)**. Externally hosted game screenshots and linked third-party works retain their owners’ rights and are excluded from the atlas license; each screenshot links to its source. Please keep attribution when reusing or adapting the lessons.
