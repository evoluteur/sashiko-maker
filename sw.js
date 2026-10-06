const CACHE = "sashiko-maker-v3";
const ASSETS = [
  "./",
  "css/common.css",
  "css/core.css",
  "css/densities.css",
  "css/sashiko.css",
  "css/themes/dark/bg0.png",
  "css/themes/dark/dark.css",
  "css/themes/evol-blue/evol-blue.css",
  "css/themes/evol-blue/spirals.png",
  "css/themes/light/bg0.png",
  "css/themes/light/light.css",
  "favicon.png",
  "icon-192.png",
  "icon-512.png",
  "index.html",
  "js/omg.js",
  "js/sashiko.js",
  "manifest.json",
];

self.addEventListener("install", (e) => {
  // "reload" bypasses the HTTP cache, so an update never caches stale files
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: "reload" })))),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  const cacheable =
    url.origin === location.origin ||
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com";
  if (e.request.method !== "GET" || !cacheable) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(
      (cached) =>
        cached ||
        fetch(e.request)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(e.request, copy));
            }
            return res;
          })
          .catch(() =>
            e.request.mode === "navigate" ? caches.match("index.html") : undefined,
          ),
    ),
  );
});
