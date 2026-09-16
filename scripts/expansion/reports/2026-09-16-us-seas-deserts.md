# United States × seas (bays, straits, sounds) and deserts — probes (2026-09-16)

Fifth and sixth chunks of the US scouring; both ran into the same wall.

## Seas — `probes/us-seas.json`

Sources: `Category:Bays / Straits / Sounds / Estuaries / Inlets / Lagoons /
Gulfs of the United States` down to the state level (96 categories, 821
pages) plus "List of bays of the United States" and the worldwide "List of
straits" / "List of gulfs". 951 articles read as a sea/bay/strait; **111
present, 652 US ones missing** — Pearl Harbor (17,107 views), New York
Harbor, the Golden Gate, the Straits of Mackinac, Deception Pass, Boston
Harbor, Cook Inlet, Jamaica Bay, Narragansett Bay, Pamlico Sound, Lituya
Bay, Arthur Kill, The Narrows, Bristol Bay, Mobile Bay, Penobscot, Buzzards,
Hanauma, Galveston, Elliott, Casco, Green Bay, Kill Van Kull, Suisun, San
Diego Bay, Humboldt, Tomales, Barnegat, Block Island Sound…

**Only 11 of the 652 carry an area figure** (Wikidata P2046 or an infobox
`area`); the schema (SPEC §4: `size > 0`) and the sourced-figure rule keep
the rest out. **`84b20b9` added the eight sized US ones** (Biscayne Bay —
also a fuzzy trap, it corrected to the Bay of Biscay — Gulf of Maine, Cape
Cod Bay, Matagorda, Aransas, San Antonio, Neah and Birch Bays) and
re-pointed **San Francisco Bay**, which scored on the article for the
San Francisco–Oakland Bay Bridge.

Also found, not acted on: the worldwide strait/gulf lists surfaced ~180
non-US straits and gulfs missing from the bank (Danish Straits → "Davis
Strait", Cabot Strait → "Cook Strait", Tablas, Ombai, Kara, Lembeh, Chios,
Basilan… Gulf of Fonseca, Peter the Great Gulf, Foxe Basin, Gulf of Nicoya,
San Jorge Gulf, Frozen Strait have figures). They belong to their own
countries' waves. "East Bay" typed on a sea round lands on the Sea of Japan
(alias "East Sea", loose form "east") — a pre-existing quirk.

## Deserts — `probes/us-deserts.json`

`Category:Deserts of the United States` + "List of North American
deserts" + "List of deserts by area": 132 articles, **82 present**, 48
missing of which 12 are American (Jornada del Muerto 1,826 views, Kaʻū
Desert, Yuha Desert — a trap onto the Yuma Desert — Tonopah, Lechuguilla,
Tule ×2, Carson, Delamar Flat, Bonneville Salt Flats, High Desert, Low
Desert). **Two have an area** and went in (`ae834a6`): Bonneville Salt Flats
(104 km²) and the Carson Desert (5,568 km²). The rest wait on the same
decision.

## The decision (for the user)

Allow **`size: 0` (or `null`) = "size unknown"** for entries whose article
has no figure. `satisfiesSize` in `promptBank.js` already returns false for
a non-positive size, so such an entry simply never answers a size prompt
(and no bay could reach the sea thresholds of 100,000 / 1,000,000 km²
anyway); nothing in the UI shows `size`. Cost: an amendment to SPEC §4 and
`validate-data.mjs` (`size >= 0`), plus `fold.mjs` accepting `0`. Gain:
~640 US bays/straits/sounds, ~1,100 US islands (`reports/2026-09-16-us-islands.md`),
10 US deserts, and the same class in every later country.
