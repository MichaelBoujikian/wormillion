const test = require('node:test');

test('letters NFD leaves alone are folded: Møn, Sjælland, Łódź, Straße', () => {
  const m = require('../src/js/matching.js');
  assert.strictEqual(m.normalize('Møn'), 'mon');
  assert.strictEqual(m.normalize('Sjælland'), 'sjaelland');
  assert.strictEqual(m.normalize('Łódź'), 'lodz');
  assert.strictEqual(m.normalize('Straße'), 'strasse');
  assert.strictEqual(m.normalize('Đà Nẵng'), 'da nang');
});

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
      { status: 'accepted', entryId: 'country-united-states', matched: matching.normalize(input) },
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

test('a generic word adds no spelling budget', () => {
  // "Lake Takern" is two edits from "Lake Vanern" and would have been
  // corrected to it when the bank had no Takern; the budget now comes from
  // "takern" (six letters, one edit), so a lake the bank lacks is refused
  // rather than sent to another country. Same for "Sinu River" -> "Min River".
  const lakes = matching.buildLookup([
    { id: 'lake-vanern', name: 'Lake Vanern', aliases: [] },
    { id: 'lake-ilmen', name: 'Lake Ilmen', aliases: [] }
  ]);
  assert.strictEqual(matching.matchAnswer('Lake Takern', lakes, new Set()).status, 'unrecognized');
  assert.strictEqual(matching.matchAnswer('Lake Immeln', lakes, new Set()).status, 'unrecognized');
  // ...while a real typo in the name proper still corrects, with or without the word.
  assert.strictEqual(matching.matchAnswer('Lake Vanren', lakes, new Set()).entryId, 'lake-vanern');
  assert.strictEqual(matching.matchAnswer('Vanren', lakes, new Set()).entryId, 'lake-vanern');
  const rivers = matching.buildLookup([{ id: 'river-min', name: 'Min (Sichuan)', aliases: ['Min River'] }]);
  assert.strictEqual(matching.matchAnswer('Sinu River', rivers, new Set()).status, 'unrecognized');
  assert.strictEqual(matching.matchAnswer('Mni River', rivers, new Set()).status, 'unrecognized', 'three letters get no slack even with the word');
});

test('a hit on the whole name beats a hit on a stripped form at the same distance', () => {
  // "Lotse" is one edit from Lhotse and one edit from the bare "lose" of
  // Lose Hill; the whole-name hit wins rather than tying and refusing.
  const peaks = matching.buildLookup([
    { id: 'mountain-lhotse', name: 'Lhotse', aliases: [] },
    { id: 'mountain-lose-hill', name: 'Lose Hill', aliases: [] },
    { id: 'mountain-mont-blanc', name: 'Mont Blanc', aliases: [] },
    { id: 'mountain-blanca-peak', name: 'Blanca Peak', aliases: [] }
  ]);
  assert.strictEqual(matching.matchAnswer('Lotse', peaks, new Set()).entryId, 'mountain-lhotse');
  assert.strictEqual(matching.matchAnswer('Mount Blanc', peaks, new Set()).entryId, 'mountain-mont-blanc');
  // Two whole-name hits at the same distance are still a coin flip.
  assert.strictEqual(matching.matchAnswer('Marinx', matching.buildLookup([
    { id: 'a', name: 'Marino', aliases: [] },
    { id: 'b', name: 'Marina', aliases: [] }
  ]), new Set()).status, 'unrecognized');
});

test('a generic word the player typed and the entry carries is worth one edit', () => {
  // "fugi" alone is four letters and gets no slack; "Mount Fugi" says what
  // kind of place is meant, and Mount Fuji carries the same word.
  const geo = matching.buildLookup([
    { id: 'mountain-fuji', name: 'Mount Fuji', aliases: [] },
    { id: 'lake-como', name: 'Lake Como', aliases: [] },
    { id: 'sea-black', name: 'Black Sea', aliases: [] },
    { id: 'lake-uvs', name: 'Uvs Lake', aliases: [] }
  ]);
  assert.strictEqual(matching.matchAnswer('Mount Fugi', geo, new Set()).entryId, 'mountain-fuji');
  assert.strictEqual(matching.matchAnswer('Lake Komo', geo, new Set()).entryId, 'lake-como');
  assert.strictEqual(matching.matchAnswer('Blak Sea', geo, new Set()).entryId, 'sea-black');
  // One edit, not two: "Ivo Lake" is not Uvs Lake, and "Fugi" alone is nothing.
  assert.strictEqual(matching.matchAnswer('Ivo Lake', geo, new Set()).status, 'unrecognized');
  assert.strictEqual(matching.matchAnswer('Fugi', geo, new Set()).status, 'unrecognized');
});

test('the stripped-form comparison can be switched off (the cross-category nudge)', () => {
  const rivers = matching.buildLookup([{ id: 'river-niger', name: 'Niger River', aliases: [] }]);
  assert.strictEqual(matching.matchAnswer('Nigera', rivers, new Set()).entryId, 'river-niger');
  assert.strictEqual(matching.matchAnswer('Nigera', rivers, new Set(), { bare: false }).status, 'unrecognized');
});

test('"Rio" is a generic word for matching, so "Rio Sinu" finds Sinu without an alias', () => {
  const rivers = matching.buildLookup([{ id: 'river-sinu', name: 'Sinu', aliases: [] }]);
  assert.strictEqual(matching.matchAnswer('Rio Sinu', rivers, new Set()).entryId, 'river-sinu');
  assert.strictEqual(matching.looseKey('Río Magdalena'), 'magdalena');
});

test('a typo is corrected whether or not the generic word is typed', () => {
  const peaks = matching.buildLookup([{ id: 'mountain-kilimanjaro', name: 'Mount Kilimanjaro', aliases: [] }]);
  for (const typed of ['Mount Kilimanjro', 'Kilimanjro', 'Mt Kilimanjro']) {
    const result = matching.matchAnswer(typed, peaks, new Set());
    assert.strictEqual(result.status, 'corrected', typed);
    assert.strictEqual(result.entryId, 'mountain-kilimanjaro', typed);
  }
  // The other way round too: the bank's row is bare and the player adds the word.
  const bare = matching.buildLookup([{ id: 'mountain-denali', name: 'Denali', aliases: [] }]);
  assert.strictEqual(matching.matchAnswer('Mount Denalli', bare, new Set()).entryId, 'mountain-denali');
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
  // ...and the other way: the player adds a generic word the entry lacks.
  const bare = matching.buildLookup([
    { id: 'mountain-denali', name: 'Denali', aliases: ['Mount McKinley'] },
    { id: 'island-cuba', name: 'Cuba', aliases: [] },
    { id: 'lake-victoria', name: 'Lake Victoria', aliases: [] },
    { id: 'island-victoria-island', name: 'Victoria Island', aliases: [] }
  ]);
  assert.strictEqual(matching.matchAnswer('Mount Denali', bare, new Set()).entryId, 'mountain-denali');
  assert.strictEqual(matching.matchAnswer('Cuba Island', bare, new Set()).entryId, 'island-cuba');
  assert.strictEqual(matching.matchAnswer('the island of Cuba', bare, new Set()).entryId, 'island-cuba');
  // A shared bare form is still nobody, even typed with filler of its own.
  assert.strictEqual(matching.matchAnswer('Mount Victoria', bare, new Set()).status, 'unrecognized');
});

test('a shared loose form identifies nobody', () => {
  // Both "Lake Victoria" and "Victoria Island" reduce to "victoria", so the
  // loose pass must not guess between them.
  const both = matching.buildLookup([
    { id: 'a', name: 'Lake Victoria', aliases: [] },
    { id: 'b', name: 'Victoria Island', aliases: [] }
  ]);
  assert.strictEqual(matching.matchAnswer('Victoria', both, new Set()).status, 'unrecognized');
  // ...and the same for two aliases with no name behind either.
  const aliases = matching.buildLookup([
    { id: 'a', name: 'Dasht-e Kavir', aliases: ['Great Salt Desert'] },
    { id: 'b', name: 'Bonneville Salt Flats', aliases: ['Great Salt Lake Desert'] }
  ]);
  assert.strictEqual(matching.matchAnswer('Great Salt', aliases, new Set()).status, 'unrecognized');
});

test("a loose form from an entry's name beats the same form from another's alias", () => {
  // The Persian Gulf is also called the Arabian Gulf, but "Arabian" on its
  // own is the Arabian Sea - the Gulf's alias must not make it nobody.
  const seas = matching.buildLookup([
    { id: 'persian-gulf', name: 'Persian Gulf', aliases: ['Arabian Gulf'] },
    { id: 'arabian-sea', name: 'Arabian Sea', aliases: [] }
  ]);
  assert.strictEqual(matching.matchAnswer('Arabian', seas, new Set()).entryId, 'arabian-sea');
  assert.strictEqual(matching.matchAnswer('Arabian Gulf', seas, new Set()).entryId, 'persian-gulf', 'the alias itself still works');
  assert.strictEqual(matching.matchAnswer('Persian', seas, new Set()).entryId, 'persian-gulf');
  // Order of entries does not matter.
  const reversed = matching.buildLookup([
    { id: 'arabian-sea', name: 'Arabian Sea', aliases: [] },
    { id: 'persian-gulf', name: 'Persian Gulf', aliases: ['Arabian Gulf'] }
  ]);
  assert.strictEqual(matching.matchAnswer('Arabian', reversed, new Set()).entryId, 'arabian-sea');
});

test('a generic word of another category is not filler (2026-09-16)', () => {
  // The river cohort knows it is the river cohort: "lake", "mount" and "city"
  // are somebody else's words, so the loose pass keeps them and the fuzzy
  // pass compares whole strings only.
  const rivers = matching.buildLookup([
    { id: 'river-michigan', name: 'Michigan River', aliases: [] },
    { id: 'river-rapid', name: 'Rapid River', aliases: [] },
    { id: 'river-foraker', name: 'Foraker River', aliases: [] },
    { id: 'river-willow', name: 'Willow River', aliases: [] },
    { id: 'river-meade', name: 'Meade River', aliases: [] }
  ], { category: 'river' });
  assert.strictEqual(matching.matchAnswer('Lake Michigan', rivers, null).status, 'unrecognized');
  assert.strictEqual(matching.matchAnswer('Rapid City', rivers, null).status, 'unrecognized');
  assert.strictEqual(matching.matchAnswer('Mount Foraker', rivers, null).status, 'unrecognized');
  assert.strictEqual(matching.matchAnswer('Willow Reservoir', rivers, null).status, 'unrecognized');
  // ...while its own word, or nobody's, is as optional as ever
  assert.strictEqual(matching.matchAnswer('Michigan', rivers, null).entryId, 'river-michigan');
  assert.strictEqual(matching.matchAnswer('Rapid River', rivers, null).entryId, 'river-rapid');
  assert.strictEqual(matching.matchAnswer('the Rapid', rivers, null).entryId, 'river-rapid');
  assert.strictEqual(matching.matchAnswer('Rio Rapid', rivers, null).entryId, 'river-rapid');
  // and a typo in a whole name still corrects
  assert.strictEqual(matching.matchAnswer('Michigan Rivver', rivers, null).status, 'corrected');
  // the lake cohort keeps "lake" optional and does not see "Lake Meade" as Meade River's
  const lakes = matching.buildLookup([{ id: 'lake-mead', name: 'Lake Mead', aliases: [] }], { category: 'lake' });
  const meade = matching.matchAnswer('Lake Meade', lakes, null);
  assert.strictEqual(meade.status, 'corrected');
  assert.strictEqual(meade.entryId, 'lake-mead');
  assert.strictEqual(matching.matchAnswer('Lake Meade', rivers, null).status, 'unrecognized');
  // "city" belongs to cities and capitals alike; a lookup with no category is as loose as before
  const capitals = matching.buildLookup([{ id: 'capital-mexico-city', name: 'Mexico City', aliases: [] }], { category: 'capital' });
  assert.strictEqual(matching.matchAnswer('Mexico', capitals, null).entryId, 'capital-mexico-city');
  const countries = matching.buildLookup([{ id: 'country-mexico', name: 'Mexico', aliases: [] }], { category: 'country' });
  assert.strictEqual(matching.matchAnswer('Mexico City', countries, null).status, 'unrecognized');
  const untyped = matching.buildLookup([{ id: 'country-mexico', name: 'Mexico', aliases: [] }]);
  assert.strictEqual(matching.matchAnswer('Mexico City', untyped, null).entryId, 'country-mexico');
  assert.deepStrictEqual(matching.WORD_CATEGORY.city, ['city', 'capital']);
  assert.strictEqual(matching.foreignWordIn('lake tahoe', 'lake'), false);
  assert.strictEqual(matching.foreignWordIn('lake tahoe', 'river'), true);
  assert.strictEqual(matching.foreignWordIn('cape town', 'river'), false);
});

test('a typed plural is never corrected onto its singular namesake (2026-09-16)', () => {
  const lakes = matching.buildLookup([
    { id: 'lake-great-lake', name: 'Great Lake', aliases: [] },
    { id: 'lake-loch-ness', name: 'Loch Ness', aliases: [] },
    { id: 'lake-bear-lake', name: 'Bear Lake', aliases: [] }
  ], { category: 'lake' });
  assert.strictEqual(matching.matchAnswer('Great Lakes', lakes, null).status, 'unrecognized');
  assert.strictEqual(matching.matchAnswer('Bear Lakes', lakes, null).status, 'unrecognized');
  // a real typo still corrects, s or no s
  assert.strictEqual(matching.matchAnswer('Loch Nesss', lakes, null).entryId, 'lake-loch-ness');
  assert.strictEqual(matching.matchAnswer('Great Lkae', lakes, null).entryId, 'lake-great-lake');
  // ...and the refusal is a refusal: the next place within budget does not win instead
  // (the first cut sent "Great Salt Lakes" to Great Salt Plains Lake, "Irelands" to Iceland)
  const salty = matching.buildLookup([
    { id: 'lake-great-salt-lake', name: 'Great Salt Lake', aliases: [] },
    { id: 'lake-great-salt-plains-lake', name: 'Great Salt Plains Lake', aliases: [] }
  ], { category: 'lake' });
  assert.strictEqual(matching.matchAnswer('Great Salt Lakes', salty, null).status, 'unrecognized');
  // a plural of a name that does not end in a generic word is an ordinary typo
  const countries = matching.buildLookup([
    { id: 'country-ireland', name: 'Ireland', aliases: [] },
    { id: 'country-iceland', name: 'Iceland', aliases: [] }
  ], { category: 'country' });
  assert.strictEqual(matching.matchAnswer('Irelands', countries, null).entryId, 'country-ireland');
  assert.strictEqual(matching.matchAnswer('Icelands', countries, null).entryId, 'country-iceland');
});

test('"Mt" is "Mount" before anything else looks at the input (2026-09-16 audit)', () => {
  assert.strictEqual(matching.normalize('Mt. Vernon'), 'mount vernon');
  assert.strictEqual(matching.normalize('mt desert island'), 'mount desert island');
  const cities = matching.buildLookup([{ id: 'city-mount-vernon', name: 'Mount Vernon', aliases: [] }], { category: 'city' });
  // "mt" was a mountain's word on a city round, so "Mt Vernon" had no exact hit and no loose pass
  assert.strictEqual(matching.matchAnswer('Mt Vernon', cities, null).entryId, 'city-mount-vernon');
  assert.strictEqual(matching.matchAnswer('Mt Vernan', cities, null).status, 'corrected');
});

test('an all-generic-word input has no edit budget of its own (2026-09-16 audit)', () => {
  const rivers = matching.buildLookup([
    { id: 'river-mole', name: 'Mole', aliases: ['River Mole'] },
    { id: 'river-isle', name: 'Isle', aliases: [] }
  ], { category: 'river' });
  // "river isle" is two edits from "river mole", and used to get the slack of its ten letters
  assert.strictEqual(matching.matchAnswer('River Isle', rivers, null).status, 'unrecognized');
  assert.strictEqual(matching.matchAnswer('Isle', rivers, null).entryId, 'river-isle');
  // the shared generic word is still worth one edit
  assert.strictEqual(matching.matchAnswer('River Mols', rivers, null).entryId, 'river-mole');
});
