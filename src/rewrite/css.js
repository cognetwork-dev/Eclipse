import * as csstree from 'css-tree';
import rewrite from "./index.js";

function css(code, requestURL, prefix, codec, randomString, context) {
const css = csstree.parse(code, {
  context: context || "stylesheet"
});

var urls = csstree.findAll(css, node => 
node.type == "Url")

for (var aurl in urls) {
var link = urls[aurl]
link.value = rewrite.url(requestURL, link.value, prefix, codec, randomString)
}

return csstree.generate(css)
}

export { css as default };