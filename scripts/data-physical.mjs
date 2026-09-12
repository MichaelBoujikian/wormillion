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
Lake Mead|640
Lake Powell|653
Lake Havasu|79
Lake George|114
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
Lake Edward|2325|Edward
Lake Naivasha|139|Naivasha
Lake Nakuru|45|Nakuru
Lake Assal|54|Assal
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
Rio Grande|3051
Saint Lawrence|3058|St Lawrence
Sao Francisco|2914
Volga|3531|Volga River
Indus|3180|Indus River
Danube|2850|the Danube
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
Negro River|2250|Rio Negro
Orange River|2200|Orange
Pearl River|2200|Zhu Jiang
Irrawaddy|2170
Orinoco|2140
Tarim River|2030|Tarim
Dnieper|2201
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
Rhine|1230|the Rhine
Ottawa River|1271|Ottawa
Elbe|1094
Vistula|1047
Tagus|1007|Tejo
Loire|1006
Meuse|925
Ebro|930
Douro|897|Duero
Oder|854|Odra
Seine|777
Guadalquivir|657
Po|652|Po River
Tiber|406|Tevere
Shannon|360|River Shannon
Severn|354|River Severn
Thames|346|River Thames
Trent|298|River Trent
Wye|250|River Wye
Tay|188|River Tay
Clyde|176|River Clyde
Spey|172|River Spey
Aire|148|River Aire
Liffey|132|River Liffey
Bristol Avon|121|River Avon
Medway|113|River Medway
Ouse|84|River Ouse
Cam|64|River Cam
Jordan River|251|Jordan
Rhone|813|Rhone River
Vltava|430
Sava|990
Drava|710
Neva|74
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
Swan River|72
Yarra River|242|Yarra
Brisbane River|344
Limpopo|1750
Senegal River|1086
Gambia River|1120
Volta River|1500
Blue Nile|1450
White Nile|3700
Moselle|544
Main|527|Main River
Weser|452
Tisza|966
Guadiana|829
Adige|410
Arno|241
River Tweed|156|Tweed
River Forth|47|Forth
River Exe|82|Exe
River Dee|113|Dee
River Bann|129|Bann
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
Gasherbrum I|8080|Hidden Peak
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
Pico de Orizaba|5636|Citlaltepetl
Damavand|5610|Mount Damavand
Popocatepetl|5426
Mount Kenya|5199|Batian
Mount Ararat|5137|Ararat
Mount Vinson|4892|Vinson Massif
Puncak Jaya|4884|Carstensz Pyramid
Mont Blanc|4808
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
Mount Fuji|3776|Fuji,Fujisan
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
Mount Kosciuszko|2228|Kosciuszko
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
Longs Peak|4346
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
Mount Ossa|1617
Mount Tongariro|1978|Tongariro
Mount Ngauruhoe|2291|Ngauruhoe
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
Namib|81000|Namib Desert
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
`;

export const ISLANDS = `
Greenland|2166086|Kalaallit Nunaat
New Guinea|785753
Borneo|748168
Madagascar Island|587041|Madagascar
Baffin Island|507451|Baffin
Sumatra|443066
Honshu|225800
Victoria Island|217291
Great Britain|209331|Britain
Ellesmere Island|196236|Ellesmere
Sulawesi|180681|Celebes
South Island|145836|Te Waipounamu
Java|138794
North Island|111583|Te Ika-a-Maui
Luzon|109965
Newfoundland|108860
Cuba Island|105806|Cuba
Iceland Island|101826|Iceland
Mindanao|97530
Ireland Island|84421|Ireland
Hokkaido|78073
Hispaniola|76192|Haiti,Dominican Republic
Sakhalin|72493
Banks Island|70028
Tasmania|68401
Sri Lanka Island|65268|Ceylon
Devon Island|55247
Novaya Zemlya|48904
Tierra del Fuego|47992
Melville Island|42149
Southampton Island|41214
Spitsbergen|37673
Kyushu|36782
Taiwan Island|35883|Formosa
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
Jamaica Island|10991
Big Island of Hawaii|10433|Hawaii Island,Big Island
Cape Breton Island|10311|Cape Breton
Cyprus Island|9251
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
Mauritius Island|2040
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
Barbados Island|430
Isle of Wight|380
Niue|261
Malta Island|246
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
Nauru Island|21
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
Mackinac Island|9.8
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
Dominica Island|750
Saint Lucia Island|617
Saint Vincent Island|344|Saint Vincent and the Grenadines,St Vincent and the Grenadines
Grenada Island|312
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
Solomon Islands|28400|Solomons,The Solomon Islands
Kiribati|811|Gilbert Islands
Tuvalu|26|Ellice Islands
Marshall Islands|181|Marshalls,The Marshall Islands
Micronesia|702|Federated States of Micronesia,FSM
Singapore Island|710|Singapore,Pulau Ujong
Bahrain Island|590
Canary Islands|7493|Canaries
Balearic Islands|4992|Balearics
Azores|2333
Galapagos Islands|7880|Galapagos
Aleutian Islands|17666|Aleutians
Florida Keys|356|The Keys
Faroe Islands|1399|Faroes
Cyclades|2572
Isles of Scilly|16|Scilly Isles
Svalbard|61022
Outer Hebrides|3071|Western Isles
Cook Islands|236
Society Islands|1590
Marquesas Islands|1049|Marquesas
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
`;
