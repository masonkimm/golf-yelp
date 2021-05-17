const User = require('../models/user');

module.exports.newUserForm = async (req, res) => {
  res.render('users/register');
};

module.exports.postNewUser = async (req, res, next) => {
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
        `Registration Complete! Welcome, ${req.user.username}`
      );
      res.redirect('/courses');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login');
};

module.exports.login = (req, res) => {
  // console.log('REQ.USER...', req.user);
  req.flash('success', `Logged In. Welcome, ${req.user.username}`);
  const redirectUrl = req.session.returnTo || '/courses';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'Logged out, Good Bye.');
  res.redirect('/courses');
};
