import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../common/Card';
import Button from '../common/Button';

const { width } = Dimensions.get('window');
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ClassSchedule = ({ scheduleData }) => {
  const theme = useTheme();
  const [currentDay, setCurrentDay] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const classes = scheduleData?.find(day => day.name === days[currentDay])?.classes || [];

  const handleDayChange = (newIndex) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: newIndex > currentDay ? -width : width,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentDay(newIndex);
      slideAnim.setValue(newIndex > currentDay ? width : -width);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  return (
    <View style={styles.container}>
    <View style={styles.daySelector}>
      {days.map((day, index) => (
        <TouchableOpacity
          key={day}
          onPress={() => handleDayChange(index)}
          style={[
            styles.dayButton,
            {
              backgroundColor: currentDay === index ? '#FFD700' : '#FFFFFF',
            }
          ]}
        >
          <Text style={styles.dayText}>
            {day.substring(0, 3)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <Animated.View
      style={[
        styles.scheduleContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        }
      ]}
    >
      {classes.length > 0 ? (
        classes.map((classItem, index) => (
          <Card key={index} style={styles.classCard}>
            <View style={styles.classTime}>
              <MaterialCommunityIcons 
                name="clock-outline" 
                size={24} 
                color="#000000" 
              />
              <Text style={styles.timeText}>
                {classItem.time}
              </Text>
            </View>
            <Text style={styles.className}>
              {classItem.course}
            </Text>
            <View style={styles.classDetails}>
              <Text style={styles.detailText}>
                {classItem.teacher}
              </Text>
              <Text style={styles.detailText}>
                Room: {classItem.room}
              </Text>
            </View>
          </Card>
        ))
      ) : (
        <Card style={styles.emptyCard}>
          <MaterialCommunityIcons 
            name="emoticon-sad-outline" 
            size={48} 
            color="#000000" 
          />
          <Text style={styles.emptyText}>
            No classes scheduled for {days[currentDay]}
          </Text>
          <Button 
            title="View Full Timetable" 
            onPress={() => {}} 
            type="outline" 
            style={styles.emptyButton}
            textStyle={{ color: '#000000', fontWeight: '700' }}
          />
        </Card>
      )}
    </Animated.View>
  </View>
  );
};

const getRandomColor = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#A28DFF'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  dayButton: {
    flex: 1,
    padding: 12,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
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
  scheduleContainer: {
    flex: 1,
  },
  classCard: {
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
  classTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFD700',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  timeText: {
    marginLeft: 8,
    fontWeight: '700',
    fontSize: 16,
    color: '#000000',
  },
  className: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12,
    color: '#000000',
    textTransform: 'uppercase',
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#F5F5F5',
  },
  detailText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
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
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 24,
    textAlign: 'center',
    color: '#000000',
    textTransform: 'uppercase',
  },
  emptyButton: {
    width: '100%',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFD700',
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
});

export default ClassSchedule;