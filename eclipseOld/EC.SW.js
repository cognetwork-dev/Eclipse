import EclipseWorker from './EC.WORKER.js'

self.addEventListener("fetch", function(e) {
    e.respondWith(EclipseWorker(e))
})