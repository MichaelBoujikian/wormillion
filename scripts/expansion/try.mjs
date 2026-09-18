/**
 * Type names at the real engine and see what a player would get.
 *
 *   node scripts/expansion/try.mjs '{"category":"capital","region":"Oceania"}' Auckland Honolulu Wellington
 *   node scripts/expansion/try.mjs city "Saint Ouen sur Seine" Croydon Syracuse
 *   node scripts/expansion/try.mjs --ref=main '{"category":"river","theme":"Europe"}' Thames Rhein
 *
 * The first argument is a slot (JSON, or just a category); the rest are typed
 * answers. Slot shapes: {category}, {category, region}, {category, theme},
 * {category, ocean}, {category, flag:{colours:[...]}}, {category, size:{op,value}},
 * {category, letter:{kind,letter}} (the letter lowercase). Each answer is judged fresh (no duplicate
 * rule between them). --ref=<git-ref> judges with the engine and bank at that ref.
 */
import { loadStack, judgeFor, outcome } from './stack.mjs';

const args = process.argv.slice(2);
const refArg = args.find((a) => a.startsWith('--ref='));
const rest = args.filter((a) => !a.startsWith('--'));
if (rest.length < 2) { console.error('usage: try.mjs [--ref=<git-ref>] <slot-json|category> <answer> [...]'); process.exit(1); }
const slot = rest[0].startsWith('{') ? JSON.parse(rest[0]) : { category: rest[0] };
const stack = loadStack(refArg ? refArg.slice(6) : undefined);
const prompt = stack.bank.promptFor(slot);
console.log(`${prompt.text}   (${stack.ref})`);
const judge = judgeFor(stack, slot);
for (const answer of rest.slice(1)) {
  const r = judge(answer);
  const views = r.entry ? `  ${r.entry.magnitude} views/mo` : '';
  const pts = r.status === 'accepted' && r.rarity != null ? `  ${(100 * r.rarity).toFixed(1)}% obscure` : '';
  console.log(`  ${answer.padEnd(28)} ${outcome(r)}${views}${pts}`);
}
