const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Course = require('./models/course');

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  // res.send('Hello Golf World');
  res.render('home');
});

app.get('/createcourse', async (req, res) => {
  const course = new Course({
    title: 'VGC',
    description: 'close by',
  });
  await course.save();
  res.send(course);
});

app.listen(3000, () => {
  console.log('Live on port 3000');
});
