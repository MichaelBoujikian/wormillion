/**
 * Cross-check a probe's Wikidata sizes against each article's own infobox.
 *   node scripts/expansion/article-size.mjs work/<probe>.json [--no-figure] [--min-views=N] [--sister=es]
 * Reads the probe output, fetches the wikitext of every in-scope missing/fuzzy/
 * taken item (plus the ones Wikidata had no figure for, with --no-figure), parses the infobox figure for
 * the probe's unit (river length, lake/island/desert/sea area, mountain
 * elevation), and writes work/<probe>-sizes.json: { title: { wikidata, article,
 * chosen, how } }. `chosen` follows the order of trust in HANDOFF.md: the
 * article's infobox whenever it has a figure, else Wikidata; a disagreement of
 * more than 15% is printed for a human look. Cache: work/wikitext-cache.json
 * (the infobox block of each article, not the whole text).
 * --sister=es (fr, de, it, pt): for what has no figure on enwiki or Wikidata,
 * follow the item's Wikidata sitelink to that wiki and read ITS infobox
 * (eswiki's "Ficha de rio" has a longitud for most Mexican rivers whose enwiki
 * stub has an empty length field; the Mexico and Canada wave, 2026-09-18).
 * A dot before exactly three digits is a thousands separator there ("1.081 km"),
 * a comma the decimal. `how` says which wiki the figure came from.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const S = fileURLToPath(new URL('./work', import.meta.url));
const src = process.argv[2];
const NO_FIGURE = process.argv.includes('--no-figure');
const minViewsArg = process.argv.find((a) => a.startsWith('--min-views='));
const MIN_VIEWS = minViewsArg ? Number(minViewsArg.slice(12)) : 0; // skip items under a views floor (mountains: no size floor exists)
const sisterArg = process.argv.find((a) => a.startsWith('--sister='));
// a sister wiki's language code, or several in the order to try them ("ro,pl,uk"):
// each row still unsized after enwiki and Wikidata is looked up on each in turn
const SISTERS = sisterArg ? sisterArg.slice(9).split(',').map((s) => s.trim()).filter(Boolean) : [];
let SISTER = SISTERS[0] || null;
const probe = JSON.parse(await readFile(src, 'utf8'));
const name = src.replace(/\\/g, '/').split('/').pop().replace(/\.json$/, '');
const cfg = JSON.parse(await readFile(fileURLToPath(new URL(`./probes/${name}.json`, import.meta.url)), 'utf8'));

const UA = 'Wormillion/1.0 (offline geography quiz game; one-off coverage check; contact: repository issues)';
const API = 'https://en.wikipedia.org/w/api.php';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const CACHE_FILE = `${S}/wikitext-cache.json`;
let cache = {};
try { cache = JSON.parse(await readFile(CACHE_FILE, 'utf8')); } catch {}

async function fetchWikitext(titles) {
  const need = titles.filter((t) => !(t in cache));
  for (let i = 0; i < need.length; i += 20) {
    const batch = need.slice(i, i + 20);
    let attempt = 0;
    for (;;) {
      const url = API + '?' + new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', prop: 'revisions', rvprop: 'content', rvslots: 'main', redirects: '1', titles: batch.join('|') });
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch {}
      if (res.status === 429 || res.status >= 500 || !data) {
        if (attempt > 5) throw new Error(`HTTP ${res.status}: ${text.slice(0, 80)}`);
        const wait = [5000, 15000, 30000, 60000, 90000, 120000][attempt++];
        console.log(`  (throttled - waiting ${wait / 1000}s)`);
        await sleep(wait);
        continue;
      }
      const forward = new Map(batch.map((t) => [t, t]));
      for (const step of [...(data.query.normalized || []), ...(data.query.redirects || [])]) {
        for (const [from, to] of forward) if (to === step.from) forward.set(from, step.to);
      }
      const pages = new Map((data.query.pages || []).map((p) => [p.title, p]));
      for (const t of batch) {
        const p = pages.get(forward.get(t));
        cache[t] = infoboxOf((p && p.revisions && p.revisions[0].slots.main.content) || '') || '';
      }
      break;
    }
    if ((i / 20) % 10 === 9 || i + 20 >= need.length) {
      await writeFile(CACHE_FILE, JSON.stringify(cache));
      console.log(`  wikitext: ${Math.min(i + 20, need.length)} / ${need.length}`);
    }
    await sleep(1000);
  }
}

// ---- infobox parsing --------------------------------------------------------
/** The first {{Infobox ...}} block, braces balanced. */
function infoboxOf(text) {
  // enwiki's {{Infobox river}}, eswiki's {{Ficha de rio}}, dewiki's {{Infobox Fluss}}, itwiki's {{Fiume}} / {{Lago}} / {{Montagna}}
  const m = /\{\{\s*(?:Infobox|Ficha de|Fiume|Lago|Montagna|Isola)\b/i.exec(text);
  if (!m) return null;
  let depth = 0;
  for (let i = m.index; i < text.length - 1; i++) {
    if (text[i] === '{' && text[i + 1] === '{') { depth++; i++; }
    else if (text[i] === '}' && text[i + 1] === '}') { depth--; i++; if (depth === 0) return text.slice(m.index, i + 1); }
  }
  return text.slice(m.index);
}
/** Top-level params of a template body: name -> raw value. */
function paramsOf(box) {
  const out = {};
  let depth = 0;
  let cur = '';
  const parts = [];
  for (let i = 2; i < box.length - 2; i++) {
    const two = box.slice(i, i + 2);
    if (two === '{{' || two === '[[') { depth++; cur += two; i++; continue; }
    if (two === '}}' || two === ']]') { depth--; cur += two; i++; continue; }
    if (box[i] === '|' && depth === 0) { parts.push(cur); cur = ''; continue; }
    cur += box[i];
  }
  parts.push(cur);
  for (const part of parts.slice(1)) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    out[part.slice(0, eq).trim().toLowerCase()] = part.slice(eq + 1).trim();
  }
  return out;
}
const TO_KM = { km: 1, kilometre: 1, kilometer: 1, kilometres: 1, kilometers: 1, nmi: 1.852, mi: 1.609344, mile: 1.609344, miles: 1.609344, m: 0.001, metre: 0.001, meter: 0.001, ft: 0.0003048, foot: 0.0003048, feet: 0.0003048 };
const TO_KM2 = { km2: 1, 'km²': 1, sqkm: 1, 'sq km': 1, sqmi: 2.589988, 'sq mi': 2.589988, mi2: 2.589988, 'mi²': 2.589988, sqnmi: 3.429904, 'sq nmi': 3.429904, nmi2: 3.429904, acre: 0.00404686, acres: 0.00404686, ha: 0.01, hectare: 0.01, hectares: 0.01, m2: 1e-6, 'm²': 1e-6, sqft: 9.2903e-8 };
const TO_M = { m: 1, metre: 1, meter: 1, metres: 1, meters: 1, ft: 0.3048, foot: 0.3048, feet: 0.3048 };
const TABLE = { km: TO_KM, km2: TO_KM2, m: TO_M };
// A comma is a thousands separator in English, but a fiwiki/dewiki-written
// infobox says {{convert|50,21|km2}} for 50.21: one comma followed by one or
// two digits is a decimal comma; three digits is ambiguous (149,758 km2 for
// Vanajavesi is 149.758) and is settled by the sanity cap below.
const num = (s) => {
  const t = String(s).replace(/&nbsp;/g, '').trim();
  if (/^\d+,\d{1,2}$/.test(t)) return Number(t.replace(',', '.'));
  return Number(t.replace(/,/g, ''));
};
const numDecimalComma = (s) => Number(String(s).replace(/&nbsp;/g, '').trim().replace(',', '.'));
// no lake but the Caspian is over 100,000 km2, no river over 7,000 km, no summit over 9,000 m
const SANITY = { km2: 100000, km: 7000, m: 9000 };

/** A value string -> [amount, unit] or null. */
function amountOf(value, fieldUnit) {
  if (!value) return null;
  let v = value.replace(/<ref[^>]*\/>/g, '').replace(/<ref[\s\S]*?<\/ref>/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/\{\{(?:efn|sfn|cn|citation needed|refn)[^}]*\}\}/gi, '');
  let m = /\{\{\s*(?:convert|cvt)\s*\|\s*([\d,.]+)\s*(?:\|\s*(?:to|-|–|and)\s*\|\s*[\d,.]+\s*)?\|\s*([a-zA-Z0-9²]+(?: [a-z]+)?)/i.exec(v);
  if (m) return [num(m[1]), m[2].toLowerCase(), m[1]];
  m = /(\d[\d,.]*|\.\d+)\s*(?:&nbsp;|\s)*(km2|km²|sq nmi|sqnmi|nmi2|sq mi|mi2|mi²|sqmi|acres?|ha|km|nmi|mi|miles?|kilomet(?:er|re)s?|ft|feet|foot|m)\b/i.exec(v);
  if (m) return [num(m[1]), m[2].toLowerCase(), m[1]];
  if (fieldUnit) {
    // a leading dot is a number too: Herbert Run's "length_mi = .413" once read as 413
    m = /(\d[\d,.]*|\.\d+)/.exec(v);
    if (m) return [num(m[1]), fieldUnit, m[1]];
  }
  return null;
}
const FIELDS = {
  km: ['length', 'length_km', 'length_mi'],
  km2: ['area', 'area_km2', 'area_sqmi', 'area_total_km2', 'area_total_sq_mi', 'area_mi2', 'surface_area', 'area_land_km2', 'area_land_sq_mi', 'area_acre', 'area_ha', 'area_total_acre', 'area_land_acre', 'total_area'],
  m: ['elevation_m', 'elevation_ft', 'elevation', 'height', 'highest_elevation', 'elevation_max_m', 'elevation_max_ft']
};
// the sister wikis' field names, per unit; a bare number is in the unit the
// infobox itself uses (km, km2, m)
const SISTER_FIELDS = {
  // es fr de it pt, then (the Eastern Europe wave, 2026-09-18) ro pl cs sk hu bg uk ru sr hr sl el lt lv et,
  // then (the East Asia wave) zh ja ko: zhwiki mostly keeps the English field names; jawiki's
  // Infobox 河川 / 湖 / 山 / 島 and kowiki's 강 / 호수 / 산 / 섬 정보 have their own
  km: ['longitud', 'longueur', 'länge', 'lunghezza', 'comprimento', 'length',
    'lungime', 'długość', 'délka', 'dĺžka', 'hossz', 'дължина', 'довжина', 'длина', 'дужина', 'duljina', 'dužina', 'dolžina', 'μήκος', 'ilgis', 'garums', 'pikkus',
    '长度', '全长', '長度', '全長', '延長', '길이', '전장',
    // the West and Central Asia wave: tr fa ar he ka hy az kk uz
    'uzunluk', 'uzunluğu', 'طول', 'الطول', 'אורך', 'სიგრძე', 'երկարություն', 'uzunluq', 'ұзындығы', 'uzunligi'],
  km2: ['superficie', 'área', 'area', 'fläche', 'surface', 'superficie_km2',
    'suprafață', 'suprafata', 'powierzchnia', 'rozloha', 'terület', 'площ', 'площа', 'площадь', 'površina', 'έκταση', 'plotas', 'platība', 'pindala',
    '面积', '面積', '면적',
    'alan', 'yüzölçümü', 'مساحت', 'مساحة', 'المساحة', 'שטח', 'ფართობი', 'մակերես', 'sahə', 'ауданы', 'maydoni'],
  m: ['altitud', 'altitude', 'elevación', 'elevacion', 'höhe', 'altitudine', 'altitude_m', 'elevation',
    'wysokość', 'výška', 'magasság', 'височина', 'висота', 'высота', 'visina', 'ύψος', 'aukštis', 'augstums', 'kõrgus',
    '海拔', '标高', '標高', '高度', '높이', '해발',
    'yükseklik', 'yükselti', 'ارتفاع', 'الارتفاع', 'גובה', 'სიმაღლე', 'բարձրություն', 'hündürlük', 'биіктігі', 'balandligi']
};
// wikis where a comma groups thousands ("1,234") rather than marking the decimal
const COMMA_THOUSANDS = new Set(['zh', 'ja', 'ko', 'en', 'he', 'ar', 'fa']);
// Eastern Arabic (ar) and Persian (fa) digits fold to ASCII before any number is read
const foldDigits = (v) => v.replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48)).replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x06f0 + 48));
/**
 * A sister wiki's infobox is not always called Infobox ("Infocaseta Râu",
 * "Rzeka infobox", "Річка", "Upė"): the first top-level template block that
 * carries one of the wanted fields is the infobox.
 */
function sisterBoxOf(text, unit) {
  const wanted = new Set(SISTER_FIELDS[unit]);
  let i = 0;
  while ((i = text.indexOf('{{', i)) >= 0) {
    let depth = 0, end = -1;
    for (let j = i; j < text.length - 1; j++) {
      if (text[j] === '{' && text[j + 1] === '{') { depth++; j++; }
      else if (text[j] === '}' && text[j + 1] === '}') { depth--; j++; if (depth === 0) { end = j + 1; break; } }
    }
    if (end < 0) return null;
    const block = text.slice(i, end);
    if (block.length > 200 && Object.keys(paramsOf(block)).some((k) => wanted.has(k))) return block;
    i = end;
  }
  return null;
}
const SISTER_UNIT = { km: 'km', km2: 'km2', m: 'm' };
const FIELD_UNIT = { length_km: 'km', length_mi: 'mi', area_km2: 'km2', area_sqmi: 'sq mi', area_total_km2: 'km2', area_total_sq_mi: 'sq mi', area_mi2: 'mi2', area_land_km2: 'km2', area_land_sq_mi: 'sq mi', area_acre: 'acre', area_ha: 'ha', area_total_acre: 'acre', area_land_acre: 'acre', elevation_m: 'm', elevation_ft: 'ft', elevation_max_m: 'm', elevation_max_ft: 'ft' };

function articleSize(text, unit, sister = false) {
  const box = sister ? (text || null) : infoboxOf(text || '');
  if (!box) return null;
  const params = paramsOf(box);
  for (const field of sister ? SISTER_FIELDS[unit] : FIELDS[unit]) {
    if (!(field in params)) continue;
    let value = params[field];
    // a sister wiki writes 1.081 for one thousand and eighty-one and 50,21 for fifty and a bit
    if (sister) value = foldDigits(value);
    if (sister) value = COMMA_THOUSANDS.has(SISTER)
      ? value.replace(/(\d),(\d{3})\b/g, '$1$2').replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0)) // 1,234 is a thousand; full-width digits fold
      : value.replace(/(\d)\.(\d{3})\b/g, '$1$2').replace(/(\d),(\d+)/g, '$1.$2'); // a comma is the decimal there, whatever follows it
    const a = amountOf(value, sister ? SISTER_UNIT[unit] : FIELD_UNIT[field]);
    if (!a) continue;
    const factor = TABLE[unit][a[1]];
    if (factor == null || !(a[0] > 0)) continue;
    let val = a[0] * factor;
    if (val > SANITY[unit] && /^\d+,\d{3}$/.test(String(a[2] || ''))) val = numDecimalComma(a[2]) * factor;
    return { value: unit === 'km2' ? Math.round(val * 100) / 100 : Math.round(val), field, raw: params[field].slice(0, 60) };
  }
  return null;
}

// ---- the sister wiki -------------------------------------------------------
/** qid -> the sister wiki's title, from Wikidata's sitelinks (50 per request). */
async function sisterTitles(qids) {
  const out = new Map();
  const need = qids.filter((q) => q && !((`wd:${SISTER}:${q}`) in cache));
  for (let i = 0; i < need.length; i += 50) {
    const batch = need.slice(i, i + 50);
    const url = 'https://www.wikidata.org/w/api.php?' + new URLSearchParams({ action: 'wbgetentities', format: 'json', ids: batch.join('|'), props: 'sitelinks', sitefilter: `${SISTER}wiki` });
    let attempt = 0;
    for (;;) {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch {}
      if (res.status === 429 || res.status >= 500 || !data) {
        if (attempt > 5) throw new Error(`HTTP ${res.status}: ${text.slice(0, 80)}`);
        const wait = [5000, 15000, 30000, 60000, 90000, 120000][attempt++];
        console.log(`  (throttled - waiting ${wait / 1000}s)`);
        await sleep(wait);
        continue;
      }
      for (const q of batch) {
        const e = data.entities && data.entities[q];
        cache[`wd:${SISTER}:${q}`] = (e && e.sitelinks && e.sitelinks[`${SISTER}wiki`] && e.sitelinks[`${SISTER}wiki`].title) || '';
      }
      break;
    }
    await sleep(1500);
  }
  for (const q of qids) if (q) out.set(q, cache[`wd:${SISTER}:${q}`] || '');
  await writeFile(CACHE_FILE, JSON.stringify(cache));
  return out;
}
/** The sister wiki's infobox for each title, cached under "<lang>:<title>". */
async function fetchSisterWikitext(titles) {
  const need = titles.filter((t) => !((`${SISTER}:${t}`) in cache));
  for (let i = 0; i < need.length; i += 20) {
    const batch = need.slice(i, i + 20);
    let attempt = 0;
    for (;;) {
      const url = `https://${SISTER}.wikipedia.org/w/api.php?` + new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', prop: 'revisions', rvprop: 'content', rvslots: 'main', redirects: '1', titles: batch.join('|') });
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch {}
      if (res.status === 429 || res.status >= 500 || !data) {
        if (attempt > 5) throw new Error(`HTTP ${res.status}: ${text.slice(0, 80)}`);
        const wait = [5000, 15000, 30000, 60000, 90000, 120000][attempt++];
        console.log(`  (throttled - waiting ${wait / 1000}s)`);
        await sleep(wait);
        continue;
      }
      const forward = new Map(batch.map((t) => [t, t]));
      for (const step of [...(data.query.normalized || []), ...(data.query.redirects || [])]) {
        for (const [from, to] of forward) if (to === step.from) forward.set(from, step.to);
      }
      const pages = new Map((data.query.pages || []).map((p) => [p.title, p]));
      for (const t of batch) {
        const p = pages.get(forward.get(t));
        const content = (p && p.revisions && p.revisions[0].slots.main.content) || '';
        cache[`${SISTER}:${t}`] = sisterBoxOf(content, cfg.sizeUnit) || infoboxOf(content) || '';
      }
      break;
    }
    if ((i / 20) % 10 === 9 || i + 20 >= need.length) {
      await writeFile(CACHE_FILE, JSON.stringify(cache));
      console.log(`  ${SISTER}wiki: ${Math.min(i + 20, need.length)} / ${need.length}`);
    }
    await sleep(1000);
  }
}

// ---- run --------------------------------------------------------------------
const wanted = probe.items.filter((r) => r.status !== 'present' && (!r.floor || (NO_FIGURE && r.floor === 'no-figure')) && (!MIN_VIEWS || (r.views || 0) >= MIN_VIEWS));
console.log(`${wanted.length} articles to read`);
await fetchWikitext(wanted.map((r) => r.finalTitle));
const out = {};
let agree = 0, disagree = 0, articleOnly = 0, wikidataOnly = 0, neither = 0;
const rows = [];
for (const r of wanted) {
  const art = articleSize(cache[r.finalTitle], cfg.sizeUnit);
  const wd = r.size == null ? null : r.size;
  let chosen = null, how = '';
  if (art && wd != null) {
    // the article's figure is chosen either way (HANDOFF's order of trust); a
    // disagreement beyond 15% is printed for a human look
    const ratio = art.value / wd;
    chosen = art.value;
    if (ratio > 0.85 && ratio < 1.15) { how = 'article (wikidata agrees)'; agree++; }
    else { how = `article ${art.value} vs wikidata ${wd} (${art.field}: ${art.raw})`; disagree++; rows.push([r.finalTitle, how]); }
  } else if (art) { chosen = art.value; how = `article only (${art.field}: ${art.raw})`; articleOnly++; }
  else if (wd != null) { chosen = wd; how = 'wikidata only (no infobox figure)'; wikidataOnly++; }
  else { how = 'no figure anywhere'; neither++; }
  out[r.finalTitle] = { wikidata: wd, article: art ? art.value : null, chosen, how };
}
let sisterFound = 0;
const sisterRows = [];
for (const lang of SISTERS) {
  SISTER = lang;
  const unsized = wanted.filter((r) => out[r.finalTitle].chosen == null);
  if (!unsized.length) break;
  const titles = await sisterTitles(unsized.map((r) => r.qid));
  const have = unsized.filter((r) => titles.get(r.qid));
  console.log(`\n${SISTER}wiki: ${have.length} of the ${unsized.length} unsized have an article there`);
  await fetchSisterWikitext(have.map((r) => titles.get(r.qid)));
  for (const r of have) {
    const t = titles.get(r.qid);
    const a = articleSize(cache[`${SISTER}:${t}`], cfg.sizeUnit, true);
    if (!a) continue;
    out[r.finalTitle] = { wikidata: null, article: a.value, chosen: a.value, how: `${SISTER}wiki "${t}" (${a.field}: ${a.raw})` };
    sisterFound++; neither--;
    sisterRows.push([r.finalTitle, out[r.finalTitle].how]);
  }
}
SISTER = SISTERS.join('+') || null;
await writeFile(`${S}/${name}-sizes.json`, JSON.stringify(out, null, 1));
console.log(`agree ${agree} · disagree ${disagree} · article only ${articleOnly} · wikidata only ${wikidataOnly}${SISTER ? ` · ${SISTER}wiki ${sisterFound}` : ''} · neither ${neither}`);
if (SISTER) {
  console.log(`\n==== ${SISTER.toUpperCase()}WIKI (${sisterRows.length}) - the sister wiki's infobox figure; eyeball these ====`);
  for (const [t, how] of sisterRows) console.log(`  ${t.padEnd(40)} ${how}`);
}
console.log(`\n==== DISAGREE (${rows.length}) - the article's figure was chosen; eyeball these ====`);
for (const [t, how] of rows) console.log(`  ${t.padEnd(40)} ${how}`);
const wdOnly = wanted.filter((r) => out[r.finalTitle].how.startsWith('wikidata only'));
console.log(`\n==== WIKIDATA ONLY (${wdOnly.length}) - no infobox figure to check against ====`);
for (const r of wdOnly) console.log(`  ${r.finalTitle.padEnd(40)} ${r.size} ${cfg.sizeUnit}`);
console.log(`\nwrote ${name}-sizes.json`);
