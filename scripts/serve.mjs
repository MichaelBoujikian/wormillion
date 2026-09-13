// Dev-only static file server for src/. Not part of what ships. It also
// mounts the daily-comparison API (netlify/functions/lib/daily.js) on the
// same paths Netlify serves it at, over an in-memory store that forgets on
// restart - so the whole flow can be played locally without Netlify.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const daily = require('../netlify/functions/lib/daily.js');

const ROOT = join(fileURLToPath(new URL('../src/', import.meta.url)));
const PORT = Number(process.env.PORT || 8123);
const API = '/.netlify/functions/';
const api = daily.createDailyApi({ store: daily.memoryStore(), bank: daily.loadBank() });

const readBody = (req) =>
  new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => resolve(raw));
  });

async function serveApi(req, res, url) {
  const name = url.pathname.slice(API.length);
  let result;
  if (name === 'daily-stats' && req.method === 'GET') {
    result = await api.stats(url.searchParams.get('day'));
  } else if (name === 'daily-submit' && req.method === 'POST') {
    let body = null;
    try {
      body = JSON.parse(await readBody(req));
    } catch {
      body = null;
    }
    result = body ? await api.submit(body) : { status: 400, body: { error: 'invalid body' } };
    if (result.status >= 400) console.warn('daily-submit', result.status, result.body.error);
  } else {
    result = { status: 404, body: { error: 'no such function' } };
  }
  res.writeHead(result.status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(result.body));
}
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

createServer(async (req, res) => {
  const parsed = new URL(req.url || '/', `http://localhost:${PORT}`);
  if (parsed.pathname.startsWith(API)) {
    await serveApi(req, res, parsed);
    return;
  }
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  const rel = normalize(url === '/' ? '/index.html' : url).replace(/^[\/]+/, '');
  const file = join(ROOT, rel);
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[extname(file)] || 'application/octet-stream',
      'cache-control': 'no-store'
    }).end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('not found');
  }
}).listen(PORT, () => console.log(`wormillion dev server: http://localhost:${PORT}`));
