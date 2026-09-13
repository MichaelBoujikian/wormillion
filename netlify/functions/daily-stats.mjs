/**
 * GET /.netlify/functions/daily-stats?day=YYYY-MM-DD
 * The day's aggregate (count, histograms, per-round) plus its prompts.
 * Cached for a minute at the edge: the numbers move slowly and every
 * finished daily fetches this once.
 */
import { api, json, preflight } from './lib/netlify.mjs';

export default async (req) => {
  if (req.method === 'OPTIONS') return preflight(req);
  if (req.method !== 'GET') return json(req, 405, { error: 'GET only' });
  const day = new URL(req.url).searchParams.get('day');
  try {
    const result = await api().stats(day);
    return json(req, result.status, result.body, result.status === 200 ? 'public, max-age=60' : 'no-store');
  } catch (error) {
    console.error('daily-stats', error);
    return json(req, 500, { error: 'server' });
  }
};
