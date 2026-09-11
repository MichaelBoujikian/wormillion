# Wormillion — Build Specification (v1.0)

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
- **Rarity/scoring:** Algorithmic, not hand-tiered — each entry has a real-world magnitude stat (population, area, length, elevation, etc.), converted to a log-scaled percentile within its category. That percentile drives both dig depth and points, mirroring Krillion's "rarer = deeper = more points."
- **Answer matching:** Case-insensitive, US English spelling only (British spellings rejected), with an alias table so common abbreviations/nicknames count (USA/US/America, UK, DRC, etc.).
- **Visuals:** Retro pixel-art style matching Krillion's look, reskinned to earth tones. Depth strata across the 15-round range: Topsoil → Subsoil → Clay → Bedrock → Deep Rock → Mantle → Core. Pixel worm digs and leaves a tunnel behind it.
- **Persistence:** Browser localStorage tracks best dive/history across runs (no server, no accounts).

Everything below resolves the gaps this list leaves open, so no implementation decision is made silently mid-milestone.

## 3. Resolved design decisions

The original brief describes the shape of the game but leaves several mechanics underspecified. These are resolved here, once, so every milestone builds against the same rules.

**3.1 Prompt format is "name a member of a category," not fixed trivia.** Every prompt (including capitals) accepts *any* real, correctly-spelled member of its category — not one specific correct answer. "Name a country in Africa" accepts Egypt, Comoros, or São Tomé and Príncipe; "Name a capital city" accepts London or Ngerulmud. This is what makes per-answer rarity meaningful (Section 5) and matches Krillion's actual mechanic.

**3.2 Country/capital region scoping applies to the prompt, not the score.** A country prompt may be scoped to a region ("Name a country in Southeast Asia"), but rarity is always computed against the *global* cohort for that category (all ~195 countries), never the region subset. Rationale: a Pacific micro-state should score as globally obscure even when the prompt happened to scope to a region full of other small states; scoping the cohort too would flatten that.

**3.3 Minor peaks/hills share the "mountain" cohort.** The obscure bonus pool isn't a separate category the player can target — it's additional entries merged into the same `mountain` cohort before rarity is computed, so a run naturally reaches Core-tier depth only if the player actually knows something obscure, not because a separate tiny pool trivially maxes out.

**3.4 Wrong or unrecognized answers get a free retry within the 30s window.** Because prompts are open-category, a "wrong" answer usually just means "not recognized," not "incorrect." On an unmatched submission: clear the input, show a brief inline "not recognized — try another" hint, do **not** advance the round, and do **not** penalize. Only a timeout locks in 0 points/0 depth for that round. (Decision, not in the original brief — needed for the loop to feel fair given open-category prompts.)

**3.5 Duplicate answers within one run are rejected, not scored.** Track canonical-form answers already accepted this run. Resubmitting one (e.g., answering "Egypt" for two different Africa prompts in the same run) is treated like an unmatched answer per 3.4: free retry, no penalty, no advance. This forces genuine recall breadth across a run instead of one lucky rare answer repeated.

**3.6 US-only spelling is enforced by omission, not by a rejection rule.** Alias tables (Section 4) are curated with US spellings only. British variants are simply never added as aliases — so they fail to match with no special-case logic required. Do not add a British→US normalization step; that would make both forms equivalent, which defeats the requirement.

**3.7 Answer normalization (applies before alias lookup):** lowercase; trim; collapse internal whitespace to single spaces; strip periods, commas, and apostrophes; normalize `-`/`–`/`—` and `'`/`’` to a single plain form. "St. Lucia," "st lucia," and "St Lucia" all normalize to `st lucia`. This is normalization, not spelling correction — it does not fix misspellings.

**3.8 Prompt draw algorithm (15 prompts per run):** shuffle the 8 categories, take that order, then shuffle a second independent copy of the 8 categories and drop its last entry, concatenate (8 + 7 = 15), then shuffle the combined sequence of 15 category slots. This guarantees every category appears at least once and at most twice per run, with no predictable ordering. For every slot resolved to `country`, additionally pick a random region tag (weighted toward regions with ≥6 countries, so the region filter isn't so narrow it becomes a tiny cohort of choices) uniformly from the region list in Section 6.

**3.9 Depth is cumulative across the run; strata are fixed bands over total depth, not per-round tiers.** See Section 5.2 — this is what makes "Depth strata across the 15-round range" literal: a run's total accumulated depth (0 up to a max of 700 units) is what determines which of the 7 named strata the worm is currently shown in, round by round.

**3.10 Scoring constants are tunable but must ship with these v1 defaults** (Section 5.1): `POINTS_MIN = 50`, `POINTS_MAX = 1000`, `POINTS_GAMMA = 1.4`, `TOTAL_DEPTH_BUDGET = 700`, `ROUNDS_PER_RUN = 15` (so `MAX_DIG_PER_ROUND = 700/15 ≈ 46.667`). Changing these is a balance-tuning task for after M8, not part of initial implementation.

## 4. Data model

Every prompt-bank entry, across all 8 category files, shares this shape:

```jsonc
{
  "id": "country-egypt",            // unique, stable, kebab-case: "<category>-<slug>"
  "category": "country",             // one of the 8 category keys (Section 6)
  "name": "Egypt",                   // canonical display/accepted answer
  "aliases": [],                     // additional accepted strings, US-spelling only (Section 3.6)
  "magnitude": 112716598,            // the real-world stat used for rarity (Section 5.1); must be > 0
  "magnitudeUnit": "population",     // one of: population | area_km2 | length_km | elevation_m
  "region": ["Africa", "North Africa"], // country/capital only: continent + optional sub-region tags
  "source": "UN population estimate, 2024" // short human-readable provenance note, not shown in-game
}
```

- `region` is present only on `country` and `capital` entries (both keyed off the same country list — a capital entry inherits its country's region tags).
- `aliases` must never contain a string that would also match a *different* entry's canonical name in the same category (validated by the M5 validation script — see Section 6.4).
- `magnitude` must be strictly positive; if a real-world stat can legitimately be 0 or negative for some place (it won't be, given the categories chosen — see Section 6 for why deserts/depressions with sub-sea-level elevation are excluded), exclude that entry rather than coercing the number.

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

`rarity` is 1.0 for the smallest-magnitude entry in its cohort (rarest/most obscure) and 0.0 for the largest (most common/famous). This holds for every category because in every one of the 8 categories, larger magnitude correlates with fame: bigger population (countries/capitals), bigger area (lakes, deserts, islands, seas/oceans), longer length (rivers), or higher elevation (mountains — Everest is famous, a 1,900 m unnamed-to-most hill is not).

**Worked examples** (illustrative population figures; real data is sourced during M5 — treat the numbers below as a correctness check for the formula, not as shipped data):

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
2. Normalize every candidate string (each entry's `name` plus its `aliases`) the same way, once, at data-load time (not per keystroke).
3. Look up the normalized input in a flat `Map<normalizedString, entryId>` built for the current cohort at run start.
4. If found and `entryId` is not already in this run's `usedAnswers` set: accept — add to `usedAnswers`, compute points/dig (5.1), advance to the next round.
5. If found but already in `usedAnswers`: reject as duplicate (3.5) — free retry, no advance.
6. If not found: reject as unrecognized (3.4) — free retry, no advance.
7. On timeout with no accepted answer this round: lock in 0/0, advance.

## 6. Content bank: categories, targets, and sourcing rules

Eight categories, each a JSON file under `src/data/` (schema: Section 4), each prompt rendered with fixed copy (no per-entry prompt text — the category alone determines the sentence):

| Category key | Prompt shown to player | Target entry count | Magnitude stat |
|---|---|---|---|
| `country` | "Name a country in {region}." (region drawn per 3.8; occasionally "the world" — unscoped) | ~195 (all UN-recognized + commonly-taught non-UN states) | population |
| `capital` | "Name a capital city." | ~195 (one per country above) | population *(of that capital's country — reuses the country's magnitude, not the city's own population, so a capital's rarity always mirrors its country's rarity)* |
| `lake` | "Name a lake." | 70–100 | surface area (km²) |
| `river` | "Name a river." | 70–100 | length (km) |
| `mountain` | "Name a mountain." | 60–90 well-known peaks | elevation (m) |
| *(feeds `mountain` cohort)* | *(same prompt as above)* | 40–60 real, obscure minor peaks/hills | elevation (m) |
| `desert` | "Name a desert." | 30–45 | area (km²) |
| `island` | "Name an island." | 70–100 | area (km²) |
| `sea_ocean` | "Name a sea or ocean." | 60–75 (5 oceans + named seas) | area (km²) |

**Region list for country prompts (3.8):** `Africa`, `Asia`, `Europe`, `North America`, `South America`, `Oceania` (continent-level, always usable) plus sub-regions used only when they have ≥6 tagged countries: `West Africa`, `East Africa`, `North Africa`, `Southern Africa`, `Middle East`, `South Asia`, `Southeast Asia`, `East Asia`, `Central Asia`, `Caribbean`, `Central America`, `Eastern Europe`, `Western Europe`, `Scandinavia & the Nordics`. Every country entry carries `region: [continent, ...subregions]`.

**6.1 No fabricated place names — hard rule.** Every entry must be a real, currently-recognized place with a real, sourced magnitude figure. Made-up names, jokey placeholders, or "TBD" entries are never committed, not even temporarily — a milestone that isn't ready to add real data for a slot leaves that slot's count lower rather than fill it with a placeholder.

**6.2 Sourcing.** Use reputable public reference data (e.g., UN/World Bank population figures, standard physical-geography references for area/length/elevation). Record the source per-entry in the `source` field (Section 4) — it's for maintainers/reviewers, never rendered in the UI. Where a figure varies by source (river length especially — measurement method changes it materially), pick one reputable figure and note the caveat in `source`; consistency within the dataset matters more than picking the "most correct" of several disputed figures.

**6.3 Transcontinental countries** (Russia, Turkey/Türkiye, Kazakhstan, Egypt, etc.) get whichever single continent tag is the common convention (e.g. Russia → Europe, by population-center/UN-region convention) plus any sub-region tags that apply; don't dual-tag continents, to keep prompt scoping predictable.

**6.4 Validation script (`scripts/validate-data.mjs`, part of M5).** Run as `npm run validate`. Checks, failing the run (non-zero exit) on any violation:
- every entry has all required fields, `magnitude > 0`, and a non-empty `category` matching one of the 8 keys;
- no duplicate `id` within a file or across files feeding the same cohort;
- no alias string collides with another entry's normalized name/alias within the same cohort (Section 4);
- every `country`/`capital` entry has a non-empty `region` array using only region names from the list above;
- reports final per-category entry counts against the targets table above (warns, doesn't fail, if below target — target is a goal for M5, not a hard gate for every other milestone).

## 7. Repository layout

```
wormillion/
  .github/workflows/
    ci.yml              # run `npm test` + `npm run validate` on push/PR to any branch
    deploy.yml          # on push to main: upload src/ as Pages artifact, deploy
  src/                  # <- this whole folder is the deployed static site, as-is, no build
    index.html
    styles.css
    main.js             # entry point; imports the modules below as ES modules
    js/
      rarity.js         # 5.1 + 5.2, pure functions, no DOM
      matching.js       # 5.3, pure functions, no DOM
      promptBank.js     # loads data/*.json, builds cohorts, draw15() per 3.8
      run.js            # run/round state machine (current round, score, depth, usedAnswers)
      timer.js          # 30s countdown, pure-ish (callback-based), no DOM assumptions baked in
      persistence.js    # localStorage read/write: best dive + history (Section 9 shape)
      ui.js             # DOM rendering + event wiring; the only file allowed to touch `document`
      strata.js         # depth → stratum name/band lookup (5.2 table)
    data/
      countries.json
      capitals.json
      lakes.json
      rivers.json
      mountains.json
      minor-peaks.json
      deserts.json
      islands.json
      seas-oceans.json
    assets/
      sprites/          # pixel-art PNGs: worm frames, strata tiles, category icons
  scripts/
    validate-data.mjs   # Section 6.4
  tests/
    rarity.test.js
    matching.test.js
    run.test.js
    validate-data.test.js
  package.json          # scripts only: "test", "validate"; no runtime dependencies at all
  README.md
  SPEC.md               # this document
```

`js/ui.js` being the sole DOM-touching module is a hard architectural rule, not a suggestion — it's what keeps `rarity.js`, `matching.js`, `promptBank.js`, and `run.js` unit-testable with plain `node --test`, no jsdom, no browser needed for the test suite. If a milestone finds itself importing `document` into one of the other modules, that's the signal to stop and restructure before continuing.

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
