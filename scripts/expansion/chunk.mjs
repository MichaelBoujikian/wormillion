/**
 * Turn a probe's missing + fuzzy items into a fold.mjs chunk.
 *   node scripts/expansion/chunk.mjs work/<probe>.json --tag=<tag> [--themes="A;B"] [--min-views=N] [--include-taken]
 * Reads work/<probe>.json and work/<probe>-sizes.json (from article-size.mjs;
 * without it Wikidata's figure is used as is) and writes
 * work/new-<block>-<tag>.txt in fold.mjs's format:
 *   physical  Name|size|aliases|wikiTitle|themes
 *   cities    Name|Country|population|aliases|wikiTitle|themes
 * Rows that are 'taken' (the bare name belongs to another entry) are left out
 * unless --include-taken; rows with no chosen figure are listed, not written.
 * Naming follows the bank: Wikipedia's title without its parenthetical; rivers
 * lose a leading "River " or trailing " River"; cities lose ", State".
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const S = fileURLToPath(new URL('./work', import.meta.url));
const src = process.argv[2];
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const TAG = arg('tag');
if (!src || !TAG) { console.error('usage: chunk.mjs work/<probe>.json --tag=<tag> [--themes="A;B"] [--min-views=N] [--include-taken] [--country="United States"]'); process.exit(1); }
const THEMES = arg('themes', '');
const MIN_VIEWS = Number(arg('min-views', 0));
const INCLUDE_TAKEN = process.argv.includes('--include-taken');
const COUNTRY = arg('country', 'United States');

const probe = JSON.parse(await readFile(src, 'utf8'));
const name = src.replace(/\\/g, '/').split('/').pop().replace(/\.json$/, '');
const cfg = JSON.parse(await readFile(fileURLToPath(new URL(`./probes/${name}.json`, import.meta.url)), 'utf8'));
const sizesFile = `${S}/${name}-sizes.json`;
const sizes = existsSync(sizesFile) ? JSON.parse(await readFile(sizesFile, 'utf8')) : null;
const BLOCK = { river: 'rivers', lake: 'lakes', mountain: 'mountains', island: 'islands', desert: 'deserts', sea_ocean: 'seas', city: 'cities' }[cfg.category];

// A river named after a state or a country keeps its "River", as the bank's
// Ohio River / Colorado River / Congo River do; every other river goes bare.
const US_STATES = new Set(['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']);
const { COUNTRIES } = await import(new URL('../data-countries.mjs', import.meta.url).href).catch(() => ({ COUNTRIES: '' }));
const countryNames = new Set(String(COUNTRIES || '').split(/\r?\n/).map((l) => l.split('|')[0].trim()).filter(Boolean));
function bankName(title) {
  let n = title.replace(/\s*\([^)]*\)\s*$/, '').trim();
  if (cfg.category === 'river') {
    const bare = n.replace(/^River\s+/, '').replace(/\s+River$/, '');
    n = US_STATES.has(bare) || countryNames.has(bare) ? bare + ' River' : bare;
  }
  if (cfg.category === 'city') n = n.replace(/,.*$/, '').replace(/^City of /, '');
  return n;
}

const wanted = probe.items.filter((r) => !r.floor && (r.status === 'missing' || r.status === 'fuzzy' || (INCLUDE_TAKEN && r.status === 'taken')));
const rows = [];
const noFigure = [];
const lowViews = [];
let usedArticle = 0;
for (const r of wanted.sort((a, b) => (b.views || 0) - (a.views || 0))) {
  const s = sizes && sizes[r.finalTitle];
  const size = s ? s.chosen : r.size;
  if (size == null || !(size > 0)) { noFigure.push(r); continue; }
  if (s && s.how.startsWith('article')) usedArticle++;
  if (MIN_VIEWS && (r.views || 0) < MIN_VIEWS) { lowViews.push(r); continue; }
  const n = bankName(r.finalTitle);
  const sizeText = cfg.sizeUnit === 'km2' ? String(Math.round(size * 100) / 100) : String(Math.round(size));
  const cols = cfg.category === 'city' ? [n, COUNTRY, sizeText, '', r.finalTitle, THEMES] : [n, sizeText, '', r.finalTitle, THEMES];
  rows.push(cols.join('|'));
}
const out = `${S}/new-${BLOCK}-${TAG}.txt`;
await writeFile(out, rows.join('\n') + '\n', 'utf8');
console.log(`wrote ${out}: ${rows.length} rows (${usedArticle} sized from the article, the rest from Wikidata)`);
if (lowViews.length) console.log(`left out ${lowViews.length} rows under ${MIN_VIEWS} views/mo: ${lowViews.map((r) => r.finalTitle).join(', ')}`);
if (noFigure.length) { console.log(`\nno figure (${noFigure.length}), not written:`); for (const r of noFigure) console.log(`  ${r.finalTitle}`); }
