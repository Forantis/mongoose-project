const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  age: {
    type: Number,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook example
userSchema.pre('save', function(next) {
  // You could add custom logic here
  next();
});

// Virtual property example
userSchema.virtual('nameUpperCase').get(function() {
  return this.name.toUpperCase();
});

// Instance method example
userSchema.methods.getInfo = function() {
  return `${this.name} (${this.email})`;
};

// Static method example
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
