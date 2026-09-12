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
    entry('country', 'China', 480000, { size: 1425000000, region: ['Asia', 'East Asia'], flag: ['red', 'yellow'] }),
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

test('the first three rounds are plain prompts in three different categories', () => {
  for (let seed = 1; seed <= 60; seed++) {
    const opening = promptsFor(seed).slice(0, 3);
    for (const p of opening) assert.strictEqual(p.constrained, false, `seed ${seed}: "${p.text}" in the opening`);
    assert.strictEqual(new Set(opening.map((p) => p.category)).size, 3, `seed ${seed}: opening categories repeat`);
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
    assert.strictEqual(counts.size, 8, `seed ${seed}`);
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
  // The ramp is 70% -> 100% over rounds 4..15, and a category's second
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
  const cohort = shipped.cohorts.get('country');
  let drawn = 0;
  for (let seed = 1; seed <= 300; seed++) {
    for (const slot of shipped.drawSlots(seeded(seed))) {
      if (!slot.flag) continue;
      drawn += 1;
      const n = cohort.entries.filter((entry) => promptBank.satisfiesFlag(entry, slot.flag)).length;
      assert.ok(n >= promptBank.MIN_ELIGIBLE, `${slot.flag.colours}: only ${n} answers`);
      assert.ok(n <= cohort.entries.length * 0.6, `${slot.flag.colours}: ${n} answers barely narrows the field`);
      assert.deepStrictEqual(slot.flag.colours, [...slot.flag.colours].sort(), 'pairs are in a fixed order');
    }
  }
  assert.ok(drawn > 0, 'expected some flag prompts across 300 runs');
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
    for (const p of prompts.slice(0, 3)) assert.strictEqual(p.constrained, false, `seed ${seed}: "${p.text}" in the opening`);
  }
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
