/**
 * Load a game stack (engine + bank) the way netlify/functions/lib/daily.js does,
 * from the working tree or from any git ref:
 *
 *   import { loadStack } from './stack.mjs';
 *   const now = loadStack();                 // src/js + src/data of the working tree
 *   const live = loadStack('main');          // the engine AND the bank at that ref (git archive into a temp dir)
 *
 * Returns { bank, promptBank, run, matching, rarity, seed, root, ref }. The audits of
 * 2026-09-16/17 used a scratchpad copy of this; it is in the repo so the next
 * session can measure "old vs new" without rebuilding it.
 */
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(import.meta.url);

/** Extract src/js and src/data at a git ref into a temp dir (cached per ref+commit). */
export function checkoutStack(ref) {
  const sha = execSync(`git rev-parse --short ${ref}`, { cwd: REPO }).toString().trim();
  const dir = path.join(tmpdir(), 'wormillion-stack', sha);
  if (!existsSync(path.join(dir, 'src', 'data', 'bank.js'))) {
    // file by file with git show: portable across the Windows shells (tar and
    // backslashed temp paths do not mix)
    const files = execSync(`git ls-tree -r --name-only ${ref} src/js src/data`, { cwd: REPO }).toString().split(/\r?\n/).filter(Boolean);
    for (const file of files) {
      const target = path.join(dir, file);
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, execSync(`git show ${ref}:${file}`, { cwd: REPO, maxBuffer: 64 * 1024 * 1024 }));
    }
  }
  return dir;
}

export function loadStack(ref) {
  const root = ref ? checkoutStack(ref) : REPO;
  const engine = (name) => require(path.join(root, 'src', 'js', name));
  const promptBank = engine('promptBank.js');
  const run = engine('run.js');
  const matching = engine('matching.js');
  const rarity = engine('rarity.js');
  const seed = engine('seed.js');
  const scope = {};
  for (const file of ['bank.js', 'themes.js']) new Function('globalThis', readFileSync(path.join(root, 'src', 'data', file), 'utf8'))(scope);
  const bank = promptBank.createBank(scope.WORMILLION_BANK, scope.WORMILLION_THEMES, scope.WORMILLION_THEME_PROMPTS);
  return { bank, promptBank, run, matching, rarity, seed, root, ref: ref || 'working tree' };
}

/** A one-round judge for a slot: judge(input) -> the engine's submit result, fresh each time. */
export function judgeFor(stack, slot) {
  const r = stack.run.createRun(stack.bank, { mode: 'endless', rng: () => 0.5 });
  r.state.slots[0] = slot;
  return (input) => {
    r.state.index = 0; r.state.finished = false; r.state.usedAnswers.clear(); r.state.results.length = 0; r.state.score = 0; r.state.depth = 0;
    return r.submit(input);
  };
}

/** One line for a submit result: accepted:id (corrected) | wrong-scope:id | elsewhere:category:id | unrecognized | duplicate:id */
export function outcome(res) {
  if (!res) return 'null';
  switch (res.status) {
    case 'accepted': return `accepted:${res.entry.id}${res.correctedFrom ? ' (corrected)' : ''}`;
    case 'wrong-scope': return `wrong-scope:${res.entry.id}${res.length ? ' (length)' : ''}`;
    case 'unrecognized': return res.elsewhere ? `elsewhere:${res.elsewhere.category}:${res.elsewhere.entry.id}` : (res.tie ? 'unrecognized (tie)' : 'unrecognized');
    case 'duplicate': return `duplicate:${res.entry.id}`;
    default: return res.status;
  }
}
