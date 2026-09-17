# Sweden, Norway, Denmark, Finland, Iceland × rivers — coverage probe and fill (2026-09-16)

Fifth and last river chunk of the Europe wave (the Nordics joined the wave
on 2026-09-16). Method: every article under `Category:Rivers of Sweden` (+
`by county`), `…of Norway` (+ `by county`, minus Svalbard), `…of Denmark`
(minus the Faroes and Greenland), `…of Finland` (+ `by municipality`),
`…of Iceland` (62 categories, 460 pages) plus the five national lists —
1,080 candidate titles, 452 resolved to river articles. **Floor 60 km**,
`famousViews` 1000 (lifted nothing). Wikidata sized 264; the article pass
read 276 (14 disagreements, all to the article; Ängesån 180 → 20,
Akerselva 82 → 9.8 — the shift again). Config: `probes/nordic-rivers.json`.

## Outcome (same day)

- **`871b259` — 98 rivers** folded (100 in scope; the Närke and Östergötland
  Svartån collided with the Västmanland one). **10 fuzzy traps** fixed:
  Karup → Karun, Kovda → Konda, Lotta → Otta, Pärlälven → Dalälven, Sagån →
  Lagan, Oreälven → Ume, plus four more. The headline: **Altaelva** (240 km,
  the Alta salmon river) was missing.
- Left out by hand: Maltan (a list dragged in a Magadan river), the
  Nea-Nidelvvassdraget (a watercourse system) and "Kjarrá–Thervá River"
  (described as a salmon fishing destination).
- **Then `19a5183` dropped 38 of the 98 again** (see below).
- Themes: all in `Europe` (no Nordic river theme exists; `Scandinavia` is a
  lake theme). `gap-check` pins 11 names.

## The 30 views/mo floor (`19a5183`)

After the five river chunks the river cohort's **jackpot share had gone from
2.5% to 4.5%** — 1 river in 22 a jackpot, against 2.2% for mountains and
4.0% for islands. The cause was not the 273 rows at exactly 30 views/mo (one
view a day, the line 292 pre-wave rivers already sit on) but **91 rows
below it** — rivers with a median of zero daily views, whose magnitude is
the mean of a handful of hits (8–29): 38 Nordic, 25 French, 17 Iberian, 11
German. Dropped: the share is 2.2% now, under the pre-wave figure. **The
Europe floor is therefore 60 km (50 in Britain) or 1,000+ views, and at
least 30 views/mo** — the lowest floor that means anything, and the one the
US mountains re-cut taught (a views floor at the cohort minimum is a trap).
The chunk files under `work/folded/` still list the 91; `rivers.json` does
not.

## Counts

| | |
|---|---|
| river articles under the trees + lists | **452** (554 skipped) |
| in the bank before | **99** |
| ≥ 60 km and missing or fuzzy | **103** → 98 folded → 60 kept after the views floor |
| ≥ 60 km, name taken by another entry | 5 (Tana (Finland–Norway) 370 km / 274 views is held by Kenya's Tana River; Lagan (Sweden) by Belfast's; Nidelva (Agder) by Trondheim's; Gaula; Bure) |
| under 60 km | 176 |
| no length figure anywhere | 69 |

## Decisions taken on the spot

- **30 views/mo as a floor for the whole wave's rivers**, applied
  retroactively to the four continental chunks (the UK chunk had nothing
  under 30).
- Swedish/Norwegian names fold to ASCII the bank's way (Västerdal →
  Vasterdal, Åby → Aby, Öre → Ore, Åre → Are); no aa/ae/oe aliases were
  added (unlike the German ue/oe ones) — the Nordic digraphs are rarer in
  English typing.

## Judgment calls for a human

- **Tana** (Finland–Norway, 370 km, 274 views) is a bigger deal than most
  namesakes: it is the border river and a famous salmon river, and the
  Kenyan Tana holds the bare name. Decision 5.
- **"Are"** and **"Ore"** (Åre and Öre rivers, 70 and 225 km, 17 and 30
  views) are English words once folded; "Are" is three letters and gets no
  fuzzy slack, so only a deliberate "are" lands on it. Both survived the 30
  floor (Ore) or did not (Are, 17 views — dropped).
- Etna (a Norwegian river, 106 km, 30 views): on a river round "Etna" is
  now this river; on a mountain round it is still Mount Etna.
