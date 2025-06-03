import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';
import * as yup from 'yup';
import { Formik } from 'formik';

const registerSchema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup.string().required('Please select your role'),
  usn: yup.string().when('role', {
    is: 'student',
    then: (schema) => schema
      .matches(/^[0-9][A-Za-z]{2}[0-9]{2}[A-Za-z]{2}[0-9]{3}$/, 'Invalid USN format')
      .required('USN is required for students'),
    otherwise: (schema) => schema.notRequired()
  }),
  phone: yup.string().when('role', {
    is: 'teacher',
    then: (schema) => schema
      .required('Please fill you phone number'),
    otherwise: (schema) => schema.notRequired()
  }),
});

const RegisterScreen = ({ navigation }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [secureEntry, setSecureEntry] = useState(true);
  const [confirmSecureEntry, setConfirmSecureEntry] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const roles = [
    { id: 'student', label: 'Student', icon: 'school' },
    { id: 'teacher', label: 'Teacher', icon: 'teach' },
  ];

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

const handleRegister = async (values) => {
  setLoading(true);

  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}:3000/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    console.log(values)
    const data = await response.json();

    if (response.ok) {
      // Success: navigate to Email Verification or Home
      alert(data.message || 'Registration Successfull');
    } else {
      // Handle server-side errors
      alert(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Error registering:', error);
    alert('Failed to connect to the server');
  } finally {
    setLoading(false);
  }
};

  const nextStep = () => {
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: '',
            usn: '',
            phone: '',
          }}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
            <Card style={styles.card}>
              <Text style={[styles.title, { color: theme.colors.primary }]}>
                Create Account
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.secondary }]}>
                {step === 1 ? 'Personal Information' : 'Account Details'}
              </Text>

              {step === 1 ? (
                <>
                  <InputField
                    label="Full Name"
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    error={touched.name && errors.name}
                    icon="account"
                    style={styles.input}
                  />

                  <InputField
                    label="Email Address"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    error={touched.email && errors.email}
                    keyboardType="email-address"
                    icon="email"
                    style={styles.input}
                  />

                  <View style={styles.roleContainer}>
                    <Text style={[styles.roleLabel, { color: theme.colors.placeholder }]}>
                      I am a:
                    </Text>
                    <View style={styles.roleButtons}>
                      {roles.map(role => (
                        <TouchableOpacity
                          key={role.id}
                          onPress={() => handleChange('role')(role.id)}
                          style={[
                            styles.roleButton,
                            { 
                              backgroundColor: values.role === role.id 
                                ? theme.colors.primary 
                                : theme.colors.surface,
                              borderColor: theme.colors.border,
                            }
                          ]}
                        >
                          <MaterialCommunityIcons 
                            name={role.icon} 
                            size={20} 
                            color={values.role === role.id ? theme.colors.onPrimary : theme.colors.text} 
                          />
                          <Text 
                            style={[
                              styles.roleButtonText,
                              { 
                                color: values.role === role.id 
                                  ? theme.colors.onPrimary 
                                  : theme.colors.text,
                              }
                            ]}
                          >
                            {role.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {touched.role && errors.role && (
                      <Text style={[styles.errorText, { color: theme.colors.error }]}>
                        {errors.role}
                      </Text>
                    )}
                  </View>

                  {values.role === 'student' && (
                    <InputField
                      label="USN"
                      value={values.usn}
                      onChangeText={handleChange('usn')}
                      onBlur={handleBlur('usn')}
                      error={touched.usn && errors.usn}
                      icon="numeric"
                      autoCapitalize="characters"
                      style={styles.input}
                    />
                  )}

                  {values.role === 'teacher' && (
                    <InputField
                      label="Phone Number"
                      value={values.phone}
                      onChangeText={handleChange('phone')}
                      onBlur={handleBlur('phone')}
                      error={touched.phone && errors.phone}
                      keyboardType="phone-pad"
                      icon="phone"
                    
                      style={styles.input}
                    />
                  )}

                  <Button 
                    title="Continue" 
                    onPress={nextStep} 
                    style={styles.button} 
                    disabled={
                      !values.name || 
                      !values.email || 
                      !values.role ||
                      errors.name || 
                      errors.email ||
                      (values.role === 'student' && (!values.usn || errors.usn)) ||
                      (values.role === 'teacher' && (!values.phone || errors.phone))
                    }
                  />
                </>
              ) : (
                <>
                  <InputField
                    label="Password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    error={touched.password && errors.password}
                    secureTextEntry={secureEntry}
                    icon="lock"
                    rightIcon={secureEntry ? 'eye-off' : 'eye'}
                    onRightIconPress={() => setSecureEntry(!secureEntry)}
                    style={styles.input}
                  />

                  <InputField
                    label="Confirm Password"
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    error={touched.confirmPassword && errors.confirmPassword}
                    secureTextEntry={confirmSecureEntry}
                    icon="lock-check"
                    rightIcon={confirmSecureEntry ? 'eye-off' : 'eye'}
                    onRightIconPress={() => setConfirmSecureEntry(!confirmSecureEntry)}
                    style={styles.input}
                  />

                  <View style={styles.stepButtons}>
                    <Button 
                      title="Back" 
                      onPress={prevStep} 
                      type="outline" 
                      style={[styles.stepButton, styles.primaryStepButton, {color: theme.colors.placeholder}, styles.stepButtonText ]}
                    />
                    <Button 
                      title="Create Account" 
                      onPress={handleSubmit} 
                      style={[styles.stepButton, styles.primaryStepButton, {color: theme.colors.placeholder}, styles.stepButtonText]}
                      disabled={!isValid || loading}
                    />
                  </View>
                </>
              )}

              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.colors.placeholder }]}>
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={[styles.footerLink, { color: theme.colors.primary }]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        </Formik>
      </Animated.View>

      {loading && (
        <View style={styles.loader}>
          <Loader size={60} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Creating your account...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
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
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 0,
    borderWidth: 3,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  roleButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  button: {
    marginTop: 8,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFD700',
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  stepButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 10,
  },
  stepButton: {
    flex: 1,
    padding: 16,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -4 }, { translateY: -4 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryStepButton: {
    backgroundColor: '#FFD700',
  },
  stepButtonText: {
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 4,
    textDecorationLine: 'underline',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default RegisterScreen;