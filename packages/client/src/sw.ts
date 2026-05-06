/// <reference lib="webworker" />

// Service worker for offline-first loading.
// Precache list is injected by vite-plugin-pwa (injectManifest).

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision?: string }>
}

const PRECACHE_NAME = 'sb-precache-v1'
const RUNTIME_NAME = 'sb-runtime-v1'

const precacheUrls = (self.__WB_MANIFEST || [])
  .map(entry => entry.url)
  .filter(url => url && !url.startsWith('http'))

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE_NAME)
      await cache.addAll(precacheUrls)
      await self.skipWaiting()
    })()
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter(
            key =>
              key.startsWith('sb-') &&
              ![PRECACHE_NAME, RUNTIME_NAME].includes(key)
          )
          .map(key => caches.delete(key))
      )
      await self.clients.claim()
    })()
  )
})

const cacheFirst = async (request: Request): Promise<Response> => {
  const cached = await caches.match(request)
  if (cached) return cached

  const response = await fetch(request)
  const cache = await caches.open(RUNTIME_NAME)

  if (response.ok) {
    void cache.put(request, response.clone())
  }

  return response
}

const networkFirst = async (request: Request): Promise<Response> => {
  const cache = await caches.open(RUNTIME_NAME)

  try {
    const response = await fetch(request)

    if (response.ok) {
      void cache.put(request, response.clone())
    }

    return response
  } catch {
    const cached = await cache.match(request)
    if (cached) return cached

    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  }
}

self.addEventListener('fetch', event => {
  const request = event.request
  if (request.method !== 'GET') return

  // Avoid "only-if-cached" exception for cross-origin requests in some browsers.
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin')
    return

  const url = new URL(request.url)

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request))
    return
  }

  // Let Vite dev client/HMR bypass caching.
  if (
    url.pathname.startsWith('/@vite') ||
    url.pathname.startsWith('/@react-refresh')
  ) {
    return
  }

  // SPA navigation: serve cached app shell when offline.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request))
    return
  }

  // API/data requests (fetch/XHR) -> network first, fallback to cache.
  if (request.destination === '') {
    event.respondWith(networkFirst(request))
    return
  }

  // Static assets -> cache first.
  event.respondWith(cacheFirst(request))
})

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

export {}
