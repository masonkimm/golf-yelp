module.exports.isLoggedIn = (req, res, next) => {
  console.log('REQ.USER...', req.user);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Must log in first');
    return res.redirect('/login');
  }
  next();
};
