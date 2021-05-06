const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const CourseSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

CourseSchema.post('findOneAndDelete', async function (doc) {
  // console.log(doc);
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model('Course', CourseSchema);
