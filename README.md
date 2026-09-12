# Wormillion

An endless, single-player geography digging game. Fifteen rounds, thirty seconds
each: name any real place that fits the prompt. The more obscure your answer, the
deeper your worm digs and the more you score. Everyone knows the Nile — nobody
digs deep on the Nile.

**Obscurity is measured in monthly English-Wikipedia pageviews.** Not size, not
population — how many people actually look a place up. It's the difference
between a big place and a famous one: Lake Baikal is a fraction of the Caspian's
area but plenty of people read about it, while a mid-sized African lake almost
nobody visits the page for pays out far more.

Prompts vary round to round and get harder as you go: a plain "Name a river"
early on, "Name a river with a T in it" or "Name a river in Mesopotamia" later.
Misspellings are corrected rather than rejected — type "Kilimanjro" and you get
Kilimanjaro, with the real spelling shown.

No accounts, no daily lock, no build step, no runtime dependencies. 1,387 real
places in the bank.

## Play locally

Double-click **`play.cmd`**, or open `src/index.html` in a browser directly.
That's it — the game loads its content bank from a plain `<script>` tag, so it
runs straight off the filesystem with no server and nothing to install.

If you'd rather serve it over HTTP:

```bash
npm start
```

…then open http://localhost:8123 (any static server works — `npx serve src`,
`python -m http.server -d src`, whatever you have).

## Share it

```bash
npm run bundle
```

…writes `dist/wormillion.html`: the entire game in one ~250 KB file, content
bank included. Send it to anyone — they double-click it and play. No install,
no unzip, and nothing for Windows SmartScreen to object to, which is more than
an `.exe` can say.

## Develop

```bash
npm test                 # node --test (auto-discovers tests/*.test.js)
npm run validate         # content-bank + theme checks (Spec 6.4)
npm run gap-check        # would a real player's obvious guesses be accepted?
npm run score-report     # what the bank does to the scoring curve
npm run fetch-pageviews  # refresh the Wikipedia view counts (needs network)
npm run build-data       # regenerate src/data/* from scripts/data-*.mjs
```

`gap-check` is the one to run after touching the bank: it pushes a list of
answers people obviously reach for ("Maui", "Seychelles", "Everest", "Volga")
through the real matcher and fails if any of them has nowhere to land. It is how
the missing Volga, Indus and Matterhorn were found.

Node is a dev-time tool only, for the test suite and the data build. Nothing in
`src/` needs it.

Add `?debug` to the URL to expose `window.__wormillion`, which lets you jump the
worm to any depth (`__wormillion.diveTo(650)`) and inspect a stratum without
playing fifteen rounds to reach it.

## How it's put together

```
src/                 the deployed site, as-is
  index.html
  styles.css
  main.js            boot
  js/
    rarity.js        rarity -> points -> dig distance  (Spec 5.1/5.2)
    strata.js        depth -> stratum band + palette
    matching.js      normalization, spelling correction, answer lookup
    promptBank.js    cohorts, prompt modifiers, the 15-slot draw (Spec 3.8)
    run.js           round/run state machine
    timer.js         30s countdown
    persistence.js   localStorage best dive + history  (Spec 9)
    icons.js         12x12 pixel category icons
    worldRender.js   the dig scene + buried relics (canvas, no DOM access)
    jackpot.js       the "ONE IN WORMILLION" burst for 85%+ answers (canvas, no DOM access)
    ui.js            the ONLY module that touches `document`
  data/
    *.json           the content bank, one file per category (Spec 4 schema)
    bank.js          the same entries as a <script> bundle - what the page loads
    themes.js        curated theme sets ("rivers in Mesopotamia"), hand-edited
    pageviews.json   the Wikipedia view snapshot that scoring runs on
scripts/
  data-countries.mjs, data-physical.mjs   authoring sources (pipe-delimited)
  data-wiki-titles.mjs  Wikipedia title overrides + hand-verified subjects
  data-oceans.mjs       ocean classification boxes + overrides
  data-flags.mjs        flag colours per country (generous: emblem colours count)
  data-us-states.mjs    the 50 US state capitals; they join the capital cohort
  data-un-members.mjs   the 193 UN members + observers the validator audits against
  build-data.mjs     emits src/data/* (exports buildFiles() for the fetcher)
  fetch-pageviews.mjs  refreshes pageviews.json
  validate-data.mjs  npm run validate
  gap-check.mjs      npm run gap-check
  score-report.mjs   npm run score-report
  serve.mjs          dev static server
tests/               node --test
```

`ui.js` owning all DOM access is a hard rule, not a style preference: it's what
keeps the engine testable under plain `node --test` with no jsdom and no browser.
`worldRender.js` draws to canvases that `ui.js` creates and hands to it.

### Content bank

Entries live in `scripts/data-*.mjs` in a compact pipe-delimited form and are
compiled to `src/data/`. Every entry is a real place; nothing is invented, and a
category that isn't ready for more entries just has fewer.

Each entry carries two numbers:

- **`magnitude`** — typical monthly English-Wikipedia pageviews. This is what
  scores. It's the *median* of 60 daily counts scaled to a month, so one news
  cycle can't pass a place off as permanently famous.
- **`size`** — the physical stat it was authored with (population, area, length,
  elevation). Reference only; it no longer affects scoring.

Refreshing the view counts:

```bash
npm run fetch-pageviews -- --check   # resolve titles, report problems, fetch nothing
npm run fetch-pageviews              # then write src/data/pageviews.json
npm run build-data                   # fold the new numbers into the bank
```

`--check` is the important half. A name like "Cam" or "Georgia" resolves to a
disambiguation page, and a disambiguation page's view count would make a famous
place look obscure and hand the player a thousand points. So the script resolves
every title, follows redirects, and compares each article's Wikidata short
description against the category ("does this actually read like a river?"). It
refuses to write anything while a title is unresolved. Fixes go in
`scripts/data-wiki-titles.mjs`: `WIKI_TITLES` overrides a title,
`WIKI_VERIFIED` records a subject you've checked by hand where the description
heuristic cries wolf.

Responses are cached under `scripts/.cache/` (gitignored), so re-runs while
you're fixing overrides don't re-hammer the API.

To add places: edit the authoring file, run `npm run fetch-pageviews`, then
`npm run build-data`, then `npm run validate`. The validator fails on duplicate
ids, alias collisions within a cohort, missing or non-positive pageview counts,
and bad region tags.

## Deployment

`.github/workflows/ci.yml` runs the tests and the validator on every push and PR.
`.github/workflows/deploy.yml` publishes `src/` to GitHub Pages on every push to
`main`.

**One-time repo setting:** in Settings → Pages, set the source to **GitHub
Actions**. No workflow file can do this for you, and deploys fail until it's set.

### Prompts

A slot is a category plus an optional modifier, and the modifier is what makes
round 12 harder than round 2:

| modifier | example | source |
|---|---|---|
| none | "Name a river." | — |
| region | "Name a country in Southeast Asia." | region tags on countries/capitals |
| theme | "Name a river in Mesopotamia." / "Name a volcano." / "Name a landlocked country." / "Name a country with a coastline." | `src/data/themes.js`, plus `DERIVED_THEMES` in `promptBank.js` (coastal = not landlocked) |
| ocean | "Name an island in the Pacific Ocean." | `oceans`, derived from each article's coordinates |
| flag | "Name a country whose flag has green in it." / "Name a capital city whose country's flag has both black and red in it." | `flag`, hand-authored in `scripts/data-flags.mjs`; capitals inherit their country's |
| size | "Name a country with a population under 1 million." / "Name a river longer than 3,000 km." | each entry's physical `size` |
| letter | "Name a river with a T in it." | derived from the name |

The first three rounds are always plain, in three different categories. After
that the chance of a modifier ramps from 70% to 100% (about 11 of 15 rounds end
up conditional), and **no prompt text is ever shown twice in a run** — a
category's second appearance is re-drawn until it reads differently from its
first.

A modifier narrows what is **accepted**; it never changes scoring, which is
always against the whole category (Spec 3.2). Generated letter rules are only
used when at least 6 entries satisfy them and they rule out at least 40% of the
category — otherwise the slot falls back to a plain prompt. Curated themes are
allowed to be tight on purpose: "Mesopotamia" has exactly two right answers.
How often modifiers appear is set by `OPENING_ROUNDS`, `MODIFIER_CHANCE_START`
and `MODIFIER_CHANCE_END` at the top of `src/js/promptBank.js`.

Letter rules look at the name as displayed plus every name and alias with filler
words ("mount", "lake", "the") stripped. So "Lake Baikal" satisfies both "starts
with L" and "starts with B", but "Nile" does not satisfy "has a T in it" merely
because one alias is "the Nile".

Themes are hand-curated because a themed prompt *rejects* everything outside
its set — a half-complete set would turn a correct answer into a wrong one.
`npm run validate` fails if a theme names a place that isn't in the bank.

Ocean membership is the exception, and deliberately so: "Hawaii isn't in the
Pacific" is exactly the bug a hand list produces. Every island and sea carries
`oceans`, derived from its Wikipedia article's coordinates by a few coarse boxes
in `scripts/data-oceans.mjs` and corrected there by an explicit override table
(Indonesian straddlers count for both oceans; Hudson Bay is Arctic; the Caspian
is none). The validator fails if any island or sea has no ocean and no override.

Flag colours (`scripts/data-flags.mjs`) are hand-authored, one row per
country, from a seven-colour palette, and read generously: an emblem's
colours count, gold is yellow, maroon is red, light blue is blue. That bias
is deliberate — only positive prompts ("has green in it") are generated, so
an extra colour can at worst accept a debatable answer, while a missing one
would reject a correct one. The build fails if a country has no row.

### Spelling

`matching.js` tries three passes, cheapest first:

1. **exact** — the normalized answer is a known name or alias
2. **loose** — same, ignoring filler words, so "Everest" finds "Mount Everest"
3. **fuzzy** — Damerau-Levenshtein within a length-scaled budget (0 edits for
   names of 4 characters or fewer, 1 for 5–7, 2 for 8–11, 3 beyond), reported
   back so the UI can show `Kilimanjro → Kilimanjaro`

Two guards keep it from being a cheat: short names get no slack at all, and if
two different places tie for closest the answer is rejected rather than guessed.

## Decisions this build made beyond SPEC.md

The spec left a few things open or assumed a shape that fought a harder
requirement. Each of these is deliberate:

- **Misspellings are corrected, not rejected — including British spellings.**
  Spec 3.6 rejected British variants by omission ("Harbour" simply never appears
  as an alias). Fuzzy matching supersedes that: "Harbour" is one edit from
  "Harbor", so it is accepted and the player is shown the spelling the bank uses.
  Keeping the old rule would have meant deliberately refusing to correct exactly
  the typos players make most.
- **Scoring is by Wikipedia pageviews, not physical magnitude.** The spec scored
  rarity off a place's size (population, area, length, elevation) on the theory
  that bigger correlates with famous. It does, loosely — but it produces wrong
  answers at the edges: Vatican City is the "rarest" country in the world by
  population while being one of the most famous places on earth, and an
  enormous but unread Siberian lake outscored Loch Ness. Pageviews measure the
  thing the game is actually about, so `magnitude` is now monthly views and the
  physical stat is kept as `size` for reference. The rarity, points and depth
  formulas in Spec 5.1 are untouched — only their input changed.
- **Capitals score on their own fame.** Spec 6 had a capital inherit its
  country's population, since a capital's own population says little about the
  country. Pageviews make that workaround unnecessary: Ngerulmud is obscure on
  its own merits even though Palau is a country like any other.
- **Classic scripts, not ES modules; a generated `data/bank.js`, not `fetch()`.**
  The spec asked both for ES modules fetching JSON *and* for the game to run by
  opening `index.html` directly. Those are incompatible — browsers block both
  module loading and `fetch()` on `file://`. The data files stay the maintained,
  validated source of truth; `build-data.mjs` also emits them as a script bundle,
  and each module exports through `module.exports` when required by the test
  suite. Result: the file:// promise holds and the engine stays unit-testable.
- **A region-scoped prompt only accepts places in that region.** Spec 3.1 and 5.3
  read literally would accept Egypt for "Name a country in Southeast Asia,"
  making the scope decorative. Scoping now gates acceptance; rarity is still
  computed against the global cohort exactly as Spec 3.2 requires, and answering
  a real country from the wrong region gets its own "not in {region}" hint rather
  than a flat "not recognized."
- **A region scopes a prompt only when ≥6 countries carry the tag**, computed
  from the data at load time. With the shipped bank that excludes *Scandinavia &
  the Nordics* (5 countries). Nothing was invented to pad it.
- **The countdown is not in an `aria-live` region.** A number announced once a
  second talks over the player. The prompt, the feedback line and 10s/5s warnings
  go to a dedicated polite live region instead; the visible timer is
  `aria-hidden`.
- **Sprites are procedural.** `src/assets/sprites/` doesn't exist: the strata,
  worm, tunnel, particles and icons are all drawn at a low internal resolution
  and upscaled with `image-rendering: pixelated`. That keeps the whole site well
  under the page-weight budget and makes the palette data-driven from
  `strata.js`.
- **Depth is reported as final depth, not maximum depth**, per Spec 5.2's
  explicit v1 choice.

## Future work

- Balance pass on the points constants (`POINTS_GAMMA` especially): a typical
  answer pays ~460. Dig depth was re-tuned in v1.2 (a run of median answers
  ends around 570, Mantle); `npm run score-report` prints both curves.
- More themes. (Capitals have three: not the largest city, on the coast,
  US state capitals.)
- More sub-region tags so more of the region list is usable as a prompt scope.
- Optional: export/clear history from the stats screen.
