# StreamWatch — Claude Code Handoff

Sports streaming frontend hosted on Netlify. Pulls match data from streamed.pk's public JSON API (via a Netlify proxy for CORS) and embeds the streams **directly from embed.st** in a clean UI with multiview support.

---

## Quick Start (read this first if you're new to this project)

**What it is:** a static, no-build single-page app — two HTML files (`index.html` = match browser, `multiview.html` = 1–6 stream grid) with all CSS/JS inline, plus three Netlify Functions in `netlify/functions/` that proxy external APIs. There is **no framework, no bundler, no `package.json`** — you edit the HTML files directly. A third page, `iptv.html`, is an **A/B fork** on a different data source — see *iptv.html — IPTV-org Fork (A/B test)* below.

**Where it lives:** production is **`pablogames.netlify.app`**. The working directory **is now a git repo** tracking [`Pablomx2/streamwatch`](https://github.com/Pablomx2/streamwatch) on `origin/main` — develop here, commit, and `git push origin main` as normal. A `… - BACKUP/` sibling folder on the Desktop is a manual snapshot of an earlier (pre-git) version.

**Two deploys, not one — they don't auto-sync with each other:**
- **GitHub Pages** (`https://pablomx2.github.io/streamwatch/`) auto-rebuilds on every push to `main`. This is the fastest way to see a change live and needs no manual step.
- **Netlify** (`pablogames.netlify.app`, the primary/production site) is **still manual drag-and-drop** — it is not connected to the GitHub repo. Pushing to git does **not** update it; after pushing, also drag the whole folder onto the Netlify dashboard if you want production to pick up the change.

**Run it locally:**
```bash
netlify dev            # serves the HTML AND the /api/* functions (needed for live scores)
```
A plain static server (e.g. `python3 -m http.server`) is enough to see the UI and play streams (on `localhost` the match-data API hits streamed.pk directly), **but `/api/scores/*` is a function** — without `netlify dev` it 404s. On `localhost` this just falls back to the time-based heuristic (like Netlify without `dev`); on the GitHub Pages mirror it instead calls ESPN directly — see *Local Development* below.

**Deploy:**
- **GitHub Pages:** `git push origin main` — that's it, Pages rebuilds itself.
- **Netlify:** drag the whole folder onto the Netlify dashboard. `netlify.toml` wires the `/api/*` redirects to the functions. **Always verify on the bare `pablogames.netlify.app`**, never a `<hash>--pablogames.netlify.app` preview (those are frozen snapshots).

**Verifying changes in this sandbox:** the preview/dev server may be blocked by the sandbox (Python's `http.server` hits a `PermissionError`). When you can't run a browser, the static fallbacks are: `grep` for any leftover references to identifiers you removed, and syntax-check the inline script with JavaScriptCore — `jsc /tmp/extracted.js`; a `SyntaxError` means broken JS, a `ReferenceError: window` means it parsed fine and started running.

**Hard constraints that look like bugs but aren't** (full detail in *Known Limitations*): no server-side **ad stripping**, no **in-app cast-to-TV** (removed — Chromecast can't load the embed; use Chrome's native *Cast tab* / tab-mirroring), **mute unloads** the stream (can't touch cross-origin audio), and **live status is inferred** except for ESPN-covered leagues (the API has no clock/score field). Don't "fix" these by re-adding an embed proxy, a sandbox, or a Presentation-API cast button — each has been tried and breaks the player.

---

> **Architecture note (why no embed proxy):** Earlier versions proxied embed.st pages through a Netlify function (`embed.js`) to strip ads. This was removed because it **does not work** — the embed.st player is location-aware (it reads `window.location` to find its stream) and has **anti-sandbox detection** (renders "Remove sandbox attributes on the iframe tag" and refuses to play). Serving its HTML from our domain feeds it the wrong path/origin → black screen. The fix is to frame `https://embed.st/embed/...` **directly**, which is how the upstream site does it. Trade-off: no server-side ad stripping, but the browser already blocks top-nav redirects from a cross-origin iframe and applies its popup-blocker to `window.open`.

---

## File Structure

```
/
├── index.html                    # Main SPA — match browser
├── multiview.html                # Multiview grid page (1–6 streams)
├── CLAUDE.md                     # This file
├── netlify.toml                  # Redirect rules → Netlify functions
└── netlify/
    └── functions/
        ├── api.js                # Proxies streamed.pk match data API — /api/matches/* (CORS fix)
        ├── stream.js             # Proxies the per-source stream list — /api/stream/{source}/{id}
        └── scores.js             # Aggregates ESPN scoreboards for live scores / true status — /api/scores/{category}
```

---

## How It Works

### Data flow
1. `index.html` fetches `/api/matches/all` (+ `/api/matches/live`) → `netlify/functions/api.js` → `streamed.pk`
2. On match open, it probes each source via `/api/stream/{source}/{id}` → `netlify/functions/stream.js` → `streamed.pk`, to learn which sources are live and what numbered streams they offer
3. iframe loads `https://embed.st/embed/{source}/{id}/{streamNo}` directly — embed.st runs its own player from its own origin (no proxy, no sandbox)

> **Source liveness IS detectable — via the stream-list API, not embed.st.** (Earlier docs said failover was impossible; that was wrong.) embed.st itself returns a **byte-identical 200 player shell for any id** (real or fake), so probing *it* tells you nothing. But `streamed.pk/api/stream/{source}/{id}` returns an **empty array `[]` for a source that isn't broadcasting** and a populated list when it is. Both views use that signal to dim offline source pills/buttons and auto-pick the first source that actually has a feed. (Honest limit that remains: a source whose list is non-empty but whose feed has gone idle still just spins — only visible by watching the player.)

### API endpoints (streamed.pk, all proxied through `api.js` / `stream.js`)
- `GET /api/matches/all` — all matches
- `GET /api/matches/live` — matches the server currently lists as live (used to gate the LIVE badge)
- `GET /api/matches/{sport}` — filtered by sport (basketball, football, etc.)
- `GET /api/stream/{source}/{id}` — numbered streams for one source: `{ streamNo, language, hd, viewers, embedUrl }[]`. **Empty array = that source is offline right now.**

### Match JSON shape
```json
{
  "id": "ppv-knicks-vs-spurs-2483461",
  "title": "New York Knicks vs San Antonio Spurs",
  "category": "basketball",
  "date": 1718123400000,
  "poster": "/images/poster.jpg",
  "teams": { "home": { "name": "Knicks" }, "away": { "name": "Spurs" } },
  "sources": [
    { "source": "admin", "id": "ppv-knicks-vs-spurs-2483461" },
    { "source": "echo",  "id": "ppv-knicks-vs-spurs-2483461" }
  ]
}
```

### Embed URL pattern (used directly as the iframe `src`)
```
https://embed.st/embed/{source}/{id}/{streamNo}
```
Source priority order: `admin > echo > delta > golf` (the only four sources that exist). Set in `EMBED_BASE` (index.html) and `embedUrl()` (multiview.html). `{streamNo}` is the numbered stream within a source — both views fetch the list from `/api/stream` and **auto-load the busiest (highest-viewer) stream**, defaulting to `1` if the list is unavailable. Offline sources are detected up front (empty list) and dimmed; if a non-empty source's feed has gone idle it shows the player's spinner — switch source pills.

---

## Netlify Functions

### `api.js`
- Spoofs browser headers (`Referer: https://streamed.pk/`, `Origin: https://streamed.pk`, Chrome User-Agent) so streamed.pk doesn't block the server-side request
- Returns JSON with `Access-Control-Allow-Origin: *`
- Path parsing: takes everything after the last `/` as the sport segment (so `/api/matches/all`, `/api/matches/live`, `/api/matches/{sport}` all work)

### `stream.js`
- Same header-spoofing pattern as `api.js`; proxies `streamed.pk/api/stream/{source}/{id}`
- Path parsing: takes the **last two** segments as `{source}/{id}`; returns 400 if either is missing
- The frontend treats an empty `[]` response as "this source is offline"

### `scores.js` — ESPN live scores / true status
- Path `/api/scores/{category}`. Maps the streamed.pk category → a curated list of ESPN scoreboard paths in `ESPN_LEAGUES` (NBA/WNBA, NFL/CFB, NHL, MLB, top soccer leagues). **Unmapped category → `{ "events": [] }`** (frontend keeps its heuristic).
- Fetches each mapped `site.api.espn.com/.../{path}/scoreboard` in parallel (tolerates a single league failing) and **normalizes** every `events[]` to `{ date, home/away:{name,short,abbr}, homeScore, awayScore, state('pre'|'in'|'post'), completed, detail }`. Score strings are coerced with `Number()`.
- Returns `{ events:[...] }` with `Access-Control-Allow-Origin: *` and `Cache-Control: public, max-age=30`; also a 30s in-memory cache per category (warm-container reuse) to bound ESPN calls.
- ⚠️ Only **team-vs-team** leagues — ESPN's golf/tennis/MMA feeds have a different shape and are intentionally excluded. Parsing is fully defensive (optional chaining, per-league try/catch) so an ESPN change degrades to "no scores", never a 500.

---

## Local Development

The API base auto-detects environment — it only routes through the Netlify proxy
functions when actually running on a `*.netlify.app` host; everywhere else
(`localhost`, a GitHub Pages mirror, any other static host) it hits streamed.pk
directly, since streamed.pk sends `Access-Control-Allow-Origin: *`:
```js
// index.html and multiview.html both have this
const usesNetlifyProxy = /\.netlify\.app$/.test(window.location.hostname);
const API = usesNetlifyProxy
  ? '/api/matches/all'                      // use Netlify proxy in production
  : 'https://streamed.pk/api/matches/all';  // hit streamed.pk directly elsewhere
```
`/api/scores` (ESPN live scores) is a Netlify function on the Netlify deploy, but
non-Netlify hosts don't just fall back to the heuristic — `fetchScoreEvents()` in
index.html fetches ESPN's own scoreboard API directly instead (`site.api.espn.com`
also sends `Access-Control-Allow-Origin: *`), running the same league mapping
(`ESPN_LEAGUES`) and normalization (`normalizeEspn`) client-side that
`netlify/functions/scores.js` runs server-side. Keep the two in sync if you edit
either one — the league list and event shape must match.

Embeds point straight at `https://embed.st/embed/...`, so the player works in local dev too (only the match-data API needs the Netlify proxy in production).

**This repo is also published live via GitHub Pages** at
`Pablomx2/streamwatch` → `https://pablomx2.github.io/streamwatch/`, auto-rebuilt
by GitHub on every push to `main` — match browsing, streaming, and ESPN scores
all work there via the direct-to-source calls above (streamed.pk and ESPN both
allow CORS from any origin). **`pablogames.netlify.app` remains the
primary/production site**, but it is a *separate, manually-deployed* copy — a
`git push` updates GitHub Pages only, not Netlify; see *Deploy* in Quick Start.

Run locally with Netlify CLI:
```bash
npm install -g netlify-cli
netlify dev
```

---

## index.html — Main Browser

### Key state variables
```js
let allMatches = [];       // full list from API
let activeCategory = 'all';
let searchQuery = '';
let sortMode = 'live';
```

### Three duration maps + live status (overtime-tolerant)
- **`OT_CAP`** (most generous) — the absolute "definitely over by now" cap (ms from kickoff), sized to cover realistic overtime / extra-time / delays. It's the outer backstop for **both** `isLive` and `isFinished`.
- **`SPORT_DURATION`** — the no-live-list duration estimate for *dropping a finished card* (`isFinished` → `matchEndTime`).
- **`GAME_WINDOW`** — the no-live-list regulation window for the *LIVE badge* (`isLive`).
- **`liveIds`** — a `Set` from `/api/matches/live` (the server's "live now" list), refreshed with each `loadMatches`. **This is the primary live signal**; the two duration maps above are only the fallback when `liveIds` is `null` (fetch failed).

```js
const otCap = m => m.date + (OT_CAP[m.category] ?? OT_CAP.other);

// isLive: never live past the OT cap; within it, trust the server live list (this
// keeps an OVERTIME game live past regulation); no live list → regulation window.
function isLive(match) {
  const now = Date.now();
  if (now > otCap(match)) return false;
  if (liveIds) return liveIds.has(match.id);
  const reg = GAME_WINDOW[match.category] ?? GAME_WINDOW.other;
  return now >= match.date && now <= match.date + reg;
}

// isFinished: gone past the OT cap; else keep it while the live list still has it
// (covers overtime); else fall back to the SPORT_DURATION estimate.
function isFinished(match) {
  const now = Date.now();
  if (now > otCap(match)) return true;
  if (liveIds && liveIds.has(match.id)) return false;
  return now > matchEndTime(match);
}
```
⚠️ **Why this shape?** The streamed.pk API has **no score/clock/status field** (verified — a match is only `id,title,category,date,poster,popular,teams,sources`), so liveness is inferred. Earlier the per-sport `GAME_WINDOW` hard-cut the badge at regulation — which **wrongly killed overtime games** while the broadcaster still listed them live. Now `liveIds` is trusted up to the generous `OT_CAP`, so OT games stay live; the cap still kills a feed that lingers long after the final whistle. The remaining honest limit (see Known Limitations) is the lingering-stream window between the real final whistle and the broadcaster dropping the match from `/api/matches/live`. Don't reintroduce a regulation-length hard cutoff into `isLive`/`isFinished` — it brings the overtime bug back.

### Scores / true status (ESPN) — overrides the heuristic when matched
For the leagues [`scores.js`](netlify/functions/scores.js) covers, the frontend gets **real** scores + status, which is authoritative over everything above:
- **`scoreByMatch`** — `match.id → ESPN record`, rebuilt by **`refreshScores()`** (on load + every 60s, alongside the 60s `renderGrid` and 3-min `loadMatches`). It fetches `/api/scores/{category}` for each covered category present, then matches each event to one of our matches.
- **Matching** (`matchEspn` → `teamNames`/`teamMatches`, all in `index.html`): an ESPN event matches a streamed.pk match when the dates are within **±3h** AND **both** teams correspond (normalized name equality / whole-name containment on tokens ≥4 chars, tolerating a home/away swap). Deliberately conservative — it prefers **no** score over a **wrong** one. Team names come from `match.teams.{home,away}.name`, falling back to splitting `title` on `" vs "`.
- **Override:** `const espn = m => scoreByMatch[m.id] || null;` is consulted *first* in both `isLive` (`return e.state === 'in'`) and `isFinished` (`return e.completed || e.state === 'post'`). So a matched game's status is **exact** — it fixes overtime *and* catches early finishes, overriding `OT_CAP`. No match → the heuristic above runs unchanged.
- **Render:** `renderGrid` draws a `.card-score` line (`away.abbr A – home.abbr H` + `detail` like "Top 7th"/"Final") when a record exists and `state !== 'pre'`.
- Verified end-to-end against live ESPN data: 15/15 MLB + WNBA games matched, score line renders, and a real in-progress game forced 6h past `OT_CAP` still reads live because ESPN says `in`.

### Filtering logic (`getFiltered()`)
1. Drop finished matches (`isFinished` — live-list-aware up to `OT_CAP`, else `SPORT_DURATION` estimate)
2. Filter by active sport category tab
3. Filter by search query (title, home team, away team)
4. `🔴 Live` chip → keep only `isLive(x)`; `🔥 Popular` chip → keep only `x.popular` (state: `liveOnly`, `popularOnly`)
5. Sort by selected mode: `live` (live first then chronological), `time-asc`, `time-desc`, `alpha`

### Card thumbnail
- If both `teams.home.badge` / `teams.away.badge` exist → render team crests (`badgeUrl(id)` = `https://streamed.pk/api/images/badge/{id}.webp`) as `<img class="crest">` in a `.crest-row`. Else fall back to the poster, else the sport emoji.
- ⚠️ The base `.card-thumb > img` rule (poster sizing) is intentionally a **direct-child** selector so it doesn't override `.crest` sizing. Don't change it back to `.card-thumb img`.
- `🔥` badge shown on `popular` cards in the meta row.

### Match status badges (LIVE vs PRE-LIVE)
Three render states, in priority order:
- **`● LIVE`** (red, `.thumb-live`) — `isLive(match)` (server live list, bounded by the overtime-tolerant `OT_CAP`).
- **`● PRE-LIVE`** (amber, `.thumb-prelive`) — `isPreLive(match)`: the `PRELIVE_WINDOW` (20 min) **before** kickoff, only when not already live. Live always wins.
- The faint **"Soon"** pill (`isSoon`, 30 min) is suppressed inside the pre-live window (`isSoon(m) && !prelive`), so 20–30 min out reads "Soon", inside 20 min the prominent PRE-LIVE badge takes over.

In `live` sort mode the grid ranks **live → pre-live → upcoming**, chronological within each tier. The existing 60s `renderGrid` interval rolls cards through these states on its own. The 🔴 Live filter chip stays **live-only** (does not include pre-live).

### Filter persistence + shareable URL
`syncUrl()` / `restoreState()` mirror the active filters (`cat`, `q`, `sort`, `live`, `pop`) into the address bar via `history.replaceState` (defaults omitted) so a copied URL reproduces the exact view. The active sport tab is also saved to `localStorage` (`sw:tab`). On load, `restoreState()` hydrates state with precedence **URL param > saved tab > default**, validating `cat` against the rendered tabs and `sort` against the known modes.

### Player modal (`openMatch`) — source + stream picker
1. Renders source buttons, then **probes every source in parallel** (`getStreams`, cached per source) via `/api/stream`.
2. Sources whose list is empty get the `.dead` class (dimmed + "offline" tag) — still clickable.
3. Auto-selects the **first source in priority order that has a live feed**, then auto-loads its **busiest** numbered stream.
4. The stream bar shows one button per numbered stream: `language` + `HD` tag + `👁 viewers`. Manual source/stream switching always works.
- `modalToken` cancels in-flight probes when the user closes or opens another match.

### Auto-refresh
- `setInterval(renderGrid, 60_000)` recomputes live status; `setInterval(loadMatches({silent:true}), 180_000)` re-fetches the list (and `/api/matches/live`) every 3 min. Silent refresh keeps the current grid on a transient failure and never disturbs the open modal or `multiviewStreams`.

### Multiview state
```js
let multiviewStreams = [];  // array of match objects, max 6
```
- Cards have `+` button (top-right of thumbnail) to add to multiview
- Floating tray slides up from bottom when selections > 0
- "Watch All →" opens `multiview.html?ids=id1,id2,...` in a new tab

---

## multiview.html — Multiview Grid

### Grid layout (CSS, driven by `data-n` attribute)
| Streams | Layout |
|---------|--------|
| 1 | Full width |
| 2 | 2 columns, 1 row |
| 3 | 3 columns, 1 row |
| 4 | 2×2 |
| 5 | 6-column grid: first 3 span 2 cols, last 2 span 3 cols |
| 6 | 3×2 |

Manual layout override via data-layout attribute: `1x1`, `1x2`, `2x2`, `2x3`

### Cell lifecycle
1. Cell renders with placeholder ("▶ Load stream") + persistent title tag — requires user click before iframe loads (fixes browser autoplay policy)
2. On click: `autoLoad(cell)` probes all sources in parallel, dims offline ones (`deadSources`), and loads the **first live source's busiest stream** (`d.srcIndex`, `d.streamNo` held in `cellData`)
3. Hover reveals per-cell controls — source pills (offline ones dimmed), then a second row of **numbered-stream pills** (`language` + `HD`), then reload/mute/solo/close
4. `selectSource(cell, i)` handles manual source switches (clicking a source pill); `loadIframe` always reads `d.streamNo`, so reload / mute / Stop-All resume all restore the *chosen* stream, not `/1`

### Master control bar (top of page, auto-hides after 4s)
- **↺ Reload** — reloads all loaded iframes
- **🔇 Mute All** — truly silences each loaded view by unloading its iframe (see `setCellSilenced`); Unmute All reloads them. The muted view's video pauses while silenced — unavoidable, since browsers don't allow muting a cross-origin frame's audio any other way.
- **⏹ Stop All** — removes all iframes to free bandwidth; Resume restores them (skips views you've individually muted)
- **Layout picker** — A/1/2/4/6 slot overrides
- **🔗 Share** — copies a shareable link (`buildShareUrl()`) to the clipboard. The link is built from the cells **actually open now** (closed cells are excluded) plus the chosen layout → `multiview.html?ids=...&layout=2x2` (`layout` omitted when auto). Falls back to a `prompt()` when `navigator.clipboard` is unavailable (insecure context). The address bar is kept in sync on layout change and cell close, and `?layout` is restored on load (validated against `1x1/1x2/2x2/2x3`).
- **✕ Clear All** — confirms, returns to index.html

### Per-cell controls (hover to show, top bar only)
Row 1: Source pills (offline = dimmed/strikethrough) · ↺ Reload · 🔇 Mute · 🔊 Solo · × Close
Row 2: Numbered-stream pills (`language` + `HD`) for the active source — only when it has >1 stream

- **🔊 Solo** (`soloCell`) — silences every *other* loaded view and keeps this one playing.
- ⚠️ `setCellSilenced` finds the mute button via `.ctrl-actions .cell-action:nth-child(2)`. The stream-pill row is appended to `.ctrl-top` (full-width, wraps to its own line) **outside** `.ctrl-actions`, so the `nth-child(2)` lookup stays valid — keep mute in position 2 within `.ctrl-actions`.

Source switcher is in the top bar (not bottom) to avoid colliding with the player's native seek/volume controls.

### Keyboard shortcuts (`keydown` listener)
- `1`–`6` → fullscreen that cell · `M` → Mute/Unmute All · `F` → page fullscreen · `R` → Reload All. Ignored when a modifier key is held.

---

## iptv.html — IPTV-org Fork (A/B test)

A second, independent home page at `iptv.html`, linked from `index.html`'s header (`IPTV Beta →`) with a matching link back (`← Match streams (streamed.pk)`), so the two can be A/B tested side by side. Same visual language (dark theme, card grid, tab bar, player modal) as `index.html`, but a completely different backend and content model:

- **Data source:** [iptv-org/api](https://github.com/iptv-org/api) — fully static, CORS-open JSON (`Access-Control-Allow-Origin: *`) hosted at `iptv-org.github.io/api/*.json`. Fetched **directly from the browser on every host** (Netlify, the GitHub Pages mirror, or plain `localhost`) — no Netlify proxy function needed for this fork.
- **Fundamentally different content:** iptv-org lists **24/7 linear TV channels** (ESPN, beIN Sports, Sky Sports, regional networks, etc.), not scheduled one-off matches like streamed.pk. There's no kickoff time, score, or "finished" state — every channel with a working stream is just always shown as `● LIVE`. No multiview, no per-channel pre-live badge — none of that data exists in this API (see *ESPN schedule badge* below for the one exception).
- **Category mapping:** iptv-org has exactly **one flat `sports` category** (see `categories.json`) — it doesn't split basketball from football from hockey. `classify()` in `iptv.html` re-buckets each channel into the **same category set `index.html` uses** (`basketball`, `football`, `american-football`, `hockey`, `baseball`, `motor-sports`, `fight`, `tennis`, `rugby`, `golf`, `cricket`, `billiards`, `afl`, `darts`, `other`) by keyword-matching the channel's name/alt_names/network (e.g. `NBA`/`basketball` → basketball, `NFL` → american-football, checked *before* the generic `football|soccer` catch-all so American/Australian-football channels don't get miscategorized as soccer). Generic sports networks with no sport-specific name (e.g. a plain "ESPN") fall into `other`. Tabs are built dynamically — only categories with at least one loaded channel get a tab.
- **Beyond the pure `sports` category:** a few Spanish-language broadcasters that carry heavy live sports (Liga MX, boxing, Olympics) are tagged `general`/`entertainment`/no category at all by iptv-org rather than `sports` — verified against `channels.json` for Telemundo, TUDN, TDN, Univision, TVC Deportes. `loadChannels()` widens inclusion with a name-based allowlist (`GENERAL_SPORTS_NETWORKS` regex) for exactly these networks, while still excluding their non-sports sister feeds (`series`/`entertainment`-tagged spinoffs like "Telemundo Telenovelas Clasicas") so soap operas don't slip in.
- **Playback is fundamentally different too:** streamed.pk/embed.st streams are framed as an iframe pointed at `embed.st`. iptv-org's `streams.json` gives **raw `.m3u8` (HLS) URLs** directly — there's no player page to embed. `iptv.html` plays them in a plain `<video>` element via [hls.js](https://github.com/video-dev/hls.js) (loaded from jsdelivr CDN) whenever `Hls.isSupported()` is true, falling back to the native `<video src>` path only when it isn't. This is the only external script dependency anywhere in the app — every other page is 100% inline, no-build. **Don't flip that priority back to "native when `canPlayType` is truthy, else hls.js"** — some Chromium builds report a truthy `canPlayType('application/vnd.apple.mpegurl')` without actually being able to decode HLS, which silently stalls the native `<video>` forever (no error event fires, so `loadStream`'s retry chain never advances to the next source). Preferring hls.js whenever it's supported sidesteps that entirely and still works fine on real Safari.
- **CORS/mixed-content proxy is an external runtime dependency (single point of failure).** `PROXY_BASE` in `iptv.html` points at a **personal Cloudflare Worker** (`https://rough-field-e808.pablomx2.workers.dev`, source `cloudflare-worker.js` in the `streamwatch-iptv` repo). `loadStream` routes a stream through it on the direct→proxy retry step to rescue two classes of otherwise-dead streams: (1) manifests that lock `Access-Control-Allow-Origin` to their own domain (common with Pluto TV / `jmp2.uk` re-broadcasts — verified live: Bellator MMA, CBS Sports HQ play only via the proxy), and (2) plain `http://` streams blocked as mixed content on our HTTPS deploys. **This is a live third-party dependency owned by the account holder, not part of this repo** — if that Worker is deleted, renamed, hits its Cloudflare free-tier request cap, or goes down, every proxy-rescued channel silently falls back to "dead" (the direct attempt still runs first, so non-proxied channels are unaffected). It does **not** rescue bare-IP `http://` hosts (Cloudflare Workers refuse `fetch()` to a raw IP — error 1003). Set `PROXY_BASE = ''` to disable proxying entirely (those streams just auto-skip). Keep the Worker's manifest-URI resolution in mind: it must resolve relative playlist URIs against the **final** redirected CDN URL, not the pre-redirect `jmp2.uk` URL.
- **Data joined client-side from four endpoints:** `channels.json` (metadata) + `streams.json` (playable URLs, joined by `channel` id) + `blocklist.json` (DMCA/NSFW takedowns — excluded up front) + `logos.json` (first non-feed-specific logo per channel, used as the card thumbnail). Only channels with `categories: ["sports", ...]` (or the name-based allowlist above), not `closed`, not blocklisted, and with ≥1 stream are shown. Combined payload is ~2.7MB gzipped, fetched once per page load (GitHub Pages sends `Cache-Control: max-age=600`).
- **ESPN schedule badge (category-level, not per-channel):** `iptv.html` mirrors index.html's `ESPN_LEAGUES` mapping and direct/proxy fetch pattern (`usesNetlifyProxy` → `/api/scores/{category}` on Netlify, else straight to `site.api.espn.com`) to show a `🔴 LIVE now: AWAY @ HOME` or `Next: AWAY @ HOME · time` badge on every card whose category ESPN covers (`basketball`, `american-football`, `hockey`, `baseball`, `football`). **This is a fundamentally different guarantee than index.html's score overlay** — there's no channel-to-match id here, so `refreshSchedule()` (in `iptv.html`) just picks *one* representative event per category (`pickRepresentative()`: soonest live game, else soonest upcoming) and stamps it on **every** card in that category, not just the one actually airing it. It's a "what's on in this sport today" hint, not a claim about that specific channel — the badge's `title` tooltip says so. Refreshed on load and every 60s via `setInterval(refreshSchedule, 60_000)`.
- **Known gap vs. the main version:** some public IPTV streams require a spoofed `Referer`/`User-Agent` to play, which a static frontend can't set (browsers block scripts from overriding the `Referer` header) — those streams surface the in-player error note ("try another stream below") rather than failing silently. There's also no multiview equivalent for this fork yet.

---

## Known Limitations

- **Mute pauses the video** — a web page cannot touch a cross-origin iframe's audio, so the only real silence is to unload the stream. Muting therefore stops that view's video too; unmuting reloads it from live. (The player's own in-frame mute button still works if you want audio off without stopping the video.)
- **Stop All doesn't save position** — reloading a stopped stream starts from live.
- **No in-app "cast to TV" — there can't be (don't re-add the button).** An earlier version had a 📺 "Watch on TV" / "Cast" button that called `new PresentationRequest([url]).start()`. That hands the Chromecast a URL and makes the *receiver* load the page itself — where embed.st refuses to play for the exact reasons in the "why no embed proxy" note (location-aware + anti-sandbox/anti-bot + no real user gesture), so the TV showed the player's dead play button. No programmatic path works: receiver-load is blocked, and Remote Playback / the Cast SDK need a same-origin `<video>` or a raw HLS URL we don't have. The button was removed. **The only way to watch on a TV is the user's browser: Chrome ⋮ → Cast… → Sources → "Cast tab" (tab mirroring) — the computer decodes and the TV mirrors the already-playing video. That can't be triggered from JS, so it stays a manual browser action.**
- **No ad stripping (not fixable from our side).** Streams are framed directly from embed.st because proxying/sandboxing breaks the player, so in-player ads can't be removed. Extracting the raw HLS URL to build our own ad-free player isn't viable either: the embed page ships ~618 KB of **runtime-obfuscated JS** (all strings decoded at execution) that resolves the feed via Clappr/JW inside the cross-origin frame — nothing static to grab. The browser still blocks top-nav redirects from a cross-origin iframe and popup-blocks `window.open`, containing the worst pop/redirect ads. **Real ad removal is user-side only: uBlock Origin in the browser, or a network blocklist (NextDNS / Pi-hole).**
- **Offline sources are detected; idle feeds are not.** A source that isn't broadcasting returns an empty `/api/stream` list → we dim it and auto-skip it. But a source whose list is non-empty while its feed has stalled still shows the player's spinner with no error — that's only visible by watching the player. Switch sources via the pills.
- **Live status is exact for ESPN-covered leagues, inferred elsewhere.** Where `scores.js` matches a game (major team-sport leagues — see *Scores / true status*), ESPN's `state` drives `isLive`/`isFinished` precisely (catches overtime *and* early finishes). Everywhere else (niche sports, uncovered soccer leagues, or any game `matchEspn` can't confidently match) it falls back to the heuristic: `/api/matches/live` trusted up to a per-sport `OT_CAP`. The heuristic's trade-off remains for those — a feed that **lingers after** the final whistle keeps its LIVE badge until the broadcaster drops it from the live list (or `OT_CAP` elapses), and an early finish can't be caught to the minute.
- **ESPN scores: coverage + matching limits.** No darts/billiards/most fights, and only the curated soccer leagues in `ESPN_LEAGUES`. Matching is fuzzy (team-name spellings differ across providers); the ±3h + dual-team test errs toward showing **no** score rather than a wrong one, so some live games simply won't display a score. ESPN's API is undocumented and can change shape — parsing degrades to "no scores", never an error. There is **no official Google Sports API** (Google's box is licensed third-party data with no callable endpoint); ESPN was chosen as the free alternative.
- **A shared multiview link only resurfaces matches still listed by the API.** `?ids=` holds public streamed.pk match ids (no auth/privacy concern), but once a game finishes and drops off `/api/matches/all`, its cell loads empty. Share links are best used for matches that are live or upcoming.

---

## Deployment

Two independent deploys, both sourced from this same working directory — **pushing to git only updates GitHub Pages, not Netlify**:

1. **GitHub Pages** (`https://pablomx2.github.io/streamwatch/`) — `git push origin main` and GitHub rebuilds it automatically. No functions run here; the frontend calls streamed.pk/ESPN directly (see *Local Development*).
2. **Netlify** (`pablogames.netlify.app`, **primary/production**) — still manual: drag the whole folder onto the Netlify dashboard after your changes are ready. `netlify.toml` wires the `/api/*` redirects to the functions, which only run on Netlify:

```toml
[[redirects]]
  from = "/api/matches/*"          # → api.js   (match lists, incl. /api/matches/live)
  to   = "/.netlify/functions/api/:splat"
  status = 200, force = true
[[redirects]]
  from = "/api/stream/*"           # → stream.js (per-source numbered stream list)
  to   = "/.netlify/functions/stream/:splat"
  status = 200, force = true
[[redirects]]
  from = "/api/scores/*"           # → scores.js (ESPN live scores / true status by category)
  to   = "/.netlify/functions/scores/:splat"
  status = 200, force = true
```

> **Local dev:** match data works on a bare static server (it hits streamed.pk directly on `localhost`), but **scores need `netlify dev`** — `/api/scores/*` is a function, so a plain file server returns 404 there. On `localhost` that just falls back to the time heuristic; it's only the GitHub Pages mirror that instead calls ESPN directly (see *Local Development*).

> Drag-and-drop deploys: drag the **whole folder**. Functions deploy via the `[functions]` dir in `netlify.toml`. Always verify on the bare domain `pablogames.netlify.app` — never a `<hash>--pablogames.netlify.app` preview (those are frozen snapshots of a single drop).

---

## Potential Next Steps

- [x] ~~Auto-refresh match list without losing multiview selection~~
- [x] ~~Team logos on cards · Live/Popular filters · keyboard shortcuts · solo audio~~
- [x] ~~Auto-failover between sources~~ — done via the `/api/stream` empty-array signal (offline sources dimmed + skipped in both views)
- [x] ~~Numbered-stream picker (language/HD/viewers, busiest auto-select) in both views~~
- [x] ~~Accurate LIVE badge via `/api/matches/live` + `GAME_WINDOW`~~
- [x] ~~Overtime-tolerant live status — trust the live list up to a per-sport `OT_CAP` so OT games keep their badge / stay on the grid~~
- [x] ~~Live scores + true status via ESPN (`scores.js` + `scoreByMatch`) — real score on cards; `state` overrides the heuristic for covered leagues~~
- [ ] Extend ESPN scores to non-team sports (golf leaderboards, tennis, MMA — different JSON shapes)
- [x] ~~Pre-live (20-min pre-kickoff) status badge + its own sort tier~~
- [x] ~~Remember last sport tab + shareable filtered URL on the index page~~
- [x] ~~Shareable multiview link (🔗 Share — ids + layout, reflects open cells)~~
- [ ] Persistent multiview state (localStorage so selections survive page refresh)
- [ ] Picture-in-picture per cell — note: blocked for cross-origin iframes (can't reach the inner `<video>`)
- [ ] ~~Dark/light mode toggle~~ — considered, intentionally dropped (app stays dark-only)
- [ ] Service worker for offline caching of match list
- [x] ~~Move development into git (`Pablomx2/streamwatch`) and publish a GitHub Pages mirror~~ — working directory now tracks `origin/main`; GitHub Pages auto-deploys on push, Netlify stays manual drag-and-drop (see *Deployment*)
