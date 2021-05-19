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

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const course = new Course({
      author: '609d6d2d69f3a809e4816a30',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: 'https://res.cloudinary.com/masonk/image/upload/v1621446310/GolfCamp/jbfiezlw0xxzzgaanrn8.jpg',
          filename: 'GolfCamp/jbfiezlw0xxzzgaanrn8',
        },
        {
          url: 'https://res.cloudinary.com/masonk/image/upload/v1621446309/GolfCamp/dwytkda8ellqym81eolv.jpg',
          filename: 'GolfCamp/dwytkda8ellqym81eolv',
        },
      ],
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
