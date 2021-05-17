const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const CatchAsync = require('../utils/CatchAsync');
// const ExpressError = require('../utils/ExpressError');
// const { courseSchema } = require('../schemas.js');
const passport = require('passport');
const { isLoggedIn, validateCourse, isAuthor } = require('../middleware');
const courses = require('../controllers/courses');

//show all courses route
router.get('/', CatchAsync(courses.index));
//create new course route
router.get('/new', isLoggedIn, courses.renderNewForm);
//posting new course route
router.post('/', isLoggedIn, validateCourse, CatchAsync(courses.postNewCourse));
//show selected course route
router.get('/:id', CatchAsync(courses.showSelectedCourse));

//update page route
router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  CatchAsync(courses.renderEditForm)
);
//posting updated route
router.put(
  '/:id',
  validateCourse,
  isLoggedIn,
  isAuthor,
  CatchAsync(courses.postEditedCourse)
);

//delete route
router.delete('/:id', isLoggedIn, isAuthor, CatchAsync(courses.removeCourse));

module.exports = router;
