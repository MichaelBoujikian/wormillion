# Pre-merge whole-bank gameplay regression audit - 2026-09-17

Live stack: main `ffeceaa` engine + bank (9,300 places; what GitHub Pages and Netlify serve). Candidate: `expansion` HEAD `b226c20` engine + bank (14,914). Every outcome below is the real engine (`promptBank.createBank` -> `run.createRun` / `submit` / `rarestFor`; banks loaded exactly as `netlify/functions/lib/daily.js` `loadBank` does), each stack with its own engine, so a difference is what a player experiences before vs after the merge. No network. Scripts beside this report: `pm-harness.js` (loader, forced-slot judge, the `ui.js` feedback wording), `pm-smoke.js` -> `pm-smoke-out.txt` (counts, Auckland), and the `pm-check*.js` files named per section.

progress: all five sections done (4: 47 dailies x 15 = 705 rounds on both stacks, every star replayed; 5: parse / createBank / rarestFor / submit / daily.js loadBank + a valid 15-answer replay, both stacks, plus the live hosts' cache headers). Complete.

## Progress

- [x] 0. Read HANDOFF, SPEC 3.1a/3.2/3.7/3.8/3.16/3.17/4/6.4/13, AUDIT-BRIEF, the four 2026-09-17 audit reports
- [x] 1. Auckland on "Name a capital city in Oceania" - what the UI shows
- [x] 2. Famous-places battery (top-300 per cohort + capitals + countries + hand list), live vs next
- [x] 3. Wrong-kind class (cities on capital rounds, capitals on city rounds, rivers on lake, lakes on sea, islands on country, mountains on island)
- [x] 4. Daily: next 45 days, both stacks, prompt diffs, rarestFor round-trip, eligibility/share bars, merge time
- [x] 5. Performance: createBank, parse, gzip, rarestFor, daily.js loadBank + replay, loader cache-busting

## Summary

| section | confirmed problems | judgment calls |
|---|---|---|
| 1 Auckland | none - the engine and UI behave as designed (see J1) | J1 |
| 2 famous places | **0 scoring regressions**; C1 (low, engine): the cross-category nudge takes a fuzzy hit from an earlier cohort over a loose hit from a later one ("Cornwallis" -> "Corvallis is a non-capital city", was "Cornwallis Island is an island") | J2 (twin nudges: "Bronx is a river", "St Helens is a non-capital city"), J3 ("Great Lakes" is "Not recognized" everywhere, by decision 6), J4 (the 1,004 changed outcomes are the SPEC 3.7 v1.3 rules working) |
| 3 wrong kind | **0 wrong-kind answers scored on next** (live scored 8: "Red Sea" / "Black Sea" on a lake round were Red Lake / Black Lake, "Mount Hood" / "Mount Baker" on an island round were Espanola / Baker Island, "Red River" on a lake round was Red Lake - all nudges now); the nudge names the right kind for every top-100 city / capital / river / lake / island / mountain / sea / desert; island nations accepted on both country and island rounds; Etna / Fuji / Teide / Vesuvius / Krakatoa on an island round nudge to the mountain; C1 measured: 795 fuzzy-over-loose nudges on live -> 1,898 on next (114 -> 283 bare forms; pre-existing, grows with the bank) | J5 (bare river names score the lake of that name: Murray, Tisza, Cumberland, Allegheny - the J10 class), J6 (Cape Town / Tel Aviv on a capital round score Pretoria / Jerusalem by alias, both stacks) |
| 4 dailies | **today (#6) and tomorrow (#7) draw identical prompt text on both stacks**; 11 of the 47 days 2026-09-16..11-01 differ (first: #8 2026-09-19 from round 4); 705 rounds, 0 star round-trip failures, 0 repeated texts, 0 prompts outside the bars; **C2 (medium, release order)**: if Pages goes live on the new bank before Netlify is re-deployed, the comparison block silently disappears for Pages players (draw-mismatch on the 11 differing days; 400 on any Europe/US-wave answer every day) | J7 (354 of 705 stars are under 100 views - 317 on live; the cohort floors are 7-91 views by design), J8 (6 size-0 stars: Adventfjorden, Altafjord, Coconut Island at 244 views), J9 (today's stars change under identical text: Pihlajavesi -> Storvindeln Lake…) |
| 5 performance | nothing doubled that a phone would feel: bank.js 1.26 -> 1.97 MB raw, **181 -> 277 KB gzip on Pages, 143 -> 219 KB brotli on Netlify**; parse 5.5 -> 7.8 ms, createBank 63 -> 115 ms, heap 8.4 -> 12.5 MB, rarestFor x15 0.7 -> 0.9 ms, a fuzzy submit 2.5 -> 4.9 ms, function loadBank 93 -> 161 ms (cold-start cost), replay of 15 answers 0.9 -> 1.3 ms; **C3 (low)**: `index.html` loads `data/bank.js` and the engine scripts with no version query and Pages sends `Cache-Control: max-age=600`, so for up to 10 minutes after the deploy a returning browser can pair a cached old `bank.js` with the new engine (or the reverse) | |

## Section 1 - Auckland on "Name a capital city in Oceania."

Through `submit` on the forced slot `{category:'capital', region:'Oceania'}` (14 eligible capitals on both stacks), `pm-smoke-out.txt`:

| typed | live ffeceaa | next HEAD | what the player reads (`ui.js` `handleSubmit`, `elsewhere` branch) |
|---|---|---|---|
| Auckland / auckland / Auckland City | `unrecognized` + `elsewhere: city-auckland` | same | **"Auckland is a non-capital city — this round wants a capital city."** (class `warn`); input cleared, focus kept, no points, the round does not advance - a free retry (SPEC 3.4) |
| Wellington | accepted 45% / +356 | same | "Wellington · 37,806 views/mo · 45% obscure · +356 · dug 31.2" |
| Sydney, Melbourne, Christchurch | the same nudge as Auckland | same | "Sydney is a non-capital city — this round wants a capital city." |
| Honolulu | wrong-scope (a US state capital, region North America) | same | "Honolulu isn't in Oceania — try another." |
| Tarawa / Koror | `elsewhere: island` | same | "Tarawa is an island — this round wants a capital city." (South Tarawa / Ngerulmud are the capitals and land) |
| Papeete, Noumea, Hagatna, Pago Pago, Melekeok | `unrecognized` | same | "Not recognized — try another." (territorial capitals; not in the bank on either stack - J1) |

So Auckland is not "not recognized": the game recognises it as a real non-capital city and says so by name, in the sentence the SPEC 3.4 v1.2 nudge prescribes, and it is the identical text on the live site. Wellington is New Zealand's capital and is accepted. Nothing to fix for the merge; whether the wording could add "(Wellington is)" is a wording choice, not a defect.


## Section 2 - the famous-places battery (`pm-check2.js`, `pm-check2b.js`, `pm-check2c.js`)

**2a, the bank's own famous entries.** For every cohort the 300 most-viewed entries of the new bank (every country and capital, all 137 deserts), each typed as its name and every alias, on the plain round and on every region / theme / ocean / flag / size / starts-with round its data says it satisfies: **23,267 typings on next, 21,859 of them also on live** (the same entry, the same slot). Result: **every one lands on its own entry, uncorrected, on both stacks; 0 got worse** (`pm-check2-out.txt`). The famous end of the bank is untouched by the merge.

**2b, the hand list.** 1,338 inputs (the task's list plus ~1,000 more: world cities, rivers, lakes, seas, deserts, mountains, islands, native names, initialisms, classic misspellings - Reykjavic, Phillipines, Katmandu, Kiev, Bombay, Peking, Fujiyama, Ulan Bator, Saragossa, Marrakesh...) typed on all nine plain rounds and then on the narrowed rounds of whatever entry accepted them: **21,999 typings**. 1,004 outcomes differ between live and next; the strict filter (`pm-check2c.js`: a legitimate acceptance lost or degraded, an acceptance moving to a different entry, plain -> corrected, nudge -> unrecognized, a nudge moving to a fuzzy or far-less-viewed place) leaves **39 rows over 7 inputs, none of them a scoring change**:

| input | live | next | verdict |
|---|---|---|---|
| Cornwallis (x7 wrong rounds) | "Cornwallis Island is an island — this round wants a country." | "**Corvallis** is a non-capital city — this round wants a country." | **C1** - a wrong nudge: Corvallis (Oregon, a US-wave row, 2 edits away) is found by the fuzzy pass in the city cohort before the loose pass reaches Cornwallis Island in the island cohort; on the island round "Cornwallis" is still accepted (Cornwallis Island, 670 views) |
| Bronx (x7) | "The Bronx is a non-capital city — …" | "Bronx is a river — …" | J2 - the US-wave river "Bronx" (1,826 views) is an exact name and beats the borough's loose form (49,221); on the city round "Bronx" is still The Bronx |
| St Helens (x7) | "Mount St Helens is a mountain — …" | "St Helens is a non-capital city — …" | J2 - the Merseyside town (7,093 views, a Europe-wave row) is the exact name; on the mountain round "St Helens" is still Mount St Helens (81,275) |
| Great Lakes (x9, incl. the lake round) | corrected to Great Lake (Tasmania, 365 views) on the lake round; "Great Lake is a lake" elsewhere | "Not recognized — try another." | J3 - decision 6 (a typed plural of a generic-word name is refused, never corrected); the live outcome scored the wrong lake |
| Great Salt Lake (desert round) | accepted: Great Salt Lake Desert | "Great Salt Lake is a lake — this round wants a desert." | by design (SPEC 3.7 category words); the player named the lake |
| Mount Lebanon (x9) | "Lebanon is a country — …" (and accepted as Lebanon on the country round) | "Not recognized" | neutral: the range is not in the bank; live's acceptance of the country for "Mount Lebanon" was the wrong-place class the v1.3 rule removes |
| Mainland (sea round) | "Finland is a country — …" (a fuzzy nudge) | "Not recognized" | better; the Orkney/Shetland Mainlands are not rows on either stack |

Everything else in the 1,004 is the engine changes on `expansion` doing what SPEC 3.7 (v1.3, 2026-09-16/17) says: 108 wrong-place acceptances became nudges ("Gulf of Mexico" on a country round was Mexico for 437 points, "Congo River" was the Republic of the Congo for 950, "Lake Malawi" was Malawi, "Mount Kenya" was Kenya, "Columbia River" was the capital Columbia, "Sea of Japan" was Japan, "Red Sea" on a lake round was Red Lake…), the twin nudge now names the most-viewed exact twin ("Fuji" is Mount Fuji, not the Norwegian river; "Madeira" the island, not the river; "Como" the lake; "Erie" / "Ontario" the lakes; "Cape Town" itself, not Pretoria; "La Paz" itself, not Sucre), and the J10/J13 class the islands audit recorded (Iceland / Jamaica / New York / Holland on a sea or island round now score Iceland Sea / Jamaica Bay / New York Bay / Holland Island). Inputs unrecognized on every round on both stacks (not regressions; the alias pile): the Alps / Andes / Himalayas / Rockies / Pyrenees / Dolomites / Atlas / Drakensberg / Zagros (ranges are not rows), Ganga, Bermuda, England, Korea, Siam, Goa, Papeete, Machu Picchu, Petra, Pompeii, Chernobyl, Saragossa, Everglades, Yosemite, Sierra Nevada, Olympus Mons, Cervino, Tre Cime, Pribilof, Skellig, Blasket, Dalkey.

## Section 3 - the wrong-kind class (`pm-check3.js`, `pm-check3b.js`)

The 100 most-viewed entries of each source cohort typed on the plain round of the target cohort, both stacks (a name that is also a name in the target cohort - the 50 US state capitals in `city`, the island nations in `country`, Stromboli in both - is *meant* to be accepted there and is counted as right):

| typed on | live | next |
|---|---|---|
| top-100 cities on "Name a capital city." | 87 nudges "X is a non-capital city — this round wants a capital city.", 13 accepted (state capitals: Phoenix, Boston, Denver…) | identical |
| top-100 capitals on "Name a city that isn't a national capital." | 76 nudges "X is a capital city — …", 22 accepted (state capitals), Singapore / Vatican City nudge as "is a country" (the same article is the country row; a tie on views goes to the country) | identical |
| top-100 rivers on "Name a lake." | 96 nudges "X is a river — this round wants a lake."; **4 scored**: Red River -> Red Lake, Murray -> Lake Murray, Tisza -> Lake Tisza, Cumberland -> Lake Cumberland | 96 nudges; "Red River" is now the nudge; Murray / Tisza / Cumberland / Allegheny (-> Allegheny Reservoir, a US-wave row) are the bare-name class (J5) |
| top-100 lakes on "Name a sea or ocean." | 97 nudges, 3 accepted (Caspian Sea, Dead Sea, Aral Sea are rows in both cohorts) | identical |
| top-100 islands on "Name a country." | 63 nudges, 35 accepted (island nations); Madeira -> "Madeira is a river", Montserrat -> "Montserrat is a mountain" | 65 nudges - Madeira and Montserrat now nudge as the island (the most-viewed twin) |
| top-100 mountains on "Name an island." | 96 nudges; **2 scored**: Mount Hood -> Espanola Island (its alias "Hood Island"), Mount Baker -> Baker Island | 98 nudges, 0 scored |
| top-60 seas on "Name a lake." | 55 nudges; **2 scored**: Black Sea -> Black Lake, Red Sea -> Red Lake | 57 nudges, 0 scored |
| top-60 deserts on "Name a country." | 60 nudges | identical |
| top-60 cities on "Name a capital city in <their region>." and top-60 capitals on "Name a non-capital city in <their region>." | 120 typings, 0 scored | identical |

The named cases: Iceland, Madagascar, Sri Lanka, Cyprus, Malta, Jamaica, Cuba, Ireland, Japan, Taiwan are **accepted on both the country and the island round** on both stacks (Iceland 61% as a country, 6% as an island); Philippines / Indonesia / New Zealand / United Kingdom / Papua New Guinea / Haiti / Trinidad and Tobago / Bahrain / Singapore land on their island rows; Etna / Mount Etna / Fuji / Teide / Vesuvius / Krakatoa / Mauna Kea / Kilauea / Pinatubo on an island round give "X is a mountain — this round wants an island." (live said "Fuji is a river"); Stromboli is accepted on both (island and volcano rows); Santorini on a mountain round nudges to the island; Nile / Amazon on a lake round nudge to the river, Superior / Baikal / Great Salt Lake on a sea round to the lake; the Caspian, Dead and Aral Seas are accepted on both lake and sea rounds, the Sea of Galilee and Salton Sea on the lake round only (nudged on the sea round); Sahara / Gobi on a country round nudge to the desert; Hawaii / Greenland / Puerto Rico / Tahiti / Bali / Corsica / Sicily / Crete / Tasmania on a country round nudge to the island; Hong Kong / Macau to the city; Bermuda is unrecognized (no row on either stack); Paris / London / Washington / Wellington / Canberra / Mexico City / Kuwait City / Abu Dhabi on a city round nudge to the capital; New York / Istanbul / Rio / Lagos / Mumbai / Shanghai / Toronto / Dubai on a capital round nudge to the city. All identical live vs next except where next is better.

**C1 bank-wide** (`pm-check3b-out.txt`): every generic-word row whose bare form is nobody's exact name, typed bare on the eight other rounds - live 10,904 typings, **795** nudges name a fuzzy neighbour from an earlier cohort while the row's own cohort would have taken the bare form loosely (114 distinct bare forms, 26 of them rows with 5,000+ views: "Falkland" -> "Oakland is a non-capital city", "Faroe" -> "Faro is a non-capital city", "Cayman" -> "Dayman is a river", "Baltic" -> "Balti is a non-capital city", "Atlantic" -> "Atlanta is a capital city", "Salton" -> "Salto", "Powell" -> "Lowell", "Fundy" -> "Lundy is an island"); next 23,536 typings, **1,898** nudges over 283 forms (30 famous: the same plus "Christmas" -> "Christian is a river", "Southern" -> "Southend-on-Sea", "Heard" -> "Heart is a river", "Albans" -> "Albany", "Lassen" -> "Assen", "Canvey" -> "Caney"). Pre-existing, not a merge regression; it scales with the bank because every wave adds fuzzy neighbours in the early cohorts (city is third in `CATEGORIES`).

## Section 4 - the next 45 dailies (`pm-check4.js` -> `pm-check4-out.txt`, `pm-check4-dailies.md`; `pm-check4b.js`)

Days 2026-09-16 (dig #5, still open on the server: `OPEN_AFTER` 2) through 2026-11-01 (#51): 47 days x 15 = 705 rounds, generated with `createRun(bank, { mode: 'daily', dailyKey })` on each stack with its own engine.

**Which days change at the merge.** 36 of 47 days draw identical prompt text on both stacks. **Today (#6, 2026-09-17) and tomorrow (#7, 09-18) are identical, round for round** - and so is #5 (09-16), still open. The eleven that differ:

| day | dig | rounds whose text differs | why (the seeded rng diverges at the first rule that crosses a bar) |
|---|---|---|---|
| 2026-09-19 | #8 | 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15 | r4: sea "with an S in it" passes the letter bar on the new bank (54.5%, was 64.1%) where live re-drew it as "with a J in it"; everything after is re-drawn (the islands audit's finding, unchanged) |
| 2026-09-20 | #9 | 14 | one rule |
| 2026-09-23 | #12 | 9 | one rule |
| 2026-09-24 | #13 | 9 | one rule |
| 2026-10-02 | #21 | 10 | "larger than 1,000,000 km²" -> the desert size rule (the sea size rules now measured over sized rows) |
| 2026-10-09 | #28 | 3, 4, 5, 6, 7, 8, 9, 11, 14 | an early divergence, the rest re-drawn |
| 2026-10-20 | #39 | 13 | |
| 2026-10-21 | #40 | 15 | |
| 2026-10-28 | #47 | 4, 5, 7 | |
| 2026-10-30 | #49 | 7 | |
| 2026-11-01 | #51 | 11, 12, 13, 14, 15 | |

**Round-trips.** On the new bank every one of the 705 prompts has a star (`rarestFor`), and every star, submitted by name on a fresh run at that slot, is **accepted on its own entry at the same rarity: 0 failures**. No day repeats a prompt text. No drawn prompt is under `MIN_ELIGIBLE` (the two-member "Name a river in Mesopotamia." on #6 r6 is a curated theme, allowed at `MIN_THEME_MEMBERS` 2) and none is over a share bar as the engine now measures it (size over sized rows, letter 0.6, flag 0.7).

**Stars under 100 views: 354 of 705** on next, 317 of 705 on live (J7) - the cohort minimums are river 7 (Mecaya), island 14 (Karpa Island), lake 17 (Storvindeln Lake), mountain 30 (Diamond Head), desert 61 (Skeleton Coast), sea 61 (Gulf of Masirah / Manfredonia), city 91 (Bel Air South), so the plain and broad prompts always reveal a sub-100 star; this is the scoring design, not a wave defect, and the counts are alike on both stacks. **Stars with `size` 0: 6** (J8) - Adventfjorden (Svalbard, 244 views) on "Name a sea in the Arctic Ocean." (09-23 r12, 10-08 r9, 10-10 r6), Altafjord (244) on "ends in D" (10-12 r15), Coconut Island (244) on "Name an island in Hawaii." (10-08 r7, 10-27 r3). None of them is on a size prompt (a size-0 row never answers one), so each round-trips.

**What a Pages player sees mid-day at the moment of the merge.** Nothing in the prompt text: #6's fifteen prompts and #7's are the same on both banks, so the draw fingerprint is unchanged and no one mid-dig gets re-drawn prompts or a "The prompts have changed since this dig" review. What does change under the same text is the ★ on the review screen and the score of some answers (J9): #6 r4 "Name a city that isn't a national capital." ★ Musanze (122) -> Bel Air South (91); r7 "Name a lake." ★ Pihlajavesi (15) -> Storvindeln Lake (17) - Pihlajavesi was re-pointed to a 91-view article, so a player who answered it today scores 80% / 704 pts on the new bank instead of 100% / 1,000; r8 "Name a mountain." ★ Bear Mountain (30) -> Diamond Head (30); r11 "Name an island." ★ Grand Manan (21) -> Karpa Island (14); r12 "Name a lake that starts with L." ★ Lake Oubeira -> Lake Latt; #7 r2 / r3 / r5 likewise (Diamond Head, Karpa Island, Storvindeln Lake). Every other round of #5, #6 and #7 keeps its star.

**Recommended merge time.** Any moment before the first timezone reaches 2026-09-19 changes zero live days' prompts: that is **before 2026-09-18 10:00 UTC** (UTC+14 enters 09-19 then; 22:00 UTC for Central Europe, 2026-09-19 07:00 UTC for the US Pacific, where the user is). Merging later than that changes #8 for players who have not yet dug it (rounds 4-15) and, if Pages and Netlify are on different banks at that moment, breaks their comparison (C2). If the window is missed: the next stretch where every timezone is on an identical-text day is **2026-09-21 12:00 UTC to 2026-09-22 10:00 UTC** (#10 and #11 are identical; UTC-12 leaves 09-20 at 12:00 UTC, UTC+14 enters 09-23, which differs, at 10:00 UTC), then 09-25 12:00 UTC to 10-01 10:00 UTC (#14-#20 all identical). Whatever the moment, **push main and trigger the Netlify deploy together**, Netlify first if anything, so the server's bank never lags the Pages bank (C2).

On the user's two questions: a `git merge --no-ff expansion` (or a squash) lands on `main` as **one push** and therefore one Pages deploy; Netlify's auto-deploy is locked, so the Netlify build is the one manual "Trigger deploy" whatever the commit count - the 105 commits are not 105 builds. The release audit covers the mechanics; this section only fixes the timing.

## Section 5 - performance (`pm-check5.js` -> `pm-check5-out.txt`, `pm-check5b.js`; Node 24.19, this machine)

| measure | live ffeceaa | next HEAD | ratio |
|---|---|---|---|
| `bank.js` on disk | 1.261 MB | 1.972 MB | 1.56x |
| `bank.js` over the wire: gzip -6 (what GitHub Pages sends: `Content-Encoding: gzip`, 187,383 bytes today) | 181 KB | **277 KB** | 1.53x |
| `bank.js` brotli (what Netlify sends: `Content-Encoding: br`) | 143 KB | **219 KB** | 1.53x |
| `themes.js` (gzip) | 63 KB (23 KB) | 119 KB (43 KB) | 1.9x |
| `src/js` engine, raw | 179 KB | 192 KB | |
| parse + evaluate `bank.js` + `themes.js` as scripts (median of 7) | 5.5 ms | 7.8 ms | 1.4x |
| `createBank` (median of 7) | 63 ms | 115 ms | 1.8x |
| heap: raw data + `createBank` + one daily's 15 prompt lookups | 8.4 MB | 12.5 MB | 1.5x |
| `rarestFor` over the 15 prompts of a run (median of 7 days) | 0.7 ms | 0.9 ms | |
| `reviewRun` (the review screen) | 0.6 ms | 0.9 ms | |
| 15 submits, exact / loose / fuzzy / nudge mix | 4.7 ms total, worst 2.5 ms ("Kilimanjro") | 7.3 ms total, worst 4.9 ms | 2x on the fuzzy pass, still sub-frame |
| `drawSlots` | 3.1 ms | 4.2 ms | |
| `daily.js` `loadBank(root)` (the function's cold start, once per container) | 93 ms | 161 ms | 1.7x |
| `api.submit` = regenerate the day + replay 15 answers + aggregate (warm) | 0.9 ms | 1.3 ms | |
| `api.stats` | 0.7 ms | 0.7 ms | |

Nothing a phone would feel: the only user-visible cost is ~100 KB more compressed download on first load (Pages max-age is 600 s, so it is re-fetched every ten minutes at most, ETag-revalidated on Netlify) and ~50 ms more in `createBank` on a desktop, perhaps 150-300 ms on a mid-range phone, once per page load. The fuzzy pass doubled with the cohort sizes (4.9 ms for a misspelt mountain against 2,630 candidates) and is the one figure that will keep growing with the bank; it is still well under a frame. The Netlify function's cold start grows by ~70 ms (HANDOFF's verified 0.7 s cold start becomes ~0.8 s).

**The loader** (`src/index.html` 184-185: `<script src="data/bank.js">`, `<script src="data/themes.js">`, and the engine `<script src="js/...">` tags) carries no version query or hash, and `netlify.toml` sets no headers for `/data/*`. GitHub Pages answers `Cache-Control: max-age=600` for `bank.js` (checked live); Netlify answers `public, max-age=0, must-revalidate` with an ETag, so it is always fresh. So on Pages, for up to ten minutes after the deploy, a browser that already has `bank.js` (or one of the engine files) cached can run the new engine on the old bank or the old engine on the new bank (C3). Both combinations load and play (the old `satisfiesSize` already refuses a non-positive size; the new `createBank` needs nothing the old bank lacks), and the mismatch resolves itself on the next reload; the visible effect would be a daily draw that differs from the server's for that one session (draw-mismatch, the comparison block hidden). Low; a `?v=<bank date>` on the two data scripts, or a `[[headers]]` block, would close it, and is not needed for this merge.

## Confirmed findings

### C1. The cross-category nudge prefers a fuzzy hit in an earlier cohort to a loose hit in a later one (section 2b; `src/js/run.js` `elsewhere`, low)

`elsewhere()` runs two passes: exact names in every other cohort (best by views), then `{ fuzzy: true, bare: false }` over the cohorts in `CATEGORIES` order, returning the **first** hit whether it was loose or fuzzy. So a two-edit fuzzy neighbour in `city` (third in the order) wins over an exact loose form in `island` (eighth). Through `submit`:

| typed | round | live | next |
|---|---|---|---|
| Cornwallis | country (and capital, lake, river, mountain, desert, sea) | "Cornwallis Island is an island — this round wants a country." | "**Corvallis** is a non-capital city — this round wants a country." |
| Cornwallis | island | accepted: Cornwallis Island (670 views) | accepted: Cornwallis Island |

Corvallis (Oregon, 9,162 views) is a US-wave city; nothing is scored, the round continues, but the hint names a place the player did not type. The class is any bare form of a generic-word row that sits within the fuzzy budget of a name in an earlier cohort: **795 such nudges on live (114 bare forms), 1,898 on next (283 forms)** - section 3, `pm-check3b-out.txt`; "Falkland" on a country round has said "Oakland is a non-capital city" since before the wave. Pre-existing and growing, not a regression of the merge. Fix (engine, `run.js` `elsewhere`): in the second pass, keep the first *loose* hit over any *fuzzy* hit - e.g. run the loop once with `{ fuzzy: false }` (loose only, first hit) and only then with `{ fuzzy: true, bare: false }`; SPEC 3.7 already says an exact or loose hit anywhere beats a fuzzy correction. Not a merge blocker.


### C2. Pages and Netlify must switch banks together, or Pages players lose the comparison (section 4; release order, medium)

`git push` to `main` deploys Pages within minutes (`deploy.yml`); Netlify's auto-deploy is locked and needs the manual "Trigger deploy". In the gap the two hosts serve different banks, and the daily comparison is computed by the Netlify function from its own bank: (a) on the 11 of the next 47 days whose prompts differ (first: #8, 2026-09-19, rounds 4-15), the Pages client's draw fingerprint no longer matches the server's -> `409 draw-mismatch` -> `ui.compareDaily` hides the block (`target.hidden = true` in the catch); (b) on **every** day, an answer that exists only on the new bank (Scapa Flow, Casoria, Storvindeln Lake…) replays on the old server as `400 round N: unrecognized` -> the block is hidden too; (c) an answer whose scoring changed (Pihlajavesi) is scored the old way in the aggregate. Nothing is shown wrong - the block is simply absent, and the day's aggregate mixes banks (HANDOFF already records dig #5 as such a day). Reproduced through `lib/daily.js` `createDailyApi` on both stacks (`pm-check5b.js`: the same 15 answers replay to 12,909 pts on live and 13,136 on next). Fix: trigger the Netlify deploy in the same minute as the push to main (or before it: a new-bank server accepts old-bank submissions on the 36 identical days), inside the merge window section 4 names, and re-verify with the HANDOFF checklist.

### C3. No cache-busting on `data/bank.js` and the engine scripts; Pages caches them for 600 s (section 5; `src/index.html`, low)

See section 5. For up to ten minutes after the Pages deploy a returning browser can pair a cached `bank.js` with new engine files or the reverse; both combinations load and play, the daily draw may differ from the server's for that session (comparison hidden), and a reload fixes it. Not a blocker; a `?v=2026-09-17` on the two `<script src="data/…">` tags (bumped by `build-data`) or a `Cache-Control` header would remove the window. Netlify is not affected (`max-age=0, must-revalidate`, ETag).


## Judgment calls

### J2. Twin nudges that now name the less famous exact twin (section 2b; by the exact-beats-loose rule)

"Bronx" typed on a non-city round is "Bronx is a river" (the Bronx River, a US-wave row, 1,826 views) where live said "The Bronx is a non-capital city" (49,221): an exact name in any cohort beats a loose one (SPEC 3.7), and the borough's name carries "The". "St Helens" on a non-mountain round is "St Helens is a non-capital city" (Merseyside, a Europe-wave row, 7,093) where live said "Mount St Helens is a mountain" (81,275). On their own rounds both still land on the famous entry (The Bronx, Mount St Helens). A wrong-round hint only; an alias `Bronx` on `city-the-bronx` would let the most-viewed-twin rule pick the borough, and the same for `St Helens` on the volcano - the alias pile.

### J3. "Great Lakes" is "Not recognized" on every round (section 2b; decision 6, by design)

Live corrected it to Great Lake (Tasmania, 365 views) on a lake round - a wrong place scored - and nudged "Great Lake is a lake" elsewhere. Next refuses the plural outright, as decision 6 asked. The message "Not recognized" for the Great Lakes is the price; a group row is out by the standing rule, so nothing to add unless the user wants the plural guard to say "the Great Lakes are a group of lakes". Same for "the Great Lakes" (unrecognized on both stacks).

### J4. The 1,004 changed hand-list outcomes are the v1.3 rules working (section 2b)

108 wrong-place acceptances became nudges (a generic word of another category is no longer dropped: "Gulf of Mexico" on a country round is no longer Mexico, "Congo River" no longer the Republic of the Congo at 950 points, "Lake Malawi" not Malawi, "Yellow River" on a mountain round not Huangshan, "Victoria Island" on a lake round not Lake Victoria), twin nudges moved to the most-viewed exact twin (Fuji, Madeira, Como, Erie, Ontario, Hormuz, Sado, Farne, Skokholm - the last three from fuzzy to exact), and the J10 / J13 bare-name landings the islands audit recorded (Iceland / Jamaica / New York / Holland on a sea or island round). Every one was reproduced as designed; none scores a wrong place that live scored right.

### J5. Bare river names score the lake of that name on a lake round (section 3; the J10 class, by design)

"Murray", "Tisza", "Cumberland" typed on "Name a lake." are Lake Murray / Lake Tisza / Lake Cumberland on both stacks, and "Allegheny" is the Allegheny Reservoir on next (a US-wave row; `reservoir` is lake filler): filler is optional in both directions and the in-cohort loose pass runs before the cross-category nudge. The player named a river on a lake round and was scored a real lake of that name - the class the islands audit recorded as J10 (Holland Island, Iceland Sea). Nothing to fix for the merge.

### J6. "Cape Town" and "Tel Aviv" on a capital round score Pretoria and Jerusalem (section 3; both stacks)

The capital rows carry the other seat as an alias (the house generosity: Cape Town is the legislative capital; Tel Aviv the pre-1980 one), so the feedback line reads "Pretoria · 35,402 views/mo" for a player who typed Cape Town. Identical on live; noted because it is the one wrong-kind typing that *scores* on a capital round, and it is deliberate.

### J7. 354 of 705 daily stars are under 100 views (section 4; by design, both stacks)

The ★ is the rarest eligible entry and the cohort floors are 7-91 views (river Mecaya 7, island Karpa Island 14, lake Storvindeln Lake 17, mountain Diamond Head 30, desert / sea 61, city Bel Air South 91), so any plain or broad prompt reveals a star under 100 views: 317 of 705 on live, 354 on next (the sea cohort's floor rose 18 -> 61 with the Mulciber drop; the island floor fell 21 -> 14 with Karpa Island, a pre-existing row now the rarest). The task asked for the flag; it is the scoring design (rarity is views), not a wave defect.

### J8. Six size-0 stars in the window (section 4)

Adventfjorden (sea, Svalbard, 244 views) is the star of "Name a sea in the Arctic Ocean." on 09-23, 10-08 and 10-10; Altafjord (244) of "Name a sea or ocean that ends in D." on 10-12; Coconut Island (Hawaii, 244) of "Name an island in Hawaii." on 10-08 and 10-27. All are wave rows with no sourced area (decision 1), never on a size prompt, and each round-trips. A review reader sees a name and a view count; size is never shown. Nothing to do.

### J9. Today's stars move under unchanged prompt text (section 4)

#6 (today) keeps all fifteen prompts, but r4 city ★ Musanze -> Bel Air South, r7 lake ★ Pihlajavesi -> Storvindeln Lake (a player who answered Pihlajavesi today is 100% / 1,000 pts on the live bank and 80% / 704 on the new one, and the server will score it the new way once Netlify is on the new bank), r8 mountain ★ Bear Mountain -> Diamond Head, r11 island ★ Grand Manan -> Karpa Island, r12 "starts with L" ★ Lake Oubeira -> Lake Latt; #7 r2 / r3 / r5 the same three. The lakes audit's J10 noted the Pihlajavesi case for #4; it applies to any open day. Merging at a turnover (section 4's window ends before #8 starts anywhere) keeps it to the open days' late players.

### J1. Auckland is refused correctly; the Pacific territorial capitals are not in the bank (section 1)

"Auckland is a non-capital city — this round wants a capital city." names the place, its kind and what the round wants; the player who thinks Auckland is the capital learns it is not (the free retry keeps the round open). Same on both stacks. What *is* missing on the Oceania capital round, on both stacks: Papeete (French Polynesia), Nouméa (New Caledonia), Hagåtña (Guam), Pago Pago (American Samoa) are "Not recognized" - dependent-territory capitals, not countries' capitals, consistent with the bank's rule (one capital per country row), and the same as live. Not a merge blocker; an alias/row question for the capital cohort if the user wants territorial capitals accepted.

## Not reached

Nothing: all five sections ran to completion. Not attempted, and worth saying: the UI wording was reproduced from `ui.js` in the harness (`uiText`), not driven through a browser; the C1 fix (`elsewhere` ordering) was reasoned from `run.js` and measured only as the shipped engine's outcomes; the merge windows assume players' local dates span UTC-12..UTC+14 (the daily key is local) and the Pages cache figure is the header the live host sent at audit time.
