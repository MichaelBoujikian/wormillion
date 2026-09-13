const test = require('node:test');
const assert = require('node:assert');
const daily = require('../netlify/functions/lib/daily.js');
const runner = require('../src/js/run.js');
const rarity = require('../src/js/rarity.js');

// The shipped bank: the server replays real answers against real prompts.
const bank = daily.loadBank();
const DAY = '2026-09-13';
const NOW = () => new Date('2026-09-13T15:00:00Z');
const api = () => {
  const store = daily.memoryStore();
  return { store, api: daily.createDailyApi({ store, bank, now: NOW }) };
};

/** Fifteen answers a real player could give for `day`: the first accepted key per prompt. */
function answersFor(day, { rarest = false, misses = [] } = {}) {
  const run = runner.createRun(bank, { mode: 'daily', dailyKey: day });
  const out = [];
  while (!run.finished) {
    const round = run.roundNumber;
    if (misses.includes(round)) {
      run.timeout();
      out.push(null);
      continue;
    }
    const prompt = run.prompt();
    const keys = [...prompt.lookup.keys()];
    if (rarest) {
      const best = runner.rarestFor(prompt);
      keys.sort((a, b) => (prompt.cohort.byId.get(prompt.lookup.get(b)).name === best.name) - (prompt.cohort.byId.get(prompt.lookup.get(a)).name === best.name));
    }
    let done = false;
    for (const key of keys) {
      const result = run.submit(key);
      if (result.status === 'accepted') {
        out.push(result.entry.name);
        done = true;
        break;
      }
    }
    if (!done) {
      run.timeout();
      out.push(null);
    }
  }
  return out;
}

const body = (over = {}) => ({ day: DAY, playerId: 'player-0001', rounds: answersFor(DAY), ...over });

test('a valid submission is replayed, scored by the server and aggregated', async () => {
  const { api: a, store } = api();
  const res = await a.submit(body());
  assert.strictEqual(res.status, 200, JSON.stringify(res.body));
  assert.strictEqual(res.body.ok, true);
  assert.strictEqual(res.body.aggregated, true);
  assert.ok(res.body.score > 0);
  assert.ok(res.body.averageRarity >= 0 && res.body.averageRarity <= 1);
  assert.match(res.body.draw, /^[0-9a-f]{8}$/);
  // Stored once as a submission, once folded into the day.
  assert.deepStrictEqual(await store.list('submissions/'), [`submissions/${DAY}/player-0001`]);
  const day = (await store.getWithEtag(`days/${DAY}`)).data;
  assert.strictEqual(day.count, 1);
  assert.strictEqual(day.scoreSum, res.body.score);
  assert.strictEqual(day.rounds.length, rarity.ROUNDS_PER_RUN);
});

test('the score is the engine’s, not the client’s: a claimed score is ignored', async () => {
  const { api: a } = api();
  const res = await a.submit(body({ score: 999999 }));
  assert.strictEqual(res.status, 200);
  assert.ok(res.body.score < 15001);
  // ...and it equals what the engine gives for the same answers.
  const run = runner.createRun(bank, { mode: 'daily', dailyKey: DAY });
  for (const answer of body().rounds) (answer === null ? run.timeout() : run.submit(answer));
  assert.strictEqual(res.body.score, run.summary().score);
});

test('an answer the prompt would not accept is rejected with the round number', async () => {
  const { api: a } = api();
  const rounds = answersFor(DAY);
  rounds[2] = 'Narnia';
  const res = await a.submit(body({ rounds }));
  assert.strictEqual(res.status, 400);
  assert.match(res.body.error, /^round 3: unrecognized/);
  const dup = answersFor(DAY);
  dup[1] = dup[0]; // the same place twice is a duplicate, not a score
  if (dup[0] !== null) {
    const run = runner.createRun(bank, { mode: 'daily', dailyKey: DAY });
    // only meaningful if round 2 would otherwise accept round 1's answer in its own category
    const r2 = run.state.slots[1].category === run.state.slots[0].category;
    if (r2) assert.strictEqual((await a.submit(body({ rounds: dup }))).status, 400);
  }
});

test('misses are timeouts: null rounds score nothing and count as missed', async () => {
  const { api: a, store } = api();
  const res = await a.submit(body({ rounds: answersFor(DAY, { misses: [1, 2] }) }));
  assert.strictEqual(res.status, 200, JSON.stringify(res.body));
  const day = (await store.getWithEtag(`days/${DAY}`)).data;
  assert.strictEqual(day.rounds[0].missed, 1);
  assert.strictEqual(day.rounds[0].answered, 0);
  assert.strictEqual(day.rounds[2].answered, 1);
});

test('one submission per player per day; a repeat is a harmless duplicate', async () => {
  const { api: a, store } = api();
  await a.submit(body());
  const again = await a.submit(body({ rounds: answersFor(DAY, { rarest: true }) }));
  assert.strictEqual(again.status, 200);
  assert.strictEqual(again.body.duplicate, true);
  assert.strictEqual((await store.getWithEtag(`days/${DAY}`)).data.count, 1);
});

test('bad shapes are 400s: day, playerId, rounds, draw', async () => {
  const { api: a } = api();
  assert.strictEqual((await a.submit(null)).status, 400);
  assert.strictEqual((await a.submit(body({ day: '13/09/2026' }))).body.error, 'invalid day');
  assert.strictEqual((await a.submit(body({ playerId: 'x' }))).body.error, 'invalid playerId');
  assert.strictEqual((await a.submit(body({ playerId: 'a b c d e f g h' }))).body.error, 'invalid playerId');
  assert.strictEqual((await a.submit(body({ rounds: ['Nile'] }))).body.error, 'invalid rounds');
  assert.strictEqual((await a.submit(body({ rounds: answersFor(DAY).map(() => 7) }))).body.error, 'invalid rounds');
  assert.strictEqual((await a.submit(body({ rounds: answersFor(DAY).map(() => 'x'.repeat(200)) }))).body.error, 'invalid rounds');
  assert.strictEqual((await a.submit(body({ draw: 7 }))).body.error, 'invalid draw');
});

test('a stale client (draw fingerprint mismatch) is told to refresh', async () => {
  const { api: a } = api();
  const res = await a.submit(body({ draw: 'deadbeef' }));
  assert.strictEqual(res.status, 409);
  assert.strictEqual(res.body.error, 'draw-mismatch');
  assert.strictEqual(res.body.draw, a.drawFor(DAY));
  assert.strictEqual((await a.submit(body({ draw: a.drawFor(DAY) }))).status, 200);
});

test('a day takes submissions from the day before it starts until two days after, then closes', async () => {
  const { api: a } = api();
  assert.strictEqual(a.isOpen('2026-09-12'), true); // yesterday: UTC+14 finished it hours ago
  assert.strictEqual(a.isOpen('2026-09-11'), true); // two days back: still open for late players
  assert.strictEqual(a.isOpen('2026-09-10'), false);
  assert.strictEqual(a.isOpen('2026-09-14'), true); // tomorrow: already today in UTC+12
  assert.strictEqual(a.isOpen('2026-09-15'), false);
  const late = await a.submit(body({ day: '2026-09-10', rounds: answersFor('2026-09-10') }));
  assert.strictEqual(late.status, 409);
  assert.strictEqual(late.body.error, 'closed');
});

test('stats: the aggregate plus the day’s prompts; an unplayed day is a count of zero', async () => {
  const { api: a } = api();
  const empty = await a.stats(DAY);
  assert.strictEqual(empty.status, 200);
  assert.strictEqual(empty.body.count, 0);
  assert.strictEqual(empty.body.prompts.length, rarity.ROUNDS_PER_RUN);
  assert.strictEqual(empty.body.number, 2);
  assert.strictEqual(empty.body.open, true);
  assert.strictEqual((await a.stats('nope')).status, 400);

  await a.submit(body());
  await a.submit(body({ playerId: 'player-0002', rounds: answersFor(DAY, { rarest: true }) }));
  await a.submit(body({ playerId: 'player-0003', rounds: answersFor(DAY, { misses: [1, 2, 3] }) }));
  const s = (await a.stats(DAY)).body;
  assert.strictEqual(s.count, 3);
  assert.strictEqual(Object.values(s.scoreHist).reduce((x, y) => x + y, 0), 3);
  assert.strictEqual(Object.values(s.rarityHist).reduce((x, y) => x + y, 0), 3);
  assert.strictEqual(s.rounds[0].missed, 1);
  assert.strictEqual(s.rounds[0].answered, 2);
  // The best answer to a round is the rarest anyone gave, with how many gave it.
  const best = s.rounds[3].best;
  assert.ok(best && best.name && best.rarity >= 0 && best.count >= 1);
  const rarest = runner.rarestFor(bank.promptFor(runner.createRun(bank, { mode: 'daily', dailyKey: DAY }).state.slots[3]));
  assert.strictEqual(best.name, rarest.name);
});

test('a lost aggregate write is retried against the new etag, and rebuild() recovers a day', async () => {
  const { api: a, store } = api();
  await a.submit(body());
  // Simulate a concurrent writer: bump the etag between the read and the write.
  const original = store.getWithEtag.bind(store);
  let interfered = false;
  store.getWithEtag = async (key) => {
    const item = await original(key);
    if (key.startsWith('days/') && !interfered && item) {
      interfered = true;
      await store.set(key, item.data, { onlyIfMatch: item.etag }); // someone else wrote first
    }
    return item;
  };
  const res = await a.submit(body({ playerId: 'player-0002' }));
  assert.strictEqual(res.body.aggregated, true);
  assert.strictEqual((await store.getWithEtag(`days/${DAY}`)).data.count, 2);

  // Lose the aggregate entirely; rebuild it from the submissions.
  store._map.delete(`days/${DAY}`);
  assert.strictEqual((await a.stats(DAY)).body.count, 0);
  const rebuilt = await a.rebuild(DAY);
  assert.strictEqual(rebuilt.body.count, 2);
  assert.strictEqual((await a.stats(DAY)).body.count, 2);
});

test('applySubmission and rebuildAggregate agree', () => {
  const sub = (score, mean, rounds, at) => ({ score, finalDepth: score / 10, averageRarity: mean, rounds, at });
  const rounds = (...rs) => rs.map((r) => (r === null ? null : { a: `p${r}`, r }));
  const subs = [
    sub(1000, 0.5, rounds(0.5, null, 1), '2026-09-13T01:00:00Z'),
    sub(2000, 0.6, rounds(0.9, 0.2, 1), '2026-09-13T02:00:00Z')
  ];
  const agg = daily.rebuildAggregate(DAY, 'abcdef01', 3, subs);
  assert.strictEqual(agg.count, 2);
  assert.deepStrictEqual(agg.scoreHist, { 10: 1, 20: 1 });
  assert.deepStrictEqual(agg.rarityHist, { 50: 1, 60: 1 });
  assert.deepStrictEqual(agg.rounds[2].best, { name: 'p1', rarity: 1, count: 2 });
  assert.strictEqual(agg.rounds[0].jackpots, 1);
  assert.strictEqual(agg.rounds[1].missed, 1);
  assert.strictEqual(agg.updatedAt, '2026-09-13T02:00:00Z');
});

test('replay accepts an entry by name when the player typed a longer spelling for a length prompt', () => {
  // The engine rejects the bare name on a long-name prompt...
  const direct = runner.createRun(bank, { rounds: 1 });
  direct.state.slots[0] = { category: 'mountain', letter: { kind: 'long' } };
  assert.strictEqual(direct.submit('Kilimanjaro').status, 'wrong-scope');
  // ...but the replay tries "Mount Kilimanjaro", which is what the player typed.
  const run = runner.createRun(bank, { rounds: 1 });
  run.state.slots[0] = { category: 'mountain', letter: { kind: 'long' } };
  const replayed = daily.replayRun(run, ['Kilimanjaro']);
  assert.strictEqual(replayed.ok, true);
  assert.strictEqual(replayed.summary.rounds[0].answer, 'Kilimanjaro');
  // A name with no accepted spelling at all still fails, naming the round.
  const nope = runner.createRun(bank, { rounds: 1 });
  nope.state.slots[0] = { category: 'mountain', letter: { kind: 'long' } };
  assert.deepStrictEqual(daily.replayRun(nope, ['Fuji']), { ok: false, round: 1, reason: 'wrong-scope' });
});
