const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// require('dotenv').config();

const MONGOURL = 'mongodb+srv://admin:AAleUri78rYmkfzI@cluster.zy0jq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect(MONGOURL, options)
.then(() => console.log("DB connected"))
.catch(error => console.log(error));

app.use(bodyParser.json());

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

const roomRoutes = require('./routes/room');
app.use('/api/rooms', roomRoutes);

const HTML_FOLDER_PATH = __dirname + '/views';

app.get('/rooms', (req, res) => {
  res.sendFile(HTML_FOLDER_PATH + '/rooms.html');
})

app.get('/rooms/:roomId', (req, res) => {
  res.sendFile(HTML_FOLDER_PATH + '/room.html');
})

const http = require("http");
const server = http.createServer(app);

const socketIo = require('./services/socketio');

socketIo.run(server);

// const port = process.env.PORT || 8080;

// server.listen(port, () => {
//     console.log(`server running on ${port}`);
// })


// const cluster = require("cluster");
// const http = require("http");
// const numCPUs = require("os").cpus().length;
// const { setupMaster } = require("@socket.io/sticky");

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);

//   const httpServer = http.createServer();
//   setupMaster(httpServer, {
//     loadBalancingMethod: "least-connection", // either "random", "round-robin" or "least-connection"
//   });

//   const port = process.env.PORT || 8080;


//   httpServer.listen(port);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker) => {
//     console.log(`Worker ${worker.process.pid} died`);
//     cluster.fork();
//   });
// } else {
//   console.log(`Worker ${process.pid} started`);

//   const httpServer = http.createServer(app);
//   const socketIo = require('./services/socketio');
  
//   socketIo.run(httpServer);
// }