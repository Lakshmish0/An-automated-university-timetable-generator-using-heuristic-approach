const mongoose = require("mongoose");

const ClassDetailsSchema = new mongoose.Schema({
  className: { type: String, required: true },
  subjectName: { type: String, required: true },
  semester: { type: Number, required: true },
  subjectCode: { type: String, required: true },
}, { _id: false });

const PeriodSchema = new mongoose.Schema({
  period: { type: Number, required: true },
  class_details: { type: ClassDetailsSchema, default: null }
}, { _id: false });

const DayScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    required: true,
  },
  schedule: { type: [PeriodSchema], required: true }
}, { _id: false });

const Timetable_techerSchema = new mongoose.Schema({
  faculty: { type: String, required: true },
  designation: { type: String, required: true },
  timetable: { type: [DayScheduleSchema], required: true }
});

module.exports = mongoose.model("Timetable_techer", Timetable_techerSchema);
