/**
 * Emits the shipped content bank from the authoring sources next door.
 *
 * SCORING MAGNITUDE = average monthly English-Wikipedia pageviews, taken from
 * src/data/pageviews.json (produced by `npm run fetch-pageviews`). The physical
 * stat each entry was authored with - population, area, length, elevation - is
 * kept alongside as `size`/`sizeUnit` for reference, but no longer scores.
 *
 *   src/data/*.json  - one file per category (Spec S4 schema); read by the
 *                      validator and by anyone maintaining the bank
 *   src/data/bank.js - the same entries as a plain <script> bundle, which is
 *                      what index.html actually loads, so the game runs from
 *                      file:// with no server and no fetch (README explains why)
 *
 * Run: npm run build-data
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { COUNTRIES } from './data-countries.mjs';
import { LAKES, RIVERS, MOUNTAINS, MINOR_PEAKS, DESERTS, ISLANDS, SEAS_OCEANS } from './data-physical.mjs';
import { oceansFor } from './data-oceans.mjs';
import { flagsByCountry } from './data-flags.mjs';
import { US_STATE_CAPITALS, US_POPULATION } from './data-us-states.mjs';

const OUT = fileURLToPath(new URL('../src/data/', import.meta.url));

const slug = (s) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const lines = (block) => block.trim().split('\n').map((l) => l.trim()).filter(Boolean);
const list = (s) => (s || '').split(',').map((x) => x.trim()).filter(Boolean);

/**
 * Simple "Name|size|aliases" blocks. A size may be a range "lo-hi" where
 * reputable figures disagree (the Amur is 2,824 km, or 4,444 with the Argun);
 * `size` is then the low figure and `sizeRange` carries both, and a threshold
 * prompt accepts either end (promptBank.satisfiesSize).
 */
function simple(block, category, sizeUnit, source) {
  return lines(block).map((line) => {
    const [name, size, aliases] = line.split('|');
    const range = /^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/.exec(size.trim());
    const entry = {
      id: `${category}-${slug(name)}`,
      category,
      name: name.trim(),
      aliases: list(aliases),
      size: range ? Number(range[1]) : Number(size),
      sizeUnit,
      source
    };
    if (range) entry.sizeRange = [Number(range[1]), Number(range[2])];
    return entry;
  });
}

// --- countries + capitals ---------------------------------------------------
const POP_SOURCE = 'UN World Population Prospects / World Bank 2023-24 estimate (rounded)';

/**
 * The whole bank, keyed by output filename, WITHOUT the pageview magnitude.
 * fetch-pageviews.mjs imports this so it can look up every entry before the
 * built JSON exists - otherwise the build would need the pageviews that the
 * fetch needs the build to produce.
 */
export function buildFiles() {
const countries = [];
const capitals = [];
// Flag colours are authored in their own file, keyed by country name; every
// country must have a row and every row must name a country.
const flags = flagsByCountry();
const unusedFlags = new Set(flags.keys());

for (const line of lines(COUNTRIES)) {
  const [name, capital, pop, region, subs, aliases, capitalAliases] = line.split('|');
  const regions = [region.trim(), ...list((subs || '').replace(/\+/g, ','))];
  const population = Number(pop);
  const flag = flags.get(name.trim());
  if (!flag) throw new Error(`data-flags.mjs has no row for ${name.trim()}`);
  unusedFlags.delete(name.trim());

  countries.push({
    id: `country-${slug(name)}`,
    category: 'country',
    name: name.trim(),
    aliases: list(aliases),
    size: population,
    sizeUnit: 'population',
    region: regions,
    flag,
    source: POP_SOURCE
  });

  capitals.push({
    id: `capital-${slug(capital)}`,
    category: 'capital',
    name: capital.trim(),
    aliases: list(capitalAliases),
    // Spec S6 had a capital inherit its country's population. Scoring by
    // pageviews makes that unnecessary: a capital now carries its own fame, so
    // Ngerulmud is obscure even though Palau is a country like any other.
    size: population,
    sizeUnit: 'population_of_country',
    region: regions,
    country: name.trim(),
    flag, // "Name a capital city whose country's flag has green in it."
    source: `Capital of ${name.trim()}; country population per ${POP_SOURCE}`
  });
}

// US state capitals feed the same cohort (see data-us-states.mjs).
const usFlag = flags.get('United States');
const stateCapitals = lines(US_STATE_CAPITALS).map((line) => {
  const [capital, state, aliases] = line.split('|');
  return {
    id: `capital-${slug(capital)}`,
    category: 'capital',
    name: capital.trim(),
    aliases: list(aliases),
    size: US_POPULATION,
    sizeUnit: 'population_of_country',
    region: ['North America'],
    country: 'United States',
    state: state.trim(),
    flag: usFlag,
    source: `Capital of ${state.trim()}, United States; US population per ${POP_SOURCE}`
  };
});
if (unusedFlags.size) throw new Error(`data-flags.mjs rows that match no country: ${[...unusedFlags].join(', ')}`);

return {
  'countries.json': countries,
  'capitals.json': capitals,
  'us-state-capitals.json': stateCapitals,
  'lakes.json': simple(LAKES, 'lake', 'area_km2', 'Standard reference surface-area figures (km2), rounded'),
  'rivers.json': simple(RIVERS, 'river', 'length_km', 'Standard reference lengths (km); one figure picked per river, see Spec 6.2'),
  'mountains.json': simple(MOUNTAINS, 'mountain', 'elevation_m', 'Standard reference summit elevations (m)'),
  'minor-peaks.json': simple(MINOR_PEAKS, 'mountain', 'elevation_m', 'Standard reference summit elevations (m); minor peaks and hills, feeds the mountain cohort'),
  'deserts.json': simple(DESERTS, 'desert', 'area_km2', 'Standard reference desert areas (km2), rounded'),
  'islands.json': simple(ISLANDS, 'island', 'area_km2', 'Standard reference island areas (km2), rounded'),
  'seas-oceans.json': simple(SEAS_OCEANS, 'sea_ocean', 'area_km2', 'Standard reference sea and ocean areas (km2), rounded')
};
}

// Everything below only runs when this file is executed as a script.
if (!process.argv[1] || !process.argv[1].endsWith('build-data.mjs')) {
  // imported for buildFiles() only
} else {
const files = buildFiles();

// --- attach the scoring magnitude: monthly Wikipedia pageviews --------------
let pageviews;
try {
  pageviews = JSON.parse(await readFile(OUT + 'pageviews.json', 'utf8'));
} catch {
  console.error('src/data/pageviews.json is missing - run `npm run fetch-pageviews` first.');
  process.exit(1);
}

const missing = [];
for (const entries of Object.values(files)) {
  for (const entry of entries) {
    const record = pageviews.entries[entry.id];
    if (!record || !(record.monthlyViews > 0)) {
      missing.push(entry.id);
      continue;
    }
    entry.magnitude = record.monthlyViews;
    entry.magnitudeUnit = 'pageviews_monthly';
    entry.wikiTitle = record.title;
    if (Number.isFinite(record.lat) && Number.isFinite(record.lon)) {
      entry.lat = record.lat;
      entry.lon = record.lon;
    }
    entry.source =
      `English Wikipedia pageviews for "${record.title}", ${pageviews.days}-day daily median ` +
      `(${pageviews.window}); ${entry.source}`;

    // Islands and seas carry the ocean(s) they belong to, derived from the
    // article's coordinates and corrected by hand (scripts/data-oceans.mjs).
    if (entry.category === 'island' || entry.category === 'sea_ocean') {
      entry.oceans = oceansFor(entry);
    }
  }
}

if (missing.length) {
  console.error(`no pageviews for ${missing.length} entr(ies): ${missing.slice(0, 10).join(', ')}`);
  console.error('Run `npm run fetch-pageviews` after changing the bank.');
  process.exit(1);
}

let total = 0;
for (const [file, entries] of Object.entries(files)) {
  await writeFile(OUT + file, JSON.stringify(entries, null, 1) + '\n', 'utf8');
  total += entries.length;
  console.log(String(entries.length).padStart(4), file);
}

// The <script>-tag bundle: same entries, no fetch required. `source` and
// `magnitudeUnit` are maintainer metadata the game never reads, so they stay in
// the JSON files and out of the bytes every player downloads.
const runtimeEntry = (e) => {
  const out = {
    id: e.id,
    category: e.category,
    name: e.name,
    aliases: e.aliases,
    magnitude: e.magnitude,
    size: e.size // population / area / length / elevation - used by threshold prompts
  };
  if (e.region) out.region = e.region;
  if (e.oceans) out.oceans = e.oceans;
  if (e.flag) out.flag = e.flag;
  if (e.sizeRange) out.sizeRange = e.sizeRange;
  return out;
};

const bundle =
  '/* GENERATED by scripts/build-data.mjs - do not edit by hand. */\n' +
  'globalThis.WORMILLION_BANK = ' +
  JSON.stringify(
    Object.fromEntries(
      Object.entries(files).map(([f, entries]) => [f.replace(/\.json$/, ''), entries.map(runtimeEntry)])
    )
  ) +
  ';\n';
await writeFile(OUT + 'bank.js', bundle, 'utf8');

console.log(`${total} entries total; bank.js is ${(bundle.length / 1024).toFixed(0)} KB`);
}
