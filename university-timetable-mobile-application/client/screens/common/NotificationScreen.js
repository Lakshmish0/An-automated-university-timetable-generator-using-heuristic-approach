import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';
import Card from '../../components/common/Card.js';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import Loader from '../../components/common/Loader';

const NotificationScreen = ({ navigation }) => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'academic', label: 'Academic' },
    { id: 'system', label: 'System' },
  ];

  useEffect(() => {
    loadNotifications();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadNotifications = () => {
    // Simulate API call
    setTimeout(() => {
      const mockNotifications = [
        {
          id: '1',
          title: 'Class Rescheduled',
          message: 'CS101 lecture on Monday has been moved to 2:00 PM',
          type: 'academic',
          time: '2 hours ago',
          read: false,
          icon: 'calendar-clock',
        },
        {
          id: '2',
          title: 'New Assignment',
          message: 'Assignment 2 for DS202 has been posted',
          type: 'academic',
          time: '5 hours ago',
          read: true,
          icon: 'note-plus',
        },
        {
          id: '3',
          title: 'System Maintenance',
          message: 'The portal will be down for maintenance tonight from 1-3 AM',
          type: 'system',
          time: '1 day ago',
          read: true,
          icon: 'tools',
        },
        {
          id: '4',
          title: 'Grade Updated',
          message: 'Your grade for CS101 Midterm has been posted',
          type: 'academic',
          time: '2 days ago',
          read: false,
          icon: 'school',
        },
      ];
      setNotifications(mockNotifications);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const clearAll = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setNotifications([]);
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    return notification.type === selectedFilter;
  });

  const renderNotification = ({ item }) => (
    <TouchableOpacity onPress={() => markAsRead(item.id)}>
      <Card style={[
        styles.notificationCard,
        { 
          borderLeftWidth: 4,
          borderLeftColor: !item.read ? theme.colors.primary : 'transparent',
        }
      ]}>
        <View style={styles.notificationHeader}>
          <MaterialCommunityIcons 
            name={item.icon} 
            size={24} 
            color={theme.colors.primary} 
            style={styles.notificationIcon}
          />
          <View style={styles.notificationTitleContainer}>
            <Text style={[styles.notificationTitle, { color: theme.colors.primary }]}>
              {item.title}
            </Text>
            <Text style={[styles.notificationTime, { color: theme.colors.placeholder }]}>
              {item.time}
            </Text>
          </View>
          {!item.read && (
            <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]} />
          )}
        </View>
        <Text style={[styles.notificationMessage, { color: theme.colors.primary }]}>
          {item.message}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container,]}>
      <Header 
        title="Announcements" 
        onBack={() => navigation.goBack()} 
        rightIcon="refresh"
        onRightPress={clearAll}
      />

      <View style={styles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            onPress={() => setSelectedFilter(filter.id)}
            style={[
              styles.filterButton,
              { 
                backgroundColor: selectedFilter === filter.id 
                  ? theme.colors.primary 
                  : theme.colors.surface,
                borderColor: theme.colors.border,
              }
            ]}
          >
            <Text 
              style={[
                styles.filterText,
                { 
                  color: selectedFilter === filter.id 
                    ? theme.colors.onPrimary 
                    : theme.colors.primary,
                }
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader size={60} />
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {filteredNotifications.length > 0 ? (
            <FlatList
              data={filteredNotifications}
              renderItem={renderNotification}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[theme.colors.primary]}
                  tintColor={theme.colors.primary}
                />
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons 
                name="bell-off-outline" 
                size={60} 
                color={theme.colors.placeholder} 
              />
              <Text style={[styles.emptyText, { color: theme.colors.primary }]}>
                No notifications found
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.placeholder }]}>
                {selectedFilter === 'unread' 
                  ? "You're all caught up!" 
                  : "We'll notify you when there's something new"}
              </Text>
              <Button 
                title="Refresh" 
                onPress={handleRefresh} 
                type="outline" 
                style={styles.emptyButton} 
              />
            </View>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    flexWrap: 'wrap',
    borderBottomWidth: 3,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    transform: [{ translateY: -4 }],
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    margin: 4,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  filterText: {
    fontSize: 7,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 16,
  },
  notificationCard: {
    marginBottom: 16,
    padding: 20,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notificationIcon: {
    marginRight: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
  },
  notificationTitleContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
  notificationTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginTop: 4,
  },
  unreadBadge: {
    width: 12,
    height: 12,
    borderWidth: 3,
    borderColor: '#000000',
    backgroundColor: '#FFD700',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  notificationMessage: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: '#000000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F5F5F5',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
    marginTop: 24,
  },
  emptySubtext: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 32,
    width: '100%',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
    padding: 16,
  },
});

export default NotificationScreen;