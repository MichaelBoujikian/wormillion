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

  /**
   * @param {object} bank        from promptBank.createBank()
   * @param {object} [opts]      { rounds, rng }
   */
  function createRun(bank, opts = {}) {
    const rng = opts.rng || Math.random;
    const slots = bank.drawSlots(rng).slice(0, opts.rounds || rarity.ROUNDS_PER_RUN);

    const state = {
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
     * category is not evidence of anything.
     */
    function elsewhere(rawInput, category, exactOnly) {
      for (const [other, cohort] of bank.cohorts) {
        if (other === category) continue;
        const hit = matching.matchAnswer(rawInput, cohort.lookup, null, { fuzzy: !exactOnly });
        if (hit.status === 'accepted' || hit.status === 'corrected') {
          return { entry: cohort.byId.get(hit.entryId), category: other };
        }
      }
      return null;
    }

    function submit(rawInput) {
      if (state.finished) return { status: 'unrecognized' };
      const current = prompt();
      const match = matching.matchAnswer(rawInput, current.lookup, state.usedAnswers);

      // An exact name beats a spelling correction. On a narrowed prompt the
      // subset lookup can't see the rest of the category, so without this
      // "Australia" on a Europe round would be "corrected" to Austria and
      // scored; it is Australia, and Australia is out of scope.
      if (match.status === 'corrected') {
        const exact = matching.matchAnswer(rawInput, current.cohort.lookup, null, { fuzzy: false });
        if (exact.status === 'accepted' && exact.entryId !== match.entryId) return wrongScope(current, exact.entryId);
        const named = elsewhere(rawInput, current.category, true);
        if (named) return { status: 'unrecognized', elsewhere: named };
      }

      if (match.status === 'unrecognized') {
        // A real place that just doesn't fit this prompt is a different mistake
        // from a place we've never heard of, and deserves a different hint.
        if (current.constrained) {
          const wide = matching.matchAnswer(rawInput, current.cohort.lookup, null);
          if (wide.status === 'accepted' || wide.status === 'corrected') return wrongScope(current, wide.entryId);
        }
        // A real place from another category deserves a nudge, not a shrug:
        // "Estonia is a country - this round wants a capital city."
        const named = elsewhere(rawInput, current.category, false);
        if (named) return { status: 'unrecognized', elsewhere: named };
        return { status: 'unrecognized' };
      }

      const entry = current.cohort.byId.get(match.entryId);
      if (match.status === 'duplicate') return { status: 'duplicate', entry };

      // A length prompt is about the spelling you used: "China" is five
      // letters even though the entry also answers to a 22-letter name.
      if (current.judgeTyped) {
        const miss = current.judgeTyped(match.matched);
        if (miss) {
          return {
            ...wrongScope(current, entry.id),
            length: { typed: match.status === 'corrected' ? spellingOf(entry, match.matched) : rawInput.trim(), ...miss }
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
        answer: entry.name,
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

    /** Final numbers for the summary screen and history (Spec 5.2, 9). */
    function summary() {
      return {
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
      summary
    };
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

  return { createRun, rankByRarity };
});
