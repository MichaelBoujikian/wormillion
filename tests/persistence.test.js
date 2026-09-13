const test = require('node:test');
const assert = require('node:assert');
const persistence = require('../src/js/persistence.js');
const seed = require('../src/js/seed.js');

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
  assert.deepStrictEqual(empty, { bestDive: null, history: [], playerId: null, compare: null });
});

test('a corrupt key reads as empty rather than throwing', () => {
  assert.deepStrictEqual(persistence.read(fakeStore('{not json')), { bestDive: null, history: [], playerId: null, compare: null });
  assert.deepStrictEqual(persistence.read(fakeStore('null')), { bestDive: null, history: [], playerId: null, compare: null });
  assert.deepStrictEqual(persistence.read(fakeStore('{"history":"nope"}')), { bestDive: null, history: [], playerId: null, compare: null });
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
  assert.deepStrictEqual(persistence.read(blocked), { bestDive: null, history: [], playerId: null, compare: null });
  const result = persistence.recordRun(summary(10, 1, 'Topsoil'), blocked);
  assert.strictEqual(result.isBest, true);
});

// ---- modes (Spec 3.15) -------------------------------------------------------

test('a daily run is stored with its mode and key; an endless run with neither', () => {
  const store = fakeStore();
  persistence.recordRun({ ...summary(900, 120, 'Subsoil'), mode: 'daily', dailyKey: '2026-09-12' }, store);
  persistence.recordRun({ ...summary(1100, 160, 'Clay'), mode: 'endless', dailyKey: null }, store);
  const [daily, endless] = persistence.read(store).history;
  assert.strictEqual(daily.mode, 'daily');
  assert.strictEqual(daily.dailyKey, '2026-09-12');
  assert.strictEqual('mode' in endless, false);
  assert.strictEqual('dailyKey' in endless, false);
});

test('dailyResult finds the day that was played and nothing for a day that was not', () => {
  const store = fakeStore();
  assert.strictEqual(persistence.dailyResult('2026-09-12', store), null);
  persistence.recordRun({ ...summary(900, 120, 'Subsoil'), mode: 'daily', dailyKey: '2026-09-12' }, store);
  persistence.recordRun(summary(4000, 400, 'Bedrock'), store); // an endless run the same day
  assert.strictEqual(persistence.dailyResult('2026-09-12', store).score, 900);
  assert.strictEqual(persistence.dailyResult('2026-09-13', store), null);
  assert.strictEqual(persistence.dailyResult(null, store), null);
});

test('a record from before modes existed still reads, and never passes as a daily', () => {
  const store = fakeStore(JSON.stringify({ history: [{ score: 700, deepestStratum: 'Clay', finalDepth: 150, date: '2026-09-01T10:00:00.000Z' }] }));
  assert.strictEqual(persistence.read(store).history.length, 1);
  assert.strictEqual(persistence.dailyResult('2026-09-01', store), null);
  assert.strictEqual(persistence.stats(store).runs, 1);
});

test('best dive and stats count both modes together', () => {
  const store = fakeStore();
  persistence.recordRun({ ...summary(900, 120, 'Subsoil'), mode: 'daily', dailyKey: '2026-09-12' }, store);
  const second = persistence.recordRun(summary(1100, 160, 'Clay'), store);
  assert.strictEqual(second.isBest, true);
  assert.strictEqual(second.previousBest.score, 900);
  assert.strictEqual(persistence.stats(store).runs, 2);
});

// ---- rounds, the daily cap exemption, streaks, daily stats (Spec 3.16) ---------

const daily = (key, score, rounds) => ({
  ...summary(score, score / 10, 'Clay'),
  mode: 'daily',
  dailyKey: key,
  rounds
});
const acc = (answer, rarity) => ({ status: 'accepted', answer, rarity });
const miss = () => ({ status: 'timeout' });

test('a record keeps each round as answer + rarity, a miss as null, prompts only as a fingerprint', () => {
  const rounds = [{ ...acc('Lake Huron', 0.29123456), prompt: 'Name a lake.' }, { ...miss(), prompt: 'Name a river.' }, { ...acc('Aldan', 1), prompt: 'Name a river in Siberia.' }];
  const record = persistence.toRecord(daily('2026-09-12', 900, rounds));
  assert.deepStrictEqual(record.rounds, [{ a: 'Lake Huron', r: 0.2912 }, null, { a: 'Aldan', r: 1 }]);
  assert.strictEqual('prompt' in record, false);
  assert.strictEqual(record.draw, seed.fingerprint(['Name a lake.', 'Name a river.', 'Name a river in Siberia.']));
  assert.strictEqual('rounds' in persistence.toRecord(summary(1, 1, 'Topsoil')), false);
  // an endless run stores rounds but no draw: its prompts can't be regenerated anyway
  assert.strictEqual('draw' in persistence.toRecord({ ...summary(1, 1, 'Topsoil'), rounds }), false);
});

test('averageRarity is the mean over rounds with a miss as 0, or null without round data', () => {
  assert.strictEqual(persistence.averageRarity({ rounds: [{ r: 1 }, null, { r: 0.5 }] }), 0.5);
  assert.strictEqual(persistence.averageRarity({ rounds: [] }), null);
  assert.strictEqual(persistence.averageRarity({ score: 3 }), null);
});

test('the history cap trims the oldest endless runs and never a daily', () => {
  const store = fakeStore();
  persistence.recordRun(daily('2026-01-01', 500, []), store);
  for (let i = 0; i < persistence.HISTORY_CAP + 5; i++) persistence.recordRun(summary(1000 + i, 100, 'Clay'), store);
  persistence.recordRun(daily('2026-01-02', 600, []), store);
  const history = persistence.read(store).history;
  const endless = history.filter((r) => r.mode !== 'daily');
  assert.strictEqual(endless.length, persistence.HISTORY_CAP);
  assert.strictEqual(endless[0].score, 1005); // the five oldest endless runs went
  assert.deepStrictEqual(history.filter((r) => r.mode === 'daily').map((r) => r.dailyKey), ['2026-01-01', '2026-01-02']);
  assert.strictEqual(history[0].dailyKey, '2026-01-01'); // order kept
});

test('dailies() lists each day once, oldest first', () => {
  const store = fakeStore();
  persistence.recordRun(daily('2026-09-13', 700, []), store);
  persistence.recordRun(daily('2026-09-12', 500, []), store);
  persistence.recordRun(summary(1, 1, 'Topsoil'), store);
  assert.deepStrictEqual(persistence.dailies(store).map((r) => r.dailyKey), ['2026-09-12', '2026-09-13']);
});

test("the streak counts consecutive days; today unplayed keeps yesterday's streak; a gap ends it", () => {
  const store = fakeStore();
  assert.deepStrictEqual(persistence.dailyStreak('2026-09-12', store), { current: 0, best: 0 });
  for (const key of ['2026-09-10', '2026-09-11', '2026-09-12']) persistence.recordRun(daily(key, 500, []), store);
  assert.deepStrictEqual(persistence.dailyStreak('2026-09-12', store), { current: 3, best: 3 });
  assert.deepStrictEqual(persistence.dailyStreak('2026-09-13', store), { current: 3, best: 3 }); // not dug yet today
  assert.deepStrictEqual(persistence.dailyStreak('2026-09-14', store), { current: 0, best: 3 }); // missed the 13th
  persistence.recordRun(daily('2026-09-14', 500, []), store);
  assert.deepStrictEqual(persistence.dailyStreak('2026-09-14', store), { current: 1, best: 3 });
});

test('the streak crosses a month end and is not fooled by records arriving out of order', () => {
  const store = fakeStore();
  for (const key of ['2026-10-01', '2026-09-30', '2026-09-29']) persistence.recordRun(daily(key, 500, []), store);
  assert.deepStrictEqual(persistence.dailyStreak('2026-10-01', store), { current: 3, best: 3 });
});

test('dailyStats: played, streaks, averages, best and the stratum spread, from dailies only', () => {
  const store = fakeStore();
  persistence.recordRun({ ...daily('2026-09-11', 800, [acc('x', 0.4), acc('y', 0.6)]), deepestStratum: 'Clay' }, store);
  persistence.recordRun({ ...daily('2026-09-12', 1200, [acc('x', 1), miss()]), deepestStratum: 'Bedrock' }, store);
  persistence.recordRun(summary(9000, 900, 'Core'), store); // endless: not counted here
  const s = persistence.dailyStats('2026-09-12', store);
  assert.strictEqual(s.played, 2);
  assert.strictEqual(s.streak, 2);
  assert.strictEqual(s.bestStreak, 2);
  assert.strictEqual(s.averageScore, 1000);
  assert.strictEqual(s.bestScore, 1200);
  assert.strictEqual(s.averageRarity, 0.5); // (0.5 + 0.5) / 2
  assert.deepStrictEqual(s.byStratum, { Clay: 1, Bedrock: 1 });
  assert.strictEqual(s.dailies.length, 2);
  const empty = persistence.dailyStats('2026-09-12', fakeStore());
  assert.deepStrictEqual({ played: empty.played, streak: empty.streak, averageRarity: empty.averageRarity }, { played: 0, streak: 0, averageRarity: null });
});

// ---- the daily comparison: playerId and the cached stats (Spec 3.17) ----------

test('playerId is made once, kept, and survives runs being recorded', () => {
  const store = fakeStore();
  const id = persistence.playerId(store);
  assert.match(id, /^[A-Za-z0-9_-]{8,64}$/);
  assert.strictEqual(persistence.playerId(store), id);
  persistence.recordRun(summary(100, 10, 'Topsoil'), store);
  assert.strictEqual(persistence.playerId(store), id);
  assert.strictEqual(persistence.read(store).playerId, id);
  // An injected generator is used when there is no id yet.
  assert.strictEqual(persistence.playerId(fakeStore(), () => 'fixed-id-0001'), 'fixed-id-0001');
});

test('the last comparison is cached per day and outlives a recorded run', () => {
  const store = fakeStore();
  assert.strictEqual(persistence.comparison('2026-09-13', store), null);
  persistence.saveComparison('2026-09-13', { count: 3 }, store);
  assert.deepStrictEqual(persistence.comparison('2026-09-13', store), { count: 3 });
  assert.strictEqual(persistence.comparison('2026-09-14', store), null);
  persistence.recordRun(summary(100, 10, 'Topsoil'), store);
  assert.deepStrictEqual(persistence.comparison('2026-09-13', store), { count: 3 });
});

test('an old store without playerId or compare reads with them null', () => {
  const store = fakeStore(JSON.stringify({ history: [] }));
  const data = persistence.read(store);
  assert.strictEqual(data.playerId, null);
  assert.strictEqual(data.compare, null);
});
