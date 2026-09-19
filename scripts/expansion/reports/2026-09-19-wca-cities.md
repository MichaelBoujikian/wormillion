# West and Central Asia cities — 2026-09-19 (the West and Central Asia wave, probe 8)

Branch `expansion-2`. Probe `scripts/expansion/probes/wca-cities.json` (27
national lists with `listCountry`; floor 50,000; views floor 91); chunk
files in `work/folded/wca/` (`new-cities-wca8.txt`, `new-cities-ns-wca8.txt`,
`qualify-ns-wca8.txt`). Bank 19,826 → **20,245** (+418 cities, +1
namesake); 1 incumbent qualified. Cities carry no theme; the country is
re-read from each row's description.

## Method

- 27 lists (Yemen's is "List of cities in Yemen"; the configured "cities
  and towns" title did not exist and was replaced): Turkey's 749 links,
  Iran's 1,287 (by province and plain), Lebanon's 981 (villages), Cyprus's
  445, Syria's 424. 6,205 candidates → 3,521 read as cities; 235 present,
  3 taken, 36 fuzzy, 449 missing; 1,782 under 50,000, 1,016 with no
  population (villages and towns Wikidata does not size — no article pass
  for cities, as in every wave).
- The hand-clean keeps a row when its description names a city / town /
  municipality and does not *start* with district / county / province /
  governorate / emirate / local council / village / ancient / former…
  Turkish "District and municipality in X" articles are the post-2014
  merged districts: the ones that are towns in their own right went in
  (Gebze, Çorlu, İnegöl, Manavgat, Bandırma, Akhisar, Alaşehir, Nazilli,
  Kızıltepe, Siverek…); the central districts of a metropolitan city that
  are just its halves were dropped by name (Battalgazi and Yeşilyurt of
  Malatya, Karaköprü of Şanlıurfa, Derince / Başiskele / Kartepe / Çayırova
  of İzmit, Edremit of Van) — the "il merkezi" rule. The Baku raions,
  Stepanakert (emptied in 2023; its 53,400 is the old figure), Jaffa (part
  of Tel Aviv), the Emirates (Emirate of Dubai…), the Southern District and
  Sabah Al Ahmad Sea City were dropped; the capitals never reach the fold
  (their descriptions say so). Sukhumi went in as Georgia's and North
  Nicosia as Cyprus's (the who-administers-it rule the other way round: the
  bank has no Abkhazia or Northern Cyprus, so the country the world
  recognises), both with the local name as an alias (Sokhumi, Lefkosa).
- Views floor 91: 18 rows under it (Tehran's satellite towns).
- Population figures are Wikidata's as they stand: the Iranian city
  figures are city proper; the Turkish "Municipality" rows are the urban
  belediye; **Balıkesir carries 1,250,610** — the metropolitan municipality
  that is the whole province since 2014 (the city proper is ~300,000) —
  accepted under the administrative-city convention (Chongqing, the
  Chinese prefectures) and flagged for the audit; Al Rayyan's 605,712 and
  Al-Shahaniya's 161,240 are Qatar's municipalities (baladiyat).

## What went in

418 rows — **Turkey 168** (Balıkesir, Elazığ 422k, Gebze 412k, İzmit 376k
(alias Kocaeli), Tarsus 347k, Çorlu 300k, Afyonkarahisar 300k (alias
Afyon), Adapazarı 281k, İnegöl 281k, Çorum 270k, Adıyaman, Kütahya,
Siverek, Aksaray, Manavgat, Osmaniye, Iskenderun (alias Alexandretta),
Isparta, Düzce, Uşak, Niğde, Kastamonu, Erzincan, Tokat, Zonguldak,
Kırıkkale, Karabük, Giresun, Yalova, Bolu, Iğdır, Muş, Ağrı, Bitlis,
Siirt, Hakkari, Şırnak, Cizre, Silopi, Nusaybin, Midyat, Kızıltepe,
Doğubayazıt, Malazgirt, Erciş, Tatvan, Bergama, Alaşehir, Akhisar,
Turgutlu, Salihli, Ödemiş, Tire, Nazilli, Söke, Didim, Milas, Bodrum's
neighbours, Ayvalık, Edremit, Bandırma, Gönen, Karacabey, Ceyhan, Kozan,
Erdemli, Silifke, Anamur, Serik, Polatlı, Akşehir, Beyşehir, Ereğli,
Karadeniz Ereğli, Fatsa, Ünye, Çarşamba, Bafra, Akçaabat, Lüleburgaz,
Kırklareli, Çerkezköy, Kapaklı, Sinop, Muğla, Bilecik, Bingöl, Yozgat,
Kilis, Burdur, Çankırı, Gümüşhane, Bartın, Karaman…), **Iran 141**
(Zanjan 431k, Sanandaj 413k, Qazvin 403k, Eslamshahr 448k, Gorgan 351k,
Qods 310k, Sari 310k, Malard 281k, Nishapur 264k (alias Neyshabur), Dezful
265k, Babol, Khomeynishahr, Amol, Sabzevar, Andimeshk, Pakdasht, Borujerd,
Bojnord, Saveh, Najafabad, Birjand, Qaem Shahr, Sirjan, Khoy, Ilam,
Shahr-e Kord (alias Shahrekord), Fardis, Shahinshahr, Maragheh, Malayer,
Mahabad, Saqqez, Bandar-e Mahshahr, Saqqez, Jahrom, Marvdasht, Kamal
Shahr, Torbat-e Heydarieh, Khorramshahr, Marivan, Shahreza, Behbahan,
Bandar-e Anzali, Nazarabad, Torbat-e Jam, Zabol, Chabahar, Semnan,
Miandoab, Shahrud, Rafsanjan, Bukan, Shush, Shushtar, Masjed Soleyman,
Khomeyn, Damghan, Astara, Chalus, Minab, Kashmar, Salmas…), **Syria 21**
(Douma 400k, Hasakah, Jaramana, Al-Bab, As-Safira, Jisr ash-Shughur,
Daraa, Suwayda, Manbij, Al-Hajar al-Aswad, Maarat al-Numan, Tabqa (alias
Al-Thawrah), Jableh, Al-Rastan, Abu Kamal, Nawa, Al-Tall, Al-Nabek, Khan
Shaykhun, Arbin, Da'el), **Israel 20** (Bnei Brak 194k, Bat Yam, Beit
Shemesh, Kfar Saba, Hadera, Modi'in-Maccabim-Re'ut (alias Modiin), Lod,
Ramla, Ra'anana, Rahat, Kiryat Ata, Givatayim, Nahariya, Afula, Hod
HaSharon, Rosh HaAyin, Umm al-Fahm, Kiryat Gat, Kiryat Motzkin, Ness
Ziona), **Iraq 17** (Amarah 512k, Al Diwaniyah 392k, Kut 378k, Az Zubayr
370k, Zakho, Samawah, Kufa, Al-Qa'im, Al-Qurnah, Umm Qasr, Simele, Balad
Ruz, Al-Hay, Halabja, Hit, Balad, Baiji), **Yemen 8** (Dhamar 160k,
Seiyun, Tarim, 'Amran, Saada, Al-Shihr, Sayyan, Zabid), Kazakhstan's
Zhanaozen, Jezkazgan (alias Zhezkazgan), Balkhash, Qonayev (alias
Kapchagay), Satbayev; Jordan's Russeifa 473k, Ar-Ramtha, As-Salt, Aydoun;
Palestine's Jabalia, Tulkarm, Beit Lahia, Yatta; Qatar's Al Rayyan,
Al-Shahaniya, Al Daayen; Uzbekistan's Olmaliq, Angren, Bekabad;
Azerbaijan's Khirdalan, Yevlakh, Shirvan (Azerbaijan) (beside Shirvan
(Iran) — the within-chunk twins took the country); Turkmenistan's Tejen,
Baýramaly, Magdanly; Saudi Arabia's Khamis Mushait, Sakaka, Hafar
al-Batin; Lebanon's Tripoli (Lebanon) (228k — beside the capital
Tripoli, the qualifier chosen by hand; alias Trablous) and Nabatieh;
Bahrain's Isa Town, A'ali; Afghanistan's Balkh, Baghlan, Tarinkot, Sar-e
Pol; Cyprus's North Nicosia, Strovolos; Georgia's Sukhumi; Oman's Saham;
Armenia's Hrazdan; Tajikistan's Konibodom; the UAE's Kalba.

1 namesake: Bor (Nigde) (60k, 183 views) beside **Bor, qualified (South
Sudan)**. Left out of the taken list: Palmyra (modern) (the bank's
Palmyra is the same town — Tadmur — under the ancient name; a human may
want the modern article instead) and Ariha (Idlib) (ALIAS-HELD: "Ariha"
is Jericho's alias).

## Left out, and why

- The dropped classes above; Düziçi ("Town and district of" — the
  description rule's one false negative, 84k, 244 views).
- 1,782 rows under 50,000; 1,016 unsized; 18 under 91 views.

## For a human

- Balıkesir's 1.25 M (the province); Elazığ's 422k, Adıyaman's 267k and
  the other "Municipality in Turkey" figures are the belediye's urban
  population and fine.
- Sukhumi (Georgia) and North Nicosia (Cyprus): the country column is a
  political choice; the aliases carry the other side's spelling.
- **The city jackpot share: 4.74% → 6.88%** (239 → 376 jackpots of
  5,466; the line stays 312.6 views). 136 of the 418 new rows sit under
  the line — Iran's and Turkey's provincial towns at 91–300 views are
  real cities of 50–400k that few English readers look up. The standing
  91 floor was kept (the rule of every wave); the numbers for the human
  call: a 213 floor would have left out 75 rows and put the share at
  ~5.6%, a 313 floor 136 rows and ~4.5%. The rows are in the chunk file
  with their views in `work/wca-cities.json`; `drop.mjs` takes ids.
