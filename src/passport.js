var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    db = require('./models'),
    flash = require('connect-flash'),
    session = require('express-session'),
    DigestStrategy = require('passport-http').DigestStrategy,
    BasicStrategy = require('passport-http').BasicStrategy;

module.exports = exports = {};

// console.log('db.User ==', db.User)

// init function to setup passport
exports.init = function init (app) {
  app.use(session({
    secret: 'secretstring',
    resave: false,
    saveUninitialized: true,
    cookie: {}
   })); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session

  passport.serializeUser(function(user, done) {
    console.log('serializing');
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log('deserializing');
    db.User.findById(id, function(err, user) {
      if (err) {console.error('deserialize error')}
      done(err, user);
    });
  });

// ===============================
// Configure passport authentication
// ===============================
  passport.use(new BasicStrategy(
    function(username, password, done) {
      console.log('basic is firing');
      db.User.findOne({ username: username}, (err, user) => {
        // console.log('userz ==', user);
        if (err) {console.error('error',err);return done(err)}
        if (!user) {
          console.log('user not found');
          return done(null, false);
        }
        if (!user.validPassword(password)) {
          console.log('bad password');
          return done(null, false, {message: 'Incorrect password.'})
        }
        console.log('all is well')
        return done(null, user, user.password);
      });
    }
  ));


  return passport;

}
