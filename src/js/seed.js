/**
 * Deterministic randomness for the daily dig (Spec 3.15). No DOM, no data.
 *
 * Every player who opens the game on the same calendar day must get the same
 * fifteen prompts, so the daily's slot draw runs on a PRNG seeded from the
 * date instead of Math.random. `promptBank.drawSlots(rng)` and
 * `run.createRun(bank, { rng })` already take an injectable rng - this module
 * is just where that rng comes from.
 *
 *   dailyKey(new Date())      -> "2026-09-12"   (the player's LOCAL date)
 *   seededRng("2026-09-12")   -> a () => [0, 1) function, same sequence every time
 *
 * The hash is cyrb53 (public domain) and the generator mulberry32 - both tiny,
 * both exact in every JS engine because they stay inside 32-bit integer math.
 * Everything else random in the game (dirt, relics, confetti) keeps using
 * Math.random; only the prompt draw is seeded.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Wormillion = root.Wormillion || {}).seed = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Every daily seed is namespaced, so "2026-09-12" as a daily can never share
  // a sequence with some future seeded thing keyed by the same string.
  const DAILY_NAMESPACE = 'wormillion-daily:';

  /** cyrb53: a 53-bit string hash, returned as two 32-bit halves. */
  function hash(str) {
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return { lo: h1 >>> 0, hi: h2 >>> 0 };
  }

  /** mulberry32: a () => [0, 1) generator from a 32-bit state. */
  function mulberry32(state) {
    let a = state >>> 0;
    return function rng() {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** A deterministic rng for any string: the same string, the same sequence. */
  function seededRng(str) {
    const { lo, hi } = hash(String(str));
    return mulberry32(lo ^ hi);
  }

  /**
   * The daily's key: the player's local calendar date as YYYY-MM-DD. Local,
   * not UTC, so the puzzle turns over at midnight where the player is - the
   * way every other -dle does it.
   */
  function dailyKey(date = new Date()) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  /** The rng a daily run draws its slots with. */
  function dailyRng(key) {
    return seededRng(DAILY_NAMESPACE + key);
  }

  // The first daily. Dig #1 is this date; every later day counts up from it,
  // so "Wormillion #147" means the same day for everyone.
  const DAILY_EPOCH = '2026-09-12';

  const parts = (key) => String(key).split('-').map(Number);
  // Day arithmetic in UTC on the key's own y/m/d, so a DST change on the
  // player's clock can't make two keys 23 or 25 hours apart.
  const dayIndex = (key) => {
    const [y, m, d] = parts(key);
    return Math.round(Date.UTC(y, m - 1, d) / 86400000);
  };

  /** "#147": the daily's number, counting DAILY_EPOCH as 1. */
  function dailyNumber(key) {
    return dayIndex(key) - dayIndex(DAILY_EPOCH) + 1;
  }

  /** The key `days` after (or before, if negative) another key. */
  function keyOffset(key, days) {
    const [y, m, d] = parts(key);
    const t = new Date(Date.UTC(y, m - 1, d + days));
    const pad = (n) => String(n).padStart(2, '0');
    return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
  }

  /** Whole days from one key to another (positive when `to` is later). */
  function daysBetween(from, to) {
    return dayIndex(to) - dayIndex(from);
  }

  /** Milliseconds until the next local midnight, when the daily turns over. */
  function msUntilNextDaily(now = new Date()) {
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    return Math.max(0, next.getTime() - now.getTime());
  }

  return {
    DAILY_NAMESPACE,
    DAILY_EPOCH,
    hash,
    mulberry32,
    seededRng,
    dailyKey,
    dailyRng,
    dailyNumber,
    keyOffset,
    daysBetween,
    msUntilNextDaily
  };
});
