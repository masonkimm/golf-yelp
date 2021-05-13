const express = require('express');
const router = express.Router({ mergeParams: true });
const Course = require('../models/course');
const Review = require('../models/review');
const CatchAsync = require('../utils/CatchAsync');

const { validateReview } = require('../middleware');

router.post(
  '/',
  validateReview,
  CatchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    const review = new Review(req.body.review);
    course.reviews.push(review);
    await review.save();
    await course.save();
    req.flash('success', 'New Review Added!');
    res.redirect(`/courses/${course._id}`);
  })
);
router.delete(
  '/:reviewId',
  CatchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Course.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted!');
    res.redirect(`/courses/${id}`);
  })
);

module.exports = router;
