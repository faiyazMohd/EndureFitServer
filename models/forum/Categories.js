const mongoose = require("mongoose");
const { Schema } = mongoose;

const Categories = new Schema({
  categoryName: {
    type: String,
    required:true
  },
  categoryDesc: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('categories',Categories)
