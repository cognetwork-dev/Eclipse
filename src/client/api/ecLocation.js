function ecLocation(frame = window) {
    if (!frame.location) {
        return frame;
    }

    class Location {
        get hash() {
            return frame.location.hash
        }
        set hash(value) {
            return frame.location.hash = value
        }
        get host() {
            return frame.location.host
        }
        set host(value) {
            return frame.location.host = value
        }
        get hostname() {
            return frame.location.host
        }
        set hostname(value) {
            return frame.location.hostname = value
        }
        get href() {
            return "got: " + frame.location.href
        }
        set href(value) {
            return frame.location.href = value
        }
        get origin() {
            return frame.location.origin
        }
        set origin(value) {
            return frame.location.origin = value
        }
        get pathname() {
            return frame.location.pathname
        }
        set pathname(value) {
            return frame.location.pathname = value
        }
        get port() {
            return frame.location.port
        }
        set port(value) {
            return frame.location.port = value
        }
        get protocol() {
            return frame.location.protocol
        }
        set protocol(value) {
            return frame.location.protocol = value
        }
        get search() {
            return frame.location.search
        }
        set search(value) {
            return frame.location.search = value
        }
        get ancestorOrigins() {
            var ancestorOrigins = Array.from(frame.location["ancestorOrigins"])
            for (let url in ancestorOrigins) {
                if (typeof ancestorOrigins[url] == "string") {
                    ancestorOrigins[url] = ancestorOrigins[url]
                }
            }
            return ancestorOrigins
        }
        set ancestorOrigins(value) {
            return value
        }
        assign(value) {
            if (value) {
                try {
                    return frame.location.assign(new URL(value, document.baseURI))
                } catch {
                    return console.error(new Error("Uncaught DOMException: Failed to execute 'assign' on 'Location': '" + value + "' is not a valid URL."))
                }
            } else {
                return console.error(new Error("Uncaught TypeError: Failed to execute 'assign' on 'Location': 1 argument required, but only 0 present."))
            }
        }
        reload() {
            return frame.location.reload()
        }
        replace(value) {
            if (value) {
                try {
                    return frame.location.replace(new URL(value, document.baseURI))
                } catch {
                    return console.error(new Error("Uncaught DOMException: Failed to execute 'replace' on 'Location': '" + value + "' is not a valid URL."))
                }
            } else {
                return console.error(new Error("Uncaught TypeError: Failed to execute 'replace' on 'Location': 1 argument required, but only 0 present."))
            }
        }
        toString() {
            return frame.location.toString()
        }
        toLocaleString() {
            return frame.location.toLocaleString()
        }
        valueOf() {
            return this
        }
    }

    return new Location()
}

export default ecLocation;