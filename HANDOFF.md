# Handoff

For whoever (or whatever) picks this up next. `README.md` explains the game and
how to run it; `SPEC.md` is the design source of truth (v1.2, with an amendments
log in §13). This file is the stuff that isn't in either: where things stand,
what to check first, and the gotchas that cost time.

## State as of 2026-09-11

- **Live:** https://michaelboujikian.github.io/wormillion/ — GitHub Pages, auto-deploys on every push to `main`.
- **Repo:** https://github.com/MichaelBoujikian/wormillion (public; `gh` is authenticated on this machine with `repo` + `workflow` scopes, so `git push` just works).
- **Local:** `C:\Users\smite\wormillion`. Double-click `play.cmd` to play. `npm start` serves on :8123.
- **Green:** `npm test` (83 tests), `npm run validate` (1,337 entries), `npm run gap-check`. CI runs test + validate on Node 22.
- **Last change request fully landed:** the seven items in `wormillion-changes-prompt.md` (freeze bug, aliases, country audit, ocean tags, no repeated prompts, modifier ramp, feedback persistence), then (2026-09-11) a steeper modifier ramp, the derived `coastal` theme, flag-colour prompts, island nations accepted as islands ("Palau" was unrecognized; "Samoa" was being spell-corrected to Samos), the "One in Wormillion" celebration for 85%+ answers, the generous dig curve (75 / 100 for jackpots, ×70 below), relics in the dirt, and the summary "ladder" (finds sorted least→most obscure with bars).

## Start here

```bash
cd C:\Users\smite\wormillion
npm test && npm run validate && npm run gap-check
```

If all three pass, nothing is broken. Then read `SPEC.md` §3 (decisions) and §13 (amendments) before touching behaviour.

## Where the logic lives

| want to change… | file |
|---|---|
| the places themselves | `scripts/data-physical.mjs`, `scripts/data-countries.mjs` (pipe-delimited) |
| which colours a country's flag has | `scripts/data-flags.mjs` (one row per country; generous) |
| which places a themed prompt accepts | `src/data/themes.js` (hand-edited, shipped as-is) |
| how prompts are worded / drawn / ramped | `src/js/promptBank.js` |
| how answers are matched (aliases, loose, fuzzy) | `src/js/matching.js` |
| what advances a round, retries, scoring hooks | `src/js/run.js` |
| points / depth formulas | `src/js/rarity.js`, `src/js/strata.js` |
| the pixel-art scene | `src/js/worldRender.js` (no `document` — takes canvases) |
| what's buried in the dirt (bones, fossils, chests…) | `RELICS` / `RELICS_BY_BAND` / `paintRelics()` in `src/js/worldRender.js` — bitmaps, one char per art pixel |
| how far an answer digs (the 75 / 100 jackpot tiers) | `src/js/rarity.js` (`DIG_SCALE`, `DIG_JACKPOT`, `DIG_PERFECT`) |
| the "ONE IN WORMILLION" burst (threshold, hold time, confetti/bolt rates) | `src/js/jackpot.js` (`JACKPOT_RARITY`, `HOLD_SECONDS`, `rates()`); overlay markup/CSS in `index.html` / `styles.css` |
| all DOM | `src/js/ui.js` — the *only* module allowed to touch `document` |

## The data pipeline (read before adding a place)

Adding or renaming an entry is four commands, in this order:

```bash
npm run fetch-pageviews -- --check   # resolves Wikipedia titles; lists any that are missing/ambiguous/wrong-subject
npm run fetch-pageviews              # fetches 60 days of pageviews + coordinates for anything new (cached)
npm run build-data                   # folds pageviews/oceans into src/data/*.json and bank.js
npm run validate                     # schema, aliases, regions, oceans, UN audit, theme membership
```

- `--check` will complain about names that resolve to a disambiguation page or the wrong subject. Fix by adding an entry to `WIKI_TITLES` (override the article title) or `WIKI_VERIFIED` (you looked, it's right) in `scripts/data-wiki-titles.mjs`.
- A new island or sea gets its ocean from coordinates automatically; if the article has no coordinates or the box is wrong, add it to `OCEAN_OVERRIDES` in `scripts/data-oceans.mjs`. `validate` will tell you.
- `build-data` **refuses to run** if any entry lacks pageviews — that's deliberate; a zero would score as maximally obscure.
- Responses cache under `scripts/.cache/` (gitignored). A full re-fetch of ~1,300 titles takes ~15 minutes; a top-up for a few new entries takes seconds.
- Scoring magnitude = median of 60 daily English-Wikipedia views × 30.44. It measures *curiosity*, not fame: the Caspian Sea outdraws the Pacific Ocean. Within a category that's fine; it's what the user asked for.

## Environment gotchas (this machine)

- **Node is not on the Bash tool's PATH.** Either use the PowerShell tool with
  `$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")`
  or prefix Bash commands with `export PATH="$PATH:/c/Program Files/nodejs"`. Node 24.19 / npm 11.17 are installed at `C:\Program Files\nodejs`.
- **Bash heredocs sometimes fail to parse** with "unexpected EOF while looking for matching `'`" on longer multi-line content. Write the script to the scratchpad with the Write tool and run it, or use the Edit tool. Python 3.13 is available and reliable for text patching.
- **Line endings:** the repo has `.gitattributes` (`* text=auto eol=lf`). Git warns "CRLF will be replaced by LF" on every commit — harmless, ignore it.
- **Wikimedia rate limits:** the per-article REST pageviews endpoint gives anonymous clients a few hundred requests/hour and will 429 with `Retry-After: 59`. The scripts use `action=query&prop=pageviews` (batched, 50 titles/request) instead. Don't switch back.
- **Rounds are 30 s and the browser tools are slow.** Two tool round-trips can eat a round; a timed-out round silently advances the prompt, which looks like "Gobi isn't recognised as a desert" when it's really "the prompt is now a sea". Do set-slot + submit + screenshot in ONE `browser_batch`. `__wormillion.celebrate()` (with `?debug`) fires the jackpot overlay without needing a rare answer; Togo / Micronesia (country) and Savu Sea / Ceram Sea (sea) are real ≥85% answers.
- **CSS class names are global.** The celebration overlay is `.jackpot { position: absolute; inset: 0 }`; a summary row that was also given `class="jackpot"` rendered full-screen. Prefix or scope any new class that might collide (`.ladder li.rare`, not `.jackpot`).
- **The in-app browser pane pauses `requestAnimationFrame` when hidden.** To drive the game from JS, add `?debug` to the URL, then use `window.__wormillion.renderer.update(0.05)` in a loop to pump frames, and `__wormillion.currentRun()` / `__wormillion.diveTo(d)`. Don't assume a 30-second wait will animate anything.
- **`Claude in Chrome` is not installed**, so file:// can't be opened in the in-app pane. Headless Chrome works for screenshots: `& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --screenshot=out.png "file:///C:/Users/smite/wormillion/src/index.html"`.
- The test file glob must stay `node --test` with **no arguments**: Node 20/22 on Linux CI doesn't expand a quoted glob the way Node 24 on Windows does.

## Decisions a new session should not undo

- **Fuzzy matching stays.** The change-request doc suspected it caused the freeze bug and recommended replacing it with aliases. It didn't cause the freeze (that was a zero-dig animation never firing its callback); the user explicitly asked for autocorrect-style matching; it's guarded (no slack ≤4 chars, ties rejected, no substring matching). Aliases were *also* expanded. SPEC 3.6/3.7 document this.
- **Ocean membership is derived, not curated.** "Hawaii isn't in the Pacific" was a hand-list bug; don't reintroduce a hand list for oceans. Everything else themed (Caribbean, Alps, volcanoes, landlocked…) *is* curated on purpose, because a themed prompt rejects what's outside its set.
- **15 rounds, each category once or twice.** The no-repeat-prompt fix re-draws a category's second appearance rather than capping categories to one, so the run shape didn't change. The doc asked to check with the user before changing rounds or balance — neither changed, so nothing was asked.
- **Modifier frequency is a pair of constants.** `OPENING_ROUNDS` / `MODIFIER_CHANCE_START` / `MODIFIER_CHANCE_END` at the top of `promptBank.js`. Currently 3 plain rounds then 70%→100%, which realises ~10.7 conditional rounds of 15 (the second appearance of a category is forced to differ, so the realised rate is above the nominal). The user has asked for *more* twice; if asked again, the remaining lever is `OPENING_ROUNDS` (3→2 adds roughly half a round), which also needs the "first three rounds are plain" test and SPEC 3.8 updated.
- **`file://` must keep working.** Classic scripts + generated `data/bank.js`, no ES modules, no `fetch()`, no external resources. `npm run bundle` makes a single-file `dist/wormillion.html` for sending to people.

## Deferred (phase 2, needs new data) — likely the next task

Listed in SPEC.md §13. Scoping notes so nobody has to re-derive them:

**Coastal countries — done (2026-09-11).** `DERIVED_THEMES` in `promptBank.js`
derives `coastal` as the country cohort minus the `landlocked` set. The same
mechanism can derive any other complement of a curated theme.

**Flag colours — done (2026-09-11).** Authored in `scripts/data-flags.mjs` as
its own keyed file rather than an 8th pipe field (most country rows omit their
trailing alias fields, so a new column would have meant padding `|||` into
~150 rows). Palette `red white blue green yellow black orange`; read
generously on purpose (emblem colours count, maroon→red, gold→yellow,
light/dark blue→blue) because only positive prompts are generated and the
user wants acceptance to err generous. Single colours and pairs, behind the
usual ≥6 / ≤60% guard, so "has red" (79% of flags) never comes up alone. The
rows are from memory, not fetched — if a player reports a miss, fix the row
and rebuild (`npm run build-data`, no fetch needed).

**Non-capital cities — a ninth category, so it touches the draw.** Needs:
a new authoring file (`scripts/data-cities.mjs`, `Name|Country|population|aliases`),
a `city` category key in `promptBank.js` (`NOUN`, `CATEGORY_LABEL`, `SIZE_RULES`
with population thresholds), a 12×12 icon in `icons.js`, `EXPECTED` keywords in
`fetch-pageviews.mjs` for the description audit, region tags inherited from the
country so region scoping works. Decide with the user: should the cohort
exclude capitals (the doc's wording, "a city that's not a capital") or include
them? And note SPEC 3.8's draw assumes 8 categories — with 9, the "every
category once or twice" rule needs restating (15 slots over 9 = some appear
once), and `tests/prompts.test.js` / `run.test.js` assert the current shape.
Update SPEC.md §3.8 and §6 in the same change.

Also open: a balance pass on `POINTS_GAMMA` — a typical answer pays ~460 pts.
(Dig depth was re-tuned 2026-09-11: `rarity × 70` below 85%, a flat 75 for
85–99%, 100 for 100%; budget 1500; a run of median answers now ends around 570.
The user asked for exactly those numbers. Points were left alone.) `npm run
score-report` prints the curve.

## Things the user has said they care about

- Prompts should be specific and get harder ("name a river with a T in it", "name a river in Mesopotamia") — done, keep extending.
- Answers people obviously reach for must be accepted — `npm run gap-check` is the guard; add to its list when a player reports a miss.
- **Island nations count as islands** if they are one island or one compact archipelago: each has an island entry (`Palau`, `Tonga`, `Grenada Island`…) pointed at the country article, or is an alias of the island it shares (`Haiti` → Hispaniola, `Timor-Leste` → Timor). Deliberately *not* done for Japan, the United Kingdom, Indonesia, the Philippines, New Zealand, Papua New Guinea and Brunei — their big islands are in the bank individually and the user hasn't said whether "Japan" should count as an island. Ask before adding those.
- Spelling should autocorrect and show the real spelling — done.
- They want to be able to find the answers and the logic in the code — the table above and README's "Where the logic lives".
