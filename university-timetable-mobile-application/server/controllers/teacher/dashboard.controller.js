const Class = require('../../models/Class.model');
const Notification = require('../../models/Notification.model');
// const Assignment = require('../../models/Assignment.model');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');
const helpers = require('../../utils/helpers');

const getDashboardData = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    // Get today's date and calculate start/end of week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    // Fetch data in parallel
    const [todaysClasses, upcomingClasses, announcements, assignments] = await Promise.all([
      // Today's classes
      Class.find({
        students: studentId,
        day: helpers.getDayName(today.getDay()),
        isCancelled: false
      }).sort('time')
      .populate('subject', 'name code')
      .populate('teacher', 'firstName lastName')
      .populate('room', 'name'),

      // Upcoming classes this week
      Class.find({
        students: studentId,
        day: { $in: helpers.getWeekDays(today.getDay()) },
        date: { $gte: today, $lte: endOfWeek },
        isCancelled: false
      }).sort('date time')
      .populate('subject', 'name code')
      .populate('teacher', 'firstName lastName')
      .populate('room', 'name')
      .limit(5),

      // Recent announcements
      Notification.find({
        recipient: studentId,
        type: { $in: ['announcement', 'system'] }
      })
      .sort('-createdAt')
      .limit(3),

      // Pending assignments
      Assignment.find({
        students: studentId,
        dueDate: { $gte: today },
        submissionStatus: 'pending'
      })
      .sort('dueDate')
      .populate('course', 'name code')
      .limit(3)
    ]);

    // Calculate stats
    const stats = {
      totalClasses: await Class.countDocuments({ students: studentId }),
      upcomingAssignments: await Assignment.countDocuments({ 
        students: studentId,
        dueDate: { $gte: today },
        submissionStatus: 'pending'
      }),
      unreadAnnouncements: await Notification.countDocuments({ 
        recipient: studentId,
        read: false
      })
    };

    logger.info(`Fetched dashboard data for student ${studentId}`);

    res.json({
      success: true,
      data: {
        stats,
        todaysClasses: todaysClasses.map(c => helpers.formatClassResponse(c)),
        upcomingClasses: upcomingClasses.map(c => helpers.formatClassResponse(c)),
        announcements,
        assignments
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