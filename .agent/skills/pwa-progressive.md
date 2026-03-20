---
name: Progressive Web App (PWA)
description: PWA patterns, service workers, offline support, and app-like experiences
---

# Progressive Web App

## Manifest

```json
{
  "name": "HT Strength",
  "short_name": "HT Gym",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0A0E27",
  "theme_color": "#FF6B35",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Service Worker

```typescript
// Register
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

## Offline Support

Using Workbox:

```typescript
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache API requests
registerRoute(
  /\/api\//,
  new NetworkFirst({
    cacheName: 'api-cache'
  })
);
```

## Install Prompt

```typescript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

installButton.addEventListener('click', async () => {
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User ${outcome}`);
  deferredPrompt = null;
});
```
