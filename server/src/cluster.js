require('dotenv').config();
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;
const { setupMaster } = require("@socket.io/sticky");

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  console.log("Number of CPU : " + numCPUs);

  const httpServer = http.createServer();
  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection", // either "random", "round-robin" or "least-connection"
  });

  const port = process.env.PORT || 8080;

  httpServer.listen(port);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);

  require('./server.js');

  // const httpServer = http.createServer(app);
  // const socketIo = require('./services/socketio');
  
  // socketIo.run(httpServer);
}