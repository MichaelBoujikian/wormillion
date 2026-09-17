# Europe × seas, deserts, cities — probes and fills (2026-09-17)

The last three cohorts of the Europe wave (the 20 countries of Western
Europe and the Nordics), each one probe over the whole region rather than
five national ones: `probes/eu-seas`, `eu-deserts`, `eu-cities`. Then the
decision-1 re-runs of the US no-figure cohorts (`us-seas`, `us-islands`,
`us-deserts`), below.

| probe | articles | present | folded | commit |
|---|---|---|---|---|
| eu-seas | 1,479 | 234 | 149 | `134522c` |
| eu-deserts | 146 | 86 | 2 | `9308724` |
| eu-cities | 8,870 | 404 | 619 | `7b02d56` |

Bank 13,872 → 14,491 after the cities; seas 259 → 408, deserts 130 → 132,
cities 3,180 → 3,799. Jackpot shares after the folds: seas 0.7%, cities
0.8% (no views floor needed for cities — the population floor does it).

## Seas — `probes/eu-seas.json`

104 categories (bays, fjords, firths, straits, sounds, sea lochs, lagoons
and estuaries of the 20 countries) plus 12 lists. **Nearly none has an
area**: 586 of the 634 missing had no figure anywhere, so this is decision
1's first bulk use on seas — `noFigureViews: 183` in the probe (the sea
cohort's views floor, one step above its flat 6-views-a-day bottom),
`--allow-no-figure` in the chunk, `size` 0 on 145 of the 149 rows.

In: Scapa Flow, Sognefjord, Geirangerfjord, Oslofjord, Hardangerfjord,
Lysefjord, Nærøyfjord, the Menai Strait, the Cantabrian Sea, the Firths of
Tay, Lorn and Cromarty, the Scottish sea lochs (Fyne, Long, Linnhe, Etive,
Broom…), the Icelandic fjords, the Venetian and Marano lagoons, Liverpool
and Swansea Bays, Kiel and Roskilde Fjords, the Gulf of Corryvreckan,
Saltstraumen, Mont-Saint-Michel Bay… All into the `Europe` theme.

Out: the worldwide strait and gulf lists' non-European members (their own
waves), the concept articles (Fjord, Estuary, Sea, Sealand, the Baltic Sea
anomaly), beach coves and bay villages, New York's straits (they turned up
in the strait list; taken by the US re-run below). `fetch-pageviews --check`
now reads fjord / firth / inlet / lagoon / loch / cove / bight / voe / kyle
/ roads as a sea.

## Deserts — `probes/eu-deserts.json`

Europe has almost no deserts and the bank already had them: 86 of the 146
articles present (Tabernas, the Bardenas Reales, Błędów, Oleshky…). Two
folded: the **Desert of Wales** (the Cambrian Mountains' upland, no figure)
and the **Accona Desert** (Crete Senesi). The worldwide desert lists' other
members belong to later waves. The desert cohort's jackpot share is
**7.6%** (10 of 132) — a small cohort with a wide magnitude range; nothing
in this wave changed it, but it is the one cohort outside the 1.6–4% band.

## Cities — `probes/eu-cities.json`

44 national "List of cities in X by population" / "List of towns in X"
pages for the 17 countries that have one (Monaco, Liechtenstein and Andorra
are their capitals), each list mapped to a country by the new
`listCountry` config (the probe records which list an item came from;
`chunk.mjs` writes the country column from it, `--country` is the
fallback). Floor **50,000** from Wikidata P1082, as the US; no article
pass (829 unsized candidates were Irish, Northern Irish, Welsh and Danish
villages with no population item — none near the floor).

8,870 articles; 404 present, **651 missing, 45 fuzzy, 37 name-taken**;
6,904 under the floor.

What came in (619): Blackpool, Chester, Croydon, Swindon, Doncaster,
St Albans, Bolton, Salford, Wigan, Warrington, Stockport, Rotherham,
Poole, Bedford, Gloucester, Cheltenham, Harrogate, Huddersfield, Slough,
Watford, Carlisle, Brighton and Hove (Brighton was in), the London towns
(Croydon, Bromley, Harrow, Hounslow, Sutton, Uxbridge), Matera, Lecce,
Ancona, Pavia, Piacenza, Prato, Sanremo, Sassari, La Spezia, Metz,
Calais, Dunkirk, Villeurbanne, Boulogne-Billancourt and the Paris
communes (Saint-Denis, Montreuil, Argenteuil, Créteil…), Braunschweig,
Darmstadt, Jena, Wolfsburg, Gelsenkirchen, Kaiserslautern, Hamelin,
Bayreuth, Worms, Osnabrück, Oldenburg, Terrassa, Sabadell, Badalona,
Getafe, Las Palmas, Santa Cruz de Tenerife, Algeciras, Amadora, Almada,
Solna, Fredrikstad, Bærum, Hämeenlinna, Deventer, Zoetermeer, Amstelveen…

**45 fuzzy traps fixed**: Dublin corrected to Lublin (the capital is in
the capitals cohort, so a city round had nothing to land on — now
"Dublin is a capital"), Doncaster → Lancaster, Warrington → Arlington,
Salford → Sanford, Wigan → Vigan, Bedford → Medford, Rotherham →
Rotterdam, Poole → Opole, Piacenza → Vicenza, Alessandria → Alexandria,
Vannes → Cannes, Celle → Celje, Palencia → Valencia, Mataró → Matara,
Gandia → Heraklion, Zaanstad → Cape Town…

### Decisions taken on the spot

- **Name-taken out** (the standing rule), 37 + 4: Syracuse (Sicily, 28,066
  views — the bank's is New York), Córdoba (Spain — Argentina's), Cartagena
  (Spain — Colombia's), Halifax (Yorkshire — Nova Scotia's), Newport
  (Wales — Rhode Island's), Boston (Lincolnshire), Lancaster, León, Mérida,
  Colchester, Margate, Kettering, Mansfield, Rochester, Guadalajara,
  Cuenca, Hamilton, Livingston, Frankfurt (Oder), Hagen (→ Mount Hagen,
  "mount" is filler), Sale, Bangor (County Down — Gwynedd's), plus the
  "City of X" district doubles. Found by hand and also left out: **Lincoln**
  (England, 97,541 — Nebraska's), **Taunton** (Somerset — the bank's is
  Taunton, Massachusetts, 59,408, the smaller and less famous one),
  **Warwick** (— Rhode Island's), **Washington** (Tyne and Wear, 67,158 —
  a typed "Washington" means the capital; the twin rule would have scored
  the English town on a city round). Decision 5 in HANDOFF is still the
  right place for these.
- **Overseas France out**: Cayenne (9,162 views), Nouméa, Fort-de-France,
  Saint-Denis, Saint-Paul, Saint-Pierre, Saint-André, Saint-Louis and Le
  Tampon (Réunion), Les Abymes, Saint-Laurent-du-Maroni. They are French
  by law and South American / Caribbean / Pacific by geography; a "city in
  Europe" prompt would list them. Their own waves.
- **Kinds the probe skipped, added by hand** (Wikidata figures fetched
  one by one): the Swedish "urban area" articles are "Place in…" and the
  English cathedral cities and county towns "Cathedral city in…" / "County
  town of…", neither a city kind — Norrköping (98,229), Halmstad,
  Eskilstuna, Horsens, Kempten, Langenfeld, Mijas, El Ejido, Las Rozas de
  Madrid, Pozuelo de Alarcón, Vélez-Málaga, Hereford, Maidstone (109,490),
  Aylesbury, Stafford, Shrewsbury. Luleå (49,646) and Kristianstad
  (41,198) are under the floor as urban areas. The `kind` list should read
  "urban area" and "cathedral city" next wave.
- **"X Municipality" doubles out** (Tromsø, Copenhagen, Stockholm,
  Gothenburg, Malmö, Helsingborg, Jönköping, Västerås, Kristiansand,
  Ålesund, Skien, Tønsberg, Borås… — the city rows exist), as are the
  Danish suburban municipalities (Gentofte, Frederiksberg, Gladsaxe,
  Hvidovre, Lyngby-Taarbæk), Asker and Nordre Follo, Sandvika (a
  115,543 figure for a town of ten thousand), the UK unitary districts
  and Northern Irish council areas (County Durham, Cheshire West and
  Chester, Causeway Coast and Glens, Lisburn and Castlereagh, Derry City
  and Strabane, Fermanagh and Omagh, Antrim and Newtownabbey, Medway), the
  merged Dutch rural municipalities (Súdwest-Fryslân, Westland, De Fryske
  Marren, Hoeksche Waard, Dijk en Waard, Meierijstad, Vijfheerenlanden,
  Krimpenerwaard, Nissewaard, Westerkwartier, Midden-Groningen, West
  Betuwe, Haarlemmermeer, Sittard-Geleen, Velsen, Leidschendam-Voorburg…),
  Canary Wharf, two Portuguese civil parishes (Rio Tinto, Corroios —
  `--check` refuses "civil parish"), Fano (the island Fanø folds to the
  same name).
- **Newtownabbey** came from the Irish list and was written as Ireland;
  fixed to the United Kingdom by hand. Worth a check on every
  multi-country cities probe: a list page can link across the border.
- Aliases added by hand: Brunswick, Hameln, Dunkerque, Gießen,
  Cherbourg, Evry, Dessau, Brandenburg, Offenbach, Esslingen, Hospitalet,
  Castellon, La Laguna, Tunbridge Wells, Southend, Clacton, Burton,
  Leamington, Welwyn, Aquila, San Remo, Castellammare, Famalicão, St Denis…
  "Barrow" (Utqiaġvik's alias) and "Weston" (Weston, Florida) collided and
  were dropped by the fold.

### Judgment calls for a human

- The Paris, Lyon, Lille and London suburbs (about 60 communes and towns
  of 50,000–160,000: Montreuil, Argenteuil, Aubervilliers, Vénissieux,
  Tourcoing, Roubaix, Croydon…) are real municipalities over the floor,
  as the US wave's Illinois villages were. A player naming "Bobigny" on a
  France round is right; a prompt "a city in France" listing Sevran among
  its answers reads oddly. The US precedent says keep.
- The Taunton / Lincoln / Warwick cases: the American namesake is in the
  bank and the English original is not. Decision 5.
- `city flag red+white` is at 72.3% eligible share after this fold (the
  UK's, Denmark's, Austria's and Switzerland's cities all count), above
  MAX_ELIGIBLE_SHARE 0.7 — it is simply not drawn now; it was 68% before.

## US no-figure re-runs (decision 1)

### Seas — `us-seas` again, `b296377`

Same config with `noFigureViews: 183`; the cached tree/resolve/sizes made
the re-run a views fetch. 951 articles, 799 missing after the first pass's
8 sized ones; **210 folded** with `--allow-no-figure --min-views=183`
(490 under the floor — Carmel Bay, Hempstead Harbor, Maumee Bay, Skagit
Bay…). Pearl Harbor (17,107 views), New York Harbor, the Golden Gate, the
Straits of Mackinac, Deception Pass, Kealakekua Bay, Boston Harbor, Cook
Inlet, Jamaica Bay, Narragansett Bay, Pamlico Sound, Lituya Bay, Arthur
Kill, The Narrows, Bristol Bay, Mobile Bay, Penobscot, Whitefish, Buzzards,
Hanauma, Turnagain Arm, Albemarle Sound, Galveston, Elliott, Casco, Green
Bay, Kill Van Kull, Suisun, San Diego Bay, Humboldt, Tomales, Barnegat,
Block Island Sound, Glacier Bay (the article is "Glacier Bay Basin"),
Laguna Madre, Resurrection Bay, Kachemak…

Out: the concept articles the category tree carries (Ocean 39,146 views,
Fjord, Estuary, Lagoon, Strait, Bay, Sound, Ria, Cape, Bight, Headland,
Cove, Inlet, River mouth, Firth, Fjard, Liman, Geo, Gut, Gat…), the
worldwide strait/gulf lists' 78 non-US members and the Northwest Passage,
the CDP articles Neah Bay and Birch Bay (the 2026-09-16 audit's finding),
Lake Pontchartrain (a lake in the bank), Lake Borgne / Merritt / Charles
/ Montauk (lake names), New Haven Harbor (a port article). The Great
Lakes, Lake Washington and Lake Union bays and straits carry no ocean
(`OCEAN_OVERRIDES: []`, as the lake islands); seven coastal bays fell
outside every ocean box and were placed by hand. `--check` now reads
harbor / passage / arm of / narrows as a sea; nine odd Wikidata
descriptions ("Archaeological site" for Bodega Bay, "12 miles north of
Vero Beach" for Sebastian Inlet, three with none) are hand-verified.
