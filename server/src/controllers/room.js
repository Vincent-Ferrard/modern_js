const { Invitation } = require("../schema/invitation");
const { Message } = require("../schema/message");
const { Room } = require("../schema/room");
const { User } = require("../schema/user");

const { transporter } = require('../services/nodemail');

const Str = require('@supercharge/strings');
const { resolveContent } = require("nodemailer/lib/shared");

const RoomController = {
  create: (req, res) => {
    User.findOne({
      email: req.user.email
    }, (err, user) => {
      if (!user)
        res.status(400).send(err);
      else {
        const room = new Room({
          name: req.body.name,
          owner: user.id,
          // $push: { members: user.id }
        });
        room.save((err, response) => {
          if (err)
            res.status(400).send(err);
          else
            user.update({$push: {rooms: room.id }}, (err, response) => {
              if (err)
                  res.status(400).send(err);
              else
                res.status(200).send(response);
            })
        })
      }
    })
  },

  find: (req, res) => {
    Room.findOne({
      _id: req.params.roomId
    }, (err, room) => {
      if (!room)
        res.status(400).send(err);
      else
        res.json(room);
    })
  },

  getMessages: (req, res) => {
    Message.find({room: req.params.roomId}).populate("sender seenBy", "username")
    .then((messages) => {
      if (!messages)
        res.status(400).send(err);
      else
        res.json({
          messages: messages
        });
    }).catch((err) => {
      res.status(400).send(err);
    });
  },

  addMembers: (req, res) => {

    // const commonRooms = a1.filter(function(n) { return a2.indexOf(n) !== -1;});

    // if (commonRooms.length > 0)
    //   add user to the room
    // else
    //   send an invitation by email
    let params = {};

    if (!req.body.input.includes('@'))
      params = { username: req.body.input };
    else
      params = { email: req.body.input };

    User.findOne(params, (err, user) => {
      if (!user)
        res.json({message: "This user does not exist."});
      else {
        User.findOne({
          email: req.user.email,
        }, (err, me) => {
          if (!me)
            res.status(400).send(err);
          else {
            const commonRooms = me.rooms.filter(function(n) { return user.rooms.indexOf(n) !== -1;});
            if (commonRooms.length > 0) {
              Room.findOneAndUpdate({
                _id: req.params.roomId
              }, {
                $push: { members: user.id }
              }, (err, room) => {
                if (!room)
                  res.status(400).send(err);
                else {
                  user.update({$push: {rooms: room.id }}, (err, response) => {
                    if (err)
                      res.status(400).send(err);
                    else {
                      res.json({message: user.username + " has been added to the room."});
                    }
                  })
                }
              })
            } else {
              Room.findOne({
                _id: req.params.roomId
              }, (err, room) => {
                if (!room)
                  res.status(400).send(err);
                else {
                  const token = Str.random(24);
                  const invitation = new Invitation({
                    user: user.id,
                    room: room.id,
                    token: token
                  }).save((err, response) => {
                      if (err)
                          res.status(400).send(err);
                      else
                        transporter.sendMail({
                          to: user.email,
                          from: process.env.SENDER_MAIL,
                          subject: 'Invitation to ' + room.name + " by " + me.username,
                          html: '<a href="http://localhost:3000/rooms/' + room.id + '/invite/accept?token=' + token + '" target="_blank">Accept invitation</a><br/><a href="http://localhost:3000/rooms/' + room.id + '/invite/decline?token=' + token + '" target="_blank">Decline invitation</a>',
                        }).then((response) => {
                          res.status(200).json({message: "An invitation has been sent."});
                        }).catch((err) => {
                          res.status(400).send(err);
                        });
                  })
                }
              });
            }
          }
        })
      }
    })
  },

  removeMember: (req, res) => {
    console.log(req.user);
    User.findOne({
      email: req.user.email,
    }, (err, user) => {
      if (!user)
        res.json({message: "This user does not exist."});
      else {
        Room.findOne({
          _id: req.params.roomId
        }, (err, room) => {
          if (!room)
            res.status(400).send(err);
          else {
            if (room.owner._id == user.id) {
              idTmp = room.members[0]._id;
              room.updateOne({owner: idTmp, $pull: {members: idTmp}}, (err, res) => (console.log(res)));
            } else {
              room.updateOne({$pull: {members: user.id}}, (err, res) => (console.log(res)));
            }
            user.updateOne({$pull: {rooms: room._id}, $push: {oldRooms: room._id}}, (err, res) => {console.log(res)});
            res.json({message: "Succed"});
          }
        });
      }
    });
  },

  acceptInvitation: (req, res) => {
    Invitation.findOne({token: req.query.token}).populate("user room", "email name")
    .then((invitation) => {
      if (!invitation)
        res.status(400).send(err);
      else {
        if (req.params.roomId !== invitation.room.id)
          res.status(400).send(err);
        else {
          User.findOne({
            email: invitation.user.email
          }, (err, user) => {
            if (!user)
              res.json({message: "This user does not exist."});
            else {
              Room.findOneAndUpdate({
                _id: req.params.roomId
              }, {
                $push: { members: user.id }
              }, (err, room) => {
                if (!room)
                  res.status(400).send(err);
                else {
                  user.update({$push: {rooms: room.id }}, (err, response) => {
                    if (err)
                      res.status(400).send(err);
                    else {
                      invitation.delete((err, response) => {
                        if (err)
                          res.status(400).send(err);
                        else
                          res.json({message: "You have join the room"});
                      })
                    }
                  })
                }
              })
            }
          })
        }
      }
    }).catch((err) => {
      res.status(400).send(err);
    });
  },

  declineInvitation: (req, res) => {
    Invitation.findOne({token: req.query.token}).populate("user room", "email name")
    .then((invitation) => {
      if (!invitation)
        res.status(400).send(err);
      else {
        if (req.params.roomId !== invitation.room.id)
          res.status(400).send(err);
        else {
          User.findOne({
            email: invitation.user.email
          }, (err, user) => {
            if (!user)
              res.json({message: "This user does not exist."});
            else {
              Room.findOneAndUpdate({
                _id: req.params.roomId
              }, {
                $push: { declined: user.id }
              }, (err, room) => {
                if (!room)
                  res.status(400).send(err);
                else {
                  invitation.delete((err, response) => {
                    if (err)
                      res.status(400).send(err);
                    else
                      res.json({message: user.username + " has declined the invitation to the room " + room.name + "."});
                  })
                }
              })
            }
          })
        }
      }
    }).catch((err) => {
      res.status(400).send(err);
    });
  },

  allMembers: (req, res) => {
    Room.findOne({_id: req.params.roomId}).populate("members owner", "username status")
    .then((room) => {
      if (!room)
        res.json({message: "This room does not exist."});
      else
        res.json({
          members: room.members,
          owner: room.owner
        });
    }).catch((err) => {
      res.status(400).send(err);
    })
  },

  promoteUserToOwner: (req, res) => {
    Room.findOne({_id: req.params.roomId}, (err, room) => {
      if (!room)
        res.status(400).json({message: "This room does not exist."});
      else {
        User.findOne({username: req.user.username}, (err, user) => {
          if (!user)
            res.status(400).json({message: "Can not find your account."});
          else {
            if (room.owner._id != user.id)
              res.status(400).json({message: "You are not the room's owner. You can't promote a user."});
            else {
              User.findOne({username: req.body.username}, (err, userToPromote) => {
                if (!userToPromote)
                  res.status(400).json({message: "The user you want to promote does not exist."});
                else {
                  let members = room.members.filter((element) => element != userToPromote.id);
                  members.push(user.id);
                  room.updateOne({owner: userToPromote.id, members: members}, (err, response) => {
                    if (err)
                      res.status(400).json(err);
                    else
                      res.json({message: 'The user ' + userToPromote.username + ' has been promoted.'});
                  });
                }
              });
            }
          }
        });
      }
    });
  }
}

module.exports = RoomController;