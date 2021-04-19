var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message',{
  name : String,
  message : String
})

var User = mongoose.model('User',{
  name : String,
  mail : String,
  password : String
})

var dbUrl = 'mongodb+srv://dbUser:ninja-desu@clustermessageapp.erh7t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

app.get('/', function (req, res) {
  res.sendFile('login.html', { root: __dirname })
})

app.get('/register', function (req, res) {
  res.sendFile('register.html', { root: __dirname })
})

app.post('/', function (req, res) {
  res.sendFile('chatbox.html', { root: __dirname })
})

app.post('/register', function (req, res) {
  var user = new User(req.body);
  user.save((err) =>{
    if(err)
      sendStatus(500)
    io.emit('user', req.body);
    res.sendStatus(200);
  })
  res.sendFile('chatbox.html', { root: __dirname })
})

app.get('/chatbox', function (req, res) {
  res.sendFile('chatbox.html', { root: __dirname})
})


app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  })
})

io.on('connection', () =>{
  console.log('a user is connected')
})

mongoose.connect(dbUrl ,{useMongoClient : true} ,(err) => {
  console.log('mongodb connected',err);
})

var server = http.listen(8080, () => {
  console.log('server is running on port', server.address().port);
});