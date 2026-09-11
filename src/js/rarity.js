/**
 * Rarity, points and dig distance (Spec 5.1) + cumulative depth (Spec 5.2).
 * Pure functions; no DOM, no data loading.
 *
 * rarity is 1.0 for the smallest-magnitude entry in a cohort (most obscure) and
 * 0.0 for the largest (most famous), because in every category bigger magnitude
 * correlates with fame.
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Wormillion = root.Wormillion || {}).rarity = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const strata =
    typeof module === 'object' && module.exports
      ? require('./strata.js')
      : root.Wormillion.strata;

  // Spec 3.10 - tunable, but these are the shipped v1 values.
  const POINTS_MIN = 50;
  const POINTS_MAX = 1000;
  const POINTS_GAMMA = 1.4;
  const ROUNDS_PER_RUN = 15;
  const TOTAL_DEPTH_BUDGET = 700;
  const MAX_DIG_PER_ROUND = TOTAL_DEPTH_BUDGET / ROUNDS_PER_RUN;

  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

  /**
   * Log-space min/max for a cohort, computed once at load time.
   * @param {{magnitude:number}[]} cohort
   */
  function cohortStats(cohort) {
    if (!cohort || cohort.length === 0) throw new Error('cohortStats: empty cohort');
    let lmin = Infinity;
    let lmax = -Infinity;
    for (const entry of cohort) {
      const m = entry.magnitude;
      if (!(m > 0)) throw new Error(`cohortStats: magnitude must be > 0 (${entry.id || entry.name})`);
      const l = Math.log10(m);
      if (l < lmin) lmin = l;
      if (l > lmax) lmax = l;
    }
    return { lmin, lmax };
  }

  /** rarity of one magnitude within a cohort's stats. */
  function rarityOf(magnitude, stats) {
    const { lmin, lmax } = stats;
    if (lmax === lmin) return 1; // degenerate single-value cohort (Spec 5.1)
    return clamp((lmax - Math.log10(magnitude)) / (lmax - lmin), 0, 1);
  }

  /**
   * Rarity for every entry in a cohort.
   * @returns {Map<string, number>} entry id -> rarity
   */
  function computeRarity(cohort) {
    const stats = cohortStats(cohort);
    const out = new Map();
    for (const entry of cohort) out.set(entry.id, rarityOf(entry.magnitude, stats));
    return out;
  }

  /** Points awarded for a rarity in [0,1] (Spec 5.1). */
  function pointsFor(rarity) {
    const r = clamp(rarity, 0, 1);
    return Math.round(POINTS_MIN + (POINTS_MAX - POINTS_MIN) * Math.pow(r, POINTS_GAMMA));
  }

  /** Depth units dug for a rarity in [0,1] (Spec 5.1). */
  function digFor(rarity) {
    return clamp(rarity, 0, 1) * MAX_DIG_PER_ROUND;
  }

  /** Everything a scored round needs, from one entry + its cohort stats. */
  function scoreEntry(entry, stats) {
    const rarity = rarityOf(entry.magnitude, stats);
    return { rarity, points: pointsFor(rarity), dig: digFor(rarity) };
  }

  /** Cumulative depth after a list of per-round dig distances (Spec 5.2). */
  function cumulativeDepth(digs) {
    return digs.reduce((sum, d) => sum + (Number.isFinite(d) ? d : 0), 0);
  }

  return {
    POINTS_MIN,
    POINTS_MAX,
    POINTS_GAMMA,
    ROUNDS_PER_RUN,
    TOTAL_DEPTH_BUDGET,
    MAX_DIG_PER_ROUND,
    cohortStats,
    rarityOf,
    computeRarity,
    pointsFor,
    digFor,
    scoreEntry,
    cumulativeDepth,
    strataFor: strata.strataFor,
    stratumName: strata.stratumName
  };
});
