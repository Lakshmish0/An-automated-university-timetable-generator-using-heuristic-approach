// controllers/student/timetable.controller.js
const User = require("../../models/User.model");
const Timetable = require("../../models/Timetable.model");
const { ApiError } = require("../../middleware/errorHandler");
const { logger } = require("../../utils/logger");

const timeMap = {
  1: "8:40 AM - 9:40 AM",
  2: "9:40 AM - 10:40 AM",
  3: "11:00 AM - 12:00 PM",
  4: "12:00 PM - 1:00 PM",
  5: "1:00 PM - 1:40 PM",
  6: "1:40 PM - 2:40 PM",
  7: "2:40 PM - 3:40 PM",
  8: "3:40 PM - 4:40 PM",
};

function getTodaysFormattedTimetable(data) {
  const weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const todayName = weekdays[new Date().getDay()];

  const todaySchedule = data.schedule.find(
    (dayEntry) => dayEntry.day.toLowerCase() === todayName
  );

  if (!todaySchedule) return [];

  const formatted = todaySchedule.time_slots
    .filter((slot) => !slot.is_empty)
    .map((slot, index) => ({
      id: String(index + 1),
      course: slot.course_name,
      time: timeMap[slot.slot_number] || "TBD",
      room: `Room-${slot.course_code || "N/A"}`,
      teacher: slot.faculty,
    }));
  console.log(formatted);
  return formatted;
}

const getStudentTimetable = async (req, res) => {
  try {
    const student_usn = req.user.usn;
    const student_name = req.user.name;

    // Get student details
    const student = [
      { usn: "1RN21AI064", semester: "III", section: "A" },
      { usn: "1RN21AI092", semester: "III", section: "B" },
    ];

    const foundStudent = student.find((s) => s.usn === student_usn);

    if (!foundStudent) {
      throw new ApiError(404, "Student not found");
    }

    // Get current timetable
    const timetable = await Timetable.findOne({
      semester: foundStudent.semester,
      section: foundStudent.section,
    });

    if (!timetable) {
      throw new ApiError(404, "No timetable found for your class");
    }

    // Format timetable data for frontend
    const formattedTimetable = getTodaysFormattedTimetable(timetable);
    console.log("hit");
    logger.info(`Fetched timetable for student ${student_name}`);

    res.json({
      success: true,
      data: formattedTimetable,
    });
  } catch (error) {
    logger.error(`Get timetable error: ${error.message}`);
    throw error;
  }
};

const slotTimings = {
  1: '08:40 - 09:40',
  2: '09:40 - 10:40',
  3: '11:00 - 12:00',
  4: '12:00 - 13:00',
  5: '13:00 - 13:40',
  6: '13:40 - 14:40',
  7: '14:40 - 15:40',
  8: '15:40 - 16:40',
};

function convertToTimetable(schedule) {

  if (!Array.isArray(schedule)) {
    console.error("Invalid input: schedule must be an array");
    return [];
  }
  return schedule.map((daySchedule) => {
    const day = capitalizeFirstLetter(daySchedule.day);
    const classes = daySchedule.time_slots.map((slot) => {
      const time = slotTimings[slot.slot_number] || "Unknown Time";
      if (slot.is_empty) {
        return { time, course: "Free" };
      } else {
        return {
          time,
          course: slot.course_name,
          teacher: slot.faculty,
          room: "TBD", // You can modify this if `room` data is available
        };
      }
    });
    return { day, classes };
  });
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const getStudentWeekTimetable = async (req, res) => {
  try {
    const student_usn = req.user.usn;
    const student_name = req.user.name;

    // Get student details
    const student = [
      { usn: "1RN21AI064", semester: "III", section: "A" },
      { usn: "1RN21AI092", semester: "III", section: "B" },
    ];

    const foundStudent = student.find((s) => s.usn === student_usn);

    if (!foundStudent) {
      throw new ApiError(404, "Student not found");
    }

    // Get current timetable
    const timetable = await Timetable.findOne({
      semester: foundStudent.semester,
      section: foundStudent.section,
    });

    if (!timetable) {
      throw new ApiError(404, "No timetable found for your class");
    }
    console.log(timetable)

    // Format timetable data for frontend
    const timetableData = convertToTimetable(timetable.schedule);
    logger.info(`Fetched timetable for student ${student_name}`);

    res.json({
      success: true,
      timetable: timetableData,
    });
  } catch (error) {
    logger.error(`Get timetable error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getStudentTimetable,
  getStudentWeekTimetable,
};
