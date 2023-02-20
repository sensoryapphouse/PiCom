var cacheName = 'PiCom';
var filesToCache = [
  './',
  './index.html',
  './style.css',
  './sketch.js',
  './toolbar.js',
  './utilities.js',  
  './versions.js',
  './panel.js',
  './record.js',
  './settings.js',
  './settings2.js',
  './MarcTooltips.css',
  './MarcTooltips.js',
  './face.js',
  './gamepads.js',
  './gpad.js',
  './picomhelp.html',
  './idb-keyval-iife.js',
  './input.js',
    './boards/quick-core-24.obz',
    './boards/communikate-20.obz',
    './boards/communikate-12.obz',
    './boards/project-core.obz',
    './boards/project-core-SAH.obz',
    './boards/quick-core-60.obz',
    './boards/quick-core-112.obz',
    './boards/PrAACticalCore36.obz',
    './boards/PrAACticalCore24.obz',
    './boards/PrAACticalCore12.obz',
    './boards/blank.obz',
    './boards/feelings.obz',
    './boards/Yes_No_SAH.obz',
    './boards/Yes_No.obz',
    './images/board.png',
    './images/button.png',
    './images/splash.jpg',
    './images/PiComPortrait.jpg',
    './images/start.png',
    './images/settings.png',
    './images/on.svg',
    './images/off.svg',
    './images/LoadPic.png',
    './images/home.png',
    './images/help.svg',
    './images/info.svg',
    './images/backspace.png',
    './images/clear.png',
    './images/speak.png',
    './images/play.png',
    './images/trash.png',
    './images/stop.png',
    './images/record.png',
    './images/crosshairs.png',
    './images/uparrow.png',
    './images/up.png',
    './images/right.png',
    './images/left.png',
    './images/down.png',
    './images/delete.png',
    './images/colour2.png',
    './images/colours.png',
    './images/touchpad3.png',
    './images/Button_Red.png',
    './images/Button_Blue.png',
    './index/image1673974781410.png',
    './index/image1673904015920.png',
    './index/image1673978851117.png',
    './SAHsymbols.zip',
    './libraries/jszip.min.js',
    './libraries/dat.gui.min.js',
    './libraries/MarcTooltips.min.js',
    './libraries/notiflix-confirm-aio-3.2.5.min.js',
    './libraries/notiflix-loading-aio-3.2.5.min.js',
    './libraries/notiflix-notify-aio-3.2.5.min.js',
    './libraries/p5.dom.min.js',
    './libraries/p5.min.js',
    './libraries/p5.sound.min.js',
    './libraries/p5.speech.js',
    './libraries/recorder.js',
    './libraries/tinycolor-min.js',
    './libraries/jeelizFaceExpressions.js',
    './libraries/jeelizFaceExpressionsNNC.json'
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
