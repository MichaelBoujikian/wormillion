# Handoff

For whoever (or whatever) picks this up next, with no other context. `README.md`
explains the game and how to run it; `SPEC.md` is the design source of truth
(v1.3, amendments log in §13). This file is what isn't in either: the job
that's queued, where things stand, every knob and its setting, the decisions
that must not be quietly undone, and the gotchas that cost time. Claude Code's
project memory is keyed to this folder (`C:\Users\smite\repos\wormillion`);
this file is the memory that survives.

Written 2026-09-16, midday, at the end of the overnight session that ran the
**United States wave** of the country-by-country scouring on branch
`expansion` (rivers, lakes, mountains, islands, seas, deserts, cities;
eight Opus audits; 9,300 → 12,008 places). Updated the same evening as the
**Europe wave** started (see "Europe wave, running log" below): the user
folded **Scandinavia & the Nordics into this wave**, accepted every
decision below, and asked for Opus sub-agents (max 3), piecemeal commits,
push as you go.

---

# The job: Western Europe, all categories, on `expansion`

The user's plan (2026-09-15): scour the world country by country, **every
category per country**, "as many places as we can", in this order:

> **United States ✓ → Western Europe → Mexico and Canada → East Asia → West
> and Central Asia → South America → Central America → North Africa → the
> rest of Africa → islands.**

Western Europe, as the bank tags it (`scripts/data-countries.mjs` region
`Western Europe`): **Germany, France, United Kingdom, Italy, Spain,
Netherlands, Belgium, Portugal, Austria, Switzerland, Ireland, Luxembourg,
Andorra, Liechtenstein, Monaco** — **plus, from 2026-09-16 evening, the
region `Scandinavia & the Nordics`: Sweden, Norway, Denmark, Finland,
Iceland** (the user added them to this wave; Sweden's lakes were probed on
2026-09-15 at a 30 km² floor, so a 25 km² re-run is owed). Twenty countries.

Standing decisions from the user, all still in force:

1. **Everything lands on branch `expansion`.** Do not merge to `main`: every
   push to `main` deploys GitHub Pages but Netlify is locked, and a diverged
   bank breaks the daily comparison for Pages players on ~2 days in 3. The
   user said (2026-09-16) they **want to add the next probes to `expansion`
   as well before merging with `main`** — i.e. Western Europe goes onto this
   branch too, and the merge + Netlify publish happens after it, as one
   release with one re-verification. (If the phrase "the best probe" comes
   up: that is the user's words for this; ask if unsure which probes they
   mean before merging anything.)
2. Order within a country: **rivers → lakes → mountains → islands → seas →
   deserts → cities.** Rivers and lakes are where the traps live (a missing
   name autocorrects to a different place); do them early.
3. **Floors: keep them low, capture a lot, decide on the spot and report the
   choice**; a later wave lowers every floor. The US floors are the
   starting point (below).
4. **Name-taken places stay out** (a bare name held by another entry: Portland
   ME, Green River KY, Prince of Wales Island AK…). No comma-form or
   parenthetical names. A bare name that belongs to a far more famous place
   *not* in the bank is also not free (Athens GA, Edinburg TX, Dublin CA).
5. **Audits on Opus**, data + gameplay in parallel per chunk or two, up to
   three agents at once, each writing its report as it goes.
6. (2026-09-16) `reservoir` is a matching filler word; creek / fork / branch
   / run / brook / kill / wash / slough / draw are letter-only filler for
   rivers; a letter-rule miss names the word that didn't count.

## Where things stand

Branch `expansion`, 30 commits ahead of `main` (`8e91211`), pushed, tree
clean. `npm test` 181 · `npm run validate` 12,008 · `npm run gap-check` 443.

| category | before | after | US floor | reports (`scripts/expansion/reports/2026-09-16-…`) |
|---|---|---|---|---|
| rivers | 2,249 | 3,192 | 80 km, or 1,000+ views/mo | `us-rivers.md` + `-data-audit`, `-gameplay-audit` |
| lakes | 790 | 1,160 | 25 km², or 1,000+ views | `us-lakes.md` + `us-lakes-mountains-*-audit` |
| mountains | 1,309 | 1,984 | 122 views/mo (no elevation floor) | `us-mountains.md` (read its "Re-cut" section) |
| islands | 1,345 | 1,655 | 1 km², or 1,000+ views | `us-islands.md` + `-data-audit`, `-gameplay-audit` |
| seas | 253 | 259 | — (only 11 of 652 US bays have an area) | `us-seas-deserts.md` |
| deserts | 129 | 130 | — | same |
| cities | 2,781 | 3,180 | 50,000 population | `us-cities-50k.md` + `-data-audit`, `-gameplay-audit` |

`bank.js` 1.55 MB. **`main` / Netlify still serve the 9,300-place bank.**
Real players: dig #4 (2026-09-15) had 123 submissions; dig #5 ran on the
old bank. The gameplay audits measured the next 30 dailies old vs new bank:
they differ on dig #1 (the lake size guard, below), 2026-10-11 (the city flag
guard) and dig #4 would re-draw until its window closes 2026-09-18 00:00 UTC.

## Decisions — taken 2026-09-16 evening ("go with your recommendations")

The user accepted every recommendation below in one message. What was done
about each is in the running log at the end of this section; the list is
kept as written so the reasoning survives.

1. **"Size unknown" in the schema.** SPEC §4 says `size > 0`. 652 US bays /
   straits / sounds (Pearl Harbor, New York Harbor, the Golden Gate, Cook
   Inlet, Pamlico Sound…), ~1,100 US islands and 10 deserts have **no area
   anywhere** and were left out by the sourced-figure rule. `satisfiesSize`
   (`promptBank.js`) already treats a non-positive size as "never answers a
   size prompt"; nothing in the UI shows size. Recommend: allow `0` (validate
   `>= 0`, SPEC amendment, `fold.mjs`, a `--allow-no-figure` switch in
   `chunk.mjs` that writes `0`), then fold the held-back US rows from the
   probe JSONs in `work/`. Europe's fjords, bays and small islands will hit
   the same wall.
2. **`MAX_ELIGIBLE_SHARE` 0.6** (`promptBank.js`): lakes under 100 km² are
   60.0% of the cohort so "Name a lake smaller than 100 km²" no longer draws
   (dig #1's round 12 moved; pin updated knowingly in `tests/prompts.test.js`),
   and 400 more red-white-blue US cities took "flag has both blue and white"
   over the line too. Every wave adds small lakes; France and Britain add
   blue-white-red cities. Recommend 0.7, or a 25 km² tier in `SIZE_RULES.lake`.
3. ~~Filler words~~ — done (`807ad68`, `2a2fef6`).
4. **Two `run.js` rule changes** the audits argued for three times: (a) when
   the typed input carries the *current* category's own generic word ("Lake
   Meade", "Mackinaw Island"), another cohort's loose form must not block the
   in-category spelling correction (aliases paper over the known cases);
   (b) the loose pass should not drop a generic word naming *another*
   category — "Lake Michigan" → Michigan River, "Rapid City" → Rapid River
   (950 pts), "Willow Reservoir" → Willow River (950), "Mount Foraker" →
   Foraker River. Pre-existing class, larger with every wave. Recommend both.
5. **Same-name second places** — Green River (Kentucky, 618 km), Colorado
   River (Texas, 1,387 km), Fox River (Green Bay), Prince of Wales Island
   (Alaska, the 4th-largest US island), Black Lake ×3, 130 US cities (Portland
   ME, Birmingham AL, Cambridge MA, Worcester, Toledo OH…) — need a name
   policy (Wikipedia's parenthetical, reachable only by the fuzzy pass).
   Europe will add the mirror image (a British Cambridge is *in*; a Boston,
   Lincolnshire is not). Recommend: not this wave.
6. **"Great Lakes"** typed on a lake round is corrected to Great Lake
   (Tasmania). Recommend an engine guard: never correct a plural onto a
   singular namesake.
7. **Themes**: no lake theme covers North America; `the Rockies` was not
   extended (153 new Rockies peaks answer "isn't in the Rockies") — needs
   Wikidata P4552 (mountain range). Recommend a `North America` lake theme
   and a P4552 pass. **For Europe this matters more: the Alps (lake and
   mountain), the British Isles (river, lake), Scotland / England or Wales
   (mountain, island), the Mediterranean and Greece (island), Europe (river,
   sea) all exist and every new row must be put into the ones it belongs to
   — a themed prompt rejects everything outside its set.**
8. Typo casualties of the exact-beats-correction rule ("Weiser" → Weser,
   "Redding" → Reading, "Brooklin" now a refused tie with Brookline,
   "Tocson" with Towson, "Sheyenne" on a capital round). Recommend: leave.

### Europe wave, running log (2026-09-16 evening →)

- **Decision 1 done** (`7d00d78`): `size` 0 = "no sourced figure anywhere".
  `validate-data.mjs` checks `>= 0`; SPEC 4 / 6.4 / 13 amended; `chunk.mjs
  --allow-no-figure` writes the 0; **`probe.mjs` gained `noFigureViews: N`**
  (fetches views for the unsized items and keeps those with N+ views/mo in
  scope, `noFigure: true`; the report's NO FIGURE section lists the rest).
  `satisfiesSize` refuses a 0 in both directions (test). **Still owed:** the
  US no-figure rows (652 bays, ~1,100 islands, 10 deserts) — re-run
  `us-seas`, `us-islands`, `us-deserts` with `noFigureViews` set (cached
  tree/resolve/sizes, only the views are new), chunk with
  `--allow-no-figure`, fold. Needs the resolver slot.
- **Decision 2 done** (`2bad597`): `MAX_ELIGIBLE_SHARE` 0.7. Dig #1's
  round 12 is "Name a lake smaller than 100 km²" again (the pin is back to
  what shipped). Newly drawable: lake < 100 km² (60.1%), city flag
  blue+white (60.0%), capital flag blue (62.8%), mountain < 3,000 m (64.3%),
  city flag blue (65.9%), desert < 100,000 km² (67.7%), capital flag
  red+white (68.0%), sea < 100,000 km² (68.0%). `MAX_ELIGIBLE_SHARE` is
  exported; the flag test reads it.
- **Decisions 4a + 4b + 6 done** (`63d894f`): `matching.js` `WORD_CATEGORY`
  — every cohort lookup carries its category (`buildLookup(entries,
  {category})`, set in `promptBank.js` and `gap-check.mjs`); the loose pass
  drops a generic word only when it is the cohort's own word or nobody's,
  and the fuzzy pass then compares whole strings only. "Lake Michigan" on a
  river round → nudge, not Michigan River; "Lake Meade" on a lake round →
  Lake Mead even with a Meade River in the bank. A typed plural is never
  corrected onto the singular (`key === candidate.key + 's'`, unless the
  candidate already ends in s: "Loch Nesss" is still a typo). SPEC 3.7
  amended; tests in `matching.test.js` and `run.test.js`. **The probes'
  `fuzzy` lists now reflect this** (a probe started before the change used
  the old matcher: `uk-rivers` pass 1 did).
- **Decision 7 half done**: lake theme **`North America`** (`8e8cebe`, 527
  lakes by article coordinates from `scripts/.cache/titles.json`; the
  derivation script is not in the repo — coordinates in the box lat > 7.2,
  −170 ≤ lon < −50, Iceland and Colombia's Lake Tota fall outside);
  **`scripts/expansion/range-tag.mjs`** (`bffe9c6`) tags mountains into a
  range theme from the `range` / `parent` infobox field in
  `work/wikitext-cache.json` — `the Rockies` 49 → 186. The table
  `RANGE_THEMES` has `the Rockies` and `the Alps` (subranges by name);
  extend it per theme. ~1,300 US peaks have no cached infobox (only the
  article-passed ones do) — a P4552 pass or an infobox fetch for the
  mountain cohort is still owed; run `article-size.mjs` on a mountains
  probe with `--no-figure` and then `range-tag.mjs` again.
- Decisions 5 and 8: nothing to do (deferred / leave).
- **Wrong articles found on the way** (from the no-coordinates list of the
  lake theme derivation): `lake-lake-ypoa` scores on "Lakes and rivers of
  Titan" (Saturn's moon, 2,222 views), `lake-lake-coatepeque` on "Lake
  island", `lake-lake-xiloa` on "Volcanic crater lake", `lake-lake-san-pablo`
  on "Khari Khari Lakes" (Bolivia), `lake-lagarfljot` on "Lagarfljót Worm"
  (a cryptid). Candidates in `work/candidates-lakes-wrong-articles.json`;
  run `wp-check.mjs` on it in a resolver window, then `fix-titles.mjs`.
- **Probe 1: `uk-rivers` done** (`cf4f25b`, report
  `reports/2026-09-16-uk-rivers.md`): 57 rivers at **floor 50 km** (Britain's
  rivers are short and famous), 8 fuzzy traps fixed, Lee and Avoca
  re-pointed off a New Zealand and an Australian river. The British
  namesakes (Avon ×4, Stour, Derwent, Ouse, Don, Dee, Blackwater…) stay out
  per decision 5 — the report lists them as the case for a name policy.
- **Audits of the UK chunk + the engine changes** (Opus data + gameplay,
  each followed by an Opus skeptic that reproduced every finding; ~900k
  tokens, 47 min; reports `reports/2026-09-16-uk-rivers-engine-*-audit.md`;
  fixes `83c9952`, `1f11b7b`). What they caught, all fixed:
  - the first plural guard **redirected** a typed plural onto the next
    place within budget ("Irelands" → Iceland, 450 such); now it refuses
    only a plural of a name ending in a generic word ("Great Lakes") and
    refuses outright;
  - "Mt Vernon" on a city round had no exact hit and "mt" is a mountain's
    word → `normalize` folds Mt → Mount;
  - "Solomon Island" on a country round was refused because the island
    cohort's Solomon Islands claimed it → a same-named place elsewhere does
    not block a correction; "Madagascar Island" / "Singapore City" on a
    country round are the country, shown as corrections (exact/loose hits
    only — "Nigera" stays a refused tie);
  - "Salt Lake", "Smith Mountain", "Center Hill", "Barren River", "Sea
    Lion", "Snow Hill", "Thousand Lake", "Mount Desert", "River Isle" lost
    their loose-pass acceptance to the category-word rule → aliases;
  - "River Isle" was corrected to River Mole on ten characters' slack → an
    all-generic-word input has no budget of its own;
  - at 0.7 the letter rules "with an A in it" (66% of rivers/lakes/mountains)
    became drawable → `MAX_ELIGIBLE_SHARE_LETTER` 0.6;
  - Lake Arrowhead, Lake Coatepeque, Twin Buttes Reservoir were outside the
    North America lake theme (the derivation keyed the titles cache by
    final title; the cache is keyed by the queried title) → added; five
    more Rockies peaks whose infobox names a subrange the table lacked →
    added, table extended (Elkhead, Red Mountains, Bear River Mountains,
    Laramie Range, White River / Yellowstone Plateau);
  - **`river-humber` scores on Humber River (Ontario) and `lake-loch-leven`
    on Loch Leven (California)** — both in the British Isles theme (Lee
    class, from the 2026-09-14 fill). Re-point to `Humber` (WIKI_VERIFIED:
    "tidal estuary") and `Loch Leven (Kinross)` in the next resolver
    window (`work/fixes-humber-leven.json` is written).
  - Known and left: 29 one-edit typos of famous rivers (Thams → Thames,
    Meise → Meuse…) are refused ties now that Thame, Teise, Tame, Alde,
    Clare, Brosna, Feale, Irwell, Rede exist (by design; 0 went to a wrong
    river); "Lake Havasu" on a city round is now the lake's nudge, not Lake
    Havasu City (alias if wanted); publish timing — dig #6 (2026-09-17)
    already differs from the live build in round 3, so publishing sooner
    costs least (J8 in the gameplay report).
- **Probe 2: `de-rivers` done** (`989cb85`, report
  `reports/2026-09-16-de-rivers.md`): 125 rivers at **floor 60 km**
  (Germany, Austria, Switzerland, Liechtenstein, Luxembourg), 11 fuzzy
  traps fixed, **Eder / Aller / Thur re-pointed** off tiny namesakes, the
  five Rhine sections and "Rhin" (the Rhine's French name) left out. Pass
  1 died once with exit 1 and no message during the views fetch (the
  re-run resumed from cache). The `famousViews` fetch over ~2,700
  below-floor titles is the slow part (~1 h) and found two rivers
  (Eisbach, Breg — the chunk's two most viewed).
- Humber and Loch Leven re-pointed (`9813fd5`).
- **Probe 3: `fr-rivers` done** (`a1a975e`, report
  `reports/2026-09-16-fr-rivers.md`): 200 rivers (France, Belgium, the
  Netherlands), 28 fuzzy traps fixed, Orne re-pointed to Normandy's, eleven
  French Guiana rivers left for the South America wave. enwiki has only 940
  French river articles (vs 3,345 German). Jackpot share of the river
  cohort 3.2% (was 2.7%; 150 of the 200 rows sit at 30 views/mo).
- **The de + fr audit round was lost**: both Opus auditors died mid-run
  when the user's session limit hit (~360k tokens, no findings kept; the
  half-written reports are in the scratchpad, not the repo). Re-run one
  audit round over de + fr + it-es + nordic once the Nordic chunk is in —
  more chunks per round, not more rounds (see `subagent-limits` memory).
- **Probe 4: `it-es-rivers` done** (`e8a1883`, report
  `reports/2026-09-16-it-es-rivers.md`): 127 rivers (Italy, Spain,
  Portugal), 19 fuzzy traps fixed, Rio Tinto was missing; **the itwiki
  decimal shift in Wikidata is the rule for Piedmont** (ten rivers at
  10× — the article pass is mandatory); Odiel and Allaro left out for
  having only a wrong Wikidata figure.
- **Probe 5: `nordic-rivers` done** (`871b259`, report
  `reports/2026-09-16-nordic-rivers.md`): 98 rivers, Altaelva was missing.
- **A 30 views/mo floor for the wave's rivers** (`19a5183`): the five
  chunks had taken the river cohort's jackpot share from 2.5% to 4.5%; 91
  rows with a median of zero daily views (magnitude 8–29) were dropped
  again and the share is 2.2%. **Europe river floors: 60 km (50 in
  Britain) or 1,000+ views, and at least 30 views/mo.** `drop.mjs` fixed
  (it left array holes in themes.js when a theme line held only the
  dropped name).
- **Rivers done for the wave**: river cohort 3,707 (was 3,192).
- **Audit round over de + fr + it-es + nordic done** (Opus data + gameplay
  + skeptics, ~925k tokens, 50 min; reports
  `reports/2026-09-16-europe-rivers-*-audit.md`; all twelve findings
  reproduced; fixes `b023ba5`, `4e7a671`): Alta scored on a Ukrainian
  stream (dropped, "Alta" now an alias of Altaelva); Nera and Arda scored
  on namesakes (re-pointed); Guadalevín and Busento carried decimal-shifted
  Wikidata-only figures (Guadalevín dropped; **Busento is the first size-0
  row** — 274 views, no sourced length); two-letter rivers settled the
  bank's way (Né added, Eo kept). Engine: `elsewhere()` now nudges to the
  most-viewed exact twin ("Etna" on a lake round is Mount Etna, not the
  30-view Norwegian river); a refused in-category tie is no longer
  re-guessed fuzzily elsewhere ("Nille" was "Lille is a city");
  fiume/fleuve/fluss/riviere/rivier are river filler. Data: native-name
  aliases for ~30 big rivers (Donau, Mosel, Rhin/Rijn, Tamise, Sena, Ebre,
  Etsch, Drau, Weichsel, Labe…), bare forms so a typo of a famous river ties
  instead of landing on an obscure new row (Negro, Grande, Saigon, Tijuana,
  Lhasa), the Swedish naming split bridged both ways (Vindel/Ume/Lule/
  Kalix/Torne/Pite on the pre-wave rows, Orealven/Vasterdalalven… on the
  new ones), Sarre on the Saar, Sienne on Siena. Known and left: 149
  one-edit typos of famous rivers are refused ties now (by design); the
  famous-typo class (Merse/Meuse, Elde/Elbe, Lay/Tay, Gela/Gila…).
- **Lakes: probe 6 `uk-lakes` done** (`0fd2724`): 8 rows — Britain's big
  lakes were all in; only three unknown lakes clear 25 km² and two of those
  were a peninsula and a sea loch (the kind regex's `loch` matched
  "Lochaber"). `probe.mjs` / `chunk.mjs` now strip enwiki's comma
  disambiguation for every category. **Probes 7–9 done**: `de-lakes` 12
  (`b74a4f4`), `fr-lakes` 16 (`e6c64f3`, Lac du Bourget was missing; the
  Mediterranean étangs and the Grevelingen into `saltwater`), `it-es-lakes`
  11 (`ac30f2f`, Lake Orta was missing; Alpine ones into `the Alps`).
  Europe's lakes over 25 km² were nearly all in already; the chunks are the
  famous small ones lifted by 1,000+ views. Sections of Lake Constance,
  lagoon systems, the Azores/Madeira (islands the lists dragged in) and a
  village article left out. **Probe 10: `nordic-lakes`** running (Sweden,
  Norway, Denmark, Finland, Iceland — the big one; Sweden's 2026-09-15
  probe used a 30 km² floor, this one 25).
- **A matcher gap noted, not fixed**: German ue/oe/ae transliterations
  ("Muenchen", "Moehne") do not match the ASCII-folded names; recommend
  aliases at fold time for umlaut names rather than a `normalize` rule (see
  the de-rivers report).
- **Probe configs written for every remaining category** (`probes/*-lakes`,
  `*-mountains`, `*-islands` for uk / de / fr / it-es / nordic); seas,
  deserts and cities still to write. `probe.mjs` records the list pages each
  item came from and `chunk.mjs` maps a list to a country (`listCountry` in
  the config), so one cities probe can span countries.

---

# The loop, as it now works

Read `scripts/expansion/README.md` first (short). One country × category at
a time; one commit per chunk; audits per chunk or two.

1. **Probe.** Copy a `scripts/expansion/probes/us-*.json`, edit, run
   `node scripts/expansion/probe.mjs scripts/expansion/probes/<name>.json`
   in the background (5 min to 3 h; see timings). It walks Wikipedia
   categories (`roots` + `subcat` regex, depth ≤ 3) and/or the links of list
   pages (`lists`), resolves redirects and descriptions, keeps what reads
   like the kind (`kind` regex on description|title, minus `notKind` on the
   description — lifted by `notKindExemptTitle`), pushes each article through
   the game's own matcher, fetches Wikidata's size (`sizeProp`), applies the
   floor (`minSize`), fetches 60 days of views for what is in scope (and for
   what is below the floor when `famousViews` is set — 1,000+ views/mo lifts
   it back in), and prints **present / name-taken / fuzzy / missing / no
   figure / below floor / famous**. Output `work/<name>.json`; everything
   memoised per item in `work/<name>-cache.json`, so a re-run after a config
   change costs only what is new.
2. **Sizes.** `node scripts/expansion/article-size.mjs work/<name>.json
   [--no-figure] [--min-views=N]` reads each article's infobox (convert
   templates, `length_mi`, `area_acre`, `elevation_ft`…) and writes
   `work/<name>-sizes.json`. **The infobox always wins over Wikidata**
   (Wikidata is 100× off for one lake in six — hectares as km² — and
   decimal-shifted for frwiki-imported rivers). Then **run the probe again**:
   pass 2 picks up the article figures and fetches views for what newly
   clears the floor.
3. **Chunk.** `node scripts/expansion/chunk.mjs work/<name>.json --tag=<tag>
   [--themes="A;B"] [--min-views=N] [--country="France"]` writes the
   missing + fuzzy rows (never the name-taken ones) as
   `work/new-<block>-<tag>.txt` in `fold.mjs`'s format, named the bank's way
   (Wikipedia's title minus its parenthetical; rivers bare of "River" unless
   named after a state or country; cities without ", State"). **Then
   hand-clean the file** — it always needs it: groups and chains, former
   lakes, protected areas, concept articles ("Ultra-prominent peak"),
   islands that are really towns, foreign rows the worldwide lists drag in,
   comma names the strip missed, names in the other categories' cohorts
   (Greece NY), sizes to fix. The US reports list what slipped through each
   time; `scratchpad` filter scripts are not in the repo, but the patterns
   are in `reports/`.
4. **Fold.** `node scripts/expansion/fold.mjs --only=<block>-<tag>` (dry run:
   every collision with its reason — same name, filler-stripped loose form,
   alias clash, a city that is a capital or a country/island name), then
   `--write`; move the chunk to `work/folded/`.
5. **Pipeline**, every time:
   ```bash
   npm run fetch-pageviews -- --check   # fix with fix-titles.mjs: WIKI_TITLES re-points, WIKI_VERIFIED for "landform"/"town on the island"/"no short description"
   npm run fetch-pageviews              # views + coordinates for the new rows (cached)
   npm run build-data && npm run validate   # validate names islands/seas without coordinates → add-oceans.mjs
   npm test && npm run gap-check        # add the chunk's headline names to gap-check.mjs first
   ```
   **One commit per chunk**, the message saying how many, from what, what
   was left out and why.
6. **Audit** (Opus, data + gameplay in parallel, per chunk or two):
   `scripts/expansion/AUDIT-BRIEF.md` is the brief; the task message names
   the commits, the chunk files, the pre-wave commit (`git show <sha>:src/
   data/bank.js`), the probe JSON / sizes JSON / `work/wikitext-cache.json`
   (offline infoboxes), and the report path in the scratchpad; the agent
   writes as it goes. 250–440k tokens each; every one of the eight US audits
   found real problems (wrong articles, 100× figures, a 793k "city", jackpot
   inflation, themes not extended, inland islands "in the Atlantic").
   Apply the confirmed fixes, copy the report into `reports/`, commit.
7. **Report** per probe (`reports/<date>-<country>-<category>.md`): method,
   outcome with commit hashes, counts, what was left out and why, the
   judgment calls for a human. The US ones are the template.

## Timings and the Wikipedia rule

Wikipedia throttled every run from the first request all night (~5 s per
request effective). A state/région category tree probe ~1 h; an article
pass ~1 h; a views pass over 4,000 titles ~1 h; the 42,857-title cities probe
~3 h. **Never two resolvers at once** — `probe.mjs`, `article-size.mjs`,
`fetch-pageviews`, `auto-titles.mjs`; a stray side request (even one curl)
429s the running one. Start anything over ~5 min with `run_in_background`
and wait with an `until grep -q … ; do sleep 20; done` loop, also in the
background. The Bash tool caps at 600 s.

## Probe recipes per category (what worked for the US; what to change)

- **Rivers** (`us-rivers.json`): roots `Category:Rivers of <country> by
  <subdivision>`, subcat regex admitting the subdivision level only (county
  trees are 10× bigger and nearly all creeks); lists = the per-subdivision
  "List of rivers of X"; `kind` river|stream|creek|brook…; `notKind`
  anchored to the description's first word (reservoir, lake, range, road,
  valley, county, city…); `sizeProp P2043`, `sizeUnit km`, **floor 80 km**,
  `famousViews 1000`; `spellings river`. Wikidata has no length for 85% of
  small streams — the article pass is mandatory. Europe: `Category:Rivers
  of France` has département subcats ("Rivers of Ain"…); "List of rivers of
  France", "…of Germany", "…of Italy", "…of Spain", "…of England"/"…of
  Scotland"/"…of Wales"/"…of Ireland" exist. Themes: `Europe` (river) and,
  for the UK/Ireland, `the British Isles` — set `--themes="Europe;the British
  Isles"` for those. Native-name aliases matter here (Rhein, Donau, Mosel,
  Tajo/Tejo, Douro/Duero, Tevere): the fold keeps an alias that doesn't
  collide.
- **Lakes** (`us-lakes.json`): roots for lakes *and* reservoirs; **floor 25
  km²**, `famousViews 1000`; `notKind` must veto former/prehistoric/pluvial
  lakes, groups, "combined lake", cities named Lakewood; the settlement
  infobox's `area_total` includes water (use `area_land`). Themes: `the
  Alps` (lake) for the Alpine countries, `the British Isles` for lochs and
  loughs, `saltwater` where it applies. "Lough X" / "Loch X" / "Llyn X" keep
  their word (loch/lough/llyn are matching filler but NOT letter filler:
  Loch Ness starts with L).
- **Mountains** (`us-mountains.json`): **lists only, no category tree, no
  elevation floor** (it would cut the whole of Britain and Ireland); floor
  by **views: 122/mo** — and read the re-cut section of `us-mountains.md`
  before choosing anything lower (30 = the cohort minimum put 1,004 peaks at
  exactly 30 views and 45% of the cohort at jackpot; the median quantises at
  whole views/day: 30, 61, 91, 122…; jackpot share by floor 30 → 45%, 61 →
  24%, 91 → 11%, 122 → 2.2%, vs rivers 2.6%, lakes 4.0%, islands 4.0%).
  Check the jackpot share with `rarity.cohortStats` after folding. Europe's
  lists: "List of French mountains by prominence", "List of mountains of the
  Alps over 4000 metres", "List of prominent mountains of the Alps above
  3000 m", "List of highest mountains of Austria / Germany", "List of Munro
  mountains", "List of Marilyns in the British Isles" (very long — floor it),
  "List of mountains in Italy / Spain". `jsonFile` must be
  `["mountains.json","minor-peaks.json"]`. Tag volcanoes from the infobox's
  `type` / `volcanic_arc` / `last_eruption` (plugs, necks, laccoliths are
  not volcanoes); themes `the Alps`, `Scotland`, `England or Wales`,
  `volcanoes` — the audit will refuse every untagged Alpine peak on "Name a
  mountain in the Alps", so tag as you fold (the description or the
  infobox's `range` field; Wikidata P4552 is the honest way).
- **Islands** (`us-islands.json`): category tree to the county level plus
  lists; **floor 1 km²**, `famousViews 1000`; `notKindExemptTitle` so an
  island whose article is its town/parish counts; `validate` lists islands
  without coordinates → `add-oceans.mjs`; **inland islands (lakes, rivers)
  need `[]` in `OCEAN_OVERRIDES`** — the coordinate box puts a Lake
  Constance island "in the Atlantic" otherwise (77 US rows were fixed after
  the audit). Themes: `the Mediterranean`, `Greece`, `Scotland`. Expect ~40%
  of islands to have no area anywhere (decision 1).
- **Seas / bays / straits** (`us-seas.json`): roots per kind at the country
  level; the worldwide "List of straits" / "List of gulfs" pull in the whole
  world (`work/us-seas.json` already holds ~180 non-US straits and gulfs
  with descriptions — Europe's are in there); almost none has an area →
  decision 1 first. Straits carry their bare name as an alias (Gibraltar,
  Dover, Bonifacio). Theme `Europe` (sea).
- **Deserts**: tiny for Europe (Tabernas, Bardenas Reales, Oleshky is
  Eastern); one small chunk, `the Americas`/`Africa`/`Asia` themes don't
  apply — none for Europe exists; add rows theme-less.
- **Cities** (`us-cities-50k.json`): lists only ("List of communes in France
  with over 20,000 inhabitants", "List of cities in Germany by population",
  "List of ONS built-up areas in England by population", "List of cities in
  Italy", "List of municipalities of Spain", "List of cities in the
  Netherlands by province", "List of cities in Belgium", "List of cities and
  towns in Austria", "List of cities in Switzerland", "List of cities in
  Portugal", "Urban areas in the Republic of Ireland"); `sizeProp P1082`,
  **floor 50,000**; `--country="<exact data-countries.mjs name>"` — one
  chunk per country (the fold needs the Country column). Watch: the national
  capital is refused by the fold (right); a city that is a country's or an
  island's name is refused (right); NY-style "towns" that are county
  subdivisions with 800k people came through the US list — Europe's
  equivalents are metropolitan/comarca/arrondissement articles; `--check`
  reads village / municipality / comune / unincorporated community as a
  city. The fuzzy list is the payoff: Greenville was being scored as
  Grenville, Grenada.

## Lessons the US wave paid for (read before the first probe)

- **The `taken` list is a wrong-article detector.** When a probe says "X is
  the bank's X = <obscure article>", compare the bank row's size with the
  candidate's: Fox (300 km) scored on Fox River (Alaska) but was sized for
  the Illinois one; Current, McKenzie, Rainy, Brandywine, Lake Crescent,
  Jackson Lake, Bear Mountain (a *list* article), Dauphin Island (a bridge),
  San Francisco Bay (the Bay Bridge), St. Simons, Humber (Ontario's, themed
  as England's — still open). Re-point with `fix-titles.mjs`.
- **The `fuzzy` list is the payoff**: every row there fixes a wrong
  acceptance (Sheyenne → Cheyenne, Biscayne Bay → Bay of Biscay, Greenville →
  Grenville). But adding a row also *pre-empts* corrections: Weiser blocks
  "Weiser" → Weser, Redding "Redding" → Reading, and a new near-neighbour of
  a famous name turns a typo into a refused tie (Mount Raimer / Rainier,
  Towson / Tucson). The audits list these; drop the 30-view ones, keep the
  real places.
- **Wikidata sizes**: hectares as km² (100×) for lakes, miles as km for
  rivers, frwiki decimal shifts (1127 for 112.7), a range's high point for a
  range, "height above the sea floor" for seamounts, a town's total area
  (water included) for an island. The infobox wins; `article-size.mjs`
  prints the disagreements — eyeball them.
- **Description vetoes are not enough**: concept articles ("Volcano",
  "Summit", "Ultra-prominent peak" at 6,940 views), groups (Pribilof
  Islands, Great Lakes, Belgrade Lakes), former lakes (Agassiz, Allison,
  Palomas), protected areas, roads, the state itself (Rhode Island, Greece
  NY), county subdivisions (the Town of Hempstead). Scan the chunk's names
  and the probe's descriptions before folding; the audits catch the rest.
- **Themes must be extended with every chunk** or the themed prompt refuses
  the new rows: Hawaii (9 islands), volcanoes (64 by infobox), saltwater,
  the Caribbean (Navassa) were all missed first time. `fold.mjs` adds the
  themes named in the chunk's last column; put them there.
- **Oceans are derived from coordinates** — every lake/river island needs
  an override.
- **Names people type**: strip ", State"; no ʻokina / diacritics the matcher
  won't fold (Kaʻula → Kaula with the original as an alias); a two-place
  article ("Lake Hamilton and Lake Catherine", "Randalls and Wards Islands")
  is named for one with the other as an alias; townships and "X Reservoir"
  rows need the bare name reachable (reservoir is filler now; townships got
  aliases); a name that is a *concept* or a *letter* ("A Peak", "D River")
  is a jackpot for one keystroke.
- **Bare English-word rivers** (Big, Bad, Elk, New, Sun, Little, Middle,
  South, Spring, Wind, Dry…) went in as the world names them; the matcher
  gives ≤ 4-letter names no fuzzy slack. Fine, but every one of them is also
  a country/city/mountain name's loose form on the wrong round (decision 4b).
- **Cache hygiene**: the probe memoises sizes per QID and views per title
  inside `work/<name>-cache.json` (batch-URL caching refetched 25 minutes
  when the batches shifted); raw Wikidata answers are not cached (536 MB
  and `JSON.stringify` died). If a run dies, re-run — it resumes.
- **Every chunk moved the pin once and the draw twice**: `MAX_ELIGIBLE_SHARE`
  is bank-dependent, so a big fill can silently retire a prompt. The
  gameplay audit's "next 30 dailies old vs new" check catches it; read the
  guard counts it prints.
- **The size-unknown wall** (decision 1) took out more places than any
  floor: 652 bays, ~1,100 islands, 10 deserts. Ask about it before the
  islands and seas probes.
- **Audits earn their keep, and cost**: ~250–440k tokens each, ~25–35 min,
  Opus. Two at a time per chunk pair worked; three is the user's cap. Give
  them the pre-wave commit, the probe/sizes/wikitext files, and the report
  path; say "no network" for gameplay and "one request per 3 s if you must"
  for data. Copy every report into `reports/`.
- **Checkpoint commits**: a session cut-off loses nothing if every fold is
  committed with its pipeline green. The user watches their usage limit and
  has hit it mid-session.

## Also queued, lower

- The ~180 non-US straits and gulfs in `work/us-seas.json` (Danish Straits,
  Cabot, Tablas, Ombai, Kara, Foxe Basin, Gulf of Fonseca, Peter the Great
  Gulf…) — many with figures; each belongs to a later wave.
- `river-humber` scores on Humber River (Ontario) while themed as England's.
- **Docs that lag the bank:** `README.md` says "1,719 places"; SPEC §6's
  count table is at v1.1 numbers; `dist/wormillion.html` is the pre-expansion
  bundle (`npm run bundle`).
- **Nobody has played the 12,000-place bank for feel.** Three `?debug` runs
  and a note of what felt off would be worth an hour.
- No social-preview metadata (Open Graph); a named leaderboard; page weight
  (1.55 MB, gzip ~300 KB; nobody has complained).

---

# State of the world

## Where it lives

- **Repo:** https://github.com/MichaelBoujikian/wormillion (public; `gh` is
  authenticated, `git push` just works). **Both waves live on branch `expansion`**
  (pushed; CI runs on it). `main` is at `ffeceaa` = what Netlify serves.
- **GitHub Pages:** https://michaelboujikian.github.io/wormillion/ — every push
  to `main` deploys within a minute or two (`deploy.yml`); `ci.yml` runs
  test + validate on every branch.
- **Netlify:** https://wormillion.netlify.app — serves `1eaa3fb` (verified
  live 2026-09-15 ~20:30 PDT, see below). **Auto-deploy is locked by the
  user**; a Netlify release is now their deliberate act (unlock / "Trigger
  deploy" in the dashboard; the build runs `npm test && npm run validate` as
  a gate). Functions at `/.netlify/functions/daily-submit` and `daily-stats`;
  Blobs store `daily`.
- **Local:** `C:\Users\smite\repos\wormillion`. Double-click `play.cmd` to play.
  `npm start` serves on :8123 (`.claude/launch.json` names it `wormillion` for
  the in-app browser pane) **and mounts the comparison API over an in-memory
  store**, so the whole server flow plays locally.

## Netlify, verified live on the new bank (2026-09-15 ~20:30 PDT)

After the user bought the month: bank.js 1,260,546 bytes and the new matcher
served; function cold start 0.7 s with the 1.2 MB bank; `daily-stats` returns
15 prompts; the server's draw for 2026-09-16 is the new bank's; CORS preflight
from the Pages origin OK; closed day → 409 `closed`, stale draw → 409
`draw-mismatch`, unfitting answer → 400 `round 1: unrecognized`; a full daily
played in the browser on the Netlify URL submitted and showed "Better than
56% of 123 diggers today". One bug found and fixed on the spot (`1eaa3fb`):
curl checks with no `Origin` primed the 60 s edge cache with a CORS-less copy
of `daily-stats`, and the Pages copy's cross-origin fetch failed until
`Vary: Origin` became unconditional — re-verified from the Pages origin.
Known wart, self-healing: dig #5 (2026-09-16) was created under the old bank
(10 submissions, draw `aac244b0`) and then took new-bank ones, so its
per-round lines mix two prompt sets for that one day.

Re-verification checklist for any future Netlify release, in order: (1) build
log — both functions bundled (a failure points at `import daily from
'./lib/daily.js'`, CJS from ESM, or `included_files` in `netlify.toml`);
(2) `curl ".../daily-stats?day=YYYY-MM-DD"` — JSON with `count`, `prompts`
(15), `number`; a 500 naming `bank.js` means `findRoot()` in `lib/daily.js`
needs another path; (3) the three rejection curls above; (4) play a daily on
the Netlify URL and watch the block; (5) from the Pages origin, `fetch` the
stats cross-origin (CORS admits `https://michaelboujikian.github.io`; **if the
Netlify site is ever renamed, change `REMOTE_API` in `compare.js` and
`ALLOWED_ORIGINS` in `lib/netlify.mjs`**). A day's aggregate can be rebuilt
from its submissions with `createDailyApi(...).rebuild(day)`; no endpoint on
purpose. Harmless rows `smoke-test-0001/0002` sit in dig #1.

## How it got here (short; details in SPEC §13, `reports/`, and git log)

v1.0–1.2 built the game: nine categories, pageview-based scoring, fuzzy
matching, the prompt-modifier system, the pixel-art dig scene, jackpot and dud
overlays, the summary ladder. 2026-09-13: daily + endless modes, the -dle kit
(share, streak, review), the daily comparison on Netlify. 2026-09-14/15: the
expansion from 2,016 to 8,967 places by seventeen Sonnet sub-agents, folded
and audited (`39534ba`, `14fb3b9`). 2026-09-15 evening: the three coverage
probes (`reports/2026-09-15-colombia-rivers.md`, `-us-cities.md`,
`-sweden-lakes.md`), 66 Colombian rivers + 249 US cities + 24 Swedish lakes
folded, the matcher's edit-budget change (SPEC 3.7), two Opus audits
(`reports/2026-09-15-post-fill-*.md`) and their fixes (`c07c7f9`,
`4203814`), the Netlify deploy and its verification. 2026-09-16 (overnight):
the US wave on `expansion` — seven probes, ~2,700 rows folded, eight Opus
audits, two matcher/letter-rule changes, `HANDOFF` rewritten for Western
Europe.

---

# Reference

## Where the logic lives

| want to change… | file |
|---|---|
| the places themselves | `scripts/data-physical.mjs`, `scripts/data-countries.mjs` (pipe-delimited) |
| the US state capitals | `scripts/data-us-states.mjs` (they feed the `capital` cohort, like minor peaks feed `mountain`) |
| the non-capital cities | `scripts/data-cities.mjs` (`Name\|Country\|population\|aliases`; Country must be a `data-countries.mjs` row; the build refuses a city that is its country's capital; its header comment is the rulebook) |
| **finding gaps, adding places in bulk, fixing a wrong article, merging a duplicate** | **`scripts/expansion/` — read its README first**: `probe.mjs` + `probes/*.json` (does the bank have every X of country Y?), `fold.mjs` (chunk → sources, with the collision rules), `article-size.mjs` (infobox figures, beats Wikidata), `chunk.mjs` (probe → fold chunk), `auto-titles.mjs` (re-point bad Wikipedia titles), `fix-titles.mjs`, `drop.mjs`, `add-alias.mjs`, `add-oceans.mjs`, `append-row.mjs`, `wp-check.mjs`, the sub-agent `BRIEF.md`, the audit `AUDIT-BRIEF.md`, and the audit and probe reports under `reports/` |
| which colours a country's flag has | `scripts/data-flags.mjs` (one row per country; generous) |
| which places a themed prompt accepts | `src/data/themes.js` (hand-edited, shipped as-is; a theme with custom prompt text goes in `WORMILLION_THEME_PROMPTS` at the bottom) |
| which Wikipedia article an entry scores on | `scripts/data-wiki-titles.mjs` (`WIKI_TITLES` overrides, `WIKI_VERIFIED` "I looked, it's right") |
| which ocean an island/sea is in | derived from coordinates in `scripts/data-oceans.mjs`; hand corrections in `OCEAN_OVERRIDES` there |
| what `--check` refuses (disambiguation, wrong subject, airport-type articles) | `scripts/fetch-pageviews.mjs` (`EXPECTED` words per category, `WRONG_SUBJECT`) |
| how prompts are worded / drawn / ramped / weighted | `src/js/promptBank.js` (`NOUN`, `PLAIN_TEXT`, `CATEGORY_LABEL`, `SIZE_RULES`, `drawModifier`, `drawSlots`) |
| which spellings feed the letter rules | `src/js/promptBank.js` (`variantsOf`, `LETTER_FILLER`, `WHOLE_NAME_CATEGORIES`) |
| how answers are matched (aliases, loose, fuzzy) | `src/js/matching.js` (`FILLER`, `nearest`) |
| what advances a round, retries, the miss hints, the cross-category nudge, the summary ladder, the run's mode | `src/js/run.js` (hint *wording* is in `ui.js`) |
| the review rows and the rarest answer per prompt | `src/js/run.js` (`reviewRun`, `rarestFor`) |
| the daily's seed, the date key, the pinned sequence, the puzzle number, the countdown | `src/js/seed.js` (`DAILY_NAMESPACE`; bump it on purpose, never reseed by accident; `DAILY_EPOCH` is dig #1) |
| the daily lock, the mode chips, `?daily`, the countdown, the share/review buttons | `ui.js` (`refreshTitle`, `modeText`, `startRun(mode)`, `copyShare`, `showReview`) |
| the share text and its emoji bands | `src/js/share.js` (`BANDS`, `CANONICAL_URL`) |
| streaks, daily stats, which records get trimmed, `rounds` on a record | `src/js/persistence.js` (`dailyStreak`, `dailyStats`, `trim`, `toRecord`) |
| the comparison's server logic: replay, open window, aggregate shape | `netlify/functions/lib/daily.js` (`OPEN_BEFORE/AFTER`, `SCORE_BUCKET`, `replayRun`, `applySubmission`) |
| the comparison's HTTP: CORS origins, cache, Blobs adapter | `netlify/functions/lib/netlify.mjs` (`ALLOWED_ORIGINS`, `corsHeaders` — `Vary: Origin` on every response), the two handlers |
| the comparison's wording and percentile maths; where the API is | `src/js/compare.js` (`REMOTE_API`, `lines`, `betterThan`) |
| the comparison's fetch/cache/render | `ui.js` `compareDaily` (`COMPARE_FRESH_MS`) |
| points, the dig curve, the jackpot and dud bars | `src/js/rarity.js` |
| the strata bands and palette | `src/js/strata.js` |
| the pixel-art scene, relics, crater widths, the rotten worm | `src/js/worldRender.js` (no `document` — takes canvases) |
| the "ONE IN WORMILLION" burst | `src/js/jackpot.js` (canvas only); overlay markup/CSS `.jackpot*` in `index.html` / `styles.css` |
| the 0% "DIG DEEPER NEXT TIME" drips and flies | `src/js/dud.js` (canvas only); overlay markup/CSS `.dud*` |
| the 12×12 category icons | `src/js/icons.js` (character maps) |
| all DOM | `src/js/ui.js` — the *only* module allowed to touch `document` |

## The data pipeline — in this order, every time the bank changes

```bash
npm run fetch-pageviews -- --check   # resolve titles; lists missing / disambiguation / wrong-subject / wrong-category
npm run fetch-pageviews              # 60 days of pageviews + coordinates for anything new (cached)
npm run build-data                   # fold pageviews/oceans/flags into src/data/*.json and bank.js
npm run validate                     # schema, aliases, loose-form collisions, regions, oceans, flags, capitals-vs-cities, UN audit, themes
npm test && npm run gap-check        # then commit
```

- **`--check` is the important half**: besides disambiguation pages and
  descriptions that don't read like the category, it refuses any article whose
  title or description reads like an airport, station, school, hotel, stadium,
  club, crash, film… (`WRONG_SUBJECT`). Fix with `WIKI_TITLES` or
  `WIKI_VERIFIED` (`fix-titles.mjs`); the "reached their article through a
  redirect" list is informational.
- `build-data` refuses to run if any entry lacks pageviews — deliberate.
- `src/data/pageviews.json` is committed, so `build-data` works offline.
  Responses cache under `scripts/.cache/` (gitignored). `titles.json` there
  also holds every article's description and coordinates — an audit can check
  "right place" offline from it. A top-up of a few hundred entries takes a
  few minutes; the full ~9,300 takes tens of minutes — run it in the
  background.
- `build-data` rewrites every category file's `source` date stamp; commit
  them all with the change (the 2026-09-15 commits did).
- A new island or sea gets its ocean from coordinates; if the article has
  none, `validate` names it and `add-oceans.mjs` writes the override.
- A new country needs a row in `scripts/data-flags.mjs`; a new city's
  `Country` must match a `data-countries.mjs` name exactly and not be its
  capital; a place that belongs to a theme must be added to `themes.js` too —
  a themed prompt rejects what's outside its set.
- Scoring magnitude = median of 60 daily English-Wikipedia views × 30.44. It
  measures *curiosity*, not fame. `npm run score-report` prints the curves.

## Every knob and where it is set today

| knob | value | where |
|---|---|---|
| categories per run | 9 categories, 15 slots: every category once, six of them twice | `CATEGORIES`, `drawSlots()`, `promptBank.js` |
| plain opening rounds | 2 | `OPENING_ROUNDS`, `promptBank.js` |
| modifier chance, rounds 3→15 | 70% → 100% (~11.4 conditional rounds of 15) | `MODIFIER_CHANCE_START/END`, `promptBank.js` |
| flag-prompt weight in the modifier draw | 2 (same as region/theme/ocean/letter; 1 for size) → ~0.6 flag prompts per run | `options.push('flag', 'flag')` in `drawModifier()` |
| generated-modifier guard | ≥ 6 answers and ≤ 60% of the cohort | `MIN_ELIGIBLE`, `MAX_ELIGIBLE_SHARE`, `promptBank.js` |
| city region prompts | only regions with ≥ 6 cities | `regionOptions()`, `promptBank.js` |
| city size thresholds | 500k / 1M / 5M / 10M, city-proper population | `SIZE_RULES.city`, `promptBank.js` |
| fuzzy edit budget | 0 edits for a stripped name of ≤4 letters, 1 for 5–7, 2 for 8–11, 3 beyond; +1 for a ≥4-letter name typed with a generic word the entry also carries | `slackFor`, `nearest`, `matching.js` |
| matching filler words | mount, mt, mountain, peak, hill, lake, loch, lough, llyn, river, rio, sea, ocean, gulf, bay, island(s), isle(s), desert, the, of, city, saint, st, cape, atoll, **reservoir** | `FILLER`, `matching.js` |
| letter-rule filler | the matching set minus loch/lough/llyn/saint/st/cape/rio (those are letters where they are the name), **plus, for rivers only, creek/fork/branch/run/brook/kill/wash/slough/draw** (bayou and arroyo lead the name like rio); whole-name categories (country, capital, city, sea) strip only "the" | `LETTER_FILLER`, `LETTER_ONLY_FILLER`, `letterFillerFor`, `promptBank.js` |
| letter-rule miss text | names the word that didn't count: "Bear Creek has no double letter (Creek doesn't count)" | `letterMissText(name, rule, category)`, `promptBank.js`; wired in `ui.js` |
| dig below the jackpot bar | `rarity × 70` | `DIG_SCALE`, `rarity.js` |
| jackpot bar | rarity ≥ 0.85 | `JACKPOT_RARITY`, `rarity.js` |
| jackpot dig / perfect dig | 75 / 100 ("perfect" = rarity ≥ 0.995, shows as 100%) | `DIG_JACKPOT`, `DIG_PERFECT`, `PERFECT_RARITY`, `rarity.js` |
| points | 50–1000, gamma 1.4 below the bar; flat 950 for 85–99%, 1000 for 100% | `POINTS_*`, `POINTS_JACKPOT`, `rarity.js` |
| dud bar | rarity < 0.005 (shows as 0%) | `DUD_RARITY`, `isDud`, `rarity.js` |
| depth budget | 1500 (= 15 × 100); strata bands 100 each, Core from 600 | `TOTAL_DEPTH_BUDGET`, `rarity.js`; `strata.js` |
| jackpot hold; confetti/bolt rates | 10 s or the next answer; 70/s + bolt every 0.12 s → 14/s + 0.55 s → 5/s + 1.4 s | `HOLD_SECONDS`, `rates()`, `jackpot.js` |
| dud hold; drip/wisp rates; flies | 10 s or the next answer; 14 drips/s → 3/s → 1.2/s; 5 flies | `HOLD_SECONDS`, `rates()`, `FLIES`, `dud.js` |
| tunnel radius | 6; jackpot 11; perfect 14; blends over 6 depth units | `TUNNEL_R`, `TUNNEL_R_BY_TIER`, `TAPER_UNITS`, `worldRender.js` |
| relic spacing | one every ~11 units above depth 500, ~20 below | `paintRelics()`, `worldRender.js` |
| daily turnover | local midnight (`seed.dailyKey()` is the local YYYY-MM-DD) | `seed.js` |
| daily plays per day | 1 (`persistence.dailyResult(today)` locks the button) | `ui.js` |
| dig #1 | 2026-09-12 | `DAILY_EPOCH`, `seed.js` |
| share grid bands | miss ⬜ · 0% 💀 · <25% 🟫 · <50% 🟧 · <70% 🟨 · <85% 🟩 · jackpot ⭐ · 100% 💎 | `BANDS`, `share.js` |
| share link off the web | GitHub Pages URL | `CANONICAL_URL`, `share.js` |
| history cap | 50 endless runs; dailies never trimmed | `HISTORY_CAP`, `trim()`, `persistence.js` |
| streak shown on the title | from 2 days | `refreshTitle`, `ui.js` |
| submission window | a day is open from 1 day before to 2 days after (UTC) | `OPEN_BEFORE`, `OPEN_AFTER`, `lib/daily.js` |
| stats cache | 60 s at the edge; 60 s in the client | `daily-stats.mjs`, `COMPARE_FRESH_MS` |
| CORS origins | Netlify itself, `https://michaelboujikian.github.io`, `http://localhost:8123` | `ALLOWED_ORIGINS`, `lib/netlify.mjs` |
| Pages copy's API | `REMOTE_API = 'https://wormillion.netlify.app'` | `compare.js` |
| pageview window / metric | 60 daily counts, median × 30.44 | `DAYS`, `monthlyFromDaily`, `fetch-pageviews.mjs` |

What the audits measured against them (2026-09-16): nothing below
`MIN_ELIGIBLE` except the deliberate tight themes; two prompts retired by
`MAX_ELIGIBLE_SHARE` this wave (lake < 100 km² at 60.0%, city flag blue+white
at 60.1%) and "city flag blue+red" at 55% next; the next 30 dailies
generate cleanly with no repeated text within a day; jackpot share per
cohort 0.8–4.0% (mountains were 45% before the re-cut).

## Environment gotchas (this machine)

- **Node is not on the Bash tool's PATH.** Prefix with
  `export PATH="$PATH:/c/Program Files/nodejs"` (Node 24.19), or use the
  PowerShell tool with
  `$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")`.
- **The Bash tool's timeout maxes at 600 s** and a longer command is moved to
  the background with its output in a file. Start anything over ~5 minutes
  (the pageview fetch, a title-resolver pass, a probe) with
  `run_in_background` and wait for the notification. Don't chain `sleep`s —
  an `until <check>; do sleep 2; done` loop is allowed.
- **Wikipedia throttles hard** ("You are making too many requests" as a text
  body, not JSON) — from the first request, all night: ~5 s per request
  effective. A state-tree probe is ~1 h, an article pass ~1 h, a views pass
  over 4,000 titles ~1 h; the 42,857-title cities probe ~3 h. **A stray
  side request 429s the running probe** — don't even curl. Every resolver here sleeps ~1 s per request and backs off;
  the `prop=pageviews` endpoint fills in a handful of titles per round trip
  and hands back `pvipcontinue` — the nulls mean "not yet", not zero. Never
  run two of `probe.mjs`, `auto-titles.mjs`, `fetch-pageviews` at once. All
  three cache locally, so a re-run costs nothing for what is known.
- **Quoted heredocs (`<<'EOF'`) are fine for data**, but the Bash tool collapses
  `\\` to `\` inside them — a JS regex like `/[.*+?^${}()|[\]\\]/` or `\s` /
  `\d` written through a heredoc arrives broken (it bit twice today). Write
  scripts and JSON configs with the Write tool.
- **A Python patcher turns `\\b` into a backspace byte.** Use the Edit tool for
  single-line edits; all of `src/` is LF.
- **Line endings are mixed on disk**; git normalises to LF (`.gitattributes`),
  so it warns "CRLF will be replaced by LF" on every commit — harmless. The
  expansion scripts detect a file's EOL before writing.
- **The local date is what matters** for dates in reports and commits (the
  machine is US Mountain/Pacific; UTC is already tomorrow in the evening).
- **One commit per change** is the house rule; a data expansion is one commit
  per chunk or per wave, with a local checkpoint after each fold so a session
  cut-off loses nothing.
- **Sub-agents default to Sonnet unless the user names a model for the job**
  (they asked for Opus for the audits, up to three at a time, writing their
  report as they go — `AUDIT-BRIEF.md`). **For data work: at
  most two at a time, appending to their output file every ~30 rows, one
  category × region each.** Seven Opus agents launched together once all died
  on the session cap with zero rows. Their brief is
  `scripts/expansion/BRIEF.md`. Audit agents (read-only, one report each,
  written to the scratchpad and copied into `reports/`) cost ~200–250k tokens
  each today and earned it. A rate-limited agent retried a minute later
  usually goes through.
- **ESM imports on Windows need `file:///C:/...` URLs** when importing a repo
  module from outside the repo; `createRequire(import.meta.url)` loads the
  classic-script modules from an `.mjs`. `netlify/functions/lib/daily.js`'s
  `loadBank(root)` is the easiest way to get the real bank in a script.
- **CSS class names are global**, and `[hidden]` must keep winning (global
  `[hidden] { display: none !important }`).
- **The test file glob must stay `node --test` with no arguments** (Node 20/22
  on Linux CI doesn't expand a quoted glob the way Node 24 on Windows does).
- `Claude in Chrome` is not installed, so `file://` can't be opened in the
  in-app pane; use the dev server (`preview_start` by name `wormillion`).
  The pane can open the live sites too (`navigate` to the URL).

## Driving the game from JS (browser pane, `?debug`)

`window.__wormillion` exposes `renderer`, `burst`, `drip`, `currentRun()`,
`start(mode)`, `diveTo(depth, tier)`, `celebrate()` and `shame()`.

- **The pane pauses `requestAnimationFrame` when hidden.** Pump frames:
  `for (let i = 0; i < 90; i++) __wormillion.renderer.update(0.05); __wormillion.renderer.draw();`
  — that completes a dive and fires `onArrive`, which advances the round.
- **To play a whole run from JS** (done today on the live Netlify site): loop
  over rounds; each round read `run.prompt().text`, set `#answer-input.value`,
  dispatch `input`, `#answer-form.requestSubmit()`, read `#feedback`, pump
  the renderer, wait ~150 ms; after the last round wait ~4 s and read
  `#summary-compare`. `run.rarestFor(prompt)` gives the ★ answer.
- **Rounds are 30 s and tool round-trips are slow.** Do set-slot + submit +
  read-feedback in ONE `browser_batch` / one JS call. The 10 s overlay holds
  expire between tool calls too. `location.reload()` inside a JS call kills
  the call — reload with `navigate` instead.
- To force a prompt: `const run = __wormillion.currentRun(); run.state.slots[run.roundNumber - 1] = { category: 'city', region: 'Caribbean' };`
  then repaint `#prompt-text` from `run.prompt().text`. Slot shapes:
  `{category}`, `{category, region}`, `{category, theme}`, `{category, ocean}`,
  `{category, flag:{colours:[…]}}`, `{category, size:{op,value}}`,
  `{category, letter:{kind,letter}}`.
- **Known ≥85% answers for the jackpot (2026-09-15 bank):** Micronesia (100%) /
  Togo for country; South Tarawa / Funafuti for capital; Musanze / Salelologa
  / Auki for city; Grand Manan / Dolsan for island; Pihlajavesi / Storavan for
  lake; Tandikat / Chiaksan for mountain; Mecaya / Aquio / Canoas for river;
  Erg Iguidi / Skeleton Coast for desert; Bay of Pomerania / Gulf of Masirah
  for sea. **Known 0% answers for the dud:** New York on a city round, United
  States on a country round, Mount Everest on a mountain round, Antarctic
  Desert on a desert round. `celebrate()` / `shame()` fire either without one.
- `diveTo` never moves the worm upward; call `renderer.reset()` first.

## Decisions a new session should not undo

- **Fuzzy matching stays, with its guards.** The user asked for autocorrect
  ("sahra → Sahara is exactly what I want"). Guards (SPEC 3.7): no slack for
  a stripped name of ≤4 letters; ties refused; no substring matching; the
  edit budget comes from the name with generic words stripped ("Lake Tåkern"
  gets one edit, so it is refused rather than corrected to Lake Vänern); both
  the whole string and the stripped forms are compared ("Kilimanjro" finds
  Mount Kilimanjaro); a whole-string hit beats a stripped-form hit at the same
  distance ("Lotse" is Lhotse, not a tie with Lose Hill); a generic word typed
  *and* carried by the entry is worth one edit even for a four-letter name
  ("Mount Fugi"); the cross-category nudge compares whole names only. An exact
  name anywhere beats a correction anywhere. A tie that refuses ("Tames":
  Thames/James) is the guard working.
- **`rio` is a filler word for matching but a letter where it is the name**
  (the Rio Grande starts with R; "Rio Bogotá" the alias does not make Bogotá
  start with R). A "convenience alias" — the name with generic words added or
  removed — never feeds the letter rules in the non-whole-name categories.
- **Filler is optional in both directions, and initialisms are for typing
  only.** "Everest" finds Mount Everest *and* "Mount Denali" finds Denali. A
  2–4-letter all-caps alias (NYC, UAE, SF) never feeds a letter or length rule.
- **"Strait" is not a filler word** — straits carry their bare name as an
  alias instead (Gibraltar, Hormuz, Dover, Magellan…).
- **A shared loose form goes to the entry that owns it by name** ("Arabian" →
  Arabian Sea). Two names, or two aliases with no name, identify neither, and
  `validate` fails on the alias-vs-alias kind so one can't ship.
- **Filler words are not letters; whole official names are.** Countries,
  capitals, cities and seas keep their whole official name
  (`WHOLE_NAME_CATEGORIES`). Length rules judge the spelling typed or its
  generic-word-trimmed form, whichever fits. Digits are characters (K2).
  (2026-09-16, user's decision) `reservoir` is a matching filler word like
  `lake`; creek/fork/branch/run/brook/kill/wash/slough/draw are **letter-only**
  filler for rivers — identifying for the matcher (Bear Creek is not Bear
  River), generic for the letter rules ("Bear Creek" no more ends in K than
  "Lake Tahoe" ends in E); bayou and arroyo lead the name like rio. A miss
  says which word didn't count — the user asked for that hint.
- **Entries are named as the world names them.** No bank-invented
  disambiguators; real names that carry a generic word stay. A parenthetical
  in a name (`Krka (Croatia)`, `Tana River (Kenya)`) is only there when
  Wikipedia's own title has it and the bare name is taken in the cohort.
- **One real place, one row.** The same river under two names, a lake and
  "its" reservoir, a peak and its twin on one article — merge into aliases of
  the surviving entry. Two rows sharing a `wikiTitle` in one cohort is a bug
  (seven such pairs were found and fixed on 2026-09-15).
- **An entry scores on its own article or not at all.** `--check`'s
  `WRONG_SUBJECT` refuses parks/districts/airports; `WIKI_VERIFIED` is for
  "the description just doesn't say *city*", never "close enough". The two
  polar deserts scoring on `Antarctica`/`Arctic` are the one deliberate
  exception.
- **A bare name that belongs to a far more famous place already in the bank
  is not free** (Georgetown TX, Athens GA, Edinburg TX were dropped for it).
- **Generosity is the house style.** Emblem colours count for flags, island
  nations are islands, Cape Town and La Paz are cities, a wrong-category
  answer gets a nudge rather than "Not recognized". **Bias data toward
  inclusion** — but with sourced figures, never invented ones.
- **The city cohort excludes national capitals, and every city prompt says
  so.** US state capitals are cities too (all 50 are in both cohorts). A city
  may not share a name with a country or island in the bank.
- **Ocean membership is derived, not curated**; `coastal` is likewise derived.
  Everything else themed *is* curated on purpose.
- **15 rounds, each category once or twice, two plain rounds to open, ramp
  70→100%.** The user asked three times for more conditional prompts.
- **US state capitals live in the `capital` cohort with the US population as
  `size` and the US flag**; their `city` rows carry the city population.
- **The jackpot and dud tiers are symmetric by design.** `POINTS_GAMMA` was
  taken off the list by the user; leave it.
- **A themed sea prompt says "sea" unless the theme holds an ocean.**
- **Letter-rule misses say which letter.**
- **`file://` must keep working.** Classic scripts + generated `data/bank.js`,
  no ES modules, no external resources. The one `fetch()` (the comparison) is
  optional and guarded. Don't split the bank across files.
- **The server scores; the client only sends names.** Keep `lib/daily.js`
  free of `@netlify/blobs` so the suite runs without an install.
- **`ui.js` is the only module that touches `document`.**
- **Daily and endless differ in exactly one thing: the rng behind
  `drawSlots`.** `tests/seed.test.js` pins the 2026-09-12 sequence and
  `tests/prompts.test.js` pins dig #1's fifteen prompts. Growing the bank does
  not break the pin; reordering categories, regions or themes would.
- **Tests don't pin which entry is rarest.** Assert that whatever `rarestFor`
  returns is accepted — the bank will grow again.

## Open threads and judgment calls (none urgent)

- **130 US cities whose name is held by another place** (Portland ME,
  Birmingham AL, Cambridge MA, Toledo OH…) — decision 5. **55 Colombian
  rivers** have no length figure anywhere; **652 US bays, ~1,100 US islands,
  10 US deserts** have no area — decision 1. **Sweden's 164 lakes under 30
  km²** were left out on purpose.
- **"Isle of White"** lands on New Zealand's White Island through the loose
  pass; **"Rock Island"** on Palau's Rock Islands; **"St. George, Utah"** is
  accepted as George, South Africa because `st` is filler. Each fixable with
  an alias or a rule; each has a side effect on the letter rules.
- ~45 of the US "cities" are census-designated places or unincorporated
  communities (Paradise NV, Metairie, Bethesda, The Villages, East Los
  Angeles…): real places outside the rulebook's "administrative city"; 30
  are townships (Upper Darby Township, with a bare alias). Torbes and Uribante are Venezuelan rivers in the
  South America theme. "Toms River" / "Grand Island" / "Cape Coral" count as
  short city names via their trimmed form (documented).
- **Antarctic Desert / Arctic Desert** score on the continent articles and are
  the most "famous" deserts; deliberate, funny as a 0% answer.
- **Bab-el-Mandeb and Hormuz** out-draw the Pacific on news; re-fetch
  pageviews in a few months (delete `scripts/.cache/views-60d.json` first).
- **~140 pattern-flagged candidates** from the 2026-09-15 bank audit (big
  rivers/mountains/cities with very few views) were never individually
  confirmed; `auto-titles.mjs` catches airports but not a plausible wrong
  place. The probes' `taken` lists are the better detector (nine wrong
  articles found that way this wave).
- A *length* prompt refuses an ineligible entry with the generic "doesn't fit
  this one" instead of "is 13 letters — this round wants 5 or fewer" when
  the entry was never in the prompt's lookup (noticed 2026-09-16; cosmetic).
- **The USA outlier** (1.5M views) compresses the country curve; a clipped
  max in `rarityOf` is a scoring change — ask first.
- **Five Malaysian peaks have no theme home**; no `Indonesia`-style theme for
  the Philippines or Japan's mountains either. The user likes new specific
  prompts; a theme is fair game if asked.
- **No social-preview metadata** (Open Graph / Twitter Card) — cheap, real
  value for a game that spreads by sharing. Offered twice; not picked up.
- **The aggregator listing** the daily was built for — not a code task.
- **A named leaderboard** — the natural next server step; per-player
  submission blobs exist.
- **Page weight** — `bank.js` 1.26 MB, gzip ~250 KB; nobody has complained.
- **Population refresh** — declined; revisit only if a player reports a size
  prompt being wrong.

## Things the user has said they care about

- Prompts should be specific and get harder — keep extending. The *question
  itself* must carry any rule that matters, not a badge beside it.
- Answers people obviously reach for must be accepted — `gap-check` is the
  guard (338 answers); add to its list with every chunk, and use
  `scripts/expansion/` to add places, not hand edits.
- Spelling should autocorrect and show the real spelling — done and liked;
  today's guard changes were explained to them and approved.
- Achievement should feel good and failure should sting a little (the 0%
  overlay was their idea, gross on purpose).
- They want to find the answers and the logic in the code — the tables above
  and README's "Where the logic lives".
- **Working style:** they read summaries closely and decide fast. Present open
  decisions as a numbered list with a recommendation each; they answer all in
  one message; then do the whole batch and say at the end whether anything
  needs a second prompt. **Floors: decide on the spot and tell them which.**
  They will step away for hours during probes; carry on to a committed state
  and leave a status message they can read on return. Commit each change separately. Pushes to `main` are
  allowed without asking (but see "Raise this first"). Sub-agents are welcome
  when they earn their keep; they'll say which model.
- **They watch their usage limit** and have hit it mid-session before. Keep
  work in small committed steps, checkpoint before long jobs, and say plainly
  after a cut-off what was kept and what was lost. They will step away during
  long agent runs; carry on to a committed state without them.
