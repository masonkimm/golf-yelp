const Course = require('./models/course');
const Review = require('./models/review');
const { courseSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
  // console.log('REQ.USER...', req.user);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Must log in first');
    return res.redirect('/login');
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id);

  if (!course.author.equals(req.user._id)) {
    req.flash('error', 'Permission required');
    return res.redirect(`/courses/${id}`);
  }
  next();
};

module.exports.validateCourse = (req, res, next) => {
  const { error } = courseSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
