/**
 * Physical-geography authoring source (Spec S4/S6).
 * Format per line: Name|magnitude|alias,alias,...
 *
 * Magnitudes are standard reference figures, rounded:
 *   lakes/deserts/islands/seas  -> area in km^2
 *   rivers                      -> length in km
 *   mountains/minor peaks       -> elevation in m
 *
 * River lengths in particular vary by measurement method; one reputable figure
 * is picked per river and used consistently (Spec 6.2).
 */

export const LAKES = `
Caspian Sea|371000|the Caspian
Aral Sea|17160
Lake Superior|82100|Superior
Lake Victoria|68870|Victoria
Lake Huron|59600|Huron
Lake Michigan|58000|Michigan
Lake Tanganyika|32900|Tanganyika
Lake Baikal|31500|Baikal
Great Bear Lake|31000
Lake Malawi|29600|Malawi,Lake Nyasa
Great Slave Lake|28930
Lake Erie|25700|Erie
Lake Winnipeg|24510|Winnipeg
Lake Ontario|18960|Ontario
Lake Ladoga|17700|Ladoga
Lake Balkhash|16400|Balkhash
Lake Bangweulu|15100|Bangweulu
Lake Vostok|12500|Vostok
Lake Onega|9700|Onega
Lake Eyre|9500|Eyre,Kati Thanda
Lake Volta|8502|Volta
Lake Titicaca|8372|Titicaca
Lake Nicaragua|8264
Lake Athabasca|7850|Athabasca
Reindeer Lake|6650
Lake Turkana|6405|Turkana
Lake Issyk-Kul|6236|Issyk Kul
Lake Torrens|5745|Torrens
Lake Kariba|5580|Kariba
Lake Vanern|5650|Vanern
Nettilling Lake|5542
Lake Winnipegosis|5370|Winnipegosis
Lake Albert|5300|Albert
Lake Urmia|5200|Urmia
Lake Mweru|5120|Mweru
Lake Nipigon|4848|Nipigon
Lake Manitoba|4624|Manitoba
Lake Taymyr|4560|Taymyr
Qinghai Lake|4489|Lake Qinghai
Lake Gairdner|4351|Gairdner
Great Salt Lake|4400
Lake Saimaa|4400|Saimaa
Lake Khanka|4190|Khanka
Sarygamysh Lake|3955
Dubawnt Lake|3833
Lake Van|3755|Van
Lake Peipus|3555|Peipus
Uvs Lake|3350|Lake Uvs
Poyang Lake|3210|Lake Poyang
Lake Tana|3050|Tana
Tonle Sap|2700
Lake Vattern|1912|Vattern
Lake Okeechobee|1730|Okeechobee
Lake Pontchartrain|1630|Pontchartrain
Lake Argentino|1415|Argentino
Lake Chad|1350|Chad
Lake Champlain|1269|Champlain
Lake Toba|1130|Toba
Lake Poopo|1000|Poopo
Salton Sea|890
Lake Inari|1040|Inari
Biwa Lake|670|Lake Biwa
Lake Taupo|616|Taupo
Lake Geneva|580|Geneva,Lac Leman
Lake Constance|536|Constance,Bodensee
Nahuel Huapi|529|Lake Nahuel Huapi
Lake Tahoe|496|Tahoe
Skadar Lake|391|Lake Skadar
Lake Garda|370|Garda
Mjosa|362|Lake Mjosa
Lake Ohrid|358|Ohrid
Lake Te Anau|344|Te Anau
Yellowstone Lake|341|Lake Yellowstone
Lake Wakatipu|291|Wakatipu
Lake Prespa|273|Prespa
Lake Taal|234|Taal Lake
Lake Neuchatel|218|Neuchatel
Lake Maggiore|212|Maggiore
Mono Lake|180
Lake Como|146|Como
Lake Trasimeno|128|Trasimeno
Inle Lake|116|Lake Inle
Lake Lucerne|114|Lucerne
Lake Zurich|88|Zurich
Loch Lomond|71
Lake Bracciano|57|Bracciano
Loch Ness|56
Crater Lake|53
Lake Annecy|27|Annecy
Lake Windermere|15|Windermere
Hallstatter See|9|Lake Hallstatt
Bala Lake|4.4|Llyn Tegid
Lake Louise|0.8
Dead Sea|605
Sea of Galilee|166|Lake Tiberias,Kinneret
Lake Mead|640|Lake Meade
Lake Powell|653
Lake Havasu|79
Lake George (New York)|114
Moraine Lake|0.5
Lake Tekapo|83
Lake Pukaki|178
Lake Rotorua|79
Lough Neagh|392
Lake Lugano|48.7
Lake Thun|48.3
Konigssee|5.2|Konigsee
Chiemsee|79.9
Lake Balaton|592|Balaton
Lake Sevan|1242|Sevan
Lake Khovsgol|2760|Khovsgol Nuur
West Lake|6.5|Xi Hu
Lake Maracaibo|13210|Maracaibo
Lake Atitlan|130|Atitlan
Lake Managua|1042|Xolotlan
Lake Kivu|2700|Kivu
Lake Bled|1.45|Bled
Lake Bohinj|3.18|Bohinj
Lake Placid|9|
Lake Hillier|0.15|Hillier
Peyto Lake|5.3|Peyto
Lake Minnewanka|21|Minnewanka
Jokulsarlon|18|Jokulsarlon Glacier Lagoon,Jokulsarlon Lagoon
Lake Retba|3|Lac Rose,Pink Lake
Lake Braies|0.31|Pragser Wildsee,Lago di Braies,Braies
Lake Misurina|0.7|Misurina
Plitvice Lakes|2|Plitvice
Laguna Colorada|60|Red Lagoon
Lake Edward|2325|Edward,Lake Edwards
Lake Naivasha|139|Naivasha
Lake Nakuru|45|Nakuru
Lake Assal|54|Assal
Loch Tay|26.4
Loch Awe|39
Loch Morar|26.7
Loch Maree|28.6
Loch Shiel|19.5
Loch Katrine|12.4
Loch Rannoch|19
Loch Ericht|18.6
Loch Arkaig|16
Loch Lochy|16
Loch Earn|10.65
Loch Leven|13.3
Loch Coruisk|1
Loch Tummel|9
Loch Oich|4
Loch Garry|2.8
Loch Laggan|3.6
Loch Muick|1.2
Loch Ard|2
Loch Venachar|4
Loch Doon|8
Loch Ken|3
Lough Corrib|176
Lough Derg|130
Lough Erne|143
Lough Ree|105
Lough Mask|83
Lough Conn|50
Lough Allen|35
Lough Gill|11.3
Lough Leane|19.6
Lough Key|8.9
Lough Gur|0.6
Lough Dan|0.8
Coniston Water|4.9
Ullswater|8.9
Derwentwater|5.4|Derwent Water
Buttermere|0.9
Grasmere|0.6
Wastwater|2.9|Wast Water
Thirlmere|3.3
Haweswater|3.9|Haweswater Reservoir
Crummock Water|2.5
Ennerdale Water|3
Rydal Water|0.3
Bassenthwaite Lake|5.3
Esthwaite Water|1
Loweswater|0.6
Elter Water|0.16
Tarn Hows|0.15
Malham Tarn|0.6
Semerwater|0.5
Hornsea Mere|1.2
Llyn Padarn|1.6
Llyn Ogwen|0.4
Llyn Brenig|3.7
Llyn Trawsfynydd|4.6
Lake Vyrnwy|4.5
Llyn Idwal|0.09
Llyn Cwellyn|0.5
Llyn Gwynant|0.3
Llyn Dinas|0.28
Llangorse Lake|1.5
Rutland Water|12.6
Kielder Water|10.86
Grafham Water|5.9
Chew Valley Lake|4.8
Malaren|1090|Lake Malaren
Hjalmaren|477|Lake Hjalmaren
Storsjon (Jamtland)|456|Lake Storsjon
Siljan|292
Bolmen|184
Sommen|136
Hornavan|262
Tornetrask|330|Lake Tornetrask
Akkajaure|260
Uddjaure|249
Asnen|150|Lake Asnen
Vombsjon|12
Ringsjon|40
Roxen|95
Glan|115
Yngaren|46
Runn|50
Storuman|130
Paijanne|1081
Pielinen|894
Oulujarvi|887|Lake Oulujarvi
Pihlajavesi|713
Orivesi|601
Haukivesi|562
Keitele|494
Kallavesi|473
Nasijarvi|256|Lake Nasijarvi
Lappajarvi|145|Lake Lappajarvi
Hoytiainen|280|Lake Hoytiainen
Puulavesi|330
Yli-Kitka|122
Kemijarvi|61|Lake Kemijarvi
Pyhajarvi (Satakunta)|155|Lake Pyhajarvi
Tuusulanjarvi|6
Femunden|203
Randsfjorden|139
Tyrifjorden|139
Hornindalsvatnet|50
Gjende|14.6
Bygdin|38
Snasavatnet|122|Lake Snasavatnet
Tinnsjo|51|Lake Tinnsjo
Rossvatnet|219|Lake Rossvatnet
Altevatnet|85
Norsjo|59|Lake Norsjo
Lovatnet|10.5
Nisser|69
Thingvallavatn|84|Thingvellir Lake
Myvatn|37
Thorisvatn|83
Hvitarvatn|30
Kleifarvatn|10
Lagarfljot|40|Logurinn
Arreso|40.7|Lake Arreso
Esrum So|17.3|Lake Esrum
Fureso|9.4|Lake Fureso
Tisso|12.6|Lake Tisso
Mosso|8
Wolfgangsee|12.8
Attersee|46.2
Traunsee|24.4
Zeller See|4.6
Achensee|6.8
Mondsee|13.8
Fuschlsee|2.7
Worthersee|19.4|Lake Worth
Ossiacher See|10.8
Millstatter See|13.3
Weissensee|6.5
Faaker See|2.2
Grundlsee|4.1
Altausseer See|2.1
Plansee|2.9
Lake Starnberg|56.4|Starnberger See
Ammersee|46.6
Tegernsee|9
Eibsee|1.75
Lake Brienz|29.8|Brienzersee
Lake Zug|38.4
Lake Biel|39.5|Lac de Bienne,Bielersee
Walensee|24.2
Lake Sarnen|7.4|Sarnersee
Lake Murten|22.8|Lac de Morat,Murtensee
Lake Hallwil|10.2|Hallwilersee
Lake Greifen|8.2|Greifensee
Lake Sempach|14.4|Sempachersee
Lake Sils|4.1|Silsersee
Lake Silvaplana|3.2|Silvaplanersee
Oeschinen Lake|1.15|Oeschinensee
Lake Lungern|2|Lungerersee
Sihlsee|10.7
Klontalersee|3.2
Agerisee|7.25
Lake Lauerz|3|Lauerzersee
Blausee|0.008
Lake Idro|10.9
Lake Varese|14.9
Lake Ledro|2.17
Lake Molveno|0.36
Lake Levico|0.99
Lake Caldonazzo|5.6
Lake Mergozzo|1.85
Lake Viverone|5.6
Lake Fedaia|2
Lac d'Aiguebelette|5.45
Lake Serre-Poncon|28|Lac de Serre-Poncon
Lac de Sainte-Croix|22
Lake Cerknica|26
Lake Jasna|0.006
Lake Bolsena|114
Lake Vico|12.1
Lake Albano|6
Lake Massaciuccoli|6.8
Lake Omodeo|29
Lake Lesina|51.4
Lake Varano|60.5
Lake Heviz|0.047|Heviz
Lake Velence|26
Lake Ferto|315|Neusiedler See
Lake Tisza|127|Kiskore Reservoir
Lake Trichonida|96.5
Lake Kerkini|72
Lake Pamvotida|9.8|Lake Ioannina
Lake Vegoritida|43
Lake Volvi|68
Lake Vistonida|45
Lake Kastoria|28.2|Lake Orestiada
Lake Koronia|42
Lake Sniardwy|113.8|Sniardwy
Lake Mamry|104|Mamry
Lake Hancza|3.11|Hancza
Lake Wigry|21.9
Lake Solina|22
Lake Lebsko|71.4|Lebsko
Lake Goplo|21.5|Goplo
Steinhuder Meer|29.1
Muritz|117|Lake Muritz
Schweriner See|61.5
Titisee|1.3
Schluchsee|5.1
Grosser Ploner See|30.7|Lake Plon
IJsselmeer|1100
Markermeer|700
Lake Druksiai|44.8|Druksiai
Lake Galve|3.88|Galve
Lake Lubans|80.7|Lubans
Lake Razna|57.6|Razna
Lake Vortsjarv|270|Vortsjarv
Lake Lipno|48.7|Lipno Reservoir
Strbske Pleso|0.2
Zemplinska Sirava|33
Lake Razelm|415|Razim
Lake Snagov|5.75
Lake Techirghiol|11.6
Lake Srebarna|9
Seven Rila Lakes|0.4
Lake Varna|18.3
Lake Burgas|28
Lake Sanabria|3.7|Lago de Sanabria
Lake Banyoles|1.12
Albufera of Valencia|21.2|Albufera
Lake Alqueva|250
Lake Tuz|1500
Lake Sapanca|47
Lake Iznik|308
Lake Egirdir|482
Lake Beysehir|656
Lake Burdur|200
Lake Manyas|166|Kus Golu
Lake Uluabat|134
Lake Salda|44
Lake Aksehir|118
Lake Ercek|98
Lake Bafa|60
Lake Koycegiz|52
Lake Abant|1.28
Lake Vrana|30.7
Lake Peruca|13
Lake Bileca|33|Bilecko Lake
Busko Lake|56.7|Busko Blato
Lake Jablanica|14.3
Blidinje Lake|4.1
Lake Boracko|1.15|Boracko jezero
Lake Modrac|17
Black Lake (Montenegro)|0.52|Crno Jezero
Lake Biograd|0.03|Biogradsko jezero
Lake Palic|4.7
Lake Vlasina|11.3
Gazivode Lake|12
Lake Butrint|16.3
Lake Koman|34
Lake Fierza|72.6
Lake Dojran|43.1|Doiran Lake
Lake Mavrovo|11.5
Lake Debar|14
Lake Paravani|37.5
Lake Tabatskuri|14.2
Lake Ritsa|1.5
Lake Paliastomi|18.2
Lake Goygol|0.86|Goygol
Lake Lisi|0.17
Lake Ilmen|982
Lake Seliger|212
Lake Pleshcheyevo|51
Lake Beloye|1130
Lake Vozhe|422
Lake Lacha|345
Lake Vygozero|1250
Lake Topozero|986
Lake Pyaozero|659
Lake Nero|51.7
Lake Elton|152
Lake Baskunchak|106
Lake Manych-Gudilo|344
Lake Teletskoye|223
Lake Chany|1700
Rybinsk Reservoir|4580
Kuybyshev Reservoir|6450|Kuibyshev Reservoir
Bratsk Reservoir|5470
Krasnoyarsk Reservoir|2000
Tsimlyansk Reservoir|2700
Lake Labynkyr|4
Lake Kurilskoye|76.6|Kurile Lake
Lake Kronotskoye|246
Lake Winnipesaukee|186|Winnipesaukee
Moosehead Lake|304
Sebago Lake|119
Squam Lake|27
Lake Sunapee|16
Walden Pond|0.24
Quabbin Reservoir|100
Candlewood Lake|21
Seneca Lake|175
Cayuga Lake|172
Skaneateles Lake|35
Keuka Lake|47
Canandaigua Lake|42
Oneida Lake|207
Otsego Lake|16
Chautauqua Lake|53
Lake Winnebago|557
Lake Minnetonka|57
Mille Lacs Lake|536
Leech Lake|468
Red Lake|1160
Lake Itasca|4.7
Lake Vermilion|163|Lake Vermillion
Lake Pepin|91
Devils Lake (North Dakota)|350
Lake Sakakawea|1520|Lake Sacajawea,Sacajawea,Lake Sacagawea
Lake Oahe|1500
Lake Texoma|364
Lake of the Ozarks|213
Table Rock Lake|171
Lake Travis|63
Caddo Lake|103
Toledo Bend Reservoir|729
Reelfoot Lake|65
Kentucky Lake|648
Lake Cumberland|230
Lake Lanier|150
Lake Norman|130
Lake Murray|194
Lake Marion|487
Lake Kissimmee|141
Lake Apopka|124
Lake Elsinore|13
Shasta Lake|119
Clear Lake|176
Lake Berryessa|84
Big Bear Lake|11
Lake Arrowhead (California)|1.7
Donner Lake|1.3
Pyramid Lake (Nevada)|486
Walker Lake (Nevada)|130
Bear Lake|280
Utah Lake|385
Jackson Lake|103
Flathead Lake|510
Lake McDonald|17
Lake Chelan|130
Lake Washington|88
Lake Crescent|20
Lake Coeur d'Alene|130
Lake Pend Oreille|380
Priest Lake|63
Redfish Lake|6.2
Lake Roosevelt|324
Lake Sammamish|20
Lake Union|1
Diablo Lake|3.3
Iliamna Lake|2622
Lake Clark|110
Becharof Lake|1180
Kenai Lake|24
Skilak Lake|59
Naknek Lake|597
Emerald Lake|1.2
Garibaldi Lake|9.9
Lake Okanagan|351
Kootenay Lake|389
Lake Memphremagog|111
Lac Saint-Jean|1053
Manicouagan Reservoir|1942
Lake Mistassini|2335
Lake Melville|3069
Lake Simcoe|722
Lake Nipissing|832
Lake of the Woods|3150
Lake Muskoka|130
Lake Temagami|94
Bow Lake|3.2
Lake O'Hara|0.3
Maligne Lake|20
Abraham Lake|53.7
Lake Diefenbaker|430
Lake of Bays|118
Wollaston Lake|2681
Cree Lake|1434
Lac la Ronge|1413
Williston Lake|1761
Lake Laberge|218|Lake Lebarge
Kluane Lake|409
Atlin Lake|775
Shuswap Lake|310
Lake St. Clair|1114
Lake Chapala|1100
Lake Patzcuaro|126
Lake Texcoco|110
Lake Cuitzeo|300
Laguna de Terminos|1600
Bacalar Lagoon|42|Laguna Bacalar
Lake Catemaco|72
Lake Zirahuen|9.2
Lake Peten Itza|100
Lake Izabal|589
Lake Amatitlan|15.2
Lake Yojoa|90
Lake Coatepeque|26
Lake Ilopango|72
Lake Arenal|85
Gatun Lake|425|Lake Gatun
Lake Alajuela|17.8
Lake Enriquillo|265
Lake Azuei|113
Laguna de Apoyo|21.7
Lake Junin|142
Lake Llanquihue|860
General Carrera Lake|1850|Lake Buenos Aires
Lake Villarrica|176
Lake Ranco|442
Lake Todos los Santos|178
Lake Viedma|1088
Lake Lacar|58
Lake Fagnano|590
Mar Chiquita|6000
Lagoa dos Patos|10140
Lagoa Mirim|3750
Lake Ypacarai|60
Lake Tota|55
Laguna Verde|11.8
Lake Uru Uru|135
Lake Sobradinho|4214
Lake Valencia|350
Lake Puelo|4
Lake Futalaufquen|31
Lake Colhue Huapi|803
Lake Musters|414
Lake Cardiel|370
Lake Pehoe|3.7|Lago Pehoe
Lake Grey|33|Lago Grey
Lake Chungara|21.5
Lake Rupanco|230
Lake Puyehue|165
Lake Rinihue|77
Lake Panguipulli|116
Lake Calafquen|121
Lake Caburgua|54
Lake Colico|24
Lake Budi|55
Lake Rapel|8
Laguna Quilotoa|3|Quilotoa
Lake Cuicocha|3.2
Laguna de la Cocha|39|La Cocha Lake
Lake Calima|17
Huacachina|0.01
Laguna Paron|1.7
Laguna 69|0.02|Lake 69
Roopkund|0.001|Skeleton Lake
Lake Nasser|5250|Aswan High Dam Lake
Lake Manyara|470
Lake Natron|1040
Lake Bogoria|34
Lake Magadi|100
Lake Rukwa|3000
Lake Kyoga|1720
Lake Mai-Ndombe|2300
Lake Abbe|319|Lake Abhe
Lake Bosumtwi|49
Lake Chilwa|750
Lake Ngami|250
Lake Cahora Bassa|2739
Lake Elmenteita|18
Lake Baringo|130
Lake Shala|409
Lake Abaya|1160
Lake Ziway|434|Lake Zway
Lake Langano|230
Lake Awasa|129|Lake Hawassa
Lake Chamo|551
Lake Itasy|35
Lake Alaotra|900
Lake Nokoue|160
Lake Togo|48
Lake Nyos|1.58
Lake Monoun|0.9
Kainji Lake|1243|Kainji Reservoir
Lake Fitri|180
Lake Tumba|765
Lake Upemba|530
Lake Bunyonyi|61
Lake Mutanda|25.7
Lake Ihema|90
Lake Rweru|100
Lake Cohoha|68|Lake Cyohoha
Lake Chala|4.2
Lake Jipe|30
Lake Eyasi|1050
Lake Kitangiri|180
Lake Malombe|303
Lake Chiuta|200
Lake Guiers|300
Lake Hayq|23|Lake Hayk
Lake Ashenge|18
Lake Afrera|80
Lake Karum|500|Lake Assale
Lake Qarun|230
Lake Mariout|60|Lake Maryut
Lake Manzala|1350
Lake Burullus|410
Lake Bardawil|595
Lake Timsah|14
Great Bitter Lake|250
Lake Idku|126
Chott el Djerid|5000|Chott el Jerid
Chott Melrhir|6800
Lake of Tunis|20
Lake Ichkeul|126
Bin El Ouidane|38|Lake Bin el Ouidane
Lake Oubeira|25|Lac Oubeira
Lake Sibaya|77
Lake St Lucia|352
Sterkfontein Dam|69
Vaal Dam|321
Gariep Dam|374
Lake Fundudzi|1.13
Lake Otjikoto|0.02
Lake Guinas|0.05
Etosha Pan|4760
Makgadikgadi Pan|16000
Sua Pan|3400|Sowa Pan
Birkat Ram|0.3|Lake Ram
Lake Qaraoun|11|Qaraoun Lake
Lake Homs|66
Lake Assad|610
Lake Tharthar|2710
Lake Habbaniyah|426
Lake Razzaza|1815|Bahr al Milh
Lake Dukan|270|Dukan Lake
Darbandikhan Lake|115|Lake Darbandikhan
Zarivar Lake|2.1|Zaribar Lake
Maharloo Lake|280|Lake Maharloo
Chitgar Lake|1.3|Lake Chitgar
Hamun Lake|1500|Lake Hamun
Bakhtegan Lake|3500|Lake Bakhtegan
Tashk Lake|400|Lake Tashk
Namak Lake|1806
Lake Zaysan|1810
Lake Alakol|2650
Lake Tengiz|1590
Lake Markakol|455
Lake Borovoe|10.5|Lake Burabay
Big Almaty Lake|0.5
Kaindy Lake|0.4
Aydar Lake|3000|Lake Aydar
Karakul (Tajikistan)|380|Kara-Kul
Song-Kul|278|Song-Kol
Sary-Chelek|5
Iskanderkul|3.4
Lake Merzbacher|4
Chatyr-Kul|170
Band-e Amir|14
Sarez Lake|86|Lake Sarez
Dianchi Lake|298
Erhai Lake|250
Dongting Lake|2820
Lake Tai|2338|Taihu
Hongze Lake|2069
Chao Lake|760|Chaohu
Hulun Lake|2339
Bosten Lake|1000
Sayram Lake|458
Namtso|2000
Lake Manasarovar|410
Yamdrok Lake|638
Siling Lake|1640
Ngoring Lake|610
Gyaring Lake|526
Lugu Lake|48.5
Fuxian Lake|212|Lake Fuxian
Qiandao Lake|573
Heaven Lake|9.82|Chonji,Cheonji
Khar-Us Lake|1852
Khyargas Lake|1407
Airag Lake|145|Lake Airag
Terkhiin Tsagaan Lake|61
Achit Lake|300
Pangong Tso|604
Dal Lake|18
Wular Lake|130
Chilika Lake|1100
Vembanad Lake|2033
Loktak Lake|287
Sambhar Lake|230|Sambhar Salt Lake
Tso Moriri|120
Nainital Lake|1.4|Naini Lake
Phewa Lake|4.4|Fewa Lake
Rara Lake|10.8
Kaptai Lake|688
Lake Lanao|340
Laguna de Bay|911
Lake Maninjau|99.5
Lake Poso|323.2
Lake Matano|164.1
Indawgyi Lake|207
Songkhla Lake|1040|Lake Songkhla
Lake Batur|16
Lake Kussharo|79.3
Lake Towada|61.1
Lake Ashi|6.9
Lake Kawaguchi|6.4
Lake Mashu|19.2
Lake Shikotsu|78.4
Lake Toya|70.7
Lake Chuzenji|11.62
Lake Burley Griffin|6.64
Lake Argyle|1000
Lake Macquarie|110
Lake Wanaka|193
Lake Hawea|141
Lake Manapouri|142
Lake Ohau|55.6
Lake Tarawera|41.7
Lake Waikaremoana|54
Lake Ellesmere|181|Te Waihora
Lake Rotoiti|34
Lake Pedder|242
Great Lake|114
Lake Kutubu|49
Lake Lanoto'o|0.1
Lake Letas|7
Lake Iseo|65.3|Iseo
Storavan|183.5
Stora Lulevatten|162.72
Stora Le|136.1
Dellen|131
Overuman|52.5
Siiddasjavri|73.1|Sitasjaure
Tjeggelvas|66.88
Baven|64.19
Karats|59.74
Annsjon|57.46
Mjorn|54.53
Lelang|52.93
Orsa Lake|52.17|Orsasjon
Storvindeln Lake|52.16
Ivo Lake|50.16|Ivosjon
Helgasjon|48.53
Viken|45.71
Takern|44.06
Sadvvajavrre|40.11|Sadvajaure
Vasman|39.11
Tisnaren|37.79
Rostojavri|34.14|Rastojaure
Asunden|32.73
Lygnern|31.48
Lake Chaubunagungamaug|5.83|Webster Lake
Lake Peigneur|4.55
Tulare Lake|1780
Lake Piru|5.02
Alcohol and Drug Abuse Lake|0.38
Torch Lake|75.96
Smith Mountain Lake|83|Smith Mountain
Bde Maka Ska|1.71
Lake Jocassee|30.35
Lake Wallenpaupack|22.1
Mountain Lake|0.2
Lake Hartwell|226.62
Raystown Lake|33.59
Deep Creek Lake|14.68
Quake Lake|2.48
Lake Keowee|74.87
Higgins Lake|38.85
Lake Anna|53
Lake Willoughby|6.82
Jacqueline Kennedy Onassis Reservoir|0.43
Lake Austin|6.5
Possum Kingdom Lake|80.13
Lewis Smith Lake|84.98
Lake Gaston|80
Lake Oconee|77.18
Lake Martin|180
Lake Eufaula|412
Great Sacandaga Lake|83.57
Percy Priest Lake|57.47
Lady Bird Lake|1.89
Lake Hopatcong|10.36
Kerr Lake|200
Lake Las Vegas|1.29
Onondaga Lake|12
Elephant Butte Reservoir|147.71
Grand Lake o' the Cherokees|188
John D. Long Lake|0.32
Lake Ouachita|160
Lake Almanor|114
Lake Merritt|0.57
Convict Lake|0.69
Dillon Reservoir|13.08
Blue Mesa Reservoir|37.15
Lake McConaughy|144.47
Lake Monona|13
Beaver Lake|128.29
Lake Mendota|39.4
Lake Allatoona|48.6
Lake Ray Hubbard|92.05
West Okoboji Lake|15.57
America Lake|0.05
Kingsley Lake|8.09
Gibbons Creek Reservoir|11.21
Canyon Lake|33.31
Jenny Lake|4.96
Indian Lake|23
Chebacco Lake|0.85
Saint Mary Lake|15.8
Chatuge Lake|28
Sam Rayburn Reservoir|463.37
Lewisville Lake|119.75
Rainy Lake|932
Sylvan Lake|0.07
Grand Lake|2.05
Upper Klamath Lake|250
Truman Reservoir|225.01
Watauga Lake|26.02
Bull Shoals Lake|182.72
Flaming Gorge Reservoir|170.05
Fort Peck Lake|991.48
Lake Drummond|13
Lake Wawasee|12
Cass Lake|5.2
Lake Isabella|44.52
Lake Burton|11.23
Dale Hollow Reservoir|125.41
Guntersville Lake|279.23
Crystal Lake|39.88
Jordan Lake|56.4
Lake of the Clouds|0.54
Greenwood Lake|7.8
Lake Conroe|85
Douglas Lake|115
Green Lake|29.73
Lake Wylie|54
Old Hickory Lake|91.05
Folsom Lake|46.3
Lake Jesup|64.75
Walloon Lake|17.28
Lake Strom Thurmond|287.73
Gun Lake|10.85
Houghton Lake|81.12
Shaver Lake|8.81
Castaic Lake|8.94
Newfound Lake|16.6
Henderson Lake|1.14
Honey Lake|222.74
Lake Mohave|107
San Luis Reservoir|51
Tenkiller Ferry Lake|52.2
Hume Lake|0.35
Lake Cushman|16.25
Lake Nacimiento|21.85
Theodore Roosevelt Lake|86.98
Cachuma Lake|12.55
Kensico Reservoir|8.66
Lake Butte des Morts|34.7
Lake James|27.6
Lake Livingston|336
Lake Seminole|152
Lake Sinclair|62.04
Lake Tapps|9.85
Tule Lake|52.61
Badin Lake|21.7
Center Hill Lake|73.73|Center Hill
Lake Barkley|234
Monroe Lake|43.5
Lake Oroville|63
Hebgen Lake|50.84
High Rock Lake|61.43
Lake Charlevoix|69.88
Greers Ferry Lake|163.9
Lake Buchanan|90.4
Lake Koshkonong|42.33
Lake Waccamaw|36.17
Grapevine Lake|29.46
Laguna Madre|1136.8
Lake Whitney|95.83
Banks Lake|108.8
Lake Gogebic|54.15
Lake Tawakoni|149
Rogers Dry Lake|112
Sevier Lake|487
Weiss Lake|122.22
Broken Bow Lake|56.66
Carlyle Lake|105.22
Gull Lake|40.25
Lake Lyndon B. Johnson|26.44
Lake Moultrie|242.81
Lake Winnibigoshish|228.53
Patoka Lake|35.61
Ross Barnett Reservoir|134.68
Pickwick Lake|174
Pymatuning Reservoir|69.15
Strawberry Reservoir|69.46
Waldo Lake|26
Big Stone Lake|51
Castle Rock Lake|67.34
Cherokee Lake|116.47
Falcon International Reservoir|353.7
Goose Lake|380
Joe Pool Lake|31.32
Mark Twain Lake|75.27
Mooselookmeguntic Lake|65.96
Sardis Lake|398.7
Big Sandy Lake|26.41
Lake Palestine|103.4
Lake Tohopekaliga|91.86
Navajo Lake|63.13
Chickamauga Lake|146.66
Lake Fork Reservoir|110.33
Lake Houston|47.97
Lake Shelbyville|44.92
Moses Lake|27.17
Mullett Lake|67.3
Rend Lake|76.49
Tims Ford Lake|43.3
Wilson Lake|36.6
Allegheny Reservoir|48.56
Cave Run Lake|33.47
Don Pedro Reservoir|52.61
Falls Lake|50
Lake Abert|147.63
Logan Martin Lake|68.8
New Melones Lake|51
Ross Lake|47.35
Lake Bemidji|28
Petenwell Lake|93.78
Umbagog Lake|31.8
Amistad Reservoir|262.64
Eagle Lake|97
Foss Reservoir|35.61
Lake Chippewa|59.06
Lake Corpus Christi|73.88
Lake Francis Case|412.78
Lake Red Rock|62.81
Lake Waco|33.14
Owasco Lake|27.45
Belton Lake|50.12
Flagstaff Lake|82
Great Pond|34.53
Hubbard Lake|35.8
Lavon Lake|86.6
Lewis and Clark Lake|130
Milford Lake|63.54
Stockton Lake|101.01
Walter F. George Lake|182.84
Watts Bar Reservoir|157.83
Burt Lake|69.3
Canyon Ferry Lake|135.71
Great Salt Plains Lake|37.64
Lake Maurepas|240
Lake Wedowee|43.14
Mosquito Creek Lake|31.77
Kaw Lake|68.8
Lake Meredith|87.57
Lake Ray Roberts|103.6
Lake Wisconsin|38
Pomme de Terre Lake|32
Rangeley Lake|25.5
Lake Wateree|56.11
Tuttle Creek Lake|50
West Point Lake|104.67
Camanche Reservoir|31.16
Elk Lake|31.28
Rathbun Lake|44.52
Richland-Chambers Reservoir|167.36
South Holston Lake|30.68
Summer Lake|101.17
Wheeler Lake|272
Choke Canyon Reservoir|103.88
Cranberry Lake|28.23
Lake Blackshear|34.4
Lake Dardanelle|161.87
Otter Tail Lake|54.39
Ozette Lake|29.5
Clinton Lake|28.33
East Grand Lake|64.41
John Martin Reservoir|47.18
Lake Hamilton|29.14|Lake Catherine
Lake Harris|61
Lake Limestone|55.36
Saganaga Lake|56
Perry Lake|45.11
Richard B. Russell Lake|107.85
Riffe Lake|45.41
San Carlos Lake|78.91
Willard Bay|40.06
El Dorado Lake|32.37
Lake Granbury|33.63
Lake O' the Pines|75.6
Lake Wappapello|33.99
Oologah Lake|117.36
Red Bluff Reservoir|45.3
Smithville Lake|29.1
Tustumena Lake|295.42
Waconda Lake|51
Burntside Lake|28.89
Cheney Reservoir|38.65
Cross Lake|34.7
Fern Ridge Reservoir|37.88
Ivanpah Lake|34
Malheur Lake|201
Orange Lake|50.79
Skiatook Lake|42.49
Teshekpuk Lake|828.8
Barren River Lake|40.87|Barren River
Beaver Dam Lake|27.19
Chesuncook Lake|102
DeGray Lake|55.85
East Lake Tohopekaliga|48.43
Grenada Lake|141.64
Lake Istokpoga|113
Manistique Lake|40.99
Millwood Lake|118.17
Owyhee Reservoir|56.25
Schoodic Lake|28.41
Shawano Lake|25
Stillhouse Hollow Lake|26.02
Turtle-Flambeau Flowage|52.37
Conchas Lake|38.85
Crab Orchard Lake|28.19
Harlan County Reservoir|53.62
Lake Bridgeport|48.38
Lake Conway|27.11
Lake Osakis|25.37
Lake Summit|67.18
O.H. Ivie Lake|80.94
Robert S. Kerr Reservoir|174.01
Wright Patman Lake|82.15
Bois D'Arc Lake|67.34
Calcasieu Lake|198.91
Fort Loudoun Lake|55.72
Graham Lake|37.97
Lake Altus-Lugert|25.33
Lake Claiborne|25.9
Lake D'Arbonne|62
Lake Onalaska|31.11
Lake Phelps|67.18
Lake Poygan|56.75
Lake Saint Francis|272
Lake Sharpe|230.2
Lake Texana|39.36
Neely Henry Lake|45.32
Rodman Reservoir|52.61
Shoshone Lake|31
Wickiup Reservoir|45
Blue Cypress Lake|26.3
Cedar Bluff Reservoir|27.8
Cordell Hull Lake|48.4
Fletcher Pond|36.42
Lake Brownwood|29.54
Lake Maumelle|36
Lake Thompson|65.7
Lake Verret|56.98
Rosamond Lake|35
Tsala Apopka Lake|77
Agency Lake|37.63
C. J. Strike Reservoir|30.35
Catahoula Lake|121.41
Chamberlain Lake|44.24
Doctors Lake|33.67
Fontenelle Reservoir|32.37
Harney Lake|106.84
John Redmond Reservoir|38.04
Lake Earl|27.92
Lake Eustis|31.7
Lake Lahontan|40
Melvern Lake|27.97
Namakan Lake|97.4
Newnans Lake|30.42
Pemadumcook Chain of Lakes|74.06
Prado Reservoir|26.71
Richardson Lakes|31.37
Spednic Lake|70
Twin Buttes Reservoir|36.75
Big Lake|42.27
Caballo Lake|44.52
Hugo Lake|53.62
Jim Chapman Lake|78.12
Lac des Allemands|49
Lake DuBay|27.11
Lake Kickapoo|25.09
Waubay Lake|62.89
Willow Reservoir|25.52
E.V. Spence Reservoir|60.5
Imperial Reservoir|28
Lake Cataouatche|37.55
Lake Entiat|29.02
Lake Palourde|46.62
Lake Walcott|44.52
Lake Wister|30
Meddybemps Lake|27.38
Selawik Lake|1046.36
Stump Lake|63.71
Waurika Lake|40.47
Aleknagik Lake|89.5
Crooked Lake|41.9
Crump Lake|31.08
Kukaklek Lake|173.72
Lake Elwell|60.06
Lake Wanapum|58.12
R.E. "Bob" Woodruff Lake|51.8
Silver Lake|42.29
Tom Steed Reservoir|25.9
Whitefish Lake|29.8
Baskahegan Lake|27.58
Hop Brook Lake|42.48
Imuruk Lake|68
Lake Herbert G. West|26.67
Lake Latt|26.63
Millinocket Lake|34.69
Nerka Lake|193
Pelican Lake|46.7
Tazlina Lake|158
Togiak Lake|39
Ugashik Lakes|199.4
Webbers Falls Lake|46.94
Mother Goose Lake|28.5
John Paul Hammerschmidt Lake|31.16
Ladybower Reservoir|2.1
The Serpentine|0.16
Llyn Celyn|3.2
Derwent Reservoir|0.71
Lake of Menteith|2.52
Dozmary Pool|0.15
Hanningfield Reservoir|3.52
Lough Hyne|0.6
Geiseltalsee|18.4
Laacher See|3.31
Walchensee|16.4
Muggelsee|7.4|Mueggelsee
Mohne Reservoir|10.67|Moehne Reservoir,Mohnesee,Moehnesee
Bachalpsee|0.08
Mummelsee|0.04
Lake Toplitz|0.54|Toplitzsee
Gruner See|0.07|Gruener See
Seealpsee|0.14
Plauer See|38.4
Lac du Bourget|44.5|Lake Bourget,Bourget
Etang de Thau|70.12|Thau,Lake Thau,Bassin de Thau
Etang de Berre|155.3|Berre
Lake Der-Chantecoq|48|Lac du Der,Lake Der
IJmeer|80
Lac de Grand-Lieu|62.92|Grand-Lieu,Lake Grand-Lieu
Lac d'Hourtin-Carcans|56.67|Hourtin,Lac de Hourtin
Etang de Cazaux et de Sanguinet|55|Cazaux,Lac de Cazaux
Grevelingen|110|Grevelingenmeer
Lac de Biscarrosse et de Parentis|35.4|Biscarrosse,Lac de Biscarrosse
Gooimeer|26.7
Veluwemeer|32.5
Etang de Vaccares|65|Vaccares
Ketelmeer|35
Etang de Leucate|54|Leucate
Etang de l'Or|30|Lagoon of Or
Lake Orta|18.2|Lago d'Orta,Orta
Reschensee|6.6|Lake Reschen,Lago di Resia
Lake Avernus|0.55|Avernus,Lago d'Averno
Lagoa do Fogo|1.36
Lago di Tenno|0.25|Lake Tenno
Lake Nemi|1.67|Nemi,Lago di Nemi
Lake Predil|1
Lagoa das Sete Cidades|4.35|Sete Cidades
Laguna di Orbetello|26.9|Orbetello
Valdecanas Reservoir|73
Lake Bodom|3
Salvatnet|44.96
Kroderen|43.91
Keurusselka|117.3
Vanajavesi|149.76
Jolstravatnet|39.25
Vesijarvi|107.57
Iesjavri|68.16
Langisjor|26
Halslon Reservoir|57
Lake Hornborga|28
Lokka Reservoir|216
Lundevatnet|27.49
Mosvatn|79.1
Puruvesi|420.86
Storglomvatnet|28.59
Suvasvesi|233.58
Totak|37.26
Tunnsjoen|100.18
Oyeren|84.74
Aursunden|46.04
Fyresvatnet|49.68
Hop|29
Isojarvi|38.82
Juojarvi|219.54
Lake Lestijarvi|64.74
Lohjanjarvi|88.22
Roine|54.59
Rosskreppfjorden|29.51
Selbusjoen|57.9
Sperillen|37.32
Suldalsvatnet|28.83
Pyhajarvi (Pirkanmaa)|121.61
Pyhajarvi (Northern Ostrobothnia)|121.8
Storsjon (Gastrikland)|70.6
Lough Derg (County Donegal)|8.81
Geneva Lake|21
Devil's Lake (Wisconsin)|1.51
Pyramid Lake (California)|5.1
Lake George (Florida)|186.16
Black Lake (Michigan)|40.99
Black Lake (New York)|31.79
Crescent Lake|64.59
Black Lake (Louisiana)|28
Lake Arrowhead (Texas)|60.58
Walker Lake (Alaska)|37
`;

export const RIVERS = `
Nile|6650|the Nile
Amazon|6400|Amazon River
Yangtze|6300|Chang Jiang
Yellow River|5464|Huang He
Yenisei|5539
Ob|3650-5410|Ob River
Parana|4880|Parana River
Congo River|4700|Congo,Zaire River
Amur|2824-4444
Lena|4400|Lena River
Mekong|4350
Mackenzie|4241|Mackenzie River
Niger River|4200
Brahmaputra|3848
Missouri|3767|Missouri River
Mississippi|3766-6275|Mississippi River
Madeira|3250|Madeira River
Purus|3211
Yukon|3190|Yukon River
Rio Grande|3051|Rio Bravo,Rio Bravo del Norte,Grande
Saint Lawrence|3058|St Lawrence
Sao Francisco|2914|San Francisco
Volga|3531|Volga River
Indus|3180|Indus River
Danube|2850|the Danube,Donau,Dunaj,Duna,Dunav,Dunarea,Danubio
Salween|2815
Euphrates|2800
Tocantins|2699
Vilyuy|2650
Araguaia|2627
Nelson River|2575|Nelson
Zambezi|2574
Paraguay River|2549
Ganges|2525|the Ganges
Kolyma|2513
Pilcomayo|2500
Ural River|2428|Ural
Arkansas River|2364|Arkansas
Colorado River|2330|Colorado
Olenyok|2292
Aldan|2273
Ubangi|2270
Negro River|2250|Rio Negro,Negro
Orange River|2200|Orange
Pearl River|2200|Zhu Jiang
Irrawaddy|2170
Orinoco|2140
Tarim River|2030|Tarim
Dnieper|2201|Dnepr,Dnipro
Columbia River|2000|Columbia
Red River|2190
Don|1870|Don River
Tigris|1850
Uruguay River|1838|Uruguay
Xingu|1815
Kama|1805
Snake River|1735|Snake
Churchill River|1609|Churchill
Maranon|1600
Ohio River|1579|Ohio
Darling|1472|Darling River
Murray|2508|Murray River
Rhine|1230|the Rhine,Rhein,Rhin,Rijn
Ottawa River|1271|Ottawa
Elbe|1094|Labe
Vistula|1047|Wisla,Weichsel
Tagus|1007|Tejo,Tajo
Loire|1006|Loira
Meuse|925|Maas,Mosa
Ebro|930|Ebre
Douro|897|Duero
Oder|854|Odra
Seine|777|Sena
Guadalquivir|657
Po|652|Po River
Tiber|406|Tevere,Tibre
Shannon|360|River Shannon
Severn|354|River Severn
Thames|346|River Thames,Tamise,Themse
Trent|298|River Trent
Wye|250|River Wye
Tay|188|River Tay
Clyde|176|River Clyde
Spey|172|River Spey
Aire (Yorkshire)|148|River Aire
Liffey|132|River Liffey
Avon (Bristol)|121|Bristol Avon
Medway|113|River Medway
Ouse|84|River Ouse
Cam|64|River Cam
Jordan River|251|Jordan
Rhone|813|Rhone River,Rodano
Vltava|430|Moldau
Sava|990
Drava|710|Drau
Neva|74|Newa
Yamuna|1376
Godavari|1465
Krishna River|1400|Krishna
Narmada|1312
Sutlej|1450
Chenab|960
Amu Darya|2620
Helmand River|1150|Helmand
Chao Phraya|372
Han River|514
Songhua|1897
Waikato River|425|Waikato
Clutha River|338|Clutha
Swan River (Western Australia)|72
Yarra River|242|Yarra
Brisbane River|344
Limpopo|1750
Senegal River|1086
Gambia River|1120
Volta River|1500
Blue Nile|1450
White Nile|3700|Victoria Nile,Albert Nile,Bahr el Jebel
Moselle|544|Mosel
Main|527|Main River
Weser|452
Tisza|966|Theiss,Tisa
Guadiana|829
Adige|410|Etsch
Arno|241
River Tweed|156|Tweed
River Forth|47|Forth
River Exe|82|Exe
Dee (Wales)|113|Dee
River Bann|129|Bann
Mersey|113|River Mersey
Humber|62
Tyne|118|River Tyne
Wear|96|River Wear
Tees|137|River Tees
Ribble|121|River Ribble
Lune|71|River Lune
Eden|145|River Eden
Derwent (Derbyshire)|107
Calder|72|River Calder
Wharfe|96|River Wharfe
Nidd|55|River Nidd
Swale|117|River Swale
Ure|129|River Ure
Great Ouse|230|Bedford Ouse
Nene|161|River Nene
Welland|105|River Welland
Witham|132|River Witham
Hull|32|River Hull
Orwell|22|River Orwell
Lea|68|River Lea
Wandle|14|River Wandle
Fleet|6|River Fleet
Mole|80|River Mole
Wey|56|River Wey
Kennet|72|River Kennet
Windrush|64|River Windrush
Cherwell|43|River Cherwell
Itchen|43|River Itchen
Test|64|River Test
Arun|58|River Arun
Adur|32|River Adur
Cuckmere|32|River Cuckmere
Stour (Kent)|64
Frome|64|River Frome
Piddle|40|River Piddle
Axe|35|River Axe
Otter|33|River Otter
Teign|48|River Teign
Dart|32|River Dart
Tamar|98|River Tamar
Tavy|31|River Tavy
Plym|24|River Plym
Fal|43|River Fal
Fowey|39|River Fowey
Camel|48|River Camel
Torridge|58|River Torridge
Taw|69|River Taw
Parrett|60|River Parrett
Tone|32|River Tone
Avon (Warwickshire)|154|Warwickshire Avon
Teme|82|River Teme
Lugg|68|River Lugg
Monnow|56|River Monnow
Usk|123|River Usk
Taff|68|River Taff
Ebbw|35|River Ebbw
Tawe|48|River Tawe
Tywi|103|River Tywi,Towy
Teifi|122|River Teifi
Cleddau|40|River Cleddau
Ystwyth|33|River Ystwyth
Rheidol|30|River Rheidol
Dyfi|30|River Dyfi,Dovey
Mawddach|30|River Mawddach
Glaslyn|32|River Glaslyn
Conwy|43|River Conwy
Clwyd|48|River Clwyd
Vyrnwy|118|River Vyrnwy
Ness|12|River Ness
Findhorn|101|River Findhorn
Deveron|98|River Deveron
Esk|32|River Esk
Earn|75|River Earn
Almond|46|River Almond
Water of Leith|38
Annan|79|River Annan
Nith|113|River Nith
Doon|26|River Doon
Ayr|66|River Ayr
Kelvin|34|River Kelvin
Tummel|96|River Tummel
Oykel|32|River Oykel
Carron|32|River Carron
Beauly|48|River Beauly
Lochy|11|River Lochy
Nevis|15|River Nevis
Coe|10|River Coe
Awe|10|River Awe
Helmsdale|34|River Helmsdale
Thurso|48|River Thurso
Boyne|112|River Boyne
Barrow|192|River Barrow
Nore|140|River Nore
Suir|184|River Suir
Slaney|117|River Slaney
Munster Blackwater|169
Lee|89|River Lee
Bandon|72|River Bandon
Moy|90|River Moy
Corrib|6|River Corrib
Erne|129|River Erne
Foyle|11|River Foyle
Lagan (Northern Ireland)|70|River Lagan
Bush|53|River Bush
Suck|132|River Suck
Fergus|60|River Fergus
Dodder|26|River Dodder
Tolka|25|River Tolka
Poddle|8|River Poddle
Avoca|13|River Avoca
Dargle|24|River Dargle
Garavogue|16|River Garavogue
Garonne|602|Garona
Dordogne|483
Gironde|75
Charente|381
Vienne|372
Creuse|255
Indre|280
Cher|368
Allier|421
Loir|317
Sarthe|313
Mayenne|202
Vilaine|225
Blavet|149
Aulne|144
Rance|100
Couesnon|90
Vire|128
Orne|170
Eure|225
Oise|341
Aisne|353
Marne|514
Ourcq|110
Yonne|293
Loing|166
Essonne|100
Bievre|33
Somme|245
Canche|96
Aa (France)|89
Lys|202|Leie
Scarpe|100
Scheldt|350|Escaut,Schelde,Escalda
Sambre|190
Semois|210
Aube|248
Saone|480
Doubs|453
Loue|125
Ognon|170
Ill (France)|223
Ain|190
Isere|286
Arc|148|Arc de Maurienne
Drac|130
Romanche|78
Arve|107
Ardeche|125
Ceze|128
Gardon|127
Herault|148
Orb|136
Aude|224
Tet|120
Durance|305
Verdon|175
Sorgue|31
Var|114
Argens|116
Huveaune|47
Tarn|380
Aveyron|291
Agout|182
Lot|485
Cele|75
Truyere|170
Baise|190
Gers|178
Ariege|170
Adour|335
Gave de Pau|175
Gave d'Oloron|40
Nive|79
Bidasoa|69
Leyre|104
Dronne|203
Isle|255|River Isle,Isle River
Vezere|211
Correze|86
Lesse|90
Ourthe|175
Ambleve|92
Vesdre|72
Dyle|86|Dijle
Senne|103
Dender|65
Rupel|12
Demer|90
Yser|78
Sure|173|Sauer
Alzette|71
Our|60
IJssel|125|Yssel
Waal|85
Lek|61
Amstel|31
Vecht|68
Dommel|93
Rur|165|Roer
Geul|58
Zaan|18
Spaarne|14
Rotte|17
Schie|8
Neckar|362
Ruhr|219
Lahn|242
Sieg|155
Wupper|116
Lippe|220
Ahr|85
Nahe|125
Kinzig (Main)|86
Enz|105
Kocher|168
Jagst|190
Tauber|129
Regnitz|60
Pegnitz|110
Nidda|90
Fulda|218
Werra|292
Eder|177
Aller|211
Leine|281
Oker|128
Ilmenau|101
Hunte|182
Ems|371|Eems
Eider|188
Trave|124
Warnow|155
Peene|85
Havel|325
Spree|400
Dahme|95
Panke|29
Saale|413
Weisse Elster|257
Unstrut|192
Ilm (Thuringia)|68
Pleisse|90
Mulde|124
Schwarze Elster|188
Neisse|252|Lusatian Neisse,Nysa Luzycka
Isar|295
Amper|188
Wurm|35
Loisach|113
Lech|264
Wertach|61
Iller|147
Altmuhl|227
Naab|165
Regen|84
Vils (Danube)|105
Inn|517
Salzach|225
Alz|60
Mangfall|59
Wornitz|141
Rems|78
Blau|21
Argen|60
Wutach|48
Dreisam|29
Mur|447|Mura
Murz|94
Enns|254
Steyr|45
Traun|153
Krems (Lower Austria)|25
Kamp|153
Ybbs|130
Traisen|90
Leitha|180
Raab|253
Gurk|157
Gail|70
Isel|58
Ziller|48
Sill|32
Otztaler Ache|50
Bregenzer Ach|35
Aare|288|Aar
Reuss|158
Limmat|36
Linth|50
Thur|130
Toss|57
Sihl|73
Emme|80
Saane|126|Sarine
Sense|49
Broye|60
Orbe|42
Birs|73
Ticino|248
Maggia|57
Verzasca|30
Landquart|43
Plessur|33
Hinterrhein|64
Vorderrhein|72
Kander|44
Simme|57
Lutschine|6
Vispa|38
Dranse|45
Adda|313
Oglio|280
Mincio|75
Sesia|138
Dora Baltea|160
Dora Riparia|125
Tanaro|276
Bormida|91
Scrivia|95
Trebbia|115
Taro|126
Parma|92
Secchia|172
Panaro|148
Reno|212
Savio|126
Marecchia|70
Rubicon|29
Metauro|105
Chienti|96
Tronto|115
Pescara|145
Sangro|122
Biferno|95
Ofanto|134
Bradano|120
Basento|149
Crati|91
Sele|64
Calore|108
Volturno|175
Garigliano|38
Liri|158
Aniene|99
Nera|116
Velino|90
Fiora|84
Ombrone|161
Orcia|60
Cecina|79
Elsa|62
Bisenzio|49
Sieve|60
Serchio|111
Magra|62
Bisagno|25
Roya|59
Piave|220
Brenta|174
Bacchiglione|118
Livenza|112
Tagliamento|170
Isonzo|136|Soca
Natisone|55
Sile|95
Avisio|89
Sarca|65
Chiese|160
Isarco|96|Eisack
Rienza|80|Rienz
Passirio|42|Passer
Stura di Lanzo|68
Stura di Demonte|111
Pellice|53
Chisone|49
Toce|84
Lambro|130
Olona|71
Seveso|52
Serio|124
Brembo|66
Mella|96
Simeto|113
Salso|144
Platani|104
Belice|107
Alcantara|52
Anapo|32
Ciane|8
Oreto|32
Tirso|152
Flumendosa|127
Coghinas|115
Temo|90
Mino|340|Minho
Sil|225
Ulla|132
Navia|90
Nalon|129
Sella|60
Cares|42
Nervion|72
Oria|66
Urumea|54
Pisuerga|283
Carrion|141
Arlanzon|136
Esla|265
Orbigo|130
Tormes|284
Jarama|194
Manzanares|92
Henares|130
Alberche|178
Tietar|148
Alagon|198
Jerte|76
Genil|359
Guadalete|172
Guadalhorce|166
Guadalmedina|42
Guadiaro|84
Guadalfeo|74
Andarax|58
Segura|325
Vinalopo|82
Jucar|498
Cabriel|220
Turia|280
Mijares|156
Aragon|195
Arga|145
Gallego|191
Cinca|179
Esera|85
Segre|265
Noguera Pallaresa|143
Noguera Ribagorcana|133
Valira|34
Llobregat|170
Cardener|79
Besos|17
Ter|208
Fluvia|97
Muga|61
Francoli|46
Jalon|130
Jiloca|122
Huerva|128
Guadalope|194
Mondego|258
Vouga|148
Cavado|118
Ave|90
Lima|108
Sado|175
Mira|130
Zezere|214
Tamega|175
Tua|108
Sabor|172
Coa|136
Paiva|110
Dao|108
Nabao|62
Sorraia|130
Arade|40
Warta|808
Bug|772
Narew|484
San|443
Wieprz|303
Pilica|342
Dunajec|247
Poprad|169
Raba|131
Sola|88
Nida|151
Bzura|166
Drweca|207
Brda|245
Notec|388
Prosna|217
Obra|164
Barycz|133
Bobr|272
Kwisa|130
Bystrzyca|95
Nysa Klodzka|182
Klodnica|84
Olza|88
Przemsza|88
Wislok|218
Wisloka|163
Lyna|264
Pasleka|169
Wkra|249
Liwiec|141
Krzna|141
Parseta|146
Rega|100
Slupia|138
Leba|117
Reda|50
Radunia|103
Motlawa|41
Pisa|90
Biebrza|155
Suprasl|93
Rospuda|84
Czarna Hancza|142
Morava|354
Dyje|306
Svratka|173
Svitava|97
Jihlava|184
Becva|61
Opava|131
Ostravice|65
Ohre (Czechia)|316
Bilina|84
Ploucnice|106
Jizera|165
Orlice|29
Metuje|82
Upa|60
Sazava|225
Berounka|139
Mze|105
Radbuza|105
Otava|112
Luznice|208
Malse|96
Blanice|76
Vah|403|Waag
Hron|298
Nitra|197
Ipel|232
Hornad|286
Bodrog|55
Latorica|188
Laborec|132
Ondava|145
Topla|129
Torysa|132
Orava|88
Kysuca|62
Turiec|58
Myjava|84
Maly Dunaj|129
Zala|116
Zagyva|179
Sajo|229|Slana
Berettyo|201
Koros|91|Crisul,Cris
Marcal|106
Prut|953
Siret|726
Mures|761
Olt|615
Somes|376
Timis|359
Bega|244
Jiu|339
Arges|350
Dambovita|286
Ialomita|417
Buzau|302
Bistrita|283
Trotus|162
Suceava|173
Barlad|207
Tarnava|246
Aries|164
Cibin|83
Cerna|84
Bahlui|129
Raut|286
Dniester|1362
Bic|155
Maritsa|480
Iskar|368
Yantra|285
Osam|314
Vit|189
Ogosta|147
Struma|415
Mesta|273
Arda|292
Tundzha|350|Tunca
Kamchiya|245
Vardar|388
Bregalnica|225
Crna|207|Crna Reka
Treska|130
Strumica|96
Radika|63
Black Drin|145
White Drin|122
Drin|285
Bojana|41
Mat|115
Shkumbin|181
Seman|281
Devoll|190
Osum|161
Vjosa|272
Erzen|109
Drino|60
Moraca|113
Zeta|86
Tara|144
Piva|34
Lim|220
Cehotina|106
Ibar|276
Great Morava|296
West Morava|308
South Morava|295
Nisava|151
Timok|202
Pek|129
Mlava|100
Resava|60
Jadar|65
Kolubara|87
Drina|346
Bosna|273
Vrbas|235
Una|212
Sana|148
Neretva|225
Trebisnjica|96
Pliva|46
Spreca|146
Lasva|62
Miljacka|36
Rama|45
Sutjeska|46
Kupa|296
Korana|134
Mreznica|64
Dobra|104
Glina|86
Krka (Croatia)|72
Cetina|105
Zrmanja|69
Gacka|34
Lika|46
Ombla|4
Rjecina|20
Mirna|53
Rasa|23
Dragonja|29
Idrijca|33
Vipava|49
Savinja|102
Kamniska Bistrica|33
Ljubljanica|41
Sotla|89
Reka|55
Pivka|32
Unica|30
Aliakmon|297
Pineios|216
Acheloos|220
Arachthos|110
Louros|65
Kalamas|115
Sperchios|82
Mornos|60
Evinos|100
Alfeios|110
Eurotas|82
Pamisos|27
Neda|30
Ladon|70
Asopos|40
Ilisos|15
Acheron|52
Gallikos|65
Loudias|45
Kizilirmak|1355
Yesilirmak|418
Sakarya|824
Seyhan|560
Ceyhan|509
Goksu|265
Buyuk Menderes|584
Kucuk Menderes|175
Gediz|401
Bakircay|129
Ergene|283
Coruh|431
Kelkit|373
Aras|1072
Kura|1515
Murat|722
Karasu|450
Botan|175
Batman|165
Orontes|571
Manavgat|92
Koprucay|74
Dalaman|229
Dim|19
Tarsus|84
Zamanti|190
Porsuk|460
Bartin|133
Filyos|228
Nilufer|106
Scamander|71|Karamenderes
Rioni|327
Enguri|213
Kodori|96
Bzyb|110
Mzymta|89
Alazani|351
Iori|320
Aragvi|112
Liakhvi|115
Terek|623
Sunzha|278
Baksan|173
Malka|216
Ardon|102
Kuban|870
Laba|214
Manych|500
Seversky Donets|1053
Khopyor|979
Voronezh|342
Oskol|472
Aidar|264
Kalitva|227
Sulak|144
Samur|216
Kuma|802
Podkumok|160
Oka|1500
Moskva|502
Klyazma|686
Ugra|399
Tsna|451
Moksha|656
Sura|841
Sviyaga|375
Vetluga|889
Unzha|426
Kostroma|354
Sheksna|139
Mologa|456
Tvertsa|188
Nerl|80
Istra|113
Pakhra|135
Neglinnaya|7
Yauza|48
Vyatka|1314
Belaya|1430
Ufa|918
Chusovaya|592
Sylva|493
Pechora|1809
Usa|565
Izhma|531
Vychegda|1130
Sysola|487
Northern Dvina|1302
Sukhona|558
Yug|574
Vaga|575
Pinega|779
Mezen|966
Onega River|416
Kem|191
Varzuga|254
Ponoy|426
Tuloma|59
Kola|83
Pasvik|147|Paatsjoki
Volkhov|224
Svir|224
Vuoksi|156
Narva|77
Luga|353
Velikaya|430
Lovat|530
Msta|445
Okhta|99
Fontanka|7
Moyka|5
Daugava|1020|Western Dvina
Gauja|452
Lielupe|119
Venta|346
Abava|129
Ogre|188
Aiviekste|105
Nemunas|937|Neman
Neris|510
Merkys|203
Sventoji|249
Nevezis|209
Dubysa|130
Minija|202
Sesupe|298
Vilnia|18
Pregolya|123
Berezina|613
Pripyat|761
Sozh|648
Ptsich|421
Svislach|327
Shchara|325
Drut|295
Iput|437
Mukhavets|113
Yaselda|242
Horyn|659
Styr|494
Sluch|451
Uzh|256
Teteriv|385
Irpin|162
Ros|346
Sula|363
Psel|717
Vorskla|464
Samara|320
Inhulets|549
Inhul|354
Southern Bug|806
Zbruch|244
Seret|242
Stryi|232
Bystrytsia|66
Cheremosh|80
Desna|1130
Seym|748
Kalmius|209
Molochna|197
Salhyr|232
Alma|84
Chorna|41
Glomma|604
Gudbrandsdalslagen|203
Drammenselva|44
Numedalslagen|352
Namsen|210
Gaula (Trondelag)|155
Nidelva|30
Orkla|179
Rauma|65
Driva|92
Otta|111
Sjoa|82
Begna|190
Hallingdalselva|157
Otra|245
Mandalselva|155
Suldalslagen|30
Vosso|42
Laerdalselva|30
Flamselva|20
Stryneelva|25
Surna|66
Vefsna|163
Ranelva|82
Malselva|65
Reisaelva|140
Karasjohka|186
Gota alv|93|Gota
Klaralven|460
Dalalven|520
Ljusnan|440
Ljungan|400
Indalsalven|430
Angermanalven|470
Umealven|470|Ume
Vindelalven|445|Vindel
Skelleftealven|410|Skellefte
Pitealven|400|Pite
Lulealven|461|Lule
Kalixalven|461|Kalix
Torne alv|520|Torne,Tornealven,Tornionjoki
Muonio|230
Faxalven|250
Eman|220
Morrumsan|190
Helge a|190
Nissan|200
Atran|243
Viskan|130
Motala strom|12
Stangan|65
Norrstrom|0.4
Fyrisan|90
Eskilstunaan|10
Tidan|160
Kemijoki|550
Oulujoki|107
Iijoki|370
Kokemaenjoki|121
Kymijoki|203
Kalajoki|130
Kyronjoki|121
Aurajoki|70
Vantaanjoki|100
Porvoonjoki|60
Ounasjoki|300
Kitinen|200
Ivalojoki|130
Lieksanjoki|62
Pielisjoki|38
Kiiminkijoki|173
Gudena|158
Skjern A|94
Stora|105
Kongea|65
Susa|87
Odense A|60
Molleaen|34
Vida|60
Thjorsa|230
Olfusa|25
Hvita|30
Jokulsa a Fjollum|206
Skjalfandafljot|178
Lagarfljot|140
Blanda|125
Heradsvotn|130
Skafta|155
Markarfljot|100
Ellidaar|8
Sog|24
Tungnaa|65
Laxa|56
Skeidara|30
Hudson|507|Hudson River
Potomac|665|Potomac River
Delaware River|485|Delaware River
Susquehanna|715|Susquehanna River
Connecticut River|655|Connecticut
Tennessee|1049|Tennessee River
Cumberland|1106|Cumberland River
Mohawk|238|Mohawk River
Merrimack|187|Merrimack River
Kennebec|274|Kennebec River
Penobscot|460|Penobscot River
Charles|129|Charles River
Housatonic|224|Housatonic River
Passaic|130|Passaic River
Raritan|88|Raritan River
Genesee|232|Genesee River
Schuylkill|209|Schuylkill River
Lehigh|166|Lehigh River
Brandywine|32|Brandywine Creek
Rappahannock|297|Rappahannock River
Roanoke|660|Roanoke River
Cape Fear|305|Cape Fear River
Neuse|444|Neuse River
Pee Dee|373|Pee Dee River
Santee|232|Santee River
Cooper|65|Cooper River
Edisto|246|Edisto River
Altamaha|220|Altamaha River
St. Johns|500|St Johns River,Saint Johns River
Apalachicola|179|Apalachicola River
Flint (Georgia)|344|Flint River
Suwannee|396|Suwannee River
Savannah|505|Savannah River
Chattahoochee|702|Chattahoochee River
James (Virginia)|550|James River
Shenandoah|89|Shenandoah River
Allegheny|523|Allegheny River
Monongahela|209|Monongahela River
Wabash|810|Wabash River
Illinois River|439
Wisconsin River|692
Fox|300|Fox River
Rock (Illinois)|459|Rock River
Des Plaines|246|Des Plaines River
Kankakee|209|Kankakee River
Sangamon|396|Sangamon River
Chicago River|251
Cuyahoga|137|Cuyahoga River
Scioto|372|Scioto River
Muskingum|179|Muskingum River
Great Miami|260|Great Miami River
Maumee|220|Maumee River
Kalamazoo|210|Kalamazoo River
Saginaw|35|Saginaw River
Menominee|195|Menominee River
Chippewa (Wisconsin)|296|Chippewa River
St. Croix (Wisconsin)|272|St Croix River
Minnesota|534|Minnesota River
Rainy|220|Rainy River
Kentucky|418|Kentucky River
Licking|515|Licking River
Tippecanoe|260|Tippecanoe River
Big Sioux|682|Big Sioux River
Cheyenne|848|Cheyenne River
Niobrara|692|Niobrara River
Loup|805|Loup River
Republican|632|Republican River
Smoky Hill|872|Smoky Hill River
Kansas|275|Kansas River,Kaw River
Platte|500|Platte River
North Platte|1094|North Platte River
South Platte|673|South Platte River
Cimarron|966|Cimarron River
Canadian|1458|Canadian River
Washita|500|Washita River
Brazos|1352|Brazos River
Trinity (Texas)|1136|Trinity River
Pecos|1490|Pecos River
Sacramento|715|Sacramento River
San Joaquin|587|San Joaquin River
Willamette|301|Willamette River
Klamath|423|Klamath River
Sabine|918|Sabine River
Neches|660|Neches River
San Jacinto|130|San Jacinto River
Guadalupe (Texas)|629|Guadalupe River
San Antonio River|386
Nueces|507|Nueces River
Devils|153|Devils River
Comal|3|Comal River
Ouachita|973|Ouachita River
Atchafalaya|217|Atchafalaya River
White (Arkansas)|1162|White River
Buffalo (Arkansas)|246|Buffalo River,Buffalo National River
Current|296|Current River
Gasconade|425|Gasconade River
Meramec|351|Meramec River
Osage|484|Osage River
Alabama|507|Alabama River
Coosa|452|Coosa River
Tombigbee|660|Tombigbee River
Mobile|72|Mobile River
Pascagoula|129|Pascagoula River
Yellowstone|1114|Yellowstone River
Bighorn|461|Bighorn River
Powder (Wyoming)|605|Powder River
Tongue (Montana)|439|Tongue River
Musselshell|458|Musselshell River
Milk|1173|Milk River
Marias|249|Marias River
Madison|295|Madison River
Gallatin|195|Gallatin River
Jefferson|133|Jefferson River
Clark Fork|505|Clark Fork River
Blackfoot (Montana)|121|Blackfoot River
Bitterroot|135|Bitterroot River
Flathead|314|Flathead River
Kootenay|780|Kootenai River
Pend Oreille|209|Pend Oreille River
Spokane|179|Spokane River
Salmon (Idaho)|676|Salmon River
Clearwater|121|Clearwater River
Boise|164|Boise River
Payette|148|Payette River
Owyhee|425|Owyhee River
Bruneau|169|Bruneau River
Henrys Fork (Idaho)|205|Henrys Fork River
Bear (Utah)|790|Bear River
Weber|201|Weber River
Provo|116|Provo River
Sevier|383|Sevier River
Virgin|260|Virgin River
Yampa|402|Yampa River
Animas|203|Animas River
Dolores|389|Dolores River
Gunnison|262|Gunnison River
Cache la Poudre|203|Poudre River
Big Thompson|126|Big Thompson River
Little Colorado|603|Little Colorado River
Gila|1044|Gila River
Salt (Arizona)|320|Salt River
Verde|273|Verde River
San Pedro|225|San Pedro River
Kern|265|Kern River
Kings|206|Kings River
Merced|233|Merced River
Tuolumne|238|Tuolumne River
Stanislaus|154|Stanislaus River
Mokelumne|145|Mokelumne River
American (California)|193|American River
Feather|217|Feather River
Yuba|64|Yuba River
Pit|241|Pit River
Eel (California)|315|Eel River
Russian|177|Russian River
Napa|89|Napa River
Salinas|280|Salinas River
Santa Ana|154|Santa Ana River
San Gabriel (California)|93|San Gabriel River
Mojave River|179
Amargosa|301|Amargosa River
Owens|296|Owens River
Truckee|196|Truckee River
Carson|211|Carson River
Walker|100|Walker River
Humboldt|451|Humboldt River
Los Angeles River|82
Deschutes (Oregon)|406|Deschutes River
John Day|451|John Day River
Umatilla|143|Umatilla River
McKenzie|145|McKenzie River
Clackamas|116|Clackamas River
Rogue|346|Rogue River
Umpqua|170|Umpqua River
Cowlitz|105|Cowlitz River
Toutle|58|Toutle River
Chehalis|193|Chehalis River
Puyallup|72|Puyallup River
Nisqually|129|Nisqually River
Duwamish|21|Duwamish River
Snoqualmie|68|Snoqualmie River
Skykomish|97|Skykomish River
Skagit|241|Skagit River
Stillaguamish|64|Stillaguamish River
Nooksack|121|Nooksack River
Wenatchee|85|Wenatchee River
Yakima|344|Yakima River
Methow|129|Methow River
Palouse|265|Palouse River
Walla Walla|76|Walla Walla River
Elwha|72|Elwha River
Hoh|90|Hoh River
Quinault|65|Quinault River
Tanana|917|Tanana River
Koyukuk|684|Koyukuk River
Porcupine|918|Porcupine River
Kuskokwim|1130|Kuskokwim River
Susitna|505|Susitna River
Matanuska|121|Matanuska River
Copper|470|Copper River
Chitina|193|Chitina River
Kenai|132|Kenai River
Kobuk|450|Kobuk River
Noatak|684|Noatak River
Colville (Alaska)|610|Colville River
Stikine|539|Stikine River
Taku|210|Taku River
Chilkat|82|Chilkat River
Alsek|386|Alsek River
Tatshenshini|192|Tatshenshini River
Nushagak|440|Nushagak River
Kvichak|105|Kvichak River
Naknek|56|Naknek River
Fraser|1375|Fraser River
Thompson (British Columbia)|489|Thompson River
Nechako|462|Nechako River
Chilcotin|241|Chilcotin River
Quesnel|113|Quesnel River
Lillooet|130|Lillooet River
Harrison|75|Harrison River
Coquihalla|75|Coquihalla River
Similkameen|225|Similkameen River
Okanagan|200|Okanagan River,Okanogan
Kettle (British Columbia)|280|Kettle River
Skeena|570|Skeena River
Bulkley|233|Bulkley River
Nass|380|Nass River
Bella Coola|100|Bella Coola River
Squamish|85|Squamish River
Capilano|40|Capilano River
Cowichan|47|Cowichan River
Peace (Canada)|1923|Peace River
Athabasca|1231|Athabasca River
Slave|434|Slave River
Liard|1115|Liard River
Hay|590|Hay River
Nahanni|560|South Nahanni River
Back|974|Back River
Thelon|900|Thelon River
Coppermine|845|Coppermine River
Kazan|857|Kazan River
Hayes|483|Hayes River
Winisk|475|Winisk River
Attawapiskat|748|Attawapiskat River
Albany River|982
Moose (Ontario)|547|Moose River
Abitibi|579|Abitibi River
Mattagami|443|Mattagami River
Missinaibi|426|Missinaibi River
Harricana|533|Harricana River
Nottaway|425|Nottaway River
Rupert|611|Rupert River
Eastmain|800|Eastmain River
La Grande|810|La Grande River
Great Whale|370|Great Whale River
Koksoak|64|Koksoak River
Caniapiscau|475|Caniapiscau River
Exploits|246|Exploits River
Gander|72|Gander River
Saint John (New Brunswick)|673
Miramichi|217|Miramichi River
Restigouche|200|Restigouche River
Petitcodiac|79|Petitcodiac River
Shubenacadie|72|Shubenacadie River
Margaree|50|Margaree River
Saguenay|170|Saguenay River
Saint-Maurice|523|Saint-Maurice River
Richelieu|130|Richelieu River
Chaudiere|185|Chaudiere River
Saint-Francois|282|Saint-Francois River
Yamaska|150|Yamaska River
Gatineau|386|Gatineau River
Rideau|146|Rideau River
Madawaska|230|Madawaska River
Petawawa|188|Petawawa River
Grand (Ontario)|280
Credit|90|Credit River
Niagara|56|Niagara River
Detroit River|82
St. Clair|64|St Clair River
St. Marys (Michigan)|121|St Marys River
Nipigon|48|Nipigon River
Kaministiquia|55|Kaministiquia River
Winnipeg River|235
English (Ontario)|306|English River
Assiniboine|1070|Assiniboine River
Souris|700|Souris River
Qu'Appelle|430|Qu'Appelle River,Qu Appelle River
Seal|852|Seal River
Saskatchewan|550|Saskatchewan River
North Saskatchewan|1287|North Saskatchewan River
South Saskatchewan|865|South Saskatchewan River
Bow|587|Bow River
Elbow|50|Elbow River
Oldman|350|Oldman River
Red Deer|724|Red Deer River
Klondike|160|Klondike River
Pelly|550|Pelly River
Stewart|644|Stewart River
Teslin|150|Teslin River
Peel|680|Peel River
Arctic Red|499|Arctic Red River
Usumacinta|1000|Rio Usumacinta
Grijalva|640|Rio Grijalva
Papaloapan|354|Rio Papaloapan
Coatzacoalcos|325|Rio Coatzacoalcos
Balsas|771|Rio Balsas,Atoyac
Lerma|750|Rio Lerma
Rio Grande de Santiago|562|Santiago River
Panuco|510|Rio Panuco
Moctezuma|380|Rio Moctezuma
Conchos|560|Rio Conchos
Nazas|560|Rio Nazas
Yaqui|410|Rio Yaqui
Mayo|340|Rio Mayo
Fuerte|560|Rio Fuerte
Sinaloa|280|Rio Sinaloa
Culiacan|875|Rio Culiacan
Ameca|230|Rio Ameca
Suchiate|180|Rio Suchiate
Hondo|150|Rio Hondo
Sonora|420|Rio Sonora
Tijuana River|195|Tijuana
Belize River|290
New River (Belize)|66
Sarstoon|96|Rio Sarstun
Motagua|486|Rio Motagua
Polochic|240|Rio Polochic
Dulce|43|Rio Dulce
Ulua|400|Rio Ulua
Chamelecon|210|Rio Chamelecon
Aguan|190|Rio Aguan
Patuca|500|Rio Patuca
Coco|680|Rio Coco,Segovia River
Grande de Matagalpa|418|Rio Grande de Matagalpa
Escondido|111|Rio Escondido
San Juan (Nicaragua)|199|Rio San Juan,San Juan River
Tempisque|144|Rio Tempisque
Reventazon|110|Rio Reventazon
Pacuare|108|Rio Pacuare
Sarapiqui|75|Rio Sarapiqui
Tarcoles|111|Rio Tarcoles
Sixaola|146|Rio Sixaola
Terraba|150|Rio Grande de Terraba
Chagres|125|Rio Chagres
Bayano|206|Rio Bayano
Tuira|230|Rio Tuira
Chucunaque|231|Rio Chucunaque
Changuinola|110|Rio Changuinola
Lempa|422|Rio Lempa
Goascoran|100|Rio Goascoran
Choluteca|340|Rio Choluteca
Guayape|300|Rio Guayape
Cauto|343|Rio Cauto
Toa|93|Rio Toa
Sagua la Grande|163|Rio Sagua la Grande
Yaque del Norte|296|Rio Yaque del Norte
Yaque del Sur|183|Rio Yaque del Sur
Yuna|210|Rio Yuna
Ozama|148|Rio Ozama
Artibonite|321|Riviere Artibonite
Black River (Jamaica)|53|Black River Jamaica
Martha Brae|32|Martha Brae River
Rio Cobre|48
Rio Camuy|80|Camuy River
Rio Grande de Loiza|64|Loiza River
Ortoire|50|Ortoire River
Magdalena|1528|Rio Magdalena
Cauca|1350|Rio Cauca
Atrato|750|Rio Atrato
Patia|400|Rio Patia
Meta|1000|Rio Meta
Guaviare|1497|Rio Guaviare
Vichada|436|Rio Vichada
Vaupes|1050|Rio Vaupes,Uaupes River
Japura|2820|Rio Japura,Caqueta River
Putumayo|1813|Rio Putumayo,Ica River
Apaporis|1300|Rio Apaporis
Inirida|550|Rio Inirida
Casanare|724|Rio Casanare
Arauca|1050|Rio Arauca
Apure|1000|Rio Apure
Portuguesa|450|Rio Portuguesa
Guarico|360|Rio Guarico
Caroni|952|Rio Caroni
Caura|723|Rio Caura
Ventuari|586|Rio Ventuari
Cuyuni|700|Rio Cuyuni
Mazaruni|320|Mazaruni River
Essequibo|1010|Essequibo River
Demerara|346|Demerara River
Berbice|595|Berbice River
Courantyne|724|Corentyne River
Coppename|340|Coppename River
Saramacca|280|Saramacca River
Suriname River|480
Maroni|680|Marowijne River
Oyapock|370|Oiapoque River
Approuague|190|Approuague River
Nickerie|320|Nickerie River
Cottica|110|Cottica River
Sinnamary|260|Sinnamary River
Kourou|110|Kourou River
Branco|560|Rio Branco
Trombetas|750|Rio Trombetas
Jari|560|Rio Jari
Paru|1000|Rio Paru
Tapajos|2080|Rio Tapajos
Juruena|1240|Rio Juruena
Teles Pires|1420|Rio Teles Pires
Arinos|809|Rio Arinos
Iriri|1300|Rio Iriri
Mamore|2000|Rio Mamore
Beni|1050|Rio Beni
Guapore|1749|Rio Guapore,Itenez River
Madre de Dios|1130|Rio Madre de Dios
Inambari|475|Rio Inambari
Tambopata|330|Rio Tambopata
Javari|1200|Rio Javari
Jurua|3280|Rio Jurua
Nanay|420|Rio Nanay
Itaya|120|Rio Itaya
Solimoes|1600|Rio Solimoes
Icana|1000|Rio Icana
Nhamunda|800|Rio Nhamunda
Araguari|498|Rio Araguari
Ucayali|1771|Rio Ucayali
Huallaga|1138|Rio Huallaga
Apurimac|698|Rio Apurimac
Ene|216|Rio Ene
Tambo|136|Rio Tambo
Urubamba|724|Rio Urubamba,Vilcanota
Mantaro|724|Rio Mantaro
Pachitea|400|Rio Pachitea
Napo|1075|Rio Napo
Pastaza|710|Rio Pastaza
Tigre|550|Rio Tigre
Morona|500|Rio Morona
Curaray|724|Rio Curaray
Aguarico|380|Rio Aguarico
Coca|220|Rio Coca
Gurupi|720|Rio Gurupi
Pindare|509|Rio Pindare
Mearim|930|Rio Mearim
Itapecuru|1090|Rio Itapecuru
Parnaiba|1485|Rio Parnaiba
Poti|586|Rio Poti
Jaguaribe|633|Rio Jaguaribe
Piranhas|490|Rio Piranhas,Piranhas-Acu River
Potengi|173|Rio Potengi
Paraiba|380|Rio Paraiba
Capibaribe|240|Rio Capibaribe
Ipojuca|340|Rio Ipojuca
Paraguacu|600|Rio Paraguacu
Jequitinhonha|1090|Rio Jequitinhonha
Pardo|555|Rio Pardo
Mucuri|500|Rio Mucuri
Doce|879|Rio Doce
Paraiba do Sul|1120|Rio Paraiba do Sul
Macae|135|Rio Macae
Itajai|190|Rio Itajai-Acu
Ribeira de Iguape|470|Rio Ribeira de Iguape
Tiete|1136|Rio Tiete
Piracicaba|372|Rio Piracicaba
Paranaiba|1170|Rio Paranaiba
Paranapanema|929|Rio Paranapanema
Tibagi|550|Rio Tibagi
Ivai|548|Rio Ivai
Piquiri|485|Rio Piquiri
Iguacu|1320|Rio Iguacu,Iguazu River
Pelotas|350|Rio Pelotas
Canoas|375|Rio Canoas
Jacui|750|Rio Jacui
Taquari|520|Rio Taquari
Camaqua|220|Rio Camaqua
Ibicui|550|Rio Ibicui
Desaguadero|398|Rio Desaguadero
Ichilo|400|Rio Ichilo
Chapare|320|Rio Chapare
Yacuma|350|Rio Yacuma
Paragua|500|Rio Paragua
Lauca|320|Rio Lauca
Tebicuary|360|Rio Tebicuary
Ypane|350|Rio Ypane
Aquidaban|220|Rio Aquidaban
Apa|322|Rio Apa
Jejui|360|Rio Jejui
Manduvira|170|Rio Manduvira
Monday|100|Rio Monday
Acaray|210|Rio Acaray
Biobio|380|Rio Biobio
Maule|240|Rio Maule
Maipo|250|Rio Maipo
Mapocho|110|Rio Mapocho
Aconcagua River|142
Elqui|75|Rio Elqui
Limari|110|Rio Limari
Choapa|150|Rio Choapa
Copiapo|161|Rio Copiapo
Huasco|140|Rio Huasco
Loa|440|Rio Loa
Lluta|100|Rio Lluta
Itata|220|Rio Itata
Tolten|100|Rio Tolten
Imperial|90|Rio Imperial
Valdivia|15|Rio Valdivia
Bueno|170|Rio Bueno
Puelo|100|Rio Puelo
Futaleufu|100|Rio Futaleufu
Palena|240|Rio Palena
Cisnes|100|Rio Cisnes
Aysen|101|Rio Aysen
Baker|170|Rio Baker
Pascua|64|Rio Pascua
Serrano|75|Rio Serrano
Bermejo|1450|Rio Bermejo
Salado|1000|Rio Salado
Carcarana|400|Rio Carcarana
Tercero|500|Rio Tercero
Limay|400|Rio Limay
Neuquen|287|Rio Neuquen
Chubut|810|Rio Chubut
Deseado|615|Rio Deseado
Santa Cruz (Argentina)|385|Rio Santa Cruz
Gallegos|320|Rio Gallegos
Chico|800|Rio Chico
Rio de la Plata|290|River Plate
Lujan|128|Rio Lujan
Reconquista|82|Rio Reconquista
Matanza-Riachuelo|64|Riachuelo
Santa Lucia|220|Rio Santa Lucia
Yi|220|Rio Yi
Tacuarembo|200|Rio Tacuarembo
Cebollati|280|Rio Cebollati
Queguay|180|Rio Queguay
Quarai|180|Rio Quarai,Cuareim River
Arapey|220|Rio Arapey
Dayman|100|Rio Dayman
Okavango|1600|Okavango River
Kasai|2153|Kasai River
Cunene|1050|Kunene,Cunene River
Kwanza|960|Cuanza,Kwanza River
Lualaba|1800|Lualaba River
Cuando|1000|Kwando,Cuando River,Chobe
Sangha|790|Sangha River
Ogooue|1200|Ogooue River
Kwango|1100|Cuango,Kwango River
Sanaga|918|Sanaga River
Uele|1210|Uele River
Chari|1400|Shari,Chari River
Logone|1000|Logone River
Mbomou|930|Mbomou River,Bomu
Kotto|1030|Kotto River
Sankuru|1300|Sankuru River
Lomami|1500|Lomami River
Aruwimi|1300|Ituri,Aruwimi River
Kwilu|800|Kwilu River
Luvua|350|Luvua River
Lukuga|350|Lukuga River
Ivindo|500|Ivindo River
Ntem|640|Ntem River
Nyong|690|Nyong River
Wouri|160|Wouri River
Cross|480|Cross River
Benue|1400|Benue River
Kaduna|550|Kaduna River
Sokoto|480|Sokoto River
Gongola|600|Gongola River
Osun|300|Osun River
Ogun|480|Ogun River
Oueme|450|Oueme River
Mono|400|Mono River
Black Volta|1352|Mouhoun
White Volta|1000|Nakambe
Oti|780|Pendjari,Oti River
Pra|240|Pra River
Ankobra|190|Ankobra River
Tano|400|Tano River
Densu|116|Densu River
Bandama|1050|Bandama River
Sassandra|650|Sassandra River
Comoe|1160|Comoe River
Cavally|515|Cavally River
Saint Paul River (Liberia)|515
Mano|400|Mano River
Lofa|350|Lofa River
Moa|400|Moa River
Sewa|400|Sewa River
Rokel|400|Seli,Rokel River
Konkoure|300|Konkoure River
Corubal|500|Corubal River
Geba|550|Geba River
Casamance|300|Casamance River
Saloum|250|Saloum River
Faleme|650|Faleme River
Bafing|800|Bafing River
Bakoye|700|Bakoye River
Bani|1100|Bani River
Sankarani|500|Sankarani River
Milo|450|Milo River
Atbara|800|Atbarah,Atbara River
Sobat|480|Sobat River
Baro|300|Baro River
Pibor|480|Pibor River
Bahr el Ghazal|716
Kagera|700|Akagera,Kagera River
Nyabarongo|300|Nyabarongo River
Semliki|230|Semliki River
Tekeze|608|Tekeze River,Setit
Dinder|500|Dinder River
Rahad|400|Rahad River
Awash|1200|Awash River
Shebelle|2500|Shabelle,Shebelle River
Jubba|1808|Juba,Jubba River
Dawa|800|Dawa River
Ganale|600|Ganale Dorya
Mareb|400|Mareb River
Barka|560|Barka River
Tana (Kenya)|1000
Athi-Galana|760|Galana River,Athi River
Ewaso Ngiro|470
Mara|395|Mara River
Nzoia|334|Nzoia River
Turkwel|340|Turkwel River
Kerio|350|Kerio River
Pangani|500|Ruvu,Pangani River
Rufiji|600|Rufiji River
Great Ruaha|475|Great Ruaha River
Kilombero|400|Kilombero River
Ruvuma|800|Rovuma,Ruvuma River
Wami|300|Wami River
Malagarasi|475|Malagarasi River
Lugenda|500|Lugenda River
Shire|402|Shire River
Luangwa|770|Luangwa River
Kafue|1576|Kafue River
Kabompo|500|Kabompo River
Luapula|450|Luapula River
Chambeshi|480|Chambeshi River
Save (Mozambique)|740|Sabi,Save River
Buzi|250|Buzi River
Pungwe|400|Pungwe River
Olifants|700|Olifants River
Crocodile|320|Crocodile River
Letaba|170|Letaba River
Luvuvhu|200|Luvuvhu River
Shashe|400|Shashe River
Sabie|190|Sabie River
Komati|480|Incomati,Komati River
Usutu|280|Usutu River,Great Usutu
Pongola|280|Pongola River
Tugela|502|Thukela,Tugela River
Mzimvubu|220|Mzimvubu River
Great Kei|340|Kei River,Great Kei River
Great Fish|644|Great Fish River
Sundays|400|Sundays River
Gamtoos|150|Gamtoos River
Breede|300|Breede River
Berg|285|Berg River
Vaal|1120|Vaal River
Caledon|480|Caledon River,Mohokare
Molopo|960|Molopo River
Fish (Namibia)|650
Swakop|460|Swakop River
Kuiseb|560|Kuiseb River
Ugab|450|Ugab River
Boteti|300|Boteti River
Betsiboka|525|Betsiboka River
Mangoky|564|Mangoky River
Tsiribihina|540|Tsiribihina River
Sebou|458|Sebou River
Moulouya|600|Moulouya River
Oum Er-Rbia|555|Oum Er-Rbia River
Bou Regreg|240
Tensift|270|Tensift River
Draa|1100|Draa River
Ziz|270|Ziz River
Sous|200|Souss,Sous River
Chelif|700|Cheliff,Chelif River
Medjerda|460|Medjerda River
Syr Darya|2212
Zeravshan|877
Panj|1125
Vakhsh|786
Naryn|807
Chu|1067
Talas|661
Ili|1439|Yili River
Irtysh|4248
Ishim|2450
Tobol|1591
Emba|712
Turgay|825
Sarysu|761
Nura|978
Angara|1779
Selenga|1024
Orkhon|1124
Tuul|704|Tola River
Kherlen|1264|Kerulen
Onon|818
Shilka|560
Argun|1620
Zeya|1242
Bureya|623
Ussuri|897
Nen|1370|Nonni
Mudan|725|Mudanjiang
Tumen|521|Tuman River
Yalu|790|Amnok
Liao|1345
Hai|1090
Luan|877|Luan He
Yongding|650
Huai|1000
Jialing|1119
Min (Sichuan)|735
Dadu|1062
Wu|1037|Wu River
Yuan|1033
Xiang|856
Gan|823
Qiantang|668
Ou|388|Oujiang
Jiulong|258
Dong|562|Dong River,Dongjiang
Bei|468|North River
Xi|2129|West River
Yu|1121
Hongshui|1050
Jinsha|2308|Jinsha River
Yalong|1571
Yarlung Tsangpo|2840|Yarlung Zangbo
Lhasa River|551|Lhasa
Hotan|1127|Hotan River
Yarkand|970
Kashgar|1000
Aksu|588
Ulungur|725
Heihe|821
Wei|818
Jing|455
Luo|447
Fen|713
Tao|673
Huangshui|374
Datong|631
Wuding|491
Taz|1401
Pur|1024
Nadym|545
Tom|827
Chulym|1799
Ket|1621
Vasyugan|1082
Konda|1097
Sosva|754|Northern Sosva
Katun|688
Biya|301
Abakan|514
Nizhnyaya Tunguska|2989|Lower Tunguska
Podkamennaya Tunguska|1865|Stony Tunguska
Khatanga|1636
Anabar|939
Yana|872
Indigirka|1726
Anadyr|1150
Kamchatka River|758
Penzhina|713
Okhota|393
Uda|457
Amgun|723
Nakdong|510
Geum|401
Taedong|439
Imjin|254
Yeongsan|150
Seomjin|212
Bukhan|317
Namhan|375
Chongchon|213|Chongchon River
Shinano|367|Shinano River
Ishikari|268
Kitakami|249
Kiso|227
Tenryu|213|Tenryu River
Mogami|229
Agano|210
Yodo|75|Yodo River
Tama|138
Sagami|109
Fuji|128|Fuji River
Oi|168
Abe|51
Nagara|166
Yoshino|194
Shimanto|196
Chikugo|143
Teshio|256
Tokachi|156
Kushiro|154
Omono|133
Abukuma|239
Kinu|176
Kuji|122
Naka|150
Arakawa|173|Arakawa River
Sumida|27|Sumida River
Kamo|23|Kamo River
Kaveri|800|Cauvery
Mahanadi|858
Tapti|724
Sabarmati|371
Beas|470
Ravi|720
Jhelum|725
Kabul River|700
Kunar|480|Kunar River
Swat|240|Swat River
Panjshir|240|Panjshir River
Arghandab|560|Arghandab River
Farah|500|Farah River
Gomal|400|Gomal River
Kurram|320|Kurram River
Dasht|400|Dasht River
Hingol|560|Hingol River
Hub|190|Hub River
Lyari|50|Lyari River
Karun|950
Karkheh|900
Dez|400|Dez River
Zayanderud|405|Zayandeh River,Zayanderud River
Sefidrud|670|Sefid-Rud,Sefid Rud
Atrak|669|Atrek
Gorgan|350|Gorgan River
Harirud|1100|Hari River
Murghab|850|Murghab River
Litani|170
Barada|80
Yarmouk|82
Zarqa|150
Kishon|70
Yarkon|27
Khabur|486
Balikh|104
Diyala|445
Great Zab|400|Zab
Little Zab|456
Shatt al-Arab|200|Arvand Rud
Ghaghara|1080
Chambal|960
Gomti|900
Bhima|861
Brahmani|799
Son|784
Kosi|720
Manjira|724
Gandak|630
Damodar|592
Betwa|590
Mahi|583
Wainganga|579
Wardha|528
Tungabhadra|531
Luni|495
Ghaggar|460|Ghaggar-Hakra
Ken|427
Ponnaiyar|432|South Pennar
Subarnarekha|395
Teesta|414
Palar|348
Torsa|358
Manas (India)|375
Barak|900
Vaigai|258
Purna|274|Purna River
Musi (India)|240
Periyar|244
Penna|597|Pennar
Hooghly|260|Hugli
Bharathappuzha|209|Ponnani River
Pamba|176
Meghna|930
Padma|120
Jamuna|205
Karnaphuli|180
Surma|350
Kushiyara|300
Atrai|224
Mahaweli|335|Mahaweli Ganga
Kelani|145
Kalu|129
Walawe|138
Chindwin|1207|Chindwin River
Sittaung|420
Kaladan|490
Bago|128
Nan|740
Chi|765
Mun|750
Yom|735
Ping|590
Pa Sak|513
Kwai|380|Khwae Noi,Kwai Noi
Tha Chin|325
Wang|335
Bang Pakong|230
Pattani|210
Tapi (Thailand)|225
Mae Klong|140
Tonle Sap River|120|Tonle Sap
Sekong|480
Srepok|480
Sesan|462|Se San
Nam Ou|448
Nam Ngum|354
Nam Khan|90
Da|927|Da River
Ca|531|Song Lam
Ma|512
Dong Nai|586
Lo|470
Saigon River|225|Saigon
Tien|234|Tien River
Hau|220|Hau River,Bassac,Bassac River
Thu Bon|205
Perfume River|80|Huong River
Pahang|459
Kelantan|248
Perak|400
Klang|120
Rajang|565
Kinabatangan|560
Baram|400
Sarawak River|180
Muar|300
Johor|122
Kapuas|1143
Mahakam|980
Barito|890
Musi (Indonesia)|750
Batang Hari|800
Kampar|413
Indragiri|500
Rokan|400
Siak|300
Asahan|150
Bengawan Solo|600|Solo River
Mamberamo|670
Digul|525
Brantas|320
Citarum|300
Serayu|181
Cisadane|138
Progo|140
Ciliwung|120
Sepik|1126|Sepik River
Fly|1050|Fly River
Strickland|800
Ramu|640
Purari|600
Baliem|400
Kikori|320
Markham|180
Cagayan|505|Rio Grande de Cagayan
Rio Grande de Mindanao|373
Agusan|349
Pulangi|320
Pampanga|260
Agno|206
Magat|190
Abra|178
Davao River|150
Bicol|92
Angat|68
Marikina|32
Pasig|27
Loboc|47
Murrumbidgee|1485|Murrumbidgee River
Warrego|1380
Lachlan|1339
Cooper Creek|1300|Barcoo Creek
Macquarie|950
Diamantina|900
Namoi|850
Barcoo|965
Condamine|800
Finke|750
Barwon|700|Barwon River
Georgina|600
Paroo|620
Gwydir|512
Thomson|500|Thomson River
Balonne|480
Castlereagh|490
Todd|60
Flinders|841
Fitzroy (Western Australia)|733
Mitchell|750|Mitchell River
Burdekin|740
Roper|588
Leichhardt|570
Gilbert|500|Gilbert River
McArthur|480|McArthur River
Burnett|470
Gregory|500|Gregory River
Katherine|328
Mary|300|Mary River
Ord|320
Herbert|250
Daly|210
Logan (Queensland)|180
Adelaide River|180
Barron|132
Tully|64
Noosa|60
Nerang|30
Goulburn|570
Hunter|470
Glenelg|460|Glenelg River
Clarence|394|Clarence River
Loddon|392
Snowy|352
Wimmera|250
Manning|249
Richmond|238
Macleay|240
Campaspe|220
Ovens|210
Mitta Mitta|195
Latrobe|190
Tumut|199
Maribyrnong|160
Hastings|156|Hastings River
Nepean|150
Shoalhaven|121
Hawkesbury|120
Werribee|110
Bellinger|100
Kiewa|100
Georges|96
Parramatta|24
Cooks|23
Murchison|820|Murchison River
Gascoyne|760
Ashburton|511|Ashburton River
Fortescue|416
De Grey|400
Avon (Western Australia)|280
Moore|250|Moore River
Blackwood|175|Blackwood River
Huon|170
Gordon|172|Gordon River
Franklin|129
Onkaparinga|105
Canning (Western Australia)|105|Canning River
South Esk (Tasmania)|105
Torrens|85
Pieman|61
Whanganui|290|Wanganui
Taieri|288
Rangitikei|241
Mataura|240
Waitaki|209
Oreti|203
Manawatu|182
Buller|177
Mohaka|172
Wairau|169
Waiau|169|Waiau River
Ruamahanga|190
Rangitaiki|193
Waimakariri|151
Waipa|148
Rakaia|145
Hurunui|138
Ngaruroro|154
Tukituki|112
Motueka|108
Grey|121|Grey River
Rangitata|121
Whakatane|97
Selwyn|95
Motu|86
Shotover|76
Hokitika|68
Haast|65
Tarawera|64
Kawarau|60
Hutt|56|Hutt River
Kaituna|51
Rewa (Fiji)|145
Sigatoka|120
Navua|40
Cano Cristales|100
Catatumbo|338|Rio Catatumbo
Bogota|375|Rio Bogota
Sinu|415|Rio Sinu
Medellin|100|Rio Medellin
Suarez|172|Rio Suarez
Ariari|185|Rio Ariari
Atabapo|280|Rio Atabapo
Cesar|280|Rio Cesar
Chicamocha|400|Rio Chicamocha
Guaitara|158|Rio Guaitara
Otun|69|Rio Otun
Pance|25|Rio Pance
Rancheria|150|Rio Rancheria
San Jorge|368|Rio San Jorge
Taraira|160|Rio Taraira
Zulia|310|Rio Zulia
Anchicaya|100|Rio Anchicaya
Baudo|150|Rio Baudo
Vita|520|Rio Vita
Caguan|630|Rio Caguan
Cahuinari|400|Rio Cahuinari
Cali|50|Rio Cali
Capanaparo|650|Rio Capanaparo
Cinaruco|480|Rio Cinaruco
Dagua|101|Rio Dagua
Guatapuri|80|Rio Guatapuri
Guatiquia|137|Rio Guatiquia
Igara Parana|430|Rio Igara Parana
La Miel|104|Rio La Miel
La Vieja|102|Rio La Vieja
Lebrija|200|Rio Lebrija
Mendihuaca|13|Rio Mendihuaca
Naya|120|Rio Naya
Nechi|252|Rio Nechi
Orteguaza|220|Rio Orteguaza
Pamplonita|155|Rio Pamplonita
Quindio|69|Rio Quindio
Saldana|223|Rio Saldana
San Miguel (Colombia)|295|Rio San Miguel
Soacha|11|Rio Soacha
Sogamoso|135|Rio Sogamoso
Sumapaz|95|Rio Sumapaz
Teusaca|69|Rio Teusaca
Tiquie|374|Rio Tiquie
Tomo|650|Rio Tomo
Torbes|82|Rio Torbes
Tunjuelo|73|Rio Tunjuelo
Tachira|87|Rio Tachira
Uribante|245|Rio Uribante
Ubate|49|Rio Ubate
Cotuhe|335|Rio Cotuhe
Coello|112|Rio Coello
Cara Parana|260|Rio Cara Parana
Guamues|140|Rio Guamues
Ajaju|260|Rio Ajaju
Cuja|48|Rio Cuja
Sardinata|170|Rio Sardinata
Cusiana|245|Rio Cusiana
Atacuari|207|Rio Atacuari
Miritiparana|320|Rio Miritiparana
Quebrada Limas|11
Bodoquero|100|Rio Bodoquero
Ceibas|61|Rio Ceibas
Aquio|140|Rio Aquio
Mecaya|210|Rio Mecaya
Red River of the North|890
New River (West Virginia)|515
French Broad|376
Green|1175
Apple (Wisconsin)|125
Kanawha|156
Wolf|169
Youghiogheny|216
Tallahatchie|138
Frio|377
Au Sable|220
Buffalo Bayou|85
Little Bighorn|222
Catawba|350
St. Joseph|338
Androscoggin|264
Des Moines|845
Patuxent|185
Yazoo|303
Chattooga|92
Bayou Teche|200|Teche
Black Warrior|286
Duck|457
Indian|195
Tug Fork|256
Bayou Lafourche|171|Lafourche
Caloosahatchee|121
North Canadian|710-1287
Huron|210
Ocoee|150|Toccoa,Ocoee River,Toccoa River
Wounded Knee Creek|80
Saco|219
Saint Louis|309
Withlacoochee (Florida)|227
Clinch|483-542
Bayou Bartholomew|586
Holston|219
Yadkin|346
Yellow Medicine|173
Ocmulgee|410
Oconee|274
Kissimmee|215
San Marcos|121
Hiwassee|237
Little Miami|179
Little Tennessee|217
Milwaukee|167
Putah Creek|137
Verdigris|500
Nolichucky|185
Wind (Wyoming)|298
Juniata|167
Esopus Creek|105
Purgatoire|315
Santa Clara|134
Tar|346
Teklanika|145
Broad|241
Dan|344
Iowa River|520
Pedernales|171
Pigeon|113
West Branch Susquehanna|391
Caney Fork|230
Clear Creek (Colorado)|106
Gauley|172
Olentangy|156
Pemigewasset|105
Cheat|126
Mad (Ohio)|106
Moyie|148
Tygart Valley|217
Cahaba|312
Econlockhatchee|88
Etowah|217
Little Missouri (North Dakota)|901
Mahoning|182
Whitewater (California)|87
Muskegon|339
Niangua|201
Rapid Creek|190
San Diego|84
Saint Francis (Missouri)|686
Big Hole|246
Lumber|199
Neosho|745
Ogeechee|370
Tuscarawas|209
Watauga|126
Chena|160
Chickahominy|140
Choptank|114
Saluda|320
Manistee|310
Rapidan|142
Raisin|224
Tallapoosa|431
Tuckasegee|97
Allagash|103
Cedar|544
Conestoga|99
Haw|177
Kaskaskia|515
Llano|183
Santa Fe|121
Sweetwater (Wyoming)|383
Appomattox|253
Belle Fourche|470
Blue (Colorado)|104
Hocking|164
Winooski|144
Agua Fria|193
Cache (Illinois)|148
Marais des Cygnes|349
Neversink|89
Roaring Fork|113
Big Lost|217
Blanco|140
Choctawhatchee|227
Farmington|130
Greenbrier|261
Elk (West Virginia)|283
Grande Ronde|338
Lewis|146
Mattole|100
Raquette|235
Seneca|105
Wallkill|151
Arikaree|251
Batten Kill|96
Big Muddy|251
Calcasieu|322
Hillsborough|87
Laramie|451
McCloud|124
Medina|187
Ocklawaha|119
Sandusky|214
Tahquamenon|143
Alamo|84
Alapaha|306
Cosumnes|85
Deep|200
Zumbro|104
Mullica|81
Pine Creek|140
Rio Chama|209
Rum|243
Sheyenne|951
Vermilion (Louisiana)|116
Big|233
Blackwater (Florida)|91
Chetco|90
Chowan|80
Conemaugh|113
Hoosic|113
Kavik|140
Perdido|105
Saint Joe|225
Schoharie Creek|150
Spring (Arkansas)|92
Tchefuncte|113
Uncompahgre|121
Ammonoosuc|96
Beaverhead|111
Big Black (Mississippi)|456
Chenango|145
Vedder|80
Cibolo Creek|154
Concho|86
Deerfield|122
Little|97
Tule|115
Mississinewa|190
Monocacy|93
Namekagon|163
Nehalem|191
North Branch Potomac|163
South Branch Potomac|183
Otter Tail|292
Pamunkey|150
Prairie Dog Town Fork Red|193
Red Rock|113
Sandy (Oregon)|90
Shoshone|161
Tittabawassee|116
Wateree|121
West Branch Delaware|145
Alum Creek|93
Brule|84
Cacapon|130
Clarion|177
Contoocook|114
Flambeau|200
Guyandotte|267
Kishwaukee|102
Lochsa|111
Raccoon|322
Mimbres|146
Nenana|230
Pamlico|290
Pere Marquette|108
Rondout Creek|102
Root|129
San Saba|235
Satilla|418
Sol Duc|126
South Fork American|140
Teton (Idaho)|132
Tualatin|125
Amite|188
Aucilla|143
Auglaize|182
Betsie|87
Blue Earth|174
Cannon|180
Clarks Fork Yellowstone|220
Clinton|134
Coyote Creek|102
Crooked (Oregon)|233
Dirty Devil|129
Kokosing|92
Shenango|148
Malheur|306
Ochlockonee|332
Otter Creek|180
Portneuf|200
Rifle|97
Rocky|152
San Luis Rey|111
Santa Ynez|148
Shiawassee|180
Skunk|150
Spoon|237
Big Wood|220
Little Kanawha|269
Chipola|149
Conasauga|150
Conecuh|415
Crab Creek|262
Eagle|100
East Branch Delaware|121
Elkhorn|470
Embarras|298
French Creek (Pennsylvania)|188
Leon|298
Lost|97
Oswegatchie|225
Paria|153
Pocomoke|106
Puerco|269
Reedy|105
Saranac|130
Siuslaw|177
Thornapple|142
Tonawanda Creek|145
Wapsipinicon|480
West Fork|166
Zuni|145
Bosque|185
Connoquenessing Creek|93
Delta|129
Galena|84
Jackson|154
Judith|220
Lynches|225
Mattaponi|166
Missisquoi|148
Nanticoke|104
Pecatonica|312
Red Cedar (Michigan)|82
Selway|162
Sugar Creek (Wabash River)|150
Tellico|85
Angelina|193
Beaver (Oklahoma)|451
Cache Creek|140
Chariton|218
Conejos|149
Cowpasture|135
Crow Wing|182
Dismal|116
Double Mountain Fork Brazos|280
Escalante|145
Floyd|180
Latah Creek|89
Leaf (Mississippi)|290
Levisa Fork|264
Ohoopee|160
Maquoketa|240
Westfield|126
Mountain Fork|158
Navasota|201
North Fork American|142
North Fork Feather|113
North Toe|118
Pine (Michigan)|86
Rock Creek (Montana)|80
Roeliff Jansen Kill|90
Saline (Kansas)|639
Sespe Creek|98
Sheepscot|106
Siletz|109
Sulphur|282
Swatara Creek|114
West Canada Creek|122
Wichita|140
Williamson|161
Aroostook|180
Ashuelot|103
Baraboo|115
Big Blue|578
Big Darby Creek|135
Calapooia|116
Cass|100
Cattaraugus Creek|109
Duchesne|185
Fall Creek|93
Fountain Creek|120
Greys|100
Gros Ventre|120
Hatchie|383
Knife|193
Lamoille|137
Uwharrie|100
Loyalsock Creek|102
Maurice|80
Meherrin|231
Myakka|106
North Fork|175
North Fork South Platte|80
Onion Creek|127
Piru Creek|114
Priest|109
Salt Fork Brazos|241
Sauk|196
Sheboygan|130
Stillwater (Montana)|100
Upper Iowa|251
Wakarusa|130
West Branch Penobscot|190
Alagnak|103
Applegate|82
Bad (South Dakota)|260
Big Piney|177
Big Walnut Creek|93
Bourbeuse|240
Chickasawhay|340
Fortymile|97
Fremont|153
Frenchman|341
Fresno|134
Goose Creek (Virginia)|89
Hoback|89
Iroquois|166
Kiamichi|266
Little Arkansas|206
Little Wabash|382
Long Tom|92
Mackinaw|210
Manistique|114
Michigan River|111
Middle Fork American|100
Middle Fork Willamette|185
Millers|84
Nodaway|106
North Anna|115
North Fork Double Mountain Fork Brazos|121
Nottoway|249
Nowitna|402
Oatka Creek|93
Obion|116
Patoka|260
Paw Paw|99
Pea|248
Portage|100
Poteau|227
Powell|315
Price|220
Queets|89
Raft|174
Ruby|122
Sac|190
Sagavanirktok|290
Salmon Falls Creek|195
Shasta|93
South Anna|164
South Fork Eel|169
South Yuba|105
Suiattle|97
Sun|209
Susan|108
Tensas|285
Van Duzen|96
Vermillion (Minnesota)|96
Wallowa|89
Battle Creek (Michigan)|88
Belly|220
Big Sandy Creek|340
Big South Fork of the Cumberland|122
Bluestone|124
Boulder (Montana)|100
South Fork Kern|153
Caney|290
Casselman|91
Castor|111
Chateauguay|112
Chewaucan|85
Chikaskia|233
Cohocton|94
Coleen|233
Conewango Creek|114
Cottonwood|245
Donner und Blitzen|97
Quinn|177
Escanaba|84
Firth|180
Flat|113
Flatrock|142
Grasse|117
Heart|290
Homochitto|145
Imnaha|117
Innoko|805
Jarbidge|84
Kanab Creek|145
Klickitat|154
La Crosse|98
Lampasas|135
Lavaca|185
Little Blue|394
Little Minnesota|115
Little Sioux|415
Locust Fork of the Black Warrior|254
Looking Glass|114
Loyalhanna Creek|80
Mermentau|112
Pease|161
Molalla|80
Mulberry|112
Muscatatuck|85
Nestucca|92
Ninnescah|91
North Fork Red|436
Northeast Cape Fear|209
Pembina|513
Peshtigo|219
Piscataquis|100
Pudding|100
Raystown Branch Juniata|100
Redwood Creek|99
Roseau|344
St. Regis|138
Salt Fork Arkansas|385
San Benito|175
Schroon|109
Sequatchie|187
Shark|153
Shavers Fork|143
Smith (Montana)|200
Sugar|146
Thunder Bay|121
Tonto Creek|117
Turkey River|241
Wildcat Creek|135
Wills Creek|149
Yaquina|95
Alcovy|111
Arroyo Colorado|231
Banister|127
Bayou Macon|351
Big Sandy (Arizona)|90
Blanchard|166
Boeuf|370
Burnt|140
Buttahatchee|121
Calaveras|84
Caney Creek|249
Cannonball|217
Chandalar|161
Chowchilla|87
Cispus|85
Clam|82
Coldwater|219
Collins|108
Conewago Creek|129
Contentnea Creek|146
Cuyama|190
Eau Claire|120
Florida River|99
Floyds Fork|100
Fourche La Fave|225
Greybull|145
Iditarod|523
Jemez|129
Lamprey|80
Lemhi|97
Pomme de Terre (Missouri)|182
Little Salmon|82
Little Sandy|137
Little Snake|241
Little Susitna|180
Loosahatchie|103
Medicine Bow|269
Michigamme|104
Middle Fork Flathead|148
Moreau (South Dakota)|468
Muddy Boggy Creek|175
Mulberry Fork of the Black Warrior|164
Nacimiento|104
Navidad|145
Nemadji|114
North Fork Clearwater|215
North Fork Flathead|246
North Fork Payette|182
North Santiam|145
North Umpqua|171
North Yuba|98
One Hundred and Two|129
Oyster Creek|84
Paint Creek (Ohio)|153
Pine Island Bayou|89
Red Creek|129
Redwood|205
Rockcastle|89
Sabinal|93
Salamonie|136
Sanpoil|95
Scott|97
Shell Rock|182
Silvies|192
Sipsey Fork of the Black Warrior|114
Sipsey|233
Solomon|296
South Fork Flathead|158
South River (Georgia)|102
South Umpqua|185
St. George|92
Tangipahoa|196
Tickfaw|182
Tioga|93
Touchet|105
Trempealeau|131
Unadilla|114
Walnut|248
West Walker|153
Wynoochee|97
Yalobusha|190
Alamosa|103
Alatna|233
Aravaipa Creek|89
Bark|109
Bayou Pierre|127
Belle|118
Big Piney Creek|114
Big Sable|84
Black Bayou|107
Black Fork Mohican|94
Boone|179
Bouie|97
Butte Creek|150
Chatanika|206
Chulitna|113
Cottonwood Creek|109
Cucharas|121
Dearborn|113
Dix|128
East Branch Penobscot|121
East Fork Carson|98
South Fork Salmon|138
East Walker|145
Entiat|91
Fall|103
Fawn|89
Huerfano|182
Indian Creek (Idaho)|106
Iskut|240
Keya Paha|204
Killbuck Creek|132
Kinchafoonee Creek|121
Koyuk|185
L'Anguille|175
Lake Fork Gunnison|104
Lamine|103
Laughery Creek|130
Le Sueur|178
Lee Creek|104
Little Deschutes|169
Little Muskingum|105
Little Niangua|103
Little Platte|107
Luckiamute|98
Machias|97
Mahanoy Creek|83
Maple (Michigan)|119
Marmaton|164
Meadow|85
Middle Fork Feather|158
Middle Fork Vermilion|124
Middle Island Creek|124
Mulchatna|260
Mustinka|112
Navajo|87
North Fork Kentucky|238
Noxubee|146
Oconto|92
Ohio Brush Creek|93
Pahsimeroi|95
Paint Rock|94
Poplar|269
Salcha|201
Salt Fork Vermilion|121
San Rafael|145
Sebasticook|122
Sheenjek|320
Shields|105
Sixteen Mile Creek|111
South Branch Kishwaukee|103
South Fork Catawba|88
South Fork Trinity|148
South Santiam|97
South Yadkin|121
Stony Creek|118
Stony|310
Sturgeon (Michigan)|169
Talkeetna|137
Tiffin|121
Toklat|140
Tucannon|100
Uinta|97
Wahweap Creek|89
Weiser|166
Wild Rice (North Dakota)|390
Yentna|121
Yockanookany|126
Anaktuvuk|217
Anderson|80
Andreafsky|193
Antler|315
Anvik|225
Apishapa|224
Bayou Meto|240
Beaver Creek (Alaska)|290
Big Bureau Creek|117
Big Fork|265
Big Muddy Creek|307
Boyer|190
Camas Creek (Idaho)|103
Charley|140
Chevelon Creek|134
Cloquet|167
Comite|90
Craig Creek|135
Des Lacs|200
Embarrass|81
Goodpaster|205
Gulkana|97
Hayfork Creek|80
Holmes Creek|90
Ikpikpuk|308
Itkillik|354
Kanektok|121
Kantishna|174
Klutina|100
Kokolik|322
Kongakut|177
Kuparuk|322
La Moine|201
La Plata|110
Lac qui Parle|190
Little Fork|260
Ocheyedan|93
Little Popo Agie|93
Little Tallapoosa|156
Little Wood|210
Lodgepole Creek|447
Long Prairie|148
Loutre|92
Macoupin Creek|160
Malad|156
Mattawamkeag|82
Medicine Lodge|209
Middle Fork Eel|112
Middle Fork Koyukuk|100
Middle|198
Middle Yuba|89
Muddy Creek|207
Nabesna|117
Narraguagus|89
Natalbany|128
Watonwan|182
Nowood|153
Old Crow|282
Otselic|89
Palo Duro Creek|135
Pawnee|319
Pelican|130
Petit Jean|210
Poso Creek|141
Potlatch|90
Prairie (Minnesota)|80
Roubidoux Creek|92
Salt Creek|180
Salt Fork Red|311
San Pitch|105
Sand Creek|235
Santa Maria|80
Seco Creek|106
South Fork Clearwater|100
South Fork Spring|121
South Yamhill|97
Strawberry|185
Succor Creek|111
Sycan|121
Symmes Creek|113
Tarkio|130
Tierra Blanca Creek|175
Tionesta Creek|93
Tomichi Creek|116
Tygarts Creek|142
Unalakleet|145
Unuk|129
White Earth|80
Willow Creek (Oregon)|127
Wulik|129
Caldwell Brook|80
Agiapuk|97
Aichilik|121
Ambler|121
Aniak|153
Arrow Creek|185
Atchuelinguk|265
Attoyac|97
Auxvasse Creek|80
Awuna|320
Bannock Creek|108
Bayou DeView|134
Bayou des Arc|119
Beals Creek|108
Bear Creek|260
Bearpaw|89
Beaucoup Creek|132
Belt Creek|129
Big Creek|356
Birch Creek|241
Bonpas Creek|93
Brady Creek|145
Buckatunna Creek|97
Buckland|108
Bully Creek|100
Butter Creek|92
Castor Creek|166
Chico Creek|87
Chief Eagle Eye Creek|98
Chilikadrotna|90
Christian|230
Clearfield Creek|118
Cobb|126
Cow Creek|180
Crooked Creek|82
Deep Creek|117
Draanjik|250
Dry|142
Dugdemona|208
East Nishnabotna|190
East Nodaway|118
Edwards|119
Etivluk|90
Fifteenmile Creek|87
First Broad|101
Flatrock Creek|92
Forest|130
Fourche Maline|113
Frenchman Creek|267
Goose|288
Henderson Creek|104
Hogatza|190
Holitna|180
Horse Creek|208
Igushik|80
Ipnavik|110
Ivishak|153
Jago|135
Jordan Creek|159
Kandik|132
Kanuti|282
Killik|169
King Salmon|108
Kivalina|97
Kiwalik|93
Kugruk|97
Kukpowruk|285
Kukpuk|201
Kuzitrin|153
Ladder Creek|370
Little Cottonwood|133
Little Muddy (Illinois)|117
Little Owyhee|98
Little Rock|120
Little Vermilion|96
Little White|377
Little Wind|80
Meade|404
Melozitna|217
Middle Fork John Day|118
Middle Nodaway|96
Minam|82
Mosquito Creek|97
Mulberry Creek|93
New Fork|113
Nigu|113
Niukluk|84
North Concho|158
North Fork Cache la Poudre|95
North Fork Coquille|86
North Fork Embarras|103
North Fork John Day|172
North Fork Malheur|95
North Fork Republican|89
North Fork Smoky Hill|314
North Fork Solomon|462
North Laramie|131
Okatibbee Creek|123
Okpilak|117
Pecan Bayou|84
Piceance Creek|93
Pipestone Creek|87
Plateau Creek|80
Ponca Creek|224
Prairie Dog Creek|396
Pumpkin Creek|80
Rattlesnake Creek|153
Redeye|117
Rice|92
Rio San Jose|145
Rolling Fork|89
Running Water Draw|241
Sacramento Wash|80
Saguache Creek|142
Sailor Creek|103
Sappa Creek|241
Selawik|225
Sepulga|99
Silver Creek|140
Sixtymile|165
Skillet Fork|158
Skwentna|160
Soldier|108
South Fork Coquille|101
South Fork Crooked|122
South Fork John Day|97
South Fork Republican|275
South Fork Solomon|470
Southwest Branch Saint John|100
Spring Creek|123
Squirrel|116
Sucarnoochee|80
Swift|160
Tallahala Creek|105
Thomes Creek|100
Tlikakila|82
Trade|82
Turkey Creek|138
Tyson Wash|80
Upper Little|82
Utukok|362
Warm Springs|80
West Branch Mattawamkeag|85
West Little Owyhee|101
West Nishnabotna|190
West Nodaway|115
Whiteface|104
Whiting|80
Wild|107
Wyaconda|81
Yellow Creek|80
Dago Creek|80
Little Cedar|133
Sheep Creek|101
Croton Creek|105
Eek|200
Elm Creek|144
Little Eau Pleine|92
Little Laramie|81
North Fork Hughes|88
South Fork Grand|230
Gakona|103
Huslia|161
Buffalo Creek|135
Foraker|97
Two Butte Creek|245
Sand Hill|168
Serpentine|108
Bonasila|201
Dog Salmon|113
Herron|87
Honey Creek|80
Kadleroshilik|104
Maravillas Creek|145
Rapid|80
Rush Creek|164
Vermillion Creek|108
Chandler|201
Clover Creek|89
Kruzgamepa|90
Sans Bois Creek|90
South Fork Hughes|90
Trout Creek|82
Kugarak|93
La Grue Bayou|90
Hodzana|200
Union Flat Creek|116
Troublesome Creek|83
Big Jacks Creek|93
Blue Creek|85
Marsh Creek|90
Noxapaga|90
Dry Creek|87
High Island Creek|112
Tagagawik|150
Willow|122
Jack Creek|103
Epizetka|129
Mystic|11
Harlem|13
Miami|9
Bronx|39
Newtown Creek|6
Patapsco|54
Anacostia|14
Piscataqua|19
Arroyo Seco|40
Bubbly Creek|3
Paluxy|47
Little Pigeon|48
Hackensack|72
Rouge|75
Calumet|12
Two Hearted|38
Roe|0.06
D River|0.04
East River|25
Irwell|63
Colne|58
Tame|95
Wensum|75
Soar|95
Yare|84
Weaver|114
Roding|50
Rother|56
Coquet|90
Thame|65
Waveney|95
Deben|54
Bure|80
Brue|61
Dove|72
Douglas|56
Chelmer|64
Little Ouse|60
Alde|54
Anker|50
Lark|57
Teviot|60
Evenlode|72
Ise|51
Wansbeck|50
Teith|113
Wissey|50
Teise|112
Ythan|60
Brosna|79
Clare|93
Devon|54
Finn|63
Isla|74
Taf|56
Feale|75
Inny|89
Leadon|51
Lossie|50
Ettrick Water|53|Ettrick
Kells Blackwater|68
Awbeg|51
Bride|64
Cary|56
Funshion|56
Glyde|56
Irthing|55
Nairn|61
Rede|52
Fane|62
Little Brosna|58
Annalee|67
Ballisodare|61
Owenmore|52
Deel|63
Robe|64
Eisbach|2
Breg|46
Saar|246|Sarre
Hase|170
Elz|121
Emscher|83
Tollense|96
Murg|80
Vechte|182
Bille|65
Gera|85
Red Main|72
Salza|90
Oude IJssel|82
Erft|107
Itz|79
Kyll|128
Lenne|129
Mohne|65|Moehne
Saalach|106
Schwentine|62
Uecker|98
Werre|72
Zwickauer Mulde|166
Berkel|115
Blies|100
Bode|169
Treene|95
Chiers|140
Elde|220
Franconian Saale|140
Moll|84|Moell
Nagold|91
Niers|113
Recknitz|72
Stor|87|Stoer
Wumme|121|Wuemme
Agger|70
Aisch|83
Diemel|110
Dinkel|89
Este|64
Fils|63
Freiberger Mulde|124
German Thaya|76
Glan|90
Grossache|79
Innerste|101
Lavant|72
Oste|156
Paar|137
Pinka|100
Prum|95|Pruem
Schwechat|62
Speyerbach|60
Sude|85
Waldnaab|99
Zschopau|128
Abens|71
Wetter|69
Bohme|72|Boehme
Dosse|94
Emmer|62
Erlauf|78
Nidder|69
Floha|67|Floeha
Franconian Rezat|77
Friedberger Ach|100
Fuhse|95
Grosse Aue|88
Grosse Laber|88
Grosse Roder|105|Grosse Roeder
Haune|67
Helme|65
Isen|81
Jeetzel|73
Kammel|74
Lafnitz|114
Lauchert|60
Ledava|80
Lieser|74
Locknitz|66|Loecknitz
Mindel|81
Nebel|60
Nied|114
Nims|61
Nister|64
Nuthe|65
Ohm|61
Pfinz|60
Piesting|77
Prims|91
Rabnitz|120
Rott|111
Salm|63
Schipbeek|85
Schmutter|96
Schwalm|97
Schwarze Laber|78
Selke|64
Selz|63
Sinn|69
Soeste|72
Stepenitz|84
Trebel|75
Triesting|64
Wern|71
Werse|67
Wesenitz|83
Wied|103
Wiesent|79
Wipper|85
Zusam|97
Ortze|62|Oertze
Epte|113
Douve|79
Meurthe|161
Odet|63
Deule|73
Drome|111
Huisne|165
Linge|100
Serein|188
Dives|105
Sevre Nantaise|142
Vesle|139
Authie|108
Clain|144
Erdre|97
Haine|78
Ouche|95
Risle|145
Seille|138
Sienne|93
Sevre Niortaise|158
Arize|84
Aure|82
Bresle|68
Calavon|87
Fier|72
Golo|89
Iton|132
Layon|90
Luy|154
Mark|81
Oust|145
Sioule|164
Selune|85
Tech|85
Touques|108
Ubaye|83
Aigues|114
Ailette|60
Anglin|91
Armancon|202
Arnon|151
Bruche|77
Chassezac|85
Ciron|97
Cosson|96
Dourdou de Conques|84
Dropt|132
Gartempe|205
Grand Morin|118
Grosne|97
Louge|100
Madon|97
Meu|84
Moder|82
Neste|73
Orbieu|84
Ource|100
Ouveze|93
Petit Morin|86
Scorff|79
Thouet|142
Therain|94
Tinee|70
Trieux|72
Vendee|83
Vidourle|95
Vingeanne|93
Yevre|81
Aff|66
Agly|80
Arconce|99
Argenton|71
Aron|104
Arros|130
Arroux|128
Arz|66
Asse|76
Aujon|68
Auron|77
Auroue|62
Authion|100
Auvezere|112
Avre|80
Azergues|62
Bandiat|91
Bar|62
Benaize|79
Besbre|106
Beuvron|115
Bidouze|82
Bienne|69
Blaise|86
Bleone|70
Bouble|65
Boulogne|87
Bourbince|82
Bourbre|72
Boutonne|99
Bouzanne|84
Brame|60
Braye|75
Brenne|72
Buech|85
Bethune|61
Charentonne|63
Chere|65
Cisse|88
Clouere|76
Cure|113
Cere|120
Cerou|87
Dadou|116
Dheune|71
Dive|74
Dore|140
Dourbie|72
Dourdou de Camares|87
Doux|70
Douze|124
Ernee|65
Esteron|66
Eyrieux|83
Gabas|117
Gardon d'Ales|61
Gimone|136
Gelise|92
Helpe Majeure|69
Hers-Mort|89
Hers-Vif|135
Indrois|60
Lanterne|64
Lay|120
Lignon du Velay|85
Lizonne|61
Louts|86
Luy de Bearn|77
Leze|70
Maronne|93
Mortagne|75
Mouzon|63
Ninian|60
Ornain|116
Osse|120
Othain|67
Ouanne|84
Oudon|103
Petite Creuse|95
Reyssouze|75
Salat|74
Sauldre|183
Saulx|115
Serre|96
Seudre|68
Seugne|83
Seulles|72
Suippe|82
See|79
Seoune|65
Taravo|65
Tardes|77
Tardoire|114
Taurion|108
Tavignano|89
Thore|62
Tille|83
Touch|75
Varenne|60
Veyle|67
Vezouze|75
Viaur|168
Vie|62
Yerres|98
Zorn|97
Evre|92
Rio Tinto|100
Arlanza|160
Oja|65
Irati|84
Maira|120
Senio|92
Torre|70
Adaja|163
Almanzora|90
Deva|64
Eresma|134
Esino|85
Mundo|150
Orco|90
Piedra|76
Santerno|103
Sillaro|66
Sinni|94
Tambre|134
Agri|136
Alva|110
Amendolea|69
Belbo|95
Bernesga|80
Cedrino|80
Ceno|63
Cervo|65
Clitunno|60
Enza|93
Foglia|90
Fortore|110
Gela|62
Guadalentin|121
Guadarrama|132
Idice|78
Lozoya|91
Lerez|60
Najerilla|100
Narcea|123
Nure|75
Orba|68
Paglia|86
Sacco|87
Serpis|75
Trigno|85
Zadorra|78
Agueda|130
Agogna|140
Albegna|70
Alhama|84
Anoia|68
Ardila|166
Arnoia|85
Aso|63
Barbate|80
Bidente-Ronco|135
Cadagua|70
Calore Lucano|63
Candigliano|60
Carapelle|98
Cea|157
Cega|133
Chanza|117
Chiascio|95
Cidacos|83
Ciguela|225
Corno|60
Dittaino|105
Duraton|106
Ega|113
Eo|92
Esgueva|116
Gallo|85
Gornalunga|81
Guadalimar|180
Guadalmellato|111
Guadalmena|91
Guadaira|110
Guadiamar|82
Guadiana Menor|152
Guadiela|117
Gevora|74
Isabena|69
Jabalon|161
Lamone|88
Magro|130
Matarranya|100
Merse|70
Montone|90
Musone|76
Nela|75
Neto|80
Nora|67
Oca|70
Potenza|95
Saja|67
Sorbe|80
Tajuna|225
Tammaro|78
Tanagro|92
Tenna|70
Tera|140
Tiron|63
Trabancos|86
Urola|64
Varaita|75
Vomano|76
Zancara|168
Altaelva|240|Alta
Nordura|62
Jokulsa a Dal|150
Svartan|91
Lainio|266|Lainioalven
Lakselva|103
Anarjohka|153
Byske|215
Borselva|76
Laisalven|190
Renaelva|165
Stabburselva|60
Voxnan|150
Vasterdal|300|Vasterdalalven
Ammeran|70
Barduelva|70
Bjoreio|72
Braknean|84
Etna|106
Fyllean|60
Giman|170
Hedstrommen|128
Hofsa|85
Karup|78
Keravanjoki|65
Kilaan|63
Koitajoki|200
Kolbacksan|180
Kovda|233
Kvina|152
Kavlinge|90|Kavlingean
Konkamaeno|150
Kudafljot|115
Lemmenjoki|80
Loimijoki|114
Lotta|190
Luiro|227
Lyckebyan|90
Lygna|82
Lataseno|100
Nea|80
Nykopingsan|150
Naatamo|100
Pyhajoki|166
Parlalven|139
Rautas|135|Rautasalven
Ronneby|110
Rottnan|110
Rane|210|Ranealven
Ronne|83
Sagan|70
Simoa|88
Simojoki|193
Sira|152
Svartelva|71
Tovdalselva|143
Vanan|110
Vojman|225
Ore|225|Orealven
Osterdal|300|Osterdalalven
Ne|66
Busento|0
Sio|116
Omo|760|Omo River
Kinzig (Rhine)|93
Ill (Vorarlberg)|72
Ohre (Germany)|105
Ilm (Bavaria)|84
Krems (Upper Austria)|62
Sauer (France)|85
Vils (Naab)|87
Aa (Netherlands)|90
Arc (Provence)|83
Aire (France)|125
Don (France)|92
Save (France)|144
Tana (Norway)|361
Lagan (Sweden)|244
Nidelva (Agder)|222
Gaula (Vestland)|63
Dee (Aberdeenshire)|140
Stour (Suffolk)|76
Avon (Hampshire)|96
Don (Yorkshire)|111
Derwent (Yorkshire)|115
Blackwater (Essex)|70
Stour (Dorset)|98
Don (Aberdeenshire)|135
Blackwater (Northern Ireland)|91
South Esk (Angus)|79
Main (County Antrim)|55
Dee (Ireland)|60
Colorado River (Texas)|1387
Grand (Michigan)|420
Green (Washington)|105
Fox (Wisconsin)|322
White (Indiana)|583
Green (Kentucky)|618
San Juan (Four Corners)|616
Pearl River (Mississippi)|715
Thames (Connecticut)|25
Trinity (California)|266
Jordan River (Utah)|82
Buffalo (New York)|13
Santa Cruz (Arizona)|296
Grand (South Dakota)|303
Peace (Florida)|170
Flint (Michigan)|126
Black River (Arkansas)|480
Black River (New York)|194
James (North Dakota)|1143
St. Marys (Florida)|380
Guadalupe (California)|160
New River (Mexico)|125
Black River (Wisconsin)|310
Deschutes (Washington)|86
St. Joseph (Indiana)|161
Mad (California)|182
St. Croix (Maine)|102
White (Washington)|120
Buffalo (Tennessee)|201
Grand (Ohio)|165
New River (North Carolina)|80
Salt (Kentucky)|240
Bear (California)|117
Black River (North Carolina)|85
Black River (Arizona)|183
Blue (Oklahoma)|227
James (Missouri)|209
San Gabriel (Texas)|102
Black River (South Carolina)|243
Grand (Missouri)|760
Green (North Carolina)|94
Salt (Wyoming)|135
White (Nebraska)|933
Blackwater (Virginia)|170
Illinois River (Oregon)|90
Vermilion (Illinois)|176
Whitewater (Ohio)|163
Eel (Indiana)|176
Elk (Alabama)|314
White (Vermont)|97
Rio Puerco|370
Spring (Missouri)|208
Sweetwater (California)|88
Flint (Alabama)|106
Little Missouri (Arkansas)|237
Platte (Iowa)|322
St. Marys (Indiana)|159
White (Colorado)|314
Chippewa (Michigan)|150
Little (Oklahoma)|350
Little (Texas)|167
Red Lake River|312
Red River (Tennessee)|161
Swan River (Montana)|153
Vermilion (Ohio)|95
Bad (Wisconsin)|122
Big Blue (Indiana)|135
Cimarron (New Mexico)|97
Saline (Arkansas)|325
San Miguel (Colorado)|145
St. Mary|235
Stillwater (Ohio)|111
Trent (North Carolina)|140
White (Yukon)|322
Yellow River (Indiana)|100
Apple (Illinois)|89
Beaver (Utah)|177
Black River (Michigan)|130
Cache (Arkansas)|343
Moose (Maine)|134
Powder (Oregon)|246
Red Cedar (Wisconsin)|137
Red River (Kentucky)|160
Salt (Missouri)|89
Smith (Oregon)|146
Snake River (Minnesota)|167
White (Texas)|100
Withlacoochee (Georgia)|185
Big Sandy (Tennessee)|90
Big Sandy (Wyoming)|100
Blackwater (Missouri)|127
Chippewa (Minnesota)|246
Elk (Minnesota)|135
Saint Francis (Maine)|110
Sandy (Maine)|118
Vermillion (South Dakota)|154
White (Oregon)|80
Yellow River (Alabama)|190
Battle Creek (Montana)|203
Blackfoot (Idaho)|215
Canning (Alaska)|200
English (Iowa)|137
Delaware River (Kansas)|151
Elk (Kansas)|153
Fish (Maine)|110
Green (Illinois)|143
Kettle (Minnesota)|130
Logan (Utah)|86
Ottawa River (Ohio)|80
Pine (Wisconsin)|166
Pomme de Terre (Minnesota)|201
Rio Hondo (New Mexico)|137
South River (North Carolina)|126
Sugar Creek (Illinois)|85
Teton (Montana)|240
White (California)|82
Yellow River (Wisconsin)|105
Big Black (Quebec)|85
Buffalo (Minnesota)|224
Buffalo (Wisconsin)|110
Clear Creek (Wyoming)|105
Colville (Washington)|93
Crooked (Missouri)|113
Delaware River (Texas)|80
French Creek (South Dakota)|100
Goose Creek (Utah)|198
Henrys Fork (Wyoming)|90
John River|201
Little (North Carolina)|114
Little (Louisiana)|145
Little (Virginia)|105
Paint Creek (Texas)|85
Platte (Minnesota)|89
Rio Salado (New Mexico)|138
Rock (Minnesota)|232
Saint Charles|104
Volga (Iowa)|129
Wild Rice (Minnesota)|257
Yellow River (Iowa)|86
American (Alaska)|88
Battle Creek (Idaho)|108
Beaver Creek (Iowa)|124
Black Lake Bayou|169
Canadian (Colorado)|89
Clear Creek (California)|98
Fox (Iowa)|172
Indian Creek (Illinois)|84
Leaf (Minnesota)|80
Little Muddy (North Dakota)|154
Maple (Minnesota)|130
Middle River|154
Moreau (Missouri)|120
North River (West Virginia)|84
North River (Missouri)|132
North River (Washington)|97
Pine (Minnesota)|92
Prairie (Michigan)|87
Rock Creek (Oregon)|90
Rock Creek (Wyoming)|105
Rock Creek (Washington)|90
Salmon (Alaska)|122
Slana (Alaska)|89
Saint Francis (Minnesota)|115
Sturgeon (Minnesota)|82
Swan River (Minnesota)|116
Thompson (Missouri)|303
Tongue (North Dakota)|143
Whitewater (Kansas)|100
Willow Creek (Utah)|126
Willow Creek (Idaho)|135
Wind (Alaska)|129
`;

export const MOUNTAINS = `
Mount Everest|8849|Everest,Sagarmatha,Chomolungma
K2|8611|Mount Godwin-Austen
Kangchenjunga|8586
Lhotse|8516
Makalu|8485
Cho Oyu|8188
Dhaulagiri|8167
Manaslu|8163
Nanga Parbat|8126
Annapurna|8091
Gasherbrum I|8080|Hidden Peak,Gasherbrum
Gasherbrum II|8035|K4
Broad Peak|8051
Shishapangma|8027
Aconcagua|6961|Mount Aconcagua
Ojos del Salado|6893
Huascaran|6768
Illimani|6438
Chimborazo|6263|Mount Chimborazo
Denali|6190|Mount McKinley
Mount Logan|5959|Logan
Cotopaxi|5897
Kilimanjaro|5895|Mount Kilimanjaro,Uhuru Peak
Elbrus|5642|Mount Elbrus
Pico de Orizaba|5636|Citlaltepetl,Orizaba
Damavand|5610|Mount Damavand
Popocatepetl|5426
Mount Kenya|5199|Batian
Mount Ararat|5137|Ararat
Mount Vinson|4892|Vinson Massif
Puncak Jaya|4884|Carstensz Pyramid
Mont Blanc|4808|Mount Blanc
Matterhorn|4478|Monte Cervino
Monte Rosa|4634|Dufourspitze
Mount Whitney|4421|Whitney
Mount Elbert|4401|Elbert
Mount Rainier|4392|Rainier
Mount Shasta|4322|Shasta
Pikes Peak|4302
Mauna Kea|4207
Mauna Loa|4169
Toubkal|4167|Mount Toubkal
Jungfrau|4158
Mount Kinabalu|4095|Kinabalu
Mount Cameroon|4040|Cameroon Mountain
Eiger|3967|The Eiger
Mount Robson|3954|Robson
Grossglockner|3798
Mount Erebus|3794|Erebus
Mount Fuji|3776|Fuji,Fujisan,Fujiyama
Aoraki|3724|Mount Cook,Aoraki Mount Cook
Mount Teide|3715|Teide,Pico del Teide
Thabana Ntlenyana|3482
Mount Hood|3429|Hood
Mount Etna|3357|Etna
Haleakala|3055
Mount Olympus|2917|Olympus,Mount Olympos
Zugspitze|2962
Mount Ruapehu|2797|Ruapehu
Mount Hermon|2814|Hermon
Mount Roraima|2810|Roraima
Half Dome|2694
Mount St Helens|2549|Mount Saint Helens
Mount Taranaki|2518|Taranaki,Mount Egmont
El Capitan|2308
Mount Vitosha|2290|Vitosha
Mount Sinai|2285|Sinai
Mount Kosciuszko|2228|Kosciuszko,Kosciusko,Mount Kosciusko
Mount Mitchell|2037
Mount Washington|1917
Mont Ventoux|1909
Mount Marcy|1629|Marcy
Mount Katahdin|1606|Katahdin
Puy de Dome|1465
Ben Nevis|1345
Vesuvius|1281|Mount Vesuvius
Table Mountain|1086
Scafell Pike|978
Snowdon|1085|Yr Wyddfa
Carrauntoohil|1038
Stromboli|924|Mount Stromboli
Mount Nebo|817|Nebo
Corcovado|710
Sugarloaf Mountain|396|Pao de Acucar
Uluru|863|Ayers Rock
Grand Teton|4199
Longs Peak|4346|Long Peak
Mount Baker|3286
Clingmans Dome|2025|Kuwohi
Black Elk Peak|2207|Harney Peak
Pico Duarte|3098
Blue Mountain Peak|2256
Mount Apo|2954
Mount Pinatubo|1486|Pinatubo
Mayon|2463|Mount Mayon
Mount Bromo|2329|Bromo
Mount Merapi|2930|Merapi
Mount Semeru|3676|Semeru
Mount Agung|3031|Agung
Krakatoa|813|Krakatau
Mount Rinjani|3726|Rinjani
Mount Aso|1592|Aso
Paektu Mountain|2744|Mount Paektu,Baekdu
Hallasan|1947|Mount Halla
Huangshan|1864|Yellow Mountain
Mount Tai|1545|Taishan
Ama Dablam|6812
Machapuchare|6993|Fishtail Mountain
Kirkjufell|463
Galdhopiggen|2469
Kebnekaise|2096
Snezka|1603|Sniezka
Rysy|2503
Triglav|2864
Musala|2925
Mount Ida|2456|Psiloritis
Mount Athos|2033|Athos
Gran Sasso|2912|Corno Grande
Marmolada|3343
Piz Bernina|4049
Weisshorn|4506
Aneto|3404
Mulhacen|3479
Mount Ossa (Tasmania)|1617
Mount Tongariro|1978|Tongariro
Mount Ngauruhoe|2291|Ngauruhoe
Mount Massive|4398
Mount Harvard|4395
Blanca Peak|4374
La Plata Peak|4370
Uncompahgre Peak|4361
Grays Peak|4352|Greys Peak
Torreys Peak|4349
Quandary Peak|4348
Mount Blue Sky|4348|Mount Evans
Maroon Bells|4315
Mount of the Holy Cross|4324
Mount Sneffels|4315
Wilson Peak|4342
Mount Princeton|4327
Mount Yale|4335
Capitol Peak|4341
Pyramid Peak (Colorado)|4275
Crestone Peak|4359
Gannett Peak|4209
Cloud Peak|4014
Wind River Peak|4020
Granite Peak|3901
Borah Peak|3859
Kings Peak|4123
Mount Timpanogos|3582
Wheeler Peak (New Mexico)|4011
Sandia Crest|3255|Sandia Peak
Truchas Peak|3999
Mount Columbia|3747
Mount Assiniboine|3618
Mount Temple|3544
Mount Rundle|2949
Cascade Mountain (Alberta)|2998
Sulphur Mountain|2451
Mount Norquay|2522
Mount Edith Cavell|3363
Mount Athabasca|3491
Castle Mountain|2766
Mount Lefroy|3423
Mount Forbes|3612
Mount Alberta|3619
Snow Dome|3456
Chief Mountain|2764
Mount Cleveland (Montana)|3190
Monte Pissis|6793
Cerro Bonete|6759
Tres Cruces|6748
Llullaillaco|6739
Mercedario|6720
Yerupaja|6635
Sajama|6542|Nevado Sajama
Coropuna|6425
Ampato|6288
Huayna Potosi|6088
Illampu|6368
Ancohuma|6427
Nevado del Ruiz|5321
Cayambe|5790
Antisana|5704
Tungurahua|5023
Sangay|5286
Pico Bolivar|4978
Pico Humboldt|4940
Fitz Roy|3405|Cerro Chalten,Monte Fitz Roy,Cerro Fitz Roy
Cerro Torre|3128
Paine Grande|3050|Cerro Paine Grande
Torres del Paine|2850
Osorno|2652|Volcan Osorno
Villarrica|2860
Lanin|3747
Tronador|3491
Licancabur|5916
Alpamayo|5947
Salkantay|6271|Salcantay
Ausangate|6384
Nevado Mismi|5597
El Plomo|5424|Cerro El Plomo
Tupungato|6570
Marmolejo|6108
Nevado de Cachi|6380
Cerro Catedral|2388
Cerro Castillo|2675
Lascar|5592
Galeras|4276
Nevado del Huila|5364
Nevado del Tolima|5215
Purace|4650
Cotacachi|4944
Imbabura|4630
Pichincha|4784
Reventador|3562
El Altar|5320
Chachani|6057
El Misti|5822|Misti
Ubinas|5672
Sabancaya|5976
Parinacota|6380
Guallatiri|6071
Cerro Rico|4782
Uturuncu|6008
Tunupa|5321
Chacaltaya|5421
Calbuco|2003
Puyehue|2236
Descabezado Grande|3830
Nevados de Chillan|3212
Llaima|3125
Cerro Hudson|1905
Chaiten|1122
Michinmahuida|2404
Mount Rushmore|1745
Devils Tower|1559
Mount Mansfield|1339
Mount Chocorua|915
Mount Lafayette|1600
Mount Moosilauke|1464
Cadillac Mountain|466
Whiteface Mountain|1483
Slide Mountain|1281
Bear Mountain (New York)|391
Stone Mountain|514
Kennesaw Mountain|555
Lookout Mountain|646
Brasstown Bald|1458
Sassafras Mountain|1085
Mount Rogers|1746
Spruce Knob|1482
Guadalupe Peak|2667
Enchanted Rock|525
Emory Peak|2385
Black Mesa (Oklahoma)|1516
Shiprock|1583
Humphreys Peak|3852
Mount Lemmon|2792
Mount Graham|3267
Mount Charleston|3633|Charleston Peak
Boundary Peak|4007
Mount Williamson|4382
Lassen Peak|3187
Mount Tamalpais|784
Mount Diablo|1173
Mount San Jacinto|3302|San Jacinto Peak
Mount Baldy (California)|3068|Mount San Antonio
San Gorgonio Mountain|3506
Telescope Peak|3366
Mount Dana|3982
Mount Lyell|3999
Clouds Rest|3025
Mount Tallac|2957
Mount Rose|3285
Mount Jefferson (Oregon)|3199
Three Sisters|3157|South Sister
Mount Bachelor|2764
Mount Thielsen|2799
Mount McLoughlin|2894
Mount Mazama|2487
Steens Mountain|2965
Mount Adams (Washington)|3743
Glacier Peak|3213
Mount Si|1290
Mount Pilchuck|1803
Mount Stuart|2869
Mount Shuksan|2783
Mount Foraker|5304
Mount Saint Elias|5489
Mount Blackburn|4996
Mount Sanford|4949
Mount Bona|5044
Mount Wrangell|4317
Mount Fairweather|4671
Mount Hunter|4442
Mount Hayes|4216
Mount Redoubt|3108|Redoubt Volcano
Mount Spurr|3374
Iliamna Volcano|3053
Augustine Volcano|1252
Mount Katmai|2047
Novarupta|841
Mount Edgecumbe|976
Flattop Mountain|1043
Kilauea|1247
Diamond Head|232
Koko Head|368
Hualalai|2521
Kohala|1670|Kohala Mountain
Mount Waialeale|1569
Kawaikini|1598
Olomana|488
Mount Kaala|1220
Mount Waddington|4019
Mount Lucania|5226
Whistler Mountain|2181
Blackcomb Peak|2440
Grouse Mountain|1231
Cypress Mountain|1450
Mount Seymour|1449
Golden Ears|1716
Mount Garibaldi|2678
Black Tusk|2319
Mount Royal|233
Mont Tremblant|875
Mont Sainte-Anne|800
Mont Jacques-Cartier|1268
Mont Orford|850
Mount Carleton|820
Gros Morne Mountain|806|Gros Morne
Mount Thor|1675
Mount Asgard|2015
Mount Odin|2143
Barbeau Peak|2616
Mount Caubvick|1652|Mount D'Iberville
Mount Sir Wilfrid Laurier|3581
Mount Sir Sandford|3519
Mount Sir Donald|3284
Mount Meager|2680
Mount Cayley|2385
Iztaccihuatl|5230
Nevado de Toluca|4680
La Malinche|4461
Cofre de Perote|4282
Paricutin|2800
Colima Volcano|3820|Volcan de Colima,Fuego de Colima,Nevado de Colima
Cerro de la Silla|1820
Ajusco|3930
El Chichon|1150
Tacana|4060
Picacho del Diablo|3095
Ceboruco|2280
Tequila Volcano|2920|Volcan de Tequila
Tajumulco|4220
Fuego|3763|Volcan de Fuego
Acatenango|3976
Agua Volcano|3760|Volcan de Agua
Pacaya|2552
Atitlan Volcano|3535|Volcan Atitlan
Toliman Volcano|3158|Volcan Toliman
San Pedro Volcano|3020
Santa Maria Volcano|3772|Santiaguito
Santa Ana Volcano|2381
Izalco|1950
San Salvador Volcano|1893
San Miguel Volcano|2130
El Pital|2730
Cerro Las Minas|2870
Pico Bonito|2435
Momotombo|1297
Masaya Volcano|635
Concepcion Volcano|1610
Maderas|1394
Cerro Negro|728
Mombacho|1345
Telica|1061
Mogoton|2107
Arenal Volcano|1670|Arenal
Poas Volcano|2708
Irazu Volcano|3432
Turrialba Volcano|3340
Rincon de la Vieja|1916
Cerro Chirripo|3820
Barva Volcano|2906
Miravalles|2028
Baru Volcano|3474|Volcan Baru
Cerro Fabrega|3335
Soufriere Hills|915
La Soufriere|1234
La Grande Soufriere|1467
Mount Pelee|1397
Gros Piton|770|Pitons,Petit Piton
Morne Diablotins|1447
Morne Trois Pitons|1387
Mount Liamuiga|1156
Nevis Peak|985
Mount Scenery|887
Pico Turquino|1974
El Yunque|1065
Cerro de Punta|1338
Mount Obama|402|Boggy Peak
Mount Hillaby|340
Mount Gimie|950
Pico da Neblina|2995
Pico da Bandeira|2892
Pedra da Gavea|842
Agulhas Negras|2791
Pico Parana|1877
Auyantepui|2535|Auyan-tepui
Pico Cristobal Colon|5700
Mount Bogong|1986
Mount Feathertop|1922
Mount Buller|1805
Mount Hotham|1861
Mount Baw Baw|1567
Mount Townsend|2209
Bartle Frere|1622
Bellenden Ker|1593
Bluff Knoll|1099
Mount Augustus|1106
Mount Zeil|1531
Mount Sonder|1380
Mount Gower|875
Mount Lidgbird|777
Mount Warning|1159|Wollumbin
Tamborine Mountain|555
Mount Wellington|1271|Kunanyi
Cradle Mountain|1545
Frenchmans Cap|1446
Federation Peak|1224
Mount Lofty|727
Mount Dandenong|633
Mount Macedon|1013
Hanging Rock|718
Mount Arapiles|369
Mount Kaputar|1510
Mount Canobolas|1395
Mount Keira|464
Mount Conner|859
Kata Tjuta|1066
Mount Tasman|3497
Mount Aspiring|3033
Mount Sefton|3151
Mount Earnslaw|2830
Mount Rolleston|2275
Mount Hutt|2086
Mount Cargill|676
Mauao|232
Mount Tarawera|1111
Hikurangi|1754|Mount Hikurangi
Roys Peak|1578
Mitre Peak|1683
The Remarkables|2319
Coronet Peak|1649
Treble Cone|2088
Pirongia|959
Mount Wilhelm|4509
Mount Giluwe|4368
Mount Lamington|1680
Tavurvur|688
Mount Bosavi|2507
Mont Panie|1628
Mount Yasur|361
Mount Orohena|2241
Mount Otemanu|727
Tomanivi|1324|Mount Tomanivi
Mount Popomanaseu|2335
Mount Tyree|4852
Mount Shinn|4661
Mount Kirkpatrick|4528
Mount Markham|4350
Mount Terror|3230
Mount Siple|3110
Mount Sidley|4181
Mount Jackson|3184
Mount Melbourne|2732
Mount Berlin|3478
Mount Takahe|3460
Mount Paget|2934
Big Ben|2745|Mawson Peak
Dom|4545
Grand Combin|4314
Dent Blanche|4357
Aletschhorn|4193
Finsteraarhorn|4274
Ortler|3905
Grossvenediger|3657
Wildspitze|3768
Dachstein|2995
Watzmann|2713
Santis|2502
Pilatus|2128
Rigi|1798
Titlis|3238
Schilthorn|2970
Monch|4107
Aiguille du Midi|3842
Grandes Jorasses|4208
Barre des Ecrins|4102
La Meije|3984
Monviso|3841|Monte Viso
Gran Paradiso|4061
Tre Cime di Lavaredo|2999
Sassolungo|3181|Langkofel
Piz Palu|3901
Todi|3614
Wetterhorn|3692
Schreckhorn|4078
Breithorn|4164
Lyskamm|4527
Hochkonig|2941
Kitzsteinhorn|3203
Untersberg|1973
Nordkette|2334
Patscherkofel|2246
Uetliberg|870
Dents du Midi|3257
Les Diablerets|3210
Wildstrubel|3244
Bluemlisalp|3670
Piz Badile|3308
Piz Corvatsch|3451
Piz Kesch|3418
Piz Linard|3410
Glarnisch|2914
Civetta|3220
Antelao|3264
Monte Pelmo|3168|Pelmo
Monte Cristallo|3221
Monte Baldo|2218|Cima Valdritta
Monte Grappa|1775
Mont Aiguille|2087
Aiguille Verte|4122
Dent du Geant|4013
Mont Pelvoux|3946
Lagginhorn|4010
Weissmies|4017
Allalinhorn|4027
Alphubel|4206
Taschhorn|4491
Nadelhorn|4327
Dent d'Herens|4171
Ober Gabelhorn|4063
Zinalrothorn|4221
Bishorn|4153
Bietschhorn|3934
Monte Leone|3552
Sustenhorn|3503
Galenstock|3583
Niesen|2362
Faulhorn|2681
Alpspitze|2628
Nebelhorn|2224
Kehlstein|1834
Wendelstein|1838
Hahnenkamm|1712
Hoher Kasten|1794
Monte Perdido|3355
Vignemale|3298
Pic du Midi de Bigorre|2877
Pic du Midi d'Ossau|2884
Posets|3375
Pica d'Estats|3143
Canigou|2784|Pic du Canigou
Puigmal|2910
Pedraforca|2506
Montserrat|1236
Veleta|3396
Almanzor|2592
Torre Cerredo|2650
Naranjo de Bulnes|2519|Picu Urriellu
Penalara|2428
Moncayo|2314
Roque Nublo|1813
Pico Ruivo|1862
Mount Pico|2351|Pico,Ponta do Pico
Monte Amiata|1738
Terminillo|2217|Monte Terminillo
Monte Vettore|2476
Monte Amaro|2793|Maiella
Pollino|2248|Monte Pollino
Monte Titano|749
Monte Cassino|516
Monte Circeo|541
Monte Conero|572
Epomeo|789|Monte Epomeo
Monte Cinto|2706
Punta La Marmora|1834|Gennargentu
Monte Cimone|2165
Mangart|2679
Grintovec|2558
Dinara|1831
Sveti Jure|1762
Sljeme|1035
Ucka|1401
Maglic|2386
Bjelasnica|2067
Jahorina|1916
Trebevic|1627
Bobotov Kuk|2523
Lovcen|1749
Maja Jezerce|2694
Korab|2764|Golem Korab
Titov Vrv|2748
Ljuboten|2499
Pelister|2601
Galicica|2255
Vihren|2914
Botev Peak|2376
Cherni Vrah|2290
Buzludzha|1441
Moldoveanu|2544
Negoiu|2535
Omu|2505
Peleaga|2509
Pietrosul Rodnei|2303
Ceahlau|1907
Hoverla|2061
Pip Ivan|2022
Gerlachovsky stit|2655
Krivan|2494
Babia Gora|1725
Giewont|1894
Kasprowy Wierch|1987
Sleza|718
Lysica|612
Praded|1492
Lysa hora|1323
Milesovka|837
Rip|456
Jested|1012
Brocken|1141
Feldberg|1493
Fichtelberg|1215
Grosser Arber|1456
Wasserkuppe|950
Drachenfels|321
Belchen|1414
Hornisgrinde|1164
Parnassus|2457
Pelion|1624
Taygetus|2407
Smolikas|2637
Grammos|2520
Tymfi|2497
Helicon|1748
Parnitha|1413
Hymettus|1026
Lycabettus|277
Ainos|1628|Mount Ainos
Dirfi|1745
Pangaion|1956
Falakro|2232
Vermio|2052
Voras|2524
Giona|2510
Chelmos|2355
Erymanthos|2224
Mainalo|1981|Menalo
Lefka Ori|2453
Dikti|2148
Kerkis|1433
Attavyros|1215
Zas|1003|Mount Zeus
Ochi|1398
Pentelicus|1109
Troodos|1952
Erciyes|3916|Mount Erciyes
Mount Nemrut|2134|Nemrut Dagi
Uludag|2543
Hasan Dagi|3253
Suphan|4058
Kackar|3937
Babadag|1969
Demirkazik|3756
Mount Judi|2089|Cudi Dagi
Palandoken|3176
Ilgaz|2587
Kazbek|5054
Ushba|4710
Shkhara|5193
Dykh-Tau|5205
Koshtan-Tau|5152
Tetnuldi|4858
Aragats|4090
Bazarduzu|4466
Shahdag|4243|Shah Dagh
Sabalan|4811
Sahand|3707
Alvand|3574
Tochal|3964
Qurnat as Sawda|3088
Sannine|2628
Mount Carmel|546
Mount Tabor|575
Mount Meron|1208
Mount Gilboa|498
Mount Zion|765
Mount of Olives|826
Mount Scopus|826
Mount Gerizim|881
Masada|450
Mount Catherine|2629|Jabal Katherina
Jebel Hafeet|1240
Jebel Jais|1934
Jabal Shams|3009
Jabal al-Nour|642
Jabal Thawr|759
Jabal Sawda|3015
Jabal al-Lawz|2549
Mount Sodom|250
Jabal Qasioun|1152
Jabal Umm ad Dami|1854
Jabal Rum|1734
Jabal an-Nabi Shuayb|3666
Fisht|2867
Beshtau|1401
Ben Lawers|1214
Ben More (Crianlarich)|1174
Ben Alder|1148
Ben Hope|927
Ben Loyal|764
Suilven|731
Stac Pollaidh|612
An Teallach|1062
Liathach|1055
Beinn Eighe|1010
Slioch|981
Sgurr Alasdair|992
Sgurr nan Gillean|964
Bla Bheinn|928
The Cobbler|884|Ben Arthur
Ben Vorlich (Loch Earn)|985
Ben Ledi|879
Ben Cruachan|1126
Buachaille Etive Mor|1022
Bidean nam Bian|1150
Aonach Eagach|967
Aonach Mor|1221
Carn Mor Dearg|1220
Lochnagar|1155
Mount Keen|939
Cairn Toul|1291
Ben Avon|1171
Beinn a' Bhuird|1197
Merrick|843
Broad Law|840
Tinto|711
Ben Wyvis|1046
Morven|871
Scafell|964
Bowfell|902|Bow Fell
Coniston Old Man|803
Blencathra|868
High Street|828
Catbells|451
Loughrigg Fell|335
Haystacks|597
Great End|910
Pillar|892
Fairfield|873
Place Fell|657
Grisedale Pike|791
Great Dun Fell|848
Bleaklow|633
Shutlingsloe|506
Win Hill|462
Lose Hill|476
Sugar Loaf|596|Y Fal
Skirrid|486|Ysgyryd Fawr
Blorenge|561
Tryfan|918
Glyder Fawr|1001
Glyder Fach|994
Carnedd Llewelyn|1064|Carnedd Llywelyn
Carnedd Dafydd|1044
Crib Goch|923
Y Garn|947
Moel Siabod|872
Aran Fawddwy|905
Pumlumon|752|Plynlimon
Corn Du|873
Waun Fach|811
Moel Famau|555
Snaefell (Isle of Man)|621
Slieve Donard|850
Slieve League|595
Croagh Patrick|764
Errigal|751
Lugnaquilla|925
Mount Brandon|952
Galtymore|919
Mweelrea|814
Benbulbin|526
Knocknarea|327
Cuilcagh|665
Sawel|678|Sawel Mountain
Slieve Gullion|573
Mount Leinster|796
Mangerton|839|Mangerton Mountain
Hvannadalshnukur|2110
Hekla|1491
Eyjafjallajokull|1651
Katla|1512
Snaefellsjokull|1446
Herdubreid|1682
Askja|1516
Esja|914
Bardarbunga|2009
Grimsvotn|1725
Laki|818
Fagradalsfjall|385
Eldfell|221
Krafla|818
Slaettaratindur|882
Glittertind|2452
Store Skagastolstind|2405
Snohetta|2286
Romsdalshorn|1550
Stetind|1392
Slogen|1564
Gaustatoppen|1883
Ulriken|643
Floyen|399
Sarektjakka|2089
Helags|1797
Areskutan|1420
Storsylen|1762
Kinnekulle|306
Omberg|263
Halti|1324
Saana|1029
Narodnaya|1895|Mount Narodnaya
Yamantau|1640
Mount Meru|4562
Mount Stanley|5109|Margherita Peak
Mawenzi|5149
Ras Dashen|4550|Ras Dejen
Mount Elgon|4321
Karisimbi|4507
Nyiragongo|3470
Nyamuragira|3058
Mount Mulanje|3002|Mulanje
Tahat|3003
Emi Koussi|3447
Jebel Marra|3042
Mount Moco|2620
Brandberg Mountain|2573|Brandberg
Spitzkoppe|1728
Mafadi|3450
Cathedral Peak (South Africa)|3004
Champagne Castle|3377
Mount Namuli|2419
Bintumani|1945|Loma Mansa
Mount Nimba|1752
Mount Afadjato|885|Afadja
Pico Basile|3012
Pico do Fogo|2829
Piton des Neiges|3070
Piton de la Fournaise|2632
Maromokotro|2876
Ol Doinyo Lengai|2962
Mount Longonot|2776
Mount Kulal|2285
Mount Marsabit|1707
Mount Kadam|3068
Mount Moroto|3083
Mount Hanang|3420
Mount Suswa|2356
Sabyinyo|3669
Mount Bisoke|3711|Visoke
Muhabura|4127
Mount Gahinga|3474|Gahinga
Erta Ale|613
Zuqualla|2989
Entoto|3200
Jebel Akhdar|882|Jabal Akhdar
Jbel Ayachi|3757
Jbel Siroua|3304
Jbel Bou Naceur|3340
Lalla Khedidja|2308
Djebel Chelia|2328|Chelia
Mount Speke|4890
Ouanoukrim|4089
Jebel ech Chambi|1544|Djebel Chambi
Bikku Bitti|2267
Mont Idoukal-n-Taghes|2002|Idoukal-n-Taghes
Hombori Tondo|1155
Chappal Waddi|2419
Mount Nyangani|2592|Inyangani
Monte Binga|2440|Mount Binga
Tsodilo Hills|1489
Mount Karthala|2361|Karthala
Le Morne Brabant|556
Morne Seychellois|905
Kinyeti|3187
Amba Soira|3018|Emba Soira
Moussa Ali|2021|Mousa Ali
Mount Shimbiris|2460
Pico Cao Grande|663
Nuptse|7861
Pumori|7161
Gyachung Kang|7952
Changtse|7550
Island Peak|6189|Imja Tse
Mera Peak|6476
Lobuche|6119|Lobuche East
Baruntse|7129
Himalchuli|7893
Ngadi Chuli|7871|Peak 29
Annapurna II|7937
Annapurna III|7555
Annapurna IV|7525
Annapurna South|7219|Annapurna Dakshin
Gangapurna|7455
Tilicho Peak|7134
Nilgiri Himal|7061|Nilgiri North
Putha Hiunchuli|7246|Dhaulagiri VII
Api|7132
Saipal|7031
Ganesh Himal|7422
Langtang Lirung|7227
Gaurishankar|7134
Melungtse|7181
Thamserku|6608
Kangtega|6782
Taboche|6495
Cholatse|6440
Kala Patthar|5644
Gokyo Ri|5357
Poon Hill|3210
Nanda Devi|7816
Kamet|7756
Trisul|7120
Kedarnath Peak|6940|Kedarnath
Shivling|6543
Chaukhamba|7138
Panchchuli|6904
Bandarpunch|6316|Kalanag
Swargarohini|6252
Thalay Sagar|6904
Bhagirathi Parbat|6454
Om Parvat|6191|Little Kailash
Jannu|7710|Kumbhakarna
Siniolchu|6888
Kabru|7412|Talung
Pandim|6691
Jomolhari|7326|Chomolhari
Gangkhar Puensum|7570
Kula Kangri|7538
Jitchu Drake|6989|Jichu Drake
Namcha Barwa|7782
Gurla Mandhata|7694
Mount Kailash|6638|Kailash
Nun Kun|7135|Nun
Stok Kangri|6153
Kang Yatse|6400
Harmukh|5142
Gyala Peri|7294
Yalung Kang|8505|Kangchenjunga West
Kirat Chuli|7365|Tent Peak
Chomo Lonzo|7804
Dorje Lakpa|6966
Langtang Ri|7205
Pisang Peak|6091
Tharpu Chuli|5663
Hiunchuli|6441
Singu Chuli|6501|Fluted Peak
Kangto|7060
Nanda Kot|6861
Hardeol|7151
Changabang|6864
Dunagiri|7066
Mana Peak|7272
Mukut Parbat|7242
Satopanth|7075
Abi Gamin|7355
Nyenchen Tanglha|7162|Nyainqentanglha
Masherbrum|7821|K1
Rakaposhi|7788
Distaghil Sar|7885
Trango Towers|6286|Great Trango Tower
Ultar Sar|7388|Ultar
Batura Sar|7795
Kanjut Sar|7760
Kunyang Chhish|7823
Saltoro Kangri|7742
Diran|7266|Diran Peak
Spantik|7027|Golden Peak
Chogolisa|7665
Laila Peak|6096
Gasherbrum IV|7925
Gasherbrum III|7952
Skil Brum|7360
Tirich Mir|7708
Noshaq|7492
Istor-o-Nal|7403
Takht-e-Sulaiman|3487|Takht-i-Sulaiman
Ismoil Somoni Peak|7495|Communism Peak
Lenin Peak|7134|Kullai Kammar
Peak Korzhenevskaya|7105
Khan Tengri|7010
Jengish Chokusu|7439|Tomur Peak,Tuomuer Feng
Muztagh Ata|7546
Kongur Tagh|7649|Kongur
Belukha|4506|Mount Belukha
Munku-Sardyk|3491
Mount Bogda|5445|Bogda Peak
Amne Machin|6282|Anyemaqen
Saser Kangri|7672
Baintha Brakk|7285|The Ogre
Malubiting|7458
Momhil Sar|7343
Yukshin Gardan Sar|7530
Sia Kangri|7422
Baltoro Kangri|7312|Golden Throne
Revolution Peak|6974|Pik Revolyutsii
Mount Hua|2154|Huashan
Mount Emei|3099|Emeishan
Mount Wutai|3061|Wutaishan
Mount Song|1512|Songshan
Mount Heng|1300|Nanyue,Hengshan
Mount Lu|1474|Lushan
Mount Wuyi|2158|Wuyishan
Mount Sanqing|1817|Sanqingshan
Mount Gongga|7556|Minya Konka
Mount Siguniang|6250
Jade Dragon Snow Mountain|5596|Yulong Xueshan
Kawagarbo|6740|Meili Snow Mountain,Kawa Karpo
Mount Longhu|247|Longhushan
Mount Qingcheng|1260|Qingchengshan
Mount Putuo|291|Putuoshan
Mount Jiuhua|1341|Jiuhuashan
Mount Tianzi|1262|Tianzishan
Mount Wudang|1612|Wudangshan
Laoshan|1133|Mount Lao
Mount Tianmu|1506|Tianmushan
Mount Yandang|1150|Yandangshan
Mount Danxia|618|Danxiashan
Mount Mogan|719|Moganshan
Mount Taibai|3771|Taibai Shan
Mount Xiangshan|557|Fragrant Hills
Mount Baiyun|382|Baiyunshan
Mount Yuntai|1308|Yuntaishan
Tavan Bogd|4374|Altai Tavan Bogd
Otgontenger|4008
Sutai Mountain|4090
Seoraksan|1708|Mount Seorak
Jirisan|1915|Mount Jiri
Bukhansan|836
Namsan|262|Namsan Seoul
Taebaeksan|1567
Songnisan|1058
Naejangsan|763
Odaesan|1563
Gyeryongsan|845
Mudeungsan|1187
Palgongsan|1193
Deogyusan|1614
Juwangsan|721
Dobongsan|740
Inwangsan|338
Kumgangsan|1638|Mount Kumgang
Myohyangsan|1909
Gwanaksan|632
Wolchulsan|809
Chiaksan|1288
Mount Tate|3015|Tateyama
Mount Haku|2702|Hakusan
Mount Hotaka|3190|Hotakadake
Mount Yari|3180|Yarigatake
Mount Kita|3193|Kitadake
Mount Ontake|3067|Ontakesan
Mount Asama|2568
Mount Bandai|1816
Mount Iwate|2038
Mount Zao|1841|Zaozan
Mount Daisen|1729
Mount Unzen|1483
Sakurajima|1117
Mount Kirishima|1700|Kirishima
Mount Yotei|1898
Mount Asahi|2291|Asahidake
Mount Rishiri|1721|Rishiri-Fuji
Mount Takao|599
Mount Koya|800|Koyasan
Mount Hiei|848|Hieizan
Mount Rokko|931
Mount Tsukuba|877
Mount Nantai|2486
Mount Norikura|3026
Mount Kaimon|924|Satsuma Fuji
Mount Haruna|1449
Mount Akagi|1828
Mount Myoko|2454
Mount Chokai|2236|Dewa Fuji
Mount Gassan|1984
Mount Hakodate|334
Mount Usu|733
Mount Meakan|1499
Mount Tokachi|2077
Mount Iwaki|1625|Tsugaru Fuji
Mount Hachimantai|1614
Mount Adatara|1700
Mount Nasu|1917
Mount Kiso Komagatake|2956
Mount Tanigawa|1977
Mount Ibuki|1377|Ibukiyama
Mount Kongo|1125|Kongosan
Mount Inari|233|Inariyama
Mount Misen|535
Mount Kumotori|2017
Mount Amagi|1406
Mount Hiko|1200|Hikosan
Mount Ishizuchi|1982
Mount Tsurugi|1955|Tsurugisan
Mount Yake|2455|Yakedake
Mount Takachiho|1574|Takachiho-no-mine
Yushan|3952|Jade Mountain,Mount Morrison
Xueshan|3886|Snow Mountain
Alishan|2216
Hehuanshan|3417|Mount Hehuan
Nanhu Mountain|3742|Nanhu Dashan
Qilai Mountain|3607|Qilaishan
Datun Mountain|1092|Datunshan
Mount Pulag|2926
Taal Volcano|311
Kanlaon|2435|Mount Kanlaon,Kanlaon Volcano
Hibok-Hibok|1332
Bulusan Volcano|1565|Mount Bulusan
Mount Halcon|2586
Mount Banahaw|2158
Mount Makiling|1090
Mount Isarog|1966
Mount Arayat|1026
Mount Samat|555
Mount Kitanglad|2899
Mount Dulang-dulang|2938
Mount Matutum|2286
Mount Iriga|1196
Mount Malindang|2404
Mount Guiting-Guiting|2058
Chocolate Hills|120
Mount Talinis|1904|Cuernos de Negros
Mount Kalatungan|2860
Mount Kerinci|3805|Kerinci
Mount Tambora|2722|Tambora
Sinabung|2460|Mount Sinabung
Mount Slamet|3428|Slamet
Mount Lawu|3265|Lawu
Mount Batur|1717|Batur
Ijen|2769|Kawah Ijen,Mount Ijen
Mount Gede|2958|Gede
Mount Salak|2211|Salak
Mount Papandayan|2665|Papandayan
Mount Galunggung|2168|Galunggung
Kelud|1731|Mount Kelud
Mount Arjuno|3339|Arjuno,Welirang,Arjuno-Welirang
Raung|3344|Mount Raung
Mount Leuser|3119|Leuser
Mount Sibayak|2212|Sibayak
Tangkuban Perahu|2084
Sindoro|3153|Mount Sindoro
Sumbing|3371|Mount Sumbing
Merbabu|3145|Mount Merbabu
Mount Lokon|1580|Lokon-Empung
Soputan|1784|Mount Soputan
Kelimutu|1639
Trikora|4750|Puncak Trikora
Puncak Mandala|4760|Mandala
Mount Egon|1703|Egon
Lewotobi|1703|Mount Lewotobi
Rokatenda|875|Paluweh
Mount Awu|1320|Awu
Karangetang|1784|Mount Karangetang
Dukono|1229|Mount Dukono
Gamalama|1715|Mount Gamalama
Marapi|2891|Mount Marapi
Dempo|3173|Mount Dempo
Talang|2597|Mount Talang
Singgalang|2877|Mount Singgalang
Mount Pangrango|3019|Pangrango
Ciremai|3078|Mount Ciremai
Anak Krakatoa|157|Anak Krakatau
Sirung|862|Mount Sirung
Iya|637|Mount Iya
Tandikat|2438|Mount Tandikat
Kaba|1952|Mount Kaba
Mount Tahan|2187
Santubong|810|Mount Santubong
Trus Madi|2642
Mount Murud|2423
Doi Inthanon|2565
Doi Suthep|1676
Doi Chiang Dao|2175
Phu Kradueng|1316
Khao Luang|1835
Fansipan|3147|Phan Xi Pang
Ba Den|986|Nui Ba Den,Black Lady Mountain
Marble Mountains|156
Ba Vi|1296
Bach Ma|1450
Hkakabo Razi|5881
Mount Popa|1518
Mount Victoria|3053|Nat Ma Taung
Phnom Aural|1810
Phou Bia|2820
Pidurutalagala|2524
Sigiriya|349
Knuckles|1863|Knuckles Range
Namunukula|2036
Anamudi|2695
Doddabetta|2637
Mullayanagiri|1930
Girnar|1031
Kalsubai|1646
Dhupgarh|1352
Mahendragiri|1501
Mount Abu|1722|Guru Shikhar
Agasthyamalai|1868|Agastya Mala
Chembra Peak|2100
Kudremukh|1894
Banasura Peak|2073
Gunung Jerai|1217|Kedah Peak
Mount Ophir|1276|Gunung Ledang
Klyuchevskaya Sopka|4750
Koryaksky|3456
Avachinsky|2741
Tolbachik|3611
Shiveluch|3283|Sheveluch
Kronotsky|3528
Karymsky|1536
Mutnovsky|2322
Gorely|1829
Vilyuchik|2173|Vilyuchinsky
Ichinsky|3607
Bezymianny|2882
Zhupanovsky|2958
Mammoth Mountain|3371
Currahee Mountain|529
Mount Le Conte|2010
Campbell Hill|472
Grandfather Mountain|1812
Sutter Buttes|647
Eagle Mountain|701
Cheyenne Mountain|2915
White Mountain Peak|4344
Cheaha Mountain|735
Newberry Volcano|2435
Timms Hill|595
Grand Mesa|3425
Black Mountain (Kentucky)|1263
Pilot Mountain|738
Taum Sauk Mountain|540
High Point|550
Triple Divide Peak|2446
Mount Bierstadt|4287
Mount Saint Helena|1323
Heart Mountain|2476
Mount Shishaldin|2857
Bear Butte|1349
Blood Mountain|1357
Broken Top|2797
Agathla Peak|2164
Crested Butte|3709
Mount Nittany|633
Mount Okmok|1073
Springer Mountain|1149
Mount Taylor|3446
Sideling Hill|704
Piestewa Peak|796
Mount Hamilton|1300
Old Rag Mountain|1001
Palomar Mountain|1872
Camel's Hump|1244
Cold Mountain|1838
Yucca Mountain|2044
Mount Frissell|748
Mount Susitna|1340
Roan Mountain|1913
Catoctin Mountain|573
Great Blue Hill|194
Hoye-Crest|1020
Medicine Lake Volcano|2414
Mount Umunhum|1063
Sleeping Giant|225
Loma Prieta|1154
Steptoe Butte|1100
Yonah Mountain|965
Amboy Crater|288
Dotsero|2230
Massanutten Mountain|891-1000
Mount Langley|4277
South Mountain|655
Cannon Mountain|1244
Mount Tammany|465
Mount Wachusett|611
North Palisade|4343
Mount Lee|521
Mount Kearsarge|895
Mount Scott|751
Negro Mountain|979
Three Fingered Jack|2391
Mount Moran|3844
Mount Sopris|3952
Peaks of Otter|1181
Spanish Peaks|4155
Ute Mountain|3043
White Butte|1069
Mount Craig|2026
Medicine Bow Peak|3663
Mount Pinos|2697
Sentinel Peak|884
Tikaboo Peak|2412
Jackson Volcano|884
Mount Lamlam|406
Mount Marcus Baker|4016
Mount Oglethorpe|1002
Rib Mountain|586
Sierra Grande|2659
Black Balsam Knob|1894
Cavanal Hill|727
Mount Guyot|2018
Mount Sherman|4280
Algonquin Peak|1559
Arabia Mountain|291
Desolation Peak|1860
Marys Peak|1250
Mount Pemigewasset|771
Mount Pisgah|1744
Mount Tom|366
Santiago Peak|1734
Shenandoah Mountain|1340
Goat Rocks|2500
Mount Constitution|734
Mount Konocti|1312
Navajo Mountain|3154
Black Butte|1962
Clinch Mountain|1429
Hawksbill Mountain|1234
Lone Mountain|3404
Mount Ascutney|958
Backbone Mountain|1116
Beacon Mountain|462
Breakneck Ridge|384
Equinox Mountain|1163
Missouri Buttes|1638
Mount Elden|2835
Mount Kineo|545
Mount Washburn|3115
Notch Peak|2944
Superstition Mountain|1542
Four Peaks|2334
Mount Antero|4349
Mount Juneau|1090
Mount Major|544
Red Mountain|312
Stratton Mountain|1201
Casper Mountain|2478
Culebra Peak|4283
Little Tahoma Peak|3395
Mount Eddy|2754
Mount Lincoln|4356
Overlook Mountain|956
The Moose's Tooth|3150
Brown Mountain|696
Diamond Peak|2666
Looking Glass Rock|1210
Mount Garfield|2062
Mount Isto|2736
Mount Oread|316
Mount Peale|3879
Sacajawea Peak|3000
Tumbledown Mountain|931
Archuleta Mesa|2813
Aspen Mountain|3263
Bald Eagle Mountain|644
Freel Peak|3318
Jay Peak|1177
Killington Peak|1289
Mount Curwood|603
Mount Democrat|4314
Mount Erie|388
Mount Ritter|4008
Rattlesnake Mountain|1076
Tempe Butte|456
The Brothers|2085
Big Southern Butte|2301
Canby Mountain|4108
Crazy Peak|3417
Fajada Butte|2019
Glass Mountain|3392
Hawk Mountain|464
Ice Mountain|460
Monte Sano Mountain|504
Mount Defiance|256
Mount Holyoke|285
Mount Spokane|1794
Mount Wrightson|2882
Table Rock|1201
Weavers Needle|1388
Cheat Mountain|1478
Chimney Tops|1440
Kitt Peak|2099
Mount Bigelow|1259
Mount Constance|2364
Panther Mountain|1134
Rocky Butte|187
Sandstone Peak|949
Sugar Mountain|1596
Thunderhead Mountain|1685
Blue Knob|959
Boulder Mountain|3449
Brighams Tomb|2054
Cerro Las Tetas|842
Chiricahua Peak|2979
Crown Mountain|474
Fremont Peak|967
Giant Mountain|1410
Glastenbury Mountain|1142
Going-to-the-Sun Mountain|2940
Gothics|1444
Huron Peak|4268
Lata Mountain|966
Middle Teton|3904
Mingus Mountain|2383
Mount Ashland|2296
Mount Cardigan|962
Mount Drum|3661
Mount McGregor|326
Mount Watatic|558
North Franklin Mountain|2192
Thompson Peak|3277
Waterrock Knob|1918
Whiteside Mountain|1503
Bare Mountain|309
Belknap Crater|2096
Crestone Needle|4327
Devils Peak|740
Forbidden Peak|2687
Hot Springs Mountain|1991
Laurel Hill|913
Max Patch|1410
Mount Abraham|1221
Mount Churchill|4744
Mount Pierce|1314
Mount Vancouver|4812
Old Speck Mountain|1271
Sierra Buttes|2619
Snowmass Mountain|4298
Twin Sisters Mountain|2134
Ugly Mountain|802
Anthony's Nose|274
Mount Livermore|2554
Bonanza Peak|2900
Burke Mountain|997
Deseret Peak|3363
Devil's Courthouse|1743
Disappointment Peak|3543
Flat Top Mountain|3768
Fort Mountain|869
Hallett Peak|3877
Handies Peak|4284
Howard Knob|1340
Humpback Rock|939
Junipero Serra Peak|1785
Mailbox Peak|1476
Mount Baden-Powell|2867
Mount Bailey|2553
Mount Conness|3837
Mount Desor|425
Mount Eisenhower|1450
Mount Haystack|1512
Mount Madison|1636
Mount Meeker|4242
Mount Sill|4316
Mount Tecumseh|1218
Mount Willard|873
Packsaddle Mountain|496
Rabun Bald|1431
S P Crater|2140
Santa Fe Baldy|3850
Whitetop Mountain|1684
Bald Knob|1476
Beech Mountain|1678
Cobb Mountain|1440
Crowders Mountain|495
East Mountain|1048
Green Mountain|2089
High Knob|1287
Huerfano Butte|1882
Laramie Peak|3132
Liberty Bell Mountain|2353
Lizard Head|3999
Mitchell Mesa|2007
Mount Pavlof|2515
Mount Sniktau|4036
North Fork Mountain|1398
Ruby Dome|3471
Sawnee Mountain|593
Sheep Mountain|3427
Silver Star Mountain|1330
Split Mountain|4287
West Spanish Peak|4155
Bill Williams Mountain|2822
Blue Ridge Mountain|728
Carter Dome|1471
Chilhowee Mountain|867
Clark Mountain|2418
Cone Peak|1571
Fishers Peak|2936
Francs Peak|4011
Hesperus Mountain|4035
James Peak|4045
Loon Mountain|934
Mount Clay|1686
Mount Colden|1437
Mount Hubbard|4557
Mount Monroe|1637
Mount Moriah|3680
Mount Muir|4273
Mount Osceola|1323
Mount Quincy Adams|4150
Mount Shavano|4337
Mount Siyeh|3054
Mount Veniaminof|2507
Mount Vsevidof|2149
North Table Mountain|1998
Pioneer Peak|1950
Prospect Mountain|615
Quirauk Mountain|654
Reddish Knob|1340
Saddleback Mountain|1256
San Benito Mountain|1605
Squaretop Mountain|3565
Talcott Mountain|290
Tantalus|614
Teewinot Mountain|3758
Trapper Peak|3096
Tri-State Peak|607
Twin Sisters Peaks|3485
Whitehorse Mountain|2085
Whitewater Baldy|3322
Ampersand Mountain|1022
Apple Orchard Mountain|1287
Bald Mountain|3642
Big Frog Mountain|1287
Big Slide Mountain|1292
Brian Head|3448
Checkerboard Mesa|1987
Cuyamaca Peak|1985
Dix Mountain|1480
Flagstaff Mountain|2128
Goode Mountain|2806
Greenhorn Mountain|3765
Hahns Peak|3304
Half Peak|4221
Hermit Peak|3129
Horsetooth Mountain|2213
Hozomeen Mountain|2460
Hyndman Peak|3661
Jacks Mountain|707
Kamakou|1512
Kendrick Peak|3178
Lembert Dome|2882
Lost Mine Peak|2300
Mary's Rock|1071
McDonald Peak|2994
Menan Buttes|1713
Middle Palisade|4273
Miller Peak|2886
Mount Akutan|1303
Mount Bross|4321
Mount Daniel|2426
Mount Deception|2374
Mount Eolus|4293
Mount Huntington|3731
Mount Index|1826
Mount Jo|863
Mount Patterson|3552
Mount Russell|4296
Mount Sheridan|3143
Mount Tremper|835
Mount Tyndall|4275
Mount Van Hoevenberg|896
Nippletop|1408
Rainmaker Mountain|523
Old Black|1942
Pack Monadnock|698
Panola Mountain|290
Paulina Peak|2434
Puʻu Kukui|1764
Red Slate Mountain|4013
Richland Balsam|1952
Saddle Mountain|1002
Sahale Mountain|2646
Schunemunk Mountain|507
Snowy Mountain|1188
Strawberry Mountain|2756
Three Fingers|2090
Treasure Mountain|4125
Tumtum Mountain|611
Wildcat Mountain|1348
Agassiz Peak|3767
American Fork Twin Peaks|3493
Arc Dome|3591
Brush Mountain|779
Bull Hill|433
Charlies Bunion|1685
Chicoma Mountain|3524
Chimney Rock|3591
Cloudripper|4122
Dans Mountain|882
Dragontail Peak|2694
Eagle Cap|2919
Electric Peak|3343
Elk Mountain|3402
Engineer Mountain|3953
Fourpeaked Mountain|2104
Gregory Bald|1508
Hogback Mountain|735
Kings Pinnacle|520
Mount Tripyramid|1268
Missouri Mountain|4288
Mount Abbot|4179
Mount Adagdak|610
Mount Aeolus|985
Mount Carrigain|1427
Mount Darwin|4218
Mount Ellen|3513
Mount Igikpak|2523
Mount Linn|2468
Mount Moffett|1196
Mount Phillips|3579
Mount Skylight|1501
Mount Sunapee|831
Mount Zirkel|3714
Pigeon Mountain|710
Pingora Peak|3624
Pinnacle Mountain|1041
Popolopen|287
Pueblo Peak|3750
Sacagawea Peak|2943
San Luis Peak|4273
Snake Mountain|392
Storm King Mountain|2681
Sukakpak Mountain|1359
Sweat Mountain|515
The East Temple|2350
The Incredible Hulk|3444
West Rock Ridge|213
Wills Mountain|850
Windom Peak|4294
Battle Mountain|354
Bays Mountain|398
Belknap Mountain|726
Black Buttes|2877
Boott Spur|1674
Broads Fork Twin Peaks|3453
Buffalo Mountain|3896
Cerro Maravilla|1205
Challenger Point|4293
Couchsachraga Peak|1164
Delano Peak|3711
Dicks Peak|3040
Dog Mountain|899
Emigrant Peak|3330
Frazier Mountain|2444
Great North Mountain|1006
Grizzly Peak|4094
Heavens Peak|2740
Humboldt Peak|4287
Hurricane Hill|1755
Ibapah Peak|3684
Jacks Knob|1162
Jobs Peak|3242
Kit Carson Peak|4318
Korovin Volcano|1533
Liberty Cap|2158
Little Bear Peak|4279
Moore's Knob|786
Mount Chamberlin|2713
Mount Deborah|3761
Mount Despair|2224
Mount Flume|1319
Mount Gould|2913
Mount Hoffmann|3309
Mount Isolation|1220
Mount Norwottuck|337
Mount Ogden|2920
Mount Ouray|4255
Mount Owen|3942
Mount Porte Crayon|1454
Mount Shaw|911
Mount Tukuhnikivatz|3805
Mount Willey|1297
Pine Log Mountain|713
Poke-O-Moonshine Mountain|664
Redondo Peak|3431
Rich Mountain|817
Round Top|3164
Sentinel Mesa|1966
Seward Mountain|1329
Specimen Ridge|2554
Sunshine Peak|4269
The Watchman|1995
The West Temple|2380
Trident Volcano|1864
West Crater|1259
Aden Crater|1365
Altar of Sacrifice|2288
Amethyst Mountain|2929
Bashful Peak|2440
Bearhat Mountain|2648
Beautiful Mountain|2863
Black Tooth Mountain|3965
Bread Loaf Mountain|1165
Brindley Mountain|403
Burney Mountain|2397
Clements Mountain|2672
Cochetopa Dome|3395
Dorset Mountain|1148
Douglas Mountain|421
Dowdell's Knob|425
Dunderberg Mountain|331
Eagle Mesa|2019
East Spanish Peak|3867
El Diente Peak|4317
Eldorado Peak|2704
Elliott Knob|1360
Esther Mountain|1292
Fossil Mountain|3329
Fresno Dome|2299
Gobblers Knob|3123
Gothic Mountain|3850
Hole in the Mountain Peak|3448
Hualapai Peak|2566
Indian Head Mountain|1089
Jack Mountain|2766
Kasatochi Island|314
Kearsarge North|996
Kinsman Mountain|1328
Krell Hill|1115
Leavitt Peak|3527
Lone Cone|3846
Mars Hill|533
Montgomery Peak|4099
Mount Aix|2367
Mount Alverstone|4420
Mount Audubon|4032
Mount Augusta|4289
Baring Mountain|1868
Mount Belford|4328
Mount Cabot|1270
Mount Cammerer|1502
Mount Corcoran|4176
Mount Grant|3440
Mount Keith|4262
Mount Kephart|1895
Mount Liberty|1359
Mount Lindsey|4283
Mount Passaconaway|1232
Mount Powell|4141
Mount Pugh|2195
Mount Randy Morgenson|4245
Mount Richthofen|3946
Mount Roberts|1164
Mount Silverheels|4215
Mount Triumph|2207
Mummy Mountain|3515
Nobscot Hill|183
Peak Mountain|223
Pelican Butte|2450
Peters Mountain|1241
Phelps Mountain|1268
Pine Hill|93
Poor Mountain|1197
Provo Peak|3374
Ragged Mountain|697
Rendezvous Mountain|3187
Reynolds Mountain|2783
Roaring Mountain|2485
Rock Creek Butte|2776
Shining Rock|1841
Slate Peak|2268
Sonora Peak|3494
Sphinx Mountain|3304
Standing Indian Mountain|1676
Sunnyslope Mountain|457
Tabeguache Peak|4315
The Priest|1238
Toro Peak|2657
Twin Peaks|4066
Two Buttes|1433
Utsayantha Mountain|978
Wright Peak|1396
Yamsay Mountain|2499
Abercrombie Mountain|2228
Ajax Peak|3897
Alander Mountain|683
American Border Peak|2438
Back Allegheny Mountain|1476
Bear's Paw|1586
Big Bald|1682
Big Bear Mountain|1719
Big Moose Mountain|974
Big Savage Mountain|909
Big Schloss|903
Bitch Mountain|800
Blue Job Mountain|414
Brace Mountain|704
Capitol Butte|1937
Carson Peak|3325
Cimarron Ridge|3710
Crotched Mountain|629
Dick's Knob|1408
Donner Peak|2444
Double Mountain|2436
Elk Ridge|450
Mount Gareloi|1573
Gilbert Peak|2494
Grandmother Mountain|1403
Grandview Peak|2868
Grassy Ridge Bald|1885
Gunn Peak|1903
Gunstock Mountain|683
Guye Peak|1575
Hadley Mountain|808
Hamlin Peak|1450
Hart Mountain|2446
Hayford Peak|3025
Hibriten Mountain|674
Hilgard Peak|3451
Iron Mountain|3740
Jornada del Muerto Volcano|1566
Kichatna Spire|2739
Kinnerly Peak|3032
Kintla Peak|3080
Konahuanui|960
Ladron Peak|2800
Lander Peak|3189
Lituya Mountain|3634
Luna Peak|2533
Maggies Peaks|2653
Matafao Peak|653
Maynard Mountain|1261
McKenzie Mountain|1177
Mount Amukta|1066
Mount Arab|772
Mount Avalon|1049
Mount Bertha|3110
Mount Collins|1886
Mount Crillon|3879
Mount Einstein|3521
Mount Franklin|1524
Mount Griggs|2317
Mount Healy|1742
Mount Jarvis|4091
Mount Judah|2512
Mount Lola|2788
Mount Marshall|1329
Mount Misery|87
Mount Moffit|3968
Mount Morgan|4192
Mount Pinchot|755
Mount Sumdum|2032
Mount Waas|3751
Mount Waumbek|1221
Mount Webster|1192
Mount Werner|3222
Mount Wilbur|2843
Mount Wood|3859
Naomi Peak|3043
Needle Rock Natural Area|2377
New York Mountain|3824
Nokhu Crags|3807
North Arapaho Peak|4117
North Mountain|788
Olallie Butte|2200
Olancha Peak|3698
Peak One|3903
Peekamoose Mountain|1171
Polychrome Mountain|1798
Red Rock Mountain|746
Redcloud Peak|4278
Rio Grande Pyramid|4214
Rising Wolf Mountain|2900
Rocky Peak Ridge|1347
Salinas Peak|2733
Santanoni Peak|1404
Scotchman Peak|2139
Sierra Blanca|2101
Silers Bald|1709
Sinopah Mountain|2523
Slaughter Mountain|1322
Smarts Mountain|987
Snoqualmie Mountain|1911
South Teton|3816
South Twin Mountain|1494
Star Peak|2999
Sunlight Peak|4285
Tanaga|1806
Thousand Lake Mountain|3444|Thousand Lake
Thunderbolt Peak|4270
University Peak|4410
Venado Peak|3883
Waitt's Mountain|66
West Butte|2128
White Cap Mountain|1114
White Oak Mountain|456
Wolfs Head|3708
Wyoming Peak|3470
Ypsilon Mountain|4121
Hill of Tara|155
Pendle Hill|557
The Storr|719
Montpelier Hill|383
Hill of Uisneach|182
North Berwick Law|187
Croaghaun|688
Great Sugar Loaf|501
Chanctonbury Ring|242
Luggala|595
The Roaches|505
Garth Hill|307
Slievenamon|721
Cavehill|368|Cave Hill
Nephin|806
Winter Hill|456
Paps of Anu|694
Eildon Hill|422
Stiperstones|536
Bredon Hill|299
Devil's Bit|480
Slemish|437
Bardon Hill|278
Garnedd Ugain|1065
Killiney Hill|153
Muckish|667
Titterstone Clee Hill|533
Clisham|799
Caer Caradoc|459
Tap o' Noth|563
Walbury Hill|297
Castle Crag|290
Conic Hill|361
Yr Eifl|561
Blackdown|280
Dundee Law|174
Nine Standards Rigg|662
Ben Lui|1130
Djouce|725
Sgurr Dearg|986
Ben Vrackie|842
Brown Clee Hill|540
Croghan Hill|234
Holyhead Mountain|220
Cairnpapple Hill|312
Chrome Hill|425
Cnicht|691
Divis|478
Rhos Fawr|660
Hergest Ridge|426
Kippure|757
Black Combe|600
Mickle Fell|788
Orrest Head|238
Ronas Hill|450
Ben Chonzie|931
Dumyat|418
Hill of Allen|206
Sliabh an Iarainn|585
St Boniface Down|241
Thorpe Cloud|287
Urra Moor|454
Billinge Hill|179
Binevenagh|385
Cadair Berwyn|832
Fan Brycheiniog|803
Latrigg|368
Mount Gabriel|407
Twmpa|690
Benbaun|729
Beinn Narnain|926
Helm Crag|405
May Hill|296
Pap of Glencoe|742
Pen yr Ole Wen|978
Slieve Foy|589
Slievemore|671
The Devil's Point|1004
Torc Mountain|535
Drygarn Fawr|645
Gummer's How|321
Hungry Hill|685
Quinag|808
Raven Crag|461
Ward's Stone|561
Arenig Fawr|854
Wansfell|487
Black Down|325
Beinn Dorain|1076
Ben Rinnes|841
Caherconree|835
Criffel|570
Great Whernside|704
Kit Hill|334
Moel Hebog|784
Mullaghmore|180
Wolds Top|168
Purple Mountain|832
Slieve Binnian|746
Slieve Croob|534
Three Rock Mountain|448
Y Lliwedd|898
Axe Edge Moor|551
Beenkeragh|1008
Beinn Alligin|986
Beinn Ime|1011|Ben Ime
Botley Hill|270
Cnoc na Peiste|988
Creag Meagaidh|1130
Eldon Hill|470
Fleetwith Pike|648
Geokaun|266
Hill of Ward|90
Lewesdon Hill|279
Mynydd Mawr|698
Pavey Ark|700
Slieve Gallion|528
Stuc a' Chroin|975
Turlough Hill|681
Tonelagee|817
Truskmore|647
Walla Crag|379
Ben Cleuch|721
Aonach Beag|1234
Beinn a' Bheithir|1024
Ben Vane|915
Ben Venue|730
Broad Crag|934
Buachaille Etive Beag|958
Castell y Gwynt|972
Catstye Cam|890
Glaramara|783
Elidir Fawr|924
Foel Cwmcerwyn|536
Hallin Fell|388
Harrison Stickle|736
Knocknashee|276
Moylussa|532
Mynydd Bodafon|178
Pike of Stickle|709
Rhinog Fawr|720
Scald Law|579
An Sgurr|393
Arderin|527
Picws Du|749
Ben More Assynt|998
Benbradagh|465
Binsey|447
Bishop Wilton Wold|248
Black Chew Head|542
Crinkle Crags|859
Dale Head|753
Red Pike|755
Dodd|502
Glamaig|775
Gowbarrow Fell|481
Grasmoor|852
Great Shunner Fell|716
Green Gable|801
Keeper Hill|694
Knockboy|706
Meikle Bin|570
Breidden Hill|367
Mullaghmeen|258
Mynydd Carningli|346
Red Screes|776
Sgor Gaoith|1118
Slieve Beagh|380
Two Rock|536
Wild Boar Fell|708
Yewbarrow|628
A' Mhaighdean|967
Baurtregaum|851
Beinn a' Ghlo|1122
Ben Stack|721
Blackstairs Mountain|735
Boulsworth Hill|517
Buckden Pike|702
Carrock Fell|661
Croaghgorm|674
Cul Mor|849
Dduallt|662
Dow Crag|778
Foinaven|911
Great Cockup|526
Harboro' Rocks|379
High Pike|658
High Raise|762
High Spy|653
Ill Crag|935
Kidsty Pike|780
Knockmealdown|792
Lingmoor Fell|469
Little Sugar Loaf|342
Maumtrasna|682
Mull Hill|169
Mullaghcleevaun|849
Parkhouse Hill|360
Rannerdale Knotts|355
Rubers Law|424
Slieve Snaght|615
Tegg's Nose|380
The Bones|957
Trostan|551
Windy Gyle|619
Alport Height|314
Arnside Knott|159
Arthur's Pike|533
Barrow|455
Beinn Ghlas|1103
Beinn Mhor|741
Beinn na Caillich|732
Ben Donich|847
Ben Klibreck|962
Benarty Hill|356
Black Fell|323
Wetherlam|763
Canisp|847
Carn Eighe|1183
Carn Fadryn|371
Carnedd Gwenllian|925
Cheeks Hill|520
Clermont Carn|510
Corndon Hill|514
Craig y Llyn|600
Dundry Hill|223
Foel Grach|975
Foel-fras|944
Great Dodd|857
Grey Knotts|697
Hedgehope Hill|714
High Stile|807
Kirk Fell|802
Ladhar Bheinn|1020
Long Mountain|408
Longridge Fell|350
Lord's Seat|552
Meall Fuar-mhonaidh|699
Meall nan Tarmachan|1043
Moel Eilio|726
Moel Sych|827
Mullaghanish|649
Mullaghmast|179
Nethermost Pike|891
Pike o' Blisco|705
Robinson|737
Rushup Edge|550
Slieve Bearnagh|739
Slieve Commedagh|767
St Sunday Crag|841
The Big Gun|939
The Cairnwell|933
The Calf|676
West Lomond|522
Wills Neck|384
Y Llethr|756
Yr Elen|962
Ardloughnabrackbaddy|473
Arkle|787
Beinn Dearg|1084
Beinn an Oir|785
Ben Lugmore|803
Ben Mor Coigach|743
Derryclare|677
Burbage Edge|500
Burnhope Seat|747
Caher Mountain|1000
Cairnsmore of Fleet|711
Calf Top|610
Carn Clonhugh|278
Carrickgollogan|276
Causey Pike|637
Clough Head|726
Cosdon Hill|550
Crag Hill|839
Creag Dhubh|756
Dent|352
Dollywaggon Pike|858
Earl's Seat|578
Errisbeg|300
Eyam Moor|429
Fan Fawr|734
Foel Fenlli|511
Garn Boduan|279
Glas Maol|1068
Gragareth|627
Great Mell Fell|537
Hard Knott|549
Heron Pike|612
High Crag|744
High Rigg|357
High Seat|608
Holme Fell|317
Knocknadobar|690
Lingmell|807
Margery Hill|546
Maulin|570
Mealaisbhal|574
Meall a' Bhuachaille|810
Mellbreak|512
Moelwyn Mawr|770
Mungrisdale Common|633
Mynydd Troed|609
Nephin Beg|627
Pen Cerrig-calch|701
Penycloddiau|440
Raise|883
Rhinog Fach|712
Ros Hill|315
Sale Fell|359
Seathwaite Fell|632
Sgor an Lochain Uaine|1258
Sheffield Pike|675
Silver How|395
Slieve Muck|670
South Barrule|483
Souther Fell|522
Stob Binnein|1165
Tal y Fan|610
The Nab|576
Tibradden Mountain|467
Tievebulliagh|402
Walna Scar|621
Whinlatter|525
Yr Aran|747
Beerenberg|2277
Aiguille du Dru|3754
Grosser Mythen|1898
Piz Boe|3152
Puy de Sancy|1885
Mont Chaberton|3131
Pico de las Nieves|1949
Piz Buin|3312
Fronalpstock|1921
Schneeberg|2076
Roque de los Muchachos|2426
La Tournette|2351
Brienzer Rothorn|2350
Tofane|3244|Tofana,Tofana di Mezzo
Hoher Goll|2522|Hoher Goell
Mont Buet|3096
Signalkuppe|4554
Newtontoppen|1713
Grimming|2351
Jof di Montasio|2752
Mont Dolent|3823
Mont Maudit|4465
Sorapiss|3205
Wildspitz|1580
Mount Adamello|3539
Barrhorn|3610
Dammastock|3630
Mont Blanc de Courmayeur|4748
Mont Fort|3328
Pizol|2844
Schesaplana|2964
Stockhorn|2190
Chasseral|1606
Jiehkkevarri|1834
Vincent Pyramid|4215
Augstmatthorn|2137
Castor|4225
Herzogstand|1731
Hochfeiler|3510
Mont Blanc du Tacul|4248
Piz Nair|3056
Stol|2236
Tegelberg|1881
Zumsteinspitze|4563
Aiguille de la Grande Sassiere|3751
Ankogel|3252
Cima Tosa|3136
Grenzgipfel|4618
Konigspitze|3851|Koenigspitze
Monte Bondone|2180
Rheinwaldhorn|3402
Rocciamelone|3538
Klingenstock|1935
Dome du Gouter|4304
Grosser Priel|2515
Hochschwab|2277
Nordend|4608
Benediktenwand|1800
Chamechaude|2082
Cimon della Pala|3184
Grande Casse|3855
Grigna|2410
Kampenwand|1669
Les Droites|4000
Pollux|4089
Ringelspitz|3248
Schnebelhorn|1292
Schwarzhorn|2928
Similaun|3599
Weisskugel|3739
Wildhorn|3250
Aiguille Noire de Peuterey|3773
Aiguille de Bionnassay|4052
Aiguille des Glaciers|3816
Cime du Gelas|3143
Fineilspitze|3514
Grand Muveran|3051
Grosses Wiesbachhorn|3564
Gurten|858
Hermannskogel|542
Hesselberg|689
Hochkalter|2607
Monte Disgrazia|3678
Mount Emilius|3559
Pic Tyndall|4241
Presanella|3558
Rinderberg|2079
Aiguille Blanche de Peuterey|4112
Aiguille d'Argentiere|3898
Aiguille de Rochefort|4001
Aiguille du Tour|3540
Aiguilles d'Arves|3514
Ailefroide|3954
Ellmauer Halt|2344
Grand Gendarme|4329
Hinterrugg|2306|Churfirsten
Kleiner Mythen|1811
Monte Argentera|3297
Oberrothorn|3414
Olperer|3476
Parseierspitze|3036
Piz Roseg|3935
Pizzo Coca|3050
Pointe Percee|2753
Valluga|2809
Ehrenburg|532|Ehrenbuerg
Zuckerhutl|3507|Zuckerhuetl
Aggenstein|1985
Bella Tola|3025
Blinnenhorn|3374
Bristen|3073
Calanda|2805
Chaserrugg|2262|Chaeserrugg
Cima Brenta|3150
Vezzana|3192
Dreitorspitze|2682
Dunantspitze|4632
Eggstock|2455
Furggen|3492
Geschriebenstein|884
Grande Motte|3653
Hochtor|2369
Hochvogel|2592
Coglians|2780
Hoher Ifen|2230
Kesselkogel|3002
Kreuzberg|928
Mettelhorn|3406
Montalto|1955|Aspromonte
Napf|1408
Pico de Malpaso|1501
Schonfeldspitze|2653|Schoenfeldspitze
Tete Blanche|3710
Vanil Noir|2389
Zirbitzkogel|2396
Aiguille de Scolette|3506
Balmhorn|3697
Cima Dodici|2336
Doldenhorn|3638
Dreischusterspitze|3145
Fletschhorn|3985
Grande Tete de l'Obiou|2790
Grunhorn|4043|Gruenhorn
Osser|1293
Hintere Schwarze|3628|Hintere Schwaerze
Hochalmspitze|3360
Hochfelln|1674
Hoher Bogen|1079
La Spedla|4020
Le Chasseron|1607
Mont Pelat|3052
Mont Pourri|3779
Mont Tendre|1679
Mont Velan|3727
Monte Cevedale|3769
Munt Pers|3207
Ochsenkopf|1024
Parrotspitze|4434
Pic de Rochebrune|3320
Piz Cengalo|3369
Piz Languard|3262
Piz Zupo|3995
Punta San Matteo|3678
Rimpfischhorn|4199
Sas Rigais|3025
Scheidegg|1659
Selun|2205
Speer|1951
Strahlhorn|4190
Mont Agel|1148
Grand Ballon|1423
Cime de la Bonette|2860
Mont Sainte-Odile|764
Saleve|1379
Pointe Helbronner|3462
Mount Saint Peter|171
Koppenberg|78
Cret de la Neige|1721
Ballon d'Alsace|1247
Kemmelberg|154
Larrun|905
Le Brevent|2525
Puy Mary|1783
Ceuse|2016
Mont Aigoual|1567
Plomb du Cantal|1855
Mur de Huy|204
Dent de Burgin|2739
Mont Gerbier de Jonc|1551
Mont Thabor|3178
Pic d'Orhy|2017
Pic de Bugarach|1230
Semnoz|1702
Pic Gaspard|3883
Pic Saint-Loup|658
Aiguille Dibona|3130
Cauberg|137
Dent de Crolles|2062
Mont Granier|1933
Mont Revard|1562
Carlit|2921
Dent d'Oche|2221
La Dole|1677
Maladeta|3312
Le Mole|1863
Aiguille Rouge|3227
Aiguille du Gouter|3863
Grand Veymont|2341
Puy Pariou|1209
Balaitous|3144
Dent du Chat|1390
Grand Capucin|3838
Mont Gargan|731
Mont Joly|2525
Mont Mezenc|1753
Monte Musine|1150
Monte Renoso|2352
Monte d'Oro|2389
Pic de Nore|1211
Pic de Neouvielle|3091
Pic du Taillon|3144
Weisser Stein|693
Aiguille du Grepon|3482
Cime de Caron|3195
Grand Colombier|1534
Mesa de los Tres Reyes|2446
Mont Mouchet|1497
Mont d'Arbois|1833
Mont d'Or|1463
Monte Saccarello|2201
Pic de Morgon|2324
Punta Marguareis|2651
Roc'h Trevezel|384
Tete de l'Estrop|2961
Weissenstein|1395
Rock of Gibraltar|426
Phlegraean Fields|458
Vatican Hill|75
Cumbre Vieja|1949
Puig Major|1445
Pico do Areeiro|1818
Mount Somma|1132
Mount Pellegrino|606
Puig Campana|1406
Aitana|1558
Monte Solaro|589
Kneiff|560
El Toro|358
Grauspitz|2599
Roque de Agando|1250
Sa Talaiassa|475
Mottarone|1492
Monte Pisanino|1946
Aiguilles d'Entreves|3600
Monte Vulture|1326
Tajogaite|1120
Calar Alto|2168
La Maroma|2069
Mount Fumaiolo|1407
Monte Faito|1131
Plose|2562
Latemar|2842
Montana de Tindaya|401
Monte Erice|751
Monte Legnone|2609
Pico Viejo|3135
Gorbea|1482
Peitlerkofel|2875
Pizzo Carbonara|1979
Serra do Marao|1415
Aizkorri|1551
Mount Capanne|1017
Teneguia|428
Montana Blanca|2748
Morro de la Agujereada|1956
Seekofel|2810
Alcazaba|3369
Averau|2649
Monte Agner|2872
Monte Velino|2487
Roccamonfina|1005
Aiguilles Marbrees|3535
La Torrecilla|1918
Monte Corona|609
Monte Cairo|1669
Monte Cornacchia|1151
Monte Cusna|2120
Mount Limbara|1362
Trevinca|2127
Pena de Francia|1727
Rocca Busambra|1613
Santa Margarida Volcano|682
El Turbon|2492
Botte Donato|1928
Cima d'Asta|2847
Croscat|786
Jof Fuart|2666
Monte Catria|1702
Monte Kronio|395
Monte Lauro|986
Mount Guajara|2715
Presolana|2521
Turo de l'Home|1706
Himmelbjerget|147
Hverfjall|420
Oraefajokull|2110
Sundhnukur|134
Ahkka|2011
Hofsjokull|1765
Ejer Bavnehoj|170
Skjaldbreidur|1066
Þorbjorn|243
Kjerkeberget|631
Kverkfjoll|1933
Loki-Fogrufjoll|1573
Rondeslottet|2178
Torfajokull|1281
Fannaraki|2068
Grafelli|856
Helgafell|227
Ok|1198
Oksskolten|1916
Tomtabacken|377
Mount Olympus (Cyprus)|1952
Mount Ossa (Greece)|1978
Snaefell (Iceland)|1833
Diamond Hill|442
Ben More (Mull)|966
Black Hill|582
Black Mountain (Wales)|704
Black Mountain (Belfast)|389
Sugarloaf (County Wicklow)|552
The Cloud|343
Brandon Hill|515
Ben Vorlich (Loch Lomond)|943
The Saddle|1011
Mount Eagle|516
Mount Olympus (Washington)|2432
Ben Lomond Mountain|2961
Wheeler Peak (Nevada)|3982
Blue Mountain (Pennsylvania)|344
Mount Wilson (California)|1741
Lookout Mountain (Colorado)|2249
Mount Nebo (Utah)|3637
Sugarloaf Mountain (Maryland)|391
Baldy Mountain (New Mexico)|3792
Mount Baldy (Arizona)|3477
El Capitan (Texas)|2458
Mount Washington (Oregon)|2376
Bear Mountain (Connecticut)|706
Sugarloaf Mountain (Maine)|1288
Mount Adams (New Hampshire)|1766
Matterhorn Peak (Sierra Nevada)|3744
Hunter Mountain|1231
Mount Olympus (Utah)|2752
Mount Orizaba|648
Cathedral Peak (California)|3327
Mount Cleveland (Alaska)|1730
Castle Peak (Colorado)|4350
Matterhorn (Nevada)|3305
Mount Wilson (Colorado)|4345
Cascade Mountain (New York)|1249
Mount Washington (Washington)|1908
Mount Jefferson (New Hampshire)|1741
Mount Humphreys (California)|4265
Mount Morrison (California)|3731
Sugarloaf Mountain (New Brunswick)|281
Sugarloaf Mountain (Massachusetts)|199
Table Mountain (Wyoming)|3387
Castle Peak (California)|2776
Granite Mountain (Arizona)|2325
Mount Jefferson (Nevada)|3641
Mount Jefferson (North Carolina)|1422
San Antonio Mountain|3326
Stone Mountain (North Carolina)|703
Blue Mountain (New York)|1143
Mount Zion (Colorado)|2152
Pyramid Peak (California)|3043
Mount Hood (California)|833
Mount Jackson (New Hampshire)|1235
Signal Mountain (Wyoming)|2353
Wetterhorn Peak|4273
Bear Mountain (South Dakota)|2184
Bear Peak (Colorado)|2578
Camelback Mountain (Pennsylvania)|650
Castle Peak (Idaho)|3601
Matterhorn (Oregon)|2998
Matterhorn Peak (Colorado)|4144
Monadnock Mountain|960
Mount Ararat (Pennsylvania)|804
Mount Ida (Colorado)|3924
Mount Jefferson (Idaho)|3114
Pyramid Peak (Alaska)|2705
Berlin Mountain|859
Black Mesa (Arizona)|1865
Blue Mountain (Washington)|1830
Mount Bear|4520
Mount Cook (Canada)|4196
Mount Whiteface|1225
Signal Peak (Utah)|3160
Sugarloaf Hill|239
Bear Mountain (Georgia)|703
Cascade Peak|2264
Catherine Mountain|293
El Capitan (Montana)|3043
Logan Peak|2961
Mount Jackson (Montana)|3064
Mount Thor (Alaska)|3816
Mount Wilson (Nevada)|2155
Pico Peak|1209
Rogers Peak (Oregon)|1130
`;

export const MINOR_PEAKS = `
Ben Macdui|1309
Braeriach|1296
Cairn Gorm|1245
Mount Sunflower|1231
Schiehallion|1083
Mount Greylock|1063
Kekes|1014
Mount Davis|979
Ben Lomond|974
Mount Monadnock|965
Helvellyn|950
Skiddaw|931
Great Gable|899
Cadair Idris|893
Cross Fell|893
Pen y Fan|886
Mount Ainslie|843
Goat Fell|874
Camelback Mountain|824
The Cheviot|815
Whernside|736
Ingleborough|723
Signal de Botrange|694
Pen-y-ghent|694
Lions Head|669
Kinder Scout|636
High Willhays|621
Shining Tor|559
Dunkery Beacon|519
Mam Tor|517
Hawkeye Point|509
Kahlenberg|484
Worcestershire Beacon|425
Brown Willy|420
The Wrekin|407
Charles Mound|376
Signal Hill|350
Cleeve Hill|330
Vaalserberg|322
Roseberry Topping|320
Suur Munamagi|318
Gaizinkalns|312
Leith Hill|294
Aukstojas|293
Mount Coot-tha|287
Arthurs Seat|251
Ditchling Beacon|248
Jerimoth Hill|247
Woodall Mountain|246
Gellert Hill|235
Ivinghoe Beacon|233
Box Hill|224
Mount Eden|196|Maungawhau
One Tree Hill|182|Maungakiekie
Mollehoj|171
Bukit Timah|164
Driskill Mountain|163
Mount Wycheproof|148
Ebright Azimuth|137
Montmartre|130
Mount Faber|106
Britton Hill|105
`;

export const DESERTS = `
Antarctic Desert|14000000|Antarctic Polar Desert
Arctic Desert|13900000|Arctic Polar Desert
Sahara|9200000|Sahara Desert
Arabian Desert|2330000
Gobi|1295000|Gobi Desert
Kalahari|900000|Kalahari Desert
Patagonian Desert|673000|Patagonian Steppe
Rub al Khali|650000|Empty Quarter
Syrian Desert|500000
Great Basin Desert|492000|Great Basin
Monte Desert|460000
Nubian Desert|400000
Chihuahuan Desert|362000
Karakum|350000|Karakum Desert
Great Victoria Desert|348750
Taklamakan|337000|Taklamakan Desert
Colorado Plateau Desert|337000
Kyzylkum|298000|Kyzylkum Desert
Great Sandy Desert|284993
Sonoran Desert|260000|Sonoran
Nullarbor Plain|200000|Nullarbor
Thar Desert|200000|Thar,Great Indian Desert
Sechura Desert|188735
Tanami Desert|184500
Simpson Desert|176500
Gibson Desert|156000
Danakil Desert|136956|Danakil
Mojave Desert|124000|Mojave
Little Sandy Desert|111500
Atacama Desert|105000|Atacama
Ordos Desert|90650
Namib|81000|Namib Desert,Namib Sand Sea
Strzelecki Desert|80000
Dasht-e Kavir|77600|Great Salt Desert
Dasht-e Lut|51800|Lut Desert
Badain Jaran Desert|49000
Tengger Desert|42700
Registan Desert|40000
Sturt Stony Desert|29750
Negev|13000|Negev Desert
Wahiba Sands|12500
Judaean Desert|1500|Judean Desert
Rangipo Desert|300
Tabernas Desert|280
Oleshky Sands|161
Bledowska Desert|32
Wadi Rum|720
Painted Desert|19425
Black Rock Desert|2600
Great Salt Lake Desert|10360
Guajira Desert|15300
Tatacoa Desert|330
Cholistan Desert|26300
Tenere|400000
Libyan Desert|1100000
Western Desert|700000
Eastern Desert|220000
Chalbi Desert|100000
Death Valley|7800
White Sands|712|White Sands National Monument
Great Sand Dunes|78
Karoo|400000|Great Karoo
Rann of Kutch|30000|Rann of Kachchh
An Nafud|57000|Nafud Desert
Ad-Dahna|50000|Dahna Desert,Al-Dahna
Sossusvlei|10
Skeleton Coast|16845
Tanezrouft|424000
Grand Erg Oriental|192000
Grand Erg Occidental|78000
Erg Chebbi|90
Great Sand Sea|72000
Qattara Depression|19605
Sinai Desert|60000|Sinai
McMurdo Dry Valleys|4800
Colorado Desert|20000
Gran Desierto de Altar|5700
Vizcaino Desert|25000
Algodones Dunes|409|Imperial Sand Dunes
Kelso Dunes|115
Alvord Desert|285
Carcross Desert|2.6
Red Desert (Wyoming)|23300
Amargosa Desert|3700
Escalante Desert|4700
Yuma Desert|10000
Lencois Maranhenses|1500
Sevier Desert|29980
Owyhee Desert|24280
Baja California Desert|77700
Smoke Creek Desert|1300
Anza-Borrego Desert|2600
Puna de Atacama|180000
Djurab Desert|200000
Bayuda Desert|100000
Ferlo Desert|70000
Kaokoveld|45700
Richtersveld|1624
White Desert (Egypt)|300|Sahara el Beyda,White Desert Protected Area
Black Desert (Egypt)|500
Erg Chigaga|500|Erg Chegaga
Erg Iguidi|68800
Betpak-Dala|75000
Ustyurt Plateau|200000
Dasht-e Margo|150000|Margo Desert
Thal Desert|23000
Kubuqi Desert|18600
Mu Us Desert|48288
Gurbantunggut Desert|50000
Kumtag Desert|22900
Qaidam Basin|120000
Aralkum Desert|60000
Ramlat al-Sab'atayn|26000
Khongoryn Els|965
Chara Sands|18
Maranjab Desert|700
Zin Desert|1000|Desert of Zin
Arabah|4000|Wadi Araba
Kharan Desert|25000
Moiynkum Desert|37500|Muyunkum,Moyunkum Desert
Saryesik-Atyrau Desert|35000
Ryn Desert|40000
Tirari Desert|15250
Pedirka Desert|1250
Bardenas Reales|420
Monegros Desert|2764
Cabo de Gata|460
Deliblato Sands|300|Deliblatska Pescara
Rabjerg Mile|2
Bonneville Salt Flats|104
Desert of Wales|0
Accona Desert|0
High Desert|0
Jornada del Muerto|0
Kau Desert|0
Yuha Desert|0
Tonopah Desert|0
`;

export const ISLANDS = `
Greenland|2166086|Kalaallit Nunaat
New Guinea|785753|Papua New Guinea,PNG
Borneo|748168|Brunei
Madagascar|587041
Baffin Island|507451|Baffin
Sumatra|443066
Honshu|225800
Victoria Island|217291
Great Britain|209331|Britain,United Kingdom,UK
Ellesmere Island|196236|Ellesmere
Sulawesi|180681|Celebes
South Island|145836|Te Waipounamu
Java|138794
North Island|111583|Te Ika-a-Maui
Luzon|109965
Newfoundland|108860
Cuba|105806
Iceland|101826
Mindanao|97530
Ireland|84421
Hokkaido|78073
Hispaniola|76192|Haiti,Dominican Republic
Sakhalin|72493
Banks Island|70028
Tasmania|68401
Sri Lanka|65268|Ceylon
Devon Island|55247
Novaya Zemlya|48904
Tierra del Fuego|47992
Melville Island|42149
Southampton Island|41214
Spitsbergen|37673
Kyushu|36782
Taiwan|35883|Formosa
New Britain|35145
Hainan|33210
Vancouver Island|31285
Timor|30777|Timor-Leste,East Timor
Sicily|25711|Sicilia
Somerset Island|24786
Sardinia|23949|Sardegna
Shikoku|18800
Halmahera|18040
Seram|17100|Ceram
Flores|13540
Samar|13429
Negros|13310
Palawan|12189
Panay|12011
Jamaica|10991
Big Island of Hawaii|10433|Hawaii Island,Big Island
Cape Breton Island|10311|Cape Breton
Cyprus|9251
Puerto Rico|8870
Corsica|8680|Corse
Crete|8336|Kriti
Wrangel Island|7600
Zealand|7031|Sjaelland
Aland|685|Fasta Aland
Bali|5780
Prince Edward Island|5660
Trinidad|4768|Trinidad and Tobago
Socotra|3796
Mallorca|3640|Majorca
Fyn|3100|Funen
Gotland|2994
Reunion|2511
Tenerife|2034
Mauritius|2040
Lewis and Harris|2179
Bioko|2017
Zanzibar|1666|Unguja
Isle of Skye|1656|Skye
Lesbos|1633|Lesvos
Rhodes|1401|Rodos
Shetland Mainland|967
Lanzarote|845
Madeira|741
Anglesey|714|Ynys Mon
Bornholm|588
Isle of Man|572
Ibiza|571
Guam|543
Orkney Mainland|523
Barbados|430
Isle of Wight|380
Niue|261
Malta|246
Elba|224
Easter Island|163.6|Rapa Nui
Saint Helena|122|St Helena
Jersey|118
Mykonos|105
Tristan da Cunha|98
Santorini|76|Thira
Guernsey|65
Bouvet Island|49
Pitcairn Island|47|Pitcairn
Ischia|46
Inishmore|31
Nauru|21
Capri|10.4
Iona|8.8
Lundy|4.5
Maui|1883
Oahu|1545
Kauai|1430
Molokai|673
Lanai|364
Niihau|180
Manhattan|59
Long Island|3629
Staten Island|151
Marthas Vineyard|231
Nantucket|124
Key West|19
Santa Catalina Island|194|Catalina Island
Kodiak Island|9311|Kodiak
Mackinac Island|9.8|Mackinaw Island
Isle Royale|535
Galveston Island|209
Roanoke Island|47
Ellis Island|0.11
Alcatraz Island|0.089|Alcatraz
Aruba|180
Curacao|444
Bonaire|288
Grand Cayman|197
Martinique|1128
Guadeloupe|1628
Saint Martin|87|St Martin
Anguilla|91
Montserrat|102
Nevis|93
Saint Kitts|168|St Kitts,Saint Kitts and Nevis,St Kitts and Nevis
Tortola|55
Virgin Gorda|21
Saint Thomas|83|St Thomas
Saint Croix|215|St Croix
Antigua|281|Antigua and Barbuda
Barbuda|161
Dominica|750
Saint Lucia|617
Saint Vincent|344|Saint Vincent and the Grenadines,St Vincent and the Grenadines
Grenada|312
Eleuthera|484
Andros Island|5957|Andros
Grand Bahama|1373
New Providence|207
Great Exuma|156|Exuma
Great Abaco|1681|Abaco
Cozumel|478
Isla Mujeres|4.6
Roatan|127
Ometepe|276
Margarita Island|1020|Isla Margarita
San Andres|26
Providenciales|122
Grand Turk|17.7
Isabela Island|4586
Santa Cruz Island|986
San Cristobal Island|558
Fernandina Island|642
Floreana Island|173
Chiloe|8394|Chiloe Island
Robinson Crusoe Island|48
Fernando de Noronha|18.4
Marajo|40100|Marajo Island
Ilha Grande|193
East Falkland|6605
West Falkland|4532
South Georgia|3528
Ascension Island|88|Ascension
Gough Island|91
Corfu|610|Kerkyra
Zakynthos|406|Zante
Kefalonia|781|Cephalonia
Naxos|430
Paros|196
Milos|151
Kos|290
Samos|478
Chios|842
Euboea|3684|Evia
Hydra|50
Patmos|34
Delos|3.4
Ithaca|96|Ithaki
Gozo|67
Menorca|695|Minorca
Formentera|83
Gran Canaria|1560
Fuerteventura|1660
La Palma|708
La Gomera|370
El Hierro|269
Porto Santo|42
Sao Miguel|745
Terceira|400
Pico Island|446
Lampedusa|20
Pantelleria|83
Lipari|37.6
Vulcano|21
Rugen|926
Sylt|99
Usedom|445
Helgoland|1.7
Oland|1342
Lolland|1243
Falster|514
Mon|218
Samso|114
Saaremaa|2673
Hiiumaa|989
Senja|1586
Hinnoya|2204
Mull|875|Isle of Mull
Islay|620
Jura|367|Isle of Jura
Arran|432|Isle of Arran
Bute|122|Isle of Bute
North Uist|303
South Uist|320
Barra|60
Tiree|78
Coll|77
Rum|104|Isle of Rum
Eigg|31
Staffa|0.33
Lindisfarne|4.5|Holy Island
Tresco|2.97
Sark|5.5
Alderney|7.8
Herm|2
Achill Island|148|Achill
Valentia Island|11|Valentia
Skellig Michael|0.22
Rathlin Island|14|Rathlin
Clare Island|16
Streymoy|374
Phuket|576
Koh Samui|228|Ko Samui
Langkawi|478
Penang Island|293|Penang
Tioman|136|Pulau Tioman
Boracay|10.3
Cebu|4468
Bohol|3821
Siargao|437
Jeju Island|1833|Jeju
Okinawa Island|1207|Okinawa
Sado Island|855|Sado
Yakushima|504
Miyajima|30|Itsukushima
Awaji Island|592|Awaji
Ishigaki Island|222|Ishigaki
Lombok|4514
Komodo|390|Komodo Island
Sumba|11153
Sumbawa|15448
Ambon Island|775|Ambon
Ternate|111
Nias|4771
Bintan|1946
Batam|415
Christmas Island|135
Norfolk Island|35
Lord Howe Island|14.6
Kangaroo Island|4405
Fraser Island|1840|Kgari
Rottnest Island|19|Rottnest
Bruny Island|362|Bruny
Stewart Island|1746|Rakiura
Waiheke Island|92|Waiheke
Bora Bora|30.6
Tahiti|1045
Moorea|134
Rangiroa|79
Nuku Hiva|339
Rarotonga|67
Aitutaki|18
Upolu|1125
Savaii|1694
Tutuila|142
Efate|899
Espiritu Santo|3956
Tanna|550|Tanna Island
Viti Levu|10389|Fiji
Vanua Levu|5587
Guadalcanal|5353
Bougainville Island|9318|Bougainville
New Ireland|7404
Manus Island|2100|Manus
Saipan|115
Tinian|101
Babeldaob|331
Pohnpei|334
Majuro|9.7
Kwajalein|16.4
Bikini Atoll|6|Bikini
Kiritimati|388|Christmas Island Kiribati
Wake Island|7.4
Midway Atoll|6.2|Midway
Mahe|157|Mahe Island
Praslin|38
La Digue|10
Aldabra|155
Pemba Island|988|Pemba
Mafia Island|435|Mafia
Grande Comore|1148|Ngazidja
Mayotte|374
Nosy Be|320
Rodrigues|108
Principe|136
Sao Tome Island|854
Santiago Island|991
Sal|216|Sal Island
Boa Vista|620
Robben Island|5.07|Robben
Goree|0.17|Goree Island
Djerba|514
Andaman Islands|6408
Seychelles|459
Maldives|298
Comoros|1862|Comoro Islands
Cape Verde|4033|Cabo Verde
Sao Tome and Principe|1001|Sao Tome & Principe
Bahamas|10010|The Bahamas
Palau|459|Belau
Samoa|2842|Western Samoa
Tonga|748
Vanuatu|12189|New Hebrides
Solomon Islands|28400|Solomons,The Solomon Islands,Solomon Island
Kiribati|811|Gilbert Islands
Tuvalu|26|Ellice Islands
Marshall Islands|181|Marshalls,The Marshall Islands,Marshall Island
Micronesia|702|Federated States of Micronesia,FSM
Japan|364485|Nippon
Philippines|300000|The Philippines
Indonesia|1904569
New Zealand|268021|Aotearoa
Singapore Island|710|Singapore,Pulau Ujong
Bahrain Island|590
Canary Islands|7493|Canaries
Balearic Islands|4992|Balearics
Azores|2333
Galapagos Islands|7880|Galapagos
Aleutian Islands|17666|Aleutians
Florida Keys|356|The Keys
Faroe Islands|1399|Faroes,Faro Islands
Cyclades|2572
Isles of Scilly|16|Scilly Isles
Svalbard|61022
Outer Hebrides|3071|Western Isles
Cook Islands|236
Society Islands|1590
Marquesas Islands|1049|Marquesas
Falkland Islands|12173|Falklands,Islas Malvinas
Pebble Island|113
Saunders Island|126
Carcass Island|18
Weddell Island|259
Sea Lion Island|9|Sea Lion
Lofoten|1233|Lofoten Islands
Vesteralen|2500
Andoya|489
Kvaloya|737
Mageroya|436
Tromsoya|9.5
Hitra|571
Froya|147
Runde|9.6
Stord|241
Sotra|176
Karmoy|177
Bygdoy|4.3
Nordaustlandet|14443
Bear Island|178|Bjornoya
Jan Mayen|373
Shetland|1466|Shetland Islands
Orkney|990|Orkney Islands
Hebrides|7200
Inner Hebrides|4130
Channel Islands|198
Fair Isle|7.68
Unst|120
Yell|212
Hoy|143
Westray|47
Sanday|50
Raasay|64
Canna|11
Muck|2.5
Lismore|24
Colonsay|41
Gigha|14
Great Cumbrae|12
Ailsa Craig|0.99
Bass Rock|0.02
Isle of May|0.57
Ulva|19.6
Benbecula|82
Eriskay|9
St Kilda|8.5|Hirta
Skomer|2.92
Caldey Island|2.4
Bardsey Island|1.8
Mersea Island|18
Canvey Island|19
Isle of Sheppey|93|Sheppey
Hayling Island|10
Portsea Island|10.5
Brownsea Island|2
Farne Islands|0.4
Walney Island|12.5|Walney
Aran Islands|46
Inishmaan|9
Inisheer|8
Inishbofin|9
Tory Island|4.75
Arranmore|22
Cape Clear Island|5|Cape Clear
Dursey Island|6.5|Dursey
Great Blasket Island|5.1|Great Blasket
Lambay Island|2.5|Lambay
Spike Island|1
Ile de Re|85|Isle of Re
Ile d'Oleron|175|Oleron
Belle-Ile|84|Belle Ile en Mer
Ile d'Yeu|23|Yeu
Noirmoutier|49
Ouessant|15.6|Ushant
Ile de Brehat|3.09|Brehat
Groix|14.8
Porquerolles|12.5
Mont-Saint-Michel|0.08|Mont Saint Michel
Ile de la Cite|0.22
Ile Saint-Louis|0.11
Procida|4.26
Ponza|9.7
Isola del Giglio|21.2|Giglio
Montecristo|10.4
Murano|1.17
Burano|0.21
Torcello|4.5
Lido di Venezia|15.4|Venice Lido,Lido
Giudecca|0.55
Salina|26.8
Panarea|3.4
Stromboli|12.6
Ustica|8.65
Favignana|19.8
Aeolian Islands|114.8|Lipari Islands
Egadi Islands|37.45|Egadi
La Maddalena|20.1
Caprera|15.7
Asinara|52
Tavolara|5.9
Sant'Antioco|109
San Pietro Island|51|Isola di San Pietro
Tremiti Islands|3.14
Ortigia|1|Ortygia
Tiber Island|0.03|Isola Tiberina
Monte Isola|5.1
Cabrera Island|16|Isla de Cabrera,Cabrera
Tabarca|0.3
Cies Islands|4.33|Islas Cies
La Graciosa|29
Isla de Lobos|4.6|Lobos
Faial Island|173|Faial
Sao Jorge Island|243|Sao Jorge
Graciosa Island|61|Graciosa
Corvo Island|17|Corvo
Berlengas|1.04
Santo Antao|779
Sao Vicente|227
Fogo|476
Maio|269
Brava|64
Sao Nicolau|343
Bijagos Islands|12958|Bissagos Islands
Annobon|17
Ilheu das Rolas|3.5|Rolas Islet
Inaccessible Island|14
Nightingale Island|4
Desertas Islands|14
Selvagens Islands|2.73|Savage Islands
Santa Maria Island|97
Dodecanese|2714
Ionian Islands|2200
Sporades|476
Skiathos|47.3
Skopelos|96.2
Alonnisos|64.1|Alonissos
Skyros|209
Thasos|380
Samothrace|178|Samothraki
Lemnos|477.6|Limnos
Ikaria|255
Leros|54
Kalymnos|110
Symi|58|Simi
Nisyros|41|Nisiros
Karpathos|300
Kastellorizo|9.1|Megisti
Tinos|194
Syros|84
Serifos|75
Sifnos|74
Folegandros|32
Ios|108
Amorgos|121
Antiparos|35
Koufonisia|5.3|Koufonisi
Kythira|280|Cythera
Antikythera|20.4|Antikithira
Spetses|27
Poros|50
Aegina|83
Salamis Island|96|Salamis
Lefkada|303|Leucas
Paxos|19
Skorpios|2
Gavdos|29
Spinalonga|0.085
Hvar|297
Brac|395
Korcula|271
Krk|405
Cres|406
Pag|284
Rab|86
Vis|90
Mljet|98
Losinj|74
Dugi Otok|113
Lastovo|41
Kornati|64
Lopud|4.4
Lokrum|0.7
Solta|58
Galesnjak|0.13|Lovers Island
Sveti Stefan|0.02
Sazan Island|5.7|Sazan
Bled Island|0.014
Bozcaada|38
Gokceada|280|Imbros
Buyukada|5.4|Prinkipo
Princes' Islands|11|Kizil Adalar
Cunda Island|23|Cunda,Alibey Island
Akdamar Island|0.7|Akdamar
Kekova|4.5
Comino|3.5
Fehmarn|185
Amrum|20.5
Fohr|82.8
Hiddensee|18.5
Borkum|30.8
Norderney|26.3
Reichenau Island|4.3|Reichenau
Mainau|0.45
Lindau Island|0.68|Lindau
Herreninsel|2.3
Museum Island|0.09|Museumsinsel
Frisian Islands|1000
Wadden Islands|400|West Frisian Islands
Texel|163
Terschelling|88
Vlieland|35
Ameland|58
Schiermonnikoog|16
Marken|2.5
Walcheren|205
Als|321
Langeland|284
Aero|88
Fano|56
Romo|129
Laeso|101
Anholt|22
Amager|95
Christianso|0.25
Orust|346
Tjorn|148
Hisingen|199
Ven|7.5
Sodermalm|4|Sodermalm Island
Djurgarden|2.7
Gamla Stan|0.36|Old Town Stockholm,Stadsholmen
Lidingo|30.5
Visingso|24
Marstrand|0.94
Gotska Sandon|36
Suomenlinna|0.8
Hailuoto|195
Muhu|198
Vormsi|93
Kihnu|16.4
Ruhnu|11.9
Naissaar|18.6
Kotelny Island|11700|Kotelny
Severnaya Zemlya|37000
New Siberian Islands|38400
Franz Josef Land|16134
Vaygach Island|3383|Vaygach
Kolguyev Island|3200|Kolguyev
Solovetsky Islands|347
Kizhi|5.06
Valaam|27.8
Kotlin|11.6
Vasilyevsky Island|11
Wolin|265
Snake Island|0.17|Zmiinyi Island
Khortytsia|2.5|Khortytsya
Axel Heiberg Island|43178|Axel Heiberg
Prince of Wales Island|33339
King William Island|13111
Bylot Island|11067|Bylot
Cornwallis Island|6995
Ellef Ringnes Island|11295|Ellef Ringnes
Disko Island|8578|Qeqertarsuaq
South Shetland Islands|3687
South Orkney Islands|620
South Sandwich Islands|310
King George Island|1150
Livingston Island|798
Deception Island|98.5
Elephant Island|558
Alexander Island|52223
Berkner Island|44000
Thurston Island|12760
Siple Island|6390
Ross Island|2431
Adelaide Island|4463
Anvers Island|2076
James Ross Island|2470
Snow Hill Island|368|Snow Hill
Seymour Island|347
Paulet Island|3.5
Peter I Island|156
Balleny Islands|340
Heard Island|368
Kerguelen Islands|7215|Kerguelen
Crozet Islands|352|Crozet
Amsterdam Island|55
Ile Saint-Paul|8|Saint Paul Island
Macquarie Island|128
Campbell Island|113
Auckland Islands|626
Antipodes Islands|21
Snares Islands|3.4
Chatham Islands|966
Hong Kong Island|78
Lantau Island|147
Tobago|300
Iwo Jima|21
Hashima|0.06|Gunkanjima
Liancourt Rocks|0.19|Dokdo,Takeshima
Corregidor|9
Lamma Island|13.85
Cheung Chau|2.4
Ulleungdo|72.9
Geoje|383
Ganghwa|302
Yeouido|2.9
Leyte|7368
Mindoro|9735
Mactan|105.4
Camiguin|238
Siquijor|343.5
Busuanga|907.5
Basilan|1280
Jolo|892
Masbate|3268
Marinduque|959.3
Catanduanes|1511
Coron Island|7
Biliran|555.4
Dinagat|802
Bantayan|78.6
Malapascua|2.5
Panglao|80.1
Guimaras|604.6
Culion|400
Balabac|216
Tawi-Tawi|366
Homonhon|20
Limasawa|5.7
Batanes|219|Batan Island
Sabtang|24.4
Itbayat|83.1
Phu Quoc|589
Cat Ba|285
Con Dao|76|Con Son
Ly Son|10
Cham Islands|15
Ko Phi Phi|28|Phi Phi Islands
Ko Tao|21
Ko Pha-ngan|168|Koh Phangan
Ko Chang|217
Ko Lanta|111
Ko Lipe|2.3
Ko Samet|13.1
Ko Kut|105
Ko Tapu|0.001|James Bond Island
Ko Panyi|0.02|Koh Panyee
Similan Islands|15
Surin Islands|24.4|Mu Ko Surin
Ko Kret|3
Rattanakosin|1.5|Rattanakosin Island
Koh Rong|78
Koh Rong Sanloem|28
Koh Kong Island|26
Sipadan|0.13
Labuan|91.6
Pangkor|18
Redang|25|Pulau Redang
Perhentian Islands|26
Mabul|1.5
Gaya Island|15.35
Banggi|440.7
Sentosa|4.71
Pulau Ubin|10.19
Pedra Branca|0.008
Nusa Penida|202.8
Nusa Lembongan|8
Gili Islands|3.65|Gili Trawangan
Madura|4250
Bangka|11693|Bangka Island
Belitung|4800
Morotai|2337
Tidore|120
Banda Islands|172
Banda Neira|15
Run|3|Pulau Run
Buru|9505
Alor|2864
Rote|1280|Rote Island
Weh|156|Weh Island
Mentawai Islands|6033
Siberut|4030
Biak|2602
Yapen|2278|Yapen Island
Waigeo|3155
Misool|2034
Raja Ampat|40000|Raja Ampat Islands
Bunaken|8.08
Lembeh|50|Lembeh Island
Derawan|4.36
Maratua|24.14
Kakaban|4.7|Kakaban Island
Karimunjawa|71.2|Karimun Jawa
Nusakambangan|121
Wakatobi|1390|Tukang Besi Islands
Togian Islands|372
Buton|4408
Muna|2889|Muna Island
Selayar|903.5|Selayar Island
Sangihe|461|Sangihe Island
Talaud Islands|1250
Natuna|1720|Natuna Besar
Riau Islands|8201
Bawean|199
Rinca|198
Padar|21
Moyo|320|Moyo Island
Saparua|60.14|Saparua Island
Obi|3111|Obi Island
Bacan|1900|Bacan Island
Kai Islands|1438.68
Aru Islands|8402
Tanimbar Islands|5498
Wetar|3624
Enggano|400.6
Simeulue|1838
Great Nicobar|1044
Car Nicobar|127
Nicobar Islands|1841
Havelock Island|113.93|Swaraj Dweep
Neil Island|13.68|Shaheed Dweep
North Sentinel Island|59.67
Little Andaman|734
Barren Island|8.1
Narcondam|6.8|Narcondam Island
Elephanta Island|10
Salsette|619|Salsette Island
Diu|40
Majuli|352
Sriharikota|180
Pamban Island|65.475|Rameswaram Island
Srirangam|45.242
Divar|6
Chorao|15.79
Beyt Dwarka|27|Bet Dwarka
Sagar Island|300|Ganga Sagar
Lakshadweep|32
Kavaratti|4.22
Agatti|3.842
Bangaram|2.63
Minicoy|4.8
St. Mary's Islands|0.5
Netrani|0.0989|Netrani Island
Munroe Island|13.4
Willingdon Island|26.15
Vypin|82.5|Vypin Island
Umananda|0.0092|Umananda Island
Mannar Island|130
Delft Island|50|Neduntheevu
Nainativu|6.4
Taprobane|0.0081|Taprobane Island
Katchatheevu|1.6
Bhola|3403|Bhola Island
St. Martin's Island|3|Saint Martins Island
Maheshkhali|388
Bhasan Char|40
Sandwip|762
Hatiya|1400
Nijhum Dwip|163
Hulhumale|4
Maafushi|0.94
Addu Atoll|20|Seenu Atoll
Fuvahmulah|5.13
Ari Atoll|22.85|Alifu Atoll
Baa Atoll|27.35
Vaadhoo|0.66
Ramree|1350|Ramree Island
Cheduba|538|Manaung Island
Coco Islands|4.7
Mergui Archipelago|10000|Myeik Archipelago
Lampi|205|Lampi Island
Astola|6.7|Jezira Haft Talar
Manora|2.822
Churna|2|Churna Island
Qeshm|1491
Kish|91.5|Kish Island
Hormuz|42|Hormuz Island
Kharg|25|Kharg Island
Abu Musa|12.8|Abu Musa Island
Greater Tunb|10.3
Lavan|68.5|Lavan Island
Ashuradeh|6.5|Ashuradeh Island
Failaka|43|Failaka Island
Bubiyan|863
Muharraq|18|Muharraq Island
Hawar Islands|51.6
Masirah|649|Masirah Island
Yas Island|25
Saadiyat|27|Saadiyat Island
Palm Jumeirah|25
The World|9.3|The World Islands
Sir Bani Yas|87
The Pearl|4|Pearl-Qatar,The Pearl-Qatar
Arwad|0.2
Tiran|80|Tiran Island
Farasan Islands|700
Dahlak|900|Dahlak Kebir,Dahlak Archipelago
Kamaran|181
Perim|13
Elephantine|1.44
Philae|0.014
Gezira|3|Zamalek
Pharos|1.03
Giftun|5.4|Giftun Island
Warraq|7|Warraq Island
Kerkennah|160|Kerkennah Islands
Mogador|0.03|Essaouira Island
Lamu|28|Lamu Island
Mombasa Island|13
Kilwa Kisiwani|3
Ilha de Mocambique|3.12|Mozambique Island
Bazaruto|37|Bazaruto Island
Ibo|5|Ibo Island
Quirimbas|400|Quirimbas Archipelago
Inhaca|52|Inhaca Island
Likoma|18|Likoma Island
Idjwi|340
Ukerewe|530|Ukerewe Island
Bugala|288|Bugala Island
Ssese Islands|460|Sese Islands
Migingo|0.002|Migingo Island
Rubondo|240|Rubondo Island
Changuu|0.08|Prison Island
Mnemba|0.15|Mnemba Island
Chumbe|0.15|Chumbe Island
Anjouan|424
Moheli|211|Mwali
Nosy Boraha|115|Sainte Marie
Nosy Komba|20
Ile aux Cerfs|0.87
Silhouette|20|Silhouette Island
Curieuse|2.9
Desroches|3.6
Fregate|2.19|Fregate Island
Tromelin|1|Tromelin Island
Europa Island|28
Cargados Carajos|1.3|Saint Brandon
Agalega|26|Agalega Islands
Chagos|60|Chagos Archipelago
Diego Garcia|27
Cocos Islands|14|Cocos Keeling Islands
Manitoulin|2766|Manitoulin Island
Anticosti|7943|Anticosti Island
Haida Gwaii|10180|Queen Charlotte Islands
Graham Island|6361
Salt Spring Island|182.15
Bowen Island|51.4
Quadra Island|310
Campobello Island|33.5
Grand Manan|137|Grand Manan Island
Ile d'Orleans|192|Isle of Orleans
Toronto Islands|2.4
Pelee Island|42
Wolfe Island|124
Thousand Islands|50
Goat Island|0.28|Goat Island Niagara
Liberty Island|0.049
Roosevelt Island|0.586
Governors Island|0.72
Fire Island|66
Block Island|25
Aquidneck Island|96|Rhode Island
Mount Desert Island|280|Mount Desert
Monhegan|2.3|Monhegan Island
Chappaquiddick|20|Chappaquiddick Island
Assateague Island|96.5
Tangier Island|3
Hatteras Island|161
Ocracoke|23.36|Ocracoke Island
Hilton Head Island|108.6
Kiawah Island|40
Tybee Island|8
St. Simons Island|46.7|Saint Simons Island
Jekyll Island|25.5
Cumberland Island|55.5
Amelia Island|21
Merritt Island|116
Key Largo|76.5
Key Biscayne|6.16
Marco Island|24.2
Sanibel|33|Sanibel Island
Captiva|2|Captiva Island
Anna Maria Island|15
Padre Island|182
South Padre Island|21
Dauphin Island|16
Avery Island|8
Kelleys Island|11
South Bass Island|4.5
Beaver Island|138
Madeline Island|40.7
Apostle Islands|173
Belle Isle|3|Belle Isle Park
Angel Island|3.05
Treasure Island|1.24
San Clemente Island|145
San Miguel Island|37
Santa Rosa Island|215
Anacapa|2.9|Anacapa Island
Vashon|100|Vashon Island
Bainbridge Island|70
Whidbey Island|435
Orcas Island|148
San Juan Islands|375
Mercer Island|15.9
Unalaska|3959|Unalaska Island
Attu|893|Attu Island
Adak|741|Adak Island
Kiska|278
St. Lawrence Island|4291
Nunivak|4212|Nunivak Island
Admiralty Island|4168
Baranof Island|4237
Chichagof Island|5388
Little Diomede|7.3|Little Diomede Island
Kahoolawe|116.3
Molokini|0.0155
Ford Island|1.5
Laysan|4.1
Hawaiian Islands|16636
Johnston Atoll|2.8
Palmyra Atoll|12
Howland Island|1.6
Baker Island|1.4
Jarvis Island|4.5
Kure Atoll|0.71
Nihoa|0.69
Vieques|135
Culebra|30
Isla de la Juventud|2200
Cayo Coco|370
Cayo Largo|37|Cayo Largo del Sur
Gonave|743|La Gonave,Gonave Island
Tortuga|180|Ile de la Tortue
Saona|110|Saona Island
Bimini|9
Cat Island|388
San Salvador Island|163
Harbour Island|8.1
Inagua|1544|Great Inagua
Little Cayman|28.5
Cayman Brac|38
Cayman Islands|264
Utila|41
Guanaja|56
Ambergris Caye|42
Caye Caulker|3.3
Corn Islands|12.5
Providencia|17|Providencia Island
Isla Colon|61|Colon Island
Taboga|3|Taboga Island
San Blas Islands|36|Guna Yala
Saint Barthelemy|21|St Barts,St Barths
Saba|13
Sint Eustatius|21|Statia
Anegada|38
Jost Van Dyke|8
Saint John|50|St John USVI
Marie-Galante|158
Les Saintes|13|Iles des Saintes
Bequia|18
Mustique|5.7
Canouan|7.5
Union Island|8.4
Carriacou|34
Holbox|40|Holbox Island
Isla Contoy|5.8
Tiburon Island|1208|Isla Tiburon
Guadalupe Island|244
Socorro Island|132
Clipperton Island|6
Turks and Caicos|948
Virgin Islands|346
Lesser Antilles|25000
Greater Antilles|210000
Leeward Islands|3055
Windward Islands|3555
Grenadines|60
Ilhabela|348
Santa Catarina Island|424|Florianopolis Island
Itamaraca|65
Ilha do Mel|27.5
Itaparica|239
Boipeba|51
Tinhare|47|Tinhare Island,Morro de Sao Paulo
Bananal Island|19162
Ilha do Governador|39.6
Paqueta|1.2|Paqueta Island
Trindade|10.1|Trindade Island
Atol das Rocas|3.6
Abrolhos|6|Abrolhos Islands
Isla Magdalena|0.9|Magdalena Island
Navarino|2473|Navarino Island
Dawson Island|2050|Isla Dawson
Wellington Island|5556
Isla de los Estados|534|Staten Island (Argentina)
Martin Garcia|1.84|Martin Garcia Island
Alejandro Selkirk|49.5|Alejandro Selkirk Island
Mocha Island|48|Isla Mocha
Puna Island|920|Isla Puna
Isla de la Plata|12
Espanola Island|60|Hood Island
Genovesa|14|Genovesa Island
Bartolome Island|1.2|Bartolome
Pinta Island|60
North Seymour|1.9|North Seymour Island
Daphne Major|0.34
Darwin Island|1.1
Wolf Island|1.3
Baltra|27|South Seymour Island
Santa Fe Island|24
Ballestas Islands|0.12
San Lorenzo Island|16.48
Taquile|5.72
Amantani|9.28|Amantani Island
Isla del Sol|14.3
Isla de la Luna|3
Gorgona Island|26
Malpelo|1.2|Malpelo Island
Rosario Islands|5.6|Islas del Rosario
Santa Cruz del Islote|0.012
Coche|63|Coche Island
Cubagua|24
La Tortuga|156|La Tortuga Island
Los Roques|40|Los Roques Archipelago
La Orchila|27.6
Aves Island|0.04
Chacachacare|4
Little Tobago|1.2
Devils Island|0.14
Iles du Salut|1|Salvation Islands
Isla de Flores|0.11
Gorriti|0.32|Isla Gorriti
Great Barrier Island|285
Rangitoto|5.5|Rangitoto Island
Tiritiri Matangi|2.2|Tiritiri Matangi Island
Kawau|20|Kawau Island
D'Urville Island|158
Kapiti Island|19.65
Matiu/Somes Island|0.25|Somes Island
Codfish Island|14|Whenua Hou
Whakaari/White Island|3.24|White Island
Mokoia|1.35|Mokoia Island
Poor Knights Islands|2.4
Urupukapuka|2|Urupukapuka Island
Tongatapu|260
Vava'u|121
'Eua|87.4
Lifuka|11.4
Niuafo'ou|34
Tofua|55.6
Hunga Tonga|2|Hunga Tonga-Hunga Haapai
Taveuni|434
Kadavu|411|Kadavu Island
Ovalau|106
Beqa|36
Malolo|4
Yasawa Islands|135|Yasawa
Rotuma|43
Rabi|66.3|Rabi Island
Monuriki|0.4
Tavarua|0.05
Denarau|2.5|Denarau Island
Mamanuca Islands|17
Lau Islands|487
Malakula|2041
Pentecost|490|Pentecost Island
Ambrym|678
Ambae|402
Erromango|887
Aneityum|160
Grande Terre|16372|Grande Terre New Caledonia
Lifou|1150
Mare|642
Ouvea|132
Isle of Pines|152|Ile des Pins
Loyalty Islands|1981
Malaita|4225
Santa Isabel (Solomon Islands)|4014
Choiseul|3837|Choiseul Island
Makira|3188|San Cristobal
New Georgia|2037
Rennell|660|Rennell Island
Savo|32|Savo Island
Tulagi|1.98
Gizo|16|Gizo Island
Kolombangara|700
Vella Lavella|629
Vanikoro|173
Tikopia|5
Anuta|0.4
Ontong Java|12|Ontong Java Atoll
Kennedy Island|0.01
Buka|494|Buka Island
Karkar|367|Karkar Island
Manam|10
Goodenough Island|685
Fergusson Island|1437
Kiriwina|300|Trobriand Island
Trobriand Islands|450
Woodlark Island|800|Muyua
Misima|186|Misima Island
Rossel Island|280
Samarai|0.5|Samarai Island
Daru|13|Daru Island
Lihir|194|Lihir Island
New Hanover|1200|Lavongai
Los Negros|50|Los Negros Island
Yos Sudarso Island|10000|Kolepom,Pulau Dolak
Numfor|322
Yap|100.3
Chuuk|127.4|Truk Islands
Weno|18.8
Kosrae|109.6
Enewetak|5.85|Enewetak Atoll
Rongelap|8|Rongelap Atoll
Ebeye|0.36
Koror|7
Peleliu|13
Angaur|8.4
Rock Islands|47
Tarawa|31
Betio|1.5
Butaritari|13.5
Banaba|6.3|Ocean Island
Fanning Island|33.7|Tabuaeran
Canton Island|6.5|Kanton Island
Nikumaroro|4.1
Malden Island|39
Caroline Island|5.6|Millennium Island
Funafuti|2.4
Nanumea|3.87
Atafu|2.03
Nukunonu|4.7
Fakaofo|2.63
Tokelau|12.2
Manono|2.9|Manono Island
Ofu|5.2|Ofu-Olosega
Ta'u|44.31
Rose Atoll|0.084
Swains Island|1.9
Rota|85.38
Pagan|47.24|Pagan Island
Northern Mariana Islands|464
Tuamotus|850|Tuamotu Islands
Gambier Islands|36
Austral Islands|148
Huahine|74.8
Raiatea|171.5
Tahaa|82.9
Maupiti|11.4
Tikehau|20
Fakarava|16
Hiva Oa|320
Ua Pou|105.4
Tubuai|45
Rurutu|32
Mangareva|15.4
Rapa Iti|40.5
Atiu|26.9
Mangaia|51.8
Penrhyn|9.8|Penrhyn Island
Palmerston Island|2|Palmerston
Wallis|60.2|Uvea
Futuna|46
Henderson Island|37.3
Kuril Islands|10503
Iturup|3175
Kunashir|1490|Kunashir Island
Shikotan|225
Paramushir|2053
Bering Island|1667
Russky Island|97.6
Big Diomede|29
Olkhon|730
Ryukyu Islands|3454
Iriomote|289.3|Iriomote Island
Taketomi|5.42|Taketomi Island
Miyako-jima|158.9|Miyakojima
Kume|63.36|Kume Island
Zamami|6.66|Zamami Island
Tokashiki|15.31|Tokashiki Island
Ie Island|22.75
Hateruma|12.77|Hateruma Island
Yonaguni|28.88|Yonaguni Island
Kerama Islands|30
Yaeyama Islands|590
Amami Oshima|712.35
Tokunoshima|247.85
Okinoerabu|93.65|Okinoerabujima
Yoron|20.58|Yoron Island
Tanegashima|444.99
Kuchinoerabu|35.3|Kuchinoerabujima
Tsushima|708.7|Tsushima Island
Iki|138.6|Iki Island
Goto Islands|420
Hirado|235.31|Hirado Island
Amakusa|866|Amakusa Islands
Shodoshima|153.3
Naoshima|8.14
Teshima|14.62
Ikuchijima|33.7
Omishima|64.5
Innoshima|33.85
Etajima|43.5
Okunoshima|0.7|Rabbit Island
Enoshima|0.38
Odaiba|15
Sarushima|0.06
Dejima|0.15
Shikanoshima|6
Ainoshima|1.2
Tashirojima|3.14|Cat Island Japan
Aoshima|0.51|Cat Island Ehime
Kinkasan|9.6
Okinoshima|0.97
Oki Islands|346
Rebun|81.66|Rebun Island
Rishiri|182.11|Rishiri Island
Okushiri|142.7|Okushiri Island
Izu Islands|297
Izu Oshima|91.06
Niijima|23.17
Kozushima|18.19
Miyakejima|55.5
Hachijojima|62.52|Hachijo-jima
Aogashima|8.75
Ogasawara Islands|84|Bonin Islands
Chichijima|23.45
Hahajima|20.2
Minamitorishima|1.51|Marcus Island
Okinotorishima|0.00847
Senkaku Islands|7|Diaoyu Islands
Zhoushan|502.65|Zhoushan Island
Putuoshan|12.5|Mount Putuo
Chongming|1267|Chongming Island
Xiamen Island|132.5
Gulangyu|1.88
Kinmen|151.7|Quemoy
Matsu Islands|29.6
Penghu|141|Pescadores
Orchid Island|45|Lanyu
Green Island (Taiwan)|16.2
Xiaoliuqiu|6.8
Guishan Island|2.85
Cijin|1.46|Cijin Island
Meizhou Island|14.35
Pingtan|267.13|Pingtan Island
Nan'ao Island|111.03
Weizhou|24.74|Weizhou Island
Wuzhizhou|1.48|Wuzhizhou Island
Liugong Island|3.15
Changdao|13|Miaodao Islands,Changshan Islands
Coloane|7.6
Taipa|7.9
Hengqin|106.46
Pratas|1.74|Dongsha Islands
Woody Island|2.1|Yongxing Island
Itu Aba|0.51|Taiping Island
Thitu|0.37|Pag-asa Island
Fiery Cross Reef|2.74
Mischief Reef|5.58
Scarborough Shoal|0.0015
Spratly Islands|5
Paracel Islands|7.75
Baengnyeong|45.83|Baengnyeong Island
Yeonpyeong|7.3|Yeonpyeong Island
Jindo|367.7|Jindo Island
Wando|12.15|Wando Island
Namhae|357|Namhae Island
Yeongjong|122.6|Yeongjong Island
Muuido|9.712
Silmido|0.089
Udo|6.18|Udo Island
Marado|0.3
Hongdo|6.47|Hongdo Island
Heuksando|19.7
Anmyeon|111.31|Anmyeondo,Anmyeon Island
Wolmido|0.663
Oedo|0.09|Oedo Botania
Hansando|21.32|Hansan Island
Dolsan|63|Dolsan Island,Dolsando
Odongdo|0.12
Coney Island|4
Rikers Island|1.67
Navassa Island|5.4
Hart Island|0.53
Plum Island|3.4
City Island|1.02
Ketron Island|0.88
San Nicolas Island|58.92
Gardiners Island|13.43
Randalls Island|2.09|Wards Island,Randalls and Wards Islands
Figure Eight Island|5.26
French Frigate Shoals|0.25
Cuttyhunk Island|2.35
Machias Seal Island|0.08
Zug Island|2.41
Elizabeth Islands|34.55
Bois Blanc Island|91.4
Pollepel Island|0.05
Terminal Island|11.56
Naushon Island|19.17
Anatahan|33.9
St. Matthew Island|375
McNeil Island|17.61
Camano Island|245.79
Grand Island|86.22
Antelope Island|109
Washington Island|60.89
Morris Island|3.4
Alexander Archipelago|35000
Necker Island|0.18
Johns Island|216.8
Shemya|15.29
Amchitka Island|308.6
Matinicus Isle|25.64
Unimak Island|4119
Lopez Island|77.21
Lisianski Island|1.56
Lummi Island|23.97
Gardner Pinnacles|0.02
Isle of Palms|14.08
Kent Island|81.9
Malaga Island|0.17
Sauvie Island|84.82
Semisopochnoi Island|221.59
Tern Island|0.11
Fox Island|16.55
Kaula|0.64|Ka'ula
Prudence Island|14.43
Spectacle Island|0.46
Annette Island|332.5
Santa Barbara Island|2.63
Fannette Island|0.01
Lehua|1.03
Nomans Land|2.48
Wallops Island|15.5
Mokolii|0.05|Chinaman's Hat
Sugar Island|128.05
Fidalgo Island|106.7
Revillagigedo Island|2965
Amatignak Island|36.52
Anderson Island|36.59
Robins Island|1.76
North Manitou Island|57.88
Agrihan|43.51
Amaknak Island|8.5
Atka Island|1048.76
Hat Island|1.79
Shaw Island|19.94
Umnak|1793
Marquesas Keys|6.58
Tilghman Island|6.57
Alamagan|13
Fremont Island|11.91
Cypress Island|22.27
Round Island|1.53
Wadmalaw Island|108.5
Wild Horse Island|8.75
Grosse Ile|24.86
King Island|6.47
St. Catherines Island|90.1
Dall Island|655
Farallon de Pajaros|2.3
Jamestown Island|6.32
Last Island|9.39
Maro Reef|1.94
Blake Island|4.56
Harstine Island|48.3
Pelican Island|16.58
Asuncion Island|7.9
Conanicut Island|24.46
Douglas Island|199.24
South Manitou Island|21.44
Chambers Island|10.04
Great Sitkin Island|245
Middle Bass Island|3.26
Neebish Island|55.68
Wrangell Island|560
Afognak Island|1809
Bahia Honda Key|2.12
Deal Island|13.91
Spruce Island|46.07
Decatur Island|9.13
Matagorda Island|157.25
Valcour Island|3.92
Folly Island|48.3
Kuiu Island|1962
Tuluwat Island|1.13
Akutan Island|334
Carleton Island|7.25
Garden Island|20.2
Isle of Hope|5.9
Nashawena Island|7.08
No Name Key|4.04
Skidaway Island|46.18
Wilmington Island|24.68
Bird Key|12.7
Fleming Key|1.15
Marsh Island|258.95
Stuart Island|7.46
Wassaw Island|40.68
Blount Island|6.63
Guguan|3.87
High Island|14.14
Kupreanof Island|2813
Montague Island|722
Paoha Island|9.06
Raspberry Island|192
Sarigan|4.5
Agattu|221.54
Blakely Island|16.85
Dodge Island|2.1
Gravina Island|246
Protection Island|2.67
Puget Island|20.13
Barnum Island|3.28
Barter Island|14
Buldir Island|19.29
Chirikof Island|114.7
Hog Island|8.39
Aguiguan|7.1
Fisherman Island|7.49
Galloo Island|8.96
Pasque Island|3.45
Shuyak Island|168.3
Tanaga Island|529
Harbor Island|3.93
Kayak Island|73.7
Marquette Island|58.79
Nelson Island|2180
Sherman Island|56.66
Capers Island|4.3
Credit Island|1.7
Grassy Key|3.65
Grenadier Island|5.22
Hall Island|16
Kruzof Island|433.7
Nonamesset Island|1.4
Whitemarsh Island|17.24
Akun Island|167
Aunuu|1.52|Aunu'u
Etolin Island|870
Hinchinbrook Island|445.4
Louds Island|38.8
Mitkof Island|546
Sears Island|3.8
Seguam Island|207.3
Selden Island|1.65
Sinclair Island|4.1
Sitkalidak Island|300.84
Stock Island|3.67
Yunaska Island|173
Gunnison Island|4.8
Kasatochi Island|5.05
Kosciusko Island|444.4
Pleasant Island|49
Semichi Islands|26
Amak Island|15
Bird Island|1.68
Delarof Islands|165.35
Diamond Island|1.29
Duck Key|1.68
Dutch Island|7.92
North Hutchinson Island|61.8
Portage Island|3.62
Talahi Island|3.83
Unga Island|442
Zarembo Island|474.3
Amygdaloid Island|2.46
Carrington Island|4.8
Chuginadak Island|165.76
Fir Island|40.14
Gareloi Island|67
Hagemeister Island|300
Kanaga Island|480
Popof Island|91.8
Sitkinak Island|235.51
Ulak Island|34.61
Yakobi Island|213.3
Alaid Island|5
Amlia|446
Arey Island|11
Croil Island|3.22
Egg Island|1.26
Galop Island|2.73
Grahams Island|23
Greco Island|3.31
Kagalaska Island|164
Knight Island|277.2
Little Kiska Island|4.83
Marmot Island|45.2
Nagai Island|291.5
Nine-Mile Island|1.84
Ponce de Leon Island|55
Stretch Island|1.13
Yukon Island|2.5
Aiaktalik Island|20
Andronica Island|15.26
Avatanak Island|30
Big Koniuji Island|90.4
Browns Island|2.41
Canyon Island|1.3
Catherine Island|86.94
Chamisso Island|1.8
Dewberry Island|3.96
Grindall Island|3.88
Haenke Island|1.2
Korovin Island|66.98
Leque Island|1.3
Nuka Island|60.35
Ogliuga Island|5
Oglodak Island|3.5
Sanak Islands|157.62
Sedanka Island|103.3
Takli Island|10
Tugidak Island|173.14
Uganik Island|156.7
Unalga Island|28.5
Warren Island|47.19
Whale Island|39.24
Mills Island|2.05
Kigigak Island|31.84
Bendel Island|9.86
Kavalga Island|9
Karpa Island|1.92
U Thant Island|0.01
Fishers Island|12.86
Fisher Island|0.69
Shelter Island|75.39
Parris Island|50.76
Discovery Island|0.05
Sullivan's Island|8.91
Morgan Island|18.17
Pawleys Island|2.57
Smith Island|23.77
Bald Head Island|15.18
Star Island|0.35
Peaks Island|2.91
Yerba Buena Island|0.8
Goose Island|0.65
Ossabaw Island|105.22
Edisto Island|175.5
Seabrook Island|18.29
Fripp Island|11.89
Palm Island|0.33
Hoffman Island|0.04
Chebeague Island|63.61
Frye Island|4.14
Spieden Island|2.09
Swan's Island|32.14
Green Island (New York)|2.42
Virginia Key|3.5
Harkers Island|9.97
Hayden Island|4.38
Indian Island|11.29
Bethel Island|14.16
Waldron Island|11.9
North Bass Island|2.79
Dewees Island|4.86
French Island|6.53
Mason's Island|2.43
Cobb Island|2.39
Davis Island|120
Cousins Island|5.14
Detroit Island|2.58
Hawadax Island|26.7
Herron Island|1.23
Westport Island|36.88
Verona Island|22.71
Anaho Island|2.57
Big Coppitt Key|3.88
Bradford Island|8.79
Kreamer Island|12.14
Lowes Island|8.19
Ryer Island|47.35
Broomes Island|1.91
Ritta Island|14.16
Spesutie Island|6.07
Avoca Island|64.75
Lime Island|3.64
Littlejohn Island|1.89
McDonald Island|23.88
Snead Island|1.48
The Jug|11.53
Bouldin Island|23.88
Jones Tract|48.56
Mandeville Island|22.26
Van Sickle Island|40.47
Venice Island|12.55
Quimby Island|3.19
Twitchell Island|12.14
Woodward Island|7.24
Hastings Tract|25.9
Atlas Tract|1.46
Moore Tract|6.23
Rockall|0
Eilean Donan|0
Isle of Portland|11.5
Gruinard Island|1.96
Burgh Island|0.14
Papa Stronsay|0.74
Eel Pie Island|0.05
Bishop Rock|0
Foula|12.65
Tanera Mor|3.1
Osea Island|1.5
North Rona|1.09
Drake's Island|0.03
Garnish Island|0.15
Papa Westray|9.18
Sula Sgeir|0.15
Ireland's Eye|0.22
Stroma|3.75
Flat Holm|0.35
Inchconnachan|0.35
Seil|13.29
Puffin Island|0
Cramond Island|0.08
Steep Holm|0.2
Inchkeith|0.23
Looe Island|0
St Agnes|3.66
Easdale|0.25
Inch Kenneth|0.55
Thorney Island|0
Bere Island|17.68
Deadman's Island|0
Muckle Flugga|0.02
Calf of Man|2.5
Kerrera|12.14
Sherkin Island|5
Haulbowline|0.35
Mingulay|6.4
Berneray|10.1
Inchgarvie|0.01
Inishturk|6
Piel Island|0.02
Taransay|14.75
Omey Island|2.17
Great Bernera|21.22
Lamb|0
Bull Island|0
Vatersay|9.6
Fota Island|0
Great Island|53.1
Ramsey Island|3.2
Whiddy Island|4.17
Fetlar|40.78
North Ronaldsay|6.9
Papa Stour|8.28
Rousay|48.6
Inis Cealtra|0
Stronsay|32.75
Bressay|28.05
Bryher|1.22
Eday|27.45
Inch Island|13
South Rona|9.3
Inchmurrin|1.2
Inishfree|1.55
Luing|14.3
Whalsay|19.7
Inchmickery|0
Inishark|2.49
Shuna Island|1.55
Gola Island|0
Heir Island|1.5
Skokholm|1
South Ronaldsay|49.8
Vaila|3.27
Boa Island|0
Furzey Island|0
Mutton Island|0
Tagg's Island|0
Cruit Island|0
Gometra|4.25
Scalpay|6.53
Barra Head|2.04
Little Cumbrae|3.13
Monkey Island|0
Scarba|14.74
Handa Island|3.09
Inchmarnock|2.66
Mousa|1.8
Northey Island|0
Scarp|10.45
Soay|10.36
Horsey Island|0
Scolt Head Island|0
Wallasea Island|0
Craigleith|0
Flotta|8.76
Gorumna|0
Magna Carta Island|0
Oronsay|5.43
Peel Island|0
Tuskar Rock|0
Inishbiggle|0
Sully Island|0
Eriska|1.45
Hestan Island|0
Inishail|0
Isle of Ewe|3.09
King's Island|0
Owey Island|1.21
Pabbay|8.2
Ram's Island|0
Thames Ditton Island|0
Two Tree Island|2.59
Asparagus Island|0
Egilsay|6.5
Horsea Island|0
Inchydoney|0
Isle of Noss|3.43
Rutland Island|0
Temple Island|0
Achillbeg|1.32
Burray|9.03
Caquorobert|0
Cava|1.07
Chapel Island|0
Desborough Island|0
Eilean Munde|0
Graemsay|4.09
Horse Isle|0
Lunga|2.5
St Michael's Isle|0
St Patrick's Island|0
West Burra|7.43
Wyre|3.11
Ash Island|0
Baleshare|9.1
Carna|2.13
Eagle Island|0
Eilean Domhnuill|0
Inchgalbraith|0
Isle Maree|0
Muckle Roe|17.73
Oliver's Island|0
Ortac|0
Raven's Ait|0
Stanlow Island|0
Vallay|2.6
Ynys Dulas|0
Alney Island|0
Blackrock Island|0
Burntwick Island|0
Eilean nan Ron|1.38
Fara|2.95
Fraoch Eilean|0
Gairsay|2.4
Hinba|0
Isleworth Ait|0
Little Island|1.7
Lusty Beg Island|0
Mullion Island|0
North Stack|0
Pabay|1.22
Pednathise Head|0
Rotten Island|0
Scariff Island|1.48
Shenick Island|0
South Walls|11
Torsa|1.13
Trowlock Island|0
Alloa Inch|0
Bartragh Island|1.93
Boreray|1.98
Capel Island|0
Corporation Island|0
Dore Holm|0
Ensay|1.86
Fenit Island|0
Foulney Island|0
Fry's Island|0
Gateholm|0
Glover's Island|0
Ham Island|0
Hamhaugh Island|0
Havergate Island|1.08
Island Eddy|0
Longships|0
Neish Island|0
Potton Island|0
Priest Island|1.22
Read's Island|0
Sandray|3.85
St Margaret's Island|0
Staple Island|0
Trondra|2.75
Whitton Island|1.2
East Burra|5.15
Eilean Subhainn|1.18
Hildasay|1.08
Housay|1.63
Hunda|1
Isle Ristol|2.25
Little Bernera|1.38
Longa Island|1.26
Pabaigh Mor|1.01
Ronay|5.63
Seaforth Island|2.73
Uyea|2.05
Vementry|3.7
Foulness Island|0
Lettermullen|0
Shapinsay|29.48
Donauinsel|3.9
Neuwerk|3
Nordstrandischmoor|1.9
Trischen|1.8
Mellum|3
Memmert|2.12
Pheasant Island|0.01
Flevopolder|970
Ile Sainte-Marguerite|2.1
Levant Island|10
Ile Vierge|0.06
Ile de la Jatte|0
Gavrinis|0.3
Goeree-Overflakkee|422.35
Cavallo|1.2
Cezembre|0
Port-Cros|7
Ile d'Or|0
Ile de Nantes|0
Houat|2.91
Hoedic|2.08
Rottumerplaat|6
Noorderhaaks|5
IJsselmonde|163
Rottumeroog|2.65
Ile Illiec|0
Hoeksche Waard|323.74
Ratonneau|0
Voorne-Putten|220
Ile Saint-Germain|0
Ile des Impressionnistes|0
Ile-Grande|3
Poveglia|0.08
Isola Bella|0.2
Es Vedra|0
Pianosa|10.25
Alboran Island|0.07
San Giorgio Maggiore|0.1
San Lazzaro degli Armeni|0.03
Isola di San Michele|0.18
Linosa|5.4
Benidorm Island|0.07
Isola del Garda|0.07
Capraia|19.33
Isola Madre|0
Alicudi|5.2
Dragonera|2.88
Isla Canela|1.5
Isola dei Pescatori|0.03
San Giulio Island|0
Budelli|1.6
Armona Island|0
Marettimo|12.3
Filicudi|9.49
Levanzo|5.82
Deserta Grande Island|10
Palmaria|1.89
Tavira Island|0
Il Gallo Lungo|0
Palmarola|1.36
Isla de La Cartuja|0
Culatra Island|0
Gaiola Island|0
Pellestrina|2
Ons Island|4.46
S'Espalmador|2
Baleal Island|0
Sant'Elena|0
Giannutri|2.6
Barreta Island|0
Barbana|0
Sant'Erasmo|3.26
A Toxa Island|1.1
Castelli di Cannero|0
Isola Sacra|0
Bugio Island|3
Santo Stefano|3
Spargi|4.2
Cacela Island|0
Isla del Trocadero|5.25
Island of San Simon|0
Selvagem Grande Island|2.45
Izaro Island|0
Pessegueiro Island|0
Salvora|1.9
Ermal Island|0
Illa Conillera|1
Utoya|0.11
Surtsey|1.4
Faro|113.3
Market|0.03
Mors|368
Ellidaey|0.45
Heimaey|13.4
Grimsey|5.3
North Jutlandic Island|4685
Kvitoya|682
Saltholm|16
Peberholm|1.3
Videy|1.6
Kolbeinsey|0
Sprogo|1.54
Riddarholmen|0
Saaminginsalo|1069
Edgeoya|5073
Soisalo|1635
Soroya|811
Helgeandsholmen|0
Ingaro|63.26
Lauttasaari|3.75
Moskenesoya|186
Mando|8.4
Pellinki|0
Utsira|5.9
Jussaro|0
Vagsoy|59.1
Barentsoya|1288
Lovund|4.9
Vallisaari|1.1
Varmdo|181.4
Austvagoya|526.7
Flakstadoya|110
Froson|41
Hakoya|3.69
Lovon|23.22
Tasinge|70
Vaeroya|15.7
Adelso|26.08
Danes Island|40.6
Papey|2
Tromoya|28.6
Ljustero|62.05
Replot|150
Rindo|4.46
Stromsborg|0
Vardoya|3.7
Bogo|13
Flatey|2.8
Hano|2.14
Kokkosaari|0
Langoya|850.2
Langoyene|0
Lilla Karlso|1.5
Mosken|1.5
Moster|12
Nyord|5
Orno|48.99
Osteroy|328
Tuno|3.52
Tysnesoya|198
Vestvagoya|411
Bastoy|2.23
Vaddo|128
Furillen|4
Giske|2.67
Godoya|10.9
Hidra|20.4
Hillesoya|1.8
Jomfruland|3.04
Kongsoya|191
Leka|57
Masnedo|1.68
Oro|14
Rebbenesoya|80.6
Runmaro|15
Sejero|12.36
Torso|62.03
Vega|108
Abel Island|13
Alden|3.4
Alnon|67.79
Andorja|135
Arnoya|276
Askoy|91.4
Avernako|5.86
Bleikoya|0
Donna|138
Endelave|13.2
Engeloya|69
Fedje|7.2
Fejo|16
Gavno|5.5
Haoya|0
Kinn|2.5
Kallandso|56.78
Landegode|30.3
Livo|3.3
Lyo|6.05
Prins Karls Forland|615
Seiland|583
Selja|1.6
Skaro|1.97
Svenskoya|137
Thuro|7.5
Tarno|1.15
Vanna|232
Vigra|20
Vikingen|0
Alvsnabben|0
Aebelo|2.09
Alro|7.5
Averoya|161
Baroya|13
Bolga|2.4
Bago|6.2
Bomlo|171
Ellingsoya|28
Eno|3.4
Femo|11.38
Finnoy|25
Faeno|3.9
Gimsoya|46.4
Gossa|46.5
Grytoya|108
Graso|93.26
Hadseloya|102
Helgoya|18.3
Herdla|1.6
Holsnoy|88.8
Ingmarso|5.96
Ingoya|18
Kvitsoy|2.3
Masoya|13.45
Nekselo|2.2
Otroya|75.5
Ringvassoya|663
Sandoya|3.8
Selaon|94.72
Skjervoya|11.73
Sula|59
Svartso|7.01
Tautra|1.5
Tjome|24.5
Tomma|47.3
Valderoya|6.5
Veierland|4.4
Veno|6.5
Veoya|6
Aedey|1.76
Hrisey|7.67
Kastellholmen|0
Ulvon Island|0
Hopen|47
Kungsholmen|0
Smola|216
Grinda|2
Skeppsholmen|0
Fur|21.8
Santahamina|4.28
Uto|1.54
Aspo|26.08
Moja|0
Yxlan|15
Aldra|24
Bjorko|63.7
Egholm|6
Kungshatt|1.9
Jurmo|0
Horn Island|0
Just Room Enough Island|0
Daniel Island|0
Daufuskie Island|0
Sea Island|0
Wizard Island|0
Pleasure Island|0
Sapelo Island|0
St. George Island|0
Isle au Haut|32.2
Topsail Island|0
North Dumpling Island|0
Gasparilla Island|0
Volvo Island|0
Tuckernuck Island|0
Johnson's Island|0
Rattlesnake Island|0
Harsens Island|0
Monomoy Island|0
Alameda|0
Dark Island|0
Bailey Island|0
Peanut Island|0
Ship Island|0
Guemes Island|0
Pine Island|0
Isle de Jean Charles|0
Penikese Island|0.3
Sand Island|0
Blennerhassett Island|0
Dog Island|0
Holland Island|0.32
Hutchinson Island|0
Ono Island|0
Wellesley Island|0
Jones Beach Island|0
Mustang Island|0
Heart Island|0
Muskeget Island|0
Squirrel Island|0
Brickell Key|0
Gwynn's Island|0
Knotts Island|0
Luna Island|0
Oak Island|0
Sucia Island|0
Boon Island|0
San Jose Island|0
James Island|0
Enders Island|0
Great Gull Island|0
Shooters Island|0
Davids Island|0.32
Gibson Island|0
Hawaii 2|0.02
Isle La Motte|43.2
Anastasia Island|0
Appledore Island|0
Bakers Island|0
Orr's Island|0
Bloodsworth Island|0
Cedar Island|0
Fenwick Island|0
Great Cranberry Island|0
Lido Key|0
Elliott Key|0
Maury Island|0
Useppa Island|0
Wheeling Island|0
Bar Island|0
Boca Chica Key|0
Bogue Banks|0
Poplar Island|0
Children's Island|0
Eastern Egg Rock Island|0.03
Great Diamond Island|0
Little Torch Key|0
Billingsgate Island|0
Charity Island|0.9
Craney Island|0
Falkner Island|0.01
Grindstone Island|0
Keewaydin Island|0
North Padre Island|0
Seavey's Island|0
Summerland Key|0
Anclote Key|0
Gaillard Island|0
Government Island|0
Middleton Island|0
Mon Louis Island|0
Pea Island|0
Constitution Island|0
Cushing Island|0
Doty Island|0
Gould Island|0
Jupiter Island|0
Perdido Key|0
Russell Island|0
Stansbury Island|0
Stony Island|0
Sugarloaf Key|0
Calumet Island|0
Clark's Island|0
Hoopers Island|0
House Island|0
Lady's Island|0
Little St. Simons Island|0
Manitou Island|0
Poverty Island|0
Seven Mile Island|0
Ballast Island|0
Boot Key|0
Cliff Island|0
Damariscove Island|0
Hart Miller Island|0
Horseshoe Island|0
Jewell Island|0
Long Key|0
Port Royal Island|0
Tinsley Island|0
Allan Island|0
Belvedere Island|0
Casey Key|0
Choate Island|0
Chouteau Island|0
Dosoris Island|0
Japonski Island|0
Long Beach Barrier Island|0
Mussel Rock|0
Samish Island|0
San Pablo Island|0
Waties Island|0
Badger's Island|0
Blakeley Island|0
Bustins Island|0
Caladesi Island|0
Cockspur Island|0
Coconut Island|0
Drayton Island|0
Jetty Island|0
Little Gasparilla Island|0
Manana Island|0
Moose Island|0
Mosenthein Island|0
Nixes Mate|0
Ragged Island|0
Sandspur Island|0
Sandy Island|0
St. Armands Key|0
Summer Island|0
Totten Key|0
Unity Island|0
Allen Island|0
Bay Island|0
Brazos Island|0
Brigantine Island|0
Butler Island|0
Crow Island|0
Eldred Rock|0
Elihu Island|0
Garrett Island|0.8
Great Spruce Head Island|0
Huckleberry Island|0
Petit Bois Island|0
Plantation Key|0
Silcox Island|0
Spinnaker Island|0
Squaxin Island|0
Veckatimest Island|0.07
Artificial Island|0
Atsena Otie Key|0
Boca Chita Key|0
Canarsie Pol|0
Center Island|0.7
Crane Island|0.96
Dismal Key|0
Estero Island|0
Gardiners Point Island|0
Gooseberry Island|0
Henry Island|0
Isle of Meadows|0.35
Latsch Island|0
Little Cranberry Island|0
Little Deer Isle|0
Lower Matecumbe Key|0
Ludlam Island|0
Negit Island|0
New Eddystone Rock|0
Sandy Point Island|0
Sebascodegan Island|0
Starve Island|0
Sutton Island|0
Van Schaick Island|0
Virginius Island|0
Apple Island|0
Blaine Island|0.32
Boca Grande Key|0
Brewer Island|0
Buffington Island|0
Callawassie Island|0
Coronation Island|0
Curtis Island|0
Don Pedro Island|0
East Island|0
Egg Rock|0
Grizzly Island|0
Middle Island|0
Mistake Island|0
Money Key|0
Mulberry Island|0
Pola Island|0
Ramrod Key|0
Sand Key|0
Soldier Key|0
Stockton Island|0
Sugar Loaf Island|0
Sutwik Island|0
Tinker's Island|0
Uncatena Island|0.49
Upper Matecumbe Key|0
Whiskey Island|0.97
Big St. Martin Island|0
Birch Island|0
Brannan Island|0
Buckeye Island|0
Campbell's Island|1.17
Carleton's Prize|0
Clover Island|0.06
Cole Island|0
Colington Island|0
Cow Island|0
Craig Key|0
Dildo Key|0
Forrester Island|0
Geiger Key|0
Grand Tower Island|0
Granite Island|0
Great Duck Island|0
Great Wass Island|0
Herbert Island|0
Hobbs Island|0
Key Vaca|0
Kiket Island|0
Lignumvitae Key|0
Little Chebeague Island|0.34
Little Diamond Island|0
Money Island|0
Munyon Island|0
Peirce Island|0
Pennock Island|0
Powder House Island|0
Ram Island|0.08
Rugged Island|0
Scout Key|0
Shark Key|0
Spring Island|0
Sukkwan Island|0
Sutil Island|0
Tea Table Key|0
Tuxis Island|0
Weedon Island|0
Woman Key|0
Deer Isle|0
`;

export const SEAS_OCEANS = `
Pacific Ocean|165250000|the Pacific
Atlantic Ocean|106460000|the Atlantic
Indian Ocean|70560000
Southern Ocean|21960000|Antarctic Ocean
Arctic Ocean|15558000
Philippine Sea|5695000
Sargasso Sea|5200000
Coral Sea|4791000
Arabian Sea|3862000
South China Sea|3500000
Weddell Sea|2800000
Caribbean Sea|2754000
Mediterranean Sea|2500000|the Mediterranean
Gulf of Guinea|2350000
Tasman Sea|2300000
Bay of Bengal|2172000
Bering Sea|2000000
Sea of Okhotsk|1583000
Gulf of Mexico|1550000
Gulf of Alaska|1533000
Barents Sea|1400000
Norwegian Sea|1380000
East China Sea|1249000
Hudson Bay|1230000
Greenland Sea|1205000
East Siberian Sea|987000
Sea of Japan|978000|East Sea
Ross Sea|960000
Kara Sea|926000
Scotia Sea|900000
Labrador Sea|841000
Andaman Sea|797700
Banda Sea|695000
Baffin Bay|689000
Laptev Sea|662000
Arafura Sea|650000
Timor Sea|610000
Chukchi Sea|595000
North Sea|570000
Bellingshausen Sea|487000
Beaufort Sea|476000
Red Sea|438000
Black Sea|436000
Gulf of Aden|410000
Yellow Sea|380000
Baltic Sea|377000
Caspian Sea|371000|the Caspian
Java Sea|320000
Levantine Sea|320000
Celtic Sea|300000
Celebes Sea|280000
Tyrrhenian Sea|275000
Sulu Sea|260000
Persian Gulf|251000|Arabian Gulf
Flores Sea|240000
Bay of Biscay|223000
Aegean Sea|214000
Molucca Sea|200000
Ionian Sea|169000
Gulf of California|160000|Sea of Cortez
Adriatic Sea|138600
Gulf of Bothnia|116300
Savu Sea|105000
Amundsen Sea|98000
Sea of Crete|95000
Halmahera Sea|95000
White Sea|90000
Balearic Sea|86000
English Channel|75000|the Channel
Lincoln Sea|64000
Alboran Sea|53000
Skagerrak|47000
Irish Sea|46000
Sea of Azov|39000
Gulf of Finland|30000
Kattegat|22000
Aral Sea|17160
Ligurian Sea|15000
Sea of Marmara|11350
Wadden Sea|10000
Dead Sea|605
Gulf of Thailand|320000
Gulf of Oman|181000
Gulf of Carpentaria|300000
Bay of Fundy|9700
Gulf of Riga|18000
Gulf of Sidra|57000
Great Australian Bight|45926
Gulf of Saint Lawrence|236000
Bismarck Sea|40000
Solomon Sea|720000
Bali Sea|45000
Ceram Sea|12000
Mozambique Channel|700000
Chesapeake Bay|11601
Strait of Gibraltar|600|Gibraltar
Strait of Hormuz|11000|Hormuz
Strait of Malacca|100000|Malacca
Bosphorus|40|Istanbul Strait
Dardanelles|200|Hellespont
Bering Strait|3200
Strait of Magellan|5850|Straits of Magellan,Magellan
Drake Passage|700000
Davis Strait|360000
Denmark Strait|140000
Cook Strait|3000
Bass Strait|75000
Torres Strait|48000
Taiwan Strait|150000|Formosa Strait
Korea Strait|65000
Tsugaru Strait|2500
Luzon Strait|75000
Sunda Strait|3000
Lombok Strait|2100
Makassar Strait|160000
Palk Strait|4000
Bab-el-Mandeb|3000|Bab al-Mandab
Strait of Dover|1500|Dover Strait,Dover
Strait of Bonifacio|700|Bonifacio
Strait of Messina|110|Messina
Strait of Otranto|4000|Otranto
Kerch Strait|180
Strait of Juan de Fuca|3000|Juan de Fuca
Straits of Florida|45000
Windward Passage|6000
Mona Passage|5000
Yucatan Channel|30000
Bristol Channel|1000
The Solent|400
North Channel|1600
St George's Channel|4000
Pentland Firth|100
Firth of Forth|1600
Firth of Clyde|1000
Moray Firth|3200
Solway Firth|700
Morecambe Bay|310
Cardigan Bay|960
Lyme Bay|1000
The Wash|620
Galway Bay|300
Dublin Bay|70
Bantry Bay|100
The Minch|4200
Sea of the Hebrides|10000
Bay of Kotor|87
Gulf of Corinth|2400
Saronic Gulf|2600
Thermaic Gulf|3000
Gulf of Taranto|14000
Gulf of Naples|870
Gulf of Genoa|2100
Gulf of Venice|1000
Gulf of Trieste|500
Kvarner Gulf|1000
Gulf of Lion|2700|Golfe du Lion
Gulf of Cadiz|25000
Gulf of Gdansk|5000
Bay of Pomerania|4700
Myrtoan Sea|5000
Thracian Sea|20000
Icarian Sea|7000|Ikarian Sea
Libyan Sea|60000
Sea of Sardinia|30000
Strait of Sicily|30000|Sicilian Channel,Sicily
Pagasetic Gulf|500|Pagasitic Gulf
Argolic Gulf|2000
Laconian Gulf|1600
Messenian Gulf|1000
Ambracian Gulf|405
Bay of Algeciras|75
Mar Menor|135
German Bight|15000
Heligoland Bight|3000
Western Scheldt|350
Eastern Scheldt|350
Gulf of Saint-Malo|1000
Iroise Sea|3000
Quiberon Bay|100
Gulf of Morbihan|115
Arcachon Bay|155
Gulf of Roses|48|Golf de Roses
Gulf of Valencia|20000
Bay of Palma|900
Gulf of Cagliari|500
Gulf of Salerno|400
Gulf of Manfredonia|1000
Oresund|2000
Great Belt|2830
Little Belt|500
Limfjord|1500|Limfjorden
Bothnian Sea|79000
Archipelago Sea|8300
Sea of Aland|7000
Curonian Lagoon|1600
Vistula Lagoon|838
Szczecin Lagoon|687|Oder Lagoon
Bay of Lubeck|100
Bay of Kiel|900
Bay of Mecklenburg|2000
Fehmarn Belt|80
Taganrog Bay|5000
Karkinit Bay|4270
Golden Horn|2.5
Gulf of Izmit|300|Izmit Bay
Gulf of Antalya|30000
Gulf of Iskenderun|5000
Gulf of Izmir|500
Saros Bay|900
Gulf of Gokova|1000
Strymonian Gulf|2000|Strymonic Gulf
Gulf of Suez|7500
Gulf of Aqaba|3680
Gulf of Gabes|8000
Gulf of Tunis|1500
Gulf of Hammamet|6000
Gulf of Tadjoura|1400
Gulf of Kutch|7350
Gulf of Khambhat|3120|Gulf of Cambay
Gulf of Mannar|9600
Gulf of Martaban|10000|Gulf of Mottama
Gulf of Tonkin|126250
Laccadive Sea|786000
Gulf of Bahrain|9000
Gulf of Masirah|4000
Tokyo Bay|1320
Osaka Bay|1450
Bohai Sea|78000
Seto Inland Sea|23000|Inland Sea
Manila Bay|1994
Leyte Gulf|8000
Gulf of Papua|70400
Cenderawasih Bay|100000|Geelvink Bay
Puget Sound|2600
Prince William Sound|9000
Monterey Bay|780
San Francisco Bay|1240
Long Island Sound|3400
Delaware Bay|2030
Tampa Bay|1030
Strait of Georgia|6800
Hudson Strait|110000
James Bay|130000
Gulf of Honduras|40000
Gulf of Panama|32000
Gulf of Guayaquil|27000
Beagle Channel|1200
Guanabara Bay|412
Cosmonauts Sea|699000
Cooperation Sea|258000
Lazarev Sea|929000
Riiser-Larsen Sea|1138000
Somov Sea|1150000
Biscayne Bay|1108.52
Gulf of Maine|93000
Cape Cod Bay|1564.35
Matagorda Bay|989.4
San Antonio Bay|580
Aransas Bay|452.4
Scapa Flow|0
Venetian Lagoon|550
Gulf of Corryvreckan|0
Sognefjord|12518
Geirangerfjord|0
Saltstraumen|0
Kynance Cove|0
Cantabrian Sea|0
Oslofjord|0
Holy Loch|0
Menai Strait|0|Menai
Hardangerfjord|0
Loch Fyne|0
Naeroyfjord|518.02
Loch Linnhe|0
Man o' War Cove|0
Hjorundfjorden|0
Clew Bay|0
Loch Long|0
Lysefjord|0
Gulf of La Spezia|0
Keem Bay|0
Kimmeridge Bay|0
Trollfjord|0
Firth of Tay|0
Hvalfjordur|0
Mont-Saint-Michel Bay|500
Mount's Bay|0
Baie de Somme|0
Flensburg Firth|250
Cromarty Firth|0
Eyjafjordur|0
Schlei|54.6
Blacksod Bay|0
Loch Ewe|0
Mulroy Bay|0
Sandwood Bay|0
Three Cliffs Bay|0
Trondheim Fjord|0
Breidafjordur|2874
Iceland Sea|406000
Murlough Bay|0
Alum Bay|0
Brittas Bay|0
Whitsand Bay|0
Baie de Douarnenez|0
Bracklesham Bay|2.01
Loch Broom|0
Gare Loch|0|Gareloch
Liverpool Bay|0
Marshall Meadows Bay|0
Baie des Anges|0
Compton Bay|0
Pegwell Bay|0
Sullom Voe|0
Nordfjorden|0
Watergate Bay|0
Faxafloi|0
Isfjorden|0|Isfjord
Ladram Bay|0
Loch Leven|0
Loch Moidart|0
Loch Ryan|0
Donegal Bay|0
Jade Bight|190
Berufjordur|0
Borgarfjordur|0
Dollart|100
Firth of Lorn|0
Skagafjordur|0
The Swale|65.09
Beauly Firth|0
Loch Carron|22.84
Loch Goil|0
Sand Bay|0
Sandwich Bay|0
Storfjorden|0
Swansea Bay|0
Vestfjorden|0
Coldingham Bay|0
Dingle Bay|0
Dornoch Firth|40
Kalmar Strait|0
Kyle of Tongue|245
Marano Lagoon|0
Sorfjorden|0
Kiel Fjord|0|Kieler Forde
Kyles of Bute|57.4
Koge Bay|330
Loch Duich|0
Loch Eriboll|0
Ofotfjord|0
Oxwich Bay|0
Roskilde Fjord|124
Saltwick Bay|0
Tor Bay|0
Totland Bay|0
Ard na Caithne|0
Loch Nevis|0
Loch Torridon|0
Magdalenefjorden|0
Woody Bay|0
Adventfjorden|0
Altafjord|0
Bideford Bay|0
Boknafjord|0
Carmarthen Bay|0
Jossingfjorden|0
Loch Alsh|0
Loch Striven|0
Lyngen|0
Nigg Bay|0
Rest Bay|0
Ringstead Bay|0
Romsdalsfjord|0
Varangerfjord|0|Varangerfjorden
Vejle Fjord|100
Basque Roads|0
Gills Bay|0
Gruinard Bay|0
Hunafloi|188.8
Killala Bay|10.61
Loch Sunart|49
Pease Bay|0
Porlock Bay|1.86
St Ives Bay|0
Sunnylvsfjorden|0
Worbarrow Bay|0
Isafjardardjup|0
Lulworth Cove|0
Pearl Harbor|0
New York Harbor|0|Upper New York Bay
Golden Gate|0
Straits of Mackinac|0|Mackinac
Deception Pass|0
Kealakekua Bay|0
Boston Harbor|0
Cook Inlet|0
Jamaica Bay|0
Narragansett Bay|0
Pamlico Sound|0
Lituya Bay|0
Arthur Kill|0
The Narrows|0
Bristol Bay|0
Baker's Haulover Inlet|0
Mobile Bay|0
Penobscot Bay|0
Whitefish Bay|0
Buzzards Bay|0
Hanauma Bay|0
Turnagain Arm|0
Bodega Bay|0
Mission Bay|0
Albemarle Sound|0
Galveston Bay|0
Elliott Bay|0
Casco Bay|0
Green Bay|0
Kill Van Kull|0
New York Bay|0
Suisun Bay|0
Hanalei Bay|0
San Diego Bay|0
Indian River Lagoon|0
Barataria Bay|0
Massachusetts Bay|0
Carquinez Strait|0
Humboldt Bay|0
Tomales Bay|0
Waimea Bay|0
Dead Horse Bay|0
Dixon Entrance|0
Porte des Morts|0
Barnegat Bay|0
Mallows Bay|0
Block Island Sound|0
Grand Traverse Bay|0
San Pedro Bay|0
Magens Bay|0
Passamaquoddy Bay|0
Raritan Bay|0
Santa Monica Bay|0
Wassaw Sound|0
Drakes Bay|0
Assawoman Bay|0
Lower New York Bay|0
San Pablo Bay|0
Florida Bay|0
Glacier Bay|0
Laguna Madre|1136.8
Saginaw Bay|0
Santa Barbara Channel|0
Coos Bay|0
Grays Harbor|0
Massacre Bay|0
Great South Bay|0
Kaneʻohe Bay|0
Resurrection Bay|0
Corpus Christi Bay|0
Kachemak Bay|0
Ocracoke Inlet|0
Oregon Inlet|0
Provincetown Harbor|0
Choctawhatchee Bay|0
Elkhorn Slough|0
Trunk Bay|0
Admiralty Inlet|0
Lake Worth Lagoon|0
Chequamegon Bay|0
Newark Bay|0
Willapa Bay|0
Puerto Mosquito|0
Rhode Island Sound|0
Winyah Bay|0
Peconic Bay|0
Trinity Bay|0
Commencement Bay|0
Knik Arm|0
Manasquan Inlet|0
Wallabout Bay|0
Flushing Bay|0
Mosquito Lagoon|0
Boundary Bay|0
Charlotte Harbor|0
Gastineau Channel|0
Haro Strait|0
Hilo Bay|0
Sebastian Inlet|0
Matanzas Inlet|0
Presque Isle Bay|0
St. Joseph Bay|0
Thunder Bay|0
Disenchantment Bay|0
Dismal Nitch|0
Gardiners Bay|0
Great Bay|0
Sandusky Bay|0
Tillamook Bay|0
Apalachee Bay|0
Apalachicola Bay|0
Bellingham Bay|0
Gravesend Bay|0
Gulf of the Farallones|0
Netarts Bay|0
Pensacola Bay|0
Portage Bay|0
Rigolets|0
Rosario Strait|0
Shelikof Strait|0
Tacoma Narrows|0
Thomas Bay|0
Port Royal Sound|0
Sturgeon Bay|0
Bowery Bay|0
Budd Inlet|0
Chichagof Harbor|0
Frenchman Bay|0
Icy Strait|0
Jupiter Inlet|0
Salmon Bay|0
San Juan Bay|0
San Luis Pass|0
Shinnecock Inlet|0
Vermilion Bay|0
Yakutat Bay|0
Yaquina Bay|0
Agua Hedionda Lagoon|0
Boca Ciega Bay|0
Chatham Strait|0
Hawk Channel|0
Hingham Bay|0
Holkham Bay|0
Irondequoit Bay|0
Little Traverse Bay|0
Merrymeeting Bay|0
Perdido Bay|0
Perdido Pass|0
Saratoga Passage|0|Saratoga
Sodus Bay|0
St. Andrews Bay|0
Agate Pass|0
Barnegat Inlet|0
Big Bay de Noc|0
Chef Menteur Pass|0
Great Egg Harbor Bay|0
Gulf of Santa Catalina|0
Manhasset Bay|0
Mount Hope Bay|0
Stephens Passage|0
Turtle Bay|0
Useless Bay|0
Vineyard Sound|0
Anchor Bay|0
Half Moon Bay|0
Hallo Bay|0
Isabel Inlet|0
La Perouse Bay|0
Muscongus Bay|0
Oakland Estuary|0
Rehoboth Bay|0
Richardson Bay|0
Sarasota Bay|0
Alamitos Bay|0
Haverstraw Bay|0
Little Bay de Noc|0
Moriches Inlet|0
Murder Cove|0
Padilla Bay|0
Shoup Bay|0
Tumon Bay|0
Semiahmoo Bay|0
`;
