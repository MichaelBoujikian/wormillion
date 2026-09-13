/**
 * localStorage: best dive + run history (Spec 9). Best-effort by design - a
 * corrupt or missing key reads as "no history yet", never as a crash.
 *
 * bestDive is always recomputed from history, so there is one source of truth.
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Wormillion = root.Wormillion || {}).persistence = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const isNode = typeof module === 'object' && module.exports;
  const seed = isNode ? require('./seed.js') : root.Wormillion.seed;

  const KEY = 'wormillion:v1';
  // The cap is on ENDLESS runs. A daily is kept for good: streaks, the daily
  // stats and reviewing a past day all need every daily ever played, and a
  // year of them is ~200 KB against a 5 MB quota.
  const HISTORY_CAP = 50;
  const isDaily = (r) => r.mode === 'daily' && typeof r.dailyKey === 'string';

  const EMPTY = { bestDive: null, history: [] };

  function storage(store) {
    if (store) return store;
    try {
      return root.localStorage || null;
    } catch {
      return null; // privacy modes can throw on access alone
    }
  }

  function read(store) {
    const s = storage(store);
    if (!s) return { ...EMPTY };
    try {
      const parsed = JSON.parse(s.getItem(KEY) || 'null');
      if (!parsed || !Array.isArray(parsed.history)) return { ...EMPTY };
      const history = parsed.history.filter(
        (r) => r && Number.isFinite(r.score) && Number.isFinite(r.finalDepth)
      );
      return { history, bestDive: bestOf(history) };
    } catch {
      return { ...EMPTY };
    }
  }

  function write(data, store) {
    const s = storage(store);
    if (!s) return false;
    try {
      s.setItem(KEY, JSON.stringify(data));
      return true;
    } catch {
      return false; // quota or blocked storage: the game plays on regardless
    }
  }

  function bestOf(history) {
    if (!history || history.length === 0) return null;
    return history.reduce((best, run) => (run.score > best.score ? run : best));
  }

  /**
   * Trim a run summary down to the stored shape. A daily carries its key
   * (3.15) so the title screen can tell "you already dug today" and a
   * leaderboard can line players up by day; an endless run carries nothing
   * extra, and a record from before modes existed reads as endless.
   *
   * `rounds` is one item per round in ROUND order - the answer's name and its
   * rarity, or null for a miss - which is what the share grid, the average
   * obscurity and a review of a past daily need. The prompts themselves are
   * not stored: a daily's are regenerated from its key.
   */
  function toRecord(summary) {
    const record = {
      score: summary.score,
      deepestStratum: summary.deepestStratum,
      finalDepth: Math.round(summary.finalDepth * 10) / 10,
      date: summary.date || new Date().toISOString()
    };
    if (summary.mode === 'daily' && summary.dailyKey) {
      record.mode = 'daily';
      record.dailyKey = summary.dailyKey;
    }
    if (Array.isArray(summary.rounds)) {
      record.rounds = summary.rounds.map((r) =>
        r && r.status === 'accepted' ? { a: r.answer, r: Math.round(r.rarity * 10000) / 10000 } : null
      );
      // A daily's prompts are regenerated from its key for a review; the
      // fingerprint of their texts lets the review notice if the draw has
      // changed since (a reorder of the bank, a change to drawSlots).
      if (record.mode === 'daily') record.draw = seed.fingerprint(summary.rounds.map((r) => (r && r.prompt) || ''));
    }
    return record;
  }

  /** Keep every daily; keep only the newest HISTORY_CAP endless runs. */
  function trim(history) {
    let endless = history.filter((r) => !isDaily(r)).length;
    return history.filter((r) => {
      if (isDaily(r)) return true;
      if (endless <= HISTORY_CAP) return true;
      endless -= 1;
      return false;
    });
  }

  /**
   * Mean rarity across a record's rounds, a miss counting as 0 - "how obscure
   * were your answers on average". null for a record with no round data.
   */
  function averageRarity(record) {
    if (!record || !Array.isArray(record.rounds) || record.rounds.length === 0) return null;
    const total = record.rounds.reduce((sum, r) => sum + (r ? r.r : 0), 0);
    return total / record.rounds.length;
  }

  /** The stored daily for a YYYY-MM-DD key, or null if that day is unplayed. */
  function dailyResult(key, store) {
    if (!key) return null;
    const { history } = read(store);
    // Most recent last in history, so a late duplicate (shouldn't happen: the
    // UI locks the daily) wins over an earlier one.
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].mode === 'daily' && history[i].dailyKey === key) return history[i];
    }
    return null;
  }

  /**
   * Append a finished run.
   * @returns {{isBest:boolean, previousBest:object|null, bestDive:object, history:object[]}}
   */
  function recordRun(summary, store) {
    const record = toRecord(summary);
    const current = read(store);
    const previousBest = current.bestDive;
    const history = trim(current.history.concat([record]));
    const bestDive = bestOf(history);
    write({ bestDive, history }, store);
    return {
      isBest: !previousBest || record.score > previousBest.score,
      previousBest,
      bestDive,
      history
    };
  }

  /** Every daily played, oldest first, one per key (the last stored wins). */
  function dailies(store) {
    const byKey = new Map();
    for (const r of read(store).history) if (isDaily(r)) byKey.set(r.dailyKey, r);
    return [...byKey.values()].sort((a, b) => seed.daysBetween(b.dailyKey, a.dailyKey));
  }

  /**
   * The daily streak as of `today`: `current` is the run of consecutive days
   * ending today - or ending yesterday, if today isn't dug yet, because a
   * streak isn't broken until the day is actually missed; `best` is the
   * longest run ever.
   */
  function dailyStreak(today, store) {
    const keys = dailies(store).map((r) => r.dailyKey);
    let best = 0;
    let run = 0;
    let previous = null;
    for (const key of keys) {
      run = previous && seed.daysBetween(previous, key) === 1 ? run + 1 : 1;
      previous = key;
      if (run > best) best = run;
    }
    const last = keys[keys.length - 1];
    const gap = last ? seed.daysBetween(last, today) : Infinity;
    const current = gap === 0 || gap === 1 ? run : 0;
    return { current, best };
  }

  /** The numbers on the daily block of the stats screen (3.16). */
  function dailyStats(today, store) {
    const list = dailies(store);
    const streak = dailyStreak(today, store);
    const byStratum = {};
    let scoreSum = 0;
    let raritySum = 0;
    let rarityCount = 0;
    let best = null;
    for (const r of list) {
      scoreSum += r.score;
      byStratum[r.deepestStratum] = (byStratum[r.deepestStratum] || 0) + 1;
      const mean = averageRarity(r);
      if (mean !== null) {
        raritySum += mean;
        rarityCount += 1;
      }
      if (!best || r.score > best.score) best = r;
    }
    return {
      played: list.length,
      streak: streak.current,
      bestStreak: streak.best,
      averageScore: list.length ? Math.round(scoreSum / list.length) : 0,
      bestScore: best ? best.score : 0,
      averageRarity: rarityCount ? raritySum / rarityCount : null,
      byStratum,
      dailies: list
    };
  }

  /** Derived stats for the history screen - nothing extra is stored (Spec M7). */
  function stats(store) {
    const { history, bestDive } = read(store);
    if (history.length === 0) {
      return { runs: 0, averageScore: 0, bestScore: 0, deepestStratum: null, deepestDepth: 0, history: [] };
    }
    const total = history.reduce((sum, r) => sum + r.score, 0);
    const deepest = history.reduce((a, b) => (b.finalDepth > a.finalDepth ? b : a));
    return {
      runs: history.length,
      averageScore: Math.round(total / history.length),
      bestScore: bestDive ? bestDive.score : 0,
      deepestStratum: deepest.deepestStratum,
      deepestDepth: deepest.finalDepth,
      history
    };
  }

  return {
    KEY,
    HISTORY_CAP,
    read,
    write,
    bestOf,
    toRecord,
    trim,
    averageRarity,
    recordRun,
    dailyResult,
    dailies,
    dailyStreak,
    dailyStats,
    stats
  };
});
