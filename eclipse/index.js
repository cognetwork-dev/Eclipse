import { createBareClient } from "@tomphttp/bare-client";

const client = await createBareClient(location.origin + "/bare/");

const response = await client.fetch("https://example.com");

console.log(await response.text());
