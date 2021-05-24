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

  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const course = new Course({
      author: '609d6d2d69f3a809e4816a30',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: 'https://res.cloudinary.com/masonk/image/upload/v1621447246/GolfCamp/z9vcstoxolvzz6u6zqwi.jpg',
          filename: 'GolfCamp/z9vcstoxolvzz6u6zqwi',
        },
        {
          url: 'https://res.cloudinary.com/masonk/image/upload/v1621447246/GolfCamp/qu5wcmbz0amoiybh89ro.jpg',
          filename: 'GolfCamp/qu5wcmbz0amoiybh89ro',
        },
      ],
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam magni, maxime reiciendis ut beatae accusantium soluta adipisci cumque alias eaque laboriosam consectetur quidem impedit libero eos accusamus quas odio quibusdam.',
      price: price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
    });
    await course.save();
  }
};

seedDB().then(() => {
  console.log('New data seeded successfully! Disconnecting Database');
  mongoose.connection.close();
});
