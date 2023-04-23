import "./ec.js"
import api from "./api/index.js"

window.$ec.api.location = location
window.$ec.location = api.location

window.$ec.api.window = window
window.$ec.window = api.window

window.$ec.api.self = self
window.self = window.$ec.window(window.$ec.api.self)

window.$ec.api.globalThis = globalThis
window.globalThis = window.$ec.window(window.$ec.api.globalThis)

window.$ec.api.parent = parent
window.parent = window.$ec.window(window.$ec.api.parent)

window.$ec.api.frames = frames
window.frames = window.$ec.window(window.$ec.api.frames)

window.$ec.api.fetch = window.fetch.bind(window)
window.fetch = api.fetch