const express = require('express');
const passport = require('passport');
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
  CatchAsync(async (req, res, next) => {
    // res.send(req.body);

    try {
      const { email, username, password } = req.body;

      const user = new User({ email, username });

      const registeredUser = await User.register(user, password);

      // console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) return next(err);

        req.flash(
          'success',
          `Registration Complete!. Welcome, ${req.user.username}`
        );
        res.redirect('/courses');
      });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('register');
    }
  })
);

//login route
router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  (req, res) => {
    // console.log('REQ.USER...', req.user);
    req.flash('success', `Logged In. Welcome, ${req.user.username}`);
    const redirectUrl = req.session.returnTo || '/courses';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

//logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged out, Good Bye.');
  res.redirect('/courses');
});

module.exports = router;
