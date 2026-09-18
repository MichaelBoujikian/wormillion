/**
 * Fold the sub-agents' new-*.txt rows into the repo's authoring sources.
 *
 *   node fold.mjs            dry run: validate, report conflicts, write report.txt
 *   node fold.mjs --write    apply: data-physical.mjs, data-cities.mjs,
 *                            data-wiki-titles.mjs (WIKI_TITLES), themes.js
 *   node fold.mjs --only=islands,rivers   restrict to some inputs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync, readdirSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const REPO = fileURLToPath(new URL('../../', import.meta.url));
const HERE = fileURLToPath(new URL('./work/', import.meta.url)); mkdirSync(HERE, { recursive: true });
const WRITE = process.argv.includes('--write');
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const ONLY = onlyArg ? new Set(onlyArg.slice(7).split(',')) : null;
// the comment written above the new WIKI_TITLES and theme lines: --label="2026-09-18 namesakes"
const labelArg = process.argv.find((a) => a.startsWith('--label='));
const LABEL = labelArg ? labelArg.slice(8) : `${new Date().toISOString().slice(0, 10)} expansion`;

const require = createRequire(import.meta.url);
const matching = require(REPO + 'src/js/matching.js');
const { buildFiles, splitQualifier, idFor } = await import(new URL('../build-data.mjs', import.meta.url).href);
const { WIKI_TITLES } = await import(new URL('../data-wiki-titles.mjs', import.meta.url).href);

const INPUTS = [
  { file: 'new-islands.txt', block: 'ISLANDS', category: 'island', source: 'physical' },
  { file: 'new-rivers.txt', block: 'RIVERS', category: 'river', source: 'physical' },
  { file: 'new-lakes.txt', block: 'LAKES', category: 'lake', source: 'physical' },
  { file: 'new-mountains.txt', block: 'MOUNTAINS', category: 'mountain', source: 'physical' },
  { file: 'new-deserts.txt', block: 'DESERTS', category: 'desert', source: 'physical' },
  { file: 'new-seas.txt', block: 'SEAS_OCEANS', category: 'sea_ocean', source: 'physical' },
  { file: 'new-cities.txt', block: 'CITIES', category: 'city', source: 'cities' }
];
/** new-<x>.txt plus any chunk new-<x>-<anything>.txt */
const chunkFiles = (file) => {
  const stem = file.replace(/\.txt$/, '');
  return readdirSync(HERE).filter((f) => f === file || (f.startsWith(stem + '-') && f.endsWith('.txt'))).sort();
};

const slug = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Fold to plain ASCII the way the bank's names are written (case kept). */
const ascii = (s) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/ø/g, 'o').replace(/Ø/g, 'O').replace(/æ/g, 'ae').replace(/Æ/g, 'Ae').replace(/œ/g, 'oe').replace(/Œ/g, 'Oe')
    .replace(/ł/g, 'l').replace(/Ł/g, 'L').replace(/ß/g, 'ss').replace(/[đð]/g, 'd').replace(/[ĐÐ]/g, 'D').replace(/þ/g, 'th').replace(/Þ/g, 'Th')
    .replace(/[ı]/g, 'i').replace(/[‘’ʼ]/g, "'").replace(/[–—]/g, '-').trim();

const normalize = matching.normalize;
const looseKey = matching.looseKey;

// ---------------------------------------------------------------- existing bank
const files = buildFiles();
const cohorts = new Map(); // category -> { keys: Map<key,{id,fromName}>, claims: Map<bare,[{id,fromName}]>, ids:Set }
for (const entries of Object.values(files)) {
  for (const entry of entries) {
    const c = cohortFor(entry.category);
    c.ids.add(entry.id);
    c.names.set(entry.id, entry.qualifier ? `${entry.name} (${entry.qualifier})` : entry.name);
    addCandidates(c, entry.id, entry.name, entry.aliases || [], entry.qualifier);
  }
}
function cohortFor(category) {
  if (!cohorts.has(category)) cohorts.set(category, { keys: new Map(), claims: new Map(), ids: new Set(), names: new Map() });
  return cohorts.get(category);
}
function addCandidates(c, id, name, aliases, qualifier) {
  const forms = [name, ...aliases].map((candidate, i) => ({ candidate, fromName: i === 0 }));
  if (qualifier) for (const key of matching.qualifiedKeys(name, qualifier)) forms.push({ candidate: key, fromName: false, generated: true });
  for (const { candidate, fromName, generated } of forms) {
    const key = normalize(candidate);
    if (!key) continue;
    if (!c.keys.has(key)) c.keys.set(key, []);
    if (!c.keys.get(key).some((h) => h.id === id)) c.keys.get(key).push({ id, fromName, qualifier, generated });
    if (generated) continue;
    const bare = looseKey(candidate);
    if (!bare || bare === key) continue;
    if (!c.claims.has(bare)) c.claims.set(bare, []);
    c.claims.get(bare).push({ id, fromName });
  }
}
/**
 * Would adding candidate (name or alias) to entry id break anything? returns
 * reason or null. The validator's rules (SPEC 6.4): an exact key may be
 * shared by namesakes when at most one holder lacks a qualifier and the
 * qualifiers differ; a loose form two NAMES share is fine (the list, by
 * scope and views - decision 5, 2026-09-18; before it the second name was
 * refused here); two aliases with no name behind either are not.
 */
function collision(c, id, candidate, fromName, qualifier) {
  const key = normalize(candidate);
  if (!key) return 'empty';
  const holders = (c.keys.get(key) || []).filter((h) => h.id !== id);
  if (holders.length) {
    if (!fromName) return `"${candidate}" is already ${holders[0].fromName ? 'the name' : 'an alias'} of ${holders[0].id}`;
    const unqualified = holders.filter((h) => !h.qualifier).length + (qualifier ? 0 : 1);
    if (unqualified > 1) return `"${candidate}" is already the name of ${holders.find((h) => !h.qualifier).id} - namesakes need a qualifier each`;
    const same = holders.find((h) => h.qualifier && qualifier && normalize(h.qualifier) === normalize(qualifier));
    if (same) return `"${candidate}" is already ${same.id} with the same qualifier "${qualifier}"`;
    if (holders.some((h) => h.generated)) return `"${candidate}" is the qualified form of ${holders.find((h) => h.generated).id}`;
  }
  const bare = looseKey(candidate);
  if (!bare || bare === key) return null;
  if (fromName) return null;
  // alias: fine if some NAME owns the bare form (name wins); error if only aliases claim it
  const list = (c.claims.get(bare) || []).filter((x) => x.id !== id);
  const exactOwner = (c.keys.get(bare) || []).find((h) => h.id !== id);
  if (list.length && !list.some((x) => x.fromName) && !(exactOwner && exactOwner.fromName)) {
    return `alias "${candidate}" makes "${bare}" ambiguous with an alias of ${list[0].id}`;
  }
  return null;
}

// country / capital tables for cities
const countryByName = new Map();
const countryKeys = new Set();
for (const entry of files['countries.json']) {
  countryByName.set(entry.name, { regions: entry.region });
  for (const cand of [entry.name, ...entry.aliases]) countryKeys.add(normalize(cand));
}
const capitalByCountry = new Map();
for (const entry of files['capitals.json']) if (entry.country && !entry.state) capitalByCountry.set(entry.country, entry.name);
const islandKeys = new Set();
for (const entry of files['islands.json']) for (const cand of [entry.name, ...entry.aliases]) islandKeys.add(normalize(cand));

// theme sets available per category
const themesSource = await readFile(REPO + 'src/data/themes.js', 'utf8');
const themeScope = {};
new Function('globalThis', themesSource)(themeScope);
const THEMES = themeScope.WORMILLION_THEMES;

// ---------------------------------------------------------------- parse inputs
const report = [];
const log = (s) => { report.push(s); console.log(s); };
const accepted = []; // { input, category, id, name, aliases, magnitude, country, wikiTitle, themes }
const wikiAdds = {}; // id -> title
const themeAdds = new Map(); // `${category}|${theme}` -> [names]
let dropped = 0;

for (const input of INPUTS) {
  // --only=rivers takes every rivers chunk; --only=rivers-2 takes exactly that file
  const stem = input.file.replace(/^new-|\.txt$/g, '');
  const chunks = chunkFiles(input.file).filter((f) => !ONLY || ONLY.has(stem) || ONLY.has(f.replace(/^new-|\.txt$/g, '')));
  if (!chunks.length) { log(`-- ${input.file}: no files, skipped`); continue; }
  const lines = [];
  for (const f of chunks) {
    const text = await readFile(HERE + f, 'utf8');
    lines.push(...text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean));
  }
  const c = cohortFor(input.category);
  let ok = 0;
  log(`\n== ${chunks.join(', ')} (${lines.length} lines) ==`);
  for (const line of lines) {
    const cols = line.split('|').map((s) => s.trim());
    let name, magnitude, aliases, wikiTitle, themes, country;
    if (input.source === 'cities') {
      if (cols.length < 3) { log(`  DROP (columns): ${line}`); dropped++; continue; }
      [name, country, magnitude, aliases, wikiTitle, themes] = cols;
    } else {
      if (cols.length < 2) { log(`  DROP (columns): ${line}`); dropped++; continue; }
      [name, magnitude, aliases, wikiTitle, themes] = cols;
    }
    const rawName = name;
    name = ascii(name).replace(/\s+/g, ' ');
    if (!name) { log(`  DROP (no name): ${line}`); dropped++; continue; }
    if (name !== rawName) log(`  note: name folded "${rawName}" -> "${name}"`);
    // "Portland (Maine)": the bare name plus its qualifier (decision 5)
    const split = splitQualifier(name);
    const qualifier = split.qualifier;
    name = split.name;
    const shown = qualifier ? `${name} (${qualifier})` : name;
    if (!/^\d+(\.\d+)?(-\d+(\.\d+)?)?$/.test(magnitude || '')) { log(`  DROP (bad magnitude "${magnitude}"): ${shown}`); dropped++; continue; }
    const id = idFor(input.category, name, qualifier);
    if (c.ids.has(id)) { log(`  DROP (id exists ${id}${c.names.get(id) && c.names.get(id) !== shown ? ` - the id of "${c.names.get(id)}", a different name: pick another qualifier` : ''}): ${shown}`); dropped++; continue; }
    const why = collision(c, id, name, true, qualifier);
    if (why) { log(`  DROP ${shown}: ${why}`); dropped++; continue; }
    // the generated qualified forms belong to the row alone (SPEC 6.4): "Little (Arkansas)" would take "little arkansas" from the Little Arkansas River
    const takenForm = qualifier ? matching.qualifiedKeys(name, qualifier).find((k) => (c.keys.get(k) || []).some((h) => h.id !== id)) : null;
    if (takenForm) { log(`  DROP ${shown}: its qualified form "${takenForm}" is already a name of ${c.keys.get(takenForm)[0].id} - pick another qualifier`); dropped++; continue; }
    if (input.source === 'cities') {
      if (!countryByName.has(country)) { log(`  DROP ${name}: unknown country "${country}"`); dropped++; continue; }
      if (slug(name) === slug(capitalByCountry.get(country) || '')) { log(`  DROP ${name}: is the capital of ${country}`); dropped++; continue; }
      // a city named like a country or an island goes in with a qualifier
      // (decision 5: "Greece (New York)", "Manhattan (Kansas)" - the bare
      // typing keeps the nudge to the famous one, run.js NAMESAKE_FAME_RATIO)
      if (!qualifier && countryKeys.has(normalize(name))) { log(`  DROP ${name}: is also a country name in the bank (qualify it)`); dropped++; continue; }
      if (!qualifier && islandKeys.has(normalize(name))) { log(`  DROP ${name}: is also an island name in the bank (qualify it)`); dropped++; continue; }
    }
    // aliases: keep the ones that don't collide
    const keptAliases = [];
    for (let alias of (aliases || '').split(',').map((s) => ascii(s).replace(/\s+/g, ' ')).filter(Boolean)) {
      if (normalize(alias) === normalize(name)) continue;
      if (keptAliases.some((a) => normalize(a) === normalize(alias))) continue;
      const aw = collision(c, id, alias, false, qualifier);
      if (aw) { log(`  alias dropped on ${name}: ${aw}`); continue; }
      keptAliases.push(alias);
    }
    // themes
    const keptThemes = [];
    for (const theme of (themes || '').split(';').map((s) => s.trim()).filter(Boolean)) {
      const sets = THEMES[input.category] || {};
      if (!(theme in sets)) { log(`  theme dropped on ${name}: no ${input.category} theme "${theme}"`); continue; }
      keptThemes.push(theme);
    }
    const wt = (wikiTitle || '').trim();
    if (!wt && qualifier) { log(`  DROP ${shown}: a namesake needs its Wikipedia title`); dropped++; continue; }
    // commit to the in-memory cohort so later rows collide against it
    c.ids.add(id);
    addCandidates(c, id, name, keptAliases, qualifier);
    if (wt && (wt !== name || qualifier)) wikiAdds[id] = wt; // a namesake always names its article
    for (const theme of keptThemes) {
      const k = `${input.category}|${theme}`;
      if (!themeAdds.has(k)) themeAdds.set(k, []);
      themeAdds.get(k).push(shown);
    }
    accepted.push({ input, category: input.category, id, name: shown, aliases: keptAliases, magnitude, country, wikiTitle: wt, themes: keptThemes });
    ok++;
  }
  log(`   accepted ${ok}`);
}

log(`\nTOTAL accepted ${accepted.length}, dropped ${dropped}, wiki overrides ${Object.keys(wikiAdds).length}, theme adds ${[...themeAdds.values()].reduce((a, b) => a + b.length, 0)}`);
for (const [k, names] of themeAdds) log(`  theme ${k}: +${names.length}`);
await writeFile(HERE + 'report.txt', report.join('\n') + '\n', 'utf8');

if (!WRITE) { console.log('\n(dry run; pass --write to apply)'); process.exit(0); }

// ---------------------------------------------------------------- write
const eolOf = (text) => (text.includes('\r\n') ? '\r\n' : '\n');

function appendToBlock(text, blockName, rows) {
  const EOL = eolOf(text);
  const start = text.indexOf(`export const ${blockName} = \``);
  if (start < 0) throw new Error(`block ${blockName} not found`);
  const close = text.indexOf(`${EOL}\`;`, start);
  if (close < 0) throw new Error(`closing of ${blockName} not found`);
  return text.slice(0, close) + EOL + rows.join(EOL) + text.slice(close);
}

// physical blocks
{
  const path = REPO + 'scripts/data-physical.mjs';
  let text = await readFile(path, 'utf8');
  for (const input of INPUTS.filter((i) => i.source === 'physical')) {
    const rows = accepted.filter((r) => r.input === input).map((r) => [r.name, r.magnitude, r.aliases.join(',')].join('|').replace(/\|$/, ''));
    if (rows.length) text = appendToBlock(text, input.block, rows);
  }
  await writeFile(path, text, 'utf8');
  console.log('wrote data-physical.mjs');
}

// cities: sorted into the header's regional order
{
  const CONTINENTS = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];
  const SUBS = {
    Africa: ['West Africa', 'North Africa', 'East Africa', 'Southern Africa'],
    Asia: ['Middle East', 'South Asia', 'Southeast Asia', 'East Asia', 'Central Asia'],
    Europe: ['Western Europe', 'Eastern Europe', 'Scandinavia & the Nordics'],
    'North America': ['Central America', 'Caribbean']
  };
  const NA_COUNTRY = { 'United States': 0, Canada: 1, Mexico: 2 };
  const rank = (r) => {
    const regions = countryByName.get(r.country).regions;
    const cont = regions[0];
    const ci = CONTINENTS.indexOf(cont);
    let si = 9;
    if (cont === 'North America' && r.country in NA_COUNTRY) si = NA_COUNTRY[r.country];
    else {
      const subs = SUBS[cont] || [];
      const found = subs.findIndex((s) => regions.includes(s));
      si = found < 0 ? 9 : (cont === 'North America' ? 3 + found : found);
    }
    return ci * 100 + si;
  };
  const cityRows = accepted.filter((r) => r.category === 'city');
  cityRows.sort((a, b) => rank(a) - rank(b));
  const path = REPO + 'scripts/data-cities.mjs';
  let text = await readFile(path, 'utf8');
  const rows = cityRows.map((r) => [r.name, r.country, r.magnitude, r.aliases.join(',')].join('|').replace(/\|$/, ''));
  if (rows.length) text = appendToBlock(text, 'CITIES', rows);
  await writeFile(path, text, 'utf8');
  console.log(`wrote data-cities.mjs (+${rows.length})`);
}

// WIKI_TITLES
{
  const path = REPO + 'scripts/data-wiki-titles.mjs';
  let text = await readFile(path, 'utf8');
  const EOL = eolOf(text);
  const start = text.indexOf('export const WIKI_TITLES = {');
  const close = text.indexOf(`${EOL}};`, start);
  if (start < 0 || close < 0) throw new Error('WIKI_TITLES block not found');
  let head = text.slice(0, close);
  const trimmed = head.trimEnd();
  if (!trimmed.endsWith(',') && !trimmed.endsWith('{')) head = trimmed + ',';
  const byCategory = new Map();
  for (const r of accepted) if (wikiAdds[r.id] && !(r.id in WIKI_TITLES)) {
    if (!byCategory.has(r.category)) byCategory.set(r.category, []);
    byCategory.get(r.category).push(`  ${JSON.stringify(r.id)}: ${JSON.stringify(wikiAdds[r.id])},`);
  }
  const lines = [];
  for (const [category, entries] of byCategory) {
    lines.push('', `  // --- ${category} (${LABEL}) ---`, ...entries);
  }
  if (lines.length) {
    // drop the trailing comma on the very last entry to match the file's style
    lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '');
    text = head + EOL + lines.join(EOL) + text.slice(close);
    await writeFile(path, text, 'utf8');
  }
  console.log(`wrote data-wiki-titles.mjs (+${Object.keys(wikiAdds).length})`);
}

// themes.js
{
  const path = REPO + 'src/data/themes.js';
  let text = await readFile(path, 'utf8');
  const EOL = eolOf(text);
  const q = (s) => (s.includes("'") ? JSON.stringify(s) : `'${s}'`);
  for (const [k, names] of themeAdds) {
    const [category, theme] = k.split('|');
    const catStart = text.indexOf(`${EOL}  ${category}: {`);
    if (catStart < 0) throw new Error(`themes: category ${category} not found`);
    const catEnd = text.indexOf(`${EOL}  },`, catStart);
    const keyIdx = text.indexOf(`'${theme}': [`, catStart);
    if (keyIdx < 0 || (catEnd > 0 && keyIdx > catEnd)) throw new Error(`themes: ${category}/${theme} not found`);
    const arrStart = keyIdx + `'${theme}': [`.length;
    const arrEnd = text.indexOf(']', arrStart);
    // insert after the last non-whitespace char before ']'
    let insertAt = arrEnd;
    while (/\s/.test(text[insertAt - 1])) insertAt--;
    const chunks = [];
    for (let i = 0; i < names.length; i += 5) chunks.push('      ' + names.slice(i, i + 5).map(q).join(', '));
    // a list that already ends in a comma gets no second one: ',,' is an array hole
    const comma = text[insertAt - 1] === ',' ? '' : ',';
    const insertion = `${comma}${EOL}      // ${LABEL}${EOL}` + chunks.join(`,${EOL}`);
    text = text.slice(0, insertAt) + insertion + text.slice(insertAt);
  }
  await writeFile(path, text, 'utf8');
  console.log('wrote themes.js');
}
console.log('done');
