const fs = require( 'fs');
const express = require( 'express');

const path = require( 'path');

const socket = require( 'socket.io');
const { Server } = require( 'http');
const serveStatic = require( 'serve-static');
const mongoose = require( 'mongoose');

mongoose.Promise = global.Promise;

// Server setup
const PORT = process.env.PORT || 5000; // req process.env.port for heroku, 5000 on local
const app = express();
const server = Server(app)
// const compiler = webpack(config);
const io = socket(server)
const router = express.Router();

//************************************** Schemas
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
  user:String,
  message:String
})

const UsersSchema = new mongoose.Schema({
  user:String,
  _id:String
})

const RoomSchema = new mongoose.Schema({
  room:String,
  messages: [MessageSchema],
  users:[UsersSchema],
  _id:String
})
const Room = mongoose.model('Room', RoomSchema)
//************************************** 

// Serve static files
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

//************************************** API
app.use('/', router);
// get all collections
router.route('/api').get((req,res) => {
  Room.find({}, (err, data) => {
    if (err) throw err;
    res.json(data);
  }) 
})
// get a specific room's data
router.route('/api/:room')
  .get((req, res) => {
    console.log('fetching data from room ' + req.params.room);
    Room.findOne({"room":req.params.room},(err, data) => {
      if (err) throw err;
      res.json(data);
    })
  })
//************************************** 

//************************************** Socket Events

io.on('connection', function(socket) {
  console.log('opening socket');
  // add users to room
  socket.on('subscribe', (data) => {
    let { room, user, _id } = data;
    console.log(`${data.user} of id ${data._id} has joined ${data.room}`);
    // find appropiate room and add new user to 'users' array
    Room.findOne({ room }).then((room) => {
      room.users.push({user, _id})
      room.save()
    })
    socket.broadcast.emit('subscribe', data);
  })
  
  // remove user from room
  socket.on('unsubscribe', (data) => {
    let { room, _id } = data
    console.log(`${_id} has left ${room}`);
    Room.findOne({ room }).then((room) => {
      room.users = room.users.filter((user) => {
        return user._id !== _id;
      })
      room.save();
    })
    socket.broadcast.emit('unsubscribe', data);
  })
  
  // emit incoming messages to other clients
  socket.on('client msg', (msg) => {
    console.log('saving msg to db');
    // save incoming message from client to db
    Room.findOne({"room": msg.room}).then((room) => {
      let user = msg.user;
      let message = msg.message;
      room.messages.push({user, message})
      room.save()
    })
    console.log('emitting client msg');
    // emit incoming message to all other clients, except for sender, so they can update their own states
    socket.broadcast.emit('client msg', msg);
  })
  // create new room
  socket.on('new room', (data) => {
    // update database with new room
    Room({
      room: data.newRoomName,
      messages:[],
      users:[],
      _id: data._id
    }).save((err) => {
      console.log(err);
    })
    // pass new room to other clients
    socket.broadcast.emit('new room', {newRoomName: data.newRoomName, _id:data._id});
  })

  socket.on('disconnect',() => {
    console.log(`user ${socket.id} has disconnected`);
    // remove user on page refresh
    mongoose.connection.collections.rooms.update({}, {$pull:{"users":{"_id": socket.id}}},{multi:true});
    socket.broadcast.emit('user disconnect', socket.id);
  })

});
// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});
// connect to db and opens server at localhost:<port>
mongoose.connect("mongodb://chat:chat@ds163360.mlab.com:63360/chat-app")
const db = mongoose.connection;
db.once('open', () => {
  // db.collections.rooms.drop();
  // console.log('creating defaults data');
  // // test data to work with
  // Room({
  //   room: 'General',
  //   messages: [
  //     { user: 'ChatBot', message: 'Welcome to react chat :)' }
  //   ],
  //   users:[{user:'ChatBot', _id:'2311'}],
  //   _id:'1'
  // }).save()
  // Room({
  //   room: 'Test Room',
  //   messages: [
  //     { user: 'Test User', message: 'Welcome to test room' }
  //   ],
  //   users:[{user:'test user', _id:'109301'}],
  //   _id:'2'
  // }).save()
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
