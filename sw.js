const CACHE_NAME = 'clean-dodge-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './sw.js'
  // ha külső asseteket adsz (képek, fontok), add ide is
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map(k => {
        if (k !== CACHE_NAME) return caches.delete(k);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  // network-first for start_url, cache-first for others
  if (evt.request.mode === 'navigate') {
    evt.respondWith(
      fetch(evt.request).catch(() => caches.match('./'))
    );
    return;
  }
  evt.respondWith(
    caches.match(evt.request).then((resp) => resp || fetch(evt.request).catch(()=>resp))
  );
});