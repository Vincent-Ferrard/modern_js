const mongoose = require('mongoose');

const invitationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Room"
  },
  token: {
    type: String,
    required: true,
    unique: 1,
    trim: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 60*60*24*7
  }
});

const Invitation = mongoose.model("Invitation", invitationSchema);

module.exports = { Invitation };