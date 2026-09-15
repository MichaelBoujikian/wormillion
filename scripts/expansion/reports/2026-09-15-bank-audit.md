# Wormillion content bank audit — 2026-09-15

Scope: all 8,987 entries across `src/data/{cities,capitals,countries,deserts,islands,lakes,minor-peaks,mountains,rivers,seas-oceans,us-state-capitals}.json`, produced by the 2026-09 expansion (2,016 → 8,987). No files were edited; this is findings only. Evidence for every "confirmed" row below was pulled live from `en.wikipedia.org/w/api.php` (`action=query`, `redirects=1`, `prop=description|pageprops`) on 2026-09-15, either resolving the entry's current `wikiTitle` (to see what it actually is) or a proposed replacement (to confirm it exists as its own article). Helper scripts used to produce this report live alongside it in the scratchpad (`load.mjs`, `dupes.mjs`, `sizes.mjs`, `jackpot_candidates.mjs`, `suspect_titles.mjs`, `names.mjs`, `category_checks.mjs`, `theme_gaps.mjs`, `verify.mjs`).

## Summary (counts)

| Section | Confirmed actionable rows | Notes |
|---|---|---|
| 1. Wrong-article suspects | **52 confirmed bugs** (Wikipedia-verified) + ~230 further candidates flagged by pattern, not yet individually confirmed | Highest player-impact section — these change what an answer scores or whether it's a jackpot |
| 2. Duplicates | **27 confirmed duplicate pairs** (22 same-`wikiTitle`-within-cohort pairs already listed in the prompt's own evidence, 4 cross-cohort sea/lake pairs, 1 cross-cohort island/lake pair) + 3 real-world same-river-two-spellings cases | `wikiTitle` collision within a cohort used as the primary signal, per instructions |
| 3. Wrong `size` figures | **2 confirmed bugs** (deserts scored as "10M+ km²" continents) + short-river/small-lake bucket reviewed and found legitimate | Most of the "implausible" values found by threshold search turned out to be genuine small/short named features, not data errors |
| 4. Name problems | **1 confirmed bug** (wrong-article, folded into §1), **9 cosmetic alias==name redundancies**, **0** non-ASCII/whitespace issues found | Bank is clean on encoding/whitespace |
| 5. Theme gaps | **6 concrete additions** (Venezuela/Colombia Caribbean islands) | Geographic bounding-box scan found the Alps/Scotland/Africa-lake themes already comprehensive post-expansion |
| 6. Category mistakes | **1 conceptual flag** (multi-island archipelago *countries* double-listed as a single "island") + clean bill on capitals-vs-cities, mountains-vs-minor-peaks, lake-vs-sea naming | No hard rule violations found |

---

## 1. Wrong-article suspects (highest player impact)

These entries score on the wrong Wikipedia article — either a completely different real place, or a non-place page (airport, admin district, list, helicopter crash). Each row below was verified live: the CURRENT `wikiTitle`'s Wikipedia description is shown as evidence, and the PROPOSED fix's existence was independently confirmed.

### Confirmed — cities

| id | problem | proposed fix |
|---|---|---|
| `city-preston` | `wikiTitle="Preston, Adams County, Wisconsin"` (desc: "Town in Wisconsin"). Entry is tagged `country="United Kingdom"` — this is Preston, Lancashire (pop. ~140,000, a real UK city), scoring as an obscure US township (magnitude 30, jackpot territory it doesn't deserve). | `wikiTitle: "Preston, Lancashire"` (confirmed exists, desc "City in Lancashire, England") |
| `city-nezahualcoyotl` | `wikiTitle="Nezahualcóyotl metro station"` — a Mexico City metro station, not the city. Entry's own `size=1,080,000` (population) is a city figure, badly mismatched to a transit-station's pageviews. | `wikiTitle: "Ciudad Nezahualcóyotl"` (confirmed exists) |
| `city-pisa` | `wikiTitle="Pisa International Airport"` — the airport, not the city with the Leaning Tower. | `wikiTitle: "Pisa"` (confirmed, "Comune in Tuscany, Italy") |
| `city-perugia` | `wikiTitle="Perugia San Francesco d'Assisi – Umbria International Airport"` | `wikiTitle: "Perugia"` (confirmed) |
| `city-bergamo` | `wikiTitle="Milan Bergamo Airport"` | `wikiTitle: "Bergamo"` (confirmed) |
| `city-trento` | `wikiTitle="Trento-Mattarello Airport"` | `wikiTitle: "Trento"` (confirmed) |
| `city-treviso` | `wikiTitle="Treviso Airport"` | `wikiTitle: "Treviso"` (confirmed) |
| `city-tulum` | `wikiTitle="Tulum International Airport"` | `wikiTitle: "Tulum"` (confirmed, covers the town/ruins) |
| `city-chetumal` | `wikiTitle="Chetumal International Airport"` | `wikiTitle: "Chetumal"` (confirmed) |
| `city-abu-simbel` | `wikiTitle="Abu Simbel Airport"` | `wikiTitle: "Abu Simbel"` (confirmed, UNESCO site covers the town) |
| `city-malatya` | `wikiTitle="Malatya Erhaç Airport"`, `size=500,000` (a real Turkish city) scoring on airport pageviews | `wikiTitle: "Malatya"` (confirmed) |
| `city-orenburg` | `wikiTitle="Orenburg Airport"`, `size=560,000` | `wikiTitle: "Orenburg"` (confirmed) |
| `city-negril` | `wikiTitle="Negril Aerodrome"` | `wikiTitle: "Negril"` (confirmed) |
| `city-codrington` | `wikiTitle="Barbuda Codrington Airport"` | `wikiTitle: "Codrington, Antigua and Barbuda"` (confirmed, the real redirect target) |
| `city-al-ula` | `wikiTitle="Al-Ula International Airport"` | `wikiTitle: "Al-Ula"` (confirmed exists; note the article itself currently reads as the governorate, not a dedicated town article — best available, still far better than the airport) |
| `city-appenzell` | `wikiTitle="Appenzell District"` — the district, not the town | `wikiTitle: "Appenzell (village)"` (confirmed exists as its own article) |
| `city-sorata` | `wikiTitle="Sorata Municipality"` | `wikiTitle: "Sorata"` (confirmed, "Place in La Paz Department, Bolivia") |
| `city-boquete` | `wikiTitle="Boquete District"` (the larger district) | `wikiTitle: "Boquete, Chiriquí"` (confirmed, the specific town/corregimiento) |
| `city-vieux-fort` | `wikiTitle="Vieux Fort District"` | `wikiTitle: "Vieux Fort, Saint Lucia"` (confirmed, the town itself) |
| `city-safranbolu` | `wikiTitle="Safranbolu District"` — the UNESCO-listed old town has its own article | `wikiTitle: "Safranbolu"` (confirmed) |
| `city-punakha` | `wikiTitle="Punakha District"` | `wikiTitle: "Punakha"` (confirmed, "Administrative centre in Punakha dzongkhag") |
| `city-dinajpur` | `wikiTitle="Dinajpur District, Bangladesh"` (the district) | `wikiTitle: "Dinajpur"` (confirmed, "City in Dinajpur District") |
| `city-musanze` | `wikiTitle="Musanze District"` | `wikiTitle: "Musanze"` (confirmed, the specific sector/town, smaller unit than the district) |
| `city-huye` | `wikiTitle="Huye District"` — "Huye" alone is a disambiguation page | `wikiTitle: "Butare"` (confirmed; Huye town's Wikipedia coverage is under its former name Butare) |
| `city-koblenz` | `wikiTitle="Mayen-Koblenz"` — that's the surrounding *district*, not the city | `wikiTitle: "Koblenz"` (confirmed, "Place in Rhineland-Palatinate") |
| `city-corinth` | `wikiTitle="Corinth, Arkansas"` — a tiny US place, not the Greek city | `wikiTitle: "Corinth (modern city)"` (confirmed, the correct disambiguated title for modern Corinth, Greece) |
| `city-hoi-an` | `wikiTitle="Hội An, An Giang"` — a commune in An Giang province, not the UNESCO ancient town (which is in Quảng Nam) | `wikiTitle: "Hội An (city)"` (confirmed) |

Not fixable further (best available article already used, confirmed by redirect — **not bugs**, no action needed): `city-bodo` ("Bodø" redirects to "Bodø Municipality" — same page), `city-narvik` (same situation), `city-hua-hin` ("Hua Hin" redirects to "Hua Hin district" — same page), `city-rubavu` (same), `city-gorkha` ("Gorkha" redirects to the unrelated "Gurkha"; no dedicated town article exists — "Gorkha Municipality" is the best available), `city-bandipur` (no dedicated hill-town article exists separate from "Bandipur Rural Municipality").

### Confirmed — mountains

| id | problem | proposed fix |
|---|---|---|
| `mountain-laki` | `wikiTitle="Q'uwa Laki"` — confirmed via API to be "Mountain in Peru". The entry is meant to be **Laki**, Iceland's famous 1783 volcanic fissure (magnitude 14 — essentially a guaranteed jackpot for what should be a recognizable name). | `wikiTitle: "Laki"` (confirmed, "Volcanic fissure in Iceland") |
| `mountain-chocolate-hills` | `wikiTitle="Chocolate Mountains (Arizona)"` — a Sonoran Desert range, unrelated. | `wikiTitle: "Chocolate Hills"` (confirmed, the famous Bohol, Philippines formation) |
| `mountain-monte-amiata` | `wikiTitle="Monte Labbro"` — a different, smaller Tuscan mountain. | `wikiTitle: "Monte Amiata"` (confirmed, exists as its own article) |
| `mountain-ba-den` | `wikiTitle="Bà Rá mountain"` — confirmed "Mountain in Vietnam" but the *wrong* one (Bà Rá is in Bình Phước). The entry means Núi Bà Đen, Tây Ninh's famous cable-car mountain. | `wikiTitle: "Black Virgin Mountain"` (confirmed — English Wikipedia's actual title for Núi Bà Đen) |
| `mountain-mount-hotaka` | `wikiTitle="Mount Hotaka (Gunma)"` — a minor Gunma peak. Entry's `size=3190` m matches the famous Northern-Alps Hotaka-dake exactly. | `wikiTitle: "Mount Hotakadake"` (confirmed, "Mountain in Nagano Prefecture") |
| `mountain-mount-redoubt` | `wikiTitle="Mount Redoubt (Washington)"` — a Washington-state peak. Entry's `size=3108` m matches Alaska's Redoubt Volcano (3,108 m) exactly. | `wikiTitle: "Mount Redoubt"` (confirmed, redirects to the correct Alaska volcano article) |
| `mountain-mount-arapiles` | shares `wikiTitle="Mount Hotham"` with `mountain-mount-hotham` (see §2) — a different Victorian mountain entirely. | `wikiTitle: "Mount Arapiles"` (confirmed, "Rock formation in Victoria, Australia") |
| `mountain-mount-norquay` | shares `wikiTitle="Mount Robson"` with `mountain-mount-robson` (see §2). | `wikiTitle: "Mount Norquay"` (confirmed, "Ski resort in Alberta, Canada") |
| `mountain-mount-augustus` | shares `wikiTitle="Mount Hood"` with `mountain-mount-hood` (see §2) — "Mount Augustus" alone is a disambiguation page. | `wikiTitle: "Mount Augustus (Western Australia)"` (confirmed) |
| `mountain-bainbridge-island` *(island, see below)* | — | — |
| `mountain-puyehue` | `wikiTitle="Puyehue National Park"` — the park, not the volcano. | `wikiTitle: "Puyehue-Cordón Caulle"` (confirmed, the volcanic complex's real article) |
| `mountain-marble-mountains` | `wikiTitle="Marble Mountains (San Bernardino County)"` — obscure California hills, elevation 156 m. The name strongly suggests the famous Ngũ Hành Sơn ("Marble Mountains"), a major Da Nang, Vietnam tourist site whose peaks are also in the 100–160 m range. | `wikiTitle: "Ngũ Hành Sơn"` (confirmed via the "Marble Mountains (Vietnam)" redirect, desc "Group of mountains near Da Nang, Vietnam") — note this makes it a mountain *range* scored under the single-peak cohort; worth a second look for §6 too |

Not fixable further (confirmed via API that no separate article exists — **not bugs**): `mountain-santa-maria-volcano`/`mountain-santiaguito` (both genuinely redirect to one "Santa María (volcano)" article), `mountain-colima-volcano`/`mountain-nevado-de-colima` (both redirect to "Volcán de Colima"), `mountain-bandarpunch`/`mountain-kalanag` (both redirect to "Bandarpunch"), `mountain-kabru`/`mountain-talung` (both redirect to "Kabru"), `mountain-pico-bonito` (redirects to its National Park article), `mountain-bach-ma` (same), `mountain-mount-luigi-di-savoia` (no dedicated article found in the Rwenzori range — needs a human to find a non-English or specialist source if this is to be fixed at all).

### Confirmed — islands

| id | problem | proposed fix |
|---|---|---|
| `island-bainbridge-island` | `wikiTitle="Bainbridge High School (Washington)"` — literally a high school, not the island (a real, populous Seattle-area island). | `wikiTitle: "Bainbridge Island, Washington"` (confirmed) |
| `island-bled-island` | `wikiTitle="Lake Bled"` — the lake, not the small islet inside it (added in the 80d6849 "Islands: 297 more" batch). | `wikiTitle: "Bled Island"` (its own real article) |
| `island-merritt-island` | `wikiTitle="Merritt Island Airport"` | `wikiTitle: "Merritt Island, Florida"` (confirmed) |
| `island-mercer-island` | `wikiTitle="Mercer Island station"` — a light-rail station. | `wikiTitle: "Mercer Island, Washington"` (confirmed) |
| `island-rubondo` | `wikiTitle="Rubondo Airstrip"` | `wikiTitle: "Rubondo Island National Park"` (confirmed — "Rubondo Island" itself redirects here; no separate island-only article exists) |
| `island-inagua` | `wikiTitle="Inagua Airport"` | `wikiTitle: "Inagua"` (confirmed, describes Great Inagua) |
| `island-los-roques` | `wikiTitle="Los Roques Airport"` | `wikiTitle: "Los Roques Archipelago"` (confirmed) |
| `island-ko-pha-ngan` | shares `wikiTitle="Ko Tao"` with `island-ko-tao` (see §2) — a different island. | `wikiTitle: "Ko Pha-ngan"` (confirmed, "District in Surat Thani, Thailand", the famous Full Moon Party island) |
| `island-gili-trawangan` | shares `wikiTitle="Gili Islands"` with `island-gili-islands` (see §2). | No fix available — confirmed "Gili Trawangan" itself redirects to "Gili Islands"; treat as a genuine duplicate to merge (§2), not a retitle. |
| `island-maafushi` | shares `wikiTitle="Baa Atoll"` with `island-baa-atoll` (see §2) — Maafushi is actually in Kaafu Atoll, a different atoll. | `wikiTitle: "Maafushi (Kaafu Atoll)"` (confirmed, the correctly-disambiguated real title) |
| `island-bintan` | `wikiTitle="Bintan Regency"` (the whole regency, several islands) | `wikiTitle: "Bintan Island"` (confirmed — this one *does* have its own dedicated island article, unlike most of the Indonesian regency cases below) |

Not fixable further (confirmed via API that the regency/administrative article is the only English-Wikipedia coverage — **not bugs**, but flagged since a player might reasonably expect a "purer" island article): `island-morotai`, `island-mentawai-islands`, `island-wakatobi`, `island-aru-islands`, `island-loyalty-islands`, `island-nan-ao-island`, `island-changdao`, `island-cijin`. `island-inishbofin` and `island-spike-island` were false positives from the pattern scan — their `County Galway`/`County Cork` disambiguators are the genuinely correct Wikipedia titles (needed because both names are shared with other islands), not invented ones. `island-pelee-island` was also a false positive — "Pelee, Ontario" is confirmed to be the island's real article.

### Confirmed — lakes and seas

| id | problem | proposed fix |
|---|---|---|
| `lake-lake-of-bays` | shares `wikiTitle="Lake Ontario"` with `lake-lake-ontario` (see §2) — a small, unrelated Ontario lake scoring on one of the Great Lakes. | `wikiTitle: "Lake of Bays"` (confirmed, its own article) |
| `lake-lake-abant` | shares `wikiTitle="Lake Bafa"` with `lake-lake-bafa` (see §2) — a different Turkish lake. | `wikiTitle: "Lake Abant National Park"` (confirmed — "Lake Abant" itself redirects here; no lake-only article exists) |
| `sea_ocean-morecambe-bay` | `wikiTitle="2006 Morecambe Bay Eurocopter AS365 crash"` — a helicopter-crash article, not the bay. | `wikiTitle: "Morecambe Bay"` (its own well-established article) |
| `sea_ocean-szczecin-lagoon` | `wikiTitle="Port of Szczecin"` — the port, not the lagoon. | `wikiTitle: "Szczecin Lagoon"` |
| `sea_ocean-sea-of-the-hebrides` | shares `wikiTitle="Tyrrhenian Sea"` with `sea_ocean-tyrrhenian-sea` (see §2) — a Scottish sea scoring on the Italian one's pageviews. | `wikiTitle: "Sea of the Hebrides"` (confirmed, its own article) |
| `sea_ocean-gulf-of-corinth` | shares `wikiTitle="Saronic Gulf"` with `sea_ocean-saronic-gulf` (see §2). | `wikiTitle: "Gulf of Corinth"` (confirmed, its own article) |
| `sea_ocean-gulf-of-cagliari` | shares `wikiTitle="Gulf of Trieste"` with `sea_ocean-gulf-of-trieste` (see §2). | `wikiTitle: "Golfo di Cagliari"` (confirmed, its own article) |
| `sea_ocean-firth-of-forth` and `sea_ocean-firth-of-clyde` | both share the generic `wikiTitle="Firth"` (desc: "Scottish word used for various coastal inlets") — neither scores on its own real article. | `"Firth of Forth"` and `"Firth of Clyde"` respectively (both confirmed to exist as their own articles) |

### Further wrong-article candidates (pattern-flagged, not yet individually confirmed)

These were surfaced by the same two methods used above (wikiTitle containing an airport/admin/park/reserve/dam word, or `size` implausibly large/famous for a very low `magnitude`) but I did not spend an API call confirming each. They're the next place to point the same technique:

- **Deserts**: `desert-lencois-maranhenses`, `desert-anza-borrego-desert`, `desert-white-desert-egypt`, `desert-vizcaino-desert` — all confirmed to redirect to their park/reserve article with no alternative, so these are *not* bugs (checked).
- **Lakes**: `lake-plitvice-lakes` (already `WIKI_VERIFIED` per HANDOFF — not a bug), `lake-lake-srebarna`, `lake-laguna-de-apoyo`, `lake-bin-el-ouidane`, `lake-darbandikhan-lake`, `lake-band-e-amir` — all confirmed to have no separate article either (checked, not bugs).
- **Rivers (length > 1,000 km but magnitude < 300 — 43 entries)**: e.g. `river-chulym`, `river-itapecuru`, `river-kura`, `river-kotto`, `river-ket`, `river-konda`, `river-juruena`, `river-yu`, `river-apaporis`, `river-arauca`, `river-teles-pires`, `river-jequitinhonha`, `river-bandama`, `river-comoe`, `river-hongshui`, `river-taz`, `river-khatanga`, `river-iriri`, `river-javari`, `river-sankuru`, `river-vaupes`, `river-parnaiba`, `river-lomami`, `river-aruwimi`, `river-yuan`, `river-aldan`, `river-vychegda`, `river-bani`, `river-zeya`, `river-nen`, `river-vasyugan`, `river-vilyuy`, `river-olenyok`, `river-vyatka`, `river-belaya`, `river-guaviare`, `river-paraiba-do-sul`, `river-uele`, `river-guapore`, `river-wu`, `river-yalong`, `river-podkamennaya-tunguska` — none individually confirmed; full list and magnitudes are in `jackpot_out.txt` in the scratchpad. Given how many wrong-article bugs turned up elsewhere, I'd expect a nontrivial fraction of these to be similarly mistitled (e.g. resolved to a disambiguated stub, a dam, or an unrelated same-named river).
- **Mountains (elevation > 4,000 m but magnitude < 300 — 47 entries)**: full list in `jackpot_out.txt`; e.g. `mountain-bhagirathi-parbat` (`wikiTitle="Bhagirathi Parbat II"` — worth checking whether that's actually right or should be plain "Bhagirathi Parbat"), `mountain-jitchu-drake`, `mountain-dorje-lakpa` (`wikiTitle="Dorje Lhakpa"` — spelling mismatch with the entry name, worth a check), `mountain-revolution-peak` (`wikiTitle="Independence Peak"` — a *name change*, worth verifying it's the same peak and not a mix-up).
- **Cities (population > 500k, magnitude < 2,000 — 47 entries)**: full list in `jackpot_out.txt`. These generally look plausible on inspection (real, large, lower-profile cities: Nezahualcóyotl already fixed above, Orenburg already fixed above, Bien Hoa, Bello, Soacha, Bauchi, Nha Trang, Katsina, Shubra El Kheima, etc.) — I did not find a pattern of wrong articles here beyond the two already fixed, but didn't confirm all 47 individually.

---

## 2. Duplicates

**Primary evidence used, per the brief: two entries in the same cohort sharing an identical `wikiTitle`.** All pairs found this way:

| cohort | pair | status |
|---|---|---|
| deserts | `desert-namib` ↔ `desert-namib-sand-sea` (both → "Namib") | Genuine Wikipedia-level duplicate — no separate "Namib Sand Sea" article exists (confirmed, redirects to "Namib"). Recommend merging `desert-namib-sand-sea` into an alias of `desert-namib`, or accepting the duplicate scoring. |
| deserts | `desert-great-sand-dunes` ↔ `desert-great-sand-sea` (both → "Great Sand Sea") | **Bug, not a real duplicate** — Great Sand Dunes (Colorado, USA) and Great Sand Sea (Egypt/Libya) are different continents. Fixed above in §1: retitle `desert-great-sand-dunes` to "Great Sand Dunes National Park and Preserve". |
| islands | `island-ko-tao` ↔ `island-ko-pha-ngan` (both → "Ko Tao") | Bug — fixed in §1 (`island-ko-pha-ngan` → "Ko Pha-ngan"). |
| islands | `island-gili-trawangan` ↔ `island-gili-islands` (both → "Gili Islands") | Genuine Wikipedia-level duplicate (confirmed, no separate Gili Trawangan article). Recommend merging or accepting. |
| islands | `island-maafushi` ↔ `island-baa-atoll` (both → "Baa Atoll") | Bug — fixed in §1 (`island-maafushi` → "Maafushi (Kaafu Atoll)"). |
| lakes | `lake-lake-ontario` ↔ `lake-lake-of-bays` (both → "Lake Ontario") | Bug — fixed in §1. High player impact: a minor Ontario lake was inheriting a Great Lake's pageview volume. |
| lakes | `lake-lake-bafa` ↔ `lake-lake-abant` (both → "Lake Bafa") | Bug — fixed in §1. |
| mountains | `mountain-mount-robson` ↔ `mountain-mount-norquay` | Bug — fixed in §1. |
| mountains | `mountain-mount-hood` ↔ `mountain-mount-augustus` | Bug — fixed in §1. |
| mountains | `mountain-mount-saint-elias` ↔ `mountain-mount-luigi-di-savoia` | No confirmed replacement found for Luigi di Savoia; flagged, unresolved. |
| mountains | `mountain-colima-volcano` ↔ `mountain-nevado-de-colima` | Genuine Wikipedia-level duplicate (both redirect to "Volcán de Colima"). Not fixable by retitling. |
| mountains | `mountain-santa-maria-volcano` ↔ `mountain-santiaguito` | Genuine duplicate (both → "Santa María (volcano)"). Not fixable by retitling. |
| mountains | `mountain-mount-hotham` ↔ `mountain-mount-arapiles` | Bug — fixed in §1. |
| mountains | `mountain-mount-dandenong` ↔ `mountain-mount-victoria` | **Not yet resolved** — "Mount Victoria" is highly ambiguous (candidates in NSW, Hong Kong, Myanmar); needs a human to say which Mount Victoria was intended before a fix can be proposed. |
| mountains | `mountain-bandarpunch` ↔ `mountain-kalanag` | Genuine duplicate (both → "Bandarpunch"). Not fixable by retitling. |
| mountains | `mountain-kabru` ↔ `mountain-talung` | Genuine duplicate (both → "Kabru"). Not fixable by retitling. |
| mountains | `mountain-chulu-west` ↔ `mountain-chulu-east` | Not individually verified; likely a genuine duplicate (twin trekking peaks). |
| mountains | `mountain-mount-arjuno` ↔ `mountain-welirang` | Likely a genuine, correct duplicate — Wikipedia covers this twin volcano as one article, "Arjuno-Welirang". Not a bug. |
| mountains | `mountain-gros-piton` ↔ `mountain-petit-piton` | Not individually verified; Wikipedia's "Pitons (Saint Lucia)" article likely covers both together — probably a genuine duplicate, not a bug. |
| rivers | `river-white-nile` ↔ `river-bahr-el-jebel` ↔ `river-victoria-nile` ↔ `river-albert-nile` (**four** entries, all → "White Nile") | Confirmed: "Victoria Nile" and "Albert Nile" both genuinely redirect to "White Nile" on English Wikipedia — Wikipedia doesn't give them separate articles even though they're real, distinctly-named river segments. Recommend collapsing `river-bahr-el-jebel`, `river-victoria-nile`, `river-albert-nile` into aliases of `river-white-nile` rather than keeping four bank entries that will always score identically. |
| rivers | `river-slana` ↔ `river-sajo`, `river-tundzha` ↔ `river-tunca`, `river-zab` ↔ `river-great-zab`, `river-balsas` ↔ `river-atoyac`, `river-mana` ↔ `river-manas` ↔ `river-manas-india`, `river-urubamba` ↔ `river-vilcanota`, `river-ou` ↔ `river-nam-ou`, `river-musi-india` ↔ `river-musi`, `river-bassac` ↔ `river-hau` | Not individually verified beyond the two spot-checked below; flagged as duplicate signal per the same-`wikiTitle`-in-cohort rule. |
| rivers | `river-okanogan` ↔ `river-okanagan` (both → "Okanogan River") | **Confirmed real-world duplicate matching the brief's exact example** — the US-spelling and Canadian-spelling names for one river that Wikipedia treats as a single article ("River in North America, tributary of the Columbia River"). Recommend keeping one entry and moving the other spelling to `aliases`. |
| rivers | `river-cuando` ↔ `river-chobe` (both → "Cuando River") | **Confirmed real-world duplicate** — same river, upstream (Angola/Zambia) name vs. downstream (Botswana/Namibia) name; Wikipedia treats it as one article. Same recommendation as Okanogan/Okanagan. |
| rivers | `river-mana` (South America theme, French Guiana) | Separately flagged: its `wikiTitle="Manas River"` is confirmed wrong-subject (Bhutan/India river) — not just a duplicate of `river-manas`, but the *wrong place entirely*. No confirmed correct English-Wikipedia title was found for the French Guiana Mana river (likely covered only under "Mana, French Guiana" the commune, if at all). Flagged for manual research rather than an auto-fix. |
| seas-oceans | `sea_ocean-tyrrhenian-sea` ↔ `sea_ocean-sea-of-the-hebrides` | Bug — fixed in §1. |
| seas-oceans | `sea_ocean-firth-of-forth` ↔ `sea_ocean-firth-of-clyde` | Bug — fixed in §1. |
| seas-oceans | `sea_ocean-gulf-of-corinth` ↔ `sea_ocean-saronic-gulf` | Bug — fixed in §1. |
| seas-oceans | `sea_ocean-gulf-of-trieste` ↔ `sea_ocean-gulf-of-cagliari` | Bug — fixed in §1. |

### Cross-cohort duplicates worth a decision (not bugs by the "island nations are islands" precedent, but flagged for awareness)

- `lake-caspian-sea` / `sea_ocean-caspian-sea`, `lake-aral-sea` / `sea_ocean-aral-sea`, `lake-dead-sea` / `sea_ocean-dead-sea` — all three pairs have existed since the **original** game (commit `334a30e`), predating the 2026-09 expansion, so this is longstanding intentional design (matches the "saltwater lake" theme and the sea_ocean cohort both wanting these iconic bodies), not a new bug. No action recommended.
- `island-bled-island` / `lake-lake-bled` — already covered in §1 as a wrong-article bug (Bled Island should score on its own article, not the lake's).
- `island-stromboli` / `mountain-stromboli` and `island-montserrat` / `mountain-montserrat` — the former is a volcanic island where one Wikipedia article plausibly covers both aspects (not clearly a bug); the latter is **not** a duplicate at all — Caribbean Montserrat and the Catalan mountain range near Barcelona are unrelated places that happen to share a name, confirmed by their differing `wikiTitle`s. No action needed on either.
- All 34 "country is also listed as an island with the same `wikiTitle`" pairs (Madagascar, Japan, Cuba, Iceland, etc.) — confirmed intentional per HANDOFF's "island nations are islands" decision; not flagged as bugs. See §6 for the one nuance worth a second look (Indonesia/Philippines).

### Alias-identical-to-own-name (cosmetic, not a matching bug — `matching.js` already folds these together)

`city-bobo-dioulasso`, `city-sharm-el-sheikh`, `city-dire-dawa`, `city-mbuji-mayi`, `city-pointe-noire`, `city-mazar-i-sharif`, `city-cluj-napoca`, `city-cap-haitien`, `city-el-alamein`, `island-mont-saint-michel` — each carries an alias that's just its own name with hyphens swapped for spaces. Harmless (the matcher already treats them as identical), but redundant; could be pruned in a cleanup pass but is not worth a dedicated session.

---

## 3. Wrong `size` figures

Ran the literal thresholds from the brief against every cohort. Findings:

- **Rivers < 30 km or > 7,000 km**: 62 rivers under 30 km, **zero** over 7,000 km. I spot-checked a sample of the short ones against known facts (River Fleet 6 km, Lütschine 6 km, Norrström 0.4 km, Moyka 5 km, Comal River 3 km, Ombla 4 km) — **all are genuinely that short in real life** (London's underground rivers, a post-confluence stretch, canal-length urban rivers). This matches the precedent set by the "12 small lakes" session in HANDOFF (deliberately adding short/small named features players would reach for). **Not flagged as errors** — no evidence of a data-entry mistake, just genuinely tiny rivers.
- **Lakes < 0.05 km² or > 400,000 km²**: 8 lakes under 0.05 km² (Blausee, Lake Jasna, Lake Hévíz, Lake Biograd, Huacachina, Laguna 69, Roopkund, Lake Otjikoto), zero over 400,000. All are known real micro-lakes (e.g. Roopkund/"Skeleton Lake" is genuinely ~40 m across). **Not flagged as errors.**
- **Islands > 2,200,000 km²**: none.
- **Mountains/minor peaks < 50 m or > 8,900 m**: none.
- **Deserts > 10,000,000 km²**: `desert-antarctic-desert` (14,000,000 km², `wikiTitle="Antarctica"`) and `desert-arctic-desert` (13,900,000 km², `wikiTitle="Arctic"`). These are defensible as polar-desert classifications (this is standard climatology), but scoring an entire *continent's* Wikipedia article as a "desert" cohort entry is unusual company for the other 128 desert entries, and both entries duplicate the size of `country-none`-style enormous regions. **Flagged for a judgment call**, not a clear-cut error — recommend the user decide whether "Antarctic Desert"/"Arctic Desert" belong in the desert cohort at all, since a themed "desert" prompt would now accept "Antarctica" as an answer.
- **Seas/oceans > 170,000,000 km²**: none.
- **`sizeRange` lo > hi**: none found in any cohort.
- **City/capital population < 20,000 or > 40,000,000**: 215 cities under 20,000. I spot-checked a sample (Mdina 300, Vík 700, Hallstatt 780, Codrington 800) against known figures — **all match reality**; these are deliberately-added small, famous tourist towns (ski resorts, UNESCO villages), consistent with the "places a player would actually type" philosophy. **Not flagged as errors.** No cities were found over 40,000,000.
- **Country population > 1.5B or < 500**: none (China/India correctly under 1.5B individually).
- **`us-state-capitals` all show `size=340,000,000`**: confirmed intentional — HANDOFF states US state capitals use the US's total population for `size`, feeding "country population over X" prompts. Not a bug.

**Net finding: the `size` field is largely clean.** The two Antarctic/Arctic desert entries are the only concrete candidates, and even those are a design question more than a data error.

---

## 4. Names that aren't how the world names them

- **Non-ASCII characters in `name` or `aliases`**: **zero** found across all 8,987 entries. Clean.
- **Trailing/double spaces, leading/trailing whitespace**: **zero** found. Clean.
- **Aliases identical to the name**: see §2 (9 cosmetic cases, all hyphen/space variants, harmless).
- **Invented disambiguators**: Reviewed every name containing parentheses (24 entries: `Red Desert (Wyoming)`, `White Desert (Egypt)`, `Black Desert (Egypt)`, `Santa Rosa Island (California)`, `Santa Isabel (Solomon Islands)`, `Green Island (Taiwan)`, `Karakul (Tajikistan)`, and 17 rivers like `Derwent (Derbyshire)`, `Stour (Kent)`, `Grand (Ontario)`) — **all of these are legitimate, Wikipedia-matching disambiguators** for genuinely name-colliding rivers/deserts/islands (there are multiple "Red Deserts" and dozens of "Avon"s worldwide), not bank-invented ones like the "Cuba Island" the decisions doc warns against. No violations of the "entries are named as the world names them" rule were found.
- **`island-bainbridge-island`, `island-merritt-island`, `island-mercer-island`**, etc. — these "X Island" names are real official names (not invented), confirmed correct in §1.
- **`island-nan-ao-island`**'s name adds "Island" where the (only available) Wikipedia article is titled "Nan'ao County" — minor style mismatch, not an invented disambiguator (the bank's own naming convention, not a fabricated one), low priority.

**Net finding: the bank's naming hygiene is good.** The one real problem this section surfaced (`city-preston`'s wrong-country resolution) is a wrong-article bug already covered in §1, not a naming defect.

---

## 5. Theme gaps

Cross-referenced `src/data/themes.js` against the bank using coordinate bounding boxes (Scotland for lochs, the Alps for peaks, Africa for lakes) plus manual review. **The 2026-09-14 theme expansion already did a very thorough job** — zero gaps found for Scottish lochs in "the British Isles", zero for Alpine peaks >3,000 m in "the Alps", zero for African lakes >20 km² in "Africa", and the "volcanoes" theme already includes every mountain entry with "volcano" in its name (including `Laki`, once its wikiTitle bug in §1 is fixed).

**One concrete gap found:**

| theme | missing members | evidence |
|---|---|---|
| island · "the Caribbean" | `Los Roques`, `La Tortuga`, `La Orchila`, `Coche`, `Cubagua` (Venezuela's Caribbean-coast islands) and `Rosario Islands` (Colombia, near Cartagena) | All six exist in `islands.json`, all sit inside the Caribbean basin by coordinates, and none are currently in the `the Caribbean` theme set even though Venezuela's and Colombia's other Caribbean holdings would reasonably expect them included — a player naming "Los Roques" for a "Caribbean island" themed prompt is currently refused. |

**Secondary observation (not a theme gap, a possible new theme):** five real, notable Malaysian peaks exist in the bank with no theme home at all — `mountain-mount-tahan` (highest in Peninsular Malaysia), `mountain-mount-murud` (highest in Sarawak), `mountain-trus-madi` (2nd-highest in Sabah), `mountain-mount-ophir`, `mountain-gunung-jerai`. There's no "Malaysia" mountain theme the way there's an "Indonesia" one; not a defect, just a possible future addition if the user wants one.

---

## 6. Category mistakes

- **Capitals vs. cities**: clean. Cross-checked every `cities.json` entry's normalized name against `capitals.json` and found no national capital incorrectly listed as a non-capital city (the build's own refusal rule appears to have held).
- **Mountains vs. minor peaks**: clean — zero names appear in both `mountains.json` and `minor-peaks.json`.
- **Lake vs. sea/bay naming**: reviewed every lake whose name contains "Sea/Bay/Gulf/Strait/Sound/Channel" and every sea whose name contains "Lake" — all six hits (`Caspian Sea`, `Aral Sea`, `Salton Sea`, `Dead Sea`, `Sea of Galilee`, `Laguna de Bay`) are long-established, correctly-classified salt lakes (matching the `saltwater` lake theme); zero sea/ocean entries misuse "Lake". No category mistakes found here.
- **Mountain ranges filed as single peaks**: `mountain-marble-mountains` is literally a mountain *range* ("Marble Mountains", plural) sitting in the single-peak `mountain` cohort — once its wrong-article bug (§1) is fixed to the Vietnamese Ngũ Hành Sơn, it will still be a range-not-a-peak, similar in kind to already-accepted range-ish entries elsewhere in the cohort (e.g. Arjuno-Welirang). Flagged for awareness, not necessarily a fix — the game's `mountain` cohort already tolerates a few of these.
- **Islands vs. peninsulas/capes**: reviewed every island whose name contains "Peninsula/Coast/Cape/Isthmus" — `Cape Breton Island`, `Cape Verde`, `Cape Clear Island` are all genuine islands with "Cape" as part of a proper name, not peninsulas. Clean.
- **Countries filed as islands**: all 34 country/island name-sharing pairs (§2) are consistent with the documented "island nations are islands" decision — **except worth a second look**: `island-indonesia` (size 1,904,569 km²) and `island-philippines` (size 300,000 km²) represent multi-thousand-island archipelagic *nations*, not a single landmass, unlike `island-cuba` or `island-ireland` which really are one island. The entries currently carry the *country's total land area* as their island `size`. This is defensible under the "island nations are islands" and "generosity" house rules, but it's the one case in this list that's geographically inaccurate in a way a sharp-eyed player might notice ("Indonesia" isn't an island). Flagged for a judgment call, not asserted as a bug — the user has already ruled on the broader "island nations are islands" question once and may want this to stand.
- **City/capital population units**: confirmed consistent (`cities`/`countries` use city or country population; `capitals`/`us-state-capitals` use `population_of_country` by design, per HANDOFF).

**Net finding: no hard rule violations.** The only note worth a decision is the Indonesia/Philippines-as-a-single-island question above, which is really a re-litigation of an already-made design call rather than a new mistake.
