const Course = require('./models/course');
const Review = require('./models/review');
const { courseSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');

//user check
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Must log in first');
    return res.redirect('/login');
  }
  next();
};
//course validation
module.exports.validateCourse = (req, res, next) => {
  const { error } = courseSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
//course author check
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id);

  if (!course.author.equals(req.user._id)) {
    req.flash('error', 'Permission required');
    return res.redirect(`/courses/${id}`);
  }
  next();
};
//review author check
module.exports.isReviewAuthor = async (req, res, next) => {
  // app.delete('/:reviewId')
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'Permission required');
    return res.redirect(`/courses/${id}`);
  }
  next();
};

//review validation
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
