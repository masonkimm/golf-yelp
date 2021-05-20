const Course = require('../models/course');
const { cloudinary } = require('../cloudinary');
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: MAPBOX_TOKEN });

module.exports.index = async (req, res) => {
  const courses = await Course.find({});
  res.render('courses/index', { courses });
};

module.exports.renderNewForm = (req, res) => {
  res.render('courses/new');
};

module.exports.postNewCourse = async (req, res, next) => {
  // if (!req.body.course) throw new ExpressError('Invalid Course Data', 400);
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.course.location,
      limit: 1,
    })
    .send();

  // console.log(geoData.body.features[0].geometry.coordinates);
  // res.send(geoData.body.features[0].geometry.coordinates);

  const course = new Course(req.body.course);

  course.geometry = geoData.body.features[0].geometry;

  course.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  course.author = req.user._id;
  await course.save();
  console.log(course);
  req.flash('success', 'New Course Successfully Added!');
  res.redirect(`/courses/${course._id}`);
};

module.exports.showSelectedCourse = async (req, res) => {
  const course = await await Course.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');

  // console.log(course);
  if (!course) {
    req.flash('error', 'Cannot find that course...');
    return res.redirect('/courses');
  }
  res.render('courses/show', { course });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) {
    req.flash('error', 'Cannot find that course...');
    return res.redirect('/courses');
  }
  res.render('courses/edit', { course });
};

module.exports.postEditedCourse = async (req, res) => {
  const { id } = req.params;
  // console.log(req.body);
  const course = await Course.findByIdAndUpdate(id, { ...req.body.course });
  const imgs = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  course.images.push(...imgs);
  await course.save();

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await course.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    // console.log(course);
  }

  req.flash('success', 'Course Edited Successfully!');
  res.redirect(`/courses/${course._id}`);
};

module.exports.removeCourse = async (req, res) => {
  const { id } = req.params;

  const course = await Course.findByIdAndDelete(id);
  req.flash('success', 'Course Removed!');
  res.redirect('/courses');
};
