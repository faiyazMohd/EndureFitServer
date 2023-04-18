const mongoose = require("mongoose");
const { Schema } = mongoose;

const Comments = new Schema({
  commentContent: {
    type: String,
    required: true,
  },
  commentLikes: {
    type: Number,
    required: true,
    default:0
  },
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  userName:{
    type: String,
    required: true
  },
  userPicture:{
    type: String
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("comments", Comments);
