/* =========================================================================
   Umrah Audio Guide — service worker

   WHEN YOU UPDATE THE SITE:
   change SHELL_VERSION below (v1 -> v2 -> v3...). That is what tells every
   phone to pull the new index.html. Leave MEDIA_CACHE alone — it holds the
   audio people have already saved, and you don't want to wipe that.
   ========================================================================= */

const SHELL_VERSION = "v1";
const SHELL_CACHE = "umrah-shell-" + SHELL_VERSION;
const MEDIA_CACHE = "umrah-media-v1";

/* Files the app needs to open at all. Add any new page or icon here. */
const SHELL_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-180.png"
];

/* ---------- install: save the shell ---------- */
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    // added one by one, so a single missing file doesn't fail the whole install
    await Promise.all(SHELL_FILES.map(url => cache.add(url).catch(() => {})));
    self.skipWaiting();
  })());
});

/* ---------- activate: drop old shell versions ---------- */
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k.startsWith("umrah-shell-") && k !== SHELL_CACHE)
          .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("message", e => {
  if (e.data === "skipWaiting") self.skipWaiting();
});

/* ---------- fetch ---------- */
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  /* 1. The page itself — network first, so content updates arrive,
        falling back to the saved copy when there is no signal. */
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(SHELL_CACHE);
        cache.put("./index.html", fresh.clone());
        return fresh;
      } catch (e) {
        return (await caches.match("./index.html")) ||
               (await caches.match("./")) ||
               new Response("Offline", { status: 503 });
      }
    })());
    return;
  }

  /* 2. Audio and images — cache first. Once a part has been played or
        saved, it never costs data again. */
  if (sameOrigin && /\/(audios|images)\//.test(url.pathname)) {
    event.respondWith((async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res && (res.ok || res.status === 206)) {
        // 206 (partial) responses can't be cached — refetch the whole file quietly
        if (res.status === 200) {
          const cache = await caches.open(MEDIA_CACHE);
          cache.put(req, res.clone());
        }
      }
      return res;
    })());
    return;
  }

  /* 3. Everything else (fonts, icons) — cached copy first, refreshed quietly. */
  event.respondWith((async () => {
    const hit = await caches.match(req);
    const network = fetch(req).then(res => {
      if (res && res.status === 200) {
        caches.open(SHELL_CACHE).then(c => c.put(req, res.clone()));
      }
      return res;
    }).catch(() => hit);
    return hit || network;
  })());
});
