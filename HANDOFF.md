# Handoff

For whoever (or whatever) picks this up next. `README.md` explains the game and
how to run it; `SPEC.md` is the design source of truth (v1.2, with an amendments
log in §13). This file is the stuff that isn't in either: where things stand,
what to check first, every knob and its current setting, and the gotchas that
cost time.

**This repo moved on 2026-09-12** from `C:\Users\smite\wormillion` to
`C:\Users\smite\repos\wormillion`. Claude Code keeps its project memory keyed by
directory, so a session opened here starts with no memory of the old location.
That is fine — this file is the memory. Nothing in the project depends on its
path (`play.cmd` uses `%~dp0`, every script path is relative, the remote is a
URL).

## State as of 2026-09-12

- **Live:** https://michaelboujikian.github.io/wormillion/ — GitHub Pages, auto-deploys on every push to `main` (the `deploy` workflow; `ci` runs test + validate on Node 22). `gh run list` shows both.
- **Repo:** https://github.com/MichaelBoujikian/wormillion (public; `gh` is authenticated on this machine with `repo` + `workflow` scopes, so `git push` just works).
- **Local:** `C:\Users\smite\repos\wormillion`. Double-click `play.cmd` to play. `npm start` serves on :8123 (`.claude/launch.json` knows this as `wormillion` for the in-app browser pane).
- **Green:** `npm test` (99 tests), `npm run validate` (1,393 entries), `npm run gap-check` (138 obvious answers), `npm run bundle` (single-file `dist/wormillion.html`, 14 scripts inlined).
- **Working tree:** clean at handoff; everything below is pushed. Last commit `43ec1bb`; the live site has it.

### What landed on 2026-09-11/12, in order (all on `main`)

| commit | change |
|---|---|
| `8326566` | Modifier ramp 70%→100% (was 40→90); derived `coastal` country theme |
| `21323b1` | Flag-colour prompts ("Name a country whose flag has green in it.") from `scripts/data-flags.mjs` |
| `1824447` | Island nations answerable as islands (Palau, Samoa, Tonga, Bahamas…: 19 entries + aliases); Samoa no longer auto-corrects to Samos |
| `0c29432` | "ONE IN WORMILLION" overlay (confetti + lightning) for 85%+ answers, 10 s or until the next answer |
| `8e9633a` | Generous dig curve: `rarity × 70` below 85%, flat 75 for 85–99%, 100 for 100%; budget 1500; relics buried in the dirt |
| `4034051` | Summary "ladder": finds sorted least→most obscure with an obscurity bar per row |
| `c7eb078` | Jackpot digs carve a wider crater (radius 11; 14 for 100%), tapered |
| `01f3809` | Capital themes (not the largest city / on the coast / US state capitals); 50 state capitals join the capital cohort; capitals carry flags; flag weight up |
| `28e9c71` | "Estonia is a country — this round wants a capital city" instead of "Not recognized"; capital flag prompt reworded |
| `460450b`, `0b69527`, `dc7925a` | Letter rules: filler never counts for letters, only length; "Loch"/"Saint"/"Cape" are names |
| `065f18b` | Audit fixes from the subagent report (see "The audit" below) |
| `5ff2efb` | The three audit questions decided: typed-length rule, seas keep "Sea", `sizeRange` for Amur/Ob/Mississippi |
| `f390aee` | SPEC §13 rows put in the order they landed |
| `8021982` | K2: digits are characters (it no longer "ends in K") |
| `2e9bed0` | Vietnam 98.9M → 101M (over 100 million) |
| `243f8ee` | Loose-form tie-break: a name beats another entry's alias ("Arabian" → Arabian Sea); validator fails on any form no name settles; `validate-data.mjs` imports `matching.js` instead of copying `normalize` |
| `0ffb0a2` | 17 entries lose the invented suffix: "Cuba Island" → Cuba … "Singapore City" → Singapore (ids re-keyed in `pageviews.json`, no fetch) |
| `2519f79` | Filler optional both ways ("Mount Denali" → Denali); `elsewhere()` tries every category exactly before any loosely |
| `5e8c08d` | Flag weight 3 → 2 (~0.6 flag prompts per run) |
| `80b1777` | Points flat at the jackpot bar: 950 for 85–99%, 1000 for 100% (`POINTS_JACKPOT`) |
| `fb0a3ef` | Japan / Philippines / Indonesia / New Zealand as islands; UK → Great Britain, PNG → New Guinea, Brunei → Borneo aliases; "Japan is all of it" hint. Bank 1,393 |
| `43ec1bb` | `OPENING_ROUNDS` 3 → 2 (~11.4 conditional rounds of 15) |

Before those, the previous session landed the seven items in
`wormillion-changes-prompt.md` (freeze bug, aliases, country audit, ocean tags,
no repeated prompts, first modifier ramp, feedback persistence).

## Start here

```bash
cd C:\Users\smite\repos\wormillion
npm test && npm run validate && npm run gap-check
```

If all three pass, nothing is broken. Then read `SPEC.md` §3 (decisions) and
§13 (amendments) before touching behaviour. To see a change in the game, use
the browser pane (`preview_start` with name `wormillion`) and `?debug` on the
URL — see "Driving the game from JS" below.

## Where the logic lives

| want to change… | file |
|---|---|
| the places themselves | `scripts/data-physical.mjs`, `scripts/data-countries.mjs` (pipe-delimited) |
| the US state capitals | `scripts/data-us-states.mjs` (they feed the `capital` cohort, like minor peaks feed `mountain`) |
| which colours a country's flag has | `scripts/data-flags.mjs` (one row per country; generous) |
| which places a themed prompt accepts | `src/data/themes.js` (hand-edited, shipped as-is; a theme with custom prompt text goes in `WORMILLION_THEME_PROMPTS` at the bottom) |
| which Wikipedia article an entry scores on | `scripts/data-wiki-titles.mjs` (`WIKI_TITLES` overrides, `WIKI_VERIFIED` "I looked, it's right") |
| which ocean an island/sea is in | derived from coordinates in `scripts/data-oceans.mjs`; hand corrections in `OCEAN_OVERRIDES` there |
| how prompts are worded / drawn / ramped / weighted | `src/js/promptBank.js` |
| how answers are matched (aliases, loose, fuzzy) | `src/js/matching.js` |
| what advances a round, retries, the miss hints, the summary ladder | `src/js/run.js` (hint *wording* is in `ui.js`) |
| points, the dig curve, the jackpot bar | `src/js/rarity.js` |
| the strata bands and palette | `src/js/strata.js` |
| the pixel-art scene, relics, crater widths | `src/js/worldRender.js` (no `document` — takes canvases) |
| the "ONE IN WORMILLION" burst | `src/js/jackpot.js` (canvas only); overlay markup/CSS in `index.html` / `styles.css` |
| all DOM | `src/js/ui.js` — the *only* module allowed to touch `document` |

## Every knob and where it is set today

| knob | value | where |
|---|---|---|
| plain opening rounds | 2 (was 3 until 2026-09-12) | `OPENING_ROUNDS`, `promptBank.js` |
| modifier chance, rounds 3→15 | 70% → 100% (realises ~11.4 conditional rounds of 15) | `MODIFIER_CHANCE_START/END`, `promptBank.js` |
| flag-prompt weight in the modifier draw | 2 (same as region/theme/ocean/letter; 1 for size) → ~0.6 flag prompts per run, 50% of runs see one (was 3 → ~0.8 / 59%) | `options.push('flag', 'flag')` in `drawModifier()`, `promptBank.js` |
| generated-modifier guard | ≥ 6 answers and ≤ 60% of the cohort | `MIN_ELIGIBLE`, `MAX_ELIGIBLE_SHARE`, `promptBank.js` |
| dig below the jackpot bar | `rarity × 70` | `DIG_SCALE`, `rarity.js` |
| jackpot bar | rarity ≥ 0.85 | `JACKPOT_RARITY`, `rarity.js` (jackpot.js and ui.js read it from there) |
| jackpot dig / perfect dig | 75 / 100 ("perfect" = rarity ≥ 0.995, i.e. shows as 100%) | `DIG_JACKPOT`, `DIG_PERFECT`, `PERFECT_RARITY`, `rarity.js` |
| depth budget | 1500 (= 15 × 100); strata bands unchanged at 100 each, Core from 600 | `TOTAL_DEPTH_BUDGET`, `rarity.js`; `strata.js` |
| points | 50–1000, gamma 1.4 below the bar; flat 950 for 85–99%, 1000 for 100% (curve pays 807 just under the bar) | `POINTS_*`, `POINTS_JACKPOT`, `rarity.js` |
| overlay hold | 10 s, or until the next submitted answer | `HOLD_SECONDS`, `jackpot.js` |
| confetti/bolt rates over the hold | 70/s + bolt every 0.12 s → 14/s + 0.55 s → 5/s + 1.4 s | `rates()`, `jackpot.js` |
| tunnel radius | 6; jackpot 11; perfect 14; blends over 6 depth units | `TUNNEL_R`, `TUNNEL_R_BY_TIER`, `TAPER_UNITS`, `worldRender.js` |
| relic spacing | one every ~11 units above depth 500, ~20 below | `paintRelics()`, `worldRender.js` |
| world depth | budget + 30 | `MAX_UNITS`, `worldRender.js` |

## The data pipeline (read before adding a place)

Adding or renaming an entry is four commands, in this order:

```bash
npm run fetch-pageviews -- --check   # resolves Wikipedia titles; lists any that are missing/ambiguous/wrong-subject
npm run fetch-pageviews              # fetches 60 days of pageviews + coordinates for anything new (cached)
npm run build-data                   # folds pageviews/oceans/flags into src/data/*.json and bank.js
npm run validate                     # schema, aliases, regions, oceans, flags, UN audit, theme membership
```

- `--check` will complain about names that resolve to a disambiguation page or the wrong subject. Fix by adding an entry to `WIKI_TITLES` (override the article title) or `WIKI_VERIFIED` (you looked, it's right) in `scripts/data-wiki-titles.mjs`. The "reached their article through a redirect" list it prints is informational.
- A new island or sea gets its ocean from coordinates automatically; if the article has no coordinates or the box is wrong, add it to `OCEAN_OVERRIDES` in `scripts/data-oceans.mjs`. `validate` will tell you.
- A new country needs a row in `scripts/data-flags.mjs` or `build-data` refuses to run. A row that names no country also fails the build.
- `build-data` **refuses to run** if any entry lacks pageviews — that's deliberate; a zero would score as maximally obscure.
- `src/data/pageviews.json` is committed, so `build-data` works offline; only genuinely new entries need the network. Responses cache under `scripts/.cache/` (gitignored). A full re-fetch of ~1,400 titles takes ~15 minutes; a top-up for a few new entries takes seconds.
- Scoring magnitude = median of 60 daily English-Wikipedia views × 30.44. It measures *curiosity*, not fame: the Caspian Sea outdraws the Pacific Ocean. Within a category that's fine; it's what the user asked for.
- `npm run score-report` prints the points and dig curves and how many entries are "one in Wormillion" (82 of 1,387 at handoff).

## Environment gotchas (this machine)

- **Node is not on the Bash tool's PATH.** Either use the PowerShell tool with
  `$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")`
  or prefix Bash commands with `export PATH="$PATH:/c/Program Files/nodejs"`. Node 24.19 / npm 11.17 are installed at `C:\Program Files\nodejs`.
- **Files on disk are CRLF; git normalises to LF** (`.gitattributes`: `* text=auto eol=lf`). Two consequences: git warns "CRLF will be replaced by LF" on every commit (harmless), and **multi-line string patches must normalise line endings** or they silently match nothing. The pattern that worked all day: a Python script that reads the file, replaces `\r\n`→`\n`, does `assert text.count(old) == 1` for each replacement, then restores CRLF on write. Python 3.13 is on PATH.
- **Bash heredocs with quotes inside fail to parse** ("unexpected EOF while looking for matching `'`"). Write the script to the scratchpad with the Write tool and run it. Plain heredocs without apostrophes are fine (commit messages work).
- **ESM imports on Windows need `file:///C:/...` URLs**, not `C:/...`, when importing a repo module from a script outside the repo.
- **Wikimedia rate limits:** the per-article REST pageviews endpoint gives anonymous clients a few hundred requests/hour and will 429 with `Retry-After: 59`. The scripts use `action=query&prop=pageviews` (batched, 50 titles/request) instead. Don't switch back.
- **CSS class names are global.** The celebration overlay is `.jackpot { position: absolute; inset: 0 }`; a summary row that was also given `class="jackpot"` rendered full-screen. Scope any new class (`.ladder li.rare`, not `.jackpot`).
- **`Claude in Chrome` is not installed**, so file:// can't be opened in the in-app pane; use the dev server. Headless Chrome works for screenshots: `& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --screenshot=out.png "file:///C:/Users/smite/repos/wormillion/src/index.html"`.
- The test file glob must stay `node --test` with **no arguments**: Node 20/22 on Linux CI doesn't expand a quoted glob the way Node 24 on Windows does.

### Driving the game from JS (browser pane, `?debug`)

`window.__wormillion` exposes `renderer`, `burst`, `currentRun()`,
`diveTo(depth, tier)` and `celebrate()`.

- **The browser pane's `preview_start` by name reads `.claude/launch.json` from the folder the session was OPENED in.** It does not follow a mid-session directory change until the session is restarted. Open new sessions in `C:\Users\smite\repos\wormillion` and it just works (the launch config is `wormillion`, port 8123). If it ever can't find the config, the fallback is `node scripts/serve.mjs` in the background plus `navigate` to `http://localhost:8123/?debug`.
- **The pane pauses `requestAnimationFrame` when hidden.** Pump frames yourself: `for (let i = 0; i < 80; i++) __wormillion.renderer.update(0.05); __wormillion.renderer.draw();` — that completes a dive and fires `onArrive`, which advances the round. Then `wait` ~1 s before a screenshot or the pane shows the previous frame.
- **Rounds are 30 s and tool round-trips are slow.** Two calls can eat a round; a timed-out round silently advances, which looks like "Gobi isn't recognised as a desert" when it's really "the prompt is now a sea". Do set-slot + submit + screenshot in ONE `browser_batch` / one JS call.
- To force a prompt: `const run = __wormillion.currentRun(); run.state.slots[run.roundNumber - 1] = { category: 'country', flag: { colours: ['green'] } };` then repaint `#prompt-text` from `run.prompt().text`. Slot shapes: `{category}`, `{category, region}`, `{category, theme}`, `{category, ocean}`, `{category, flag:{colours:[…]}}`, `{category, size:{op,value}}`, `{category, letter:{kind,letter}}`.
- To submit like a player: set `#answer-input.value`, dispatch `input`, `#answer-form.requestSubmit()`; read `#feedback`.
- **Known ≥85% answers for testing the jackpot:** Togo (94%) / Micronesia (100%) for country; Savu Sea (95%) / Ceram Sea (100%) for sea; Aldan / Vilyuy / Olenyok for river; Monte Desert / Wahiba Sands / Strzelecki Desert for desert. `__wormillion.celebrate()` fires the overlay without one.
- `diveTo` never moves the worm upward; call `renderer.reset()` first to look at a shallower depth.

## Decisions a new session should not undo

- **Fuzzy matching stays.** The change-request doc suspected it caused the freeze bug and recommended replacing it with aliases. It didn't cause the freeze (that was a zero-dig animation never firing its callback); the user explicitly asked for autocorrect-style matching and has since said "sahra → Sahara is exactly what I want"; it's guarded (no slack ≤4 chars, ties rejected, no substring matching). SPEC 3.6/3.7.
- **Filler words are not letters.** "Mount", "Lake", "the", "River"… are stripped before any letter rule ("has a T", "starts with M", "ends in", "double letter"): the user explicitly did not want "Mount Kilimanjaro" to count as having a T. Words that ARE the name stay even if they mean "lake" in Gaelic: "Loch Ness" starts with L, "Saint Lucia" starts with S, "Cape Verde" starts with C (`LETTER_FILLER` = the matcher's filler minus loch/lough/llyn/saint/st/cape). Countries, capitals and seas keep their whole official name (`WHOLE_NAME_CATEGORIES`): the Black Sea ends in A. The two length rules judge **the spelling the player typed** ("China" 5, "People's Republic of China" 22, "Mount Kilimanjaro" 16): `spellingsOf()` decides who is in the lookup, `judgeTyped` on the prompt decides whether the typed one passes, and `run.js` turns a miss into "Kilimanjaro is 11 letters — this round wants 12 letters or more".
- **Generosity is the house style.** When an answer could reasonably be right, accept it. That is why flag colours include emblem colours (Spain has blue, Peru has green), why island nations are islands (Palau, Tonga, Haiti → Hispaniola), why capitals-not-largest-city includes Brussels and Taipei, and why a wrong-category answer gets a nudge ("Estonia is a country — this round wants a capital city") instead of "Not recognized". Bias data toward inclusion; a missing entry rejects a correct player, an extra one merely accepts a debatable answer.
- **Ocean membership is derived, not curated.** "Hawaii isn't in the Pacific" was a hand-list bug; don't reintroduce a hand list for oceans. `coastal` (countries) is likewise derived as "not landlocked" (`DERIVED_THEMES`, `promptBank.js`). Everything else themed *is* curated on purpose, because a themed prompt rejects what's outside its set.
- **15 rounds, each category once or twice, two plain rounds to open.** The draw shape is tested and documented (SPEC 3.8). The user has three times asked for more conditional prompts: the ramp was raised, then `OPENING_ROUNDS` went 3→2 on 2026-09-12 (~11.4 conditional rounds of 15 now). There is no lever left short of making the opening conditional too or changing the ramp's start.
- **US state capitals live in the `capital` cohort**, so "Name a capital city." accepts Boise and "…in North America" accepts Sacramento — deliberate, generous, and what the user asked for. Their `size` is the US population so "whose country has a population over 100 million" stays true; their flag is the US flag. The user was told about the Boise consequence and hasn't objected. If that ever changes, the alternative is a ninth category, which touches the draw (see cities, below).
- **Theme names that aren't places get the generic miss hint.** Any theme with custom prompt text (`WORMILLION_THEME_PROMPTS` or `DERIVED_THEMES`) says "X doesn't fit this one"; a theme worded "in the Alps" says "X isn't in the Alps". Give a new non-place theme custom text or the hint will read "isn't in volcanoes". Theme prompt text is keyed by theme name alone, not category, so don't reuse a name across categories (the capital theme is `on the coast`, not `coastal`).
- **The dig curve and its numbers were specified by the user** (75 for 85–99%, 100 for 100%, "everything scaled up"). Points were deliberately left alone. The strata bands were deliberately *not* rescaled to the new budget — deeper digging through the same earth is the point.
- **Island nations count as islands.** Compact ones and the big archipelagos (Japan, the Philippines, Indonesia, New Zealand) are entries of their own with the country's land area, scored on the country article (`WIKI_VERIFIED`); a country on a shared or eponymous island is an alias on it (Haiti → Hispaniola, United Kingdom/UK → Great Britain, Papua New Guinea → New Guinea, Brunei → Borneo). The seven big ones were held back until 2026-09-12 and then asked for. "Japan" is not a member of the `Japan` island theme; `ui.js` words that miss as "Japan is all of it — this round wants a single island in Japan."
- **`file://` must keep working.** Classic scripts + generated `data/bank.js`, no ES modules, no `fetch()`, no external resources. `npm run bundle` makes the single-file `dist/wormillion.html` for sending to people.
- **`ui.js` is the only module that touches `document`.** `worldRender.js` and `jackpot.js` take canvases; `run.js` returns data (`elsewhere`, `ladder`, `scopeName`) and `ui.js` turns it into words. That is what keeps the suite runnable with plain `node --test`.

## The audit (2026-09-12)

A general-purpose subagent audited every generated prompt's answer set (the report lived in the session scratchpad; the substance is here). Fixed: (1) **exact name beats fuzzy correction** — on a narrowed prompt "Australia" was corrected to Austria and scored; `run.js` now checks the whole category exactly, then other categories, before accepting a correction; (2) size thresholds strict both ways left Chalbi Desert (exactly 100,000 km²) unacceptable for either prompt — now inclusive; (3) `cape` in the letter filler; (4) countries/capitals stripped of official words (Solomon Islands had no D) — now only a leading "the"; (5) Aral Sea only in seas — now also a lake; (6) volcano theme missing 14 volcanoes in the bank, Caribbean theme missing Saint Lucia/Dominica/Grenada/Saint Vincent/Cozumel/Isla Mujeres/Bahamas, Mediterranean missing Djerba; (7) Guatemala's flag missing red (the quetzal), plus six lenient additions; (8) "Big Island" alias, Gasherbrum II (the 14th eight-thousander), Kiribati's non-name alias "Tarawa" removed; (9) ø/æ/œ/ł/ß/đ/ð folded in `normalize` (`validate-data.mjs` has since been pointed at `matching.js` itself, so there is one copy); (10) "in the Caribbean" / "in the Middle East".

Everything it reported has since been decided and landed: typed-length rule, seas keep "Sea" and `sizeRange` (`5ff2efb`); K2 (`8021982`); Vietnam (`2e9bed0`); the loose-form collisions (`243f8ee`, alias kept); the invented suffixes (`0ffb0a2`). The one population the user chose *not* to chase: a full refresh to UN WPP 2024 — only Vietnam was bumped; the UAE at 9.5M is the other entry on the wrong side of a line (it is ≈11M now, over 10 million), left as-is on purpose.

## Housekeeping left over from the move

- `C:\Users\smite\wormillion` (the old folder) was deleted by the user on 2026-09-12. `check1.txt`, a stray fetch log at the repo root, went the same day.
- The session that did all of 2026-09-11/12's work ran from the old path and was retired at context limit right after `5ff2efb`. Its Claude Code memory is keyed to the old path and won't be seen from here; this file is the memory.
- The audit report the subagent wrote (`audit-report.md`) lived in that session's scratchpad and is gone with it; everything actionable from it is either fixed (`065f18b`, `5ff2efb`) or listed under "still undecided" below.

## Open threads and likely next tasks

- **Non-capital cities — a ninth category, so it touches the draw.** Needs a new authoring file (`scripts/data-cities.mjs`, `Name|Country|population|aliases`), a `city` category key in `promptBank.js` (`NOUN`, `CATEGORY_LABEL`, `SIZE_RULES` with population thresholds), a 12×12 icon in `icons.js`, `EXPECTED` keywords in `fetch-pageviews.mjs` for the description audit, region tags inherited from the country, and a flag inherited from the country. Decide with the user whether the cohort excludes capitals. SPEC 3.8's draw assumes 8 categories — with 9, "every category once or twice" needs restating (15 slots over 9) and `tests/prompts.test.js` / `run.test.js` assert the current shape. Update SPEC §3.8 and §6 in the same change. This is the one task big enough that the user might want a subagent for it; they asked about subagents and were told this was the natural candidate.
- **A full population refresh** (UN WPP 2024) was offered and declined on 2026-09-12 — "don't waste tokens on updating every population". Only Vietnam was bumped. Revisit only if a player reports a size prompt being wrong.
- **`POINTS_GAMMA`** was taken off the list by the user on 2026-09-12; leave it.
- **Flag rows are from memory**, not fetched. If a player reports "X isn't accepted for colour Y", first check which category the round was (see Estonia, below), then fix the row in `scripts/data-flags.mjs` and `npm run build-data` — no fetch needed.

## Things the user has said they care about

- Prompts should be specific and get harder ("name a river with a T in it", "name a river in Mesopotamia", "name a capital that isn't its country's largest city") — keep extending; they ask for new prompt kinds often.
- Answers people obviously reach for must be accepted — `npm run gap-check` is the guard; add to its list when a player reports a miss. When a report is "X isn't showing up", first check which *category* the round was: the user reported Estonia missing on a capitals-round flag prompt, where Tallinn was the answer.
- Spelling should autocorrect and show the real spelling — done and liked.
- Achievement should feel good: the jackpot overlay, the wider crater, the deeper digs and the summary ladder all came from "feel like you're achieving more".
- They want to be able to find the answers and the logic in the code — the tables above and README's "Where the logic lives".
- Commit each feature separately; they said so once and it has been the pattern since. Pushing to `main` deploys the live site, so run the three checks before every push.
