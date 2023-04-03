const mongoose = require('mongoose')
const { Schema } = mongoose;

const ExerciseBookMarks = new Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:true
  },
  bookmarkDetail:{
    type:Object,
    required:true,
  },
  date:{
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('exercisebookmarks',ExerciseBookMarks)