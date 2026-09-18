/**
 * Which dailies change between two stacks - the merge-window question.
 *
 *   node scripts/expansion/draw-diff.mjs main                 # working tree vs the engine+bank at main, the next 46 days from today (UTC)
 *   node scripts/expansion/draw-diff.mjs v1.3-europe-wave --from=2026-10-01 --days=30
 *
 * Prints each day whose 15 prompt texts differ, with the round numbers. The
 * daily draw depends on the bank (eligible counts, share bars) and on the
 * engine, and the Netlify function computes the comparison from ITS bank, so
 * GitHub Pages and Netlify must switch on the same day, inside a run of days
 * that draw identically on both (HANDOFF, "The release, as audited").
 */
import { loadStack } from './stack.mjs';

const ref = process.argv[2];
if (!ref || ref.startsWith('--')) { console.error('usage: draw-diff.mjs <git-ref> [--from=YYYY-MM-DD] [--days=46]'); process.exit(1); }
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const days = Number(arg('days', 46));
const from = arg('from', new Date().toISOString().slice(0, 10));
const old = loadStack(ref);
const now = loadStack();
const texts = (stack, key) => stack.run.createRun(stack.bank, { mode: 'daily', dailyKey: key }).state.slots.map((s) => stack.bank.promptFor(s).text);
const d0 = new Date(`${from}T00:00:00Z`);
let changed = 0;
for (let i = 0; i < days; i++) {
  const key = new Date(d0.getTime() + i * 86400000).toISOString().slice(0, 10);
  const a = texts(old, key); const b = texts(now, key);
  const diff = a.map((t, j) => (t === b[j] ? null : j + 1)).filter(Boolean);
  if (diff.length) { changed++; console.log(`${key}  rounds ${diff.join(',')} differ`); for (const j of diff) console.log(`    r${j}: ${a[j - 1]}  ->  ${b[j - 1]}`); }
}
console.log(`${changed} of ${days} days from ${from} draw differently (${old.ref} vs ${now.ref})`);
