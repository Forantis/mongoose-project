const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  from: Date,
  to: Date,
  current: Boolean,
  description: String
}, { timestamps: true });

const informationSchema = new mongoose.Schema({
  bio: String,
  age: Number,
  location: String,
  website: String,
  phone: String,
  status: String,
  birthdate: Date
});

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  information: {
    type: informationSchema,
    default: {}
  },
  experience: [experienceSchema],
  skills: [String],
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  }],
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
