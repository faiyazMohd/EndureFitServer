const mongoose = require('mongoose')
const { Schema } = mongoose;

const Concerns = new Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:true
  },
  userQuery:{
    type: String,
    required:true
  },
  userInfo:{
    type:String,
    required:true
  },
  userConcern:{
    type:String,
    required:true
  },
  date:{
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('concerns',Concerns)