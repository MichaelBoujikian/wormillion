/**
 * Run + round state machine (Spec 3.4, 3.5, 5.2, 5.3). No DOM, no timers:
 * the UI owns the clock and calls timeout() when it expires.
 *
 * Terminal states for a round are exactly two: an accepted answer, or a
 * timeout. Unrecognized, wrong-region and duplicate answers are free retries -
 * they neither advance the round nor cost anything.
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Wormillion = root.Wormillion || {}).run = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const isNode = typeof module === 'object' && module.exports;
  const rarity = isNode ? require('./rarity.js') : root.Wormillion.rarity;
  const matching = isNode ? require('./matching.js') : root.Wormillion.matching;
  const strata = isNode ? require('./strata.js') : root.Wormillion.strata;
  const seed = isNode ? require('./seed.js') : root.Wormillion.seed;

  // The two ways to play (Spec 3.15). They differ in ONE thing: where the
  // slot draw's randomness comes from. A daily run is seeded from the
  // calendar date so everyone digs the same fifteen prompts that day; an
  // endless run draws fresh every time and can be played all day.
  const MODES = ['daily', 'endless'];

  // A bare name whose most famous holder lives in ANOTHER cohort by this
  // margin keeps today's nudge: "Athens" on a city round is "Athens is a
  // capital city", not 950 points for Athens (Georgia), and the Georgia one
  // wants its qualifier ("Athens, Georgia" / "Athens GA"). Measured on
  // `magnitude` (monthly views) between the name's most-viewed holder in
  // THIS cohort and its most-viewed exact holder elsewhere (decision 5,
  // 2026-09-18; 3, not 5: Athens the capital has 4.8x the views of the
  // Georgia one). The cohort's own best holder, not the entry the typing
  // settled on: a second "Boston" in a run settles on Boston (Lincolnshire),
  // and the capital Boston is the very place the first "Boston" scored, so
  // the name belongs here and the second is the Lincolnshire one (the
  // 2026-09-18 gameplay audit). Only a city is second-guessed this way,
  // against a capital, a country or an island (Athens, Greece (New York),
  // Manhattan (Kansas)): those are what a player who types the bare name on
  // a city round may have meant, but "Saint Paul" on a river round names
  // the river, however famous the capital - the round's category settles
  // that on its own. The one round the famous holder cannot have been
  // meant on is a region round whose region it does not carry: "Boston" on
  // "Name a city in Europe" is Boston (Lincolnshire), accepted - that is the
  // point of the design - not "Boston is a capital city"; on a letter, size,
  // flag or theme round the famous name fits as well as the namesake does,
  // and the nudge stands (the same audit: "Athens" on "starts with A" had
  // become 950 points for Georgia).
  const NAMESAKE_FAME_RATIO = 3;
  const CONFUSABLE = { city: ['capital', 'country', 'island'] };

  /**
   * @param {object} bank        from promptBank.createBank()
   * @param {object} [opts]      { mode, dailyKey, rounds, rng }
   *   mode      'daily' | 'endless' (default)
   *   dailyKey  the daily's YYYY-MM-DD; defaults to today, local time
   *   rng       overrides the draw's randomness (tests); ignored for a daily
   */
  function createRun(bank, opts = {}) {
    const mode = opts.mode || 'endless';
    if (!MODES.includes(mode)) throw new Error(`createRun: unknown mode "${mode}"`);
    const dailyKey = mode === 'daily' ? opts.dailyKey || seed.dailyKey() : null;
    const rng = mode === 'daily' ? seed.dailyRng(dailyKey) : opts.rng || Math.random;
    const slots = bank.drawSlots(rng).slice(0, opts.rounds || rarity.ROUNDS_PER_RUN);

    const state = {
      mode,
      dailyKey,
      slots,
      index: 0,
      score: 0,
      depth: 0,
      usedAnswers: new Set(),
      results: [],
      finished: false
    };

    const prompt = () => (state.finished ? null : bank.promptFor(slots[state.index]));

    function recordAndAdvance(result) {
      state.results.push(result);
      state.score += result.points;
      state.depth += result.dig;
      state.index += 1;
      if (state.index >= slots.length) state.finished = true;
      return result;
    }

    /**
     * @returns {{status:'accepted'|'duplicate'|'unrecognized'|'wrong-scope', ...}}
     *   'accepted' carries `correctedFrom` when a near-miss spelling was fixed;
     *   'unrecognized' carries `elsewhere: {entry, category}` when the answer is
     *   a real place from a different category (Estonia on a capitals round).
     */
    /** The entry's name or alias that normalizes to `key`, for showing a corrected spelling back. */
    function spellingOf(entry, key) {
      return [entry.name, ...(entry.aliases || [])].find((s) => matching.normalize(s) === key) || entry.name;
    }

    /**
     * The most-viewed entry in any other cohort whose exact name is this
     * entry's bare name, when it is famous enough to be what the player
     * meant (NAMESAKE_FAME_RATIO); null otherwise. Only a qualified entry
     * (one that shares its name) is ever second-guessed, and only when it
     * was reached by the bare name: "Athens, Georgia" is exactly that, and
     * so is an alias of its own ("Novomoskovsk" is Samar (Ukraine) and
     * nothing else; "Rodos" is the island's name as much as the city's, so
     * the typing itself is what the other cohorts are asked about).
     */
    function famousElsewhere(entry, match, current) {
      if (!entry.qualifier || (match && match.qualified)) return null;
      const key = matching.normalize(entry.name);
      const top = Math.max(...matching.idsAt(current.cohort.lookup, key).map((id) => current.cohort.byId.get(id).magnitude));
      const typed = (match && match.matched) || entry.name;
      let best = null;
      for (const other of CONFUSABLE[entry.category] || []) {
        const cohort = bank.cohorts.get(other);
        const hit = matching.matchAnswer(typed, cohort.lookup, null, { loose: false, fuzzy: false });
        if (hit.status !== 'accepted') continue;
        const found = cohort.byId.get(hit.entryId);
        if (!best || found.magnitude > best.magnitude) best = found;
      }
      if (!best || best.magnitude < NAMESAKE_FAME_RATIO * top) return null;
      if (current.region && !(best.region || []).includes(current.region)) return null;
      return { status: 'unrecognized', elsewhere: { entry: best, category: best.category, fuzzy: false } };
    }

    /** The out-of-scope result for a real place in this category that doesn't fit the prompt. */
    function wrongScope(current, entryId) {
      return {
        status: 'wrong-scope',
        entry: current.cohort.byId.get(entryId),
        scopeName: current.scopeName,
        prompt: current.text
      };
    }

    /**
     * A real place from a different category, if the input names one. Exact
     * and loose hits only when `exactOnly` - a fuzzy near-miss in another
     * category is not evidence of anything. An exact name in any category
     * beats a loose one in any other, whatever order the cohorts come in:
     * "Lake Victoria" is the lake, not the capital of the Seychelles. The
     * fuzzy pass here compares whole names only (`bare: false`): "Nigera"
     * on a country round is a refused tie between Nigeria and Niger, not
     * "Niger River is a river".
     */
    function elsewhere(rawInput, category, exactOnly) {
      // Three passes, each over every other cohort before the next begins:
      // exact, then loose, then fuzzy - so a loose hit anywhere ("Cornwallis"
      // is Cornwallis Island) beats a fuzzy one in an earlier cohort
      // (Corvallis, a city, two edits away; the 2026-09-17 pre-merge audit).
      const passes = [{ loose: false, fuzzy: false }, { fuzzy: false, bare: false }];
      if (!exactOnly) passes.push({ fuzzy: true, bare: false });
      for (const options of passes) {
        // An exact name held in two other cohorts names the famous one:
        // "Etna" on a lake round is Mount Etna (42,000 views), not the
        // Norwegian river Etna (30) that happens to come first in the
        // cohort order (2026-09-16 audit). The loose/fuzzy pass keeps the
        // first hit, as before.
        let best = null;
        for (const [other, cohort] of bank.cohorts) {
          if (other === category) continue;
          const hit = matching.matchAnswer(rawInput, cohort.lookup, null, options);
          if (hit.status !== 'accepted' && hit.status !== 'corrected') continue;
          const found = { entry: cohort.byId.get(hit.entryId), category: other, fuzzy: hit.status === 'corrected', qualified: Boolean(hit.qualified) };
          if (options.loose === false) {
            if (!best || found.entry.magnitude > best.entry.magnitude) best = found;
          } else return found;
        }
        if (best) return best;
      }
      return null;
    }

    /** Two entries (of any category) that carry the same name: Madagascar the island and Madagascar the country. */
    const sameName = (a, b) => Boolean(a && b) && matching.normalize(a.name) === matching.normalize(b.name);

    function submit(rawInput) {
      if (state.finished) return { status: 'unrecognized' };
      const current = prompt();
      let match = matching.matchAnswer(rawInput, current.lookup, state.usedAnswers);
      // A refused tie in this cohort ("Nille": Nile or Bille?) is a typo of
      // something here, not evidence of a place elsewhere: only an exact or
      // loose name in another cohort may nudge, never a fuzzy one ("Lille is
      // a city" was the wrong answer to a misspelt Nile; 2026-09-16 audit).
      let tie = Boolean(match.tie);

      // An exact name beats a spelling correction. On a narrowed prompt the
      // subset lookup can't see the rest of the category, so without this
      // "Australia" on a Europe round would be "corrected" to Austria and
      // scored; it is Australia, and Australia is out of scope.
      if (match.status === 'corrected') {
        const exact = matching.matchAnswer(rawInput, current.cohort.lookup, null, { fuzzy: false });
        if (exact.status === 'accepted' && exact.entryId !== match.entryId) {
          // ("Dublin" on a Europe round is a typo of Lublin here, Dublin
          // (California) in the whole cohort, and the capital's nudge first)
          return famousElsewhere(current.cohort.byId.get(exact.entryId), exact, current) || wrongScope(current, exact.entryId);
        }
        const named = elsewhere(rawInput, current.category, true);
        // ...unless the place named elsewhere IS the corrected one under the
        // same name: "Solomon Island" on a country round is a typo for the
        // Solomon Islands, and the island cohort's Solomon Islands is no
        // reason to refuse it (2026-09-16 audit).
        if (named && !sameName(named.entry, current.cohort.byId.get(match.entryId))) return { status: 'unrecognized', elsewhere: named };
      }

      // An exact name beats a LOOSE hit on a narrowed prompt too: the subset
      // cannot see the rest of the cohort, so "Isla Espiritu Santo" (81 km2)
      // on "bigger than 100 km2" was Espiritu Santo (Vanuatu) through the
      // loose form; it is the Mexican island, out of scope (the 2026-09-18
      // islands audit).
      if (match.status === 'accepted' && current.constrained) {
        const exactHere = matching.matchAnswer(rawInput, current.lookup, null, { loose: false, fuzzy: false });
        if (exactHere.status !== 'accepted' && exactHere.status !== 'duplicate') {
          const exact = matching.matchAnswer(rawInput, current.cohort.lookup, null, { loose: false, fuzzy: false });
          if (exact.status === 'accepted' && exact.entryId !== match.entryId) {
            return famousElsewhere(current.cohort.byId.get(exact.entryId), exact, current) || wrongScope(current, exact.entryId);
          }
        }
      }

      if (match.status === 'unrecognized') {
        // A real place that just doesn't fit this prompt is a different mistake
        // from a place we've never heard of, and deserves a different hint.
        if (current.constrained) {
          const wide = matching.matchAnswer(rawInput, current.cohort.lookup, null);
          if (wide.status === 'accepted' || wide.status === 'corrected') {
            // "Athens" on "Name a city in Europe" is not "Athens (Georgia)
            // isn't in Europe" - it is the capital, and the nudge says so
            return famousElsewhere(current.cohort.byId.get(wide.entryId), wide, current) || wrongScope(current, wide.entryId);
          }
          tie = tie || Boolean(wide.tie);
        }
        // A real place from another category deserves a nudge, not a shrug:
        // "Estonia is a country - this round wants a capital city."
        const named = elsewhere(rawInput, current.category, tie);
        if (!named) return { status: 'unrecognized' };
        // ...but when that place's name is also a name in THIS cohort, the
        // player has named this cohort's entry the long way round:
        // "Madagascar Island" on a country round is Madagascar the country,
        // "Singapore City" is Singapore (2026-09-16 audit). Shown as a
        // correction, so the summary reads "Madagascar Island -> Madagascar".
        // (Exact and loose hits only: a refused in-category tie must not come
        // back through a fuzzy hit next door - "Nigera" stays refused. And
        // "River Barrow" on a mountain round names the river, not the fell
        // Barrow: between two physical cohorts the typed generic word settles
        // which one the player meant; 2026-09-17 audit. And a QUALIFIED
        // typing names that one place: "Athens, Georgia" on a capital round
        // is the Georgia city's nudge, not the capital Athens scored as a
        // correction; the 2026-09-18 gameplay audit.)
        const PHYSICAL = ['river', 'lake', 'mountain', 'desert', 'sea_ocean'];
        const namesTheirKind = PHYSICAL.includes(named.category) && PHYSICAL.includes(current.category) &&
          matching.normalize(rawInput).split(' ').some((w) => (matching.WORD_CATEGORY[w] || []).includes(named.category));
        const twin = named.fuzzy || named.qualified || namesTheirKind ? { status: 'unrecognized' } : matching.matchAnswer(named.entry.name, current.lookup, state.usedAnswers, { loose: false, fuzzy: false });
        if (twin.status === 'accepted') match = { status: 'corrected', entryId: twin.entryId, typed: rawInput.trim(), matched: twin.matched };
        else if (twin.status === 'duplicate') match = twin;
        else {
          if (current.constrained) {
            const wideTwin = matching.matchAnswer(named.entry.name, current.cohort.lookup, null, { loose: false, fuzzy: false });
            if (wideTwin.status === 'accepted') return wrongScope(current, wideTwin.entryId);
          }
          return { status: 'unrecognized', elsewhere: named };
        }
      }

      const entry = current.cohort.byId.get(match.entryId);
      if (match.status === 'duplicate') return { status: 'duplicate', entry };
      const famous = famousElsewhere(entry, match, current);
      if (famous) return famous;

      // A length prompt is about the spelling you used: "China" is five
      // letters even though the entry also answers to a 22-letter name.
      if (current.judgeTyped) {
        const miss = current.judgeTyped(match.matched);
        if (miss) {
          return {
            ...wrongScope(current, entry.id),
            // (typed through a qualifier, the name is what was measured)
            length: { typed: match.status === 'corrected' || match.qualified ? spellingOf(entry, match.matched) : rawInput.trim(), ...miss }
          };
        }
      }

      state.usedAnswers.add(entry.id);
      // Rarity always against the GLOBAL cohort, never the narrowed subset (3.2).
      const scored = rarity.scoreEntry(entry, current.cohort.stats);
      return recordAndAdvance({
        status: 'accepted',
        round: state.index + 1,
        prompt: current.text,
        category: current.category,
        entry,
        // A namesake is stored with its qualifier, "Syracuse (Sicily)": what
        // the summary shows, and an exact form the daily replay lands on
        answer: matching.displayName(entry),
        correctedFrom: match.status === 'corrected' ? match.typed : null,
        rarity: scored.rarity,
        points: scored.points,
        dig: scored.dig,
        depthBefore: state.depth,
        depthAfter: state.depth + scored.dig
      });
    }

    /** No accepted answer in the window: 0 points, 0 depth, advance (5.1). */
    function timeout() {
      if (state.finished) return null;
      const current = prompt();
      return recordAndAdvance({
        status: 'timeout',
        round: state.index + 1,
        prompt: current.text,
        category: current.category,
        entry: null,
        answer: null,
        rarity: 0,
        points: 0,
        dig: 0,
        depthBefore: state.depth,
        depthAfter: state.depth
      });
    }

    /** This run, round by round, with the rarest possible answer to each prompt (3.16). */
    function review() {
      return reviewRun(bank, slots, state.results.map(asRound));
    }

    /** Final numbers for the summary screen and history (Spec 5.2, 9). */
    function summary() {
      return {
        mode: state.mode,
        dailyKey: state.dailyKey,
        score: state.score,
        finalDepth: state.depth,
        // v1 uses FINAL depth, not max depth (Spec 5.2).
        deepestStratum: strata.stratumName(state.depth),
        rounds: state.results.slice(),
        ladder: rankByRarity(state.results),
        date: new Date().toISOString()
      };
    }

    return {
      state,
      get mode() {
        return state.mode;
      },
      get dailyKey() {
        return state.dailyKey;
      },
      get roundNumber() {
        return Math.min(state.index + 1, slots.length);
      },
      get totalRounds() {
        return slots.length;
      },
      get score() {
        return state.score;
      },
      get depth() {
        return state.depth;
      },
      get finished() {
        return state.finished;
      },
      prompt,
      submit,
      timeout,
      summary,
      review
    };
  }

  /** A round result (or a stored round) as the compact { a, r } | null shape. */
  function asRound(result) {
    if (!result || typeof result !== 'object') return null;
    if ('a' in result) return typeof result.r === 'number' ? { a: result.a, r: result.r } : null;
    return result.status === 'accepted' ? { a: result.answer, r: result.rarity } : null;
  }

  // Stored rarities are rounded to four places (persistence.toRecord), so
  // "as obscure as the rarest" is judged at that resolution on both sides.
  const at4 = (r) => Math.round(r * 10000);

  /**
   * The spelling of an entry to show as an answer to this prompt: its name,
   * unless a length prompt would reject the name as typed and accept an
   * alias ("Mount Kilimanjaro" is the long spelling of Kilimanjaro).
   */
  function spellingFor(entry, prompt) {
    if (!prompt.judgeTyped) return matching.displayName(entry);
    for (const spelling of [entry.name, ...(entry.aliases || [])]) {
      if (!prompt.judgeTyped(matching.normalize(spelling))) return spelling === entry.name ? matching.displayName(entry) : spelling;
    }
    return matching.displayName(entry);
  }

  /**
   * The most obscure entry a prompt accepts - the reveal on the review screen.
   * Rarity is against the whole category, like scoring (3.2); the first of a
   * tie wins, which only matters when two entries share the cohort minimum.
   */
  function rarestFor(prompt) {
    let best = null;
    for (const id of matching.entryIds(prompt.lookup)) {
      const entry = prompt.cohort.byId.get(id);
      const r = rarity.rarityOf(entry.magnitude, prompt.cohort.stats);
      if (!best || r > best.rarity) best = { name: spellingFor(entry, prompt), rarity: r, views: entry.magnitude };
    }
    return best;
  }

  /** The fingerprint of a slot list's prompt texts - what a daily's record stores as `draw`. */
  function drawId(bank, slots) {
    return seed.fingerprint(slots.map((slot) => bank.promptFor(slot).text));
  }

  /**
   * Round-by-round review of a run: each prompt, what the player answered
   * (null for a miss), and the rarest answer that would have been accepted.
   * Works for the live run and for a stored daily, whose slots are
   * regenerated from its key and whose rounds come from the record.
   *
   * @param {object} bank
   * @param {object[]} slots      the run's slots, in round order
   * @param {({a:string,r:number}|null)[]} rounds  the player's answers, in round order
   */
  function reviewRun(bank, slots, rounds) {
    return slots.map((slot, i) => {
      const prompt = bank.promptFor(slot);
      const answer = asRound(rounds ? rounds[i] : null);
      const rarest = rarestFor(prompt);
      return {
        round: i + 1,
        prompt: prompt.text,
        category: prompt.category,
        label: prompt.label,
        answer,
        rarest,
        // "You found the rarest" when the player's answer is as obscure as it gets.
        foundRarest: Boolean(answer && rarest && at4(answer.r) >= at4(rarest.rarity))
      };
    });
  }

  /**
   * The run's answers from least to most obscure, so the summary reads as a
   * climb: misses sit at the top (they dug nothing), ties keep round order,
   * and the rarest thing the player knew is the last line.
   */
  function rankByRarity(results) {
    return results
      .map((result, index) => ({ result, index }))
      .sort((a, b) => (a.result.rarity || 0) - (b.result.rarity || 0) || a.index - b.index)
      .map(({ result }) => result);
  }

  return { MODES, NAMESAKE_FAME_RATIO, createRun, rankByRarity, rarestFor, reviewRun, drawId };
});
