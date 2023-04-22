import BareClient from '@tomphttp/bare-client';
import rewrite from "./rewrite/index.js";

async function EclipseWorker(e) {
  try {
  var searchParams = new URLSearchParams(self.location.search);
  var config = JSON.parse(decodeURIComponent(searchParams.get("config")))
  var prefix = config.prefix
  var codec = config.codec
  var randomString = config.randomString

  if (e.request.url.startsWith(self.location.origin + prefix)) {
  const client = new BareClient(config.bare);

  var link = rewrite.codecs[codec].decode(e.request.url.split(prefix)[1])

  var newHeaders = Object.assign({}, e.request.headers)
  var rewrittenHeaders = rewrite.headers.request(newHeaders, link)
  var options = {
  method: e.request.method,
  headers: rewrittenHeaders,
  body: undefined
  }

  const response = await client.fetch(link, options);

  if (response.finalURL !== link) {
  return new Response("", {
		status: 301,
		headers: {"Location": rewrite.url(e.request.url, response.finalURL, prefix, codec, randomString)}
	});
  }

  var code;

  switch (e.request.method !== "POST" ? response.headers.get("content-type").split(";")[0] : "") {
    case "text/html":
      code = rewrite.html(await response.text(), e.request.url, prefix, codec, randomString);
      break;
    case "text/css":
      code = rewrite.css(await response.text(), e.request.url, prefix, codec, randomString);
      break;
    case "text/javascript":
      code = rewrite.javascript(await response.text(), e.request.url, prefix, codec, randomString);
      break;
    case "text/javascript":
      code = rewrite.javascript(await response.text(), e.request.url, prefix, codec, randomString);
      break;   
    case "text/js":
      code = rewrite.javascript(await response.text(), e.request.url, prefix, codec, randomString);
      break;
    case "application/javascript":
      code = rewrite.javascript(await response.text(), e.request.url, prefix, codec, randomString);
      break;
    default:
      code = await response.arrayBuffer();
      break;
  }
  
  return new Response(code, {
		status: response.status,
		headers: rewrite.headers.response(response.rawHeaders)
	});
  } else {
  return fetch(e.request);
  }
  } catch(error) {
  console.log(error)
  return new Response(error, {
		status: 500,
	})
  }
}

export { EclipseWorker as default };