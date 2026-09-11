const test = require('node:test');
const assert = require('node:assert');
const persistence = require('../src/js/persistence.js');

/** Minimal localStorage stand-in. */
function fakeStore(initial) {
  const map = new Map(initial ? [[persistence.KEY, initial]] : []);
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, v),
    raw: map
  };
}

const summary = (score, depth, stratum) => ({
  score,
  finalDepth: depth,
  deepestStratum: stratum,
  date: '2026-09-05T18:04:00.000Z'
});

test('an empty store reads as "no history yet"', () => {
  const empty = persistence.read(fakeStore());
  assert.deepStrictEqual(empty, { bestDive: null, history: [] });
});

test('a corrupt key reads as empty rather than throwing', () => {
  assert.deepStrictEqual(persistence.read(fakeStore('{not json')), { bestDive: null, history: [] });
  assert.deepStrictEqual(persistence.read(fakeStore('null')), { bestDive: null, history: [] });
  assert.deepStrictEqual(persistence.read(fakeStore('{"history":"nope"}')), { bestDive: null, history: [] });
});

test('recording a run stores it and reports a new best', () => {
  const store = fakeStore();
  const first = persistence.recordRun(summary(1200, 240.4, 'Clay'), store);
  assert.strictEqual(first.isBest, true);
  assert.strictEqual(first.previousBest, null);
  assert.strictEqual(first.history.length, 1);
  assert.strictEqual(first.bestDive.score, 1200);

  const worse = persistence.recordRun(summary(800, 120, 'Subsoil'), store);
  assert.strictEqual(worse.isBest, false);
  assert.strictEqual(worse.bestDive.score, 1200);

  const better = persistence.recordRun(summary(5230, 542.3, 'Mantle'), store);
  assert.strictEqual(better.isBest, true);
  assert.strictEqual(better.previousBest.score, 1200);
  assert.strictEqual(better.bestDive.score, 5230);
  assert.strictEqual(better.history.length, 3);
});

test('bestDive is derived from history, never trusted from storage', () => {
  const store = fakeStore(
    JSON.stringify({
      bestDive: { score: 999999, deepestStratum: 'Core', finalDepth: 700, date: '2026-01-01T00:00:00.000Z' },
      history: [{ score: 10, deepestStratum: 'Topsoil', finalDepth: 5, date: '2026-01-01T00:00:00.000Z' }]
    })
  );
  assert.strictEqual(persistence.read(store).bestDive.score, 10);
});

test('history is capped at 50, oldest dropped', () => {
  const store = fakeStore();
  for (let i = 1; i <= 55; i++) persistence.recordRun(summary(i, i, 'Topsoil'), store);
  const { history } = persistence.read(store);
  assert.strictEqual(history.length, persistence.HISTORY_CAP);
  assert.strictEqual(history[0].score, 6, 'oldest entries dropped');
  assert.strictEqual(history[history.length - 1].score, 55, 'most recent last');
});

test('stats are derived, not stored', () => {
  const store = fakeStore();
  persistence.recordRun(summary(100, 50, 'Topsoil'), store);
  persistence.recordRun(summary(300, 260, 'Clay'), store);
  const stats = persistence.stats(store);
  assert.strictEqual(stats.runs, 2);
  assert.strictEqual(stats.averageScore, 200);
  assert.strictEqual(stats.bestScore, 300);
  assert.strictEqual(stats.deepestStratum, 'Clay');
  assert.strictEqual(JSON.parse(store.getItem(persistence.KEY)).history.length, 2);
});

test('a blocked store degrades quietly instead of throwing', () => {
  const blocked = {
    getItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('blocked');
    }
  };
  assert.deepStrictEqual(persistence.read(blocked), { bestDive: null, history: [] });
  const result = persistence.recordRun(summary(10, 1, 'Topsoil'), blocked);
  assert.strictEqual(result.isBest, true);
});
