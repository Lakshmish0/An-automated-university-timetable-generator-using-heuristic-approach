// controllers/student/dashboard.controller.js
const User = require('../../models/User.model');
const Timetable = require('../../models/Timetable.model');
const Notification = require('../../models/Notification.model');
const { ApiError } = require('../../middleware/errorHandler');
const {logger} = require('../../utils/logger');
const helpers = require('../../utils/helpers');

const getDashboardData = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    // Get student details
    const student = await User.findById(studentId)
      .select('firstName lastName semester section')
      .populate('department', 'name code');

    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    // Get current timetable
    const timetable = await Timetable.findOne({
      department: student.department._id,
      semester: student.semester,
      section: student.section,
      isCurrent: true,
      status: 'published'
    }).select('schedule');

    // Get upcoming classes (next 24 hours)
    const now = new Date();
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    let upcomingClasses = [];
    if (timetable) {
      upcomingClasses = timetable.schedule
        .filter(cls => new Date(cls.startTime) >= now && new Date(cls.startTime) <= nextDay)
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        .slice(0, 3); // Limit to 3 upcoming classes
    }

    // Get latest announcements
    const announcements = await Notification.find({
      recipient: studentId,
      type: 'announcement'
    })
    .sort({ createdAt: -1 })
    .limit(3)
    .select('title message createdAt');

    // Get stats
    const courseCount = await Subject.countDocuments({
      department: student.department._id,
      semester: student.semester
    });

    logger.info(`Fetched dashboard data for student ${studentId}`);

    res.json({
      success: true,
      data: {
        student: {
          name: `${student.firstName} ${student.lastName}`,
          department: student.department,
          semester: student.semester,
          section: student.section
        },
        stats: {
          courses: courseCount,
          upcoming: upcomingClasses.length,
          gpa: 3.8 // This would come from academic records
        },
        upcomingClasses,
        announcements
      }
    });

  } catch (error) {
    logger.error(`Get dashboard error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getDashboardData
};