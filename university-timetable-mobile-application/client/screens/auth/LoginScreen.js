import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "../../config/theme";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../context/AuthContext";


const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const dummyUsers = [
    { email: "student@example.com", password: "student123", role: "student" },
    { email: "teacher@example.com", password: "teacher123", role: "teacher" },
  ];

  const handleLogin = async () => {
  setLoading(true);

  try {
    
    console.log(process.env.EXPO_PUBLIC_API_URL)
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}:3000/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data)
    if (response.ok) {
      // Assuming the response returns user role and name
      console.log(data.accessToken)
      await login({
        email: data.user.email, 
        role: data.user.role,
        name: data.user.name,
        token: data.accessToken
      });
    } else {
      Alert.alert("Login Failed", data.message || "Invalid email or password", [
        { text: "OK", onPress: () => setLoading(false) },
      ]);
    }
  } catch (error) {
    Alert.alert("Login Error", "An error occurred during login", [
      { text: "OK", onPress: () => setLoading(false) },
    ]);
  } finally {
    setLoading(false);
  }
};

  // const fillTestCredentials = (role) => {
  //   const user = dummyUsers.find((u) => u.role === role);
  //   if (user) {
  //     setEmail(user.email);
  //     setPassword(user.password);
  //   }
  // };

  return (
    <View  style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Card style={styles.card}>
          <Text style={[styles.title, { }]}>
          </Text>
          <Image
            source={require("../../assets/images/logo.webp")}
            style={[styles.logo, { alignSelf: 'center' }]}
            resizeMode="contain"
          />
          <Text style={[styles.subtitle, { color: theme.colors.primary }]}>
            Sign in to your account
          </Text>

          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="email"
            style={styles.input}
          />

          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureEntry}
            icon="lock"
            rightIcon={secureEntry ? "eye-off" : "eye"}
            onRightIconPress={() => setSecureEntry(!secureEntry)}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={[styles.forgotText, { color: theme.colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleLogin}
            style={styles.button}
            disabled={!email || !password}
          />
          <View style={styles.footer}>
            <Text
              style={[styles.footerText, { color: theme.colors.onPrimary }]}
            >
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text
                style={[styles.footerLink, { color: theme.colors.primary }]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </Animated.View>

      {loading && (
        <View style={styles.loader}>
          <Loader size={60} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Signing you in...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    paddingBottom: 10, // Light gray background
  },
  logo: {
    width: 60,
    height: 60,
    position: "absolute",
    top: "2%", // Center vertically
    left: "46%", // Center horizontally
  },
  content: {
    padding: 24,
  },
  card: {
    padding: 24,
    borderRadius: 0, // Sharp corners
    backgroundColor: "#FFFFFF",
    borderWidth: 4, // Thick border
    borderColor: "#000000",
    shadowColor: "#000",
    shadowOffset: {
      width: 8, // Offset shadow
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    transform: [{ translateX: -4 }, { translateY: -4 }], // Offset the card
  },
  title: {
    fontSize: 32, // Larger font
    fontWeight: "900", // Extra bold
    textAlign: "center",
    marginBottom: 8,
    textTransform: "uppercase", // All caps
    color: 'white',
  },
  subtitle: {
    fontSize: 32,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 14,
    fontWeight: "600",
  },
  input: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    // borderWidth: 3, // Thick border for inputs
    // borderColor: "#000000",
    // borderRadius: 0,
  },
  forgotText: {
    textAlign: "right",
    marginBottom: 15,
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  button: {
    marginTop: 18,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 0,
    backgroundColor: "#FFD700", // Bold yellow
    transform: [{ translateX: -4 }, { translateY: -4 }], // Offset button
  },

  testText: {
    textAlign: "center",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "700",
  },
  testButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  testButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderWidth: 3,
    borderColor: "#000000",
    borderRadius: 0,
    backgroundColor: "#FFFFFF",
  },
  testButtonText: {
    color: "black",
    fontSize: 12,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "900",
    marginLeft: 4,
    textDecorationLine: "underline",
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "700",
  },
});

export default LoginScreen;
