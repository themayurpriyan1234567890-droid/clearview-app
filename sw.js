// ClearView service worker.
// After one online visit, the app opens and exports with no internet connection.
// Bump CACHE only if you need to force every device to drop old cached files.
const CACHE = 'clearview-v1';
const BASE = self.registration.scope;               // e.g. https://<user>.github.io/clearview-app/
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Figtree:wght@400;500;600;700&display=swap';
const FONT_HOSTS = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
const SHELL = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'icon-192.png',
  BASE + 'icon-512.png'
];

// Install: store the app files, then the Google Fonts (if online right now).
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
    try { await cacheFonts(cache); } catch (e) { /* offline during install: the app falls back to system fonts */ }
    await self.skipWaiting();
  })());
});

// Activate: delete caches from older versions and take control of open pages.
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (FONT_HOSTS.includes(url.origin)) {
    event.respondWith(cacheFirst(req));
    return;
  }
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req));   // page itself: newest version when online
    return;
  }
  event.respondWith(cacheFirst(req));       // icons, manifest
});

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req, { ignoreSearch: true });
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') cache.put(req, res.clone()).catch(() => {});
  return res;
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(BASE + 'index.html', res.clone()).catch(() => {});
    return res;
  } catch (err) {
    return (await cache.match(BASE + 'index.html')) || (await cache.match(BASE)) || Response.error();
  }
}

// Save the Google Fonts stylesheet and every font file it points to.
async function cacheFonts(cache) {
  const css = await (await fetch(FONT_CSS)).text();
  await cache.put(FONT_CSS, new Response(css, { headers: { 'Content-Type': 'text/css' } }));
  const pattern = /url\(['"]?(https:\/\/fonts\.gstatic\.com[^'")]+)['"]?\)/g;
  const files = [...new Set([...css.matchAll(pattern)].map(m => m[1]))];
  await Promise.all(files.map(async url => {
    const res = await fetch(url);
    if (res.ok) await cache.put(url, res);
  }));
}
