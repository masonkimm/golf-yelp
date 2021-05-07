const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const courses = require('./routes/courses');
const reviews = require('./routes/reviews');
// const Course = require('./models/course');
// const Review = require('./models/review');
// const CatchAsync = require('./utils/CatchAsync');
// const ExpressError = require('./utils/ExpressError');
// const { courseSchema, reviewSchema } = require('./schemas.js');

mongoose.connect('mongodb://localhost:27017/golf-yelp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
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
app.use(express.urlencoded({ exteded: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  // res.send('Hello Golf World');
  res.render('home');
});

app.use('/courses', courses);
app.use('/courses/:id/reviews', reviews);

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
  // res.send('404 Error');
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
