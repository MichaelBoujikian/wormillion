# South America rivers, the big countries — 2026-09-19 (the South America wave, probe 1)

Branch `expansion-2`. Probe `scripts/expansion/probes/sa-rivers-big.json`
(Brazil, Argentina, Colombia, Peru, Venezuela, Chile, Bolivia; floor 80 km,
`noFigureViews` 122, `famousViews` 1000); chunk files in `work/folded/sa/`
(`new-rivers-sa.txt`, `new-rivers-ns-sa.txt`, `qualify-ns-sa.txt`). Bank
20,225 → **20,458** (+206 rivers, +27 namesakes); 7 incumbents qualified and
one renamed. Every row into the river theme `South America` (252 → 485).

## Method

- Tree: the seven `Rivers of <country>` categories and their state /
  province / department subcategories (126 categories, 3,204 pages —
  Brazil's mass-created stubs); the seven national lists (Brazil's 2,315
  links). 3,203 read as rivers (641 skipped); 224 present, 40 taken, 44
  fuzzy, 269 missing; **2,507 with no figure** — the Brazilian stubs.
- Sizes: Wikidata had a length for 322; the article pass over the 490
  in-scope-or-30-plus-views rows agreed on 55, overrode 18 (Jutaí 1,488 vs
  1,200; Cuiabá 480 vs 828; Yata 470 vs 1,006; Guamá 82 vs 400), sized 77
  alone; `--sister=es,pt` sized 55 more (eswiki's Uraricoera 870, Manicoré
  390, Cunucunuma 241, Ñuble 155; ptwiki's São Marcos 466.7, Aguapeí 420,
  Munim 320). 214 unsized-at-30-plus stayed bare; 18 at 122+ views went in
  at `size` 0 (Maici, São Lourenço, Sucuriú, Carhuasanta — the Amazon's
  source stream).
- Views floor 30: 93 sized rows under it left out (Itacaiúnas, Rio dos
  Sinos, Coroico, Mundaú, Tapiche…). The Brazilian stub class at 5–25
  views is the wave's biggest unsized mass — 2,000 articles with no
  length anywhere.
- The hand-clean: a description rule (a river / stream in a place) cut the
  concept rows the lists carry (the Viceroyalty of the Río de la Plata,
  three navies and air forces, the Meeting of Waters, the Source of the
  Amazon); three real rivers whose description does not start with
  "River" (Rímac "Peruvian river", Jaguarão, Samborombón "River of
  Argentina") were kept by hand — the CONCEPT pattern's `^Rivers? of` is
  too greedy for Spanish-flavoured descriptions.

## What went in

206 rows: Brazil's Roosevelt (760 km, 2,100 views; aliases River of Doubt,
Rio Roosevelt), Aripuanã (870), Canumã (900), Capim (820), Ji-Paraná (820;
alias Rio Machado), Rio das Velhas (801; alias Velhas River), Marié (800),
Grajaú (770), Paru de Oeste (710), Uatumã (660), Tapauá, Ituxi, Gravataí,
Rio de Contas (620), Abacaxis, Rio dos Marmelos, Tarauacá, Fresco, Corumbá,
Ivinhema, Jamanxim, Ijuí, Coari, Jauaperi, Curuçá, Maicuru, Manso (Mato
Grosso), Cuiabá, Meia Ponte, Anapu, Curuá, Itapicuru, Paraopeba, São
Marcos, Vaza-Barris, Tefé, Urubu, Aquidauana (1,200 — Wikidata's, flagged
below), Envira, Rio do Peixe (São Paulo), Rio das Antas, Sorocaba, Pomba,
Tubarão, the Paraíba do Norte, Jutaí (1,488 by the article — flagged),
Acre (680), Pará (320; the Amazon's southern mouth), Uraricoera, Jatapu,
Unini, Jandiatuba, Jaú, Ituí, Ipixuna, Gregório, Candeias, Jamari…;
Argentina's Atuel (600), Gualeguay (857), Abaucán (600), Cuarto / Primero /
Segundo / Quinto as **Río Cuarto, Río Primero, Río Segundo, Río Quinto**
(the numbered rivers keep their word; aliases Chocancharava, Suquía,
Xanaes, Popopis), Diamante, Mendoza, Tunuyán, Senguerr, Agrio, Aluminé,
Barrancas, Corriente, Gualeguaychú, Nogoyá, Quequén Grande, Napostá
Grande, Saladillo, Río de los Patos, Río Grande de San Juan, Samborombón,
Pinturas; Peru's Santa (347), Colca (388), Chira, Piura, Tumbes, Osmore
(480), Las Piedras (640), Manu, Utcubamba (502), Perené, Chillón, Lurín,
Rímac (alias Rimac River), Cenepa, Chinchipe, Corrientes, Aguaytía,
Yavero, Ilave, Jequetepeque, Moche, Zaña, Sama, Nieva, Motupe, Casma,
Caplina, Cunas, Lawriqucha, Carhuasanta, Fortaleza; Bolivia's Itonomas
(1,493 — flagged), Tuichi, Madidi, Yapacaní, Parapetí (500), Isiboro,
Sécure, Kaka, Caine, Chimoré, Orthon, Manuripi, Tahuamanu, Yata, Rocha,
Mauri, Laq'a Jawira; Chile's Cachapoal, Ñuble, Perquilauquén, Cautín,
Tinguiririca, Vergara, Laja, La Ligua, Cruces, Camarones, Rahue, Maullín,
Mataquito, Simpson, Pico, Mayer; Venezuela's Tocuyo (509), Cuchivero,
Carrao, Tuy, Yuruarí, Cunucunuma, Parguaza, Unare, Apón, Neverí, Amacuro,
Barima; Ecuador's Guayas (437). Two within-chunk twins took the state:
Manso (Patagonia) / (Mato Grosso), Paraibuna (Minas Gerais) / (São Paulo),
Rio das Mortes (Mato Grosso) / (Minas Gerais).

**27 namesakes** (the continent's Río Negros, Río Grandes and Colorados):
**Rio Negro (Argentina)** (550 km, 578 views), **(Uruguay)** (750),
**(Chaco)**, **(Paraná)** beside the Amazon's — **the incumbent "Negro
River" renamed Rio Negro (Amazon)** (aliases Negro River, Negro; its id is
now `river-rio-negro-amazon`) so the bare "Rio Negro" goes to the
most-viewed of five; Colorado River (Argentina) (1,114) and (Bolivia)
beside the bare Colorado River; Rio Grande (Brazil) (1,090), (Bolivia)
(820), (Tierra del Fuego), (Mendoza) beside the bare Rio Grande;
Desaguadero (Argentina) (1,515) beside Desaguadero (Bolivia) (qualified);
Salado (Buenos Aires) and (Chile) beside Salado (Argentina) and (Mexico);
San Juan (Colombia), (Argentina) beside the Nicaraguan, Four Corners,
Tamaulipas and Veracruz ones; Dulce (Argentina) (650) beside Dulce
(Guatemala) (qualified); Mira (Ecuador) beside Mira (Portugal)
(qualified); Piracicaba (São Paulo) beside Piracicaba (Minas Gerais)
(qualified); Taquari (Mato Grosso do Sul) beside Taquari (Rio Grande do
Sul) (qualified); Pardo (Mato Grosso do Sul) beside Pardo (Bahia)
(qualified); Chico (Chubut) beside Chico (Santa Cruz) (qualified);
Manzanares (Venezuela), Chama (Venezuela), Parana (Tocantins) (the Paranã
of Goiás beside the Paraná), Rio Verde (São Paulo), San Pedro (Bolivia),
Una (Pernambuco) beside bare incumbents.

## Left out, and why

- Under 30 views: 93 sized rows and the namesakes Horcones (Argentina)
  (28), Coco (Brazil) (24), Rio Grande (Jujuy) (22), San Francisco
  (Argentina) (20), Santa Lucía (Argentina) (19), Chico (Upper Chubut),
  Pardo (Rio Grande do Sul), Paraguá (Bolivia), Una (Bahia), two more Rio
  Verdes.
- Ica (Peru) (91 views, unsized — and "Ica River" is the Putumayo's alias
  for its Brazilian reach), Río Blanco (Bolivia) (unsized at 30).
- The 2,000-odd Brazilian stubs with no length anywhere (5–25 views).

## For a human

- Aquidauana 1,200 km (Wikidata; the river is ~600 km — the figure may be
  the basin's or the Miranda's), Itonomas 1,493 km (Wikidata), Jutaí 1,488
  (the article's, against Wikidata's 1,200), Desaguadero (Argentina) 1,515
  (Wikidata only). For the audit — all four answer "longer than 1,000 km".
- The Rio Negro rename: five Rio Negros now; the Amazon's article title is
  "Rio Negro (Amazon)" and the bank follows it. Any daily that drew
  `river-negro-river` before today would replay under the new id — the
  pipeline's gap-check and tests passed, the draw is by name.
- "Santa" (Peru's Santa River), "Fortaleza" (a Peruvian river beside the
  Brazilian city), "Mendoza", "Miranda", "Tumbes", "Piura", "Corumbá",
  "Cuiabá", "Sorocaba" are bare river names that are also cities' —
  the round's category settles it (the rulebook); "Acre" and "Pará" are
  states'.
