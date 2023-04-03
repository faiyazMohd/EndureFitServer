const mongoose = require("mongoose"); 
const { Schema } = mongoose;

const Threads = new Schema({
  threadTitle: {
    type: String,
    required:true
  },
  threadDesc: {
    type: String,
    required: true
  },
  categoryId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:true
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:true
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('threads',Threads)
