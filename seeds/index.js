const mongoose = require('mongoose');
const Course = require('../models/course');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

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

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Course.deleteMany({});
  // const c = new Course({ title: 'Pebble Beach' });
  // await c.save();

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const course = new Course({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/10734239/1200x600',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam magni, maxime reiciendis ut beatae accusantium soluta adipisci cumque alias eaque laboriosam consectetur quidem impedit libero eos accusamus quas odio quibusdam.',
      price: price,
    });
    await course.save();
  }
};

seedDB().then(() => {
  console.log('New data seeded successfully! Disconnecting Database');
  mongoose.connection.close();
});
