import * as csstree from 'css-tree';
import url from "./url.js";

function css(code, requestURL, prefix, codec, context) {
const css = csstree.parse(code, {
  context: context || "stylesheet"
});

var urls = csstree.findAll(css, node => 
node.type == "Url")

for (var aurl in urls) {
var link = urls[aurl]
link.value = url(requestURL, link.value, prefix, codec)
}

return csstree.generate(css)
}

export { css as default };