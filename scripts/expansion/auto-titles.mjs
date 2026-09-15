/**
 * Auto-resolve Wikipedia titles for one category of the bank.
 *   node auto-titles.mjs <category> [--apply]
 * Audits every entry like fetch-pageviews --check does (missing page,
 * disambiguation page, description that doesn't read like the category);
 * for each problem it tries a list of candidate titles (and, for a
 * disambiguation page, every link on that page that starts with the name),
 * keeps the first that is a real page whose description matches the category,
 * and writes fixes-auto.json { titles }. Whatever it can't settle is printed
 * with its current description so a human can decide (WIKI_VERIFIED or a
 * hand-picked title). --apply runs fix-titles.mjs on the result.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const REPO = fileURLToPath(new URL('../../', import.meta.url));
const HERE = fileURLToPath(new URL('./work/', import.meta.url)); mkdirSync(HERE, { recursive: true });
const category = process.argv[2];
const APPLY = process.argv.includes('--apply');
if (!category) { console.error('usage: node auto-titles.mjs <category> [--apply]'); process.exit(2); }

const { buildFiles } = await import(new URL('../build-data.mjs', import.meta.url).href);
const { WIKI_TITLES, WIKI_VERIFIED } = await import(new URL('../data-wiki-titles.mjs?t=' + Date.now(), import.meta.url).href);

// same heuristic words as scripts/fetch-pageviews.mjs
const EXPECTED = {
  country: ['countr', 'nation', 'state', 'republic', 'territory', 'kingdom', 'federation', 'island in', 'city-state', 'microstate', 'enclave'],
  capital: ['capital', 'city', 'town', 'municipal', 'seat', 'district', 'commune', 'village'],
  city: ['city', 'town', 'municipal', 'metropolis', 'capital', 'district', 'commune', 'prefecture', 'borough', 'settlement', 'urban', 'port', 'seat', 'conurbation',
    'comune', 'municipio', 'local council', 'resort', 'quarter', 'castello', 'place in', 'census-designated'],
  lake: ['lake', 'loch', 'llyn', 'reservoir', 'lagoon', 'body of water', 'endorheic', 'sea', 'water'],
  river: ['river', 'stream', 'tributary', 'waterway', 'watercourse'],
  mountain: ['mountain', 'peak', 'summit', 'hill', 'volcano', 'massif', 'mount', 'highest', 'ridge', 'butte', 'mesa', 'monolith', 'crag', 'fell', 'point', 'elevation', 'cliff', 'high'],
  desert: ['desert', 'sand', 'dune', 'arid', 'erg', 'steppe', 'area', 'region', 'plain'],
  island: ['island', 'isle', 'archipelago', 'atoll', 'islet', 'countr', 'territory', 'landmass'],
  sea_ocean: ['sea', 'ocean', 'gulf', 'bay', 'strait', 'body of water', 'water', 'channel', 'sound', 'basin']
};
const looksRight = (desc) => EXPECTED[category].some((w) => desc.toLowerCase().includes(w));

const UA = 'Wormillion/1.0 (offline geography quiz game; data build; contact: repository issues)';
const CACHE = HERE + 'titles-cache.json';
const cache = existsSync(CACHE) ? JSON.parse(await readFile(CACHE, 'utf8')) : {};
// seed from the repo's own resolver cache so known titles cost no requests
const REPO_CACHE = REPO + 'scripts/.cache/titles.json';
if (existsSync(REPO_CACHE)) {
  for (const [t, r] of Object.entries(JSON.parse(await readFile(REPO_CACHE, 'utf8')))) {
    if (!(t in cache)) cache[t] = { finalTitle: r.finalTitle, missing: r.missing, disambig: r.disambiguation, description: r.description || '' };
  }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const url = 'https://en.wikipedia.org/w/api.php?' + new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', ...params });
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.ok) return res.json();
    if (attempt >= 6) throw new Error(`${res.status} for ${url}`);
    const retryAfter = Number(res.headers.get('retry-after')) * 1000 || 0;
    await sleep(Math.max(5000 * (attempt + 1), retryAfter));
  }
}

/** resolve titles -> { finalTitle, missing, disambig, description } (cached) */
async function resolve(titles) {
  const todo = [...new Set(titles)].filter((t) => !(t in cache));
  for (let i = 0; i < todo.length; i += 50) {
    const batch = todo.slice(i, i + 50);
    const data = await api({ redirects: '1', prop: 'description|pageprops', ppprop: 'disambiguation', titles: batch.join('|') });
    const forward = new Map(batch.map((t) => [t, t]));
    for (const step of [...(data.query.normalized || []), ...(data.query.redirects || [])]) {
      for (const [from, to] of forward) if (to === step.from) forward.set(from, step.to);
    }
    const pages = new Map((data.query.pages || []).map((p) => [p.title, p]));
    for (const t of batch) {
      const p = pages.get(forward.get(t));
      cache[t] = {
        finalTitle: p ? p.title : forward.get(t),
        missing: !p || p.missing === true,
        disambig: Boolean(p && p.pageprops && 'disambiguation' in p.pageprops),
        description: (p && p.description) || ''
      };
    }
    await writeFile(CACHE, JSON.stringify(cache), 'utf8');
    await sleep(1200);
  }
  return titles.map((t) => cache[t]);
}

/** links on a disambiguation page */
async function links(title) {
  const key = 'links:' + title;
  if (key in cache) return cache[key];
  const out = [];
  let cont = {};
  do {
    const data = await api({ prop: 'links', plnamespace: '0', pllimit: 'max', titles: title, ...cont });
    for (const p of data.query.pages || []) for (const l of p.links || []) out.push(l.title);
    cont = data.continue ? { plcontinue: data.continue.plcontinue } : null;
    await sleep(300);
  } while (cont);
  cache[key] = out;
  await writeFile(CACHE, JSON.stringify(cache), 'utf8');
  return out;
}

/** full-text search fallback: titles of the top hits */
async function search(q) {
  const key = 'search:' + q;
  if (key in cache) return cache[key];
  const data = await api({ list: 'search', srsearch: q, srlimit: '8', srnamespace: '0' });
  const out = (data.query?.search || []).map((h) => h.title);
  cache[key] = out;
  await writeFile(CACHE, JSON.stringify(cache), 'utf8');
  await sleep(600);
  return out;
}
const SEARCH_WORD = { river: 'river', island: 'island', lake: 'lake', mountain: 'mountain', desert: 'desert', sea_ocean: 'sea', city: '' };

const fold = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function candidatesFor(entry, title) {
  const n = entry.name;
  const base = title.replace(/\s*\(.*\)$/, '');
  const c = [];
  const push = (...xs) => xs.forEach((x) => { if (x && !c.includes(x)) c.push(x); });
  switch (category) {
    case 'river': push(`${base} River`, `${base} (river)`, `River ${base}`, `${n} River`, `${n} (river)`, `River ${n}`, `Río ${n}`, `Rio ${n}`); break;
    case 'island': push(`${base} (island)`, `${base} Island`, `Isle of ${base}`, `${n} (island)`, `${n} Island`, `${n} Islands`, `Isla ${n}`, `${base} (Antarctica)`); break;
    case 'lake': push(`Lake ${base}`, `${base} (lake)`, `${base} Lake`, `Lake ${n}`, `${n} (lake)`, `${n} Lake`, `Loch ${n}`, `Lough ${n}`, `${n} Reservoir`); break;
    case 'mountain': push(`Mount ${base}`, `${base} (mountain)`, `${base} Mountain`, `${base} Peak`, `${base} (volcano)`, `${base} (hill)`, `Mount ${n}`, `${n} (mountain)`, `${n} Mountain`, `${n} Peak`, `${n} (volcano)`, `${n} (peak)`, `Pico ${n}`, `Cerro ${n}`, `Volcán ${n}`, `Nevado ${n}`); break;
    case 'desert': push(`${base} Desert`, `${base} (desert)`, `${n} Desert`, `${n} (desert)`); break;
    case 'sea_ocean': push(`${base} (sea)`, `${base} Sea`, `Gulf of ${base}`, `${base} Gulf`, `Bay of ${base}`, `${base} Bay`, `Strait of ${base}`, `${base} Strait`, `${base} (strait)`, `${base} (bay)`, `${base} Channel`, `${base} Sound`); break;
    case 'city': push(`${base} (city)`, `${base} City`, `${n} (city)`, `${n}, ${entry.country}`, `${n} City`); break;
    default: break;
  }
  return c;
}

// --- audit ------------------------------------------------------------------
const entries = Object.values(buildFiles()).flat().filter((e) => e.category === category);
const titleOf = (e) => WIKI_TITLES[e.id] || e.name;
const resolved = await resolve(entries.map(titleOf));
const problems = [];
entries.forEach((e, i) => {
  const r = resolved[i];
  if (r.missing) problems.push({ e, r, why: 'missing' });
  else if (r.disambig) problems.push({ e, r, why: 'disambig' });
  else if (!WIKI_VERIFIED.has(e.id) && !looksRight(r.description)) problems.push({ e, r, why: `desc: ${r.description || '(none)'}` });
});
console.log(`${category}: ${entries.length} entries, ${problems.length} problem(s)`);

// --- try candidates ----------------------------------------------------------
const fixes = {};
const unresolved = [];
for (const p of problems) {
  const title = titleOf(p.e);
  let cands = candidatesFor(p.e, title);
  if (p.r.disambig || (p.r.missing && cands.length === 0)) {
    const dis = p.r.disambig ? p.r.finalTitle : null;
    if (dis) {
      const ls = await links(dis);
      const nf = fold(p.e.name);
      const bf = fold(title.replace(/\s*\(.*\)$/, ''));
      cands = cands.concat(ls.filter((l) => { const f = fold(l); return f.startsWith(nf) || f.startsWith(bf) || f.includes('(' ) && f.includes(nf); }));
    }
  }
  let rs = cands.length ? await resolve(cands) : [];
  let hit = null;
  for (let i = 0; i < cands.length; i++) {
    const r = rs[i];
    if (!r.missing && !r.disambig && looksRight(r.description)) { hit = r.finalTitle; break; }
  }
  if (!hit) {
    // last resort: full-text search, accept a hit that carries the name and reads like the category
    const q = category === 'city' ? `${p.e.name} ${p.e.country || ''}` : `${p.e.name} ${SEARCH_WORD[category]}`;
    const found = (await search(q.trim())).filter((t) => fold(t).includes(fold(p.e.name).split(' ')[0]));
    if (found.length) {
      const fr = await resolve(found);
      for (let i = 0; i < found.length; i++) {
        if (!fr[i].missing && !fr[i].disambig && looksRight(fr[i].description)) { hit = fr[i].finalTitle; cands = found; break; }
      }
    }
  }
  if (hit) {
    fixes[p.e.id] = hit;
    console.log(`  ${p.e.id.padEnd(36)} "${title}" (${p.why}) -> "${hit}" (${cache[cands.find((c) => cache[c].finalTitle === hit) || cands[0]].description})`);
  } else unresolved.push(p);
}

console.log(`\nresolved ${Object.keys(fixes).length}; unresolved ${unresolved.length}:`);
for (const p of unresolved) {
  console.log(`  ${p.e.id.padEnd(36)} "${titleOf(p.e)}" -> ${p.why}${p.r.finalTitle !== titleOf(p.e) ? ` [final: ${p.r.finalTitle}]` : ''}`);
}
await writeFile(HERE + 'fixes-auto.json', JSON.stringify({ note: `${category} auto-resolved titles (2026-09-14 expansion)`, titles: fixes }, null, 1), 'utf8');
if (APPLY && Object.keys(fixes).length) {
  const r = spawnSync(process.execPath, [HERE + 'fix-titles.mjs', HERE + 'fixes-auto.json'], { encoding: 'utf8' });
  process.stdout.write(r.stdout + r.stderr);
}
