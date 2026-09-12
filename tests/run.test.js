const test = require('node:test');
const assert = require('node:assert');
const promptBank = require('../src/js/promptBank.js');
const runner = require('../src/js/run.js');
const rarity = require('../src/js/rarity.js');

// A tiny but real fixture bank: every category present, six European countries
// so region scoping is exercisable (Spec 6 requires >= 6 to scope a prompt).
//
// Magnitudes here stand in for monthly Wikipedia pageviews, which is what the
// shipped bank scores on; the engine only cares that bigger = more famous.
const country = (name, capital, pop, region) => [
  { id: `country-${name.toLowerCase()}`, category: 'country', name, aliases: [], magnitude: pop, magnitudeUnit: 'population', region, source: 'fixture' },
  { id: `capital-${capital.toLowerCase()}`, category: 'capital', name: capital, aliases: [], magnitude: pop, magnitudeUnit: 'population', region, source: 'fixture' }
];

const simple = (category, unit, rows) =>
  rows.map(([name, magnitude]) => ({
    id: `${category}-${name.toLowerCase().replace(/\s+/g, '-')}`,
    category,
    name,
    aliases: [],
    magnitude,
    magnitudeUnit: unit,
    source: 'fixture'
  }));

const EUROPE = ['Europe', 'Western Europe'];
const pairs = [
  ...country('France', 'Paris', 68000000, EUROPE),
  ...country('Germany', 'Berlin', 83000000, EUROPE),
  ...country('Spain', 'Madrid', 47000000, EUROPE),
  ...country('Italy', 'Rome', 59000000, EUROPE),
  ...country('Ireland', 'Dublin', 5200000, EUROPE),
  ...country('Malta', 'Valletta', 540000, EUROPE),
  ...country('Kenya', 'Nairobi', 55000000, ['Africa', 'East Africa'])
];

const RAW = {
  countries: pairs.filter((e) => e.category === 'country'),
  capitals: pairs.filter((e) => e.category === 'capital'),
  lakes: simple('lake', 'area_km2', [['Lake Superior', 82100], ['Loch Ness', 56]]),
  rivers: simple('river', 'length_km', [['Nile', 6650], ['Cam', 64]]),
  mountains: simple('mountain', 'elevation_m', [['Mount Everest', 8849], ['Ben Nevis', 1345]]),
  minorPeaks: simple('mountain', 'elevation_m', [['Box Hill', 224]]),
  deserts: simple('desert', 'area_km2', [['Sahara', 9200000], ['Negev', 13000]]),
  islands: simple('island', 'area_km2', [['Greenland', 2166086], ['Lundy', 4.5]]),
  seas: simple('sea_ocean', 'area_km2', [['Pacific Ocean', 165250000], ['Wadden Sea', 10000]])
};

// Two per category, because a category can come up twice in a run and repeats
// are rejected (Spec 3.5).
const ANSWERS = {
  country: ['France', 'Germany'],
  capital: ['Paris', 'Berlin'],
  lake: ['Loch Ness', 'Lake Superior'],
  river: ['Cam', 'Nile'],
  mountain: ['Box Hill', 'Ben Nevis'],
  desert: ['Negev', 'Sahara'],
  island: ['Lundy', 'Greenland'],
  sea_ocean: ['Wadden Sea', 'Pacific Ocean']
};

/** Answer the current round with the first fixture answer that is accepted. */
function answer(run) {
  const category = run.prompt().category;
  for (const candidate of ANSWERS[category]) {
    const result = run.submit(candidate);
    if (result.status === 'accepted') return result;
  }
  throw new Error(`no unused fixture answer left for ${category}`);
}

/** Deterministic rng so a failing test is reproducible. */
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const THEMES = {
  river: { 'the British Isles': ['Cam'], 'big rivers': ['Nile', 'Cam'] },
  mountain: { 'tiny hills': ['Box Hill', 'Ben Nevis', 'Mount Everest'] }
};

const bank = promptBank.createBank(RAW, THEMES);

test('minor peaks merge into the mountain cohort (Spec 3.3)', () => {
  assert.strictEqual(bank.cohorts.get('mountain').entries.length, 3);
  assert.ok(bank.cohorts.get('mountain').lookup.has('box hill'));
});

test('the draw is 15 slots covering every category once or twice (Spec 3.8)', () => {
  for (let seed = 1; seed <= 40; seed++) {
    const slots = bank.drawSlots(seeded(seed));
    assert.strictEqual(slots.length, 15);
    const counts = new Map();
    for (const slot of slots) counts.set(slot.category, (counts.get(slot.category) || 0) + 1);
    assert.strictEqual(counts.size, 8, `seed ${seed}: every category present`);
    for (const [category, n] of counts) {
      assert.ok(n === 1 || n === 2, `seed ${seed}: ${category} appeared ${n} times`);
    }
  }
});

test('an accepted answer scores, digs and advances the round', () => {
  const run = runner.createRun(bank, { rng: seeded(7), rounds: 3 });
  const result = answer(run);

  assert.strictEqual(result.status, 'accepted');
  assert.ok(result.points > 0);
  assert.ok(result.dig > 0);
  assert.strictEqual(run.roundNumber, 2);
  assert.strictEqual(run.score, result.points);
  assert.strictEqual(run.depth, result.dig);
});

test('an unrecognized answer retries for free (Spec 3.4)', () => {
  const run = runner.createRun(bank, { rng: seeded(11), rounds: 4 });
  assert.deepStrictEqual(run.submit('Atlantis'), { status: 'unrecognized' });
  assert.strictEqual(run.roundNumber, 1, 'no advance');
  assert.strictEqual(run.score, 0, 'no penalty');
  assert.strictEqual(run.depth, 0);
});

test('a repeat within one run is rejected without advancing (Spec 3.5)', () => {
  // Seven of eight categories come round twice per run; find a seed where the
  // opening category is one of them, then answer it the same way both times.
  let checked = false;
  for (let seed = 1; seed <= 40 && !checked; seed++) {
    const run = runner.createRun(bank, { rng: seeded(seed), rounds: 15 });
    const firstCategory = run.prompt().category;
    const used = ANSWERS[firstCategory][0];
    if (run.submit(used).status !== 'accepted') continue;

    while (!run.finished && !checked) {
      const prompt = run.prompt();
      if (prompt.category === firstCategory && prompt.lookup.has(used.toLowerCase())) {
        const roundBefore = run.roundNumber;
        const scoreBefore = run.score;
        const duplicate = run.submit(used);
        assert.strictEqual(duplicate.status, 'duplicate');
        assert.strictEqual(duplicate.entry.name, used);
        assert.strictEqual(run.roundNumber, roundBefore, 'duplicate does not advance');
        assert.strictEqual(run.score, scoreBefore, 'duplicate does not score');
        checked = true;
        break;
      }
      run.timeout();
    }
  }
  assert.ok(checked, 'expected some seed to repeat the opening category with the same answer eligible');
});

test('curated themes survive even when deliberately tight', () => {
  // A two-member theme is kept - "Name a river in Mesopotamia" has exactly two
  // right answers and that IS the difficulty. A one-member theme is dropped.
  assert.deepStrictEqual([...bank.themes.get('river').keys()], ['big rivers']);
  assert.strictEqual(bank.themes.get('river').get('big rivers').length, 2);
  assert.strictEqual(promptBank.MIN_THEME_MEMBERS, 2);
});

test('letter rules accept any spelling the player might reasonably type', () => {
  const baikal = { name: 'Lake Baikal', aliases: ['Baikal'] };
  baikal.variants = promptBank.variantsOf(baikal);
  // "Lake Baikal" counts for L (as written) and for B (as everyone says it).
  assert.ok(promptBank.satisfiesLetter(baikal, { kind: 'starts', letter: 'l' }));
  assert.ok(promptBank.satisfiesLetter(baikal, { kind: 'starts', letter: 'b' }));
  assert.ok(promptBank.satisfiesLetter(baikal, { kind: 'contains', letter: 'k' }));
  assert.ok(!promptBank.satisfiesLetter(baikal, { kind: 'contains', letter: 'z' }));

  // An alias's filler words are not part of the spelling: "the Nile" must not
  // make "Nile" count as having a T.
  const nile = { name: 'Nile', aliases: ['the Nile'] };
  nile.variants = promptBank.variantsOf(nile);
  assert.ok(!promptBank.satisfiesLetter(nile, { kind: 'contains', letter: 't' }));
  assert.ok(promptBank.satisfiesLetter(nile, { kind: 'contains', letter: 'n' }));

  const ness = { name: 'Loch Ness', aliases: [] };
  ness.variants = promptBank.variantsOf(ness);
  assert.ok(promptBank.satisfiesLetter(ness, { kind: 'double' }));
  assert.ok(promptBank.satisfiesLetter(ness, { kind: 'short' }));
  assert.ok(!promptBank.satisfiesLetter(ness, { kind: 'long' }));
});

test('every drawn slot produces a prompt with at least one possible answer', () => {
  for (let seed = 1; seed <= 25; seed++) {
    for (const slot of bank.drawSlots(seeded(seed))) {
      const p = bank.promptFor(slot);
      assert.ok(p.text.startsWith('Name '), p.text);
      assert.ok(p.text.endsWith('.'), p.text);
      assert.ok(p.lookup.size > 0, `no answers for "${p.text}"`);
    }
  }
});

test('a region-scoped prompt rejects a country from elsewhere', () => {
  // Spec 3.1/3.2: the region scopes what is ACCEPTED; rarity stays global.
  assert.ok(bank.regions.includes('Europe'));

  // A region modifier is only one of several a slot can draw, so hunt across
  // seeds rather than assuming one run contains one.
  let checked = false;
  for (let seed = 1; seed <= 40 && !checked; seed++) {
    const run = runner.createRun(bank, { rng: seeded(seed), rounds: 15 });
    while (!run.finished && !checked) {
      const prompt = run.prompt();
      if (prompt.category === 'country' && prompt.region) {
        const roundBefore = run.roundNumber;
        const wrong = run.submit('Kenya');
        assert.strictEqual(wrong.status, 'wrong-scope');
        assert.strictEqual(wrong.entry.name, 'Kenya');
        assert.strictEqual(run.roundNumber, roundBefore, 'no advance');
        assert.strictEqual(run.submit('France').status, 'accepted');
        checked = true;
        break;
      }
      run.timeout();
    }
  }
  assert.ok(checked, 'expected at least one region-scoped country prompt');
});

test('rarity for a scoped prompt is still computed globally (Spec 3.2)', () => {
  const global = bank.cohorts.get('country');
  const run = runner.createRun(bank, { rng: seeded(21), rounds: 15 });
  let checked = false;
  while (!run.finished && !checked) {
    const prompt = run.prompt();
    if (prompt.category === 'country') {
      assert.strictEqual(prompt.cohort, global, 'scoring cohort is the whole category');
      checked = true;
      break;
    }
    run.timeout();
  }
  assert.ok(checked);
});

test('a timeout locks in zero and advances', () => {
  const run = runner.createRun(bank, { rng: seeded(5), rounds: 2 });
  const result = run.timeout();
  assert.strictEqual(result.status, 'timeout');
  assert.strictEqual(result.points, 0);
  assert.strictEqual(result.dig, 0);
  assert.strictEqual(run.roundNumber, 2);
  assert.strictEqual(run.depth, 0);
});

test('a run finishes after its rounds and summarizes correctly', () => {
  const run = runner.createRun(bank, { rng: seeded(9), rounds: 5 });
  let expectedScore = 0;
  let expectedDepth = 0;
  while (!run.finished) {
    const result = answer(run);
    expectedScore += result.points;
    expectedDepth += result.dig;
  }
  const summary = run.summary();
  assert.strictEqual(summary.rounds.length, 5);
  assert.strictEqual(summary.score, expectedScore);
  assert.ok(Math.abs(summary.finalDepth - expectedDepth) < 1e-9);
  assert.strictEqual(typeof summary.deepestStratum, 'string');
  assert.ok(!Number.isNaN(Date.parse(summary.date)));
});

test('the summary ladder runs from least to most obscure, misses first', () => {
  const rounds = [
    { round: 1, status: 'accepted', answer: 'France', rarity: 0.12, points: 100 },
    { round: 2, status: 'timeout', answer: null, rarity: 0, points: 0, prompt: 'Name a lake.' },
    { round: 3, status: 'accepted', answer: 'Tuvalu', rarity: 0.9, points: 800 },
    { round: 4, status: 'accepted', answer: 'Malta', rarity: 0.5, points: 400 },
    { round: 5, status: 'accepted', answer: 'Luxembourg', rarity: 0.5, points: 400 }
  ];
  const ladder = runner.rankByRarity(rounds);
  assert.deepStrictEqual(
    ladder.map((r) => r.answer),
    [null, 'France', 'Malta', 'Luxembourg', 'Tuvalu'],
    'ascending, ties in round order, the rarest last'
  );
  assert.strictEqual(rounds[0].answer, 'France', 'the original round order is untouched');

  const run = runner.createRun(bank, { rng: seeded(4) });
  while (!run.finished) answer(run);
  const summary = run.summary();
  assert.strictEqual(summary.ladder.length, summary.rounds.length);
  for (let i = 1; i < summary.ladder.length; i++) {
    assert.ok(summary.ladder[i].rarity >= summary.ladder[i - 1].rarity, `ladder step ${i} goes backwards`);
  }
});

test('a full 15-round run stays inside the depth budget', () => {
  const run = runner.createRun(bank, { rng: seeded(4) });
  while (!run.finished) answer(run);
  assert.strictEqual(run.summary().rounds.length, 15);
  assert.ok(run.depth > 0);
  assert.ok(run.depth <= rarity.TOTAL_DEPTH_BUDGET + 1e-9, 'depth cannot exceed the budget');
});

test('a misspelling is accepted and reports what it was corrected to', () => {
  const run = runner.createRun(bank, { rng: seeded(31), rounds: 15 });
  let checked = false;
  while (!run.finished && !checked) {
    if (run.prompt().category === 'lake') {
      const result = run.submit('Loch Nesss');
      assert.strictEqual(result.status, 'accepted');
      assert.strictEqual(result.answer, 'Loch Ness');
      assert.strictEqual(result.correctedFrom, 'Loch Nesss');
      assert.ok(result.points > 0, 'a corrected answer still scores');
      checked = true;
      break;
    }
    run.timeout();
  }
  assert.ok(checked, 'expected a lake prompt');
});
