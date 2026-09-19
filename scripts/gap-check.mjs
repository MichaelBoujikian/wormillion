/**
 * Would a real player's first guesses actually work?
 *
 * Runs a list of answers people obviously reach for through the same matcher the
 * game uses, and reports the ones the bank can't accept. This is the check that
 * catches "I typed Seychelles for an island and it said no".
 *
 *   node scripts/gap-check.mjs
 */
import { createRequire } from 'node:module';
import { buildFiles } from './build-data.mjs';

const require = createRequire(import.meta.url);
const matching = require('../src/js/matching.js');

// Deliberately the obvious stuff, not the obscure stuff.
const EXPECTED = {
  country: ['France', 'Japan', 'Brazil', 'Egypt', 'Kenya', 'Chile', 'Nepal', 'Fiji', 'USA', 'UK', 'Vietnam', 'Peru', 'Iceland', 'Morocco', 'Thailand'],
  capital: ['Paris', 'Tokyo', 'Cairo', 'Ottawa', 'Lima', 'Oslo', 'Doha', 'Hanoi', 'Rome', 'Madrid', 'Seoul', 'Nairobi', 'Havana', 'Athens', 'Washington', 'Sacramento', 'Boston', 'Austin'],
  lake: ['Lake Superior', 'Lake Victoria', 'Baikal', 'Loch Ness', 'Lake Tahoe', 'Dead Sea', 'Lake Como', 'Crater Lake', 'Lake Titicaca', 'Great Salt Lake', 'Aral Sea',
    // the small famous ones a "smaller than 100 km²" prompt sends people to (reported 2026-09-13)
    'Lake Bled', 'Lake Placid', 'Lake Hillier', 'Peyto Lake', 'Jokulsarlon', 'Plitvice', 'Lake Louise', 'Moraine Lake',
    // the 2026-09-15 expansion
    'Loch Tay', 'Lough Corrib', 'Ullswater', 'Lake Winnipesaukee', 'Lake of the Ozarks', 'Lake Nasser', 'Lake Manyara', 'Lake Natron', 'Dal Lake', 'Lake Wanaka', 'Lake Brienz', 'Lake Iseo', 'Malaren',
    // the 2026-09-15 Sweden probe (scripts/expansion/reports/2026-09-15-sweden-lakes.md)
    'Vanern', 'Vattern', 'Siljan', 'Storavan', 'Takern',
    // the 2026-09-16 US lakes scouring (scripts/expansion/reports/2026-09-16-us-lakes.md)
    'Lake Chaubunagungamaug', 'Lake Peigneur', 'Tulare Lake', 'Smith Mountain Lake', 'Lake Hartwell', 'Torch Lake', 'Lake Jocassee', 'Quake Lake', 'Lake Anna',
    'Lake Eufaula', 'Kerr Lake', 'Lake Martin', 'Elephant Butte', 'Lake Ouachita', 'Lake Almanor', 'Fort Peck Lake', 'Sam Rayburn', 'Lake Sinclair', 'Laguna Madre', 'Jenny Lake', 'Lady Bird Lake', 'Lake Crescent', 'Jackson Lake',
    // the 2026-09-16 UK + Ireland lakes scouring (reports/2026-09-16-europe-lakes.md)
    'Ladybower Reservoir', 'The Serpentine', 'Llyn Celyn', 'Lake of Menteith', 'Lough Hyne',
    'Geiseltalsee', 'Laacher See', 'Walchensee', 'Muggelsee', 'Mohne Reservoir', 'Bachalpsee', 'Lake Toplitz', 'Plauer See',
    'Lac du Bourget', 'Lake Bourget', 'Etang de Thau', 'Etang de Berre', 'Lac du Der', 'IJmeer', 'Grevelingen', 'Veluwemeer',
    'Lake Orta', 'Reschensee', 'Lake Avernus', 'Lagoa do Fogo', 'Lake Nemi', 'Sete Cidades', 'Orbetello',
    'Lake Bodom', 'Vanajavesi', 'Puruvesi', 'Oyeren', 'Mosvatn', 'Lokka Reservoir', 'Keurusselka', 'Pihlajavesi',
    // the 2026-09-18 Mexico and Canada lakes scouring (reports/2026-09-18-mx-ca-lakes.md)
    "Bras d'Or Lake", 'Lesser Slave Lake', 'Smallwood Reservoir', 'Harrison Lake', 'Lac Seul', 'Lake Hazen', 'Lake Timiskaming', 'Gods Lake', 'Lake Abitibi', 'Amadjuak Lake', 'Nueltin Lake', 'Southern Indian Lake', 'Lake of Two Mountains', 'Lake Saint Pierre'],
  river: ['Nile', 'Amazon', 'Mississippi', 'Thames', 'Danube', 'Ganges', 'Volga', 'Indus', 'Rhine', 'Seine', 'Yangtze', 'Congo', 'Tigris', 'Euphrates', 'Jordan', 'Colorado',
    // the 2026-09-14 expansion: rivers players reported missing
    'Hudson', 'Potomac', 'Tennessee', 'Fraser', 'Magdalena', 'Okavango', 'Garonne', 'Neckar', 'Mersey', 'Tyne', 'Warta', 'Irtysh', 'Kaveri', 'Murrumbidgee', 'Rio de la Plata',
    // the 2026-09-15 Colombia probe (scripts/expansion/reports/2026-09-15-colombia-rivers.md)
    'Cano Cristales', 'Catatumbo', 'Sinu', 'Bogota River', 'Cauca', 'Caqueta',
    // the 2026-09-16 US rivers scouring (scripts/expansion/reports/2026-09-16-us-rivers.md)
    'Red River of the North', 'French Broad', 'Green River', 'Kanawha', 'Des Moines River', 'Catawba', 'Youghiogheny', 'Androscoggin',
    'Yazoo', 'Black Warrior', 'Clinch', 'Kissimmee', 'Sheyenne', 'Cedar River', 'Frio', 'Tug Fork', 'Bayou Teche', 'Little Bighorn', 'Ocoee', 'Toccoa',
    // famous short ones the 80 km floor would have cut, and the re-pointed Fox
    'Mystic River', 'Harlem River', 'Bronx River', 'Anacostia', 'Hackensack', 'Fox River', 'Current River',
    // the 2026-09-16 UK + Ireland rivers scouring (scripts/expansion/reports/2026-09-16-uk-rivers.md); Lee and Avoca re-pointed
    'River Irwell', 'Weaver', 'River Coquet', 'Thame', 'Bure', 'Wensum', 'Soar', 'Yare', 'Waveney', 'Teviot', 'River Lee', 'Avoca', 'Ettrick', 'River Teith', 'Feale',
    // the 2026-09-16 Germany / Austria / Switzerland rivers scouring (reports/2026-09-16-de-rivers.md); Eder, Aller and Thur re-pointed
    'Saar', 'Emscher', 'Erft', 'Kyll', 'Lenne', 'Bode', 'Elde', 'Wumme', 'Saalach', 'Breg', 'Eisbach', 'Vechte', 'Werre', 'Eder', 'Aller', 'Thur', 'Zwickauer Mulde', 'Franconian Saale',
    // the 2026-09-16 France / Belgium / Netherlands rivers scouring (reports/2026-09-16-fr-rivers.md); Orne re-pointed to Normandy's
    'Epte', 'Meurthe', 'Odet', 'Huisne', 'Serein', 'Risle', 'Sioule', 'Gartempe', 'Drome', 'Douve', 'Clain', 'Orne', 'Sevre Nantaise', 'Touques', 'Deule',
    // the 2026-09-16 Italy / Spain / Portugal rivers scouring (reports/2026-09-16-it-es-rivers.md)
    'Rio Tinto', 'Arlanza', 'Adaja', 'Eresma', 'Guadarrama', 'Guadalimar', 'Agri', 'Fortore', 'Busento', 'Tambre', 'Narcea', 'Tajuna', 'Agueda',
    // the 2026-09-16 Nordic rivers scouring (reports/2026-09-16-nordic-rivers.md)
    'Altaelva', 'Lainio', 'Byske', 'Vasterdal', 'Osterdal', 'Voxnan', 'Anarjohka', 'Kovda', 'Lotta', 'Simojoki', 'Kvina',
    // the 2026-09-18 Mexico rivers scouring (reports/2026-09-18-mx-rivers.md)
    'Aguanaval', 'Soto La Marina', 'Tecolutla', 'San Pedro Mezquital', 'Tula', 'Tuxpan', 'Tonala', 'Nautla', 'Bavispe', 'Sonoyta', 'Tamesi',
    // the 2026-09-18 Canada rivers scouring (reports/2026-09-18-ca-rivers.md)
    'Kicking Horse', 'Battle', 'Finlay', 'Spanish', 'Saugeen', 'French', 'Manicouagan', 'Yellowknife', 'Moisie', 'Romaine', 'Peribonka', 'Thlewiaza', 'Wabasca', 'Speed', 'Highwood', 'Pitt',
    // the 2026-09-18 Eastern Europe rivers scouring (reports/2026-09-18-ee-rivers.md)
    'Moldova River', 'Emajogi', 'Crisul Repede', 'Mius', 'Wda', 'Drawa', 'Jijia', 'Oril', 'Vovcha', 'Khorol', 'Udai', 'Ubort', 'Western Berezina', 'Prahova', 'Parnu', 'Salaca', 'Musa'],
  mountain: ['Everest', 'K2', 'Kilimanjaro', 'Matterhorn', 'Mount Fuji', 'Denali', 'Ben Nevis', 'Mont Blanc', 'Uluru', 'Aconcagua', 'Mount Rainier', 'Vesuvius', 'Etna',
    // the 2026-09-14 expansion
    'Mount Rushmore', 'Devils Tower', 'Kilauea', 'Mount Adams', 'Fitz Roy', 'Torres del Paine', 'Cradle Mountain', 'Mount Aspiring', 'Popocatepetl', 'Arenal', 'Monch', 'Nanda Devi', 'Rakaposhi', 'Sakurajima', 'Mount Kailash', 'Tryfan', 'Croagh Patrick', 'Nyiragongo', 'Hekla', 'Eyjafjallajokull', 'Mount Meru',
    // the 2026-09-16 US mountains scouring (scripts/expansion/reports/2026-09-16-us-mountains.md)
    'Mount Mitchell', 'Mount Marcy', 'Katahdin', 'Clingmans Dome', 'Mount Elbert', 'Longs Peak', 'Lassen Peak', 'Mount Mansfield', 'Mount Greylock', 'Stone Mountain', 'Camelback Mountain',
    'Piestewa Peak', 'Superstition Mountain', 'Mount Lemmon', 'Sandia Peak', 'Maroon Bells', 'Mount Timpanogos', 'Half Dome', 'Black Elk Peak', 'Spruce Knob', 'Brasstown Bald', 'Mount Tamalpais', 'Mount Diablo',
    // the 2026-09-17 UK + Ireland mountains scouring (reports/2026-09-17-europe-mountains.md)
    'Pendle Hill', 'The Storr', 'Hill of Tara', 'Croaghaun', 'Great Sugar Loaf', 'Slievenamon', 'Nephin', 'Cavehill', 'Ben Lui', 'Sgurr Dearg', 'Cnicht', 'Mickle Fell', 'Creag Meagaidh', 'Aonach Beag', 'Ben Cleuch', 'Slemish',
    // the 2026-09-17 Alps / Germany / Austria / Switzerland mountains scouring
    'Aiguille du Dru', 'Grosser Mythen', 'Piz Boe', 'Puy de Sancy', 'Piz Buin', 'Signalkuppe', 'Mont Maudit', 'Dammastock', 'Hochschwab', 'Nordend', 'Beerenberg', 'Roque de los Muchachos',
    'Mont Agel', 'Grand Ballon', 'Cime de la Bonette', 'Saleve', 'Puy Mary', 'Mont Aigoual', 'Maladeta', 'Carlit', 'Pic de Neouvielle',
    // the 2026-09-17 Italy / Spain / Portugal mountains scouring
    'Rock of Gibraltar', 'Phlegraean Fields', 'Vatican Hill', 'Cumbre Vieja', 'Puig Major', 'Pico do Areeiro', 'Mount Somma', 'Mount Pellegrino', 'Aspromonte', 'Gennargentu', 'Alcazaba', 'Latemar',
    // the 2026-09-17 Nordic mountains scouring
    'Himmelbjerget', 'Hverfjall', 'Oraefajokull', 'Hofsjokull', 'Skjaldbreidur', 'Kverkfjoll', 'Rondeslottet', 'Ejer Bavnehoj',
    // the 2026-09-18 Mexico and Canada mountains scouring (reports/2026-09-18-mx-ca-mountains.md)
    'Mount Steele', 'King Peak', 'Mount Kennedy', 'Mount Edziza', 'Howse Peak', 'Crowsnest Mountain', 'Tunnel Mountain', 'Ha Ling Peak', 'Stawamus Chief', 'Golden Hinde', 'Mont Saint-Hilaire', 'El Jorullo', 'Cerro Tlaloc', 'Pico de Tancitaro', 'Cerro Potosi'],
  desert: ['Sahara', 'Gobi', 'Mojave', 'Atacama', 'Kalahari', 'Namib', 'Sonoran', 'Thar Desert', 'Arabian Desert', 'Antarctic Desert',
    // the 2026-09-15 expansion
    'Death Valley', 'White Sands', 'Skeleton Coast', 'Rann of Kutch', 'Karoo'],
  city: ['New York', 'NYC', 'Los Angeles', 'LA', 'Chicago', 'Sydney', 'Melbourne', 'Toronto', 'Vancouver', 'Mumbai', 'Bombay', 'Istanbul', 'Rio de Janeiro', 'Rio', 'Sao Paulo', 'Barcelona', 'Milan', 'Munich', 'Shanghai', 'Karachi', 'Lagos', 'Johannesburg', 'Cape Town', 'Dubai', 'Osaka', 'Kyoto', 'Venice', 'Florence', 'Saint Petersburg', 'St Petersburg', 'Marseille', 'Frankfurt', 'Zurich', 'Geneva', 'Casablanca', 'Ho Chi Minh City', 'Saigon', 'Kolkata', 'Calcutta', 'Chennai', 'Miami', 'San Francisco', 'Houston', 'Seattle', 'Boston', 'Leeds', 'Baltimore', 'Kobe', 'Constantinople', 'Winnipeg', 'Portland', 'Macau', 'Hue',
    // the 2026-09-14 expansion: non-capital cities players reported missing
    'Nashville', 'Memphis', 'Charlotte', 'Cleveland', 'Cincinnati', 'Halifax', 'Merida', 'Monterrey', 'Medellin', 'Belo Horizonte', 'Bologna', 'Granada', 'Toledo', 'Sheffield', 'Newcastle', 'Nantes', 'Dusseldorf', 'Bilbao', 'Lodz', 'Nizhny Novgorod', 'Bursa', 'Tabriz', 'Erbil', 'Abeokuta', 'Port Said', 'Soweto', 'Eldoret', 'Sendai', 'Daegu', 'Suzhou', 'Indore', 'Peshawar', 'Semarang', 'Johor Bahru', 'Hobart', 'Cairns', 'Dunedin',
    // the 2026-09-15 US probe (scripts/expansion/reports/2026-09-15-us-cities.md)
    'Brooklyn', 'Queens', 'Bronx', 'Arlington', 'Irvine', 'Albany', 'Fremont', 'Santa Clarita',
    // the 2026-09-16 US cities under 100k (scripts/expansion/reports/2026-09-16-us-cities-50k.md)
    'Greenville', 'Evanston', 'New Rochelle', 'Brookline', 'Redmond', 'Redding', 'Marietta', 'Schaumburg', 'Skokie', 'Bethesda', 'Silver Spring', 'Towson', 'Reston', 'East Los Angeles', 'The Villages', 'Hoboken', 'Flagstaff', 'Bozeman', 'Bend', 'Nashua', 'Cranston', 'Waukesha', 'Champaign', 'Ames',
    // the 2026-09-17 Europe cities scouring (reports/2026-09-17-europe-seas-deserts-cities.md)
    'Blackpool', 'Chester', 'Croydon', 'Swindon', 'Doncaster', 'St Albans', 'Bolton', 'Salford', 'Wigan', 'Warrington', 'Stockport', 'Rotherham', 'Poole', 'Bedford', 'Gloucester', 'Cheltenham', 'Harrogate', 'Huddersfield', 'Shrewsbury', 'Maidstone', 'Hereford',
    'Matera', 'Lecce', 'Ancona', 'Pavia', 'Piacenza', 'Prato', 'Sanremo', 'Alessandria', 'Sassari', 'La Spezia', 'Metz', 'Calais', 'Dunkirk', 'Dunkerque', 'Villeurbanne', 'Boulogne-Billancourt', 'Saint-Denis', 'Braunschweig', 'Brunswick', 'Darmstadt', 'Jena', 'Wolfsburg', 'Gelsenkirchen', 'Kaiserslautern', 'Hamelin', 'Bayreuth', 'Worms',
    'Terrassa', 'Sabadell', 'Badalona', 'Getafe', 'Las Palmas', 'Santa Cruz de Tenerife', 'Algeciras', 'Mijas', 'Amadora', 'Almada', 'Solna', 'Norrkoping', 'Halmstad', 'Eskilstuna', 'Horsens', 'Tonsberg', 'Fredrikstad', 'Baerum', 'Hameenlinna', 'Deventer', 'Zoetermeer', 'Amstelveen',
    // the 2026-09-18 Mexico and Canada cities scouring (reports/2026-09-18-mx-ca-cities.md)
    'Markham', 'Burnaby', 'Oakville', 'Sherbrooke', 'Guelph', 'Barrie', 'Oshawa', 'Kingston', 'Saguenay', 'Reynosa', 'Nuevo Laredo', 'Matamoros', 'Tampico', 'Chilpancingo', 'Ciudad Victoria', 'Guaymas', 'Waterloo', 'Richmond', 'Burlington', 'Cambridge'],
  island: ['Maui', 'Oahu', 'Seychelles', 'Falkland Islands', 'Falklands', 'Lofoten', 'Shetland', 'Orkney', 'Hebrides', 'Bali', 'Sicily', 'Greenland', 'Madagascar', 'Cuba', 'Hawaii', 'Manhattan', 'Iceland', 'Tasmania', 'Crete', 'Santorini', 'Fiji', 'Maldives', 'Galapagos', 'Isle of Skye', 'Long Island', 'Corfu', 'Phuket', 'Ibiza', 'Jamaica', 'Bora Bora', 'Aruba', 'Zanzibar', 'Palau', 'Samoa', 'Tonga', 'Bahamas', 'Singapore', 'Grenada', 'Haiti', 'Trinidad and Tobago', 'Big Island', 'Japan', 'Philippines', 'Indonesia', 'New Zealand', 'United Kingdom', 'Papua New Guinea', 'Brunei',
    // the 2026-09-14 expansion
    'Tobago', 'Hong Kong Island', 'Lantau', 'Phi Phi', 'Ko Tao', 'Vieques', 'Saba', 'Hvar', 'Mykonos', 'Iwo Jima', 'Corregidor', 'Manitoulin', 'Kerguelen', 'South Georgia',
    // the 2026-09-16 US islands scouring (scripts/expansion/reports/2026-09-16-us-islands.md)
    'San Nicolas Island', 'Wrangell Island', 'Hart Island', 'Fishers Island', 'Shelter Island', 'Sullivans Island', 'Pawleys Island', 'Edisto Island', 'Bald Head Island', 'Peaks Island', 'Chebeague', 'Yerba Buena Island', 'Star Island', 'Fisher Island', 'Smith Island', 'Pollepel Island', 'Great Sitkin', 'Agattu', 'Sugar Island',
    // the 2026-09-17 UK + Ireland islands scouring (reports/2026-09-17-europe-islands.md)
    'Rockall', 'Eilean Donan', 'Isle of Portland', 'Gruinard Island', 'Burgh Island', 'Foula', 'Eel Pie Island', 'Papa Westray', 'Stroma', 'Flat Holm', 'Steep Holm', 'Bere Island', 'Calf of Man', 'Great Bernera', 'Fetlar', 'Rousay', 'Whalsay',
    'Poveglia', 'Isola Bella', 'Es Vedra', 'Pianosa', 'Alboran Island', 'San Giorgio Maggiore', 'Linosa', 'Capraia', 'Marettimo', 'Filicudi', 'Pheasant Island', 'Levant Island', 'Houat', 'Goeree-Overflakkee',
    'Surtsey', 'Hopen', 'Smola', 'Froya', 'Hitra', 'Senja', 'Sotra', 'Kvaloya', 'Soroya', 'Orust', 'Tjorn', 'Fano', 'Romo', 'Mors', 'Als', 'Heimaey', 'Grimsey', 'Flatey',
    // the 2026-09-17 US no-figure re-run (reports/2026-09-17-europe-seas-deserts-cities.md)
    'Horn Island', 'Just Room Enough Island', 'Daniel Island', 'Daufuskie Island', 'Sea Island', 'Wizard Island', 'Sapelo Island', 'Topsail Island', 'Isle au Haut', 'Gasparilla Island', 'Tuckernuck Island', 'Harsens Island', 'Monomoy Island', 'Ship Island', 'Guemes Island', 'Peanut Island', 'Blennerhassett Island', 'Wellesley Island', 'Mustang Island', 'Heart Island', 'Elliott Key', 'Anastasia Island', 'Appledore Island', 'Stansbury Island', 'Wheeling Island',
    // the 2026-09-18 Mexico and Canada islands scouring (reports/2026-09-18-mx-ca-islands.md)
    'Hans Island', 'Sable Island', 'Island of Montreal', 'Texada Island', 'Gabriola Island', 'Cortes Island', 'Cedros Island', 'Akimiski Island', 'Moresby Island', 'Prince Patrick Island', 'Coats Island', 'Bathurst Island', 'Herschel Island', 'Beechey Island', 'Nootka Island', 'Isla Angel de la Guarda', 'Isla Espiritu Santo'],
  sea_ocean: ['Pacific Ocean', 'Atlantic', 'Mediterranean', 'Red Sea', 'Black Sea', 'Caribbean Sea', 'Dead Sea', 'North Sea', 'Baltic Sea', 'Arabian Sea', 'Bering Sea', 'Coral Sea', 'Gulf of Mexico',
    // the 2026-09-15 expansion
    'Strait of Gibraltar', 'Bosphorus', 'Strait of Hormuz', 'Bering Strait', 'Puget Sound', 'San Francisco Bay', 'Tokyo Bay', 'Bohai Sea', 'Gulf of Suez',
    // the 2026-09-17 Europe seas scouring (reports/2026-09-17-europe-seas-deserts-cities.md)
    'Scapa Flow', 'Sognefjord', 'Geirangerfjord', 'Oslofjord', 'Hardangerfjord', 'Menai Strait', 'Cantabrian Sea', 'Loch Fyne', 'Firth of Tay', 'Cromarty Firth', 'Venetian Lagoon', 'Liverpool Bay', 'Swansea Bay', 'Kiel Fjord', 'Gulf of Corryvreckan', 'Saltstraumen',
    // the 2026-09-17 US no-figure re-run (reports/2026-09-17-europe-seas-deserts-cities.md)
    'Pearl Harbor', 'New York Harbor', 'Golden Gate', 'Straits of Mackinac', 'Deception Pass', 'Boston Harbor', 'Cook Inlet', 'Jamaica Bay', 'Narragansett Bay', 'Pamlico Sound', 'Lituya Bay', 'Arthur Kill', 'The Narrows', 'Bristol Bay', 'Mobile Bay', 'Penobscot Bay', 'Buzzards Bay', 'Hanauma Bay', 'Galveston Bay', 'Elliott Bay', 'Casco Bay', 'Green Bay', 'Kill Van Kull', 'San Diego Bay', 'Humboldt Bay', 'Tomales Bay', 'Barnegat Bay', 'Block Island Sound', 'Glacier Bay', 'Resurrection Bay', 'Kachemak Bay', 'Turnagain Arm', 'Albemarle Sound',
    // the 2026-09-18 Mexico and Canada seas scouring (reports/2026-09-18-mx-ca-seas.md)
    'Salish Sea', 'Georgian Bay', 'Foxe Basin', 'Ungava Bay', 'Lancaster Sound', 'Cabot Strait', 'Hecate Strait', 'Northumberland Strait', 'Frobisher Bay', 'Howe Sound', 'Burrard Inlet', 'Bay of Campeche', 'Gulf of Tehuantepec', 'Magdalena Bay']
};

const byCategory = new Map();
for (const entries of Object.values(buildFiles())) {
  for (const entry of entries) {
    if (!byCategory.has(entry.category)) byCategory.set(entry.category, []);
    byCategory.get(entry.category).push(entry);
  }
}

let missing = 0;
let corrected = 0;
for (const [category, answers] of Object.entries(EXPECTED)) {
  const lookup = matching.buildLookup(byCategory.get(category) || [], { category });
  const gaps = [];
  for (const answer of answers) {
    const result = matching.matchAnswer(answer, lookup, new Set());
    if (result.status === 'unrecognized') gaps.push(answer);
    else if (result.status === 'corrected') { corrected += 1; console.log(`  ${category}: "${answer}" lands only by correction -> ${result.matched}`); }
  }
  missing += gaps.length;
  console.log(
    `${category.padEnd(10)} ${String(answers.length - gaps.length).padStart(3)}/${answers.length}` +
      (gaps.length ? `   MISSING: ${gaps.join(', ')}` : '')
  );
}

console.log(
  missing
    ? `\n${missing} obvious answer(s) the bank cannot accept.`
    : `\nEvery obvious answer lands (${corrected} via spelling correction).`
);
process.exit(missing ? 1 : 0);
