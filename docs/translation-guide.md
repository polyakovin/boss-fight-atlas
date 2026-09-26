# Translating the atlas

A correction to one locale is enough for a useful PR. You can work through GitHub’s editor or use the local preview described in [CONTRIBUTING.md](../CONTRIBUTING.md).

## Find the right file

| Content                                            | Path                                   |
| -------------------------------------------------- | -------------------------------------- |
| Shared navigation, headings, buttons, and feedback | `locales/<locale>.json`                |
| Lesson text, simulation labels, and descriptions   | `content/mechanics/<id>/<locale>.json` |
| Design-lens title and explanation                  | `content/lenses/<id>/<locale>.json`    |
| Language names, flags, and writing direction       | `locales/registry.json`                |
| Shared lesson metadata and source links            | `content/mechanics/<id>/meta.json`     |

English (`en`) is the source locale. Supported locales are `en`, `ru`, `zh-Hans`, `hi`, `bn`, `es`, `ar`, and `ja`. Every registry entry has a two-letter regional flag emoji used by all language selectors. Arabic has `dir: "rtl"`; the others have `dir: "ltr"`. Adding a ninth locale requires coordinated changes to validation, the registry, interface strings, and published lessons; it is separate from improving an existing translation.

Localized lesson titles should use the established term in each language. Keep **Boss Fight Atlas** as the brand name in every language.

## Preserve the contract

Translate displayed strings naturally, including SVG descriptions, control labels, and status messages. Keep UTF-8 text and ordinary JSON syntax: double quotes, no trailing commas, and no comments.

For animation phases, translate both the compact label and its tooltip as one pair. The Charge demo has three active phases and loops between attacks from opposite sides; its reduced-motion message should direct the reader to the timeline slider because there are no playback or phase buttons.

- Preserve keys, object structure, array lengths, and array order relative to the English source.
- Keep `sourceVersion` as an integer identifying the `meta.contentVersion` reflected by the text. Every published locale, including English, must match that version; update the number only after updating the translation’s meaning.
- Keep machine values such as `reviewStatus` in their defined English form. Do not translate IDs, locale codes, filenames, or URL paths.
- Keep a mechanic’s `overview` as one compact paragraph: define the behavior first, then explain why its signal, reachable response, and resulting opportunity work together.
- For a lens, translate `title` and the reusable `summary` while preserving its folder ID and metadata. The summary introduces the lens page, describes games in general, and must not assume a boss fight or one specific mechanic.
- In a mechanic’s `lensNotes`, preserve the IDs and order from `meta.lenses`. Translate each `body` as the short explanation shown in that mechanic’s tooltip.
- In an optional `combatFeel` section, translate the title, introduction, labels, tuning explanations, and connection explanations. Preserve each variant `id`, `connection.mechanicId`, and array order. Treat the labels as possible impressions, not facts about every use of the mechanic.
- In `examples`, preserve `dimension`, `game`, `boss`, `screenshot`, `screenshotSource`, `video`, and `videoDurationSeconds` exactly as in English. Translate only `body`.
- Do not add HTML, Markdown formatting, invisible direction overrides, or English filler to a text field.
- Use consistent terms for the mechanic, its phases, commitment, danger lane, and recovery. Prefer a natural explanation over an unclear borrowed term.

The builder's `builderConnections.randomNames` contains 32 boss-themed adjectives and 32 boss roles or creature nouns. Its `order` and `separator` form a natural two-part title in each language. Keep every word distinct within its list, use compatible grammatical forms for any pairing, and check a few generated names in the browser.

If the source contains an ambiguity, raise it in the PR instead of inventing a new rule in one language. A language-only correction should keep the underlying mechanic intact.

## Preserve the teaching

Keep the reader in the role of a game designer. Translate design questions, tuning checks, and implementation mistakes; do not turn them into instructions for beating the boss.

Design-lens pages define reusable ways to inspect a design; mechanic `lensNotes` explain how each lens appears in one mechanic. Keep both concrete and do not present the catalog as the only valid classification of game design concepts.

Game references should explain a design choice visible in the linked fight. Keep the focus on signals, commitment, danger geometry, the arena, or recovery instead of writing a walkthrough.

The initial Charge variant can follow the player while aiming, then fixes its direction. It cannot keep steering during the charge. The designer checks that ordinary sideways movement can move the whole collision shape out of the lane; neither a special dodge ability nor invulnerability is required.

Use only “boss” and “player.” Keep the example free of setting-specific roles and objects. If the boss blocks an attack, make the condition clear and leave another player response useful.

## Preview and validate

Run `npm run check` for structural validation and a fresh build. Use `npm run dev` to view the page; after subsequent edits, rebuild and refresh. Check the language’s mechanic catalog, lens catalog, affected lesson, lens page, and animation controls at desktop and mobile widths. Long translations should wrap naturally without hiding controls or clipping letters.

For Arabic, inspect the right-to-left page order, punctuation around numbers and the English brand, focus movement, and control labels. The Charge diagram deliberately keeps its spatial coordinates unchanged; surrounding text and controls follow the page direction. For Hindi and Bengali, check vowel signs and line height. For Chinese and Japanese, check line breaks and compact labels.

Try keyboard operation and reduced-motion mode when labels or shared UI change. Automated checks catch structural problems; they cannot certify fluency. If using GitHub’s editor only, state that you did not run local checks and let PR CI report its result.

## Review status

`reviewStatus: "needs-review"` means an independent fluent review is still needed. Machine-generated or assisted text starts in this state. Initial translations in this repository also start here.

Set a lesson or lens translation to `reviewed` only after a person other than its author who is fluent in the target language has checked the complete material against the current English meaning and the rendered page. Record the reviewer, reviewed locale, current `meta.contentVersion`, and review scope in the PR. The reviewer should explicitly state their language proficiency; do not infer it from their name, location, or automated tools. A native-speaker review claim additionally requires the reviewer to identify themselves as a native speaker.

Lesson review includes the animation text alternatives, controls, and terminology consistency; lens review includes the chip, tooltip, catalog card, and detail page. A maintainer can then confirm the status change. The interface files do not have a separate review-status field; document their review scope in the PR instead.

If you edit a previously reviewed translation, return it to `needs-review` unless the new wording has also received independent review. When source meaning changes, the content editor increments `meta.contentVersion`, updates published translations and their `sourceVersion`, and resets every locale to `needs-review`. A mismatched `sourceVersion` blocks publication; a matching number records source alignment, not language review. Typo-only source edits do not require a semantic version bump.

## A helpful translation PR

Name the locale and page, briefly explain the old wording and the improved meaning, and report the checks you ran. If review is requested, say so explicitly. A PR can improve one phrase while keeping `needs-review`; there is no requirement to certify a whole language before contributing.

Translations are contributed under [CC BY 4.0](../LICENSE-CONTENT.md), like the source lessons.
