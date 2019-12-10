//from here https://developers.google.com/web/fundamentals/primers/service-workers

var CACHE_NAME = 'dinnercalc-cache-v1';
var urlsToCache = [
'/dinner-calc/',
'/dinner-calc/favicon-48.png',
'/dinner-calc/favicon-192.png',
'/dinner-calc/favicon-512.png',
'https://cdn.jsdelivr.net/npm/ractive',
];


self.addEventListener('install', function(event) {
    // Perform install steps
    console.log("[ServiceWorker] installing...");
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('[ServiceWorker] opened cache ' + CACHE_NAME + ', adding urls...');
            return cache.addAll(urlsToCache)
            .then(function() {
                console.log('[ServiceWorker] All resources have been fetched and cached.');
                return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
            })
            .catch(function(error) {
                console.error('[ServiceWorker] Failed to cache', error);
            });

        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
                console.log("[ServiceWorker] cache hit: " + event.request.method + " " + event.request.url);
                return response;
            }
            console.log("[ServiceWorker] cache miss: " + event.request.method + " " + event.request.url);
            return fetch(event.request);
        }
        )
    );
});

//ACTIVATE EVENT: triggered once after registering, also used to clean up caches.
self.addEventListener('activate', (event) => {
    console.info('Event: Activate');

    //Remove old and unwanted caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache); //Deleting the cache
                    }
                })
            );
        })
    );
});

