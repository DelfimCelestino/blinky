// const cacheName = "blinky-cache-beta-v5"; // Atualize a versão conforme necessário

// const installEvent = () => {
//   self.addEventListener("install", (event) => {
//     console.log("Service worker installed");
//     self.skipWaiting(); // Ativa o novo service worker imediatamente
//   });
// };
// installEvent();

// const activateEvent = () => {
//   self.addEventListener("activate", (event) => {
//     console.log("Service worker activated");
//     // Remove caches antigos
//     event.waitUntil(
//       caches.keys().then((cacheNames) => {
//         return Promise.all(
//           cacheNames.map((name) => {
//             if (name !== cacheName) {
//               console.log(`Deleting old cache: ${name}`);
//               return caches.delete(name);
//             }
//           })
//         );
//       })
//     );
//   });
// };
// activateEvent();

// const fetchEvent = () => {
//   self.addEventListener("fetch", (event) => {
//     // Verifica se a requisição é para a API
//     if (event.request.url.includes("/api/")) {
//       // Para requisições de API, busca a resposta e atualiza o cache
//       event.respondWith(
//         fetch(event.request)
//           .then((response) => {
//             const responseClone = response.clone();
//             caches.open(cacheName).then((cache) => {
//               cache.put(event.request, responseClone);
//             });
//             return response;
//           })
//           .catch(() => {
//             // Se a requisição falhar, tenta retornar do cache
//             return caches.match(event.request);
//           })
//       );
//     } else {
//       // Para páginas e recursos estáticos
//       event.respondWith(
//         caches.match(event.request).then((cachedResponse) => {
//           const fetchPromise = fetch(event.request).then((response) => {
//             const responseClone = response.clone();
//             caches.open(cacheName).then((cache) => {
//               cache.put(event.request, responseClone);
//             });
//             return response;
//           });

//           // Retorna o conteúdo do cache imediatamente, e atualiza em segundo plano
//           return cachedResponse || fetchPromise;
//         })
//       );
//     }
//   });
// };
// fetchEvent();

const installEvent = () => {
  self.addEventListener("install", () => {
    console.log("service worker installed");
  });
};
installEvent();

const activateEvent = () => {
  self.addEventListener("activate", () => {
    console.log("service worker activated");
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
      tag: Date.now().toString(), // Use timestamp as a unique tag
      icon: icon,
      data: {
        url: url, // Replace with the desired URL for redirecting user to the desired page
      },
    };

    self.registration.showNotification(title, notificationOptions);
  });
};
activePush();
const cacheName = "blinky-cache-beta-v7";

const cacheClone = async (e) => {
  const res = await fetch(e.request);
  const resClone = res.clone();

  const cache = await caches.open(cacheName);
  await cache.put(e.request, resClone);

  return res;
};

const fetchEvent = () => {
  try {
    self.addEventListener("fetch", (e) => {
      e.respondWith(
        cacheClone(e)
          .catch(() => caches.match(e.request))
          .then((res) => {
            caches.open(cacheName).then((cache) => {
              cache.keys().then((keys) => {
                if (keys.length > 0) {
                  console.log("pages cached done");
                }
              });
            });
            return res;
          })
      );
    });
  } catch (error) {
    alert(error.message);
  }
};

fetchEvent();
