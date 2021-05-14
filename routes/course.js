const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const CatchAsync = require('../utils/CatchAsync');
// const ExpressError = require('../utils/ExpressError');
// const { courseSchema } = require('../schemas.js');
const passport = require('passport');
const { isLoggedIn, validateCourse, isAuthor } = require('../middleware');

//show all courses route
router.get(
  '/',
  CatchAsync(async (req, res) => {
    const courses = await Course.find({});
    res.render('courses/index', { courses });
  })
);
//create new course route
router.get('/new', isLoggedIn, (req, res) => {
  res.render('courses/new');
});
//posting new course route
router.post(
  '/',
  isLoggedIn,
  validateCourse,
  CatchAsync(async (req, res, next) => {
    // if (!req.body.course) throw new ExpressError('Invalid Course Data', 400);
    const course = new Course(req.body.course);
    course.author = req.user._id;
    await course.save();
    req.flash('success', 'New Course Successfully Added!');
    res.redirect(`/courses/${course._id}`);
  })
);
//show selected course route
router.get(
  '/:id',
  CatchAsync(async (req, res) => {
    const course = await await Course.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
        },
      })
      .populate('author');
    console.log(course);
    // console.log(course);
    if (!course) {
      req.flash('error', 'Cannot find that course...');
      return res.redirect('/courses');
    }
    res.render('courses/show', { course });
  })
);
//update page route
router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      req.flash('error', 'Cannot find that course...');
      return res.redirect('/courses');
    }
    res.render('courses/edit', { course });
  })
);
//posting updated route
router.put(
  '/:id',
  validateCourse,
  isLoggedIn,
  isAuthor,
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, { ...req.body.course });
    req.flash('success', 'Course Edited Successfully!');
    res.redirect(`/courses/${course._id}`);
  })
);

//delete route
router.delete(
  '/:id',
  isLoggedIn,
  isAuthor,
  CatchAsync(async (req, res) => {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);
    req.flash('success', 'Course Removed!');
    res.redirect('/courses');
  })
);
module.exports = router;
