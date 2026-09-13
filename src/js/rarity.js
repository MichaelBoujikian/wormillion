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

  // Spec 3.10 - tunable, but these are the shipped values.
  const POINTS_MIN = 50;
  const POINTS_MAX = 1000;
  const POINTS_GAMMA = 1.4;
  const ROUNDS_PER_RUN = 15;

  // Dig distance (Spec 5.1, v1.2). Below the jackpot bar a dig is linear in
  // rarity; at the bar it jumps to a flat bonus, and an answer that reads as
  // 100% on screen digs the whole round. So 85-99% are "one in Wormillion" and
  // all dig the same, and only the rarest thing in a cohort digs 100.
  const DIG_SCALE = 70; // dig = rarity * DIG_SCALE below the bar (v1.1 was 700/15 = 46.67)
  const JACKPOT_RARITY = 0.85; // one in Wormillion: 85%+ obscure
  const DIG_JACKPOT = 75;
  const PERFECT_RARITY = 0.995; // rounds to 100% in the UI
  const DIG_PERFECT = 100;
  // Points follow the same shape: the curve below the bar, a flat prize for
  // 85-99% (above anything the curve pays below the bar), the maximum for 100%.
  const POINTS_JACKPOT = 950;
  // The other end: an answer that reads as 0% on screen is a dud - the most
  // looked-up thing in its cohort. The UI shames it (3.14); scoring is unchanged.
  const DUD_RARITY = 0.005; // rounds to 0% in the UI, as PERFECT_RARITY rounds to 100%
  const MAX_DIG_PER_ROUND = DIG_PERFECT;
  // The deepest a run can possibly go: fifteen 100% answers. Core starts at
  // 600, so a strong run reaches it without being perfect (Spec 5.2).
  const TOTAL_DEPTH_BUDGET = ROUNDS_PER_RUN * MAX_DIG_PER_ROUND;

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
    if (r >= PERFECT_RARITY) return POINTS_MAX;
    if (r >= JACKPOT_RARITY) return POINTS_JACKPOT;
    return Math.round(POINTS_MIN + (POINTS_MAX - POINTS_MIN) * Math.pow(r, POINTS_GAMMA));
  }

  /** Is this rarity "one in Wormillion"? The UI celebrates and the dig is bonused. */
  function isJackpot(rarity) {
    return rarity >= JACKPOT_RARITY;
  }

  /** Does this rarity read as 0%? The UI mocks it; nothing else changes. */
  function isDud(rarity) {
    return rarity < DUD_RARITY;
  }

  /** Depth units dug for a rarity in [0,1] (Spec 5.1). */
  function digFor(rarity) {
    const r = clamp(rarity, 0, 1);
    if (r >= PERFECT_RARITY) return DIG_PERFECT;
    if (r >= JACKPOT_RARITY) return DIG_JACKPOT;
    return r * DIG_SCALE;
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
    POINTS_JACKPOT,
    ROUNDS_PER_RUN,
    TOTAL_DEPTH_BUDGET,
    MAX_DIG_PER_ROUND,
    DIG_SCALE,
    JACKPOT_RARITY,
    DIG_JACKPOT,
    PERFECT_RARITY,
    DIG_PERFECT,
    DUD_RARITY,
    cohortStats,
    rarityOf,
    computeRarity,
    pointsFor,
    isJackpot,
    isDud,
    digFor,
    scoreEntry,
    cumulativeDepth,
    strataFor: strata.strataFor,
    stratumName: strata.stratumName
  };
});
