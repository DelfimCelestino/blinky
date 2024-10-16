const cacheName = "blinky-cache-beta";

const installEvent = () => {
  self.addEventListener("install", (event) => {
    console.log("Service worker installed");
    // Skip waiting to activate this service worker immediately
    self.skipWaiting();
  });
};
installEvent();

const activateEvent = () => {
  self.addEventListener("activate", (event) => {
    console.log("Service worker activated");
    // Remove old caches if necessary
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== cacheName) {
              console.log(`Deleting old cache: ${name}`);
              return caches.delete(name);
            }
          })
        );
      })
    );
  });
};
activateEvent();

const activePush = () => {
  self.addEventListener("push", (event) => {
    console.log("Push received", event);
    const data = event.data.json();
    const title = data.title;
    const body = data.body;
    const icon = data.icon;
    const url = data.data.url;

    const notificationOptions = {
      body: body,
      tag: Date.now().toString(),
      icon: icon,
      data: { url: url },
    };

    self.registration.showNotification(title, notificationOptions);
  });
};
activePush();

const fetchEvent = () => {
  self.addEventListener("fetch", (event) => {
    // Verifica se a requisição é para a API
    if (event.request.url.includes("/api/")) {
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            // Cache a nova resposta para futuras requisições
            const responseClone = response.clone();
            caches.open(cacheName).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(() => {
            // Se a requisição falhar, tenta retornar do cache
            return caches.match(event.request);
          })
      );
    } else {
      // Para páginas e recursos estáticos
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          return (
            cachedResponse ||
            fetch(event.request).then((response) => {
              const responseClone = response.clone();
              caches.open(cacheName).then((cache) => {
                cache.put(event.request, responseClone);
              });
              return response;
            })
          );
        })
      );
    }
  });
};
fetchEvent();
