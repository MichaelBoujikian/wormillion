# Handoff

For whoever (or whatever) picks this up next. `README.md` explains the game and
how to run it; `SPEC.md` is the design source of truth (v1.2, with an amendments
log in §13 — every behaviour change since v1.0 has a row there). This file is
what isn't in either: where things stand, what to check first, every knob and
its current setting, the decisions that must not be quietly undone, and the
gotchas that cost time. Claude Code's project memory is keyed to this folder
(`C:\Users\smite\repos\wormillion`); this file is the memory that survives.

## State as of 2026-09-12 (end of day)

- **Live, twice, from the same `src/` folder**, both redeploying on every push to `main`:
  - GitHub Pages: https://michaelboujikian.github.io/wormillion/ (`.github/workflows/deploy.yml`; `ci.yml` runs test + validate on Node 22). `gh run list` shows both.
  - Netlify: the user's account is connected to the repo; `netlify.toml` publishes `src/` and runs `npm test && npm run validate` as the deploy command, so a red suite deploys nowhere. The site name/URL is set in their Netlify dashboard, not the repo. Added at the very end of the day — if a player reports the Netlify link broken, read the deploy log first.
- **Repo:** https://github.com/MichaelBoujikian/wormillion (public; `gh` is authenticated with `repo` + `workflow` scopes, `git push` just works).
- **Local:** `C:\Users\smite\repos\wormillion`. Double-click `play.cmd` to play. `npm start` serves on :8123 (`.claude/launch.json` names it `wormillion` for the in-app browser pane).
- **Green:** `npm test` (108 tests), `npm run validate` (1,707 entries), `npm run gap-check` (191 obvious answers), `npm run bundle` (single-file `dist/wormillion.html`, 417 KB, 15 scripts inlined).
- **Working tree:** clean; everything below is pushed. Last commit `5e2643d`; both hosts have it.
- **Bank:** 197 countries · 247 capitals · 314 cities · 120 lakes · 130 rivers · 188 mountains · 58 deserts · 358 islands · 95 seas. 91 entries are "one in Wormillion"; a run of median answers scores ~6,700 and ends around depth 540 (Mantle).

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
| what advances a round, retries, the miss hints, the summary ladder | `src/js/run.js` (hint *wording* is in `ui.js`) |
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
- **Known ≥85% answers for the jackpot:** Togo (94%) / Micronesia (100%) for country; Savu Sea / Ceram Sea (100%) for sea; Aldan / Vilyuy / Olenyok for river; Masaya (100%) / Holguin / Santa Ana for city. **Known 0% answers for the dud:** New York on a city round, United States on a country round, Mount Everest on a mountain round. `celebrate()` / `shame()` fire either overlay without one.
- `diveTo` never moves the worm upward; call `renderer.reset()` first to look at a shallower depth.

## Decisions a new session should not undo

- **Fuzzy matching stays.** The user explicitly asked for autocorrect-style matching ("sahra → Sahara is exactly what I want"); it's guarded (no slack ≤4 chars, ties rejected, no substring matching), and an exact name anywhere beats a correction anywhere. SPEC 3.6/3.7.
- **Filler is optional in both directions, and initialisms are for typing only.** "Everest" finds Mount Everest *and* "Mount Denali" finds Denali (`2519f79`). A 2–4-letter all-caps alias (NYC, UAE) never feeds a letter or length rule (`438751f`). Any other spelling of an entry counts for letter rules — Hispaniola has an H via "Haiti", Great Britain starts with U via "United Kingdom" — that is the documented rule, generous on purpose.
- **A shared loose form goes to the entry that owns it by name** ("Arabian" → Arabian Sea; the Persian Gulf keeps "Arabian Gulf"). Two names, or two aliases with no name, identify neither, and `validate` fails on the alias-vs-alias kind so one can't ship. `elsewhere()` (the "X is a capital — this round wants a country" nudge) tries every category exactly before any loosely.
- **Filler words are not letters; whole official names are.** "Mount", "Lake", "the" are stripped before any letter rule, but "Loch"/"Saint"/"Cape" are names. Countries, capitals, cities and seas keep their whole official name (`WHOLE_NAME_CATEGORIES`): Mexico City ends in Y, the Black Sea ends in A. Length rules judge **the spelling the player typed**. Digits are characters (K2).
- **Entries are named as the world names them.** No bank-invented disambiguators: Cuba, not "Cuba Island"; Singapore, not "Singapore City". The feedback line and the ladder print `entry.name`, so an invented name is visible. Real names that happen to carry a generic word (Baffin Island, Long Island, Luxembourg City) stay.
- **Generosity is the house style.** When an answer could reasonably be right, accept it: emblem colours count for flags, island nations are islands (all of them now — Japan, Indonesia and the Philippines are archipelago entries; the UK, PNG and Brunei are aliases on Great Britain, New Guinea and Borneo, as Haiti is on Hispaniola), Cape Town and La Paz are cities even though they are co-capitals, a wrong-category answer gets a nudge, not "Not recognized". Bias data toward inclusion; a missing entry rejects a correct player, an extra one merely accepts a debatable answer.
- **The city cohort excludes national capitals, and every city prompt says so in the sentence** — `NOUN.city = 'non-capital city'` ("Name a non-capital city in the Caribbean."), the plain prompt in full ("Name a city that isn't a national capital."), the badge "City (not a capital)". The user asked for the wording in the question itself, not just the badge. Don't add capitals to the city list to be generous — the prompt would become a lie. Big US state capitals (Phoenix, Boston, Denver…) *are* cities: the exclusion is national capitals only. "Japan" is not a member of the `Japan` island theme; `ui.js` words that miss "Japan is all of it — this round wants a single island in Japan."
- **Ocean membership is derived, not curated.** Don't reintroduce a hand list for oceans. `coastal` (countries) is likewise derived as "not landlocked". Everything else themed *is* curated on purpose, because a themed prompt rejects what's outside its set.
- **15 rounds, each category once or twice (six of nine twice), two plain rounds to open, ramp 70→100%.** The user has asked three times for more conditional prompts; this is where it landed (~11.4 of 15). There is no lever left short of making the opening conditional too.
- **US state capitals live in the `capital` cohort** ("Name a capital city." accepts Boise). Their `size` is the US population; their flag is the US flag. The user knows about Boise and hasn't objected.
- **The jackpot and dud tiers are symmetric by design.** 85%+ digs a flat 75 and pays a flat 950 (100 / 1000 for an answer that reads as 100%); the strata bands were deliberately *not* rescaled to the 1500 budget. 0% pays the ordinary minimum and digs nothing extra — the dud is shame, not a penalty. `POINTS_GAMMA` was taken off the list by the user; leave it.
- **Theme names that aren't places get the generic miss hint.** A theme with custom prompt text says "X doesn't fit this one"; one worded "in the Alps" says "X isn't in the Alps". Theme prompt text is keyed by theme name alone, so don't reuse a name across categories.
- **`file://` must keep working.** Classic scripts + generated `data/bank.js`, no ES modules, no `fetch()`, no external resources. `npm run bundle` makes the single-file `dist/wormillion.html`.
- **`ui.js` is the only module that touches `document`.** `worldRender.js`, `jackpot.js` and `dud.js` take canvases; `run.js` returns data (`elsewhere`, `ladder`, `scopeName`, `length`) and `ui.js` turns it into words. That is what keeps the suite runnable with plain `node --test`.

## Open threads

Nothing is queued. The audit is closed (every item decided and landed), the
non-audit backlog is done, and the cities category shipped and was reviewed.
Ideas if the user wants more:

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
