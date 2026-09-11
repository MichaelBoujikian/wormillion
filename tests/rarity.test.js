const test = require('node:test');
const assert = require('node:assert');
const rarity = require('../src/js/rarity.js');

const near = (actual, expected, epsilon, label) =>
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `${label}: expected ${expected} +/- ${epsilon}, got ${actual}`
  );

// Spec 5.1's worked example. The formula is unchanged by the move to pageview
// scoring - only what feeds `magnitude` changed - so the original population
// figures still make the arithmetic easy to check by hand.
const COUNTRIES = [
  { id: 'vatican', magnitude: 800 },
  { id: 'tuvalu', magnitude: 11000 },
  { id: 'usa', magnitude: 335000000 },
  { id: 'india', magnitude: 1400000000 }
];

test('constants ship at the Spec 3.10 defaults', () => {
  assert.strictEqual(rarity.POINTS_MIN, 50);
  assert.strictEqual(rarity.POINTS_MAX, 1000);
  assert.strictEqual(rarity.POINTS_GAMMA, 1.4);
  assert.strictEqual(rarity.ROUNDS_PER_RUN, 15);
  assert.strictEqual(rarity.TOTAL_DEPTH_BUDGET, 700);
  near(rarity.MAX_DIG_PER_ROUND, 46.667, 0.001, 'MAX_DIG_PER_ROUND');
});

test('worked example: the small magnitude digs deep, the large one barely scratches', () => {
  const stats = rarity.cohortStats(COUNTRIES);
  const tuvalu = rarity.scoreEntry({ magnitude: 11000 }, stats);
  const usa = rarity.scoreEntry({ magnitude: 335000000 }, stats);

  near(tuvalu.rarity, 0.818, 0.01, 'Tuvalu rarity');
  near(tuvalu.points, 770, 20, 'Tuvalu points');
  near(tuvalu.dig, 38.2, 0.6, 'Tuvalu dig');

  near(usa.rarity, 0.1, 0.01, 'US rarity');
  near(usa.points, 88, 6, 'US points');
  near(usa.dig, 4.7, 0.3, 'US dig');
});

test('the extremes of a cohort are exactly 1 and 0', () => {
  const map = rarity.computeRarity(COUNTRIES);
  assert.strictEqual(map.get('vatican'), 1);
  assert.strictEqual(map.get('india'), 0);
});

test('a two-entry cohort still spans the full range', () => {
  const map = rarity.computeRarity([
    { id: 'small', magnitude: 10 },
    { id: 'big', magnitude: 1000000 }
  ]);
  assert.strictEqual(map.get('small'), 1);
  assert.strictEqual(map.get('big'), 0);
});

test('degenerate cohorts are treated as maximally rare', () => {
  const single = rarity.computeRarity([{ id: 'only', magnitude: 42 }]);
  assert.strictEqual(single.get('only'), 1);

  const flat = rarity.computeRarity([
    { id: 'a', magnitude: 500 },
    { id: 'b', magnitude: 500 }
  ]);
  assert.strictEqual(flat.get('a'), 1);
  assert.strictEqual(flat.get('b'), 1);
});

test('a magnitude of zero or less is rejected, not coerced', () => {
  assert.throws(() => rarity.cohortStats([{ id: 'bad', magnitude: 0 }]));
  assert.throws(() => rarity.cohortStats([{ id: 'bad', magnitude: -5 }]));
  assert.throws(() => rarity.cohortStats([]));
});

test('points and dig sit at the documented endpoints', () => {
  assert.strictEqual(rarity.pointsFor(0), 50);
  assert.strictEqual(rarity.pointsFor(1), 1000);
  assert.strictEqual(rarity.digFor(0), 0);
  near(rarity.digFor(1), rarity.MAX_DIG_PER_ROUND, 1e-9, 'dig at rarity 1');
  // gamma > 1 means mid-rarity answers score below the linear midpoint
  assert.ok(rarity.pointsFor(0.5) < (50 + 1000) / 2);
});

test('a perfect 15-round run lands exactly on the Core threshold', () => {
  const digs = Array.from({ length: 15 }, () => rarity.digFor(1));
  near(rarity.cumulativeDepth(digs), 700, 1e-9, 'perfect run depth');
  assert.strictEqual(rarity.stratumName(rarity.cumulativeDepth(digs)), 'Core');
});

test('timed-out rounds contribute nothing to depth', () => {
  near(rarity.cumulativeDepth([10, 0, 5.5, 0]), 15.5, 1e-9, 'depth with misses');
});

test('strata bands match the Spec 5.2 table', () => {
  const cases = [
    [0, 'Topsoil'], [99.99, 'Topsoil'],
    [100, 'Subsoil'], [199.99, 'Subsoil'],
    [200, 'Clay'], [300, 'Bedrock'], [400, 'Deep Rock'],
    [500, 'Mantle'], [599.99, 'Mantle'],
    [600, 'Core'], [700, 'Core'], [10000, 'Core']
  ];
  for (const [depth, name] of cases) {
    assert.strictEqual(rarity.stratumName(depth), name, `depth ${depth}`);
  }
});
