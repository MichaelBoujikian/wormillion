/**
 * Fetches average monthly English-Wikipedia pageviews for every entry in the
 * bank and writes them to src/data/pageviews.json, which `build-data.mjs` uses
 * as the scoring magnitude (Spec 5.1).
 *
 *   npm run fetch-pageviews -- --check    resolve titles and report problems only
 *   npm run fetch-pageviews               resolve, fetch views, write the file
 *
 * The result is committed, so the game itself never touches the network: it
 * ships a snapshot, not a live feed.
 *
 * Two APIs are used:
 *   - action=query on en.wikipedia.org      resolve redirects, spot disambiguation
 *     pages and missing pages, and pull the Wikidata short description so a
 *     wrong-subject match ("Cam" -> the disambiguation page) is caught rather
 *     than silently scored.
 *   - action=query&prop=pageviews on the same host, which returns 60 days of
 *     daily counts for a batch of titles at a time. (The per-article REST
 *     endpoint gives a longer window but rate-limits anonymous clients to a few
 *     hundred requests an hour, and this bank needs about 950.)
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { WIKI_TITLES, WIKI_VERIFIED } from './data-wiki-titles.mjs';
import { buildFiles } from './build-data.mjs';

const DATA = fileURLToPath(new URL('../src/data/', import.meta.url));
const UA = 'Wormillion/1.0 (offline geography quiz game; one-off data build; contact: repository issues)';
const CHECK_ONLY = process.argv.includes('--check');

// 60 days of daily counts - the most this endpoint will give - reduced to a
// median so a single news spike can't pass for lasting fame.
const DAYS = 60;

// A description that mentions none of these for its category means the title
// probably resolved to the wrong subject.
const EXPECTED = {
  country: ['countr', 'nation', 'state', 'republic', 'territory', 'kingdom', 'federation', 'island in', 'city-state', 'microstate', 'enclave'],
  capital: ['capital', 'city', 'town', 'municipal', 'seat', 'district', 'commune', 'village'],
  city: ['city', 'town', 'municipal', 'metropolis', 'capital', 'district', 'commune', 'prefecture', 'borough', 'settlement', 'urban', 'seaport', 'port city', 'port town', 'seat', 'conurbation',
    // the 2026-09 expansion: Wikidata describes Italian cities as "Comune in…", Spanish and Latin
    // American ones as "Place in…"/"Municipio", Maltese ones as "Local council", resorts as such
    'comune', 'municipio', 'local council', 'resort', 'quarter', 'castello', 'place in', 'census-designated',
    // the 2026-09 US scouring: Illinois incorporates 80,000-person suburbs as villages, and
    // East Los Angeles (118,000) and Silver Spring (81,000) are "unincorporated communities"
    'village', 'unincorporated community'],
  lake: ['lake', 'loch', 'llyn', 'reservoir', 'lagoon', 'body of water', 'endorheic', 'sea', 'water'],
  river: ['river', 'stream', 'tributary', 'waterway', 'watercourse',
    // the 2026-09 US scouring: Wikidata describes American streams as creeks, bayous, forks, runs, brooks
    'creek', 'bayou', 'brook', 'fork', 'branch', 'slough', 'arroyo', 'run in', 'kill in', 'wash in', 'water course'],
  mountain: ['mountain', 'peak', 'summit', 'hill', 'volcano', 'massif', 'mount', 'highest', 'ridge', 'butte', 'mesa', 'monolith', 'crag', 'fell', 'point', 'elevation', 'cliff', 'high',
    // the 2026-09 US scouring: domes, lava domes, cryptodomes, craters and calderas are peaks too
    'dome', 'lava', 'volcanic', 'crater', 'caldera', 'knob'],
  desert: ['desert', 'sand', 'dune', 'arid', 'erg', 'steppe', 'area', 'region', 'plain'],
  island: ['island', 'isle', 'archipelago', 'atoll', 'islet', 'countr', 'territory', 'landmass'],
  // 2026-09-17: Europe's coast is fjords, firths, sea lochs, inlets and lagoons
  sea_ocean: ['sea', 'ocean', 'gulf', 'bay', 'strait', 'body of water', 'water', 'channel', 'sound', 'basin', 'fjord', 'firth', 'inlet', 'lagoon', 'loch', 'lough', 'estuary', 'cove', 'bight', 'voe', 'kyle', 'roads',
    // 2026-09-17: the US no-figure re-run - harbors, passages, arms of the Great Lakes
    'harbor', 'harbour', 'passage', 'arm of', 'narrows']
};

// Words that mark an article as being about something that merely carries the
// place's name. Checked against the resolved title and its description.
// Whole words only: "Songhua" is not a song, "chief port of Jamaica" is a capital.
const WRONG_SUBJECT = /\b(airport|aerodrome|airstrip|air base|railway station|metro station|train station|light rail|high school|university|crash|shipwreck|battle of|football club|sports club|stadium|hotel|company|newspaper|album|film|novel|song|sc)\b/i;
const wrongSubject = (title, description) => {
  const m = (title || '').match(WRONG_SUBJECT) || (description || '').match(WRONG_SUBJECT) || (title || '').match(/^port of /i);
  return m ? m[0] : undefined;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const BACKOFF = [2000, 5000, 15000, 30000, 60000];

async function getJSON(url, attempt = 0) {
  let response;
  try {
    response = await fetch(url, { headers: { 'User-Agent': UA, accept: 'application/json' } });
  } catch (error) {
    if (attempt >= BACKOFF.length) throw error;
    await sleep(BACKOFF[attempt]);
    return getJSON(url, attempt + 1);
  }
  if (response.status === 404) return { __notFound: true };
  if (!response.ok) {
    if (attempt < BACKOFF.length && (response.status === 429 || response.status >= 500)) {
      const retryAfter = Number(response.headers.get('retry-after')) * 1000;
      await sleep(Math.max(BACKOFF[attempt], retryAfter || 0));
      return getJSON(url, attempt + 1);
    }
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }
  return response.json();
}

/**
 * Both lookups are cached on disk. Title resolution and a month of pageviews
 * don't change between runs, and re-fetching a thousand articles every time you
 * tweak an override is rude to Wikimedia and slow for you.
 */
const CACHE_DIR = fileURLToPath(new URL('./.cache/', import.meta.url));

async function readCache(name) {
  try {
    return JSON.parse(await readFile(CACHE_DIR + name, 'utf8'));
  } catch {
    return {};
  }
}

async function writeCache(name, data) {
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(CACHE_DIR + name, JSON.stringify(data), 'utf8');
}

/**
 * Every entry in the bank, with the Wikipedia title we intend to ask about.
 * Read from the authoring sources, not the built JSON, so a newly added place
 * can be looked up before it has a pageview count to be built with.
 */
function loadEntries() {
  const entries = [];
  for (const list of Object.values(buildFiles())) {
    for (const entry of list) {
      entries.push({
        id: entry.id,
        name: entry.name,
        category: entry.category,
        title: WIKI_TITLES[entry.id] || entry.name,
        overridden: Boolean(WIKI_TITLES[entry.id])
      });
    }
  }
  return entries;
}

/** Resolve redirects and classify each title. Batches of 50, as the API allows. */
async function resolveTitles(entries) {
  const byTitle = new Map();
  for (const entry of entries) {
    if (!byTitle.has(entry.title)) byTitle.set(entry.title, []);
    byTitle.get(entry.title).push(entry);
  }
  const cache = await readCache('titles.json');
  const titles = [...byTitle.keys()];
  const resolved = new Map(
    Object.entries(cache).filter(([title, r]) => byTitle.has(title) && 'lat' in r)
  );
  const todo = titles.filter((title) => !resolved.has(title));
  if (resolved.size) console.log(`${resolved.size} title(s) from cache, ${todo.length} to look up`);

  for (let i = 0; i < todo.length; i += 50) {
    const batch = todo.slice(i, i + 50);
    const url =
      'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&redirects=1' +
      '&prop=description|pageprops|coordinates&ppprop=disambiguation&colimit=max&titles=' +
      encodeURIComponent(batch.join('|'));
    const data = await getJSON(url);

    // Map the requested title through normalization and redirects to the final one.
    const forward = new Map(batch.map((t) => [t, t]));
    for (const step of [...(data.query.normalized || []), ...(data.query.redirects || [])]) {
      for (const [from, to] of forward) if (to === step.from) forward.set(from, step.to);
    }
    const pages = new Map(data.query.pages.map((p) => [p.title, p]));

    for (const requested of batch) {
      const page = pages.get(forward.get(requested));
      const coord = page && page.coordinates && page.coordinates[0];
      resolved.set(requested, {
        finalTitle: page ? page.title : forward.get(requested),
        missing: !page || page.missing === true,
        disambiguation: Boolean(page && page.pageprops && 'disambiguation' in page.pageprops),
        description: (page && page.description) || '',
        lat: coord ? coord.lat : null,
        lon: coord ? coord.lon : null
      });
    }
    process.stdout.write(`\rresolving titles ${Math.min(i + 50, todo.length)}/${todo.length}`);
    await writeCache('titles.json', Object.fromEntries(resolved));
    await sleep(500);
  }
  if (todo.length) process.stdout.write('\n');

  for (const entry of entries) Object.assign(entry, resolved.get(entry.title));
  return entries;
}

/** Flag anything that shouldn't be scored as-is. */
function audit(entries) {
  const problems = [];
  for (const entry of entries) {
    if (entry.missing) problems.push({ ...entry, why: 'no such article' });
    else if (entry.disambiguation) problems.push({ ...entry, why: 'disambiguation page' });
    else if (WIKI_VERIFIED.has(entry.id)) continue; // subject checked by hand
    // A title or description naming an airport, a station, a school, a crash… is a
    // different subject that merely mentions the place (the 2026-09 audit found
    // Pisa scoring on its airport); refuse it whatever the category words say.
    else if (wrongSubject(entry.finalTitle, entry.description)) {
      problems.push({ ...entry, why: `reads like a different subject (${wrongSubject(entry.finalTitle, entry.description)})` });
    }
    else if (!entry.description) problems.push({ ...entry, why: 'no short description (unverified subject)' });
    else {
      const description = entry.description.toLowerCase();
      const expected = EXPECTED[entry.category];
      if (!expected.some((word) => description.includes(word))) {
        problems.push({ ...entry, why: `description does not look like a ${entry.category}` });
      }
    }
  }
  return problems;
}

/**
 * Daily pageviews for a batch of articles, via action=query&prop=pageviews.
 *
 * The per-article REST endpoint would be the obvious choice, but anonymous
 * clients get a few hundred requests an hour there and this bank needs ~950.
 * This endpoint takes 50 titles at a time (filling in a handful per round trip
 * and handing back a `pvipcontinue` for the rest), which brings the whole bank
 * into a couple of hundred polite requests.
 *
 * @returns {Map<string, number[]>} title -> daily view counts
 */
async function dailyViews(titles, onProgress) {
  const out = new Map();
  for (let i = 0; i < titles.length; i += 50) {
    const batch = titles.slice(i, i + 50);
    let cont = {};
    let guard = 0;
    do {
      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        formatversion: '2',
        prop: 'pageviews',
        pvipdays: String(DAYS),
        titles: batch.join('|'),
        ...cont
      });
      const data = await getJSON('https://en.wikipedia.org/w/api.php?' + params);
      for (const page of data.query?.pages || []) {
        const days = Object.values(page.pageviews || {}).filter((v) => typeof v === 'number');
        if (days.length) out.set(page.title, days);
      }
      cont = data.continue ? { pvipcontinue: data.continue.pvipcontinue, continue: data.continue.continue } : null;
      onProgress(out.size);
      await sleep(900);
    } while (cont && ++guard < 60);
  }
  return out;
}

/**
 * Typical monthly views for one article: the MEDIAN daily count scaled to a
 * month. Median rather than mean so one news cycle - a coup, an earthquake, a
 * film release - can't make a well-known place look famous for a year.
 */
function monthlyFromDaily(days) {
  if (!days || days.length === 0) return 0;
  const sorted = days.slice().sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const mean = days.reduce((a, b) => a + b, 0) / days.length;
  return Math.max(1, Math.round((median || mean) * 30.44));
}

// --- run --------------------------------------------------------------------
const entries = await resolveTitles(loadEntries());
const problems = audit(entries);

// A redirect can quietly land on a related-but-different subject, which no
// keyword check would catch. List them so a human can eyeball the mapping.
if (CHECK_ONLY) {
  const redirected = entries.filter((e) => e.finalTitle && e.finalTitle !== e.title && !e.overridden);
  console.log(`\n${redirected.length} name(s) reached their article through a redirect:`);
  for (const e of redirected) {
    console.log(`  ${e.name.padEnd(26)} -> "${e.finalTitle}" (${e.description || 'no description'})`);
  }
}

if (problems.length) {
  console.log(`\n${problems.length} title(s) need attention (add an override in scripts/data-wiki-titles.mjs):\n`);
  for (const p of problems) {
    console.log(`  ${p.id.padEnd(34)} "${p.title}" -> ${p.why}${p.description ? ` ("${p.description}")` : ''}`);
  }
} else {
  console.log('\nall titles resolve to a plausible article');
}

if (CHECK_ONLY) {
  process.exit(problems.length ? 1 : 0);
}
if (problems.length) {
  console.error('\nRefusing to write pageviews while titles are unresolved - fix them first.');
  process.exit(1);
}

const uniqueTitles = [...new Set(entries.map((e) => e.finalTitle))];
console.log(`\nfetching ${DAYS} days of pageviews for ${uniqueTitles.length} articles`);

const cached = await readCache(`views-${DAYS}d.json`);
const fresh = uniqueTitles.filter((t) => !cached[t]);
if (fresh.length < uniqueTitles.length) {
  console.log(`${uniqueTitles.length - fresh.length} from cache, ${fresh.length} to fetch`);
}

const fetched = await dailyViews(fresh, (done) => {
  process.stdout.write(`\r  ${done}/${fresh.length}`);
});
process.stdout.write('\n');
for (const [title, days] of fetched) cached[title] = days;
await writeCache(`views-${DAYS}d.json`, cached);

const out = {
  window: `${DAYS} days ending ${new Date().toISOString().slice(0, 10)}`,
  metric: 'median daily English Wikipedia pageviews, scaled to a 30.44-day month',
  days: DAYS,
  fetched: new Date().toISOString(),
  entries: {}
};
const empty = [];
const views = entries.map((entry) => monthlyFromDaily(cached[entry.finalTitle]));
entries.forEach((entry, i) => {
  if (!cached[entry.finalTitle] || views[i] <= 0) empty.push(entry);
  out.entries[entry.id] = {
    title: entry.finalTitle,
    monthlyViews: views[i],
    days: (cached[entry.finalTitle] || []).length,
    lat: entry.lat,
    lon: entry.lon
  };
});

if (empty.length) {
  console.error(`\n${empty.length} article(s) returned no pageviews:`);
  for (const entry of empty) console.error(`  ${entry.id} ("${entry.finalTitle}")`);
  console.error('Refusing to write: a zero would score as maximally obscure.');
  process.exit(1);
}

await writeFile(DATA + 'pageviews.json', JSON.stringify(out, null, 1) + '\n', 'utf8');

const sorted = entries.map((e, i) => ({ name: e.name, views: views[i] })).sort((a, b) => b.views - a.views);
console.log(`\nwrote pageviews.json for ${entries.length} entries`);
console.log(`  most viewed:  ${sorted.slice(0, 3).map((e) => `${e.name} ${e.views.toLocaleString()}`).join(', ')}`);
console.log(`  least viewed: ${sorted.slice(-3).map((e) => `${e.name} ${e.views.toLocaleString()}`).join(', ')}`);
