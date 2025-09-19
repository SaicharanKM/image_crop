self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("pixfit-cache-v1").then((cache) => {
            return cache.addAll([
                "/",
                "/index.html",
                "/PixFitlogo.png",
                // add other static assets like CSS/JS files if needed
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
