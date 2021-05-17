const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const CatchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');
const users = require('../controllers/users');

const validateCourse = (req, res, next) => {
  const { error } = courseSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get('/register', CatchAsync(users.newUserForm));

router.post('/register', CatchAsync(users.postNewUser));

//login route
router.get('/login', users.renderLoginForm);

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  users.login
);

//logout route
router.get('/logout', users.logout);

module.exports = router;
