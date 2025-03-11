const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  dates: String,
  description: String,
});

const InformationSchema = new mongoose.Schema({
  bio: String,
  location: String,
  website: String,
});

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  experience: [ExperienceSchema],
  skills: [String],
  information: InformationSchema,
  deleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
