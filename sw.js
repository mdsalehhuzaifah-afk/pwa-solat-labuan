const CACHE_NAME = "solat-v1";

self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;

  e.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(e.request).then(res => {
        if (res) return res;

        return fetch(e.request).then(net => {
          cache.put(e.request, net.clone());
          return net;
        }).catch(() => {
          return new Response("Offline", { status: 503, statusText: "Offline" });
        });
      })
    )
  );
});
