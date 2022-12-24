import fs from 'fs';
import createBareServer from './tomp/bare-server-node/dist/BareServer.esm.js';
import http from 'http';
import nodeStatic from 'node-static';

const server = http.createServer();

const client = new nodeStatic.Server('public/');

const bareServer = createBareServer('/bare/', {
	logErrors: false,
	localAddress: undefined
});

server.on('request', (req, res) => {
	if (bareServer.shouldRoute(req)) {
		bareServer.routeRequest(req, res);
	} else {
		client.serve(req, res);
	}
});

server.on('upgrade', (req, socket, head) => {
	if (bareServer.shouldRoute(req)) {
		bareServer.routeUpgrade(req, socket, head);
	} else {
		socket.end();
	}
});

server.on('listening', () => {
	console.log('Server running');
});

server.listen(3000);

/*
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