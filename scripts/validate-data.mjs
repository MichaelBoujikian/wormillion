/**
 * Content-bank validation (Spec 6.4). Run: npm run validate
 *
 * Fails (non-zero exit) on: a missing/invalid field, a non-positive magnitude,
 * a duplicate id, an alias that collides with another entry in the same cohort
 * (exactly, or in its bare loose form when no name settles it), a bad region
 * tag, or a country without flag colours from the fixed palette. Entry counts
 * below target only warn. Namesakes (decision 5): a name several entries of a
 * cohort share is legal only when each carries a distinct `qualifier` - at
 * most one holder may go without.
 */
import { readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { UN_MEMBERS, UN_OBSERVERS, COMMONLY_TAUGHT } from './data-un-members.mjs';
import { OCEANS, OCEAN_OVERRIDES } from './data-oceans.mjs';
import { FLAG_COLOURS } from './data-flags.mjs';

const DATA_DIR = fileURLToPath(new URL('../src/data/', import.meta.url));

export const CATEGORIES = ['country', 'capital', 'city', 'lake', 'river', 'mountain', 'desert', 'island', 'sea_ocean'];

export const REGIONS = new Set([
  'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania',
  'West Africa', 'East Africa', 'North Africa', 'Southern Africa',
  'Middle East', 'South Asia', 'Southeast Asia', 'East Asia', 'Central Asia',
  'Caribbean', 'Central America', 'Eastern Europe', 'Western Europe',
  'Scandinavia & the Nordics'
]);

export const TARGETS = {
  country: 195, capital: 195, lake: 70, river: 70,
  mountain: 100, desert: 30, island: 70, sea_ocean: 60, city: 150
};

// The scoring magnitude is always monthly Wikipedia pageviews now; the physical
// stat an entry was authored with is kept as size/sizeUnit for reference only.
const MAGNITUDE_UNITS = new Set(['pageviews_monthly']);
const SIZE_UNITS = new Set(['population', 'population_of_country', 'area_km2', 'length_km', 'elevation_m']);

// The game's own matcher (a classic script that also works as CommonJS), so
// the validator judges names exactly the way play does.
const matching = createRequire(import.meta.url)('../src/js/matching.js');
export const normalize = (input) => matching.normalize(String(input));

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
      if (entry.qualifier !== undefined) {
        if (!(typeof entry.qualifier === 'string' && entry.qualifier.trim())) errors.push(`${where}: qualifier must be a non-empty string`);
        else if (normalize(entry.qualifier) === normalize(entry.name)) errors.push(`${where}: qualifier repeats the name`);
      }
      if (!CATEGORIES.includes(entry.category)) errors.push(`${where}: unknown category ${entry.category}`);
      if (!MAGNITUDE_UNITS.has(entry.magnitudeUnit)) {
        errors.push(`${where}: magnitudeUnit must be pageviews_monthly, got ${entry.magnitudeUnit}`);
      }
      if (!(typeof entry.magnitude === 'number' && entry.magnitude > 0)) {
        errors.push(`${where}: magnitude (monthly pageviews) must be a number > 0`);
      }
      if (!SIZE_UNITS.has(entry.sizeUnit)) errors.push(`${where}: unknown sizeUnit ${entry.sizeUnit}`);
      // 0 means "no sourced figure anywhere" (a bay with no area, an islet no
      // one has measured): such an entry never answers a size prompt
      // (promptBank.satisfiesSize) but is a real place for every other one.
      if (!(typeof entry.size === 'number' && entry.size >= 0)) {
        errors.push(`${where}: size must be a number >= 0 (0 = unknown)`);
      }
      if (entry.sizeRange !== undefined) {
        const r = entry.sizeRange;
        if (!(Array.isArray(r) && r.length === 2 && r[0] > 0 && r[0] <= r[1] && entry.size === r[0])) {
          errors.push(`${where}: sizeRange must be [lo, hi] with lo <= hi and size === lo`);
        }
      }
      if (ids.has(entry.id)) errors.push(`${where}: duplicate id (also in ${ids.get(entry.id)})`);
      ids.set(entry.id, file);

      if (entry.category === 'country' || entry.category === 'capital' || entry.category === 'city') {
        if (!Array.isArray(entry.region) || entry.region.length === 0) {
          errors.push(`${where}: ${entry.category} needs a non-empty region array`);
        } else {
          for (const region of entry.region) {
            if (!REGIONS.has(region)) errors.push(`${where}: unknown region "${region}"`);
          }
        }
      }

      // Every country lists the colours of its flag (scripts/data-flags.mjs),
      // from a fixed palette, so "whose flag has green in it" can never be
      // asked of a country nobody wrote down.
      // A capital carries its country's flag too (optional, validated if present).
      if (entry.category === 'country' || entry.flag !== undefined) {
        if (!Array.isArray(entry.flag) || entry.flag.length === 0) {
          errors.push(`${where}: ${entry.category} needs a non-empty flag colour array`);
        } else {
          for (const colour of entry.flag) {
            if (!FLAG_COLOURS.includes(colour)) errors.push(`${where}: unknown flag colour "${colour}"`);
          }
          if (new Set(entry.flag).size !== entry.flag.length) errors.push(`${where}: repeated flag colour`);
        }
      }

      // Every island and sea knows its ocean(s). "None" is only legal when a
      // human wrote it down in scripts/data-oceans.mjs - never by omission.
      if (entry.category === 'island' || entry.category === 'sea_ocean') {
        if (!Array.isArray(entry.oceans)) {
          errors.push(`${where}: missing oceans (rebuild, or the article has no coordinates - add an override)`);
        } else {
          for (const ocean of entry.oceans) {
            if (!OCEANS.includes(ocean)) errors.push(`${where}: unknown ocean "${ocean}"`);
          }
          if (entry.oceans.length === 0 && !(entry.id in OCEAN_OVERRIDES)) {
            errors.push(`${where}: no ocean could be derived - add it to OCEAN_OVERRIDES`);
          }
        }
      }

      if (!cohorts.has(entry.category)) cohorts.set(entry.category, []);
      cohorts.get(entry.category).push(entry);
    }
  }

  // No alias may collide with another entry's name or alias in the same
  // cohort - unless they are namesakes: a key several entries hold is legal
  // when at most one of them lacks a qualifier and no two qualifiers agree
  // (then the round's scope picks among them; SPEC 3.7). The generated
  // qualified forms ("syracuse sicily", "portland or") are keys too.
  for (const [category, entries] of cohorts) {
    const seen = new Map(); // key -> [{ entry, candidate }]
    const claims = new Map(); // bare loose form -> [{ id, fromName, candidate, key }]
    for (const entry of entries) {
      const forms = [entry.name, ...(entry.aliases || [])].map((candidate, i) => ({ candidate, fromName: i === 0 }));
      if (entry.qualifier) for (const key of matching.qualifiedKeys(entry.name, entry.qualifier)) forms.push({ candidate: key, fromName: false, generated: true });
      for (const { candidate, fromName, generated } of forms) {
        const key = normalize(candidate);
        if (!key) {
          errors.push(`[${category}] ${entry.id}: empty name/alias`);
          continue;
        }
        if (!seen.has(key)) seen.set(key, []);
        if (!seen.get(key).some((c) => c.entry === entry)) seen.get(key).push({ entry, candidate, generated });

        if (generated) continue;
        const bare = matching.looseKey(candidate);
        if (!bare || bare === key) continue;
        if (!claims.has(bare)) claims.set(bare, []);
        claims.get(bare).push({ id: entry.id, fromName, candidate, key });
      }
    }
    for (const [key, holders] of seen) {
      if (holders.length < 2) continue;
      const who = holders.map((h) => `${h.entry.id} (via "${h.candidate}")`).join(' and ');
      const unqualified = holders.filter((h) => !h.entry.qualifier);
      const qualifiers = new Set(holders.filter((h) => h.entry.qualifier).map((h) => normalize(h.entry.qualifier)));
      const owner = holders.find((h) => h.generated);
      if (owner) errors.push(`[${category}] "${key}" is the qualified form of ${owner.entry.id}; also claimed by ${who}`);
      else if (unqualified.length > 1) errors.push(`[${category}] "${key}" claimed by both ${who} - namesakes need a qualifier each ("Name (State)")`);
      else if (qualifiers.size !== holders.length - unqualified.length) errors.push(`[${category}] "${key}" claimed by ${who} with the same qualifier`);
    }
    // A bare form two entries share is fine when one of them owns it by name
    // ("Arabian" is the Arabian Sea, whatever the Persian Gulf is also called).
    // Two names, or two aliases with no name, mean typing it identifies neither.
    // A bare form two names share goes to the list of them, most-viewed
    // first ("Geneva" is Lake Geneva before Geneva Lake; decision 5). Two
    // aliases with no name behind either would resolve the same way, but
    // an alias exists to be typed and that pair identifies neither on
    // purpose - refused, as before.
    for (const [bare, list] of claims) {
      if (list.some((c) => c.fromName) || new Set(list.map((c) => c.id)).size < 2) continue;
      const who = list.map((c) => `${c.id} (via "${c.candidate}")`).join(' and ');
      errors.push(`[${category}] typing "${bare}" identifies nobody: claimed by ${who}`);
    }
  }

  // The city cohort is "cities that aren't national capitals", and the prompt
  // says so; a city that is its own country's capital would make it a lie.
  const nationalCapitals = new Map(); // country -> normalized capital name
  for (const entry of cohorts.get('capital') || []) {
    if (entry.country && !entry.state) nationalCapitals.set(entry.country, normalize(entry.name));
  }
  for (const entry of cohorts.get('city') || []) {
    if (!entry.country) errors.push(`[city] ${entry.id}: needs a country`);
    else if (nationalCapitals.get(entry.country) === normalize(entry.name)) {
      errors.push(`[city] ${entry.id}: is the capital of ${entry.country}; the city cohort excludes capitals`);
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

  // key -> the ids holding it; a namesake's bare name holds several, and a
  // theme must list such a place with its qualifier ("Syracuse (Sicily)")
  const byCategory = new Map();
  for (const entries of Object.values(files)) {
    for (const entry of entries) {
      if (!byCategory.has(entry.category)) byCategory.set(entry.category, new Map());
      const known = byCategory.get(entry.category);
      const keys = [entry.name, ...(entry.aliases || [])].map(normalize);
      if (entry.qualifier) keys.push(...matching.qualifiedKeys(entry.name, entry.qualifier));
      for (const key of keys) {
        if (!known.has(key)) known.set(key, new Map());
        known.get(key).set(entry.id, Boolean(entry.qualifier));
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
        // a bare name several places share names the one without a qualifier
        const holders = known.get(normalize(name));
        const ids = holders && holders.size > 1 ? [...holders].filter(([, qualified]) => !qualified).map(([id]) => id) : holders ? [...holders.keys()] : null;
        if (ids && ids.length === 1) resolved.add(ids[0]);
        else if (holders) errors.push(`themes: ${category}/${theme} lists "${name}", which ${holders.size} places share - qualify it ("${name} (State)")`);
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
