const test = require('node:test');
const assert = require('node:assert');
const matching = require('../src/js/matching.js');
const promptBank = require('../src/js/promptBank.js');
const runner = require('../src/js/run.js');

// Same-name places (decision 5, 2026-09-18): a cohort may hold several
// entries with one bare name when each carries a `qualifier`. The round's
// scope picks among them; the most-viewed one answers a plain round; a
// famous holder of the name in another cohort keeps its nudge.

const entry = (category, id, name, magnitude, extra = {}) =>
  Object.assign({ id, category, name, aliases: [], magnitude, magnitudeUnit: 'pageviews_monthly', size: 1, source: 'fixture' }, extra);

const EUROPE = ['Europe', 'Western Europe'];
const AMERICA = ['North America'];
const AFRICA = ['Africa', 'East Africa'];
const country = (name, capital, magnitude, region) => [
  entry('country', `country-${name.toLowerCase()}`, name, magnitude, { region }),
  entry('capital', `capital-${capital.toLowerCase()}`, capital, magnitude, { region, country: name })
];
const pairs = [
  ...country('France', 'Paris', 90000, EUROPE),
  ...country('Germany', 'Berlin', 80000, EUROPE),
  ...country('Spain', 'Madrid', 70000, EUROPE),
  ...country('Italy', 'Rome', 60000, EUROPE),
  ...country('Ireland', 'Dublin', 50000, EUROPE),
  ...country('Malta', 'Valletta', 20000, EUROPE),
  ...country('Greece', 'Athens', 100000, EUROPE),
  ...country('Kenya', 'Nairobi', 55000, AFRICA),
  ...country('Uganda', 'Kampala', 30000, AFRICA),
  ...country('Tanzania', 'Dodoma', 30000, AFRICA),
  ...country('Ethiopia', 'Addis Ababa', 30000, AFRICA),
  ...country('Somalia', 'Mogadishu', 30000, AFRICA),
  ...country('Rwanda', 'Kigali', 30000, AFRICA),
  ...country('Seychelles', 'Victoria', 8000, AFRICA),
  // a state capital in the capital cohort AND a city in the city cohort (the bank's Boston, Albany, Madison...)
  ...country('Massachusetts', 'Boston', 110000, AMERICA)
];
const city = (id, name, magnitude, country, region, extra) => entry('city', id, name, magnitude, { country, region, size: 100000, ...extra });
const RAW = {
  countries: pairs.filter((e) => e.category === 'country'),
  capitals: pairs.filter((e) => e.category === 'capital'),
  cities: [
    city('city-syracuse-new-york', 'Syracuse', 30000, 'United States', AMERICA, { qualifier: 'New York', size: 148000 }),
    city('city-syracuse-sicily', 'Syracuse', 20000, 'Italy', EUROPE, { qualifier: 'Sicily', size: 118000 }),
    city('city-athens-georgia', 'Athens', 12000, 'United States', AMERICA, { qualifier: 'Georgia' }),
    city('city-athens-ohio', 'Athens', 3000, 'United States', AMERICA, { qualifier: 'Ohio', aliases: ['Athens OH', 'Ohio University Town'] }),
    city('city-rhodes-greece', 'Rhodes', 12000, 'Greece', EUROPE, { qualifier: 'Greece', aliases: ['Rhodes City'] }),
    city('city-paris-texas', 'Paris', 5000, 'United States', AMERICA, { qualifier: 'Texas' }),
    city('city-dublin-california', 'Dublin', 4000, 'United States', AMERICA, { qualifier: 'California' }),
    city('city-lublin', 'Lublin', 9000, 'Poland', EUROPE),
    city('city-boston', 'Boston', 110000, 'United States', AMERICA),
    city('city-boston-lincolnshire', 'Boston', 11000, 'United Kingdom', EUROPE, { qualifier: 'Lincolnshire' }),
    city('city-victoria-british-columbia', 'Victoria', 25000, 'Canada', AMERICA, { qualifier: 'British Columbia' }),
    city('city-lyon', 'Lyon', 40000, 'France', EUROPE),
    city('city-munich', 'Munich', 45000, 'Germany', EUROPE),
    city('city-milan', 'Milan', 50000, 'Italy', EUROPE),
    city('city-seville', 'Seville', 30000, 'Spain', EUROPE),
    city('city-cork', 'Cork', 15000, 'Ireland', EUROPE),
    city('city-porto', 'Porto', 35000, 'Portugal', EUROPE),
    city('city-mombasa', 'Mombasa', 12000, 'Kenya', AFRICA),
    city('city-arusha', 'Arusha', 9000, 'Tanzania', AFRICA),
    city('city-malda', 'Malda', 500, 'India', ['Asia', 'South Asia'])
  ],
  lakes: [
    entry('lake', 'lake-black-lake-new-york', 'Black Lake', 900, { qualifier: 'New York', size: 40 }),
    entry('lake', 'lake-black-lake-michigan', 'Black Lake', 300, { qualifier: 'Michigan', size: 41 }),
    entry('lake', 'lake-paris-tennessee', 'Paris', 200, { qualifier: 'Tennessee', size: 3 }),
    entry('lake', 'lake-superior', 'Lake Superior', 90000, { size: 82100 }),
    entry('lake', 'lake-victoria', 'Lake Victoria', 60000, { size: 68800 })
  ],
  rivers: [entry('river', 'river-nile', 'Nile', 90000, { size: 6650 }), entry('river', 'river-cam', 'Cam', 3000, { size: 64 })],
  mountains: [entry('mountain', 'mountain-everest', 'Mount Everest', 90000, { size: 8849 }), entry('mountain', 'mountain-ben-nevis', 'Ben Nevis', 20000, { size: 1345 })],
  deserts: [entry('desert', 'desert-sahara', 'Sahara', 90000, { size: 9200000 }), entry('desert', 'desert-negev', 'Negev', 9000, { size: 13000 })],
  islands: [entry('island', 'island-greenland', 'Greenland', 90000, { size: 2166086 }), entry('island', 'island-lundy', 'Lundy', 2000, { size: 4.5 }),
    entry('island', 'island-rhodes', 'Rhodes', 40000, { size: 1401 })],
  seas: [entry('sea_ocean', 'sea-pacific', 'Pacific Ocean', 90000, { size: 165250000 }), entry('sea_ocean', 'sea-wadden', 'Wadden Sea', 4000, { size: 10000 })]
};
const THEMES = { city: { 'Sicily': ['Syracuse (Sicily)', 'Milan'], 'New England': ['Boston', 'Syracuse (New York)'] } };
const bank = promptBank.createBank(RAW, THEMES);

/** A run pinned to one slot; judge(input) submits it fresh each time. */
function judge(slot) {
  const run = runner.createRun(bank, { rng: () => 0.5 });
  run.state.slots[0] = slot;
  return (input, keepUsed) => {
    run.state.index = 0;
    run.state.finished = false;
    if (!keepUsed) run.state.usedAnswers.clear();
    return run.submit(input);
  };
}

test('a key held by several namesakes maps to the list, most-viewed first', () => {
  const lookup = bank.cohorts.get('city').lookup;
  assert.deepStrictEqual(matching.idsAt(lookup, 'syracuse'), ['city-syracuse-new-york', 'city-syracuse-sicily']);
  // the qualified forms are exact keys of the one place: "Name Qualifier",
  // and "Name, Qualifier" / "Name (Qualifier)" normalize to the same thing
  assert.strictEqual(lookup.get('syracuse sicily'), 'city-syracuse-sicily');
  assert.strictEqual(matching.normalize('Syracuse (Sicily)'), 'syracuse sicily');
  assert.strictEqual(matching.normalize('Syracuse, Sicily'), 'syracuse sicily');
  // ...plus the postal code for a US state, and nothing for a country
  assert.strictEqual(lookup.get('syracuse ny'), 'city-syracuse-new-york');
  assert.deepStrictEqual(matching.qualifiedKeys('Syracuse', 'Sicily'), ['syracuse sicily']);
  assert.deepStrictEqual(matching.qualifiedKeys('Portland', 'Maine'), ['portland maine', 'portland me']);
  assert.strictEqual(matching.displayName(bank.cohorts.get('city').byId.get('city-syracuse-sicily')), 'Syracuse (Sicily)');
  assert.strictEqual(matching.displayName(bank.cohorts.get('city').byId.get('city-lyon')), 'Lyon');
});

test('matchAnswer settles a shared key on the first unused namesake; through a qualifier it reports the bare name', () => {
  const lookup = bank.cohorts.get('city').lookup;
  const used = new Set();
  const first = matching.matchAnswer('Syracuse', lookup, used);
  assert.deepStrictEqual(first, { status: 'accepted', entryId: 'city-syracuse-new-york', matched: 'syracuse' });
  used.add(first.entryId);
  assert.strictEqual(matching.matchAnswer('Syracuse', lookup, used).entryId, 'city-syracuse-sicily');
  used.add('city-syracuse-sicily');
  assert.strictEqual(matching.matchAnswer('Syracuse', lookup, used).status, 'duplicate');
  // the qualifier is not part of the name: a length rule measures "syracuse"
  const exact = matching.matchAnswer('Syracuse, Sicily', lookup, new Set());
  assert.deepStrictEqual(exact, { status: 'accepted', entryId: 'city-syracuse-sicily', matched: 'syracuse', qualified: true });
  assert.strictEqual(matching.matchAnswer('syracuse ny', lookup, new Set()).entryId, 'city-syracuse-new-york');
  // the postal-code form is exact only: "Syracuse UK" is not a typo of "syracuse ny"
  assert.strictEqual(matching.matchAnswer('Syracuse UK', lookup, new Set()).status, 'unrecognized');
  // a typo of the shared name is one candidate, not a tie between the namesakes
  const typo = matching.matchAnswer('Syracuze', lookup, new Set());
  assert.strictEqual(typo.status, 'corrected');
  assert.strictEqual(typo.entryId, 'city-syracuse-new-york');
  // ...and a qualified form is exact only: a typo of it is not corrected
  // (a long key would buy a long budget and correct the name away)
  assert.strictEqual(matching.matchAnswer('Syracuse Sicly', lookup, new Set()).status, 'unrecognized');
});

test('namesakes share their loose form too: "Black" is the Black Lakes, by views', () => {
  const lookup = bank.cohorts.get('lake').lookup;
  assert.deepStrictEqual(matching.idsAt(lookup, 'black lake'), ['lake-black-lake-new-york', 'lake-black-lake-michigan']);
  assert.strictEqual(matching.matchAnswer('Black', lookup, new Set()).entryId, 'lake-black-lake-new-york');
  assert.strictEqual(matching.matchAnswer('Black Lake (Michigan)', lookup, new Set()).entryId, 'lake-black-lake-michigan');
  assert.strictEqual(matching.matchAnswer('Black Lake, Michigan', lookup, new Set()).entryId, 'lake-black-lake-michigan');
  assert.strictEqual(matching.matchAnswer('Black Lake MI', lookup, new Set()).entryId, 'lake-black-lake-michigan');
  assert.ok(matching.entryIds(lookup).has('lake-black-lake-michigan'));
});

test('the round scope picks the namesake: a bare "Syracuse" on a Europe round is the Sicilian one, silently', () => {
  const europe = judge({ category: 'city', region: 'Europe' });
  const r = europe('Syracuse');
  assert.strictEqual(r.status, 'accepted');
  assert.strictEqual(r.entry.id, 'city-syracuse-sicily');
  assert.strictEqual(r.correctedFrom, null);
  // stored with its qualifier, so the summary reads right and the daily replay is exact
  assert.strictEqual(r.answer, 'Syracuse (Sicily)');
  const america = judge({ category: 'city', region: 'North America' });
  assert.strictEqual(america('Syracuse').entry.id, 'city-syracuse-new-york');
  // a theme lists a namesake with its qualifier
  const sicily = judge({ category: 'city', theme: 'Sicily' });
  assert.strictEqual(sicily('Syracuse').entry.id, 'city-syracuse-sicily');
  // ...and a bare name several places share names the one without a qualifier
  const newEngland = judge({ category: 'city', theme: 'New England' });
  assert.strictEqual(newEngland('Boston').entry.id, 'city-boston');
  assert.strictEqual(newEngland('Boston, Lincolnshire').status, 'wrong-scope');
  assert.deepStrictEqual(bank.themeMisses, []);
});

test('a plain round takes the most-viewed namesake; a second "Syracuse" is the other one, then a duplicate', () => {
  const plain = judge({ category: 'city' });
  const first = plain('Syracuse');
  assert.strictEqual(first.entry.id, 'city-syracuse-new-york');
  assert.strictEqual(first.answer, 'Syracuse (New York)');
  const second = plain('Syracuse', true);
  assert.strictEqual(second.status, 'accepted');
  assert.strictEqual(second.entry.id, 'city-syracuse-sicily');
  const third = plain('Syracuse', true);
  assert.strictEqual(third.status, 'duplicate');
  // a name whose famous holder is a state capital the player just scored:
  // the second typing is the next namesake, not "Boston is a capital city"
  // (the guard measures the name's standing in this cohort, not the entry
  // the second typing settled on)
  const boston = judge({ category: 'city' });
  assert.strictEqual(boston('Boston').entry.id, 'city-boston');
  assert.strictEqual(boston('Boston', true).entry.id, 'city-boston-lincolnshire');
  // typing the qualifier is exact on that one whatever the order
  const q = judge({ category: 'city' });
  assert.strictEqual(q('Syracuse (Sicily)').entry.id, 'city-syracuse-sicily');
  assert.strictEqual(q('Syracuse Sicily').entry.id, 'city-syracuse-sicily');
  assert.strictEqual(q('syracuse, ny').entry.id, 'city-syracuse-new-york');
});

test('when no namesake fits, the refusal names the famous one with its qualifier', () => {
  const africa = judge({ category: 'city', region: 'Africa' });
  const r = africa('Syracuse');
  assert.strictEqual(r.status, 'wrong-scope');
  assert.strictEqual(r.entry.id, 'city-syracuse-new-york');
  assert.strictEqual(matching.displayName(r.entry), 'Syracuse (New York)');
  assert.strictEqual(r.scopeName, 'Africa');
});

test('a bare name whose famous holder lives elsewhere keeps the nudge; the qualifier gets past it (NAMESAKE_FAME_RATIO)', () => {
  assert.strictEqual(runner.NAMESAKE_FAME_RATIO, 3);
  const plain = judge({ category: 'city' });
  // Athens the capital: 100,000 views against Athens (Georgia)'s 12,000
  const bare = plain('Athens');
  assert.strictEqual(bare.status, 'unrecognized');
  assert.strictEqual(bare.elsewhere.category, 'capital');
  assert.strictEqual(bare.elsewhere.entry.id, 'capital-athens');
  for (const typed of ['Athens, Georgia', 'Athens (Georgia)', 'Athens GA']) {
    const r = plain(typed);
    assert.strictEqual(r.status, 'accepted', typed);
    assert.strictEqual(r.entry.id, 'city-athens-georgia');
    assert.strictEqual(r.answer, 'Athens (Georgia)');
  }
  // on a region round the famous one fits, the bare name is the nudge too -
  // not "Athens (Georgia) isn't in Europe"
  const europe = judge({ category: 'city', region: 'Europe' });
  const scoped = europe('Athens');
  assert.strictEqual(scoped.status, 'unrecognized');
  assert.strictEqual(scoped.elsewhere.entry.id, 'capital-athens');
  // ...but where the famous one does NOT fit, the in-scope namesake is the
  // answer, silently: the point of the design
  const america = judge({ category: 'city', region: 'North America' });
  assert.strictEqual(america('Athens').entry.id, 'city-athens-georgia');
  // ...and the nudge comes first even when the typing is a typo of something
  // in scope ("Dublin" is one edit from Lublin): Dublin the capital is what
  // was meant, not "Dublin (California) isn't in Europe"
  const lublin = judge({ category: 'city', region: 'Europe' });
  assert.strictEqual(lublin('Dublin').elsewhere.entry.id, 'capital-dublin');
  // ...on a letter round the famous name fits as well as the namesake, so the nudge stands
  const startsA = judge({ category: 'city', letter: { kind: 'starts', letter: 'a' } });
  assert.strictEqual(startsA('Athens').elsewhere.entry.id, 'capital-athens');
  assert.strictEqual(startsA('Athens, Georgia').entry.id, 'city-athens-georgia');
  // Victoria: the city (25,000) outviews the Seychelles capital (8,000) - no guard, the city scores
  assert.strictEqual(plain('Victoria').entry.id, 'city-victoria-british-columbia');
  // a qualified typing on another cohort's round names that one place: the
  // nudge, not this cohort's bare twin scored as a correction
  const capital = judge({ category: 'capital' });
  const georgia = capital('Athens, Georgia');
  assert.strictEqual(georgia.status, 'unrecognized');
  assert.strictEqual(georgia.elsewhere.entry.id, 'city-athens-georgia');
  assert.strictEqual(capital('Athens').entry.id, 'capital-athens');
  // only the two city cohorts second-guess each other: "Paris" on a lake
  // round is the lake called Paris, whatever the capital's fame
  const lake = judge({ category: 'lake' });
  assert.strictEqual(lake('Paris').entry.id, 'lake-paris-tennessee');
});

test('an alias of a qualified entry is not second-guessed: the guard asks about the typing (Samar (Ukraine) / Novomoskovsk, 2026-09-18)', () => {
  const plain = judge({ category: 'city' });
  // the bare name is the capital's nudge...
  assert.strictEqual(plain('Athens').elsewhere.entry.id, 'capital-athens');
  // ...but an alias only this row holds names it and nothing else
  const alias = plain('Ohio University Town');
  assert.strictEqual(alias.status, 'accepted');
  assert.strictEqual(alias.entry.id, 'city-athens-ohio');
  // an alias that is itself the famous one's name would keep the nudge
  // (Rodos is the island's name as much as the city's); the state-code
  // form, which the capital cohort does not hold, is unambiguous
  assert.strictEqual(plain('Athens OH').entry.id, 'city-athens-ohio');
});

test('an island holder keeps the nudge on a region round: it has no region to be outside of (Rhodes, 2026-09-18)', () => {
  const plain = judge({ category: 'city' });
  assert.strictEqual(plain('Rhodes').elsewhere.category, 'island');
  assert.strictEqual(plain('Rhodes, Greece').entry.id, 'city-rhodes-greece');
  // the capital's region clause still lets a namesake answer where the
  // famous one does not fit ("Athens" in North America) - but an island is
  // in no region, so "Rhodes" in Europe is the island as on the plain round
  const europe = judge({ category: 'city', region: 'Europe' });
  assert.strictEqual(europe('Rhodes').status, 'unrecognized');
  assert.strictEqual(europe('Rhodes').elsewhere.entry.id, 'island-rhodes');
  assert.strictEqual(europe('Rhodes City').entry.id, 'city-rhodes-greece');
  assert.strictEqual(judge({ category: 'city', region: 'North America' })('Athens').entry.id, 'city-athens-georgia');
});

test('letter and length rules see the bare name, whatever was typed', () => {
  // "Athens" is 6 letters: a short-name round (5 or fewer) never holds it,
  // and the qualifier typed to get past the fame guard does not lengthen it
  assert.ok(!matching.entryIds(bank.promptFor({ category: 'city', letter: { kind: 'short' } }).lookup).has('city-athens-georgia'));
  const long = judge({ category: 'city', letter: { kind: 'long' } });
  assert.strictEqual(long('Syracuse (New York)').status, 'wrong-scope', '8 letters, not 19');
  const startsS = judge({ category: 'city', letter: { kind: 'starts', letter: 's' } });
  assert.strictEqual(startsS('Syracuse, Sicily').entry.id, 'city-syracuse-sicily');
  // Paris (Texas) is a short name; "Paris" alone is the capital's nudge,
  // and the "Texas" typed to get past it is not measured
  const short = judge({ category: 'city', letter: { kind: 'short' } });
  assert.strictEqual(short('Cork').status, 'accepted');
  assert.strictEqual(short('Paris').elsewhere.entry.id, 'capital-paris');
  const texas = short('Paris, Texas');
  assert.strictEqual(texas.status, 'accepted');
  assert.strictEqual(texas.entry.id, 'city-paris-texas');
  assert.strictEqual(texas.answer, 'Paris (Texas)');
  // ...and the stored "Paris (Texas)" replays through the same rule
  assert.strictEqual(short('Paris (Texas)').entry.id, 'city-paris-texas');
});

test('the review reveals a namesake with its qualifier', () => {
  const prompt = bank.promptFor({ category: 'lake' });
  const rarest = runner.rarestFor(prompt);
  assert.strictEqual(rarest.name, 'Paris (Tennessee)');
});

test('the daily replay lands the stored "Syracuse (Sicily)" on the Sicilian one', () => {
  // a plain city round would score New York for a bare "Syracuse"; the
  // stored answer carries the qualifier, so the server scores what the
  // player got
  const run = runner.createRun(bank, { rng: () => 0.5 });
  run.state.slots[0] = { category: 'city' };
  const played = run.submit('Syracuse (Sicily)');
  assert.strictEqual(played.entry.id, 'city-syracuse-sicily');
  const replay = runner.createRun(bank, { rng: () => 0.5 });
  replay.state.slots[0] = { category: 'city' };
  const again = replay.submit(played.answer);
  assert.strictEqual(again.entry.id, 'city-syracuse-sicily');
  assert.strictEqual(again.rarity, played.rarity);
});

test('a wide correction on a narrowed round asks the other cohorts first: "Malta" on a Europe city round is the country, not "Malda is not in Europe" (2026-09-19)', () => {
  // the Europe subset has no Malta, the whole cohort corrects it to Malda
  // (Asia, one edit away); the country's nudge comes first, as it does when
  // the correction happens inside the subset (Dublin / Lublin)
  const europe = judge({ category: 'city', region: 'Europe' });
  const malta = europe('Malta');
  assert.strictEqual(malta.status, 'unrecognized');
  assert.strictEqual(malta.elsewhere.entry.id, 'country-malta');
  // a typo of the city itself, with no famous name behind it, is still the city out of scope
  assert.strictEqual(europe('Maldaa').status, 'wrong-scope');
  assert.strictEqual(europe('Maldaa').entry.id, 'city-malda');
  // and on the round that holds it, the city scores as typed
  assert.strictEqual(judge({ category: 'city', region: 'Asia' })('Malda').entry.id, 'city-malda');
});
