# Europe × islands — five coverage probes and fills (2026-09-17)

The island pass of the Europe wave (`probes/uk-islands`, `de-islands`,
`fr-islands`, `it-es-islands`, `nordic-islands`): the island category
trees (with lake and river islands) plus the national and regional lists,
**floor 1 km² or 1,000+ views** (as the US), and — decision 1's first use
in bulk — **unsized islands kept at 122+ views/mo with `size` 0**
(`noFigureViews` in the probe, `--allow-no-figure` in the chunk). Then a
views floor for the sized ones too: first 61 (as lakes), then **91 views/mo**
when the Nordic chunk showed 93 rows at exactly two views a day sitting in
the island cohort's jackpot band (the cohort's bottom is 14 views).

| probe | articles | present | folded | after the 91 floor | commit |
|---|---|---|---|---|---|
| uk-islands | 1,146 | 116 | 228 | ~200 | `e6f8293` |
| de-islands | 94 | 17 | 6 | 6 | `55034cb` |
| fr-islands | 337 | 62 | 26 | 26 | `d117629` |
| it-es-islands | 680 | 177 | 55 | ~50 | `d1ffd94` |
| nordic-islands | 970 | 84 | 256 | ~190 | `78c1734`, `abb95bc` |

Island cohort 1,659 → 2,139; jackpot share 4.0% → 3.2%; **~330 rows carry
`size` 0**. Themes: `Scotland` +125, `the Mediterranean` +35.

## What came in

- **Britain and Ireland**: Rockall, Eilean Donan, the Isle of Portland,
  Gruinard, Burgh Island, Foula, Fetlar, Rousay, Whalsay, Papa Westray,
  Stroma, Flat Holm, Steep Holm, Bere Island, the Calf of Man, Great
  Bernera, Lewis (via Isle of Lewis — see below), the Thames aits (Eel Pie,
  Tagg's, Magna Carta…), the Forth islands (Inchkeith, Inchcolm's
  neighbours), the Cork Harbour and Kerry islands…
- **Germany, Austria, Switzerland**: Donauinsel, Neuwerk,
  Nordstrandischmoor, Trischen, Mellum, Memmert.
- **France, the Netherlands**: Pheasant Island (the condominium), Île
  Sainte-Marguerite, Levant, Port-Cros, Cavallo, Gavrinis, Houat, Hœdic, the
  Seine islands, Flevopolder, Goeree-Overflakkee, IJsselmonde, Voorne-Putten.
- **Italy, Spain, Portugal**: Poveglia (10,380 views), Es Vedrà, Pianosa,
  Alboran, San Giorgio Maggiore and the Venetian lagoon islands, the
  Aeolian and Egadi islands (Alicudi, Filicudi, Marettimo, Levanzo), Capraia,
  Giannutri, the Tuscan islets, Isola Bella (Maggiore), the Galician and
  Algarve islands, the Madeiran Desertas.
- **The Nordics**: Surtsey, Hopen and the Svalbard islands, Smøla, Frøya,
  Hitra, Senja, Sotra, Kvaløya, Sørøya, Orust, Tjörn, the Stockholm
  archipelago, Fanø, Rømø, Mors, Als, the Faroes' Sandoy, Heimaey, Grímsey,
  Flatey…

## Decisions taken on the spot

- **Views floor 91 for islands.** Rivers 30, lakes 61, islands 91,
  mountains 122: each just above the cohort's flat "n views a day" bottom,
  where every row at the floor is an automatic jackpot. The 91 rule cost 93
  Nordic and 8 British islets; the 61 rule before it cost 8.
- **Lists are dirty**: "List of islands of the United Kingdom" links every
  British Overseas Territory, the navboxes link "Irish language",
  "Shamrock", "Irish whiskey", the Rugby Football Union and the Isles of
  Scilly Football League; the Mediterranean list links Greece, Croatia and
  Turkey; the French tree holds all of overseas France (140 Polynesian,
  Caribbean and Indian Ocean islands); the Balearic and Canary navboxes
  link cuisine, stadiums and elections; the Baltic list links Estonia. A
  scratch cleaner (`clean-islands.py`, not in the repo: region keywords in
  the description or title, the description's opening words against a
  junk list, plural group titles) did most of it; the rest by eye. The
  probe's `notKind` cannot do this alone because the exempt-title rule
  (an island whose article is its town) lets everything with "Island" in
  the title through.
- **Groups stay out** (Blasket Islands, Skellig Islands, Small Isles,
  Copeland, Monach, Frioul, Lavezzi, Îles d'Hyères, the Frisian chains,
  Koster, Kong Karls Land…) as in the US; peninsulas, regions, villages and
  tidal-island concepts too.
- **Inland islands need `OCEAN_OVERRIDES: []`**: 38 British (the Thames,
  Loch Lomond, Loch Awe, Loch Maree, Lough Erne, Lough Neagh, Coniston), 7
  French/Dutch, 7 Italian/Spanish (Maggiore, Garda, Orta, the
  Guadalquivir), 8 Nordic (Mälaren, Vänern, Päijänne). Written with
  `add-oceans.mjs` from a description scan; the coordinate box put every
  one of them "in the Atlantic" first.
- Isle of Lewis (10,563 views) was dropped as "Region of Lewis and Harris
  island"; the bank has Lewis and Harris.

## Tooling lessons

- `drop.mjs` deleted the first namesake in the file, not the row in the
  entry's block: dropping the Danish islets Omø and Siø removed the rivers
  Omo and Sió for one commit (`191f93e` fixed both). A pre-wave/now diff
  of the bank (`bank.js` at `81b0b00` vs HEAD) shows only the six
  deliberate drops missing — no other casualty.
- The island lists resolved ~3,500 candidates for 1,146 islands in Britain:
  the resolve step is the cost, not the tree.

## Judgment calls for a human

- ~330 unsized islands are the first `size` 0 rows: a "smaller than 100
  km²" prompt refuses them (unknown is neither small nor large). If that
  reads wrong in play, the alternative is to treat unknown as "small".
- The 122-views floor for unsized islands vs 91 for sized ones: the unsized
  floor was set before the jackpot measurement; 91 for both would admit
  ~40 more islets.
