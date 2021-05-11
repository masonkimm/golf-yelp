const express = require('express');
const router = express.Router({ mergeParams: true });
const Course = require('../models/course');
const Review = require('../models/review');

const CatchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas.js');

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  '/',
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
    // res.send('delete route in process');
    // const {id} = req.params;
    // const review = await Course.findByIdAndDelete(id);
    // res.redirect('/courses/:id')
  })
);

module.exports = router;
