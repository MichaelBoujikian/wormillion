# Europe × mountains — five coverage probes and fills (2026-09-17)

The mountain pass of the Europe wave (`probes/uk-mountains`, `de-mountains`,
`fr-mountains`, `it-es-mountains`, `nordic-mountains`): **lists only** as
for the US (the Munros, Corbetts, Grahams, Marilyns, Wainwrights, Hewitts
and county tops; the Alpine 4000ers and 3000ers and the Swiss canton lists;
the national "List of mountains in X" and volcano lists; the European
ultra-prominence and highest-point lists), plus the French category trees
because the French list titles mostly do not exist. **No elevation floor;
views floor 122/mo** (the mountain cohort's bottom is 30 — the US re-cut
lesson). `probe.mjs` now follows redirects on list pages.

| probe | articles | present | in scope (122+) | folded | commit |
|---|---|---|---|---|---|
| uk-mountains | 1,490 | 107 | 406 | **325** | `8671bb6` |
| de-mountains (Alps, Germany, Austria, Switzerland, Liechtenstein, Luxembourg) | 1,283 | 119 | 222 | **171** | `83e4346` |
| fr-mountains (France, Belgium, the Netherlands, Andorra, Monaco) | 561 | 56 | 82 | **67** | `47c10e3` |
| it-es-mountains | 645 | 188 | 126 | **71** | `96b3af7` |
| nordic-mountains | 226 | 25 | 37 | **20** | `95d76be` |

Mountain cohort 1,984 → 2,638; jackpot share 2.2% → 1.6%. Themes: `the
Alps` 89 → **289** (`range-tag.mjs` from the infobox `range` field, plus ~15
by hand: peaks whose infobox names no range), `Scotland` +69, `England or
Wales` +176 (by description), `volcanoes` 384 → 386+ (Beerenberg, Puy de
Sancy and the Massif Central puys, the Canary and Italian volcanoes,
eleven Icelandic ones incl. Ok — the glacier that was).

## What came in

- **Britain and Ireland**: Pendle Hill, the Storr, Hill of Tara, Croaghaun,
  Great Sugar Loaf, Slievenamon, Nephin, Cavehill, Slemish, Ben Lui, Sgùrr
  Dearg, Cnicht, Mickle Fell, Creag Meagaidh, Aonach Beag, Ben Cleuch, the
  Lake District fells, the Wicklow and Mourne peaks… 45 fuzzy traps fixed.
- **The Alps**: Aiguille du Dru, Grosser Mythen, Piz Boè, Piz Buin,
  Signalkuppe, Zumsteinspitze, Nordend, Mont Maudit, Mont Blanc du Tacul,
  Dôme du Goûter, Dammastock, Hochschwab, Schneeberg, Schesaplana,
  Grimming, Tofane, Sorapiss, Königspitze, Similaun, Weißkugel, Olperer,
  Zuckerhütl, Presanella, Adamello…; **Puy de Sancy** and **Grand Ballon**
  were missing; the Rock of Gibraltar, the Phlegraean Fields, the Vatican
  Hill, Cumbre Vieja, Puig Major, Pico do Areeiro, Mount Somma, Aspromonte,
  Gennargentu, Alcazaba; Himmelbjerget and Ejer Bavnehøj (Denmark's tops).

## Decisions taken on the spot

- **The ultra-prominence and highest-point lists are continental**: they
  drag in Greece, the Balkans, the Caucasus, Crimea, Russia, Georgia,
  Armenia, Greenland, Timor-Leste. Dropped by hand each time (Kajmakčalan,
  Mount Kyllini, Roman-Kosh, Fengari, Mali i Çikës, Tebulosmta, Mount
  Shani, Midžor, Zla Kolata, Velika Rudoka, Radomir, Valamara, Gunnbjørn
  Fjeld, Tatamailau…) — they belong to later waves with their themes.
- **Ranges, massifs, regions and concepts are not mountains**: Lake
  District, Snowdonia, Peak District, Kintail, Massif Central, Luberon,
  Chaîne des Puys, Monts Dore, Mounts of Cantal, Odenwald, Steigerwald,
  Baden-Württemberg, Vorarlberg, the Baetic / Iberian / Penibaetic /
  Prebaetic systems, Montes de Toledo, Nebrodi, Peloritani, Monti Sicani,
  Lagorai, Massif des Écrins and des Cerces, Snæfellsnes, "Ultra-prominent
  peak" (6,940 views — the concept article, again).
- Named summits of a massif stay (Nordend, Signalkuppe, Zumsteinspitze,
  Dunantspitze, Grenzgipfel, Parrotspitze — the Monte Rosa tops; Pic
  Tyndall; Mont Blanc de Courmayeur); a buttress does not (Grand Pilier
  d'Angle); a seamount does not (Marsili, 3,000 m tall, −779 m at the top).
- Hillforts and archaeological hills are hills (Hill of Tara, Tap o' Noth,
  Chanctonbury Ring, Carn Fadryn); ten with odd short descriptions
  (`WIKI_VERIFIED`).

## Judgment calls for a human

- **Range tagging needs the infobox**: `range-tag.mjs` runs after
  `build-data`, and only over peaks the article pass read (the in-scope
  ones). The peaks with no `range` field (La Tournette, Ankogel, Ellmauer
  Halt, Chäserrugg…) were tagged by hand from their descriptions; a future
  `Pyrenees` or `Apennines` theme would go the same way.
- The Jura peaks (Chasseral, Le Chasseron, Mont Tendre, La Dôle, Crêt de la
  Neige, Mont d'Or) are not in `the Alps`; no Jura theme exists.
- The Faroe peaks (Gráfelli) came via "List of mountains in the Faroe
  Islands"; the Faroes are Danish and in the Nordic set.
