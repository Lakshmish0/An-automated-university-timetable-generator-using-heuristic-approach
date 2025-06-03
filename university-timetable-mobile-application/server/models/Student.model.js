// models/Student.model.js
const mongoose = require('mongoose');
const User = require('./User.model');

const StudentSchema = new mongoose.Schema({
  usn: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  }
});

module.exports = User.discriminator('student', StudentSchema);