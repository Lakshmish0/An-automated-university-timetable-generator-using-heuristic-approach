import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  PanResponder,
  Dimensions
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../config/theme";
import Card from "../common/Card";
import Button from "../common/Button";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`);

// Default schedule structure
const defaultSchedule = days.map(day => ({
  day,
  classes: timeSlots.map(() => ({ course: "Free" }))
}));

// Helper function to get color for course
const getColorForCourse = (course) => {
  const colors = {
    Math: "#FFD700",
    Science: "#87CEEB",
    History: "#98FB98",
    English: "#FFA07A",
    Art: "#BA55D3",
    Free: "#F5F5F5"
  };
  return colors[course] || "#DDDDDD";
};

const PersonalSchedule = ({ schedule = defaultSchedule, onUpdateSchedule, compact }) => {
  const theme = useTheme();
  const [editing, setEditing] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [tempSchedule, setTempSchedule] = useState(schedule);
  const dragPosition = useRef(new Animated.ValueXY()).current;
  const { width } = Dimensions.get("window");

  // Initialize pan responder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        if (!editing) return;
        
        const { locationX, locationY } = gestureState;
        const dayIndex = Math.floor(locationX / (width / days.length));
        const timeIndex = Math.floor((locationY - 100) / 60);

        if (
          dayIndex >= 0 &&
          dayIndex < days.length &&
          timeIndex >= 0 &&
          timeIndex < timeSlots.length
        ) {
          const classInfo = tempSchedule[dayIndex]?.classes[timeIndex];
          if (classInfo && classInfo.course !== "Free") {
            setDragging({
              classInfo,
              originalPosition: { dayIndex, timeIndex },
            });
            dragPosition.setValue({
              x: dayIndex * (width / days.length),
              y: 100 + timeIndex * 60,
            });
          }
        }
      },
      onPanResponderMove: Animated.event(
        [null, { dx: dragPosition.x, dy: dragPosition.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        if (!dragging || !editing) return;

        const { moveX, moveY } = gestureState;
        const newDayIndex = Math.floor(moveX / (width / days.length));
        const newTimeIndex = Math.floor((moveY - 100) / 60);

        if (
          newDayIndex >= 0 &&
          newDayIndex < days.length &&
          newTimeIndex >= 0 &&
          newTimeIndex < timeSlots.length
        ) {
          const newSchedule = JSON.parse(JSON.stringify(tempSchedule));

          // Remove from original position
          const originalDay = dragging.originalPosition.dayIndex;
          const originalTime = dragging.originalPosition.timeIndex;
          if (newSchedule[originalDay]?.classes) {
            newSchedule[originalDay].classes[originalTime] = { course: "Free" };
          }

          // Add to new position
          if (newSchedule[newDayIndex]?.classes) {
            newSchedule[newDayIndex].classes[newTimeIndex] = dragging.classInfo;
          }

          setTempSchedule(newSchedule);
        }

        setDragging(null);
        dragPosition.setValue({ x: 0, y: 0 });
      },
    })
  ).current;

  // Update tempSchedule when schedule prop changes
  useEffect(() => {
    if (schedule && Array.isArray(schedule)) {
      setTempSchedule(schedule);
    } else {
      setTempSchedule(defaultSchedule);
    }
  }, [schedule]);

  const handleSave = () => {
    if (onUpdateSchedule) {
      onUpdateSchedule(tempSchedule);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setTempSchedule(schedule || defaultSchedule);
    setEditing(false);
  };

  const renderClass = (classInfo, dayIndex, timeIndex) => {
    if (!classInfo || classInfo.course === "Free") {
      return (
        <View
          style={[
            styles.classCell,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        />
      );
    }

    return (
      <View
        style={[
          styles.classCell,
          {
            backgroundColor: getColorForCourse(classInfo.course),
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text
          style={[styles.classText, { color: theme.colors.onPrimary }]}
          numberOfLines={2}
        >
          {classInfo.course}
        </Text>
        <Text
          style={[styles.classRoom, { color: theme.colors.onPrimary }]}
          numberOfLines={1}
        >
          {classInfo.room}
        </Text>
      </View>
    );
  };

  if (compact) {
    // Safely access today's classes (Monday by default)
    const todayClasses = tempSchedule[0]?.classes || [];
    
    return (
      <Card style={styles.compactContainer}>
        <Text style={[styles.compactTitle, { color: theme.colors.primary }]}>
          Today's Classes
        </Text>
        {todayClasses
          .filter(classInfo => classInfo && classInfo.course !== "Free")
          .map((classInfo, index) => (
            <View key={index} style={styles.compactClass}>
              <View
                style={[
                  styles.compactColor,
                  { backgroundColor: getColorForCourse(classInfo.course) },
                ]}
              />
              <View style={styles.compactText}>
                <Text style={{ color: theme.colors.primary }}>
                  {classInfo.course}
                </Text>
                <Text style={{ color: theme.colors.placeholder, fontSize: 12 }}>
                  {classInfo.room || 'N/A'} • {timeSlots[index] || 'N/A'}
                </Text>
              </View>
            </View>
          ))}
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          My Weekly Schedule
        </Text>
        {editing ? (
          <View style={styles.editButtons}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              type="outline"
              style={styles.editButton}
              textStyle={styles.buttonText}
            />
            <Button
              title="Save"
              onPress={handleSave}
              style={styles.editButton}
              textStyle={styles.buttonText}
            />
          </View>
        ) : (
          <Button
            title="Edit"
            onPress={() => setEditing(true)}
            icon="pencil"
            type="outline"
            style={styles.editButton}
            textStyle={styles.buttonText}
          />
        )}
      </View>

      <View {...panResponder.panHandlers} style={styles.scheduleContainer}>
        {/* Header row with days */}
        <View style={styles.dayHeaderRow}>
          <View
            style={[
              styles.timeHeader,
              { backgroundColor: theme.colors.surface },
            ]}
          />
          {days.map((day) => (
            <View
              key={day}
              style={[
                styles.dayHeader,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.dayHeaderText,
                  { color: theme.colors.onPrimary },
                ]}
              >
                {day.substring(0, 3)}
              </Text>
            </View>
          ))}
        </View>

        {/* Time slots */}
        {timeSlots.map((time, timeIndex) => (
          <View key={time} style={styles.timeRow}>
            <View
              style={[
                styles.timeLabel,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text style={[styles.timeText, { color: theme.colors.primary }]}>
                {time}
              </Text>
            </View>

            {days.map((day, dayIndex) => (
              <View key={`${day}-${time}`}>
                {renderClass(
                  tempSchedule[dayIndex]?.classes[timeIndex],
                  dayIndex,
                  timeIndex
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Dragging element */}
        {dragging && (
          <Animated.View
            style={[
              styles.draggingClass,
              {
                backgroundColor: getColorForCourse(dragging.classInfo.course),
                transform: [
                  { translateX: dragPosition.x },
                  { translateY: dragPosition.y },
                ],
              },
            ]}
          >
            <Text
              style={[styles.classText, { color: theme.colors.onPrimary }]}
              numberOfLines={2}
            >
              {dragging.classInfo.course}
            </Text>
            <Text
              style={[styles.classRoom, { color: theme.colors.onPrimary }]}
              numberOfLines={1}
            >
              {dragging.classInfo.room}
            </Text>
          </Animated.View>
        )}
      </View>

      {editing && (
        <View style={styles.legend}>
          <Text style={[styles.legendTitle, { color: theme.colors.primary }]}>
            Drag and drop classes to reschedule
          </Text>
          <View style={styles.legendItems}>
            {Array.from(
              new Set(
                tempSchedule.flatMap(day => 
                  day.classes?.map(c => c.course).filter(c => c !== "Free") || []
                )
              )
            ).map((course) => (
              <View key={course} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: getColorForCourse(course) },
                  ]}
                />
                <Text style={[styles.legendText, { color: theme.colors.primary }]}>
                  {course}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F5F5F5',
  },
  compactContainer: {
    padding: 24,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  compactTitle: {
    fontSize: 1,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 16,
    color: '#000000',
  },
  compactClass: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  compactColor: {
    width: 24,
    height: 24,
    borderRadius: 0,
    marginRight: 16,
    borderWidth: 3,
    borderColor: '#000000',
  },
  compactText: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  title: {
    width: 150,
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  editButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
  },
  scheduleContainer: {
    flex: 1,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
    overflow: 'hidden',
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
    flex: 1,
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
    height: 80,
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
  classCell: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    borderRightWidth: 3,
    borderRightColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  classText: {
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#000000',
  },
  classRoom: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#000000',
  },
  draggingClass: {
    position: 'absolute',
    width: Dimensions.get('window').width / days.length - 20,
    height: 80 - 20,
    padding: 8,
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  legend: {
    marginTop: 24,
    padding: 24,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  legendTitle: {
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 16,
    color: '#000000',
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#F5F5F5',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  legendColor: {
    width: 24,
    height: 24,
    borderRadius: 0,
    marginRight: 12,
    borderWidth: 3,
    borderColor: '#000000',
  },
  legendText: {
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
});

export default PersonalSchedule;