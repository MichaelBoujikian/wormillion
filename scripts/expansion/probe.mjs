/**
 * Coverage probe: one country x one category, against the game's own matcher.
 *   node scripts/expansion/probe.mjs scripts/expansion/probes/<name>.json
 * Output: the report on stdout and work/<name>.json; API responses cache in
 * work/<name>-cache.json (both gitignored). See probes/*.json for the shape
 * and reports/2026-09-15-*.md for what the three first runs found.
 * config: { name, category, jsonFile, roots: [category titles], subcat: regex,
 *           lists: [page titles], kind: regex (description|title), skipTitle: regex,
 *           notKind: regex on the description alone that vetoes an item ("Reservoir on the X River"),
 *           notKindExemptTitle: regex on the title that lifts the veto (an island whose article is its town),
 *           sizeProp: 'P1082' | 'P2046' | 'P2043' | 'P2044', sizeUnit: 'population'|'km2'|'km'|'m',
 *           minSize: optional floor in sizeUnit - items under it (or with no Wikidata
 *                    figure) are counted, not fetched for views, and listed apart,
 *           floorExemptSources: ['list'] exempts items a list page vouches for from the floor,
 *           famousViews: N fetches views below the floor too and lifts items with N+ views/mo back in,
 *           noFigureViews: N fetches views for the items with no figure anywhere and keeps those with N+ views/mo
 *                    in scope unsized (chunk.mjs --allow-no-figure writes them with size 0 = unknown, SPEC 4),
 *           spellings: 'city' | 'lake' | 'river' | 'mountain' | 'island' | 'sea' | 'desert', flagRe: regex on description to flag }
 * Prints present / fuzzy / missing (by monthly views) and writes <name>.json.
 */
import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const REPO = fileURLToPath(new URL('../../', import.meta.url)).replace(/[\/]$/, '');
const S = fileURLToPath(new URL('./work', import.meta.url));
mkdirSync(S, { recursive: true });
const daily = require(REPO + '/netlify/functions/lib/daily.js');
const matching = require(REPO + '/src/js/matching.js');
const rarity = require(REPO + '/src/js/rarity.js');

const cfg = JSON.parse(await readFile(process.argv[2], 'utf8'));
const re = (s) => (s ? new RegExp(s, 'i') : null);
const SUBCAT = re(cfg.subcat);
const KIND = re(cfg.kind);
const SKIP_TITLE = re(cfg.skipTitle);
const FLAG = re(cfg.flagRe);

const UA = 'Wormillion/1.0 (offline geography quiz game; one-off coverage check; contact: repository issues)';
const API = 'https://en.wikipedia.org/w/api.php';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const CACHE_FILE = `${S}/${cfg.name}-cache.json`;
let cache = {};
try { cache = JSON.parse(await readFile(CACHE_FILE, 'utf8')); } catch {}
// Wikidata's wbgetentities answers are huge (every claim of 50 items) and the
// per-QID memo below keeps what matters, so those responses are not cached
// raw: the 42,857-title US cities probe grew the cache to 536 MB and died in
// JSON.stringify.
async function getJSON(url, attempt = 0, { cache: keep = true } = {}) {
  if (cache[url]) return cache[url];
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch {}
  if (res.status === 429 || res.status >= 500 || !data) {
    if (attempt > 5) throw new Error(`HTTP ${res.status} for ${url}: ${text.slice(0, 80)}`);
    const wait = [5000, 15000, 30000, 60000, 90000, 120000][attempt];
    console.log(`  (throttled - waiting ${wait / 1000}s)`);
    await sleep(wait);
    return getJSON(url, attempt + 1, { cache: keep });
  }
  if (keep) {
    cache[url] = data;
    await writeFile(CACHE_FILE, JSON.stringify(cache));
  }
  await sleep(url.includes('wikidata') ? 1500 : 1000);
  return data;
}
const api = (params) => getJSON(API + '?' + new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', ...params }));

// ---- 1. category tree -------------------------------------------------------
const seenCats = new Set();
const catPages = new Set();
async function walk(cat, depth) {
  if (seenCats.has(cat) || depth > 3) return;
  seenCats.add(cat);
  let cmcontinue;
  do {
    const data = await api({ list: 'categorymembers', cmtitle: cat, cmlimit: '500', cmtype: 'page|subcat', ...(cmcontinue ? { cmcontinue } : {}) });
    if (!data.query) { console.log(`category ${cat}: ${JSON.stringify(data.error || data).slice(0, 80)}`); return; }
    for (const m of data.query.categorymembers) {
      if (m.ns === 14) {
        if (SUBCAT && SUBCAT.test(m.title)) await walk(m.title, depth + 1);
      } else if (m.ns === 0 && !/^List of/i.test(m.title)) catPages.add(m.title);
    }
    cmcontinue = data.continue && data.continue.cmcontinue;
  } while (cmcontinue);
}
for (const root of cfg.roots || []) await walk(root, 0);
if (cfg.roots && cfg.roots.length) console.log(`category tree: ${seenCats.size} categories, ${catPages.size} pages`);

// ---- 2. list pages ----------------------------------------------------------
const listPages = new Set();
const listsOf = new Map(); // title -> the list pages that link it (chunk.mjs maps a list to a country for cities)
for (const page of cfg.lists || []) {
  // redirects: a list page that moved ("List of Pyrenean three-thousanders" -> "Pyrenean three-thousanders") still yields its links
  const data = await getJSON(API + '?' + new URLSearchParams({ action: 'parse', page, prop: 'links', redirects: '1', format: 'json', formatversion: '2' }));
  if (!data.parse) { console.log(`list page "${page}": ${JSON.stringify(data.error || data).slice(0, 80)}`); continue; }
  let n = 0;
  for (const l of data.parse.links) {
    if (l.ns !== 0 || l.exists === false) continue;
    if (SKIP_TITLE && SKIP_TITLE.test(l.title)) continue;
    listPages.add(l.title);
    if (!listsOf.has(l.title)) listsOf.set(l.title, new Set());
    listsOf.get(l.title).add(page);
    n++;
  }
  console.log(`list page "${page}": ${n} links`);
}

// ---- 3. resolve -------------------------------------------------------------
const candidates = [...new Set([...catPages, ...listPages])].sort();
console.log(`resolving ${candidates.length} candidate titles`);
const info = new Map();
for (let i = 0; i < candidates.length; i += 50) {
  const batch = candidates.slice(i, i + 50);
  const data = await api({ redirects: '1', prop: 'description|pageprops', ppprop: 'disambiguation|wikibase_item', titles: batch.join('|') });
  const forward = new Map(batch.map((t) => [t, t]));
  for (const step of [...(data.query.normalized || []), ...(data.query.redirects || [])]) {
    for (const [from, to] of forward) if (to === step.from) forward.set(from, step.to);
  }
  const pages = new Map(data.query.pages.map((p) => [p.title, p]));
  for (const t of batch) {
    const p = pages.get(forward.get(t));
    info.set(t, {
      title: t,
      finalTitle: p ? p.title : forward.get(t),
      missing: !p || p.missing === true,
      disambig: Boolean(p && p.pageprops && 'disambiguation' in p.pageprops),
      description: (p && p.description) || '',
      qid: p && p.pageprops && p.pageprops.wikibase_item
    });
  }
}
const NOT_KIND = re(cfg.notKind); // on the description only: "Reservoir on the Colorado River" is not a river
const NOT_KIND_EXEMPT = re(cfg.notKindExemptTitle); // ...unless the title says otherwise: "Sullivan's Island, South Carolina" is a town AND the island
const vetoed = (r) => NOT_KIND && NOT_KIND.test(r.description) && !(NOT_KIND_EXEMPT && NOT_KIND_EXEMPT.test(r.finalTitle));
const isKind = (r) => !r.missing && !r.disambig && !(SKIP_TITLE && SKIP_TITLE.test(r.finalTitle)) && KIND.test(r.description + ' || ' + r.finalTitle) && !vetoed(r);
const byFinal = new Map();
for (const r of info.values()) {
  if (!byFinal.has(r.finalTitle)) byFinal.set(r.finalTitle, { ...r, sources: new Set() });
  const rec = byFinal.get(r.finalTitle);
  if (catPages.has(r.title)) rec.sources.add('category');
  if (listPages.has(r.title)) rec.sources.add('list');
  for (const page of listsOf.get(r.title) || []) (rec.lists = rec.lists || new Set()).add(page);
}
const items = [...byFinal.values()].filter(isKind);
const skipped = [...byFinal.values()].filter((r) => !isKind(r));
console.log(`${items.length} read as ${cfg.category}; ${skipped.length} skipped`);

// ---- 4. through the bank ----------------------------------------------------
const bank = daily.loadBank(REPO);
const cohort = bank.cohorts.get(cfg.category);
// jsonFile may be a list: the mountain cohort is mountains.json + minor-peaks.json
const json = [];
for (const f of [].concat(cfg.jsonFile)) json.push(...JSON.parse(await readFile(`${REPO}/src/data/${f}`, 'utf8')));
const byWikiTitle = new Map(json.map((e) => [e.wikiTitle, e]));
const wikiOf = new Map(json.map((e) => [e.id, e.wikiTitle]));

function spellings(title) {
  const out = new Set();
  // enwiki's parenthetical and comma disambiguations are not part of the name
  const bare = title.replace(/\s*\([^)]*\)\s*$/, '').replace(/,.*$/, '');
  out.add(bare);
  if (cfg.spellings === 'city') {
    out.add(bare.replace(/,.*$/, ''));
    out.add(bare.replace(/,.*$/, '').replace(/^City of /i, ''));
  } else if (cfg.spellings === 'lake') {
    out.add(bare.replace(/^Lake\s+/i, ''));
    out.add(bare.replace(/\s+Lake$/i, ''));
    out.add('Lake ' + bare.replace(/^Lake\s+/i, ''));
  } else if (cfg.spellings === 'mountain') {
    out.add(bare.replace(/^(Mount|Mt\.?)\s+/i, ''));
    out.add(bare.replace(/\s+(Mountain|Peak)$/i, ''));
  } else if (cfg.spellings === 'island') {
    out.add(bare.replace(/\s+Islands?$/i, ''));
  } else if (cfg.spellings === 'desert') {
    out.add(bare.replace(/\s+Desert$/i, ''));
  } else if (cfg.spellings === 'sea') {
    // straits and bays carry their bare name as an alias in the bank
    out.add(bare.replace(/^(Strait|Gulf|Bay|Sea) of\s+/i, ''));
  } else {
    // "River Avon, Bristol" / "River Ouse, Sussex": enwiki's comma form for
    // the British namesakes; the bank knows only the bare name
    const noComma = bare.replace(/,.*$/, '');
    out.add(noComma);
    out.add(noComma.replace(/\s+River$/i, ''));
    out.add(noComma.replace(/^River\s+/i, ''));
  }
  return [...out].filter(Boolean);
}

for (const r of items) {
  const article = byWikiTitle.get(r.finalTitle);
  if (article) { r.status = 'present'; r.entry = article.name; r.how = 'article'; continue; }
  let hit = null;
  let fuzzy = null;
  for (const s of spellings(r.finalTitle)) {
    const m = matching.matchAnswer(s, cohort.lookup, null);
    if (m.status === 'accepted') { hit = { s, m }; break; }
    if (m.status === 'corrected' && !fuzzy) fuzzy = { s, m };
  }
  if (hit) {
    const entry = cohort.byId.get(hit.m.entryId);
    const other = wikiOf.get(entry.id) !== r.finalTitle;
    r.status = other ? 'taken' : 'present';
    r.entry = entry.name;
    r.how = `name "${hit.s}"`;
    if (other) r.note = `"${hit.s}" is the bank's ${entry.name} = ${wikiOf.get(entry.id)}`;
  } else if (fuzzy) {
    const entry = cohort.byId.get(fuzzy.m.entryId);
    r.status = 'fuzzy';
    r.entry = entry.name;
    r.how = `"${fuzzy.s}" -> ${entry.name} (${wikiOf.get(entry.id)})`;
  } else r.status = 'missing';
}

// ---- 5. size, then views, for what isn't there -----------------------------
// Sizes first (one Wikidata call per 50 items) so a `minSize` floor can cut the
// list before the far slower pageview fetch; without a floor everything gets views.
// Both are memoised per item (cache.__sizes by qid, cache.__views by title), so
// a re-run only fetches what is new even when the batches fall differently.
const notThere = items.filter((r) => r.status !== 'present');
const UNIT_KM2 = { 'Q712226': 1, 'Q25343': 1e-6, 'Q35852': 0.01, 'Q232291': 2.58999, 'Q81292': 0.00404686 };
const UNIT_KM = { 'Q828224': 1, 'Q11573': 0.001, 'Q253276': 1.609344, 'Q3710': 0.0003048 };
const UNIT_M = { 'Q11573': 1, 'Q3710': 0.3048, 'Q828224': 1000 };
const memoSizes = (cache.__sizes = cache.__sizes || {}); // qid -> { amount, unit } | null
const memoViews = (cache.__views = cache.__views || {}); // title -> daily counts
const qids = [...new Set(notThere.map((r) => r.qid).filter((q) => q && !(q in memoSizes)))];
for (let i = 0; i < qids.length; i += 50) {
  const batch = qids.slice(i, i + 50);
  const data = await getJSON('https://www.wikidata.org/w/api.php?' + new URLSearchParams({ action: 'wbgetentities', ids: batch.join('|'), props: 'claims', format: 'json' }), 0, { cache: false });
  for (const qid of batch) {
    const ent = data.entities && data.entities[qid];
    const claims = ent && ent.claims && ent.claims[cfg.sizeProp];
    memoSizes[qid] = null;
    if (!claims) continue;
    // the latest dated statement wins (populations carry a point-in-time)
    const dated = claims.map((c) => ({ c, t: (c.qualifiers && c.qualifiers.P585 && c.qualifiers.P585[0].datavalue && c.qualifiers.P585[0].datavalue.value.time) || '' }));
    dated.sort((a, b) => (a.t < b.t ? 1 : -1));
    const v = dated[0].c.mainsnak && dated[0].c.mainsnak.datavalue && dated[0].c.mainsnak.datavalue.value;
    if (v) memoSizes[qid] = { amount: Number(v.amount), unit: (v.unit || '').split('/').pop() };
  }
  if ((i / 50) % 10 === 9 || i + 50 >= qids.length) {
    await writeFile(CACHE_FILE, JSON.stringify(cache));
    console.log(`  sizes: ${Math.min(i + 50, qids.length)} / ${qids.length}`);
  }
}
for (const r of notThere) {
  const s = r.qid && memoSizes[r.qid];
  if (!s) continue;
  const { amount, unit } = s;
  if (cfg.sizeUnit === 'population') r.size = Math.round(amount);
  else if (cfg.sizeUnit === 'km2') r.size = UNIT_KM2[unit] ? Math.round(amount * UNIT_KM2[unit] * 100) / 100 : null;
  else if (cfg.sizeUnit === 'm') r.size = UNIT_M[unit] ? Math.round(amount * UNIT_M[unit]) : null;
  else r.size = UNIT_KM[unit] ? Math.round(amount * UNIT_KM[unit]) : (unit === '1' ? Math.round(amount) : null);
  if (r.size != null) r.sizeSource = 'wikidata';
}
// A second pass after article-size.mjs: its cross-checked figure (the article's
// infobox first, Wikidata second) replaces Wikidata's, and fills in where
// Wikidata had none, so the floor and the views fetch see the best figure.
try {
  const sizes = JSON.parse(await readFile(`${S}/${cfg.name}-sizes.json`, 'utf8'));
  let filled = 0;
  for (const r of notThere) {
    const s = sizes[r.finalTitle];
    if (s && s.chosen != null) { if (r.size == null) filled++; r.size = s.chosen; r.sizeSource = s.how.startsWith('article') ? 'article' : s.how; }
  }
  console.log(`article sizes: ${Object.keys(sizes).length} checked, ${filled} filled in where Wikidata had nothing`);
} catch {}
const MIN_SIZE = cfg.minSize == null ? null : Number(cfg.minSize);
// `floorExemptSources: ["list"]` lets a selective list page vouch for a place the floor would cut
const exempt = (r) => (cfg.floorExemptSources || []).some((s) => r.sources.has(s));
const belowFloor = MIN_SIZE == null ? [] : notThere.filter((r) => r.size != null && r.size < MIN_SIZE && !exempt(r));
const noFigure = MIN_SIZE == null ? [] : notThere.filter((r) => r.size == null && !exempt(r));
for (const r of belowFloor) r.floor = 'below';
for (const r of noFigure) r.floor = 'no-figure';
// `famousViews: N` fetches views for the below-floor items too, and lifts any with
// N+ views a month back into scope: a short river everyone looks up (the Mystic) is an answer
const FAMOUS = cfg.famousViews == null ? null : Number(cfg.famousViews);
// `noFigureViews: N` fetches views for the items no reference sizes (most bays,
// straits and small islands) and keeps those with N+ views/mo in scope, size
// unknown; chunk.mjs --allow-no-figure then writes them with size 0 (SPEC 4).
const NO_FIGURE_VIEWS = cfg.noFigureViews == null ? null : Number(cfg.noFigureViews);
const wantViews = notThere.filter((r) => !r.floor || (FAMOUS != null && r.floor === 'below') || (NO_FIGURE_VIEWS != null && r.floor === 'no-figure'));
if (MIN_SIZE != null) console.log(`floor ${MIN_SIZE} ${cfg.sizeUnit}: ${notThere.filter((r) => !r.floor).length} over it, ${belowFloor.length} below, ${noFigure.length} with no figure`);
const needViews = wantViews.filter((r) => !(r.finalTitle in memoViews));
for (let i = 0; i < needViews.length; i += 50) {
  const batch = needViews.slice(i, i + 50);
  let cont = {};
  let guard = 0;
  const got = new Map();
  do {
    const data = await api({ prop: 'pageviews', pvipdays: '60', titles: batch.map((r) => r.finalTitle).join('|'), ...cont });
    for (const p of data.query.pages || []) {
      const days = Object.values(p.pageviews || {}).filter((v) => typeof v === 'number');
      if (days.length) got.set(p.title, days);
    }
    cont = data.continue ? { pvipcontinue: data.continue.pvipcontinue, continue: data.continue.continue } : null;
  } while (cont && ++guard < 60);
  for (const r of batch) memoViews[r.finalTitle] = got.get(r.finalTitle) || [];
  if ((i / 50) % 10 === 9 || i + 50 >= needViews.length) {
    await writeFile(CACHE_FILE, JSON.stringify(cache));
    console.log(`  views: ${Math.min(i + 50, needViews.length)} / ${needViews.length}`);
  }
}
for (const r of wantViews) {
  const days = memoViews[r.finalTitle] || [];
  const sorted = days.slice().sort((a, b) => a - b);
  const med = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
  const mean = days.length ? days.reduce((a, b) => a + b, 0) / days.length : 0;
  r.views = days.length ? Math.max(1, Math.round((med || mean) * 30.44)) : null;
}

if (FAMOUS != null) {
  let lifted = 0;
  for (const r of belowFloor) if ((r.views || 0) >= FAMOUS) { r.floor = null; r.famous = true; lifted++; }
  console.log(`famous: ${lifted} below-floor items with ${FAMOUS}+ views/mo lifted back into scope`);
}
if (NO_FIGURE_VIEWS != null) {
  let kept = 0;
  for (const r of noFigure) if ((r.views || 0) >= NO_FIGURE_VIEWS) { r.floor = null; r.noFigure = true; kept++; }
  console.log(`no figure: ${kept} of ${noFigure.length} unsized items with ${NO_FIGURE_VIEWS}+ views/mo kept in scope (size unknown)`);
}
const noFigureOut = noFigure.filter((r) => r.floor === 'no-figure');

// ---- 6. report --------------------------------------------------------------
const present = items.filter((r) => r.status === 'present');
const inScope = (r) => !r.floor;
const taken = items.filter((r) => r.status === 'taken' && inScope(r));
const fuzzy = items.filter((r) => r.status === 'fuzzy' && inScope(r));
const missing = items.filter((r) => r.status === 'missing' && inScope(r));
const fmtSize = (r) => (r.size == null ? '' : cfg.sizeUnit === 'population' ? r.size.toLocaleString('en-US') : `${r.size} ${cfg.sizeUnit}`);
const flag = (r) => (FLAG && FLAG.test(r.description) ? ' [' + cfg.flagLabel + ']' : '');
const floorNote = MIN_SIZE == null ? '' : `; below the ${MIN_SIZE} ${cfg.sizeUnit} floor ${belowFloor.filter((r) => !r.famous).length}${FAMOUS != null ? ` (+${belowFloor.filter((r) => r.famous).length} famous, kept)` : ''}, no figure ${noFigureOut.length}${NO_FIGURE_VIEWS != null ? ` (+${noFigure.length - noFigureOut.length} with ${NO_FIGURE_VIEWS}+ views, kept unsized)` : ''}`;
console.log(`\n==== ${cfg.name}: ${items.length} articles; present ${present.length}, name taken by another entry ${taken.length}, fuzzy ${fuzzy.length}, missing ${missing.length}${floorNote} ====`);
console.log(`\n==== NAME TAKEN (${taken.length}) - typing the name lands on a different place ====`);
for (const r of taken.sort((a, b) => (b.views || 0) - (a.views || 0))) console.log(`  ${String(r.views ?? '').padStart(7)} views/mo  ${fmtSize(r).padStart(12)}  ${r.finalTitle.padEnd(38)} ${r.note}${flag(r)}`);
console.log(`\n==== FUZZY (${fuzzy.length}) - would be autocorrected to a different place ====`);
for (const r of fuzzy.sort((a, b) => (b.views || 0) - (a.views || 0))) console.log(`  ${String(r.views ?? '').padStart(7)} views/mo  ${fmtSize(r).padStart(12)}  ${r.finalTitle.padEnd(38)} ${r.how}${flag(r)}`);
console.log(`\n==== MISSING (${missing.length}) ====`);
for (const r of missing.sort((a, b) => (b.views || 0) - (a.views || 0))) console.log(`  ${String(r.views ?? '').padStart(7)} views/mo  ${fmtSize(r).padStart(12)}  ${r.finalTitle.padEnd(38)} ${r.description}${flag(r)}`);
console.log(`\n==== PRESENT (${present.length}) ====`);
console.log('  ' + present.map((r) => r.finalTitle).sort().join(' · '));
if (noFigureOut.length) {
  console.log(`\n==== NO FIGURE (${noFigureOut.length}) - not sized${NO_FIGURE_VIEWS != null ? ` and under ${NO_FIGURE_VIEWS} views/mo` : ', views not fetched'}; add with a figure from the article if wanted ====`);
  for (const r of noFigureOut.sort((a, b) => a.finalTitle.localeCompare(b.finalTitle))) console.log(`  ${r.finalTitle.padEnd(40)} ${r.status.padEnd(8)} ${String(r.views ?? '').padStart(6)} ${r.description}`);
}
if (belowFloor.length) {
  const lifted = belowFloor.filter((r) => r.famous);
  if (lifted.length) {
    console.log(`
==== BELOW FLOOR BUT FAMOUS (${lifted.length}; ${FAMOUS}+ views/mo, kept in scope) ====`);
    for (const r of lifted.sort((a, b) => (b.views || 0) - (a.views || 0))) console.log(`  ${String(r.views ?? '').padStart(7)} views/mo  ${fmtSize(r).padStart(12)}  ${r.finalTitle.padEnd(38)} ${r.status}`);
  }
  const traps = belowFloor.filter((r) => r.status === 'fuzzy' && !r.famous);
  console.log(`\n==== BELOW FLOOR (${belowFloor.length - lifted.length}; ${traps.length} of them would autocorrect elsewhere) ====`);
  for (const r of traps.sort((a, b) => (b.size || 0) - (a.size || 0))) console.log(`  ${fmtSize(r).padStart(12)}  ${r.finalTitle.padEnd(38)} ${r.how}`);
}
console.log(`\n==== SKIPPED (${skipped.length}) ====`);
for (const r of skipped) console.log(`  ${r.finalTitle.padEnd(40)} ${r.missing ? 'MISSING' : r.disambig ? 'DISAMBIG' : r.description}`);
await writeFile(`${S}/${cfg.name}.json`, JSON.stringify({ items: items.map((r) => ({ ...r, sources: [...r.sources], lists: r.lists ? [...r.lists] : undefined })), skipped }, null, 1));
