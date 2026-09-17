# Europe × lakes — five coverage probes and fills (2026-09-16/17)

The lake pass of the Europe wave, one probe per country group (`probes/
uk-lakes`, `de-lakes`, `fr-lakes`, `it-es-lakes`, `nordic-lakes`): the
lake and reservoir category trees (lochs, loughs, tarns and meres included)
plus the national list pages, **floor 25 km²** (as the US), `famousViews`
1000, the article pass for the many articles Wikidata leaves unsized (949 of
1,080 British ones). **The bank already held nearly every European lake over
25 km²** — the 2026-09-14 fill and the Sweden probe had done that — so four
of the five chunks are the famous small lakes lifted by views. The Nordic
probe was the exception (Finland).

| probe | articles | present | folded | commit |
|---|---|---|---|---|
| uk-lakes (England by county, lochs of Scotland, Wales, NI, the Republic; reservoirs) | 1,080 | 71 | **8** | `0fd2724` |
| de-lakes (Germany by state, Austria by state, Switzerland by canton, Liechtenstein, Luxembourg) | 1,063 | 54 | **12** | `b74a4f4` |
| fr-lakes (France, Belgium, the Netherlands, Andorra, Monaco) | 388 | 7 | **16** | `e6c64f3` |
| it-es-lakes (Italy by region, Spain by community, Portugal) | 391 | 28 | **11** | `ac30f2f` |
| nordic-lakes (Sweden, Norway, Denmark, Finland, Iceland) | 1,164 | 82 | **92 → 32** | `124ed6b`, `8f12b0d` |

Lake cohort 1,157 → 1,234; jackpot share 3.6% (was 3.9%).

## What came in

- **Britain and Ireland**: Ladybower Reservoir (3,409 views), the Serpentine,
  Llyn Celyn, Derwent Reservoir, Lake of Menteith, Dozmary Pool,
  Hanningfield Reservoir, Lough Hyne (a marine lake — `saltwater`).
- **Germany, Austria, Switzerland**: Geiseltalsee, Laacher See, Walchensee,
  Müggelsee, Möhne Reservoir, Bachalpsee, Mummelsee, Lake Toplitz, Grüner
  See, Seealpsee, Plauer See, Lake Kummerow (dropped again at the 61 floor);
  five Alpine ones into `the Alps`; ue aliases (Mueggelsee, Moehnesee…).
- **France, the Netherlands**: **Lac du Bourget** (44.5 km², 2,009 views)
  was missing; the Mediterranean étangs (Thau, Berre, Vaccarès, Leucate,
  l'Or) and the Grevelingen into `saltwater`; Lake Der-Chantecoq, Grand-Lieu,
  Hourtin-Carcans, Cazaux, Biscarrosse; the Dutch bordering lakes (IJmeer,
  Gooimeer, Veluwemeer, Ketelmeer). Bare aliases (Bourget, Thau, Berre,
  Hourtin, Cazaux, Biscarrosse, Lac du Der).
- **Italy, Spain, Portugal**: **Lake Orta** was missing; Reschensee, Lake
  Avernus, Lake Nemi, Lago di Tenno, Lake Predil, Lagoa do Fogo, Lagoa das
  Sete Cidades, the Orbetello lagoon (`saltwater`), Valdecañas Reservoir.
- **The Nordics**: Lake Bodom, Vanajavesi, Puruvesi, Lokka and Porttipahta
  Reservoirs, Øyeren, Møsvatn, Keurusselkä, Kiantajärvi, Koitere, Nilakka,
  Suontee… (32 after the views floor); 17 fuzzy traps fixed (Totak → Lake
  Tota, Aursunden → Åsunden, Tarjanne → Päijänne, Onkivesi → Orivesi,
  Kermajärvi / Kivijärvi → Kemijärvi…). **Pihlajavesi re-pointed**: the row
  carried the Saimaa lake's 713 km² but scored on *Pihlajavesi (Keuruu)*, a
  15-view namesake — it was the bank's rarest lake and the ≥85% answer the
  handoff named; now 91 views.

## Decisions taken on the spot

- **A 61 views/mo floor for lakes** (`8f12b0d`). The lake cohort's bottom
  sits at 17–30 views, so a lake at exactly one view a day (magnitude 30) is
  an automatic jackpot: the Nordic chunk's 60 such rows took the share from
  3.9% to 8.2%. Rivers tolerate 30 (their bottom is Mecaya at 7). **Views
  floor per cohort: rivers 30, lakes 61** — the mountains lesson (122)
  restated: never at the cohort minimum.
- **Sections and groups are not lakes**: Obersee / Untersee / Überlinger See
  (parts of Lake Constance), the Broads, the Elan Valley Reservoirs,
  Hampstead Heath Ponds, the Mecklenburg Lake Plateau, the Venetian Lagoon
  and the Comacchio lagoons, the Valli.
- Coastal lagoons and marine lakes are lakes with the `saltwater` theme
  (Thau, Berre, Vaccarès, Leucate, l'Or, Grevelingen, Orbetello, Lough
  Hyne).
- The lists drag in the wrong kind: the Azores, Madeira and Pico (islands),
  the English Channel, the Tarn (a department), Ardnamurchan (a peninsula —
  the kind regex's `loch` matched "Lochaber"; fixed by hand, not in the
  regex).
- Namesakes stay out (decision 5): Lough Derg (Donegal) vs the Shannon's,
  the five Finnish Pyhäjärvis vs Satakunta's, Storsjön (Gästrikland) vs
  Jämtland's.

## Tooling

- `probe.mjs` / `chunk.mjs` strip enwiki's comma disambiguation for every
  category ("Lough Derg, County Donegal").
- `article-size.mjs` reads a decimal comma: `{{convert|50,21|km2}}` is 50.21
  and Vanajavesi's `149,758 km2` is 149.758 (a sanity cap per unit settles
  the three-digit case).
- `drop.mjs` no longer leaves array holes or double commas in `themes.js`.

## Judgment calls for a human

- Finland's 49 sub-30-view lakes and the 60 at exactly 30 views are real
  and sized; they return the day the lake cohort's bottom is deeper.
- Sweden's 2026-09-15 probe used a 30 km² floor; this pass at 25 km² added
  its 25–30 km² lakes (Boren, Yngen — dropped again for views).
