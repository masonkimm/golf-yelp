const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Course = require('./models/course');
const Review = require('./models/review');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const CatchAsync = require('./utils/CatchAsync');
const ExpressError = require('./utils/ExpressError');

const { courseSchema, reviewSchema } = require('./schemas.js');

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

const validateCourse = (req, res, next) => {
  const { error } = courseSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get('/', (req, res) => {
  // res.send('Hello Golf World');
  res.render('home');
});

app.get(
  '/courses',
  CatchAsync(async (req, res) => {
    const courses = await Course.find({});
    res.render('courses/index', { courses });
  })
);
app.get('/courses/new', (req, res) => {
  res.render('courses/new');
});
app.post(
  '/courses',
  validateCourse,
  validateReview,
  CatchAsync(async (req, res, next) => {
    // if (!req.body.course) throw new ExpressError('Invalid Course Data', 400);

    const course = new Course(req.body.course);
    await course.save();
    res.redirect(`/courses/${course._id}`);
  })
);

app.get(
  '/courses/:id',
  CatchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id).populate('reviews');
    // console.log(course);
    res.render('courses/show', { course });
  })
);

app.get(
  '/courses/:id/edit',
  CatchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render('courses/edit', { course });
  })
);
app.put(
  '/courses/:id',
  validateCourse,

  CatchAsync(async (req, res) => {
    // res.send('worked');
    const { id } = req.params;
    // Course.findByIdAndUpdate(id, {title: 'ddd', location:'eeeee'})
    const course = await Course.findByIdAndUpdate(id, { ...req.body.course });
    res.redirect(`/courses/${course._id}`);
  })
);

app.delete(
  '/courses/:id',
  CatchAsync(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    res.redirect('/courses');
  })
);

app.post(
  '/courses/:id/reviews',
  CatchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    const review = new Review(req.body.review);
    course.reviews.push(review);
    await review.save();
    await course.save();
    res.redirect(`/courses/${course._id}`);
    // res.send('whoo hooooo');
  })
);
app.delete(
  '/courses/:id/reviews/:reviewId',
  CatchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Course.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/courses/${id}`);
    // res.send('delete route in process');
    // const {id} = req.params;
    // const review = await Course.findByIdAndDelete(id);
    // res.redirect('/courses/:id')
  })
);

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
  // res.send('404 Error');
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Error Occured';
  res.status(404).render('error', { err });

  // res.send('Error');
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
