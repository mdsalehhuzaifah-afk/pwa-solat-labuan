self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => self.clients.claim());

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.open("solat").then(c =>
      c.match(e.request).then(r =>
        r || fetch(e.request).then(res => {
          c.put(e.request,res.clone());
          return res;
        })
      )
    )
  );
});