import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../config/theme';

const Card = ({ title, subtitle, image, onPress, style, children }) => {
  const theme = useTheme();
  const parallaxAnim = useRef(new Animated.Value(0)).current;
  
  const handlePressIn = () => {
    Animated.spring(parallaxAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(parallaxAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const scale = parallaxAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.98],
  });

  const imageScale = parallaxAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        {image ? (
          <Animated.View style={[styles.imageContainer, { transform: [{ scale: imageScale }] }]}>
            <ImageBackground 
              source={image} 
              style={styles.image}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
              />
            </ImageBackground>
          </Animated.View>
        ) : null}

        {/* This will allow Card to render anything inside it */}
        <View style={styles.content}>
          {title && <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>}
          {subtitle && <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>{subtitle}</Text>}
          {children}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ... keep existing imports and component logic ...

const styles = StyleSheet.create({
  container: {},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#000000',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  imageContainer: {
    height: 160,
    borderBottomWidth: 3,
    borderColor: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#000000',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 8,
    color: '#000000',
  },
});

export default Card;
