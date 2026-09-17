const test = require('node:test');
const assert = require('node:assert');
const promptBank = require('../src/js/promptBank.js');
const runner = require('../src/js/run.js');

// A fixture bank shaped like the real one: every category, region tags on
// countries/capitals, oceans on islands/seas, sizes everywhere.
const entry = (category, name, magnitude, extra = {}) => ({
  id: `${category}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  category,
  name,
  aliases: [],
  magnitude,
  ...extra
});

const EUROPE = ['Europe', 'Western Europe'];
const RAW = {
  cities: [
    entry('city', 'Lyon', 40000, { size: 520000, region: EUROPE, country: 'France', flag: ['blue', 'white', 'red'] }),
    entry('city', 'Marseille', 45000, { size: 870000, region: EUROPE, country: 'France', flag: ['blue', 'white', 'red'] }),
    entry('city', 'Munich', 60000, { size: 1500000, region: EUROPE, country: 'Germany', flag: ['black', 'red', 'yellow'] }),
    entry('city', 'Hamburg', 50000, { size: 1900000, region: EUROPE, country: 'Germany', flag: ['black', 'red', 'yellow'] }),
    entry('city', 'Barcelona', 90000, { size: 1600000, region: EUROPE, country: 'Spain', flag: ['red', 'yellow'] }),
    entry('city', 'Milan', 70000, { size: 1400000, region: EUROPE, country: 'Italy', flag: ['green', 'white', 'red'] }),
    entry('city', 'Cork', 12000, { size: 220000, region: EUROPE, country: 'Ireland', flag: ['green', 'white', 'orange'] }),
    entry('city', 'Mumbai', 150000, { size: 12500000, region: ['Asia', 'South Asia'], country: 'India', flag: ['orange', 'white', 'green', 'blue'] }),
    entry('city', 'Shanghai', 140000, { size: 24900000, region: ['Asia', 'East Asia'], country: 'China', flag: ['red', 'yellow'] }),
    entry('city', 'Mombasa', 9000, { size: 1200000, region: ['Africa', 'East Africa'], country: 'Kenya', flag: ['black', 'red', 'green', 'white'] })
  ],
  countries: [
    entry('country', 'France', 250000, { size: 68000000, region: EUROPE, flag: ['blue', 'white', 'red'] }),
    entry('country', 'Germany', 240000, { size: 83000000, region: EUROPE, flag: ['black', 'red', 'yellow'] }),
    entry('country', 'Spain', 200000, { size: 47000000, region: EUROPE, flag: ['red', 'yellow'] }),
    entry('country', 'Italy', 210000, { size: 59000000, region: EUROPE, flag: ['green', 'white', 'red'] }),
    entry('country', 'Ireland', 120000, { size: 5200000, region: EUROPE, flag: ['green', 'white', 'orange'] }),
    entry('country', 'Malta', 60000, { size: 540000, region: EUROPE, flag: ['white', 'red'] }),
    entry('country', 'Luxembourg', 70000, { size: 660000, region: EUROPE, flag: ['red', 'white', 'blue'] }),
    entry('country', 'Iceland', 90000, { size: 380000, region: EUROPE, flag: ['blue', 'white', 'red'] }),
    entry('country', 'India', 500000, { size: 1428000000, region: ['Asia', 'South Asia'], flag: ['orange', 'white', 'green', 'blue'] }),
    entry('country', 'China', 480000, { size: 1425000000, region: ['Asia', 'East Asia'], flag: ['red', 'yellow'], aliases: ['PRC', "People's Republic of China"] }),
    entry('country', 'Kenya', 55000, { size: 55000000, region: ['Africa', 'East Africa'], flag: ['black', 'red', 'green', 'white'] })
  ],
  capitals: [
    entry('capital', 'Paris', 150000, { size: 68000000, region: EUROPE }),
    entry('capital', 'Berlin', 140000, { size: 83000000, region: EUROPE }),
    entry('capital', 'Madrid', 100000, { size: 47000000, region: EUROPE }),
    entry('capital', 'Rome', 130000, { size: 59000000, region: EUROPE }),
    entry('capital', 'Dublin', 80000, { size: 5200000, region: EUROPE }),
    entry('capital', 'Valletta', 20000, { size: 540000, region: EUROPE }),
    entry('capital', 'Luxembourg City', 20000, { size: 660000, region: EUROPE }),
    entry('capital', 'Reykjavik', 40000, { size: 380000, region: EUROPE }),
    entry('capital', 'New Delhi', 90000, { size: 1428000000, region: ['Asia', 'South Asia'] }),
    entry('capital', 'Beijing', 120000, { size: 1425000000, region: ['Asia', 'East Asia'] }),
    entry('capital', 'Nairobi', 30000, { size: 55000000, region: ['Africa', 'East Africa'] })
  ],
  lakes: [
    entry('lake', 'Lake Superior', 30000, { size: 82100 }),
    entry('lake', 'Lake Victoria', 25000, { size: 68870 }),
    entry('lake', 'Loch Ness', 20000, { size: 56 }),
    entry('lake', 'Lake Bled', 5000, { size: 1.45 }),
    entry('lake', 'Lake Como', 15000, { size: 146 }),
    entry('lake', 'Lake Tahoe', 18000, { size: 496 }),
    entry('lake', 'Lake Garda', 9000, { size: 370 })
  ],
  rivers: [
    entry('river', 'Nile', 50000, { size: 6650 }),
    entry('river', 'Amazon', 45000, { size: 6400 }),
    entry('river', 'Thames', 30000, { size: 346 }),
    entry('river', 'Cam', 3000, { size: 64 }),
    entry('river', 'Seine', 20000, { size: 777 }),
    entry('river', 'Danube', 25000, { size: 2850 }),
    entry('river', 'Tay', 4000, { size: 188 })
  ],
  mountains: [
    entry('mountain', 'Mount Everest', 160000, { size: 8849 }),
    entry('mountain', 'K2', 90000, { size: 8611 }),
    entry('mountain', 'Ben Nevis', 26000, { size: 1345 }),
    entry('mountain', 'Box Hill', 3000, { size: 224 }),
    entry('mountain', 'Snowdon', 20000, { size: 1085 }),
    entry('mountain', 'Mont Blanc', 40000, { size: 4808 }),
    entry('mountain', 'Kilimanjaro', 60000, { size: 5895 })
  ],
  deserts: [
    entry('desert', 'Sahara', 42000, { size: 9200000 }),
    entry('desert', 'Gobi', 30000, { size: 1295000 }),
    entry('desert', 'Negev', 8000, { size: 13000 }),
    entry('desert', 'Mojave', 25000, { size: 124000 }),
    entry('desert', 'Atacama', 24000, { size: 105000 }),
    entry('desert', 'Namib', 12000, { size: 81000 }),
    entry('desert', 'Tabernas', 1000, { size: 280 })
  ],
  islands: [
    entry('island', 'Greenland', 110000, { size: 2166086, oceans: ['Arctic', 'Atlantic'] }),
    entry('island', 'Maui', 60000, { size: 1883, oceans: ['Pacific'] }),
    entry('island', 'Oahu', 55000, { size: 1545, oceans: ['Pacific'] }),
    entry('island', 'Tahiti', 30000, { size: 1045, oceans: ['Pacific'] }),
    entry('island', 'Kauai', 40000, { size: 1430, oceans: ['Pacific'] }),
    entry('island', 'Bora Bora', 35000, { size: 30.6, oceans: ['Pacific'] }),
    entry('island', 'Guam', 45000, { size: 543, oceans: ['Pacific'] }),
    entry('island', 'Viti Levu', 12000, { size: 10389, oceans: ['Pacific'] }),
    entry('island', 'Sicily', 50000, { size: 25711, oceans: ['Atlantic'] }),
    entry('island', 'Lundy', 9000, { size: 4.5, oceans: ['Atlantic'] }),
    entry('island', 'Madagascar', 80000, { size: 587041, oceans: ['Indian'] }),
    entry('island', 'Java', 70000, { size: 138794, oceans: ['Indian', 'Pacific'] }),
    entry('island', 'Isle Royale', 6000, { size: 535, oceans: [] })
  ],
  seas: [
    entry('sea_ocean', 'Pacific Ocean', 62000, { size: 165250000, oceans: ['Pacific'] }),
    entry('sea_ocean', 'Coral Sea', 8000, { size: 4791000, oceans: ['Pacific'] }),
    entry('sea_ocean', 'Caribbean Sea', 30000, { size: 2754000, oceans: ['Atlantic'] }),
    entry('sea_ocean', 'North Sea', 25000, { size: 570000, oceans: ['Atlantic'] }),
    entry('sea_ocean', 'Red Sea', 28000, { size: 438000, oceans: ['Indian'] }),
    entry('sea_ocean', 'Wadden Sea', 10000, { size: 10000, oceans: ['Atlantic'] }),
    entry('sea_ocean', 'Caspian Sea', 76000, { size: 371000, oceans: [] })
  ]
};

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const bank = promptBank.createBank(RAW);

/** A one-round run pinned to a specific slot. */
function runWith(slot) {
  const run = runner.createRun(bank, { rounds: 1 });
  run.state.slots[0] = slot;
  return run;
}

// --- ocean themes are derived from the data, not hand-listed -----------------

test('an island is accepted for the ocean it is in and rejected for one it is not', () => {
  // Hawaii is in the Pacific. That is data, not something a curator has to remember.
  const pacific = runWith({ category: 'island', ocean: 'Pacific' });
  assert.strictEqual(pacific.prompt().text, 'Name an island in the Pacific Ocean.');
  assert.strictEqual(pacific.submit('Sicily').status, 'wrong-scope');
  assert.strictEqual(pacific.submit('Maui').status, 'accepted');

  const atlantic = runWith({ category: 'island', ocean: 'Atlantic' });
  assert.strictEqual(atlantic.submit('Maui').status, 'wrong-scope');
  assert.strictEqual(atlantic.submit('Sicily').status, 'accepted');
});

test('a straddler counts for both of its oceans; a lake island counts for none', () => {
  assert.strictEqual(runWith({ category: 'island', ocean: 'Indian' }).submit('Java').status, 'accepted');
  assert.strictEqual(runWith({ category: 'island', ocean: 'Pacific' }).submit('Java').status, 'accepted');
  assert.strictEqual(runWith({ category: 'island', ocean: 'Atlantic' }).submit('Isle Royale').status, 'wrong-scope');
});

test('seas get ocean prompts with sea wording', () => {
  const run = runWith({ category: 'sea_ocean', ocean: 'Atlantic' });
  assert.strictEqual(run.prompt().text, 'Name a sea in the Atlantic Ocean.');
  assert.strictEqual(run.submit('Red Sea').status, 'wrong-scope');
  assert.strictEqual(run.submit('North Sea').status, 'accepted');
});

// --- size thresholds reuse the physical stat every entry already carries -----

test('a population threshold accepts small countries and rejects big ones', () => {
  const under = runWith({ category: 'country', size: { op: 'under', value: 1000000 } });
  assert.strictEqual(under.prompt().text, 'Name a country with a population under 1 million.');
  assert.strictEqual(under.submit('France').status, 'wrong-scope');
  assert.strictEqual(under.submit('Malta').status, 'accepted');

  const over = runWith({ category: 'country', size: { op: 'over', value: 1000000000 } });
  assert.strictEqual(over.prompt().text, 'Name a country with a population over 1 billion.');
  assert.strictEqual(over.submit('Malta').status, 'wrong-scope');
  assert.strictEqual(over.submit('India').status, 'accepted');
});

test('thresholds read naturally for each kind of stat', () => {
  const cases = [
    [{ category: 'river', size: { op: 'over', value: 3000 } }, 'Name a river longer than 3,000 km.', 'Nile', 'Cam'],
    [{ category: 'river', size: { op: 'under', value: 500 } }, 'Name a river shorter than 500 km.', 'Cam', 'Nile'],
    [{ category: 'mountain', size: { op: 'over', value: 8000 } }, 'Name a mountain over 8,000 m tall.', 'K2', 'Snowdon'],
    [{ category: 'mountain', size: { op: 'under', value: 1000 } }, 'Name a mountain under 1,000 m tall.', 'Box Hill', 'K2'],
    [{ category: 'island', size: { op: 'over', value: 100000 } }, 'Name an island bigger than 100,000 km².', 'Greenland', 'Lundy'],
    [{ category: 'lake', size: { op: 'under', value: 100 } }, 'Name a lake smaller than 100 km².', 'Loch Ness', 'Lake Superior']
  ];
  for (const [slot, text, yes, no] of cases) {
    const run = runWith(slot);
    assert.strictEqual(run.prompt().text, text);
    assert.strictEqual(run.submit(no).status, 'wrong-scope', `${no} should miss "${text}"`);
    assert.strictEqual(run.submit(yes).status, 'accepted', `${yes} should satisfy "${text}"`);
  }
});

// --- the draw: gentle opening, no repeats --------------------------------------

const promptsFor = (seed) => bank.drawSlots(seeded(seed)).map((slot) => bank.promptFor(slot));

test('the first two rounds are plain prompts in two different categories', () => {
  assert.strictEqual(promptBank.OPENING_ROUNDS, 2);
  for (let seed = 1; seed <= 60; seed++) {
    const opening = promptsFor(seed).slice(0, promptBank.OPENING_ROUNDS);
    for (const p of opening) assert.strictEqual(p.constrained, false, `seed ${seed}: "${p.text}" in the opening`);
    assert.strictEqual(new Set(opening.map((p) => p.category)).size, promptBank.OPENING_ROUNDS, `seed ${seed}: opening categories repeat`);
  }
});

test('no prompt text is ever shown twice in one run', () => {
  for (let seed = 1; seed <= 200; seed++) {
    const texts = promptsFor(seed).map((p) => p.text);
    assert.strictEqual(new Set(texts).size, texts.length, `seed ${seed}: ${texts.join(' | ')}`);
  }
});

test('the run keeps its shape: 15 rounds, every category once or twice', () => {
  for (let seed = 1; seed <= 60; seed++) {
    const slots = bank.drawSlots(seeded(seed));
    assert.strictEqual(slots.length, 15);
    const counts = new Map();
    for (const s of slots) counts.set(s.category, (counts.get(s.category) || 0) + 1);
    assert.strictEqual(counts.size, 9, `seed ${seed}`);
    for (const [c, n] of counts) assert.ok(n <= 2, `seed ${seed}: ${c} x${n}`);
  }
});

// --- against the shipped bank, where every modifier has room to exist --------

function loadShippedBank() {
  const { readFileSync } = require('node:fs');
  const path = require('node:path');
  const scope = {};
  for (const file of ['bank.js', 'themes.js']) {
    new Function('globalThis', readFileSync(path.join(__dirname, '..', 'src', 'data', file), 'utf8'))(scope);
  }
  return promptBank.createBank(scope.WORMILLION_BANK, scope.WORMILLION_THEMES, scope.WORMILLION_THEME_PROMPTS);
}

// Dig #1, pinned. A daily is the DRAW, not the bank: reordering categories,
// regions or themes - or touching drawSlots - changes what every past day
// asked, and a player's stored review would no longer match their answers.
// If this fails on purpose, that is the cost; update the pin knowingly.
// 2026-09-16: round 12 was "Name a lake smaller than 100 km²." until the US
// lakes fill (379 rows) took the lakes under 100 km² to 60.0% of the cohort,
// one entry over MAX_ELIGIBLE_SHARE; the guard now refuses that rule and the
// same seed draws "larger than". The bank, not the draw, moved the pin.
test('dig #1 (2026-09-12) still asks the fifteen prompts it shipped with', () => {
  const runner = require('../src/js/run.js');
  const shipped = loadShippedBank();
  const slots = runner.createRun(shipped, { mode: 'daily', dailyKey: '2026-09-12' }).state.slots;
  assert.deepStrictEqual(
    slots.map((slot) => shipped.promptFor(slot).text),
    [
      'Name a desert.',
      'Name a capital city.',
      'Name a lake with a short name (5 letters or fewer).',
      'Name a mountain with a double letter in its name.',
      'Name a river.',
      'Name a landlocked country.',
      "Name the largest city of a country that isn't its capital.",
      'Name a sea or ocean in the Antarctic.',
      'Name a country with a long name (12+ letters).',
      'Name a sea in the Pacific Ocean.',
      'Name an island bigger than 100,000 km².',
      'Name a lake larger than 100 km².',
      'Name an island with a short name (5 letters or fewer).',
      'Name a mountain in the Alps.',
      'Name a non-capital city in a country whose flag has black in it.'
    ]
  );
});

test('a length prompt accepts the name as typed or with its generic word trimmed (shipped bank)', () => {
  const runner = require('../src/js/run.js');
  const shipped = loadShippedBank();
  const on = (category, kind) => {
    const run = runner.createRun(shipped, { rounds: 1 });
    run.state.slots[0] = { category, letter: { kind } };
    return run;
  };
  // Short: the generic word doesn't count against you.
  assert.strictEqual(on('desert', 'short').submit('Monte Desert').status, 'accepted');
  assert.strictEqual(on('desert', 'short').submit('Monte').status, 'accepted');
  assert.strictEqual(on('sea_ocean', 'short').submit('Ceram Sea').status, 'accepted');
  // ...but the name proper still has to be short: Lake Superior has no
  // spelling that is, so it is simply out of scope, typed either way.
  const superior = on('lake', 'short').submit('Lake Superior');
  assert.strictEqual(superior.status, 'wrong-scope');
  assert.strictEqual(superior.length, undefined);
  assert.strictEqual(on('lake', 'short').submit('Superior').status, 'wrong-scope');
  // Long: what you typed counts in full, so the generic word helps.
  assert.strictEqual(on('mountain', 'long').submit('Mount Kilimanjaro').status, 'accepted');
  const kili = on('mountain', 'long').submit('Kilimanjaro');
  assert.strictEqual(kili.status, 'wrong-scope');
  assert.strictEqual(kili.length.letters, 11);
  // The reveal shows the real name, since typing it works. (Which desert is
  // rarest moves as the bank grows; what must hold is that its name lands.)
  const rarest = runner.rarestFor(shipped.promptFor({ category: 'desert', letter: { kind: 'short' } }));
  assert.strictEqual(on('desert', 'short').submit(rarest.name).status, 'accepted', rarest.name);
});

test('on a shipped length prompt the reveal is a spelling the prompt accepts', () => {
  const runner = require('../src/js/run.js');
  const matching = require('../src/js/matching.js');
  const shipped = loadShippedBank();
  for (const category of shipped.categories) {
    for (const kind of ['short', 'long']) {
      const prompt = shipped.promptFor({ category, letter: { kind } });
      if (prompt.lookup.size === 0) continue;
      const rarest = runner.rarestFor(prompt);
      assert.strictEqual(prompt.judgeTyped(matching.normalize(rarest.name)), null, `${category} ${kind}: ${rarest.name}`);
    }
  }
});

test('every kind of modifier actually gets drawn from the shipped bank', () => {
  const shipped = loadShippedBank();
  const seen = new Set();
  for (let seed = 1; seed <= 150; seed++) {
    for (const slot of shipped.drawSlots(seeded(seed))) {
      for (const kind of ['region', 'theme', 'ocean', 'flag', 'size', 'letter']) if (slot[kind]) seen.add(kind);
    }
  }
  for (const kind of ['region', 'theme', 'ocean', 'flag', 'size', 'letter']) assert.ok(seen.has(kind), `never drew a ${kind} modifier`);
});

test('after the opening, most rounds carry a modifier (Spec 3.8 ramp)', () => {
  // The ramp is 70% -> 100% over rounds 3..15, and a category's second
  // appearance is forced to differ from its first, so the realised rate sits
  // higher still. Guard the intent - "conditional prompts are the norm" -
  // rather than the exact constants.
  const shipped = loadShippedBank();
  let constrained = 0;
  let total = 0;
  for (let seed = 1; seed <= 150; seed++) {
    const later = shipped.drawSlots(seeded(seed)).slice(promptBank.OPENING_ROUNDS);
    for (const slot of later) {
      total += 1;
      if (shipped.promptFor(slot).constrained) constrained += 1;
    }
  }
  assert.ok(constrained / total >= 0.85, `only ${((constrained / total) * 100).toFixed(0)}% of later rounds constrained`);
});

test('"coastal" is derived as every country that is not landlocked', () => {
  const shipped = loadShippedBank();
  const country = shipped.themes.get('country');
  const landlocked = new Set(country.get('landlocked'));
  const coastal = country.get('coastal');
  assert.ok(landlocked.size > 0 && coastal.length > 0);
  assert.strictEqual(landlocked.size + coastal.length, shipped.counts.country, 'the two partition the cohort');
  for (const id of coastal) assert.ok(!landlocked.has(id), `${id} is in both`);

  const prompt = shipped.promptFor({ category: 'country', theme: 'coastal' });
  assert.strictEqual(prompt.text, 'Name a country with a coastline.');
  assert.strictEqual(prompt.scopeName, 'that pattern', 'a derived theme is not a place name to say "isn\'t in"');

  const coastalRun = () => {
    const run = runner.createRun(shipped, { rounds: 1 });
    run.state.slots[0] = { category: 'country', theme: 'coastal' };
    return run;
  };
  for (const name of ['Portugal', 'Kiribati', 'Kazakhstan', 'Switzerland', 'Bolivia']) {
    const expected = ['Kazakhstan', 'Switzerland', 'Bolivia'].includes(name) ? 'wrong-scope' : 'accepted';
    assert.strictEqual(coastalRun().submit(name).status, expected, name);
  }
});

test('an exact name is never spell-corrected into a different in-scope place', () => {
  // Regression (found by audit): on a narrowed prompt the subset lookup can't
  // see the rest of the category, so "Ireland" on "under 1 million" used to be
  // "corrected" to Iceland (380k, in scope) and scored. It is Ireland (5.2M).
  const run = runWith({ category: 'country', size: { op: 'under', value: 1000000 } });
  const result = run.submit('Ireland');
  assert.strictEqual(result.status, 'wrong-scope', 'Ireland is Ireland, not a typo for Iceland');
  assert.strictEqual(result.entry.name, 'Ireland');
  // A genuine typo of an in-scope name still corrects.
  const typo = run.submit('Icelnad');
  assert.strictEqual(typo.status, 'accepted');
  assert.strictEqual(typo.entry.name, 'Iceland');
  assert.strictEqual(typo.correctedFrom, 'Icelnad');
});

test('a length prompt judges the spelling you typed, not the entry', () => {
  // "China" is five letters and "People's Republic of China" is 22; each
  // counts for what it is, and the hint says how many letters you gave it.
  const long = () => runWith({ category: 'country', letter: { kind: 'long' } });
  const short = () => runWith({ category: 'country', letter: { kind: 'short' } });
  const miss = long().submit('China');
  assert.strictEqual(miss.status, 'wrong-scope');
  assert.deepStrictEqual(miss.length, { typed: 'China', letters: 5, need: '12 letters or more' });
  assert.strictEqual(long().submit("People's Republic of China").status, 'accepted');
  assert.strictEqual(short().submit('China').status, 'accepted');
  assert.strictEqual(short().submit('PRC').status, 'accepted');
  const tooLong = short().submit("People's Republic of China");
  assert.strictEqual(tooLong.status, 'wrong-scope');
  assert.strictEqual(tooLong.length.letters, 22);
  // A corrected typo is judged - and shown - as the spelling it was corrected to.
  const typo = long().submit('Chnia');
  assert.strictEqual(typo.status, 'wrong-scope');
  assert.strictEqual(typo.length.typed, 'China');
  // An entry with no qualifying spelling at all is simply out of scope.
  assert.strictEqual(long().submit('Malta').status, 'wrong-scope');
  assert.strictEqual(long().submit('Malta').length, undefined);
});

test('an initialism alias is for typing, not for letter rules', () => {
  const nyc = { category: 'city', name: 'New York City', aliases: ['New York', 'NYC'] };
  nyc.variants = promptBank.variantsOf(nyc);
  nyc.spellings = promptBank.spellingsOf(nyc);
  assert.ok(!promptBank.satisfiesLetter(nyc, { kind: 'ends', letter: 'c' }), 'NYC is not a spelling');
  assert.ok(promptBank.satisfiesLetter(nyc, { kind: 'ends', letter: 'y' }));
  assert.ok(promptBank.satisfiesLetter(nyc, { kind: 'ends', letter: 'k' }), 'New York does end in K');
  assert.ok(!promptBank.satisfiesLetter(nyc, { kind: 'short' }), 'three letters of NYC do not make it a short name');
  const uae = { category: 'country', name: 'United Arab Emirates', aliases: ['UAE', 'Emirates'] };
  uae.variants = promptBank.variantsOf(uae);
  assert.ok(!promptBank.satisfiesLetter(uae, { kind: 'ends', letter: 'e' }));
  assert.ok(promptBank.satisfiesLetter(uae, { kind: 'ends', letter: 's' }));
});

test('a "Rio X" alias is for typing: Bogota does not start with R, but the Rio Grande does', () => {
  const bogota = { category: 'river', name: 'Bogota', aliases: ['Rio Bogota'] };
  bogota.variants = promptBank.variantsOf(bogota);
  assert.deepStrictEqual(bogota.variants, ['bogota']);
  assert.ok(!promptBank.satisfiesLetter(bogota, { kind: 'starts', letter: 'r' }));
  assert.ok(!promptBank.satisfiesLetter(bogota, { kind: 'contains', letter: 'i' }));
  // "Rio" is the name where it is the name, like "Loch" in Loch Ness.
  const grande = { category: 'river', name: 'Rio Grande', aliases: ['Rio Bravo'] };
  grande.variants = promptBank.variantsOf(grande);
  assert.ok(promptBank.satisfiesLetter(grande, { kind: 'starts', letter: 'r' }));
  assert.ok(grande.variants.includes('rio bravo'), 'a different name is still a spelling');
  // The shipped bank: the reveal for "starts with R" is a river that starts with R.
  const shipped = loadShippedBank();
  const rule = { category: 'river', letter: { kind: 'starts', letter: 'r' } };
  const on = () => {
    const r = runner.createRun(shipped, { rounds: 1 });
    r.state.slots[0] = rule;
    return r;
  };
  assert.strictEqual(on().submit('Magdalena').status, 'wrong-scope');
  assert.strictEqual(on().submit('Rio Grande').status, 'accepted');
  assert.ok(/^r/i.test(runner.rarestFor(shipped.promptFor(rule)).name.replace(/^the /i, '')));
});

test('a digit is a character: K2 starts with K, has a K, does not end in K', () => {
  const k2 = bank.cohorts.get('mountain').byId.get('mountain-k2');
  assert.ok(promptBank.satisfiesLetter(k2, { kind: 'starts', letter: 'k' }));
  assert.ok(promptBank.satisfiesLetter(k2, { kind: 'contains', letter: 'k' }));
  assert.ok(!promptBank.satisfiesLetter(k2, { kind: 'ends', letter: 'k' }), 'it ends in 2');
  assert.ok(promptBank.satisfiesLetter(k2, { kind: 'short' }), 'two characters is a short name');
  assert.strictEqual(runWith({ category: 'mountain', letter: { kind: 'ends', letter: 'k' } }).submit('K2').status, 'wrong-scope');
  assert.strictEqual(runWith({ category: 'mountain', letter: { kind: 'starts', letter: 'k' } }).submit('K2').status, 'accepted');
});

test('seas keep their whole name for letter rules: Black Sea ends in A', () => {
  assert.strictEqual(runWith({ category: 'sea_ocean', letter: { kind: 'ends', letter: 'a' } }).submit('Red Sea').status, 'accepted');
  assert.strictEqual(runWith({ category: 'sea_ocean', letter: { kind: 'contains', letter: 's' } }).submit('Red Sea').status, 'accepted');
  assert.strictEqual(runWith({ category: 'sea_ocean', letter: { kind: 'starts', letter: 'p' } }).submit('Pacific Ocean').status, 'accepted');
  // ...while "Lake" and "Mount" still don't count for lakes and mountains.
  assert.strictEqual(runWith({ category: 'lake', letter: { kind: 'starts', letter: 'l' } }).submit('Lake Superior').status, 'wrong-scope');
});

test('a size range counts for either end: the Amur is 2,824 km or 4,444 km', () => {
  const amur = { size: 2824, sizeRange: [2824, 4444] };
  assert.ok(promptBank.satisfiesSize(amur, { op: 'over', value: 3000 }));
  assert.ok(promptBank.satisfiesSize(amur, { op: 'under', value: 3000 }));
  assert.ok(!promptBank.satisfiesSize(amur, { op: 'over', value: 5000 }));
  assert.ok(!promptBank.satisfiesSize(amur, { op: 'under', value: 1000 }));
  const shipped = loadShippedBank();
  const river = (op, value, name) => {
    const run = runner.createRun(shipped, { rounds: 1 });
    run.state.slots[0] = { category: 'river', size: { op, value } };
    return run.submit(name).status;
  };
  assert.strictEqual(river('over', 3000, 'Amur'), 'accepted');
  assert.strictEqual(river('under', 3000, 'Amur'), 'accepted');
  assert.strictEqual(river('over', 5000, 'Mississippi'), 'accepted', 'with the Missouri');
});

test('a flag rule accepts a country whose flag carries every listed colour', () => {
  const green = bank.promptFor({ category: 'country', flag: { colours: ['green'] } });
  assert.strictEqual(green.text, 'Name a country whose flag has green in it.');
  assert.strictEqual(green.constrained, true);
  assert.ok(green.lookup.has('italy') && green.lookup.has('kenya'));
  assert.ok(!green.lookup.has('france'));

  const pair = bank.promptFor({ category: 'country', flag: { colours: ['black', 'red'] } });
  assert.strictEqual(pair.text, 'Name a country whose flag has both black and red in it.');
  assert.ok(pair.lookup.has('germany') && pair.lookup.has('kenya'));
  assert.ok(!pair.lookup.has('china'), 'red alone is not enough');

  const run = runner.createRun(bank, { rounds: 1 });
  run.state.slots[0] = { category: 'country', flag: { colours: ['orange'] } };
  const miss = run.submit('France');
  assert.strictEqual(miss.status, 'wrong-scope');
  assert.strictEqual(miss.scopeName, 'that pattern', 'the UI says "doesn\'t fit this one", not "isn\'t in orange"');
  assert.strictEqual(run.submit('Ireland').status, 'accepted');
});

test('drawn flag rules leave enough answers and rule enough out (shipped bank)', () => {
  const shipped = loadShippedBank();
  let drawn = 0;
  const drawnFor = new Set();
  for (let seed = 1; seed <= 300; seed++) {
    for (const slot of shipped.drawSlots(seeded(seed))) {
      if (!slot.flag) continue;
      drawn += 1;
      drawnFor.add(slot.category);
      // Judged against the cohort the rule was drawn for: India alone puts a
      // dozen cities behind "blue and orange", but only four countries.
      const cohort = shipped.cohorts.get(slot.category);
      const n = cohort.entries.filter((entry) => promptBank.satisfiesFlag(entry, slot.flag)).length;
      assert.ok(n >= promptBank.MIN_ELIGIBLE, `${slot.flag.colours}: only ${n} answers`);
      assert.ok(n <= cohort.entries.length * 0.6, `${slot.flag.colours}: ${n} answers barely narrows the field`);
      assert.deepStrictEqual(slot.flag.colours, [...slot.flag.colours].sort(), 'pairs are in a fixed order');
    }
  }
  assert.ok(drawn > 0, 'expected some flag prompts across 300 runs');
  assert.deepStrictEqual([...drawnFor].sort(), ['capital', 'city', 'country'], 'every cohort with flags gets flag prompts');
});

test('flag colours are read generously in the shipped data', () => {
  // Emblem colours count (Spain's coat of arms has blue, Peru's has green),
  // and near-colours fold into the palette (Sri Lanka's maroon is red, Cyprus's
  // copper is orange). A player who knows the flag must never be told no.
  const shipped = loadShippedBank();
  const accepts = (colours, name) => {
    const run = runner.createRun(shipped, { rounds: 1 });
    run.state.slots[0] = { category: 'country', flag: { colours } };
    return run.submit(name).status;
  };
  assert.strictEqual(accepts(['blue'], 'Spain'), 'accepted');
  assert.strictEqual(accepts(['green'], 'Peru'), 'accepted');
  assert.strictEqual(accepts(['red'], 'Sri Lanka'), 'accepted');
  assert.strictEqual(accepts(['orange'], 'Cyprus'), 'accepted');
  assert.strictEqual(accepts(['yellow'], 'Germany'), 'accepted', 'gold is yellow');
  assert.strictEqual(accepts(['blue'], 'Argentina'), 'accepted', 'light blue is blue');
  assert.strictEqual(accepts(['green', 'orange'], 'Ireland'), 'accepted');
  assert.strictEqual(accepts(['green'], 'Japan'), 'wrong-scope');
  assert.strictEqual(accepts(['black', 'blue'], 'Germany'), 'wrong-scope');
});

test('capitals carry their country\'s flag and get their own wording (shipped bank)', () => {
  const shipped = loadShippedBank();
  const prompt = shipped.promptFor({ category: 'capital', flag: { colours: ['green'] } });
  assert.strictEqual(prompt.text, 'Name the capital of a country whose flag has green in it.');
  const pair = shipped.promptFor({ category: 'capital', flag: { colours: ['black', 'red'] } });
  assert.strictEqual(pair.text, 'Name the capital of a country whose flag has both black and red in it.');

  const accepts = (colours, name) => {
    const run = runner.createRun(shipped, { rounds: 1 });
    run.state.slots[0] = { category: 'capital', flag: { colours } };
    return run.submit(name).status;
  };
  assert.strictEqual(accepts(['green'], 'Abuja'), 'accepted', 'Nigeria is green and white');
  assert.strictEqual(accepts(['green'], 'Tokyo'), 'wrong-scope');
  assert.strictEqual(accepts(['red', 'white'], 'Sacramento'), 'accepted', 'a state capital carries the US flag');
  assert.strictEqual(accepts(['green'], 'Sacramento'), 'wrong-scope');
});

test('capital themes: not the largest city, on the coast, US state capitals (shipped bank)', () => {
  const shipped = loadShippedBank();
  const themes = shipped.themes.get('capital');
  assert.strictEqual(themes.get('US state capitals').length, 50, 'all fifty');
  assert.ok(themes.get('not the largest city').length >= 40);
  assert.ok(themes.get('on the coast').length >= 80);

  const submit = (theme, name) => {
    const run = runner.createRun(shipped, { rounds: 1 });
    run.state.slots[0] = { category: 'capital', theme };
    return run.submit(name).status;
  };
  assert.strictEqual(shipped.promptFor({ category: 'capital', theme: 'US state capitals' }).text, 'Name a US state capital.');
  assert.strictEqual(submit('US state capitals', 'Sacramento'), 'accepted');
  assert.strictEqual(submit('US state capitals', 'St Paul'), 'accepted', 'alias');
  assert.strictEqual(submit('US state capitals', 'Paris'), 'wrong-scope');

  assert.strictEqual(
    shipped.promptFor({ category: 'capital', theme: 'not the largest city' }).text,
    "Name a capital that isn't its country's largest city."
  );
  assert.strictEqual(submit('not the largest city', 'Canberra'), 'accepted');
  assert.strictEqual(submit('not the largest city', 'Washington'), 'accepted', 'alias of Washington DC');
  assert.strictEqual(submit('not the largest city', 'Tokyo'), 'wrong-scope');

  assert.strictEqual(shipped.promptFor({ category: 'capital', theme: 'on the coast' }).text, 'Name a capital city on the coast.');
  assert.strictEqual(submit('on the coast', 'Lisbon'), 'accepted');
  assert.strictEqual(submit('on the coast', 'Honolulu'), 'accepted', 'state capitals on the water count too');
  assert.strictEqual(submit('on the coast', 'Madrid'), 'wrong-scope');

  // A state capital is a capital city: the plain prompt takes it.
  const plain = runner.createRun(shipped, { rounds: 1 });
  plain.state.slots[0] = { category: 'capital' };
  assert.strictEqual(plain.submit('Boise').status, 'accepted');
});

test('a derived theme only exists when the set it derives from does', () => {
  // The fixture bank ships no themes at all, so there is nothing to derive from.
  assert.strictEqual(bank.themes.has('country'), false);
});

test('the shipped bank never repeats a prompt and every prompt has an answer', () => {
  const shipped = loadShippedBank();
  for (let seed = 1; seed <= 150; seed++) {
    const prompts = shipped.drawSlots(seeded(seed)).map((slot) => shipped.promptFor(slot));
    const texts = prompts.map((p) => p.text);
    assert.strictEqual(new Set(texts).size, 15, `seed ${seed}: ${texts.join(' | ')}`);
    for (const p of prompts) assert.ok(p.lookup.size > 0, `seed ${seed}: no answers for "${p.text}"`);
    for (const p of prompts.slice(0, promptBank.OPENING_ROUNDS)) assert.strictEqual(p.constrained, false, `seed ${seed}: "${p.text}" in the opening`);
  }
});

test('region prompts take "the" where English does', () => {
  const shipped = loadShippedBank();
  assert.strictEqual(shipped.promptFor({ category: 'country', region: 'Caribbean' }).text, 'Name a country in the Caribbean.');
  assert.strictEqual(shipped.promptFor({ category: 'country', region: 'Caribbean' }).scopeName, 'the Caribbean');
  assert.strictEqual(shipped.promptFor({ category: 'capital', region: 'Middle East' }).text, 'Name a capital city in the Middle East.');
  assert.strictEqual(shipped.promptFor({ category: 'country', region: 'Europe' }).text, 'Name a country in Europe.');
});

test('audit fixes hold in the shipped data', () => {
  const shipped = loadShippedBank();
  const status = (slot, name) => {
    const run = runner.createRun(shipped, { rounds: 1 });
    run.state.slots[0] = slot;
    return run.submit(name).status;
  };
  assert.strictEqual(status({ category: 'lake' }, 'Aral Sea'), 'accepted', 'the Aral Sea is a lake like the Caspian');
  assert.strictEqual(status({ category: 'lake', theme: 'saltwater' }, 'Aral Sea'), 'accepted');
  assert.strictEqual(status({ category: 'island' }, 'Big Island'), 'accepted');
  assert.strictEqual(status({ category: 'mountain', size: { op: 'over', value: 8000 } }, 'Gasherbrum II'), 'accepted', 'all 14 eight-thousanders');
  assert.strictEqual(status({ category: 'mountain', theme: 'volcanoes' }, 'Mauna Kea'), 'accepted');
  assert.strictEqual(status({ category: 'mountain', theme: 'volcanoes' }, 'Chimborazo'), 'accepted');
  assert.strictEqual(status({ category: 'island', theme: 'the Caribbean' }, 'Saint Lucia'), 'accepted');
  assert.strictEqual(status({ category: 'country', flag: { colours: ['red'] } }, 'Guatemala'), 'accepted', 'the quetzal');
  assert.strictEqual(status({ category: 'desert', size: { op: 'over', value: 100000 } }, 'Chalbi Desert'), 'accepted', 'sits exactly on the threshold');
  assert.strictEqual(status({ category: 'country', letter: { kind: 'starts', letter: 't' } }, 'Kiribati'), 'wrong-scope', 'Tarawa is its capital, not its name');
  assert.strictEqual(status({ category: 'country', region: 'Europe' }, 'Australia'), 'wrong-scope', 'not Austria');
  assert.strictEqual(status({ category: 'country', size: { op: 'over', value: 100000000 } }, 'Vietnam'), 'accepted', 'passed 100 million in 2023');
  assert.strictEqual(status({ category: 'capital', size: { op: 'over', value: 100000000 } }, 'Hanoi'), 'accepted');
  // A bare loose form goes to the entry that owns it by name, alias or no alias.
  const named = (slot, name) => {
    const run = runner.createRun(shipped, { rounds: 1 });
    run.state.slots[0] = slot;
    return run.submit(name).entry?.name;
  };
  assert.strictEqual(named({ category: 'sea_ocean' }, 'Arabian'), 'Arabian Sea', 'not lost to the Persian Gulf\'s "Arabian Gulf"');
  assert.strictEqual(named({ category: 'sea_ocean' }, 'Arabian Gulf'), 'Persian Gulf');
  assert.strictEqual(named({ category: 'desert' }, 'Great Salt'), 'Great Salt Lake Desert', 'Dasht-e Kavir only has it as an alias');
  // Island nations are named as the world names them - no invented "Island".
  assert.strictEqual(named({ category: 'island' }, 'Cuba'), 'Cuba');
  assert.strictEqual(named({ category: 'island' }, 'St Lucia'), 'Saint Lucia');
  assert.strictEqual(named({ category: 'island', theme: 'the Caribbean' }, 'Jamaica'), 'Jamaica');
  assert.strictEqual(named({ category: 'capital' }, 'Singapore'), 'Singapore');
  // ...so "Jamaica Island" can no longer count as a 12-letter name.
  const long = runner.createRun(shipped, { rounds: 1 });
  long.state.slots[0] = { category: 'island', letter: { kind: 'long' } };
  assert.strictEqual(long.submit('Jamaica').status, 'wrong-scope');
  assert.strictEqual(long.submit('Jamaica Island').status, 'wrong-scope', 'typed filler finds Jamaica, which is not eligible');
  assert.strictEqual(named({ category: 'island' }, 'Cuba Island'), 'Cuba');
  assert.strictEqual(named({ category: 'mountain' }, 'Mount Denali'), 'Denali');
});

test('cities are a cohort of non-capitals, and every prompt says so (shipped bank)', () => {
  const shipped = loadShippedBank();
  const submit = (slot, name) => {
    const run = runner.createRun(shipped, { rounds: 1 });
    run.state.slots[0] = slot;
    return run.submit(name);
  };
  const text = (slot) => shipped.promptFor(slot).text;

  assert.strictEqual(text({ category: 'city' }), "Name a city that isn't a national capital.");
  assert.strictEqual(shipped.promptFor({ category: 'city' }).label, 'City (not a capital)');
  // Every narrowed city prompt says "non-capital" in the sentence, not just the badge.
  assert.strictEqual(text({ category: 'city', region: 'Caribbean' }), 'Name a non-capital city in the Caribbean.');
  assert.strictEqual(text({ category: 'city', size: { op: 'over', value: 5000000 } }), 'Name a non-capital city with a population over 5 million.');
  assert.strictEqual(text({ category: 'city', flag: { colours: ['green'] } }), 'Name a non-capital city in a country whose flag has green in it.');
  assert.strictEqual(text({ category: 'city', letter: { kind: 'starts', letter: 'm' } }), 'Name a non-capital city that starts with M.');
  assert.strictEqual(text({ category: 'city', letter: { kind: 'long' } }), 'Name a non-capital city with a long name (12+ letters).');
  assert.strictEqual(text({ category: 'city', theme: 'largest in its country' }), "Name the largest city of a country that isn't its capital.");

  // Cities, big state capitals, cities that share a name with a capital elsewhere.
  for (const name of ['New York', 'Sao Paulo', 'Mumbai', 'Phoenix', 'Cape Town', 'Timbuktu']) {
    assert.strictEqual(submit({ category: 'city' }, name).status, 'accepted', name);
  }
  // A national capital is a real place from another category, named as such.
  const paris = submit({ category: 'city' }, 'Paris');
  assert.strictEqual(paris.status, 'unrecognized');
  assert.strictEqual(paris.elsewhere.category, 'capital');
  assert.strictEqual(promptBank.wantsPhrase('city'), 'non-capital city');
  // ...and a city on a capital round is nudged the other way.
  assert.strictEqual(submit({ category: 'capital' }, 'Lagos').elsewhere.category, 'city');

  // Region, size, flag and theme all narrow the cohort.
  assert.strictEqual(submit({ category: 'city', region: 'South America' }, 'Guayaquil').status, 'accepted');
  assert.strictEqual(submit({ category: 'city', region: 'South America' }, 'Lagos').status, 'wrong-scope');
  assert.strictEqual(submit({ category: 'city', size: { op: 'over', value: 10000000 } }, 'Shanghai').status, 'accepted');
  assert.strictEqual(submit({ category: 'city', size: { op: 'over', value: 10000000 } }, 'Cork').status, 'wrong-scope');
  assert.strictEqual(submit({ category: 'city', flag: { colours: ['green'] } }, 'Lagos').status, 'accepted', 'Nigeria');
  assert.strictEqual(submit({ category: 'city', theme: 'largest in its country' }, 'Istanbul').status, 'accepted');
  assert.strictEqual(submit({ category: 'city', theme: 'largest in its country' }, 'Milan').status, 'wrong-scope', 'Rome is larger');

  // A city region prompt is only ever drawn where at least MIN_ELIGIBLE cities live.
  let regionDraws = 0;
  for (let seed = 1; seed <= 300; seed++) {
    for (const slot of shipped.drawSlots(seeded(seed))) {
      if (slot.category !== 'city' || !slot.region) continue;
      regionDraws += 1;
      assert.ok(shipped.promptFor(slot).lookup.size >= promptBank.MIN_ELIGIBLE, `${slot.region}: ${shipped.promptFor(slot).lookup.size} cities`);
    }
  }
  assert.ok(regionDraws > 0);
});

test('the big island nations answer as islands (shipped bank)', () => {
  const shipped = loadShippedBank();
  const island = (slot, name) => {
    const run = runner.createRun(shipped, { rounds: 1 });
    run.state.slots[0] = slot;
    const result = run.submit(name);
    return `${result.status}${result.entry ? ':' + result.entry.name : ''}`;
  };
  // One country, one archipelago: an entry of its own.
  for (const name of ['Japan', 'Philippines', 'Indonesia', 'New Zealand']) {
    assert.strictEqual(island({ category: 'island' }, name), `accepted:${name}`);
  }
  assert.strictEqual(island({ category: 'island', ocean: 'Pacific' }, 'Japan'), 'accepted:Japan');
  assert.strictEqual(island({ category: 'island', ocean: 'Indian' }, 'Indonesia'), 'accepted:Indonesia');
  assert.strictEqual(island({ category: 'island', size: { op: 'over', value: 100000 } }, 'New Zealand'), 'accepted:New Zealand');
  // A country on a shared or eponymous island: an alias on that island, as Haiti is on Hispaniola.
  assert.strictEqual(island({ category: 'island' }, 'United Kingdom'), 'accepted:Great Britain');
  assert.strictEqual(island({ category: 'island' }, 'UK'), 'accepted:Great Britain');
  assert.strictEqual(island({ category: 'island' }, 'Papua New Guinea'), 'accepted:New Guinea');
  assert.strictEqual(island({ category: 'island' }, 'Brunei'), 'accepted:Borneo');
  // The country is not one of its own islands: "Name an island in Japan" wants Honshu, not Japan.
  assert.strictEqual(island({ category: 'island', theme: 'Japan' }, 'Japan'), 'wrong-scope:Japan');
  assert.strictEqual(island({ category: 'island', theme: 'Japan' }, 'Honshu'), 'accepted:Honshu');
  // ...and on a country round they are still countries.
  assert.strictEqual(island({ category: 'country' }, 'Japan'), 'accepted:Japan');
});

test('Hawaii is in the Pacific, in the shipped data', () => {
  const shipped = loadShippedBank();
  const pacific = () => {
    const run = runner.createRun(shipped, { rounds: 1 });
    run.state.slots[0] = { category: 'island', ocean: 'Pacific' };
    return run;
  };
  for (const name of ['Maui', 'Oahu', 'Kauai', 'Hawaii']) {
    const result = pacific().submit(name);
    assert.strictEqual(result.status, 'accepted', `${name}: ${result.status}`);
  }
  assert.strictEqual(pacific().submit('Sicily').status, 'wrong-scope');
});

test('a letter-rule miss says which letter is missing', () => {
  const { letterMissText } = promptBank;
  assert.strictEqual(letterMissText('Lake Erie', { kind: 'double' }), 'Lake Erie has no double letter');
  assert.strictEqual(letterMissText('Fuji', { kind: 'starts', letter: 'm' }), "Fuji doesn't start with M");
  assert.strictEqual(letterMissText('Nile', { kind: 'contains', letter: 't' }), 'Nile has no T in it');
  assert.strictEqual(letterMissText('Everest', { kind: 'ends', letter: 'a' }), "Everest doesn't end in A");
  // ...and names the word the rule ignored, in the name's own casing
  assert.strictEqual(letterMissText('Bear Creek', { kind: 'double' }, 'river'), "Bear Creek has no double letter (Creek doesn't count)");
  assert.strictEqual(letterMissText('Mount Fuji', { kind: 'starts', letter: 'm' }, 'mountain'), "Mount Fuji doesn't start with M (Mount doesn't count)");
  assert.strictEqual(letterMissText('Black Sea', { kind: 'ends', letter: 'k' }, 'sea_ocean'), "Black Sea doesn't end in K");
  assert.strictEqual(letterMissText('Rio Grande', { kind: 'starts', letter: 'g' }, 'river'), "Rio Grande doesn't start with G");
});

test('creek, fork and branch are generic for the letter rules but not for matching; bayou leads the name', () => {
  const bank = promptBank.createBank({
    ...RAW,
    rivers: [
      ...RAW.rivers,
      entry('river', 'Bear Creek', 40, { size: 90 }),
      entry('river', 'Bear', 400, { size: 560, aliases: ['Bear River'] }),
      entry('river', 'Bayou Teche', 1200, { size: 200, aliases: ['Teche'] }),
      entry('river', 'Rock Creek', 60, { size: 100 }),
      entry('river', 'Sugar Creek', 70, { size: 100 })
    ]
  });
  const runner = require('../src/js/run.js');
  const on = (letter, input) => {
    const run = runner.createRun(bank, { rounds: 1 });
    run.state.slots[0] = { category: 'river', letter };
    return run.submit(input);
  };
  // Bear Creek and Bear are two rivers: the matcher keeps "creek"
  assert.strictEqual(on({ kind: 'contains', letter: 'e' }, 'Bear Creek').entry.id, 'river-bear-creek');
  assert.strictEqual(on({ kind: 'contains', letter: 'e' }, 'Bear').entry.id, 'river-bear');
  // ...but "Bear Creek" no more ends in K than "Lake Tahoe" ends in E
  assert.strictEqual(on({ kind: 'ends', letter: 'k' }, 'Bear Creek').status, 'wrong-scope');
  assert.strictEqual(on({ kind: 'ends', letter: 'k' }, 'Rock Creek').status, 'accepted');
  assert.strictEqual(on({ kind: 'double' }, 'Bear Creek').status, 'wrong-scope');
  // ...while Bayou leads the name the way Rio does: Bayou Teche starts with B
  // (and with T through its alias "Teche" - an alias is a spelling of the name)
  assert.strictEqual(on({ kind: 'starts', letter: 'b' }, 'Bayou Teche').status, 'accepted');
  assert.strictEqual(on({ kind: 'starts', letter: 't' }, 'Bayou Teche').status, 'accepted');
  assert.strictEqual(on({ kind: 'starts', letter: 'e' }, 'Bayou Teche').status, 'wrong-scope');
  // length rules: the trimmed spelling counts too ("Sugar" is short), and so does the one typed
  assert.strictEqual(on({ kind: 'short' }, 'Sugar Creek').status, 'accepted');
  assert.strictEqual(on({ kind: 'long' }, 'Bear Creek').status, 'wrong-scope');
});

test('a sea theme says "sea" unless an ocean is actually in it (shipped bank)', () => {
  const shipped = loadShippedBank();
  const text = (theme) => shipped.promptFor({ category: 'sea_ocean', theme }).text;
  assert.strictEqual(text('the Americas'), 'Name a sea in the Americas.');
  assert.strictEqual(text('Europe'), 'Name a sea in Europe.');
  assert.strictEqual(text('the Antarctic'), 'Name a sea or ocean in the Antarctic.'); // the Southern Ocean is a member
  // The plain and ocean-scoped prompts are unchanged.
  assert.strictEqual(shipped.promptFor({ category: 'sea_ocean' }).text, 'Name a sea or ocean.');
  assert.strictEqual(shipped.promptFor({ category: 'sea_ocean', ocean: 'Pacific' }).text, 'Name a sea in the Pacific Ocean.');
});

test('a size of 0 ("no sourced figure") answers every prompt but a size threshold', () => {
  // 2026-09-16: bays, straits and small islands mostly have no area in any
  // reference; they are real places and go in with size 0 (SPEC 4).
  const bank = promptBank.createBank({
    ...RAW,
    islands: [...RAW.islands, entry('island', 'Skomer', 900, { size: 0, oceans: ['Atlantic'] })]
  });
  const runner = require('../src/js/run.js');
  const on = (slot, input) => {
    const run = runner.createRun(bank, { rounds: 1 });
    run.state.slots[0] = slot;
    return run.submit(input);
  };
  assert.strictEqual(on({ category: 'island' }, 'Skomer').status, 'accepted');
  assert.strictEqual(on({ category: 'island', ocean: 'Atlantic' }, 'Skomer').status, 'accepted');
  assert.strictEqual(on({ category: 'island', letter: { kind: 'starts', letter: 's' } }, 'Skomer').status, 'accepted');
  // unknown is neither small nor large
  assert.strictEqual(on({ category: 'island', size: { op: 'under', value: 100 } }, 'Skomer').status, 'wrong-scope');
  assert.strictEqual(on({ category: 'island', size: { op: 'over', value: 1 } }, 'Skomer').status, 'wrong-scope');
  assert.strictEqual(on({ category: 'island', size: { op: 'under', value: 100 } }, 'Lundy').status, 'accepted');
});
