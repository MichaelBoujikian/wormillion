/**
 * Curated theme sets for the "Name a river in Mesopotamia" style of prompt.
 *
 * Members are listed by their in-game name and resolved to entries at load time
 * (case- and accent-insensitively). `npm run validate` reports any name here
 * that no longer exists in the bank, and any theme too small to use.
 *
 * These are hand-curated on purpose: a themed prompt REJECTS answers outside
 * its set, so a half-complete set would turn a correct answer into a wrong one.
 * If you add a place that belongs to a theme, add it here too.
 *
 * Ocean membership ("Name an island in the Pacific Ocean") is NOT a theme: it is
 * derived from each island's coordinates at build time (scripts/data-oceans.mjs)
 * and validated, precisely so that Hawaii can never be left off a list.
 */
globalThis.WORMILLION_THEMES = {
  country: {
    'landlocked': [
      'Afghanistan', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus',
      'Bhutan', 'Bolivia', 'Botswana', 'Burkina Faso', 'Burundi',
      'Central African Republic', 'Chad', 'Czechia', 'Eswatini', 'Ethiopia',
      'Hungary', 'Kazakhstan', 'Kosovo', 'Kyrgyzstan', 'Laos', 'Lesotho',
      'Liechtenstein', 'Luxembourg', 'Malawi', 'Mali', 'Moldova', 'Mongolia',
      'Nepal', 'Niger', 'North Macedonia', 'Paraguay', 'Rwanda', 'San Marino',
      'Serbia', 'Slovakia', 'South Sudan', 'Switzerland', 'Tajikistan',
      'Turkmenistan', 'Uganda', 'Uzbekistan', 'Vatican City', 'Zambia', 'Zimbabwe'
    ],
    'island nations': [
      'Japan', 'United Kingdom', 'Ireland', 'Iceland', 'Sri Lanka', 'Madagascar',
      'Indonesia', 'Philippines', 'New Zealand', 'Cuba', 'Jamaica', 'Haiti',
      'Dominican Republic', 'Bahamas', 'Barbados', 'Trinidad and Tobago', 'Malta',
      'Cyprus', 'Maldives', 'Seychelles', 'Mauritius', 'Comoros', 'Cape Verde',
      'Sao Tome and Principe', 'Fiji', 'Samoa', 'Tonga', 'Vanuatu',
      'Solomon Islands', 'Papua New Guinea', 'Kiribati', 'Tuvalu', 'Nauru',
      'Palau', 'Marshall Islands', 'Micronesia', 'Timor-Leste', 'Bahrain',
      'Singapore', 'Taiwan', 'Brunei', 'Antigua and Barbuda', 'Dominica',
      'Grenada', 'Saint Kitts and Nevis', 'Saint Lucia',
      'Saint Vincent and the Grenadines'
    ]
  },

  city: {
    // The largest city of a country that is not its capital - the mirror of
    // the capital theme "not the largest city". Arguable members are in on
    // purpose (generous): Omdurman outnumbers Khartoum city proper, Quezon
    // City outnumbers Manila, New Taipei outnumbers Taipei; Gaza City because
    // Ramallah is the capital in the bank; Serekunda and Manzini are the
    // largest towns of very small countries.
    'largest in its country': [
      'Lagos', 'Abidjan', 'Cotonou', 'Serekunda', 'Omdurman', 'Casablanca',
      'Dar es Salaam', 'Bujumbura', 'Johannesburg', 'Manzini', 'Douala',
      'Istanbul', 'Dubai', 'Gaza City', 'Mumbai', 'Karachi', 'Ho Chi Minh City',
      'Yangon', 'Quezon City', 'Shanghai', 'New Taipei', 'Almaty',
      'Zurich', 'Antwerp',
      'New York City', 'Toronto', 'Belize City',
      'Sao Paulo', 'Guayaquil', 'Santa Cruz de la Sierra',
      'Sydney', 'Auckland'
    ]
  },
  capital: {
    // Capitals that are NOT their country's largest city (by city or metro
    // population; where either reading makes it true, it's in - generous).
    'not the largest city': [
      'Canberra', 'Brussels', 'Belmopan', 'Porto-Novo', 'Sucre', 'Brasilia',
      'Gitega', 'Yaounde', 'Ottawa', 'Beijing', 'Yamoussoukro', 'Quito',
      'Malabo', 'Mbabane', 'New Delhi', 'Astana', 'Vaduz', 'Valletta',
      'Palikir', 'Monaco-Ville', 'Rabat', 'Naypyidaw', 'Wellington', 'Abuja',
      'Islamabad', 'Ngerulmud', 'Manila', 'San Marino City', 'Pretoria',
      'Colombo', 'Bern', 'Dodoma', 'Port of Spain', 'Ankara', 'Washington DC',
      'Hanoi', 'Yaren', 'Khartoum', 'Banjul', 'Taipei', 'Ramallah', 'Abu Dhabi'
    ],
    // On the sea, a sea bay, or a tidal estuary that opens straight onto one.
    // Generous at the edges (Bangkok, Buenos Aires, Paramaribo are in; London,
    // Rome, Caracas and Washington are not - they are river cities).
    'on the coast': [
      'Algiers', 'Rabat', 'Luanda', 'Accra', 'Maputo', 'Mogadishu', 'Dakar',
      'Conakry', 'Porto-Novo', 'Tunis', 'Lome', 'Freetown', 'Tripoli',
      'Monrovia', 'Nouakchott', 'Banjul', 'Libreville', 'Bissau', 'Malabo',
      'Port Louis', 'Djibouti City', 'Moroni', 'Praia', 'Sao Tome', 'Victoria',
      'Jakarta', 'Tokyo', 'Manila', 'Bangkok', 'Colombo', 'Baku', 'Abu Dhabi',
      'Singapore', 'Beirut', 'Muscat', 'Kuwait City', 'Doha', 'Manama',
      'Dili', 'Male', 'Bandar Seri Begawan',
      'Amsterdam', 'Stockholm', 'Athens', 'Lisbon', 'Copenhagen', 'Helsinki',
      'Oslo', 'Dublin', 'Riga', 'Tallinn', 'Valletta', 'Reykjavik', 'Monaco-Ville',
      'Port-au-Prince', 'Santo Domingo', 'Havana', 'Panama City', 'Kingston',
      'Port of Spain', 'Nassau', 'Bridgetown', 'Castries', 'Saint Georges',
      'Kingstown', 'Saint Johns', 'Roseau', 'Basseterre', 'Buenos Aires', 'Lima',
      'Montevideo', 'Georgetown', 'Paramaribo',
      'Port Moresby', 'Wellington', 'Suva', 'Honiara', 'Port Vila', 'Apia',
      'South Tarawa', 'Palikir', 'Nukualofa', 'Majuro', 'Ngerulmud', 'Yaren',
      'Funafuti',
      // US state capitals on the water
      'Boston', 'Honolulu', 'Juneau', 'Providence', 'Annapolis', 'Olympia'
    ],
    // scripts/data-us-states.mjs, all fifty.
    'US state capitals': [
      'Montgomery', 'Juneau', 'Phoenix', 'Little Rock', 'Sacramento', 'Denver',
      'Hartford', 'Dover', 'Tallahassee', 'Atlanta', 'Honolulu', 'Boise',
      'Springfield', 'Indianapolis', 'Des Moines', 'Topeka', 'Frankfort',
      'Baton Rouge', 'Augusta', 'Annapolis', 'Boston', 'Lansing', 'Saint Paul',
      'Jackson', 'Jefferson City', 'Helena', 'Lincoln', 'Carson City', 'Concord',
      'Trenton', 'Santa Fe', 'Albany', 'Raleigh', 'Bismarck', 'Columbus',
      'Oklahoma City', 'Salem', 'Harrisburg', 'Providence', 'Columbia', 'Pierre',
      'Nashville', 'Austin', 'Salt Lake City', 'Montpelier', 'Richmond',
      'Olympia', 'Charleston', 'Madison', 'Cheyenne'
    ]
  },

  river: {
    'Mesopotamia': ['Tigris', 'Euphrates'],
    'the British Isles': [
      'Thames', 'Severn', 'Trent', 'Shannon', 'Liffey', 'Clyde', 'Tay', 'Spey',
      'Wye', 'Aire', 'Ouse', 'Cam', 'Medway', 'Bristol Avon', 'River Tweed',
      'River Forth', 'River Exe', 'River Dee', 'River Bann'
    ],
    'Siberia': ['Ob', 'Yenisei', 'Lena', 'Kolyma', 'Aldan', 'Vilyuy', 'Olenyok', 'Amur'],
    'South America': [
      'Amazon', 'Parana', 'Madeira', 'Purus', 'Negro River', 'Orinoco',
      'Sao Francisco', 'Tocantins', 'Araguaia', 'Xingu', 'Uruguay River',
      'Pilcomayo', 'Paraguay River', 'Maranon'
    ],
    'Africa': [
      'Nile', 'Congo River', 'Niger River', 'Zambezi', 'Orange River', 'Ubangi',
      'Limpopo', 'Senegal River', 'Gambia River', 'Volta River', 'Blue Nile', 'White Nile'
    ],
    'Europe': [
      'Danube', 'Rhine', 'Elbe', 'Vistula', 'Loire', 'Seine', 'Po', 'Tagus',
      'Douro', 'Ebro', 'Oder', 'Meuse', 'Guadalquivir', 'Don', 'Dnieper',
      'Volga', 'Kama', 'Ural River', 'Rhone', 'Vltava', 'Sava', 'Drava', 'Neva',
      'Moselle', 'Main', 'Weser', 'Tisza', 'Guadiana', 'Adige', 'Arno', 'Tiber'
    ],
    'India': [
      'Ganges', 'Brahmaputra', 'Indus', 'Yamuna', 'Godavari', 'Krishna River',
      'Narmada', 'Sutlej', 'Chenab'
    ],
    'North America': [
      'Mississippi', 'Missouri', 'Colorado River', 'Rio Grande', 'Yukon',
      'Mackenzie', 'Saint Lawrence', 'Ohio River', 'Arkansas River',
      'Columbia River', 'Snake River', 'Churchill River', 'Nelson River',
      'Red River', 'Ottawa River'
    ]
  },

  mountain: {
    'the Alps': [
      'Mont Blanc', 'Matterhorn', 'Monte Rosa', 'Eiger', 'Jungfrau',
      'Grossglockner', 'Zugspitze', 'Marmolada', 'Piz Bernina', 'Weisshorn'
    ],
    'the Himalayas': [
      'Mount Everest', 'Kangchenjunga', 'Lhotse', 'Makalu', 'Cho Oyu',
      'Dhaulagiri', 'Manaslu', 'Annapurna', 'Nanga Parbat', 'Shishapangma',
      'Ama Dablam', 'Machapuchare'
    ],
    'the Andes': ['Aconcagua', 'Ojos del Salado', 'Huascaran', 'Illimani', 'Chimborazo', 'Cotopaxi'],
    'the Rockies': ['Mount Elbert', 'Pikes Peak', 'Grand Teton', 'Longs Peak', 'Mount Robson'],
    'Scotland': [
      'Ben Nevis', 'Ben Macdui', 'Braeriach', 'Cairn Gorm', 'Schiehallion',
      'Ben Lomond', 'Goat Fell', 'Arthurs Seat'
    ],
    'England or Wales': [
      'Scafell Pike', 'Snowdon', 'Helvellyn', 'Skiddaw', 'Great Gable',
      'Cross Fell', 'Pen y Fan', 'Cadair Idris', 'Kinder Scout', 'Whernside',
      'Ingleborough', 'Pen-y-ghent', 'Mam Tor', 'The Cheviot', 'Box Hill',
      'Leith Hill', 'The Wrekin', 'Dunkery Beacon', 'High Willhays', 'Brown Willy'
    ],
    'Indonesia': [
      'Mount Bromo', 'Mount Merapi', 'Mount Semeru', 'Mount Agung', 'Krakatoa',
      'Mount Rinjani', 'Puncak Jaya'
    ],
    'volcanoes': [
      'Mount Etna', 'Vesuvius', 'Stromboli', 'Mount Fuji', 'Popocatepetl',
      'Cotopaxi', 'Krakatoa', 'Mount St Helens', 'Mount Rainier', 'Mount Erebus',
      'Mount Merapi', 'Mount Pinatubo', 'Mayon', 'Mount Teide', 'Haleakala',
      'Mauna Loa', 'Mount Aso', 'Mount Bromo', 'Mount Agung', 'Mount Rinjani',
      'Mount Semeru', 'Mount Kilimanjaro', 'Mount Shasta', 'Mount Hood',
      'Mount Baker', 'Mount Ararat', 'Damavand', 'Mount Cameroon',
      'Chimborazo', 'Mauna Kea', 'Elbrus', 'Pico de Orizaba', 'Ojos del Salado',
      'Mount Ruapehu', 'Mount Taranaki', 'Mount Tongariro', 'Mount Ngauruhoe',
      'Hallasan', 'Paektu Mountain', 'Mount Kenya', 'Puy de Dome', 'Mount Apo'
    ]
  },

  island: {
    'the Caribbean': [
      'Cuba', 'Hispaniola', 'Jamaica', 'Puerto Rico', 'Trinidad',
      'Barbados', 'Aruba', 'Curacao', 'Bonaire', 'Grand Cayman',
      'Martinique', 'Guadeloupe', 'Saint Martin', 'Anguilla', 'Montserrat',
      'Nevis', 'Saint Kitts', 'Tortola', 'Virgin Gorda', 'Saint Thomas',
      'Saint Croix', 'Antigua', 'Barbuda', 'Eleuthera', 'Andros Island',
      'Grand Bahama', 'New Providence', 'Great Exuma', 'Great Abaco', 'Roatan',
      'Providenciales', 'Grand Turk', 'San Andres', 'Margarita Island',
      'Saint Lucia', 'Dominica', 'Grenada', 'Saint Vincent',
      'Cozumel', 'Isla Mujeres', 'Bahamas'
    ],
    'the Mediterranean': [
      'Sicily', 'Sardinia', 'Corsica', 'Crete', 'Cyprus', 'Malta',
      'Rhodes', 'Mykonos', 'Santorini', 'Corfu', 'Zakynthos', 'Kefalonia',
      'Naxos', 'Paros', 'Milos', 'Kos', 'Samos', 'Chios', 'Euboea', 'Hydra',
      'Patmos', 'Delos', 'Ithaca', 'Gozo', 'Menorca', 'Mallorca', 'Ibiza',
      'Formentera', 'Elba', 'Capri', 'Ischia', 'Lampedusa', 'Pantelleria',
      'Lipari', 'Vulcano', 'Lesbos', 'Cyclades', 'Djerba'
    ],
    'Greece': [
      'Crete', 'Rhodes', 'Mykonos', 'Santorini', 'Corfu', 'Zakynthos',
      'Kefalonia', 'Naxos', 'Paros', 'Milos', 'Kos', 'Samos', 'Chios', 'Euboea',
      'Hydra', 'Patmos', 'Delos', 'Ithaca', 'Lesbos', 'Cyclades'
    ],
    'Hawaii': ['Big Island of Hawaii', 'Maui', 'Oahu', 'Kauai', 'Molokai', 'Lanai', 'Niihau'],
    'Scotland': [
      'Isle of Skye', 'Lewis and Harris', 'Shetland Mainland', 'Orkney Mainland',
      'Mull', 'Islay', 'Jura', 'Arran', 'Bute', 'North Uist', 'South Uist',
      'Barra', 'Tiree', 'Coll', 'Rum', 'Eigg', 'Staffa', 'Iona', 'Outer Hebrides'
    ],
    'Japan': [
      'Honshu', 'Hokkaido', 'Kyushu', 'Shikoku', 'Okinawa Island', 'Sado Island',
      'Yakushima', 'Miyajima', 'Awaji Island', 'Ishigaki Island'
    ],
    'Indonesia': [
      'Java', 'Sumatra', 'Borneo', 'Sulawesi', 'Bali', 'Lombok', 'Komodo',
      'Sumba', 'Sumbawa', 'Flores', 'Seram', 'Halmahera', 'Ambon Island',
      'Ternate', 'Nias', 'Bintan', 'Batam', 'Timor'
    ]
  },

  lake: {
    'saltwater': [
      'Caspian Sea', 'Dead Sea', 'Great Salt Lake', 'Salton Sea', 'Lake Urmia',
      'Lake Van', 'Lake Eyre', 'Lake Torrens', 'Lake Gairdner', 'Mono Lake',
      'Lake Assal', 'Lake Issyk-Kul', 'Qinghai Lake', 'Uvs Lake', 'Lake Balkhash',
      'Sarygamysh Lake', 'Lake Poopo', 'Lake Turkana', 'Lake Nakuru', 'Aral Sea'
    ],
    'the Great Lakes': ['Lake Superior', 'Lake Michigan', 'Lake Huron', 'Lake Erie', 'Lake Ontario'],
    'Africa': [
      'Lake Victoria', 'Lake Tanganyika', 'Lake Malawi', 'Lake Turkana',
      'Lake Albert', 'Lake Chad', 'Lake Tana', 'Lake Mweru', 'Lake Bangweulu',
      'Lake Kariba', 'Lake Volta', 'Lake Kivu', 'Lake Edward', 'Lake Naivasha',
      'Lake Nakuru', 'Lake Assal'
    ],
    'the Alps': [
      'Lake Geneva', 'Lake Constance', 'Lake Garda', 'Lake Maggiore', 'Lake Como',
      'Lake Lucerne', 'Lake Zurich', 'Lake Neuchatel', 'Lake Annecy',
      'Hallstatter See', 'Lake Lugano', 'Lake Thun', 'Konigssee', 'Chiemsee',
      'Lake Bled', 'Lake Bohinj', 'Lake Braies', 'Lake Misurina'
    ],
    'the British Isles': ['Loch Ness', 'Loch Lomond', 'Lake Windermere', 'Bala Lake', 'Lough Neagh'],
    'Scandinavia': ['Lake Vanern', 'Lake Vattern', 'Mjosa', 'Lake Inari', 'Lake Saimaa']
  },

  desert: {
    'Africa': [
      'Sahara', 'Kalahari', 'Namib', 'Nubian Desert', 'Danakil Desert',
      'Libyan Desert', 'Western Desert', 'Eastern Desert', 'Chalbi Desert', 'Tenere'
    ],
    'Asia': [
      'Gobi', 'Arabian Desert', 'Syrian Desert', 'Karakum', 'Kyzylkum',
      'Taklamakan', 'Thar Desert', 'Dasht-e Kavir', 'Dasht-e Lut',
      'Registan Desert', 'Ordos Desert', 'Badain Jaran Desert', 'Tengger Desert',
      'Negev', 'Wahiba Sands', 'Judaean Desert', 'Cholistan Desert',
      'Rub al Khali', 'Wadi Rum'
    ],
    'Australia': [
      'Great Victoria Desert', 'Great Sandy Desert', 'Tanami Desert',
      'Simpson Desert', 'Gibson Desert', 'Little Sandy Desert',
      'Strzelecki Desert', 'Sturt Stony Desert', 'Nullarbor Plain'
    ],
    'the Americas': [
      'Great Basin Desert', 'Chihuahuan Desert', 'Sonoran Desert', 'Mojave Desert',
      'Colorado Plateau Desert', 'Atacama Desert', 'Patagonian Desert',
      'Monte Desert', 'Sechura Desert', 'Painted Desert', 'Black Rock Desert',
      'Great Salt Lake Desert', 'Guajira Desert', 'Tatacoa Desert'
    ]
  },

  sea_ocean: {
    'Europe': [
      'Mediterranean Sea', 'North Sea', 'Baltic Sea', 'Black Sea', 'Adriatic Sea',
      'Aegean Sea', 'Ionian Sea', 'Tyrrhenian Sea', 'Ligurian Sea', 'Irish Sea',
      'Celtic Sea', 'English Channel', 'Bay of Biscay', 'Norwegian Sea',
      'Barents Sea', 'White Sea', 'Sea of Azov', 'Sea of Marmara',
      'Gulf of Bothnia', 'Gulf of Finland', 'Kattegat', 'Skagerrak', 'Wadden Sea',
      'Alboran Sea', 'Balearic Sea', 'Sea of Crete', 'Gulf of Riga'
    ],
    'Asia': [
      'South China Sea', 'East China Sea', 'Yellow Sea', 'Sea of Japan',
      'Philippine Sea', 'Andaman Sea', 'Arabian Sea', 'Bay of Bengal', 'Red Sea',
      'Persian Gulf', 'Gulf of Aden', 'Gulf of Oman', 'Gulf of Thailand',
      'Java Sea', 'Banda Sea', 'Celebes Sea', 'Sulu Sea', 'Flores Sea',
      'Molucca Sea', 'Savu Sea', 'Halmahera Sea', 'Timor Sea', 'Sea of Okhotsk',
      'Caspian Sea', 'Aral Sea', 'Dead Sea', 'Levantine Sea', 'Bali Sea', 'Ceram Sea'
    ],
    'the Americas': [
      'Caribbean Sea', 'Gulf of Mexico', 'Hudson Bay', 'Labrador Sea',
      'Beaufort Sea', 'Gulf of Alaska', 'Gulf of California', 'Baffin Bay',
      'Bay of Fundy', 'Gulf of Saint Lawrence', 'Chesapeake Bay', 'Sargasso Sea'
    ],
    'the Antarctic': [
      'Weddell Sea', 'Ross Sea', 'Amundsen Sea', 'Bellingshausen Sea',
      'Scotia Sea', 'Southern Ocean'
    ]
  }
};

/** Themes whose prompt doesn't fit the "Name a {category} in {theme}" pattern. */
globalThis.WORMILLION_THEME_PROMPTS = {
  volcanoes: 'Name a volcano.',
  saltwater: 'Name a saltwater lake.',
  landlocked: 'Name a landlocked country.',
  'island nations': 'Name an island nation.',
  'not the largest city': "Name a capital that isn't its country's largest city.",
  'largest in its country': "Name the largest city of a country that isn't its capital.",
  'on the coast': 'Name a capital city on the coast.',
  'US state capitals': 'Name a US state capital.'
};
