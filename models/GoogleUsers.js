const mongoose = require('mongoose')
const { Schema } = mongoose;

const GoogleUsersSchema = new Schema({
  name:{
    type: String,
    required:true
  },
  picture:{
    type: String,
    required:true
  },
  email:{
    type: String,
    required:true,
    unique:true
  },
  date:{
    type: Date,
    default: Date.now
  },
});

const GoogleUsers = mongoose.model('googleusers',GoogleUsersSchema);
module.exports = GoogleUsers;