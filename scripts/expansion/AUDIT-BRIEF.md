# Audit brief for a wave of bank additions (read fully before starting)

You are auditing rows recently added to the content bank of Wormillion, a
geography game (repo: `C:\Users\smite\repos\wormillion`; `HANDOFF.md` explains
the game, `HANDOFF.md` "Where the logic lives" the code). The lead session
folded the rows with `scripts/expansion/fold.mjs` and ran the pipeline; your
job is to find what is *wrong* with them before players do. **You do not edit
any repo file.** You write one Markdown report, and you write it as you go.

## The scope you were given

Your task message names the wave (which chunk files under
`scripts/expansion/work/folded/`, which commits) and which of the two audits
you are running: **data** or **gameplay**. Join the folded chunk rows to the
built entries in `src/data/<category>.json` by `wikiTitle` (every row has
one); the local cache `scripts/.cache/titles.json` holds each article's
description and coordinates, so most checks run offline.

## Checkpoints — non-negotiable

Sessions get cut off. Write your report file **first**, with the header and an
empty findings section, and **append every confirmed finding the moment you
confirm it** (rewrite the file; keep it valid Markdown). Every ~25 rows
checked, update a `progress:` line near the top (`progress: 180/612 rows
checked; checks 1–3 done, 4 in progress`). A report that stops mid-way must
still be usable: what was checked, what was found, what was not reached.

Write the report to the path named in your task (under the session
scratchpad); the lead copies it into `scripts/expansion/reports/`.

## Data audit — what to check, in this order

1. **Right place.** The entry's article describes the kind of thing the
   cohort holds (a river, not a reservoir/valley/road), and its coordinates
   fall inside the country/region the wave claims. Use the cache first; hit
   the live API (`action=query&redirects=1&prop=description|pageprops|coordinates`,
   one request per second, a User-Agent that names the project) only for what
   the cache lacks.
2. **Right figure.** `size` against the article's infobox (and Wikidata as a
   second opinion). Flag any row whose figure would put it on the wrong side
   of a size prompt's threshold (`SIZE_RULES` in `src/js/promptBank.js`:
   the thresholds are `SIZE_RULES` in `src/js/promptBank.js` — rivers 500/1,000/3,000/5,000 km, lakes 100/1,000/10,000/30,000 km², mountains 1,000/3,000/5,000/8,000 m, islands 100/10,000/100,000 km²…)
   — those matter; a 10% wobble that crosses nothing does not.
3. **Right name.** The bank name is what people type (Wikipedia's title
   without its parenthetical, bare of the generic word where the bank is
   bare). A namesake is authored as `Name (Qualifier)` (decision 5): the
   built `name` is bare, the qualifier is its own column, and the
   qualifier must be the place a player would type (the state, the country,
   the island — "Kent", not "East Kent"; "New York", not "Brooklyn"). Then the dangerous class: **a new row whose bare name belongs to a
   far more famous place** — it turns a nudge or a correction into a wrong
   acceptance or a false "isn't in Europe". Run the shipped matcher
   (`src/js/matching.js` `matchAnswer` over the cohort from
   `netlify/functions/lib/daily.js` `loadBank`) for each new name and for the
   obvious spellings ("X River", "Lake X", "Mount X"), and check what the
   *old* bank did with the same input (`git show <pre-wave commit>:src/data/bank.js`).
4. **Right cohort and themes.** The row is in the theme sets it should be
   (`src/data/themes.js`) and not in ones it shouldn't; a city's country and
   region tags are right; nothing is a national capital, and a city that
   shares a name with a country or an island carries a qualifier (Greece
   (New York), Manhattan (Kansas) — the fold refuses the bare form only).
5. **Rarity outliers.** New rows with very few views for what they are (a
   500 km river at 12 views/month) are usually a wrong article; check them.
6. **Duplicates.** Two rows on one `wikiTitle` in a cohort, or a new row that
   is an existing entry under another name (a river's other name, a lake and
   its reservoir).

## Gameplay audit — what to check, in this order

Everything through the real engine: `daily.loadBank` → `promptBank.createBank`
→ `run.createRun` + `run.submit`, never by reading the rules.

1. **Every new row lands**: its name, its aliases, "X River"/"Lake X"/"Mount X"
   forms, the stripped `wikiTitle` — all `accepted`, none merely `corrected`.
2. **Every prompt kind that touches the rows**: region, theme, ocean, flag,
   size threshold, letter (starts/contains/length). Eligible counts before and
   after; any prompt now under `MIN_ELIGIBLE` or over `MAX_ELIGIBLE_SHARE`
   (`src/js/promptBank.js`).
3. **`rarestFor` round-trips**: for a broad sample of prompts (and every
   prompt of the next 30 dailies via `src/js/seed.js`), the ★ answer the
   review would reveal is itself accepted by that prompt.
4. **Cross-category nudges**: a new river/lake/city name typed on the wrong
   category's round gets the nudge (`elsewhere`) and not `unrecognized`; a
   new name that shadows an existing entry elsewhere.
5. **Matcher battery**: a few hundred realistic typings (misspellings, with
   and without generic words) against the old and new bank; list every input
   whose outcome got *worse*.
6. **The next 30 dailies** generate with no repeated prompt text within a
   day and every prompt round-trips.

## Report shape

```
# <Data|Gameplay> audit of <wave> — <date>
progress: …
Scope · evidence standard · scripts used (keep them beside the report).
## Summary   (a table: check → confirmed problems → judgment calls)
## Confirmed (each with evidence, what the player sees, and the exact fix:
             file, row, alias value)
## Judgment calls
## Not reached (if cut off)
```

Audits run on Opus (the user's standing decision, 2026-09-15): data + gameplay in parallel, up to three agents at once, each writing its report as it goes; ~250–440k tokens each.
Two hundred thousand tokens is a normal budget; do not spend them re-deriving
what `HANDOFF.md` already says.
