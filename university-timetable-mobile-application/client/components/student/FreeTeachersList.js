import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../common/Card';
import InputField from '../common/InputField';
import Button from '../common/Button';

const FreeTeachersList = ({ teachers, 
  onBookAppointment, 
  searchQuery, 
  selectedDay, 
  setSelectedDay }) => {
  const theme = useTheme();
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  const animatedValues = useRef(new Map()).current;

  const days = ['Today', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAnimatedValue = (teacherId) => {
    if (!animatedValues.has(teacherId)) {
      animatedValues.set(teacherId, new Animated.Value(0));
    }
    return animatedValues.get(teacherId);
  };

  const toggleTeacher = (teacherId) => {
    const wasExpanded = expandedTeacher === teacherId;
    const newExpandedTeacher = wasExpanded ? null : teacherId;
    setExpandedTeacher(newExpanded);

    // Animate the clicked item
    if (newExpandedTeacher === teacherId) {
      Animated.spring(getAnimatedValue(teacherId), {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(getAnimatedValue(teacherId), {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }

    // Collapse any previously expanded item
    if (expandedTeacher && expandedTeacher !== teacherId) {
      Animated.spring(getAnimatedValue(expandedTeacher), {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const renderTeacherItem = ({ item }) => {
    const animatedValue = getAnimatedValue(item.id);
    const isExpanded = expandedTeacher === item.id;

    const heightInterpolation = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 200],
    });

    const rotateInterpolation = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    const availableSlots = item.availability[selectedDay] || [];

    return (
      <Animated.View style={{ height: heightInterpolation, overflow: 'hidden' }}>
        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={() => toggleTeacher(item.id)}
        >
          <Card style={styles.teacherCard}>
            <View style={styles.teacherHeader}>
              <View style={styles.teacherInfo}>
                <Text style={[styles.teacherName, { color: theme.colors.primary }]}>
                  {item.name}
                </Text>
                <Text style={[styles.teacherDept, { color: theme.colors.placeholder }]}>
                  {item.department}
                </Text>
              </View>
              <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color={theme.colors.primary}
                />
              </Animated.View>
            </View>

            {isExpanded && (
              <View style={styles.teacherDetails}>
                <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
                  Available Slots ({selectedDay})
                </Text>

                {availableSlots.length > 0 ? (
                  <View style={styles.slotsContainer}>
                    {availableSlots.map((slot, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => onBookAppointment(item, slot)}
                        style={[
                          styles.slotButton,
                          { backgroundColor: theme.colors.secondary }
                        ]}
                      >
                        <Text style={[styles.slotText, { color: theme.colors.onSecondary }]}>
                          {slot}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text style={[styles.noSlotsText, { color: theme.colors.placeholder }]}>
                    No available slots for {selectedDay}
                  </Text>
                )}

                <View style={styles.contactRow}>
                  <Button
                    title="Send Message"
                    onPress={() => {}}
                    type="outline"
                    style={styles.contactButton}
                    icon="email"
                  />
                  <Button
                    title="View Profile"
                    onPress={() => {}}
                    type="outline"
                    style={styles.contactButton}
                    icon="account"
                  />
                </View>
              </View>
            )}
          </Card>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.daySelector}>
        {days.map(day => (
          <TouchableOpacity
          key={day}
          onPress={() => setSelectedDay(day)} // This needs setSelectedDay from props
          style={[
            styles.dayButton,
            {
              backgroundColor: selectedDay === day ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
          >
            <Text
              style={[
                styles.dayText,
                {
                  color: selectedDay === day ? theme.colors.onPrimary : theme.colors.primary,
                }
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTeachers}
        renderItem={renderTeacherItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// Update the styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  daySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  dayButton: {
    padding: 12,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    marginBottom: 8,
    minWidth: '30%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  dayText: {
    fontWeight: '900',
    fontSize: 14,
    textTransform: 'uppercase',
    color: '#000000',
  },
  listContent: {
    paddingBottom: 16,
  },
  teacherCard: {
    marginBottom: 16,
    padding: 20,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -4 }, { translateY: -4 }],
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  teacherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
    color: '#000000',
    textTransform: 'uppercase',
  },
  teacherDept: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  teacherDetails: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 3,
    borderTopColor: '#000000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 16,
    color: '#000000',
    textTransform: 'uppercase',
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  slotButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFD700',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  slotText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    textTransform: 'uppercase',
  },
  noSlotsText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000',
    textTransform: 'uppercase',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
});

export default FreeTeachersList;