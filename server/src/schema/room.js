const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: 1,
    trim: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  declined: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  }]
});

const Room = mongoose.model("Room", roomSchema);

module.exports = { Room };