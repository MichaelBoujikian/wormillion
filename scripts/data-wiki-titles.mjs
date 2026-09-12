/**
 * Wikipedia article titles for entries whose in-game name doesn't resolve to the
 * right article on its own — ambiguous names ("Cam", "Georgia"), names this bank
 * disambiguates for its own reasons ("Cuba Island"), and a few that live under a
 * different spelling.
 *
 * Keyed by entry id; anything not listed is looked up by its name.
 * `npm run fetch-pageviews -- --check` reports every title that needs an entry.
 */
export const WIKI_TITLES = {
  // --- countries ---
  'country-georgia': 'Georgia (country)',
  'country-micronesia': 'Federated States of Micronesia',

  // --- capitals ---
  'capital-n-djamena': "N'Djamena",
  'capital-tripoli': 'Tripoli, Libya',
  'capital-moroni': 'Moroni, Comoros',
  'capital-victoria': 'Victoria, Seychelles',
  'capital-male': 'Malé',
  'capital-san-jose': 'San José, Costa Rica',
  'capital-kingston': 'Kingston, Jamaica',
  'capital-nassau': 'Nassau, Bahamas',
  'capital-saint-georges': "St. George's, Grenada",
  'capital-saint-johns': "St. John's, Antigua and Barbuda",
  'capital-georgetown': 'Georgetown, Guyana',
  'capital-singapore-city': 'Singapore', // city-state: the city and the country are one article
  // --- US state capitals (2026-09): most share their name with somewhere else ---
  'capital-montgomery': 'Montgomery, Alabama',
  'capital-juneau': 'Juneau, Alaska',
  'capital-phoenix': 'Phoenix, Arizona',
  'capital-little-rock': 'Little Rock, Arkansas',
  'capital-sacramento': 'Sacramento, California',
  'capital-denver': 'Denver',
  'capital-hartford': 'Hartford, Connecticut',
  'capital-dover': 'Dover, Delaware',
  'capital-tallahassee': 'Tallahassee, Florida',
  'capital-atlanta': 'Atlanta',
  'capital-honolulu': 'Honolulu',
  'capital-boise': 'Boise, Idaho',
  'capital-springfield': 'Springfield, Illinois',
  'capital-indianapolis': 'Indianapolis',
  'capital-des-moines': 'Des Moines, Iowa',
  'capital-topeka': 'Topeka, Kansas',
  'capital-frankfort': 'Frankfort, Kentucky',
  'capital-baton-rouge': 'Baton Rouge, Louisiana',
  'capital-augusta': 'Augusta, Maine',
  'capital-annapolis': 'Annapolis, Maryland',
  'capital-boston': 'Boston',
  'capital-lansing': 'Lansing, Michigan',
  'capital-saint-paul': 'Saint Paul, Minnesota',
  'capital-jackson': 'Jackson, Mississippi',
  'capital-jefferson-city': 'Jefferson City, Missouri',
  'capital-helena': 'Helena, Montana',
  'capital-lincoln': 'Lincoln, Nebraska',
  'capital-carson-city': 'Carson City, Nevada',
  'capital-concord': 'Concord, New Hampshire',
  'capital-trenton': 'Trenton, New Jersey',
  'capital-santa-fe': 'Santa Fe, New Mexico',
  'capital-albany': 'Albany, New York',
  'capital-raleigh': 'Raleigh, North Carolina',
  'capital-bismarck': 'Bismarck, North Dakota',
  'capital-columbus': 'Columbus, Ohio',
  'capital-oklahoma-city': 'Oklahoma City',
  'capital-salem': 'Salem, Oregon',
  'capital-harrisburg': 'Harrisburg, Pennsylvania',
  'capital-providence': 'Providence, Rhode Island',
  'capital-columbia': 'Columbia, South Carolina',
  'capital-pierre': 'Pierre, South Dakota',
  'capital-nashville': 'Nashville, Tennessee',
  'capital-austin': 'Austin, Texas',
  'capital-salt-lake-city': 'Salt Lake City',
  'capital-montpelier': 'Montpelier, Vermont',
  'capital-richmond': 'Richmond, Virginia',
  'capital-olympia': 'Olympia, Washington',
  'capital-charleston': 'Charleston, West Virginia',
  'capital-madison': 'Madison, Wisconsin',
  'capital-cheyenne': 'Cheyenne, Wyoming',

  // --- lakes ---
  'lake-lake-albert': 'Lake Albert (Africa)',
  'lake-lake-louise': 'Lake Louise (Alberta)',

  // --- rivers (a river's bare name is almost always a disambiguation page) ---
  'river-amazon': 'Amazon River',
  'river-parana': 'Paraná River',
  'river-lena': 'Lena (river)',
  'river-mackenzie': 'Mackenzie River',
  'river-missouri': 'Missouri River',
  'river-mississippi': 'Mississippi River',
  'river-madeira': 'Madeira River',
  'river-purus': 'Purus River',
  'river-yukon': 'Yukon River',
  'river-saint-lawrence': 'St. Lawrence River',
  'river-tocantins': 'Tocantins River',
  'river-araguaia': 'Araguaia River',
  'river-kolyma': 'Kolyma River',
  'river-pilcomayo': 'Pilcomayo River',
  'river-olenyok': 'Olenyok River',
  'river-aldan': 'Aldan River',
  'river-ubangi': 'Ubangi River',
  'river-negro-river': 'Rio Negro (Amazon)',
  'river-irrawaddy': 'Irrawaddy River',
  'river-red-river': 'Red River of the South',
  'river-don': 'Don (river)',
  'river-xingu': 'Xingu River',
  'river-kama': 'Kama (river)',
  'river-churchill-river': 'Churchill River (Hudson Bay)',
  'river-maranon': 'Marañón River',
  'river-darling': 'Darling River',
  'river-murray': 'Murray River',
  'river-po': 'Po (river)',
  'river-shannon': 'River Shannon',
  'river-trent': 'River Trent',
  'river-wye': 'River Wye',
  'river-tay': 'River Tay',
  'river-clyde': 'River Clyde',
  'river-spey': 'River Spey',
  'river-aire': 'River Aire',
  'river-liffey': 'River Liffey',
  'river-medway': 'River Medway',
  'river-ouse': 'River Ouse, Yorkshire',
  'river-cam': 'River Cam',

  // --- mountains ---
  'mountain-puy-de-dome': 'Puy de Dôme',
  'mountain-mount-davis': 'Mount Davis (Pennsylvania)',
  'mountain-lions-head': "Lion's Head (Cape Town)",
  'mountain-signal-hill': 'Signal Hill (Cape Town)',
  'mountain-cleeve-hill': 'Cleeve Hill, Gloucestershire',
  'mountain-aukstojas': 'Aukštojas Hill',
  'mountain-box-hill': 'Box Hill, Surrey',
  'mountain-mount-eden': 'Maungawhau / Mount Eden',
  'mountain-one-tree-hill': 'Maungakiekie / One Tree Hill',
  'mountain-bukit-timah': 'Bukit Timah Hill',
  'mountain-mount-coot-tha': 'Mount Coot-tha', // the suburb article is the only coverage of the peak

  // --- deserts ---
  'desert-karakum': 'Karakum Desert',
  // The two polar deserts have no desert-specific article; the region article is
  // the subject people mean, and both are famous enough that it barely matters.
  'desert-antarctic-desert': 'Antarctica',
  'desert-arctic-desert': 'Arctic',
  'desert-colorado-plateau-desert': 'Colorado Plateau',

  // --- islands (several are named "X Island" here only to avoid colliding with
  // the country of the same name in a different cohort) ---
  'island-madagascar-island': 'Madagascar',
  'island-cuba-island': 'Cuba',
  'island-iceland-island': 'Iceland',
  'island-ireland-island': 'Ireland',
  'island-sri-lanka-island': 'Sri Lanka',
  'island-taiwan-island': 'Taiwan',
  'island-jamaica-island': 'Jamaica',
  'island-cyprus-island': 'Cyprus',
  'island-malta-island': 'Malta',
  'island-barbados-island': 'Barbados',
  'island-mauritius-island': 'Mauritius',
  'island-nauru-island': 'Nauru',
  'island-newfoundland': 'Newfoundland (island)',
  'island-melville-island': 'Melville Island (Northwest Territories and Nunavut)',
  'island-somerset-island': 'Somerset Island (Nunavut)',
  'island-reunion': 'Réunion',
  'island-big-island-of-hawaii': 'Hawaii (island)',
  'island-aland': 'Åland',

  // --- added with the 2026 expansion ---
  'lake-lake-george': 'Lake George (New York)',
  'lake-lake-assal': 'Lake Assal (Djibouti)',
  'river-chenab': 'Chenab River',
  'river-han-river': 'Han River (Korea)',
  'river-swan-river': 'Swan River (Western Australia)',
  'river-limpopo': 'Limpopo River',
  'river-main': 'Main (river)',
  'river-river-dee': 'River Dee, Wales',
  'mountain-mount-ida': 'Mount Ida (Crete)',
  'mountain-mount-ossa': 'Mount Ossa (Tasmania)',
  'desert-painted-desert': 'Painted Desert (Arizona)',
  'desert-guajira-desert': 'La Guajira Desert',
  'island-santa-catalina-island': 'Santa Catalina Island (California)',
  'island-saint-martin': 'Saint Martin (island)',
  // --- island nations answered by their country's name (2026-09) ---
  'island-dominica-island': 'Dominica',
  'island-saint-lucia-island': 'Saint Lucia',
  'island-saint-vincent-island': 'Saint Vincent (Antilles)',
  'island-grenada-island': 'Grenada',
  'island-sao-tome-and-principe': 'São Tomé and Príncipe',
  'island-bahamas': 'The Bahamas',
  'island-micronesia': 'Federated States of Micronesia',
  'island-saint-thomas': 'Saint Thomas, U.S. Virgin Islands',
  'island-san-andres': 'San Andrés (island)',
  'island-isabela-island': 'Isabela Island (Galápagos)',
  'island-hydra': 'Hydra (island)',
  'island-ithaca': 'Ithaca (island)',
  'island-sao-miguel': 'São Miguel Island',
  'island-mon': 'Møn',
  'island-mull': 'Isle of Mull',
  'island-jura': 'Jura, Scotland',
  'island-arran': 'Isle of Arran',
  'island-bute': 'Isle of Bute',
  'island-rum': 'Rùm',
  'island-tresco': 'Tresco, Isles of Scilly',
  'island-komodo': 'Komodo (island)',
  'island-tanna': 'Tanna Island',
  'island-new-ireland': 'New Ireland (island)',
  'island-mahe': 'Mahé, Seychelles',
  'island-santiago-island': 'Santiago, Cape Verde',
  'island-sal': 'Sal, Cape Verde',
  'island-boa-vista': 'Boa Vista, Cape Verde',
  'island-phuket': 'Phuket Island',
  'island-koh-samui': 'Ko Samui'
};

/**
 * Entries where the resolved article IS right but its short description doesn't
 * contain any word the category heuristic looks for. Listed explicitly, one by
 * one, rather than by loosening the heuristic until it stops complaining.
 *
 * This never suppresses a missing or disambiguation page — only the
 * "description doesn't look like a ..." warning.
 */
export const WIKI_VERIFIED = new Set([
  'capital-monaco-ville', // "Ward in Monaco" - Monaco-Ville is the capital ward
  'capital-south-tarawa', // "Island of the Republic of Kiribati" - the capital area
  'capital-singapore-city',
  'lake-lake-pontchartrain', // technically an estuary, universally called a lake
  'mountain-half-dome', // "Granitic dome in Yosemite"
  'mountain-el-capitan', // "Vertical rock formation in Yosemite"
  'mountain-stromboli', // "Active volcanic island" - the volcano article
  'mountain-mount-nebo', // "Abrahamic holy site in Jordan"
  'mountain-mount-greylock', // "United States historic place"
  'mountain-camelback-mountain', // "Landform in Maricopa County"
  'mountain-charles-mound', // "Land formation" - Illinois high point
  'mountain-mount-coot-tha', // suburb article, covers the peak
  'mountain-mount-eden',
  'mountain-one-tree-hill',
  'desert-nullarbor-plain',
  'desert-atacama-desert',
  'desert-rangipo-desert',
  'desert-antarctic-desert',
  'desert-arctic-desert',
  'desert-colorado-plateau-desert',
  'island-tasmania', // "State of Australia" - the article is the island
  'island-hainan',
  'island-palawan',
  'island-prince-edward-island',
  'island-zanzibar', // the region article; "Unguja" is the landmass but nobody says it
  'island-isle-of-man',
  'island-jersey',
  'island-aland',
  'island-newfoundland',
  'island-reunion', // "Overseas department of France" - the island itself
  'island-cuba-island',
  'island-iceland-island',
  'island-sri-lanka-island',
  'island-taiwan-island',
  'island-jamaica-island',
  'island-cyprus-island',
  'island-malta-island',
  'island-barbados-island',
  'island-mauritius-island',
  'island-nauru-island',
  'island-madagascar-island',
  'sea_ocean-caspian-sea', // "Lake in Eurasia" - the world's largest, named a sea
  'sea_ocean-aral-sea',
  'lake-aral-sea', // same article; it is a lake as much as the Caspian is
  'sea_ocean-aegean-sea',
  'country-micronesia',

  // --- added with the 2026 expansion ---
  'mountain-krakatoa', // "Volcanic caldera in the Sunda Strait"
  'desert-wadi-rum', // "Valley in southern Jordan" - a desert valley
  'desert-black-rock-desert',
  'desert-great-salt-lake-desert',
  'island-manhattan', // "Borough in New York City" - it is an island
  'island-staten-island',
  'island-nantucket',
  'island-martinique',
  'island-guadeloupe',
  'island-great-exuma',
  'island-fernando-de-noronha',
  'island-lipari',
  'island-alderney',
  'island-langkawi', // district article covers the island
  'island-phuket', // province article is the island's coverage
  'island-koh-samui',
  'island-cebu', // province is coterminous with the island
  'island-bohol',
  'island-ternate',
  'island-mayotte',
  // --- island nations answered by their country's name (2026-09): the
  // country article IS the island's coverage, as with Cuba and Malta above ---
  'island-dominica-island',
  'island-saint-lucia-island',
  'island-grenada-island',
  'island-comoros',
  'island-cape-verde',
  'island-sao-tome-and-principe',
  'island-bahamas',
  'island-palau',
  'island-samoa',
  'island-tonga',
  'island-vanuatu',
  'island-solomon-islands',
  'island-kiribati',
  'island-tuvalu',
  'island-marshall-islands',
  'island-micronesia',
  'sea_ocean-dead-sea', // "Salt lake in the Levant" - everyone calls it a sea
  'sea_ocean-gulf-of-saint-lawrence',
  'sea_ocean-chesapeake-bay'
]);
