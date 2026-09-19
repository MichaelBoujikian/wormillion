# West and Central Asia rivers, the big countries — 2026-09-19 (the West and Central Asia wave, probe 1)

Branch `expansion-2`. Probe `scripts/expansion/probes/wca-rivers-big.json`
(Turkey, Iran, Kazakhstan, Saudi Arabia, Afghanistan, Iraq; floor 80 km,
`noFigureViews` 122, `famousViews` 1000); chunk files in `work/folded/wca/`
(`new-rivers-wca.txt`, `new-rivers-ns-wca.txt`, `qualify-ns-wca.txt`). Bank
19,398 → **19,545** (+144 rivers, +3 namesakes); 1 incumbent qualified.
River cohort 5,120 → 5,267; jackpot share 1.45% → 1.40%. Five river themes
created first (`de809c0`): `Turkey`, `Iran`, `the Caucasus`, `the Middle
East`, `Central Asia`, seeded with the incumbents; the rows go in by
description (Iran's into `Iran` and `the Middle East` both).

## Method

- Tree: the six `Rivers of <country>` categories and their provincial
  subcategories (47 categories, 392 pages); the six national lists (Turkey's
  310 links, Kazakhstan's 151). 672 candidates → 405 read as rivers; 79
  present, 3 taken, 16 fuzzy, 158 missing.
- Sizes: Wikidata had a length for 152; the article pass sized 28 more and
  overrode 5; `--sister=tr,fa,ar,ru,kk` sized 16 (fawiki's طول with Persian
  digits folded; trwiki's uzunluk). 114 have no figure anywhere; 16 at
  122+ views went in at `size` 0 (Aegospotami, Pinarus, River Meles, the
  Düden, Payas, Jaghjagh, Khazir, Khersan, the Pamir River…).
- Views floor 30: 19 rows under it left out (Kazakhstan's steppe rivers at
  12–26 views).

## What went in

144 rows: Turkey's Pactolus (25 km, 1,157 views — the famous exemption;
alias Sart Çayı), Biga Çayı, Simav (alias Susurluk), Delice, Çekerek, Gök,
Eşen, Aesepus, Peri, Harşit, Kars, Hoşap, Kocasu, Efrenk, Gelevera,
Ankara River, Aegospotami, Pinarus, River Meles, the Düden, Payas;
Iran's Zarrineh (alias Jaghatu), Ghezel Ozan (720 km; alias Qizil Uzan),
Mond (735; alias Mand), Qarah Aghaj (700), Zohreh, Halil, Marun,
Seymareh, Qom (alias Qomrud), Kor, Kashafrud, Simineh, Aji Chay, Haraz,
Karaj, Shahrud, Chalus, Helleh, Gadar, Zangmar, Qarasu, Khersan, Sirwan
(alias Diyala — the Diyala's upper reach; the bank's Diyala is the Iraqi
river), Mehran (1,289 km by Wikidata — a figure the audit should check),
Alwand; Iraq's ʿAdhaim, Khazir, the Little Khabur; Syria's Queiq, Afrin,
Sajur, Jaghjagh (the Turkish border rivers); Saudi Arabia's Wadi Hanifa
(alias Wadi Hanifah) and Wadi Arar (seasonal rivers the articles call
rivers); Afghanistan's Kokcha, Kunduz, Tarnak, Harut, Khash (480),
Khanabad, Salang, Balkh (alias Balkhab), Pech, Wakhan, Alingar, Dori,
Arghistan, Andarab, Ghorband, Khulm, Sari Pul, Shirin Tagab, the Pamir
River; Kazakhstan's Uil (800), Ilek (623), Irgiz (593), Shiderti, Charyn
(alias Sharyn), Lepsy, Bukhtarma, Arys, Karatal, Kigach, Ayagöz, Sileti,
Kushum, Bolshoy Uzen and Maly Uzen (the Russian border), Kulanotpes,
Terisakkan, Ulkayak, Tokrau, Tundik, Ubagan, Or, Uba, Ulba, Akkanburlyk,
Chilik, Talgar, Issyk, Small Almaty, Kalkutan, Karakengir, Sherubainura,
Saghyz, Baikonyr, Bakanas, Bogen, Boktykaryn, Kon, Kauylzhyr, Shabakty,
Shagalaly, Sokyr, Taldy, Taldymanaka, Urzhar, Zhabay, Zharly, Zhymyky,
Zhyngyldyozek, Asa, Arshaly, Akbastau, Ashchysu, Saryozen, Kargaly, Keles,
Ak-Suu, Kara-Balta (the Kyrgyz and Uzbek border rivers); Turkmenistan's
Sumbar, Kushk, Chandyr; Armenia's Akhuryan; the Azerbaijan–Iran Bolgarchay;
the Tajik Bartang (528).

Within-chunk twins took the region: Shagan (East Kazakhstan) / Shagan
(West Kazakhstan). 3 namesakes: Aksu (Turkey) (Antalya's, 162 km) beside
Aksu (Xinjiang) and Aksu (Lake Balkhash); Karasu (Hatay) beside Karasu
(Erzurum) (was bare "Karasu" — the Euphrates' western headwater); Naryn
(East Kazakhstan) beside the Kyrgyz Naryn (bare).

## Left out, and why

- River, the Turkish Naval Forces, Intermittent river, the Lycus of
  Constantinople (vaulted over), Asopus (Greece's, on Turkey's list), Wadi
  Qanat (a stream); Pakistan's Zhob and Kech; Russia's Akhtuba, Burla and
  Uy (Tobol).
- 19 rows under 30 views; 35 under 80 km; 98 unsized under 122 views.

## For a human

- Mehran River at 1,289 km (Wikidata) — the Mehran of Hormozgan is a
  ~300 km river; the figure looks like another Mehran's or a typo. Flagged
  for the audit; over 1,000 km it answers "longer than 1,000 km".
- The Iranian rows are in `Iran` and `the Middle East` both; Turkey's in
  `Turkey` only (a `Middle East` theme that holds Turkey's rivers is a
  human's call — the region row says Middle East).
- Wadis went in only where the article calls them rivers (Wadi Hanifa,
  Wadi Arar); the Arabian Peninsula's small probe will meet many more.
