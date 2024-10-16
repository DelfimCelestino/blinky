const cacheName = "blinky-cache-beta-v4"; // Atualize a versão conforme necessário

const installEvent = () => {
  self.addEventListener("install", (event) => {
    console.log("Service worker installed");
    self.skipWaiting(); // Ativa o novo service worker imediatamente
  });
};
installEvent();

const activateEvent = () => {
  self.addEventListener("activate", (event) => {
    console.log("Service worker activated");
    // Remove caches antigos
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

const fetchEvent = () => {
  self.addEventListener("fetch", (event) => {
    // Verifica se a requisição é para a API
    if (event.request.url.includes("/api/")) {
      // Para requisições de API, busca a resposta e atualiza o cache
      event.respondWith(
        fetch(event.request)
          .then((response) => {
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
          const fetchPromise = fetch(event.request).then((response) => {
            const responseClone = response.clone();
            caches.open(cacheName).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          });

          // Retorna o conteúdo do cache imediatamente, e atualiza em segundo plano
          return cachedResponse || fetchPromise;
        })
      );
    }
  });
};
fetchEvent();
