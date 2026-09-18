/**
 * Put existing bank entries into a theme by hand:
 *   node scripts/expansion/add-theme.mjs <category> "<theme>" "Name" ["Name" ...]
 * Appends the names to src/data/themes.js the way fold.mjs does (the theme
 * must exist; the names must be bank names - validate will say otherwise).
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const REPO = fileURLToPath(new URL('../../', import.meta.url));
const [category, theme, ...names] = process.argv.slice(2);
if (!category || !theme || !names.length) { console.error('usage: add-theme.mjs <category> "<theme>" "Name" ...'); process.exit(1); }
const path = REPO + 'src/data/themes.js';
let text = await readFile(path, 'utf8');
const EOL = text.includes('\r\n') ? '\r\n' : '\n';
const scope = {};
new Function('globalThis', text)(scope);
const members = new Set((scope.WORMILLION_THEMES[category] || {})[theme] || []);
const adds = names.filter((n) => !members.has(n));
if (!adds.length) { console.log('nothing to add (all already members)'); process.exit(0); }
const q = (s) => (s.includes("'") ? JSON.stringify(s) : `'${s}'`);
const catStart = text.indexOf(`${EOL}  ${category}: {`);
const catEnd = text.indexOf(`${EOL}  },`, catStart);
const keyIdx = text.indexOf(`'${theme}': [`, catStart);
if (catStart < 0 || keyIdx < 0 || keyIdx > catEnd) throw new Error(`themes: ${category}/${theme} not found`);
const arrStart = keyIdx + `'${theme}': [`.length;
const arrEnd = text.indexOf(']', arrStart);
let insertAt = arrEnd;
while (/\s/.test(text[insertAt - 1])) insertAt--;
// a list that already ends in a comma (a trailing comma before the bracket) gets no second one: ',,' is an array hole
const comma = text[insertAt - 1] === ',' ? '' : ',';
const chunks = [];
for (let i = 0; i < adds.length; i += 5) chunks.push('      ' + adds.slice(i, i + 5).map(q).join(', '));
text = text.slice(0, insertAt) + `${comma}${EOL}      // add-theme.mjs${EOL}` + chunks.join(`,${EOL}`) + text.slice(insertAt);
await writeFile(path, text, 'utf8');
console.log(`wrote themes.js: +${adds.length} in ${category}/${theme}: ${adds.join(', ')}`);
