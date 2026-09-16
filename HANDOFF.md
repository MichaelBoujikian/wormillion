# Handoff

For whoever (or whatever) picks this up next, with no other context. `README.md`
explains the game and how to run it; `SPEC.md` is the design source of truth
(v1.3, amendments log in §13). This file is what isn't in either: the job
that's queued, where things stand, every knob and its setting, the decisions
that must not be quietly undone, and the gotchas that cost time. Claude Code's
project memory is keyed to this folder (`C:\Users\smite\repos\wormillion`);
this file is the memory that survives.

Written 2026-09-16, mid-morning, at the end of the overnight session that ran
the **United States wave** of the country-by-country scouring on branch
`expansion`: rivers, lakes, mountains, islands, seas, deserts probed and
filled (cities under 100k still running when this was written), four Opus
audits and their fixes, and a list of rules decisions waiting for the user.

---

# The job: scour the world, country by country

The user's plan, set 2026-09-15 after the probes showed the bank holds each
country's *top tier* and little else:

> Go through each country and scour to get as many places as we can, all
> categories per country, in this order: **United States → Western Europe →
> Mexico and Canada → East Asia → West and Central Asia → South America →
> Central America → North Africa → the rest of Africa → islands.**

Decisions the user took 2026-09-15 (late), all in one message:

1. **Work on branch `expansion`**; merge to `main` only per wave, when they
   also publish Netlify (both hosts stay in sync; see "Pages and Netlify").
2. Order within a country: **rivers → lakes → mountains → islands → seas →
   deserts → cities**. Traps (rivers, lakes) first.
3. **Floors: keep them low, capture a lot; decide on the spot and report the
   choice**; a later wave lowers every floor. Cities: 50,000 this wave.
4. Name-taken places (Portland ME, Birmingham AL, Green River KY, Prince of
   Wales Island AK…) stay out; no comma-form or parenthetical names.
5. **Audits on Opus**, piecemeal with checkpoints, up to three at a time.

## Where the US wave stands (branch `expansion`, 19+ commits ahead of `main`)

| category | probe | added | floor | report |
|---|---|---|---|---|
| rivers | 12,717 articles, 238 present | **949** (+ 5 re-pointed, East River off the Dong) | 80 km, or 1,000+ views/mo | `reports/2026-09-16-us-rivers.md` + two audits |
| lakes | 5,043 articles, 96 present | **372** (+ Lake Crescent, Jackson Lake re-pointed) | 25 km², or 1,000+ views | `-us-lakes.md` + two audits |
| mountains | 4,355 on 39 list pages, 152 present | **676** (2,280 first, re-cut) | 122 views/mo — no elevation floor | `-us-mountains.md` |
| islands | 1,803 articles, 85 present | **318** | 1 km², or 1,000+ views | `-us-islands.md` |
| seas/bays | 951 articles, 111 present | **8** (+ San Francisco Bay re-pointed off the Bay Bridge) | none — but only 11 of 652 have an area | `-us-seas-deserts.md` |
| deserts | 132 articles, 82 present | **2** | none — only 2 of 12 have an area | same |
| cities < 100k | `probes/us-cities-50k.json`, 42,857 candidates | running at hand-off; see below | 50,000 | — |

Bank **11,619** (was 9,300): rivers 3,192 · lakes 1,162 · mountains 1,985 ·
islands 1,663 · seas 261 · deserts 131 · cities 2,781 · countries 197 ·
capitals 247. `bank.js` 1.49 MB. `npm test` 180 · `validate` OK ·
`gap-check` 419 obvious answers land. Every chunk is its own commit; every
probe has a report; the four audit reports are under `scripts/expansion/reports/`.

**If the cities probe is still running or died:** `scripts/expansion/work/
us-cities-50k.out` is its log; re-running `node scripts/expansion/probe.mjs
scripts/expansion/probes/us-cities-50k.json` resumes from the cache (every
title, size and view is memoised). Then `chunk.mjs … --tag=50k --country=
"United States"`, fold, pipeline, commit — the loop below. Expect 45
name-taken cities (Portland ME…) and a handful of CDPs; the previous cities
probe report (`2026-09-15-us-cities.md`) has the pattern.

## Decisions waiting for the user (present as a numbered list, recommend each)

1. **"Size unknown" in the schema.** SPEC §4 says `size > 0`. 652 US bays,
   straits and sounds (Pearl Harbor, New York Harbor, the Golden Gate, Cook
   Inlet, Pamlico Sound…), ~1,100 US islands and 10 US deserts have **no
   area anywhere** and were left out by the sourced-figure rule.
   `satisfiesSize` already treats a non-positive size as "never answers a
   size prompt", and nothing in the UI shows size. Recommend: allow `0`
   (validate `>= 0`, SPEC amendment, `fold.mjs`), then fold them from the
   probe outputs in `work/` (the JSONs are there; `chunk.mjs` needs a
   `--allow-no-figure` switch that writes `0`).
2. **`MAX_ELIGIBLE_SHARE` 0.6 killed "Name a lake smaller than 100 km²"**:
   lakes under 100 km² are 60.0% of the cohort, so the guard refuses the
   rule and dig #1's round 12 became "larger than" (pin updated knowingly in
   `tests/prompts.test.js`). Every wave adds small lakes. Recommend 0.7, or a
   25 km² tier in `SIZE_RULES.lake`.
3. **`reservoir` as a filler word** (45 new "X Reservoir" rows carry a bare
   alias instead). Recommend yes. **`creek`/`bayou`/`fork`/`branch` as
   filler**: recommend no (Bear Creek is not Bear River; 159 creeks would
   collide).
4. **Two `run.js` rule changes** the audits argued for: (a) when the typed
   input carries the *current* category's own generic word ("Lake Meade",
   "Mackinaw Island"), another cohort's loose form must not block the
   in-category spelling correction (five aliases paper over it for now);
   (b) the loose pass should not drop a generic word that names *another*
   category — "Lake Michigan" is accepted as the Michigan River, "Rapid
   City" as the Rapid River (a 950-point jackpot), "Mount Foraker" as
   Foraker River; pre-existing class, 49 new cases. Recommend both.
5. **Same-name second places** — Green River (Kentucky, 618 km), Colorado
   River (Texas, 1,387 km), Fox River (Green Bay), Grand River (Michigan),
   Prince of Wales Island (Alaska, the 4th-largest US island), Black Lake
   ×3, the 45 cities — need a name policy (Wikipedia's parenthetical, reachable
   only by the fuzzy pass). Recommend: not this wave.
6. **"Great Lakes"** typed on a lake round is corrected to Great Lake
   (Tasmania). Recommend an engine guard: never correct a plural onto a
   singular namesake.
7. **Themes**: no lake theme covers North America; `the Rockies` was not
   extended (640 new Rockies peaks answer "isn't in the Rockies") — needs
   Wikidata P4552 (mountain range). Recommend a `North America` lake theme
   and a P4552 pass, next session.
8. Typo casualties the exact-beats-correction rule now causes: "Weiser" →
   Weser, "Sheyenne" on a capital round, "Harlem" → Haarlem. Recommend leave.

## Pages and Netlify

Every push to `main` deploys **GitHub Pages** but not (locked) **Netlify**;
a diverged bank breaks the daily comparison for Pages players on ~2 days in
3. That is why the wave lives on `expansion`: merge to `main` and publish
Netlify (dashboard → unlock / "Trigger deploy") in one go, then re-verify
with the checklist in "Netlify, verified live". The audits measured the next
30 dailies old vs new bank: only dig #1 differs (item 2 above).

## The loop, one country × category at a time

Read `scripts/expansion/README.md` first. What changed this session:

1. **Probe** — `node scripts/expansion/probe.mjs scripts/expansion/probes/<name>.json`
   (copy a `us-*.json`). New config keys: `minSize` (Wikidata size fetched
   first, views only above the floor), `famousViews` (views fetched below
   the floor too; 1,000+/mo lifts an item back in), `notKind` (a description
   veto — "Reservoir on the X River" is not a river), `notKindExemptTitle`
   (lifts the veto when the title says Island — town-on-island articles),
   `jsonFile` may be a list (mountains + minor peaks). Sizes and views are
   memoised per item in `work/<name>-cache.json`, so a re-run after a config
   change fetches only what is new.
2. **Sizes** — `node scripts/expansion/article-size.mjs work/<name>.json
   [--no-figure] [--min-views=N]` reads every article's infobox
   (convert templates, `length_mi`, `area_acre`, `elevation_ft`…), and the
   **infobox always wins over Wikidata** (Wikidata is 100× off for one lake
   in six — hectares — and decimal-shifted for frwiki-imported rivers).
   Then run the probe **again**: it picks up the article figures and fetches
   views for what newly clears the floor.
3. **Chunk** — `node scripts/expansion/chunk.mjs work/<name>.json --tag=<tag>
   --themes="A;B" [--min-views=N]` writes missing + fuzzy rows in the
   bank's naming (title minus parenthetical; rivers bare of "River" unless
   named after a state or country; cities without ", State"). Then hand-edit:
   remove groups, former lakes, protected areas, concept articles (the
   filters catch most; `reports/` list what slipped).
4. **Fold** (`fold.mjs --only=<category>-<tag>`, dry then `--write`), move
   the chunk to `work/folded/`, then the pipeline: `fetch-pageviews --check`
   (verify the "landform" / "town on the island" / "no short description"
   rows with `fix-titles.mjs`), `fetch-pageviews`, `build-data`, `validate`
   (islands without coordinates need `add-oceans.mjs`), `test`, `gap-check`
   (add the headline names), **one commit per chunk**.
5. **Audit per chunk or two**, Opus, data + gameplay in parallel:
   `scripts/expansion/AUDIT-BRIEF.md` is the brief; the task message names
   the commits, chunk files, pre-wave commit and the report path; agents
   write as they go. ~250–440k tokens each. Apply the confirmed fixes, copy
   the report into `reports/`, commit.

Floors used this wave (all "decide on the spot", all reported): rivers 80
km; lakes 25 km²; **mountains 122 views/mo** (the first cut at 30 views —
the cohort minimum — put 1,004 peaks at exactly 30 views because the median
quantises at whole views a day, so 28% of the cohort read 100% and "United
States" was a 1,000-point mountain; jackpot share by floor 30 → 45%, 61 →
24%, 91 → 11%, 122 → 2.2%); islands 1 km²; cities 50,000; `famousViews`
1,000 everywhere it applied.

## Also queued, lower

- **Western Europe** is next in the order: one config per country ×
  category, the same loop. Expect the "size unknown" decision to matter
  (fjords, bays, small islands).
- The worldwide "List of straits" / "List of gulfs" surfaced ~180 non-US
  straits and gulfs missing from the bank (in `work/us-seas.json`).
- **Docs that lag the bank:** `README.md` says "1,719 places"; SPEC §6's
  count table is at v1.1 numbers; `dist/wormillion.html` is the
  pre-expansion bundle (`npm run bundle` makes a ~1.6 MB one).
- **Nobody has played the 11,600-place bank for feel.**

---

# State of the world

## Where it lives

- **Repo:** https://github.com/MichaelBoujikian/wormillion (public; `gh` is
  authenticated, `git push` just works). **The wave is on branch `expansion`**
  (pushed; CI runs on it). `main` is at `ffeceaa` = what Netlify serves
  (plus HANDOFF commits).
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

## Green as of 2026-09-16 mid-morning (branch `expansion`)

`npm test` 180 · `npm run validate` 11,619 entries · `npm run gap-check` 419
obvious answers all land.

**Bank:** 197 countries · 247 capitals · 2,781 cities · 1,162 lakes · 3,192
rivers · 1,985 mountains · 131 deserts · 1,663 islands · 261 seas = **11,619**
(`main` / Netlify: 9,300). `bank.js` is 1.49 MB. ~4,900 `WIKI_TITLES`
overrides. Mecaya
(7 views/mo) is the river cohort minimum and so the ★ "rarest answer" reveal
for plain "Name a river." in about half the dailies — the premise working,
not a bug.

**Dig #1's fifteen prompts changed once, knowingly** (round 12: the lake
size guard — see decision 2; pinned in `tests/prompts.test.js`).
Every daily draws from the current bank, so a data push changes the day's
prompts for anyone who hasn't played yet on that host — see "Raise this first".

## Real players

Submissions per daily on Netlify: dig #1 = 2 (smoke tests) · #2 = 12 · #3 = 56
· **#4 (2026-09-15) = 123** · #5 = 10 by 18:00 PDT. Dig #4's aggregate was the
first human signal on difficulty (old bank): the tight themed rounds were
missed by more than half — "desert in Australia" 67/116, "mountain in
Indonesia" 65, "sea or ocean in the Antarctic" 61 — and "mountain with an R in
it" produced 38 duds (Everest). `curl ".../daily-stats?day=2026-09-15"` has
the per-round numbers. The aggregator listing the daily was built for has not
been named by the user; the players came from somewhere.

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

## How it got here (short; details in SPEC §13 and git log)

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
`4203814`), the Netlify deploy and its verification.

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

What the audits measured against them: no prompt falls below `MIN_ELIGIBLE`
except the two deliberate tight themes (Mesopotamia, the Great Lakes); the
only size prompt near `MAX_ELIGIBLE_SHARE` is "capital whose country has over
10 million" at 58%; the next 30 dailies generate cleanly with no repeated
text within a day.

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

- **45 US cities whose name is held by another place** (Portland ME, Birmingham
  AL, Toledo OH…) — only Wikipedia's comma form ("Portland, Maine") would let
  them in; a rules decision for the user. **55 Colombian rivers** have no
  length figure anywhere (`reports/2026-09-15-colombia-rivers.md`).
  **Sweden's 164 lakes under 30 km²** were left out on purpose.
- **"Isle of White"** lands on New Zealand's White Island through the loose
  pass; **"Rock Island"** on Palau's Rock Islands; **"St. George, Utah"** is
  accepted as George, South Africa because `st` is filler. Each fixable with
  an alias or a rule; each has a side effect on the letter rules.
- 11 of the new US "cities" are census-designated places (Paradise NV,
  Enterprise NV, Metairie…): real 100k+ places outside the rulebook's
  "administrative city". Torbes and Uribante are Venezuelan rivers in the
  South America theme. "Toms River" / "Grand Island" / "Cape Coral" count as
  short city names via their trimmed form (documented).
- **Antarctic Desert / Arctic Desert** score on the continent articles and are
  the most "famous" deserts; deliberate, funny as a 0% answer.
- **Bab-el-Mandeb and Hormuz** out-draw the Pacific on news; re-fetch
  pageviews in a few months (delete `scripts/.cache/views-60d.json` first).
- **~140 pattern-flagged candidates** from the 2026-09-15 bank audit (big
  rivers/mountains/cities with very few views) were never individually
  confirmed; `auto-titles.mjs` catches airports but not a plausible wrong
  place.
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
  needs a second prompt. Commit each change separately. Pushes to `main` are
  allowed without asking (but see "Raise this first"). Sub-agents are welcome
  when they earn their keep; they'll say which model.
- **They watch their usage limit** and have hit it mid-session before. Keep
  work in small committed steps, checkpoint before long jobs, and say plainly
  after a cut-off what was kept and what was lost. They will step away during
  long agent runs; carry on to a committed state without them.
