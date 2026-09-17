/**
 * US state capitals. They feed the `capital` cohort alongside the national
 * capitals (the way minor-peaks.json feeds `mountain`), so "Name a capital
 * city." accepts Sacramento, and the `US state capitals` theme in
 * src/data/themes.js asks for them by name.
 *
 * Format: Capital|State|aliases
 *
 * `size` is the population of the United States, like every capital's size is
 * its COUNTRY's population, so "whose country has a population over 100
 * million" stays true of Boise. The flag is the US flag.
 */
export const US_POPULATION = 340000000;

export const US_STATE_CAPITALS = `
Montgomery|Alabama
Juneau|Alaska
Phoenix|Arizona
Little Rock|Arkansas
Sacramento|California
Denver|Colorado
Hartford|Connecticut
Dover|Delaware
Tallahassee|Florida
Atlanta|Georgia
Honolulu|Hawaii
Boise|Idaho
Springfield|Illinois
Indianapolis|Indiana|Indy
Des Moines|Iowa
Topeka|Kansas
Frankfort|Kentucky
Baton Rouge|Louisiana
Augusta|Maine
Annapolis|Maryland
Boston|Massachusetts
Lansing|Michigan
Saint Paul|Minnesota|St Paul
Jackson|Mississippi
Jefferson City|Missouri
Helena|Montana
Lincoln|Nebraska
Carson City|Nevada
Concord|New Hampshire
Trenton|New Jersey
Santa Fe|New Mexico
Albany|New York
Raleigh|North Carolina
Bismarck|North Dakota
Columbus|Ohio
Oklahoma City|Oklahoma|OKC
Salem|Oregon
Harrisburg|Pennsylvania
Providence|Rhode Island
Columbia|South Carolina
Pierre|South Dakota
Nashville|Tennessee
Austin|Texas
Salt Lake City|Utah|SLC,Salt Lake
Montpelier|Vermont
Richmond|Virginia
Olympia|Washington
Charleston|West Virginia
Madison|Wisconsin
Cheyenne|Wyoming
`;
