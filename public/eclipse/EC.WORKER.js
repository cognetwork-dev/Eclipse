import BareClient from '../bareClient/BareClient.js';
import { html, css, js, headersRequest, headersResponse } from "./rewrite/index.js";
import url from './rewrite/url.js'

async function EclipseWorker(e) {
  try {
  var searchParams = new URLSearchParams(self.location.search);
  var config = JSON.parse(decodeURIComponent(searchParams.get("config")))
  var prefix = "/eclipse/"

  if (e.request.url.startsWith(self.location.origin + prefix)) {
  if (e.request.url.split(prefix)[1].startsWith("EC") || e.request.url.split(prefix)[1].startsWith("rewrite")) {
    return fetch(e.request);
  }
  const client = new BareClient(self.location.origin + config.bare);

  var newHeaders = Object.assign({}, e.request.headers)
  var rewrittenHeaders = headersRequest(e, newHeaders)
  var options = {
  method: e.request.method,
  headers: rewrittenHeaders,
  body: undefined
  }

  const response = await client.fetch(e.request.url.split(prefix)[1], options);

  if (response.headers.get("Location")) {
  return new Response("", {
		status: 301,
		headers: {"Location": url(e, response.headers.get("Location"))}
	});
  }

  var code;

  switch (e.request.method !== "POST" ? response.headers.get("Content-Type").split(";")[0] : "") {
    case "text/html":
      code = html(e, await response.text());
      break;
    case "text/css":
      code = css(e, await response.text());
      break;
    case "text/javascript":
      code = js(e, await response.text());
      break;
    case "text/javascript":
      code = js(e, await response.text());
      break;   
    case "text/js":
      code = js(e, await response.text());
      break;
    case "application/javascript":
      code = js(e, await response.text());
      break;
    default:
      code = await response.arrayBuffer();
      break;
  }
  return new Response(code, {
		status: response.status,
		headers: headersResponse(e, response.rawHeaders)
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