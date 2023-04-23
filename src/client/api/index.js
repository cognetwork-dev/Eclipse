import fetch from "./fetch.js"
import ecWindow from "./ecWindow.js"
import ecLocation from "./ecLocation.js"

var api = {
    "fetch": fetch,
    "window": ecWindow,
    "location": ecLocation
}

export { api as default };