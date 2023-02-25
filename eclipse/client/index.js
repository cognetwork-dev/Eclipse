import "./ec.js"
import fetch from "./api/fetch.js"

window.$ec.api.fetch = window.fetch.bind(window)
window.fetch = fetch