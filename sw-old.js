var cacheName = 'PiCom';
var filesToCache = [
  './',
  './index.html',
  './style.css',
  './sketch.js',
    './boards/quick-core-24.obz',
    './boards/communikate-20.obz',
    './boards/communikate-12.obz',
    './boards/project-core.obz',
    './boards/project-core-SAH.obz',
    './boards/quick-core-60.obz',
    './boards/quick-core-112.obz',
    './boards/PrAACtical-Core-36.obz',
    './boards/PrAACtical-Core-24.obz',
    './boards/PrAACtical-Core-12.obz',
    './boards/blank.obz',
    './boards/feelings.obz',
    './boards/Yes_No_More_Stop-SAH.obz',
    './boards/Yes_No.obz',
    './images/board.png',
    './images/button.png',
    './images/splash.jpg',
    './images/PiComPortrait.jpg',
    './images/start.png',
    './images/settings.png',
    './SAHsymbols.zip'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});
