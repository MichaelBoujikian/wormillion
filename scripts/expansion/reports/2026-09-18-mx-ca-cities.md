# Mexico and Canada cities — 2026-09-18 (the Mexico and Canada wave, probe 8)

Branch `expansion-2`. Probe `scripts/expansion/probes/mx-ca-cities.json`
(lists only, Wikidata P1082 ≥ 50,000); chunk files in `work/folded/mx-ca/`
(`new-cities-mxca.txt`, `new-cities-ns-mxca.txt`, `qualify-ns-mxca.txt`).
Bank 16,747 → **16,891** (+134 cities, +10 namesakes); 3 incumbents
qualified. City cohort 3,915 → 4,059; jackpot share 0.77% → 1.36% (the
line stays at 312.6 views; 24 Mexican mid-size cities sit in the 91–312
band).

## Method

- 11 lists (Mexico: cities, municipalities by population, metropolitan
  areas; Canada: cities, the largest municipalities, the largest population
  centres, the census metropolitan areas, Ontario / Quebec / British
  Columbia / Alberta), `listCountry` mapping each to its country. 1,511
  candidates → 792 read as cities; 181 missing, 4 fuzzy, 11 taken.
- **Decision on the spot:** the city cohort has no views floor, but its
  lowest row was Bel Air South at 91 views and the rarity scale is
  log-min/max — four Mexican towns at 30–61 views (Coatzintla, Buenavista,
  Cosoleacaque, San Pablo de las Salinas) had moved the whole cohort's
  jackpot line from 312 to 122 views. They were dropped: cities keep a
  91-views floor from now on.

## What went in

134 rows: Canada's Markham, Vaughan, Burnaby, Longueuil, Burlington's
neighbours Oakville / Milton / Halton Hills, Richmond Hill, Whitby, Ajax,
Pickering, Oshawa, Barrie, Guelph, St. Catharines, Sherbrooke, Saguenay
(and Chicoutimi), Trois-Rivières, Lévis, Terrebonne, Abbotsford, Coquitlam,
Chilliwack, Saanich, Delta, Langley, Maple Ridge, New Westminster, North
Vancouver (the city), Port Coquitlam, Saint John (New Brunswick) (qualified
— an island holds "Saint John"), Sault Ste. Marie, Sarnia, North Bay,
Belleville, Grande Prairie, Airdrie, St. Albert, Drummondville, Shawinigan,
Rimouski, Granby, Saint-Hyacinthe, Saint-Jérôme, Blainville, Repentigny,
Mascouche, Mirabel, Brossard, Dollard-des-Ormeaux, Châteauguay, Caledon,
Kawartha Lakes, Chatham-Kent; Mexico's Reynosa (691k), Tlalnepantla de Baz
(alias Tlalnepantla), Chimalhuacán, Tlaquepaque, Guadalupe (Nuevo Leon) /
(Zacatecas), Apodaca, Ciudad López Mateos (alias Atizapan de Zaragoza),
Cuautitlán Izcalli, General Escobedo, San Nicolás de los Garza (alias San
Nicolas), Tonalá, Nuevo Laredo, Matamoros, Ixtapaluca, Ciudad Victoria,
Ciudad Nicolás Romero, Soledad de Graciano Sánchez, Gómez Palacio,
Tehuacán, Tampico, Coatzacoalcos, Nogales, Chilpancingo, Monclova, Ojo de
Agua, Xico (alias Valle de Chalco), Ciudad del Carmen, Piedras Negras,
Chicoloapan, Chalco, Poza Rica, Tulancingo, San Luis Río Colorado, Metepec,
Ciudad Acuña, Zumpango, Jiutepec, Ocosingo, Ciudad Madero, Orizaba, Parral
(alias Hidalgo del Parral), Tecate, Guaymas, Delicias, Fresnillo, La Piedad,
Kanasín, Ramos Arizpe, San Pedro Cholula, Papantla, Tecomán, Uriangato…

10 namesakes: Waterloo (Ontario) (9,771 views, beside Belgium's), Richmond
(British Columbia), Burlington (Ontario), Peterborough (Ontario) beside
Peterborough (England) (was bare), Cambridge (Ontario), Aurora (Ontario),
La Paz (Baja California Sur) and La Paz (State of Mexico) beside La Paz
(Bolivia) (the seat of government, in the city cohort; was bare), Córdoba
(Veracruz), Salamanca (Guanajuato) beside Salamanca (Spain) (was bare).
London (Ontario) and Kingston (Ontario) went in qualified from the start
(their bare names are capitals: "London" keeps the nudge; "Kingston" lands
on Ontario's, 18,842 views, because Jamaica's capital is not 3× as viewed).

## Left out, and why

- Mexico City and Ottawa (national capitals; the fold refuses them).
- 40 "X Municipality" articles (Tijuana, Juárez, Monterrey, Mérida,
  Hermosillo, Culiacán, Mexicali, Ensenada, Saltillo, Torreón, Chihuahua…
  — the cities are in), Cajeme, Ahome, Othón P. Blanco, Los Cabos and
  Puebla (municipality) (municipalities whose seats are the cities), North
  Vancouver (district municipality) beside the city, Teziutlán
  (municipality) beside the city.
- Four towns under 91 views (above).
- 369 places under 50,000; 137 with no Wikidata population.

## For a human

- The fuzzy list: Saint John (NB) had been corrected to St. John's; Grande
  Prairie to Grand Prairie (Texas); San Juan del Río to San Juan del Sur;
  Cárdenas to Gardena — all four are in now, exact.
- Langley is the district municipality (132,603; the City of Langley is
  28k); Chicoutimi is a borough of Saguenay and both are in.
- A test that judged the reveal's display name on a length prompt now
  strips the qualifier — "La Paz (State of Mexico)" is the first qualified
  ★ on a "short" city prompt; the game path measured "la paz" all along.
