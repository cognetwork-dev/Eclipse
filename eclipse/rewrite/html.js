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
        dom.childNodes[node] = rewriteNode(dom.childNodes[node]);
    }
    return serialize(dom)
}

function rewriteNode(node) {
    console.log(node)
    if (node.childNodes) {
        for (let childNode in node.childNodes) {
            node.childNodes[childNode] = rewriteNode(node.childNodes[childNode]);
        }
    }
    return node;
}

export { html as default };