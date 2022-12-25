import { DOMParser } from './linkedom/linkedom.js';
import url from './url.js'
import css from './css.js'
import js from './js.js'

function html(e, code) {
var dom = new DOMParser().parseFromString(code, "text/html")

var HTML_REWRITER = [
  {
    attrs: ["href", "src", "action", "ping", "profile", "movie", "poster", "background", "data"],
    action: "rewrite"
  },
  {
    attrs: ["srcset"],
    action: "srcset"
  },
  {
    elements: ["style"],
    action: "elem-css"
  },
  {
    attrs: ["style"],
    action: "css"
  },
  {
    elements: ["script"],
    action: "elem-js"
  },
  {
    attrs: ["onclick"],
    action: "js"
  },
  {
    attrs: ["http-equiv", "nonce", "integrity", "crossorigin"],
    action: "delete"
  },
  {
    config: {"prefix": "/eclipse/"},
    action: "inject"
  }
]

for (var config in HTML_REWRITER) {
if (HTML_REWRITER[config].action == "rewrite") {
  HTML_REWRITER[config].attrs.forEach((attr) => {
    var allelems = dom.all.filter(elem => elem.hasAttribute(attr))
    for (var aelem in allelems) {
      if (allelems[aelem].hasAttribute(attr)) {
        allelems[aelem].setAttribute(attr, url(e, allelems[aelem].getAttribute(attr)))
      }
    }
  })
} else if (HTML_REWRITER[config].action == "css") {
    HTML_REWRITER[config].attrs.forEach((attr) => {
    var allelems = dom.all.filter(elem => elem.hasAttribute(attr))
    for (var aelem in allelems) {
      if (allelems[aelem].hasAttribute(attr)) {
        allelems[aelem].setAttribute(attr, css(e, allelems[aelem].getAttribute(attr), "declarationList"))
      }
    }
  })
} else if (HTML_REWRITER[config].action == "js") {
    HTML_REWRITER[config].attrs.forEach((attr) => {
    var allelems = dom.all.filter(elem => elem.hasAttribute(attr))
    for (var aelem in allelems) {
      if (allelems[aelem].nodeType && allelems[aelem].getAttribute(attr)) {
        allelems[aelem].setAttribute(attr, js(e, allelems[aelem].getAttribute(attr)))
      }
    }
  })
} else if (HTML_REWRITER[config].action == "delete") {
    HTML_REWRITER[config].attrs.forEach((attr) => {
    var allelems = dom.all.filter(elem => elem.hasAttribute(attr))
    for (var aelem in allelems) {
      if (allelems[aelem].nodeType && allelems[aelem].getAttribute(attr)) {
        allelems[aelem].removeAttribute(attr)
      }
    }
  })
} else if (HTML_REWRITER[config].action == "elem-css") {
    var styles = dom.all.filter(elem => elem.localName == HTML_REWRITER[config].elements)
    for (var styleelem in styles) {
      if (styles[styleelem].innerHTML) {
        styles[styleelem].innerHTML = css(e, styles[styleelem].innerHTML)
      }
    }
} else if (HTML_REWRITER[config].action == "elem-js") {
    var styles = dom.all.filter(elem => elem.localName == HTML_REWRITER[config].elements)
    for (var styleelem in styles) {
      if (styles[styleelem].innerHTML) {
        styles[styleelem].innerHTML = js(e, styles[styleelem].innerHTML)
      }
    }
} else if (HTML_REWRITER[config].action == "inject") {
    var inject = dom.createElement("script")
    inject.setAttribute("src", new URL(e.request.url).origin + "/eclipse/EC.CLIENT.js")
    var INJECT_CONFIG = JSON.parse(JSON.stringify(HTML_REWRITER[config].config))
    inject.setAttribute('data-config', JSON.stringify(INJECT_CONFIG))
    dom.head.insertBefore(inject, dom.head.childNodes[0])
} else if (HTML_REWRITER[config].action == "srcset") {
  HTML_REWRITER[config].attrs.forEach((attr) => {
    var allelems = dom.all.filter(elem => elem.hasAttribute(attr))
    for (var aelem in allelems) {
      if (allelems[aelem].hasAttribute(attr)) {
        var srcset = allelems[aelem].getAttribute(attr)
        var srcset2 = srcset.split(" ")
        var srcset3 = srcset2.filter(function(value, index) {
        return index % 2 == 0
        })

        for (var item in srcset3) {
        srcset = srcset.replace(srcset3[item], url(e, srcset3[item]))
        }
        allelems[aelem].setAttribute(attr, srcset)
      }
    }
  })
}
}

return dom.toString();
}

export { html as default };