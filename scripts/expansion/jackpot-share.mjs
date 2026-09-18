/**
 * The jackpot share per cohort - run after every fold.
 *
 *   node scripts/expansion/jackpot-share.mjs            # every cohort: n, lowest views, the jackpot line, jackpots, share
 *   node scripts/expansion/jackpot-share.mjs --list=sea_ocean   # ...and the jackpot rows of one cohort, rarest first
 *   node scripts/expansion/jackpot-share.mjs --ref=main         # the same at a git ref
 *
 * A row is a jackpot when rarity.rarityOf(views) >= JACKPOT_RARITY; the line is
 * the views figure that rarity sits at. The healthy band is 1.6-4% (HANDOFF,
 * "Views floors per cohort"). A flat band of rows at a views floor becomes the
 * cohort bottom the moment the lone row below it goes, and every row on the
 * band is then a jackpot (the islands' 91 band, the seas' 183 band) - so look
 * at the lowest few rows too.
 */
import { loadStack } from './stack.mjs';

const arg = (k) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : null; };
const stack = loadStack(arg('ref') || undefined);
const { bank, rarity } = stack;
const list = arg('list');
for (const [category, cohort] of bank.cohorts) {
  const st = cohort.stats;
  const line = Math.pow(10, st.lmax - rarity.JACKPOT_RARITY * (st.lmax - st.lmin));
  const jack = cohort.entries.filter((e) => rarity.rarityOf(e.magnitude, st) >= rarity.JACKPOT_RARITY);
  const lowest = [...cohort.entries].sort((a, b) => a.magnitude - b.magnitude).slice(0, 3).map((e) => `${e.name} ${e.magnitude}`).join(', ');
  console.log(`${category.padEnd(10)} n ${String(cohort.entries.length).padStart(5)}  jackpot line ${line.toFixed(1).padStart(8)} views  jackpots ${String(jack.length).padStart(3)} (${(100 * jack.length / cohort.entries.length).toFixed(2)}%)  lowest: ${lowest}`);
  if (list === category) {
    for (const e of jack.sort((a, b) => a.magnitude - b.magnitude)) console.log(`    ${e.name} ${e.magnitude} views${e.size > 0 ? '' : ' (size 0)'}`);
  }
}
