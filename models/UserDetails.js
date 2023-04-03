const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserDetailsSchema = new Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:true
  },
  userName:{
    type: String,
    ref:'user',
    unique:true
  },
  userDetails:{
    type:Object,
    required:true,
  },
  date:{
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('userdetails',UserDetailsSchema)