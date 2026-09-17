/**
 * Answer matching (Spec 5.3) and normalization (Spec 3.7).
 * Standalone: no dependency on rarity.js, run.js, or the DOM.
 *
 * Three passes, cheapest first:
 *   1. exact  - the normalized answer is a known name or alias
 *   2. loose  - same, ignoring geographic filler words ("mount", "lake", "the"),
 *               so "Kilimanjaro" finds "Mount Kilimanjaro" without an alias
 *   3. fuzzy  - closest name within a small edit distance, the way autocorrect
 *               would fix it, reported back so the player sees the real spelling
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Wormillion = root.Wormillion || {}).matching = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /**
   * Normalization, not spelling correction.
   * "St. Lucia", "st lucia" and "St Lucia" all normalize to "st lucia".
   */
  function normalize(input) {
    if (typeof input !== 'string') return '';
    return input
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // strip diacritics so "Yaoundé" == "Yaounde"
      // ...and fold the letters NFD leaves alone, so "Møn" == "Mon"
      .replace(/ø/gi, 'o').replace(/æ/gi, 'ae').replace(/œ/gi, 'oe').replace(/ł/gi, 'l').replace(/ß/g, 'ss').replace(/[đð]/gi, 'd')
      .toLowerCase()
      .replace(/[‘’ʼ]/g, "'")
      .replace(/[–—‒]/g, '-')
      .replace(/[.,']/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      // "Mt Vernon" is "Mount Vernon" (2026-09-16 audit: a city named Mount X
      // typed as Mt X had no exact hit and "mt" is a mountain's word)
      .replace(/^mt (?=\S)|(?<= )mt (?=\S)/g, 'mount ');
  }

  // Words that carry no identifying information in a place name. Dropping them
  // lets "Everest", "Mount Everest" and "Mt Everest" all land on one entry.
  const FILLER = new Set([
    'mount', 'mt', 'mountain', 'peak', 'hill', 'lake', 'loch', 'lough', 'llyn',
    'river', 'rio', 'sea', 'ocean', 'gulf', 'bay', 'island', 'islands', 'isle', 'isles',
    'desert', 'the', 'of', 'city', 'saint', 'st', 'cape', 'atoll',
    // 2026-09-16: a reservoir is a lake to the player - "Elephant Butte" finds
    // Elephant Butte Reservoir the way "Superior" finds Lake Superior
    'reservoir'
  ]);
  /** The generic words in a normalized key, in order. */
  const fillerIn = (key) => key.split(' ').filter((w) => FILLER.has(w));

  // Which category each generic word belongs to. A lookup built for a cohort
  // (`buildLookup(entries, { category })`) drops a generic word only when it
  // is that cohort's own word or nobody's: "Lake Michigan" on a river round
  // is not Michigan River, "Rapid City" is not Rapid River, "Mount Foraker"
  // is not Foraker River, and "Lake Meade" on a lake round is Lake Mead even
  // when a river is called Meade (2026-09-16, SPEC 3.7). "the", "of",
  // "saint", "st" and "cape" belong to nobody and never get in the way.
  const WORD_CATEGORY = {
    mount: ['mountain'], mt: ['mountain'], mountain: ['mountain'], peak: ['mountain'], hill: ['mountain'],
    lake: ['lake'], loch: ['lake'], lough: ['lake'], llyn: ['lake'], reservoir: ['lake'],
    river: ['river'], rio: ['river'],
    sea: ['sea_ocean'], ocean: ['sea_ocean'], gulf: ['sea_ocean'], bay: ['sea_ocean'],
    island: ['island'], islands: ['island'], isle: ['island'], isles: ['island'], atoll: ['island'],
    desert: ['desert'],
    city: ['city', 'capital']
  };
  /** True when the key carries a generic word that names a category other than `category`. */
  function foreignWordIn(key, category) {
    if (!category) return false;
    return fillerIn(key).some((w) => WORD_CATEGORY[w] && !WORD_CATEGORY[w].includes(category));
  }

  /**
   * The identifying words of a name, filler removed. Empty if it is all filler.
   * Pass a different `filler` set to strip by a different rule (the letter
   * prompts use a narrower one - see promptBank.js).
   */
  function looseKey(input, filler = FILLER) {
    const words = normalize(input).split(' ').filter((w) => w && !filler.has(w));
    return words.join(' ');
  }

  /**
   * Damerau-Levenshtein (optimal string alignment) distance, with an early exit
   * once the best possible result exceeds `max`.
   */
  function editDistance(a, b, max) {
    if (a === b) return 0;
    if (Math.abs(a.length - b.length) > max) return max + 1;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    let prev2 = [];
    let prev = [];
    let row = [];
    for (let j = 0; j <= b.length; j++) prev[j] = j;

    for (let i = 1; i <= a.length; i++) {
      row = [i];
      let best = i;
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        let value = Math.min(row[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
        // transposition: "egpyt" -> "egypt" is one edit, not two
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          value = Math.min(value, prev2[j - 2] + 1);
        }
        row[j] = value;
        if (value < best) best = value;
      }
      if (best > max) return max + 1; // no cell in this row can lead anywhere good
      prev2 = prev;
      prev = row;
    }
    return prev[b.length];
  }

  /**
   * How wrong an answer is allowed to be. Short names get no slack at all -
   * "Kos" and "Kor" are a single edit apart and only one of them is a place.
   */
  function slackFor(length) {
    if (length <= 4) return 0;
    if (length <= 7) return 1;
    if (length <= 11) return 2;
    return 3;
  }

  /**
   * Flat normalized-string -> entry id map for a cohort, plus the loose and
   * fuzzy indexes. Built once per prompt, never per keystroke.
   * @param {{id:string,name:string,aliases?:string[]}[]} entries
   * @param {{category?:string}} [options]  the cohort's category, so the loose
   *   and fuzzy passes know which generic words are its own (WORD_CATEGORY);
   *   without it every generic word is optional, as before
   */
  function buildLookup(entries, options) {
    const lookup = new Map();
    lookup.category = (options && options.category) || null;
    const candidates = [];
    const claims = new Map(); // bare -> [{ id, fromName }]

    for (const entry of entries) {
      [entry.name, ...(entry.aliases || [])].forEach((candidate, i) => {
        const key = normalize(candidate);
        if (!key) return;
        if (!lookup.has(key)) lookup.set(key, entry.id);
        const bare = looseKey(candidate);
        // The fuzzy pass compares the filler-stripped forms too (see nearest).
        candidates.push({ key, bare: bare || key, filler: fillerIn(key), id: entry.id });

        if (!bare || bare === key) return;
        if (!claims.has(bare)) claims.set(bare, []);
        claims.get(bare).push({ id: entry.id, fromName: i === 0 });
      });
    }

    lookup.loose = resolveLoose(claims);
    lookup.candidates = candidates;
    return lookup;
  }

  /**
   * Which entry, if any, a bare loose form identifies. A form that comes from
   * one entry's NAME beats the same form from another entry's alias: "Arabian"
   * is the Arabian Sea even though the Persian Gulf is also called the Arabian
   * Gulf. Two names, or two aliases with no name, identify neither - "Victoria"
   * is not a guess between Lake Victoria and Victoria Island.
   * @param {Map<string, {id:string, fromName:boolean}[]>} claims
   */
  function resolveLoose(claims) {
    const loose = new Map();
    for (const [bare, list] of claims) {
      const names = new Set(list.filter((c) => c.fromName).map((c) => c.id));
      const all = new Set(list.map((c) => c.id));
      if (names.size === 1) loose.set(bare, [...names][0]);
      else if (names.size === 0 && all.size === 1) loose.set(bare, [...all][0]);
    }
    return loose;
  }

  /**
   * Closest candidate to `key`, or null when nothing is close enough or two
   * candidates are equally close (an ambiguous near-miss is not a correction).
   *
   * The edit budget comes from the name proper, not the generic word around
   * it: "Lake Takern" gets the slack of "takern" (one edit), not of "lake
   * takern" (two), so the word "Lake" cannot buy the edits that would turn
   * it into Lake Vanern - a player naming a lake the bank lacks is refused,
   * not sent to another country. Both the full strings and their
   * filler-stripped forms are compared, so "Mount Kilimanjro" still corrects
   * to Mount Kilimanjaro, and so does "Kilimanjro" on its own. Two
   * refinements: a hit on the full string beats a hit on the stripped form
   * at the same distance ("Lotse" is Lhotse, not a tie with Lose Hill), and
   * a generic word typed AND carried by the candidate is worth one edit even
   * for a four-letter name ("Mount Fugi" is Mount Fuji; three get nothing) - what the player
   * said they were naming is evidence. `options.bare === false` skips the
   * stripped-form comparison (the cross-category nudge uses it: a river's
   * bare name one edit from a misspelt country is not a nudge).
   */
  function nearest(key, lookup, options) {
    const candidates = lookup.candidates;
    if (!candidates) return null;
    const useBare = !options || options.bare !== false;
    const stripped = looseKey(key);
    const bare = stripped || key;
    const typedFiller = fillerIn(key);
    // No name proper, no budget: "River Isle" is all generic words and must
    // not borrow ten characters' worth of slack to become River Mole
    // (2026-09-16 audit); the shared-word edit below still applies.
    const max = stripped ? slackFor(stripped.length) : 0;
    const sharedWordMax = typedFiller.length && bare.length >= 4 ? 1 : 0;
    if (max === 0 && sharedWordMax === 0) return null;

    // A score is the distance doubled, plus one for a stripped-form hit, so
    // the full-string hit wins a tie and everything else ties as before.
    let bestScore = Infinity;
    let winners = [];

    // A typed plural of a name that ends in a generic word is a group, not a
    // typo: "Great Lakes" is not Great Lake (Tasmania), "Bear Lakes" is not
    // Bear Lake, and neither is anything else nearby - the input is refused
    // outright (2026-09-16; the first cut skipped the singular and let the
    // next place within budget win: "Great Salt Lakes" became Great Salt
    // Plains Lake). A plural of any other name is an ordinary typo ("Irelands"
    // is Ireland), and "Loch Nesss" is a typo too: nothing ending in s takes
    // a plural s.
    let plural = null;
    for (const candidate of candidates) {
      if (key === candidate.key + 's' && !candidate.key.endsWith('s') && FILLER.has(candidate.key.split(' ').pop())) { plural = candidate; continue; }
      const shares = sharedWordMax > 0 && candidate.filler.some((w) => typedFiller.includes(w));
      const fullMax = Math.max(max, shares ? sharedWordMax : 0);
      let score = Infinity;
      if (fullMax > 0) {
        const d = editDistance(key, candidate.key, fullMax);
        if (d <= fullMax) score = d * 2;
      }
      if (useBare && max > 0 && (bare !== key || candidate.bare !== candidate.key)) {
        const d = editDistance(bare, candidate.bare, max);
        if (d <= max) score = Math.min(score, d * 2 + 1);
      }
      if (score === Infinity) continue;
      if (score < bestScore) {
        bestScore = score;
        winners = [candidate];
      } else if (score === bestScore && !winners.some((w) => w.id === candidate.id)) {
        winners.push(candidate);
      }
    }

    if (plural) return null;
    // Two different places equally close is not a typo, it's a coin flip.
    if (winners.length !== 1) return null;
    return { id: winners[0].id, key: winners[0].key, distance: bestScore >> 1 };
  }

  /**
   * @param {{fuzzy?:boolean, loose?:boolean, bare?:boolean}} [options]  pass `false` to skip that pass (`bare`: the fuzzy pass's stripped-form comparison)
   * @returns {{status:'accepted',entryId:string,matched:string}
   *          |{status:'corrected',entryId:string,typed:string,matched:string}
   *          |{status:'duplicate',entryId:string}
   *          |{status:'unrecognized'}}
   *   `matched` is the normalized spelling that landed: what was typed for an
   *   exact or loose hit, the corrected candidate for a fuzzy one.
   */
  function matchAnswer(rawInput, lookup, usedAnswers, options) {
    const key = normalize(rawInput);
    if (!key) return { status: 'unrecognized' };

    const settle = (entryId, status, extra) => {
      if (usedAnswers && usedAnswers.has(entryId)) return { status: 'duplicate', entryId };
      return Object.assign({ status, entryId }, extra);
    };

    const exact = lookup.get(key);
    if (exact) return settle(exact, 'accepted', { matched: key });

    // A generic word of ANOTHER category is not filler here: "Lake Michigan"
    // on a river round names a lake, and dropping "lake" to find Michigan
    // River would score the wrong place. Only the whole string is compared
    // from here on (run.js then finds the lake and says so).
    const foreign = foreignWordIn(key, lookup.category);

    // Filler is optional in both directions: "Everest" finds "Mount Everest"
    // through the loose index, and "Mount Denali" finds "Denali" by dropping
    // the filler the player added and trying the exact names again.
    if ((!options || options.loose !== false) && !foreign) {
      const bare = looseKey(key);
      const loose =
        (lookup.loose && (lookup.loose.get(key) || lookup.loose.get(bare))) ||
        (bare && bare !== key && lookup.get(bare));
      if (loose) return settle(loose, 'accepted', { matched: key });
    }

    if (!options || options.fuzzy !== false) {
      const near = nearest(key, lookup, foreign ? Object.assign({}, options, { bare: false }) : options);
      if (near) return settle(near.id, 'corrected', { typed: rawInput.trim(), matched: near.key });
    }

    return { status: 'unrecognized' };
  }

  return { normalize, looseKey, editDistance, slackFor, buildLookup, resolveLoose, matchAnswer, FILLER, WORD_CATEGORY, foreignWordIn };
});
