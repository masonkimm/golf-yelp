const express = require('express');
const router = express.Router({ mergeParams: true });
const Course = require('../models/course');
const Review = require('../models/review');
const CatchAsync = require('../utils/CatchAsync');
const reviews = require('../controllers/reviews');
const ExpressError = require('../utils/ExpressError');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
// const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, CatchAsync(reviews.createReview));

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  CatchAsync(reviews.deleteReview)
);

module.exports = router;
