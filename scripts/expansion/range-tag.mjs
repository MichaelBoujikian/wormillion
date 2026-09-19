/**
 * Put bank mountains into a range theme from their own infobox.
 *   node scripts/expansion/range-tag.mjs "the Rockies" [--apply] [--show-unmatched]
 * Reads the infobox of every mountain in the bank from work/wikitext-cache.json
 * (article-size.mjs fills it; nothing is fetched here), takes its `range` /
 * `parent` / `parent_range` field, and lists the peaks whose range matches the
 * theme's table below and are not in the theme yet. --apply appends them to
 * src/data/themes.js (then run build-data / validate / test as usual).
 * A peak with no cached infobox, or a range outside the table, is left alone
 * and counted; --show-unmatched prints the range strings that matched nothing,
 * so the table can grow.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const REPO = fileURLToPath(new URL('../../', import.meta.url));
const S = fileURLToPath(new URL('./work/', import.meta.url));
const THEME = process.argv[2];
const APPLY = process.argv.includes('--apply');
const SHOW = process.argv.includes('--show-unmatched');

// theme -> the ranges (and subranges) whose peaks belong to it, as they are
// named in infoboxes. Generous on purpose: the audit refuses an untagged
// Alpine peak on "Name a mountain in the Alps", never a tagged foothill.
const RANGE_THEMES = {
  // (the Canadian sub-ranges and the Rockies national parks were added
  // 2026-09-18: an Alberta / BC infobox names only its sub-range, and 26
  // Canadian Rockies peaks were untagged for it; "Park Ranges" is plural there)
  'the Rockies': /\b(Rocky Mountains|Rockies|Front Range|Sawatch|San Juan Mountains|Sangre de Cristo|Elk Mountains|Mosquito Range|Tenmile Range|Gore Range|Never Summer|Medicine Bow|Park Range|Rabbit Ears|Flat Tops|West Elk|Collegiate Peaks|Needle Mountains|Sierra Blanca Massif|Crestones|La Garita|San Miguel Mountains|Wet Mountains|Spanish Peaks|Culebra Range|Laramie Mountains|Snowy Range|Wind River Range|Teton Range|Absaroka|Beartooth|Bighorn Mountains|Wyoming Range|Gros Ventre|Salt River Range|Washburn Range|Gallatin Range|Madison Range|Bridger Range|Crazy Mountains|Big Belt|Little Belt|Tobacco Root|Anaconda Range|Bitterroot|Sapphire Mountains|Flint Creek Range|Lewis Range|Livingston Range|Swan Range|Mission Mountains|Cabinet Mountains|Whitefish Range|Sawtooth Range|Lost River Range|Lemhi Range|Salmon River Mountains|Clearwater Mountains|Boulder Mountains|White Cloud|Centennial Mountains|Wasatch|Uinta|Bear River Range|Rampart Range|Tarryall|Kenosha Mountains|Platte River Mountains|Vasquez Mountains|Indian Peaks|Mummy Range|Rawah|Ruby Range|Ragged Mountains|Grenadier Range|Sneffels|La Plata Mountains|Pioneer Mountains|Highland Mountains|Ruby Mountains \(Montana\)|Big Horn|Owl Creek Mountains|Wind River Mountains|Purcell Mountains|Canadian Rockies|Mackenzie Mountains|Columbia Icefield|Waputik|Bow Range|Selwyn Mountains|Elkhead Mountains|Red Mountains|Bear River Mountains|Laramie Range|White River Plateau|Yellowstone Plateau|Park Ranges|Front Ranges|Continental Ranges|Kootenay Ranges|Border Ranges|Hart Ranges|Muskwa Ranges|Maligne Range|Fairholme Range|Sawback Range|Kananaskis Range|Misty Range|Fisher Range|Blairmore Range|Crowsnest Range|Clark Range|Brazeau Range|Murchison Group|Ottertail Range|President Range|Winston Churchill Range|Victoria Cross Ranges|Miette Range|Colin Range|Trident Range|High Rock Range|Elk Range|Hughes Range|Lizard Range|Selwyn Range|Slate Range|Ball Range|Vermilion Range|Mitchell Range|Van Horne Range|Palliser Range|Opal Range|Spray Mountains|Sundance Range|Livingstone Range|Flathead Range|Wisukitsak Range|Bosche Range|De Smet Range|Jacques Range|Queen Elizabeth Ranges|Le Grand Brazeau|Ram Range|Bighorn Range|Cline Range|Sunwapta|Chaba|Fryatt|Massive Range|Goat Range|Kootenay National Park|Banff National Park|Jasper National Park|Yoho National Park|Waterton Lakes National Park|Kananaskis Country|Peter Lougheed Provincial Park)\b/i,
  // (?<!...): the Arrochar Alps, the Lyngen Alps, the Southern Alps are not the Alps
  // (the East Asia wave, 2026-09-18) the Himalaya proper and its named sections; the Karakoram,
  // Kunlun, Tanggula, Nyenchen Tanglha, Hengduan and Pamir are NOT the Himalayas
  'the Himalayas': /(?<!Trans-|Trans )\b(Himalayas?|Himalaya Range|Mahalangur|Khumbu|Rolwaling|Langtang|Jugal|Ganesh Himal|Manaslu|Annapurna|Dhaulagiri|Kanjiroba|Api|Saipal|Garhwal|Kumaon|Kumaun|Zanskar|Pir Panjal|Dhauladhar|Sikkim Himalaya|Kangchenjunga|Singalila|Bhutan Himalaya|Lunana|Assam Himalaya|Nyingchi|Lhozhag|Mount Everest massif|Jomolhari|Kula Kangri|Nepal Himalaya|Himachal|Gangotri|Nanda Devi|Kailas Range|Pamir-Himalaya)\b/i,
  'the Alps': /(?<!Arrochar |Lyngen |Sunnm\S* |Southern |Japanese |Australian |New Zealand |Grampian |Trinity |Kyrgyz |Ala |Dinaric |Albanian |Transylvanian |Apuseni |Scandinavian |Swabian |Franconian )\b(Alps|Alpi|Alpen|Dolomites|Dolomiti|Mont Blanc massif|Bernina|Ortler|Hohe Tauern|Niedere Tauern|Karwendel|Wetterstein|Berchtesgaden|Allg[aä]u|Silvretta|R[aä]tikon|Glarus|Lepontine|Bernese|Pennine|Graian|Cottian|Maritime|Ligurian|Julian|Carnic|Ötztal|Oetztal|Stubai|Zillertal|Kitzb[uü]hel|Dachstein|Totes Gebirge|Ennstal|Wilder Kaiser|Chiemgau|Uri Alps|Urner|Glarner|Appenzell|Alpstein|Rhaetian|Albula|Plessur|Bregaglia|Adamello|Brenta|Presanella|Lagorai|Pale di San Martino|Sexten|Sesto|Marmolada|Sella|Rosengarten|Catinaccio|Latemar|Vanoise|Écrins|Ecrins|Belledonne|Chartreuse|Vercors|Bauges|Aravis|Chablais|Mont Blanc|Beaufortain|Dauphiné|Dauphine|Queyras|Mercantour|Lechtal|Ammergau|Bavarian Prealps|Tegernsee|Mangfall|Wallis|Valais|Gotthard|Glockner|Venediger|Ankogel|Schober|Kreuzeck|Goldberg|Zillertaler|Tuxer|Kitzbüheler|Salzburg Slate|Dachstein|Tennengebirge|Hochschwab|Rax|Schneeberg|Ybbstal|Gutenstein|Türnitz|Hochkönig|Steinernes Meer|Loferer|Leoganger|Kaisergebirge|Karawanks|Kamnik|Savinja|Bergamasque|Orobie|Lugano Prealps|Como Prealps|Varese Prealps|Brescia|Garda|Fiemme|Vicentine|Belluno|Carnia|Friulian|Sarntal|Gailtal|Nockberge|Lavanttal|Koralpe|Gurktal|Saualpe|Seckau|Rottenmann|Wölz|Schladming|Radstadt|Tennen|Sengsen|Reichraming|Haller|Traunstein|Höllengebirge)\b/i
};
const RANGE = RANGE_THEMES[THEME];
if (!RANGE) { console.error(`no range table for theme "${THEME}"; known: ${Object.keys(RANGE_THEMES).join(', ')}`); process.exit(1); }

const cache = JSON.parse(await readFile(S + 'wikitext-cache.json', 'utf8'));
const mountains = [];
for (const f of ['mountains.json', 'minor-peaks.json']) mountains.push(...JSON.parse(await readFile(`${REPO}src/data/${f}`, 'utf8')));
const themesPath = REPO + 'src/data/themes.js';
const themesSrc = await readFile(themesPath, 'utf8');
const scope = {};
new Function('globalThis', themesSrc)(scope);
const members = new Set(scope.WORMILLION_THEMES.mountain[THEME] || []);

/** A top-level infobox param, wikilinks unwrapped, refs and tags removed; several params may share a line. */
function field(box, name) {
  const flat = box
    .replace(/<ref[^>]*\/>/g, '').replace(/<ref[\s\S]*?<\/ref>/g, '').replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g, '$2 ($1)').replace(/\[\[|\]\]/g, '')
    // "[[Rocky Mountains]]<br>[[San Juan Mountains]]" and {{ubl|A|B}} are lists
    .replace(/<br\s*\/?>/gi, ', ').replace(/<[^>]*>/g, '')
    .replace(/\{\{\s*(?:unbulleted list|ubl|hlist|plainlist|flatlist)\s*\|([^}]*)\}\}/gi, (_, items) => items.split('|').map((s) => s.trim()).filter(Boolean).join(', '));
  const m = new RegExp('\\|\\s*' + name + '\\s*=\\s*([^\\n|]*)', 'i').exec(flat);
  return m ? m[1].replace(/\{\{[^}]*\}\}/g, '').trim() : '';
}

let cached = 0, already = 0;
const adds = [];
const unmatched = new Map();
for (const e of mountains) {
  const box = cache[e.wikiTitle];
  if (!box) continue;
  cached++;
  const range = [field(box, 'range'), field(box, 'parent'), field(box, 'parent_range'), field(box, 'location')].filter(Boolean).join(' / ');
  if (!range) continue;
  if (RANGE.test(range)) {
    // a namesake is listed as "Name (Qualifier)" (decision 5)
    const shown = e.qualifier ? `${e.name} (${e.qualifier})` : e.name;
    if (members.has(shown)) already++;
    else adds.push({ name: shown, range });
  } else unmatched.set(range, (unmatched.get(range) || 0) + 1);
}
console.log(`${mountains.length} mountains, ${cached} with a cached infobox; theme "${THEME}" has ${members.size} members, ${already} of them confirmed by their infobox`);
console.log(`\n==== TO ADD (${adds.length}) ====`);
for (const a of adds) console.log(`  ${a.name.padEnd(36)} ${a.range}`);
if (SHOW) {
  console.log(`\n==== RANGES THAT MATCHED NOTHING (${unmatched.size}) ====`);
  for (const [r, n] of [...unmatched].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${r}`);
}
if (!APPLY || !adds.length) { if (!APPLY) console.log('\n(dry run; pass --apply to write themes.js)'); process.exit(0); }

// append to the theme, fold.mjs style
{
  let text = themesSrc;
  const EOL = text.includes('\r\n') ? '\r\n' : '\n';
  const q = (s) => (s.includes("'") ? JSON.stringify(s) : `'${s}'`);
  const catStart = text.indexOf(`${EOL}  mountain: {`);
  const catEnd = text.indexOf(`${EOL}  },`, catStart);
  const keyIdx = text.indexOf(`'${THEME}': [`, catStart);
  if (catStart < 0 || keyIdx < 0 || keyIdx > catEnd) throw new Error(`themes: mountain/${THEME} not found`);
  const arrStart = keyIdx + `'${THEME}': [`.length;
  const arrEnd = text.indexOf(']', arrStart);
  let insertAt = arrEnd;
  while (/\s/.test(text[insertAt - 1])) insertAt--;
  const names = adds.map((a) => a.name);
  const chunks = [];
  for (let i = 0; i < names.length; i += 5) chunks.push('      ' + names.slice(i, i + 5).map(q).join(', '));
  const insertion = `,${EOL}      // range-tag.mjs from the infobox range field${EOL}` + chunks.join(`,${EOL}`);
  text = text.slice(0, insertAt) + insertion + text.slice(insertAt);
  await writeFile(themesPath, text, 'utf8');
  console.log(`\nwrote themes.js: +${names.length} in mountain/${THEME}`);
}
