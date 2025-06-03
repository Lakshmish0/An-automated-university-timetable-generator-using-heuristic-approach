import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Header from '../../components/common/Header';
import Loader from '../../components/common/Loader';
import  AvailabilityManager  from '../../components/teacher/AvailabilityManager';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');

const ScheduleScreen = ({ navigation }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('schedule');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [scheduleData, setscheduleData] = useState([]);

  useEffect(() => {
      handleRefresh();
    }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const userJson = await AsyncStorage.getItem("user");
      if (!userJson) {
        throw new Error("User not found in storage");
      }

      const user = JSON.parse(userJson);
      const token = user.token;

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}:3000/api/teacher/week_timetable`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token here
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch timetable");
      }

      const data = await response.json();
      setscheduleData(data.data); // Ensure backend sends `timetable` as key
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sample schedule data with days, time slots, and class details
  // const scheduleData = [
  //   {
  //     day: 'Monday',
  //     classes: [
  //       { time: '8:00-9:00', subject: 'Data Structures', room: 'CS-202', section: 'CS-A', type: 'Lecture' },
  //       { time: '10:00-11:00', subject: 'Algorithms', room: 'CS-205', section: 'CS-A', type: 'Lecture' },
  //       { time: '2:00-3:00', subject: 'Office Hours', room: 'CS-301', section: '', type: 'Office' },
  //     ]
  //   },
  //   {
  //     day: 'Tuesday',
  //     classes: [
  //       { time: '9:00-10:00', subject: 'Data Structures Lab', room: 'CS-210', section: 'CS-B', type: 'Lab' },
  //       { time: '1:00-2:00', subject: 'Database Systems', room: 'CS-203', section: 'CS-A', type: 'Lecture' },
  //     ]
  //   },
  //   {
  //     day: 'Wednesday',
  //     classes: [
  //       { time: '10:00-11:00', subject: 'Algorithms', room: 'CS-205', section: 'CS-A', type: 'Lecture' },
  //       { time: '3:00-4:00', subject: 'Research Meeting', room: 'CS-401', section: '', type: 'Meeting' },
  //     ]
  //   },
  //   {
  //     day: 'Thursday',
  //     classes: [
  //       { time: '11:00-12:00', subject: 'Department Meeting', room: 'CS-100', section: '', type: 'Meeting' },
  //       { time: '2:00-3:00', subject: 'Computer Networks', room: 'CS-207', section: 'CS-B', type: 'Lecture' },
  //     ]
  //   },
  //   {
  //     day: 'Friday',
  //     classes: [
  //       { time: '9:00-10:00', subject: 'Data Structures', room: 'CS-202', section: 'CS-A', type: 'Lecture' },
  //       { time: '2:00-3:00', subject: 'Office Hours', room: 'CS-301', section: '', type: 'Office' },
  //     ]
  //   },
  // ];


  // Time slots for the timetable
  const timeSlots = [
    '8:40-9:40','9:40-10:40','11:00-12:00','12:00-1:00','1:00-1:40','1:40-2:40','2:40-3:40', '3:40-4:40'
  ];

  // Helper function to get class for a specific day and time
  const getClassForTime = (day, time) => {
    const daySchedule = scheduleData.find(d => d.day === day);
    if (!daySchedule) return null;
    return daySchedule.classes.find(c => c.time === time) || null;
  };

  // Function to render a single timetable cell
  const renderTimetableCell = (day, time) => {
    const classInfo = getClassForTime(day, time);
    const isFree = !classInfo;
    const isBreak = time === '12:00-13:00'; // Lunch break
    
    return (
      <View 
        key={`${day}-${time}`} 
        style={[
          styles.timetableCell,
          isFree && styles.freeCell,
          isBreak && styles.breakCell,
          { borderColor: theme.colors.border }
        ]}
      >
        {classInfo ? (
          <>
            <Text style={[styles.subjectText, { color: theme.colors.primary }]}>
              {classInfo.subject}
            </Text>
            <Text style={[styles.detailText, { color: theme.colors.placeholder }]}>
              CODE - {classInfo.room}
            </Text>
            {classInfo.section && (
              <Text style={[styles.detailText, { color: theme.colors.placeholder }]}>
                Sec: {classInfo.section}
              </Text>
            )}
          </>
        ) : isBreak ? (
          <Text style={[styles.subjectText, { color: theme.colors.primary }]}>
            LUNCH
          </Text>
        ) : null}
      </View>
    );
  };

  const [availability, setAvailability] = useState({
    'Monday': ['3:00-4:00', '4:00-5:00'],
    'Wednesday': ['1:00-2:00'],
    'Friday': ['3:00-4:00'],
  });


  const handleEditToggle = () => {
    setEditing(!editing);
    Animated.spring(slideAnim, {
      toValue: editing ? 0 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Schedule"
        onBack={() => navigation.goBack()}
        rightIcon={editing ? 'check' : 'pencil'}
        onRightPress={handleEditToggle}
      />

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            { 
              backgroundColor: activeTab === 'schedule' 
                ? theme.colors.primary 
                : theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => setActiveTab('schedule')}
        >
          <MaterialCommunityIcons 
            name="calendar" 
            size={20} 
            color={activeTab === 'schedule' ? theme.colors.onPrimary : theme.colors.primary} 
          />
          <Text 
            style={[
              styles.tabText,
              { 
                color: activeTab === 'schedule' 
                  ? theme.colors.onPrimary 
                  : theme.colors.primary,
              }
            ]}
          >
            Schedule
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[
            styles.tab,
            { 
              backgroundColor: activeTab === 'availability' 
                ? theme.colors.primary 
                : theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => setActiveTab('availability')}
        >
          <MaterialCommunityIcons 
            name="clock" 
            size={20} 
            color={activeTab === 'availability' ? theme.colors.onPrimary : theme.colors.primary} 
          />
          <Text 
            style={[
              styles.tabText,
              { 
                color: activeTab === 'availability' 
                  ? theme.colors.onPrimary 
                  : theme.colors.primary,
              }
            ]}
          >
            Availability
          </Text>
        </TouchableOpacity> */}
      </View>
      <ScrollView // Ensure ScrollView wraps the content
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      <Animated.View 
        style={[
          styles.content,
          {
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -50]
              })
            }]
          }
        ]}
      >
        {activeTab === 'schedule' ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Header row with days */}
              <View style={styles.dayHeaderRow}>
                <View style={[styles.timeHeader, { backgroundColor: theme.colors.surface }]} />
                {scheduleData.map((day) => (
                  <View
                    key={day.day}
                    style={[
                      styles.dayHeader,
                      { backgroundColor: theme.colors.primary }
                    ]}
                  >
                    <Text style={[styles.dayHeaderText, { color: theme.colors.onPrimary }]}>
                      {day.day.substring(0, 3)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Time slots */}
              {timeSlots.map((time) => (
                <View key={time} style={styles.timeRow}>
                  <View style={[styles.timeLabel, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.timeText, { color: theme.colors.primary }]}>
                      {time.split('-')[0]}
                    </Text>
                  </View>

                  {scheduleData.map((day) => (
                    renderTimetableCell(day.day, time)
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <AvailabilityManager 
  initialAvailability={availability}
  onSave={(updatedAvailability) => {
    setAvailability(updatedAvailability);
    // You might also want to save this to your backend here
  }}
  editable={editing}
/>
        )}
      </Animated.View>
      </ScrollView>

      {loading && (
        <View style={styles.loader}>
          <Loader size={60} />
          <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
            Loading schedule...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
    marginBottom: 10,
  },
  tabText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
  content: {
    // flex: 1,
    paddingHorizontal: 0,
    paddingBottom: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  dayHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
  },
  timeHeader: {
    width: 80,
    height: 60,
    borderRightWidth: 3,
    borderRightColor: '#000000',
    backgroundColor: '#F5F5F5',
  },
  dayHeader: {
    width: 180,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRightWidth: 3,
    borderRightColor: '#000000',
  },
  dayHeaderText: {
    fontWeight: '900',
    fontSize: 16,
    textTransform: 'uppercase',
    color: '#000000',
  },
  timeRow: {
    flexDirection: 'row',
    height: 100,
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
  },
  timeLabel: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 3,
    borderRightColor: '#000000',
    backgroundColor: '#F5F5F5',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
  timetableCell: {
    width: 180,
    padding: 8,
    justifyContent: 'center',
    borderRightWidth: 3,
    borderRightColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  freeCell: {
    backgroundColor: '#F5F5F5',
  },
  breakCell: {
    backgroundColor: '#FFFACD',
  },
  subjectText: {
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#000000',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245,245,245,0.9)',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
});

export default ScheduleScreen;