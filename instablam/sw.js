self.addEventListener("install", (event) => {
  console.log("SW installed at: ", new Date().toLocaleTimeString());
  event.waitUntil(
    caches.open("version1").then((cache) => {
      console.log("hej");
      return cache.addAll([
        "index.html",
        "styles/style.css",
        "js/index.js",
        "offline.html",
        "manifest.json",
        "images/icons/icon-144x144.png",
        "images/camera-flash.svg",
        "lib/caman/caman.full.min.js",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("SW activated at: ", new Date().toLocaleDateString());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (!navigator.onLine) {
        if (response) {
          return response;
        } else {
          return caches.match(new Request("offline.html"));
        }
      } else {
        return updateCache(event.request);
      }
    })
  );
});

async function updateCache(request) {
  return fetch(request).then((response) => {
    if (response) {
      return caches.open("version1").then((cache) => {
        return cache.put(request, response.clone()).then(() => response);
      });
    }
  });
}
