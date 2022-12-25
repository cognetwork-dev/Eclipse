import { createBareClient } from "@tomphttp/bare-client";

async function Eclipse() {
const client = await createBareClient(location.origin + "/bare/");

const response = await client.fetch("https://example.com");

console.log(await response.text());
}

export { Eclipse }