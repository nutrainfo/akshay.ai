/* FinCalc Pro — Service Worker
   Strategy: Cache-first for static assets, network-first for API/market data.
   Update cache version to force refresh on deploy. */

const CACHE_VERSION = 'fincalc-v19';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DATA_CACHE   = `${CACHE_VERSION}-data`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/calculators/formulas.js',
  '/calculators/extra-calculators.js',
  '/calculators/extra-calculators-2.js',
  '/calculators/tax-calculators.js',
  '/pwa.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap',
];

/* ---- Install: pre-cache static shell ---- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

/* ---- Activate: remove stale caches ---- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('fincalc-') && key !== STATIC_CACHE && key !== DATA_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ---- Fetch: cache-first static, network-first API ---- */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET and cross-origin non-font requests */
  if (request.method !== 'GET') return;

  /* Network-first for API endpoints */
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/health')) {
    event.respondWith(networkFirst(request, DATA_CACHE, 10000));
    return;
  }

  /* Cache-first for everything else (static assets, fonts) */
  event.respondWith(cacheFirst(request, STATIC_CACHE));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    /* Offline fallback for navigation requests */
    if (request.mode === 'navigate') {
      const cached = await caches.match('/index.html');
      return cached || new Response('Offline — open FinCalc Pro when connected.', { status: 503 });
    }
    return new Response('', { status: 503 });
  }
}

async function networkFirst(request, cacheName, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeout);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    clearTimeout(timeout);
    const cached = await caches.match(request);
    return cached || new Response(JSON.stringify({ ok: false, error: 'Offline' }), {
      status: 503, headers: { 'Content-Type': 'application/json' }
    });
  }
}
