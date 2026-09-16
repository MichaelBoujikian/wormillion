# United States × mountains — coverage probe and fill (2026-09-16)

Third chunk of the US scouring. Unlike rivers and lakes this one has **no
category tree and no size floor**: the state category trees hold every bump
with an article, and an elevation floor would cut the whole East (Mount
Washington 1,917 m, Mitchell 2,037, Katahdin 1,606, Monadnock 965). Instead
the sources are the 39 **list pages** — the national "highest / most
prominent / most isolated major summits", "List of mountain peaks of the
United States", the Colorado and California fourteeners, every Western
state's "List of mountain peaks of…", the New England / Appalachian /
Adirondack / Catskill lists, "List of volcanoes in the United States" — and
the floor is **30 views a month, the mountain cohort's own minimum**, so no
new row is rarer than the bank's rarest and the curve stays put. Config
`probes/us-mountains.json`.

## Outcome (same day)

- **`91e498f` — 2,280 rows.** 4,355 articles resolved as mountains, 152
  present, 3,966 missing or fuzzy; 402 under 30 views left out; 116 excluded
  by description (ranges, ridges, regions, seamounts, "Volcano", "Summit",
  "Mountaineering", "Battle of Blair Mountain", Butte MT, Chesapeake VA…);
  474 same-name duplicates dropped in the fold (ten Black Mountains, seven
  Sheep Mountains, six Twin Peaks, six Iron Mountains, five Mount Pisgahs…
  the most-viewed keeps the name). Elevations from the infobox for 989 rows
  where Wikidata had none; 25 disagreements all went to the article. 87 rows
  described as volcanoes / lava domes / cinder cones / calderas were added
  to the `volcanoes` theme (302 → 384). 167 fuzzy traps fixed.
- **Bear Mountain re-pointed.** The row (391 m — Bear Mountain in the Hudson
  Highlands) scored on "List of peaks named Bear Mountain".
- `--check` now reads dome / lava / volcanic / crater / caldera / knob as a
  mountain; 17 "landform" rows (Agathla, Piestewa, Navajo Mountain,
  Superstition, Four Peaks…) `WIKI_VERIFIED`. Old Man of the Mountain (gone
  since 2003), two volcanic fields and the Ingakslugwat Hills dropped after
  the check.
- Mountain cohort 3,527 (was 1,247); median views 822 → 122; minimum still
  30. `bank.js` 1.63 MB. `gap-check` pins 23 headline peaks.

## Counts

| | |
|---|---|
| mountain articles on the 39 list pages | **4,355** (3,592 links skipped as not peaks) |
| in the bank before | 152 |
| missing or fuzzy, ≥ 30 views | 3,564 → 2,758 after the description filter → 2,284 folded → 2,280 after `--check` |
| missing or fuzzy, under 30 views | 402 (Cobb Peak, Spark Plug Mountain, The Riddler, White Cloud Peak 1–10…) |
| name taken by another entry | 237 (Mount Olympus WA → Greece's, Wheeler Peak NV → NM's, Mount Washington OR → NH's, Castle Peak → Castle Mountain (Alberta), Mount Wilson CA → Wilson Peak…) |

## Decisions taken on the spot

- **Floor = views, not elevation, for mountains**; set at the cohort minimum
  (30/mo). The list pages are the notability filter; a peak nobody looks up
  is not an answer anyone gives.
- **No theme membership beyond `volcanoes`.** `the Rockies` (49 entries) is
  curated; deciding which of 2,280 peaks are Rocky Mountain peaks needs a
  range field the probe does not have. A future pass could use Wikidata
  P4552 (mountain range).
- **Domes, knobs, balds, buttes and mesas are mountains** (Half Dome,
  Lembert Dome, Spruce Knob, Brasstown Bald, Tempe Butte, Mesa Verde is a
  region and stayed out).

## Judgment calls left for a human

- The mountain cohort is now 65% American. Later waves rebalance; until
  then "Name a mountain that starts with B" has a lot of Bald / Black /
  Bear / Big to choose from.
- 237 name-taken peaks include famous ones whose bare name belongs to a
  more famous namesake (Mount Olympus WA 3,866 views vs Greece; Mount Wilson
  CA 1,705 vs Wilson Peak CO; Camelback… no, that one is present). The
  standing rule keeps them out.
- The "most prominent summits" lists reach into Canada for border peaks
  (Mount Saint-Magloire, Mont du Midi — under the floor anyway).
