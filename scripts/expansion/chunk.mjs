/**
 * Turn a probe's missing + fuzzy items into a fold.mjs chunk.
 *   node scripts/expansion/chunk.mjs work/<probe>.json --tag=<tag> [--themes="A;B"] [--min-views=N] [--include-taken] [--allow-no-figure]
 * Reads work/<probe>.json and work/<probe>-sizes.json (from article-size.mjs;
 * without it Wikidata's figure is used as is) and writes
 * work/new-<block>-<tag>.txt in fold.mjs's format:
 *   physical  Name|size|aliases|wikiTitle|themes
 *   cities    Name|Country|population|aliases|wikiTitle|themes
 * Rows that are 'taken' (the bare name belongs to another entry) are left out
 * unless --include-taken; rows with no chosen figure are listed, not written,
 * unless --allow-no-figure, which writes them with size 0 (= unknown, SPEC 4).
 * Naming follows the bank: Wikipedia's title without its parenthetical; rivers
 * lose a leading "River " or trailing " River"; cities lose ", State".
 *
 * --taken-only (decision 5, 2026-09-18): ONLY the taken rows, as namesakes.
 * Each keeps Wikipedia's comma / parenthetical part as its qualifier
 * ("Portland, Maine" -> "Portland (Maine)"; a descriptive parenthetical like
 * "(river)" is not a place and the description's "in <State>" stands in),
 * and the incumbent that holds the bare name by NAME gets a line in
 * work/qualify-<tag>.txt with the qualifier its own article title suggests
 * (qualify.mjs applies it before fold.mjs runs; an incumbent whose title is
 * bare may stay the one unqualified holder). An incumbent that holds the name
 * through an ALIAS or a LOOSE form is left as it is and the row is marked for
 * the hand pass: the alias may be the same place under another name
 * (Dufourspitze is Monte Rosa - drop the row), or a namesake the incumbent's
 * spelling should be matched to ("St. Petersburg, Florida" beside Saint
 * Petersburg). Read the review log before folding: a taken row can also be
 * a wrong incumbent (the bank's Coney Island was County Sligo's).
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
const TAKEN_ONLY = process.argv.includes('--taken-only');
const ALLOW_NO_FIGURE = process.argv.includes('--allow-no-figure');
const COUNTRY = arg('country', 'United States');
// A multi-country cities probe names each row's country from the list page it
// came from: probes/<name>.json `listCountry: { "List of cities in Germany by population": "Germany", ... }`
// (the probe records `lists` per item); --country is the fallback.

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
  // "River Avon, Bristol", "Lough Derg, County Donegal", "Reading, Berkshire":
  // enwiki's comma form tells namesakes apart; the bank has no comma names,
  // so the bare one goes in or collides and drops (with its reason)
  let n = title.replace(/\s*\([^)]*\)\s*$/, '').replace(/,.*$/, '').trim();
  if (cfg.category === 'river') {
    const bare = n.replace(/^River\s+/, '').replace(/\s+River$/, '');
    n = US_STATES.has(bare) || countryNames.has(bare) ? bare + ' River' : bare;
  }
  if (cfg.category === 'city') n = n.replace(/^City of /, '');
  return n;
}

// ---------------------------------------------------------------- namesakes
// Wikipedia's disambiguator, when it names a place: "Portland, Maine" -> Maine,
// "Grand River (Michigan)" -> Michigan, "River Avon, Bristol" -> Bristol. A
// parenthetical that describes the kind ("(river)", "(Colorado River
// tributary)", "(hill)") is not a qualifier.
const KIND_WORDS = /^(river|lake|island|islands|mountain|mountains|hill|peak|city|town|village|creek|stream|bay|sea|desert|volcano|reservoir|strait|lagoon|loch|lough|glacier|range|ridge|summit|massif|plateau|hamlet|borough|county|state)$/i;
function splitTitle(title) {
  let m = /^(.*?)\s*\(([^()]*)\)$/.exec(title);
  if (m) return { bare: m[1].trim(), qualifier: KIND_WORDS.test(m[2].trim()) || /tributary|river$|lake$|\d/i.test(m[2]) ? null : m[2].trim(), had: true };
  m = /^(.*?),\s*(.+)$/.exec(title);
  if (m) return { bare: m[1].trim(), qualifier: m[2].trim(), had: true };
  return { bare: title.trim(), qualifier: null, had: false };
}
/** "River in Kentucky, United States" -> "Kentucky"; "Lake in Sweden" -> "Sweden". */
function placeFromDescription(description) {
  const m = /\b(?:in|of|on) (?:the (?:American )?state of |the )?([A-Z][A-Za-z' .-]+?)(?:,|;| and | \(|$)/.exec(description || '');
  if (!m) return null;
  const place = m[1].trim();
  if (/^(United States|US|USA|America|Europe|the)$/i.test(place) || KIND_WORDS.test(place)) return null;
  return place;
}
const { buildFiles } = await import(new URL('../build-data.mjs', import.meta.url).href).catch(() => ({ buildFiles: null }));
const { WIKI_TITLES } = await import(new URL('../data-wiki-titles.mjs', import.meta.url).href).catch(() => ({ WIKI_TITLES: {} }));
const { normalize, looseKey } = await import('node:module').then(({ createRequire }) => createRequire(import.meta.url)('../../src/js/matching.js'));

if (TAKEN_ONLY) {
  const bank = buildFiles ? Object.values(buildFiles()).flat().filter((e) => e.category === cfg.category) : [];
  const titleOf = (e) => WIKI_TITLES[e.id] || (e.qualifier ? `${e.name} (${e.qualifier})` : e.name);
  const byTitle = new Map(bank.map((e) => [titleOf(e), e]));
  const byName = new Map();
  for (const e of bank) { const k = normalize(e.name); if (!byName.has(k)) byName.set(k, []); byName.get(k).push(e); }
  const taken = probe.items.filter((r) => !r.floor && r.status === 'taken').sort((a, b) => (b.views || 0) - (a.views || 0));
  const rows = [];
  const qualify = new Map(); // incumbent id -> { qualifier, why }
  const review = [];
  let low = 0;
  for (const r of taken) {
    if (MIN_VIEWS && (r.views || 0) < MIN_VIEWS) { low++; continue; }
    const s = sizes && sizes[r.finalTitle];
    const size = s ? s.chosen : r.size;
    const unsized = size == null || !(size > 0);
    if (unsized && !ALLOW_NO_FIGURE) { review.push(`  no figure, skipped: ${r.finalTitle}`); continue; }
    // the incumbent: the note reads '"<typed>" is the bank's <name> = <title>'
    const m = /is the bank's (.*) = (.*)$/.exec(r.note || '');
    const takerTitle = m ? m[2].trim() : null;
    const taker = (takerTitle && byTitle.get(takerTitle)) || (m && (byName.get(normalize(m[1].replace(/\s*\([^)]*\)$/, ''))) || [])[0]) || null;
    const typed = /name "(.*)"/.exec(r.how || '');
    const typedKey = typed ? normalize(typed[1]) : '';
    // the newcomer's name and qualifier
    const { bare, qualifier: fromTitle, had } = splitTitle(r.finalTitle);
    const name = bankName(bare);
    const alias = '';
    const qualifier = fromTitle || placeFromDescription(r.description) || (cfg.listCountry && (r.lists || []).map((l) => cfg.listCountry[l]).find(Boolean)) || COUNTRY;
    let kind = 'namesake';
    if (taker) {
      const takerKey = normalize(taker.name);
      if (takerKey === normalize(name) || typedKey === takerKey) kind = 'namesake';
      else if ([...(taker.aliases || [])].some((a) => normalize(a) === typedKey)) kind = 'ALIAS-HELD';
      else kind = `LOOSE-HELD ("${looseKey(name)}")`;
    }
    if (!qualifier) { review.push(`  NO QUALIFIER, skipped: ${r.finalTitle}`); continue; }
    if (taker && taker.qualifier && normalize(taker.qualifier) === normalize(qualifier) && kind.startsWith('namesake')) { review.push(`  same qualifier as ${taker.id}, skipped: ${r.finalTitle}`); continue; }
    // a name held only through a loose form ("St. George" beside George) is
    // a name of its own: it carries a qualifier only when a namesake exists
    // in the bank or in this list
    const lone = kind.startsWith('LOOSE') && !byName.has(normalize(name)) && !taken.some((o) => o !== r && normalize(bankName(splitTitle(o.finalTitle).bare)) === normalize(name));
    const sizeText = unsized ? '0' : cfg.sizeUnit === 'km2' ? String(Math.round(size * 100) / 100) : String(Math.round(size));
    const country = (cfg.listCountry && (r.lists || []).map((l) => cfg.listCountry[l]).find(Boolean)) || COUNTRY;
    const raw = lone ? name : `${name} (${qualifier})`;
    const cols = cfg.category === 'city' ? [raw, country, sizeText, alias, r.finalTitle, THEMES] : [raw, sizeText, alias, r.finalTitle, THEMES];
    rows.push(cols.join('|'));
    let note = `${String(r.views ?? '').padStart(6)} ${raw.padEnd(40)} <- ${r.finalTitle.padEnd(40)} ${kind}`;
    if (taker) {
      note += ` of ${taker.id}${taker.qualifier ? ` (already "${taker.name} (${taker.qualifier})")` : ''}`;
      if (kind.startsWith('namesake') && !taker.qualifier && !qualify.has(taker.id)) {
        const t = splitTitle(titleOf(taker));
        const suggested = t.qualifier || (cfg.category === 'city' ? taker.country : null) || placeFromDescription('') || '';
        qualify.set(taker.id, { qualifier: suggested, why: `${titleOf(taker)}${suggested ? '' : ' - NEEDS A QUALIFIER BY HAND'}` });
      }
    } else note += ' (incumbent not found - check by hand)';
    if (!had) note += ` [qualifier from ${fromTitle ? 'title' : 'description/country'}: "${qualifier}"]`;
    review.push(note);
  }
  const out = `${S}/new-${BLOCK}-${TAG}.txt`;
  await writeFile(out, rows.join('\n') + (rows.length ? '\n' : ''), 'utf8');
  const qOut = `${S}/qualify-${TAG}.txt`;
  const qLines = [`# incumbents to qualify before folding new-${BLOCK}-${TAG}.txt (node scripts/expansion/qualify.mjs work/qualify-${TAG}.txt --write)`];
  for (const [id, q] of qualify) qLines.push(`${id}|${q.qualifier}   # ${q.why}`.replace(/\s+#/, '\t#'));
  await writeFile(qOut, qLines.join('\n') + '\n', 'utf8');
  console.log(`wrote ${out}: ${rows.length} namesake rows; ${qOut}: ${qualify.size} incumbents to qualify${low ? `; ${low} under ${MIN_VIEWS} views/mo left out` : ''}`);
  console.log(review.join('\n'));
  process.exit(0);
}

const wanted = probe.items.filter((r) => !r.floor && (r.status === 'missing' || r.status === 'fuzzy' || (INCLUDE_TAKEN && r.status === 'taken')));
const rows = [];
const noFigure = [];
const lowViews = [];
let usedArticle = 0;
let unsizedWritten = 0;
for (const r of wanted.sort((a, b) => (b.views || 0) - (a.views || 0))) {
  const s = sizes && sizes[r.finalTitle];
  const size = s ? s.chosen : r.size;
  const unsized = size == null || !(size > 0);
  if (unsized && !ALLOW_NO_FIGURE) { noFigure.push(r); continue; }
  if (MIN_VIEWS && (r.views || 0) < MIN_VIEWS) { lowViews.push(r); continue; }
  if (unsized) unsizedWritten++;
  else if (s && s.how.startsWith('article')) usedArticle++;
  const n = bankName(r.finalTitle);
  const sizeText = unsized ? '0' : cfg.sizeUnit === 'km2' ? String(Math.round(size * 100) / 100) : String(Math.round(size));
  const country = (cfg.listCountry && (r.lists || []).map((l) => cfg.listCountry[l]).find(Boolean)) || COUNTRY;
  const cols = cfg.category === 'city' ? [n, country, sizeText, '', r.finalTitle, THEMES] : [n, sizeText, '', r.finalTitle, THEMES];
  rows.push(cols.join('|'));
}
const out = `${S}/new-${BLOCK}-${TAG}.txt`;
await writeFile(out, rows.join('\n') + '\n', 'utf8');
console.log(`wrote ${out}: ${rows.length} rows (${usedArticle} sized from the article, ${unsizedWritten} with no figure written as 0, the rest from Wikidata)`);
if (lowViews.length) console.log(`left out ${lowViews.length} rows under ${MIN_VIEWS} views/mo: ${lowViews.map((r) => r.finalTitle).join(', ')}`);
if (noFigure.length) { console.log(`\nno figure (${noFigure.length}), not written:`); for (const r of noFigure) console.log(`  ${r.finalTitle}`); }
