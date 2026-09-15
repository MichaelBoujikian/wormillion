/**
 * Non-capital cities: world cities that are NOT the national capital of their
 * country. They feed the `city` cohort, so "Name a city in South America."
 * accepts Guayaquil and "Name a city with a population over 5 million."
 * accepts Lagos.
 *
 * Format per line: Name|Country|population|alias,alias,...
 *
 *   Name        Common English name, plain ASCII (the matcher folds accents on
 *               both sides, so "Zurich" matches the umlauted spelling too).
 *               Apostrophes are fine:
 *               "Xi'an" normalizes to "xian".
 *   Country     Must match the FIRST column of scripts/data-countries.mjs
 *               exactly ("United States", "Ivory Coast", "Czechia",
 *               "Democratic Republic of the Congo"). A city inherits its
 *               country's region tags and flag colours from that row, so a
 *               name that does not match fails the build.
 *   population  City proper (the administrative city or municipality), rounded
 *               to 2-3 significant figures, digits only. Consistency of
 *               definition beats precision: Los Angeles is 3,900,000 (the city,
 *               not the 13M metro); Chinese cities carry their conventional
 *               municipality figure (Shanghai 24,900,000). The one deliberate
 *               exception is Australia, where the municipal "City of Sydney"
 *               is a 200,000-person downtown and every reference uses Greater
 *               Sydney (5,300,000) - the conventional figure is used there.
 *               Threshold prompts are inclusive, so roughly right is enough.
 *   aliases     Optional. Former names (Bombay, Saigon, Leningrad), local
 *               names an English speaker might type (Munchen, Firenze),
 *               spelling variants (Frankfurt am Main), and only genuinely
 *               common abbreviations (NYC, LA - not SF).
 *
 * The `source` field for every entry built from this block is CITIES_SOURCE
 * below.
 *
 * NATIONAL CAPITALS ARE EXCLUDED. Every second-column capital of
 * data-countries.mjs already lives in the `capital` cohort with its own
 * region tags, so listing it here would double-count it and make "Name a city
 * that is not a national capital." accept Paris. That is also why Delhi is
 * absent (New Delhi is India's capital there, and Delhi is its alias) and why
 * Colombo is absent (the countries file makes Colombo Sri Lanka's capital,
 * with Kotte as its alias). Cities that appear only as an ALIAS of a capital
 * because they are a co-capital or seat of government - Cape Town, Cotonou,
 * Tel Aviv, The Hague, La Paz, Bujumbura - are distinct cities and ARE listed;
 * they answer both kinds of prompt.
 *
 * US state capitals that are major cities in their own right (Boston, Denver,
 * Atlanta, Phoenix, Austin) are listed too; they take a different id prefix
 * from their `capital` entries, so nothing collides.
 *
 * No two rows share a Name, and no Name is also a country or island elsewhere
 * in the bank (so no "Singapore", no "Zanzibar" - Cebu City is fine, Cebu is
 * not). Within this cohort the validator also rejects two names that collapse
 * to the same loose key (filler words dropped), so only one of "Saint Louis"
 * and "Saint-Louis" can exist; the more famous one wins.
 *
 * Rows are grouped by region, in this order, with no comment lines inside the
 * block (build-data.mjs's lines() keeps anything non-blank):
 *   Africa: West Africa, North Africa, East Africa, Southern Africa, untagged
 *   Asia: Middle East, South Asia (Afghanistan is also Central Asia),
 *         Southeast Asia, East Asia, Central Asia, Caucasus (untagged)
 *   Europe: Western Europe, Eastern Europe, Scandinavia & the Nordics, Greece
 *   North America: United States, Canada, Mexico, Central America, Caribbean
 *   South America
 *   Oceania
 * Every region and sub-region tag in the bank has at least six cities.
 */
export const CITIES_SOURCE = 'City-proper population, common reference figures, rounded (2026)';

export const CITIES = `
Lagos|Nigeria|15400000
Kano|Nigeria|4100000
Ibadan|Nigeria|3600000
Port Harcourt|Nigeria|1900000
Benin City|Nigeria|1800000
Kumasi|Ghana|3300000
Abidjan|Ivory Coast|6300000
Timbuktu|Mali|55000|Tombouctou,Timbuctoo
Bobo-Dioulasso|Burkina Faso|900000|Bobo Dioulasso
Cotonou|Benin|680000
Touba|Senegal|1100000
Serekunda|Gambia|350000|Serrekunda
Alexandria|Egypt|5500000
Giza|Egypt|4900000|Gizeh,Al Jizah
Luxor|Egypt|500000|Thebes
Aswan|Egypt|350000|Assuan
Sharm El Sheikh|Egypt|73000|Sharm el-Sheikh,Sharm
Omdurman|Sudan|2400000
Oran|Algeria|900000|Wahran
Casablanca|Morocco|3400000
Marrakesh|Morocco|930000|Marrakech
Fez|Morocco|1100000|Fes
Tangier|Morocco|1100000|Tanger,Tangiers
Benghazi|Libya|700000|Bengasi
Dar es Salaam|Tanzania|5400000
Arusha|Tanzania|620000
Mwanza|Tanzania|1100000
Mombasa|Kenya|1200000
Kisumu|Kenya|400000
Nakuru|Kenya|420000
Jinja|Uganda|240000
Entebbe|Uganda|70000
Dire Dawa|Ethiopia|490000|Dire-Dawa
Bahir Dar|Ethiopia|350000|Bahar Dar
Gondar|Ethiopia|400000|Gonder
Lalibela|Ethiopia|20000
Hargeisa|Somalia|1200000
Bujumbura|Burundi|1000000
Blantyre|Malawi|800000
Johannesburg|South Africa|4800000|Joburg,Jozi
Cape Town|South Africa|4770000|Kaapstad
Durban|South Africa|4200000|eThekwini
Port Elizabeth|South Africa|1150000|Gqeberha
Bulawayo|Zimbabwe|670000
Beira|Mozambique|530000
Kitwe|Zambia|660000
Livingstone|Zambia|150000
Manzini|Eswatini|110000
Lubumbashi|Democratic Republic of the Congo|2700000|Elisabethville
Mbuji-Mayi|Democratic Republic of the Congo|2800000|Mbuji Mayi
Kisangani|Democratic Republic of the Congo|1300000|Stanleyville
Goma|Democratic Republic of the Congo|1000000
Douala|Cameroon|3700000
Pointe-Noire|Republic of the Congo|1100000|Pointe Noire
Istanbul|Turkey|15700000|Constantinople
Izmir|Turkey|4400000|Smyrna
Antalya|Turkey|2700000
Mashhad|Iran|3400000|Mashad
Isfahan|Iran|2200000|Esfahan
Shiraz|Iran|1600000
Basra|Iraq|1400000|Basrah
Mosul|Iraq|1700000
Jeddah|Saudi Arabia|3800000|Jidda,Jiddah
Mecca|Saudi Arabia|2400000|Makkah
Medina|Saudi Arabia|1400000|Madinah,Al Madinah
Aleppo|Syria|2100000|Halab
Tel Aviv|Israel|470000|Tel Aviv-Yafo,Tel Aviv-Jaffa
Haifa|Israel|290000
Dubai|United Arab Emirates|3700000
Gaza City|Palestine|590000|Gaza
Bethlehem|Palestine|29000
Mumbai|India|12400000|Bombay
Kolkata|India|4500000|Calcutta
Chennai|India|4700000|Madras
Bengaluru|India|8400000|Bangalore
Hyderabad|India|6800000
Ahmedabad|India|5600000|Ahmadabad
Pune|India|3100000|Poona
Surat|India|4500000
Jaipur|India|3100000
Lucknow|India|2800000
Kanpur|India|2800000|Cawnpore
Nagpur|India|2400000
Varanasi|India|1200000|Benares,Banaras,Kashi
Agra|India|1600000
Amritsar|India|1130000
Kochi|India|600000|Cochin
Karachi|Pakistan|20400000
Lahore|Pakistan|13000000
Faisalabad|Pakistan|3700000|Lyallpur
Chittagong|Bangladesh|3200000|Chattogram
Kandahar|Afghanistan|610000|Qandahar
Herat|Afghanistan|570000
Mazar-i-Sharif|Afghanistan|500000|Mazar-e-Sharif,Mazar i Sharif,Mazar e Sharif
Pokhara|Nepal|520000
Kandy|Sri Lanka|125000
Surabaya|Indonesia|2900000
Bandung|Indonesia|2500000
Medan|Indonesia|2400000
Makassar|Indonesia|1400000|Ujung Pandang
Yogyakarta|Indonesia|400000|Jogja,Jogjakarta,Yogya
Ho Chi Minh City|Vietnam|9300000|Saigon,HCMC,Ho Chi Minh
Da Nang|Vietnam|1200000|Danang
Hue|Vietnam|650000
Hai Phong|Vietnam|2100000|Haiphong
Chiang Mai|Thailand|130000|Chiangmai
Pattaya|Thailand|120000
Yangon|Myanmar|5200000|Rangoon
Mandalay|Myanmar|1200000
George Town|Malaysia|790000
Quezon City|Philippines|2960000
Davao City|Philippines|1780000|Davao
Cebu City|Philippines|960000
Siem Reap|Cambodia|250000
Luang Prabang|Laos|56000|Louangphabang
Shanghai|China|24900000
Chongqing|China|32000000|Chungking
Tianjin|China|13900000|Tientsin
Wuhan|China|12300000
Chengdu|China|20900000
Guangzhou|China|18700000|Canton
Shenzhen|China|17600000
Xi'an|China|12900000|Sian
Hangzhou|China|11900000
Nanjing|China|9300000|Nanking
Harbin|China|10000000
Lhasa|China|870000
Hong Kong|China|7500000|HK
Macau|China|680000|Macao
Shenyang|China|9100000|Mukden
Qingdao|China|10100000|Tsingtao
Osaka|Japan|2750000
Yokohama|Japan|3770000
Kyoto|Japan|1460000
Nagoya|Japan|2330000
Sapporo|Japan|1970000
Fukuoka|Japan|1630000
Hiroshima|Japan|1190000
Kobe|Japan|1500000
Busan|South Korea|3300000|Pusan
Incheon|South Korea|3000000|Inchon
Kaohsiung|Taiwan|2730000
New Taipei|Taiwan|4000000|New Taipei City
Hamhung|North Korea|770000
Almaty|Kazakhstan|2200000|Alma-Ata,Alma Ata
Shymkent|Kazakhstan|1200000|Chimkent
Samarkand|Uzbekistan|550000|Samarqand
Bukhara|Uzbekistan|280000|Bukhoro,Buxoro
Khiva|Uzbekistan|95000|Xiva
Osh|Kyrgyzstan|320000
Khujand|Tajikistan|200000|Khodjent,Leninabad
Batumi|Georgia|170000
Munich|Germany|1500000|Munchen,Muenchen
Hamburg|Germany|1900000
Frankfurt|Germany|770000|Frankfurt am Main
Cologne|Germany|1100000|Koln,Koeln
Stuttgart|Germany|630000
Marseille|France|870000|Marseilles
Lyon|France|520000|Lyons
Nice|France|340000
Toulouse|France|500000
Bordeaux|France|260000
Manchester|United Kingdom|550000
Birmingham|United Kingdom|1150000
Liverpool|United Kingdom|490000
Glasgow|United Kingdom|630000
Edinburgh|United Kingdom|510000
Oxford|United Kingdom|160000
Cambridge|United Kingdom|150000
Leeds|United Kingdom|810000
Bristol|United Kingdom|470000
Cardiff|United Kingdom|360000|Caerdydd
Belfast|United Kingdom|345000
Milan|Italy|1370000|Milano
Naples|Italy|910000|Napoli
Turin|Italy|850000|Torino
Florence|Italy|360000|Firenze
Venice|Italy|250000|Venezia
Genoa|Italy|560000|Genova
Barcelona|Spain|1660000
Valencia|Spain|800000
Seville|Spain|690000|Sevilla
Malaga|Spain|590000
Rotterdam|Netherlands|660000
The Hague|Netherlands|560000|Den Haag,Hague
Antwerp|Belgium|540000|Antwerpen,Anvers
Bruges|Belgium|120000|Brugge
Porto|Portugal|230000|Oporto
Salzburg|Austria|160000
Zurich|Switzerland|430000|Zuerich
Geneva|Switzerland|200000|Geneve,Genf
Cork|Ireland|220000
Saint Petersburg|Russia|5600000|St Petersburg,Leningrad,Petrograd
Novosibirsk|Russia|1600000
Yekaterinburg|Russia|1500000|Ekaterinburg,Sverdlovsk
Kazan|Russia|1300000
Vladivostok|Russia|600000
Volgograd|Russia|1000000|Stalingrad,Tsaritsyn
Sochi|Russia|470000
Kharkiv|Ukraine|1400000|Kharkov
Odesa|Ukraine|1000000|Odessa
Lviv|Ukraine|720000|Lvov,Lemberg
Krakow|Poland|800000|Cracow
Gdansk|Poland|470000|Danzig
Wroclaw|Poland|670000|Breslau
Brno|Czechia|400000
Cluj-Napoca|Romania|290000|Cluj,Cluj Napoca
Plovdiv|Bulgaria|340000
Split|Croatia|160000
Dubrovnik|Croatia|41000
Mostar|Bosnia and Herzegovina|105000
Gothenburg|Sweden|600000|Goteborg,Gothenberg
Malmo|Sweden|360000|Malmoe
Bergen|Norway|290000
Tromso|Norway|78000|Tromsoe
Aarhus|Denmark|290000|Arhus
Tampere|Finland|250000|Tammerfors
Turku|Finland|200000|Abo
Thessaloniki|Greece|320000|Salonika,Salonica,Thessalonica
Heraklion|Greece|180000|Iraklio,Iraklion,Candia
New York City|United States|8300000|New York,NYC
Los Angeles|United States|3900000|LA
Chicago|United States|2700000
Houston|United States|2300000
Phoenix|United States|1650000
Philadelphia|United States|1600000|Philly
San Antonio|United States|1500000
San Diego|United States|1400000
Dallas|United States|1300000
Austin|United States|980000
San Francisco|United States|810000
Seattle|United States|750000
Denver|United States|720000
Las Vegas|United States|660000|Vegas
Boston|United States|650000
Detroit|United States|630000
Atlanta|United States|500000
Miami|United States|450000
New Orleans|United States|370000|NOLA
Baltimore|United States|565000
Saint Louis|United States|280000|St Louis
Pittsburgh|United States|300000
Portland|United States|630000
Minneapolis|United States|425000
Orlando|United States|320000
Honolulu|United States|350000
Toronto|Canada|2800000
Montreal|Canada|1760000
Calgary|Canada|1300000
Edmonton|Canada|1010000
Vancouver|Canada|660000
Quebec City|Canada|550000|Quebec
Winnipeg|Canada|750000
Tijuana|Mexico|1920000
Leon|Mexico|1720000
Puebla|Mexico|1540000|Puebla de Zaragoza
Guadalajara|Mexico|1400000
Monterrey|Mexico|1140000
Cancun|Mexico|890000
Oaxaca|Mexico|260000|Oaxaca de Juarez,Oaxaca City
Acapulco|Mexico|780000
Ciudad Juarez|Mexico|1500000|Juarez
Quetzaltenango|Guatemala|180000|Xela
Antigua Guatemala|Guatemala|46000
San Pedro Sula|Honduras|720000
Santa Ana|El Salvador|270000
Masaya|Nicaragua|170000
Puerto Limon|Costa Rica|60000|Limon
Belize City|Belize|65000
Santiago de Cuba|Cuba|510000
Holguin|Cuba|350000
Varadero|Cuba|21000
Camaguey|Cuba|300000
Cap-Haitien|Haiti|280000|Cap Haitien,Le Cap
Santiago de los Caballeros|Dominican Republic|770000
Punta Cana|Dominican Republic|50000
Montego Bay|Jamaica|110000
Ocho Rios|Jamaica|17000
San Fernando|Trinidad and Tobago|50000
Freeport|Bahamas|27000
Sao Paulo|Brazil|11500000
Rio de Janeiro|Brazil|6200000|Rio
Salvador|Brazil|2400000|Salvador da Bahia
Fortaleza|Brazil|2400000
Belo Horizonte|Brazil|2300000
Manaus|Brazil|2060000
Curitiba|Brazil|1770000
Recife|Brazil|1490000
Porto Alegre|Brazil|1330000
Medellin|Colombia|2500000
Cali|Colombia|2200000
Cartagena|Colombia|1000000|Cartagena de Indias
Barranquilla|Colombia|1300000
Cordoba|Argentina|1500000|Cordova
Rosario|Argentina|950000
Ushuaia|Argentina|80000
Arequipa|Peru|1000000
Cusco|Peru|430000|Cuzco
Maracaibo|Venezuela|1650000
Valparaiso|Chile|300000
Guayaquil|Ecuador|2700000
Santa Cruz de la Sierra|Bolivia|1900000|Santa Cruz
La Paz|Bolivia|800000
Sydney|Australia|5300000
Melbourne|Australia|5100000
Brisbane|Australia|2600000
Perth|Australia|2200000
Adelaide|Australia|1400000
Darwin|Australia|150000
Gold Coast|Australia|640000
Auckland|New Zealand|1700000
Christchurch|New Zealand|400000
Lae|Papua New Guinea|150000
Nadi|Fiji|70000
Nashville|United States|690000
Memphis|United States|630000
Charlotte|United States|880000
Columbus|United States|905000
Indianapolis|United States|890000
Jacksonville|United States|950000
Fort Worth|United States|920000
San Jose|United States|1010000
Milwaukee|United States|577000
Kansas City|United States|510000|KC
Oklahoma City|United States|680000|OKC
El Paso|United States|680000
Louisville|United States|630000
Albuquerque|United States|560000
Tucson|United States|540000
Fresno|United States|540000
Sacramento|United States|530000
Mesa|United States|500000
Raleigh|United States|470000
Omaha|United States|490000
Colorado Springs|United States|480000
Virginia Beach|United States|460000
Long Beach|United States|470000
Oakland|United States|440000
Tulsa|United States|410000
Tampa|United States|390000
Wichita|United States|400000
Cleveland|United States|370000
Bakersfield|United States|400000
Aurora|United States|390000
Anaheim|United States|350000
Riverside|United States|315000
Corpus Christi|United States|320000
Lexington|United States|320000
Stockton|United States|320000
Henderson|United States|320000
Saint Paul|United States|312000|St Paul
Cincinnati|United States|310000
Greensboro|United States|300000
Plano|United States|285000
Anchorage|United States|290000
Lincoln|United States|290000
Buffalo|United States|280000
Newark|United States|310000
Jersey City|United States|290000
Chula Vista|United States|275000
Fort Wayne|United States|265000
Chandler|United States|275000
Laredo|United States|255000
Lubbock|United States|260000
Madison|United States|270000
Reno|United States|265000
Winston-Salem|United States|250000
Chesapeake|United States|250000
Scottsdale|United States|240000
Boise|United States|235000
Richmond|United States|227000
Spokane|United States|230000
Tacoma|United States|220000
Baton Rouge|United States|227000
Des Moines|United States|214000
Modesto|United States|218000
Salt Lake City|United States|200000|SLC
Sioux Falls|United States|195000
Rochester|United States|211000
Amarillo|United States|200000
Tallahassee|United States|196000
Grand Rapids|United States|199000
Mobile|United States|187000
Providence|United States|191000
Montgomery|United States|201000
Chattanooga|United States|181000
Brownsville|United States|187000
Glendale|United States|248000
Newport News|United States|186000
Huntsville|United States|215000
Knoxville|United States|191000
Little Rock|United States|203000
Shreveport|United States|187000
Savannah|United States|148000
Charleston|United States|150000
Columbia|United States|137000
Myrtle Beach|United States|35000
Wilmington|United States|123000
Asheville|United States|94000
Augusta|United States|19000
Macon|United States|157000
Gainesville|United States|141000
Daytona Beach|United States|72000
Fort Lauderdale|United States|183000
West Palm Beach|United States|117000
Sarasota|United States|57000
Pensacola|United States|54000
Saint Augustine|United States|15000|St Augustine
Jackson|United States|150000
Biloxi|United States|46000
Fayetteville|United States|211000
Bentonville|United States|55000
Springfield|United States|114000
Peoria|United States|113000
South Bend|United States|103000
Bloomington|United States|85000
Dayton|United States|137000
Akron|United States|190000
Ann Arbor|United States|123000
Flint|United States|81000
Lansing|United States|112000
Green Bay|United States|107000
Fargo|United States|125000
Bismarck|United States|73000
Rapid City|United States|74000
Billings|United States|118000
Missoula|United States|75000
Bozeman|United States|53000
Helena|United States|34000
Cheyenne|United States|65000
Boulder|United States|108000
Fort Collins|United States|169000
Aspen|United States|7000
Vail|United States|5000
Provo|United States|116000
Ogden|United States|87000
Park City|United States|8000
Moab|United States|5000
Las Cruces|United States|112000
Santa Fe|United States|88000
Roswell|United States|48000
Flagstaff|United States|76000
Sedona|United States|10000
Yuma|United States|95000
Tempe|United States|181000
Carson City|United States|58000
Waco|United States|138000
Santa Barbara|United States|89000
Monterey|United States|30000
Palo Alto|United States|68000
Berkeley|United States|124000
Napa|United States|80000
Santa Rosa|United States|178000
Palm Springs|United States|44000
Pasadena|United States|138000
Burbank|United States|103000
Malibu|United States|11000
Santa Monica|United States|93000
Beverly Hills|United States|32000
Compton|United States|95000
Inglewood|United States|107000
San Bernardino|United States|222000
Eugene|United States|176000
Salem|United States|175000
Bend|United States|103000
Olympia|United States|55000
Bellevue|United States|151000
Walla Walla|United States|34000
Juneau|United States|32000
Fairbanks|United States|32000
Nome|United States|3600
Utqiagvik|United States|4900|Barrow
Hilo|United States|45000
Kailua-Kona|United States|12000
Lahaina|United States|12000
Atlantic City|United States|38000
Trenton|United States|90000
Princeton|United States|31000
Hoboken|United States|60000
Camden|United States|71000
Yonkers|United States|211000
Syracuse|United States|148000
Saratoga Springs|United States|28000
Scranton|United States|76000
Allentown|United States|125000
Gettysburg|United States|7700
Dover|United States|39000
Annapolis|United States|40000
Charlottesville|United States|47000
Williamsburg|United States|15000
Concord|United States|43000
Burlington|United States|44000
Montpelier|United States|8000
Bar Harbor|United States|5500
Newport|United States|25000
New Haven|United States|135000
Hartford|United States|121000
Tupelo|United States|38000
Selma|United States|17000
Tuscaloosa|United States|100000
Lafayette|United States|121000
Hot Springs|United States|39000
Joplin|United States|52000
Branson|United States|12000
Independence|United States|123000
Topeka|United States|126000
Lawrence|United States|98000
Dodge City|United States|27000
Cedar Rapids|United States|137000
Iowa City|United States|75000
Mississauga|Canada|718000
Brampton|Canada|656000
Hamilton|Canada|569000
Surrey|Canada|568000
Halifax|Canada|440000
Laval|Canada|438000
Gatineau|Canada|291000
Saskatoon|Canada|266000
Kitchener|Canada|257000
Windsor|Canada|230000
Regina|Canada|226000
Sudbury|Canada|166000|Greater Sudbury
Saint John's|Canada|111000|St John's
Thunder Bay|Canada|109000
Brantford|Canada|100000
Red Deer|Canada|101000
Nanaimo|Canada|100000
Lethbridge|Canada|98000
Kamloops|Canada|100000
Prince George|Canada|76000
Fort McMurray|Canada|66000
Medicine Hat|Canada|63000
Moncton|Canada|79000
Fredericton|Canada|63000
Charlottetown|Canada|38000
Yellowknife|Canada|20000
Whitehorse|Canada|28000
Iqaluit|Canada|7400
Niagara Falls|Canada|88000
Whistler|Canada|13000
Banff|Canada|8000
Jasper|Canada|4700
Tofino|Canada|2500
Kelowna|Canada|145000
Penticton|Canada|33000
Nelson|Canada|11000
Dawson City|Canada|1400
Brandon|Canada|51000
Moose Jaw|Canada|34000
Rankin Inlet|Canada|2900
Sheffield|United Kingdom|560000
Newcastle upon Tyne|United Kingdom|300000|Newcastle
Nottingham|United Kingdom|330000
Leicester|United Kingdom|370000
Coventry|United Kingdom|345000
Bradford|United Kingdom|540000
Kingston upon Hull|United Kingdom|260000|Hull
Plymouth|United Kingdom|265000
Stoke-on-Trent|United Kingdom|260000|Stoke
Wolverhampton|United Kingdom|265000
Derby|United Kingdom|260000
Southampton|United Kingdom|255000
Sunderland|United Kingdom|175000
Brighton|United Kingdom|290000
York|United Kingdom|210000
Middlesbrough|United Kingdom|140000
Bournemouth|United Kingdom|200000
Norwich|United Kingdom|145000
Preston|United Kingdom|140000
Milton Keynes|United Kingdom|230000
Northampton|United Kingdom|230000
Luton|United Kingdom|220000
Peterborough|United Kingdom|215000
Reading|United Kingdom|175000
Ipswich|United Kingdom|140000
Bath|United Kingdom|95000
Exeter|United Kingdom|130000
Durham|United Kingdom|50000
Canterbury|United Kingdom|55000
Aberdeen|United Kingdom|200000
Dundee|United Kingdom|150000
Inverness|United Kingdom|47000
Stirling|United Kingdom|37000
Ayr|United Kingdom|46000
Dumfries|United Kingdom|33000
St Andrews|United Kingdom|17000
Swansea|United Kingdom|245000
Wrexham|United Kingdom|65000
Bangor|United Kingdom|18000
Llandudno|United Kingdom|20000
Aberystwyth|United Kingdom|18000
Derry|United Kingdom|85000
Lisburn|United Kingdom|45000
Newry|United Kingdom|27000
Armagh|United Kingdom|15000
Enniskillen|United Kingdom|14000
Stratford-upon-Avon|United Kingdom|30000
Winchester|United Kingdom|45000
Worcester|United Kingdom|100000
Galway|Ireland|85000
Limerick|Ireland|95000
Waterford|Ireland|60000
Kilkenny|Ireland|27000
Drogheda|Ireland|41000
Dundalk|Ireland|43000
Sligo|Ireland|20000
Wexford|Ireland|21000
Killarney|Ireland|14000
Tralee|Ireland|26000
Ennis|Ireland|27000
Athlone|Ireland|22000
Bray|Ireland|33000
Dun Laoghaire|Ireland|26000
Kinsale|Ireland|5600
Cobh|Ireland|13000
Nantes|France|320000
Strasbourg|France|290000
Lille|France|235000
Rennes|France|220000
Reims|France|180000
Toulon|France|175000
Saint-Etienne|France|170000
Le Havre|France|170000
Grenoble|France|160000
Dijon|France|160000
Angers|France|155000
Nimes|France|150000
Clermont-Ferrand|France|145000
Le Mans|France|145000
Aix-en-Provence|France|145000
Brest|France|140000
Tours|France|135000
Amiens|France|135000
Limoges|France|130000
Annecy|France|130000
Perpignan|France|120000
Besancon|France|115000
Orleans|France|115000
Rouen|France|110000
Mulhouse|France|108000
Caen|France|105000
Nancy|France|105000
Avignon|France|92000
Poitiers|France|90000
Versailles|France|85000
La Rochelle|France|78000
Cannes|France|75000
Antibes|France|75000
Ajaccio|France|70000
Bayonne|France|52000
Biarritz|France|25000
Chamonix|France|8500|Chamonix-Mont-Blanc
Carcassonne|France|45000
Colmar|France|70000
Troyes|France|61000
Bastia|France|45000
Saint-Malo|France|46000
Arles|France|52000
Chartres|France|39000
Montpellier|France|300000
Saint-Tropez|France|4300
Menton|France|29000
Deauville|France|3500
Honfleur|France|7500
Chambery|France|60000
Ghent|Belgium|265000
Liege|Belgium|200000
Charleroi|Belgium|205000
Leuven|Belgium|103000
Namur|Belgium|110000
Mons|Belgium|95000
Mechelen|Belgium|86000
Ostend|Belgium|72000
Kortrijk|Belgium|77000
Hasselt|Belgium|80000
Genk|Belgium|68000
Tournai|Belgium|69000
Aalst|Belgium|89000
Ypres|Belgium|35000|Ieper
Dinant|Belgium|13500
Spa|Belgium|10500
Bastogne|Belgium|15500
Knokke-Heist|Belgium|34000
Sint-Niklaas|Belgium|79000
Roeselare|Belgium|66000
Arlon|Belgium|30000
Durbuy|Belgium|11500
Waterloo|Belgium|30000
Utrecht|Netherlands|360000
Eindhoven|Netherlands|240000
Groningen|Netherlands|235000
Tilburg|Netherlands|225000
Breda|Netherlands|185000
Nijmegen|Netherlands|180000
Haarlem|Netherlands|165000
Arnhem|Netherlands|165000
Enschede|Netherlands|160000
Apeldoorn|Netherlands|165000
's-Hertogenbosch|Netherlands|155000|Den Bosch
Zwolle|Netherlands|130000
Leiden|Netherlands|125000
Amersfoort|Netherlands|160000
Dordrecht|Netherlands|120000
Leeuwarden|Netherlands|125000
Alkmaar|Netherlands|110000
Maastricht|Netherlands|120000
Hilversum|Netherlands|92000
Almere|Netherlands|218000
Delft|Netherlands|105000
Gouda|Netherlands|75000
Venlo|Netherlands|102000
Zaandam|Netherlands|76000
Volendam|Netherlands|22000
Edam|Netherlands|7500
Middelburg|Netherlands|50000
Esch-sur-Alzette|Luxembourg|36000
Differdange|Luxembourg|28000
Dusseldorf|Germany|650000
Dortmund|Germany|590000
Essen|Germany|580000
Leipzig|Germany|620000
Dresden|Germany|560000
Nuremberg|Germany|520000|Nurnberg
Hanover|Germany|540000|Hannover
Bremen|Germany|570000
Bonn|Germany|335000
Duisburg|Germany|500000
Bochum|Germany|365000
Wuppertal|Germany|355000
Bielefeld|Germany|335000
Munster|Germany|315000
Karlsruhe|Germany|310000
Mannheim|Germany|310000
Augsburg|Germany|300000
Wiesbaden|Germany|280000
Mainz|Germany|220000
Chemnitz|Germany|250000
Kiel|Germany|247000
Aachen|Germany|250000
Halle|Germany|240000|Halle (Saale)
Magdeburg|Germany|240000
Lubeck|Germany|217000
Erfurt|Germany|215000
Rostock|Germany|210000
Kassel|Germany|200000
Potsdam|Germany|185000
Saarbrucken|Germany|180000
Regensburg|Germany|155000
Wurzburg|Germany|130000
Ulm|Germany|130000
Heidelberg|Germany|160000
Freiburg|Germany|235000|Freiburg im Breisgau
Trier|Germany|110000
Weimar|Germany|65000
Bamberg|Germany|78000
Rothenburg ob der Tauber|Germany|11000|Rothenburg
Fussen|Germany|15500
Garmisch-Partenkirchen|Germany|27000
Berchtesgaden|Germany|7700
Konstanz|Germany|85000|Constance
Baden-Baden|Germany|55000
Koblenz|Germany|114000
Wittenberg|Germany|46000|Lutherstadt Wittenberg
Gottingen|Germany|120000
Tubingen|Germany|91000
Basel|Switzerland|175000
Lausanne|Switzerland|140000
Lucerne|Switzerland|82000|Luzern
Lugano|Switzerland|63000
St. Gallen|Switzerland|77000|Saint Gallen
Winterthur|Switzerland|115000
Interlaken|Switzerland|5700
Zermatt|Switzerland|5800
Davos|Switzerland|11000
St. Moritz|Switzerland|5100
Montreux|Switzerland|26000
Vevey|Switzerland|20000
Neuchatel|Switzerland|34000
Fribourg|Switzerland|39000
Sion|Switzerland|35000
Chur|Switzerland|39000
Schaffhausen|Switzerland|37000
Thun|Switzerland|44000
Biel|Switzerland|56000|Bienne
Locarno|Switzerland|16000
Bellinzona|Switzerland|44000
Gstaad|Switzerland|2400
Appenzell|Switzerland|5800
Zug|Switzerland|31000
Aarau|Switzerland|22000
Solothurn|Switzerland|17000
Baden|Switzerland|20000
Innsbruck|Austria|132000
Graz|Austria|295000
Linz|Austria|210000
Klagenfurt|Austria|101000
Villach|Austria|63000
Bregenz|Austria|29000
Hallstatt|Austria|780
Kitzbuhel|Austria|8300
Zell am See|Austria|10000
Bad Ischl|Austria|14000
Sankt Polten|Austria|56000|St. Polten
Wels|Austria|63000
Steyr|Austria|38000
Dornbirn|Austria|50000
Feldkirch|Austria|35000
Eisenstadt|Austria|15500
Wiener Neustadt|Austria|46000
Krems|Austria|25000|Krems an der Donau
Solden|Austria|3200
Ischgl|Austria|1600
Schladming|Austria|4400
Schaan|Liechtenstein|6100
Bologna|Italy|390000
Verona|Italy|258000
Palermo|Italy|630000
Bari|Italy|320000
Catania|Italy|300000
Pisa|Italy|90000
Siena|Italy|53000
Padua|Italy|210000|Padova
Trieste|Italy|200000
Brescia|Italy|197000
Parma|Italy|198000
Modena|Italy|185000
Reggio Emilia|Italy|172000
Perugia|Italy|165000
Livorno|Italy|155000
Ravenna|Italy|155000
Cagliari|Italy|150000
Rimini|Italy|150000
Salerno|Italy|130000
Ferrara|Italy|130000
Monza|Italy|123000
Bergamo|Italy|120000
Trento|Italy|118000
Bolzano|Italy|107000|Bozen
Vicenza|Italy|111000
Treviso|Italy|84000
Udine|Italy|100000
Como|Italy|85000
Lucca|Italy|89000
Cremona|Italy|72000
Mantua|Italy|49000|Mantova
Taranto|Italy|190000
Reggio Calabria|Italy|180000
Messina|Italy|230000
Agrigento|Italy|54000
Cefalu|Italy|14000
Taormina|Italy|10500
Amalfi|Italy|5000
Sorrento|Italy|16000
Positano|Italy|3900
Bilbao|Spain|345000
Zaragoza|Spain|680000
Granada|Spain|230000
Toledo|Spain|85000
Salamanca|Spain|144000
Alicante|Spain|338000
Palma|Spain|420000|Palma de Mallorca
Murcia|Spain|460000
Valladolid|Spain|298000
Vigo|Spain|295000
Gijon|Spain|270000
Oviedo|Spain|220000
Santander|Spain|172000
San Sebastian|Spain|188000|Donostia
Pamplona|Spain|203000
Burgos|Spain|175000
Cadiz|Spain|110000
Jerez de la Frontera|Spain|212000
Marbella|Spain|150000
Almeria|Spain|200000
Huelva|Spain|140000
Segovia|Spain|51000
Avila|Spain|58000
Girona|Spain|103000
Tarragona|Spain|135000
Santiago de Compostela|Spain|97000
A Coruna|Spain|246000|Corunna
Vitoria-Gasteiz|Spain|253000
Benidorm|Spain|71000
Torremolinos|Spain|68000
Ronda|Spain|33000
Ceuta|Spain|83000
Melilla|Spain|86000
Elche|Spain|235000
Logrono|Spain|151000
Lleida|Spain|140000
Badajoz|Spain|150000
Caceres|Spain|96000
Braga|Portugal|195000
Coimbra|Portugal|105000
Aveiro|Portugal|80000
Evora|Portugal|57000
Guimaraes|Portugal|160000
Sintra|Portugal|380000
Cascais|Portugal|215000
Setubal|Portugal|125000
Funchal|Portugal|105000
Ponta Delgada|Portugal|68000
Albufeira|Portugal|41000
Nazare|Portugal|10000
Obidos|Portugal|3100
Fatima|Portugal|12000
Braganca|Portugal|21000
Viana do Castelo|Portugal|40000
Vila Nova de Gaia|Portugal|300000
Monte Carlo|Monaco|3800
Serravalle|San Marino|9800
Birkirkara|Malta|22000
Sliema|Malta|18000
St. Paul's Bay|Malta|30000
Mdina|Malta|300
Marsaxlokk|Malta|3500
Mosta|Malta|20000
St. Julian's|Malta|18000
Qormi|Malta|18000
Zabbar|Malta|15000
Limassol|Cyprus|235000
Larnaca|Cyprus|150000
Paphos|Cyprus|64000
Famagusta|Cyprus|40000
Kyrenia|Cyprus|33000|Girne
Ayia Napa|Cyprus|3600|Agia Napa
Patras|Greece|170000
Larissa|Greece|145000
Volos|Greece|86000
Ioannina|Greece|65000
Kavala|Greece|58000
Chania|Greece|54000
Rethymno|Greece|34000
Kalamata|Greece|54000
Corinth|Greece|30000
Piraeus|Greece|163000
Kastoria|Greece|14500
Kozani|Greece|35000
Veria|Greece|38000
Serres|Greece|58000
Xanthi|Greece|55000
Komotini|Greece|55000
Alexandroupoli|Greece|58000
Drama|Greece|45000
Trikala|Greece|61000
Agrinio|Greece|60000
Merida|Mexico|920000
Puerto Vallarta|Mexico|290000
Mazatlan|Mexico|500000
Chihuahua|Mexico|930000
Queretaro|Mexico|1050000|Santiago de Queretaro
San Luis Potosi|Mexico|830000
Aguascalientes|Mexico|950000
Morelia|Mexico|780000
Toluca|Mexico|910000|Toluca de Lerdo
Veracruz|Mexico|610000
Hermosillo|Mexico|940000
Culiacan|Mexico|960000
Saltillo|Mexico|880000
Torreon|Mexico|680000
Mexicali|Mexico|1050000
Ensenada|Mexico|440000
Cabo San Lucas|Mexico|82000
San Jose del Cabo|Mexico|70000
Playa del Carmen|Mexico|300000
Tulum|Mexico|46000
Zacatecas|Mexico|150000
Guanajuato|Mexico|195000
San Miguel de Allende|Mexico|175000
Tuxtla Gutierrez|Mexico|600000
Villahermosa|Mexico|680000
Campeche|Mexico|290000
Durango|Mexico|650000|Victoria de Durango
Xalapa|Mexico|490000
Cuernavaca|Mexico|365000
Nezahualcoyotl|Mexico|1080000
Ecatepec|Mexico|1650000|Ecatepec de Morelos
Naucalpan|Mexico|830000
Zapopan|Mexico|1480000
Tepic|Mexico|445000
Colima|Mexico|160000
Manzanillo|Mexico|190000
Los Mochis|Mexico|450000
Ciudad Obregon|Mexico|430000
Pachuca|Mexico|320000|Pachuca de Soto
Chetumal|Mexico|175000
San Cristobal de las Casas|Mexico|215000
Tapachula|Mexico|350000
Celaya|Mexico|520000
Irapuato|Mexico|590000
Uruapan|Mexico|355000
Chichicastenango|Guatemala|40000
Panajachel|Guatemala|17000
Coban|Guatemala|225000
Huehuetenango|Guatemala|100000
Escuintla|Guatemala|100000
Livingston|Guatemala|80000
La Ceiba|Honduras|205000
Comayagua|Honduras|90000
Choluteca|Honduras|95000
Copan Ruinas|Honduras|10000
Puerto Cortes|Honduras|75000
Danli|Honduras|50000
San Miguel|El Salvador|220000
Santa Tecla|El Salvador|140000|Nueva San Salvador
Soyapango|El Salvador|240000
Sonsonate|El Salvador|90000
La Libertad|El Salvador|40000
Esteli|Nicaragua|130000
Matagalpa|Nicaragua|110000
Chinandega|Nicaragua|130000
Bluefields|Nicaragua|55000
San Juan del Sur|Nicaragua|17000
Alajuela|Costa Rica|50000
Cartago|Costa Rica|150000
Puntarenas|Costa Rica|35000
Heredia|Costa Rica|45000
Jaco|Costa Rica|15000
Colon|Panama|210000
David|Panama|150000
Boquete|Panama|9000
Santiago de Veraguas|Panama|89000
La Chorrera|Panama|180000
Portobelo|Panama|4000
San Ignacio|Belize|21000
Dangriga|Belize|11000
Placencia|Belize|2000
Corozal|Belize|10000
San Pedro|Belize|20000
Cienfuegos|Cuba|150000
Matanzas|Cuba|145000
Pinar del Rio|Cuba|142000
Guantanamo|Cuba|210000
Bayamo|Cuba|130000
Santa Clara|Cuba|210000
Baracoa|Cuba|80000
Vinales|Cuba|17000
Las Tunas|Cuba|175000
Ciego de Avila|Cuba|110000
Puerto Plata|Dominican Republic|160000
La Romana|Dominican Republic|140000
San Pedro de Macoris|Dominican Republic|125000
Higuey|Dominican Republic|280000
Barahona|Dominican Republic|90000
La Vega|Dominican Republic|145000
Sosua|Dominican Republic|25000
Bavaro|Dominican Republic|60000
Gonaives|Haiti|300000
Jacmel|Haiti|40000
Les Cayes|Haiti|75000
Saint-Marc|Haiti|267000
Petion-Ville|Haiti|377000
Carrefour|Haiti|500000
Spanish Town|Jamaica|147000
Mandeville|Jamaica|53000
Negril|Jamaica|8000
Port Antonio|Jamaica|14000
Chaguanas|Trinidad and Tobago|85000
Arima|Trinidad and Tobago|33000
Marsh Harbour|Bahamas|6000
Speightstown|Barbados|3500
Holetown|Barbados|2000
Soufriere|Saint Lucia|8000
Vieux Fort|Saint Lucia|15000
Grenville|Grenada|2400
Codrington|Antigua and Barbuda|800
Charlestown|Saint Kitts and Nevis|1500
Goiania|Brazil|1550000
Belem|Brazil|1300000
Campinas|Brazil|1140000
Sao Luis|Brazil|1100000
Maceio|Brazil|1000000
Natal|Brazil|750000
Teresina|Brazil|870000
Joao Pessoa|Brazil|810000
Florianopolis|Brazil|540000
Cuiaba|Brazil|650000
Campo Grande|Brazil|920000
Santos|Brazil|430000
Niteroi|Brazil|515000
Ouro Preto|Brazil|75000
Foz do Iguacu|Brazil|260000
Petropolis|Brazil|300000
Paraty|Brazil|45000
Buzios|Brazil|34000|Armacao dos Buzios
Sorocaba|Brazil|695000
Ribeirao Preto|Brazil|720000
Uberlandia|Brazil|700000
Londrina|Brazil|580000
Joinville|Brazil|600000
Caxias do Sul|Brazil|520000
Aracaju|Brazil|670000
Porto Velho|Brazil|540000
Macapa|Brazil|520000
Palmas|Brazil|320000
Guarulhos|Brazil|1400000
Olinda|Brazil|395000
Bucaramanga|Colombia|530000
Pereira|Colombia|480000
Santa Marta|Colombia|550000
Manizales|Colombia|435000
Cucuta|Colombia|660000
Ibague|Colombia|530000
Villavicencio|Colombia|530000
Pasto|Colombia|470000
Popayan|Colombia|280000
Neiva|Colombia|350000
Monteria|Colombia|460000
Valledupar|Colombia|480000
Soacha|Colombia|880000
Bello|Colombia|590000
Villa de Leyva|Colombia|17000
Zipaquira|Colombia|140000
Mendoza|Argentina|115000
La Plata|Argentina|645000
Mar del Plata|Argentina|620000
Salta|Argentina|630000
San Miguel de Tucuman|Argentina|550000|Tucuman
San Salvador de Jujuy|Argentina|265000|Jujuy
Bariloche|Argentina|135000|San Carlos de Bariloche
Puerto Madryn|Argentina|100000
El Calafate|Argentina|22000
Puerto Iguazu|Argentina|82000
Neuquen|Argentina|340000
Bahia Blanca|Argentina|305000
Corrientes|Argentina|385000
Resistencia|Argentina|300000
Posadas|Argentina|325000
San Luis|Argentina|205000
Comodoro Rivadavia|Argentina|180000
Santiago del Estero|Argentina|260000
Catamarca|Argentina|180000|San Fernando del Valle de Catamarca
La Rioja|Argentina|384000
Tigre|Argentina|380000
Trujillo|Peru|900000
Chiclayo|Peru|600000
Iquitos|Peru|470000
Piura|Peru|480000
Puno|Peru|130000
Huancayo|Peru|360000
Tacna|Peru|300000
Ayacucho|Peru|210000
Cajamarca|Peru|220000
Huaraz|Peru|120000
Nazca|Peru|50000
Ica|Peru|220000
Chimbote|Peru|360000
Callao|Peru|1000000
Barquisimeto|Venezuela|1000000
Ciudad Guayana|Venezuela|980000
Maracay|Venezuela|960000
Puerto La Cruz|Venezuela|230000
Ciudad Bolivar|Venezuela|380000
Cumana|Venezuela|350000
San Cristobal|Venezuela|280000
Maturin|Venezuela|500000
Coro|Venezuela|195000
Punto Fijo|Venezuela|270000
Concepcion|Chile|230000
Antofagasta|Chile|400000
Vina del Mar|Chile|335000
Punta Arenas|Chile|130000
Puerto Montt|Chile|270000
Iquique|Chile|230000
La Serena|Chile|250000
Temuco|Chile|300000
Arica|Chile|230000
Calama|Chile|165000
Puerto Varas|Chile|45000
Puerto Natales|Chile|22000
Valdivia|Chile|170000
Rancagua|Chile|240000
Cuenca|Ecuador|370000
Manta|Ecuador|270000
Ambato|Ecuador|180000
Loja|Ecuador|205000
Machala|Ecuador|280000
Riobamba|Ecuador|170000
Ibarra|Ecuador|140000
Otavalo|Ecuador|55000
Banos|Ecuador|20000
Puerto Ayora|Ecuador|12000
Esmeraldas|Ecuador|190000
Latacunga|Ecuador|100000
Cochabamba|Bolivia|630000
Oruro|Bolivia|260000
Potosi|Bolivia|190000
Tarija|Bolivia|230000
El Alto|Bolivia|850000
Uyuni|Bolivia|27000
Copacabana|Bolivia|10000
Sorata|Bolivia|3000
Ciudad del Este|Paraguay|340000
Encarnacion|Paraguay|130000
San Lorenzo|Paraguay|260000
Luque|Paraguay|250000
Capiata|Paraguay|240000
Pedro Juan Caballero|Paraguay|100000
Punta del Este|Uruguay|10000
Salto|Uruguay|105000
Colonia del Sacramento|Uruguay|27000
Paysandu|Uruguay|76000
Maldonado|Uruguay|62000
Rivera|Uruguay|64000
Linden|Guyana|27000
New Amsterdam|Guyana|35000
Bartica|Guyana|11000
Nieuw Nickerie|Suriname|13000
Lelydorp|Suriname|19000
Moengo|Suriname|7000
Onitsha|Nigeria|1800000
Ilorin|Nigeria|1300000
Aba|Nigeria|1400000
Warri|Nigeria|1100000
Kaduna|Nigeria|1300000
Enugu|Nigeria|1100000
Owerri|Nigeria|1100000
Jos|Nigeria|1050000
Uyo|Nigeria|1500000
Maiduguri|Nigeria|930000
Zaria|Nigeria|840000
Akure|Nigeria|830000
Bauchi|Nigeria|880000
Sokoto|Nigeria|790000
Calabar|Nigeria|670000
Ogbomosho|Nigeria|730000|Ogbomoso
Katsina|Nigeria|570000
Abeokuta|Nigeria|600000
Makurdi|Nigeria|500000
Minna|Nigeria|470000
Ife|Nigeria|510000
Lokoja|Nigeria|250000
Badagry|Nigeria|380000
Ikeja|Nigeria|320000
Tamale|Ghana|370000
Takoradi|Ghana|250000
Cape Coast|Ghana|170000
Tema|Ghana|400000
Koforidua|Ghana|190000
Sunyani|Ghana|130000
Ho|Ghana|120000
Bolgatanga|Ghana|90000
Elmina|Ghana|34000
Bouake|Ivory Coast|700000
Korhogo|Ivory Coast|280000
Daloa|Ivory Coast|270000
Man|Ivory Coast|150000
Thies|Senegal|365000
Kaolack|Senegal|250000
Ziguinchor|Senegal|230000
Rufisque|Senegal|240000
Mbour|Senegal|280000
Saly|Senegal|20000
Gao|Mali|90000
Mopti|Mali|120000
Djenne|Mali|32000
Segou|Mali|130000
Sikasso|Mali|230000
Kayes|Mali|130000
Kidal|Mali|25000
Koudougou|Burkina Faso|115000
Ouahigouya|Burkina Faso|120000
Zinder|Niger|275000
Maradi|Niger|267000
Agadez|Niger|125000
Tahoua|Niger|135000
Arlit|Niger|78000
Parakou|Benin|255000
Abomey|Benin|90000
Ouidah|Benin|90000
Djougou|Benin|100000
Sokode|Togo|95000
Kara|Togo|100000
Kpalime|Togo|75000
Bo|Sierra Leone|175000
Kenema|Sierra Leone|190000
Makeni|Sierra Leone|130000
Gbarnga|Liberia|55000
Buchanan|Liberia|55000
Harper|Liberia|30000
Nzerekore|Guinea|220000
Kankan|Guinea|230000
Kindia|Guinea|130000
Labe|Guinea|200000
Bafata|Guinea-Bissau|22000
Gabu|Guinea-Bissau|15000
Mindelo|Cape Verde|70000
Assomada|Cape Verde|15000
Nouadhibou|Mauritania|120000
Rosso|Mauritania|50000
Atar|Mauritania|25000
Chinguetti|Mauritania|5000
Port Said|Egypt|750000
Suez|Egypt|690000
Hurghada|Egypt|250000
Mansoura|Egypt|500000
Tanta|Egypt|500000
Ismailia|Egypt|370000
Damietta|Egypt|250000
Asyut|Egypt|450000
Sohag|Egypt|200000
Qena|Egypt|210000
Minya|Egypt|250000
Faiyum|Egypt|350000|Fayoum,Fayyum
Zagazig|Egypt|330000
Beni Suef|Egypt|230000
Marsa Matruh|Egypt|100000|Mersa Matruh
Marsa Alam|Egypt|10000
Dahab|Egypt|15000
El Alamein|Egypt|15000|El-Alamein
Siwa|Egypt|25000
Rosetta|Egypt|150000|Rashid
Kom Ombo|Egypt|65000
Edfu|Egypt|60000
Abu Simbel|Egypt|3000
Helwan|Egypt|630000
Shubra El Kheima|Egypt|1100000
6th of October City|Egypt|350000|October City,Sixth of October City
New Cairo|Egypt|400000
Misrata|Libya|380000
Tobruk|Libya|120000
Sabha|Libya|130000
Derna|Libya|100000
Sirte|Libya|115000
Zawiya|Libya|200000
Bayda|Libya|250000|Al Bayda
Ghadames|Libya|10000
Ajdabiya|Libya|130000
Sfax|Tunisia|955000
Sousse|Tunisia|270000
Kairouan|Tunisia|180000
Bizerte|Tunisia|145000
Gabes|Tunisia|130000
Monastir|Tunisia|100000
Hammamet|Tunisia|100000
Nabeul|Tunisia|90000
Tozeur|Tunisia|35000
Douz|Tunisia|30000
Tataouine|Tunisia|75000
Mahdia|Tunisia|75000
Sidi Bou Said|Tunisia|5000
Carthage|Tunisia|21000
La Marsa|Tunisia|92000
Constantine|Algeria|450000
Annaba|Algeria|470000
Blida|Algeria|400000
Batna|Algeria|300000
Setif|Algeria|300000
Tlemcen|Algeria|200000
Bejaia|Algeria|180000|Bougie
Tizi Ouzou|Algeria|130000
Biskra|Algeria|210000
Ghardaia|Algeria|130000
Tamanrasset|Algeria|100000
Djanet|Algeria|15000
Bechar|Algeria|180000
Ouargla|Algeria|180000
Skikda|Algeria|200000
Mostaganem|Algeria|170000
Sidi Bel Abbes|Algeria|210000
El Oued|Algeria|130000
Agadir|Morocco|480000
Meknes|Morocco|632000
Essaouira|Morocco|80000|Mogador
Chefchaouen|Morocco|43000|Chaouen
Ouarzazate|Morocco|71000
Kenitra|Morocco|450000
Tetouan|Morocco|380000
Sale|Morocco|900000
Safi|Morocco|310000
El Jadida|Morocco|195000
Nador|Morocco|165000
Oujda|Morocco|500000
Beni Mellal|Morocco|195000
Khouribga|Morocco|196000
Taza|Morocco|150000
Al Hoceima|Morocco|56000
Larache|Morocco|125000
Asilah|Morocco|30000
Ifrane|Morocco|15000
Merzouga|Morocco|3000
Erfoud|Morocco|25000
Zagora|Morocco|35000
Tinghir|Morocco|42000
Laayoune|Morocco|235000
Dakhla|Morocco|107000
Port Sudan|Sudan|500000
Kassala|Sudan|450000
El Obeid|Sudan|500000
Nyala|Sudan|600000
Wad Madani|Sudan|380000
El Fasher|Sudan|300000
Atbara|Sudan|120000
Dongola|Sudan|65000
Mzuzu|Malawi|220000
Mekelle|Ethiopia|500000
Hawassa|Ethiopia|350000|Awasa
Jimma|Ethiopia|230000
Axum|Ethiopia|66000|Aksum
Harar|Ethiopia|130000
Adama|Ethiopia|370000|Nazret
Dessie|Ethiopia|280000
Arba Minch|Ethiopia|150000
Debre Markos|Ethiopia|100000
Jijiga|Ethiopia|210000
Shashamane|Ethiopia|175000
Sodo|Ethiopia|175000
Nekemte|Ethiopia|100000
Gambela|Ethiopia|50000
Massawa|Eritrea|53000|Mitsiwa
Keren|Eritrea|150000
Assab|Eritrea|30000
Mendefera|Eritrea|30000
Kismayo|Somalia|235000
Bosaso|Somalia|700000|Boosaaso
Berbera|Somalia|80000
Garowe|Somalia|180000
Baidoa|Somalia|500000|Baydhabo
Galkayo|Somalia|400000|Gaalkacyo
Eldoret|Kenya|475000
Malindi|Kenya|120000
Thika|Kenya|280000
Nyeri|Kenya|125000
Nanyuki|Kenya|76000
Kitale|Kenya|220000
Kericho|Kenya|150000
Meru|Kenya|360000
Garissa|Kenya|120000
Zanzibar City|Tanzania|600000
Moshi|Tanzania|220000
Tanga|Tanzania|280000
Mbeya|Tanzania|385000
Morogoro|Tanzania|470000
Bagamoyo|Tanzania|30000
Iringa|Tanzania|150000
Kigoma|Tanzania|215000
Tabora|Tanzania|225000
Gulu|Uganda|150000
Mbarara|Uganda|195000
Fort Portal|Uganda|55000
Masaka|Uganda|105000
Mbale|Uganda|97000
Lira|Uganda|120000
Kabale|Uganda|55000
Arua|Uganda|82000
Huye|Rwanda|90000|Butare
Musanze|Rwanda|130000
Rubavu|Rwanda|105000|Gisenyi
Muhanga|Rwanda|90000|Gitarama
Ngozi|Burundi|40000
Wau|South Sudan|130000
Malakal|South Sudan|50000
Bor|South Sudan|30000
Toamasina|Madagascar|280000
Antsirabe|Madagascar|240000
Fianarantsoa|Madagascar|200000
Mahajanga|Madagascar|250000
Toliara|Madagascar|170000|Tulear
Antsiranana|Madagascar|115000|Diego Suarez
Morondava|Madagascar|55000
Curepipe|Mauritius|75000
Vacoas-Phoenix|Mauritius|105000
Quatre Bornes|Mauritius|77000
Mutsamudu|Comoros|30000
Fomboni|Comoros|20000
Ndola|Zambia|550000
Kabwe|Zambia|280000
Chingola|Zambia|180000
Mutare|Zimbabwe|260000
Gweru|Zimbabwe|160000
Victoria Falls|Zimbabwe|35000
Masvingo|Zimbabwe|90000
Nampula|Mozambique|745000
Quelimane|Mozambique|350000
Tete|Mozambique|150000
Chimoio|Mozambique|350000
Swakopmund|Namibia|45000
Walvis Bay|Namibia|65000
Luderitz|Namibia|13000
Rundu|Namibia|75000
Francistown|Botswana|100000
Maun|Botswana|60000
Teyateyaneng|Lesotho|75000
Nhlangano|Eswatini|20000
Lobamba|Eswatini|11000
Soweto|South Africa|1300000
Bloemfontein|South Africa|780000
Stellenbosch|South Africa|100000
Kimberley|South Africa|225000
Pietermaritzburg|South Africa|720000
East London|South Africa|830000
Polokwane|South Africa|800000
Mbombela|South Africa|700000|Nelspruit
Rustenburg|South Africa|630000
Potchefstroom|South Africa|200000
George|South Africa|210000
Knysna|South Africa|77000
Vereeniging|South Africa|380000
Welkom|South Africa|210000
Upington|South Africa|100000
Hermanus|South Africa|45000
Paarl|South Africa|120000
Mthatha|South Africa|100000|Umtata
Richards Bay|South Africa|130000
Klerksdorp|South Africa|250000
Bamenda|Cameroon|500000
Garoua|Cameroon|600000
Bafoussam|Cameroon|350000
Maroua|Cameroon|400000
Ngaoundere|Cameroon|300000
Limbe|Cameroon|120000
Buea|Cameroon|200000
Bata|Equatorial Guinea|250000
Port-Gentil|Gabon|140000
Franceville|Gabon|110000
Dolisie|Republic of the Congo|100000
Kananga|Democratic Republic of the Congo|1500000
Bukavu|Democratic Republic of the Congo|1200000
Kolwezi|Democratic Republic of the Congo|600000
Likasi|Democratic Republic of the Congo|500000
Matadi|Democratic Republic of the Congo|300000
Bunia|Democratic Republic of the Congo|450000
Moundou|Chad|140000
Sarh|Chad|130000
Huambo|Angola|900000
Benguela|Angola|555000
Lobito|Angola|300000
Lubango|Angola|300000
Bursa|Turkey|2100000
Adana|Turkey|1800000
Gaziantep|Turkey|2100000
Konya|Turkey|1300000
Trabzon|Turkey|340000
Bodrum|Turkey|190000
Eskisehir|Turkey|900000
Kayseri|Turkey|1100000
Mersin|Turkey|1100000
Samsun|Turkey|800000
Diyarbakir|Turkey|1000000
Van|Turkey|530000
Erzurum|Turkey|400000
Malatya|Turkey|500000
Denizli|Turkey|650000
Sanliurfa|Turkey|1100000
Batman|Turkey|350000
Sivas|Turkey|380000
Manisa|Turkey|460000
Kahramanmaras|Turkey|500000
Antakya|Turkey|230000|Antioch
Tekirdag|Turkey|200000
Kars|Turkey|80000
Rize|Turkey|100000
Ordu|Turkey|220000
Safranbolu|Turkey|50000
Amasya|Turkey|90000
Nevsehir|Turkey|105000
Goreme|Turkey|2000
Kusadasi|Turkey|100000
Marmaris|Turkey|38000
Fethiye|Turkey|90000
Alanya|Turkey|135000
Gelibolu|Turkey|20000|Gallipoli
Iznik|Turkey|22000|Nicaea
Edirne|Turkey|190000|Adrianople
Canakkale|Turkey|130000
Mardin|Turkey|130000
Tabriz|Iran|1560000
Karaj|Iran|1600000
Ahvaz|Iran|1190000|Ahwaz
Qom|Iran|1200000|Qum
Kermanshah|Iran|950000
Urmia|Iran|740000|Orumiyeh
Rasht|Iran|680000
Zahedan|Iran|590000
Hamadan|Iran|550000|Hamedan
Kerman|Iran|540000
Yazd|Iran|530000
Bandar Abbas|Iran|530000
Ardabil|Iran|530000
Arak|Iran|520000
Bushehr|Iran|220000|Bushire
Abadan|Iran|230000
Kashan|Iran|300000
Bam|Iran|127000
Erbil|Iraq|1000000|Hewler,Arbil
Kirkuk|Iraq|1250000
Sulaymaniyah|Iraq|830000|Slemani
Najaf|Iraq|830000
Karbala|Iraq|780000
Nasiriyah|Iraq|700000
Hillah|Iraq|470000
Duhok|Iraq|450000|Dohuk
Fallujah|Iraq|250000
Ramadi|Iraq|220000
Samarra|Iraq|145000
Tikrit|Iraq|110000
Homs|Syria|750000
Latakia|Syria|500000
Hama|Syria|460000
Deir ez-Zor|Syria|210000|Deir el-Zor
Raqqa|Syria|220000|Al-Raqqah
Idlib|Syria|165000
Tartus|Syria|130000
Qamishli|Syria|185000
Palmyra|Syria|51000|Tadmur
Kobani|Syria|45000|Ayn al-Arab
Sidon|Lebanon|100000|Saida
Tyre|Lebanon|70000|Sour
Byblos|Lebanon|40000|Jbeil
Zahle|Lebanon|150000|Zahleh
Baalbek|Lebanon|100000|Baalbeck
Jounieh|Lebanon|100000
Eilat|Israel|56000|Elat
Nazareth|Israel|76000
Beersheba|Israel|220000|Be'er Sheva
Netanya|Israel|230000
Ashdod|Israel|230000
Rishon LeZion|Israel|260000
Petah Tikva|Israel|270000
Holon|Israel|190000
Ramat Gan|Israel|170000
Herzliya|Israel|110000
Tiberias|Israel|52000
Safed|Israel|39000|Tzfat
Acre|Israel|53000|Akko
Ashkelon|Israel|170000
Rehovot|Israel|155000
Caesarea|Israel|5000
Hebron|Palestine|215000|Al-Khalil
Nablus|Palestine|156000
Jericho|Palestine|20000|Ariha
Jenin|Palestine|40000
Khan Yunis|Palestine|205000
Rafah|Palestine|171000
Aqaba|Jordan|150000
Irbid|Jordan|430000
Zarqa|Jordan|500000
Madaba|Jordan|70000
Jerash|Jordan|50000
Dammam|Saudi Arabia|1390000
Taif|Saudi Arabia|560000
Khobar|Saudi Arabia|410000|Al Khobar
Tabuk|Saudi Arabia|590000
Abha|Saudi Arabia|330000
Buraidah|Saudi Arabia|570000
Hail|Saudi Arabia|450000
Najran|Saudi Arabia|380000
Jizan|Saudi Arabia|170000|Jazan
Yanbu|Saudi Arabia|330000
Jubail|Saudi Arabia|470000
Al-Ula|Saudi Arabia|60000|AlUla
Hofuf|Saudi Arabia|730000|Al-Hofuf,Hufuf
Dhahran|Saudi Arabia|140000
Aden|Yemen|900000
Taiz|Yemen|700000|Ta'izz
Al Hudaydah|Yemen|700000|Hodeidah
Mukalla|Yemen|300000
Ibb|Yemen|230000
Salalah|Oman|350000
Nizwa|Oman|90000
Sohar|Oman|200000
Sur|Oman|120000
Sharjah|United Arab Emirates|1800000
Al Ain|United Arab Emirates|770000
Ajman|United Arab Emirates|540000
Ras Al Khaimah|United Arab Emirates|345000
Fujairah|United Arab Emirates|190000
Umm Al Quwain|United Arab Emirates|72000
Khor Fakkan|United Arab Emirates|40000
Al Wakrah|Qatar|106000
Al Khor|Qatar|65000
Lusail|Qatar|40000
Riffa|Bahrain|200000
Hamad Town|Bahrain|150000
Hawalli|Kuwait|160000
Salmiya|Kuwait|170000
Jahra|Kuwait|180000|Al Jahra
Kutaisi|Georgia|150000
Rustavi|Georgia|125000
Gori|Georgia|45000
Zugdidi|Georgia|42000
Mtskheta|Georgia|8000
Telavi|Georgia|20000
Mestia|Georgia|2500
Gyumri|Armenia|113000
Vanadzor|Armenia|75000
Dilijan|Armenia|18000
Goris|Armenia|20000
Jermuk|Armenia|4000
Ganja|Azerbaijan|335000
Sumqayit|Azerbaijan|340000
Mingachevir|Azerbaijan|100000
Lankaran|Azerbaijan|55000
Shaki|Azerbaijan|65000
Nakhchivan|Azerbaijan|90000
Portsmouth|United Kingdom|210000
Faro|Portugal|65000
Lodz|Poland|650000
Poznan|Poland|540000
Szczecin|Poland|390000
Lublin|Poland|330000
Bydgoszcz|Poland|320000
Bialystok|Poland|295000
Katowice|Poland|280000
Gdynia|Poland|245000
Czestochowa|Poland|210000
Radom|Poland|205000
Rzeszow|Poland|196000
Torun|Poland|195000
Sosnowiec|Poland|190000
Kielce|Poland|185000
Gliwice|Poland|170000
Olsztyn|Poland|170000
Bielsko-Biala|Poland|168000
Zabrze|Poland|160000
Zielona Gora|Poland|140000
Tychy|Poland|125000
Opole|Poland|125000
Gorzow Wielkopolski|Poland|123000
Elblag|Poland|115000
Plock|Poland|115000
Walbrzych|Poland|105000
Tarnow|Poland|105000
Zakopane|Poland|27000
Zamosc|Poland|62000
Oswiecim|Poland|37000|Auschwitz
Sopot|Poland|34000
Ostrava|Czechia|280000
Plzen|Czechia|175000
Olomouc|Czechia|100000
Liberec|Czechia|104000
Ceske Budejovice|Czechia|95000
Hradec Kralove|Czechia|92000
Usti nad Labem|Czechia|92000
Pardubice|Czechia|90000
Zlin|Czechia|74000
Karlovy Vary|Czechia|48000
Cesky Krumlov|Czechia|13000
Kutna Hora|Czechia|20000
Jihlava|Czechia|51000
Trebic|Czechia|34000
Znojmo|Czechia|33000
Tabor|Czechia|34000
Opava|Czechia|55000
Decin|Czechia|48000
Kosice|Slovakia|230000
Presov|Slovakia|89000
Zilina|Slovakia|80000
Nitra|Slovakia|76000
Banska Bystrica|Slovakia|76000
Trnava|Slovakia|63000
Trencin|Slovakia|55000
Martin|Slovakia|54000
Poprad|Slovakia|50000
Piestany|Slovakia|28000
Bardejov|Slovakia|32000
Levoca|Slovakia|14000
Banska Stiavnica|Slovakia|5000
Debrecen|Hungary|200000
Szeged|Hungary|160000
Miskolc|Hungary|150000
Pecs|Hungary|140000
Gyor|Hungary|130000
Nyiregyhaza|Hungary|116000
Kecskemet|Hungary|110000
Szekesfehervar|Hungary|96000
Szombathely|Hungary|76000
Sopron|Hungary|62000
Tatabanya|Hungary|64000
Kaposvar|Hungary|60000
Zalaegerszeg|Hungary|57000
Veszprem|Hungary|55000
Bekescsaba|Hungary|55000
Eger|Hungary|50000
Esztergom|Hungary|28000
Szentendre|Hungary|26000
Visegrad|Hungary|1800
Tokaj|Hungary|4300
Tiraspol|Moldova|130000
Balti|Moldova|97000
Bender|Moldova|90000
Cahul|Moldova|28000
Orhei|Moldova|26000
Comrat|Moldova|20000
Timisoara|Romania|250000
Iasi|Romania|290000
Constanta|Romania|280000
Craiova|Romania|230000
Brasov|Romania|250000
Galati|Romania|220000
Ploiesti|Romania|180000
Oradea|Romania|190000
Braila|Romania|155000
Arad|Romania|150000
Pitesti|Romania|150000
Sibiu|Romania|135000
Bacau|Romania|130000
Targu Mures|Romania|120000
Baia Mare|Romania|110000
Buzau|Romania|100000
Satu Mare|Romania|98000
Suceava|Romania|92000
Sighisoara|Romania|26000
Sinaia|Romania|9000
Bran|Romania|5700
Alba Iulia|Romania|63000
Varna|Bulgaria|330000
Burgas|Bulgaria|200000
Ruse|Bulgaria|140000
Stara Zagora|Bulgaria|130000
Pleven|Bulgaria|90000
Sliven|Bulgaria|80000
Dobrich|Bulgaria|80000
Shumen|Bulgaria|65000
Pernik|Bulgaria|70000
Haskovo|Bulgaria|65000
Pazardzhik|Bulgaria|65000
Blagoevgrad|Bulgaria|65000
Veliko Tarnovo|Bulgaria|65000
Vratsa|Bulgaria|50000
Gabrovo|Bulgaria|48000
Kazanlak|Bulgaria|45000
Montana|Bulgaria|35000
Nesebar|Bulgaria|11000
Sozopol|Bulgaria|4500
Koprivshtitsa|Bulgaria|2000
Dnipro|Ukraine|980000|Dnipropetrovsk
Donetsk|Ukraine|900000
Zaporizhzhia|Ukraine|710000
Mariupol|Ukraine|430000
Mykolaiv|Ukraine|470000
Vinnytsia|Ukraine|370000
Kherson|Ukraine|280000
Poltava|Ukraine|280000
Chernihiv|Ukraine|280000
Cherkasy|Ukraine|270000
Sumy|Ukraine|260000
Zhytomyr|Ukraine|260000
Khmelnytskyi|Ukraine|270000
Rivne|Ukraine|245000
Ivano-Frankivsk|Ukraine|235000
Ternopil|Ukraine|225000
Lutsk|Ukraine|215000
Uzhhorod|Ukraine|115000
Chernivtsi|Ukraine|265000|Czernowitz
Kropyvnytskyi|Ukraine|220000|Kirovohrad
Kremenchuk|Ukraine|217000
Bila Tserkva|Ukraine|200000
Melitopol|Ukraine|150000
Sevastopol|Ukraine|450000
Simferopol|Ukraine|340000
Yalta|Ukraine|78000
Kerch|Ukraine|150000
Kryvyi Rih|Ukraine|600000
Kamianets-Podilskyi|Ukraine|27000
Uman|Ukraine|80000
Gomel|Belarus|510000
Mogilev|Belarus|370000
Vitebsk|Belarus|360000
Grodno|Belarus|360000
Babruysk|Belarus|160000
Baranovichi|Belarus|168000
Barysaw|Belarus|140000
Pinsk|Belarus|125000
Orsha|Belarus|110000
Mazyr|Belarus|110000
Polotsk|Belarus|80000
Nesvizh|Belarus|14000
Kaunas|Lithuania|350000
Klaipeda|Lithuania|150000|Memel
Siauliai|Lithuania|95000
Panevezys|Lithuania|80000
Trakai|Lithuania|5000
Palanga|Lithuania|17000
Druskininkai|Lithuania|20000
Daugavpils|Latvia|80000
Liepaja|Latvia|68000
Jelgava|Latvia|55000
Jurmala|Latvia|48000
Sigulda|Latvia|11000
Tartu|Estonia|93000
Narva|Estonia|53000
Parnu|Estonia|40000
Kohtla-Jarve|Estonia|30000
Viljandi|Estonia|17000
Kuressaare|Estonia|13000
Maribor|Slovenia|95000
Celje|Slovenia|38000
Kranj|Slovenia|38000
Koper|Slovenia|25000
Novo Mesto|Slovenia|24000
Ptuj|Slovenia|18000
Piran|Slovenia|4000
Portoroz|Slovenia|2700
Postojna|Slovenia|9000
Rijeka|Croatia|108000
Zadar|Croatia|75000
Osijek|Croatia|85000
Pula|Croatia|57000
Sibenik|Croatia|34000
Varazdin|Croatia|38000
Karlovac|Croatia|46000
Slavonski Brod|Croatia|53000
Rovinj|Croatia|14000
Porec|Croatia|16000
Opatija|Croatia|11000
Trogir|Croatia|10000
Makarska|Croatia|14000
Banja Luka|Bosnia and Herzegovina|140000
Tuzla|Bosnia and Herzegovina|110000
Zenica|Bosnia and Herzegovina|110000
Bihac|Bosnia and Herzegovina|56000
Trebinje|Bosnia and Herzegovina|30000
Jajce|Bosnia and Herzegovina|25000
Travnik|Bosnia and Herzegovina|24000
Srebrenica|Bosnia and Herzegovina|13000
Novi Sad|Serbia|250000
Nis|Serbia|185000
Kragujevac|Serbia|150000
Subotica|Serbia|105000
Zrenjanin|Serbia|76000
Pancevo|Serbia|76000
Cacak|Serbia|73000
Novi Pazar|Serbia|68000
Kraljevo|Serbia|64000
Smederevo|Serbia|63000
Leskovac|Serbia|60000
Uzice|Serbia|55000
Valjevo|Serbia|57000
Sabac|Serbia|53000
Niksic|Montenegro|56000
Budva|Montenegro|20000
Kotor|Montenegro|13000
Bar|Montenegro|17000
Ulcinj|Montenegro|11000
Herceg Novi|Montenegro|12000
Cetinje|Montenegro|14000
Tivat|Montenegro|10000
Prizren|Kosovo|85000
Peja|Kosovo|48000
Gjakova|Kosovo|40000
Mitrovica|Kosovo|71000
Ferizaj|Kosovo|40000
Gjilan|Kosovo|45000
Bitola|North Macedonia|74000
Kumanovo|North Macedonia|70000
Ohrid|North Macedonia|42000
Prilep|North Macedonia|66000
Tetovo|North Macedonia|53000
Stip|North Macedonia|43000
Strumica|North Macedonia|35000
Struga|North Macedonia|16000
Durres|Albania|113000
Vlore|Albania|80000
Shkoder|Albania|77000
Elbasan|Albania|78000
Korce|Albania|51000
Fier|Albania|55000
Berat|Albania|32000
Gjirokaster|Albania|19000
Sarande|Albania|17000
Nizhny Novgorod|Russia|1250000|Gorky
Chelyabinsk|Russia|1180000
Samara|Russia|1140000|Kuybyshev
Omsk|Russia|1120000
Rostov-on-Don|Russia|1140000
Ufa|Russia|1150000
Krasnoyarsk|Russia|1190000
Perm|Russia|1050000
Voronezh|Russia|1050000
Krasnodar|Russia|950000
Saratov|Russia|840000
Tyumen|Russia|830000
Tolyatti|Russia|680000
Izhevsk|Russia|640000
Barnaul|Russia|630000
Ulyanovsk|Russia|610000|Simbirsk
Irkutsk|Russia|590000
Khabarovsk|Russia|610000
Yaroslavl|Russia|570000
Makhachkala|Russia|600000
Tomsk|Russia|540000
Orenburg|Russia|560000
Kemerovo|Russia|550000
Naberezhnye Chelny|Russia|530000
Ryazan|Russia|520000
Lipetsk|Russia|500000
Cheboksary|Russia|500000
Kaliningrad|Russia|490000|Konigsberg
Kirov|Russia|480000
Tula|Russia|460000
Ulan-Ude|Russia|440000
Vladikavkaz|Russia|310000
Chita|Russia|330000
Vladimir|Russia|340000
Arkhangelsk|Russia|340000
Murmansk|Russia|270000
Veliky Novgorod|Russia|225000
Yakutsk|Russia|370000
Grozny|Russia|300000
Petropavlovsk-Kamchatsky|Russia|160000
Yuzhno-Sakhalinsk|Russia|200000
Norilsk|Russia|180000
Magadan|Russia|92000
Sergiev Posad|Russia|100000
Odense|Denmark|180000
Aalborg|Denmark|140000
Esbjerg|Denmark|72000
Randers|Denmark|64000
Kolding|Denmark|61000
Vejle|Denmark|60000
Roskilde|Denmark|51000
Helsingor|Denmark|47000
Skagen|Denmark|7700
Ronne|Denmark|13000
Stavanger|Norway|145000
Trondheim|Norway|210000
Drammen|Norway|104000
Kristiansand|Norway|114000
Alesund|Norway|68000
Bodo|Norway|54000
Narvik|Norway|14000
Lillehammer|Norway|28000
Hammerfest|Norway|11000
Alta|Norway|15000
Longyearbyen|Norway|2400
Uppsala|Sweden|180000
Vasteras|Sweden|130000
Orebro|Sweden|130000
Linkoping|Sweden|115000
Helsingborg|Sweden|115000
Jonkoping|Sweden|100000
Umea|Sweden|90000
Lund|Sweden|95000
Gavle|Sweden|75000
Sundsvall|Sweden|54000
Lulea|Sweden|48000
Kiruna|Sweden|17000
Visby|Sweden|24000
Kalmar|Sweden|40000
Espoo|Finland|305000
Vantaa|Finland|245000
Oulu|Finland|210000
Jyvaskyla|Finland|145000
Kuopio|Finland|123000
Lahti|Finland|120000
Pori|Finland|83000
Joensuu|Finland|78000
Lappeenranta|Finland|73000
Vaasa|Finland|68000
Rovaniemi|Finland|63000
Kotka|Finland|53000
Porvoo|Finland|52000
Akureyri|Iceland|19000
Kopavogur|Iceland|39000
Hafnarfjordur|Iceland|30000
Keflavik|Iceland|9000
Selfoss|Iceland|9000
Husavik|Iceland|2300
Isafjordur|Iceland|2700
Vik|Iceland|700
Jalalabad|Afghanistan|400000
Kunduz|Afghanistan|300000
Ghazni|Afghanistan|200000
Bamyan|Afghanistan|100000|Bamiyan
Lashkar Gah|Afghanistan|200000
Khost|Afghanistan|160000
Taloqan|Afghanistan|200000
Pul-e-Khumri|Afghanistan|130000|Pul-i-Khumri
Faizabad|Afghanistan|60000
Charikar|Afghanistan|100000
Zaranj|Afghanistan|50000
Farah|Afghanistan|50000
Sheberghan|Afghanistan|150000|Shibirghan
Maimana|Afghanistan|90000|Maymana
Gardez|Afghanistan|75000
Rawalpindi|Pakistan|2100000
Peshawar|Pakistan|2000000
Multan|Pakistan|2000000
Gujranwala|Pakistan|2200000
Quetta|Pakistan|1140000
Sialkot|Pakistan|750000
Sargodha|Pakistan|700000
Bahawalpur|Pakistan|900000
Sukkur|Pakistan|620000
Larkana|Pakistan|490000
Sheikhupura|Pakistan|660000
Gujrat|Pakistan|420000
Jhang|Pakistan|400000
Rahim Yar Khan|Pakistan|480000
Mardan|Pakistan|400000
Abbottabad|Pakistan|210000
Mingora|Pakistan|375000
Dera Ghazi Khan|Pakistan|190000
Gilgit|Pakistan|80000
Skardu|Pakistan|45000
Muzaffarabad|Pakistan|105000
Chitral|Pakistan|25000
Murree|Pakistan|22000
Taxila|Pakistan|40000
Karimabad|Pakistan|6000
Gwadar|Pakistan|90000
Turbat|Pakistan|190000
Indore|India|2200000
Bhopal|India|2000000
Patna|India|2050000
Vadodara|India|2100000|Baroda
Ludhiana|India|1650000
Coimbatore|India|1100000
Madurai|India|1200000
Visakhapatnam|India|2200000|Vizag
Nashik|India|1600000
Rajkot|India|1450000
Guwahati|India|1100000
Chandigarh|India|1060000
Mysore|India|990000|Mysuru
Thiruvananthapuram|India|960000|Trivandrum
Jodhpur|India|1100000
Udaipur|India|470000
Shimla|India|170000
Darjeeling|India|120000
Dehradun|India|800000
Srinagar|India|1200000
Jammu|India|500000
Bhubaneswar|India|900000
Ranchi|India|1100000
Raipur|India|1050000
Gwalior|India|1100000
Prayagraj|India|1500000|Allahabad
Mangalore|India|620000|Mangaluru
Puducherry|India|250000|Pondicherry
Rishikesh|India|100000
Haridwar|India|230000
Ajmer|India|550000
Pushkar|India|22000
Meerut|India|1420000
Ghaziabad|India|1730000
Noida|India|700000
Gurgaon|India|1150000|Gurugram
Faridabad|India|1400000
Thane|India|1900000
Navi Mumbai|India|1120000
Vijayawada|India|1050000
Guntur|India|650000
Tirupati|India|375000
Warangal|India|820000
Jalandhar|India|870000
Patiala|India|450000
Bathinda|India|290000
Shillong|India|355000
Gangtok|India|100000
Imphal|India|270000
Aizawl|India|290000
Kohima|India|115000
Itanagar|India|60000
Agartala|India|520000
Siliguri|India|700000
Gaya|India|470000
Muzaffarpur|India|400000
Bhagalpur|India|400000
Cuttack|India|700000
Puri|India|200000
Jamshedpur|India|700000
Dhanbad|India|1200000
Howrah|India|1080000
Asansol|India|570000
Durgapur|India|580000
Jabalpur|India|1270000
Ujjain|India|515000
Leh|India|30000
Manali|India|8000
Dharamshala|India|30000
Mathura|India|350000
Ayodhya|India|78000
Hampi|India|2500
Ooty|India|90000|Udhagamandalam,Udagamandalam
Munnar|India|30000
Kozhikode|India|610000|Calicut
Thrissur|India|315000
Kollam|India|400000
Kannur|India|230000
Kottayam|India|80000
Tiruchirappalli|India|920000|Trichy
Vellore|India|500000
Kanyakumari|India|20000
Thanjavur|India|290000
Hubli|India|950000|Hubballi
Belgaum|India|610000|Belagavi
Panaji|India|115000|Panjim
Solapur|India|950000
Kolhapur|India|550000
Chhatrapati Sambhajinagar|India|1175000|Aurangabad
Lalitpur|Nepal|285000|Patan
Bhaktapur|Nepal|90000
Biratnagar|Nepal|250000
Birgunj|Nepal|240000
Butwal|Nepal|200000
Dharan|Nepal|175000
Janakpur|Nepal|190000
Nepalgunj|Nepal|140000
Hetauda|Nepal|120000
Lumbini|Nepal|25000
Namche Bazaar|Nepal|1700
Lukla|Nepal|2000
Gorkha|Nepal|25000
Bandipur|Nepal|6000
Nagarkot|Nepal|4000
Jomsom|Nepal|2500
Phuentsholing|Bhutan|20000
Paro|Bhutan|12000
Punakha|Bhutan|7000
Trongsa|Bhutan|5000
Jakar|Bhutan|2000
Khulna|Bangladesh|1500000
Sylhet|Bangladesh|700000
Rajshahi|Bangladesh|900000
Cox's Bazar|Bangladesh|100000
Comilla|Bangladesh|400000|Cumilla
Narayanganj|Bangladesh|700000
Gazipur|Bangladesh|500000
Rangpur|Bangladesh|700000
Mymensingh|Bangladesh|500000
Barisal|Bangladesh|400000|Barishal
Bogra|Bangladesh|400000|Bogura
Jessore|Bangladesh|250000|Jashore
Dinajpur|Bangladesh|200000
Tangail|Bangladesh|180000
Pabna|Bangladesh|160000
Kushtia|Bangladesh|165000
Faridpur|Bangladesh|130000
Galle|Sri Lanka|100000
Jaffna|Sri Lanka|90000
Negombo|Sri Lanka|145000
Trincomalee|Sri Lanka|100000
Batticaloa|Sri Lanka|95000
Anuradhapura|Sri Lanka|63000
Polonnaruwa|Sri Lanka|15000
Nuwara Eliya|Sri Lanka|27000
Ella|Sri Lanka|2500
Dambulla|Sri Lanka|65000
Matara|Sri Lanka|76000
Kurunegala|Sri Lanka|30000
Ratnapura|Sri Lanka|48000
Bentota|Sri Lanka|8000
Hikkaduwa|Sri Lanka|18000
Mirissa|Sri Lanka|2000
Arugam Bay|Sri Lanka|1000
Kalutara|Sri Lanka|40000
Moratuwa|Sri Lanka|210000
Dehiwala-Mount Lavinia|Sri Lanka|245000
Addu City|Maldives|34000
Mawlamyine|Myanmar|300000
Bago|Myanmar|250000
Pathein|Myanmar|250000
Taunggyi|Myanmar|400000
Bagan|Myanmar|60000
Sittwe|Myanmar|150000
Myitkyina|Myanmar|150000
Pyin Oo Lwin|Myanmar|100000|Maymyo
Hpa-An|Myanmar|65000
Chiang Rai|Thailand|70000
Ayutthaya|Thailand|55000
Krabi|Thailand|30000
Nakhon Ratchasima|Thailand|130000|Korat
Udon Thani|Thailand|140000
Hat Yai|Thailand|160000
Sukhothai|Thailand|20000
Kanchanaburi|Thailand|30000
Hua Hin|Thailand|55000
Nonthaburi|Thailand|260000
Chonburi|Thailand|100000
Nakhon Si Thammarat|Thailand|100000
Johor Bahru|Malaysia|900000
Malacca City|Malaysia|180000
Kota Kinabalu|Malaysia|500000
Kuching|Malaysia|700000
Ipoh|Malaysia|750000
Shah Alam|Malaysia|750000
Petaling Jaya|Malaysia|620000
Miri|Malaysia|350000
Alor Setar|Malaysia|400000|Alor Star
Kuantan|Malaysia|500000
Sihanoukville|Cambodia|155000
Battambang|Cambodia|190000
Kampot|Cambodia|90000
Kep|Cambodia|41000
Kampong Cham|Cambodia|65000
Pakse|Laos|88000
Vang Vieng|Laos|25000
Savannakhet|Laos|125000
Phonsavan|Laos|35000
Kuala Belait|Brunei|30000
Seria|Brunei|32000
Baucau|Timor-Leste|17000
Maliana|Timor-Leste|9000
Suai|Timor-Leste|13000
Nha Trang|Vietnam|550000
Can Tho|Vietnam|1200000
Hoi An|Vietnam|120000
Da Lat|Vietnam|250000
Vung Tau|Vietnam|450000
Ha Long|Vietnam|300000
Sa Pa|Vietnam|60000
Phan Thiet|Vietnam|270000
Buon Ma Thuot|Vietnam|340000
Thanh Hoa|Vietnam|400000
Vinh|Vietnam|350000
Hai Duong|Vietnam|350000
Nam Dinh|Vietnam|360000
Bien Hoa|Vietnam|1100000
Semarang|Indonesia|1700000
Palembang|Indonesia|1700000
Denpasar|Indonesia|900000
Malang|Indonesia|850000
Padang|Indonesia|950000
Balikpapan|Indonesia|700000
Manado|Indonesia|450000
Banda Aceh|Indonesia|260000
Pontianak|Indonesia|650000
Jayapura|Indonesia|400000
Surakarta|Indonesia|520000|Solo
Bogor|Indonesia|1100000
Bekasi|Indonesia|2500000
Tangerang|Indonesia|2000000
Depok|Indonesia|2100000
Pekanbaru|Indonesia|1100000
Samarinda|Indonesia|830000
Banjarmasin|Indonesia|700000
Ubud|Indonesia|30000
Kuta|Indonesia|15000
Labuan Bajo|Indonesia|15000
Bukittinggi|Indonesia|120000
Iloilo City|Philippines|460000
Zamboanga City|Philippines|1000000
Baguio|Philippines|370000
Bacolod|Philippines|620000
Cagayan de Oro|Philippines|700000
General Santos|Philippines|700000
Tacloban|Philippines|250000
Puerto Princesa|Philippines|300000
Dumaguete|Philippines|135000
Vigan|Philippines|55000
Makati|Philippines|630000
Taguig|Philippines|900000
Pasig|Philippines|800000
Caloocan|Philippines|1700000
Lapu-Lapu City|Philippines|460000
Suzhou|China|12900000
Dongguan|China|10500000
Zhengzhou|China|12900000
Changsha|China|10500000
Kunming|China|8600000
Jinan|China|9200000
Dalian|China|7500000
Xiamen|China|5300000
Fuzhou|China|8300000
Guilin|China|4900000
Nanning|China|8800000
Urumqi|China|4000000|Wulumuqi
Hohhot|China|3500000
Lanzhou|China|4400000
Xining|China|2500000
Changchun|China|9000000
Ningbo|China|9600000
Wuxi|China|7500000
Hefei|China|9600000
Nanchang|China|6500000
Taiyuan|China|5400000
Shijiazhuang|China|11200000
Guiyang|China|6300000
Haikou|China|2900000
Sanya|China|1100000
Kashgar|China|730000
Dunhuang|China|190000
Datong|China|3100000
Luoyang|China|7100000
Zhangjiajie|China|1600000
Lijiang|China|1300000
Dali City|China|660000
Turpan|China|690000|Turfan
Jiayuguan|China|300000
Shigatse|China|800000|Xigaze
Nara|Japan|350000
Nagasaki|Japan|400000
Sendai|Japan|1090000
Kawasaki|Japan|1540000
Kanazawa|Japan|460000
Okayama|Japan|720000
Kumamoto|Japan|740000
Kagoshima|Japan|590000
Niigata|Japan|780000
Himeji|Japan|520000
Matsuyama|Japan|510000
Nikko|Japan|80000
Hakone|Japan|11000
Kamakura|Japan|170000
Takayama|Japan|85000
Nagano|Japan|370000
Otsu|Japan|340000
Beppu|Japan|110000
Naha|Japan|320000
Asahikawa|Japan|320000
Hakodate|Japan|240000
Otaru|Japan|105000
Aomori|Japan|265000
Morioka|Japan|280000
Akita|Japan|300000
Yamagata|Japan|240000
Fukushima|Japan|275000
Daegu|South Korea|2370000
Daejeon|South Korea|1440000
Gwangju|South Korea|1410000
Ulsan|South Korea|1110000
Suwon|South Korea|1190000
Jeju City|South Korea|490000
Gyeongju|South Korea|250000
Chuncheon|South Korea|285000
Gangneung|South Korea|210000
Jeonju|South Korea|650000
Kaesong|North Korea|200000
Wonsan|North Korea|360000
Chongjin|North Korea|670000
Sinuiju|North Korea|360000
Taichung|Taiwan|2820000
Tainan|Taiwan|1860000
Hsinchu|Taiwan|450000
Keelung|Taiwan|360000
Taoyuan|Taiwan|2270000
Chiayi|Taiwan|265000
Changhua|Taiwan|230000
Hualien|Taiwan|100000
Erdenet|Mongolia|100000
Darkhan|Mongolia|90000
Choibalsan|Mongolia|40000
Olgii|Mongolia|30000
Khovd|Mongolia|30000
Moron|Mongolia|40000
Karaganda|Kazakhstan|500000
Aktobe|Kazakhstan|440000
Taraz|Kazakhstan|360000
Pavlodar|Kazakhstan|340000
Oskemen|Kazakhstan|330000|Ust-Kamenogorsk
Semey|Kazakhstan|320000|Semipalatinsk
Atyrau|Kazakhstan|310000
Kostanay|Kazakhstan|250000|Kustanay
Kyzylorda|Kazakhstan|250000
Oral|Kazakhstan|235000|Uralsk
Petropavl|Kazakhstan|220000|Petropavlovsk
Aktau|Kazakhstan|200000
Temirtau|Kazakhstan|180000
Turkistan|Kazakhstan|200000|Turkestan
Kokshetau|Kazakhstan|150000
Taldykorgan|Kazakhstan|150000
Ekibastuz|Kazakhstan|130000
Baikonur|Kazakhstan|70000
Namangan|Uzbekistan|650000
Andijan|Uzbekistan|450000|Andijon
Nukus|Uzbekistan|330000
Fergana|Uzbekistan|300000|Farg'ona
Qarshi|Uzbekistan|270000|Karshi
Termez|Uzbekistan|180000
Urgench|Uzbekistan|150000
Jizzakh|Uzbekistan|180000
Kokand|Uzbekistan|240000
Margilan|Uzbekistan|220000
Navoi|Uzbekistan|140000|Navoiy
Shahrisabz|Uzbekistan|72000|Shakhrisabz
Moynaq|Uzbekistan|9000|Muynak
Karakol|Kyrgyzstan|85000
Jalal-Abad|Kyrgyzstan|100000
Tokmok|Kyrgyzstan|55000
Naryn|Kyrgyzstan|40000
Cholpon-Ata|Kyrgyzstan|19000
Talas|Kyrgyzstan|35000
Kulob|Tajikistan|100000|Kulyab
Bokhtar|Tajikistan|90000|Qurghonteppa,Kurgan-Tyube
Istaravshan|Tajikistan|65000
Panjakent|Tajikistan|40000|Panjikent
Khorugh|Tajikistan|30000|Khorog
Turkmenabat|Turkmenistan|260000|Chardzhou,Chardjew
Dashoguz|Turkmenistan|200000|Dashhowuz
Mary|Turkmenistan|130000
Balkanabat|Turkmenistan|100000|Nebitdag,Nebit-Dag
Turkmenbashi|Turkmenistan|70000|Krasnovodsk
Hobart|Australia|250000
Cairns|Australia|160000
Townsville|Australia|180000
Geelong|Australia|280000
Wollongong|Australia|300000
Alice Springs|Australia|26000
Broome|Australia|15000
Byron Bay|Australia|9000
Sunshine Coast|Australia|350000
Toowoomba|Australia|140000
Ballarat|Australia|115000
Bendigo|Australia|100000
Launceston|Australia|90000
Fremantle|Australia|30000
Mackay|Australia|125000
Rockhampton|Australia|82000
Coffs Harbour|Australia|80000
Kalgoorlie|Australia|30000
Albury|Australia|55000
Bunbury|Australia|75000
Bundaberg|Australia|95000
Mount Isa|Australia|18000
Geraldton|Australia|40000
Devonport|Australia|30000
Wagga Wagga|Australia|65000
Dunedin|New Zealand|135000
Tauranga|New Zealand|155000
Queenstown|New Zealand|16000
Rotorua|New Zealand|58000
Napier|New Zealand|66000
Invercargill|New Zealand|56000
Palmerston North|New Zealand|90000
Whangarei|New Zealand|60000
New Plymouth|New Zealand|60000
Whanganui|New Zealand|43000
Wanaka|New Zealand|10000
Taupo|New Zealand|26000
Lower Hutt|New Zealand|112000
Mount Hagen|Papua New Guinea|46000
Madang|Papua New Guinea|30000
Rabaul|Papua New Guinea|3000
Goroka|Papua New Guinea|20000
Wewak|Papua New Guinea|30000
Kokopo|Papua New Guinea|27000
Lautoka|Fiji|71000
Labasa|Fiji|27000
Nausori|Fiji|25000
Auki|Solomon Islands|6000
Luganville|Vanuatu|16000
Salelologa|Samoa|4000
Neiafu|Tonga|4000
`;
