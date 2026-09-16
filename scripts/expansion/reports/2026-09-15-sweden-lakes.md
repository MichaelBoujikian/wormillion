# Sweden × lakes — coverage probe (2026-09-15)

Every article in `Category:Lakes of Sweden` and its county subcategories plus every link on "List of lakes of Sweden", filtered to lake articles, pushed through the matcher on the `lake` cohort and checked against `wikiTitle`. Area is Wikidata P2046. Script: `probe.mjs` + `sweden-lakes.json.cfg`.

## Counts

| | |
|---|---|
| articles found | **208** |
| in the bank | **20** |
| name already taken by a different bank entry (the answer is accepted, scored on the other place) | **1** |
| missing, and "X" would be **autocorrected to a different place** | **29** |
| missing, refused | **158** |


**What it says.** The 20 present are the big and famous ones (Vänern, Vättern, Mälaren, Hjälmaren, Storsjön, Siljan, Torneträsk, Hornavan, Akkajaure, Storuman, Bolmen, Åsnen…). Everything else on English Wikipedia is obscure — the most-viewed miss is Fryken at 578 views/mo — and most of the 188 are Stockholm-area ponds under 1 km² with 30 views/mo. Worth having: the 25 over 30 km² (Storavan 184 km², Stora Lulevatten, Stora Le, Dellen, Överuman, Båven, Lelång, Orsa Lake, Helgasjön, Tåkern, Ivö Lake, Mjörn…). **21 of the 29 fuzzy traps come from the word "Lake"**: "Lake Tåkern" is two edits from "Lake Vänern" and gets corrected to it, while "Tåkern" alone (6 letters, one edit of slack) is refused — the filler word inflates the edit budget. The same mechanism made 25 of Colombia's 33 river traps ("Sinú River" → "Min River"). Any addition must also go into the `Scandinavia` lake theme.

## Missing (187), by monthly views

| views/mo | area | article | note |
|---:|---:|---|---|
| 578 |  | Fryken | Chain of three lakes in Värmland, Sweden |
| 183 | 131 km² | Dellen | Lake system in Hälsingland, Sweden |
| 183 | 0.24 km² | Rissajaure | Lake in Kiruna Municipality, Sweden |
| 152 | 136.1 km² | Stora Le | Lake in Sweden |
| 122 |  | Delsjön | **fuzzy → Lake Elton (Lake Elton)** |
| 122 | 50.16 km² | Ivö Lake | **fuzzy → Uvs Lake (Uvs Lake)** |
| 122 | 54.53 km² | Mjörn (lake) | **fuzzy → Mjosa (Mjøsa)** |
| 122 |  | Brunnsviken | Lake in Sweden |
| 122 | 27.94 km² | Lake Hornborga | Lake in Sweden |
| 91 | 22.42 km² | Lake Immeln | **fuzzy → Lake Ilmen (Lake Ilmen)** |
| 91 | 19.9 km² | Mien (lake) | **fuzzy → Lake Biel (Lake Biel)** |
| 91 | 0.48 km² | Rogen (lake) | **fuzzy → Roxen (Roxen (lake))** |
| 91 | 44.06 km² | Tåkern | **fuzzy → Lake Vanern (Vänern)** |
| 91 | 0.59 km² | Flaten | Lake in Stockholm, Sweden |
| 91 | 14.63 km² | Lake Kilpisjärvi | Lake in Enontekiö, Finland, and Kiruna, Sweden |
| 91 | 0.28 km² | Långsjön, Älvsjö | Lake in Huddinge, Sweden |
| 91 | 73.1 km² | Siiddašjávri | Lake in Sweden and Norway |
| 61 | 31.48 km² | Lygnern | **fuzzy → Lake Lungern (Lake Lungern)** |
| 61 | 57.46 km² | Ånnsjön | **fuzzy → Tinnsjo (Tinnsjå)** |
| 61 | 6.42 km² | Åresjön | **fuzzy → Arreso (Arresø)** |
| 61 | 64.19 km² | Båven | Lake in Nyköping Municipality, Södermanland County, Sweden |
| 61 | 5.28 km² | Drevviken | Lake in Stockholm, Sweden |
| 61 | 0.05 km² | Fatburen | Small lake in Sweden |
| 61 | 52.93 km² | Lelång | Lake in Sweden |
| 61 | 2 km² | Luossajärvi | Lake in Kiruna, Sweden |
| 61 | 2.12 km² | Magelungen | Lake in Stockholm, Sweden |
| 61 | 18 km² | Möckeln | Lake in Sweden |
| 61 | 0.16 km² | Råstasjön | Lake in Solna Municipality, Sweden |
| 61 | 0.17 km² | Talvatissjön | Lake in Jokkmokk Municipality, Sweden |
| 61 | 0.6 km² | Trehörningen (Sjödalen) | Lake in Sjödalen, Huddinge municipality, Sweden |
| 61 | 0.11 km² | Trekanten (Stockholm) | Lake in Stockholm, Sweden |
| 61 | 0.77 km² | Växjö Lake | Lake in Växjö Municipality, Sweden |
| 61 | 32.73 km² | Åsunden, Västergötland | Lake in Västergötland, Sweden |
| 34 | 0.13 km² | Ramsjön, Haninge Municipality | Lake in Stockholm County, Sweden |
| 33 | 10.48 km² | Nedre Gautsträsket | Lake in Lapland, Sweden |
| 30 | 1.41 km² | Aspen (Botkyrka Municipality) | **fuzzy → Asnen (Åsnen)** |
| 30 | 0.79 km² | Kroksjön (Skellefteå Municipality) | **fuzzy → Storsjon (Storsjön)** |
| 30 | 4.3 km² | Måsnaren | **fuzzy → Malaren (Mälaren)** |
| 30 | 2.69 km² | Ranseren | **fuzzy → Lake Vanern (Vänern)** |
| 30 | 10 km² | Sillen | **fuzzy → Lake Ilmen (Lake Ilmen)** |
| 30 | 183.5 km² | Storavan | **fuzzy → Storuman (Storuman (lake))** |
| 30 | 14.03 km² | Yngern | **fuzzy → Lake Lungern (Lake Lungern)** |
| 30 | 1.13 km² | Albysjön (Botkyrka) | Lake between Huddinge and Botkyrka municipalities, Sweden |
| 30 | 0.73 km² | Albysjön (Tyresö) | Lake in Tyresö municipality, Sweden |
| 30 | 16.8 km² | Alkvettern | Lake in Sweden |
| 30 | 9.35 km² | Ankarvattnet | Lake in Strömsund Municipality, Sweden |
| 30 | 27.64 km² | Boren (Sweden) | Lake in Östergötland, Sweden |
| 30 | 6.35 km² | Bornsjön | Lake in Salem Municipality, Sweden |
| 30 | 0.74 km² | Bosarpasjön | Lake in Hässleholm Municipality, Sweden |
| 30 | 2.18 km² | Gammelstadsviken, Norbotten | Lake in Luleå municipality, Sweden |
| 30 | 0.19 km² | Gömmaren | Lake in Huddinge municipality, Sweden |
| 30 | 0.17 km² | Hacksjön | Lake in Botkyrka Municipality, Sweden |
| 30 | 48.53 km² | Helgasjön | Lake in Växjö Municipality in Kronobergs län in southern Småland, Sweden |
| 30 | 2.04 km² | Hornsjön | Lake in Öland, Sweden |
| 30 |  | Isbladskärret | Lake in central Stockholm, Sweden |
| 30 | 0.06 km² | Judarn | Lake in Bromma, Stockholm, Sweden |
| 30 | 59.74 km² | Karats | Lake in Lapland, Sweden |
| 30 | 2.2 km² | Kedträsket | Lake in Norsjö Municipality, Sweden |
| 30 | 0.56 km² | Kvarnsjön, Gladö | Lake in Botkyrka Municipality, Sweden |
| 30 | 0.06 km² | Kyrksjön | Lake in Stockholm, Sweden |
| 30 | 0.41 km² | Källtorpssjön | Lake in Stockholm County, Sweden |
| 30 | 0.05 km² | Laduviken | Lake in Stockholm, Sweden |
| 30 | 10.94 km² | Laitaure | Lake in Jokkmokk Municipality, Norrbotten County, Sweden |
| 30 | 6.52 km² | Lake Bästeträsk | Freshwater lake in Fleringe, Gotland |
| 30 | 4.68 km² | Lake Tingstäde | Lake in the country of Sweden |
| 30 |  | Langvatnet (Tysfjord) | Lake on the Norway-Sweden border |
| 30 |  | Lappkärret | Lake in Stockholm Municipality, Sweden |
| 30 |  | Leinavatnet | Lake between Kiruna Municipality, Sweden and Bardu, Norway |
| 30 | 0.14 km² | Lilla sjö (Hästveda socken, Skåne) | Lake in Hässleholm Municipality, Sweden |
| 30 | 0.08 km² | Lillsjön (Ulvsunda) | Lake in Stockholm, Sweden |
| 30 |  | Lillsjön, Djurgården | Lake in Stockholm Municipality, Sweden |
| 30 |  | Långhalsen | Lake in Katrineholm Municipality, Sweden |
| 30 | 0.06 km² | Lötsjön | Lake in Sundbyberg Municipality, Sweden |
| 30 | 1.07 km² | Naten | Lake in Södermanland, Sweden |
| 30 | 0.07 km² | Nedre Rudasjön | Lake in Sweden |
| 30 | 1.46 km² | Nydalasjön | Lake in Umeå, Sweden |
| 30 | 4.26 km² | Näsnaren | Lake in Katrineholm Municipality, Sweden |
| 30 | 2.58 km² | Orlången | Lake in Huddinge Municipality, Sweden |
| 30 | 52.17 km² | Orsa Lake | Lake in Dalarna, Sweden |
| 30 | 0.27 km² | Paviken | Lake in the country of Sweden |
| 30 | 5.82 km² | Rengen | Lake on the border of Norway and Sweden |
| 30 | 34.14 km² | Rostojávri | Lake on the border of Sweden and Norway |
| 30 | 7.52 km² | Rämen | Lake in Dalarna, Sweden |
| 30 | 0.04 km² | Råcksta Träsk | Lake in Stockholm, Sweden |
| 30 | 0.13 km² | Sicklasjön | Lake in Sweden |
| 30 | 0.39 km² | Stensjön, Tyresta | Lake in Tyresta National Park, Sweden |
| 30 | 162.72 km² | Stora Lulevatten | Lake in Norrbotten County, Lappland, Sweden |
| 30 | 40.11 km² | Sädvvájávrre | Lake in Arjeplog Municipality, Sweden |
| 30 | 37.79 km² | Tisnaren | Lake in Katrineholm Municipality, Sweden |
| 30 | 66.88 km² | Tjeggelvas | Lake in Arjeplog Municipality, Sweden |
| 30 | 11.74 km² | Tolken | Lake in Ulricehamn Municipality, Sweden |
| 30 | 0.77 km² | Trummen | Lake in Kronoberg County, Sweden |
| 30 |  | Uggleviken | Former bay and lake in Stockholm, Sweden |
| 30 | 0.06 km² | Ulvsjön | Lake in Nacka Municipality, Sweden |
| 30 |  | Unna Guovdelisjávri | Lake in Sweden and Norway |
| 30 | 7.26 km² | Varpan | Lake in Sweden |
| 30 |  | Vesan | Former lake in Sölvesborg Municipality, Sweden |
| 30 | 45.71 km² | Viken (lake) | Body of water |
| 30 | 39.11 km² | Väsman | Lake in Dalarna County, Ludvika Municipality |
| 30 | 27.03 km² | Yngen | Lake in Filipstad, Sweden |
| 30 | 0.69 km² | Ältasjön | Lake in Stockholm, Sweden |
| 30 | 0.35 km² | Ågestasjön | Lake in Huddinge Municipality, Sweden |
| 30 | 24.67 km² | Åmänningen | Lake in Fagersta Municipality, Sweden |
| 30 | 88 km² | Överuman | Reservoir in Sweden and Norway |
| 30 | 0.11 km² | Övre Rudasjön | Lake in Haninge municipality, Sweden |
| 28 |  | Spegeldammen | Lake in Stockholm, Sweden |
| 26 |  | Kagghamraåns sjösystem | Lake system in Sweden |
| 24 | 0.29 km² | Långsjön (Skälsätra-Tutviken) | **fuzzy → Ringsjon (Ringsjön)** |
| 24 |  | Abborrträsk | Lake in Sweden |
| 23 | 0.14 km² | Kvarnsjön, Lissma | Lake in Huddinge Municipality, Sweden |
| 23 |  | Marviken, Södermanland | Three lakes in Södermanland, Sweden |
| 23 | 0.49 km² | Torrgårdsvatten | Lake in Bohuslän, Sweden |
| 23 | 0.06 km² | Trehörningen, Hanveden | Lake in Hanveden, Huddinge municipality, Sweden |
| 22 | 8.86 km² | Drögen | Lake in Sweden |
| 22 |  | Lojsta Lakes | Lakes in the country of Sweden |
| 22 | 0.14 km² | Mörtsjön | Lake in Huddinge Municipality, Sweden |
| 21 | 1.4 km² | Grindsjön | **fuzzy → Ringsjon (Ringsjön)** |
| 21 | 0.08 km² | Saltskogsfjärden | Lake in Södertälje Municipality, Sweden |
| 20 | 5.02 km² | Gryttjen | Lake in Gävleborg County, Sweden |
| 20 | 10.12 km² | Klämmingen | Lake in Sweden |
| 20 | 0.69 km² | Tullan | Lake in Södertälje Municipality, Sweden |
| 19 |  | Båvrojávrre | Lake on the Norway-Sweden border |
| 19 | 0.84 km² | Malmsjön | Lake in Sweden |
| 18 | 26.57 km² | Gresvatnet | **fuzzy → Rossvatnet (Røsvatnet)** |
| 18 | 17.91 km² | Öljaren | **fuzzy → Malaren (Mälaren)** |
| 18 | 1.32 km² | Aspen, Katrineholm Municipality | Lake in Katrineholm Municipality, Sweden |
| 18 | 0.02 km² | Barnsjön | Lake in Tyresö Municipality, Sweden |
| 18 |  | Gautelisvatnet | Lake on the border of Norway-Sweden |
| 18 | 0.74 km² | Järlasjön | Lake in Stockholm County, Sweden |
| 18 | 4.81 km² | Kingen | Lake on the border between Sweden and Norway |
| 18 | 10.69 km² | Kolsnaren | Lake in Vingåker Municipality, Sweden |
| 18 | 21.18 km² | Labbas | Lake in Arjeplog Municipality, Sweden |
| 18 | 2.58 km² | Leirvatnet (Sørfold) | Lake on the Norway-Sweden border |
| 17 |  | Lilltjärnen (Frostviken, Jämtland, 712937-143825) | Lake in Jämtland, Sweden |
| 17 | 52.16 km² | Storvindeln Lake | Lake in Lapland, Sweden |
| 17 | 0.01 km² | Tornbergssjön | Lake in Sweden |
| 17 | 0.92 km² | Träskaten | Lake in Eskilstuna Municipality, Sweden |
| 16 | 0.19 km² | Edasjön | Lake in Uppland, Sweden |
| 16 | 1.92 km² | Gunnarsbosjön | Lake in Gävleborg County, Sweden |
| 16 | 5.12 km² | Litlumvatnet | Lake in Sweden and Norway |
| 16 | 0.79 km² | Nävsjön | Lake in Norrköping Municipality, Sweden |
| 16 | 0.21 km² | Årsjön, Tyresta | Lake in Sweden |
| 15 | 0.16 km² | Dammtorpssjön | Lake in Sweden |
| 15 | 3.46 km² | Frösjön | Lake in Sweden |
| 15 | 8.19 km² | Holderen | Lake on Norway/Sweden border |
| 15 | 1.25 km² | Kungsgårdssjön (Dalarna) | Lake in Dalarna, Sweden |
| 15 | 0.17 km² | Lundsjön–Dammsjön | Lake in Sweden |
| 15 |  | Luvsjön | Lake in Katrineholm Municipality, Sweden |
| 15 | 0.11 km² | Långsjön, Tyresta | Lake in Tyresta National Park, Sweden |
| 15 | 1.13 km² | Visnaren | Lake in Strängnäs Municipality, Sweden |
| 14 |  | Segersjön | **fuzzy → Storsjon (Storsjön)** |
| 14 | 0.19 km² | Lycksjön | Lake in Sweden |
| 14 | 0.07 km² | Långsjön, Hanveden | Lake in Huddinge Municipality, Sweden |
| 14 |  | Tjårdavatnet | Lake in Norway and Sweden |
| 14 | 1.55 km² | Tullingesjön | Lake in Botkyrka municipality, Sweden |
| 13 | 0.76 km² | Gussjön | Lake in Sala Municipality, Sweden |
| 13 | 11.22 km² | Hallbosjön | Lake in Nyköping Municipality, Sweden |
| 13 | 2.06 km² | Orrhammaren | Lake in Södermanland, Sweden |
| 13 | 0.32 km² | Tyresö-Flaten | Lake south of Stockholm, Sweden |
| 13 | 0.09 km² | Ällmora träsk | Lake in Södermanland, Sweden |
| 13 | 0.5 km² | Öran | Lake in Sweden |
| 12 | 0.07 km² | Grändalssjön | Lake in Tyresö Municipality, Sweden |
| 12 | 0.7 km² | Stora Skogssjön | Lake in Sweden |
| 12 | 0.02 km² | Svartsjön, Hanveden | Lake in Sweden |
| 12 | 7.27 km² | Vuolep Sårjåsjávrre | Lake in Norway and Sweden |
| 11 | 0.12 km² | Axaren | **fuzzy → Malaren (Mälaren)** |
| 11 | 0.01 km² | Dammträsk | Lake in Haninge municipality, Sweden |
| 11 | 9.56 km² | Likstammen | Lake in Nyköping Municipality, Sweden |
| 11 | 0.19 km² | Lissmasjön | Lake in Sweden |
| 11 | 0 km² | Ormputten | Lake in Sweden |
| 10 | 0.72 km² | Getaren | **fuzzy → Malaren (Mälaren)** |
| 10 | 0.05 km² | Kärrsjön | **fuzzy → Storsjon (Storsjön)** |
| 10 | 0.04 km² | Strålsjön | **fuzzy → Storsjon (Storsjön)** |
| 10 | 1.05 km² | Duveholmssjön | Lake in Sweden |
| 10 | 0 km² | Karptjärn | Lake in Sweden |
| 10 | 0.02 km² | Rudträsket | Lake in Södermanland, Sweden |
| 10 | 0.1 km² | Sjösmyrsjön | Lake in Hudiksvall Municipality, Sweden |
| 9 | 0.02 km² | Gölan | **fuzzy → Glan (Glan (lake))** |
| 9 | 0.62 km² | Lilla Skogssjön | Lake in Sweden |
| 8 | 0.03 km² | Lilltjärnen (Frostviken, Jämtland, 720074-142259) | Lake in Strömsund Municipality in Jämtland, Sweden |
| 8 | 0.08 km² | Somran | Lake in Sweden |
| 8 | 0.12 km² | Söderbysjön | Lake in Sweden |
| 8 | 0.03 km² | Trehörningen, Tyresta | Lake in Tyresta National Park, Sweden |
| 7 | 0.75 km² | Ältaren | **fuzzy → Malaren (Mälaren)** |
| 7 | 0.35 km² | Öringesjön | **fuzzy → Ringsjon (Ringsjön)** |
| 7 | 0.02 km² | Holmträsket | Lake in Södermanland, Sweden |
| 7 | 0.02 km² | Mörtsjön, Tyresta | Lake in Tyresta National Park, Sweden |

## Name taken (1)

Typing the name lands on another entry with the same name; the answer is accepted and scored on that one. Not a gap, but a second row can't be added under the bare name.

| views/mo | area | article | lands on |
|---:|---:|---|---|
| 61 | 70.66 km² | Storsjön (Gästrikland) | Storsjon = Storsjön |

## Present (20)

Akkajaure · Bolmen · Glan (lake) · Hjälmaren · Hornavan · Mälaren · Ringsjön · Roxen (lake) · Runn · Siljan (lake) · Sommen · Storsjön · Storuman (lake) · Torneträsk · Uddjaure · Vombsjön · Vänern · Vättern · Yngaren · Åsnen
