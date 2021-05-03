const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Room"
  },
  seenBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = { Message };