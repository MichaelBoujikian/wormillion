/**
 * Content-bank validation (Spec 6.4). Run: npm run validate
 *
 * Fails (non-zero exit) on: a missing/invalid field, a non-positive magnitude,
 * a duplicate id, an alias that collides with another entry in the same cohort,
 * or a bad region tag. Entry counts below target only warn.
 */
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { UN_MEMBERS, UN_OBSERVERS, COMMONLY_TAUGHT } from './data-un-members.mjs';

const DATA_DIR = fileURLToPath(new URL('../src/data/', import.meta.url));

export const CATEGORIES = ['country', 'capital', 'lake', 'river', 'mountain', 'desert', 'island', 'sea_ocean'];

export const REGIONS = new Set([
  'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania',
  'West Africa', 'East Africa', 'North Africa', 'Southern Africa',
  'Middle East', 'South Asia', 'Southeast Asia', 'East Asia', 'Central Asia',
  'Caribbean', 'Central America', 'Eastern Europe', 'Western Europe',
  'Scandinavia & the Nordics'
]);

export const TARGETS = {
  country: 195, capital: 195, lake: 70, river: 70,
  mountain: 100, desert: 30, island: 70, sea_ocean: 60
};

// The scoring magnitude is always monthly Wikipedia pageviews now; the physical
// stat an entry was authored with is kept as size/sizeUnit for reference only.
const MAGNITUDE_UNITS = new Set(['pageviews_monthly']);
const SIZE_UNITS = new Set(['population', 'population_of_country', 'area_km2', 'length_km', 'elevation_m']);

/** Same normalization the game uses (Spec 3.7), duplicated to keep this script dependency-free. */
export function normalize(input) {
  return String(input)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[–—‒]/g, '-')
    .replace(/[.,']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @param {Record<string, object[]>} files  filename -> entries
 * @returns {{errors:string[], warnings:string[], counts:Record<string,number>}}
 */
export function validate(files) {
  const errors = [];
  const warnings = [];
  const ids = new Map();
  const cohorts = new Map();

  for (const [file, entries] of Object.entries(files)) {
    if (!Array.isArray(entries)) {
      errors.push(`${file}: not an array`);
      continue;
    }
    for (const entry of entries) {
      const where = `${file} ${entry && entry.id ? entry.id : '(no id)'}`;
      for (const field of ['id', 'category', 'name', 'magnitudeUnit', 'wikiTitle', 'source']) {
        if (!entry[field]) errors.push(`${where}: missing ${field}`);
      }
      if (!Array.isArray(entry.aliases)) errors.push(`${where}: aliases must be an array`);
      if (!CATEGORIES.includes(entry.category)) errors.push(`${where}: unknown category ${entry.category}`);
      if (!MAGNITUDE_UNITS.has(entry.magnitudeUnit)) {
        errors.push(`${where}: magnitudeUnit must be pageviews_monthly, got ${entry.magnitudeUnit}`);
      }
      if (!(typeof entry.magnitude === 'number' && entry.magnitude > 0)) {
        errors.push(`${where}: magnitude (monthly pageviews) must be a number > 0`);
      }
      if (!SIZE_UNITS.has(entry.sizeUnit)) errors.push(`${where}: unknown sizeUnit ${entry.sizeUnit}`);
      if (!(typeof entry.size === 'number' && entry.size > 0)) {
        errors.push(`${where}: size must be a number > 0`);
      }
      if (ids.has(entry.id)) errors.push(`${where}: duplicate id (also in ${ids.get(entry.id)})`);
      ids.set(entry.id, file);

      if (entry.category === 'country' || entry.category === 'capital') {
        if (!Array.isArray(entry.region) || entry.region.length === 0) {
          errors.push(`${where}: ${entry.category} needs a non-empty region array`);
        } else {
          for (const region of entry.region) {
            if (!REGIONS.has(region)) errors.push(`${where}: unknown region "${region}"`);
          }
        }
      }

      if (!cohorts.has(entry.category)) cohorts.set(entry.category, []);
      cohorts.get(entry.category).push(entry);
    }
  }

  // No alias may collide with another entry's name or alias in the same cohort.
  for (const [category, entries] of cohorts) {
    const seen = new Map();
    for (const entry of entries) {
      for (const candidate of [entry.name, ...(entry.aliases || [])]) {
        const key = normalize(candidate);
        if (!key) {
          errors.push(`[${category}] ${entry.id}: empty name/alias`);
          continue;
        }
        const owner = seen.get(key);
        if (owner && owner !== entry.id) {
          errors.push(`[${category}] "${candidate}" claimed by both ${owner} and ${entry.id}`);
        }
        seen.set(key, entry.id);
      }
    }
  }

  const counts = Object.fromEntries([...cohorts].map(([c, e]) => [c, e.length]));
  for (const [category, target] of Object.entries(TARGETS)) {
    const n = counts[category] || 0;
    if (n < target) warnings.push(`${category}: ${n} entries, below target of ${target}`);
  }

  return { errors, warnings, counts };
}

/** pageviews.json is an input to the build, not a category file. */
const NOT_A_CATEGORY = new Set(['pageviews.json']);

/**
 * Every UN member, observer and commonly-taught state must be answerable -
 * by canonical name or by alias. Returns the ones that are not.
 */
export function missingCountries(files) {
  const accepted = new Set();
  for (const entries of Object.values(files)) {
    for (const entry of entries) {
      if (entry.category !== 'country') continue;
      for (const candidate of [entry.name, ...(entry.aliases || [])]) accepted.add(normalize(candidate));
    }
  }
  return [...UN_MEMBERS, ...UN_OBSERVERS, ...COMMONLY_TAUGHT].filter((name) => !accepted.has(normalize(name)));
}

/**
 * Theme sets name their members in plain English; this checks every one of them
 * still resolves to an entry. A stale name would silently shrink a themed prompt
 * or, worse, leave it rejecting an answer that is genuinely in the set.
 */
export function validateThemes(files, themesSource) {
  const errors = [];
  const warnings = [];
  const scope = {};
  new Function('globalThis', themesSource)(scope);
  const themes = scope.WORMILLION_THEMES || {};

  const byCategory = new Map();
  for (const entries of Object.values(files)) {
    for (const entry of entries) {
      if (!byCategory.has(entry.category)) byCategory.set(entry.category, new Map());
      for (const candidate of [entry.name, ...(entry.aliases || [])]) {
        byCategory.get(entry.category).set(normalize(candidate), entry.id);
      }
    }
  }

  let members = 0;
  for (const [category, sets] of Object.entries(themes)) {
    const known = byCategory.get(category);
    if (!known) {
      errors.push(`themes: unknown category "${category}"`);
      continue;
    }
    for (const [theme, names] of Object.entries(sets)) {
      const resolved = new Set();
      for (const name of names) {
        const id = known.get(normalize(name));
        if (id) resolved.add(id);
        else errors.push(`themes: ${category}/${theme} lists "${name}", which is not in the bank`);
      }
      members += resolved.size;
      if (resolved.size < 2) {
        warnings.push(`themes: ${category}/${theme} has ${resolved.size} member(s) and will be skipped`);
      }
    }
  }
  return { errors, warnings, members };
}

export async function loadDataFiles(dir = DATA_DIR) {
  const names = (await readdir(dir))
    .filter((f) => f.endsWith('.json') && !NOT_A_CATEGORY.has(f))
    .sort();
  const files = {};
  for (const name of names) {
    files[name] = JSON.parse(await readFile(dir + name, 'utf8'));
  }
  return files;
}

// Run as a script (not when imported by the test suite).
if (process.argv[1] && process.argv[1].endsWith('validate-data.mjs')) {
  const files = await loadDataFiles();
  const { errors, warnings, counts } = validate(files);

  const themeCheck = validateThemes(files, await readFile(DATA_DIR + 'themes.js', 'utf8'));
  errors.push(...themeCheck.errors);
  warnings.push(...themeCheck.warnings);

  for (const name of missingCountries(files)) {
    errors.push(`country audit: "${name}" is a UN member / expected state with no entry in the bank`);
  }

  for (const [category, n] of Object.entries(counts)) {
    console.log(`${String(n).padStart(4)}  ${category}${n < TARGETS[category] ? '  (below target)' : ''}`);
  }
  for (const warning of warnings) console.warn(`warn: ${warning}`);
  for (const error of errors) console.error(`error: ${error}`);

  if (errors.length) {
    console.error(`\n${errors.length} validation error(s).`);
    process.exit(1);
  }
  console.log(`\nOK - ${Object.values(counts).reduce((a, b) => a + b, 0)} entries validated.`);
}
