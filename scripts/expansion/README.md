# Expansion tooling

The scripts that grew the bank from 2,016 to ~9,000 places on 2026-09-14/15.
They are maintainer tools, not part of the game; `work/` (their inputs, cache
and reports) is gitignored.

The loop, one chunk (a category × region) at a time:

1. A Sonnet sub-agent reads `BRIEF.md` and writes `work/new-<category>-<n>.txt`
   (`Name|magnitude|aliases|wikiTitle|themes`, or with a `Country` column for
   cities), appending every ~30 rows so a cut-off keeps partial work.
2. `node scripts/expansion/fold.mjs --only=<category>-<n> --write` folds the
   rows into `data-physical.mjs` / `data-cities.mjs`, adds `WIKI_TITLES`
   overrides where the title differs from the name, and extends `themes.js`.
   It drops rows that would collide (same name, same filler-stripped name,
   alias clashes, a city that is a capital or an island/country name) and
   prints why; dry run without `--write`. Move folded inputs out of `work/`.
3. `node scripts/expansion/auto-titles.mjs <category> --apply` audits every
   entry of a category the way `fetch-pageviews --check` does and re-points
   disambiguation/missing/wrong-subject titles by trying candidate titles,
   the links on the disambiguation page, and a full-text search; it writes
   `work/fixes-auto.json` and applies it. Whatever it can't settle is printed
   for a human: put real-but-oddly-described subjects in `WIKI_VERIFIED` and
   hand-picked titles in `titles` with `fix-titles.mjs`, or drop the entry.
4. `node scripts/expansion/fix-titles.mjs fixes.json` — `{ titles: {id: title},
   verified: [id], note }`; sets or replaces `WIKI_TITLES` entries, appends
   `WIKI_VERIFIED` ids.
5. `node scripts/expansion/drop.mjs <id> ...` removes an entry everywhere
   (row, overrides, ocean override, theme membership).
6. `node scripts/expansion/add-oceans.mjs oceans.json` — `{ overrides: {id:
   [oceans]}, note }` for islands/seas whose article has no coordinates
   (`npm run validate` lists them).
7. `npm run fetch-pageviews -- --check` → `npm run fetch-pageviews` →
   `npm run build-data` → `npm run validate` → `npm test` → `npm run gap-check`,
   then commit.

`wp-check.mjs candidates.json` resolves a hand-written map of candidate titles
for a quick look; `append-row.mjs BLOCK 'row'` appends one row to a
`data-physical.mjs` block without the collision rules (use sparingly).

Wikipedia throttles: the resolvers sleep between batches and back off on 429;
a category pass over a few hundred problems takes tens of minutes, so run it
in the background and never two at once (they share `work/titles-cache.json`).

## Coverage probes (2026-09-15)

`node scripts/expansion/probe.mjs scripts/expansion/probes/<name>.json` asks
"does the bank have every <category> of <country> that English Wikipedia
has?": it walks a category tree and/or the links of list pages, resolves
redirects and descriptions, pushes every article through the game's matcher
(`matchAnswer` on the cohort, exact/loose first) and checks `wikiTitle`, then
fetches views and a Wikidata size for what is missing. It prints four lists:
present, name taken by another entry, missing-but-*autocorrected-to-somewhere-
else*, and missing. Three configs and their reports (`reports/2026-09-15-*`)
show the shape; copy one for a new country × category. Output and the API
cache go to `work/` (gitignored). Wikipedia throttles: never run it alongside
`fetch-pageviews` or `auto-titles`.
