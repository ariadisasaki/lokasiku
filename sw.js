const CACHE="myloc-v2";

self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open(CACHE).then(cache=>{
      return cache.addAll([
        "/",
        "/index.html",
        "/css/style.css",
        "/js/app.js",
        "/js/map.js",
        "/js/location.js"
      ]);
    })
  );
});
