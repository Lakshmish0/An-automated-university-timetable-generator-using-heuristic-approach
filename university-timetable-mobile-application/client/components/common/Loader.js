import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../../config/theme';

const Loader = ({ size = 40, color }) => {
  const theme = useTheme();
  const spinValue = new Animated.Value(0);
  
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const loaderColor = color || theme.colors.primary;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.loader, { 
          width: size,
          height: size,
          borderRadius: 0, // No border radius for a sharp look
          borderColor: '#000000', // Thick black border
          borderTopColor: loaderColor,
          transform: [{ rotate: spin }],
        }]}>
        <View style={[styles.innerDot, {
          backgroundColor: loaderColor,
          width: size / 4,
          height: size / 4,
          borderRadius: 0, // No border radius for a sharp look
        }]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    borderWidth: 3, // Thick border for a bold appearance
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    position: 'absolute',
    borderRadius: 0, // No border radius for a sharp look
  },
});

export default Loader;