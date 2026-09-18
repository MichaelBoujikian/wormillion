# Handoff

For whoever (or whatever) picks this up next, with no other context. `README.md`
explains the game and how to run it; `SPEC.md` is the design source of truth
(v1.4, amendments log in §13). This file is what isn't in either: the job
that's queued, where things stand, how the loop works, every knob and its
setting, the decisions that must not be quietly undone, and the gotchas that
cost time. Claude Code's project memory is keyed to this folder
(`C:\Users\smite\repos\wormillion`); this file is the memory that survives.

Last rewritten **2026-09-18 (local 09-17 evening)** at the end of the session
that built and folded decision 5 (same-name places). History that used to
live here — the US and Europe waves' running logs, the pre-merge audit
narrative — is in `scripts/expansion/reports/` and SPEC §13; git log has the
rest.

---

# Start here (the next session, in order)

1. `git checkout expansion-2` (it is `main` + decision 5 + this file).
   `npm test` → 205, `npm run validate` → 15,429, `npm run gap-check` clean.
   Read "The job", "Where things stand", then "The loop".
2. **Sweep Mexico and Canada**, rivers first, one country × category per
   probe, one commit per chunk, the taken list folded after each chunk
   (decision 5), an Opus audit round per cohort or two. The recipes and
   floors are below; `scripts/expansion/probes/*.json` from the Europe wave
   are the templates (`nordic-rivers.json` is a clean multi-country one).
3. Release only when the user says so, by "The release procedure" below —
   a push to `main` deploys GitHub Pages and builds Netlify; it is never a
   routine push.

---

# The job

The user's plan (2026-09-15; South Asia added 2026-09-18, Eastern Europe
added 2026-09-18 for right after Mexico and Canada): scour the world
country by country, **every category per country**, "as many places as we
can", in this order:

> **United States ✓ → Western Europe + Scandinavia/Nordics ✓ → Mexico and
> Canada → Eastern Europe → East Asia → West and Central Asia → South
> America → Central America → North Africa → South Asia → the rest of
> Africa → islands.**

Eastern Europe is everything the Europe wave's 20 countries left: Poland,
Czechia, Slovakia, Hungary, Romania, Bulgaria, the Baltics, Ukraine,
Belarus, Moldova, the Balkans (Slovenia, Croatia, Bosnia, Serbia,
Montenegro, Kosovo, North Macedonia, Albania, Greece), and — ask the user —
European Russia west of the Urals and Turkey's European side. Names there
transliterate (Wisła / Vistula, Dunaj / Danube, Vltava / Moldau): the fold
keeps a native-name alias that doesn't collide, and the ue/oe question in
"Open questions" applies to Polish / Czech / Romanian diacritics too.

Within each area: **rivers → lakes → mountains → islands → seas (bays,
straits) → deserts → cities.** Rivers and lakes are where the traps live (a
missing name autocorrects to a different place); do them early. Since
decision 5, each cohort's chunk is followed by its taken list.

Standing decisions from the user, all in force:

1. **Work goes on the phase branch (`expansion-2` now); a push to `main` is
   a release.** Every push to `main` deploys Pages at once and, with
   Netlify's builds on, builds there too (15 credits per published
   production deploy); a bank that differs from the server's breaks the
   daily comparison for Pages players on days the two draw differently. So
   `main` moves only by the release procedure, as one fast-forward push,
   with the Netlify publish in the same minute. The user cuts a fresh branch
   per phase (`expansion` → `expansion-2` → …).
2. **Floors: keep them low, capture a lot, decide on the spot and tell the
   user which**; a later wave lowers every floor. The settled ones are in
   "Every knob".
3. **Name-taken places come in with a qualifier** (decision 5, built
   2026-09-18): `Portland (Maine)` beside `Portland (Oregon)`, `Green
   (Kentucky)`, `Prince of Wales Island (Alaska)` — authored as
   `Name (Qualifier)` in the name column, folded from the probe's taken list
   with `chunk.mjs --taken-only` → `qualify.mjs` → `fold.mjs`. A city whose
   bare name is a capital, country or island in the bank comes in qualified
   too (Athens (Georgia), Greece (New York)) and its bare typing keeps the
   nudge. Still out: a bare name that belongs to a far more famous place
   *not in the bank at all* (Botany Bay, Kent beside Sydney's), a district or
   town article standing in for the place, the same place under another
   title (Dufourspitze is Monte Rosa), and groups (the Outer Banks, the
   Farallones — a "famous group" rule for islands is an open question).
4. **Audits on Opus**, data + gameplay in parallel per cohort or two, **up to
   three agents at once**, each writing its report as it goes
   (`scripts/expansion/AUDIT-BRIEF.md`).
5. **Sourced figures only, never invented**; `size` 0 means "no figure
   anywhere" and is legal in every cohort (such a row answers no size
   prompt).

## Mexico and Canada, what to expect

- Both are region `North America` in `scripts/data-countries.mjs` (Mexico
  also alias CDMX for its capital). Themes the new rows must join: rivers
  and lakes `North America`; mountains `the Rockies` (Canada; `range-tag.mjs`
  from the infobox range field) and `volcanoes` (Mexico's arc — tag from
  the infobox `type` / `last_eruption`); islands `the Caribbean` (Cozumel,
  Isla Mujeres…) and, for Canada's Arctic, nothing yet; seas and deserts
  `the Americas`. Oceans derive from coordinates; Great Lakes and river
  islands need `OCEAN_OVERRIDES: []`.
- Category trees: `Category:Rivers of Mexico` / `…of Canada by province or
  territory`, `Lakes of Canada by province`, `Islands of Canada by province`;
  lists: "List of rivers of Mexico", "List of rivers of Canada" (by
  province pages), "List of lakes of Canada", "List of islands of Canada",
  "List of mountains of Canada", "List of mountain peaks of Mexico", "List
  of cities in Mexico" (by population) and "List of the 100 largest
  municipalities in Canada by population" / "List of cities in Canada".
  Cities floor 50,000 (P1082), `listCountry` in the probe maps each list to
  its country.
- Namesakes will be dense: Canada and Mexico share names with the US and
  Spain (London, Cambridge, Windsor, Kingston, Hamilton, Victoria, Guadalajara
  ✓, Mérida ✓, Córdoba ✓, León ✓, Santa Rosa, San José…). The taken list is
  now a normal input, not a loss.
- Pre-existing content: the bank already holds the famous Canadian and
  Mexican places from the v1.1 fill and the Colombia/Sweden/US probes;
  `work/us-seas.json` holds ~180 non-US straits and gulfs with descriptions
  (Cabot Strait, Foxe Basin, the Gulf of California…) that belong to these
  waves.

---

# Where things stand

**On `expansion-2` (HEAD past `e0437d3`, 11+ commits past `main`):**
decision 5 built and folded — engine, validator, tools, 526 namesake rows
across every cohort, 250 incumbents qualified, an Opus audit round (data /
gameplay / regression + skeptics) applied. `npm test` 205 · `npm run
validate` 15,429 · `npm run gap-check` 812 pins, every one lands · `bank.js`
2.06 MB raw / 284 KB gzip · 730 entries carry a qualifier in 317 namesake
sets · `draw-diff.mjs main` 0 of 46 dailies draw differently (the prompts
are unchanged, the answers grew — decision 5's release window is any time).
Reports: `scripts/expansion/reports/2026-09-18-decision-5-namesakes.md` and
the three `-audit.md` beside it.

**On `main` = tag `v1.3-europe-wave` (`8ecb7e5`) = what Pages and Netlify
serve** since the 2026-09-18 01:25 UTC release (verified both hosts; see
"Where it lives"). Bank 14,901.

| cohort | now | floors in force (size; views/mo) | notes |
|---|---|---|---|
| rivers | 3,904 | 80 km US / 60 km Europe / 50 km Britain & Ireland, or 1,000+ views; **≥ 30 views** | 3 with `size` 0 |
| lakes | 1,246 | 25 km² or 1,000+ views; **≥ 61 views** | |
| mountains | 2,713 | lists only, no elevation floor; **≥ 122 views** | jackpot 1.4% |
| islands | 2,494 | 1 km² or 1,000+ views, or unsized at 122+; **≥ 91 views** | ~390 with `size` 0 |
| seas | 576 | unsized at **≥ 213 views** | ~290 with `size` 0 |
| deserts | 137 | — | jackpot 8% (the one physical cohort above the band) |
| cities | 3,915 | 50,000 population (Wikidata P1082); no views floor | jackpot 0.8% |
| countries / capitals | 197 / 247 | fixed | capitals include the 50 US state capitals |

The views floors sit just above each cohort's flat bottom (the median of 60
daily views quantises at whole views/day: 30, 61, 91, 122…); a floor *at* the
bottom makes every row on it a jackpot. Check `node
scripts/expansion/jackpot-share.mjs` after every fold: healthy wave-fed
cohorts sit at 1.4–3.4% (country 14% and capital 5% are small fixed cohorts,
high by construction).

**Open questions for the user (none blocking):** a "famous group" exception
for islands (the Farallones, the Diomedes, the Outer Banks, the Blaskets);
the desert cohort's 8% jackpot share before Asia's and Africa's deserts
arrive; whether `size` 0 should count as "small" for "smaller than" prompts
(a one-line change in `satisfiesSize`; today unknown is neither); German
ue/oe/ae transliterations ("Muenchen") as aliases at fold time.

---

# The loop, as it works now

Read `scripts/expansion/README.md` (short) for the tool inventory. One
country × category at a time; one commit per chunk; the pipeline green
before every commit; push as you go.

1. **Probe.** Copy a `scripts/expansion/probes/*.json`, edit, run
   `node scripts/expansion/probe.mjs scripts/expansion/probes/<name>.json`
   in the background (5 min to 3 h). It walks Wikipedia categories (`roots`
   + `subcat` regex, depth ≤ 3) and/or the links of list pages (`lists`,
   redirects followed; `listCountry` maps a list to a country for cities),
   resolves redirects and descriptions, keeps what reads like the kind
   (`kind` on description|title, minus `notKind` on the description, lifted
   by `notKindExemptTitle`), pushes each article through the game's own
   matcher, fetches Wikidata's size (`sizeProp`), applies the floor
   (`minSize`), fetches 60 days of views for what is in scope — and for what
   is below the floor when `famousViews` is set (1,000+ views/mo lifts it
   back in) and for the unsized when `noFigureViews` is set — and prints
   **present / name-taken / fuzzy / missing / no figure / below floor /
   famous**. Output `work/<name>.json`; everything memoised per item in
   `work/<name>-cache.json`, so a re-run after a config change costs only
   what is new.
2. **Sizes.** `node scripts/expansion/article-size.mjs work/<name>.json
   [--no-figure] [--min-views=N]` reads each article's infobox (convert
   templates, decimal commas, `length_mi`, `area_acre`, `elevation_ft`…) and
   writes `work/<name>-sizes.json`. **The infobox always wins over Wikidata**
   (Wikidata is 100× off for one lake in six — hectares as km² — and
   decimal-shifted for frwiki/itwiki-imported rivers). Then **run the probe
   again**: pass 2 picks up the article figures and fetches views for what
   newly clears the floor.
3. **Chunk.** `node scripts/expansion/chunk.mjs work/<name>.json --tag=<tag>
   [--themes="A;B"] [--min-views=N] [--allow-no-figure] [--country="X"]`
   writes the missing + fuzzy rows as `work/new-<block>-<tag>.txt` in
   `fold.mjs`'s format (`Name|size|aliases|wikiTitle|themes`; cities
   `Name|Country|pop|aliases|wikiTitle|themes`), named the bank's way
   (Wikipedia's title minus its disambiguator; rivers bare of "River" unless
   named after a state / country / direction; cities without ", State").
   **Then hand-clean the file** — it always needs it: groups and chains,
   former lakes, protected areas, concept articles ("Ultra-prominent peak"),
   islands that are really towns, foreign rows the worldwide lists drag in,
   sizes to fix. The wave reports list what slipped through each time.
4. **Fold.** `node scripts/expansion/fold.mjs --only=<block>-<tag>
   --label="<date> <wave>"` (dry run: every collision with its reason), then
   `--write`; copy the chunk to `work/folded/`.
5. **The taken list** (decision 5): `node scripts/expansion/chunk.mjs
   work/<name>.json --tag=ns-<tag> --taken-only [--min-views=N]
   [--allow-no-figure]` writes the name-taken rows as `Name (Qualifier)`
   rows plus `work/qualify-ns-<tag>.txt`, the incumbents that must gain a
   qualifier (suggested from their own article titles). Read its review log:
   rows marked **ALIAS-HELD** (the incumbent holds the name through an
   alias — often the same place under another name: drop those) or
   **LOOSE-HELD** (a different name sharing a loose form: goes in bare
   unless a namesake exists), "already in the bank", and where each
   qualifier came from (title / description / the country — check the last
   two). Hand-edit both files — the qualifier must be the place a player
   types: the state, the province, the country, the county, never "East
   Kent", "Brooklyn", "Four Corners" or a tributary; a qualifier whose
   generated form is another entry's name is refused ("Little (Arkansas)"
   vs the Little Arkansas River — use another disambiguator, "Little (St.
   Francis)"). Then `node scripts/expansion/qualify.mjs
   work/qualify-ns-<tag>.txt --write` (renames the incumbent's row and id
   everywhere; `#` notes allowed; `id|qualifier|new bare name` also renames
   the name; `--alias` turns a dropped old qualifier into an alias), then
   `fold.mjs --only=<block>-ns-<tag> --write`. The six decision-5 commit
   messages (`b723920`..`98d0a95`) show the hand pass per cohort.
6. **Pipeline**, every time:
   ```bash
   npm run fetch-pageviews -- --check   # fix with fix-titles.mjs: WIKI_TITLES re-points, WIKI_VERIFIED for "landform" / "town on the island" / "no short description"
   npm run fetch-pageviews              # views + coordinates for the new rows (cached; a resolver window)
   npm run build-data && npm run validate   # validate names islands/seas without coordinates → add-oceans.mjs
   npm test && npm run gap-check        # add the chunk's headline names to gap-check.mjs first
   node scripts/expansion/jackpot-share.mjs
   ```
   **One commit per chunk**, the message saying how many, from what, what
   was left out and why. Push.
7. **Audit** (Opus, data + gameplay in parallel, per cohort or two, ≤ 3 at
   once): `scripts/expansion/AUDIT-BRIEF.md` is the brief; the task message
   names the commits, the chunk files (`work/folded/`), the pre-wave commit,
   the probe / sizes JSON and `work/wikitext-cache.json` (offline
   infoboxes), and the report path in the scratchpad; the agent writes as it
   goes. A skeptic per confirmed finding, three at a time, reproduces it
   before it is applied (the `Workflow` tool with `parallel()` in batches of
   three keeps the cap). 250–450k tokens per auditor; every audit round so
   far found real problems. Apply the confirmed fixes, copy the reports into
   `reports/`, commit.
8. **Report** per probe (`reports/<date>-<area>-<category>.md`): method,
   outcome with commit hashes, counts, what was left out and why, the
   judgment calls for a human.

## Timings and the Wikipedia rule

Wikipedia throttles from the first request (~5 s per request effective at
night). A state/province category tree probe ~1 h; an article pass ~1 h; a
views pass over 4,000 titles ~1 h; the 42,857-title US cities probe ~3 h.
**Never two resolvers at once** — `probe.mjs`, `article-size.mjs`,
`fetch-pageviews`, `wp-check.mjs`, `auto-titles.mjs`; a stray side request
(even one curl) 429s the running one. A *resolver window* is a time none of
them is running. Start anything over ~5 min with `run_in_background` and
wait with an `until grep -q …; do sleep 20; done` loop, also in the
background (the Bash tool caps at 600 s).

## Probe recipes per category

- **Rivers**: roots `Category:Rivers of <country> by <subdivision>`, subcat
  regex admitting the subdivision level only (county trees are 10× bigger
  and nearly all creeks); lists = the per-subdivision "List of rivers of
  X"; `kind` river|stream|creek|brook…; `notKind` anchored to the
  description's first word (reservoir, lake, range, road, valley, county,
  city…); `sizeProp P2043`, `sizeUnit km`, floor 80 km (60 Europe, 50
  Britain), `famousViews 1000`; `spellings river`. Wikidata has no length
  for 85% of small streams — the article pass is mandatory. Views floor 30.
  Native-name aliases matter (Rhein, Donau, Tajo/Tejo): the fold keeps an
  alias that doesn't collide. A river the bank keeps "River" on (Colorado
  River, Yellow River) keeps it for its namesakes ("Yellow River
  (Indiana)"); a direction or "New" keeps "River" ("New River (Mexico)").
- **Lakes**: roots for lakes *and* reservoirs; floor 25 km², `famousViews
  1000`; `notKind` must veto former/prehistoric/pluvial lakes, groups,
  "combined lake", cities named Lakewood; the settlement infobox's
  `area_total` includes water (`area_land` is the island/lake figure — the
  pipeline takes `area_total` today, consistently). Views floor 61. Themes:
  `North America`, `the Alps`, `the British Isles`, `Scandinavia`,
  `saltwater`. "Lough X" / "Loch X" / "Llyn X" keep their word.
- **Mountains**: **lists only, no category tree, no elevation floor**; floor
  by views 122/mo (30 = the cohort minimum put 1,004 peaks at exactly 30
  views and 45% of the cohort at jackpot). `jsonFile` must be
  `["mountains.json","minor-peaks.json"]`. Tag volcanoes from the infobox's
  `type` / `volcanic_arc` / `last_eruption` (plugs, necks, laccoliths are
  not volcanoes); `range-tag.mjs` tags range themes from the infobox range
  field — run it after `build-data`, not after the fold (the new rows must
  be in `mountains.json`); `RANGE_THEMES` there has `the Rockies` and `the
  Alps` (subranges by name) — extend per theme. A themed prompt refuses
  every untagged peak.
- **Islands**: category tree to the county level plus lists; floor 1 km²,
  `famousViews 1000`, `noFigureViews 122` (≈ 40% of islands have no area
  anywhere); `notKindExemptTitle` so an island whose article is its
  town/parish counts; `validate` lists islands without coordinates →
  `add-oceans.mjs`; **inland islands (lakes, rivers) need `[]` in
  `OCEAN_OVERRIDES`** — the coordinate box puts a Lake Constance island "in
  the Atlantic" otherwise. Views floor 91. Themes `the Caribbean`, `the
  Mediterranean`, `Greece`, `Scotland`, `Hawaii`, `Japan`, `Indonesia`.
  Groups stay out by the standing rule.
- **Seas / bays / straits**: roots per kind at the country level; the
  worldwide "List of straits" / "List of gulfs" pull in the whole world;
  almost none has an area → `--allow-no-figure` (size 0) at 213+ views.
  Straits carry their bare name as an alias (Gibraltar, Dover). Theme
  `the Americas` / `Europe` / `Asia` / `the Antarctic` (sea). `--check`'s
  `EXPECTED` words for seas include harbor / harbour / passage / arm of /
  narrows.
- **Deserts**: one small chunk; themes `the Americas` / `Africa` / `Asia` /
  `Australia`.
- **Cities**: lists only; `sizeProp P1082`, floor 50,000; `listCountry` in
  the config maps each list page to its exact `data-countries.mjs` name
  (one probe can span countries); `kind` must skip "urban area", districts,
  boroughs, "City of X" and "X Municipality" doubles, metropolitan /
  comarca / arrondissement articles; the national capital is refused by
  the fold (right); a city that is a country's or an island's name goes in
  only qualified. The fuzzy list is the payoff (Greenville was being scored
  as Grenville, Grenada).

## Lessons the waves paid for

- **The `taken` list is a wrong-article detector as well as the namesake
  backlog.** "X is the bank's X = <obscure article>" with a size mismatch
  means the bank row points at the wrong place (Fox, Current, McKenzie,
  Rainy, Lake Crescent, Humber, Lee, Avoca, Alta, Nera, Morven, Malta's
  island were all found this way). Re-point with `fix-titles.mjs`; `chunk
  --taken-only` skips a taken row whose article is already an entry's.
- **The `fuzzy` list is the payoff**: every row there fixes a wrong
  acceptance (Sheyenne → Cheyenne, Dublin → Lublin). But adding a row also
  *pre-empts* corrections: a new near-neighbour of a famous name turns a
  typo into a refused tie (Weiser/Weser, Redding/Reading). The audits list
  these; drop the 30-view ones, keep the real places.
- **Wikidata sizes lie in known ways**: hectares as km² (100×) for lakes,
  miles as km for rivers, itwiki/frwiki decimal shifts (1127 for 112.7 —
  the rule for Piedmont), a range's high point for a range, a town's total
  area (water included) for an island. The infobox wins; `article-size.mjs`
  prints the disagreements — eyeball them.
- **Description vetoes are not enough**: concept articles ("Volcano",
  "Channel (geography)", "Inland sea"), groups, former lakes, protected
  areas, roads, the state itself (Rhode Island), county subdivisions, a
  town standing in for its island. Scan the chunk's names and the probe's
  descriptions before folding; the audits catch the rest.
- **Themes must be extended with every chunk** or the themed prompt refuses
  the new rows. `fold.mjs` adds the themes named in the chunk's last
  column; put them there. A namesake is listed as `Name (Qualifier)`; a bare
  shared name in a theme names the one unqualified holder.
- **Oceans are derived from coordinates** — every lake/river island needs
  an override; the audit found 21 pre-wave ones "in the Atlantic".
- **Names people type**: strip the disambiguator (it becomes the qualifier
  if the name is shared); ASCII names with the original as an alias (Kaʻula
  → Kaula); a two-place article is named for one with the other as an alias;
  a name that is a *concept* or a *letter* ("A Peak", "D River") is a
  jackpot for one keystroke.
- **A views floor at the cohort's bottom is a jackpot factory** (the Nordic
  lakes at one view a day were 8% of the cohort; Mulciber at 18 views
  exposed the seas' 183 band). Floors sit one step above the bottom.
- **Cache hygiene**: the probe memoises sizes per QID and views per title
  inside `work/<name>-cache.json`; raw Wikidata answers are not cached. If a
  run dies, re-run — it resumes. `work/` and `scripts/.cache/` are
  gitignored: **the probe outputs, taken lists and caches live only on this
  machine** (the folded chunks are kept in `work/folded/`; on another clone
  a probe must be re-run).
- **`MAX_ELIGIBLE_SHARE` is bank-dependent**, so a big fill can silently
  retire or create a prompt; the gameplay audit's "next 30 dailies old vs
  new" check and `draw-diff.mjs` catch it.
- **Checkpoint commits**: a session cut-off loses nothing if every fold is
  committed with its pipeline green. The user watches their usage limit and
  has hit it mid-session; two Opus auditors died that way once with nothing
  kept.

---

# Same-name places (decision 5), as built

The design (accepted 2026-09-17, built 2026-09-18; SPEC 3.7 "Namesakes", 4,
6.4, the v1.4 row of 13; the build report
`reports/2026-09-18-decision-5-namesakes.md`) in one breath:

- A cohort may hold several entries with one bare name when each carries a
  `qualifier`, authored as `Name (Qualifier)` in the name column; the id
  carries it (`city-syracuse-new-york`, `city-syracuse-sicily`); the display
  name is "Syracuse (Sicily)"; the bare name is what the letter and length
  rules, the loose index and the typed bare form see.
- The lookup maps a key to a **list**, most-viewed first; a prompt's lookup
  holds only the entries in scope, so **the round's scope picks**: a bare
  "Syracuse" on "Name a city in Europe" is the Sicilian one, silently; on a
  plain round the most-viewed; typed again, the next one, then a duplicate;
  on a round no holder fits, wrong-scope on the most-viewed with its
  qualifier ("Syracuse (New York) isn't in Africa").
- Exact qualified forms: "Name Qualifier" / "Name, Qualifier" /
  "Name (Qualifier)" and the US postal code ("Portland ME") — exact only,
  never fuzzy candidates; a hit through one reports the bare name as
  `matched` (a length rule measures "sale", not "sale greater manchester").
- A loose form several *names* share resolves to the list too ("Geneva" →
  Lake Geneva before Geneva Lake; before, two names identified neither and
  the fold refused the second); an alias-holder with 3× the views of every
  name-holder joins and leads it (`LOOSE_ALIAS_FAME_RATIO`: "Cook" → Aoraki
  before Mount Cook (Canada)).
- **The fame guard** (`NAMESAKE_FAME_RATIO = 3`, `run.js`): a qualified
  *city* reached by its bare name yields the nudge when a capital, country
  or island of that exact name has 3× the views of the name's best holder
  in the city cohort — "Athens" → "Athens is a capital city", "Greece" →
  "Greece is a country", "Manhattan" → "Manhattan is an island"; on every
  round except a region round the famous one does not carry ("Boston" on
  "in Europe" is Boston (Lincolnshire), accepted); a second "Boston" in a
  run is Lincolnshire's (the first scored the very place the capital is). A
  qualified typing on another cohort's round is that place's nudge ("Athens,
  Georgia" on a capital round), never the bare twin scored.
- A famous incumbent with a bare title may stay the one unqualified holder
  (Thames beside Thames (Connecticut); 47 sets do); a bare shared name in a
  theme is that holder. The validator allows one unqualified holder per
  name, distinct qualifiers, and refuses a generated qualified form that is
  another entry's name.
- The stored answer is the display name, so the daily replay lands on the
  same entry. `usedAnswers` stays by id.

Tools: `qualify.mjs`, `chunk.mjs --taken-only`, `fold.mjs` (qualified rows,
`--label`), `drop.mjs` (finds a qualified row), `try.mjs` (type at a slot).
Everything above has a test in `tests/namesakes.test.js`.

---

# The release procedure

1. **Pick the moment.** The daily draw depends on the bank and the Netlify
   function computes the comparison from *its* bank, so **Pages and Netlify
   must switch together**, inside a stretch of days that draw identically on
   both. Run `node scripts/expansion/draw-diff.mjs main` (`--from --days`
   optional) and pick a window: a window ends when the first timezone
   (UTC+14) reaches a day that differs, and opens once the last (UTC−12) has
   left the previous one. Worked example, 2026-09-18: digs #6 and #7 drew
   identically, #8 (09-19) differed from round 4 on, so the window was
   "before 2026-09-18 10:00 UTC", else 09-21 12:00 → 09-22 10:00 UTC.
   Outside a window a Pages player mid-dig sees the new draw and the server
   rejects it with 409 `draw-mismatch` for the rest of that day; the block
   simply hides.
2. **Check the Netlify setting** (Site configuration → Build & deploy →
   Continuous deployment → Build settings → Build status): *Stopped builds*
   → push, then Activate builds, then Trigger deploy once; *Locked deploys*
   → the push builds once, then Publish deploy on that build. Ask the user
   which is on.
3. `git checkout main && git merge --ff-only expansion-2 && git push origin
   main` — one push, one Pages deploy (`deploy.yml`), one CI run, one
   Netlify build (15 credits when published). Tag it (`git tag -a
   v1.x-<wave>`, push the tag; tags trigger CI only). Then cut the next
   work branch from `main`. (A squash buys nothing on Netlify and loses the
   per-chunk history.) This is exactly how 2026-09-18 went:
   `ffeceaa..8ecb7e5`, tag `v1.3-europe-wave`, then `expansion-2`.
4. **Publish / trigger the Netlify deploy in the same minute** (Netlify
   first if anything), then the verification checklist in "Where it lives".
5. Update this file's "Where things stand" and "Where it lives".

---

# State of the world

## Where it lives

- **Repo:** https://github.com/MichaelBoujikian/wormillion (public; `gh` is
  authenticated, `git push` just works). `main` = tag `v1.3-europe-wave`
  (`8ecb7e5`) = what Pages and Netlify serve. Work on `expansion-2`;
  `expansion` is the retired branch of the first two waves.
- **GitHub Pages:** https://michaelboujikian.github.io/wormillion/ — every
  push to `main` deploys within a minute or two (`deploy.yml`); `ci.yml` runs
  test + validate on every branch.
- **Netlify:** https://wormillion.netlify.app — serves `v1.3-europe-wave`
  (published by the user 2026-09-18 ~01:50 UTC, verified: `bank.js`
  1,970,246 bytes, both functions on the new bank, the three rejections,
  CORS from Pages). **The user holds Netlify off auto-publishing.** Per the
  Netlify docs: a *locked* site still **builds** every push to main and only
  withholds publishing ("Publish deploy" publishes the built one, no second
  build); *Stopped builds* is the setting under which a push builds nothing.
  Netlify bills **15 credits per successful production deploy, never per
  commit**; failed deploys, rollbacks and branch deploys are free. The build
  runs `npm test && npm run validate` as a gate. Functions at
  `/.netlify/functions/daily-submit` and `daily-stats`; Blobs store `daily`.
- **Local:** `C:\Users\smite\repos\wormillion`. Double-click `play.cmd` to
  play. `npm start` serves on :8123 (`.claude/launch.json` names it
  `wormillion` for the in-app browser pane) **and mounts the comparison API
  over an in-memory store**, so the whole server flow plays locally.

**Netlify re-verification checklist** (after any publish, in order): (1)
build log — both functions bundled; (2) `curl
".../daily-stats?day=YYYY-MM-DD"` → JSON with `count`, `prompts` (15),
`number`, `draw` (compare with `draw-diff.mjs`'s local draw); a 500 naming
`bank.js` means `findRoot()` in `lib/daily.js` needs another path; (3)
`daily-submit` with `{day, playerId, rounds: [15 strings or null], draw}` →
409 `closed` for an old day, 409 `draw-mismatch` for a wrong draw, 400
`round 1: unrecognized` for gibberish (the payload key is `rounds`, not
`answers`); (4) play a daily on the Netlify URL and watch the block; (5)
from the Pages origin, `fetch` the stats cross-origin (CORS admits
`https://michaelboujikian.github.io`; `Vary: Origin` is unconditional —
curling without an Origin once poisoned the edge cache; **if the Netlify
site is ever renamed, change `REMOTE_API` in `compare.js` and
`ALLOWED_ORIGINS` in `lib/netlify.mjs`**). A day's aggregate can be rebuilt
from its submissions with `createDailyApi(...).rebuild(day)`. Harmless rows
`smoke-test-0001/0002` sit in dig #1; dig #5 mixes two prompt sets (created
under the old bank).

## How it got here (short; details in SPEC §13, `reports/`, git log)

v1.0–1.2 built the game: nine categories, pageview-based scoring, fuzzy
matching, the prompt-modifier system, the pixel-art dig scene, jackpot and
dud overlays, the summary ladder; then daily + endless modes, the -dle kit
(share, streak, review), the daily comparison on Netlify (2026-09-13).
2026-09-14/15: the fill from 2,016 to 9,300 places (Sonnet sub-agents,
folded and audited), the three coverage probes that showed the bank held each
country's top tier only, the matcher's edit-budget change. 2026-09-16: the
US wave (→ 12,008; seven probes, eight Opus audits, the category-word rule,
`size` 0). 2026-09-17: the Europe wave (20 countries, → 14,914), the
whole-bank pre-merge audit (→ 14,901), the release 2026-09-18. Then decision
5 (→ 15,429) on `expansion-2`.

---

# Reference

## Where the logic lives

| want to change… | file |
|---|---|
| the places themselves | `scripts/data-physical.mjs`, `scripts/data-countries.mjs` (pipe-delimited; `Name (Qualifier)` for a namesake) |
| the US state capitals | `scripts/data-us-states.mjs` (they feed the `capital` cohort, like minor peaks feed `mountain`) |
| the non-capital cities | `scripts/data-cities.mjs` (`Name\|Country\|population\|aliases`; Country must be a `data-countries.mjs` row; the build refuses a city that is its country's capital; its header comment is the rulebook) |
| **finding gaps, adding places in bulk, namesakes, fixing a wrong article, merging a duplicate** | **`scripts/expansion/` — read its README first**: `probe.mjs` + `probes/*.json`, `article-size.mjs`, `chunk.mjs` (incl. `--taken-only`), `qualify.mjs`, `fold.mjs`, `fix-titles.mjs`, `drop.mjs`, `add-oceans.mjs`, `add-alias.mjs`, `add-theme.mjs`, `range-tag.mjs`, `wp-check.mjs`, `auto-titles.mjs`; the audit tools `stack.mjs` (engine + bank from the working tree or any git ref, as the Netlify function loads them), `try.mjs` (type names at a slot; `--ref=main` for the live stack), `jackpot-share.mjs`, `draw-diff.mjs` |
| which colours a country's flag has | `scripts/data-flags.mjs` (one row per country; generous) |
| which places a themed prompt accepts | `src/data/themes.js` (hand-edited, shipped as-is; a theme with custom prompt text goes in `WORMILLION_THEME_PROMPTS` at the bottom; a namesake is listed as `Name (Qualifier)`) |
| which Wikipedia article an entry scores on | `scripts/data-wiki-titles.mjs` (`WIKI_TITLES` overrides — every qualified entry has one; `WIKI_VERIFIED` "I looked, it's right") |
| which ocean an island/sea is in | derived from coordinates in `scripts/data-oceans.mjs`; hand corrections in `OCEAN_OVERRIDES` there |
| what `--check` refuses (disambiguation, wrong subject, airport-type articles) | `scripts/fetch-pageviews.mjs` (`EXPECTED` words per category, `WRONG_SUBJECT`) |
| how prompts are worded / drawn / ramped / weighted | `src/js/promptBank.js` (`NOUN`, `PLAIN_TEXT`, `CATEGORY_LABEL`, `SIZE_RULES`, `drawModifier`, `drawSlots`) |
| which spellings feed the letter rules | `src/js/promptBank.js` (`variantsOf`, `LETTER_FILLER`, `WHOLE_NAME_CATEGORIES`) |
| how answers are matched (aliases, loose, fuzzy, namesake lists, qualified keys) | `src/js/matching.js` (`FILLER`, `WORD_CATEGORY`, `buildLookup`, `resolveLoose`, `nearest`, `displayName`, `US_STATE_CODES`) |
| what advances a round, retries, the miss hints, the cross-category nudge, the fame guard, the summary ladder, the run's mode | `src/js/run.js` (`famousElsewhere`, `elsewhere`, `submit`; hint *wording* is in `ui.js`) |
| the review rows and the rarest answer per prompt | `src/js/run.js` (`reviewRun`, `rarestFor`) |
| the daily's seed, the date key, the pinned sequence, the puzzle number, the countdown | `src/js/seed.js` (`DAILY_NAMESPACE`; bump it on purpose, never reseed by accident; `DAILY_EPOCH` is dig #1) |
| the daily lock, the mode chips, `?daily`, the countdown, the share/review buttons | `ui.js` (`refreshTitle`, `modeText`, `startRun(mode)`, `copyShare`, `showReview`) |
| the share text and its emoji bands | `src/js/share.js` (`BANDS`, `CANONICAL_URL`) |
| streaks, daily stats, which records get trimmed, `rounds` on a record | `src/js/persistence.js` (`dailyStreak`, `dailyStats`, `trim`, `toRecord`) |
| the comparison's server logic: replay, open window, aggregate shape | `netlify/functions/lib/daily.js` (`OPEN_BEFORE/AFTER`, `SCORE_BUCKET`, `replayRun`, `applySubmission`) |
| the comparison's HTTP: CORS origins, cache, Blobs adapter | `netlify/functions/lib/netlify.mjs` (`ALLOWED_ORIGINS`, `corsHeaders`), the two handlers |
| the comparison's wording and percentile maths; where the API is | `src/js/compare.js` (`REMOTE_API`, `lines`, `betterThan`) |
| the comparison's fetch/cache/render | `ui.js` `compareDaily` (`COMPARE_FRESH_MS`) |
| points, the dig curve, the jackpot and dud bars | `src/js/rarity.js` |
| the strata bands and palette | `src/js/strata.js` |
| the pixel-art scene, relics, crater widths, the rotten worm | `src/js/worldRender.js` (no `document` — takes canvases) |
| the "ONE IN WORMILLION" burst / the 0% drips and flies | `src/js/jackpot.js` / `src/js/dud.js` (canvas only); overlay markup/CSS in `index.html` / `styles.css` |
| the 12×12 category icons | `src/js/icons.js` (character maps) |
| all DOM | `src/js/ui.js` — the *only* module allowed to touch `document` |

## The data pipeline — in this order, every time the bank changes

```bash
npm run fetch-pageviews -- --check   # resolve titles; lists missing / disambiguation / wrong-subject / wrong-category / a namesake with no WIKI_TITLES row
npm run fetch-pageviews              # 60 days of pageviews + coordinates for anything new (cached)
npm run build-data                   # fold pageviews/oceans/flags into src/data/*.json and bank.js
npm run validate                     # schema, aliases, namesakes, loose-form collisions, regions, oceans, flags, capitals-vs-cities, UN audit, themes
npm test && npm run gap-check        # then commit
```

- **`--check` is the important half**: besides disambiguation pages and
  descriptions that don't read like the category, it refuses any article
  whose title or description reads like an airport, station, school, hotel,
  stadium, club, crash, film… (`WRONG_SUBJECT`), and a qualified entry with
  no `WIKI_TITLES` row (its bare name is some other article). Fix with
  `WIKI_TITLES` or `WIKI_VERIFIED` (`fix-titles.mjs`).
- `build-data` refuses to run if any entry lacks pageviews — deliberate.
- `src/data/pageviews.json` is committed, so `build-data` works offline.
  Responses cache under `scripts/.cache/` (gitignored); `titles.json` there
  holds every article's description and coordinates — an audit can check
  "right place" offline from it. A top-up of a few hundred entries takes a
  few minutes; the full bank takes tens of minutes — background it.
- `build-data` rewrites every category file's `source` date stamp; commit
  them all with the change.
- A new island or sea gets its ocean from coordinates; if the article has
  none, `validate` names it and `add-oceans.mjs` writes the override.
- A new country needs a row in `scripts/data-flags.mjs`; a new city's
  `Country` must match a `data-countries.mjs` name exactly and not be its
  capital; a place that belongs to a theme must be added to `themes.js` too.
- Scoring magnitude = median of 60 daily English-Wikipedia views × 30.44.
  It measures *curiosity*, not fame. `npm run score-report` prints the
  curves.

## Every knob and where it is set today

| knob | value | where |
|---|---|---|
| categories per run | 9 categories, 15 slots: every category once, six of them twice | `CATEGORIES`, `drawSlots()`, `promptBank.js` |
| plain opening rounds | 2 | `OPENING_ROUNDS`, `promptBank.js` |
| modifier chance, rounds 3→15 | 70% → 100% (~11.4 conditional rounds of 15) | `MODIFIER_CHANCE_START/END`, `promptBank.js` |
| flag-prompt weight in the modifier draw | 2 (same as region/theme/ocean/letter; 1 for size) → ~0.6 flag prompts per run | `options.push('flag', 'flag')` in `drawModifier()` |
| generated-modifier guard | ≥ 6 answers; size and flag rules ≤ 70% of the cohort (`MAX_ELIGIBLE_SHARE`), letter rules ≤ 60% (`MAX_ELIGIBLE_SHARE_LETTER`); a size rule's share is over the *sized* rows only | `MIN_ELIGIBLE`, `drawSizeRule`, `drawLetterRule`, `promptBank.js` |
| city region prompts | only regions with ≥ 6 cities | `regionOptions()`, `promptBank.js` |
| size thresholds | country 1M/10M/100M/1B; city 500k/1M/5M/10M; river 500/1,000/3,000/5,000 km; mountain 1,000/3,000/5,000/8,000 m; lake 100/1,000/10,000/30,000 km²; island 100/10,000/100,000; desert 100k/500k; sea 100k/1M km² | `SIZE_RULES`, `promptBank.js` |
| `size` 0 | "no sourced figure anywhere"; answers no size prompt either way | `satisfiesSize`, `promptBank.js`; SPEC 4 |
| fuzzy edit budget | 0 edits for a stripped name of ≤4 letters, 1 for 5–7, 2 for 8–11, 3 beyond; +1 for a ≥4-letter name typed with a generic word the entry also carries; a whole-string hit beats a stripped-form hit; ties refused; a typed plural of a generic-word name refused outright | `slackFor`, `nearest`, `matching.js` |
| matching filler words | mount, mt, mountain, peak, hill, lake, loch, lough, llyn, reservoir, lago, lac, lagoa, laguna, etang, river, rio, fiume, fleuve, fluss, riviere, rivier, sea, ocean, gulf, bay, island(s), isle(s), atoll, desert, the, of, city, saint, st, cape — each belonging to a category (`WORD_CATEGORY`); the loose pass drops only the cohort's own words or nobody's | `FILLER`, `WORD_CATEGORY`, `matching.js` |
| letter-rule filler | the matching set minus loch/lough/llyn/saint/st/cape/rio and the foreign generic words (letters where they are the name), **plus, for rivers only, creek/fork/branch/run/brook/kill/wash/slough/draw** (bayou and arroyo lead the name like rio) | `LETTER_FILLER`, `LETTER_ONLY_FILLER`, `promptBank.js` |
| letter-rule miss text | names the word that didn't count: "Bear Creek has no double letter (Creek doesn't count)" | `letterMissText`, `promptBank.js`; wired in `ui.js` |
| namesake fame guard | 3× the monthly views: a qualified city reached by its bare name yields to a capital, country or island of that exact name with 3× the views of the name's best holder in the city cohort, on every round but a region round the famous one does not carry | `NAMESAKE_FAME_RATIO`, `CONFUSABLE`, `famousElsewhere()`, `run.js` |
| namesake pick | the round's subset lookup holds only the namesakes in scope; several → the most-viewed not yet used; exact forms "Name Qualifier" / "Name, Qualifier" / "Name (Qualifier)" / "Name XX" (US state code), exact only | `buildLookup` (lists, `bareOf`), `qualifiedKeys`, `US_STATE_CODES`, `matching.js` |
| loose-form alias fame | 3×: an alias-holder that famous joins and leads a loose form's list of names ("Cook" → Aoraki before Mount Cook (Canada)) | `LOOSE_ALIAS_FAME_RATIO`, `resolveLoose()`, `matching.js` |
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
| probe floors | rivers 80 km US / 60 Europe / 50 Britain; lakes 25 km²; islands 1 km²; cities 50,000; mountains none; `famousViews` 1,000; `noFigureViews` 122 (islands) / 183→213 (seas) | `probes/*.json`, `chunk --min-views` |
| views floors (after the fold) | rivers 30 · lakes 61 · islands 91 · mountains 122 · seas 213 · cities none | `chunk.mjs --min-views`, `drop.mjs` after the fact |

## Environment gotchas (this machine)

- **Node is not on the Bash tool's PATH.** Prefix with
  `export PATH="$PATH:/c/Program Files/nodejs"` (Node 24.19), or use the
  PowerShell tool with
  `$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")`.
- **The Bash tool's timeout maxes at 600 s** and a longer command is moved
  to the background with its output in a file. Start anything over ~5 min
  with `run_in_background` and wait for the notification. Plain `sleep` is
  blocked; an `until <check>; do sleep 20; done` loop is allowed.
- **Wikipedia throttles hard** ("You are making too many requests" as a text
  body, not JSON). A stray side request 429s the running probe — don't even
  curl while one runs. Every resolver here sleeps ~1 s per request and backs
  off; the `prop=pageviews` endpoint fills in a handful of titles per round
  trip and hands back `pvipcontinue` — the nulls mean "not yet", not zero.
- **The Bash tool's heredocs fail two ways**: a long Python body dies with
  "unexpected EOF while looking for matching `''", and the tool collapses
  `\\` to `\` inside a quoted heredoc — a JS regex like `/\s+/` or `\r?\n`
  written through one arrives broken (it bit four times in two sessions).
  Write scripts and JSON configs with the Write tool and run the file; for
  a one-line JS patch through `node -e`, build backslashes with
  `String.fromCharCode(92)`.
- **A Python patcher turns `\b` into a backspace byte** — use raw strings
  (`r"""…"""`). Use the Edit tool for single-line edits; `src/` is LF.
- **Line endings are mixed on disk**; git normalises to LF
  (`.gitattributes`), so it warns "CRLF will be replaced by LF" on every
  commit — harmless. The expansion scripts detect a file's EOL before
  writing.
- **The local date is what matters** for dates in reports and commits (the
  machine is US Pacific; UTC is already tomorrow in the evening — this file
  says 2026-09-18 for work done the evening of the 17th, local).
- **ESM imports on Windows need `file:///C:/...` URLs** when importing a
  repo module from outside the repo; `createRequire(import.meta.url)` loads
  the classic-script modules from an `.mjs`. `scripts/expansion/stack.mjs`
  (`loadStack(ref)`) is the easiest way to get the real engine + bank in a
  script; `node --input-type=module -e "…"` for a one-off.
- **Sub-agents default to Sonnet unless the user names a model for the job**
  (Opus for audits, up to three at a time, writing their report as they
  go). The `Workflow` tool runs auditors with `parallel()` and skeptics in
  `parallel()` batches of three; a run of 27 skeptics takes ~3 h — stop it
  once the engine findings are reproduced by hand if time matters. Data
  agents: at most two at a time, appending every ~30 rows (`BRIEF.md`).
- **CSS class names are global**, and `[hidden]` must keep winning (global
  `[hidden] { display: none !important }`).
- **The test file glob must stay `node --test` with no arguments** (Node
  20/22 on Linux CI doesn't expand a quoted glob the way Node 24 on Windows
  does).
- `Claude in Chrome` is not installed, so `file://` can't be opened in the
  in-app pane; use the dev server (`preview_start` by name `wormillion`; it
  serves the working tree's `src/`, so a rebuilt bank shows after a reload
  with a cache-busting query). The pane can open the live sites too.

## Driving the game from JS (browser pane, `?debug`)

`window.__wormillion` exposes `renderer`, `burst`, `drip`, `currentRun()`,
`start(mode)`, `diveTo(depth, tier)`, `celebrate()` and `shame()`;
`window.Wormillion` holds every engine module (`Wormillion.promptBank.loadBank(window)`
builds the served bank; `Wormillion.run.createRun(bank, { rng })` a run whose
`state.slots[i]` can be forced).

- **The pane pauses `requestAnimationFrame` when hidden.** Pump frames:
  `for (let i = 0; i < 90; i++) __wormillion.renderer.update(0.05); __wormillion.renderer.draw();`
  — that completes a dive and fires `onArrive`, which advances the round.
- **To play a whole run from JS**: loop over rounds; each round read
  `run.prompt().text`, set `#answer-input.value`, dispatch `input`,
  `#answer-form.requestSubmit()`, read `#feedback`, pump the renderer, wait
  ~150 ms; after the last round wait ~4 s and read `#summary-compare`.
  `Wormillion.run.rarestFor(bank.promptFor(slot))` gives the ★ answer.
- **Rounds are 30 s and tool round-trips are slow.** Do set-slot + submit +
  read-feedback in ONE `browser_batch` / one JS call. `location.reload()`
  inside a JS call kills the call — reload with `navigate` instead. Return
  submits the form only via the Dig button (`ref` it and click).
- Slot shapes: `{category}`, `{category, region}`, `{category, theme}`,
  `{category, ocean}`, `{category, flag:{colours:[…]}}`, `{category,
  size:{op,value}}`, `{category, letter:{kind,letter}}` — the letter
  lowercase. `node scripts/expansion/try.mjs '<slot json>' Name…` does the
  same from the shell.
- **Known ≥85% answers for the jackpot (the 15,429 bank):** Micronesia /
  Antigua and Barbuda for country; South Tarawa / Monaco-Ville for capital;
  Bel Air South / Musanze for city; Karpa Island / Atlas Tract for island;
  Storvindeln Lake / Mother Goose Lake for lake; Cerro Fabrega / Chiaksan
  for mountain; Mecaya / Aquio for river; Skeleton Coast / Erg Iguidi for
  desert; Gulf of Manfredonia / Gulf of Masirah for sea. **Known 0% answers
  for the dud:** New York on a city round, United States on a country
  round, Mount Everest on a mountain round. `celebrate()` / `shame()` fire
  either without one.
- `diveTo` never moves the worm upward; call `renderer.reset()` first.

## Decisions a new session should not undo

- **Fuzzy matching stays, with its guards** (SPEC 3.7). The user asked for
  autocorrect ("sahra → Sahara is exactly what I want"). No slack for a
  stripped name of ≤4 letters; ties refused; no substring matching; the edit
  budget comes from the name with generic words stripped; both the whole
  string and the stripped forms are compared; a whole-string hit beats a
  stripped-form hit; a generic word typed *and* carried by the entry is
  worth one edit; the cross-category nudge compares whole names only,
  exact → loose → fuzzy over every other cohort; an exact name anywhere
  beats a correction anywhere; a typed plural of a generic-word name is
  refused, never corrected; the qualified forms are exact only.
- **A generic word belongs to a category**: the loose pass drops only the
  cohort's own words or nobody's ("Lake Michigan" on a river round is the
  lake's nudge, not Michigan River; "Lake Meade" on a lake round is Lake
  Mead whatever river is called Meade). "Mt" normalizes to "Mount"; a hyphen
  is a space; the ʻokina is an apostrophe; parentheses are stripped; þ→th.
- **`rio` is a filler word for matching but a letter where it is the name**
  (the Rio Grande starts with R), and so are loch/lough/llyn/saint/st/cape
  and the foreign generic words. A "convenience alias" — the name with
  generic words added or removed — never feeds the letter rules in the
  non-whole-name categories; a 2–4-letter all-caps alias (NYC, UAE) never
  feeds a letter or length rule.
- **"Strait" is not a filler word** — straits carry their bare name as an
  alias.
- **Namesakes and shared loose forms** work as "Same-name places, as built"
  says; don't reintroduce "two names identify neither".
- **Filler words are not letters; whole official names are** (countries,
  capitals, cities and seas: `WHOLE_NAME_CATEGORIES`). Length rules judge
  the spelling typed or its generic-word-trimmed form, whichever fits.
  Digits are characters (K2). `reservoir` is matching filler; creek / fork /
  branch / run / brook / kill / wash / slough / draw are letter-only filler
  for rivers; a miss says which word didn't count.
- **Entries are named as the world names them.** No bank-invented
  disambiguators; a real name that carries a generic word stays; a
  parenthetical in the name column is the qualifier.
- **One real place, one row.** The same river under two names, a lake and
  "its" reservoir, a peak and its twin on one article — aliases of the
  surviving entry. Two rows sharing a `wikiTitle` in one cohort is a bug.
- **An entry scores on its own article or not at all.** `WIKI_VERIFIED` is
  for "the description just doesn't say *city*", never "close enough". The
  two polar deserts scoring on `Antarctica`/`Arctic` are the one deliberate
  exception.
- **Generosity is the house style.** Emblem colours count for flags, island
  nations are islands, Cape Town and La Paz are cities, a wrong-category
  answer gets a nudge rather than "Not recognized". Bias data toward
  inclusion — with sourced figures (`size` 0 when there are none).
- **The city cohort excludes national capitals, and every city prompt says
  so.** US state capitals are cities too (all 50 are in both cohorts).
- **Ocean membership is derived, not curated**; `coastal` is likewise
  derived. Everything else themed *is* curated on purpose.
- **15 rounds, each category once or twice, two plain rounds to open, ramp
  70→100%.** The user asked three times for more conditional prompts.
- **The jackpot and dud tiers are symmetric by design.** `POINTS_GAMMA` was
  taken off the list by the user; leave it.
- **A themed sea prompt says "sea" unless the theme holds an ocean. Letter-
  rule misses say which letter.**
- **`file://` must keep working.** Classic scripts + generated
  `data/bank.js`, no ES modules, no external resources. The one `fetch()`
  (the comparison) is optional and guarded. Don't split the bank across
  files.
- **The server scores; the client only sends names** (display names for
  namesakes). Keep `lib/daily.js` free of `@netlify/blobs` so the suite runs
  without an install.
- **`ui.js` is the only module that touches `document`.**
- **Daily and endless differ in exactly one thing: the rng behind
  `drawSlots`.** `tests/seed.test.js` pins the 2026-09-12 sequence and
  `tests/prompts.test.js` pins dig #1's fifteen prompts. Growing the bank
  does not break the pin; reordering categories, regions or themes would.
- **Tests don't pin which entry is rarest.** Assert that whatever
  `rarestFor` returns is accepted — the bank will grow again.

## Open threads and judgment calls (none urgent)

- Namesake leftovers from the audit reports: the settlement articles that
  stand in for islands carry the town's total area (30 rows, consistent with
  the pipeline; none crosses a size threshold — the fix, if wanted, is
  `area_land` first in `article-size.mjs` for settlement infoboxes);
  Frankfurt (Main) and San Juan (Four Corners) as qualifiers; the rows the
  taken lists carried past the size floors because they are famous (Thames
  (Connecticut) 25 km, Devil's Lake (Wisconsin) 1.5 km²); "St. George" on an
  Africa round lands on George through the loose pass (pre-existing);
  "Isle of White" → White Island, "Rock Island" → the Rock Islands (loose).
- **55 Colombian rivers** with no length figure (can come in at `size` 0);
  the ~180 non-US straits and gulfs in `work/us-seas.json`.
- ~45 US "cities" are census-designated places or townships (real places
  outside the rulebook's "administrative city"); "Toms River" / "Grand
  Island" / "Cape Coral" count as short city names via their trimmed form.
- **Antarctic Desert / Arctic Desert** score on the continent articles;
  deliberate, funny as a 0% answer.
- **Bab-el-Mandeb and Hormuz** out-draw the Pacific on news; re-fetch
  pageviews in a few months (delete `scripts/.cache/views-60d.json` first).
- A *length* prompt refuses an ineligible entry with the generic "doesn't
  fit this one" when the entry was never in the prompt's lookup (cosmetic).
- **The USA outlier** (1.5M views) compresses the country curve; a clipped
  max in `rarityOf` is a scoring change — ask first.
- **Five Malaysian peaks have no theme home**; no `Indonesia`-style theme
  for the Philippines or Japan's mountains. The user likes new specific
  prompts; a theme is fair game if asked.
- **No social-preview metadata** (Open Graph) — offered twice, not picked
  up. **A named leaderboard** — the natural next server step. **The
  aggregator listing** the daily was built for — not a code task.
- **Page weight** — `bank.js` 2.06 MB, 284 KB gzip; nobody has complained.
  `dist/wormillion.html` is a stale pre-expansion bundle (`npm run bundle`).
- **Nobody has played the 15,000-place bank for feel** beyond audit
  scripts; three `?debug` runs and a note of what felt off would be worth
  an hour.

## Things the user has said they care about

- Prompts should be specific and get harder — keep extending. The *question
  itself* must carry any rule that matters, not a badge beside it.
- Answers people obviously reach for must be accepted — `gap-check` is the
  guard (812 answers); add to its list with every chunk, and use
  `scripts/expansion/` to add places, not hand edits.
- Spelling should autocorrect and show the real spelling — done and liked;
  every guard change since was explained and approved.
- Achievement should feel good and failure should sting a little (the 0%
  overlay was their idea, gross on purpose).
- They want to find the answers and the logic in the code — the "Where the
  logic lives" table above and README's "How it's put together".
- **Working style:** they read summaries closely and decide fast. Present
  open decisions as a numbered list with a recommendation each; they answer
  all in one message; then do the whole batch and say at the end whether
  anything needs a second prompt. **Floors: decide on the spot and tell them
  which.** They step away for hours during probes and agent runs; carry on
  to a committed state and leave a status message they can read on return.
  Commit each change separately, push as you go. **A push to `main` is a
  release — ask, and follow the procedure; work goes on the phase branch.**
  Sub-agents are welcome when they earn their keep; they'll say which model
  (Opus for audits, up to three at once).
- **They watch their usage limit** and have hit it mid-session before. Keep
  work in small committed steps, checkpoint before long jobs, and say
  plainly after a cut-off what was kept and what was lost. Before a
  `/compact`, make sure HANDOFF is current — it is the memory that survives.
