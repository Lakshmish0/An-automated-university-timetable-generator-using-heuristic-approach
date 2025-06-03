// models/Teacher.model.js
const mongoose = require('mongoose');
const User = require('./User.model');

const TeacherSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'],
    required: true
  },
});

module.exports = User.discriminator('teacher', TeacherSchema);