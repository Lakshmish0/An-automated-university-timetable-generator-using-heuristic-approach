import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../common/Card';
import Button from '../common/Button';

const { width } = Dimensions.get('window');
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = [
  '08:40 - 09:40',
  '09:40 - 10:40',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 13:40',
  '13:40 - 14:40',
  '14:40 - 15:40',
  '15:40 - 16:40',
];

const TimetableDisplay = ({ timetableData }) => {
  const theme = useTheme();
  const [zoomLevel, setZoomLevel] = useState(1);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  // const [selectedClass, setSelectedClass] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleZoomIn = () => {
    if (zoomLevel < 1.5) {
      setZoomLevel(zoomLevel + 0.1);
      Animated.spring(scaleAnim, {
        toValue: zoomLevel + 0.1,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.8) {
      setZoomLevel(zoomLevel - 0.1);
      Animated.spring(scaleAnim, {
        toValue: zoomLevel - 0.1,
        useNativeDriver: true,
      }).start();
    }
  };

  // const handleClassSelect = (classInfo) => {
  //   setSelectedClass(classInfo);
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 300,
  //     useNativeDriver: true,
  //   }).start();
  // };

  // const closeClassDetails = () => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 0,
  //     duration: 200,
  //     useNativeDriver: true,
  //   }).start(() => setSelectedClass(null));
  // };

  const renderTimetable = () => {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.timetableContainer, { minWidth: 100 + days.length * 150 }]}>
            {/* Header row with days */}
            <View style={styles.headerRow}>
              <View style={[styles.timeHeader, { backgroundColor: '#FFD700', borderColor: '#000000' }]}>
                <Text style={[styles.headerText, { color: '#000000' }]}>Time/Day</Text>
              </View>
              {days.map(day => (
                <View
                  key={day}
                  style={[
                    styles.dayHeader,
                    { backgroundColor: '#FFD700', borderColor: '#000000' }
                  ]}
                >
                  <Text style={[styles.headerText, { color: '#000000' }]}>{day.substring(0, 3)}</Text>
                </View>
              ))}
            </View>

            {/* Time slots */}
            {timeSlots.map((time, timeIndex) => (
              <View key={time} style={styles.timeRow}>
                <View style={[styles.timeLabel, { backgroundColor: '#FFFFFF', borderColor: '#000000' }]}>
                  <Text style={[styles.timeText, { color: '#000000' }]}>{time.substring(0, 5)}</Text>
                </View>
                {days.map(day => {
                  const daySchedule = timetableData?.find(d => d.day === day);
                  const classInfo = daySchedule?.classes[timeIndex];
                  const isEmpty = !classInfo || classInfo.course === 'Free';

                  return (
                    <TouchableOpacity
                      key={`${day}-${time}`}
                      // onPress={() => !isEmpty && handleClassSelect(classInfo)}
                      style={[
                        styles.classCell,
                        {
                          backgroundColor: isEmpty ? '#FFFFFF' : getRandomColor(),
                          borderColor: '#000000',
                        }
                      ]}
                    >
                      {!isEmpty && (
                        <>
                          <Text
                            style={[
                              styles.classText,
                              { color: '#000000' }
                            ]}
                            numberOfLines={2}
                          >
                            {classInfo.course}
                          </Text>
                          <Text
                            style={[
                              styles.teacherText,
                              { color: '#000000' }
                            ]}
                            numberOfLines={1}
                          >
                            {classInfo.teacher}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContentContainer}
    >
      <View style={styles.container}>
        {/* <View style={styles.controls}>
          <View style={styles.zoomControls}>
            <TouchableOpacity onPress={handleZoomOut} style={styles.zoomButton}>
              <MaterialIcons name="zoom-out" size={24} color={'#000000'} />
            </TouchableOpacity>
            <Text style={[styles.zoomText, { color: '#000000' }]}>
              {Math.round(zoomLevel * 100)}%
            </Text>
            <TouchableOpacity onPress={handleZoomIn} style={styles.zoomButton}>
              <MaterialIcons name="zoom-in" size={24} color={'#000000'} />
            </TouchableOpacity>
          </View>
        </View> */}

        {renderTimetable()}

        {/* Class Details Modal */}
        {/* {selectedClass && (
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <Card style={styles.modalContent}>
              <TouchableOpacity
                onPress={closeClassDetails}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={'#000000'} />
              </TouchableOpacity>

              <Text style={[styles.modalTitle, { color: '#000000' }]}>
                {selectedClass.course}
              </Text>

              <View style={styles.detailRow}>
                <MaterialIcons
                  name="account"
                  size={20}
                  color={'#000000'}
                />
                <Text style={[styles.detailText, { color: '#000000' }]}>
                  {selectedClass.teacher}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <MaterialIcons
                  name="clock"
                  size={20}
                  color={'#000000'}
                />
                <Text style={[styles.detailText, { color: '#000000' }]}>
                  {selectedClass.time}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <MaterialIcons
                  name="map-marker"
                  size={20}
                  color={'#000000'}
                />
                <Text style={[styles.detailText, { color: '#000000' }]}>
                  Room: {selectedClass.room || 'Not specified'}
                </Text>
              </View>

              <Button
                title="Set Reminder"
                onPress={() => {}}
                style={styles.modalButton}
                icon="bell"
              />
              <Button
                title="View Materials"
                onPress={() => {}}
                type="outline"
                style={styles.modalButton}
                icon="file-document"
              />
            </Card>
          </Animated.View>
        )} */}
      </View>
    </ScrollView>
  );
};

const getRandomColor = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#A28DFF'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 16,
  },
  container: {
    alignItems: 'center', // Center the timetable container
    backgroundColor: '#F5F5F5',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
    padding: 16,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  zoomButton: {
    padding: 12,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  zoomText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
  },
  timetableContainer: {
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
  },
  timeHeader: {
    width: 100,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 3,
    borderRightColor: '#000000',
  },
  dayHeader: {
    width: 150,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 3,
    borderRightColor: '#000000',
  },
  headerText: {
    fontWeight: '900',
    fontSize: 16,
    textTransform: 'uppercase',
    color: '#000000',
  },
  timeRow: {
    flexDirection: 'row',
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
  },
  timeLabel: {
    width: 100,
    padding: 16,
    justifyContent: 'center',
    borderRightWidth: 3,
    borderRightColor: '#000000',
  },
  timeText: {
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
    color: '#000000',
  },
  classCell: {
    width: 150,
    minHeight: 80,
    padding: 10,
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#000000',
  },
  classText: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
    color: '#000000',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  teacherText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    padding: 24,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 12,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 24,
    textAlign: 'center',
    color: '#000000',
    textTransform: 'uppercase',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFD700',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  detailText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  modalButton: {
    marginTop: 16,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
});

export default TimetableDisplay;