const CACHE_NAME = 'kiimakeppi-v1';
const ASSETS = [
  'index.html',
  'css/style.css',
  'js/engine.js',
  'js/mode_keppi.js',
  'js/mode_simpukka.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});