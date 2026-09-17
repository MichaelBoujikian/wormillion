# Data audit of UK + Ireland rivers, the two river re-points and the five lake fixes — 2026-09-16

progress: 64/64 rows checked (57 rivers + Lee + Avoca + 5 lake fixes); checks 1–7 done; the 86-item "taken" list done; two detector sweeps beyond the wave (British Isles theme members, no-coordinate lakes) done.

Scope: the 57 rows of `scripts/expansion/work/folded/new-rivers-uk.txt` (commit cf4f25b), the re-points river-lee -> "River Lee" and river-avoca -> "River Avoca", the lake fixes of 612aad1 (Ypoa, Xiloa, San Pablo dropped; Coatepeque -> "Coatepeque Caldera"; Lagarfljot -> "Lagarfljót"), the lake theme "North America" of 8e8cebe where the lake fixes touch it, plus the probe's "taken" list in `scripts/expansion/work/uk-rivers.json` (86 items).
Evidence standard: offline only (no network). Place from `scripts/.cache/titles.json` description + coordinates (box lat 49.8–61, lon -11–2); figure from `scripts/expansion/work/wikitext-cache.json` infobox (parsed with the same code as `article-size.mjs`) and `uk-rivers-sizes.json`; names through the shipped matcher (`src/js/matching.js` over the cohort from `netlify/functions/lib/daily.js loadBank`) and the pre-session bank + engine (`git show 81b0b00:…`, river cohort 3,192 -> 3,249, lakes 1,160 -> 1,157). `bank.js` carries no `wikiTitle`/coordinates, so entries are joined back to `src/data/rivers.json` / `lakes.json` by id.
Scripts used (beside this report): `audit-rows.cjs` (per-row checks 1–6; output `audit-rows.json`, `audit-rows.out`), `audit-taken.cjs` (check 7; `audit-taken.json`, `audit-taken.out`), `audit-lakes.cjs` (612aad1); the one-off sweeps are inline `node -e` runs described in the findings.

## Summary

| check | confirmed problems | judgment calls |
|---|---|---|
| 1 right place | 0 of 57: every article's description is "River/Tributary in …" and every coordinate the cache has falls in the box | 6 rows have no page coordinate at all (Irwell, Ise, Teise, Awbeg, Bride, Fane) — right articles, invisible to any coordinate-derived theme |
| 2 right figure | 0 of 57 cross a threshold (all 50–114 km; nearest threshold 500) | 8 rows carry a Wikidata-only figure (empty infobox `length`); Ballisodare's 61 km is the Owenmore+Ballisodare system; Avoca kept 13 km after the re-point where Wikidata says 56 |
| 3 right name / matcher | 0: all 57 bare names, "River X" and "X River" `accepted` on the new bank; the 8 fuzzy traps now exact | a typo of a famous river now lands on a real obscure one (Thame/Thames, Taf/Taff, Glyde/Clyde, Deel/Dee); four names also live in other cohorts (Douglas, Clare, Devon, Cary) |
| 4 cohort + themes | 0: all 57 in `Europe` and `the British Isles`, in no other river theme; `themeMisses` empty | — |
| 5 rarity outliers | 0: the four 30-view rows (Ballisodare, Owenmore, Deel, Robe) are the right articles; 30 views is the 1-view-a-day floor that 292 of 3,249 rivers sit on (rarity 0.844, not a jackpot) | — |
| 6 duplicates | 0 duplicate `wikiTitle`s or names/aliases anywhere in the river cohort; no new row is an old entry under another name | Owenmore + Ballisodare (one river system, two rows) |
| 7 "taken" list holders | **1 engine defect surfaced by the list** ("River Isle" is corrected to River Mole); 0 Lee-class holders among the 86 | 4 holders less viewed than the British river they block (Loddon, Medina, Stour, Frome); Roe (Montana, 61 m) holds the Northern Irish Roe's name |
| sweeps beyond the wave | **Humber** scores on *Humber River (Ontario)*; **Loch Leven** on *Loch Leven (California)*; **Lake Coatepeque** and **Lake Arrowhead** missing from lake theme `North America` | Lake Peruca on *Perućac lake* (the Drina reservoir) needs a live look; Lagarfljót's article describes itself as "River" |

## Confirmed

### C1. Humber (river) scores on the Ontario river — Lee class, in the British Isles theme
- **Evidence.** `src/data/rivers.json` `river-humber`: name Humber, size 62 (the English Humber's length), themes `the British Isles` + `Europe`, but `wikiTitle: "Humber River (Ontario)"`, `lat 43.632, lon -79.472`, magnitude 1,218 from that article; `titles.json`: "River in Canada". The UK probe never saw it: `uk-rivers.json` `skipped` holds `{"title":"Humber","description":"Large tidal estuary in north-east England"}` (estuaries are skipped), so the taken-list detector had nothing to compare. Dates from 39534ba (the 2026-09 expansion), not this wave.
- **Player sees.** "Humber" is accepted on British Isles/Europe rounds (name and theme are right), but its rarity is the Toronto river's (1,218 views/mo) rather than the estuary's; its coordinates say Canada, so a coordinate-derived river theme would move it to North America and out of Europe.
- **Fix.** `src/data/rivers.json` `river-humber`: `wikiTitle` -> `"Humber"`, re-fetch magnitude and coordinates (WIKI_VERIFIED). Severity: medium.

### C2. Loch Leven (lake) scores on a Californian lake — Lee class, in the British Isles theme
- **Evidence.** `src/data/lakes.json` `lake-loch-leven`: name Loch Leven, size 13.3 km² (the Kinross loch's area), theme `the British Isles`, `wikiTitle: "Loch Leven (California)"`, no coordinates, magnitude 91; `titles.json`: "Lake in the state of California, United States". Found by the 612aad1 "no coordinates" detector run over the lake cohort (14 lakes have none; this is the one whose description names another country).
- **Player sees.** Accepted on British Isles rounds; rarity from a 91-view Sierra Nevada tarn instead of Scotland's most visited loch; a coordinate-derived theme would never place it.
- **Fix.** `lake-loch-leven`: `wikiTitle` -> the Kinross article (`"Loch Leven, Kinross"` on English Wikipedia; verify live), re-fetch magnitude/coordinates. Severity: medium.

### C3. Lake Coatepeque is missing from lake theme "North America" after its re-point
- **Evidence.** 8e8cebe derived the theme from the titles cache at 18:05; at that moment `lake-lake-coatepeque` pointed at "Lake island" (no coordinates) and was left out. 612aad1 (later) re-pointed it to "Coatepeque Caldera" (`titles.json`: "Caldera in El Salvador", 13.87,-89.55) but the list in `src/data/themes.js` was not re-derived. `loadBank` now: the entry is in **no** lake theme; the box sweep (lat 7–84, lon -170 to -50) finds it as one of two lakes with in-box coordinates outside the theme.
- **Player sees.** "Name a lake in North America." -> "Lake Coatepeque" -> rejected as not in North America (a false miss on a real Central American lake, 609 views/mo).
- **Fix.** `src/data/themes.js`, lake `'North America'` (line ~1105): add `'Lake Coatepeque'`. Severity: high (a wrong rejection).

### C4. Lake Arrowhead is missing from lake theme "North America" (cache keyed by the queried title)
- **Evidence.** `lakes.json` `Lake Arrowhead`: `wikiTitle "Lake Arrowhead Reservoir"`, 34.258,-117.183, 670 views. `titles.json` holds it under the key `"Lake Arrowhead (California)"` with `finalTitle "Lake Arrowhead Reservoir"`; the derivation looked the entry up by its `wikiTitle` (the final title), found nothing, and left it out. Same sweep as C3; these two are the only in-box lakes outside the theme.
- **Player sees.** "Name a lake in North America." -> "Lake Arrowhead" -> rejected.
- **Fix.** `src/data/themes.js`, lake `'North America'`: add `'Lake Arrowhead'`. And for the next derivation: index the titles cache by `finalTitle` as well as by the queried key, or derive from `lakes.json` coordinates (which already has 34.258,-117.183). Severity: high.

### C5. "River Isle" is corrected to River Mole (engine; surfaced by the taken list)
- **Evidence.** `uk-rivers.json` lists "River Isle" (Somerset, 23 km) as *taken* by the bank's Mole. Shipped matcher over the river cohort: `matchAnswer("River Isle")` -> `{status:"corrected", entryId:"river-mole", matched:"river mole"}`; `matchAnswer("Isle")` -> accepted as Isle (river) (France). Mechanism: `normalize("River Isle") = "river isle"`, both words are FILLER, so `looseKey` is empty; `foreignWordIn` sees "isle" (an island word) and blocks the loose pass; `nearest` falls back to `bare = key` and gives the *whole* string the slack of ten characters (2), and "river isle" -> "river mole" is two substitutions. The old engine (81b0b00) corrects the same way, so this is not a regression of 63d894f; it is the one all-filler name in the bank that a category word can be prefixed to (bank-wide scan of names whose loose key is empty: Isle, Mountain Lake, Island Peak, Peak Mountain, Mount Desert Island, City Island — only Isle misbehaves).
- **Player sees.** Types "River Isle" (Somerset or the French Isle) and is scored the Mole, 200 km away, as a "correction".
- **Fix.** Data: `src/data/rivers.json` `river-isle` alias `"River Isle"` (the French Isle is also written "the Isle river"; an exact hit beats the fuzzy pass). Engine, for the lead: in `nearest`, an empty loose key should not inherit the full string's slack (the docstring already says the budget comes from the name proper). Severity: low (a rare typing), but it is a wrong acceptance.

## Judgment calls

### Check 1 — six rows with no page coordinate
Irwell, Ise, Teise, Awbeg, Bride, Fane have `lat`/`lon` null in `rivers.json` and in `titles.json`. Their descriptions are the right rivers ("River in Lancashire and Greater Manchester", "River in Northamptonshire", "River in Kent", "… tributary of the Munster Blackwater" ×2, "River in northeastern Ireland"); the infoboxes carry only inline source/mouth coordinates or none. Not wrong articles — but the 612aad1 lesson ("no coordinates" as a wrong-article detector) has this false-positive class (19 of the 190 British Isles rivers lack a coordinate, including the Severn, Mersey and Dee), and a coordinate-derived river theme would drop them. The curated `Europe` list has all of them.

### Check 2 — figures
- Eight rows are Wikidata-only (infobox `length` empty, `uk-rivers-sizes.json` "wikidata only"): Wensum 75, Teviot 60, Devon 54, Isla 74, Ettrick Water 53, Cary 56, Irthing 55, Nairn 61. Isla and Nairn have an empty wikitext cache entry (no `{{Infobox` found — likely Geobox articles, which `article-size.mjs` does not parse). All plausible; none within 380 km of the 500 km threshold.
- Ballisodare River 61 km (`length_km=60.8`) with Owenmore River (County Sligo) 52 km (`length_km=52.3`) both in: the Owenmore *becomes* the Ballisodare at Collooney (both articles' mouth coordinate is the same point 54.19,-8.48), so the 61 km is the system that includes the Owenmore. Two rows for what is arguably one river, 30 views each. Figures are the articles' own; nothing crosses a threshold.
- river-avoca: the re-point changed `wikiTitle`, coordinates and views (183 -> 244) but kept `size: 13`; the probe's figure for "River Avoca" is 56 km (Wikidata P2043; the infobox has no length). 13 km is defensible as the Avoca proper (Meeting of the Waters to Arklow); 56 is the Avonmore–Avoca system. No threshold near. river-lee kept 89 where the infobox says `{{convert|90|km}}` (Wikidata agrees, 90): a rounding wobble.
- The 129 rivers the probe found *present* were also compared (bank size vs the probe's chosen figure): none differ by more than 15%.

### Check 3 — near-namesakes now exact (what the old bank did with the same typing)
| typed | old bank | new bank |
|---|---|---|
| Irwell / River Irwell / Irwell River | corrected -> Orwell | accepted (Irwell) |
| Weaver | corrected -> Beaver (Oklahoma) | accepted |
| Coquet | corrected -> Cloquet (Minnesota) | accepted |
| Thame | corrected -> Thames | accepted (Thame, 65 km) |
| River Bure | corrected -> Ure | accepted |
| Leadon | corrected -> Ladon (Greece) | accepted |
| Glyde | corrected -> Clyde | accepted |
| River Deel | corrected -> River Dee (Wales) | accepted |
| Cary River | corrected -> Mary (Queensland) | accepted |
| Rede River | corrected -> Red River of the South | accepted |

All eight of the report's traps are gone and two more (Cary River, Rede River) with them. The flip side: a player who typo-s **Thames** as "Thame", **Taff** as "Taf", **Clyde** as "Glyde" or **Dee** as "Deel" now scores the obscure real river instead of the famous one. Same themes (British Isles, Europe) and the same side of every size threshold in every case, so the answer still counts on any regional/theme/size prompt; only a letter prompt could tell them apart. Not a defect of the rows — an exact name wins by rule — but worth knowing when a "why did I get the Thame" report comes in.

Four new bare names also name entries in other cohorts: Douglas (Douglas Lake, Douglas Mountain, Douglas Island), Clare (Clare Island), Devon (Devon Island), Cary (the city). On a river round the exact river now wins where the old bank gave the cross-category nudge ("Devon Island is an island"); the reverse direction is untouched. Correct behaviour, noted for the gameplay audit's nudge check.

### Check 6 — Owenmore / Ballisodare
See check 2. If one has to go, the Owenmore (52 km, its own article and figure) is the river and the Ballisodare (the last few km to Ballysadare Bay, whose 60.8 km figure is the whole system) the alias candidate — or keep both, as now; they are distinct articles and neither is a namesake of anything.

### Check 7 — the 86 "taken" items, classified
- 2 are now *present* (River Lee, River Avoca — the re-points; the probe ran before them).
- 46 are held by another British or Irish river (Carron ×2 -> Forth Carron; Esk ×3 -> Lothian; Almond; Axe; Bann; Cam ×2; Derwent ×3 -> Derbyshire; Frome ×4 -> Dorset; Itchen; Lochy; Lune; Mole; Ribble; Tweed; Tyne; Wey; Wye ×2; Ouse; Avon ×4 -> Bristol; Calder ×5 -> West Yorkshire; Dee ×3 -> Wales; Eden ×2 -> Cumbria; Stour ×4 -> Kent): every holder's article is in the box (or has no coordinate but a British description), in `the British Isles`, and its size matches the probe's figure for that article. No Lee-class holder among them.
- 37 are held by a river abroad that is not in the British Isles theme (Blackwater ×6 -> Florida; Don ×4 -> Russia; Jordan ×4; Yellow River ×2; Red River ×2; Main ×2 -> Germany; Black River -> Jamaica; Crooked -> Oregon; St. Johns; Kings -> California; New; Adda -> Italy; Ems; Loddon -> Victoria; Medina -> Texas; Mun -> Thailand; Roe -> Montana; South Esk -> Tasmania; Swift -> Alaska; Tar; Ter -> Catalonia; Whitewater; Wolf): decision 5 territory. Worth the name policy's first look, because the holder is *less* viewed than the British river it blocks in four cases: **Loddon** (Victoria 274 v, 392 km) vs River Loddon (Hampshire, 487 v, 45 km); **Medina** (Texas 487 v) vs River Medina (Isle of Wight, 731 v); **Stour (Kent)** (944 v) vs River Stour, eastern England (1,461 v, 76 km — the Constable one); **Frome** (Dorset 578 v) vs River Frome, Bristol (731 v). And **Roe**: the bank's Roe is the Montana "shortest river in the world" (0.06 km, 1,583 v) — "Roe" on a British Isles round is refused as not in the British Isles; the Northern Irish River Roe has no length figure, so it could only come in at size 0 under 7d00d78.
- 1 is a fuzzy correction misreported as taken: "River Isle" -> Mole (C5).
- "River Blackwater (Northern Ireland)" 91 km and the bank's Blackwater (Florida) 91 km share a figure; the holder's coordinates, description and views are all Florida's and both rivers are about 90 km long, so this reads as coincidence rather than a swapped figure (the 129 present rows show no figure drift either). Same for "River Esk (Ravenglass)" 32 km vs the Lothian Esk's 32 km.

### The lake fixes of 612aad1
- The three drops are clean: `lake-lake-ypoa` ("Lakes and rivers of Titan", 2,222 v), `lake-lake-xiloa` ("Volcanic crater lake", 2,922 v) and `lake-lake-san-pablo` ("Khari Khari Lakes") are gone from `lakes.json`; `themeMisses` is empty (no theme list still names them); "Lake Ypoa", "Xiloa", "San Pablo" are `unrecognized` on the lake cohort (no stray correction onto something else). Note the two dropped ones carried 2,000+ views/mo *because* the wrong article was popular — their rarity was wrong the whole time.
- `lake-lake-coatepeque` -> "Coatepeque Caldera": description "Caldera in El Salvador", 13.87,-89.55; size 26 km² unchanged (the lake is ~25 km²); "Lake Coatepeque" and "Coatepeque" accepted; "Coatepeque Caldera" unrecognized (the article title with its generic word is not an alias — add `"Coatepeque Caldera"` as an alias if the gameplay audit's "stripped wikiTitle lands" rule is meant to cover it). Theme gap: C3.
- `lake-lagarfljot` -> "Lagarfljót": magnitude 1,005 -> 365 (the Worm was the popular page), size 40 km² unchanged. `titles.json` describes the article as **"River"** with no coordinates: the Wikipedia article covers the lake (Lögurinn) and the river under one title, and Wikidata types it as a river. Right article for the lake as far as English Wikipedia goes, but the data audit's "kind of thing" check trips on it and no coordinate-derived theme will ever place it; it is in the curated `Scandinavia` set. The lake's area is 53 km² by the article's own text, if memory serves — nothing crosses 100 either way; check on the next live pass.

### Found on the way (outside the wave, from the same detectors)
- **Lake Peruca** (`lakes.json`, size 13 km², 457 v, no theme): `wikiTitle "Perućac lake"`, `titles.json` (under "Perućac Lake"): "Reservoir in between Višegrad & Bajina Bašta" — that is the Drina reservoir on the Serbia–Bosnia border. The name (Peruća) and the 13 km² match **Peruća Lake** in Croatia (on the Cetina; the Drina reservoir is a little smaller, from memory). Likely a wrong article; needs one live look (`Peruća Lake`).
- The no-coordinate list of the lake cohort (14) otherwise holds right articles: Dead Sea, Chew Valley Lake, Lake Grundlsee, Bilećko Lake, Tabatskuri Lake, Lake Itasy, Lake Moeris (for Qarun — the ancient lake's article, a known choice), Lake Oubeïra, Lake Burabay (for Borovoe — same lake), Yamdrok Lake, Twin Buttes Reservoir.
- 19 of the 190 British Isles rivers have no coordinate (Severn, Bristol Avon, Dee, Mersey, Eden, Calder, Hull, Kennet, Stour, Tywi, Cleddau, Tolka + the six new). Harmless today; the day a river theme is derived from coordinates it is not.

## Not reached

Nothing in scope was left unchecked. Not attempted (out of scope or needs the network): the exact English Wikipedia titles for the C1/C2 fixes and the Peruća question; the gameplay side (eligible counts, `rarestFor` round-trips, the next 30 dailies).
