import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user: authUser, logout } = useAuth();
  const theme = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    department: 'Artificial Intelligence and Machine Learning',
    role: 'Teacher', // Changed role to Teacher
    phone: '+1 (555) 123-4567',
    bio: 'Passionate educator with a focus on AI and Machine Learning',
  });
  const [tempUser, setTempUser] = useState({ ...user });
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (authUser) {
      setUser(prev => ({
        ...prev,
        name: authUser.name || prev.name,
        email: authUser.email || prev.email,
        role: authUser.role || prev.role
      }));
    }
  }, [authUser]);

  const handleEdit = () => {
    setEditMode(true);
    setTempUser({ ...user });
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setUser({ ...tempUser });
      setEditMode(false);
      setSaving(false);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }, 1500);
  };

  const handleCancel = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setEditMode(false);
      fadeAnim.setValue(1);
    });
  };

  const handleChange = (field, value) => {
    setTempUser(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <Header 
        title="My Profile" 
        onBack={() => navigation.goBack()} 
        rightIcon={editMode ? 'close' : 'pencil'}
        onRightPress={editMode ? handleCancel : handleEdit}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          style={[
            styles.profileContainer,
            { 
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            }
          ]}
        >
          {/* Profile Image Section */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarFrame}>
              <TouchableOpacity 
                style={styles.avatarWrapper}
                disabled={!editMode}
                onPress={() => console.log('Change photo')}
              >
                <Image 
                  source={require('../../assets/images/logo.webp')} 
                  style={styles.avatar}
                  resizeMode="contain"
                />
                {editMode && (
                  <View style={styles.avatarOverlay}>
                    <MaterialIcons 
                      name="edit" 
                      size={24} 
                      color="#FFFFFF" 
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {!editMode && (
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>Bio: {user.bio}</Text>
              </View>
            )}
          </View>

          {editMode ? (
            <Card style={styles.editForm}>
              <InputField
                label="Full Name"
                value={tempUser.name}
                onChangeText={(text) => handleChange('name', text)}
                icon="account"
                style={styles.input}
              />
              <InputField
                label="Email"
                value={tempUser.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                icon="email"
                style={styles.input}
              />
              <InputField
                label="Phone"
                value={tempUser.phone}
                onChangeText={(text) => handleChange('phone', text)}
                keyboardType="phone-pad"
                icon="phone"
                style={styles.input}
              />
              <InputField
                label="Department"
                value={tempUser.department}
                onChangeText={(text) => handleChange('department', text)}
                icon="domain"
                style={styles.input}
              />
              <InputField
                label="Bio"
                value={tempUser.bio}
                onChangeText={(text) => handleChange('bio', text)}
                multiline
                icon="text"
                style={styles.input}
              />

              <View style={styles.formButtons}>
                <Button 
                  title="Cancel" 
                  onPress={handleCancel} 
                  type="outline" 
                  style={styles.formButton} 
                />
                <Button 
                  title="Save Changes" 
                  onPress={handleSave} 
                  style={styles.formButton} 
                  loading={saving}
                />
              </View>
            </Card>
          ) : (
            <Card style={styles.profileInfo}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <MaterialCommunityIcons 
                    name="account" 
                    size={20} 
                    color={theme.colors.primary} 
                  />
                </View>
                <Text style={styles.infoText}>
                  {user.name}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <MaterialCommunityIcons 
                    name="email" 
                    size={20} 
                    color={theme.colors.primary} 
                  />
                </View>
                <Text style={styles.infoText}>
                  {user.email}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <MaterialCommunityIcons 
                    name="domain" 
                    size={20} 
                    color={theme.colors.primary} 
                  />
                </View>
                <Text style={styles.infoText}>
                  {user.department}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <MaterialCommunityIcons 
                    name="account" 
                    size={20} 
                    color={theme.colors.primary} 
                  />
                </View>
                <Text style={styles.infoText}>
                  {user.role}
                </Text>
              </View>
            </Card>
          )}

          {!editMode && (
            <>
              <Button 
                title="Change Password" 
                onPress={() => navigation.navigate('ForgotPassword')} 
                type="outline" 
                style={styles.actionButton}
              />
              <Button 
                title="Log Out" 
                onPress={handleLogout} 
                style={styles.actionButton}
                textStyle={{ color: theme.colors.error }}
                color={theme.colors.error}
                type="outline"
              />
            </>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileContainer: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  avatarFrame: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  avatarWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '80%',
    height: '80%',
  },
  avatarOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  roleBadge: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFD700',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  roleText: {
    alignContent: 'center',
    color: '#000000',
    fontWeight: '900',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  profileInfo: {
    width: '100%',
    padding: 16,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#F5F5F5',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  editForm: {
    width: '100%',
    padding: 24,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  input: {
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  formButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 16,
  },
  formButton: {
    flex: 1,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
    padding: 16,
  },
  actionButton: {
    marginTop: 16,
    width: '100%',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
    padding: 16,
  },
});

export default ProfileScreen;

