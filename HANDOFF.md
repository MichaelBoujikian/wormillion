# Handoff

For whoever (or whatever) picks this up next. `README.md` explains the game and
how to run it; `SPEC.md` is the design source of truth (v1.3, with an amendments
log in §13). This file is what isn't in either: what to work on next, where
things stand, every knob and its current setting, the decisions that must not
be quietly undone, and the gotchas that cost time. Claude Code's project memory
is keyed to this folder (`C:\Users\smite\repos\wormillion`); this file is the
memory that survives.

Written 2026-09-15, at the end of the session that grew the bank from 2,016 to
8,967 places and then audited it; updated the same evening after the coverage
probes (see "Coverage probes" below).

---

# What the next session is for

## 0. Decisions left open on 2026-09-15 evening (ask, don't assume)

The user ran three coverage probes before buying Netlify time (see "Coverage
probes"). Colombia's rivers were added; these were reported and not decided:

- **US non-capital cities:** add the ~230 missing (populations from Wikidata
  via `probe.mjs`, `fold.mjs` takes the cities format)? Sub-questions: are
  the five NYC boroughs cities (Brooklyn draws 164k views/mo)? Do the small
  US state capitals join the `city` cohort too (today "Albany" on a city
  round gets "Albany is a capital city — this round wants a non-capital
  city", which is the wrong hint; v1.2 only added the big ones)?
- **Sweden's lakes:** add the 25 over 30 km² (+ `Scandinavia` theme), or all
  188 down to the Stockholm ponds?
- **The fuzzy-trap matcher change:** ~3/4 of river/lake autocorrect traps
  come from the filler word inflating the edit budget ("Lake Tåkern" → Lake
  Vänern, "Sinú River" → Min River). Proposed: fuzzy on the filler-stripped
  key with slack from the stripped length. Changes SPEC 3.7; `tests/matching`
  will say what it breaks. Not done — the user cares about autocorrect.

Both priorities named on 2026-09-14 are done:
**more places** (the bank is 4.4× bigger) and **bug hunting** (two audit
agents went over it; their reports are in `scripts/expansion/reports/`). The
game is feature-complete by the user's own account — don't start features
unless asked. What is worth doing, in order of value:

## 1. Put the new bank in front of a human

Nobody has *played* a run on the 9,000-place bank. The audits were programmatic
(the matcher, the prompt generator, the review's ★ line, scoring outliers all
check out), but the feel is unverified: whether obscure-but-real answers make
the 15 rounds too easy, whether the "elsewhere" nudges read well now that
almost every name exists somewhere, whether the review screen's rarest answers
are places a player will believe. Play three runs with `?debug` (see "Driving
the game from JS") before touching anything else, and write down what felt off.

## 2. Netlify: one deploy, then verify

Netlify has been frozen on the account-wide usage cap since 2026-09-13 and is
still serving `e881c8a`. **Measured 2026-09-15 evening (not assumed):** the
server's draw fingerprint comes from the old bank (recomputing dailies with
the `e881c8a` bank reproduces every live fingerprint exactly); the shipped
bank happens to draw the same prompt texts on some days — dig #4 matched,
#5 does not, and the two banks agree on 18 of the next 60 dailies. On a
mismatched day a Pages submission is a silent `draw-mismatch`; on a matched
day an answer that only exists in the new bank is refused (400) and the
score is computed against the old cohort stats. **And there are real
players:** 2 / 12 / 56 / 116 submissions on digs #1–#4, 6 on #5 by 18:00
PDT — the #5 ones carry the old-bank fingerprint, so some people play on
`wormillion.netlify.app` itself. The user will buy a month when there is
enough to ship — there is. When they do: push anything or "Trigger deploy",
then the curl checks under "Netlify: verifying the comparison". Watch the
function cold start: `included_files` bundles `src/data/bank.js`, which is
now **1.2 MB** (was 289 KB); `lib/netlify.mjs` parses it once per warm
function, which should be fine, but nobody has seen it.

Dig #4's aggregate is the first human signal on prompt difficulty (old bank):
the tight themed rounds were missed by more than half the field — "desert in
Australia" 67/116, "mountain in Indonesia" 65, "sea or ocean in the
Antarctic" 61 — and "mountain with an R in it" produced 38 duds (Everest).
`curl ".../daily-stats?day=2026-09-15"` has the per-round numbers.

## 3. Audit follow-ups that were left as judgment calls

Everything the audits *confirmed* is fixed (`14fb3b9`). These were flagged but
need a decision, not a script:

- **Antarctic Desert / Arctic Desert score on the continent articles**
  (`Antarctica`, `Arctic`) and so are the most "famous" deserts in the bank —
  Antarctic Desert draws 2× the Sahara. They were set that way on purpose
  ("no desert-specific article exists"), but it means naming Antarctica on a
  desert round pays the minimum. Options: leave it (it *is* famous), or drop
  both from the desert cohort. Recommendation: leave, it's a 0% answer people
  will find funny.
- **Bab-el-Mandeb (195k views) and Strait of Hormuz (97k)** out-draw the
  Pacific Ocean (62k) — shipping-attack news has lifted even the 60-day
  median. A correct, obscure-feeling answer pays less than "Pacific". Nothing
  to fix in data; re-fetch pageviews in a few months (`npm run
  fetch-pageviews` refreshes everything from cache — delete
  `scripts/.cache/views-60d.json` first to force it).
- **~140 pattern-flagged candidates the audit didn't confirm** — rivers over
  1,000 km, mountains over 4,000 m and cities over 500k people with under a
  few hundred monthly views. Most are real-but-obscure (Chulym, Kotto, Bien
  Hoa, Soacha); some may still be wrong articles. The `size`-vs-`magnitude`
  query is in the bank audit §1; `node scripts/expansion/auto-titles.mjs
  <category>` now rejects airport/station/school/hotel articles but not a
  plausible-looking wrong place. Spot-check 30 by hand before deciding it's
  worth an agent.
- **The USA outlier** (1.5M views, 6× the next country) compresses the
  country curve: Mexico, Italy, Poland read as ~53% rare. Japan does the same
  to islands. Not a data error — a design question about whether
  `rarityOf`'s log-scale min/max should clip the top. `POINTS_GAMMA` is off
  the table (user), but a clipped max is a different knob. Ask before
  changing scoring.
- **"Tames" no longer autocorrects to Thames** — "James" (river) is now
  equally close, and ties are refused by design. Same shape will recur as
  the bank grows; the fix, if wanted, is a fame tiebreak in `nearest()`
  (prefer the candidate with the larger magnitude). Low priority.
- **"Victoria" and "San Juan" on a city round** nudge to the Seychelles
  capital and a Nicaraguan river. Victoria, BC was added; San Juan (Puerto
  Rico) can't be — Puerto Rico has no country row. Accepted.
- **Five Malaysian peaks have no theme home**, and there is no `Indonesia`-
  style theme for the Philippines or Japan's mountains either. The user
  likes new specific prompts; this would be a theme, not a category, so it
  is fair game if asked.

## 4. Docs that lag the bank

`SPEC.md` §6's count table and §13 have no row for the expansion; `README.md`'s
"Content bank" section doesn't mention `scripts/expansion/`. `dist/wormillion.html`
on disk is the pre-expansion bundle — `npm run bundle` will make a ~1.4 MB one.

---

# State of the world

## ⚠ Netlify is frozen (as of 2026-09-13)

The user's Netlify account hit an account-wide usage cap ("production deploys
and agent runners are paused") — unrelated to this repo or to Claude Code.

- `wormillion.netlify.app` **serves `e881c8a`** (confirmed live then, functions
  included) and **will not pick up any push** until the user upgrades.
- **GitHub Pages is unaffected** and has every push, including the whole
  expansion. The game itself is fine there; only the comparison block is
  quiet (`draw-mismatch`, see above).
- **Decision (2026-09-13): keep pushing to `main` as normal**; Netlify gets one
  deploy later. That moment has arrived — see priority 2.

## Where it lives

- **Repo:** https://github.com/MichaelBoujikian/wormillion (public; `gh` is
  authenticated with `repo` + `workflow` scopes, `git push` just works).
- **GitHub Pages:** https://michaelboujikian.github.io/wormillion/
  (`.github/workflows/deploy.yml`; `ci.yml` runs test + validate on Node 22).
- **Netlify:** https://wormillion.netlify.app — `netlify.toml` publishes `src/`
  and runs `npm test && npm run validate` as the deploy command. Functions at
  `/.netlify/functions/daily-submit` and `daily-stats`; Blobs store `daily`.
- **Local:** `C:\Users\smite\repos\wormillion`. Double-click `play.cmd` to play.
  `npm start` serves on :8123 (`.claude/launch.json` names it `wormillion` for
  the in-app browser pane) **and mounts the comparison API over an in-memory
  store**, so the whole server flow plays locally without Netlify.

## Green as of 2026-09-15 evening

`npm test` 173 · `npm run validate` 9,033 entries · `npm run gap-check` 325
obvious answers all land. Working tree clean, everything pushed.

**Bank:** 197 countries · 247 capitals · 2,535 cities · 766 lakes · **2,251
rivers** (+66 Colombian, `99aab7f`) · 1,310 mountains · 129 deserts · 1,345
islands · 253 seas = **9,033**. `bank.js` is 1.2 MB. The audit-day figures
(228 jackpot entries, median run ~6,700 / depth ~560) predate the 66 rivers
and will not have moved.

## Coverage probes (2026-09-15 evening)

The user's question before paying for Netlify: "pick one country and one
category — do we have everything?" Tool: `scripts/expansion/probe.mjs` (README
there). Reports in `scripts/expansion/reports/2026-09-15-*.md`. The answer,
three times, was "the top tier, not the country":

| probe | articles | in bank | added | left |
|---|---|---|---|---|
| Colombia × rivers | 148 | 22 (15%) | **66** (all with a sourced length) | 55 with no length figure anywhere; 6 name collisions (Mira, San Juan…) |
| United States × non-capital cities (≥100k or largest in state) | 469 | 169 (36%) | — | ~230 incl. Arlington TX (394k, autocorrects to Burlington VT), Irvine, Irving, Garland, Fremont, the NYC boroughs; 45 names held by another place (Birmingham, Toledo, Portland ME…) |
| Sweden × lakes | 208 | 20 (10%) | — | 188, mostly ponds; 25 over 30 km² worth having |

Findings that generalise: (1) a category's coverage is "what an outsider
names"; a local names the rest. (2) **The fuzzy-trap class is real and
mostly mechanical**: with no entry to hit, "X River"/"Lake X" gets the filler
word's extra edit budget and lands on a river or lake elsewhere ("Sinú River"
→ Min (Sichuan), "Lake Tåkern" → Vänern) — 25 of 33 river traps and 21 of 29
lake traps vanish if the bare name is judged alone; city traps (Arlington →
Burlington) are genuine near-names and only data fixes them. (3) Wikidata
sizes need a cross-check against the article (it had the Sinú at 27 km).
(4) "St. George, Utah" is accepted as George, South Africa because `st` is
filler — the loose pass has an edge there.

**Dig #1's fifteen prompts are unchanged** (the pin in `tests/prompts.test.js`
passes), but every daily from the expansion onward draws from the bigger bank —
accepted cost, and the daily's seed/namespace was not touched.

## How it got here (short version; details in SPEC §13 and git log)

v1.0–1.2 built the game: nine categories, pageview-based scoring, fuzzy
matching, the prompt-modifier system, the pixel-art dig scene, jackpot and dud
overlays, the summary ladder. 2026-09-13: daily + endless modes, the -dle kit
(share, streak, review), the daily comparison on Netlify. 2026-09-14/15: **the
expansion** — players had reported "Falkland Islands", rivers and non-capital
cities refused. Seventeen Sonnet sub-agents each authored one category × region
from Wikipedia list pages; the lead session folded, resolved and verified each
chunk (`39534ba`), kept the tooling (`b68a219`), then ran two audit agents and
fixed what they confirmed (`14fb3b9`): ~90 entries scoring on the wrong article
(Pisa's *airport*, a metro station for Nezahualcóyotl, a Peruvian hill for
Iceland's Laki), 20 duplicate rows merged into aliases, straits reachable by
their short names.

## Netlify: verifying the comparison

Last verified live on `e881c8a`: two curl submissions for dig #1 scored exactly
what the local engine did, the duplicate was refused, CORS came back for the
Pages origin, the Pages copy fetched stats cross-origin with no console errors.
Not yet seen: a human playing a daily on the live site and watching the block
appear. After the next deploy, in order:

1. **Deploy log** — build passed, both functions bundled? A bundling failure
   points at `import daily from './lib/daily.js'` (CJS from ESM) or the
   `included_files` line in `netlify.toml`.
2. `curl "https://wormillion.netlify.app/.netlify/functions/daily-stats?day=YYYY-MM-DD"`
   — expect JSON with `count`, `prompts` (15) and `number`. A 500 naming
   `src/data/bank.js` means `findRoot()` in `lib/daily.js` needs another
   candidate path. A slow first call is the 1.2 MB parse — note the time.
3. **Play a daily on the Netlify URL** — a missing block plus a 4xx in the
   function log means the replay rejected the answers; the log says which
   round and why.
4. The Pages copy calls `https://wormillion.netlify.app` (`REMOTE_API` in
   `src/js/compare.js`; CORS admits `https://michaelboujikian.github.io`).
   **If the Netlify site is ever renamed, change both.**
5. A day's aggregate can be rebuilt from its submissions:
   `createDailyApi(...).rebuild(day)`. No endpoint for it on purpose.

Harmless test rows `smoke-test-0001/0002` sit in dig #1.

---

# Reference

## Where the logic lives

| want to change… | file |
|---|---|
| the places themselves | `scripts/data-physical.mjs`, `scripts/data-countries.mjs` (pipe-delimited) |
| the US state capitals | `scripts/data-us-states.mjs` (they feed the `capital` cohort, like minor peaks feed `mountain`) |
| the non-capital cities | `scripts/data-cities.mjs` (`Name\|Country\|population\|aliases`; Country must be a `data-countries.mjs` row; the build refuses a city that is its country's capital) |
| **adding places in bulk, fixing a wrong article, merging a duplicate** | **`scripts/expansion/` — read its README first**: `fold.mjs` (chunk → sources, with the collision rules), `auto-titles.mjs` (re-point bad Wikipedia titles), `fix-titles.mjs`, `drop.mjs`, `add-alias.mjs`, `add-oceans.mjs`, `append-row.mjs`, `wp-check.mjs`, **`probe.mjs`** (does the bank have every X of country Y?), the sub-agent `BRIEF.md`, and the audit and probe reports under `reports/` |
| which colours a country's flag has | `scripts/data-flags.mjs` (one row per country; generous) |
| which places a themed prompt accepts | `src/data/themes.js` (hand-edited, shipped as-is; a theme with custom prompt text goes in `WORMILLION_THEME_PROMPTS` at the bottom) |
| which Wikipedia article an entry scores on | `scripts/data-wiki-titles.mjs` (`WIKI_TITLES` overrides, `WIKI_VERIFIED` "I looked, it's right") |
| which ocean an island/sea is in | derived from coordinates in `scripts/data-oceans.mjs`; hand corrections in `OCEAN_OVERRIDES` there |
| what `--check` refuses (disambiguation, wrong subject, airport-type articles) | `scripts/fetch-pageviews.mjs` (`EXPECTED` words per category, `WRONG_SUBJECT`) |
| how prompts are worded / drawn / ramped / weighted | `src/js/promptBank.js` (`NOUN`, `PLAIN_TEXT`, `CATEGORY_LABEL`, `SIZE_RULES`, `drawModifier`, `drawSlots`) |
| how answers are matched (aliases, loose, fuzzy) | `src/js/matching.js` |
| what advances a round, retries, the miss hints, the summary ladder, the run's mode | `src/js/run.js` (hint *wording* is in `ui.js`) |
| the review rows and the rarest answer per prompt | `src/js/run.js` (`reviewRun`, `rarestFor`) |
| the daily's seed, the date key, the pinned sequence, the puzzle number, the countdown | `src/js/seed.js` (`DAILY_NAMESPACE`; bump it on purpose, never reseed by accident; `DAILY_EPOCH` is dig #1) |
| the daily lock, the mode chips, `?daily`, the countdown, the share/review buttons | `ui.js` (`refreshTitle`, `modeText`, `startRun(mode)`, `copyShare`, `showReview`) |
| the share text and its emoji bands | `src/js/share.js` (`BANDS`, `CANONICAL_URL`) |
| streaks, daily stats, which records get trimmed, `rounds` on a record | `src/js/persistence.js` (`dailyStreak`, `dailyStats`, `trim`, `toRecord`) |
| the comparison's server logic: replay, open window, aggregate shape | `netlify/functions/lib/daily.js` (`OPEN_BEFORE/AFTER`, `SCORE_BUCKET`, `replayRun`, `applySubmission`) |
| the comparison's HTTP: CORS origins, cache, Blobs adapter | `netlify/functions/lib/netlify.mjs` (`ALLOWED_ORIGINS`), the two handlers |
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

- **`--check` is the important half** and is stricter since the audit: besides
  disambiguation pages and descriptions that don't read like the category, it
  refuses any article whose title or description reads like an airport,
  station, school, hotel, stadium, club, crash, film… (`WRONG_SUBJECT`). Fix
  with `WIKI_TITLES` or `WIKI_VERIFIED`; the "reached their article through a
  redirect" list is informational.
- `build-data` refuses to run if any entry lacks pageviews — deliberate.
- `src/data/pageviews.json` is committed, so `build-data` works offline.
  Responses cache under `scripts/.cache/` (gitignored, local only). A top-up of
  a few dozen entries takes a minute; the full ~9,000 takes tens of minutes —
  run it in the background.
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

None of these changed in the expansion. What the audits measured against them:
no prompt falls below `MIN_ELIGIBLE` except the two deliberate tight themes
(Mesopotamia, the Great Lakes); the only size prompt near `MAX_ELIGIBLE_SHARE`
is "capital whose country has over 10 million" at 58%; the next 30 dailies all
generate cleanly (#26, 2026-10-07, lands two 6–7-answer region rounds — hard
by chance, not unfair).

## Environment gotchas (this machine)

- **Node is not on the Bash tool's PATH.** Prefix with
  `export PATH="$PATH:/c/Program Files/nodejs"` (Node 24.19), or use the
  PowerShell tool with
  `$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")`.
- **The Bash tool's timeout maxes at 600 s** and a longer command is moved to
  the background with its output in a file. Start anything over ~5 minutes
  (the pageview fetch, a title-resolver pass) with `run_in_background` and
  wait for the notification.
- **Wikipedia throttles.** The resolvers sleep between batches and back off on
  429, but two running at once will trip it — never run two `auto-titles`
  passes or an `auto-titles` and a `fetch-pageviews` together. Both cache
  (`scripts/.cache/`, `scripts/expansion/work/titles-cache.json`, both local),
  so a re-run costs nothing for what is already known.
- **Quoted heredocs (`<<'EOF'`) are fine for data**, but the Bash tool collapses
  `\\` to `\` inside them — a JS regex like `/[.*+?^${}()|[\]\\]/` written
  through a heredoc arrives broken. Write scripts with the Write tool.
- **A Python patcher turns `\\b` into a backspace byte.** Use the Edit tool for
  single-line edits; all of `src/` is LF.
- **Line endings are mixed on disk**; git normalises to LF (`.gitattributes`),
  so it warns "CRLF will be replaced by LF" on every commit — harmless. The
  expansion scripts detect a file's EOL before writing.
- **One commit per change** is the house rule; a data expansion is one commit
  per chunk or per wave, with a `[WIP]` local checkpoint after each fold so a
  session cut-off loses nothing (squash before pushing, as `39534ba` was).
- **Sub-agents default to Sonnet unless the user names a model for the job**
  (2026-09-15: they asked for Opus on a narrow coverage check; do what they
  say, and fall back to Sonnet when they say nothing). **For data work: at
  most two at a time, appending to their output file every ~30 rows, one
  category × region each.** Seven Opus agents launched together all died on
  the session cap with zero rows; the Sonnet pairs lost nothing across two
  more caps. Their brief is `scripts/expansion/BRIEF.md`. Audit/debug agents
  (read-only, one report each) can be Sonnet too — the two that ran cost
  ~300k tokens each and earned it. A rate-limited agent retried a minute
  later usually goes through.
- **ESM imports on Windows need `file:///C:/...` URLs** when importing a repo
  module from outside the repo; `createRequire(import.meta.url)` loads the
  classic-script modules from an `.mjs`.
- **CSS class names are global**, and `[hidden]` must keep winning (global
  `[hidden] { display: none !important }`).
- **The test file glob must stay `node --test` with no arguments** (Node 20/22
  on Linux CI doesn't expand a quoted glob the way Node 24 on Windows does).
- `Claude in Chrome` is not installed, so `file://` can't be opened in the
  in-app pane; use the dev server. Headless Chrome works for screenshots.

## Driving the game from JS (browser pane, `?debug`)

`window.__wormillion` exposes `renderer`, `burst`, `drip`, `currentRun()`,
`start(mode)`, `diveTo(depth, tier)`, `celebrate()` and `shame()`.

- **`preview_start` by name reads `.claude/launch.json` from the folder the
  session was opened in.** Fallback: `node scripts/serve.mjs` in the
  background plus `navigate` to `http://localhost:8123/?debug`.
- **The pane pauses `requestAnimationFrame` when hidden.** Pump frames:
  `for (let i = 0; i < 80; i++) __wormillion.renderer.update(0.05); __wormillion.renderer.draw();`
  — that completes a dive and fires `onArrive`, which advances the round.
- **To play a whole run from JS**, after each submit pump the renderer *until
  `#answer-input` is re-enabled or the screen is no longer `play`*. For length
  prompts try `matching.looseKey(key)` as well as the key.
  `run.rarestFor(prompt)` gives the answer that triggers the ★ review line.
- **Rounds are 30 s and tool round-trips are slow.** A timed-out round
  silently advances. Do set-slot + submit + read-feedback in ONE
  `browser_batch` / one JS call. The 10 s overlay holds expire between tool
  calls too.
- **Right after `navigate`, layout is in flux for about a second.**
- To force a prompt: `const run = __wormillion.currentRun(); run.state.slots[run.roundNumber - 1] = { category: 'city', region: 'Caribbean' };`
  then repaint `#prompt-text` from `run.prompt().text`. Slot shapes:
  `{category}`, `{category, region}`, `{category, theme}`, `{category, ocean}`,
  `{category, flag:{colours:[…]}}`, `{category, size:{op,value}}`,
  `{category, letter:{kind,letter}}`.
- To submit like a player: set `#answer-input.value`, dispatch `input`,
  `#answer-form.requestSubmit()`; read `#feedback`.
- **Known ≥85% answers for the jackpot (2026-09-15 bank):** Micronesia (100%) /
  Togo for country; South Tarawa / Funafuti for capital; Musanze / Salelologa
  / Auki for city; Grand Manan / Dolsan for island; Pihlajavesi / Achit Lake
  for lake; Tandikat / Chiaksan for mountain; Canoas / Seal for river; Erg
  Iguidi / Skeleton Coast for desert; Bay of Pomerania / Gulf of Masirah for
  sea. **Known 0% answers for the dud:** New York on a city round, United
  States on a country round, Mount Everest on a mountain round, Antarctic
  Desert on a desert round. `celebrate()` / `shame()` fire either without one.
- `diveTo` never moves the worm upward; call `renderer.reset()` first.

## Decisions a new session should not undo

- **Fuzzy matching stays.** The user asked for autocorrect-style matching
  ("sahra → Sahara is exactly what I want"); it's guarded (no slack ≤4 chars,
  ties rejected, no substring matching), and an exact name anywhere beats a
  correction anywhere. SPEC 3.6/3.7. A tie that now refuses ("Tames") is the
  guard working, not a regression to patch around.
- **Filler is optional in both directions, and initialisms are for typing
  only.** "Everest" finds Mount Everest *and* "Mount Denali" finds Denali. A
  2–4-letter all-caps alias (NYC, UAE, SF) never feeds a letter or length rule.
- **"Strait" is not a filler word** — straits carry their bare name as an
  alias instead (Gibraltar, Hormuz, Dover, Magellan…). Adding `strait` to
  `FILLER` would change every existing letter/length rule; the alias is
  cheaper and was chosen.
- **A shared loose form goes to the entry that owns it by name** ("Arabian" →
  Arabian Sea). Two names, or two aliases with no name, identify neither, and
  `validate` fails on the alias-vs-alias kind so one can't ship.
- **Filler words are not letters; whole official names are.** Countries,
  capitals, cities and seas keep their whole official name
  (`WHOLE_NAME_CATEGORIES`). Length rules judge the spelling typed or its
  generic-word-trimmed form, whichever fits. Digits are characters (K2).
- **Entries are named as the world names them.** No bank-invented
  disambiguators; real names that carry a generic word stay. A parenthetical
  in a name (`Red Desert (Wyoming)`) is only there when Wikipedia's own title
  has it and the bare name is taken.
- **One real place, one row.** The same river under two countries' names
  (Okanagan/Okanogan, Cuando/Chobe), a lake and "its" reservoir, a peak and its
  twin that share one Wikipedia article — merge into aliases of the surviving
  entry; both spellings still land. Two rows sharing a `wikiTitle` in one
  cohort is a bug.
- **An entry scores on its own article or not at all.** ~90 places with no
  usable English Wikipedia article were dropped rather than scored on a
  park/district/airport; `--check`'s `WRONG_SUBJECT` rule now refuses those
  automatically. `WIKI_VERIFIED` is for "the description just doesn't say
  *city*", never for "close enough". The two polar deserts scoring on
  `Antarctica`/`Arctic` are the one deliberate exception (see priority 3).
- **Generosity is the house style.** Emblem colours count for flags, island
  nations are islands (all 34 country/island pairs are intentional — the
  audit re-checked), Cape Town and La Paz are cities, a wrong-category answer
  gets a nudge rather than "Not recognized". **Bias data toward inclusion.**
- **The city cohort excludes national capitals, and every city prompt says
  so.** Don't add capitals to be generous. Big US state capitals *are* cities.
- **Ocean membership is derived, not curated**; `coastal` is likewise derived.
  Everything else themed *is* curated on purpose.
- **15 rounds, each category once or twice, two plain rounds to open, ramp
  70→100%.** The user asked three times for more conditional prompts; this is
  where it landed.
- **US state capitals live in the `capital` cohort**; their `size` is the US
  population; their flag is the US flag.
- **The jackpot and dud tiers are symmetric by design.** `POINTS_GAMMA` was
  taken off the list by the user; leave it.
- **A themed sea prompt says "sea" unless the theme holds an ocean.**
- **Letter-rule misses say which letter.**
- **`file://` must keep working.** Classic scripts + generated `data/bank.js`,
  no ES modules, no external resources. The one `fetch()` (the comparison) is
  optional and guarded.
- **The server scores; the client only sends names.** Keep `lib/daily.js`
  free of `@netlify/blobs` so the suite runs without an install.
- **`ui.js` is the only module that touches `document`.**
- **Daily and endless differ in exactly one thing: the rng behind
  `drawSlots`.** `tests/seed.test.js` pins the 2026-09-12 sequence and
  `tests/prompts.test.js` pins dig #1's fifteen prompts. Growing the bank does
  not break the pin (it didn't); reordering categories, regions or themes
  would.
- **Tests don't pin which entry is rarest.** The short-desert test used to
  assert "Monte Desert"; it now asserts that whatever `rarestFor` returns is
  accepted. Write new tests the same way — the bank will grow again.

## Open threads

- **The comparison block is dead on Pages until Netlify redeploys** — the
  highest-value hour of the next session (priority 2).
- **No social-preview metadata.** `index.html` has a plain
  `<meta name="description">` but no Open Graph / Twitter Card tags, so a
  shared link previews as a bare URL. Cheap, real value for a game that
  spreads by sharing. Offered 2026-09-14; not picked up.
- **The aggregator listing itself** — the reason daily mode exists, and not a
  code task. If the user names the site, check what metadata it wants.
- **A named leaderboard** — the natural next server step; per-player
  submission blobs exist. Needs a chosen name and moderation per `playerId`.
- **More prompt kinds / themes** — the user asks often and likes specific,
  harder prompts. The bank can now support themes it couldn't before
  (Malaysian peaks, Philippine volcanoes, Japanese islands, Great Plains
  rivers…). Not during this expansion ("no new categories or questions, just
  data"), but that was a scoping call for one session.
- **Page weight** — `bank.js` 1.2 MB, gzip ~250 KB over Pages. Nobody has
  complained; if it matters, the cheapest cut is `aliases` for entries that
  have none (already omitted) and `region` arrays on cities (repeated per
  row). Don't split the bank across files — `file://` must keep working.
- **Population refresh** — declined 2026-09-12; the audit found `size` clean
  (it spot-checked the implausible-looking ones and they were real). Revisit
  only if a player reports a size prompt being wrong.

## Things the user has said they care about

- Prompts should be specific and get harder — keep extending. The *question
  itself* must carry any rule that matters, not a badge beside it.
- Answers people obviously reach for must be accepted — `gap-check` is the
  guard (319 answers now); add to its list when a player reports a miss, and
  use `scripts/expansion/` to add the places, not hand edits.
- Spelling should autocorrect and show the real spelling — done and liked.
- Achievement should feel good and failure should sting a little (the 0%
  overlay was their idea, gross on purpose).
- They want to find the answers and the logic in the code — the tables above
  and README's "Where the logic lives".
- **Working style:** they read summaries closely and decide fast. Present open
  decisions as a numbered list with a recommendation each; they answer all in
  one message; then do the whole batch and say at the end whether anything
  needs a second prompt. Commit each change separately. Pushes to `main` are
  allowed without asking. Sub-agents are welcome when they earn their keep.
- **They watch their usage limit and hit it three times this session.** After
  a cut-off they want to know what was reused and what was lost — keep work
  in small committed steps, checkpoint before long jobs, and say plainly
  which is which when resuming. They will step away from the PC during long
  agent runs; the session should carry on to a committed, pushed state
  without them.
