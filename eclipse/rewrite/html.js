import { parse, serialize } from "parse5";
import { url, javascript, css } from "./index.js"

function html(code, requestURL, prefix) {
    var dom = parse(code)
    for (let node in dom.childNodes) {
        dom.childNodes[node] = addNode(dom.childNodes[node]);
    }
    rewriteNodes(requestURL, prefix)
    return serialize(dom)
}

var elements = []

function addNode(node) {
    elements.push(node)
    if (node.childNodes) {
        for (let childNode in node.childNodes) {
            node.childNodes[childNode] = addNode(node.childNodes[childNode]);
        }
    }
    return node;
}

function rewriteNodes(requestURL, prefix) {
for (var config in HTML_REWRITER) {
    if (HTML_REWRITER[config].action == "rewrite") {
      HTML_REWRITER[config].attrs.forEach((attr) => {
        var hasAttributes = elements.filter(elem => elem.attrs)
        for (let item in hasAttributes) {
          for (let attribute in hasAttributes[item].attrs) {
            if (hasAttributes[item].attrs[attribute].name == attr) {
              hasAttributes[item].attrs.push({
                name: "eclipse-" + attr,
                value: hasAttributes[item].attrs[attribute].value
              });
              hasAttributes[item].attrs[attribute].value = url(requestURL, hasAttributes[item].attrs[attribute].value, prefix)
            }
          }
        }
      })
    } else if (HTML_REWRITER[config].action == "css") {
      HTML_REWRITER[config].attrs.forEach((attr) => {
        var hasAttributes = elements.filter(elem => elem.attrs)
        for (let item in hasAttributes) {
          for (let attribute in hasAttributes[item].attrs) {
            if (hasAttributes[item].attrs[attribute].name == attr) {
              hasAttributes[item].attrs.push({
                name: "eclipse-" + attr,
                value: hasAttributes[item].attrs[attribute].value
              });
              hasAttributes[item].attrs[attribute].value = css(hasAttributes[item].attrs[attribute].value, requestURL, prefix, "declarationList")
            }
          }
        }
    })
  } else if (HTML_REWRITER[config].action == "js") {
    HTML_REWRITER[config].attrs.forEach((attr) => {
      var hasAttributes = elements.filter(elem => elem.attrs)
      for (let item in hasAttributes) {
        for (let attribute in hasAttributes[item].attrs) {
          if (hasAttributes[item].attrs[attribute].name == attr) {
            hasAttributes[item].attrs.push({
              name: "eclipse-" + attr,
              value: hasAttributes[item].attrs[attribute].value
            });
            hasAttributes[item].attrs[attribute].value = javascript(hasAttributes[item].attrs[attribute].value, requestURL, prefix)
          }
        }
      }
  })
} else if (HTML_REWRITER[config].action == "delete") {
  HTML_REWRITER[config].attrs.forEach((attr) => {
    var hasAttributes = elements.filter(elem => elem.attrs)
    for (let item in hasAttributes) {
      for (let attribute in hasAttributes[item].attrs) {
        if (hasAttributes[item].attrs[attribute].name == attr) {
          hasAttributes[item].attrs[attribute].name = "eclipse-" + hasAttributes[item].attrs[attribute].name
        }
      }
    }
})
}
}
}

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
    attrs: ["onafterprint", "onbeforeprint", "onbeforeunload", "onerror", "onhashchange", "onload", "onmessage", "onoffline", "ononline", "onpagehide", "onpopstate", "onstorage", "onunload", "onblur", "onchange", "oncontextmenu", "onfocus", "oninput", "oninvalid", "onreset", "onsearch", "onselect", "onsubmit", "onkeydown", "onkeypress", "onkeyup", "onclick", "ondblclick", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onmousewheel", "onwheel", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "onscroll", "oncopy", "oncut", "onpaste", "onabort", "oncanplay", "oncanplaythrough", "oncuechange", "ondurationchange", "onemptied", "onended", "onerror", "onloadeddata", "onloadedmetadata", "onloadstart", "onpause", "onplay", "onplaying", "onprogress", "onratechange", "onseeked", "onseeking", "onstalled", "onsuspend", "ontimeupdate", "onvolumechange", "onwaiting"],
    action: "js"
  },
  {
    attrs: ["http-equiv", "nonce", "integrity", "crossorigin", "sandbox"],
    action: "delete"
  },
  {
    config: {"prefix": "/eclipse/"},
    action: "inject"
  }
]

export { html as default };