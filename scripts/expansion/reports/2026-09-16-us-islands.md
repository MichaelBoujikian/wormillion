# United States × islands — coverage probe and fill (2026-09-16)

Fourth chunk of the US scouring. Sources: `Category:Islands of the United
States by state` down to the county level, plus 25 list pages ("List of
islands of the United States", the state lists, the Midwest list, "Sea
Islands"). **Floor 1 km²**, Wikidata P2046 then the infobox (`area_km2`,
`area_acre`, `area_ha`, the settlement infobox's `area_total_sq_mi`…);
**1,000+ views/mo lifts an island back in**. Config `probes/us-islands.json`.

## Outcome (same day)

- **`5b80690` — 249 rows**: 232 islands ≥ 1 km² plus 17 famous small ones
  (Hart Island 8,341 views, Pollepel, Necker, Machias Seal, Gardner
  Pinnacles, Tern, Kaʻula, U Thant Island at 0.01 km²…). Fuzzy traps fixed:
  San Nicolas → São Nicolau, Wrangell → Wrangel, Sugar → Sagar, Anderson →
  Henderson, Great Sitkin → Great Britain, Agattu → Agatti, Amlia → Amelia.
  19 ocean overrides for articles without coordinates; 29 rows
  `WIKI_VERIFIED`.
- **`6948714` — 69 more**, after a probe change: the first pass vetoed
  descriptions like "Town in South Carolina", but for islands the town and
  the island share one article (Fishers Island 5,784 views, Shelter Island,
  Dauphin, Sullivan's, Pawleys, Smith Island MD, Bald Head, Edisto, Peaks,
  Chebeague, Swan's, Star and Palm Islands in Miami Beach, Yerba Buena,
  Parris Island…). `notKindExemptTitle` lifts the veto when the title says
  Island / Isle / Key; 35 such rows `WIKI_VERIFIED`.
- Island cohort 1,663 (was 1,345). `gap-check` pins 19.

## Counts

| | |
|---|---|
| island articles under the state categories + lists | **1,803** |
| in the bank before | 85 (349 after the first chunk, counting namesakes) |
| ≥ 1 km² and missing or fuzzy, both passes | 375 → 318 folded (Long Island ME, Treasure Island FL, Dauphin, Washington, Belle Isle, Stuart, Egg, Plum lost to namesakes) |
| under 1 km², not famous | 197 |
| **no area anywhere** | **1,119** — infobox `area_km2` left blank, or no infobox at all (453) |
| name taken | 28 (Rhode Island → Aquidneck, correctly; Prince of Wales Island (Alaska, 6,675 km², the 4th-largest US island) → Nunavut's; San Juan Island → San Juan Islands; Saint Helena Island SC → Saint Helena) |

## Left out on purpose

Groups and chains (Pribilof, Rat, Near, Andreanof, Shumagin, Semidi, Maug,
Fox, Northwestern Hawaiian, Ten Thousand Islands, Muscle Ridge, Walrus,
Goodwin); protected areas (Apostle Islands National Lakeshore, Gulf Islands
and Fire Island National Seashores, San Juan Islands National Monument,
Papahānaumokuākea, Grand Island NRA, Howell Island, Rock Island State
Park); Little Island at Pier 55 (a park on piles), Castle Island (a
peninsula since 1928), McKissick Island (former), Rincon Island (an oil
platform, 0 km²), Tiverton RI and Kodiak Island Borough (the state / the
borough), Island Pond (a lake), Bair and Winter Islands (marshes).

## Judgment calls left for a human

- **1,119 US islands have no area figure anywhere.** Many are well known
  (Chincoteague, Isle au Haut, Vinalhaven, Daufuskie, the Farallons, Isle
  of Palms, Kiawah's neighbours…). `validate` requires `size > 0`, so the
  sourced-figure rule leaves them out. Allowing `size: 0` = "unknown"
  (`satisfiesSize` already treats a non-positive size as never matching a
  size prompt) would admit them without inventing a figure — a schema
  decision (SPEC §4).
- **Prince of Wales Island (Alaska)** is the biggest real omission: the
  bare name belongs to Nunavut's (33,339 km², 1,000 views) and Alaska's has
  3,744. The standing name-taken rule.
- "Rhode Island" typed on an island round lands on Aquidneck Island — right,
  and a nice trick answer.
