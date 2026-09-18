# Mexico and Canada lakes — 2026-09-18 (the Mexico and Canada wave, probe 3)

Branch `expansion-2`. Probe `scripts/expansion/probes/mx-ca-lakes.json` (one
probe for both: the same 25 km² floor); chunk files in `work/folded/mx-ca/`
(`new-lakes-mxca.txt`, `new-lakes-ns-mxca.txt`, `qualify-ns-mxca.txt`). Bank
15,939 → **16,195** (+244 lakes, +12 namesakes); 8 incumbents qualified; one
incumbent re-pointed. Lake cohort 1,246 → 1,502; jackpot share 3.37% → 2.80%.

## Method

- Tree: `Category:Lakes of Mexico` + `Reservoirs in Mexico` (Mexico's whole
  lake category is one page of articles), `Lakes of Canada by province or
  territory` down through Ontario's census divisions, Quebec's regions and
  BC's regions, `Reservoirs in Canada`, the artificial / endorheic /
  glacial / saline / oxbow lakes of Canada (76 categories, 2,338 pages); 15
  lists (Canada, dams and reservoirs, each province, Mexico). 3,479
  candidates → 2,206 read as lakes.
- Floor 25 km², `famousViews` 1000 (lifted Big Ass Lake, 0.15 km² at
  13,059 views, Man Drowned Himself Lake, Little Manitou Lake, Cultus Lake
  and Buntzen Lake). Wikidata sized 1,059; the article pass added 522 and
  overrode 30 (hectare infoboxes, a commented-out "12,000 km²" for
  Châteauvert Lake that was hand-set back to Wikidata's 32); `--sister=fr`
  found 273 frwiki articles among the 1,174 unsized and 27 areas (Lobstick
  Lake 1,500, Ossokmanuan 650, Lake Magpie 111, Cowichan 62…).
- Chunk `--min-views=61` (the lakes' standing views floor; no unsized rows —
  the recipe's), theme `North America`; then `--taken-only`.

## What went in

244 rows: the big northern lakes (Smallwood Reservoir 6,527 km², Caniapiscau
Reservoir 4,318, Amadjuak 3,115, Robert-Bourassa Reservoir 2,835, Nueltin
2,279, Southern Indian 2,247, Husky-sized Lac La Martre 1,776, Lac Seul
1,657, Gouin Reservoir 1,570, Lobstick 1,500, Yathkyed 1,449, Lake Claire
1,436, Clearwater Lakes 1,383, Moose Lake (Manitoba) 1,367, Kasba 1,341,
Cedar Lake 1,353, Island Lake 1,223, Lesser Slave 1,168, Aberdeen 1,100,
Bras d'Or 1,099, Gods 1,061, MacKay 1,061, Lake Bienville 1,047, Napaktulik
1,080, Cormorant 1,000…), the settled south (Harrison, Kalamalka, Cowichan,
Quesnel, Chilko, Babine, Stuart, Lake Rosseau / Joseph / Scugog / Couchiching
/ Simcoe's neighbours, Lake Timiskaming, Lake Abitibi, Lake Saint-Louis, Lake
of Two Mountains, Lake Saint Pierre, Bras d'Or, Gander, Grand Lake…), and
Mexico's Lake Miguel Alemán (478), Lake Yuriria and Lake Chichancanab (the
others were already in). Five saline lakes joined the `saltwater` theme
(Lake Tasiujaq, Chaplin, Old Wives, Little Manitou; Big Quill went out with
the Quill Lakes group).

In-chunk namesakes qualified by hand: Pigeon Lake (Alberta / Ontario), Moose
Lake (Alberta / Manitoba), Sturgeon Lake (Alberta / Ontario). Sambaa K'e
with alias Trout Lake; Clearwater Lakes with aliases Lac a l'Eau Claire and
Wiyashakimi.

12 namesakes: Gull Lake (Alberta) (1,035 views — more than Minnesota's),
Eagle Lake (Ontario), Grand Lake (New Brunswick / Newfoundland and
Labrador), Sylvan Lake (Alberta), Pelican Lake (Manitoba), Whitefish Lake
(Ontario), Cross Lake (Manitoba), Black Lake (Saskatchewan), Beaver Lake
(Alberta); loose-held names in bare: St. Mary Reservoir, Garry Lake.
Incumbents qualified: Gull / Pelican / Whitefish Lake (Minnesota), Grand
Lake (Colorado), Sylvan Lake (South Dakota), Cross Lake (Louisiana), Beaver
Lake (Arkansas), Eagle Lake (California) (was "(Lassen County)").

**The taken list as a wrong-article detector:** the bank's Lake of Bays
scored on the *township's* article ("Lake of Bays", 118 km² — the
municipality's area, waved through by an old WIKI_VERIFIED line); it is
re-pointed to "Lake of Bays (Muskoka lake)", 68.8 km².

## Left out, and why

- Groups: Great Lakes, Quill Lakes, Fishing Lakes, Whiteswan Lakes, Husky
  Lakes, Lacs des Loups Marins.
- Impact craters standing in for their lakes: Mistastin crater (548 views),
  Pilot crater.
- Word-order twins of far more famous lakes (a bare "Victoria Lake" is an
  exact key and would beat Lake Victoria's loose form): Victoria Lake
  (Newfoundland), Cumberland Lake (Saskatchewan), McDonald Lake
  (Saskatchewan). Geneva Lake went in this way in decision 5 (10× apart);
  these are 100× and more.
- 172 sized lakes under 61 views/mo (Atikonak, Clinton-Colden, Frobisher,
  Eastmain Reservoir…); 557 below 25 km²; 1,147 unsized (no
  `noFigureViews` for lakes — the recipe's).
- Lake Tahoe (Victoria Island), 155 km², 30 views (under the floor).

## For a human

- Article-vs-Wikidata disagreements that cross the 100 km² line: Missinaibi
  Lake (article 11.71 vs Wikidata 100 — the article won; the lake is ~100
  km² by other sources; check), Lake Ainslie 57.4 vs 100, Marchington 81 vs
  36 (left out under 61 views anyway).
- Lobstick Lake 1,500 km² and Ossokmanuan 650 are frwiki figures (parts of
  the Smallwood Reservoir system, which is also in at 6,527).
- Lake Tasiujaq is a saltwater inland bay by description (formerly Richmond
  Gulf); it is a lake by title and on the lakes lists — in, `saltwater`.
- `--check` refused Lake of Two Mountains and Marsh Lake ("widening of the
  river"), Artillery Lake (a broken description), Poisson-Blanc ("Lac in
  Laurentides"), Gander Lake (no description) and Lake Tasiujaq; all
  verified by hand.
