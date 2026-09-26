import test from 'node:test';
import assert from 'node:assert/strict';
import { loadContent, validateContent } from '../lib/content.mjs';
import { escape, jsonForHtml } from '../lib/html.mjs';
import { lensVisualIds, renderLensVisual } from '../lib/lens-view.mjs';
const source = await loadContent();
test('all published mechanics have complete content in eight languages', async () => {
  await validateContent(source);
  const published = source.mechanics.filter(({ meta }) => meta.published);
  assert.equal(source.mechanics.length, 123);
  assert.equal(published.length, 123);
  assert.ok(published.every((mechanic) => Object.keys(mechanic.translations).length === 8));
  assert.equal(source.lenses.length, 15);
  assert.ok(source.lenses.every((lens) => Object.keys(lens.translations).length === 8));
  assert.ok(
    published.every((mechanic) =>
      Object.values(mechanic.translations).every((lesson) => !('quiz' in lesson)),
    ),
  );
});
test('the public index contains 124 unique builder-ready mechanics', async () => {
  const indexed = source.mechanicsIndex.mechanics;
  assert.equal(indexed.length, 124);
  assert.equal(new Set(indexed.map(({ id }) => id)).size, 124);
  assert.equal(new Set(indexed.map(({ number }) => number)).size, 124);
  assert.deepEqual(
    indexed.map(({ number }) => number),
    Array.from({ length: 124 }, (_, index) => index + 1),
  );
  const indexedIds = new Set(indexed.map(({ id }) => id));
  assert.ok(source.mechanics.every(({ meta }) => indexedIds.has(meta.id)));
  assert.equal(
    indexed.filter(({ id }) => !source.mechanics.some(({ meta }) => meta.id === id)).length,
    1,
  );

  const duplicate = structuredClone(source);
  duplicate.mechanicsIndex.mechanics[1].id = duplicate.mechanicsIndex.mechanics[0].id;
  await assert.rejects(validateContent(duplicate), /duplicate mechanic id/);
});
test('every catalog category is translated for every locale', async () => {
  const categories = new Set(
    source.mechanicsIndex.mechanics.map(({ translations }) => translations.en.category),
  );
  assert.equal(categories.size, 14);
  for (const { code } of source.locales) {
    const localizedCategories = source.mechanicsIndexLocales[code].categories;
    assert.deepEqual(new Set(Object.keys(localizedCategories)), categories);
    assert.ok(Object.values(localizedCategories).every((category) => category.trim().length > 0));
  }

  const data = structuredClone(source);
  delete data.mechanicsIndexLocales.ja.categories.Projectiles;
  await assert.rejects(validateContent(data), /missing category translation Projectiles/);
});
test('a missing published translation is rejected instead of silently showing English', async () => {
  const data = structuredClone(source);
  delete data.mechanics[0].translations.bn;
  await assert.rejects(validateContent(data), /missing published translation bn/);
});
test('an unfinished placeholder cannot publish', async () => {
  const data = structuredClone(source);
  data.mechanics[0].translations.ar.summary = 'TODO: summary';
  await assert.rejects(validateContent(data), /unresolved placeholder/);
});
test('unknown lesson keys and unsafe source URLs fail validation', async () => {
  const data = structuredClone(source);
  data.mechanics[0].translations.en.typo = 'bad';
  data.mechanics[0].meta.sources[0].url = 'javascript:alert(1)';
  await assert.rejects(
    validateContent(data),
    (error) =>
      error.message.includes('additional properties') && error.message.includes('https-url'),
  );
});
test('drafts may land before translations and animation are ready', async () => {
  const data = structuredClone(source);
  const draft = structuredClone(data.mechanics[0]);
  draft.folder = 'draft-mechanic';
  draft.meta = {
    ...draft.meta,
    id: 'draft-mechanic',
    number: Math.max(...data.mechanics.map((mechanic) => mechanic.meta.number)) + 1,
    published: false,
    animation: null,
    lenses: [],
  };
  draft.translations = { en: draft.translations.en };
  draft.translations.en.title = 'TODO: title';
  draft.translations.en.lensNotes = [];
  data.mechanics.push(draft);
  await validateContent(data);
});
test('content is escaped both in markup and script data', () => {
  assert.equal(escape('<img a="x">&'), '&lt;img a=&quot;x&quot;&gt;&amp;');
  const value = { message: '</script><script>alert(1)</script>' };
  const json = jsonForHtml(value);
  assert.ok(!json.includes('<'));
  assert.deepEqual(JSON.parse(json), value);
});
test('translated teaching steps cannot silently disappear', async () => {
  const data = structuredClone(source);
  data.mechanics[0].translations.ja.steps.pop();
  await assert.rejects(validateContent(data), /steps length differs from source/);
});
test('the registry cannot duplicate a language', async () => {
  const data = structuredClone(source);
  data.locales.push({ ...data.locales[0] });
  await assert.rejects(validateContent(data), /exactly once/);
});

test('every registered language has a distinct regional flag', async () => {
  assert.equal(new Set(source.locales.map((locale) => locale.flag)).size, source.locales.length);
  assert.ok(source.locales.every((locale) => /^\p{Regional_Indicator}{2}$/u.test(locale.flag)));
  const data = structuredClone(source);
  data.locales[0].flag = '';
  await assert.rejects(validateContent(data), /invalid or duplicate flag/);
});

test('published translations cannot lag behind the current source version', async () => {
  const data = structuredClone(source);
  data.mechanics[0].meta.contentVersion += 1;
  await assert.rejects(validateContent(data), /sourceVersion is stale/);
});

test('published diagrams use only generic boss and player labels', () => {
  for (const mechanic of source.mechanics)
    for (const lesson of Object.values(mechanic.translations)) {
      assert.ok(!lesson.demo.boss.includes('·'));
      assert.ok(!lesson.demo.player.includes('·'));
    }
});

test('the published lesson teaches design decisions rather than player execution', () => {
  const { en } = source.mechanics[0].translations;
  assert.match(en.learning, /tune/i);
  assert.ok(en.steps.every((step) => step.title.endsWith('?')));
});

test('each mechanic overview defines the rule and explains why it works', () => {
  for (const mechanic of source.mechanics)
    for (const lesson of Object.values(mechanic.translations)) {
      assert.ok(lesson.overview.length > lesson.summary.length);
      assert.ok(lesson.overview.length < 350);
    }
  const { en } = source.mechanics[0].translations;
  assert.match(en.overview, /locks its direction/i);
  assert.match(en.overview, /predictable/i);
  assert.match(en.overview, /response/i);
  assert.match(en.overview, /recovery/i);
});

test('design lenses stay complete and linkable across translations', async () => {
  const mechanicLenses = [
    'telegraphing',
    'commitment',
    'threat-geometry',
    'counterplay',
    'risk-reward',
    'mastery-check',
  ];
  const expected = [
    ...mechanicLenses,
    'encounter-purpose',
    'dramatic-framing',
    'context-and-sequence',
    'progress-clarity',
    'difficulty-rhythm',
    'phase-structure',
    'player-expression',
    'rule-exception',
    'access-paths',
  ];
  assert.deepEqual(source.mechanics[0].meta.lenses, mechanicLenses);
  assert.deepEqual(
    source.lenses.map((lens) => lens.meta.id),
    expected,
  );
  assert.deepEqual(lensVisualIds, expected);
  for (const lens of source.lenses) {
    const markup = renderLensVisual(lens.meta.id, lens.translations.en);
    assert.match(markup, new RegExp(`data-lens-visual="${lens.meta.id}"`));
    assert.match(markup, /role="img"/);
    assert.ok(markup.includes(escape(lens.translations.en.summary)));
  }
  for (const mechanic of source.mechanics)
    for (const lesson of Object.values(mechanic.translations))
      assert.deepEqual(
        lesson.lensNotes.map((note) => note.id),
        mechanic.meta.lenses,
      );
  assert.ok(
    source.lenses.every((lens) =>
      Object.values(lens.translations).every(
        (translation) => translation.title.length > 0 && translation.summary.length > 0,
      ),
    ),
  );
  assert.doesNotMatch(
    source.lenses.map((lens) => lens.translations.en.summary).join(' '),
    /charge/i,
  );
  const data = structuredClone(source);
  delete data.lenses[0].translations.ja;
  data.mechanics[0].meta.lenses[0] = 'missing-lens';
  await assert.rejects(
    validateContent(data),
    (error) =>
      error.message.includes('missing published translation ja') &&
      error.message.includes('invalid or unpublished lens missing-lens') &&
      error.message.includes('lens note 1 does not match mechanic lenses'),
  );
});

test('design lenses describe games generally instead of boss fights', () => {
  const containsWholeTerm = (text, term, locale) => {
    const escapedTerm = term.toLocaleLowerCase(locale).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?<![\\p{L}\\p{N}])${escapedTerm}(?![\\p{L}\\p{N}])`, 'u').test(
      text.toLocaleLowerCase(locale),
    );
  };
  for (const { code } of source.locales) {
    const lensText = source.lenses
      .map((lens) => `${lens.translations[code].title} ${lens.translations[code].summary}`)
      .join(' ');
    const catalogText = `${source.ui[code].conceptsTitle} ${source.ui[code].conceptsIntro}`;
    const charge = source.mechanics[0].translations[code];
    for (const encounterTerm of [charge.demo.boss, charge.title]) {
      assert.ok(
        !containsWholeTerm(lensText, encounterTerm, code),
        `${code}: lens assumes an encounter`,
      );
      assert.ok(
        !containsWholeTerm(catalogText, encounterTerm, code),
        `${code}: lens catalog assumes an encounter`,
      );
    }
  }
  assert.doesNotMatch(
    source.lenses.map((lens) => lens.translations.en.summary).join(' '),
    /\bboss(?:es)?\b|\bcharge\b|\bthis mechanic\b/i,
  );
});

test('draft lenses may land before translations are ready', async () => {
  const data = structuredClone(source);
  const draft = structuredClone(data.lenses[0]);
  draft.folder = 'draft-lens';
  draft.meta = {
    ...draft.meta,
    id: 'draft-lens',
    number: 16,
    published: false,
    related: [],
  };
  draft.translations = {
    en: {
      ...draft.translations.en,
      title: 'TODO: title',
      sourceVersion: 1,
    },
  };
  data.lenses.push(draft);
  await validateContent(data);
});

test('page feedback invites corrections without presenting the published content as unfinished', () => {
  assert.match(source.ui.en.reviewNote, /inaccuracy.*suggestion/i);
  assert.doesNotMatch(source.ui.en.reviewNote, /help|await|needs? review|automated/i);
  assert.match(source.ui.en.edit, /GitHub/);
  for (const { code } of source.locales) {
    assert.ok(source.ui[code].reviewNote.length > 0);
    assert.match(source.ui[code].edit, /GitHub/i);
  }
});

test('the contribution overview still names the kinds of review that are welcome', () => {
  assert.match(source.ui.en.contributeNavText, /facts.*concepts.*examples.*translations/i);
});

test('published game references cover 2D and 3D with screenshots and timestamped videos', async () => {
  for (const mechanic of source.mechanics) {
    const published = mechanic.translations.en.examples;
    assert.ok(published.length >= 3);
    assert.deepEqual(new Set(published.map((example) => example.dimension)), new Set(['2D', '3D']));
    assert.ok(published.every((example) => new URL(example.video).hostname === 'www.youtube.com'));
    assert.ok(published.every((example) => new URL(example.video).searchParams.get('t')));
    assert.ok(published.every((example) => new URL(example.screenshot).protocol === 'https:'));
    assert.ok(
      published.every((example) => new URL(example.screenshotSource).protocol === 'https:'),
    );
    assert.ok(published.every((example) => example.videoDurationSeconds > 0));
  }

  const tooFewExamples = structuredClone(source);
  const shortLesson = tooFewExamples.mechanics.find((item) => item.folder === 'sweep');
  for (const lesson of Object.values(shortLesson.translations)) lesson.examples.length = 2;
  await assert.rejects(
    validateContent(tooFewExamples),
    /published lesson needs at least three boss examples/,
  );

  const examples = source.mechanics[0].translations.en.examples;
  assert.equal(examples.length, 6);
  assert.deepEqual(new Set(examples.map((example) => example.dimension)), new Set(['2D', '3D']));
  assert.ok(examples.every((example) => new URL(example.video).hostname === 'www.youtube.com'));
  assert.ok(examples.every((example) => new URL(example.screenshot).protocol === 'https:'));
  assert.ok(examples.every((example) => new URL(example.screenshotSource).protocol === 'https:'));
  assert.equal(new Set(examples.map((example) => example.screenshot)).size, examples.length);
  assert.ok(examples.every((example) => example.videoDurationSeconds > 0));
  assert.equal(examples.filter((example) => example.videoDurationSeconds <= 180).length, 5);
  assert.deepEqual(
    examples.map((example) => new URL(example.video).searchParams.get('t')),
    ['2s', '66s', '7s', '15s', '265s', '2s'],
  );

  const data = structuredClone(source);
  data.mechanics[0].translations.ru.examples[0].video = 'https://vimeo.com/123456';
  data.mechanics[0].translations.bn.examples.pop();
  await assert.rejects(
    validateContent(data),
    (error) =>
      error.message.includes('example 1 differs from source') &&
      error.message.includes('needs a YouTube video') &&
      error.message.includes('examples length differs from source'),
  );
});

test('learning sources stay specific to the charge mechanic and prioritize practitioners', () => {
  const sources = source.mechanics[0].meta.sources;
  assert.equal(sources.length, 5);
  assert.deepEqual(
    new Set(sources.map((item) => new URL(item.url).hostname)),
    new Set([
      'www.gamedeveloper.com',
      'www.gdcvault.com',
      'gdn001.itch.io',
      'snoukdesignnotes.blog',
    ]),
  );
  const titles = sources.map((item) => item.title).join(' ');
  assert.match(titles, /Developer talk/);
  assert.match(titles, /Designer article/);
  assert.match(titles, /Developer devlog/);
  for (const source of sources) {
    assert.match(
      source.title,
      /charge|wind-up|telegraph|boss attack|warning area/i,
      `${source.title} must name the charge behavior it supports`,
    );
  }
});

test('learning sources do not repeat unexplained gameplay from boss examples', async () => {
  for (const mechanic of source.mechanics) {
    const exampleVideos = new Set(
      mechanic.translations.en.examples.map((example) =>
        new URL(example.video).searchParams.get('v'),
      ),
    );
    for (const item of mechanic.meta.sources) {
      const url = new URL(item.url);
      assert.ok(!exampleVideos.has(url.searchParams.get('v')));
      assert.doesNotMatch(item.title, /^Gameplay reference\b/i);
    }
  }

  const data = structuredClone(source);
  const mechanic = data.mechanics.find((item) => item.folder === 'gap-volley');
  mechanic.meta.sources.push({
    title: 'Repeated gameplay with a different timestamp',
    url: 'https://youtu.be/Ol3-4Y0eS9M?t=75',
  });
  await assert.rejects(validateContent(data), /source 2 duplicates a boss example video/);
});

test('every boss reference opens at the exact attack instead of unrelated gameplay', async () => {
  const data = structuredClone(source);
  const mechanic = data.mechanics.find((item) => item.folder === 'gap-volley');
  for (const lesson of Object.values(mechanic.translations))
    lesson.examples[0].video = 'https://www.youtube.com/watch?v=7pVgc-VBuPk';
  await assert.rejects(validateContent(data), /example 1 needs an exact YouTube timestamp/);
});
