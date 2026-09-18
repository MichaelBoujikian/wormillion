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
      .replace(/ø/gi, 'o').replace(/æ/gi, 'ae').replace(/œ/gi, 'oe').replace(/ł/gi, 'l').replace(/ß/g, 'ss').replace(/[đð]/gi, 'd').replace(/þ/gi, 'th')
      .toLowerCase()
      // the Hawaiian okina (U+02BB) is an apostrophe too: "Kaneʻohe" == "Kane'ohe" == "Kaneohe"
      .replace(/[‘’ʼʻ]/g, "'")
      // a hyphen is a space: "Saint-Ouen-sur-Seine" typed "Saint Ouen sur Seine" is the
      // same name, and "St" inside it can only be filler once it stands alone
      // (2026-09-17 audit: 47 hyphenated rows landed only as corrections)
      .replace(/[-–—‒]/g, ' ')
      // ...and so are parentheses: "Syracuse (Sicily)", "Syracuse, Sicily" and
      // "Syracuse Sicily" are one qualified name (decision 5, 2026-09-18)
      // ...and "!" and "?": the Ha! Ha! River is typed "Ha Ha" (the 2026-09-18 rivers audit)
      .replace(/[.,'()!?]/g, '')
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
    // 2026-09-16: "Fiume Sacco", "Fleuve Charente", "Fluss Isar", "Rivier Dinkel"
    'fiume', 'fleuve', 'fluss', 'riviere', 'rivier',
    // "Lago di Nemi", "Lac du Bourget", "Lagoa do Fogo", "Laguna di Orbetello", "Etang de Thau"
    'lago', 'lac', 'lagoa', 'laguna', 'etang',
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
    lake: ['lake'], loch: ['lake', 'sea_ocean'], lough: ['lake', 'sea_ocean'], llyn: ['lake'], reservoir: ['lake'], lago: ['lake'], lac: ['lake'], lagoa: ['lake'], laguna: ['lake'], etang: ['lake'],
    river: ['river'], rio: ['river'], fiume: ['river'], fleuve: ['river'], fluss: ['river'], riviere: ['river'], rivier: ['river'],
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
   * How a namesake reads when it has to be told apart: "Syracuse (Sicily)".
   * The name itself stays bare (letter rules, the loose index and the typed
   * bare form all see "Syracuse"); the qualifier is what the summary, the
   * review and a refusal show, and what the player may type to be exact.
   */
  const displayName = (entry) => (entry.qualifier ? `${entry.name} (${entry.qualifier})` : entry.name);

  // The postal codes of the US states, so a state-qualified namesake is exact
  // under "Portland OR" and "Portland, ME" too. Nothing else is abbreviated.
  const US_STATE_CODES = {
    alabama: 'al', alaska: 'ak', arizona: 'az', arkansas: 'ar', california: 'ca', colorado: 'co', connecticut: 'ct',
    delaware: 'de', florida: 'fl', georgia: 'ga', hawaii: 'hi', idaho: 'id', illinois: 'il', indiana: 'in', iowa: 'ia',
    kansas: 'ks', kentucky: 'ky', louisiana: 'la', maine: 'me', maryland: 'md', massachusetts: 'ma', michigan: 'mi',
    minnesota: 'mn', mississippi: 'ms', missouri: 'mo', montana: 'mt', nebraska: 'ne', nevada: 'nv', 'new hampshire': 'nh',
    'new jersey': 'nj', 'new mexico': 'nm', 'new york': 'ny', 'north carolina': 'nc', 'north dakota': 'nd', ohio: 'oh',
    oklahoma: 'ok', oregon: 'or', pennsylvania: 'pa', 'rhode island': 'ri', 'south carolina': 'sc', 'south dakota': 'sd',
    tennessee: 'tn', texas: 'tx', utah: 'ut', vermont: 'vt', virginia: 'va', washington: 'wa', 'west virginia': 'wv',
    wisconsin: 'wi', wyoming: 'wy',
    // ...and the Canadian provinces and territories (the Mexico and Canada
    // wave, 2026-09-18): without them "Clearwater BC" was an unknown string
    // that the fuzzy pass "corrected" to Clearwater (Idaho), the most-viewed
    // holder - the one river the player was ruling out. "Labrador" is NL too.
    alberta: 'ab', 'british columbia': 'bc', manitoba: 'mb', 'new brunswick': 'nb', 'newfoundland and labrador': 'nl',
    newfoundland: 'nl', labrador: 'nl', 'nova scotia': 'ns', 'northwest territories': 'nt', nunavut: 'nu', ontario: 'on',
    'prince edward island': 'pe', quebec: 'qc', saskatchewan: 'sk', yukon: 'yt'
  };
  /**
   * The exact typed forms of a qualified name, normalized: "syracuse sicily"
   * (which "Syracuse, Sicily" and "Syracuse (Sicily)" normalize to as well)
   * and, for a US state or a Canadian province, "portland or" / "thames on".
   */
  function qualifiedKeys(name, qualifier) {
    const q = normalize(qualifier);
    const n = normalize(name);
    if (!q || !n) return [];
    const keys = [`${n} ${q}`];
    if (US_STATE_CODES[q]) keys.push(`${n} ${US_STATE_CODES[q]}`);
    return keys;
  }

  /** The ids a lookup holds under a key: one for most names, several for namesakes (most-viewed first). */
  const idsAt = (lookup, key) => { const held = lookup.get(key); return held === undefined ? [] : Array.isArray(held) ? held : [held]; };
  /** Every id in a lookup, once. */
  function entryIds(lookup) {
    const ids = new Set();
    for (const held of lookup.values()) for (const id of Array.isArray(held) ? held : [held]) ids.add(id);
    return ids;
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
   *
   * A key held by several entries maps to a LIST of ids, most-viewed first:
   * the namesakes (decision 5, 2026-09-18) - "Syracuse" is Syracuse (New
   * York) and Syracuse (Sicily), each with a `qualifier`. A lookup built over
   * a prompt's subset holds only the ones in scope, so a bare "Syracuse" on
   * a Europe round is the Sicilian one and nothing else; on a plain round
   * the first (most-viewed) one that is not used yet answers. Each qualified
   * entry also gets its exact qualified keys ("syracuse sicily"), recorded in
   * `lookup.bareOf` so a hit through one reports the bare name as `matched`.
   * @param {{id:string,name:string,aliases?:string[],qualifier?:string,magnitude?:number}[]} entries
   * @param {{category?:string}} [options]  the cohort's category, so the loose
   *   and fuzzy passes know which generic words are its own (WORD_CATEGORY);
   *   without it every generic word is optional, as before
   */
  function buildLookup(entries, options) {
    const lookup = new Map();
    lookup.category = (options && options.category) || null;
    lookup.bareOf = new Map(); // a qualified key -> the bare name's key
    const candidates = [];
    const claims = new Map(); // bare -> [{ id, fromName, key }]
    const views = new Map(); // id -> magnitude, to put the famous namesake first

    const claim = (key, id) => {
      const held = lookup.get(key);
      if (held === undefined) lookup.set(key, id);
      else if (held !== id && !(Array.isArray(held) && held.includes(id))) lookup.set(key, [].concat(held, id));
    };
    for (const entry of entries) {
      views.set(entry.id, entry.magnitude || 0);
      [entry.name, ...(entry.aliases || [])].forEach((candidate, i) => {
        const key = normalize(candidate);
        if (!key) return;
        claim(key, entry.id);
        const bare = looseKey(candidate);
        // The fuzzy pass compares the filler-stripped forms too (see nearest).
        candidates.push({ key, bare: bare || key, filler: fillerIn(key), id: entry.id });

        if (!bare || bare === key) return;
        if (!claims.has(bare)) claims.set(bare, []);
        claims.get(bare).push({ id: entry.id, fromName: i === 0, key });
      });
      if (entry.qualifier) {
        // Exact forms only, never fuzzy candidates: a long qualified key
        // buys a long edit budget that corrects the NAME away ("Barren
        // Island, New York" became Green Island (New York)), and a postal
        // code is within budget of any other two letters ("Cambridge, UK"
        // was Cambridge (Massachusetts); the 2026-09-18 data audit).
        const nameKey = normalize(entry.name);
        for (const key of qualifiedKeys(entry.name, entry.qualifier)) {
          if (key === nameKey) continue;
          claim(key, entry.id);
          lookup.bareOf.set(key, nameKey);
        }
      }
    }

    const byViews = (a, b) => views.get(b) - views.get(a);
    for (const [key, held] of lookup) if (Array.isArray(held)) lookup.set(key, held.slice().sort(byViews));
    lookup.loose = resolveLoose(claims, views);
    for (const [bare, held] of lookup.loose) if (Array.isArray(held)) lookup.loose.set(bare, held.slice().sort(byViews));
    lookup.candidates = candidates;
    return lookup;
  }

  /**
   * Which entries a bare loose form identifies. A form that comes from an
   * entry's NAME beats the same form from another entry's alias: "Arabian"
   * is the Arabian Sea even though the Persian Gulf is also called the
   * Arabian Gulf. Several names that share a form identify the list of them
   * (decision 5, 2026-09-18): the namesakes "Black Lake" x3, and also Lake
   * Geneva beside Geneva Lake, Mount Wilson beside Wilson Peak - the caller
   * picks by scope, the most-viewed first, exactly as for a shared exact
   * key. (Until then two names identified neither, and the fold refused the
   * second one: ~180 real places were out for it.) Two aliases with no name
   * behind either identify the list too, but the validator refuses that
   * kind of data. With `views` (id -> magnitude) a far more famous
   * alias-holder joins the list (LOOSE_ALIAS_FAME_RATIO).
   * @param {Map<string, {id:string, fromName:boolean}[]>} claims
   * @param {Map<string, number>} [views]
   */
  // An alias-holder this much more viewed than every name-holder of a loose
  // form leads the list after all: "Cook" is Aoraki (alias "Mount Cook",
  // 8,900 views) before Mount Cook (Canada) (150), "San Antonio" is Mount
  // Baldy (alias "Mount San Antonio") before San Antonio Mountain - the
  // namesake folds of 2026-09-18 had put a 150-view name ahead of a famous
  // alias seven times (the regression audit). The Persian Gulf's "Arabian
  // Gulf" (1.6x the Arabian Sea) still does not take "Arabian".
  const LOOSE_ALIAS_FAME_RATIO = 3;
  function resolveLoose(claims, views) {
    const loose = new Map();
    for (const [bare, list] of claims) {
      const names = list.filter((c) => c.fromName);
      let pool = names.length ? names : list;
      if (names.length && views) {
        const top = Math.max(...names.map((c) => views.get(c.id) || 0));
        const famous = list.filter((c) => !c.fromName && (views.get(c.id) || 0) >= LOOSE_ALIAS_FAME_RATIO * top);
        if (famous.length) pool = names.concat(famous);
      }
      const ids = [...new Set(pool.map((c) => c.id))];
      loose.set(bare, ids.length === 1 ? ids[0] : ids);
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
      } else if (score === bestScore && !winners.some((w) => w.id === candidate.id || w.key === candidate.key)) {
        // (the same spelling from two namesakes is one candidate: a typo of
        // "Syracuse" lands on that name, and the scope pick follows)
        winners.push(candidate);
      }
    }

    if (plural) return null;
    // Two different places equally close is not a typo, it's a coin flip -
    // reported as such, so the caller knows something WAS close.
    if (winners.length > 1) return { tie: true };
    if (winners.length !== 1) return null;
    return { ids: idsAt(lookup, winners[0].key), key: winners[0].key, distance: bestScore >> 1 };
  }

  /**
   * @param {{fuzzy?:boolean, loose?:boolean, bare?:boolean}} [options]  pass `false` to skip that pass (`bare`: the fuzzy pass's stripped-form comparison)
   * @returns {{status:'accepted',entryId:string,matched:string,qualified?:true}
   *          |{status:'corrected',entryId:string,typed:string,matched:string,qualified?:true}
   *          |{status:'duplicate',entryId:string}
   *          |{status:'unrecognized'}}
   *   `matched` is the normalized spelling that landed: what was typed for an
   *   exact or loose hit, the corrected candidate for a fuzzy one - and the
   *   bare name when the hit came through a qualified form ("Paris, Texas"
   *   matched "paris", `qualified: true`), since the qualifier is not part of
   *   the name a length rule measures. A key several namesakes hold settles
   *   on the first (most-viewed) one not used yet; when every one is used it
   *   is a duplicate.
   */
  function matchAnswer(rawInput, lookup, usedAnswers, options) {
    const key = normalize(rawInput);
    if (!key) return { status: 'unrecognized' };

    const settle = (held, status, extra) => {
      const ids = Array.isArray(held) ? held : [held];
      const entryId = usedAnswers ? ids.find((id) => !usedAnswers.has(id)) : ids[0];
      if (!entryId) return { status: 'duplicate', entryId: ids[0] };
      return Object.assign({ status, entryId }, extra);
    };
    const landed = (matchedKey) => {
      const bare = lookup.bareOf && lookup.bareOf.get(matchedKey);
      return bare ? { matched: bare, qualified: true } : { matched: matchedKey };
    };

    const exact = lookup.get(key);
    if (exact) return settle(exact, 'accepted', landed(key));

    // A generic word of ANOTHER category is not filler here: "Lake Michigan"
    // on a river round names a lake, and dropping "lake" to find Michigan
    // River would score the wrong place. Only the whole string is compared
    // from here on (run.js then finds the lake and says so).
    const foreign = foreignWordIn(key, lookup.category);

    // Filler is optional in both directions: "Everest" finds "Mount Everest"
    // through the loose index, and "Mount Denali" finds "Denali" by dropping
    // the filler the player added and trying the exact names again.
    // An entry whose exact NAME is the typing minus the filler comes before
    // a loose holder of that form: "George River" is the river called George,
    // not St. George's (whose loose "george" drops a word the player never
    // typed); "Smoky River" is Smoky, not Smoky Hill (the 2026-09-18 rivers
    // audit found eight such shadows). Without such an entry the loose form
    // resolves as before.
    if ((!options || options.loose !== false) && !foreign) {
      const bare = looseKey(key);
      // ...the cohort's own words only: "St. George River" still names St.
      // George, the "St" being the player's
      const own = lookup.category
        ? key.split(' ').filter((w) => !(WORD_CATEGORY[w] && WORD_CATEGORY[w].includes(lookup.category))).join(' ')
        : bare;
      const loose =
        (lookup.loose && lookup.loose.get(key)) ||
        (own && own !== key && lookup.get(own)) ||
        (lookup.loose && lookup.loose.get(bare)) ||
        (bare && bare !== key && lookup.get(bare));
      if (loose) return settle(loose, 'accepted', { matched: key });
    }

    if (!options || options.fuzzy !== false) {
      const near = nearest(key, lookup, foreign ? Object.assign({}, options, { bare: false }) : options);
      if (near && near.tie) return { status: 'unrecognized', tie: true };
      if (near) return settle(near.ids, 'corrected', Object.assign({ typed: rawInput.trim() }, landed(near.key)));
    }

    return { status: 'unrecognized' };
  }

  return { normalize, looseKey, editDistance, slackFor, buildLookup, resolveLoose, matchAnswer, FILLER, WORD_CATEGORY, foreignWordIn, displayName, qualifiedKeys, idsAt, entryIds, US_STATE_CODES };
});
