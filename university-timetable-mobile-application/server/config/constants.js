// config/constants.js
module.exports = {
  // User roles
  ROLES: {
    STUDENT: 'student',
    TEACHER: 'teacher',
    COORDINATOR: 'coordinator',
    ADMIN: 'admin'
  },

  // Timetable statuses
  TIMETABLE_STATUS: {
    DRAFT: 'draft',
    PENDING_APPROVAL: 'pending_approval',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    PUBLISHED: 'published'
  },

  // Days of week
  DAYS: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  // Time periods
  PERIODS: Array.from({ length: 8 }, (_, i) => i + 1), // [1, 2, ..., 8]

  // Notification types
  NOTIFICATION_TYPES: {
    TIMETABLE: 'timetable',
    APPOINTMENT: 'appointment',
    SYSTEM: 'system',
    ALERT: 'alert'
  },

  // Academic settings
  ACADEMIC: {
    MAX_SEMESTERS: 8,
    MAX_HOURS_PER_WEEK: 20,
    MAX_CONTINUOUS_CLASSES: 2
  },

  // Frontend routes (sync with your frontend navigation)
  FRONTEND_ROUTES: {
    STUDENT: {
      DASHBOARD: '/student/dashboard',
      TIMETABLE: '/student/timetable',
      TEACHERS: '/student/teachers'
    },
    TEACHER: {
      DASHBOARD: '/teacher/dashboard',
      AVAILABILITY: '/teacher/availability'
    },
    COORDINATOR: {
      DASHBOARD: '/coordinator/dashboard',
      TIMETABLE_MANAGEMENT: '/coordinator/timetable'
    }
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // Cache settings
  CACHE: {
    TIMETABLE_TTL: 60 * 60 * 24, // 24 hours in seconds
    AVAILABILITY_TTL: 60 * 60 // 1 hour in seconds
  }
};