# Decision 5 — same-name places, built and folded — 2026-09-18

Branch `expansion-2`, commits `963539e` (engine) → `b723920` (cities) → `bb386c6`
(rivers) → `09084d8` (lakes, mountains) → `c306d21` (islands) → `98d0a95`
(seas), on top of `main` = `v1.3-europe-wave` (14,901). Bank after: **15,427**
(+526): 730 entries carry a qualifier, in 317 namesake sets. Tests 204
(`tests/namesakes.test.js` is the rule-by-rule suite), `npm run validate`
clean, `npm run gap-check` clean, `draw-diff.mjs main`: 0 of 46 dailies draw
differently (the prompts are unchanged; the answers grew).

## What the design said, and what was built differently

The design is in HANDOFF.md "Same-name places: the design" (accepted by the
user 2026-09-17). Three things came out differently in the build, each for a
reason found while building:

1. **Ids carry the qualifier for every qualified row**, incumbents included
   (`city-syracuse-new-york` beside `city-syracuse-sicily`), instead of "the
   incumbent keeps its id". One rule, no order dependence, the 23 legacy
   parenthetical rows keep their ids unchanged, and the migration the other
   rule was meant to avoid is done by a tool (`qualify.mjs` renames the id in
   WIKI_TITLES, WIKI_VERIFIED, OCEAN_OVERRIDES, pageviews.json and
   themes.js). Nothing outside the repo's data files is keyed by id (history
   and the daily server store names).
2. **`NAMESAKE_FAME_RATIO` is 3, not 5**, and the guard runs a *city* against
   the capital, country and island cohorts — not "between the two city
   cohorts". Athens the capital has 4.8× the views of Athens, Georgia; Greece
   (New York) and Manhattan (Kansas) needed the country and the island; and
   "Boston" on "Name a city in Europe" must be Boston (Lincolnshire),
   accepted, not "Boston is a capital city" (Boston MA is a state capital in
   the capital cohort) — the point of the design — so the guard skips a
   region round the famous holder does not carry (after the audit: it runs on
   every other round, and measures against the city cohort's best holder of
   the name, not the entry the typing settled on).
3. **A loose form two different names share resolves to the list** (most
   viewed first) instead of identifying nobody — "Geneva" is Lake Geneva
   before Geneva Lake, "Wilson" Mount Wilson before Wilson Peak. Half of the
   mountains' taken list was this class (Mount Wilson beside Wilson Peak,
   Blue Mountain beside Blue Mountain Peak), and the old rule refused every
   one of them at the fold. Two aliases with no name behind either still fail
   validation.

Also: a bare shared name listed in a theme names the one holder without a
qualifier (the Thames beside Thames (Connecticut)); an incumbent whose own
article title is bare may stay the one unqualified holder (Colorado River,
Thames, Volga, Don, Green, Platte, Snake River — the famous one reads bare);
a name held only through a loose form goes in bare unless a namesake exists
(St. George, Palm Desert, Carson, Geneva Lake).

## The folds, by cohort

| cohort | rows in | incumbents qualified | views floor | left out (and why) |
|---|---|---|---|---|
| cities | 121 | 79 | 50k pop (the probe's) | "City of X" district articles, Stratford / Westminster (London districts), Lancaster (Lancashire) twice |
| rivers | 199 | 97 | 30 | East River and Fox (Illinois) (already in — re-pointed rows), Camas Creek (Idaho), Willow Creek (Oregon), Sugar Creek (Indiana) (a twin in the bank with the same qualifier), 11 duplicate ids inside the list |
| lakes | 14 | 8 | 61 | Lake Crescent, Jackson Lake, Pihlajavesi (already in), the Pyhäjärvis under 61 views |
| mountains | 93 | 15 | 122 | Dufourspitze (= Monte Rosa), Corno Grande (= Gran Sasso), Morven and Bear Mountain (already in), Sheep (the animal), three no-figure rows |
| islands | 103 | 43 | 91, size 0 allowed | Rhode Island the state, Pitcairn Islands the territory, Corfu / Chios the towns, Deer Isle the town, Hirta / Fasta Åland (aliases of what is there), Madeira Island (the region article stays), Nightingale Islands / North Isles (groups), a roundabout, a constituency, Spike Island ×2 (a park, a district), Elba Island / Jersey Island (a typed "Elba Island" must stay Elba), four peninsulas and towns the title check caught |
| seas | 5 | 0 | 213 | "Channel" and "Inland sea" (generic articles) |
| deserts | 0 | 0 | — | the two taken rows were the White / Black Desert (Egypt) themselves |

The cross-cohort class (a city whose bare name is a capital, country or
island): Athens (Georgia), Dublin (California), Wellington (Florida),
Washington (Tyne and Wear), Manhattan (Kansas), Greece (New York), New
Britain (Connecticut), Fano (Italy) — the first six get the nudge on a plain
round, the last two do not (the holder elsewhere is not 3× as viewed).

The 23 legacy parenthetical rows became regular qualified rows (ids
unchanged); Scamander's parenthetical is an alias; Tana (Kenya) and Fish
(Namibia) went bare like Fox and Salt; Musi (Indonesia), Green Island (New
York), Avon (Bristol) and Avon (Warwickshire) were qualified to match their
namesakes; the island cohort's Malta now scores on "Malta (island)" (it had
the country's article, 60k views).

Jackpot shares after: city 0.77%, lake 3.37%, river 1.90%, mountain 1.40%,
island 2.53%, sea 1.91% (desert 8%, country 14%, capital 5% by construction).

## The tools

- `scripts/expansion/qualify.mjs work/<rows>.txt [--write] [--alias]` —
  `id|qualifier[|new bare name]`; anything after `#` is a note.
- `scripts/expansion/chunk.mjs work/<probe>.json --tag=<t> --taken-only
  [--min-views=N] [--allow-no-figure]` — the taken rows as namesake rows plus
  `work/qualify-<t>.txt` for the incumbents; the review log marks
  ALIAS-HELD / LOOSE-HELD rows and where each qualifier came from.
- `scripts/expansion/fold.mjs --only=<block>-<tag> --label="..." --write` —
  parses `Name (Qualifier)`, admits namesakes under the validator's rule,
  always writes the namesake's WIKI_TITLES row.
- `scripts/expansion/drop.mjs` finds a qualified row.

The hand pass each cohort needed is in the commit messages; the chunk,
review and qualify files are kept in `scripts/expansion/work/folded/namesakes/`
(gitignored, on this machine).

## The audit round

Three Opus auditors ran in parallel on the folded bank (reports beside this
one: `2026-09-18-decision-5-{data,gameplay,regression}-audit.md`), then a
skeptic per confirmed finding; the skeptic queue was stopped after 11 of 27
verdicts (nine held, two refuted the diagnosis — the island-town areas are
the pipeline's standing choice, and "Little (Arkansas)" was refused by the
design, not by an id slip), and the rest were applied on the auditors'
reproductions, each re-run by the lead through `try.mjs` before and after.

**Engine (all with a test in `tests/namesakes.test.js` / `matching.test.js`):**

- The fame guard measured the famous holder against the entry the typing
  *settled on*, so a second "Boston" in a run (Boston (Lincolnshire), after
  Boston (Massachusetts) was scored) read "Boston is a capital city"; it now
  measures against the name's most-viewed holder in the city cohort.
- The guard was off on letter, size, flag and theme rounds, so "Athens" on
  "starts with A" scored Athens (Georgia) silently and "Greece" on "starts
  with G" scored Greece (New York) at 68%; it now runs on every round but a
  region round the famous holder does not carry.
- The generated qualified keys were fuzzy candidates: "Cambridge, UK" became
  Cambridge (Massachusetts) (two edits from "cambridge ma"), "Barren Island,
  New York" became Green Island (New York), "White River, Michigan" became
  Pine (Michigan). They are exact forms only now.
- A qualified typing on another cohort's round was scored as this cohort's
  bare twin, "corrected": "Athens, Georgia" on a capital round was the
  capital Athens, "Victoria, Texas" the Seychelles capital at 79%. It is
  that place's nudge now.
- A name-holder beat a far more famous alias-holder on a shared loose form:
  "Cook" was Mount Cook (Canada), 152 views, not Aoraki (alias "Mount Cook",
  8,858); "San Antonio" a 274-view cone, not Mount Baldy; "Holy" Holy
  Island (Anglesey), not Lindisfarne. An alias-holder with 3× the views of
  every name-holder now joins and leads the list (`LOOSE_ALIAS_FAME_RATIO`).

**Data:** Pine (Wisconsin) was on a Michigan article (re-pointed to Pine
River (Florence County), 129 km); Grand (Missouri) 760 → 364 km (was on the
wrong side of the 500 km rule); Margate (East Kent) → (Kent), Merida
(Yucatán) → (Yucatan) (`qualify.mjs` folds a qualifier to ASCII now), Sugar
Creek (Wabash River) → (Indiana), Matterhorn Peak (Sierra Nevada) →
(California), the borough-qualified islands → their state (Barren / White /
High Island (New York), Harbor Island (Washington), Treasure Island
(California), Monkey Island (County Wicklow)), the two-state rivers → the
state most of them runs through (White (South Dakota), Platte (Missouri),
James (South Dakota)); Castle Peak (Idaho) and Logan Peak into the Rockies,
Mount Washington (Oregon), Snaefell (Iceland) and San Antonio Mountain into
volcanoes; Marsh Island (Maine) (Orono's, in the Penobscot) in no ocean;
"Sugarloaf" and "Saint Helena Island" as aliases of Rio's mountain and the
Atlantic island so the bare typing is the famous one; Black River
(Jamaica)'s leftover alias "Black River Jamaica" dropped; Black Mesa
(Arizona) re-pointed from the Navajo County landform to the Navajo Nation
mesa (no sourced elevation, size 0); Ouse (Sussex) (2,313 views, 56 km) and
Little (St. Francis) (a qualifier whose form is not the Little Arkansas
River's name) added. `fold.mjs` now refuses a row whose generated qualified
form is another entry's name, and names the holder when an id is taken.

Left as judgment calls (in the reports): the settlement articles standing
in for islands (their area is the town's total, as the pipeline has always
taken it), Frankfurt (Main), San Juan (Four Corners), the rows the taken
lists carried past the size floors (Thames (Connecticut) 25 km, Devil's
Lake (Wisconsin) 1.5 km² — famous, no size rule affected), the 19 islands
at exactly 91 views with no figure, "St. George" on an Africa round landing
on George through the loose pass (pre-existing).

Bank after the audit: **15,429**; tests 205; validate and gap-check clean;
`draw-diff.mjs main` still 0 of 46 dailies.
