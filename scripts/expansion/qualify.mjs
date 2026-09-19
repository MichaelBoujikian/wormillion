/**
 * Give existing bank rows a qualifier (decision 5): the incumbent Portland
 * becomes "Portland (Oregon)" before "Portland (Maine)" is folded next to it.
 *
 *   node scripts/expansion/qualify.mjs work/qualify-<tag>.txt          dry run
 *   node scripts/expansion/qualify.mjs work/qualify-<tag>.txt --write
 *
 * One row per line:  id|qualifier[|new bare name]
 *   city-portland|Oregon               -> Portland (Oregon), id city-portland-oregon
 *   river-tana-river-kenya|Kenya|Tana  -> Tana (Kenya), id river-tana-kenya (the
 *                                         name goes bare so it is the namesake of Tana)
 *   river-scamander-karamenderes||Scamander  -> an empty qualifier drops one (the
 *                                         old one becomes an alias when --alias is given)
 *   anything after a # is a note (chunk.mjs --taken-only writes the article title there)
 *
 * The id carries the qualifier (build-data.mjs idFor), so everything keyed by
 * the old id moves with it: WIKI_TITLES and WIKI_VERIFIED, OCEAN_OVERRIDES,
 * src/data/pageviews.json (no refetch), and the name in src/data/themes.js
 * becomes "Name (Qualifier)". A row that had no WIKI_TITLES line gets one
 * naming the article it scored on, since its bare name no longer finds it.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const REPO = fileURLToPath(new URL('../../', import.meta.url));
const WRITE = process.argv.includes('--write');
const ALIAS = process.argv.includes('--alias');
const src = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!src) { console.error('usage: qualify.mjs <rows.txt> [--write] [--alias]'); process.exit(1); }

const { buildFiles, splitQualifier, idFor } = await import(new URL('../build-data.mjs?t=' + Date.now(), import.meta.url).href);
const { WIKI_TITLES } = await import(new URL('../data-wiki-titles.mjs?t=' + Date.now(), import.meta.url).href);
const byId = new Map(Object.values(buildFiles()).flat().map((e) => [e.id, e]));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rawNameOf = (e) => (e.qualifier ? `${e.name} (${e.qualifier})` : e.name);
/** Fold to plain ASCII the way the bank's names are written (fold.mjs does the same for a new row). */
const ascii = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ø/g, 'o').replace(/Ø/g, 'O').replace(/æ/g, 'ae').replace(/Æ/g, 'Ae').replace(/œ/g, 'oe').replace(/Œ/g, 'Oe')
    .replace(/ł/g, 'l').replace(/Ł/g, 'L').replace(/ß/g, 'ss').replace(/[đð]/g, 'd').replace(/[ĐÐ]/g, 'D').replace(/þ/g, 'th').replace(/Þ/g, 'Th')
    .replace(/[ı]/g, 'i').replace(/[‘’ʼ]/g, "'").replace(/[–—]/g, '-').trim();

const files = {
  physical: REPO + 'scripts/data-physical.mjs',
  cities: REPO + 'scripts/data-cities.mjs',
  titles: REPO + 'scripts/data-wiki-titles.mjs',
  oceans: REPO + 'scripts/data-oceans.mjs',
  themes: REPO + 'src/data/themes.js',
  pageviews: REPO + 'src/data/pageviews.json'
};
const text = {};
for (const [k, p] of Object.entries(files)) text[k] = await readFile(p, 'utf8');
const pageviews = JSON.parse(text.pageviews);
const eolOf = (t) => (t.includes('\r\n') ? '\r\n' : '\n');

// a trailing "# ..." on a line is a note for the hand pass (chunk.mjs writes the incumbent's article title there)
const rows = (await readFile(src, 'utf8')).split(/\r?\n/).map((l) => l.replace(/\s*#.*$/, '').trim()).filter(Boolean);
let done = 0;
const renames = [];
for (const line of rows) {
  const [id, qualifierRaw, newNameRaw] = line.split('|').map((s) => (s || '').trim());
  const e = byId.get(id);
  if (!e) { console.log(`?? ${id}: not in the bank`); continue; }
  const qualifier = qualifierRaw ? ascii(qualifierRaw) : null;
  const name = newNameRaw ? ascii(newNameRaw) : e.name;
  if (/[()|]/.test(name) || /[()|]/.test(qualifier || '')) { console.log(`?? ${id}: no parentheses or pipes in a name or qualifier`); continue; }
  const newId = idFor(e.category, name, qualifier);
  const newRaw = qualifier ? `${name} (${qualifier})` : name;
  if (newId !== id && byId.has(newId)) { console.log(`?? ${id}: ${newId} already exists`); continue; }
  if (newRaw === rawNameOf(e)) { console.log(`-- ${id}: already "${newRaw}"`); continue; }

  // the data row: within the entry's own block, "OldRaw|..." -> "NewRaw|..."
  const rowFile = e.category === 'city' ? 'cities' : 'physical';
  const BLOCK = { lake: 'LAKES', river: 'RIVERS', mountain: null, desert: 'DESERTS', island: 'ISLANDS', sea_ocean: 'SEAS_OCEANS', city: 'CITIES' }[e.category];
  let from = 0;
  let to = text[rowFile].length;
  const rowRe = new RegExp(`^${esc(rawNameOf(e))}\\|`, 'm');
  // a mountain lives in MOUNTAINS or MINOR_PEAKS: take the block that has the
  // row (searching the whole file once renamed a river called Tara for a
  // mountain called Tara, 2026-09-18)
  for (const b of BLOCK ? [BLOCK] : ['MOUNTAINS', 'MINOR_PEAKS']) {
    const f = text[rowFile].indexOf(`export const ${b} = \``);
    const t = text[rowFile].indexOf('`;', f);
    if (f >= 0 && rowRe.test(text[rowFile].slice(f, t))) { from = f; to = t; break; }
  }
  const block = text[rowFile].slice(from, to);
  if (!rowRe.test(block)) { console.log(`?? ${id}: row "${rawNameOf(e)}|" not found in ${rowFile}`); continue; }
  let newBlock = block.replace(rowRe, `${newRaw}|`);
  // an old qualifier that was really an alternate name ("Scamander (Karamenderes)") keeps typing
  if (ALIAS && e.qualifier && !qualifier) {
    const cols = new RegExp(`^${esc(newRaw)}\\|([^|\\r\\n]*)\\|?([^\\r\\n]*)`, 'm');
    newBlock = newBlock.replace(cols, (m, size, aliases) => `${newRaw}|${size}|${[...(aliases ? aliases.split(',') : []), e.qualifier].filter(Boolean).join(',')}`);
  }
  text[rowFile] = text[rowFile].slice(0, from) + newBlock + text[rowFile].slice(to);

  if (newId !== id) {
    // every file keyed by id
    const idRe = new RegExp(`(['"])${esc(id)}\\1`, 'g');
    text.titles = text.titles.replace(idRe, `$1${newId}$1`);
    text.oceans = text.oceans.replace(idRe, `$1${newId}$1`);
    if (pageviews.entries[id]) { pageviews.entries[newId] = pageviews.entries[id]; delete pageviews.entries[id]; }
    renames.push([id, newId]);
  }
  // a namesake's bare name is not its article: name the article it scored on
  if (qualifier && !(id in WIKI_TITLES)) {
    const title = (pageviews.entries[newId] && pageviews.entries[newId].title) || rawNameOf(e);
    const EOL = eolOf(text.titles);
    const close = text.titles.indexOf(`${EOL}};`, text.titles.indexOf('export const WIKI_TITLES = {'));
    let head = text.titles.slice(0, close);
    if (!head.trimEnd().endsWith(',') && !head.trimEnd().endsWith('{')) head = head.trimEnd() + ',';
    text.titles = head + `${EOL}  ${JSON.stringify(newId)}: ${JSON.stringify(title)}` + text.titles.slice(close);
  }
  // themes list the display name; the category block only
  const catStart = text.themes.indexOf(`\n  ${e.category}: {`);
  const catEnd = text.themes.indexOf('\n  },', catStart);
  if (catStart >= 0) {
    const q = (s) => (s.includes("'") ? JSON.stringify(s) : `'${s}'`);
    const oldQ = q(rawNameOf(e));
    const block = text.themes.slice(catStart, catEnd).split(oldQ).join(q(newRaw));
    text.themes = text.themes.slice(0, catStart) + block + text.themes.slice(catEnd);
  }
  console.log(`${id} -> ${newId}: "${rawNameOf(e)}" -> "${newRaw}"`);
  byId.delete(id);
  byId.set(newId, { ...e, id: newId, name, qualifier });
  done++;
}
console.log(`\n${done} row(s) qualified, ${renames.length} id(s) renamed`);
if (!WRITE) { console.log('(dry run; pass --write to apply)'); process.exit(0); }
text.pageviews = JSON.stringify(pageviews, null, 1) + '\n';
for (const [k, p] of Object.entries(files)) await writeFile(p, text[k], 'utf8');
console.log('written');
