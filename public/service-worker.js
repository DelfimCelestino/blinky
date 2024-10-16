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
const cacheName = "blinky-cache-beta";

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
