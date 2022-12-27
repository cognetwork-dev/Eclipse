class Eclipse {
  constructor(config = {}) {
    this.bare = config.bare || "/bare/"
    this.prefix = config.prefix || "/service/"
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
    navigator.serviceWorker.register(location.origin + '/eclipse/EC.SW.js' + '?config=' + encodeURIComponent(JSON.stringify({bare: this.bare, prefix: "/eclipse" + this.prefix})),{scope: "/eclipse" + this.prefix})
  }
  url = function(url) {
    if (url) {
      return window.location.origin + "/eclipse" + this.prefix + url;
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