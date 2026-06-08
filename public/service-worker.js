self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("pixfit-cache-v1").then((cache) => {
            return cache.addAll([
                "/",
                "/index.html",
                "/PixFitlogo.png",
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    // Only intercept GET requests, ignore POST/API requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached version if found, otherwise fetch from network
            return response || fetch(event.request).catch((error) => {
                // Gracefully handle network failures (like ad-blockers blocking Google Ads)
                console.warn('Service Worker fetch failed for:', event.request.url, error);
                // Return a generic fallback if needed, or just let it fail silently
                return new Response('Network error occurred', {
                    status: 408,
                    headers: { 'Content-Type': 'text/plain' },
                });
            });
        })
    );
});