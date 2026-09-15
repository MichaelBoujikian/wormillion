# Handoff

For whoever (or whatever) picks this up next. `README.md` explains the game and
how to run it; `SPEC.md` is the design source of truth (v1.3, with an amendments
log in §13 — every behaviour change since v1.0 has a row there). This file is
what isn't in either: what to work on next, where things stand, every knob and
its current setting, the decisions that must not be quietly undone, and the
gotchas that cost time. Claude Code's project memory is keyed to this folder
(`C:\Users\smite\repos\wormillion`); this file is the memory that survives.

---

# What the next session is for

The user named two priorities, in this order (2026-09-14):

1. **More places in the bank.**
2. **Bug hunting.**

Everything needed for both is below. The game is otherwise feature-complete —
the user's own words: "maybe the game is pretty much done already." Don't start
new features unless asked.

## Priority 1 — more places

### Where the gaps actually are (measured 2026-09-14, not guessed)

Cohort sizes: **58 deserts** · 95 seas · 130 rivers · 132 lakes · 188 mountains ·
197 countries · 247 capitals · 314 cities · 358 islands. **Deserts are half the
size of the next-smallest cohort** — the most obvious place to add. Lakes and
rivers are the next thinnest.

Prompts with the fewest answers (a thin prompt is where a player gets stuck):

| answers | prompt | verdict |
|---|---|---|
| 2 | country, population over 1 billion | **reality — leave it** (China, India) |
| 7 | river longer than 5,000 km | **reality — leave it** |
| 14 | mountain over 8,000 m | **reality — leave it** (that's all of them on Earth) |
| 8 | lake larger than 30,000 km² | reality, mostly |
| 11 | desert larger than 500,000 km² | reality, mostly |
| 16 | country, population over 100 million | reality |
| 17 | non-capital city over 10 million | could grow a little |
| 19–24 | lake >10,000 km², island >100,000 km², desert <100,000 km², river >3,000 km | **desert <100,000 km² is the one worth growing** |

Themes with few members (a themed prompt *rejects* everything outside its set,
so small is risky unless it's deliberate):

| members | theme | verdict |
|---|---|---|
| 2 | river · Mesopotamia | **deliberate, documented — leave it** |
| 5 | lake · the Great Lakes | reality — there are five |
| 5 | mountain · the Rockies | **worth growing** — many notable peaks missing |
| 6 | mountain · the Andes | **worth growing** |
| 5 | lake · the British Isles | worth growing |
| 5 | lake · Scandinavia | worth growing |
| 7 | mountain · Indonesia, island · Hawaii | fine |
| 6 | sea_ocean · the Antarctic | reality |

Regions, for scoping prompts (needs **≥6** carriers to be offered at all):

- Every region clears the bar for countries except **Scandinavia & the Nordics (5)** —
  that is real (5 sovereign Nordic countries) and README says explicitly that
  nothing was invented to pad it. **Don't pad it.**
- Thinnest city regions: Central America (7), Southern Africa (9), Caribbean (11),
  Oceania (11), West Africa (12). All usable, all could grow.

### The pipeline — four commands, in this order

```bash
npm run fetch-pageviews -- --check   # resolve Wikipedia titles; lists missing/ambiguous/wrong-subject
npm run fetch-pageviews              # fetch 60 days of pageviews + coordinates for anything new (cached)
npm run build-data                   # fold pageviews/oceans/flags into src/data/*.json and bank.js
npm run validate                     # schema, aliases, loose-form collisions, regions, oceans, flags, capitals-vs-cities, UN audit, themes
```

Then `npm test && npm run gap-check` before pushing.

- **`--check` is the important half.** It complains about names that resolve to a
  disambiguation page or the wrong subject. Fix with `WIKI_TITLES` (override the
  article) or `WIKI_VERIFIED` ("I looked, it's right") in
  `scripts/data-wiki-titles.mjs`. Take wrong-subject hits seriously: "Hue" once
  resolved to the *colour*, whose pageviews would have made Huế the most famous
  city in the bank. The "reached their article through a redirect" list is
  informational — but skim it for a name that redirected to the wrong real place.
- **`build-data` refuses to run if any entry lacks pageviews** — deliberate, since
  a zero would score as maximally obscure.
- `src/data/pageviews.json` is committed, so `build-data` works offline; only new
  entries need the network. Responses cache under `scripts/.cache/` (gitignored).
  A top-up of a few entries takes seconds; a full re-fetch of ~1,700 ~15 minutes.
- A new island or sea gets its ocean from coordinates; if the article has no
  coordinates or the box is wrong, add `OCEAN_OVERRIDES` in `scripts/data-oceans.mjs`.
  `validate` will tell you.
- A new country needs a row in `scripts/data-flags.mjs` or `build-data` refuses.
- A new city's `Country` must match a `data-countries.mjs` name exactly and must
  not be that country's capital — build and validator both refuse. City names are
  the most-shared names on Wikipedia (Phoenix, Cork, Split, Salvador, Portland…);
  expect `--check` to want an override for about one row in ten.
- If a place belongs to a theme, **add it to `src/data/themes.js` too** — a themed
  prompt rejects what's outside its set.
- Scoring magnitude = median of 60 daily English-Wikipedia views × 30.44. It
  measures *curiosity*, not fame: the Caspian Sea outdraws the Pacific Ocean.
  `npm run score-report` prints the curves and the jackpot count.

### How the last data session went (2026-09-13, the 12 small lakes)

The user reported "Name a lake smaller than 100 km² — what scores for this?"
It had 21 answers, all Alpine/NZ, none of the small lakes people actually reach
for. Added Bled, Bohinj, Placid, Hillier, Peyto, Minnewanka, Jökulsárlón, Retba,
Braies, Misurina, Plitvice, Laguna Colorada → 33 answers. Four needed
`WIKI_TITLES` overrides (Placid → the village; Braies → Pragser Wildsee;
Jökulsárlón; Plitvice → the national park, `WIKI_VERIFIED`). The four Alpine ones
joined the `the Alps` theme; all twelve went into `gap-check`'s list. That is the
shape of a good data commit: **the places a player would actually type.**

## Priority 2 — bug hunting

### The cheap sweep, first

```bash
npm test && npm run validate && npm run gap-check
```

`gap-check` is the guard that matters: it pushes answers people obviously reach
for ("Maui", "Seychelles", "Everest", "Volga") through the real matcher and fails
if any has nowhere to land. **Add to its list whenever a player reports a miss.**

### Where bugs have actually been found

- **The newest screens are the least battle-tested**: the review screen, the
  "Daily digs" stats block, and the comparison block all shipped fast on
  2026-09-13. The original game has had far more scrutiny than these three.
- **A sub-agent review pass earns its keep.** One over the -dle-kit commits found
  nine real things, three user-visible: a dead Share button (an author
  `display:grid` beat `[hidden]`), the ★ "found the rarest" line silently lost to
  4-dp rounding, and length-prompt reveals naming a spelling the prompt would
  reject. The prompt that worked: give it the commit range, name the specific
  edge cases to think about (midnight turnover, pre-existing localStorage
  records, DST, fallback paths), tell it to run the suite itself, and tell it
  **not to edit anything** — just report findings with file:line and a repro.
- **How players report bugs**, and what it usually means: "X isn't accepted."
  First check which *category* the round was — the user once reported Estonia
  missing when the round was a capitals flag prompt and Tallinn was the answer.
  Then check whether a letter/length rule was in play. Then fix the row.

### Known-shaky things worth a look

- Flag rows, populations and the city theme list were **written from memory**
  (by Claude; the city rows by a sub-agent, reviewed by a second one). Any of
  them could be wrong. Fix the specific row a player trips on — the user
  declined a bulk refresh ("don't waste tokens on updating every population").
  UAE is listed at 9.5M and is really ≈11M; left on purpose.
- One 400 was seen locally and never reproduced: a comparison submission for a
  record made earlier in that session was rejected on the title screen. Every
  record since replays fine, and rejections now log the round and reason. If a
  player reports no comparison block, read the Netlify function log first.
- Daily lock is localStorage-only — a cleared browser replays the day and, with a
  fresh `playerId`, counts again. Accepted for an anonymous game.

---

# State of the world

## ⚠ Netlify is frozen (as of 2026-09-13)

The user's Netlify account hit an account-wide usage cap ("production deploys and
agent runners are paused") — unrelated to this repo or to Claude Code.

- `wormillion.netlify.app` **serves whatever was last deployed** (`e881c8a`,
  confirmed live and working, functions included) and **will not pick up any push
  after that** until the user upgrades or the cap resets.
- **GitHub Pages is unaffected** (separate infra, GitHub Actions) and keeps
  getting every push.
- **Decision (2026-09-13): keep developing and pushing to `main` as normal.**
  Netlify gets ONE deploy later, once the user upgrades for a month — not a sync
  per push.
- Consequence to know: if a push changes the bank or how prompts are drawn
  (**which Priority 1 will do**), the GitHub Pages copy's `draw` fingerprint stops
  matching Netlify's stale functions, and the comparison block quietly stops
  appearing for Pages players (a clean `draw-mismatch`; no error state, no data
  lost; self-heals the moment Netlify redeploys). The game itself is unaffected —
  the comparison is the only feature not self-contained in `src/`.
- **When Netlify is un-paused:** push anything (or "Trigger deploy" in the
  dashboard) to sync, then re-verify with the curl checks below.

## Where it lives

- **Repo:** https://github.com/MichaelBoujikian/wormillion (public; `gh` is
  authenticated with `repo` + `workflow` scopes, `git push` just works).
- **GitHub Pages:** https://michaelboujikian.github.io/wormillion/
  (`.github/workflows/deploy.yml`; `ci.yml` runs test + validate on Node 22).
- **Netlify:** https://wormillion.netlify.app — `netlify.toml` publishes `src/`
  and runs `npm test && npm run validate` as the deploy command, so a red suite
  deploys nowhere. Functions at `/.netlify/functions/daily-submit` and
  `daily-stats`; Blobs store `daily`. Netlify does not report deploys back to
  GitHub, so a deploy log is only in their dashboard.
- **Local:** `C:\Users\smite\repos\wormillion`. Double-click `play.cmd` to play.
  `npm start` serves on :8123 (`.claude/launch.json` names it `wormillion` for
  the in-app browser pane) **and mounts the comparison API over an in-memory
  store**, so the whole server flow plays locally without Netlify.

## Green as of 2026-09-14

`npm test` 173 · `npm run validate` 1,719 entries · `npm run gap-check` 199
obvious answers · `npm run bundle` ~467 KB single file, 18 scripts inlined.
Working tree clean, everything pushed; `main` is at the HANDOFF refresh commit.

**Bank:** 197 countries · 247 capitals · 314 cities · 132 lakes · 130 rivers ·
188 mountains · 58 deserts · 358 islands · 95 seas = 1,719. 91 entries are "one
in Wormillion"; a run of median answers scores ~6,700 and ends around depth 540
(Mantle).

## How it got here (short version; details in SPEC §13 and git log)

v1.0–1.2 built the game: nine categories, pageview-based scoring, fuzzy matching,
the prompt-modifier system, the pixel-art dig scene, the jackpot and dud overlays,
the summary ladder. 2026-09-12 added the `city` category and the 0% dud.
2026-09-13 was three pieces, in order: **daily + endless modes** (SPEC 3.15, a
date-seeded draw), **the -dle kit** (3.16 — share text, puzzle number, streak,
countdown, daily stats, review screen), and **the daily comparison** (3.17 — two
Netlify Functions over Blobs; the client sends only its fifteen answers and the
server replays and scores them). Then the length-rule fix (3.1a v1.3) and twelve
small lakes.

## Netlify: verifying the comparison

Two `curl` submissions for dig #1 scored exactly what the local engine did, the
duplicate was refused, CORS came back for the Pages origin, and the Pages copy
fetched stats cross-origin from a real browser with no console errors. Not yet
seen: a human playing a daily on the live site and watching the block appear.

If it ever looks broken, in order:

1. **Deploy log** — did the build pass and both functions bundle? A bundling
   failure points at `import daily from './lib/daily.js'` (CJS from ESM) or the
   `included_files` line in `netlify.toml`.
2. `curl "https://wormillion.netlify.app/.netlify/functions/daily-stats?day=YYYY-MM-DD"`
   — expect JSON with `count`, `prompts` (15) and `number`. A 500 with "cannot
   find src/data/bank.js" means `findRoot()` in `lib/daily.js` needs another
   candidate path; log `process.cwd()` and `__dirname` there.
3. **Play a daily on the Netlify URL** — a missing block plus a 4xx in the
   function log means the replay rejected the answers; the log says which round
   and why.
4. The Pages copy calls `https://wormillion.netlify.app` (`REMOTE_API` in
   `src/js/compare.js`; CORS admits `https://michaelboujikian.github.io`). **If
   the Netlify site is ever renamed, change both.**
5. A day's aggregate can be rebuilt from its submissions:
   `createDailyApi(...).rebuild(day)`. No endpoint for it on purpose.

Harmless test rows `smoke-test-0001/0002` sit in dig #1; delete from the Netlify
Blobs UI if they bother you.

---

# Reference

## Where the logic lives

| want to change… | file |
|---|---|
| the places themselves | `scripts/data-physical.mjs`, `scripts/data-countries.mjs` (pipe-delimited) |
| the US state capitals | `scripts/data-us-states.mjs` (they feed the `capital` cohort, like minor peaks feed `mountain`) |
| the non-capital cities | `scripts/data-cities.mjs` (`Name\|Country\|population\|aliases`; Country must be a `data-countries.mjs` row — region and flag are inherited; the build refuses a city that is its country's capital) |
| which colours a country's flag has | `scripts/data-flags.mjs` (one row per country; generous) |
| which places a themed prompt accepts | `src/data/themes.js` (hand-edited, shipped as-is; a theme with custom prompt text goes in `WORMILLION_THEME_PROMPTS` at the bottom) |
| which Wikipedia article an entry scores on | `scripts/data-wiki-titles.mjs` (`WIKI_TITLES` overrides, `WIKI_VERIFIED` "I looked, it's right") |
| which ocean an island/sea is in | derived from coordinates in `scripts/data-oceans.mjs`; hand corrections in `OCEAN_OVERRIDES` there |
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

## Every knob and where it is set today

| knob | value | where |
|---|---|---|
| categories per run | 9 categories, 15 slots: every category once, six of them twice | `CATEGORIES`, `drawSlots()`, `promptBank.js` |
| plain opening rounds | 2 | `OPENING_ROUNDS`, `promptBank.js` |
| modifier chance, rounds 3→15 | 70% → 100% (~11.4 conditional rounds of 15) | `MODIFIER_CHANCE_START/END`, `promptBank.js` |
| flag-prompt weight in the modifier draw | 2 (same as region/theme/ocean/letter; 1 for size) → ~0.6 flag prompts per run | `options.push('flag', 'flag')` in `drawModifier()` |
| generated-modifier guard | ≥ 6 answers and ≤ 60% of the cohort | `MIN_ELIGIBLE`, `MAX_ELIGIBLE_SHARE`, `promptBank.js` |
| city region prompts | only regions with ≥ 6 cities (countries/capitals use every region with ≥ 6 countries) | `regionOptions()`, `promptBank.js` |
| city size thresholds | 500k / 1M / 5M / 10M, city-proper population | `SIZE_RULES.city`, `promptBank.js` |
| dig below the jackpot bar | `rarity × 70` | `DIG_SCALE`, `rarity.js` |
| jackpot bar | rarity ≥ 0.85 | `JACKPOT_RARITY`, `rarity.js` (jackpot.js and ui.js read it from there) |
| jackpot dig / perfect dig | 75 / 100 ("perfect" = rarity ≥ 0.995, shows as 100%) | `DIG_JACKPOT`, `DIG_PERFECT`, `PERFECT_RARITY`, `rarity.js` |
| points | 50–1000, gamma 1.4 below the bar; flat 950 for 85–99%, 1000 for 100% | `POINTS_*`, `POINTS_JACKPOT`, `rarity.js` |
| dud bar | rarity < 0.005 (shows as 0%) — the mirror of the perfect bar | `DUD_RARITY`, `isDud`, `rarity.js` |
| depth budget | 1500 (= 15 × 100); strata bands 100 each, Core from 600 | `TOTAL_DEPTH_BUDGET`, `rarity.js`; `strata.js` |
| jackpot hold; confetti/bolt rates | 10 s or the next answer; 70/s + bolt every 0.12 s → 14/s + 0.55 s → 5/s + 1.4 s | `HOLD_SECONDS`, `rates()`, `jackpot.js` |
| dud hold; drip/wisp rates; flies | 10 s or the next answer; 14 drips/s + wisp every 0.25 s → 3/s + 0.6 s → 1.2/s + 1.1 s; 5 flies | `HOLD_SECONDS`, `rates()`, `FLIES`, `dud.js` |
| where the dud words sit | bottom of the scene, 16% padding, so the rotten worm stays visible | `.dud` in `styles.css` |
| tunnel radius | 6; jackpot 11; perfect 14; blends over 6 depth units | `TUNNEL_R`, `TUNNEL_R_BY_TIER`, `TAPER_UNITS`, `worldRender.js` |
| relic spacing | one every ~11 units above depth 500, ~20 below | `paintRelics()`, `worldRender.js` |
| world depth | budget + 30 | `MAX_UNITS`, `worldRender.js` |
| daily turnover | local midnight (`seed.dailyKey()` is the local YYYY-MM-DD) | `seed.js` |
| daily plays per day | 1 (`persistence.dailyResult(today)` locks the button) | `ui.js` `refreshTitle`/`startRun` |
| dig #1 | 2026-09-12 | `DAILY_EPOCH`, `seed.js` |
| share grid bands | miss ⬜ · 0% 💀 · <25% 🟫 · <50% 🟧 · <70% 🟨 · <85% 🟩 · jackpot ⭐ · 100% 💎 | `BANDS`, `share.js` |
| share link off the web | GitHub Pages URL | `CANONICAL_URL`, `share.js` |
| history cap | 50 endless runs; dailies never trimmed | `HISTORY_CAP`, `trim()`, `persistence.js` |
| streak shown on the title | from 2 days ("· 2-day streak") | `refreshTitle`, `ui.js` |
| submission window | a day is open from 1 day before to 2 days after (UTC) | `OPEN_BEFORE`, `OPEN_AFTER`, `lib/daily.js` |
| stats cache | 60 s at the edge; 60 s in the client before refetching | `daily-stats.mjs`, `COMPARE_FRESH_MS` |
| CORS origins | Netlify itself, `https://michaelboujikian.github.io`, `http://localhost:8123` | `ALLOWED_ORIGINS`, `lib/netlify.mjs` |
| Pages copy's API | `REMOTE_API = 'https://wormillion.netlify.app'` | `compare.js` |

## Environment gotchas (this machine)

- **Node is not on the Bash tool's PATH.** Prefix with
  `export PATH="$PATH:/c/Program Files/nodejs"` (Node 24.19 / npm 11.17), or use
  the PowerShell tool with
  `$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")`.
- **The Bash tool's parser chokes on some heredoc bodies** (a `\'` inside a quoted
  heredoc, and at least one long Python patch with nothing obviously wrong) with
  "unexpected EOF while looking for matching `'`", and nothing runs. When that
  happens, write the script to the scratchpad with the Write tool and run it by
  path — that worked every time.
- **A Python patcher turns `\\b` into a backspace byte.** The JS regex `/daily\b/`
  written through a Python string landed as `daily^H` — silent, and it cost a
  debugging round (it happened twice). Use a raw string or build the bytes, then
  `cat -A` the line. **The Edit tool is simpler for single-line edits**; all of
  `src/` is LF now and doesn't need the patcher at all.
- **Line endings are mixed on disk**; git normalises to LF (`.gitattributes`), so
  it warns "CRLF will be replaced by LF" on every commit — harmless. Multi-line
  string patches must normalise line endings or they silently match nothing.
- **Quoted heredocs (`<<'EOF'`) are fine**, apostrophes and all; it is *unquoted*
  heredocs that choke. Python 3.13 is on PATH.
- **One commit per feature** is the house rule. When two changes are tangled,
  `git diff -- file` → keep only the hunks containing a marker →
  `git apply --cached` → commit → `git add -A` the rest.
- **ESM imports on Windows need `file:///C:/...` URLs** when importing a repo
  module from a script outside the repo; `createRequire(import.meta.url)` is how
  to load the classic-script modules from an `.mjs`.
- **Wikimedia rate limits:** the per-article REST pageviews endpoint 429s
  anonymous clients fast. The scripts use `action=query&prop=pageviews` (batched,
  50 titles/request). Don't switch back.
- **CSS class names are global**, and `[hidden]` must keep winning — there is a
  global `[hidden] { display: none !important }` because an author `display:grid`
  once beat it and left a dead button on screen. Scope any new class.
- **The test file glob must stay `node --test` with no arguments**: Node 20/22 on
  Linux CI doesn't expand a quoted glob the way Node 24 on Windows does.
- `Claude in Chrome` is not installed, so `file://` can't be opened in the in-app
  pane; use the dev server. Headless Chrome works for screenshots:
  `& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --screenshot=out.png "file:///C:/Users/smite/repos/wormillion/src/index.html"`.
- A subagent hit a session rate limit once; the retry a minute later went
  through. Retry before assuming the task is wrong.

## Driving the game from JS (browser pane, `?debug`)

`window.__wormillion` exposes `renderer`, `burst`, `drip`, `currentRun()`,
`start(mode)`, `diveTo(depth, tier)`, `celebrate()` and `shame()`.

- **`preview_start` by name reads `.claude/launch.json` from the folder the
  session was opened in.** Open sessions in `C:\Users\smite\repos\wormillion` and
  it just works. Fallback: `node scripts/serve.mjs` in the background plus
  `navigate` to `http://localhost:8123/?debug`.
- **The pane pauses `requestAnimationFrame` when hidden.** Pump frames yourself:
  `for (let i = 0; i < 80; i++) __wormillion.renderer.update(0.05); __wormillion.renderer.draw();`
  — that completes a dive and fires `onArrive`, which advances the round. Pump
  `drip`/`burst` the same way, then `wait` ~1 s before a screenshot.
- **To play a whole run from JS**, after each submit pump the renderer *until
  `#answer-input` is re-enabled or the screen is no longer `play`* — a fixed frame
  count isn't enough for a long dive, and stopping when `run.finished` flips is
  too early (the summary only shows when the last dive lands). For length prompts
  try `matching.looseKey(key)` as well as the key. `run.rarestFor(prompt)` gives
  the answer that triggers the ★ review line.
- **Rounds are 30 s and tool round-trips are slow.** A timed-out round silently
  advances, which looks like "Gobi isn't recognised as a desert" when it's really
  "the prompt is now a sea". Do set-slot + submit + read-feedback in ONE
  `browser_batch` / one JS call. The 10 s overlay holds expire between tool calls
  too — probe an overlay in the same call that raised it.
- **Right after `navigate`, layout is in flux for about a second**; scene canvases
  can read as 150×6000 until the `ResizeObserver` refits them.
- **Overlay words drop in at `opacity: 0`** — `wait` 1 s before screenshotting or
  you get drips and no words.
- To force a prompt: `const run = __wormillion.currentRun(); run.state.slots[run.roundNumber - 1] = { category: 'city', region: 'Caribbean' };`
  then repaint `#prompt-text` from `run.prompt().text`. For the *badge and icon*,
  set the **next** slot and answer the current one. Slot shapes: `{category}`,
  `{category, region}`, `{category, theme}`, `{category, ocean}`,
  `{category, flag:{colours:[…]}}`, `{category, size:{op,value}}`,
  `{category, letter:{kind,letter}}`.
- To submit like a player: set `#answer-input.value`, dispatch `input`,
  `#answer-form.requestSubmit()`; read `#feedback`.
- **Known ≥85% answers for the jackpot:** Togo (94%) / Micronesia (100%) for
  country; Savu Sea / Ceram Sea (100%) for sea; Aldan / Vilyuy / Olenyok for
  river; Masaya (100%) / Holguin / Santa Ana for city. **Known 0% answers for the
  dud:** New York on a city round, United States on a country round, Mount
  Everest on a mountain round. `celebrate()` / `shame()` fire either without one.
- `diveTo` never moves the worm upward; call `renderer.reset()` first.

## Decisions a new session should not undo

- **Fuzzy matching stays.** The user explicitly asked for autocorrect-style
  matching ("sahra → Sahara is exactly what I want"); it's guarded (no slack ≤4
  chars, ties rejected, no substring matching), and an exact name anywhere beats
  a correction anywhere. SPEC 3.6/3.7.
- **Filler is optional in both directions, and initialisms are for typing only.**
  "Everest" finds Mount Everest *and* "Mount Denali" finds Denali. A 2–4-letter
  all-caps alias (NYC, UAE) never feeds a letter or length rule. Any other
  spelling counts for letter rules — Hispaniola has an H via "Haiti" — generous
  on purpose.
- **A shared loose form goes to the entry that owns it by name** ("Arabian" →
  Arabian Sea; the Persian Gulf keeps "Arabian Gulf"). Two names, or two aliases
  with no name, identify neither, and `validate` fails on the alias-vs-alias kind
  so one can't ship.
- **Filler words are not letters; whole official names are.** "Mount", "Lake",
  "the" are stripped before any letter rule, but "Loch"/"Saint"/"Cape" are names.
  Countries, capitals, cities and seas keep their whole official name
  (`WHOLE_NAME_CATEGORIES`): Mexico City ends in Y, the Black Sea ends in A.
  Length rules judge **the spelling typed or its generic-word-trimmed form,
  whichever fits** ("Monte Desert" is short, "Mount Kilimanjaro" is long) —
  generous both ways by the user's choice. Digits are characters (K2).
- **Entries are named as the world names them.** No bank-invented disambiguators:
  Cuba, not "Cuba Island"; Singapore, not "Singapore City". The feedback line and
  the ladder print `entry.name`, so an invented name is visible. Real names that
  carry a generic word (Baffin Island, Luxembourg City) stay.
- **Generosity is the house style.** When an answer could reasonably be right,
  accept it: emblem colours count for flags, island nations are islands, Cape
  Town and La Paz are cities even though they are co-capitals, a wrong-category
  answer gets a nudge rather than "Not recognized". **Bias data toward
  inclusion** — a missing entry rejects a correct player, an extra one merely
  accepts a debatable answer.
- **The city cohort excludes national capitals, and every city prompt says so in
  the sentence** — "Name a city that isn't a national capital.", badge "City (not
  a capital)". The user asked for the rule in the question itself, not just a
  badge. Don't add capitals to be generous — the prompt would become a lie. Big
  US state capitals (Phoenix, Boston, Denver…) *are* cities: the exclusion is
  national capitals only.
- **Ocean membership is derived, not curated.** Don't reintroduce a hand list.
  `coastal` is likewise derived as "not landlocked". Everything else themed *is*
  curated on purpose, because a themed prompt rejects what's outside its set.
- **15 rounds, each category once or twice, two plain rounds to open, ramp
  70→100%.** The user asked three times for more conditional prompts; this is
  where it landed. No lever left short of making the opening conditional too.
- **US state capitals live in the `capital` cohort** ("Name a capital city."
  accepts Boise). Their `size` is the US population; their flag is the US flag.
  The user knows and hasn't objected.
- **The jackpot and dud tiers are symmetric by design.** 0% pays the ordinary
  minimum and digs nothing extra — the dud is shame, not a penalty.
  `POINTS_GAMMA` was taken off the list by the user; leave it.
- **A themed sea prompt says "sea" unless the theme holds an ocean** — "Name a sea
  in the Americas." doesn't invite "Pacific", which that theme rejects.
- **Letter-rule misses say which letter** ("Lake Erie has no double letter"), not
  just "doesn't fit this one".
- **`file://` must keep working.** Classic scripts + generated `data/bank.js`, no
  ES modules, no external resources. The one `fetch()` (the comparison) is
  optional and guarded by `compare.apiBase()`. `npm run bundle` makes the
  single-file `dist/wormillion.html`.
- **The server scores; the client only sends names.** Never trust a client-supplied
  score, rarity or depth in `lib/daily.js`; the replay is the anti-cheat. Keep
  `lib/daily.js` free of `@netlify/blobs` so the suite runs without an install.
- **`ui.js` is the only module that touches `document`.** `worldRender.js`,
  `jackpot.js` and `dud.js` take canvases; `run.js` returns data and `ui.js` turns
  it into words. That is what keeps the suite runnable with plain `node --test`.
- **Daily and endless differ in exactly one thing: the rng behind `drawSlots`.**
  Don't fork scoring, prompts or the ramp by mode. `tests/seed.test.js` pins the
  2026-09-12 sequence, and `tests/prompts.test.js` pins dig #1's fifteen prompts —
  a change to either is a change to every past daily, so do it knowingly.

## Open threads (nothing is queued beyond the two priorities)

- **No social-preview metadata.** `index.html` has a plain `<meta name="description">`
  but no Open Graph / Twitter Card tags, so the link previews as a bare URL in
  Discord, iMessage and on an aggregator listing. Cheap fix, real value for a game
  that spreads by sharing. Offered 2026-09-14; the user hasn't picked it up yet.
- **The aggregator listing itself** — the actual reason daily mode exists, and not
  a code task. If the user names the site, check what format/metadata it wants.
- **A named leaderboard** — the natural next server step; the per-player
  submission blobs are already there. Needs a chosen name and its moderation per
  `playerId`; nothing else server-side changes.
- **More prompt kinds** — the user asks for new ones often and likes specific,
  harder prompts.
- **Population refresh** — declined 2026-09-12; revisit only if a player reports a
  size prompt being wrong.

## Things the user has said they care about

- Prompts should be specific and get harder — keep extending. And the *question
  itself* must carry any rule that matters, not a badge beside it.
- Answers people obviously reach for must be accepted — `gap-check` is the guard;
  add to its list when a player reports a miss.
- Spelling should autocorrect and show the real spelling — done and liked.
- Achievement should feel good (jackpot overlay, craters, deeper digs, the ladder,
  the flat 950) and failure should sting a little: the 0% overlay was their idea,
  gross on purpose ("blood and poop dripping from the words", "the worm should
  become a bit decrepit and rotten").
- They want to find the answers and the logic in the code — the tables above and
  README's "Where the logic lives".
- **Working style:** they read summaries closely and decide fast. Present open
  decisions as a numbered list with a recommendation each; they answer all in one
  message; then do the whole batch in one prompt and say at the end whether
  anything needs a second prompt. Commit each feature separately. Pushes to `main`
  are allowed without asking. Sub-agents are welcome when they earn their keep
  (authoring the city rows, reviewing them, and the -dle-kit bug review all did).
  They watch their own usage limit and will say so — work in small committed
  steps so nothing is lost mid-task.
