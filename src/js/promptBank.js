/**
 * The prompt bank: turns the raw content bank into cohorts, lookups and a
 * 15-slot run draw (Spec 3.8, 5.3, 6). No DOM.
 *
 * A slot is a category plus an optional MODIFIER, which is what makes one round
 * different from the next:
 *
 *   region     "Name a country in Southeast Asia."   (country/capital only)
 *   theme      "Name a river in Mesopotamia."        (curated sets, data/themes.js)
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

  const CATEGORIES = ['country', 'capital', 'lake', 'river', 'mountain', 'desert', 'island', 'sea_ocean'];

  // The noun used in generated prompt text, and the plain fallback prompt.
  const NOUN = {
    country: 'country',
    capital: 'capital city',
    lake: 'lake',
    river: 'river',
    mountain: 'mountain',
    desert: 'desert',
    island: 'island',
    sea_ocean: 'sea or ocean'
  };

  const ARTICLE = (noun) => (/^[aeiou]/i.test(noun) ? 'an' : 'a');

  const CATEGORY_LABEL = {
    country: 'Country',
    capital: 'Capital',
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
  // ...and must actually rule something out.
  const MAX_ELIGIBLE_SHARE = 0.6;

  const LETTERS = 'abcdefghijklmnoprstuvwz'.split('');

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

  /**
   * The spellings a letter rule is allowed to look at: the name exactly as the
   * game displays it, plus every name and alias with filler words stripped.
   *
   * So "Lake Baikal" counts for both "starts with L" (as written) and "starts
   * with B" (as everyone says it) - but "Nile" does NOT count for "has a T in
   * it" just because one of its aliases is "the Nile". Filler words are not part
   * of a place's spelling.
   */
  function variantsOf(entry) {
    const out = new Set();
    const canonical = matching.normalize(entry.name);
    if (canonical) out.add(canonical);
    for (const candidate of [entry.name, ...(entry.aliases || [])]) {
      const bare = matching.looseKey(candidate);
      if (bare) out.add(bare);
    }
    return [...out];
  }

  const letters = (text) => text.replace(/[^a-z]/g, '');

  /** Does any spelling of this entry satisfy the letter rule? */
  function satisfiesLetter(entry, rule) {
    return entry.variants.some((variant) => {
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
      for (const entry of entries) entry.variants = variantsOf(entry);
      cohorts.set(category, {
        category,
        entries,
        byId: new Map(entries.map((e) => [e.id, e])),
        stats: rarity.cohortStats(entries),
        lookup: matching.buildLookup(entries),
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
          const id = cohort.lookup.get(matching.normalize(name));
          if (id) ids.push(id);
          else themeMisses.push(`${category}/${theme}: "${name}"`);
        }
        if (ids.length >= MIN_THEME_MEMBERS) resolved.set(theme, [...new Set(ids)]);
      }
      if (resolved.size) themeSets.set(category, resolved);
    }

    /** A lookup over a subset of a cohort, built on first use and cached. */
    function subsetLookup(cohort, key, filter) {
      if (!key) return cohort.lookup;
      if (!cohort.subsetLookups.has(key)) {
        cohort.subsetLookups.set(key, matching.buildLookup(cohort.entries.filter(filter)));
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
        if (n >= MIN_ELIGIBLE && n <= cohort.entries.length * MAX_ELIGIBLE_SHARE) return rule;
      }
      return null;
    }

    /**
     * The 15 category slots for one run (Spec 3.8), each with a modifier.
     * Difficulty ramps: early rounds are mostly plain, late rounds mostly
     * constrained, so a run opens gently and closes hard.
     */
    function drawSlots(rng = Math.random) {
      const first = shuffle(CATEGORIES, rng);
      const second = shuffle(CATEGORIES, rng).slice(0, CATEGORIES.length - 1);
      const order = shuffle(first.concat(second), rng);

      return order.map((category, index) => {
        const progress = index / (order.length - 1); // 0 -> 1 across the run
        const constrainedChance = 0.3 + progress * 0.55;
        const slot = { category };
        if (rng() > constrainedChance) return slot;

        const options = [];
        if ((category === 'country' || category === 'capital') && regions.length) options.push('region');
        if (themeSets.has(category)) options.push('theme', 'theme');
        options.push('letter', 'letter');

        const choice = pick(options, rng);
        if (choice === 'region') {
          slot.region = pick(regions, rng);
        } else if (choice === 'theme') {
          slot.theme = pick([...themeSets.get(category).keys()], rng);
        } else {
          const rule = drawLetterRule(category, rng);
          if (rule) slot.letter = rule;
        }
        return slot;
      });
    }

    /** A slot plus everything a round needs to render and judge it. */
    function promptFor(slot) {
      const cohort = cohorts.get(slot.category);
      const noun = NOUN[slot.category];
      const a = ARTICLE(noun);
      let text = `Name ${a} ${noun}.`;
      let lookup = cohort.lookup;
      let scope = null;

      if (slot.region) {
        text = `Name ${a} ${noun} in ${slot.region}.`;
        scope = `region:${slot.region}`;
        lookup = subsetLookup(cohort, scope, (entry) => (entry.region || []).includes(slot.region));
      } else if (slot.theme) {
        const ids = new Set((themeSets.get(slot.category) || new Map()).get(slot.theme) || []);
        const custom = (themePrompts || {})[slot.theme];
        text = custom || `Name ${a} ${noun} in ${slot.theme}.`;
        scope = `theme:${slot.theme}`;
        lookup = subsetLookup(cohort, scope, (entry) => ids.has(entry.id));
      } else if (slot.letter) {
        text = letterPromptText(slot.category, slot.letter);
        scope = `letter:${slot.letter.kind}:${slot.letter.letter || ''}`;
        lookup = subsetLookup(cohort, scope, (entry) => satisfiesLetter(entry, slot.letter));
      }

      return {
        category: slot.category,
        label: CATEGORY_LABEL[slot.category],
        region: slot.region || null,
        theme: slot.theme || null,
        letter: slot.letter || null,
        // What to call the restriction when an answer misses it.
        scopeName: slot.region || slot.theme || (slot.letter ? 'that pattern' : null),
        constrained: Boolean(scope),
        text,
        cohort,
        lookup
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
    CATEGORY_LABEL,
    MIN_REGION_COUNTRIES,
    MIN_ELIGIBLE,
    MIN_THEME_MEMBERS,
    shuffle,
    variantsOf,
    satisfiesLetter,
    letterPromptText,
    createBank,
    loadBank
  };
});
