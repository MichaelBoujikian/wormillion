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
      .toLowerCase()
      .replace(/[‘’ʼ]/g, "'")
      .replace(/[–—‒]/g, '-')
      .replace(/[.,']/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Words that carry no identifying information in a place name. Dropping them
  // lets "Everest", "Mount Everest" and "Mt Everest" all land on one entry.
  const FILLER = new Set([
    'mount', 'mt', 'mountain', 'peak', 'hill', 'lake', 'loch', 'lough', 'llyn',
    'river', 'sea', 'ocean', 'gulf', 'bay', 'island', 'islands', 'isle', 'isles',
    'desert', 'the', 'of', 'city', 'saint', 'st', 'cape', 'atoll'
  ]);

  /** The identifying words of a name, filler removed. Empty if it is all filler. */
  function looseKey(input) {
    const words = normalize(input).split(' ').filter((w) => w && !FILLER.has(w));
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
   */
  function buildLookup(entries) {
    const lookup = new Map();
    const loose = new Map();
    const ambiguous = new Set();
    const candidates = [];

    for (const entry of entries) {
      for (const candidate of [entry.name, ...(entry.aliases || [])]) {
        const key = normalize(candidate);
        if (!key) continue;
        if (!lookup.has(key)) lookup.set(key, entry.id);
        candidates.push({ key, id: entry.id });

        const bare = looseKey(candidate);
        if (!bare || bare === key) continue;
        if (loose.has(bare) && loose.get(bare) !== entry.id) ambiguous.add(bare);
        else loose.set(bare, entry.id);
      }
    }
    // A loose key that two different places share identifies neither of them.
    for (const key of ambiguous) loose.delete(key);

    lookup.loose = loose;
    lookup.candidates = candidates;
    return lookup;
  }

  /**
   * Closest candidate to `key`, or null when nothing is close enough or two
   * candidates are equally close (an ambiguous near-miss is not a correction).
   */
  function nearest(key, lookup) {
    const candidates = lookup.candidates;
    if (!candidates || key.length < 4) return null;
    const max = slackFor(key.length);
    if (max === 0) return null;

    let bestDistance = max + 1;
    let winners = [];

    for (const candidate of candidates) {
      const distance = editDistance(key, candidate.key, max);
      if (distance > max) continue;
      if (distance < bestDistance) {
        bestDistance = distance;
        winners = [candidate];
      } else if (distance === bestDistance && !winners.some((w) => w.id === candidate.id)) {
        winners.push(candidate);
      }
    }

    // Two different places equally close is not a typo, it's a coin flip.
    if (winners.length !== 1) return null;
    return { id: winners[0].id, key: winners[0].key, distance: bestDistance };
  }

  /**
   * @returns {{status:'accepted',entryId:string}
   *          |{status:'corrected',entryId:string,typed:string}
   *          |{status:'duplicate',entryId:string}
   *          |{status:'unrecognized'}}
   */
  function matchAnswer(rawInput, lookup, usedAnswers, options) {
    const key = normalize(rawInput);
    if (!key) return { status: 'unrecognized' };

    const settle = (entryId, status, extra) => {
      if (usedAnswers && usedAnswers.has(entryId)) return { status: 'duplicate', entryId };
      return Object.assign({ status, entryId }, extra);
    };

    const exact = lookup.get(key);
    if (exact) return settle(exact, 'accepted');

    const loose = lookup.loose && (lookup.loose.get(key) || lookup.loose.get(looseKey(key)));
    if (loose) return settle(loose, 'accepted');

    if (!options || options.fuzzy !== false) {
      const near = nearest(key, lookup);
      if (near) return settle(near.id, 'corrected', { typed: rawInput.trim() });
    }

    return { status: 'unrecognized' };
  }

  return { normalize, looseKey, editDistance, slackFor, buildLookup, matchAnswer };
});
