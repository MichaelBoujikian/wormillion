/**
 * Builds dist/wormillion.html: the whole game in ONE file - styles, code and the
 * full content bank inlined. Send it to anyone; they double-click it and play.
 * No install, no server, no unzip, and unlike an .exe nothing for Windows
 * SmartScreen to complain about.
 *
 *   npm run bundle
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const OUT = fileURLToPath(new URL('../dist/', import.meta.url));
const read = (relative) => readFileSync(SRC + relative, 'utf8');

let html = read('index.html');

// Inline the stylesheet.
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/, (_, href) => `<style>\n${read(href)}\n</style>`);

// Inline every script, in order. A literal "</script>" inside JS would end the
// tag early, so it is split defensively even though none exists today.
let inlined = 0;
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => {
  inlined += 1;
  return `<script>\n${read(src).replace(/<\/script/gi, '<\\/script')}\n</script>`;
});

mkdirSync(OUT, { recursive: true });
writeFileSync(OUT + 'wormillion.html', html, 'utf8');
console.log(`dist/wormillion.html - ${(html.length / 1024).toFixed(0)} KB, ${inlined} scripts inlined`);
