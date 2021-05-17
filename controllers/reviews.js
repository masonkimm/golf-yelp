const Review = require('../models/review');
const Course = require('../models/course');

module.exports.createReview = async (req, res) => {
  const course = await Course.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  course.reviews.push(review);
  await review.save();
  await course.save();
  req.flash('success', 'New Review Added!');
  res.redirect(`/courses/${course._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  console.log(id);
  await Course.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review Deleted!');
  res.redirect(`/courses/${id}`);
};
