import { codecs } from "./rewrite/index.js";

class Eclipse {
  constructor(config = {}) {
    this.prefix = config.prefix || "/service/"
    this.codec = config.codec || "plain"
    this.bare = config.bare || location.origin + "/bare/"
    
    if (!this.prefix.startsWith("/") || !this.prefix.endsWith("/")) {
      console.error("Prefix needs to start and end with /")
      console.error("Fixing prefix")

      if (!this.prefix.startsWith("/")) {
        this.prefix = "/" + this.prefix
      }

      if (!this.prefix.endsWith("/")) {
        this.prefix = this.prefix + "/"
      }
    }

    if (!codecs[this.codec]) {
      console.error("Invalid codec")
      console.error("Codec has been set to plain")

      this.codec = "plain"
    }

    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (let registration of registrations) {
        //Dev mode unregisters the service worker every time the page loads
        var devMode = true
        var prefix = config.prefix || "/service/"
          try {
            if (new URL(registration.scope).pathname.startsWith("/eclipse/")) {
              if (new URL(registration.scope).pathname !== "/eclipse" + prefix || devMode) {
                registration.unregister()
              }
            }
          } catch {
          }
      }
    })
    navigator.serviceWorker.register(location.origin + '/eclipse/EC.SW.js' + '?config=' + encodeURIComponent(JSON.stringify({prefix: "/eclipse" + this.prefix, codec: this.codec, bare: this.bare})),{scope: "/eclipse" + this.prefix})
  }
  url = function(url) {
    if (url) {
      return window.location.origin + "/eclipse" + this.prefix + codecs[this.codec].encode(url);
      } else {
      return "";
    }
  }
  search = function(url, engine) {
    if (url && engine) {
      if (!engine.includes("%s")) {
        return console.error("Search engine must include %s in place of query")
      } else {
          if (url.match(/^https?:\/\//)) {
          return url;
          } else if (url.includes('.') && !url.includes(" ")) {
          return "https://" + url;
          } else {
          return engine.replace("%s", url)
          }          
      }
    }
  }
}

window.Eclipse = Eclipse