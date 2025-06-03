const User = require("../../models/User.model");
const Timetable = require("../../models/Timetable_teacher.model");
const Teacher = require("../../models/Teacher.model");
// const Appointment = require('../../models/Appointment.model');
const { ApiError } = require("../../middleware/errorHandler");
const { logger } = require("../../utils/logger");
const helpers = require("../../utils/helpers");

// Get student's timetable

function getTodayTimetable(fullTimetable) {
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const currentDay = dayNames[new Date().getDay()];

  const timeSlots = [
    "8:40 - 9:40", "9:40 - 10:40", "11:00 - 12:00", "12:00 - 1:00",
    "1:00 - 1:40", "1:40 - 2:40", "2:40 - 3:40", "3:40 - 4:40"
  ];

  // Find today's schedule
  const todayScheduleEntry = fullTimetable.timetable.find(entry => entry.day.toLowerCase() === currentDay);

  // If no timetable exists for today (e.g., Sunday), return empty
  if (!todayScheduleEntry) return [];

  // Transform the schedule to match desired structure
  const todayTimetable = todayScheduleEntry.schedule.map((periodEntry, index) => {
    const classDetails = periodEntry.class_details;

    if (!classDetails) {
      const label = (timeSlots[index] === "10:00") ? "Break"
                  : (timeSlots[index] === "1:00 - 1:40") ? "Lunch"
                  : "Free";

      return {
        time: timeSlots[index],
        subject: label,
        room: "",
        section: ""
      };
    }

    return {
      time: timeSlots[index],
      subject: classDetails.subjectName,
      room: "TBD", // If room data is available, replace "TBD"
      section: classDetails.className
    };
  });

  return todayTimetable;
}

const getPersonalTimetable = async (req, res) => {
  try {
    const teacher_phone = req.user.phone;
    const teacher_name = req.user.name;

    // Get teacher details
    const teacher = [
      {
        phone: "1234567890",
        faculty: "Dr. Andhe Pallavi",
        designation: "Head Of Department",
      },
      {
        phone: "1123456789",
        faculty: "Dr. Harsha S",
        designation: "Associate Professor",
      },
    ];

    const foundTeacher = teacher.find((t) => t.phone === teacher_phone);

    if (!foundTeacher) {
      throw new ApiError(404, "Teacher not found");
    }

    // Get timetable
    const timetable = await Timetable.findOne({
      faculty: foundTeacher.faculty,
      designation: foundTeacher.designation,
    });

    if (!timetable) {
      throw new ApiError(404, "No timetable found for your class");
    }

    console.log(timetable);

    // Format timetable data for frontend
    const formattedTimetable = getTodayTimetable(timetable);

    logger.info(`Fetched timetable for student ${teacher_name}`);

    res.json({
      success: true,
      data: formattedTimetable,
    });
  } catch (error) {
    logger.error(`Get timetable error: ${error.message}`);
    throw error;
  }
};




const periodTimeMap = {
  1: '8:40-9:40',
  2: '9:40-10:40',
  3: '11:00-12:00',
  4: '12:00-1:00',
  5: '1:00-1:40',
  6: '1:40-2:40',
  7: '2:40-3:40',
  8: '3:40-4:40'
};

function convertToScheduleData(timetableData) {
  const scheduleData = [];

  for (const dayEntry of timetableData) {
    const day = dayEntry.day.charAt(0).toUpperCase() + dayEntry.day.slice(1); // e.g., 'monday' → 'Monday'
    const classes = [];

    for (const period of dayEntry.schedule) {
      const classDetails = period.class_details;

      if (classDetails) {
        const periodNumber = period.period;
        const time = periodTimeMap[periodNumber] || '';
        const subject = classDetails.subjectName || 'Unknown Subject';
        const room = `${classDetails.subjectCode || 'NA'}`;
        const section = classDetails.className || '';
        const type = 'Lecture'; // Default type

        classes.push({
          time,
          subject,
          room,
          section,
          type
        });
      }
    }

    // Push only if there are classes on that day
    if (classes.length > 0) {
      scheduleData.push({
        day,
        classes
      });
    }
  }

  return scheduleData;
}

const getPersonalWeekTimetable = async (req, res) => {
  try {
    const teacher_phone = req.user.phone;
    const teacher_name = req.user.name;

    // Get teacher details
    const teacher = [
      {
        phone: "1234567890",
        faculty: "Dr. Andhe Pallavi",
        designation: "Head Of Department",
      },
      {
        phone: "1123456789",
        faculty: "Dr. Harsha S",
        designation: "Associate Professor",
      },
    ];

    const foundTeacher = teacher.find((t) => t.phone === teacher_phone);

    if (!foundTeacher) {
      throw new ApiError(404, "Teacher not found");
    }

    // Get timetable
    const timetable = await Timetable.findOne({
      faculty: foundTeacher.faculty,
      designation: foundTeacher.designation,
    });

    if (!timetable) {
      throw new ApiError(404, "No timetable found for your class");
    }

    console.log(timetable);

    // Format timetable data for frontend
    const rawTimetable = timetable.timetable;
    const formattedTimetable = convertToScheduleData(rawTimetable);

    logger.info(`Fetched timetable for student ${teacher_name}`);

    res.json({
      success: true,
      data: formattedTimetable,
    });
  } catch (error) {
    logger.error(`Get timetable error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getPersonalTimetable,
  getPersonalWeekTimetable
};
