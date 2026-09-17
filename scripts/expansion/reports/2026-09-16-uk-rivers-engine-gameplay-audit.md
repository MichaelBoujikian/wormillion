# Gameplay audit of UK + Ireland rivers wave and the 2026-09-16 engine changes — 2026-09-16

progress: 57/57 wave rows checked; all six checks done (1: hand battery 1,573 + plural scan 11,224 + cross battery 96,496 + "Mt X" 526 + foreign-word names; 2: 904 prompts enumerated; 3: synthetic size-0 bank; 4: 35 dailies × 3 builds; 5: 57 rivers × 10 spellings × 3 prompts + 42,608 typos of existing rivers; 6: both themes member-by-member). Re-checked against repo HEAD 83c9952 at the end (the lead committed a matcher change mid-audit): every confirmed finding stands; that commit fixes "Bay City" → Daly City but adds one loss, noted under C3.

Scope: commits cf4f25b (57 UK/Ireland rivers + river-lee/river-avoca re-points), 612aad1 (three lakes dropped, Coatepeque/Lagarfljót re-pointed), engine changes 7d00d78 (size 0 = "no sourced figure"), 2bad597 (MAX_ELIGIBLE_SHARE 0.6 -> 0.7), 63d894f (matching.js WORD_CATEGORY), 8e8cebe (lake theme "North America"), bffe9c6 (mountain theme "the Rockies").
Evidence standard: every claim comes from running the real engine (daily.loadBank -> promptBank.createBank -> run.createRun/submit/rarestFor) offline; the old engine is git show 81b0b00 of matching.js/promptBank.js/run.js in a scratch folder, run over the current bank. No network was used.
Scripts used (beside this report): `harness.js` (loader for any engine × bank pair, forced-slot runs, `judgeFor`), `rows.js` (chunk ↔ rivers.json join), `battery.js` (the 1,573-row hand battery), `check1.js` → `check1-out.txt`/`check1-rows.json`, `check1b.js` → `check1b-out.txt` (plural scan, foreign-word names, "Mt X"), `check1c.js` → `check1c-out.txt` (cross battery), `check1d.js` → `check1d-out.txt` (the two plural-guard fixes; patched engines in `fixA/`, `fixB/`, tests run in `fixB-test/`), `check2.js` → `check2-out.txt`/`check2-rows.json`, `check2b.js` (lake prompts old vs new bank), `check3.js`, `check4.js` → `check4-out.txt`/`check4-dailies.md`, `check4b.js` → `check4b-out.txt` (live `main` vs expansion), `check5.js`/`check5b.js`/`check5c.js`, `check6.js`–`check6d.js`, `check7.js` (HEAD re-check). Engines: `old/` = 81b0b00, `new/` = the tree at 3a5b675, `head/` = 83c9952, `main/` = branch main (live); banks `old/` = 81b0b00, `new/` = current.

## Summary

| check | confirmed problems | judgment calls |
|---|---|---|
| (1) matcher battery old vs new | **C1** (high): the plural guard redirects a typed "Xs" onto the next-nearest OTHER place — 451 entry names (341 corrected to the right place before): "Irelands"→Iceland, "South Koreas"→North Korea, "Great Salt Lakes"→Great Salt Plains Lake; **C2**: "Salt Lake" on a capital/city round was Salt Lake City, now unrecognized; **C3**: "Mt Vernon", "Mt Isa", "Mt Pleasant", "Mt Prospect", "Mt Hagen" on a city round were accepted, now unrecognized ("Mt Prospect" → "Prospect Mountain is a mountain"); **C4**: "Solomon Island"/"Marshall Island" on a country round were accepted, now "Solomon Islands is an island — this round wants a country"; **C5**: six entries whose own name carries another category's word, typed without their own word, were accepted and are now refused or mis-nudged ("Smith Mountain", "Center Hill", "Barren River", "Sea Lion" → "Gulf of Lion is a sea", "Snow Hill" → "Xueshan is a mountain", "Thousand Lake" → "Thousand Oaks is a city"). Cross battery confirms the lead's number: 1,101 wrong-place acceptances became right nudges, 0 new wrong nudges, 0 new wrong acceptances on full names. Hand battery of 1,573 (round, input) pairs: 88 changed between engines — 61 acceptances became nudges (the "Lake Michigan" on a river round class, right; C4/J4/J5 are the exceptions), 10 corrections gained ("Colombia River"→Columbia River, "Kongo River"→Congo River, "Rio Nero"→Negro River, "Long Peak"→Longs Peak, "Isle Royal"/"Royal Island"→Isle Royale, "Mohave Desert", "Chihuahua Desert"→Chihuahuan Desert, "Falls River"→Fall River, "Lake Geneve"→Lake Geneva), 2 corrections went wrong ("Great Salt Lakes" = C1; "Bare River"→Baro, an odd input), 15 refusals/nudges swapped ("Tar Desert", "Victoria Desert", "Island Pek", "Great Lakes" on an island round: wrong nudge → refusal, fine) | J3: "Mexico City"/"Panama City"/"Gulf of Mexico"/"Lake Chad" on a country round are nudges now — right; J4: "Madagascar Island" → "Madagascar is an island — this round wants a country" and "Singapore City" → "Singapore is a capital city — this round wants a country" (twins) read wrong; J5: "Lake Havasu" on a city round is now the lake's nudge; J6 pre-existing: "Mt Blanc"/"Blanc" → Blanca Peak, "Mt Fugi" refused, "Bay City" → Daly City, "Mount Desert" → "Mount Desor is a mountain" |
| (2) MAX_ELIGIBLE_SHARE 0.7 | **0** — 14 generated rules are newly drawable (the lead's 8 minus city flag blue+white, which sits at exactly 60.0% and was already drawable, plus six letter rules the log does not mention: country "with an I" 62.4%, lake "with an A" 66.1%, river "with an A" 66.1%, mountain "with an A" 67.5%, sea "with an E" 66.4% / "O" 61.8% / "S" 64.1%); every one has 88–2,149 eligible answers and its ★ round-trips; nothing is newly under `MIN_ELIGIBLE` (the only prompts under 6 are letter/flag rules the draw already skips, plus the two deliberately tight themes Mesopotamia = 2 and the Great Lakes = 5); the three lake drops + two re-points change no lake prompt's drawability; all 904 enumerable prompts round-trip | J7: "Name a river with an A in it" now asks for one of 2,149 rivers (66%) — the letter-A rules are the weakest prompts the game can draw, and the 0.7 bar admits them for lakes, rivers and mountains |
| (3) size 0 | **0** — the real bank has no size 0 and no non-numeric size (12,062 rows validate); on a synthetic bank with the rarest, the most-viewed and a median entry of every category zeroed (27 rows): none appears in any of the 60 size-prompt lookups, none is ★ for any, 5,320 size prompts drawn from 45,000 sampled slots contain none, all 27 are accepted on the plain prompt and get `wrong-scope` ("doesn't fit this one") on every size prompt; `satisfiesSize` was already `!(size > 0) → false` at 81b0b00, so the engine did not change, only the validator (`>= 0`) and tooling did | — |
| (4) next 30 dailies | **0** — every prompt of 2026-09-12 … 2026-10-16 (35 days, 525 prompts) round-trips through `submit` on the real daily run, no day repeats a prompt text; the engine change re-draws **9 days** on the current bank (dig #1 round 12 back to "Name a lake smaller than 100 km²" as intended; 09-17 round 3, 09-25 round 10, 10-04 round 11 flip "sea or ocean larger than 100,000 km²" → "smaller than"; 10-02 round 10 desert likewise; 09-14, 09-19, 09-26, 10-09 cascade 6–11 rounds after an earlier slot takes a newly drawable rule) and the North America lake theme moves 3 more (09-20, 09-23, 09-24 lake rounds); against the **live build (branch main)** 12 of the 35 days differ, dig #1 now matches it again, dig #4 (2026-09-15, open until 09-18 00:00 UTC) differs in 4 rounds, and tomorrow's dig #6 (2026-09-17, already open for UTC+ players) differs in round 3 | J8: publish timing — dig #6's round-3 flip means a live-build submission for 2026-09-17 will not replay on the expansion server; no publish moment avoids every differing open day, publishing sooner costs least |
| (5) 57 new rivers | **0** — 534/534 real spellings (name, alias, "River X", "X River", stripped wikiTitle) accepted on the right entry on plain / Europe / British Isles rounds, none corrected; all 57 in both themes (Europe 950→1,007, British Isles 133→190); every river prompt (3 themes, 8 size, 72 letter) round-trips; letter rules behave (Ettrick Water starts E, ends R and K via alias; Kells Blackwater starts K ends R); every name on a lake/mountain/city/country round is the river nudge except Douglas/Cary/Lee which are real lakes/mountains/cities | J1: the wave puts 29 one-edit typos of existing rivers into refused ties ("Thams"/"Thamse" for Thames 32k views, "Meise" for Meuse, "Tamer" for Tamar, "Tamen" for Tumen…); J2: "River Ballisodare" (16 letters as typed) is wrong-scope on the long-name prompt, pre-existing rule |
| (6) lake NA / Rockies themes | **C6**: four North American lakes are refused by "Name a lake in North America" (Lake Arrowhead 670 views, Lake Coatepeque 609, Twin Buttes Reservoir 152, Loch Leven (California) 91 — no coordinates in the titles cache when the theme was derived); **C7**: four Rockies peaks with a cached infobox naming a Rockies subrange are refused by "Name a mountain in the Rockies" (Spanish Peaks 883, Hahns Peak 244 Elkhead Mountains, Mount Sheridan 244 Red Mountains, Naomi Peak 122 Bear River Mountains). Otherwise clean: North America 527 members, all 527 have coordinates and all fall in the box (30 spot-checked by description: Superior … Imperial Reservoir); the Rockies 49 → 186, 0 removed, 179 with coordinates all in the band, 7 without (American Fork Twin Peaks, Sphinx Mountain…, all described as Utah/Montana/Colorado peaks), every famous Rockies peak in the bank is a member (Elbert, Longs, Pikes, Grand Teton, Robson, Assiniboine, Temple, Massive, Maroon Bells, Kings Peak, Timpanogos, Borah, Granite, Gannett…); the 163 untagged peaks in the band are Sierra Nevada, Cascades, Basin and Range, Colorado Plateau, Black Hills — right to leave out; both ★ round-trip (John Paul Hammerschmidt Lake 20 views; Mount Lefroy 122) | J9: Heart Mountain (1,522 views, no range field), Storm King Mountain (White River Plateau) and Roaring Mountain (Yellowstone Plateau) are arguable Rockies |

**Worst three:** C1 (a stray trailing s now scores a *different* place — "Irelands" is Iceland, "South Koreas" is North Korea; 451 names, a one-line fix with a measured alternative), C3+C2 ("Mt Vernon", "Mt Isa", "Mt Pleasant", "Salt Lake", "Mt Desert Island" — the commonest spellings of 56k–7k-view places are now shrugs; one normalize fold plus two aliases), C4/J4 ("Solomon Island", "Madagascar Island", "Singapore City" on a country round tell the player the country is not a country).

## Confirmed

### C1. The plural guard redirects a typed plural onto the next-nearest OTHER place (check 1b; `src/js/matching.js` `nearest`, commit 63d894f)

`if (key === candidate.key + 's' && !candidate.key.endsWith('s')) continue;` skips the singular namesake but lets every other candidate within the edit budget compete, so a stray trailing s — one of the commonest typos — is now corrected to a different place instead of to the name typed. Old engine vs new engine on the current bank, every entry name + "s" typed on its own round (11,224 typings; names whose plural is itself a known name/alias skipped):

| | old engine | new engine |
|---|---|---|
| accepted on the entry typed (corrected) | 10,883 | 1,800 |
| refused (unrecognized) | 268 | 8,692 |
| **accepted on a DIFFERENT entry** | 6 | **451** (170 rivers, 123 cities, 89 mountains, 32 islands, 20 lakes, 4 countries, 4 capitals, 4 seas, 5 deserts) |

341 of the 451 were corrected to the right place by the old engine. What the player sees (each is `accepted`, scored, and shown as a spelling correction):

| typed on its own round | old engine | new engine |
|---|---|---|
| Irelands / Icelands | Ireland / Iceland | **Iceland / Ireland** |
| South Koreas / North Koreas | South Korea / North Korea | **North Korea / South Korea** |
| Colombos, Columbias | Colombo, Columbia | Columbus |
| Kingstons / Kingstowns | Kingston / Kingstown | Kingstown / Kingston |
| Frankfurts, Brooklyns, Atlantas, Readings, Southamptons | Frankfurt, Brooklyn, Atlanta, Reading, Southampton | Frankfort, Brookline, Atlantic City, Redding, Northampton |
| Great Salt Lakes | Great Salt Lake | Great Salt Plains Lake |
| Monterreys / Montereys, Chiang Rais, Nannings, Madurais | Monterrey / Monterey, Chiang Rai, Nanning, Madurai | Monterey / Monterrey, Chiang Mai, Nanjing, Chennai |

(Full list: `check1b-out.txt`, 451 `NEW WRONG` lines.) The decision-6 cases still hold — "Great Lakes" and "Bear Lakes" are refused — but the guard has to *refuse*, not *skip*. Fix (rule, one line): remember the skipped singular and return null after the loop (`let plural = null; … if (key === candidate.key + 's' && !candidate.key.endsWith('s')) { plural = candidate; continue; } … if (plural) return null;`) — a typed plural of a known name is a refusal, never a correction elsewhere. That gives 0 wrong-place plurals; it keeps "Irelands" a refusal (decision 6's price). A narrower guard — apply it only when the singular ends in a generic word (`candidate.filler` non-empty and the last word of `candidate.key` is filler), so "Great Lakes" is refused but "Irelands" still corrects to Ireland — is measured in C1a below.

**C1a. The two fixes, measured** (same 11,224 plurals, `check1d.js`; `fixA` = refuse whenever the singular is skipped, `fixB` = skip-and-refuse only when the singular's last word is a generic word):

| engine | corrected to the entry typed | refused | wrong place | other (mostly a cross-category nudge) |
|---|---|---|---|---|
| old (81b0b00) | 10,883 | 268 | 6 | 67 |
| new (63d894f) | 1,800 | 8,692 | **451** | 281 |
| fixA (refuse) | 536 | 10,314 | 6 | 368 — "Irelands" → "Redlands is a city", "South Koreas" → "South Jordan is a city": the refusal falls through to `run.js`'s cross-category fuzzy pass |
| **fixB (generic-word plurals only)** | **9,708** | 1,446 | 6 | 64 |

fixB keeps decision 6 exactly where it was aimed — "Great Lakes", "Bear Lakes", "Great Salt Lakes" refused; "Loch Nesss" still Loch Ness; "Falkland Island" still the Falklands — and gives "Irelands" → Ireland, "Brooklyns" → Brooklyn, "South Koreas" → South Korea back. Recommend fixB: `if (key === candidate.key + 's' && !candidate.key.endsWith('s') && FILLER.has(candidate.key.split(' ').pop())) { plural = candidate; continue; }` plus `if (plural) return null;` before the tie check (patched copy in `fixB/src/js/matching.js`). Under fixB `tests/matching.test.js` ("Great Lakes", "Bear Lakes" refused; "Loch Nesss", "Great Lkae" corrected) passes as written, but one assertion in `tests/run.test.js` (line 563, `on('lake', 'Lake Meads').status === 'unrecognized'`) fails: fixB corrects "Lake Meads" to Lake Mead, as the old engine did, because "mead" is not a generic word. That assertion encodes decision 6 at its broadest; fixB narrows it to what the decision's examples were about (a plural generic word), so the lead has to accept that one line changing. fixA keeps every test but sends "Irelands" to "Redlands is a city". Either is better than the shipped state, where "Irelands" scores Iceland.

### C2. "Salt Lake" on a capital or city round is now unrecognized (check 1; was Salt Lake City, 56,070 views)

`lake` is a lake word, so on a capital/city round it is foreign: the loose pass is skipped and the fuzzy pass compares "salt lake" to "salt lake city" whole (5 edits). Old engine: loose → "salt" → Salt Lake City, accepted. New: `unrecognized`, and the cross-category pass finds nothing ("Great Salt Lake" is not one edit away). Same on a lake round: the old nudge "Salt Lake City is a capital city" is now a shrug. Fix (data): alias `Salt Lake` on both rows — `scripts/data-cities.mjs` line 446 `Salt Lake City|United States|200000|SLC` → `…|SLC,Salt Lake`, and `scripts/data-us-states.mjs` line 59 `Salt Lake City|Utah|SLC` → `…|SLC,Salt Lake` — then build-data; the exact pass then hits before the word rule.

### C3. "Mt X" for the five cities named "Mount X" is now unrecognized (check 1b-C)

`mt` is a mountain word, so on a city round it is foreign, and "mt vernon" is three edits from "mount vernon" (the shared-word bonus needs the same word, and `mt` ≠ `mount`). Old engine: loose → "vernon" → Mount Vernon. The other 521 "Mount X" entries (mountains, where `mt` is the cohort's own word) still take "Mt X"; the five cities do not:

| typed on a city round (views) | old | new |
|---|---|---|
| Mt Vernon (12,541) | accepted: Mount Vernon | unrecognized |
| Mt Isa (6,392) | accepted | unrecognized |
| Mt Pleasant (5,875) | accepted | unrecognized |
| Mt Prospect (2,283) | accepted | "Prospect Mountain is a mountain — this round wants a non-capital city" |
| Mt Hagen (1,796) | accepted | unrecognized |
| **Mt Desert Island** on an island round (Mount Desert Island, 7,306) | corrected: Mount Desert Island (also at 63d894f) | **unrecognized at HEAD 83c9952** — all three words are generic, so the new "no name proper, no budget" rule leaves "mt" three edits from "mount" with a budget of one |

Fix (rule, preferred): fold `mt` to `mount` in `matching.normalize` (word-level, `.replace(/\bmt\b/g, 'mount')` after the punctuation strip), which also turns the pre-existing miss "Mt Fugi" (refused on both engines; "Mount Fugi" corrects) into a correction. Or (data) aliases `Mt Vernon`, `Mt Isa`, `Mt Pleasant`, `Mt Prospect`, `Mt Hagen` on the five city rows (`scripts/data-cities.mjs` lines 2869, 2574, 2760, 3159, 2591; `node scripts/expansion/add-alias.mjs "Mount Vernon" "Mt Vernon"` etc.) and `Mt Desert Island` on `Mount Desert Island` (`scripts/data-physical.mjs` line 7473).

### C4. "Solomon Island" / "Marshall Island" on a country round: was accepted, now "Solomon Islands is an island — this round wants a country" (check 1)

Country cohort: `island` is foreign → loose skipped → fuzzy (whole string) corrects "solomon island" to "solomon islands" at one edit — right. Then `run.submit`'s corrected-branch guard `elsewhere(rawInput, 'country', true)` runs the loose pass on the island cohort, where `island` is its own word, and finds the island entry Solomon Islands; a loose hit elsewhere outranks the correction here, so the player is told the place they named is "an island" while the country of the same name sits in the round's cohort. Old engine: country loose → "solomon" → accepted. Fix (data, smallest): aliases `Solomon Island` and `Marshall Island` in `scripts/data-countries.mjs` lines 197 and 203 (alias column: `Solomons,The Solomon Islands,Solomon Island`; `Marshalls,The Marshall Islands,Marshall Island`; no collision in the cohort). Fix (rule, covers J4 too): in the corrected branch, ignore an `elsewhere` hit whose normalized name equals the corrected candidate's name — a twin in another category is not evidence the player meant the other category.

### C5. Six entries whose own name carries another category's word are refused or mis-nudged when typed without their own generic word (check 1b-B)

The exact pass still takes the full name; the loose pass no longer strips the foreign word, so the natural short form fails:

| typed on its own round | entry (views) | old engine | new engine |
|---|---|---|---|
| Smith Mountain | Smith Mountain Lake (4,079), lake | accepted | unrecognized |
| Center Hill | Center Hill Lake (1,005), lake | accepted | unrecognized |
| Barren River | Barren River Lake (274), lake | accepted | unrecognized |
| Sea Lion | Sea Lion Island (304), island | accepted | "Gulf of Lion is a sea — this round wants an island" |
| Snow Hill | Snow Hill Island (791), island | accepted | "Xueshan is a mountain — this round wants an island" |
| Thousand Lake | Thousand Lake Mountain (122), mountain | accepted | "Thousand Oaks is a city — this round wants a mountain" |

"Wind River" for Wind River Peak now nudges to the Wind River (right), "Great Salt Lake" for Great Salt Lake Desert to the lake (right), "Lake Havasu" for Lake Havasu City to the lake (J5). Fix (data): aliases via `scripts/expansion/add-alias.mjs` on the `scripts/data-physical.mjs` rows — `Smith Mountain` (line 808), `Center Hill` (916), `Barren River` (1058), `Sea Lion` (6913), `Snow Hill` (7187), `Thousand Lake` (6338); while there, `Mount Desert` on Mount Desert Island (7,306 views), which both engines send to "Mount Desor is a mountain" (HEAD 83c9952 makes it a plain refusal).

### C6. Four North American lakes are refused by "Name a lake in North America" (check 6c)

The theme was derived from `scripts/.cache/titles.json` coordinates; four lakes had none there and were left out, and a re-point moved one in afterwards:

| entry (views) | where | why it is missing | what the player sees |
|---|---|---|---|
| Lake Arrowhead (670), `lake-lake-arrowhead`, wikiTitle `Lake Arrowhead Reservoir` | California, 34.26,−117.18 (lakes.json) | no titles-cache row for that title | "Lake Arrowhead isn't in North America — try another." |
| Lake Coatepeque (609), `lake-lake-coatepeque` | El Salvador, 13.87,−89.55 | re-pointed to `Coatepeque Caldera` in 612aad1, after the theme was derived from the old (coordinate-less) article | same |
| Twin Buttes Reservoir (152) | San Angelo, Texas | no coordinates anywhere | same |
| Loch Leven (91), wikiTitle `Loch Leven (California)` | California | no coordinates anywhere | same |

Fix: add the four names to `lake: 'North America'` in `src/data/themes.js` (line 478). The other ten coordinate-less lakes (Dead Sea, Chew Valley Lake, Lagarfljót, Grundlsee, Yamdrok…) are not North American. Every one of the 527 members has coordinates inside the box (lat > 7.2, −170 ≤ lon < −50); no member is outside.

### C7. Four Rockies peaks whose own infobox names a Rockies subrange are refused by "Name a mountain in the Rockies" (check 6b/6d)

`range-tag.mjs`'s table does not match their range string, or the infobox has the range elsewhere:

| entry (views) | infobox `range` (work/wikitext-cache.json) | what the player sees |
|---|---|---|
| Spanish Peaks (883), Huerfano County, Colorado | no `range` field (the table lists "Spanish Peaks" as a subrange, but this is the peaks' own article) | "Spanish Peaks isn't in the Rockies — try another." |
| Hahns Peak (244) | `[[Elkhead Mountains]]` (Colorado, Park Range foothills) | same |
| Mount Sheridan (244) | `Red Mountains` (Yellowstone) | same |
| Naomi Peak (122) | `[[Bear River Mountains]]` (the table has "Bear River Range") | same |

Fix: add the four to `mountain: 'the Rockies'` in `src/data/themes.js` (line 818), and `Elkhead Mountains|Red Mountains|Bear River Mountains` to the `the Rockies` regex in `scripts/expansion/range-tag.mjs` for the next pass. Everything else untagged in the band (163 peaks) reads Sierra Nevada / Cascade / Colorado Plateau / Basin and Range / Black Hills / Selkirk in its infobox — correctly out. The 137 peaks added in bffe9c6 all have Rockies coordinates (lat 31–66, lon −140…−102) or, for the 7 without coordinates, a Utah/Montana/Colorado description.

## Judgment calls

### J7. The 0.7 bar admits the letter-A rules (check 2)

The log names eight newly drawable rules, all size or flag; the enumeration (`check2-out.txt`) finds fourteen. The six it misses are letter rules: "Name a country with an I in it" (123/197 = 62.4%), "Name a lake with an A in it" (765/1,157 = 66.1%), "Name a river with an A in it" (2,149/3,249 = 66.1%), "Name a mountain with an A in it" (1,340/1,984 = 67.5%), "Name a sea or ocean with an E in it" (66.4%), "…with an O in it" (61.8%), "…with an S in it" (64.1%). Each rules out a third of the cohort or less, and a player naming the first river that comes to mind has a two-in-three chance of being right — the prompt reads as a rule but barely is one. `drawLetterRule` picks `contains` twice as often as `starts`, so these will turn up. If that is not wanted, a per-kind cap (letter rules at 0.6, size and flag at 0.7) is a two-line change in `promptBank.js`; the size/flag rules the decision was about are unaffected. Still-retired at 0.7: population/size "under" rules at 72–99%, "with an A" for countries (86.8%), capitals (72.9%), cities (70.3%), islands (72.4%), deserts (77.7%), seas (91.1%), and the single-colour red/white flag rules.

### J8. Which dailies the session moved, and when to publish (check 4/4b)

Prompt texts per day are in `check4-dailies.md` (new engine, current bank, with ★ and eligible counts); `check4-out.txt` lists every round that differs old engine → new engine, `check4b-out.txt` every round that differs live (main) → expansion. Round-by-round, the engine's re-draws are all one mechanism: `drawSizeRule`/`drawFlagRule`/`drawLetterRule` accept a rule at 60–70% that they used to reject, so that slot's text changes and, because the rng is shared, every later modifier draw in the day shifts too (09-14: 8 rounds; 09-19: 11; 09-26: 6; 10-09: 9). Days that differ from the live build and are still, or about to be, open: **2026-09-15** (dig #4, rounds 9–12; closes 09-18 00:00 UTC — the HANDOFF already expected this) and **2026-09-17** (dig #6, round 3: live "Name a sea or ocean larger than 100,000 km²", expansion "…smaller than 100,000 km²"; open since 09-16 00:00 UTC). A submission made on the live build for dig #6 carries answers to the old round 3; the expansion server replays them against the new one and rejects (or 409 draw-mismatch when the client sends `draw`). A day is open from the UTC day before it to two UTC days after (`OPEN_BEFORE`/`OPEN_AFTER`), so dig #6 stays open until 2026-09-20 00:00 UTC, by which time dig #8 (2026-09-19, 11 rounds differ) has been open for two days: there is no publish moment with no differing day open. The least-cost moment is now-ish, while the differing open days are dig #4 (already conceded) and a dig #6 that only the time zones already on 2026-09-17 have reached (at the time of writing, ~02:00 UTC, everything east of the Americas); 2026-09-16 and 2026-09-18 are identical on both builds, so the days most players are on at publish time do not split. Nothing here is a bug; it is the cost of the 0.7 bar the user chose, and it is why the daily's `draw` fingerprint exists.

### J9. Arguable Rockies peaks (check 6d)

Heart Mountain (Wyoming, 1,522 views; infobox has no range field; a klippe at the edge of the Absarokas), Storm King Mountain (Colorado, 213; range "White River Plateau") and Roaring Mountain (Yellowstone, 152; "Yellowstone Plateau") sit inside the Rockies geographically and are refused by the theme. Add them or not; the four in C7 are the ones whose own infobox names a Rockies subrange.

### J3. "Mexico City" on a country round is now a nudge — right

Old engine: "Mexico City", "Panama City", "Kuwait City", "Guatemala City", "Luxembourg City", "Belize City", "Djibouti City", "San Marino City", "Gulf of Mexico", "Lake Chad", "Lake Malawi", "Niger River", "Congo River" (→ Republic of the Congo), "Jordan River", "Sea of Japan", "Mount Kenya", "Mount Cameroon" typed on a country round were scored as the country. New: "Mexico City is a capital city — this round wants a country." The player named a city (or a gulf, a lake, a river, a mountain) and is told so, for free; typing the country is one word shorter. Right, and the cross battery says the same for all 1,101 such names. "Guatamala City" and "Luxemburg City" (misspelt) also nudge to the capital now instead of correcting to the country — consistent.

### J4. Twins: "Madagascar Island" and "Singapore City" on a country round read wrong

"Madagascar Island" → "Madagascar is an island — this round wants a country" (the island entry is named Madagascar; the country Madagascar is in the round); "Singapore City" → "Singapore is a capital city — this round wants a country". Old engine accepted the country both times. The player who typed these meant the country; the hint denies it. Same mechanism as C4 (a twin in another category), and the C4 rule fix covers these: when the `elsewhere` entry's full normalized name is itself a name in the round's cohort, accept that entry instead of nudging. 2 countries + the 2 in C4; "Sea of Japan", "Lake Victoria", "Mexico City" are not twins and keep their nudges.

### J5. "Lake Havasu" on a city round is now the lake's nudge

Lake Havasu City (7,640 views) was accepted for "Lake Havasu"; now "Lake Havasu is a lake — this round wants a non-capital city". The lake is real and is what was typed; the city is what was meant. An alias `Lake Havasu` on the city row (`scripts/data-cities.mjs` line 2919) would take it back (no collision in the city cohort; the lake round still gets the lake by its exact name). Your call.

### J6. Pre-existing, same on both engines (not this session's, noted in passing)

"Mt Blanc" and "Blanc" on a mountain round correct to **Blanca Peak** (Colorado) — Mont Blanc's bare form is "mont blanc" (mont is not filler) so "blanc" is one edit from "blanca"; alias `Mount Blanc`/`Mt Blanc` on the Mont Blanc row (`scripts/data-physical.mjs` line 4458) fixes it (the C3 `mt`→`mount` fold would make "Mt Blanc" → "Mount Blanc" → corrected to Mont Blanc). "Bay City" on a city round corrected to Daly City (both words filler, so the whole 8-letter string got two edits) — fixed by the lead's 83c9952 mid-audit ("Bay City" is now refused), which also turns "Mount Desert" on an island round from the wrong Mount Desor nudge into a plain refusal, and costs "Mt Desert Island" (C3). "Cape Town" on a capital round is accepted as Pretoria (an alias; presumably intended).

### J1. The wave's short names turn 29 one-edit typos of existing rivers into refused ties (check 5b)

`nearest` refuses a tie ("two different places equally close is not a typo"), by design. Eight of the 57 new names sit one edit from a better-known river, and every typo that is equidistant from both is now refused where the old bank corrected it to the famous one. Measured over 42,608 single-edit typos of the 1,334 existing rivers with 300+ views (new engine, old bank vs new bank): 29 typings went from "corrected to the right river" to refused, 0 to a wrong river; 6 went from refused to accepted on the new river that is exactly what was typed (Tame, Taf, Ise, Isla, Brue). Nothing was accepted on a wrong place either way. The refusal is a free retry, so the cost is a retype, but the famous end of the list matters:

| typed | was (old bank) | now (new bank) | the new row that ties |
|---|---|---|---|
| **Thams**, **Thamse** | corrected → Thames (32,479 views) | unrecognized | Thame |
| Thame | corrected → Thames | accepted: Thame | (the intended fix) |
| Meise | corrected → Meuse (8,493) | unrecognized | Teise |
| Tamen | corrected → Tumen (3,653) | unrecognized | Tame |
| Tamer | corrected → Tamar (2,344) | unrecognized | Tame |
| Calde | corrected → Calder (1,157) | unrecognized | Alde |
| Chare | corrected → Chari (1,157) | unrecognized | Clare |
| BBosna, Boosna | corrected → Bosna (1,065) | unrecognized | Brosna |
| Feyle | corrected → Foyle (974) | unrecognized | Feale |
| rwell, arwell, erwell, urwell | corrected → Orwell (944) | unrecognized | Irwell |
| Vrede | corrected → Verde (944) | unrecognized | Rede |
| Teife | corrected → Teifi (548) | "Mount Teide is a mountain" | Teise |
| Teite | corrected → Tiete (578) | "Tete is a city" | Teith |
| aNver | corrected → Naver (487) | "Antwerp is a city" | Anker |
| Brede, Briede, Breide | corrected → Breede (457) | "Breda is a city" / unrecognized | Rede, Bride |
| LLadon, Laadon | corrected → Ladon (396) | unrecognized | Leadon |
| Burle, Brile, Bruel | corrected → Brule (365) | unrecognized | Brue |
| Lyare | corrected → Lyari (304) | unrecognized | Yare |

Not a bug: the engine is doing what SPEC 3.7 says, and the alternative (correcting to the more famous of a tie) is the wrong-place acceptance the wave set out to remove. Worth knowing that "Thams" on a British Isles round is now a shrug; a `views`-weighted tie-break would be a rule change, not a data fix. The four "X is a city/mountain" nudges (Teife, Teite, aNver, Brede) are the misleading end: a refused in-category tie falls through to the cross-category fuzzy pass, which then corrects the typo onto another category's place.

### J2. "River Ballisodare" on the long-name prompt is wrong-scope (pre-existing rule, not this wave)

Ballisodare is 11 letters; "River Ballisodare" as typed is 16, but the entry has no "River Ballisodare" alias, so it is not in the long-name lookup at all (`spellingsOf` only sees the name and aliases) and `judgeTyped` never runs. The player sees "Ballisodare doesn't fit this one". Same for every 8–11-letter river in the bank without a "River X" alias (Evenlode, Wansbeck, Annalee, Owenmore, Funshion…); SPEC 3.1a says the entry must have a qualifying spelling first, so this is by the book. Low priority.

## Not reached

Nothing. All six checks ran to completion; the HEAD re-check (`check7.js`) ran the full hand battery against 83c9952 (5 rows changed, listed under C3/J6).
