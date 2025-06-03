import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import Header from "../../components/common/Header";
import TimetableDisplay from "../../components/student/TimetableDisplay";
import Loader from "../../components/common/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const TimetableScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [timetableData, setTimetableData] = useState([]);

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
        `${process.env.EXPO_PUBLIC_API_URL}:3000/api/student/week_timetable`,
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
      setTimetableData(data.timetable); // Ensure backend sends `timetable` as key
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "#F5F5F5" }]}>
      <Header
        title="My Timetable"
        onBack={() => navigation.goBack()}
        rightIcon="refresh"
        onRightPress={handleRefresh}
        style={styles.header}
      />

      <TimetableDisplay timetableData={timetableData} />

      {loading && (
        <View style={styles.loader}>
          <Loader size={60} />
          <Text style={styles.loadingText}>Updating timetable...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 3,
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
    transform: [{ translateY: -4 }],
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
});

export default TimetableScreen;
