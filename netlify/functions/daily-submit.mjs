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
    return json(req, result.status, result.body);
  } catch (error) {
    console.error('daily-submit', error);
    return json(req, 500, { error: 'server' });
  }
};
