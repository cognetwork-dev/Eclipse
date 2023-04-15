import "./ec.js"
import api from "./api/index.js"

window.$ec.api.fetch = window.fetch.bind(window)
window.fetch = api.fetch