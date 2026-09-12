/**
 * Flag colours, one row per country in data-countries.mjs, keyed by the
 * country's in-game name. Feeds "Name a country whose flag has green in it."
 *
 * Format: Name|colour+colour+...
 *
 * The palette is deliberately small and the reading deliberately GENEROUS,
 * because a themed prompt rejects whatever is not listed, and a player who
 * says "Peru" for "has green in it" because they are picturing the coat of
 * arms is right, not wrong. So:
 *
 *   - gold, saffron-yellow, cream      -> yellow
 *   - light blue, navy, azure, cyan    -> blue
 *   - maroon, crimson, burgundy        -> red
 *   - saffron-orange, copper           -> orange
 *   - a colour that appears only in an emblem, coat of arms, star or badge
 *     still counts (Spain has blue from its coat of arms; Mexico has blue from
 *     the lake under the eagle, but not brown, which is not in the palette)
 *   - purple, brown and grey are not in the palette and are ignored
 *
 * Only positive prompts ("has X", "has both X and Y") are ever generated from
 * this, so an over-inclusive row can at worst accept a debatable answer; it can
 * never reject a correct one. A missing colour CAN reject a correct answer -
 * when in doubt, include it.
 *
 * `npm run build-data` fails if a country has no row here or a row names no
 * country; `npm run validate` fails on any colour outside FLAG_COLOURS.
 */

export const FLAG_COLOURS = ['red', 'white', 'blue', 'green', 'yellow', 'black', 'orange'];

export const FLAGS = `
Nigeria|green+white
Ethiopia|green+yellow+red+blue
Egypt|red+white+black+yellow
Democratic Republic of the Congo|blue+yellow+red
Tanzania|green+blue+black+yellow
South Africa|red+white+blue+green+yellow+black
Kenya|black+red+green+white
Uganda|black+yellow+red+white
Sudan|red+white+black+green
Algeria|green+white+red
Morocco|red+green
Angola|red+black+yellow
Ghana|red+yellow+green+black
Mozambique|green+black+yellow+white+red
Madagascar|white+red+green
Ivory Coast|orange+white+green
Cameroon|green+red+yellow
Niger|orange+white+green
Mali|green+yellow+red
Burkina Faso|red+green+yellow
Malawi|black+red+green
Zambia|green+red+black+orange
Chad|blue+yellow+red
Somalia|blue+white
Senegal|green+yellow+red
Zimbabwe|green+yellow+red+black+white
Guinea|red+yellow+green
Rwanda|blue+yellow+green
Benin|green+yellow+red
Burundi|red+white+green
Tunisia|red+white
South Sudan|black+red+green+white+blue+yellow
Togo|green+yellow+red+white
Sierra Leone|green+white+blue
Libya|red+black+green+white
Republic of the Congo|green+yellow+red
Central African Republic|blue+white+green+yellow+red
Liberia|red+white+blue
Mauritania|green+yellow+red
Eritrea|green+red+blue+yellow
Gambia|red+blue+green+white
Botswana|blue+white+black
Namibia|blue+red+green+white+yellow
Gabon|green+yellow+blue
Lesotho|blue+white+green+black
Guinea-Bissau|red+yellow+green+black
Equatorial Guinea|green+white+red+blue+yellow
Mauritius|red+blue+yellow+green
Eswatini|blue+yellow+red+black+white
Djibouti|blue+green+white+red
Comoros|yellow+white+red+blue+green
Cape Verde|blue+white+red+yellow
Sao Tome and Principe|green+yellow+red+black
Seychelles|blue+yellow+red+white+green
India|orange+white+green+blue
China|red+yellow
Indonesia|red+white
Pakistan|green+white
Bangladesh|green+red
Japan|white+red
Philippines|blue+red+white+yellow
Vietnam|red+yellow
Iran|green+white+red
Turkey|red+white
Thailand|red+white+blue
Myanmar|yellow+green+red+white
South Korea|white+red+blue+black
Iraq|red+white+black+green
Afghanistan|black+red+green+white
Saudi Arabia|green+white
Uzbekistan|blue+white+green+red
Yemen|red+white+black
Malaysia|red+white+blue+yellow
Nepal|red+blue+white
North Korea|red+white+blue
Taiwan|red+blue+white
Syria|green+white+black+red
Sri Lanka|red+yellow+green+orange
Kazakhstan|blue+yellow
Cambodia|blue+red+white+black
Jordan|black+white+green+red
Azerbaijan|blue+red+green+white
Tajikistan|red+white+green+yellow
Israel|white+blue
United Arab Emirates|red+green+white+black
Laos|red+blue+white
Kyrgyzstan|red+yellow
Turkmenistan|green+red+white+yellow
Singapore|red+white
Lebanon|red+white+green
Palestine|black+white+green+red
Oman|red+white+green
Kuwait|green+white+red+black
Georgia|white+red
Mongolia|red+blue+yellow
Armenia|red+blue+orange
Qatar|red+white
Bahrain|red+white
Timor-Leste|red+yellow+black+white
Bhutan|yellow+orange+white
Maldives|red+green+white
Brunei|yellow+white+black+red
Russia|white+blue+red
Germany|black+red+yellow
France|blue+white+red
United Kingdom|red+white+blue
Italy|green+white+red
Spain|red+yellow+white+blue+green
Ukraine|blue+yellow
Poland|white+red
Romania|blue+yellow+red
Netherlands|red+white+blue
Belgium|black+yellow+red
Sweden|blue+yellow
Czechia|white+red+blue
Greece|blue+white
Portugal|green+red+yellow+white+blue
Hungary|red+white+green
Belarus|red+green+white
Austria|red+white
Switzerland|red+white
Serbia|red+blue+white+yellow
Bulgaria|white+green+red
Denmark|red+white
Slovakia|white+blue+red
Finland|white+blue
Norway|red+white+blue
Ireland|green+white+orange
Croatia|red+white+blue+yellow+black
Moldova|blue+yellow+red
Bosnia and Herzegovina|blue+yellow+white
Albania|red+black
Lithuania|yellow+green+red
Slovenia|white+blue+red+yellow
North Macedonia|red+yellow
Latvia|red+white
Kosovo|blue+yellow+white
Estonia|blue+black+white
Cyprus|white+orange+green
Luxembourg|red+white+blue
Montenegro|red+yellow+blue+white+green
Malta|white+red
Iceland|blue+white+red
Andorra|blue+yellow+red
Liechtenstein|blue+red+yellow
Monaco|red+white
San Marino|white+blue+yellow+green
Vatican City|yellow+white+red
United States|red+white+blue
Mexico|green+white+red+blue
Canada|red+white
Guatemala|blue+white+yellow+green+red
Haiti|blue+red+white+green+yellow
Dominican Republic|blue+red+white+yellow+green
Cuba|blue+white+red
Honduras|blue+white
Nicaragua|blue+white+red+yellow+green+orange
El Salvador|blue+white+yellow+green+red
Costa Rica|blue+white+red+green+yellow
Panama|red+white+blue
Jamaica|black+green+yellow
Trinidad and Tobago|red+white+black
Belize|blue+red+white+green+yellow
Bahamas|blue+yellow+black
Barbados|blue+yellow+black
Saint Lucia|blue+yellow+black+white
Grenada|red+yellow+green
Saint Vincent and the Grenadines|blue+yellow+green
Antigua and Barbuda|red+black+blue+white+yellow
Dominica|green+yellow+black+white+red
Saint Kitts and Nevis|green+yellow+black+red+white
Brazil|green+yellow+blue+white
Colombia|yellow+blue+red
Argentina|blue+white+yellow
Peru|red+white+green+yellow+blue
Venezuela|yellow+blue+red+white+green
Chile|red+white+blue
Ecuador|yellow+blue+red+white+green+black
Bolivia|red+yellow+green+blue+white
Paraguay|red+white+blue+yellow+green
Uruguay|white+blue+yellow
Guyana|green+yellow+white+black+red
Suriname|green+white+red+yellow
Australia|blue+white+red
Papua New Guinea|red+black+yellow+white
New Zealand|blue+red+white
Fiji|blue+white+red+yellow+green
Solomon Islands|blue+green+yellow+white
Vanuatu|red+green+black+yellow
Samoa|red+blue+white
Kiribati|red+yellow+white+blue
Micronesia|blue+white
Tonga|red+white
Marshall Islands|blue+orange+white
Palau|blue+yellow
Nauru|blue+yellow+white
Tuvalu|blue+yellow+white+red
`;

/** Country name -> colours, in palette order, with the file's own sanity checks. */
export function flagsByCountry() {
  const out = new Map();
  for (const raw of FLAGS.trim().split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const [name, colours] = line.split('|');
    const list = (colours || '').split('+').map((c) => c.trim()).filter(Boolean);
    if (!name || list.length === 0) throw new Error(`data-flags: bad row "${line}"`);
    for (const colour of list) {
      if (!FLAG_COLOURS.includes(colour)) throw new Error(`data-flags: ${name} has unknown colour "${colour}"`);
    }
    if (out.has(name.trim())) throw new Error(`data-flags: ${name} listed twice`);
    out.set(name.trim(), FLAG_COLOURS.filter((c) => list.includes(c)));
  }
  return out;
}
