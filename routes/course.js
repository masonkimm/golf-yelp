const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const CatchAsync = require('../utils/CatchAsync');
const passport = require('passport');
const { isLoggedIn, validateCourse, isAuthor } = require('../middleware');
const courses = require('../controllers/courses');

const multer = require('multer');

const { storage } = require('../cloudinary');
const upload = multer({ storage });

//index routes
router
  .route('/')
  //show all courses route
  .get(CatchAsync(courses.index))
  //posting new course route
  .post(
    isLoggedIn,
    upload.array('image'),
    validateCourse,
    CatchAsync(courses.postNewCourse)
  );

//create new course route
router.get('/new', isLoggedIn, courses.renderNewForm);

//id routes
router
  .route('/:id')
  //show selected course route
  .get(CatchAsync(courses.showSelectedCourse))
  //posting updated route
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateCourse,
    CatchAsync(courses.postEditedCourse)
  )
  //delete route
  .delete(isLoggedIn, isAuthor, CatchAsync(courses.removeCourse));

//update page route
router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  CatchAsync(courses.renderEditForm)
);

module.exports = router;

//#forTesting
// .post(upload.array('image'), (req, res) => {
//   console.log(req.body, req.files);
//   res.send('itworked');
// });

//#forReference
//====before refactoring===
//show all courses route
// router.get('/', CatchAsync(courses.index));
//create new course route
// router.get('/new', isLoggedIn, courses.renderNewForm);
//posting new course route
// router.post('/', isLoggedIn, validateCourse, CatchAsync(courses.postNewCourse));
//show selected course route
// router.get('/:id', CatchAsync(courses.showSelectedCourse));
//update page route
// router.get(
//   '/:id/edit',
//   isLoggedIn,
//   isAuthor,
//   CatchAsync(courses.renderEditForm)
// );
//posting updated route
// router.put(
//   '/:id',
//   validateCourse,
//   isLoggedIn,
//   isAuthor,
//   CatchAsync(courses.postEditedCourse)
// );
//delete route
// router.delete('/:id', isLoggedIn, isAuthor, CatchAsync(courses.removeCourse));
