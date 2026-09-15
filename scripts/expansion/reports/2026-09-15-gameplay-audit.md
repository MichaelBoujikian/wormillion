# Wormillion gameplay investigation — 2026-09-15

Bank at time of testing: **8,987 entries** (country 197, capital 247, city 2,535,
lake 766, river 2,196, mountain 1,318, desert 130, island 1,345, sea_ocean 253).
Everything below was run against the **real engine** — `matching.matchAnswer`,
`promptBank.createBank`/`promptFor`, `runner.createRun`/`submit`/`rarestFor`,
`rarity.computeRarity` — loaded from the shipped `src/data/bank.js` +
`themes.js` the way `tests/prompts.test.js` does, or from `buildFiles()` the
way `scripts/gap-check.mjs` does. **No files in the repo were edited.**

All scratch scripts and raw JSON results live next to this file:
`C:\Users\smite\AppData\Local\Temp\claude\C--Users-smite-repos-wormillion\1010ff2a-7117-46a8-8a3c-7ff5a2004b50\scratchpad\`
(`lib.mjs` is the shared loader; `task1.mjs`…`task5.mjs` + their `*-answers.mjs`/
`*-results.json` reproduce every number below).

## Summary of counts

| check | result |
|---|---|
| Task 1 — answers pushed through the real matcher | 998 answers, 9 categories |
| …accepted (exact/loose/fuzzy) | 937 |
| …real place, nowhere to land ("missing entry") | 19 (several are the same root cause — see below) |
| …real place, nudged to another category ("elsewhere") | 42, all reasonable but two families worth a look |
| …fuzzy-corrected | 19, of which **2 are wrong-place corrections that reach the player** (Gasherbrum→Masherbrum, Coney Island→Canvey Island) |
| Task 2 — shared bare names within one cohort (`buildLookup` claims) | only **3** across all 8,987 entries; all three resolve correctly, none are "nobody wins", 0 alias-equals-name violations, 0 normalize() collisions |
| Task 3 — distinct prompts sampled (2,000 seeded runs, 30,000 slots) | 737 distinct prompt texts |
| …prompts with <10 eligible answers | 75 (2 are the documented-deliberate Mesopotamia/Great-Lakes; rest sit at the MIN_ELIGIBLE=6-9 floor, mostly "reality of the alphabet") |
| …size prompts that barely narrow the field (>55% of cohort) | 1 (58%, under the 60% guard — not a violation) |
| …daily prompts for the next 30 days, any with a <8-answer round | 4 of 30 days (#6, #8, #25, #26); none below the MIN_ELIGIBLE floor |
| Task 4 — `rarestFor` sanity (200 random prompts) | **0 failures** — every rarest-answer reveal is itself accepted |
| Task 5 — rarity outliers per category (>0.5 famous / <0.2 "reads as famous") | 2 clear wrong-article-shaped bugs (Antarctic Desert, Bab-el-Mandeb/Hormuz); rest of the extreme end is correctly-famous places; one structural outlier (United States) compresses the country/island scale |

**Headline findings, ranked by how much they'd actually annoy a player:**
1. **`FILLER` doesn't include "strait"** — an entire family of ~10 "Strait of X"
   sea/ocean entries can't be reached by typing the natural short name; several
   land on a *wrong-category nudge* naming an unrelated same-named place.
2. **Two fuzzy corrections land on a real but different place** on an obscure
   mountain and an obscure island, unguarded by the "exact-elsewhere" checks
   that catch the capital/city cases.
3. **`Antarctic Desert` and `Bab-el-Mandeb`/`Strait of Hormuz`** are almost
   certainly scoring off the wrong (or a news-inflated) Wikipedia article —
   both read as the *most famous thing in their whole cohort*, ahead of the
   Sahara and the Pacific Ocean respectively.
4. A handful of real alternate-language river/mountain names are missing as
   aliases (Rhein, Wisla, Tajo, Maas, Moldau, Fujiyama, "SF").
5. Growing the river cohort introduced a genuine fuzzy-match casualty:
   "Tames" (a common Thames misspelling) now ties with "River James" and gets
   rejected rather than corrected — the tie-guard working exactly as designed,
   but a real regression from bank growth.

Everything else checked out clean: no shared-bare-name surprises, no alias/name
collisions, no thin prompts below the design floor, no bad `rarestFor` reveals,
no size-threshold guard violations, all theme/letter/flag prompt text reads
correctly (including the "a/an" letter-sound logic).

---

## 1. Answers that don't land

Method: 998 answers across the 9 categories (`task1-answers.mjs`), each pushed
through **(a)** `matching.matchAnswer(answer, cohort.lookup, new Set())`
directly (like `gap-check.mjs`), and **(b)** `run.submit(answer)` on a
fresh 1-round plain-prompt run for that category (like `tests/prompts.test.js`).
(b) is what a real player actually sees, since `run.submit` has extra guards
`matchAnswer` alone doesn't (the "exact name beats a correction" and
"elsewhere" checks in `src/js/run.js`).

### 1a. Missing entries (real place, no answer at all)

19 raw misses; grouped by cause:

| answer(s) | category | verdict |
|---|---|---|
| **Gibraltar, Hormuz, Malacca, Dover, Bonifacio, Messina, Otranto, Juan de Fuca, Georgia** (typed alone, meaning the strait) | sea_ocean | **Structural bug**, see §1d below — not a data gap, a matching-rules gap. |
| Rhein, Wisla, Tajo, Maas, Moldau | river | Real native-language names for the Rhine/Vistula/Tagus/Meuse/Vltava, missing as aliases. `Tagus`, `Vistula`, `Rhine`, `Meuse`(as "Meuse"), `Vltava` themselves are all present and accepted — only the native short forms are absent. |
| SF | city | Common abbreviation for San Francisco (itself accepted); "LA"/"NYC" both work as aliases already, "SF" doesn't. |
| Fujiyama | mountain | Old-style English name for Mount Fuji; "Mt Fuji"/"Fuji" both work, "Fujiyama" doesn't. |
| Orizaba | mountain | Short form of "Pico de Orizaba" (itself accepted). `looseKey` doesn't strip "pico" (not in `FILLER`), so the bare form isn't reachable — same shape as the Rhein/Wisla family. |
| Kirghizstan | country | Dated transliteration of Kyrgyzstan (itself accepted); too many edits for the fuzzy budget (`slackFor(11)=2`, real distance is 3+). |
| North Atlantic, South Atlantic | sea_ocean | Not distinct Wikipedia-titlable places from "Atlantic Ocean" in this bank — **not a bug**, a reasonable exclusion. |
| Nuuk | capital | Capital of Greenland, which isn't in the country bank (Greenland isn't a UN member — matches the `data-un-members.mjs` audit). **Not a bug**, consistent with the rest of the bank. |
| Danube Delta, Table Mountain South Africa, Mount Fuji-san, Patagonia | river/mountain/desert | Bad test inputs on my part (compound/invented phrasings) — "Table Mountain", "Pico de Orizaba" etc. themselves are all accepted. No action needed. |

Repro for any of these:
```js
// from lib.mjs
const shipped = loadShippedBank();
const run = runner.createRun(shipped, { rounds: 1 });
run.state.slots[0] = { category: 'river' };
run.submit('Rhein'); // -> { status: 'unrecognized' }
```

### 1b. Answers landing on the "wrong" entry within a cohort

Cross-checked against Task 2's shared-bare-name audit (§2): **there are only 3
same-cohort collisions in the entire bank**, and all 3 resolve to the more
obvious/famous place (Arabian → Arabian Sea over the Persian Gulf's "Arabian
Gulf" alias; "Great Salt" → Great Salt Lake Desert over Dasht-e Kavir's "Great
Salt Desert" alias; "Trobriand" → Trobriand Islands over Kiriwina's "Trobriand
Island" alias). None are surprising or famous-loses-to-obscure.

The apparent "wrong entry" cases a player would actually hit are **cross-category**,
via `run.js`'s `elsewhere()` nudge, not same-cohort ambiguity — see §1d.

### 1c. Fuzzy corrections that are wrong or embarrassing

Of 19 raw fuzzy corrections from `matching.matchAnswer` alone, run.js's guards
(exact-elsewhere-beats-correction) save 3 that looked bad in isolation:
`Dublin`→ would-be "Lublin", `Manila` → would-be "Manisa", `Wellington` → would-be
"Wilmington", `Santa Maria` → would-be "Santa Marta" — all four are actually
**capitals/islands typed on a city round**, and `run.submit` correctly returns
`unrecognized` with an `elsewhere` nudge instead of the fuzzy correction. Good,
working as designed. Repro:
```js
run.state.slots[0] = { category: 'city' };
run.submit('Dublin'); // -> { status: 'unrecognized', elsewhere: { category: 'capital', entry: Dublin } }
```

**Two corrections are NOT saved and reach the player as `accepted` with the
wrong place:**

- **`mountain`: "Gasherbrum" → accepted as "Masherbrum".** Gasherbrum (any of
  the Gasherbrum I–VI group, including the 8,080 m Gasherbrum I, one of the
  fourteen eight-thousanders) and Masherbrum (7,821 m) are two **different**
  real Karakoram peaks. The bank has "Gasherbrum I"/"Gasherbrum II" etc. as
  separate entries with no bare "Gasherbrum" alias, so the bare form fuzzy-matches
  the unrelated Masherbrum instead.
  ```js
  run.state.slots[0] = { category: 'mountain' };
  run.submit('Gasherbrum'); // -> { status: 'accepted', entry: 'Masherbrum', correctedFrom: 'Gasherbrum' }
  ```
- **`island`: "Coney Island" → accepted as "Canvey Island".** Coney Island
  (Brooklyn, NYC — extremely well known) isn't in the bank; the typo-correction
  guard has no "exact place, wrong category" match to fall back on (Coney
  Island isn't anywhere else in the bank either), so it silently lands on
  Canvey Island (a minor island in the Thames Estuary, England) at edit
  distance 2.
  ```js
  run.state.slots[0] = { category: 'island' };
  run.submit('Coney Island'); // -> { status: 'accepted', entry: 'Canvey Island', correctedFrom: 'Coney Island' }
  ```

**A related, more benign but real growth-regression:** "Tames" (a plausible
Thames misspelling — drop the silent h) used to presumably resolve; now that
the bank has grown to include "River James" (US), `nearest()` finds **two**
candidates at edit-distance 1 (Thames and James) and the tie-guard correctly
refuses to guess — so it's `unrecognized`, not wrong. This is the tie-guard
working exactly as documented (README: "if two different places tie for
closest the answer is rejected"), but it's a real behavior change from bank
growth worth knowing about.
```js
matching.editDistance('tames', 'thames', 3); // 1
matching.editDistance('tames', 'james', 3);  // 1  <- new tie, added by growth
matching.matchAnswer('Tames', riverCohort.lookup, new Set()); // { status: 'unrecognized' }
```

### 1d. Confusing statuses — the "Strait of X" family (structural)

`matching.js`'s `FILLER` set (`mount, mt, mountain, peak, hill, lake, loch,
lough, llyn, river, sea, ocean, gulf, bay, island, islands, isle, isles,
desert, the, of, city, saint, st, cape, atoll`) does **not** include `strait`
(or `channel`/`sound`/`passage`). "Bay of X" and "Gulf of X" both work as bare
"X" because `bay`/`gulf`/`of` are filler — but there are **11 "Strait of X"**
entries in `sea_ocean` (Gibraltar, Hormuz, Malacca, Magellan, Dover, Bonifacio,
Messina, Otranto, Juan de Fuca, Sicily, Georgia) where the natural short
answer is unreachable. Confirmed on the shipped bank:

```
Gibraltar      -> unrecognized (nothing)
Hormuz         -> unrecognized, elsewhere: island "Hormuz"        <- confusing: implies wrong category
Malacca        -> unrecognized, elsewhere: city "Malacca City"    <- confusing
Magellan       -> unrecognized (nothing)
Dover          -> unrecognized, elsewhere: capital "Dover"        <- actively misleading: Dover IS the answer, wrong category
Bonifacio      -> unrecognized (nothing)
Messina        -> unrecognized, elsewhere: city "Messina"         <- confusing
Otranto        -> unrecognized (nothing)
Juan de Fuca   -> unrecognized (nothing)
Georgia        -> unrecognized, elsewhere: country "Georgia"      <- confusing
Sicily         -> unrecognized, elsewhere: island "Sicily"        <- confusing
```
Even the two aliased ones don't help, because the alias still carries the
un-stripped generic word: `Strait of Magellan`'s alias is `"Straits of
Magellan"`, and `Strait of Dover`'s alias is `"Dover Strait"` — neither
loose-strips to bare `magellan`/`dover`.

This is the single highest-value fix candidate in the whole report: it's one
line (add `strait` to `FILLER` in `src/js/matching.js`, or add each `X` as an
explicit alias) and it fixes both the missing-entry cases and the misleading
"elsewhere" nudges at once. Repro script: `task1.mjs` / the inline check above
(also runnable standalone against `loadShippedBank()` from `lib.mjs`).

The rest of the 42 "elsewhere" nudges checked out as correct and helpful (a
capital typed on a city round gets `elsewhere: capital`, and vice versa; "San
Juan"/"Colorado" typed on a city round correctly nudge to the river cohort;
"Trinidad" on a city round nudges to the country; "Kamchatka" on an island
round nudges to the river; "Sea of Galilee" on a sea round nudges to the lake
cohort — all reasonable, matching the documented "generosity" design).

One nudge worth a second look even though it's not wrong: **"Victoria" on a
city round** → `unrecognized`, `elsewhere: capital (Victoria, Seychelles)`.
There's no "Victoria" in the city cohort at all (not Victoria BC, not
Victoria, Australia's namesake city), so a player meaning either of those real
cities gets told "that's actually a capital" about a *third*, unrelated
Victoria. Not a bug in the matching logic — just a possible bank gap (no
"Victoria, BC" city entry) surfaced by the nudge.

Similarly **"San Juan" on a city round** → `unrecognized`, `elsewhere: river
(San Juan River, Nicaragua)`. San Juan, Puerto Rico (a genuinely well-known
city of ~320k, and PR isn't a sovereign country so it isn't excluded by the
capital rule) doesn't appear to be in the city bank at all — the nudge to an
obscure river is technically correct but unhelpful/confusing for what's
probably the player's intended answer. Worth a data check.

---

## 2. Shared bare names (within one cohort)

Reproduced `matching.buildLookup`'s internal "claims" step per cohort
(`task2.mjs`) — every filler-stripped bare form claimed by ≥2 distinct entries
in the *same* category, independent of the cross-category collisions in §1d.

**Result: only 3 in the entire 8,987-entry bank**, all resolved sensibly by
the documented "name beats alias" rule, none "nobody wins":

| category | bare form | claimants | winner |
|---|---|---|---|
| sea_ocean | `arabian` | Arabian Sea (name) vs Persian Gulf (alias "Arabian Gulf") | **Arabian Sea** ✓ (matches README's own example) |
| desert | `great salt` | Great Salt Lake Desert (name) vs Dasht-e Kavir (alias "Great Salt Desert") | **Great Salt Lake Desert** ✓ (the far more likely intended answer) |
| island | `trobriand` | Trobriand Islands (name) vs Kiriwina (alias "Trobriand Island") | **Trobriand Islands** ✓ |

Also checked and clean:
- **0 alias-equals-name violations** (an alias identical to a different
  entry's name in the same cohort — this is exactly what `npm run validate`
  is supposed to reject, and it's holding at 8,987 entries).
- **0 cases** where two different entries in the same cohort `normalize()` to
  the same key at all (which would be an outright duplicate-name bug).
- None of the specifically-named watch-list collision names from the brief
  (Washington, Georgia, Victoria, Santa Cruz, San Juan, Salado, Colorado,
  Nelson, Hamilton, Jackson, Columbia, Lincoln, Richmond, Springfield,
  Cambridge, Newcastle, Portland, Salem, Trinidad, Long Island, Andros, Santa
  Maria, San Pedro, Saint Louis) collide *within* any single cohort — each of
  these names has at most one entry per category (validated: duplicate names
  in one cohort are already rejected by `npm run validate`'s alias-collision
  check). The ambiguity a player actually experiences with these names is the
  cross-category kind covered in §1d (e.g. "Victoria" the city vs "Victoria"
  the capital), not a same-cohort shared-bare-name problem.

**Conclusion: growth to 8,987 entries has not introduced same-cohort naming
collisions.** The validator + `resolveLoose`'s name-beats-alias rule are
holding up well at this scale.

---

## 3. Prompt generation

Method: `bank.drawSlots(seeded(s))` for seeds 1–2000 (30,000 slots total),
`bank.promptFor(slot)` on each, eligible-answer count computed as
`new Set(prompt.lookup.values()).size` (distinct **entries**, not
`lookup.size`, which counts every alias/spelling separately and initially gave
me false "lopsided" readings for flag/size prompts until corrected — see
`task3.mjs`).

**737 distinct prompt texts** across the 2,000 runs.

### Thin prompts (<10 eligible answers): 75

Two are the documented-deliberate tight themes (`river·Mesopotamia`=2,
`lake·the Great Lakes`=5 — both already called out in HANDOFF.md as
intentional). The other 73 all sit at or just above `MIN_ELIGIBLE`=6, split
between:
- **Region prompts** (6–9): Central Asia, North Africa, East Asia, Central
  America, South Asia, Southern Africa for country/capital — same shape as
  HANDOFF's existing "thinnest regions" table, now for capital as well as
  country (capitals inherit country regions 1:1, so this tracks exactly).
- **Letter prompts** (6–9): almost all in desert/mountain/sea_ocean/capital —
  spot-checked several (`mountain ends in P` → Flattop Mountain, Feathertop,
  Frenchmans Cap, Bluemlisalp, Rip, Doi Suthep; `sea starts with W` → Weddell
  Sea, White Sea, Wadden Sea, Windward Passage, The Wash, Western Scheldt) and
  they're genuinely diverse real answers, not a data artifact — "reality of
  the alphabet," matching the existing HANDOFF verdict style, not a bug.
- One size prompt: `river longer than 5,000 km` = 7 — already flagged as
  "reality — leave it" in HANDOFF.

No prompt anywhere in the 2,000-run sample fell **below** `MIN_ELIGIBLE`=6
except the two intentionally-tight themes — the generated-modifier guard is
holding at 8,987 entries. Full list: `task3-thin.json`.

### Size-threshold prompts

Only one crosses my >55%-of-cohort "barely narrows" flag: **"capital city
whose country has a population over 10 million" = 144/247 (58%)** — under the
actual `MAX_ELIGIBLE_SHARE`=0.6 guard, so not a violation, just close to the
ceiling (a lot of the world's capitals now belong to >10M-population
countries — a reasonable real-world fact, not a bug). Everything else is on
the *thin* end (1–3% of cohort — river>5,000km, mountain>8,000m, lake>30,000km²,
city>10M, island>100,000km² — all "reality," matching HANDOFF's existing
verdicts almost number-for-number even after 5x growth). No
`MAX_ELIGIBLE_SHARE` violations found.

### Letter prompts: easiest / hardest

Not a problem either way — spot-checked the extremes (`mountain ends in C`:
Mont Blanc, Cadillac Mountain, Mount Tallac, Grintovec, Maglic, Trebevic;
`mountain ends in P`: see above) and both ends read as genuine, diverse real
places, not degenerate.

### Grammar / wording

All 44 distinct theme prompts, all 57 region prompts, all 10 ocean prompts,
and all 66 flag prompts read correctly (`task3-distinct-prompts.json`). No
"in {theme}" wording found for a non-place theme — every non-geographic theme
(`volcanoes`, `landlocked`, `coastal`→"with a coastline", `saltwater`, `island
nation`, `not the largest city`, `on the coast`, `US state capitals`, `largest
in its country`) has its `WORMILLION_THEME_PROMPTS`/`DERIVED_THEMES` custom
text and none leaked the default `"Name a X in {theme}."` template
incorrectly. The `a`/`an` letter logic (`VOWEL_SOUNDING_LETTERS`) is also
correct across all 23 letters ("an F", "an H", "an M", "an S", etc.).

### Modifier-kind frequency per category (2,000 runs, share of that category's own slots)

```
mountain   letter=31% theme=30% none=24% size=15%
desert     letter=31% theme=29% none=24% size=16%
lake       theme=31% letter=31% none=24% size=15%
river      letter=30% theme=30% none=25% size=15%
sea_ocean  none=23% theme=22% letter=22% ocean=22% size=11%
island     none=24% ocean=21% theme=21% letter=21% size=12%
city       none=24% letter=17% region=17% flag=17% theme=17% size=8%
country    none=24% letter=18% theme=18% region=17% flag=16% size=7%
capital    none=26% flag=17% letter=17% theme=16% region=16% size=8%
```
Physical-geography categories (mountain/desert/lake/river) only have
theme/letter/size as options (no region/ocean/flag data), so letter+theme
naturally soak up ~60% of their conditional rounds combined — that's an
artifact of what modifiers those categories *can* carry, not an
over-weighting bug in `drawModifier()`. No single kind is over-represented
relative to its `options.push(...)` weighting anywhere I checked.

### Daily prompts, next 30 days (2026-09-15 → 2026-10-14)

All 30 days produce exactly 15 non-repeating prompts with ≥1 eligible answer
each (`task3-daily-30.json`). Four days include a thin (<8-eligible) round,
none below the design floor:
- **#6 (2026-09-17)** and **#25 (2026-10-06)**: both draw "Name a river in
  Mesopotamia." (2 answers) — the documented deliberate tight theme.
- **#8 (2026-09-19)**: "Name a sea or ocean with a J in it." (7 answers) —
  reality.
- **#26 (2026-10-07)**: stacks *two* thin region prompts in one daily —
  "Name a capital city in Central America." (7) and "Name a country in North
  Africa." (6). Each individually passes the guard, but it's worth knowing
  that a daily *can* land two of its dozen conditional rounds at the
  MIN_ELIGIBLE floor at once; not unfair (every round still has a real,
  gettable answer), just a slightly harder-than-average day by chance.

---

## 4. Review / rarest sanity

200 prompts sampled across seeds/slot-positions; for each, `runner.rarestFor(prompt)`
was submitted back into a fresh run pinned to that same prompt.

**Result: 0 failures out of 200.** Every reveal `rarestFor` would show on the
★ review line is itself accepted by `run.submit` when typed back in. The
4-dp-rounding issue HANDOFF mentions from the earlier -dle-kit review does not
appear to have regressed. (`task4.mjs`, `task4-results.json`.)

---

## 5. Scoring sanity — rarity outliers

`rarity.computeRarity(cohort.entries)` per category, cross-referenced against
`src/data/pageviews.json` for `wikiTitle` (the shipped `bank.js` doesn't carry
`wikiTitle` itself — only `pageviews.json` does, keyed by entry id).

### The two likely wrong-article / news-inflated bugs

- **`desert` — "Antarctic Desert" → wikiTitle `Antarctica`, magnitude
  98,595, rarity 0.000.** This is the single most-viewed entry in the entire
  130-entry desert cohort — more than **double** the Sahara (42,220) and
  nearly 3x Death Valley (33,728). "Antarctic Desert" is being scored off the
  *continent's* Wikipedia article rather than an article about the desert
  classification specifically, which inflates it to "most famous desert on
  Earth," ahead of the Sahara. Worth re-pointing via `WIKI_TITLES` in
  `scripts/data-wiki-titles.mjs` to whatever more specific article exists (or
  accepting this deliberately, since "the desert IS the continent" is
  arguably a defensible reading — but it should be a conscious choice, not an
  artifact).
- **`sea_ocean` — "Bab-el-Mandeb" → wikiTitle `Strait of Bab al-Mandab`,
  magnitude 195,303, rarity 0.000** — the single most-viewed entry in the
  entire 253-entry sea/ocean cohort, **3x the Pacific Ocean** (61,976) and
  nearly 3x the Mediterranean (65,781). **"Strait of Hormuz"** is the same
  shape one rung down (97,104 — more than the Gulf of Mexico or the Indian
  Ocean). Both straits have had sustained Red Sea/Persian Gulf shipping-attack
  news coverage; since magnitude is "median of 60 daily counts," a
  months-long news cycle (not just one day) could genuinely lift the median
  this much, or the article being counted could be catching disambiguation
  traffic. Either way, a player who correctly names an obscure-feeling strait
  currently gets **less reward than for naming the Pacific Ocean outright** —
  worth a manual look and possibly a `WIKI_VERIFIED`/re-fetch after the news
  cycle cools, or a deliberate override if the traffic is real.

### Everything else at the extreme end is correctly famous, not a bug

Sorted the `rarity < 0.2` bucket by *descending* magnitude per category (the
extreme/most-revealing end) and eyeballed `wikiTitle` against the entry name.
Aside from the two above, every single one is a legitimately, extremely
famous place whose `wikiTitle` matches its name and whose near-zero rarity is
exactly the intended design ("Everyone knows the Nile — nobody digs deep on
the Nile"): Mount Everest, Nile, Amazon, Danube, Rhine, Caspian Sea, Lake
Baikal, Japan (island), Indonesia (island), United States, Singapore, London,
Paris, Berlin, New York City, Hong Kong, Los Angeles, Tokyo-tier cities, etc.
No disambiguation-page titles anywhere in either extreme. Full tables:
`task5-results.json`.

### A structural outlier worth flagging even though it's probably correct data

**`country` — United States, magnitude 1,527,571** — nearly **6x** the next
highest country (Nigeria/UK-tier at ~250k). Since `rarityOf` is a log-scale
min/max normalization over the *whole* cohort, one extreme outlier at the top
compresses everyone else's rarity upward. This is very likely why the
"too rewarding" (rarity just above 0.5) list for `country` is full of
genuinely well-known, populous nations that probably shouldn't feel like
"50%+ rare" answers: Indonesia (0.502), Philippines (0.505), Taiwan (0.506),
Pakistan (0.508), Netherlands (0.526), Mexico (0.527), Italy (0.540), South
Africa (0.541), Poland (0.552), Bangladesh (0.558). Same shape for `island`,
where Japan's country-level magnitude (298,647, since Japan-the-island reuses
the country's Wikipedia article) sits at the top and produces the same
"famous islands read as ~50%+ rare" list (Indonesia, Philippines, Taiwan,
Malta, New Zealand, Mauritius, Cyprus, Sri Lanka, Iceland...). **Not a wrong
article** (USA's own Wikipedia article legitimately gets that much traffic,
and Japan-the-island correctly reuses Japan-the-country's article per the
documented "big island nations answer as islands" design) — but worth
knowing that a single extreme outlier is doing a lot of the compressing work
on the country/island scoring curve. `npm run score-report` would be the
place to check if this is new since the 1,719→8,987 growth or was always
there (USA was presumably always in the bank).

### Full 15/15 tables per category

All in `task5-results.json` (`tooRewarding` = 15 most-famous-by-magnitude with
rarity>0.5, sorted by fame; `tooPunishingExtreme` = the rarity<0.2 bucket
sorted by descending magnitude, i.e. the most revealing end; `tooPunishing` =
same bucket sorted ascending, i.e. the near-threshold/least-distorted end,
kept for comparison). Includes `wikiTitle` and `magnitude` for every row as
requested, for the lead session to re-point anything they decide is wrong.

---

## Files for follow-up

- `lib.mjs` — shared loader (`loadShippedBank`, `byCategoryFromSource`, `seeded`)
- `task1-answers.mjs`, `task1.mjs`, `task1-results.json` — the 998-answer sweep
- `task2.mjs`, `task2-results.json` — shared-bare-name / alias-collision audit
- `task3.mjs`, `task3-distinct-prompts.json`, `task3-thin.json`,
  `task3-lopsided-size.json`, `task3-letters.json`, `task3-kind-freq.json`,
  `task3-daily-30.json` — prompt generation sampling
- `task4.mjs`, `task4-results.json` — rarestFor round-trip check
- `task5.mjs`, `task5-results.json` — rarity outlier tables per category
