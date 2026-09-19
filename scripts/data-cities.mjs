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
Alexandria (Egypt)|Egypt|5500000
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
Bethlehem (Palestine)|Palestine|29000
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
Kochi (India)|India|600000|Cochin
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
George Town|Malaysia|790000|Georgetown
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
Hamburg (Germany)|Germany|1900000
Frankfurt (Main)|Germany|770000|Frankfurt am Main
Cologne|Germany|1100000|Koln,Koeln
Stuttgart|Germany|630000
Marseille|France|870000|Marseilles
Lyon|France|520000|Lyons
Nice|France|340000
Toulouse|France|500000
Bordeaux|France|260000
Manchester (England)|United Kingdom|550000
Birmingham (England)|United Kingdom|1150000
Liverpool|United Kingdom|490000
Glasgow|United Kingdom|630000
Edinburgh|United Kingdom|510000
Oxford|United Kingdom|160000
Cambridge (England)|United Kingdom|150000
Leeds|United Kingdom|810000
Bristol (England)|United Kingdom|470000
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
Saint Petersburg (Russia)|Russia|5600000|Leningrad,Petrograd
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
San Francisco|United States|810000|SF
Seattle|United States|750000
Denver|United States|720000
Las Vegas|United States|660000|Vegas
Boston (Massachusetts)|United States|650000
Detroit|United States|630000
Atlanta|United States|500000
Miami|United States|450000
New Orleans|United States|370000|NOLA
Baltimore|United States|565000
Saint Louis|United States|280000|St Louis
Pittsburgh|United States|300000
Portland (Oregon)|United States|630000
Minneapolis|United States|425000
Orlando|United States|320000
Honolulu|United States|350000
Toronto|Canada|2800000
Montreal|Canada|1760000
Calgary|Canada|1300000
Edmonton|Canada|1010000
Vancouver (British Columbia)|Canada|660000
Quebec City|Canada|550000|Quebec
Winnipeg|Canada|750000
Tijuana|Mexico|1920000
Leon (Guanajuato)|Mexico|1720000
Puebla|Mexico|1540000|Puebla de Zaragoza
Guadalajara (Mexico)|Mexico|1400000
Monterrey|Mexico|1140000
Cancun|Mexico|890000
Oaxaca|Mexico|260000|Oaxaca de Juarez,Oaxaca City
Acapulco|Mexico|780000
Ciudad Juarez|Mexico|1500000|Juarez
Quetzaltenango|Guatemala|180000|Xela
Antigua Guatemala|Guatemala|46000
San Pedro Sula|Honduras|720000
Santa Ana (El Salvador)|El Salvador|270000
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
San Fernando (Trinidad and Tobago)|Trinidad and Tobago|50000
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
Cartagena (Colombia)|Colombia|1000000|Cartagena de Indias
Barranquilla|Colombia|1300000
Cordoba (Argentina)|Argentina|1500000|Cordova
Rosario|Argentina|950000
Ushuaia|Argentina|80000
Arequipa|Peru|1000000
Cusco|Peru|430000|Cuzco
Maracaibo|Venezuela|1650000
Valparaiso|Chile|300000
Guayaquil|Ecuador|2700000
Santa Cruz de la Sierra|Bolivia|1900000|Santa Cruz
La Paz (Bolivia)|Bolivia|800000
Sydney|Australia|5300000
Melbourne (Australia)|Australia|5100000
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
Columbus (Ohio)|United States|905000
Indianapolis|United States|890000
Jacksonville (Florida)|United States|950000
Fort Worth|United States|920000
San Jose|United States|1010000
Milwaukee|United States|577000
Kansas City (Missouri)|United States|510000|KC
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
Aurora (Colorado)|United States|390000
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
Madison (Wisconsin)|United States|270000
Reno|United States|265000
Winston-Salem|United States|250000
Chesapeake|United States|250000
Scottsdale|United States|240000
Boise|United States|235000
Richmond (Virginia)|United States|227000
Spokane|United States|230000
Tacoma|United States|220000
Baton Rouge|United States|227000
Des Moines|United States|214000
Modesto|United States|218000
Salt Lake City|United States|200000|SLC,Salt Lake
Sioux Falls|United States|195000
Rochester (New York)|United States|211000
Amarillo|United States|200000
Tallahassee|United States|196000
Grand Rapids|United States|199000
Mobile|United States|187000
Providence|United States|191000
Montgomery|United States|201000
Chattanooga|United States|181000
Brownsville|United States|187000
Glendale (Arizona)|United States|248000
Newport News|United States|186000
Huntsville|United States|215000
Knoxville|United States|191000
Little Rock|United States|203000
Shreveport|United States|187000
Savannah|United States|148000
Charleston|United States|150000
Columbia (South Carolina)|United States|137000
Myrtle Beach|United States|35000
Wilmington (North Carolina)|United States|123000
Asheville|United States|94000
Augusta (Maine)|United States|19000
Macon|United States|157000
Gainesville|United States|141000
Daytona Beach|United States|72000
Fort Lauderdale|United States|183000
West Palm Beach|United States|117000
Sarasota|United States|57000
Pensacola|United States|54000
Saint Augustine|United States|15000|St Augustine
Jackson (Mississippi)|United States|150000
Biloxi|United States|46000
Fayetteville (North Carolina)|United States|211000
Bentonville|United States|55000
Springfield (Illinois)|United States|114000
Peoria (Illinois)|United States|113000
South Bend|United States|103000
Bloomington (Indiana)|United States|85000
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
Roswell (New Mexico)|United States|48000
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
Pasadena (California)|United States|138000
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
Bellevue (Washington)|United States|151000
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
Syracuse (New York)|United States|148000
Saratoga Springs|United States|28000
Scranton|United States|76000
Allentown|United States|125000
Gettysburg|United States|7700
Dover|United States|39000
Annapolis|United States|40000
Charlottesville|United States|47000
Williamsburg|United States|15000
Concord (New Hampshire)|United States|43000
Burlington (Vermont)|United States|44000
Montpelier|United States|8000
Bar Harbor|United States|5500
Newport (Rhode Island)|United States|25000
New Haven|United States|135000
Hartford|United States|121000
Tupelo|United States|38000
Selma|United States|17000
Tuscaloosa|United States|100000
Lafayette (Louisiana)|United States|121000
Hot Springs|United States|39000
Joplin|United States|52000
Branson|United States|12000
Independence|United States|123000
Topeka|United States|126000
Lawrence (Kansas)|United States|98000
Dodge City|United States|27000
Cedar Rapids|United States|137000
Iowa City|United States|75000
Mississauga|Canada|718000
Brampton|Canada|656000
Hamilton (Ontario)|Canada|569000
Surrey|Canada|568000
Halifax (Nova Scotia)|Canada|440000
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
Brandon (Manitoba)|Canada|51000
Moose Jaw|Canada|34000
Rankin Inlet|Canada|2900
Sheffield|United Kingdom|560000
Newcastle upon Tyne|United Kingdom|300000|Newcastle
Nottingham|United Kingdom|330000
Leicester|United Kingdom|370000
Coventry|United Kingdom|345000
Bradford|United Kingdom|540000
Kingston upon Hull|United Kingdom|260000|Hull
Plymouth (England)|United Kingdom|265000
Stoke-on-Trent|United Kingdom|260000|Stoke
Wolverhampton|United Kingdom|265000
Derby|United Kingdom|260000
Southampton (England)|United Kingdom|255000
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
Peterborough (England)|United Kingdom|215000
Reading (Berkshire)|United Kingdom|175000
Ipswich|United Kingdom|140000
Bath|United Kingdom|95000
Exeter|United Kingdom|130000
Durham (England)|United Kingdom|50000
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
Bangor (Gwynedd)|United Kingdom|18000
Llandudno|United Kingdom|20000
Aberystwyth|United Kingdom|18000
Derry|United Kingdom|85000
Lisburn|United Kingdom|45000
Newry|United Kingdom|27000
Armagh|United Kingdom|15000
Enniskillen|United Kingdom|14000
Stratford-upon-Avon|United Kingdom|30000
Winchester|United Kingdom|45000
Worcester (England)|United Kingdom|100000
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
Brest (France)|France|140000
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
Bayonne (France)|France|52000
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
Waterloo (Belgium)|Belgium|30000
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
Zaandam|Netherlands|76000|Zaanstad
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
Siena|Italy|53000|Sienne
Padua|Italy|210000|Padova
Trieste|Italy|200000
Brescia|Italy|197000
Parma (Italy)|Italy|198000
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
Toledo (Spain)|Spain|85000
Salamanca (Spain)|Spain|144000
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
Merida (Yucatan)|Mexico|920000
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
Livingston (Guatemala)|Guatemala|80000
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
Corozal|Belize|10000
San Pedro|Belize|20000
Cienfuegos|Cuba|150000
Matanzas|Cuba|145000
Pinar del Rio|Cuba|142000
Guantanamo|Cuba|210000
Bayamo|Cuba|130000
Santa Clara (Cuba)|Cuba|210000
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
Cuenca (Ecuador)|Ecuador|370000
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
Sale (Morocco)|Morocco|900000
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
Portsmouth (England)|United Kingdom|210000
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
Vlore|Albania|80000|Vlora
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
Chita (Russia)|Russia|330000
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
Victoria (British Columbia)|Canada|92000
Brooklyn|United States|2736074
The Bronx|United States|1472654
Queens|United States|2405464
Gary|United States|69093
Albany (New York)|United States|99224
Dearborn|United States|109976
Duluth|United States|86697
Sitka|United States|8458
Boca Raton|United States|97422
Irvine|United States|307670
Arlington|United States|394266
Harrisburg|United States|50135
Paradise|United States|191238
Norfolk|United States|238005
Roanoke|United States|100011
Stamford|United States|135470
Abilene|United States|125182
Bridgeport|United States|148654
Youngstown|United States|60068
Midland|United States|132524
Erie|United States|94831
Frisco|United States|200509
Visalia|United States|141384
Thousand Oaks|United States|126966
Clearwater|United States|117292
Salinas|United States|163542
Butte|United States|34494
Torrance|United States|147067
Rancho Cucamonga|United States|174453
Paterson|United States|159732
Utica|United States|65283
Temecula|United States|110003
Cape Coral|United States|194016
Santa Clarita|United States|228673
Tyler|United States|105995
College Station|United States|120511
Fremont|United States|230504
Rockford|United States|148655
Laramie|United States|31407
Casper|United States|59038
Vallejo|United States|126090
Carlsbad|United States|114746
Naperville|United States|149540
Fort Myers|United States|86395
Evansville|United States|117298
Fall River|United States|94000
Jefferson City|United States|43228
Fontana|United States|208393
Quincy|United States|101636
Huntington Beach|United States|198711
Davenport|United States|101724
Morgantown|United States|30347
McKinney|United States|195308
Oxnard|United States|202063
Lowell|United States|113994
Ontario|United States|175265
Wichita Falls|United States|102316
Bowling Green|United States|72294
Beaumont (Texas)|United States|115282
Hollywood|United States|153067
San Mateo|United States|105661
Chico|United States|101475
Lewiston|United States|37121
Huntington (West Virginia)|United States|46842
Pierre|United States|14091
Kenosha|United States|99986
Joliet|United States|150362
Lakeland|United States|112641
Cary|United States|174721
Everett|United States|110629
McAllen|United States|142210
Oceanside|United States|174068
Wheeling|United States|27052
Frederick|United States|78171
Hayward|United States|162954
Downey|United States|114355
Murfreesboro|United States|152769
Round Rock|United States|119468
Minot|United States|48377
New Bedford|United States|101079
Lancaster (California)|United States|173516
Pueblo|United States|111876
St. Joseph|United States|72473|Saint Joseph
Great Falls|United States|60442
Idaho Falls|United States|64818
Sunnyvale|United States|155805
Clarksville|United States|166722
Hialeah|United States|223109
Overland Park|United States|197238
Pomona|United States|151713
Ventura|United States|110763
Murrieta|United States|110949
Hattiesburg|United States|48730
Nashua|United States|91322
Sugar Land|United States|111026
Denton|United States|139869
Fort Smith|United States|89142
Grand Forks|United States|59166
Victorville|United States|134810
Carmel|United States|99757
Sioux City|United States|85797
Irving|United States|256684
Owensboro|United States|60183
New Braunfels|United States|90403
Norman|United States|128026
Lake Charles|United States|84872
Miami Gardens|United States|111640
Somerville|United States|81045
Fullerton|United States|143617
Hampton|United States|137148
Corona|United States|157136
Edison|United States|107588
Wasilla|United States|9054
Rockville|United States|67117
Palmdale|United States|169450
Port St. Lucie|United States|204851|Port Saint Lucie
Simi Valley|United States|126356
Elizabeth|United States|137298
Lakewood Township|United States|135158
Hammond|United States|77879
Costa Mesa|United States|111918
Racine|United States|77816
Pompano Beach|United States|112046
Daly City|United States|104901
Tracy|United States|93000
San Angelo|United States|99893
Roseville|United States|147773
Garden Grove|United States|171949
Gilbert|United States|267918
Gulfport|United States|72926
Metairie|United States|143507
Jonesboro|United States|78576
Allen|United States|104627
Greeley|United States|108795
Gaithersburg|United States|69101
Sandy Springs|United States|108080
Hillsboro|United States|106447
Richardson|United States|119469
Rock Hill|United States|74372
Elgin|United States|114797
Waterbury|United States|114403
Brockton|United States|105643
Garland|United States|246018
Lynn|United States|101253
Coral Springs|United States|134394
Killeen|United States|153095
Santa Maria|United States|109707
Grand Prairie|United States|196100
Toms River|United States|95438
Grand Island|United States|53131
Pawtucket|United States|75604
Escondido|United States|151038
Parkersburg|United States|29738
Clovis|United States|120124
Gillette|United States|33403
Mount Pleasant|United States|90801
High Point|United States|114059
Lee's Summit|United States|101108
Vacaville|United States|102386
West Covina|United States|109501
Orange|United States|139911
Renton|United States|106785
Longmont|United States|98885
Olathe|United States|141290
Elk Grove|United States|176124
Fairfield (California)|United States|119881
Davie|United States|105691
Cranston|United States|82934
Broken Arrow|United States|113540
Conroe|United States|89956
Miramar|United States|134721
Livonia|United States|95535
Covington|United States|40961
Pearland|United States|125828
El Cajon|United States|106215
Sparks|United States|108445
Edmond|United States|94428
Kearney|United States|33790
Springdale|United States|84161
Lakewood (Colorado)|United States|155984
Kent|United States|136588
Moreno Valley|United States|208634
Carrollton|United States|133434
Nampa|United States|100200
Rock Springs|United States|23526
Warren|United States|139387
Meridian|United States|117635
Pembroke Pines|United States|171178
Rutland|United States|15807
Bowie|United States|58329
Rio Rancho|United States|104046
Fishers|United States|98977
Warwick|United States|82823
Southaven|United States|54648
Palm Bay|United States|119760
Federal Way|United States|101030
Bennington|United States|15333
Palm Coast|United States|89258
Menifee|United States|102527
Arvada|United States|124402
Centennial|United States|108418
Lewisville|United States|111822
Suffolk|United States|94324
Surprise|United States|143148
Hesperia|United States|99818
North Charleston|United States|114852
Mesquite|United States|150108
Spring Hill (Florida)|United States|113568
Goodyear|United States|95294
Brookings|United States|23377
Buckeye|United States|91502
South Fulton|United States|107436
North Las Vegas|United States|262527
El Monte|United States|109450
Norwalk (California)|United States|102773
Sterling Heights|United States|134346
Gresham|United States|114247
League City|United States|114392
West Valley City|United States|140230
Rialto|United States|104026
Caldwell|United States|59996
Woodbridge Township|United States|103639|Woodbridge
Westminster (Colorado)|United States|116317
Ankeny|United States|67887
Lehigh Acres|United States|114287
Deltona|United States|93692
Avondale|United States|89334
Riverview|United States|107396
Thornton|United States|141867
Enterprise|United States|221831
Clinton Township|United States|100513|Clinton
South Burlington|United States|20292
Citrus Heights|United States|87583
Jurupa Valley|United States|105053
Spokane Valley|United States|102976
Pearl City|United States|45295
Spring Valley|United States|215597
West Jordan|United States|116961
South Portland|United States|26498
Colchester (Vermont)|United States|17524
East Providence|United States|47139
West Fargo|United States|38626
Waipahu|United States|43485
Sunrise Manor|United States|205618
East Honolulu|United States|50922
Frankfort|United States|28602
Coeur d'Alene|United States|54628
Greenville|United States|70720
The Villages|United States|79077
Galveston|United States|53695
Bellingham|United States|91482
Greenwich|United States|63518
Schenectady|United States|67047
Bethesda|United States|68056
Evanston|United States|78110
Cupertino|United States|60381
Mountain View|United States|82376
White Plains|United States|59559
Franklin|United States|83454
Lynchburg|United States|79009
Kalamazoo|United States|73598
Grand Junction|United States|65560
Newport Beach|United States|85239
Oshkosh|United States|66816
Mount Vernon|United States|73893
New Rochelle|United States|79726
Ocala|United States|63591
Brookline|United States|63191
New Brunswick|United States|55266
Yakima|United States|96968
Redmond|United States|73256
Redding|United States|93611
Terre Haute|United States|58389
Miami Beach|United States|82890
Newton|United States|88923
Appleton|United States|75644
Jupiter|United States|61047
Marietta|United States|60972
Champaign|United States|88302
Oak Park|United States|54583
Walnut Creek|United States|70127
Troy|United States|51401
Petaluma|United States|59776
Johnson City|United States|71046
Chapel Hill|United States|61960
Eau Claire|United States|69421
Middletown|United States|50987
Longview|United States|81638
Hawthorne|United States|88083
Pocatello|United States|56320
Corvallis|United States|59922
Alameda|United States|78280
Council Bluffs|United States|62799
Muncie|United States|65194
Medford|United States|85824
Bradenton|United States|55698
Dubuque|United States|59667
Redwood City|United States|84292
Orem|United States|98129
San Marcos|United States|67553
Whittier|United States|87306
Arlington Heights|United States|77676
Beaverton|United States|97494
La Crosse|United States|52680
Reston|United States|63226
Cherry Hill|United States|74553
Davis|United States|66850
Kissimmee|United States|79226
Twin Falls|United States|51807
Danbury|United States|86518
Decatur|United States|70522
Battle Creek|United States|52721
Harrisonburg|United States|51814
Ames|United States|66427
Lake Havasu City|United States|57144
Alpharetta|United States|65818
San Rafael|United States|61271
Pontiac|United States|61606
Encinitas|United States|62007
Redlands|United States|73168
Yorba Linda|United States|68336
Kokomo|United States|59604
Port Arthur|United States|56039
St. Cloud|United States|68881
Valdosta|United States|55378
Cicero|United States|85268
Auburn|United States|76143
Redondo Beach|United States|71576
Arcadia|United States|56681
Livermore|United States|87955
Indio|United States|89137
Flower Mound|United States|75956
Plantation|United States|91750
Levittown|United States|51758
Dothan|United States|71072
Kirkland|United States|92175
Chino (California)|United States|91403
Des Plaines|United States|60675
Lodi|United States|66348
Royal Oak|United States|58211
Pleasanton|United States|79871
Camarillo|United States|70741
Mission Viejo|United States|93653
Schaumburg|United States|78723
Framingham|United States|72362
Deerfield Beach|United States|86859
San Clemente|United States|64293
Grapevine|United States|50631
Edina|United States|53494
Normal|United States|52736
Rogers|United States|69908
Waukesha|United States|71158
Lake Elsinore|United States|70265
Lynwood|United States|67265
Palm Beach Gardens|United States|59182
Waltham|United States|65218
Mooresville|United States|50193
Lawton|United States|90381
Delray Beach|United States|66846
Ellicott City|United States|75947
Merced|United States|86333
Rocky Mount|United States|54341
Sunrise|United States|97335
Kingsport|United States|55442
Enid|United States|51308
Homestead|United States|80737
Rochester Hills|United States|76300
Gastonia|United States|80411
Hendersonville|United States|61753
Temple|United States|82073
Alhambra|United States|82868
Logan|United States|52778
Hemet|United States|89833
Elkhart|United States|53923
Skokie|United States|67824
Waukegan|United States|89321
Yuba City|United States|70117
Castle Rock|United States|73158
Huntersville|United States|61376
Perth Amboy|United States|55436
Union City|United States|68589
Hanford|United States|57990
Milpitas|United States|80273
Apopka|United States|54873
Boynton Beach|United States|80380
Conway|United States|64134
Folsom|United States|80454
Richland|United States|60560
Towson|United States|59553
Broomfield|United States|74112
Loveland|United States|76378
Novato|United States|53225
Germantown|United States|91249
Apple Valley|United States|75791
Passaic|United States|70537
Doral|United States|75874
Pasco|United States|77108
Bryan|United States|83980
Sanford|United States|61051
Kennewick|United States|83921
Summerville|United States|50915
Upper Darby Township|United States|85681|Upper Darby
Gilroy|United States|59520
Vineland|United States|60780
Gardena|United States|61027
Kannapolis|United States|53114
Bossier City|United States|62701
Berwyn|United States|57250
Noblesville|United States|69604
Texas City|United States|51898
Waldorf|United States|81410
West Sacramento|United States|53915
Fountain Valley|United States|57047
Woodland|United States|61032
Harlingen|United States|71829
Haverhill|United States|67787
Southfield|United States|76618
Missouri City|United States|74259
Janesville|United States|65615
Lake Forest|United States|85858
Moore|United States|62793
Weston|United States|68107
Wheaton|United States|53970
Turlock|United States|72740
Warner Robins|United States|80308
Abington Township|United States|58502|Abington
East Orange|United States|69612
Chino Hills|United States|78411
Hoffman Estates|United States|52530
Diamond Bar|United States|55072
Malden|United States|66263
Milford|United States|50558
Rocklin|United States|71601
San Ramon|United States|84605
South Gate|United States|92726
Bellflower|United States|79190
Plainfield|United States|54586
Pflugerville|United States|65191
Downers Grove|United States|50247
Brentwood (California)|United States|64292
Cuyahoga Falls|United States|51114
Cypress|United States|50151
Lorain|United States|65211
Middletown Township|United States|67106
Casa Grande|United States|53658
Clifton|United States|90296
Upland|United States|79040
La Mesa|United States|61121
Sandy|United States|96904
Baldwin Park|United States|72176
Montebello|United States|62640
Aliso Viejo|United States|52176
Johns Creek|United States|82453
San Leandro|United States|91008
Tustin|United States|80276
Revere|United States|62186
Largo|United States|82485
Piscataway|United States|60804
West New York|United States|52912
Manteca|United States|83498
Perris|United States|78700
Azusa|United States|50000
Minnetonka|United States|53781
Carmichael|United States|79793
Covina|United States|51268
Eagan|United States|68855
Vista|United States|98381
Watsonville|United States|52590
Anderson|United States|54788
St. Louis Park|United States|50010
Taunton|United States|59408
Wayne|United States|54838
Celina|United States|64427
Novi|United States|66243
Port Charlotte|United States|60625
Baytown|United States|83701
Cedar Park|United States|77595
North Bergen|United States|63361
Porterville|United States|62623
North Port|United States|74793
Weymouth (Massachusetts)|United States|57437
Lehi|United States|75907
Madera|United States|66224
Mansfield (Texas)|United States|72602
Eden Prairie|United States|64198
Tinley Park|United States|55971
Glendora|United States|52558
Kettering (Ohio)|United States|57862
Apex|United States|58780
Laguna Niguel|United States|64355
Mishawaka|United States|51063
Monterey Park|United States|61096
Wylie|United States|57526
Oak Lawn|United States|58362
West Allis|United States|60325
Cathedral City|United States|51493
Draper|United States|51017
Farmington Hills|United States|83986
Hoover|United States|92606
Hamden|United States|61169
Palatine|United States|67908
Coconut Creek|United States|57833
DeSoto|United States|56145
El Dorado Hills|United States|50547
Queen Creek|United States|59519
Sammamish|United States|67455
West Hartford|United States|64083
Buena Park|United States|84034
Rancho Cordova|United States|79332
Tulare|United States|68875
South San Francisco|United States|66105
Blue Springs|United States|58603
Bolingbrook|United States|73922
Elyria|United States|52656
Centreville|United States|73518
Huntington Park|United States|54883
Parker|United States|58512
Kenner|United States|66448
Parsippany-Troy Hills|United States|56162
Orland Park|United States|58703
Glen Burnie|United States|72891
Mission|United States|85778
Peabody|United States|54481
Yucaipa|United States|54542
Bonita Springs|United States|53644
Commerce City|United States|62418
Greenwood|United States|63830
Union Township|United States|59728
Jackson Township|United States|58544
Leander|United States|59202
Lenexa|United States|57434
Florissant|United States|52533
O'Fallon|United States|91316
Shoreline|United States|58608
Euless|United States|61032
Lower Merion Township|United States|63633|Lower Merion
Maricopa|United States|58125
West Des Moines|United States|68723
Chicopee|United States|55560
Colton|United States|53909
National City|United States|56173
Brooklyn Park|United States|86478
Fulshear|United States|64630
Placentia|United States|51824
San Tan Valley|United States|99894
Stratford|United States|52355
Bloomfield|United States|53105
Eastvale|United States|69757
Delano|United States|51428
Lacey|United States|53526
Lakeville|United States|69490
Irvington|United States|61176
Maple Grove|United States|70253
Marysville|United States|70714
Mount Prospect|United States|56852
North Little Rock|United States|64591
Hamilton Township|United States|92297
Margate (Florida)|United States|58712
Palm Harbor|United States|61366
Rosemead|United States|51185
West Bloomfield Township|United States|65888|West Bloomfield
Brick Township|United States|73620|Brick
Burnsville|United States|64317
Collierville|United States|51324
Dunwoody|United States|51683
La Habra|United States|63097
Taylor|United States|63409
Tigard|United States|54539
Westchester|United States|56384
Blaine|United States|70222
Rowlett|United States|62535
Woodbury|United States|75102
Lauderhill|United States|74482
Bensalem Township|United States|62707|Bensalem
Layton|United States|81773
Meriden|United States|60850
Paramount|United States|53733
Cheektowaga|United States|89877
San Jacinto|United States|53898
Kendall|United States|80241
Port Orange|United States|62596
Methuen|United States|53059
Old Bridge Township|United States|66876|Old Bridge
Howell Township|United States|53537|Howell
Colonie|United States|85590
Burien|United States|52066
Coon Rapids|United States|63599
Pico Rivera|United States|62088
Irondequoit|United States|51043
Santee|United States|60037
Waterford Township|United States|70565
West Haven|United States|55584
South Jordan|United States|77487
Midwest City|United States|58409
Shawnee|United States|67311
Marana|United States|51908
Shelby Charter Township|United States|79408|Shelby
Wyoming|United States|76501
East Hartford|United States|50731
St. Clair Shores|United States|58874
Murray|United States|50637
Greenburgh|United States|95397
North Richland Hills|United States|69917
Highland|United States|56999
Severn|United States|57118
Dearborn Heights|United States|63292
North Bethesda|United States|50094
Pharr|United States|79715
Westland|United States|85420
Bartlett|United States|57786
Franklin Township|United States|68364
Pinellas Park|United States|53093
North Miami|United States|60191
Poinciana|United States|69309
Kendale Lakes|United States|55646
St. Peters|United States|57732
Stonecrest|United States|59194
Kentwood|United States|54304
Herriman|United States|55144
Tamarac|United States|71897
Millcreek|United States|63380
Atascocita|United States|88174
Clay|United States|60527
Gloucester Township|United States|66034
Arden-Arcade|United States|94659
Dale City|United States|72088
Macomb Township|United States|91663|Macomb
Clarkstown|United States|86855
Haverford Township|United States|50431|Haverford
Florence-Graham|United States|61983
Taylorsville|United States|60448
Town 'n' Country|United States|85951
Tamiami|United States|54212
Millcreek Township|United States|54073
The Hammocks|United States|59480
Florin|United States|52388
Ypsilanti Charter Township|United States|55670|Ypsilanti
Lower Paxton Township|United States|53501|Lower Paxton
Bristol Township|United States|54291
Georgetown Township|United States|54091
Tonawanda|United States|72636
Bel Air South|United States|57648
East Los Angeles|United States|118786
Silver Spring|United States|81015
Hempstead|United States|59169
Las Palmas|Spain|381868|Las Palmas de Gran Canaria
Clacton-on-Sea|United Kingdom|50548|Clacton
Blackpool|United Kingdom|139305
Chester|United Kingdom|87507
Matera|Italy|59685
Southend-on-Sea|United Kingdom|160257|Southend
Dunkirk|France|86263|Dunkerque
Slough|United Kingdom|119070
Croydon|United Kingdom|192064
Carlisle|United Kingdom|75399
Metz|France|122572
Watford|United Kingdom|90301
Swindon|United Kingdom|222193
Hastings|United Kingdom|91053
Cheltenham|United Kingdom|116447
Doncaster|United Kingdom|109805
Neuilly-sur-Seine|France|59538|Neuilly
Calais|France|67571
Barrow-in-Furness|United Kingdom|55489
Brighton and Hove|United Kingdom|277965
Gloucester|United Kingdom|145563
St Albans|United Kingdom|82146
Bolton|United Kingdom|285372
Crawley|United Kingdom|106597
Guildford|United Kingdom|77057
Braunschweig|Germany|252811|Brunswick
Weston-super-Mare|United Kingdom|76143
Stevenage|United Kingdom|89663
Paisley|United Kingdom|77220
Warrington|United Kingdom|165456
Blackburn|United Kingdom|117963
Salford|United Kingdom|103886
Bromley|United Kingdom|87889
Scarborough|United Kingdom|61749
East Kilbride|United Kingdom|75120
Stourbridge|United Kingdom|63298
Lecce|Italy|94783
Solihull|United Kingdom|206674
Stockport|United Kingdom|294773
Wigan|United Kingdom|103608
Woking|United Kingdom|62796
Burnley|United Kingdom|82002
Gelsenkirchen|Germany|266199
Santa Cruz de Tenerife|Spain|211957
Worms|Germany|86921
High Wycombe|United Kingdom|120256
Dunfermline|United Kingdom|53100
Grimsby|United Kingdom|88243
Saint-Denis|France|149077|St Denis
Welwyn Garden City|United Kingdom|51505|Welwyn
Harrogate|United Kingdom|73576
Darmstadt|Germany|168253
Birkenhead|United Kingdom|109848
Oldham|United Kingdom|96555
Bedford|United Kingdom|92407
Ancona|Italy|98356
Brindisi|Italy|82694
Southport|United Kingdom|91703
Chelmsford|United Kingdom|115369
Darlington|United Kingdom|93015
Wolfsburg|Germany|129813
Huddersfield|United Kingdom|162949
Leamington Spa|United Kingdom|50699|Leamington
Hemel Hempstead|United Kingdom|94932
Burton upon Trent|United Kingdom|75074|Burton
Monchengladbach|Germany|267176|Moenchengladbach
West Bromwich|United Kingdom|146386
Kaiserslautern|Germany|100247
La Spezia|Italy|92119
Wakefield|United Kingdom|99251
Terrassa|Spain|233270
Pau|France|80441
Rotherham|United Kingdom|109691
Eastbourne|United Kingdom|101547
Jena|Germany|109353
Royal Tunbridge Wells|United Kingdom|57772|Tunbridge Wells
South Shields|United Kingdom|75337
Walsall|United Kingdom|67594
Barnsley|United Kingdom|245199
Pavia|Italy|70636
Sanremo|Italy|52787|San Remo
Beziers|France|81545
Osnabruck|Germany|166257|Osnabrueck
Alcobendas|Spain|123342
Foggia|Italy|145348
Harlow|United Kingdom|82059
Merthyr Tydfil|United Kingdom|58839
Basingstoke|United Kingdom|107355
Telford|United Kingdom|142723
Narbonne|France|57587
Hartlepool|United Kingdom|87995
Ingolstadt|Germany|140799
Redditch|United Kingdom|81919
Flensburg|Germany|95568
Gateshead|United Kingdom|196151
Scunthorpe|United Kingdom|79977
Bayreuth|Germany|72919
Rugby|United Kingdom|70627
Poole|United Kingdom|144800
Banbury|United Kingdom|54340
Macclesfield|United Kingdom|52508
Worthing|United Kingdom|109120
Algeciras|Spain|126589
Aldershot|United Kingdom|57211
Dudley|United Kingdom|79379
St Helens|United Kingdom|183248
Castellammare di Stabia|Italy|62772|Castellammare
Chesterfield|United Kingdom|76402
Sutton Coldfield|United Kingdom|96475
Stockton-on-Tees|United Kingdom|82729
Arezzo|Italy|96260
Maidenhead|United Kingdom|63580
Tamworth|United Kingdom|73924
Bondy|France|50595
Bury|United Kingdom|78729
Dartford|United Kingdom|51240
Crewe|United Kingdom|55315
Pescara|Italy|118657
Leverkusen|Germany|168299
Estepona|Spain|79621
Halesowen|United Kingdom|60097
Boulogne-Billancourt|France|119019|Boulogne
Rochdale|United Kingdom|110194
Piacenza|Italy|102465
Harrow|United Kingdom|149246
Bremerhaven|Germany|118502
Schwerin|Germany|97922
Lorient|France|58329
Carrara|Italy|59905
Gorlitz|Germany|55065|Goerlitz
Castellon de la Plana|Spain|183711|Castellon
Basildon|United Kingdom|185900
Benevento|Italy|56201
Gravesend|United Kingdom|74000
Avellino|Italy|52198
Oldenburg|Germany|177055
Sutton|United Kingdom|58880
Heilbronn|Germany|132516
L'Aquila|Italy|70344|Aquila
Kirkcaldy|United Kingdom|50010
L'Hospitalet de Llobregat|Spain|289510|Hospitalet
Ludwigshafen|Germany|177355
Luneburg|Germany|74502|Lueneburg
Loughborough|United Kingdom|64880
Amstelveen|Netherlands|94435
Paderborn|Germany|155906
Fulda|Germany|65755
Hanau|Germany|98582
Horsham|United Kingdom|50934
Chatham|United Kingdom|76792
Nuneaton|United Kingdom|86552
Catanzaro|Italy|84670
Civitavecchia|Italy|51653
Benalmadena|Spain|78338
Albacete|Spain|175400
Hounslow|United Kingdom|103337
Bagheria|Italy|52928
Solingen|Germany|164621
Corby|United Kingdom|62341
Prato|Italy|195736
Greifswald|Germany|56154
Saint-Nazaire|France|74568|St Nazaire
Stralsund|Germany|55481
Andover|United Kingdom|50999
Uxbridge|United Kingdom|70560
Cottbus|Germany|95140
Tivoli|Italy|54916
Bootle|United Kingdom|51394
Marburg|Germany|73571
Altrincham|United Kingdom|52419
Newcastle-under-Lyme|United Kingdom|75082
Crotone|Italy|58445
Ashford|United Kingdom|83213
Erlangen|Germany|116450
Farnborough|United Kingdom|65034
Alessandria|Italy|91059
Keighley|United Kingdom|57339
Villeurbanne|France|163684
Alcala de Henares|Spain|203208
Hamelin|Germany|58152|Hameln
Sassari|Italy|121021
Lugo|Spain|100143
Wilhelmshaven|Germany|75324
Kidderminster|United Kingdom|57409
Sabadell|Spain|225368
Trapani|Italy|55559
Aschaffenburg|Germany|73326
Rosenheim|Germany|65808
Reus|Spain|111601
Walton-on-Thames|United Kingdom|66566|Walton
Badalona|Spain|231542
Caserta|Italy|72805
Zwickau|Germany|86405
Krefeld|Germany|230738
Pontevedra|Spain|83316
Imola|Italy|69121
Landshut|Germany|71922
Bourges|France|64186
Ferrol|Spain|64367
Bracknell|United Kingdom|60077
Deventer|Netherlands|101236
Furth|Germany|131344|Fuerth
Quimper|France|64385
Portimao|Portugal|59845
Beauvais|France|55550
Getafe|Spain|193238
Olbia|Italy|61048
Gillingham|United Kingdom|108483
Forli|Italy|118152
Potenza|Italy|64406
Hildesheim|Germany|98207
Pesaro|Italy|95376
Cumbernauld|United Kingdom|50920
Vannes|France|55790
Jaen|Spain|112235
Varese|Italy|78409
Viareggio|Italy|60579
Runcorn|United Kingdom|61789
Celle|Germany|66930
Fuengirola|Spain|85211
Pozzuoli|Italy|76331
Brandenburg an der Havel|Germany|73945|Brandenburg
Roubaix|France|98286
Viterbo|Italy|65949
Anzio|Italy|58949
Dewsbury|United Kingdom|62945
Torrevieja|Spain|98533
Novara|Italy|101257
Wallasey|United Kingdom|60284
Asti|Italy|73421
Cosenza|Italy|63760
Friedrichshafen|Germany|62781
Viseu|Portugal|99274
Wellingborough|United Kingdom|54733
Cesena|Italy|95778
Gosport|United Kingdom|71529
Paignton|United Kingdom|64410
Offenbach am Main|Germany|133195|Offenbach
Valence|France|64458
Sant Cugat del Valles|Spain|97983|Sant Cugat
Amadora|Portugal|171454
Ellesmere Port|United Kingdom|61090
Neustadt an der Weinstrasse|Germany|52882|Neustadt
Montreuil|France|111934
Barry|United Kingdom|53369
Fuenlabrada|Spain|190076
Leganes|Spain|195734
Siegen|Germany|102450
Roquetas de Mar|Spain|111240|Roquetas
Tynemouth|United Kingdom|68202
Pforzheim|Germany|134422
Kleve|Germany|53094
Ragusa|Italy|73159
Ravensburg|Germany|50549
Rueil-Malmaison|France|82874
Ourense|Spain|105769
Cuneo|Italy|55744
Torres Vedras|Portugal|79465
Grosseto|Italy|81321
Marsala|Italy|79809
San Cristobal de La Laguna|Spain|161108|La Laguna
Widnes|United Kingdom|61464
La Linea de la Concepcion|Spain|64499|La Linea
Terni|Italy|106370
Almada|Portugal|177238
Gutersloh|Germany|99854|Guetersloh
Latina|Italy|127564
Schweinfurt|Germany|54539
Eastleigh|United Kingdom|78716
Heidenheim an der Brenz|Germany|50612|Heidenheim
Leiria|Portugal|126897
Bad Homburg|Germany|56938
Lelystad|Netherlands|83033
Meaux|France|56905
Clichy|France|64410
Bergisch Gladbach|Germany|111174
Cherbourg-en-Cotentin|France|78258|Cherbourg
Hinckley|United Kingdom|50712
Barletta|Italy|92427
Caldas da Rainha|Portugal|51729|Caldas
Hoorn|Netherlands|73619
Lamezia Terme|Italy|67026|Lamezia
Pistoia|Italy|88990
Ciudad Real|Spain|76217
Faenza|Italy|58710
Ludwigsburg|Germany|93002
Palencia|Spain|77466
Wesel|Germany|60717
Detmold|Germany|74438
Levallois-Perret|France|68092
Santarem|Portugal|62200
Wolfenbuttel|Germany|52511|Wolfenbuettel
Bergen op Zoom|Netherlands|66445
Oberhausen|Germany|213178
Heerenveen|Netherlands|50650
Minden|Germany|83598
Vila do Conde|Portugal|79533
La Louviere|Belgium|80986
Matosinhos|Portugal|172557
Esslingen am Neckar|Germany|95419|Esslingen
Frejus|France|59719
Issy-les-Moulineaux|France|67669
Mataro|Spain|131683
Pordenone|Italy|51725
Aviles|Spain|75517
Crosby|United Kingdom|51789
Fiumicino|Italy|81426
Mulheim|Germany|171674|Muelheim
Neuss|Germany|153767
Roermond|Netherlands|57308
Cagnes-sur-Mer|France|53354
Gela|Italy|70109
La Roche-sur-Yon|France|54849
El Puerto de Santa Maria|Spain|89983|Puerto de Santa Maria
Figueira da Foz|Portugal|62125|Figueira
Hyeres|France|55858
Aubervilliers|France|88365
Russelsheim am Main|Germany|66028|Russelsheim,Ruesselsheim am Main,Ruesselsheim
Colombes|France|91053
Gera|Germany|95162
Mostoles|Spain|214817
Courbevoie|France|82902
Offenburg|Germany|63437
Sittingbourne|United Kingdom|54392
Vilanova i la Geltru|Spain|71641|Vilanova
Barcelos|Portugal|116752
Povoa de Varzim|Portugal|63408
Seixal|Portugal|166507
Wetzlar|Germany|54865
Duren|Germany|94539|Dueren
Giessen|Germany|88544
Manresa|Spain|80974
Massa|Italy|66160
Saint-Ouen-sur-Seine|France|53615|Saint-Ouen
Villingen-Schwenningen|Germany|89766|Villingen
Castelldefels|Spain|70057
Neubrandenburg|Germany|59494
Altamura|Italy|69880
Amarante|Portugal|56264
Loule|Portugal|70622
Lorrach|Germany|51274|Loerrach
Reutlingen|Germany|119040
Talavera de la Reina|Spain|83803|Talavera
Torrejon de Ardoz|Spain|143526|Torrejon
Afragola|Italy|61712
Cannock|United Kingdom|67768
Torre del Greco|Italy|78997
Assen|Netherlands|68836
Creteil|France|93397
Maia|Portugal|134977
Niort|France|59854
Argenteuil|France|106130
Oss|Netherlands|92526
Aalen|Germany|67675
Den Helder|Netherlands|56582
Getxo|Spain|75752
Herford|Germany|67074
Newtownabbey|United Kingdom|67599
Recklinghausen|Germany|114851
Sindelfingen|Germany|61428
Trani|Italy|54941
Caltanissetta|Italy|58532
Ivry-sur-Seine|France|65064
Salzgitter|Germany|104433
Granollers|Spain|65341
Orihuela|Spain|84560
Sarcelles|France|59173
Vila Nova de Famalicao|Portugal|133534|Famalicao
Woerden|Netherlands|52694
Castrop-Rauxel|Germany|72353
Cornella de Llobregat|Spain|92237|Cornella
Mazara del Vallo|Italy|50039|Mazara
Schiedam|Netherlands|79279
Vic|Spain|50796
Bitonto|Italy|53168
Gandia|Spain|83135
Tourcoing|France|98772
Waiblingen|Germany|57186
Zoetermeer|Netherlands|125267
Clamart|France|58576
Dos Hermanas|Spain|142519
Goppingen|Germany|58678|Goeppingen
Schwabisch Gmund|Germany|63930|Schwaebisch Gmuend
Batley|United Kingdom|80485
Beeston|United Kingdom|52000
Plauen|Germany|64893
Almelo|Netherlands|73132
Barakaldo|Spain|102986
Foligno|Italy|55226
Heerlen|Netherlands|86936
Hengelo|Netherlands|81049
Hurth|Germany|61732|Huerth
Lorca|Spain|98969
Neuwied|Germany|67201
Teramo|Italy|51548
Alphen aan den Rijn|Netherlands|114182
Busto Arsizio|Italy|82951
Castelo Branco|Portugal|56109
Craigavon|United Kingdom|57685
Emmen|Netherlands|107024
Purmerend|Netherlands|81515
Verviers|Belgium|55198
Iserlohn|Germany|91317
Saint-Maur-des-Fosses|France|76572|Saint-Maur
Vila Real|Portugal|51850
Aulnay-sous-Bois|France|87599
Boblingen|Germany|51204|Boeblingen
Lippstadt|Germany|68383
Neumunster|Germany|80145|Neumuenster
Villejuif|France|60183
Villeneuve-d'Ascq|France|62868
Bottrop|Germany|118482
Ede|Netherlands|118530
Neu-Ulm|Germany|62843
Massy|France|51729
Molfetta|Italy|57329
Asnieres-sur-Seine|France|93941
Rastatt|Germany|50753
Terneuzen|Netherlands|54463
Barreiro|Portugal|78764
Bebington|United Kingdom|57336
Vigevano|Italy|62076
Vlaardingen|Netherlands|73924
Andria|Italy|97146
Antony|France|64263
Arnsberg|Germany|74479
Cholet|France|54404
Helmond|Netherlands|92627
Legnano|Italy|59941
Pulheim|Germany|55979
Ratingen|Germany|88914
Santa Maria da Feira|Portugal|136674|Feira
Carpi|Italy|71869
Covilha|Portugal|51797
Doetinchem|Netherlands|58270
Houten|Netherlands|50223
Remscheid|Germany|113333
Bad Oeynhausen|Germany|50515
Moers|Germany|101298
Rijswijk|Netherlands|55220
Spijkenisse|Netherlands|72740
Vila Franca de Xira|Portugal|137529|Vila Franca
Dessau-Rosslau|Germany|75035|Dessau
Mouscron|Belgium|58234
Seraing|Belgium|64270
Sesto San Giovanni|Italy|78884
Acireale|Italy|50399
Bobigny|France|56927
Bocholt|Germany|73048
Chiclana de la Frontera|Spain|90864|Chiclana
Harderwijk|Netherlands|50000
Lahr|Germany|51208
Ludenscheid|Germany|70810|Luedenscheid
Rowley Regis|United Kingdom|50257
San Sebastian de los Reyes|Spain|96992
Torrelavega|Spain|51796
Viersen|Germany|78227
Willenhall|United Kingdom|51429
Katwijk|Netherlands|66607
Roosendaal|Netherlands|76959
Utrera|Spain|52403
Cergy|France|70906
Drancy|France|72390
Noisy-le-Grand|France|72978
Penafiel|Portugal|72265
Rheine|Germany|77209
Vitry-sur-Seine|France|93963
Corbeil-Essonnes|France|54471
Elmshorn|Germany|51375
Velletri|Italy|52528
Cerignola|Italy|56978
Herne|Germany|156266
La Seyne-sur-Mer|France|63732
Lunen|Germany|85844|Luenen
Euskirchen|Germany|59977
Lingen|Germany|56539
Nordhorn|Germany|57372
Manfredonia|Italy|53902
Montesilvano|Italy|53275
Delmenhorst|Germany|81274
Gronau|Germany|50349
Unna|Germany|57961
Veenendaal|Netherlands|66912
Witten|Germany|91474
Bisceglie|Italy|53534
Giugliano in Campania|Italy|123679|Giugliano
Gondomar|Portugal|164257
Moncalieri|Italy|56117
Nieuwegein|Netherlands|63866
Santa Coloma de Gramenet|Spain|123981|Santa Coloma
Evry-Courcouronnes|France|66919|Evry
Capelle aan den IJssel|Netherlands|67319
Champigny-sur-Marne|France|78072
Sevran|France|52535
Troisdorf|Germany|75742
Alcorcon|Spain|175719
Bloxwich|United Kingdom|51879
Gladbeck|Germany|75647
Le Blanc-Mesnil|France|62376
Eschweiler|Germany|57573
Pantin|France|61929
Sankt Augustin|Germany|56033|St Augustin
Stolberg|Germany|57678
Viladecans|Spain|67587
Vittoria|Italy|63316
Aprilia|Italy|74126
Gallarate|Italy|52811
Gennevilliers|France|50979
Guidonia Montecelio|Italy|89114|Guidonia
Hilden|Germany|54859
Hoogeveen|Netherlands|55603
Maisons-Alfort|France|56799
Dorsten|Germany|74783
Fontenay-sous-Bois|France|53757
Mollet del Valles|Spain|52990|Mollet
Norderstedt|Germany|83196
Pacos de Ferreira|Portugal|56340
Pessac|France|67339
Pomezia|Italy|64119
Rho|Italy|50299
Velbert|Germany|82166
Gummersbach|Germany|51332
Loures|Portugal|201590
Bad Salzuflen|Germany|53807
Bergheim|Germany|61976
Dinslaken|Germany|66869
Odivelas|Portugal|148034
Peine|Germany|51005
Pombal|Portugal|55217
Santo Tirso|Portugal|71530
Torrent|Spain|90928
Garbsen|Germany|60007
Heerhugowaard|Netherlands|58387
Kerpen|Germany|66377
Sant Boi de Llobregat|Spain|85610|Sant Boi
Weert|Netherlands|50011
Ahlen|Germany|52387
Hattingen|Germany|52969
Langenhagen|Germany|54059
Marco de Canaveses|Portugal|53450
Portici|Italy|52054
Alcala de Guadaira|Spain|77474
Herten|Germany|60707
Ibbenburen|Germany|51596|Ibbenbueren
Marl|Germany|86899
Meerbusch|Germany|56947
Montijo|Portugal|51222
Oosterhout|Netherlands|56206
Ovar|Portugal|55398
Queluz|Portugal|78273
Oliveira de Azemeis|Portugal|68611
Acerra|Italy|58322
Coslada|Spain|80512
Paredes|Portugal|86854
Quartu Sant'Elena|Italy|68585|Quartu
Arona|Spain|87793
Dormagen|Germany|63619
Grevenbroich|Germany|65605
Hamm|Germany|179108
Parla|Spain|137471
Telde|Spain|104168
Venissieux|France|65502
Epinay-sur-Seine|France|52833
Fafe|Portugal|50633
Menden|Germany|52121
Frechen|Germany|51927
Merignac|France|78090
Rivas-Vaciamadrid|Spain|103148|Rivas
Vaulx-en-Velin|France|53069
Chelles|France|54620
Cinisello Balsamo|Italy|74528
Felgueiras|Portugal|58065
Sartrouville|France|52763
Agualva-Cacem|Portugal|81020
Rubi|Spain|82823
Valongo|Portugal|101464
Corigliano-Rossano|Italy|74066|Rossano
Saint-Herblain|France|50973|St Herblain
Casoria|Italy|74021
Marano di Napoli|Italy|57777
Santa Lucia de Tirajana|Spain|78584|Santa Lucia
Valdemoro|Spain|85972
Kempten|Germany|67916
Mijas|Spain|95104
El Ejido|Spain|91440
Las Rozas de Madrid|Spain|99037|Las Rozas
Pozuelo de Alarcon|Spain|89770|Pozuelo
Velez-Malaga|Spain|86048
Hereford|United Kingdom|53113
Maidstone|United Kingdom|109490
Aylesbury|United Kingdom|63273
Stafford|United Kingdom|70592
Shrewsbury|United Kingdom|76802
Langenfeld|Germany|59821
Solna|Sweden|86573
Tonsberg|Norway|56533
Fredrikstad|Norway|86243
Sodertalje|Sweden|78377
Karlstad|Sweden|69615
Herning|Denmark|51312
Vaxjo|Sweden|74052
Boras|Sweden|75565
Hameenlinna|Finland|68614
Baerum|Norway|133228
Moss|Norway|53207
Silkeborg|Denmark|50866
Sarpsborg|Norway|60614
Lillestrom|Norway|96771
Seinajoki|Finland|67283
Sandefjord|Norway|67062
Sandnes|Norway|85785
Skien|Norway|50607
Kouvola|Finland|78824
Mikkeli|Finland|51551
Norrkoping|Sweden|98229
Halmstad|Sweden|72979
Horsens|Denmark|64418
Eskilstuna|Sweden|70646
Syracuse (Sicily)|Italy|115515
Cordoba (Spain)|Spain|323262
Colchester (Essex)|United Kingdom|121859
Cartagena (Spain)|Spain|220704
Halifax (West Yorkshire)|United Kingdom|104100
Newport (Wales)|United Kingdom|159600
Boston (Lincolnshire)|United Kingdom|64600
Lancaster (Lancashire)|United Kingdom|52660
Margate (Kent)|United Kingdom|61223
Leon (Spain)|Spain|123446
Kettering (Northamptonshire)|United Kingdom|56226
Bangor (County Down)|United Kingdom|61011
Weymouth (Dorset)|United Kingdom|53046
Mansfield (Nottinghamshire)|United Kingdom|79921
Rochester (Kent)|United Kingdom|62982
Merida (Spain)|Spain|60225
Frankfurt (Oder)|Germany|56586
Brentwood (Essex)|United Kingdom|77047
Guadalajara (Spain)|Spain|92834
Cuenca (Spain)|Spain|53600
Hamilton (South Lanarkshire)|United Kingdom|54080
Sale (Greater Manchester)|United Kingdom|134022
Hagen|Germany|189983
Livingston (West Lothian)|United Kingdom|57030
San Fernando (Spain)|Spain|93338
Portland (Maine)|United States|68408
Birmingham (Alabama)|United States|200733
Cambridge (Massachusetts)|United States|118403
Saint Petersburg (Florida)|United States|258308
Worcester (Massachusetts)|United States|206518
Toledo (Ohio)|United States|270871
Wilmington (Delaware)|United States|70898
Manchester (New Hampshire)|United States|115644
Santa Cruz (California)|United States|62956
Glendale (California)|United States|196543
Durham (North Carolina)|United States|283506
Alexandria (Virginia)|United States|159467
Springfield (Missouri)|United States|169176
Springfield (Massachusetts)|United States|155929
St. George (Utah)|United States|95342
Vancouver (Washington)|United States|190915
Kansas City (Kansas)|United States|156607
Columbia (Missouri)|United States|126254
Lancaster (Pennsylvania)|United States|58039
Santa Clara (California)|United States|127647
Augusta (Georgia)|United States|202081
Odessa (Texas)|United States|114428
Columbus (Georgia)|United States|206922
Plymouth (Massachusetts)|United States|61217
Santa Ana (California)|United States|310227
Rochester (Minnesota)|United States|121395
Bethlehem (Pennsylvania)|United States|75781
Reading (Pennsylvania)|United States|95112
Fayetteville (Arkansas)|United States|93949
Canton (Ohio)|United States|70872
Bayonne (New Jersey)|United States|71686
Melbourne (Florida)|United States|84678
Lafayette (Indiana)|United States|70783
Aurora (Illinois)|United States|180542
Palm Desert|United States|51163
Concord (California)|United States|125410
Richmond (California)|United States|116448
Huntington (New York)|United States|204127
Carson|United States|95558
Georgetown (Texas)|United States|67176
Springfield (Ohio)|United States|58662
Waterloo (Iowa)|United States|67314
Hamilton (Ohio)|United States|63399
Jackson (Tennessee)|United States|68205
Columbus (Indiana)|United States|50474
Spring|United States|62559
Albany (Georgia)|United States|69647
Lawrence (Massachusetts)|United States|89143
Norwalk (Connecticut)|United States|91184
Bloomington (Minnesota)|United States|89987
Bloomington (Illinois)|United States|78680
Fairfield (Connecticut)|United States|61512
Southampton (New York)|United States|69036
Portsmouth (Virginia)|United States|97915
Antioch (California)|United States|115291
Concord (North Carolina)|United States|105240
Bristol (Connecticut)|United States|60833
Roswell (Georgia)|United States|92833
Victoria (Texas)|United States|65534
Springfield (Oregon)|United States|61851
St. Charles|United States|70493
Jacksonville (North Carolina)|United States|72723
Madison (Alabama)|United States|56933
Westminster (California)|United States|90911
Parma (Ohio)|United States|81146
Pasadena (Texas)|United States|151950
Lakewood (California)|United States|82496
Peoria (Arizona)|United States|190985
Smyrna (Tennessee)|United States|53070
Lakewood (Ohio)|United States|50942
Smyrna (Georgia)|United States|55663
Albany (Oregon)|United States|56472
Brandon (Florida)|United States|114626
Burlington (North Carolina)|United States|57303
Beaumont (California)|United States|53036
Bellevue (Nebraska)|United States|64176
Spring Hill (Tennessee)|United States|60301
Canton (Michigan)|United States|98659
Plymouth (Minnesota)|United States|81026
Manchester (Connecticut)|United States|59713
Hamburg (New York)|United States|60085
Lakewood (Washington)|United States|63612
St. George (Louisiana)|United States|86000
Aspen Hill|United States|51063
Washington (Tyne and Wear)|United Kingdom|67158
Athens (Georgia)|United States|127315
Dublin (California)|United States|72589
Wellington (Florida)|United States|61637
Fano (Italy)|Italy|59909
Manhattan (Kansas)|United States|54100
New Britain (Connecticut)|United States|74135
Greece (New York)|United States|96926
London (Ontario)|Canada|422324
Kingston (Ontario)|Canada|132485
Saint John (New Brunswick)|Canada|67575
Sault Ste. Marie|Canada|73368
Markham|Canada|338503
Saguenay|Canada|148886
Guelph|Canada|143740
Burnaby|Canada|249125
Oakville|Canada|213759
Barrie|Canada|147829
St. Catharines|Canada|136803|St. Catherines
Abbotsford|Canada|153524
Sherbrooke|Canada|181360
Oshawa|Canada|175383
North Bay|Canada|51553
Trois-Rivieres|Canada|144472
Belleville|Canada|50716
Sarnia|Canada|72320
Vaughan|Canada|323103
Grande Prairie|Canada|64141
Newmarket|Canada|84224
Richmond Hill|Canada|202022
Chilliwack|Canada|83788
New Westminster|Canada|78916
Coquitlam|Canada|148625
Ajax|Canada|126666
Milton|Canada|132979
Chatham-Kent|Canada|103988
Saanich|Canada|117735
Whitby (Ontario)|Canada|138501
Kawartha Lakes|Canada|75423
Pickering|Canada|91771
Maple Ridge|Canada|90990
Delta|Canada|108455
North Vancouver|Canada|52898
Longueuil|Canada|261516
Saint-Jean-sur-Richelieu|Canada|99494
Caledon|Canada|66502
Rimouski|Canada|50019
Airdrie|Canada|74100
St. Albert|Canada|68232
Port Coquitlam|Canada|61498
Drummondville|Canada|82790
Shawinigan|Canada|51149
Mirabel|Canada|64973
Chicoutimi|Canada|70070
Terrebonne|Canada|123182
Levis|Canada|156225
Brossard|Canada|95066
Langley|Canada|132603
Granby|Canada|70329
Saint-Hyacinthe|Canada|59448
Halton Hills|Canada|61161
Saint-Jerome|Canada|82274
Chateauguay|Canada|52320
Dollard-des-Ormeaux|Canada|50171
Blainville|Canada|61114
Repentigny|Canada|87980
Mascouche|Canada|54540
Matamoros|Mexico|510739
Tampico|Mexico|297373
Piedras Negras|Mexico|173959
Nuevo Laredo|Mexico|416055
Nogales|Mexico|261137
Coatzacoalcos|Mexico|212540
Reynosa|Mexico|691557
Tecate|Mexico|81059
Guaymas|Mexico|117253
San Nicolas de los Garza|Mexico|412199|San Nicolas
Ciudad Acuna|Mexico|160225
Ciudad Victoria|Mexico|332100
Guadalupe (Nuevo Leon)|Mexico|635862
San Luis Rio Colorado|Mexico|176685
Tlaquepaque|Mexico|650123
Parral|Mexico|113843|Hidalgo del Parral
Monclova|Mexico|237169
Orizaba|Mexico|120500
Tlalnepantla de Baz|Mexico|700734|Tlalnepantla
Chilpancingo|Mexico|225728
Gomez Palacio|Mexico|301742
Ciudad del Carmen|Mexico|191238
Fresnillo|Mexico|143281
Apodaca|Mexico|536436
Tehuacan|Mexico|293825
Tulancingo|Mexico|161069
La Piedad|Mexico|106490
Cuautitlan Izcalli|Mexico|515353
Poza Rica|Mexico|180057
Silao|Mexico|83352
Tonala|Mexico|442440
Chimalhuacan|Mexico|703215
Guadalupe (Zacatecas)|Mexico|170029
Guasave|Mexico|77849
Metepec|Mexico|164182
Delicias|Mexico|128548
Ramos Arizpe|Mexico|114010
San Juan del Rio|Mexico|177719
Ocotlan|Mexico|94978
Salina Cruz|Mexico|76660
Ixtapaluca|Mexico|368585
Ciudad Madero|Mexico|205933
Minatitlan|Mexico|101336
Papantla|Mexico|55452
Rioverde|Mexico|58158
Chiapa de Corzo|Mexico|55931
San Francisco del Rincon|Mexico|79772
Xalisco|Mexico|65229
Chalco de Diaz Covarrubias|Mexico|174704|Chalco
General Escobedo|Mexico|454967
Ciudad Lopez Mateos|Mexico|523065|Atizapan de Zaragoza,Atizapan,Lopez Mateos
Jiutepec|Mexico|174629
Santa Cruz Xoxocotlan|Mexico|81848|Xoxocotlan
Tecoman|Mexico|88337
Teziutlan|Mexico|62849
Kanasin|Mexico|139753
San Pedro Cholula|Mexico|129032|Cholula
Soledad de Graciano Sanchez|Mexico|310192|Soledad
Zumpango|Mexico|159647
Cardenas|Mexico|80454
Chicoloapan de Juarez|Mexico|193532|Chicoloapan
Ciudad Nicolas Romero|Mexico|323545|Nicolas Romero
Lerdo|Mexico|96243
Uriangato|Mexico|52156
Xico|Mexico|384327|Valle de Chalco
Jacona|Mexico|61510
Temixco|Mexico|104461
Jesus Maria|Mexico|63805
Ojo de Agua|Mexico|386290
Villa de Alvarez|Mexico|147496
Chiautempan|Mexico|53373
Cortazar|Mexico|69371
Waterloo (Ontario)|Canada|121436
Richmond (British Columbia)|Canada|209937
Burlington (Ontario)|Canada|186948
Peterborough (Ontario)|Canada|81032
Cambridge (Ontario)|Canada|138479
Aurora (Ontario)|Canada|55445
La Paz (Baja California Sur)|Mexico|250141
Cordoba (Veracruz)|Mexico|139075
Salamanca (Guanajuato)|Mexico|160682
La Paz (State of Mexico)|Mexico|304088|Los Reyes La Paz,Los Reyes Acaquilpan,Los Reyes
Kramatorsk|Ukraine|147145
Targoviste|Romania|66965
Kostiantynivka|Ukraine|72888|Kostyantynivka,Konstantinovka
Bakhmut|Ukraine|71094|Artemivsk,Artyomovsk
Luhansk|Ukraine|403938|Lugansk,Voroshilovgrad
Przemysl|Poland|56466
Feodosia|Ukraine|64493|Theodosia,Feodosiya
Kamianske|Ukraine|226845|Dniprodzerzhynsk
Suwalki|Poland|68752
Gniezno|Poland|65452
Chelm|Poland|59546
Mukachevo|Ukraine|85569|Mukacheve,Munkacs
Izmail|Ukraine|70731
Berdychiv|Ukraine|73046
Chorzow|Poland|101184
Pokrovsk|Ukraine|63437|Krasnoarmiysk
Legnica|Poland|94878
Jelenia Gora|Poland|75429
Kalisz|Poland|95905
Nowy Sacz|Poland|81281
Doboj|Bosnia and Herzegovina|68514
Istocno Sarajevo|Bosnia and Herzegovina|61516|East Sarajevo
Drobeta-Turnu Severin|Romania|79865|Turnu Severin,Drobeta
Koszalin|Poland|105883
Yevpatoria|Ukraine|105549|Eupatoria,Evpatoria
Prijedor|Bosnia and Herzegovina|89397
Slupsk|Poland|87660
Druzhkivka|Ukraine|53977
Vranje|Serbia|55214
Bistrita|Romania|78877
Krusevac|Serbia|58745
Botosani|Romania|90010
Lomza|Poland|60848
Wloclawek|Poland|104705
Bytom|Poland|148687
Hunedoara|Romania|50457
Irpin|Ukraine|65167
Grudziadz|Poland|90890
Lubin|Poland|70016
Alytus|Lithuania|51856
Most|Czechia|63474
Piatra Neamt|Romania|79679
Teplice|Czechia|50912
Tulcea|Romania|65624
Elk|Poland|60390
Kladno|Czechia|69664
Siedlce|Poland|76357
Stargard|Poland|67348
Piotrkow Trybunalski|Poland|66901
Tomaszow Mazowiecki|Poland|59388
Berdiansk|Ukraine|106311|Berdyansk
Deva|Romania|53113
Horlivka|Ukraine|239828|Gorlovka
Kolomyia|Ukraine|60821|Kolomyya,Kolomea
Resita|Romania|58393
Sfantu Gheorghe|Romania|50080
Giurgiu|Romania|54551
Makiivka|Ukraine|338968|Makeyevka
Drohobych|Ukraine|73682
Ramnicu Valcea|Romania|93151
Glogow|Poland|64261
Tczew|Poland|57990
Pavlohrad|Ukraine|101430|Pavlograd
Biala Podlaska|Poland|55429
Rybnik|Poland|133772
Targu Jiu|Romania|73545
Dabrowa Gornicza|Poland|112876
Szolnok|Hungary|65564
Yambol|Bulgaria|58997
Kovel|Ukraine|67575
Lida|Belarus|102603
Inowroclaw|Poland|69576
Leszno|Poland|61791
Slatina|Romania|63487
Korosten|Ukraine|61496
Yenakiieve|Ukraine|79348|Yenakiyeve
Focsani|Romania|66648
Cazin|Bosnia and Herzegovina|66149
Konin|Poland|69858
Nikopol|Ukraine|105160
Rubizhne|Ukraine|55247|Rubezhnoye
Slutsk|Belarus|58995
Pruszkow|Poland|65283
Zviahel|Ukraine|55086|Novohrad-Volynskyi
Calarasi|Romania|58211
Nizhyn|Ukraine|66981|Nezhin
Stryi|Ukraine|59425
Chornomorsk|Ukraine|57983|Illichivsk
Lysychansk|Ukraine|96161|Lisichansk
Ostrow Wielkopolski|Poland|70725
Barlad|Romania|52475
Ruda Slaska|Poland|131062
Stalowa Wola|Poland|57620
Vaslui|Romania|63035
Brovary|Ukraine|109473
Konotop|Ukraine|83543
Zalau|Romania|52359
Havirov|Czechia|68674
Shostka|Ukraine|71966
Frydek-Mistek|Czechia|53590
Enerhodar|Ukraine|52237
Jaworzno|Poland|86812
Myrnohrad|Ukraine|50360|Dymytrov
Myslowice|Poland|71473
Boryspil|Ukraine|62281|Borispol
Zory|Poland|61793
Jastrzebie-Zdroj|Poland|82788
Kedzierzyn-Kozle|Poland|56931
Tarnowskie Gory|Poland|61288
Erd|Hungary|71495
Alchevsk|Ukraine|107438|Kommunarsk
Kadiivka|Ukraine|74546|Stakhanov
Sheptytskyi|Ukraine|64297|Chervonohrad
Kobryn|Belarus|52235|Kobrin
Salihorsk|Belarus|96418|Soligorsk
Maladzyechna|Belarus|87339|Molodechno
Kamez|Albania|61739|Kamza
Lozova|Ukraine|54026
Oleksandriia|Ukraine|76097|Oleksandriya,Alexandriya
Siemianowice Slaskie|Poland|63657
Legionowo|Poland|53216
Samar (Ukraine)|Ukraine|69855|Novomoskovsk
Piekary Slaskie|Poland|51876
Zgierz|Poland|55079
Popesti-Leordeni|Romania|53434
Novopolotsk|Belarus|94666|Navapolatsk
Zhodzina|Belarus|62983|Zhodino
Rechytsa|Belarus|64508|Rechitsa
Smila|Ukraine|65675
Zhlobin|Belarus|75732
Antratsyt|Ukraine|52150
Khrustalnyi|Ukraine|79533|Krasnyi Luch
Svyetlahorsk|Belarus|61280|Svetlogorsk
Chystiakove|Ukraine|53462|Torez
Khartsyzk|Ukraine|56182
Rhodes (Greece)|Greece|54562|Rhodes City,Rodos
Chalcis|Greece|64490|Chalkida,Halkida,Chalkis
Katerini|Greece|80700
Kallithea|Greece|97616
Marousi|Greece|71830|Maroussi,Amarousio
Palaio Faliro|Greece|64863
Peristeri|Greece|133630
Nea Smyrni|Greece|72853
Agia Paraskevi|Greece|62147
Acharnes|Greece|98893|Acharnai,Menidi
Ilion|Greece|84004|Ilio
Nea Ionia|Greece|64611
Nikaia|Greece|88077|Nikea
Zografou|Greece|69874
Chalandri|Greece|77102
Aigaleo|Greece|65831|Egaleo
Agios Dimitrios|Greece|71664
Ilioupoli|Greece|76730
Keratsini|Greece|75721
Korydallos|Greece|61248
Petroupoli|Greece|60146|Petroupolis
Brest (Belarus)|Belarus|347138|Brest-Litovsk
Kaifeng|China|4824016
Chiba|Japan|975014
Foshan|China|9498863
Sejong City|South Korea|391984
Saitama|Japan|1325843
Quanzhou|China|8782285
Shantou|China|5502031
Wenzhou|China|9572903
Zhuhai|China|2439585
Toyota|Japan|422106
Sokcho|South Korea|79846
Kitakyushu|Japan|935084
Yiwu|China|1859390
Sagamihara|Japan|725696
Hamamatsu|Japan|788211
Yokosuka|Japan|390275
Ordos City|China|2153638
Yinchuan|China|2859074
Chaozhou (Guangdong)|China|2568387
Huizhou|China|6042852
Dandong|China|2188436
Yangzhou|China|4559797
Zhongshan|China|4418060
Shizuoka|Japan|685589
Changzhou|China|5278121
Matsumoto|Japan|239115
Nyingchi|China|238936
Okinawa City|Japan|142094
Yan'an|China|2282581
Seongnam|South Korea|918771
Goyang|South Korea|1061929
Hulunbuir|China|2242875
Zhanjiang|China|6981236
Xuzhou|China|9083790
Yantai|China|7102116
Jingdezhen|China|1618979
Hwaseong|South Korea|1004079
Cheongju|South Korea|848000
Changwon|South Korea|1009998
Manzhouli|China|150508
Rason|North Korea|196954
Weihai|China|2906548
Qiqihar|China|4067489
Gifu|Japan|400118
Toyama|Japan|413028
Uijeongbu|South Korea|463324
Heihe|China|1286401
Shimonoseki|Japan|252844
Anyang (Gyeonggi)|South Korea|233172
Pohang|South Korea|503780
Pyeongtaek|South Korea|607435
Shaoxing|China|5270977
Sakai|Japan|824408
Miyazaki|Japan|397476
Nantong|China|7726635
Xianyang|China|4983340
Anyang (Henan)|China|5477614
Zhoushan City|China|1157817
Tangshan|China|7717983
Geoje City|South Korea|231353
Kure|Japan|212159
Linyi|China|11018365
Jiangmen|China|4798090
Jieyang|China|5577814
Paju|South Korea|497775
Nishinomiya|Japan|487010
Andong|South Korea|153131
Utsunomiya|Japan|518197
Mokpo|South Korea|214701
Nampo|North Korea|366815
Baoding|China|11544036
Baotou|China|2709378
Zhangjiakou|China|4118908
Zhangzhou|China|5054328
Handan|China|9413990
Taizhou (Zhejiang)|China|6622888
Machida|Japan|434414
Wuhu|China|3644420
Anshan|China|3325372
Mito|Japan|270445
Ansan|South Korea|623256
Hami|China|673383
Bucheon|South Korea|772450
Yongin|South Korea|1084817
Kashima|Japan|67001
Yichang|China|3762407
Jiaxing|China|5400868
Uji|Japan|179626
Xiangyang|China|5260951
Tottori|Japan|187323
Cheonan|South Korea|656583
Kasukabe|Japan|228975
Zhenjiang|China|3210418
Chengde|China|3354444
Takamatsu|Japan|417814
Wakayama|Japan|353299
Liuzhou|China|4157934
Qinhuangdao|China|3107400
Fukui|Japan|261474
Jinju|South Korea|341545
Leshan|China|3160168
Hyesan|North Korea|192680
Ichikawa|Japan|495768
Jinhua|China|7050683
Tsukuba|Japan|246647
Sado City|Japan|54304
Asan|South Korea|319929
Jilin City|China|3623713
Jiujiang|China|4600276
Meizhou|China|3873239
Putian|China|3210714
Sasebo|Japan|242664
Ishinomaki|Japan|138856
Seogwipo|South Korea|183858
Yamaguchi|Japan|193761
Ganzhou|China|8970014
Jingzhou|China|5231180
Shangqiu|China|7816831
Suzuka|Japan|195250
Wonju|South Korea|330854
Xuchang|China|4379998
Kofu|Japan|187144
Lianyungang|China|4599360
Narita|Japan|130689
Yeosu|South Korea|273761
Oita|Japan|477186
Nagqu|China|504838
Weifang|China|9386705
Fujisawa|Japan|436744
Karamay|China|487000
Hachioji|Japan|575721
Matsue|Japan|201802
Zunyi|China|6606675
Chifeng|China|4035967
Huzhou|China|3367579
Takarazuka|Japan|224055
Zibo|China|4704138
Kurashiki|Japan|474862
Huai'an|China|4556230
Ise|Japan|122432
Iwakuni|Japan|128401
Jiuquan|China|1055706
Nanyang|China|9713112
Golmud|China|221863
Kushiro|Japan|165699
Zhaoqing|China|4113594
Jinzhou|China|2703853
Namyangju|South Korea|732086
Okazaki|Japan|385376
Onomichi|Japan|130143
Tokushima|Japan|254510
Tonghua|China|1812114
Zhangye|China|1131016
Fushun|China|1861372
Gunpo|South Korea|270443
Hanzhong|China|3211462
Pu'er City|China|2404954
Gunsan|South Korea|275155
Kawaguchi|Japan|593900
Maebashi|Japan|331849
Musashino|Japan|148971
Tenri|Japan|61471
Tokorozawa|Japan|341289
Tomakomai|Japan|170223
Ulanqab|China|1706328
Kawagoe|Japan|354598
Suncheon|South Korea|265390
Tsu|Japan|273267
Yancheng|China|6709629
Miyako|Japan|50855
Nagaoka|Japan|265868
Ningde|China|3146789
Beihai|China|1853227
Chamdo|China|760966
Fuxin|China|1647280
Gimhae|South Korea|534124
Yibin|China|4588804
Yulin (Guangxi)|China|5796766
Aizuwakamatsu|Japan|117924
Changde|China|5279102
Kashihara|Japan|119146
Funabashi|Japan|641499
Langfang|China|5464087
Mudanjiang|China|2290208
Anqing|China|4165284
Ashiya|Japan|94116
Daqing|China|2781562
Icheon|South Korea|209003
Mianyang|China|4868243
Tongyeong|South Korea|116924
Xinxiang|China|6251929
Fuchu|Japan|263093
Fukuyama|Japan|459576
Gimpo|South Korea|352683
Haeju|North Korea|273300
Iwaki|Japan|336111
Miyakojima City|Japan|52390
Naruto|Japan|55264
Tai'an|China|5472217
Toyohashi|Japan|371507
Hirosaki|Japan|167803
Izumo|Japan|171995
Qingyuan|China|3969473
Shaoguan|China|2855131
Taizhou (Jiangsu)|China|4512762
Ezhou|China|1079353
Hengyang|China|6645243
Mitaka|Japan|194460
Quzhou|China|2276184
Ube|Japan|162873
Chitose|Japan|97945
Jining|China|8357897
Nisshin|Japan|92823
Odawara|Japan|189038
Takasaki|Japan|372639
Hachinohe|Japan|222799
Joetsu|Japan|187291
Kashiwa|Japan|427603
Liaoyang|China|1604580
Misato|Japan|141913
Tongliao|China|2873168
Yokkaichi|Japan|310263
Amagasaki|Japan|455555
Chungju|South Korea|207839
Iga|Japan|85883
Jiamusi|China|2156505
Miryang|South Korea|99425
Cangzhou|China|7300783
Fuqing|China|1390487
Koganei|Japan|127226
Saga|Japan|232359
Yueyang|China|5051922
Hanam|South Korea|329822
Hitachi|Japan|172709
Huangshan City|China|1330565
Kitahiroshima|Japan|58125
Luzhou|China|4254149
Obihiro|Japan|165684
Shangrao|China|6491088
Shanwei|China|2738482
Oshu|Japan|112531
Bengbu|China|3296408
Fangchenggang|China|1046068
Fuji|Japan|243739
Gwacheon|South Korea|85132
Komatsu|Japan|106023
Rizhao|China|2968365
Sariwon|North Korea|307764
Shannan|China|354035
Wuzhou|China|2820977
Xinyang|China|6234401
Ota|Japan|222806
Tachikawa|Japan|181115
Urayasu|Japan|169749
Yuxi|China|2249502
Zama|Japan|130753
Chichibu|Japan|59326
Gongju|South Korea|102960
Iksan|South Korea|270758
Iwata|Japan|165688
Lishui|China|2507396
Longyan|China|2723637
Mishima|Japan|107416
Yingkou|China|2328582
Tianshui|China|2984659
Ya'an|China|1434603
Baoji|China|3321853
Baoshan|China|2431211
Imabari|Japan|149209
Kanggye|North Korea|251971
Maoming|China|6174050
Pyongsong|North Korea|236583
Shiyan|China|3209004
Yulin (Shaanxi)|China|3624750
Chofu|Japan|240359
Panzhihua|China|1212203
Guri|South Korea|180063
Nanping|China|2680645
Wuwei|China|1464955
Yongzhou|China|5289824
Akashi|Japan|299699
Dezhou|China|5611194
Gwangmyeong|South Korea|318021
Ichinomiya|Japan|378108
Kariya|Japan|153178
Kurume|Japan|302858
Numazu|Japan|187653
Xiangtan|China|2726181
Zhuzhou|China|3902738
Gumi|South Korea|421075
Gwangyang|South Korea|152160
Hikone|Japan|113191
Kitami|Japan|115441
Shaoyang|China|6563520
Suita|Japan|384953
Zhumadian|China|7008427
Zigong|China|2489256
Ashikaga|Japan|142882
Baise|China|3571505
Hegang|China|891271
Heze|China|8795939
Hirakata|Japan|396694
Kiryu|Japan|95894
Koriyama|Japan|327040
Ma'anshan|China|2159930
Yangsan|South Korea|297532
Zhaotong|China|5092611
Chenzhou|China|4667134
Dongducheon|South Korea|97424
Dongying|China|2193518
Fujinomiya|Japan|127252
Guang'an|China|3254883
Kimchaek|North Korea|207299
Maizuru|Japan|78730
Muroran|Japan|81580
Nago|Japan|63060
Sanmenxia|China|2034872
Xingtai|China|7111106
Yuncheng|China|4774508
Zhoukou|China|9026015
Dazaifu|Japan|72430
Fuyang|China|8200264
Gotemba|Japan|86334
Ito|Japan|64473
Linfen|China|3976481
Qinzhou|China|3302238
Qujing|China|5765775
Tahara|Japan|59015
Tsuruga|Japan|63724
Yangjiang|China|2602959
Changzhi|China|3180884
Gimcheon|South Korea|135076
Hoeryong|North Korea|153532
Huanggang|China|5882719
Nanchong|China|5607565
Sakata|Japan|99235
Sakura|Japan|169059
Seki|Japan|85636
Suqian|China|4986192
Tosu|Japan|74673
Anseong|South Korea|193220
Bozhou|China|4996844
Hita|Japan|61755
Huaihua|China|4587594
Huludao|China|2434194
Kiyosu|Japan|69809
Liaocheng|China|5952128
Naju|South Korea|92582
Osan|South Korea|229792
Pingdingshan|China|4987137
Seosan|South Korea|169221
Takaoka|Japan|165880
Tongren|China|3298468
Ueda|Japan|152948
Atsugi|Japan|223815
Bayannur|China|1538715
Boryeong|South Korea|101852
Chongzuo|China|2088692
Dangjin|South Korea|163762
Higashiosaka|Japan|490819
Huainan|China|3033528
Jecheon|South Korea|129066
Kadoma|Japan|118319
Mutsu|Japan|53767
Pocheon|South Korea|163388
Tama|Japan|147252
Uruma|Japan|122371
Usa City|Japan|52767
Anjo|Japan|188801
Baishan|China|968373
Benxi|China|1326018
Chuzhou|China|3987054
Fuefuki|Japan|67396
Guangyuan|China|2305657
Hiratsuka|Japan|257662
Hitachinaka|Japan|154311
Liupanshui|China|3031602
Lu'an|China|4393699
Siheung|South Korea|514274
Uiwang|South Korea|154879
Weinan|China|4688744
Ome|Japan|132436
Anju|North Korea|240117
Chaoyang|China|2872857
Danzhou|China|954259
Heyuan|China|2837686
Karatsu|Japan|116052
Koka|Japan|88538
Lincang|China|2257991
Longnan|China|2407272
Nagahama|Japan|113740
Nonsan|South Korea|115925
Panjin|China|1389691
Siping|China|1814733
Omihachiman|Japan|81545
Anshun|China|2470630
Deyang|China|3456161
Heshan|China|530684
Hino|Japan|190598
Jincheng|China|2194545
Kitakami|Japan|92348
Komaki|Japan|147897
Puyang|China|3772088
Sacheon|South Korea|113335
Sangju|South Korea|102892
Sanming|China|2486450
Yamato|Japan|239146
Yeoju|South Korea|114167
Zushi|Japan|56996
Bijie|China|6899636
Echizen|Japan|80264
Fukuroi|Japan|86851
Ibaraki|Japan|283835
Jixi|China|1502060
Kaga|Japan|62997
Kasugai|Japan|306449
Kyotango|Japan|50857
Matsudo|Japan|497514
Meishan|China|2955219
Mungyeong|South Korea|71863
Sakurai|Japan|53716
Samcheok|South Korea|69509
Toyokawa|Japan|183965
Tsuchiura|Japan|137825
Urasoe|Japan|115855
Wuhai|China|556621
Yichun (Heilongjiang)|China|878881
Yonezawa|Japan|80795
Zaozhuang|China|3855601
Asahi|Japan|63507
Fussa|Japan|56713
Hengshui|China|4212933
Huangshi|China|2469079
Iida|Japan|96642
Ikeda|Japan|104148
Kameoka|Japan|85962
Kisarazu|Japan|136118
Kishiwada|Japan|188015
Kuwana|Japan|138798
Noda|Japan|152227
Puli|Taiwan|75672
Takatsuki|Japan|347496
Tsuyama|Japan|99410
Xuancheng|China|2500063
Yanagawa|Japan|64120
Yatsushiro|Japan|122134
Amakusa City|Japan|74861
Binzhou|China|3928568
Chigasaki|Japan|242347
Gimje|South Korea|81644
Ichihara|Japan|268038
Jiaozuo|China|3521078
Kakamigahara|Japan|143641
Kodaira|Japan|196959
Tanchon|North Korea|345875
Tieling|China|2388294
Uwajima|Japan|69639
Warabi|Japan|74996
Xinzhou|China|2689668
Yangju|South Korea|285930
Yichun (Jiangxi)|China|5007702
Yonago|Japan|147210
Chongju|North Korea|189742
Dazhou|China|5385422
Fujioka|Japan|62608
Haidong|China|1358471
Isesaki|Japan|210332
Itami|Japan|198522
Kaechon|North Korea|319554
Kesennuma|Japan|59341
Kirishima|Japan|123812
Luohe|China|2367490
Marugame|Japan|109165
Minoh|Japan|136976
Namwon|South Korea|80499
Niihama|Japan|114971
Oyama|Japan|167874
Seto|Japan|127327
Tanabe|Japan|68986
Tokoname|Japan|57507
Toyonaka|Japan|399263
Toyooka|Japan|77005
Yunfu|China|2383350
Abiko|Japan|130290
Bole|China|246706
Choshi|Japan|54570
Donghae|South Korea|90255
Ginowan|Japan|99256
Gyeongsan|South Korea|264754
Hanamaki|Japan|92815
Handa|Japan|117544
Hechi|China|3417945
Inuyama|Japan|72926
Jeongeup|South Korea|110194
Jingmen|China|2596927
Kokubunji|Japan|129619
Koshigaya|Japan|341784
Luliang|China|3398431
Manpo|North Korea|116760
Nanao|Japan|50207
Neijiang|China|3140678
Pingxiang|China|1804805
Tochigi|Japan|153508
Tongling|China|1311726
Ushiku|Japan|84505
Xianning|China|2658316
Yiyang|China|3851564
Yongkang|China|964203
Ogaki|Japan|158386
Ankang|China|2493436
Baicheng|China|1551378
Chizhou|China|1342764
Gamagori|Japan|79292
Guyuan|China|1142142
Hadano|Japan|164292
Hezhou|China|2007858
Higashihiroshima|Japan|197347
Imari|Japan|52694
Ishikari|Japan|58284
Izumisano|Japan|99328
Kakegawa|Japan|113954
Kakogawa|Japan|260595
Kashiwazaki|Japan|81027
Kumagaya|Japan|193190
Qionghai|China|528238
Saijo|Japan|103760
Saku|Japan|98292
Sano|Japan|114842
Shiojiri|Japan|66181
Suihua|China|3756167
Tsuruoka|Japan|121371
Yao|Japan|264913
Yeongcheon|South Korea|95730
Omura|Japan|95590
Asaka|Japan|143915
Baiyin|China|1512110
Ebina|Japan|135557
Higashimurayama|Japan|150458
Huaibei|China|1970265
Hofu|Japan|113170
Ikoma|Japan|116518
Itoshima|Japan|98527
Jinzhong|China|3379498
Kanoya|Japan|100880
Kanuma|Japan|94591
Kosai|Japan|57682
Kunitachi|Japan|75133
Kyotanabe|Japan|73985
Liaoyuan|China|996903
Loudi|China|3826996
Lukang|Taiwan|81971
Nagakute|Japan|62473
Nishitokyo|Japan|207436
Qingyang|China|2179716
Sennan|Japan|59634
Shangluo|China|2041231
Shuangyashan|China|1208803
Shuozhou|China|1593444
Ulanhot|China|356035
Wako|Japan|84120
Yeongju|South Korea|109266
Odate|Japan|68593
Omuta|Japan|110054
Dingxi|China|2524097
Guigang|China|4316262
Hakusan|Japan|110135
Hatsukaichi|Japan|114699
Huichon|North Korea|168180
Hyuga|Japan|59276
Iwamizawa|Japan|79361
Kusatsu|Japan|143230
Kusong|North Korea|196515
Miki|Japan|74255
Minami-Alps|Japan|69642
Musashimurayama|Japan|71183
Nakatsugawa|Japan|75500
Nasushiobara|Japan|115602
Neyagawa|Japan|227997
Pingliang|China|1848607
Satsumasendai|Japan|91875
Sinpo|North Korea|152759
Suining|China|2814196
Tongxiang|China|1029754
Yangquan|China|1318505
Zhongwei|China|1067336
Akiruno|Japan|79600
Chaozhou (Pingtung)|Taiwan|53665
Ebetsu|Japan|119819
Fukuchiyama|Japan|77150
Hebi|China|1565973
Ichinoseki|Japan|111824
Iizuka|Japan|126136
Ina|Japan|65670
Itoman|Japan|60903
Kawanishi|Japan|152076
Kuki|Japan|150197
Luodong|Taiwan|68639
Mihara|Japan|89972
Murakami|Japan|56713
Nishio|Japan|168992
Sanjo|Japan|93671
Sayama|Japan|148474
Suizhou|China|2047923
Tongchuan|China|698322
Xiaogan|China|4270371
Xinyu|China|1202499
Yachiyo|Japan|200538
Yamatokoriyama|Japan|81494
Ziyang|China|2308631
Akishima|Japan|112110
Daisen|Japan|76164
Fujieda|Japan|140947
Goshogawara|Japan|50757
Hamada|Japan|53753
Hamura|Japan|53970
Isahaya|Japan|133512
Izumi (Kagoshima)|Japan|51893
Jinchang|China|438026
Kiyose|Japan|75389
Koga (Ibaraki)|Japan|138237
Liyang|China|785092
Matsusaka|Japan|158472
Miaoli|Taiwan|85546
Muko|Japan|56152
Nakatsu|Japan|82714
Nichinan|Japan|50518
Niiza|Japan|165997
Nobeoka|Japan|117711
Qianjiang|China|830900
Sabae|Japan|68666
Shibata|Japan|94258
Shibukawa|Japan|73064
Shimada|Japan|95198
Shunan|Japan|137899
Songyuan|China|2252994
Tamana|Japan|64206
Tendo|Japan|61981
Tomigusuku|Japan|64850
Tsubame|Japan|76590
Tokai|Japan|113144
Uki|Japan|57096
Wuzhong|China|1382713
Yokote|Japan|84556
Osaki|Japan|127135
Azumino|Japan|93927
Bazhong|China|2712894
Date|Japan|58232
Eniwa|Japan|70102
Inagi|Japan|94409
Izumi (Osaka)|Japan|184299
Kamisu|Japan|95471
Miyakonojo|Japan|160392
Nabari|Japan|75942
Nagaokakyo|Japan|80423
Narashino|Japan|174990
Natori|Japan|79250
Qitaihe|China|689611
Saiki|Japan|66497
Sanda|Japan|109243
Shiogama|Japan|51999
Sukagawa|Japan|74778
Sunchon|North Korea|437000
Tajimi|Japan|106746
Tamba|Japan|60824
Tatebayashi|Japan|73991
Tatsuno|Japan|73952
Yame|Japan|60196
Ayase|Japan|84257
Hashimoto|Japan|60058
Inazawa|Japan|134938
Kai|Japan|75337
Kan'onji|Japan|56639
Kasuga|Japan|111144
Katori|Japan|71391
Kimitsu|Japan|81355
Komae|Japan|84437
Kudamatsu|Japan|56661
Laibin|China|2074611
Minamiuonuma|Japan|54820
Miyoshi (Hiroshima)|Japan|50046
Mooka|Japan|78665
Moriguchi|Japan|141849
Nagareyama|Japan|200298
Shirakawa|Japan|59044
Soka|Japan|251390
Toda|Japan|142352
Tokchon|North Korea|237133
Tome|Japan|76164
Towada|Japan|60063
Tsushima City|Japan|60908
Wafangdian|China|905082
Xinghua|China|1128204
Yasu|Japan|50049
Yawata|Japan|70373
Yingtan|China|1154223
Ageo|Japan|226616
Anan|Japan|69259
Annaka|Japan|54607
Chikuma|Japan|58755
Higashiomi|Japan|112459
Inzai|Japan|103084
Iruma|Japan|145303
Kasama|Japan|73521
Kawachinagano|Japan|100415
Kinokawa|Japan|58130
Kurihara|Japan|63689
Mizuho|Japan|56106
Moriya|Japan|68992
Munakata|Japan|97041
Naka|Japan|53035
Nihonmatsu|Japan|54447
Ritto|Japan|69598
Sakai (Fukui)|Japan|87945
Sakaide|Japan|50577
Shikokuchuo|Japan|82320
Shimotsuke|Japan|59404
Shizuishan|China|751389
Tamano|Japan|56431
Toki|Japan|55388
Toride|Japan|103908
Yaizu|Japan|136028
Aira|Japan|77948
Aisai|Japan|60914
Bando|Japan|51511
Fujimi|Japan|111858
Fukaya|Japan|140930
Gyoda|Japan|78488
Habikino|Japan|108370
Hanno|Japan|80099
Hekinan|Japan|72480
Higashikurume|Japan|116477
Hukou|Taiwan|85112
Isehara|Japan|102088
Ishioka|Japan|71851
Izumiotsu|Japan|74175
Zhunan|Taiwan|91564
Joyo|Japan|74356
Kazo|Japan|110622
Koga (Fukuoka)|Japan|59349
Konan (Aichi)|Japan|97435
Minamisoma|Japan|52619
Mitoyo|Japan|61838
Mobara|Japan|86446
Moriyama|Japan|83567
Nogata|Japan|55705
Ryugasaki|Japan|76055
Settsu|Japan|86168
Shangzhi|China|463358
Songrim|North Korea|128831
Soja|Japan|68551
Takasago|Japan|87220
Yurihonjo|Japan|73840
Obu|Japan|92562
Otawara|Japan|72923
Ama|Japan|87668
Chiryu|Japan|71907
Daito|Japan|118812
Honjo|Japan|76757
Huwei|Taiwan|71212
Imizu|Japan|90201
Jingshan|China|544843
Kamagaya|Japan|109370
Kani|Japan|99545
Kizugawa|Japan|78035
Koshi|Japan|61997
Longgang|China|464732
Matsubara|Japan|117186
Minokamo|Japan|57007
Munchon|North Korea|122934
Nakagawa|Japan|50201
San'yo-Onoda|Japan|59648
Tagajo|Japan|61937
Tianchang|China|603780
Tondabayashi|Japan|108735
Xiaguan|China|146517
Yoshikawa|Japan|72139
Arao|Japan|50570
Bayanhot|China|94445
Chikushino|Japan|103185
Fujimino|Japan|113490
Hashima City|Japan|66312
Hidaka|Japan|54728
Higashimatsuyama|Japan|91818
Higashiyamato|Japan|84260
Holingol|China|138676
Zhudong|Taiwan|97796
Kaizuka|Japan|84356
Konan (Shiga)|Japan|54392
Miyoshi (Aichi)|Japan|62963
Ogori|Japan|58322
Shiki|Japan|75247
Xinfeng|Taiwan|60030
Sodegaura|Japan|63975
Toyoake|Japan|69389
Yotsukaido|Japan|93233
Yukuhashi|Japan|70922
Yuki|Japan|50218
Chikusei|Japan|98384
Hanyu|Japan|52740
Joso|Japan|59223
Kashiba|Japan|78346
Kashiwara|Japan|67757
Katano|Japan|76002
Kitanagoya|Japan|86060
Konosu|Japan|116777
Nonoichi|Japan|57090
Okegawa|Japan|74115
Owariasahi|Japan|82336
Shiroi|Japan|61673
Takaishi|Japan|55910
Takizawa|Japan|56050
Tsurugashima|Japan|70067
Togane|Japan|57560
Yachimata|Japan|66430
Yamatotakada|Japan|60791
Yashio|Japan|93283
Onojo|Japan|101603
Caotun|Taiwan|98077
Dashiqiao|China|607098
Fujiidera|Japan|63338
Fukutsu|Japan|65770
Gujiao|China|210757
Hasuda|Japan|61473
Hemei|Taiwan|86276
Iwade|Japan|53714
Ji'an|Taiwan|82838
Kitamoto|Japan|65191
Shijonawate|Japan|55094
Shiraoka|Japan|52103
Tomiya|Japan|51859
Tsukubamirai|Japan|51134
Kochi (Japan)|Japan|325535|Kochi City
Gwangju (Gyeonggi)|South Korea|397269
Suzhou (Anhui)|China|5324476
Fuzhou (Jiangxi)|China|3614866
Chino (Nagano)|Japan|55018
Chita (Aichi)|Japan|83881
`;
