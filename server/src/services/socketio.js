const { Server } = require("socket.io");

const { Room } = require("../schema/room");
const { User } = require("../schema/user");
const { Message } = require("../schema/message");

exports.run = (server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('a user is connected');
    User.findOneAndUpdate({username: socket.handshake.query.username}, {status: true}, (err, user) => {
      if (user) {
        let rooms = [];
        user.rooms.forEach((room) => {
          rooms.push(room._id);
        });
        socket.to(rooms).emit('user connection', {
          username: user.username,
          status: user.status
        });
      }
    });

    socket.on("join room", (roomId) => {
      socket.join(roomId);
    });

    socket.on('disconnect', () => {
      console.log('a user disconnected');
      User.findOneAndUpdate({username: socket.handshake.query.username}, {status: false}, (err, user) => {
        if (user) {
          let rooms = [];
          user.rooms.forEach((room) => {
            rooms.push(room._id);
          });
          socket.to(rooms).emit('user disconnection', {
            username: user.username,
            status: user.status
          });
        }
      });
    });

    socket.on('promote user', (roomId) => {
      Room.findOne({_id: roomId}).populate("members owner", "username status")
      .then((room) => {
        if (room)
          io.to(roomId).emit('promote user', {
            members: room.members,
            owner: room.owner
          });
      });
    });

    // socket.on("seenBy", (roomId, username) => {
    //   User.findOne({username: username}, (err, user) => {
    //     if (user) {
    //       console.log(user);
    //       Message.findOneAndUpdate({room: roomId, seenBy: user.id}, {$pull: {seenBy: user.id}}).populate("sender seenBy", "username").then((message) => {
    //         Message.findOneAndUpdate({room: roomId}, {$push: {seenBy: user.id}}, {sort: {$natural:-1}}).populate("sender seenBy", "username").then((lastMessage) => {
    //           if (lastMessage) {
    //             console.log(lastMessage);

    //             if (message) {
    //               message.seenBy = message.seenBy.filter((item) => item.id !== user.id);
    //               console.log("message seenBy");
    //               console.log(message.seenBy);
    //             }
    //             lastMessage.seenBy.push({_id: user.id, username: user.username});
    //             console.log(lastMessage.seenBy);
                
    //             io.to(roomId).emit("seenBy", {
    //               messageUpdate: message,
    //               lastMessage: lastMessage,
    //             });
    //           }
    //         });
    //       }).catch((err) => {

    //       });
    //     }
    //   })
    // });

    socket.on('chat', (roomId, username, msg) => {
      Room.findOne({_id: roomId}, (err, room) => {
        if (room) {
          User.findOne({username: username}, (err, user) => {
            if (user) {
              const dateNow = Date.now();
              const message = new Message({
                content: msg,
                sender: user.id,
                room: room.id,
                createdAt: dateNow
              });
              message.save((err, response) => {
                if (!err)
                  room.update({$push: {messages: message.id }}, (err, response) => {
                    if (!err)
                      // io.to(roomId).emit('chat', user.username, msg, new Date(dateNow).toLocaleDateString());
                      io.to(roomId).emit('chat', {
                        content: message.content,
                        createdAt: message.createdAt,
                        room: message.room,
                        seenBy: [],
                        sender: {
                          _id: message.sender,
                          username: user.username
                        },
                        _id: message.id
                      });
                  });
              });
            }
          });
        }
      });
    });
  });
}