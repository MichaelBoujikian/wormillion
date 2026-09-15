// node add-oceans.mjs oceans.json   ({ "note": "...", "overrides": { "island-x": ["Atlantic"], ... } })
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const path = fileURLToPath(new URL('../data-oceans.mjs', import.meta.url));
const { note, overrides } = JSON.parse(await readFile(process.argv[2], 'utf8'));
let text = await readFile(path, 'utf8');
const EOL = text.includes('\r\n') ? '\r\n' : '\n';
const anchor = "'sea_ocean-arctic-ocean': ['Arctic']";
const at = text.indexOf(anchor);
if (at < 0) throw new Error('anchor not found');
const lines = Object.entries(overrides).filter(([id]) => !text.includes(`'${id}'`))
  .map(([id, oceans]) => `  '${id}': [${oceans.map((o) => `'${o}'`).join(', ')}]`);
const insertion = `,${EOL}${EOL}  // --- ${note} ---${EOL}` + lines.join(`,${EOL}`);
text = text.slice(0, at + anchor.length) + insertion + text.slice(at + anchor.length);
await writeFile(path, text, 'utf8');
console.log(`added ${lines.length} ocean override(s)`);
