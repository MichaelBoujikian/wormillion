/**
 * What the two daily functions share: the Blobs store behind lib/daily.js's
 * store interface, the bank loaded once per warm function, and CORS for the
 * origins the game is served from.
 */
import { getStore } from '@netlify/blobs';
import daily from './daily.js';

// The game is served from Netlify itself (same origin) and from GitHub
// Pages; the dev server is here for `npm start` against a deployed API.
const ALLOWED_ORIGINS = new Set(['https://michaelboujikian.github.io', 'http://localhost:8123']);

let bank = null;
export function bankOnce() {
  if (!bank) bank = daily.loadBank();
  return bank;
}

/**
 * Netlify Blobs as lib/daily.js's store: getWithEtag / set / list. Strong
 * consistency, not the eventual default: the aggregate is read, changed and
 * written back against its etag, and a stale read there means a lost
 * update; and the stats a player fetches right after submitting should
 * include them.
 */
export function blobStore(store = getStore({ name: 'daily', consistency: 'strong' })) {
  return {
    async getWithEtag(key) {
      const item = await store.getWithMetadata(key, { type: 'json' });
      return item ? { data: item.data, etag: item.etag } : null;
    },
    async set(key, data, opts = {}) {
      const conditions = opts.onlyIfNew ? { onlyIfNew: true } : opts.onlyIfMatch !== undefined ? { onlyIfMatch: opts.onlyIfMatch } : {};
      const result = await store.setJSON(key, data, conditions);
      return { modified: !result || result.modified !== false, etag: result && result.etag };
    },
    async list(prefix) {
      const result = await store.list({ prefix });
      return result.blobs.map((blob) => blob.key);
    }
  };
}

export function api() {
  return daily.createDailyApi({ store: blobStore(), bank: bankOnce() });
}

/** CORS headers for a request, or none when the origin isn't one of ours. */
export function corsHeaders(req) {
  const origin = req.headers.get('origin');
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return {};
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'origin'
  };
}

/** A JSON Response with CORS and the given cache policy. */
export function json(req, status, body, cache = 'no-store') {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': cache, ...corsHeaders(req) }
  });
}

export function preflight(req) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}
