const https = require('https');

// streamed.pk category → ESPN scoreboard paths (site.api.espn.com/.../{path}/scoreboard).
// Only team-vs-team leagues — non-team feeds (golf leaderboards, tennis, MMA) have a
// different JSON shape and are out of scope. Unmapped categories return no events, so
// the frontend silently falls back to its time heuristic.
const ESPN_LEAGUES = {
  basketball:          ['basketball/nba', 'basketball/wnba'],
  'american-football': ['football/nfl', 'football/college-football'],
  hockey:              ['hockey/nhl'],
  baseball:            ['baseball/mlb'],
  football:            ['soccer/eng.1', 'soccer/esp.1', 'soccer/ita.1', 'soccer/ger.1',
                        'soccer/fra.1', 'soccer/usa.1', 'soccer/uefa.champions', 'soccer/uefa.europa',
                        'soccer/fifa.world', 'soccer/uefa.euro', 'soccer/conmebol.copa_america'],
};

// Tiny in-memory cache (per warm container) keyed by category, 30s TTL — bounds the
// number of upstream ESPN requests when several clients poll.
const TTL = 30 * 1000;
const cache = new Map(); // category → { at, body }

function getJson(url) {
  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try { resolve(JSON.parse(data)); }
          catch { resolve(null); }
        });
      }
    );
    req.on('error', () => resolve(null));   // tolerate a single league failing
    req.end();
  });
}

const team = (t) => ({
  name: t?.displayName || '',
  short: t?.shortDisplayName || '',
  abbr: t?.abbreviation || '',
});

// Flatten one ESPN scoreboard payload into our compact records.
function normalize(payload) {
  const events = Array.isArray(payload?.events) ? payload.events : [];
  const out = [];
  for (const ev of events) {
    const comp = ev?.competitions?.[0];
    const competitors = comp?.competitors || [];
    const home = competitors.find((c) => c.homeAway === 'home');
    const away = competitors.find((c) => c.homeAway === 'away');
    if (!home || !away) continue;
    const type = ev?.status?.type || {};
    out.push({
      date: Date.parse(ev.date) || 0,
      home: team(home.team),
      away: team(away.team),
      homeScore: Number(home.score),
      awayScore: Number(away.score),
      state: type.state || 'pre',         // 'pre' | 'in' | 'post'
      completed: !!type.completed,
      detail: type.shortDetail || '',     // "Bot 9th" / "78'" / "Final"
    });
  }
  return out;
}

exports.handler = async function (event) {
  // Path: /api/scores/{category}
  const category = (event.path || '').split('/').filter(Boolean).pop() || '';
  const leagues = ESPN_LEAGUES[category];

  const ok = (body) => ({
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=30',
    },
    body,
  });

  // Unmapped category → no scores (frontend keeps its heuristic).
  if (!leagues) return ok(JSON.stringify({ events: [] }));

  const hit = cache.get(category);
  if (hit && Date.now() - hit.at < TTL) return ok(hit.body);

  const payloads = await Promise.all(
    leagues.map((path) => getJson(`https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard`))
  );
  const events = payloads.flatMap((p) => (p ? normalize(p) : []));
  const body = JSON.stringify({ events });
  cache.set(category, { at: Date.now(), body });
  return ok(body);
};
