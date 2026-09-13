const test = require('node:test');
const assert = require('node:assert');
const share = require('../src/js/share.js');
const rarity = require('../src/js/rarity.js');

test('one square per obscurity band, with the ends marked', () => {
  assert.strictEqual(share.square(null), '⬜');
  assert.strictEqual(share.square(0), '💀');
  assert.strictEqual(share.square(0.004), '💀');
  assert.strictEqual(share.square(0.005), '🟫');
  assert.strictEqual(share.square(0.24), '🟫');
  assert.strictEqual(share.square(0.25), '🟧');
  assert.strictEqual(share.square(0.49), '🟧');
  assert.strictEqual(share.square(0.5), '🟨');
  assert.strictEqual(share.square(0.69), '🟨');
  assert.strictEqual(share.square(0.7), '🟩');
  assert.strictEqual(share.square(0.849), '🟩');
  assert.strictEqual(share.square(rarity.JACKPOT_RARITY), '⭐');
  assert.strictEqual(share.square(0.99), '⭐');
  assert.strictEqual(share.square(rarity.PERFECT_RARITY), '💎');
  assert.strictEqual(share.square(1), '💎');
});

test('the grid is in round order and a miss is an empty square', () => {
  assert.strictEqual(share.grid([{ r: 0.1 }, null, { r: 1 }, { r: 0.9 }]), '🟫⬜💎⭐');
  assert.strictEqual(share.grid([]), '');
  assert.strictEqual(share.grid(undefined), '');
});

const record = {
  mode: 'daily',
  dailyKey: '2026-09-13',
  score: 4238,
  finalDepth: 351.5,
  deepestStratum: 'Bedrock',
  rounds: [{ r: 0.29 }, { r: 0.5 }, null, { r: 0.07 }, { r: 0.66 }, { r: 0.3 }, { r: 0.19 }, { r: 0.44 }, { r: 0.03 }, { r: 0.14 }, { r: 0.55 }, { r: 0.29 }, { r: 0.2 }, { r: 0.62 }, { r: 0.0 }]
};

test('a daily shares as "Wormillion #N", the grid, the depth and average, and a ?daily link', () => {
  const text = share.shareText(record);
  const lines = text.split('\n');
  assert.strictEqual(lines.length, 4);
  assert.strictEqual(lines[0], 'Wormillion #2 · 4,238 pts · Bedrock');
  assert.strictEqual(lines[1], '🟧🟨⬜🟫🟨🟧🟫🟧🟫🟫🟨🟧🟫🟨💀');
  assert.strictEqual(lines[2], '352 deep · 29% avg obscurity');
  assert.strictEqual(lines[3], 'https://michaelboujikian.github.io/wormillion/?daily');
});

test('a live host shares its own address; endless shares without a number or ?daily', () => {
  const text = share.shareText(record, { url: 'https://wormillion.netlify.app/' });
  assert.strictEqual(text.split('\n')[3], 'https://wormillion.netlify.app/?daily');
  const endless = share.shareText({ ...record, mode: undefined, dailyKey: undefined }, { url: 'https://x.test/' });
  assert.strictEqual(endless.split('\n')[0], 'Wormillion endless · 4,238 pts · Bedrock');
  assert.strictEqual(endless.split('\n')[3], 'https://x.test/');
});

test('a record without round data shares without a grid line average', () => {
  const text = share.shareText({ mode: 'daily', dailyKey: '2026-09-12', score: 10, finalDepth: 1, deepestStratum: 'Topsoil' });
  assert.deepStrictEqual(text.split('\n'), ['Wormillion #1 · 10 pts · Topsoil', '', '1 deep', 'https://michaelboujikian.github.io/wormillion/?daily']);
});
