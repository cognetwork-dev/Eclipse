import EclipseWorker from './worker.js'

self.addEventListener("fetch", function(e) {
    e.respondWith(EclipseWorker(e))
})