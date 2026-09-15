// node add-alias.mjs "Name" "alias" [...]
// Appends aliases to a row in data-physical.mjs, data-cities.mjs or data-countries.mjs.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const [name, ...aliases] = process.argv.slice(2);
const files = ['data-physical.mjs', 'data-cities.mjs', 'data-countries.mjs'].map((f) =>
  fileURLToPath(new URL('../' + f, import.meta.url))
);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let done = false;
for (const path of files) {
  let text = await readFile(path, 'utf8');
  const re = new RegExp(`^(${esc(name)}\\|[^\\r\\n]*?)(\\r?)$`, 'm');
  const m = text.match(re);
  if (!m) continue;
  const cols = m[1].split('|');
  const aliasCol = path.endsWith('data-cities.mjs') ? 3 : path.endsWith('data-countries.mjs') ? 5 : 2;
  while (cols.length <= aliasCol) cols.push('');
  const have = cols[aliasCol] ? cols[aliasCol].split(',') : [];
  for (const a of aliases) if (!have.includes(a)) have.push(a);
  cols[aliasCol] = have.join(',');
  text = text.replace(re, () => cols.join('|').replace(/\|+$/, '') + m[2]);
  await writeFile(path, text, 'utf8');
  console.log(`${name}: aliases now [${have.join(', ')}]`);
  done = true;
  break;
}
if (!done) console.log(`?? row "${name}|" not found`);
