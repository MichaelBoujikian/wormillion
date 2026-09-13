/**
 * The share text (Spec 3.16): the -dle convention of a header, a grid of
 * one emoji per round, and a link. No DOM - ui.js puts it on the clipboard.
 *
 *   Wormillion #2 · 4,238 pts · Bedrock
 *   🟫🟧🟨🟩⭐⬜🟫🟨🟧💀🟩🟩🟨🟫⭐
 *   352 deep · 41% avg obscurity
 *   https://michaelboujikian.github.io/wormillion/?daily
 *
 * The grid is in ROUND order, not ladder order: everyone who dug that day
 * had the same fifteen prompts in the same order, so square seven is the
 * same question for everyone and the grids compare position by position.
 * Each square is the answer's obscurity band; the two ends get their own
 * marks (💀 for a 0%, ⭐ for one in Wormillion, 💎 for a 100%).
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Wormillion = root.Wormillion || {}).share = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const isNode = typeof module === 'object' && module.exports;
  const rarity = isNode ? require('./rarity.js') : root.Wormillion.rarity;
  const seed = isNode ? require('./seed.js') : root.Wormillion.seed;

  // Where a shared link points when the game isn't running on a web host
  // (file://, the single-file bundle). A live host shares its own address.
  const CANONICAL_URL = 'https://michaelboujikian.github.io/wormillion/';

  // Obscurity bands, shallow to deep. A miss is an empty square.
  const BANDS = [
    [0.25, '🟫'],
    [0.5, '🟧'],
    [0.7, '🟨'],
    [rarity.JACKPOT_RARITY, '🟩']
  ];
  const MISS = '⬜';
  const DUD = '💀';
  const JACKPOT = '⭐';
  const PERFECT = '💎';

  /** One square for one round: `r` is the answer's rarity, null for a miss. */
  function square(r) {
    if (r === null || r === undefined) return MISS;
    if (r >= rarity.PERFECT_RARITY) return PERFECT;
    if (rarity.isJackpot(r)) return JACKPOT;
    if (rarity.isDud(r)) return DUD;
    for (const [limit, mark] of BANDS) if (r < limit) return mark;
    return JACKPOT; // unreachable: everything below the bar hit a band
  }

  /** The grid line for a record's rounds (`[{r}|null]`, round order). */
  function grid(rounds) {
    return (rounds || []).map((round) => square(round ? round.r : null)).join('');
  }

  /** Mean rarity over the rounds, a miss as 0; null with no rounds. */
  function averageRarity(rounds) {
    if (!rounds || rounds.length === 0) return null;
    return rounds.reduce((sum, round) => sum + (round ? round.r : 0), 0) / rounds.length;
  }

  /**
   * The full share text for a stored record (persistence.toRecord shape).
   * @param {object} record   { mode, dailyKey, score, finalDepth, deepestStratum, rounds }
   * @param {object} [opts]   { url } - the page's own address; defaults to CANONICAL_URL
   */
  function shareText(record, opts = {}) {
    const daily = record.mode === 'daily' && record.dailyKey;
    const title = daily ? `Wormillion #${seed.dailyNumber(record.dailyKey)}` : 'Wormillion endless';
    const score = `${Number(record.score).toLocaleString('en-US')} pts`;
    const header = `${title} · ${score} · ${record.deepestStratum}`;

    const mean = averageRarity(record.rounds);
    const stats = [`${Math.round(record.finalDepth)} deep`];
    if (mean !== null) stats.push(`${Math.round(mean * 100)}% avg obscurity`);

    const base = opts.url || CANONICAL_URL;
    const link = daily ? `${base}${base.includes('?') ? '&' : '?'}daily` : base;

    return [header, grid(record.rounds), stats.join(' · '), link].join('\n');
  }

  return { CANONICAL_URL, MISS, DUD, JACKPOT, PERFECT, square, grid, averageRarity, shareText };
});
