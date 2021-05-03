const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Course = require('./models/course');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

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

app.get('/courses', async (req, res) => {
  const courses = await Course.find({});
  res.render('courses/index', { courses });
});
app.get('/courses/new', (req, res) => {
  res.render('courses/new');
});
app.post('/courses', async (req, res) => {
  const course = new Course(req.body.course);
  await course.save();
  res.redirect(`/courses/${course._id}`);
});

app.get('/courses/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render('courses/show', { course });
});

app.get('/courses/:id/edit', async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render('courses/edit', { course });
});
app.put('/courses/:id', async (req, res) => {
  // res.send('worked');
  const { id } = req.params;
  // Course.findByIdAndUpdate(id, {title: 'ddd', location:'eeeee'})
  const course = await Course.findByIdAndUpdate(id, { ...req.body.course });
  res.redirect(`/courses/${course._id}`);
});

app.delete('/courses/:id', async (req, res) => {
  const { id } = req.params;
  const course = await Course.findByIdAndDelete(id);
  res.redirect('/courses');
});

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
