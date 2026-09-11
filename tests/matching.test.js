const test = require('node:test');
const assert = require('node:assert');
const matching = require('../src/js/matching.js');

// Fixture cohort. Note "Harbor Island" carries only the US spelling - the
// British "Harbour" variant is deliberately absent (Spec 3.6).
const ENTRIES = [
  { id: 'country-united-states', name: 'United States', aliases: ['USA', 'US', 'America'] },
  { id: 'country-saint-lucia', name: 'Saint Lucia', aliases: ['St. Lucia'] },
  { id: 'country-ivory-coast', name: "Cote d'Ivoire", aliases: ['Ivory Coast'] },
  { id: 'island-harbor', name: 'Harbor Island', aliases: [] }
];

const lookup = matching.buildLookup(ENTRIES);

test('normalization folds case, spacing and punctuation (Spec 3.7)', () => {
  assert.strictEqual(matching.normalize('St. Lucia'), 'st lucia');
  assert.strictEqual(matching.normalize('st lucia'), 'st lucia');
  assert.strictEqual(matching.normalize('  St   Lucia  '), 'st lucia');
  assert.strictEqual(matching.normalize("Cote d'Ivoire"), 'cote divoire');
  assert.strictEqual(matching.normalize('Timor–Leste'), 'timor-leste');
  assert.strictEqual(matching.normalize('Yaoundé'), 'yaounde');
  assert.strictEqual(matching.normalize(''), '');
  assert.strictEqual(matching.normalize(null), '');
});

test('normalization is not spelling correction', () => {
  assert.notStrictEqual(matching.normalize('Egpyt'), matching.normalize('Egypt'));
});

test('canonical names, aliases and punctuation variants all match', () => {
  for (const input of ['United States', 'united states', 'USA', 'us', 'America']) {
    assert.deepStrictEqual(
      matching.matchAnswer(input, lookup, new Set()),
      { status: 'accepted', entryId: 'country-united-states' },
      input
    );
  }
  for (const input of ['St. Lucia', 'st lucia', 'St Lucia', 'SAINT LUCIA']) {
    assert.strictEqual(matching.matchAnswer(input, lookup, new Set()).entryId, 'country-saint-lucia', input);
  }
});

test('a British spelling is corrected to the US one rather than rejected', () => {
  // Spec 3.6 rejected British variants by omission. Fuzzy matching supersedes
  // that on purpose: "Harbour" is one edit from "Harbor", so it is accepted and
  // the player is shown the spelling the bank uses.
  const british = matching.matchAnswer('Harbour Island', lookup, new Set());
  assert.strictEqual(british.status, 'corrected');
  assert.strictEqual(british.entryId, 'island-harbor');
  assert.strictEqual(matching.matchAnswer('Harbor Island', lookup, new Set()).status, 'accepted');
});

test('an answer already used this run is a duplicate, not an acceptance', () => {
  const used = new Set();
  const first = matching.matchAnswer('USA', lookup, used);
  assert.strictEqual(first.status, 'accepted');
  used.add(first.entryId);

  const second = matching.matchAnswer('United States', lookup, used);
  assert.deepStrictEqual(second, { status: 'duplicate', entryId: 'country-united-states' });
});

test('unknown and empty input are unrecognized', () => {
  assert.deepStrictEqual(matching.matchAnswer('Atlantis', lookup, new Set()), { status: 'unrecognized' });
  assert.deepStrictEqual(matching.matchAnswer('   ', lookup, new Set()), { status: 'unrecognized' });
});

test('the lookup is a flat map built once, not a per-keystroke scan', () => {
  assert.ok(lookup instanceof Map);
  assert.strictEqual(lookup.get('ivory coast'), 'country-ivory-coast');
  assert.strictEqual(lookup.get('cote divoire'), 'country-ivory-coast');
});

// --- fuzzy spelling ---------------------------------------------------------

test('a near-miss spelling is corrected, and says what it corrected to', () => {
  const result = matching.matchAnswer('Untied States', lookup, new Set());
  assert.strictEqual(result.status, 'corrected');
  assert.strictEqual(result.entryId, 'country-united-states');
  assert.strictEqual(result.typed, 'Untied States');
});

test('a transposition counts as one edit, not two', () => {
  // "Saitn Lucia" -> "Saint Lucia" is a single swap; plain Levenshtein would
  // call it two edits and reject it at this length.
  assert.strictEqual(matching.editDistance('saitn lucia', 'saint lucia', 2), 1);
  assert.strictEqual(matching.matchAnswer('Saitn Lucia', lookup, new Set()).entryId, 'country-saint-lucia');
});

test('short answers get no spelling slack', () => {
  // Three- and four-letter names are too easy to turn into a different place.
  assert.strictEqual(matching.slackFor(3), 0);
  assert.strictEqual(matching.slackFor(4), 0);
  assert.ok(matching.slackFor(8) > 0);
});

test('a correction still respects the duplicate rule', () => {
  const used = new Set(['country-united-states']);
  assert.strictEqual(matching.matchAnswer('Untied States', lookup, used).status, 'duplicate');
});

test('two places equally close to the typo is not a correction', () => {
  const twins = matching.buildLookup([
    { id: 'a', name: 'Marino', aliases: [] },
    { id: 'b', name: 'Marina', aliases: [] }
  ]);
  assert.strictEqual(matching.matchAnswer('Marinx', twins, new Set()).status, 'unrecognized');
});

test('nonsense is still nonsense', () => {
  assert.strictEqual(matching.matchAnswer('Qwertyuiop', lookup, new Set()).status, 'unrecognized');
  assert.strictEqual(matching.matchAnswer('Zzzzzzzzzz', lookup, new Set()).status, 'unrecognized');
});

test('filler words are optional in both directions', () => {
  const geo = matching.buildLookup([
    { id: 'mountain-everest', name: 'Mount Everest', aliases: [] },
    { id: 'lake-baikal', name: 'Lake Baikal', aliases: [] },
    { id: 'river-cam', name: 'River Cam', aliases: [] }
  ]);
  assert.strictEqual(matching.matchAnswer('Everest', geo, new Set()).entryId, 'mountain-everest');
  assert.strictEqual(matching.matchAnswer('Baikal', geo, new Set()).entryId, 'lake-baikal');
  assert.strictEqual(matching.matchAnswer('Cam', geo, new Set()).entryId, 'river-cam');
  assert.strictEqual(matching.looseKey('Mount Everest'), 'everest');
});

test('a shared loose form identifies nobody', () => {
  // Both "Lake Victoria" and "Victoria Island" reduce to "victoria", so the
  // loose pass must not guess between them.
  const both = matching.buildLookup([
    { id: 'a', name: 'Lake Victoria', aliases: [] },
    { id: 'b', name: 'Victoria Island', aliases: [] }
  ]);
  assert.strictEqual(matching.matchAnswer('Victoria', both, new Set()).status, 'unrecognized');
});
