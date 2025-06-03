// controllers/student/teacherAvailability.controller.js
const User = require('../../models/User.model');
const Availability = require('../../models/Availability.model');
const Class = require('../../models/Class.model');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');
const helpers = require('../../utils/helpers');

const getAvailableTeachers = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { day = 'Today', searchQuery = '' } = req.query;

    // Get student's department
    const student = await User.findById(studentId).select('department');
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    // Get all teachers in department
    let query = { 
      department: student.department,
      role: 'teacher'
    };

    // Add search filter if query provided
    if (searchQuery) {
      query.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    const teachers = await User.find(query)
      .select('firstName lastName email designation department subjects')
      .populate('subjects', 'name code');

    // Get availability for each teacher
    const teachersWithAvailability = await Promise.all(
      teachers.map(async teacher => {
        // Get teacher's scheduled classes for the day
        const scheduledClasses = await Class.find({
          teacher: teacher._id,
          day: day === 'Today' ? helpers.getCurrentDay() : day,
          isCancelled: false
        }).select('period duration');

        // Get teacher's availability slots
        const availability = await Availability.findOne({
          teacher: teacher._id,
          day: day === 'Today' ? helpers.getCurrentDay() : day
        }).select('periods');

        // Calculate free slots
        const freeSlots = [];
        if (availability) {
          availability.periods.forEach(period => {
            if (period.available) {
              const isScheduled = scheduledClasses.some(cls => 
                cls.period <= period.period && period.period < cls.period + cls.duration
              );
              if (!isScheduled) {
                freeSlots.push(helpers.formatTimeSlot(period.period));
              }
            }
          });
        }

        return {
          ...teacher.toObject(),
          availability: {
            [day]: freeSlots
          }
        };
      })
    );

    // Filter out teachers with no availability
    const availableTeachers = teachersWithAvailability.filter(
      teacher => teacher.availability[day]?.length > 0
    );

    logger.info(`Fetched available teachers for student ${studentId}`);

    res.json({
      success: true,
      data: availableTeachers
    });

  } catch (error) {
    logger.error(`Get available teachers error: ${error.message}`);
    throw error;
  }
};

const bookAppointment = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { teacherId, slot, purpose } = req.body;

    // Verify teacher exists
    const teacher = await User.findById(teacherId).select('firstName lastName email');
    if (!teacher || teacher.role !== 'teacher') {
      throw new ApiError(404, 'Teacher not found');
    }

    // Verify slot is actually available
    const [day, timeRange] = slot.split('|');
    const [startTime, endTime] = timeRange.split('-');
    
    const isAvailable = await Availability.findOne({
      teacher: teacherId,
      day,
      periods: {
        $elemMatch: {
          period: helpers.parseTimeToPeriod(startTime),
          available: true
        }
      }
    });

    if (!isAvailable) {
      throw new ApiError(400, 'Time slot no longer available');
    }

    // Create appointment (in a real app, this would be a separate model)
    const appointment = {
      student: studentId,
      teacher: teacherId,
      day,
      startTime,
      endTime,
      purpose,
      status: 'pending',
      createdAt: new Date()
    };

    // TODO: Send notification to teacher
    // TODO: Add to calendar

    logger.info(`Appointment booked by ${studentId} with ${teacherId}`);

    res.json({
      success: true,
      message: 'Appointment booked successfully',
      data: {
        teacher,
        slot,
        purpose
      }
    });

  } catch (error) {
    logger.error(`Book appointment error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getAvailableTeachers,
  bookAppointment
};