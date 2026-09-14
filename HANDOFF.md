# Handoff

For whoever (or whatever) picks this up next. `README.md` explains the game and
how to run it; `SPEC.md` is the design source of truth (v1.3, with an amendments
log in §13 — every behaviour change since v1.0 has a row there). This file is
what isn't in either: where things stand, what to check first, every knob and
its current setting, the decisions that must not be quietly undone, and the
gotchas that cost time. Claude Code's project memory is keyed to this folder
(`C:\Users\smite\repos\wormillion`); this file is the memory that survives.

## State as of 2026-09-13 (evening)

**⚠ Netlify is frozen mid-session** — the user's account hit a Netlify
account-wide usage cap ("production deploys and agent runners are paused"),
unrelated to this repo or to Claude Code. Effective now: `wormillion.netlify.app`
serves whatever was last deployed (currently `e881c8a`, confirmed live and
working) and **will not pick up any push after that** until the user upgrades
or the cap resets — check the Usage/Billing page in their Netlify dashboard
for when. GitHub Pages is unaffected (separate infra, deploys via GitHub
Actions) and keeps getting every push normally.

Decision (2026-09-13): keep developing and pushing to `main` as normal;
Netlify gets ONE deploy later, once the user upgrades for a month, rather
than syncing after every push. Consequence to know about: if a push between
now and that eventual deploy changes the bank or how prompts are drawn
(`drawSlots`, category/region/theme data), the GitHub Pages copy's `draw`
fingerprint for a given day will stop matching Netlify's stale functions,
and the daily-comparison block will quietly stop appearing for GitHub Pages
players on days affected (a clean `draw-mismatch`, not an error state; no
data lost; self-heals the moment Netlify redeploys). The game itself
(play/score/persistence/share/review) is unaffected either way — the
comparison is the only feature not fully self-contained in `src/`.
**When Netlify is un-paused: push anything (or "Trigger deploy" in their
dashboard) to sync it up**, then re-verify with the `curl` checks in
"Netlify: what to check first" below.

**Latest: the daily comparison** (`f6cecc0`…, SPEC 3.17) — the first server
piece. `netlify/functions/lib/daily.js` (pure, 12 tests) replays a player's
fifteen answers and scores them server-side; `daily-submit.mjs` /
`daily-stats.mjs` wrap it in Netlify Functions over Blobs; `src/js/compare.js`
turns the day's histograms into "Better than 62% of 143 diggers today";
`ui.compareDaily` shows it on the summary and the locked title. `npm start`
mounts the same API over a memory store — verified end to end in the browser
that way, then against the live site: `https://wormillion.netlify.app` (found
by guessing the name; it answered) — a `curl` submission for dig #1 scored
4,261 exactly as the local engine did, the duplicate was refused, CORS
headers came back for the Pages origin, and stats read back after a
propagation delay that `consistency: 'strong'` (`e2f5b11`) removes.
Dailies only; endless has nothing to compare.

**Before that: the -dle kit** (`25cc9b6`…`2caf1df`, SPEC 3.16): puzzle number (#1 =
2026-09-12), share text (`src/js/share.js`, round-order emoji grid), average
obscurity on the summary, streaks, a midnight countdown, a "Daily digs" stats
block with a stratum spread, and a review screen with the rarest possible
answer per prompt (`run.reviewRun`, `run.rarestFor`). Records store `rounds`;
dailies are never trimmed from history. A sub-agent review pass found nine
things; fixed in `55aab91` (a dead Share button — `[hidden]` now always wins),
`9221b96` (★ at 4 dp, accepted spellings in the reveal, a `draw` fingerprint
on daily records + dig #1's prompts pinned in `tests/prompts.test.js`) and the
polish commit after it. Tests 148; bundle ~450 KB, 17 scripts.

**Before that: daily and endless modes** (`ad0dd86`…`998080e`, SPEC 3.15).
"Today's dig" = the 15 slots drawn from a date-seeded rng (`src/js/seed.js`),
one per day, locked on the title once played, tagged `mode`/`dailyKey` in
history; "Endless" = the old random draw. `?daily` deep-links. The user wants
this for a -dle aggregator and, later, a leaderboard from other players'
dailies — nothing server-side exists yet. The plan the user liked (2026-09-13):
Netlify Functions + Blobs, one aggregate document per day (`count`, score and
rarity histograms, per-round histograms — no per-player rows), the page posts
after a daily and shows "better than N%"; degrade silently on `file://` and
GitHub Pages. `averageRarity` is the number it would post.

### State as of 2026-09-12 (end of day)

- **Live, twice, from the same `src/` folder**, both redeploying on every push to `main`:
  - GitHub Pages: https://michaelboujikian.github.io/wormillion/ (`.github/workflows/deploy.yml`; `ci.yml` runs test + validate on Node 22). `gh run list` shows both.
  - Netlify: the user's account is connected to the repo; `netlify.toml` publishes `src/` and runs `npm test && npm run validate` as the deploy command, so a red suite deploys nowhere. The site name/URL is set in their Netlify dashboard, not the repo. Added at the very end of the day — if a player reports the Netlify link broken, read the deploy log first.
- **Repo:** https://github.com/MichaelBoujikian/wormillion (public; `gh` is authenticated with `repo` + `workflow` scopes, `git push` just works).
- **Netlify site:** https://wormillion.netlify.app (functions at `/.netlify/functions/daily-submit` and `daily-stats`; Blobs store `daily`). Netlify does not report deploys back to GitHub, so a deploy's log is only in the Netlify dashboard.
- **Local:** `C:\Users\smite\repos\wormillion`. Double-click `play.cmd` to play. `npm start` serves on :8123 (`.claude/launch.json` names it `wormillion` for the in-app browser pane).
- **Green:** `npm test` (173 tests), `npm run validate` (1,719 entries), `npm run gap-check` (199 obvious answers), `npm run bundle` (single-file `dist/wormillion.html`, ~467 KB, 18 scripts inlined).
- **Working tree:** clean; everything below is pushed. Last commit `5e2643d`; both hosts have it.
- **Bank:** 197 countries · 247 capitals · 314 cities · 132 lakes (12 small famous ones added 2026-09-13: Bled, Placid, Hillier, Peyto, Jökulsárlón, Plitvice…) · 130 rivers · 188 mountains · 58 deserts · 358 islands · 95 seas. 91 entries are "one in Wormillion"; a run of median answers scores ~6,700 and ends around depth 540 (Mantle).

### What landed on 2026-09-12, in order (all on `main`)

The morning session (old folder) landed `8326566`…`5ff2efb`: the 70→100% ramp, flag prompts, island nations, the jackpot overlay, the generous dig curve, the ladder, craters, capital themes, letter-rule filler, the subagent audit and its fixes. Then, from this folder:

| commit | change |
|---|---|
| `f390aee` | SPEC §13 rows put in the order they landed |
| `8021982` | K2: digits are characters (it no longer "ends in K") |
| `2e9bed0` | Vietnam 98.9M → 101M (over 100 million); the only population touched |
| `243f8ee` | Loose-form tie-break: an entry's name beats another's alias ("Arabian" → Arabian Sea, alias kept); validator fails on any form no name settles; `validate-data.mjs` imports `matching.js` instead of copying `normalize` |
| `0ffb0a2` | 17 entries lose the bank-invented suffix: "Cuba Island" → Cuba … "Singapore City" → Singapore (ids re-keyed in `pageviews.json`, no fetch) |
| `2519f79` | Filler optional both ways ("Mount Denali" → Denali); `elsewhere()` tries every category exactly before any loosely ("Lake Victoria" is the lake, not the Seychelles' capital) |
| `5e8c08d` | Flag-prompt weight 3 → 2 (~0.6 flag prompts per run) |
| `80b1777` | Points flat at the jackpot bar: 950 for 85–99%, 1000 for 100% (`POINTS_JACKPOT`) |
| `fb0a3ef` | Japan / Philippines / Indonesia / New Zealand as islands; UK → Great Britain, PNG → New Guinea, Brunei → Borneo aliases; "Japan is all of it" hint |
| `43ec1bb` | `OPENING_ROUNDS` 3 → 2 (~11.4 conditional rounds of 15) |
| `438751f` | Initialism aliases (NYC, LA, HK, UAE, DRC) no longer feed letter rules |
| `ea368ca` | **Ninth category, `city`**: 275 non-capital cities, region/flag from the country, size = city-proper population, theme "largest in its country", skyline icon, draw 9 + 6 |
| `e3e4cce` | Independent review of the city rows: 39 obvious gaps added, "Constantinople", "Ragusa" dropped. Bank 1,707 |
| `0ce2e04` | Every narrowed city prompt says "non-capital city" in the sentence |
| `fda1a12` | **"0% obscurity? Dig deeper next time"**: the anti-jackpot — drips, flies, a rotten worm (`src/js/dud.js`, `renderer.setRotten`) |
| `5e2643d` | `netlify.toml` |

## Netlify: what to check first (the comparison went live untested)

The push that carried `839eba8`… deploys the functions automatically: Netlify
sees `netlify/functions/`, installs `@netlify/blobs` from the lockfile, bundles
with esbuild, and Blobs needs no setup. What could still be wrong, in order:

1. **Deploy log** — did `npm test && npm run validate` pass and did the two
   functions bundle? If bundling failed, the culprit is `import daily from
   './lib/daily.js'` (CJS from ESM) or the `included_files` line in
   `netlify.toml`.
2. **`curl https://<site>.netlify.app/.netlify/functions/daily-stats?day=2026-09-13`**
   — should be JSON with `count`, `prompts` (15) and `number`. A 500 with
   "cannot find src/data/bank.js" in the function log means `findRoot()` in
   `lib/daily.js` needs another candidate path for Netlify's task root; log
   `process.cwd()` and `__dirname` there.
3. **Play a daily on the Netlify URL** — the summary should show the compare
   block ("You're the first to dig today" the first time). A missing block
   with a 4xx in the function log means the replay rejected the answers:
   the log line says which round and why.
4. **The GitHub Pages copy calls `https://wormillion.netlify.app`** (`REMOTE_API`
   in `src/js/compare.js`; CORS admits `https://michaelboujikian.github.io`).
   If the Netlify site is ever renamed, change both.
5. A day's aggregate can be rebuilt from its submissions if it ever looks
   wrong: `createDailyApi(...).rebuild(day)` — there is no endpoint for it on
   purpose; run it from a one-off function or `netlify dev`.

Local: `npm start` serves the API over a memory store (forgets on restart) at
the same paths, so the client can be exercised without Netlify. Netlify CLI
(`netlify dev`) is not installed and was not needed.

## Start here

```bash
cd C:\Users\smite\repos\wormillion
npm test && npm run validate && npm run gap-check
```

If all three pass, nothing is broken. Read `SPEC.md` §3 (decisions) and §13
(amendments) before touching behaviour. To see a change in the game, use the
browser pane (`preview_start` with name `wormillion`) and `?debug` on the URL —
see "Driving the game from JS" below. Run the three checks before every push;
a push deploys both live sites.

## Where the logic lives

| want to change… | file |
|---|---|
| the places themselves | `scripts/data-physical.mjs`, `scripts/data-countries.mjs` (pipe-delimited) |
| the US state capitals | `scripts/data-us-states.mjs` (they feed the `capital` cohort, like minor peaks feed `mountain`) |
| the non-capital cities | `scripts/data-cities.mjs` (`Name|Country|population|aliases`; Country must be a `data-countries.mjs` row — region and flag are inherited; the build refuses a city that is its country's capital) |
| which colours a country's flag has | `scripts/data-flags.mjs` (one row per country; generous) |
| which places a themed prompt accepts | `src/data/themes.js` (hand-edited, shipped as-is; a theme with custom prompt text goes in `WORMILLION_THEME_PROMPTS` at the bottom) |
| which Wikipedia article an entry scores on | `scripts/data-wiki-titles.mjs` (`WIKI_TITLES` overrides, `WIKI_VERIFIED` "I looked, it's right") |
| which ocean an island/sea is in | derived from coordinates in `scripts/data-oceans.mjs`; hand corrections in `OCEAN_OVERRIDES` there |
| how prompts are worded / drawn / ramped / weighted | `src/js/promptBank.js` (`NOUN`, `PLAIN_TEXT`, `CATEGORY_LABEL`, `SIZE_RULES`, `drawModifier`, `drawSlots`) |
| how answers are matched (aliases, loose, fuzzy) | `src/js/matching.js` |
| what advances a round, retries, the miss hints, the summary ladder, the run's mode | `src/js/run.js` (hint *wording* is in `ui.js`) |
| the daily's seed, the date key, the pinned sequence, the puzzle number, the countdown | `src/js/seed.js` (`DAILY_NAMESPACE`; bump it on purpose, never reseed by accident; `DAILY_EPOCH` is dig #1) |
| the daily lock, the mode chips, `?daily`, the countdown, the share/review buttons | `ui.js` (`refreshTitle`, `modeText`, `startRun(mode)`, `copyShare`, `showReview`) |
| the share text and its emoji bands | `src/js/share.js` (`BANDS`, `CANONICAL_URL`) |
| streaks, daily stats, which records get trimmed, `rounds` on a record | `src/js/persistence.js` (`dailyStreak`, `dailyStats`, `trim`, `toRecord`) |
| the review rows and the rarest answer per prompt | `src/js/run.js` (`reviewRun`, `rarestFor`) |
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
| plain opening rounds | 2 (was 3 until 2026-09-12) | `OPENING_ROUNDS`, `promptBank.js` |
| modifier chance, rounds 3→15 | 70% → 100% (realises ~11.4 conditional rounds of 15) | `MODIFIER_CHANCE_START/END`, `promptBank.js` |
| flag-prompt weight in the modifier draw | 2 (same as region/theme/ocean/letter; 1 for size) → ~0.6 flag prompts per run, half of runs see one | `options.push('flag', 'flag')` in `drawModifier()`, `promptBank.js` |
| generated-modifier guard | ≥ 6 answers and ≤ 60% of the cohort | `MIN_ELIGIBLE`, `MAX_ELIGIBLE_SHARE`, `promptBank.js` |
| city region prompts | only regions with ≥ 6 cities in the bank (countries/capitals use every region with ≥ 6 countries) | `regionOptions()`, `promptBank.js` |
| city size thresholds | 500k / 1M / 5M / 10M, city-proper population | `SIZE_RULES.city`, `promptBank.js` |
| dig below the jackpot bar | `rarity × 70` | `DIG_SCALE`, `rarity.js` |
| jackpot bar | rarity ≥ 0.85 | `JACKPOT_RARITY`, `rarity.js` (jackpot.js and ui.js read it from there) |
| jackpot dig / perfect dig | 75 / 100 ("perfect" = rarity ≥ 0.995, shows as 100%) | `DIG_JACKPOT`, `DIG_PERFECT`, `PERFECT_RARITY`, `rarity.js` |
| points | 50–1000, gamma 1.4 below the bar; flat 950 for 85–99%, 1000 for 100% (the curve pays 807 just under the bar) | `POINTS_*`, `POINTS_JACKPOT`, `rarity.js` |
| dud bar | rarity < 0.005 (shows as 0%) — the mirror of the perfect bar | `DUD_RARITY`, `isDud`, `rarity.js` |
| depth budget | 1500 (= 15 × 100); strata bands unchanged at 100 each, Core from 600 | `TOTAL_DEPTH_BUDGET`, `rarity.js`; `strata.js` |
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

## The data pipeline (read before adding a place)

Adding or renaming an entry is four commands, in this order:

```bash
npm run fetch-pageviews -- --check   # resolves Wikipedia titles; lists any that are missing/ambiguous/wrong-subject
npm run fetch-pageviews              # fetches 60 days of pageviews + coordinates for anything new (cached)
npm run build-data                   # folds pageviews/oceans/flags into src/data/*.json and bank.js
npm run validate                     # schema, aliases, loose-form collisions, regions, oceans, flags, capitals-vs-cities, UN audit, theme membership
```

- `--check` complains about names that resolve to a disambiguation page or the wrong subject. Fix with `WIKI_TITLES` (override the article title) or `WIKI_VERIFIED` (you looked, it's right) in `scripts/data-wiki-titles.mjs`. Take the wrong-subject ones seriously: "Hue" resolved to the *colour*, whose pageviews would have made Huế look like the most famous city in the bank. The "reached their article through a redirect" list is informational — but skim it for a city that redirected to the wrong real place.
- A new island or sea gets its ocean from coordinates; if the article has no coordinates or the box is wrong, add it to `OCEAN_OVERRIDES` in `scripts/data-oceans.mjs`. `validate` will tell you.
- A new country needs a row in `scripts/data-flags.mjs` or `build-data` refuses to run.
- A new city's `Country` must match a `data-countries.mjs` name exactly, and the city must not be that country's capital — the build and the validator both refuse. City names are the most-shared names on Wikipedia (Phoenix, Cork, Split, Salvador, Portland…); expect `--check` to want an override for one row in ten.
- `build-data` **refuses to run** if any entry lacks pageviews — deliberate; a zero would score as maximally obscure.
- `src/data/pageviews.json` is committed, so `build-data` works offline; only new entries need the network. Responses cache under `scripts/.cache/` (gitignored; the cache survived the folder move and covers everything). A top-up for a few new entries takes seconds; a full re-fetch of ~1,700 titles ~15 minutes.
- Scoring magnitude = median of 60 daily English-Wikipedia views × 30.44. It measures *curiosity*, not fame: the Caspian Sea outdraws the Pacific Ocean. `npm run score-report` prints the curves and the jackpot count.
- Populations, flag colours and the city theme list were **written from memory** (by Claude, and for cities by a subagent, then reviewed by a second one). If a player trips on one, fix that row and `npm run build-data` — no fetch needed unless the *name* changes. The user declined a full population refresh ("don't waste tokens on updating every population"); only Vietnam was bumped, and the UAE at 9.5M is known to be ≈11M now, left as-is on purpose.

## Environment gotchas (this machine)

- **Node is not on the Bash tool's PATH.** Prefix Bash commands with `export PATH="$PATH:/c/Program Files/nodejs"` (Node 24.19 / npm 11.17 at `C:\Program Files\nodejs`), or use the PowerShell tool with `$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")`.
- **Line endings are mixed on disk** (some files CRLF, some LF); git normalises to LF (`.gitattributes`: `* text=auto eol=lf`), so it warns "CRLF will be replaced by LF" on every commit — harmless. **Multi-line string patches must normalise line endings** or they silently match nothing. The pattern that worked all day: a small Python patcher that reads the file as bytes, maps `\r\n`→`\n`, does `assert text.count(old) == 1` per replacement, and restores the original ending on write. **Read its spec from `sys.stdin.buffer` and decode UTF-8 yourself** — plain `sys.stdin.read()` on Windows decodes as cp1252 and an em dash in the search text will silently fail to match.
- **The Bash tool's parser chokes on some heredoc bodies** (a `\'` inside a quoted heredoc, and at least one long Python patch with nothing obviously wrong) with "unexpected EOF while looking for matching `'`", and nothing in the command runs. When that happens, write the script to the scratchpad with the Write tool and run it by path — it worked every time.
- **A Python patcher turns `\\b` into a backspace byte.** Writing the JS regex `/daily\b/` through a Python string produced `daily^H` on disk — silent, and it cost a debugging round. Use a raw string or build the bytes, then `cat -A` the line. The Edit tool is simpler for single-line edits; LF files (all of `src/` now) don't need the patcher at all.
- **Quoted heredocs (`<<'EOF'`) are fine** in the Bash tool, apostrophes and all; it is *unquoted* heredocs that choke. Python 3.13 is on PATH.
- **One commit per feature** is the house rule. When two changes are tangled in one working tree, `git diff -- file` → keep only the hunks whose text contains a marker → `git apply --cached` the partial patch → commit → `git add -A` the rest. Worked cleanly for the initialism fix inside the cities work.
- **ESM imports on Windows need `file:///C:/...` URLs** when importing a repo module from a script outside the repo; `createRequire(import.meta.url)` is the way to load the classic-script modules (`matching.js`, `promptBank.js`) from an `.mjs`.
- **Wikimedia rate limits:** the per-article REST pageviews endpoint 429s anonymous clients fast. The scripts use `action=query&prop=pageviews` (batched, 50 titles/request). Don't switch back.
- **CSS class names are global.** The overlays are `.jackpot { position: absolute; inset: 0 }` and `.dud { … }`; a summary row once given `class="jackpot"` rendered full-screen. Scope any new class.
- **The test file glob must stay `node --test` with no arguments**: Node 20/22 on Linux CI doesn't expand a quoted glob the way Node 24 on Windows does.
- `Claude in Chrome` is not installed, so `file://` can't be opened in the in-app pane; use the dev server. Headless Chrome works for screenshots: `& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --screenshot=out.png "file:///C:/Users/smite/repos/wormillion/src/index.html"`.
- A subagent hit a session rate limit once ("You've hit your session limit · resets 8:10pm"); the retry a minute later went through. Retry before assuming the task is wrong.

### Driving the game from JS (browser pane, `?debug`)

`window.__wormillion` exposes `renderer`, `burst`, `drip`, `currentRun()`,
`diveTo(depth, tier)`, `celebrate()` and `shame()`.

- **`preview_start` by name reads `.claude/launch.json` from the folder the session was opened in.** Open sessions in `C:\Users\smite\repos\wormillion` and it just works. Fallback: `node scripts/serve.mjs` in the background plus `navigate` to `http://localhost:8123/?debug`.
- **The pane pauses `requestAnimationFrame` when hidden.** Pump frames yourself: `for (let i = 0; i < 80; i++) __wormillion.renderer.update(0.05); __wormillion.renderer.draw();` — that completes a dive and fires `onArrive`, which advances the round. Pump `drip`/`burst` the same way. Then `wait` ~1 s before a screenshot or the pane shows the previous frame.
- **Rounds are 30 s and tool round-trips are slow.** A timed-out round silently advances, which looks like "Gobi isn't recognised as a desert" when it's really "the prompt is now a sea". Do set-slot + submit + read-feedback in ONE `browser_batch` / one JS call. The 10 s overlay holds expire between tool calls too — probe an overlay in the same call that raised it.
- **Right after `navigate`, layout is in flux for about a second**; the scene canvases can read as 150×6000 until the `ResizeObserver` refits them. Wait a second before measuring anything.
- **Overlay words drop in at `opacity: 0`**, so a screenshot taken in the same instant shows the drips/confetti and no words. `wait` 1 s, then screenshot.
- To force a prompt: `const run = __wormillion.currentRun(); run.state.slots[run.roundNumber - 1] = { category: 'city', region: 'Caribbean' };` then repaint `#prompt-text` from `run.prompt().text`. To see the *badge and icon* for a category, set the **next** slot (`slots[run.roundNumber]`) and answer the current one — the UI only draws them when it renders a round. Slot shapes: `{category}`, `{category, region}`, `{category, theme}`, `{category, ocean}`, `{category, flag:{colours:[…]}}`, `{category, size:{op,value}}`, `{category, letter:{kind,letter}}`.
- To submit like a player: set `#answer-input.value`, dispatch `input`, `#answer-form.requestSubmit()`; read `#feedback`.
- **To play a whole run from JS**, after each submit pump the renderer *until `#answer-input` is re-enabled or the screen is no longer `play`* — a fixed number of frames is not enough for a long dive, and stopping when `run.finished` flips is too early (the summary only shows when the last dive lands). For length prompts try `matching.looseKey(key)` as well as the key ("Coral", not "Coral Sea"). `run.rarestFor(prompt)` gives the answer that triggers the ★ review line.
- **Known ≥85% answers for the jackpot:** Togo (94%) / Micronesia (100%) for country; Savu Sea / Ceram Sea (100%) for sea; Aldan / Vilyuy / Olenyok for river; Masaya (100%) / Holguin / Santa Ana for city. **Known 0% answers for the dud:** New York on a city round, United States on a country round, Mount Everest on a mountain round. `celebrate()` / `shame()` fire either overlay without one.
- `diveTo` never moves the worm upward; call `renderer.reset()` first to look at a shallower depth.

## Decisions a new session should not undo

- **Fuzzy matching stays.** The user explicitly asked for autocorrect-style matching ("sahra → Sahara is exactly what I want"); it's guarded (no slack ≤4 chars, ties rejected, no substring matching), and an exact name anywhere beats a correction anywhere. SPEC 3.6/3.7.
- **Filler is optional in both directions, and initialisms are for typing only.** "Everest" finds Mount Everest *and* "Mount Denali" finds Denali (`2519f79`). A 2–4-letter all-caps alias (NYC, UAE) never feeds a letter or length rule (`438751f`). Any other spelling of an entry counts for letter rules — Hispaniola has an H via "Haiti", Great Britain starts with U via "United Kingdom" — that is the documented rule, generous on purpose.
- **A shared loose form goes to the entry that owns it by name** ("Arabian" → Arabian Sea; the Persian Gulf keeps "Arabian Gulf"). Two names, or two aliases with no name, identify neither, and `validate` fails on the alias-vs-alias kind so one can't ship. `elsewhere()` (the "X is a capital — this round wants a country" nudge) tries every category exactly before any loosely.
- **Filler words are not letters; whole official names are.** "Mount", "Lake", "the" are stripped before any letter rule, but "Loch"/"Saint"/"Cape" are names. Countries, capitals, cities and seas keep their whole official name (`WHOLE_NAME_CATEGORIES`): Mexico City ends in Y, the Black Sea ends in A. Length rules judge **the spelling the player typed or its generic-word-trimmed form, whichever fits** ("Monte Desert" is short, "Mount Kilimanjaro" is long) — generous both ways by the user's choice. Digits are characters (K2).
- **Entries are named as the world names them.** No bank-invented disambiguators: Cuba, not "Cuba Island"; Singapore, not "Singapore City". The feedback line and the ladder print `entry.name`, so an invented name is visible. Real names that happen to carry a generic word (Baffin Island, Long Island, Luxembourg City) stay.
- **Generosity is the house style.** When an answer could reasonably be right, accept it: emblem colours count for flags, island nations are islands (all of them now — Japan, Indonesia and the Philippines are archipelago entries; the UK, PNG and Brunei are aliases on Great Britain, New Guinea and Borneo, as Haiti is on Hispaniola), Cape Town and La Paz are cities even though they are co-capitals, a wrong-category answer gets a nudge, not "Not recognized". Bias data toward inclusion; a missing entry rejects a correct player, an extra one merely accepts a debatable answer.
- **The city cohort excludes national capitals, and every city prompt says so in the sentence** — `NOUN.city = 'non-capital city'` ("Name a non-capital city in the Caribbean."), the plain prompt in full ("Name a city that isn't a national capital."), the badge "City (not a capital)". The user asked for the wording in the question itself, not just the badge. Don't add capitals to the city list to be generous — the prompt would become a lie. Big US state capitals (Phoenix, Boston, Denver…) *are* cities: the exclusion is national capitals only. "Japan" is not a member of the `Japan` island theme; `ui.js` words that miss "Japan is all of it — this round wants a single island in Japan."
- **Ocean membership is derived, not curated.** Don't reintroduce a hand list for oceans. `coastal` (countries) is likewise derived as "not landlocked". Everything else themed *is* curated on purpose, because a themed prompt rejects what's outside its set.
- **15 rounds, each category once or twice (six of nine twice), two plain rounds to open, ramp 70→100%.** The user has asked three times for more conditional prompts; this is where it landed (~11.4 of 15). There is no lever left short of making the opening conditional too.
- **US state capitals live in the `capital` cohort** ("Name a capital city." accepts Boise). Their `size` is the US population; their flag is the US flag. The user knows about Boise and hasn't objected.
- **The jackpot and dud tiers are symmetric by design.** 85%+ digs a flat 75 and pays a flat 950 (100 / 1000 for an answer that reads as 100%); the strata bands were deliberately *not* rescaled to the 1500 budget. 0% pays the ordinary minimum and digs nothing extra — the dud is shame, not a penalty. `POINTS_GAMMA` was taken off the list by the user; leave it.
- **Theme names that aren't places get the generic miss hint.** A theme with custom prompt text says "X doesn't fit this one"; one worded "in the Alps" says "X isn't in the Alps". Theme prompt text is keyed by theme name alone, so don't reuse a name across categories.
- **`file://` must keep working.** Classic scripts + generated `data/bank.js`, no ES modules, no external resources. The one `fetch()` in the game (the comparison, 3.17) is optional and guarded by `compare.apiBase()`; everything else must stay server-free. `npm run bundle` makes the single-file `dist/wormillion.html`.
- **The server scores; the client only sends names.** Never trust a client-supplied score, rarity or depth in `lib/daily.js`; the replay is the anti-cheat. Keep `lib/daily.js` free of `@netlify/blobs` so the suite runs without an install.
- **`ui.js` is the only module that touches `document`.** `worldRender.js`, `jackpot.js` and `dud.js` take canvases; `run.js` returns data (`elsewhere`, `ladder`, `scopeName`, `length`) and `ui.js` turns it into words. That is what keeps the suite runnable with plain `node --test`.
- **Daily and endless differ in exactly one thing: the rng behind `drawSlots`.** Don't fork scoring, prompts or the ramp by mode. The daily is the *draw*, not the bank — a data push mid-day changes the day's puzzle for whoever hasn't played; accepted. `tests/seed.test.js` pins the 2026-09-12 sequence; a change to `seed.js` that fails it is a change to every past daily.

## Open threads

- **The comparison is live and verified on both hosts**: two `curl` submissions for dig #1 (`smoke-test-0001/0002`, harmless test rows in the store — delete from the Netlify Blobs UI if they bother you) scored exactly as the local engine, stats read back immediately with `consistency: 'strong'`, and the Pages copy fetched them cross-origin from a real browser with no console errors. The whole submit→compare flow was driven through the UI against the local memory-store API. The only thing not yet seen is a human playing a daily on the live site and watching the block appear.
- **A named leaderboard** — the natural next step; the per-player submission blobs are already there. Needs a chosen name (and its moderation) per playerId; nothing else server-side changes.
- **One 400 seen locally, not reproduced**: while developing, a submission for a record made earlier in the session got a 400 on the title (the record was then cleared). Every record made since replays fine, and rejections are now logged with the round and reason; if a player reports no compare block, read the function log first.
- **Daily lock is localStorage-only** — a cleared browser replays the day and, with a fresh `playerId`, counts again. Accepted for an anonymous game.
- ~~Length prompts wanted "Coral", not "Coral Sea"~~ — fixed 2026-09-13 (SPEC 3.1a v1.3): a length rule accepts the typed spelling or its trimmed form, whichever fits. The user chose this over a strict trim because nothing accepted before becomes rejected.

Otherwise nothing is queued. The audit is closed, the non-audit backlog is
done, the cities category shipped and was reviewed. Ideas if the user wants more:

- **More prompt kinds** — the user asks for new ones often and likes specific, harder prompts.
- **Population refresh** — declined on 2026-09-12; revisit only if a player reports a size prompt being wrong.
- **Standing note, not a task:** flag rows, populations and the city theme list are from memory. When a report is "X isn't accepted", first check which *category* the round was (the user once reported Estonia missing on a capitals-round flag prompt, where Tallinn was the answer), then fix the row.

## Things the user has said they care about

- Prompts should be specific and get harder — keep extending; they ask for new prompt kinds often. And the *question itself* must carry any rule that matters (the non-capital wording), not a badge beside it.
- Answers people obviously reach for must be accepted — `npm run gap-check` is the guard; add to its list when a player reports a miss.
- Spelling should autocorrect and show the real spelling — done and liked.
- Achievement should feel good — the jackpot overlay, craters, deeper digs, the ladder, and now the flat 950 — and failure should sting a little: the 0% overlay was their idea, gross on purpose ("blood and poop dripping from the words", "the worm should become a bit decrepit and rotten").
- They want to find the answers and the logic in the code — the tables above and README's "Where the logic lives".
- **Working style:** they read summaries closely and decide fast. Present open decisions as a numbered list with a recommendation each; they answer all in one message; then do the whole batch in one prompt and say at the end whether anything needs a second prompt. Commit each feature separately. Pushes to `main` are allowed without asking (given 2026-09-12); subagents are welcome when they earn their keep (authoring the city rows and independently reviewing them both did).
