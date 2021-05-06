const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Course = require('./models/course');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const CatchAsync = require('./utils/CatchAsync');
const ExpressError = require('./utils/ExpressError');
// const Joi = require('joi');
const { courseSchema } = require('./schemas.js');

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
  // const courseSchema = Joi.object({
  //   course: Joi.object({
  //     title: Joi.string().required(),
  //     price: Joi.number().required().min(0),
  //     location: Joi.string().required(),
  //     description: Joi.string().required(),
  //     image: Joi.string().required(),
  //   }).required(),
  // });
  const { error } = courseSchema.validate(req.body);

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
    const course = await Course.findById(req.params.id);
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
