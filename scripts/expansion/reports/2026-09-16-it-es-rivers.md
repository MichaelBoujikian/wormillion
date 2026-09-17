# Italy, Spain, Portugal × rivers — coverage probe and fill (2026-09-16)

Fourth chunk of the Europe wave. Method: every article under `Category:Rivers
of Italy` (+ `by region`), `…of Spain` (+ `by autonomous community`) and
`…of Portugal` (151 categories, 738 pages) plus the three national list
pages ("List of rivers of the Iberian Peninsula" does not exist) — 1,236
candidate titles, 756 resolved to river articles. **Floor 60 km**,
`famousViews` 1000 (lifted nothing). Wikidata sized 554 of the 756; the
article pass read 346 (19 disagreements, all to the article). **The itwiki
decimal shift is the rule, not the exception, for Piedmont**: Chisola 394 →
39.4 km, Chiusella 412 → 41.2, Malone 477 → 47.7, Rovasenda 378 → 37.8,
Sangone 461 → 46, Soana 247 → 24.7, Stura del Monferrato 367 → 36.7, Ostola
255 → 25.5, Niceto 211 → 21.1, Gran Ega 347 → 34.7; Spain has it too
(Cidacos 828 → 82.8, Leza 447 → 55). Every one of these would have gone in
as a 250–800 km river on Wikidata's word. Config: `probes/it-es-rivers.json`.

## Outcome (same day)

- **`e8a1883` — 127 rivers** folded (130 in scope). **19 fuzzy traps** fixed:
  Busento → Basento, Irati → Crati, Senio → Serio, Santerno → Lanterne,
  Sinni → Sinn, Tambre → Sambre, Sacco → Saco, Chanza → Kwanza, Chisola →
  Chipola, Guadalmena → Guadalmedina, Guadiamar / Guadiela → Guadiana,
  Lamone → Lamine, Leza → Lena, Magro → Magra, Sorbe → Orbe, Tanagro →
  Tanaro, Tenna → Penna, Tirón → Ciron, Córcoles → Tárcoles, Valdavia →
  Valdivia.
- The headline: **Rio Tinto** (100 km, 2,922 views — the red river of
  Huelva) was missing.
- Left out by hand: **Odiel** (Wikidata says 660 km; the Odiel is ~140 km and
  its article has no infobox length — no sourced figure, no row), **Allaro**
  (150 km on Wikidata for a Calabrian fiumara; same), and the
  Tartaro-Canalbianco-Po di Levante (a canalised system, not a name anyone
  types).
- 35 rows carry a Wikidata-only figure (no infobox length): Guadalevín 121,
  Alva 110, Bidente-Ronco 135, Cea 157, Guadiana Menor 152… — plausible, but
  this is the class the shift hides in; the audit should spot-check them
  against the article text.
- Themes: all 127 in `Europe`. `gap-check` pins 13 names. Bank 12,514; river
  cohort 3,701 (was 3,574).

## Counts

| | |
|---|---|
| river articles under the trees + lists | **756** (407 skipped) |
| in the bank before | **179** |
| ≥ 60 km and missing or fuzzy | **130** → 127 folded |
| ≥ 60 km, name taken by another entry | 2 (Nera (Tiber) vs the bank's Nera (Danube); Odra vs Oder) |
| under 60 km | 322 |
| no length figure anywhere | 123 |

## Decisions taken on the spot

- **A Wikidata-only figure that is off by ten is not a figure.** Odiel and
  Allaro were dropped rather than corrected by hand: the rule is sourced
  figures, and the article had none.
- Two-name Spanish/Italian rivers keep Wikipedia's title minus the
  parenthetical (Guadiana Menor, Calore Lucano, Stura del Monferrato was
  below the floor anyway).

## Judgment calls for a human

- **Nera (Tiber)**, 116 km and 213 views, is held by the Romanian Nera (a
  Danube tributary, 143 km); decision 5.
- The Wikidata-only 35 (above) — worth an audit pass with the article text
  (`work/wikitext-cache.json` holds the infoboxes; the figures live in the
  prose for these).
