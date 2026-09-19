# East Asia mountains — 2026-09-18 (the East Asia wave, probe 4)

Branch `expansion-2`. Probe `scripts/expansion/probes/ea-mountains.json`
(lists only, 20 of them, 17 exist; no elevation floor; 122 views); chunk
files in `work/folded/ea/` (`new-mountains-ea.txt`, `new-mountains-ns-ea.txt`,
`qualify-ns-ea.txt`, `fixes-ea-mountains.json`). Bank 18,222 → **18,388**
(+156 peaks, +10 namesakes); 6 incumbents qualified, 2 re-pointed. Mountain
cohort 3,008 → 3,174; jackpot share 1.26% → 1.17%.

## Method

- Lists: the mountains of China (495 links), Japan (367; by height and the
  100 Famous), Korea (552 — the same page under three titles), Taiwan (290),
  Mongolia (138), Hong Kong (314), the volcanoes of Japan / China / Taiwan /
  the Koreas / Mongolia, the Ultras of East Asia. 2,294 candidates → 1,271
  read as mountains; 114 present, 31 taken, 98 fuzzy, 1,028 missing — 919
  of them under 122 views (Korea's and Hong Kong's hills).
- Sizes: Wikidata for 179 of the 207 in scope; the article pass agreed on
  every one it could read and sized 10 more; `--sister=ja,ko,zh` 1; 20 have
  no elevation anywhere and went in at `size` 0 (Mount Mian, Dinghu, Baishi,
  Qianling, Mount Laojun (Yunnan)…).
- Themes: 30 volcanoes by list membership or description (Mount Tarumae,
  Shinmoedake, Shōwa-shinzan, Mount Mihara, Hokkaido Koma-ga-take, Mount
  Nikkō-Shirane, Mount Kusatsu-Shirane, Mount Eniwa, Mount Rausu, Mount Io
  (Shiretoko) / (Akan), Khorgo, Qixing Mountain, Mount Xiqiao…); **9 into
  `the Himalayas`** by `range-tag.mjs`, which has a Himalayas table now
  (the Himalaya proper and its named himals; the Karakoram, Kunlun,
  Tanggula, Nyenchen Tanglha, Hengduan, Pamir and Altai are not it):
  Karjiang, Jongsong Peak, Labuche Kang, Khumbutse, Lingtren, Kangphu
  Kang, Kubi Gangri, Changzheng Ri. (The tool reads `src/data/mountains.json`,
  so the pipeline's build must run before it — a lesson.)

## What went in

156 rows: the high ones — Skyang Kangri (7,545; Karakoram), Jongsong Peak
(7,462), Teram Kangri (7,462), Labuche Kang (7,367), The Crown (7,295;
alias Huang Guan Shan), Karjiang (7,221), Kangphu Kang (7,204), Liushi Shan
(7,167; Kunlun's highest), Lunpo Gangri (7,095), Sepu Kangri
(6,956), Shahi Kangri (6,934), Changzheng Ri (6,916), Bairiga (6,882),
Bukadaban Feng (6,860), Kubi Gangri (6,859), Chakragil (6,760), Lingtren
(6,749), Khumbutse (6,636), Xuelian Feng (6,627), Geladaindong Peak (6,621;
the Yangtze's source), Yuzhu Peak (6,178), Mount Xuebaoding (5,588), Haba
Snow Mountain (5,396), Jiuding Shan (4,969), Tomort (4,886), Khüiten Peak
(4,356; Mongolia's highest), Mönkhkhairkhan (4,231), Tsambagarav (4,193),
Malchin Peak, Nairamdal Peak; China's Tianmen Mountain (1,519 m; the
gate), Mount Cangyan, Mount Li, Mount Liang, Tiantai Mountain, Mount
Tianzhu, Mount Jinfo, Mount Luofu, Mount Qiyun, Mount Jianglang, Mount
Jizu, Mount Wangwu, Mount Huanggang (Fujian's highest), Mount Xiaowutai,
Wuzhi Mountain (Hainan's), Kitten Mountain (Guangxi's highest), Shikengkong
(Guangdong's), Mount Dingjun, Wunü Mountain (the Goguryeo fortress), Yuelu,
Wutong, Mount Pan, Moon Hill, Mount Xiqiao, Mount E; Mongolia's Burkhan
Khaldun (2,340; Genghis Khan's), Bogd Khan Mountain, Asralt Khairkhan,
Khorgo; Japan's Mount Aino (3,190), Mount Warusawa (3,141), Mount Akaishi
(3,120), Mount Senjō (3,033), Mount Kaikoma (2,967), Mount Shirouma
(2,932), Mount Tsubakuro, Mount Hōei, Mount Nikkō-Shirane, Mount Tengu,
Mount Tateshina, Mount Kobushi, Mount Takatsuma, Mount Kusatsu-Shirane,
Mount Naeba, Mount Tomuraushi, Mount Daibosatsu, Mount Kurohime, Mount
Kirigamine, Mount Iizuna, Mount Miyanoura (Yakushima's), Mount Hakkyō,
Mount Kujū, Mount Ōmine, Mount Ōdaigahara, Mount Sobo, Mount Yufu, Mount
Kurikoma, Mount Azuma-kofuji, Mount Rausu, Mount Shari, Mount Oakan,
Mount Eniwa, Mount Tarumae, Hokkaido Koma-ga-take, Mount Tanzawa, Mount
Hakone, Mount Ashitaka, Mount Ashigara, Mount Myōgi, Mount Bukō, Mount
Kurama, Mount Ikoma, Mount Maya, Mount Miwa, Mount Wakakusa, Mount Yamato
Katsuragi, Mount Tsurumi, Mount Inasa, Mount Kinka, Mount Mikami, Mount
Omoto, Mount Yae, Mount Yonaha (Okinawa's); Korea's Mantapsan (2,205;
the nuclear test site), Taesongsan, Geumjeongsan, Chilbosan, Daedunsan,
Woraksan, Suraksan, Seonginbong (Ulleungdo's), Achasan, Gamaksan, Ansan
(Seoul); Taiwan's Mount Dabajian (3,492), Qixing Mountain, Mount Guanyin,
Taiping Mountain; Hong Kong's Tai Mo Shan (957; its highest), Lantau Peak,
Sunset Peak, Kowloon Peak, Lion Rock, Ma On Shan, Tate's Cairn, Mount
Parker, Mount Nicholson, Mount Butler, Mount Kellett, Jardine's Lookout,
Braemar Hill, Hung Fa Chai.

10 namesakes: Victoria Peak (Hong Kong's, 5,023 views; aliases The Peak,
Mount Austin — bare, beside Mount Victoria's loose "victoria"); Purple
Mountain (Nanjing) (1,035; alias Zijin Shan) beside Purple Mountain (Kerry)
(was bare); Mount Tsurugi (Toyama) (2,999 m, 913 views) beside Mount
Tsurugi (Tokushima) (was bare; Toyama's takes the bare typing); Mount Heng
(Shanxi) (the Northern Great Mountain; alias Beiyue) beside Mount Heng
(Hunan) (was bare); The Crown; Mount Davis (Hong Kong) beside Mount Davis
(Pennsylvania) (was bare); Beacon Hill (Hong Kong's, bare — beside Beacon
Mountain's loose form); Castle Peak (Hong Kong) beside the three American
Castle Peaks; Namsan (Gyeongju) beside Namsan (Seoul) (was bare); Devil's
Peak (Hong Kong) beside Devils Peak (California) (was bare).

Two incumbents re-pointed: Nyenchen Tanglha (7,162 m) to "Mount Nyenchen
Tanglha" (it pointed at the range's article), Mount Kirishima to its own
article (it pointed at Mount Karakuni, a second row's).

## Left out, and why

- Concept and list rows: Ring of Fire, Topographic prominence,
  Eight-thousander, Mountain, Summit, Ultra-prominent peak, Anglosphere,
  Sacred Mountains of China, Five Mountains of Korea, 100 Peaks of Taiwan,
  Oreum, Global Volcanism Program, Walter Weston, Kyūya Fukada, Baekdu-daegan
  (a range), Tian Shan and Sauyr Zhotasy (ranges), Izu-Tobu (a volcano
  group), Alishan National Scenic Area.
- Islands on the volcano lists (Iwo Jima, Aogashima, Izu Ōshima, Hachijō,
  Miyake, Nii, Kōzu, Mikura, Tori-shima, Nishinoshima, Iōtorishima, Oshima,
  Smith Island), submarine volcanoes and rocks (Myōjin-shō,
  Fukutoku-Okanoba, Kaitoku Seamount, Bayonnaise Rocks, Lot's Wife), the
  crater lakes (Tōya, Tazawa, Towada, Shikotsu, Ikeda, Kuttara), the
  calderas (Kikai, Aira, Aso), the Taiwanese townships on the volcano list
  (Heping, Ren'ai, Xinyi, Xiulin).
- Nyegyi Kansang (Arunachal Pradesh; India's wave, as the rivers' rule).
- 919 rows under 122 views (Korea's 400 hills, Hong Kong's 200), and the
  taken rows under it (Mount Tsurugi (Hokkaido), Mount Asahi (Yamagata),
  Mount Hotaka (Gunma), Mount Haku (Hyōgo), Palgongsan (North Jeolla),
  Jirisan (Tongyeong), Gyeryongsan (Geoje), Pyramid / Temple / Buffalo /
  Black Hill (Hong Kong), Cloud Peak (Taiwan), Mount Kaba).

## For a human

- "Name a mountain under 3,000 m" stays retired (the cap); East Asia's
  7,000 m peaks pull the other way but not enough.
- Mount Kirishima (a volcanic group by description) is kept as its own
  article rather than a duplicate of Karakuni — the "Mount" title and the
  1,700 m figure are the group's highest point; a human may prefer it out.
- `range-tag.mjs` reads the built `mountains.json`: run fetch-pageviews and
  build-data after the fold, then the tagger.
