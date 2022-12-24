class Eclipse {
  constructor(config = {}) {
    this.bare = config.bare || "/bare/"
    this.prefix = "/eclipse/"
    navigator.serviceWorker.register('./eclipse/EC.SW.js' + '?config=' + encodeURIComponent(JSON.stringify({bare: this.bare})), {scope: "/eclipse/", type: "module", updateViaCache: "none"})
  }
  url = function(url) {
    if (url) {
      return window.location.origin + this.prefix + url;
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
export { Eclipse as default };