// node append-row.mjs BLOCK 'Name|mag|aliases'   -> appends a row to a data-physical.mjs block
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const path = fileURLToPath(new URL('../data-physical.mjs', import.meta.url));
const [block, row] = process.argv.slice(2);
let text = await readFile(path, 'utf8');
const EOL = text.includes('\r\n') ? '\r\n' : '\n';
const start = text.indexOf(`export const ${block} = \``);
const close = text.indexOf(`${EOL}\`;`, start);
if (start < 0 || close < 0) throw new Error('block not found');
text = text.slice(0, close) + EOL + row + text.slice(close);
await writeFile(path, text, 'utf8');
console.log(`appended to ${block}: ${row}`);
