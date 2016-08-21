// Requires
var express = require('express'),
  app = express(),
  path = require('path'),
  logger = require('morgan'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  // apiRoutes = require('./api_routes.js'),
  cors = require('cors'),
  config = require('../config'),
  mongodb_url = 'mongodb://localhost:27017/gaffer',
  jwt = require('jsonwebtoken'),
  cookieParser = require('cookie-parser'),
  session = require('express-session');



// ==============================
// | Routers Requires
// ==============================
  var fdRoutes = require('./routes/fdRoutes.js')
  , twRoutes = require('./routes/twRoutes.js')
  , userRoutes = require('./routes/userRoutes.js')
  , authRoutes = require('./routes/authRoutes.js')
  , authCtrls = require('./controllers/authControllers.js')
  , meRoutes = require('./routes/meRoutes.js')
  , rssRoutes = require('./routes/rssRoutes.js')

// ===============================
// Connect to DB on Digital Ocean
// ===============================
mongoose.connect(mongodb_url, function (err) {
  if (err) console.log(err)
  console.log('Connected to MongoDB');
})

// Setup Middleware

app.set('port', config.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.urlencoded({
  extended : true
}))

// // for passport
// app.use(cookieParser()); // cookier parser no longer needed by passport
// app.use(express.session({ secret: 'jonjo shelvey\'s personal chef' }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(app.router);

var passport = require('./passport').init(app);

// Why is this here?i
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization')
  next()
})
app.use(bodyParser.json());
app.use(cors());

// end region set up middleware

// Initialize routes to use
// =============================
// Static content
app.use(express.static(__dirname + '/../public'))

// // Homepage
// app.get('/', function (req, res) {
//   res.sendFile('html/index.html', {root: './public'})
// })

// app.get('/dash', function (req, res) {
//   res.sendFile('html/index.html', {root: './public'})
// })

// // Authentication
// app.use('/api/authenticate', authRoutes)
// // TODO: I moved the middleware below all the routes because it was authenticating the create users routes, should fix that and move back
// // endpoints
app.post('/api/authenticate',
  passport.authenticate('local', {
    successRedirect: '/dash',
    failureRedirect: '/login',
    failureFlash: true
  }),
  function(req, res) { // sucess handler
    var user = req.user;
    delete user.password;
    // req.login();
    res.json(user);
  }
);

app.use('/api/fd', fdRoutes)
app.use('/api/tw', twRoutes)
app.use('/api/users', userRoutes)
// app.use(authCtrls.middleware)
// app.use('/api/me', meRoutes)
app.use('/api/rss', rssRoutes)

app.get('/loadUser', authorize, () => {
  res.send(req.user || null);  // get the user out of session and send it back
})

// route middleware to make sure a user is logged in
function authorize(req, res, next) {
  console.log('checking auth');
  if (req.isAuthenticated()) {
    console.log('auth\'d');
    next();
  } else {
    console.log('req.isAuth ==', req.isAuthenticated());
    res.status(401).send('not authorized');
  }
}

// Set the port to run
app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})
