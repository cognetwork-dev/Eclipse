import createBareServer from '@tomphttp/bare-server-node';
import express from 'express';
import http from 'node:http';
import webpack from 'webpack';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

var bundle = webpack({
  mode: 'development',
  entry: {
    MAIN: path.join(__dirname, '/src/main.js'),
    SW: path.join(__dirname, '/src/sw.js'),
    WORKER: path.join(__dirname, '/src/worker.js'),
    CLIENT: path.join(__dirname, '/src/client/')
  },
  output: {
    path: path.join(__dirname, '/public/eclipse'),
    filename: 'EC.[name].js'
  }
});

bundle.watch(true, (error)=>{
  if (error) {
    console.log("Error: ", error);
  } else {
    console.log("Bundled Eclipse");
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