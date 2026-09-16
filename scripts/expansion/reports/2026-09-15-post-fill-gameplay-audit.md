# Wormillion gameplay audit after the 2026-09-15 fill — 2026-09-15 (late)

Bank: **9,306 entries** (country 197, capital 247, city 2,784, lake 790, river 2,251, mountain 1,310, desert 129, island 1,345, sea_ocean 253) at `b0675d2` (HEAD; `518447f` is the matcher change, `bf4d28d` the cities/lakes, `99aab7f` the Colombian rivers). Everything ran against the real engine loaded the way `netlify/functions/lib/daily.js` loads it (`daily.loadBank` → `promptBank.createBank` over `src/data/bank.js` + `themes.js`; `run.createRun` + `r.submit` for every "what the player sees" claim; `matching.matchAnswer` only where stated). **No repo file was touched.** Scripts and raw outputs are next to this file: `lib.cjs` (loader), `check1.cjs`, `check2.cjs`, `check34.cjs`, `battery.cjs` + `check5.cjs` (+ `check5-results.json`), `check5b.cjs`, `check67.cjs`, `matching-old.js`.

One gotcha for reproducing: `HEAD~1` is **not** the pre-change matcher — a HANDOFF commit landed on top of `518447f`, so `git show HEAD~1:src/js/matching.js` returns the new code (my first battery run showed 0 differences because of this). The old matcher is `git show 518447f~1:src/js/matching.js`.

## Summary

| check | result |
|---|---|
| 1. Every new entry lands (66 rivers, 249 cities, 24 lakes; name + `Rio X`/`X River`/`Lake X` + stripped wikiTitle + aliases) | 569 spellings, **0 failures**, 0 corrected-instead-of-exact. (5 misses were my inputs: "Rio Caño Cristales"/"Rio Quebrada Limas" — a caño and a quebrada, no such alias — and "Rutland (city)" from my regex.) All 339 have a positive magnitude; every new city has `region=["North America"]`, `flag=[red,white,blue]`, `country="United States"`, size equal to its row. |
| 2. Prompt kinds | city region North America 249/249 in; other regions 0; size thresholds correct (Brooklyn 2,736,074 / Queens 2,405,464 / The Bronx 1,472,654 are the only new ones over 500k and 1M; 0 over 5M); flag red/white/blue (+pairs) 249/249 in, green/yellow/black 0; lake theme Scandinavia 24/24 in, 48/48 submits accepted, 13 non-Scandinavian lakes all `wrong-scope`; river theme South America 66/66 in, 130/130 submits accepted. **One structural finding**: the `Rio X` aliases feed the letter rules (bug 1). |
| 3. `rarestFor` round-trip | 260 distinct sampled prompts (all 12 kinds) + 289 exhaustive prompts over city/lake/river: **0 failures**. 12 sampled and 44 exhaustive prompts now reveal a new entry. One reveal reads wrong to a player (bug 1: "starts with R" → Mecaya). |
| 4. Cross-category / same-name | Manhattan, Staten Island, Long Island, Coney Island on a city round → `elsewhere: island` naming the island. "Bronx" → The Bronx. The five new state capitals accepted on both city and capital rounds. Athens/Alexandria/Columbia/Augusta/Albany on a city round accepted (table below). Nothing wrong; judgment calls listed. |
| 5. Matcher battery | 1,788 typed inputs (country 145, capital 250, city 237, lake 176, river 217, mountain 203, desert 75, island 285, sea 200), replica of `run.submit` verified identical to the real `run.submit` on all 1,788. New vs old: **40 differ** — 15 new-worse, 16 new-better, 9 lateral. Real-name trap class (163 Swedish lakes + 60 Colombian rivers still not in the bank, typed 506 ways): wrong-place corrections lake **37 → 22**, river **44 → 38**. |
| 6. Duplicates / collisions | 0 `normalize()` collisions; 6 filler-stripped collisions, all resolved by name-beats-alias, none touching a new entry; **7 shared-`wikiTitle` pairs** (all pre-existing, six unreported — bug 4). |
| 7. Dailies 2026-09-16 → 2026-10-15 | 30 days × 15 prompts: 0 repeated texts within a day, 0 prompts below `MIN_ELIGIBLE` except the documented Mesopotamia (2) and Great Lakes (5); every daily prompt's `rarestFor` round-trips. 24 daily prompts now reveal a new entry (14 of them "Name a river." → Mecaya). |

## Confirmed bugs

### 1. `Rio X` aliases feed the letter rules — "Magdalena" is accepted for "Name a river that starts with R"

`promptBank.variantsOf` (src/js/promptBank.js line 147) takes every alias as a spelling of the name, stripped by `LETTER_FILLER` (line 123), which is derived from `matching.FILLER` (src/js/matching.js line 40) — and `rio`/`río` is in neither. So the alias `Rio Bogota` makes Bogota start with R and contain I and O.

Pre-existing (210 of the 274 `Rio X` aliases predate today), but `99aab7f` added 64 more (every row of `new-rivers-colombia.txt` with a `Rio X` alias), so the inflation grew by a third:

| prompt | eligible | genuinely satisfy it | only via a `Rio` alias | of which added today |
|---|---:|---:|---:|---:|
| Name a river that starts with R. | 351 | 74 | **277** | 63 |
| Name a river with an I in it. | 1,019 | 865 | 154 | 31 |
| Name a river with an O in it. | 993 | 819 | 174 | 43 |
| Name a river with an R in it. | 1,086 | 923 | 163 | 42 |

What the player sees (all `run.submit` on the pinned slot):
- `{category:'river', letter:{kind:'starts', letter:'r'}}` + "Magdalena" → `accepted: Magdalena`; "Bogota" → `accepted: Bogota`. (Amazon, whose alias is "Amazon River", is correctly `wrong-scope`.)
- The **review reveal** for "Name a river that starts with R." is `rarestFor` → **"Mecaya"** (7 views; alias "Rio Mecaya"), and it is also the reveal for "with an I in it" / "with an O in it". A player reads "the rarest river starting with R was Mecaya".
- Length rules are inconsistent the other way: on "Name a river with a short name", "Sinu River" → `accepted: Sinu` (river is filler → "sinu"), but "Rio Sinu" → `wrong-scope [len 7, need 5 letters or fewer]`; same for "Rio Otun" vs "Otun River".

Should be: a `Rio` alias is a typing convenience like "River X", not a spelling that starts with R (the HANDOFF rule "filler words are not letters"). Cheapest fix that doesn't touch matching: add `rio`/`río` to `LETTER_FILLER` (and to `FILLER`, which also fixes bug 3 and the short-rule inconsistency — but that changes the loose index for the 7 entries *named* "Rio …", e.g. Rio Grande → bare "grande", so check the claims). Alternatively skip aliases beginning with `rio ` in `variantsOf`.

### 2. `nearest()` ties a full-name hit against a bare-only hit and refuses both — regression from `518447f`

src/js/matching.js `nearest()` (line 163; the `Math.min` at ~183 and the pooling loop below it): `distance = Math.min(editDistance(key, candidate.key), editDistance(bare, candidate.bare))`, then all candidates at `bestDistance` are pooled as equals. A candidate whose *full* key is one edit away now ties with an unrelated entry whose *filler-stripped* form happens to be one edit away, and the tie guard refuses. Four in my battery, all corrected by the old code:

| typed (meant) | old | new | tie partner (full / bare distance) |
|---|---|---|---|
| "Lotse" (Lhotse) | accepted Lhotse | `unrecognized` | Lhotse full=1 vs **Lose Hill** bare "lose" … "lotse"=1 |
| "Mount Blanc" (Mont Blanc) | accepted Mont Blanc | `unrecognized` | Mont Blanc full=1 vs **Blanca Peak** bare "blanca"=1 |
| "Sicilly" (Sicily) | accepted Sicily | `unrecognized, elsewhere: sea_ocean "Strait of Sicily"` | Sicily full=1 vs **Isles of Scilly** bare "scilly"=1 |
| "Guadaloupe" (Guadeloupe) | accepted Guadeloupe | `unrecognized, elsewhere: mountain "Guadalupe Peak"` | Guadeloupe full=1 vs **Guadalupe Island** bare=1 |

The last two are worse than a refusal: the fuzzy `elsewhere()` pass then tells the player "Strait of Sicily is a sea — this round wants an island" / "Guadalupe Peak is a mountain". Should be: a candidate matched on its full key at distance d should beat one matched only on its bare form at the same d (rank by `(distance, matchedOnBare)`), or only pool ties within the same comparison kind. Repro: `check5.cjs` rows, or `matching.matchAnswer('Lotse', bank.cohorts.get('mountain').lookup, null)`.

### 3. `rio` is not filler, so "Rio <name>" still buys the edits `518447f` took away from "Lake <name>"

The commit's mechanism ("the budget comes from the name proper") only works for words in `FILLER`. "Rio Páez" has bare form "rio paez" (8 chars → 2 edits), and the bank now holds 274 `Rio X` aliases to land on. Among the 60 Colombian rivers from the probe that are still not in the bank, typed as `X` / `X River` / `Rio X` (180 forms): **38 wrong-place corrections in the new code (44 old)**, 33 of them in both. Examples (all `matchAnswer` on the river cohort, and `run.submit` on a plain river round gives the same since no other cohort has these names):

- "Rio Opon" → **Otun** (a new entry, via its new alias "Rio Otun") · "Rio Leon" → Loa · "Rio Páez" → Paru · "Rio Metica" → Meta · "Rio Carchi" → Caroni · "Rio Mataje" → Macae · "Rio Guapi" → Gurupi · "Rio Cuiari" → Ariari · "Rio Güiza" → Tuira · "Rio Batán" → Bayano · "Rio Murrí" → Mucuri · "Rio Guachiría" → Tachira (new) · "Rio Guatapé" → Guayape.
- From the battery: "Rio Bravo" (the Mexican name of the Rio Grande) → `accepted: Branco (corrected from "Rio Bravo")` via the alias "Rio Branco" — both old and new.

Same fix as bug 1 (`rio` in `FILLER`), or give the new rivers no `Rio X` aliases at all — the loose pass already finds "Sinu" from "Rio Sinu" once `rio` is filler.

### 4. Seven pairs of entries share one `wikiTitle` inside a cohort ("one real place, one row")

None involve today's entries; six are not in `reports/2026-09-15-bank-audit.md` (Firth is, and is still unfixed). Both rows of each pair score identically (same magnitude), and two are wrong-article bugs rather than duplicates:

| cohort | rows (`id`) | shared `wikiTitle` | note |
|---|---|---|---|
| river | Urubamba (`river-urubamba`, 724 km) / Vilcanota (`river-vilcanota`, 217 km) | Urubamba River | same river, upper course name — merge as alias |
| river | Ou (`river-ou`, alias Oujiang, 388 km) / Nam Ou (`river-nam-ou`, 448 km) | Nam Ou | **wrong article** (from the alias and length, not checked online): Ou/Oujiang is the Ou River in Zhejiang, China; it scores on the Laotian Nam Ou |
| river | Musi (India) (`river-musi-india`) / Musi (`river-musi`, 750 km) | Musi River (India) | **wrong article**: the 750 km Musi is Sumatra's (`Musi River`); it scores on the Hyderabad one (2,009 views) |
| river | Bassac (`river-bassac`, 90 km) / Hau (`river-hau`, 220 km) | Bassac River | same distributary, Khmer/Vietnamese names — merge |
| mountain | South Sister (`mountain-south-sister`) / Three Sisters (`mountain-three-sisters`), both 3,157 m | Three Sisters (Oregon) | one article — merge |
| mountain | Mount Kailash (`mountain-mount-kailash`) / Mount Song (`mountain-mount-song`, alias Songshan, 1,512 m) | Mount Kailash | **wrong article**: Mount Song (Henan) scores on Kailash's 53,209 views — near the top of the cohort, so it is worth almost nothing |
| sea_ocean | Firth of Forth / Firth of Clyde | Firth | already in the bank audit; still both on the generic "Firth" page |

Data rows: `src/data/rivers.json`, `mountains.json`, `seas-oceans.json` by the ids above; fixes go through `scripts/data-wiki-titles.mjs` / `scripts/expansion/drop.mjs` per HANDOFF.

### 5. Wrong-place corrections and nudges that survive in the new matcher

From the 1,788-input battery (each verified with `run.submit` on a plain round of the category):

| typed (meant) | player sees | mechanism |
|---|---|---|
| capital "Praha" (Prague) | `accepted: Praia (corrected from "Praha")` | fuzzy; Prague has no "Praha" alias, Praia is one edit |
| river "Rio Bravo" (Rio Grande) | `accepted: Branco (corrected)` | bug 3 |
| island "Isle of White" (Isle of Wight) | `accepted: Whakaari/White Island` | **loose**, not fuzzy: bare "white" → the alias "White Island"; a very common misspelling lands in New Zealand |
| island "Rock Island" (the Illinois city; not in bank) | `accepted: Rock Islands` (Palau) | loose: "island(s)" is filler |
| country "Nigera" (Nigeria) | `unrecognized, elsewhere: river "Niger River"` | **new since 518447f**: in-cohort tie Nigeria/Niger refuses, then `elsewhere(false)` fuzzy-matches the river's bare form and nudges "Niger River is a river" (old: plain `unrecognized`) |
| country "Nambia" (Namibia) | `elsewhere: river "Gambia River"` | same |
| river "Tames" (Thames) | `elsewhere: sea_ocean "James Bay"` | same (the documented Thames/James tie, now with a misleading nudge on top) |
| desert "Bardenas" (Bardenas Reales) | `elsewhere: sea_ocean "Barents Sea"` | same |

The four nudges are the fuzzy `elsewhere()` pass (src/js/run.js line 93) inheriting the new bare-form comparison: a *nudge* now fires on a fuzzy bare hit in another cohort, which the comment there ("a fuzzy near-miss in another category is not evidence of anything") argues against. Consider `exactOnly` for the unrecognized path too, or requiring the elsewhere hit to be exact/loose when the in-cohort result was a refused tie.

## Judgment calls

**Four-letter cores lost their slack when the generic word is typed** (accepted in the commit message as "43 lost, 36 four-letter"). 234 bank entries have a ≤4-letter core wrapped in a generic word (Lake Erie, Lake Eyre, Lake Van, Lake Chad, Black Sea, Gulf of Aden, Gulf of Oman, Mount Fuji, Isle of Man, Toms River, Salt Lake City, Cape Town…). In the battery the old code corrected and the new refuses: **"Mount Fugi", "Lake Komo", "Lake Ayre", "Lake Volt", "Blak Sea", "Wite Sea", "Gulf of Adan", "Gulf of Omen", "Sea of Azof", "Isle of Mann"** (10), plus "The Bronks" → The Bronx ("the" no longer buys the second edit). "Mount Fugi" is the most common misspelling of that mountain. This is the design working as written, but it is a visible cost; a possible middle ground is `slackFor(bare.length)` floor of 1 when the typed string *did* carry a generic word and the candidate carries the same word.

**Athens, Alexandria, Columbia, Augusta, Albany, Edinburg on a city round** — all accepted, as intended; what the player actually sees:

| typed | lands on | pop | views/day | rarity | points |
|---|---|---:|---:|---:|---:|
| Athens | Athens (Athens, Georgia, US) | 127,315 | 15,798 | 0.387 | 302 |
| Alexandria | Alexandria (Egypt) | 5,500,000 | 56,314 | 0.227 | 169 |
| Columbia | Columbia (South Carolina) | 137,000 | 23,895 | 0.335 | 255 |
| Augusta | Augusta (Maine) | 19,000 | 12,937 | 0.412 | 325 |
| Albany | Albany (New York) | 99,224 | 36,284 | 0.282 | 212 |
| Edinburg | Edinburg (Texas) | 100,243 | 6,910 | 0.491 | 401 |
| Georgetown | Georgetown (Texas) | 67,176 | 7,001 | 0.490 | 400 |

A player who types "Athens" meaning Greece gets 302 points for Athens, GA with no hint; before today they got "Athens is a capital — this round wants a non-capital city". **"Edinburg" is the standard misspelling of Edinburgh**; until today it was corrected to Edinburgh (city, 1 edit), now it is an exact hit on Edinburg, Texas for 401 points. ("Monterey" → Monterey, CA is the same shape but pre-existing — Monterey was already in the bank.) On a capital round Athens → Greece, Columbia/Augusta/Albany → the US capitals, Georgetown → Guyana: all fine. "Frankfurt" on a capital round → `elsewhere: city "Frankfurt"` (not corrected to Frankfort) — correct.

**Length rules strip `FILLER` even for whole-name cities.** `spellingsOf` adds `looseKey(name)` for every category, so on "Name a non-capital city with a short name (5 letters or fewer)" these are accepted as typed: **"Toms River"** (via "toms"), **"Grand Island"** ("grand"), **"Cape Coral"** ("coral"), "The Bronx" ("bronx"). Documented ("or its generic-word-trimmed form, whichever fits") but reads oddly next to the whole-name letter rule, where Toms River starts with T and Lake Charles starts with L. Conversely "Port Saint Lucie" (14 letters as typed) is `wrong-scope` on the long-name prompt because the entry's spellings are "port st lucie" (11) and "port lucie" — the entry is not in the lookup at all, so the typed-spelling generosity never gets a chance.

**Whole-name starts/ends on the new cities** behave per design and are consistent: "St. Joseph" starts with S only ("Joseph" typed on starts-with-J → `wrong-scope: St. Joseph`), "Lake Charles" starts with L only, "Port St. Lucie" starts with P and ends in E, "Toms River" ends in R and contains V, "The Bronx" starts with B (ends: x is not a drawable letter) and is short. Lakes are not whole-name, so **"Ivö Lake" ends in O** and "Orsa Lake"/"Ivö Lake" are short names; "Ivö Lake" on "ends in E" → `wrong-scope`.

**Names are folded to ASCII in the bank**: the player sees "Overuman", "Annsjon", "Siiddasjavri", "Takern", "Cano Cristales", "Bogota" (river) — every one of the 790 lakes and 2,251 rivers already is, so this is house style; "Överuman", "Ånnsjön", "Siiddašjávri", "Caño Cristales" all normalize and land. All folded-letter rules hold: Överuman starts with O, Ånnsjön starts with A / ends in N / has a double letter, Siiddašjávri contains S and J, is long and has a double letter.

**Mecaya (7 views/day, alias "Rio Mecaya") is now the river cohort minimum** and therefore rarity 1.000 and the ★ reveal for every plain "Name a river." — 14 of the next 30 dailies reveal it, plus "in South America", "with an E/M/O in it", "starts with R" (bug 1). Lowering `lmin` from log10(9) to log10(7) nudged every river's rarity up a hair. Likewise Storvindeln Lake (17 views) is the reveal for "Name a lake with a long name" in three dailies. Working as designed; the reveal of an obscure Colombian stream for "Name a river." is the game's premise.

**Smallest new cities**: Sitka 8,458, Wasilla 9,054, Pierre 14,091, Bennington 15,333, Rutland 15,807, Colchester 17,524 — the probe's "largest in its state" rule, so intended. Largest: Brooklyn 2,736,074, Queens 2,405,464, The Bronx 1,472,654, Arlington 394,266, Irvine 307,670.

**Country "Columbia"** (meant Colombia) → `elsewhere: capital "Columbia"` — pre-existing (Columbia, SC was already a capital); now it is also a city, so the nudge is at least consistent.

**"Antarctica"/"Antartica" on a desert round** now corrects to Antarctic Desert (old: unrecognized) — an improvement, listed because it depends on the wrong-article-shaped Antarctic Desert entry the previous audit flagged.

## Clean

- **Check 1**: every row of the three folded files is in its cohort under the row's `wikiTitle`; name, aliases, `Rio X` (where aliased), `X River`, `Lake X`, and the stripped wikiTitle all `accepted` without correction on the right entry (569/569). 0 zero-magnitude entries. City sizes equal the rows; region/flag/country uniform.
- **Check 2**: North America region lookup holds all 249; no new city leaks into any other region; size thresholds split as expected (the four "under" city prompts are above `MAX_ELIGIBLE_SHARE` and never drawn, as before); flag prompts for red/white/blue and their pairs hold all 249, green/yellow/black none; Scandinavia holds all 24 and refuses Superior, Baikal, Titicaca, Loch Ness, Geneva, Balaton, Ladoga, Onega, Constance, Como, Great Slave, Peipus (all `wrong-scope`, each naming the lake), while Saimaa, Inari, Thingvallavatn, Mjøsa, Vänern are in; South America holds all 66 (252 total).
- **Check 3**: 0 `rarestFor` reveals that the same prompt refuses, across 260 sampled + 289 exhaustive + 450 daily prompts; rarities match to 1e-9.
- **Check 4**: Manhattan / Staten Island / Long Island / Coney Island → `elsewhere: island` with the island's name; Brooklyn, Queens, The Bronx, "Bronx", "the bronx" → The Bronx; Albany, Harrisburg, Pierre, Frankfort, Jefferson City accepted on both city and capital rounds; Brooklyn on a capital or island round → `elsewhere: city "Brooklyn"`; "St Joseph"/"Saint Joseph"/"St. Joseph" all land; "Port Saint Lucie" lands; "Charles" → Lake Charles; "Orsa" → Orsa Lake and city "Orsa" → `elsewhere: lake`; "Lake Tåkern" → Takern (the trap from the probe is closed); "Store Le" → corrected to Stora Le.
- **Check 5**: the replica of `run.submit` agreed with the real thing on all 1,788 inputs. New-better cases (16): the Immeln → Ilmen and "Philip Island" → Chiloe wrong-place corrections are gone; bare typos of names that carry a generic word now correct (Carribean, Caribean, Mediteranean, Atlantik, Pasific, Artic, Balitc, Adriatik, Agean → the sea; Kurils, Patagonia, Strezlecki, Mt Whitny, Lake Ansjon). Common misspellings all still correct in both: Phillipines, Reykjavic, Bejing, Tokio, Copenhagan, Brissbane, Cincinatti, Albuquerqe, Pittsburg, Tuscon, Rio de Janiero, Buenos Aries, Marseilles, Mississipi, Kilimanjro, Mount Everst, Lake Superiour, Sahra, Gasherbrum 1, Antartica (→ desert), Lousiana/Massachusets/Chernobyl (refused).
- **Check 6**: 0 `normalize()` collisions in any cohort; the 6 filler-stripped collisions (musi, great salt, san cristobal, lipari, trobriand, arabian) all resolve to the full-name owner and none is "nobody wins"; no new entry's name or alias collides within its cohort. The 22 exact cross-cohort name matches created today (river Bogota vs capital Bogota, city Albany vs capital Albany, city Erie vs Lake Erie…) all behave through `elsewhere` as designed.
- **Check 7**: 30 dailies × 15 prompts, 0 duplicated prompt texts within a day, 0 prompts under `MIN_ELIGIBLE` other than the documented Mesopotamia (#6, #25) and Great Lakes (#9, #12) themes; the thin-but-legal rounds are the same reality-of-the-alphabet ones as before (river > 5,000 km = 7, sea with a J = 6, country in East Asia = 6, North Africa = 6, Central America capitals = 7, country starts with R = 6).
- `npm test` (175), `validate`, `gap-check` were not re-run (the task says they are green; nothing here contradicts that — the bugs above are all in territory the tests don't pin).
