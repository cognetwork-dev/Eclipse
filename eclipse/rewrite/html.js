import { parse, serialize } from "parse5";
import { url } from "./index.js"

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

export { html as default };