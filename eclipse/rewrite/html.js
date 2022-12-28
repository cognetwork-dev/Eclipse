import { parse, serialize } from "parse5";

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

function html(code, requestURL, prefix) {
    var dom = parse(code)
    for (let node in dom.childNodes) {
        dom.childNodes[node] = addNode(dom.childNodes[node]);
    }
    rewriteNodes()
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

function rewriteNodes() {
  /*
for (var config in HTML_REWRITER) {
    if (HTML_REWRITER[config].action == "rewrite") {
      HTML_REWRITER[config].attrs.forEach((attr) => {
        var allelems = elements.filter(elem => elem.hasAttribute(attr))
        for (var aelem in allelems) {
          if (allelems[aelem].hasAttribute(attr)) {
            allelems[aelem].setAttribute(attr, "test")
          }
        }
      })
    }
}
*/
}

export { html as default };