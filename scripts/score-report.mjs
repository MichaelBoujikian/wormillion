/**
 * Prints what the current bank does to the scoring curve: per-cohort pageview
 * spread, the points a median answer earns, and the extremes at each end.
 *
 * A balance tool, not a test — run it after refreshing pageviews to see whether
 * the constants in Spec 3.10 still feel right.
 *
 *   node scripts/score-report.mjs
 */
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { loadDataFiles } from './validate-data.mjs';

const require = createRequire(import.meta.url);
const rarity = require('../src/js/rarity.js');

const files = await loadDataFiles();
const cohorts = new Map();
for (const entries of Object.values(files)) {
  for (const entry of entries) {
    if (!cohorts.has(entry.category)) cohorts.set(entry.category, []);
    cohorts.get(entry.category).push(entry);
  }
}

const pad = (s, n) => String(s).padEnd(n);
const num = (n) => n.toLocaleString('en-US');

console.log(pad('cohort', 11), pad('n', 5), pad('views: min .. max', 26), pad('points: p10 med p90', 22), 'deepest answers');
console.log('-'.repeat(115));

let allPoints = [];
let allDigs = [];
let jackpots = 0;
for (const [category, entries] of [...cohorts].sort()) {
  const stats = rarity.cohortStats(entries);
  const scored = entries
    .map((e) => ({ name: e.name, views: e.magnitude, ...rarity.scoreEntry(e, stats) }))
    .sort((a, b) => a.points - b.points);
  const points = scored.map((s) => s.points);
  allPoints = allPoints.concat(points);
  allDigs = allDigs.concat(scored.map((s) => s.dig));
  jackpots += scored.filter((s) => rarity.isJackpot(s.rarity)).length;
  const at = (q) => points[Math.floor((points.length - 1) * q)];
  const views = scored.map((s) => s.views).sort((a, b) => a - b);

  console.log(
    pad(category, 11),
    pad(entries.length, 5),
    pad(`${num(views[0])} .. ${num(views[views.length - 1])}`, 26),
    pad(`${at(0.1)}  ${at(0.5)}  ${at(0.9)}`, 22),
    scored.slice(-3).reverse().map((s) => `${s.name} (${s.points})`).join(', ')
  );
}

allPoints.sort((a, b) => a - b);
allDigs.sort((a, b) => a - b);
const mean = Math.round(allPoints.reduce((a, b) => a + b, 0) / allPoints.length);
const meanDig = allDigs.reduce((a, b) => a + b, 0) / allDigs.length;
const medianDig = allDigs[Math.floor(allDigs.length / 2)];
console.log('-'.repeat(115));
console.log(`whole bank: mean ${mean} pts, median ${allPoints[Math.floor(allPoints.length / 2)]} pts; mean dig ${meanDig.toFixed(1)}, median dig ${medianDig.toFixed(1)}`);
console.log(
  `a 15-round run of median answers scores about ${num(mean * 15)} and ends around depth ${(medianDig * 15).toFixed(0)} ` +
    `(${rarity.stratumName(medianDig * 15)}); ${jackpots} of ${allDigs.length} entries are one in Wormillion (dig ${rarity.DIG_JACKPOT}+)`
);
