module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log("--- User Authenticated: ", req.body)
      return next()
    } else {
      console.log("--- User Not Authenticated: ", req.body)
      res.redirect('/')
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/dashboard');
    }
  },
}
