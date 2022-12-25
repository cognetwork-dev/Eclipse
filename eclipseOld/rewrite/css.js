import * as csstree from './csstree/csstree.esm.js';
import rewriteurl from "./url.js";

function css(e, code, context) {
const css = csstree.parse(code, {
  context: context || "stylesheet"
});

var urls = csstree.findAll(css, node => 
node.type == "Url")

for (var aurl in urls) {
var link = urls[aurl]
link.value = rewriteurl(e, link.value)
}

return csstree.generate(css)
}

export { css as default };