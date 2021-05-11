const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const CatchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');
const { courseSchema } = require('../schemas.js');

const validateCourse = (req, res, next) => {
  const { error } = courseSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  '/',
  CatchAsync(async (req, res) => {
    const courses = await Course.find({});
    res.render('courses/index', { courses });
  })
);
router.get('/new', (req, res) => {
  res.render('courses/new');
});

router.post(
  '/',
  validateCourse,
  CatchAsync(async (req, res, next) => {
    // if (!req.body.course) throw new ExpressError('Invalid Course Data', 400);

    const course = new Course(req.body.course);
    await course.save();
    req.flash('success', 'New Course Successfully Added!');

    res.redirect(`/courses/${course._id}`);
  })
);

router.get(
  '/:id',
  CatchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id).populate('reviews');
    // console.log(course);
    if (!course) {
      req.flash('error', 'Cannot find that course...');
      res.redirect('/courses');
    }
    res.render('courses/show', { course });
  })
);

router.get(
  '/:id/edit',
  CatchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
      req.flash('error', 'Cannot find that course...');
      res.redirect('/courses');
    }
    res.render('courses/edit', { course });
  })
);
router.put(
  '/:id',
  validateCourse,

  CatchAsync(async (req, res) => {
    // res.send('worked');
    const { id } = req.params;
    // Course.findByIdAndUpdate(id, {title: 'ddd', location:'eeeee'})
    const course = await Course.findByIdAndUpdate(id, { ...req.body.course });
    req.flash('success', 'Course Edited Successfully!');

    res.redirect(`/courses/${course._id}`);
  })
);

router.delete(
  '/:id',
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    req.flash('success', 'Course Removed!');
    res.redirect('/courses');
  })
);
module.exports = router;
