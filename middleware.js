module.exports.isLoggedIn = (req, res, next) => {
  console.log('REQ.USER...', req.user);
  if (!req.isAuthenticated()) {
    req.flash('error', 'Must sign in first');
    return res.redirect('/login');
  }
  next();
};
