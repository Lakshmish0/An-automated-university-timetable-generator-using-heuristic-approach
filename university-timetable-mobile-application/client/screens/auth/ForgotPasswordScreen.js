// screens/auth/ForgotPasswordScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../config/theme';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const ForgotPasswordScreen = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Implement password reset logic here
    alert(`Password reset link sent to ${email}`);
    navigation.goBack();
  };

  return (
    <View style={[styles.container,]}>
      <Card style={styles.card}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          RESET PASSWORD
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.placeholder }]}>
          Enter your email to receive a reset link
        </Text>

        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          icon="email"
          style={styles.input}
        />

        <Button
          title="SEND RESET LINK"
          onPress={handleResetPassword}
          style={styles.button}
          disabled={!email}
        />

        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          
        >
          <Text style={[styles.backText, { color: theme.colors.primary }]}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  card: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#000000',
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  input: {
    marginBottom: 20,
    // borderWidth: 3,
    // borderColor: '#000000',
    // borderRadius: 0,
  },
  button: {
    marginTop: 16,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFD700',
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  backButton: {
    marginTop: 20,
    padding: 12,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  backText: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;