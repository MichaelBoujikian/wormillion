/**
 * Which ocean(s) an island sits in, or a sea belongs to.
 *
 * Derived from the article's coordinates with a few coarse boxes, then
 * corrected by hand where the boxes are wrong: archipelagos that straddle two
 * oceans (most of Indonesia), marginal seas whose basin assignment follows the
 * IHO rather than the map (Hudson Bay is Arctic), and bodies of water with no
 * ocean at all (the Caspian). Both the boxes and the overrides live here so a
 * bad classification is a one-line fix, and `npm run validate` fails if any
 * island or sea ends up with no ocean and no explanation.
 *
 * Multiple oceans are allowed and are the honest answer for a straddler:
 * Java is accepted for both "in the Indian Ocean" and "in the Pacific Ocean".
 */

export const OCEANS = ['Pacific', 'Atlantic', 'Indian', 'Arctic', 'Southern'];

/** Coarse first pass from a centroid. */
export function oceansFromCoordinates(lat, lon) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return []; // no article coordinates
  if (lat <= -60) return ['Southern'];
  if (lat >= 66.5) return ['Arctic'];
  if (lon >= 100 || lon <= -100) return ['Pacific'];
  if (lon > -100 && lon <= -70 && lat < 8) return ['Pacific']; // Galápagos, Chile
  if (lon > 20 && lon < 100 && lat < 30) return ['Indian'];
  return ['Atlantic'];
}

/**
 * Hand corrections, by entry id. An empty array means "no ocean" and is only
 * legal here, never by omission.
 */
export const OCEAN_OVERRIDES = {
  // --- islands: Indonesia and neighbours straddle the Indian/Pacific line ---
  'island-sumatra': ['Indian', 'Pacific'],
  'island-java': ['Indian', 'Pacific'],
  'island-bali': ['Indian', 'Pacific'],
  'island-lombok': ['Indian', 'Pacific'],
  'island-sumbawa': ['Indian', 'Pacific'],
  'island-sumba': ['Indian'],
  'island-flores': ['Indian', 'Pacific'],
  'island-komodo': ['Indian', 'Pacific'],
  'island-timor': ['Indian', 'Pacific'],
  'island-nias': ['Indian'],
  'island-christmas-island': ['Indian'],
  'island-penang-island': ['Indian'], // Strait of Malacca
  'island-langkawi': ['Indian'],
  'island-phuket': ['Indian'],

  // --- islands: Australia / New Zealand, between the Pacific and the Southern ---
  'island-tasmania': ['Pacific', 'Southern'],
  'island-bruny-island': ['Pacific', 'Southern'],
  'island-kangaroo-island': ['Southern', 'Indian'],
  'island-rottnest-island': ['Indian'],
  'island-stewart-island': ['Pacific', 'Southern'],
  'island-south-island': ['Pacific', 'Southern'],
  'island-new-zealand': ['Pacific', 'Southern'], // as its South Island
  'island-indonesia': ['Pacific', 'Indian'], // Sumatra and Java face the Indian Ocean

  // --- islands: Atlantic/Arctic and Atlantic/Southern edges ---
  'island-greenland': ['Arctic', 'Atlantic'],
  'island-southampton-island': ['Arctic'], // Hudson Bay / Foxe Basin
  'island-iceland': ['Atlantic', 'Arctic'],
  'island-south-georgia': ['Atlantic', 'Southern'],
  'island-bouvet-island': ['Atlantic', 'Southern'],
  'island-tierra-del-fuego': ['Atlantic', 'Pacific'],
  'island-east-falkland': ['Atlantic'],
  'island-west-falkland': ['Atlantic'],

  // --- islands whose article has no coordinates ---
  'island-ibiza': ['Atlantic'],
  'island-saint-croix': ['Atlantic'],
  'island-grand-bahama': ['Atlantic'],
  'island-sal': ['Atlantic'],
  'island-waiheke-island': ['Pacific'],

  // --- Norwegian Sea islands sit on the Atlantic/Arctic line ---
  'island-senja': ['Atlantic', 'Arctic'],
  'island-hinnoya': ['Atlantic', 'Arctic'],

  // --- islands in lakes: no ocean at all ---
  'island-ometepe': [],
  'island-isle-royale': [],
  'island-mackinac-island': [],

  // --- seas whose article has no coordinates ---
  'sea_ocean-wadden-sea': ['Atlantic'],

  // --- seas with no ocean (endorheic) ---
  'sea_ocean-caspian-sea': [],
  'sea_ocean-aral-sea': [],
  'sea_ocean-dead-sea': [],

  // --- seas: basin assignment where the box gets it wrong ---
  'sea_ocean-hudson-bay': ['Arctic', 'Atlantic'],
  'sea_ocean-norwegian-sea': ['Atlantic', 'Arctic'],
  'sea_ocean-greenland-sea': ['Arctic', 'Atlantic'],
  'sea_ocean-white-sea': ['Arctic'],
  'sea_ocean-scotia-sea': ['Southern', 'Atlantic'],
  'sea_ocean-southern-ocean': ['Southern'],
  'sea_ocean-timor-sea': ['Indian'],
  'sea_ocean-arafura-sea': ['Pacific', 'Indian'],
  'sea_ocean-savu-sea': ['Indian', 'Pacific'],
  'sea_ocean-great-australian-bight': ['Indian', 'Southern'],
  'sea_ocean-gulf-of-carpentaria': ['Pacific', 'Indian'],
  'sea_ocean-tasman-sea': ['Pacific'],
  'sea_ocean-mozambique-channel': ['Indian'],
  'sea_ocean-andaman-sea': ['Indian'],
  'sea_ocean-bay-of-bengal': ['Indian'],
  'sea_ocean-persian-gulf': ['Indian'],
  'sea_ocean-red-sea': ['Indian'],
  'sea_ocean-mediterranean-sea': ['Atlantic'],
  'sea_ocean-black-sea': ['Atlantic'],
  'sea_ocean-baltic-sea': ['Atlantic'],

  // --- the oceans themselves ---
  'sea_ocean-pacific-ocean': ['Pacific'],
  'sea_ocean-atlantic-ocean': ['Atlantic'],
  'sea_ocean-indian-ocean': ['Indian'],
  'sea_ocean-arctic-ocean': ['Arctic'],

  // --- more coordinate-less islands (2026-09-15 expansion) ---
  'island-tobago': ['Atlantic'],
  'island-lamma-island': ['Pacific'],
  'island-bantayan': ['Pacific'],
  'island-con-dao': ['Pacific'],
  'island-ko-chang': ['Pacific'],
  'island-ko-kut': ['Pacific'],
  'island-weh': ['Indian'],
  'island-lembeh': ['Pacific'],
  'island-nusakambangan': ['Indian'],
  'island-talaud-islands': ['Pacific'],
  'island-kai-islands': ['Pacific', 'Indian'],
  'island-minicoy': ['Indian'],
  'island-vypin': ['Indian'],
  'island-nijhum-dwip': ['Indian'],
  'island-ramree': ['Indian'],
  'island-cheduba': ['Indian'],

  // --- islands and seas whose article has no coordinates (2026-09-15 expansion) ---
  'island-ashuradeh': [],
  'island-bugala': [],
  'island-yas-island': ['Indian'],
  'island-saadiyat': ['Indian'],
  'island-graham-island': ['Pacific'],
  'island-baranof-island': ['Pacific'],
  'island-molokini': ['Pacific'],
  'island-taboga': ['Pacific'],
  'island-matiu-somes-island': ['Pacific'],
  'island-rotuma': ['Pacific'],
  'island-aneityum': ['Pacific'],
  'island-mare': ['Pacific'],
  'island-rongelap': ['Pacific'],
  'island-manono': ['Pacific'],
  'island-pagan': ['Pacific'],
  'island-rurutu': ['Pacific'],
  'island-rapa-iti': ['Pacific'],
  'island-atiu': ['Pacific'],
  'island-shikotan': ['Pacific'],
  'island-paramushir': ['Pacific'],
  'island-kuchinoerabu': ['Pacific'],
  'island-niijima': ['Pacific'],
  'island-kozushima': ['Pacific'],
  'island-miyakejima': ['Pacific'],
  'island-hahajima': ['Pacific'],
  'island-orchid-island': ['Pacific'],
  'island-weizhou': ['Pacific'],
  'island-changdao': ['Pacific'],
  'island-wando': ['Pacific'],
  'island-ocracoke': ['Atlantic'],
  'island-merritt-island': ['Atlantic'],
  'island-saint-barthelemy': ['Atlantic'],
  'sea_ocean-strait-of-malacca': ['Indian', 'Pacific'],
  'sea_ocean-firth-of-forth': ['Atlantic'],
  'sea_ocean-firth-of-clyde': ['Atlantic'],
  'sea_ocean-bay-of-pomerania': ['Atlantic'],
  'sea_ocean-szczecin-lagoon': ['Atlantic'],

  // --- islands whose article has no coordinates (2026-09-14 expansion) ---
  'island-favignana': ['Atlantic'],
  'island-isla-de-lobos': ['Atlantic'],
  'island-desertas-islands': ['Atlantic'],
  'island-brac': ['Atlantic'],
  'island-dugi-otok': ['Atlantic'],
  'island-amrum': ['Atlantic'],
  'island-fohr': ['Atlantic'],
  'island-south-sandwich-islands': ['Southern', 'Atlantic'],
  'island-monte-isola': []
};

/** Final answer for one entry. */
export function oceansFor(entry) {
  if (entry.id in OCEAN_OVERRIDES) return OCEAN_OVERRIDES[entry.id];
  return oceansFromCoordinates(entry.lat, entry.lon);
}
