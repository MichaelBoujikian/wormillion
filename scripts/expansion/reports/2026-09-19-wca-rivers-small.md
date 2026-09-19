# West and Central Asia rivers, the small countries — 2026-09-19 (the West and Central Asia wave, probe 2)

Branch `expansion-2`. Probe `scripts/expansion/probes/wca-rivers-small.json`
(Georgia, Armenia, Azerbaijan, Syria, Lebanon, Israel, Palestine, Jordan,
Yemen, Oman, the UAE, Qatar, Bahrain, Kuwait, Uzbekistan, Turkmenistan,
Kyrgyzstan, Tajikistan, Cyprus; floor 60 km, `noFigureViews` 122,
`famousViews` 1000); chunk files in `work/folded/wca/` (`new-rivers-wca2.txt`,
`new-rivers-ns-wca2.txt`, `qualify-ns-wca2.txt`). Bank 19,545 → **19,642**
(+95 rivers, +2 namesakes); no incumbent qualified. The rows went into the
wave's themes by description: `the Caucasus` 39, `Central Asia` 46, `the
Middle East` 10; Cyprus's two carry none.

## Method

- Tree: the 19 `Rivers of <country>` categories and their subcategories; the
  19 national lists. **"List of rivers of Bahrain" resolved to a generic
  page (236 links)**, so ~85 river *concepts* (Meander, Thalweg, Fish
  ladder, the Syrian Navy…) came in as "rivers" with 122+ views and no
  figure; the hand-clean keeps only rows whose description names a
  river / stream / wadi / watercourse in a place, and drops the concept
  rows explicitly (Tigris–Euphrates river system, Chorath, Baseflow…). A
  list that resolves to a generic page is a probe-config bug to watch for
  in every small-country wave (Qatar's and Kuwait's lists were real).
- 414 read as rivers (1,080 skipped); 58 present, 7 taken, 9 fuzzy, 176
  missing. Sizes: Wikidata + the article pass agreed on 77, the article
  overrode 7, the article alone sized 15; the sister pass
  (`--sister=ru,tr,fa,ar,he,ka,hy,az,uz`) sized 7 more (ruwiki's Nahal Paran
  150 km; hewiki's Daliyot, Mishmar, Auja under the floor). 105 have no
  figure anywhere; none of the *place* rows at 122+ views was unsized, so
  nothing went in at `size` 0.
- Floor 60 km: 109 under it — most of Israel's and Lebanon's rivers (Nahal
  Taninim, Ayalon, the Beirut River, Nahr Ibrahim, Nahr al-Kalb, Banias,
  Dan, Zahrani, Awali, Kadisha, Damour…), Abkhazia's short coastal rivers,
  Armenia's Azat, Getar, Vedi. Views floor 30: 13 under it (Chanistsqali,
  Kichi-Kemin, Naxçıvançay, Velvelechay, Uzun-Akmat, Shamkirchay,
  Isfayramsay, Kashan (Murghab) at 252 km and 13 views…).

## What went in

95 rows: the Caucasus's Hrazdan (alias Zanga River), Debed (alias Debeda),
Vorotan (162 km; alias Bargushad), Arpa, Aghstev (alias Agstafachay),
Kasagh, Dzoraget, Voghji, Pambak (Armenia); Khrami (201 km; alias Ktsia
River), Tskhenistsqali (176), Khobi, Qvirila, Algeti, Tekhuri, Supsa,
Acharistsqali, Ksani, Dzirula, Paravani, Abasha, Mashavera, Little
Liakhvi, Natanebi (Georgia); Andi Koysu, Assa (rivers that rise in Georgia
and run mostly through Dagestan and Ingushetia — in by the source-country
category); Tartar (184; alias Terter), Hakari, Kurekchay, Pirsaat (199),
Turyan (180), Qarqarçay (alias Karkarchay), Goychay, Khachinchay, Qudyal,
Girdimanchay, Sumgayitchay, Damiraparanchay (Azerbaijan). Central Asia's
Kofarnihon (387; alias Kafirnigan), Qashqadaryo (378; alias Kashkadarya),
Gunt (296), Qizilsu (230; alias Kyzylsu), Chatkal (223), Angren (223; alias
Ohangaron), Kökömeren (199), Kara Darya (177; alias Qoradaryo), Sherobod,
Surxondaryo (alias Surkhandarya), Chirchiq (155; alias Chirchik), Kurshab,
Pskem, Ak-Buura, Shakhdara, Isfara, Sokh, Khojabakirgan, Yaghnob, Vanj,
Varzob, Yazghulom (alias Yazgulem), Mughob, Karatag, Shohimardonsoy,
Aravansay, Kara-Üngkür, Ala-Buga, At-Bashy, Jazy, Chong-Kemin, Tüp,
Jyrgalang, Jumgal, Kögart, Kökkyya, Suusamyr, Sokuluk, Ysyk-Ata, Ala-Archa,
Alamüdün, Chychkan, On-Archa, Juuku, Kara-Suu. The Middle East's Wadi Mujib
(72; alias Arnon River), Wadi al-Batin (72; Iraq–Kuwait), Wadi Bani Khalid
(156 — Oman; Wikidata's figure, flagged below), Nahal Sorek (65; alias
Soreq Stream), Nahal Paran (150), Hasbani (65; alias Snir Stream), Lakhish,
Arava Stream (100), Awaj (70), Nahr al-Kabir (60; the Syria–Lebanon
border). Cyprus's Pedieos (98; alias Pediaios) and Gialias (88; alias
Yialias).

2 namesakes: Argun (Caucasus) (148 km — the Chechen/Georgian Argun, beside
the bank's Argun of the Amur, which stays the bare holder at 1,620 km);
Tar (Kyrgyzstan) (192 km, beside North Carolina's Tar River, bare).

## Left out, and why

- The ~85 concept rows from the Bahrain list; Pharpar (the biblical name of
  the Awaj — the Awaj went in); Samur–Absheron channel (a canal);
  Reprua (Abkhazia's 18 m "shortest river", 487 views — under the famous
  bar); the Blackwater / Bar / Mountain / Wild "river" concept rows the
  taken list flagged.
- **Ak-Suu (Syr Darya)** (93 km, 30 views): a namesake of the bank's Ak-Suu
  (the Chu tributary, folded in probe 1), both Kyrgyz — qualifying both by
  region (Batken / Chüy) for a 30-view row was not worth it; left out, a
  human may disagree.
- Wadi Bih, Wadi Ham, Wadi Dayqah, Wadi Auja, Stavros tis Psokas, Alikos
  and the rest of the unsized rows under 122 views; Kara-Suu is the Aksy
  one (bare — Kyrgyzstan has several Kara-Suus, only this one is in).

## For a human

- Wadi Bani Khalid at 156 km (Wikidata, no article figure) — the oasis
  wadi of Oman's Sharqiyah; the figure may be the whole wadi system's. For
  the audit.
- Nahal Paran 150 km is ruwiki's; hewiki gives no figure. The Israeli
  rows are named Wikipedia's way (Nahal Sorek, Nahal Paran, Arava Stream)
  with the alternative as an alias where one exists.
- Andi Koysu, Assa and Argun (Caucasus) are Russian rivers by length that
  rise in Georgia; they are in the `the Caucasus` theme and the region row
  says Asia. If the Russia pass ever runs, they are already here.
- Aliases: none under six letters (a short alias makes a row eligible for
  the letter-rule variants — the Huang lesson), so Arnon, Snir, Soreq,
  Zanga, Ktsia were lengthened with "River" / "Stream".
