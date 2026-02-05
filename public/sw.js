self.addEventListener('install', (event) => {
    console.log("Service worker instalado");
});

self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
