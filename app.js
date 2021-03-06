if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// require('dotenv').config();
// console.log(process.env.SECRET);
// console.log(process.env.API_KEY);

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

const mongoSanitize = require('express-mongo-sanitize');

const MongoStore = require('connect-mongo');

const helmet = require('helmet');
// const { Store } = require('express-session');

// const DB_URL = process.env.DB_URL;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/golf-yelp';

mongoose.connect(DB_URL, {
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

const secret = process.env.SECRET || 'secretLine';
const store = MongoStore.create({
  mongoUrl: DB_URL,
  crypto: {
    secret: secret,
  },
  touchAfter: 24 * 60 * 60,
});
store.on('error', function (e) {
  console.log('session store error');
});
const sessionConfig = {
  store: store,
  name: 'session',
  secret: secret,
  resave: false,
  saveUninitialized: true,
  coookie: {
    httpOnly: true,
    // secrue: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(mongoSanitize());
app.use(helmet());

// app.use(session(sessionConfig));
app.use(flash());

const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com/',
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://kit.fontawesome.com/',
  'https://cdnjs.cloudflare.com/',
  'https://cdn.jsdelivr.net',
];
const styleSrcUrls = [
  'https://kit-free.fontawesome.com/',
  'https://stackpath.bootstrapcdn.com/',
  'https://cdn.jsdelivr.net',
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://use.fontawesome.com/',
];
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        'https://res.cloudinary.com/masonk/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        'https://images.unsplash.com/',
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.query);
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Live on port ${PORT}`);
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
