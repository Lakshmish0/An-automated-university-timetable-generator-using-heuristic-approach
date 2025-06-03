import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../config/theme";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Header from "../../components/common/Header";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

 
const { width } = Dimensions.get("window");

const Dashboard = ({ navigation }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Sample timetable data for today
  // const todayTimetable = [
  //   { time: "8:00", subject: "Math", room: "B-201", section: "CS-A" },
  //   { time: "9:00", subject: "Physics", room: "Lab-3", section: "CS-A" },
  //   { time: "10:00", subject: "Break", room: "", section: "" },
  //   { time: "11:00", subject: "Algorithms", room: "B-205", section: "CS-A" },
  //   { time: "12:00", subject: "Lunch", room: "", section: "" },
  //   {
  //     time: "1:00",
  //     subject: "Data Structures",
  //     room: "B-203",
  //     section: "CS-A",
  //   },
  //   { time: "2:00", subject: "Database", room: "Lab-2", section: "CS-A" },
  //   { time: "3:00", subject: "Free", room: "", section: "" },
  // ];
 
  const { user: authUser } = useAuth();

  const [user, setUser] = useState({
    name: "Teacher",
    email: "Teacher@gmail.com",
    role: "teacher",
  });

  const [todayTimetable, settodayTimetable] = useState({});

  useEffect(() => {
    if (authUser) {
      setUser((prev) => ({
        ...prev,
        name: authUser.name || prev.name,
        email: authUser.email || prev.email,
        role: authUser.role || prev.role,
      }));
    }

    const fetchTimetable = async () => {
      setLoading(true);
      try {
        const userJson = await AsyncStorage.getItem("user");
        if (!userJson) {
          throw new Error("User not found in storage");
        }

        const user = JSON.parse(userJson);
        const token = user.token;
        console.log("Sending token:", token);
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}:3000/api/teacher/timetable`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch timetable");
        }

        console.log("Fetched timetable:", data.data);
        settodayTimetable(data.data || []);
      } catch (error) {
        console.error("Fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [authUser]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const renderTimetableItem = (item, index) => {
    const isBreak = item.subject === "Break" || item.subject === "Lunch";
    const isFree = item.subject === "Free";

    return (
      <View
        key={index}
        style={[
          styles.timetableItem,
          isBreak && styles.breakItem,
          isFree && styles.freeItem,
          { borderColor: theme.colors.border },
        ]}
      >
        <Text style={[styles.timeText, { color: theme.colors.primary }]}>
          {item.time}
        </Text>
        {!isBreak && !isFree ? (
          <>
            <Text style={[styles.subjectText, { color: theme.colors.primary }]}>
              {item.subject} - {item.section}
            </Text>
            {/* <Text
              style={[styles.detailText, { color: theme.colors.placeholder }]}
            >
              {item.room} • 
            </Text> */}
          </>
        ) : (
          <Text style={[styles.subjectText, { color: theme.colors.primary }]}>
            {item.subject}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Dashboard"
        rightIcon="refresh"
        onRightPress={handleRefresh}
      />

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Welcome Card */}
          <Card style={styles.welcomeCard}>
            <View style={styles.welcomeContent}>
              <View>
                <Text
                  style={[styles.welcomeText, { color: theme.colors.primary }]}
                >
                  Welcome back,
                </Text>
                <Text
                  style={[styles.nameText, { color: theme.colors.primary }]}
                >
                  {user.name}
                </Text>
              </View>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="account"
                  size={40}
                  color="#000000"
                />
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>Departnent</Text>
                <Text style={styles.statLabel}>Artificial Intelligence &</Text>
                <Text style={styles.statLabel}>Machine Learning</Text>
              </View>
            </View>
            {/* <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text
                  style={[styles.statValue, { color: theme.colors.primary }]}
                >
                  {stats.classes}
                </Text>
                <Text
                  style={[styles.statLabel, { color: theme.colors.primary }]}
                >
                  Classes
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text
                  style={[styles.statValue, { color: theme.colors.primary }]}
                >
                  {stats.students}
                </Text>
                <Text
                  style={[styles.statLabel, { color: theme.colors.primary }]}
                >
                  Students
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text
                  style={[styles.statValue, { color: theme.colors.primary }]}
                >
                  7
                </Text>
                <Text
                  style={[styles.statLabel, { color: theme.colors.primary }]}
                >
                  Hours/Week
                </Text>
              </View>
            </View> */}
          </Card>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Button
              title="Schedule"
              onPress={() => navigation.navigate("Schedule")}
              icon="calendar"
              style={styles.quickAction}
              type="outline"
            />
          </View>

          {/* Today's Classes - Timetable */}
          <View style={styles.sectionHeader}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.primary }]}
            >
              Today's Schedule
            </Text>
          </View>

          {todayTimetable.length > 0 ? (
            <Card style={styles.timetableCard}>
              {todayTimetable.map((item, index) =>
                renderTimetableItem(item, index)
              )}
            </Card>
          ) : (
            <Card style={styles.noClassesCard}>
              <Text style={styles.noClassesText}>No classes today!</Text>
            </Card>
          )}
        </ScrollView>
      </Animated.View>

      {loading && (
        <View style={styles.loader}>
          <Loader size={60} />
          <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
            Refreshing data...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    padding: 8,
    paddingBottom: 32,
  },
  welcomeCard: {
    padding: 24,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 0,
    backgroundColor: "#FFFFFF",
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  welcomeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#000000",
  },
  nameText: {
    fontSize: 22,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#000000",
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFD700",
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 0,
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  departmentText: {
    fontSize: 15,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#000000",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 0,
    backgroundColor: "#FFD700",
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  statItem: {
    alignItems: "center",
    padding: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#000000",
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#000000",
  },
  quickActions: {
    flexDirection: "column",
    gap: 16,
    marginBottom: 24,
  },
  quickAction: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#000000",
  },
  seeAll: {
    fontSize: 18,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#000000",
  },
  timetableCard: {
    padding: 20,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 0,
    backgroundColor: "#FFFFFF",
    transform: [{ translateX: -2 }, { translateY: -2 }],
    overflow: "hidden",
  },
  timetableItem: {
    padding: 16,
    borderBottomWidth: 3,
    borderBottomColor: "#000000",
    backgroundColor: "#FFFFFF",
  },
  breakItem: {
    backgroundColor: "#FFFACD",
  },
  freeItem: {
    backgroundColor: "#F5F5F5",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#000000",
    marginBottom: 4,
  },
  subjectText: {
    fontSize: 18,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#000000",
  },
  detailText: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#000000",
    marginTop: 4,
  },
  announcementCard: {
    marginBottom: 16,
    padding: 20,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 0,
    backgroundColor: "#FFFFFF",
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  announcementTitle: {
    fontSize: 20,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 12,
    color: "#000000",
  },
  announcementContent: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000000",
  },
  announcementTime: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    alignSelf: "flex-end",
    color: "#000000",
  },
  gradingCard: {
    padding: 20,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 0,
    backgroundColor: "#FFFFFF",
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  gradingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    backgroundColor: "white",
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  gradingInfo: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
  },
  gradingTitle: {
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#000000",
  },
  gradingDue: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#000000",
  },
  gradeButton: {
    padding: 0,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 0,
    backgroundColor: "#FFFFFF",
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(245,245,245,0.9)",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#000000",
  },
});

export default Dashboard;
