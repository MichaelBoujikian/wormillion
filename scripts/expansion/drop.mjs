/**
 * Remove entries from the authoring sources: node drop.mjs <id> <id> ...
 * Deletes the row from data-physical.mjs / data-cities.mjs, its WIKI_TITLES /
 * WIKI_VERIFIED lines, its OCEAN_OVERRIDES line, and its name from themes.js.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const REPO = fileURLToPath(new URL('../../', import.meta.url));
const ids = process.argv.slice(2);
const { buildFiles } = await import(new URL('../build-data.mjs?t=' + Date.now(), import.meta.url).href);
const byId = new Map(Object.values(buildFiles()).flat().map((e) => [e.id, e]));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const files = {
  physical: REPO + 'scripts/data-physical.mjs',
  cities: REPO + 'scripts/data-cities.mjs',
  titles: REPO + 'scripts/data-wiki-titles.mjs',
  oceans: REPO + 'scripts/data-oceans.mjs',
  themes: REPO + 'src/data/themes.js'
};
const text = {};
for (const [k, p] of Object.entries(files)) text[k] = await readFile(p, 'utf8');

for (const id of ids) {
  const e = byId.get(id);
  if (!e) { console.log(`?? ${id} not in bank`); continue; }
  const rowFile = e.category === 'city' ? 'cities' : 'physical';
  const rowRe = new RegExp(`^${esc(e.name)}\\|[^\\r\\n]*\\r?\\n`, 'm');
  // within the entry's own block: an island named Omo must not take the river Omo with it
  const BLOCK = { lake: 'LAKES', river: 'RIVERS', mountain: null, desert: 'DESERTS', island: 'ISLANDS', sea_ocean: 'SEAS_OCEANS', city: 'CITIES' }[e.category];
  let from = 0, to = text[rowFile].length;
  if (BLOCK) {
    from = text[rowFile].indexOf(`export const ${BLOCK} = \``);
    to = text[rowFile].indexOf('`;', from);
  }
  const inBlock = text[rowFile].slice(from, to);
  if (!rowRe.test(inBlock)) console.log(`?? ${id}: row "${e.name}|" not found`);
  text[rowFile] = text[rowFile].slice(0, from) + inBlock.replace(rowRe, '') + text[rowFile].slice(to);
  const idRe = new RegExp(`^[^\\r\\n]*['"]${esc(id)}['"][^\\r\\n]*\\r?\\n`, 'mg');
  text.titles = text.titles.replace(idRe, '');
  text.oceans = text.oceans.replace(idRe, '');
  // themes: remove the quoted name (with its following or preceding comma) inside the category block
  const catStart = text.themes.indexOf(`\n  ${e.category}: {`);
  const catEnd = text.themes.indexOf('\n  },', catStart);
  if (catStart >= 0) {
    let block = text.themes.slice(catStart, catEnd);
    const q = e.name.includes("'") ? JSON.stringify(e.name) : `'${e.name}'`;
    block = block.split(`${q}, `).join('').split(`, ${q}`).join('').split(q).join('');
    // a line that held only that name is now a lone comma: an array hole
    block = block.replace(/\r?\n[ \t]*,[ \t]*(?=\r?\n)/g, '');
    block = block.replace(/,(\s*),/g, ',$1'); // and a double comma when the name sat between two others across a line
    text.themes = text.themes.slice(0, catStart) + block + text.themes.slice(catEnd);
  }
  console.log(`dropped ${id} (${e.name})`);
}
for (const [k, p] of Object.entries(files)) await writeFile(p, text[k], 'utf8');
