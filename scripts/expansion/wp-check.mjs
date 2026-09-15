/**
 * Resolve candidate Wikipedia titles: node wp-check.mjs candidates.json
 * candidates.json = { "entry-id": ["Title A", "Title B", ...], ... }
 * Prints, per id, the first candidate that is a real non-disambiguation page,
 * with its final title and description; then a JSON map id -> title.
 */
import { readFile } from 'node:fs/promises';
const cands = JSON.parse(await readFile(process.argv[2], 'utf8'));
const UA = 'Wormillion/1.0 (offline geography quiz game; data build; contact: repository issues)';
const titles = [...new Set(Object.values(cands).flat())];
const info = new Map();
for (let i = 0; i < titles.length; i += 50) {
  const batch = titles.slice(i, i + 50);
  const url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&redirects=1' +
    '&prop=description|pageprops&ppprop=disambiguation&titles=' + encodeURIComponent(batch.join('|'));
  const data = await (await fetch(url, { headers: { 'User-Agent': UA } })).json();
  const forward = new Map(batch.map((t) => [t, t]));
  for (const step of [...(data.query.normalized || []), ...(data.query.redirects || [])]) {
    for (const [from, to] of forward) if (to === step.from) forward.set(from, step.to);
  }
  const pages = new Map(data.query.pages.map((p) => [p.title, p]));
  for (const t of batch) {
    const p = pages.get(forward.get(t));
    info.set(t, {
      finalTitle: p ? p.title : forward.get(t),
      missing: !p || p.missing === true,
      disambig: Boolean(p && p.pageprops && 'disambiguation' in p.pageprops),
      description: (p && p.description) || ''
    });
  }
  await new Promise((r) => setTimeout(r, 400));
}
const out = {};
for (const [id, list] of Object.entries(cands)) {
  const hit = list.find((t) => { const r = info.get(t); return r && !r.missing && !r.disambig; });
  const rows = list.map((t) => { const r = info.get(t); return `${t} -> ${r.missing ? 'MISSING' : r.disambig ? 'DISAMBIG' : `"${r.finalTitle}" (${r.description})`}`; });
  console.log(`${id}\n    ${rows.join('\n    ')}`);
  if (hit) out[id] = info.get(hit).finalTitle;
  else console.log('    !! nothing usable');
}
console.log('\nRESOLVED ' + JSON.stringify(out, null, 1));
