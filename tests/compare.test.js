const test = require('node:test');
const assert = require('node:assert');
const compare = require('../src/js/compare.js');

test('apiBase: same origin on a web host, nothing on file:// or the bundle, REMOTE_API for Pages', () => {
  assert.strictEqual(compare.apiBase({ protocol: 'https:', hostname: 'wormillion.netlify.app' }), '/.netlify/functions/');
  assert.strictEqual(compare.apiBase({ protocol: 'http:', hostname: 'localhost' }), '/.netlify/functions/');
  assert.strictEqual(compare.apiBase({ protocol: 'file:', hostname: '' }), null);
  assert.strictEqual(compare.apiBase(null), null);
  // The Pages copy calls the Netlify functions cross-origin, so both hosts share one tally.
  assert.strictEqual(compare.apiBase({ protocol: 'https:', hostname: 'michaelboujikian.github.io' }), 'https://wormillion.netlify.app/.netlify/functions/');
});

test('betterThan counts buckets strictly below yours, out of everyone including you', () => {
  const hist = { 10: 2, 20: 3, 30: 1 }; // 6 diggers
  assert.strictEqual(compare.betterThan(hist, 30), 83); // 5 of 6 below
  assert.strictEqual(compare.betterThan(hist, 20), 33); // 2 of 6 below; ties don't count
  assert.strictEqual(compare.betterThan(hist, 10), 0);
  assert.strictEqual(compare.betterThan({ 10: 1 }, 10), null); // alone
  assert.strictEqual(compare.betterThan({}, 10), null);
});

test('medianBucket is the bucket where half the diggers have been counted', () => {
  assert.strictEqual(compare.medianBucket({ 10: 1, 20: 1, 30: 1 }), 20);
  assert.strictEqual(compare.medianBucket({ 10: 3, 40: 1 }), 10);
  assert.strictEqual(compare.medianBucket({ 5: 1 }), 5);
  assert.strictEqual(compare.medianBucket({}), null);
});

const stats = {
  count: 4,
  scoreSum: 4000 + 3600 + 2000 + 6000,
  raritySum: 0.3 + 0.36 + 0.2 + 0.5,
  scoreHist: { 40: 1, 36: 1, 20: 1, 60: 1 },
  rarityHist: { 30: 1, 36: 1, 20: 1, 50: 1 },
  prompts: ['Name a river.', 'Name a lake.', 'Name a desert.'],
  rounds: [
    { answered: 4, missed: 0, raritySum: 1, jackpots: 0, duds: 0, best: { name: 'Aldan', rarity: 1, count: 2 } },
    { answered: 1, missed: 3, raritySum: 0.2, jackpots: 0, duds: 0, best: { name: 'Loch Ness', rarity: 0.2, count: 1 } },
    { answered: 3, missed: 1, raritySum: 0.9, jackpots: 0, duds: 0, best: { name: 'Gobi', rarity: 0.3, count: 3 } }
  ]
};
const mine = { score: 4000, rounds: [{ a: 'Nile', r: 0.1 }, null, { a: 'Gobi', r: 0.8 }] }; // avg 0.3

test('summarize: percentiles on both measures, the median, the hardest round and the rarest find', () => {
  const s = compare.summarize(stats, mine);
  assert.strictEqual(s.count, 4);
  assert.strictEqual(s.betterScore, 50); // 2000 and 3600 are below 4000
  assert.strictEqual(s.betterRarity, 25); // only 0.2 is below 0.3
  assert.strictEqual(s.medianScore, 3600);
  assert.strictEqual(s.meanScore, 3900);
  assert.deepStrictEqual(s.hardest, { round: 2, prompt: 'Name a lake.', missedPct: 75 });
  assert.deepStrictEqual(s.rarest, { round: 1, prompt: 'Name a river.', name: 'Aldan', pct: 100, count: 2 });
  assert.strictEqual(compare.summarize({ count: 0 }, mine), null);
  assert.strictEqual(compare.summarize(null, mine), null);
});

test('lines: the headline, the detail, the extras', () => {
  const out = compare.lines(compare.summarize(stats, mine), mine);
  assert.deepStrictEqual(out, [
    'Better than 50% of 4 diggers today',
    '4,000 pts vs. a median of 3,600 · avg obscurity 30% vs. 34%',
    'Hardest round: #2 — 75% missed it',
    'Rarest find today: Aldan (100%) on round 1, by 2 diggers'
  ]);
});

test('lines: alone today', () => {
  const solo = { ...stats, count: 1, scoreHist: { 40: 1 }, rarityHist: { 30: 1 }, scoreSum: 4000, raritySum: 0.3, rounds: [] };
  const out = compare.lines(compare.summarize(solo, mine), mine);
  assert.strictEqual(out[0], "You're the first to dig today");
  assert.strictEqual(out.length, 1);
});

test('submission sends the answers only, with the day and the draw', () => {
  const record = { dailyKey: '2026-09-13', draw: 'c75d078c', score: 999, rounds: [{ a: 'Nile', r: 0.1 }, null] };
  assert.deepStrictEqual(compare.submission(record, 'p-12345678'), {
    day: '2026-09-13',
    playerId: 'p-12345678',
    rounds: ['Nile', null],
    draw: 'c75d078c'
  });
});
