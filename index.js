import createBareServer from '@tomphttp/bare-server-node';
import express from 'express';
import http from 'node:http';
import webpack from 'webpack';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url))

var bundle = webpack({
  mode: 'development',
  stats: {
    warnings: false
  },
  entry: {
    main: path.join(__dirname, "/eclipse/index.js"),
    sw: path.join(__dirname, "/eclipse/sw.js"),
  },
  output: {
    path: path.join(__dirname, "eclipseBuild"),
    filename: 'ec.[name].js'
  }
});

bundle.watch(true, (error)=>{
  if (error) {
    console.log("Error: ", error);
  } else {
    console.log("Bundled");
  }
})

const httpServer = http.createServer();

const app = express();

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static(__dirname + "/public"))

const bareServer = createBareServer('/bare/');

httpServer.on("request", (req, res) => {
	if (bareServer.shouldRoute(req)) {
		bareServer.routeRequest(req, res);
	} else {
		app(req, res);
	}
});

httpServer.on("upgrade", (req, socket, head) => {
	if (bareServer.shouldRoute(req)) {
		bareServer.routeUpgrade(req, socket, head);
	} else {
		socket.end();
	}
});

httpServer.on("listening", () => {
	console.log("Eclipse in running on port 8080");
});

httpServer.listen({
	port: 8080,
});

/*
how to bundle / stole from sting

var bundle = webpack({
  mode: 'development',
  stats: {
    warnings: false
  },
  entry: {
    bundle: path.join(__dirname, 'sting/bundle.ts'),
    sw: path.join(__dirname, 'sting/worker/index.ts'),
    client: path.join(__dirname, 'sting/client/index.ts'),
  },
  output: {
    path: path.join(__dirname, 'static/st'),
    filename: 'st.[name].js'
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  }
});

bundle.watch(true, (error)=>{
  if (error) {
    console.log("Error", error);
  } else {
    console.log("Bundled Sting");
  }
})

*/