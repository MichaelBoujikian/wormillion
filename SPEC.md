# Wormillion — Build Specification (v1.3)

## 0. One-line pitch

An endless, single-player, browser-based digging game: each 15-round run asks you to name a real place (a country, capital, city, lake, river, mountain, desert, island, or sea/ocean); the more obscure your correct answer, the deeper your pixel worm digs and the more points you score. No accounts, no daily lock, no build step — open `index.html` and play forever.

Inspiration: [Krillion](https://krillion.me/)'s "rarer answer = deeper dive = more points" loop, reskinned from an ocean/submarine theme to an earth/soil-strata theme, and narrowed from general trivia to geography only.

## 1. How to use this document

This spec is pre-broken into **milestones (M0–M8)** in Section 11. Each milestone is a vertical slice: independently implementable, independently testable, and independently shippable (every push to `main` deploys automatically — see Section 10 — so "shippable" is literal from M0 onward, not aspirational).

Work milestones **in order**; each one lists what it's blocked by and what it blocks. Inside a milestone, prefer red-green-refactor: write the test for a rule in this doc, watch it fail, implement the minimum to pass, refactor, then move to the next rule. Close each milestone with a self-review against its own acceptance criteria before starting the next one — don't let scope leak forward ("while I'm in here..." belongs in a later milestone's task list, not this commit).

Sections 2–10 are the reference material every milestone pulls from. Read them once up front; don't re-derive the rarity formula or the data schema from the one-line bullets in Section 2 — Section 5 and Section 4 are the authoritative, unambiguous versions.

## 2. Original product requirements (as given)

- **Format:** Vanilla HTML/CSS/JS, zero build step, public GitHub repo named `wormillion`, deployed to GitHub Pages via GitHub Actions on push to `main`.
- **Gameplay:** Endless/limitless mode — no daily lock, play as many runs as you want, each run draws 15 prompts at random from the bank. 30 seconds per prompt; timeout = auto-advance with 0 points.
- **Prompts:** Geography only — countries by continent/region, capitals, lakes, rivers, mountains, deserts, islands, seas/oceans, plus real-but-obscure minor peaks/hills for deep rarity tiers. No fabricated place names.
- **Rarity/scoring:** Algorithmic, not hand-tiered — each entry's magnitude is its **typical monthly English-Wikipedia pageviews** (v1.1; v1.0 used a physical stat — population, area, length, elevation — which is now kept as `size` for reference and for threshold prompts). Magnitude is converted to a log-scaled percentile within its category, and that percentile drives both dig depth and points, mirroring Krillion's "rarer = deeper = more points."
- **Answer matching:** Case-insensitive, with an alias table so common abbreviations/nicknames count (USA/US/America, UK, DRC, etc.), plus filler-word tolerance ("Everest" → Mount Everest) and **spelling correction** within a tight edit-distance budget, with the corrected spelling shown to the player (v1.1). British spellings are therefore *corrected*, not rejected.
- **Prompts:** Each round is a category plus an optional modifier — region, curated theme, ocean, size threshold, or letter rule — so a run reads "Name a river." early and "Name a river in Mesopotamia." or "Name a river with a T in it." later. No prompt text repeats within a run (v1.1).
- **Visuals:** Retro pixel-art style matching Krillion's look, reskinned to earth tones. Depth strata across the 15-round range: Topsoil → Subsoil → Clay → Bedrock → Deep Rock → Mantle → Core. Pixel worm digs and leaves a tunnel behind it.
- **Persistence:** Browser localStorage tracks best dive/history across runs (no server, no accounts).

Everything below resolves the gaps this list leaves open, so no implementation decision is made silently mid-milestone.

## 3. Resolved design decisions

The original brief describes the shape of the game but leaves several mechanics underspecified. These are resolved here, once, so every milestone builds against the same rules.

**3.1 Prompt format is "name a member of a category," not fixed trivia.** Every prompt accepts *any* real member of its category that satisfies the prompt's modifier (if any) — not one specific correct answer. "Name a country in Africa" accepts Egypt, Comoros, or São Tomé and Príncipe; "Name a capital city" accepts London or Ngerulmud. This is what makes per-answer rarity meaningful (Section 5) and matches Krillion's actual mechanic.

**3.1a Modifiers (v1.1).** A slot is `{category, modifier?}` where the modifier is one of:

| modifier | example prompt | applies to | source of truth |
|---|---|---|---|
| region | "Name a country in Southeast Asia." / "Name a non-capital city in the Caribbean." | country, capital, city | `region` tags (Section 6); a city's are its country's. A city region prompt is only offered where ≥ 6 cities carry the tag (v1.2) |
| theme | "Name a river in Mesopotamia." / "Name a volcano." / "Name a landlocked country." / "Name a country with a coastline." | any | `src/data/themes.js`, hand-curated; plus derived themes in `promptBank.js` (v1.2) |
| ocean | "Name an island in the Pacific Ocean." | island, sea_ocean | `oceans` field, derived from coordinates (Section 4) |
| flag | "Name a country whose flag has green in it." / "…has both black and red in it." / "Name the capital of a country whose flag has green in it." / "Name a non-capital city in a country whose flag has green in it." | country, capital, city | `flag` field, hand-authored in `scripts/data-flags.mjs`; a capital or city inherits its country's (v1.2) |
| size | "Name a country with a population under 1 million." / "Name a river longer than 3,000 km." | any | `size` field |
| letter | "Name a river with a T in it." / "…that starts with M." / "…with a double letter." | any | the entry's name and aliases, except initialisms (NYC, UAE) |

A modifier narrows what is **accepted**, never how an answer scores (3.2). A size rule's share is measured over the rows that carry a figure (`size` > 0): a cohort of unmeasured bays does not make "smaller than 1,000,000 km²" a rare rule (v1.3, 2026-09-17). Size thresholds are inclusive both ways ("larger than 100,000 km²" and "smaller than 100,000 km²" both accept a desert listed at exactly 100,000 — round figures are rounded figures). Where reputable figures disagree an entry carries a `sizeRange` (authored as `lo-hi` in the size column: the Amur is `2824-4444`, with or without the Argun; the Ob `3650-5410` with the Irtysh; the Mississippi `3766-6275` with the Missouri) and a threshold prompt accepts either end — the Amur answers both "longer than 3,000 km" and "shorter than 3,000 km". A generated modifier (size, letter, ocean, flag) is only used when at least 6 entries satisfy it and — for size and flag — it rules out at least 30% of the category (`MAX_ELIGIBLE_SHARE` 0.7; 40% until 2026-09-16, when the US lakes fill retired "smaller than 100 km²" at 60.0%), for a letter rule at least 40% (`MAX_ELIGIBLE_SHARE_LETTER` 0.6 — "with an A in it" is true of two rivers in three); otherwise the slot falls back to plain. (So "has red in it", true of 79% of flags, is never asked on its own, but "has both red and black in it" is.) A flag rule is one colour or a pair from the palette `red white blue green yellow black orange`; colours are read **generously** — an emblem's colours count, gold is yellow, maroon is red, light blue is blue — because an over-inclusive row can at worst accept a debatable answer while a missing colour rejects a correct one. Only positive flag prompts are generated for the same reason. Curated themes may be deliberately tight (Mesopotamia has two rivers) and are used with as few as 2 members. A themed sea prompt says "sea", not "sea or ocean", unless an ocean is actually a member (v1.3): "Name a sea in the Americas." doesn't invite "Pacific". A **derived theme** (v1.2) is the complement of a curated one: `coastal` is every country not in `landlocked`, computed at load time so the two lists can never disagree. It carries its own prompt text ("Name a country with a coastline.") and, because its name is not a place, a miss gets the generic "doesn't fit this one" hint rather than "isn't in coastal". Letter rules ("with a T in it", "starts with M", "ends in A", "double letter") look only at the name and aliases with the generic English words ("mount", "lake", "the", "river", "island"…) removed: those are not part of the name, so "Mount Fuji" has no T in it and does not start with M, "Lake Baikal" starts with B (not L), and "Nile" does not get a T from its alias "the Nile" (v1.2; v1.1 also counted the name as displayed). A word that *is* the name stays, even if it means "lake" in another language: "Loch Ness" starts with L, "Laguna Colorada" starts with L, "Saint Lucia" starts with S, "Cape Verde" starts with C (`LETTER_FILLER` in `promptBank.js` is the matcher's filler list minus loch/lough/llyn/saint/st/cape/rio and the foreign generic words lago/lac/lagoa/laguna/etang/fiume/fleuve/fluss/riviere/rivier — a word that is the name in any language stays, v1.3 2026-09-17). A **country's, capital's or sea's** name is its official name, generic words and all — the Solomon Islands have a D in them, Port of Spain has an F, Mexico City ends in Y, the Black Sea ends in A — so for those three categories only a leading "the" is dropped (`NAME_FILLER`, `WHOLE_NAME_CATEGORIES`). The two *length* rules ("short name", "long name") are judged on **the spelling the player actually used, or that spelling with its generic words trimmed, whichever fits** (v1.3; v1.2 judged the typed spelling only): an entry is in the prompt's lookup if any of its spellings would do, and then the typed one has to, either way (`judgeTyped` on the prompt, checked in `run.js`). So "China" is five letters and "People's Republic of China" is 22, and each counts for what it is; "Mount Kilimanjaro" is long (as typed) and "Kilimanjaro" is not; "Fuji", "Ness", "Loch Ness" and "Monte Desert" are short (Ness, Monte); "Ceram Sea" is a short-named sea even though seas keep their whole name for the other letter rules — length is about the name proper, and nothing that fits as typed is ever rejected. A spelling-corrected answer is judged, and shown, as the spelling it was corrected to. The miss hint counts the spelling as typed: "Lake Superior is 12 letters — this round wants 5 letters or fewer." A digit is a character like any other: K2 is two characters, starts with K, has a K in it, and does not end in K.

**3.2 Country/capital region scoping applies to the prompt, not the score.** A country prompt may be scoped to a region ("Name a country in Southeast Asia"), but rarity is always computed against the *global* cohort for that category (all ~195 countries), never the region subset. Rationale: a Pacific micro-state should score as globally obscure even when the prompt happened to scope to a region full of other small states; scoping the cohort too would flatten that.

**3.3 Minor peaks/hills share the "mountain" cohort.** The obscure bonus pool isn't a separate category the player can target — it's additional entries merged into the same `mountain` cohort before rarity is computed, so a run naturally reaches Core-tier depth only if the player actually knows something obscure, not because a separate tiny pool trivially maxes out.

**3.4 Wrong or unrecognized answers get a free retry within the 30s window.** Because prompts are open-category, a "wrong" answer usually just means "not recognized," not "incorrect." On an unmatched submission: clear the input, show a brief inline hint, do **not** advance the round, and do **not** penalize. Only a timeout locks in 0 points/0 depth for that round. (Decision, not in the original brief — needed for the loop to feel fair given open-category prompts.) v1.1 distinguishes the hint: a real place that doesn't fit the modifier says so ("Egypt isn't in Southeast Asia — try another"); an unknown string says "not recognized". v1.2 adds a third case: a real place from a *different category* is named as such — "Estonia is a country — this round wants a capital city" (`elsewhere` on the unrecognized result) — because a player answered a capitals-round flag prompt with the country. The previous round's result line (place, views, points, depth dug) stays on screen beside the new prompt until the player's next submission (v1.1) — it is not cleared when the round advances.

**3.5 Duplicate answers within one run are rejected, not scored.** Track canonical-form answers already accepted this run. Resubmitting one (e.g., answering "Egypt" for two different Africa prompts in the same run) is treated like an unmatched answer per 3.4: free retry, no penalty, no advance. This forces genuine recall breadth across a run instead of one lucky rare answer repeated.

**3.6 Spelling (superseded in v1.1).** v1.0 enforced US spelling by omission — British variants were never aliases, so they failed to match. v1.1 adds spelling correction (3.7), under which "Harbour" is one edit from "Harbor" and is *accepted with the US spelling shown*. Alias tables are still curated with US spellings only; there is still no British→US normalization step.

**3.7 Answer normalization and matching passes.** Normalization (applies before any lookup): NFD-decompose and strip diacritics; lowercase; trim; collapse internal whitespace to single spaces; strip periods, commas, apostrophes and parentheses (the Hawaiian ʻokina is an apostrophe: "Kaneʻohe" is "Kaneohe"; "Syracuse (Sicily)", "Syracuse, Sicily" and "Syracuse Sicily" are one string, v1.4); a hyphen or dash (`-`/`–`/`—`) is a space, so "Saint-Ouen-sur-Seine" and "Saint Ouen sur Seine" are one name and the "St" in a hyphenated name is filler like any other (v1.3, 2026-09-17). "St. Lucia," "st lucia," and "St Lucia" all normalize to `st lucia`. Matching then runs three passes, cheapest first (v1.1):

1. **exact** — the normalized input is a known name or alias;
2. **loose** — the same with geographic filler words removed on both sides (`mount, mt, lake, loch, river, sea, island, isle, desert, the, of, city, saint, st, …`), so "Everest" finds "Mount Everest", "Kitts and Nevis" finds "Saint Kitts and Nevis", and "Mount Denali" finds "Denali" (v1.2: the typed side is stripped and tried against the exact names too). A loose form that two entries share goes to the one whose *name* produces it ("Arabian" is the Arabian Sea even though the Persian Gulf carries the alias "Arabian Gulf"; v1.2); two names, or two aliases with no name behind either, identify neither, and the validator refuses the second kind so it cannot ship;
3. **fuzzy** — the single closest name/alias by Damerau–Levenshtein distance within a length-scaled budget: 0 edits for inputs of 4 characters or fewer, 1 for 5–7, 2 for 8–11, 3 beyond. If two different entries tie for closest, the input is rejected rather than guessed. A fuzzy hit is reported as a *correction* and the UI shows `typed → Real Name`. **An exact or loose hit anywhere beats a fuzzy correction** (v1.2): on a narrowed prompt the subset lookup is consulted first, so before a correction is accepted the whole category is checked exactly — "Australia" on a Europe round is Australia (out of scope), not a typo for Austria — and so are the other categories ("Samoa" on a river round is the island, not a typo for Samos). Normalization also folds the letters NFD leaves alone (ø→o, æ→ae, œ→oe, ł→l, ß→ss, đ/ð→d), so "Møn" is found (v1.2).

**The edit budget comes from the name proper** (v1.3, 2026-09-15): the slack is computed from the typed answer with its generic words stripped, and each candidate is compared both as typed and filler-stripped on both sides. So "Lake Tåkern" gets the one edit of "Tåkern", not the two of "Lake Tåkern", and is refused rather than corrected to Lake Vänern; "Sinú River" is refused rather than corrected to the Min River; "Mount Kilimanjro" still corrects, and so now does "Kilimanjro" against "Mount Kilimanjaro" and "Mount Denalli" against "Denali". Two refinements from the same day's audit: a hit on the whole string beats a hit on a stripped form at the same distance ("Lotse" is Lhotse, not a tie with Lose Hill's "lose"), and a generic word the player typed that the candidate also carries is worth one edit even for a four-letter name ("Mount Fugi" is Mount Fuji, "Blak Sea" is the Black Sea; three-letter names still get nothing). The cross-category nudge (3.4) compares whole names only, so "Nigera" on a country round is a refused Nigeria/Niger tie, not "Niger River is a river". `rio` joined the filler list ("Rio Sinú" finds Sinú with no alias) but stays a letter for the letter rules where it is the name (the Rio Grande starts with R), and an alias that is only the name with generic words added ("Rio Bogotá") no longer counts as a spelling for them (Bogotá does not start with R). Measured on a synthetic corpus of 4,700 typos over the 9,300-place bank: 34 wrong-place corrections removed, ~900 corrections gained (typed filler against a row with its own generic word), 103 corrections moved from a wrong place to the right one, 11 lost (all three-letter cores).

**A generic word belongs to a category** (v1.3, 2026-09-16): every cohort's lookup knows its category, and the loose pass drops a generic word only when it is that category's own word (lake/loch/lough/llyn/reservoir for lakes — loch and lough for seas too, a sea loch being a loch, mount/mt/mountain/peak/hill for mountains, river/rio for rivers, sea/ocean/gulf/bay for seas, island(s)/isle(s)/atoll for islands, desert, and city for cities and capitals alike) or nobody's (the, of, saint, st, cape). "Lake Michigan" on a river round is therefore not Michigan River, "Rapid City" is not Rapid River, "Mount Foraker" is not Foraker River and "Gulf of Mexico" on a country round is not Mexico — each is a real place elsewhere and gets the cross-category nudge (3.4) instead of 950 points for the wrong one. When such a word is present the fuzzy pass compares whole strings only. The same rule stops another cohort's loose form from blocking an in-category correction: "Lake Meade" on a lake round is Lake Mead even though a river is called Meade, and "Mackinaw Island" is Mackinac Island whatever Mackinaw City is called. Lookups built without a category (tests, tools) keep every generic word optional. Measured over the 12,008-place bank, every entry name typed on every other category's round: 1,096 wrong-place acceptances became nudges (New York City was New York Mountain on a mountain round, Kansas City the Kansas River, Salt Lake City the Salt River, Solomon Islands the Solomon Sea, Mexico City the country Mexico or the Gulf of Mexico) and nothing else changed. **A typed plural of a name that ends in a generic word is refused, never corrected**: "Great Lakes" is not Great Lake (Tasmania), "Bear Lakes" is not Bear Lake, and "Great Salt Lakes" is not Great Salt Plains Lake either — the input is refused outright, not handed to the next place within budget (the first cut did that, and "Irelands" became Iceland). A plural of any other name is an ordinary typo ("Irelands" is Ireland); "Loch Nesss" is a typo too, since nothing ending in s takes a plural s. Three refinements from the same day's gameplay audit: normalization folds a leading or inner "Mt" to "Mount", so "Mt Vernon" is Mount Vernon on a city round (where "mt" is a mountain's word) and "Mt Blanc" reaches Mont Blanc's "Mount Blanc" alias; a place named elsewhere under the *same name* as the corrected entry does not block the correction ("Solomon Island" on a country round is the Solomon Islands, the island cohort notwithstanding); and a place named elsewhere whose name is also a name in the round's cohort is that cohort's entry, shown as a correction ("Madagascar Island" → Madagascar on a country round, "Singapore City" → Singapore) — exact and loose hits only, so a refused tie ("Nigera") stays refused. Letter rules keep the 0.6 bar (`MAX_ELIGIBLE_SHARE_LETTER`): at 0.7 "with an A in it" (66% of the rivers) would draw and narrow nothing.

**Namesakes** (v1.4, 2026-09-18, decision 5 of the expansion): a cohort may hold several entries with one bare name when each carries a `qualifier` (Section 4) — Syracuse (New York) and Syracuse (Sicily), Portland (Oregon) and Portland (Maine), three Black Lakes. The name stays bare everywhere a name is looked at (the letter and length rules, the loose index, the typed bare form); the qualifier is what the summary, the review and a refusal show, and what a player may type to be exact. The lookup therefore maps a key to a *list* of entries, most-viewed first, and since a prompt's lookup is built over the entries in its scope, **the round's scope picks the namesake**: a bare "Syracuse" on "Name a city in Europe" is the Sicilian one, accepted silently; on a plain "Name a city" it is the most-viewed one (the conservative score — no free jackpot from an ambiguous typing), and a second "Syracuse" in the same run is the other one, then a duplicate; on a round no namesake fits it is wrong-scope on the most famous, shown with its qualifier ("Syracuse (New York) isn't in Africa"). The exact qualified forms are "Name Qualifier", "Name, Qualifier" and "Name (Qualifier)" (one key after normalization) plus the postal code for a US state ("Portland OR", "Portland, ME"); nothing else is abbreviated. The qualified forms are exact only, never fuzzy candidates (a long key buys a long edit budget that corrected the *name* away — "Barren Island, New York" had become Green Island (New York) — and a postal code is within budget of any other two letters), and a hit through one reports the bare name as the spelling matched, so "Sale, Greater Manchester" is a four-letter name to a length rule. A loose form several *names* share goes to the list of them the same way — the namesakes ("Black" is the Black Lakes), and also Lake Geneva beside Geneva Lake, Mount Wilson beside Wilson Peak: the most-viewed in scope answers, where before v1.4 the form identified nobody and the fold refused the second name outright (two aliases with no name behind either still fail validation). An alias-holder with three times the views of every name-holder joins that list and leads it (`LOOSE_ALIAS_FAME_RATIO`): "Cook" is Aoraki (alias "Mount Cook") before Mount Cook (Canada), "San Antonio" is Mount Baldy before San Antonio Mountain; the Persian Gulf's "Arabian Gulf", at 1.6× the Arabian Sea, still does not take "Arabian". The fuzzy pass treats one spelling held by several namesakes as one candidate, not a tie ("Syracuze" corrects to Syracuse and the scope pick follows); a tie between *different* names stays refused. **One guard for cross-cohort fame** (`NAMESAKE_FAME_RATIO = 3` in `run.js`): when a qualified *city* is reached by its bare name and the same exact name is held in the capital, country or island cohort by an entry with three times the monthly views of the name's most-viewed holder in the city cohort, the answer is the nudge, not the score — "Athens" on a city round is "Athens is a capital city" (the capital has 4.8× the views of Athens, Georgia, which is why the ratio is 3), "Greece" is "Greece is a country", "Manhattan" is "Manhattan is an island", and Athens (Georgia) wants "Athens, Georgia" or "Athens GA"; "Victoria" scores Victoria (British Columbia) because the Seychelles capital is the less-viewed one. The comparison is against the cohort's best holder of the name, not the entry the typing settled on: a second "Boston" in a run settles on Boston (Lincolnshire), and the capital Boston is the very place the first "Boston" scored, so the second is the Lincolnshire one. The guard runs on every round except a region round whose region the famous holder does not carry — "Boston" on "Name a city in Europe" is Boston (Lincolnshire), accepted, not "Boston is a capital city", while "Athens" on "starts with A" is still the capital's nudge (the famous name fits a letter round as well as the namesake does) — and the nudge comes first even when the typing is a typo of something in scope ("Dublin" beside Lublin). A *qualified* typing on another cohort's round names that one place: "Athens, Georgia" on a capital round is "Athens (Georgia) is a non-capital city", never the capital scored as a correction. Only a city is second-guessed this way: a player who types "Saint Paul" on a river round means the river, whatever the capital's fame, and the round's category settles it. What is deliberately *not* done: scoring the rarest in-scope namesake on an ambiguous typing (it rewards a name the player may not have meant), and correcting across namesakes by edit distance.

Substring matching is never performed.

**3.8 Prompt draw algorithm (15 prompts per run, v1.2):** shuffle the 9 categories (8 before the city category, v1.2); the first two become the **opening** — two distinct categories, always plain (no modifier) (`OPENING_ROUNDS = 2`; three until 2026-09-12). Shuffle a second copy and keep the first `ROUNDS_PER_RUN − 9 = 6` of it, then shuffle the remaining 7 + 6 = 13 slots after the opening. Every category still appears at least once and at most twice per run (six of the nine twice). For rounds 3–15 the chance of a modifier ramps linearly from 70% to 100% (v1.2; v1.1 was 40%→90%), so in practice about 11.4 of the 15 rounds are conditional; the modifier is drawn from those available to the category (3.1a). **No two rounds may show identical prompt text**: a slot whose text would repeat an earlier one is re-drawn (a category's second appearance therefore always reads differently from its first), falling back to a letter rule if needed. Region scoping is only offered for regions carrying ≥6 countries.

**3.9 Depth is cumulative across the run; strata are fixed bands over total depth, not per-round tiers.** See Section 5.2 — this is what makes "Depth strata across the 15-round range" literal: a run's total accumulated depth (0 up to a max of 1,500 units, v1.2) is what determines which of the 7 named strata the worm is currently shown in, round by round.

**3.10 Scoring constants are tunable but must ship with these defaults** (Section 5.1): `POINTS_MIN = 50`, `POINTS_MAX = 1000`, `POINTS_GAMMA = 1.4`, `POINTS_JACKPOT = 950` (v1.2), `ROUNDS_PER_RUN = 15`; and for dig distance (v1.2) `DIG_SCALE = 70`, `JACKPOT_RARITY = 0.85`, `DIG_JACKPOT = 75`, `PERFECT_RARITY = 0.995`, `DIG_PERFECT = 100`, so `MAX_DIG_PER_ROUND = 100` and `TOTAL_DEPTH_BUDGET = 1500`. (v1.0–1.1 had `TOTAL_DEPTH_BUDGET = 700` and a linear dig of `rarity × 46.667`.) All in `src/js/rarity.js`.

**3.11 A zero-dig answer must still complete the round (v1.1).** The most-viewed entry in a cohort has rarity exactly 0 and digs 0. The dig animation must treat "no distance to cover" as a dive that plays out in place and then reports arrival; it must never wait for the depth to change. (Regression: `everest` and `caspian` froze the game.)

**3.12 "One in Wormillion" (v1.2).** An accepted answer with rarity ≥ 0.85 (`JACKPOT_RARITY`, owned by `src/js/rarity.js`) is bonused — it digs a flat 75 and pays a flat 950 points, or 100 and 1000 if it reads as 100% (5.1) — digs a **crater** rather than a tunnel (radius 11 art px instead of 6, or 14 for a 100% answer, blending in and out over 6 depth units, with more dirt thrown and a harder landing shake; `TUNNEL_R_BY_TIER` in `worldRender.js`) and puts a celebration over the scene: the words ONE IN WORMILLION slam in over the dig, with pixel confetti and lightning bolts thrown out from the text. It holds for 10 seconds (`HOLD_SECONDS`) or until the player submits their next answer — accepted or not — whichever is first, and is cleared when a new run starts. The dig animation and round flow continue underneath it; it never blocks input. Under `prefers-reduced-motion` the text appears without anything moving. Roughly the rarest 5–15% of each cohort qualifies (28 countries, 3 seas, 4 islands at v1.2).

**3.13 The summary ladder (v1.2).** The run summary lists the round results **from least to most obscure**, not in round order: `summary.ladder` (`run.js`, `rankByRarity`) is the results sorted by rarity ascending, misses first (they dug nothing), ties in round order, so the rarest thing the player knew is the last line. Each row shows the place, a bar whose length is its obscurity, the percentage, and the points; rows at or above the jackpot bar are marked ★ in amber, and a 100% row in white. `summary.rounds` keeps round order and is what history records (Section 9) — nothing new is stored.

**3.14 "0% obscurity? Dig deeper next time" (v1.2).** The opposite of 3.12. An accepted answer whose rarity reads as 0% on screen (`rarity < DUD_RARITY = 0.005`, `rarity.isDud`; the mirror of `PERFECT_RARITY`) is mocked rather than celebrated: the words 0% OBSCURITY? / DIG DEEPER / NEXT TIME flop into the lower part of the scene in a sickly green, and blood, muck and bile drip from the letters — stretching, letting go and falling — with flies buzzing around the words and sick wisps rising (`src/js/dud.js`, canvas only, same contract as `jackpot.js`). The worm goes **rotten** for the same spell: grey-green and mottled, eyes half shut, a drool, three flies at its head (`renderer.setRotten`, cosmetic only — it digs exactly the same, and `reset()` clears it). Held for 10 s (`HOLD_SECONDS` in `dud.js`) or until the next submitted answer, cleared on a new run; the words sit low so the worm stays visible. Scoring is untouched: a dud still pays `POINTS_MIN` and digs nothing extra. Under `prefers-reduced-motion` the words appear without anything dripping and the flies hold still. `__wormillion.shame()` fires it from `?debug`.

**3.15 Two ways to dig: today's and endless (v1.3).** The title screen offers **Today's dig** and **Endless**. They differ in exactly one thing — where the slot draw's randomness comes from. A daily run draws its fifteen slots with a PRNG seeded from the player's local calendar date (`src/js/seed.js`: cyrb53 hash of `wormillion-daily:YYYY-MM-DD` into mulberry32; `run.createRun(bank, { mode: 'daily' })`), so everyone who plays that day gets the same fifteen prompts in the same order; it turns over at local midnight, like every other -dle. An endless run draws fresh with `Math.random` every time and can be played all day; it is what the game was before v1.3. Scoring, matching, the ramp, the jackpot and the dud are identical in both. **The daily is one dig per day**: the run is stored with `mode: 'daily'` and its `dailyKey` (Section 9), and while `persistence.dailyResult(today)` finds one the title button reads "Today's dig — done" with the score and stratum underneath, `startRun('daily')` refuses, and the summary's button becomes "Keep digging — endless". The statusline and the summary carry a mode chip ("Today's dig · Sep 12" / "Endless"); history rows say "Daily · Sep 12". `?daily` on the URL — the link an aggregator gets — goes straight into today's dig, or to the title showing the result if it's done. Best dive and stats span both modes. The seeded sequence for 2026-09-12 is pinned in `tests/seed.test.js`: a change to the hash, the generator or the namespace changes every past daily, so bump `DAILY_NAMESPACE` deliberately rather than reseed by accident. Note that the daily is *the draw*, not the bank: a data push mid-day changes what a slot's text or lookup contains for anyone who has not yet played, and a change to `drawSlots` or to the order of `CATEGORIES`/themes/regions changes the day's draw outright. Everything else random (dirt, relics, confetti) stays on `Math.random`.

**3.16 The -dle kit around the daily (v1.3).** Everything a daily-puzzle listing expects, all client-side, nothing stored beyond localStorage. *Puzzle number:* `seed.dailyNumber(key)` counts `DAILY_EPOCH = 2026-09-12` as #1; it appears on the mode chip ("Dig #2 · Sep 13"), the title button, the share text and history rows, which name a daily by its puzzle day rather than the record's timestamp. *Share:* `src/js/share.js` (pure) builds the text — `Wormillion #2 · 4,238 pts · Bedrock`, then one emoji per round **in round order** (everyone had the same order, so the grids compare square by square: ⬜ miss · 💀 0% · 🟫 <25% · 🟧 <50% · 🟨 <70% · 🟩 <85% · ⭐ jackpot · 💎 100%), then `352 deep · 30% avg obscurity`, then the link (this host's address on http(s), `CANONICAL_URL` — the GitHub Pages URL — on `file://` and in the bundle; `?daily` appended for a daily). Share buttons on the summary (either mode) and the locked title; clipboard, with a textarea fallback and a `prompt()` as the last resort. *Average obscurity:* `persistence.averageRarity(record)` is the mean rarity over the fifteen rounds with a miss as 0; it is on the summary's sub-line and in the daily stats, and is the number a later "compared to others today" would post. *Streak:* `persistence.dailyStreak(today)` — `current` is the run of consecutive puzzle days ending today or yesterday (today unplayed does not break it until the day is actually missed), `best` the longest ever; shown on the locked title ("· 3-day streak", from two days) and the stats screen. *Countdown:* "Next dig in 06:12:33" on the locked title, from `seed.msUntilNextDaily()`, ticking only while that screen is up; at midnight the key changes and the title refreshes itself, unlocked. *Daily stats:* a "Daily digs" block on the stats screen — Played · Streak · Best streak · Avg score · Best daily · Avg obscurity — and a bar per stratum for where the dailies ended (today's highlighted), the -dle guess-distribution shape; the old numbers sit under "All dives". *Review:* `run.reviewRun(bank, slots, rounds)` / `run.review()` list every prompt in round order with the answer given (and its obscurity, or "missed") and `run.rarestFor(prompt)` — the most obscure entry the prompt accepts, with its views — marking "★ You found the rarest answer there was" when the player's answer is as obscure as it gets. A past daily is reviewed by regenerating its slots from its key and reading its stored `rounds`; the live run (either mode) from its results. Review buttons: on the summary, beside Share on the locked title, and on each daily row of the history. To make all this possible a record now stores `rounds` — `[{a: name, r: rarity} | null]` in round order, prompts *not* included — and **dailies are exempt from the 50-record cap** (`persistence.trim`): only endless runs are trimmed, so streaks, stats and review reach every daily ever played (~200 KB a year against a 5 MB quota). A daily's record also stores `draw`, the fingerprint (`seed.fingerprint`, eight hex digits of the cyrb53 hash) of its fifteen prompt texts; a review whose regenerated draw no longer matches shows the answers under "The prompts have changed since this dig" rather than against the wrong questions, and `tests/prompts.test.js` pins dig #1's fifteen prompts so a change to the draw is a red test. On a length prompt the reveal is the entry's name, which the prompt accepts since the generic word is trimmed before counting (3.1a) — or an alias where only that fits ("Mount Kilimanjaro" for a long name); "found the rarest" is judged at the four decimal places a record stores.

**3.17 The daily comparison (v1.3).** After a daily, "Better than 62% of 143 diggers today — 4,238 pts vs. a median of 3,600 · avg obscurity 41% vs. 36%", plus the round most diggers missed and the rarest find of the day; the same block on the locked title. Dailies only: endless draws differ per player, so there is nothing to compare. It is the first thing in the game that needs a server, and it is strictly optional: on `file://`, in the bundle, offline, or on a host without the functions, the block simply never appears. *Server:* two Netlify Functions over Netlify Blobs (store `daily`), thin around `netlify/functions/lib/daily.js`, which is pure and tested with an in-memory store. **A player submits only their fifteen answers** (`{ day, playerId, rounds: (name|null)[15], draw }`); the server regenerates the day's prompts from the key, replays the answers through the real engine (`replayRun`: scopes, duplicates, length rules — and an entry's other spellings when only a length rule objects, since the client stores the name but the player may have typed "Mount Kilimanjaro") and computes score, depth and rarity itself, so a forged score would need fifteen genuinely obscure answers. Storage: `submissions/<day>/<playerId>` written `onlyIfNew` (one per player per day; a repeat is a harmless duplicate), and `days/<day>` — the aggregate the stats endpoint serves: count, score histogram (100-point buckets), average-obscurity histogram (1% buckets), per-round answered / missed / jackpots / duds / best answer, the day's `draw` — updated with `onlyIfMatch` on the etag and retried, and rebuildable from the submissions (`rebuild`). A day is open from the day before it starts (UTC+14) until two days after; a submission for a closed day is 409 `closed`, a stale client's draw fingerprint 409 `draw-mismatch`, a bad shape or an answer the prompt wouldn't take 400 with the round number. `GET daily-stats?day=` returns the aggregate plus the prompts, cached for a minute. CORS admits the GitHub Pages origin and the dev server, so every host shares one store; `npm start` mounts the same API over a memory store. *Client:* `src/js/compare.js` (pure) — `apiBase()` is same-origin on Netlify and `npm start`, `REMOTE_API` for the Pages copy (unset, it shows nothing rather than 404), nothing on `file://`; `betterThan()` is the share of diggers in buckets strictly below yours, you counted in the total; ties are not "better than"; alone, "You're the first to dig today". `ui.compareDaily` submits once, fetches, caches the stats (`persistence.saveComparison`) and skips the network while they are under a minute old. *Identity:* `persistence.playerId()`, a random id made once per browser — no name, nothing personal, it only stops one browser counting twice; clearing the browser makes a new digger, the same limit the daily lock has. Nothing else is stored: no IP, no time zone, no history beyond the fifteen names. *Dependency:* `@netlify/blobs`, for the functions only; `src/` stays dependency-free and CI runs without an install.

## 4. Data model

Every prompt-bank entry, across all 9 category files, shares this shape:

```jsonc
{
  "id": "country-egypt",            // unique, stable, kebab-case: "<category>-<slug>"
  "category": "country",             // one of the 9 category keys (Section 6)
  "name": "Egypt",                   // canonical display/accepted answer
  "aliases": [],                     // additional accepted strings, US-spelling only
  "qualifier": "Sicily",             // optional (v1.4): tells this entry apart from a namesake in its cohort; shown as "Syracuse (Sicily)"; the id carries it
  "magnitude": 162000,               // SCORING stat (Section 5.1): typical monthly Wikipedia pageviews; must be > 0
  "magnitudeUnit": "pageviews_monthly",
  "wikiTitle": "Egypt",              // the article the pageviews came from
  "lat": 27, "lon": 30,              // article coordinates, when the article has them
  "size": 112716598,                 // the physical stat: population | area (km2) | length (km) | elevation (m)
  "sizeRange": [2824, 4444],         // optional, [lo, hi] where sources disagree; size === lo; either end satisfies a threshold
  "sizeUnit": "population",          // population | population_of_country | area_km2 | length_km | elevation_m
  "region": ["Africa", "North Africa"], // country/capital/city only: continent + optional sub-region tags
  "country": "France",               // capital/city only: the country row the entry inherits region and flag from
  "oceans": ["Pacific"],             // island/sea_ocean only: Pacific | Atlantic | Indian | Arctic | Southern; [] only by explicit override
  "flag": ["red", "white", "black", "yellow"], // country (and, inherited, capital/city): colours on the flag, from a fixed palette (3.1a); read generously
  "source": "..."                    // provenance note, not shown in-game
}
```

`magnitude` is the median of 60 daily English-Wikipedia view counts, scaled to a 30.44-day month, fetched by `scripts/fetch-pageviews.mjs` and committed as `src/data/pageviews.json` (the game never touches the network). `oceans` is derived from `lat`/`lon` by `scripts/data-oceans.mjs` with an explicit override table; the validator rejects any island or sea with no ocean and no override. The page loads `src/data/bank.js`, a generated `<script>` bundle carrying only the runtime fields (`id, category, name, aliases, qualifier, magnitude, size, region, oceans, flag`). `flag` is authored by hand in `scripts/data-flags.mjs`, one row per country, and the build fails if any country lacks a row or any row names no country (v1.2).

- `region` is present only on `country`, `capital` and `city` entries (all keyed off the same country list — a capital or city entry inherits its country's region tags). A capital's `magnitude` is its **own** article's pageviews (v1.1), not its country's; its `size` is the country population.
- `aliases` must never contain a string that would also match a *different* entry's canonical name in the same category (validated by the M5 validation script — see Section 6.4) — except between **namesakes** (v1.4): entries of one cohort may share a name (or an alias may equal a namesake's name) when at most one of them lacks a `qualifier` and no two qualifiers agree. The qualifier is authored in the name column as `Name (Qualifier)` (`scripts/data-physical.mjs`, `scripts/data-cities.mjs`); the build splits it off, keeps `name` bare, and forms the id as `<category>-<name>-<qualifier>` (`scripts/expansion/qualify.mjs` renames an existing row into its qualified form and moves everything keyed by its id). Every namesake carries a qualifier except that a bare-titled incumbent that is the most-viewed holder may stay the one unqualified entry (the Thames beside Thames (Connecticut); 47 sets do) — a bare name has at most one such holder. A qualifier whose generated form is another entry's name is refused ("Little (Arkansas)" would take "little arkansas" from the Little Arkansas River; that row is Little (St. Francis)). A qualified entry's article is always named in `WIKI_TITLES` (its bare name is some other article). `themes.js` lists a namesake as `Name (Qualifier)`; a bare name that several places share names the one holder without a qualifier (the Thames, beside Thames (Connecticut)) and fails validation when every holder has one.
- `magnitude` must be strictly positive; an entry whose article returns no pageviews is a build error, never a zero (a zero would score as maximally obscure). `size` is `>= 0`: **0 means "no sourced figure anywhere"** (v1.3, 2026-09-16 — most bays, straits and small islands have no area in any reference), and such an entry never answers a size-threshold prompt (`satisfiesSize`) but is a normal answer to every other prompt. A figure is never invented to fill the field.

Category cohort membership for rarity purposes (Section 5.1) is: all entries sharing the same `category` value, loaded and combined at runtime from however many source files feed that category (e.g. `mountains.json` + `minor-peaks.json` both feed the `mountain` cohort — Section 3.3).

## 5. Core algorithms

### 5.1 Rarity, points, and per-round dig distance

For a category cohort `C` with entries `e₁…eₙ`, each with `magnitude M(e) > 0`:

```
L(e)   = log10(M(e))
Lmin   = min(L(e)) over C
Lmax   = max(L(e)) over C

rarity(e) = clamp( (Lmax − L(e)) / (Lmax − Lmin), 0, 1 )
          = 1.0 if Lmax === Lmin (degenerate single-value cohort)

points(e) = POINTS_MAX (1000)          if rarity(e) ≥ PERFECT_RARITY
          = POINTS_JACKPOT (950)       if rarity(e) ≥ JACKPOT_RARITY   (v1.2: the jackpot tier pays flat, like the dig)
          = round( POINTS_MIN + (POINTS_MAX − POINTS_MIN) × rarity(e) ^ POINTS_GAMMA )   otherwise (807 just under the bar)

dig(e)    = DIG_PERFECT (100)          if rarity(e) ≥ PERFECT_RARITY (0.995 — reads as 100% on screen)
          = DIG_JACKPOT (75)           if rarity(e) ≥ JACKPOT_RARITY (0.85 — "one in Wormillion", 3.12)
          = rarity(e) × DIG_SCALE (70) otherwise
```

`rarity` is 1.0 for the smallest-magnitude entry in its cohort (rarest/most obscure) and 0.0 for the largest (most common/famous). With magnitude = monthly pageviews (v1.1) this is a direct measure of how often people look a place up, so it holds by construction; v1.0's physical stats only correlated with fame and produced wrong answers at the edges (Vatican City "rarest" by population, Malawi "famous" by population). A modifier (3.1a) never changes the cohort used here.

**Worked examples** (illustrative population figures from v1.0; the formula is unchanged by the switch to pageviews, so these remain a correctness check for the arithmetic, not shipped data):

- Country cohort spans roughly Vatican City (~800 people, `L≈2.90`) to India (~1.4B, `L≈9.15`), so `Lmax−Lmin ≈ 6.25`.
- **Tuvalu**, population ≈ 11,000, `L ≈ 4.04`: `rarity = (9.15−4.04)/6.25 ≈ 0.818` → `points = round(50 + 950 × 0.818^1.4) = round(50 + 950 × 0.767) ≈ 778` → `dig ≈ 0.818 × 70 ≈ 57.3` (just under the jackpot bar; at 0.85 it would jump to 75).
- **United States**, population ≈ 335M, `L ≈ 8.53`: `rarity = (9.15−8.53)/6.25 ≈ 0.10` → `points = round(50 + 950 × 0.10^1.4) ≈ 88` → `dig ≈ 7.0`.

A timeout, or a round where no answer was accepted (Section 3.4/3.5 always retry to either a match or a timeout — there is no other terminal state), scores `points = 0, dig = 0` for that round.

### 5.2 Cumulative depth and strata

```
D₀ = 0
Dₖ = Dₖ₋₁ + dig(eₖ)     for round k = 1..15 (dig = 0 on a timed-out round)
```

`TOTAL_DEPTH_BUDGET = 1500` is `15 × DIG_PERFECT`, the deepest a run can possibly go (v1.2; it was 700, landing a perfect run exactly on Core). The 7 strata are fixed, equal-width 100-unit bands and were deliberately **not** rescaled with the budget: the point of the v1.2 curve is that a run digs deeper through the same earth, so Core (600) is now reached by eight jackpot answers, or a run of consistently obscure ones, rather than by perfection. A run of bank-median answers ends around 570 (Mantle); it used to end around 325 (Bedrock).

| Stratum | Depth range |
|---|---|
| Topsoil | `[0, 100)` |
| Subsoil | `[100, 200)` |
| Clay | `[200, 300)` |
| Bedrock | `[300, 400)` |
| Deep Rock | `[400, 500)` |
| Mantle | `[500, 600)` |
| Core | `[600, ∞)` (the scene extends to `TOTAL_DEPTH_BUDGET + 30` for headroom; there is no gameplay effect of going deeper into Core, it's just "deep in Core") |

The worm's displayed position after round `k` is whichever band contains `Dₖ`. A run's "deepest stratum reached" (shown in the summary and tracked in history, Section 7) is whichever band contains `D₁₅` (the final cumulative depth), or the deepest band touched at any point if you want digging back up to read as "reached," not "ended at" — **v1 uses final depth, not max depth, for simplicity**; note this explicitly rather than leaving it ambiguous.

### 5.3 Answer matching

Given raw player input and the current prompt's category cohort:

1. Normalize the input per rule 3.7.
2. Normalize every candidate string (each entry's `name` plus its `aliases`) the same way, once, at data-load time (not per keystroke), and build the loose-form and fuzzy indexes alongside.
3. Look the input up in the lookup built for the current **prompt** (the cohort narrowed by the prompt's modifier, if any): exact, then loose, then fuzzy (3.7). A key held by several namesakes settles on the first (most-viewed) one not yet in `usedAnswers` (v1.4).
4. If found and `entryId` is not already in this run's `usedAnswers` set: accept (reporting a correction if the fuzzy pass matched) — add to `usedAnswers`, compute points/dig against the **whole** cohort (5.1, 3.2), advance to the next round. The round's record stores the entry's display name, `Name (Qualifier)` for a namesake, so the daily replay lands on the same entry (v1.4).
5. If found but already in `usedAnswers`: reject as duplicate (3.5) — free retry, no advance.
6. If not found in the prompt's lookup but found in the whole cohort's: reject as **wrong-scope** with the modifier named — free retry, no advance.
7. If not found at all: reject as unrecognized (3.4) — free retry, no advance.
8. On timeout with no accepted answer this round: lock in 0/0, advance.

## 6. Content bank: categories, targets, and sourcing rules

Nine categories (eight at v1.0–1.1; `city` added v1.2), each a JSON file under `src/data/` (schema: Section 4), each prompt rendered with fixed copy (no per-entry prompt text — the category alone determines the sentence):

Scoring magnitude for every category is monthly Wikipedia pageviews (Section 4). The "size stat" column is the physical figure kept as `size`, used by size-threshold prompts (3.1a). Plain prompts are shown; modifiers (3.1a) vary the wording.

| Category key | Plain prompt | Target entry count | v1.1 count | Size stat |
|---|---|---|---|---|
| `country` | "Name a country." | ~195 (all UN-recognized + commonly-taught non-UN states) | 197 | population |
| `capital` | "Name a capital city." | ~195 (one per country above) | 197 + 50 US state capitals (`us-state-capitals.json` feeds the same cohort, v1.2) | population *of the country* (`population_of_country`; the US population for a state capital) |
| `city` (v1.2) | "Name a city that isn't a national capital." | 150+ | see `cities.json` | population of the city proper |
| `lake` | "Name a lake." | 70–100 | 119 | surface area (km²) |
| `river` | "Name a river." | 70–100 | 130 | length (km) |
| `mountain` | "Name a mountain." | 60–90 well-known peaks | 125 | elevation (m) |
| *(feeds `mountain` cohort)* | *(same prompt as above)* | 40–60 real, obscure minor peaks/hills | 62 | elevation (m) |
| `desert` | "Name a desert." | 30–45 | 58 | area (km²) |
| `island` | "Name an island." | 70–100 | 354 (incl. archipelagos people name as islands: Seychelles, Maldives, Canaries…, and every island nation that is one island or one compact archipelago: Palau, Samoa, Tonga, Bahamas, Grenada…) | area (km²) |
| `sea_ocean` | "Name a sea or ocean." | 60–75 (5 oceans + named seas) | 95 | area (km²) |

**Region list for country prompts (3.8):** `Africa`, `Asia`, `Europe`, `North America`, `South America`, `Oceania` (continent-level, always usable) plus sub-regions used only when they have ≥6 tagged countries: `West Africa`, `East Africa`, `North Africa`, `Southern Africa`, `Middle East`, `South Asia`, `Southeast Asia`, `East Asia`, `Central Asia`, `Caribbean`, `Central America`, `Eastern Europe`, `Western Europe`, `Scandinavia & the Nordics`. Every country entry carries `region: [continent, ...subregions]`.

**6.0 Themes (v1.1).** `src/data/themes.js` holds hand-curated sets used by the theme modifier, listed by in-game name and resolved at load time: rivers (Mesopotamia, the British Isles, Siberia, continents, India), mountains (the Alps, the Himalayas, the Andes, the Rockies, Scotland, England or Wales, Indonesia, volcanoes), islands (the Caribbean, the Mediterranean, Greece, Hawaii, Scotland, Japan, Indonesia), lakes (saltwater, the Great Lakes, Africa, the Alps, the British Isles, Scandinavia), deserts and seas by continent, and countries (landlocked, island nations, and — derived from landlocked, not listed — coastal), and capitals (v1.2: *not the largest city* — 42 capitals that are not their country's largest city, read generously; *on the coast* — capitals on a sea, bay or open tidal estuary; *US state capitals* — all fifty). A theme with its own prompt text is not a place, so a miss on it gets the generic "doesn't fit this one" hint rather than "isn't in volcanoes". Because a themed prompt *rejects* answers outside its set, sets must be complete for their well-known members; the validator fails on any listed name that is not in the bank. Ocean membership is deliberately **not** a theme — it is derived data (Section 4) so that no island can be left off a list.

**6.0a Cities (v1.2).** The `city` cohort is **non-capital cities**: a city that is its own country's national capital is refused by the build and the validator, and the plain prompt says so ("Name a city that isn't a national capital."). Every narrowed city prompt carries the rule in the sentence, not just in the badge — the category noun is "non-capital city" ("Name a non-capital city in the Caribbean.", "…that starts with M.", "…in a country whose flag has green in it."). This keeps "Name a city" and "Name a capital city" different games; Paris on a city round gets "Paris is a capital city — this round wants a non-capital city." US state capitals that are major cities (Phoenix, Boston, Denver…) *are* cities — the exclusion is national capitals only. A city is authored in `scripts/data-cities.mjs` as `Name|Country|population|aliases`; the country must be a row of `data-countries.mjs`, and the city inherits its region tags and flag colours, so region, flag, size, letter and theme prompts all apply. `size` is the population of the city proper (administrative city), consistently, not the metro area. One curated theme, *the largest city of its country* (Istanbul, Sydney, Mumbai, Lagos, São Paulo, New York…), with the prompt "Name the largest city of a country that isn't its capital." Sourcing rule for the list: the obvious world cities first, then second and third cities of most countries, famous small cities, and real obscure large ones — obscurity is welcome, fabrication is not (6.1).

**6.1 No fabricated place names — hard rule.** Every entry must be a real, currently-recognized place with a real, sourced magnitude figure. Made-up names, jokey placeholders, or "TBD" entries are never committed, not even temporarily — a milestone that isn't ready to add real data for a slot leaves that slot's count lower rather than fill it with a placeholder.

**6.2 Sourcing.** Pageviews come from the Wikipedia action API (`prop=pageviews`, 60 daily counts, median) via `npm run fetch-pageviews`; each entry's Wikipedia article is resolved through redirects, rejected if it is a disambiguation or missing page, and its Wikidata description checked against the category — overrides and hand-verified subjects live in `scripts/data-wiki-titles.mjs`. Physical `size` figures use reputable public reference data (UN/World Bank population, standard physical-geography references). Record provenance in `source` — for maintainers, never rendered. Where a figure varies by source (river length especially), pick one reputable figure and note the caveat; consistency within the dataset matters more than picking the "most correct" of several disputed figures.

**6.3 Transcontinental countries** (Russia, Turkey/Türkiye, Kazakhstan, Egypt, etc.) get whichever single continent tag is the common convention (e.g. Russia → Europe, by population-center/UN-region convention) plus any sub-region tags that apply; don't dual-tag continents, to keep prompt scoping predictable.

**6.4 Validation script (`scripts/validate-data.mjs`, part of M5).** Run as `npm run validate`. Checks, failing the run (non-zero exit) on any violation:
- every entry has all required fields, `magnitude > 0` with unit `pageviews_monthly`, `size >= 0` (0 = unknown) with a known unit, a `wikiTitle`, and a non-empty `category` matching one of the 8 keys;
- no duplicate `id` within a file or across files feeding the same cohort;
- no alias string collides with another entry's normalized name/alias within the same cohort (Section 4), namesakes excepted: a shared key is legal only when at most one holder lacks a `qualifier` and the qualifiers are distinct, and a generated qualified form ("syracuse sicily", "portland or") belongs to its entry alone (v1.4); a loose form two names share is legal (it resolves to the list), two aliases with no name behind either are not;
- every `country`/`capital` entry has a non-empty `region` array using only region names from the list above;
- every `island`/`sea_ocean` entry has an `oceans` array of known oceans, empty only by explicit override (v1.1);
- every `country` entry has a non-empty `flag` array of distinct colours from the palette in `scripts/data-flags.mjs` (v1.2);
- every UN member state, UN observer state and commonly-taught state (`scripts/data-un-members.mjs`) is answerable by name or alias in the country cohort (v1.1);
- every name listed in a theme (`src/data/themes.js`) resolves to exactly one entry in that category (v1.1; a namesake is listed as `Name (Qualifier)`, and a bare shared name is the unqualified holder, v1.4);
- reports final per-category entry counts against the targets table above (warns, doesn't fail, if below target).

Two companion scripts are advisory rather than gating: `npm run gap-check` pushes a list of answers players obviously reach for through the real matcher and fails on any that has nowhere to land; `npm run score-report` prints what the bank does to the scoring curve.

## 7. Repository layout

```
wormillion/
  .github/workflows/
    ci.yml              # run `npm test` + `npm run validate` on push/PR to any branch
    deploy.yml          # on push to main: upload src/ as Pages artifact, deploy
  src/                  # <- this whole folder is the deployed static site, as-is, no build
    index.html
    styles.css
    main.js             # entry point (classic scripts, see note below)
    js/
      rarity.js         # 5.1 + 5.2, pure functions, no DOM
      strata.js         # depth → stratum name/band lookup (5.2 table) + palette
      matching.js       # 3.7 + 5.3: normalization, loose and fuzzy passes, no DOM
      promptBank.js     # cohorts, modifiers (3.1a), the 15-slot draw (3.8), no DOM
      seed.js           # date-seeded rng for the daily (3.15): dailyKey(), dailyRng(); puzzle number + countdown (3.16)
      share.js          # the share text: header, emoji grid, link (3.16)
      compare.js        # the daily comparison, client side: percentiles + wording (3.17)
      run.js            # run/round state machine (current round, score, depth, usedAnswers, mode)
      timer.js          # 30s countdown, pure-ish (callback-based), no DOM assumptions baked in
      persistence.js    # localStorage read/write: best dive + history (Section 9 shape)
      icons.js          # 12x12 pixel category icons, draws to a supplied context
      worldRender.js    # the dig scene incl. the buried relics (RELICS bitmaps); draws to canvases handed in, never touches `document`
      jackpot.js        # the ONE IN WORMILLION confetti/lightning burst (3.12); canvas only, no `document`
      dud.js            # the 0% "dig deeper next time" drips and flies (3.14); canvas only, no `document`
      ui.js             # DOM rendering + event wiring; the only file allowed to touch `document`
    data/
      countries.json … seas-oceans.json, cities.json   # Section 4 schema, generated by scripts/build-data.mjs
      pageviews.json    # the Wikipedia snapshot (views, title, coordinates) the build folds in
      bank.js           # generated <script> bundle of the runtime fields - what the page loads
      themes.js         # hand-curated theme sets (6.0)
  scripts/
    data-countries.mjs, data-physical.mjs   # authoring sources (pipe-delimited)
    data-wiki-titles.mjs  # Wikipedia title overrides + hand-verified subjects
    data-oceans.mjs       # ocean classification boxes + overrides
    data-flags.mjs        # flag colours per country, hand-authored (3.1a)
    data-us-states.mjs    # the 50 US state capitals, feeding the capital cohort (6)
    data-cities.mjs       # non-capital cities, Name|Country|population|aliases; region + flag inherited (6.0a)
    data-un-members.mjs   # the audit list for 6.4
    build-data.mjs        # emits src/data/*; exports buildFiles() for the fetcher
    fetch-pageviews.mjs   # refreshes pageviews.json (network; cached under scripts/.cache/)
    validate-data.mjs     # Section 6.4
    gap-check.mjs, score-report.mjs, bundle.mjs, serve.mjs
    expansion/            # the country-by-country scouring toolkit (v1.3): probe.mjs, article-size.mjs,
                          # chunk.mjs, fold.mjs, drop/add-alias/add-theme/add-oceans/fix-titles/wp-check.mjs;
                          # probes/*.json per country x category; reports/ (one per chunk and per audit);
                          # work/ is gitignored scratch
  netlify/functions/      # the daily comparison (3.17): daily-submit.mjs, daily-stats.mjs, lib/daily.js, lib/netlify.mjs
  netlify.toml            # publish src/, gate on npm test && npm run validate, bundle the two bank files with the functions
  tests/
    rarity.test.js
    matching.test.js
    run.test.js
    prompts.test.js       # modifiers, the draw, ocean/size behaviour
    worldRender.test.js   # dive completion incl. the zero-dig regression (3.11)
    jackpot.test.js       # the burst runs for the hold, stops on demand, respects reduced motion (3.12)
    persistence.test.js
    validate-data.test.js
    seed.test.js, share.test.js, compare.test.js, daily-server.test.js, dud.test.js   # the daily, the -dle kit, the comparison
  package.json          # scripts only: "test", "validate"; no runtime dependencies at all
  README.md
  SPEC.md               # this document
```

`js/ui.js` being the sole DOM-touching module is a hard architectural rule, not a suggestion — it's what keeps `rarity.js`, `matching.js`, `promptBank.js`, `run.js` and even `worldRender.js` (which draws to canvases it is handed) unit-testable with plain `node --test`, no jsdom, no browser needed for the test suite. If a milestone finds itself importing `document` into one of the other modules, that's the signal to stop and restructure before continuing.

**Module format (v1.0 build decision).** Modules are classic scripts using a tiny UMD-style wrapper (`module.exports` under Node, `globalThis.Wormillion.<name>` in the browser) rather than ES modules, and data ships as `data/bank.js` rather than fetched JSON. Browsers block both ES-module loading and `fetch()` on `file://`, and "open `index.html` and play" was the harder requirement. The JSON files remain the validated source of truth.

## 8. Non-functional requirements

- **Zero runtime dependencies, zero build step.** `src/` must run by opening `index.html` directly or serving it with any static file server — no bundler, no transpilation, no `npm install` required to play. `package.json` exists only to name `test`/`validate` scripts that shell out to plain Node (`node --test`, `node scripts/validate-data.mjs`); Node itself is a *dev-time* tool for the test suite, not part of what ships.
- **Browser support:** current two versions of Chrome, Firefox, Safari, Edge, desktop and mobile. Test on at least one real mobile browser before M8 sign-off — this is a phone-shaped game.
- **Accessibility:** the countdown and prompt text update in an `aria-live="polite"` region; the answer input auto-focuses at the start of every round; all interactive elements are reachable and operable by keyboard alone; animations (worm digging, tunnel trail) respect `prefers-reduced-motion` by falling back to an instant position update; text-over-pixel-art contrast meets WCAG AA.
- **Performance:** total page weight on the wire (gzip) should stay under 500 KB — the bank alone is 1.97 MB raw / 277 KB gzip at 14,900 places (v1.3; the v1.0 budget was 1 MB raw at 1,700 places); all data fetches are same-origin `fetch()` calls against the bundled JSON files, no network dependency beyond the initial page load, no external fonts/CDNs required (system font stack is fine, or one self-hosted pixel font).
- **Privacy:** no analytics, no third-party scripts, no accounts. The only persisted data is described in Section 9, and it never leaves the browser.

## 9. Persistence (localStorage)

Single key, `wormillion:v1`, JSON-encoded:

```jsonc
{
  "bestDive": {
    "score": 5230,
    "deepestStratum": "Mantle",
    "finalDepth": 542.3,
    "date": "2026-09-05T18:04:00.000Z"
  },
  "history": [
    { "score": 5230, "deepestStratum": "Mantle", "finalDepth": 542.3, "date": "2026-09-05T18:04:00.000Z" },
    // a daily also carries its mode and key (v1.3); an endless run carries neither, and a
    // record from before v1.3 reads as endless. `rounds` (3.16) is the answer + rarity per
    // round in round order, null for a miss; prompts are not stored (a daily's regenerate)
    { "score": 4238, "deepestStratum": "Bedrock", "finalDepth": 351.5, "date": "2026-09-13T05:39:02.459Z",
      "mode": "daily", "dailyKey": "2026-09-12", "rounds": [{ "a": "Lake Huron", "r": 0.2912 }, null, { "a": "Aldan", "r": 1 }] }
    // most recent last. The cap of 50 applies to ENDLESS runs only, dropping oldest; every
    // daily is kept (3.16)
  ]
}
```

`bestDive` is recomputed as `max(history, key=score)` any time it might be stale, rather than trusted as independently-maintained state — one source of truth. A corrupt or missing key is treated as "no history yet," never as a crash (wrap the read in try/catch, per standard localStorage-is-best-effort practice).

## 10. CI/CD and deployment

- **`ci.yml`:** triggers on push and pull_request to any branch. Steps: checkout, setup-node, `npm test` (runs `node --test tests/`), `npm run validate` (Section 6.4). Both must pass for the workflow to succeed.
- **`deploy.yml`:** triggers on push to `main` only. Steps: checkout, `actions/configure-pages`, `actions/upload-pages-artifact` with `path: src`, `actions/deploy-pages`. Requires the repo's Pages source set to "GitHub Actions" (a one-time repo-settings step, not something the workflow file can do for you — call this out explicitly when M0 is done, since it's a manual click in the GitHub UI the first time).
- Both workflows live from M0 onward; every subsequent milestone's merge to `main` is a real deploy, which is the entire point of doing CI/CD first.

## 11. Milestone plan

Each milestone: **Goal**, **Depends on**, **Blocks**, **Tasks**, **Out of scope** (guardrail against pulling later work forward), **Acceptance criteria**.

### M0 — Repo scaffold + deploy pipeline
- **Goal:** An empty-but-real project where pushing to `main` produces a live, working URL.
- **Depends on:** nothing.
- **Blocks:** M1–M8 (nothing else can ship without a working pipeline).
- **Tasks:** create the folder structure (Section 7); `src/index.html` renders "wormillion" as a placeholder heading, `src/styles.css` and `src/main.js` exist as empty-but-linked stubs; `package.json` with `test`/`validate` scripts pointing at not-yet-existing files is fine to stub as no-ops for now; both workflow files (Section 10); `README.md` with local-dev instructions ("open `src/index.html`," or `npx serve src`) and a note about the one-time Pages-source repo setting.
- **Out of scope:** any game logic, any data files, any styling beyond "it's a page."
- **Acceptance criteria:** `git push` to `main` triggers `deploy.yml`, which succeeds; the Pages URL serves the placeholder heading; `ci.yml` also succeeds on the same push.

### M1 — Rarity/scoring engine
- **Goal:** `src/js/rarity.js` implements Section 5.1–5.2 exactly, proven by tests, with zero UI.
- **Depends on:** M0.
- **Blocks:** M3 (core loop needs this to score anything).
- **Tasks:** implement `computeRarity(cohort)`, `pointsFor(rarity)`, `digFor(rarity)`, `strataFor(cumulativeDepth)`; write `tests/rarity.test.js` against the worked examples in 5.1 (assert within a small epsilon, not exact floats) plus edge cases: single-entry cohort (rarity=1.0 per 5.1's degenerate case), all-equal-magnitude cohort, a cohort of two entries at the extremes.
- **Out of scope:** loading real data (use small hand-written fixture cohorts in the tests); anything touching `document`.
- **Acceptance criteria:** `npm test` passes; every formula constant (Section 3.10) is a named export, not a magic number buried in a function body, so M5's real data plugs in without touching this file.

### M2 — Answer matching engine
- **Goal:** `src/js/matching.js` implements Section 5.3 and the normalization rules (3.6–3.7) exactly, proven by tests, with zero UI.
- **Depends on:** M0.
- **Blocks:** M3.
- **Tasks:** implement `normalize(string)`, `buildLookup(cohortEntries)`, `matchAnswer(rawInput, lookup, usedAnswersSet)` returning one of `{status: 'accepted', entryId}` / `{status: 'duplicate'}` / `{status: 'unrecognized'}`; `tests/matching.test.js` covering: case/whitespace/punctuation normalization (3.7's exact "St. Lucia" example), alias match (e.g. "USA" → United States entry, using a fixture alias list), duplicate rejection after a first accepted match, unrecognized input, and a fixture proving a British-spelling variant that's deliberately *not* in the alias list fails to match (3.6).
- **Out of scope:** real alias tables (fixtures only); timer/round logic.
- **Acceptance criteria:** `npm test` passes; `matching.js` has no dependency on `rarity.js`, `run.js`, or `document` — it's a standalone module.

### M3 — Minimal playable core loop
- **Goal:** A genuinely playable (if ugly) end-to-end run using M1+M2, a tiny hand-written seed dataset (10–20 total entries spread across all 8 categories, real places, just few of them), and a real 30-second timer.
- **Depends on:** M1, M2.
- **Blocks:** M4.
- **Tasks:** `src/js/promptBank.js` (draw logic per 3.8, cohort-building, seed data only at this stage); `src/js/timer.js` (countdown, tick callback, expiry callback); `src/js/run.js` (round state machine wiring matching + rarity + timer together, implementing 3.4/3.5's retry-without-advance behavior and 5.3's terminal states); minimal `ui.js` rendering: prompt text, countdown number, text input, submit button, and a plain-text running score — no pixel art yet, div-soup styling is fine.
- **Out of scope:** the 15-round wrapper/summary screen (a shorter fixed run length, e.g. 3–5 rounds, is fine for manually verifying the loop works); persistence; any visual polish; the full content bank.
- **Acceptance criteria:** a human can play a full short run in a browser, watch the score and timer behave correctly, watch an unrecognized/duplicate answer retry without advancing, and watch a timeout auto-advance at 0 points; this is the milestone where "is the game actually fun/functional" first becomes answerable, so don't rush past manually playing it several times.

### M4 — Full run + summary + best-dive persistence
- **Goal:** The real 15-round shape (Section 3.8, 5.2) end to end, a run-summary screen, and `localStorage` best-dive tracking (Section 9, `bestDive` only — full history is M7).
- **Depends on:** M3.
- **Blocks:** M5, M6 both build on top of a complete run shape.
- **Tasks:** extend `run.js` to the full 15-round draw and cumulative-depth tracking; build the summary screen (final score, deepest stratum reached, round-by-round list, "new best!" callout when applicable, play-again action); `src/js/persistence.js` implementing the read/recompute/write behavior from Section 9 (history array can exist in the stored shape already, just not surfaced in UI yet).
- **Out of scope:** the stats/history screen itself (M7); visual polish (M6); full content bank (M5 — keep using seed data, just more of it if needed to make 15 rounds feel varied).
- **Acceptance criteria:** a full 15-round run reaches a summary screen with a correct final score and correct deepest-stratum readout; refreshing the page and playing again correctly detects and displays a new best when one occurs, and correctly doesn't otherwise.

### M5 — Real geography content bank
- **Goal:** Replace all seed data with the real, sourced, validated dataset at the target volumes (Section 6).
- **Depends on:** M4 (so the real data is dropped into an already-working run shape, not the other way around).
- **Blocks:** M8 (can't do final QA on placeholder data).
- **Tasks:** author all 9 JSON files (8 categories + `minor-peaks.json` feeding `mountain`) per the schema and targets in Sections 4 and 6; write and run `scripts/validate-data.mjs` (6.4) until it's clean; spot-check a random sample (aim for ~15–20 entries across categories) by hand against the recorded `source` field as a sanity pass before calling this done.
- **Out of scope:** anything about how the data is rendered or animated (that's M6); tuning the scoring constants based on how the real distribution feels (that's a post-v1 balance pass, not this milestone — ship the Section 3.10 defaults).
- **Acceptance criteria:** `npm run validate` passes clean; every category meets or has a documented, deliberate reason for missing its target count; a full run using real data produces a sensible, varied spread of rarity/points across a handful of manually-played test runs.

### M6 — Pixel-art visuals and dig animation
- **Goal:** The retro pixel-art earth-tone look: strata backgrounds per band (Section 5.2's 7 names), an animated worm sprite that digs downward and leaves a visible tunnel, category icons, and the reduced-motion fallback (Section 8).
- **Depends on:** M5 (needs the real category set to have real icons for; needs the true depth math to place strata backgrounds correctly).
- **Blocks:** M7, M8.
- **Tasks:** produce/commit sprite assets under `src/assets/sprites/`; `src/js/strata.js` (band lookup, already partially covered by M1's `strataFor`, this milestone is the *rendering* of it); wire animation into `ui.js` only (Section 7's architecture rule); implement `prefers-reduced-motion` fallback.
- **Out of scope:** sound (not requested anywhere in the brief — don't add it unprompted); the history/stats screen.
- **Acceptance criteria:** visually distinct earth-tone strata are shown and change correctly as depth crosses each threshold from Section 5.2's table; the worm's tunnel trail visibly accumulates across a run; motion is instant (no animation) when `prefers-reduced-motion: reduce` is set, verified by toggling that OS/browser setting.

### M7 — History and stats polish
- **Goal:** Surface the `history` array (Section 9) the game has been quietly recording since M4: a stats screen showing runs played, deepest stratum ever reached, average score, and a scrollable list of past runs.
- **Depends on:** M6 (reuses its visual language for consistency, e.g. stratum badges).
- **Blocks:** M8.
- **Tasks:** stats screen UI; derive "runs played," "average score," "deepest stratum ever" from `history` at render time (don't add new stored fields for these — they're all derivable); a way to reach the stats screen from the main menu/summary screen.
- **Out of scope:** exporting/clearing history (not requested; if it turns out to be wanted later, that's a fast follow, not a reason to block this milestone).
- **Acceptance criteria:** after several played runs, the stats screen's numbers are independently verifiable by hand against what was actually played.

### M8 — QA pass and v1.0 deploy verification
- **Goal:** Ship v1.0.
- **Depends on:** M5, M6, M7.
- **Blocks:** nothing — this is the last milestone.
- **Tasks:** re-read Sections 2–3 of this spec line by line against the running game and check off each requirement explicitly; test on at least one real mobile browser; run an accessibility pass (keyboard-only playthrough, screen-reader spot check on the live-region announcements, contrast check); confirm the live GitHub Pages URL reflects the latest `main`; tag the commit `v1.0.0`.
- **Out of scope:** new features. This milestone finds and fixes gaps against the existing spec; anything that's a genuinely new idea gets written down as a future-work note in `README.md` instead of implemented here.
- **Acceptance criteria:** every bullet in Section 2 and every resolved decision in Section 3 is demonstrably true of the live, deployed site; `v1.0.0` tag exists and matches what's live.

## 12. Definition of done (v1.0)

All of Section 2's original requirements are met; all of Section 3's resolved decisions are implemented as specified (not as whatever felt easiest mid-milestone); the site is live on GitHub Pages, deployed automatically from `main`; the content bank meets Section 6's targets and passes validation; `npm test` and `npm run validate` both pass in CI; the game has been played start-to-finish, on both desktop and mobile, by a human, more than once.

## 13. Amendments

Behaviour changes after v1.0, in the order they landed. Each is reflected in the section it cites.

| version | change | sections |
|---|---|---|
| 1.0 | Classic scripts + generated `data/bank.js` instead of ES modules + `fetch()`, so `file://` works. | 7, 8 |
| 1.0 | Region-scoped country prompts gate *acceptance*, not just wording; rarity stays global. | 3.1, 3.2, 5.3 |
| 1.1 | Scoring magnitude is monthly Wikipedia pageviews; the physical stat becomes `size`. Capitals score on their own article. | 2, 4, 5.1, 6 |
| 1.1 | Spelling correction (loose + fuzzy passes); British spellings corrected rather than rejected. | 2, 3.6, 3.7, 5.3 |
| 1.1 | Prompt modifiers: region (countries *and* capitals), curated themes, ocean, size thresholds, letter rules. | 3.1a, 6.0 |
| 1.1 | Draw: first three rounds plain and distinct; modifier chance ramps 40%→90%; no repeated prompt text. | 3.8 |
| 1.1 | Ocean membership derived from article coordinates and validated (Hawaii is in the Pacific by construction). | 4, 6.4 |
| 1.1 | Zero-dig answers must still complete the round (the `everest`/`caspian` freeze). | 3.11 |
| 1.1 | Previous round's result stays visible until the next submission. | 3.4 |
| 1.1 | Validator audits UN membership and theme membership; `gap-check` and `score-report` added. | 6.4 |
| 1.1 | Bank expanded to 1,318 entries (islands 104→335, plus rivers, mountains, lakes, deserts, seas). | 6 |
| 1.2 | Modifier chance ramps 70%→100% (was 40%→90%); opening length and ramp are named constants in `promptBank.js`. | 3.8 |
| 1.2 | Derived themes: `coastal` = country cohort minus `landlocked`, "Name a country with a coastline." | 3.1a, 6.0 |
| 1.2 | Flag-colour modifier: `flag` field on countries (`scripts/data-flags.mjs`), "Name a country whose flag has green in it." | 3.1a, 4, 6.4, 7 |
| 1.2 | Island nations are answerable as islands: 19 new island entries (Palau, Samoa, Tonga, Bahamas, Grenada…) and country-name aliases on shared or eponymous islands (Haiti → Hispaniola, Trinidad and Tobago → Trinidad). Bank is 1,337 entries. | 6 |
| 1.2 | "One in Wormillion": confetti and lightning over the scene for an answer at 85%+ obscurity, held 10 s or until the next answer. | 3.12, 7 |
| 1.2 | Dig curve made generous: `rarity × 70` below the bar, a flat 75 for 85–99%, 100 for 100%; depth budget 1500; strata bands unchanged so runs go deeper. | 3.9, 3.10, 3.12, 5.1, 5.2 |
| 1.2 | Relics in the dirt: bones, skeletons, pottery and coins near the surface; dinosaur and fish fossils, ammonites in Clay/Bedrock; gems, gold, swords and treasure chests deeper. Painted into the terrain, carved through by the tunnel. | 7 |
| 1.2 | Summary lists the run's finds from least to most obscure, with an obscurity bar and percentage per row. | 3.13 |
| 1.2 | A one-in-Wormillion dig carves a wider crater (radius 11; 14 for 100%), tapering in and out. | 3.12 |
| 1.2 | Capital themes: "not the largest city", "on the coast", "US state capitals"; 50 US state capitals join the capital cohort (`scripts/data-us-states.mjs`); capitals carry their country's flag ("…whose country's flag has green in it"); flag modifier weighted up. Bank is 1,387 entries. | 3.1a, 6, 6.0, 7 |
| 1.2 | Cross-category miss hint ("Estonia is a country — this round wants a capital city"); capital flag prompt reworded "Name the capital of a country whose flag…". | 3.1a, 3.4 |
| 1.2 | Letter rules ignore filler entirely ("Mount Fuji" has no T, does not start with M); only the length rules count "Mount"/"Lake", in every spelling. | 3.1a |
| 1.2 | Audit fixes: an exact name is never spell-corrected into a different in-scope place; size thresholds inclusive; letter filler per category (countries/capitals keep their official words; "cape" is a name); ø/æ/ł/ß folded; Aral Sea is also a lake; Gasherbrum II; "Big Island"; volcano/Caribbean/Mediterranean themes completed; seven flag rows; "in the Caribbean". Bank is 1,389 entries. | 3.1a, 3.7, 6.0 |
| 1.2 | Length rules judge the typed spelling ("China" is 5 letters, "People's Republic of China" is 22); seas keep their whole name for letter rules; `sizeRange` for rivers whose length depends on the tributary counted (Amur, Ob, Mississippi). | 3.1a, 4 |
| 1.2 | Digits count as characters for letter rules: K2 no longer "ends in K". | 3.1a |
| 1.2 | A shared loose form goes to the entry that owns it by name ("Arabian" → Arabian Sea); the validator fails on any that no name settles. `validate-data.mjs` now uses the game's own `matching.js` instead of a copy of `normalize`. | 3.7, 6.4 |
| 1.2 | Seventeen island-nation entries lose the bank-invented suffix ("Cuba Island" → Cuba, "Singapore City" → Singapore): the feedback line and the ladder show the real name, and "Jamaica Island" no longer counts as a 12-letter name. | 6 |
| 1.2 | Filler is optional in both directions: "Mount Denali" finds Denali, "Cuba Island" finds Cuba. The cross-category nudge tries every category exactly before any loosely, so "Lake Victoria" is the lake and not the Seychelles' capital. | 3.7 |
| 1.2 | Flag-prompt weight in the modifier draw back to 2 (3 felt heavy): ~0.6 flag prompts per run, half of runs see one. | 3.8 |
| 1.2 | Points step at the jackpot bar the way the dig does: a flat 950 for 85–99%, 1000 for 100% (the curve pays 807 just under the bar). | 3.10, 5.1 |
| 1.2 | The big island nations answer as islands: Japan, the Philippines, Indonesia and New Zealand as entries of their own (one country, one archipelago; scored on the country article like the Bahamas); the United Kingdom, Papua New Guinea and Brunei as aliases on Great Britain, New Guinea and Borneo (as Haiti is on Hispaniola). "Japan" on "Name an island in Japan" gets "Japan is all of it — this round wants a single island in Japan." Bank is 1,393 entries. | 6 |
| 1.2 | Two plain opening rounds instead of three (`OPENING_ROUNDS`); the ramp now runs over rounds 3–15, ~11.4 conditional rounds per run. | 3.8 |
| 1.2 | **Ninth category: `city`** — 314 non-capital cities (`scripts/data-cities.mjs`), region and flag inherited from the country, city-proper population for size prompts (500k/1M/5M/10M), one theme (*largest in its country*), a skyline icon. The plain prompt is "Name a city that isn't a national capital."; Paris on a city round gets "Paris is a capital city — this round wants a city that isn't a capital." City region prompts are only drawn where ≥ 6 cities carry the tag. The draw is 9 + 6 = 15. Bank is 1,707 entries (275 cities at first landing, 314 after an independent review added 39 obvious gaps). | 3.1a, 3.8, 4, 6, 6.0a, 7 |
| 1.2 | Initialism aliases (NYC, LA, HK, UAE, DRC…) are for typing only: letter and length rules ignore them, so New York City does not "end in C". | 3.1a |
| 1.2 | Every narrowed city prompt says "non-capital city" in the sentence ("Name a non-capital city in the Caribbean."), not only in the badge. | 3.1a, 6.0a |
| 1.2 | "0% obscurity? Dig deeper next time": the anti-jackpot for an answer that reads as 0% — blood and muck dripping off the words, flies, and a worm gone rotten for 10 s or until the next answer. `DUD_RARITY = 0.005`, `src/js/dud.js`, `renderer.setRotten`. | 3.14, 7 |

| 1.3 | **Two ways to dig.** "Today's dig" draws the fifteen slots from a PRNG seeded on the local date (`src/js/seed.js`), the same for everyone that day, one dig per day, locked on the title once played; "Endless" is the old random draw, unlimited. Runs carry `mode`/`dailyKey` into history; `?daily` deep-links into the daily. Nothing else differs. | 3.15, 7, 9 |

| 1.3 | **The -dle kit:** puzzle number (#1 = 2026-09-12), share text with a round-order emoji grid (`src/js/share.js`), average obscurity on the summary, streaks, a midnight countdown on the locked title, a "Daily digs" stats block with a stratum spread, and a review screen showing the rarest possible answer per prompt (`run.reviewRun`). Records store `rounds`; dailies are exempt from the history cap. | 3.16, 7, 9 |

| 1.3 | Length rules accept the typed spelling **or** its generic-word-trimmed form, whichever fits: "Monte Desert" is a short name, "Mount Kilimanjaro" a long one. Nothing accepted before is rejected now; the reveal shows the real name. | 3.1a |

| 1.3 | A themed sea prompt says "sea" unless the theme holds an ocean: "Name a sea in the Americas." (v1.2 said "sea or ocean", inviting "Pacific", which the theme rejects); "the Antarctic" keeps "sea or ocean" for the Southern Ocean. Letter-rule misses say which letter ("Lake Erie has no double letter"). | 3.1a, 3.4 |

| 1.3 | **The daily comparison**: "Better than 62% of 143 diggers today" on the summary and the locked title, from two Netlify Functions over Blobs that replay the submitted answers and score them server-side; one aggregate per day, one anonymous submission per browser per day; optional everywhere the API isn't. `@netlify/blobs` is the first dependency (functions only). | 3.17, 7 |

| 1.3 | The fuzzy pass's edit budget comes from the filler-stripped answer and candidates are compared filler-stripped too: "Lake Tåkern" is no longer corrected to Lake Vänern, "Kilimanjro" now finds Mount Kilimanjaro. | 3.7 |

| 1.3 | Coverage probes (`scripts/expansion/probe.mjs`): Colombia × rivers (+66), United States × non-capital cities (+249, incl. Brooklyn/Queens/The Bronx and the last five state capitals), Sweden × lakes (+24, Scandinavia theme). Bank was 9,306 after these probes; **14,914** after the US wave (2026-09-16, +2,700: rivers 80 km, lakes 25 km², mountains 122 views/mo, islands 1 km², cities 50,000) and the Europe wave (2026-09-16/17, +2,900 over 20 countries incl. the Nordics: rivers 60 km / 50 in Britain, views floors rivers 30, lakes 61, islands 91, mountains 122, seas 213; `scripts/expansion/reports/` has every chunk and audit) — country 197, capital 247, city 3,798, lake 1,234, river 3,707, mountain 2,630, desert 137, island 2,393, sea 571. | 6 |

| 1.3 | `size` may be **0 = "no sourced figure anywhere"** (2026-09-16): 652 US bays and straits, ~1,100 US islands and 10 deserts have no area in any reference and were being left out of the bank for want of a number. A 0 never satisfies a size-threshold prompt and is never shown; every other prompt treats the entry as any other. The validator checks `>= 0`; `chunk.mjs --allow-no-figure` writes the 0. | 4, 6.4 |

| 1.3 | A generic word belongs to a category (2026-09-16): the loose pass no longer drops another category's word ("Lake Michigan" on a river round is a nudge, not Michigan River; "Rapid City" is not Rapid River), so another cohort's loose form no longer blocks an in-category correction ("Lake Meade" is Lake Mead); a typed plural of a name ending in a generic word is refused, never corrected ("Great Lakes" is not Great Lake; "Irelands" is still Ireland); "Mt" normalizes to "Mount"; a same-named place elsewhere neither blocks a correction ("Solomon Island") nor hides the cohort's own entry ("Madagascar Island" → Madagascar). `MAX_ELIGIBLE_SHARE` 0.6 → 0.7 for size and flag rules: a generated rule may now leave 70% of the cohort eligible (lakes under 100 km² and blue-and-white city flags had retired themselves at 60%); letter rules keep 0.6. | 3.1a, 3.7 |
| 1.3 | The 2026-09-17 islands / seas / cities audit: a hyphen normalizes to a space (47 hyphenated names typed with spaces had landed only as corrections; "St Ouen" was unrecognized); the ʻokina is an apostrophe; loch/lough are sea words as well as lake words ("the Holy Loch" on a sea round); a size rule's eligible share is measured over sized rows only (333 `size` 0 seas had made "smaller than 1,000,000 km²" drawable while every one of them refused it). | 3.1a, 3.7 |
| 1.3 | Engine changes of the US and Europe waves not logged above (2026-09-15/16, commits `807ad68`, `2a2fef6`, `f03ee4b`, `83c9952`, `b023ba5`, `6930bc9`): `reservoir` is a matching filler word; creek / fork / branch / run / brook / kill / wash / slough / draw are letter-only filler for rivers (bayou and arroyo lead the name, like rio, and are not filler) and a letter-rule miss names the word that did not count; an input made only of generic words gets no edit budget ("River Isle" is not River Mole); an exact name held in two other cohorts nudges to the most-viewed one ("Etna" is Mount Etna, not the Norwegian river); a refused tie is not re-guessed elsewhere; lago / lac / lagoa / laguna / etang and fiume / fleuve / fluss / riviere / rivier are matching filler; þ folds to th; the same-name twin rule yields to a typed generic word of the other kind. | 3.7 |
| 1.3 | The 2026-09-17 pre-merge audit (whole bank vs the live 9,300): the foreign generic words above had leaked into `LETTER_FILLER`, so "Laguna Colorada" no longer started with L — they are exempt like loch and rio; the cross-category nudge runs exact, then loose, then fuzzy over every other cohort, so a loose hit anywhere beats a fuzzy hit in an earlier cohort ("Cornwallis" is Cornwallis Island, not Corvallis); Honolulu carries Oceania as well as North America. Data: 30 pre-wave rows re-pointed off namesake or wrong-kind articles (Diamond Head, Grand Manan, Kura, Lake Rukwa, Mount Wutai, Pra, Kuma, Lake Togo, the Golden Horn, Con Dao…), 13 dropped, 21 inland islands' oceans cleared, 19 British and Irish rivers added to the Europe theme, 55 theme members added. | 3.1a, 3.7, 6 |

| 1.4 | **Same-name places** (decision 5 of the expansion, accepted by the user 2026-09-17, built 2026-09-18): a cohort may hold several entries with one bare name when each carries a `qualifier`, authored as `Name (Qualifier)` in the name column and carried in the id; the lookup maps a key to a list, most-viewed first, so the round's scope picks the namesake, a plain round takes the most-viewed one, a second typing takes the other, and a round no namesake fits refuses the famous one with its qualifier; the exact qualified forms plus US postal codes; the fuzzy pass dedupes by spelling; a loose form two names share resolves to the list too (it identified nobody before, and the fold refused the second name); `NAMESAKE_FAME_RATIO = 3` — a city against a capital, country or island, on a plain round or a region round the famous one fits; letter rules, the loose index and length rules see the bare name; the stored answer is the display name; a bare shared name in a theme is the unqualified holder. The 23 legacy parenthetical names (`Derwent (Derbyshire)`, `Krka (Croatia)`, the Black / White / Red Deserts…) became regular qualified rows — five of them could not be typed bare before — with `Scamander (Karamenderes)` made an alias, `Tana River (Kenya)` / `Fish River (Namibia)` gone bare like the bank's other rivers, and Musi (Indonesia), Green Island (New York), Avon (Bristol) and Avon (Warwickshire) qualified to match their namesakes. Tools: `scripts/expansion/qualify.mjs` (an existing row into its qualified form, id-keyed data moved), `chunk.mjs --taken-only` keeps Wikipedia's comma / parenthetical part as the qualifier (cleaned to a state, province or country; the description's "in <State>" otherwise) and writes the incumbents' qualify file, `fold.mjs` admits qualified namesakes under the validator's rule, `drop.mjs` finds a qualified row. Data: 526 namesakes folded from the US and Europe waves' taken lists (cities 121, rivers 199, lakes 14, mountains 93, islands 103, seas 5), 250 incumbents qualified, the island cohort's Malta re-pointed to "Malta (island)"; 14,901 → 15,427. The Opus audit round of the same day (data, gameplay, regression; `scripts/expansion/reports/2026-09-18-decision-5-*.md`) then fixed: the guard measured against the entry the typing settled on (a second "Boston" was "Boston is a capital city") and switched off on letter / size / flag / theme rounds ("Athens" on "starts with A" scored Georgia); the generated qualified keys as fuzzy candidates ("Cambridge, UK" was Cambridge (Massachusetts), "Barren Island, New York" was Green Island); a qualified typing on another cohort's round scored as the bare twin ("Athens, Georgia" on a capital round was the capital, corrected); a famous alias-holder losing a shared loose form to a new obscure name ("Cook" was Mount Cook (Canada), not Aoraki); and 13 rows (Pine (Wisconsin) on a Michigan article, Grand (Missouri) at 760 km, Margate (East Kent), Merida (Yucatán), Sugar Creek (Wabash River), Matterhorn Peak (Sierra Nevada), six borough-qualified islands, three two-state rivers), five theme rows, one ocean, Sugarloaf and Saint Helena Island as aliases of the famous ones, Black Mesa (Arizona) re-pointed to the Navajo Nation mesa, Ouse (Sussex) and Little (St. Francis) added; 15,429. | 3.7, 4, 5.3, 6.4 |

**Deferred (needs new data, scoped separately):** a non-capital *cities* category.
