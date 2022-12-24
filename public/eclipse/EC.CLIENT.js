var config = JSON.parse(document.currentScript.getAttribute("data-config"))

var fullUrl = window.location.toString().split("/eclipse/")[1];
var mainUrl = window.location.origin + "/eclipse/";

function rewriteUrl(url, baseURL) {
var fullUrl = window.location.toString().split("/eclipse/")[1];
var mainUrl = window.location.origin + "/eclipse/";

if (url.startsWith("javascript:") || url.startsWith("about:") || url.startsWith("mailto:")|| url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("#")) return url;
if (url.startsWith(mainUrl)) return url;

try {
var webbaseurl = new URL(new URL(baseURL).href, new URL(fullUrl).href)
} catch {
var webbaseurl = new URL(fullUrl).href
}

var newurl = new URL(url, webbaseurl).toString()

return decodeURI(mainUrl + newurl)
}

window.eLocation = new Proxy({}, {
  set(obj, prop, value) {
  if (prop == "assign" || prop == "reload" || prop == "replace" || prop == "toString" || prop == "hash" || prop == "search" || prop == "protocol") return;

  return location[prop] = rewriteUrl(value)
  },
  get(obj, prop) {
  if (prop == 'assign' || prop == 'reload' || prop == 'replace' || prop == 'toString' || prop == 'hash' || prop == 'search') return {
  assign: arg => window.location.assign(rewriteUrl(arg)),
  replace: arg => window.location.replace(rewriteUrl(arg)),
  reload: (arg) => window.location.reload(arg ? arg : null),
  toString: () => { return new URL(fullUrl).href },
  hash: window.location.hash,
  search: window.location.search,
  protocol: window.location.protocol
  } [prop];
  else return new URL(fullUrl)[prop];
  }    
})

document.eLocation = eLocation

Object.defineProperty(window, "ELocation", {
  set: function(newValue){
    if (!newValue) return;
    eLocation.href = (newValue)
  },
  get: function(){
    return this.location;
  }
});

Object.defineProperty(document, "ELocation", {
  set: function(newValue){
    if (!newValue) return;
    eLocation.href = (newValue)
  },
  get: function(){
    return this.location;
  }
});

var oldOpen = window.open
window.open = function(url, options) {
  if (url) {
  url = rewriteUrl(url)
  }
  return oldOpen.apply(this, arguments)
}

var oldPushState = history.pushState

window.history.pushState = new Proxy(history.pushState, {
  apply(target, thisArg, args) {
  if (args[2]) {
  args[2] = rewriteUrl(args[2])
  }
  return Reflect.apply(target, thisArg, args)
  }
});

window.history.replaceState = new Proxy(history.replaceState, {
  apply(target, thisArg, args) {
  if (args[2]) {
  args[2] = rewriteUrl(args[2])
  }
  return Reflect.apply(target, thisArg, args)
  }
});

Object.defineProperty(document, 'domain', {
  get() {
    return new URL(mainUrl).hostname;
  },
  set(value) {
    return value;
  }
});

var oldFetch = window.fetch
window.fetch = function(url, options) {
  if (url) {
  url = rewriteUrl(url)
  }
  return oldFetch.apply(this, arguments)
}

var oldXHR = window.XMLHttpRequest.prototype.open
window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
  if (url) {
  url = rewriteUrl(url)
  }
  return oldXHR.apply(this, arguments)
}

var oldPostMessage = window.postMessage
window.postMessage = function(msg, origin, transfer) {
  if (origin) {
  origin = location.origin
  }
  return oldPostMessage.apply(this, arguments)
};

var oldSendBeacon = window.Navigator.prototype.sendBeacon
window.Navigator.prototype.sendBeacon = function(url, data) {
  if (url) {
  url = rewriteUrl(url)
  }
  return oldSendBeacon.apply(this, arguments)
};

var ATTRIBUTE_REWRITER = [
    {
      attrs: ["href", "src", "action", "ping", "profile", "movie", "poster", "background", "data"],
      action: "rewrite"
    },
    {
      attrs: ["srcset"],
      action: "srcset"
    },
    {
      attrs: ["style"],
      action: "css"
    },
    {
      attrs: ["onclick"],
      action: "js"
    },
    {
      attrs: ["http-equiv", "nonce", "integrity", "crossorigin"],
      action: "delete"
    }
]

function rewriteAttribute(attr, value) {
//Rewrite
if (ATTRIBUTE_REWRITER[0].attrs.includes(attr)) {
return [attr, rewriteUrl(value)]
//Srcset
} else if (ATTRIBUTE_REWRITER[1].attrs.includes(attr)) {
var srcset = value
var srcset2 = srcset.split(" ")
var srcset3 = srcset2.filter(function(value, index) {
return index % 2 == 0
})

for (item in srcset3) {
srcset = srcset.replace(srcset3[item], urlrewrite(srcset3[item], req.url.split(prefix)[1], req.protocol + "://" + req.get("host") + prefix))
}
return [attr, srcset]
//Delete
} else if (ATTRIBUTE_REWRITER[4].attrs.includes(attr)) {
return;
}
}

HTMLElement.prototype.setAttribute = new Proxy(HTMLElement.prototype.setAttribute, {
apply(target, element, args) {
if (args[0] && args[1]) {
if (rewriteAttribute(args[0], args[1])) {
args[1] = rewriteAttribute(args[0], args[1])[1]
}
}
return Reflect.apply(target, element, args)
}
})

for (let attr in ATTRIBUTE_REWRITER[0].attrs) {
Object.defineProperty(HTMLElement.prototype, ATTRIBUTE_REWRITER[0].attrs[attr], {
set(value) {
  return this.setAttribute(ATTRIBUTE_REWRITER[0].attrs[attr], value);
},
get() {
  return this.getAttribute(attribute);
}
})
}

document.currentScript.remove()