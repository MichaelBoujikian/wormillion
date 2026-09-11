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

  const KEY = 'wormillion:v1';
  const HISTORY_CAP = 50;

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

  /** Trim a run summary down to the stored shape. */
  function toRecord(summary) {
    return {
      score: summary.score,
      deepestStratum: summary.deepestStratum,
      finalDepth: Math.round(summary.finalDepth * 10) / 10,
      date: summary.date || new Date().toISOString()
    };
  }

  /**
   * Append a finished run.
   * @returns {{isBest:boolean, previousBest:object|null, bestDive:object, history:object[]}}
   */
  function recordRun(summary, store) {
    const record = toRecord(summary);
    const current = read(store);
    const previousBest = current.bestDive;
    const history = current.history.concat([record]).slice(-HISTORY_CAP);
    const bestDive = bestOf(history);
    write({ bestDive, history }, store);
    return {
      isBest: !previousBest || record.score > previousBest.score,
      previousBest,
      bestDive,
      history
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

  return { KEY, HISTORY_CAP, read, write, bestOf, toRecord, recordRun, stats };
});
