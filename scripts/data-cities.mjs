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
`;
