/**
 * Apply title fixes to scripts/data-wiki-titles.mjs:
 *   node fix-titles.mjs fixes.json
 * fixes.json = { "titles": { "id": "Exact Title", ... }, "verified": ["id", ...], "note": "why" }
 * - titles: sets or REPLACES the WIKI_TITLES entry for each id
 * - verified: appends ids to WIKI_VERIFIED (skipping ones already there)
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const REPO = fileURLToPath(new URL('../../', import.meta.url));
const path = REPO + 'scripts/data-wiki-titles.mjs';
const fixes = JSON.parse(await readFile(process.argv[2], 'utf8'));
let text = await readFile(path, 'utf8');
const EOL = text.includes('\r\n') ? '\r\n' : '\n';
const note = fixes.note || '2026-09-14 expansion';

// --- WIKI_TITLES ---
const tStart = text.indexOf('export const WIKI_TITLES = {');
const tClose = text.indexOf(`${EOL}};`, tStart);
let block = text.slice(tStart, tClose);
const additions = [];
for (const [id, title] of Object.entries(fixes.titles || {})) {
  const re = new RegExp(`^(\\s*)(['"])${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\2:\\s*(?:'(?:[^'\\\\]|\\\\.)*'|"(?:[^"\\\\]|\\\\.)*")(,?)(.*)$`, 'm');
  const m = block.match(re);
  if (m) block = block.replace(re, `$1${JSON.stringify(id)}: ${JSON.stringify(title)}$3$4`);
  else additions.push(`  ${JSON.stringify(id)}: ${JSON.stringify(title)},`);
}
if (additions.length) {
  const trimmed = block.trimEnd();
  block = (trimmed.endsWith(',') || trimmed.endsWith('{') ? trimmed : trimmed + ',') + EOL + `  // --- ${note} ---` + EOL + additions.join(EOL).replace(/,$/, '');
}
text = text.slice(0, tStart) + block + text.slice(tClose);

// --- WIKI_VERIFIED ---
const vStart = text.indexOf('export const WIKI_VERIFIED = new Set([');
const vClose = text.indexOf(`${EOL}]);`, vStart);
let vblock = text.slice(vStart, vClose);
const missing = (fixes.verified || []).filter((id) => !new RegExp(`['"]${id}['"]`).test(vblock));
if (missing.length) {
  // the last element may carry a trailing "// comment": put the comma before it
  vblock = vblock.replace(/(['"])(\s*\/\/[^\r\n]*)?\s*$/, (m, quote, comment) => `${quote},${comment || ''}`);
  vblock = vblock.trimEnd() + EOL + `  // --- ${note} ---` + EOL +
    missing.map((id) => `  ${JSON.stringify(id)},`).join(EOL).replace(/,$/, '');
}
text = text.slice(0, vStart) + vblock + text.slice(vClose);
await writeFile(path, text, 'utf8');
console.log(`titles set: ${Object.keys(fixes.titles || {}).length} (${additions.length} new), verified added: ${missing.length}`);
