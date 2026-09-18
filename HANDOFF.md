# Handoff

For whoever (or whatever) picks this up next, with no other context. `README.md`
explains the game and how to run it; `SPEC.md` is the design source of truth
(v1.3, amendments log in §13). This file is what isn't in either: the job
that's queued, where things stand, every knob and its setting, the decisions
that must not be quietly undone, and the gotchas that cost time. Claude Code's
project memory is keyed to this folder (`C:\Users\smite\repos\wormillion`);
this file is the memory that survives.

Written 2026-09-16 at the end of the **United States wave** of the
country-by-country scouring (9,300 → 12,008 places), carried through the
**Europe wave** (Western Europe plus Scandinavia & the Nordics, 20 countries,
every category; → 14,914), the decision-1 re-runs and a whole-bank pre-merge
audit (→ 14,901), and last rewritten **2026-09-18, right after the release** (git's
clock: release push 01:25 UTC, HANDOFF commits 01:46 and after): both waves are live on GitHub Pages and Netlify (tag
`v1.3-europe-wave` = `main`), verified. The next work goes on branch
**`expansion-2`** (cut from `main` at the release; never push to `main`
except as a release — every push there deploys Pages and costs a Netlify
build).

## Start here (the next session, in order)

1. `git checkout expansion-2` (it is `main` + decision 5 + this file).
   `npm test` → 204, `npm run validate` → 15,427, `npm run gap-check` clean.
   Read "Where things stand", then "Same-name places: the design" (with its
   "As built" note — three things came out differently from the text).
2. **Decision 5 is built and folded** (2026-09-18, commits
   `963539e`..`98d0a95`; report
   `scripts/expansion/reports/2026-09-18-decision-5-namesakes.md`): 526
   namesakes from the US and Europe taken lists are in with a qualifier, 250
   incumbents were qualified, and an Opus audit round (data / gameplay /
   regression + skeptics) ran on it. What it leaves for every sweep from now
   on: **a sweep folds its taken list too** — after the normal chunk/fold,
   `chunk.mjs work/<probe>.json --tag=ns-<x> --taken-only [--min-views=N]
   [--allow-no-figure]` writes the taken rows as `Name (Qualifier)` rows plus
   `work/qualify-ns-<x>.txt` for the incumbents; read its review log (rows
   marked ALIAS-HELD / LOOSE-HELD, "already in the bank", and where each
   qualifier came from), hand-edit both files (the commit messages of the
   six decision-5 commits show what the hand pass looks like per cohort),
   `qualify.mjs work/qualify-ns-<x>.txt --write`, then
   `fold.mjs --only=<block>-ns-<x> --label="..." --write` and the pipeline.
   The taken lists of the three waves live only on this machine
   (`scripts/expansion/work/`, gitignored; the folded chunk and qualify files
   are kept in `work/folded/namesakes/`).
3. **Now Mexico and Canada**, rivers first (the order and the recipes are
   below; `probes/*.json` from the Europe wave are the templates; the
   per-cohort floors and views floors are settled — see "Every knob"). Piecemeal:
   one commit per chunk on `expansion-2`, pushed as you go, a report per
   chunk in `scripts/expansion/reports/`, `jackpot-share.mjs` after every fold.
   A *resolver window* = a time when no other Wikipedia-fetching script is
   running: `probe.mjs`, `article-size.mjs`, `fetch-pageviews.mjs`,
   `wp-check.mjs` and `auto-titles.mjs` must never overlap.
4. Release = the procedure in "The release, as audited": fast-forward `main`
   in one push inside a merge window from `draw-diff.mjs main`, publish
   Netlify in the same minute, run the verification curls, update "Where it
   lives". Decision 5 can ride the Mexico/Canada release (one deploy) unless
   the user wants it live sooner (`draw-diff.mjs main` said 0 of 46 dailies
   draw differently after decision 5 — the prompts are unchanged, only the
   answers grew — so its window is any time).

---

# The job: Mexico and Canada on `expansion-2` (decision 5, same-name places, done 2026-09-18)

The user's plan (2026-09-15): scour the world country by country, **every
category per country**, "as many places as we can", in this order:

> **United States ✓ → Western Europe ✓ → Mexico and Canada → East Asia → West
> and Central Asia → South America → Central America → North Africa → the
> rest of Africa → islands.**

Western Europe, as the bank tags it (`scripts/data-countries.mjs` region
`Western Europe`): **Germany, France, United Kingdom, Italy, Spain,
Netherlands, Belgium, Portugal, Austria, Switzerland, Ireland, Luxembourg,
Andorra, Liechtenstein, Monaco** — **plus, from 2026-09-16 evening, the
region `Scandinavia & the Nordics`: Sweden, Norway, Denmark, Finland,
Iceland** (the user added them to this wave; the `nordic-lakes` probe re-ran Sweden
at 25 km²). Twenty countries.

Standing decisions from the user, all still in force:

1. **Everything lands on a work branch — `expansion-2` now** (the user's
   2026-09-18 instruction: a new branch per phase "so we don't push to main
   and update Netlify"). A push to `main` is a release: it deploys GitHub
   Pages at once and, with Netlify's builds on, builds there too (15 credits
   per published production deploy); a bank that differs from the server's
   breaks the daily comparison for Pages players on the days the two draw
   differently. So `main` moves only by the release procedure, as one
   fast-forward push, inside a `draw-diff.mjs` window, with the Netlify
   publish in the same minute — the first two waves went out that way on
   2026-09-18. (If the phrase "the best probe" comes up: that is the user's
   words for the probes to include; ask if unsure which they mean.)
2. Order within a country: **rivers → lakes → mountains → islands → seas →
   deserts → cities.** Rivers and lakes are where the traps live (a missing
   name autocorrects to a different place); do them early.
3. **Floors: keep them low, capture a lot, decide on the spot and report the
   choice**; a later wave lowers every floor. The US floors are the
   starting point (below).
4. **Name-taken places come in with a qualifier** (decision 5, built
   2026-09-18; see "Same-name places: the design"): `Portland (Maine)` beside
   `Portland (Oregon)`, `Green (Kentucky)`, `Prince of Wales Island (Alaska)`
   — authored as `Name (Qualifier)` in the name column, folded from the
   probe's taken list with `chunk.mjs --taken-only` → `qualify.mjs` →
   `fold.mjs`. A city whose bare name is a capital, country or island in
   the bank comes in qualified too (Athens (Georgia), Greece (New York)) and
   its bare typing keeps the nudge. What still stays out: a bare name that
   belongs to a far more famous place *not in the bank at all* (Botany Bay,
   Kent beside Sydney's), a district or town article standing in for the
   place, and the same place under another title (Dufourspitze is Monte Rosa).
5. **Audits on Opus**, data + gameplay in parallel per chunk or two, up to
   three agents at once, each writing its report as it goes.
6. (2026-09-16) `reservoir` is a matching filler word; creek / fork / branch
   / run / brook / kill / wash / slough / draw are letter-only filler for
   rivers; a letter-rule miss names the word that didn't count.

## Where things stand

**Decision 5 built 2026-09-18** on `expansion-2` (after the release below):
engine, validator, tools and 526 namesake rows folded across every cohort —
`npm test` 204 · `npm run validate` 15,427 · `npm run gap-check` clean ·
`bank.js` 2.01 MB · 730 entries carry a qualifier in 317 namesake sets.
Cohorts now: rivers 3,902 · lakes 1,246 · mountains 2,713 · islands 2,494 ·
seas 576 · deserts 137 · cities 3,915 (the table below is the wave view).

**Released 2026-09-18 01:25 UTC**: `expansion` was fast-forwarded into
`main` (one push, `ffeceaa..8ecb7e5`; tag `v1.3-europe-wave`), GitHub Pages
deployed it (verified: `data/bank.js` 1,970,246 bytes, the new
`matching.js`), and the user published the Netlify build (~01:50 UTC;
verified: the same bank, both functions on the new bank — `daily-stats` for
2026-09-19 returns the new draw `6ddb6b85`, the three rejections answer
`closed` / `draw-mismatch` / `round 1: unrecognized`, CORS admits the Pages
origin). Dig #7 (2026-09-18) drew identically on both banks, so no player
saw a mismatch. **Branch `expansion-2`** was cut from `main` right after,
and this file's edits are its first commit; `expansion` is retired (equal to
`main` at the release; delete or leave it). `npm test` 193 · `npm run
validate` 14,901 · `npm run gap-check` 812 pins, every one lands. `bank.js`
1.97 MB.

| category | US wave end | now | Europe floor | wave reports (`scripts/expansion/reports/`) |
|---|---|---|---|---|
| rivers | 3,192 | 3,703 | 60 km (50 in Britain/Ireland) or 1,000+ views; ≥ 30 views/mo | `2026-09-16-{uk,de,fr,it-es,nordic}-rivers.md` + audits |
| lakes | 1,160 | 1,232 | 25 km² or 1,000+ views; ≥ 61 views | `2026-09-17-europe-lakes.md` + `-lakes-mountains-*-audit` |
| mountains | 1,984 | 2,625 | 122 views/mo, lists only | `2026-09-17-europe-mountains.md` |
| islands | 1,655 | 2,391 | 1 km² or 1,000+ views, or unsized at 122+; ≥ 91 views; **379 rows `size` 0** | `2026-09-17-europe-islands.md` + `-islands-data-audit` |
| seas | 259 | 571 | unsized at 183+ views, in effect **213** after the audit; **288 rows `size` 0** | `2026-09-17-europe-seas-deserts-cities.md` + `-seas-cities-data-audit` |
| deserts | 130 | 137 | — (7 unsized) | same |
| cities | 3,180 | 3,798 | 50,000 population (Wikidata P1082) | same + `-islands-seas-cities-gameplay-audit` |

Engine changes this wave (all in SPEC §13, each with a test): decision 1
(`size` 0), decision 2 (`MAX_ELIGIBLE_SHARE` 0.7), decisions 4a/4b/6
(category words, plural guard, Mt → Mount, the twin rule, tie-aware nudges),
and from the last audit: **a hyphen is a space** in `normalize`, the ʻokina
is an apostrophe, loch/lough are sea words too, and **a size rule's share is
measured over sized rows only** (333 unsized seas had made "smaller than
1,000,000 km²" drawable while every one of them refused it — that one
changes dig #6's round 3 on this branch).

**What the user decides next** (open questions; 1 and 2 were decided):

1. ~~Merge and publish~~ — done 2026-09-18 (see "The release, as audited");
   the next release is the user's call again, after decision 5 and/or the
   Mexico/Canada wave.
2. **Decision 5, same-name places — DECIDED 2026-09-17 evening**: the user
   accepted the design in "Same-name places: the design" below ("one bare
   name, several places, the round's scope picks"). It is the next
   engineering step **after the merge** (it touches the matcher). The ~180
   places waiting on it: Syracuse (Sicily), Córdoba, Cartagena, Halifax,
   Newport, Boston, Lincoln, Taunton, Warwick, Washington (Tyne and Wear),
   Bangor (County Down), Frankfurt (Oder), Hagen…, Andros (Greece), Bothnian
   Bay, Portland ME, Birmingham AL, Cambridge MA, Prince of Wales Island
   (Alaska), Green River KY, Colorado River TX, three Black Lakes… — every
   probe's "taken" list (`work/*.report.txt`, `work/*.out`) has them with
   views, and the four audit reports' "judgment calls" lists add the rest.
3. **A "famous group" exception for islands?** The Farallon Islands, the
   Diomedes, the Outer Banks, the Blaskets, the Skelligs, the Frisian chains
   are out by the groups rule; players know them as groups.
4. **The desert cohort's jackpot share is 8%** (11 of 137) — the one cohort
   above 4% (the wave-fed physical cohorts sit at mountain 1.4 / sea 1.9 /
   river 2.0 / island 2.6 / lake 3.4%, city 0.8%; country 14% and capital
   5% are the small fixed cohorts whose line sits high by construction and
   are outside the band on purpose); a look before Asia's and Africa's
   deserts arrive.
5. **Size 0 and "smaller than" prompts**: unknown is neither small nor large
   today; 379 islands and 288 seas refuse every size prompt. The alternative
   (unknown counts as small) is a one-line change in `satisfiesSize`.

## The release, as audited (pre-merge audit of 2026-09-17, three Opus auditors + skeptics)

Reports: `scripts/expansion/reports/2026-09-17-pre-merge-{regression,integrity,release}-audit.md`.
What they established, and what was fixed on the spot (the commit after `6a93088`):

- **Whole-bank regression, live vs new**: 23,267 typings of the 300 most-viewed
  entries per cohort plus every country and capital, on every round they
  satisfy — every one lands on its own entry on both banks, 0 worse; 1,338
  famous names and misspellings × 9 rounds — no scoring regression; 0
  wrong-kind answers scored on the new bank (the live one scored 8). Auckland
  on "a capital in Oceania" reads "Auckland is a non-capital city — this round
  wants a capital city." on both, no score, free retry — correct.
- **Fixed from it**: the cross-category nudge now runs exact → loose → fuzzy
  over every other cohort ("Cornwallis" is Cornwallis Island, not Corvallis);
  the foreign generic words had leaked into `LETTER_FILLER` ("Laguna
  Colorada" starts with L again); Honolulu carries Oceania. From the
  integrity sweep: 30 pre-wave rows re-pointed off namesake / wrong-kind
  articles (Diamond Head was British Columbia's, Grand Manan a village's
  Long Island, Kura the Russian one, Lake Rukwa the African Great Lakes
  article, Mount Pobeda a mountaineer's biography, Pra Russia's, Kuma
  Japan's, Lake Togo Japan's, the Golden Horn Vladivostok's, Con Dao the
  prison, Monhegan the lighthouse…), 13 rows with no article of their own
  dropped, 21 pre-wave inland islands' oceans cleared, the 19 British and
  Irish rivers put into the Europe theme (Thames answered "isn't in Europe"
  on the live bank), 55 theme members added (saltwater, volcanoes, the
  Balearics…), orphan keys removed. `add-theme.mjs` no longer writes a `,,`
  hole after a trailing comma.
- **Performance**: `bank.js` 1.97 MB / 277 KB gzip; createBank and a full
  replay well inside the function's cold start; nothing a phone feels.

**Procedure (recommended: fast-forward, one push):**

1. Pick the moment. The daily draw depends on the bank and the Netlify
   function computes the comparison from *its* bank, so **Pages and Netlify
   must switch together**, inside a stretch of days that draw identically on
   both. Run `node scripts/expansion/draw-diff.mjs main` at release time and
   pick a window from its output: a window ends when the first timezone
   (UTC+14) reaches a day that differs, and opens once the last (UTC−12)
   has left the previous one. Worked example, the 2026-09-18 release: digs
   #6 and #7 drew identically, **#8 (09-19) differed from round 4 on**, so
   the window was "before 2026-09-18 10:00 UTC", else 09-21 12:00 → 09-22
   10:00 UTC. Outside a window a Pages player mid-dig sees the new draw and
   the server (or the other host) rejects it with 409 `draw-mismatch` for
   the rest of that day; the block simply hides.
2. Check the Netlify setting (Site configuration → Build & deploy →
   Continuous deployment → Build settings → Build status): *Stopped builds*
   → push, then Activate builds, then Trigger deploy once; *Locked deploys*
   → the push builds once, then Publish deploy on that build.
3. `git checkout main && git merge --ff-only expansion-2 && git push origin main`
   — one push, one Pages deploy (`deploy.yml`), one CI run, one Netlify
   build (15 credits when published). Tag it (`git tag -a v1.x-<wave>`, push
   the tag; tags trigger CI only, not the Pages deploy). Then cut the next
   work branch from `main` (`expansion-3`…), as the user prefers a fresh
   branch per phase. (A squash buys nothing on Netlify and loses the
   per-chunk history from `main`.) This is exactly how 2026-09-18 went:
   `ffeceaa..8ecb7e5`, tag `v1.3-europe-wave`, then `expansion-2`.
4. Publish / trigger the Netlify deploy in the same minute (Netlify first if
   anything). Then the re-verification checklist in "Netlify, verified live"
   below: build log (both functions bundled), `daily-stats?day=` returns 15
   prompts, the three rejection curls, a daily played on the Netlify URL, the
   cross-origin fetch from Pages.
5. Update this file: "Where it lives" (main = Pages = Netlify = the new
   sha), and the count line at the top. Expect a few `unrecognized` warn
   lines in the function log on merge day for the three wrong-article lakes
   the wave dropped (Xiloá, Ypoá, San Pablo) and the renamed Santa Rosa Island.

## Same-name places: the design (decision 5, accepted by the user 2026-09-17)

**The problem.** ~180 places are out only because another entry in the same
cohort holds their bare name (the list above). Each wave adds more (Mexico and
Canada bring another Guadalajara / Cambridge class), and it is the biggest
single class of "real answer the game refuses". The pain is not scoring —
"Syracuse" scores *a* Syracuse — it is the scoped rounds: "Name a city in
Europe" + "Syracuse" → "Syracuse isn't in Europe", which is wrong to the
player.

**Options set aside.** *Status quo* (one bare name per cohort, the famous one
holds it): no work, the wrong-scope refusals stay forever. *Qualified bank
names* ("Syracuse, Sicily" as the entry's name): reachable only by fuzzy
matching or by typing the qualifier, and the qualifier corrupts letter rules
("starts with S", "long name") — the reason the wave rule bans comma names.
*Merging namesakes as aliases*: wrong, they are different places with
different sizes, countries and regions.

**The design: one bare name, several places, the round's scope picks.**

1. **Data.** A cohort may hold several entries with the same bare name when
   each carries a `qualifier` column (state, country or island: "New York",
   "Sicily", "Maine", "Alaska"). The id becomes `city-syracuse-sicily`; the
   display name stays "Syracuse"; the summary and the review show "Syracuse
   (Sicily)". **Every namesake gets a qualifier, the famous one too**, so the
   data is symmetric and nothing is special-cased by hand. Wikipedia already
   supplies the qualifier — it is the comma / parenthetical part
   `chunk.mjs` strips today (`bankName()`); keep it as the column instead.
   **Ids — as built: every qualified row's id carries the qualifier**
   (`city-syracuse-new-york` beside `city-syracuse-sicily`; the design text
   said the incumbent keeps its id, to spare a migration — `qualify.mjs`
   does that migration, renaming the id in `WIKI_TITLES`, `WIKI_VERIFIED`,
   `OCEAN_OVERRIDES`, `pageviews.json` and `themes.js`, so one rule with no
   order dependence won). An incumbent whose Wikipedia title is bare
   (Boston, Birmingham, Manchester, York) takes the state for a US city,
   England / Scotland / Wales for a British one, the country otherwise; a
   famous physical incumbent with a bare title (Colorado River, Thames,
   Volga, Green) may stay the one unqualified holder — the validator allows
   one — and reads bare. **The 23 existing parenthetical names** (`Derwent
   (Derbyshire)`, `Stour (Kent)`, `Krka (Croatia)`, `Grand (Ontario)`, `Black
   Desert (Egypt)`, `Green Island (Taiwan)`…) migrate in the same step: the
   parenthetical becomes the qualifier where it is a place, an alias where it
   is an alternate name (`Scamander (Karamenderes)`), and the display name
   goes bare in every case — today five of them (`Krka`, `Scamander`, the
   Black / White / Red Deserts) cannot be typed bare at all, and "Derwent
   (Derbyshire)" counts as a 17-letter name.
2. **Matching.** The lookup maps a key to a *list* of entries instead of one
   id. When a typed name resolves to several in the cohort: take the ones
   that satisfy the current prompt; if exactly one, that is the answer; if
   several (a plain "Name a city"), the **most-viewed** one — the
   conservative score, no free jackpot from ambiguity; if none, wrong-scope
   on the most famous, and the message names it with its qualifier
   ("Syracuse (New York) isn't in Africa"). So a bare "Syracuse" on "Name
   a city in Europe" is **accepted silently** as the Sicilian one — that is
   the point of the design — and the refusal text only appears on a round
   no namesake fits. Typing the qualifier is an exact hit on that one; the
   generated exact forms are "Name Qualifier", "Name, Qualifier" and "Name
   (Qualifier)" (normalize folds the punctuation anyway), plus the
   two-letter US state code for US states ("Portland OR", "Portland, ME") —
   nothing else, no abbreviations of countries. **The fuzzy pass** dedupes
   winners by *key*, not by id: a typo of a shared bare name lands on that
   key's candidate set and the scope pick above follows; a tie between
   *different* keys stays a refused tie (SPEC §3.7 unchanged).
3. **Duplicates.** `usedAnswers` stays by id, so a second "Syracuse" in a run
   resolves to the *other* Syracuse if it fits the round, else it is the
   usual duplicate.
4. **Letter rules** use the bare name only — "starts with S" and "long
   name" see exactly what they see today.
5. **One guard for cross-cohort fame.** If the bare name's most famous
   holder lives in another cohort by a wide margin (Athens the capital vs
   Athens, Georgia; Dublin vs Dublin, California — say 5× the views), the
   bare typing keeps today's nudge ("Athens is a capital") and the in-cohort
   namesake needs its qualifier. Without it, "Athens" on a plain city round
   would quietly score a 127,000-person Georgia town for a player who meant
   Greece. **As built:** the guard is `NAMESAKE_FAME_RATIO = 3` in `run.js`
   (Athens the capital has 4.8× the views of Athens, Georgia), compared on
   `magnitude` between the name's most-viewed holder in *this* cohort (not
   the entry the typing settled on — a second "Boston" settles on Boston
   (Lincolnshire), and the capital Boston is the very place the first one
   scored) and the most-viewed exact holder in the capital, country or
   island cohort (Greece (New York), Manhattan (Kansas) needed the last
   two); it runs on every round except a region round the famous holder
   does not carry, so "Boston" on "Name a city in Europe" is Boston
   (Lincolnshire), accepted — the point of the design — while "Athens" on
   "starts with A" is still the capital's nudge (the 2026-09-18 audit). The
   qualified forms are exact only, never fuzzy candidates, and a qualified
   typing on another cohort's round names that one place ("Athens, Georgia"
   on a capital round is the Georgia city's nudge). The Athens GA /
   Dublin CA class is admitted *with* its qualifier under this rule (the bare
   typing keeps its nudge to the capital); the "famous place not in the bank
   at all" case (Botany Bay, Kent vs Sydney's) stays out under standing
   decision 4 until the famous one is in.
6. **Validator / SPEC §4.** Duplicate bare names are legal only when every
   holder has a distinct qualifier (a bare name has at most one unqualified
   holder — none, once the namesakes are folded). `themes.js` keys members by
   name today and must key by id or by "Name (Qualifier)" — a small tooling
   change (`add-theme.mjs`, `drop.mjs`, `fold.mjs`, `build-data.mjs`).

**Scope of the backlog:** every cohort, not cities only — the three waves'
taken lists cover rivers, lakes, mountains, islands, seas and cities; the
floors are the ones their waves used (see "Every knob"), no new floor.

**What it costs.** Engine: `matching.buildLookup` / `matchAnswer` return
candidate sets; `run.js` does the scope pick and the messages; the UI shows
the qualifier in the summary and the review; a test per rule; SPEC §3.7 / §4
amendments and a §13 row. About a day, plus a gameplay audit (the daily
comparison functions replay answers by name through the same engine, so
they follow for free). Data: the namesakes come straight back from the
probes' "taken" lists with their views; qualifiers from their Wikipedia
titles; one fold per cohort. The daily draw does not change (it is per
category and modifier, not per entry), though eligible counts move a little
— re-check the share bars and the dig #1 pin.

**Not to do:** score the rarest in-scope namesake on ambiguous input (it
rewards a name the player may not have meant); auto-correct across namesakes
by fuzzy distance (the Redding / Reading class shows how that reads).

**As built (2026-09-18, `963539e`..`98d0a95`; the report
`scripts/expansion/reports/2026-09-18-decision-5-namesakes.md` has the
per-cohort tables):** everything above, with three differences — the ids
(above), the fame guard (above), and **a loose form two different names
share now resolves to the list, most-viewed first** ("Geneva" is Lake Geneva
before Geneva Lake, "Wilson" Mount Wilson before Wilson Peak) where it
identified nobody before and the fold refused the second name: half the
mountains' taken list was that class. Two aliases with no name behind either
still fail validation. Also: a bare shared name listed in a theme names the
one holder without a qualifier; a name held only through a loose form goes
in bare unless a namesake exists (St. George, Palm Desert, Geneva Lake).
Tools: `qualify.mjs` (`id|qualifier[|new bare name]`, `# notes`),
`chunk.mjs --taken-only` (the taken rows as `Name (Qualifier)` rows + the
incumbents' qualify file + a review log), `fold.mjs` (parses the qualifier,
admits namesakes under the validator's rule, `--label`), `drop.mjs`. The
"famous group" question for islands (item 3 above) can ride the same
qualifier column ("Farallon Islands" as a group entry is a different
question, but the machinery is shared).

## Decisions — taken 2026-09-16 evening ("go with your recommendations")

The user accepted every recommendation below in one message. What was done
about each is in the running log at the end of this section; the list is
kept as written so the reasoning survives.

1. **"Size unknown" in the schema.** SPEC §4 says `size > 0`. 652 US bays /
   straits / sounds (Pearl Harbor, New York Harbor, the Golden Gate, Cook
   Inlet, Pamlico Sound…), ~1,100 US islands and 10 deserts have **no area
   anywhere** and were left out by the sourced-figure rule. `satisfiesSize`
   (`promptBank.js`) already treats a non-positive size as "never answers a
   size prompt"; nothing in the UI shows size. Recommend: allow `0` (validate
   `>= 0`, SPEC amendment, `fold.mjs`, a `--allow-no-figure` switch in
   `chunk.mjs` that writes `0`), then fold the held-back US rows from the
   probe JSONs in `work/`. Europe's fjords, bays and small islands will hit
   the same wall.
2. **`MAX_ELIGIBLE_SHARE` 0.6** (`promptBank.js`): lakes under 100 km² are
   60.0% of the cohort so "Name a lake smaller than 100 km²" no longer draws
   (dig #1's round 12 moved; pin updated knowingly in `tests/prompts.test.js`),
   and 400 more red-white-blue US cities took "flag has both blue and white"
   over the line too. Every wave adds small lakes; France and Britain add
   blue-white-red cities. Recommend 0.7, or a 25 km² tier in `SIZE_RULES.lake`.
3. ~~Filler words~~ — done (`807ad68`, `2a2fef6`).
4. **Two `run.js` rule changes** the audits argued for three times: (a) when
   the typed input carries the *current* category's own generic word ("Lake
   Meade", "Mackinaw Island"), another cohort's loose form must not block the
   in-category spelling correction (aliases paper over the known cases);
   (b) the loose pass should not drop a generic word naming *another*
   category — "Lake Michigan" → Michigan River, "Rapid City" → Rapid River
   (950 pts), "Willow Reservoir" → Willow River (950), "Mount Foraker" →
   Foraker River. Pre-existing class, larger with every wave. Recommend both.
5. **Same-name second places** — Green River (Kentucky, 618 km), Colorado
   River (Texas, 1,387 km), Fox River (Green Bay), Prince of Wales Island
   (Alaska, the 4th-largest US island), Black Lake ×3, 130 US cities (Portland
   ME, Birmingham AL, Cambridge MA, Worcester, Toledo OH…) — need a name
   policy (Wikipedia's parenthetical, reachable only by the fuzzy pass).
   Europe will add the mirror image (a British Cambridge is *in*; a Boston,
   Lincolnshire is not). Recommend: not this wave. **Superseded 2026-09-17 —
   see "Same-name places: the design".**
6. **"Great Lakes"** typed on a lake round is corrected to Great Lake
   (Tasmania). Recommend an engine guard: never correct a plural onto a
   singular namesake.
7. **Themes**: no lake theme covers North America; `the Rockies` was not
   extended (153 new Rockies peaks answer "isn't in the Rockies") — needs
   Wikidata P4552 (mountain range). Recommend a `North America` lake theme
   and a P4552 pass. **For Europe this matters more: the Alps (lake and
   mountain), the British Isles (river, lake), Scotland / England or Wales
   (mountain, island), the Mediterranean and Greece (island), Europe (river,
   sea) all exist and every new row must be put into the ones it belongs to
   — a themed prompt rejects everything outside its set.**
8. Typo casualties of the exact-beats-correction rule ("Weiser" → Weser,
   "Redding" → Reading, "Brooklin" now a refused tie with Brookline,
   "Tocson" with Towson, "Sheyenne" on a capital round). Recommend: leave.

### Europe wave, running log (2026-09-16 evening →)

- **Decision 1 done** (`7d00d78`): `size` 0 = "no sourced figure anywhere".
  `validate-data.mjs` checks `>= 0`; SPEC 4 / 6.4 / 13 amended; `chunk.mjs
  --allow-no-figure` writes the 0; **`probe.mjs` gained `noFigureViews: N`**
  (fetches views for the unsized items and keeps those with N+ views/mo in
  scope, `noFigure: true`; the report's NO FIGURE section lists the rest).
  `satisfiesSize` refuses a 0 in both directions (test). **Still owed:** the
  US no-figure rows (652 bays, ~1,100 islands, 10 deserts) — re-run
  `us-seas`, `us-islands`, `us-deserts` with `noFigureViews` set (cached
  tree/resolve/sizes, only the views are new), chunk with
  `--allow-no-figure`, fold. Needs the resolver slot.
- **Decision 2 done** (`2bad597`): `MAX_ELIGIBLE_SHARE` 0.7. Dig #1's
  round 12 is "Name a lake smaller than 100 km²" again (the pin is back to
  what shipped). Newly drawable: lake < 100 km² (60.1%), city flag
  blue+white (60.0%), capital flag blue (62.8%), mountain < 3,000 m (64.3%),
  city flag blue (65.9%), desert < 100,000 km² (67.7%), capital flag
  red+white (68.0%), sea < 100,000 km² (68.0%). `MAX_ELIGIBLE_SHARE` is
  exported; the flag test reads it.
- **Decisions 4a + 4b + 6 done** (`63d894f`): `matching.js` `WORD_CATEGORY`
  — every cohort lookup carries its category (`buildLookup(entries,
  {category})`, set in `promptBank.js` and `gap-check.mjs`); the loose pass
  drops a generic word only when it is the cohort's own word or nobody's,
  and the fuzzy pass then compares whole strings only. "Lake Michigan" on a
  river round → nudge, not Michigan River; "Lake Meade" on a lake round →
  Lake Mead even with a Meade River in the bank. A typed plural is never
  corrected onto the singular (`key === candidate.key + 's'`, unless the
  candidate already ends in s: "Loch Nesss" is still a typo). SPEC 3.7
  amended; tests in `matching.test.js` and `run.test.js`. **The probes'
  `fuzzy` lists now reflect this** (a probe started before the change used
  the old matcher: `uk-rivers` pass 1 did).
- **Decision 7 half done**: lake theme **`North America`** (`8e8cebe`, 527
  lakes by article coordinates from `scripts/.cache/titles.json`; the
  derivation script is not in the repo — coordinates in the box lat > 7.2,
  −170 ≤ lon < −50, Iceland and Colombia's Lake Tota fall outside);
  **`scripts/expansion/range-tag.mjs`** (`bffe9c6`) tags mountains into a
  range theme from the `range` / `parent` infobox field in
  `work/wikitext-cache.json` — `the Rockies` 49 → 186. The table
  `RANGE_THEMES` has `the Rockies` and `the Alps` (subranges by name);
  extend it per theme. ~1,300 US peaks have no cached infobox (only the
  article-passed ones do) — a P4552 pass or an infobox fetch for the
  mountain cohort is still owed; run `article-size.mjs` on a mountains
  probe with `--no-figure` and then `range-tag.mjs` again.
- Decisions 5 and 8: nothing to do (deferred / leave).
- **Wrong articles found on the way** (from the no-coordinates list of the
  lake theme derivation): `lake-lake-ypoa` scores on "Lakes and rivers of
  Titan" (Saturn's moon, 2,222 views), `lake-lake-coatepeque` on "Lake
  island", `lake-lake-xiloa` on "Volcanic crater lake", `lake-lake-san-pablo`
  on "Khari Khari Lakes" (Bolivia), `lake-lagarfljot` on "Lagarfljót Worm"
  (a cryptid). Candidates in `work/candidates-lakes-wrong-articles.json`;
  run `wp-check.mjs` on it in a resolver window, then `fix-titles.mjs`.
- **Probe 1: `uk-rivers` done** (`cf4f25b`, report
  `reports/2026-09-16-uk-rivers.md`): 57 rivers at **floor 50 km** (Britain's
  rivers are short and famous), 8 fuzzy traps fixed, Lee and Avoca
  re-pointed off a New Zealand and an Australian river. The British
  namesakes (Avon ×4, Stour, Derwent, Ouse, Don, Dee, Blackwater…) stay out
  per decision 5 — the report lists them as the case for a name policy.
- **Audits of the UK chunk + the engine changes** (Opus data + gameplay,
  each followed by an Opus skeptic that reproduced every finding; ~900k
  tokens, 47 min; reports `reports/2026-09-16-uk-rivers-engine-*-audit.md`;
  fixes `83c9952`, `1f11b7b`). What they caught, all fixed:
  - the first plural guard **redirected** a typed plural onto the next
    place within budget ("Irelands" → Iceland, 450 such); now it refuses
    only a plural of a name ending in a generic word ("Great Lakes") and
    refuses outright;
  - "Mt Vernon" on a city round had no exact hit and "mt" is a mountain's
    word → `normalize` folds Mt → Mount;
  - "Solomon Island" on a country round was refused because the island
    cohort's Solomon Islands claimed it → a same-named place elsewhere does
    not block a correction; "Madagascar Island" / "Singapore City" on a
    country round are the country, shown as corrections (exact/loose hits
    only — "Nigera" stays a refused tie);
  - "Salt Lake", "Smith Mountain", "Center Hill", "Barren River", "Sea
    Lion", "Snow Hill", "Thousand Lake", "Mount Desert", "River Isle" lost
    their loose-pass acceptance to the category-word rule → aliases;
  - "River Isle" was corrected to River Mole on ten characters' slack → an
    all-generic-word input has no budget of its own;
  - at 0.7 the letter rules "with an A in it" (66% of rivers/lakes/mountains)
    became drawable → `MAX_ELIGIBLE_SHARE_LETTER` 0.6;
  - Lake Arrowhead, Lake Coatepeque, Twin Buttes Reservoir were outside the
    North America lake theme (the derivation keyed the titles cache by
    final title; the cache is keyed by the queried title) → added; five
    more Rockies peaks whose infobox names a subrange the table lacked →
    added, table extended (Elkhead, Red Mountains, Bear River Mountains,
    Laramie Range, White River / Yellowstone Plateau);
  - **`river-humber` scores on Humber River (Ontario) and `lake-loch-leven`
    on Loch Leven (California)** — both in the British Isles theme (Lee
    class, from the 2026-09-14 fill). Re-point to `Humber` (WIKI_VERIFIED:
    "tidal estuary") and `Loch Leven (Kinross)` in the next resolver
    window (`work/fixes-humber-leven.json` is written).
  - Known and left: 29 one-edit typos of famous rivers (Thams → Thames,
    Meise → Meuse…) are refused ties now that Thame, Teise, Tame, Alde,
    Clare, Brosna, Feale, Irwell, Rede exist (by design; 0 went to a wrong
    river); "Lake Havasu" on a city round is now the lake's nudge, not Lake
    Havasu City (alias if wanted); publish timing — dig #6 (2026-09-17)
    already differs from the live build in round 3, so publishing sooner
    costs least (J8 in the gameplay report).
- **Probe 2: `de-rivers` done** (`989cb85`, report
  `reports/2026-09-16-de-rivers.md`): 125 rivers at **floor 60 km**
  (Germany, Austria, Switzerland, Liechtenstein, Luxembourg), 11 fuzzy
  traps fixed, **Eder / Aller / Thur re-pointed** off tiny namesakes, the
  five Rhine sections and "Rhin" (the Rhine's French name) left out. Pass
  1 died once with exit 1 and no message during the views fetch (the
  re-run resumed from cache). The `famousViews` fetch over ~2,700
  below-floor titles is the slow part (~1 h) and found two rivers
  (Eisbach, Breg — the chunk's two most viewed).
- Humber and Loch Leven re-pointed (`9813fd5`).
- **Probe 3: `fr-rivers` done** (`a1a975e`, report
  `reports/2026-09-16-fr-rivers.md`): 200 rivers (France, Belgium, the
  Netherlands), 28 fuzzy traps fixed, Orne re-pointed to Normandy's, eleven
  French Guiana rivers left for the South America wave. enwiki has only 940
  French river articles (vs 3,345 German). Jackpot share of the river
  cohort 3.2% (was 2.7%; 150 of the 200 rows sit at 30 views/mo).
- **The de + fr audit round was lost**: both Opus auditors died mid-run
  when the user's session limit hit (~360k tokens, no findings kept; the
  half-written reports are in the scratchpad, not the repo). Re-run one
  audit round over de + fr + it-es + nordic once the Nordic chunk is in —
  more chunks per round, not more rounds (see `subagent-limits` memory).
- **Probe 4: `it-es-rivers` done** (`e8a1883`, report
  `reports/2026-09-16-it-es-rivers.md`): 127 rivers (Italy, Spain,
  Portugal), 19 fuzzy traps fixed, Rio Tinto was missing; **the itwiki
  decimal shift in Wikidata is the rule for Piedmont** (ten rivers at
  10× — the article pass is mandatory); Odiel and Allaro left out for
  having only a wrong Wikidata figure.
- **Probe 5: `nordic-rivers` done** (`871b259`, report
  `reports/2026-09-16-nordic-rivers.md`): 98 rivers, Altaelva was missing.
- **A 30 views/mo floor for the wave's rivers** (`19a5183`): the five
  chunks had taken the river cohort's jackpot share from 2.5% to 4.5%; 91
  rows with a median of zero daily views (magnitude 8–29) were dropped
  again and the share is 2.2%. **Europe river floors: 60 km (50 in
  Britain) or 1,000+ views, and at least 30 views/mo.** `drop.mjs` fixed
  (it left array holes in themes.js when a theme line held only the
  dropped name).
- **Rivers done for the wave**: river cohort 3,707 (was 3,192).
- **Audit round over de + fr + it-es + nordic done** (Opus data + gameplay
  + skeptics, ~925k tokens, 50 min; reports
  `reports/2026-09-16-europe-rivers-*-audit.md`; all twelve findings
  reproduced; fixes `b023ba5`, `4e7a671`): Alta scored on a Ukrainian
  stream (dropped, "Alta" now an alias of Altaelva); Nera and Arda scored
  on namesakes (re-pointed); Guadalevín and Busento carried decimal-shifted
  Wikidata-only figures (Guadalevín dropped; **Busento is the first size-0
  row** — 274 views, no sourced length); two-letter rivers settled the
  bank's way (Né added, Eo kept). Engine: `elsewhere()` now nudges to the
  most-viewed exact twin ("Etna" on a lake round is Mount Etna, not the
  30-view Norwegian river); a refused in-category tie is no longer
  re-guessed fuzzily elsewhere ("Nille" was "Lille is a city");
  fiume/fleuve/fluss/riviere/rivier are river filler. Data: native-name
  aliases for ~30 big rivers (Donau, Mosel, Rhin/Rijn, Tamise, Sena, Ebre,
  Etsch, Drau, Weichsel, Labe…), bare forms so a typo of a famous river ties
  instead of landing on an obscure new row (Negro, Grande, Saigon, Tijuana,
  Lhasa), the Swedish naming split bridged both ways (Vindel/Ume/Lule/
  Kalix/Torne/Pite on the pre-wave rows, Orealven/Vasterdalalven… on the
  new ones), Sarre on the Saar, Sienne on Siena. Known and left: 149
  one-edit typos of famous rivers are refused ties now (by design); the
  famous-typo class (Merse/Meuse, Elde/Elbe, Lay/Tay, Gela/Gila…).
- **Lakes: probe 6 `uk-lakes` done** (`0fd2724`): 8 rows — Britain's big
  lakes were all in; only three unknown lakes clear 25 km² and two of those
  were a peninsula and a sea loch (the kind regex's `loch` matched
  "Lochaber"). `probe.mjs` / `chunk.mjs` now strip enwiki's comma
  disambiguation for every category. **Probes 7–9 done**: `de-lakes` 12
  (`b74a4f4`), `fr-lakes` 16 (`e6c64f3`, Lac du Bourget was missing; the
  Mediterranean étangs and the Grevelingen into `saltwater`), `it-es-lakes`
  11 (`ac30f2f`, Lake Orta was missing; Alpine ones into `the Alps`).
  Europe's lakes over 25 km² were nearly all in already; the chunks are the
  famous small ones lifted by 1,000+ views. Sections of Lake Constance,
  lagoon systems, the Azores/Madeira (islands the lists dragged in) and a
  village article left out. **Probe 10: `nordic-lakes` done** (`124ed6b`,
  92 rows; Pihlajavesi re-pointed off a 15-view namesake — it was the
  bank's rarest lake). **Then a 61 views/mo floor for lakes** (`8f12b0d`):
  the lake cohort's bottom is 17–30 views, so 60 Nordic rows at exactly
  one view a day were automatic jackpots (share 3.9% → 8.2% → 3.6%).
  **Views floors per cohort: rivers 30, lakes 61** — never at the cohort
  minimum. Report `reports/2026-09-17-europe-lakes.md`. Lakes done: cohort
  1,234 (was 1,157: 1,160 at the US wave's end minus the three wrong-article
  lakes Xiloá, Ypoá and San Pablo). `article-size.mjs` reads decimal commas now.
- **Mountains** (lists only, views floor 122 as for the US): `uk-mountains`
  325 (`8671bb6`; Scotland +69, England or Wales +176 by description),
  `de-mountains` 171 (`83e4346`; **the Alps theme 89 → 242** by
  `range-tag.mjs` from the infobox range field — run it after `build-data`,
  not after the fold, the new rows must be in `mountains.json`; Beerenberg
  and Puy de Sancy into `volcanoes`). The Ultras / highest-points lists
  drag in Greece, the Balkans, the Caucasus, Russia — dropped by hand each
  time. `fr-mountains` 67 (`47c10e3`, the French category trees; the
  guessed list titles mostly do not exist — `probe.mjs` now follows list
  redirects), `it-es-mountains` 71 (`96b3af7`), `nordic-mountains` 20
  (`95d76be`). **Mountains done**: cohort 1,984 → 2,638, jackpot 1.6%,
  `the Alps` 89 → 289, `volcanoes` 384 → 412. Report
  `reports/2026-09-17-europe-mountains.md`.
- **Audit round over lakes + mountains done** (Opus data + gameplay +
  skeptics, ~1.2M tokens, 58 min; reports
  `reports/2026-09-17-europe-lakes-mountains-*-audit.md`; 22 of 23
  findings held; fixes `6930bc9`, `e25823a`): seven duplicate or
  wrong-kind mountain rows (range articles whose high point was already
  in: Aspromonte/Montalto, Maiella/Monte Amaro, Gennargentu/Punta La
  Marmora, Cima Valdritta/Monte Baldo, Tofana/Tofane, Churfirsten/
  Hinterrugg; Mont Cenis is a pass) dropped with their names as aliases;
  the Arrochar and Lyngen "Alps" out of the Alps (`range-tag.mjs` refuses
  qualified Alps now); eleven volcanoes tagged; Morven re-pointed;
  everyday spellings as aliases. Engine: lago/lac/lagoa/laguna/etang are
  lake filler ("Lago di Nemi" was Reschensee), `normalize` folds þ, the
  twin rule yields to a typed generic word between two physical cohorts
  ("River Barrow" on a mountain round is the river's nudge). Left
  knowingly: "Hungry" on a country round is now "Hungry Hill is a
  mountain" (a free retry; the exact-or-loose-beats-correction rule).
- **Islands** (floor 1 km² or 1,000+ views; unsized kept at 122+ views
  under decision 1 — the first size-0 rows in bulk; and a 61 views/mo
  floor as for lakes): `uk-islands` 228 (`e6f8293`; 147 unsized; the
  lists drag in every British Overseas Territory and a navbox's worth of
  junk — "Irish language", "Shamrock", the Rugby Football Union — cleaned
  by a scratch script on description + region keywords), `de-islands` 6,
  `fr-islands` 26 (`d117629`; the French tree holds all of overseas
  France: 140 Polynesian/Caribbean/Indian Ocean islands dropped).
  Inland islands need `OCEAN_OVERRIDES: []` (38 British, 7 French/Dutch,
  7 Italian/Spanish, 8 Nordic set). `it-es-islands` 55 (`d1ffd94`),
  `nordic-islands` 256 (`78c1734`), then **a 91 views/mo floor for islands**
  (`abb95bc`: 93 rows at two views a day were jackpots; share 7.1% →
  3.2%). **Views floors per cohort: rivers 30, lakes 61, islands 91,
  mountains 122** — each just above the cohort's flat bottom. Islands
  done: cohort 1,659 → 2,139, ~330 rows with `size` 0. Report
  `reports/2026-09-17-europe-islands.md`.
- **`drop.mjs` bug found and fixed** (`191f93e`): it deleted the first
  namesake row in `data-physical.mjs`, not the row in the entry's own
  block — dropping the islets Omø/Siø took the rivers Omo/Sió for one
  commit. A pre-wave/now diff of `bank.js` shows only the six deliberate
  drops missing.
- **Seas** (`134522c`, 149 rows, 145 of them `size` 0 at 183+ views —
  the sea floor): Scapa Flow, the Norwegian and Icelandic fjords, the
  firths and sea lochs, the Menai Strait, the Venetian lagoon, Liverpool
  Bay… **Deserts** (`9308724`): the Desert of Wales and the Accona Desert;
  Europe had the rest already. Report
  `reports/2026-09-17-europe-seas-deserts-cities.md`.
- **Cities** (`7b02d56`, 619 rows): one probe over 44 national lists,
  `listCountry` naming each row's country; floor 50,000 (P1082). 45 fuzzy
  traps fixed (Dublin → Lublin, Doncaster → Lancaster, Rotherham →
  Rotterdam…). Out: 37 name-taken (Syracuse, Córdoba, Cartagena, Halifax,
  Newport…) plus Lincoln / Taunton / Warwick / Washington by hand,
  overseas France (Cayenne, Nouméa, Réunion), "X Municipality" doubles,
  UK districts, merged Dutch municipalities. By hand with fetched figures:
  Norrköping, Halmstad, Eskilstuna, Horsens, Maidstone, Shrewsbury… (the
  `kind` list skips "urban area" and "cathedral city"). **Newtownabbey**
  came off the Irish list as Ireland — check countries on multi-list
  probes. City jackpot share 0.8%; no views floor needed.
- **US no-figure re-run, seas** (`b296377`, 210 rows at 183+ views, size
  0): Pearl Harbor, New York Harbor, the Golden Gate, the Straits of
  Mackinac, Cook Inlet, Narragansett Bay, Pamlico Sound… Great Lakes bays
  carry `OCEAN_OVERRIDES: []`. Concept articles and the 78 foreign straits
  and gulfs out.
- **US no-figure re-runs, islands and deserts** (`4d04453`, 264 islands,
  242 unsized, at 91+ views; `0cce2e6`, five deserts): decision 1's debt
  is paid. Groups (the Outer Banks, the Farallones, the Diomedes) stayed
  out by the standing rule; concept articles, parks, counties, towns and
  peninsulas dropped by hand. Bank **14,970**.
- **Audit round 4 done** (`3642bfc`; islands data, seas + cities data,
  gameplay, each with a skeptic; 43 of 45 findings held): wrong articles
  dropped (Ward Hill, St Mary's Church, Round Island Light, Geirfuglasker,
  Burra, Danmark, Preston Island, San Bernardino Strait, Mulciber, Fairhaven
  Bay, Botany Bay (Kent), Zaanstad), Santa Rosa Island renamed to the
  Channel Islands one, Deer Isle in for the Aleutian Deer Island, the Bay of
  Pomerania re-pointed, 19 US islands sized, 30 inland islands' oceans
  cleared, themes and ~35 aliases fixed; the engine changes above. Dropping
  Mulciber (18 views) exposed the seas' flat 183-views band as the cohort
  bottom — 43 wave rows on it went (share 9.0% → 2.1%), the same lesson as
  the islands' 91 band. Reports `reports/2026-09-17-europe-*-audit.md`.
- **The Europe wave is complete.** Bank 14,914. Left to the user: the merge
  / Netlify decision and the five questions under "Where things stand".
- **A matcher gap noted, not fixed**: German ue/oe/ae transliterations
  ("Muenchen", "Moehne") do not match the ASCII-folded names; recommend
  aliases at fold time for umlaut names rather than a `normalize` rule (see
  the de-rivers report).
- **Probe configs exist for every category of the wave** (`probes/*-rivers`,
  `*-lakes`, `*-mountains`, `*-islands` for uk / de / fr / it-es / nordic;
  `eu-seas`, `eu-deserts`, `eu-cities`) — the templates for the next wave.
  `probe.mjs` records the list pages each item came from and `chunk.mjs`
  maps a list to a country (`listCountry` in the config), so one cities
  probe can span countries.

---

# The loop, as it now works

Four small tools came out of the audits and are in the repo now (they were
scratchpad scripts until 2026-09-18): **`scripts/expansion/stack.mjs`** loads
engine + bank the way the Netlify function does, from the working tree or
from any git ref (`loadStack('main')`), with `judgeFor(stack, slot)` and
`outcome(result)`; **`try.mjs`** types names at a slot (`node
scripts/expansion/try.mjs '{"category":"capital","region":"Oceania"}'
Auckland Honolulu`; `--ref=main` for the live stack); **`jackpot-share.mjs`**
prints every cohort's jackpot line, jackpot count and share plus its three
lowest rows (`--list=<category>` lists the jackpot rows) — run it after every
fold; **`draw-diff.mjs <ref>`** lists the dailies whose prompts differ
between that ref's stack and the working tree — the merge-window question.


Read `scripts/expansion/README.md` first (short). One country × category at
a time; one commit per chunk; audits per chunk or two.

1. **Probe.** Copy a `scripts/expansion/probes/us-*.json`, edit, run
   `node scripts/expansion/probe.mjs scripts/expansion/probes/<name>.json`
   in the background (5 min to 3 h; see timings). It walks Wikipedia
   categories (`roots` + `subcat` regex, depth ≤ 3) and/or the links of list
   pages (`lists`), resolves redirects and descriptions, keeps what reads
   like the kind (`kind` regex on description|title, minus `notKind` on the
   description — lifted by `notKindExemptTitle`), pushes each article through
   the game's own matcher, fetches Wikidata's size (`sizeProp`), applies the
   floor (`minSize`), fetches 60 days of views for what is in scope (and for
   what is below the floor when `famousViews` is set — 1,000+ views/mo lifts
   it back in), and prints **present / name-taken / fuzzy / missing / no
   figure / below floor / famous**. Output `work/<name>.json`; everything
   memoised per item in `work/<name>-cache.json`, so a re-run after a config
   change costs only what is new.
2. **Sizes.** `node scripts/expansion/article-size.mjs work/<name>.json
   [--no-figure] [--min-views=N]` reads each article's infobox (convert
   templates, `length_mi`, `area_acre`, `elevation_ft`…) and writes
   `work/<name>-sizes.json`. **The infobox always wins over Wikidata**
   (Wikidata is 100× off for one lake in six — hectares as km² — and
   decimal-shifted for frwiki-imported rivers). Then **run the probe again**:
   pass 2 picks up the article figures and fetches views for what newly
   clears the floor.
3. **Chunk.** `node scripts/expansion/chunk.mjs work/<name>.json --tag=<tag>
   [--themes="A;B"] [--min-views=N] [--country="France"]` writes the
   missing + fuzzy rows (never the name-taken ones) as
   `work/new-<block>-<tag>.txt` in `fold.mjs`'s format, named the bank's way
   (Wikipedia's title minus its parenthetical; rivers bare of "River" unless
   named after a state or country; cities without ", State"). **Then
   hand-clean the file** — it always needs it: groups and chains, former
   lakes, protected areas, concept articles ("Ultra-prominent peak"),
   islands that are really towns, foreign rows the worldwide lists drag in,
   comma names the strip missed, names in the other categories' cohorts
   (Greece NY), sizes to fix. The US reports list what slipped through each
   time; `scratchpad` filter scripts are not in the repo, but the patterns
   are in `reports/`.
4. **Fold.** `node scripts/expansion/fold.mjs --only=<block>-<tag>` (dry run:
   every collision with its reason — same name, filler-stripped loose form,
   alias clash, a city that is a capital or a country/island name), then
   `--write`; move the chunk to `work/folded/`.
5. **Pipeline**, every time:
   ```bash
   npm run fetch-pageviews -- --check   # fix with fix-titles.mjs: WIKI_TITLES re-points, WIKI_VERIFIED for "landform"/"town on the island"/"no short description"
   npm run fetch-pageviews              # views + coordinates for the new rows (cached)
   npm run build-data && npm run validate   # validate names islands/seas without coordinates → add-oceans.mjs
   npm test && npm run gap-check        # add the chunk's headline names to gap-check.mjs first
   ```
   **One commit per chunk**, the message saying how many, from what, what
   was left out and why.
6. **Audit** (Opus, data + gameplay in parallel, per chunk or two):
   `scripts/expansion/AUDIT-BRIEF.md` is the brief; the task message names
   the commits, the chunk files, the pre-wave commit (`git show <sha>:src/
   data/bank.js`), the probe JSON / sizes JSON / `work/wikitext-cache.json`
   (offline infoboxes), and the report path in the scratchpad; the agent
   writes as it goes. 250–440k tokens each; every one of the eight US audits
   found real problems (wrong articles, 100× figures, a 793k "city", jackpot
   inflation, themes not extended, inland islands "in the Atlantic").
   Apply the confirmed fixes, copy the report into `reports/`, commit.
7. **Report** per probe (`reports/<date>-<country>-<category>.md`): method,
   outcome with commit hashes, counts, what was left out and why, the
   judgment calls for a human. The US ones are the template.

## Timings and the Wikipedia rule

Wikipedia throttled every run from the first request all night (~5 s per
request effective). A state/région category tree probe ~1 h; an article
pass ~1 h; a views pass over 4,000 titles ~1 h; the 42,857-title cities probe
~3 h. **Never two resolvers at once** — `probe.mjs`, `article-size.mjs`,
`fetch-pageviews`, `auto-titles.mjs`; a stray side request (even one curl)
429s the running one. Start anything over ~5 min with `run_in_background`
and wait with an `until grep -q … ; do sleep 20; done` loop, also in the
background. The Bash tool caps at 600 s.

## Probe recipes per category (what worked for the US; what to change)

- **Rivers** (`us-rivers.json`): roots `Category:Rivers of <country> by
  <subdivision>`, subcat regex admitting the subdivision level only (county
  trees are 10× bigger and nearly all creeks); lists = the per-subdivision
  "List of rivers of X"; `kind` river|stream|creek|brook…; `notKind`
  anchored to the description's first word (reservoir, lake, range, road,
  valley, county, city…); `sizeProp P2043`, `sizeUnit km`, **floor 80 km**,
  `famousViews 1000`; `spellings river`. Wikidata has no length for 85% of
  small streams — the article pass is mandatory. Europe: `Category:Rivers
  of France` has département subcats ("Rivers of Ain"…); "List of rivers of
  France", "…of Germany", "…of Italy", "…of Spain", "…of England"/"…of
  Scotland"/"…of Wales"/"…of Ireland" exist. Themes: `Europe` (river) and,
  for the UK/Ireland, `the British Isles` — set `--themes="Europe;the British
  Isles"` for those. Native-name aliases matter here (Rhein, Donau, Mosel,
  Tajo/Tejo, Douro/Duero, Tevere): the fold keeps an alias that doesn't
  collide.
- **Lakes** (`us-lakes.json`): roots for lakes *and* reservoirs; **floor 25
  km²**, `famousViews 1000`; `notKind` must veto former/prehistoric/pluvial
  lakes, groups, "combined lake", cities named Lakewood; the settlement
  infobox's `area_total` includes water (use `area_land`). Themes: `the
  Alps` (lake) for the Alpine countries, `the British Isles` for lochs and
  loughs, `saltwater` where it applies. "Lough X" / "Loch X" / "Llyn X" keep
  their word (loch/lough/llyn are matching filler but NOT letter filler:
  Loch Ness starts with L).
- **Mountains** (`us-mountains.json`): **lists only, no category tree, no
  elevation floor** (it would cut the whole of Britain and Ireland); floor
  by **views: 122/mo** — and read the re-cut section of `us-mountains.md`
  before choosing anything lower (30 = the cohort minimum put 1,004 peaks at
  exactly 30 views and 45% of the cohort at jackpot; the median quantises at
  whole views/day: 30, 61, 91, 122…; jackpot share by floor 30 → 45%, 61 →
  24%, 91 → 11%, 122 → 2.2%, vs rivers 2.6%, lakes 4.0%, islands 4.0%).
  Check the jackpot share with `rarity.cohortStats` after folding. Europe's
  lists: "List of French mountains by prominence", "List of mountains of the
  Alps over 4000 metres", "List of prominent mountains of the Alps above
  3000 m", "List of highest mountains of Austria / Germany", "List of Munro
  mountains", "List of Marilyns in the British Isles" (very long — floor it),
  "List of mountains in Italy / Spain". `jsonFile` must be
  `["mountains.json","minor-peaks.json"]`. Tag volcanoes from the infobox's
  `type` / `volcanic_arc` / `last_eruption` (plugs, necks, laccoliths are
  not volcanoes); themes `the Alps`, `Scotland`, `England or Wales`,
  `volcanoes` — the audit will refuse every untagged Alpine peak on "Name a
  mountain in the Alps", so tag as you fold (the description or the
  infobox's `range` field; Wikidata P4552 is the honest way).
- **Islands** (`us-islands.json`): category tree to the county level plus
  lists; **floor 1 km²**, `famousViews 1000`; `notKindExemptTitle` so an
  island whose article is its town/parish counts; `validate` lists islands
  without coordinates → `add-oceans.mjs`; **inland islands (lakes, rivers)
  need `[]` in `OCEAN_OVERRIDES`** — the coordinate box puts a Lake
  Constance island "in the Atlantic" otherwise (77 US rows were fixed after
  the audit). Themes: `the Mediterranean`, `Greece`, `Scotland`. Expect ~40%
  of islands to have no area anywhere (decision 1).
- **Seas / bays / straits** (`us-seas.json`): roots per kind at the country
  level; the worldwide "List of straits" / "List of gulfs" pull in the whole
  world (`work/us-seas.json` already holds ~180 non-US straits and gulfs
  with descriptions — Europe's are in there); almost none has an area →
  decision 1 first. Straits carry their bare name as an alias (Gibraltar,
  Dover, Bonifacio). Theme `Europe` (sea).
- **Deserts**: tiny for Europe (Tabernas, Bardenas Reales, Oleshky is
  Eastern); one small chunk, `the Americas`/`Africa`/`Asia` themes don't
  apply — none for Europe exists; add rows theme-less.
- **Cities** (`us-cities-50k.json`): lists only ("List of communes in France
  with over 20,000 inhabitants", "List of cities in Germany by population",
  "List of ONS built-up areas in England by population", "List of cities in
  Italy", "List of municipalities of Spain", "List of cities in the
  Netherlands by province", "List of cities in Belgium", "List of cities and
  towns in Austria", "List of cities in Switzerland", "List of cities in
  Portugal", "Urban areas in the Republic of Ireland"); `sizeProp P1082`,
  **floor 50,000**; `--country="<exact data-countries.mjs name>"` — one
  chunk per country (the fold needs the Country column). Watch: the national
  capital is refused by the fold (right); a city that is a country's or an
  island's name is refused (right); NY-style "towns" that are county
  subdivisions with 800k people came through the US list — Europe's
  equivalents are metropolitan/comarca/arrondissement articles; `--check`
  reads village / municipality / comune / unincorporated community as a
  city. The fuzzy list is the payoff: Greenville was being scored as
  Grenville, Grenada.

## Lessons the US wave paid for (read before the first probe)

- **The `taken` list is a wrong-article detector.** When a probe says "X is
  the bank's X = <obscure article>", compare the bank row's size with the
  candidate's: Fox (300 km) scored on Fox River (Alaska) but was sized for
  the Illinois one; Current, McKenzie, Rainy, Brandywine, Lake Crescent,
  Jackson Lake, Bear Mountain (a *list* article), Dauphin Island (a bridge),
  San Francisco Bay (the Bay Bridge), St. Simons, Humber (Ontario's, themed
  as England's — fixed `9813fd5`). Re-point with `fix-titles.mjs`.
- **The `fuzzy` list is the payoff**: every row there fixes a wrong
  acceptance (Sheyenne → Cheyenne, Biscayne Bay → Bay of Biscay, Greenville →
  Grenville). But adding a row also *pre-empts* corrections: Weiser blocks
  "Weiser" → Weser, Redding "Redding" → Reading, and a new near-neighbour of
  a famous name turns a typo into a refused tie (Mount Raimer / Rainier,
  Towson / Tucson). The audits list these; drop the 30-view ones, keep the
  real places.
- **Wikidata sizes**: hectares as km² (100×) for lakes, miles as km for
  rivers, frwiki decimal shifts (1127 for 112.7), a range's high point for a
  range, "height above the sea floor" for seamounts, a town's total area
  (water included) for an island. The infobox wins; `article-size.mjs`
  prints the disagreements — eyeball them.
- **Description vetoes are not enough**: concept articles ("Volcano",
  "Summit", "Ultra-prominent peak" at 6,940 views), groups (Pribilof
  Islands, Great Lakes, Belgrade Lakes), former lakes (Agassiz, Allison,
  Palomas), protected areas, roads, the state itself (Rhode Island, Greece
  NY), county subdivisions (the Town of Hempstead). Scan the chunk's names
  and the probe's descriptions before folding; the audits catch the rest.
- **Themes must be extended with every chunk** or the themed prompt refuses
  the new rows: Hawaii (9 islands), volcanoes (64 by infobox), saltwater,
  the Caribbean (Navassa) were all missed first time. `fold.mjs` adds the
  themes named in the chunk's last column; put them there.
- **Oceans are derived from coordinates** — every lake/river island needs
  an override.
- **Names people type**: strip ", State"; no ʻokina / diacritics the matcher
  won't fold (Kaʻula → Kaula with the original as an alias); a two-place
  article ("Lake Hamilton and Lake Catherine", "Randalls and Wards Islands")
  is named for one with the other as an alias; townships and "X Reservoir"
  rows need the bare name reachable (reservoir is filler now; townships got
  aliases); a name that is a *concept* or a *letter* ("A Peak", "D River")
  is a jackpot for one keystroke.
- **Bare English-word rivers** (Big, Bad, Elk, New, Sun, Little, Middle,
  South, Spring, Wind, Dry…) went in as the world names them; the matcher
  gives ≤ 4-letter names no fuzzy slack. Fine, but every one of them is also
  a country/city/mountain name's loose form on the wrong round (decision 4b).
- **Cache hygiene**: the probe memoises sizes per QID and views per title
  inside `work/<name>-cache.json` (batch-URL caching refetched 25 minutes
  when the batches shifted); raw Wikidata answers are not cached (536 MB
  and `JSON.stringify` died). If a run dies, re-run — it resumes.
- **Every chunk moved the pin once and the draw twice**: `MAX_ELIGIBLE_SHARE`
  is bank-dependent, so a big fill can silently retire a prompt. The
  gameplay audit's "next 30 dailies old vs new" check catches it; read the
  guard counts it prints.
- **The size-unknown wall** (decision 1) took out more places than any
  floor: 652 bays, ~1,100 islands, 10 deserts. Ask about it before the
  islands and seas probes.
- **Audits earn their keep, and cost**: ~250–440k tokens each, ~25–35 min,
  Opus. Two at a time per chunk pair worked; three is the user's cap. Give
  them the pre-wave commit, the probe/sizes/wikitext files, and the report
  path; say "no network" for gameplay and "one request per 3 s if you must"
  for data. Copy every report into `reports/`.
- **Checkpoint commits**: a session cut-off loses nothing if every fold is
  committed with its pipeline green. The user watches their usage limit and
  has hit it mid-session.

## Also queued, lower

- The ~180 non-US straits and gulfs in `work/us-seas.json` (Danish Straits,
  Cabot, Tablas, Ombai, Kara, Foxe Basin, Gulf of Fonseca, Peter the Great
  Gulf…) — many with figures; each belongs to a later wave.
- **Docs that lag the bank:** SPEC §6's count table is a v1.1 snapshot by its
  own heading (§13 carries the current counts); `dist/wormillion.html` is the pre-expansion
  bundle (`npm run bundle`).
- **Nobody has played the 12,000-place bank for feel.** Three `?debug` runs
  and a note of what felt off would be worth an hour.
- No social-preview metadata (Open Graph); a named leaderboard; page weight
  (`bank.js` 1.97 MB raw / 277 KB gzip at 14,900 places; the whole page ~2.3 MB raw / ~390 KB gzip; nobody has complained).

---

# State of the world

## Where it lives

- **Repo:** https://github.com/MichaelBoujikian/wormillion (public; `gh` is
  authenticated, `git push` just works). **`main` = tag `v1.3-europe-wave`
  (`8ecb7e5`) = what Pages and Netlify serve** since the 2026-09-18 release
  (before it, `main` sat at `ffeceaa`, the 9,300 bank, 2026-09-15 to 09-18).
  **Work happens on `expansion-2`** (cut from `main` at the release);
  `expansion` is the retired branch of the first two waves.
- **GitHub Pages:** https://michaelboujikian.github.io/wormillion/ — every push
  to `main` deploys within a minute or two (`deploy.yml`); `ci.yml` runs
  test + validate on every branch.
- **Netlify:** https://wormillion.netlify.app — serves `v1.3-europe-wave`
  (published by the user 2026-09-18 ~01:50 UTC, verified 02:00 UTC: `bank.js`
  1,970,246 bytes; before it `1eaa3fb`, the 9,300 bank, from 2026-09-15). **The user has held Netlify off auto-publishing.** Per the
  Netlify docs (read 2026-09-17): a *locked* site still **builds** every
  push to main and only withholds publishing ("Publish deploy" then
  publishes the built one, no second build); *Stopped builds* is the setting
  under which a push builds nothing and "Trigger deploy" is unavailable
  until builds are re-activated. Netlify bills **15 credits per successful
  production deploy, never per commit** (a push of 106 commits is one push,
  one build, one deploy); failed deploys and rollbacks are free; branch
  deploys are free. The next session should ask which of the two settings
  is on before pushing to main. The build runs `npm test && npm run
  validate` as a gate. Functions at `/.netlify/functions/daily-submit` and
  `daily-stats`; Blobs store `daily`.
- **Local:** `C:\Users\smite\repos\wormillion`. Double-click `play.cmd` to play.
  `npm start` serves on :8123 (`.claude/launch.json` names it `wormillion` for
  the in-app browser pane) **and mounts the comparison API over an in-memory
  store**, so the whole server flow plays locally.

## Netlify, verified live on the new bank (2026-09-15 ~20:30 PDT; again 2026-09-18 02:00 UTC on `v1.3-europe-wave`)

The 2026-09-18 re-verification (the `v1.3-europe-wave` publish): `curl -sI
.../data/bank.js` → 1,970,246 bytes; `daily-stats?day=2026-09-19` →
`{"number":8,"draw":"6ddb6b85",...}` (the new bank's draw, computed locally
with `draw-diff.mjs` beforehand); `daily-submit` with `{day, playerId,
rounds:[15 strings], draw}` → 409 `closed` for an old day, 409
`draw-mismatch` for a wrong `draw`, 400 `round 1: unrecognized` for gibberish;
`Access-Control-Allow-Origin: https://michaelboujikian.github.io` on a
request carrying that Origin. Note the payload shape: `rounds` is an array
of 15 answer strings (or null for a miss), not `answers`.


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

## How it got here (short; details in SPEC §13, `reports/`, and git log)

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
`4203814`), the Netlify deploy and its verification. 2026-09-16 (overnight):
the US wave on `expansion` — seven probes, ~2,700 rows folded, eight Opus
audits, two matcher/letter-rule changes, `HANDOFF` rewritten for Western
Europe.

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
| generated-modifier guard | ≥ 6 answers; size and flag rules ≤ 70% of the cohort (`MAX_ELIGIBLE_SHARE`, decision 2), letter rules ≤ 60% (`MAX_ELIGIBLE_SHARE_LETTER`); a size rule's share is over the rows that carry a figure (audit 4) | `MIN_ELIGIBLE`, `MAX_ELIGIBLE_SHARE`, `promptBank.js` |
| city region prompts | only regions with ≥ 6 cities | `regionOptions()`, `promptBank.js` |
| city size thresholds | 500k / 1M / 5M / 10M, city-proper population | `SIZE_RULES.city`, `promptBank.js` |
| fuzzy edit budget | 0 edits for a stripped name of ≤4 letters, 1 for 5–7, 2 for 8–11, 3 beyond; +1 for a ≥4-letter name typed with a generic word the entry also carries | `slackFor`, `nearest`, `matching.js` |
| matching filler words | mount, mt, mountain, peak, hill, lake, loch, lough, llyn, river, rio, sea, ocean, gulf, bay, island(s), isle(s), desert, the, of, city, saint, st, cape, atoll, **reservoir**, and the foreign generic words lago, lac, lagoa, laguna, etang, fiume, fleuve, fluss, riviere, rivier (Europe wave); letter rules exempt loch/lough/llyn/saint/st/cape/rio **and every foreign word** ("Laguna Colorada" starts with L — the pre-merge audit) | `FILLER`, `matching.js`; `LETTER_FILLER`, `promptBank.js` |
| letter-rule filler | the matching set minus loch/lough/llyn/saint/st/cape/rio (those are letters where they are the name), **plus, for rivers only, creek/fork/branch/run/brook/kill/wash/slough/draw** (bayou and arroyo lead the name like rio); whole-name categories (country, capital, city, sea) strip only "the" | `LETTER_FILLER`, `LETTER_ONLY_FILLER`, `letterFillerFor`, `promptBank.js` |
| letter-rule miss text | names the word that didn't count: "Bear Creek has no double letter (Creek doesn't count)" | `letterMissText(name, rule, category)`, `promptBank.js`; wired in `ui.js` |
| namesake fame guard | 3× the monthly views: a qualified city reached by its bare name yields to a capital, country or island of that exact name with 3× the views of the name's best holder in the city cohort, on every round but a region round the famous one does not carry ("Athens" → the capital's nudge, on "starts with A" too; "Boston" in Europe → Boston (Lincolnshire); a second "Boston" → Lincolnshire, since the first scored the very place the capital is) | `NAMESAKE_FAME_RATIO`, `CONFUSABLE`, `famousElsewhere()`, `run.js` |
| loose-form alias fame | 3×: an alias-holder that famous joins and leads a loose form's list of names ("Cook" → Aoraki before Mount Cook (Canada)) | `LOOSE_ALIAS_FAME_RATIO`, `resolveLoose()`, `matching.js` |
| namesake pick | the round's subset lookup holds only the namesakes in scope; several in scope → the most-viewed not yet used; the exact forms "Name Qualifier" / "Name, Qualifier" / "Name (Qualifier)" / "Name XX" (US state code) | `buildLookup` (lists, `bareOf`), `qualifiedKeys`, `US_STATE_CODES`, `matching.js` |
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

What the audits measured against them (2026-09-16): nothing below
`MIN_ELIGIBLE` except the deliberate tight themes; two prompts retired by
`MAX_ELIGIBLE_SHARE` this wave (lake < 100 km² at 60.0%, city flag blue+white
at 60.1%) and "city flag blue+red" at 55% next; the next 30 dailies
generate cleanly with no repeated text within a day; jackpot share per
cohort 0.8–4.0% (mountains were 45% before the re-cut).

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
- **The Bash tool's heredocs fail two ways**: a long Python body sometimes
  dies with "unexpected EOF while looking for matching `''" (write the script
  with the Write tool and run the file instead), and quoted heredocs
  (`<<'EOF'`) are fine for data, but the Bash tool collapses
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
  `{category, letter:{kind,letter}}` — the letter lowercase (an uppercase
  letter silently matches nothing).
- **Known ≥85% answers for the jackpot (the 14,900 bank, 2026-09-17):**
  Micronesia (100%) / Antigua and Barbuda for country; South Tarawa /
  Monaco-Ville for capital; Bel Air South / Musanze for city; Karpa Island /
  Atlas Tract for island; Storvindeln Lake / Mother Goose Lake for lake;
  Cerro Fabrega / Chiaksan for mountain; Mecaya / Aquio for river; Skeleton
  Coast / Erg Iguidi for desert; Gulf of Manfredonia / Gulf of Masirah for
  sea. (Grand Manan, Canoas, Pihlajavesi and the Bay of Pomerania were
  jackpots only because they pointed at wrong articles; re-pointed, they
  are ordinary now.) **Known 0% answers for the dud:** New York on a city round, United
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
  Arabian Sea); several names that share it identify the list of them,
  most-viewed first, and the round's scope picks (decision 5, 2026-09-18:
  "Geneva" → Lake Geneva before Geneva Lake; before that two names
  identified neither). Two aliases with no name behind either still fail
  `validate`. **Namesakes** (one bare name, several entries, each with a
  `qualifier`): the lookup maps the key to the list; the exact qualified
  forms are "Name Qualifier" / "Name, Qualifier" / "Name (Qualifier)" and the
  US state code — exact forms only, never fuzzy candidates; a hit through
  one reports the bare name as `matched`; `NAMESAKE_FAME_RATIO = 3` in
  `run.js` (a city vs capital / country / island, against the name's best
  holder in the city cohort, every round but a region round the famous one
  does not carry); a qualified typing on another cohort's round is that
  place's nudge, never the bare twin scored; the stored answer is the
  display name "Syracuse (Sicily)" (`matching.displayName`).
- **Filler words are not letters; whole official names are.** Countries,
  capitals, cities and seas keep their whole official name
  (`WHOLE_NAME_CATEGORIES`). Length rules judge the spelling typed or its
  generic-word-trimmed form, whichever fits. Digits are characters (K2).
  (2026-09-16, user's decision) `reservoir` is a matching filler word like
  `lake`; creek/fork/branch/run/brook/kill/wash/slough/draw are **letter-only**
  filler for rivers — identifying for the matcher (Bear Creek is not Bear
  River), generic for the letter rules ("Bear Creek" no more ends in K than
  "Lake Tahoe" ends in E); bayou and arroyo lead the name like rio. A miss
  says which word didn't count — the user asked for that hint.
- **Entries are named as the world names them.** No bank-invented
  disambiguators; real names that carry a generic word stay. A parenthetical
  in the name column is the `qualifier` (decision 5): `Krka (Croatia)` is
  the bare name Krka plus the qualifier Croatia, id `river-krka-croatia`,
  shown as "Krka (Croatia)" and typed as "Krka" on any round that holds one
  Krka.
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

- ~~130 US cities whose name is held by another place~~ — in, decision 5
  (2026-09-18). **55 Colombian rivers** have no length figure anywhere (they can come
  in with `size` 0 now, like the US bays did). **Sweden's 164 lakes under 30
  km²** were re-probed at 25 km² in the Europe wave.
- **"Isle of White"** lands on New Zealand's White Island through the loose
  pass; **"Rock Island"** on Palau's Rock Islands; **"St. George, Utah"** is
  accepted as George, South Africa because `st` is filler. Each fixable with
  an alias or a rule; each has a side effect on the letter rules.
- ~45 of the US "cities" are census-designated places or unincorporated
  communities (Paradise NV, Metairie, Bethesda, The Villages, East Los
  Angeles…): real places outside the rulebook's "administrative city"; 30
  are townships (Upper Darby Township, with a bare alias). Torbes and Uribante are Venezuelan rivers in the
  South America theme. "Toms River" / "Grand Island" / "Cape Coral" count as
  short city names via their trimmed form (documented).
- **Antarctic Desert / Arctic Desert** score on the continent articles and are
  the most "famous" deserts; deliberate, funny as a 0% answer.
- **Bab-el-Mandeb and Hormuz** out-draw the Pacific on news; re-fetch
  pageviews in a few months (delete `scripts/.cache/views-60d.json` first).
- **~140 pattern-flagged candidates** from the 2026-09-15 bank audit (big
  rivers/mountains/cities with very few views) were never individually
  confirmed; `auto-titles.mjs` catches airports but not a plausible wrong
  place. The probes' `taken` lists are the better detector (nine wrong
  articles found that way this wave).
- A *length* prompt refuses an ineligible entry with the generic "doesn't fit
  this one" instead of "is 13 letters — this round wants 5 or fewer" when
  the entry was never in the prompt's lookup (noticed 2026-09-16; cosmetic).
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
- **Page weight** — `bank.js` 1.97 MB, gzip 277 KB (brotli 219 KB on Netlify); nobody has complained. `src/index.html` loads it with a bare `<script src>` and Pages caches it 600 s: for ten minutes after a deploy a returning browser can pair a cached bank with new engine files (both combinations play; the daily draw may differ from the server's for that session; a reload fixes it). A `?v=` cache-buster on the two data tags is the optional fix.
- **Population refresh** — declined; revisit only if a player reports a size
  prompt being wrong.

## Things the user has said they care about

- Prompts should be specific and get harder — keep extending. The *question
  itself* must carry any rule that matters, not a badge beside it.
- Answers people obviously reach for must be accepted — `gap-check` is the
  guard (812 answers); add to its list with every chunk, and use
  `scripts/expansion/` to add places, not hand edits.
- Spelling should autocorrect and show the real spelling — done and liked;
  today's guard changes were explained to them and approved.
- Achievement should feel good and failure should sting a little (the 0%
  overlay was their idea, gross on purpose).
- They want to find the answers and the logic in the code — the "Where the
  logic lives" table above and README's "How it's put together".
- **Working style:** they read summaries closely and decide fast. Present open
  decisions as a numbered list with a recommendation each; they answer all in
  one message; then do the whole batch and say at the end whether anything
  needs a second prompt. **Floors: decide on the spot and tell them which.**
  They will step away for hours during probes; carry on to a committed state
  and leave a status message they can read on return. Commit each change
  separately. **A push to `main` is a release — ask, and follow the release
  procedure; work goes on the phase branch.** Sub-agents are welcome when
  they earn their keep; they'll say which model (Opus for audits, up to
  three at once).
- **They watch their usage limit** and have hit it mid-session before. Keep
  work in small committed steps, checkpoint before long jobs, and say plainly
  after a cut-off what was kept and what was lost. They will step away during
  long agent runs; carry on to a committed state without them.
