import BareClient from '@tomphttp/bare-client';
import { url, html, javascript, css, codecs, headersRequest, headersResponse } from "./rewrite/index.js";

async function EclipseWorker(e) {
  try {
  var searchParams = new URLSearchParams(self.location.search);
  var config = JSON.parse(decodeURIComponent(searchParams.get("config")))
  var prefix = config.prefix
  var codec = config.codec

  if (e.request.url.startsWith(self.location.origin + prefix)) {
  const client = new BareClient(config.bare);

  var link = codecs[codec].decode(e.request.url.split(prefix)[1])

  var newHeaders = Object.assign({}, e.request.headers)
  var rewrittenHeaders = headersRequest(newHeaders, link)
  var options = {
  method: e.request.method,
  headers: rewrittenHeaders,
  body: undefined
  }

  const response = await client.fetch(link, options);

  if (response.finalURL !== link) {
  return new Response("", {
		status: 301,
		headers: {"Location": url(e.request.url, response.finalURL, prefix, codec)}
	});
  }

  var code;

  switch (e.request.method !== "POST" ? response.headers.get("content-type").split(";")[0] : "") {
    case "text/html":
      code = html(await response.text(), e.request.url, prefix, codec);
      break;
    case "text/css":
      code = css(await response.text(), e.request.url, prefix, codec);
      break;
    case "text/javascript":
      code = javascript(await response.text(), e.request.url, prefix, codec);
      break;
    case "text/javascript":
      code = javascript(await response.text(), e.request.url, prefix, codec);
      break;   
    case "text/js":
      code = javascript(await response.text(), e.request.url, prefix, codec);
      break;
    case "application/javascript":
      code = javascript(await response.text(), e.request.url, prefix, codec);
      break;
    default:
      code = await response.arrayBuffer();
      break;
  }
  
  return new Response(code, {
		status: response.status,
		headers: headersResponse(response.rawHeaders)
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