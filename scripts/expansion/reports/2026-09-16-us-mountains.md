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

## Re-cut the same morning (`38a1bd4`)

The two Opus audits (`2026-09-16-us-lakes-mountains-*-audit.md`) found the
30-view floor was a trap: the pageview median quantises at whole views per
day, so 1,004 of the 2,280 rows sat at exactly 30 = the cohort minimum —
28% of the mountain cohort read 100%, 45% jackpotted, and "United States"
on a mountain round paid 1,000 points for United States Mountain (30
views). Jackpot share by floor: 30 → 45%, 61 → 24%, 91 → 11%, **122 → 2.2%**
(rivers 2.6%, lakes 4.0%). **The floor is now 122 views a month (median 4 a
day): 676 rows.** Also out after the audits: the "Ultra-prominent peak"
concept article (6,940 views — the wave's most-viewed row), Sierra Madre
Range and Sierra de Luquillo (ranges), Seguam Island (a second row on Pyre
Peak), Daikoku Seamount (summit 323 m under the sea), Mount Everett (it tied
"Mount Everet"), 31 Canadian and Mexican peaks the continental
"most prominent / most isolated" lists drag in (King Peak, Mount Steele,
The Cabox, Cerro Tláloc, Sierra Negra…), Cedar Mountain, Virginia (a
comma-name nobody types). Mount Raimer / Aetna / Helen / Snowden / A Peak —
the rows that broke "Mount Rainer", "Mount Aetna", "Mount St Helen",
"Snowden" and the input "A" — were all under the new floor. The infobox
figure now always beats Wikidata's (Sacajawea Peak 3,000 m, Massanutten
891–1000). Volcanoes are tagged from the infobox's type / volcanic arc /
last eruption (64 rows; plugs, necks and laccoliths excluded; Yucca
Mountain and Battle Mountain VA excluded by hand). Mountain cohort 1,985
(was 1,247); `bank.js` 1.45 MB.

`the Rockies` theme is still not extended (640 new Rockies peaks answer
"Name a mountain in the Rockies" with "isn't in the Rockies") — a range
field (Wikidata P4552) is needed to do it honestly; queued.

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
