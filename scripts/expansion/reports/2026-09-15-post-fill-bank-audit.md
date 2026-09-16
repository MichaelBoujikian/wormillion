# Bank audit of the 2026-09-15 fill: 66 Colombian rivers, 249 US cities, 24 Swedish lakes

Scope: the 339 rows added by `99aab7f` and `bf4d28d`, as built into `src/data/{rivers,cities,lakes}.json`, joined to their source lines in `scripts/expansion/work/folded/*.txt` by `wikiTitle` (all 339 join; none missing from the cache). No repo file was edited.

Evidence standard: every row under "Confirmed" was checked against the live English Wikipedia API on 2026-09-15 (`action=query&redirects=1&prop=description|pageprops|coordinates`, then `prop=revisions` for the wikitext) and against Wikidata (`wbgetentities`, P2043/P2046/P1082/P17/P625) — 37 requests in total, one per second, no throttling seen. Matching claims were made by running the input through the shipped matcher (`src/js/matching.js` + `promptBank.createBank` on `src/data/bank.js`), not by reading the rules. Scripts, in this folder: `load.mjs` (join), `place.mjs` (checks 1/4/5 offline), `names.mjs` (check 3), `answers.cjs` (matcher runs), `fetch.mjs` + `fetch2.mjs` (network, cached under `net/`), `compare.mjs` + `lengths.mjs` (check 2), `leftovers.mjs` (check 6). Their outputs are saved as `*.out` beside them.

## Summary

| check | confirmed problems | candidates / judgment calls |
|---|---|---|
| 1. Right place | **0** — all 339 articles describe the right kind of thing; every coordinate that exists (article or Wikidata) is inside the US / Sweden / Colombia box | Torbes and Uribante are Venezuelan rivers (P17 = Venezuela, no Colombian border) — fine for the South America theme, wrong for the "66 Colombian rivers" claim |
| 2. Right figure | **1** — Ajajú 770 km (unsourced infobox) vs 260 km (es.wikipedia, sourced prose); it currently passes "longer than 500 km" | Catatumbo 500 vs 338/450, Caguán 470 vs 630, Cahuinarí 400 vs 550 (all straddle the 500 line); Atabapo 280 vs 131, Ariari 185 vs 335, Orteguaza 220 vs 131, Medellín 100 vs 60 (no threshold effect); lake Överuman 88 vs 52.5 km². Cities: all 100 checked equal the 2020 census (max delta Fontana 7 %). Lakes: all 24 equal Wikidata P2046. |
| 3. Right name | **2 rows that break a pre-existing answer** (Georgetown TX shadows George Town, Penang; Athens GA turns "Athens" on a Europe round into a false refusal) + **7 missing aliases** the matcher refuses today (Woodbridge, Clinton, Ivösjön, Orsasjön, Sitasjaure, Råstojaure, Sädvajaure) | Display names "Storvindeln Lake", "Orsa Lake", "Ivo Lake" (Wikipedia's titles, but not what anyone calls them); "Lakewood/Woodbridge/Clinton Township"; the famous-elsewhere list (Hollywood, Lancaster, Ontario, Norfolk…) — all accepted either way, keep |
| 4. Right cohort | **0** | — |
| 5. Rarity | **0** — every low-view row is a real, correctly-titled CDP/suburb/pond | 11 of the 249 "cities" are unincorporated CDPs (Sunrise Manor, Spring Valley, Enterprise, Paradise, Metairie, Lehigh Acres, Spring Hill, Riverview, East Honolulu, Pearl City, Waipahu) |
| 6. Probe leftovers | — | Rivers: only Fucha has a figure (22 km, es prose); the other 14 have nothing in en, es or Wikidata. Cities: none of the 15 has a real distinct name; the only route is Wikipedia's own comma title ("Portland, Maine"), a rules decision |

---

## Confirmed

### C1. `city-georgetown` — Georgetown, Texas (67,176) now shadows George Town, Penang (790,000) for anyone who types "Georgetown"

- Evidence (shipped matcher, `answers.cjs`):
  - `city "Georgetown"` → **accepted `city-georgetown`** (Texas, 67k). Before `bf4d28d` the same input was fuzzy-corrected to `city-george-town` (one inserted space) and scored on Penang.
  - `city[Asia] "Georgetown"` → `corrected city-george-town`, but `run.js` then finds the exact name `city-georgetown` in the wide cohort and returns `wrong-scope` → the player sees **"Georgetown isn't in Asia — try another."**
  - `city[pop > 500,000] "Georgetown"` → same mechanism: wrong-scope on the 67k Texas suburb instead of the 790k Malaysian city.
- Live API: "Georgetown, Texas" → *City in Texas, United States*, Q990898; "Athens, Georgia" (C2) → *City in Georgia, United States*, Q203263; "George Town, Penang" is the existing row's article. Both real, but the bare English name belongs to Penang (and to Guyana's capital, already a `capital` row).
- Fix: delete the line `Georgetown|United States|67176||Georgetown, Texas|` from `scripts/data-cities.mjs` (and its `WIKI_TITLES` entry in `scripts/data-wiki-titles.mjs`), then rebuild. Optionally add `Georgetown` to `city-george-town`'s aliases so the exact form lands without a correction.

### C2. `city-athens` — "Athens" on a Europe or population round is now refused with a false message

- Evidence (shipped matcher): `city[Europe] "Athens"` → `unrecognized` in the subset; `run.js` (`current.constrained`) then finds `city-athens` (Georgia, 127,315, region North America) in the wide cohort and returns `wrong-scope`, so `ui.js` line 556 prints **"Athens isn't in Europe — try another."** Before `bf4d28d` the same input fell through to `elsewhere()` and printed the intended nudge "Athens is a capital city — this round wants a non-capital city."
- `capital "Athens"` still → `capital-athens` (cohort lookups are separate), and plain `city "Athens"` → accepted (Georgia). So the row is only harmful on constrained city rounds — which is most of them (15-round ramp 70→100 % conditional).
- Precedent check (`names.mjs`): four pre-existing city rows share a name with a foreign capital — San Jose, Victoria, George Town, Saint John's — but in each the city is at least as famous as the capital. Athens GA vs Athens GR is not that.
- Fix: delete `Athens|United States|127315||Athens, Georgia|` from `scripts/data-cities.mjs` (+ `WIKI_TITLES`). If the house rule "generosity wins" is read to keep it, the price is the false message above; there is no third option without touching `run.js`.

### C3. Aliases the matcher refuses today (all `unrecognized` in `answers.cjs`)

| id | typed | today | add alias (exact value) | evidence |
|---|---|---|---|---|
| `city-woodbridge-township` | Woodbridge | unrecognized (`township` is not a filler word; edit distance too big) | `Woodbridge` | article "Woodbridge Township, New Jersey", *Township in Middlesex County, New Jersey, US*; no other Woodbridge in the bank |
| `city-clinton-township` | Clinton | unrecognized | `Clinton` | article "Clinton Township, Macomb County, Michigan", *Charter township in Michigan*; no other Clinton in the bank |
| `lake-ivo-lake` | Ivösjön / Ivosjon / Ivön | unrecognized | `Ivosjon` (and `Ivon` if the island-in-the-lake spelling is wanted) | Wikidata Q1675882 sv label **Ivösjön**; en title "Ivö Lake". No pre-existing "Ivön"/"Ivo" row anywhere (islands.json checked) — not a duplicate |
| `lake-orsa-lake` | Orsasjön / Orsasjon | unrecognized (only "Orsa" lands, via filler) | `Orsasjon` | Wikidata sv label **Orsasjön** |
| `lake-siiddasjavri` | Sitasjaure | unrecognized | `Sitasjaure` | Wikidata sv label **Sitasjaure** (the Swedish name; Siiddašjávri is Sami) |
| `lake-rostojavri` | Råstojaure / Rastojaure | unrecognized | `Rastojaure` | Wikidata sv label **Råstojaure** |
| `lake-sadvvajavrre` | Sädvajaure / Sadvajaure | unrecognized | `Sadvajaure` | Swedish form used on maps (Sädvajaure); sv label on Wikidata is the Sami spelling |

Format reminder: the fold file's alias column is comma-separated (`Name|size|alias1,alias2|wikiTitle|theme`); for cities `Name|Country|pop|aliases|wikiTitle|`.

### C4. `river-ajaju` — 770 km is an unsourced infobox number; the only cited figure is 260 km

- Bank `size: 770` (from en infobox `| length_km = 770` with `| length_ref =` **empty**; Wikidata P2043 770 is the same unsourced value).
- es.wikipedia "Río Ajajú": infobox `| longitud = 260 km` and prose "Su longitud alcanza 260 km antes de unirse con el río Tunia para formar el río Apaporis" (the Ajajú is only the Apaporis's headstream; the bank's `river-apaporis` is 1,300 km for the whole system).
- Game effect: at 770 it answers "Name a river longer than 500 km"; at 260 it does not.
- Fix: `Ajajú|260|Rio Ajajú|Ajajú River|South America` in `new-rivers-colombia.txt` / `scripts/data-physical.mjs` line 3048 → `Ajaju|260|Rio Ajaju`.

---

## Judgment calls

### J1. River lengths where the sources split by more than 25 % (`lengths.out`)

The Colombia report's rule was "Wikidata cross-checked against the article; the article wins". Where the article's *infobox* number is unsourced and its *prose* or es.wikipedia says otherwise, that rule picked the weakest figure. Only the first three touch the 500 km threshold.

| id | bank | en infobox | en prose | Wikidata | es.wikipedia | would ship | why |
|---|---:|---:|---:|---:|---:|---:|---|
| `river-catatumbo` | 500 | 500 (unsourced) | "approximately 210 mi (338 km)" | 338 | 450 | **338** | three independent figures (Britannica's 210 mi is the en-prose source) against one bare infobox number; 500 sits exactly on the inclusive threshold, which is the worst place for a doubtful figure |
| `river-caguan` | 470 | 470 (unsourced) | — | 630 | 630 (infobox) | **630** | two sources vs one; at 470 it misses the 500 line, at 630 it passes |
| `river-cahuinari` | 400 | 400 (convert) | — | 550 | no es article | keep 400 | one vs one; the article's figure stands |
| `river-atabapo` | 280 | 280 (unsourced, Rand McNally) | — | 131 (preferred) / 125 | 131 (infobox + prose "de unos 131 km") | 131 | no threshold effect; es and Wikidata agree, en infobox alone |
| `river-ariari` | 185 | — (empty) | — | 185 | 335 (infobox) | either | no threshold effect; neither cites a source |
| `river-orteguaza` | 220 | — (empty) | — | 220 | 130.6 (infobox + prose) | 131 | no threshold effect; es is the only article-level figure |
| `river-medellin` | 100 | — | "For the river's first 60 km it is referred to as the Medellín, after that the Porce" | 100 | 100 | keep 100 | both defensible; 100 is the conventional figure |
| `river-la-vieja` | 102 | 102 | 102 (convert) | 102 | 53 | keep 102 | en repeats its figure in prose |

Clean but worth a note: `river-mendihuaca` 13 km is right (en infobox 12.6, ref EAFIT; es 12.6) — Wikidata's 126 is a decimal slip, so the "Wikidata needs a cross-check" finding from the probe holds here too. `river-sinu` 415 is confirmed by en prose (`{{convert|415|km}}`) and es; Wikidata's 27 is wrong.

### J2. `lake-overuman` — 88 km² (Wikidata) vs 52.49 km² (the article)

en infobox `| area = {{convert|52.49|km2}} ({{convert|3.17|km2}} in Norway)` and prose "Most of the 52.49 km² lake…", sourced to SMHI; Wikidata P2046 = 88 (probably the regulated-reservoir maximum). 40 % apart; both sides of nothing (the lake thresholds are 100/1,000/10,000/30,000 km²). Under the bank's own "cross-check Wikidata against the article" rule, ship **52.5**. The other 23 lake areas equal Wikidata and are within 10 % of any figure the article gives (Stora Le 131 vs 136.1, Ivö 55 vs 50.2, Helgasjön 50 vs 48.5, Ånnsjön 59 vs 57.5, Åsunden 34 vs 32.7).

### J3. Torbes and Uribante are not Colombian rivers

`river-torbes` — "Torbes River": *River in Táchira, Venezuela*, Wikidata P17 = Venezuela only, no article coordinates; the Torbes runs through San Cristóbal and joins the Uribante entirely inside Táchira. `river-uribante` — *River in Venezuela*, P17 = Venezuela only. Neither borders Colombia (the border river of that system is the Táchira, which is also in the batch and correctly *River in Colombia, Venezuela*). They are real South American rivers with sourced lengths (82 km, 245 km) inside the South America theme, so nothing a player sees is wrong — keep them, but the commit message's "66 Colombian rivers" is 64. `river-tiquie` (*River in Amazonas, Brazil*) is fine: it rises in Colombia and P17 lists both.

### J4. Names that are Wikipedia's title rather than the place's name

None of these breaks matching (`lake`/`river`/`the`/`st`/`saint`/`city` are filler words, so "Storvindeln", "Bronx", "Toms", "Joseph" all land); they only affect what the review screen prints and what a Swedish or local player expects to see.

| id | bank name | what the place is called | suggestion |
|---|---|---|---|
| `lake-storvindeln-lake` | Storvindeln Lake | Storvindeln (sv label) | rename to `Storvindeln`; the "Lake" is en.wikipedia's, not the world's |
| `lake-orsa-lake` | Orsa Lake | Orsasjön | keep or rename to `Orsasjon`; either way add the alias (C3) |
| `lake-ivo-lake` | Ivo Lake | Ivösjön | as above (`Ivosjon`) |
| `city-the-bronx` | The Bronx | The Bronx | keep — that is its name; "Bronx" already lands |
| `city-toms-river` | Toms River | Toms River | keep — real name |
| `city-st-joseph` | St. Joseph | St. Joseph, Missouri | keep; the alias `Saint Joseph` is redundant (both fold to "joseph") but harmless — same cosmetic class the 2026-09-15 audit listed |
| `city-lakewood-township`, `city-woodbridge-township`, `city-clinton-township` | …Township | Lakewood / Woodbridge / Clinton | official names, so within the rule; "Lakewood" is owned by Lakewood, Colorado (`city-lakewood`, 155,984) so the NJ row cannot carry that alias — accept that "Lakewood" scores Colorado. Woodbridge and Clinton get aliases (C3) |

### J5. Famous-elsewhere bare names

For each, "accepted either way" holds only when the famous namesake is *not* a city in the bank. Checked with the shipped matcher on a plain city round: all accepted.

- **Keep, no cost**: Hollywood (the LA one is a district, not a city), Westminster (borough), Kent / Norfolk / Suffolk (counties), Ontario (province; "Ontario" on a *lake* round still lands on Lake Ontario via its alias, cohorts are separate), Orange (the Orange River is in the river cohort), Erie (Lake Erie likewise), Frederick, Enterprise, Paradise, Surprise, Elizabeth, Norman, Tyler, Allen, Carmel, Warren, Hampton, Corona, Salinas, Chico, Gilbert, Sparks, Edison, Bowie, Racine, Lynn, Casper, Pueblo.
- **Keep, small cost**: Lancaster (Lancaster, England, 52k, is not in the bank — "Lancaster" on a Europe round was "Not recognized" before and is "Lancaster isn't in Europe" now; no worse for the player), Warwick (same, English town not in bank), Cambridge (pre-existing row *is* the English one; the probe correctly left Cambridge MA out).
- **Not keepable as-is**: Athens and Georgetown (C1, C2) — the namesake is in the bank and was reachable, and now is not.

### J6. Eleven "cities" are unincorporated census places

`city-enterprise` (221,831), `city-spring-valley` (215,597), `city-sunrise-manor` (205,618), `city-paradise` (191,238) — the four Clark County, Nevada "unincorporated towns" that are really Las Vegas; `city-metairie` (143,507, Louisiana CDP); `city-lehigh-acres`, `city-spring-hill`, `city-riverview` (Florida CDPs, 107–114k); `city-east-honolulu`, `city-pearl-city`, `city-waipahu` (Hawaii CDPs, 43–51k). All real, all correctly titled (descriptions verified live), all with populations that match the 2020 census; their low view counts (Sunrise Manor 974/mo, East Honolulu 548/mo) are what a CDP gets, not a wrong-article signal. The city rulebook says "the administrative city or municipality", which a CDP is not; the probe's own source ("List of United States cities by population") excludes them. This is the one place the fill departed from the rulebook. Under "bias data toward inclusion" they can stay; if the user wants the rulebook kept literal, these eleven are the rows to drop. Towns and townships (Cary, Gilbert, Davie, Mount Pleasant, Edison, the three Townships, Bennington, Colchester) are municipalities and are fine.

### J7. Probe leftovers (check 6, lowest priority)

- **Colombian rivers with no length** — of the 15 most-viewed still out (Guayabero, Bojayá, Mulatos, Arzobispo, Carchi, Fucha, Fundación, Guatapé, Guayuriba, Güejar, Mataje, Nare, Papurí, Pira Paraná, Páez), only **Fucha** has a figure anywhere: es.wikipedia prose "Recorre aproximadamente 22 km, de los cuales 17 km pasan por el suelo urbano" → `Fucha|22|Rio Fucha|Fucha River|South America`. The other 14 have empty `length` fields in en, no es infobox `longitud` (or no es article), and no P2043. Carchi is also *River of Ecuador*. A human with a map is still the only route.
- **US "name taken" (45)** — none of the 15 most-viewed (Portland ME, Birmingham AL, Cambridge MA, St. Petersburg FL, Worcester MA, Toledo OH, Charleston WV, Wilmington DE, Manchester NH, Glendale CA, Durham NC, Alexandria VA, Bangor ME, Springfield MO/MA) has a real distinct name; "St. Petersburg" and "St. George" collapse to the same loose key as the Russian and South African rows (`st`/`saint` are filler) so the validator would refuse them. The only door is the one the decisions doc already opens for rivers ("`Derwent (Derbyshire)`… only when Wikipedia's own title has it and the bare name is taken"): Wikipedia's own titles here are the comma forms, `Portland, Maine`, `Birmingham, Alabama`, which normalize to distinct keys (`portland maine`) and would not disturb "Portland" → Oregon. That is a rules decision for the user, not a data fix; the populations are already sourced in the probe report.

---

## Clean

- **Check 1, place**: all 339 live descriptions read as the right kind of thing (river/watercourse; lake/reservoir; city/town/township/borough/CDP/capital) and name the right country or a US state, except the two Venezuelan rivers in J3 and two blanks that Wikidata fills (`Pance River` has no en description, Wikidata *watercourse in Colombia*; `Viken (lake)` is *Body of water*, Wikidata *lake in Sweden*, coordinates 58.62 N 14.29 E). Every coordinate on hand — article coordinates from `scripts/.cache/titles.json` for 244 cities, 24 lakes and 46 rivers, Wikidata P625 for the 5 cities and 13 rivers whose articles carry none — falls inside the country box (the live `prop=coordinates` call only returns ten per request, so the cache was the primary source and the live call a spot-check). No airport, station, school, district or county article; no disambiguation page; every `wikiTitle` resolves to itself (no redirects), including the disambiguated ones `Mjörn (lake)`, `Viken (lake)`, `Åsunden, Västergötland`, `Rutland (city), Vermont`, `San Miguel River (Colombia)`. Seven rivers have no coordinates in either source — `river-cesar`, `river-vita`, `river-cara-parana`, `river-cusiana`, `river-miritiparana`, `river-ceibas` (*River in Colombia*, P17 = Colombia) and `river-torbes` (J3).
- **Check 2, cities**: the 60 largest and 40 smallest all equal Wikidata's preferred P1082 (2020 census) *and* the article infobox, except Fontana (bank 208,393 vs infobox 223,773, 7 %), Garland (246,018 vs 250,791, 2 %) and Harrisburg (50,135 vs 50,099). The five state capitals' city rows carry the city figure (Albany 99,224; Harrisburg 50,135; Jefferson City 43,228; Pierre 14,091; Frankfort 28,602), and Brooklyn / Queens / The Bronx carry the borough census figures (2,736,074 / 2,405,464 / 1,472,654), so "population over 1,000,000" accepts the boroughs by design.
- **Check 2, lakes**: all 24 areas equal Wikidata P2046 (Överuman's article disagreement is J2).
- **Check 2, rivers**: 51 of 66 agree with every figure found (en infobox/prose, Wikidata, es.wikipedia) within 25 %; the disagreements are C4 and J1. Nothing physically implausible remains (Ariporo's 1,300 km was already excluded).
- **Check 3**: no non-ASCII in any built `name` or alias; no new row shares a `wikiTitle` with an existing row in its cohort (the four pre-existing river pairs — Urubamba/Vilcanota, Ou/Nam Ou, Musi, Bassac/Hau — are from the earlier audit, untouched); no new name equals an island or country name; the cross-cohort name shares (river Bogotá/Medellín/Cali/Soacha/San Miguel vs the cities and capital; city Roanoke/Clearwater/Salinas/Chico/Escondido vs rivers; Erie/Ontario/Norman vs lakes) are different real places in separate cohorts and resolve correctly. The Spanish `Rio X` alias is present on 64 of 66 rivers (Caño Cristales and Quebrada Limas are the exceptions and need none).
- **Check 4**: all 249 cities have `region: ["North America"]`, `country: "United States"`, `flag: ["red","white","blue"]`, `sizeUnit: population`; the five state capitals each have both a `capital-*` row (size 340,000,000, `population_of_country`, same `wikiTitle` and magnitude) and a `city-*` row; no new city is its own country's capital; all 24 lakes are in `themes.js` lake → 'Scandinavia' and all 66 rivers in river → 'South America'.
- **Check 5**: no lake over 5,000 views/mo (max Dellen 183); no river over 5,000 except Caño Cristales (2,283, the rainbow river — right article); lowest city magnitudes are the CDPs in J6 and small Vermont/Hawaii/Dakota places whose articles are right. Brooklyn's 164,406/mo is the borough article.
