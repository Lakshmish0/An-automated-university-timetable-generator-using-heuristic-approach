const mongoose = require('mongoose');

// Define the schema for individual time slots
const timeSlotSchema = new mongoose.Schema({
  slot_number: {
    type: Number,
    required: true,
  },
  is_empty: {
    type: Boolean,
    required: true,
    default: false, // Default to false if not provided, assuming most slots are filled
  },
  course_name: {
    type: String,
    // If is_empty is true, this can be null. Otherwise, it should be required.
    required: function() { return !this.is_empty; },
    default: null
  },
  duration_or_credits: {
    type: Number,
    // If is_empty is true, this can be null. Otherwise, it should be required.
    required: function() { return !this.is_empty; },
    default: null
  },
  faculty: {
    type: String,
    // If is_empty is true, this can be null. Otherwise, it should be required.
    required: function() { return !this.is_empty; },
    default: null
  },
  designation: {
    type: String,
    // If is_empty is true, this can be null. Otherwise, it should be required.
    required: function() { return !this.is_empty; },
    default: null
  },
  course_code: {
    type: String,
    // If is_empty is true, this can be null. Otherwise, it should be required.
    required: function() { return !this.is_empty; },
    default: null
  },
}, { _id: false }); // We don't need a separate _id for each time slot sub-document

// Define the schema for each day's schedule
const dayScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  },
  time_slots: {
    type: [timeSlotSchema], // Array of timeSlotSchema
    required: true,
    default: [],
  },
}, { _id: false }); // We don't need a separate _id for each day schedule sub-document

// Define the main Timetable schema
const timetableSchema = new mongoose.Schema({
  semester: {
    type: String,
    required: true,
    trim: true,
  },
  section: {
    type: String,
    required: true,
    trim: true,
  },
  schedule: {
    type: [dayScheduleSchema], // Array of dayScheduleSchema
    required: true,
    default: [],
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Create the Timetable model
const Timetable = mongoose.model('Student_Timetable', timetableSchema);

module.exports = Timetable;