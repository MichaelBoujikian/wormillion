# Handoff

For whoever (or whatever) picks this up next. `README.md` explains the game and
how to run it; `SPEC.md` is the design source of truth (v1.1, with an amendments
log in §13). This file is the stuff that isn't in either: where things stand,
what to check first, and the gotchas that cost time.

## State as of 2026-09-12

- **Live:** https://michaelboujikian.github.io/wormillion/ — GitHub Pages, auto-deploys on every push to `main`.
- **Repo:** https://github.com/MichaelBoujikian/wormillion (public; `gh` is authenticated on this machine with `repo` + `workflow` scopes, so `git push` just works).
- **Local:** `C:\Users\smite\wormillion`. Double-click `play.cmd` to play. `npm start` serves on :8123.
- **Green:** `npm test` (67 tests), `npm run validate` (1,318 entries), `npm run gap-check`. CI runs test + validate on Node 22.
- **Last change request fully landed:** the seven items in `wormillion-changes-prompt.md` (freeze bug, aliases, country audit, ocean tags, no repeated prompts, modifier ramp, feedback persistence). See the last five commits.

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
| which places a themed prompt accepts | `src/data/themes.js` (hand-edited, shipped as-is) |
| how prompts are worded / drawn / ramped | `src/js/promptBank.js` |
| how answers are matched (aliases, loose, fuzzy) | `src/js/matching.js` |
| what advances a round, retries, scoring hooks | `src/js/run.js` |
| points / depth formulas | `src/js/rarity.js`, `src/js/strata.js` |
| the pixel-art scene | `src/js/worldRender.js` (no `document` — takes canvases) |
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
- **The in-app browser pane pauses `requestAnimationFrame` when hidden.** To drive the game from JS, add `?debug` to the URL, then use `window.__wormillion.renderer.update(0.05)` in a loop to pump frames, and `__wormillion.currentRun()` / `__wormillion.diveTo(d)`. Don't assume a 30-second wait will animate anything.
- **`Claude in Chrome` is not installed**, so file:// can't be opened in the in-app pane. Headless Chrome works for screenshots: `& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --screenshot=out.png "file:///C:/Users/smite/wormillion/src/index.html"`.
- The test file glob must stay `node --test` with **no arguments**: Node 20/22 on Linux CI doesn't expand a quoted glob the way Node 24 on Windows does.

## Decisions a new session should not undo

- **Fuzzy matching stays.** The change-request doc suspected it caused the freeze bug and recommended replacing it with aliases. It didn't cause the freeze (that was a zero-dig animation never firing its callback); the user explicitly asked for autocorrect-style matching; it's guarded (no slack ≤4 chars, ties rejected, no substring matching). Aliases were *also* expanded. SPEC 3.6/3.7 document this.
- **Ocean membership is derived, not curated.** "Hawaii isn't in the Pacific" was a hand-list bug; don't reintroduce a hand list for oceans. Everything else themed (Caribbean, Alps, volcanoes, landlocked…) *is* curated on purpose, because a themed prompt rejects what's outside its set.
- **15 rounds, each category once or twice.** The no-repeat-prompt fix re-draws a category's second appearance rather than capping categories to one, so the run shape didn't change. The doc asked to check with the user before changing rounds or balance — neither changed, so nothing was asked.
- **`file://` must keep working.** Classic scripts + generated `data/bank.js`, no ES modules, no `fetch()`, no external resources. `npm run bundle` makes a single-file `dist/wormillion.html` for sending to people.

## Deferred (phase 2, needs new data)

Listed in SPEC.md §13:
- a non-capital **cities** category (new data file, new cohort);
- **flag-colour** tags per country;
- a **coastal** prompt (landlocked exists as a theme; coastal needs the complementary tag on every country).

Also open: a balance pass on `POINTS_GAMMA` — a typical answer pays ~460 pts and a run of median answers ends around depth 325. `npm run score-report` prints the curve.

## Things the user has said they care about

- Prompts should be specific and get harder ("name a river with a T in it", "name a river in Mesopotamia") — done, keep extending.
- Answers people obviously reach for must be accepted — `npm run gap-check` is the guard; add to its list when a player reports a miss.
- Spelling should autocorrect and show the real spelling — done.
- They want to be able to find the answers and the logic in the code — the table above and README's "Where the logic lives".
