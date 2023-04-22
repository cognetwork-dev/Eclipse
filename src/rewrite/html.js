import { parse, serialize } from "parse5";
import rewrite from "./index.js"

function html(code, requestURL, prefix, codec, randomString) {
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
      config: {"prefix": prefix, "requestURL": requestURL, "codec": codec, "randomString": randomString},
      action: "inject"
    }
  ]

    var dom = parse(code)
    for (let node in dom.childNodes) {
        dom.childNodes[node] = addNode(dom.childNodes[node]);
    }
    rewriteNodes(HTML_REWRITER, requestURL, prefix, codec, randomString)
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

function rewriteNodes(HTML_REWRITER, requestURL, prefix, codec, randomString) {
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
              hasAttributes[item].attrs[attribute].value = rewrite.url(requestURL, hasAttributes[item].attrs[attribute].value, prefix, codec, randomString)
            }
          }
        }
      })
      HTML_REWRITER[config].attrs.forEach((attr) => {
        var hasAttributes = elements.filter(elem => elem.attrs)
        for (let item in hasAttributes) {
          for (let attribute in hasAttributes[item].attrs) {
            if (hasAttributes[item].attrs[attribute].name == attr) {
              hasAttributes[item].attrs.push({
                name: "eclipse-" + attr,
                value: hasAttributes[item].attrs[attribute].value
              });
              hasAttributes[item].attrs[attribute].value = rewrite.url(requestURL, hasAttributes[item].attrs[attribute].value, prefix, codec, randomString)
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
              hasAttributes[item].attrs[attribute].value = rewrite.css(hasAttributes[item].attrs[attribute].value, requestURL, prefix, codec, randomString, "declarationList")
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
            hasAttributes[item].attrs[attribute].value = rewrite.javascript(hasAttributes[item].attrs[attribute].value)
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
} else if (HTML_REWRITER[config].action == "elem-css") {
  HTML_REWRITER[config].elements.forEach((attr) => {
  var hasTagNames = elements.filter(elem => elem.tagName)
    for (let item in hasTagNames) {
        if (hasTagNames[item].tagName.toLowerCase() == attr) {
          for (let childNode in hasTagNames[item].childNodes) {
            hasTagNames[item].childNodes[childNode].value = rewrite.css(hasTagNames[item].childNodes[childNode].value, requestURL, prefix, codec, randomString)
          }
        }
    }
})
} else if (HTML_REWRITER[config].action == "elem-js") {
  HTML_REWRITER[config].elements.forEach((attr) => {
  var hasTagNames = elements.filter(elem => elem.tagName)
    for (let item in hasTagNames) {
        if (hasTagNames[item].tagName.toLowerCase() == attr) {
          for (let childNode in hasTagNames[item].childNodes) {
            hasTagNames[item].childNodes[childNode].value = rewrite.javascript(hasTagNames[item].childNodes[childNode].value)
          }
        }
    }
})
} else if (HTML_REWRITER[config].action == "srcset") {
  HTML_REWRITER[config].attrs.forEach((attr) => {
    var hasTagNames = elements.filter(elem => elem.tagName)
    for (let item in hasTagNames) {
        if (hasTagNames[item].tagName.toLowerCase() == attr) {
          var srcset = hasAttributes[item].attrs[attr]
          var srcset2 = srcset.split(" ")
          var srcset3 = srcset2.filter(function(value, index) {
            return index % 2 == 0
          })

          for (let item2 in srcset3) {
            srcset = srcset.replace(srcset3[item2], rewrite.url(e, srcset3[item2]))
          }
          hasAttributes[item].attrs[attr] = srcset
        }
    }
  })
} else if (HTML_REWRITER[config].action == "inject") {
  var INJECT_CONFIG = JSON.stringify(HTML_REWRITER[config].config)
  var heads = elements.filter(elem => elem.tagName && elem.tagName == "head")
  for (let head in heads) {
    heads[head].childNodes.unshift({
      tagName: 'script',
      nodeName: 'script',
      childNodes: [],
      attrs: [
          { name: 'src', value: "/eclipse/EC.CLIENT.js" },
          { name: 'eclipse-config', value: INJECT_CONFIG },
      ],
  })
  }
}
}
}

export { html as default };