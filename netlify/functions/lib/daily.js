/**
 * The daily comparison, server side (Spec 3.17). Pure: no Netlify, no HTTP.
 * The two functions in ../ wrap this around Netlify Blobs; the tests and the
 * dev server wrap it around an in-memory store.
 *
 * A player submits ONLY their fifteen answers. The server has the bank and
 * the seed, so it regenerates that day's prompts, replays the answers
 * through the real engine (scopes, duplicates, length rules - everything)
 * and computes the score itself. A forged score is therefore impossible
 * without fifteen genuinely obscure answers, which is not forging.
 *
 * Storage (a key-value store with conditional writes):
 *   submissions/<day>/<playerId>   one per player per day, written onlyIfNew
 *   days/<day>                     the aggregate the stats endpoint serves,
 *                                  updated with onlyIfMatch + retry; rebuilt
 *                                  from the submissions if it is ever lost
 *
 * Store interface (see memoryStore for the reference implementation):
 *   getWithEtag(key)            -> { data, etag } | null
 *   set(key, data, opts)        -> { modified }   opts: { onlyIfNew } | { onlyIfMatch: etag }
 *   list(prefix)                -> string[] keys
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const promptBank = require('../../../src/js/promptBank.js');
const runner = require('../../../src/js/run.js');
const rarity = require('../../../src/js/rarity.js');
const seed = require('../../../src/js/seed.js');

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const PLAYER_RE = /^[A-Za-z0-9_-]{8,64}$/;
const ANSWER_MAX = 80;
// A day takes submissions from a day before it starts anywhere (UTC-12 is
// behind) until two days after (late players, UTC+14), then closes.
const OPEN_BEFORE = 1;
const OPEN_AFTER = 2;
const AGGREGATE_ATTEMPTS = 4;
const SCORE_BUCKET = 100;

/** The shipped bank, loaded the way the page loads it: bank.js + themes.js as scripts. */
function loadBank(root) {
  const base = root || findRoot();
  const scope = {};
  for (const file of ['bank.js', 'themes.js']) {
    const source = fs.readFileSync(path.join(base, 'src', 'data', file), 'utf8');
    new Function('globalThis', source)(scope);
  }
  return promptBank.createBank(scope.WORMILLION_BANK, scope.WORMILLION_THEMES, scope.WORMILLION_THEME_PROMPTS);
}

/** Where src/data lives: the repo root in dev and tests, the function's task root on Netlify. */
function findRoot() {
  const candidates = [path.resolve(__dirname, '..', '..', '..'), process.cwd(), '/var/task'];
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'src', 'data', 'bank.js'))) return candidate;
  }
  throw new Error('daily: cannot find src/data/bank.js');
}

/** Today's key in UTC - the server's own clock, for the open/closed window. */
function utcDay(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

const scoreBucket = (score) => Math.floor(score / SCORE_BUCKET);
const rarityBucket = (mean) => Math.round(mean * 100);
const round4 = (n) => Math.round(n * 10000) / 10000;

/** An aggregate with nothing in it yet. */
function emptyAggregate(day, draw, roundCount) {
  return {
    day,
    number: seed.dailyNumber(day),
    draw,
    count: 0,
    scoreSum: 0,
    depthSum: 0,
    raritySum: 0,
    scoreHist: {},
    rarityHist: {},
    rounds: Array.from({ length: roundCount }, () => ({
      answered: 0,
      missed: 0,
      raritySum: 0,
      jackpots: 0,
      duds: 0,
      best: null
    })),
    updatedAt: null
  };
}

/** Fold one stored submission into an aggregate (in place; returns it). */
function applySubmission(agg, sub, at) {
  agg.count += 1;
  agg.scoreSum += sub.score;
  agg.depthSum += sub.finalDepth;
  agg.raritySum += sub.averageRarity;
  const sb = scoreBucket(sub.score);
  agg.scoreHist[sb] = (agg.scoreHist[sb] || 0) + 1;
  const rb = rarityBucket(sub.averageRarity);
  agg.rarityHist[rb] = (agg.rarityHist[rb] || 0) + 1;
  sub.rounds.forEach((round, i) => {
    const slot = agg.rounds[i];
    if (!slot) return;
    if (!round) {
      slot.missed += 1;
      return;
    }
    slot.answered += 1;
    slot.raritySum += round.r;
    if (rarity.isJackpot(round.r)) slot.jackpots += 1;
    if (rarity.isDud(round.r)) slot.duds += 1;
    if (!slot.best || round.r > slot.best.rarity) slot.best = { name: round.a, rarity: round.r, count: 1 };
    else if (round.r === slot.best.rarity && round.a === slot.best.name) slot.best.count += 1;
  });
  agg.updatedAt = at || new Date().toISOString();
  return agg;
}

/**
 * Play `answers` through a fresh run. Every non-null answer must be accepted
 * by its round; a null is a timeout. The client stores the entry's NAME, but
 * a length prompt judges the spelling typed - "Kilimanjaro" was accepted as
 * "Mount Kilimanjaro" - so when the only objection is this spelling's length
 * the entry's other spellings are tried, since one of them is what was typed.
 * @returns {{ok:true, summary}|{ok:false, round:number, reason:string}}
 */
function replayRun(run, answers) {
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    if (answer === null) {
      run.timeout();
      continue;
    }
    let result = run.submit(answer);
    if (result.status === 'wrong-scope' && result.length && result.entry) {
      for (const alias of result.entry.aliases || []) {
        result = run.submit(alias);
        if (result.status === 'accepted') break;
      }
    }
    if (result.status !== 'accepted') return { ok: false, round: i + 1, reason: result.status };
  }
  return { ok: true, summary: run.summary() };
}

/** The aggregate for a day from scratch, from every stored submission. */
function rebuildAggregate(day, draw, roundCount, submissions) {
  const agg = emptyAggregate(day, draw, roundCount);
  for (const sub of submissions) applySubmission(agg, sub, sub.at);
  return agg;
}

/**
 * @param {object} deps  { store, bank, now? }  now: () => Date, for tests
 */
function createDailyApi({ store, bank, now = () => new Date() }) {
  const roundCount = rarity.ROUNDS_PER_RUN;
  const slotsFor = (day) => runner.createRun(bank, { mode: 'daily', dailyKey: day }).state.slots;
  const drawFor = (day) => runner.drawId(bank, slotsFor(day));
  const promptsFor = (day) => slotsFor(day).map((slot) => bank.promptFor(slot).text);

  const bad = (status, error, extra) => ({ status, body: { error, ...extra } });

  /** Is `day` accepting submissions right now? */
  function isOpen(day) {
    const gap = seed.daysBetween(day, utcDay(now())); // positive when the day is past
    return gap >= -OPEN_BEFORE && gap <= OPEN_AFTER;
  }

  /**
   * Replay fifteen answers through the engine for `day`. Every non-null
   * answer must be accepted by its round; a null is a timeout.
   * @returns {{ok:true, summary}|{ok:false, round:number, reason:string}}
   */
  function replay(day, answers) {
    return replayRun(runner.createRun(bank, { mode: 'daily', dailyKey: day }), answers);
  }

  /** Validate the request body's shape; the engine judges the answers. */
  function validate(body) {
    if (!body || typeof body !== 'object') return 'body';
    if (typeof body.day !== 'string' || !DAY_RE.test(body.day)) return 'day';
    if (typeof body.playerId !== 'string' || !PLAYER_RE.test(body.playerId)) return 'playerId';
    if (!Array.isArray(body.rounds) || body.rounds.length !== roundCount) return 'rounds';
    for (const r of body.rounds) {
      if (r === null) continue;
      if (typeof r !== 'string' || r.trim() === '' || r.length > ANSWER_MAX) return 'rounds';
    }
    if (body.draw !== undefined && typeof body.draw !== 'string') return 'draw';
    return null;
  }

  /**
   * POST: { day, playerId, rounds: (string|null)[15], draw? }
   * 200 { ok, duplicate?, score, finalDepth, averageRarity, aggregated }
   * 400 { error }   409 { error: 'draw-mismatch' | 'closed' }
   */
  async function submit(body) {
    const invalid = validate(body);
    if (invalid) return bad(400, `invalid ${invalid}`);
    const { day, playerId } = body;
    if (!isOpen(day)) return bad(409, 'closed', { day });
    const draw = drawFor(day);
    if (body.draw && body.draw !== draw) return bad(409, 'draw-mismatch', { draw });

    const played = replay(day, body.rounds);
    if (!played.ok) return bad(400, `round ${played.round}: ${played.reason}`);
    const { summary } = played;
    const rounds = summary.rounds.map((r) => (r.status === 'accepted' ? { a: r.answer, r: round4(r.rarity) } : null));
    const averageRarity = round4(rounds.reduce((sum, r) => sum + (r ? r.r : 0), 0) / rounds.length);
    const at = now().toISOString();
    const submission = {
      playerId,
      day,
      score: summary.score,
      finalDepth: Math.round(summary.finalDepth * 10) / 10,
      deepestStratum: summary.deepestStratum,
      rounds,
      averageRarity,
      at
    };

    const wrote = await store.set(`submissions/${day}/${playerId}`, submission, { onlyIfNew: true });
    const result = {
      ok: true,
      score: submission.score,
      finalDepth: submission.finalDepth,
      deepestStratum: submission.deepestStratum,
      averageRarity,
      draw
    };
    if (!wrote.modified) return { status: 200, body: { ...result, duplicate: true, aggregated: false } };

    // Fold into the day's aggregate; a concurrent write just means one more go.
    let aggregated = false;
    for (let attempt = 0; attempt < AGGREGATE_ATTEMPTS && !aggregated; attempt++) {
      const current = await store.getWithEtag(`days/${day}`);
      const agg = current ? current.data : emptyAggregate(day, draw, roundCount);
      applySubmission(agg, submission, at);
      const opts = current ? { onlyIfMatch: current.etag } : { onlyIfNew: true };
      aggregated = (await store.set(`days/${day}`, agg, opts)).modified;
    }
    return { status: 200, body: { ...result, aggregated } };
  }

  /**
   * GET ?day=YYYY-MM-DD
   * 200 the aggregate plus the day's prompts (count may be 0)
   * 400 { error }
   */
  async function stats(day) {
    if (typeof day !== 'string' || !DAY_RE.test(day)) return bad(400, 'invalid day');
    const draw = drawFor(day);
    const current = await store.getWithEtag(`days/${day}`);
    const agg = current ? current.data : emptyAggregate(day, draw, roundCount);
    return { status: 200, body: { ...agg, prompts: promptsFor(day), open: isOpen(day) } };
  }

  /** Rebuild a day's aggregate from its submissions and store it (a repair tool). */
  async function rebuild(day) {
    if (typeof day !== 'string' || !DAY_RE.test(day)) return bad(400, 'invalid day');
    const keys = await store.list(`submissions/${day}/`);
    const submissions = [];
    for (const key of keys) {
      const item = await store.getWithEtag(key);
      if (item && item.data) submissions.push(item.data);
    }
    const agg = rebuildAggregate(day, drawFor(day), roundCount, submissions);
    const current = await store.getWithEtag(`days/${day}`);
    await store.set(`days/${day}`, agg, current ? { onlyIfMatch: current.etag } : { onlyIfNew: true });
    return { status: 200, body: agg };
  }

  return { submit, stats, rebuild, replay, drawFor, promptsFor, isOpen };
}

/** An in-memory store with the same conditional-write contract as Netlify Blobs. */
function memoryStore() {
  const map = new Map(); // key -> { data, etag }
  let counter = 0;
  return {
    async getWithEtag(key) {
      const item = map.get(key);
      return item ? { data: JSON.parse(JSON.stringify(item.data)), etag: item.etag } : null;
    },
    async set(key, data, opts = {}) {
      const item = map.get(key);
      if (opts.onlyIfNew && item) return { modified: false };
      if (opts.onlyIfMatch !== undefined && (!item || item.etag !== opts.onlyIfMatch)) return { modified: false };
      const etag = `"${++counter}"`;
      map.set(key, { data: JSON.parse(JSON.stringify(data)), etag });
      return { modified: true, etag };
    },
    async list(prefix) {
      return [...map.keys()].filter((k) => k.startsWith(prefix)).sort();
    },
    // for tests
    _map: map
  };
}

module.exports = {
  DAY_RE,
  PLAYER_RE,
  OPEN_BEFORE,
  OPEN_AFTER,
  SCORE_BUCKET,
  loadBank,
  findRoot,
  utcDay,
  scoreBucket,
  rarityBucket,
  emptyAggregate,
  applySubmission,
  replayRun,
  rebuildAggregate,
  createDailyApi,
  memoryStore
};
