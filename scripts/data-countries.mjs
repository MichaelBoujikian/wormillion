/**
 * Country authoring source (Spec S4/S6). Capitals are derived from this same
 * table: a capital entry inherits its country's population magnitude and region
 * tags, per Section 6.
 *
 * Format: Name|Capital|population|Region|Sub-Regions (joined with +)|aliases|capitalAliases
 * Populations are UN WPP / World Bank 2023-24 estimates, rounded.
 */
export const COUNTRIES = `
Nigeria|Abuja|223800000|Africa|West Africa
Ethiopia|Addis Ababa|126500000|Africa|East Africa
Egypt|Cairo|112700000|Africa|North Africa
Democratic Republic of the Congo|Kinshasa|102300000|Africa||DR Congo,DRC,Congo-Kinshasa,Zaire,Democratic Republic of Congo
Tanzania|Dodoma|67400000|Africa|East Africa
South Africa|Pretoria|60400000|Africa|Southern Africa||Cape Town,Bloemfontein
Kenya|Nairobi|55100000|Africa|East Africa
Uganda|Kampala|48600000|Africa|East Africa
Sudan|Khartoum|48100000|Africa|North Africa
Algeria|Algiers|45600000|Africa|North Africa
Morocco|Rabat|37800000|Africa|North Africa
Angola|Luanda|36700000|Africa
Ghana|Accra|34100000|Africa|West Africa
Mozambique|Maputo|33900000|Africa|Southern Africa
Madagascar|Antananarivo|30300000|Africa|East Africa
Ivory Coast|Yamoussoukro|28900000|Africa|West Africa|Cote d Ivoire,Cote dIvoire
Cameroon|Yaounde|28600000|Africa
Niger|Niamey|27200000|Africa|West Africa
Mali|Bamako|23300000|Africa|West Africa
Burkina Faso|Ouagadougou|23300000|Africa|West Africa
Malawi|Lilongwe|20900000|Africa|East Africa
Zambia|Lusaka|20500000|Africa|Southern Africa
Chad|N Djamena|18300000|Africa|||NDjamena
Somalia|Mogadishu|18100000|Africa|East Africa
Senegal|Dakar|17800000|Africa|West Africa
Zimbabwe|Harare|16700000|Africa|Southern Africa
Guinea|Conakry|14200000|Africa|West Africa
Rwanda|Kigali|14100000|Africa|East Africa
Benin|Porto-Novo|13700000|Africa|West Africa||Cotonou
Burundi|Gitega|13200000|Africa|East Africa||Bujumbura
Tunisia|Tunis|12500000|Africa|North Africa
South Sudan|Juba|11100000|Africa|East Africa
Togo|Lome|9100000|Africa|West Africa
Sierra Leone|Freetown|8800000|Africa|West Africa
Libya|Tripoli|6900000|Africa|North Africa
Republic of the Congo|Brazzaville|6100000|Africa||Congo,Congo-Brazzaville
Central African Republic|Bangui|5700000|Africa||CAR
Liberia|Monrovia|5400000|Africa|West Africa
Mauritania|Nouakchott|4900000|Africa|West Africa
Eritrea|Asmara|3700000|Africa|East Africa
Gambia|Banjul|2800000|Africa|West Africa|The Gambia
Botswana|Gaborone|2700000|Africa|Southern Africa
Namibia|Windhoek|2600000|Africa|Southern Africa
Gabon|Libreville|2400000|Africa
Lesotho|Maseru|2300000|Africa|Southern Africa
Guinea-Bissau|Bissau|2150000|Africa|West Africa
Equatorial Guinea|Malabo|1700000|Africa
Mauritius|Port Louis|1300000|Africa|East Africa
Eswatini|Mbabane|1210000|Africa|Southern Africa|Swaziland
Djibouti|Djibouti City|1130000|Africa|East Africa||Djibouti
Comoros|Moroni|850000|Africa|East Africa
Cape Verde|Praia|600000|Africa|West Africa|Cabo Verde
Sao Tome and Principe|Sao Tome|230000|Africa||Sao Tome,Sao Tome & Principe
Seychelles|Victoria|107000|Africa|East Africa
India|New Delhi|1428600000|Asia|South Asia||Delhi
China|Beijing|1425700000|Asia|East Asia|PRC,Peoples Republic of China|Peking
Indonesia|Jakarta|277500000|Asia|Southeast Asia
Pakistan|Islamabad|240500000|Asia|South Asia
Bangladesh|Dhaka|173000000|Asia|South Asia
Japan|Tokyo|123300000|Asia|East Asia
Philippines|Manila|117300000|Asia|Southeast Asia|The Philippines
Vietnam|Hanoi|101000000|Asia|Southeast Asia|Viet Nam
Iran|Tehran|89200000|Asia|Middle East
Turkey|Ankara|85800000|Asia|Middle East|Turkiye
Thailand|Bangkok|71800000|Asia|Southeast Asia
Myanmar|Naypyidaw|54600000|Asia|Southeast Asia|Burma|Nay Pyi Taw
South Korea|Seoul|51700000|Asia|East Asia|Republic of Korea
Iraq|Baghdad|45500000|Asia|Middle East
Afghanistan|Kabul|42200000|Asia|South Asia+Central Asia
Saudi Arabia|Riyadh|36900000|Asia|Middle East
Uzbekistan|Tashkent|35600000|Asia|Central Asia
Yemen|Sanaa|34400000|Asia|Middle East
Malaysia|Kuala Lumpur|34300000|Asia|Southeast Asia||Putrajaya,KL
Nepal|Kathmandu|30900000|Asia|South Asia
North Korea|Pyongyang|26200000|Asia|East Asia|DPRK
Taiwan|Taipei|23400000|Asia|East Asia|Republic of China
Syria|Damascus|23200000|Asia|Middle East
Sri Lanka|Colombo|21900000|Asia|South Asia||Sri Jayawardenepura Kotte
Kazakhstan|Astana|19600000|Asia|Central Asia||Nur-Sultan
Cambodia|Phnom Penh|16900000|Asia|Southeast Asia
Jordan|Amman|11300000|Asia|Middle East
Azerbaijan|Baku|10400000|Asia
Tajikistan|Dushanbe|10100000|Asia|Central Asia
Israel|Jerusalem|9800000|Asia|Middle East||Tel Aviv
United Arab Emirates|Abu Dhabi|9500000|Asia|Middle East|UAE,Emirates,The Emirates
Laos|Vientiane|7600000|Asia|Southeast Asia|Lao
Kyrgyzstan|Bishkek|6700000|Asia|Central Asia|Kyrgyz Republic
Turkmenistan|Ashgabat|6500000|Asia|Central Asia
Singapore|Singapore|5900000|Asia|Southeast Asia
Lebanon|Beirut|5400000|Asia|Middle East
Palestine|Ramallah|5400000|Asia|Middle East|State of Palestine
Oman|Muscat|4600000|Asia|Middle East
Kuwait|Kuwait City|4300000|Asia|Middle East
Georgia|Tbilisi|3700000|Asia
Mongolia|Ulaanbaatar|3400000|Asia|East Asia||Ulan Bator
Armenia|Yerevan|2800000|Asia
Qatar|Doha|2700000|Asia|Middle East
Bahrain|Manama|1500000|Asia|Middle East
Timor-Leste|Dili|1400000|Asia|Southeast Asia|East Timor,Timor
Bhutan|Thimphu|790000|Asia|South Asia
Maldives|Male|520000|Asia|South Asia
Brunei|Bandar Seri Begawan|450000|Asia|Southeast Asia|Brunei Darussalam
Russia|Moscow|144400000|Europe|Eastern Europe|Russian Federation
Germany|Berlin|83300000|Europe|Western Europe
France|Paris|68200000|Europe|Western Europe
United Kingdom|London|67700000|Europe|Western Europe|UK,Britain,Great Britain
Italy|Rome|58900000|Europe|Western Europe
Spain|Madrid|47500000|Europe|Western Europe
Ukraine|Kyiv|37000000|Europe|Eastern Europe||Kiev
Poland|Warsaw|36700000|Europe|Eastern Europe
Romania|Bucharest|19900000|Europe|Eastern Europe
Netherlands|Amsterdam|17600000|Europe|Western Europe|Holland,The Netherlands|The Hague
Belgium|Brussels|11700000|Europe|Western Europe
Sweden|Stockholm|10600000|Europe|Scandinavia & the Nordics
Czechia|Prague|10500000|Europe|Eastern Europe|Czech Republic
Greece|Athens|10400000|Europe
Portugal|Lisbon|10200000|Europe|Western Europe
Hungary|Budapest|9600000|Europe|Eastern Europe
Belarus|Minsk|9500000|Europe|Eastern Europe
Austria|Vienna|9100000|Europe|Western Europe
Switzerland|Bern|8800000|Europe|Western Europe||Berne
Serbia|Belgrade|6800000|Europe|Eastern Europe
Bulgaria|Sofia|6500000|Europe|Eastern Europe
Denmark|Copenhagen|5900000|Europe|Scandinavia & the Nordics
Slovakia|Bratislava|5800000|Europe|Eastern Europe|Slovak Republic
Finland|Helsinki|5600000|Europe|Scandinavia & the Nordics
Norway|Oslo|5500000|Europe|Scandinavia & the Nordics
Ireland|Dublin|5200000|Europe|Western Europe
Croatia|Zagreb|4000000|Europe|Eastern Europe
Moldova|Chisinau|3400000|Europe|Eastern Europe
Bosnia and Herzegovina|Sarajevo|3200000|Europe|Eastern Europe|Bosnia,Bosnia-Herzegovina
Albania|Tirana|2800000|Europe|Eastern Europe
Lithuania|Vilnius|2700000|Europe|Eastern Europe
Slovenia|Ljubljana|2120000|Europe|Eastern Europe
North Macedonia|Skopje|2100000|Europe|Eastern Europe|Macedonia
Latvia|Riga|1830000|Europe|Eastern Europe
Kosovo|Pristina|1660000|Europe|Eastern Europe
Estonia|Tallinn|1370000|Europe|Eastern Europe
Cyprus|Nicosia|1260000|Europe
Luxembourg|Luxembourg City|660000|Europe|Western Europe||Luxembourg
Montenegro|Podgorica|620000|Europe|Eastern Europe
Malta|Valletta|540000|Europe
Iceland|Reykjavik|380000|Europe|Scandinavia & the Nordics
Andorra|Andorra la Vella|80000|Europe|Western Europe
Liechtenstein|Vaduz|39000|Europe|Western Europe
Monaco|Monaco-Ville|36000|Europe|Western Europe||Monaco
San Marino|San Marino City|33600|Europe|||San Marino
Vatican City|Vatican City|764|Europe||Holy See
United States|Washington DC|340000000|North America||USA,US,America,United States of America|Washington,DC
Mexico|Mexico City|128500000|North America|||CDMX
Canada|Ottawa|40100000|North America
Guatemala|Guatemala City|18100000|North America|Central America
Haiti|Port-au-Prince|11700000|North America|Caribbean
Dominican Republic|Santo Domingo|11300000|North America|Caribbean
Cuba|Havana|11200000|North America|Caribbean
Honduras|Tegucigalpa|10600000|North America|Central America
Nicaragua|Managua|7000000|North America|Central America
El Salvador|San Salvador|6400000|North America|Central America
Costa Rica|San Jose|5200000|North America|Central America
Panama|Panama City|4500000|North America|Central America
Jamaica|Kingston|2830000|North America|Caribbean
Trinidad and Tobago|Port of Spain|1530000|North America|Caribbean|Trinidad
Belize|Belmopan|410000|North America|Central America
Bahamas|Nassau|409000|North America|Caribbean|The Bahamas
Barbados|Bridgetown|281000|North America|Caribbean
Saint Lucia|Castries|180000|North America|Caribbean|St Lucia
Grenada|Saint Georges|126000|North America|Caribbean||St Georges
Saint Vincent and the Grenadines|Kingstown|104000|North America|Caribbean|St Vincent and the Grenadines,St Vincent,Saint Vincent
Antigua and Barbuda|Saint Johns|94000|North America|Caribbean|Antigua|St Johns
Dominica|Roseau|73000|North America|Caribbean
Saint Kitts and Nevis|Basseterre|47000|North America|Caribbean|St Kitts and Nevis,St Kitts,Saint Kitts
Brazil|Brasilia|216400000|South America
Colombia|Bogota|52100000|South America
Argentina|Buenos Aires|45800000|South America
Peru|Lima|34400000|South America
Venezuela|Caracas|28800000|South America
Chile|Santiago|19600000|South America
Ecuador|Quito|18200000|South America
Bolivia|Sucre|12400000|South America|||La Paz
Paraguay|Asuncion|6900000|South America
Uruguay|Montevideo|3400000|South America
Guyana|Georgetown|810000|South America
Suriname|Paramaribo|620000|South America
Australia|Canberra|26600000|Oceania
Papua New Guinea|Port Moresby|10300000|Oceania||PNG,Papua
New Zealand|Wellington|5200000|Oceania||NZ,Aotearoa
Fiji|Suva|930000|Oceania
Solomon Islands|Honiara|740000|Oceania||Solomons,The Solomon Islands
Vanuatu|Port Vila|330000|Oceania
Samoa|Apia|220000|Oceania
Kiribati|South Tarawa|133000|Oceania
Micronesia|Palikir|115000|Oceania||Federated States of Micronesia,FSM
Tonga|Nukualofa|107000|Oceania
Marshall Islands|Majuro|42000|Oceania||Marshalls,The Marshall Islands
Palau|Ngerulmud|18000|Oceania
Nauru|Yaren|12500|Oceania
Tuvalu|Funafuti|11400|Oceania
`;
