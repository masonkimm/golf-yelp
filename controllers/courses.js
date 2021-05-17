const Course = require('../models/course');

module.exports.index = async (req, res) => {
  const courses = await Course.find({});
  res.render('courses/index', { courses });
};

module.exports.renderNewForm = (req, res) => {
  res.render('courses/new');
};

module.exports.postNewCourse = async (req, res, next) => {
  // if (!req.body.course) throw new ExpressError('Invalid Course Data', 400);
  const course = new Course(req.body.course);
  course.author = req.user._id;
  await course.save();
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
  console.log(course);
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
  const course = await Course.findByIdAndUpdate(id, { ...req.body.course });
  req.flash('success', 'Course Edited Successfully!');
  res.redirect(`/courses/${course._id}`);
};

module.exports.removeCourse = async (req, res) => {
  const { id } = req.params;

  const course = await Course.findByIdAndDelete(id);
  req.flash('success', 'Course Removed!');
  res.redirect('/courses');
};
