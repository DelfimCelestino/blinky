const CACHE_NAME = "blinky-cache-beta-12"; // Increment this version when you want to update
const CACHE_VERSION = 12; // Keep this in sync with the version number in CACHE_NAME

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage(CACHE_VERSION);
  } else if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

const installEvent = () => {
  self.addEventListener("install", () => {
    console.log("service worker installed");
  });
};
installEvent();

const cacheClone = async (e) => {
  const res = await fetch(e.request);
  const resClone = res.clone();

  const cache = await caches.open(CACHE_NAME);
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
            caches.open(CACHE_NAME).then((cache) => {
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
