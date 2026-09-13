/**
 * The daily comparison, client side (Spec 3.17): turn the day's aggregate
 * from /.netlify/functions/daily-stats into "Better than 62% of 143 diggers
 * today". Pure maths and wording here; ui.js does the fetching and the DOM.
 *
 * The aggregate carries histograms, not rows: scoreHist is { bucket: n }
 * with a bucket per 100 points, rarityHist { pct: n } with a bucket per 1%
 * of average obscurity. "Better than N%" is the share of diggers in buckets
 * strictly below yours - ties are not "better than", and you count yourself
 * in the total, since you are one of today's diggers.
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else (root.Wormillion = root.Wormillion || {}).compare = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const SCORE_BUCKET = 100;

  // Where the API lives for a page served from somewhere other than Netlify
  // (the GitHub Pages copy), so every host shares one tally. Empty would
  // mean "same origin only": a page on a host that isn't Netlify would show
  // no comparison. The functions' CORS list must admit the calling origin.
  const REMOTE_API = 'https://wormillion.netlify.app';
  const FUNCTIONS = '/.netlify/functions/';

  /**
   * The API base for a page at `location`, or null when there is none:
   * file:// and the single-file bundle have no server; a page on GitHub
   * Pages needs REMOTE_API; anything else (Netlify, `npm start`) is same
   * origin.
   */
  function apiBase(location) {
    if (!location || !/^https?:$/.test(location.protocol)) return null;
    if (/\.github\.io$/i.test(location.hostname)) return REMOTE_API ? REMOTE_API + FUNCTIONS : null;
    return FUNCTIONS;
  }

  const total = (hist) => Object.values(hist || {}).reduce((a, b) => a + b, 0);

  /** Diggers in buckets strictly below `bucket`. */
  function countBelow(hist, bucket) {
    let n = 0;
    for (const [key, count] of Object.entries(hist || {})) if (Number(key) < bucket) n += count;
    return n;
  }

  /** The bucket at or above which half the diggers sit (its lower edge). */
  function medianBucket(hist) {
    const n = total(hist);
    if (n === 0) return null;
    const keys = Object.keys(hist).map(Number).sort((a, b) => a - b);
    let seen = 0;
    for (const key of keys) {
      seen += hist[key];
      if (seen * 2 >= n) return key;
    }
    return keys[keys.length - 1];
  }

  /** Percentage (0-100, integer) of today's diggers you beat on one measure. */
  function betterThan(hist, bucket) {
    const n = total(hist);
    if (n <= 1) return null; // nobody to compare with yet
    return Math.floor((countBelow(hist, bucket) / n) * 100);
  }

  /**
   * Everything the UI shows, from the day's aggregate and your own record
   * (score, rounds). null when there is nothing to compare with.
   */
  function summarize(stats, record) {
    if (!stats || !record || !(stats.count > 0)) return null;
    const rounds = stats.rounds || [];
    const mine = {
      score: record.score,
      rarity: record.rounds && record.rounds.length ? record.rounds.reduce((s, r) => s + (r ? r.r : 0), 0) / record.rounds.length : null
    };
    const out = {
      count: stats.count,
      betterScore: betterThan(stats.scoreHist, Math.floor(mine.score / SCORE_BUCKET)),
      betterRarity: mine.rarity === null ? null : betterThan(stats.rarityHist, Math.round(mine.rarity * 100)),
      medianScore: medianBucket(stats.scoreHist),
      meanScore: stats.count ? Math.round(stats.scoreSum / stats.count) : null,
      meanRarity: stats.count ? stats.raritySum / stats.count : null,
      hardest: null,
      rarest: null
    };
    if (out.medianScore !== null) out.medianScore *= SCORE_BUCKET;

    // The round most diggers missed (only worth saying when someone did).
    let hardest = null;
    rounds.forEach((round, i) => {
      const played = round.answered + round.missed;
      if (!played || !round.missed) return;
      const missedShare = round.missed / played;
      if (!hardest || missedShare > hardest.missedShare) hardest = { round: i + 1, prompt: stats.prompts ? stats.prompts[i] : '', missedShare };
    });
    out.hardest = hardest && { round: hardest.round, prompt: hardest.prompt, missedPct: Math.round(hardest.missedShare * 100) };

    // The rarest thing anyone found today.
    let rarest = null;
    rounds.forEach((round, i) => {
      if (!round.best) return;
      if (!rarest || round.best.rarity > rarest.rarity) rarest = { round: i + 1, prompt: stats.prompts ? stats.prompts[i] : '', ...round.best };
    });
    out.rarest = rarest && { round: rarest.round, prompt: rarest.prompt, name: rarest.name, pct: Math.round(rarest.rarity * 100), count: rarest.count };
    return out;
  }

  const fmt = (n) => Number(n).toLocaleString('en-US');
  const diggers = (n) => `${fmt(n)} ${n === 1 ? 'digger' : 'diggers'}`;

  /** The lines the UI prints, in order; the first is the headline. */
  function lines(summary, record) {
    if (!summary) return [];
    const out = [];
    if (summary.count === 1) {
      out.push("You're the first to dig today");
    } else if (summary.betterScore !== null) {
      out.push(`Better than ${summary.betterScore}% of ${diggers(summary.count)} today`);
    }
    const detail = [];
    if (summary.medianScore !== null && summary.count > 1) detail.push(`${fmt(record.score)} pts vs. a median of ${fmt(summary.medianScore)}`);
    if (summary.betterRarity !== null && summary.meanRarity !== null) {
      const mine = record.rounds ? Math.round((record.rounds.reduce((s, r) => s + (r ? r.r : 0), 0) / record.rounds.length) * 100) : null;
      if (mine !== null) detail.push(`avg obscurity ${mine}% vs. ${Math.round(summary.meanRarity * 100)}%`);
    }
    if (detail.length) out.push(detail.join(' · '));
    if (summary.hardest) out.push(`Hardest round: #${summary.hardest.round} — ${summary.hardest.missedPct}% missed it`);
    if (summary.rarest) {
      const who = summary.rarest.count === 1 ? 'one digger' : `${summary.rarest.count} diggers`;
      out.push(`Rarest find today: ${summary.rarest.name} (${summary.rarest.pct}%) on round ${summary.rarest.round}, by ${who}`);
    }
    return out;
  }

  /** The request body for daily-submit: the answers only, the server scores them. */
  function submission(record, playerId) {
    return {
      day: record.dailyKey,
      playerId,
      rounds: (record.rounds || []).map((r) => (r ? r.a : null)),
      draw: record.draw
    };
  }

  return { SCORE_BUCKET, REMOTE_API, FUNCTIONS, apiBase, total, countBelow, medianBucket, betterThan, summarize, lines, submission };
});
