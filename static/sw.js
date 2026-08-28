/**
 * Service worker for the osmos::feed reader.
 *
 * The site is a static build that is regenerated daily, so freshness matters
 * more than instant loads: navigations go to the network first and fall back
 * to the cached page only when offline. Assets are served from cache and
 * refreshed in the background.
 *
 * Bump CACHE_VERSION when the caching strategy changes; old caches are dropped
 * on activate.
 */
const CACHE_VERSION = "v1";
const SHELL_CACHE = `shell-${CACHE_VERSION}`;
const ASSET_CACHE = `assets-${CACHE_VERSION}`;
const CURRENT_CACHES = [SHELL_CACHE, ASSET_CACHE];

// Paths are relative to the worker's scope, so this works under the
// /rss/ subpath that GitHub Pages serves the site from.
const SHELL_URLS = [
  "./",
  "./index.css",
  "./index.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
];

const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      // addAll is all-or-nothing; add individually so one bad asset cannot
      // block the whole install.
      .then((cache) => Promise.all(SHELL_URLS.map((url) => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !CURRENT_CACHES.includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

/**
 * Look a request up across the caches we own, newest source first.
 *
 * Reads must not be scoped to one cache: an asset precached into the shell
 * cache is requested with a `?version` query and served through the asset
 * path, so a single-cache lookup would miss it and fail offline.
 *
 * The order matters. `caches.match()` searches in cache-creation order, which
 * puts the install-time shell copy ahead of the entry stale-while-revalidate
 * keeps refreshing, so a global match would keep serving superseded CSS and
 * JS. Checking the runtime cache first always yields the fresher copy.
 */
const CACHE_PRIORITY = [ASSET_CACHE, SHELL_CACHE];

async function matchAnyCache(request) {
  for (const cacheName of CACHE_PRIORITY) {
    const cache = await caches.open(cacheName);
    const hit = await cache.match(request, { ignoreSearch: true });
    if (hit) return hit;
  }
  return undefined;
}

/**
 * Persist a response without holding up the one being returned.
 *
 * The fetch event ends when the promise given to respondWith settles, and the
 * browser may kill the worker right after, so a cache write left running on
 * its own can be cut short. waitUntil keeps the event alive until it lands.
 */
function cacheResponse(event, cacheName, request, response) {
  const copy = response.clone();
  event.waitUntil(caches.open(cacheName).then((cache) => cache.put(request, copy)));
}

/** Network first, falling back to the cached copy when the network fails. */
async function networkFirst(event, request, cacheName, fallbackUrl) {
  try {
    const response = await fetch(request);
    if (response.ok) cacheResponse(event, cacheName, request, response);
    return response;
  } catch (error) {
    const cached = await matchAnyCache(request);
    if (cached) return cached;
    if (fallbackUrl) {
      const fallback = await matchAnyCache(new Request(new URL(fallbackUrl, self.location.href)));
      if (fallback) return fallback;
    }
    throw error;
  }
}

/** Serve from cache immediately, refreshing the entry in the background. */
async function staleWhileRevalidate(event, request, cacheName) {
  const cached = await matchAnyCache(request);
  const network = fetch(request)
    .then((response) => {
      // Opaque responses have status 0; caching them would poison the cache.
      if (response.ok) cacheResponse(event, cacheName, request, response);
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    // Nothing is awaiting the refresh once the cached copy is returned, so the
    // event has to be held open for it explicitly.
    event.waitUntil(network);
    return cached;
  }

  const response = await network;
  if (response) return response;
  throw new Error("offline and not cached");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Page loads: always try the network so new articles show up.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(event, request, SHELL_CACHE, "./"));
    return;
  }

  if (url.origin === self.location.origin) {
    // Feed data changes on every build; prefer the network for it.
    if (url.pathname.endsWith("/cache.json") || url.pathname.endsWith("/feed.atom")) {
      event.respondWith(networkFirst(event, request, ASSET_CACHE));
      return;
    }
    event.respondWith(staleWhileRevalidate(event, request, ASSET_CACHE));
    return;
  }

  // Google Fonts stylesheets and font files are versioned and stable.
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(event, request, ASSET_CACHE));
  }
});
