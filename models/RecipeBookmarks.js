const mongoose = require('mongoose')
const { Schema } = mongoose;

const RecipeBookMarks = new Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:true
  },
  bookmarkDetail:{
    type:Object,
    required:true,
    unique:true
  },
  date:{
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('recipebookmarks',RecipeBookMarks)