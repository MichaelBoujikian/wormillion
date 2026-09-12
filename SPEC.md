# Wormillion — Build Specification (v1.2)

## 0. One-line pitch

An endless, single-player, browser-based digging game: each 15-round run asks you to name a real place (a country, capital, lake, river, mountain, desert, island, or sea/ocean); the more obscure your correct answer, the deeper your pixel worm digs and the more points you score. No accounts, no daily lock, no build step — open `index.html` and play forever.

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
| region | "Name a country in Southeast Asia." | country, capital | `region` tags (Section 6) |
| theme | "Name a river in Mesopotamia." / "Name a volcano." / "Name a landlocked country." / "Name a country with a coastline." | any | `src/data/themes.js`, hand-curated; plus derived themes in `promptBank.js` (v1.2) |
| ocean | "Name an island in the Pacific Ocean." | island, sea_ocean | `oceans` field, derived from coordinates (Section 4) |
| flag | "Name a country whose flag has green in it." / "…has both black and red in it." | country | `flag` field, hand-authored in `scripts/data-flags.mjs` (v1.2) |
| size | "Name a country with a population under 1 million." / "Name a river longer than 3,000 km." | any | `size` field |
| letter | "Name a river with a T in it." / "…that starts with M." / "…with a double letter." | any | the entry's name |

A modifier narrows what is **accepted**, never how an answer scores (3.2). A generated modifier (size, letter, ocean, flag) is only used when at least 6 entries satisfy it and — for size, letter and flag — it rules out at least 40% of the category; otherwise the slot falls back to plain. (So "has red in it", true of 79% of flags, is never asked on its own, but "has both red and black in it" is.) A flag rule is one colour or a pair from the palette `red white blue green yellow black orange`; colours are read **generously** — an emblem's colours count, gold is yellow, maroon is red, light blue is blue — because an over-inclusive row can at worst accept a debatable answer while a missing colour rejects a correct one. Only positive flag prompts are generated for the same reason. Curated themes may be deliberately tight (Mesopotamia has two rivers) and are used with as few as 2 members. A **derived theme** (v1.2) is the complement of a curated one: `coastal` is every country not in `landlocked`, computed at load time so the two lists can never disagree. It carries its own prompt text ("Name a country with a coastline.") and, because its name is not a place, a miss gets the generic "doesn't fit this one" hint rather than "isn't in coastal". Letter rules consider the name as displayed plus every name/alias with filler words ("mount", "lake", "the") removed, so "Lake Baikal" satisfies "starts with L" and "starts with B", but "Nile" does not satisfy "has a T" via its alias "the Nile".

**3.2 Country/capital region scoping applies to the prompt, not the score.** A country prompt may be scoped to a region ("Name a country in Southeast Asia"), but rarity is always computed against the *global* cohort for that category (all ~195 countries), never the region subset. Rationale: a Pacific micro-state should score as globally obscure even when the prompt happened to scope to a region full of other small states; scoping the cohort too would flatten that.

**3.3 Minor peaks/hills share the "mountain" cohort.** The obscure bonus pool isn't a separate category the player can target — it's additional entries merged into the same `mountain` cohort before rarity is computed, so a run naturally reaches Core-tier depth only if the player actually knows something obscure, not because a separate tiny pool trivially maxes out.

**3.4 Wrong or unrecognized answers get a free retry within the 30s window.** Because prompts are open-category, a "wrong" answer usually just means "not recognized," not "incorrect." On an unmatched submission: clear the input, show a brief inline hint, do **not** advance the round, and do **not** penalize. Only a timeout locks in 0 points/0 depth for that round. (Decision, not in the original brief — needed for the loop to feel fair given open-category prompts.) v1.1 distinguishes the hint: a real place that doesn't fit the modifier says so ("Egypt isn't in Southeast Asia — try another"); an unknown string says "not recognized". The previous round's result line (place, views, points, depth dug) stays on screen beside the new prompt until the player's next submission (v1.1) — it is not cleared when the round advances.

**3.5 Duplicate answers within one run are rejected, not scored.** Track canonical-form answers already accepted this run. Resubmitting one (e.g., answering "Egypt" for two different Africa prompts in the same run) is treated like an unmatched answer per 3.4: free retry, no penalty, no advance. This forces genuine recall breadth across a run instead of one lucky rare answer repeated.

**3.6 Spelling (superseded in v1.1).** v1.0 enforced US spelling by omission — British variants were never aliases, so they failed to match. v1.1 adds spelling correction (3.7), under which "Harbour" is one edit from "Harbor" and is *accepted with the US spelling shown*. Alias tables are still curated with US spellings only; there is still no British→US normalization step.

**3.7 Answer normalization and matching passes.** Normalization (applies before any lookup): NFD-decompose and strip diacritics; lowercase; trim; collapse internal whitespace to single spaces; strip periods, commas, and apostrophes; normalize `-`/`–`/`—` and `'`/`’` to a single plain form. "St. Lucia," "st lucia," and "St Lucia" all normalize to `st lucia`. Matching then runs three passes, cheapest first (v1.1):

1. **exact** — the normalized input is a known name or alias;
2. **loose** — the same with geographic filler words removed on both sides (`mount, mt, lake, loch, river, sea, island, isle, desert, the, of, city, saint, st, …`), so "Everest" finds "Mount Everest" and "Kitts and Nevis" finds "Saint Kitts and Nevis". A loose form shared by two different entries identifies neither;
3. **fuzzy** — the single closest name/alias by Damerau–Levenshtein distance within a length-scaled budget: 0 edits for inputs of 4 characters or fewer, 1 for 5–7, 2 for 8–11, 3 beyond. If two different entries tie for closest, the input is rejected rather than guessed. A fuzzy hit is reported as a *correction* and the UI shows `typed → Real Name`.

Substring matching is never performed.

**3.8 Prompt draw algorithm (15 prompts per run, v1.2):** shuffle the 8 categories; the first three become the **opening** — three distinct categories, always plain (no modifier). Shuffle a second copy of the 8, drop its last entry, and shuffle the remaining 5 + 7 = 12 slots after the opening. Every category still appears at least once and at most twice per run. For rounds 4–15 the chance of a modifier ramps linearly from 70% to 100% (v1.2; v1.1 was 40%→90%), so in practice about 11 of the 15 rounds are conditional; the modifier is drawn from those available to the category (3.1a). **No two rounds may show identical prompt text**: a slot whose text would repeat an earlier one is re-drawn (a category's second appearance therefore always reads differently from its first), falling back to a letter rule if needed. Region scoping is only offered for regions carrying ≥6 countries.

**3.9 Depth is cumulative across the run; strata are fixed bands over total depth, not per-round tiers.** See Section 5.2 — this is what makes "Depth strata across the 15-round range" literal: a run's total accumulated depth (0 up to a max of 700 units) is what determines which of the 7 named strata the worm is currently shown in, round by round.

**3.10 Scoring constants are tunable but must ship with these v1 defaults** (Section 5.1): `POINTS_MIN = 50`, `POINTS_MAX = 1000`, `POINTS_GAMMA = 1.4`, `TOTAL_DEPTH_BUDGET = 700`, `ROUNDS_PER_RUN = 15` (so `MAX_DIG_PER_ROUND = 700/15 ≈ 46.667`). Changing these is a balance-tuning task for after M8, not part of initial implementation.

**3.11 A zero-dig answer must still complete the round (v1.1).** The most-viewed entry in a cohort has rarity exactly 0 and digs 0. The dig animation must treat "no distance to cover" as a dive that plays out in place and then reports arrival; it must never wait for the depth to change. (Regression: `everest` and `caspian` froze the game.)

## 4. Data model

Every prompt-bank entry, across all 8 category files, shares this shape:

```jsonc
{
  "id": "country-egypt",            // unique, stable, kebab-case: "<category>-<slug>"
  "category": "country",             // one of the 8 category keys (Section 6)
  "name": "Egypt",                   // canonical display/accepted answer
  "aliases": [],                     // additional accepted strings, US-spelling only
  "magnitude": 162000,               // SCORING stat (Section 5.1): typical monthly Wikipedia pageviews; must be > 0
  "magnitudeUnit": "pageviews_monthly",
  "wikiTitle": "Egypt",              // the article the pageviews came from
  "lat": 27, "lon": 30,              // article coordinates, when the article has them
  "size": 112716598,                 // the physical stat: population | area (km2) | length (km) | elevation (m)
  "sizeUnit": "population",          // population | population_of_country | area_km2 | length_km | elevation_m
  "region": ["Africa", "North Africa"], // country/capital only: continent + optional sub-region tags
  "oceans": ["Pacific"],             // island/sea_ocean only: Pacific | Atlantic | Indian | Arctic | Southern; [] only by explicit override
  "flag": ["red", "white", "black", "yellow"], // country only: colours on the flag, from a fixed palette (3.1a); read generously
  "source": "..."                    // provenance note, not shown in-game
}
```

`magnitude` is the median of 60 daily English-Wikipedia view counts, scaled to a 30.44-day month, fetched by `scripts/fetch-pageviews.mjs` and committed as `src/data/pageviews.json` (the game never touches the network). `oceans` is derived from `lat`/`lon` by `scripts/data-oceans.mjs` with an explicit override table; the validator rejects any island or sea with no ocean and no override. The page loads `src/data/bank.js`, a generated `<script>` bundle carrying only the runtime fields (`id, category, name, aliases, magnitude, size, region, oceans, flag`). `flag` is authored by hand in `scripts/data-flags.mjs`, one row per country, and the build fails if any country lacks a row or any row names no country (v1.2).

- `region` is present only on `country` and `capital` entries (both keyed off the same country list — a capital entry inherits its country's region tags). A capital's `magnitude` is its **own** article's pageviews (v1.1), not its country's; its `size` is the country population.
- `aliases` must never contain a string that would also match a *different* entry's canonical name in the same category (validated by the M5 validation script — see Section 6.4).
- `magnitude` and `size` must be strictly positive; an entry whose article returns no pageviews is a build error, never a zero (a zero would score as maximally obscure).

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

points(e) = round( POINTS_MIN + (POINTS_MAX − POINTS_MIN) × rarity(e) ^ POINTS_GAMMA )

dig(e)    = rarity(e) × MAX_DIG_PER_ROUND
```

`rarity` is 1.0 for the smallest-magnitude entry in its cohort (rarest/most obscure) and 0.0 for the largest (most common/famous). With magnitude = monthly pageviews (v1.1) this is a direct measure of how often people look a place up, so it holds by construction; v1.0's physical stats only correlated with fame and produced wrong answers at the edges (Vatican City "rarest" by population, Malawi "famous" by population). A modifier (3.1a) never changes the cohort used here.

**Worked examples** (illustrative population figures from v1.0; the formula is unchanged by the switch to pageviews, so these remain a correctness check for the arithmetic, not shipped data):

- Country cohort spans roughly Vatican City (~800 people, `L≈2.90`) to India (~1.4B, `L≈9.15`), so `Lmax−Lmin ≈ 6.25`.
- **Tuvalu**, population ≈ 11,000, `L ≈ 4.04`: `rarity = (9.15−4.04)/6.25 ≈ 0.818` → `points = round(50 + 950 × 0.818^1.4) = round(50 + 950 × 0.767) ≈ 778` → `dig ≈ 0.818 × 46.667 ≈ 38.2`.
- **United States**, population ≈ 335M, `L ≈ 8.53`: `rarity = (9.15−8.53)/6.25 ≈ 0.10` → `points = round(50 + 950 × 0.10^1.4) ≈ 88` → `dig ≈ 4.7`.

A timeout, or a round where no answer was accepted (Section 3.4/3.5 always retry to either a match or a timeout — there is no other terminal state), scores `points = 0, dig = 0` for that round.

### 5.2 Cumulative depth and strata

```
D₀ = 0
Dₖ = Dₖ₋₁ + dig(eₖ)     for round k = 1..15 (dig = 0 on a timed-out round)
```

`TOTAL_DEPTH_BUDGET = 700` is exactly `15 × MAX_DIG_PER_ROUND`, so a theoretical perfect run (rarity = 1.0 every round) ends at `D₁₅ = 700`, landing exactly on the Core threshold. The 7 strata are fixed, equal-width bands over that budget:

| Stratum | Depth range |
|---|---|
| Topsoil | `[0, 100)` |
| Subsoil | `[100, 200)` |
| Clay | `[200, 300)` |
| Bedrock | `[300, 400)` |
| Deep Rock | `[400, 500)` |
| Mantle | `[500, 600)` |
| Core | `[600, ∞)` (visual depth display caps around 750 for headroom; there is no gameplay effect of exceeding 700, it's just "deep in Core") |

The worm's displayed position after round `k` is whichever band contains `Dₖ`. A run's "deepest stratum reached" (shown in the summary and tracked in history, Section 7) is whichever band contains `D₁₅` (the final cumulative depth), or the deepest band touched at any point if you want digging back up to read as "reached," not "ended at" — **v1 uses final depth, not max depth, for simplicity**; note this explicitly rather than leaving it ambiguous.

### 5.3 Answer matching

Given raw player input and the current prompt's category cohort:

1. Normalize the input per rule 3.7.
2. Normalize every candidate string (each entry's `name` plus its `aliases`) the same way, once, at data-load time (not per keystroke), and build the loose-form and fuzzy indexes alongside.
3. Look the input up in the lookup built for the current **prompt** (the cohort narrowed by the prompt's modifier, if any): exact, then loose, then fuzzy (3.7).
4. If found and `entryId` is not already in this run's `usedAnswers` set: accept (reporting a correction if the fuzzy pass matched) — add to `usedAnswers`, compute points/dig against the **whole** cohort (5.1, 3.2), advance to the next round.
5. If found but already in `usedAnswers`: reject as duplicate (3.5) — free retry, no advance.
6. If not found in the prompt's lookup but found in the whole cohort's: reject as **wrong-scope** with the modifier named — free retry, no advance.
7. If not found at all: reject as unrecognized (3.4) — free retry, no advance.
8. On timeout with no accepted answer this round: lock in 0/0, advance.

## 6. Content bank: categories, targets, and sourcing rules

Eight categories, each a JSON file under `src/data/` (schema: Section 4), each prompt rendered with fixed copy (no per-entry prompt text — the category alone determines the sentence):

Scoring magnitude for every category is monthly Wikipedia pageviews (Section 4). The "size stat" column is the physical figure kept as `size`, used by size-threshold prompts (3.1a). Plain prompts are shown; modifiers (3.1a) vary the wording.

| Category key | Plain prompt | Target entry count | v1.1 count | Size stat |
|---|---|---|---|---|
| `country` | "Name a country." | ~195 (all UN-recognized + commonly-taught non-UN states) | 197 | population |
| `capital` | "Name a capital city." | ~195 (one per country above) | 197 | population *of the country* (`population_of_country`) |
| `lake` | "Name a lake." | 70–100 | 119 | surface area (km²) |
| `river` | "Name a river." | 70–100 | 130 | length (km) |
| `mountain` | "Name a mountain." | 60–90 well-known peaks | 125 | elevation (m) |
| *(feeds `mountain` cohort)* | *(same prompt as above)* | 40–60 real, obscure minor peaks/hills | 62 | elevation (m) |
| `desert` | "Name a desert." | 30–45 | 58 | area (km²) |
| `island` | "Name an island." | 70–100 | 354 (incl. archipelagos people name as islands: Seychelles, Maldives, Canaries…, and every island nation that is one island or one compact archipelago: Palau, Samoa, Tonga, Bahamas, Grenada…) | area (km²) |
| `sea_ocean` | "Name a sea or ocean." | 60–75 (5 oceans + named seas) | 95 | area (km²) |

**Region list for country prompts (3.8):** `Africa`, `Asia`, `Europe`, `North America`, `South America`, `Oceania` (continent-level, always usable) plus sub-regions used only when they have ≥6 tagged countries: `West Africa`, `East Africa`, `North Africa`, `Southern Africa`, `Middle East`, `South Asia`, `Southeast Asia`, `East Asia`, `Central Asia`, `Caribbean`, `Central America`, `Eastern Europe`, `Western Europe`, `Scandinavia & the Nordics`. Every country entry carries `region: [continent, ...subregions]`.

**6.0 Themes (v1.1).** `src/data/themes.js` holds hand-curated sets used by the theme modifier, listed by in-game name and resolved at load time: rivers (Mesopotamia, the British Isles, Siberia, continents, India), mountains (the Alps, the Himalayas, the Andes, the Rockies, Scotland, England or Wales, Indonesia, volcanoes), islands (the Caribbean, the Mediterranean, Greece, Hawaii, Scotland, Japan, Indonesia), lakes (saltwater, the Great Lakes, Africa, the Alps, the British Isles, Scandinavia), deserts and seas by continent, and countries (landlocked, island nations, and — derived from landlocked, not listed — coastal). Because a themed prompt *rejects* answers outside its set, sets must be complete for their well-known members; the validator fails on any listed name that is not in the bank. Ocean membership is deliberately **not** a theme — it is derived data (Section 4) so that no island can be left off a list.

**6.1 No fabricated place names — hard rule.** Every entry must be a real, currently-recognized place with a real, sourced magnitude figure. Made-up names, jokey placeholders, or "TBD" entries are never committed, not even temporarily — a milestone that isn't ready to add real data for a slot leaves that slot's count lower rather than fill it with a placeholder.

**6.2 Sourcing.** Pageviews come from the Wikipedia action API (`prop=pageviews`, 60 daily counts, median) via `npm run fetch-pageviews`; each entry's Wikipedia article is resolved through redirects, rejected if it is a disambiguation or missing page, and its Wikidata description checked against the category — overrides and hand-verified subjects live in `scripts/data-wiki-titles.mjs`. Physical `size` figures use reputable public reference data (UN/World Bank population, standard physical-geography references). Record provenance in `source` — for maintainers, never rendered. Where a figure varies by source (river length especially), pick one reputable figure and note the caveat; consistency within the dataset matters more than picking the "most correct" of several disputed figures.

**6.3 Transcontinental countries** (Russia, Turkey/Türkiye, Kazakhstan, Egypt, etc.) get whichever single continent tag is the common convention (e.g. Russia → Europe, by population-center/UN-region convention) plus any sub-region tags that apply; don't dual-tag continents, to keep prompt scoping predictable.

**6.4 Validation script (`scripts/validate-data.mjs`, part of M5).** Run as `npm run validate`. Checks, failing the run (non-zero exit) on any violation:
- every entry has all required fields, `magnitude > 0` with unit `pageviews_monthly`, `size > 0` with a known unit, a `wikiTitle`, and a non-empty `category` matching one of the 8 keys;
- no duplicate `id` within a file or across files feeding the same cohort;
- no alias string collides with another entry's normalized name/alias within the same cohort (Section 4);
- every `country`/`capital` entry has a non-empty `region` array using only region names from the list above;
- every `island`/`sea_ocean` entry has an `oceans` array of known oceans, empty only by explicit override (v1.1);
- every `country` entry has a non-empty `flag` array of distinct colours from the palette in `scripts/data-flags.mjs` (v1.2);
- every UN member state, UN observer state and commonly-taught state (`scripts/data-un-members.mjs`) is answerable by name or alias in the country cohort (v1.1);
- every name listed in a theme (`src/data/themes.js`) resolves to an entry in that category (v1.1);
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
      run.js            # run/round state machine (current round, score, depth, usedAnswers)
      timer.js          # 30s countdown, pure-ish (callback-based), no DOM assumptions baked in
      persistence.js    # localStorage read/write: best dive + history (Section 9 shape)
      icons.js          # 12x12 pixel category icons, draws to a supplied context
      worldRender.js    # the dig scene; draws to canvases handed in, never touches `document`
      ui.js             # DOM rendering + event wiring; the only file allowed to touch `document`
    data/
      countries.json … seas-oceans.json   # Section 4 schema, generated by scripts/build-data.mjs
      pageviews.json    # the Wikipedia snapshot (views, title, coordinates) the build folds in
      bank.js           # generated <script> bundle of the runtime fields - what the page loads
      themes.js         # hand-curated theme sets (6.0)
  scripts/
    data-countries.mjs, data-physical.mjs   # authoring sources (pipe-delimited)
    data-wiki-titles.mjs  # Wikipedia title overrides + hand-verified subjects
    data-oceans.mjs       # ocean classification boxes + overrides
    data-flags.mjs        # flag colours per country, hand-authored (3.1a)
    data-un-members.mjs   # the audit list for 6.4
    build-data.mjs        # emits src/data/*; exports buildFiles() for the fetcher
    fetch-pageviews.mjs   # refreshes pageviews.json (network; cached under scripts/.cache/)
    validate-data.mjs     # Section 6.4
    gap-check.mjs, score-report.mjs, bundle.mjs, serve.mjs
  tests/
    rarity.test.js
    matching.test.js
    run.test.js
    prompts.test.js       # modifiers, the draw, ocean/size behaviour
    worldRender.test.js   # dive completion incl. the zero-dig regression (3.11)
    persistence.test.js
    validate-data.test.js
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
- **Performance:** total page weight (HTML+CSS+JS+data+sprites) should stay well under 1 MB; all data fetches are same-origin `fetch()` calls against the bundled JSON files, no network dependency beyond the initial page load, no external fonts/CDNs required (system font stack is fine, or one self-hosted pixel font).
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
    { "score": 5230, "deepestStratum": "Mantle", "finalDepth": 542.3, "date": "2026-09-05T18:04:00.000Z" }
    // most recent last; cap at 50 entries, dropping oldest, to keep the key small
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

**Deferred (needs new data, scoped separately):** a non-capital *cities* category.
