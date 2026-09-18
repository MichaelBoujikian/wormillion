# Mexico and Canada mountains — 2026-09-18 (the Mexico and Canada wave, probe 4)

Branch `expansion-2`. Probe `scripts/expansion/probes/mx-ca-mountains.json`
(lists only, no elevation floor, the 122-views floor); chunk files in
`work/folded/mx-ca/` (`new-mountains-mxca.txt`, `new-mountains-ns-mxca.txt`,
`qualify-ns-mxca.txt`). Bank 16,195 → **16,355** (+135 peaks, +25
namesakes); 9 incumbents qualified. Mountain cohort 2,713 → 2,873; jackpot
share 1.40% → 1.32%.

## Method

- 13 lists: Canada (mountains, mountain peaks, highest / most prominent /
  most isolated major summits, Alberta, British Columbia, the Canadian
  Rockies, Yukon, volcanoes) and Mexico (mountain peaks, ultras,
  volcanoes). 2,472 candidates → 1,720 read as mountains; 1,331 missing,
  90 fuzzy, 131 taken. Views for all 1,552 in scope (no size floor); the
  article pass over the 203 at 122+ views filled 17 elevations and
  overrode 3 (Hudson Bay Mountain 2,589 vs Wikidata 1,650; Bowie Seamount
  "3,000" for a seamount at −24 m — dropped).
- Chunk `--min-views=122 --allow-no-figure`; 1,244 peaks under 122 views
  left out (the standing floor: 30 put 45% of the US cohort at jackpot).
- Volcanoes tagged from the cached infobox `type` / `volcanic_arc` /
  `last_eruption` (plugs, necks, sills, intrusive stocks excluded — the
  Monteregian Hills' Mont Brome and Mont Saint-Grégoire are stocks, not
  volcanoes); the Rockies by `range-tag.mjs` after the build (+44 +8 +1),
  which now writes a namesake as "Name (Qualifier)".

## What went in

135 rows: Yukon's giants (Mount Steele 5,073 m, King Peak 5,173, Mount
Kennedy 4,238), the Rockies' names (Howse Peak, Mount Joffre, Mount Fay,
Mount Hungabee, Deltaform, Mount Goodsir, Mount Clemenceau, Mount Brazeau,
Mount Sir Alexander, Crowsnest, Tunnel Mountain, Ha Ling Peak, Mount
Lougheed, Mount Kidd, The Beehive, Roche Miette…), the Coast Mountains
(Mount Queen Bess, Monarch, Silverthrone, Wedge, Slesse, Golden Hinde, The
Stawamus Chief, Sky Pilot), Mount Edziza and the Tseax / Eve / Nazko cones,
Hoodoo Mountain, The Volcano, The Table, the East (Mont Saint-Hilaire,
Ishpatina Ridge, The Cabox, Mount Albert, Mount Gosford, Mount Raoul
Blanchard), and Mexico's Cerro Tláloc (4,158), Pico del Águila, Jocotitlán,
Cerro Potosí, Cerro Mohinora, Pico de Tancítaro, Cerro de la Viga, Los
Humeros, El Jorullo, Tres Vírgenes, Cerro Prieto. 22 into `volcanoes`. Two
in-chunk namesakes qualified by hand (Mount Babel (Quebec / Alberta)).
Taaw Tldáaw with alias Tow Hill; Mount Kaweah (California) came in from the
ultras list — a real peak the US wave's lists had missed.

25 namesakes: Three Sisters (Alberta) (2,161 views, alias "The Three
Sisters"; the bare "Three Sisters" is Oregon's at 4,049) and (British
Columbia) (Elk Valley); Mount Victoria (Alberta) beside Nat Ma Taung's
alias; Baldy Mountain (Manitoba), South Mountain (Nova Scotia), Mount Tom
(California), Pyramid Mountain (Alberta), Bald Mountain (Colorado),
Cathedral Mountain (British Columbia), Crown Mountain (British Columbia),
Grizzly Peak (Sawatch Range) beside Grizzly Peak (Tenmile Range) (both
Colorado's — the range tells them apart), Heart Mountain (Alberta), Kings
Peak (British Columbia), Mount Logan (Quebec), Mount Lyell (Canada), Mount
Odin (British Columbia), Mount Baker (Alberta), Mount Baldy (Alberta);
loose-held names in bare: White Hill (Nova Scotia's highest, 852 views),
Mount Tantalus, The Table, Big Bald Mountain, Ice Peak, Mount Hesperus, The
Pyramid. Incumbents qualified: South Mountain (Maryland), Mount Tom
(Massachusetts), Three Sisters (Oregon), Grizzly Peak (Tenmile Range),
Heart Mountain (Wyoming), Kings Peak (Utah), Mount Lyell (California), Bald
Mountain (Utah) (was "(Uinta Range)"), Crown Mountain (Saint Thomas) (was
"(United States Virgin Islands)").

## Left out, and why

- Concept and navbox articles (31): Ring of Fire, Volcano, Stratovolcano,
  Caldera, Shield volcano, Lava dome, Cinder cone, Summit, Topographic
  prominence, Ultra-prominent peak, Pulpit, Battle of Vimy Ridge, Albert F.
  Mummery, Mountain peaks of Canada, Volcanism of Canada / Eastern Canada,
  Coast Range Arc, Central America Volcanic Arc, Karmutsen Formation, the
  hotspots, the oceanic ridges (Juan de Fuca, Alpha, Explorer), the
  calderas that are geology not summits (Blake River, Sturgeon Lake, Mount
  Pleasant, Silverthrone Caldera beside Silverthrone Mountain), Bowie
  Seamount, Watts Point volcanic centre, Sulphur Mountain Cosmic Ray Station,
  Alberta Mountain forests, Monarch Butterfly Biosphere Reserve.
- Regions and towns: Cypress Hills, Moose Mountain Upland, Tumbler Ridge.
- Other countries: Gunnbjørn Fjeld and Mont Forel (Greenland), Store
  Trolltinden, Pic la Selle and Pic Macaya (Haiti), Cerro Tres Picos
  (Argentina).
- Victoria Peak (British Columbia): the bare name is Hong Kong's far more
  famous peak, not in the bank (the standing rule).
- 1,244 peaks under 122 views/mo; 106 taken rows under 122.

## For a human

- "Three Sisters" bare lands on Oregon's (4,049 views) before Alberta's
  (2,161) — the most-viewed rule; "The Three Sisters" (the Canmore form)
  is the Alberta one's alias and lands there directly.
- Grizzly Peak's qualifiers are ranges (Sawatch / Tenmile), the one place
  the state-or-province rule cannot tell two namesakes apart.
- Mount Lyell (Canada) keeps the title's "(Canada)" (it straddles
  Alberta–BC); Mount Victoria took "(Alberta)" the same way Lake Louise's
  peaks do.
- `--check` now accepts "cone" in a mountain's description (Tseax Cone, Eve
  Cone, Volcano Mountain are cinder cones).
