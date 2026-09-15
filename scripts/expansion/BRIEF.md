# Wormillion data-expansion brief (read fully before starting)

You are authoring NEW entries for the content bank of Wormillion, a geography
game (repo: `C:\Users\smite\repos\wormillion`). Players type a place name for a
prompt like "Name an island." / "Name a river longer than 1,000 km." / "Name a
non-capital city in South America." Players are complaining that real places they
type ("Falkland Islands", various rivers, non-capital cities) are not recognised.
Your job: produce a large list of REAL places for ONE category, in the exact
output format below, written to the output file named in your task.

**Do NOT edit any file inside the repo.** Only write your output file (in the
scratchpad folder given in your task). The lead session folds everything in.

## What already exists (you must not duplicate it)

Read the current rows for your category before writing anything:

- islands / rivers / lakes / mountains+minor peaks / deserts / seas:
  `scripts/data-physical.mjs` (blocks `ISLANDS`, `RIVERS`, `LAKES`, `MOUNTAINS`,
  `MINOR_PEAKS`, `DESERTS`, `SEAS_OCEANS`), format `Name|magnitude|alias,alias`
- cities: `scripts/data-cities.mjs` (format `Name|Country|population|alias,alias`;
  read its header comment — it is the rulebook for cities)
- countries (needed for a city's `Country` column, first column of each row):
  `scripts/data-countries.mjs`
- theme sets (curated lists a themed prompt accepts): `src/data/themes.js`
- Wikipedia title overrides already in place: `scripts/data-wiki-titles.mjs`

## Hard rules (the build/validator enforces most of these)

1. **Real places only**, currently recognised, with a real reference figure.
   Nothing invented, no placeholders.
2. **Name it as the world names it.** No bank-invented disambiguators
   ("Cuba", not "Cuba Island"; "Tobago", not "Tobago Island"). Real names that
   carry a generic word stay ("Baffin Island", "Lake Tahoe", "Mount Adams",
   "River Mersey" is fine as "Mersey"). Use the common English name.
3. **Plain ASCII** for Name and aliases (é→e, ø→o, ß→ss, ł→l). Apostrophes ok.
4. **No collisions within the cohort** (the whole category, existing + new):
   - no two rows with the same Name (case/accent-insensitive);
   - an alias must not equal another entry's name or alias;
   - **loose-key rule**: the matcher strips these filler words before comparing:
     `mount mt mountain peak hill lake loch lough llyn river sea ocean gulf bay
     island islands isle isles desert the of city saint st cape atoll`.
     Two NAMES that collapse to the same stripped form ("Wheeler Peak" NM and
     "Wheeler Peak" NV; "Prince Edward Island" and "Prince Edward Islands";
     "Santa Cruz Island" Galapagos and "Santa Cruz Island" California) cannot
     both exist — pick the more famous one and skip the other, or find the
     genuinely different name the other is known by. An ALIAS whose stripped
     form equals an existing NAME's stripped form silently loses (fine); an
     alias colliding with another alias fails the build (not fine).
   - Cross-category collisions are allowed (the mountain Stromboli and the
     island Stromboli can both exist) — but for cities, follow the cities
     header: no city Name that is also a country or island name in the bank.
5. **Aliases** (optional, comma-separated): former names (Bombay), local names
   an English speaker might type (Firenze, Donau), common spelling variants,
   well-known abbreviations only when genuinely common (NYC, UAE). You do NOT
   need filler-word variants ("Mount X" vs "X") — the matcher handles filler.
   Don't add an alias that is the name of a different real place.
6. **Magnitude** = the standard reference figure for the category:
   islands/lakes/deserts/seas = area in km²; rivers = length in km (a disputed
   figure may be written as a range `lo-hi`); mountains = summit elevation in m;
   cities = population of the city PROPER (administrative city), rounded to 2–3
   significant figures. Roughly right is enough (threshold prompts are coarse:
   e.g. rivers 500/1,000/3,000/5,000 km; islands 100/10,000/100,000 km²;
   lakes 100/1,000/10,000/30,000 km²; mountains 1,000/3,000/5,000/8,000 m;
   deserts 100,000/500,000 km²; seas 100,000/1,000,000 km²;
   cities 500k/1M/5M/10M). Digits only (no commas), decimals allowed.
7. **wikiTitle** = the EXACT English Wikipedia article title for this place,
   always supplied. Every entry is scored by that article's pageviews, so a
   wrong article (the colour "Hue" instead of the city Huế; a disambiguation
   page; a district instead of the island) is a real bug. Give the title as
   Wikipedia spells it, accents and all (e.g. `Réunion`, `Río de la Plata`,
   `Lake Placid (New York)`, `Cork (city)`, `Portland, Oregon`, `Tana River
   (Kenya)`). If the bare name IS the article, repeat the name. If you are not
   sure whether a bare name is ambiguous on Wikipedia, give the disambiguated
   form — it costs nothing if right and saves a debugging round if the bare
   name would have been a disambiguation page. Rivers, mountains and cities
   are almost always ambiguous ("Lena (river)", "Mount Adams (Washington)",
   "Salem, Oregon").
8. **themes**: which EXISTING theme sets (in `src/data/themes.js`, for your
   category) the place belongs to, semicolon-separated, using the theme names
   exactly as written there. A themed prompt REJECTS anything outside its set,
   so a new Alpine peak that isn't listed under `the Alps` becomes a wrong
   answer on "Name a mountain in the Alps." Be complete for the sets that
   apply; leave blank when none apply. Do not invent new themes.

## What makes a good list (priority order)

1. **The places a real player would actually type first** — the famous ones
   the bank is missing. Check the existing rows: the bank already has the
   giants; the gap is the well-known second tier and the famous small ones.
2. Then breadth: second- and third-tier places across every continent and
   country, so "Name a river in Europe" and "Name an island in the Pacific"
   have plenty of answers. Obscurity is welcome, fabrication is not.
3. Regional balance: don't produce 200 US entries and 3 African ones.

How to source: use Wikipedia's list articles (fetch them with WebFetch — load
it via ToolSearch first if it is deferred; e.g. "List of islands by area",
"List of rivers by length", "List of rivers of <country>", "List of lakes by
area", "List of mountains by elevation", "List of deserts by area", "List of
cities in <country> by population", "List of largest cities") for names and
figures, plus your own knowledge for famous small places that list articles
rank low. Do NOT fetch every individual article — the lead session verifies
every title against the Wikipedia API afterwards. Spot-check a title with
WebFetch only when you genuinely doubt which article a name resolves to.

## Output format

One row per line, pipe-delimited, no header, no comment lines, no blank lines,
UTF-8. Aliases comma-separated (may be empty), themes semicolon-separated (may
be empty). Sort rows roughly by fame (most obvious first).

Physical categories (islands, rivers, lakes, mountains, deserts, seas):

```
Name|magnitude|aliases|wikiTitle|themes
Falkland Islands|12173|Falklands,Islas Malvinas|Falkland Islands|
Tobago|300||Tobago|the Caribbean
Mersey|113|River Mersey|River Mersey|the British Isles
```

Cities:

```
Name|Country|population|aliases|wikiTitle|themes
Nashville|United States|690000||Nashville, Tennessee|
Cordoba|Spain|325000|Cordova|Córdoba, Spain|
```

(`Country` must match the first column of a `scripts/data-countries.mjs` row
EXACTLY, e.g. "United States", "United Kingdom", "Czechia", "Ivory Coast",
"Democratic Republic of the Congo", "Republic of the Congo", "Eswatini",
"Timor-Leste", "North Macedonia", "Myanmar", "Turkey", "Palestine", "Taiwan",
"Kosovo", "Vatican City". Places whose "country" is not a row there —
Puerto Rico, Hong Kong (China is), Greenland, Bermuda, French Guiana, Réunion,
Guam, Northern Ireland (United Kingdom is) — can only be listed if a valid
country row applies: Hong Kong → China; Belfast → United Kingdom; Cayenne →
France is acceptable; San Juan PR has no row, so skip it.)

When done, append nothing to the file; instead finish your reply with a short
summary: how many rows, which theme sets you touched, any places you
deliberately skipped because of a name collision (say which won), and any row
whose figure or title you are unsure of.

## Write incrementally (important)

Do not hold rows in memory until the end. Create the output file with your first
30 or so rows, then APPEND every further batch of ~30 rows as you go (Bash:
`cat >> <file> <<'EOF' ... EOF`, or read-then-Write). If you are cut off, the
rows already appended are kept and folded in; nothing else is. Never rewrite
the whole file from scratch once it exists. Before your final reply, re-read
the file once and remove any exact duplicate lines you produced.
