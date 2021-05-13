const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const User = require('./models/user');

const courseRoutes = require('./routes/course');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb://localhost:27017/golf-yelp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: 'thisIsASecret',
  resave: false,
  saveUninitialized: true,
  coookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

//new user seed
app.get('/testUser', async (req, res) => {
  const testUser = new User({
    email: 'testUserEmail@gmal.com',
    username: 'testUserrr',
  });
  const newUser = await User.register(testUser, 'password');
  res.send(newUser);
});

app.use('/', userRoutes);
app.use('/courses', courseRoutes);
app.use('/courses/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Error Occured';
  res.status(404).render('error', { err });
});

//Seed
// app.get('/createcourse', async (req, res) => {
//   const course = new Course({
//     title: 'VGC',
//     description: 'close by',
//   });
//   await course.save();
// res.send(course);
// });

app.listen(3000, () => {
  console.log('Live on port 3000');
});
