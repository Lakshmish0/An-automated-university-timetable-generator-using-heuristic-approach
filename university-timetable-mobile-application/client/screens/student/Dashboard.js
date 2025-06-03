import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../config/theme";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Header from "../../components/common/Header";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = ({ navigation }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("today");
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const [todaysClassesFormatted, setTodaysClassesFormatted] = useState([]); // Initial state

  const allUpcomingClasses = [
    {
      id: "1",
      course: "Data Structures and Algorithms",
      time: "9:00 AM",
      room: "CS-202",
      teacher: "Dr. Rama Satish",
    },
    {
      id: "2",
      course: "Operating System",
      time: "10:00 PM",
      room: "CS-205",
      teacher: "Prof. Kavya M",
    },
    {
      id: "3",
      course: "Machine Learning",
      time: "11:00 AM",
      room: "CS-215",
      teacher: "Dr. Harsha S",
    },
    {
      id: "4",
      course: "Computer Networks",
      time: "2:00 PM",
      room: "CS-201",
      teacher: "Prof. Vani Z",
    },
  ];

  const { user: authUser } = useAuth();

  const [user, setUser] = useState({
    name: "Student",
    email: "Student@gmail.com",
    role: "Student",
  });

  useEffect(() => {
    if (authUser) {
      setUser((prev) => ({
        ...prev,
        name: authUser.name || prev.name,
        email: authUser.email || prev.email,
        role: authUser.role || prev.role,
      }));
      fetchTimetable(authUser.email);
    }
  }, [authUser]);

  

  const fetchTimetable = async (email) => {
  try {

    const userJson = await AsyncStorage.getItem('user');
    if (!userJson) {
      throw new Error('User not found in storage');
    }

    const user = JSON.parse(userJson);
    const token = user.token;
    console.log("Sending token:", token);

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}:3000/api/student/timetable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include token here
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch timetable');
    }

    const data = await response.json();
    console.log(data)
    setTodaysClassesFormatted(data.data || []);
  } catch (error) {
    console.error('Error fetching timetable:', error);
  }
};

  // useEffect(() => {
  //   // Set todaysClassesFormatted to allUpcomingClasses directly
  //   setTodaysClassesFormatted(allUpcomingClasses);
  // }, []); 

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: "#F5F5F5" }]}>
      <Header
        title="Dashboard"
        rightIcon="refresh"
        onRightPress={handleRefresh}
        style={styles.header}
      />

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Welcome Card */}
          <Card style={styles.welcomeCard}>
            <View style={styles.welcomeContent}>
              <View>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.nameText}>{user.name}</Text>
              </View>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="school"
                  size={40}
                  color="#000000"
                />
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>Department</Text>
                <Text style={styles.statLabel}>Artificial Intelligence &</Text>
                <Text style={styles.statLabel}>Machine Learning</Text>
              </View>
              {/* <View style={styles.statItem}>
                <Text style={styles.statValue}>7</Text>
                <Text style={styles.statLabel}>Department</Text>
              </View> */}
            </View>
          </Card>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Button
              title="Timetable"
              onPress={() => navigation.navigate("Timetable")}
              icon="calendar"
              style={styles.quickAction}
              textStyle={styles.buttonText}
              type="outline"
            />
          </View>

          {/* Today's Classes */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
          </View>
          {todaysClassesFormatted.length > 0 ? (
            <View style={styles.timetableGrid}>
              <View style={styles.timetableRow}>
                <Text style={[styles.timetableHeaderCell, { flex: 1 }]}>
                  Time
                </Text>
                <Text style={[styles.timetableHeaderCell, { flex: 1 }]}>
                  Course
                </Text>
                {/* <Text style={[styles.timetableHeaderCell, { flex: 1 }]}>
                  Room
                </Text> */}
              </View>
              {todaysClassesFormatted.map(
                (
                  item // Changed to use todaysClassesFormatted
                ) => (
                  <View key={item.id} style={styles.timetableRow}>
                    <Text style={[styles.timetableCell, { flex: 1 }]}>
                      {item.time}
                    </Text>
                    <Text style={[styles.timetableCell, { flex: 1 }]}>
                      {item.course}
                    </Text>
                    {/* <Text style={[styles.timetableCell, { flex: 1 }]}>
                      {item.room}
                    </Text> */}
                  </View>
                )
              )}
            </View>
          ) : (
            <Card style={styles.noClassesCard}>
              <Text style={styles.noClassesText}>No classes today!</Text>
            </Card>
          )}
         
            <View style={styles.welcomeContent}>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
              </View>
            </View>
          
        </ScrollView>
      </Animated.View>

      {loading && (
        <View style={styles.loader}>
          <Loader size={60} />
          <Text style={styles.loadingText}>Refreshing data...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeCard: {
    padding: 14,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 0,
    backgroundColor: "#FFFFFF",
    transform: [{ translateX: -4 }, { translateY: -4 }],
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
    color: "#000000",
    textTransform: "uppercase",
  },
  nameText: {
    fontSize: 23,
    fontWeight: "900",
    color: "#000000",
    textTransform: "uppercase",
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
  },
  statValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#000000",
  },
  statLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    textTransform: "uppercase",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 24,
    gap: 16,
  },
  quickAction: {
    flex: 1,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 0,
    backgroundColor: "#FFFFFF",
    transform: [{ translateX: -2 }, { translateY: -2 }],
    padding: 10,
  },
  buttonText: {
    fontSize: 30,
    fontWeight: "500",
    color: "#000000",
    textTransform: "uppercase",
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
    color: "#BB86FC",
    textTransform: "uppercase",
  },
  seeAllButton: {
    padding: 8,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 0,
    backgroundColor: "#FFD700",
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000000",
    textTransform: "uppercase",
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
    color: "#000000",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  announcementContent: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  announcementTime: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    alignSelf: "flex-end",
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "900",
    color: "#000000",
    textTransform: "uppercase",
  },
  timetableGrid: {
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 0,
    backgroundColor: "#FFFFFF",
    transform: [{ translateX: -2 }, { translateY: -2 }],
    padding: 8,
  },
  timetableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  timetableHeaderCell: {
    fontWeight: "900",
    fontSize: 16,
    color: "#000000",
    paddingHorizontal: 8,
    textTransform: "uppercase",
  },
  timetableCell: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    paddingHorizontal: 8,
  },
  noClassesCard: {
    padding: 20,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 0,
    backgroundColor: "#FFFFFF",
    transform: [{ translateX: -2 }, { translateY: -2 }],
    alignItems: "center",
  },
  noClassesText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000000",
    textTransform: "uppercase",
  },
});

export default Dashboard;
