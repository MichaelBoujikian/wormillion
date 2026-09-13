const test = require('node:test');
const assert = require('node:assert');
const seed = require('../src/js/seed.js');

const take = (rng, n) => Array.from({ length: n }, rng);

test('the same string always gives the same sequence', () => {
  assert.deepStrictEqual(take(seed.seededRng('2026-09-12'), 20), take(seed.seededRng('2026-09-12'), 20));
});

test('different strings give different sequences', () => {
  assert.notDeepStrictEqual(take(seed.seededRng('2026-09-12'), 5), take(seed.seededRng('2026-09-13'), 5));
  assert.notDeepStrictEqual(take(seed.dailyRng('2026-09-12'), 5), take(seed.seededRng('2026-09-12'), 5));
});

test('values stay inside [0, 1) and are spread out, like Math.random', () => {
  const values = take(seed.seededRng('spread'), 2000);
  assert.ok(values.every((v) => v >= 0 && v < 1));
  const buckets = new Array(10).fill(0);
  for (const v of values) buckets[Math.floor(v * 10)] += 1;
  // 200 expected per bucket; anything wildly off means a broken generator.
  assert.ok(buckets.every((n) => n > 120 && n < 280), buckets.join(','));
});

test('the sequence is pinned: a refactor must not change a past daily', () => {
  // If this fails on purpose, every daily ever played changes; bump
  // DAILY_NAMESPACE rather than silently reseeding history.
  const first = Array.from({ length: 3 }, seed.dailyRng('2026-09-12')).map((v) => v.toFixed(8));
  assert.deepStrictEqual(first, ['0.62637862', '0.45710179', '0.11887149']);
});

test('dailyKey is the local calendar date, zero-padded', () => {
  assert.strictEqual(seed.dailyKey(new Date(2026, 8, 5, 23, 59)), '2026-09-05');
  assert.strictEqual(seed.dailyKey(new Date(2026, 0, 1, 0, 0)), '2026-01-01');
  assert.strictEqual(seed.dailyKey(new Date(2026, 11, 31, 12)), '2026-12-31');
  assert.match(seed.dailyKey(), /^\d{4}-\d{2}-\d{2}$/);
});

test('midnight local turns the key over; a minute before does not', () => {
  const before = new Date(2026, 8, 12, 23, 59, 59);
  const after = new Date(2026, 8, 13, 0, 0, 0);
  assert.notStrictEqual(seed.dailyKey(before), seed.dailyKey(after));
  assert.strictEqual(seed.dailyKey(before), '2026-09-12');
  assert.strictEqual(seed.dailyKey(after), '2026-09-13');
});

// ---- puzzle number, day arithmetic, the countdown -----------------------------

test('the first daily is #1 and every later day counts up', () => {
  assert.strictEqual(seed.DAILY_EPOCH, '2026-09-12');
  assert.strictEqual(seed.dailyNumber('2026-09-12'), 1);
  assert.strictEqual(seed.dailyNumber('2026-09-13'), 2);
  assert.strictEqual(seed.dailyNumber('2026-10-01'), 20);
  assert.strictEqual(seed.dailyNumber('2027-09-12'), 366);
});

test('keyOffset steps across month and year ends', () => {
  assert.strictEqual(seed.keyOffset('2026-09-12', 1), '2026-09-13');
  assert.strictEqual(seed.keyOffset('2026-09-30', 1), '2026-10-01');
  assert.strictEqual(seed.keyOffset('2026-12-31', 1), '2027-01-01');
  assert.strictEqual(seed.keyOffset('2026-03-01', -1), '2026-02-28');
  assert.strictEqual(seed.keyOffset('2026-09-12', 0), '2026-09-12');
});

test('daysBetween is whole days, signed', () => {
  assert.strictEqual(seed.daysBetween('2026-09-12', '2026-09-13'), 1);
  assert.strictEqual(seed.daysBetween('2026-09-13', '2026-09-12'), -1);
  assert.strictEqual(seed.daysBetween('2026-01-01', '2026-12-31'), 364);
});

test('msUntilNextDaily counts down to local midnight', () => {
  const late = new Date(2026, 8, 12, 23, 59, 30);
  assert.strictEqual(seed.msUntilNextDaily(late), 30 * 1000);
  const noon = new Date(2026, 8, 12, 12, 0, 0);
  assert.strictEqual(seed.msUntilNextDaily(noon), 12 * 3600 * 1000);
  const midnight = new Date(2026, 8, 13, 0, 0, 0);
  assert.strictEqual(seed.msUntilNextDaily(midnight), 24 * 3600 * 1000);
});
