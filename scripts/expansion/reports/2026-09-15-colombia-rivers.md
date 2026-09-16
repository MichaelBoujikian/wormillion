# Colombia × rivers — a narrow coverage probe (2026-09-15)

The question: pick one country and one category and see whether the bank has
everything. Colombia, rivers. Method: every article in `Category:Rivers of
Colombia` (plus its Colombian subcategories) and every link on Wikipedia's
"List of rivers of Colombia", resolved through redirects, filtered to
river-described articles, then pushed through the game's own matcher
(`matching.matchAnswer` on the river cohort, exact/loose first, fuzzy noted
separately) and checked against each entry's `wikiTitle`. Views are the
bank's own metric (60-day median × 30.44). Script and raw output: the session
scratchpad (`colombia-rivers.mjs`, `colombia-rivers.json`).

## Outcome (same day)

**66 added** (`99aab7f`): every missing river with an English article *and* a
sourced length — Wikidata P2043, else the article's infobox or prose, else
es.wikipedia's infobox. Cross-checks that mattered: Wikidata had the Sinú at
27 km (it is 415), the Atabapo at 131 (article: 280), the Catatumbo at 338
(article: 500); the article wins. Left out on purpose: **Ariporo** (article
and Wikidata both say 1,300 km, which cannot fit in Casanare); **San
Francisco River (Bogotá)** (a 10 km stream that would take "San Francisco"
away from the São Francisco correction); the four name collisions above plus
**Río Frío** and **Leon River (Colombia)** (their bare names belong to the
Texas rivers when those are added). **55 more have no length figure anywhere**
(Guayabero, Bojayá, Mulatos, Guatapé, Nechí's neighbours…) and are still
missing — a human with a map could supply them; the list is in the session's
`colombia-chunk.log`. Bank is 9,033; `gap-check` now pins Caño Cristales,
Catatumbo, Sinú, Bogotá River, Cauca and Caquetá.

## Counts

| | |
|---|---|
| Colombian river articles on English Wikipedia | 148 (151 candidates minus Casiquiare canal, Guayas River, Orinoquía region) |
| in the bank | **22** |
| missing | **126** |
| …of which a player's "X River" spelling is *autocorrected to a different river* | **33** |
| rivers with no English article at all (can't be added) | 10 — Balsillas, Apulo, Duda, Guavio (Fusagasugá), Neusa, Mayo, Manzanares, Palomino, Sucio, San Juan (Mira) |

## Present (22)

- Amazon River → **Amazon**
- Apaporis River → **Apaporis**
- Apure River → **Apure**
- Arauca River → **Arauca**
- Atrato River → **Atrato**
- Casanare River → **Casanare**
- Cauca River → **Cauca**
- Guaviare River → **Guaviare**
- Inírida River → **Inirida**
- Içana River → **Icana**
- Japurá River → **Japura**
- Magdalena River → **Magdalena**
- Meta River → **Meta**
- Mira River (Ecuador and Colombia) → **Mira** (by name "Mira River") — ⚠ bank scores it on "Mira River (Portugal)"
- Orinoco → **Orinoco**
- Patía River → **Patia**
- Putumayo River → **Putumayo**
- Rio Negro (Amazon) → **Negro River**
- Río Negro (Magdalena River tributary) → **Negro River** (by name "Río Negro") — ⚠ bank scores it on "Rio Negro (Amazon)"
- San Juan River (Colombia) → **San Juan** (by name "San Juan River") — ⚠ bank scores it on "San Juan River (Nicaragua)"
- Vaupés River → **Vaupes**
- Vichada River → **Vichada**

Two of those are name collisions, not coverage: the bank's **Mira** scores on
the Portuguese Mira and its **San Juan** on the Nicaraguan San Juan, so the
Colombian rivers of those names could only be added under Wikipedia's own
parenthetical titles. "Río Negro" landing on the Amazon's Rio Negro is fine.

## Missing (126), by monthly views

Rows marked **fuzzy →** are the harmful ones: the bank has nothing for them, so
the spelling-corrector reaches for the nearest name anywhere in the cohort and
scores the player on a river on another continent.

| views/mo | length | river | fuzzy → |
|---:|---:|---|---|
| 2283 | 100 km | Caño Cristales |  |
| 578 | 338 km | Catatumbo River |  |
| 213 | 375 km | Bogotá River |  |
| 183 | 27 km | Sinú River | Min (Sichuan) |
| 152 | 100 km | Medellín River |  |
| 91 | 172 km | Suárez River |  |
| 61 | 185 km | Ariari River |  |
| 61 | 131 km | Atabapo River |  |
| 61 | 280 km | Cesar River | Bear |
| 61 |  | Chicamocha River |  |
| 61 |  | Guayabero River |  |
| 61 | 158 km | Guáitara River |  |
| 61 | 69 km | Otún River |  |
| 61 |  | Pance River | Peace |
| 61 | 150 km | Ranchería River |  |
| 61 |  | Río Frío (Bogotá savanna) |  |
| 61 | 368 km | San Jorge River |  |
| 61 |  | Taraíra River |  |
| 61 | 310 km | Zulia River |  |
| 34 |  | Bojayá River | Mojave River |
| 33 |  | Mulatos River |  |
| 30 | 100 km | Anchicayá River |  |
| 30 |  | Arzobispo River |  |
| 30 | 150 km | Baudó River | Baro |
| 30 |  | Vita River |  |
| 30 | 630 km | Caguán River | Aguan |
| 30 | 550 km | Cahuinari River |  |
| 30 | 50 km | Cali River |  |
| 30 | 650 km | Capanaparo River |  |
| 30 |  | Carchi River |  |
| 30 | 480 km | Cinaruco River |  |
| 30 |  | Dagua River | Dawa |
| 30 |  | Fucha River |  |
| 30 |  | Fundación River |  |
| 30 | 85 km | Guatapurí River |  |
| 30 |  | Guatapé River | Guadalupe |
| 30 | 137 km | Guatiquía River |  |
| 30 |  | Guayuriba River |  |
| 30 |  | Güejar River |  |
| 30 | 440 km | Igara Paraná River |  |
| 30 |  | La Miel River |  |
| 30 | 102 km | La Vieja River |  |
| 30 |  | Lebrija River |  |
| 30 |  | Mataje River |  |
| 30 | 126 km | Mendihuaca River |  |
| 30 |  | Nare River |  |
| 30 |  | Naya River | Napa |
| 30 |  | Nechí River | Neches |
| 30 | 220 km | Orteguaza River |  |
| 30 | 115 km | Pamplonita River |  |
| 30 |  | Papurí River |  |
| 30 |  | Pira Paraná River |  |
| 30 |  | Páez River |  |
| 30 | 69 km | Quindío River |  |
| 30 |  | Río de Oro (Catatumbo) | Negro River |
| 30 |  | Saldaña River | Athi-Galana |
| 30 |  | San Juan de Micay River |  |
| 30 | 240 km | San Miguel River (Colombia) |  |
| 30 |  | Soacha River |  |
| 30 | 135 km | Sogamoso River |  |
| 30 | 95 km | Sumapaz River | Sumida |
| 30 |  | Tapaje River |  |
| 30 |  | Teusacá River |  |
| 30 | 375 km | Tiquié River |  |
| 30 | 650 km | Tomo River | Omo |
| 30 |  | Torbes River | Tormes |
| 30 |  | Tunjuelo River |  |
| 30 | 87 km | Táchira River |  |
| 30 |  | Uribante River | Brisbane River |
| 30 |  | Yurumanguí River |  |
| 29 | 10 km | San Francisco River (Bogotá) | Sao Francisco |
| 26 |  | Guapi River | Tapi (Thailand) |
| 25 |  | Ariguaní River | Araguari |
| 23 |  | Carare River |  |
| 23 |  | Río Pasto | Dong |
| 23 |  | Ubaté River |  |
| 22 |  | Cotuhé River |  |
| 22 |  | Guavio River |  |
| 22 |  | Torca River | Tuul |
| 21 | 1300 km | Ariporo River |  |
| 21 | 112 km | Coello River |  |
| 21 |  | Tuparro River |  |
| 20 |  | Samaná Norte River |  |
| 20 |  | Tarra River (Colombia) | Yarra River |
| 19 | 260 km | Cara Paraná River |  |
| 19 | 140 km | Guamués River |  |
| 19 |  | Lengupá River | Lena |
| 18 |  | Murrí River |  |
| 18 |  | Opon River |  |
| 18 |  | Sanquianga River |  |
| 17 |  | Cuiari River | Chari |
| 17 |  | Manacacías River |  |
| 16 | 770 km | Ajajú River |  |
| 16 |  | Cabrera River |  |
| 16 |  | Cravo Sur River |  |
| 16 |  | Upía River |  |
| 16 |  | Uvá River |  |
| 15 |  | Bojacá River | Bojana |
| 15 |  | Cravo Norte River |  |
| 15 |  | Cuja River |  |
| 15 |  | Guanía River |  |
| 15 |  | Metica River |  |
| 15 |  | Purui River | Purna |
| 15 |  | Sarare River |  |
| 15 | 170 km | Sardinata River |  |
| 15 |  | Subachoque River |  |
| 14 |  | Pauto River | Cauto |
| 14 |  | Tunía River | Tana River (Kenya) |
| 13 |  | Cusiana River | Susitna |
| 13 |  | Guachiría River | Ouachita |
| 13 |  | Güiza River |  |
| 12 |  | Atacuari River |  |
| 12 | 320 km | Miritiparaná River |  |
| 12 |  | Quebrada Limas |  |
| 11 |  | Batán River |  |
| 11 |  | Bodoquero River |  |
| 11 |  | Ceibas River |  |
| 11 |  | Telembí River |  |
| 10 |  | Iscuandé River | Cuando |
| 10 |  | Losada River |  |
| 10 |  | Papunáua River |  |
| 10 |  | Querary River | Murray |
| 10 |  | Salaqúí River | Saloum |
| 9 | 140 km | Aquio River |  |
| 9 |  | Leon River (Colombia) |  |
| 7 | 210 km | Mecaya River |  |

## What it says

- The bank's river coverage is "the big rivers of each country", not "the
  rivers of each country": the 22 present are the Magdalena/Cauca/Atrato tier
  and the Orinoco–Amazon tributaries; everything under ~250 views/mo is absent.
- The only misses a casual player would hit: **Caño Cristales** (2,283 views/mo —
  it would be the second-most-viewed Colombian river in the bank), **Catatumbo**
  (578), **Bogotá River** (213), **Sinú** (183), **Medellín River** (152).
- The 33 fuzzy traps are the same bug class the gameplay audit flagged
  (Gasherbrum→Masherbrum): "Sinú River"→Min (Sichuan), "Cesar River"→Bear,
  "Nechí River"→Neches, "Guainía River"→Gambia, "Tomo River"→Omo. Adding the
  rivers cures each one (an exact name beats a correction); the general cure
  would be a matcher change.
- The bank already holds 128 rivers at ≤30 views/mo (median 274), so the
  obscure end of this list is in house style; nothing here needs a new rule.
