import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { ROOT, loadContent, validateContent } from '../lib/content.mjs';
import { animations } from '../lib/animations.mjs';
import { renderBlueprint, renderBlueprintThumbnail } from '../lib/blueprint-view.mjs';
import { escape as e, jsonForHtml } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { renderLensVisual } from '../lib/lens-view.mjs';
import { link, canonical, REPOSITORY, AUTHOR } from '../lib/config.mjs';
import { loadPageHistory } from '../lib/page-history.mjs';
import { MECHANIC_TAXONOMY, createMechanicProfile } from '../src/mechanic-relations.mjs';
const {
  locales,
  ui,
  bossUpFramework,
  mechanicsIndex,
  mechanicsIndexLocales,
  mechanicsExamples,
  popularMechanics,
  mechanics,
  lenses,
} = await validateContent(await loadContent());
const pageHistory = await loadPageHistory(ROOT);
const published = mechanics.filter((m) => m.meta.published);
const mechanicsById = new Map(mechanics.map((mechanic) => [mechanic.meta.id, mechanic]));
const mechanicsExamplesById = new Map();
for (const example of mechanicsExamples.examples) {
  const entries = mechanicsExamplesById.get(example.mechanicId) ?? [];
  entries.push(example);
  mechanicsExamplesById.set(example.mechanicId, entries);
}
const popularProfilesById = new Map(
  popularMechanics.profiles.map((profile) => [profile.id, profile]),
);
const publishedLenses = lenses.filter((lens) => lens.meta.published);
const lensById = new Map(publishedLenses.map((lens) => [lens.meta.id, lens]));
for (const m of mechanics)
  if (m.meta.animation && !animations[m.meta.animation])
    throw new Error(`Unknown animation: ${m.meta.animation}`);
const out = path.join(ROOT, 'dist');
await fs.rm(out, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
await fs.mkdir(path.join(out, 'assets'), { recursive: true });
await fs.cp(path.join(ROOT, 'src'), path.join(out, 'assets'), { recursive: true });
await fs.writeFile(path.join(out, '.nojekyll'), '');
const assetVersions = new Map();
for (const entry of await fs.readdir(path.join(ROOT, 'src'), { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const source = await fs.readFile(path.join(ROOT, 'src', entry.name));
  assetVersions.set(entry.name, createHash('sha256').update(source).digest('hex').slice(0, 10));
}
function asset(name) {
  const version = assetVersions.get(name);
  if (!version) throw new Error(`Unknown asset: ${name}`);
  return `${link(`assets/${name}`)}?v=${version}`;
}
const urls = [];
async function write(route, html) {
  const dest = path.join(out, route, 'index.html');
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, html);
  urls.push(canonical(route));
}
function languages(active, localizedPath = '') {
  const current = locales.find((locale) => locale.code === active);
  return /* HTML */ `<details class="language-menu">
    <summary>
      <span class="language-flag" aria-hidden="true">${e(current.flag)}</span>
      <span>${e(current.name)}</span>
      ${icon('chevron-down', { className: 'icon--chevron' })}
    </summary>
    <nav aria-label="${e(ui[active].language)}">
      ${locales.map((l) => `<a href="${link(`${l.code}/${localizedPath}`)}" lang="${l.code}" hreflang="${l.code}" dir="${l.dir}"${l.code === active ? ' aria-current="page"' : ''}><span class="language-flag" aria-hidden="true">${e(l.flag)}</span><span>${e(l.name)}</span>${l.code === active ? `<span class="language-check">${icon('check')}</span>` : ''}</a>`).join('')}
    </nav>
  </details>`;
}
function themeButton(darkLabel, lightLabel) {
  return /* HTML */ `<button
    class="theme-toggle"
    type="button"
    data-theme-toggle
    data-label-dark="${e(darkLabel)}"
    data-label-light="${e(lightLabel)}"
    aria-label="${e(darkLabel)}"
    title="${e(darkLabel)}"
  >
    <span class="theme-toggle__icons" aria-hidden="true">
      ${icon('moon', { className: 'theme-toggle__moon' })}
      ${icon('sun', { className: 'theme-toggle__sun' })}
    </span>
  </button>`;
}
function logoMark(className = 'brand-mark') {
  return /* HTML */ `<svg
    class="${className}"
    viewBox="0 0 48 48"
    aria-hidden="true"
    focusable="false"
  >
    <path
      class="logo-mark__frame"
      d="M17 5h-6a6 6 0 0 0-6 6v6m26-12h6a6 6 0 0 1 6 6v6m0 14v6a6 6 0 0 1-6 6h-6M17 43h-6a6 6 0 0 1-6-6v-6"
    />
    <path
      class="logo-mark__boss"
      d="m12 16 7 3.5 5-7.5 5 7.5 7-3.5-2.5 15.5-5.4 5H19.9l-5.4-5L12 16Z"
    />
    <path class="logo-mark__eye" d="m24 22 4.5 4-4.5 4-4.5-4 4.5-4Z" />
    <path class="logo-mark__mouth" d="M21 33h6" />
  </svg>`;
}
const themeHead = /* HTML */ `<meta name="color-scheme" content="light dark" />
  <script>
    (() => {
      try {
        const saved = localStorage.getItem('boss-fight-atlas-theme');
        const theme =
          saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.dataset.theme = theme;
      } catch {}
    })();
  </script>`;
const analyticsToken = process.env.CLOUDFLARE_WEB_ANALYTICS_TOKEN?.trim();
const analyticsScript = analyticsToken
  ? /* HTML */ `<script
      type="module"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon="${e(JSON.stringify({ token: analyticsToken }))}"
    ></script>`
  : '';
const localeFontFamily = {
  'zh-Hans': 'Noto+Sans+SC',
  hi: 'Noto+Sans+Devanagari',
  bn: 'Noto+Sans+Bengali',
  ar: 'Noto+Sans+Arabic',
  ja: 'Noto+Sans+JP',
};
function fontHead(localeCode) {
  const families = [
    'family=IBM+Plex+Mono:wght@500;600',
    'family=Inter:wght@400;500;600;700',
    'family=Manrope:wght@500;600;700;800',
  ];
  const scriptFamily = localeFontFamily[localeCode];
  if (scriptFamily) families.push(`family=${scriptFamily}:wght@400;500;600;700`);
  const href = `https://fonts.googleapis.com/css2?${families.join('&amp;')}&amp;display=swap`;
  return /* HTML */ `<link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${href}" />`;
}
function shell(
  locale,
  title,
  description,
  body,
  {
    route: localizedPath = '',
    assets = [],
    catalog = false,
    lensesPage = false,
    builderPage = false,
    pageClass = '',
  } = {},
) {
  const t = ui[locale.code];
  const route = `${locale.code}/${localizedPath}`;
  const authorName = AUTHOR.name;
  const socialTitle = `${title} · Boss Fight Atlas — ${authorName}`;
  return /* HTML */ `<!doctype html>
    <html lang="${locale.code}" dir="${locale.dir}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        ${themeHead}
        <title>${e(title)} · Boss Fight Atlas</title>
        <meta name="description" content="${e(description)}" />
        <meta name="author" content="${authorName}" />
        <link rel="canonical" href="${canonical(route)}" />
        <link rel="author" href="${AUTHOR.github}" />
        ${locales.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${canonical(`${l.code}/${localizedPath}`)}">`).join('')}
        <link
          rel="alternate"
          hreflang="x-default"
          href="${canonical(`en/${localizedPath}`)}"
        />
        <meta property="og:site_name" content="Boss Fight Atlas · ${e(authorName)}" />
        <meta property="og:title" content="${e(socialTitle)}" />
        <meta property="og:description" content="${e(description)}" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="${canonical(route)}" />
        <meta property="article:author" content="${authorName}" />
        <meta name="twitter:title" content="${e(socialTitle)}" />
        ${fontHead(locale.code)}
        <link rel="icon" href="${asset('favicon.svg')}" type="image/svg+xml" />
        <link rel="stylesheet" href="${asset('site.css')}" />
        ${assets
          .filter((a) => a.endsWith('.css'))
          .map((a) => `<link rel="stylesheet" href="${asset(a)}">`)
          .join('')}
        <script type="module" src="${asset('site.mjs')}"></script>
        ${assets
          .filter((a) => a.endsWith('.mjs'))
          .map((a) => `<script type="module" src="${asset(a)}"></script>`)
          .join('')}
      </head>
      <body${catalog || pageClass ? ` class="${[catalog ? 'catalog-page' : '', pageClass].filter(Boolean).join(' ')}"` : ''}>
        <a class="skip-link" href="#main">${e(t.skip)}</a>
        <header class="site-header">
          <div class="header-inner">
            <a class="brand" href="${link(locale.code + '/')}" aria-label="Boss Fight Atlas"
              >${logoMark()}<span class="brand-wordmark">Boss Fight <b>Atlas</b></span></a
            >
            <nav class="header-nav" aria-label="${e(t.siteMapTitle)}">
              <a
                class="catalog-link"
                href="${link(`${locale.code}/#mechanics`)}"
                ${catalog ? ' aria-current="page"' : ''}
                >${e(t.catalog)}</a
              ><a
                class="lenses-link"
                href="${link(`${locale.code}/lenses/`)}"
                ${lensesPage ? ' aria-current="page"' : ''}
                >${e(t.concepts)}</a
              ><a
                class="builder-link"
                href="${link(`${locale.code}/builder/`)}"
                ${builderPage ? ' aria-current="page"' : ''}
                >${e(t.builder)}</a
              ><a class="contribute-link" href="${REPOSITORY}/blob/main/CONTRIBUTING.md"
                >${e(t.contribute)}${icon('external-link', { className: 'icon--external' })}</a
              >
            </nav>
            ${themeButton(t.themeDark, t.themeLight)}
            ${languages(locale.code, localizedPath)}
          </div>
        </header>
        ${body}
        <footer class="site-footer">
          <a
            class="brand footer-brand"
            href="${link(locale.code + '/')}"
            aria-label="Boss Fight Atlas"
          >${logoMark()}<span class="brand-wordmark">Boss Fight <b>Atlas</b></span></a
          >
          <div class="footer-copy">
            <p class="legal">
              <a href="${REPOSITORY}/blob/main/LICENSE-CONTENT.md">${e(t.license)}</a>
            </p>
          </div>
          <div class="footer-creator">
            <p class="footer-byline">
              ${e(t.createdBy)}
              <a href="${AUTHOR.github}">${e(AUTHOR.name)}</a>.
            </p>
            <nav class="footer-contacts" aria-label="${e(t.contactLinks)}">
              <a href="${link(`${locale.code}/about/`)}">${e(t.about)}</a>
              <a href="${AUTHOR.telegram}"
                >Telegram${icon('external-link', { className: 'icon--external' })}</a
              >
              <a href="${AUTHOR.linkedin}"
                >LinkedIn${icon('external-link', { className: 'icon--external' })}</a
              >
              <a href="${AUTHOR.email}">${e(t.contactEmail)}</a>
            </nav>
          </div>
          <a class="footer-repository" href="${REPOSITORY}"
            >GitHub${icon('external-link', { className: 'icon--external' })}</a
          >
        </footer>
        ${analyticsScript}
      </body>
    </html>`;
}
function checklistItems(items, group) {
  return items
    .map(
      (item, index) =>
        /* HTML */ `<li>
          <div class="checklist-item">
            <input
              class="checklist-checkbox"
              type="checkbox"
              value="${e(`${group}-${index}`)}"
              data-checklist-checkbox
              aria-label="${e(item.title)}"
            />
            <details>
              <summary>
                <span>${e(item.title)}</span>
                <span class="checklist-toggle">${icon('plus')}</span>
              </summary>
              <p>${e(item.body)}</p>
            </details>
          </div>
        </li>`,
    )
    .join('');
}
function lensChips(localeCode, ids, notes, contentLocale = localeCode) {
  const t = ui[localeCode];
  const notesById = new Map(notes.map((note) => [note.id, note.body]));
  return /* HTML */ `<nav class="lens-chips" aria-label="${e(t.mechanicLenses)}">
    ${ids
      .map((id) => {
        const lens = lensById.get(id);
        if (!lens) throw new Error(`Unknown published lens: ${id}`);
        const content = lens.translations[contentLocale];
        const note = notesById.get(id);
        if (!note) throw new Error(`Missing ${localeCode} lens note: ${id}`);
        const tooltipId = `lens-tooltip-${id}`;
        return /* HTML */ `<a
          class="lens-chip"
          href="${link(`${localeCode}/lenses/${id}/`)}"
          aria-describedby="${tooltipId}"
          ><span>${e(content.title)}</span
          ><span id="${tooltipId}" class="lens-chip__tooltip" role="tooltip">${e(note)}</span></a
        >`;
      })
      .join('')}
  </nav>`;
}
function exampleCards(items, t) {
  return items
    .map(
      (item) =>
        /* HTML */ `<article
          class="game-example"
          data-screenshot-source="${e(item.screenshotSource)}"
        >
          <a
            class="game-example__link"
            href="${e(item.video)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="visually-hidden">${e(t.watchVideo)}: </span>
            <figure class="game-example__media">
              <span class="game-example__dimension">${e(item.dimension)}</span>
              <span class="game-example__action">${icon('play')}</span>
              <img
                src="${e(item.screenshot)}"
                alt="${e(`${item.boss} — ${item.game}`)}"
                loading="lazy"
                decoding="async"
                referrerpolicy="no-referrer"
              />
            </figure>
            <div class="game-example__body">
              <div class="game-example__title">
                <h4>${e(item.boss)}</h4>
                <span class="game-example__game">${e(item.game)}</span>
              </div>
              <p>${e(item.body)}</p>
            </div>
          </a>
        </article>`,
    )
    .join('');
}
function mechanicBuilderAction(locale, t, mechanicId) {
  return /* HTML */ `<div
    class="mechanic-builder-action"
    data-mechanic-builder-action
    data-mechanic-id="${e(mechanicId)}"
    data-saved-label="${e(t.builderSaved)}"
    lang="${locale.code}"
    dir="${locale.dir}"
  >
    <label class="mechanic-builder-action__toggle">
      <input type="checkbox" data-mechanic-builder-toggle />
      <span class="mechanic-builder-action__check" aria-hidden="true">${icon('check')}</span>
      <span>${e(t.builderUseMechanic)}</span>
    </label>
    <a href="${link(`${locale.code}/builder/`)}">
      ${e(t.builderOpen)}${icon('arrow-right', { className: 'icon--directional' })}
    </a>
    <span
      class="visually-hidden"
      role="status"
      aria-live="polite"
      data-mechanic-builder-status
    ></span>
  </div>`;
}
function lastUpdated(locale, t, history) {
  if (!history) throw new Error('Missing Git history for page update date.');
  const date = new Intl.DateTimeFormat(locale.code, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${history.date}T00:00:00Z`));
  return /* HTML */ `<div class="page-updated">
    ${e(t.lastUpdated)}
    <a href="${REPOSITORY}/commit/${history.hash}">
      <time datetime="${history.date}">${e(date)}</time>
      ${icon('external-link', { className: 'icon--external' })}
    </a>
  </div>`;
}
function mechanicHistory(mechanicId, contentLocale) {
  return (
    pageHistory.latest([
      `content/mechanics/${mechanicId}/meta.json`,
      `content/mechanics/${mechanicId}/${contentLocale}.json`,
    ]) ??
    pageHistory.latest([
      'content/mechanics-index.json',
      `content/mechanics-index-locales/${contentLocale}.json`,
    ])
  );
}
function lensHistory(lensId, localeCode) {
  return pageHistory.latest([
    `content/lenses/${lensId}/meta.json`,
    `content/lenses/${lensId}/${localeCode}.json`,
  ]);
}
function renderCombatFeel(localeCode, content) {
  if (!content.combatFeel) return '';
  const feel = content.combatFeel;
  return /* HTML */ `<section
    id="combat-feel"
    class="content-section combat-feel"
    aria-labelledby="combat-feel-title"
  >
    <h2 id="combat-feel-title">${e(feel.title)}</h2>
    <p class="combat-feel__intro">${e(feel.intro)}</p>
    <div class="combat-feel__grid">
      ${feel.variants
        .map((variant) => {
          const target = mechanicsById.get(variant.connection.mechanicId);
          const title = target.translations[localeCode]?.title ?? target.translations.en.title;
          return /* HTML */ `<article class="combat-feel__card">
            <h3><span class="combat-feel__tag">${e(variant.label)}</span></h3>
            <p>${e(variant.tuning)}</p>
            <p class="combat-feel__connection">
              <a href="${link(`${localeCode}/mechanics/${target.meta.id}/`)}"
                >${e(title)}${icon('arrow-right', { className: 'icon--directional' })}</a
              >
              <span>${e(variant.connection.body)}</span>
            </p>
          </article>`;
        })
        .join('')}
    </div>
  </section>`;
}
function renderLessonBody(
  locale,
  t,
  mechanic,
  content,
  animation,
  { isWip = false, contentLocale = locale.code, catalogEntry, history } = {},
) {
  const fallbackAttributes =
    contentLocale === locale.code ? '' : ` lang="${contentLocale}" dir="ltr"`;
  return /* HTML */ `<div class="lesson-layout${isWip ? ' lesson-layout--wip' : ''}">
    <main id="main" class="lesson-main" ${fallbackAttributes}>
      <div class="lesson-overview-grid">
        <section id="overview" class="lesson-hero">
          <div class="lesson-title-line">
            <h1>${e(content.title)}</h1>
            ${isWip ? '<span class="wip-badge">WIP</span>' : ''}
            <a
              class="eyebrow lesson-category"
              href="${link(`${locale.code}/#${catalogEntry.catalogSectionId}`)}"
              >${e(catalogEntry.category)}</a
            >
            ${lensChips(locale.code, mechanic.meta.lenses, content.lensNotes, contentLocale)}
          </div>
          <p class="mechanic-overview">${e(content.overview)}</p>
          ${mechanicBuilderAction(locale, t, mechanic.meta.id)}
        </section>
        <div id="simulation" class="simulation-section">${animation.render(content.demo)}</div>
        <section
          class="implementation-checklist"
          aria-labelledby="implementation-checklist-title"
          data-checklist-id="${e(mechanic.meta.id)}"
        >
          <div class="implementation-checklist__intro">
            <h2 id="implementation-checklist-title">${e(t.implementationChecklist)}</h2>
            <p>${e(content.learning)}</p>
            <button type="button" class="checklist-reset" data-checklist-reset disabled>
              ${icon('rotate-ccw')}${e(t.checklistReset)}
            </button>
          </div>
          <div class="implementation-checklist__groups">
            <section class="checklist-group" aria-labelledby="core-checks-title">
              <span class="eyebrow">${e(t.playbook)}</span>
              <h3 id="core-checks-title">${e(t.stepsTitle)}</h3>
              <ul class="checklist-items">
                ${checklistItems(content.steps, 'steps')}
              </ul>
              <h4>${e(t.mistakesTitle)}</h4>
              <ul class="checklist-items checklist-items--mistakes">
                ${checklistItems(content.mistakes, 'mistakes')}
              </ul>
            </section>
            <section class="checklist-group" aria-labelledby="tuning-title">
              <span class="eyebrow">${e(t.design)}</span>
              <h3 id="tuning-title">${e(t.designerTitle)}</h3>
              <ul class="checklist-items">
                ${checklistItems(content.designNotes, 'design')}
              </ul>
              <h4>${e(t.storyTitle)}</h4>
              <ul class="checklist-items">
                ${checklistItems([content.story], 'story')}
              </ul>
              <h4>${e(t.adaptTitle)}</h4>
              <ul class="checklist-items">
                ${checklistItems([content.adaptation], 'adaptation')}
              </ul>
              <h4>${e(t.relatedTitle)}</h4>
              <ul class="checklist-items">
                ${checklistItems([content.distinction], 'distinction')}
              </ul>
            </section>
          </div>
        </section>
      </div>
      ${renderCombatFeel(locale.code, content)}
      <section id="examples" class="content-section examples-section">
        <h2>${e(t.examplesTitle)}</h2>
        <div class="example-grid">${exampleCards(content.examples, t)}</div>
      </section>
      <section id="sources" class="content-section sources">
        <h2>${e(t.sources)}</h2>
        <ul>
          ${mechanic.meta.sources.map((source) => `<li><a href="${e(source.url)}">${e(source.title)}${icon('external-link', { className: 'icon--external' })}</a></li>`).join('')}
        </ul>
        <p class="review-note">
          ${e(t.reviewNote)}
          <a
            href="${REPOSITORY}/edit/main/content/mechanics/${mechanic.meta.id}/${contentLocale}.json"
            >${icon('square-pen')}${e(t.edit)}</a
          >
        </p>
      </section>
      ${lastUpdated(locale, t, history)}
    </main>
  </div>`;
}
function mechanicThumbnail(entry, id, options) {
  if (entry.mechanic?.meta.animation)
    return animations[entry.mechanic.meta.animation].thumbnail(id, options);
  if (entry.profile) return renderBlueprintThumbnail(entry.id, id, options);
  return '<span>WIP</span>';
}
function draftExampleSection(items, locale, t) {
  if (items.length === 0) return '';
  const fallbackAttributes =
    locale.code === 'ru' || locale.code === 'en' ? '' : ' lang="en" dir="ltr"';
  const cards = items
    .map((item) => {
      const copy = item.translations[locale.code] ?? item.translations.en;
      const videoLink =
        item.videoUrl && item.videoUrl !== item.sourceUrl
          ? `<a href="${e(item.videoUrl)}" target="_blank" rel="noopener noreferrer">${e(t.watchVideo)}${icon('external-link', { className: 'icon--external' })}</a>`
          : '';
      return /* HTML */ `<article class="wip-example-card" ${fallbackAttributes}>
        <span class="eyebrow">${e(copy.kind)}</span>
        <h3>${e(item.encounter)}</h3>
        <p class="wip-example-card__game">${e(item.game)}</p>
        <p>${e(copy.observation)}</p>
        <footer>
          <a
            href="${e(item.sourceUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="${e(`${t.sources}: ${item.sourceTitle}`)}"
            >${e(t.sources)}${icon('external-link', { className: 'icon--external' })}</a
          >
          ${videoLink}
        </footer>
      </article>`;
    })
    .join('');
  return /* HTML */ `<section class="wip-examples" aria-labelledby="ori-examples-title">
    <header>
      <span class="eyebrow">Ori</span>
      <h2 id="ori-examples-title">${e(t.examplesTitle)}</h2>
    </header>
    <div class="wip-example-grid">${cards}</div>
  </section>`;
}
function draftProfileSection(profile, locale) {
  if (!profile) return '';
  const copy = profile.translations[locale.code] ?? profile.translations.en;
  const labels = popularMechanics.ui[locale.code] ?? popularMechanics.ui.en;
  const fallbackAttributes =
    locale.code === 'ru' || locale.code === 'en' ? '' : ' lang="en" dir="ltr"';
  const cards = [
    [labels.signalTitle, copy.signal],
    [labels.responseTitle, copy.response],
    [labels.recoveryTitle, copy.recovery],
    [labels.tuningTitle, copy.tuning],
    [labels.pitfallTitle, copy.pitfall],
    [labels.escalationTitle, copy.escalation],
  ];
  return /* HTML */ `<section
    class="draft-profile"
    aria-labelledby="draft-profile-title"
    ${fallbackAttributes}
  >
    <header class="draft-profile__header">
      <h2 id="draft-profile-title">${e(labels.blueprintTitle)}</h2>
      <p>${e(copy.overview)}</p>
    </header>
    <div class="draft-profile__grid">
      ${cards
        .map(
          ([title, body], index) =>
            /* HTML */ `<article class="draft-profile__card">
              <span aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
              <h3>${e(title)}</h3>
              <p>${e(body)}</p>
            </article>`,
        )
        .join('')}
    </div>
  </section>`;
}
function draftAnimationSection(entry, locale) {
  if (!entry.profile) return '';
  const copy = entry.profile.translations[locale.code] ?? entry.profile.translations.en;
  const labels = popularMechanics.ui[locale.code] ?? popularMechanics.ui.en;
  const fallbackAttributes =
    locale.code === 'ru' || locale.code === 'en' ? '' : ' lang="en" dir="ltr"';
  const demo = {
    title: `${entry.title}: ${labels.animationTitle}`,
    timeline: labels.timeline,
    phaseNames: [labels.signalTitle, labels.responseTitle, labels.recoveryTitle],
    phaseDescriptions: [copy.signal, `${copy.overview} ${copy.response}`, copy.recovery],
    boss: labels.boss,
    player: labels.player,
    reducedMotion: labels.reducedMotion,
    diagramDescription: labels.diagramDescription.replace('{title}', entry.title),
    fallbackAttributes,
  };
  return /* HTML */ `<section class="wip-blueprint-animation" ${fallbackAttributes}>
    <header>
      <h2>${e(labels.animationTitle)}</h2>
    </header>
    ${renderBlueprint(demo, entry.id)}
  </section>`;
}
function renderLensCards(localeCode, t) {
  return publishedLenses
    .map((lens) => {
      const content = lens.translations[localeCode];
      const mechanicCount = published.filter((mechanic) =>
        mechanic.meta.lenses.includes(lens.meta.id),
      ).length;
      return /* HTML */ `<a
        class="lens-card"
        href="${link(`${localeCode}/lenses/${lens.meta.id}/`)}"
      >
        ${renderLensVisual(lens.meta.id, content, { compact: true })}
        <h2>${e(content.title)} ${icon('arrow-right', { className: 'icon--directional' })}</h2>
        <p>${e(content.summary)}</p>
        <span class="lens-card__count">${e(t.lensMechanicsTitle)} · ${mechanicCount}</span>
      </a>`;
    })
    .join('');
}
function renderAbout(locale, t) {
  const story = t.aboutStory;
  const formatAboutText = (text) =>
    text
      .replaceAll('{count}', String(mechanicsIndex.mechanics.length))
      .replaceAll('{localeCount}', String(locales.length));
  const atlasBody = formatAboutText(story.atlasBody);
  const communityBody = formatAboutText(story.communityBody);
  const bossBriefExample = JSON.stringify(
    {
      name: 'Gatekeeper',
      phases: [
        {
          goal: 'teach-sideways-escape',
          mechanics: ['charge', 'ground-slam'],
        },
        {
          goal: 'combine-space-and-timing',
          mechanics: ['arc-sweep', 'gap-volley'],
        },
      ],
    },
    null,
    2,
  );
  const principles = [
    [t.aboutResearchTitle, t.aboutResearchBody],
    [t.aboutModelsTitle, t.aboutModelsBody],
    [t.aboutReviewTitle, formatAboutText(t.aboutReviewBody)],
    [t.aboutOpenTitle, t.aboutOpenBody],
  ];
  return /* HTML */ `<main id="main" class="about-main">
    <article class="about-page">
      <header class="about-hero">
        <h1>${e(t.aboutTitle)}</h1>
        <p>${e(t.aboutIntro)}</p>
      </header>
      <section class="about-motivation" aria-labelledby="about-motivation-title">
        <h2 id="about-motivation-title">${e(t.aboutMotivationTitle)}</h2>
        <div class="about-story__copy">
          <p>${e(t.aboutMotivationBody)}</p>
          <p>${e(atlasBody)}</p>
          <p>${e(communityBody)}</p>
          <div class="about-story__actions">
            <a href="${REPOSITORY}/blob/main/CONTRIBUTING.md"
              >${e(t.contribute)}${icon('external-link', { className: 'icon--external' })}</a
            >
            <a href="${REPOSITORY}/issues/new?template=content.yml"
              >${e(story.feedbackLabel)}${icon('external-link', { className: 'icon--external' })}</a
            >
          </div>
        </div>
      </section>
      <section class="about-prototype" aria-labelledby="about-prototype-title">
        <header>
          <h2 id="about-prototype-title">${e(story.prototypeTitle)}</h2>
          <p>${e(story.prototypeIntro)}</p>
        </header>
        <div class="about-prototype__comparison">
          <article class="about-prototype__before">
            <span class="eyebrow">${e(story.beforeLabel)}</span>
            <blockquote>${e(story.beforeText)}</blockquote>
          </article>
          <article class="about-prototype__after">
            <span class="eyebrow">${e(story.afterLabel)}</span>
            <pre><code>${e(bossBriefExample)}</code></pre>
          </article>
        </div>
        <footer>
          <p>${e(story.prototypeNote)}</p>
          <a href="${link(`${locale.code}/builder/`)}"
            >${e(t.builder)}${icon('arrow-right', { className: 'icon--directional' })}</a
          >
        </footer>
      </section>
      <section class="about-resources" aria-labelledby="about-resources-title">
        <div>
          <h2 id="about-resources-title">${e(story.alternativesTitle)}</h2>
          <p>${e(story.alternativesBody)}</p>
        </div>
        <nav aria-label="${e(story.alternativesTitle)}">
          <a href="https://gamemechanics.org/" target="_blank" rel="noopener noreferrer"
            >Game Mechanics${icon('external-link', { className: 'icon--external' })}</a
          >
          <a href="https://steammaho.com/mechanics" target="_blank" rel="noopener noreferrer"
            >SteamMaho${icon('external-link', { className: 'icon--external' })}</a
          >
          <a
            href="https://www.jenova.ai/en/resources/ai-boss-fight-generator"
            target="_blank"
            rel="noopener noreferrer"
            >Jenova AI Boss Fight
            Generator${icon('external-link', {
              className: 'icon--external',
            })}</a
          >
        </nav>
      </section>
      <section class="about-approach" aria-labelledby="about-approach-title">
        <header>
          <h2 id="about-approach-title">${e(t.aboutApproachTitle)}</h2>
        </header>
        <div class="about-principles">
          ${principles
            .map(
              ([title, body], index) =>
                /* HTML */ `<article class="about-principle">
                  <span aria-hidden="true">0${index + 1}</span>
                  <h3>${e(title)}</h3>
                  <p>${e(body)}</p>
                </article>`,
            )
            .join('')}
        </div>
        <p class="about-analytics-note">${e(t.aboutAnalyticsNotice)}</p>
      </section>
      <section class="about-contact" aria-labelledby="about-contact-title">
        <div>
          <h2 id="about-contact-title">${e(t.aboutContactTitle)}</h2>
          <p>${e(t.aboutContactBody)}</p>
        </div>
        <nav class="about-contact__links" aria-label="${e(t.contactLinks)}">
          <a href="${AUTHOR.github}"
            >GitHub${icon('external-link', { className: 'icon--external' })}</a
          >
          <a href="${AUTHOR.website}"
            >${e(t.contactWebsite)}${icon('external-link', { className: 'icon--external' })}</a
          >
          <a href="${AUTHOR.telegram}"
            >Telegram${icon('external-link', { className: 'icon--external' })}</a
          >
          <a href="${AUTHOR.linkedin}"
            >LinkedIn${icon('external-link', { className: 'icon--external' })}</a
          >
          <a href="${AUTHOR.email}">${e(t.contactEmail)}</a>
        </nav>
      </section>
    </article>
  </main>`;
}
for (const locale of locales) {
  const t = ui[locale.code];
  await write(
    `${locale.code}/about/`,
    shell(locale, t.aboutTitle, t.aboutDescription, renderAbout(locale, t), {
      route: 'about/',
      pageClass: 'about-page-body',
    }),
  );
  const catalogEntries = mechanicsIndex.mechanics.map((outline) => {
    const mechanic = mechanicsById.get(outline.id);
    const outlineContent = outline.translations[locale.code] ?? outline.translations.en;
    const categoryKey = outline.translations.en.category;
    const lesson = mechanic?.translations[locale.code];
    return {
      id: outline.id,
      number: outline.number,
      category: mechanicsIndexLocales[locale.code].categories[categoryKey],
      categoryKey,
      title: lesson?.title ?? outlineContent.title,
      summary: lesson?.summary ?? outlineContent.summary,
      mechanic,
      examples: mechanicsExamplesById.get(outline.id) ?? [],
      profile: popularProfilesById.get(outline.id) ?? null,
      connectionProfile: createMechanicProfile({
        id: outline.id,
        category: outline.translations.en.category,
        lenses: mechanic?.meta.lenses ?? [],
      }),
      isWip: !mechanic?.meta.published,
    };
  });
  const catalogParts = [];
  const partsByCategory = new Map();
  for (const entry of catalogEntries) {
    let part = partsByCategory.get(entry.category);
    if (!part) {
      part = {
        id: `catalog-part-${catalogParts.length + 1}`,
        category: entry.category,
        mechanics: [],
      };
      partsByCategory.set(entry.category, part);
      catalogParts.push(part);
    }
    entry.catalogSectionId = part.id;
    part.mechanics.push(entry);
  }
  const catalogEntriesById = new Map(catalogEntries.map((entry) => [entry.id, entry]));
  const catalogNavigation = catalogParts
    .map(
      (part, index) =>
        /* HTML */ `<a class="catalog-part-nav__link" href="#${part.id}">
          <span class="catalog-part-nav__number">${String(index + 1).padStart(2, '0')}</span>
          <strong>${e(part.category)}</strong>
        </a>`,
    )
    .join('');
  const catalogSections = catalogParts
    .map(
      (part, partIndex) =>
        /* HTML */ `<section
          class="catalog-part"
          id="${part.id}"
          aria-labelledby="${part.id}-title"
        >
          <header class="catalog-part__header">
            <span class="catalog-part__number">${String(partIndex + 1).padStart(2, '0')}</span>
            <h3 id="${part.id}-title">${e(part.category)}</h3>
          </header>
          <ol class="catalog-lessons">
            ${part.mechanics
              .map(
                (entry, mechanicIndex) =>
                  /* HTML */ `<li>
                    <a
                      class="catalog-lesson${entry.isWip ? ' catalog-lesson--wip' : ''}"
                      href="${link(`${locale.code}/mechanics/${entry.id}/`)}"
                    >
                      <span class="catalog-lesson__number"
                        >${partIndex + 1}.${mechanicIndex + 1}</span
                      >
                      <span class="catalog-lesson__copy">
                        <span class="catalog-lesson__title">
                          <strong>${e(entry.title)}</strong>
                          ${entry.isWip ? '<span class="wip-badge">WIP</span>' : ''}
                        </span>
                        <small>${e(entry.summary)}</small>
                      </span>
                      <span
                        class="catalog-lesson__preview${entry.isWip ? ' catalog-lesson__preview--wip' : ''}"
                        aria-hidden="true"
                      >
                        ${mechanicThumbnail(entry, `catalog-${locale.code}-${entry.id}`)}
                      </span>
                      <span class="catalog-lesson__arrow"
                        >${icon('arrow-right', { className: 'icon--directional' })}</span
                      >
                    </a>
                  </li>`,
              )
              .join('')}
          </ol>
        </section>`,
    )
    .join('');
  const lensCards = renderLensCards(locale.code, t);
  const featuredMechanic = catalogEntries.find((entry) => entry.id === 'charge');
  const featuredLesson = featuredMechanic?.mechanic?.translations[locale.code];
  if (!featuredMechanic?.mechanic || !featuredLesson) {
    throw new Error(`Missing published charge lesson for ${locale.code}`);
  }
  const workflowCards = [
    [t.catalog, t.mechanicsNavText],
    [t.simulationNavTitle, t.simulationNavText],
    [t.concepts, t.conceptsNavText],
    [t.examples, t.examplesNavText],
    [t.builder, t.builderNavText],
  ];
  const body = /* HTML */ `<main id="main" class="catalog-main">
    <section class="catalog-hero">
      <div class="catalog-hero__copy">
        <h1>${e(t.indexTitle)}</h1>
        <p class="lead">${e(t.indexSubtitle)}</p>
        <div class="catalog-hero__actions">
          <a class="catalog-hero__primary" href="${link(`${locale.code}/mechanics/charge/`)}"
            >${e(t.readLesson)}${icon('arrow-right', { className: 'icon--directional' })}</a
          >
          <a class="catalog-hero__secondary" href="${link(`${locale.code}/builder/`)}"
            >${e(t.builder)}</a
          >
        </div>
      </div>
      <a
        class="catalog-hero__lesson"
        href="${link(`${locale.code}/mechanics/charge/`)}"
        aria-label="${e(`${t.readLesson}: ${featuredLesson.title}`)}"
      >
        <div class="catalog-hero__lesson-heading">
          <div>
            <h2>${e(featuredLesson.title)}</h2>
            <p>${e(featuredLesson.summary)}</p>
          </div>
          <span class="catalog-hero__lesson-arrow"
            >${icon('arrow-right', { className: 'icon--directional' })}</span
          >
        </div>
        <div class="catalog-hero__preview" aria-hidden="true">
          ${animations[featuredMechanic.mechanic.meta.animation].thumbnail('catalog-featured-charge')}
        </div>
        <ol class="catalog-hero__questions">
          ${featuredLesson.steps.map((step) => `<li>${e(step.title)}</li>`).join('')}
        </ol>
      </a>
    </section>
    <section class="catalog-workflow" aria-labelledby="catalog-workflow-title">
      <header class="catalog-workflow__heading">
        <h2 id="catalog-workflow-title">${e(t.siteMapTitle)}</h2>
        <p>${e(t.siteMapIntro)}</p>
      </header>
      <ol class="catalog-workflow__steps">
        ${workflowCards
          .map(
            ([title, text], index) =>
              /* HTML */ `<li>
                <span>${String(index + 1).padStart(2, '0')}</span>
                <h3>${e(title)}</h3>
                <p>${e(text)}</p>
              </li>`,
          )
          .join('')}
      </ol>
    </section>
    <section class="catalog-guides" aria-labelledby="catalog-guides-title">
      <figure class="catalog-guides__art" aria-hidden="true">
        <img
          src="${asset('welcome-boss-and-player.webp')}"
          alt=""
          width="1536"
          height="1024"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div class="catalog-guides__copy">
        <h2 id="catalog-guides-title">${e(t.indexGuidesTitle)}</h2>
        <p>${e(t.indexGuidesBody)}</p>
      </div>
    </section>
    <section id="mechanics" class="catalog-contents" aria-labelledby="mechanics-title">
      <div class="catalog-contents__heading">
        <h2 id="mechanics-title">${e(t.available)}</h2>
        <span class="count">${catalogEntries.length}</span>
      </div>
      <nav class="catalog-part-nav" aria-label="${e(t.available)}">${catalogNavigation}</nav>
      <div class="catalog-parts">${catalogSections}</div>
    </section>
  </main>`;
  await write(
    locale.code + '/',
    shell(locale, t.catalog, t.indexSubtitle, body, { catalog: true }),
  );
  const builderMechanics = catalogEntries.map((entry) => ({
    id: entry.id,
    number: entry.number,
    title: entry.title,
    category: entry.category,
    categoryKey: entry.categoryKey,
    summary: entry.summary,
    url: canonical(`${locale.code}/mechanics/${entry.id}/`),
    profile: entry.connectionProfile,
  }));
  const connectionCopy = t.builderConnections;
  const taxonomyLabels = {
    geometry: Object.fromEntries(
      MECHANIC_TAXONOMY.geometry.map((value) => [
        value,
        connectionCopy[`geometry${value[0].toUpperCase()}${value.slice(1)}`],
      ]),
    ),
    signal: Object.fromEntries(
      MECHANIC_TAXONOMY.signal.map((value) => [
        value,
        connectionCopy[`signal${value[0].toUpperCase()}${value.slice(1)}`],
      ]),
    ),
    response: Object.fromEntries(
      MECHANIC_TAXONOMY.response.map((value) => [
        value,
        connectionCopy[`response${value[0].toUpperCase()}${value.slice(1)}`],
      ]),
    ),
    dimensions: {
      '2d': connectionCopy.dimension2d,
      '3d': connectionCopy.dimension3d,
    },
    lenses: Object.fromEntries(
      publishedLenses.map((lens) => [lens.meta.id, lens.translations[locale.code].title]),
    ),
  };
  const filterGroups = [
    ['geometry', connectionCopy.geometry, MECHANIC_TAXONOMY.geometry],
    ['signal', connectionCopy.signal, MECHANIC_TAXONOMY.signal],
    ['response', connectionCopy.response, MECHANIC_TAXONOMY.response],
    ['dimensions', connectionCopy.dimension, MECHANIC_TAXONOMY.dimension],
    ['lenses', connectionCopy.lens, publishedLenses.map((lens) => lens.meta.id)],
  ];
  const builderFilters = filterGroups
    .map(
      ([key, label, values]) =>
        /* HTML */ `<label class="boss-builder-filter">
          <span>${e(label)}</span>
          <select data-boss-filter="${key}">
            <option value="">${e(connectionCopy.all)}</option>
            ${values.map((value) => `<option value="${e(value)}">${e(taxonomyLabels[key][value])}</option>`).join('')}
          </select>
        </label>`,
    )
    .join('');
  const builderCards = catalogEntries
    .map((entry) => {
      const profile = entry.connectionProfile;
      return /* HTML */ `<article
        class="boss-builder-mechanic${entry.isWip ? ' boss-builder-mechanic--wip' : ''}"
        data-boss-mechanic-card
        data-mechanic-id="${e(entry.id)}"
      >
        <label class="boss-builder-mechanic__select">
          <input type="checkbox" value="${e(entry.id)}" data-boss-mechanic />
          <span class="boss-builder-mechanic__check">${icon('check')}</span>
          <span
            class="boss-builder-mechanic__diagram${entry.isWip ? ' boss-builder-mechanic__diagram--wip' : ''}"
            aria-hidden="true"
          >
            ${mechanicThumbnail(entry, `builder-${locale.code}-${entry.id}`, { portrait: true })}
          </span>
          <span class="boss-builder-mechanic__copy">
            <span class="eyebrow">${e(entry.category)}</span>
            <strong
              >${e(entry.title)} ${entry.isWip ? '<span class="wip-badge">WIP</span>' : ''}</strong
            >
            <span class="boss-builder-mechanic__tags">
              <span>${e(taxonomyLabels.geometry[profile.geometry[0]])}</span>
              <span>${e(taxonomyLabels.response[profile.response[0]])}</span>
              <span
                >${profile.dimensions.map((value) => e(taxonomyLabels.dimensions[value])).join(' · ')}</span
              >
            </span>
            <span class="boss-builder-mechanic__summary">${e(entry.summary)}</span>
          </span>
        </label>
        <a href="${link(`${locale.code}/mechanics/${entry.id}/`)}">
          ${e(t.readLesson)}${icon('arrow-right', { className: 'icon--directional' })}
        </a>
      </article>`;
    })
    .join('');
  const builderSupportUrl =
    locale.code === 'ru'
      ? 'https://boosty.to/polyakovin/posts/ae29ea63-2930-4aa9-8ff8-fab08219ffa8'
      : 'https://boosty.to/polyakovin/posts/6207f647-55a4-4a30-accd-d52d0f1097a6?locale=en_US';
  const builderConfig = {
    locale: locale.code,
    mechanics: builderMechanics,
    messages: {
      selected: t.builderSelected,
      saved: t.builderSaved,
      cleared: t.builderCleared,
      nameRequired: t.builderNameRequired,
      mechanicRequired: t.builderMechanicRequired,
      ...connectionCopy,
    },
    labels: taxonomyLabels,
  };
  const builderBody = /* HTML */ `<main id="main" class="boss-builder-main" data-boss-builder>
    <header class="boss-builder-hero">
      <h1>${e(t.builderTitle)}</h1>
      <p>${e(t.builderIntro)}</p>
      <span class="boss-builder-storage">${e(t.builderStorageNote)}</span>
    </header>
    <div class="boss-builder-topbar">
      <div class="boss-builder-actions boss-builder-actions--top">
        <button type="button" class="boss-builder-random" data-boss-random>
          ${icon('shuffle')}${e(connectionCopy.randomBoss)}
        </button>
        <button type="button" class="boss-builder-reset" data-boss-reset disabled>
          ${icon('rotate-ccw')}${e(t.builderReset)}
        </button>
      </div>
      <p class="boss-builder-status" role="status" aria-live="polite" data-boss-status></p>
    </div>
    <div class="boss-builder-layout">
      <aside class="boss-builder-sidebar">
        <section class="boss-builder-form" aria-label="${e(t.builderTitle)}">
          <label class="boss-builder-field">
            <span>${e(t.builderName)}</span>
            <input
              type="text"
              maxlength="120"
              autocomplete="off"
              placeholder="${e(t.builderNamePlaceholder)}"
              data-boss-name
            />
          </label>
          <label class="boss-builder-field">
            <span>${e(t.builderDescription)}</span>
            <textarea
              maxlength="2000"
              rows="6"
              placeholder="${e(t.builderDescriptionPlaceholder)}"
              data-boss-description
            ></textarea>
          </label>
        </section>
        <section class="boss-builder-phases" aria-labelledby="boss-builder-phases-title">
          <header>
            <h2 id="boss-builder-phases-title">${e(connectionCopy.phasesTitle)}</h2>
            <button type="button" data-boss-add-phase>${e(connectionCopy.addPhase)}</button>
          </header>
          <p>${e(connectionCopy.phasesIntro)}</p>
          <div class="boss-builder-phase-list" data-boss-phases></div>
          <div class="boss-builder-actions boss-builder-actions--download">
            <button type="button" class="boss-builder-download" data-boss-download>
              ${icon('download')}${e(t.builderDownload)}
            </button>
          </div>
        </section>
      </aside>
      <section class="boss-builder-mechanics" aria-labelledby="boss-builder-mechanics-title">
        <div class="boss-builder-mechanics__heading">
          <div>
            <h2 id="boss-builder-mechanics-title">${e(connectionCopy.explorerTitle)}</h2>
          </div>
          <span data-boss-selected>${e(t.builderSelected)}: 0</span>
        </div>
        <p>${e(connectionCopy.explorerIntro)}</p>
        <label class="boss-builder-search">
          <span class="visually-hidden">${e(t.catalog)}</span>
          <span class="boss-builder-search__icon">${icon('search')}</span>
          <input
            type="search"
            placeholder="${e(t.catalog)}"
            autocomplete="off"
            data-boss-mechanic-search
          />
        </label>
        <div class="boss-builder-filters" data-boss-filters>
          ${builderFilters}
          <div class="boss-builder-filter-actions">
            <span data-boss-results
              >${e(connectionCopy.results.replace('{count}', String(catalogEntries.length)))}</span
            >
            <button type="button" data-boss-reset-filters>${e(connectionCopy.resetFilters)}</button>
          </div>
        </div>
        <label class="boss-builder-active-phase">
          <span>${e(connectionCopy.activePhase)}</span>
          <select data-boss-active-phase></select>
        </label>
        <section
          class="boss-builder-recommendations"
          aria-labelledby="boss-builder-recommendations-title"
        >
          <header>
            <h3 id="boss-builder-recommendations-title">${e(connectionCopy.relationsTitle)}</h3>
            <p>${e(connectionCopy.relationsIntro)}</p>
          </header>
          <div class="boss-builder-recommendations__groups">
            <div class="boss-builder-relation-group boss-builder-relation-group--compatible">
              <h4>${e(connectionCopy.compatibleTitle)}</h4>
              <ul data-boss-compatible></ul>
            </div>
            <div class="boss-builder-relation-group boss-builder-relation-group--conflict">
              <h4>${e(connectionCopy.conflictsTitle)}</h4>
              <ul data-boss-conflicts></ul>
            </div>
            <div class="boss-builder-relation-group">
              <h4>${e(connectionCopy.suggestionsTitle)}</h4>
              <ul data-boss-suggestions></ul>
            </div>
          </div>
        </section>
        <div class="boss-builder-mechanics__grid">${builderCards}</div>
      </section>
    </div>
    <dialog
      class="boss-builder-support"
      aria-labelledby="boss-builder-support-title"
      data-boss-support
    >
      <div class="boss-builder-support__card">
        <h2 id="boss-builder-support-title">${e(t.builderSupportTitle)}</h2>
        <p>${e(t.builderSupportBody)}</p>
        <form method="dialog" class="boss-builder-support__actions">
          <button type="submit" value="cancel">${e(t.builderSupportDismiss)}</button>
          <a
            href="${e(builderSupportUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            data-boss-support-link
            >${e(t.builderSupportAction)}${icon('external-link', {
              className: 'icon--external',
            })}</a
          >
        </form>
      </div>
    </dialog>
    <script type="application/json" data-boss-builder-config>
      ${jsonForHtml(builderConfig)}
    </script>
  </main>`;
  await write(
    `${locale.code}/builder/`,
    shell(locale, t.builderTitle, t.builderIntro, builderBody, {
      route: 'builder/',
      assets: ['boss-builder.mjs'],
      builderPage: true,
      pageClass: 'boss-builder-page',
    }),
  );
  for (const m of published) {
    const c = m.translations[locale.code],
      a = animations[m.meta.animation];
    const body = renderLessonBody(locale, t, m, c, a, {
      catalogEntry: catalogEntriesById.get(m.meta.id),
      history: mechanicHistory(m.meta.id, locale.code),
    });
    await write(
      `${locale.code}/mechanics/${m.meta.id}/`,
      shell(locale, c.title, c.summary, body, {
        route: `mechanics/${m.meta.id}/`,
        assets: [...a.styles, ...a.scripts, 'mechanic-builder-action.mjs'],
      }),
    );
  }
  for (const entry of catalogEntries.filter(({ isWip }) => isWip)) {
    if (entry.mechanic?.meta.animation) {
      const contentLocale = entry.mechanic.translations[locale.code] ? locale.code : 'en';
      const content = entry.mechanic.translations[contentLocale];
      const animation = animations[entry.mechanic.meta.animation];
      const body = renderLessonBody(locale, t, entry.mechanic, content, animation, {
        isWip: true,
        contentLocale,
        catalogEntry: entry,
        history: mechanicHistory(entry.id, contentLocale),
      });
      await write(
        `${locale.code}/mechanics/${entry.id}/`,
        shell(locale, content.title, content.summary, body, {
          route: `mechanics/${entry.id}/`,
          pageClass: 'lesson-page--wip',
          assets: [...animation.styles, ...animation.scripts, 'mechanic-builder-action.mjs'],
        }),
      );
      continue;
    }
    const fallbackAttributes =
      locale.code === 'ru' || locale.code === 'en' ? '' : ' lang="en" dir="ltr"';
    const body = /* HTML */ `<main id="main" class="wip-mechanic-main">
      <header class="wip-mechanic-hero" ${fallbackAttributes}>
        <a
          class="eyebrow lesson-category"
          href="${link(`${locale.code}/#${entry.catalogSectionId}`)}"
          >${e(entry.category)}</a
        >
        <div class="wip-mechanic-title">
          <h1>${e(entry.title)}</h1>
          <span class="wip-badge">WIP</span>
        </div>
        <p>${e(entry.summary)}</p>
        ${mechanicBuilderAction(locale, t, entry.id)}
      </header>
      ${draftAnimationSection(entry, locale)} ${draftProfileSection(entry.profile, locale)}
      ${draftExampleSection(entry.examples, locale, t)}
      <section class="wip-mechanic-panel" aria-label="WIP">
        <div class="wip-mechanic-placeholder" aria-hidden="true">
          <span>WIP</span>
        </div>
        <div>
          <h2>${e(t.builderTitle)}</h2>
          <p>${e(t.builderIntro)}</p>
          <a class="wip-builder-link" href="${link(`${locale.code}/builder/`)}">
            ${e(t.builder)}${icon('arrow-right', { className: 'icon--directional' })}
          </a>
        </div>
      </section>
      ${lastUpdated(locale, t, mechanicHistory(entry.id, locale.code))}
    </main>`;
    await write(
      `${locale.code}/mechanics/${entry.id}/`,
      shell(locale, entry.title, entry.summary, body, {
        route: `mechanics/${entry.id}/`,
        pageClass: 'wip-mechanic-page',
        assets: [
          ...(entry.profile ? ['blueprint.css', 'encounter.css', 'blueprint-player.mjs'] : []),
          'mechanic-builder-action.mjs',
        ],
      }),
    );
  }
  const lensCatalogBody = /* HTML */ `<main id="main" class="lens-catalog-main">
    <header class="lens-catalog-hero">
      <h1>${e(t.conceptsTitle)}</h1>
      <p>${e(t.conceptsIntro)}</p>
    </header>
    <div class="lens-catalog-grid">${lensCards}</div>
  </main>`;
  await write(
    `${locale.code}/lenses/`,
    shell(locale, t.conceptsTitle, t.conceptsIntro, lensCatalogBody, {
      route: 'lenses/',
      lensesPage: true,
      pageClass: 'lens-catalog-page',
    }),
  );
  for (const lens of publishedLenses) {
    const content = lens.translations[locale.code];
    const frameworkCopy = bossUpFramework.translations[locale.code];
    const frameworkRules = bossUpFramework.rules.filter((rule) => rule.lensId === lens.meta.id);
    const usedBy = published.filter((mechanic) => mechanic.meta.lenses.includes(lens.meta.id));
    const mechanicLinks = usedBy
      .map((mechanic) => {
        const mechanicContent = mechanic.translations[locale.code];
        return /* HTML */ `<a
          class="lens-mechanic-card"
          href="${link(`${locale.code}/mechanics/${mechanic.meta.id}/`)}"
        >
          <span class="eyebrow">${e(mechanicContent.category)}</span>
          <h2>
            ${e(mechanicContent.title)} ${icon('arrow-right', { className: 'icon--directional' })}
          </h2>
          <p>${e(mechanicContent.summary)}</p>
        </a>`;
      })
      .join('');
    const relatedLinks = lens.meta.related
      .map((id) => {
        const related = lensById.get(id);
        const relatedContent = related?.translations[locale.code];
        if (!relatedContent) return '';
        return `<a class="lens-chip" href="${link(`${locale.code}/lenses/${id}/`)}"><span>${e(relatedContent.title)}</span></a>`;
      })
      .join('');
    const body = /* HTML */ `<main id="main" class="lens-main">
      <article class="lens-page">
        <header class="lens-page__hero">
          <div class="lens-page__copy">
            <h1>${e(content.title)}</h1>
            <p>${e(content.summary)}</p>
          </div>
          ${renderLensVisual(lens.meta.id, content)}
        </header>
        ${
          frameworkRules.length
            ? `<section class="lens-page__framework" aria-labelledby="lens-framework-title">
                <span class="eyebrow">${e(frameworkCopy.eyebrow)}</span>
                <h2 id="lens-framework-title">${e(frameworkCopy.lensSectionTitle)}</h2>
                <p>${e(frameworkCopy.lensSectionIntro)}</p>
                <div>${frameworkRules
                  .map((rule) => {
                    const ruleCopy = rule.translations[locale.code];
                    return `<article><h3>${e(ruleCopy.title)}</h3><p>${e(ruleCopy.body)}</p></article>`;
                  })
                  .join('')}</div>
              </section>`
            : ''
        }
        ${
          mechanicLinks
            ? `<section class="lens-page__mechanics" aria-labelledby="lens-mechanics-title">
                <h2 id="lens-mechanics-title">${e(t.lensMechanicsTitle)}</h2>
                <div>${mechanicLinks}</div>
              </section>`
            : ''
        }
        ${
          relatedLinks
            ? `<nav class="lens-page__related" aria-label="${e(t.relatedTitle)}"><h2>${e(t.relatedTitle)}</h2><div class="lens-chips">${relatedLinks}</div></nav>`
            : ''
        }
        ${
          lens.meta.sources.length
            ? `<section class="sources lens-page__sources"><h2>${e(t.sources)}</h2><ul>${lens.meta.sources.map((source) => `<li><a href="${e(source.url)}">${e(source.title)}${icon('external-link', { className: 'icon--external' })}</a></li>`).join('')}</ul></section>`
            : ''
        }
        <p class="review-note lens-page__review">
          ${e(t.reviewNote)}
          <a href="${REPOSITORY}/edit/main/content/lenses/${lens.meta.id}/${locale.code}.json"
            >${icon('square-pen')}${e(t.edit)}</a
          >
        </p>
        ${lastUpdated(locale, t, lensHistory(lens.meta.id, locale.code))}
      </article>
    </main>`;
    await write(
      `${locale.code}/lenses/${lens.meta.id}/`,
      shell(locale, content.title, content.summary, body, {
        route: `lenses/${lens.meta.id}/`,
        lensesPage: true,
        pageClass: 'lens-page-body',
      }),
    );
  }
}
const languageLinks = locales
  .map(
    (l) =>
      `<a class="language-choice" href="${link(l.code + '/')}" lang="${l.code}" dir="${l.dir}"><span class="language-choice__label"><span class="language-flag" aria-hidden="true">${e(l.flag)}</span><span>${e(l.name)}</span></span>${icon('arrow-right', { className: 'icon--directional' })}</a>`,
  )
  .join('');
const languageGatewayHtml = /* HTML */ `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      ${themeHead}
      <title>Boss Fight Atlas — Interactive pattern library for boss encounter designers</title>
      <meta
        name="description"
        content="Interactive pattern library for boss encounter designers, with animations and practical design references in eight languages."
      />
      <meta name="author" content="${e(AUTHOR.name)}" />
      <link rel="canonical" href="${canonical()}" />
      <link rel="author" href="${AUTHOR.github}" />
      <meta
        property="og:title"
        content="Boss Fight Atlas — Interactive pattern library for boss encounter designers — ${e(AUTHOR.name)}"
      />
      <meta
        property="og:description"
        content="Interactive pattern library for boss encounter designers, with animations and practical design references in eight languages."
      />
      <meta property="og:site_name" content="${e(AUTHOR.name)}" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="${canonical()}" />
      <meta
        name="twitter:title"
        content="Boss Fight Atlas — Interactive pattern library for boss encounter designers — ${e(AUTHOR.name)}"
      />
      <link rel="stylesheet" href="${asset('site.css')}" />
      <link rel="icon" href="${asset('favicon.svg')}" type="image/svg+xml" />
      <script type="module" src="${asset('site.mjs')}"></script>
    </head>
    <body class="language-home">
      ${themeButton('Switch to dark theme', 'Switch to light theme')}
      <main id="main">
        ${logoMark('brand-mark brand-mark--gateway')}
        <h1>Boss Fight<br /><em>Atlas.</em></h1>
        <p class="lead">Interactive pattern library for boss encounter designers</p>
        <nav class="language-choices" aria-label="Choose a language">${languageLinks}</nav>
        <p class="legal">
          Open educational materials · CC BY 4.0 ·
          <a href="${REPOSITORY}"
            >GitHub${icon('external-link', { className: 'icon--external' })}</a
          >
        </p>
      </main>
      ${analyticsScript}
    </body>
  </html>`;
const defaultLanguageHref = link('en/');
const rootHtml = /* HTML */ `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Boss Fight Atlas</title>
      <meta
        name="description"
        content="Interactive pattern library for boss encounter designers."
      />
      <meta name="author" content="${e(AUTHOR.name)}" />
      <link rel="canonical" href="${canonical('en/')}" />
      <link rel="author" href="${AUTHOR.github}" />
      ${locales.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${canonical(`${l.code}/`)}">`).join('')}
      <link rel="alternate" hreflang="x-default" href="${canonical('en/')}" />
      <meta http-equiv="refresh" content="0; url=${e(defaultLanguageHref)}" />
      <script>
        location.replace(${jsonForHtml(defaultLanguageHref)});
      </script>
    </head>
    <body>
      <p>Continue to <a href="${e(defaultLanguageHref)}">Boss Fight Atlas in English</a>.</p>
    </body>
  </html>`;
await write('', rootHtml);
await fs.writeFile(
  path.join(out, '404.html'),
  languageGatewayHtml
    .replace(
      '<title>Boss Fight Atlas — Interactive pattern library for boss encounter designers</title>',
      '<title>Page not found · Boss Fight Atlas</title>',
    )
    .replace(
      '<p class="lead">Interactive pattern library for boss encounter designers</p>',
      '<p class="lead">Page not found. Choose a language to return to the atlas.</p>',
    ),
);
await fs.writeFile(
  path.join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${e(url)}</loc></url>`).join('')}</urlset>`,
);
await fs.writeFile(
  path.join(out, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${canonical('sitemap.xml')}\n`,
);
console.log(`Built ${urls.length} pages at ${out}`);
