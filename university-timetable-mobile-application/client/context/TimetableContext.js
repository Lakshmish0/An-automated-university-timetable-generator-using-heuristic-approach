import React, { createContext, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Calendar from 'expo-calendar';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../config/theme';

export const TimetableContext = createContext();

export const TimetableProvider = ({ children }) => {
  const [timetable, setTimetable] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const theme = useTheme();

  // Generate timetable based on preferences
  const generateTimetable = useCallback(async (preferences) => {
    setIsGenerating(true);
    
    try {
      // Simulate generation process
      const generated = await new Promise(resolve => {
        setTimeout(() => {
          const mockTimetable = createMockTimetable(preferences);
          resolve(mockTimetable);
        }, 3000);
      });
      
      setTimetable(generated);
      detectConflicts(generated);
      return generated;
    } catch (error) {
      Alert.alert('Error', 'Failed to generate timetable');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Add to device calendar
  const addToCalendar = async (event) => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please enable calendar access');
        return;
      }

      const calendarId = await getCalendarId();
      await Calendar.createEventAsync(calendarId, {
        title: event.course,
        startDate: new Date(event.startTime),
        endDate: new Date(event.endTime),
        location: event.room,
        notes: `Teacher: ${event.teacher}`,
      });

      Alert.alert('Success', 'Added to your calendar');
    } catch (error) {
      Alert.alert('Error', 'Failed to add to calendar');
      console.error(error);
    }
  };

  // Set reminder notification
  const setReminder = async (event) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Upcoming: ${event.course}`,
          body: `Starts at ${event.startTime} in ${event.room}`,
          data: { event },
        },
        trigger: { 
          seconds: 60 * 60, // 1 hour before
        },
      });

      Alert.alert('Reminder set', 'You will be notified 1 hour before');
    } catch (error) {
      Alert.alert('Error', 'Failed to set reminder');
      console.error(error);
    }
  };

  // Helper to get or create calendar
  const getCalendarId = async () => {
    const calendars = await Calendar.getCalendarsAsync();
    let calendar = calendars.find(c => c.title === 'University Schedule');
    
    if (!calendar) {
      calendar = await Calendar.createCalendarAsync({
        title: 'University Schedule',
        color: theme.colors.primary,
        entityType: Calendar.EntityTypes.EVENT,
        name: 'universitySchedule',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
    }
    
    return calendar.id;
  };

  // Mock timetable generation (would be replaced with real algorithm)
  const createMockTimetable = (preferences) => {
    // This is simplified - real implementation would consider constraints
    return {
      id: Date.now().toString(),
      generatedAt: new Date().toISOString(),
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timeSlots: Array.from({ length: 10 }, (_, i) => `${8 + i}:00-${9 + i}:00`),
      schedule: preferences.map(pref => ({
        ...pref,
        assignedTime: `${8 + Math.floor(Math.random() * 8)}:00-${9 + Math.floor(Math.random() * 8)}:00`,
        assignedDay: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][Math.floor(Math.random() * 5)],
      })),
    };
  };

  // Simple conflict detection
  const detectConflicts = (timetable) => {
    const conflicts = [];
    // This would be replaced with actual conflict detection logic
    if (Math.random() > 0.7) {
      conflicts.push({
        id: '1',
        type: 'Room conflict',
        message: 'CS-202 is double booked on Monday 10:00',
        severity: 'high',
      });
    }
    setConflicts(conflicts);
  };

  return (
    <TimetableContext.Provider value={{
      timetable,
      conflicts,
      isGenerating,
      generateTimetable,
      addToCalendar,
      setReminder,
    }}>
      {children}
    </TimetableContext.Provider>
  );
};