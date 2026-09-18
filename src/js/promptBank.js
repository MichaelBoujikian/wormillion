/**
 * The prompt bank: turns the raw content bank into cohorts, lookups and a
 * 15-slot run draw (Spec 3.8, 5.3, 6). No DOM.
 *
 * A slot is a category plus an optional MODIFIER, which is what makes one round
 * different from the next:
 *
 *   region     "Name a country in Southeast Asia."   (country/capital only)
 *   theme      "Name a river in Mesopotamia."        (curated sets, data/themes.js,
 *                                                     plus DERIVED_THEMES below)
 *   ocean      "Name an island in the Pacific Ocean." (from coordinates)
 *   flag       "Name a country whose flag has green in it." (scripts/data-flags.mjs)
 *   size       "Name a river longer than 3,000 km."  (from the entry's size stat)
 *   letter     "Name a river with a T in it."        (derived from the name)
 *   none       "Name a river."
 *
 * Modifiers narrow what is ACCEPTED, never how it scores: rarity is always
 * computed against the whole category cohort (Spec 3.2), so a Pacific micro-state
 * still reads as globally obscure when the prompt happened to scope to Oceania.
 *
 * A modifier is only used if enough entries satisfy it (MIN_ELIGIBLE) and it
 * actually narrows the field - otherwise the slot falls back to a plain prompt.
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Wormillion = root.Wormillion || {}).promptBank = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const isNode = typeof module === 'object' && module.exports;
  const rarity = isNode ? require('./rarity.js') : root.Wormillion.rarity;
  const matching = isNode ? require('./matching.js') : root.Wormillion.matching;

  const CATEGORIES = ['country', 'capital', 'city', 'lake', 'river', 'mountain', 'desert', 'island', 'sea_ocean'];

  // The noun used in generated prompt text, and the plain fallback prompt.
  const NOUN = {
    country: 'country',
    capital: 'capital city',
    city: 'non-capital city', // every city prompt says so, not just the badge
    lake: 'lake',
    river: 'river',
    mountain: 'mountain',
    desert: 'desert',
    island: 'island',
    sea_ocean: 'sea or ocean'
  };

  // What a round "wants" when the answer was a real place from another
  // category: "Paris is a capital city - this round wants a non-capital city."
  const wantsPhrase = (category) => NOUN[category];

  // The plain (unmodified) prompt, where "Name a {noun}." reads stiffly: the
  // first city prompt a player sees spells the rule out in full.
  const PLAIN_TEXT = { city: "Name a city that isn't a national capital." };

  const ARTICLE = (noun) => (/^[aeiou]/i.test(noun) ? 'an' : 'a');

  const CATEGORY_LABEL = {
    country: 'Country',
    capital: 'Capital',
    city: 'City (not a capital)',
    lake: 'Lake',
    river: 'River',
    mountain: 'Mountain',
    desert: 'Desert',
    island: 'Island',
    sea_ocean: 'Sea / Ocean'
  };

  // Region names are only usable as a prompt scope when at least this many
  // countries carry the tag, so the scope never collapses to a trick question.
  const MIN_REGION_COUNTRIES = 6;
  // A generated letter rule must leave at least this many answers on the table;
  // a hand-curated theme may be deliberately tight ("Name a river in
  // Mesopotamia" has exactly two right answers, and that is the point).
  const MIN_ELIGIBLE = 6;
  const MIN_THEME_MEMBERS = 2;
  // ...and must actually rule something out. 0.6 until 2026-09-16: the US
  // lakes fill took "smaller than 100 km2" to 60.0% of the cohort and the
  // rule retired itself; every wave adds small lakes and blue-white-red
  // flags, so the bar is 0.7 (the user's call, decision 2 of the US handoff).
  const MAX_ELIGIBLE_SHARE = 0.7;
  // A letter rule keeps the old bar: at 0.7 "with an A in it" (66% of the
  // lakes, rivers and mountains) would draw, and that narrows nothing
  // (2026-09-16 gameplay audit).
  const MAX_ELIGIBLE_SHARE_LETTER = 0.6;

  // How a run ramps up (Spec 3.8): the first OPENING_ROUNDS are always plain,
  // then the chance a slot carries a modifier climbs linearly from START on the
  // first round after the opening to END on the last. These two lines are the
  // knobs for "conditional prompts should come up more / less often".
  const OPENING_ROUNDS = 2; // was 3: the last lever for "more conditional prompts" (~11.4 of 15 now)
  const MODIFIER_CHANCE_START = 0.7;
  const MODIFIER_CHANCE_END = 1.0;

  // Themes computed from a curated set instead of listed by hand. "Coastal" is
  // every country NOT in the landlocked list, so the two can never disagree
  // about a country. Keyed by category, then by the derived theme's name.
  const DERIVED_THEMES = {
    country: {
      coastal: { complementOf: 'landlocked', prompt: 'Name a country with a coastline.' }
    }
  };

  const LETTERS = 'abcdefghijklmnoprstuvwz'.split('');

  // Regions that take "the" in a sentence: "in the Caribbean", not "in Caribbean".
  const REGIONS_WITH_THE = new Set(['Caribbean', 'Middle East']);
  const regionPhrase = (region) => (REGIONS_WITH_THE.has(region) ? `the ${region}` : region);

  /** Fisher-Yates, driven by an injectable rng for deterministic tests. */
  function shuffle(items, rng) {
    const a = items.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const pick = (items, rng) => items[Math.floor(rng() * items.length)];

  // What a letter rule strips before looking at a name: the generic English
  // words. Matching strips more ("Ness" still finds Loch Ness), but for letters
  // a word that IS the name stays: "Loch Ness" starts with L, "Saint Lucia"
  // starts with S, "Cape Verde" starts with C - "loch" is not the word "lake",
  // whatever it means, and no "Cape" in this bank is a generic one.
  // "Rio" is generic Spanish for river, but it is the name where it is the
  // name: the Rio Grande starts with R, like Loch Ness starts with L - and so
  // do Laguna Colorada, Lac Saint-Jean, Lago di Braies, the Etang de Thau, the
  // Fiume Grande: a foreign generic word is the name too (the 2026-09-17
  // pre-merge audit found the matcher's new filler words had leaked in here).
  const LETTER_FILLER = new Set(
    [...matching.FILLER].filter((word) => !['loch', 'lough', 'llyn', 'saint', 'st', 'cape', 'rio',
      'lago', 'lac', 'lagoa', 'laguna', 'etang', 'fiume', 'fleuve', 'fluss', 'riviere', 'rivier', 'isla', 'islas', 'ile',
      // seas are a whole-name category, so these only ever reach a physical
      // name that carries them: the Bay du Nord River starts with B (the
      // 2026-09-18 rivers audit had it starting with D)
      'bay', 'gulf'].includes(word))
  );
  // A country's or capital's name is its official name, generic words and
  // all: the Solomon Islands have a D in them, Port of Spain has an F, Mexico
  // City ends in Y. The same goes for seas: nobody thinks "Black Sea" has no
  // S in it or fails to end in A. Only a leading "the" is dropped.
  const NAME_FILLER = new Set(['the']);
  const WHOLE_NAME_CATEGORIES = new Set(['country', 'capital', 'city', 'sea_ocean']);
  // Words that identify a place for the MATCHER (Bear Creek is not Bear River)
  // but are generic for the LETTER rules: "Bear Creek" no more ends in K than
  // "Lake Tahoe" ends in E. The 2026-09 US fill brought 160 creeks, and "ends
  // in K" had become "name any creek". The reverse of `rio` (filler for
  // matching, a letter where it is the name).
  // Bayou and Arroyo are not here: they lead the name the way Rio does (Bayou
  // Teche starts with B, Arroyo Seco with A), and the `rio` exception applies.
  const LETTER_ONLY_FILLER = {
    river: ['creek', 'fork', 'branch', 'run', 'brook', 'kill', 'wash', 'slough', 'draw']
  };
  const letterFillerSets = new Map();
  function letterFillerFor(category) {
    if (WHOLE_NAME_CATEGORIES.has(category)) return NAME_FILLER;
    if (!letterFillerSets.has(category)) {
      letterFillerSets.set(category, new Set([...LETTER_FILLER, ...(LETTER_ONLY_FILLER[category] || [])]));
    }
    return letterFillerSets.get(category);
  }

  /**
   * The spellings a LETTER rule looks at: every name and alias with the
   * generic words stripped. "Mount Fuji" has no T in it and does not start
   * with M, "Lake Baikal" starts with B, "Nile" does not get a T from its
   * alias "the Nile" - but "Loch Ness" starts with L. (An entry whose name is
   * all filler keeps its full spelling rather than vanishing.)
   */
  // An initialism is an alias for typing, not a spelling of the name: NYC does
  // not make New York City end in C, HK does not make Hong Kong end in K, and
  // UAE does not make the Emirates end in E. Letter and length rules skip them.
  const INITIALISM = /^[A-Z]{2,4}$/;
  const namedSpellings = (entry) => [entry.name, ...(entry.aliases || []).filter((alias) => !INITIALISM.test(alias))];

  function variantsOf(entry) {
    const out = new Set();
    const filler = letterFillerFor(entry.category);
    // An alias that is the name with generic words added or taken away ("Rio
    // Bogota" for Bogota, "River Mersey" for Mersey) is a typing convenience,
    // not another spelling: it must not make Bogota start with R. A whole-name
    // category keeps every alias (New York City is also New York).
    const conveniences = !WHOLE_NAME_CATEGORIES.has(entry.category);
    const nameBare = matching.looseKey(entry.name);
    for (const candidate of namedSpellings(entry)) {
      if (conveniences && candidate !== entry.name && matching.looseKey(candidate) === nameBare) continue;
      const bare = matching.looseKey(candidate, filler);
      if (bare) out.add(bare);
    }
    if (out.size === 0) {
      const canonical = matching.normalize(entry.name);
      if (canonical) out.add(canonical);
    }
    return [...out];
  }

  /**
   * For the LENGTH rules the filler IS part of what the player types, so every
   * spelling counts in full as well: "Mount Kilimanjaro" is a long name
   * whether the bank's row happens to say "Kilimanjaro" or "Mount Kilimanjaro".
   */
  function spellingsOf(entry) {
    const out = new Set(entry.variants);
    const filler = letterFillerFor(entry.category);
    for (const candidate of namedSpellings(entry)) {
      const full = matching.normalize(candidate);
      if (full) out.add(full);
      // ...and the shortest thing the matcher accepts ("Ness" for Loch Ness),
      // and the letter-rule spelling ("Sugar" for Sugar Creek).
      const bare = matching.looseKey(candidate);
      if (bare) out.add(bare);
      const trimmed = matching.looseKey(candidate, filler);
      if (trimmed) out.add(trimmed);
    }
    return [...out];
  }

  // Digits are characters too: K2 is two characters, starts with K, has a K,
  // and ends in nothing a letter rule can ask for.
  const letters = (text) => text.replace(/[^a-z0-9]/g, '');

  /**
   * The length rules are judged on the spelling the player actually used -
   * "China" is 5 letters and "People's Republic of China" is 22, and each
   * counts for what it is - OR on that spelling with its generic words
   * trimmed off, whichever fits: "Monte Desert" is a short name (Monte),
   * "Mount Kilimanjaro" a long one (as typed). An entry is in a length
   * prompt's lookup if ANY of its spellings would do, and then the typed one
   * has to, either way (run.js). Generous in both directions on purpose.
   */
  const LENGTH_RULES = {
    short: { ok: (n) => n <= 5, need: '5 letters or fewer' },
    long: { ok: (n) => n >= 12, need: '12 letters or more' }
  };

  /** Does any spelling of this entry satisfy the letter rule? */
  function satisfiesLetter(entry, rule) {
    const lengthRule = rule.kind === 'short' || rule.kind === 'long';
    const spellings = lengthRule ? entry.spellings || spellingsOf(entry) : entry.variants;
    return spellings.some((variant) => {
      const bare = letters(variant);
      if (!bare) return false;
      switch (rule.kind) {
        case 'contains':
          return bare.includes(rule.letter);
        case 'starts':
          return bare.startsWith(rule.letter);
        case 'ends':
          return bare.endsWith(rule.letter);
        case 'short':
          return bare.length <= 5;
        case 'long':
          return bare.length >= 12;
        case 'double':
          return /([a-z])\1/.test(bare);
        default:
          return false;
      }
    });
  }

  /**
   * Size thresholds reuse the physical stat every entry was authored with
   * (population, length, elevation, area). Each category gets its own wording
   * and its own menu of thresholds that actually split the cohort.
   */
  const SIZE_RULES = {
    country: {
      thresholds: [1000000, 10000000, 100000000, 1000000000],
      text: (op, n) => `with a population ${op === 'over' ? 'over' : 'under'} ${humanCount(n)}`
    },
    capital: {
      thresholds: [1000000, 10000000, 100000000],
      text: (op, n) => `whose country has a population ${op === 'over' ? 'over' : 'under'} ${humanCount(n)}`
    },
    city: {
      thresholds: [500000, 1000000, 5000000, 10000000],
      text: (op, n) => `with a population ${op === 'over' ? 'over' : 'under'} ${humanCount(n)}`
    },
    river: {
      thresholds: [500, 1000, 3000, 5000],
      text: (op, n) => `${op === 'over' ? 'longer' : 'shorter'} than ${withCommas(n)} km`
    },
    mountain: {
      thresholds: [1000, 3000, 5000, 8000],
      text: (op, n) => `${op === 'over' ? 'over' : 'under'} ${withCommas(n)} m tall`
    },
    lake: {
      thresholds: [100, 1000, 10000, 30000],
      text: (op, n) => `${op === 'over' ? 'larger' : 'smaller'} than ${withCommas(n)} km²`
    },
    island: {
      thresholds: [100, 10000, 100000],
      text: (op, n) => `${op === 'over' ? 'bigger' : 'smaller'} than ${withCommas(n)} km²`
    },
    desert: {
      thresholds: [100000, 500000],
      text: (op, n) => `${op === 'over' ? 'larger' : 'smaller'} than ${withCommas(n)} km²`
    },
    sea_ocean: {
      thresholds: [100000, 1000000],
      text: (op, n) => `${op === 'over' ? 'larger' : 'smaller'} than ${withCommas(n)} km²`
    }
  };

  const withCommas = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const humanCount = (n) =>
    n >= 1000000000 ? `${n / 1000000000} billion` : n >= 1000000 ? `${n / 1000000} million` : withCommas(n);

  function satisfiesSize(entry, rule) {
    // A size of 0 is "no sourced figure anywhere" (SPEC 4): the place is
    // real, but nothing is known about how big it is, so it answers no
    // threshold prompt in either direction.
    if (!(entry.size > 0)) return false;
    // Inclusive both ways: a figure sitting exactly on a round threshold is a
    // rounded figure, and "larger than 100,000 km²" should not reject the one
    // desert listed at 100,000 while "smaller than" rejects it too. Where
    // sources disagree the entry carries a range (the Amur is 2,824 km or
    // 4,444 km with the Argun) and either end will do.
    const [lo, hi] = entry.sizeRange || [entry.size, entry.size];
    return rule.op === 'over' ? hi >= rule.value : lo <= rule.value;
  }

  function sizePromptText(category, rule) {
    const noun = NOUN[category];
    return `Name ${ARTICLE(noun)} ${noun} ${SIZE_RULES[category].text(rule.op, rule.value)}.`;
  }

  /**
   * Flag colours (countries only): "whose flag has green in it", or two colours
   * at once. The colours themselves come from the data (scripts/data-flags.mjs),
   * read generously - an emblem's colours count - so a rule can reject a real
   * miss but never a debatable hit.
   */
  function satisfiesFlag(entry, rule) {
    const colours = entry.flag || [];
    return rule.colours.every((colour) => colours.includes(colour));
  }

  function flagPromptText(category, rule) {
    const [first, second] = rule.colours;
    const has = second ? `has both ${first} and ${second} in it` : `has ${first} in it`;
    // "Name the capital of a country whose flag..." - so nobody answers with
    // the country. (A player did.)
    if (category === 'capital') return `Name the capital of a country whose flag ${has}.`;
    if (category === 'city') return `Name a non-capital city in a country whose flag ${has}.`;
    const noun = NOUN[category];
    return `Name ${ARTICLE(noun)} ${noun} whose flag ${has}.`;
  }

  // Letters whose NAME starts with a vowel sound take "an": an F, an S, an X.
  const VOWEL_SOUNDING_LETTERS = 'aefhilmnorsx';

  function letterPromptText(category, rule) {
    const noun = NOUN[category];
    const a = ARTICLE(noun);
    const L = rule.letter ? rule.letter.toUpperCase() : '';
    const aL = VOWEL_SOUNDING_LETTERS.includes(rule.letter) ? 'an' : 'a';
    switch (rule.kind) {
      case 'contains':
        return `Name ${a} ${noun} with ${aL} ${L} in it.`;
      case 'starts':
        return `Name ${a} ${noun} that starts with ${L}.`;
      case 'ends':
        return `Name ${a} ${noun} that ends in ${L}.`;
      case 'short':
        return `Name ${a} ${noun} with a short name (5 letters or fewer).`;
      case 'long':
        return `Name ${a} ${noun} with a long name (12+ letters).`;
      case 'double':
        return `Name ${a} ${noun} with a double letter in its name.`;
      default:
        return `Name ${a} ${noun}.`;
    }
  }

  /**
   * Why a real place misses a letter rule, for the retry hint: "Lake Erie
   * has no double letter", "Fuji doesn't start with M". The length rules
   * have their own hint with the count (run.js `length`).
   */
  /**
   * "Bear Creek has no double letter (Creek doesn't count)": when the name
   * carries a word the letter rules ignore, the miss says so, in the name's
   * own casing. Only for the generic-word categories; a whole-name category
   * counts every word, so there is nothing to explain.
   */
  function uncountedWords(name, category) {
    if (!category || WHOLE_NAME_CATEGORIES.has(category)) return [];
    const filler = letterFillerFor(category);
    const words = name.split(/\s+/);
    return words.filter((word) => {
      const key = matching.normalize(word);
      return key && filler.has(key) && !['the', 'of'].includes(key);
    });
  }

  function letterMissText(name, rule, category) {
    const L = rule.letter ? rule.letter.toUpperCase() : '';
    const skipped = uncountedWords(name, category);
    // A name that is all generic words keeps its full spelling (variantsOf),
    // so nothing was skipped and nothing needs saying.
    const note = skipped.length && skipped.length < name.split(/\s+/).length
      ? ` (${skipped.join(' and ')} ${skipped.length > 1 ? "don't" : "doesn't"} count)`
      : '';
    switch (rule.kind) {
      case 'contains':
        return `${name} has no ${L} in it${note}`;
      case 'starts':
        return `${name} doesn't start with ${L}${note}`;
      case 'ends':
        return `${name} doesn't end in ${L}${note}`;
      case 'double':
        return `${name} has no double letter${note}`;
      default:
        return `${name} doesn't fit this one`;
    }
  }

  /**
   * Build the playable bank from raw category files.
   * @param {Record<string, object[]>} raw     keyed by file stem (see data/bank.js)
   * @param {object} [themes]                  see data/themes.js
   * @param {object} [themePrompts]
   */
  function createBank(raw, themes, themePrompts) {
    const byCategory = new Map();
    for (const entries of Object.values(raw)) {
      for (const entry of entries) {
        if (!byCategory.has(entry.category)) byCategory.set(entry.category, []);
        byCategory.get(entry.category).push(entry);
      }
    }

    const cohorts = new Map();
    for (const category of CATEGORIES) {
      const entries = byCategory.get(category) || [];
      if (entries.length === 0) throw new Error(`bank: no entries for category ${category}`);
      for (const entry of entries) {
        entry.variants = variantsOf(entry);
        entry.spellings = spellingsOf(entry);
      }
      cohorts.set(category, {
        category,
        entries,
        byId: new Map(entries.map((e) => [e.id, e])),
        stats: rarity.cohortStats(entries),
        lookup: matching.buildLookup(entries, { category }),
        subsetLookups: new Map()
      });
    }

    // Regions big enough to scope a prompt to (Spec 6 region list). Countries and
    // capitals share the tags, since a capital inherits its country's regions.
    const regionCounts = new Map();
    for (const entry of cohorts.get('country').entries) {
      for (const region of entry.region || []) {
        regionCounts.set(region, (regionCounts.get(region) || 0) + 1);
      }
    }
    const regions = [...regionCounts.entries()]
      .filter(([, n]) => n >= MIN_REGION_COUNTRIES)
      .map(([name]) => name)
      .sort();

    // Resolve theme member names to entries once, up front.
    const themeSets = new Map(); // category -> Map(theme -> entryId[])
    const themeMisses = [];
    for (const [category, sets] of Object.entries(themes || {})) {
      const cohort = cohorts.get(category);
      if (!cohort) continue;
      const resolved = new Map();
      for (const [theme, names] of Object.entries(sets)) {
        const ids = [];
        for (const name of names) {
          // A namesake is listed with its qualifier, "Syracuse (Sicily)"; a
          // bare name several places share names the one that goes without
          // a qualifier (the Thames, beside Thames (Connecticut)), and
          // nothing when every holder has one.
          let held = matching.idsAt(cohort.lookup, matching.normalize(name));
          if (held.length > 1) held = held.filter((id) => !cohort.byId.get(id).qualifier);
          if (held.length === 1) ids.push(held[0]);
          else themeMisses.push(`${category}/${theme}: "${name}"${held.length ? ` (${held.length} places share it - qualify it)` : ''}`);
        }
        if (ids.length >= MIN_THEME_MEMBERS) resolved.set(theme, [...new Set(ids)]);
      }
      if (resolved.size) themeSets.set(category, resolved);
    }

    // Derived themes are the complement of a curated one. A derived theme only
    // exists when the set it is derived from does; its prompt text is fixed
    // here rather than in data/themes.js, since the theme itself isn't there.
    const derivedPrompts = {};
    for (const [category, derived] of Object.entries(DERIVED_THEMES)) {
      const cohort = cohorts.get(category);
      const sets = themeSets.get(category);
      if (!cohort || !sets) continue;
      for (const [theme, rule] of Object.entries(derived)) {
        const excluded = new Set(sets.get(rule.complementOf) || []);
        if (!excluded.size) continue;
        const ids = cohort.entries.map((entry) => entry.id).filter((id) => !excluded.has(id));
        if (ids.length < MIN_THEME_MEMBERS) continue;
        sets.set(theme, ids);
        derivedPrompts[theme] = rule.prompt;
      }
    }
    const promptTextFor = Object.assign({}, derivedPrompts, themePrompts || {});

    /** A lookup over a subset of a cohort, built on first use and cached. */
    function subsetLookup(cohort, key, filter) {
      if (!key) return cohort.lookup;
      if (!cohort.subsetLookups.has(key)) {
        cohort.subsetLookups.set(key, matching.buildLookup(cohort.entries.filter(filter), { category: cohort.category }));
      }
      return cohort.subsetLookups.get(key);
    }

    function eligibleCount(cohort, filter) {
      let n = 0;
      for (const entry of cohort.entries) if (filter(entry)) n += 1;
      return n;
    }

    /** Try to build a letter rule for a category; null if nothing fits. */
    function drawLetterRule(category, rng) {
      const cohort = cohorts.get(category);
      const kinds = ['contains', 'contains', 'starts', 'starts', 'ends', 'short', 'long', 'double'];
      for (let attempt = 0; attempt < 12; attempt++) {
        const kind = pick(kinds, rng);
        const rule = { kind };
        if (kind === 'contains' || kind === 'starts' || kind === 'ends') rule.letter = pick(LETTERS, rng);
        const n = eligibleCount(cohort, (entry) => satisfiesLetter(entry, rule));
        if (n >= MIN_ELIGIBLE && n <= cohort.entries.length * MAX_ELIGIBLE_SHARE_LETTER) return rule;
      }
      return null;
    }

    /** Oceans with enough members in this category to make a prompt. */
    function oceanOptions(category) {
      const cohort = cohorts.get(category);
      const counts = new Map();
      for (const entry of cohort.entries) {
        for (const ocean of entry.oceans || []) counts.set(ocean, (counts.get(ocean) || 0) + 1);
      }
      return [...counts].filter(([, n]) => n >= MIN_ELIGIBLE).map(([ocean]) => ocean);
    }

    /** A size threshold that splits the cohort usefully; null if none does. */
    function drawSizeRule(category, rng) {
      const cohort = cohorts.get(category);
      const rules = SIZE_RULES[category];
      if (!rules) return null;
      const candidates = shuffle(rules.thresholds, rng);
      // The share is measured over the rows that can answer a size rule at
      // all: a size-0 row (no sourced figure, SPEC 4) satisfies neither side,
      // so counting it would make "smaller than X" look rare in a cohort
      // where most rows are simply unmeasured (the 2026-09-17 seas audit).
      const sized = eligibleCount(cohort, (entry) => entry.size > 0);
      for (const value of candidates) {
        for (const op of shuffle(['over', 'under'], rng)) {
          const rule = { op, value };
          const n = eligibleCount(cohort, (entry) => satisfiesSize(entry, rule));
          if (n >= MIN_ELIGIBLE && n <= sized * MAX_ELIGIBLE_SHARE) return rule;
        }
      }
      return null;
    }

    /** Every flag colour any entry in this category carries, alphabetical; cached. */
    const flagPalettes = new Map();
    function flagPalette(category) {
      if (!flagPalettes.has(category)) {
        const colours = new Set();
        for (const entry of cohorts.get(category).entries) for (const c of entry.flag || []) colours.add(c);
        flagPalettes.set(category, [...colours].sort());
      }
      return flagPalettes.get(category);
    }

    /**
     * One colour, or a pair, that a useful number of flags carry. A pair is
     * always in palette order so "both green and yellow" and "both yellow and
     * green" can't both turn up as if they were different questions.
     */
    function drawFlagRule(category, rng) {
      const cohort = cohorts.get(category);
      const palette = flagPalette(category);
      if (palette.length === 0) return null;
      for (let attempt = 0; attempt < 12; attempt++) {
        const wanted = rng() < 0.5 ? 1 : 2;
        const colours = shuffle(palette, rng).slice(0, wanted).sort();
        const rule = { colours };
        const n = eligibleCount(cohort, (entry) => satisfiesFlag(entry, rule));
        if (n >= MIN_ELIGIBLE && n <= cohort.entries.length * MAX_ELIGIBLE_SHARE) return rule;
      }
      return null;
    }

    /**
     * Regions a category can be scoped to. Countries and capitals: every
     * region with enough countries (one capital each). Cities: only regions
     * where enough cities actually live - Central Asia has six countries but
     * might have two cities in the bank, and "Name a city in Central Asia"
     * must not be a trick question.
     */
    const regionOptionsFor = new Map();
    function regionOptions(category) {
      if (category === 'country' || category === 'capital') return regions;
      if (category !== 'city') return [];
      if (!regionOptionsFor.has(category)) {
        const cohort = cohorts.get(category);
        regionOptionsFor.set(
          category,
          regions.filter((region) => eligibleCount(cohort, (entry) => (entry.region || []).includes(region)) >= MIN_ELIGIBLE)
        );
      }
      return regionOptionsFor.get(category);
    }

    /** One random modifier for a category, or null when nothing fits. */
    function drawModifier(category, rng) {
      const options = [];
      if (regionOptions(category).length) options.push('region', 'region');
      if (themeSets.has(category)) options.push('theme', 'theme');
      if (oceanOptions(category).length) options.push('ocean', 'ocean');
      // Flags weigh the same as the other kinds (3 felt heavy at ~0.8 per run;
      // 2 is ~0.6, which is "just a bit" more than the 1 they started at).
      if (flagPalette(category).length) options.push('flag', 'flag');
      if (SIZE_RULES[category]) options.push('size');
      options.push('letter', 'letter');

      const choice = pick(options, rng);
      if (choice === 'region') return { region: pick(regionOptions(category), rng) };
      if (choice === 'theme') return { theme: pick([...themeSets.get(category).keys()], rng) };
      if (choice === 'ocean') return { ocean: pick(oceanOptions(category), rng) };
      if (choice === 'flag') {
        const rule = drawFlagRule(category, rng);
        return rule ? { flag: rule } : null;
      }
      if (choice === 'size') {
        const rule = drawSizeRule(category, rng);
        return rule ? { size: rule } : null;
      }
      const rule = drawLetterRule(category, rng);
      return rule ? { letter: rule } : null;
    }

    /**
     * The 15 category slots for one run (Spec 3.8), each with a modifier.
     *
     * The first three rounds are plain and in three different categories, so a
     * run opens gently; after that the chance of a modifier ramps up. No two
     * rounds ever show the same prompt text: a category's second appearance is
     * re-drawn until it reads differently from its first, so a repeat category
     * is never a repeat question.
     */
    function drawSlots(rng = Math.random) {
      // Every category once, then enough of a second shuffled copy to fill the
      // run: 9 categories + 6 repeats = 15 rounds (Spec 3.8).
      const first = shuffle(CATEGORIES, rng);
      const second = shuffle(CATEGORIES, rng).slice(0, rarity.ROUNDS_PER_RUN - CATEGORIES.length);
      // Distinct categories to open with, then everything else shuffled.
      const opening = first.slice(0, OPENING_ROUNDS);
      const rest = shuffle(first.slice(OPENING_ROUNDS).concat(second), rng);
      const order = opening.concat(rest);

      const seenText = new Set();
      return order.map((category, index) => {
        const plain = { category };
        const plainText = promptFor(plain).text;

        if (index < OPENING_ROUNDS) {
          seenText.add(plainText);
          return plain;
        }

        // 0 on the first round after the opening -> 1 on the last round.
        const progress = (index - OPENING_ROUNDS) / (order.length - OPENING_ROUNDS - 1);
        const constrainedChance = MODIFIER_CHANCE_START + progress * (MODIFIER_CHANCE_END - MODIFIER_CHANCE_START);
        const wantModifier = rng() < constrainedChance || seenText.has(plainText);

        if (wantModifier) {
          for (let attempt = 0; attempt < 20; attempt++) {
            const modifier = drawModifier(category, rng);
            if (!modifier) continue;
            const slot = { category, ...modifier };
            const text = promptFor(slot).text;
            if (!seenText.has(text)) {
              seenText.add(text);
              return slot;
            }
          }
        }
        if (!seenText.has(plainText)) {
          seenText.add(plainText);
          return plain;
        }
        // Every draw collided - fall through to a letter rule keyed to the
        // attempt so it cannot collide with a finite set of earlier texts.
        for (const letter of shuffle(LETTERS, rng)) {
          const slot = { category, letter: { kind: 'contains', letter } };
          const text = promptFor(slot).text;
          if (!seenText.has(text) && promptFor(slot).lookup.size > 0) {
            seenText.add(text);
            return slot;
          }
        }
        return plain; // unreachable in practice: 23 letters can't all collide
      });
    }

    /** A slot plus everything a round needs to render and judge it. */
    function promptFor(slot) {
      const cohort = cohorts.get(slot.category);
      const noun = NOUN[slot.category];
      const a = ARTICLE(noun);
      let text = PLAIN_TEXT[slot.category] || `Name ${a} ${noun}.`;
      let lookup = cohort.lookup;
      let scope = null;

      if (slot.region) {
        text = `Name ${a} ${noun} in ${regionPhrase(slot.region)}.`;
        scope = `region:${slot.region}`;
        lookup = subsetLookup(cohort, scope, (entry) => (entry.region || []).includes(slot.region));
      } else if (slot.theme) {
        const ids = new Set((themeSets.get(slot.category) || new Map()).get(slot.theme) || []);
        const custom = promptTextFor[slot.theme];
        // "Name a sea or ocean in the Americas" invites "Pacific", which the
        // theme doesn't hold: a sea theme says "sea" unless an ocean is in it.
        const themeNoun =
          slot.category === 'sea_ocean' && ![...ids].some((id) => / ocean$/i.test(cohort.byId.get(id).name)) ? 'sea' : noun;
        text = custom || `Name ${ARTICLE(themeNoun)} ${themeNoun} in ${slot.theme}.`;
        scope = `theme:${slot.theme}`;
        lookup = subsetLookup(cohort, scope, (entry) => ids.has(entry.id));
      } else if (slot.ocean) {
        // Islands and seas carry their ocean(s) as data (scripts/data-oceans.mjs),
        // so "in the Pacific Ocean" is derived, never a list a curator forgot Hawaii on.
        const seaNoun = slot.category === 'sea_ocean' ? 'sea' : noun;
        text = `Name ${ARTICLE(seaNoun)} ${seaNoun} in the ${slot.ocean} Ocean.`;
        scope = `ocean:${slot.ocean}`;
        lookup = subsetLookup(cohort, scope, (entry) => (entry.oceans || []).includes(slot.ocean));
      } else if (slot.flag) {
        text = flagPromptText(slot.category, slot.flag);
        scope = `flag:${slot.flag.colours.join('+')}`;
        lookup = subsetLookup(cohort, scope, (entry) => satisfiesFlag(entry, slot.flag));
      } else if (slot.size) {
        text = sizePromptText(slot.category, slot.size);
        scope = `size:${slot.size.op}:${slot.size.value}`;
        lookup = subsetLookup(cohort, scope, (entry) => satisfiesSize(entry, slot.size));
      } else if (slot.letter) {
        text = letterPromptText(slot.category, slot.letter);
        scope = `letter:${slot.letter.kind}:${slot.letter.letter || ''}`;
        lookup = subsetLookup(cohort, scope, (entry) => satisfiesLetter(entry, slot.letter));
      }

      // A length prompt also judges the spelling the player typed (see
      // LENGTH_RULES): as typed, or with its generic words trimmed, whichever
      // fits. The hint reports the spelling as typed.
      const lengthRule = slot.letter && LENGTH_RULES[slot.letter.kind];
      const judgeTyped = lengthRule
        ? (matchedKey) => {
            const full = letters(matchedKey).length;
            const trimmed = letters(matching.looseKey(matchedKey)).length;
            const forLetters = letters(matching.looseKey(matchedKey, letterFillerFor(slot.category))).length;
            if (lengthRule.ok(full) || (trimmed > 0 && lengthRule.ok(trimmed)) || (forLetters > 0 && lengthRule.ok(forLetters))) return null;
            return { letters: full, need: lengthRule.need };
          }
        : null;

      return {
        category: slot.category,
        label: CATEGORY_LABEL[slot.category],
        region: slot.region || null,
        theme: slot.theme || null,
        ocean: slot.ocean || null,
        flag: slot.flag || null,
        size: slot.size || null,
        letter: slot.letter || null,
        // What to call the restriction when an answer misses it. A theme with
        // its own prompt text ("Name a volcano.", "Name a US state capital.")
        // is not a place the answer can be "in", so it gets the generic hint;
        // a theme worded "in the Alps" is.
        scopeName:
          (slot.region ? regionPhrase(slot.region) : null) || (slot.theme && !promptTextFor[slot.theme] ? slot.theme : null) ||
          (slot.ocean ? `the ${slot.ocean} Ocean` : null) ||
          (slot.size || slot.letter || slot.flag || slot.theme ? 'that pattern' : null),
        constrained: Boolean(scope),
        text,
        cohort,
        lookup,
        judgeTyped
      };
    }

    return {
      cohorts,
      regions,
      themes: themeSets,
      themeMisses,
      categories: CATEGORIES,
      counts: Object.fromEntries([...cohorts].map(([c, v]) => [c, v.entries.length])),
      drawSlots,
      promptFor
    };
  }

  /** Reads the bundled <script> data (data/bank.js + data/themes.js). */
  function loadBank(global) {
    const scope = global || root;
    const raw = scope.WORMILLION_BANK;
    if (!raw) throw new Error('data/bank.js did not load');
    return createBank(raw, scope.WORMILLION_THEMES, scope.WORMILLION_THEME_PROMPTS);
  }

  return {
    CATEGORIES,
    NOUN,
    wantsPhrase,
    ARTICLE,
    CATEGORY_LABEL,
    LETTER_FILLER,
    MIN_REGION_COUNTRIES,
    MIN_ELIGIBLE,
    MAX_ELIGIBLE_SHARE,
    MAX_ELIGIBLE_SHARE_LETTER,
    MIN_THEME_MEMBERS,
    OPENING_ROUNDS,
    MODIFIER_CHANCE_START,
    MODIFIER_CHANCE_END,
    DERIVED_THEMES,
    shuffle,
    variantsOf,
    spellingsOf,
    satisfiesLetter,
    letterPromptText,
    letterMissText,
    satisfiesSize,
    sizePromptText,
    SIZE_RULES,
    satisfiesFlag,
    flagPromptText,
    createBank,
    loadBank
  };
});
