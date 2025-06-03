import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../config/theme';

const Header = ({ title, onBack, rightIcon, onRightPress, scrollY }) => {
  const theme = useTheme();
  const headerHeight = useRef(new Animated.Value(100)).current;
  const titleOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (scrollY) {
      const headerShrink = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [100, 60],
        extrapolate: 'clamp',
      });

      const titleFade = scrollY.interpolate({
        inputRange: [0, 60],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });

      headerHeight.setValue(headerShrink);
      titleOpacity.setValue(titleFade);
    }
  }, [scrollY]);

  return (
    <Animated.View style={[styles.container, { 
      height: headerHeight,
      backgroundColor: theme.colors.primary,
      borderBottomColor: theme.colors.border,
    }]}>
      <View style={styles.content}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.icon}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.Primary} />
          </TouchableOpacity>
        )}
        
        <Animated.Text 
          style={[
            styles.title, 
            { 
              color: theme.colors.onPrimary,
              opacity: titleOpacity 
            }
          ]}
          numberOfLines={1}
        >
          {title}
        </Animated.Text>
        
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} style={styles.icon}>
            <Ionicons name={rightIcon} size={24} color={theme.colors.Primary} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

// ... keep existing imports and component logic ...

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 3,
    borderColor: '#000000',
    justifyContent: 'flex-end',
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 24,
    color: '#000000',
  },
  icon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 0,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
});

export default Header;