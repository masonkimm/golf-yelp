const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  rating: Number,
  body: String,
  // date: Number,
});
module.exports = mongoose.model('Review', ReviewSchema);
