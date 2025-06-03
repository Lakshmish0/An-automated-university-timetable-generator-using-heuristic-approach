// controllers/teacher/availability.controller.js
const Availability = require('../../models/Availability.model');
const { ApiError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');

const getTeacherAvailability = async (req, res) => {
  try {
    const teacherId = req.user._id;
    
    const availability = await Availability.findOne({ teacher: teacherId });
    
    if (!availability) {
      // Return default availability if none exists
      return res.json({
        success: true,
        data: {
          regularAvailability: {},
          exceptions: [],
          officeHours: []
        }
      });
    }

    logger.info(`Fetched availability for teacher ${teacherId}`);

    res.json({
      success: true,
      data: availability
    });

  } catch (error) {
    logger.error(`Get availability error: ${error.message}`);
    throw error;
  }
};

const updateAvailability = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { regularAvailability, exceptions, officeHours } = req.body;

    // Validate input
    if (!regularAvailability || typeof regularAvailability !== 'object') {
      throw new ApiError(400, 'Invalid availability data');
    }

    // Update or create availability
    const availability = await Availability.findOneAndUpdate(
      { teacher: teacherId },
      { 
        regularAvailability,
        exceptions: exceptions || [],
        officeHours: officeHours || [],
        lastUpdated: new Date()
      },
      { upsert: true, new: true, runValidators: true }
    );

    logger.info(`Updated availability for teacher ${teacherId}`);

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: availability
    });

  } catch (error) {
    logger.error(`Update availability error: ${error.message}`);
    throw error;
  }
};

const addException = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { date, timeSlots, reason } = req.body;

    // Validate input
    if (!date || !timeSlots || !Array.isArray(timeSlots)) {
      throw new ApiError(400, 'Invalid exception data');
    }

    const newException = {
      date,
      timeSlots,
      reason: reason || 'Unavailable',
      createdAt: new Date()
    };

    // Add exception to availability
    const availability = await Availability.findOneAndUpdate(
      { teacher: teacherId },
      { $push: { exceptions: newException } },
      { new: true, runValidators: true }
    );

    if (!availability) {
      throw new ApiError(404, 'Availability record not found');
    }

    logger.info(`Added exception for teacher ${teacherId}`);

    res.json({
      success: true,
      message: 'Exception added successfully',
      data: availability.exceptions
    });

  } catch (error) {
    logger.error(`Add exception error: ${error.message}`);
    throw error;
  }
};

const removeException = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { exceptionId } = req.params;

    // Remove exception from availability
    const availability = await Availability.findOneAndUpdate(
      { teacher: teacherId },
      { $pull: { exceptions: { _id: exceptionId } } },
      { new: true }
    );

    if (!availability) {
      throw new ApiError(404, 'Availability record not found');
    }

    logger.info(`Removed exception ${exceptionId} for teacher ${teacherId}`);

    res.json({
      success: true,
      message: 'Exception removed successfully',
      data: availability.exceptions
    });

  } catch (error) {
    logger.error(`Remove exception error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getTeacherAvailability,
  updateAvailability,
  addException,
  removeException
};