import BareClient from '@tomphttp/bare-client';

async function EclipseWorker(e) {
  console.log(e.request.url)
  try {
  var searchParams = new URLSearchParams(self.location.search);
  var config = JSON.parse(decodeURIComponent(searchParams.get("config")))
  var prefix = config.prefix

  if (e.request.url.startsWith(self.location.origin + prefix)) {
  const client = new BareClient(config.bare);

  var options = {
  method: e.request.method,
  headers: e.request.headers,
  body: undefined
  }

  const response = await client.fetch(e.request.url.split(prefix)[1], options);

  var code = await response.text()
  return new Response(code, {
	status: response.status,
	headers: response.rawHeaders
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