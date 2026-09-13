/**
 * POST /.netlify/functions/daily-submit
 *   { day: "YYYY-MM-DD", playerId, rounds: (string|null)[15], draw? }
 * The server replays the answers and scores them itself (lib/daily.js).
 */
import { api, json, preflight } from './lib/netlify.mjs';

export default async (req) => {
  if (req.method === 'OPTIONS') return preflight(req);
  if (req.method !== 'POST') return json(req, 405, { error: 'POST only' });
  let body;
  try {
    body = await req.json();
  } catch {
    return json(req, 400, { error: 'invalid body' });
  }
  try {
    const result = await api().submit(body);
    // A rejected submission is worth a line in the function log: it is
    // either a bug in the replay or someone poking the endpoint.
    if (result.status >= 400) console.warn('daily-submit', result.status, result.body.error, body.day, body.playerId);
    return json(req, result.status, result.body);
  } catch (error) {
    console.error('daily-submit', error);
    return json(req, 500, { error: 'server' });
  }
};
