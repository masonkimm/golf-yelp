const express = require('express');
const router = express.Router();
const User = require('../models/user');
const CatchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');
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
  '/register',
  CatchAsync(async (req, res) => {
    res.render('users/register');
  })
);

router.post(
  '/register',
  CatchAsync(async (req, res) => {
    // res.send(req.body);

    try {
      const { email, username, password } = req.body;

      const user = new User({ email, username });

      const registeredUser = await User.register(user, password);

      console.log(registeredUser);
      req.flash('success', 'Registration Complete! Welcome to golf yelp!');
      res.redirect('/courses');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('register');
    }
  })
);

module.exports = router;
