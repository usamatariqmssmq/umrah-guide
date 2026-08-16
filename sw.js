/* =========================================================================
   Umrah Audio Guide — service worker  (v2)

   v2 fix: audio players ask for byte ranges, not whole files. A cached
   file handed back whole makes playback fail offline, so ranges are now
   sliced out of the saved copy and returned as proper 206 responses.

   WHEN YOU UPDATE THE SITE:
   change SHELL_VERSION below (v2 -> v3 -> v4...). That is what tells every
   phone to pull the new index.html. Leave MEDIA_CACHE alone — it holds the
   audio people have already saved, and you don't want to wipe that.
   ========================================================================= */

const SHELL_VERSION = "v2";
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

/* =========================================================================
   Media: keep ONE whole copy of each file, then serve whatever slice of
   it the player asks for.
   ========================================================================= */
async function serveMedia(request) {
  const cache = await caches.open(MEDIA_CACHE);
  const url = request.url;

  let saved = await cache.match(url);

  if (!saved) {
    // fetch(url) instead of fetch(request) — a bare URL sends no Range
    // header, so the server returns the complete 200 file we can store.
    let fresh;
    try {
      fresh = await fetch(url);
    } catch (e) {
      return new Response("This file is not saved on this device.", {
        status: 504, statusText: "Not saved offline"
      });
    }
    if (fresh && fresh.status === 200) {
      try { await cache.put(url, fresh.clone()); } catch (e) {}
      saved = await cache.match(url);
    }
    if (!saved) return fresh;
  }

  const range = request.headers.get("range");
  if (!range) return saved;                     // images and full-file requests

  const buffer = await saved.arrayBuffer();
  const total = buffer.byteLength;

  const match = /bytes=(\d*)-(\d*)/.exec(range);
  let start = match && match[1] ? parseInt(match[1], 10) : 0;
  let end = match && match[2] ? parseInt(match[2], 10) : total - 1;

  if (isNaN(start) || start < 0) start = 0;
  if (isNaN(end) || end >= total) end = total - 1;
  if (start > end) start = 0;

  const slice = buffer.slice(start, end + 1);

  return new Response(slice, {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type": saved.headers.get("Content-Type") || "application/octet-stream",
      "Content-Length": String(slice.byteLength),
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-cache"
    }
  });
}

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

  /* 2. Audio and images — saved copy first, byte ranges handled properly. */
  if (sameOrigin && /\/(audios|images)\//.test(url.pathname)) {
    event.respondWith(serveMedia(req));
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
